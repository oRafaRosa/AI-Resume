import type {
  ApplicationAnalysis,
  JobPosting,
  MatchEvidence,
  OptimizationSuggestion,
  Profile,
  ScoreDimension,
} from './application';

const STOP_WORDS = new Set([
  'para', 'com', 'uma', 'que', 'dos', 'das', 'por', 'the', 'and', 'for', 'you', 'your',
  'nos', 'nas', 'ser', 'ter', 'como', 'mais', 'sua', 'seu', 'vaga', 'cargo', 'empresa',
  'trabalho', 'experiencia', 'conhecimento', 'responsabilidades', 'requisitos', 'desejavel',
  'anos', 'ano', 'atuar', 'area', 'time', 'equipe', 'buscamos', 'pessoa', 'profissional',
]);

export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokens(value: string): string[] {
  return normalize(value)
    .split(/[\s,;/|()]+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));
}

function percentage(matches: number, total: number, neutral = 65): number {
  if (total === 0) return neutral;
  return Math.round((matches / total) * 100);
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function extractJobKeywords(description: string, title = ''): string[] {
  const frequency = new Map<string, number>();
  for (const word of tokens(`${title} ${title} ${description}`)) {
    frequency.set(word, (frequency.get(word) ?? 0) + 1);
  }

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([word]) => word)
    .slice(0, 12);
}

function evidenceExcerpt(profile: Profile, keyword: string): string | undefined {
  const fields = [profile.skills, profile.experience, profile.summary, profile.education, profile.languages];
  const source = fields.find((field) => normalize(field).includes(keyword));
  if (!source) return undefined;

  const sentence = source
    .split(/(?<=[.!?\n])\s+/)
    .find((part) => normalize(part).includes(keyword));
  return (sentence ?? source).trim().slice(0, 180);
}

function reorderExistingSentences(source: string, keywords: string[]): string {
  const sentences = source
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  if (sentences.length < 2) return source.trim();

  return [...sentences]
    .sort((a, b) => {
      const score = (sentence: string) => keywords.filter((keyword) => normalize(sentence).includes(keyword)).length;
      return score(b) - score(a);
    })
    .join(' ');
}

function buildSuggestions(profile: Profile, job: JobPosting, matched: string[]): OptimizationSuggestion[] {
  const suggestions: OptimizationSuggestion[] = [];
  const supported = matched.slice(0, 4);

  if (supported.length > 0) {
    const evidence = supported
      .map((keyword) => evidenceExcerpt(profile, keyword))
      .filter((value): value is string => Boolean(value));
    const currentSummary = profile.summary.trim();
    const factualLead = `Objetivo: ${job.title || profile.targetRole}. Evidências relevantes no perfil: ${supported.join(', ')}.`;
    const after = currentSummary ? `${factualLead} ${currentSummary}` : factualLead;
    suggestions.push({
      id: 'summary-focus',
      section: 'summary',
      title: 'Conectar o resumo à vaga',
      before: currentSummary || 'Resumo ainda não preenchido.',
      after,
      evidence,
    });
  }

  const reorderedExperience = reorderExistingSentences(profile.experience, supported);
  if (reorderedExperience && reorderedExperience !== profile.experience.trim()) {
    suggestions.push({
      id: 'experience-order',
      section: 'experience',
      title: 'Trazer as evidências relevantes para o início',
      before: profile.experience.trim(),
      after: reorderedExperience,
      evidence: supported
        .map((keyword) => evidenceExcerpt(profile, keyword))
        .filter((value): value is string => Boolean(value)),
    });
  }

  const skillList = profile.skills.split(/[,;\n]+/).map((skill) => skill.trim()).filter(Boolean);
  const reorderedSkills = [...skillList].sort((a, b) => {
    const aMatch = supported.some((keyword) => normalize(a).includes(keyword)) ? 1 : 0;
    const bMatch = supported.some((keyword) => normalize(b).includes(keyword)) ? 1 : 0;
    return bMatch - aMatch;
  });
  if (reorderedSkills.join(', ') !== skillList.join(', ') && reorderedSkills.length > 1) {
    suggestions.push({
      id: 'skills-order',
      section: 'skills',
      title: 'Priorizar competências já comprovadas',
      before: skillList.join(', '),
      after: reorderedSkills.join(', '),
      evidence: supported,
    });
  }

  return suggestions;
}

export function analyzeApplication(profile: Profile, job: JobPosting): ApplicationAnalysis {
  const keywords = extractJobKeywords(job.description, job.title);
  const profileText = normalize(Object.values(profile).join(' '));
  const skillsText = normalize(profile.skills);
  const experienceText = normalize(profile.experience);
  const educationText = normalize(profile.education);
  const languageText = normalize(profile.languages);

  const matched = keywords.filter((keyword) => profileText.includes(keyword));
  const missing = keywords.filter((keyword) => !profileText.includes(keyword));
  const declaredSkillMatches = keywords.filter((keyword) => skillsText.includes(keyword));
  const experienceMatches = keywords.filter((keyword) => experienceText.includes(keyword));

  const seniorityTerms = ['junior', 'pleno', 'senior', 'especialista', 'lead', 'lider', 'manager', 'gerente'];
  const requestedSeniority = seniorityTerms.filter((term) => normalize(`${job.title} ${job.description}`).includes(term));
  const profileSeniority = requestedSeniority.filter((term) => profileText.includes(term));
  const educationRequired = ['graduacao', 'bacharel', 'superior', 'degree', 'formacao'].some((term) => normalize(job.description).includes(term));
  const languageTerms = ['ingles', 'english', 'espanhol', 'spanish', 'frances', 'french', 'alemao', 'german'];
  const requiredLanguages = languageTerms.filter((term) => normalize(job.description).includes(term));
  const languageMatches = requiredLanguages.filter((term) => languageText.includes(term) || profileText.includes(term));

  const dimensions: ScoreDimension[] = [
    {
      id: 'experience', label: 'Experiência', weight: 25,
      score: clamp(percentage(experienceMatches.length, Math.min(keywords.length, 8), 40)),
      explanation: experienceMatches.length ? `${experienceMatches.length} evidência(s) da vaga aparecem na experiência.` : 'A experiência ainda não evidencia os termos centrais da vaga.',
    },
    {
      id: 'skills', label: 'Competências', weight: 20,
      score: clamp(percentage(declaredSkillMatches.length, Math.min(keywords.length, 8), 40)),
      explanation: `${declaredSkillMatches.length} competência(s) relevante(s) foram declaradas no perfil.`,
    },
    {
      id: 'keywords', label: 'Palavras-chave', weight: 20,
      score: clamp(percentage(matched.length, keywords.length, 50)),
      explanation: `${matched.length} de ${keywords.length || 0} termos prioritários têm evidência no perfil.`,
    },
    {
      id: 'education', label: 'Formação', weight: 10,
      score: educationRequired ? (educationText ? 80 : 25) : 70,
      explanation: educationRequired ? (educationText ? 'Há formação informada para revisão do requisito.' : 'A vaga parece citar formação, mas o perfil não informa esse dado.') : 'Nenhum requisito claro de formação foi detectado.',
    },
    {
      id: 'languages', label: 'Idiomas', weight: 5,
      score: clamp(percentage(languageMatches.length, requiredLanguages.length, 70)),
      explanation: requiredLanguages.length ? `${languageMatches.length} de ${requiredLanguages.length} idioma(s) pedido(s) aparecem no perfil.` : 'Nenhum idioma obrigatório foi detectado.',
    },
    {
      id: 'seniority', label: 'Senioridade', weight: 10,
      score: clamp(percentage(profileSeniority.length, requestedSeniority.length, 70)),
      explanation: requestedSeniority.length ? (profileSeniority.length ? 'A senioridade solicitada aparece no perfil.' : 'A senioridade da vaga precisa ser validada no perfil.') : 'A vaga não explicita senioridade com clareza.',
    },
    {
      id: 'domain', label: 'Contexto de negócio', weight: 10,
      score: clamp(40 + percentage(matched.length, keywords.length, 50) * 0.6),
      explanation: matched.length ? 'O perfil compartilha vocabulário com o contexto da vaga.' : 'Faltam evidências do contexto de negócio no texto informado.',
    },
  ];

  const overallScore = Math.round(dimensions.reduce((total, dimension) => total + dimension.score * dimension.weight, 0) / 100);

  const evidences: MatchEvidence[] = keywords.slice(0, 8).map((keyword, index) => {
    const excerpt = evidenceExcerpt(profile, keyword);
    const inSkills = skillsText.includes(keyword);
    const status = inSkills ? 'match' : excerpt ? 'writing_gap' : 'gap';
    return {
      id: `evidence-${index + 1}`,
      requirement: keyword,
      status,
      profileEvidence: excerpt,
      explanation: status === 'match'
        ? 'Competência declarada no perfil.'
        : status === 'writing_gap'
          ? 'Há indício no perfil, mas ele pode ganhar mais destaque.'
          : 'Nenhuma evidência foi encontrada; confirme antes de adicionar.',
    };
  });

  return {
    mode: 'demo',
    overallScore,
    dimensions,
    evidences,
    matchedKeywords: matched,
    missingKeywords: missing,
    suggestions: buildSuggestions(profile, job, matched),
    disclaimer: 'Esta análise é orientativa e não garante entrevista, aprovação em ATS ou contratação.',
  };
}
