import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.tsx'
import './i18n'
import { enableMapSet } from 'immer'
enableMapSet()

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={null}>
    <StrictMode>
      <App />
    </StrictMode>
  </Suspense>,
)
