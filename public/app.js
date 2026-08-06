const root = document.documentElement;
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = document.querySelector("[data-theme-label]");
const year = document.querySelector("[data-year]");

const systemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const activeTheme = () => root.dataset.theme || systemTheme();

function updateThemeControl() {
  if (!themeToggle || !themeLabel) {
    return;
  }

  const theme = activeTheme();
  themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle.setAttribute(
    "aria-label",
    `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
  );
  themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
}

themeToggle?.addEventListener("click", () => {
  const nextTheme = activeTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;

  try {
    localStorage.setItem("ownasquare-theme", nextTheme);
  } catch {
    // The selected theme still applies for this page view.
  }

  updateThemeControl();
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateThemeControl);

if (year) {
  year.textContent = String(new Date().getFullYear());
}

updateThemeControl();

const contactForm = document.querySelector("[data-contact-form]");

if (contactForm) {
  const status = contactForm.querySelector("[data-form-status]");
  const submit = contactForm.querySelector("[data-form-submit]");

  const setStatus = (message, tone) => {
    if (!status) {
      return;
    }
    status.textContent = message;
    status.hidden = message === "";
    status.dataset.tone = tone || "";
  };

  const clearFieldErrors = () => {
    contactForm
      .querySelectorAll('[aria-invalid="true"]')
      .forEach((field) => field.removeAttribute("aria-invalid"));
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors();

    const data = Object.fromEntries(new FormData(contactForm).entries());

    submit?.setAttribute("disabled", "true");
    setStatus("Sending your message…", "pending");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      let payload = {};
      try {
        payload = await response.json();
      } catch {
        // A non-JSON response is handled as a generic failure below.
      }

      if (response.ok && payload.ok) {
        contactForm.reset();
        setStatus(
          payload.message || "Thanks — your message is on its way.",
          "success",
        );
      } else {
        if (Array.isArray(payload.fields)) {
          for (const name of payload.fields) {
            const field = contactForm.querySelector(`[name="${name}"]`);
            if (field) {
              field.setAttribute("aria-invalid", "true");
            }
          }
          contactForm.querySelector('[aria-invalid="true"]')?.focus();
        }
        setStatus(
          payload.error ||
            "We could not send your message. Please email hello@ownasquare.com.",
          "error",
        );
      }
    } catch {
      setStatus(
        "We could not reach the server. Please email hello@ownasquare.com.",
        "error",
      );
    } finally {
      submit?.removeAttribute("disabled");
    }
  });
}

