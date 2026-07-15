# Changelog

## [Unreleased] — AI Resume 2.0 Fase 1

### Adicionado

- Landing de conversão mobile-first alinhada ao novo posicionamento.
- Jornada perfil → vaga → score → sugestões.
- Score explicável em sete dimensões, evidence mapping e distinção de lacunas.
- Motor determinístico para preview/fallback sem consumo de IA.
- API serverless, contrato `AIProvider`, Gemini server-side, prompt v1 e schemas Zod.
- Validação de citações de evidência e rate limit básico na função.
- Consentimento explícito para armazenamento local.
- Três criativos Meta Ads 9:16 e plano de experimentação.
- Oito agentes Codex de projeto, incluindo Meta Ads mobile.
- Testes unitários, typecheck e comando agregado `npm run check`.

### Alterado

- Produto reposicionado de portfólio pessoal/gerador de PDF para copiloto de candidatura.
- Aplicação monolítica substituída por módulos React, domínio e serviços.
- CSS via CDN e import map removidos; estilos locais e responsivos.
- README, plano, decisões e documentos de auditoria reescritos.

### Segurança

- Removida a injeção de `GEMINI_API_KEY` pelo Vite.
- Removidos SDK e armazenamento de chave do navegador.
- Dependências atualizadas até `npm audit` reportar zero vulnerabilidades.

### Corrigido

- Build quebrado por declarações e JSX duplicados.
- Marcadores de conflito no README.
- Editor fixo em duas colunas e preview A4 inviável no mobile.
- Posição de rolagem preservada incorretamente ao avançar etapas.
