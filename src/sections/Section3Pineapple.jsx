import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { IMAGES } from '../images'
import mouseState  from '../mouseState'
import './Section3Pineapple.css'

const FRUIT_CARDS = [
  { name: 'Ananas Victoria', img: IMAGES.ananas },
  { name: 'Pastèque',        img: IMAGES.pasteque },
  { name: 'Papaye',          img: IMAGES.papaye },
  { name: 'Melon',           img: IMAGES.melon },
  { name: 'Citron Vert',     img: IMAGES.citron },
]

const PARALLAX = [
  { cls: 's3__fruit-tl', src: IMAGES.melonCoupe,  blur: 9,  speed: 0.06 },
  { cls: 's3__fruit-tr', src: IMAGES.coco,         blur: 7,  speed: 0.05 },
  { cls: 's3__leaf-bl',  src: IMAGES.banane,       blur: 10, speed: 0.07 },
  { cls: 's3__leaf-br',  src: IMAGES.papayeArbre,  blur: 8,  speed: 0.055 },
]

export default function Section3Pineapple() {
  const sectionRef  = useRef(null)
  const eyebrowRef  = useRef(null)
  const titleRef    = useRef(null)
  const gridRef     = useRef(null)
  const ctaRef      = useRef(null)
  const layerRefs   = useRef([])
  const rafRef      = useRef(null)

  useEffect(() => {
    gsap.set([eyebrowRef.current, titleRef.current, gridRef.current, ctaRef.current], { y: 40, opacity: 0 })
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.timeline()
        .to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .to(titleRef.current,   { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.3')
        .to(gridRef.current,    { y: 0, opacity: 1, duration: 0.6,  ease: 'power3.out' }, '-=0.35')
        .to(ctaRef.current,     { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }, '-=0.25')
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
    <section id="section-pineapple" ref={sectionRef} className="snap-section s3">

      {PARALLAX.map((l, i) => (
        <div key={l.cls} ref={el => { layerRefs.current[i] = el }} className={`p-layer ${l.cls}`}>
          <img src={l.src} alt="" style={{ filter: `blur(${l.blur}px)` }} loading="lazy" draggable={false} />
        </div>
      ))}

      <span ref={eyebrowRef} className="s3__eyebrow">Gamme exotique</span>

      <h2 ref={titleRef} className="t-title s3__title">
        Fruits Exotiques
      </h2>

      <div ref={gridRef} className="s3__grid">
        {FRUIT_CARDS.map((f) => (
          <div key={f.name} className="s3__card">
            <img src={f.img} alt={f.name} loading="lazy" />
            <p className="s3__card-name">{f.name}</p>
          </div>
        ))}
      </div>

      <div ref={ctaRef} className="s3__cta">
        <a href="#section-corporate" className="btn-pill btn-pill--green">
          Voir toute la gamme →
        </a>
      </div>

    </section>
  )
}
