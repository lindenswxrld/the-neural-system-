"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { AnalysisSchema, type Analysis, type ActionResult } from "@/lib/schema";

const MODEL = "llama-3.3-70b-versatile";
const MAX_INPUT = 8000;

function model() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return createOpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey }).chat(MODEL);
}

const ANALYSIS_PROMPT = `You are an industrial-organisational psychology analyst. You read workplace text
(self-descriptions, interview notes, performance narratives) and estimate behavioural indicators.
These are text-based indicators, NOT clinical diagnoses and NOT validated psychometric scores.

SCALE: every score is an integer from 0 to 100. 50 means average or no evidence either way.
Move away from 50 only when the text gives concrete support. Never infer traits from what is missing.
Do not use age, gender, race, religion, health or any protected characteristic.

CONFIDENCE: "low" if the text is under ~80 words or vague, "medium" for moderate evidence, "high" only
for rich, specific, consistent evidence.

Return ONLY one raw JSON object (no markdown, no backticks) with exactly these keys:
{
 "big5": {"openness":0,"conscientiousness":0,"extraversion":0,"agreeableness":0,"neuroticism":0},
 "darkTriad": {"narcissism":0,"machiavellianism":0,"psychopathy":0},
 "workplace": {"burnoutRisk":0,"psychSafety":0,"ownership":0},
 "confidence": "low|medium|high",
 "evidence": ["up to 5 short verbatim quotes from the input that drove the scores"],
 "summary": "2 sentences",
 "riskWarning": "1-2 sentences on the main risk, or state that no significant risk is evident",
 "brief": "about 200 words: likely origins of the pattern (JD-R, SDT, COR where relevant), organisational impact, and limits of this analysis",
 "actions": ["2 to 4 specific, practical management actions tied to this person's scores"]
}`;

function extractJson(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end <= start) throw new Error("No JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

export async function analyzePerformance(input: string): Promise<ActionResult<Analysis>> {
  const m = model();
  if (!m) return { ok: false, error: "GROQ_API_KEY is not configured on the server." };
  const clean = input.trim().slice(0, MAX_INPUT);
  if (clean.length < 40) return { ok: false, error: "Provide at least a few sentences of behavioural data." };

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { text } = await generateText({
        model: m,
        temperature: 0.2,
        system: ANALYSIS_PROMPT,
        prompt: clean,
      });
      return { ok: true, data: AnalysisSchema.parse(extractJson(text)) };
    } catch (e) {
      console.error(`ANALYSIS_ERROR attempt ${attempt + 1}:`, e);
    }
  }
  return { ok: false, error: "The analysis engine returned an unusable response. Please retry." };
}

export async function compareCandidates(
  a: Analysis,
  b: Analysis,
): Promise<ActionResult<string>> {
  const m = model();
  if (!m) return { ok: false, error: "GROQ_API_KEY is not configured on the server." };
  try {
    const { text } = await generateText({
      model: m,
      temperature: 0.2,
      system: `Compare two anonymised profiles using ONLY the numbers provided. Candidates are "A" and "B".
No role was specified, so do not name a "best fit"; describe where each profile is stronger, where the
risks differ, and what role conditions would favour each. Note that confidence levels limit the comparison.
Under 150 words, plain prose.`,
      prompt: `A: ${JSON.stringify({ ...a, evidence: undefined, brief: undefined })}\nB: ${JSON.stringify({ ...b, evidence: undefined, brief: undefined })}`,
    });
    return { ok: true, data: text.trim() };
  } catch (e) {
    console.error("COMPARE_ERROR:", e);
    return { ok: false, error: "Comparison failed. Please retry." };
  }
}
