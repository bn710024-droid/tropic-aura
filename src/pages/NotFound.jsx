import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { langFromPath, pathFor } from "../i18n/routing";
import TopBar from "../components/TopBar";
import SEOHead from "../seo/SEOHead";

// ============================================================
//  <NotFound /> — page 404. Toujours "noindex" (une 404 ne doit
//  jamais concurrencer une vraie page dans l'index Google), mais
//  renvoie un code HTTP 404 réel côté Vercel via vercel.json.
// ============================================================
export default function NotFound() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  return (
    <>
      <SEOHead
        title={t("notFound.seoTitle")}
        description={t("notFound.seoDesc")}
        path="/404"
        noindex
      />
      <TopBar />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          background: "#0B1310",
          padding: "0 24px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 800,
            fontSize: "clamp(40px,6vw,72px)",
            color: "#fff",
            margin: "0 0 16px",
          }}
        >
          404
        </h1>
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 16,
            color: "rgba(255,255,255,0.7)",
            margin: "0 0 32px",
            maxWidth: 480,
          }}
        >
          {t("notFound.text")}
        </p>
        <Link
          to={pathFor("home", lang)}
          style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: ".04em",
            color: "#0B1310",
            background: "#fff",
            borderRadius: 100,
            padding: "14px 28px",
            textDecoration: "none",
          }}
        >
          {t("notFound.back")}
        </Link>
      </main>
    </>
  );
}
