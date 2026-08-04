import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { langFromPath, pathFor } from "../i18n/routing";
import TopBar from "../components/TopBar";
import Breadcrumbs from "../components/Breadcrumbs";
import SEOHead from "../seo/SEOHead";
import { organizationSchema, webPageSchema, breadcrumbListSchema } from "../seo/schema";
import { buildBreadcrumbTrail } from "../seo/routesRegistry";
import { LEGAL_NAME, CONTACT_EMAIL, ADDRESS } from "../seo/siteConfig";

// ============================================================
//  POLITIQUE DE CONFIDENTIALITÉ
//
//  RÈGLE D'INTÉGRITÉ (même discipline que tout le reste du site) :
//  uniquement les traitements de données RÉELLEMENT en place dans le
//  code au moment de la rédaction. Pas de DPO inventé, pas de durée
//  de conservation inventée, pas de sous-traitant omis.
//
//  Traitements réels identifiés dans le code :
//    - Formulaire de contact → Resend (api/contact.js) : nom, entreprise,
//      email, téléphone, message envoyés par email à contact@tropic-aura.com.
//    - Anti-spam serveur (honeypot, délai, rate limiting par IP) — voir
//      api/contact.js : l'IP est lue pour le rate limiting, jamais stockée
//      au-delà de la fenêtre de 10 minutes (Map en mémoire, non persistante).
//    - Turnstile (Cloudflare) : prêt dans le code, PAS ENCORE ACTIVÉ
//      (clés non configurées) — mentionné au conditionnel.
//    - Google Analytics 4 : prêt dans le code, PAS ENCORE ACTIVÉ
//      (VITE_GA_MEASUREMENT_ID non configuré) — mentionné au conditionnel,
//      gated par consentement (voir CookieBanner.jsx).
//    - sessionStorage (position de scroll) : fonctionnel, première partie,
//      pas de tracking, pas soumis au consentement RGPD/ePrivacy.
// ============================================================

export default function PolitiqueConfidentialite() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = langFromPath(pathname);
  const description = t("privacy.seo.description");
  // Chemin suivant la langue : figé en français, /en/privacy déclarait une
  // URL canonique française — Google aurait alors fusionné les deux versions
  // sur la seule page FR, rendant la page anglaise inindexable.
  const privacyPath = pathFor("privacy", lang);
  const trail = buildBreadcrumbTrail(privacyPath);

  const h2 = { fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, margin: "40px 0 14px", color: "#1A1A1A" };
  const p = { fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14.5, lineHeight: 1.75, color: "rgba(0,0,0,0.68)", margin: "0 0 14px" };
  const li = { ...p, margin: "0 0 8px" };

  return (
    <>
      <SEOHead
        title={t("privacy.seo.title")}
        description={description}
        path={privacyPath}
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: privacyPath, title: t("privacy.title"), description, breadcrumb: true }),
          breadcrumbListSchema(trail, privacyPath),
        ]}
      />
      <TopBar />
      <img
        src="/logo-mark.png"
        alt={t("privacy.seo.logoAlt")}
        width={448} height={434} style={{ display: "none" }}
      />
      <Breadcrumbs trail={trail} />

      <main style={{ background: "#F5F1E8", padding: "clamp(100px,14vh,160px) clamp(24px,8vw,140px) clamp(80px,12vh,140px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-.02em", color: "#1A1A1A", margin: "0 0 28px" }}>{t("privacy.title")}</h1>

          <p style={p}>
            {LEGAL_NAME}, {ADDRESS.locality}, {ADDRESS.countryName}, {t("privacy.controllerIntro")}{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#8A6A2E" }}>{CONTACT_EMAIL}</a>.
          </p>

          <h2 style={h2}>{t("privacy.formHeading")}</h2>
          <p style={p}>
            {t("privacy.formP1")}
          </p>
          <p style={p}>
            {t("privacy.formP2")}
          </p>

          <h2 style={h2}>{t("privacy.cookiesHeading")}</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
            <li style={li}><strong>{t("privacy.necessaryLabel")}</strong>{t("privacy.necessaryText")}</li>
            <li style={li}><strong>{t("privacy.analyticsLabel")}</strong>{t("privacy.analyticsText")}</li>
          </ul>

          <h2 style={h2}>{t("privacy.botHeading")}</h2>
          <p style={p}>
            {t("privacy.botText")}
          </p>

          <h2 style={h2}>{t("privacy.rightsHeading")}</h2>
          <p style={p}>
            {t("privacy.rightsText")}{" "}<a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#8A6A2E" }}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </main>
    </>
  );
}
