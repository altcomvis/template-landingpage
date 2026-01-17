# 🧪 Guia de Teste - Template React com URLs S3

## ✅ Checklist de Validação

### Fase 1: Build Local
- [ ] `npm run build` completa sem erros
- [ ] Arquivo `dist/index.html` gerado
- [ ] Assets em `dist/assets/` com hash nos nomes
- [ ] Nenhum warning de CORS ou paths

### Fase 2: Verificar Configuração S3
- [ ] `vite.config.ts` lê corretamente `landing.json`
- [ ] `directoryName` definido em `public/landing.json`
- [ ] Base URL S3 está em `s3-urls.ts`

### Fase 3: Testar em Desenvolvimento
```bash
npm run dev
# Abrir http://localhost:5173
# Devtools → Console → sem erros
# Imagens carregam corretamente
```

### Fase 4: Testar No Admin-Pages

#### 4.1 Preparar Template
```bash
cd template-react
npm run build

# Resultado: pasta dist/ com build pronto
# Estrutura esperada:
# dist/
#   ├── index.html
#   ├── assets/
#   │   ├── index-[hash].js
#   │   ├── index-[hash].css
#   │   └── ...
#   └── img/
#       ├── hero/
#       │   ├── header.webp
#       │   └── marca-do-projeto.webp
#       └── ...
```

#### 4.2 Criar ZIP (Simulando Admin-Pages)
```bash
# No diretório dist/
zip -r ~/template-dist.zip .

# Copiar para admin-pages
cp ~/template-dist.zip ~/Desktop/React-Projetcs/admin-pages/public/template.zip
```

#### 4.3 Testar no Admin-Pages
```bash
cd admin-pages
npm run dev

# Abrir http://localhost:3000/landing
# Devtools → Console → verificar logs:

# ✅ Esperado ver:
# "📦 Template.zip carregado: X bytes"
# "✅ JSZip importado com sucesso"
# "🎉 Pacote carregado com sucesso!"
# "✅ Proxy de fetch instalado com X URLs mapeadas"
# "🔧 URLs absolutas S3 convertidas para caminhos relativos"
# "🔧 Removendo directoryName do landing.json: template-landing-page"

# ❌ NÃO deve ver:
# "Erro ao carregar template"
# "CORS error"
# "404 not found"
```

#### 4.4 Validar Renderização
- [ ] Landing page aparece corretamente no iframe
- [ ] Imagens carregam (logo, header, etc)
- [ ] CSS aplicado corretamente
- [ ] Cores e temas funcionam
- [ ] Menu interativo funciona
- [ ] Formulários respondem

## 🔍 Testes Específicos

### Teste 1: URLs Absolutas S3 → Relativas
**Objetivo**: Confirmar que URLs S3 são convertidas para relativas

```javascript
// No DevTools Console do Admin-Pages, após carregar template:
// Verificar que o HTML teve URLs convertidas

// Antes (no template-react gerado):
// <script src="https://s3.glbimg.com/.../projetos/template-landing-page/assets/index.js"></script>

// Depois (após processar no admin-pages):
// <script src="assets/index.js"></script>

// Confirmar:
document.querySelector('script')?.src
// Resultado deve começar com "/assets/" ou ser blob URL
```

### Teste 2: Landing.json Modificado
**Objetivo**: Confirmar que directoryName foi removido

```javascript
// Fetch o landing.json que foi mapeado
fetch('blob:http://localhost:3000/...')  // blob URL do landing.json
  .then(r => r.json())
  .then(data => {
    console.log('directoryName:', data.general.directoryName)
    // Deve ser vazio: ""
    console.log('basePath:', data.general.basePath)
    // Deve ser vazio: ""
  })
```

### Teste 3: Assets Mapeados
**Objetivo**: Confirmar que blob URLs estão mapeados corretamente

```javascript
// No console, procurar pela injeção de proxy:
// Deve haver logs tipo:
// "🔄 Redirecionando fetch: /assets/index.css → blob:http://localhost:3000/..."
// "🔄 Redirecionando fetch: /img/hero/header.webp → blob:http://localhost:3000/..."

// Testar um fetch manualmente:
fetch('/assets/index-abc123.css')
  .then(r => r.text())
  .then(css => {
    console.log('CSS loaded:', css.substring(0, 100), '...')
    // Deve carregar corretamente
  })
```

### Teste 4: React Router Basename
**Objetivo**: Confirmar que React Router usa basename correto

```javascript
// No console do React DevTools:
// Verificar que Router tem basename="/"

// Ou verificar na URL do navegador:
// Deve estar em blob:http://localhost:3000/ (root)
// Não deve tentar usar /projetos/template-landing-page/
```

## 🐛 Debugging

### Se imagens não carregam:
1. Abrir DevTools → Network
2. Procurar por requests de `/img/...`
3. Verificar se status é 200 (não 404)
4. Confirmar que response é válida (imagem de verdade)

### Se CSS não aplica:
1. Devtools → Elements → procurar por `<style>` ou `<link>`
2. Clicar no URL do CSS
3. Verificar se o CSS está lá
4. Se URL for blob, abrir DevTools → Sources e procurar por `blob:`

### Se template não renderiza:
1. Console → procurar por erros vermelhos
2. Verificar logs de "Removendo directoryName"
3. Confirmar que landing.json foi carregado
4. Procurar por erro em JSON parsing

### Se formulários não funcionam:
1. Abrir Network tab
2. Enviar formulário
3. Verificar se POST request foi enviado
4. Confirmar resposta é 200/201
5. Verificar localStorage (se salva dados)

## 📊 Logs Esperados

```
✅ LOG CORRETO (Admin-Pages Console):
──────────────────────────────────────
📦 Template.zip carregado: 2455678 bytes
🔧 Processando ZIP...
✅ Landing.json encontrado
🔧 Removendo directoryName do landing.json: template-landing-page
✅ Proxy de fetch instalado com 65 URLs mapeadas
🔄 Redirecionando fetch: landing.json → blob:http://localhost:3000/xyz
🔄 Redirecionando fetch: /assets/index.js → blob:...
✅ Proxy de fetch instalado com sucesso
🎉 Template carregado e renderizado!


❌ LOG INCORRETO (Indica Erro):
───────────────────────────────
⚠️ Erro ao carregar template: CORS error
❌ JSON.parse: unexpected token
🧭 BasePath confirmado: /projetos/template-landing-page/ (ERRADO em blob)
⚠️ Falha ao carregar landing.json
404 not found: /assets/index.js
```

## 🚀 Performance Check

### Verificar Tamanho do Build
```bash
cd template-react
du -sh dist/
# Esperado: < 5MB

du -sh dist/assets/
# Esperado: < 3MB (depois de gzip)
```

### Verificar Network (DevTools → Network)
- [ ] index.html: < 50KB
- [ ] index.js: < 2MB
- [ ] index.css: < 500KB
- [ ] Imagens: cada uma < 500KB
- [ ] Total carregado: < 5MB

### Verificar Tempo de Carregamento
- [ ] Tempo de carregamento no iframe: < 3 segundos
- [ ] Time to Interactive: < 5 segundos

## ✨ Caso de Sucesso

Quando tudo estiver funcionando:

1. ✅ Admin-pages carrega template.zip
2. ✅ HTML tem URLs relativas (convertidas de S3)
3. ✅ Landing.json tem directoryName = ""
4. ✅ Proxy intercepta fetches e redireciona para blob URLs
5. ✅ React renderiza corretamente
6. ✅ Imagens e CSS carregam
7. ✅ Menu e formulários funcionam
8. ✅ Console sem erros

## 🔗 Links Úteis

- [Vite Config Docs](https://vitejs.dev/config/)
- [React Router Docs](https://reactrouter.com/)
- [MDN - Blob URLs](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)
- [CORS Troubleshooting](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

**Última atualização**: 2024-01-16
**Testado em**: Chrome, Firefox, Safari
