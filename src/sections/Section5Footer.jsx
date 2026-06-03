import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './Section5Footer.css'

const CARDS = [
  { icon: '🌱', title: 'Culture',    text: 'Vergers certifiés Global G.A.P. Traçabilité parcelle à parcelle.' },
  { icon: '🚢', title: 'Logistique', text: 'Export FOB / FAS. Conteneurs réfrigérés. Port Autonome de Dakar.' },
  { icon: '✅', title: 'Qualité',    text: 'ISO 22000. Analyses phytosanitaires. Zéro résidu garantie.' },
  { icon: '📦', title: 'Emballage',  text: 'Cartons recyclables. Branding personnalisé pour vos marchés.' },
]

export default function Section5Footer() {
  const sectionRef = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    gsap.set(gridRef.current, { y: 30, opacity: 0 })
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      gsap.to(gridRef.current, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' })
      observer.disconnect()
    }, { threshold: 0.25 })
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSubmit = (e) => { e.preventDefault() }

  return (
    <section id="section-footer" ref={sectionRef} className="snap-section--footer s5">

      {/* Grille 4 cards */}
      <div ref={gridRef} className="s5__grid">
        {CARDS.map((c) => (
          <div key={c.title} className="s5__card">
            <span className="s5__card-icon">{c.icon}</span>
            <h3 className="s5__card-title">{c.title}</h3>
            <p className="s5__card-text">{c.text}</p>
          </div>
        ))}
      </div>

      {/* Bas footer */}
      <div className="s5__bottom">

        {/* Logo + infos */}
        <div className="s5__logo-block">
          <div className="s5__big-logo">TROPIC-AURA</div>
          <p className="s5__tagline">Connecting Tropical Lands and Global Markets</p>
          <div className="s5__badges">
            {['FOB Dakar','FAS Dakar','Export B2B','Pays-Bas','Belgique','France','Allemagne'].map(b => (
              <span key={b} className="s5__badge">{b}</span>
            ))}
          </div>
        </div>

        {/* Formulaire B2B */}
        <form className="s5__form" onSubmit={handleSubmit}>
          <h3 className="s5__form-title">Initier un partenariat</h3>
          <div className="s5__field">
            <input type="text"  placeholder="Nom &amp; Entreprise"    required />
          </div>
          <div className="s5__field">
            <input type="email" placeholder="Email professionnel"     required />
          </div>
          <div className="s5__field">
            <textarea placeholder="Volume, produits, Incoterm…"       required />
          </div>
          <button type="submit" className="s5__submit">
            Envoyer →
          </button>
        </form>

      </div>

      <p className="s5__copy">
        © 2025 Tropic-Aura B.C. — Fondée par Babacar Niang. Sénégal, Afrique de l&apos;Ouest. Tous droits réservés.
      </p>

    </section>
  )
}
