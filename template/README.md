# 🚀 Landing Page Template – React + Vite + Tailwind + ShadCN

Este projeto é um **template base** para criação de Landing Pages, com conteúdo totalmente gerenciado por um **único arquivo JSON (`landing.json`)** ou pelo **Admin (/admin)** no navegador.

---

## 📦 Requisitos

- [Node.js 18+](https://nodejs.org/) (necessário apenas **uma vez** por computador)
- npm (vem junto com o Node.js)
- Git / SVN (para publicação)

Verifique a instalação:

```bash
node -v
npm -v
```

---

## 🛠️ Criar um novo projeto

```bash
npx create-berall-landing@latest meu-projeto
cd meu-projeto
npm install   # só se não rodar automático
npm run dev   # inicia o servidor local
```

👉 Isso cria a pasta do projeto, instala dependências e abre a landing local em:
- `http://localhost:5173/` → Landing
- `http://localhost:5173/admin` → Painel Admin

---

## 🎨 Editar Conteúdo

Todo o conteúdo está em **`src/landing.json`**.  
No Admin é possível editar e exportar um novo JSON.

### O que pode ser configurado:
- **Configuração**: nome do projeto (usado no `base` de publicação), animação global, parallax.
- **Cores**: cor principal, fundo claro, fundo escuro.
- **Hero**: imagem de fundo, logo, subtítulo, data, hora, local.
- **Participantes**: lista de pessoas com nome, título e foto.
- **Agenda**: programação por horário, painel, palestrantes, mediador.
- **Patrocinadores**: organizados por chancela (cada bloco numa linha).

👉 Após editar no Admin, clique em **Exportar JSON** e substitua `src/landing.json`.

---

## 🔄 Pré-visualizar

Rode novamente:

```bash
npm run dev
```

Abra o navegador em `http://localhost:5173/`.

### ❌ Encerrar o modo dev
Para parar o servidor:
- **Windows/Linux**: pressione `Ctrl+C` no terminal
- **Mac**: pressione `⌘+C`

---

## 🏗️ Gerar versão final (Build)

Quando estiver tudo pronto:

```bash
npm run build
```

👉 Isso cria a pasta `dist/` com os arquivos finais para publicação.

---

## ⬆️ Publicar

1. Copie o conteúdo da pasta `dist/`.
2. Cole na pasta correspondente do projeto no **SVN**.
3. Commit e deploy conforme o fluxo já conhecido da equipe.

---

## ✅ Resumo Rápido

- **Criar projeto**: `npx create-berall-landing@latest meu-projeto`
- **Rodar local**: `npm run dev`
- **Editar conteúdo**: via `http://localhost:5173/admin`
- **Exportar JSON**: substituir `src/landing.json`
- **Build**: `npm run build`
- **Publicar**: copiar `dist/` para o SVN

---

## 📂 Estrutura do Projeto

```
/public
  banner.jpg       # imagem de fundo do Hero
  logo.svg         # logo do projeto
/src
  components/      # componentes React (Hero, Header, etc.)
  landing.json     # arquivo único de conteúdo
  App.tsx
  index.css
```

---

## ✨ Tecnologias

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ShadCN/UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/) (animações)
