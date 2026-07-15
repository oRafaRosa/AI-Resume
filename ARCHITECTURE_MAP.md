# Mapa de arquitetura

```text
Navegador (React/Vite)
├── Landing de conversão
├── Workspace mobile-first
│   ├── Perfil mestre
│   ├── Vaga
│   ├── Score explicável
│   └── Sugestões com aprovação humana
├── Motor determinístico local (preview/fallback, sem IA)
└── POST /api/ai
    ├── validação Zod e limites de entrada
    ├── orquestrador de candidatura
    ├── contrato AIProvider
    ├── GeminiProvider (servidor)
    ├── prompts versionados
    └── validação de evidências/factualidade
```

## Limites de confiança

- Cliente: não confiável; nunca recebe chave de provedor.
- API: valida método, tamanho, schema e ação.
- Currículo e vaga: conteúdo não confiável, delimitado nos prompts.
- Provedor: saída não confiável, validada por schema e por evidência.
- Persistência: nesta fase, somente local e opt-in. Persistência multiusuário exige autenticação e banco em fase posterior.

## Fluxo de análise

1. Usuário informa perfil e vaga.
2. Frontend chama `/api/ai` quando disponível.
3. API valida entrada e usa provedor configurado.
4. Saída estruturada é validada e toda evidência é conferida contra o perfil.
5. Se a API não estiver disponível no ambiente local, um algoritmo determinístico gera uma prévia identificada como “modo demonstração”.
6. O usuário revisa e aceita/rejeita cada sugestão; nada substitui o perfil automaticamente.

## Próxima arquitetura

Autenticação, Postgres, storage, rate limiting distribuído, créditos, pagamentos, auditoria persistente e exclusão de dados serão adicionados antes de um lançamento comercial.
