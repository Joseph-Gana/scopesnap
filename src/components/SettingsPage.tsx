import { useEffect, useRef, useState } from 'react';
import { Check, Settings } from 'lucide-react';
import { Button, Card, CardHeader, Field, inputClass, SectionTitle } from '@/components/ui/Primitives';
import { Callout } from '@/components/ui/Feedback';
import type { AppSettings } from '@/lib/storage';
import type { CurrencyCode } from '@/lib/types';

export function SettingsPage({
  settings,
  updateSettings,
}: {
  settings: AppSettings;
  updateSettings: (next: Partial<AppSettings>) => boolean;
}) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const handleSave = () => {
    if (saveState === 'saving') return;
    setSaveState('saving');
    const persisted = updateSettings({});
    setSaveState(persisted ? 'saved' : 'error');
    if (persisted) {
      timerRef.current = window.setTimeout(() => setSaveState('idle'), 2500);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle title="Settings" description="Defaults applied to new projects. Stored on this device only." />
      <Card>
        <CardHeader icon={<Settings className="h-5 w-5" />} title="Your details" subtitle="Pre-fills new proposals." />
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="Your name / business">
            <input value={settings.freelancerName} onChange={(e) => updateSettings({ freelancerName: e.target.value })} className={inputClass} placeholder="e.g. Alex Morgan or Brightside Studio" />
          </Field>
          <Field label="Contact details">
            <input value={settings.freelancerContact} onChange={(e) => updateSettings({ freelancerContact: e.target.value })} className={inputClass} placeholder="alex@example.com · +1 555 010 1234" />
          </Field>
          <Field label="Default currency">
            <select value={settings.defaultCurrency} onChange={(e) => updateSettings({ defaultCurrency: e.target.value as CurrencyCode })} className={inputClass}>
              {(['USD', 'GBP', 'EUR', 'NGN'] as CurrencyCode[]).map((code) => <option key={code} value={code}>{code}</option>)}
            </select>
          </Field>
        </div>
      </Card>
      {saveState === 'error' && (
        <Callout tone="error">
          Settings could not be saved — your browser storage is unavailable (private mode or storage full). Your changes apply to
          this session only.
        </Callout>
      )}
      <Callout tone="info">
        Projects and settings are stored in this browser. Clearing your browser data removes them — save important proposals as PDFs.
      </Callout>
      <div className="flex items-center justify-end gap-3">
        {saveState === 'saved' && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" /> Settings saved successfully
          </span>
        )}
        <Button onClick={handleSave} disabled={saveState === 'saving'}>
          {saveState === 'saved' ? 'Saved' : saveState === 'saving' ? 'Saving…' : 'Save settings'}
        </Button>
      </div>
    </div>
  );
}
