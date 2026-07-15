# Plano de testes — Fase 1

## Automatizados

- TypeScript estrito em frontend, API e servidor.
- Extração estável e limitada de palavras-chave.
- Sete dimensões de score e disclaimer obrigatório.
- Competência ausente não pode receber evidência.
- Build de produção sem SDK/segredo no frontend.

## Navegador

- Landing em 390 × 844 e 1440 × 1000.
- Primeiro fluxo: perfil → vaga → resultado.
- Fallback quando `/api/ai` não está disponível.
- Sem erro de console/overlay nem scroll horizontal.
- Posição de rolagem resetada ao mudar de etapa.
- CTA inferior e safe area mobile.

## Segurança

- Busca por `GEMINI_API_KEY`, `GoogleGenAI` e `process.env` em `src/` e `dist/`.
- Entrada acima do limite e schema inválido na API.
- Evidência não literal removida pelo pós-validador.
- Rate limit básico por IP.
- `npm audit` de produção e completo.

## Pendentes para release comercial

- E2E em deploy com função e chave reais.
- Auth, isolamento de usuários, persistência e exclusão.
- Rate limit distribuído e proteção contra abuso/custos.
- Testes de carga, pagamentos, webhooks e uploads.
