'use server'

import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// SINGLE AUDIT FUNCTION (Manual Parse for Stability)
export async function analyzePerformance(userInput: string) {
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are an elite Industrial Psychologist. 
      Analyze the text and quantify these traits (0-100): 
      Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism, Narcissism, Machiavellianism, Psychopathy.
      
      Return ONLY a raw JSON object. No backticks.
      Format: {"Openness": 80, "Conscientiousness": 90, "Extraversion": 50, "Agreeableness": 60, "Neuroticism": 20, "Narcissism": 10, "Machiavellianism": 5, "Psychopathy": 0, "summary": "...", "risk_warning": "..."}`,
      prompt: userInput,
    });

    // Clean the AI response of any potential markdown backticks
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error) {
    console.error("ANALYSIS_ERROR:", error);
    throw new Error("Analysis failed");
  }
}

// COMPARISON FUNCTION
export async function compareCandidates(candidateA: any, candidateB: any) {
  try {
    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: `You are an elite Industrial Psychologist. Compare ${candidateA.name} and ${candidateB.name}. 
      Provide a 3-sentence executive summary highlighting who is the better institutional fit and why.`,
      prompt: `Candidate A Scores: ${JSON.stringify(candidateA.data)}. Candidate B Scores: ${JSON.stringify(candidateB.data)}.`,
    });
    return text;
  } catch (error) {
    console.error("COMPARISON_ERROR:", error);
    return "The comparison engine is currently optimizing. Please review data manually.";
  }
}