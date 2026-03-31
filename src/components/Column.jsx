import { useState } from 'react'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import Card from './Card.jsx'
import CardModal from './CardModal.jsx'

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

export default function Column({ column, accentColor, onAddCard, onUpdateCard, onDeleteCard }) {
  const isPublished = column.id === 'published'
  const cardIds = column.cards.map(c => c.id)

  const [addOpen, setAddOpen] = useState(false)
  const [editCard, setEditCard] = useState(null)

  const { setNodeRef } = useDroppable({ id: column.id })

  function handleAddSave(data) {
    onAddCard(column.id, data)
    setAddOpen(false)
  }

  function handleEditSave(data) {
    onUpdateCard(column.id, editCard.id, data)
    setEditCard(null)
  }

  function handleDelete() {
    onDeleteCard(column.id, editCard.id)
    setEditCard(null)
  }

  const colStyle = {
    '--accent': accentColor,
    '--accent-rgb': hexToRgb(accentColor),
  }

  return (
    <div className="column" style={colStyle}>
      <div className="column-header-accent" />

      <div className="column-header">
        <div className="column-title-row">
          <span className="column-title">{column.title}</span>
          <span className="column-count">{column.cards.length}</span>
        </div>
        <button
          className="column-add-btn"
          onClick={() => setAddOpen(true)}
          title={`Add to ${column.title}`}
          aria-label={`Add card to ${column.title}`}
        >
          +
        </button>
      </div>

      <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
        <div className="column-cards" ref={setNodeRef}>
          {column.cards.length === 0 && (
            <div className="column-empty">Drop cards here</div>
          )}
          {column.cards.map(card => (
            <Card
              key={card.id}
              card={card}
              isPublished={isPublished}
              onClick={() => setEditCard(card)}
            />
          ))}
        </div>
      </SortableContext>

      <CardModal
        isOpen={addOpen}
        mode="add"
        initialData={null}
        isPublished={isPublished}
        onSave={handleAddSave}
        onDelete={() => {}}
        onClose={() => setAddOpen(false)}
      />

      <CardModal
        isOpen={!!editCard}
        mode="edit"
        initialData={editCard}
        isPublished={isPublished}
        onSave={handleEditSave}
        onDelete={handleDelete}
        onClose={() => setEditCard(null)}
      />
    </div>
  )
}
