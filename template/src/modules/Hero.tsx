import { useEffect, useState } from 'react'
import LightRays from '@/components/LightRays'
import { getBasePath } from '@/utils/getBasePath'

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  data: {
    subtitle: string
    subtitleColor?: string
    date: string
    time: string
    location: string
    address: string

    useLightRays?: boolean
    lightRaysColor?: string
    logoSize?: 'grande' | 'medio' | 'pequeno'
  }
  general: {
    projectName: string
    primaryColor: string
  }
}

export function Hero({ data, general, ...props }: HeroProps) {
  const {
    subtitle,
    subtitleColor,
    date,
    time,
    location,
    address,

    useLightRays,
    lightRaysColor,
    logoSize,
  } = data

  const { projectName, primaryColor } = general

  const hasLogo = true
  const logoPath = `${getBasePath()}img/hero/marca-do-projeto.webp`
  const background = `${getBasePath()}img/hero/header.webp`

  // 🔹 estado de contraste dinâmico
  const [textContrast, setTextContrast] = useState<
    'text-white' | 'text-gray-900'
  >('text-white')

  useEffect(() => {
    const box = document.querySelector('.info-box') as HTMLElement | null

    if (!box) return

    // cria um canvas temporário para capturar a cor renderizada
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // captura a cor renderizada do elemento (inclusive alpha)
    const style = window.getComputedStyle(box)
    const bg = style.backgroundColor // ex: rgba(156, 163, 175, 0.5)

    const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/)
    if (!match) return

    let [_, r, g, b, a] = match
    const alpha = a ? parseFloat(a) : 1

    // mistura com o fundo real (hero)
    const hero = document.querySelector('section') as HTMLElement
    const heroBg = window.getComputedStyle(hero).backgroundColor
    const hMatch = heroBg.match(
      /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
    )

    let [hr, hg, hb] = hMatch
      ? [hMatch[1], hMatch[2], hMatch[3]].map(Number)
      : [255, 255, 255]

    // cor percebida (mistura da box com o fundo do hero)
    const mix = (ch: number, hch: number) =>
      Math.round((1 - alpha) * hch + alpha * ch)
    const rFinal = mix(Number(r), hr)
    const gFinal = mix(Number(g), hg)
    const bFinal = mix(Number(b), hb)

    // cálculo perceptual
    const toLinear = (v: number) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    const L =
      0.2126 * toLinear(rFinal / 255) +
      0.7152 * toLinear(gFinal / 255) +
      0.0722 * toLinear(bFinal / 255)

    setTextContrast(L > 0.55 ? 'text-gray-900' : 'text-white')
  }, [background, primaryColor])

  return (
    <section
      {...props}
      className="relative flex flex-col items-center justify-center md:rounded-xl shadow-lg bg-[url('/img/hero/header.webp')] bg-center bg-no-repeat bg-cover overflow-hidden py-20 md:py-10"
    >
      {/* 🌤 Light Rays */}
      {useLightRays && (
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor={lightRaysColor || '#ffffff'}
            raysSpeed={1}
            lightSpread={3}
            rayLength={2}
            fadeDistance={1}
            followMouse={true}
            mouseInfluence={0.5}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
          />
        </div>
      )}

      {/* 📦 Conteúdo principal */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        {/* Logo ou nome do projeto */}
        <div className="mb-6">
          {hasLogo ? (
            <img
              src={logoPath}
              alt={projectName || 'Logo do Projeto'}
              className={`mx-auto ${
                logoSize === 'grande'
                  ? 'h-64'
                  : logoSize === 'pequeno'
                    ? 'h-24'
                    : 'h-40'
              }`}
            />
          ) : (
            <h1 className="text-3xl md:text-5xl font-bold">{projectName}</h1>
          )}
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <p
            className="text-lg md:text-2xl mb-8 text-shadow-2xl"
            style={{ color: subtitleColor || '#fff' }}
          >
            {subtitle}
          </p>
        )}

        {/* 📅 Informações do evento */}
        {(date || time || location || address) && (
          <div className="flex gap-4 justify-center items-stretch flex-wrap">
            {date && (
              <div
                className={`info-box flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2 ${textContrast}`}
              >
                <span className="text-2xl">📅</span>
                <span className="font-bold text-xl md:text-2xl">{date}</span>
              </div>
            )}
            {time && (
              <div
                className={`info-box flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2 ${textContrast}`}
              >
                <span className="text-2xl">⏰</span>
                <span className="font-bold text-xl md:text-2xl">{time}</span>
              </div>
            )}
            {(location || address) && (
              <div
                className={`info-box flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2 text-center md:text-left ${textContrast}`}
              >
                <div className="flex flex-col">
                  {location && (
                    <span className="font-bold block text-lg md:text-xl text-pretty">
                      📍 {location}
                    </span>
                  )}
                  {address && (
                    <span className="text-sm text-pretty">{address}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
