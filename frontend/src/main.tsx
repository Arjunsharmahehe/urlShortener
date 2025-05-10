import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AlertProvider } from './context/alertContext.tsx'
import { UrlProvider } from './context/urlContext.tsx'

createRoot(document.getElementById('root')!).render(
  <AlertProvider>
    <UrlProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </UrlProvider>
  </AlertProvider>,
)
