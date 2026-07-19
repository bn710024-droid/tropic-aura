import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lenis from "lenis";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";

// ============================================================
//  PRODUITS — « La Collection »
//  Galerie éditoriale premium : chaque produit est une œuvre.
//  Fruit DÉTOURÉ qui flotte (ombre douce, dépasse du cadre),
//  fond couleur + gradient subtil « ressenti », méta éditoriale.
//  Chaque produit = un chapitre : couleur, fruit, ambiance.
//  Mobile-first. Apparitions douces au scroll.
// ============================================================

export const PAGE_ENTRY_COLOR = { desktop: "#0E100E", mobile: "#0E100E" };

const SECTIONS = [
  {
    type: "intro", id: "cover", bg: "#0E100E",
    kicker: "LE SHOWROOM", title: "La Collection.",
    text: "Une sélection tropicale d'exception, présentée comme une exposition. Chaque produit est choisi pour sa qualité, sa régularité et sa capacité à répondre aux marchés les plus exigeants.",
  },

  // ── Signature ──
  {
    type: "product", id: "mangue", side: "left", bg: "#5E2A12",
    png: "/png/prod-mangue.webp", collection: "SIGNATURE", num: "01", name: "Mangue Kent",
    desc: "Chair peu fibreuse, excellente tenue après récolte et forte appréciation des marchés européens. Une référence incontournable pour les programmes export premium.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Juin – Mi-août", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "avocat", side: "right", bg: "#1C3326",
    png: "/png/prod-avocat.webp", collection: "SIGNATURE", num: "02", name: "Avocat",
    desc: "Maturation maîtrisée, texture crémeuse et qualité régulière. Sélectionné pour répondre aux exigences des chaînes d'approvisionnement internationales.",
    meta: { "Origine": "Afrique de l'Ouest", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "ananas", side: "left", bg: "#6B5214",
    png: "/png/prod-ananas.webp", collection: "SIGNATURE", num: "03", name: "Ananas",
    desc: "Chair juteuse, profil aromatique intense et présentation soignée. Un produit tropical reconnu pour sa valeur ajoutée sur les marchés premium.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "papaye", side: "right", bg: "#7A3514",
    png: "/png/prod-papaye.webp", collection: "SIGNATURE", num: "04", name: "Papaye",
    desc: "Couleur éclatante, saveur équilibrée et qualité constante. Une référence tropicale adaptée aux circuits spécialisés et aux marchés exigeants.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "banane", side: "left", bg: "#0E2418",
    png: "/png/prod-banane.webp", collection: "SIGNATURE", num: "05", name: "Banane",
    desc: "Régularité des volumes, qualité homogène et gestion maîtrisée de la maturité. Un produit essentiel du commerce international.",
    meta: { "Origine": "Afrique tropicale", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },

  // ── Saison ──
  {
    type: "product", id: "melon", side: "right", bg: "#2A1208", shadow: "drop-shadow(0 18px 28px rgba(0,0,0,0.28))",
    png: "/png/prod-melon.webp", collection: "SAISON", num: "06", name: "Melon",
    desc: "Chair fondante, sucre équilibré et récolte au meilleur stade de maturité. Une spécialité saisonnière recherchée pour sa fraîcheur.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Janvier – Fin avril", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "pasteque", side: "left", bg: "#5A2630",
    png: "/png/prod-pasteque.webp", collection: "SAISON", num: "07", name: "Pastèque",
    desc: "Texture croquante, forte teneur en eau et qualité visuelle remarquable. Une référence estivale appréciée pour sa fraîcheur naturelle.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Janvier – Fin avril", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "citron-vert", side: "right", bg: "#36511E",
    png: "/png/prod-citron-vert.webp", collection: "SAISON", num: "08", name: "Citron vert",
    desc: "Arômes intenses, acidité vive et excellente polyvalence. Une référence incontournable pour la restauration et l'industrie agroalimentaire.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Toute l'année (Pic: Septembre – Décembre)", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "citron-jaune", side: "left", bg: "#6B5A14",
    png: "/png/prod-citron-jaune.webp", collection: "SAISON", num: "09", name: "Citron jaune",
    desc: "Équilibre aromatique, fraîcheur constante et présentation soignée. Adapté aux marchés recherchant qualité et régularité.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Toute l'année (Pic: Septembre – Décembre)", "Standard": "Export Premium" },
  },

  // ── Spécialités ──
  {
    type: "product", id: "gombo", side: "right", bg: "#243318",
    png: "/png/prod-gombo.webp", collection: "SPÉCIALITÉS", num: "10", name: "Gombo",
    desc: "Récolté avec soin pour préserver sa fraîcheur et sa tendreté. Une spécialité maraîchère appréciée sur de nombreux marchés internationaux.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Toute l'année", "Standard": "Export Premium" },
  },
  {
    type: "product", id: "piment", side: "left", bg: "#2E4A1C",
    png: "/png/prod-piment.webp", collection: "SPÉCIALITÉS", num: "11", name: "Piments",
    desc: "Un assortiment de couleurs et de variétés — doux ou forts, selon les besoins. Fraîcheur maîtrisée et sélection rigoureuse pour des marchés à forte demande.",
    meta: { "Origine": "Sénégal", "Disponibilité": "Mars – Août", "Standard": "Export Premium" },
  },

  // ── Besoin spécifique ──
  {
    type: "besoin", id: "besoin", bg: "#080F0A",
    png: "/multifruits.png",
  },
];

const hexToRgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const COLORS = SECTIONS.map((s) => hexToRgb(s.bg));

// Mémoire de scroll : conserve la position quittée pour qu'un retour depuis
// une fiche produit (« En savoir plus » → retour) reprenne où l'utilisateur
// s'était arrêté, plutôt que de repartir du hero. sessionStorage plutôt qu'un
// state React : survit au démontage complet du composant entre deux visites.
const SCROLL_MEMORY_KEY = "scrollpos:/produits";

// ============================================================
export default function Produits() {
  const navigate    = useNavigate();
  const bgRef       = useRef(null);
  const contentRefs = useRef([]);
  const photoRefs   = useRef([]);  // .prod-photo par section — point de départ du morph "En savoir plus"
  const dotRefs     = useRef([]);
  const lenisRef    = useRef(null);
  const wrapperRef  = useRef(null);  // wrapper de scroll dédié mobile (html/body figés) — même pattern que Home.jsx : évite la danse de la barre d'URL iOS qui faisait "lutter" le scroll en remontant
  const secHRef     = useRef(0);   // hauteur RÉELLE d'une section (= CSS 100vh, stable)
  const [morphTarget, setMorphTarget] = useState(null);

  // "Entrer dans le fruit" : au clic sur En savoir plus, l'image du produit
  // grossit en un voile plein écran (couleur de fond du produit) avant la
  // navigation — même mécanisme que le CTA de Home.jsx (.cta-morph), réutilisé
  // tel quel plutôt que ré-inventé. prefers-reduced-motion : nav immédiate.
  const handleMoreClick = (e, i, href) => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return; // laisse le <Link> naviguer normalement
    e.preventDefault();
    const photoEl = photoRefs.current[i];
    const rect = (photoEl || e.currentTarget).getBoundingClientRect();
    setMorphTarget({ top: rect.top, left: rect.left, width: rect.width, height: rect.height, color: SECTIONS[i].bg });
    setTimeout(() => navigate(href), 190);
  };

  useEffect(() => {
    // Lenis (smooth-scroll) DESKTOP UNIQUEMENT. Sur mobile tactile, Lenis fait
    // "sauter" au changement de direction (retour vers le haut) → on garde le
    // scroll natif iOS, lu via window.scrollY dans la boucle rAF.
    const isDesktop = window.matchMedia('(min-width: 769px)').matches;
    const lenis = isDesktop ? new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    }) : null;
    lenisRef.current = lenis;

    let rafId;
    const lerp     = (a, b, t) => Math.round(a + (b - a) * t);
    const last     = SECTIONS.length - 1;
    let lastScroll = -99999;

    // Révélation du texte par IntersectionObserver — apparition fiable quand la
    // section entre réellement dans le viewport (immunisée contre la dérive de
    // la barre d'URL mobile qui faisait sauter les titres). Une fois révélée,
    // la section reste figée (on cesse de l'observer) → aucune ré-animation.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "none";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -12% 0px" });
    contentRefs.current.forEach((el) => el && io.observe(el));

    // Hauteur RÉELLE d'une section = celle utilisée par la mise en page (.scene à
    // 100vh). Sur un vrai mobile, window.innerHeight (viewport VISUEL) rétrécit
    // quand la barre d'URL est visible, alors que 100vh (viewport LARGE) reste
    // fixe → l'écart s'accumule section après section et le moteur révèle la
    // MAUVAISE scène (images qui se chevauchent). On mesure donc un .scene réel.
    const measureH = () => {
      const sc = document.querySelector('.scene');
      const h = sc ? sc.getBoundingClientRect().height : 0;
      return h > 0 ? h : (window.innerHeight || 1);
    };
    let secH = measureH();
    secHRef.current = secH;
    const onResize = () => { secH = measureH(); secHRef.current = secH; lastScroll = -99999; };
    window.addEventListener("resize", onResize, { passive: true });

    const update = (scroll, H) => {
      const prog = scroll / H;
      const ci   = Math.min(last, Math.floor(prog));
      const ft   = Math.min(1, Math.max(0, prog - ci));
      const ca   = COLORS[ci];
      const cb   = COLORS[Math.min(last, ci + 1)];
      if (bgRef.current) {
        bgRef.current.style.backgroundColor =
          `rgb(${lerp(ca[0],cb[0],ft)},${lerp(ca[1],cb[1],ft)},${lerp(ca[2],cb[2],ft)})`;
      }

      // La RÉVÉLATION du texte n'est plus pilotée par la position de scroll ici :
      // sur mobile, ce calcul dérivait avec la barre d'URL (viewport visuel vs
      // 100vh) et pouvait faire "sauter" un titre. Elle est désormais gérée par
      // un IntersectionObserver (voir plus bas) — apparition fiable, composée par
      // le GPU via une transition CSS, indépendante de tout calcul de scroll.
      // Les dots de navigation sont DESKTOP UNIQUEMENT (display:none sur mobile) :
      // on saute entièrement leurs écritures de style sur mobile (!lenis) → plus
      // aucun calcul/écriture inutile sur 13 éléments cachés à chaque frame de scroll.
      if (!lenis) return;
      const active = Math.min(last, Math.max(0, Math.round(scroll / H)));
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        const on = j === active;
        dot.style.width      = on ? "9px" : "6px";
        dot.style.height     = on ? "9px" : "6px";
        dot.style.background = on ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.32)";
        dot.style.boxShadow  = on ? "0 0 0 2px rgba(255,255,255,0.18)" : "none";
      });
    };

    // Lecture du scroll : desktop = Lenis ; mobile = le WRAPPER dédié (html/body
    // figés overflow:hidden → window.scrollY resterait bloqué à 0). Même pattern
    // que Home.jsx. C'est le cœur du correctif "scroll qui lutte en remontant" :
    // scroller un conteneur interne garde la barre d'URL iOS stable (pas de
    // reflow dvh à chaque frame), au lieu de scroller le body.
    const readScroll = () => {
      if (lenis) {
        const s = lenis.animatedScroll;
        return Number.isFinite(s) ? s : (window.scrollY || 0);
      }
      const w = wrapperRef.current;
      if (w && w.scrollHeight > w.clientHeight) return w.scrollTop;
      return window.scrollY || 0;
    };

    // DESKTOP : boucle rAF qui pilote Lenis + le fondu de couleur.
    const raf = (time) => {
      lenis.raf(time);
      const scroll = readScroll();
      if (Math.abs(scroll - lastScroll) > 0.04) { lastScroll = scroll; update(scroll, secH); }
      rafId = requestAnimationFrame(raf);
    };

    // MOBILE : l'événement 'scroll' du wrapper déclenche, mais les écritures de
    // style sont COALESCÉES dans un seul rAF par frame (calé sur le paint) — pas
    // de boucle rAF permanente qui tourne dans le vide au repos. Fonction pure
    // du scroll → rien ne bouge quand le doigt ne bouge pas.
    let scrollRafId = 0;
    const onWrapperScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        const scroll = readScroll();
        if (Math.abs(scroll - lastScroll) > 0.04) { lastScroll = scroll; update(scroll, secH); }
      });
    };
    const wrapperEl = wrapperRef.current;

    // Restauration : priorité au saut ?section=<slug> explicite (lien de menu),
    // sinon on reprend la position quittée si elle existe.
    const hasSectionParam = new URLSearchParams(window.location.search).has("section");
    const savedY = !hasSectionParam ? Number(sessionStorage.getItem(SCROLL_MEMORY_KEY)) : 0;
    if (savedY > 0) {
      if (lenis) lenis.scrollTo(savedY, { immediate: true });
      else if (wrapperEl) wrapperEl.scrollTop = savedY;
      else window.scrollTo(0, savedY);
      lastScroll = savedY;
      update(savedY, secH);
    } else {
      update(0, secH);
    }

    if (lenis) {
      rafId = requestAnimationFrame(raf);
    } else if (wrapperEl) {
      wrapperEl.addEventListener('scroll', onWrapperScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (wrapperEl) wrapperEl.removeEventListener('scroll', onWrapperScroll);
      sessionStorage.setItem(SCROLL_MEMORY_KEY, String(readScroll()));
      if (lenis) lenis.destroy();
    };
  }, []);

  const scrollTo = (i) => {
    const H = secHRef.current || window.innerHeight;
    if (lenisRef.current) return lenisRef.current.scrollTo(i * H, { duration: 1.2 });
    // Mobile : c'est le wrapper qui scrolle (body figé) → viser son scrollTop.
    const w = wrapperRef.current;
    if (w && w.scrollHeight > w.clientHeight) { w.scrollTo({ top: i * H, behavior: "smooth" }); return; }
    window.scrollTo({ top: i * H, behavior: "smooth" });
  };

  // Saut direct vers une collection via ?section=<slug> (déclenché par les
  // sous-liens du menu, ex. /produits?section=saison) — saute au premier
  // produit de la collection. Même tree pour desktop/mobile → scrollTo
  // fonctionne dans les deux cas, pas besoin de branchement par device.
  useEffect(() => {
    const target = new URLSearchParams(window.location.search).get("section");
    if (!target) return;
    const COLLECTION = { signature: "SIGNATURE", saison: "SAISON", specialites: "SPÉCIALITÉS" };
    const wanted = COLLECTION[target];
    if (!wanted) return;
    const idx = SECTIONS.findIndex((s) => s.collection === wanted);
    if (idx < 0) return;
    const t = setTimeout(() => scrollTo(idx), 80);
    return () => clearTimeout(t);
  }, []);

  const produitsDescription =
    "La collection Tropicaura : mangues, avocats, ananas, agrumes et légumes frais d'Afrique de l'Ouest, sélectionnés pour l'export B2B premium vers l'Europe et au-delà.";
  const produitsTrail = buildBreadcrumbTrail("/produits");

  return (
    <>
      <SEOHead
        title="Nos Produits — Fruits & Légumes Export Premium"
        description={produitsDescription}
        path="/produits"
        keywords={["mangue export", "avocat export", "ananas export", "citron vert export", "gombo export", "fruits tropicaux B2B"]}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: "/produits", title: "Produits", description: produitsDescription, breadcrumb: true }),
          breadcrumbListSchema(produitsTrail, "/produits"),
        ]}
      />
      <style>{`
        .ct-grid  { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(40px,7vw,110px); }
        @keyframes prodFloat { 0%,100%{ transform: translateY(0); } 50%{ transform: translateY(-16px); } }
        .prod-float { animation: prodFloat 7s ease-in-out infinite; }
        .prod-row { display:flex; align-items:center; gap:clamp(24px,5vw,80px); width:100%; max-width:1280px; padding:0 clamp(28px,7vw,110px); }
        .prod-photo { width:46%; height:72vh; max-height:720px; flex-shrink:0; position:relative; display:flex; align-items:center; justify-content:center; overflow:visible; }
        .prod-name  { font-size: clamp(34px, 4.4vw, 68px); }
        .prod-more {
          display: inline-flex; align-items: center; gap: 10px;
          margin-top: 28px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: .16em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
          text-decoration: none;
          border-bottom: 1px solid rgba(255,255,255,0.28);
          padding-bottom: 7px;
          transition: color .25s ease, border-color .25s ease;
        }
        .prod-more:hover { color: #fff; border-color: rgba(255,255,255,0.75); }
        .prod-more-arrow { display: inline-block; transition: transform .3s cubic-bezier(.22,1,.36,1); }
        .prod-more:hover .prod-more-arrow { transform: translateX(5px); }
        @media (max-width: 820px){
          .prod-row   { flex-direction: column !important; gap: 18px !important; padding: 96px clamp(22px,7vw,40px) 60px !important; justify-content:center !important; }
          /* Image en dvh (pas vh) : la section fait 100dvh (zone visible réelle),
             donc l'image doit se mesurer sur la MÊME base, sinon elle est trop
             haute (36vh = 36% du viewport LARGE) et pousse le texte hors écran
             → titre/méta coupés. 32dvh garde tout le bloc dans un écran. */
          .prod-photo { width: 100% !important; height: 32dvh !important; }
          .prod-text  { width: 100% !important; }
          .prod-name  { font-size: clamp(34px, 11vw, 52px) !important; }
          .prod-meta  { gap: 18px 30px !important; }
          /* MOBILE : on coupe le flottement (transform animé + drop-shadow =
             re-rasterisation à chaque frame → micro-sauts au scroll sur iOS).
             filter:drop-shadow() sur un fond CSS à canal alpha est en plus un
             bug de rendu documenté sur Android Chrome (le compositeur
             rastérise mal la transparence : le fruit apparaît sur un bloc
             opaque au lieu d'être détouré) — supprimé entièrement sur mobile
             plutôt qu'allégé, pour les deux plateformes à la fois. */
          .prod-float { animation: none !important; filter: none !important; }
        }
        @media (prefers-reduced-motion: reduce){ .prod-float { animation: none !important; } }
      `}</style>

      <TopBar />
      <img src="/logo-mark.png" alt="Tropicaura — Collection de fruits et légumes d'export premium" width={512} height={512} style={{ display: "none" }} />
      <Breadcrumbs trail={produitsTrail} />

      {/* Fond interpolé + éclairage Combilo (halo central + vignette, soft-light) */}
      <div className="bg-layer" ref={bgRef} style={{ backgroundColor: SECTIONS[0].bg }} />
      <div className="bg-depth" />

      {/* Nav dots — desktop uniquement (voir .dots-nav dans global.css) */}
      <nav className="dots-nav" aria-label="Navigation par produit" style={{
        position: "fixed", right: "clamp(14px,2vw,28px)", top: "50%",
        transform: "translateY(-50%)", zIndex: 150,
        display: "flex", flexDirection: "column", gap: 12, pointerEvents: "auto",
      }}>
        {SECTIONS.map((s, i) => (
          <button key={s.id} ref={(el) => (dotRefs.current[i] = el)} onClick={() => scrollTo(i)} title={s.name || s.title}
            aria-label={`Aller à ${s.name || s.title}`}
            style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.32)", border: "none", cursor: "pointer", padding: 0, transition: "width .25s, height .25s, background .25s, box-shadow .25s", display: "block" }} />
        ))}
      </nav>

      {/* Scènes — enveloppées dans le wrapper de scroll dédié : sur mobile c'est
          CE conteneur qui défile (html/body figés), pas le body natif → la barre
          d'URL iOS reste stable, plus de reflow dvh à chaque frame, le scroll ne
          "lutte" plus en remontant. display:contents sur desktop (no-op, Lenis
          inchangé). .bg-layer / .bg-depth / dots / morph restent HORS du wrapper
          (siblings fixes) pour rester ancrés au viewport stable. */}
      <div className="mobile-scroll-wrapper" ref={wrapperRef}>
      {SECTIONS.map((s, i) => {
        if (s.type === "besoin") {
          return (
            <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
              <div
                ref={(el) => (contentRefs.current[i] = el)}
                className="prod-row"
                style={{ opacity: 0, transform: "translateY(30px)", flexDirection: "row", transition: "opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1)" }}
              >
                {/* Image flottante */}
                <div className="prod-photo">
                  <div
                    className="prod-float"
                    role="img"
                    aria-label="Assortiment de fruits"
                    style={{
                      position: "relative", zIndex: 1,
                      width: "112%", height: "100%",
                      backgroundImage: `url("${s.png}")`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      filter: "drop-shadow(0 30px 44px rgba(0,0,0,0.44))",
                      animationDelay: "-1.2s",
                    }}
                  />
                </div>

                {/* Texte */}
                <div className="prod-text" style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: ".30em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 20,
                  }}>
                    Besoin Spécifique
                  </span>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800,
                    fontSize: "clamp(26px,3.2vw,46px)", lineHeight: 1.08,
                    letterSpacing: "-.03em", color: "#fff", margin: "0 0 20px", maxWidth: 500,
                  }}>
                    Vous recherchez un produit qui ne figure pas dans notre collection ?
                  </h2>
                  <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.5)", margin: "0 0 24px", borderRadius: 2 }} />
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.78,
                    color: "rgba(255,255,255,0.78)", margin: "0 0 16px", maxWidth: 480,
                  }}>
                    Grâce à notre réseau de producteurs et de partenaires agricoles en Afrique de l'Ouest, nous pouvons accompagner des demandes spécifiques selon vos besoins.
                  </p>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(14px,1.2vw,16px)", lineHeight: 1.78,
                    color: "rgba(255,255,255,0.78)", margin: "0 0 28px", maxWidth: 480,
                  }}>
                    Produit particulier, programme saisonnier ou sourcing sur mesure : nous étudions chaque projet avec attention afin d'identifier la solution la plus adaptée à votre marché.
                  </p>
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: "clamp(14px,1.15vw,16px)", fontWeight: 700,
                    color: "#fff", margin: "0 0 36px", letterSpacing: "-.01em",
                  }}>
                    Produit spécifique. Solution sur mesure.
                  </p>
                  <button className="scene__cta" onClick={() => window.location.href = "/contact"}>
                    <span className="cta-label">Discutons de votre projet</span>
                    <span className="cta-arrow"><span>→</span></span>
                  </button>
                </div>
              </div>
            </section>
          );
        }

        if (s.type === "intro") {
          return (
            <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
              <div ref={(el) => (contentRefs.current[i] = el)} style={{ opacity: 1, textAlign: "center", maxWidth: "min(760px,86vw)", padding: "0 clamp(24px,6vw,60px)" }}>
                <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: ".30em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 22 }}>{s.kicker}</span>
                <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "clamp(44px, 7vw, 92px)", lineHeight: 1.02, letterSpacing: "-.04em", color: "#fff", margin: "0 0 22px" }}>{s.title}</h1>
                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.3vw,16px)", lineHeight: 1.8, color: "rgba(255,255,255,0.80)", margin: "0 auto", maxWidth: 580 }}>{s.text}</p>
                <div className="scene__hint" style={{ marginTop: 40 }}><i /><span>Défilez vers le bas</span></div>
              </div>
            </section>
          );
        }

        const isRight = s.side === "right";
        return (
          <section key={s.id} className="scene" style={{ justifyContent: "center" }}>
            <div
              ref={(el) => (contentRefs.current[i] = el)}
              className="prod-row"
              style={{ opacity: i === 0 ? 1 : 0, transform: "translateY(30px)", flexDirection: isRight ? "row-reverse" : "row", transition: "opacity .7s ease, transform .7s cubic-bezier(.22,1,.36,1)" }}
            >
              {/* Fruit détouré flottant (dépasse du cadre, ombre douce) */}
              <div className="prod-photo" ref={(el) => (photoRefs.current[i] = el)}>
                {/* Halo lumineux (couleur du fond photo) → masque le halo de détourage */}
                {s.glow && (
                  <div aria-hidden="true" style={{
                    position: "absolute", inset: "2% 4%", zIndex: 0, pointerEvents: "none",
                    background: `radial-gradient(closest-side, ${s.glow}E6 0%, ${s.glow}99 44%, ${s.glow}00 78%)`,
                    filter: "blur(6px)",
                  }} />
                )}
                {/* Fond CSS (pas un <img>) → pas de bouton "recherche visuelle" du navigateur */}
                <div
                  className="prod-float"
                  role="img"
                  aria-label={s.name}
                  style={{
                    position: "relative", zIndex: 1,
                    width: "112%", height: "100%",
                    backgroundImage: `url("${s.png}")`,
                    backgroundSize: "contain",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    filter: s.shadow || "drop-shadow(0 36px 46px rgba(0,0,0,0.48))",
                    animationDelay: `${(i % 3) * -1.6}s`,
                  }}
                />
              </div>

              {/* Texte éditorial */}
              <div className="prod-text" style={{ flex: 1, minWidth: 0 }}>
                <h2 className="prod-name" style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-.03em", color: "#fff", margin: "0 0 18px", textShadow: "0 4px 30px rgba(0,0,0,0.30)" }}>{s.name}</h2>

                <div style={{ width: 36, height: 2, background: "rgba(255,255,255,0.5)", margin: "0 0 22px", borderRadius: 2 }} />

                <p style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.25vw,16px)", lineHeight: 1.78, fontWeight: 400, color: "rgba(255,255,255,0.86)", margin: "0 0 30px", maxWidth: 480 }}>{s.desc}</p>

                {/* Méta éditoriale : label / valeur */}
                <div className="prod-meta" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,2.6vw,46px)" }}>
                  {Object.entries(s.meta).map(([k, v]) => (
                    <div key={k}>
                      <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", marginBottom: 7 }}>{k}</span>
                      <span style={{ display: "block", fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "clamp(14px,1.15vw,16px)", fontWeight: 500, color: "rgba(255,255,255,0.92)" }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Maillage interne : fiche produit SEO dédiée (/produits/:slug).
                    onClick joue le morph puis navigue — le <a href> reste intact
                    (React Router Link), aucun impact sur le crawl/SEO. */}
                <Link
                  to={`/produits/${s.id}`}
                  aria-label={`Voir la fiche complète de ${s.name}`}
                  className="prod-more"
                  onClick={(e) => handleMoreClick(e, i, `/produits/${s.id}`)}
                >
                  En savoir plus <span className="prod-more-arrow" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        );
      })}
      </div>

      {/* Voile de morph "En savoir plus" — même mécanisme que le CTA de Home.jsx */}
      {morphTarget && (
        <div
          className="cta-morph"
          style={{
            top: morphTarget.top,
            left: morphTarget.left,
            width: morphTarget.width,
            height: morphTarget.height,
            backgroundColor: morphTarget.color,
          }}
        />
      )}
    </>
  );
}
