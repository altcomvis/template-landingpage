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

/* ──────────────────────────────── */
/* 🔹 Tipos */
type BrandItem = {
  id: string
  name: string
}

type SponsorBlock = {
  id: string
  label: string
  items: BrandItem[]
}

interface SponsorsFormProps {
  data: { sponsors?: SponsorBlock[] }
  setData: (newData: Record<string, unknown>) => void
}

/* ──────────────────────────────── */
/* 🔹 Marca individual reordenável */
function SortableBrand({
  brand,
  blockId,
  updateMarca,
  removeMarca,
}: {
  brand: BrandItem
  blockId: string
  updateMarca: (blockId: string, marcaId: string, value: string) => void
  removeMarca: (blockId: string, marcaId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: brand.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-2 items-center justify-between bg-white rounded p-2"
    >
      <div className="flex items-center gap-2 w-full">
        <Button
          variant="ghost"
          className="text-zinc-400 cursor-grab active:cursor-grabbing select-none"
          {...attributes}
          {...listeners}
        >
          <ArrowDownUp />
        </Button>
        <Input
          value={brand.name}
          placeholder="Ex: marca.webp"
          onChange={e => updateMarca(blockId, brand.id, e.target.value)}
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => removeMarca(blockId, brand.id)}
      >
        <X />
      </Button>
    </div>
  )
}

/* ──────────────────────────────── */
/* 🔹 Bloco principal (chancela) com marcas reordenáveis */
function SortableSponsorBlock({
  block,
  updateLabel,
  addMarca,
  updateMarca,
  removeMarca,
  removeChancela,
  reorderMarcas,
}: {
  block: SponsorBlock
  updateLabel: (id: string, value: string) => void
  addMarca: (id: string) => void
  updateMarca: (blockId: string, marcaId: string, value: string) => void
  removeMarca: (blockId: string, marcaId: string) => void
  removeChancela: (id: string) => void
  reorderMarcas: (blockId: string, activeId: string, overId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: block.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // 🔹 Drag interno das marcas
  const handleInnerDragEnd = (event: import('@dnd-kit/core').DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    reorderMarcas(block.id, String(active.id), String(over.id))
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-muted/30 space-y-4 relative"
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
            {block.label || 'Nova Chancela'}
          </Label>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => removeChancela(block.id)}
        >
          <X />
        </Button>
      </div>

      {/* Nome da chancela */}
      <div className="space-y-2">
        <Label>Nome da Chancela</Label>
        <Input
          value={block.label}
          placeholder="Ex: Patrocínio"
          onChange={e => updateLabel(block.id, e.target.value)}
        />
      </div>

      {/* 🔹 Drag interno — marcas */}
      <div className="space-y-2">
        <Label>Marcas ({block.items.length})</Label>
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleInnerDragEnd}
        >
          <SortableContext
            items={block.items.map(m => m.id)}
            strategy={verticalListSortingStrategy}
          >
            {block.items.map(item => (
              <SortableBrand
                key={item.id}
                brand={item}
                blockId={block.id}
                updateMarca={updateMarca}
                removeMarca={removeMarca}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          onClick={() => addMarca(block.id)}
          variant="secondary"
          size="sm"
        >
          + Adicionar Marca
        </Button>
      </div>
    </div>
  )
}

/* ──────────────────────────────── */
/* 🔹 Form principal */
export default function SponsorsForm({ data, setData }: SponsorsFormProps) {
  const sponsors: SponsorBlock[] = data.sponsors || []
  const [localSponsors, setLocalSponsors] = useState<SponsorBlock[]>(sponsors)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  )

  const updateSponsors = (newList: SponsorBlock[]) => {
    setLocalSponsors(newList)
    setData({ ...data, sponsors: newList })
  }

  const addChancela = () => {
    const newBlock: SponsorBlock = {
      id: crypto.randomUUID(),
      label: '',
      items: [],
    }
    updateSponsors([...localSponsors, newBlock])
  }

  const removeChancela = (id: string) => {
    const updated = localSponsors.filter(block => block.id !== id)
    updateSponsors(updated)
  }

  const updateLabel = (id: string, value: string) => {
    const updated = localSponsors.map(block =>
      block.id === id ? { ...block, label: value } : block
    )
    updateSponsors(updated)
  }

  const addMarca = (id: string) => {
    const updated = localSponsors.map(block =>
      block.id === id
        ? {
            ...block,
            items: [...block.items, { id: crypto.randomUUID(), name: '' }],
          }
        : block
    )
    updateSponsors(updated)
  }

  const updateMarca = (blockId: string, marcaId: string, value: string) => {
    const updated = localSponsors.map(block => {
      if (block.id === blockId) {
        const newItems = block.items.map(m =>
          m.id === marcaId ? { ...m, name: value } : m
        )
        return { ...block, items: newItems }
      }
      return block
    })
    updateSponsors(updated)
  }

  const removeMarca = (blockId: string, marcaId: string) => {
    const updated = localSponsors.map(block => {
      if (block.id === blockId) {
        return { ...block, items: block.items.filter(m => m.id !== marcaId) }
      }
      return block
    })
    updateSponsors(updated)
  }

  const reorderMarcas = (blockId: string, activeId: string, overId: string) => {
    const updated = localSponsors.map(block => {
      if (block.id === blockId) {
        const oldIndex = block.items.findIndex(m => m.id === activeId)
        const newIndex = block.items.findIndex(m => m.id === overId)
        if (oldIndex === -1 || newIndex === -1) return block
        const reordered = arrayMove(block.items, oldIndex, newIndex)
        return { ...block, items: reordered }
      }
      return block
    })
    updateSponsors(updated)
  }

  // 🔹 Reorder externo de blocos
  const handleOuterDragEnd = (event: import('@dnd-kit/core').DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = localSponsors.findIndex(b => b.id === active.id)
    const newIndex = localSponsors.findIndex(b => b.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    const reordered = arrayMove(localSponsors, oldIndex, newIndex)
    updateSponsors(reordered)
  }

  /* ──────────────────────────────── */
  return (
    <Card className="mt-6">
      <CardContent className="space-y-8 p-6">
        <div className="space-y-2">
          <Label className="text-lg font-semibold">Chancelas e Marcas</Label>
          <p className="text-sm text-gray-500">
            Cada bloco representa uma chancela (ex: Patrocínio, Apoio,
            Realização). As marcas podem ser reordenadas dentro de cada bloco.
          </p>
        </div>

        {/* 🔹 DnD externo — blocos */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleOuterDragEnd}
        >
          <SortableContext
            items={localSponsors.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {localSponsors.map(block => (
              <SortableSponsorBlock
                key={block.id}
                block={block}
                updateLabel={updateLabel}
                addMarca={addMarca}
                updateMarca={updateMarca}
                removeMarca={removeMarca}
                removeChancela={removeChancela}
                reorderMarcas={reorderMarcas}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button onClick={addChancela} variant="secondary">
          + Adicionar Chancela
        </Button>
      </CardContent>
    </Card>
  )
}
