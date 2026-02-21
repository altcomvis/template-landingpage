# ✅ Checklist de Implementação - Template React

## 📋 Fase 1: Preparação (15 minutos)

- [ ] Clonar/atualizar repositório template-landingpage
- [ ] Instalar dependências: `npm install`
- [ ] Verificar que landing.json existe em `public/landing.json`
- [ ] Confirmar que `directoryName` está definido em landing.json

```bash
# Verificar landing.json
cat template-react/public/landing.json | grep directoryName
# Deve retornar: "directoryName": "template-landing-page"
```

## 📝 Fase 2: Implementação (30 minutos)

### A. Atualizar vite.config.ts
- [x] ✅ **JÁ FEITO** - Modificado para:
  - Hash nos nomes de assets
  - CORS headers adicionado
  - Estrutura de saída previsível

### B. Criar s3-urls.ts
- [x] ✅ **JÁ FEITO** - Arquivo criado em `src/config/s3-urls.ts`
  - Detecta blob URLs
  - Detecta produção
  - Resolve URLs dinamicamente

### C. Criar use-asset-url.ts
- [x] ✅ **JÁ FEITO** - Hook criado em `src/hooks/use-asset-url.ts`
  - Memoizado para performance
  - Type-safe
  - Suporta múltiplos contextos

### D. Atualizar App.tsx
- [x] ✅ **JÁ FEITO** - Adicionado comentário documentando comportamento

## 🧪 Fase 3: Testes Locais (20 minutos)

### A. Dev Server
```bash
cd template-react
npm run dev
# Abrir http://localhost:5173
```

- [ ] Página carrega sem erros
- [ ] Imagens aparecem
- [ ] CSS aplicado corretamente
- [ ] Menu interativo
- [ ] Console sem warnings

### B. Production Build
```bash
npm run build
```

- [ ] Build completa sem erros
- [ ] `dist/` criado
- [ ] Assets em `dist/assets/` com hash
- [ ] Tamanho total < 5MB

### C. Visualizar Build
```bash
npm run preview
# Abre http://localhost:4173
```

- [ ] Página renderiza
- [ ] Assets carregam de URL local
- [ ] Sem erros 404
- [ ] Comportamento igual ao dev

## 🔗 Fase 4: Integração com Admin-Pages (30 minutos)

### A. Preparar Template
```bash
cd template-react

# 1. Build completo
npm run build

# 2. Criar ZIP
cd dist
zip -r ~/template-react.zip .
cd ..

# 3. Copiar para admin-pages
cp ~/template-react.zip ../admin-pages/public/template.zip
```

- [ ] Arquivo template.zip criado
- [ ] Copiado para admin-pages/public/
- [ ] Tamanho razoável (< 5MB)

### B. Testar no Admin-Pages
```bash
cd ../admin-pages
npm run dev
# Abrir http://localhost:3000/landing
```

- [ ] Página carrega sem erros (verificar console)
- [ ] Log "📦 Template.zip carregado: XXX bytes"
- [ ] Log "🎉 Pacote carregado com sucesso!"
- [ ] Log "✅ Proxy de fetch instalado com X URLs mapeadas"

### C. Validar Renderização
```
DevTools → Elements (Inspecionar)
```

- [ ] HTML contém elementos da landing page
- [ ] Imagens têm src com blob: ou relativo
- [ ] Estilos aplicados (verificar style/class)
- [ ] Scripts carregados (DevTools → Sources)

### D. Testar Interatividade
- [ ] Menu abre/fecha
- [ ] Links scrollam página
- [ ] Formulários respondem a clicks
- [ ] Toasts aparecem (se aplicável)
- [ ] Temas/cores aplicam corretamente

## 🐛 Fase 5: Debugging (Se Necessário)

### Se Imagens Não Carregam
```javascript
// No console do admin-pages
fetch('/assets/index.css').then(r => r.text()).then(console.log)
// Deve retornar CSS válido

fetch('/img/hero/header.webp').then(r => r.blob()).then(console.log)
// Deve retornar Blob de imagem
```

- [ ] Verificar que URLs foram convertidas (sem https://s3....)
- [ ] Confirmar directoryName foi removido (landing.json)
- [ ] Checar se blob URLs estão mapeados corretamente

### Se CSS Não Aplica
```javascript
// No console
document.styleSheets.forEach(ss => {
  console.log(ss.href)
  // Deve conter blob: ou ser relativo
})
```

- [ ] Verificar que estilos foram injetados
- [ ] Confirmar que CSS foi extraído corretamente
- [ ] Checar prefixes e media queries

### Se React Não Renderiza
```javascript
// No console
const root = document.getElementById('root')
console.log(root.innerHTML)
// Deve conter elementos React (não vazio)

// Verificar console.log no React
console.log('Logs React')
```

- [ ] Confirmar que React mountou
- [ ] Checar se Landing component foi renderizado
- [ ] Verificar estado (landing data loaded)

## 📊 Fase 6: Validação Final (15 minutos)

### Checklist de Sucesso
- [ ] Template carrega no iframe
- [ ] Sem erros 404
- [ ] Sem erros CORS
- [ ] Sem erros de parsing
- [ ] Imagens visíveis
- [ ] Estilos aplicados
- [ ] Menu funciona
- [ ] Formulários funcionam
- [ ] Console sem warnings
- [ ] Network < 3s load time

### Testes de Regressão
- [ ] Admin-pages ainda funciona (outras rotas)
- [ ] Landing page sem o ZIP ainda funciona
- [ ] Dev server de admin-pages rápido
- [ ] Build de admin-pages funciona

## 🚀 Fase 7: Deploy (Opcional)

### Para Produção S3
```bash
cd template-react

# Build com URLs S3
npm run build

# Resultado: dist/ com URLs absolutas S3
# Estrutura:
# dist/
#   index.html (com <script src="https://s3...">)
#   assets/...
#   img/...

# Fazer upload para S3:
# s3://bucket/projetos/template-landing-page/
```

- [ ] Build gerado com URLs S3
- [ ] Upload concluído
- [ ] URLs acessíveis publicamente
- [ ] Cache headers configurados

### Validar em Produção
```bash
# Abrir https://dominio.com/projetos/template-landing-page/
```

- [ ] Página carrega
- [ ] Todos os assets do S3
- [ ] Performance normal
- [ ] Sem erros console

## 📈 Fase 8: Monitoramento

- [ ] Configurar alertas para 404s
- [ ] Monitorar performance (Core Web Vitals)
- [ ] Verificar analytics
- [ ] Revisar logs de erro

## 🎓 Documentação para Referência

- [ ] Ler `TEMPLATE_REACT_CORRECTIONS.md` - Entender arquitetura
- [ ] Ler `EXAMPLE_IMPLEMENTATION.md` - Ver exemplos de código
- [ ] Ler `TESTING_GUIDE.md` - Aprender a debugar
- [ ] Ler `README_CORRECTIONS.md` - Overview completo

## ✨ Dicas Importantes

### Desenvolvendo Novos Componentes
```typescript
// ✅ CORRETO
import { useAssetUrl } from '@/hooks/use-asset-url'

function MyComponent({ landing }) {
  const getAssetUrl = useAssetUrl({
    directoryName: landing.general.directoryName
  })
  
  return <img src={getAssetUrl('img/...')} />
}

// ❌ EVITAR
function MyComponent() {
  const url = `${getBasePath()}img/...`
  // Pior porque não usa o padrão memoizado
}
```

### Debugging Rápido
```bash
# Terminal 1: Admin-Pages
npm run dev

# Terminal 2: Template-React (se desenvolvendo)
npm run dev

# Terminal 3: Monitor Changes
watch -n 1 'ls -la admin-pages/public/template.zip'
```

### Checklist de Git
- [ ] Commit: "feat: adicionar suporte a blob URLs no template-react"
- [ ] Mencionar issues relacionadas
- [ ] Descrever mudanças em CHANGELOG.md

## 🏁 Conclusão

Quando todos os itens estiverem checkados:

✅ **Template-React está pronto para:**
- Funcionar em produção S3 (URLs absolutas)
- Funcionar no iframe admin-pages (blob URLs)
- Funcionar em desenvolvimento local
- Ser expandido com novos componentes

---

**Tempo Total Estimado**: 2 horas (incluindo testing)

**Nível de Dificuldade**: 🟢 Fácil-Médio

**Risco**: 🟢 Baixo (totalmente backward compatible)

**ROI**: 🟢 Alto (funciona em 3 contextos diferentes)

---

Para dúvidas, consultar:
- TEMPLATE_REACT_CORRECTIONS.md (detalhes técnicos)
- TESTING_GUIDE.md (debugging)
- EXAMPLE_IMPLEMENTATION.md (código)
