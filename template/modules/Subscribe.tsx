import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import { useToast } from "@/hooks/use-toast";
import { TitleSection } from "../components/title-sections";

interface SubscribeField {
	id: string;
	label: string;
	visible: boolean;
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
	successMessage: string;
	visible: boolean;

	fields: SubscribeField[];
	customSelect?: CustomSelect;

	// CONTROLE DE CAMPANHA
	formActive: boolean;
	formStart: string | null;
	formEnd: string | null;
	closedMessage: string;
}

interface SubscribeProps extends React.HTMLAttributes<HTMLElement> {
	data: SubscribeData;
}

/* ─────────────── CPF / CNPJ ─────────────── */

const formatCPF = (v: string) =>
	v
		.replace(/\D/g, "")
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2")
		.slice(0, 14);

const formatCNPJ = (v: string) =>
	v
		.replace(/\D/g, "")
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2")
		.slice(0, 18);

const validateCPF = (raw: string) => {
	const cpf = raw.replace(/\D/g, "");
	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

	let s = 0;
	for (let i = 0; i < 9; i++) s += Number(cpf[i]) * (10 - i);
	let r = 11 - (s % 11);
	if (r >= 10) r = 0;
	if (r !== Number(cpf[9])) return false;

	s = 0;
	for (let i = 0; i < 10; i++) s += Number(cpf[i]) * (11 - i);
	r = 11 - (s % 11);
	if (r >= 10) r = 0;
	return r === Number(cpf[10]);
};

const validateCNPJ = (raw: string) => {
	const cnpj = raw.replace(/\D/g, "");
	if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;

	const validateDigit = (v: string, length: number) => {
		let sum = 0;
		let pos = length - 7;
		for (let i = length; i >= 1; i--) {
			sum += Number(v[length - i]) * pos--;
			if (pos < 2) pos = 9;
		}
		return sum % 11 < 2 ? 0 : 11 - (sum % 11);
	};

	return (
		validateDigit(cnpj, 12) === Number(cnpj[12]) &&
		validateDigit(cnpj, 13) === Number(cnpj[13])
	);
};

export default function Subscribe({ data, ...props }: SubscribeProps) {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const [successOpen, setSuccessOpen] = useState(false);

	/* ─────────────── CAMPOS VISÍVEIS ─────────────── */

	const visibleLabels = data.fields
		.filter((f) => f.visible)
		.map((f) => f.label.toLowerCase());

	const isVisible = (label: string) =>
		visibleLabels.includes(label.toLowerCase());

	/* ─────────────── SCHEMA DINÂMICO ─────────────── */

	const formSchema = z.object({
		name: isVisible("name")
			? z.string().min(2, "Nome inválido")
			: z.string().optional(),

		document: isVisible("document")
			? z
					.string()
					.min(14, "Documento inválido")
					.refine((v) => {
						const only = v.replace(/\D/g, "");
						return only.length === 11 ? validateCPF(only) : validateCNPJ(only);
					}, "Documento inválido")
			: z.string().optional(),

		email: isVisible("email")
			? z.string().email("Email inválido")
			: z.string().optional(),

		phone: isVisible("phone")
			? z.string().min(1).refine(isValidPhoneNumber, "Telefone inválido")
			: z.string().optional(),

		position: isVisible("position")
			? z.string().min(2, "Cargo inválido")
			: z.string().optional(),

		company: isVisible("company")
			? z.string().min(2, "Empresa inválida")
			: z.string().optional(),

		message: isVisible("message")
			? z.string().min(5, "Mensagem muito curta")
			: z.string().optional(),

		selectOption: z.union([z.string(), z.array(z.string())]).optional(),

		optin1: isVisible("optin1")
			? z.enum(["Aceite1"], "Obrigatório")
			: z.string().optional(),

		optin2: isVisible("optin2")
			? z.enum(["Aceite2"], "Obrigatório")
			: z.string().optional(),
	});

	type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			document: "",
			email: "",
			phone: "",
			position: "",
			company: "",
			message: "",
			selectOption: [],
			optin1: undefined,
			optin2: undefined,
		},
	});

	/* ─────────────── CONTROLE DE CAMPANHA ─────────────── */

	const now = new Date();
	const start = data.formStart ? new Date(data.formStart) : null;
	const end = data.formEnd ? new Date(data.formEnd) : null;

	const isActive =
		data.formActive && (!start || now >= start) && (!end || now <= end);

	if (!isActive) {
		return (
			<Card className="w-lg mx-auto p-6 text-center">
				<h2 className="text-xl font-bold mb-2">Inscrições Encerradas</h2>
				<p className="text-gray-400">{data.closedMessage}</p>
			</Card>
		);
	}

	/* ─────────────── DOCUMENT FORMAT ─────────────── */

	const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const v = e.target.value.replace(/\D/g, "");
		const formatted = v.length <= 11 ? formatCPF(v) : formatCNPJ(v);
		form.setValue("document", formatted, { shouldValidate: true });
	};

	/* ─────────────── SUCESSO ─────────────── */

	const handleSuccessOpenChange = (open: boolean) => {
		setSuccessOpen(open);

		if (!open) {
			form.reset();
			form.clearErrors();
			requestAnimationFrame(() => setFormKey((k) => k + 1));
		}
	};

	/* ─────────────── ENVIO PARA SFMC ─────────────── */

	const onSubmit = async (values: FormValues) => {
		if (loading) return;
		setLoading(true);

		const payload = {
			fullName: values.name,
			cpf: values.document,
			email: values.email,
			phone: values.phone,
			role: values.position,
			company: values.company,
			message: values.message,
			selectOption: values.selectOption,
			termsUsage: values.optin1 === "Aceite1",
			termsData: values.optin2 === "Aceite2",
		};

		try {
			const res = await fetch("/api/sfmc", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const json = await res.json();

			if (!res.ok || !json.success) {
				throw new Error(json.error || "Erro ao enviar formulário");
			}

			setSuccessOpen(true);
		} catch (error) {
			toast({
				title: "Erro no envio",
				description:
					error instanceof Error ? error.message : "Erro desconhecido",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	/* ─────────────── RENDER ─────────────── */

	return (
		// biome-ignore lint: ID fixo necessário para âncoras de navegação
		<Card
			{...props}
			className="w-10/12 md:w-full max-w-3xl mx-auto mt-10 bg-(--surface)"
			id="subscribe"
		>
			<CardContent className="p-6">
				<TitleSection name={data.title} description={data.description} />

				<Form key={formKey} {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col md:grid md:grid-cols-2 gap-4"
					>
						{[
							"name",
							"document",
							"email",
							"phone",
							"position",
							"company",
							"message",
						].map(
							(field) =>
								isVisible(field) && (
									<FormField
										key={field}
										control={form.control}
										name={field as keyof FormValues}
										render={({ field: formField }) => (
											<FormItem
												className={field === "message" ? "col-span-2" : ""}
											>
												<FormControl>
													{field === "phone" ? (
														<PhoneInput
															{...formField}
															value={
																typeof formField.value === "string"
																	? formField.value
																	: ""
															}
															placeholder="Seu telefone"
															international
															defaultCountry="BR"
															onChange={(val) => {
																form.setValue("phone", val || "", {
																	shouldValidate: true,
																});
															}}
															className="border px-2 py-[.35rem] rounded-md text-(--text)/80 text-sm w-full"
														/>
													) : field === "message" ? (
														<Textarea
															{...formField}
															placeholder="Mensagem"
															className="min-h-28"
														/>
													) : (
														<Input
															{...formField}
															placeholder={
																field === "document"
																	? "CPF ou CNPJ"
																	: field === "email"
																		? "Email"
																		: field === "name"
																			? "Nome completo"
																			: field === "position"
																				? "Cargo"
																				: "Empresa"
															}
															onChange={
																field === "document"
																	? handleDocumentChange
																	: formField.onChange
															}
														/>
													)}
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								),
						)}

						{/* Select customizado */}
						{data.customSelect?.visible && (
							<div className="col-span-2 mt-4">
								<Label className="font-semibold">
									{data.customSelect.label}
								</Label>

								{data.customSelect.description && (
									<p className="text-sm text-(--text) mb-3">
										{data.customSelect.description}
									</p>
								)}

								{data.customSelect.selection === "radio" ? (
									<FormField
										control={form.control}
										name="selectOption"
										render={({ field }) => (
											<RadioGroup
												value={(field.value as string) || ""}
												onValueChange={field.onChange}
												className="flex flex-col gap-2"
											>
												{data.customSelect?.options.map((opt) => (
													<Label
														key={opt.id}
														className="flex items-center gap-2"
													>
														<RadioGroupItem value={opt.label} />
														{opt.label}
													</Label>
												))}
											</RadioGroup>
										)}
									/>
								) : (
									<FormField
										control={form.control}
										name="selectOption"
										render={({ field }) => {
											const arr = Array.isArray(field.value) ? field.value : [];
											const toggle = (label: string) =>
												field.onChange(
													arr.includes(label)
														? arr.filter((v) => v !== label)
														: [...arr, label],
												);

											return (
												<div className="flex flex-col gap-2">
													{data.customSelect?.options.map((opt) => (
														<Label
															key={opt.id}
															className="flex items-center gap-2"
														>
															<Checkbox
																checked={arr.includes(opt.label)}
																onCheckedChange={() => toggle(opt.label)}
															/>
															{opt.label}
														</Label>
													))}
												</div>
											);
										}}
									/>
								)}

								<hr className="my-4" />
							</div>
						)}

						{/* Opt-ins */}
						{["optin1", "optin2"].map(
							(opt) =>
								isVisible(opt) && (
									<FormField
										key={opt}
										control={form.control}
										name={opt as keyof FormValues}
										render={({ field }) => (
											<FormItem className="col-span-2">
												<FormControl>
													<RadioGroup
														value={field.value as string}
														onValueChange={field.onChange}
														className="flex flex-col gap-2"
													>
														<div className="flex items-start gap-2">
															<RadioGroupItem
																value={opt === "optin1" ? "Aceite1" : "Aceite2"}
															/>
															<p className="text-sm text-(--text)">
																{opt === "optin1" ? (
																	<>
																		Li e concordo com os{" "}
																		<a
																			href="https://privacidade.globo.com/privacy-policy/"
																			target="_blank"
																			rel="noreferrer"
																			className="underline"
																		>
																			Termos de Uso e Política de Privacidade
																		</a>
																		.
																	</>
																) : (
																	"Autorizo o uso dos meus dados para comunicações."
																)}
															</p>
														</div>
													</RadioGroup>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								),
						)}

						<div className="col-span-2 pt-6">
							<Button
								type="submit"
								disabled={loading}
								className="w-full text-base"
							>
								{loading ? <Loader2 className="animate-spin mr-2" /> : "Enviar"}
							</Button>
						</div>
					</form>
				</Form>

				{/* Modal sucesso */}
				<Dialog open={successOpen} onOpenChange={handleSuccessOpenChange}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Inscrição enviada!</DialogTitle>
							<DialogDescription>{data.successMessage}</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button>Fechar</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
