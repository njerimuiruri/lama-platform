// Step 1: list every unique French phrase that needs an English translation.
// Writes glossary.todo.json with only the phrases missing from glossary.fr-en.json.
const fs = require('fs');
const { GLOSSARY, TODO, norm } = require('./config');
const { loadSurvey, isNumeric } = require('./survey');

const { rows, columns } = loadSurvey();
const glossary = fs.existsSync(GLOSSARY) ? JSON.parse(fs.readFileSync(GLOSSARY, 'utf8')) : {};

const questions = new Set();
const options = new Set();
const answers = new Set();

for (const col of columns) {
    if (['personal', 'empty'].includes(col.kind)) continue;
    questions.add(col.stem);
    if (col.kind === 'option') options.add(col.option);
    if (col.kind === 'answer') {
        rows.forEach(r => {
            const v = r[col.index];
            if (String(v).trim() !== '' && !isNumeric(v)) answers.add(norm(v));
        });
    }
}

const missing = (set) => Object.fromEntries([...set].filter(s => !(s in glossary)).sort().map(s => [s, '']));
const todo = { questions: missing(questions), options: missing(options), answers: missing(answers) };
fs.writeFileSync(TODO, JSON.stringify(todo, null, 2));

const count = (o) => Object.keys(o).length;
console.log(`Columns: ${columns.length} total`);
for (const kind of ['personal', 'empty', 'date', 'multi', 'option', 'answer', 'open']) {
    console.log(`  ${kind.padEnd(9)} ${columns.filter(c => c.kind === kind).length}`);
}
console.log(`To translate: ${count(todo.questions)} questions, ${count(todo.options)} options, ${count(todo.answers)} answers`);
