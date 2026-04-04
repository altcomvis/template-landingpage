import { TitleSection } from "@/components/title-sections";
import { CalendarOff } from "lucide-react";
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

	// Ordena os meses (01-12)
	const sortedMonths = Object.entries(months)
		.sort(([a], [b]) => parseInt(a) - parseInt(b))
		.map(([_, month]) => month);

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: anchor id for menu navigation
		<section className="py-16 bg-(--mybackground)" id="agenda" {...props}>
			<div className="w-full mx-auto max-w-6xl px-4">
				<TitleSection name={title || "Agenda"} />

				{/* Desktop: Carousel com meses em colunas */}
				<div className="hidden md:block">
					<Carousel className="w-full">
						<CarouselContent className="gap-4">
							{sortedMonths.map((month) => (
								<CarouselItem key={month.name} className="basis-60">
									<div className="border border-(--text)/10 rounded-lg p-6 bg-(--surface) min-h-96">
										{/* Cabeçalho do mês */}
										<h3 className="text-lg text-center font-semibold text-(--title) mb-4 pb-3 border-b border-(--text)/10">
											{month.name}
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
							))}
						</CarouselContent>
						{/* Botões de navegação */}
						<CarouselPrevious className="absolute left-0 top-1/2 md:px-5 md:-translate-y-1/2 md:-translate-x-12 border-none shadow-none text-(--surface) bg-transparent hover:bg-transparent" />
						<CarouselNext className="absolute right-0 top-1/2 md:px-5 md:-translate-y-1/2 md:translate-x-12 border-none shadow-none text-(--surface) bg-transparent hover:bg-transparent" />
					</Carousel>
				</div>

				{/* Mobile: Vertical com meses, eventos em horizontal scroll */}
				<div className="md:hidden space-y-4 px-4 bg-(--mybackground)">
					{sortedMonths.map((month) => (
						<div
							key={month.name}
							className="border border-(--text)/10 rounded-lg p-4 bg-(--surface)"
						>
							<h3 className="text-xl font-semibold text-center uppercase text-(--title) mb-3 pb-2 border-b border-(--text)/10">
								{month.name}
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
					))}
				</div>
			</div>
		</section>
	);
}
