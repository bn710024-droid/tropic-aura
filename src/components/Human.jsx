import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IMAGES } from '../images'
import './Human.css'

const KINETIC_TEXT = 'CULTIVÉ SOUS LE SOLEIL DU SÉNÉGAL • GORGÉ DE NUTRIMENTS • EXPORTÉ AVEC SOIN • CULTIVÉ SOUS LE SOLEIL DU SÉNÉGAL • GORGÉ DE NUTRIMENTS • EXPORTÉ AVEC SOIN • '

export default function Human() {
  const sectionRef  = useRef(null)
  const flashRef    = useRef(null)
  const kineticRef  = useRef(null)
  const dividerRef  = useRef(null)
  const bottomRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    /* ── Flash blanc (clip-path reveal) ──────────────────── */
    gsap.set(flashRef.current, { clipPath: 'inset(100% 0% 0% 0%)' })

    const tlReveal = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end:   'top 10%',
        scrub: 1.2,
      },
    })
    tlReveal.to(flashRef.current, {
      clipPath: 'inset(0% 0% 0% 0%)',
      ease: 'power2.inOut',
    })

    /* ── Texte cinétique horizontal (vitesse du scroll) ─── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end:   'bottom top',
        scrub: 1,
        pin: flashRef.current,
        anticipatePin: 1,
      },
    })

    // Défile de droite à gauche à la vitesse du scroll
    const textWidth = kineticRef.current
      ? kineticRef.current.scrollWidth / 2
      : 2000

    tl.to(kineticRef.current, {
      x: -textWidth,
      ease: 'none',
    }, 0)

    // Divider + bottom apparaissent
    tl.to(dividerRef.current, {
      opacity: 1,
      scaleX: 1,
      ease: 'power2.out',
      duration: 0.2,
    }, 0.05)

    tl.to(bottomRef.current, {
      opacity: 1,
      y: 0,
      ease: 'power2.out',
      duration: 0.3,
    }, 0.1)

    gsap.set(bottomRef.current, { y: 24 })

    return () => ScrollTrigger.getAll().forEach((t) => {
      if (t.trigger === section) t.kill()
    })
  }, [])

  return (
    <section
      id="human-section"
      ref={sectionRef}
      className="human"
    >
      <div ref={flashRef} className="human__flash">
        <div className="human__split">

          {/* Gauche — image terroir */}
          <div className="human__image-col">
            <img
              src={IMAGES.terroir}
              alt="Paysage tropical — terroir sénégalais"
              loading="lazy"
              decoding="async"
            />
          </div>

          {/* Droite — texte cinétique */}
          <div className="human__text-col">
            <div className="human__kinetic-wrap">
              <div ref={kineticRef} className="human__kinetic" aria-label={KINETIC_TEXT}>
                {/* Double le texte pour le défilement infini */}
                {KINETIC_TEXT}{KINETIC_TEXT}
              </div>
            </div>

            <div ref={dividerRef} className="human__divider" />

            <div ref={bottomRef} className="human__bottom">
              <button className="human__btn" type="button">
                Découvrir nos Vergers
                <span className="human__btn-arrow">→</span>
              </button>
              <p className="human__founder">
                <strong>Babacar Niang, fondateur</strong> — connecter l&apos;excellence
                africaine aux marchés mondiaux, depuis le Port Autonome de Dakar.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
