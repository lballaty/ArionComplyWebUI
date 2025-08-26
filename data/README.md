# Data Directory

The `data/` directory contains **all curated and input materials** for processing. Nothing here is generated automatically.

## Structure

* **`corpus/`** → Core corpora used for analysis.

  * `qas/` → Compliance Q/A markdown files with front matter (YAML or TOML).
  * `templates/` → Standards templates or mirrored reference text.
  * `examples/` → Example documents used for testing and illustration.
* **`mappings/`** → Curated alias lists, synonym maps, or overrides.

## Rules

* Everything here is human‑curated or sourced (not generated).
* Canonical vocab, indexes, and reports will be built from these inputs and stored in `outputs/`.
* Keep inputs minimal but representative (avoid duplicates, large raw dumps).

## Usage

Processing scripts in `tools/` will:

* Parse Q/As, templates, and examples.
* Generate canonical term sets, synonym lists, and vocab indexes.
* Map terms to standards, clauses, and phrases.

Outputs are never written back here, ensuring `data/` stays clean and reproducible.
