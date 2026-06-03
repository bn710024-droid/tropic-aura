import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Header.css'

const NAV_LINKS = ['Products', 'Story', 'Markets', 'Contact']

export default function Header() {
  const headerRef = useRef(null)
  const ctaRef    = useRef(null)

  /* ── Scroll-aware background ──────────────────────────── */
  useEffect(() => {
    const el = headerRef.current

    ScrollTrigger.create({
      start: 'top -60px',
      end: 99999,
      onToggle: (self) => {
        if (self.isActive) {
          gsap.to(el, {
            backgroundColor: 'rgba(0,0,0,0.88)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            duration: 0.4,
            ease: 'power2.out',
          })
        } else {
          gsap.to(el, {
            backgroundColor: 'rgba(0,0,0,0)',
            backdropFilter: 'blur(0px)',
            borderBottom: '1px solid transparent',
            duration: 0.4,
            ease: 'power2.out',
          })
        }
      },
    })
  }, [])

  /* ── Magnetic CTA ─────────────────────────────────────── */
  useEffect(() => {
    const btn = ctaRef.current
    if (!btn) return

    const onMove = (e) => {
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dx = (e.clientX - cx) * 0.3
      const dy = (e.clientY - cy) * 0.3
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out', overwrite: true })
    }

    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)', overwrite: true })
    }

    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    return () => {
      btn.removeEventListener('mousemove', onMove)
      btn.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <header ref={headerRef} className="header">
      <div className="header__logo">TROPIC-AURA</div>

      <nav className="header__nav">
        {NAV_LINKS.map((link) => (
          <a key={link} href={`#${link.toLowerCase()}`}>{link}</a>
        ))}
      </nav>

      <div className="header__cta-wrap">
        <button ref={ctaRef} className="header__cta">
          Initier un partenariat
        </button>
      </div>
    </header>
  )
}
