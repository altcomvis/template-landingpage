import { useEffect } from 'react'

interface ThemeColorsProps {
  primaryColor?: string
  secondaryColor?: string
  darkColor?: string
  lightColor?: string
  backgroundColor?: string
  surfaceColor?: string
  textColor?: string
  fontFamily?: string
}

/* Utilitário: converte HEX (#rrggbb ou #rgb) para string "r g b" */
function hexToRgb(hex?: string): string | undefined {
  if (!hex) return undefined
  let value = hex.replace('#', '')

  // Formato curto (#fff)
  if (value.length === 3) {
    value = value
      .split('')
      .map(ch => ch + ch)
      .join('')
  }

  const bigint = parseInt(value, 16)
  if (Number.isNaN(bigint)) return undefined

  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return `${r} ${g} ${b}` // formato moderno sem vírgulas
}

/**
 * Aplica as cores da landing como variáveis CSS globais.
 * Gera também versões RGB (`--color-rgb`) para uso com opacidade no Tailwind.
 */
export function useThemeColors({
  primaryColor,
  secondaryColor,
  darkColor,
  lightColor,
  backgroundColor,
  surfaceColor,
  textColor,
  fontFamily,
}: ThemeColorsProps) {
  useEffect(() => {
    const root = document.documentElement

    const vars: Record<string, string | undefined> = {
      '--primary': primaryColor,
      '--primary-rgb': hexToRgb(primaryColor),
      '--secondary': secondaryColor,
      '--secondary-rgb': hexToRgb(secondaryColor),
      '--dark': darkColor,
      '--dark-rgb': hexToRgb(darkColor),
      '--light': lightColor,
      '--light-rgb': hexToRgb(lightColor),
      '--background': backgroundColor,
      '--background-rgb': hexToRgb(backgroundColor),
      '--surface': surfaceColor,
      '--surface-rgb': hexToRgb(surfaceColor),
      '--text': textColor,
      '--text-rgb': hexToRgb(textColor),
      '--font-family': fontFamily,
    }

    Object.entries(vars).forEach(([key, value]) => {
      if (value) root.style.setProperty(key, value)
    })
  }, [
    primaryColor,
    secondaryColor,
    darkColor,
    lightColor,
    backgroundColor,
    surfaceColor,
    textColor,
    fontFamily,
  ])
}
