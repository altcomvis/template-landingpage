import {
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaTiktok,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

const iconMap: Record<string, React.ElementType> = {
	youtube: FaYoutube,
	twitter: FaTwitter,
	instagram: FaInstagram,
	linkedin: FaLinkedin,
	tiktok: FaTiktok,
	facebook: FaFacebook,
};

const hrefBaseMap: Record<string, string> = {
	instagram: "https://www.instagram.com/",
	youtube: "https://www.youtube.com/@",
	facebook: "https://www.facebook.com/",
	tiktok: "https://www.tiktok.com/@",
	twitter: "https://x.com/",
	linkedin: "https://www.linkedin.com/company/",
};

function buildSocialHref(icon: string, handle: string): string {
	const h = (handle || "").trim();
	if (/^https?:\/\//i.test(h)) return h;
	const base = hrefBaseMap[icon];
	if (!base || !h) return "#";
	const withoutAt = h.replace(/^@+/, "");
	return base + withoutAt;
}

interface AboutProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		subtitle: string;
		socialTitle: string;
		paragraphs: string[];
		showTransmission: boolean;
		socialBlocks: {
			id: string;
			label: string;
			icons: { id: string; icon: string; url: string }[];
		}[];
	};
}

/**
 * About section — versão adaptada
 * - Recebe os dados via props (não importa o JSON diretamente)
 * - Suporta HTML básico em `paragraphs` (para bold/itálico/sublinhado)
 */
export function About({ data, ...props }: AboutProps) {
	const { subtitle, socialTitle, paragraphs, showTransmission, socialBlocks } =
		data;

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: fixed section anchor id for menu navigation
		<section id="about" className="w-10/12 md:w-full mx-auto py-8 md:py-16">
			<div className="container mx-auto px-4 max-w-4xl text-center">
				{/* Subtítulo principal */}
				{subtitle && (
					<h3 className="text-3xl font-semibold mb-6 text-(--title)" {...props}>
						{subtitle}
					</h3>
				)}

				{/* Texto descritivo com suporte a HTML */}
				<div
					className="text-(--text) text-xl pb-16 text-pretty max-w-[60ch] mx-auto [&_a]:text-(--title) [&_a]:underline [&_a]:underline-offset-2 [&_a]:font-semibold [&_a:hover]:opacity-80"
					{...props}
				>
					{paragraphs.map((p, i) => (
						<p
							// biome-ignore lint/suspicious/noArrayIndexKey: paragraphs are simple ordered rich-text blocks
							key={i}
							className="text-(--text) leading-relaxed mb-4"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: rich text content is intentionally authored in admin editor
							dangerouslySetInnerHTML={{ __html: p }}
						/>
					))}
				</div>

				{/* 🎥 Bloco de Transmissão */}
				<Separator className="md:w-96! mx-auto bg-zinc-300" />
				{showTransmission && (
					<div className="w-10/12 mx-auto  py-12" {...props}>
						<h2 className="text-2xl font-bold mb-6 text-(--title)" {...props}>
							{socialTitle}
						</h2>

						<div
							className="flex justify-center gap-6 md:gap-12 flex-wrap"
							{...props}
						>
							{socialBlocks.map((block) => (
								<div key={block.id} className="text-center">
									<p className="font-semibold mb-2">{block.label}</p>
									<div className="flex gap-4 justify-center">
										{block.icons.map((icon) => {
											const Icon = iconMap[icon.icon];
											const href = buildSocialHref(icon.icon, icon.url);
											return (
												<a
													key={icon.id}
													href={href}
													target="_blank"
													rel="noopener noreferrer"
													className="w-10 h-10 flex items-center justify-center text-2xl text-(--text) hover:text-(--light) hover:scale-110 transition-transform"
												>
													{Icon && <Icon />}
												</a>
											);
										})}
									</div>
								</div>
							))}
						</div>
					</div>
				)}
				<Separator className="md:w-96! mx-auto bg-zinc-300" />
			</div>
		</section>
	);
}
