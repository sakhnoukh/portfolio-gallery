import { useRef, useState, type CSSProperties } from 'react'
import type { Piece } from '../data/pieces'
import { ArtContent } from './ArtContent'

interface FrameProps {
  piece: Piece
  onInspect?: (piece: Piece) => void
}

export function Frame({ piece, onInspect }: FrameProps) {
  const interactive = Boolean(onInspect)
  const frameRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    setCursor({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <div
      ref={frameRef}
      className={`frame frame--${piece.variant} ${interactive ? 'frame--interactive' : ''}`}
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
      onMouseMove={interactive ? handleMouseMove : undefined}
      onMouseEnter={interactive ? () => setHovered(true) : undefined}
      onMouseLeave={interactive ? () => setHovered(false) : undefined}
      style={{
        '--frame-ratio': piece.frameRatio ?? '3 / 4',
      } as CSSProperties}
    >
      <div className="frame__art">
        <ArtContent piece={piece} />
      </div>
      {interactive && (
        <div
          className={`frame__cursor-wrap ${hovered ? 'frame__cursor-wrap--visible' : ''}`}
          style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }}
        >
          <span className="frame__cursor">EXPLORE</span>
        </div>
      )}
    </div>
  )
}
