export type RiskSeverity = 'low' | 'medium' | 'high';

export interface Deliverable {
  id: string;
  title: string;
  detail: string;
  supported: boolean;
}

export interface Risk {
  severity: RiskSeverity;
  text: string;
}

export interface BriefAnalysis {
  projectType: string;
  summary: string;
  deliverables: Deliverable[];
  tip?: string;
  missingInfo: string[];
  assumptions: string[];
  risks: Risk[];
  questions: string[];
}

export interface Milestone {
  id: string;
  name: string;
  percentage: number;
}

export type CurrencyCode = 'NGN' | 'USD' | 'GBP' | 'EUR';

export interface Quote {
  currency: CurrencyCode;
  // Canonical monetary value in integer cents (e.g. $1,500.00 -> 150000).
  totalCents: number;
  milestones: Milestone[];
  notes: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  brief: string;
  analysis: BriefAnalysis | null;
  analysisSource: 'gemini' | 'fallback' | null;
  analysisModel?: string | null;
  scope: Scope;
  quote: Quote;
  proposal: ProposalSettings;
  /** Data shape version. 2 = canonical integer-cents quote totals. */
  schemaVersion?: number;
}

// Older builds stored a decimal `total`; migrate to integer cents on load.
export function normalizeQuote(raw: { currency: CurrencyCode; totalCents?: number; total?: number; milestones: Milestone[]; notes: string }): Quote {
  const totalCents =
    typeof raw.totalCents === 'number'
      ? Math.round(raw.totalCents)
      : typeof raw.total === 'number'
        ? Math.round(raw.total * 100)
        : 0;
  return {
    currency: raw.currency,
    totalCents: Math.max(0, totalCents),
    milestones: raw.milestones,
    notes: raw.notes,
  };
}

export interface Scope {
  deliverables: Deliverable[];
  timeline: string;
  clientResponsibilities: string[];
  exclusions: string[];
}

export interface ProposalSettings {
  freelancerName: string;
  freelancerContact: string;
  clientName: string;
  extraNotes: string;
}

export function emptyScope(): Scope {
  return { deliverables: [], timeline: '', clientResponsibilities: [], exclusions: [] };
}

export function defaultQuote(): Quote {
  return {
    currency: 'USD',
    totalCents: 0,
    milestones: [
      { id: 'ms-kickoff', name: 'Kick-off (on signing)', percentage: 40 },
      { id: 'ms-midpoint', name: 'Mid-project review', percentage: 30 },
      { id: 'ms-final', name: 'Final delivery', percentage: 30 },
    ],
    notes: '',
  };
}

export function defaultProposal(): ProposalSettings {
  return { freelancerName: '', freelancerContact: '', clientName: '', extraNotes: '' };
}

export function newProject(brief: string, analysis: BriefAnalysis, source: 'gemini' | 'fallback', model?: string): Project {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name: analysis.projectType || 'Untitled project',
    createdAt: now,
    updatedAt: now,
    brief,
    analysis,
    analysisSource: source,
    analysisModel: model ?? null,
    scope: {
      deliverables: analysis.deliverables.map((d) => ({ ...d })),
      timeline: '',
      clientResponsibilities: [],
      exclusions: [],
    },
    quote: defaultQuote(),
    proposal: defaultProposal(),
    schemaVersion: 2,
  };
}
