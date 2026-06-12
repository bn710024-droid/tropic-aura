import { useRef, useCallback } from "react";

// ============================================================
//  LIQUID CURVE MENU — style Combilo
//
//  Animation 100% RAF natif (même technique que Lenis) :
//  aucune dépendance GSAP → fonctionne dans tous les contextes.
//
//  Timeline d'ouverture :
//    0ms        : bouton → croix × (CSS transition)
//   50ms–470ms  : vague concave balaie depuis le coin sup-droit
//  440ms–720ms  : vague s'aplatit → noir plein écran
//  580ms–840ms  : liens en cascade (stagger 90ms)
// ============================================================

const LINKS = [
  { label: "Accueil",       sub: "page d'accueil",       href: "/"             },
  { label: "À Propos",      sub: "notre histoire",        href: "/about"        },
  { label: "Partenariats",  sub: "rejoindre le réseau",   href: "/partenariats" },
  { label: "Contact",       sub: "travailler ensemble",   href: "/contact"      },
];

// Coordonnées numériques pour le path SVG (viewBox 0 0 100 100)
// Structure fixe : M x y  L x y  L x y  C x y x y x y  Z
//                 [0 1]  [2 3]  [4 5]  [6 7] [8 9] [10 11]
const N_CLOSED = [0,0, 100,0, 100,0,   100,0,   0,0,   0,0  ];
const N_WAVE   = [0,0, 100,0, 100,100, 100,38,  0,38,  0,68 ];
const N_FULL   = [0,0, 100,0, 100,100, 100,100, 0,100, 0,100];

// Easing
const eio3  = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2;
const eout2 = (t) => 1 - (1-t)*(1-t);
const ein2  = (t) => t*t;

const lerp  = (a, b, t) => a + (b - a) * t;
const buildPath = (n) =>
  `M ${n[0]} ${n[1]} L ${n[2]} ${n[3]} L ${n[4]} ${n[5]} C ${n[6]} ${n[7]} ${n[8]} ${n[9]} ${n[10]} ${n[11]} Z`;

// ============================================================
export default function LiquidMenu() {
  const overlayRef = useRef(null);
  const pathRef    = useRef(null);
  const btnRef     = useRef(null);
  const bar1Ref    = useRef(null);
  const bar2Ref    = useRef(null);
  const itemRefs   = useRef([]);
  const footerRef  = useRef(null);
  const isOpen     = useRef(false);
  const isBusy     = useRef(false);
  const rafId      = useRef(null);
  const tids       = useRef([]);   // setTimeout ids

  const killAll = useCallback(() => {
    if (rafId.current) { cancelAnimationFrame(rafId.current); rafId.current = null; }
    tids.current.forEach(clearTimeout);
    tids.current = [];
  }, []);

  const after = useCallback((ms, fn) => {
    tids.current.push(setTimeout(fn, ms));
  }, []);

  // Tween path de `from` vers `to` en `dur` secondes avec easing `ease`
  const tweenPath = useCallback((from, to, dur, ease, onDone) => {
    const t0 = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - t0) / (dur * 1000));
      const e = ease(t);
      const n = from.map((v, i) => lerp(v, to[i], e));
      pathRef.current?.setAttribute("d", buildPath(n));
      if (t < 1) rafId.current = requestAnimationFrame(step);
      else { rafId.current = null; onDone?.(); }
    };
    rafId.current = requestAnimationFrame(step);
  }, []);

  // ── OUVERTURE ─────────────────────────────────────────────
  const open = useCallback(() => {
    if (isBusy.current || isOpen.current) return;
    isBusy.current = true;
    isOpen.current = true;
    killAll();

    overlayRef.current.style.pointerEvents = "auto";
    pathRef.current?.setAttribute("d", buildPath(N_CLOSED));

    // Items : reset silencieux
    const allItems = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) allItems.push(footerRef.current);
    allItems.forEach((el) => {
      el.style.transition = "none";
      el.style.opacity    = "0";
      el.style.transform  = "translateY(36px)";
    });

    // Bouton → croix × (CSS transition)
    btnRef.current.style.backgroundColor  = "rgba(255,255,255,0.08)";
    btnRef.current.style.borderColor      = "rgba(255,255,255,0.22)";
    bar1Ref.current.style.transform       = "translateY(4.5px) rotate(45deg)";
    bar1Ref.current.style.backgroundColor = "#fff";
    bar2Ref.current.style.transform       = "translateY(-4.5px) rotate(-45deg)";
    bar2Ref.current.style.backgroundColor = "#fff";

    // Phase 1 — vague (50ms → 470ms)
    after(50, () =>
      tweenPath(N_CLOSED, N_WAVE, 0.42, eio3, () =>
        // Phase 2 — aplatissement (470ms → 750ms)
        tweenPath(N_WAVE, N_FULL, 0.28, eout2, null)
      )
    );

    // Phase 3 — liens en cascade
    allItems.forEach((el, i) =>
      after(580 + i * 90, () => {
        el.style.transition = "opacity .38s ease, transform .38s ease";
        el.style.opacity    = "1";
        el.style.transform  = "translateY(0)";
      })
    );

    after(580 + allItems.length * 90 + 400, () => { isBusy.current = false; });
  }, [killAll, after, tweenPath]);

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

    // Liens disparaissent
    const allItems = [...itemRefs.current.filter(Boolean)];
    if (footerRef.current) allItems.push(footerRef.current);
    allItems.forEach((el, i) => {
      el.style.transition = `opacity .20s ease ${i * 40}ms, transform .20s ease ${i * 40}ms`;
      el.style.opacity    = "0";
      el.style.transform  = "translateY(-24px)";
    });

    // Plein écran → vague → fermé
    after(220, () =>
      tweenPath(N_FULL, N_WAVE, 0.26, ein2, () =>
        tweenPath(N_WAVE, N_CLOSED, 0.38, eio3, () => {
          overlayRef.current.style.pointerEvents = "none";
          isBusy.current = false;
          onDone?.();
        })
      )
    );
  }, [killAll, after, tweenPath]);

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

      {/* ── Overlay plein écran ─────────────────────────────── */}
      <div
        ref={overlayRef}
        style={{ position: "fixed", inset: 0, zIndex: 600, pointerEvents: "none", overflow: "hidden" }}
      >
        {/* Forme SVG animée (fond noir liquide) */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
        >
          <path ref={pathRef} d={buildPath(N_CLOSED)} fill="#111111" />
        </svg>

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
