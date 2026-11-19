import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, Loader2, XCircle } from 'lucide-react';

type Tone = 'info' | 'success' | 'warning' | 'error';

const toneStyles: Record<Tone, { container: string; icon: ReactNode }> = {
  info: { container: 'bg-navy-50 border-navy-200 text-navy-800', icon: <Info className="h-4 w-4 text-navy-500" /> },
  success: { container: 'bg-emerald-50 border-emerald-200 text-emerald-900', icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" /> },
  warning: { container: 'bg-amber-50 border-amber-300 text-amber-900', icon: <AlertTriangle className="h-4 w-4 text-amber-600" /> },
  error: { container: 'bg-rose-50 border-rose-200 text-rose-900', icon: <XCircle className="h-4 w-4 text-rose-600" /> },
};

export function Callout({ tone = 'info', children }: { tone?: Tone; children: ReactNode }) {
  const style = toneStyles[tone];
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-relaxed ${style.container}`}>
      <span className="mt-0.5 shrink-0">{style.icon}</span>
      <div>{children}</div>
    </div>
  );
}

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-sm text-navy-600" role="status" aria-live="polite">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label ?? 'Working…'}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-navy-200 bg-navy-50/50 px-6 py-14 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-accent-600 shadow-card">{icon}</div>
      <h3 className="font-heading text-base font-semibold text-navy-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-relaxed text-navy-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
