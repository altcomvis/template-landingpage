import { Circle } from "lucide-react";
import { ParticipantDrawer } from "@/components/participant-drawer";
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
		panels: ScheduleItem[];
	};
	participants: {
		groups: { id: string; label: string; participants: Participant[] }[];
	};
}

/* ─────────────── Componente ─────────────── */
export function Schedule({ data, participants, ...props }: ScheduleProps) {
	const { title, panels } = data;

	// Função auxiliar para localizar participante
	const findParticipantById = (id: string): Participant | undefined => {
		for (const group of participants.groups) {
			const found = group.participants.find((p) => p.id === id);
			if (found) return found;
		}
		return undefined;
	};

	return (
		<section className="py-16" id="schedule" {...props}>
			<div className="container mx-auto px-4 max-w-6xl">
				<TitleSection name={title || "Programação"} />

				<div className="relative">
					{/* Linha vertical timeline */}
					<div className="absolute left-0 top-0 bottom-0 w-px bg-[var(--text)] ml-20 md:ml-30" />

					<div className="space-y-12">
						{panels.map((item) => (
							<div
								key={`${item.id}-${item.title}`}
								className="flex items-center gap-6"
							>
								{/* ⏰ Horário */}
								<div className="w-20 md:w-32 ml-[5px] md:-ml-[3px] text-right font-light text-xl flex gap-3 items-center justify-end">
									{item.time}
									<Circle
										size={10}
										className="bg-[var(--surface)] text-[var(--text)] z-1 rounded-full"
									/>
								</div>

								{/* 📋 Conteúdo */}
								<div className="flex-1">
									{item.type === "panel" ? (
										<div className="bg-[var(--surface)] border shadow-md rounded-xl p-6 relative overflow-hidden">
											<div className="bg-zinc-400/10 absolute w-full h-full z-0 top-0 left-0 md:rounded-xl" />
											<h3 className="text-2xl font-semibold mb-2 text-[var(--text)]">
												{item.title}
											</h3>
											{item.description && (
												<p className="text-[var(--text)] mb-4 opacity-90">
													{item.description}
												</p>
											)}

											{/* 👥 Participantes */}
											<div className="flex flex-wrap items-start gap-6 relative z-10">
												{item.speakers?.map((spk) => {
													const full = findParticipantById(spk.id);
													if (!full) return null;
													return (
														<div
															key={full.id}
															className="text-center w-20 flex flex-col items-center gap-2"
														>
															<ParticipantDrawer
																name={full.name}
																position={full.position}
																photo={full.photo}
															/>
															<p className="text-xs font-semibold text-[var(--text)]">
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
																	<ParticipantDrawer
																		name={full.name}
																		position={full.position}
																		photo={full.photo}
																	/>
																	<div>
																		<p className="text-[10px] text-[var(--text)] uppercase tracking-wide">
																			Mediação
																		</p>
																		<p className="text-xs font-semibold text-[var(--text)]">
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
										<div>
											<h3 className="text-2xl font-semibold text-[var(--text)] mb-1">
												{item.title}
											</h3>
											{item.description && (
												<p className="text-[var(--text)] opacity-80">
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
