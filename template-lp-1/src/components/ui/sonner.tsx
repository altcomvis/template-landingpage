// src/components/ui/sonner.tsx

import type { ToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

/** Toaster único do app (sem next-themes) */
export function Toaster(props: ToasterProps) {
	return (
		<Sonner
			richColors
			closeButton
			duration={4000}
			toastOptions={{ classNames: { toast: "rounded-lg" } }}
			{...props}
		/>
	);
}
