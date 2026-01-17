export function getBasePath() {
	// Em dev → tudo local
	if (process.env.NODE_ENV === "development") return "/";

	// Em produção → usa a base definida pelo Next.js
	return process.env.NEXT_PUBLIC_BASE_PATH || "/";
}
