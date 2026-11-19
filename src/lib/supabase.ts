
import { createClient } from '@supabase/supabase-js';
import type { BriefAnalysis } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function analyzeBriefWithGemini(
  brief: string
): Promise<{ analysis: BriefAnalysis; model: string }> {
  const { data: sessionData } = await supabase.auth.getSession();

  const response = await fetch(`${supabaseUrl}/functions/v1/gemini-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionData.session?.access_token ?? supabaseAnonKey}`,
    },
    body: JSON.stringify({ brief }),
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;

    try {
      const errorBody: { error?: string } = await response.json();

      if (typeof errorBody.error === 'string') {
        message = errorBody.error;
      }
    } catch {
      // Keep the default error message if the response isn't valid JSON.
    }

    throw new Error(message);
  }

  const body: {
    source?: string;
    analysis?: BriefAnalysis;
    model?: string;
  } = await response.json();

  if (body.source !== 'gemini' || !body.analysis || !body.model) {
    throw new Error('Unexpected response from AI service.');
  }

  return {
    analysis: body.analysis,
    model: body.model,
  };
}
