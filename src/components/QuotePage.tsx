import { AlertTriangle, CheckCircle2, Plus, Trash2, Wallet } from 'lucide-react';
import { Button, Card, CardHeader, Field, inputClass, SectionTitle } from '@/components/ui/Primitives';
import { Callout } from '@/components/ui/Feedback';
import { CURRENCIES, formatMoneyFromCents, milestoneAmounts, quoteIsBalanced, totalPercentage } from '@/lib/currency';
import type { CurrencyCode, Milestone, Quote, Project } from '@/lib/types';

interface Props {
  project: Project;
  onChange: (updater: (project: Project) => Project) => void;
  onSave: () => void;
  onContinue: () => void;
}

function uid() {
  return crypto.randomUUID();
}

export function QuotePage({ project, onChange, onSave, onContinue }: Props) {
  const quote = project.quote;
  const percentage = totalPercentage(quote.milestones);
  const balanced = quoteIsBalanced(quote);
  const amounts = milestoneAmounts(quote.milestones, quote.totalCents);

  const setQuote = (patch: Partial<Project['quote']>) => onChange((p) => ({ ...p, quote: { ...p.quote, ...patch } }));

  const addMilestone = () =>
    setQuote({ milestones: [...quote.milestones, { id: uid(), name: '', percentage: 0 }] });
  const updateMilestone = (id: string, patch: Partial<Milestone>) =>
    setQuote({ milestones: quote.milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)) });
  const removeMilestone = (id: string) =>
    setQuote({ milestones: quote.milestones.filter((m) => m.id !== id) });

  const overAllocated = quote.milestones.filter((m) => m.percentage < 0 || m.percentage > 100).length > 0;
  const canContinue = balanced && !overAllocated && quote.milestones.length > 0 && quote.milestones.every((m) => m.name.trim().length > 0);
  const hasMilestones = quote.milestones.length > 0;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Step 3"
        title="Quote & payment milestones"
        description="Set the project price, pick a currency, and split payment into milestones by percentage. Amounts are calculated for you."
      />

      <Card>
        <CardHeader icon={<Wallet className="h-5 w-5" />} title="Project price" subtitle="The total you are charging for the scope." />
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          <Field label="Currency">
            <select
              value={quote.currency}
              onChange={(e) => setQuote({ currency: e.target.value as CurrencyCode })}
              className={inputClass}
            >
              {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                <option key={code} value={code}>
                  {code} — {CURRENCIES[code].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Total price">
            <input
              type="number"
              min={0}
              step="0.01"
              value={quote.totalCents ? (quote.totalCents / 100).toString() : ''}
              onChange={(e) => setQuote({ totalCents: Math.max(0, Math.round((Number(e.target.value) || 0) * 100)) })}
              placeholder="e.g. 1500"
              className={inputClass}
            />
          </Field>
          <div className="flex items-end">
            <div className="w-full rounded-xl bg-navy-50 px-4 py-2.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">Quoted total</p>
              <p className="font-heading text-lg font-bold text-navy-900">{formatMoneyFromCents(quote.totalCents, quote.currency)}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          icon={<Wallet className="h-5 w-5" />}
          title="Payment milestones"
          subtitle="Percentages must add up to exactly 100%."
          actions={<Button size="sm" variant="secondary" onClick={addMilestone}><Plus className="h-3.5 w-3.5" /> Add milestone</Button>}
        />
        <div className="space-y-3 p-5">
          {!hasMilestones && <Callout tone="info">No milestones yet. Add one and give it a name and percentage.</Callout>}
          {quote.milestones.map((milestone, index) => {
            const amount = amounts[index] ?? 0;
            return (
              <div key={milestone.id} className="grid items-center gap-3 rounded-xl border border-navy-100 bg-navy-50/40 p-4 sm:grid-cols-[1fr_120px_140px_auto]">
                <input
                  value={milestone.name}
                  onChange={(e) => updateMilestone(milestone.id, { name: e.target.value })}
                  placeholder="Milestone name, e.g. Kick-off (on signing)"
                  className={inputClass}
                />
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step="1"
                    value={milestone.percentage || ''}
                    onChange={(e) => updateMilestone(milestone.id, { percentage: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
                    placeholder="%"
                    className={`${inputClass} pr-8`}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-navy-400">%</span>
                </div>
                <span className="font-heading text-sm font-bold tabular-nums text-navy-900">{formatMoneyFromCents(amount, quote.currency)}</span>
                <Button size="sm" variant="ghost" onClick={() => removeMilestone(milestone.id)} aria-label="Remove milestone">
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </div>
            );
          })}

          <div className={`flex items-center justify-between rounded-xl border px-4 py-3 ${percentage === 100 ? 'border-emerald-200 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              {percentage === 100 ? (
                <><CheckCircle2 className="h-4 w-4 text-emerald-600" /> <span className="text-emerald-800">Milestones total 100% — ready to finalize.</span></>
              ) : (
                <><AlertTriangle className="h-4 w-4 text-amber-600" /> <span className="text-amber-800">Milestones total {percentage}% — adjust to exactly 100%.</span></>
              )}
            </div>
            <span className={`font-heading text-lg font-bold ${percentage === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>{percentage}%</span>
          </div>

          <Field label="Quote notes (optional)">
            <textarea
              value={quote.notes}
              onChange={(e) => setQuote({ notes: e.target.value })}
              rows={2}
              placeholder="e.g. Quote valid for 30 days. 50% discount for NGOs."
              className={`${inputClass} resize-y`}
            />
          </Field>
        </div>
      </Card>

      {!balanced && quote.totalCents > 0 && (
        <Callout tone="warning">
          The quotation cannot be finalized until milestone percentages total exactly 100%. Currently {percentage}%.
        </Callout>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="secondary" onClick={onSave}>Save project</Button>
        <Button size="lg" onClick={onContinue} disabled={!canContinue}>Continue to Proposal</Button>
      </div>
    </div>
  );
}
