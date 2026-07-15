import { useEffect, useRef, useState } from 'react'
import { genreToColor } from '../lib/genre-color'

interface Book {
  title: string
  author: string
  shelf: string
  genre: string
}

const SHELF_LABELS: Record<string, string> = {
  read: 'Read',
  'to-read': 'To Read',
  'did-not-finish': 'Did Not Finish',
}

const SPINE_HEIGHTS = [175, 195, 210, 225, 235, 245, 205, 220, 185, 230, 200, 240, 190, 215]
const BOOK_WIDTH = 64

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

function computeBooksPerShelf(width: number): number {
  const bookcasePadding = 28 // 14px on each side
  const shelfPadding = 16 // 8px on each side
  const gap = 2
  const available = Math.max(0, width - bookcasePadding - shelfPadding)
  const count = Math.floor((available + gap) / (BOOK_WIDTH + gap))
  return Math.max(3, count)
}

export function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [booksPerShelf, setBooksPerShelf] = useState(12)
  const bookcaseRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/books')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then((data: Book[]) => {
        setBooks(data.sort((a, b) => a.author.localeCompare(b.author)))
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const el = bookcaseRef.current
    if (!el) return

    const update = () => {
      setBooksPerShelf(computeBooksPerShelf(el.clientWidth))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [loading])

  if (loading) {
    return <div className="bookshelf bookshelf--loading">Loading bookshelf…</div>
  }

  if (error) {
    return <div className="bookshelf bookshelf--error">Failed to load bookshelf: {error}</div>
  }

  if (books.length === 0) {
    return <div className="bookshelf bookshelf--empty">No books found.</div>
  }

  const shelves = chunk(books, booksPerShelf)

  return (
    <div className="bookcase" ref={bookcaseRef}>
      <div className="bookcase__inner">
        {shelves.map((shelfBooks, shelfIdx) => (
          <div className="bookcase__shelf" key={shelfIdx}>
            <div className="bookcase__shelf-books">
              {shelfBooks.map((book, i) => {
                const globalIdx = shelfIdx * booksPerShelf + i
                const color = genreToColor(book.genre)
                const height = SPINE_HEIGHTS[(globalIdx + shelfIdx * 3) % SPINE_HEIGHTS.length]
                const shelfLabel = SHELF_LABELS[book.shelf] ?? book.shelf

                return (
                  <div
                    key={`${book.title}-${globalIdx}`}
                    className="book-spine"
                    style={{
                      backgroundColor: color.bg,
                      color: color.text,
                      height: `${height}px`,
                    }}
                    data-shelf={shelfLabel}
                    title={`${book.title} — ${book.author}`}
                  >
                    <span className="book-spine__bands book-spine__bands--top" aria-hidden="true">
                      <span className="book-spine__band" />
                      <span className="book-spine__band" />
                    </span>
                    <span className="book-spine__title">{book.title}</span>
                    <span className="book-spine__author">{book.author}</span>
                    <span className="book-spine__bands book-spine__bands--bottom" aria-hidden="true">
                      <span className="book-spine__band" />
                      <span className="book-spine__band" />
                    </span>
                    <span className="book-spine__tooltip">
                      <span className="book-spine__tooltip-title">{book.title}</span>
                      <span className="book-spine__tooltip-author">{book.author}</span>
                      <span className="book-spine__tooltip-genre">{book.genre || 'Uncategorized'}</span>
                      <span className="book-spine__tooltip-shelf">{shelfLabel}</span>
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="bookcase__board" />
          </div>
        ))}
      </div>
    </div>
  )
}
