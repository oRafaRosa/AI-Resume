import type { ApiRequest, ParsedAnalysis } from './schemas';

export type GenerationMetadata = { model: string; promptVersion: string; latencyMs: number };
export type ProviderResult = { analysis: ParsedAnalysis; metadata: GenerationMetadata };

export interface AIProvider {
  analyzeApplication(input: ApiRequest): Promise<ProviderResult>;
}
