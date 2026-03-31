import { useState, useEffect, useRef } from 'react'

const FORMAT_OPTIONS = ['Reel', 'Carousel', 'Story', 'Single Post']

export default function CardModal({ isOpen, mode, initialData, isPublished, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [format, setFormat] = useState('Reel')
  const [views, setViews] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title ?? '')
      setDescription(initialData?.description ?? '')
      setFormat(initialData?.format ?? 'Reel')
      setViews(initialData?.views != null ? String(initialData.views) : '')
      setConfirmDelete(false)
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  function handleSave() {
    if (!title.trim()) return
    const viewsNum = views !== '' ? parseInt(views, 10) : null
    onSave({
      title: title.trim(),
      description: description.trim(),
      format,
      views: isPublished ? (isNaN(viewsNum) ? null : viewsNum) : null,
    })
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete()
  }

  function handleModalMouseMove(e) {
    const el = e.currentTarget
    el.classList.remove('modal-resetting')
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--modal-rot-x', `${(0.5 - y) * 6}deg`)
    el.style.setProperty('--modal-rot-y', `${(x - 0.5) * 8}deg`)
  }

  function handleModalMouseLeave(e) {
    const el = e.currentTarget
    el.classList.add('modal-resetting')
    el.style.setProperty('--modal-rot-x', '0deg')
    el.style.setProperty('--modal-rot-y', '0deg')
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onMouseMove={handleModalMouseMove}
        onMouseLeave={handleModalMouseLeave}
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? 'New card' : 'Edit card'}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className="modal-field">
          <label className="modal-label">Title *</label>
          <input
            ref={titleRef}
            className="modal-input"
            type="text"
            placeholder="What's this content about?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">Description</label>
          <textarea
            className="modal-textarea"
            placeholder="Notes, references, brief..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <label className="modal-label">Format</label>
          <select
            className="modal-select"
            value={format}
            onChange={e => setFormat(e.target.value)}
          >
            {FORMAT_OPTIONS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        {isPublished && (
          <div className="modal-field">
            <label className="modal-label">Views / Impressions</label>
            <input
              className="modal-input"
              type="number"
              placeholder="e.g. 42000"
              min="0"
              value={views}
              onChange={e => setViews(e.target.value)}
            />
          </div>
        )}

        <div className="modal-actions">
          <div>
            {mode === 'edit' && (
              <button
                className={`btn ${confirmDelete ? 'btn-danger-confirm' : 'btn-danger'}`}
                onClick={handleDelete}
              >
                {confirmDelete ? 'Are you sure?' : 'Delete'}
              </button>
            )}
          </div>
          <div className="modal-actions-right">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!title.trim()}
            >
              {mode === 'add' ? 'Add card' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
