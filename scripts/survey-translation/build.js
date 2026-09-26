// Step 2: write the English copy of the survey as Excel and JSON.
//   node scripts/survey-translation/build.js          → anonymised (personal data removed)
//   node scripts/survey-translation/build.js --full   → complete, including personal data (private, git-ignored)
// By default personal data is dropped, multi-select answers are rebuilt from their 0/1 columns,
// open-ended answers are translated with the original French kept alongside.
// The French original is never modified.
const fs = require('fs');
const XLSX = require('xlsx');
const { GLOSSARY, OUTPUT, OUTPUT_JSON, OUTPUT_FULL, OUTPUT_JSON_FULL, norm } = require('./config');
const { loadSurvey, isNumeric } = require('./survey');
const { openTranslator } = require('./open-answers');

const FULL = process.argv.includes('--full');
const { rows, columns } = loadSurvey();
const glossary = JSON.parse(fs.readFileSync(GLOSSARY, 'utf8'));
const translateOpen = openTranslator();
const untranslated = new Set();
const corrections = [];

const t = (fr) => {
    const key = norm(fr);
    if (key in glossary) return glossary[key];
    untranslated.add(key);
    return key;
};
const s = (v) => String(v ?? '').trim();
const codeOf = (stem) => (stem.match(/^([A-I])-\s?(\d+(?:-\d+)?)/) || []).slice(1).join('-') || null;
const slug = (text) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '').slice(0, 48).replace(/_+$/, '');

// Columns that go into the English file (personal ones only in --full, and only if they hold data)
const hasData = (c) => rows.some(r => s(r[c.index]) !== '');
const kept = columns.filter(c => c.kind !== 'empty' && (c.kind !== 'personal' || (FULL && hasData(c))));

// The export has one "Villages" column per arrondissement — merge them into one
const villageCols = kept.filter(c => /^villages$/i.test(c.stem));
const output = kept.filter(c => !villageCols.includes(c) || c === villageCols[0]);

// English headers. Ambiguous ones ("Other (specify)", "On health"…) get the code of the question they follow
let lastCode = null;
const headerFor = new Map();
const parentCode = new Map();
for (const col of output) {
    const code = codeOf(col.stem);
    if (code) lastCode = code;
    parentCode.set(col, col.kind === 'personal' && !code ? null : code ?? lastCode);
    let header;
    if (col.kind === 'option') header = `${code ?? lastCode} › ${t(col.option)}`;
    else if (!code && lastCode && /^(Autre|Si |Sur )/.test(col.stem)) header = `${lastCode} › ${t(col.stem)}`;
    else header = t(col.stem);
    headerFor.set(col, header);
}

// Every English header must be unique (C-2 has an option "On health" and a follow-up question "On health")
const used = new Set();
for (const col of output) {
    let header = headerFor.get(col);
    if (used.has(header)) {
        const base = col.kind === 'multi' ? `${header} — details`
            : /› Other/.test(header) ? `${header} — text`
                : `${header} (repeated in a later form version)`;
        header = base;
        for (let n = 2; used.has(header); n++) header = `${base} (${n})`;
        headerFor.set(col, header);
    }
    used.add(header);
}

// Option columns grouped by their multi-select question
const optionsByStem = {};
columns.filter(c => c.kind === 'option').forEach(c => { (optionsByStem[c.stem] ||= []).push(c); });

// A tick is "1". Any other stray value (e.g. "J") counts as ticked only if the written answer names the option.
function isTicked(opt, row) {
    const v = s(row[opt.index]);
    if (v === '1') return true;
    if (['', '0', 'NA'].includes(v)) return false;
    const parent = columns.find(c => c.kind === 'multi' && c.stem === opt.stem);
    const ticked = parent && norm(row[parent.index]).includes(opt.option);
    corrections.push(`Respondent ${s(row[0])}: "${opt.option}" tick cell contained "${v}" — ${ticked ? 'counted as ticked (the written answer names it)' : 'not counted'}`);
    return ticked;
}

// One value per column, as a structured answer (used for both Excel and JSON)
function answerFor(col, row) {
    const raw = row[col.index];
    const blank = s(raw) === '';

    if (villageCols[0] === col) {
        const v = villageCols.map(c => row[c.index]).find(x => s(x) !== '');
        return v === undefined ? null : t(v);
    }
    if (col.kind === 'date') return blank ? null : { serial: Number(raw) };
    if (col.kind === 'personal') {
        if (blank) return null;
        if (col.header.trim() === '_submission_time') return { serial: Number(raw) };
        if (/_(latitude|longitude|altitude|precision)$/.test(col.header.trim())) return Number(raw);
        return s(raw); // names, phone numbers, IDs kept exactly as recorded
    }
    if (col.kind === 'open') {
        if (blank) return null;
        const en = translateOpen(col.stem, raw);
        if (!en) untranslated.add(`[open] ${s(raw).slice(0, 60)}`);
        return { en: en ?? s(raw), fr: s(raw) };
    }
    if (col.kind === 'option') {
        if (blank || s(raw) === 'NA') return null;
        return isTicked(col, row) ? 1 : 0;
    }
    if (col.kind === 'multi') {
        const chosen = (optionsByStem[col.stem] || []).filter(o => isTicked(o, row));
        if (chosen.length) return chosen.map(o => t(o.option));
        if (s(raw) === 'NA') return 'N/A'; // follow-up not asked
        return blank ? null : [t(raw)];
    }
    if (blank) return null;
    return isNumeric(raw) ? Number(raw) : t(raw);
}

const answers = rows.map(row => output.map(col => answerFor(col, row)));
corrections.splice(0, corrections.length, ...new Set(corrections)); // answerFor runs isTicked more than once

/* ── Excel ─────────────────────────────────────────────────────── */
const excelColumns = [];
output.forEach((col, i) => {
    excelColumns.push({ col, i, header: headerFor.get(col), part: 'value' });
    if (col.kind === 'open') excelColumns.push({ col, i, header: `${headerFor.get(col)} (original French)`, part: 'fr' });
});

const toCell = (value, part) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join('; ');
    if (value.serial !== undefined) return { t: 'n', v: value.serial, z: 'yyyy-mm-dd hh:mm' };
    if (value.en !== undefined) return part === 'fr' ? value.fr : value.en;
    return value;
};

const header = excelColumns.map(c => c.header);
const body = answers.map(rowAnswers => excelColumns.map(c => toCell(rowAnswers[c.i], c.part)));

const wb = XLSX.utils.book_new();
const data = XLSX.utils.aoa_to_sheet([header, ...body]);
data['!cols'] = header.map(h => ({ wch: Math.min(Math.max(h.length, 12), 45) }));
XLSX.utils.book_append_sheet(wb, data, 'Survey (English)');

const letters = (col) => (col === villageCols[0] ? villageCols : [col]).map(c => XLSX.utils.encode_col(c.index)).join('+');
const guide = XLSX.utils.aoa_to_sheet([
    ['English column', 'Original French column', 'Type', 'Original Excel column'],
    ...excelColumns.map(({ col, header: h, part }) => [
        h,
        col === villageCols[0] ? 'Villages (merged from all arrondissements)' : col.header.trim(),
        part === 'fr' ? 'original-fr' : col.kind,
        letters(col),
    ]),
]);
guide['!cols'] = [{ wch: 60 }, { wch: 90 }, { wch: 12 }, { wch: 22 }];
XLSX.utils.book_append_sheet(wb, guide, 'Column guide');

const personalCols = columns.filter(c => c.kind === 'personal');
const removed = FULL ? [] : personalCols.map(c => c.header.trim());
const included = FULL ? output.filter(c => c.kind === 'personal').map(c => headerFor.get(c)) : [];
const notes = [
    '"Les femmes ont le même droit que les femmes" was read as a typo for "…que les hommes" (same rights as men)',
    '"Doyiwe" (other crop) is a local name that was not identified',
    'Open-ended answers were typed by enumerators, often with spelling mistakes; they were translated for meaning. Unclear text is marked [unclear], cut-off answers [answer cut off]',
    'CTPV = crop production technical advice (Conseil Technique en Production Végétale); CNCA = national agricultural credit bank',
    ...corrections,
];
const readme = XLSX.utils.aoa_to_sheet([
    [`LAMA household survey — Glazoué commune, Collines, Benin (English translation${FULL ? ', FULL — includes personal data' : ''})`],
    [''],
    ['Source', 'LAMA_22_06_26 (1).xlsx (French KoBo export). The original is unchanged.'],
    ['Respondents', rows.length],
    ['Columns', `${output.length} data columns + ${excelColumns.length - output.length} "original French" columns (from ${columns.length}; empty columns dropped, village columns merged)`],
    FULL
        ? ['Personal data', `INCLUDED (${included.length} columns: respondent name and phone, enumerator name and phone, GPS, photos, KoBo IDs). Keep this file private — do not publish or commit it.`]
        : ['Personal data removed', `${removed.length} columns: respondent name and phone, enumerator name and phone, GPS location, photos, system IDs`],
    ['Multiple-choice answers', 'Rebuilt in English from the 0/1 option columns, separated by "; "'],
    ['Open-ended answers', 'Translated to English; the original French is in the next column'],
    ['Place names', 'Department, commune, arrondissement and village names are kept in French'],
    ['Translations', 'scripts/survey-translation/glossary.fr-en.json and open-answers.en/ — edit and re-run build.js'],
    ...notes.map(n => ['Note', n]),
]);
readme['!cols'] = [{ wch: 26 }, { wch: 120 }];
XLSX.utils.book_append_sheet(wb, readme, 'README');
XLSX.writeFile(wb, FULL ? OUTPUT_FULL : OUTPUT, { compression: true });

/* ── JSON ──────────────────────────────────────────────────────── */
const keyFor = new Map();
const usedKeys = new Set();
for (const col of output) {
    const h = headerFor.get(col);
    const code = codeOf(col.stem);
    let key;
    if (col.kind !== 'option' && code && !h.includes('›')) key = code.replace(/-/g, '_').replace(/^([A-I])_/, '$1');
    else if (h.includes('›')) key = `${parentCode.get(col).replace(/-/g, '_').replace(/^([A-I])_/, '$1')}_${slug(h.split('›')[1])}`;
    else key = slug(h);
    if (/repeated in a later form version/.test(h)) key += '_v2';
    let unique = key;
    for (let n = 2; usedKeys.has(unique); n++) unique = `${key}_${n}`;
    usedKeys.add(unique);
    keyFor.set(col, unique);
}

// Options are listed on their question; their 0/1 columns are folded into the answer arrays
const jsonColumns = output.map((col, i) => ({ col, i })).filter(({ col }) => col.kind !== 'option');

const typeOf = (col, i) => {
    if (col.kind === 'multi') return 'multiple_choice';
    if (col.kind === 'open') return 'open_text';
    if (col.kind === 'date' || col.header.trim() === '_submission_time') return 'datetime';
    if (col.kind === 'personal') return answers.some(r => typeof r[i] === 'number') ? 'number' : 'text';
    const values = answers.map(r => r[i]).filter(v => v !== null);
    if (values.length && values.every(v => typeof v === 'number')) return 'number';
    return /›\s*(Other|If other)/.test(headerFor.get(col)) ? 'text' : 'single_choice';
};

const questions = jsonColumns.map(({ col, i }) => {
    const q = {
        key: keyFor.get(col),
        code: parentCode.get(col),
        question: headerFor.get(col),
        question_fr: col === villageCols[0] ? 'Villages' : col.header.trim(),
        type: typeOf(col, i),
    };
    if (col.kind === 'multi') {
        q.options = (optionsByStem[col.stem] || []).map(o => ({ en: t(o.option), fr: o.option }));
    }
    if (q.type === 'single_choice') {
        const counts = {};
        answers.forEach(r => { if (r[i] !== null) counts[r[i]] = (counts[r[i]] || 0) + 1; });
        q.answers = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([value, n]) => ({ value, n }));
    }
    if (q.type === 'open_text') q.note = 'Each answer has "en" (translation) and "fr" (original text)';
    return q;
});

const isoFromSerial = (serial) => {
    const d = XLSX.SSF.parse_date_code(serial);
    const p = (n) => String(n).padStart(2, '0');
    return `${d.y}-${p(d.m)}-${p(d.d)}T${p(d.H)}:${p(d.M)}:${p(Math.floor(d.S))}`;
};

const respondents = answers.map(rowAnswers => {
    const record = {};
    for (const { col, i } of jsonColumns) {
        const v = rowAnswers[i];
        if (v === 'N/A' && col.kind === 'multi') record[keyFor.get(col)] = null; // not applicable
        else record[keyFor.get(col)] = v && v.serial !== undefined ? isoFromSerial(v.serial) : v;
    }
    return record;
});

const json = {
    meta: {
        title: 'LAMA household survey — Glazoué commune, Collines, Benin',
        language: 'English (translated from French)',
        source: 'LAMA_22_06_26 (1).xlsx (French KoBo export)',
        respondents: rows.length,
        questions: questions.length,
        generated: new Date().toISOString().slice(0, 10),
        ...(FULL
            ? { personal_data_included: included, warning: 'Contains personal data (names, phone numbers, GPS). Keep private — do not publish or commit.' }
            : { personal_data_removed: removed }),
        notes,
        how_to_read: {
            multiple_choice: 'array of the chosen options (English); null when the question did not apply',
            open_text: '{ en, fr } — English translation and original French',
            datetime: 'local time as recorded on the tablet, ISO 8601 without time zone',
            null: 'no answer / not applicable',
        },
    },
    questions,
    respondents,
};
fs.writeFileSync(FULL ? OUTPUT_JSON_FULL : OUTPUT_JSON, JSON.stringify(json, null, 2));

console.log(`Wrote ${FULL ? OUTPUT_FULL : OUTPUT}`);
console.log(`Wrote ${FULL ? OUTPUT_JSON_FULL : OUTPUT_JSON}`);
console.log(`  ${rows.length} respondents × ${output.length} columns (${questions.length} questions in JSON)`);
console.log(`  personal columns removed: ${removed.length}`);
console.log(`  data corrections: ${corrections.length}`, corrections);
console.log(`  untranslated values: ${untranslated.size}`, [...untranslated].slice(0, 10));
