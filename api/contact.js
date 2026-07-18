// ============================================================
//  /api/contact — fonction serverless Vercel : envoi réel du
//  formulaire de contact via Resend, remplace l'ancien lien
//  mailto: (qui ouvrait le client mail local sans jamais confirmer
//  qu'un message avait été envoyé).
//
//  Variable d'environnement requise (Vercel → Settings → Environment
//  Variables) : RESEND_API_KEY.
// ============================================================

const CONTACT_EMAIL = "contact@tropic-aura.com";
// Domaine tropic-aura.com vérifié dans Resend (DKIM + SPF sur le
// sous-domaine send.tropic-aura.com) — expéditeur de marque, plus
// besoin de l'adresse de test onboarding@resend.dev.
const FROM_ADDRESS = "Tropicaura <contact@tropic-aura.com>";

const escapeHtml = (str = "") =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Méthode non autorisée." });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[api/contact] RESEND_API_KEY manquante");
    return res.status(500).json({ ok: false, error: "Configuration serveur incomplète." });
  }

  const { nom, entreprise, email, telephone, message, product, origin } = req.body || {};

  if (!nom?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ ok: false, error: "Nom, email et message sont requis." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "Adresse email invalide." });
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
