# AI Resume 2.0 — briefing consolidado

Fonte organizada a partir de `AI_Resume_Product_Update_Briefing.docx` e `.pdf`, recebidos em 15/07/2026. Os binários originais não são versionados.

## Visão

Evoluir de gerador de currículo para copiloto de carreira orientado a uma oportunidade específica. A descrição da vaga vira um plano de candidatura: análise, aderência explicável, currículo factual, carta, preparação para entrevista e histórico.

**Promessa de produto:** ajudar o candidato a transformar uma vaga desejada em uma candidatura mais aderente, clara e preparada.

**Posicionamento:** “AI Resume: seu copiloto para transformar vagas em entrevistas.” A comunicação deve evitar garantias; o score é orientação e não promessa.

## Jornada principal

1. Criar conta ou iniciar demonstração.
2. Importar ou preencher perfil mestre.
3. Colar texto da vaga.
4. Estruturar requisitos e contexto.
5. Mostrar score geral e por dimensão, evidências e lacunas.
6. Gerar versão adaptada sem inventar fatos.
7. Aprovar/rejeitar cada sugestão.
8. Gerar carta e mensagens.
9. Preparar entrevista.
10. Salvar candidatura e histórico.

## Módulos

- Perfil mestre: experiências, projetos, formação, certificações, idiomas, competências e realizações.
- Analisador de vaga: cargo, senioridade, localização, modelo, idioma, requisitos, responsabilidades e palavras-chave.
- Score explicável: experiência, competências técnicas, palavras-chave, formação, idiomas, senioridade e domínio.
- Otimizador factual: reordenação e reescrita com antes/depois e aprovação humana.
- Carta contextualizada, mensagens curtas, entrevista STAR e plano de estudo.
- Central de candidaturas e versões por vaga.
- Internacionalização planejada para aproximadamente 12 idiomas.

## IA e arquitetura

- Abstrair provedores em `AIProvider`.
- Todas as chamadas de IA no backend/serverless.
- Validar saídas por schema e checar factualidade contra o perfil mestre.
- Versionar prompts; registrar modelo, latência e custo quando houver persistência segura.
- Aplicar fallback controlado e proteção contra prompt injection.
- Nunca armazenar currículo/vaga sem consentimento; nunca usar documentos para treinamento sem consentimento explícito.

## Monetização (hipóteses)

- Avulso: R$ 4,99 / US$ 3.99 / € 3.49.
- PRO: R$ 19,90 / US$ 9.99 / € 8.99.
- PREMIUM futuro: R$ 39,90 / US$ 19.99 / € 17.99.

Liberar prévia de aderência antes do paywall e cobrar pela análise completa, arquivos ou pacote. Preços e limites devem ser configuráveis e validados antes do lançamento.

## UX

- Fluxo progressivo, poucos campos por etapa e próximo passo claro.
- Score explicado em linguagem acessível.
- Estados de carregamento, autosave opt-in e recuperação.
- Mobile-first, acessível, com desktop forte para edição.
- Assinatura “Powered by R² Solutions Group”.

## Roadmap

Fase 0 auditoria; Fase 1 núcleo; Fase 2 currículo por vaga; Fase 3 materiais; Fase 4 entrevista; Fase 5 monetização; Fase 6 internacionalização; Fase 7 lançamento.

## Aceite do MVP completo

Perfil/importação, vaga estruturada, score com evidências, distinção de lacunas, otimização factual aprovável, exportação por vaga, carta, histórico, chaves no servidor, limites por plano, resiliência, mobile/desktop e analytics essenciais.
