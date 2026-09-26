# Survey translation (French → English)

Translates the Glazoué (Benin) LAMA household survey export into English.

- Input (read-only, git-ignored — contains personal data): `data/data/LAMA_22_06_26 (1).xlsx`
- Output:
  - `data/data/LAMA_Glazoue_survey_EN.xlsx` — sheets *Survey (English)*, *Column guide*, *README*
  - `data/data/LAMA_Glazoue_survey_EN.json` — `meta`, `questions` (English + French wording, options, answer counts) and `respondents` (one record per person)

```bash
node scripts/survey-translation/extract.js       # phrases missing from glossary.fr-en.json → glossary.todo.json
node scripts/survey-translation/open-answers.js  # IDs for open-ended answers → open-answers.fr.json
node scripts/survey-translation/build.js         # writes the English Excel + JSON
node scripts/survey-translation/verify.js        # checks both outputs against the French original
```

- Questions and multiple-choice/short answers: `glossary.fr-en.json`
- Open-ended answers: `open-answers.en/*.json`, keyed by the IDs in `open-answers.fr.json`
- Column rules (personal data removed, open-ended columns) live in `config.js`

To fix a translation, edit the relevant JSON file, then run `build.js` and `verify.js`.
