import LightRays from "@/components/LightRays";
import { resolveAssetUrl } from "@/config/s3-urls";

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		subtitle: string;
		subtitleColor?: string;
		date: string;
		time: string;
		location: string;
		address: string;
		useBackgroundImage?: boolean;
		useLightRays?: boolean;
		lightRaysColor?: string;
		logoSize?: "grande" | "medio" | "pequeno";
	};
	general: {
		projectName: string;
		primaryColor: string;
		directoryName?: string;
	};
}

export function Hero({ data, general, ...props }: HeroProps) {
	const {
		subtitle,
		subtitleColor,
		date,
		time,
		location,
		address,
		useLightRays,
		lightRaysColor,
		logoSize,
	} = data;

	const { projectName } = general;

	const hasLogo = true;
	const logoPath = resolveAssetUrl(
		"img/hero/marca-do-projeto.webp",
		general?.directoryName,
	);
	const backgroundUrl = resolveAssetUrl(
		"img/hero/header.webp",
		general?.directoryName,
	);
	const infoBoxTextClass = "text-gray-900";

	return (
		<section
			{...props}
			className="relative flex flex-col items-center justify-center md:rounded-xl shadow-lg bg-center bg-no-repeat bg-cover overflow-hidden py-20 md:py-10"
			style={{
				backgroundImage: backgroundUrl ? `url('${backgroundUrl}')` : undefined,
			}}
		>
			{/* 🌤 Light Rays */}
			{useLightRays && (
				<div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
					<LightRays
						raysOrigin="top-center"
						raysColor={lightRaysColor || "#ffffff"}
						raysSpeed={1}
						lightSpread={3}
						rayLength={2}
						fadeDistance={1}
						followMouse={true}
						mouseInfluence={0.5}
						noiseAmount={0}
						distortion={0}
						className="custom-rays"
					/>
				</div>
			)}

			{/* 📦 Conteúdo principal */}
			<div className="relative z-10 text-center max-w-3xl mx-auto px-4">
				{/* Logo ou nome do projeto */}
				<div className="mb-6">
					{hasLogo ? (
						<img
							src={logoPath}
							alt={projectName || "Logo do Projeto"}
							className={`mx-auto ${
								logoSize === "grande"
									? "h-64"
									: logoSize === "pequeno"
										? "h-24"
										: "h-40"
							}`}
						/>
					) : (
						<h1 className="text-3xl md:text-5xl font-bold text-white">
							{projectName}
						</h1>
					)}
				</div>

				{/* Subtítulo */}
				{subtitle && (
					<p
						className="text-lg md:text-2xl mb-8 text-shadow-2xl"
						style={{ color: subtitleColor || "#fff" }}
					>
						{subtitle}
					</p>
				)}

				{/* 📅 Informações do evento */}
				{(date || time || location || address) && (
					<div className="flex gap-4 justify-center items-stretch flex-wrap">
						{date && (
							<div
								className={`info-box flex items-center gap-2 bg-zinc-100/80 backdrop-blur-md rounded-lg px-4 py-2 ${infoBoxTextClass}`}
							>
								<span className="text-2xl">📅</span>
								<span className="font-bold text-xl md:text-2xl">{date}</span>
							</div>
						)}
						{time && (
							<div
								className={`info-box flex items-center gap-2 bg-zinc-100/80 backdrop-blur-md rounded-lg px-4 py-2 ${infoBoxTextClass}`}
							>
								<span className="text-2xl">⏰</span>
								<span className="font-bold text-xl md:text-2xl">{time}</span>
							</div>
						)}
						{(location || address) && (
							<div
								className={`info-box flex items-center gap-2 bg-zinc-100/80 backdrop-blur-md rounded-lg px-4 py-2 text-center md:text-left ${infoBoxTextClass}`}
							>
								<div className="flex flex-col">
									{location && (
										<span className="font-bold block text-lg md:text-xl text-pretty">
											📍 {location}
										</span>
									)}
									{address && (
										<span className="text-sm text-pretty">{address}</span>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</div>
		</section>
	);
}
