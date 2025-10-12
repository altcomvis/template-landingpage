import landing from '@/landing.json'

export function Sponsors() {
  const sponsors = landing.sponsors

  return (
    <section className="py-16 " id="sponsors">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-16">
          {sponsors.map(
            (block: {
              id: string
              label: string
              items: { id: string; name: string }[]
            }) => (
              <div
                key={block.id}
                className="flex flex-col items-center min-w-[13rem]"
              >
                {/* Nome da Chancela */}
                <div className="w-full pb-6 flex flex-col items-center">
                  <p className="text-center text-xs font-light mb-6 uppercase tracking-wide bg-[var(--surface)] z-1 px-3">
                    {block.label}
                  </p>
                  {/* Linha */}
                  <div className="w-full border-t border-zinc-400 -mt-8" />
                </div>

                {/* Logos */}
                <div className="flex justify-center gap-8 flex-wrap md:flex-nowrap">
                  {block.items.map(item => (
                    <img
                      key={item.id}
                      src={`/public/img/marcas/${item.name}`}
                      alt={`${block.label} ${item.name}`}
                      className="h-10 w-auto object-contain"
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  )
}
