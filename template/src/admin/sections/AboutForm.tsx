import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { ArrowDownUp, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

interface SocialIcon {
  id: string
  icon: string
  url: string
}

interface SocialBlock {
  id: string
  label: string
  icons: SocialIcon[]
}

interface AboutData {
  subtitle: string
  socialTitle: string
  paragraphs: string[]
  socialBlocks: SocialBlock[]
  showTransmission?: boolean
}

interface AboutFormProps {
  data: { about?: AboutData; visible?: boolean }
  setData: (newData: Record<string, unknown>) => void
}

/* ──────────────────────────────── */
/* Componente Sortable */
function SortableBlock({
  block,
  index,
  updateBlock,
  removeBlock,
}: {
  block: SocialBlock
  index: number
  updateBlock: (
    index: number,
    field: keyof SocialBlock,
    value: string | SocialIcon[]
  ) => void
  removeBlock: (index: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: block.id,
    })
  const style = { transform: CSS.Transform.toString(transform), transition }

  const addIcon = () => {
    const newIcon: SocialIcon = {
      id: crypto.randomUUID(),
      icon: '',
      url: '',
    }
    updateBlock(index, 'icons', [...block.icons, newIcon])
  }

  const updateIcon = (
    iconIndex: number,
    field: keyof SocialIcon,
    value: string
  ) => {
    const updated = [...block.icons]
    updated[iconIndex] = { ...updated[iconIndex], [field]: value }
    updateBlock(index, 'icons', updated)
  }

  const removeIcon = (iconIndex: number) => {
    const updated = block.icons.filter((_, i) => i !== iconIndex)
    updateBlock(index, 'icons', updated)
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg bg-zinc-50 hover:bg-zinc-100 transition p-4 space-y-3"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="text-zinc-400 cursor-grab active:cursor-grabbing select-none"
            {...attributes}
            {...listeners}
          >
            <ArrowDownUp />
          </Button>
          <h4 className="font-semibold text-lg">Bloco de Transmissão</h4>
        </div>
        <Button variant="ghost" size="sm" onClick={() => removeBlock(index)}>
          <X />
        </Button>
      </div>

      {/* Label */}
      <div>
        <Label>Título do bloco</Label>
        <Input
          value={block.label}
          onChange={e => updateBlock(index, 'label', e.target.value)}
          placeholder="Ex: Assista também em"
        />
      </div>

      {/* Ícones/redes */}
      <div className="space-y-2">
        <Label>Redes / Canais</Label>
        {block.icons.map((icon, i) => (
          <div key={icon.id} className="flex gap-2 items-center">
            <Input
              placeholder="Ícone (ex: youtube)"
              value={icon.icon}
              onChange={e => updateIcon(i, 'icon', e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="URL"
              value={icon.url}
              onChange={e => updateIcon(i, 'url', e.target.value)}
              className="flex-[2]"
            />
            <Button variant="ghost" size="sm" onClick={() => removeIcon(i)}>
              <X />
            </Button>
          </div>
        ))}

        <Button variant="outline" size="sm" onClick={addIcon}>
          + Adicionar Rede
        </Button>
      </div>
    </div>
  )
}

/* ──────────────────────────────── */
/* Form principal */
export function AboutForm({ data, setData }: AboutFormProps) {
  const about = data.about || {
    subtitle: '',
    socialTitle: '',
    paragraphs: [''],
    socialBlocks: [],
  }
  const [localData, setLocalData] = useState<AboutData>(about)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const updateField = (
    field: keyof AboutData,
    value: string | string[] | SocialBlock[]
  ) => {
    const updated = { ...localData, [field]: value }
    setLocalData(updated)
    setData({ ...data, about: updated })
  }

  const updateBlock = (
    index: number,
    field: keyof SocialBlock,
    value: string | SocialIcon[]
  ) => {
    const updated = [...localData.socialBlocks]
    updated[index] = { ...updated[index], [field]: value }
    updateField('socialBlocks', updated)
  }

  const addBlock = () => {
    const newBlock: SocialBlock = {
      id: crypto.randomUUID(),
      label: '',
      icons: [],
    }
    updateField('socialBlocks', [...localData.socialBlocks, newBlock])
  }

  const removeBlock = (index: number) => {
    const updated = localData.socialBlocks.filter((_, i) => i !== index)
    updateField('socialBlocks', updated)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = localData.socialBlocks.findIndex(i => i.id === active.id)
    const newIndex = localData.socialBlocks.findIndex(i => i.id === over.id)
    const reordered = arrayMove(localData.socialBlocks, oldIndex, newIndex)
    updateField('socialBlocks', reordered)
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-8 p-6">
        {/* Subtítulo e Parágrafos */}
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <Label>Subtítulo</Label>
            <Input
              value={localData.subtitle}
              onChange={e => updateField('subtitle', e.target.value)}
              placeholder="Ex: Uma jornada pela sustentabilidade"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Parágrafos</Label>
            <Textarea
              value={localData.paragraphs.join('\n\n')}
              onChange={e =>
                updateField('paragraphs', e.target.value.split('\n\n'))
              }
              placeholder="Separe os parágrafos com uma linha em branco"
              className="min-h-32"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Use uma linha em branco entre blocos de texto para gerar
              parágrafos.
            </p>
          </div>
        </div>

        {/* 🔹 Blocos de transmissão */}
        <div className="border-t pt-6 mt-6">
          <div className="flex justify-between items-center ">
            <Label className="text-lg font-semibold mb-3 block">
              Blocos de Transmissão (Social)
            </Label>
            <div className="flex items-center gap-3">
              <Label>Exibir/Ocultar</Label>
              <Switch
                checked={data.about?.showTransmission ?? true}
                onCheckedChange={checked =>
                  setData({
                    ...data,
                    about: { ...(data.about || {}), showTransmission: checked },
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-3 py-4">
            <Label>Título</Label>
            <Input
              value={localData.socialTitle}
              onChange={e => updateField('socialTitle', e.target.value)}
              placeholder="Título (Ex.: Acompanhe nas redes sociais)"
            />
          </div>
          <Button
            onClick={addBlock}
            variant="outline"
            size="sm"
            className="mb-4"
          >
            + Adicionar Bloco de Transmissão
          </Button>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localData.socialBlocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {localData.socialBlocks.map((block, i) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={i}
                    updateBlock={updateBlock}
                    removeBlock={removeBlock}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </CardContent>
    </Card>
  )
}
