import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface HeroData {
  subtitle: string
  date: string
  time: string
  location: string
  address: string
  useBackgroundImage: boolean
  useLightRays?: boolean
  lightRaysColor?: string // 👈 nova propriedade
}

interface HeroFormProps {
  data: { hero?: HeroData }
  setData: (newData: Record<string, unknown>) => void
}

export default function HeroForm({ data, setData }: HeroFormProps) {
  const hero = data.hero || {
    subtitle: '',
    date: '',
    time: '',
    location: '',
    address: '',
    useBackgroundImage: false,
    useLightRays: false,
    lightRaysColor: '#ffffff',
  }

  const [localHero, setLocalHero] = useState<HeroData>(hero)

  useEffect(() => {
    setLocalHero(hero)
  }, [hero])

  const updateField = (field: keyof HeroData, value: string | boolean) => {
    const updated = { ...localHero, [field]: value }
    setLocalHero(updated)
    setData({ ...data, hero: updated })
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-6 p-6">
        {/* ⚙️ Switches principais */}
        <div className="flex flex-wrap justify-end gap-8">
          <div className="flex items-center gap-3">
            <Label>Usar imagem de fundo</Label>
            <Switch
              checked={localHero.useBackgroundImage}
              onCheckedChange={checked =>
                updateField('useBackgroundImage', checked)
              }
            />
          </div>

          <div className="flex items-center gap-3">
            <Label>Ativar Light Rays</Label>
            <Switch
              checked={localHero.useLightRays ?? false}
              onCheckedChange={checked => updateField('useLightRays', checked)}
            />
          </div>

          {/* 🎨 Seletor de cor do Light Rays */}
          {localHero.useLightRays && (
            <div className="flex items-center gap-3">
              <Label>Cor dos Raios</Label>
              <Input
                type="color"
                value={localHero.lightRaysColor || '#ffffff'}
                onChange={e =>
                  updateField('lightRaysColor', e.target.value || '#ffffff')
                }
                className="w-12 h-8 cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* 🗓️ Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Subtítulo</Label>
            <Input
              value={localHero.subtitle}
              onChange={e => updateField('subtitle', e.target.value)}
              placeholder="Ex: 10ª edição | Sustentabilidade e Inovação"
            />
          </div>

          <div>
            <Label>Data</Label>
            <Input
              value={localHero.date}
              onChange={e => updateField('date', e.target.value)}
              placeholder="Ex: 23 a 25 de Outubro"
            />
          </div>

          <div>
            <Label>Horário</Label>
            <Input
              value={localHero.time}
              onChange={e => updateField('time', e.target.value)}
              placeholder="Ex: das 9h às 18h"
            />
          </div>

          <div>
            <Label>Local</Label>
            <Input
              value={localHero.location}
              onChange={e => updateField('location', e.target.value)}
              placeholder="Ex: Parque Ibirapuera"
            />
          </div>

          <div className="md:col-span-2">
            <Label>Endereço</Label>
            <Input
              value={localHero.address}
              onChange={e => updateField('address', e.target.value)}
              placeholder="Ex: Av. Pedro Álvares Cabral, São Paulo - SP"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
