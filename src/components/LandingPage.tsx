import { useEffect, useState } from 'react';
import { CheckCircle2, FileText, ListChecks, Lock, Menu, ShieldAlert, Sparkles, Wallet, X } from 'lucide-react';
import { Button, SectionTitle } from '@/components/ui/Primitives';
import { SAMPLE_BRIEF } from '@/lib/sampleBrief';

const steps = [
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Paste the brief',
    text: 'Drop in the email, voice-note transcript, or chat dump exactly as the client sent it.',
  },
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: 'Get a structured scope',
    text: 'ScopeSnap separates what the client actually asked for from what needs clarifying or assuming.',
  },
  {
    icon: <ListChecks className="h-5 w-5" />,
    title: 'Fix the gaps',
    text: 'Edit deliverables, record assumptions, and hand the client sharp questions before work starts.',
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: 'Price and propose',
    text: 'Set a price with milestone payments, then print a proposal that looks like it took a day to write.',
  },
];

const features = [
  {
    icon: <ListChecks className="h-5 w-5" />,
    title: 'Structured scopes from messy briefs',
    text: 'Deliverables marked “From the brief” only when the client actually said so — everything else is clearly labelled as proposed or assumed.',
  },
  {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: 'Missing info and risk flags',
    text: 'Vague deadlines, tight budgets, and scope creep are surfaced before they turn into unpaid work.',
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: 'Milestone-based quotes',
    text: 'Split any price into percentage milestones with amounts that always sum to the exact total. USD is the default; GBP, EUR, and NGN are also supported.',
  },
  {
    icon: <FileText className="h-5 w-5" />,
    title: 'Printable proposals',
    text: 'A clean, two-page PDF with scope, quote, and signature lines — print straight from the browser.',
  },
];

export function LandingPage({ onPrimary, onSample }: { onPrimary: () => void; onSample: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Smooth-scroll for in-page anchors; CTAs are handled by the app controller.
  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <div className="bg-white">
      <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <a href="#top" onClick={scrollTo('top')} className="flex items-center gap-2 font-heading text-base font-bold text-navy-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-navy-900 font-heading text-xs font-extrabold text-white">S</span> ScopeSnap
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
            <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="text-sm font-medium text-navy-600 transition hover:text-navy-900">How it works</a>
            <a href="#features" onClick={scrollTo('features')} className="text-sm font-medium text-navy-600 transition hover:text-navy-900">Features</a>
            <Button size="sm" onClick={onPrimary}>Analyze a Client Brief</Button>
          </nav>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy-100 text-navy-600 md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <nav className="border-t border-navy-100 bg-white px-6 py-4 md:hidden" aria-label="Main mobile">
            <div className="flex flex-col gap-3">
              <a href="#how-it-works" onClick={scrollTo('how-it-works')} className="text-sm font-medium text-navy-700">How it works</a>
              <a href="#features" onClick={scrollTo('features')} className="text-sm font-medium text-navy-700">Features</a>
              <Button size="sm" onClick={() => { setMenuOpen(false); onPrimary(); }}>Analyze a Client Brief</Button>
            </div>
          </nav>
        )}
      </header>

      <section id="top" className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 pt-14 sm:pt-16 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-200 bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-700">
              <Sparkles className="h-3.5 w-3.5" /> For freelancers and small agencies, everywhere
            </p>
            <h1 className="mt-6 max-w-xl text-balance font-heading text-4xl font-extrabold leading-[1.15] tracking-tight text-navy-900 sm:text-5xl lg:text-[3.375rem] lg:leading-[1.12]">
              Every project starts with a brief. Make sure it ends with a clear agreement.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-navy-500">
              ScopeSnap turns messy client briefs into structured scopes, risk checks, milestone-based quotes, and printable
              proposals — in minutes, not evenings.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="lg" onClick={onPrimary} className="w-full sm:w-auto">Analyze a Client Brief</Button>
              <Button size="lg" variant="secondary" onClick={onSample} className="w-full sm:w-auto">Explore a Sample Project</Button>
            </div>
            <ul className="mt-8 space-y-2.5">
              <li className="flex items-center gap-2.5 text-sm text-navy-600">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Deliverables marked “From the brief” only when the client said so
              </li>
              <li className="flex items-center gap-2.5 text-sm text-navy-600">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                Risk flags for vague deadlines, tight budgets, and scope creep
              </li>
              <li className="flex items-center gap-2.5 text-sm text-navy-600">
                <Lock className="h-4 w-4 text-navy-500" />
                Your projects are saved in your browser — no account required
              </li>
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:max-w-none">
            <div className="rounded-3xl border border-navy-100 bg-white p-6 shadow-lift sm:p-7">
              <p className="font-heading text-xs font-semibold uppercase tracking-widest text-navy-400">Client brief — as received</p>
              <p className="mt-3 max-h-44 overflow-hidden whitespace-pre-line rounded-2xl bg-navy-50 p-4 text-xs leading-relaxed text-navy-600">
                {SAMPLE_BRIEF}
              </p>
              <p className="mt-5 font-heading text-xs font-semibold uppercase tracking-widest text-navy-400">After ScopeSnap</p>
              <div className="mt-3 space-y-2.5">
                <div className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-2.5 shadow-card">
                  <span className="text-sm font-medium text-navy-800">Deliverables identified</span>
                  <span className="font-heading text-sm font-bold text-emerald-600">7</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-2.5 shadow-card">
                  <span className="text-sm font-medium text-navy-800">Missing information</span>
                  <span className="font-heading text-sm font-bold text-amber-600">8 items</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-navy-100 bg-white px-4 py-2.5 shadow-card">
                  <span className="text-sm font-medium text-navy-800">Risk signals</span>
                  <span className="font-heading text-sm font-bold text-rose-600">2 flagged</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-accent-200 bg-accent-50 px-4 py-2.5">
                  <span className="text-sm font-medium text-accent-800">Example quote — 3 milestones</span>
                  <span className="font-heading text-sm font-bold text-accent-700">$1,500 USD</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-navy-100 bg-navy-50/60 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle
            eyebrow="How it works"
            title="From inbox chaos to signed-off scope"
            description="No accounts, no setup. Paste a brief and work through the four steps — everything is saved in your browser on your device."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">{step.icon}</div>
                  <span className="font-heading text-2xl font-extrabold text-navy-200">{index + 1}</span>
                </div>
                <h3 className="mt-4 font-heading text-base font-semibold text-navy-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-navy-100 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <SectionTitle
            eyebrow="Features"
            title="Everything between the first message and the signature"
            description="ScopeSnap covers the whole path from an informal request to a document you can both sign."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent-600">{feature.icon}</div>
                <h3 className="mt-4 font-heading text-base font-semibold text-navy-900">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-navy-500">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy-100 bg-navy-50/60 py-16">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center">
          <h2 className="font-heading text-2xl font-extrabold text-navy-900 sm:text-3xl">Ready to turn your next brief into an agreement?</h2>
          <p className="max-w-xl text-sm leading-relaxed text-navy-500">
            Paste the last confusing client email you received and see what ScopeSnap finds in it.
          </p>
          <Button size="lg" onClick={onPrimary}>Analyze a Client Brief</Button>
        </div>
      </section>

      <footer className="border-t border-navy-100 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex shrink-0 items-center gap-2 font-heading text-base font-bold text-navy-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-navy-900 font-heading text-xs font-extrabold text-white">S</span> ScopeSnap
          </div>
          <p className="max-w-md text-sm leading-relaxed text-navy-400">
            Turn messy client briefs into clear project agreements. Projects are saved only in your browser. When you run an AI
            analysis, the brief text is sent to a third-party AI provider to generate the results — the app itself stores no
            briefs on any server.
          </p>
        </div>
      </footer>
    </div>
  );
}
