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
      system: `You are a world-class Industrial Psychologist. 
      Analyze the text provided and quantify the Big Five personality traits.
      Return ONLY a raw JSON object with these EXACT keys: 
      "Openness", "Conscientiousness", "Extraversion", "Agreeableness", "Neuroticism", "summary".
      Ensure scores are numbers between 0 and 100.
      Do not include markdown backticks or any other text.`,
      prompt: userInput,
    });

    // Clean the text just in case the AI adds markdown backticks (```json)
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Convert the string into a real Javascript Object
    const result = JSON.parse(cleanJson);
    
    return result;
  } catch (error) {
    console.error("DETAILED_AI_ERROR:", error);
    throw new Error("Neural Engine failed to parse data.");
  }
}