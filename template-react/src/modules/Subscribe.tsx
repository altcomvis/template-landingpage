import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { TitleSection } from "../components/title-sections";

/* ─────────────── Tipos ─────────────── */
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
	visible: boolean;
	successMessage: string;
	formUrl?: string;
	customSelect?: CustomSelect;
	formsConfig: {
		FORMS_URL_BASE64: string;
		QUESTION_IDS: Record<string, string>;
	};
	fields: SubscribeField[];
}

interface SubscribeProps extends React.HTMLAttributes<HTMLElement> {
	data: SubscribeData;
}

/* ─────────────── Máscaras e validações ─────────────── */
const formatCPF = (value: string) =>
	value
		.replace(/\D/g, "")
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1-$2")
		.slice(0, 14);

const formatCNPJ = (value: string) =>
	value
		.replace(/\D/g, "")
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2")
		.slice(0, 18);

const validateCPF = (raw: string) => {
	const cpf = raw.replace(/\D/g, "");
	if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
	let sum = 0;
	for (let i = 0; i < 9; i++)
		sum += Number.parseInt(cpf.charAt(i), 10) * (10 - i);
	let rev = 11 - (sum % 11);
	if (rev >= 10) rev = 0;
	if (rev !== Number.parseInt(cpf.charAt(9), 10)) return false;
	sum = 0;
	for (let i = 0; i < 10; i++)
		sum += Number.parseInt(cpf.charAt(i), 10) * (11 - i);
	rev = 11 - (sum % 11);
	if (rev >= 10) rev = 0;
	return rev === Number.parseInt(cpf.charAt(10), 10);
};

const validateCNPJ = (raw: string) => {
	const cnpj = raw.replace(/\D/g, "");
	if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
	const validateDigit = (v: string, length: number) => {
		let sum = 0;
		let pos = length - 7;
		for (let i = length; i >= 1; i--) {
			sum += Number.parseInt(v[length - i], 10) * pos--;
			if (pos < 2) pos = 9;
		}
		return sum % 11 < 2 ? 0 : 11 - (sum % 11);
	};
	return (
		validateDigit(cnpj, 12) === Number.parseInt(cnpj[12], 10) &&
		validateDigit(cnpj, 13) === Number.parseInt(cnpj[13], 10)
	);
};

/* ─────────────── Componente principal ─────────────── */
export default function Subscribe({ data, ...props }: SubscribeProps) {
	const { toast } = useToast();
	const [isUploading, setIsUploading] = useState(false);
	const [formKey, setFormKey] = useState(0);
	const [successOpen, setSuccessOpen] = useState(false);

	const visibleLabels = data.fields
		.filter((f) => f.visible)
		.map((f) => f.label.toLowerCase());

	const isVisible = (label: string) =>
		visibleLabels.includes(label.toLowerCase());

	/* ─────────────── Schema dinâmico ─────────────── */
	const buildSchema = () => {
		const shape: Record<string, z.ZodTypeAny> = {};
		const makeOptional = (schema: z.ZodTypeAny) => schema.optional();

		// Campos textuais
		shape.name = isVisible("name")
			? z.string().min(2, "Nome inválido")
			: makeOptional(z.string());

		shape.document = isVisible("document")
			? z
					.string()
					.min(14, "Documento inválido")
					.refine((value) => {
						const only = value.replace(/\D/g, "");
						return only.length === 11 ? validateCPF(only) : validateCNPJ(only);
					}, "Documento inválido")
			: makeOptional(z.string());

		shape.email = isVisible("email")
			? z.string().email("Email inválido")
			: makeOptional(z.string());

		shape.phone = isVisible("phone")
			? z
					.string()
					.min(1, "Telefone obrigatório")
					.refine((phone) => isValidPhoneNumber(phone), {
						message: "Telefone inválido",
					})
			: makeOptional(z.string());

		shape.position = isVisible("position")
			? z.string().min(2, "Cargo inválido")
			: makeOptional(z.string());

		shape.company = isVisible("company")
			? z.string().min(2, "Empresa inválida")
			: makeOptional(z.string());

		shape.message = isVisible("message")
			? z.string().min(5, "Mensagem muito curta")
			: makeOptional(z.string());

		// Seletores e opt-ins
		shape.selectOption = z.union([z.string(), z.array(z.string())]).optional();

		shape.optin1 = isVisible("optin1")
			? z.enum(["Aceite1"], { message: "Obrigatório" })
			: makeOptional(z.string());

		shape.optin2 = isVisible("optin2")
			? z.enum(["Aceite2"], { message: "Obrigatório" })
			: makeOptional(z.string());

		return z.object(shape);
	};

	const formSchema = buildSchema();
	type FormValues = z.infer<typeof formSchema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		mode: "onTouched",
		reValidateMode: "onChange",
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

	const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\D/g, "");
		const formatted = value.length <= 11 ? formatCPF(value) : formatCNPJ(value);
		form.setValue("document", formatted, { shouldValidate: true });
		form.trigger("document");
	};

	const handleSuccessOpenChange = (open: boolean) => {
		setSuccessOpen(open);
		if (!open) {
			form.reset();
			form.clearErrors();
			requestAnimationFrame(() => setFormKey((k) => k + 1));
			window.location.reload();
		}
	};

	const selectType = data.customSelect?.selection ?? "checkbox";
	const BACKEND_URL = "https://backend-form-dusky.vercel.app/api/submit-form";

	const onSubmit: SubmitHandler<FormValues> = async (values) => {
		console.log("🟡 SUBMIT acionado:", values);
		if (isUploading) return;
		setIsUploading(true);
		try {
			const cfg = data.formsConfig;
			if (!cfg.FORMS_URL_BASE64) {
				console.log("⚠️ FORMS_URL_BASE64 não configurado - simulando sucesso");
				await new Promise((resolve) => setTimeout(resolve, 1000));
				setSuccessOpen(true);
				return;
			}

			const formattedSelect = Array.isArray(values.selectOption)
				? values.selectOption.join(", ")
				: values.selectOption || "";

			const answers = Object.entries(values).map(([key, value]) => ({
				questionId: cfg.QUESTION_IDS[key],
				answer1:
					key === "selectOption"
						? formattedSelect
						: typeof value === "string"
							? value
							: JSON.stringify(value),
			}));

			const resp = await fetch(BACKEND_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					target_b64: cfg.FORMS_URL_BASE64,
					startDate: new Date().toISOString(),
					submitDate: new Date().toISOString(),
					answers,
				}),
			});

			if (!resp.ok) throw new Error(`Erro ${resp.status}`);
			setSuccessOpen(true);
		} catch (error) {
			console.error("🔥 Erro no envio:", error);
			toast({
				title: "Erro no envio",
				description:
					error instanceof Error
						? error.message
						: "Não foi possível enviar o formulário.",
				variant: "destructive",
			});
		} finally {
			setIsUploading(false);
		}
	};

	/* Atualiza o form se os campos visíveis mudarem dinamicamente */
	useEffect(() => {
		form.reset(form.getValues(), { keepDefaultValues: true });
	}, [data.fields]);

	return (
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
																form.trigger("phone");
															}}
															className="border px-2 py-[.35rem] rounded-md text-(--text)/80 text-sm w-full"
														/>
													) : field === "message" ? (
														<Textarea
															{...formField}
															value={formField.value as string}
															placeholder="Escreva sua mensagem"
															className="min-h-28 text-(--text)/80"
														/>
													) : (
														<Input
															{...formField}
															value={formField.value as string}
															placeholder={
																field === "document"
																	? "CPF ou CNPJ"
																	: field === "email"
																		? "Seu e-mail"
																		: field === "name"
																			? "Seu nome completo"
																			: field === "position"
																				? "Seu cargo"
																				: field === "company"
																					? "Nome da empresa"
																					: ""
															}
															onChange={
																field === "document"
																	? handleDocumentChange
																	: formField.onChange
															}
															className="text-(--text)/80"
														/>
													)}
												</FormControl>
												{form.formState.touchedFields[field] && <FormMessage />}
											</FormItem>
										)}
									/>
								),
						)}

						{/* Campo select customizado */}
						{data.customSelect?.visible && (
							<div className="col-span-2 mt-4">
								<Label className="font-semibold mb-2 block">
									{data.customSelect.label}
								</Label>
								{data.customSelect.description && (
									<p className="text-sm text-(--text) mb-3">
										{data.customSelect.description}
									</p>
								)}
								{selectType === "radio" ? (
									<FormField
										control={form.control}
										name="selectOption"
										render={({ field }) => (
											<RadioGroup
												value={(field.value as string) || ""}
												onValueChange={(val) => {
													field.onChange(val);
													form.trigger("selectOption");
												}}
												className="flex flex-col gap-2"
											>
												{data.customSelect!.options.map((opt) => (
													<label
														key={opt.id}
														className="flex items-center gap-2 text-sm cursor-pointer"
													>
														<RadioGroupItem
															value={opt.label}
															className=" border-(--text)/50"
														/>
														{opt.label}
													</label>
												))}
											</RadioGroup>
										)}
									/>
								) : (
									<FormField
										control={form.control}
										name="selectOption"
										render={({ field }) => {
											const selected = Array.isArray(field.value)
												? field.value
												: [];
											const toggle = (val: string) => {
												if (selected.includes(val)) {
													field.onChange(selected.filter((v) => v !== val));
												} else {
													field.onChange([...selected, val]);
												}
												form.trigger("selectOption");
											};
											return (
												<div className="flex flex-col gap-2">
													{data.customSelect!.options.map((opt) => (
														<label
															key={opt.id}
															className="flex items-center gap-2 text-sm cursor-pointer"
														>
															<Checkbox
																checked={selected.includes(opt.label)}
																onCheckedChange={() => toggle(opt.label)}
																className="border-(--text)/50"
															/>
															{opt.label}
														</label>
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
						{["optin1", "optin2"].map((opt) =>
							isVisible(opt) ? (
								<FormField
									key={opt}
									control={form.control}
									name={opt as keyof FormValues}
									render={({ field }) => (
										<FormItem className="col-span-2">
											<FormControl>
												<RadioGroup
													value={(field.value as string) || ""}
													onValueChange={(val) => {
														field.onChange(val);
														form.trigger(opt as "optin1" | "optin2");
													}}
													className="flex flex-col gap-2 "
												>
													<div className="flex items-start gap-2">
														<RadioGroupItem
															className="border-(--text)/50"
															value={opt === "optin1" ? "Aceite1" : "Aceite2"}
														/>
														<p className="text-(--text) text-sm leading-tight">
															{opt === "optin1" ? (
																<>
																	Li e concordo com os{" "}
																	<a
																		href="https://privacidade.globo.com/privacy-policy/"
																		target="_blank"
																		className="underline"
																		rel="noopener"
																	>
																		Termos de Uso e Política de Privacidade
																	</a>
																	.
																</>
															) : (
																<>
																	Autorizo o uso dos meus dados para
																	comunicações do Grupo Globo e patrocinadores.
																</>
															)}
														</p>
													</div>
												</RadioGroup>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							) : null,
						)}

						<div className="col-span-2 pt-6">
							<Button
								type="submit"
								disabled={isUploading}
								className="w-full text-base "
								onClick={() => {
									// console.log("🔘 Button clicked!");
									// console.log("🔍 Form errors:", form.formState.errors);
									// console.log("🔍 Form isValid:", form.formState.isValid);
									// console.log("🔍 Form values:", form.watch());
								}}
							>
								{isUploading ? (
									<Loader2 className="animate-spin mr-2" />
								) : (
									"Enviar"
								)}
							</Button>
						</div>
					</form>
				</Form>

				{/* Modal de sucesso */}
				<Dialog open={successOpen} onOpenChange={handleSuccessOpenChange}>
					<DialogContent className="bg-zinc-100 text-zinc-500">
						<DialogHeader>
							<DialogTitle>Inscrição enviada!</DialogTitle>
							<DialogDescription>{data.successMessage}</DialogDescription>
						</DialogHeader>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="button" onClick={() => setSuccessOpen(false)}>
									Fechar
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</CardContent>
		</Card>
	);
}
