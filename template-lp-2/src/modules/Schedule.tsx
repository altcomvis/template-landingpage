import { Circle } from "lucide-react";
import { ParticipantDialog } from "@/components/participant-dialog";
import { TitleSection } from "@/components/title-sections";

/* ─────────────── Tipagens ─────────────── */
interface Participant {
	id: string;
	name: string;
	position?: string;
	photo: string;
}

interface ScheduleItem {
	id: string;
	time: string;
	title: string;
	description?: string;
	type: "simple" | "panel";
	speakers?: { id: string }[];
	mediators?: { id: string }[];
}

interface ScheduleProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title: string;
		eventTitle?: string;
		eventDescription?: string;
		date?: string;
		showDateIcon?: boolean;
		time?: string;
		showTimeIcon?: boolean;
		location?: string;
		showLocationIcon?: boolean;
		panelContentAlign?: "left" | "center" | "right";
		panels: ScheduleItem[];
	};
	participants: {
		groups: { id: string; label: string; participants: Participant[] }[];
	};
}

/* ─────────────── Componente ─────────────── */
export function Schedule({ data, participants, ...props }: ScheduleProps) {
	const {
		title,
		eventTitle,
		eventDescription,
		date,
		showDateIcon,
		time,
		showTimeIcon,
		location,
		showLocationIcon,
		panels,
	} = data;
	const contentAlign = data.panelContentAlign || "left";
	const renderDateIcon = showDateIcon !== false;
	const renderTimeIcon = showTimeIcon !== false;
	const renderLocationIcon = showLocationIcon !== false;
	const infoBoxTextClass = "text-gray-900";
	const contentTextClass =
		contentAlign === "center"
			? "text-center"
			: contentAlign === "right"
				? "text-right"
				: "text-left";
	const contentParticipantsClass =
		contentAlign === "center"
			? "justify-center"
			: contentAlign === "right"
				? "justify-end"
				: "justify-start";
	const timelineLineClass =
		contentAlign === "center"
			? "left-1/2 -translate-x-1/2  "
			: contentAlign === "right"
				? "right-0 mr-20 md:mr-30"
				: "left-0 ml-20 md:ml-30";
	const rowClass =
		contentAlign === "center"
			? "flex flex-col items-center gap-4"
			: contentAlign === "right"
				? "flex flex-row-reverse items-center gap-6"
				: "flex items-center gap-6";
	const timeWrapClass =
		contentAlign === "center"
			? "font-light text-xl flex gap-3 items-center text-left justify-center z-10 bg-(--surface) "
			: contentAlign === "right"
				? "w-20 md:w-32 mr-[5px] md:-mr-[3px] text-left font-light text-xl flex gap-3 items-center justify-start z-10"
				: "w-20 md:w-32 ml-[5px] md:-ml-[3px] text-left font-light text-xl flex gap-3 items-center justify-end";
	const contentWrapClass = contentAlign === "center" ? "w-full" : "flex-1";
	const bulletClass =
		contentAlign === "center" ? "hidden" : contentAlign === "right" ? "" : "";
	const metadataContainerClass =
		contentAlign === "center"
			? "flex gap-4 justify-center items-stretch flex-wrap"
			: contentAlign === "right"
				? "flex gap-4 justify-end items-stretch flex-wrap"
				: "flex gap-4 justify-start items-stretch flex-wrap";
	// Função auxiliar para localizar participante
	const findParticipantById = (id: string): Participant | undefined => {
		for (const group of participants.groups) {
			const found = group.participants.find((p) => p.id === id);
			if (found) return found;
		}
		return undefined;
	};

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: anchor id for menu navigation
		<section className="py-16" id="schedule" {...props}>
			<div className="w-full mx-auto px-4 max-w-6xl">
				<TitleSection name={title || "Programação"} />

				{/* Metadados da Seção */}
				{(eventTitle || eventDescription || date || time || location) && (
					<div className=" p-6 border border-(--text) rounded-xl">
						{eventTitle && (
							<div className={`mb-4 ${contentTextClass}`}>
								<h2 className="text-xl md:text-2xl font-bold text-(--text)">
									{eventTitle}
								</h2>
							</div>
						)}
						{eventDescription && (
							<div className={`mb-4 ${contentTextClass}`}>
								<p className="text-lg text-(--text)/90">{eventDescription}</p>
							</div>
						)}
						<div
							className={`	${metadataContainerClass} md:divide-x divide-(--text)`}
						>
							{date && (
								<div
									className={`info-box flex items-center gap-2 px-4 py-2 ${infoBoxTextClass}`}
								>
									{renderDateIcon && <span className="text-2xl">🗓️</span>}
									<span className="font-bold text-xl md:text-2xl">{date}</span>
								</div>
							)}
							{time && (
								<div
									className={`info-box flex items-center gap-2 px-4 py-2 ${infoBoxTextClass}`}
								>
									{renderTimeIcon && <span className="text-2xl">⏰</span>}
									<span className="font-bold text-xl md:text-2xl">{time}</span>
								</div>
							)}
							{location && (
								<div
									className={`info-box flex items-center gap-2 px-4 py-2 text-center md:text-left ${infoBoxTextClass}`}
								>
									<span className="font-bold block text-lg md:text-xl text-pretty">
										{renderLocationIcon ? `📍 ${location}` : location}
									</span>
								</div>
							)}
						</div>
					</div>
				)}

				<div className="relative ">
					{/* Linha vertical timeline */}
					<div
						className={`absolute -top-6 bottom-0 w-px bg-(--text) z-0 ${timelineLineClass}`}
					/>

					<div className="space-y-12 mt-6">
						{panels.map((item) => (
							<div key={`${item.id}-${item.title}`} className={rowClass}>
								{/* ⏰ Horário */}
								<div className={timeWrapClass}>
									{contentAlign === "right" ? (
										<>
											<Circle
												size={10}
												className={`bg-(--surface) text-(--text) z-1 rounded-full ${bulletClass}`}
											/>
											{item.time}
										</>
									) : (
										<>
											{item.time}
											<Circle
												size={10}
												className={`bg-(--surface) text-(--text) z-1 rounded-full ${bulletClass}`}
											/>
										</>
									)}
								</div>

								{/* 📋 Conteúdo */}
								<div className={contentWrapClass}>
									{item.type === "panel" ? (
										<div className="bg-(--surface) border shadow-md rounded-xl p-6 relative overflow-hidden">
											<div className="bg-zinc-400/10 absolute w-full h-full z-0 top-0 left-0 md:rounded-xl" />
											<h3
												className={`text-2xl font-semibold mb-2 text-(--text) ${contentTextClass}`}
											>
												{item.title}
											</h3>
											{item.description && (
												<p
													className={`text-(--text) mb-4 opacity-90 ${contentTextClass}`}
												>
													{item.description}
												</p>
											)}

											{/* 👥 Participantes */}
											<div
												className={`flex flex-wrap items-start gap-2 relative z-10 ${contentParticipantsClass}`}
											>
												{item.speakers?.map((spk) => {
													const full = findParticipantById(spk.id);
													if (!full) return null;
													return (
														<div
															key={full.id}
															className="text-center w-20 flex flex-col items-center gap-2"
														>
															<ParticipantDialog
																name={full.name}
																position={full.position}
																photo={full.photo}
															/>
															<p className="text-xs font-semibold text-(--text)">
																{full.name}
															</p>
														</div>
													);
												})}

												{/* 🎤 Mediadores */}
												{item.mediators && item.mediators.length > 0 && (
													<div className="flex flex-wrap gap-4 md:border-l border-zinc-500 md:pl-4">
														{item.mediators.map((med) => {
															const full = findParticipantById(med.id);
															if (!full) return null;
															return (
																<div
																	key={full.id}
																	className="text-center w-20 flex flex-col items-center gap-2"
																>
																	<ParticipantDialog
																		name={full.name}
																		position={full.position}
																		photo={full.photo}
																	/>
																	<div>
																		<p className="text-[10px] text-(--text) uppercase tracking-wide">
																			Mediação
																		</p>
																		<p className="text-xs font-semibold text-(--text)">
																			{full.name}
																		</p>
																	</div>
																</div>
															);
														})}
													</div>
												)}
											</div>
										</div>
									) : (
										<div
											className={`bg-(--surface) relative  ${contentTextClass}`}
										>
											<h3 className="text-1xl font-semibold text-(--text)">
												{item.title}
											</h3>
											{item.description && (
												<p className="text-(--text) opacity-90">
													{item.description}
												</p>
											)}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
