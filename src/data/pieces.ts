import nexusCover from '../../Covers/Nexus.png'
import madridCover from '../../Covers/madrid-guide.jpeg'
import taxiCover from '../../Covers/Taxi.jpeg'
//import currentBookCover from '../../Covers/book.png'
//import cookingCover from '../../Covers/cooking.jpeg'


export type FrameVariant = 'modern' | 'classic' | 'canvas'

export type RoomId = 'projects' | 'experience' | 'personal'

export interface Room {
  id: RoomId
  label: string
  wall: string
  floorStart: string
  floorEnd: string
  crease: string
}

export const rooms: Room[] = [
  { id: 'projects', label: 'Projects', wall: '#ffffff', floorStart: '#d8d8d8', floorEnd: '#999999', crease: '#b0b0b0' },
  { id: 'experience', label: 'Professional Experience', wall: '#1e3a2f', floorStart: '#3a5a4a', floorEnd: '#1a2e24', crease: '#0e1a14' },
  { id: 'personal', label: 'Personal Interests', wall: '#0F1722', floorStart: '#1a2738', floorEnd: '#080d16', crease: '#050a12' },
]

export type ArtKind = 'poster' | 'book' | 'photo' | 'timeline'

export type CaseStudyBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'image'; src: string; alt?: string; caption?: string }
  | { type: 'list'; items: string[] }
  | { type: 'links'; items: { label: string; href: string }[] }

export interface TimelineEntry {
  year: string
  role: string
  place: string
  description?: string
}

export interface Piece {
  id: string
  title: string
  year: string
  medium: string
  description: string
  variant: FrameVariant
  kind: ArtKind
  room: RoomId
  accent: string
  subtitle?: string
  timeline?: TimelineEntry[]
  cover?: string
  frameRatio?: string
  caseStudy?: CaseStudyBlock[]
  url?: string
}

export const pieces: Piece[] = [
  {
    id: 'project-nexus',
    title: 'Nexus',
    year: '2026',
    medium: 'Qwen VLM · ChromaDB · RAG',
    description:
      'A multimodal RAG project, with a custom assisted learning function for easy PDF comprehension. My personal NotebookLM',
    url: 'https://github.com/sakhnoukh/Nexus',
    variant: 'modern',
    kind: 'poster',
    room: 'projects',
    accent: '#1d3557',
    subtitle: 'No. 01',
    cover: nexusCover,
  },
  {
    id: 'project-madrid',
    title: 'Madrid Guide',
    year: '2026',
    medium: 'Next.js · REST API · Telegram Bot',
    description:
      'A personal website for saving, reviewing and sharing my favourite places in Madrid.',
    url: 'https://madrid-guide.vercel.app/',
    variant: 'modern',
    kind: 'poster',
    room: 'projects',
    accent: '#6b2737',
    subtitle: 'No. 02',
    cover: madridCover,
    frameRatio: '4 / 3',
    caseStudy: [
      {type: 'subheading', text: 'Project Overview'},
      {type: 'paragraph', text: 'This website stemmed from my struggle with my google maps becoming too cluttered with the amount of pins I had of places in Madrid, where I currently study. '},

    ]
  },
  {
    id: 'nyc-taxis',
    title: 'NYC Taxis',
    year: '2026',
    medium: 'MLFlow · Qwen · Google Maps · RAG',
    description:
      'Allows user to select a trip and receive the fastest route, estimated cost and allow preference based trip selection.',
    url: 'https://github.com/sakhnoukh/Im-waulkin-hereeeee',
    variant: 'modern',
    kind: 'poster',
    room: 'projects',
    accent: '#93a600',
    subtitle: 'No. 03',
    cover: taxiCover,
  },
  {
    id: 'reading',
    title: 'The Reading Room',
    year: 'Ongoing',
    medium: 'Paper · Ink · Patience',
    description:
      'A rotating shelf of what I am reading now. Totally not being performative.',
    variant: 'classic',
    kind: 'book',
    room: 'personal',
    accent: '#8c5a2b',
    subtitle: '',
    //cover: currentBookCover,
  },
  {
    id: 'cooking',
    title: 'Cooking & Baking',
    year: 'Ongoing',
    medium: 'Salt, Fat, Acid, Heat & Sugar',
    description:
      'One of my favourite pastimes for a while now`.',
    variant: 'classic',
    kind: 'photo',
    room: 'personal',
    accent: '#3a3a52',
    subtitle: 'Series of 12',
    // cover: cookingCover,
  },
  {
    id: 'experience',
    title: 'A Working History',
    year: '2023–2026',
    medium: 'Curriculum Vitae',
    description:
      '.',
    variant: 'canvas',
    kind: 'timeline',
    room: 'experience',
    accent: '#22223b',
    timeline: [
      { year: '2023-2027', role: 'B.Sc. Computer Science & AI', place: 'IE University', description: 'Pursuing a degree in Computer Science and Artificial Intelligence at IE University in Madrid. Coursework spans algorithms, machine learning, NLP, and software engineering, with hands-on projects in multimodal RAG systems and full-stack development.' },
      { year: '2024', role: 'Cybersecurity Intern', place: 'MNT Halan', description: 'Worked on securing fintech infrastructure at MNT Halan, Egypt\'s leading super-app. Focused on vulnerability assessment, threat modeling, and implementing security best practices across microservices.' },
      { year: '2025', role: 'Software Engineer', place: 'Freelance', description: 'Built and deployed web applications for international clients, specializing in Next.js frontends and Python backends. Projects ranged from e-commerce platforms to data visualization dashboards.' },
      { year: '2025-2026', role: 'Blockchain Developer', place: 'Help.Fun', description: 'Developed smart contracts and decentralized applications on Solana. Worked on DeFi protocols, NFT marketplaces, and on-chain data indexing using Rust and TypeScript.' },
      { year: '2026', role: 'R&D Intern', place: 'Orascom Construction', description: 'Research and development internship exploring applications of AI and automation in large-scale construction. Investigating computer vision for site monitoring and predictive analytics for project management.' },
    ],
  },
  {
    id: 'contact',
    title: 'The Guest Book',
    year: '2026',
    medium: 'Email · GitHub · LinkedIn',
    description:
      'Every gallery ends at the guest book. Say hello, links are live.',
    variant: 'canvas',
    kind: 'poster',
    room: 'personal',
    accent: '#4a4e69',
    caseStudy: [
      {type: 'subheading', text: 'My Contacts'},
      {type: 'paragraph', text: 'Feel free to reach out to me at any of the following:'},
      {type: 'links', items: [
        { label: 'Email: sami.akhnoukh@gmail.com', href: 'mailto:sami.akhnoukh@gmail.com' },
        { label: 'GitHub: sakhnoukh', href: 'https://github.com/sakhnoukh' },
        { label: 'LinkedIn: sami-akhnoukh', href: 'https://www.linkedin.com/in/sami-akhnoukh-8ba276293' },
        { label: 'WhatsApp: +20 127 555 0888', href: 'https://wa.me/201275550888' },
        { label: 'Instagram: sami.akhnoukh', href: 'https://instagram.com/sami.akhnoukh' },
      ]},
    ],
    subtitle: 'Fin.',
  },
]
