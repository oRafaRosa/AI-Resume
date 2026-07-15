import { Brand } from '../components/Brand';

type LandingPageProps = { onStart: () => void };

const steps = [
  ['01', 'Conte seu perfil', 'Registre fatos, experiências e competências que a IA pode usar.'],
  ['02', 'Cole a vaga', 'A descrição é transformada em requisitos e prioridades claras.'],
  ['03', 'Revise o plano', 'Veja score, evidências, lacunas e sugestões antes de aprovar qualquer mudança.'],
];

export function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="site-shell">
      <header className="topbar">
        <a href="#top" className="brand-link"><Brand compact /></a>
        <button className="button button--small button--ghost" onClick={onStart}>Entrar</button>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__copy">
            <p className="eyebrow"><span /> Candidatura orientada à vaga</p>
            <h1>Sua próxima candidatura começa pela <em>vaga.</em></h1>
            <p className="hero__lead">Compare seu perfil com os requisitos, entenda a aderência e melhore o currículo com fatos que você aprova.</p>
            <div className="hero__actions">
              <button className="button button--primary" onClick={onStart}>Analisar uma vaga <span aria-hidden="true">→</span></button>
              <a className="text-link" href="#como-funciona">Ver como funciona</a>
            </div>
            <ul className="trust-list" aria-label="Compromissos do produto">
              <li><span>✓</span> Prévia sem cartão</li>
              <li><span>✓</span> Sem inventar experiência</li>
              <li><span>✓</span> Você aprova cada ajuste</li>
            </ul>
          </div>

          <div className="hero-demo" aria-label="Demonstração de score explicável">
            <div className="hero-demo__header">
              <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
              <small>ANÁLISE DEMONSTRATIVA</small>
            </div>
            <div className="job-chip"><span>PM</span><div><strong>Product Manager</strong><small>Vaga de exemplo</small></div></div>
            <div className="score-card">
              <div className="score-ring"><strong>74</strong><small>/100</small></div>
              <div><small>ADERÊNCIA ORIENTATIVA</small><strong>Boa base, com lacunas claras</strong><p>O score mostra onde existe evidência — e onde confirmar informação.</p></div>
            </div>
            <div className="dimension-preview">
              <div><span>Experiência</span><b style={{ width: '82%' }} /></div>
              <div><span>Competências</span><b style={{ width: '68%' }} /></div>
              <div><span>Palavras-chave</span><b style={{ width: '61%' }} /></div>
            </div>
            <div className="evidence-preview"><span>✓</span><div><strong>Evidência encontrada</strong><small>“Liderei discovery e priorização...”</small></div></div>
            <p className="microcopy">Exemplo ilustrativo. O score não garante entrevista ou contratação.</p>
          </div>
        </section>

        <section className="statement">
          <p>UM CURRÍCULO GENÉRICO ESCONDE O QUE IMPORTA</p>
          <h2>A vaga mostra o que precisa ganhar destaque. Seu perfil prova o que é verdade.</h2>
        </section>

        <section className="how" id="como-funciona">
          <div className="section-heading">
            <p className="eyebrow"><span /> Como funciona</p>
            <h2>Da descrição da vaga a um plano claro.</h2>
          </div>
          <div className="step-grid">
            {steps.map(([number, title, description]) => (
              <article className="step-card" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="principle">
          <div><p className="eyebrow eyebrow--light"><span /> IA com controle humano</p><h2>Melhor escrita.<br />Os mesmos fatos.</h2></div>
          <div className="principle__content">
            <p>A IA pode reorganizar, esclarecer e aproximar a linguagem da vaga. Ela não pode fabricar competências, resultados ou experiências.</p>
            <ul><li>Evidence mapping em cada requisito</li><li>Lacuna real ≠ lacuna de redação</li><li>Comparação antes e depois</li><li>Aceite ou rejeição por sugestão</li></ul>
          </div>
        </section>

        <section className="pricing">
          <p className="eyebrow"><span /> Acesso inicial</p>
          <h2>Entenda o valor antes de decidir.</h2>
          <p>Comece com uma prévia gratuita. Planos e preços abaixo são hipóteses em validação — nenhuma cobrança ocorre nesta versão.</p>
          <div className="price-grid">
            <article><small>AVULSO</small><strong>R$ 4,99</strong><p>Uma candidatura otimizada</p></article>
            <article className="price-card--featured"><small>PRO</small><strong>R$ 19,90 <i>/mês</i></strong><p>Análises e versões recorrentes</p></article>
          </div>
        </section>

        <section className="final-cta">
          <Brand />
          <h2>Transforme uma vaga em próximos passos concretos.</h2>
          <button className="button button--light" onClick={onStart}>Começar análise <span>→</span></button>
          <p>Score orientativo. Nenhum resultado de seleção é garantido.</p>
        </section>
      </main>
      <footer className="footer"><Brand compact /><span>© 2026 R² Solutions Group</span><a href="mailto:privacy@r2solutions.group">Privacidade</a></footer>
    </div>
  );
}
