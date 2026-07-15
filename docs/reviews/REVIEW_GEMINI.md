# Revisão de produto, UX e IA — Fase 1

## Pontos fortes

- Proposta comunica vaga → aderência → próximos passos, sem se confundir com portfólio pessoal.
- Score possui sete dimensões, evidências e disclaimer.
- Sugestões mostram antes/depois e exigem aprovação humana.
- Jornada mobile usa uma coluna, targets adequados e CTA com safe area.
- Fallback determinístico mantém a demonstração disponível sem chave ou custo de modelo.

## Bloqueadores para lançamento comercial

- Ausência de autenticação, isolamento, banco, retenção e exclusão.
- Rate limit apenas em memória.
- Faltam avaliações do provedor real com perfis anonimizados e casos adversariais.
- Monetização e preços ainda são hipóteses; nenhuma cobrança deve ser comunicada como ativa.

## Melhorias de alto impacto

1. Importação por texto e depois PDF/DOCX com revisão antes de salvar.
2. Calibração do score por avaliações humanas e versionamento de pesos.
3. Editor por bullet com diff, evidência e histórico por vaga.
4. Auth e repositórios antes de carta, entrevista ou pagamento.
5. Analytics consentido para `analysis_started`, `score_preview_viewed` e conclusão.

## Inconsistências factuais removidas

- Claims “Top 1%”, “300% mais chances” e qualquer garantia de entrevista.
- Narrativa de portfólio/consultoria pessoal na landing.
- Compra e plano PRO simulados como se fossem reais.

## Testes recomendados

- Prompt injection, evidência parcialmente citada e JSON incompleto.
- Perfil sem resumo, sem skills e com experiência longa.
- Vagas em idiomas diferentes e requisitos ambíguos.
- Teclado móvel, rotação e dispositivos com safe area.
