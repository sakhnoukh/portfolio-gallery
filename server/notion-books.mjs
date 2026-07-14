import { Client } from '@notionhq/client'

let _client = null

function getClient() {
  if (!_client) {
    _client = new Client({ auth: process.env.NOTION_API })
  }
  return _client
}

export async function fetchBooks() {
  const databaseId = process.env.NOTION_DB
  if (!databaseId) throw new Error('NOTION_DB is not set')

  const notion = getClient()

  let allResults = []
  let cursor = undefined
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        or: [
          {
            property: 'Exclusive Shelf',
            select: { equals: 'read' },
          },
          {
            property: 'Exclusive Shelf',
            select: { equals: 'to-read' },
          },
        ],
      },
      page_size: 100,
      start_cursor: cursor,
    })
    allResults = allResults.concat(response.results)
    cursor = response.has_more ? response.next_cursor : undefined
  } while (cursor)

  return allResults.map((page) => {
    const props = page.properties

    const titleProp = props['Book Title'] ?? props['Title'] ?? props['Name']
    const title =
      titleProp?.type === 'title'
        ? titleProp.title.map((t) => t.plain_text).join('')
        : ''

    const authorProp = props['Author']
    const author =
      authorProp?.type === 'rich_text'
        ? authorProp.rich_text.map((t) => t.plain_text).join('')
        : ''

    const shelfProp = props['Exclusive Shelf']
    const shelf =
      shelfProp?.type === 'select' ? shelfProp.select?.name ?? '' : ''

    const genreProp = props['Genre']
    const genre =
      genreProp?.type === 'select' ? genreProp.select?.name ?? '' : ''

    return { title, author, shelf, genre }
  })
}
