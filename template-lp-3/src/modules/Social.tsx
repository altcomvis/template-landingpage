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

interface SocialProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title: string;
		visible?: boolean;
		blocks: {
			id: string;
			label: string;
			icons: { id: string; icon: string; url: string }[];
		}[];
	};
}

export function Social({ data, ...props }: SocialProps) {
	if (data?.visible === false) return null;

	const blocks = data?.blocks || [];
	if (blocks.length === 0) return null;

	return (
		// biome-ignore lint/nursery/useUniqueElementIds: fixed section anchor id for menu navigation
		<section id="social" className="w-10/12 md:w-full mx-auto py-8 md:py-16">
			<div className="container mx-auto px-4 max-w-4xl text-center">
				<Separator className="md:w-96! mx-auto bg-zinc-300" />
				<div className="w-10/12 mx-auto py-12" {...props}>
					{data.title && (
						<h2 className="text-2xl font-bold mb-6 text-(--title)" {...props}>
							{data.title}
						</h2>
					)}

					<div
						className="flex justify-center gap-6 md:gap-12 flex-wrap"
						{...props}
					>
						{blocks.map((block) => (
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
				<Separator className="md:w-96! mx-auto bg-zinc-300" />
			</div>
		</section>
	);
}
