import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { enableMapSet } from 'immer'

import App from './app/App.tsx'
import { queryClient } from './lib/queryClient.ts'
import './i18n'
import './index.css'

enableMapSet()

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={null}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  </Suspense>,
)
