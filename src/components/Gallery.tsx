import { Fragment, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
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
  const contentRef = useRef<HTMLDivElement>(null)
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
  const [trackGradient, setTrackGradient] = useState<{
    wall: string
    floor: string
  }>({
    wall: 'linear-gradient(to right, #ffffff 0%, #ffffff 100%)',
    floor: 'linear-gradient(to right, #d8d8d8 0%, #d8d8d8 100%)',
  })

  const updateTrackGradient = useCallback(() => {
    const content = contentRef.current
    if (!content) return
    const trackChildren = Array.from(content.children) as HTMLElement[]
    const total = content.scrollWidth
    if (total === 0 || trackChildren.length < 2) return

    let offset = 0
    const wallStops: string[] = []
    const floorStops: string[] = []
    const feather = 20 // px to ease transition edges

    const pushStops = (wall: string, floor: string) => {
      const percent = (offset / total) * 100
      wallStops.push(`${wall} ${percent}%`)
      floorStops.push(`${floor} ${percent}%`)
    }

    // Push a stop at an explicit px offset (for feathering)
    const pushStopsAt = (wall: string, floor: string, px: number) => {
      const percent = (px / total) * 100
      wallStops.push(`${wall} ${percent}%`)
      floorStops.push(`${floor} ${percent}%`)
    }

    // color-mix midpoint helper for feathering
    const mix = (a: string, b: string) => `color-mix(in oklab, ${a}, ${b})`

    // Intro segment — hold white solid through the intro's full width
    const intro = trackChildren[0]
    pushStops('#ffffff', '#d8d8d8')
    offset += intro.offsetWidth
    pushStops('#ffffff', '#d8d8d8')

    let childIndex = 1

    rooms.forEach((room, i) => {
      // Hallway — feather the transition across the gap
      const hallway = trackChildren[childIndex]
      if (!hallway) return

      const prevRoom = rooms[i - 1]
      const prevWall = prevRoom?.wall ?? '#ffffff'
      const prevFloor = prevRoom?.floorStart ?? room.floorStart

      const gapStart = offset
      const gapEnd = offset + hallway.offsetWidth
      const gapMid = (gapStart + gapEnd) / 2

      // Pull the solid stop back by feather px
      pushStopsAt(prevWall, prevFloor, gapStart - feather)
      // Midpoint hint to bend the interpolation curve
      pushStopsAt(mix(prevWall, room.wall), mix(prevFloor, room.floorStart), gapMid)
      // Push the target solid stop forward by feather px
      pushStopsAt(room.wall, room.floorStart, gapEnd + feather)

      offset = gapEnd
      childIndex += 1

      // Room pieces — hold the room color solid through all content.
      const roomPieces = pieces.filter((p) => p.room === room.id)
      roomPieces.forEach(() => {
        const piece = trackChildren[childIndex]
        if (!piece) return
        offset += piece.offsetWidth
        childIndex += 1
      })
      pushStops(room.wall, room.floorStart)
    })

    setTrackGradient({
      wall: `linear-gradient(to right in oklab, ${wallStops.join(', ')})`,
      floor: `linear-gradient(to right in oklab, ${floorStops.join(', ')})`,
    })
  }, [])

  useLayoutEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    const content = contentRef.current
    if (!pin || !track || !content) return

    const mm = gsap.matchMedia()

    mm.add(
      '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      () => {
        const getDistance = () => content.scrollWidth - window.innerWidth

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

        const tween = gsap.to(content, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 0.5,
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

  const scrollPosRef = useRef(0)

  useEffect(() => {
    const st = scrollTriggerRef.current
    if (!st) return
    if (showCv) {
      scrollPosRef.current = window.scrollY
      st.disable(false)
    } else if (!inspected) {
      if (scrollPosRef.current > 0) {
        st.enable()
        window.scrollTo({ top: scrollPosRef.current })
        scrollPosRef.current = 0
      }
    }
  }, [inspected, showCv])

  // Compute and recompute the unified track gradient as widths change
  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    updateTrackGradient()
    const observer = new ResizeObserver(updateTrackGradient)
    observer.observe(content)
    window.addEventListener('load', updateTrackGradient)
    ScrollTrigger.addEventListener('refresh', updateTrackGradient)

    return () => {
      observer.disconnect()
      window.removeEventListener('load', updateTrackGradient)
      ScrollTrigger.removeEventListener('refresh', updateTrackGradient)
    }
  }, [updateTrackGradient])

  const handleNavigate = (targetProgress: number) => {
    const st = scrollTriggerRef.current
    if (!st) return
    const target = st.start + targetProgress * (st.end - st.start)
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  const activeRoom = useMemo(() => {
    if (sections.length < 2 || progress < sections[1].progress) return null
    for (let i = 2; i < sections.length; i++) {
      if (progress < sections[i].progress) return rooms[i - 2]
    }
    return rooms[rooms.length - 1]
  }, [progress, sections])

  const isRoomDark = (wall: string) => {
    const hex = wall.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    // Standard luminance; threshold chosen so green and red rooms are light, white room is dark
    return 0.299 * r + 0.587 * g + 0.114 * b < 140
  }

  const lightNav = activeRoom ? isRoomDark(activeRoom.wall) : false

  return (
    <>
      <div className="gallery-pin" ref={pinRef}>
        <div className="gallery-track" ref={trackRef}>
          <div
            className="gallery-track__content"
            ref={contentRef}
            style={{
              visibility: showCv ? 'hidden' : undefined,
              '--track-wall-gradient': trackGradient.wall,
              '--track-floor-gradient': trackGradient.floor,
            } as CSSProperties}
          >
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
      </div>

      {!showCv && (
        <GalleryNav
          progress={progress}
          sections={sections}
          onNavigate={handleNavigate}
          light={lightNav}
        />
      )}

      {showCv && <CvView onBack={() => setShowCv(false)} />}

      {inspected && (
        <InspectOverlay piece={inspected} onClose={() => setInspected(null)} />
      )}
    </>
  )
}
