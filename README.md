# Eco Typing

Treine inglês digitando. Você digita um texto em inglês trecho a trecho; a cada
palavra concluída, uma voz fala a pronúncia em inglês e, ao terminar cada trecho,
você ouve a tradução em português.

## Objetivo

Associar **escrita + pronúncia + significado** num só fluxo: enquanto digita, seu
cérebro vai assimilando a pronúncia palavra por palavra, e no fim de cada trecho
escuta a tradução — sem que as vozes se sobreponham.

## Como funciona

- O texto é dividido em trechos com sua tradução (`[inglês, português]`).
- Ao digitar, cada **palavra** é falada em inglês (voz nativa, mais rápida).
- Ao concluir um **trecho**, a tradução em pt-BR é falada (voz separada).
- Sons de tecla e de erro acompanham a digitação.
- As vozes (nativa e de tradução) são selecionáveis entre as disponíveis no navegador.

## Tecnologias

- [Next.js](https://nextjs.org) + React + TypeScript
- Tailwind CSS + shadcn/ui
- Web Speech API (síntese de voz) e Web Audio API (sons)

## Rodando localmente

```bash
npm install
npm run dev