import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { createContext, useContext, useEffect, useState } from "react";

// ✅ Registra o plugin apenas no browser
if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger);
}

/* ──────────────────────────────────────────────── */
/* Contexto global para pausar o parallax quando Drawer/modal está aberto */
const ParallaxContext = createContext({
	enabled: true,
	setParallaxEnabled: (_: boolean) => {},
});

export function useParallaxController() {
	return useContext(ParallaxContext);
}

/* ──────────────────────────────────────────────── */
/* Provider — envolver <App /> com ele */
export function ParallaxProvider({ children }: { children: React.ReactNode }) {
	const [enabled, setParallaxEnabled] = useState(true);
	return (
		<ParallaxContext.Provider value={{ enabled, setParallaxEnabled }}>
			{children}
		</ParallaxContext.Provider>
	);
}

/* ──────────────────────────────────────────────── */
/* Hook de animação */
export function useParallaxAnimation(enabled: boolean) {
	const { enabled: globalEnabled } = useParallaxController();

	useEffect(() => {
		// só executa se o parallax estiver ativo globalmente e localmente
		if (!enabled || !globalEnabled || typeof window === "undefined") return;

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

		return () => {
			ScrollTrigger.getAll().forEach((t) => t.kill());
		};
	}, [enabled, globalEnabled]);
}
