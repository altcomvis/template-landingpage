import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { getBasePath } from "@/utils/getBasePath";

type ParticipantProps = {
	name: string;
	position?: string;
	photo: string;
	trigger?: React.ReactNode;
};

export function ParticipantDrawer({
	name,
	position,
	photo,
	trigger,
}: ParticipantProps) {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				{trigger ? (
					trigger
				) : (
					<img
						src={`${getBasePath()}img/participantes/${photo}`}
						alt={name}
						className="w-16 h-16 rounded-full object-cover cursor-pointer hover:scale-105 transition "
					/>
				)}
			</DrawerTrigger>

			<DrawerContent className="border-zinc-400 bg-zinc-200">
				<div className="md:flex gap-4 md:w-4/12 mx-auto py-10">
					<img
						src={`${getBasePath()}img/participantes/${photo}`}
						alt={name}
						className="w-48 mx-auto border border-zinc-300 shadow"
					/>

					<DrawerHeader>
						<DrawerTitle className="md:text-left text-2xl text-zinc-500">
							{name}
						</DrawerTitle>
						<DrawerDescription className="md:text-left text-base text-zinc-500">
							{position}
						</DrawerDescription>
					</DrawerHeader>
				</div>
				<DrawerFooter className="md:w-4/12 mx-auto">
					<DrawerClose asChild>
						<Button>Fechar</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
