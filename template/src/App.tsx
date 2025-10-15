import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MenuTemplate } from "@/modules/Menu";
import { getBasePath } from "@/utils/getBasePath";
import Admin from "./admin/Admin";
import { SeoHead } from "./components/seo-head";
import { Toaster } from "./components/ui/sonner";
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
/* 🧩 LANDING PAGE PRINCIPAL */
function Landing() {
	const [landing, setLanding] = useState<any>(null);

	// ✅ URL do JSON baseada no caminho real
	const jsonUrl = `${getBasePath()}landing.json`;

	useEffect(() => {
		fetch(jsonUrl)
			.then((res) => res.json())
			.then(setLanding)
			.catch((err) => console.error("Erro ao carregar landing.json:", err));
	}, [jsonUrl]);

	// 👀 Hot-reload do JSON em dev
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
	const backgroundStyle = hero.useBackgroundImage
		? {
				backgroundImage: `url('${getBasePath()}img/project/header.webp')`,
				backgroundPosition: "top",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
			}
		: { backgroundColor: "var(--background)" };

	/* ──────────────────────────────── */
	/* 🧠 Render principal */
	return (
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
					logo={`${getBasePath()}img/project/marca-do-projeto.webp`}
					menuItems={general.menu}
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

/* ──────────────────────────────── */
/* 🛠️ Página do Admin */
function AdminPage() {
	return <Admin />;
}

/* ──────────────────────────────── */
/* 🌍 APP PRINCIPAL */
export default function App() {
	const [basePath, setBasePath] = useState<string | null>(null);

	useEffect(() => {
		const loadBase = async () => {
			try {
				// Pega o JSON no mesmo diretório da LP
				const jsonUrl =
					import.meta.env.MODE === "production"
						? `${window.location.pathname.replace(/\/$/, "")}/landing.json`
						: "/landing.json";

				const res = await fetch(jsonUrl);
				const data = await res.json();

				const dir = data?.general?.directoryName || "template-landing-page";
				const base =
					import.meta.env.MODE === "production" ? `/projetos/${dir}/` : "/";

				console.log("🧭 BasePath confirmado:", base);
				setBasePath(base);
			} catch (err) {
				console.warn("⚠️ Falha ao carregar basePath:", err);
				setBasePath("/");
			}
		};

		loadBase();
	}, []);

	// 🚧 Enquanto o basePath ainda não está definido, não renderiza o Router
	if (basePath === null) {
		return (
			<div className="w-full min-h-screen flex items-center justify-center">
				<p>Inicializando aplicação...</p>
			</div>
		);
	}

	// ✅ Só monta o Router quando o basePath já estiver pronto
	return (
	
			<>
			<Router basename={basePath}>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/admin" element={<AdminPage />} />
				</Routes>
			</Router>

			<Toaster richColors position="top-center" /></>
	);
}
