import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useParallaxAnimation(enabled: boolean) {
  useLayoutEffect(() => {
    if (!enabled) return

    // Aguarda o ciclo de renderização do React antes de iniciar GSAP
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll('[data-parallax]')
      console.log(`🎬 Parallax ativo em ${elements.length} elementos`)

      if (!elements.length) return

      elements.forEach((el, i) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 40, filter: 'blur(8px)' },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'back.out(1.7)',
            duration: 1.2,
            delay: i * 0.05, // leve delay entre elementos
            scrollTrigger: {
              trigger: el,
              start: 'top 95%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    })

    // ✅ Cleanup corrigido — sem retorno implícito
    return () => {
      ScrollTrigger.getAll().forEach(t => {
        t.kill()
      })
    }
  }, [enabled])
}
