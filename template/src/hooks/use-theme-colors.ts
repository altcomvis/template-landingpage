import { useEffect } from "react";

interface ThemeColorsProps {
	primaryColor?: string;
	secondaryColor?: string;
	darkColor?: string;
	lightColor?: string;
	backgroundColor?: string;
	surfaceColor?: string;
	textColor?: string;
	fontBody?: string;
	fontTitle?: string;
}

/* Utilitário: converte HEX (#rrggbb ou #rgb) para string "r g b" */
function hexToRgb(hex?: string): string | undefined {
	if (!hex) return undefined;
	let value = hex.replace("#", "");

	// Formato curto (#fff)
	if (value.length === 3) {
		value = value
			.split("")
			.map((ch) => ch + ch)
			.join("");
	}

	const bigint = parseInt(value, 16);
	if (Number.isNaN(bigint)) return undefined;

	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return `${r} ${g} ${b}`;
}

export function useThemeColors({
	primaryColor,
	secondaryColor,
	darkColor,
	lightColor,
	backgroundColor,
	surfaceColor,
	textColor,
	fontBody,
	fontTitle,
}: ThemeColorsProps) {
	useEffect(() => {
		const root = document.documentElement;

		const vars: Record<string, string | undefined> = {
			"--primary": primaryColor,
			"--primary-rgb": hexToRgb(primaryColor),
			"--secondary": secondaryColor,
			"--secondary-rgb": hexToRgb(secondaryColor),
			"--dark": darkColor,
			"--dark-rgb": hexToRgb(darkColor),
			"--light": lightColor,
			"--light-rgb": hexToRgb(lightColor),
			"--background": backgroundColor,
			"--background-rgb": hexToRgb(backgroundColor),
			"--surface": surfaceColor,
			"--surface-rgb": hexToRgb(surfaceColor),
			"--text": textColor,
			"--text-rgb": hexToRgb(textColor),
		};

		Object.entries(vars).forEach(([key, value]) => {
			if (value) root.style.setProperty(key, value);
		});

		// ✅ Fonte principal (fontBody)
		if (fontBody) {
			const id = "dynamic-google-font-main";
			document.getElementById(id)?.remove();

			const link = document.createElement("link");
			link.id = id;
			link.rel = "stylesheet";
			link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
				fontBody,
			)}:wght@400;500;600;700&display=swap`;
			document.head.appendChild(link);

			root.style.setProperty("--font-family", `'${fontBody}', sans-serif`);
		}

		// ✅ Fonte de títulos (fontTitle)
		if (fontTitle) {
			const id = "dynamic-google-font-title";
			document.getElementById(id)?.remove();

			const link = document.createElement("link");
			link.id = id;
			link.rel = "stylesheet";
			link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
				fontTitle,
			)}:wght@600;700;800&display=swap`;
			document.head.appendChild(link);

			root.style.setProperty(
				"--font-family-title",
				`'${fontTitle}', sans-serif`,
			);
		}

		// ✅ Força atualização após leve atraso (garante fontTitle)
		const timeout = setTimeout(() => {
			if (fontTitle) {
				root.style.setProperty(
					"--font-family-title",
					`'${fontTitle}', sans-serif`,
				);
			}
		}, 300);

		return () => clearTimeout(timeout);
	}, [
		primaryColor,
		secondaryColor,
		darkColor,
		lightColor,
		backgroundColor,
		surfaceColor,
		textColor,
		fontBody,
		fontTitle,
	]);
}
