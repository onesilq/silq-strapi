# Silq Codex — guide for PMs and designers

Silq Codex is the in-app product handbook. Content lives in this Strapi admin; the Silq web app renders it as an overlay (launcher pill → full Codex surface).

Use this doc when you are writing or structuring handbook content. Engineering owns schemas and app rendering; you own titles, copy, structure, media, and audience.

For a staging content checklist (workflows, page contexts, naming, markdown), see [CODEX-CONTENT-AUDIT.md](./CODEX-CONTENT-AUDIT.md).

## What Codex is made of

| Content type | What it is | Publish? |
| --- | --- | --- |
| **Codex home** | Single landing layout (ordered sections) | Yes |
| **Category** | Sidebar “bucket” (Quotes, Projects, …) | No draft — live when saved |
| **Article** | One handbook page / workflow step document | Yes |
| **Workflow** | Ordered stepper of articles | Yes |
| **FAQ** | Question + answer | Yes |
| **Glossary term** | Short definition (hover / glossary page) | No draft — live when saved |
| **Team** | Filter chip in the Codex sidebar | No draft — live when saved |
| **Tag** | Search label on articles, workflows, FAQs | No draft — live when saved |
| **Page context** | Maps an in-app route pattern to articles/workflows (Guides pill in Silq) | Yes |

Tours live in Strapi too (`Tour`). Codex can link a workflow or an in-article button to an existing tour (“Show me in Silq”).

## Page context (Guides for this page)

Use **Page context** when staff are on a screen in Silq and should see a short list of relevant handbook entries without opening Codex home.

- **Route pattern** — must start with `/`. Use exact paths (`/rfqs/new`) or wildcards:
  - Prefix: `/projects/*` matches **child** paths only (`/projects/123`, not the list at `/projects`). Pair list pages with an exact pattern plus optional query rules (e.g. `/projects` + `config=active`).
  - Per segment: `/projects/*/shipments/*/routes`
- **Query rules** (optional) — e.g. `config` = `active` for `/projects?config=active`.
- **Targets** — ordered list of articles or workflows (pick **workflow step** when using a workflow).
- **Priority** — higher wins when two contexts match the same URL.
- **Panel title / subtitle** — copy in the Guides popup.

Publish the entry; the app loads published contexts with the Codex catalog.

## Suggested authoring order

1. **Teams** and **Tags** you will reuse.
2. **Categories** (sidebar buckets) with icon + ordinal.
3. **Articles** (with cover, body blocks, audience, teams, tags).
4. **Workflows** that sequence those articles.
5. **FAQs** and **Glossary terms**.
6. **Codex home** sections that feature the above.
7. **Publish** anything that uses drafts (home, articles, workflows, FAQs).

## Audience and teams

Every article, workflow, FAQ, category, and team has an **audience**:

| Value | Who sees it in the app |
| --- | --- |
| `all` | Internal users and clients |
| `client` | Clients (and internal) |
| `internal` | Internal / admin only |

**Teams** further filter content. Users pick team chips in the Codex sidebar; entries tagged with those teams stay visible. Leave teams empty if the entry should show for every team filter.

## Categories (sidebar buckets)

- **Ordinal** — lower numbers appear higher in the nav.
- **Icon** — one of: `home`, `quotes`, `project`, `ship`, `help`, `book`. The app maps these to existing Silq icons; do not invent new keys without engineering.
- Attach articles and workflows to a category so they appear under that bucket.

## Articles

### Fields that matter

- **Title / slug** — slug becomes the deep link (`?codex=article/<slug>`).
- **Description** — short dek under the title (keep under ~200 characters).
- **Estimated read minutes** — shown in the header.
- **Cover** — optional hero image (or video) above the body. Prefer wide screenshots or product imagery; the app crops with `object-cover` and caps height.
- **Category / teams / tags / audience** — discovery and visibility.
- **Related articles** — listed in the side rail.
- **Blocks** — the body (dynamic zone). Order = on-page order.

### Body blocks you can use

| Block | Use for |
| --- | --- |
| **Rich text** | Main prose. Supports Markdown-style headings (`##` become “On this page” rail links). |
| **Media** | Inline image or video file from the Media Library. |
| **Quote** | Pull quote. |
| **Callout** | Tip / warning / info note (`tone`). |
| **Tour button** | Starts a product tour already defined in Strapi. |
| **App link** | Opens an in-app route (e.g. `/rfqs/new`). Path must be a real Silq path. |
| **Video** | Embed by URL (YouTube or direct file URL). |
| **Slider** | Multi-image slider (shared component). |

### In-copy links (`codex://`)

In rich text, link with these URLs so the app opens Codex screens instead of the browser:

| Link | Opens |
| --- | --- |
| `codex://article/<slug>` | That article |
| `codex://workflow/<slug>` | That workflow (step 1) |
| `codex://glossary/<slug>` | Glossary, highlighted on that term |

Use the **slug** field of the target entry, not the display title. Glossary links get a hover definition in the article.

## Workflows

- Ordered **steps**: each step has a **label** and an **article**.
- **Related tour** — optional; when set, the workflow screen can show “Show me in Silq” (closes Codex and starts that tour).
- **Ordinal**, **category**, **audience**, **teams**, **tags** — same rules as articles.
- Cover on workflows is supported in Strapi; the current app may not show it on cards yet — prefer a strong title + summary.

## FAQs and glossary

- FAQs: set **ordinal**; optionally link a **workflow** for “Walk through the workflow”.
- Glossary: short **definition**; link from articles with `codex://glossary/<slug>`.

## Codex home

One **Codex home** document. **Launcher label** is the tooltip / name for the floating pill (default “Silq Codex”).

Add sections in the order you want them rendered:

| Section | Purpose |
| --- | --- |
| **Hero** | Title + subtitle band; progress uses read state on the device |
| **Announcement** | One-off callout (title + body) |
| **Featured workflows** | Pick workflows to highlight (or leave empty to show all visible) |
| **Bucket grid** | Category cards that jump into the first article in that bucket |
| **FAQ highlights** | Top N FAQs with a link to the full FAQ screen |

Unknown section types are skipped by the app safely.

## Media tips

- Upload via **Media Library**; reuse files across articles.
- Prefer PNG/WebP for UI screenshots; keep file sizes reasonable for admin + app load.
- Set **alternative text** on media when possible — it becomes the caption/alt in Codex.
- Covers and in-body media both resolve against the Strapi media URL.

## How to preview in Silq

1. Publish the entries you changed (or save non-draft types).
2. Open Silq with Codex enabled (feature flag / local env as set by engineering).
3. Open the launcher pill, or use a deep link, for example:
   - `?codex=home`
   - `?codex=article/your-slug`
   - `?codex=workflow/your-slug/1`
   - `?codex=faq`
   - `?codex=glossary/your-term-slug`
   - `?codex=search&codexQuery=quotes`

Client vs internal visibility follows **audience** (and team filters). Check both if the entry is client-facing.

## What not to do in Strapi admin

- Do not rename **slugs** after content is linked from other articles or workflows — deep links and `codex://` URLs break.
- Do not invent category **icon** values outside the allowed list.
- Do not put secrets or customer PII in handbook content.
- Schema / component changes (new fields, new block types) need an engineering change in this repo **and** in `silq-frontend` — ask before restructuring Content-Types in the admin UI for production.

## Where to get help

- Product / copy questions: handbook owners / PM.
- “It doesn’t show in the app”: check **Published**, **audience**, **teams**, and that the frontend points at this Strapi environment.
- New block types or icons: engineering (`silq-strapi` + `silq-frontend` Codex).
