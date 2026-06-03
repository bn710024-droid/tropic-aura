import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { IMAGES } from '../images'
import './Section4Corporate.css'

const STATS = [
  { num: '28+', label: 'Variétés exportées' },
  { num: '4',   label: 'Marchés européens' },
  { num: 'FOB', label: 'Port de Dakar' },
  { num: 'B2B', label: 'Supply chain directe' },
]

export default function Section4Corporate() {
  const sectionRef = useRef(null)
  const tagRef     = useRef(null)
  const titleRef   = useRef(null)
  const textRef    = useRef(null)
  const statsRef   = useRef(null)
  const ctaRef     = useRef(null)

  useEffect(() => {
    gsap.set([tagRef.current, titleRef.current, textRef.current, statsRef.current, ctaRef.current],
      { y: 36, opacity: 0 })

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.timeline()
        .to(tagRef.current,   { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' })
        .to(titleRef.current, { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.3')
        .to(textRef.current,  { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.35')
        .to(statsRef.current, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, '-=0.3')
        .to(ctaRef.current,   { y: 0, opacity: 1, duration: 0.5,  ease: 'power3.out' }, '-=0.25')
      observer.disconnect()
    }, { threshold: 0.3 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="section-corporate" ref={sectionRef} className="snap-section s4">

      {/* Gauche — image humaine / terroir */}
      <div className="s4__left">
        <img src={IMAGES.mainTerroir} alt="Agriculteur Sénégal" loading="lazy" />
        <span className="s4__left-badge">Sénégal, Afrique de l&apos;Ouest</span>
      </div>

      {/* Droite — texte corporate */}
      <div className="s4__right">
        <span ref={tagRef} className="s4__tag">À propos de Tropic-Aura</span>

        <h2 ref={titleRef} className="t-title s4__title">
          B2B Supply<br />Chain Excellence
        </h2>

        <p ref={textRef} className="s4__text">
          Fondée par Babacar Niang, Tropic-Aura B.C. est la passerelle directe
          entre les vergers certifiés d&apos;Afrique de l&apos;Ouest et les centrales
          d&apos;achat européennes. Pays-Bas, Belgique, France, Allemagne.
        </p>

        <div ref={statsRef} className="s4__stats">
          {STATS.map((s) => (
            <div key={s.num} className="s4__stat">
              <div className="s4__stat-num">{s.num}</div>
              <div className="s4__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div ref={ctaRef} className="s4__cta">
          <a href="#section-footer" className="btn-pill btn-pill--dark">
            Lire la suite →
          </a>
        </div>
      </div>

    </section>
  )
}
