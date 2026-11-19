import { useState } from 'react';
import { loadProjects, saveProjects, loadSettings, saveSettings, type AppSettings } from '@/lib/storage';
import { loadSampleProject } from '@/lib/sampleProject';
import type { Project } from '@/lib/types';

export type View = 'landing' | 'workspace' | 'brief' | 'scope' | 'quote' | 'proposal' | 'projects' | 'settings';

interface AppController {
  view: View;
  go: (view: View) => void;
  projects: Project[];
  activeProject: Project | null;
  settings: AppSettings;
  updateSettings: (next: Partial<AppSettings>) => boolean;
  startNewBrief: (brief?: string) => void;
  setActiveProject: (project: Project) => void;
  updateActiveProject: (updater: (project: Project) => Project) => void;
  saveProject: (project: Project) => boolean;
  deleteProject: (id: string) => void;
  openSample: () => void;
}

export function useAppController(): AppController {
  const [view, setView] = useState<View>('landing');
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [activeProject, setActiveProjectState] = useState<Project | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());

  const go = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0 });
  };

  const startNewBrief = (brief?: string) => {
    setActiveProjectState(null);
    go('brief');
    if (brief !== undefined) {
      window.setTimeout(() => window.dispatchEvent(new CustomEvent('scopesnap:brief', { detail: brief })), 0);
    }
  };

  const setActiveProject = (project: Project) => {
    setActiveProjectState(project);
    go('brief');
  };

  const updateActiveProject = (updater: (project: Project) => Project) => {
    setActiveProjectState((current) => {
      if (!current) return current;
      return updater(current);
    });
  };

  const saveProject = (project: Project): boolean => {
    const stamped = { ...project, updatedAt: new Date().toISOString() };
    setActiveProjectState(stamped);
    let persisted = true;
    setProjects((current) => {
      const next = current.some((p) => p.id === stamped.id)
        ? current.map((p) => (p.id === stamped.id ? stamped : p))
        : [stamped, ...current];
      persisted = saveProjects(next);
      return next;
    });
    return persisted;
  };

  const deleteProject = (id: string) => {
    setProjects((current) => {
      const next = current.filter((p) => p.id !== id);
      saveProjects(next);
      return next;
    });
    setActiveProjectState((current) => (current?.id === id ? null : current));
  };

  const updateSettings = (next: Partial<AppSettings>): boolean => {
    let persisted = true;
    setSettings((current) => {
      const merged = { ...current, ...next };
      persisted = saveSettings(merged);
      return merged;
    });
    return persisted;
  };

  const openSample = () => {
    const sample = loadSampleProject();
    setActiveProjectState(sample);
    go('brief');
  };

  return {
    view,
    go,
    projects,
    activeProject,
    settings,
    updateSettings,
    startNewBrief,
    setActiveProject,
    updateActiveProject,
    saveProject,
    deleteProject,
    openSample,
  };
}
