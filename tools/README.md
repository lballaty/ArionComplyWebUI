# Tools Directory

The `tools/` directory contains **all scripts, utilities, and configurations** used to process curated data into generated outputs.

## Structure

* **`preprocess/`** → Scripts for cleaning, parsing, and converting input files (e.g., YAML → TOML, text normalization).
* **`analyze/`** → Scripts that extract vocabularies, build canonical term sets, and map synonyms.
* **`export/`** → Utilities to generate final reports, CSVs, or database dumps into `outputs/`.
* **`config/`** → Shared configuration files (e.g., stopword toggles, synonym rules, processing flags).

## Rules

* Scripts are the only way content moves from `data/` to `outputs/`.
* Each script should be modular: handle one stage (preprocess, analyze, export).
* Config files control behavior; avoid hardcoding.
* Outputs should always be written to `outputs/`, never into `data/`.

## Usage

1. Place curated content into `data/`.
2. Run preprocessing scripts (`tools/preprocess/`) to normalize inputs.
3. Run analysis scripts (`tools/analyze/`) to build vocab sets and mappings.
4. Run export scripts (`tools/export/`) to generate human-readable reports or databases.

This keeps the workflow reproducible and modular, with clear boundaries between inputs, processing, and outputs.


# 1) Convert front matter to TOML (optional if already TOML)
python tools/preprocess/convert_yaml_to_toml.py --root data/corpus --glob "**/*.md" --inplace --backup-dir backups/frontmatter

# 2) Normalize bodies for inspection (optional)
python tools/preprocess/normalize_markdown.py --root data/corpus --glob "**/*.md"

# 3) Build vocab artifacts
python tools/analyze/build_vocab.py --root data/corpus --out outputs/vocab

# 4) Generate summary report
python tools/export/generate_reports.py --in outputs/vocab --out outputs/reports


