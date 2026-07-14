import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.scss'
import './styles/gallery.scss'
import './styles/frame.scss'
import './styles/placard.scss'
import './styles/inspect.scss'
import './styles/gallery-nav.scss'
import './styles/cv-view.scss'
import './styles/bookshelf.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
