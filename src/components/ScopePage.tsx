import { Plus, Ruler, Trash2 } from 'lucide-react';
import { Button, Card, CardHeader, Field, inputClass, SectionTitle, Tag } from '@/components/ui/Primitives';
import { Callout } from '@/components/ui/Feedback';
import type { Project } from '@/lib/types';

interface Props {
  project: Project;
  onChange: (updater: (project: Project) => Project) => void;
  onSave: () => void;
  onContinue: () => void;
}

function uid() {
  return crypto.randomUUID();
}

export function ScopePage({ project, onChange, onSave, onContinue }: Props) {
  const scope = project.scope;
  const update = (updater: (scope: Project['scope']) => Project['scope']) =>
    onChange((p) => ({ ...p, scope: updater(p.scope) }));

  const addDeliverable = () =>
    update((s) => ({ ...s, deliverables: [...s.deliverables, { id: uid(), title: '', detail: '', supported: false }] }));
  const updateDeliverable = (id: string, patch: Partial<Project['scope']['deliverables'][number]>) =>
    update((s) => ({ ...s, deliverables: s.deliverables.map((d) => (d.id === id ? { ...d, ...patch } : d)) }));
  const removeDeliverable = (id: string) =>
    update((s) => ({ ...s, deliverables: s.deliverables.filter((d) => d.id !== id) }));

  const addListItem = (key: 'clientResponsibilities' | 'exclusions') =>
    update((s) => ({ ...s, [key]: [...s[key], ''] }));
  const updateListItem = (key: 'clientResponsibilities' | 'exclusions', index: number, value: string) =>
    update((s) => ({ ...s, [key]: s[key].map((item, i) => (i === index ? value : item)) }));
  const removeListItem = (key: 'clientResponsibilities' | 'exclusions', index: number) =>
    update((s) => ({ ...s, [key]: s[key].filter((_, i) => i !== index) }));

  const namedDeliverables = scope.deliverables.filter((d) => d.title.trim().length > 0);

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Step 2"
        title="Scope editor"
        description="Shape the agreement: keep the deliverables that are real, set the timeline, and nail down responsibilities and exclusions."
      />

      <Card>
        <CardHeader
          icon={<Ruler className="h-5 w-5" />}
          title="Deliverables"
          subtitle="Remove anything you are not committing to. “From the brief” marks what the client explicitly asked for."
          actions={<Button size="sm" variant="secondary" onClick={addDeliverable}><Plus className="h-3.5 w-3.5" /> Add deliverable</Button>}
        />
        <div className="space-y-3 p-5">
          {scope.deliverables.length === 0 && <Callout tone="info">No deliverables yet. Add the first one, or go back and re-analyze the brief.</Callout>}
          {scope.deliverables.map((deliverable) => (
            <div key={deliverable.id} className="rounded-xl border border-navy-100 bg-navy-50/40 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={deliverable.title}
                  onChange={(e) => updateDeliverable(deliverable.id, { title: e.target.value })}
                  placeholder="Deliverable, e.g. Homepage design"
                  className={`${inputClass} flex-1 min-w-[200px] font-medium`}
                />
                <Tag tone={deliverable.supported ? 'success' : 'accent'}>{deliverable.supported ? 'From the brief' : 'Suggested'}</Tag>
                <Button size="sm" variant="ghost" onClick={() => removeDeliverable(deliverable.id)} aria-label="Remove deliverable">
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </Button>
              </div>
              <input
                value={deliverable.detail}
                onChange={(e) => updateDeliverable(deliverable.id, { detail: e.target.value })}
                placeholder="Optional detail — one line of context"
                className={`${inputClass} mt-3`}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader icon={<Ruler className="h-5 w-5" />} title="Timeline" subtitle="Describe the schedule in plain language." />
        <div className="p-5">
          <Field label="Project timeline">
            <textarea
              value={scope.timeline}
              onChange={(e) => update((s) => ({ ...s, timeline: e.target.value }))}
              rows={3}
              placeholder="e.g. 6 weeks from kick-off: 2 weeks design, 3 weeks build, 1 week revisions and launch."
              className={`${inputClass} resize-y`}
            />
          </Field>
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {([
          { key: 'clientResponsibilities' as const, title: 'Client Responsibilities', hint: 'What the client must provide, and by when.' },
          { key: 'exclusions' as const, title: 'Exclusions', hint: 'What this project explicitly does not include.' },
        ]).map((block) => (
          <Card key={block.key}>
            <CardHeader
              icon={<Ruler className="h-5 w-5" />}
              title={block.title}
              subtitle={block.hint}
              actions={<Button size="sm" variant="secondary" onClick={() => addListItem(block.key)}><Plus className="h-3.5 w-3.5" /> Add</Button>}
            />
            <div className="space-y-2.5 p-5">
              {scope[block.key].length === 0 && <p className="text-sm text-navy-400">Nothing listed yet.</p>}
              {scope[block.key].map((item, index) => (
                <div key={`${block.key}-${index}`} className="flex items-center gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateListItem(block.key, index, e.target.value)}
                    placeholder={block.key === 'exclusions' ? 'e.g. Paid advertising' : 'e.g. Provide brand assets by week 1'}
                    className={inputClass}
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeListItem(block.key, index)} aria-label="Remove item">
                    <Trash2 className="h-4 w-4 text-rose-500" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className={`text-xs ${namedDeliverables.length === 0 ? 'text-amber-600' : 'text-navy-400'}`}>
          {namedDeliverables.length === 0 ? 'Add at least one named deliverable before continuing.' : `${namedDeliverables.length} deliverable(s) in scope.`}
        </span>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onSave}>Save project</Button>
          <Button size="lg" onClick={onContinue} disabled={namedDeliverables.length === 0}>Continue to Quote</Button>
        </div>
      </div>
    </div>
  );
}
