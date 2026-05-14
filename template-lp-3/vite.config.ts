import path from "node:path";
import fs from "node:fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

type LandingGeneral = {
	seoTitle?: string;
	seoDescription?: string;
	seoKeywords?: string;
	seoUrl?: string;
	seoImage?: string;
	directoryName?: string;
};

type LandingConfig = {
	general?: LandingGeneral;
};

const DEFAULT_TITLE = "Projeto Especial - Editora Globo";
const DEFAULT_DESCRIPTION =
	"Landing Page criada pela Editora Globo. Confira conteudos, eventos e projetos especiais.";
const DEFAULT_KEYWORDS = "editora globo, projetos, eventos";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

function escapeAttr(value: string) {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function toAbsoluteUrl(value?: string, baseUrl?: string) {
	if (!value) return "";
	if (ABSOLUTE_URL_REGEX.test(value)) return value;
	if (!baseUrl || !ABSOLUTE_URL_REGEX.test(baseUrl)) return "";

	try {
		const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
		const normalizedValue = value.startsWith("/") ? value.slice(1) : value;
		return new URL(normalizedValue, normalizedBase).toString();
	} catch {
		return "";
	}
}

function createStaticSeoPlugin() {
	return {
		name: "inject-static-seo-tags",
		transformIndexHtml(html: string) {
			const landingPath = path.resolve(__dirname, "public/landing.json");
			if (!fs.existsSync(landingPath)) {
				return html;
			}

			let general: LandingGeneral = {};
			try {
				const landingConfig = JSON.parse(
					fs.readFileSync(landingPath, "utf-8"),
				) as LandingConfig;
				general = landingConfig.general ?? {};
			} catch {
				return html;
			}

			const title = general.seoTitle?.trim() || DEFAULT_TITLE;
			const description = general.seoDescription?.trim() || DEFAULT_DESCRIPTION;
			const keywords = general.seoKeywords?.trim() || DEFAULT_KEYWORDS;

			const directoryName = general.directoryName
				?.trim()
				.replace(/^\/+|\/+$/g, "");
			const fallbackCanonicalUrl =
				process.env.SITEMAP_BASE_URL ||
				(directoryName
					? `https://oglobo.globo.com/projetos/${directoryName}`
					: "");
			const canonicalUrl = general.seoUrl?.trim() || fallbackCanonicalUrl;

			let image = general.seoImage?.trim() || "%BASE_URL%img/cover.webp";
			const absoluteImage = toAbsoluteUrl(image, canonicalUrl);
			if (absoluteImage) {
				image = absoluteImage;
			}

			const staticTags = [
				`<meta name="description" content="${escapeAttr(description)}" />`,
				`<meta name="keywords" content="${escapeAttr(keywords)}" />`,
				`<meta property="og:title" content="${escapeAttr(title)}" />`,
				`<meta property="og:description" content="${escapeAttr(description)}" />`,
				`<meta property="og:type" content="website" />`,
				canonicalUrl
					? `<meta property="og:url" content="${escapeAttr(canonicalUrl)}" />`
					: "",
				`<meta property="og:image" content="${escapeAttr(image)}" />`,
				`<meta property="og:image:width" content="1200" />`,
				`<meta property="og:image:height" content="630" />`,
				`<meta property="og:locale" content="pt_BR" />`,
				`<meta property="og:site_name" content="Editora Globo" />`,
				`<meta name="twitter:card" content="summary_large_image" />`,
				`<meta name="twitter:title" content="${escapeAttr(title)}" />`,
				`<meta name="twitter:description" content="${escapeAttr(description)}" />`,
				`<meta name="twitter:image" content="${escapeAttr(image)}" />`,
				`<meta name="image" content="${escapeAttr(image)}" />`,
				canonicalUrl
					? `<link rel="canonical" href="${escapeAttr(canonicalUrl)}" />`
					: "",
			]
				.filter(Boolean)
				.join("\n  ");

			const withTitle = html.replace(
				/<title>[\s\S]*?<\/title>/i,
				`<title>${escapeAttr(title)}</title>`,
			);

			return withTitle.replace("</head>", `  ${staticTags}\n</head>`);
		},
	};
}

export default defineConfig(() => ({
	plugins: [react(), tailwindcss(), createStaticSeoPlugin()],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@globo/form-engine": path.resolve(
				__dirname,
				"../../admin-pages-form-intergrado/packages/form-engine/src",
			),
			"@globo/ui": path.resolve(
				__dirname,
				"../../admin-pages-form-intergrado/packages/ui/src",
			),
		},
		dedupe: ["react", "react-dom"],
	},

	optimizeDeps: {
		include: ["react", "react-dom"],
		force: true,
	},

	// Usa caminhos relativos para funcionar em subpastas no S3
	base: "./",

	build: {
		rollupOptions: {
			output: {
				// Mantem nomes estaveis para os arquivos de entrada no ZIP
				assetFileNames: (assetInfo) =>
					assetInfo.name?.endsWith(".css")
						? "assets/index.css"
						: "assets/[name]-[hash][extname]",
				chunkFileNames: "assets/[name]-[hash].js",
				entryFileNames: "assets/index.js",
			},
		},
	},

	// Suporte a iframe do admin-pages (CORS)
	server: {
		headers: {
			"Access-Control-Allow-Origin": "*",
		},
	},
}));
