import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import mouseState from './mouseState'

import Header        from './components/Header'
import Section1Hero  from './sections/Section1Hero'
import Section2Avocado   from './sections/Section2Avocado'
import Section3Pineapple from './sections/Section3Pineapple'
import Section4Corporate from './sections/Section4Corporate'
import Section5Footer    from './sections/Section5Footer'

export default function App() {
  const cursorRef = useRef(null)
  const ringRef   = useRef(null)

  /* ── Curseur custom ──────────────────────────────────── */
  useEffect(() => {
    const cursor = cursorRef.current
    const ring   = ringRef.current
    if (!cursor || !ring) return
    const setCX = gsap.quickTo(cursor, 'x', { duration: 0.06, ease: 'none' })
    const setCY = gsap.quickTo(cursor, 'y', { duration: 0.06, ease: 'none' })
    const setRX = gsap.quickTo(ring,   'x', { duration: 0.16, ease: 'power2.out' })
    const setRY = gsap.quickTo(ring,   'y', { duration: 0.16, ease: 'power2.out' })
    const onMove = (e) => {
      setCX(e.clientX); setCY(e.clientY)
      setRX(e.clientX); setRY(e.clientY)
      // Met à jour mouseState (lu par les layers parallaxe)
      mouseState.x  = e.clientX
      mouseState.y  = e.clientY
      mouseState.nx = (e.clientX / window.innerWidth  - 0.5) * 2
      mouseState.ny = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div className="ta-cursor"      ref={cursorRef} />
      <div className="ta-cursor-ring" ref={ringRef}   />

      {/* Header fixed au-dessus du scroll container */}
      <Header />

      {/* Scroll snap container — l'unique zone scrollable */}
      <div className="snap-root" id="snap-root">
        <Section1Hero    />
        <Section2Avocado />
        <Section3Pineapple />
        <Section4Corporate />
        <Section5Footer    />
      </div>
    </>
  )
}
