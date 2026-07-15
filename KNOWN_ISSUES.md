# Problemas e pendências conhecidas

1. Sem autenticação, banco ou isolamento multiusuário.
2. Rate limit em memória é apenas defesa básica e não coordena múltiplas instâncias.
3. Persistência local é voluntária, sem criptografia do dispositivo.
4. O servidor não registra custo/latência de forma persistente; apenas calcula metadados em memória.
5. O fallback determinístico usa heurística lexical e precisa de calibração com avaliações humanas.
6. Importação, exportação PDF, versões, carta, entrevista e pagamentos não estão implementados.
7. Interface está apenas em PT-BR nesta fase; a estrutura de i18n será adicionada depois.
8. A API Gemini precisa ser validada em ambiente de preview com credencial server-side e limites de custo.
9. Criativos são estáticos; recomenda-se derivar vídeo com áudio/legendas depois do primeiro teste.
