import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SaveFeedback {
  message: string;
  success: boolean;
}

const SaveFeedbackContext = createContext<(feedback: SaveFeedback) => void>(() => {});

export function useSaveFeedback() {
  return useContext(SaveFeedbackContext);
}

export function SaveFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<SaveFeedback | null>(null);

  const push = useCallback((next: SaveFeedback) => {
    setFeedback(next);
  }, []);

  return (
    <SaveFeedbackContext.Provider value={push}>
      {children}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border px-4 py-3 shadow-lift transition ${
            feedback.success ? 'border-emerald-200 bg-emerald-50 text-emerald-900' : 'border-rose-200 bg-rose-50 text-rose-900'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span className="text-sm font-medium">{feedback.message}</span>
          <button
            onClick={() => setFeedback(null)}
            className="ml-1 text-xs font-semibold underline opacity-60 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}
    </SaveFeedbackContext.Provider>
  );
}
