/**
 * Seed page contexts through the staging Strapi MCP HTTP endpoint (same auth as Cursor).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { STAGING_PAGE_CONTEXTS } from "./staging-page-contexts.data.mjs";

const MCP_URL = "https://strapi.test.onesilq.com/mcp";

function mcpAuth() {
  const here = dirname(fileURLToPath(import.meta.url));
  const mcpPath = resolve(here, "../../.cursor/mcp.json");
  const raw = JSON.parse(readFileSync(mcpPath, "utf8"));
  return raw.mcpServers["strapi-mcp-staging"].headers.Authorization;
}

let rpcId = 1;

async function mcpCall(method, params) {
  const res = await fetch(MCP_URL, {
    method: "POST",
    headers: {
      Authorization: mcpAuth(),
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: rpcId++,
      method,
      params,
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`MCP ${method} ${res.status}: ${text.slice(0, 500)}`);
  const line = text.split("\n").find((l) => l.startsWith("data:"));
  const payload = line ? JSON.parse(line.slice(5).trim()) : JSON.parse(text);
  if (payload.error) throw new Error(JSON.stringify(payload.error));
  return payload.result;
}

async function mcpTool(name, args) {
  const result = await mcpCall("tools/call", { name, arguments: args });
  const block = result?.content?.[0];
  if (block?.type === "text") return JSON.parse(block.text);
  return result;
}

async function listAllArticles() {
  const map = new Map();
  for (let page = 1; page <= 5; page++) {
    const data = await mcpTool("list_article", {
      page,
      pageSize: 10,
      status: "published",
    });
    for (const row of data.results ?? []) {
      map.set(row.slug, row.documentId);
    }
    if (page >= (data.pagination?.pageCount ?? 1)) break;
  }
  return map;
}

async function listAllWorkflows() {
  const map = new Map();
  const data = await mcpTool("list_workflow", {
    page: 1,
    pageSize: 100,
    status: "published",
  });
  for (const row of data.results ?? []) {
    map.set(row.slug, row.documentId);
  }
  return map;
}

function buildPayload(def, articles, workflows) {
  const targets = [];
  let primarySet = false;
  for (const slug of def.articleSlugs) {
    const documentId = articles.get(slug);
    if (!documentId) {
      console.warn(`  missing article ${slug}`);
      continue;
    }
    const isPrimary = !primarySet;
    primarySet = true;
    targets.push({
      targetType: "article",
      article: documentId,
      workflowStep: 1,
      isPrimary,
    });
  }
  if (def.workflowSlug) {
    const documentId = workflows.get(def.workflowSlug);
    if (documentId) {
      targets.push({
        targetType: "workflow",
        workflow: documentId,
        workflowStep: def.workflowStep ?? 1,
        isPrimary: !primarySet,
      });
    }
  }
  if (targets.length === 0) throw new Error("no targets");
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

async function main() {
  await mcpCall("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "seed-page-contexts", version: "1.0.0" },
  });

  const tools = await mcpCall("tools/list", {});
  const names = (tools.tools ?? []).map((t) => t.name);
  const createName = names.find((n) => n.includes("page-context") && n.startsWith("create"));
  if (!createName) {
    console.error(
      "No create_codex-page-context MCP tool on staging. Available:",
      names.filter((n) => n.startsWith("create")).join(", "),
    );
    process.exit(1);
  }
  const publishName = names.find(
    (n) => n.includes("page-context") && n.startsWith("publish"),
  );

  const articles = await listAllArticles();
  const workflows = await listAllWorkflows();
  console.log(`Resolved ${articles.size} articles, ${workflows.size} workflows`);

  for (const def of STAGING_PAGE_CONTEXTS) {
    const data = buildPayload(def, articles, workflows);
    console.log(`Upsert ${def.slug} via ${createName}`);
    const created = await mcpTool(createName, { data });
    const documentId = created?.documentId ?? created?.data?.documentId;
    if (publishName && documentId && created?.status !== "published") {
      await mcpTool(publishName, { documentId });
    }
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});