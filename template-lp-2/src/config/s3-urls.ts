/**
 * 🌐 Configuração de URLs S3
 *
 * Determina como os assets serão carregados:
 * - Em produção (S3): URLs absolutas https://s3.glbimg.com/...
 * - Em iframe (blob): URLs relativas /assets/... (mapeadas para blob URLs)
 * - Em dev local: URLs relativas /assets/...
 */

export const S3_CONFIG = {
	baseUrl:
		"https://s3.glbimg.com/v1/AUTH_87d42e7b2a034c7ba871ec4d2695d73d/oglobo-globo-com/projetos/",
};

/**
 * Detecta se está rodando em blob URL (iframe do admin-pages)
 */
export function isRunningInBlob(): boolean {
	if (typeof window === "undefined") return false;
	return (
		window.location.protocol === "blob:" ||
		window.location.href.includes("blob:")
	);
}

/**
 * Detecta se está em produção (S3)
 */
export function isProduction(): boolean {
	return import.meta.env.MODE === "production";
}

/**
 * Verifica se precisa usar URL absoluta S3
 * (somente quando a página está realmente hospedada no S3 da Globo)
 */
export function shouldUseAbsoluteS3Urls(): boolean {
	if (isRunningInBlob()) return false;
	if (typeof window === "undefined") return false;

	const host = window.location.hostname.toLowerCase();
	return host.includes("s3.glbimg.com");
}

/**
 * Converte URL relativa para absoluta S3 se necessário
 */
export function resolveAssetUrl(
	relativePath: string,
	directoryName?: string,
): string {
	const normalizedPath = String(relativePath || "").trim().replace(/^\/+/, "");
	if (!normalizedPath) return "";

	const shouldUseS3 = shouldUseAbsoluteS3Urls();

	if (shouldUseS3 && directoryName) {
		return `${S3_CONFIG.baseUrl}${directoryName}/${normalizedPath}`;
	}

	// No preview em blob, mantém caminho absoluto do host do admin.
	if (isRunningInBlob()) {
		return `/${normalizedPath}`;
	}

	// Em pacotes exportados/local/server comum, resolve relativo à pasta atual.
	if (typeof document !== "undefined") {
		try {
			return new URL(normalizedPath, document.baseURI).toString();
		} catch {
			// fallback abaixo
		}
	}

	return `./${normalizedPath}`;
}
