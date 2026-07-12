import { useEffect } from 'react'
import type { Piece } from '../data/pieces'
import { Frame } from './Frame'

interface InspectOverlayProps {
  piece: Piece
  onClose: () => void
}

export function InspectOverlay({ piece, onClose }: InspectOverlayProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  return (
    <main className="inspect" aria-label={`Inspecting ${piece.title}`}>
      <button className="inspect__close" onClick={onClose} autoFocus>
        Back to gallery ✕
      </button>
      <div className="inspect__hero">
        <Frame piece={piece} />
        <div className="inspect__panel">
          <p className="inspect__eyebrow">Selected work</p>
          <h1>{piece.title}</h1>
          <div className="inspect__medium">
            {piece.year} · {piece.medium}
          </div>
          <p>{piece.description}</p>
        </div>
      </div>
      <section className="inspect__details" aria-label={`${piece.title} details`}>
        <p className="inspect__eyebrow">About the piece</p>
        <p>{piece.description}</p>
        <div className="inspect__rule" />
        <p className="inspect__prompt">Scroll to explore · Press Escape to return</p>
      </section>
    </main>
  )
}
