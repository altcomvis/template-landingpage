import { PreviousEventsStructure } from "@/components/previous-events-structure";

/* ─────────────── Tipagem ─────────────── */
interface PreviousEvent {
	id: string;
	date: string;
	image: string;
	title: string;
	description: string;
	ctaLabel: string;
	ctaLink: string;
}

interface PreviousEventsProps extends React.HTMLAttributes<HTMLElement> {
	data: {
		title: string;
		description?: string;
		visible?: boolean;
		events: PreviousEvent[];
	};
}

/* ─────────────── Componente ─────────────── */
export function PreviousEvents({ data, ...props }: PreviousEventsProps) {
	return (
		<section {...props} id="previous-events">
			<PreviousEventsStructure
				events={data.events}
				title={data.title}
				description={data.description}
			/>
		</section>
	);
}
