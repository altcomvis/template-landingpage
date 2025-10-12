import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

/* ──────────────────────────────── */
/* 🔹 Tipos */
interface FormField {
  id: string
  label: string
  visible: boolean
}

interface FormsConfig {
  FORMS_URL_BASE64: string
  QUESTION_IDS: Record<string, string>
}

interface SubscribeData {
  title: string
  description: string
  successTitle: string
  successMessage: string
  formsConfig: FormsConfig
  fields: FormField[]
  visible?: boolean
}

interface SubscribeFormProps {
  data: { subscribe?: SubscribeData; visible?: boolean }
  setData: (newData: Record<string, unknown>) => void
}

/* ──────────────────────────────── */
export default function SubscribeForm({ data, setData }: SubscribeFormProps) {
  const subscribe = data.subscribe || {
    title: 'Inscrição',
    description: 'Preencha o formulário para participar.',
    successTitle: 'Inscrição enviada!',
    successMessage:
      'Obrigado pela sua inscrição. Em breve entraremos em contato.',
    formsConfig: {
      FORMS_URL_BASE64: '',
      QUESTION_IDS: {},
    },
    fields: [],
  }

  const [localData, setLocalData] = useState<SubscribeData>(subscribe)

  /* 🔹 Gera e sincroniza campos automaticamente (sem botão) */
  useEffect(() => {
    // garante que formsConfig existe
    const currentConfig = localData.formsConfig || {
      FORMS_URL_BASE64: '',
      QUESTION_IDS: {},
    }

    let questionIds = currentConfig.QUESTION_IDS

    // se vier vazio, usa os exemplos por padrão
    if (!questionIds || Object.keys(questionIds).length === 0) {
      questionIds = {
        name: 'r9dd6878a382646f5824c28921a3b606d',
        email: 'r61251a298dfe46cf92b3d3bdec15ebf5',
        phone: 'r386e88a11a544391b709260d5e958987',
        document: 'ra401d13ed8b84f5cbd4dca4ffc3890e6',
        position: 'r754d4abcd5bc468e80cf3bcd257c4c85',
        company: 'r77a287a58cf546799522b6464ed55f92',
        message: 'rdc65760d76e640bd9b20ecc7fab55668',
        optin1: 'rbe00f0945a944e37a8ee6d4499bcf6c3',
        optin2: 'raa64c101a351475d94f1bf1789d71d6c',
      }
    }

    // cria os campos padrão se estiver vazio
    if (!localData.fields || localData.fields.length === 0) {
      const defaultFields = Object.entries(questionIds).map(([key, id]) => ({
        id,
        label: key,
        visible: true,
      }))

      const updated: SubscribeData = {
        ...localData,
        formsConfig: { ...currentConfig, QUESTION_IDS: questionIds },
        fields: defaultFields,
      }

      setLocalData(updated)
      setData({ ...data, subscribe: updated }) // ✅ garante persistência
    }
  }, [localData, data, setData])

  /* 🔹 Atualiza campos de texto */
  const updateField = (field: keyof SubscribeData, value: string) => {
    const updated = { ...localData, [field]: value }
    setLocalData(updated)
    setData({ ...data, subscribe: updated })
  }

  /* 🔹 Alterna visibilidade dos campos */
  const toggleFieldVisibility = (id: string) => {
    const updatedFields = localData.fields.map(f =>
      f.id === id ? { ...f, visible: !f.visible } : f
    )
    const updated = { ...localData, fields: updatedFields }
    setLocalData(updated)
    setData({ ...data, subscribe: updated })
  }

  /* 🔹 Labels amigáveis */
  const getLabelName = (label: string) => {
    const map: Record<string, string> = {
      name: 'Nome completo',
      email: 'E-mail',
      phone: 'Telefone',
      document: 'Documento',
      position: 'Cargo',
      company: 'Empresa',
      message: 'Mensagem',
      optin1: 'Opt-in 1',
      optin2: 'Opt-in 2',
    }
    return map[label] || label
  }

  /* ──────────────────────────────── */
  return (
    <Card className="mt-6">
      <CardContent className="space-y-8 p-6">
        <div className="flex justify-end items-center">
          <div className="flex items-center gap-3">
            <Label>Exibir/Ocultar Seção</Label>
            <Switch
              checked={data.subscribe?.visible ?? true}
              onCheckedChange={checked =>
                setData({
                  ...data,
                  subscribe: { ...(data.subscribe || {}), visible: checked },
                })
              }
            />
          </div>
        </div>

        {/* 🔹 Cabeçalho */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Título</Label>
            <Input
              value={localData.title}
              onChange={e => updateField('title', e.target.value)}
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={localData.description}
              onChange={e => updateField('description', e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 Mensagens de sucesso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Título de Sucesso</Label>
            <Input
              value={localData.successTitle}
              onChange={e => updateField('successTitle', e.target.value)}
            />
          </div>

          <div>
            <Label>Mensagem de Sucesso</Label>
            <Textarea
              value={localData.successMessage}
              onChange={e => updateField('successMessage', e.target.value)}
            />
          </div>
        </div>

        {/* 🔹 Configuração do Forms */}
        <div className="border-t pt-4 mt-6">
          <Label className="text-lg font-semibold">
            Configuração do Formulário
          </Label>
          <div className="mt-2 space-y-4">
            <div>
              <Label>URL do Microsoft Forms</Label>
              <Input
                value={localData.formsConfig.FORMS_URL_BASE64}
                placeholder="Cole aqui a URL completa do MS Forms (não codificada)"
                onChange={e => {
                  const inputValue = e.target.value.trim()

                  // verifica se já é base64
                  const isBase64 =
                    /^[A-Za-z0-9+/]+={0,2}$/.test(inputValue) &&
                    inputValue.length % 4 === 0

                  const encodedValue = isBase64 ? inputValue : btoa(inputValue)

                  const updated = {
                    ...localData,
                    formsConfig: {
                      ...localData.formsConfig,
                      FORMS_URL_BASE64: encodedValue,
                    },
                  }

                  setLocalData(updated)
                  setData({ ...data, subscribe: updated })
                }}
              />
              <p className="text-xs text-zinc-500 mt-1">
                A URL será automaticamente codificada em Base64.
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 Lista de campos do MS Forms */}
        {localData.fields && localData.fields.length > 0 && (
          <div className="mt-8">
            <Label className="text-lg font-semibold mb-4 block">
              Campos do Formulário (MS Forms)
            </Label>
            <div className="grid md:grid-rows-3 lg:grid-rows-3 md:grid-flow-col gap-4">
              {localData.fields.map(field => (
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
      </CardContent>
    </Card>
  )
}
