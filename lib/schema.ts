import { z } from "zod";

const score = z.coerce.number().min(0).max(100).transform((n) => Math.round(n));

export const AnalysisSchema = z.object({
  big5: z.object({
    openness: score,
    conscientiousness: score,
    extraversion: score,
    agreeableness: score,
    neuroticism: score,
  }),
  darkTriad: z.object({
    narcissism: score,
    machiavellianism: score,
    psychopathy: score,
  }),
  workplace: z.object({
    burnoutRisk: score,
    psychSafety: score,
    ownership: score,
  }),
  confidence: z.enum(["low", "medium", "high"]),
  evidence: z.array(z.string()).max(6),
  summary: z.string(),
  riskWarning: z.string(),
  brief: z.string(),
  actions: z.array(z.string()).min(1).max(4),
});

export type Analysis = z.infer<typeof AnalysisSchema>;

export type Audit = {
  id: string;
  name: string;
  createdAt: string;
  analysis: Analysis;
};

export type AuditEvent = {
  id: string;
  at: string;
  action: string;
  subject?: string;
};

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
