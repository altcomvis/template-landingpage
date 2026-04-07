import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTrigger,
} from "@/components/ui/sheet";

type SectionConfig = { visible?: boolean; iframeUrl?: string; title?: string };

interface MenuTemplateLanding {
	hero?: { logo?: string };
	general?: { directoryName?: string };
	about?: SectionConfig;
	participants?: SectionConfig;
	schedule?: SectionConfig;
	agenda?: SectionConfig;
	editorialCoverage?: SectionConfig;
	provisionalSubscribe?: SectionConfig;
	subscribe?: SectionConfig;
	previousEvents?: SectionConfig;
}

interface MenuTemplateProps {
	landing: MenuTemplateLanding;
	sectionOrder?: string[];
}

export function MenuTemplate({ landing, sectionOrder }: MenuTemplateProps) {
	const [open, setOpen] = useState(false);
	const [isFixed, setIsFixed] = useState(false);

	useEffect(() => {
		const handleScroll = () => setIsFixed(window.scrollY > 10);
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const sectionMenuMap: Record<
		string,
		{ id: string; label: string; visible: boolean }
	> = {
		about: {
			id: "about",
			label: landing.about?.title || "Sobre",
			visible: landing.about?.visible !== false,
		},
		participants: {
			id: "speakers",
			label: landing.participants?.title || "Participantes",
			visible: landing.participants?.visible !== false,
		},
		schedule: {
			id: "schedule",
			label: "Programação",
			visible: landing.schedule?.visible !== false,
		},
		agenda: {
			id: "agenda",
			label: landing.agenda?.title || "Agenda",
			visible: landing.agenda?.visible === true,
		},
		editorialCoverage: {
			id: "editorial-coverage",
			label: landing.editorialCoverage?.title || "Cobertura Editorial",
			visible: landing.editorialCoverage?.visible !== false,
		},
		provisionalSubscribe: {
			id: "provisional-subscribe",
			label: landing.provisionalSubscribe?.title || "Inscrição",
			visible:
				landing.provisionalSubscribe?.visible !== false &&
				Boolean(landing.provisionalSubscribe?.iframeUrl),
		},
		subscribe: {
			id: "subscribe",
			label: landing.subscribe?.title || "Inscrição",
			visible: landing.subscribe?.visible !== false,
		},
		previousEvents: {
			id: "previous-events",
			label: landing.previousEvents?.title || "Edições Anteriores",
			visible: landing.previousEvents?.visible !== false,
		},
	};

	const defaultSectionOrder = [
		"about",
		"participants",
		"schedule",
		"agenda",
		"editorialCoverage",
		"provisionalSubscribe",
		"subscribe",
		"previousEvents",
	];

	const normalizedSectionOrder = (sectionOrder || defaultSectionOrder)
		.map((id) => (id === "previous" ? "previousEvents" : id))
		.filter((id) => id !== "hero" && id !== "sponsors");

	const seen = new Set<string>();
	const orderedItems = normalizedSectionOrder
		.map((sectionId) => sectionMenuMap[sectionId])
		.filter((item) => !!item && item.visible)
		.filter((item) => {
			if (seen.has(item.id)) return false;
			seen.add(item.id);
			return true;
		});

	const menuItems = [{ id: "home", label: "Início" }, ...orderedItems];

	return (
		<div
			className={`md:w-full md:flex md:justify-center ${
				isFixed ? "md:pt-14" : "pt-0"
			}`}
		>
			<header
				className={`md:rounded-full md:px-12 z-50 transition-all duration-300 ${
					isFixed
						? "fixed md:top-3 md:bg-white/75 md:backdrop-blur-lg md:shadow-lg md:border border-zinc-500"
						: "relative border-zinc-500"
				}`}
			>
				<div
					className={`container mx-auto px-4 md:py-3 flex md:justify-center items-center transition-all duration-500 ${
						isFixed ? "md:py-2 text-zinc-700" : "md:py-2 text-(--text)"
					}`}
				>
					{/* Menu Desktop */}
					<nav className="hidden md:flex gap-6 text-base font-medium">
						{menuItems.map(({ id, label }) => (
							<ScrollLink
								key={id}
								to={id}
								smooth
								duration={600}
								offset={-80}
								className="group relative cursor-pointer transition-all duration-300"
							>
								<span className="transition-all duration-200 group-hover:scale-105 group-hover:opacity-90">
									{label}
								</span>
								<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-(--light) transition-all duration-300 group-hover:w-full" />
							</ScrollLink>
						))}
					</nav>

					{/* Menu Mobile */}
					<div className="md:hidden absolute top-4 left-4">
						<Sheet open={open} onOpenChange={setOpen}>
							<SheetTrigger asChild>
								<Button
									variant="outline"
									className="bg-zinc-200 shadow-lg border"
									size="icon"
								>
									<Menu className="text-zinc-500" />
								</Button>
							</SheetTrigger>

							<SheetContent
								side="top"
								className="p-6 bg-zinc-700/90 backdrop-blur-md text-zinc-100 h-screen border-none"
							>
								<SheetHeader className="p-0 w-full">
									<SheetDescription className="p-0">
										<span className="flex flex-col gap-6 font-medium text-2xl mt-8 text-center justify-center items-center py-4">
											{menuItems.map(({ id, label }) => (
												<ScrollLink
													key={id}
													to={id}
													smooth
													duration={600}
													offset={-80}
													className="cursor-pointer text-zinc-300"
													onClick={() => setOpen(false)}
												>
													{label}
												</ScrollLink>
											))}
										</span>
									</SheetDescription>
								</SheetHeader>
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</header>
		</div>
	);
}
