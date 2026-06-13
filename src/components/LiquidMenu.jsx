import { useRef, useCallback } from "react";

// ============================================================
//  LIQUID CURVE MENU — style Combilo
//
//  Animation 100% RAF natif (même technique que Lenis) :
//  aucune dépendance externe → fonctionne dans tous les contextes.
//
//  Principe : un panneau noir révélé par un CERCLE qui grandit
//  depuis le coin supérieur droit (le bouton). La frontière
//  page / panneau est un arc de cercle qui s'étend radialement
//  jusqu'à recouvrir tout l'écran.
//
//  Ouverture :
//    0ms        : bouton → croix ×
//    0–700ms    : cercle s'étend du coin sup-droit → plein écran
//    500–840ms  : liens en cascade (stagger 90ms)
//  Fermeture :
//    0–150ms    : contenus s'effacent
//    150–700ms  : cercle se rétracte vers le coin sup-droit
// ============================================================

const LINKS = [
  { label: "Accueil",       sub: "page d'accueil",       href: "/"             },
  { label: "À Propos",      sub: "notre histoire",        href: "/about"        },
  { label: "Partenariats",  sub: "rejoindre le réseau",   href: "/partenariats" },
  { label: "Contact",       sub: "travailler ensemble",   href: "/contact"      },
];

// Easings
const easeOut = (t) => 1 - Math.pow(1 - t, 3);          // décélération douce (ouverture)
const easeIn  = (t) => t * t * t;                        // accélération (fermeture)

// ============================================================
export default function LiquidMenu() {
  const overlayRef = useRef(null);
  const btnRef     = useRef(null);
  const bar1Ref    = useRef(null);
  const bar2Ref    = useRef(null);
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

  // Origine du cercle = centre du bouton ; rayon plein = distance au coin opposé
  const measure = useCallback(() => {
    const r = btnRef.current.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height / 2;
    const W = window.innerWidth;
    const H = window.innerHeight;
    // coin le plus éloigné (en bas à gauche depuis un bouton en haut à droite)
    const full = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) * 1.04;
    center.current = { x, y, full };
  }, []);

  const setClip = useCallback((radius) => {
    const { x, y } = center.current;
    overlayRef.current.style.clipPath =
      `circle(${radius.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px)`;
  }, []);

  // Tween du rayon du cercle
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

    // Items : reset silencieux
    const allItems = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) allItems.push(footerRef.current);
    allItems.forEach((el) => {
      el.style.transition = "none";
      el.style.opacity    = "0";
      el.style.transform  = "translateY(36px)";
    });

    // Bouton → croix ×
    btnRef.current.style.backgroundColor  = "rgba(255,255,255,0.08)";
    btnRef.current.style.borderColor      = "rgba(255,255,255,0.22)";
    bar1Ref.current.style.transform       = "translateY(4.5px) rotate(45deg)";
    bar1Ref.current.style.backgroundColor = "#fff";
    bar2Ref.current.style.transform       = "translateY(-4.5px) rotate(-45deg)";
    bar2Ref.current.style.backgroundColor = "#fff";

    // Cercle s'étend du coin sup-droit → plein écran
    tweenRadius(0, center.current.full, 0.70, easeOut, null);

    // Liens en cascade (démarrent pendant que le cercle finit son expansion)
    allItems.forEach((el, i) =>
      after(500 + i * 90, () => {
        el.style.transition = "opacity .42s ease, transform .42s ease";
        el.style.opacity    = "1";
        el.style.transform  = "translateY(0)";
      })
    );

    after(500 + allItems.length * 90 + 420, () => { isBusy.current = false; });
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

    // Contenus s'effacent rapidement
    const allItems = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) allItems.push(footerRef.current);
    allItems.forEach((el, i) => {
      el.style.transition = `opacity .16s ease ${i * 30}ms, transform .16s ease ${i * 30}ms`;
      el.style.opacity    = "0";
      el.style.transform  = "translateY(-20px)";
    });

    // Cercle se rétracte vers le coin sup-droit
    after(150, () =>
      tweenRadius(center.current.full, 0, 0.55, easeIn, () => {
        overlayRef.current.style.pointerEvents = "none";
        isBusy.current = false;
        onDone?.();
      })
    );
  }, [killAll, after, tweenRadius]);

  const goTo   = useCallback((href) => { close(() => { window.location.href = href; }); }, [close]);
  const toggle = useCallback(() => { if (isOpen.current) close(); else open(); }, [open, close]);

  return (
    <>
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
          width: 18, height: 1.5,
          backgroundColor: "#111",
          borderRadius: 2,
          transformOrigin: "center",
          transition: "transform .28s cubic-bezier(.76,0,.24,1), background-color .28s",
          pointerEvents: "none",
        }} />
        <div ref={bar2Ref} style={{
          width: 18, height: 1.5,
          backgroundColor: "#111",
          borderRadius: 2,
          transformOrigin: "center",
          transition: "transform .28s cubic-bezier(.76,0,.24,1), background-color .28s",
          pointerEvents: "none",
        }} />
      </button>

      {/* ── Overlay plein écran (révélé par cercle expansif) ── */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed", inset: 0, zIndex: 600,
          pointerEvents: "none", overflow: "hidden",
          backgroundColor: "#111111",
          clipPath: "circle(0px at 100% 0%)",
        }}
      >
        {/* Contenu du menu */}
        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "clamp(80px,12vh,120px) clamp(48px,10vw,120px)",
        }}>
          <nav>
            {LINKS.map((link, i) => (
              <div
                key={link.href}
                ref={(el) => (itemRefs.current[i] = el)}
                style={{ opacity: 0, transform: "translateY(36px)", willChange: "transform,opacity", marginBottom: "clamp(2px,1vh,12px)" }}
              >
                <button
                  onClick={() => goTo(link.href)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
                  onMouseEnter={(e) => { e.currentTarget.firstChild.style.color = "rgba(255,255,255,0.28)"; }}
                  onMouseLeave={(e) => { e.currentTarget.firstChild.style.color = "#fff"; }}
                >
                  <span style={{
                    display: "block",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(36px, 6.5vw, 88px)",
                    letterSpacing: "-.035em", lineHeight: 1.0,
                    color: "#fff", transition: "color .15s", userSelect: "none",
                  }}>
                    {link.label}
                  </span>
                  <span style={{
                    display: "block",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 400,
                    fontSize: "clamp(9px, 0.8vw, 12px)",
                    letterSpacing: ".20em", textTransform: "uppercase",
                    color: "rgba(255,255,255,0.28)", userSelect: "none", marginTop: 3,
                  }}>
                    {link.sub}
                  </span>
                </button>
              </div>
            ))}
          </nav>

          {/* Pied du menu */}
          <div
            ref={footerRef}
            style={{
              opacity: 0, transform: "translateY(36px)",
              willChange: "transform,opacity",
              marginTop: "clamp(28px,4vh,52px)",
              display: "flex", alignItems: "center", gap: 18,
            }}
          >
            <div style={{ width: 24, height: 1, background: "rgba(255,255,255,0.15)" }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 10, fontWeight: 500,
              letterSpacing: ".22em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}>
              TROPIC-AURA · Commerce Tropical d'Excellence
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
