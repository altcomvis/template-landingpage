import { TitleSection } from "@/components/title-sections";
import { CalendarOff } from "lucide-react";
import { useEffect, useRef } from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselPrevious,
	CarouselNext,
} from "@/components/ui/carousel";

/* ─────────────── Tipagem ─────────────── */
interface AgendaEvent {
	id: string;
	title: string;
	day: string;
	time?: string;
	location?: string;
	description?: string;
}

interface AgendaMonth {
	name: string;
	events: AgendaEvent[];
}

interface AgendaProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title: string;
		visible?: boolean;
		months: Record<string, AgendaMonth>;
	};
}

/* ─────────────── Componente ─────────────── */
export function Agenda({ data, ...props }: AgendaProps) {
	const { title, months } = data;
	const carouselRef = useRef<HTMLDivElement>(null);

	// Ordena os meses (01-12)
	const sortedMonths = Object.entries(months)
		.sort(([a], [b]) => parseInt(a) - parseInt(b))
		.map(([key, month]) => ({ monthNumber: key, ...month }));

	// Detecta o mês atual e scroll para ele
	useEffect(() => {
		const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, "0");
		const currentMonthIndex = sortedMonths.findIndex(
			(m) => m.monthNumber === currentMonth,
		);

		if (currentMonthIndex >= 0 && carouselRef.current) {
			// Aguarda um pouco para o carousel estar pronto
			setTimeout(() => {
				const carouselItems = carouselRef.current?.querySelectorAll(
					"[data-carousel-item]",
				);
				if (carouselItems && carouselItems[currentMonthIndex]) {
					carouselItems[currentMonthIndex].scrollIntoView({
						behavior: "smooth",
						block: "nearest",
						inline: "center",
					});
				}
			}, 100);
		}
	}, [sortedMonths]);

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: anchor id for menu navigation
		<section className="py-16 bg-(--mybackground)" id="agenda" {...props}>
			<div className="w-full mx-auto max-w-6xl px-4">
				<TitleSection name={title || "Agenda"} />

				{/* Desktop: Carousel com meses em colunas */}
				<div className="hidden md:block">
					<Carousel className="w-full" ref={carouselRef}>
						<CarouselContent className="gap-4">
							{sortedMonths.map((month) => {
								const currentMonth = (new Date().getMonth() + 1)
									.toString()
									.padStart(2, "0");
								const isCurrentMonth = month.monthNumber === currentMonth;

								return (
									<CarouselItem
										key={month.monthNumber}
										data-carousel-item
										className={`basis-60 transition-all ${
											isCurrentMonth ? "opacity-100" : "opacity-75"
										}`}
									>
										<div
											className={`border rounded-lg p-6 bg-(--surface) min-h-96 transition-all ${
												isCurrentMonth
													? "border-2 border-(--title) shadow-lg ring-2 ring-(--title)/30"
													: "border border-(--text)/10"
											}`}
										>
											{/* Cabeçalho do mês */}
											<h3
												className={`text-lg text-center font-semibold text-(--title) mb-4 pb-3 border-b transition-all ${
													isCurrentMonth
														? "border-b-2 border-(--title)"
														: "border-(--text)/10"
												}`}
											>
												{month.name}
												{isCurrentMonth && (
													<span className="text-sm ml-2 inline-block px-2 py-1 bg-(--title) text-white rounded">
														Atual
													</span>
												)}
											</h3>

											{/* Events em vertical dentro do mês */}
											<div className="space-y-3">
												{month.events.length > 0 ? (
													month.events.map((event) => (
														<div
															key={event.id}
															className="p-3 bg-(--text)/5 rounded-md hover:bg-(--text)/10 transition-colors"
														>
															<div className="flex gap-2 mb-2">
																<span className="text-sm font-bold text-(--dark)">
																	{event.day}
																</span>
																<h4 className="text-sm font-semibold text-(--title) line-clamp-2">
																	{event.title || (
																		<span className="italic opacity-50">
																			Sem título
																		</span>
																	)}
																</h4>
															</div>

															{event.time && (
																<p className="text-xs text-(--text)/70 mb-1">
																	⏰ {event.time}
																</p>
															)}

															{event.location && (
																<p className="text-xs text-(--text)/70 mb-1">
																	📍 {event.location}
																</p>
															)}

															{event.description && (
																<p className="text-xs text-(--text)/60 line-clamp-2">
																	{event.description}
																</p>
															)}
														</div>
													))
												) : (
													<div className="p-4 bg-(--text)/5 rounded-md text-center">
														<CalendarOff className="size-full opacity-5" />
													</div>
												)}
											</div>
										</div>
									</CarouselItem>
								);
							})}
						</CarouselContent>
						{/* Botões de navegação */}
						<CarouselPrevious className="absolute left-0 top-1/2 md:px-5 md:-translate-y-1/2 md:-translate-x-12 border-none shadow-none text-(--surface) bg-transparent hover:bg-transparent" />
						<CarouselNext className="absolute right-0 top-1/2 md:px-5 md:-translate-y-1/2 md:translate-x-12 border-none shadow-none text-(--surface) bg-transparent hover:bg-transparent" />
					</Carousel>
				</div>

				{/* Mobile: Vertical com meses, eventos em horizontal scroll */}
				<div className="md:hidden space-y-4 px-4 bg-(--mybackground)">
					{sortedMonths.map((month) => {
						const currentMonth = (new Date().getMonth() + 1)
							.toString()
							.padStart(2, "0");
						const isCurrentMonth = month.monthNumber === currentMonth;

						return (
							<div
								key={month.monthNumber}
								className={`border rounded-lg p-4 bg-(--surface) transition-all ${
									isCurrentMonth
										? "border-2 border-(--title) shadow-lg ring-2 ring-(--title)/30"
										: "border border-(--text)/10"
								}`}
							>
								<h3
									className={`text-xl font-semibold text-center uppercase text-(--title) mb-3 pb-2 border-b transition-all ${
										isCurrentMonth
											? "border-b-2 border-(--title)"
											: "border-(--text)/10"
									}`}
								>
									{month.name}
									{isCurrentMonth && (
										<span className="text-sm ml-2 inline-block px-2 py-1 bg-(--title) text-white rounded">
											Atual
										</span>
									)}
								</h3>

								{/* Horizontal scroll para eventos */}
								<div className="overflow-x-auto">
									<div className="flex gap-3 pb-2 min-w-min">
										{month.events.length > 0 ? (
											month.events.map((event) => (
												<div
													key={event.id}
													className="shrink-0 w-64 p-3 bg-(--text)/5 rounded-md"
												>
													<div className="flex gap-2 mb-2">
														<span className="text-sm font-bold text-(--dark)">
															{event.day}
														</span>
														<h4 className="text-sm font-semibold text-(--title) line-clamp-1">
															{event.title || (
																<span className="italic opacity-50">
																	Sem título
																</span>
															)}
														</h4>
													</div>

													{event.time && (
														<p className="text-xs text-(--text)/70 mb-1 line-clamp-1">
															⏰ {event.time}
														</p>
													)}

													{event.location && (
														<p className="text-xs text-(--text)/70 mb-1 line-clamp-1">
															📍 {event.location}
														</p>
													)}

													{event.description && (
														<p className="text-xs text-(--text)/60 line-clamp-2">
															{event.description}
														</p>
													)}
												</div>
											))
										) : (
											<div className="shrink-0 w-64 p-4 bg-(--text)/5 rounded-md text-center opacity-40">
												<CalendarOff className="size-full opacity-10" />
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
