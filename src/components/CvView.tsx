import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

const cvPdf = '/cv.pdf'

interface CvViewProps {
  onBack: () => void
}

export function CvView({ onBack }: CvViewProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  return (
    <main className="cv-view" aria-label="CV view">
      <button
        className="cv-view__toggle"
        onClick={onBack}
        aria-label="Switch back to Gallery"
      >
        <span className="cv-view__toggle-label">Gallery</span>
        <span className="cv-view__toggle-label cv-view__toggle-label--active">CV</span>
      </button>
      <a
        className="cv-view__button cv-view__button--download"
        href={cvPdf}
        download="Sami Akhnoukh CV.pdf"
      >
        Download CV
      </a>
      <div
        className="cv-view__frame cv-view__frame--pdfjs"
        onClick={(e) => {
          const target = e.target as HTMLElement
          const anchor = target.closest('a')
          if (anchor && !anchor.hasAttribute('download')) {
            e.preventDefault()
            window.open(anchor.href, '_blank', 'noreferrer')
          }
        }}
      >
        {loading && (
          <p className="cv-view__loading">Loading CV…</p>
        )}
        {error ? (
          <div className="cv-view__fallback">
            <p>
              Could not load the PDF:
              <br />
              <em>{error.message}</em>
            </p>
            <p>
              <a href={cvPdf} target="_blank" rel="noreferrer">
                Open in new tab
              </a>{' '}
              ·{' '}
              <a href={cvPdf} download="Sami Akhnoukh CV.pdf">
                Download
              </a>
            </p>
          </div>
        ) : (
          <Document
            file={cvPdf}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages)
              setLoading(false)
            }}
            onLoadError={(err) => {
              setError(err)
              setLoading(false)
            }}
          >
            {Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i + 1}
                pageNumber={i + 1}
                renderTextLayer
                renderAnnotationLayer
                width={Math.min(820, window.innerWidth * 0.9)}
              />
            ))}
          </Document>
        )}
      </div>
    </main>
  )
}
