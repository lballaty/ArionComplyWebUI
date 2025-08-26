
# ArionComply v1 Architecture (Online-first, LLM 2.0–aligned)

*Last updated: 2025‑08‑06*

## 1) Purpose & Scope

Define a production-ready, online-first compliance assistant for ISO 27001 & ISO 27701 (v1) with explainable retrieval, dual UI (Cards/Chat), conversation persistence, company-gated signup, and an upgrade path to vectors (v1.1) and more packs (GDPR, EU AI Act, California).

## 2) Goals

* Deterministic, high-accuracy retrieval with transparent evidence (scores, reasons, sources).
* User-selectable output: **Cards**, **Prose**, or **Both** (default **Both**).
* Online operation with Supabase (Edge Functions, Postgres).
* Conversation persistence (session → user), 180‑day retention.
* Company email gating + abuse mitigation.
* Extensible to Graph crosswalks and vectors without breaking APIs.

## 3) Non‑Goals (v1)

* GPU inference; generative free-form answers (prose is card-based summarization only).
* Multi-language retrieval (design-ready; English only in v1).
* SSO/SAML (planned v1.2).

## 4) Key Requirements & SLAs

* **Quality targets (gold set):** P\@3 ≥ 0.85, exact‑ID hit ≥ 0.90 (ISO 27001/27701).
* **Latency:** Cards p95 ≤ 1.5s; Prose p95 ≤ 3.0s (CPU).
* **Security:** Least-privilege DB access; signup gating; abuse nudges; retention 180 days.
* **Explainability:** Each response includes scores, reasons, graph paths, and source locators.

## 5) High-Level System Overview

* **Frontend:** HTML/CSS/JS web app; voice optional; typing simulation for prose.
* **Edge Function (single endpoint):** `assistant_router` with internal handlers.
* **Datastores:**

  * App & Index DB (Supabase Postgres): schemas `standards_compliance` & `app_core`.
  * Vector DB (separate Supabase project with `pgvector`) — **disabled in v1**, enabled in **v1.1**.
* **LLM:** Local small LLM (SmolLM3 or Mistral via llama.cpp) for prose stitching only.

### 5.1 Component Diagram (conceptual)

```
Web UI (Chat + Cards, voice) ──▶ Edge: assistant_router ──▶ rank_query
                                           │                    │
                                           │                    ├──▶ Postgres (standards_compliance): multi_index, graph, chunks
                                           │                    ├──▶ BM25 fallback (FTS)
                                           │                    └──▶ Vector DB (pgvector, v1.1; fallback only)
                                           ├──▶ summarize_prose ──▶ llama.cpp (local small LLM)
                                           ├──▶ graph_expand     ──▶ graph tables
                                           ├──▶ log_trace        ──▶ Postgres (app_core)
                                           └──▶ admin_ingest     ──▶ offline jobs (ingest/index)
```

## 6) Data Model (Supabase)

### 6.1 `standards_compliance` (read-mostly)

* `documents(doc_id, pack_id, title, version, authority, updated_at, url)`
* `chunks(chunk_id, doc_id, clause_id, section_path[], para_index, text, ids[], numbers[], entities[], provenance)`
* `multi_index(term, kind, chunk_id, pos)` // kind: term|ngram|id|number|entity
* `synonyms(term, alt, kind)` // acronym|variant|locale
* `pmi_assoc(lhs, rhs, weight, support, scope)` // E‑PMI features (offline)
* `graph_nodes(node_id, pack_id, type, label, version)`
* `graph_edges(src, dst, relation, weight, provenance, valid_from, valid_to)` // maps\_to|equivalent\_to|supports|depends\_on|overlaps
* `artifact_templates(artifact_id, type, name, version, owner_role, frequency, retention, evidence_type, system_source, template_hint)`
* `chunk_artifacts(chunk_id, artifact_id, relation)` // requires|suggests|evidence\_of
* FTS: `chunks.tsv` (BM25 fallback)

### 6.2 `app_core` (write-heavy)

* `profiles(user_id, email, company_name, company_domain, status)` // pending|active|blocked
* `conversations(conversation_id, user_id?, session_id, started_at, last_active_at, output_mode, retrieval_mode)`
* `messages(message_id, conversation_id, role, content, cards, prose, created_at)`
* `traces(trace_id, conversation_id, step, payload_json, event_ts)`
* `artifact_instances(instance_id, artifact_id, tenant_id, state, template_version, version, data, created_at, updated_at)` // workflow: draft→in\_review→approved→published→archived

### 6.3 Vector DB (separate project; v1.1)

* `vectors.chunk_embeddings(chunk_id PK, pack_id, clause_id, section_path[], score_authority, embedding vector(768), updated_at)`
* IVFFLAT index on `embedding` + indexes on `pack_id`, `section_path`.

## 7) Retrieval & Ranking

### 7.1 Ingest (offline)

* Sources: Markdown packs for ISO 27001/27701.
* Clause-aware chunking (\~400–800 tokens, 15–20% overlap).
* Emit metadata: `ids[]` (e.g., “A.12.6”), `numbers[]` (e.g., “72 hours”), `entities[]` (roles/PII), `section_path[]`, `para_index`, `provenance`.
* Build `multi_index`, `synonyms`, `pmi_assoc`; populate `graph_nodes/edges` (ISO27001↔ISO27701).

### 7.2 Query (online)

1. Canonicalize query; preserve IDs & numbers; expand synonyms/acronyms.
2. Candidate fetch via `multi_index` (set ops).
3. Score each candidate chunk by:

   * Exact‑ID boost; E‑PMI(query multi‑tokens ↔ chunk multi‑tokens);
   * Proximity to clause headers/section titles; numeric matches;
   * Authority/recency by pack/version.
4. Cheap **graph probe** (short hops) → merge & add path weights.
5. Confidence bands → ≥0.60 return; 0.40–0.60 graph + BM25; <0.40 return facets + clarifying question.
6. Optional prose: summarize **only** the returned cards via small LLM.

### 7.3 Fallbacks

* **v1:** BM25 (FTS) re‑rank if confidence remains low after graph.
* **v1.1:** pgvector (separate project), fused with BM25 via Reciprocal Rank Fusion (RRF); circuit‑breaker; cache.

### 7.4 CAG (optional speed path)

* For small, stable “hot packs” (policy bundle + SoA + last audit), pre‑load into long context/KV cache; not a truth source.

## 8) API Contract (single Edge endpoint)

`POST /functions/v1/assistant`

**Common fields**

```json
{
  "action": "rank_query|summarize_prose|graph_expand|log_trace|admin_ingest|validate_signup",
  "session_id": "uuid",
  "user_id": "uuid|null",
  "output_mode": "cards|prose|both",
  "retrieval_mode": "auto|rag_graph|cag_only",
  "include_graph": true
}
```

**rank\_query → evidence set**

```json
{
  "confidence": 0.71,
  "signals": ["exact_id:A.12.6", "pmi:malware->prevention", "proximity:clause_header"],
  "graph_paths": [{"from":"ISO27001:2022/A.12.6","to":"ISO27701:2019/6.5","relation":"maps_to","weight":0.82}],
  "results": [{
    "rank":1, "score":0.86,
    "doc_id":"ISO27001:2022", "clause_id":"A.12.6", "chunk_id":"ISO27001:2022/A.12.6/003",
    "snippet":"Organizations shall implement controls to prevent…",
    "source": {"title":"ISO/IEC 27001:2022","url":"…","page":74},
    "reasons":["exact_id","pmi","proximity"]
  }]
}
```

**summarize\_prose**

* Input: evidence set; `typing_simulation: true|false`.
* Output: prose synthesized only from cards.

**graph\_expand**

* Input: query or clause IDs; `max_hops`.
* Output: mapped clauses with path metadata.

**log\_trace**

* Insert‑only step logs (metadata, no full text).

**admin\_ingest**

* Restricted (service role): (re)chunk, (re)index, rebuild E‑PMI, merge graph.

**validate\_signup**

* Turnstile verification, domain/company gating, optional LLM check; set profile status.

## 9) Auth, Gating & Abuse Controls

* **Auth:** Supabase Auth with email confirmation; profiles record `company_name`, `company_domain`, `status` (pending|active|blocked).
* **Gating:** Block common free domains (configurable). Company name ↔ domain fuzzy check; optional LLM plausibility check.
* **Pending users:** unlimited product/manual queries; standards limited to 5/day and high-level only.
* **Abuse:** Off‑topic detection → nudge to on‑topic (no general LLM answers). Rate limits and cooldowns per IP/session/user. Allow/deny lists.

## 10) Sessions, Conversations & Retention

* Client generates `session_id` (UUID). Conversations (threads) live under session; on login, stitch to `user_id`.
* Store `messages.cards` (evidence set) and `messages.prose` for deterministic replay.
* **Retention:** 180 days (scheduled sweep/archival via Edge Scheduler or pg\_cron).

## 11) Configuration & Secrets

```yaml
features:
  vectors_enabled: false
  voice_enabled: true
  typing_simulation: true
limits:
  pending_standards_per_day: 5
  session_rph: 60
  user_rpd: 500
regions:
  primary: eu-central-1   # Frankfurt (fallback eu-west-1 Amsterdam)
vector_store:
  project: ArionComplyVectorsEU
  region: eu-central-1
  schema: vectors
  table: chunk_embeddings
  dim: 768
fusion:
  method: rrf
  k_primary: 50
  k_vector: 50
  k_final: 10
retention_days: 180
```

## 12) Observability & Ops

* Edge logs (request ids, action, latency, confidence, fallbacks).
* Metrics: p50/p95 latency (cards/prose), confidence distribution, fallback rates, off‑topic nudges, error rates.
* Alerts: vector timeouts (v1.1), fallback spike, latency SLO breach.
* Runbooks: ingest/index rebuilds, schema migrations, secrets rotation.

## 13) Security & Privacy

* Least‑privilege SQL roles per handler; single Edge function, internal routing.
* No full chunk text in traces; metadata only.
* Profiles gating at signup; optional manual review queue.
* Future RLS (v1.1) on `app_core` + tenant partitioning for artifact instances.

## 14) Roadmap

* **v1** (this doc): ISO27001 & ISO27701 packs; graph crosswalk between them; BM25 fallback; English only.
* **v1.1**: Enable vectors (separate pgvector project); add packs: GDPR, EU AI Act, California (CPRA/regs); expand crosswalk edges.
* **v1.2**: SSO (SAML/OIDC), RLS, multi‑language retrieval, advanced abuse heuristics.

## 15) Success Criteria

* Quality: P\@3 ≥ 0.85; exact‑ID hit ≥ 0.90 on gold set.
* Latency: cards p95 ≤ 1.5s; prose p95 ≤ 3.0s.
* Safety: ≥95% precision on off‑topic nudges; zero general‑LLM answers.
* Auditability: all responses carry scores, reasons, graph paths, and sources.

## 16) Open Items (tracked)

* Finalize **gold set v0.1** (50 cases) and run calibration.
* Decide IVFFLAT params and embedding model (v1.1).
* Add i18n plan (retrieval‑level) and SSO design (v1.2).

---

**Appendix A — Minimal SQL (excerpt)**

* See repo migration `0001_initial.sql` for full DDL of `standards_compliance` & `app_core`.

**Appendix B — Evidence Set Schema (canonical)**

```ts
interface EvidenceSet {
  confidence: number;            // 0..1
  signals: string[];             // e.g., ["exact_id:A.12.6","pmi:phraseA->phraseB"]
  graph_paths?: Array<{from:string; to:string; relation:string; weight:number}>;
  results: Array<{
    rank: number; score: number; doc_id: string; clause_id?: string; chunk_id: string;
    snippet: string; source: { title: string; url?: string; page?: number };
    reasons: string[];           // e.g., ["exact_id","pmi","proximity"]
  }>;
}
```

**Appendix C — Gold Set JSONL Template**

```json
{"id":"Q001","query":"What does ISO 27001 A.8.12 require and what evidence is acceptable?","must_include_ids":["A.8.12"],"must_include_packs":["ISO27001:2022"],"expected_top_chunks":["ISO27001:2022/A.8.12/*"],"acceptable_alternatives":["ISO27002:2022/8.12/*"],"graph_required":false,"output_mode":"both","notes":"Prefer explicit technical controls and evidence fields."}
```
**Appendix D — Repo Structure**

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
│   │   └── llm/
│   │       ├── README.md
│   │       └── summarize_prose.py
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

# ArionComplyWebUI
