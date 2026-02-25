import fs from "fs";
import type { NextConfig } from "next";
import path from "path";

// Preferir env para evitar acoplamento ao JSON no build.
// Ainda suporta ler um JSON local se PROJECT_JSON_PATH estiver definido.
type ProjectJsonShape = {
	general?: {
		directoryName?: string;
	};
};

let landing: ProjectJsonShape = {};
const projectJsonPath = process.env.PROJECT_JSON_PATH
	? path.resolve(process.cwd(), process.env.PROJECT_JSON_PATH)
	: null;

if (projectJsonPath) {
	try {
		landing = JSON.parse(
			fs.readFileSync(projectJsonPath, "utf-8"),
		) as ProjectJsonShape;
	} catch (err) {
		console.warn(
			`⚠️ Não foi possível ler o JSON do projeto em ${projectJsonPath}.`,
			err,
		);
	}
}

const directoryName =
	process.env.NEXT_PUBLIC_DIRECTORY_NAME ||
	process.env.DIRECTORY_NAME ||
	landing?.general?.directoryName ||
	"NOMEPROJETO";

const nextConfig: NextConfig = {
	// ✅ Base path apenas em produção (caminho relativo, não URL completa)
	basePath:
		process.env.NODE_ENV === "production" ? `/projetos/${directoryName}` : "",

	// Para assets do S3, usar assetPrefix
	assetPrefix:
		process.env.NODE_ENV === "production"
			? `https://s3.glbimg.com/v1/AUTH_87d42e7b2a034c7ba871ec4d2695d73d/oglobo-globo-com/projetos/${directoryName}`
			: undefined,

	// Configurações de imagem
	images: {
		unoptimized: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**.glbimg.com",
			},
			{
				protocol: "https",
				hostname: "**.s3.amazonaws.com",
			},
		],
	},

	// Suporte para TypeScript
	typescript: {
		ignoreBuildErrors: false,
	},

	// Suporte para ESLint durante build
	eslint: {
		ignoreDuringBuilds: true,
	},

	// Habilita experimental features se necessário
	experimental: {
		optimizePackageImports: ["@radix-ui/*", "lucide-react"],
	},
};

export default nextConfig;
