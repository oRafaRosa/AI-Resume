import { normalize } from '../../src/domain/scoring';
import type { ApiRequest, ParsedAnalysis } from './schemas';

export function enforceFactuality(input: ApiRequest, result: ParsedAnalysis): ParsedAnalysis {
  const profileText = normalize(Object.values(input.profile).join(' '));
  const isSupported = (evidence: string) => evidence.trim().length > 0 && profileText.includes(normalize(evidence));

  return {
    ...result,
    evidences: result.evidences.map((item) => {
      if (!item.profileEvidence || isSupported(item.profileEvidence)) return item;
      return { ...item, status: 'gap' as const, profileEvidence: undefined, explanation: 'A evidência retornada não pôde ser validada no perfil.' };
    }),
    suggestions: result.suggestions.filter((suggestion) => suggestion.evidence.length > 0 && suggestion.evidence.every(isSupported)),
  };
}
