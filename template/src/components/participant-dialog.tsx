import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { getBasePath } from "@/utils/getBasePath";

type ParticipantProps = {
	name: string;
	position?: string;
	photo: string;
	trigger?: React.ReactNode;
};

export function ParticipantDialog({
	name,
	position,
	photo,
	trigger,
}: ParticipantProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<img
						src={`${getBasePath()}img/participantes/${photo}`}
						alt={name}
						className="w-16 h-16 rounded-full object-cover cursor-pointer hover:scale-105 transition "
					/>
				)}
			</DialogTrigger>

			<DialogContent
				onOpenAutoFocus={(e) => e.preventDefault()}
				className="border-zinc-400 bg-zinc-200"
			>
				<div className="flex flex-col md:flex-row gap-4 mx-auto py-10">
					<img
						src={`${getBasePath()}img/participantes/${photo}`}
						alt={name}
						className="w-48 mx-auto border border-zinc-300 shadow"
					/>

					<DialogHeader>
						<DialogTitle className="md:text-left text-2xl text-zinc-500">
							{name}
						</DialogTitle>
						<DialogDescription className="md:text-left text-base text-zinc-500">
							{position}
						</DialogDescription>
					</DialogHeader>
				</div>
				<DialogFooter className="md:w-4/12 mx-auto">
					<DialogClose asChild>
						<Button>Fechar</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
