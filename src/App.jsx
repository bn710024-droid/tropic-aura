import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

import Header   from './components/Header'
import Canvas3D from './components/Canvas3D'
import Hero     from './components/Hero'
import Tech     from './components/Tech'
import Human    from './components/Human'
import Closing  from './components/Closing'
import Footer   from './components/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const cursorRef  = useRef(null)
  const ringRef    = useRef(null)
  const lenisRef   = useRef(null)

  /* ── Lenis + GSAP ticker sync ─────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    })
    lenisRef.current = lenis

    // Connect Lenis to GSAP ticker — évite tout tremblement ScrollTrigger
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // Inform ScrollTrigger of scroll position via Lenis events
    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf)
    }
  }, [])

  /* ── Custom cursor ────────────────────────────────────── */
  useEffect(() => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return

    // quickTo pour la fluidité maximale
    const setCX = gsap.quickTo(cursor, 'x', { duration: 0.08, ease: 'none' })
    const setCY = gsap.quickTo(cursor, 'y', { duration: 0.08, ease: 'none' })
    const setRX = gsap.quickTo(ring,   'x', { duration: 0.18, ease: 'power2.out' })
    const setRY = gsap.quickTo(ring,   'y', { duration: 0.18, ease: 'power2.out' })

    const onMove = (e) => {
      setCX(e.clientX)
      setCY(e.clientY)
      setRX(e.clientX)
      setRY(e.clientY)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* Custom cursor */}
      <div className="ta-cursor"      ref={cursorRef} />
      <div className="ta-cursor-ring" ref={ringRef}   />

      {/* Navigation fixe */}
      <Header />

      {/* Canvas Three.js global — fixed derrière tout le contenu */}
      <Canvas3D />

      {/* Contenu HTML scrollable — z-index supérieur au canvas */}
      <div className="ta-scroll-container">
        <Hero    />
        <Tech    />
        <Human   />
        <Closing />
        <Footer  />
      </div>
    </>
  )
}
