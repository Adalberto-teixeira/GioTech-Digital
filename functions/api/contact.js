/**
 * Cloudflare Pages Function — /api/contact
 * Reçoit le formulaire de contact et transmet le message via Resend.
 */

const REQUIRED_FIELDS = ["nom", "email", "message"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "cache-control": "no-store",
    },
  });
}

function clean(value, maxLength) {
  return String(value ?? "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return jsonResponse(415, { ok: false, error: "Format de requête invalide." });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { ok: false, error: "Requête invalide." });
  }

  if (clean(body.website, 200)) {
    return jsonResponse(200, { ok: true });
  }

  const data = {
    nom: clean(body.nom, 120),
    entreprise: clean(body.entreprise, 160),
    email: clean(body.email, 254).toLowerCase(),
    tel: clean(body.tel, 60),
    type: clean(body.type, 120),
    message: clean(body.message, 5000),
  };

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) {
      return jsonResponse(400, { ok: false, error: `Le champ « ${field} » est requis.` });
    }
  }

  if (!EMAIL_RE.test(data.email)) {
    return jsonResponse(400, { ok: false, error: "Adresse email invalide." });
  }

  if (data.message.length < 10) {
    return jsonResponse(400, { ok: false, error: "Le message est trop court." });
  }

  if (!env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY missing in Cloudflare Pages environment");
    return jsonResponse(500, { ok: false, error: "Le service e-mail est temporairement indisponible." });
  }

  const toEmail = env.CONTACT_TO_EMAIL || "contact@giotech-digital.fr";
  const fromEmail = env.CONTACT_FROM || "GioTech Digital <contact@giotech-digital.fr>";

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;max-width:680px;margin:auto">
      <h2>Nouvelle demande de devis — GioTech Digital</h2>
      <p><strong>Nom :</strong> ${escapeHtml(data.nom)}</p>
      <p><strong>Entreprise :</strong> ${escapeHtml(data.entreprise || "—")}</p>
      <p><strong>Email :</strong> ${escapeHtml(data.email)}</p>
      <p><strong>Téléphone :</strong> ${escapeHtml(data.tel || "—")}</p>
      <p><strong>Type de projet :</strong> ${escapeHtml(data.type || "—")}</p>
      <hr style="border:0;border-top:1px solid #e5e7eb;margin:22px 0">
      <p><strong>Message :</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>
    </div>`;

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: data.email,
        subject: `Nouvelle demande de devis — ${data.nom}`,
        html,
      }),
    });

    const payload = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      console.error("Resend error", resendRes.status, payload);
      return jsonResponse(502, {
        ok: false,
        error: "L'envoi de l'email a échoué. Réessayez dans un instant.",
      });
    }

    return jsonResponse(200, { ok: true, id: payload.id || null });
  } catch (err) {
    console.error("Contact form error:", err);
    return jsonResponse(500, { ok: false, error: "Une erreur est survenue. Réessayez dans un instant." });
  }
}

export async function onRequestGet() {
  return jsonResponse(405, { ok: false, error: "Méthode non autorisée." });
}
