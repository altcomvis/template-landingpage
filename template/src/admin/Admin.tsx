import { useEffect, useState } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";

import { AboutForm } from "./sections/AboutForm";
import GeneralForm from "./sections/GeneralForm";
import HeroForm from "./sections/HeroForm";
import ParticipantsForm from "./sections/ParticipantsForm";
import PreviousEventsForm from "./sections/PreviousEventsForm";
import ScheduleForm from "./sections/ScheduleForm";
import SponsorsForm from "./sections/SponsorsForm";
import SubscribeForm from "./sections/SubscribeForm";
import DownloadJson from "./utils/downloadJson";

/* ─────────────────────────────── */
/* 🔹 Tipos */
export interface Participant {
	id: string;
	name: string;
	position: string;
	photo: string;
}

export interface ParticipantGroup {
	id: string;
	label: string;
	participants: Participant[];
}

/* 🔹 Tipo unificado */
export interface LandingData {
	general: {
		projectName: string;
		primaryColor: string;
		secondaryColor: string;
		darkColor: string;
		lightColor: string;
		backgroundColor: string;
		surfaceColor: string;
		textColor: string;
		fontBody?: string;
		fontTitle?: string;
		enableParallax?: boolean;
		backgroundMode: "solid" | "primary" | "secondary" | "dark" | "mylight";
		menu: { id: string; label: string; href: string; visible: boolean }[];
		seoTitle?: string;
		seoDescription?: string;
		seoKeywords?: string;

		seoUrl?: string;
		googleAnalyticsId?: string;
		directoryName?: string;
		pixelMeta?: string;
	};
	hero: {
		logo: string;
		subtitle: string;
		date: string;
		time: string;
		location: string;
		address: string;
		useBackgroundImage: boolean;
		useLightRays?: boolean;
		lightRaysColor?: string;
	};
	about: {
		subtitle: string;
		socialTitle: string;
		paragraphs: string[];
		showTransmission: boolean;
		socialBlocks: {
			id: string;
			label: string;
			icons: { id: string; icon: string; url: string }[];
		}[];
	};
	participants: {
		title: string;
		visible: boolean;
		groups: ParticipantGroup[];
	};
	schedule: {
		title: string;
		visible: boolean;
		panels: {
			id: string;
			time: string;
			title: string;
			type: "simple" | "panel";
			description?: string;
			speakers: Participant[];
			mediators: Participant[];
		}[];
	};
	previousEvents: {
		title: string;
		description: string;
		visible: boolean;
		events: {
			id: string;
			date: string;
			image: string;
			title: string;
			description: string;
			ctaLabel: string;
			ctaLink: string;
		}[];
	};
	sponsors: {
		id: string;
		label: string;
		items: { id: string; name: string }[];
	}[];
	subscribe: {
		title: string;
		description: string;
		visible: boolean;
		successTitle: string;
		successMessage: string;
		formUrl: string;
		formsConfig: {
			FORMS_URL_BASE64: string;
			QUESTION_IDS: Record<string, string>;
		};
		fields: { id: string; label: string; visible: boolean }[];
	};
}

/* ─────────────────────────────── */
/* 🔹 Estado inicial */
const initialData: LandingData = {
	general: {
		projectName: "",
		primaryColor: "#000000",
		secondaryColor: "#FFFFFF",
		darkColor: "#222222",
		lightColor: "#F5F5F5",
		backgroundColor: "#EAEAEA",
		surfaceColor: "#FFFFFF",
		textColor: "#222222",
		fontBody: "Poppins",
		fontTitle: "Poppins",
		enableParallax: true,
		backgroundMode: "solid",
		menu: [
			{ id: "1", label: "Início", href: "home", visible: true },
			{ id: "2", label: "Participantes", href: "participants", visible: true },
			{ id: "3", label: "Programação", href: "schedule", visible: true },
			{ id: "4", label: "Inscrição", href: "subscribe", visible: true },
			{
				id: "5",
				label: "Edições Anteriores",
				href: "previous-editions",
				visible: true,
			},
		],
	},
	hero: {
		logo: "",
		subtitle: "",
		date: "",
		time: "",
		location: "",
		address: "",
		useBackgroundImage: false,
		useLightRays: false,
		lightRaysColor: "#ffffff",
	},
	about: {
		subtitle: "",
		socialTitle: "",
		paragraphs: [""],
		showTransmission: true,
		socialBlocks: [
			{
				id: "block-1",
				label: "Transmissão Oficial",
				icons: [
					{ id: "yt", icon: "youtube", url: "https://youtube.com/oglobo" },
					{ id: "tw", icon: "twitter", url: "https://twitter.com/oglobo" },
				],
			},
		],
	},
	participants: { title: "Participantes", visible: true, groups: [] },
	schedule: { title: "Programação", visible: true, panels: [] },
	previousEvents: {
		title: "Edições Anteriores",
		description: "",
		visible: true,
		events: [],
	},
	sponsors: [],
	subscribe: {
		title: "Inscrição",
		visible: true,
		description: "Preencha o formulário para participar.",
		successTitle: "Inscrição enviada!",
		successMessage:
			"Obrigado pela sua inscrição. Em breve entraremos em contato.",
		formUrl: "",
		formsConfig: { FORMS_URL_BASE64: "", QUESTION_IDS: {} },
		fields: [],
	},
};

/* ─────────────────────────────── */
/* 🔹 Função auxiliar: buscar Google Fonts API e salvar cache local */
async function fetchGoogleFonts() {
	const cached = localStorage.getItem("google-fonts-cache");
	if (cached) return JSON.parse(cached);

	try {
		const response = await fetch(
			`https://www.googleapis.com/webfonts/v1/webfonts?sort=alpha&key=AIzaSyBmTavdGKBb1WlbciUyU1OwcHV9nNuqfdo`,
		);
		const data = await response.json();
		type GoogleFont = { family: string };
		const fonts = data.items.map((f: GoogleFont) => f.family);
		localStorage.setItem("google-fonts-cache", JSON.stringify(fonts));
		return fonts;
	} catch (err) {
		console.warn("Erro ao carregar Google Fonts:", err);
		return ["Poppins", "Roboto", "Inter", "Open Sans", "Montserrat"];
	}
}

/* ─────────────────────────────── */
/* 🔹 Componente principal */
export default function Admin() {
	const [data, setData] = useState<LandingData>(initialData);
	const [activeSection, setActiveSection] = useState("general");
	const [googleFonts, setGoogleFonts] = useState<string[]>([]);

	/* 🔹 Carrega todas as fontes na inicialização */
	useEffect(() => {
		fetchGoogleFonts().then(setGoogleFonts);
	}, []);

	/* 🔹 Atualiza dados */
	const handleSetData = (newData: Record<string, unknown>) => {
		setData((prev) => ({ ...prev, ...newData }));
	};

	/* 🔹 Menu lateral baseado na visibilidade */
	const menuItems = [
		{ id: "general", label: "Geral", alwaysVisible: true },
		{ id: "hero", label: "Hero", alwaysVisible: true },
		{ id: "about", label: "Sobre", alwaysVisible: true },
		{
			id: "participants",
			label: "Participantes",
			visible: data.participants?.visible,
		},
		{ id: "schedule", label: "Programação", visible: data.schedule?.visible },
		{ id: "subscribe", label: "Inscrição", visible: data.subscribe?.visible },
		{
			id: "previous",
			label: "Edições Anteriores",
			visible: data.previousEvents?.visible,
		},
		{ id: "sponsors", label: "Patrocínios", alwaysVisible: true },
	];

	return (
		<SidebarProvider>
			<div className="flex min-h-screen w-full bg-zinc-200">
				{/* Sidebar */}
				<Sidebar className="w-64 border-r">
					<SidebarHeader>
						<div className="flex flex-col items-center py-4">
							<img
								src="../../public/img/project/logo-editora-globo-negocios.svg"
								alt="Logo"
								className="w-32"
							/>
						</div>
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{menuItems.map((item) => {
										const isDisabled = item.visible === false;
										return (
											<SidebarMenuItem key={item.id}>
												<SidebarMenuButton
													className={`font-medium md:text-base hover:bg-slate-200 transition ${
														isDisabled ? "opacity-50 cursor-default" : ""
													}`}
													isActive={activeSection === item.id}
													onClick={() => setActiveSection(item.id)}
												>
													{item.label}
													{isDisabled && (
														<span className="ml-2 text-xs text-zinc-400">
															(oculta)
														</span>
													)}
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>

					<SidebarFooter>
						<DownloadJson
							data={data}
							setData={setData}
							initialData={initialData}
						/>
					</SidebarFooter>
				</Sidebar>

				{/* Conteúdo principal */}
				<main className="flex-1 p-10 overflow-y-auto">
					<SidebarTrigger className="md:hidden block absolute top-2 left-2 z-50" />
					<h1 className="text-xl md:text-2xl font-bold text-zinc-600 mb-10 text-center">
						Painel de Edição da Landing
					</h1>

					{activeSection === "general" && (
						<GeneralForm
							data={data}
							setData={handleSetData}
							googleFonts={googleFonts}
						/>
					)}
					{activeSection === "hero" && (
						<HeroForm data={data} setData={handleSetData} />
					)}
					{activeSection === "about" && (
						<AboutForm data={data} setData={handleSetData} />
					)}
					{activeSection === "participants" && (
						<ParticipantsForm data={data} setData={handleSetData} />
					)}
					{activeSection === "schedule" && (
						<ScheduleForm data={data} setData={handleSetData} />
					)}
					{activeSection === "subscribe" && (
						<SubscribeForm data={data} setData={handleSetData} />
					)}
					{activeSection === "previous" && (
						<PreviousEventsForm data={data} setData={handleSetData} />
					)}
					{activeSection === "sponsors" && (
						<SponsorsForm data={data} setData={handleSetData} />
					)}
				</main>
			</div>
		</SidebarProvider>
	);
}
