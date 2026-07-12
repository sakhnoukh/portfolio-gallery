import type { Piece } from '../data/pieces'

interface PlacardProps {
  piece: Piece
}

export function Placard({ piece }: PlacardProps) {
  return (
    <div className="placard">
      <div className="placard__title">
        {piece.title}
        <em>{piece.year}</em>
      </div>
      <div className="placard__medium">{piece.medium}</div>
      <p className="placard__description">{piece.description}</p>
    </div>
  )
}
