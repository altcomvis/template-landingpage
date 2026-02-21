import { useRef } from "react";
import LightRays from "@/components/LightRays";
import { resolveAssetUrl } from "@/config/s3-urls";
import Subscribe from "./Subscribe";

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
	// biome-ignore lint/suspicious/noExplicitAny: subscribe JSON is dynamic
	subscribe?: any;
}

export function Hero({ data, general, subscribe, ...props }: HeroProps) {
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
	const heroRef = useRef<HTMLElement | null>(null);
	const infoBoxTextClass = "text-gray-900";

	return (
		<section
			{...props}
			ref={heroRef}
			className="relative flex flex-col items-center justify-center overflow-hidden pt-12 pb-20 md:pt-12 md:pb-20"
		>
			{/* 🌤 Light Rays */}
			{useLightRays && (
				<div className="absolute inset-0 z-10 opacity-70 pointer-events-none">
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
			<div className="relative z-20 w-full max-w-6xl mx-auto px-12">
				<div
					className={`grid grid-cols-1 gap-10 items-center ${
						subscribe?.visible
							? "lg:grid-cols-5 lg:items-center"
							: "justify-items-center"
					}`}
				>
					<div
						className={
							subscribe?.visible
								? "text-center lg:text-center col-span-3"
								: "text-center"
						}
					>
						{/* Logo ou nome do projeto */}
						<div className="mb-6 justify-self-center ">
							{hasLogo ? (
								<img
									src={logoPath}
									alt={projectName || "Logo do Projeto"}
									className={`${subscribe?.visible ? "mx-auto lg:mx-0" : "mx-auto"} drop-shadow-2xl ${
										logoSize === "grande"
											? "h-64"
											: logoSize === "pequeno"
												? "h-24"
												: "h-40"
									}`}
								/>
							) : (
								<h1 className="text-3xl md:text-5xl font-bold text-shadow-2xl text-white">
									{projectName}
								</h1>
							)}
						</div>

						{/* Subtítulo */}
						{subtitle && (
							<p
								className="text-lg md:text-2xl mb-8 md:px-18 text-shadow-2xl"
								style={{ color: subtitleColor || "#fff" }}
							>
								{subtitle}
							</p>
						)}

						{/* 📅 Informações do evento */}
						{(date || time || location || address) && (
							<div
								className={`flex gap-4 items-stretch flex-wrap ${
									subscribe?.visible
										? "justify-center lg:justify-center"
										: "justify-center"
								}`}
							>
								{date && (
									<div
										className={`info-box flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2 ${infoBoxTextClass}`}
									>
										<span className="text-2xl">📅</span>
										<span className="font-bold text-xl md:text-2xl">
											{date}
										</span>
									</div>
								)}
								{time && (
									<div
										className={`info-box flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2 ${infoBoxTextClass}`}
									>
										<span className="text-2xl">⏰</span>
										<span className="font-bold text-xl md:text-2xl">
											{time}
										</span>
									</div>
								)}
								{(location || address) && (
									<div
										className={`info-box flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2 text-center md:text-left ${infoBoxTextClass}`}
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

					{subscribe?.visible && (
						<div className="w-full lg:max-w-md lg:justify-self-end col-span-2">
							<Subscribe data={subscribe} data-parallax />
						</div>
					)}
				</div>
			</div>
			<div className="bg-linear-0 from-black/20 to-black/0 h-24 w-full absolute bottom-0" />
		</section>
	);
}
