import LightRays from '@/components/LightRays'
import landing from '@/landing.json'

export function Hero(props: React.HTMLAttributes<HTMLElement>) {
  const {
    subtitle,
    date,
    time,
    location,
    address,
    useBackgroundImage,
    useLightRays,
    lightRaysColor,
  } = landing.hero
  const { projectName, primaryColor } = landing.general

  const logoPath = '/public/img/project/marca-do-projeto.webp'
  const background = useBackgroundImage
    ? '/public/img/project/header.webp'
    : primaryColor

  const hasLogo = true

  return (
    <section
      {...props}
      className="relative flex flex-col items-center justify-center md:rounded-xl shadow-lg bg-center bg-no-repeat bg-cover overflow-hidden py-20 md:py-6"
      style={{
        backgroundImage: useBackgroundImage ? `url(${background})` : 'none',
        backgroundColor: useBackgroundImage ? 'transparent' : background,
      }}
    >
      {/* 🌤 Light Rays (modo ReactBits atualizado) */}
      {useLightRays && (
        <div className="absolute inset-0 z-0 opacity-70 pointer-events-none">
          <LightRays
            raysOrigin="top-center"
            raysColor={lightRaysColor || '#ffffff'}
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

      {/* Conteúdo principal */}
      <div className="relative z-10 text-center text-[var(--text)] max-w-3xl mx-auto px-4">
        <div className="mb-6">
          {hasLogo ? (
            <img
              {...props}
              src={logoPath}
              alt={projectName || 'Logo do Projeto'}
              className="mx-auto h-64 md:h-90 object-contain"
              loading="lazy"
            />
          ) : (
            <h1 className="text-3xl md:text-5xl font-bold" {...props}>
              {projectName || 'Nome do Projeto'}
            </h1>
          )}
        </div>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-lg md:text-2xl mb-10 leading-relaxed" {...props}>
            {subtitle}
          </p>
        )}

        {/* Boxes de informação */}
        {(date || time || location || address) && (
          <div className="flex gap-4 justify-center items-stretch flex-wrap">
            {date && (
              <div className="flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2" {...props}>
                <span className="text-2xl">📅</span>
                <span className="font-bold text-2xl">{date}</span>
              </div>
            )}
            {time && (
              <div className="flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2" {...props}>
                <span className="text-2xl">⏰</span>
                <span className="font-bold text-2xl">{time}</span>
              </div>
            )}
            {(location || address) && (
              <div className="flex items-center gap-2 bg-zinc-400/50 backdrop-blur-md rounded-lg px-4 py-2  text-center md:text-left" {...props}>
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
  )
}
