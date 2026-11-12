import type { Core } from '@strapi/strapi';

import { seedCodex } from './codex/seed';

const PUBLIC_READ_ACTIONS = [
  'api::team.team.find',
  'api::team.team.findOne',
  'api::tag.tag.find',
  'api::tag.tag.findOne',
  'api::category.category.find',
  'api::category.category.findOne',
  'api::workflow.workflow.find',
  'api::workflow.workflow.findOne',
  'api::article.article.find',
  'api::article.article.findOne',
  'api::faq.faq.find',
  'api::faq.faq.findOne',
  'api::glossary-term.glossary-term.find',
  'api::glossary-term.glossary-term.findOne',
  'api::codex-home.codex-home.find',
  'api::author.author.find',
  'api::author.author.findOne',
];

async function grantPublicReads(strapi: Core.Strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) {
    strapi.log.warn('Codex: Public role not found, skipping read permissions');
    return;
  }

  const existing = await strapi.db
    .query('plugin::users-permissions.permission')
    .findMany({
      where: { role: publicRole.id, action: { $in: PUBLIC_READ_ACTIONS } },
    });
  const granted = new Set(existing.map((permission) => permission.action));

  await Promise.all(
    PUBLIC_READ_ACTIONS.filter((action) => !granted.has(action)).map((action) =>
      strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      }),
    ),
  );
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Strapi cannot see the Silq session, so it cannot decide who may read
    // internal entries. Production calls this API with a server-held token
    // and applies audience and team filters there. Anonymous read exists
    // only as a local demo switch.
    if (process.env.CODEX_ALLOW_PUBLIC_READ === 'true') {
      await grantPublicReads(strapi);
    }
    if (process.env.NODE_ENV !== 'production') {
      await seedCodex(strapi);
    }
  },
};
