import { useEffect, useMemo, useState } from "react";
import { parseColor, relativeLuminance } from "@/utils/color";

type Opts = {
	lightText?: string;
	darkText?: string;
	threshold?: number;
	debug?: boolean;
};

export function useDynamicColor(input: string, opts: Opts = {}) {
	const {
		lightText = "rgba(255,255,255,0.95)",
		darkText = "rgba(0,0,0,0.88)",
		threshold = 0.5,
		debug = false,
	} = opts;

	const [state, setState] = useState<{ color: string | null; valid: boolean }>({
		color: null,
		valid: false,
	});

	useEffect(() => {
		const compute = () => {
			try {
				if (!input || typeof input !== "string") {
					setState({ color: null, valid: false });
					return;
				}
				let value = input.trim();

				// resolve var(--...)
				if (value.startsWith("var(")) {
					const name = value.slice(4, -1).trim();
					const resolved = getComputedStyle(document.documentElement)
						.getPropertyValue(name)
						.trim();
					if (!resolved) {
						debug && console.warn("[DynColor] var sem valor:", name);
						setState({ color: null, valid: false });
						return;
					}
					value = resolved;
				}

				// ignora gradiente/URL
				if (/^(linear-gradient|url)\(/i.test(value)) {
					setState({ color: null, valid: false });
					return;
				}

				const rgb = parseColor(value);
				if (!rgb) {
					debug && console.warn("[DynColor] parse falhou:", value);
					setState({ color: null, valid: false });
					return;
				}

				const lum = relativeLuminance(rgb);
				const chosen = lum < threshold ? lightText : darkText;
				debug && console.log("[DynColor]", { input, value, lum, chosen });
				setState({ color: chosen, valid: true });
			} catch (e) {
				debug && console.error("[DynColor] erro:", e);
				setState({ color: null, valid: false });
			}
		};

		compute();
		// reexecuta quando :root muda (ex.: setProperty)
		const root = document.documentElement;
		const mo = new MutationObserver(compute);
		mo.observe(root, { attributes: true, attributeFilter: ["style"] });
		return () => mo.disconnect();
	}, [input, lightText, darkText, threshold, debug]);

	// props canônicas pra colar no wrapper
	const props = useMemo(
		() =>
			state.valid
				? { style: { color: `var(--auto-contrast)` }, className: "" }
				: { style: { color: "#fff" }, className: "mix-blend-difference" },
		[state.valid],
	);

	return {
		...state,
		props, // style + className
	};
}
