import { useEffect, useState } from 'react';
import { ClipboardPaste, FileText, Sparkles, Wand2 } from 'lucide-react';
import { Button, Card, CardHeader, Field, inputClass, SectionTitle, Tag } from '@/components/ui/Primitives';
import { Callout, Spinner } from '@/components/ui/Feedback';
import { SAMPLE_BRIEF } from '@/lib/sampleBrief';
import { analyzeBrief } from '@/lib/analysis';
import { newProject, type BriefAnalysis, type Project } from '@/lib/types';

const PASTE_EVENT = 'scopesnap:brief';

interface Props {
  project: Project | null;
  onAnalyzed: (project: Project) => void;
}

export function BriefPage({ project, onAnalyzed }: Props) {
  const [brief, setBrief] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<BriefAnalysis | null>(project?.analysis ?? null);
  const [source, setSource] = useState<'gemini' | 'fallback' | null>(project?.analysisSource ?? null);

  useEffect(() => {
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (typeof detail === 'string') {
        setBrief(detail);
        setAnalysis(null);
        setSource(null);
        setError(null);
      }
    };
    window.addEventListener(PASTE_EVENT, handler);
    return () => window.removeEventListener(PASTE_EVENT, handler);
  }, []);

  const canAnalyze = brief.trim().length >= 40 && !loading;

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    const result = await analyzeBrief(brief.trim());
    setAnalysis(result.analysis);
    setSource(result.source);
    setLoading(false);
  };

  const accept = () => {
    if (!analysis || !source) return;
    const created = newProject(brief.trim(), analysis, source);
    onAnalyzed(created);
  };

  const charCount = brief.trim().length;

  return (
    <div className="space-y-6">
      <SectionTitle
        eyebrow="Step 1"
        title="Paste the client brief"
        description="Copy the request exactly as the client wrote it — messy is fine. ScopeSnap will sort out deliverables, gaps, and risks."
      />

      {project && (
        <Callout tone="info">
          You are viewing the analysis for <strong>{project.name}</strong>. Analyzing a new brief starts a fresh project.
        </Callout>
      )}

      <Card>
        <CardHeader
          icon={<FileText className="h-5 w-5" />}
          title="Client brief"
          subtitle="Paste the raw brief. Minimum 40 characters."
          actions={
            <Button size="sm" variant="secondary" onClick={() => setBrief(SAMPLE_BRIEF)}>
              <ClipboardPaste className="h-3.5 w-3.5" /> Use sample brief
            </Button>
          }
        />
        <div className="space-y-4 p-5">
          <Field label="Brief text">
            <textarea
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              rows={10}
              placeholder="Hi! We're a small bakery and we need a website with online ordering…"
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`text-xs ${charCount >= 40 ? 'text-navy-400' : 'text-amber-600'}`}>
              {charCount} characters {charCount < 40 && '— at least 40 needed'}
            </span>
            <Button size="lg" onClick={runAnalysis} disabled={!canAnalyze}>
              <Wand2 className="h-4 w-4" /> {loading ? 'Analyzing…' : 'Analyze My Brief'}
            </Button>
          </div>
          {error && <Callout tone="error">{error}</Callout>}
        </div>
      </Card>

      {loading && (
        <Card>
          <div className="flex flex-col items-center gap-4 px-6 py-14">
            <Spinner label="Reading the brief and structuring the scope…" />
            <div className="w-full max-w-md space-y-2">
              {[80, 60, 70, 45].map((width, i) => (
                <div key={i} className="h-3 animate-pulse rounded-full bg-navy-100" style={{ width: `${width}%` }} />
              ))}
            </div>
          </div>
        </Card>
      )}

      {!loading && analysis && source && <AnalysisResults analysis={analysis} source={source} onAccept={accept} />}
    </div>
  );
}

function AnalysisResults({
  analysis,
  source,
  onAccept,
}: {
  analysis: BriefAnalysis;
  source: 'gemini' | 'fallback';
  onAccept: () => void;
}) {
  return (
    <div className="space-y-5">
      <Callout tone="info">
        Items tagged <Tag tone="success">From the brief</Tag> come directly from the client&apos;s words. Items tagged{' '}
        <Tag tone="accent">Suggested</Tag> or listed as assumptions are inferences — confirm them with the client.
      </Callout>

      <Card>
        <CardHeader icon={<Sparkles className="h-5 w-5" />} title="Project Overview" actions={<Tag tone="info">{analysis.projectType}</Tag>} />
        <p className="px-5 py-4 text-sm leading-relaxed text-navy-700">{analysis.summary}</p>
      </Card>

      <Card>
        <CardHeader icon={<FileText className="h-5 w-5" />} title="Requested Deliverables" subtitle="What the client asked for, in their words." />
        <ul className="divide-y divide-navy-100">
          {analysis.deliverables.length === 0 && <li className="px-5 py-4 text-sm text-navy-400">No explicit deliverables were detected — clarify with the client.</li>}
          {analysis.deliverables.map((d) => (
            <li key={d.id} className="flex flex-wrap items-start justify-between gap-2 px-5 py-3">
              <div>
                <p className="text-sm font-medium text-navy-900">{d.title}</p>
                {d.detail && <p className="mt-0.5 text-xs text-navy-500">{d.detail}</p>}
              </div>
              <Tag tone={d.supported ? 'success' : 'accent'}>{d.supported ? 'From the brief' : 'Suggested'}</Tag>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<FileText className="h-5 w-5" />} title="Missing Information" subtitle="Gaps the brief leaves open." />
          <ul className="space-y-2 px-5 py-4">
            {analysis.missingInfo.length === 0 && <li className="text-sm text-navy-400">Nothing obvious is missing.</li>}
            {analysis.missingInfo.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" /> {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader icon={<FileText className="h-5 w-5" />} title="Assumptions" subtitle="Working assumptions to confirm with the client." />
          <ul className="space-y-2 px-5 py-4">
            {analysis.assumptions.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-navy-700">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" /> {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader icon={<FileText className="h-5 w-5" />} title="Risk Indicators" subtitle="Signals to address before signing." />
          <ul className="space-y-2 px-5 py-4">
            {analysis.risks.map((risk) => (
              <li key={risk.text} className="flex items-start gap-2 text-sm text-navy-700">
                <Tag tone={risk.severity === 'high' ? 'error' : risk.severity === 'medium' ? 'warning' : 'neutral'}>{risk.severity}</Tag>
                <span>{risk.text}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader icon={<FileText className="h-5 w-5" />} title="Questions to Ask" subtitle="Send these before quoting." />
          <ol className="space-y-2 px-5 py-4">
            {analysis.questions.map((question, i) => (
              <li key={question} className="flex items-start gap-2 text-sm text-navy-700">
                <span className="font-heading text-xs font-bold text-accent-600">{i + 1}.</span> {question}
              </li>
            ))}
          </ol>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={onAccept}>
          Continue to Scope Editor
        </Button>
      </div>
    </div>
  );
}
