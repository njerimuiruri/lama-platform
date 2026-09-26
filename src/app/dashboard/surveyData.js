// Community survey (FGD) results shown on the interactive dashboard.
// All figures come from the LAMA community survey of 554 respondents.

export const RESPONDENTS = 554;

// Colours validated with the dataviz palette checker (light surface):
// gender pair passes all checks; age trio passes CVD all-pairs, but yellow and pink
// sit below 3:1 contrast, so every bar also carries a visible value label + table view.
export const GROUPINGS = {
    gender: {
        label: 'Gender',
        groups: [
            { key: 'Female', label: 'Women', n: 281, color: '#2a78d6' },
            { key: 'Male', label: 'Men', n: 273, color: '#eb6834' },
        ],
    },
    age: {
        label: 'Age group',
        groups: [
            { key: 'Adults', label: 'Adults', n: 145, color: '#4a3aa7' },
            { key: 'Elderly', label: 'Elderly', n: 257, color: '#eda100' },
            { key: 'Youth', label: 'Youth', n: 152, color: '#e87ba4' },
        ],
    },
};

// Single-series bars use the brand green; ordered categories use validated green ramps
export const BRAND = '#0d9c5a';
export const ORDINAL_3 = ['#10b981', '#047857', '#064e3b'];
export const ORDINAL_4 = ['#4fc995', '#16a372', '#0b7a53', '#07523a'];

/* ── Land ownership ───────────────────────────────────────────── */
export const landOwnership = {
    Female: { owns: 256, total: 281 },
    Male: { owns: 250, total: 273 },
    Adults: { owns: 134, total: 145 },
    Elderly: { owns: 249, total: 257 },
    Youth: { owns: 123, total: 152 },
};

export const landSizeBands = ['Under 1 acre', '1–5 acres', '6–10 acres', '11–15 acres'];
// Land size among land owners, counts per band (same order as landSizeBands)
export const landSize = {
    Female: [113, 125, 13, 5],
    Male: [93, 133, 22, 2],
    Adults: [51, 74, 6, 3],
    Elderly: [96, 126, 24, 3],
    Youth: [59, 58, 5, 1],
};

/* ── Farming systems ──────────────────────────────────────────── */
export const farmingTypes = [
    { key: 'Subsistence', label: 'Food for the household' },
    { key: 'Both', label: 'Food and some for sale' },
    { key: 'Commercial', label: 'Mainly for sale' },
];
export const farming = {
    Female: { Subsistence: 169, Both: 100, Commercial: 12 },
    Male: { Subsistence: 149, Both: 101, Commercial: 23 },
    Adults: { Subsistence: 81, Both: 53, Commercial: 11 },
    Elderly: { Subsistence: 158, Both: 87, Commercial: 12 },
    Youth: { Subsistence: 79, Both: 61, Commercial: 12 },
};

/* ── Priority sectors (respondents could name more than one) ─── */
export const prioritySectors = [
    { label: 'Agriculture', Female: 271, Male: 268, Adults: 140, Elderly: 251, Youth: 148 },
    { label: 'Water security', Female: 164, Male: 159, Adults: 84, Elderly: 147, Youth: 92 },
    { label: 'Forestry', Female: 123, Male: 127, Adults: 60, Elderly: 114, Youth: 76 },
    { label: 'Health', Female: 124, Male: 97, Adults: 61, Elderly: 100, Youth: 60 },
    { label: 'Energy', Female: 55, Male: 70, Adults: 33, Elderly: 56, Youth: 36 },
    { label: 'Climate governance', Female: 55, Male: 65, Adults: 34, Elderly: 49, Youth: 37 },
    { label: 'Other', Female: 8, Male: 17, Adults: 5, Elderly: 13, Youth: 7 },
];

/* ── Observed climate impacts (respondents could name more than one) ─ */
export const climateImpacts = [
    { label: 'Reduced crop yields', Female: 225, Male: 211, Adults: 111, Elderly: 206, Youth: 119 },
    { label: 'Prolonged drought', Female: 214, Male: 190, Adults: 96, Elderly: 203, Youth: 105 },
    { label: 'Changing rainfall patterns', Female: 209, Male: 183, Adults: 110, Elderly: 189, Youth: 93 },
    { label: 'Higher food prices', Female: 147, Male: 140, Adults: 82, Elderly: 134, Youth: 71 },
    { label: 'Reduced productivity', Female: 136, Male: 138, Adults: 86, Elderly: 116, Youth: 72 },
    { label: 'Flooding', Female: 127, Male: 133, Adults: 75, Elderly: 112, Youth: 73 },
    { label: 'Damaged infrastructure', Female: 92, Male: 94, Adults: 58, Elderly: 80, Youth: 48 },
    { label: 'More heatwaves', Female: 92, Male: 88, Adults: 52, Elderly: 92, Youth: 36 },
    { label: 'Rivers drying up', Female: 71, Male: 62, Adults: 34, Elderly: 68, Youth: 31 },
    { label: 'Livestock deaths', Female: 51, Male: 55, Adults: 35, Elderly: 45, Youth: 26 },
    { label: 'Displacement', Female: 38, Male: 32, Adults: 22, Elderly: 28, Youth: 20 },
    { label: 'Other', Female: 6, Male: 10, Adults: 5, Elderly: 5, Youth: 6 },
];

/* ── Access to climate information (% of each group) ─────────── */
export const climateInfoAccess = { Female: 48.0, Male: 50.5, Adults: 54.5, Elderly: 49.8, Youth: 43.4 };

// Among people with access: how often they receive it (% of each group)
export const infoFrequencyLevels = ['Never', 'Rarely', 'Sometimes', 'Always'];
export const infoFrequency = {
    Female: { Always: 26.7, Sometimes: 51.1, Rarely: 20.7, Never: 1.5 },
    Male: { Always: 21.0, Sometimes: 61.6, Rarely: 16.7, Never: 0.7 },
    Adults: { Always: 19.0, Sometimes: 58.2, Rarely: 20.3, Never: 2.5 },
    Elderly: { Always: 25.8, Sometimes: 56.3, Rarely: 17.2, Never: 0.8 },
    Youth: { Always: 25.8, Sometimes: 54.5, Rarely: 19.7, Never: 0.0 },
};

/* ── Derived figures ──────────────────────────────────────────── */
const sum = (values) => values.reduce((a, b) => a + b, 0);

export const overall = (() => {
    const owners = landOwnership.Female.owns + landOwnership.Male.owns;
    const subsistence = farming.Female.Subsistence + farming.Male.Subsistence;
    const access = (climateInfoAccess.Female * 281 + climateInfoAccess.Male * 273) / RESPONDENTS;
    return {
        landOwnersPct: (owners / RESPONDENTS) * 100,
        owners,
        subsistencePct: (subsistence / RESPONDENTS) * 100,
        climateInfoPct: access,
    };
})();

// Share of a group's mentions that went to each item (multi-select questions)
export function mentionShares(items, groupKeys) {
    const totals = Object.fromEntries(groupKeys.map(k => [k, sum(items.map(i => i[k]))]));
    const grandTotal = sum(items.map(i => sum(groupKeys.map(k => i[k]))));
    return {
        totals,
        grandTotal,
        rows: items.map(item => {
            const count = sum(groupKeys.map(k => item[k]));
            return {
                label: item.label,
                count,
                share: (count / grandTotal) * 100,
                byGroup: Object.fromEntries(groupKeys.map(k => [k, { count: item[k], share: (item[k] / totals[k]) * 100 }])),
            };
        }),
    };
}
