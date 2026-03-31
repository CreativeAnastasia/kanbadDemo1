import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const FORMAT_CLASS = {
  'Reel': 'format-reel',
  'Carousel': 'format-carousel',
  'Story': 'format-story',
  'Single Post': 'format-single',
}

function formatViews(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return n.toString()
}

export default function Card({ card, isPublished, onClick, dragOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id })

  const wrapperStyle = dragOverlay ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const cardClass = [
    'card',
    isDragging && !dragOverlay ? 'dragging' : '',
    dragOverlay ? 'card-drag-overlay' : '',
  ].filter(Boolean).join(' ')

  function handleMouseMove(e) {
    const el = e.currentTarget
    el.classList.remove('card-resetting')
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--card-mx', `${x * 100}%`)
    el.style.setProperty('--card-my', `${y * 100}%`)
    el.style.setProperty('--card-rot-x', `${(0.5 - y) * 10}deg`)
    el.style.setProperty('--card-rot-y', `${(x - 0.5) * 14}deg`)
  }

  function handleMouseLeave(e) {
    const el = e.currentTarget
    el.classList.add('card-resetting')
    el.style.setProperty('--card-mx', '50%')
    el.style.setProperty('--card-my', '-20%')
    el.style.setProperty('--card-rot-x', '0deg')
    el.style.setProperty('--card-rot-y', '0deg')
  }

  const inner = (
    <div
      className={cardClass}
      onClick={dragOverlay ? undefined : onClick}
      onMouseMove={dragOverlay ? undefined : handleMouseMove}
      onMouseLeave={dragOverlay ? undefined : handleMouseLeave}
    >
      <span className={`card-format-badge ${FORMAT_CLASS[card.format] ?? 'format-reel'}`}>
        {card.format}
      </span>

      <div className="card-title">{card.title}</div>

      {card.description && (
        <div className="card-description">{card.description}</div>
      )}

      {isPublished && (
        card.views !== null ? (
          <div className="card-footer">
            <div className="card-views">
              <svg className="card-views-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3C5 3 1.73 7.11 1.05 9.67a1 1 0 000 .66C1.73 12.89 5 17 10 17s8.27-4.11 8.95-6.67a1 1 0 000-.66C18.27 7.11 15 3 10 3zm0 11a4 4 0 110-8 4 4 0 010 8zm0-6a2 2 0 100 4 2 2 0 000-4z" />
              </svg>
              {formatViews(card.views)} views
            </div>
          </div>
        ) : (
          <div className="card-add-views">+ add view count</div>
        )
      )}
    </div>
  )

  if (dragOverlay) return inner

  return (
    <div ref={setNodeRef} style={wrapperStyle} {...attributes} {...listeners}>
      {inner}
    </div>
  )
}
