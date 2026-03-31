import { useState } from 'react'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core'
import Column from './Column.jsx'
import Card from './Card.jsx'

const COLUMN_COLORS = {
  ideas:     '#ec4899',
  script:    '#3b82f6',
  filming:   '#f59e0b',
  editing:   '#14b8a6',
  scheduled: '#6366f1',
  published: '#22c55e',
}

export default function Board({ boardState, onAddCard, onUpdateCard, onDeleteCard, onMoveCard }) {
  const { columns, columnOrder } = boardState
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  function findColumnForCard(cardId) {
    for (const colId of columnOrder) {
      const col = columns[colId]
      if (col.cards.some(c => c.id === cardId)) return colId
    }
    return null
  }

  function onDragStart(event) {
    setActiveId(event.active.id)
  }

  function onDragEnd(event) {
    setActiveId(null)
    const { active, over } = event
    if (!over || active.id === over.id) return

    const sourceColId = findColumnForCard(active.id)
    if (!sourceColId) return

    const isOverAColumn = columnOrder.includes(over.id)
    const destColId = isOverAColumn ? over.id : findColumnForCard(over.id)
    if (!destColId) return

    const sourceCards = columns[sourceColId].cards
    const destCards = columns[destColId].cards

    const sourceIndex = sourceCards.findIndex(c => c.id === active.id)

    let destIndex
    if (isOverAColumn) {
      destIndex = destCards.length
    } else {
      destIndex = destCards.findIndex(c => c.id === over.id)
      if (destIndex < 0) destIndex = destCards.length
    }

    onMoveCard(sourceColId, destColId, sourceIndex, destIndex)
  }

  const activeColId = activeId ? findColumnForCard(activeId) : null
  const activeCard = activeColId
    ? columns[activeColId].cards.find(c => c.id === activeId)
    : null

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="board">
        {columnOrder.map(colId => (
          <Column
            key={colId}
            column={columns[colId]}
            accentColor={COLUMN_COLORS[colId]}
            onAddCard={onAddCard}
            onUpdateCard={onUpdateCard}
            onDeleteCard={onDeleteCard}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeCard && (
          <Card
            card={activeCard}
            isPublished={activeColId === 'published'}
            onClick={() => {}}
            dragOverlay
          />
        )}
      </DragOverlay>
    </DndContext>
  )
}
