import { useEffect, useRef, useState } from 'react';
import { useAppController } from '@/hooks/useAppController';
import { LandingPage } from '@/components/LandingPage';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { BriefPage } from '@/components/BriefPage';
import { ScopePage } from '@/components/ScopePage';
import { QuotePage } from '@/components/QuotePage';
import { ProposalPage } from '@/components/ProposalPage';
import { ProjectsPage } from '@/components/ProjectsPage';
import { SettingsPage } from '@/components/SettingsPage';
import { useSaveFeedback } from '@/components/ui/SaveToast';

export default function App() {
  const app = useAppController();
  const settings = app.settings;
  const activeProject = app.activeProject;
  const pushSaveFeedback = useSaveFeedback();

  const saveActive = () => {
    if (!activeProject) return;
    const ok = app.saveProject(activeProject);
    pushSaveFeedback(
      ok
        ? { message: 'Project saved successfully.', success: true }
        : { message: 'Save failed — your browser storage is unavailable. Check that storage/cookies are allowed for this site.', success: false }
    );
  };

  useEffect(() => {
    // Autosave the active project so edits survive reloads.
    if (!app.activeProject) return;
    const exists = app.projects.some((p) => p.id === app.activeProject!.id);
    if (!exists) app.saveProject(app.activeProject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeProject?.id]);

  const lastSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (!app.activeProject) {
      lastSavedRef.current = null;
      return;
    }
    const project = app.activeProject;
    if (lastSavedRef.current === null) {
      lastSavedRef.current = project.updatedAt;
      return;
    }
    const timer = window.setTimeout(() => {
      app.saveProject(project);
      lastSavedRef.current = project.updatedAt;
    }, 800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [app.activeProject]);

  const ensureDefaults = () => {
    if (!activeProject) return;
    const p = activeProject;
    // Only update when a default is actually missing, otherwise this would
    // fire a state update on every render and loop forever.
    const needsCurrency = p.quote.totalCents <= 0 && p.quote.currency !== settings.defaultCurrency;
    const needsName = !p.proposal.freelancerName && !!settings.freelancerName;
    const needsContact = !p.proposal.freelancerContact && !!settings.freelancerContact;
    if (!needsCurrency && !needsName && !needsContact) return;
    app.updateActiveProject(() => ({
      ...p,
      quote: needsCurrency ? { ...p.quote, currency: settings.defaultCurrency } : p.quote,
      proposal: {
        ...p.proposal,
        freelancerName: needsName ? settings.freelancerName : p.proposal.freelancerName,
        freelancerContact: needsContact ? settings.freelancerContact : p.proposal.freelancerContact,
      },
    }));
  };

  const guard = (view: 'scope' | 'quote' | 'proposal') => {
    if (!activeProject) {
      app.go('brief');
      return null;
    }
    ensureDefaults();
    return view;
  };

  let content: JSX.Element | null = null;
  switch (app.view) {
    case 'landing':
      content = <LandingPage onPrimary={() => app.startNewBrief()} onSample={app.openSample} />;
      break;
    case 'brief':
      content = (
        <BriefPage
          project={app.activeProject}
          onAnalyzed={(project) => {
            app.saveProject(project);
            app.setActiveProject(project);
            app.go('scope');
          }}
        />
      );
      break;
    case 'scope':
      content = guard('scope') && app.activeProject ? (
        <ScopePage
          project={app.activeProject}
          onChange={app.updateActiveProject}
          onSave={saveActive}
          onContinue={() => app.go('quote')}
        />
      ) : null;
      break;
    case 'quote':
      content = guard('quote') && app.activeProject ? (
        <QuotePage
          project={app.activeProject}
          onChange={app.updateActiveProject}
          onSave={saveActive}
          onContinue={() => app.go('proposal')}
        />
      ) : null;
      break;
    case 'proposal':
      content = guard('proposal') && app.activeProject ? (
        <ProposalPage
          project={app.activeProject}
          onChange={app.updateActiveProject}
          onSave={saveActive}
        />
      ) : null;
      break;
    case 'projects':
      content = (
        <ProjectsPage
          projects={app.projects}
          activeProjectId={app.activeProject?.id ?? null}
          onOpen={(project) => {
            app.setActiveProject(project);
            app.go('scope');
          }}
          onDelete={app.deleteProject}
          go={app.go}
        />
      );
      break;
    case 'settings':
      content = <SettingsPage settings={app.settings} updateSettings={app.updateSettings} />;
      break;
    default:
      content = null;
  }

  return (
    <>
      {app.view === 'landing' ? (
        content
      ) : (
        <WorkspaceShell view={app.view} go={app.go} activeProject={app.activeProject} projects={app.projects}>
          {content}
        </WorkspaceShell>
      )}
    </>
  );
}