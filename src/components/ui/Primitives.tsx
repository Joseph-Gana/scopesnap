import type { ReactNode } from 'react';
import { Link2 } from 'lucide-react';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-navy-100 bg-white shadow-card ${className}`}>{children}</div>;
}

export function CardHeader({ icon, title, subtitle, actions }: { icon?: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-navy-100 px-5 py-4">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 text-navy-700">{icon}</div>}
        <div>
          <h3 className="font-heading text-base font-semibold text-navy-900">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs leading-relaxed text-navy-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'error' | 'info' }) {
  const tones: Record<string, string> = {
    neutral: 'bg-navy-100 text-navy-700',
    accent: 'bg-accent-100 text-accent-700',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-rose-100 text-rose-800',
    info: 'bg-navy-50 text-navy-700 border border-navy-200',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}

export function SourceBadge({ kind }: { kind: 'supported' | 'suggested' }) {
  if (kind === 'supported') {
    return <Tag tone="success">From the brief</Tag>;
  }
  return (
    <Tag tone="accent">
      <Link2 className="h-3 w-3" /> Suggested
    </Tag>
  );
}

export function SectionTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow && <p className="font-heading text-xs font-semibold uppercase tracking-[0.18em] text-accent-600">{eyebrow}</p>}
      <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-navy-900 sm:text-3xl">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-navy-500">{description}</p>}
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-navy-600">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-navy-400">{hint}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-lg border border-navy-200 bg-white px-3.5 py-2.5 text-sm text-navy-900 placeholder-navy-300 shadow-sm transition focus:border-navy-700 focus:outline-none focus:ring-2 focus:ring-navy-200/70';

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}) {
  const variants: Record<string, string> = {
    primary: 'bg-navy-900 text-white shadow-sm hover:bg-navy-800 focus-visible:ring-navy-300',
    secondary: 'border border-navy-200 bg-white text-navy-800 shadow-sm hover:bg-navy-50 focus-visible:ring-navy-200',
    ghost: 'text-navy-600 hover:bg-navy-100 hover:text-navy-900',
    danger: 'border border-rose-200 bg-white text-rose-700 hover:bg-rose-50',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-sm',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-heading font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
