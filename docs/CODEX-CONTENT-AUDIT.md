# Codex content audit (staging)

Living checklist so IA / naming / workflow wiring mistakes are caught in one pass, not one article at a time.

**Last run:** 2026-11-18 (37 published articles, 4 workflows, 20 page contexts on staging).

## Content rules (apply to every new article)

1. **Dashboard vs workflow** — List/overview screens get a **standalone article** and a **page context** on the list route (often with a `config` query rule). They are **not** workflow step 1 unless the workflow is only about that screen.
2. **Title matches intent** — If the description starts with “X dashboard”, the article title should say **X dashboard** (slug can stay stable for `codex://` links).
3. **Workflow steps** — Only in-flow task articles belong on a workflow. Cross-links in dashboard articles point *into* the workflow at step 1.
4. **Page context targets** — When a context includes both a workflow and step articles, set `workflowStep` 1…n to match the workflow order (see `staging-page-contexts.data.mjs` + `buildTargets` in `seed-page-contexts-remote.mjs`).
5. **Markdown** — Use `-` bullets or GFM tables, not middle-dot (`·`) chains. Use contiguous `1.` lists (no starting at 5).
6. **Internal vs all** — Planning / admin procedures: `internal`. Client-visible flows: `all`.
7. **Tours** — `codex.tour-cta` only on **dashboard** articles (`manage-projects` → `projects-tour`, `track-shipments` → `shipments-tour`, `share-invoices` → `invoicing-tour`). Do not attach list/dashboard tours to **workflows** (`relatedTour`): the UI shows **Show me in Silq** on every workflow step (`CodexWorkflowView`).
8. **App links** — Avoid generic `codex.app-link` to `/projects` on task/how-to articles; use `codex://article/...` or a real deep path. Wizard steps are described in prose, not “Open Projects”.

## Workflows (staging)

| Workflow | Steps | Notes |
|----------|-------|--------|
| `quoting-lifecycle` | 5 | Aligned with RFQ → acceptance |
| `project-planning-execution` | 5 | **Fixed:** removed `manage-projects`; starts at Assign collaborators; **no `relatedTour`** |
| `shipment-routes-tracking` | 3 | Concept → plan → track; **no `relatedTour`** (tour lives on `track-shipments` only) |
| `supplier-booking-intake` | 4 | Aligned |

## Fixes applied (2026-11-18)

| Item | Action |
|------|--------|
| `manage-projects` | Title → **Projects dashboard** (slug unchanged: `manage-projects`) |
| `project-planning-execution` | Removed dashboard step; summary no longer mentions dashboard |
| `projects-list-active` | Published page context: `/projects` + `config=active` → Projects dashboard article only |
| `projects-workspace` | Published: workflow + all 5 step articles with `workflowStep` 1–5 |
| `assign-collaborators` | Role list → bullets; footer link → Projects dashboard |
| `template-types-hierarchy` | Reusable templates list renumbered 1–3 |
| Seed scripts | `staging-page-contexts.data.mjs` + per-step `workflowStep` when a workflow is attached |
| `project-planning-execution` / `shipment-routes-tracking` | Cleared `relatedTour` (stopped projects/shipments dashboard tour on unrelated steps, e.g. Assign collaborators) |
| `assign-collaborators`, `add-products`, `apply-task-templates`, `plan-shipment-routes`, `quote-acceptance` | Removed misleading **Open Projects** `codex.app-link`; kept markdown + `codex://` cross-links |

**Link re-audit:** `scripts/.codex-link-audit.txt` — run the Python block in *How to re-audit* below against staging after bulk edits.

## Open backlog (staging)

### Title vs description (cosmetic but confusing in sidebar)

| Slug | Title today | Description hints |
|------|-------------|-------------------|
| `create-an-rfq` | Create an RFQ | RFQ list / dashboard wording in description |
| `track-shipments` | Track shipments | “Shipments dashboard” |
| `invoicing-in-silq` | Invoicing in Silq | “admin dashboard” |
| `share-invoices` | Share invoices | “admin dashboard” |

Decide per article: retitle to “… dashboard” **or** soften description (keep title as task name).

### Middle-dot pseudo lists (16 articles)

Still use inline `·` (renders as dense paragraphs). Convert to bullets or tables:

`apply-task-templates`, `shipment-route-structure`, `complete-tasks`, `create-an-rfq`, `track-shipments`, `invoicing-in-silq`, `review-booking-submissions`, `client-rate-configuration`, `convert-booking-to-rfq`, `network-organizations-users`, `network-places`, `client-banners`, `upload-vendor-rate-sheets`, `clients-admin-overview`, `basic-navigation` (and re-check `assign-collaborators` after publish).

### Shipment page context vs workflow order

- **Workflow step 1:** `shipment-route-structure`
- **`shipments-active` page guide primary:** `track-shipments` (execution dashboard)

Same pattern as projects (dashboard ≠ step 1). **OK if intentional** — panel prioritizes what users do on `/shipments/*`; workflow pager still starts at route structure. Optional: add a dedicated `/shipments` list context if that URL exists.

### Optional slug cleanup

- `manage-projects` → `projects-dashboard` would match title; requires updating all `codex://article/manage-projects` links and seeds. Not done yet.

## How to re-audit

```bash
# Spot-check app-link / tour blocks (expect 0 misleading /projects app-links on task articles)
curl -sG 'https://strapi.test.onesilq.com/api/articles' \
  --data-urlencode 'status=published' \
  --data-urlencode 'populate[blocks]=true' \
  --data-urlencode 'pagination[pageSize]=50' | jq '[.data[] | {slug, blocks: [.blocks[]? | select(.__component|test("app-link|tour"))]} | select(.blocks|length>0)]'

# Workflows + step articles
curl -sG 'https://strapi.test.onesilq.com/api/workflows' \
  --data-urlencode 'populate[steps][populate][article][fields][0]=slug' \
  --data-urlencode 'pagination[pageSize]=20' | jq '.data[] | {slug, steps: [.steps[] | {label, article: .article.slug}]}'

# Page contexts
curl -sG 'https://strapi.test.onesilq.com/api/codex-page-contexts' \
  --data-urlencode 'pagination[pageSize]=50' \
  --data-urlencode 'populate[targets][populate][article][fields][0]=slug' \
  --data-urlencode 'populate[targets][populate][workflow][fields][0]=slug' | jq '.data[] | {slug, route: .routePattern, targets}'
```

Re-seed page contexts after editing `staging-page-contexts.data.mjs`:

```bash
cd silq-strapi && node scripts/seed-page-contexts-remote.mjs
```

## Page context inventory (expected)

See `scripts/staging-page-contexts.data.mjs` — **20** entries including `projects-list-active` and split `projects-workspace`.