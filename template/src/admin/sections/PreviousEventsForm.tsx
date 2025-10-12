import {
  closestCenter,
  DndContext,
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

interface EventItem {
  id: string
  date: string
  image: string
  title: string
  description: string
  ctaLabel: string
  ctaLink: string
}

interface PreviousEventsData {
  title: string
  description: string
  events: EventItem[]
  visible: boolean
}

interface PreviousEventsFormProps {
  data: { previousEvents?: PreviousEventsData; visible?: boolean }
  setData: (newData: Record<string, unknown>) => void
}

// 🔹 Item individual com suporte a drag-and-drop
function SortableEvent({
  event,
  updateEventField,
  removeEvent,
}: {
  event: EventItem
  updateEventField: (id: string, field: keyof EventItem, value: string) => void
  removeEvent: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: event.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 rounded-lg bg-muted/30 space-y-3"
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

          <Label className="font-semibold text-lg">
            {event.title || 'Nova Edição'}
          </Label>
        </div>

        <Button variant="ghost" size="sm" onClick={() => removeEvent(event.id)}>
          <X />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 py-2">
          <Label>Data</Label>
          <Input
            value={event.date}
            placeholder="Ex: Junho / 2025"
            onChange={e => updateEventField(event.id, 'date', e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 py-2">
          <Label>Imagem</Label>
          <Input
            value={event.image}
            placeholder="Ex: edicao1.webp"
            onChange={e => updateEventField(event.id, 'image', e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 py-2">
        <Label>Título</Label>
        <Input
          value={event.title}
          placeholder="Ex: Transição energética..."
          onChange={e => updateEventField(event.id, 'title', e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 py-2">
        <Label>Descrição</Label>
        <Textarea
          value={event.description}
          placeholder="Resumo do evento"
          onChange={e =>
            updateEventField(event.id, 'description', e.target.value)
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2 py-2">
          <Label>Texto do Botão</Label>
          <Input
            value={event.ctaLabel}
            placeholder="Ex: Assista na íntegra"
            onChange={e =>
              updateEventField(event.id, 'ctaLabel', e.target.value)
            }
          />
        </div>
        <div className="flex flex-col gap-2 py-2">
          <Label>Link</Label>
          <Input
            value={event.ctaLink}
            placeholder="Ex: https://oglobo.com/evento"
            onChange={e =>
              updateEventField(event.id, 'ctaLink', e.target.value)
            }
          />
        </div>
      </div>
    </div>
  )
}

export default function PreviousEventsForm({
  data,
  setData,
}: PreviousEventsFormProps) {
  const previous = data.previousEvents || {
    title: '',
    description: '',
    events: [],
    visible: true,
  }

  const [localPrevious, setLocalPrevious] =
    useState<PreviousEventsData>(previous)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const updateField = (field: keyof PreviousEventsData, value: unknown) => {
    const updated = { ...localPrevious, [field]: value }
    setLocalPrevious(updated)
    setData({ ...data, previousEvents: updated })
  }

  const addEvent = () => {
    const newEvent: EventItem = {
      id: crypto.randomUUID(),
      date: '',
      image: '',
      title: '',
      description: '',
      ctaLabel: '',
      ctaLink: '',
    }
    updateField('events', [...localPrevious.events, newEvent])
  }

  const removeEvent = (id: string) =>
    updateField(
      'events',
      localPrevious.events.filter(e => e.id !== id)
    )

  const updateEventField = (
    id: string,
    field: keyof EventItem,
    value: string
  ) => {
    const updated = localPrevious.events.map(e =>
      e.id === id ? { ...e, [field]: value } : e
    )
    updateField('events', updated)
  }

  const handleDragEnd = (event: import('@dnd-kit/core').DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = localPrevious.events.findIndex(e => e.id === active.id)
    const newIndex = localPrevious.events.findIndex(e => e.id === over.id)

    const reordered = arrayMove(localPrevious.events, oldIndex, newIndex)
    updateField('events', reordered)
  }

  return (
    <Card className="mt-6">
      <CardContent className="space-y-8 p-6">
        <div className="flex justify-end items-center gap-3">
          <Label>Exibir/Ocultar Seção</Label>

          <Switch
            checked={data.previousEvents?.visible ?? true}
            onCheckedChange={checked =>
              setData({
                ...data,
                previousEvents: {
                  ...(data.previousEvents || {}),
                  visible: checked,
                },
              })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2 py-2">
            <Label>Título da Seção</Label>
            <Input
              value={localPrevious.title}
              onChange={e => updateField('title', e.target.value)}
              placeholder="Ex: Edições Anteriores"
            />
          </div>
          <div className="flex flex-col gap-2 py-2">
            <Label>Descrição da Seção</Label>
            <Input
              value={localPrevious.description}
              onChange={e => updateField('description', e.target.value)}
              placeholder="Ex: Confira as edições anteriores"
            />
          </div>
        </div>

        {/* 🔹 DnD Context */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localPrevious.events.map(e => e.id)}
            strategy={verticalListSortingStrategy}
          >
            {localPrevious.events.map(event => (
              <SortableEvent
                key={event.id}
                event={event}
                updateEventField={updateEventField}
                removeEvent={removeEvent}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button onClick={addEvent} variant="secondary">
          + Adicionar Edição
        </Button>
      </CardContent>
    </Card>
  )
}
