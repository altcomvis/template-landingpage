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
		// Se estiver no servidor, não faz nada
		if (typeof window === "undefined") return;

		// Se o parallax está DESABILITADO, garantir que todos os elementos estejam visíveis
		if (!enabled) {
			requestAnimationFrame(() => {
				const elements =
					document.querySelectorAll<HTMLElement>("[data-parallax]");
				elements.forEach((el) => {
					gsap.set(el, { opacity: 1, y: 0, filter: "blur(0px)" });
				});
			});
			return;
		}

		// Espera o próximo frame para aplicar animações
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
