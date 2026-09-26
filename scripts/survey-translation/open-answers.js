// Open-ended answers are translated by ID (e.g. "D3-017") instead of by their French text,
// so the long, typo-heavy answers never have to be retyped as lookup keys.
//   node scripts/survey-translation/open-answers.js   → writes open-answers.fr.json (IDs + French)
// English translations live in open-answers.en/*.json as { "D3-017": "English…" }.
const fs = require('fs');
const path = require('path');
const { loadSurvey } = require('./survey');

const FR_FILE = path.join(__dirname, 'open-answers.fr.json');
const EN_DIR = path.join(__dirname, 'open-answers.en');

// One answer = its non-empty lines, whitespace tidied
const normOpen = (v) => String(v).split(/\r?\n/).map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');

// Short, stable prefix per question: "D-3. …" → "D3", "Si oui, décrivez" → "C3a" etc.
const PREFIX = {
    'Si oui, décrivez': 'C3a',
    'Si partiellement, veuillez décrire': 'C3b',
    'Si oui, expliquez comment': 'E3a',
    'Si oui, quelle est votre vision': 'G2a',
};
function prefixFor(stem) {
    const special = Object.keys(PREFIX).find(k => stem.startsWith(k));
    if (special) return PREFIX[special];
    const m = stem.match(/^([A-I])-\s?(\d+)/);
    return m ? `${m[1]}${m[2]}` : 'X';
}

function buildIds() {
    const { rows, columns } = loadSurvey();
    const ids = {};
    for (const col of columns.filter(c => c.kind === 'open')) {
        const prefix = prefixFor(col.stem);
        const unique = [...new Set(rows.map(r => r[col.index]).filter(v => String(v).trim()).map(normOpen))].sort();
        unique.forEach((fr, i) => { ids[`${prefix}-${String(i + 1).padStart(3, '0')}`] = { question: col.stem, fr }; });
    }
    return ids;
}

function loadTranslations() {
    const en = {};
    if (!fs.existsSync(EN_DIR)) return en;
    for (const file of fs.readdirSync(EN_DIR).filter(f => f.endsWith('.json')).sort()) {
        Object.assign(en, JSON.parse(fs.readFileSync(path.join(EN_DIR, file), 'utf8')));
    }
    return en;
}

// Lookup used by build.js: (question stem, raw French cell) → English, or null if not translated yet
function openTranslator() {
    const ids = JSON.parse(fs.readFileSync(FR_FILE, 'utf8'));
    const en = loadTranslations();
    const byText = new Map(Object.entries(ids).map(([id, { question, fr }]) => [`${question}\u0000${fr}`, id]));
    return (stem, raw) => {
        const id = byText.get(`${stem}\u0000${normOpen(raw)}`);
        return id && en[id] ? en[id] : null;
    };
}

if (require.main === module) {
    const ids = buildIds();
    fs.writeFileSync(FR_FILE, JSON.stringify(ids, null, 1));
    const en = loadTranslations();
    const missing = Object.keys(ids).filter(id => !en[id]);
    console.log(`${Object.keys(ids).length} open answers, ${Object.keys(ids).length - missing.length} translated, ${missing.length} to go`);
}

module.exports = { openTranslator, normOpen };
