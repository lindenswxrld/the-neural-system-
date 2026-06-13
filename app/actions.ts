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
      system: `You are an elite Industrial Psychologist. Analyze text for:
      1. Big Five (OCEAN)
      2. Dark Triad (Narcissism, Machiavellianism, Psychopathy)
      3. Advanced Metrics: 
         - BurnoutRisk: (JD-R Model - Balance of Demands vs Resources)
         - PsychSafety: (Edmondson's Model - Safety to speak/voice)
         - Ownership: (Rotter's Locus of Control - Internal vs External)
      
      Return ONLY a raw JSON object. Format: 
      {"Openness": 80, "Conscientiousness": 90, "Extraversion": 50, "Agreeableness": 60, "Neuroticism": 20, 
       "Narcissism": 10, "Machiavellianism": 5, "Psychopathy": 0, 
       "BurnoutRisk": 30, "PsychSafety": 85, "Ownership": 75,
       "summary": "...", "risk_warning": "..."}`,
      prompt: userInput,
    });
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("ANALYSIS_ERROR:", error);
    throw new Error("Analysis failed");
  }
}

export async function compareCandidates(candidateA: any, candidateB: any) {
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are an elite Industrial Psychologist. Compare ${candidateA.name} and ${candidateB.name}. 
      Use JD-R and Psych Safety frameworks to recommend the best institutional fit.`,
      prompt: `Data A: ${JSON.stringify(candidateA.data)}. Data B: ${JSON.stringify(candidateB.data)}.`,
    });
    return text;
  } catch (error) { return "Optimizing differential..."; }
}