import { useEffect, useState } from 'react';
import { Brand } from '../components/Brand';
import {
  EMPTY_JOB,
  EMPTY_PROFILE,
  type ApplicationAnalysis,
  type JobPosting,
  type OptimizationSuggestion,
  type Profile,
} from '../domain/application';
import { requestAnalysis } from '../services/ai';

type WorkspaceProps = { onHome: () => void };
type Step = 1 | 2 | 3 | 4;

const STORAGE_KEY = 'ai-resume-phase1';

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className="field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function SuggestionCard({ suggestion, accepted, onToggle }: { suggestion: OptimizationSuggestion; accepted: boolean; onToggle: () => void }) {
  return (
    <article className={`suggestion-card ${accepted ? 'is-accepted' : ''}`}>
      <div className="suggestion-card__header"><div><small>{suggestion.section}</small><h3>{suggestion.title}</h3></div><span>{accepted ? 'Aprovada' : 'Pendente'}</span></div>
      <div className="diff-grid"><div><small>ANTES</small><p>{suggestion.before}</p></div><div><small>DEPOIS</small><p>{suggestion.after}</p></div></div>
      <details><summary>Ver evidências usadas</summary><ul>{suggestion.evidence.map((item) => <li key={item}>{item}</li>)}</ul></details>
      <button className={`button ${accepted ? 'button--ghost' : 'button--primary'} button--full`} onClick={onToggle}>{accepted ? 'Desfazer aprovação' : 'Aprovar esta sugestão'}</button>
    </article>
  );
}

export function Workspace({ onHome }: WorkspaceProps) {
  const [step, setStep] = useState<Step>(1);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [job, setJob] = useState<JobPosting>(EMPTY_JOB);
  const [analysis, setAnalysis] = useState<ApplicationAnalysis | null>(null);
  const [accepted, setAccepted] = useState<string[]>([]);
  const [saveLocally, setSaveLocally] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { profile?: Profile; job?: JobPosting; consent?: boolean };
        if (parsed.consent) {
          setProfile(parsed.profile ?? EMPTY_PROFILE);
          setJob(parsed.job ?? EMPTY_JOB);
          setSaveLocally(true);
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!saveLocally) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, job, consent: true }));
  }, [hasHydrated, job, profile, saveLocally]);

  const updateProfile = (field: keyof Profile, value: string) => setProfile((current) => ({ ...current, [field]: value }));
  const updateJob = (field: keyof JobPosting, value: string) => setJob((current) => ({ ...current, [field]: value }));

  const runAnalysis = async () => {
    setLoading(true);
    const result = await requestAnalysis({ profile, job });
    setAnalysis(result);
    setAccepted([]);
    setStep(3);
    setLoading(false);
  };

  const canContinueProfile = profile.targetRole.trim().length >= 2 && profile.experience.trim().length >= 20;
  const canAnalyze = job.title.trim().length >= 2 && job.description.trim().length >= 80;

  return (
    <div className="workspace">
      <header className="workspace__header"><button className="brand-link" onClick={onHome}><Brand compact /></button><span className="privacy-chip">Dados locais por padrão</span></header>
      <div className="workspace__progress" aria-label={`Etapa ${step} de 4`}><span style={{ width: `${step * 25}%` }} /></div>
      <nav className="step-nav" aria-label="Etapas">
        {['Perfil', 'Vaga', 'Aderência', 'Sugestões'].map((label, index) => <button key={label} className={step === index + 1 ? 'is-active' : ''} disabled={index + 1 > step || (index + 1 > 2 && !analysis)} onClick={() => setStep((index + 1) as Step)}><span>{index + 1}</span>{label}</button>)}
      </nav>

      <main className="workspace__main">
        {step === 1 && (
          <section className="form-panel">
            <div className="form-heading"><p>ETAPA 1 DE 4</p><h1>Seu perfil mestre</h1><span>Informe apenas fatos que podem ser usados nas sugestões.</span></div>
            <div className="form-grid form-grid--two"><Field label="Nome completo"><input value={profile.fullName} onChange={(event) => updateProfile('fullName', event.target.value)} autoComplete="name" placeholder="Como aparece no currículo" /></Field><Field label="Cargo alvo"><input value={profile.targetRole} onChange={(event) => updateProfile('targetRole', event.target.value)} placeholder="Ex.: Product Manager" /></Field></div>
            <Field label="Localização"><input value={profile.location} onChange={(event) => updateProfile('location', event.target.value)} autoComplete="address-level2" placeholder="Cidade, país ou remoto" /></Field>
            <Field label="Resumo profissional" hint="Opcional. Não inclua informações que você não possa comprovar."><textarea value={profile.summary} onChange={(event) => updateProfile('summary', event.target.value)} rows={4} placeholder="Uma síntese factual da sua atuação..." /></Field>
            <Field label="Experiências e realizações" hint="Obrigatório · mínimo de 20 caracteres"><textarea value={profile.experience} onChange={(event) => updateProfile('experience', event.target.value)} rows={7} placeholder="Descreva contexto, ações, tecnologias e resultados reais..." /></Field>
            <Field label="Competências"><input value={profile.skills} onChange={(event) => updateProfile('skills', event.target.value)} placeholder="Separe por vírgulas" /></Field>
            <div className="form-grid form-grid--two"><Field label="Formação"><input value={profile.education} onChange={(event) => updateProfile('education', event.target.value)} placeholder="Curso e instituição" /></Field><Field label="Idiomas"><input value={profile.languages} onChange={(event) => updateProfile('languages', event.target.value)} placeholder="Português, Inglês..." /></Field></div>
            <label className="consent"><input type="checkbox" checked={saveLocally} onChange={(event) => setSaveLocally(event.target.checked)} /><span><strong>Salvar rascunho neste dispositivo</strong><small>Se desmarcado, seus dados são removidos do armazenamento local ao editar.</small></span></label>
            <div className="mobile-action"><button className="button button--primary button--full" disabled={!canContinueProfile} onClick={() => setStep(2)}>Continuar para a vaga →</button></div>
          </section>
        )}

        {step === 2 && (
          <section className="form-panel">
            <button className="back-link" onClick={() => setStep(1)}>← Voltar ao perfil</button>
            <div className="form-heading"><p>ETAPA 2 DE 4</p><h1>Qual vaga você quer analisar?</h1><span>Cole o texto da vaga. Links e uploads serão adicionados em uma próxima fase.</span></div>
            <div className="form-grid form-grid--two"><Field label="Cargo da vaga"><input value={job.title} onChange={(event) => updateJob('title', event.target.value)} placeholder="Ex.: Senior Product Manager" /></Field><Field label="Empresa"><input value={job.company} onChange={(event) => updateJob('company', event.target.value)} placeholder="Opcional" /></Field></div>
            <Field label="Descrição completa" hint={`${job.description.length} caracteres · mínimo de 80`}><textarea value={job.description} onChange={(event) => updateJob('description', event.target.value.slice(0, 12000))} rows={14} placeholder="Cole responsabilidades, requisitos obrigatórios e desejáveis..." /></Field>
            <aside className="safety-note"><span>!</span><p><strong>A vaga é tratada como conteúdo não confiável.</strong> Instruções escondidas no texto não substituem as regras de factualidade do produto.</p></aside>
            <div className="mobile-action"><button className="button button--primary button--full" disabled={!canAnalyze || loading} onClick={runAnalysis}>{loading ? 'Analisando requisitos…' : 'Analisar aderência →'}</button></div>
          </section>
        )}

        {step === 3 && analysis && (
          <section className="result-panel">
            <button className="back-link" onClick={() => setStep(2)}>← Ajustar vaga</button>
            <div className="result-hero"><div><p>{analysis.mode === 'ai' ? 'ANÁLISE COM IA' : 'MODO DEMONSTRAÇÃO · REGRAS DETERMINÍSTICAS'}</p><h1>Sua aderência está em <em>{analysis.overallScore}/100</em></h1><span>{job.title}{job.company ? ` · ${job.company}` : ''}</span></div><div className="result-ring" style={{ '--score': analysis.overallScore } as React.CSSProperties}><strong>{analysis.overallScore}</strong><small>/100</small></div></div>
            <p className="disclaimer">{analysis.disclaimer}</p>
            <h2 className="subheading">Score por dimensão</h2>
            <div className="dimension-grid">{analysis.dimensions.map((dimension) => <article key={dimension.id}><div><strong>{dimension.label}</strong><span>{dimension.score}</span></div><div className="bar"><i style={{ width: `${dimension.score}%` }} /></div><p>{dimension.explanation}</p></article>)}</div>
            <h2 className="subheading">Evidências e lacunas</h2>
            <div className="evidence-list">{analysis.evidences.map((item) => <article key={item.id} className={`evidence evidence--${item.status}`}><span>{item.status === 'match' ? '✓' : item.status === 'writing_gap' ? '↗' : '!'}</span><div><div><strong>{item.requirement}</strong><small>{item.status === 'match' ? 'Evidência' : item.status === 'writing_gap' ? 'Lacuna de redação' : 'Lacuna real'}</small></div><p>{item.explanation}</p>{item.profileEvidence && <blockquote>“{item.profileEvidence}”</blockquote>}</div></article>)}</div>
            <div className="mobile-action"><button className="button button--primary button--full" onClick={() => setStep(4)}>Revisar sugestões →</button></div>
          </section>
        )}

        {step === 4 && analysis && (
          <section className="result-panel">
            <button className="back-link" onClick={() => setStep(3)}>← Voltar à análise</button>
            <div className="form-heading"><p>ETAPA 4 DE 4</p><h1>Você mantém o controle</h1><span>Compare e aprove uma sugestão por vez. Nada altera o seu perfil automaticamente.</span></div>
            {analysis.suggestions.length ? <div className="suggestion-list">{analysis.suggestions.map((suggestion) => <SuggestionCard key={suggestion.id} suggestion={suggestion} accepted={accepted.includes(suggestion.id)} onToggle={() => setAccepted((items) => items.includes(suggestion.id) ? items.filter((id) => id !== suggestion.id) : [...items, suggestion.id])} />)}</div> : <div className="empty-state"><strong>Nenhuma reordenação segura foi encontrada.</strong><p>Complete o perfil com mais evidências reais e execute a análise novamente.</p></div>}
            <div className="completion-card"><span>✓</span><div><strong>{accepted.length} sugestão(ões) aprovada(s)</strong><p>Exportação e versionamento serão adicionados na Fase 2.</p></div></div>
          </section>
        )}
      </main>
    </div>
  );
}
