import { TitleSection } from '@/components/title-sections'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'

type Event = {
  date: string
  image: string
  title: string
  description: string
  ctaLabel: string
  ctaLink: string
}

export function PreviousEventsStructure({
  events,
  title,
  description,
}: {
  events: Event[]
  title: string
  description?: string
}) {
  return (
    <section id="previous-events" className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <TitleSection name={title} description={description} />
        <Carousel className="relative mt-12">
          <CarouselContent className="w-10/12 md:w-auto mx-auto">
            {events.map(event => (
              <CarouselItem
                key={event.title + event.date}
                className="basis-full md:basis-1/2 lg:basis-1/3 px-8 md:px-4"
              >
                <div className="bg-[var(--light)] text-[var(--text)] rounded-xl overflow-hidden shadow-lg flex flex-col h-full">
                  {/* Data */}
                  <div className="bg-[var(--dark)] text-[var(--text)] text-sm font-bold py-2 text-center">
                    {event.date}
                  </div>

                  {/* Imagem */}
                  <img
                    src={`/public/img/edicoes-passadas/${event.image}`}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />

                  {/* Conteúdo */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-2 text-[var(--dark)]">
                      {event.title}
                    </h3>
                    <p className="text-sm text-[var(--dark)] mb-6 flex-1">
                      {event.description}
                    </p>

                    <Button asChild className="font-semibold mt-auto">
                      <a href={event.ctaLink} target="_blank" rel="noreferrer">
                        {event.ctaLabel}
                      </a>
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="absolute left-0 top-1/2 md:px-5 md:-translate-y-1/2 md:-translate-x-12 rounded-r h-full border-none shadow-none  " />
          <CarouselNext className="absolute right-0 top-1/2 md:px-5 md:-translate-y-1/2 md:translate-x-12 rounded-l h-full border-none shadow-none  " />
        </Carousel>
      </div>
    </section>
  )
}
