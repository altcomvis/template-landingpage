"use client";

import { useEffect, useState } from "react";
import { SeoHead } from "@/components/seo-head";
import { useParallaxAnimation } from "@/hooks/use-parallax-animation";
import { useThemeColors } from "@/hooks/use-theme-colors";
import { About } from "@/modules/About";
import { Footer } from "@/modules/Footer";
import { Hero } from "@/modules/Hero";
import { MenuTemplate } from "@/modules/Menu";
import { Participants } from "@/modules/Participants";
import { PreviousEvents } from "@/modules/PreviousEvents";
import { Schedule } from "@/modules/Schedule";
import { Sponsors } from "@/modules/Sponsors";
import Subscribe from "@/modules/Subscribe";
import { getBasePath } from "@/utils/getBasePath";

/* ─────────────── Tipagem do Landing JSON ─────────────── */
interface LandingData {
	general: {
		enableParallax?: boolean;
		primaryColor: string;
		secondaryColor: string;
		darkColor: string;
		lightColor: string;
		backgroundColor: string;
		surfaceColor: string;
		textColor: string;
		fontBody: string;
		fontTitle: string;
		projectName: string;
	};
	hero: {
		subtitle: string;
		subtitleColor?: string;
		date: string;
		time: string;
		location: string;
		address: string;
		useLightRays?: boolean;
		lightRaysColor?: string;
		logoSize?: "grande" | "medio" | "pequeno";
		useBackgroundImage?: boolean;
	};
	about: {
		subtitle: string;
		socialTitle: string;
		paragraphs: string[];
		showTransmission: boolean;
		socialBlocks: Array<{
			id: string;
			label: string;
			icons: Array<{ id: string; icon: string; url: string }>;
		}>;
	};
	participants: {
		title: string;
		visible?: boolean;
		groups: Array<{
			id: string;
			label: string;
			participants: Array<{
				id: string;
				name: string;
				position?: string;
				photo: string;
			}>;
		}>;
	};
	schedule: {
		title: string;
		visible?: boolean;
		panels: Array<{
			id: string;
			time: string;
			title: string;
			description?: string;
			type: "simple" | "panel";
			speakers?: Array<{ id: string }>;
			mediators?: Array<{ id: string }>;
		}>;
	};
	subscribe: {
		title: string;
		description: string;
		visible: boolean;
		successMessage: string;
		formUrl?: string;
		customSelect?: {
			label: string;
			description?: string;
			selection: "radio" | "checkbox";
			visible: boolean;
			options: Array<{ id: number; label: string; visible: boolean }>;
		};
		formsConfig: {
			FORMS_URL_BASE64: string;
			QUESTION_IDS: Record<string, string>;
		};
		fields: Array<{
			id: string;
			label: string;
			visible: boolean;
		}>;
		formActive: boolean;
		formStart: string | null;
		formEnd: string | null;
		closedMessage: string;
	};
	previousEvents: {
		title: string;
		description?: string;
		visible?: boolean;
		events: Array<{
			id: string;
			date: string;
			image: string;
			title: string;
			description: string;
			ctaLabel: string;
			ctaLink: string;
		}>;
	};
	sponsors: Array<{
		id: string;
		label: string;
		items: Array<{ id: string; name: string }>;
	}>;
}

export default function Home() {
	const [landing, setLanding] = useState<LandingData | null>(null);

	// ✅ URL do JSON baseada no caminho real
	const jsonUrl = `${getBasePath()}landing.json`;
	useEffect(() => {
		const handler = (event: MessageEvent) => {
			const msg = event.data;
			if (!msg || typeof msg !== "object") return;

			if (msg.type === "UPDATE_DATA" && msg.data) {
				setLanding(msg.data); // <- aplica em tempo real
			}

			// handshake (importante pro isPreviewReady do admin)
			if (msg.type === "RELOAD_PAGE") {
				window.location.reload();
			}
		};

		window.addEventListener("message", handler);

		// avisa o admin que está pronto
		try {
			window.parent?.postMessage({ type: "PREVIEW_READY" }, "*");
		} catch {}

		return () => window.removeEventListener("message", handler);
	}, []);

	useEffect(() => {
		fetch(jsonUrl)
			.then((res) => res.json())
			.then(setLanding)
			.catch((err) => console.error("Erro ao carregar landing.json:", err));
	}, [jsonUrl]);

	// 👀 Hot-reload do JSON em dev
	useEffect(() => {
		if (process.env.NODE_ENV !== "development") return;
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
	const general = (landing?.general ?? {}) as LandingData["general"];
	const hero = (landing?.hero ?? {}) as LandingData["hero"];
	const participants = (landing?.participants ??
		{}) as LandingData["participants"];
	const schedule = (landing?.schedule ?? {}) as LandingData["schedule"];
	const subscribe = (landing?.subscribe ?? {}) as LandingData["subscribe"];
	const previousEvents = (landing?.previousEvents ??
		{}) as LandingData["previousEvents"];

	/* ────────────────────────────────── */
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
	const backgroundStyle = hero.useBackgroundImage
		? {
				backgroundImage: `url('${getBasePath()}img/hero/header.webp')`,
				backgroundPosition: "top",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
				backgroundAttachment: "fixed",
			}
		: { backgroundColor: "var(--mybackground)" };

	return (
		// biome-ignore lint: ID fixo necessário para âncoras de navegação
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
				<MenuTemplate
					logo="/public/img/hero/marca-do-projeto.webp"
					landing={landing}
				/>

				<Hero data-parallax data={hero} general={general} />
				<About data-parallax data={landing.about} />

				{participants?.visible && (
					<Participants data-parallax data={participants} />
				)}
				{schedule?.visible && (
					<Schedule data={schedule} participants={participants} data-parallax />
				)}
				{subscribe?.visible && <Subscribe data={subscribe} data-parallax />}
				{previousEvents?.visible && (
					<PreviousEvents data={previousEvents} data-parallax />
				)}
				<Sponsors data={landing.sponsors} data-parallax />
			</div>
			<Footer />
		</div>
	);
}
