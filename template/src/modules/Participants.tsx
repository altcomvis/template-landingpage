import { ParticipantDialog } from "@/components/participant-dialog";
import { TitleSection } from "@/components/title-sections";
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
 * - Remove dependência direta do `landing.json`
 */
export function Participants({ data, ...props }: ParticipantsProps) {
	const participants = data.groups.flatMap((group) => group.participants);

	return (
		<section id="speakers" className="relative">
			<TitleSection name={data.title || "Participantes"} />

			<div
				className="container w-11/12 px-4 md:px-14 mx-auto py-16 bg-[var(--secondary)] md:rounded-xl relative overflow-hidden"
				{...props}
			>
				{/* Gradiente de overlay */}
				<div className="bg-gradient-to-b from-black/30 to-black/0 absolute inset-0 z-0 md:rounded-xl" />

				<Carousel
					className="w-full max-w-6xl mx-auto z-10 relative"
					opts={{ loop: true }}
				>
					<CarouselContent>
						{participants.map((p) => (
							<CarouselItem
								key={p.name}
								className="md:basis-1/3 lg:basis-1/4 flex justify-center"
							>
								<ParticipantDialog
									name={p.name}
									position={p.position ?? ""}
									photo={p.photo}
									trigger={
										<div className="relative group cursor-pointer">
											<img
												src={`${getBasePath()}img/participantes/${p.photo}`}
												alt={p.name}
												className="w-60 md:w-64 h-60 md:h-64 object-cover shadow border border-[var(--text)] hover:brightness-75 transition"
											/>
											<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white leading-tight text-lg font-semibold pl-5 pr-16 pb-4 pt-16">
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
