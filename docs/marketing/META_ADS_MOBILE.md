# Meta Ads mobile — pacote inicial

## Arquivos finais

- `public/marketing/meta-ads/01-vaga-plano-9x16.png`
- `public/marketing/meta-ads/02-controle-humano-9x16.png`
- `public/marketing/meta-ads/03-tres-passos-9x16.png`

Todos os masters são PNG 1080 × 1920 (9:16). Os textos e a composição ficam em `src/pages/AdCreative.tsx` e podem ser regenerados com `?creative=1`, `2` ou `3`.

## Variação 1 — vaga → plano

- Ângulo: dor de usar o mesmo currículo para oportunidades diferentes.
- Hook: “Um currículo não deveria servir para toda vaga.”
- Copy principal: “Cole a vaga, compare os requisitos com o seu perfil e veja evidências e lacunas antes de ajustar o currículo.”
- Headline: “Transforme a vaga em um plano de candidatura.”
- CTA: `Começar agora` / “Analisar uma vaga”.
- Hipótese: o mecanismo visual aumenta `analysis_started / landing_view` em tráfego frio.

## Variação 2 — controle e factualidade

- Ângulo: confiança em IA e aprovação humana.
- Hook: “A IA sugere. Você decide.”
- Copy principal: “Melhore a apresentação do que você realmente fez. Compare cada sugestão e mantenha o controle.”
- Headline: “Melhor escrita. Os mesmos fatos.”
- CTA: `Experimentar` / “Otimizar meu currículo”.
- Hipótese: factualidade explícita reduz objeção e melhora início de análise em público morno.

## Variação 3 — três passos

- Ângulo: simplicidade e clareza do fluxo.
- Hook: “Perfil + vaga = próximos passos.”
- Copy principal: “Conte seu perfil, cole a vaga e entenda a aderência com um score explicado por evidências.”
- Headline: “Uma candidatura mais clara começa pela oportunidade.”
- CTA: `Começar agora` / “Começar análise”.
- Hipótese: uma jornada de três passos converte melhor em usuários com baixa familiaridade com IA.

## Produção e compliance

- Mensagem principal compreensível sem áudio.
- Conteúdo essencial dentro de uma área conservadora: 269 px livres no topo, 384 px livres na base e 86 px nas laterais.
- Zero promessa de entrevista, emprego, aprovação em ATS ou ganho percentual.
- Zero depoimento, volume de usuários ou métrica não comprovada.
- “Powered by R² Solutions Group” funciona como endosso discreto.
- O botão desenhado é parte do criativo; no Ads Manager, escolher o CTA nativo correspondente.
- Validar novamente no safe-zone checker do Ads Manager antes de veicular.

## Plano de teste

1. Manter público, landing, oferta, orçamento e CTA nativo constantes.
2. Variar somente o conceito criativo.
3. Usar `utm_content=vaga_plano_static_v1`, `controle_humano_static_v1` e `tres_passos_static_v1`.
4. KPI primário: `analysis_started / landing_view`; secundários: CTR, CPC e conclusão da etapa da vaga.
5. Não eleger vencedor por CTR isolado nem com amostra insuficiente.

## Referências oficiais consultadas

- Meta recomenda vertical 9:16 e elementos-chave em safe zone para Reels: https://www.facebook.com/business/ads/facebook-instagram-reels-ads
- Reels aceitam até 9:16, com mínimo de 720 px e 30 FPS para vídeo: https://www.facebook.com/help/1038071743007909
- Meta recomenda 4:5 no Feed e 9:16 em Stories/Reels: https://www.facebook.com/business/ads/automation/tailored-campaigns
