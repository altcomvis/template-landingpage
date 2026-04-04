import { useEffect } from "react";

interface ThemeColorsProps {
	primaryColor?: string;
	secondaryColor?: string;
	darkColor?: string;
	lightColor?: string;
	backgroundColor?: string;
	surfaceColor?: string;
	textColor?: string;
	titleColor?: string;
	fontBody?: string;
	fontBodyStyle?: string;
	fontTitle?: string;
	fontTitleStyle?: string;
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

function buildFontStack(font?: string): string {
	return font ? `'${font}', sans-serif` : "Poppins, sans-serif";
}

function buildGoogleFontsFamily(font: string): string {
	return font.trim().replace(/\s+/g, "+");
}

export function useThemeColors({
	primaryColor,
	secondaryColor,
	darkColor,
	lightColor,
	backgroundColor,
	surfaceColor,
	textColor,
	titleColor,
	fontBody,
	fontBodyStyle,
	fontTitle,
	fontTitleStyle,
}: ThemeColorsProps) {
	useEffect(() => {
		const root = document.documentElement;
		const bodyFontStack = buildFontStack(fontBody);
		const titleFontStack = buildFontStack(fontTitle);

		root.style.setProperty("--font-title", titleFontStack);
		root.style.setProperty("--font-body", bodyFontStack);
		root.style.setProperty("--font-family", bodyFontStack);
		root.style.setProperty("--font-family-title", titleFontStack);

		const vars: Record<string, string | undefined> = {
			"--myprimary": primaryColor,
			"--myprimary-rgb": hexToRgb(primaryColor),
			"--mysecondary": secondaryColor,
			"--mysecondary-rgb": hexToRgb(secondaryColor),
			"--dark": darkColor,
			"--dark-rgb": hexToRgb(darkColor),
			"--light": lightColor,
			"--light-rgb": hexToRgb(lightColor),
			"--mybackground": backgroundColor,
			"--mybackground-rgb": hexToRgb(backgroundColor),
			"--surface": surfaceColor,
			"--surface-rgb": hexToRgb(surfaceColor),
			"--text": textColor,
			"--text-rgb": hexToRgb(textColor),
			"--title": titleColor || textColor,
			"--title-rgb": hexToRgb(titleColor || textColor),
			"--font-body-weight": fontBodyStyle || "400",
			"--font-title-weight": fontTitleStyle || "700",
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
			link.href = `https://fonts.googleapis.com/css2?family=${buildGoogleFontsFamily(
				fontBody,
			)}:wght@400;500;600;700&display=swap`;
			document.head.appendChild(link);
		}

		// ✅ Fonte de títulos (fontTitle)
		if (fontTitle) {
			const id = "dynamic-google-font-title";
			document.getElementById(id)?.remove();

			const link = document.createElement("link");
			link.id = id;
			link.rel = "stylesheet";
			link.href = `https://fonts.googleapis.com/css2?family=${buildGoogleFontsFamily(
				fontTitle,
			)}:wght@600;700;800&display=swap`;
			document.head.appendChild(link);
		}

		// ✅ Força atualização após leve atraso (garante fontTitle)
		const timeout = setTimeout(() => {
			root.style.setProperty("--font-title", titleFontStack);
			root.style.setProperty("--font-body", bodyFontStack);
			root.style.setProperty("--font-family", bodyFontStack);
			root.style.setProperty("--font-family-title", titleFontStack);
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
		titleColor,
		fontBody,
		fontBodyStyle,
		fontTitle,
		fontTitleStyle,
	]);
}
