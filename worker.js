import { onRequestGet, onRequestPost } from "./functions/api/contact.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method === "POST") {
        return onRequestPost({ request, env });
      }

      if (request.method === "GET") {
        return onRequestGet();
      }

      return new Response(
        JSON.stringify({ ok: false, error: "Méthode non autorisée." }),
        {
          status: 405,
          headers: {
            "content-type": "application/json;charset=UTF-8",
            "cache-control": "no-store",
          },
        },
      );
    }

    return env.ASSETS.fetch(request);
  },
};
