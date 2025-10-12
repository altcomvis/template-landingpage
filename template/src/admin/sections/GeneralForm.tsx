import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

/* ──────────────────────────────── */
/* Tipos */
interface GeneralData {
  projectName: string
  primaryColor: string
  secondaryColor: string
  darkColor: string
  lightColor: string
  backgroundColor: string // cor global
  surfaceColor: string // fundo do conteúdo
  textColor: string // texto global
  backgroundMode: 'solid' | 'primary' | 'secondary' | 'dark' | 'mylight'
  fontFamily?: string
  enableParallax?: boolean
}

interface GeneralFormProps {
  data: { general?: GeneralData }
  setData: (newData: Record<string, unknown>) => void
  googleFonts?: string[] // fontes vindas do Admin
}

/* ──────────────────────────────── */
/* Campo de cor com # fixo */
interface ColorFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

function ColorField({ label, value, onChange }: ColorFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value.trim().toUpperCase()

    // adiciona o # se não existir
    if (!inputValue.startsWith('#')) inputValue = `#${inputValue}`

    // mantém apenas caracteres válidos HEX
    inputValue = inputValue.replace(/[^#0-9A-F]/g, '')

    // limita ao formato #RRGGBB
    if (inputValue.length > 7) inputValue = inputValue.slice(0, 7)

    onChange(inputValue)
  }

  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="#000000"
        maxLength={7}
        className="w-28 text-center font-mono uppercase"
      />
    </div>
  )
}

/* ──────────────────────────────── */
/* Form principal */
export default function GeneralForm({
  data,
  setData,
  googleFonts = [],
}: GeneralFormProps) {
  const general = data.general || {
    projectName: '',
    primaryColor: '#0057FF',
    secondaryColor: '#FFAA00',
    darkColor: '#111111',
    lightColor: '#F5F5F5',
    backgroundColor: '#EAEAEA',
    surfaceColor: '#FFFFFF',
    textColor: '#222222',
    backgroundMode: 'solid',
    fontFamily: 'Poppins',
    enableParallax: true,
  }

  const updateField = (field: keyof GeneralData, value: string | boolean) => {
    const updated = { ...general, [field]: value }
    setData({ ...data, general: updated })
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-10 p-6">
        {/* 🔹 Nome do projeto */}
        <div>
          <Label>Nome do Projeto</Label>
          <Input
            value={general.projectName}
            onChange={e => updateField('projectName', e.target.value)}
            placeholder="Ex: Energy & Tech"
          />
        </div>

        {/* 🔤 Fonte Global */}
        <div className="border-t pt-6 mt-6">
          <Label className="text-lg font-semibold mb-3 block">Tipografia</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Label>Fonte Principal</Label>
              <Select
                value={general.fontFamily}
                onValueChange={val => updateField('fontFamily', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma fonte" />
                </SelectTrigger>
                <SelectContent className="max-h-72 overflow-y-auto">
                  {googleFonts.length > 0 ? (
                    googleFonts.map(font => (
                      <SelectItem
                        key={font}
                        value={font}
                        style={{ fontFamily: font }}
                      >
                        {font}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Poppins">Poppins</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <p
                className="text-sm text-zinc-500 mt-2"
                style={{ fontFamily: general.fontFamily }}
              >
                Exemplo: The quick brown fox jumps over the lazy dog
              </p>
            </div>

            {/* Switch Parallax */}
            <div className="flex flex-col justify-end">
              <div className="flex items-center justify-between">
                <Label>Ativar Parallax</Label>
                <Switch
                  checked={general.enableParallax ?? false}
                  onCheckedChange={checked =>
                    updateField('enableParallax', checked)
                  }
                />
              </div>
              <p className="text-xs text-zinc-500 mt-2">
                Ativa animações sutis de fade, blur e movimento ao rolar.
              </p>
            </div>
          </div>
        </div>

        {/* 🎨 Paleta base */}
        <div className="border-t pt-6 mt-6">
          <Label className="text-lg font-semibold mb-3 block">
            Paleta Base
          </Label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <ColorField
              label="Primária"
              value={general.primaryColor}
              onChange={val => updateField('primaryColor', val)}
            />
            <ColorField
              label="Secundária"
              value={general.secondaryColor}
              onChange={val => updateField('secondaryColor', val)}
            />
            <ColorField
              label="Escura"
              value={general.darkColor}
              onChange={val => updateField('darkColor', val)}
            />
            <ColorField
              label="Clara"
              value={general.lightColor}
              onChange={val => updateField('lightColor', val)}
            />
            <ColorField
              label="Texto"
              value={general.textColor}
              onChange={val => updateField('textColor', val)}
            />
          </div>
        </div>

        {/* 🌄 Fundo global */}
        <div className="border-t pt-6 mt-6">
          <Label className="text-lg font-semibold mb-3 block">
            Fundo da Página
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Modo de Fundo */}
            <div className="flex flex-col gap-3">
              <Label>Modo de Fundo</Label>
              <Select
                value={general.backgroundMode}
                onValueChange={value =>
                  updateField(
                    'backgroundMode',
                    value as
                      | 'solid'
                      | 'primary'
                      | 'secondary'
                      | 'dark'
                      | 'mylight'
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solid">Cor personalizada</SelectItem>
                  <SelectItem value="primary">Usar cor primária</SelectItem>
                  <SelectItem value="secondary">Usar cor secundária</SelectItem>
                  <SelectItem value="dark">Usar cor escura</SelectItem>
                  <SelectItem value="mylight">Usar cor clara</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cor global (se modo for solid) */}
            {general.backgroundMode === 'solid' && (
              <ColorField
                label="Cor de Fundo Global"
                value={general.backgroundColor}
                onChange={val => updateField('backgroundColor', val)}
              />
            )}

            {/* Fundo do conteúdo */}
            <ColorField
              label="Cor do Fundo do Conteúdo"
              value={general.surfaceColor}
              onChange={val => updateField('surfaceColor', val)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
