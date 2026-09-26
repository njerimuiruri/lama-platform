// Step 3: prove the English Excel and JSON match the French original — nothing lost, shifted or miscounted.
//   node scripts/survey-translation/verify.js
const fs = require('fs');
const XLSX = require('xlsx');
const { OUTPUT, OUTPUT_JSON, OUTPUT_FULL, OUTPUT_JSON_FULL, norm } = require('./config');
const FULL = process.argv.includes('--full');
const { loadSurvey } = require('./survey');
const { normOpen } = require('./open-answers');

const { rows, columns } = loadSurvey();
const s = (v) => String(v ?? '').trim();
const results = [];
const check = (name, ok, detail = '') => results.push({ name, ok, detail });

// Expected ticks: "1", or a stray value (e.g. "J") when the written answer names the option
const multiOf = (opt) => columns.find(c => c.kind === 'multi' && c.stem === opt.stem);
const expectedTick = (opt, row) => {
    const v = s(row[opt.index]);
    if (v === '1') return true;
    if (['', '0', 'NA'].includes(v)) return false;
    return norm(row[multiOf(opt).index]).includes(opt.option);
};
const personalValues = columns.filter(c => c.kind === 'personal')
    .flatMap(c => rows.map(r => s(r[c.index])).filter(v => v.length >= 6));

/* ── Excel ─────────────────────────────────────────────────────── */
const wb = XLSX.readFile(FULL ? OUTPUT_FULL : OUTPUT);
const guide = XLSX.utils.sheet_to_json(wb.Sheets['Column guide'], { header: 1 }).slice(1);
const [enHeader, ...enRows] = XLSX.utils.sheet_to_json(wb.Sheets['Survey (English)'], { header: 1, defval: '' });

const englishByIndex = new Map();
guide.filter(g => g[2] !== 'original-fr')
    .forEach(([enCol, , , letters]) => String(letters).split('+').forEach(l => englishByIndex.set(XLSX.utils.decode_col(l), enCol)));
const colOf = (c) => enHeader.indexOf(englishByIndex.get(c.index));

check('Excel: same number of respondents', enRows.length === rows.length, `${enRows.length} vs ${rows.length}`);
check('Excel: rows in the same order', enRows.every((r, i) => s(r[0]) === s(rows[i][0])));
const hasData = (c) => rows.some(r => s(r[c.index]) !== '');
const lost = columns.filter(c => c.kind !== 'empty' && (c.kind !== 'personal' || FULL) && hasData(c) && !englishByIndex.has(c.index));
check('Excel: no data column lost', lost.length === 0, lost.map(c => c.header).join(' | ') || 'all accounted for');

let tickDiff = 0, ticks = 0;
for (const c of columns.filter(c => c.kind === 'option')) {
    const j = colOf(c);
    rows.forEach((r, i) => {
        const want = expectedTick(c, r);
        if (want) ticks++;
        if (want !== (s(enRows[i][j]) === '1')) tickDiff++;
    });
}
check('Excel: every tick preserved', tickDiff === 0, `${ticks} ticks, ${tickDiff} differences`);

let dropped = 0;
for (const c of columns.filter(c => ['answer', 'open', 'multi', 'date'].includes(c.kind))) {
    const j = colOf(c);
    rows.forEach((r, i) => { if (s(r[c.index]) !== '' && s(enRows[i][j]) === '') dropped++; });
}
check('Excel: no answers dropped', dropped === 0, `${dropped} filled French cells became empty`);

let stillFrench = 0;
for (const c of columns.filter(c => c.kind === 'open')) {
    const j = colOf(c);
    rows.forEach((r, i) => { if (s(r[c.index]) && s(enRows[i][j]) === s(r[c.index])) stillFrench++; });
}
check('Excel: open answers translated', stillFrench === 0, `${stillFrench} left in French`);

const excelBlob = JSON.stringify(enRows);
if (!FULL) check('Excel: no personal data', !personalValues.some(v => excelBlob.includes(v)), `${personalValues.length} personal values searched`);

/* ── JSON ──────────────────────────────────────────────────────── */
const json = JSON.parse(fs.readFileSync(FULL ? OUTPUT_JSON_FULL : OUTPUT_JSON, 'utf8'));
const keyByIndex = new Map();
const qByKey = new Map(json.questions.map(q => [q.key, q]));
// Map each French column to its JSON key through the English header
const jsonKeyByHeader = new Map(json.questions.map(q => [q.question, q.key]));
for (const [idx, enCol] of englishByIndex) if (jsonKeyByHeader.has(enCol)) keyByIndex.set(idx, jsonKeyByHeader.get(enCol));

check('JSON: same number of respondents', json.respondents.length === rows.length, `${json.respondents.length} vs ${rows.length}`);
const allKeys = json.questions.map(q => q.key);
check('JSON: every respondent has every question', json.respondents.every(r => allKeys.every(k => k in r)), `${allKeys.length} keys each`);
check('JSON: question keys unique', new Set(allKeys).size === allKeys.length);

let multiDiff = 0, jsonTicks = 0;
for (const parent of columns.filter(c => c.kind === 'multi')) {
    const key = keyByIndex.get(parent.index);
    const opts = columns.filter(o => o.kind === 'option' && o.stem === parent.stem);
    rows.forEach((r, i) => {
        const want = opts.filter(o => expectedTick(o, r)).length;
        const got = Array.isArray(json.respondents[i][key]) ? json.respondents[i][key].length : 0;
        jsonTicks += got;
        if (want && want !== got) multiDiff++;
    });
}
check('JSON: multiple-choice arrays match ticks', multiDiff === 0, `${jsonTicks} chosen options, ${multiDiff} differences`);

const villageCols = columns.filter(c => /^villages$/i.test(c.stem));
let answerDiff = 0;
for (const c of columns.filter(c => ['answer', 'date', 'open'].includes(c.kind))) {
    const key = keyByIndex.get(c.index);
    if (!key || villageCols.includes(c)) continue; // merged village columns are checked below
    rows.forEach((r, i) => {
        const filled = s(r[c.index]) !== '';
        const v = json.respondents[i][key];
        if (filled !== (v !== null && v !== undefined)) answerDiff++;
        if (c.kind === 'answer' && filled && !isNaN(Number(s(r[c.index]))) && v !== Number(r[c.index])) answerDiff++;
        if (c.kind === 'open' && filled && (!v || v.fr !== s(r[c.index]) || normOpen(v.en) === normOpen(r[c.index]))) answerDiff++;
    });
}
check('JSON: answers, numbers and open text intact', answerDiff === 0, `${answerDiff} differences`);

const villageKey = keyByIndex.get(villageCols[0].index);
const villageDiff = rows.filter((r, i) => {
    const fr = villageCols.map(c => s(r[c.index])).find(Boolean) || null;
    return (fr === null) !== (json.respondents[i][villageKey] === null);
}).length;
check('JSON: village kept for everyone who had one', villageDiff === 0, `${villageDiff} differences`);

const jsonBlob = JSON.stringify(json);
if (!FULL) check('JSON: no personal data', !personalValues.some(v => jsonBlob.includes(v)), `${personalValues.length} personal values searched`);
else {
    // Every personal value present and identical, in both files
    let excelDiff = 0, jsonDiff = 0, cells = 0;
    for (const c of columns.filter(c => c.kind === 'personal' && hasData(c))) {
        const j = colOf(c);
        const key = keyByIndex.get(c.index);
        const isDate = c.header.trim() === '_submission_time';
        rows.forEach((r, i) => {
            const fr = s(r[c.index]);
            if (!fr) return;
            cells++;
            if (!isDate && s(enRows[i][j]) !== fr) excelDiff++;
            const v = json.respondents[i][key];
            if (isDate ? !v : s(v) !== fr) jsonDiff++;
        });
    }
    check('Excel: personal data complete and exact', excelDiff === 0, `${cells} values, ${excelDiff} differences`);
    check('JSON: personal data complete and exact', jsonDiff === 0, `${cells} values, ${jsonDiff} differences`);
}
check('JSON: open-text questions typed', json.questions.filter(q => q.type === 'open_text').length === columns.filter(c => c.kind === 'open').length);

let failed = 0;
for (const r of results) {
    if (!r.ok) failed++;
    console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name.padEnd(46)} ${r.detail}`);
}
console.log(failed ? `\n${failed} check(s) failed` : '\nAll checks passed');
process.exitCode = failed ? 1 : 0;
