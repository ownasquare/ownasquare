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

