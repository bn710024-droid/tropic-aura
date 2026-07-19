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
  const description =
    "Politique de confidentialité de Tropicaura B.C. — données collectées via le formulaire de contact, cookies, mesure d'audience.";
  const trail = buildBreadcrumbTrail("/politique-confidentialite");

  const h2 = { fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 20, margin: "40px 0 14px", color: "#1A1A1A" };
  const p = { fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14.5, lineHeight: 1.75, color: "rgba(0,0,0,0.68)", margin: "0 0 14px" };
  const li = { ...p, margin: "0 0 8px" };

  return (
    <>
      <SEOHead
        title="Politique de Confidentialité"
        description={description}
        path="/politique-confidentialite"
        jsonLd={[
          organizationSchema(),
          webPageSchema({ path: "/politique-confidentialite", title: "Politique de confidentialité", description, breadcrumb: true }),
          breadcrumbListSchema(trail, "/politique-confidentialite"),
        ]}
      />
      <TopBar />
      <img
        src="/logo-mark.png"
        alt="Tropicaura — Politique de confidentialité"
        width={512} height={512} style={{ display: "none" }}
      />
      <Breadcrumbs trail={trail} />

      <main style={{ background: "#F5F1E8", padding: "clamp(100px,14vh,160px) clamp(24px,8vw,140px) clamp(80px,12vh,140px)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: "clamp(30px,4vw,44px)", letterSpacing: "-.02em", color: "#1A1A1A", margin: "0 0 28px" }}>
            Politique de confidentialité
          </h1>

          <p style={p}>
            {LEGAL_NAME}, {ADDRESS.locality}, {ADDRESS.countryName}, est responsable du traitement des
            données décrites ci-dessous. Pour toute question relative à vos données, contactez-nous à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#8A6A2E" }}>{CONTACT_EMAIL}</a>.
          </p>

          <h2 style={h2}>Formulaire de contact</h2>
          <p style={p}>
            Lorsque vous remplissez notre formulaire de contact, les informations que vous saisissez
            (nom, entreprise, email, téléphone, message) nous sont transmises par email via le service
            Resend, à seule fin de répondre à votre demande commerciale. Elles ne sont utilisées à
            aucune autre fin et ne sont pas revendues.
          </p>
          <p style={p}>
            Pour limiter les soumissions automatisées (spam), notre serveur applique une limitation de
            fréquence basée sur votre adresse IP. Cette adresse est utilisée en mémoire pendant une
            fenêtre de 10 minutes maximum et n'est jamais conservée au-delà, ni croisée avec d'autres
            données.
          </p>

          <h2 style={h2}>Cookies et mesure d'audience</h2>
          <ul style={{ margin: "0 0 14px", paddingLeft: 20 }}>
            <li style={li}><strong>Nécessaires :</strong> une donnée technique de position de défilement est conservée temporairement dans votre navigateur (sessionStorage) pour restaurer votre place sur la page en cas de retour en arrière. Elle ne quitte jamais votre appareil et n'est pas un cookie de suivi.</li>
            <li style={li}><strong>Mesure d'audience (optionnelle) :</strong> si vous l'acceptez via le bandeau de cookies, Google Analytics 4 nous aide à comprendre quelles pages sont consultées, de façon agrégée. L'adresse IP est anonymisée avant traitement. Vous pouvez retirer ce consentement à tout moment depuis le lien "Gérer les cookies" en bas de page.</li>
          </ul>

          <h2 style={h2}>Protection anti-robots</h2>
          <p style={p}>
            Une vérification anti-robots (Cloudflare Turnstile) peut être utilisée sur le formulaire de
            contact pour empêcher les soumissions automatisées. Ce service est fourni par Cloudflare.
          </p>

          <h2 style={h2}>Vos droits</h2>
          <p style={p}>
            Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un
            droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer
            ce droit, écrivez-nous à <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#8A6A2E" }}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </main>
    </>
  );
}
