import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

export default function Hero() {
  const sectionRef  = useRef(null)
  const stickyRef   = useRef(null)
  const auraRef     = useRef(null)
  const leftRef     = useRef(null)
  const rightRef    = useRef(null)
  const bottomRef   = useRef(null)
  const hintRef     = useRef(null)

  /* ── Aura souris — quickTo pour la fluidité max ─────── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const setAX = gsap.quickTo(auraRef.current, 'x', { duration: 1.0, ease: 'power3.out' })
    const setAY = gsap.quickTo(auraRef.current, 'y', { duration: 1.0, ease: 'power3.out' })
    let auraColor = 0

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 300
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 200
      setAX(x)
      setAY(y)

      // Oscillation couleur aura entre vert et orange
      auraColor = (auraColor + 0.01) % 1
    }

    section.addEventListener('mousemove', onMove, { passive: true })
    return () => section.removeEventListener('mousemove', onMove)
  }, [])

  /* ── ScrollTrigger — split des mots au scroll ─────── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end:   'bottom top',
        scrub: 1.2,
        pin: stickyRef.current,
        anticipatePin: 1,
      },
    })

    // Mots s'écartent vers l'extérieur
    tl.to(leftRef.current,  {
      x: '-110vw',
      opacity: 0,
      ease: 'power2.in',
    }, 0)
    tl.to(rightRef.current, {
      x: '110vw',
      opacity: 0,
      ease: 'power2.in',
    }, 0)

    // Bottom text disparaît
    tl.to(bottomRef.current, {
      opacity: 0,
      y: -30,
      ease: 'power1.in',
    }, 0)

    tl.to(hintRef.current, {
      opacity: 0,
      ease: 'power1.in',
    }, 0)

    // Aura change de couleur vers orange
    tl.to(auraRef.current, {
      background: 'radial-gradient(circle, rgba(249,115,22,0.28) 0%, rgba(251,191,36,0.12) 45%, transparent 70%)',
      ease: 'none',
    }, 0)

    return () => ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger === section) t.kill()
    })
  }, [])

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="hero"
    >
      <div ref={stickyRef} className="hero__sticky">

        {/* Aura lumineuse */}
        <div ref={auraRef} className="hero__aura" />

        {/* Feuilles décoratives */}
        <span className="hero__leaf hero__leaf--left"  aria-hidden>🌿</span>
        <span className="hero__leaf hero__leaf--right" aria-hidden>🌿</span>

        {/* Mots du titre */}
        <div ref={leftRef}  className="hero__word-left">TROPICAL</div>
        <div ref={rightRef} className="hero__word-right">ESSENCE</div>

        {/* Textes bas */}
        <div ref={bottomRef} className="hero__bottom">
          <p className="hero__subtitle">Premium Tropical Exports — Sénégal</p>
          <p className="hero__slogan">Connecting Tropical Lands and Global Markets</p>
        </div>

        {/* Scroll indicator */}
        <div ref={hintRef} className="hero__scroll-hint">
          <span>Scroll</span>
          <div className="hero__scroll-hint-line" />
        </div>

      </div>
    </section>
  )
}
