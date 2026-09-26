// Step 4: summarise the anonymised Benin survey for the dashboard.
//   node scripts/survey-translation/aggregate-benin.js
// Reads data/data/LAMA_Glazoue_survey_EN.json (no personal data) and writes counts only —
// no individual answers — to src/app/dashboard/benin/beninData.json.
const fs = require('fs');
const path = require('path');
const { OUTPUT_JSON } = require('./config');

const OUT = path.resolve(__dirname, '../../src/app/dashboard/benin/beninData.json');
const survey = JSON.parse(fs.readFileSync(OUTPUT_JSON, 'utf8'));
const people = survey.respondents;
const question = (key) => survey.questions.find(q => q.key === key);

// Comparison groups (only 2 people are over 70, so they join 51–69)
const GROUPINGS = {
    gender: { label: 'Gender', of: (r) => r.A2, groups: [{ key: 'Woman', label: 'Women' }, { key: 'Man', label: 'Men' }] },
    age: {
        label: 'Age group',
        of: (r) => ({ '18–35 years': '18–35', '36–50 years': '36–50' }[r.A4] ?? '51+'),
        groups: [{ key: '18–35', label: '18–35 years' }, { key: '36–50', label: '36–50 years' }, { key: '51+', label: '51 years and over' }],
    },
};

const isAnswered = (v) => v !== null && v !== undefined && v !== 'N/A';

// Count answers for everyone and for each comparison group
function summarise(key, valueOf, type) {
    const tally = (subset) => {
        const counts = {};
        let base = 0;
        for (const r of subset) {
            const v = valueOf(r);
            if (!isAnswered(v)) continue;
            base++;
            for (const item of (Array.isArray(v) ? v : [v])) counts[item] = (counts[item] || 0) + 1;
        }
        return { base, counts };
    };
    const result = { key, type, overall: tally(people) };
    for (const [g, def] of Object.entries(GROUPINGS)) {
        result[g] = Object.fromEntries(def.groups.map(grp => [grp.key, tally(people.filter(r => def.of(r) === grp.key))]));
    }
    return result;
}

const fromQuestion = (key) => {
    const q = question(key);
    if (!q) throw new Error(`Unknown question ${key}`);
    return { question: q.question, ...summarise(key, r => r[key], q.type === 'multiple_choice' ? 'multi' : 'single') };
};

const questions = {};
const add = (key) => { questions[key] = fromQuestion(key); };

[
    'arrondissement_glazoue_commune', 'A3', 'A5', 'A6', 'A7',
    'B1', 'B1_if_yes_what_is_your_ownership_status', 'B3', 'B4', 'B7', 'B9', 'B9_if_yes', 'B10',
    'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'E1', 'E3', 'E4', 'E5', 'E7', 'E8', 'E9',
    'F1', 'F2', 'F3', 'F8', 'F10_1', 'F10_2', 'F10_3', 'F10_4', 'F10_5', 'F10_6', 'F10_7',
    'G1', 'G3', 'g_4_ranked_indicators_1st_choice', 'G6', 'G8', 'G9',
    'H1', 'H2', 'H5', 'I1',
].forEach(add);

// Land size: "Under 1 ha" (2 people) joins 1–5 ha
questions.B2_bands = {
    question: 'B-2. What is the size of your land? (hectares)',
    ...summarise('B2_bands', r => (r.B2 === 'Under 1 ha' || r.B2 === '1–5 ha' ? 'Up to 5 ha' : r.B2), 'single'),
};

// Access to finance was asked twice (the second copy in a later form version) — combine so everyone counts once
questions.H3_all = {
    question: 'H-3. Do you have access to financing?',
    note: 'Combines the two versions of this question in the survey form',
    ...summarise('H3_all', r => (isAnswered(r.H3) ? r.H3 : r.H3_v2), 'single'),
};

// Median annual farm income (FCFA) — medians resist the few very large values
const median = (values) => {
    const v = values.filter(x => typeof x === 'number').sort((a, b) => a - b);
    if (!v.length) return null;
    const mid = Math.floor(v.length / 2);
    return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
};
const income = { overall: median(people.map(r => r.B11)) };
for (const [g, def] of Object.entries(GROUPINGS)) {
    income[g] = Object.fromEntries(def.groups.map(grp => [grp.key, median(people.filter(r => def.of(r) === grp.key).map(r => r.B11))]));
}

const dates = people.map(r => r.survey_start).filter(Boolean).sort();
const data = {
    meta: {
        title: 'LAMA household survey — Glazoué, Benin',
        place: 'Glazoué commune, Collines department, Benin',
        respondents: people.length,
        fieldwork: { from: dates[0].slice(0, 10), to: dates[dates.length - 1].slice(0, 10) },
        source: 'Summarised from the anonymised English survey file (no personal data)',
        excluded: ['B-5 production in tonnes — contains impossible values (up to 400,000 t), likely a unit error'],
    },
    groupings: Object.fromEntries(Object.entries(GROUPINGS).map(([k, d]) => [k, {
        label: d.label,
        groups: d.groups.map(grp => ({ ...grp, n: people.filter(r => d.of(r) === grp.key).length })),
    }])),
    income,
    questions,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(data, null, 1));
console.log(`Wrote ${OUT} (${Object.keys(questions).length} questions, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
console.log('groups:', JSON.stringify(data.groupings.gender.groups), JSON.stringify(data.groupings.age.groups));
console.log('median income:', JSON.stringify(income));
console.log('H3 combined:', JSON.stringify(questions.H3_all.overall));
