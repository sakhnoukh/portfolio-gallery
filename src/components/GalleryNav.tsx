interface GalleryNavSection {
  label: string
  progress: number
}

interface GalleryNavProps {
  progress: number
  sections: GalleryNavSection[]
  onNavigate: (progress: number) => void
}

function mapProgressToEquidistant(
  rawProgress: number,
  sections: GalleryNavSection[],
): number {
  const n = sections.length
  if (n <= 1) return 0

  const sorted = [...sections].sort((a, b) => a.progress - b.progress)

  const lastProgress = sorted[n - 1].progress
  if (rawProgress <= sorted[0].progress) return 0
  if (rawProgress >= lastProgress) {
    if (lastProgress >= 1) return (n - 1) / n
    const t = (rawProgress - lastProgress) / (1 - lastProgress)
    return ((n - 1) + t) / n
  }

  for (let i = 0; i < n - 1; i++) {
    const p0 = sorted[i].progress
    const p1 = sorted[i + 1].progress
    if (rawProgress >= p0 && rawProgress <= p1) {
      const t = (rawProgress - p0) / (p1 - p0)
      return (i + t) / n
    }
  }

  return rawProgress
}

export function GalleryNav({ progress, sections, onNavigate }: GalleryNavProps) {
  const n = sections.length
  const dotProgress = mapProgressToEquidistant(progress, sections)

  return (
    <nav className="gallery-nav" aria-label="Gallery navigation">
      <div className="gallery-nav__track">
        <div className="gallery-nav__line" />
        {sections.map((section, i) => (
          <button
            key={section.label}
            className="gallery-nav__label"
            style={{ left: `${(i / n) * 100}%` }}
            onClick={() => onNavigate(section.progress)}
            aria-label={`Go to ${section.label}`}
          >
            {section.label}
          </button>
        ))}
        <div
          className="gallery-nav__dot"
          style={{ left: `${dotProgress * 100}%` }}
        />
      </div>
    </nav>
  )
}
