import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import landingData from '@/landing.json'
import { TitleSection } from '../components/title-sections'

// --- máscaras ---
const formatCPF = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1-$2')
    .slice(0, 14)

const formatCNPJ = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18)

// --- validações ---
const validateCPF = (raw: string) => {
  const cpf = raw.replace(/\D/g, '')
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false
  let sum = 0
  for (let i = 0; i < 9; i++)
    sum += Number.parseInt(cpf.charAt(i), 10) * (10 - i)
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== Number.parseInt(cpf.charAt(9), 10)) return false
  sum = 0
  for (let i = 0; i < 10; i++)
    sum += Number.parseInt(cpf.charAt(i), 10) * (11 - i)
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  return rev === Number.parseInt(cpf.charAt(10), 10)
}

const validateCNPJ = (raw: string) => {
  const cnpj = raw.replace(/\D/g, '')
  if (cnpj.length !== 14) return false
  if (/^(\d)\1+$/.test(cnpj)) return false
  const validateDigit = (v: string, length: number) => {
    let sum = 0
    let pos = length - 7
    for (let i = length; i >= 1; i--) {
      sum += Number.parseInt(v[length - i], 10) * pos--
      if (pos < 2) pos = 9
    }
    return sum % 11 < 2 ? 0 : 11 - (sum % 11)
  }
  return (
    validateDigit(cnpj, 12) === Number.parseInt(cnpj[12], 10) &&
    validateDigit(cnpj, 13) === Number.parseInt(cnpj[13], 10)
  )
}

// --- schema base ---
const baseSchema = z.object({
  name: z.string().min(2, 'Nome inválido'),
  document: z
    .string()
    .min(14, 'Documento inválido')
    .refine(value => {
      const only = value.replace(/\D/g, '')
      return only.length === 11 ? validateCPF(only) : validateCNPJ(only)
    }, 'Documento inválido'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(1, 'Telefone obrigatório')
    .refine(phone => isValidPhoneNumber(phone), {
      message: 'Telefone inválido',
    }),
  position: z.string().min(2, 'Cargo inválido'),
  company: z.string().min(2, 'Empresa inválida'),
  message: z.string().min(5, 'Mensagem muito curta'),
  optin1: z.enum(['Aceite1'], { message: 'Obrigatório' }),
  optin2: z.enum(['Aceite2'], { message: 'Obrigatório' }),
})

type FormValues = z.infer<typeof baseSchema>

// Helper para ler config do landing.json (FORMS_URL_BASE64 + QUESTION_IDS)
function loadConfig() {
  return Promise.resolve({
    FORMS_URL_BASE64: landingData.subscribe.formsConfig.FORMS_URL_BASE64,
    QUESTION_IDS: landingData.subscribe.formsConfig.QUESTION_IDS,
  } as {
    FORMS_URL_BASE64: string
    QUESTION_IDS: Record<
      | 'name'
      | 'document'
      | 'email'
      | 'phone'
      | 'position'
      | 'company'
      | 'message'
      | 'optin1'
      | 'optin2',
      string
    >
  })
}

export default function Subscribe(props: React.HTMLAttributes<HTMLElement>) {
  // ✅ adapta o schema conforme os campos visíveis
  const visibleLabels =
    landingData.subscribe.fields
      ?.filter(f => f.visible)
      .map(f => f.label.toLowerCase()) || []

  const formSchema = useMemo(() => {
    let schema = baseSchema
    // remove do schema campos invisíveis
    if (!visibleLabels.includes('message')) {
      schema = schema.omit({ message: true })
    }
    if (!visibleLabels.includes('optin1')) {
      schema = schema.omit({ optin1: true })
    }
    if (!visibleLabels.includes('optin2')) {
      schema = schema.omit({ optin2: true })
    }
    return schema
  }, [visibleLabels])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      document: '',
      email: '',
      phone: '',
      position: '',
      company: '',
      message: '',
    },
  })

  const [, setDocumentType] = useState<'cpf' | 'cnpj' | null>(null)
  const { toast } = useToast()
  const [isUploading, setIsUploading] = useState(false)
  const [formKey, setFormKey] = useState(0)
  const [successOpen, setSuccessOpen] = useState(false)
  const handleSuccessOpenChange = (open: boolean) => {
    setSuccessOpen(open)
    if (!open) {
      form.reset({
        name: '',
        document: '',
        email: '',
        phone: '',
        position: '',
        company: '',
        message: '',
        // optin1/optin2 ficam sem valor por padrão após reset
      })
      form.clearErrors()
      requestAnimationFrame(() => setFormKey(k => k + 1))
      window.location.reload()
    }
  }
  const [landing] = useState<LandingData>(landingData as LandingData)

  interface SubscribeField {
    label: string
    visible: boolean
    [key: string]: unknown
  }

  interface SubscribeSection {
    description: string
    successMessage: string
    fields: SubscribeField[]
    [key: string]: unknown
  }

  interface LandingData {
    subscribe: SubscribeSection
    [key: string]: unknown
  }

  const fields: SubscribeField[] =
    (landing as LandingData).subscribe?.fields?.filter(
      (f: SubscribeField) => f.visible
    ) || []
  const isVisible = (label: string) =>
    fields.some(f => f.label.toLowerCase() === label.toLowerCase())

  // 👉 Backend único (Vercel) com proxy para o MS Forms
  const BACKEND_URL = 'https://backend-form-dusky.vercel.app/api/submit-form'

  const onSubmit: SubmitHandler<FormValues> = async data => {
    if (isUploading) return
    setIsUploading(true)
    try {
      // 1) Lê config da própria landing (URL em base64 + question IDs)
      const cfg = await loadConfig()

      // 2) Monta respostas
      const answers = [
        { questionId: cfg.QUESTION_IDS.name, answer1: data.name },
        { questionId: cfg.QUESTION_IDS.document, answer1: data.document },
        { questionId: cfg.QUESTION_IDS.email, answer1: data.email },
        { questionId: cfg.QUESTION_IDS.phone, answer1: data.phone },
        { questionId: cfg.QUESTION_IDS.position, answer1: data.position },
        { questionId: cfg.QUESTION_IDS.company, answer1: data.company },
        { questionId: cfg.QUESTION_IDS.message, answer1: data.message },
        { questionId: cfg.QUESTION_IDS.optin1, answer1: data.optin1 },
        { questionId: cfg.QUESTION_IDS.optin2, answer1: data.optin2 },
      ]

      // 3) Envia para o backend (com target_b64)
      const resp = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_b64: cfg.FORMS_URL_BASE64,
          startDate: new Date().toISOString(),
          submitDate: new Date().toISOString(),
          answers,
        }),
      })

      if (!resp.ok) {
        const txt = await resp.text()
        throw new Error(`Backend ${resp.status}: ${txt}`)
      }
      setSuccessOpen(true)
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro no envio',
        description: 'Não foi possível enviar o formulário.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    let formatted = value
    if (value.length <= 11) {
      formatted = formatCPF(value)
      setDocumentType('cpf')
    } else {
      formatted = formatCNPJ(value)
      setDocumentType('cnpj')
    }
    form.setValue('document', formatted, { shouldValidate: true })
  }

  return (
    <Card
      {...props}
      className="w-10/12 md:w-full max-w-3xl mx-auto mt-10 bg-[var(--surface)]"
      id="subscribe"
    >
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 mb-6 text-center">
          <TitleSection
            name="Inscrição"
            description={landing.subscribe.description}
          />
        </div>

        <Form key={formKey} {...form}>
          <form
            key={formKey}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Nome + CPF/CNPJ */}
            <div className="flex flex-col md:flex-row md:gap-3 gap-0 space-y-4 md:space-y-0">
              {isVisible('name') && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormControl>
                        <Input
                          className="text-[var(--text)]"
                          placeholder="Nome Completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isVisible('document') && (
                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormControl>
                        <Input
                          className="text-[var(--text)]"
                          {...field}
                          placeholder="CPF ou CNPJ"
                          onChange={handleDocumentChange}
                          inputMode="numeric"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Email + Telefone */}
            <div className="flex flex-col md:flex-row md:gap-3 gap-0 space-y-4 md:space-y-0">
              {isVisible('email') && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormControl>
                        <Input
                          className="text-[var(--text)]"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isVisible('phone') && (
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormControl>
                        <PhoneInput
                          {...field}
                          placeholder="Telefone"
                          key={`phone-${formKey}`}
                          international
                          defaultCountry="BR"
                          value={field.value || ''}
                          onChange={value =>
                            form.setValue('phone', value || '', {
                              shouldValidate: true,
                            })
                          }
                          className="border px-2 py-[.35rem] rounded-md text-[var(--text)] text-sm w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Cargo + Empresa */}
            <div className="flex flex-col md:flex-row md:gap-3 gap-0 space-y-4 md:space-y-0">
              {isVisible('position') && (
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormControl>
                        <Input
                          className="text-[var(--text)]"
                          placeholder="Cargo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {isVisible('company') && (
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="w-full ">
                      <FormControl>
                        <Input
                          className="text-[var(--text)]"
                          placeholder="Empresa"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Mensagem */}
            {isVisible('message') && (
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Mensagem"
                        className="min-h-28 text-[var(--text)]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <hr />

            {/* Opt-in 1 */}
            {isVisible('optin1') && (
              <FormField
                control={form.control}
                name="optin1"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex gap-2 items-center">
                        <FormControl>
                          <RadioGroupItem
                            className="mt-2 bg-[var(--text)]"
                            value="Aceite1"
                          />
                        </FormControl>
                        <FormLabel className="leading-tight inline text-[var(--text)]">
                          Li e concordo com os Termos de Uso e{' '}
                          <a
                            className="text-zinc-400 underline hover:text-zinc-700"
                            href="https://privacidade.globo.com/privacy-policy/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            Política de Privacidade
                          </a>{' '}
                          do Grupo Globo.
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {/* Opt-in 2 */}
            {isVisible('optin2') && (
              <FormField
                control={form.control}
                name="optin2"
                render={({ field }) => (
                  <FormItem>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex gap-2 items-center">
                        <FormControl>
                          <RadioGroupItem
                            className="mt-2 bg-[var(--text)]"
                            value="Aceite2"
                          />
                        </FormControl>
                        <FormLabel className="leading-tight text-[var(--text)]">
                          Estou ciente e concordo que os meus dados constantes
                          nesta inscrição podem ser utilizados pela Editora
                          Globo, por empresas do Grupo Globo e por
                          patrocinadores do evento para fins de ações de
                          relacionamento, como envio de ofertas de produtos e/ou
                          serviços.
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <hr />
            <p className="text-sm text-[var(--text)]">
              OBS.: Para informações sobre credenciamento de jornalistas e
              possibilidade de cobertura do evento pela imprensa, por favor
              enviar e-mail para{' '}
              <a
                href="mailto:editoraglobo@inpresspni.com.br"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 underline hover:text-zinc-700"
              >
                editoraglobo@inpresspni.com.br
              </a>
            </p>

            <Button
              type="submit"
              disabled={isUploading}
              className="w-full text-lg bg-[var(--background)] hover:bg-zinc-400/25 transition cursor-pointer"
            >
              {isUploading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                'Enviar'
              )}
            </Button>
          </form>
        </Form>
        <Dialog open={successOpen} onOpenChange={handleSuccessOpenChange}>
          <DialogContent className="bg-[var(--text)]">
            <DialogHeader>
              <DialogTitle>Inscrição enviada!</DialogTitle>
              <DialogDescription>
                {landing.subscribe.successMessage}
              </DialogDescription>
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
  )
}
