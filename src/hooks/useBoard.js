import { useState, useEffect } from 'react'

const STORAGE_KEY = 'content-kanban-board-v1'

const INITIAL_STATE = {
  columnOrder: ['ideas', 'script', 'filming', 'editing', 'scheduled', 'published'],
  columns: {
    ideas: {
      id: 'ideas',
      title: 'Ideas',
      cards: [
        {
          id: crypto.randomUUID(),
          title: 'Behind-the-scenes morning routine',
          description: 'Day-in-the-life style, casual and authentic. Show workspace setup.',
          format: 'Reel',
          views: null,
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now() - 86400000,
        },
        {
          id: crypto.randomUUID(),
          title: 'Top 5 tools I use daily',
          description: 'Carousel with product shots and affiliate links.',
          format: 'Carousel',
          views: null,
          createdAt: Date.now() - 43200000,
          updatedAt: Date.now() - 43200000,
        },
      ],
    },
    script: {
      id: 'script',
      title: 'Script',
      cards: [
        {
          id: crypto.randomUUID(),
          title: 'How I grew to 10k followers',
          description: 'Honest breakdown, no fluff. Include mistakes and turning points.',
          format: 'Reel',
          views: null,
          createdAt: Date.now() - 172800000,
          updatedAt: Date.now() - 72000000,
        },
      ],
    },
    filming: { id: 'filming', title: 'Filming', cards: [] },
    editing: { id: 'editing', title: 'Editing', cards: [] },
    scheduled: {
      id: 'scheduled',
      title: 'Scheduled',
      cards: [
        {
          id: crypto.randomUUID(),
          title: 'Spring capsule wardrobe',
          description: '6 outfits, one aesthetic. Trending audio.',
          format: 'Carousel',
          views: null,
          createdAt: Date.now() - 259200000,
          updatedAt: Date.now() - 3600000,
        },
      ],
    },
    published: {
      id: 'published',
      title: 'Published',
      cards: [
        {
          id: crypto.randomUUID(),
          title: 'My creative process (unfiltered)',
          description: 'Raw, honest, 90-second reel. Best performing in the last 3 months.',
          format: 'Reel',
          views: 142000,
          createdAt: Date.now() - 604800000,
          updatedAt: Date.now() - 604800000,
        },
        {
          id: crypto.randomUUID(),
          title: 'Product review: desk lamp',
          description: 'Honest review, single static post with swipe detail.',
          format: 'Single Post',
          views: 8300,
          createdAt: Date.now() - 1209600000,
          updatedAt: Date.now() - 1209600000,
        },
      ],
    },
  },
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function saveToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — silently fail
  }
}

export function useBoard() {
  const [boardState, setBoardState] = useState(() => {
    return loadFromStorage() ?? INITIAL_STATE
  })

  useEffect(() => {
    saveToStorage(boardState)
  }, [boardState])

  function addCard(columnId, cardData) {
    const newCard = {
      id: crypto.randomUUID(),
      title: cardData.title,
      description: cardData.description ?? '',
      format: cardData.format ?? 'Reel',
      views: cardData.views ?? null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    setBoardState(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cards: [...prev.columns[columnId].cards, newCard],
        },
      },
    }))
  }

  function updateCard(columnId, cardId, patch) {
    setBoardState(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cards: prev.columns[columnId].cards.map(c =>
            c.id === cardId ? { ...c, ...patch, updatedAt: Date.now() } : c
          ),
        },
      },
    }))
  }

  function deleteCard(columnId, cardId) {
    setBoardState(prev => ({
      ...prev,
      columns: {
        ...prev.columns,
        [columnId]: {
          ...prev.columns[columnId],
          cards: prev.columns[columnId].cards.filter(c => c.id !== cardId),
        },
      },
    }))
  }

  function moveCard(sourceColId, destColId, sourceIndex, destIndex) {
    setBoardState(prev => {
      const sourceCards = [...prev.columns[sourceColId].cards]
      const [moved] = sourceCards.splice(sourceIndex, 1)

      if (sourceColId === destColId) {
        sourceCards.splice(destIndex, 0, moved)
        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColId]: { ...prev.columns[sourceColId], cards: sourceCards },
          },
        }
      }

      const destCards = [...prev.columns[destColId].cards]
      destCards.splice(destIndex, 0, moved)

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceColId]: { ...prev.columns[sourceColId], cards: sourceCards },
          [destColId]: { ...prev.columns[destColId], cards: destCards },
        },
      }
    })
  }

  return { boardState, addCard, updateCard, deleteCard, moveCard }
}
