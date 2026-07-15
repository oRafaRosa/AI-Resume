import { describe, expect, it } from 'vitest';
import { enforceFactuality } from './factuality';
import type { ApiRequest, ParsedAnalysis } from './schemas';

const input: ApiRequest = {
  action: 'analyze',
  profile: {
    fullName: 'Pessoa Exemplo', targetRole: 'Analista', location: '', summary: '',
    experience: 'Criei dashboards em SQL para apoiar decisões.', education: '', skills: 'SQL', languages: 'Português',
  },
  job: { title: 'Analista', company: '', description: 'Vaga para analista com SQL, Python, dashboards e comunicação com áreas de negócio.' },
};

const baseResult: ParsedAnalysis = {
  mode: 'ai', overallScore: 50, matchedKeywords: ['sql'], missingKeywords: ['python'],
  disclaimer: 'Esta análise não garante entrevista.',
  dimensions: [
    ['experience', 'Experiência', 50, 25], ['skills', 'Competências', 50, 20],
    ['keywords', 'Palavras-chave', 50, 20], ['education', 'Formação', 50, 10],
    ['languages', 'Idiomas', 50, 5], ['seniority', 'Senioridade', 50, 10],
    ['domain', 'Contexto', 50, 10],
  ].map(([id, label, score, weight]) => ({ id: String(id), label: String(label), score: Number(score), weight: Number(weight), explanation: 'Teste' })),
  evidences: [], suggestions: [],
};

describe('enforceFactuality', () => {
  it('remove citação e sugestão que não existem literalmente no perfil', () => {
    const result = enforceFactuality(input, {
      ...baseResult,
      evidences: [{ id: '1', requirement: 'python', status: 'match', profileEvidence: 'Desenvolveu APIs em Python', explanation: 'Encontrado' }],
      suggestions: [{ id: 's1', section: 'experience', title: 'Inventada', before: '', after: 'Desenvolveu APIs em Python', evidence: ['Desenvolveu APIs em Python'] }],
    });
    expect(result.evidences[0]).toMatchObject({ status: 'gap', profileEvidence: undefined });
    expect(result.suggestions).toHaveLength(0);
  });
});
