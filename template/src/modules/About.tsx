import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from 'react-icons/fa'

const iconMap: Record<string, React.ElementType> = {
  youtube: FaYoutube,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  tiktok: FaTiktok,
  facebook: FaFacebook,
}

interface AboutProps extends React.HTMLAttributes<HTMLElement> {
  data: {
    subtitle: string
    socialTitle: string
    paragraphs: string[]
    showTransmission: boolean
    socialBlocks: {
      id: string
      label: string
      icons: { id: string; icon: string; url: string }[]
    }[]
  }
}

/**
 * About section — versão adaptada
 * - Recebe os dados via props (não importa o JSON diretamente)
 * - Suporta HTML básico em `paragraphs` (para bold/itálico/sublinhado)
 */
export function About({ data, ...props }: AboutProps) {
  const { subtitle, socialTitle, paragraphs, showTransmission, socialBlocks } =
    data

  return (
    <section id="about" className="w-10/12 md:w-full mx-auto py-8 md:py-16">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        {/* Subtítulo principal */}
        {subtitle && (
          <h3 className="text-3xl font-semibold mb-6" {...props}>
            {subtitle}
          </h3>
        )}

        {/* Texto descritivo com suporte a HTML */}
        <div
          className="text-(--text) text-xl pb-16 text-pretty max-w-[60ch] mx-auto"
          {...props}
        >
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-(--text) leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: p }}
            />
          ))}
        </div>

        {/* 🎥 Bloco de Transmissão */}
        {showTransmission && (
          <div
            className="w-10/12 md:w-6/12 mx-auto border-t border-b border-zinc-500 py-12"
            {...props}
          >
            <h2 className="text-2xl font-bold mb-6 text-(--light)" {...props}>
              {socialTitle}
            </h2>

            <div
              className="flex justify-center gap-6 md:gap-12 flex-wrap"
              {...props}
            >
              {socialBlocks.map(block => (
                <div key={block.id} className="text-center">
                  <p className="font-semibold mb-2">{block.label}</p>
                  <div className="flex gap-4 justify-center">
                    {block.icons.map(icon => {
                      const Icon = iconMap[icon.icon]
                      return (
                        <a
                          key={icon.id}
                          href={icon.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center text-2xl text-(--text) hover:text-(--light) hover:scale-110 transition-transform"
                        >
                          {Icon && <Icon />}
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
