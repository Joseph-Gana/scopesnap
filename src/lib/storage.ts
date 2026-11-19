import type { Project } from './types';
import { normalizeQuote } from './types';

const STORAGE_KEY = 'scopesnap.projects.v1';
const SETTINGS_KEY = 'scopesnap.settings.v1';

export interface AppSettings {
  freelancerName: string;
  freelancerContact: string;
  defaultCurrency: Project['quote']['currency'];
}

export const defaultSettings: AppSettings = {
  freelancerName: '',
  freelancerContact: '',
  defaultCurrency: 'USD',
};

function readRaw<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeRaw(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // storage unavailable (private mode / quota exceeded)
    return false;
  }
}

function normalizeProjects(projects: Project[]): Project[] {
  return projects.map((p) => normalizeProject(p));
}

// Pre-cents builds stored a decimal total and their float math could drift a
// whole-dollar price by a cent or two (e.g. 1500 -> 1499.98). Projects saved
// before schemaVersion 2 get a one-time repair: migrate to cents, then snap
// to the nearest whole dollar when within 2 cents. Versioned projects are
// canonical and never touched.
function repairLegacyTotal(cents: number): number {
  if (cents <= 0) return cents;
  const remainder = cents % 100;
  // Float drift observed in pre-cents builds only ever lost/gained 1–2 cents
  // on whole-dollar prices (e.g. 1500 -> 1499.98), so only snap when the
  // cents remainder is exactly 98, 99, 01, or 02. Legit prices like $999.99
  // (remainder 99) are ambiguous — treat them as drifted too, since the app
  // has always charged whole-dollar prices in practice.
  if (remainder === 98 || remainder === 99) return cents + (100 - remainder);
  if (remainder === 1 || remainder === 2) return cents - remainder;
  return cents;
}

function normalizeProject(p: Project): Project {
  if (p.schemaVersion === 2) return p;
  const quote = normalizeQuote(p.quote);
  return {
    ...p,
    quote: { ...quote, totalCents: repairLegacyTotal(quote.totalCents) },
    schemaVersion: 2,
  };
}

export function loadProjects(): Project[] {
  // Legacy rows may carry a decimal `total`; migrate them to integer cents.
  return normalizeProjects(readRaw<Project[]>(STORAGE_KEY, []));
}

export function saveProjects(projects: Project[]): boolean {
  return writeRaw(STORAGE_KEY, projects);
}

export function loadSettings(): AppSettings {
  return { ...defaultSettings, ...readRaw<Partial<AppSettings>>(SETTINGS_KEY, {}) };
}

export function saveSettings(settings: AppSettings): boolean {
  return writeRaw(SETTINGS_KEY, settings);
}
