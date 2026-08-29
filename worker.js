import { onRequestGet, onRequestPost } from "./functions/api/contact.js";

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "SAMEORIGIN",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "strict-transport-security": "max-age=31536000",
};

function withSecurityHeaders(response) {
  const secured = new Response(response.body, response);
  Object.entries(SECURITY_HEADERS).forEach(([name, value]) => {
    secured.headers.set(name, value);
  });
  return secured;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method === "POST") {
        return withSecurityHeaders(await onRequestPost({ request, env }));
      }

      if (request.method === "GET") {
        return withSecurityHeaders(await onRequestGet());
      }

      return withSecurityHeaders(
        new Response(
          JSON.stringify({ ok: false, error: "Méthode non autorisée." }),
          {
            status: 405,
            headers: {
              "content-type": "application/json;charset=UTF-8",
              "cache-control": "no-store",
            },
          },
        ),
      );
    }

    return env.ASSETS.fetch(request);
  },
};
