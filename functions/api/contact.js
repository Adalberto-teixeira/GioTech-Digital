/**
 * Cloudflare Pages Function — /api/contact
 *
 * Reçoit les données du formulaire "Demander un devis" et envoie un email
 * via l'API Resend (https://resend.com). Aucune donnée n'est stockée :
 * elle est uniquement transmise par email à GioTech Digital.
 *
 * Configuration requise (dans le tableau de bord Cloudflare Pages) :
 *   Settings → Environment variables → ajouter :
 *     RESEND_API_KEY   = votre clé API Resend (commence par "re_")
 *     CONTACT_TO_EMAIL = contact@giotech-digital.fr   (destinataire)
 *     CONTACT_FROM     = GioTech Digital <onboarding@resend.dev>
 *       ↳ à remplacer par une adresse @giotech-digital.fr une fois le
 *         domaine vérifié dans Resend, pour une meilleure délivrabilité.
 */

const REQUIRED_FIELDS = ["nom", "email", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json;charset=UTF-8" },
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return jsonResponse(400, { ok: false, error: "Requête invalide." });
  }

  // Piège à robots : ce champ doit toujours rester vide pour un vrai visiteur.
  if (body.website) {
    return jsonResponse(200, { ok: true }); // on répond "succès" sans rien envoyer
  }

  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || !String(body[field]).trim()) {
      return jsonResponse(400, { ok: false, error: `Le champ « ${field} » est requis.` });
    }
  }

  if (!EMAIL_RE.test(String(body.email).trim())) {
    return jsonResponse(400, { ok: false, error: "Adresse email invalide." });
  }

  if (!env.RESEND_API_KEY) {
    return jsonResponse(500, {
      ok: false,
      error: "Le service d'envoi n'est pas encore configuré (RESEND_API_KEY manquant).",
    });
  }

  const toEmail = env.CONTACT_TO_EMAIL || "contact@giotech-digital.fr";
  const fromEmail = env.CONTACT_FROM || "GioTech Digital <onboarding@resend.dev>";

  const nom = escapeHtml(body.nom);
  const entreprise = escapeHtml(body.entreprise);
  const email = escapeHtml(body.email);
  const tel = escapeHtml(body.tel);
  const type = escapeHtml(body.type);
  const message = escapeHtml(body.message).replace(/\n/g, "<br>");

  const html = `
    <h2 style="font-family:sans-serif;">Nouvelle demande de devis — GioTech Digital</h2>
    <table style="font-family:sans-serif; font-size:14px; border-collapse:collapse;">
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Nom</td><td>${nom}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Entreprise</td><td>${entreprise || "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Email</td><td>${email}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Téléphone</td><td>${tel || "—"}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#666;">Type de projet</td><td>${type || "—"}</td></tr>
    </table>
    <p style="font-family:sans-serif; font-size:14px; margin-top:16px; white-space:pre-line;"><strong>Message :</strong><br>${message}</p>
  `;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: String(body.email).trim(),
        subject: `Nouvelle demande de devis — ${body.nom}`,
        html,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      console.error("Resend error:", detail);
      return jsonResponse(502, { ok: false, error: "L'envoi de l'email a échoué. Réessayez dans un instant." });
    }

    return jsonResponse(200, { ok: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return jsonResponse(500, { ok: false, error: "Une erreur est survenue. Réessayez dans un instant." });
  }
}

// Toute autre méthode que POST est refusée.
export async function onRequestGet() {
  return jsonResponse(405, { ok: false, error: "Méthode non autorisée." });
}
