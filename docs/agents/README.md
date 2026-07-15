# Catálogo de agentes

Os documentos recebidos foram convertidos em agentes Codex executáveis em `.codex/agents/`. Cada TOML herda modelo e permissões da sessão principal, evitando configurações locais frágeis.

| Agente | Responsabilidade | Arquivo |
|---|---|---|
| Codex Implementation | Auditoria, implementação incremental e consolidação | `.codex/agents/codex-implementation.toml` |
| Product Strategy | Proposta de valor, funil e monetização | `.codex/agents/product-strategy.toml` |
| AI Architect | Provedores, prompts, schemas e factualidade | `.codex/agents/ai-architect.toml` |
| Frontend UX | Jornada, mobile, acessibilidade e conversão | `.codex/agents/frontend-ux.toml` |
| Gemini Review | Revisão de produto, conteúdo e lógica de IA | `.codex/agents/gemini-review.toml` |
| Security Privacy | Segurança, LGPD e abuso | `.codex/agents/security-privacy.toml` |
| QA Release | Testes, aceite e release | `.codex/agents/qa-release.toml` |
| Meta Ads Mobile | Criativos 9:16, copy, safe areas e testes | `.codex/agents/meta-ads-mobile.toml` |

O `AGENTS.md` da raiz concentra regras globais. Agentes de revisão devem, por padrão, trabalhar de forma somente-leitura e devolver achados ao agente principal.
