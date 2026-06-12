import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Styles partagés pour chaque path
const base = {
  stroke: "url(#or-fusion)",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  filter:
    "url(#fissure-organique) drop-shadow(0 0 2px #FFF0B3) drop-shadow(0 0 8px #D4AF37) drop-shadow(0 0 20px #AA7C11)",
};
const p1 = { ...base, strokeWidth: "2" };       // fissure principale
const p2 = { ...base, strokeWidth: "1.2" };     // branche secondaire
const p3 = { ...base, strokeWidth: "1.5" };     // branche intermédiaire

export default function KintsugiLayer() {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let rafId;
    let triggers = [];

    // Petit délai pour que le SVG soit bien rendu et getTotalLength() disponible
    const timerId = setTimeout(() => {
      const groups = svg.querySelectorAll("g[data-section]");

      groups.forEach((group) => {
        const idx = group.dataset.section;
        const sectionEl = document.querySelector(`section[data-index="${idx}"]`);
        if (!sectionEl) return;

        const paths = [...group.querySelectorAll("path")];

        paths.forEach((path, j) => {
          const len = path.getTotalLength();
          if (!len) return;
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

          const st = ScrollTrigger.create({
            trigger: sectionEl,
            start: "top 70%",
            end: "center 30%",
            onEnter: () =>
              gsap.to(path, {
                strokeDashoffset: 0,
                duration: 1.8 + j * 0.2,
                delay: j * 0.12,
                ease: "power2.inOut",
                overwrite: true,
              }),
            onLeaveBack: () =>
              gsap.to(path, {
                strokeDashoffset: len,
                duration: 0.8,
                ease: "power2.in",
                overwrite: true,
              }),
          });
          triggers.push(st);
        });
      });

      // Sync ScrollTrigger avec Lenis (Lenis dispatch des events scroll natifs)
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener("scroll", onScroll, { passive: true });
      triggers._cleanup = () => window.removeEventListener("scroll", onScroll);
    }, 250);

    return () => {
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
      triggers._cleanup?.();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: 0, left: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        zIndex: 10,
        overflow: "visible",
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 1440 2880"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          {/* ── Filtre de rugosité (fractal noise) ── */}
          <filter id="fissure-organique" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* ── Dégradé or kintsugi ── */}
          <linearGradient id="or-fusion" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#FFF0B3" />
            <stop offset="30%"  stopColor="#D4AF37" />
            <stop offset="70%"  stopColor="#AA7C11" />
            <stop offset="100%" stopColor="#593E1A" />
          </linearGradient>
        </defs>

        {/* ═══════════════════════════════════════════════
            SECTION 0 · CONVICTION  (y: 0 – 720)
            Texte à gauche → fissures côté droit + bords
        ═══════════════════════════════════════════════ */}
        <g data-section="0">
          {/* Fissure principale — diagonale gauche */}
          <path style={p1}
            d="M 165 28 C 188 115, 148 205, 215 295
               C 272 378, 232 458, 298 514
               C 342 558, 288 642, 328 720" />
          {/* Branche de la principale */}
          <path style={p2}
            d="M 215 295 C 168 314, 112 358, 92 412
               C 74 460, 96 500, 74 532" />
          {/* Fissure côté image (droite) */}
          <path style={p1}
            d="M 1112 76 C 1070 166, 1088 256, 1028 344
               C 986 390, 1006 430, 964 492
               C 946 526, 970 564, 944 612" />
          {/* Micro-branche droite */}
          <path style={p2}
            d="M 964 492 C 900 510, 860 542, 842 592
               C 826 636, 844 674, 822 712" />
          {/* Fine veine décorative coin haut-droit */}
          <path style={p3}
            d="M 1360 20 C 1340 80, 1355 140, 1320 200
               C 1295 248, 1310 290, 1280 340" />
        </g>

        {/* ═══════════════════════════════════════════════
            SECTION 1 · MISSION  (y: 720 – 1440)
            Texte à droite → fissures côté gauche
        ═══════════════════════════════════════════════ */}
        <g data-section="1">
          {/* Continuation de S0 main crack */}
          <path style={p1}
            d="M 328 720 C 364 804, 308 890, 370 970
               C 410 1027, 368 1110, 430 1188
               C 468 1241, 410 1324, 448 1440" />
          {/* Branche dans S1 */}
          <path style={p2}
            d="M 370 970 C 310 990, 248 1030, 208 1088
               C 174 1134, 186 1182, 154 1228" />
          {/* Fissure côté image (gauche S1) */}
          <path style={p1}
            d="M 944 720 C 924 810, 968 894, 930 974
               C 902 1030, 924 1114, 886 1190" />
          {/* Nouvelle fissure droite centrale */}
          <path style={p3}
            d="M 1215 850 C 1172 930, 1192 1010, 1150 1088
               C 1117 1148, 1138 1208, 1105 1270" />
          {/* Micro-fissure jonction S0-S1 */}
          <path style={p2}
            d="M 448 1440 C 420 1410, 400 1380, 420 1350" />
        </g>

        {/* ═══════════════════════════════════════════════
            SECTION 2 · VISION  (y: 1440 – 2160)
            Texte à gauche → fissures côté droit
        ═══════════════════════════════════════════════ */}
        <g data-section="2">
          {/* Continuation depuis S1 */}
          <path style={p1}
            d="M 448 1440 C 488 1524, 428 1608, 490 1688
               C 530 1745, 488 1828, 550 1928
               C 588 2006, 526 2088, 568 2160" />
          {/* Branche gauche */}
          <path style={p2}
            d="M 490 1688 C 428 1708, 368 1748, 325 1808
               C 292 1856, 304 1906, 274 1956" />
          {/* Nouvelle fissure bord gauche */}
          <path style={p3}
            d="M 120 1506 C 160 1588, 140 1668, 182 1748
               C 202 1804, 170 1884, 204 1964" />
          {/* Fissure côté image (droite S2) */}
          <path style={p1}
            d="M 1310 1528 C 1268 1610, 1288 1690, 1228 1770
               C 1185 1828, 1205 1888, 1165 1966" />
          {/* Micro-branche image */}
          <path style={p2}
            d="M 1165 1966 C 1120 1990, 1080 2025, 1060 2075" />
        </g>

        {/* ═══════════════════════════════════════════════
            SECTION 3 · AVENIR  (y: 2160 – 2880)
            Texte à droite → fissures côté gauche
        ═══════════════════════════════════════════════ */}
        <g data-section="3">
          {/* Continuation depuis S2 + convergence finale */}
          <path style={p1}
            d="M 568 2160 C 608 2244, 548 2328, 610 2428
               C 648 2508, 585 2608, 648 2728
               C 668 2784, 635 2844, 658 2880" />
          {/* Branche */}
          <path style={p2}
            d="M 610 2428 C 548 2448, 485 2492, 443 2548
               C 410 2595, 430 2648, 398 2708" />
          {/* Fissure côté image (gauche S3) */}
          <path style={p1}
            d="M 1105 2208 C 1065 2288, 1085 2368, 1025 2448
               C 985 2508, 1005 2588, 945 2668
               C 915 2725, 935 2785, 905 2848" />
          {/* Micro-branche finale */}
          <path style={p2}
            d="M 1025 2448 C 958 2465, 902 2502, 862 2552" />
          {/* Veine décorative coin bas */}
          <path style={p3}
            d="M 240 2820 C 280 2840, 320 2855, 370 2870
               C 410 2882, 450 2878, 490 2880" />
        </g>
      </svg>
    </div>
  );
}
