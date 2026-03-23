import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import './index.css'
import App from './App.jsx'

const storedTheme = window.localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const shouldUseDark = storedTheme ? storedTheme === 'dark' : prefersDark

document.documentElement.classList.toggle('dark', shouldUseDark)

function Root() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.1,
      lerp: 0.085,
      anchors: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    })

    window.__contextosLenis = lenis

    let frameId = 0
    const raf = (time) => {
      lenis.raf(time)
      frameId = window.requestAnimationFrame(raf)
    }

    frameId = window.requestAnimationFrame(raf)

    return () => {
      window.cancelAnimationFrame(frameId)
      lenis.destroy()
      delete window.__contextosLenis
    }
  }, [])

  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
