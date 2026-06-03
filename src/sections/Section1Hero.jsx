import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Canvas3D   from '../canvas/Canvas3D'
import { IMAGES } from '../images'
import mouseState  from '../mouseState'
import './Section1Hero.css'

/* Couches parallaxe de la section 1 */
const PARALLAX = [
  { cls: 's1__leaf-bl',  src: IMAGES.mangoVerger, blur: 8,  speed: 0.055, alt: 'feuilles' },
  { cls: 's1__leaf-tr',  src: IMAGES.banane,      blur: 10, speed: 0.07,  alt: 'bananier' },
  { cls: 's1__fruit-tl', src: IMAGES.mangoCoupe,  blur: 6,  speed: 0.04,  alt: 'mangue' },
  { cls: 's1__fruit-br', src: IMAGES.citron,      blur: 9,  speed: 0.065, alt: 'citron' },
  { cls: 's1__fruit-ml', src: IMAGES.ananas,      blur: 12, speed: 0.08,  alt: 'ananas' },
]

export default function Section1Hero() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const subRef     = useRef(null)
  const actionsRef = useRef(null)
  const layerRefs  = useRef([])
  const rafRef     = useRef(null)

  /* ── GSAP entry animation (IntersectionObserver) ──────── */
  useEffect(() => {
    const section = sectionRef.current
    gsap.set([titleRef.current, subRef.current, actionsRef.current], {
      y: 36, opacity: 0,
    })

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.timeline()
        .to(titleRef.current,   { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
        .to(subRef.current,     { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.45')
        .to(actionsRef.current, { y: 0, opacity: 1, duration: 0.5,  ease: 'power3.out' }, '-=0.35')
      observer.disconnect()
    }, { threshold: 0.4 })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  /* ── Parallaxe souris — rAF loop ──────────────────────── */
  useEffect(() => {
    const layers = layerRefs.current.filter(Boolean)
    const targets = layers.map((el, i) => ({
      el,
      speed: PARALLAX[i]?.speed ?? 0.05,
      cx: 0, cy: 0,
    }))

    const loop = () => {
      targets.forEach(({ el, speed, cx, cy }, i) => {
        const tx = mouseState.nx * speed * 80
        const ty = mouseState.ny * speed * 60
        targets[i].cx += (tx - targets[i].cx) * 0.06
        targets[i].cy += (ty - targets[i].cy) * 0.06
        // On déplace le wrapper sans écraser l'animation CSS float
        el.style.transform = `translate(${targets[i].cx}px, ${targets[i].cy}px)`
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section id="section-hero" ref={sectionRef} className="snap-section s1">

      {/* ── Couches parallaxe déco ────────────────────── */}
      {PARALLAX.map((layer, i) => (
        <div
          key={layer.cls}
          ref={el => { layerRefs.current[i] = el }}
          className={`p-layer ${layer.cls}`}
        >
          {/* L'image flotte via CSS keyframe, le wrapper via rAF */}
          <img
            src={layer.src}
            alt={layer.alt}
            style={{ filter: `blur(${layer.blur}px)` }}
            loading="lazy"
            draggable={false}
          />
        </div>
      ))}

      {/* ── Colonne gauche — contenu ──────────────────── */}
      <div className="s1__left">
        <span className="s1__eyebrow">Export B2B Premium</span>

        <h1 ref={titleRef} className="t-title s1__title">
          Creating<br />Refreshing Ways<br />Together
        </h1>

        <p ref={subRef} className="s1__subtitle">
          Tropic-Aura B.C. connecte les vergers du Sénégal aux marchés
          européens. Mangues Kent & Keitt, avocats Hass, ananas Victoria —
          FOB depuis le Port de Dakar.
        </p>

        <div ref={actionsRef} className="s1__actions">
          <a href="#section-avocado" className="btn-pill btn-pill--green">
            Découvrir →
          </a>
          <span className="s1__scroll-hint">Scroll</span>
        </div>
      </div>

      {/* ── Colonne droite — Mangue 3D ────────────────── */}
      <div className="s1__right">
        <div className="s1__canvas-wrap">
          <Canvas3D />
        </div>
      </div>

    </section>
  )
}
