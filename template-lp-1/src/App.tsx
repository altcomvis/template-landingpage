import { useEffect, useState } from "react";
import { resolveAssetUrl } from "@/config/s3-urls";
import { MenuTemplate } from "@/modules/Menu";

import { CookiePolicyModal } from "./components/CookiePolicyModal";
import { SeoHead } from "./components/seo-head";
import { useParallaxAnimation } from "./hooks/use-parallax-animation";
import { useThemeColors } from "./hooks/use-theme-colors";
import { About } from "./modules/About";
import { Footer } from "./modules/Footer";
import { Hero } from "./modules/Hero";
import { Participants } from "./modules/Participants";
import { PreviousEvents } from "./modules/PreviousEvents";
import { ProvisionalSubscribe } from "./modules/ProvisionalSubscribe";
import { Schedule } from "./modules/Schedule";
import { Sponsors } from "./modules/Sponsors";
import Subscribe from "./modules/Subscribe";

function extractFilename(value: unknown): string {
	const raw = String(value || "").trim();
	if (!raw) return "";
	const withoutQuery = raw.split("?")[0]?.split("#")[0] || raw;
	const normalized = withoutQuery.replace(/\\/g, "/");
	return (normalized.split("/").pop() || "").trim();
}

/* ──────────────────────────────── */
/* 🌍 APP PRINCIPAL - Sem Router */
export default function App() {
	// biome-ignore lint/suspicious/noExplicitAny: dynamic JSON data
	const [landing, setLanding] = useState<any>(null);

	// � Escutar mensagens do admin para atualização em tempo real
	useEffect(() => {
		let isCancelled = false;

		const handleMessage = (event: MessageEvent) => {
			const isDev = Boolean(import.meta.env.DEV);
			const isSameOrigin = event.origin === window.location.origin;
			const isFromParent = event.source === window.parent;
			const isTrustedDevOrigin =
				isDev &&
				/^(https?:\/\/)(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?$/.test(
					event.origin,
				);
			if (!isFromParent && !isSameOrigin && !isTrustedDevOrigin) return;

			const message = event.data;

			// Atualizar dados quando receber UPDATE_DATA do admi	n
			if (message.type === "UPDATE_DATA" && message.data) {
				setLanding(message.data);
			}
		};

		window.addEventListener("message", handleMessage);
		try {
			window.parent?.postMessage({ type: "PREVIEW_READY" }, "*");
		} catch {
			// ignore
		}

		const isStandalone = window.self === window.top;
		const isBlobLike =
			window.location?.protocol === "blob:" ||
			String(window.location?.href || "").includes("blob:");
		const canAutoLoadLocalJson = isStandalone && !isBlobLike;

		if (canAutoLoadLocalJson) {
			const localJsonUrl = String(
				import.meta.env.VITE_PROJECT_JSON_URL ||
					`${import.meta.env.BASE_URL}landing.json`,
			);
			void (async () => {
				try {
					const response = await fetch(localJsonUrl, { cache: "no-store" });
					if (!response.ok) {
						throw new Error(
							`Failed to fetch ${localJsonUrl}: ${response.status}`,
						);
					}
					const data = await response.json();
					if (!isCancelled) setLanding(data);
				} catch (error) {
					console.warn(
						"[landing] Standalone: could not auto-load local project JSON.",
						error,
					);
				}
			})();
		}

		return () => {
			isCancelled = true;
			window.removeEventListener("message", handleMessage);
		};
	}, []);

	/* ──────────────────────────────── */
	/* 🔹 Desestruturações seguras (sempre definidas) */
	const general = landing?.general ?? {};
	const hero = landing?.hero ?? {};
	const participants = landing?.participants ?? {};
	const schedule = landing?.schedule ?? {};
	const subscribe = landing?.subscribe ?? {};
	const provisionalSubscribe = landing?.provisionalSubscribe ?? {};
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
	const heroBackgroundFilename = extractFilename(hero?.backgroundUrl);
	const heroBackgroundSource = heroBackgroundFilename
		? `img/hero/${heroBackgroundFilename}`
		: "img/hero/header.webp";
	const backgroundStyle =
		general.useBackgroundImage !== false
			? {
					backgroundImage: `url('${resolveAssetUrl(heroBackgroundSource, directoryName)}')`,
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
					<SeoHead seo={general} />
					<CookiePolicyModal text={general?.cookiePolicyText} />
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
					{provisionalSubscribe?.visible && provisionalSubscribe?.iframeUrl && (
						<ProvisionalSubscribe data={provisionalSubscribe} data-parallax />
					)}
					{subscribe?.visible && <Subscribe data={subscribe} data-parallax />}
					{previousEvents?.visible && (
						<PreviousEvents data={previousEvents} data-parallax />
					)}
					<Sponsors
						data={landing.sponsors}
						showDividerLine={landing.sponsorsShowDividerLine}
						general={general}
						data-parallax
					/>
				</div>
				<Footer />
			</div>
		</>
	);
}
