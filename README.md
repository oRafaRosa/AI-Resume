# AI Resume 2.0

Copiloto de candidaturas orientado à vaga. A Fase 1 compara um perfil mestre com uma descrição de vaga, explica a aderência por dimensão, aponta evidências e lacunas e permite aprovar sugestões factuais uma a uma.

> A análise é orientativa. O produto não garante entrevista, aprovação em ATS ou contratação.

## O que está implementado

- Landing mobile-first reposicionada para o produto SaaS.
- Perfil essencial e vaga em fluxo progressivo.
- Score determinístico com sete dimensões.
- Evidências, lacunas reais e lacunas de redação.
- Sugestões antes/depois com aprovação humana.
- Persistência local somente com consentimento.
- API serverless e abstração `AIProvider`; Gemini apenas no servidor.
- Três criativos Meta Ads 1080 × 1920.
- Agentes Codex de produto, IA, UX, segurança, QA e Meta Ads.

Autenticação, banco, pagamentos, importação, exportação, carta, entrevista e histórico remoto ainda não fazem parte desta fase. Consulte [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md).

## Desenvolvimento

Requisitos: Node.js 20+ e npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

O frontend funciona em modo demonstração sem chave. Para a função serverless usar Gemini, configure `GEMINI_API_KEY` somente no ambiente do servidor. Nunca use prefixo `VITE_` para esse segredo.

## Verificação

```bash
npm run check
```

O comando executa typecheck, testes unitários e build. A validação visual usa `agent-browser` e cobre 390 × 844 e desktop.

## Estrutura

- `src/` — frontend, domínio e fallback determinístico.
- `api/` — endpoint serverless.
- `server/` — provedor, prompt, schemas, factualidade e rate limit.
- `docs/` — briefing, agentes e marketing.
- `.codex/agents/` — agentes de projeto instalados.
- `public/marketing/meta-ads/` — três masters 9:16 e manifest.

## Segurança

Não use esta fase como release comercial multiusuário. Antes disso são obrigatórios autenticação, isolamento de dados, rate limit distribuído, política de retenção, exclusão/exportação e controles de cobrança no backend.
