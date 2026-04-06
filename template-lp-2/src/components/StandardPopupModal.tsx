import { useEffect, useMemo, useState } from "react";

interface PopupConfig {
	enabled?: boolean;
	trigger?: "onLoad" | "anchor";
	delaySeconds?: number;
	anchor?: string;
	title?: string;
	content?: string;
}

interface StandardPopupModalProps {
	config?: PopupConfig;
}

function normalizeAnchor(value: string): string {
	return value.trim().replace(/^#/, "").toLowerCase();
}

export function StandardPopupModal({ config }: StandardPopupModalProps) {
	const [open, setOpen] = useState(false);

	const enabled = config?.enabled === true;
	const trigger = config?.trigger || "onLoad";
	const title = String(config?.title || "Aviso").trim();
	const content = String(config?.content || "").trim();
	const anchor = useMemo(
		() => normalizeAnchor(String(config?.anchor || "open-popup")),
		[config?.anchor],
	);

	useEffect(() => {
		if (!enabled || !content) {
			setOpen(false);
			return;
		}

		if (trigger === "anchor") {
			const evaluate = () => {
				const hash = normalizeAnchor(window.location.hash || "");
				setOpen(Boolean(anchor) && hash === anchor);
			};

			evaluate();
			window.addEventListener("hashchange", evaluate);
			return () => window.removeEventListener("hashchange", evaluate);
		}

		const delayMs = Math.max(0, Number(config?.delaySeconds || 0) * 1000);
		const timer = window.setTimeout(() => setOpen(true), delayMs);
		return () => window.clearTimeout(timer);
	}, [enabled, trigger, anchor, content, config?.delaySeconds]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-10000 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/60"
				aria-label="Fechar popup"
				onClick={() => setOpen(false)}
			/>
			<div className="relative z-10 w-full max-w-xl rounded-xl bg-white text-gray-900 shadow-2xl">
				<button
					type="button"
					className="absolute right-3 top-3 h-8 w-8 rounded-full text-gray-500 hover:bg-gray-100"
					aria-label="Fechar"
					onClick={() => setOpen(false)}
				>
					x
				</button>
				<div className="p-6">
					<h2 className="mb-3 text-xl font-semibold">{title || "Aviso"}</h2>
					<div
						className="text-sm leading-relaxed text-gray-700"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: popup content comes from project JSON
						dangerouslySetInnerHTML={{ __html: content }}
					/>
				</div>
			</div>
		</div>
	);
}
