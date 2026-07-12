import { useEffect } from 'react'
import type { Piece } from '../data/pieces'
import { Frame } from './Frame'

interface InspectOverlayProps {
  piece: Piece
  onClose: () => void
}

export function InspectOverlay({ piece, onClose }: InspectOverlayProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="inspect"
      role="dialog"
      aria-modal="true"
      aria-label={`Inspecting ${piece.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button className="inspect__close" onClick={onClose} autoFocus>
        Close ✕
      </button>
      <Frame piece={piece} />
      <div className="inspect__panel">
        <h2>{piece.title}</h2>
        <div className="inspect__medium">
          {piece.year} · {piece.medium}
        </div>
        <p>{piece.description}</p>
      </div>
    </div>
  )
}
