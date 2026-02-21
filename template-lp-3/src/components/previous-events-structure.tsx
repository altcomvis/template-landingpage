import { useEffect, useMemo, useState } from "react";
import { TitleSection } from "@/components/title-sections";
import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { getBasePath } from "@/utils/getBasePath";

type Event = {
	date: string;
	image: string;
	title: string;
	description: string;
	ctaLabel: string;
	ctaLink: string;
};

export function PreviousEventsStructure({
	events,
	title,
	description,
}: {
	events: Event[];
	title: string;
	description?: string;
}) {
	const [api, setApi] = useState<CarouselApi | null>(null);

	const coverflowConfig = useMemo(
		() => ({
			perspective: 1200,
			maxScale: 1.12,
			minScale: 0.82,
			maxRotate: 35,
			maxZ: 80,
			fade: 0.55,
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
				const distance = distancePx / Math.max(1, viewportRect.width);
				const abs = Math.min(1, Math.abs(distance));

				const scale = Math.max(
					coverflowConfig.minScale,
					coverflowConfig.maxScale -
						abs * (coverflowConfig.maxScale - coverflowConfig.minScale),
				);
				const rotateY = -distance * coverflowConfig.maxRotate;
				const translateZ = (1 - abs) * coverflowConfig.maxZ;
				const opacity = Math.max(1 - abs * coverflowConfig.fade, 0.35);

				el.style.transform = `translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
				el.style.opacity = String(opacity);
				el.style.zIndex = String(Math.round((1 - abs) * 100));
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
		<section className="py-16">
			<div className="container mx-auto px-4 max-w-6xl">
				<TitleSection name={title} description={description} />

				<Carousel
					className="relative mt-12 perspective-distant"
					setApi={setApi}
					opts={{ align: "center" }}
				>
					<CarouselContent className="w-full mx-auto">
						{events.map((event) => (
							<CarouselItem
								key={event.title + event.date}
								className="basis-full sm:basis-1/2 md:basis-1/3 px-3"
							>
								<div
									data-coverflow-el
									className="will-change-transform transform-3d"
								>
									<div className="bg-(--dark) text-(--light) rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
										{/* Data */}
										<div className="bg-(--dark) text-(--light) text-sm font-bold py-2 text-center">
											{event.date}
										</div>

										{/* Imagem */}
										<img
											src={`${getBasePath()}img/edicoes-passadas/${event.image}`}
											alt={event.title}
											className="w-full h-48 object-cover"
										/>

										{/* Conteúdo */}
										<div className="p-6 flex flex-col flex-1">
											<h3 className="text-lg font-bold mb-2 text-(--light)">
												{event.title}
											</h3>
											<p className="text-sm text-white mb-6 flex-1">
												{event.description}
											</p>

											<Button asChild className="font-semibold mt-auto">
												<a
													href={event.ctaLink}
													target="_blank"
													rel="noreferrer"
												>
													{event.ctaLabel}
												</a>
											</Button>
										</div>
									</div>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>

					<CarouselPrevious className="absolute left-0 top-1/2 md:px-5 md:-translate-y-1/2 md:-translate-x-12 border-none shadow-none bg-transparent hover:bg-transparent" />
					<CarouselNext className="absolute right-0 top-1/2 md:px-5 md:-translate-y-1/2 md:translate-x-12 border-none shadow-none bg-transparent hover:bg-transparent" />
				</Carousel>
			</div>
		</section>
	);
}
