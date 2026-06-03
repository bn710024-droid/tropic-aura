import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Tech.css'

const CARDS = [
  {
    num: '01',
    icon: '🌱',
    title: 'Origine Certifiée',
    text: 'Sélectionnée à la main dans les vergers du Sénégal. Chaque lot est tracé de la parcelle à l\'emballage.',
    badge: 'Global G.A.P.',
  },
  {
    num: '02',
    icon: '⛓️',
    title: 'Chaîne Maîtrisée',
    text: 'De la récolte à la livraison — une chaîne du froid contrôlée de bout en bout, FOB depuis le Port de Dakar.',
    badge: 'ISO 22000',
  },
  {
    num: '03',
    icon: '♻️',
    title: 'Zéro Compromis',
    text: 'Agriculture éco-responsable, empreinte carbone optimisée, emballages recyclables. L\'excellence sans transaction.',
    badge: 'Éco-responsable',
  },
]

export default function Tech() {
  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const cardRefs   = useRef([])

  useEffect(() => {
    const section = sectionRef.current
    const cards   = cardRefs.current
    if (!section || cards.some((c) => !c)) return

    // Initialise les cartes hors écran à droite, invisibles
    gsap.set(cards, { x: 120, opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',  // démarre dès que la section entre dans le viewport
        end:   'top 20%',  // finit rapidement — fenêtre de 60% de viewport
        scrub: 0.3,        // rattrappage ultra-rapide, animation au doigt
      },
    })

    // ── Cartes : fade-in + slide rapide en stagger serré ──
    // Les 3 cartes aparaissent en cascade immédiate dès l'entrée de section.
    // stagger réduit à 0.055 (vs 0.12) = les cartes sautent aux yeux B2B.
    cards.forEach((card, i) => {
      tl.to(card, {
        x: 0,
        opacity: 1,
        ease: 'power3.out',
        duration: 0.4,
      }, i * 0.055)
    })

    return () => ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger === section) t.kill()
    })
  }, [])

  return (
    <section
      id="tech-section"
      ref={sectionRef}
      className="tech"
    >
      <div ref={stickyRef} className="tech__sticky">

        {/* Label watermark */}
        <div className="tech__label" aria-hidden>
          QUALITÉ
        </div>

        {/* Bento grid */}
        <div className="tech__bento">
          {CARDS.map((card, i) => (
            <div
              key={card.num}
              className="tech__card"
              ref={(el) => { cardRefs.current[i] = el }}
            >
              <span className="tech__card-num" aria-hidden>{card.num}</span>
              <span className="tech__card-icon">{card.icon}</span>
              <h3 className="tech__card-title">{card.title}</h3>
              <p  className="tech__card-text">{card.text}</p>
              <span className="tech__card-badge">{card.badge}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
