import { useEffect, useRef, useState } from 'react'
import type { Piece, TravelCountry } from '../data/pieces'
import worldMapSvg from '../assets/world-map.svg?raw'

interface TravelInspectViewProps {
  piece: Piece
  onClose: () => void
}


export function TravelInspectView({ piece, onClose }: TravelInspectViewProps) {
  const [hoveredCountryId, setHoveredCountryId] = useState<string | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const travelMap = piece.travelMap
  const countries = travelMap?.countries ?? []
  const hoveredCountry: TravelCountry | undefined = countries.find(
    (country) => country.id === hoveredCountryId,
  )

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKey)
    }
  }, [onClose])

  useEffect(() => {
    const map = mapRef.current?.querySelector('svg')
    if (!map) return

    map.setAttribute('role', 'img')
    map.setAttribute('aria-label', 'World map showing visited countries')

    const visitedIds = new Set(countries.map((country) => country.id))
    map.querySelectorAll<SVGElement>('path, polygon, polyline, g').forEach((element) => {
      element.style.setProperty('fill', '#e9e7e2', 'important')
      element.style.setProperty('stroke', '#c6c3bc', 'important')
      element.style.setProperty('stroke-width', '0.7', 'important')
    })

    const countryElements = Array.from(map.querySelectorAll<SVGElement>('[id]')).filter(
      (element) => visitedIds.has(element.id),
    )

    const cleanups = countryElements.map((element) => {
      const countryId = element.id
      const interactiveElement = element.querySelector<SVGElement>('.mainland') ?? element
      interactiveElement.style.setProperty('fill', '#8b5e3c', 'important')
      interactiveElement.style.setProperty('stroke', '#c6c3bc', 'important')
      interactiveElement.style.setProperty('stroke-width', '0.7', 'important')
      interactiveElement.classList.add('travel-inspect__country')
      interactiveElement.setAttribute('tabindex', '0')
      interactiveElement.setAttribute('role', 'button')
      const country = countries.find((item) => item.id === countryId)
      interactiveElement.setAttribute('aria-label', `${country?.name ?? countryId}: ${country?.status ?? 'Visited'}`)
      const handleEnter = () => setHoveredCountryId(countryId)
      const handleLeave = () => setHoveredCountryId(null)
      interactiveElement.addEventListener('mouseenter', handleEnter)
      interactiveElement.addEventListener('focus', handleEnter)
      interactiveElement.addEventListener('mouseleave', handleLeave)
      interactiveElement.addEventListener('blur', handleLeave)
      return () => {
        interactiveElement.removeEventListener('mouseenter', handleEnter)
        interactiveElement.removeEventListener('focus', handleEnter)
        interactiveElement.removeEventListener('mouseleave', handleLeave)
        interactiveElement.removeEventListener('blur', handleLeave)
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [countries])

  const clearCountry = () => setHoveredCountryId(null)

  return (
    <main className="case-study-view travel-inspect" aria-label={`Travel map: ${piece.title}`}>
      <button className="case-study-view__close" onClick={onClose} autoFocus>
        Back to Gallery ✕
      </button>

      <div className="travel-inspect__layout">
        <div className="travel-inspect__map-area">
          <p className="travel-inspect__eyebrow">Personal Interests · Atlas 01</p>
          <div className="travel-inspect__map-wrap" ref={mapRef} onMouseLeave={clearCountry} dangerouslySetInnerHTML={{ __html: worldMapSvg }} />
          <p className="travel-inspect__hint">Hover or focus a marked country to explore</p>
        </div>

        <aside className="travel-inspect__placard" aria-live="polite">
          <div className="travel-inspect__placard-inner" key={hoveredCountryId ?? 'summary'}>
            <p className="case-study__kicker">{hoveredCountry ? 'Visited Country' : 'World Travels'}</p>
            <h1 className="case-study__title">{hoveredCountry?.name ?? piece.title}</h1>
            <div className="case-study__meta">
              <span>{hoveredCountry?.status ?? piece.year}</span>
              <span className="case-study__meta-divider">·</span>
              <span>{hoveredCountry ? 'A place remembered' : piece.medium}</span>
            </div>
            <div className="case-study__body">
              <p>{hoveredCountry?.note ?? (hoveredCountry ? `${hoveredCountry.name} is part of the places I have visited.` : travelMap?.summary ?? piece.description)}</p>
              <div className="case-study__rule" />
              <p className="case-study__prompt">
                Move across the map to browse · Press Escape to return
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
