import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { MenuTemplate } from "@/modules/Menu";
import Admin from "./admin/Admin";
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

function Landing() {
	const [landing, setLanding] = useState<any>(null);

	// Nunca desestruture direto

	const general = landing?.general || {};
	const hero = landing?.hero || {};
	const participants = landing?.participants || {};
	const schedule = landing?.schedule || {};
	const subscribe = landing?.subscribe || {};
	const previousEvents = landing?.previousEvents || {};

	// ✅ Hooks SEMPRE chamados
	useParallaxAnimation(!!general.enableParallax);

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

	// Carrega JSON
	useEffect(() => {
		fetch("/landing.json")
			.then((res) => res.json())
			.then(setLanding)
			.catch((err) => console.error("Erro ao carregar landing.json:", err));
	}, []);
	// 👀 Recarrega automaticamente se o JSON for alterado
	useEffect(() => {
		let lastContent = "";

		const checkForUpdates = async () => {
			try {
				const res = await fetch(`/landing.json?t=${Date.now()}`); // força cache-busting
				const text = await res.text();

				// se o conteúdo mudou → recarrega a página
				if (lastContent && text !== lastContent) {
					console.log("🔁 landing.json alterado — recarregando página...");
					window.location.reload();
				}

				lastContent = text;
			} catch (err) {
				console.warn("Erro ao verificar atualizações do JSON:", err);
			}
		};

		// verifica a cada 3 segundos
		const interval = setInterval(checkForUpdates, 3000);

		return () => clearInterval(interval);
	}, []);
	// Você pode renderizar um "skeleton" SEM sair antes dos hooks
	if (!landing) {
		return (
			<div
				className="w-full min-h-screen flex items-center justify-center"
				style={{ fontFamily: "var(--font-family), sans-serif" }}
			>
				<p className="text-center">Carregando...</p>
			</div>
		);
	}

	const backgroundStyle = hero.useBackgroundImage
		? {
				backgroundImage: "url('/public/img/project/header.webp')",
				backgroundPosition: "top",
				backgroundAttachment: "fixed",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
			}
		: { backgroundColor: "var(--background)" };

	return (
		<div
			className="w-full min-h-screen transition-colors duration-500 md:pt-6"
			style={{
				...backgroundStyle,
				fontFamily: "var(--font-family), sans-serif",
			}}
			id="home"
		>
			<div
				className="w-full md:w-10/12 mx-auto md:rounded-2xl shadow-2xl md:px-10 transition-colors duration-500"
				style={{ backgroundColor: "var(--surface)", color: "var(--text)" }}
			>
				<SeoHead />
				<MenuTemplate
					logo="/public/img/project/marca-do-projeto.webp"
					menuItems={landing.general.menu}
				/>
				{/* remova o ";" que estava depois do componente */}
				<Hero data-parallax data={landing.hero} general={landing.general} />
				<About data-parallax data={landing.about} />
				{participants?.visible && (
					<Participants data-parallax data={landing.participants} />
				)}
				{schedule?.visible && (
					<Schedule
						data={landing.schedule}
						participants={landing.participants}
						data-parallax
					/>
				)}
				{subscribe?.visible && (
					<Subscribe data={landing.subscribe} data-parallax />
				)}
				{previousEvents?.visible && (
					<PreviousEvents data={landing.previousEvents} data-parallax />
				)}
				<Sponsors data={landing.sponsors} data-parallax />
			</div>
			<Footer />
		</div>
	);
}

function AdminPage() {
	return <Admin />;
}

export default function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Landing />} />
				<Route path="/admin" element={<AdminPage />} />
			</Routes>
		</Router>
	);
}
