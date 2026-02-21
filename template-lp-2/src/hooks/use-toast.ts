"use client";

import { toast as sonnerToast } from "sonner";

/** 🔹 Simplificação do sistema da ShadCN para ambiente Vite/React */
type ToastOptions = {
	title?: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	variant?: "default" | "destructive" | "success" | "info";
};

/** Hook de toast inspirado no padrão ShadCN, mas usando Sonner */
export function useToast() {
	const toast = ({
		title,
		description,
		actionLabel,
		onAction,
		variant = "default",
	}: ToastOptions) => {
		sonnerToast(title ?? "Atenção", {
			description,
			action: actionLabel
				? {
						label: actionLabel,
						onClick: onAction ?? (() => {}),
					}
				: undefined,
			classNames: {
				toast:
					variant === "destructive"
						? "bg-red-600 text-white"
						: variant === "success"
							? "bg-green-600 text-white"
							: variant === "info"
								? "bg-blue-600 text-white"
								: "bg-zinc-800 text-white",
			},
		});
	};

	const dismiss = sonnerToast.dismiss;

	return { toast, dismiss };
}

/** 🔹 Export para compatibilidade com padrão anterior */
export { sonnerToast as toast };
