import type { CSSProperties } from 'react'
import type { Piece } from '../data/pieces'

interface ArtContentProps {
  piece: Piece
}

export function ArtContent({ piece }: ArtContentProps) {
  const style = { '--art-accent': piece.accent } as CSSProperties

  if (piece.kind === 'timeline' && piece.timeline) {
    return (
      <div className="art art--timeline" style={style}>
        <span className="art__eyebrow">{piece.year}</span>
        <ul className="timeline">
          {piece.timeline.map((entry) => (
            <li key={`${entry.year}-${entry.role}`}>
              <div className="timeline__year">{entry.year}</div>
              <div className="timeline__role">{entry.role}</div>
              <div className="timeline__place">{entry.place}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  if (piece.kind === 'book') {
    return (
      <div className="art art--book" style={style}>
        <span className="art__eyebrow">{piece.subtitle}</span>
        <span className="art__title">{piece.title}</span>
        <span className="art__medium">{piece.medium}</span>
      </div>
    )
  }

  if (piece.kind === 'photo') {
    return (
      <div className="art art--photo" style={style}>
        <span className="art__title">{piece.title}</span>
        <span className="art__medium">{piece.medium}</span>
      </div>
    )
  }

  return (
    <div className="art art--poster" style={style}>
      <span className="art__eyebrow">{piece.subtitle}</span>
      <div>
        <div className="art__title">{piece.title}</div>
        <div className="art__rule" />
        <div className="art__medium">{piece.medium}</div>
      </div>
      <span className="art__eyebrow">{piece.year}</span>
    </div>
  )
}
