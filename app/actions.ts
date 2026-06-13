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
      system: `You are a Senior Industrial Psychologist. Analyze the provided text.
      Return ONLY a raw JSON object. NO backticks, NO markdown, NO introductory text.
      
      Required Keys:
      "Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism", 
      "Narcissism", "Machiavellianism", "Psychopathy", 
      "BurnoutRisk", "PsychSafety", "Ownership",
      "summary", "risk_warning", "in_depth_prognosis"

      The "in_depth_prognosis" MUST be 300 words. Describe the ETIOLOGY (origin of traits), 
      ORGANIZATIONAL IMPACT, and 3 CLINICAL PRESCRIPTIONS.`,
      prompt: userInput,
    });

    // CLEANING LOGIC: Remove any text that is not the JSON object
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}') + 1;
    const cleanJson = text.substring(startIndex, endIndex);
    
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("ANALYSIS_ERROR:", error);
    throw new Error("Neural Engine Timeout");
  }
}

export async function compareCandidates(candidateA: any, candidateB: any) {
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `Compare these two candidates: ${candidateA.name} and ${candidateB.name}. Highlight best fit.`,
      prompt: `A: ${JSON.stringify(candidateA.data)}. B: ${JSON.stringify(candidateB.data)}.`,
    });
    return text;
  } catch (error) { return "Differential calculating..."; }
}