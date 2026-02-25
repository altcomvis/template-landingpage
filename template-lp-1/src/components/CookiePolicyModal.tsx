import { useEffect, useState } from "react";

interface CookiePolicyModalProps {
	text?: string;
	title?: string;
}

const STORAGE_KEY = "cookie_policy_consent_v1";

function isInIframe(): boolean {
	try {
		return window.self !== window.top;
	} catch {
		return true;
	}
}

export function CookiePolicyModal({
	text,
	title = "Política de Cookies",
}: CookiePolicyModalProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		const message = String(text || "").trim();
		if (!message) {
			setOpen(false);
			return;
		}

		if (typeof window === "undefined") return;
		if (isInIframe()) return;

		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored) return;
		} catch {
			// ignore
		}

		setOpen(true);
	}, [text]);

	const save = (value: "accepted" | "rejected") => {
		try {
			window.localStorage.setItem(STORAGE_KEY, value);
		} catch {
			// ignore
		}
		setOpen(false);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-black/70"
				aria-hidden="true"
				onClick={() => save("accepted")}
			/>
			<div className="relative w-full max-w-lg rounded-xl bg-white text-gray-900 shadow-2xl">
				<div className="p-5 space-y-3">
					<h2 className="text-lg font-semibold">{title}</h2>
					<div
						className="text-sm text-gray-700 leading-relaxed"
						// biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
						dangerouslySetInnerHTML={{ __html: String(text || "") }}
					/>
					<div className="pt-2 flex flex-wrap gap-2 justify-end">
						<button
							type="button"
							className="px-3 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-50"
							onClick={() => save("rejected")}
						>
							Recusar
						</button>
						<button
							type="button"
							className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white hover:bg-gray-800"
							onClick={() => save("accepted")}
						>
							Aceitar
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
