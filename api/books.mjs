// @ts-check
import { fetchBooks } from '../server/notion-books.mjs'

export default async function handler(_req, res) {
  try {
    const books = await fetchBooks()
    res.setHeader('Content-Type', 'application/json')
    res.status(200).json(books)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
}
