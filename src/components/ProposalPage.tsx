import { useEffect, useMemo } from 'react';
import { PenLine, Printer } from 'lucide-react';
import { Button, Card, CardHeader, Field, inputClass, SectionTitle } from '@/components/ui/Primitives';
import { Callout } from '@/components/ui/Feedback';
import { PrintPortal } from '@/components/PrintPortal';
import { formatMoneyFromCents, milestoneAmounts, quoteIsBalanced, totalPercentage } from '@/lib/currency';
import type { Project } from '@/lib/types';

interface Props {
  project: Project;
  onChange: (updater: (project: Project) => Project) => void;
  onSave: (project: Project) => void;
}

export function ProposalPage({ project, onChange, onSave }: Props) {
  const quote = project.quote;
  const scope = project.scope;
  const analysis = project.analysis;
  const balanced = quoteIsBalanced(quote);
  const percentage = totalPercentage(quote.milestones);
  const amounts = milestoneAmounts(quote.milestones, quote.totalCents);

  const setProposal = (patch: Partial<Project['proposal']>) =>
    onChange((p) => ({ ...p, proposal: { ...p.proposal, ...patch } }));

  const deliverables = useMemo(
    () => scope.deliverables.filter((d) => d.title.trim().length > 0),
    [scope.deliverables]
  );
  const responsibilities = scope.clientResponsibilities.filter((item) => item.trim().length > 0);
  const exclusions = scope.exclusions.filter((item) => item.trim().length > 0);
  const assumptions = analysis?.assumptions ?? [];
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSave = () => onSave(project);

  return (
    <>
      <div className="space-y-6">
        <div className="no-print space-y-6">
          <SectionTitle
            eyebrow="Step 4"
            title="Proposal builder"
            description="Review the proposal, fill in names and contact details, then print or save it as a PDF from your browser's print dialog."
          />

          {!balanced && (
            <Callout tone="warning">
              Milestones currently total {percentage}%. Fix them in the Quote step so the proposal shows accurate amounts.
            </Callout>
          )}

          <Callout tone="info">
            <span className="font-semibold">For a clean PDF:</span> in the browser print dialog, open “More settings” and{' '}
            <span className="font-semibold">untick “Headers and footers”</span>. That removes the date, page title, browser URL, and page numbers that
            Chrome adds on its own — they are not part of this document and cannot be turned off from the app. Also set Margins to “Default”.
          </Callout>

          <Card>
            <CardHeader icon={<PenLine className="h-5 w-5" />} title="Proposal details" subtitle="These appear at the top of the document." />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="Your name / business">
                <input value={project.proposal.freelancerName} onChange={(e) => setProposal({ freelancerName: e.target.value })} className={inputClass} placeholder="e.g. Alex Morgan" />
              </Field>
              <Field label="Client name">
                <input value={project.proposal.clientName} onChange={(e) => setProposal({ clientName: e.target.value })} className={inputClass} placeholder="e.g. Jordan Taylor, Brightside Studio" />
              </Field>
              <Field label="Your contact details">
                <input value={project.proposal.freelancerContact} onChange={(e) => setProposal({ freelancerContact: e.target.value })} className={inputClass} placeholder="email · phone" />
              </Field>
              <Field label="Extra notes (optional)">
                <input value={project.proposal.extraNotes} onChange={(e) => setProposal({ extraNotes: e.target.value })} className={inputClass} placeholder="Anything else to include" />
              </Field>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-navy-100 px-5 py-4">
              <span className="text-xs text-navy-400">Tip: untick “Headers and footers” in the print dialog for a clean PDF.</span>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleSave}>Save project</Button>
                <Button onClick={() => window.print()} disabled={!balanced || deliverables.length === 0}>
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="print-preview">
          <ProposalDocument
            project={project}
            today={today}
            deliverables={deliverables}
            responsibilities={responsibilities}
            exclusions={exclusions}
            assumptions={assumptions}
            balanced={balanced}
            percentage={percentage}
          />
        </div>
      </div>

      <PrintPortal>
        <ProposalDocument
          project={project}
          today={today}
          deliverables={deliverables}
          responsibilities={responsibilities}
          exclusions={exclusions}
          assumptions={assumptions}
          balanced={balanced}
          percentage={percentage}
        />
      </PrintPortal>
    </>
  );
}

function ProposalDocument({
  project,
  today,
  deliverables,
  responsibilities,
  exclusions,
  assumptions,
  balanced,
  percentage,
}: {
  project: Project;
  today: string;
  deliverables: { id: string; title: string; detail: string; supported: boolean }[];
  responsibilities: string[];
  exclusions: string[];
  assumptions: string[];
  balanced: boolean;
  percentage: number;
}) {
  const { quote, scope, analysis, proposal } = project;
  const amounts = milestoneAmounts(quote.milestones, quote.totalCents);
  return (
    <div className="proposal-body rounded-2xl border border-navy-100 bg-white shadow-card">
      <div className="border-b-2 border-navy-900 px-8 py-6 print:px-6 print:py-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-accent-600">Project Proposal</p>
            <h1 className="mt-1 font-heading text-2xl font-extrabold text-navy-900">{project.name}</h1>
            {analysis?.projectType && <p className="mt-1 text-sm text-navy-500">{analysis.projectType}</p>}
          </div>
          <div className="text-right text-sm text-navy-500">
            {proposal.freelancerName && <p className="font-heading font-semibold text-navy-900">{proposal.freelancerName}</p>}
            {proposal.freelancerContact && <p className="mt-0.5 text-xs">{proposal.freelancerContact}</p>}
            <p className="mt-1 text-xs">Date: {today}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-8 py-6 print:space-y-3 print:px-6 print:py-4">
        {proposal.clientName && (
          <section>
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Prepared for</h2>
            <p className="mt-1 text-sm font-medium text-navy-900">{proposal.clientName}</p>
          </section>
        )}
        <section>
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Project Overview</h2>
          {analysis?.summary && (
            <p className="mt-2 text-sm leading-relaxed text-navy-700">{analysis.summary}</p>
          )}
        </section>

        <section>
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Deliverables</h2>
          <ul className="mt-2 space-y-1.5">
            {deliverables.map((d) => (
              <li key={d.id} className="flex items-start gap-2 text-sm text-navy-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                <span>
                  <span className="font-medium text-navy-900">{d.title}</span>
                  {d.detail ? ` — ${d.detail}` : ''}
                  {!d.supported && <span className="ml-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600">(proposed — optional)</span>}
                </span>
              </li>
            ))}
            {deliverables.length === 0 && <li className="text-sm text-navy-400">No deliverables defined.</li>}
          </ul>
          {deliverables.some((d) => !d.supported) && (
            <p className="mt-2 text-xs italic text-navy-500">
              Items marked “proposed — optional” are suggestions and become commitments only after the client confirms them.
            </p>
          )}
        </section>

        {scope.timeline && (
          <section>
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Timeline (provisional)</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-700">
              {scope.timeline}{' — this schedule is provisional until the final scope and requirements are agreed with the client.'}
            </p>
          </section>
        )}

        <section>
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Total Cost</h2>
          <p className="mt-2 font-heading text-2xl font-extrabold tabular-nums text-navy-900">
            {formatMoneyFromCents(quote.totalCents, quote.currency)} <span className="text-sm font-semibold text-navy-400">{quote.currency}</span>
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Payment Milestones</h2>
          {balanced ? (
            <table className="mt-2 w-full text-sm">
              <thead>
                <tr className="border-b border-navy-200 text-left text-xs uppercase tracking-wide text-navy-400">
                  <th className="py-2 font-semibold">Milestone</th>
                  <th className="py-2 text-right font-semibold">Share</th>
                  <th className="py-2 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {quote.milestones.map((m, index) => (
                  <tr key={m.id} className="border-b border-navy-100">
                    <td className="py-2 text-navy-800">{m.name}</td>
                    <td className="py-2 text-right text-navy-600">{m.percentage}%</td>
                    <td className="py-2 text-right font-heading font-semibold tabular-nums text-navy-900">{formatMoneyFromCents(amounts[index] ?? 0, quote.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              Milestones total {percentage}% — finalize percentages in the Quote step before sending this proposal.
            </p>
          )}
          {quote.notes && <p className="mt-2 text-xs italic text-navy-500">{quote.notes}</p>}
        </section>

        <div className="grid gap-8 sm:grid-cols-2 print:gap-5">
          <section>
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Client Responsibilities</h2>
            <ul className="mt-2 space-y-1.5">
              {responsibilities.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" /> {item}
                </li>
              ))}
              {responsibilities.length === 0 && <li className="text-sm text-navy-400">None recorded.</li>}
            </ul>
          </section>
          <section>
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Exclusions</h2>
            <ul className="mt-2 space-y-1.5">
              {exclusions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" /> {item}
                </li>
              ))}
              {exclusions.length === 0 && <li className="text-sm text-navy-400">None recorded.</li>}
            </ul>
          </section>
        </div>

        {assumptions.length > 0 && (
          <section>
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Assumptions</h2>
            <ul className="mt-2 space-y-1.5">
              {assumptions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> {item}
                </li>
              ))}
            </ul>
          </section>
        )}

        {proposal.extraNotes && (
          <section>
            <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Notes</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-700">{proposal.extraNotes}</p>
          </section>
        )}

        <section className="signature-block border-t border-navy-200 pt-6 print:pt-4">
          <h2 className="font-heading text-xs font-bold uppercase tracking-widest text-navy-400">Approval</h2>
          <p className="mt-2 max-w-xl text-sm text-navy-600">
            Signing below confirms the agreed scope, the provisional timeline as finalized, and the costs in this proposal. Any work outside this scope will be quoted separately.
          </p>
          <div className="mt-10 grid gap-10 sm:grid-cols-2 print:mt-6 print:gap-6">
            {[proposal.clientName || 'Client', proposal.freelancerName || 'Provider'].map((label) => (
              <div key={label}>
                <div className="h-12 border-b border-navy-400" />
                <p className="mt-1.5 text-xs text-navy-500">{label} — signature &amp; date</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
