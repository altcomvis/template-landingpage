import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ReactElement } from 'react'
import { cloneElement, isValidElement } from 'react'

export function SortableItem({
  id,
  content,
}: {
  id: number
  content: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  // Permite passar os atributos de arrastar ao elemento interno
  const enhancedContent = isValidElement(content)
    ? cloneElement(content as ReactElement, {
        ...(attributes as any),
        ...(listeners as any),
      })
    : content

  return (
    <div ref={setNodeRef} style={style}>
      {enhancedContent}
    </div>
  )
}
