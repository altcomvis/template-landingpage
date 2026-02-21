import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

// ✅ Registra o plugin apenas no browser
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

/**
 * Hook seguro e estável para animar elementos com [data-parallax]
 * Usa apenas useEffect — sem alterar ordem de hooks.
 */
export function useParallaxAnimation(enabled: boolean) {
	useEffect(() => {
		// Só executa se estiver habilitado e o DOM existir
		if (!enabled || typeof window === "undefined") return;

		// Espera o próximo frame
		requestAnimationFrame(() => {
			const elements =
				document.querySelectorAll<HTMLElement>("[data-parallax]");
			if (!elements.length) return;

			elements.forEach((el, i) => {
				gsap.fromTo(
					el,
					{ opacity: 0, y: 40, filter: "blur(8px)" },
					{
						opacity: 1,
						y: 0,
						filter: "blur(0px)",
						ease: "back.out(1.7)",
						duration: 1.2,
						delay: i * 0.05,
						scrollTrigger: {
							trigger: el,
							start: "top 95%",
							toggleActions: "play none none reverse",
						},
					},
				);
			});
		});

		// Cleanup
		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, [enabled]);
}
