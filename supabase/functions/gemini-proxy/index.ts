const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DEFAULT_MODEL = "gemini-3.5-flash-lite";

function modelCandidates(): string[] {
  const configured = Deno.env.get("GEMINI_MODEL")?.trim();
  const fallbacks = ["gemini-2.5-flash-lite", "gemini-2.0-flash"];
  if (configured) return [configured, ...fallbacks];
  return [DEFAULT_MODEL, ...fallbacks];
}

const SYSTEM_PROMPT = `You are ScopeSnap's senior project consultant. You analyze informal client briefs on behalf of freelancers and small agencies.

Return ONLY valid JSON matching exactly this shape:
{
  "projectType": "short category, e.g. Website development",
  "summary": "2-4 sentence neutral summary of what the client says they want. Only facts stated in the brief.",
  "deliverables": [{ "title": "short deliverable name", "detail": "one sentence of context", "inBrief": true }],
  "missingInfo": ["specific information the brief fails to specify"],
  "assumptions": ["a reasonable working assumption the freelancer would need the client to confirm"],
  "risks": [{ "severity": "low", "text": "risk description" }],
  "questions": ["the single most important question to ask the client"]
}

Rules:
- inBrief must be true ONLY for deliverables the client explicitly asked for, close to their own words. Anything you infer must be inBrief=false.
- Never fabricate budgets, deadlines, approvals, or commitments the brief does not contain.
- missingInfo items must be concrete (budget range, deadline, target audience, content readiness, hosting/domain, revision expectations) and included ONLY when actually absent from the brief.
- Provide 4-8 items for missingInfo, assumptions, and questions; 2-6 risks; no duplicates.`;

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function asCleanStringArray(value: unknown, max: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, max);
}

function asRisks(value: unknown): { severity: "low" | "medium" | "high"; text: string }[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(["low", "medium", "high"]);
  const risks: { severity: "low" | "medium" | "high"; text: string }[] = [];
  for (const item of value) {
    if (typeof item === "string" && item.trim()) {
      risks.push({ severity: "medium", text: item.trim() });
      continue;
    }
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      const text = typeof obj.text === "string" ? obj.text.trim() : "";
      const severity = typeof obj.severity === "string" && allowed.has(obj.severity)
        ? (obj.severity as "low" | "medium" | "high")
        : "medium";
      if (text) risks.push({ severity, text });
    }
  }
  return risks.slice(0, 8);
}

function asDeliverables(value: unknown): { id: string; title: string; detail: string; supported: boolean }[] {
  if (!Array.isArray(value)) return [];
  const out: { id: string; title: string; detail: string; supported: boolean }[] = [];
  for (const item of value) {
    if (typeof item === "string") {
      if (item.trim()) out.push({ id: crypto.randomUUID(), title: item.trim(), detail: "", supported: false });
      continue;
    }
    if (typeof item === "object" && item !== null) {
      const obj = item as Record<string, unknown>;
      const title = typeof obj.title === "string" ? obj.title.trim() : "";
      if (!title) continue;
      out.push({
        id: crypto.randomUUID(),
        title,
        detail: typeof obj.detail === "string" ? obj.detail.trim() : "",
        supported: obj.inBrief === true,
      });
    }
  }
  return out.slice(0, 12);
}

function normalizeAnalysis(raw: unknown): Record<string, unknown> | null {
  if (typeof raw !== "object" || raw === null) return null;
  const obj = raw as Record<string, unknown>;
  const summary = typeof obj.summary === "string" ? obj.summary.trim() : "";
  if (!summary) return null;
  return {
    projectType: typeof obj.projectType === "string" && obj.projectType.trim() ? obj.projectType.trim() : "General project",
    summary,
    deliverables: asDeliverables(obj.deliverables),
    missingInfo: asCleanStringArray(obj.missingInfo, 10),
    assumptions: asCleanStringArray(obj.assumptions, 10),
    risks: asRisks(obj.risks),
    questions: asCleanStringArray(obj.questions, 10),
  };
}

function extractModelText(data: Record<string, unknown>): string {
  const candidates = data.candidates;
  if (!Array.isArray(candidates) || candidates.length === 0) return "";
  const first = candidates[0] as Record<string, unknown>;
  const content = first?.content as Record<string, unknown> | undefined;
  const parts = content?.parts;
  if (!Array.isArray(parts)) return "";
  return parts
    .map((p) => (typeof (p as Record<string, unknown>).text === "string" ? (p as Record<string, unknown>).text as string : ""))
    .join("");
}

function parseJsonPayload(text: string): unknown {
  const stripped = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/i, "").trim();
  return JSON.parse(stripped);
}

function isModelUnavailable(status: number, message: string): boolean {
  if (status === 404 || status === 429) return true;
  const lowered = message.toLowerCase();
  return lowered.includes("not found") || lowered.includes("not supported") || lowered.includes("quota");
}

async function generate(brief: string, apiKey: string): Promise<Record<string, unknown>> {
  const prompt = `${SYSTEM_PROMPT}\n\nAnalyze this client brief:\n\n"""${brief}"""`;
  let lastError = "No Gemini model could be reached.";

  for (const model of modelCandidates()) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, responseMimeType: "application/json", maxOutputTokens: 2048 },
          }),
          signal: AbortSignal.timeout(30000),
        },
      );
      if (!res.ok) {
        const errBody = await res.text().catch(() => "");
        if (isModelUnavailable(res.status, errBody)) {
          lastError = `Model ${model} unavailable (${res.status}).`;
          continue;
        }
        throw new Error(`Gemini request failed (${res.status}).`);
      }
      const data = await res.json() as Record<string, unknown>;
      const text = extractModelText(data);
      if (!text) {
        lastError = "Gemini returned an empty response.";
        continue;
      }
      const analysis = normalizeAnalysis(parseJsonPayload(text));
      if (!analysis) {
        lastError = "Gemini returned data in an unexpected shape.";
        continue;
      }
      return { source: "gemini", model, analysis };
    } catch (err) {
      lastError = err instanceof Error ? err.message : lastError;
    }
  }
  throw new Error(lastError);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return json({ error: "AI analysis is not configured on the server yet." }, 503);
    }
    const body = await req.json().catch(() => ({}));
    const brief = typeof body.brief === "string" ? body.brief.trim() : "";
    if (brief.length < 40) {
      return json({ error: "Please provide a brief of at least 40 characters." }, 400);
    }
    if (brief.length > 20000) {
      return json({ error: "Brief is too long. Please keep it under 20,000 characters." }, 400);
    }
    const result = await generate(brief, apiKey);
    return json(result, 200);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unexpected server error." }, 502);
  }
});
