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

/* Utilitário: extrai weight e style (italic) de um valor como "700italic" */
function parseVariant(variant?: string): { weight: string; style: string } {
	if (!variant) return { weight: "400", style: "normal" };

	const isItalic = variant.includes("italic");
	const weight = variant.replace("italic", "").trim() || "400";
	const style = isItalic ? "italic" : "normal";

	return { weight, style };
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

function buildGoogleFontsParam(font: string): string {
	const family = buildGoogleFontsFamily(font);
	// Include normal and italic variants to avoid Safari fallback quirks.
	return `family=${family}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800`;
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

		// Parse font weights and styles
		const bodyVariant = parseVariant(fontBodyStyle);
		const titleVariant = parseVariant(fontTitleStyle);

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
			"--font-body-weight": bodyVariant.weight,
			"--font-body-style": bodyVariant.style,
			"--font-title-weight": titleVariant.weight,
			"--font-title-style": titleVariant.style,
		};

		Object.entries(vars).forEach(([key, value]) => {
			if (value) root.style.setProperty(key, value);
		});

		const googleFontsId = "dynamic-google-fonts";
		const googleFontParams = Array.from(
			new Set([fontBody, fontTitle].filter(Boolean) as string[]),
		).map(buildGoogleFontsParam);

		document.getElementById(googleFontsId)?.remove();
		if (googleFontParams.length > 0) {
			const link = document.createElement("link");
			link.id = googleFontsId;
			link.rel = "stylesheet";
			link.href = `https://fonts.googleapis.com/css2?${googleFontParams.join("&")}&display=swap`;
			document.head.appendChild(link);
		}

		const styleId = "dynamic-runtime-font-overrides";
		document.getElementById(styleId)?.remove();
		const style = document.createElement("style");
		style.id = styleId;
		style.textContent = `
			body {
				font-family: ${bodyFontStack} !important;
				font-weight: ${bodyVariant.weight};
				font-style: ${bodyVariant.style};
			}
			h1, h2, h3, h4, h5, h6, .font-title {
				font-family: ${titleFontStack} !important;
				font-weight: ${titleVariant.weight};
				font-style: ${titleVariant.style};
			}
		`;
		document.head.appendChild(style);

		// ✅ Força atualização após leve atraso (garante fontTitle)
		const timeout = setTimeout(() => {
			root.style.setProperty("--font-title", titleFontStack);
			root.style.setProperty("--font-body", bodyFontStack);
			root.style.setProperty("--font-family", bodyFontStack);
			root.style.setProperty("--font-family-title", titleFontStack);
		}, 300);

		return () => {
			clearTimeout(timeout);
		};
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
