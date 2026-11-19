import type { Project } from '@/lib/types';
import { SAMPLE_BRIEF } from './sampleBrief';

export function loadSampleProject(): Project {
  return {
    id: 'sample-harbor-lane',
    name: 'Harbor Lane Coffee — Online store',
    createdAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
    brief: SAMPLE_BRIEF,
    analysis: {
      projectType: 'E-commerce website',
      summary:
        'Harbor Lane Coffee, a small specialty coffee roaster, wants a website with a simple online store: 20-30 product pages with photos, a shopping cart, Stripe payments, a brewing-guide blog, and a newsletter signup. They want to launch before the December holiday season with a budget around $1,500.',
      deliverables: [
        { id: 'sd-1', title: 'Brand website', detail: 'A public website for the Harbor Lane Coffee brand.', supported: true },
        { id: 'sd-2', title: 'Online store (20-30 products)', detail: 'Product browsing with around 20-30 product pages.', supported: true },
        { id: 'sd-3', title: 'Shopping cart', detail: 'Cart functionality for ordering products.', supported: true },
        { id: 'sd-4', title: 'Stripe payment integration', detail: 'They already use Stripe for invoices and want it connected.', supported: true },
        { id: 'sd-5', title: 'Brewing guide blog section', detail: 'Mentioned as "nice to have" for posting brewing guides.', supported: true },
        { id: 'sd-6', title: 'Newsletter signup page', detail: 'A page where visitors can sign up for the newsletter.', supported: true },
        { id: 'sd-7', title: 'Product photography coordination', detail: 'They asked for help getting product photos taken.', supported: true },
      ],
      missingInfo: [
        'Domain name and hosting: not mentioned who owns or pays for these.',
        'Product catalogue details: the final product list, prices, and variants are not defined.',
        'Content readiness: product descriptions are promised but no deadline for delivering them.',
        'Photography: who arranges and pays for the photo shoot, and where it happens.',
        'Newsletter tool: which email service the signup should connect to.',
        'Order operations: how orders, delivery, and refunds will be handled day to day.',
        'Wix site access: whether the half-built Wix site or its assets should be reused.',
        'Revision expectations: how many rounds of design feedback are included.',
      ],
      assumptions: [
        'The store launches with payments via Stripe only.',
        'Product data for 20-30 products will be supplied by the client in a structured format.',
        'The photo shoot is coordinated with the client but photographer fees are confirmed separately.',
        'The blog is a simple post list, not a full content marketing platform.',
        'Flat-rate shipping within the client\'s home market; cross-border shipping and duties are out of scope.',
      ],
      risks: [
        { severity: 'high', text: 'The client wants to launch "asap" before the December holiday season — a fixed market deadline with an informal scope. Agree on a launch date before starting.' },
        { severity: 'medium', text: 'Budget is stated with a cap ("around $1,500") but the client says they are "flexible" — confirm the real ceiling early.' },
        { severity: 'medium', text: 'Product photography is a dependency the client partially owns; delays in shoot or product info will delay launch.' },
        { severity: 'low', text: 'A previous half-finished Wix site exists — clarify whether any of it should be reused or migrated.' },
      ],
      questions: [
        'What is the exact launch date you need the store live before December?',
        'Can you share the full product list with prices, and who writes the descriptions and by when?',
        'Do you already own a domain name, and who should arrange hosting?',
        'Should we reuse anything from the half-built Wix site, or start fresh?',
        'Who is responsible for the photographer, and what is the budget for the shoot?',
        'How should orders be fulfilled — who handles delivery and returns?',
      ],
    },
    analysisSource: 'fallback',
    analysisModel: null,
    scope: {
      deliverables: [
        { id: 'sd-1', title: 'Brand website', detail: 'A public website for the Harbor Lane Coffee brand.', supported: true },
        { id: 'sd-2', title: 'Online store (20-30 products)', detail: 'Product browsing with around 20-30 product pages.', supported: true },
        { id: 'sd-3', title: 'Shopping cart', detail: 'Cart functionality for ordering products.', supported: true },
        { id: 'sd-4', title: 'Stripe payment integration', detail: 'Connect their existing Stripe account for checkout.', supported: true },
        { id: 'sd-5', title: 'Brewing guide blog section', detail: 'A simple blog where the team can post brewing guides.', supported: true },
        { id: 'sd-6', title: 'Newsletter signup page', detail: 'Signup form connected to their email tool.', supported: true },
      ],
      timeline: '8 weeks from receiving all product content: 2 weeks design, 4 weeks build, 1 week content population, 1 week testing and launch.',
      clientResponsibilities: [
        'Provide final product list with prices and descriptions by the end of week 2.',
        'Coordinate and attend the product photo shoot; confirm photographer fees.',
        'Provide Stripe account details and domain registrar access.',
        'Review designs and builds within 3 working days of each milestone.',
      ],
      exclusions: [
        'Paid advertising and marketing campaigns.',
        'Ongoing site maintenance after 30 days post-launch.',
        'Native mobile apps.',
        'Copywriting for blog articles (templates and structure only).',
        'Photographer fees for the product shoot.',
      ],
    },
    quote: {
      currency: 'USD',
      totalCents: 150000,
      milestones: [
        { id: 'ms-kickoff', name: 'Kick-off (on signing)', percentage: 40 },
        { id: 'ms-design', name: 'Design approval', percentage: 30 },
        { id: 'ms-launch', name: 'Launch', percentage: 30 },
      ],
      notes: 'Example quote for the sample project. Quote valid for 30 days. Photographer fees quoted separately once the shoot is scoped.',
    },
    proposal: {
      freelancerName: 'Alex Rivera',
      freelancerContact: 'alex@riverawebstudio.com · +1 555 0142',
      clientName: 'Sam Chen, Harbor Lane Coffee',
      extraNotes: 'We are excited to help Harbor Lane go online before the December holiday season.',
    },
    schemaVersion: 2,
  };
}
