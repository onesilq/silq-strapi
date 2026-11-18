/**
 * Local demo seeds for Codex page contexts. Stop Strapi before running:
 *   node scripts/seed-page-context.mjs
 */
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createStrapi } = require('@strapi/strapi');

const UID = 'api::codex-page-context.codex-page-context';

const SAMPLE_CONTEXTS = [
  {
    title: 'RFQ new form',
    slug: 'rfqs-new',
    routePattern: '/rfqs/new',
    panelTitle: 'Guides for new RFQ',
    panelSubtitle: 'Create and send a quote request',
    priority: 10,
    audience: 'all',
    articleSlug: 'create-an-rfq',
  },
  {
    title: 'Projects active',
    slug: 'projects-active',
    routePattern: '/projects',
    panelTitle: 'Guides for projects',
    priority: 5,
    audience: 'all',
    queryRules: [{ key: 'config', value: 'active' }],
    articleSlug: 'manage-projects',
  },
];

async function articleIdBySlug(strapi, slug) {
  const article = await strapi.documents('api::article.article').findFirst({
    filters: { slug },
    fields: ['slug'],
  });
  return article?.documentId ?? null;
}

async function main() {
  const strapi = await createStrapi({ distDir: './dist' }).load();
  try {
    for (const sample of SAMPLE_CONTEXTS) {
      const existing = await strapi.documents(UID).findFirst({
        filters: { slug: sample.slug },
      });
      if (existing) {
        console.log(`Skip (exists): ${sample.slug}`);
        continue;
      }
      const articleDocumentId = await articleIdBySlug(strapi, sample.articleSlug);
      if (!articleDocumentId) {
        console.warn(`Skip ${sample.slug}: article ${sample.articleSlug} not found`);
        continue;
      }
      await strapi.documents(UID).create({
        data: {
          title: sample.title,
          slug: sample.slug,
          routePattern: sample.routePattern,
          panelTitle: sample.panelTitle,
          panelSubtitle: sample.panelSubtitle ?? '',
          priority: sample.priority,
          audience: sample.audience,
          queryRules: sample.queryRules ?? [],
          targets: [
            {
              targetType: 'article',
              article: articleDocumentId,
              workflowStep: 1,
              isPrimary: true,
            },
          ],
        },
        status: 'published',
      });
      console.log(`Created: ${sample.slug}`);
    }
  } finally {
    await strapi.destroy();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});