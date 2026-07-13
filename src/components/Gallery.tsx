import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { pieces, rooms, type Piece } from '../data/pieces'
import { Frame } from './Frame'
import { Placard } from './Placard'
import { InspectOverlay } from './InspectOverlay'
import { GalleryNav } from './GalleryNav'
import { CvView } from './CvView'

gsap.registerPlugin(ScrollTrigger)

export function Gallery() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const hallwayRefs = useRef<(HTMLElement | null)[]>([])
  const [inspected, setInspected] = useState<Piece | null>(null)
  const [progress, setProgress] = useState(0)
  const [showCv, setShowCv] = useState(false)
  const [sections, setSections] = useState<{ label: string; progress: number }[]>([
    { label: 'HOME', progress: 0 },
    { label: 'PROJ', progress: 0 },
    { label: 'EXPR', progress: 0 },
    { label: 'INFO', progress: 0 },
  ])

  useLayoutEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    const mm = gsap.matchMedia()

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const getDistance = () => track.scrollWidth - window.innerWidth

        const computeSections = () => {
          const distance = getDistance()
          if (distance <= 0) return
          const progresses = hallwayRefs.current.map((el) => {
            if (!el) return 0
            const label = el.querySelector('.hallway-label') as HTMLElement | null
            if (label) {
              const labelLeftInTrack = el.offsetLeft + label.offsetLeft
              return Math.min(1, Math.max(0, labelLeftInTrack / distance))
            }
            return Math.min(1, Math.max(0, el.offsetLeft / distance))
          })
          setSections([
            { label: 'HOME', progress: 0 },
            { label: 'PROJ', progress: progresses[0] ?? 0 },
            { label: 'EXPR', progress: progresses[1] ?? 0 },
            { label: 'INFO', progress: progresses[2] ?? 0 },
          ])
        }

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
            onUpdate: (self) => setProgress(self.progress),
          },
        })

        scrollTriggerRef.current = tween.scrollTrigger ?? null
        computeSections()
        ScrollTrigger.addEventListener('refresh', computeSections)

        // Arrow-key navigation between wall segments
        const onKey = (e: KeyboardEvent) => {
          if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
          const st = tween.scrollTrigger
          if (!st) return
          const segments = pieces.length + rooms.length + 1
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
          ScrollTrigger.removeEventListener('refresh', computeSections)
          tween.scrollTrigger?.kill()
          scrollTriggerRef.current = null
        }
      },
    )

    return () => mm.revert()
  }, [])

  useEffect(() => {
    const st = scrollTriggerRef.current
    if (!st) return
    if (inspected || showCv) {
      st.disable(false)
    } else {
      st.enable()
      ScrollTrigger.refresh()
    }
  }, [inspected, showCv])

  const handleNavigate = (targetProgress: number) => {
    const st = scrollTriggerRef.current
    if (!st) return
    const target = st.start + targetProgress * (st.end - st.start)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  return (
    <>
      <div className="gallery-pin" ref={pinRef}>
        <div className="gallery-track" ref={trackRef} style={showCv ? { visibility: 'hidden' } : undefined}>
          <section className="wall-segment wall-segment--intro">
            <button
              className="intro__cv-toggle"
              onClick={() => setShowCv(true)}
              aria-label="Switch to CV view"
            >
              <span className="intro__cv-toggle-label intro__cv-toggle-label--active">Gallery</span>
              <span className="intro__cv-toggle-label">CV</span>
            </button>
            <p>Sami Akhnoukh — Selected Works</p>
            <h1>The Gallery</h1>
            <span className="intro-hint">Walk right</span>
          </section>

          {rooms.map((room, i) => (
            <Fragment key={room.id}>
              <section
                ref={(el) => { hallwayRefs.current[i] = el }}
                className={`wall-segment wall-segment--hallway ${i === 0 ? 'wall-segment--first-entrance' : ''}`}
                aria-label={`${room.label} room entrance`}
                style={
                  {
                    '--wall-from': rooms[i - 1]?.wall ?? '#ffffff',
                    '--wall-to': room.wall,
                    '--floor-from': rooms[i - 1]?.floorStart ?? room.floorStart,
                    '--floor-to': room.floorStart,
                    '--floor-end-from': rooms[i - 1]?.floorEnd ?? room.floorEnd,
                    '--floor-end-to': room.floorEnd,
                    '--crease-from': rooms[i - 1]?.crease ?? room.crease,
                    '--crease-to': room.crease,
                  } as CSSProperties
                }
              >
                <p className="hallway-label">{room.label}</p>
              </section>
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

      {!showCv && (
        <GalleryNav progress={progress} sections={sections} onNavigate={handleNavigate} />
      )}

      {showCv && <CvView onBack={() => setShowCv(false)} />}

      {inspected && (
        <InspectOverlay piece={inspected} onClose={() => setInspected(null)} />
      )}
    </>
  )
}
