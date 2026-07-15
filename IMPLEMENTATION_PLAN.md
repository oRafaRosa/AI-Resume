# Plano de implementação AI Resume 2.0

## Fase 0 — auditoria e fundação

- [x] Inventariar base, documentos e estado Git.
- [x] Registrar arquitetura, lacunas, riscos e decisões.
- [x] Instalar agentes Codex no escopo do projeto.
- [x] Remover chave de IA do cliente.

## Fase 1 — núcleo de candidatura (entrega atual)

- [x] Recriar landing como produto SaaS orientado à vaga.
- [x] Criar fluxo progressivo de perfil e descrição de vaga.
- [x] Implementar score explicável por dimensão.
- [x] Mapear correspondências, lacunas reais e lacunas de redação.
- [x] Criar sugestões antes/depois com aprovação individual.
- [x] Implementar `AIProvider`, prompt versionado e API serverless.
- [x] Adicionar fallback determinístico identificado como demonstração.
- [x] Otimizar navegação, alvos de toque e layout para 360–430 px.
- [x] Criar três variações mobile para Meta Ads.

## Fase 2 — currículo por vaga

- [ ] Importação PDF/DOCX segura e revisão assistida.
- [ ] Editor por blocos e diff por bullet.
- [ ] Templates ATS e premium.
- [ ] Exportação PDF server-side e versionamento.

## Fase 3 — materiais e histórico

- [ ] Carta e mensagens de candidatura.
- [ ] Central de candidaturas com status e arquivos.
- [ ] Autenticação, Postgres e políticas de acesso.

## Fases 4–7

- [ ] Entrevista e plano de estudo.
- [ ] Checkout, créditos, assinatura e limites no backend.
- [ ] Aproximadamente 12 idiomas com localização cultural.
- [ ] SEO, analytics consentido, experimentos e lançamento.

## Critérios de saída da Fase 1

- Build, typecheck e testes automatizados aprovados.
- Sem segredo ou SDK Gemini no bundle do navegador.
- Fluxo verificado em viewport mobile e desktop.
- Score com explicação, evidência e disclaimer.
- Sugestões não aplicadas sem aprovação humana.
