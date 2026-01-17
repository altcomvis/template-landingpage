// utils/getContrastColor.ts
export function getContrastColor(
  hexColor: string
): 'text-white' | 'text-gray-900' {
  if (!hexColor) return 'text-gray-900'

  // remove #
  let c = hexColor.replace('#', '')
  if (c.length === 3)
    c = c
      .split('')
      .map(ch => ch + ch)
      .join('')

  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255

  // 💡 fórmula perceptual (sRGB -> linear RGB -> luminância)
  const toLinear = (v: number) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)

  // 🧠 corte calibrado empiricamente
  // tons >0.55 são claros → texto escuro
  return L > 0.55 ? 'text-gray-900' : 'text-white'
}
