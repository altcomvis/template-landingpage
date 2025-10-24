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
import { ArrowDownUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

/* ──────────────────────────────── */
/* Tipos */
interface FormField {
	id: string;
	label: string;
	visible: boolean;
}

interface FormsConfig {
	FORMS_URL_BASE64: string;
	QUESTION_IDS: Record<string, string>;
}

interface CustomSelectOption {
	id: number;
	label: string;
	visible: boolean;
}

interface CustomSelect {
	label: string;
	description?: string;
	selection: "radio" | "checkbox";
	visible: boolean;
	options: CustomSelectOption[];
}

interface SubscribeData {
	title: string;
	description: string;
	successTitle: string;
	successMessage: string;
	formsConfig: FormsConfig;
	fields: FormField[];
	customSelect?: CustomSelect;
	visible?: boolean;
}

interface SubscribeFormProps {
	data: { subscribe?: SubscribeData; visible?: boolean };
	setData: (newData: Record<string, unknown>) => void;
}

/* ──────────────────────────────── */
/* Item sortável individual */
function SortableSelectOption({
	option,
	index,
	onRemove,
	onLabelChange,
}: {
	option: CustomSelectOption;
	index: number;
	onRemove: (index: number) => void;
	onLabelChange: (index: number, label: string) => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: option.id });
	const style = { transform: CSS.Transform.toString(transform), transition };

	return (
		<div
			ref={setNodeRef}
			style={style}
			className="mt-2 flex justify-between items-center border rounded-md p-2 bg-zinc-50 hover:bg-zinc-100 transition"
		>
			<div className="flex items-center gap-2">
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
				<Input
					value={option.label}
					onChange={(e) => onLabelChange(index, e.target.value)}
					className="text-sm"
				/>
			</div>

			<Button
				type="button"
				size="icon"
				variant="ghost"
				aria-label="Remover"
				onClick={() => onRemove(index)}
			>
				<X size={14} />
			</Button>
		</div>
	);
}

/* ──────────────────────────────── */
/* Componente principal */
export default function SubscribeForm({ data, setData }: SubscribeFormProps) {
	const subscribe = data.subscribe || {
		title: "Inscrição",
		description: "Preencha o formulário para participar.",
		successTitle: "Inscrição enviada!",
		successMessage:
			"Obrigado pela sua inscrição. Em breve entraremos em contato.",
		formsConfig: {
			FORMS_URL_BASE64: "",
			QUESTION_IDS: {},
		},
		fields: [],
		customSelect: {
			label: "Selecione o tema de interesse",
			description: "Escolha uma das opções abaixo.",
			selection: "radio",
			visible: false,
			options: [],
		},
	};

	const [localData, setLocalData] = useState<SubscribeData>(subscribe);
	const sensors = useSensors(useSensor(PointerSensor));

	// ✅ Fallback seguro para evitar undefined
	const customSelect = localData.customSelect ?? {
		label: "",
		description: "",
		selection: "radio" as const,
		visible: false,
		options: [],
	};

	/* DND */
	const handleDragEnd = (event: any) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		const oldIndex = customSelect.options.findIndex(
			(opt) => opt.id === active.id,
		);
		const newIndex = customSelect.options.findIndex(
			(opt) => opt.id === over.id,
		);
		if (oldIndex! >= 0 && newIndex! >= 0) {
			const newOptions = arrayMove(customSelect.options, oldIndex!, newIndex!);
			updateCustomSelect({ options: newOptions });
		}
	};

	/* Inicialização */
	useEffect(() => {
		const currentConfig = localData.formsConfig || {
			FORMS_URL_BASE64: "",
			QUESTION_IDS: {},
		};

		if (
			!currentConfig.QUESTION_IDS ||
			Object.keys(currentConfig.QUESTION_IDS).length === 0
		) {
			currentConfig.QUESTION_IDS = {
				name: "r9dd6878a382646f5824c28921a3b606d",
				email: "r61251a298dfe46cf92b3d3bdec15ebf5",
				phone: "r386e88a11a544391b709260d5e958987",
				document: "ra401d13ed8b84f5cbd4dca4ffc3890e6",
				position: "r754d4abcd5bc468e80cf3bcd257c4c85",
				company: "r77a287a58cf546799522b6464ed55f92",
				message: "rdc65760d76e640bd9b20ecc7fab55668",
				optin1: "rbe00f0945a944e37a8ee6d4499bcf6c3",
				optin2: "raa64c101a351475d94f1bf1789d71d6c",
			};
		}

		if (!localData.fields || localData.fields.length === 0) {
			const defaultFields = Object.entries(currentConfig.QUESTION_IDS).map(
				([key, id]) => ({
					id,
					label: key,
					visible: true,
				}),
			);

			const updated: SubscribeData = {
				...localData,
				formsConfig: currentConfig,
				fields: defaultFields,
			};

			setLocalData(updated);
			setData({ ...data, subscribe: updated });
		}
	}, [localData, data, setData]);

	/* Helpers */
	const updateField = (field: keyof SubscribeData, value: string) => {
		const updated = { ...localData, [field]: value };
		setLocalData(updated);
		setData({ ...data, subscribe: updated });
	};

	const updateCustomSelect = (update: Partial<CustomSelect>) => {
		const updated = {
			...localData,
			customSelect: { ...customSelect, ...update },
		};
		setLocalData(updated);
		setData({ ...data, subscribe: updated });
	};

	const toggleFieldVisibility = (id: string) => {
		const updatedFields = localData.fields.map((f) =>
			f.id === id ? { ...f, visible: !f.visible } : f,
		);
		const updated = { ...localData, fields: updatedFields };
		setLocalData(updated);
		setData({ ...data, subscribe: updated });
	};

	const handleRemoveOption = (index: number) => {
		const newOptions = customSelect.options.filter((_, i) => i !== index);
		updateCustomSelect({ options: newOptions });
	};

	const handleLabelChange = (index: number, label: string) => {
		const newOptions = customSelect.options.map((opt, i) =>
			i === index ? { ...opt, label } : opt,
		);
		updateCustomSelect({ options: newOptions });
	};

	const getLabelName = (label: string) => {
		const map: Record<string, string> = {
			name: "Nome completo",
			email: "E-mail",
			phone: "Telefone",
			document: "Documento",
			position: "Cargo",
			company: "Empresa",
			message: "Mensagem",
			optin1: "Opt-in 1",
			optin2: "Opt-in 2",
		};
		return map[label] || label;
	};

	/* ──────────────────────────────── */
	return (
		<Card className="mt-6">
			<CardContent className="space-y-8 p-6">
				{/* Exibir/Ocultar seção */}
				<div className="flex justify-end items-center">
					<div className="flex items-center gap-3">
						<Label>Exibir/Ocultar Seção</Label>
						<Switch
							checked={data.subscribe?.visible ?? true}
							onCheckedChange={(checked) =>
								setData({
									...data,
									subscribe: { ...(data.subscribe || {}), visible: checked },
								})
							}
						/>
					</div>
				</div>

				{/* Cabeçalho */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label>Título</Label>
						<Input
							value={localData.title}
							onChange={(e) => updateField("title", e.target.value)}
						/>
					</div>

					<div>
						<Label>Descrição</Label>
						<Textarea
							value={localData.description}
							onChange={(e) => updateField("description", e.target.value)}
						/>
					</div>
				</div>

				{/* Mensagens de sucesso */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<Label>Título de Sucesso</Label>
						<Input
							value={localData.successTitle}
							onChange={(e) => updateField("successTitle", e.target.value)}
						/>
					</div>

					<div>
						<Label>Mensagem de Sucesso</Label>
						<Textarea
							value={localData.successMessage}
							onChange={(e) => updateField("successMessage", e.target.value)}
						/>
					</div>
				</div>

				{/* Configuração do Forms */}
				<div className="border-t pt-4 mt-6">
					<Label className="text-lg font-semibold">
						Configuração do Formulário
					</Label>
					<div className="mt-2 space-y-4">
						<div>
							<Label>URL do Microsoft Forms</Label>
							<Input
								value={localData.formsConfig.FORMS_URL_BASE64}
								placeholder="Cole aqui a URL completa"
								onChange={(e) => {
									const inputValue = e.target.value.trim();
									const isBase64 =
										/^[A-Za-z0-9+/]+={0,2}$/.test(inputValue) &&
										inputValue.length % 4 === 0;
									const encodedValue = isBase64 ? inputValue : btoa(inputValue);
									const updated = {
										...localData,
										formsConfig: {
											...localData.formsConfig,
											FORMS_URL_BASE64: encodedValue,
										},
									};
									setLocalData(updated);
									setData({ ...data, subscribe: updated });
								}}
							/>
						</div>
					</div>
				</div>

				{/* Campos padrão */}
				{localData.fields?.length > 0 && (
					<div className="mt-8">
						<Label className="text-lg font-semibold mb-4 block">
							Campos do Formulário (MS Forms)
						</Label>
						<div className="grid md:grid-rows-3 lg:grid-rows-3 md:grid-flow-col gap-4">
							{localData.fields.map((field) => (
								<div
									key={field.id}
									className="flex items-center justify-between border rounded-lg p-3 bg-zinc-50 hover:bg-zinc-100 transition"
								>
									<span className="font-medium text-sm">
										{getLabelName(field.label)}
									</span>
									<Switch
										checked={field.visible}
										onCheckedChange={() => toggleFieldVisibility(field.id)}
									/>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Campo Select Personalizado */}
				<div className="border-t pt-6 mt-6">
					<Label className="text-lg font-semibold mb-3 block">
						Seleção de opções
					</Label>

					<div className="flex items-center gap-3 mb-3">
						<Switch
							checked={customSelect.visible}
							onCheckedChange={(checked) =>
								updateCustomSelect({ ...customSelect, visible: checked })
							}
						/>
						<Label>Exibir campo</Label>
					</div>

					{customSelect.visible && (
						<div className="space-y-4">
							<div className="flex flex-col gap-2">
								<Label>Título</Label>
								<Input
									placeholder="Ex.: Selecione a Data"
									value={customSelect.label}
									onChange={(e) =>
										updateCustomSelect({ label: e.target.value })
									}
								/>
							</div>

							<div className="flex flex-col gap-2">
								<Label>Descrição</Label>
								<Textarea
									placeholder="Ex.: Escolha as opções que deseja participar."
									value={customSelect.description}
									onChange={(e) =>
										updateCustomSelect({ description: e.target.value })
									}
								/>
							</div>

							{/* Tipo de seleção */}
							<div className="flex items-center gap-3">
								<Switch
									checked={customSelect.selection === "checkbox"}
									onCheckedChange={(checked) =>
										updateCustomSelect({
											selection: checked ? "checkbox" : "radio",
										})
									}
								/>
								<Label>
									{customSelect.selection === "radio"
										? "Seleção única (Se for apenas uma opção)"
										: "Seleção múltipla (Se for mais de uma opção)"}
								</Label>
							</div>

							{/* Opções */}
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext
									items={customSelect.options.map((o) => o.id)}
									strategy={verticalListSortingStrategy}
								>
									<div className="space-y-2 ">
										{customSelect.options.map((opt, i) => (
											<SortableSelectOption
												key={opt.id}
												option={opt}
												index={i}
												onRemove={handleRemoveOption}
												onLabelChange={handleLabelChange}
											/>
										))}
									</div>
								</SortableContext>
							</DndContext>

							<Button
								variant="outline"
								size="sm"
								disabled={customSelect.options.length >= 10}
								onClick={() => {
									const newOption = {
										id: Date.now(),
										label: `Opção ${customSelect.options.length + 1}`,
										visible: true,
									};
									updateCustomSelect({
										options: [...customSelect.options, newOption],
									});
								}}
								className="mt-3"
							>
								+ Adicionar Opção
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
