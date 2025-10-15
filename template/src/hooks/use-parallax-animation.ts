import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useParallaxAnimation(enabled?: boolean) {
	// 🟢 Nunca muda a estrutura do hook, apenas ativa ou não o efeito
	useLayoutEffect(() => {
		if (enabled === false) return; // ainda não habilitado

		// Proteção extra: se não estiver no browser, não roda
		if (typeof window === "undefined") return;

		// ✅ Espera o próximo frame para garantir que o DOM está pronto
		requestAnimationFrame(() => {
			const elements = document.querySelectorAll("[data-parallax]");
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
	}, [enabled]);
}
