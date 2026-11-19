import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { SaveFeedbackProvider } from '@/components/ui/SaveToast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SaveFeedbackProvider>
      <App />
    </SaveFeedbackProvider>
  </StrictMode>
);
