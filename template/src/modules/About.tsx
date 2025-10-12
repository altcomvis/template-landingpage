import {
	FaFacebook,
	FaInstagram,
	FaLinkedin,
	FaTiktok,
	FaTwitter,
	FaYoutube,
} from "react-icons/fa";
import landing from "@/landing.json";

const iconMap: Record<string, React.ElementType> = {
	youtube: FaYoutube,
	twitter: FaTwitter,
	instagram: FaInstagram,
	linkedin: FaLinkedin,
	tiktok: FaTiktok,
	facebook: FaFacebook,
};

export function About(props: React.HTMLAttributes<HTMLElement>) {
	const about = landing.about;
	const { subtitle, socialTitle, paragraphs, showTransmission, socialBlocks } =
		about;

	return (
		<section id="about" className="w-10/12 md:w-full mx-auto py-16 ">
			<div className="container mx-auto px-4 max-w-4xl text-center">
				{subtitle && (
					<h3 className="text-3xl font-semibold mb-6" {...props}>
						{subtitle}
					</h3>
				)}

				<div
					className="space-y-6 text-[var(--text)] text-xl font-light pb-16 text-pretty"
					{...props}
				>
					{Array.isArray(paragraphs)
						? paragraphs.map((text: string) => <p key={text}>{text}</p>)
						: paragraphs && <p>{paragraphs}</p>}
				</div>

				{/* Bloco de Transmissão */}
				{showTransmission && (
					<div className="w-10/12 md:w-6/12 mx-auto border-t border-b border-zinc-500 py-12">
						<h2
							className="text-2xl font-bold mb-6 text-[var(--light)]"
							{...props}
						>
							{socialTitle}
						</h2>
						<div className="flex justify-center gap-12 flex-wrap" {...props}>
							{socialBlocks.map((block) => (
								<div key={block.id} className="text-center">
									<p className="font-semibold mb-2">{block.label}</p>
									<div className="flex gap-4 justify-center">
										{block.icons.map((icon) => {
											const Icon = iconMap[icon.icon];
											return (
												<a
													key={icon.id}
													href={icon.url}
													target="_blank"
													rel="noopener noreferrer"
													className="w-10 h-10 flex items-center justify-center text-2xl text-[var(--secondary)] hover:text-[var(--light)] hover:scale-120 transition"
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
			</div>
		</section>
	);
}
