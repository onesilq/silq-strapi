/**
 * Prints a self-contained async IIFE for in-browser seeding (admin session cookies).
 *   node scripts/emit-browser-seed.mjs > /tmp/staging-seed.js
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { STAGING_PAGE_CONTEXTS } from "./staging-page-contexts.data.mjs";

const UID = "api::codex-page-context.codex-page-context";
const prefix = "/content-manager/collection-types";

const script = `(() => {
  const DEFS = ${JSON.stringify(STAGING_PAGE_CONTEXTS)};
  const UID = ${JSON.stringify(UID)};
  const prefix = ${JSON.stringify(prefix)};
  const origin = location.origin;
  const authHeaders = () => {
    const raw = localStorage.getItem("jwtToken");
  if (!raw) throw new Error("No admin jwtToken in localStorage");
    const jwt = JSON.parse(raw);
    return { Authorization: "Bearer " + jwt };
  };

  async function cmGet(path) {
    const res = await fetch(origin + path, { headers: authHeaders() });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error("GET " + path + " " + res.status + " " + JSON.stringify(body));
    return body;
  }
  async function cmPost(path, payload) {
    const res = await fetch(origin + path, {
      method: "POST",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error("POST " + path + " " + res.status + " " + JSON.stringify(body));
    return body;
  }
  async function cmPut(path, payload) {
    const res = await fetch(origin + path, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error("PUT " + path + " " + res.status + " " + JSON.stringify(body));
    return body;
  }

  async function loadArticleMap() {
    const map = new Map();
    let page = 1;
    for (;;) {
      const q = new URLSearchParams({ page: String(page), pageSize: "100", status: "published" });
      const data = await cmGet(prefix + "/api::article.article?" + q);
      for (const row of data.results ?? []) {
        if (row.slug) map.set(row.slug, row.documentId);
      }
      if (page >= (data.pagination?.pageCount ?? 1)) break;
      page += 1;
    }
    return map;
  }

  async function loadWorkflowMap() {
    const map = new Map();
    const q = new URLSearchParams({ page: "1", pageSize: "100", status: "published" });
    const data = await cmGet(prefix + "/api::workflow.workflow?" + q);
    for (const row of data.results ?? []) {
      if (row.slug) map.set(row.slug, row.documentId);
    }
    return map;
  }

  function buildTargets(def, articles, workflows) {
    const targets = [];
    let primarySet = false;
    for (const slug of def.articleSlugs) {
      const documentId = articles.get(slug);
      if (!documentId) continue;
      const isPrimary = !primarySet;
      primarySet = true;
      targets.push({
        targetType: "article",
        article: { connect: [{ documentId }] },
        workflowStep: 1,
        isPrimary,
      });
    }
    if (def.workflowSlug) {
      const documentId = workflows.get(def.workflowSlug);
      if (documentId) {
        targets.push({
          targetType: "workflow",
          workflow: { connect: [{ documentId }] },
          workflowStep: def.workflowStep ?? 1,
          isPrimary: !primarySet,
        });
      }
    }
    return targets;
  }

  return (async () => {
    const articles = await loadArticleMap();
    const workflows = await loadWorkflowMap();
    const listPath = prefix + "/" + UID;
    const log = [];
    for (const def of DEFS) {
      const q = new URLSearchParams({
        page: "1",
        pageSize: "1",
        filters: JSON.stringify({ slug: { $eq: def.slug } }),
      });
      const existing = (await cmGet(listPath + "?" + q)).results?.[0];
      const targets = buildTargets(def, articles, workflows);
      if (!targets.length) {
        log.push({ slug: def.slug, error: "no targets" });
        continue;
      }
      const data = {
        title: def.title,
        slug: def.slug,
        routePattern: def.routePattern,
        panelTitle: def.panelTitle,
        panelSubtitle: def.panelSubtitle ?? "",
        priority: def.priority,
        audience: def.audience,
        queryRules: def.queryRules ?? [],
        targets,
      };
      let documentId = existing?.documentId;
      if (documentId) {
        await cmPut(listPath + "/" + documentId, { data });
        log.push({ slug: def.slug, action: "update", documentId });
      } else {
        const created = await cmPost(listPath, { data });
        documentId = created?.data?.documentId ?? created?.documentId;
        log.push({ slug: def.slug, action: "create", documentId });
      }
      if (documentId && existing?.status !== "published") {
        await cmPost(listPath + "/" + documentId + "/actions/publish", {});
        log.push({ slug: def.slug, published: true });
      } else if (!existing) {
        await cmPost(listPath + "/" + documentId + "/actions/publish", {});
        log.push({ slug: def.slug, published: true });
      }
    }
    return { log, articles: articles.size, workflows: workflows.size };
  })();
})()`;

const outPath = resolve(dirname(fileURLToPath(import.meta.url)), ".browser-seed-eval.txt");
writeFileSync(outPath, script, "utf8");
console.log(outPath, script.length, "chars");