export type RGB = { r: number; g: number; b: number };

export function parseColor(input: string): RGB | null {
	if (!input) return null;
	const v = input.trim();

	// HEX #RRGGBB ou #RGB
	if (v.startsWith("#")) {
		const hex = v.slice(1);
		if (hex.length === 3) {
			const r = parseInt(hex[0] + hex[0], 16);
			const g = parseInt(hex[1] + hex[1], 16);
			const b = parseInt(hex[2] + hex[2], 16);
			return { r, g, b };
		}
		if (hex.length === 6) {
			const r = parseInt(hex.slice(0, 2), 16);
			const g = parseInt(hex.slice(2, 4), 16);
			const b = parseInt(hex.slice(4, 6), 16);
			return { r, g, b };
		}
		return null;
	}

	// rgb / rgba
	const m = v.match(
		/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
	);
	if (m) {
		const r = clamp255(+m[1]);
		const g = clamp255(+m[2]);
		const b = clamp255(+m[3]);
		return { r, g, b };
	}

	return null;
}

function clamp255(n: number) {
	return Math.max(0, Math.min(255, Math.round(n)));
}

export function relativeLuminance({ r, g, b }: RGB): number {
	const srgb = [r, g, b]
		.map((v) => v / 255)
		.map((u) =>
			u <= 0.03928 ? u / 12.92 : Math.pow((u + 0.055) / 1.055, 2.4),
		);
	return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}
