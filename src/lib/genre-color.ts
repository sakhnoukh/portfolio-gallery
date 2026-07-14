interface GenreColor {
  bg: string
  text: string
}

const lightText = '#f5f5f5'
const darkText = '#1A1A1A'

const GENRE_MAP: Record<string, GenreColor> = {
  // Fantasy — green family (darkest → lightest)
  'Fantasy':                       { bg: '#1B4332', text: lightText },
  'YA Fantasy':                    { bg: '#2D6A4F', text: lightText },
  'Mythological Fantasy':          { bg: '#40916C', text: lightText },
  'YA Fantasy / Mythology':        { bg: '#52B788', text: darkText },
  "Children's Fantasy":            { bg: '#74C69D', text: darkText },
  'Magical Realism':               { bg: '#95D5B2', text: darkText },

  // Sci-Fi — blue family (darkest → lightest)
  'Sci-Fi':                        { bg: '#0B2545', text: lightText },
  'Sci-Fi / Classic':              { bg: '#13315C', text: lightText },
  'Literary Fiction / Sci-Fi':     { bg: '#1B3B6F', text: lightText },
  'Post-Apocalyptic / Sci-Fi':     { bg: '#274C77', text: lightText },
  'Dystopian / Sci-Fi':            { bg: '#3C6997', text: lightText },
  'Sci-Fi / Romance':              { bg: '#5B8FB9', text: lightText },

  // Thriller / Mystery — red family (darkest → lightest)
  'Thriller':                      { bg: '#6A040F', text: lightText },
  'YA Spy Thriller':               { bg: '#9D0208', text: lightText },
  'Mystery / Thriller':            { bg: '#D00000', text: lightText },
  'Historical Mystery':            { bg: '#DC2F02', text: lightText },
  'Horror':                        { bg: '#E85D04', text: darkText },

  // Dystopian — dark red/brown family
  'Dystopian':                     { bg: '#3C1518', text: lightText },
  'YA Dystopian':                  { bg: '#5C2A2E', text: lightText },
  'Dystopian / Classic':           { bg: '#7A3E3E', text: lightText },

  // Historical / Classic — warm brown family
  'Historical Fiction':            { bg: '#582F0E', text: lightText },
  'Historical Fiction / Classic':  { bg: '#7F4F24', text: lightText },
  'Classic / Adventure':           { bg: '#A36420', text: lightText },

  // Philosophy / Literary — cream family
  'Fiction':                       { bg: '#E2DCC8', text: darkText },
  'Philosophical Fiction':         { bg: '#D4CDB5', text: darkText },
  'Fiction / Philosophical':       { bg: '#C6BEA2', text: darkText },

  // Non-fiction — terracotta family
  'Non-fiction / Culinary':        { bg: '#8A3324', text: lightText },
  'Non-fiction':                   { bg: '#A0442E', text: lightText },
}

const DEFAULT_COLOR: GenreColor = { bg: '#1A1A1A', text: lightText }

export function genreToColor(genre: string): GenreColor {
  return GENRE_MAP[genre] ?? DEFAULT_COLOR
}
