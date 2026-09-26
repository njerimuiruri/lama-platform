// Cleans up values in data/data/projects.json so filters, maps and lists agree.

// Project country names → the names used by the world-atlas map
const COUNTRY_NAMES = {
    "Côte d'Ivoire": 'Ivory Coast',
    'Democratic Republic of the Congo': 'Dem. Rep. Congo',
    'Swaziland': 'Eswatini',
    'United Republic of Tanzania': 'Tanzania',
};

export function normaliseCountry(name) {
    const trimmed = (name || '').trim();
    return COUNTRY_NAMES[trimmed] ?? trimmed;
}

export function normaliseRegion(region) {
    const value = (region || '').trim();
    if (!value || value.toLowerCase() === 'none') return 'Other';
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export function cleanValue(value) {
    const v = (value || '').trim();
    return v && v.toLowerCase() !== 'none' ? v : null;
}

export const amountOf = (project) => parseFloat(project['Project Amount ($ Million)'] || 0) || 0;

// First year of a period such as "2020-2026"
export const startYear = (project) => parseInt(String(project.Period || '').split('-')[0], 10) || 0;
