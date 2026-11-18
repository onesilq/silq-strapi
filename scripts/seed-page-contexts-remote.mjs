/**
 * Create/publish Page context entries on a remote Strapi via the Content Manager API.
 *
 *   STRAPI_URL=https://strapi.test.onesilq.com \
 *   STRAPI_API_TOKEN=<content-manager token> \
 *   node scripts/seed-page-contexts-remote.mjs
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { STAGING_PAGE_CONTEXTS } from "./staging-page-contexts.data.mjs";

const UID = "api::codex-page-context.codex-page-context";
const base =
  process.env.STRAPI_URL?.replace(/\/$/, "") ??
  "https://strapi.test.onesilq.com";

function resolveToken() {
  if (process.env.STRAPI_ADMIN_JWT) return process.env.STRAPI_ADMIN_JWT;
  const jwtFile = process.env.STRAPI_ADMIN_JWT_FILE;
  if (jwtFile) return readFileSync(jwtFile, "utf8").trim();
  if (process.env.STRAPI_API_TOKEN) return process.env.STRAPI_API_TOKEN;
  const here = dirname(fileURLToPath(import.meta.url));
  const mcpPath = resolve(here, "../../.cursor/mcp.json");
  try {
    const raw = JSON.parse(readFileSync(mcpPath, "utf8"));
    const header = raw?.mcpServers?.["strapi-mcp-staging"]?.headers?.Authorization;
    if (header?.startsWith("Bearer ")) return header.slice(7);
  } catch {
    /* optional local fallback */
  }
  return null;
}

const token = resolveToken();

if (!token) {
  console.error("Set STRAPI_API_TOKEN or configure .cursor/mcp.json strapi-mcp-staging");
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

async function cmGet(path) {
  const res = await fetch(`${base}${path}`, { headers });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`GET ${path} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function cmPost(path, payload) {
  const res = await fetch(`${base}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`POST ${path} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

async function cmPut(path, payload) {
  const res = await fetch(`${base}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(payload),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`PUT ${path} ${res.status}: ${JSON.stringify(body)}`);
  }
  return body;
}

const adminPrefix = process.env.STRAPI_ADMIN_PREFIX ?? "";
const listPath = `${adminPrefix}/content-manager/collection-types/${UID}`;

async function findExistingBySlug(slug) {
  const q = new URLSearchParams({
    page: "1",
    pageSize: "1",
    filters: JSON.stringify({ slug: { $eq: slug } }),
  });
  const data = await cmGet(`${listPath}?${q}`);
  return data?.results?.[0] ?? null;
}

async function loadArticleMap() {
  const map = new Map();
  let page = 1;
  for (;;) {
    const q = new URLSearchParams({
      page: String(page),
      pageSize: "100",
      status: "published",
    });
    const data = await cmGet(
      `${adminPrefix}/content-manager/collection-types/api::article.article?${q}`,
    );
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
  const data = await cmGet(
    `${adminPrefix}/content-manager/collection-types/api::workflow.workflow?${q}`,
  );
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
    if (!documentId) {
      console.warn(`  missing article: ${slug}`);
      continue;
    }
    const isPrimary = !primarySet;
    primarySet = true;
    targets.push({
      __component: "codex.page-target",
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
        __component: "codex.page-target",
        targetType: "workflow",
        workflow: { connect: [{ documentId }] },
        workflowStep: def.workflowStep ?? 1,
        isPrimary: !primarySet,
      });
    } else {
      console.warn(`  missing workflow: ${def.workflowSlug}`);
    }
  }
  return targets;
}

function buildData(def, articles, workflows) {
  const targets = buildTargets(def, articles, workflows);
  if (targets.length === 0) throw new Error("no targets resolved");
  return {
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
}

async function publish(documentId) {
  await cmPost(`${listPath}/${documentId}/actions/publish`, {});
}

async function main() {
  const articles = await loadArticleMap();
  const workflows = await loadWorkflowMap();
  console.log(`Articles: ${articles.size}, workflows: ${workflows.size}`);

  for (const def of STAGING_PAGE_CONTEXTS) {
    const existing = await findExistingBySlug(def.slug);
    const data = buildData(def, articles, workflows);
    if (existing?.documentId) {
      console.log(`Update: ${def.slug}`);
      await cmPut(`${listPath}/${existing.documentId}`, data);
      if (existing.status !== "published") await publish(existing.documentId);
      continue;
    }
    console.log(`Create: ${def.slug}`);
    const created = await cmPost(listPath, data);
    const documentId =
      created?.data?.documentId ?? created?.documentId ?? created?.data?.id;
    if (!documentId) {
      throw new Error(`create response missing documentId for ${def.slug}`);
    }
    await publish(documentId);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});