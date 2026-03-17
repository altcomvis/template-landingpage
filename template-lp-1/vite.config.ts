import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => ({
	plugins: [react(), tailwindcss()],

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

	// ✅ Temporário: usar base local para evitar resolução via S3
	base: "/",

	build: {
		rollupOptions: {
			output: {
				// Nomes previsíveis com hash para facilitar mapeamento de blob URLs
				assetFileNames: "assets/[name]-[hash][extname]",
				chunkFileNames: "assets/[name]-[hash].js",
				entryFileNames: "assets/[name]-[hash].js",
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
