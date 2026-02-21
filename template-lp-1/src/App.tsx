import { useEffect, useState } from "react";
import { MenuTemplate } from "@/modules/Menu";
import { resolveAssetUrl } from "@/config/s3-urls";
import { getBasePath } from "@/utils/getBasePath";

import { SeoHead } from "./components/seo-head";
import { useParallaxAnimation } from "./hooks/use-parallax-animation";
import { useThemeColors } from "./hooks/use-theme-colors";
import { About } from "./modules/About";
import { Footer } from "./modules/Footer";
import { Hero } from "./modules/Hero";
import { Participants } from "./modules/Participants";
import { PreviousEvents } from "./modules/PreviousEvents";
import { Schedule } from "./modules/Schedule";
import { Sponsors } from "./modules/Sponsors";
import Subscribe from "./modules/Subscribe";

/* ──────────────────────────────── */
/* 🌍 APP PRINCIPAL - Sem Router */
export default function App() {
	// biome-ignore lint/suspicious/noExplicitAny: dynamic JSON data
	const [landing, setLanding] = useState<any>(null);
	// ✅ URL do JSON baseada no caminho real
	const jsonUrl = `${getBasePath()}landing.json`;

	useEffect(() => {
		fetch(jsonUrl)
			.then((res) => res.json())
			.then(setLanding)
			.catch((err) => console.error("Erro ao carregar landing.json:", err));
	}, [jsonUrl]);

	// � Escutar mensagens do admin para atualização em tempo real
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			// Validar origem (localhost para dev/admin)
			if (!event.origin.includes("localhost")) {
				return;
			}

			const message = event.data;

			// Atualizar dados quando receber UPDATE_DATA do admi	n
			if (message.type === "UPDATE_DATA" && message.data) {
				console.log("📨 Dados atualizados recebidos do admin:", message.data);
				setLanding(message.data);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, []);

	// �👀 Hot-reload do JSON em dev
	useEffect(() => {
		if (import.meta.env.MODE !== "development") return;
		let lastContent = "";

		const checkForUpdates = async () => {
			try {
				const res = await fetch(`${jsonUrl}?t=${Date.now()}`);
				const text = await res.text();
				if (lastContent && text !== lastContent) {
					console.log("🔁 landing.json alterado — recarregando...");
					window.location.reload();
				}
				lastContent = text;
			} catch {
				/* ignore */
			}
		};

		const interval = setInterval(checkForUpdates, 3000);
		return () => clearInterval(interval);
	}, [jsonUrl]);

	/* ──────────────────────────────── */
	/* 🔹 Desestruturações seguras (sempre definidas) */
	const general = landing?.general ?? {};
	const hero = landing?.hero ?? {};
	const participants = landing?.participants ?? {};
	const schedule = landing?.schedule ?? {};
	const subscribe = landing?.subscribe ?? {};
	const previousEvents = landing?.previousEvents ?? {};

	/* ──────────────────────────────── */
	/* 🎨 Hooks visuais — SEMPRE chamados */
	const parallaxEnabled = Boolean(general.enableParallax);
	useParallaxAnimation(parallaxEnabled);

	useThemeColors({
		primaryColor: general.primaryColor,
		secondaryColor: general.secondaryColor,
		darkColor: general.darkColor,
		lightColor: general.lightColor,
		backgroundColor: general.backgroundColor,
		surfaceColor: general.surfaceColor,
		textColor: general.textColor,
		fontBody: general.fontBody,
		fontTitle: general.fontTitle,
	});

	/* ──────────────────────────────── */
	/* 🕓 Skeleton de carregamento (depois dos hooks) */
	if (!landing) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<p>Carregando...</p>
			</div>
		);
	}

	/* ──────────────────────────────── */
	/* 🖼️ Background dinâmico */
	const directoryName = (general as { directoryName?: string })?.directoryName;
	const backgroundStyle = general.useBackgroundImage
		? {
				backgroundImage: `url('${resolveAssetUrl("img/hero/header.webp", directoryName)}')`,
				backgroundPosition: "top",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundAttachment: "fixed",
			}
		: { backgroundColor: "var(--mybackground)" };

	/* ──────────────────────────────── */
	/* 🧠 Render principal */
	return (
		<>
			{/* biome-ignore lint/nursery/useUniqueElementIds: required for anchor navigation */}
			<div
				id="home"
				className="w-full min-h-screen transition-colors duration-500 md:pt-6"
				style={{
					...backgroundStyle,
					fontFamily: "var(--font-family), sans-serif",
				}}
			>
				<div
					className="w-full md:w-10/12 mx-auto md:rounded-2xl shadow-2xl md:px-10 transition-colors duration-500"
					style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
				>
					<SeoHead />
					<MenuTemplate landing={landing} />

					<Hero data-parallax data={hero} general={general} />
					<About data-parallax data={landing.about} />

					{participants?.visible && (
						<Participants data-parallax data={participants} />
					)}
					{schedule?.visible && (
						<Schedule
							data={schedule}
							participants={participants}
							data-parallax
						/>
					)}
					{subscribe?.visible && <Subscribe data={subscribe} data-parallax />}
					{previousEvents?.visible && (
						<PreviousEvents data={previousEvents} data-parallax />
					)}
					<Sponsors data={landing.sponsors} data-parallax />
				</div>
				<Footer />
			</div>
		</>
	);
}
