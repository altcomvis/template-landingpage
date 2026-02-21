export function getBasePath() {
	// Em dev → tudo local
	if (import.meta.env.MODE === "development") return "/";

	// Em preview via iframe/blob (admin-pages), manter local para usar assets do ZIP
	if (typeof window !== "undefined") {
		const href = String(window.location?.href || "");
		if (window.location?.protocol === "blob:" || href.includes("blob:")) {
			return "/";
		}
	}

	// Em produção → usa a base definida pelo Vite (vinda do JSON)
	return import.meta.env.BASE_URL;
}
