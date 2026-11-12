import type { Core } from '@strapi/strapi';

type Audience = 'internal' | 'client' | 'all';

type ArticleSeed = {
  title: string;
  slug: string;
  description: string;
  audience: Audience;
  category: string;
  teams: string[];
  tags: string[];
  minutes: number;
  related?: string[];
  blocks: Array<Record<string, unknown>>;
};

const rich = (body: string) => ({ __component: 'shared.rich-text', body });
const callout = (tone: 'tip' | 'warning' | 'info', body: string) => ({
  __component: 'codex.callout',
  tone,
  body,
});
const appLink = (label: string, path: string) => ({
  __component: 'codex.app-link',
  label,
  path,
});

const ARTICLES: ArticleSeed[] = [
  {
    title: 'Welcome to Silq',
    slug: 'welcome-to-silq',
    description: 'What Silq is, and how work moves from a quote request to an invoice.',
    audience: 'all',
    category: 'getting-started',
    teams: ['account-managers', 'operations', 'clients'],
    tags: ['navigation'],
    minutes: 3,
    related: ['basic-navigation'],
    blocks: [
      rich(
        'Silq is the workspace for a shipment, from the first [RFQ](codex://glossary/rfq) to the invoice.\n\nThe path is: RFQ, [quote](codex://glossary/quote), acceptance, project planning, shipment execution, tasks, then invoice sharing. Each stage has an owner. See [RFQ to Quote](codex://workflow/rfq-to-quote) and [Plan and run a project](codex://workflow/plan-and-run-a-project).',
      ),
      callout(
        'tip',
        'Use the team chips in the Codex sidebar to show only the work your group owns.',
      ),
    ],
  },
  {
    title: 'Basic navigation',
    slug: 'basic-navigation',
    description: 'Where the main pages live, and how to get back to what you use most.',
    audience: 'all',
    category: 'getting-started',
    teams: ['account-managers', 'operations', 'clients'],
    tags: ['navigation'],
    minutes: 2,
    blocks: [
      rich(
        'The left navigation groups pages the way the Codex groups workflows.\n\n- **Projects, Shipments, Inspections** stay pinned at the top.\n- Admin groups cover quoting, clients, tasks, and finance.\n- Client groups cover quotes, insights, and invoices.\n\nThe bottom bar keeps your most visited links.',
      ),
    ],
  },
  {
    title: 'Help and support',
    slug: 'help-and-support',
    description: 'How the Silq team reports bugs and asks for enhancements.',
    audience: 'internal',
    category: 'getting-started',
    teams: ['account-managers', 'operations', 'finops', 'procurement'],
    tags: ['navigation'],
    minutes: 3,
    blocks: [
      rich(
        'Report a bug from the bug button. Choose **Blocker** when you cannot finish a core task, and **Non-Blocker** when the issue is internal only.\n\nSay what you were doing, what happened, and what should have happened. Enhancement requests use the same channel, with **Must-Have** or **Nice-to-Have**.\n\nSubmissions land in the #bugs Slack channel.',
      ),
      callout(
        'info',
        'Billing questions go to Finance Operations. Client-facing questions go to the account manager on the account.',
      ),
    ],
  },
  {
    title: 'Create an RFQ',
    slug: 'create-an-rfq',
    description: 'Start a request for quote from the RFQ page or the sidebar.',
    audience: 'all',
    category: 'quoting',
    teams: ['account-managers', 'clients'],
    tags: ['rfq'],
    minutes: 3,
    blocks: [
      rich(
        'An [RFQ](codex://glossary/rfq) is the start of every transaction. Account managers create them for clients, and clients can submit their own.\n\n1. Open RFQ from the left navigation, or Request Quote at the bottom of the sidebar.\n2. Choose **New Quote Request**. The form opens at `/rfqs/new`.\n3. Pick a service type: Shipping, Inspection, or both (Silq Pro).',
      ),
      appLink('New quote request', '/rfqs/new'),
    ],
  },
  {
    title: 'Fill in the RFQ details',
    slug: 'fill-in-rfq-details',
    description: 'The fields that define a shipping or inspection request.',
    audience: 'all',
    category: 'quoting',
    teams: ['account-managers', 'clients'],
    tags: ['rfq'],
    minutes: 5,
    blocks: [
      rich(
        '**Shipping.** Name the RFQ, pick the client, and set [incoterms](codex://glossary/incoterms), cargo ready date, and target delivery. Choose coverage (port to port, door to door, and the mixed options), freight mode, and origin and destination.\n\nFor [FCL](codex://glossary/fcl), enter container type and quantity. For [LCL](codex://glossary/lcl) or air, enter weight, volume, and package dimensions. Add PO numbers and the estimated cargo value.\n\n**Inspection.** Add the factory location, inspection types, product category, [SKU](codex://glossary/sku) count, order stage, quantity, and the anticipated date.',
      ),
      callout(
        'warning',
        'Service coverage decides which origin and destination fields are required. Door coverage needs an address, not only a port.',
      ),
    ],
  },
  {
    title: 'Submit the RFQ',
    slug: 'submit-the-rfq',
    description: 'What happens when a request leaves draft and becomes a project.',
    audience: 'all',
    category: 'quoting',
    teams: ['account-managers', 'clients'],
    tags: ['rfq', 'project'],
    minutes: 2,
    blocks: [
      rich(
        'Submit validates the required fields and moves the RFQ from Draft to Submitted.\n\nSilq creates a [project](codex://glossary/project) and links it to the request, then notifies the people on the account.',
      ),
    ],
  },
  {
    title: 'Build a quote',
    slug: 'build-a-quote',
    description: 'How account managers review, refine, and share a quote.',
    audience: 'internal',
    category: 'quoting',
    teams: ['account-managers'],
    tags: ['quote'],
    minutes: 4,
    blocks: [
      rich(
        'After submit, Silq can generate a shell [quote](codex://glossary/quote) automatically, or an account manager builds one by hand.\n\nReview the shell on the project Quotes tab. Adjust rates, then share the quote with the client. The client accepts or declines from their quotes list.',
      ),
      callout(
        'info',
        'This step is for account managers. Clients see the shared quote, not the shell.',
      ),
    ],
  },
  {
    title: 'Accept a quote and create the shipment',
    slug: 'accept-a-quote',
    description: 'Acceptance turns the chosen quote into a shipment.',
    audience: 'all',
    category: 'quoting',
    teams: ['account-managers', 'clients', 'operations'],
    tags: ['quote', 'shipment'],
    minutes: 2,
    related: ['assign-collaborators'],
    blocks: [
      rich(
        'When the client accepts a quote, Silq creates the [shipment](codex://glossary/shipment) from it.\n\nOperations then opens the project planning wizard: collaborators, routes, products, and task templates. Continue in [Plan and run a project](codex://workflow/plan-and-run-a-project).',
      ),
    ],
  },
  {
    title: 'Assign collaborators',
    slug: 'assign-collaborators',
    description: 'Give each role on the project a person.',
    audience: 'internal',
    category: 'projects',
    teams: ['operations'],
    tags: ['project'],
    minutes: 3,
    blocks: [
      rich(
        'Step one of the planning wizard is the team. Assign a person to each role on the project. Those [collaborators](codex://glossary/collaborator) are who get the tasks that follow.',
      ),
    ],
  },
  {
    title: 'Apply a project template',
    slug: 'apply-a-project-template',
    description: 'Start a project from a saved shape instead of a blank plan.',
    audience: 'internal',
    category: 'projects',
    teams: ['operations'],
    tags: ['project'],
    minutes: 3,
    blocks: [
      rich(
        'A project template is a reusable plan. Applying one fills the project with the standard structure for that kind of work, so the team is not assembling the same plan by hand each time.',
      ),
    ],
  },
  {
    title: 'Apply task templates',
    slug: 'apply-task-templates',
    description: 'Generate the work plan from task templates.',
    audience: 'internal',
    category: 'projects',
    teams: ['operations'],
    tags: ['project'],
    minutes: 3,
    blocks: [
      rich(
        'Task templates are the last step of the wizard. Applying them generates the tasks the team will execute. Each task lands with the role you assigned to a [collaborator](codex://glossary/collaborator).',
      ),
      callout(
        'tip',
        'Assign collaborators before task templates, so the generated tasks have owners.',
      ),
    ],
  },
  {
    title: 'Upload products',
    slug: 'upload-products',
    description: 'Add the cargo to the project before execution.',
    audience: 'internal',
    category: 'projects',
    teams: ['operations'],
    tags: ['project'],
    minutes: 2,
    blocks: [
      rich(
        'Add the products on the project so the shipment, the inspections, and the documents all point at the same cargo. You can upload them in the planning wizard.',
      ),
    ],
  },
  {
    title: 'Plan the shipment route',
    slug: 'plan-the-shipment-route',
    description: 'Confirm how the cargo moves from origin to destination.',
    audience: 'internal',
    category: 'projects',
    teams: ['operations'],
    tags: ['shipment'],
    minutes: 3,
    blocks: [
      rich(
        'Confirm or edit the route: the legs, the mode, and the ports. As the cargo moves, operations updates the shipment status and the route from the shipment page.',
      ),
    ],
  },
  {
    title: 'Complete tasks',
    slug: 'complete-tasks',
    description: 'Mark work done as the shipment progresses.',
    audience: 'internal',
    category: 'projects',
    teams: ['operations'],
    tags: ['project', 'shipment'],
    minutes: 2,
    blocks: [
      rich(
        'Open the tasks dashboard or the project plan and mark each task complete as the work finishes. The project stays the record of what is left.',
      ),
    ],
  },
];

const WORKFLOWS = [
  {
    title: 'RFQ to Quote',
    slug: 'rfq-to-quote',
    summary:
      'Create a request, fill it in, submit it, build the quote, and turn acceptance into a shipment.',
    category: 'quoting',
    teams: ['account-managers', 'clients'],
    tags: ['rfq', 'quote'],
    audience: 'all' as Audience,
    ordinal: 1,
    steps: [
      ['Create an RFQ', 'create-an-rfq'],
      ['Fill in the details', 'fill-in-rfq-details'],
      ['Submit', 'submit-the-rfq'],
      ['Build the quote', 'build-a-quote'],
      ['Accept and ship', 'accept-a-quote'],
    ],
  },
  {
    title: 'Plan and run a project',
    slug: 'plan-and-run-a-project',
    summary:
      'Staff the project, apply templates, add products, plan the route, and complete the tasks.',
    category: 'projects',
    teams: ['operations'],
    tags: ['project', 'shipment'],
    audience: 'internal' as Audience,
    ordinal: 1,
    steps: [
      ['Collaborators', 'assign-collaborators'],
      ['Project template', 'apply-a-project-template'],
      ['Task templates', 'apply-task-templates'],
      ['Products', 'upload-products'],
      ['Route', 'plan-the-shipment-route'],
      ['Complete tasks', 'complete-tasks'],
    ],
  },
];

const FAQS = [
  {
    question: 'Who creates an RFQ?',
    answer:
      'Account managers create RFQs for their clients. A client can also submit one from their own navigation.',
    audience: 'all' as Audience,
    workflow: 'rfq-to-quote',
    teams: ['account-managers', 'clients'],
    ordinal: 1,
  },
  {
    question: 'What is the difference between Shipping, Inspection, and Silq Pro?',
    answer:
      'Shipping moves freight. Inspection is a quality check at the factory. Silq Pro is both on the same request.',
    audience: 'all' as Audience,
    workflow: 'rfq-to-quote',
    teams: ['account-managers', 'clients'],
    ordinal: 2,
  },
  {
    question: 'When does a project get created?',
    answer:
      'Submitting the RFQ creates the project and links it to the request. The project is where planning happens after a quote is accepted.',
    audience: 'all' as Audience,
    workflow: 'rfq-to-quote',
    teams: ['account-managers', 'operations'],
    ordinal: 3,
  },
  {
    question: 'Can a client see the quote while I am still editing it?',
    answer:
      'No. The shell quote stays with the account manager until it is shared. Sharing is a separate action.',
    audience: 'internal' as Audience,
    workflow: 'rfq-to-quote',
    teams: ['account-managers'],
    ordinal: 4,
  },
  {
    question: 'What happens when a client accepts a quote?',
    answer:
      'Silq creates the shipment from the accepted quote. Operations then plans collaborators, routes, products, and tasks.',
    audience: 'all' as Audience,
    workflow: 'rfq-to-quote',
    teams: ['account-managers', 'operations', 'clients'],
    ordinal: 5,
  },
  {
    question: 'Which order should I use in the planning wizard?',
    answer:
      'Collaborators, then the route, then products, then task templates. Templates generate tasks for the people you already assigned.',
    audience: 'internal' as Audience,
    workflow: 'plan-and-run-a-project',
    teams: ['operations'],
    ordinal: 6,
  },
  {
    question: 'Where do I mark a task complete?',
    answer:
      'On the tasks dashboard or inside the project plan. Completing a task is how the project shows what is left.',
    audience: 'internal' as Audience,
    workflow: 'plan-and-run-a-project',
    teams: ['operations'],
    ordinal: 7,
  },
  {
    question: 'Who do I contact for a billing question?',
    answer:
      'Finance Operations owns invoices and payment tracking. Product bugs and enhancements go through the bug button to #bugs.',
    audience: 'all' as Audience,
    teams: ['finops', 'clients'],
    ordinal: 8,
  },
];

const GLOSSARY: Array<[string, string, string]> = [
  ['RFQ', 'rfq', 'Request for quote. The starting record of what the client needs moved or inspected.'],
  ['Quote', 'quote', 'The priced offer built from an RFQ and shared with the client for acceptance.'],
  ['Incoterms', 'incoterms', 'Trade terms such as FOB, CIF, or DDP that say who pays for each leg and where risk transfers.'],
  ['FCL', 'fcl', 'Full container load. Cargo that fills one or more containers, priced per container.'],
  ['LCL', 'lcl', 'Less than container load. Cargo consolidated with other shipments, priced on weight and volume.'],
  ['Cargo ready date', 'cargo-ready-date', 'The date the cargo will be ready for pickup at origin.'],
  ['Project', 'project', 'The workspace created when an RFQ is submitted. Planning and tasks live here.'],
  ['Shipment', 'shipment', 'The execution record created when a client accepts a quote.'],
  ['Task template', 'task-template', 'A reusable task definition. Applying templates generates the project work plan.'],
  ['Collaborator', 'collaborator', 'A person assigned to a role on a project. Generated tasks are owned by these roles.'],
  ['QuickBooks', 'quickbooks', 'The accounting system FinOps syncs when sharing invoices with a client.'],
  ['FinOps', 'finops', 'Finance Operations. The team that shares invoices, tracks payment, and handles invoice questions.'],
  ['Account manager', 'account-manager', 'The Silq owner of a client relationship, from the RFQ through the shared quote.'],
  ['PO', 'po', 'Purchase order. A client order number that can be linked to an RFQ and its cargo.'],
  ['SKU', 'sku', 'Stock keeping unit. A distinct product. Inspection RFQs ask how many unique SKUs are in the order.'],
];

async function findBySlug(
  strapi: Core.Strapi,
  uid: Parameters<Core.Strapi['documents']>[0],
  slug: string,
) {
  const rows = await strapi.documents(uid).findMany({
    filters: { slug } as never,
    limit: 1,
  });
  return rows[0] ?? null;
}

export async function seedCodex(strapi: Core.Strapi) {
  const already = await findBySlug(strapi, 'api::workflow.workflow', 'rfq-to-quote');
  if (already) return;

  const teamIds = new Map<string, string>();
  const teams = [
    ['Account Managers', 'account-managers', 'internal', 1],
    ['Operations', 'operations', 'internal', 2],
    ['FinOps', 'finops', 'internal', 3],
    ['Procurement', 'procurement', 'internal', 4],
    ['Clients', 'clients', 'client', 5],
  ] as const;
  for (const [name, slug, audience, ordinal] of teams) {
    const created = await strapi.documents('api::team.team').create({
      data: { name, slug, audience, ordinal },
    });
    teamIds.set(slug, created.documentId);
  }

  const tagIds = new Map<string, string>();
  for (const [name, slug] of [
    ['RFQ', 'rfq'],
    ['Quote', 'quote'],
    ['Project', 'project'],
    ['Shipment', 'shipment'],
    ['Navigation', 'navigation'],
  ] as const) {
    const created = await strapi.documents('api::tag.tag').create({
      data: { name, slug },
    });
    tagIds.set(slug, created.documentId);
  }

  const categoryIds = new Map<string, string>();
  const categories = [
    ['Getting Started', 'getting-started', 'home', 'all', 1, 'Orientation for anyone using Silq.'],
    ['Quoting', 'quoting', 'quotes', 'all', 2, 'From the request for quote through acceptance.'],
    ['Projects', 'projects', 'project', 'internal', 3, 'How operations plans and runs a project.'],
  ] as const;
  for (const [name, slug, icon, audience, ordinal, description] of categories) {
    const created = await strapi.documents('api::category.category').create({
      data: { name, slug, icon, audience, ordinal, description },
    });
    categoryIds.set(slug, created.documentId);
  }

  const connect = (ids: string[]) => ({ connect: ids });
  const articleIds = new Map<string, string>();

  for (const article of ARTICLES) {
    const created = await strapi.documents('api::article.article').create({
      data: {
        title: article.title,
        slug: article.slug,
        description: article.description,
        audience: article.audience,
        estimatedReadMinutes: article.minutes,
        category: categoryIds.get(article.category),
        teams: connect(article.teams.map((slug) => teamIds.get(slug)!)),
        tags: connect(article.tags.map((slug) => tagIds.get(slug)!)),
        blocks: article.blocks as never,
      },
      status: 'published',
    });
    articleIds.set(article.slug, created.documentId);
  }

  for (const article of ARTICLES) {
    if (!article.related?.length) continue;
    await strapi.documents('api::article.article').update({
      documentId: articleIds.get(article.slug)!,
      data: {
        relatedArticles: connect(article.related.map((slug) => articleIds.get(slug)!)),
      },
      status: 'published',
    });
  }

  const workflowIds = new Map<string, string>();
  for (const workflow of WORKFLOWS) {
    const created = await strapi.documents('api::workflow.workflow').create({
      data: {
        title: workflow.title,
        slug: workflow.slug,
        summary: workflow.summary,
        audience: workflow.audience,
        ordinal: workflow.ordinal,
        category: categoryIds.get(workflow.category),
        teams: connect(workflow.teams.map((slug) => teamIds.get(slug)!)),
        tags: connect(workflow.tags.map((slug) => tagIds.get(slug)!)),
        steps: workflow.steps.map(([label, slug]) => ({
          label,
          article: articleIds.get(slug),
        })),
      },
      status: 'published',
    });
    workflowIds.set(workflow.slug, created.documentId);
  }

  for (const faq of FAQS) {
    await strapi.documents('api::faq.faq').create({
      data: {
        question: faq.question,
        answer: faq.answer,
        audience: faq.audience,
        ordinal: faq.ordinal,
        workflow: faq.workflow ? workflowIds.get(faq.workflow) : undefined,
        teams: connect(faq.teams.map((slug) => teamIds.get(slug)!)),
      },
      status: 'published',
    });
  }

  for (const [term, slug, definition] of GLOSSARY) {
    await strapi.documents('api::glossary-term.glossary-term').create({
      data: { term, slug, definition },
    });
  }

  await strapi.documents('api::codex-home.codex-home').create({
    data: {
      launcherLabel: 'Silq Codex',
      sections: [
        {
          __component: 'codex.hero',
          title: 'Silq Codex',
          subtitle: 'Workflows, references, and answers for running work in Silq.',
        },
        {
          __component: 'codex.announcement',
          title: 'Two workflows to start',
          body: 'RFQ to Quote and Plan and run a project are ready. More workflows can be added here without a release.',
        },
        { __component: 'codex.featured-workflows', heading: 'Workflows' },
        { __component: 'codex.bucket-grid', heading: 'Browse' },
        { __component: 'codex.faq-highlights', heading: 'Common questions', limit: 4 },
      ],
    },
    status: 'published',
  });

  strapi.log.info('Codex seed created');
}
