import Image from "next/image";
import { getBasePath } from "@/utils/getBasePath";

interface SponsorBlock {
	id: string;
	label: string;
	items: { id: string; name: string }[];
}

interface SponsorsProps extends React.HTMLAttributes<HTMLElement> {
	data: SponsorBlock[];
}

export function Sponsors({ data, ...props }: SponsorsProps) {
	return (
		// biome-ignore lint: ID fixo necessário para âncoras de navegação
		<section className="py-16" id="sponsors" {...props}>
			<div className="container mx-auto px-4">
				<div className="flex flex-wrap justify-center gap-16">
					{data.map((block) => (
						<div key={block.id} className="flex flex-col items-center min-w-52">
							{/* Nome da Chancela */}
							<div className="w-full pb-6 flex flex-col items-center">
								<p className="text-center text-[0.7rem] font-light text-(--text) mb-6 uppercase tracking-wide bg-(--surface) z-1 px-3">
									{block.label}
								</p>
								{/* Linha divisória */}
								<div className="w-full border-t border-zinc-400 -mt-8" />
							</div>

							{/* Logos */}
							<div className="flex justify-center gap-8 flex-wrap md:flex-nowrap">
								{block.items.map((item) => (
									<Image
										width={100}
										height={100}
										key={item.id}
										src={`${getBasePath()}img/marcas/${item.name}`}
										alt={`${block.label} ${item.name}`}
										className="h-12 max-w-36 max-h-8 w-auto object-contain"
										loading="lazy"
									/>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
