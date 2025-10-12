import { ParticipantDrawer } from '@/components/participant-drawer'
import { TitleSection } from '@/components/title-sections'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import landing from '@/landing.json'

// 🔹 Tipo mínimo para os participantes
type Participant = {
  name: string
  position?: string
  photo: string
}

export function Participants(props: React.HTMLAttributes<HTMLElement>) {
  // 🔹 Tipando o array vindo do JSON
  const participantsGroups = (
    landing as {
      participants: {
        title: string
        groups: { id: string; label: string; participants: Participant[] }[]
      }
    }
  ).participants.groups

  // Flatten all participants from all groups
  const participants: Participant[] = participantsGroups.flatMap(
    group => group.participants
  )

  return (
    <section id="speakers">
      <span {...props}>
        <TitleSection name="Participantes" />
      </span>
      <div
        className="container w-11/12 px-4 md:px-14 mx-auto py-16 bg-[var(--light)] md:rounded-xl"
        {...props}
      >
        <Carousel className="w-full max-w-6xl mx-auto" opts={{ loop: true }}>
          <CarouselContent className=" rounded-4xl">
            {participants.map((p: Participant) => (
              <CarouselItem
                key={p.name}
                className=" md:basis-1/3 lg:basis-1/4 flex justify-center "
              >
                <ParticipantDrawer
                  name={p.name}
                  position={p.position ?? ''}
                  photo={p.photo}
                  trigger={
                    <div className="relative group cursor-pointer ">
                      <img
                        src={`/public/img/participantes/${p.photo}`}
                        alt={p.name}
                        className="w-64 h-64 object-cover shadow border border-[var(--text)] hover:brightness-75 transition "
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white leading-tight text-lg font-semibold pl-5 pr-16 pb-4 pt-16">
                        {p.name}
                      </div>
                    </div>
                  }
                />
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
