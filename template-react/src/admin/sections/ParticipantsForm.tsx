import {
	closestCenter,
	DndContext,
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
import { ArrowDownUp, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Participant {
	id: string;
	name: string;
	position: string;
	photo: string;
}

interface ParticipantGroup {
	id: string;
	label: string;
	participants: Participant[];
}

interface ParticipantsFormProps {
	data: {
		participants?: {
			title: string;
			groups: ParticipantGroup[];
			visible?: boolean;
		};
	};
	setData: (newData: Record<string, unknown>) => void;
}

/* Item individual arrastável (Participante) */
function SortableParticipantItem({
	participant,
	onUpdate,
	onRemove,
}: {
	participant: Participant;
	onUpdate: (field: keyof Participant, value: string) => void;
	onRemove: () => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: participant.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="flex items-center gap-2 bg-white border rounded-md p-2 mt-2"
		>
			<Button
				variant="ghost"
				size="icon"
				className="text-zinc-400 cursor-grab active:cursor-grabbing select-none"
				{...attributes}
				{...listeners}
			>
				<ArrowDownUp size={16} />
			</Button>
			<Input
				placeholder="Nome"
				value={participant.name}
				onChange={(e) => onUpdate("name", e.target.value)}
			/>
			<Input
				placeholder="Cargo"
				value={participant.position}
				onChange={(e) => onUpdate("position", e.target.value)}
			/>
			<Input
				placeholder="Foto (URL)"
				value={participant.photo}
				onChange={(e) => onUpdate("photo", e.target.value)}
			/>
			<Button variant="ghost" size="icon" onClick={onRemove}>
				<X size={16} />
			</Button>
		</div>
	);
}

/* Bloco arrastável (Grupo de Participantes) */
function SortableGroup({
	group,
	onUpdateLabel,
	onAddParticipant,
	onRemoveGroup,
	onUpdateParticipant,
	onRemoveParticipant,
	onReorderParticipants,
}: {
	group: ParticipantGroup;
	onUpdateLabel: (label: string) => void;
	onAddParticipant: () => void;
	onRemoveGroup: () => void;
	onUpdateParticipant: (
		participantId: string,
		field: keyof Participant,
		value: string,
	) => void;
	onRemoveParticipant: (participantId: string) => void;
	onReorderParticipants: (newOrder: Participant[]) => void;
}) {
	const sensors = useSensors(useSensor(PointerSensor));
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: group.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	const onDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = group.participants.findIndex((p) => p.id === active.id);
		const newIndex = group.participants.findIndex((p) => p.id === over.id);
		onReorderParticipants(arrayMove(group.participants, oldIndex, newIndex));
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="bg-zinc-50 rounded-lg border p-4 mt-6"
		>
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="text-zinc-400 cursor-grab active:cursor-grabbing select-none"
						{...attributes}
						{...listeners}
					>
						<ArrowDownUp size={16} />
					</Button>
					<Input
						placeholder="Nome do Bloco"
						value={group.label}
						onChange={(e) => onUpdateLabel(e.target.value)}
					/>
				</div>
				<Button variant="ghost" size="icon" onClick={onRemoveGroup}>
					<X />
				</Button>
			</div>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={onDragEnd}
			>
				<SortableContext
					items={group.participants.map((p) => p.id)}
					strategy={verticalListSortingStrategy}
				>
					{group.participants.map((p) => (
						<SortableParticipantItem
							key={p.id}
							participant={p}
							onUpdate={(field, value) =>
								onUpdateParticipant(p.id, field, value)
							}
							onRemove={() => onRemoveParticipant(p.id)}
						/>
					))}
				</SortableContext>
			</DndContext>

			<Button variant="outline" className="mt-3" onClick={onAddParticipant}>
				<Plus size={16} /> Adicionar Participante
			</Button>
		</div>
	);
}

export default function ParticipantsForm({
	data,
	setData,
}: ParticipantsFormProps) {
	const participantsData = data.participants || {
		title: "Participantes",
		groups: [],
	};
	const [groups, setGroups] = useState<ParticipantGroup[]>(
		participantsData.groups,
	);

	const sensors = useSensors(useSensor(PointerSensor));

	const updateAll = (updated: ParticipantGroup[]) => {
		setGroups(updated);
		setData({
			...data,
			participants: { ...participantsData, groups: updated },
		});
	};

	const addGroup = () => {
		const newGroup: ParticipantGroup = {
			id: crypto.randomUUID(),
			label: "Novo Bloco",
			participants: [],
		};
		updateAll([...groups, newGroup]);
	};

	const onDragEndGroups = (event: import("@dnd-kit/core").DragEndEvent) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = groups.findIndex((g) => g.id === active.id);
		const newIndex = groups.findIndex((g) => g.id === over.id);
		updateAll(arrayMove(groups, oldIndex, newIndex));
	};

	return (
		<Card className="mt-6">
			<CardContent className="space-y-6 p-6">
				<div className="flex justify-between items-center">
					<Button onClick={addGroup}>
						<Plus size={16} /> Novo Bloco
					</Button>
					<div className="flex items-center gap-3">
						<Label>Exibir/Ocultar Seção</Label>
						<Switch
							checked={data.participants?.visible ?? true}
							onCheckedChange={(checked) =>
								setData({
									...data,
									participants: {
										...(data.participants || {}),
										visible: checked,
									},
								})
							}
						/>
					</div>
				</div>

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={onDragEndGroups}
				>
					<SortableContext
						items={groups.map((g) => g.id)}
						strategy={verticalListSortingStrategy}
					>
						{groups.map((g, i) => (
							<SortableGroup
								key={g.id}
								group={g}
								onUpdateLabel={(label) => {
									const updated = [...groups];
									updated[i].label = label;
									updateAll(updated);
								}}
								onAddParticipant={() => {
									const newP: Participant = {
										id: crypto.randomUUID(),
										name: "",
										position: "",
										photo: "",
									};
									const updated = [...groups];
									updated[i].participants.push(newP);
									updateAll(updated);
								}}
								onRemoveGroup={() =>
									updateAll(groups.filter((gr) => gr.id !== g.id))
								}
								onUpdateParticipant={(pid, field, value) => {
									const updated = [...groups];
									const participantIndex = updated[i].participants.findIndex(
										(p) => p.id === pid,
									);
									updated[i].participants[participantIndex] = {
										...updated[i].participants[participantIndex],
										[field]: value,
									};
									updateAll(updated);
								}}
								onRemoveParticipant={(pid) => {
									const updated = [...groups];
									updated[i].participants = updated[i].participants.filter(
										(p) => p.id !== pid,
									);
									updateAll(updated);
								}}
								onReorderParticipants={(newOrder) => {
									const updated = [...groups];
									updated[i].participants = newOrder;
									updateAll(updated);
								}}
							/>
						))}
					</SortableContext>
				</DndContext>
			</CardContent>
		</Card>
	);
}
