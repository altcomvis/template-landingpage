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
									<div
										key={item.id}
										className="w-36 h-16 flex items-center justify-center"
									>
										<img
											src={`${getBasePath()}img/marcas/${item.name}`}
											alt={`${block.label} ${item.name}`}
											className="w-auto h-auto max-w-[85%] max-h-[85%] object-contain"
											loading="lazy"
										/>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
