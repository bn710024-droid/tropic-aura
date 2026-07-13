import { useRef, useCallback, useEffect } from "react";

// ============================================================
//  LIQUID MENU — plein écran éditorial premium (Tropicaura)
//
//  Image immersive à gauche (~40%) + navigation en DEUX colonnes
//  à droite : rubriques principales + sous-liens (style Combilo).
//  Fond noir profond révélé par un cercle qui grandit depuis le
//  bouton. Animation 100% RAF natif (aucune dépendance externe).
//
//  Au survol d'une rubrique → l'image de gauche change (crossfade).
// ============================================================

// Navigation en 2 colonnes. Chaque rubrique : { label, href, img, subs[] }
// Sous-liens = raccourcis directs vers les vraies sections de chaque page
// (voir SECTIONS/aboutTheme.js, partnershipTheme.js, Produits.jsx). Le
// paramètre ?section=<id> est lu au montage par chaque page pour sauter
// directement au bon endroit — voir la logique dans APropos.jsx,
// Partenariats.jsx, Produits.jsx, Contact.jsx.
const COLUMNS = [
  [
    { label: "Accueil",  href: "/",         img: "/menu-accueil.jpg" },
    {
      label: "À Propos", href: "/about",    img: "/menu-apropos.jpg",
      subs: [
        { label: "Notre Vision",               href: "/about?section=vision" },
        { label: "Nos Fondations",             href: "/about?section=aujourdhui" },
        { label: "Notre Développement",        href: "/about?section=demain" },
        { label: "Créer Plus de Valeur",       href: "/about?section=ambition" },
        { label: "Notre Réseau International", href: "/about?section=avenir" },
        { label: "Notre Engagement",           href: "/about?section=engagement" },
      ],
    },
    {
      label: "Produits", href: "/produits", img: "/menu-produits.jpg",
      subs: [
        { label: "Signature",   href: "/produits?section=signature" },
        { label: "Saison",      href: "/produits?section=saison" },
        { label: "Spécialités", href: "/produits?section=specialites" },
      ],
    },
  ],
  [
    {
      label: "Partenariats", href: "/partenariats", img: "/menu-partenariats.jpg",
      subs: [
        { label: "Notre vision",       href: "/partenariats?section=vision" },
        { label: "Le parcours",        href: "/partenariats?section=parcours" },
        { label: "Notre expédition",   href: "/partenariats?section=expedition" },
        { label: "Devenir partenaire", href: "/partenariats?section=conclusion" },
      ],
    },
    {
      label: "Insights", href: "/insights", img: "/menu-visual.jpg",
      subs: [
        { label: "Sénégal, origine stratégique",       href: "/insights/senegal-origine-strategique" },
        { label: "Fournisseur stable vs opportuniste", href: "/insights/fournisseur-stable-opportuniste" },
      ],
    },
    {
      label: "Contact", href: "/contact", img: "/menu-contact.jpg",
      subs: [
        { label: "Nous contacter",         href: "/contact?section=form"          },
        { label: "Demande de partenariat", href: "/partenariats?section=conclusion" },
      ],
    },
  ],
];

const DEFAULT_IMG = COLUMNS[0][0].img; // Accueil

// Easings
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn  = (t) => t * t * t;

// ============================================================
export default function LiquidMenu() {
  const overlayRef = useRef(null);
  const btnRef     = useRef(null);   // fallback si #topbar-menu-btn absent au montage
  const imgWrapRef = useRef(null);
  const imgARef    = useRef(null);
  const imgBRef    = useRef(null);
  const activeImg  = useRef(0);
  const itemRefs   = useRef([]);
  const footerRef  = useRef(null);
  const isOpen     = useRef(false);
  const isBusy     = useRef(false);
  const rafId      = useRef(null);
  const tids       = useRef([]);
  const center     = useRef({ x: 0, y: 0, full: 0 });

  const killAll = useCallback(() => {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
    tids.current.forEach(clearTimeout);
    tids.current = [];
  }, []);

  const after = useCallback((ms, fn) => {
    tids.current.push(setTimeout(fn, ms));
  }, []);

  // Crossfade entre les deux calques d'image (fonds CSS → pas de bouton
  // "recherche visuelle" du navigateur, qui n'apparaît que sur les <img>)
  const setImage = useCallback((src) => {
    if (!src) return;
    const a = imgARef.current, b = imgBRef.current;
    if (!a || !b) return;
    const cur = activeImg.current === 0 ? a : b;
    const nxt = activeImg.current === 0 ? b : a;
    if (cur.dataset.src === src) return;
    nxt.style.backgroundImage = `url("${src}")`;
    nxt.dataset.src = src;
    nxt.style.opacity = "1";
    cur.style.opacity = "0";
    activeImg.current = activeImg.current === 0 ? 1 : 0;
  }, []);

  const measure = useCallback(() => {
    const realBtn = document.getElementById("topbar-menu-btn");
    const r = (realBtn || btnRef.current).getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const full = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) * 1.04;
    center.current = { x, y, full };
  }, []);

  const setClip = useCallback((radius) => {
    const { x, y } = center.current;
    overlayRef.current.style.clipPath =
      `circle(${radius.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
  }, []);

  const tweenRadius = useCallback((from, to, dur, ease, onDone) => {
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / (dur * 1000));
      setClip(from + (to - from) * ease(t));
      if (t < 1) rafId.current = requestAnimationFrame(step);
      else { rafId.current = null; onDone?.(); }
    };
    rafId.current = requestAnimationFrame(step);
  }, [setClip]);

  // ── OUVERTURE ─────────────────────────────────────────────
  const open = useCallback(() => {
    if (isBusy.current || isOpen.current) return;
    isBusy.current = true;
    isOpen.current = true;
    killAll();
    measure();

    overlayRef.current.style.pointerEvents = "auto";
    setClip(0);

    const items = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) items.push(footerRef.current);
    items.forEach((el) => {
      el.style.transition = "none";
      el.style.opacity    = "0";
      el.style.transform  = "translateY(28px)";
    });
    if (imgWrapRef.current) {
      imgWrapRef.current.style.transition = "none";
      imgWrapRef.current.style.opacity    = "0";
    }
    activeImg.current = 0;
    [imgARef.current, imgBRef.current].forEach((im, k) => {
      if (!im) return;
      im.style.transition = "none";
      im.style.transform  = "scale(1.16)";
      im.style.opacity    = k === 0 ? "1" : "0";
    });
    if (imgARef.current) {
      imgARef.current.style.backgroundImage = `url("${DEFAULT_IMG}")`;
      imgARef.current.dataset.src = DEFAULT_IMG;
    }

    // Bouton : grille → croix × (sur le VRAI bouton visible dans TopBar)
    const realGrid  = document.getElementById("topbar-menu-grid");
    const realCross = document.getElementById("topbar-menu-cross");
    if (realGrid)  { realGrid.style.opacity = "0"; realGrid.style.transform = "scale(.6)"; }
    if (realCross) { realCross.style.opacity = "1"; realCross.style.transform = "scale(1)"; }

    tweenRadius(0, center.current.full, 1.10, easeOut, null);

    after(360, () => {
      if (imgWrapRef.current) {
        imgWrapRef.current.style.transition = "opacity .9s ease";
        imgWrapRef.current.style.opacity    = "1";
      }
      [imgARef.current, imgBRef.current].forEach((im) => {
        if (!im) return;
        im.style.transition = "transform 1.3s cubic-bezier(.22,1,.36,1), opacity .45s ease";
        im.style.transform  = "scale(1)";
      });
    });

    items.forEach((el, i) =>
      after(560 + i * 55, () => {
        el.style.transition = "opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)";
        el.style.opacity    = "1";
        el.style.transform  = "translateY(0)";
      })
    );

    after(560 + items.length * 55 + 520, () => { isBusy.current = false; });
  }, [killAll, measure, setClip, after, tweenRadius]);

  // ── FERMETURE ─────────────────────────────────────────────
  const close = useCallback((onDone) => {
    if (isBusy.current || !isOpen.current) return;
    isBusy.current = true;
    isOpen.current = false;
    killAll();

    const realGrid  = document.getElementById("topbar-menu-grid");
    const realCross = document.getElementById("topbar-menu-cross");
    if (realCross) { realCross.style.opacity = "0"; realCross.style.transform = "scale(.6)"; }
    if (realGrid)  { realGrid.style.opacity = "1"; realGrid.style.transform = "scale(1)"; }

    const items = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) items.push(footerRef.current);
    items.forEach((el, i) => {
      el.style.transition = `opacity .2s ease ${i * 16}ms, transform .2s ease ${i * 16}ms`;
      el.style.opacity    = "0";
      el.style.transform  = "translateY(-16px)";
    });
    if (imgWrapRef.current) {
      imgWrapRef.current.style.transition = "opacity .26s ease";
      imgWrapRef.current.style.opacity    = "0";
    }

    after(210, () =>
      tweenRadius(center.current.full, 0, 0.82, easeIn, () => {
        overlayRef.current.style.pointerEvents = "none";
        isBusy.current = false;
        onDone?.();
      })
    );
  }, [killAll, after, tweenRadius]);

  const goTo   = useCallback((href) => { close(() => { window.location.href = href; }); }, [close]);
  const toggle = useCallback(() => { if (isOpen.current) close(); else open(); }, [open, close]);

  // Écoute l'événement personnalisé du TopBar pour ouvrir/fermer le menu
  useEffect(() => {
    const handleMenuToggle = () => toggle();
    window.addEventListener("topbar-menu-click", handleMenuToggle);
    return () => window.removeEventListener("topbar-menu-click", handleMenuToggle);
  }, [toggle]);

  let ri = 0; // index plat pour les refs d'animation

  return (
    <>
      {/* Responsive : image masquée + colonnes empilées sous 820px */}
      <style>{`
        @media (max-width: 820px){
          .lm-img  { display: none !important; }
          /* justify-content: flex-start (pas center, hérité du desktop) :
             sur mobile le contenu du menu dépasse souvent la hauteur de
             l'écran — centré verticalement, l'excédent est coupé À LA FOIS
             en haut ET en bas (piège flexbox classique). En alignant en
             haut, tout le contenu reste atteignable par le scroll. */
          .lm-nav  {
            width: 100% !important;
            padding: 90px clamp(28px,9vw,72px) calc(60px + env(safe-area-inset-bottom, 0px)) !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            overflow-y: auto !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .lm-cols { flex-direction: column !important; gap: clamp(24px,4vh,38px) !important; }
        }
      `}</style>

      {/* Fallback si le bouton TopBar (#topbar-menu-btn) n'est pas encore monté */}
      <button ref={btnRef} style={{ display: "none" }} />

      {/* ── Overlay plein écran (révélé par cercle) ─────────── */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 600,
          pointerEvents: "none", overflow: "hidden",
          backgroundColor: "#0A0A0A",
          clipPath: "circle(0px at 100% 100%)",
          display: "flex",
        }}
      >
        {/* ── Colonne image immersive (gauche, ~40%) ── */}
        <div
          className="lm-img"
          ref={imgWrapRef}
          style={{
            position: "relative",
            width: "40%", height: "100%",
            overflow: "hidden", opacity: 0, flexShrink: 0,
          }}
        >
          {[imgARef, imgBRef].map((ref, k) => (
            <div
              key={k}
              ref={ref}
              aria-hidden="true"
              data-src={k === 0 ? DEFAULT_IMG : undefined}
              style={{
                position: "absolute", inset: 0,
                width: "100%", height: "100%",
                backgroundImage: k === 0 ? `url("${DEFAULT_IMG}")` : "none",
                backgroundSize: "cover", backgroundPosition: "center",
                transform: "scale(1.16)",
                transition: "transform .9s cubic-bezier(.22,1,.36,1), opacity .45s ease",
                filter: "brightness(0.92) saturate(1.05)",
                opacity: k === 0 ? 1 : 0,
              }}
            />
          ))}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.55) 85%, #0A0A0A 100%)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.28) 100%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Colonnes de navigation (droite) ── */}
        <nav
          className="lm-nav"
          style={{
            flex: 1, height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "clamp(80px,12vh,120px) clamp(48px,7vw,110px)",
          }}
        >
          <div className="lm-cols" style={{ display: "flex", gap: "clamp(40px,5vw,90px)", width: "100%" }}>
            {COLUMNS.map((col, ci) => (
              <div key={ci} style={{ display: "flex", flexDirection: "column", gap: "clamp(22px,3.2vh,40px)", flex: 1 }}>
                {col.map((g) => (
                  <div key={g.label}>
                    {/* Rubrique principale */}
                    <div
                      ref={(el) => (itemRefs.current[ri++] = el)}
                      style={{ opacity: 0, transform: "translateY(28px)", willChange: "transform,opacity" }}
                    >
                      <button
                        onClick={() => goTo(g.href)}
                        onMouseEnter={(e) => { setImage(g.img); e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.transform = "translateX(0)"; }}
                        style={{
                          background: "none", border: "none", cursor: "pointer",
                          padding: 0, textAlign: "left", display: "block",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          color: "#fff", fontWeight: 800,
                          fontSize: "clamp(22px, 2.4vw, 34px)",
                          letterSpacing: "-.02em", lineHeight: 1.1,
                          transition: "color .25s ease, transform .35s cubic-bezier(.22,1,.36,1)",
                          userSelect: "none",
                        }}
                      >
                        {g.label}
                      </button>
                    </div>

                    {/* Sous-liens */}
                    {g.subs && (
                      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
                        {g.subs.map((s) => (
                          <div
                            key={s.label}
                            ref={(el) => (itemRefs.current[ri++] = el)}
                            style={{ opacity: 0, transform: "translateY(20px)", willChange: "transform,opacity" }}
                          >
                            <button
                              onClick={() => goTo(s.href)}
                              onMouseEnter={(e) => { setImage(g.img); e.currentTarget.style.color = "rgba(255,255,255,0.92)"; e.currentTarget.style.transform = "translateX(6px)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; e.currentTarget.style.transform = "translateX(0)"; }}
                              style={{
                                background: "none", border: "none", cursor: "pointer",
                                padding: 0, textAlign: "left", display: "block",
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                color: "rgba(255,255,255,0.5)", fontWeight: 500,
                                fontSize: "clamp(13px, 1vw, 15px)",
                                letterSpacing: ".01em", lineHeight: 1.5,
                                transition: "color .2s ease, transform .3s cubic-bezier(.22,1,.36,1)",
                                userSelect: "none",
                              }}
                            >
                              {s.label}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Pied du menu */}
          <div
            ref={footerRef}
            style={{
              opacity: 0, transform: "translateY(28px)",
              willChange: "transform,opacity",
              marginTop: "clamp(34px,6vh,64px)",
              display: "flex", alignItems: "center", gap: 18,
            }}
          >
            <div style={{ width: 26, height: 1, background: "rgba(255,255,255,0.16)" }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              letterSpacing: ".24em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.26)",
            }}>
              Tropicaura · Commerce Tropical d'Excellence
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
