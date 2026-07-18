// ============================================================
//  /api/contact — fonction serverless Vercel : envoi réel du
//  formulaire de contact via Resend, remplace l'ancien lien
//  mailto: (qui ouvrait le client mail local sans jamais confirmer
//  qu'un message avait été envoyé).
//
//  Variables d'environnement requises (Vercel → Settings → Environment
//  Variables) :
//    - RESEND_API_KEY (obligatoire)
//    - TURNSTILE_SECRET_KEY (optionnel — tant qu'elle n'est pas définie,
//      la vérification Turnstile est simplement ignorée, le reste des
//      protections anti-spam reste actif).
// ============================================================

const CONTACT_EMAIL = "contact@tropic-aura.com";
// Domaine tropic-aura.com vérifié dans Resend (DKIM + SPF sur le
// sous-domaine send.tropic-aura.com) — expéditeur de marque, plus
// besoin de l'adresse de test onboarding@resend.dev.
const FROM_ADDRESS = "Tropicaura <contact@tropic-aura.com>";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_NAME_LENGTH = 100;
const MAX_COMPANY_LENGTH = 150;
const MIN_SUBMIT_DELAY_MS = 3000; // temps minimal entre affichage du formulaire et soumission
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 3; // par IP sur la fenêtre ci-dessus

const escapeHtml = (str = "") =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;

// Téléphone international permissif mais strict : chiffres/espaces/+/-/()
// uniquement, 7 à 20 caractères significatifs. Le champ reste optionnel.
const isValidPhone = (phone) => /^[+\d][\d\s().-]{6,19}$/.test(phone.trim());

// Nom : pas de balises, pas d'URL, longueur raisonnable.
const isValidName = (name) =>
  name.trim().length > 0 &&
  name.trim().length <= MAX_NAME_LENGTH &&
  !/https?:\/\//i.test(name) &&
  !/[<>]/.test(name);

// Rate limiting en mémoire — best-effort : fonctionne tant que l'instance
// serverless reste "chaude" entre deux requêtes (cas courant en usage réel,
// pas garanti à l'échelle). Pour une garantie multi-instance, migrer vers
// un store partagé (Upstash Redis) le jour où le volume le justifie.
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  // Nettoyage occasionnel pour éviter une fuite mémoire sur une instance
  // longtemps chaude.
  if (requestLog.size > 500) {
    for (const [key, ts] of requestLog) {
      if (ts.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }
  return timestamps.length > RATE_LIMIT_MAX_REQUESTS;
}

async function verifyTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true; // pas encore configuré
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: ip,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error("[api/contact] Turnstile verify error:", err);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Méthode non autorisée." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[api/contact] RESEND_API_KEY manquante");
    return res.status(500).json({ ok: false, error: "Configuration serveur incomplète." });
  }

  const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();

  if (isRateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Trop de tentatives. Réessayez dans quelques minutes." });
  }

  const {
    nom, entreprise, email, telephone, message, product, origin,
    website, formLoadedAt, turnstileToken,
  } = req.body || {};

  // Honeypot : champ invisible pour un humain, souvent auto-rempli par les
  // bots. On répond succès sans jamais envoyer l'email, pour ne pas leur
  // signaler qu'ils ont été détectés.
  if (website) {
    return res.status(200).json({ ok: true });
  }

  // Délai minimal : un bot soumet en quelques centaines de ms, un humain
  // met au moins quelques secondes à lire puis remplir le formulaire.
  if (typeof formLoadedAt === "number" && Date.now() - formLoadedAt < MIN_SUBMIT_DELAY_MS) {
    return res.status(400).json({ ok: false, error: "Formulaire soumis trop rapidement. Réessayez." });
  }

  const turnstileOk = await verifyTurnstile(turnstileToken, ip);
  if (!turnstileOk) {
    return res.status(400).json({ ok: false, error: "Vérification anti-robot échouée. Réessayez." });
  }

  if (!nom?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ ok: false, error: "Nom, email et message sont requis." });
  }
  if (!isValidName(nom)) {
    return res.status(400).json({ ok: false, error: "Nom invalide." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Adresse email invalide." });
  }
  if (telephone?.trim() && !isValidPhone(telephone)) {
    return res.status(400).json({ ok: false, error: "Numéro de téléphone invalide." });
  }
  if (entreprise && entreprise.length > MAX_COMPANY_LENGTH) {
    return res.status(400).json({ ok: false, error: "Nom d'entreprise trop long." });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ ok: false, error: `Message trop long (${MAX_MESSAGE_LENGTH} caractères maximum).` });
  }

  const subject = `Demande de partenariat${entreprise ? " — " + entreprise : ""}${product ? ` (${product})` : ""}`;

  const html = `
    <h2>Nouvelle demande via tropic-aura.com</h2>
    <p><strong>Nom :</strong> ${escapeHtml(nom)}</p>
    <p><strong>Entreprise :</strong> ${escapeHtml(entreprise || "—")}</p>
    <p><strong>Email :</strong> ${escapeHtml(email)}</p>
    <p><strong>Téléphone :</strong> ${escapeHtml(telephone || "—")}</p>
    ${product ? `<p><strong>Produit :</strong> ${escapeHtml(product)} ${origin ? `(origine : ${escapeHtml(origin)})` : ""}</p>` : ""}
    <p><strong>Message :</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("[api/contact] Resend error:", resendRes.status, errBody);
      return res.status(502).json({ ok: false, error: "L'envoi a échoué. Réessayez ou écrivez-nous directement." });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[api/contact] Fetch error:", err);
    return res.status(502).json({ ok: false, error: "L'envoi a échoué. Réessayez ou écrivez-nous directement." });
  }
}
