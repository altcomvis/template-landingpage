import { useEffect, useMemo, useState } from "react";
import { ParticipantDialog } from "@/components/participant-dialog";
import { TitleSection } from "@/components/title-sections";
import type { CarouselApi } from "@/components/ui/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getBasePath } from "@/utils/getBasePath";

type Participant = {
	name: string;
	position?: string;
	photo: string;
};

type ParticipantGroup = {
	id: string;
	label: string;
	participants: Participant[];
};

interface ParticipantsProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title: string;
		groups: ParticipantGroup[];
	};
}

/**
 * Participants Section — adaptado ao novo padrão
 * - Recebe os dados via props (`data`)
 * - Mantém compatibilidade com o layout atual
 * - Remove dependência direta do JSON de conteúdo
 */
export function Participants({ data, ...props }: ParticipantsProps) {
	const participants = data.groups.flatMap((group) => group.participants);

	const [api, setApi] = useState<CarouselApi | null>(null);

	const coverflowConfig = useMemo(
		() => ({
			maxScale: 1.1,
			minScale: 0.9,
			maxZ: 140,
			fade: 0,
		}),
		[],
	);

	useEffect(() => {
		if (!api) return;

		let raf = 0;
		const update = () => {
			const root = api.rootNode?.() as HTMLElement | undefined;
			if (!root) return;

			const viewportRect = root.getBoundingClientRect();
			const viewportCenter = viewportRect.left + viewportRect.width / 2;

			const slides = (api.slideNodes?.() as HTMLElement[]) || [];
			for (const slide of slides) {
				const el = slide.querySelector(
					"[data-coverflow-el]",
				) as HTMLElement | null;
				if (!el) continue;

				const rect = slide.getBoundingClientRect();
				const slideCenter = rect.left + rect.width / 2;
				const distancePx = slideCenter - viewportCenter;
				// Normalize by slide width (not viewport) so neighbors shrink more.
				const distance = distancePx / Math.max(1, rect.width);
				const abs = Math.min(1, Math.abs(distance));
				const eased = abs ** 0.85;

				const scale = Math.max(
					coverflowConfig.minScale,
					coverflowConfig.maxScale -
						eased * (coverflowConfig.maxScale - coverflowConfig.minScale),
				);
				const translateZ = (1 - eased) * coverflowConfig.maxZ;
				const opacity = Math.max(1 - eased * coverflowConfig.fade, 0.35);

				el.style.transform = `translateZ(${translateZ}px) scale(${scale})`;
				el.style.opacity = String(opacity);
				el.style.zIndex = String(Math.round((1 - eased) * 100));
			}
		};

		const schedule = () => {
			cancelAnimationFrame(raf);
			raf = requestAnimationFrame(update);
		};

		update();
		api.on?.("scroll", schedule);
		api.on?.("select", schedule);
		api.on?.("reInit", schedule);

		const onResize = () => schedule();
		window.addEventListener("resize", onResize);

		return () => {
			cancelAnimationFrame(raf);
			window.removeEventListener("resize", onResize);
			api.off?.("scroll", schedule);
			api.off?.("select", schedule);
			api.off?.("reInit", schedule);
		};
	}, [api, coverflowConfig]);

	return (
		/* biome-ignore lint/nursery/useUniqueElementIds: required for anchor navigation */
		<section id="speakers" className="relative">
			<TitleSection name={data.title || "Participantes"} />

			<div
				className="container w-full px-4 md:px-14 mx-auto py-8 relative overflow-x-hidden overflow-y-visible"
				{...props}
			>
				<Carousel
					className="w-full max-w-6xl mx-auto z-10 relative perspective-distant"
					setApi={setApi}
					opts={{ loop: true, align: "center" }}
				>
					<CarouselContent className="items-start">
						{participants.map((p) => (
							<CarouselItem
								key={p.name}
								className="basis-full sm:basis-1/2 md:basis-1/5 px-2 pt-0 py-6 flex justify-center items-start"
							>
								<ParticipantDialog
									name={p.name}
									position={p.position ?? ""}
									photo={p.photo}
									trigger={
										<div
											data-coverflow-el
											className="relative group cursor-pointer will-change-transform transform-3d transition-transform duration-200 ease-out origin-center"
										>
											<img
												src={`${getBasePath()}img/participantes/${p.photo}`}
												alt={p.name}
												className="w-60 md:w-64 h-60 md:h-64 rounded-xl object-cover  hover:brightness-75 transition"
											/>
											<div className="absolute bottom-0 left-0 right-0 rounded-b-xl bg-linear-to-t from-black/80 to-transparent text-white leading-tight text-lg font-semibold pl-5 pr-5 pb-4 pt-16 text-pretty wrap-break-word">
												{p.name}
											</div>
										</div>
									}
								/>
							</CarouselItem>
						))}
					</CarouselContent>

					{/* Botões de navegação */}
					<CarouselPrevious className="absolute left-0 top-1/2 md:px-5 md:-translate-y-1/2 md:-translate-x-12 border-none shadow-none bg-transparent hover:bg-transparent" />
					<CarouselNext className="absolute right-0 top-1/2 md:px-5 md:-translate-y-1/2 md:translate-x-12 border-none shadow-none bg-transparent hover:bg-transparent" />
				</Carousel>
			</div>
		</section>
	);
}
