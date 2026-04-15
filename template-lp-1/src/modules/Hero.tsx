import LightRays from "@/components/LightRays";
import { resolveAssetUrl } from "@/config/s3-urls";

function extractFilename(value?: string): string {
	const raw = String(value || "").trim();
	if (!raw) return "";
	const withoutQuery = raw.split("?")[0]?.split("#")[0] || raw;
	const normalized = withoutQuery.replace(/\\/g, "/");
	return (normalized.split("/").pop() || "").trim();
}

interface HeroProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		logo?: string;
		backgroundUrl?: string;
		subtitle: string;
		subtitleColor?: string;
		date: string;
		showDateIcon?: boolean;
		time: string;
		showTimeIcon?: boolean;
		location: string;
		showLocationIcon?: boolean;
		address: string;
		useBackgroundImage?: boolean;
		useLightRays?: boolean;
		lightRaysColor?: string;
		logoSize?: "grande" | "medio" | "pequeno";
		infoBoxBgColor?: string;
		dateTimeBoxBgColor?: string;
		locationBoxBgColor?: string;
		showImageFade?: boolean;
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
		showDateIcon,
		time,
		showTimeIcon,
		location,
		showLocationIcon,
		address,
		useLightRays,
		lightRaysColor,
		logoSize,
		infoBoxBgColor,
		dateTimeBoxBgColor,
		locationBoxBgColor,
		showImageFade,
	} = data;

	const { projectName } = general;

	const hasLogo = true;
	const logoFilename = extractFilename(data.logo);
	const logoSource = logoFilename
		? `img/hero/${logoFilename}`
		: "img/hero/marca-do-projeto.webp";
	const logoPath = resolveAssetUrl(logoSource, general?.directoryName);
	const backgroundFilename = extractFilename(data.backgroundUrl);
	const heroBackgroundSource = backgroundFilename
		? `img/hero/${backgroundFilename}`
		: "img/hero/header.webp";
	const backgroundUrl = resolveAssetUrl(
		heroBackgroundSource,
		general?.directoryName,
	);
	const useHeroBackground = data.useBackgroundImage !== false;
	const infoBoxTextClass = "text-gray-900";
	const renderDateIcon = showDateIcon !== false;
	const renderTimeIcon = showTimeIcon !== false;
	const renderLocationIcon = showLocationIcon !== false;
	const showHeroImageFade = showImageFade !== false;
	const logoSizeClass =
		logoSize === "grande"
			? "max-h-40 md:max-h-64"
			: logoSize === "pequeno"
				? "max-h-20 md:max-h-24"
				: "max-h-28 md:max-h-40";
	const infoBoxStyle = {
		backgroundColor:
			infoBoxBgColor ||
			dateTimeBoxBgColor ||
			locationBoxBgColor ||
			"rgba(244, 244, 245, 0.8)",
	};

	return (
		<section
			{...props}
			className="relative flex flex-col items-center justify-center md:rounded-xl shadow-lg bg-center bg-no-repeat bg-cover overflow-hidden py-20 md:py-10"
			style={{
				backgroundImage:
					useHeroBackground && backgroundUrl
						? `url('${backgroundUrl}')`
						: undefined,
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
			<div className="absolute inset-0 z-0 bg-black/30 pointer-events-none" />
			{showHeroImageFade && (
				<div className="absolute inset-0 z-0 bg-linear-to-b from-black/25 via-transparent to-black/35 pointer-events-none" />
			)}
			{/* 📦 Conteúdo principal */}
			<div className="relative z-10 text-center w-full mx-auto px-4">
				{/* Logo ou nome do projeto */}
				<div className="mb-6">
					{hasLogo ? (
						<img
							src={logoPath}
							alt={projectName || "Logo do Projeto"}
							className={`mx-auto h-auto w-auto max-w-[80vw] sm:max-w-[26rem] object-contain ${logoSizeClass}`}
						/>
					) : (
						<h1 className="text-3xl md:text-5xl font-bold text-(--title)">
							{projectName}
						</h1>
					)}
				</div>

				{/* Subtítulo */}
				{subtitle && (
					<p
						className="text-lg md:text-2xl md:max-w-xl mx-auto mb-8 text-shadow-2xl"
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
								className={`info-box flex items-center gap-2 backdrop-blur-md rounded-lg px-4 py-2 ${infoBoxTextClass}`}
								style={infoBoxStyle}
							>
								{renderDateIcon && <span className="text-2xl">🗓️</span>}
								<span className="font-bold text-xl md:text-2xl">{date}</span>
							</div>
						)}
						{time && (
							<div
								className={`info-box flex items-center gap-2 backdrop-blur-md rounded-lg px-4 py-2 ${infoBoxTextClass}`}
								style={infoBoxStyle}
							>
								{renderTimeIcon && <span className="text-2xl">⏰</span>}
								<span className="font-bold text-xl md:text-2xl">{time}</span>
							</div>
						)}
						{(location || address) && (
							<div
								className={`info-box flex items-center gap-2 backdrop-blur-md rounded-lg px-4 py-2 text-center md:text-left ${infoBoxTextClass}`}
								style={infoBoxStyle}
							>
								<div className="flex flex-col">
									{location && (
										<span className="font-bold block text-lg md:text-xl text-pretty">
											{renderLocationIcon ? `📍 ${location}` : location}
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
