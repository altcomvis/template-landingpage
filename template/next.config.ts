import fs from "fs";
import type { NextConfig } from "next";
import path from "path";

// 🔹 Lê o landing.json para pegar o nome do diretório e URL base
let landing: any = {};
try {
	const jsonPath = path.resolve(process.cwd(), "./public/landing.json");
	landing = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
} catch (err) {
	console.warn("⚠️ Não foi possível ler landing.json:", err);
}

const directoryName = landing?.general?.directoryName || "NOMEPROJETO";

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
