import { useRef, useCallback } from "react";

// ============================================================
//  LIQUID MENU — plein écran éditorial premium (Tropic-Aura)
//
//  Inspiré de Combilo, sans le copier : colonne image immersive
//  à gauche (~40%), navigation aérée à droite. Fond noir profond,
//  révélé par un cercle qui grandit depuis le bouton (coin sup-droit).
//
//  Animation 100% RAF natif — aucune dépendance externe.
// ============================================================

// Arborescence. Une rubrique peut porter des sous-liens (children).
const NAV = [
  { label: "Accueil",       href: "/"             },
  { label: "À Propos",      href: "/about"        },
  { label: "Notre Univers", href: "/univers"      },
  { label: "Partenariats",  href: "/partenariats" },
  {
    label: "Contact", href: "/contact",
    children: [
      { label: "Nous contacter",         href: "/contact"      },
      { label: "Demande de partenariat", href: "/partenariats" },
    ],
  },
];

// Aplati en lignes animables (main + sub), dans l'ordre de lecture.
const ROWS = [];
NAV.forEach((n) => {
  ROWS.push({ kind: "main", label: n.label, href: n.href });
  (n.children || []).forEach((c) =>
    ROWS.push({ kind: "sub", label: c.label, href: c.href }));
});

// Easings
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeIn  = (t) => t * t * t;

// ============================================================
export default function LiquidMenu() {
  const overlayRef = useRef(null);
  const btnRef     = useRef(null);
  const bar1Ref    = useRef(null);
  const bar2Ref    = useRef(null);
  const imgWrapRef = useRef(null);
  const imgRef     = useRef(null);
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

  const measure = useCallback(() => {
    const r = btnRef.current.getBoundingClientRect();
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

    // Reset items + image (silencieux)
    const items = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) items.push(footerRef.current);
    items.forEach((el) => {
      el.style.transition = "none";
      el.style.opacity    = "0";
      el.style.transform  = "translateY(34px)";
    });
    if (imgWrapRef.current) {
      imgWrapRef.current.style.transition = "none";
      imgWrapRef.current.style.opacity    = "0";
    }
    if (imgRef.current) {
      imgRef.current.style.transition = "none";
      imgRef.current.style.transform  = "scale(1.16)";
    }

    // Bouton → croix ×
    btnRef.current.style.backgroundColor  = "rgba(255,255,255,0.08)";
    btnRef.current.style.borderColor      = "rgba(255,255,255,0.22)";
    bar1Ref.current.style.transform       = "translateY(4.5px) rotate(45deg)";
    bar1Ref.current.style.backgroundColor = "#fff";
    bar2Ref.current.style.transform       = "translateY(-4.5px) rotate(-45deg)";
    bar2Ref.current.style.backgroundColor = "#fff";

    // Cercle s'étend → plein écran
    tweenRadius(0, center.current.full, 1.10, easeOut, null);

    // Image immersive : fondu + très léger dézoom
    after(360, () => {
      if (imgWrapRef.current) {
        imgWrapRef.current.style.transition = "opacity .9s ease";
        imgWrapRef.current.style.opacity    = "1";
      }
      if (imgRef.current) {
        imgRef.current.style.transition = "transform 1.3s cubic-bezier(.22,1,.36,1)";
        imgRef.current.style.transform  = "scale(1)";
      }
    });

    // Navigation en cascade
    items.forEach((el, i) =>
      after(560 + i * 85, () => {
        el.style.transition = "opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)";
        el.style.opacity    = "1";
        el.style.transform  = "translateY(0)";
      })
    );

    after(560 + items.length * 85 + 520, () => { isBusy.current = false; });
  }, [killAll, measure, setClip, after, tweenRadius]);

  // ── FERMETURE ─────────────────────────────────────────────
  const close = useCallback((onDone) => {
    if (isBusy.current || !isOpen.current) return;
    isBusy.current = true;
    isOpen.current = false;
    killAll();

    // Bouton → hamburger
    btnRef.current.style.backgroundColor  = "rgba(0,0,0,0.08)";
    btnRef.current.style.borderColor      = "rgba(0,0,0,0.16)";
    bar1Ref.current.style.transform       = "none";
    bar1Ref.current.style.backgroundColor = "#111";
    bar2Ref.current.style.transform       = "none";
    bar2Ref.current.style.backgroundColor = "#111";

    // Contenus s'effacent
    const items = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) items.push(footerRef.current);
    items.forEach((el, i) => {
      el.style.transition = `opacity .2s ease ${i * 26}ms, transform .2s ease ${i * 26}ms`;
      el.style.opacity    = "0";
      el.style.transform  = "translateY(-18px)";
    });
    if (imgWrapRef.current) {
      imgWrapRef.current.style.transition = "opacity .26s ease";
      imgWrapRef.current.style.opacity    = "0";
    }

    // Cercle se rétracte vers le coin sup-droit
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

  let ri = 0; // index plat pour les refs d'animation

  return (
    <>
      {/* Responsive : masque l'image sous 820px, nav pleine largeur */}
      <style>{`
        @media (max-width: 820px){
          .lm-img  { display: none !important; }
          .lm-nav  { width: 100% !important; padding-left: clamp(28px,9vw,72px) !important; }
        }
      `}</style>

      {/* ── Bouton déclencheur ─────────────────────────────── */}
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label="Menu"
        style={{
          position: "fixed",
          top: 16, right: "clamp(20px,5vw,48px)",
          zIndex: 700,
          width: 46, height: 46,
          borderRadius: "50%",
          backgroundColor: "rgba(0,0,0,0.08)",
          border: "1.5px solid rgba(0,0,0,0.16)",
          cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 7, padding: 0,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transition: "background-color .28s, border-color .28s",
        }}
      >
        <div ref={bar1Ref} style={{
          width: 18, height: 1.5, backgroundColor: "#111", borderRadius: 2,
          transformOrigin: "center",
          transition: "transform .28s cubic-bezier(.76,0,.24,1), background-color .28s",
          pointerEvents: "none",
        }} />
        <div ref={bar2Ref} style={{
          width: 18, height: 1.5, backgroundColor: "#111", borderRadius: 2,
          transformOrigin: "center",
          transition: "transform .28s cubic-bezier(.76,0,.24,1), background-color .28s",
          pointerEvents: "none",
        }} />
      </button>

      {/* ── Overlay plein écran (révélé par cercle) ─────────── */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 600,
          pointerEvents: "none", overflow: "hidden",
          backgroundColor: "#0A0A0A",
          clipPath: "circle(0px at 100% 0%)",
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
            overflow: "hidden",
            opacity: 0,
            flexShrink: 0,
          }}
        >
          <img
            ref={imgRef}
            src="/menu-visual.jpg"
            alt=""
            aria-hidden="true"
            onMouseEnter={() => { if (imgRef.current) imgRef.current.style.transform = "scale(1.05)"; }}
            onMouseLeave={() => { if (imgRef.current) imgRef.current.style.transform = "scale(1)"; }}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center",
              transform: "scale(1.16)",
              transition: "transform .9s cubic-bezier(.22,1,.36,1)",
              filter: "brightness(0.92) saturate(1.05)",
              display: "block",
            }}
          />
          {/* Dégradé pour fondre l'image dans le noir à droite */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, rgba(10,10,10,0) 55%, rgba(10,10,10,0.55) 85%, #0A0A0A 100%)",
            pointerEvents: "none",
          }} />
          {/* Légère vignette bas pour la profondeur */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.28) 100%)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── Colonne navigation (droite) ── */}
        <nav
          className="lm-nav"
          style={{
            flex: 1, height: "100%",
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "clamp(80px,12vh,120px) clamp(48px,7vw,110px)",
          }}
        >
          {ROWS.map((row) => {
            const idx = ri++;
            const isMain = row.kind === "main";
            return (
              <div
                key={row.label + idx}
                ref={(el) => (itemRefs.current[idx] = el)}
                style={{
                  opacity: 0, transform: "translateY(34px)",
                  willChange: "transform,opacity",
                  marginBottom: isMain ? "clamp(4px,1.1vh,14px)" : "2px",
                  marginTop: row.kind === "sub" ? 0 : undefined,
                }}
              >
                <button
                  onClick={() => goTo(row.href)}
                  onMouseEnter={(e) => { e.currentTarget.style.color = isMain ? "rgba(255,255,255,0.42)" : "rgba(255,255,255,0.85)"; e.currentTarget.style.transform = "translateX(8px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = isMain ? "#fff" : "rgba(255,255,255,0.42)"; e.currentTarget.style.transform = "translateX(0)"; }}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, textAlign: "left",
                    display: "block",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    color: isMain ? "#fff" : "rgba(255,255,255,0.42)",
                    fontWeight: isMain ? 800 : 500,
                    fontSize: isMain ? "clamp(30px, 4vw, 60px)" : "clamp(12px, 1vw, 15px)",
                    letterSpacing: isMain ? "-.03em" : ".04em",
                    lineHeight: isMain ? 1.08 : 1.6,
                    marginLeft: isMain ? 0 : "clamp(2px,0.6vw,8px)",
                    transition: "color .25s ease, transform .35s cubic-bezier(.22,1,.36,1)",
                    userSelect: "none",
                  }}
                >
                  {row.label}
                </button>
              </div>
            );
          })}

          {/* Pied du menu */}
          <div
            ref={footerRef}
            style={{
              opacity: 0, transform: "translateY(34px)",
              willChange: "transform,opacity",
              marginTop: "clamp(30px,5vh,58px)",
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
              TROPIC-AURA · Commerce Tropical d'Excellence
            </span>
          </div>
        </nav>
      </div>
    </>
  );
}
