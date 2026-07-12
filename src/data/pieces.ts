export type FrameVariant = 'modern' | 'classic' | 'canvas'

export type ArtKind = 'poster' | 'book' | 'photo' | 'timeline'

export interface TimelineEntry {
  year: string
  role: string
  place: string
}

export interface Piece {
  id: string
  title: string
  year: string
  medium: string
  description: string
  variant: FrameVariant
  kind: ArtKind
  accent: string
  subtitle?: string
  timeline?: TimelineEntry[]
}

export const pieces: Piece[] = [
  {
    id: 'project-aurora',
    title: 'Aurora',
    year: '2025',
    medium: 'React · TypeScript · WebGL',
    description:
      'A real-time data visualisation platform rendered as living light. Placeholder piece — swap with your flagship project.',
    variant: 'modern',
    kind: 'poster',
    accent: '#1d3557',
    subtitle: 'No. 01',
  },
  {
    id: 'project-ledger',
    title: 'Ledger',
    year: '2024',
    medium: 'Node.js · PostgreSQL · Docker',
    description:
      'A minimalist finance tracker built for clarity over clutter. Placeholder piece — swap with a backend-heavy project.',
    variant: 'modern',
    kind: 'poster',
    accent: '#6b2737',
    subtitle: 'No. 02',
  },
  {
    id: 'project-atlas',
    title: 'Atlas',
    year: '2024',
    medium: 'Swift · MapKit · CoreML',
    description:
      'An offline-first hiking companion for iOS. Placeholder piece — swap with a mobile project.',
    variant: 'modern',
    kind: 'poster',
    accent: '#2d4a3e',
    subtitle: 'No. 03',
  },
  {
    id: 'reading',
    title: 'The Reading Room',
    year: 'Ongoing',
    medium: 'Paper · Ink · Patience',
    description:
      'A rotating shelf of what I am reading now. Placeholder cover — swap with a real book jacket.',
    variant: 'classic',
    kind: 'book',
    accent: '#8c5a2b',
    subtitle: 'Currently reading',
  },
  {
    id: 'photography',
    title: 'Street Light Studies',
    year: '2023–',
    medium: 'Photography · 35mm',
    description:
      'Weekend studies of the city after dark. Placeholder illustration — swap with a favourite photograph.',
    variant: 'classic',
    kind: 'photo',
    accent: '#3a3a52',
    subtitle: 'Series of 12',
  },
  {
    id: 'experience',
    title: 'A Working History',
    year: '2019–2026',
    medium: 'Curriculum Vitae',
    description:
      'Seven years across product teams, told as a single vertical line. Placeholder timeline — swap with your real history.',
    variant: 'canvas',
    kind: 'timeline',
    accent: '#22223b',
    timeline: [
      { year: '2024', role: 'Senior Engineer', place: 'Placeholder Co.' },
      { year: '2022', role: 'Software Engineer', place: 'Example Labs' },
      { year: '2020', role: 'Junior Developer', place: 'Startup Studio' },
      { year: '2019', role: 'B.Sc. Computer Science', place: 'University' },
    ],
  },
  {
    id: 'contact',
    title: 'The Guest Book',
    year: '2026',
    medium: 'Email · GitHub · LinkedIn',
    description:
      'Every gallery ends at the guest book. Say hello — links live on the placard.',
    variant: 'canvas',
    kind: 'poster',
    accent: '#4a4e69',
    subtitle: 'Fin.',
  },
]
