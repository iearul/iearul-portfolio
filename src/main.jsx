import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Self-hosted fonts (bundled into /assets), so the site makes no requests to Google Fonts.
import '@fontsource-variable/fredoka'
import '@fontsource-variable/inter'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
