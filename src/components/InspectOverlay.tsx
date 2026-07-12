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
    <main className="case-study-view" aria-label={`Case study: ${piece.title}`}>
      <button className="case-study-view__close" onClick={onClose} autoFocus>
        Back to Gallery ✕
      </button>

      <div className="case-study-view__split">
        <div className="case-study-left">
          <Frame piece={piece} />
        </div>

        <div className="case-study-right">
          <p className="case-study__kicker">Selected Work</p>
          <h1 className="case-study__title">{piece.title}</h1>
          <div className="case-study__meta">
            <span>{piece.year}</span>
            <span className="case-study__meta-divider">·</span>
            <span>{piece.medium}</span>
          </div>

          <div className="case-study__body">
            <p>{piece.description}</p>

            {piece.kind === 'timeline' && piece.timeline && (
              <div className="case-study__timeline">
                {piece.timeline.map((entry) => (
                  <div className="case-study__timeline-entry" key={`${entry.year}-${entry.role}`}>
                    <span className="case-study__timeline-year">{entry.year}</span>
                    <span className="case-study__timeline-role">{entry.role}</span>
                    <span className="case-study__timeline-place">{entry.place}</span>
                  </div>
                ))}
              </div>
            )}

            <p>
              This piece represents a deeper exploration of the themes and techniques
              described above. The work sits at the intersection of craft and concept,
              balancing technical execution with a clear editorial voice.
            </p>
            <p>
              Each decision in the process — from the choice of materials to the final
              presentation — was guided by a commitment to clarity and intentionality.
              The result is a body of work that speaks not only to what was made, but
              to how and why it was made.
            </p>

            <div className="case-study__rule" />

            <p className="case-study__prompt">
              Press Escape to return to the gallery
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
