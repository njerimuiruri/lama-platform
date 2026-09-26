// Shared settings for translating the Glazoué (Benin) LAMA household survey from French to English.
// The original French export is read-only input; nothing here writes to it.
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

module.exports = {
    INPUT: path.join(ROOT, 'data/data/LAMA_22_06_26 (1).xlsx'),
    OUTPUT: path.join(ROOT, 'data/data/LAMA_Glazoue_survey_EN.xlsx'),
    OUTPUT_JSON: path.join(ROOT, 'data/data/LAMA_Glazoue_survey_EN.json'),
    // Complete versions with personal data — git-ignored, keep private
    OUTPUT_FULL: path.join(ROOT, 'data/data/LAMA_Glazoue_survey_EN_FULL.xlsx'),
    OUTPUT_JSON_FULL: path.join(ROOT, 'data/data/LAMA_Glazoue_survey_EN_FULL.json'),
    GLOSSARY: path.join(__dirname, 'glossary.fr-en.json'),
    TODO: path.join(__dirname, 'glossary.todo.json'),

    // Personal or system-identifying columns — removed from the English copy
    isPersonal: (header) => [
        /^Noms et Prénoms de l'agent enquêteurs/,
        /^Contact de l'agent enquêteur/,
        /Localisation du lieu de l'enquête/,
        /^A-1\. Quel est votre nom/,
        /^A-8\. Contact du producteur/,
        /^Télécharger /,
        /^Nom et prénom du superviseur/,
        /^Sexe de l'agent enquêteurs/,
        /^(_id|_uuid|meta\/rootUuid|_submitted_by|__version__|_status|_validation_status|_notes|_tags|_submission_time)$/,
    ].some(re => re.test(header.trim())),

    // Long open-ended answers — kept in French for now (header marked [FR])
    isOpenEnded: (header) => [
        /^Si oui, décrivez/,
        /^Si partiellement, veuillez décrire/,
        /^D-3\./,
        /^Si oui, expliquez comment/,
        /^F-4\./, /^F-5\./, /^F-6\./, /^F-7\./, /^F-9\./,
        /^Si oui, quelle est votre vision/,
        /^G-5\./, /^G-7\./, /^H-6\./, /^I-2\./, /^I-3\./,
    ].some(re => re.test(header.trim())),

    // Columns holding dates as Excel serial numbers
    isDate: (header) => ['start', 'end', "Date et heure de démarrage de l'enquête"].includes(header.trim()),

    // Tidy whitespace (the export has double spaces and line breaks inside labels)
    norm: (s) => String(s).replace(/\s+/g, ' ').trim(),
};
