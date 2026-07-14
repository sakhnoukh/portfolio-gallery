import { useEffect } from 'react'
import type { CaseStudyBlock, Piece } from '../data/pieces'
import { Frame } from './Frame'
import { Bookshelf } from './Bookshelf'

interface InspectOverlayProps {
  piece: Piece
  onClose: () => void
}

function CaseStudyContent({ blocks }: { blocks: CaseStudyBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'paragraph':
            return <p key={i}>{block.text}</p>
          case 'subheading':
            return <h2 className="case-study__subheading" key={i}>{block.text}</h2>
          case 'image':
            return (
              <figure className="case-study__figure" key={i}>
                <img src={block.src} alt={block.alt ?? ''} />
                {block.caption && (
                  <figcaption className="case-study__caption">{block.caption}</figcaption>
                )}
              </figure>
            )
          case 'list':
            return (
              <ul className="case-study__list" key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )
          case 'links':
            return (
              <ul className="case-study__links" key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>
                    <a href={item.href} target="_blank" rel="noreferrer">{item.label} ↗</a>
                  </li>
                ))}
              </ul>
            )
        }
      })}
    </>
  )
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

      {piece.kind === 'book' ? (
        <div className="case-study-view__book">
          <div className="case-study-view__book-top">
            <div className="case-study-view__book-frame">
              <Frame piece={piece} />
            </div>
            <div className="case-study-view__book-intro">
              <p className="case-study__kicker">Selected Work</p>
              <h1 className="case-study__title">{piece.title}</h1>
              <div className="case-study__meta">
                <span>{piece.year}</span>
                <span className="case-study__meta-divider">·</span>
                <span>{piece.medium}</span>
              </div>
              <p className="case-study__description">{piece.description}</p>
            </div>
          </div>
          <Bookshelf />
        </div>
      ) : (
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

            {piece.url && (
              <a
                className="case-study__link"
                href={piece.url}
                target="_blank"
                rel="noreferrer"
              >
                Visit project ↗
              </a>
            )}

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

              {piece.caseStudy && <CaseStudyContent blocks={piece.caseStudy} />}

              <div className="case-study__rule" />

              <p className="case-study__prompt">
                Press Escape to return to the gallery
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
