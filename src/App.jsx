import { useEffect } from 'react'
import { useBoard } from './hooks/useBoard.js'
import Board from './components/Board.jsx'
import Starfield from './components/Starfield.jsx'

function totalCards(boardState) {
  return boardState.columnOrder.reduce(
    (sum, colId) => sum + boardState.columns[colId].cards.length,
    0
  )
}

function publishedCount(boardState) {
  return boardState.columns.published.cards.length
}

function editingCount(boardState) {
  return boardState.columns.editing.cards.length
}

function scheduledCount(boardState) {
  return boardState.columns.scheduled.cards.length
}

export default function App() {
  const { boardState, addCard, updateCard, deleteCard, moveCard } = useBoard()

  useEffect(() => {
    const root = document.documentElement
    function onMove(e) {
      root.style.setProperty('--mx', `${e.clientX}px`)
      root.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
    <Starfield />
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="2" fill="white" />
              <rect x="11" y="2" width="7" height="7" rx="2" fill="white" opacity="0.7" />
              <rect x="2" y="11" width="7" height="7" rx="2" fill="white" opacity="0.7" />
              <rect x="11" y="11" width="7" height="7" rx="2" fill="white" opacity="0.5" />
            </svg>
          </div>
          <span className="sidebar-logo-name">ContentBoard</span>
        </div>

        <div className="sidebar-section-label">Workspace</div>

        <nav className="sidebar-nav">
          <a className="sidebar-nav-item active" href="#">
            <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            My Board
          </a>
        </nav>

        <a className="sidebar-platform-badge" href="https://instagram.com/anavar888" target="_blank" rel="noopener noreferrer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          Instagram
        </a>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="main-header">
          <div>
            <h1 className="main-header-title">Content Pipeline</h1>
            <p className="main-header-subtitle">Organize, track, and grow your content</p>
          </div>
          <div className="main-header-actions">
            <div className="header-stat">
              <strong>{totalCards(boardState)}</strong> total
            </div>
            <div className="header-stat">
              <strong>{editingCount(boardState)}</strong> editing
            </div>
            <div className="header-stat">
              <strong>{scheduledCount(boardState)}</strong> scheduled
            </div>
            <div className="header-stat">
              <strong>{publishedCount(boardState)}</strong> published
            </div>
          </div>
        </header>

        <div className="board-wrapper">
          <Board
            boardState={boardState}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onMoveCard={moveCard}
          />
        </div>
      </div>
    </div>
    </>
  )
}
