'use server'

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzePerformance(userInput: string) {
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a Senior Industrial Psychologist and Performance Architect. 
      Analyze the text for:
      1. Big Five (OCEAN)
      2. Dark Triad (Narcissism, Machiavellianism, Psychopathy)
      3. JD-R Burnout, Psych Safety, and Locus of Control.
      
      CRITICAL: You must also provide an 'in_depth_prognosis'. 
      Write this as a formal psychological report for a CEO. 
      Include 3 sections: 
      - THE ETIOLOGY: Where these scores stem from (e.g., environmental stressors, internal personality stable traits).
      - ORGANIZATIONAL IMPACT: How this behavior affects the team and ROI.
      - CLINICAL PRESCRIPTION: 3 specific management measures to prevent or change the behavior.

      Return ONLY a raw JSON object. 
      Format: {"Openness": 80, ..., "BurnoutRisk": 30, ..., "summary": "...", "risk_warning": "...", "in_depth_prognosis": "The full report text here..."}`,
      prompt: userInput,
    });

    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("ANALYSIS_ERROR:", error);
    throw new Error("Analysis failed");
  }
}

// ... compareCandidates stays the same ...
export async function compareCandidates(candidateA: any, candidateB: any) {
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are a Lead Industrial Psychologist. Compare ${candidateA.name} and ${candidateB.name}. Use the JD-R and Psych Safety frameworks. Identify the better institutional fit.`,
      prompt: `Data A: ${JSON.stringify(candidateA.data)}. Data B: ${JSON.stringify(candidateB.data)}.`,
    });
    return text;
  } catch (error) { return "Optimizing..."; }
}