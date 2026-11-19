import type { ReactNode } from 'react';
import { FilePlus2, FolderOpen, PenLine, Printer, Settings } from 'lucide-react';
import type { View } from '@/hooks/useAppController';
import type { Project } from '@/lib/types';

const navItems: { view: View; label: string; icon: ReactNode }[] = [
  { view: 'brief', label: 'New Brief', icon: <FilePlus2 className="h-4 w-4" /> },
  { view: 'projects', label: 'My Projects', icon: <FolderOpen className="h-4 w-4" /> },
  { view: 'proposal', label: 'Proposal Builder', icon: <PenLine className="h-4 w-4" /> },
  { view: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
];

export function WorkspaceShell({
  view,
  go,
  activeProject,
  projects,
  children,
}: {
  view: View;
  go: (view: View) => void;
  activeProject: Project | null;
  projects: Project[];
  children: ReactNode;
}) {
  const tabs = [...navItems];
  if (activeProject) {
    tabs.splice(2, 0, { view: 'quote', label: 'Quote & Milestones', icon: <Printer className="h-4 w-4" /> });
  }
  void projects;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-navy-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <button onClick={() => go('landing')} className="flex shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 font-heading text-sm font-extrabold text-white">S</span>
            <span className="font-heading text-lg font-bold tracking-tight text-navy-900">ScopeSnap</span>
          </button>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Workspace">
            {tabs.map((item) => (
              <button
                key={item.view + item.label}
                onClick={() => go(item.view)}
                aria-current={view === item.view ? 'page' : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  view === item.view ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="md:hidden">
            <select
              value={view}
              onChange={(e) => go(e.target.value as View)}
              aria-label="Workspace section"
              className="rounded-lg border border-navy-200 bg-white px-2 py-2 text-sm text-navy-800"
            >
              {tabs.map((item) => (
                <option key={item.view + item.label} value={item.view}>{item.label}</option>
              ))}
            </select>
          </div>
        </div>
        {activeProject && (
          <div className="border-t border-navy-100 bg-navy-50/70">
            <div className="mx-auto flex max-w-6xl items-center gap-3 overflow-x-auto px-4 py-2 text-sm sm:px-6">
              <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-navy-400">Active project</span>
              <span className="max-w-[160px] shrink truncate rounded-full border border-navy-100 bg-white px-3 py-0.5 text-xs font-semibold text-navy-800 sm:max-w-none">
                {activeProject.name}
              </span>
              <div className="flex min-w-0 items-center gap-1.5">
                {(['brief', 'scope', 'quote', 'proposal'] as View[]).map((step) => (
                  <button
                    key={step}
                    onClick={() => go(step)}
                    aria-current={view === step ? 'step' : undefined}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                      view === step ? 'bg-navy-900 text-white' : 'text-navy-500 hover:bg-white'
                    }`}
                  >
                    {step === 'brief' ? '1. Brief' : step === 'scope' ? '2. Scope' : step === 'quote' ? '3. Quote' : '4. Proposal'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
