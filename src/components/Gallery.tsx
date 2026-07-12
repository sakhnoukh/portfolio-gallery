import { Fragment, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { pieces, rooms, type Piece } from '../data/pieces'
import { Frame } from './Frame'
import { Placard } from './Placard'
import { InspectOverlay } from './InspectOverlay'

gsap.registerPlugin(ScrollTrigger)

export function Gallery() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [inspected, setInspected] = useState<Piece | null>(null)

  useLayoutEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    const mm = gsap.matchMedia()

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const getDistance = () => track.scrollWidth - window.innerWidth

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Arrow-key navigation between wall segments
        const onKey = (e: KeyboardEvent) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
          const st = tween.scrollTrigger
          if (!st) return
          const segments = pieces.length + 1
          const step = (st.end - st.start) / segments
          const dir = e.key === 'ArrowRight' ? 1 : -1
          const target = gsap.utils.clamp(
            st.start,
            st.end,
            Math.round((window.scrollY + dir * step) / step) * step + st.start,
          )
          window.scrollTo({ top: target, behavior: 'smooth' })
        }
        window.addEventListener('keydown', onKey)

        // Map horizontal trackpad swipes to gallery movement
        const onWheel = (e: WheelEvent) => {
          if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
          e.preventDefault()
          window.scrollBy({ top: e.deltaX })
        }
        window.addEventListener('wheel', onWheel, { passive: false })

        return () => {
          window.removeEventListener('wheel', onWheel)
          window.removeEventListener('keydown', onKey)
          tween.scrollTrigger?.kill()
        }
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <>
      <div className="gallery-pin" ref={pinRef}>
        <div className="gallery-track" ref={trackRef}>
          <section className="wall-segment wall-segment--intro">
            <p>Sami Akhnoukh — Selected Works</p>
            <h1>The Gallery</h1>
            <span className="intro-hint">Walk right</span>
          </section>

          {rooms.map((room, i) => (
            <Fragment key={room.id}>
              {i > 0 && (
                <section
                  className={`wall-segment wall-segment--hallway ${rooms[i - 1].wall === '#ffffff' ? 'wall-segment--hallway-from-light' : ''}`}
                  aria-hidden="true"
                  style={
                    {
                      '--wall-from': rooms[i - 1].wall,
                      '--wall-to': room.wall,
                      '--floor-from': rooms[i - 1].floorStart,
                      '--floor-to': room.floorStart,
                      '--floor-end-from': rooms[i - 1].floorEnd,
                      '--floor-end-to': room.floorEnd,
                      '--crease-from': rooms[i - 1].crease,
                      '--crease-to': room.crease,
                    } as CSSProperties
                  }
                >
                  <p className="hallway-label">{room.label}</p>
                </section>
              )}
              {pieces
                .filter((piece) => piece.room === room.id)
                .map((piece) => (
                  <section
                    className="wall-segment"
                    key={piece.id}
                    aria-label={piece.title}
                    style={{
                      '--wall': room.wall,
                      '--floor-start': room.floorStart,
                      '--floor-end': room.floorEnd,
                      '--crease': room.crease,
                    } as CSSProperties}
                  >
                    <div className="piece-group">
                      <Frame piece={piece} onInspect={setInspected} />
                      <Placard piece={piece} />
                    </div>
                  </section>
                ))}
            </Fragment>
          ))}
        </div>
      </div>

      {inspected && (
        <InspectOverlay piece={inspected} onClose={() => setInspected(null)} />
      )}
    </>
  )
}
