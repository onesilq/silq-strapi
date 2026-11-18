# Agent instructions (Silq Strapi)

This document tells automated coding agents how to work in this repository. When in doubt, match **existing code** in the touched area and keep changes **minimal**.

Human-facing Codex authoring guidance for PMs and designers lives in [`docs/README.md`](docs/README.md). Prefer updating that guide when content-model behavior changes in a way editors must know.

## Project

- **Stack:** Strapi 5 (TypeScript), Document Service API, SQLite locally (`.tmp/data.db`), Docker/ECR for deploy.
- **Purpose of this repo:** CMS for Silq product surfaces — primarily **Silq Codex** (handbook) and **product tours**, plus leftover blog starter types (`about`, `global`, `author`, etc.).
- **Consumer:** [`silq-frontend`](../silq-frontend) Codex client under `src/codex/` (REST against `/api/...`). Schema and API contract changes almost always need a matching frontend change.

## How to work

- **Scope:** Only change what the task requires. No drive-by refactors or unrelated Content-Type cleanup.
- **Consistency:** Read neighboring `schema.json` / components before editing. Match attribute naming (camelCase), draft/publish choices, and description tone already used on Codex types.
- **Docs:** Update [`docs/README.md`](docs/README.md) when editor-visible behavior changes (new block types, audience rules, link schemes, icon keys). Do not add markdown unless the task asks for it or the change requires editor guidance.
- **Commits/PRs:** Describe what changed and why. Content/seed data does not belong in the PR unless explicitly requested — editors create content on the deployed Strapi.
- **Secrets:** Never commit `.env`, API tokens, or `.tmp/` database files.

## Directory layout

| Path | Contents |
| --- | --- |
| `src/api/<name>/` | Content-Type API (routes, controllers, services, `content-types/.../schema.json`) |
| `src/components/codex/` | Codex dynamic-zone / repeatable components |
| `src/components/shared/` | Shared blocks (rich-text, media, quote, slider, seo) |
| `src/components/tour.*` / tour APIs | Product tour CMS (separate from Codex body, linkable via relations) |
| `src/index.ts` | Bootstrap — optional public-read grants for local Codex demo |
| `types/generated/` | Generated TS types — regenerate after schema changes; do not invent divergent shapes |
| `docs/` | Human docs (Codex authoring for PMs/designers) |
| `config/` | Strapi server, database, plugins, middlewares |

## Codex content model (do not invent parallel types)

| UID | Role |
| --- | --- |
| `api::codex-home.codex-home` | Single type — home sections dynamic zone |
| `api::codex-page-context.codex-page-context` | In-app route → handbook targets (Guides widget) |
| `api::article.article` | Handbook documents (also used as workflow steps) |
| `api::category.category` | Sidebar buckets |
| `api::workflow.workflow` | Steppers |
| `api::faq.faq` | FAQs |
| `api::glossary-term.glossary-term` | Glossary |
| `api::team.team` | Team filter chips |
| `api::tag.tag` | Search tags |
| `api::tour.tour` | Product tours (related from workflows / tour-cta) |

**Components** under `components/codex/*` use the `codex.` category (`codex.hero`, `codex.callout`, …). Article body also uses `shared.*` blocks.

Naming note: only the home single type is prefixed `codex-`. Sibling collection types stay unprefixed (`article`, `workflow`, …). Do **not** rename APIs for cosmetics without an explicit product/engineering decision — the frontend hardcodes REST paths.

## Schema conventions

- Prefer **camelCase** attributes (`relatedTour`, `launcherLabel`, `estimatedReadMinutes`).
- Put editor-facing guidance in `info.description` on the content type or component.
- **Audience** enums are `internal` | `client` | `all` wherever visibility is gated.
- Category **icon** enum must stay in sync with frontend `CodexBucketIcon` (`home`, `quotes`, `project`, `ship`, `help`, `book`).
- Draft & publish: home, article, workflow, FAQ — yes. Category, team, tag, glossary-term — no (live on save).
- Relations that the app needs must remain populatable; check `silq-frontend/src/codex/CodexApi.ts` populate params when adding fields media/relations the client should load (e.g. `cover`).

## Permissions and security

- Strapi does **not** see the Silq session. Production is expected to call Strapi with a **server-held token** and apply audience/team filters in the app (or a future proxy).
- `CODEX_ALLOW_PUBLIC_READ=true` grants Public role `find`/`findOne` on Codex types for **local demo only** (`src/index.ts`). Do not treat anonymous public read as a production auth model.
- When adding a new Codex collection type the app must read, extend `PUBLIC_READ_ACTIONS` in `src/index.ts` **and** wire the frontend API.

## Working with the frontend

After schema or component changes that affect the handbook UI:

1. Regenerate or update Strapi types if the project workflow requires it.
2. Update `silq-frontend/src/codex/` — especially `CodexApi.ts` (paths/populate), `CodexModel.ts` (normalize), and the screen/block that should render the new field.
3. Keep deep-link and in-copy contracts stable:
   - Query: `?codex=`, `?codexQuery=`
   - In-body: `codex://article/<slug>`, `codex://workflow/<slug>`, `codex://glossary/<slug>`

## Local development

- Typical admin: `http://localhost:1337/admin` (see team env for port).
- DB file under `.tmp/` is local-only; schema renames may require resetting it.
- Do not reintroduce seed bootstrap that writes handbook content into git-tracked flows unless explicitly asked.

## Out of scope unless asked

- ECR/Docker deploy scripts (see root `README.md`)
- Rewriting blog starter types unrelated to Codex
- Seeding production handbook content in PRs
- Frontend-only visual polish (belongs in `silq-frontend`)
