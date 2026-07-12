import type { CSSProperties } from 'react'
import type { Piece } from '../data/pieces'
import { ArtContent } from './ArtContent'

interface FrameProps {
  piece: Piece
  onInspect?: (piece: Piece) => void
}

export function Frame({ piece, onInspect }: FrameProps) {
  const interactive = Boolean(onInspect)

  return (
    <div
      className={`frame frame--${piece.variant}`}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? `Inspect ${piece.title}` : undefined}
      onClick={interactive ? () => onInspect?.(piece) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onInspect?.(piece)
              }
            }
          : undefined
      }
      style={{
        cursor: interactive ? 'pointer' : undefined,
        '--frame-ratio': piece.frameRatio ?? '3 / 4',
      } as CSSProperties}
    >
      <div className="frame__art">
        <ArtContent piece={piece} />
      </div>
    </div>
  )
}
