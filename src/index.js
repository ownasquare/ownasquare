const API_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

const SECURITY_HEADERS = {
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'none'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; object-src 'none'; script-src 'self'; style-src 'self'; upgrade-insecure-requests",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy":
    "accelerometer=(), camera=(), geolocation=(), gyroscope=(), microphone=(), payment=(), usb=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function json(payload, init = {}) {
  const headers = new Headers(init.headers);

  for (const [name, value] of Object.entries(API_HEADERS)) {
    headers.set(name, value);
  }

  return new Response(JSON.stringify(payload), {
    ...init,
    headers,
  });
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);

  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return withSecurityHeaders(
          json(
            {
              error: "That action is not available here.",
              ok: false,
            },
            {
              status: 405,
              headers: {
                Allow: "GET, HEAD",
              },
            },
          ),
        );
      }

      return withSecurityHeaders(
        json({
          ok: true,
          service: "ownasquare-platform",
          status: "ready",
        }),
      );
    }

    if (url.pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        json(
          {
            error: "We could not find that service.",
            ok: false,
          },
          {
            status: 404,
          },
        ),
      );
    }

    const assetResponse = await env.ASSETS.fetch(request);
    return withSecurityHeaders(assetResponse);
  },
};

export { SECURITY_HEADERS };

