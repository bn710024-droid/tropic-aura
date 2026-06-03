import { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IMAGES } from '../images'
import './Closing.css'

/* ── Données carrousel ──────────────────────────────────── */
const CAROUSEL_ITEMS = [
  {
    key: 'mangoKent',
    name: 'Mangue Kent',
    desc: 'Charnue, sans fibres. Le standard du luxe tropical.',
    image: IMAGES.mangoKent,
  },
  {
    key: 'mangoKeitt',
    name: 'Mangue Keitt',
    desc: 'Douce et juteuse. La robe verte qui cache l\'or.',
    image: IMAGES.mangoKeitt,
  },
  {
    key: 'avocat',
    name: 'Avocat Hass',
    desc: 'Crémeux à cœur. L\'avocat premium d\'Afrique de l\'Ouest.',
    image: IMAGES.avocat,
  },
]

/* ── Données catalogue ──────────────────────────────────── */
const FRUITS = [
  { label: 'Ananas Victoria', img: IMAGES.ananas },
  { label: 'Pastèque',        img: IMAGES.pasteque },
  { label: 'Papaye',          img: IMAGES.papaye },
  { label: 'Melon',           img: IMAGES.melon },
  { label: 'Noix de Coco',    img: IMAGES.coco },
  { label: 'Citron Vert',     img: IMAGES.citron },
  { label: 'Banane',          img: IMAGES.banane },
]

const LEGUMES = [
  { label: 'Haricots Verts',   img: IMAGES.haricots },
  { label: 'Patate Douce',     img: null },
  { label: 'Gombo',            img: null },
  { label: 'Piments Capsicum', img: IMAGES.piments },
  { label: 'Oignon',           img: null },
]

/* ══════════════════════════════════════════════════════════
   Carrousel Elite
   ══════════════════════════════════════════════════════════ */
function Carousel() {
  const [current, setCurrent] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)

  const goTo = useCallback((idx) => {
    setPrevIdx(current)
    setCurrent(idx)
  }, [current])

  const prev = () => goTo((current - 1 + CAROUSEL_ITEMS.length) % CAROUSEL_ITEMS.length)
  const next = () => goTo((current + 1) % CAROUSEL_ITEMS.length)

  return (
    <div className="carousel">
      <div className="carousel__track">
        {CAROUSEL_ITEMS.map((item, i) => (
          <div
            key={item.key}
            className={`carousel__slide${i === current ? ' active' : ''}`}
          >
            <img
              src={item.image}
              alt={item.name}
              loading={i === 0 ? 'eager' : 'lazy'}
              decoding="async"
            />
            <div className="carousel__info">
              <div className="carousel__info-name">{item.name}</div>
              <div className="carousel__info-desc">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel__nav">
        <button className="carousel__arrow" onClick={prev} aria-label="Précédent">&#8592;</button>
        <div className="carousel__dots">
          {CAROUSEL_ITEMS.map((_, i) => (
            <button
              key={i}
              className={`carousel__dot${i === current ? ' active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Produit ${i + 1}`}
            />
          ))}
        </div>
        <button className="carousel__arrow" onClick={next} aria-label="Suivant">&#8594;</button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Catalogue produits avec preview hover
   ══════════════════════════════════════════════════════════ */
function Catalog() {
  const previewRef   = useRef(null)
  const previewImgRef = useRef(null)
  const [hovered, setHovered]   = useState(false)
  const [previewSrc, setPreviewSrc] = useState('')
  const [imgLoaded, setImgLoaded]   = useState(false)

  const handleEnter = useCallback((img) => {
    if (!img) return
    setImgLoaded(false)
    setPreviewSrc(img)
    setHovered(true)
  }, [])

  const handleLeave = useCallback(() => {
    setHovered(false)
  }, [])

  const items = (list) =>
    list.map((item) => (
      <span
        key={item.label}
        className="catalog__item"
        onMouseEnter={() => handleEnter(item.img)}
        onMouseLeave={handleLeave}
      >
        {item.label}
      </span>
    ))

  return (
    <div className="catalog">
      <p className="catalog__title">— Diversité Tropicale</p>

      <div className="catalog__cols">
        <div>
          <div className="catalog__group-label">Fruits</div>
          {items(FRUITS)}
        </div>
        <div>
          <div className="catalog__group-label">Légumes</div>
          {items(LEGUMES)}
        </div>
      </div>

      {/* Preview image fixe — un seul composant partagé */}
      <div
        ref={previewRef}
        className={`catalog__preview${hovered && previewSrc ? ' visible' : ''}`}
      >
        {previewSrc && (
          <img
            ref={previewImgRef}
            key={previewSrc}
            src={previewSrc}
            alt="Aperçu produit"
            className={imgLoaded ? '' : 'loading'}
            onLoad={() => setImgLoaded(true)}
            decoding="async"
          />
        )}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Formulaire B2B
   ══════════════════════════════════════════════════════════ */
function FormB2B() {
  const submitRef = useRef(null)

  useEffect(() => {
    const btn = submitRef.current
    if (!btn) return

    const onMove = (e) => {
      const rect = btn.getBoundingClientRect()
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.28
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.28
      gsap.to(btn, { x: dx, y: dy, duration: 0.4, ease: 'power2.out', overwrite: true })
    }
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)', overwrite: true })
    }

    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    return () => {
      btn.removeEventListener('mousemove', onMove)
      btn.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    // Feedback visuel
    gsap.fromTo(submitRef.current,
      { scale: 0.95 },
      { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
    )
  }

  return (
    <div className="form-b2b">
      <h3 className="form-b2b__title">Partenariat B2B</h3>
      <p className="form-b2b__subtitle">
        Vous êtes importateur, grossiste ou centrale d&apos;achat&nbsp;?<br />
        Contactez-nous pour un devis personnalisé.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-b2b__field">
          <input
            type="text"
            placeholder="Nom & Entreprise"
            required
            autoComplete="organization"
          />
        </div>
        <div className="form-b2b__field">
          <input
            type="email"
            placeholder="Email professionnel"
            required
            autoComplete="email"
          />
        </div>
        <div className="form-b2b__field">
          <textarea
            placeholder="Message / Demande (volume, produits, Incoterm…)"
            required
          />
        </div>

        <div className="form-b2b__submit-wrap">
          <button ref={submitRef} type="submit" className="form-b2b__submit">
            Initier un partenariat
          </button>
        </div>
      </form>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   Closing — Section principale
   ══════════════════════════════════════════════════════════ */
export default function Closing() {
  const sectionRef = useRef(null)
  const curtainRef = useRef(null)

  /* ── Transition clip-path circulaire (réabsorbe le blanc) */
  useEffect(() => {
    const curtain = curtainRef.current
    if (!curtain) return

    // Commence plein écran (blanc visible)
    gsap.set(curtain, { clipPath: 'circle(120% at 50% 50%)' })

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 85%',
      end:   'top 15%',
      scrub: 1.4,
      onUpdate: (self) => {
        const r = 120 - self.progress * 122
        gsap.set(curtain, {
          clipPath: `circle(${Math.max(0, r)}% at 50% 50%)`,
        })
      },
    })
  }, [])

  return (
    <section
      id="closing-section"
      ref={sectionRef}
      className="closing"
    >
      {/* Rideau blanc — se résorbe par le centre */}
      <div ref={curtainRef} className="closing__curtain" aria-hidden />

      {/* Contenu sombre */}
      <div className="closing__content">
        <h2 className="closing__title">Notre Sélection Premium</h2>

        {/* 4.1 Carrousel Elite */}
        <Carousel />

        {/* 4.2 Catalogue diversité tropicale */}
        <Catalog />

        {/* 4.3 Formulaire B2B */}
        <FormB2B />
      </div>
    </section>
  )
}
