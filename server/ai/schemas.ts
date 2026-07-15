import { z } from 'zod';

export const ProfileSchema = z.object({
  fullName: z.string().max(160),
  targetRole: z.string().min(2).max(160),
  location: z.string().max(160),
  summary: z.string().max(3000),
  experience: z.string().min(20).max(12000),
  education: z.string().max(3000),
  skills: z.string().max(3000),
  languages: z.string().max(1000),
});

export const JobSchema = z.object({
  title: z.string().min(2).max(200),
  company: z.string().max(200),
  description: z.string().min(80).max(12000),
});

const DimensionSchema = z.object({
  id: z.string(), label: z.string(), score: z.number().min(0).max(100), weight: z.number().min(0).max(100), explanation: z.string(),
});
const EvidenceSchema = z.object({
  id: z.string(), requirement: z.string(), status: z.enum(['match', 'writing_gap', 'gap']), profileEvidence: z.string().optional(), explanation: z.string(),
});
const SuggestionSchema = z.object({
  id: z.string(), section: z.enum(['summary', 'experience', 'skills']), title: z.string(), before: z.string(), after: z.string(), evidence: z.array(z.string()),
});

export const ApplicationAnalysisSchema = z.object({
  mode: z.enum(['ai', 'demo']),
  overallScore: z.number().min(0).max(100),
  dimensions: z.array(DimensionSchema).length(7),
  evidences: z.array(EvidenceSchema).max(12),
  matchedKeywords: z.array(z.string()).max(20),
  missingKeywords: z.array(z.string()).max(20),
  suggestions: z.array(SuggestionSchema).max(8),
  disclaimer: z.string(),
});

export const ApiRequestSchema = z.object({ action: z.literal('analyze'), profile: ProfileSchema, job: JobSchema });
export type ApiRequest = z.infer<typeof ApiRequestSchema>;
export type ParsedAnalysis = z.infer<typeof ApplicationAnalysisSchema>;
