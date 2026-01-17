export function getBasePath() {
	// Em dev → tudo local
	if (import.meta.env.MODE === "development") return "/";

	// Em produção → usa a base definida pelo Vite (vinda do JSON)
	return import.meta.env.BASE_URL;
}
