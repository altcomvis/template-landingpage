import { useCallback, useMemo } from "react";
import { resolveAssetUrl, shouldUseAbsoluteS3Urls } from "@/config/s3-urls";
import { getBasePath } from "@/utils/getBasePath";

interface UseAssetUrlOptions {
	directoryName?: string;
}

/**
 * Hook para resolver URLs de assets com suporte a S3 e blob URLs
 *
 * Uso:
 * ```tsx
 * const getAssetUrl = useAssetUrl({ directoryName });
 * const imageUrl = getAssetUrl('img/hero/header.webp');
 * ```
 */
export function useAssetUrl(options?: UseAssetUrlOptions) {
	const basePath = getBasePath();
	const shouldUseS3 = shouldUseAbsoluteS3Urls();

	// Memoiza o diretório para não refazer cálculos
	const directoryName = useMemo(
		() => options?.directoryName,
		[options?.directoryName],
	);

	// Retorna função que resolve URLs
	const resolveUrl = useCallback(
		(relativePath: string): string => {
			// Se está usando URL absoluta S3 e tem directoryName
			if (shouldUseS3 && directoryName) {
				return resolveAssetUrl(relativePath, directoryName);
			}

			// Caso contrário, usa basePath do Vite (relativo ou S3)
			// Em blob URLs, isso será "/" e os assets serão mapeados por blob URLs
			// Em produção real, isso será a URL S3 completa
			return `${basePath}${relativePath}`;
		},
		[basePath, shouldUseS3, directoryName],
	);

	return resolveUrl;
}
