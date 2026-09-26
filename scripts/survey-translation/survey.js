// Reads the French survey export and describes each column (kind, question stem, option label).
const XLSX = require('xlsx');
const { INPUT, isPersonal, isOpenEnded, isDate, norm } = require('./config');

function loadSurvey() {
    const wb = XLSX.readFile(INPUT);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const table = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const headers = table[0].map(h => String(h));
    const rows = table.slice(1).filter(r => r.some(c => String(c).trim() !== ''));

    const isEmpty = (i) => rows.every(r => String(r[i] ?? '').trim() === '');
    // Multi-select parents: another column is named "<parent>/<option>".
    // Options can contain "/" themselves (e.g. "ONG / Donateurs"), so try every slash.
    const headerSet = new Set(headers);
    const childOf = headers.map(h => {
        for (let cut = h.indexOf('/'); cut > 0; cut = h.indexOf('/', cut + 1)) {
            const parent = h.slice(0, cut);
            if (headerSet.has(parent)) return { parent, option: h.slice(cut + 1) };
        }
        return null;
    });
    const parents = new Set(childOf.filter(Boolean).map(c => c.parent));

    const columns = headers.map((header, i) => {
        let kind;
        if (isPersonal(header)) kind = 'personal';
        else if (isEmpty(i)) kind = 'empty';
        else if (isDate(header)) kind = 'date';
        else if (childOf[i]) kind = 'option';           // 0/1 column for one choice
        else if (parents.has(header)) kind = 'multi';   // combined text of the chosen options
        else if (isOpenEnded(header)) kind = 'open';
        else kind = 'answer';
        return {
            index: i,
            header,
            kind,
            stem: norm(childOf[i] ? childOf[i].parent : header),
            option: childOf[i] ? norm(childOf[i].option) : null,
        };
    });

    return { headers, rows, columns };
}

const isNumeric = (v) => typeof v === 'number' || (String(v).trim() !== '' && !isNaN(Number(String(v).trim())));

module.exports = { loadSurvey, isNumeric };
