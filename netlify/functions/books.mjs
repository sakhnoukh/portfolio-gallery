import { fetchBooks } from '../../server/notion-books.mjs'

export default async (req, res) => {
  try {
    const books = await fetchBooks()
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(books))
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: String(err) }))
  }
}
