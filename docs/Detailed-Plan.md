# ArionComply v1 — Detailed Plan (Aligned with Final Architecture & Repo)

*Last updated: 2025‑08‑06*

## 0) Scope & Outcomes

* **Scope (v1):** ISO 27001 & 27701 online‑first assistant with deterministic retrieval, Cards/Prose outputs, conversation logging, signup gating, BM25 fallback, local core services (ingest/index/LLM/services). **Vectors disabled in v1** (v1.1 feature flag).
* **Outcomes:** P\@3 ≥ 0.85, Exact‑ID ≥ 0.90 on gold set; Cards p95 ≤ 1.5s, Prose p95 ≤ 3.0s; explainable responses (scores, reasons, sources, graph paths).

## 1) Execution Environment Alignment

| Component                     | Host                                  | Notes                                                     |
| ----------------------------- | ------------------------------------- | --------------------------------------------------------- |
| Edge API (`assistant_router`) | **Supabase Edge Functions**           | Single entrypoint; routes to actions.                     |
| App & Index DB                | **Supabase Postgres**                 | Schemas `standards_compliance`, `app_core`; FTS enabled.  |
| Vector DB (v1.1)              | **Separate Supabase project**         | `pgvector` in EU region; disabled in v1; feature‑flagged. |
| Ingest/Index                  | **ArionComply local (VM/containers)** | Python/Node CLI; offline; writes to Supabase.             |
| Retrieval Core (ranker/graph) | **ArionComply local (VM/containers)** | Local HTTP services with timeouts/circuit‑breaker.        |
| LLM (prose; CPU)              | **ArionComply local**                 | `llama.cpp` or small‑model wrapper.                       |

## 2) Repo Mapping (authoritative)

```plaintext
arioncomply-v1/
├── README.md                         # Project-level overview
├── backend/
│   ├── README.md                     # Backend purpose and scope
│   ├── edge-functions/
│   │   ├── README.md                 # Supabase Edge functions description
│   │   └── handlers/                 # Route-specific handler logic
│   ├── scripts/
│   │   ├── README.md                 # Local utilities/scripts
│   │   ├── ingest/                   # Chunking/indexing jobs
│   │   │   ├── README.md
│   │   │   ├── chunker.py
│   │   │   └── indexer.py
│   │   ├── llm/
│   │   │   ├── README.md
│   │   │   └── summarize_prose.py
│   │   └── services/                 # NEW: runtime local HTTP services
│   │       ├── README.md
│   │       ├── rank_query_service.py
│   │       └── graph_service.py
│   └── supabase_migrations/
│       └── README.md                # Migration notes and SQL change logs
├── docs/
│   ├── Architecture.md
│   ├── Detailed-Plan.md
│   ├── Flutter-Addendum.md
│   ├── Testing-Strategy.md
│   └── README.md
├── frontend-flutter/
│   ├── README.md                    # Flutter-specific notes
│   └── lib/
│       ├── ui/
│       ├── models/
│       └── services/
├── frontend-web/
│   ├── README.md
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api/
│       └── styles/
└── supabase-config.yaml             # Project + vector config
```

## 3) Milestones (M1 → M5)

### Milestone M1 — Foundations (Week 1–2)

**Objectives:** Supabase projects, schemas, Edge scaffold, minimal web UI, session logging, gating skeleton.

**Tasks**

1. Create Supabase projects: App DB (`ArionComplyAppEU`) and (future) Vector DB (`ArionComplyVectorsEU`).
2. Apply `backend/supabase_migrations/0001_initial.sql` (schemas & indexes).
3. Edge: scaffold `assistant` function + handlers (`rank_query`, `summarize_prose`, `graph_expand`, `log_trace`, `admin_ingest`, `validate_signup`).
4. Frontend‑web: stub chat/cards UI; session id persistence; POST to `assistant`.
5. Profiles & gating: block common free domains (config), Turnstile stub, `validate_signup` path.
6. Observability: request/latency/confidence logging in traces.

**Deliverables**

* Edge deployed; DB live; UI stub; gating scaffold; traces recorded.

**Acceptance**

* UI sends prompt → receives stubbed evidence. Profiles created on signup; logs captured.

---

### Milestone M2 — Retrieval Core & Graph (Week 2–4)

**Objectives:** Ingest pipeline, multi‑index, E‑PMI ranker, graph probe, BM25 fallback.

**Tasks**

1. Ingest: chunk ISO 27001/27701 (markdown) with clause‑aware chunking; emit metadata (`ids`, `numbers`, `entities`, `section_path`, `para_index`, `provenance`).
2. Index: from `ingest/indexer.py` build `multi_index`, `synonyms`; compute E‑PMI offline; seed `graph_nodes/edges` (27001↔27701 v0.1).
3. **Services:** implement `backend/scripts/services/rank_query_service.py` (deterministic multi‑index + E‑PMI + confidence bands + BM25 fallback) and `backend/scripts/services/graph_service.py` (short‑hop graph probe); expose internal HTTP.
4. Edge integration: `assistant.rank_query` forwards to `rank_query_service` with timeouts/circuit breaker.

**Deliverables**

* Ingest & index populated; services wired; BM25 fallback working; draft quality report.

**Acceptance**

* P\@3 ≥ 0.75 on draft gold set; confidence bands behave; graph probe improves relevant cases.

---

### Milestone M3 — UI/Prose & Product Controls (Week 4–5)

**Objectives:** Cards/Prose parity, typing sim, voice option, abuse controls, pending user limits.

**Tasks**

1. Prose: finalize `backend/scripts/llm/summarize_prose.py` service wrapper; prompt templates; typing simulation in UI.
2. Off‑topic nudge: rules/LLM; block general‑LLM answers.
3. Pending users: 5/day cap on standards Q; allow unlimited manual/platform Q.
4. `validate_signup`: domain/company fuzzy check; Turnstile; optional LLM plausibility check.

**Deliverables**

* Deployed UI with toggles; prose typing sim; nudges.

**Acceptance**

* Prose p95 ≤ 3.0s; nudges high precision; pending limits enforced end‑to‑end.

---

### Milestone M4 — Calibration (Week 5–6)

**Objectives:** Gold set, harness, threshold tuning; vectors pilot off by default.

**Tasks**

1. **Gold set v0.1 (50 cases)** — 35×ISO27001, 15×ISO27701; define exact‑ID expectations.
2. Harness — compute P\@3, Exact‑ID, confidence calibration; export plots.
3. Tuning — adjust E‑PMI weights, boosts, thresholds; update synonyms.

**Deliverables**

* `gold_set_v0.1.jsonl` + harness results report.

**Acceptance**

* P\@3 ≥ 0.85; Exact‑ID ≥ 0.90 on gold set.

---

### Milestone M5 — Hardening & Launch (Week 6–7)

**Objectives:** Observability, retention, security review, runbooks, docs, launch tag `v1.0.0`.

**Tasks**

1. Observability — latency/confidence/fallback dashboards; alerts.
2. Retention — 180‑day sweep via pg\_cron or scheduled function; manual purge runbook.
3. Security — least‑privilege SQL roles; secrets rotation; threat model doc.
4. Docs — runbooks (ingest/index, migrations, secrets rotation, vector flip), admin SOPs, onboarding.

**Deliverables**

* Live dashboards; retention sweeps; runbooks in repo.

**Acceptance**

* All SLOs green in staging for 7 days; release notes & rollback plan ready.

---

## 4) Work Breakdown Structure (WBS)

* **WBS‑01 Repo/CI** — monorepo, CI pipelines, environment secrets.
* **WBS‑02 Schemas** — DDL v1 for `standards_compliance`/`app_core`, indexes, FTS.
* **WBS‑03 Edge Scaffold** — `assistant_router` + validators + error model.
* **WBS‑04 Auth/Gating** — Turnstile, domain/company verification, profile states.
* **WBS‑05 Conversations** — session stitching, persistence, replay.
* **WBS‑06 Ingest** — `backend/scripts/ingest/chunker.py`, metadata extraction; `backend/scripts/ingest/indexer.py` builds `multi_index`, `synonyms`, `pmi_assoc`, seeds graph.
* **WBS‑07 Services (Retrieval/Graph)** — `backend/scripts/services/rank_query_service.py`, `backend/scripts/services/graph_service.py` with internal HTTP + timeouts.
* **WBS‑08 Ranker** — scoring pipeline, confidence bands, BM25 fallback (in `rank_query_service`).
* **WBS‑09 UI** — Cards/Chat, typing sim, voice opt‑in, nudges (`frontend-web`).
* **WBS‑10 Prose** — `backend/scripts/llm/summarize_prose.py` wrapper and Edge call path.
* **WBS‑11 Calibration** — gold set + harness + tuning.
* **WBS‑12 Ops** — retention, rate limits, dashboards, runbooks.
* **WBS‑13 Vectors (v1.1 prep)** — separate project schema, ETL skeleton, circuit‑breaker (feature‑flagged off).

## 5) Deliverables Checklist (preliminary)

| Status | Deliverable                                     | Repo path / location                                     | Milestone | Evidence link                   |
| ------ | ----------------------------------------------- | -------------------------------------------------------- | --------- | ------------------------------- |
| \[ ]   | DDL v1 SQL (migrations) — app/index DBs         | `backend/supabase_migrations/0001_initial.sql`           | M1        | `docs/steps/step-01-init.md`    |
| \[ ]   | Edge function + handlers (`assistant_router`)   | `backend/edge-functions/handlers/*`                      | M1        | traces show successful call IDs |
| \[ ]   | Web UI (Cards/Chat) + typing sim + voice toggle | `frontend-web/*`                                         | M1–M3     | screen capture + p95 logs       |
| \[ ]   | Ingest CLI — chunker & indexer                  | `backend/scripts/ingest/{chunker.py,indexer.py}`         | M2        | doc counts snapshot in step log |
| \[ ]   | Ranker service (deterministic)                  | `backend/scripts/services/rank_query_service.py`         | M2        | P\@3 report (draft)             |
| \[ ]   | Graph probe service                             | `backend/scripts/services/graph_service.py`              | M2        | latency evidence (<400ms)       |
| \[ ]   | Prose summarizer (CPU)                          | `backend/scripts/llm/summarize_prose.py`                 | M3        | prose p95 report                |
| \[ ]   | Abuse nudges + pending user limits              | Edge + `frontend-web`                                    | M3        | trace samples + rate-limit logs |
| \[ ]   | Gold set v0.1 (50) + harness report             | `docs/gold_set_v0.1.jsonl` (or `calibration/*` if added) | M4        | calibration report              |
| \[ ]   | Observability dashboards & alerts               | (observability workspace URL)                            | M5        | links/screenshots               |
| \[ ]   | Retention sweeps (180 days)                     | pg\_cron / scheduled function config                     | M5        | job logs + row count deltas     |
| \[ ]   | Runbooks & admin SOPs                           | `docs/RUNBOOKS/*`                                        | M5        | PR link                         |

## 6) Acceptance Criteria by Feature

* **rank\_query**: Returns canonical evidence set; includes `confidence`, `signals`, `graph_paths`, `results[*].reasons`.
* **graph\_expand**: Returns mapped clauses with `relation` + `weight` + provenance; responds < 400 ms on seed graph.
* **summarize\_prose**: Uses only supplied cards; never fetches new content; supports typing simulation.
* **BM25 fallback**: Enabled automatically in 0.40–0.60 band after graph; logged in traces.
* **Signup gating**: Free domain block works; mismatches set `pending`; limits enforced (5/day for standards, high‑level only).
* **Retention**: Records older than 180 days archived/deleted on schedule.

## 7) Risk Register & Mitigations

* **R1 Latency regressions** — Add query profiler; cap K at each stage; precompute E‑PMI; cache synonym expansions.
* **R2 Gold set bias** — Curate across clause areas; include negatives/edge cases; periodic refresh.
* **R3 Graph sparsity** — Start with minimal high‑value edges; add during calibration; log “graph‑needed” misses.
* **R4 Abuse evasion** — Tune nudge classifier; captcha on repeated nudges; daily caps for pending.
* **R5 Ingest drift** — Source checksums; nightly diff; alert on large deltas.
* **R6 Deployment risk** — Canary to staging; rollback scripts; idempotent migrations.

## 8) Metrics & Go/No‑Go Gates

* **Quality**: P\@3, Exact‑ID hit, nDCG\@10 on gold set.
* **Latency**: p50/p95 for `rank_query` and `summarize_prose`.
* **Fallback rate**: % queries entering BM25; target < 25%.
* **Nudge precision**: ≥95% (manual spot checks weekly).
* **Stability**: Error rate < 0.5%; cold start < 300 ms.
* **Go‑Live Gate**: All metrics at/above targets for one week on staging traffic.

## 9) Config & Feature Flags (v1 defaults)

* `features.vectors_enabled: false`
* `features.voice_enabled: true`, `features.typing_simulation: true`
* `limits.pending_standards_per_day: 5`
* `limits.session_rph: 60`, `limits.user_rpd: 500`
* `regions.primary: eu‑central‑1`, fallback `eu‑west‑1`
* Domain **blocklist/allowlist** seeded at deploy

## 10) Test Plan (Strategy)

* **Unit**: ranker feature extraction, PMI math, synonym expansion, graph traversal, validators.
* **Integration**: end‑to‑end `rank_query` on seeded fixtures; BM25 fallback paths.
* **Contract**: JSON schema for evidence set; golden snapshots for Cards rendering.
* **Load**: 95th percentile latency under 10 RPS; BM25 index warm test.
* **Security**: auth gating, Turnstile, rate‑limit bypass attempts.
* **UAT**: product owner runs 50‑case gold set; review traces for explainability.

## 11) Operational Runbooks (summaries)

* **Ingest rebuild**: run `admin_ingest`; verify counts; check PMI/graph stats.
* **Secret rotation**: update via CLI; restart function; smoke test.
* **Retention sweep**: monitor deleted rows; verify archive; alert on failures.
* **Vector flip (v1.1)**: create project; run vectors schema; set secrets; enable flag; observe p95 and fuse rate.

## 12) Backlog Seeds (v1.1 / v1.2)

* **v1.1**: pgvector fallback (RRF), GDPR/EU AI Act/California packs, crosswalk expansion, CAG hot‑packs.
* **v1.2**: SSO (SAML/OIDC), RLS/tenanting, multi‑language retrieval (per‑locale synonyms), Flutter app, advanced abuse heuristics.

## 13) Definition of Done (DoD)

* Code reviewed; CI green; migrations applied; docs updated.
* Metrics dashboards show SLOs met in staging for 7 days.
* Security pass (gating, rate limits, least‑privilege checks).
* Product sign‑off after gold set passes targets.

## 14) Commands (operator cheat‑sheet)

```bash
# Link & deploy Edge
supabase link --project-ref <APP_PROJECT_REF>
supabase db push
supabase functions deploy assistant --use-api

# Secrets
supabase secrets set TURNSTILE_SECRET=... RETENTION_DAYS=180

# Local services (examples)
uv run backend/scripts/services/rank_query_service.py
uv run backend/scripts/services/graph_service.py
uv run backend/scripts/ingest/chunker.py --input ./docs/packs/iso27001
uv run backend/scripts/ingest/indexer.py --input ./docs/packs/iso27001
uv run backend/scripts/llm/summarize_prose.py --stdin ./tmp/cards.json
```

## 15) Change Control & Versioning

* Semantic releases: `v1.0.0` at GA; `v1.1.0` (vectors), `v1.2.0` (SSO/i18n).
* Each milestone concludes with a **REPORT.md** and git tag; artifacts captured in `docs/steps/*`.
