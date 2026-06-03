import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { IMAGES } from '../images'
import mouseState  from '../mouseState'
import './Section2Avocado.css'

const PARALLAX = [
  { cls: 's2__leaf-tl',    src: IMAGES.mangoArbreKeitt, blur: 8,  speed: 0.05  },
  { cls: 's2__avocado-br', src: IMAGES.avocat,          blur: 9,  speed: 0.065 },
  { cls: 's2__leaf-mr',    src: IMAGES.papayeArbre,     blur: 7,  speed: 0.045 },
]

export default function Section2Avocado() {
  const sectionRef = useRef(null)
  const imgColRef  = useRef(null)
  const titleRef   = useRef(null)
  const textRef    = useRef(null)
  const ctaRef     = useRef(null)
  const layerRefs  = useRef([])
  const rafRef     = useRef(null)

  useEffect(() => {
    const els = [imgColRef.current, titleRef.current, textRef.current, ctaRef.current]
    gsap.set(els, { y: 40, opacity: 0 })

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.timeline()
        .to(imgColRef.current, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' })
        .to(titleRef.current,  { y: 0, opacity: 1, duration: 0.6,  ease: 'power3.out' }, '-=0.4')
        .to(textRef.current,   { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.35')
        .to(ctaRef.current,    { y: 0, opacity: 1, duration: 0.5,  ease: 'power3.out' }, '-=0.3')
      observer.disconnect()
    }, { threshold: 0.35 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const layers = layerRefs.current.filter(Boolean)
    const targets = layers.map((el, i) => ({ el, speed: PARALLAX[i]?.speed ?? 0.05, cx: 0, cy: 0 }))
    const loop = () => {
      targets.forEach(({ el, speed }, i) => {
        const tx = mouseState.nx * speed * 80
        const ty = mouseState.ny * speed * 60
        targets[i].cx += (tx - targets[i].cx) * 0.06
        targets[i].cy += (ty - targets[i].cy) * 0.06
        el.style.transform = `translate(${targets[i].cx}px,${targets[i].cy}px)`
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <section id="section-avocado" ref={sectionRef} className="snap-section s2">

      {PARALLAX.map((l, i) => (
        <div key={l.cls} ref={el => { layerRefs.current[i] = el }} className={`p-layer ${l.cls}`}>
          <img src={l.src} alt="" style={{ filter: `blur(${l.blur}px)` }} loading="lazy" draggable={false} />
        </div>
      ))}

      {/* Image principale */}
      <div ref={imgColRef} className="s2__image-col">
        <img src={IMAGES.avocat} alt="Avocats Hass" loading="lazy" />
      </div>

      {/* Contenu */}
      <div className="s2__right">
        <span className="s2__tag">Légumes &amp; Fruits premium</span>
        <h2 ref={titleRef} className="t-title s2__title">
          Légumes<br />sous serre
        </h2>
        <p ref={textRef} className="s2__text">
          Avocats Hass cueillis à maturité optimale, haricots verts Extra Fine,
          piments capsicum — un sourcing direct depuis nos producteurs partenaires
          certifiés Global G.A.P.
        </p>
        <div ref={ctaRef} className="s2__cta">
          <a href="#section-pineapple" className="btn-pill btn-pill--dark">Découvrir →</a>
        </div>
      </div>

    </section>
  )
}
