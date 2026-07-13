import { useParams, Link, Navigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema, productSchema, faqPageSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";
import { getProductBySlug, getRelatedProducts, PRODUCT_SHARED } from "../data/productsData";
import { EXPORT_MARKETS } from "../seo/siteConfig";

const FONT = "'Plus Jakarta Sans',sans-serif";

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

  if (!product) return <Navigate to="/produits" replace />;

  const path = `/produits/${product.slug}`;
  const related = getRelatedProducts(product.slug, 3);
  const trail = buildBreadcrumbTrail(path);
  const description = `${product.name} (${product.englishName}) — ${product.description} Origine : ${product.origin}. Disponibilité : ${product.availability}. Export ${PRODUCT_SHARED.incoterm}.`.slice(0, 300);

  const specs = [
    { label: "Nom commercial", value: `${product.name} (${product.englishName})` },
    { label: "Collection", value: product.collection.charAt(0) + product.collection.slice(1).toLowerCase() },
    { label: "Origine", value: product.origin },
    { label: "Disponibilité", value: product.availability },
    { label: "Standard", value: product.standard },
    { label: "Conditionnement", value: PRODUCT_SHARED.packaging },
    { label: "Transport", value: PRODUCT_SHARED.transport },
    { label: "Incoterm", value: PRODUCT_SHARED.incoterm },
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
          productSchema(product, PRODUCT_SHARED.incoterm),
          faqPageSchema(PRODUCT_SHARED.faq),
        ]}
      />

      <TopBar />
      <Breadcrumbs trail={trail} />

      <main style={{ background: product.bg, minHeight: "100vh" }}>
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

            <div style={{ flex: "1 1 420px", minWidth: 0 }}>
              <span
                style={{
                  display: "block",
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: ".30em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 18,
                }}
              >
                {product.collection} · N°{product.num}
              </span>

              <h1
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: "clamp(36px,5vw,64px)",
                  lineHeight: 1.04,
                  letterSpacing: "-.03em",
                  color: "#fff",
                  margin: "0 0 8px",
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

              <Link
                to="/contact"
                aria-label={`Demander une offre pour ${product.name}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  color: "#0B1310",
                  borderRadius: 100,
                  padding: "15px 30px",
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: ".04em",
                  textDecoration: "none",
                }}
              >
                Demander une offre <span aria-hidden="true">→</span>
              </Link>
            </div>
          </section>

          {/* ── Spécifications ── */}
          <section
            aria-labelledby="specs-heading"
            style={{
              background: "rgba(0,0,0,0.22)",
              padding: "clamp(60px,8vh,90px) clamp(24px,7vw,110px)",
            }}
          >
            <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
            </div>
          </section>

          {/* ── FAQ ── */}
          <section
            aria-labelledby="faq-heading"
            style={{ padding: "clamp(60px,8vh,90px) clamp(24px,7vw,110px)" }}
          >
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
              background: "rgba(0,0,0,0.22)",
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
    </>
  );
}
