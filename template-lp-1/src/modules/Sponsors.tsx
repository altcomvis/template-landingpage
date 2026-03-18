import { resolveAssetUrl } from "@/config/s3-urls";

interface SponsorBlock {
	id: string;
	label: string;
	items: { id: string; name: string }[];
}

interface SponsorsProps extends React.HTMLAttributes<HTMLElement> {
	data: SponsorBlock[];
	general?: {
		directoryName?: string;
	};
}

function resolveSponsorLogoSrc(name: string, directoryName?: string): string {
	const raw = String(name || "").trim();
	if (!raw) return "";

	if (/^(https?:\/\/|blob:|data:)/i.test(raw)) return raw;

	const withoutQuery = raw.split("?")[0]?.split("#")[0] || raw;
	const normalized = withoutQuery.replace(/\\/g, "/");

	if (normalized.includes("/")) {
		const idx = normalized.toLowerCase().indexOf("img/");
		const relative = idx >= 0 ? normalized.slice(idx) : normalized;
		return resolveAssetUrl(relative.replace(/^\/+/, ""), directoryName);
	}

	return resolveAssetUrl(`img/marcas/${normalized}`, directoryName);
}

export function Sponsors({ data, general, ...props }: SponsorsProps) {
	const directoryName = general?.directoryName;

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: required for anchor navigation
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
											src={resolveSponsorLogoSrc(item.name, directoryName)}
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
