import type { BriefAnalysis, Deliverable, Risk } from './types';
import { supabase, analyzeBriefWithGemini } from './supabase';

const GENERIC_PRODUCTS = [
  'website', 'app', 'application', 'platform', 'mobile app', 'web app',
  'e-commerce', 'landing page', 'dashboard', 'blog', 'portfolio', 'system',
];

function uid(): string {
  return crypto.randomUUID();
}

function cleanList(items: (string | undefined | null)[]): string[] {
  return items
    .map((item) => (item ?? '').trim())
    .filter((item) => item.length > 0);
}

export function analyzeBriefLocally(brief: string): BriefAnalysis {
  const text = brief.replace(/\s+/g, ' ').trim();
  const lower = text.toLowerCase();

  const matchedType =
    GENERIC_PRODUCTS.find((product) => lower.includes(product)) ?? 'General project';

  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const deliverables: Deliverable[] = sentences
    .filter((s) => /\b(need|needs|want|require|include|build|create|design|develop|make|add|integrate)\b/i.test(s))
    .slice(0, 8)
    .map((s) => ({
      id: uid(),
      title: s.length > 90 ? `${s.slice(0, 87).trimEnd()}...` : s,
      detail: '',
      supported: true,
    }));

  const missingInfo: string[] = [];
  if (!/(budget|cost|price|afford|quote)/i.test(lower)) missingInfo.push('Budget: no budget range is mentioned in the brief.');
  if (!/(deadline|due|timeline|launch|by (january|february|march|april|may|june|july|august|september|october|november|december)|in \d+ weeks|in \d+ months)/i.test(lower))
    missingInfo.push('Timeline: no deadline or launch date is stated.');
  if (!/(audience|customers|users|visitors|market|demographic)/i.test(lower))
    missingInfo.push('Target audience: the brief does not describe who the product is for.');
  if (!/(hosting|domain|server|deploy)/i.test(lower)) missingInfo.push('Hosting and domain: not specified who provides these.');
  if (!/(content|copy|text|photos|images|logo|brand)/i.test(lower))
    missingInfo.push('Content readiness: no mention of provided text, images, or branding.');
  if (!/(revision|feedback|changes)/i.test(lower)) missingInfo.push('Revision expectations: number of revision rounds is undefined.');
  if (!/(account|credential|access|login|admin)/i.test(lower))
    missingInfo.push('Access: no mention of access to existing accounts, hosting, or systems.');

  const assumptions: string[] = [
    'Scope covers one main release; major changes after approval are treated as new work.',
    'Content (text, images, brand assets) will be supplied by the client before work starts.',
    'Feedback is collected in consolidated rounds rather than continuously.',
  ];
  if (lower.includes('website')) assumptions.push('The site will be responsive across mobile, tablet, and desktop.');
  if (/(shop|store|ecommerce|e-commerce|payment)/i.test(lower))
    assumptions.push('A single payment provider will be integrated; extra providers are out of scope.');

  const risks: Risk[] = [];
  if (/(asap|urgent|immediately|quickly|rush)/i.test(lower)) {
    risks.push({ severity: 'high', text: 'The client signals urgency; a tight deadline may compress testing and revisions.' });
  }
  if (/(budget is tight|small budget|cheap|low budget|limited budget)/i.test(lower)) {
    risks.push({ severity: 'medium', text: 'Budget pressure mentioned; scope may expand beyond what the budget supports.' });
  }
  if (/(and also|as well as|plus|in addition)/i.test(lower)) {
    risks.push({ severity: 'medium', text: 'The brief lists several add-ons; watch for scope creep beyond the core request.' });
  }
  if (/(my friend|my nephew|student|cheap guy|someone who did)/i.test(lower)) {
    risks.push({ severity: 'low', text: 'A previous or alternative developer is referenced; clarify what already exists and who owns it.' });
  }
  if (risks.length === 0) {
    risks.push({ severity: 'low', text: 'Brief is informal; confirm scope in writing before starting work.' });
  }

  const questions: string[] = [
    'What is your total budget range for this project?',
    'When would you like the project to be finished?',
    'Who will provide the content and brand assets, and by when?',
  ];

  return {
    projectType: matchedType.replace(/\b\w/g, (c) => c.toUpperCase()),
    summary:
      sentences.length > 0
        ? `The client is asking for help with a ${matchedType}. ${sentences[0]}`
        : 'The client describes a project request.',
    deliverables,
    missingInfo,
    assumptions,
    risks,
    questions,
  };
}

export interface AnalyzeResult {
  analysis: BriefAnalysis;
  source: 'gemini' | 'fallback';
  model?: string;
}

export async function analyzeBrief(brief: string): Promise<AnalyzeResult> {
  try {
    const { analysis, model } = await analyzeBriefWithGemini(brief);
    return { analysis, source: 'gemini', model };
  } catch (err) {
    console.error('[scopesnap] AI analysis failed — using built-in fallback analysis.', err);
    return { analysis: analyzeBriefLocally(brief), source: 'fallback' };
  }
}
