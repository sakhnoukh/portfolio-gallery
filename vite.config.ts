import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error — .mjs imports lack type declarations; runtime is fine
import { fetchBooks } from './server/notion-books.mjs'

function notionApiPlugin(env: Record<string, string>): Plugin {
  Object.entries(env).forEach(([key, value]) => {
    if (!process.env[key]) process.env[key] = value
  })

  return {
    name: 'notion-api',
    configureServer(server) {
      server.middlewares.use('/api/books', async (_req, res) => {
        try {
          const books = await fetchBooks()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(books))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(err) }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), notionApiPlugin(env)],
  }
})
