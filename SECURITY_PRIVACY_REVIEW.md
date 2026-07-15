# Revisão de segurança e privacidade

## Corrigido nesta fase

| Severidade | Achado | Correção |
|---|---|---|
| Crítica | Chave Gemini injetada no bundle e/ou armazenada no navegador | Removida do Vite e do frontend; chamada apenas em `api/` |
| Alta | Saída de IA sem schema ou evidence mapping | Zod, prompt versionado e validação literal de evidências |
| Alta | Prompt injection por vaga concatenada | Delimitação como conteúdo não confiável e instruções invariáveis |
| Média | Dados persistidos sem escolha explícita | Persistência local opt-in e remoção ao desmarcar |
| Média | Dependências vulneráveis | Atualização compatível; `npm audit` zerado |
| Média | Ausência de rate limiting | Limite básico por IP e janela na função |

## Bloqueadores comerciais

- Auth/autorização, isolamento e storage seguro inexistentes.
- Rate limiting não distribuído.
- Política de retenção, exportação e exclusão ainda não operacional.
- Sem medição confiável de plano/créditos no backend.
- Sem auditoria persistente de gerações e versões de prompt.

## Conclusão

A arquitetura elimina o vazamento de chave do protótipo e é adequada para revisão da Fase 1. Não está aprovada para armazenar currículos de múltiplos usuários ou processar cobrança em produção.
