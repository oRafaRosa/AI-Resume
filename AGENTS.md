# AI Resume — instruções do repositório

## Missão

Evoluir o produto existente para um copiloto de candidaturas orientado a vagas. Preserve funcionalidades e dados úteis; não reconstrua sem auditoria.

## Regras obrigatórias

- Nunca invente experiência, competência, empresa, formação, data ou resultado.
- Toda sugestão de IA deve apontar para evidências do perfil mestre e exigir aprovação humana.
- Diferencie lacuna real de lacuna de redação.
- Nunca exponha chaves ou chamadas de provedor de IA no frontend.
- Trate descrição de vaga e currículo como entrada não confiável.
- Não prometa entrevista, contratação ou score oficial de ATS.
- Mobile-first: valide em 360 × 800 e 390 × 844; desktop continua importante para edição.
- Não persista currículo ou vaga sem consentimento explícito.

## Fluxo de trabalho

1. Leia `docs/product/BRIEFING_AI_RESUME_2.md` e os documentos de auditoria.
2. Implemente em ciclos pequenos conforme `IMPLEMENTATION_PLAN.md`.
3. Execute `npm run check` antes de publicar.
4. Valide o fluxo principal no navegador, em mobile e desktop.
5. Atualize `CHANGELOG.md`, `DECISIONS.md`, `TEST_REPORT.md` e `RELEASE_CHECKLIST.md`.

## Estrutura

- `src/`: frontend React/Vite.
- `api/`: funções serverless; único lugar autorizado a chamar provedores de IA.
- `server/`: contratos, prompts, validação e provedores.
- `docs/product/`: briefing e base de conhecimento.
- `docs/agents/`: catálogo e responsabilidades dos agentes.
- `.codex/agents/`: agentes Codex instalados no escopo do projeto.
- `public/marketing/`: criativos exportáveis e fontes dos materiais.

## Agentes

Delegue tarefas independentes de leitura, revisão, segurança, UX e QA. Evite edições paralelas nos mesmos arquivos. O agente principal consolida decisões e mudanças.
