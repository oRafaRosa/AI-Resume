# Relatório de testes — Fase 1

Data: 15/07/2026

| Verificação | Resultado |
|---|---|
| `npm run typecheck` | Aprovado |
| `npm run test` | Aprovado — 2 arquivos, 4 testes |
| `npm run build` | Aprovado — 36 módulos |
| `npm audit` | Aprovado — 0 vulnerabilidades |
| Busca de segredo/SDK em `src` e `dist` | Aprovado — nenhuma ocorrência |
| Landing 390 × 844 | Aprovado |
| Resultado 390 × 844 | Aprovado após correção de scroll |
| Landing 1440 × 1000 | Aprovado |
| Scroll horizontal mobile/desktop | Ausente |
| Overlay/erros de página | Ausentes |
| Criativos 1080 × 1920 | Aprovados — 3 PNGs inspecionados |

Bundle final observado: CSS ~21,4 kB (5,5 kB gzip) e JavaScript ~219,9 kB (68,5 kB gzip).

## Limite do relatório

O endpoint Gemini não foi exercitado com chave real para evitar consumo e exposição. O fallback determinístico e o contrato do servidor foram compilados e testados. O projeto ainda não está aprovado para lançamento comercial multiusuário; consulte `KNOWN_ISSUES.md`.
