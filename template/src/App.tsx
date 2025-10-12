import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import landing from "@/landing.json";
import Admin from "./admin/Admin";
import { useParallaxAnimation } from "./hooks/use-parallax-animation";
import { useThemeColors } from "./hooks/use-theme-colors";
import { About } from "./modules/About";
import { Footer } from "./modules/Footer";
import { Header } from "./modules/Header";
import { Hero } from "./modules/Hero";
import { Participants } from "./modules/Participants";
import { PreviousEvents } from "./modules/PreviousEvents";
import { Schedule } from "./modules/Schedule";
import { Sponsors } from "./modules/Sponsors";
import Subscribe from "./modules/Subscribe";

function Landing() {
	const { hero, general, participants, schedule, subscribe, previousEvents } =
		landing;
	useParallaxAnimation(general.enableParallax);

	useThemeColors({
		primaryColor: general.primaryColor,
		secondaryColor: general.secondaryColor,
		darkColor: general.darkColor,
		lightColor: general.lightColor,
		backgroundColor: general.backgroundColor,
		surfaceColor: general.surfaceColor,
		textColor: general.textColor,
	});

	const backgroundStyle = hero.useBackgroundImage
		? {
				backgroundImage: "url('/public/img/project/header.webp')",
				backgroundPosition: "top",
				backgroundAttachment: "fixed",
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
			}
		: {
				backgroundColor: "var(--background)",
			};

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
				style={{
					backgroundColor: "var(--surface)",
					color: "var(--text)",
				}}
			>
				<Header />
				<Hero data-parallax />
				<About data-parallax />
				{participants?.visible && <Participants data-parallax />}
				{schedule?.visible && <Schedule data-parallax />}
				{subscribe?.visible && <Subscribe data-parallax />}
				{previousEvents?.visible && <PreviousEvents data-parallax />}
				<Sponsors data-parallax />
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
