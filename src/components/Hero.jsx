import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

export default function Hero() {
  const sectionRef = useRef(null)
  const auraRef    = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const bottomRef  = useRef(null)
  const hintRef    = useRef(null)

  /* ── Aura souris — quickTo pour la fluidité max ──────── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const setAX = gsap.quickTo(auraRef.current, 'x', { duration: 1.0, ease: 'power3.out' })
    const setAY = gsap.quickTo(auraRef.current, 'y', { duration: 1.0, ease: 'power3.out' })

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 320
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 220
      setAX(x)
      setAY(y)
    }

    section.addEventListener('mousemove', onMove, { passive: true })
    return () => section.removeEventListener('mousemove', onMove)
  }, [])

  /* ── Split-text + animations scroll ──────────────────── */
  useEffect(() => {
    const section = sectionRef.current
    const left    = leftRef.current
    const right   = rightRef.current
    if (!section || !left || !right) return

    /* Enregistrer le yPercent initial dans GSAP pour que
       la translation X n'écrase pas l'alignement vertical
       (GSAP prend le contrôle du transform dès le premier tween). */
    gsap.set([left, right], { yPercent: -50 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end:   'bottom top',
        // scrub:0.3 — colle l'animation au doigt sans lag perceptible.
        // La valeur (en secondes) = temps de rattrappage maxi.
        scrub: 0.3,
      },
    })

    // ── Split-text : s'exécute dans les PREMIERS 12% du scroll ──
    // duration:0.12 sur une timeline totale de ~1s = 12% de la course.
    // L'utilisateur voit l'action dès le premier coup de molette.
    tl.to(left, {
      x: '-115vw',
      opacity: 0,
      ease: 'power3.out',
      duration: 0.12,
    }, 0)

    tl.to(right, {
      x: '115vw',
      opacity: 0,
      ease: 'power3.out',
      duration: 0.12,
    }, 0)

    // Sous-titres disparaissent légèrement après (15%)
    tl.to(bottomRef.current, {
      opacity: 0,
      y: -24,
      ease: 'power2.in',
      duration: 0.15,
    }, 0)

    tl.to(hintRef.current, {
      opacity: 0,
      ease: 'power2.in',
      duration: 0.10,
    }, 0)

    // Aura change de couleur sur toute la durée (étalon de la timeline)
    tl.to(auraRef.current, {
      background: 'radial-gradient(circle, rgba(249,115,22,0.30) 0%, rgba(251,191,36,0.12) 45%, transparent 70%)',
      ease: 'none',
      duration: 1.0,
    }, 0)

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars?.trigger === section) t.kill()
      })
    }
  }, [])

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="hero"
    >
      <div className="hero__sticky">

        {/* Aura lumineuse souris */}
        <div ref={auraRef} className="hero__aura" />

        {/* Feuilles décoratives */}
        <span className="hero__leaf hero__leaf--left"  aria-hidden>🌿</span>
        <span className="hero__leaf hero__leaf--right" aria-hidden>🌿</span>

        {/* Split-text */}
        <div ref={leftRef}  className="hero__word-left">TROPICAL</div>
        <div ref={rightRef} className="hero__word-right">ESSENCE</div>

        {/* Sous-titre + slogan */}
        <div ref={bottomRef} className="hero__bottom">
          <p className="hero__subtitle">Premium Tropical Exports — Sénégal</p>
          <p className="hero__slogan">Connecting Tropical Lands and Global Markets</p>
        </div>

        {/* Indicateur de scroll */}
        <div ref={hintRef} className="hero__scroll-hint">
          <span>Scroll</span>
          <div className="hero__scroll-hint-line" />
        </div>

      </div>
    </section>
  )
}
