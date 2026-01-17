"use client";

import { useEffect, useState } from "react";

// TODO: Criar tipo LandingData no template
// biome-ignore lint/suspicious/noExplicitAny: Waiting for shared types definition
type LandingData = any;

// Placeholder para o tipo correto - ajustar conforme necessário
type PreviewMessage = {
	type: "UPDATE_DATA" | "PREVIEW_READY";
	data?: LandingData;
};

export default function PreviewPage() {
	const [data, setData] = useState<LandingData | null>(null);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		// Notificar o admin que o preview está pronto
		const notifyReady = () => {
			if (window.parent && window.parent !== window) {
				const message: PreviewMessage = {
					type: "PREVIEW_READY",
				};
				window.parent.postMessage(message, "*");
				console.log("✅ Preview ready, notified parent");
			}
		};

		// Escutar mensagens do admin
		const handleMessage = (event: MessageEvent) => {
			// Em produção, validar origin
			// if (!event.origin.includes("localhost")) return;

			const message = event.data as PreviewMessage;

			if (message.type === "UPDATE_DATA" && message.data) {
				console.log("📥 Received data from admin:", message.data);
				setData(message.data);
			}
		};

		window.addEventListener("message", handleMessage);

		// Esperar um pouco para garantir que o parent está pronto
		setTimeout(notifyReady, 500);
		setIsReady(true);

		return () => {
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	if (!isReady) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
					<p>Inicializando preview...</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-center">
					<p className="text-lg mb-2">Aguardando dados...</p>
					<p className="text-sm text-muted-foreground">
						O preview está pronto para receber o landing.json
					</p>
				</div>
			</div>
		);
	}

	// TODO: Renderizar a landing page usando os dados recebidos
	// Importar e usar os componentes da landing page aqui
	return (
		<div className="min-h-screen">
			<pre className="p-4 bg-gray-100 overflow-auto">
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
}
