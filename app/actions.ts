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
      system: `You are an elite Industrial Psychologist. 
      Analyze the text and quantify the following traits (0-100): 
      Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism, Narcissism, Machiavellianism, Psychopathy.
      
      Return ONLY a raw JSON object. No backticks, no markdown.
      Format: {"Openness": 80, "Conscientiousness": 90, "Extraversion": 50, "Agreeableness": 60, "Neuroticism": 20, "Narcissism": 10, "Machiavellianism": 5, "Psychopathy": 0, "summary": "Two sentences here", "risk_warning": "One sentence here"}`,
      prompt: userInput,
    });

    // This "Cleans" the AI's response if it accidentally adds ```json
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
    
  } catch (error) {
    console.error("DETAILED_ENGINE_ERROR:", error);
    throw new Error("Neural Engine failed to parse data.");
  }
}