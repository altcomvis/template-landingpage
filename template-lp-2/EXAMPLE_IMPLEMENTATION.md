/**
 * 📝 Exemplo de Implementação
 * 
 * Este arquivo demonstra como migrar componentes existentes para usar
 * o novo sistema de URLs do S3 com suporte a blob URLs.
 */

// ❌ ANTES - Usando getBasePath() diretamente
// ──────────────────────────────────────────
function HeroOLD({ data, general }: HeroProps) {
  const hasLogo = true
  const logoPath = `${getBasePath()}img/hero/marca-do-projeto.webp`
  const background = `${getBasePath()}img/hero/header.webp`

  // Problema: Em blob URLs com directoryName vazio, isso gera:
  // logoPath = "/img/hero/marca-do-projeto.webp" (correto em blob)
  // Mas em produção S3: logoPath = "https://s3.../assets/..." (via vite base)
  
  return <img src={logoPath} alt="Logo" />
}

// ✅ DEPOIS - Usando useAssetUrl() com detecção automática
// ────────────────────────────────────────────────────────
import { useAssetUrl } from '@/hooks/use-asset-url'

interface HeroProps {
  data: any
  general: { directoryName?: string; projectName: string }
}

function HeroNEW({ data, general }: HeroProps) {
  // 1️⃣ Hook detecta contexto automaticamente (S3, blob ou dev)
  const getAssetUrl = useAssetUrl({ 
    directoryName: general.directoryName 
  })

  // 2️⃣ Usa a função para resolver URLs
  const hasLogo = true
  const logoPath = getAssetUrl('img/hero/marca-do-projeto.webp')
  const background = getAssetUrl('img/hero/header.webp')

  // Resultado:
  // - Produção S3: https://s3.glbimg.com/.../projetos/template-landing-page/img/...
  // - Blob URL: /img/... (mapeado para blob:http://localhost:3000/...)
  // - Dev local: /img/...

  return <img src={logoPath} alt="Logo" />
}

// 🔄 Comparação de Fluxo
// ─────────────────────

// CONTEXTO 1: Produção S3
// Entrada: 'img/hero/marca-do-projeto.webp'
// Vite base: 'https://s3.glbimg.com/.../projetos/template-landing-page/'
// Resultado: 'https://s3.glbimg.com/.../projetos/template-landing-page/img/hero/marca-do-projeto.webp'
// ✅ Correto: Asset carregado do S3

// CONTEXTO 2: Blob URL (Iframe Admin-Pages)
// Entrada: 'img/hero/marca-do-projeto.webp'
// useAssetUrl detecta: isRunningInBlob() = true
// Resultado: '/img/hero/marca-do-projeto.webp'
// ✅ Correto: Admin-pages mapeia para blob:http://localhost:3000/...

// CONTEXTO 3: Dev Local
// Entrada: 'img/hero/marca-do-projeto.webp'
// Vite base: '/'
// Resultado: '/img/hero/marca-do-projeto.webp'
// ✅ Correto: Asset servido localmente em dev

// 📋 Componentes a Migrar
// ──────────────────────

/**
 * Busque por padrões como:
 * - `${getBasePath()}img/...`
 * - `${getBasePath()}assets/...`
 * - `getBasePath() + ...`
 * 
 * E substitua por:
 * - const getAssetUrl = useAssetUrl({ directoryName })
 * - getAssetUrl('img/...')
 */

// Exemplo com Menu Component
import { getBasePath } from '@/utils/getBasePath'

interface MenuTemplateProps {
  logo: string // ex: "/public/img/hero/marca-do-projeto.webp"
  landing: any
}

function MenuTemplateOLD({ logo, landing }: MenuTemplateProps) {
  return (
    <div>
      {/* Logo - usando getBasePath */}
      <img 
        src={`${getBasePath()}${logo.replace(/^\/public\//, '')}`}
        alt="Logo"
      />
    </div>
  )
}

function MenuTemplateNEW({ logo, landing }: MenuTemplateProps) {
  // Detecta automaticamente o contexto
  const getAssetUrl = useAssetUrl({
    directoryName: landing?.general?.directoryName
  })

  return (
    <div>
      {/* Logo - usando hook mais limpo */}
      <img 
        src={getAssetUrl(logo.replace(/^\/public\//, ''))}
        alt="Logo"
      />
    </div>
  )
}

// 🔍 Debugging e Testes
// ────────────────────

export function TestAssetUrls() {
  const getAssetUrl = useAssetUrl({ 
    directoryName: 'template-landing-page' 
  })

  // Teste diferentes tipos de assets
  const tests = [
    { input: 'img/hero/header.webp', expected: 'deve ter /img/hero/header.webp' },
    { input: 'assets/index.css', expected: 'deve ter /assets/index' },
    { input: 'img/icons/favicon.ico', expected: 'deve ter /img/icons/favicon.ico' },
  ]

  console.log('=== Teste de Asset URLs ===')
  tests.forEach(test => {
    const url = getAssetUrl(test.input)
    console.log(`✓ ${test.input} → ${url}`)
    console.log(`  ${test.expected}`)
  })

  return (
    <div>
      <h3>Asset URL Tests</h3>
      <pre>{JSON.stringify(tests.map(t => ({
        input: t.input,
        output: getAssetUrl(t.input)
      })), null, 2)}</pre>
    </div>
  )
}

// 📚 Referência Rápida
// ──────────────────

/*
QUANDO USAR useAssetUrl():
✓ Componentes que referenciam img/, assets/, public/
✓ Precisa funcionar em S3, blob URLs e dev
✓ Quer URL automática baseada no contexto

QUANDO USAR getBasePath():
✓ Precisa da base URL (menos comum)
✓ Construindo URLs dinâmicas complexas
✓ Integração com backend

QUANDO USAR import.meta.env.BASE_URL:
✓ Apenas em produção S3
✓ Casos especiais de webpack/vite
✓ Raro - prefira useAssetUrl()
*/
