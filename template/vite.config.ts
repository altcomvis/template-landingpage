import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { defineConfig } from "vite";

// 🔹 Lê o landing.json para pegar o nome do diretório e URL base
let landing: any = {};
try {
	const jsonPath = path.resolve(__dirname, "./public/landing.json");
	landing = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
} catch (err) {
	console.warn("⚠️ Não foi possível ler landing.json:", err);
}

const directoryName = landing?.general?.directoryName || "NOMEPROJETO";
const baseUrl =
	"https://s3.glbimg.com/v1/AUTH_87d42e7b2a034c7ba871ec4d2695d73d/oglobo-globo-com/projetos/";

export default defineConfig(({ mode }) => ({
	plugins: [react(), tailwindcss()],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	// ✅ Base dinâmica (produção) ou local (dev)
	base: mode === "production" ? `${baseUrl}${directoryName}/` : "/",

	build: {
		rollupOptions: {
			output: {
				assetFileNames: "assets/[name][extname]",
			},
		},
	},
}));
