# Registro de decisões

## D-001 — preservar React/Vite

**Decisão:** manter React 19 + Vite e evoluir incrementalmente.
**Motivo:** o briefing proíbe reconstrução antes da auditoria; uma migração de framework não é necessária para a Fase 1.

## D-002 — chave e provedor somente no servidor

**Decisão:** remover toda configuração Gemini do cliente e criar `AIProvider` server-side.
**Consequência:** Vite local usa fallback determinístico quando `/api/ai` não existe; deploy em Vercel executa a função da raiz `api/`.

## D-003 — prévia antes do paywall

**Decisão:** seguir o briefing 2.0 e permitir uma prévia orientativa, substituindo a regra legada de bloqueio total.
**Limite:** monetização não é simulada como cobrança real; preços aparecem como hipóteses.

## D-004 — score híbrido e explicável

**Decisão:** usar regras determinísticas no preview e IA estruturada no servidor quando disponível.
**Motivo:** cálculo determinístico melhora transparência, disponibilidade e custo; a IA adiciona interpretação, nunca autoridade factual.

## D-005 — persistência opt-in

**Decisão:** nenhum dado é gravado localmente sem o checkbox de consentimento.
**Pendência:** persistência remota exige autenticação, autorização, retenção e exclusão antes do lançamento comercial.

## D-006 — mobile como superfície principal

**Decisão:** fluxo em coluna única, inputs de 16 px, alvos de 44+ px, CTA inferior com safe area e preview/resultados responsivos.
**Motivo:** aproximadamente 95% do tráfego informado é mobile.

## D-007 — anúncios estáticos 9:16 nesta fase

**Decisão:** entregar três PNGs 1080 × 1920 com fontes regeneráveis em React.
**Motivo:** permite teste rápido no Meta Ads sem anunciar carta/entrevista ainda indisponíveis. Vídeo e 4:5 ficam para iteração após dados.

## D-008 — agentes instalados no projeto

**Decisão:** converter os briefs em `.codex/agents/*.toml`, sem fixar modelo, para herdarem a sessão.
**Motivo:** é o formato atual de agentes Codex no escopo do projeto e evita configuração global do usuário.
