import { describe, expect, it } from 'vitest';
import { analyzeApplication, extractJobKeywords } from './scoring';
import type { JobPosting, Profile } from './application';

const profile: Profile = {
  fullName: 'Pessoa Exemplo',
  targetRole: 'Product Manager',
  location: 'São Paulo',
  summary: 'Profissional de produto com atuação em analytics.',
  experience: 'Liderei discovery de produto. Trabalhei com SQL e dashboards para priorização.',
  education: 'Administração',
  skills: 'Product discovery, SQL, Analytics',
  languages: 'Português, Inglês',
};

const job: JobPosting = {
  title: 'Product Manager',
  company: 'Empresa Exemplo',
  description: 'Buscamos Product Manager sênior com SQL, analytics, discovery e inglês. Experiência com Python é desejável.',
};

describe('scoring determinístico', () => {
  it('gera sete dimensões, evidências e disclaimer', () => {
    const result = analyzeApplication(profile, job);
    expect(result.dimensions).toHaveLength(7);
    expect(result.overallScore).toBeGreaterThan(0);
    expect(result.evidences.some((item) => item.status === 'match')).toBe(true);
    expect(result.disclaimer).toContain('não garante');
  });

  it('não cria evidência para competência ausente', () => {
    const result = analyzeApplication(profile, job);
    const python = result.evidences.find((item) => item.requirement === 'python');
    expect(python?.status).toBe('gap');
    expect(python?.profileEvidence).toBeUndefined();
  });

  it('extrai uma lista limitada e estável de palavras-chave', () => {
    const keywords = extractJobKeywords(job.description, job.title);
    expect(keywords.length).toBeLessThanOrEqual(12);
    expect(keywords).toContain('product');
  });
});
