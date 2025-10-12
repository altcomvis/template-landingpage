import { PreviousEventsStructure } from '@/components/previous-events-structure'
import landing from '@/landing.json'

export function PreviousEvents(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <div {...props}>
      <PreviousEventsStructure
        events={landing.previousEvents.events}
        title={landing.previousEvents.title}
        description={landing.previousEvents.description}
      />
    </div>
  )
}
