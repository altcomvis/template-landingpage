# Migração React Vite → Next.js App Router

## ✅ O que foi feito

### 1. **Backup**
- Criado backup completo: `template-backup-20251211_151509.tar.gz`

### 2. **Estrutura Next.js**
- Criada pasta `app/` com App Router
- Rotas criadas:
  - `app/(main)/page.tsx` - Landing page principal
  - `app/(admin)/admin/page.tsx` - Painel administrativo
  - `app/api/sfmc/route.ts` - API para Salesforce Marketing Cloud

### 3. **Componentes convertidos**
Todos os componentes foram convertidos para **Client Components** com `'use client'`:
- ✅ Todos os módulos (Hero, About, Subscribe, etc.)
- ✅ Formulários do admin
- ✅ Componentes de UI interativos
- ✅ Hooks customizados

### 4. **API SFMC**
Criada rota API em `app/api/sfmc/route.ts` que:
- Recebe dados do formulário via POST
- Autentica no Salesforce Marketing Cloud
- Envia dados para Data Extension configurada
- Retorna resposta de sucesso/erro

### 5. **Configurações**
- `next.config.ts` - Configuração do Next.js com basePath dinâmico
- `tsconfig.json` - Atualizado para Next.js
- `.env.example` - Template de variáveis de ambiente

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env.local` e preencha com suas credenciais SFMC:
```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais do Salesforce Marketing Cloud.

### 3. Executar em desenvolvimento
```bash
npm run dev
```

Acesse:
- Landing page: http://localhost:3000
- Admin: http://localhost:3000/admin

### 4. Build para produção
```bash
npm run build
npm start
```

## 📝 Mudanças importantes

### Navegação
- **Antes (Vite)**: `react-router-dom` com `<Link>` e `<BrowserRouter>`
- **Agora (Next.js)**: Next.js Link (se necessário) ou scroll suave com `react-scroll`

### Formulário Subscribe
O formulário agora:
1. **Envia primeiro para `/api/sfmc`** (API local do Next.js)
2. **Depois para o backend legado** (se configurado no landing.json)

### Rotas API
Criada `POST /api/sfmc` que:
- Valida dados do formulário
- Obtém token OAuth do SFMC
- Envia dados para Data Extension
- Retorna status da operação

### Ambiente de build
- **Vite removido** - agora usa Next.js
- **Base path dinâmico** - configurado via `next.config.ts`
- **Otimizações automáticas** - Next.js otimiza CSS, JS e imagens

## 🔧 Arquivos importantes

```
template/
├── app/
│   ├── layout.tsx              # Layout raiz
│   ├── globals.css             # Estilos globais
│   ├── (main)/
│   │   └── page.tsx            # Landing page
│   ├── (admin)/
│   │   └── admin/page.tsx      # Admin panel
│   └── api/
│       └── sfmc/
│           └── route.ts        # API Salesforce Marketing Cloud
├── src/                        # Código-fonte (mantido igual)
├── public/                     # Arquivos estáticos
├── next.config.ts              # Config Next.js
├── tsconfig.json               # Config TypeScript
├── package.json                # Dependências Next.js
└── .env.example                # Template de variáveis

# Backups
├── package.json.vite.backup    # Package.json original do Vite
└── ../template-backup-*.tar.gz # Backup completo do projeto
```

## 🌐 Salesforce Marketing Cloud

### Configuração necessária

1. **Criar API no SFMC**:
   - Acesse Setup > Apps > Installed Packages
   - Crie novo package com permissões de Data Extensions
   - Copie Client ID e Client Secret

2. **Criar Data Extension**:
   - Email Studio > Data Extensions
   - Crie nova DE com os campos necessários
   - Anote o External Key (Data Extension ID)

3. **Configurar `.env.local`**:
```env
SFMC_CLIENT_ID=seu_client_id
SFMC_CLIENT_SECRET=seu_client_secret
SFMC_ACCOUNT_ID=mcXXXXXXXXXX
SFMC_DATA_EXTENSION_ID=external_key_da_de
```

## 🔄 Rollback (se necessário)

Para voltar ao Vite:
```bash
cd /Users/allanteixeira/Desktop/React-Projetcs/template-landingpage
tar -xzf template-backup-20251211_151509.tar.gz
```

Ou restaurar apenas o package.json:
```bash
cd template
mv package.json package.json.next.backup
mv package.json.vite.backup package.json
npm install
```

## 📚 Diferenças Vite vs Next.js

| Aspecto | Vite | Next.js App Router |
|---------|------|-------------------|
| Renderização | Client-side (CSR) | Híbrido (SSR/CSR) |
| Rotas | react-router-dom | Baseado em arquivos |
| API | Servidor externo | API Routes nativas |
| Build | vite build | next build |
| Dev Server | vite | next dev |
| Base Path | vite.config.ts | next.config.ts |
| Hot Reload | HMR Vite | Fast Refresh Next |

## ✨ Benefícios da migração

1. **SEO melhorado** - Renderização server-side quando necessário
2. **API nativa** - Rotas de API integradas (SFMC)
3. **Performance** - Otimizações automáticas
4. **Type-safety** - Melhor suporte TypeScript
5. **Produção** - Deploy mais simples (Vercel, etc.)

## 🎯 Próximos passos recomendados

1. Testar todas as funcionalidades
2. Configurar variáveis SFMC
3. Testar envio de formulário
4. Ajustar estilos se necessário
5. Deploy em produção

---

**Migração concluída em:** 11/12/2025  
**Backup disponível em:** `../template-backup-20251211_151509.tar.gz`
