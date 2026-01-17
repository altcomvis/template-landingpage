import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowDownUp, X } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/* ──────────────────────────────── */
/* Tipos compatíveis com o JSON */
interface Participant {
	id: string;
	name: string;
	photo: string;
	position?: string;
}

export interface ScheduleItem {
	id: string;
	time: string;
	title: string;
	type: "simple" | "panel";
	description?: string;
	speakers?: Participant[];
	mediators?: Participant[];
}

interface ScheduleFormProps {
	data: {
		participants?: {
			title: string;
			groups: { id: string; label: string; participants: Participant[] }[];
		};
		schedule?: { title: string; panels: ScheduleItem[]; visible?: boolean };
	};
	setData: (newData: Record<string, unknown>) => void;
}

function SortablePersonRow({
	person,
	onRemove,
}: {
	person: Participant;
	onRemove: () => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: person.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="mt-3 p-3 border rounded-md bg-white flex items-center justify-between"
		>
			{/* Esquerda: drag handle + info */}
			<div className="flex items-center gap-3">
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className="text-zinc-400 cursor-grab active:cursor-grabbing select-none"
					{...attributes}
					{...listeners}
				>
					<ArrowDownUp size={16} />
				</Button>

				{person.photo && (
					<img
						src={person.photo}
						alt={person.name}
						className="w-10 h-10 rounded-full object-cover"
					/>
				)}

				<div className="flex flex-col">
					<span className="font-medium text-sm">{person.name}</span>
					{person.position && (
						<span className="text-xs text-zinc-500">{person.position}</span>
					)}
				</div>
			</div>

			{/* Botão de remover */}
			<Button
				type="button"
				size="icon"
				variant="ghost"
				onClick={onRemove}
				aria-label="Remover"
			>
				<X size={14} />
			</Button>
		</div>
	);
}

/* ──────────────────────────────── */
/* Campo de busca para adicionar participante */
function ParticipantSearch({
	label,
	existing,
	allExcluded = [], // 🟢 novos: participantes já usados no painel (speakers + mediators)
	participants,
	onSelect,
}: {
	label: string;
	existing: Participant[];
	allExcluded?: Participant[];
	participants: Participant[];
	onSelect: (p: Participant) => void;
}) {
	// 🟢 agora remove duplicados globais (quem já está em qualquer lista do painel)
	const available = participants.filter(
		(p) =>
			!existing.some((e) => e.id === p.id) &&
			!allExcluded.some((e) => e.id === p.id),
	);
	return (
		<Popover>
			<div className="flex justify-between items-center">
				<Label className="font-semibold">{label}</Label>
				<PopoverTrigger asChild>
					<Button type="button" variant="outline" size="sm">
						+ Adicionar
					</Button>
				</PopoverTrigger>
			</div>

			<PopoverContent className="w-80 p-0" align="start">
				<Command>
					<CommandInput placeholder="Buscar participante..." />
					<CommandEmpty>Nenhum participante encontrado.</CommandEmpty>
					<CommandGroup heading="Participantes">
						{available.map((p) => (
							<CommandItem
								key={p.id}
								value={p.name}
								onSelect={() => onSelect(p)}
							>
								<div className="flex items-center gap-2">
									{p.photo && (
										<img
											src={p.photo}
											alt={p.name}
											className="w-6 h-6 rounded-full object-cover"
										/>
									)}
									<div>
										<p className="text-sm font-medium">{p.name}</p>
										{p.position && (
											<p className="text-xs text-zinc-500">{p.position}</p>
										)}
									</div>
								</div>
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

/* ──────────────────────────────── */
/* Bloco sortável (cada item da agenda) */
function SortableScheduleItem({
	item,
	index,
	sensors,
	updateItem,
	removeItem,
	allParticipants,
}: {
	item: ScheduleItem;
	index: number;
	sensors: ReturnType<typeof useSensors>;
	updateItem: (
		index: number,
		field: keyof ScheduleItem,
		value: string | Participant[],
	) => void;
	removeItem: (index: number) => void;
	allParticipants: Participant[];
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: item.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	// Reorder helpers
	const handleReorder = (
		ev: DragEndEvent,
		field: keyof ScheduleItem,
		list: Participant[] = [],
	) => {
		const { active, over } = ev;
		if (!over || active.id === over.id) return;
		const oldIndex = list.findIndex((p) => p.id === active.id);
		const newIndex = list.findIndex((p) => p.id === over.id);
		updateItem(index, field, arrayMove(list, oldIndex, newIndex));
	};

	// Add/remove helpers
	const addPerson = (field: keyof ScheduleItem, person: Participant) => {
		const list = (item[field] as Participant[]) || [];
		updateItem(index, field, [...list, person]);
	};

	const removePerson = (field: keyof ScheduleItem, pi: number) => {
		const arr = ((item[field] as Participant[]) || []).filter(
			(_, i) => i !== pi,
		);
		updateItem(index, field, arr);
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="border-t pt-6 mt-6 space-y-4 bg-zinc-50 hover:bg-zinc-100 transition rounded-md p-4"
		>
			{/* Cabeçalho */}
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant="ghost"
						className="text-zinc-400 cursor-grab active:cursor-grabbing select-none"
						{...attributes}
						{...listeners}
					>
						<ArrowDownUp />
					</Button>
					<h4 className="font-semibold text-lg">
						{item.type === "simple" ? "Bloco Simples" : "Painel"}
					</h4>
				</div>

				<Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
					<X />
				</Button>
			</div>

			{/* Campos básicos */}
			<div className="flex flex-col gap-2">
				<Label>Horário</Label>
				<Input
					value={item.time}
					onChange={(e) => updateItem(index, "time", e.target.value)}
					placeholder="Ex: 9h30"
				/>
			</div>

			<div className="flex flex-col gap-2">
				<Label>Título</Label>
				<Input
					value={item.title}
					onChange={(e) => updateItem(index, "title", e.target.value)}
					placeholder="Ex: Abertura, Welcome Coffee, Painel 1, Talk..."
				/>
			</div>

			{/* Painel */}
			{item.type === "panel" && (
				<>
					<div className="flex flex-col gap-2">
						<Label>Descrição</Label>
						<Textarea
							value={item.description || ""}
							onChange={(e) => updateItem(index, "description", e.target.value)}
							placeholder="Resumo do painel..."
						/>
					</div>

					{/* Palestrantes */}
					<div className="border-t pt-4 mt-4">
						<ParticipantSearch
							label="Palestrantes"
							existing={item.speakers || []}
							allExcluded={item.speakers || []}
							participants={allParticipants}
							onSelect={(p) =>
								addPerson("speakers", {
									id: p.id,
									name: p.name,
									photo: p.photo,
								})
							}
						/>

						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={(ev) =>
								handleReorder(ev, "speakers", item.speakers || [])
							}
						>
							<SortableContext
								items={(item.speakers || []).map((s) => s.id)}
								strategy={verticalListSortingStrategy}
							>
								{(item.speakers || []).map((spk, si) => (
									<SortablePersonRow
										key={spk.id}
										person={spk}
										onRemove={() => removePerson("speakers", si)}
									/>
								))}
							</SortableContext>
						</DndContext>
					</div>

					{/* Mediadores */}
					<div className="border-t pt-4 mt-4">
						<ParticipantSearch
							label="Mediadores"
							existing={item.mediators || []}
							allExcluded={item.speakers || []}
							participants={allParticipants}
							onSelect={(p) =>
								addPerson("mediators", {
									id: p.id,
									name: p.name,
									photo: p.photo,
								})
							}
						/>

						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={(ev) =>
								handleReorder(ev, "mediators", item.mediators || [])
							}
						>
							<SortableContext
								items={(item.mediators || []).map((m) => m.id)}
								strategy={verticalListSortingStrategy}
							>
								{(item.mediators || []).map((med, mi) => (
									<SortablePersonRow
										key={med.id}
										person={med}
										onRemove={() => removePerson("mediators", mi)}
									/>
								))}
							</SortableContext>
						</DndContext>
					</div>
				</>
			)}
		</div>
	);
}

/* ──────────────────────────────── */
/* Componente principal */
export default function ScheduleForm({ data, setData }: ScheduleFormProps) {
	const scheduleData = data.schedule || { title: "", panels: [] };
	const [schedule, setSchedule] = useState<ScheduleItem[]>(scheduleData.panels);

	// junta todos os participantes dos grupos
	const allParticipants = useMemo(
		() =>
			(data.participants?.groups || []).flatMap((g) => g.participants || []),
		[data.participants],
	);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor),
	);

	const updateSchedule = (newSchedule: ScheduleItem[]) => {
		setSchedule(newSchedule);
		setData({ ...data, schedule: { ...scheduleData, panels: newSchedule } });
	};

	const addItem = (type: "simple" | "panel") => {
		const newItem: ScheduleItem =
			type === "simple"
				? { id: crypto.randomUUID(), time: "", title: "", type }
				: {
						id: crypto.randomUUID(),
						time: "",
						title: "",
						description: "",
						type,
						speakers: [],
						mediators: [],
					};
		updateSchedule([...schedule, newItem]);
	};

	const updateItem = (
		index: number,
		field: keyof ScheduleItem,
		value: string | Participant[],
	) => {
		const updated = [...schedule];
		updated[index] = { ...updated[index], [field]: value as never };
		updateSchedule(updated);
	};

	const removeItem = (index: number) => {
		updateSchedule(schedule.filter((_, i) => i !== index));
	};

	const onDragEndPanels = (ev: DragEndEvent) => {
		const { active, over } = ev;
		if (!over || active.id === over.id) return;
		const oldIndex = schedule.findIndex((i) => i.id === active.id);
		const newIndex = schedule.findIndex((i) => i.id === over?.id);
		updateSchedule(arrayMove(schedule, oldIndex, newIndex));
	};

	return (
		<Card className="mt-6">
			<CardContent className="space-y-6 p-6">
				{/* Botões de adicionar blocos */}

				<div className="flex justify-between items-center">
					<div className="flex gap-3">
						<Button type="button" onClick={() => addItem("simple")}>
							+ Adicionar Bloco Simples
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => addItem("panel")}
						>
							+ Adicionar Painel
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<Label>Exibir/Ocultar Seção</Label>
						<Switch
							checked={data.schedule?.visible ?? true}
							onCheckedChange={(checked) =>
								setData({
									...data,
									schedule: { ...(data.schedule || {}), visible: checked },
								})
							}
						/>
					</div>
				</div>

				{/* Lista de blocos */}
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={onDragEndPanels}
				>
					<SortableContext
						items={schedule.map((i) => i.id)}
						strategy={verticalListSortingStrategy}
					>
						{schedule.map((item, i) => (
							<SortableScheduleItem
								key={item.id}
								item={item}
								index={i}
								sensors={sensors}
								allParticipants={allParticipants}
								updateItem={updateItem}
								removeItem={removeItem}
							/>
						))}
					</SortableContext>
				</DndContext>
			</CardContent>
		</Card>
	);
}
