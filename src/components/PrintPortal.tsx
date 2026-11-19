import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

// Renders children into a body-level container that print CSS can isolate.
// Everything else on the page (the app shell inside #root) is hidden in
// print via `body > :not(#proposal-document)`, so paper output contains
// only the proposal document.
export function PrintPortal({ children }: { children: ReactNode }) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <div id="proposal-document" className="hidden print:block">
      {children}
    </div>,
    document.body
  );
}
