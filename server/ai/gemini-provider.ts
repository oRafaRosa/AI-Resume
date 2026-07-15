import { GoogleGenAI } from '@google/genai';
import { buildAnalysisPrompt, PROMPT_VERSION } from './prompts';
import type { AIProvider, ProviderResult } from './provider';
import { ApplicationAnalysisSchema, type ApiRequest } from './schemas';

export class GeminiProvider implements AIProvider {
  constructor(private readonly apiKey: string, private readonly model = process.env.AI_MODEL || 'gemini-3.5-flash') {}

  async analyzeApplication(input: ApiRequest): Promise<ProviderResult> {
    const startedAt = Date.now();
    const client = new GoogleGenAI({ apiKey: this.apiKey });
    const response = await client.models.generateContent({
      model: this.model,
      contents: buildAnalysisPrompt(input),
      config: {
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          required: ['mode', 'overallScore', 'dimensions', 'evidences', 'matchedKeywords', 'missingKeywords', 'suggestions', 'disclaimer'],
        },
        temperature: 0.2,
      },
    });
    const parsed = ApplicationAnalysisSchema.parse(JSON.parse(response.text || '{}'));
    return { analysis: parsed, metadata: { model: this.model, promptVersion: PROMPT_VERSION, latencyMs: Date.now() - startedAt } };
  }
}
