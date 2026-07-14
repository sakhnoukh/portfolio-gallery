import { useEffect, useState } from 'react'
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

const SPINE_HEIGHTS = [200, 220, 240, 210, 230, 190, 250, 215]
const BOOKS_PER_SHELF = 24

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size))
  }
  return chunks
}

export function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return <div className="bookshelf bookshelf--loading">Loading bookshelf…</div>
  }

  if (error) {
    return <div className="bookshelf bookshelf--error">Failed to load bookshelf: {error}</div>
  }

  if (books.length === 0) {
    return <div className="bookshelf bookshelf--empty">No books found.</div>
  }

  return (
    <div className="bookcase">
      <div className="bookcase__inner">
        {chunk(books, BOOKS_PER_SHELF).map((shelfBooks, shelfIdx) => (
          <div className="bookcase__shelf" key={shelfIdx}>
            <div className="bookcase__shelf-books">
              {shelfBooks.map((book, i) => {
                const globalIdx = shelfIdx * BOOKS_PER_SHELF + i
                const color = genreToColor(book.genre)
                const height = SPINE_HEIGHTS[globalIdx % SPINE_HEIGHTS.length]
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
                    <span className="book-spine__title">{book.title}</span>
                    <span className="book-spine__author">{book.author}</span>
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
