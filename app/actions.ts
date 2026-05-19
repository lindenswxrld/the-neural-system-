'use server'

import { createOpenAI } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzePerformance(userInput: string) {
  try {
    const { object } = await generateObject({
      model: groq('llama-3.3-70b-versatile'),
      schema: z.object({
        // Performance Traits
        Openness: z.number().min(0).max(100),
        Conscientiousness: z.number().min(0).max(100),
        Extraversion: z.number().min(0).max(100),
        Agreeableness: z.number().min(0).max(100),
        Neuroticism: z.number().min(0).max(100),
        
        // Dark Triad / Risk Traits
        Narcissism: z.number().min(0).max(100),
        Machiavellianism: z.number().min(0).max(100),
        Psychopathy: z.number().min(0).max(100),
        
        summary: z.string(),
        risk_warning: z.string(), // New field for toxicity insights
      }),
      system: `You are an elite Industrial Psychologist specializing in the Dark Triad (Short Dark Triad SD3 model).
      Analyze the text for both positive performance markers and toxic derailers.
      Quantify Narcissism, Machiavellianism, and Psychopathy based on linguistic markers of entitlement, manipulation, and callousness.
      Provide a 'risk_warning' that evaluates potential for workplace toxicity.`,
      prompt: userInput,
    });

    return object;
  } catch (error) {
    console.error("AI Analysis failed:", error);
    throw new Error("Neural Engine failed to parse data.");
  }
}