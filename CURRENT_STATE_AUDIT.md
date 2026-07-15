# Auditoria do estado atual

Data: 15 de julho de 2026

## Resumo executivo

A base é um protótipo React 19 + TypeScript + Vite, concentrado em um único `index.tsx`. Há fluxos de landing, dashboard, editor, planos e configurações, além de persistência local. A implementação recebida não compila e expõe a integração Gemini no cliente. O posicionamento também foi desviado para portfólio pessoal, contrariando o briefing 2.0 do produto SaaS.

## Inventário

- Frontend: React 19, Vite 6, TypeScript 5.8.
- Estilo: Tailwind via CDN e classes no JSX.
- IA: `@google/genai` importado no navegador.
- Dados: `localStorage`, sem consentimento granular.
- Backend, autenticação, banco, testes e lint: inexistentes.
- Internacionalização: oito traduções embutidas e incompletas.
- Git: `main` local continha um commit ainda não enviado e uma modificação não commitada em `index.tsx`.

## Bloqueadores encontrados

1. `npm run build` falhava por símbolos duplicados e JSX inválido.
2. `README.md` continha marcadores de conflito.
3. `vite.config.ts` injetava `GEMINI_API_KEY` no bundle; a alteração local armazenava chave no navegador.
4. O editor usava duas colunas fixas, A4 de 210 mm e `overflow-hidden`, inviável em mobile.
5. Score e reescrita não tinham schemas, evidências, proteção de factualidade ou aprovação por sugestão.
6. Planos simulavam compra sem backend e poderiam ser confundidos com cobrança real.

## Elementos preserváveis

- React/Vite como base incremental.
- Intenção de perfil, vaga, score, otimização e planos.
- Assinatura “Powered by R² Solutions Group”.
- Persistência local, agora condicionada a consentimento.
- Paleta tecnológica azul/ciano, refinada para maior contraste.

## Decisão de recuperação

O frontend será modularizado sem migrar de framework. A Fase 1 substitui o arquivo monolítico quebrado por uma jornada mobile-first e introduz API serverless, contrato `AIProvider`, schemas e fallback determinístico demonstrável. As fases de autenticação, banco, pagamento, importação e exportação ficam explicitamente marcadas como não implementadas.
