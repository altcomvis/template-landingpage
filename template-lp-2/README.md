# 🚀 Landing Page Template – React + Vite + Tailwind + ShadCN

Este projeto é um **template base** para criação de Landing Pages, com conteúdo gerenciado pelo **Painel Admin (/admin)** e entregue ao preview via **pacote ZIP do template**.

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
npx @editoraglobonegocios/create-template-landingpage
npm install   # só se não rodar automático
cd meu-projeto
npm run dev   # inicia o servidor local
```

👉 Isso cria a pasta do projeto, instala dependências e abre a landing local em:
- `http://localhost:5173/` → Landing
- `http://localhost:5173/admin` → Painel Admin

---

## 🎨 Editar Conteúdo

Todo o conteúdo é editado no **Admin**. O preview recebe os dados do painel (sem depender de buscar um JSON por URL).

### O que pode ser configurado:
- **Configuração**: nome do projeto (usado no `base` de publicação), animação global, parallax.
- **Cores**: cor principal, fundo claro, fundo escuro.
- **Hero**: imagem de fundo, logo, subtítulo, data, hora, local.
- **Participantes**: lista de pessoas com nome, título e foto.
- **Agenda**: programação por horário, painel, palestrantes, mediador.
- **Patrocinadores**: organizados por chancela (cada bloco numa linha).

👉 Após editar no Admin, use o fluxo de exportação/empacotamento do painel.

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
- **Exportar JSON**: usar no fluxo do painel
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
