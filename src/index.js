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

// Where contact submissions are delivered. Kept out of source (it is a real
// inbox): set as a Worker secret in production (`wrangler secret put
// CONTACT_RECIPIENT`) and in `.dev.vars` locally. Must be a VERIFIED Cloudflare
// Email Routing destination — the send_email binding only delivers to verified
// destinations. Public-facing address stays hello@ownasquare.com (mailto + rule).
const CONTACT_SENDER = {
  email: "noreply@ownasquare.com",
  name: "OwnASquare Contact Form",
};
const CONTACT_LIMITS = {
  name: 120,
  email: 200,
  subject: 160,
  message: 4000,
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

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Single-line header values must not carry CR/LF (header-injection guard).
function singleLine(value) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function readSubmission(request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return request.json();
  }

  const form = await request.formData();
  return Object.fromEntries(form.entries());
}

async function handleContact(request, env) {
  if (request.method !== "POST") {
    return json(
      { ok: false, error: "That action is not available here." },
      { status: 405, headers: { Allow: "POST" } },
    );
  }

  let data;
  try {
    data = await readSubmission(request);
  } catch {
    return json(
      { ok: false, error: "We could not read that submission." },
      { status: 400 },
    );
  }

  // Honeypot: real people leave this hidden field empty. Accept silently so
  // bots do not learn they were filtered.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return json({ ok: true, message: "Thanks — your message is on its way." });
  }

  const name = singleLine(String(data.name ?? ""));
  const email = singleLine(String(data.email ?? ""));
  const subject = singleLine(String(data.subject ?? ""));
  const message = String(data.message ?? "").trim();

  const fields = [];
  if (!name || name.length > CONTACT_LIMITS.name) fields.push("name");
  if (!email || email.length > CONTACT_LIMITS.email || !isValidEmail(email)) {
    fields.push("email");
  }
  if (subject.length > CONTACT_LIMITS.subject) fields.push("subject");
  if (!message || message.length > CONTACT_LIMITS.message) fields.push("message");

  if (fields.length > 0) {
    return json(
      { ok: false, error: "Please check the highlighted fields.", fields },
      { status: 422 },
    );
  }

  const recipient = env.CONTACT_RECIPIENT;
  if (!env.EMAIL || typeof env.EMAIL.send !== "function" || !recipient) {
    return json(
      {
        ok: false,
        error:
          "Messaging is not connected yet. Please email hello@ownasquare.com directly.",
      },
      { status: 503 },
    );
  }

  const cleanSubject = subject || "New contact message";
  const text =
    `New message from the OwnASquare contact form\n\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Subject: ${cleanSubject}\n\n` +
    `${message}\n`;
  const html =
    `<h2>New contact message</h2>` +
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
    `<p><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>` +
    `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  try {
    await env.EMAIL.send({
      to: recipient,
      from: CONTACT_SENDER,
      replyTo: email,
      subject: `[Contact] ${cleanSubject}`,
      text,
      html,
    });
  } catch (error) {
    console.error("contact send failed:", error?.code, error?.message);
    return json(
      {
        ok: false,
        error:
          "We could not send your message right now. Please email hello@ownasquare.com directly.",
      },
      { status: 502 },
    );
  }

  return json({ ok: true, message: "Thanks — your message is on its way." });
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

    if (url.pathname === "/api/contact") {
      return withSecurityHeaders(await handleContact(request, env));
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

