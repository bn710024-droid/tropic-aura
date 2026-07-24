import { useRef, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import Footer from "../components/Footer";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema, productSchema, faqPageSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";
import { getProductBySlug, getRelatedProducts, getTransportText, PRODUCT_SHARED } from "../data/productsData";
import { EXPORT_MARKETS } from "../seo/siteConfig";

const FONT = "'Plus Jakarta Sans',sans-serif";
const GOLD = "#E8C878"; // couleur d'accent par défaut, produits sans thème dédié (bgImage/accentColor)

const hexToRgba = (hex, alpha) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
};

// Petit repère devant les titres de section — guide le regard (cf. brief). Couleur
// pilotée par product.accentColor (thème par produit : or/mangue, vert/avocat...).
const accentBar = (color) => ({ display: "inline-block", width: 26, height: 2, background: color, marginRight: 14, verticalAlign: "middle", borderRadius: 2 });
// État initial commun avant l'apparition au scroll — pas de boîte ni de flou,
// le contenu flotte directement sur le fond, comme le hero (retour utilisateur :
// le "bandeau" en verre cassait l'effet fluide voulu).
const sectionReveal = { opacity: 0, transform: "translateY(24px)", transition: "opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1)" };

// ============================================================
//  <ProductDetail /> — page produit SEO dédiée : /produits/:slug
//
//  Objectif SEO : H1 unique, meta description unique, données
//  structurées Product + Offer + FAQPage + BreadcrumbList, HTML
//  sémantique (main > article > section), maillage interne vers
//  les autres produits et vers Contact.
//
//  Esthétique : reprend la palette et la typographie déjà
//  établies par la vitrine scrollée (Produits.jsx) pour rester
//  visuellement cohérente, sans dupliquer son moteur d'animation
//  scroll-driven (page statique, indexable, pas de scroll-jacking).
// ============================================================
export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug);
  const ctaRef = useRef(null);
  const revealRefs = useRef([]);
  const reveal = (el) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // Apparition douce des sections au scroll (opacity + translateY, sans boîte
  // ni flou — le contenu flotte directement sur le fond, comme le hero).
  useEffect(() => {
    if (!product) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [product?.slug]);

  // Couleur au rebond (rubber-band iOS) — voir global.css, body:has(.mobile-scroll-wrapper).
  // Sans ça, ces pages héritaient du vert du hero Home (fallback codé en dur
  // côté CSS) au lieu de la couleur réelle du produit affiché.
  useEffect(() => {
    if (!product) return;
    document.documentElement.style.setProperty("--page-entry-color", product.bg);
    return () => document.documentElement.style.removeProperty("--page-entry-color");
  }, [product?.bg]);

  if (!product) return <Navigate to="/produits" replace />;

  // Effet magnétique : le CTA suit légèrement le curseur (max ~10px),
  // grossit au survol, se compresse au clic — cf. cahier des charges
  // "attire le curseur sans distraire". Transform piloté en impératif
  // (ref + style direct) plutôt qu'en state, même logique que LiquidMenu.
  const handleCtaMove = (e) => {
    const el = ctaRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const relX = e.clientX - r.left - r.width / 2;
    const relY = e.clientY - r.top - r.height / 2;
    const pullX = Math.max(-10, Math.min(10, relX * 0.3));
    const pullY = Math.max(-10, Math.min(10, relY * 0.3));
    el.style.transform = `translate(${pullX}px, ${pullY - 2}px) scale(1.02)`;
  };
  const handleCtaLeave = () => {
    if (ctaRef.current) ctaRef.current.style.transform = "translate(0,0) scale(1)";
  };
  const handleCtaDown = () => {
    if (ctaRef.current) ctaRef.current.style.transform = "translate(0,0) scale(0.95)";
  };
  const handleCtaUp = () => {
    if (ctaRef.current) ctaRef.current.style.transform = "translate(0,0) scale(1.02)";
  };

  const path = `/produits/${product.slug}`;
  const accentColor = product.accentColor || GOLD;
  // Multiplicateur d'opacité des overlays, réglé par photo : les fonds très
  // clairs (agrumes, ananas) ont besoin de plus de contraste, ceux déjà
  // sombres du bon côté (gombo, piment) un peu moins. Voir productsData.js.
  const overlayIntensity = product.bgOverlayIntensity || 1;
  const ov = (base) => Math.min(0.92, base * overlayIntensity);
  const related = getRelatedProducts(product.slug, 3);
  const trail = buildBreadcrumbTrail(path);
  const description = `${product.name} (${product.englishName}) — ${product.description} Origine : ${product.origin}. Disponibilité : ${product.availability}. Incoterms : ${PRODUCT_SHARED.incoterms.join(", ")}.`.slice(0, 300);

  const specs = [
    { label: "Nom commercial", value: `${product.name} (${product.englishName})` },
    { label: "Collection", value: product.collection.charAt(0) + product.collection.slice(1).toLowerCase() },
    { label: "Origine", value: product.origin },
    { label: "Disponibilité", value: product.availability },
    { label: "Standard", value: product.standard },
    { label: "Certification", value: PRODUCT_SHARED.certification },
  ];

  // Pas d'image OG dédiée par produit : les PNG détourés (fond transparent)
  // rendraient mal en aperçu social (Facebook/LinkedIn composent sur fond
  // noir/blanc selon le thème). SEOHead retombe donc sur DEFAULT_OG_IMAGE
  // (photo réelle 1200x630) — le schema Product JSON-LD ci-dessous
  // référence lui la vraie image du produit, contexte plus approprié pour
  // un visuel détouré.
  return (
    <>
      <SEOHead
        title={`${product.name} — Export B2B ${product.englishName}`}
        description={description}
        path={path}
        keywords={[product.name, product.englishName, "export", "Sénégal", "Afrique de l'Ouest", "B2B", product.collection.toLowerCase()]}
        type="product"
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path, title: product.name, description, breadcrumb: true }),
          breadcrumbListSchema(trail, path),
          productSchema(product, PRODUCT_SHARED.incoterms),
          faqPageSchema(PRODUCT_SHARED.faq),
        ]}
      />

      <TopBar />
      <Breadcrumbs trail={trail} />

      {/* ── Fond immersif "à l'intérieur du fruit" — seulement si une photo
          existe pour ce produit (voir bgImage dans productsData.js). Couche
          fixe (position:fixed, pas background-attachment:fixed — cassé sur
          Safari iOS) : reste ancrée à l'écran pendant que le contenu défile
          par-dessus, même technique que .bg-layer sur Home/Produits. ── */}
      {product.bgImage && (
        <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", background: product.bg }}>
          <style>{`
            @keyframes fruitBreathe {
              0%, 100% { transform: scale(1) translate(0, 0); }
              50% { transform: scale(1.03) translate(-1%, 0.5%); }
            }
            .fruit-bg-img {
              width: 100%; height: 100%; object-fit: cover;
              animation: fruitBreathe 28s ease-in-out infinite;
              will-change: transform;
            }
            @media (prefers-reduced-motion: reduce) {
              .fruit-bg-img { animation: none; }
            }
          `}</style>
          <picture>
            <source media="(max-width: 768px)" srcSet={product.bgImage.mobile.webp} type="image/webp" />
            <source media="(max-width: 768px)" srcSet={product.bgImage.mobile.jpg} type="image/jpeg" />
            <source srcSet={product.bgImage.desktop.webp} type="image/webp" />
            <img
              className="fruit-bg-img"
              src={product.bgImage.desktop.jpg}
              alt=""
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </picture>
          {/* Assombrit la DROITE — c'est là que le texte du hero est réellement
              positionné (colonne texte après la colonne image, voir plus bas) ;
              l'ancienne version assombrissait la gauche par erreur. */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(270deg, rgba(0,0,0,${ov(0.74)}) 0%, rgba(0,0,0,${ov(0.38)}) 45%, transparent 75%)` }} />
          {/* Plus sombre en haut/bas, guide le regard vers le centre */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(0,0,0,${ov(0.55)}) 0%, rgba(0,0,0,${ov(0.12)}) 35%, rgba(0,0,0,${ov(0.15)}) 65%, rgba(9,15,10,${ov(0.55)}) 100%)` }} />
        </div>
      )}

      {/* ── Wrapper de scroll dédié mobile — même pattern que Home/Produits (voir
          global.css) : sur iOS Safari, cette page n'avait jamais reçu ce
          traitement, ce qui laissait le calque de fond (position:fixed
          ci-dessus) ambigu vis-à-vis du scroller racine WebKit → il se
          décalait visiblement pendant le scroll et le rubber-band en haut de
          page. Desktop : display:contents (no-op total). ── */}
      <div className="mobile-scroll-wrapper">
      <main style={{ background: product.bgImage ? "transparent" : product.bg, minHeight: "100vh", position: "relative", zIndex: 1 }}>
        <article>
          {/* ── Hero produit ── */}
          <section
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "clamp(32px,5vw,80px)",
              maxWidth: 1280,
              margin: "0 auto",
              padding: "clamp(120px,18vh,180px) clamp(24px,7vw,110px) clamp(60px,8vh,100px)",
            }}
          >
            <div style={{ flex: "1 1 340px", display: "flex", justifyContent: "center" }}>
              <img
                src={product.image}
                alt={`${product.name} (${product.englishName}) — export premium Tropicaura`}
                width={product.width}
                height={product.height}
                loading="eager"
                fetchpriority="high"
                decoding="async"
                style={{
                  width: "min(100%, 380px)",
                  height: "auto",
                  filter: "drop-shadow(0 36px 46px rgba(0,0,0,0.48))",
                }}
              />
            </div>

            <div style={{ flex: "1 1 420px", minWidth: 0, maxWidth: 680 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".30em",
                  textTransform: "uppercase",
                  color: product.bgImage ? accentColor : "rgba(255,255,255,0.55)",
                  marginBottom: 18,
                }}
              >
                {product.collection} · N°{product.num}
              </span>

              <h1
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: product.bgImage ? "clamp(40px,6.2vw,78px)" : "clamp(36px,5vw,64px)",
                  lineHeight: 1.04,
                  letterSpacing: "-.03em",
                  color: "#fff",
                  margin: "0 0 8px",
                  textShadow: product.bgImage ? `0 8px 40px rgba(0,0,0,0.6), 0 0 46px ${hexToRgba(accentColor, 0.22)}` : "none",
                }}
              >
                {product.name}
              </h1>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.5)",
                  margin: "0 0 24px",
                }}
              >
                {product.englishName}
              </p>

              <p
                style={{
                  fontFamily: FONT,
                  fontSize: "clamp(15px,1.3vw,17px)",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.86)",
                  margin: "0 0 32px",
                  maxWidth: 520,
                }}
              >
                {product.description}
              </p>

              <style>{`
                .cta-shine {
                  position: absolute; top: 0; left: -60%;
                  width: 40%; height: 100%;
                  background: linear-gradient(120deg, transparent, ${hexToRgba(accentColor, 0.45)}, transparent);
                  transform: skewX(-20deg);
                  transition: left .55s ease;
                  pointer-events: none;
                }
                .cta-magnetic:hover .cta-shine { left: 140%; }
                .cta-arrow { display: inline-block; transition: transform .3s cubic-bezier(.22,1,.36,1); }
                .cta-magnetic:hover .cta-arrow { transform: translateX(5px); }
                .cta-magnetic {
                  box-shadow: 0 0 0 ${hexToRgba(accentColor, 0)}, 0 0 0 1px rgba(255,255,255,0.12);
                  transition: transform .18s ease-out, box-shadow .3s ease;
                }
                .cta-magnetic:hover {
                  box-shadow: 0 10px 34px ${hexToRgba(accentColor, 0.32)}, 0 0 0 1px rgba(255,255,255,0.18);
                }
              `}</style>
              <Link
                ref={ctaRef}
                to={`/contact?product=${encodeURIComponent(product.name)}&origin=${encodeURIComponent(product.origin)}&section=form`}
                aria-label={`Demander une offre pour ${product.name}`}
                className="cta-magnetic"
                onMouseMove={handleCtaMove}
                onMouseLeave={handleCtaLeave}
                onMouseDown={handleCtaDown}
                onMouseUp={handleCtaUp}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#0B0B0A",
                  color: "#fff",
                  borderRadius: 100,
                  padding: "15px 30px",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: ".04em",
                  textDecoration: "none",
                  willChange: "transform",
                }}
              >
                <span className="cta-shine" aria-hidden="true" />
                Demander une offre <span className="cta-arrow" aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          {/* ── Spécifications ── */}
          <section aria-labelledby="specs-heading" style={{ padding: "clamp(60px,8vh,90px) clamp(24px,7vw,110px)" }}>
            <div ref={reveal} style={{ ...sectionReveal, maxWidth: 1000, margin: "0 auto" }}>
              <h2
                id="specs-heading"
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "clamp(24px,2.6vw,34px)",
                  color: "#fff",
                  margin: "0 0 32px",
                  letterSpacing: "-.02em",
                }}
              >
                <span style={accentBar(accentColor)} aria-hidden="true" />
                Spécifications export
              </h2>
              <dl
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: "28px 40px",
                  margin: 0,
                }}
              >
                {specs.map((s) => (
                  <div key={s.label}>
                    <dt
                      style={{
                        fontFamily: FONT,
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: ".16em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: 8,
                      }}
                    >
                      {s.label}
                    </dt>
                    <dd
                      style={{
                        margin: 0,
                        fontFamily: FONT,
                        fontSize: 15,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <h3
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.5)",
                  margin: "44px 0 16px",
                }}
              >
                Marchés d'export
              </h3>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  margin: 0,
                  padding: 0,
                  listStyle: "none",
                }}
              >
                {EXPORT_MARKETS.map((m) => (
                  <li
                    key={m.code}
                    style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      color: "rgba(255,255,255,0.85)",
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      borderRadius: 100,
                      padding: "7px 16px",
                    }}
                  >
                    {m.country}
                  </li>
                ))}
              </ul>
              <p
                style={{
                  fontFamily: FONT,
                  fontSize: 13.5,
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.55)",
                  margin: "18px 0 0",
                  maxWidth: 620,
                }}
              >
                {PRODUCT_SHARED.otherMarketsNote}
              </p>
            </div>
          </section>

          {/* ── Conditions commerciales & logistique ── */}
          <section aria-labelledby="commercial-heading" style={{ padding: "clamp(60px,8vh,90px) clamp(24px,7vw,110px)" }}>
            <div ref={reveal} style={{ ...sectionReveal, maxWidth: 1000, margin: "0 auto" }}>
              <h2
                id="commercial-heading"
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "clamp(24px,2.6vw,34px)",
                  color: "#fff",
                  margin: "0 0 32px",
                  letterSpacing: "-.02em",
                }}
              >
                <span style={accentBar(accentColor)} aria-hidden="true" />
                Conditions commerciales & logistique
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "32px 40px",
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 10px",
                    }}
                  >
                    Incoterms proposés
                  </h3>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {PRODUCT_SHARED.incoterms.map((inc) => (
                      <li
                        key={inc}
                        style={{
                          fontFamily: FONT,
                          fontSize: 15,
                          lineHeight: 1.7,
                          color: "rgba(255,255,255,0.9)",
                        }}
                      >
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      fontFamily: FONT,
                      fontSize: 13.5,
                      lineHeight: 1.7,
                      color: "rgba(255,255,255,0.55)",
                      margin: "12px 0 0",
                    }}
                  >
                    {PRODUCT_SHARED.incotermsNote}
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 10px",
                    }}
                  >
                    Calibrage
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {PRODUCT_SHARED.calibrage}
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 10px",
                    }}
                  >
                    Conditionnement
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {PRODUCT_SHARED.packaging}
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 10px",
                    }}
                  >
                    Transport
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {getTransportText(product)}
                  </p>
                </div>

                <div>
                  <h3
                    style={{
                      fontFamily: FONT,
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".16em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.45)",
                      margin: "0 0 10px",
                    }}
                  >
                    Disponibilité & adaptation
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.9)", margin: 0 }}>
                    {PRODUCT_SHARED.availabilityNote}
                  </p>
                </div>
              </div>

              {/* Solutions sur mesure */}
              <div
                style={{
                  marginTop: "clamp(40px,5vh,56px)",
                  padding: "clamp(24px,3vw,32px)",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <h3
                  style={{
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 16,
                    color: "#fff",
                    margin: "0 0 10px",
                    letterSpacing: "-.01em",
                  }}
                >
                  Solutions sur mesure
                </h3>
                <p style={{ fontFamily: FONT, fontSize: 14.5, lineHeight: 1.75, color: "rgba(255,255,255,0.75)", margin: 0, maxWidth: 720 }}>
                  {PRODUCT_SHARED.customSolutions}
                </p>
              </div>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section aria-labelledby="faq-heading" style={{ padding: "clamp(60px,8vh,90px) clamp(24px,7vw,110px)" }}>
            <div ref={reveal} style={{ ...sectionReveal, maxWidth: 800, margin: "0 auto" }}>
              <h2
                id="faq-heading"
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "clamp(24px,2.6vw,34px)",
                  color: "#fff",
                  margin: "0 0 28px",
                  letterSpacing: "-.02em",
                }}
              >
                <span style={accentBar(accentColor)} aria-hidden="true" />
                Questions fréquentes
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {PRODUCT_SHARED.faq.map((item) => (
                  <details
                    key={item.q}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.14)",
                      padding: "18px 0",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontFamily: FONT,
                        fontWeight: 700,
                        fontSize: 15,
                        color: "#fff",
                        listStyle: "none",
                      }}
                    >
                      {item.q}
                    </summary>
                    <p
                      style={{
                        fontFamily: FONT,
                        fontSize: 14,
                        lineHeight: 1.75,
                        color: "rgba(255,255,255,0.75)",
                        margin: "12px 0 0",
                      }}
                    >
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* ── Maillage interne : produits associés ── */}
          <section
            aria-labelledby="related-heading"
            style={{
              background: product.bgImage ? "#090F0A" : "rgba(0,0,0,0.22)",
              padding: "clamp(60px,8vh,90px) clamp(24px,7vw,110px)",
            }}
          >
            <div style={{ maxWidth: 1080, margin: "0 auto" }}>
              <h2
                id="related-heading"
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "clamp(22px,2.4vw,30px)",
                  color: "#fff",
                  margin: "0 0 28px",
                  letterSpacing: "-.02em",
                }}
              >
                Autres produits de notre collection
              </h2>
              <nav aria-label="Produits associés">
                <style>{`
                  @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.98); }
                    to { opacity: 1; transform: scale(1); }
                  }
                  .related-products {
                    animation: fadeInScale 0.4s ease-out;
                  }
                  .related-products li {
                    animation: fadeInScale 0.3s ease-out;
                  }
                  .related-products li:nth-child(2) { animation-delay: 0.05s; }
                  .related-products li:nth-child(3) { animation-delay: 0.1s; }
                `}</style>
                <ul
                  key={product.slug}
                  className="related-products"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 24,
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                  }}
                >
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        to={`/produits/${r.slug}`}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 12,
                          textDecoration: "none",
                          padding: 20,
                          borderRadius: 16,
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid rgba(255,255,255,0.1)",
                        }}
                      >
                        <img
                          src={r.image}
                          alt={r.name}
                          width={r.width}
                          height={r.height}
                          loading="lazy"
                          decoding="async"
                          style={{ width: "100%", maxWidth: 110, height: "auto" }}
                        />
                        <span
                          style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: 14,
                            color: "#fff",
                            textAlign: "center",
                          }}
                        >
                          {r.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div style={{ marginTop: 36, display: "flex", gap: 16, flexWrap: "wrap" }}>
                <Link
                  to="/produits"
                  style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}
                >
                  ← Toute la collection
                </Link>
                <Link
                  to="/contact"
                  style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}
                >
                  Nous contacter
                </Link>
                <Link
                  to="/insights"
                  style={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", textDecoration: "underline" }}
                >
                  Lire nos insights
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      {/* Footer DANS le wrapper : sur mobile le body est figé (voir global.css),
          ce wrapper est le vrai scroller — le footer doit vivre ici pour être
          atteignable (même raison que Home.jsx). Sur desktop le wrapper est
          display:contents (no-op), donc le footer d'ici remplace simplement
          celui qu'App.jsx aurait rendu (voir exclusion isProductDetail). */}
      <Footer />
      </div>
    </>
  );
}
