import { Brand } from '../components/Brand';

type AdCreativeProps = { variant: 1 | 2 | 3 };

export function AdCreative({ variant }: AdCreativeProps) {
  if (variant === 1) {
    return <main className="ad ad--one"><div className="ad__safe"><Brand /><p className="ad__tag">CANDIDATURA ORIENTADA À VAGA</p><h1>Um currículo não deveria servir para <em>toda vaga.</em></h1><div className="ad-demo"><div><span>VAGA</span><strong>Product Manager</strong></div><b>→</b><div><span>PLANO</span><strong>Evidências + lacunas</strong></div></div><p className="ad__lead">Cole a vaga. Entenda a aderência. Ajuste com fatos.</p><div className="ad__cta">Analisar uma vaga <span>→</span></div><small className="ad__legal">Score informativo; não garante entrevista ou contratação.</small></div></main>;
  }
  if (variant === 2) {
    return <main className="ad ad--two"><div className="ad__safe"><Brand /><p className="ad__tag">IA COM CONTROLE HUMANO</p><h1>A IA sugere.<br /><em>Você decide.</em></h1><div className="ad-diff"><div><span>ANTES</span><p>“Apoio em projetos e relatórios para diferentes áreas.”</p></div><div><span>DEPOIS</span><p>O mesmo conteúdo, priorizado conforme as evidências da vaga.</p></div><footer><i>✓</i><strong>Aprovar</strong><i>✎</i><strong>Editar</strong><i>×</i><strong>Rejeitar</strong></footer></div><p className="ad__lead">Melhor escrita. Os mesmos fatos.</p><div className="ad__cta">Otimizar meu currículo <span>→</span></div><small className="ad__legal">Exemplo ilustrativo. Nenhuma informação é adicionada sem confirmação.</small></div></main>;
  }
  return <main className="ad ad--three"><div className="ad__safe"><Brand /><p className="ad__tag">SIMPLES, CLARO, EXPLICÁVEL</p><h1>Perfil + vaga =<br /><em>próximos passos.</em></h1><div className="ad-flow"><article><span>01</span><strong>Conte seu perfil</strong><small>Somente fatos reais</small></article><article><span>02</span><strong>Cole a vaga</strong><small>Requisitos em contexto</small></article><article><span>03</span><strong>Veja a aderência</strong><small>Score com evidências</small></article></div><p className="ad__lead">Uma candidatura mais clara começa por entender a oportunidade.</p><div className="ad__cta">Começar análise <span>→</span></div><small className="ad__legal">Prévia gratuita · Sem cartão · Resultado de seleção não garantido.</small></div></main>;
}
