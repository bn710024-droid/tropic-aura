import { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { IMAGES } from '../images'
import './Header.css'

const NAV_LINKS = [
  ['Fruits tropicaux', '#'],  ['Légumes sous serre', '#'],
  ['Fruits exotiques',  '#'],  ['Notre histoire',    '#'],
  ['Marchés cibles',   '#'],  ['Qualité & Certif.', '#'],
  ['Logistique',       '#'],  ['Contact B2B',       '#'],
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const overlayRef = useRef(null)
  const navLinksRef = useRef([])
  const tlRef = useRef(null)

  useEffect(() => {
    const overlay = overlayRef.current
    gsap.set(overlay, { y: '-100%' })

    tlRef.current = gsap.timeline({ paused: true })
      .to(overlay, {
        y: '0%',
        duration: 0.55,
        ease: 'power3.inOut',
      })
      .fromTo(
        navLinksRef.current.filter(Boolean),
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.045, duration: 0.4, ease: 'power3.out' },
        '-=0.2'
      )
  }, [])

  const toggle = () => {
    if (!open) {
      setOpen(true)
      tlRef.current.play()
    } else {
      tlRef.current.reverse().then(() => setOpen(false))
    }
  }

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="header__logo">
          <img
            src={IMAGES.logo}
            alt="Tropic-Aura"
            style={{ height: 40, width: 40, borderRadius: 6, objectFit: 'cover' }}
          />
          <span className="header__logo-text">TROPIC-AURA</span>
        </div>

        {/* Right zone */}
        <div className="header__right">
          <span className="header__lang">FR</span>
          <button className="header__contact">Contact</button>
          <button className="header__menu-btn" onClick={toggle} aria-label="Menu">
            {open
              ? <span className="header__close-icon">✕</span>
              : <div className="header__grid-icon">
                  <span /><span /><span /><span />
                </div>
            }
          </button>
        </div>
      </header>

      {/* Overlay curtain */}
      <div ref={overlayRef} className="overlay">
        <button className="overlay__close" onClick={toggle}>✕</button>

        {/* Gauche — image terroir */}
        <div className="overlay__left">
          <img src={IMAGES.mainTerroir} alt="Terroir Sénégal" />
          <span className="overlay__left-badge">Export B2B • Dakar</span>
        </div>

        {/* Droite — liens */}
        <div className="overlay__right">
          <nav className="overlay__nav">
            {NAV_LINKS.map(([label, href], i) => (
              <a
                key={label}
                href={href}
                ref={el => { navLinksRef.current[i] = el }}
                onClick={toggle}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="overlay__bottom">
            <p>Port de Dakar · FOB / FAS · Export B2B</p>
          </div>
        </div>
      </div>
    </>
  )
}
