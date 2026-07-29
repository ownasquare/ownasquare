import { expect, test } from "@playwright/test";

test("the core message and shortest path work at every supported size", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "One account. A thousand focused tools.",
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "See how access works" }).click();

  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "The same useful app, two simple ways.",
    }),
  ).toBeInViewport();

  const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const viewportWidth = page.viewportSize()?.width;
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth ?? pageWidth);
});

test("automatic dark mode and the explicit theme control both work", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const themeButton = page.getByRole("button", { name: "Switch to light mode" });
  await expect(themeButton).toBeVisible();
  await expect(themeButton).toHaveAttribute("aria-pressed", "true");

  await themeButton.click();

  await expect(
    page.getByRole("button", { name: "Switch to dark mode" }),
  ).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("the adventure tab opens the founder journal at every supported size", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "The Adventure" }).click();

  await expect(page).toHaveURL(/\/adventure\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Build what people need. Share every lesson.",
    }),
  ).toBeVisible();
  await expect(page.getByText("Recording soon")).toHaveCount(5);

  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const viewportWidth = page.viewportSize()?.width;
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth ?? pageWidth);
});

test("the adventure page shares the same theme control", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/adventure/");

  const themeButton = page.getByRole("button", {
    name: "Switch to light mode",
  });
  await expect(themeButton).toBeVisible();
  await themeButton.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("the app catalog connects public previews and source-only apps", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Apps" }).click();

  await expect(page).toHaveURL(/\/apps\/$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Small tools. Ready to try.",
    }),
  ).toBeVisible();
  await expect(page.locator(".catalog-card")).toHaveCount(50);
  await expect(page.locator("[data-result-count]")).toHaveText("50 apps");

  const links = [
    {
      name: "Open UnitPath Coach",
      href: "https://unitpath-coach.ownasquare.com",
    },
    {
      name: "View UnitPath Coach source",
      href: "https://github.com/ownasquare/unitpath-coach",
    },
    {
      name: "Open Split Ticket Rescue",
      href: "https://split-ticket-rescue.ownasquare.com",
    },
    {
      name: "View Split Ticket Rescue source",
      href: "https://github.com/ownasquare/split-ticket-rescue",
    },
    {
      name: "Open Move Thesis",
      href: "https://move-thesis.ownasquare.com",
    },
    {
      name: "View Move Thesis source",
      href: "https://github.com/ownasquare/move-thesis",
    },
  ];

  for (const link of links) {
    await expect(page.getByRole("link", { name: link.name })).toHaveAttribute(
      "href",
      link.href,
    );
  }

  await expect(
    page.getByRole("link", { name: "View Laundry Odor Triage source" }),
  ).toHaveAttribute(
    "href",
    "https://github.com/ownasquare/laundry-odor-triage",
  );
  await expect(
    page.getByLabel("Laundry Odor Triage hosted preview not available"),
  ).toBeVisible();
  await expect(
    page.locator('input[data-filter="availability"][value="popular"]'),
  ).toBeDisabled();

  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const viewportWidth = page.viewportSize()?.width;
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth ?? pageWidth);
});

test("catalog filters combine across groups and clear cleanly", async ({
  page,
}) => {
  await page.goto("/apps/");

  if ((page.viewportSize()?.width ?? 0) < 1024) {
    const filterToggle = page.locator("[data-filter-toggle]");
    await expect(filterToggle).toHaveAttribute("aria-expanded", "false");
    await filterToggle.click();
    await expect(filterToggle).toHaveAttribute("aria-expanded", "true");
  }

  await page
    .locator('input[data-filter="categories"][value="education"]')
    .check();
  await page.locator('input[data-filter="useCases"][value="personal"]').check();
  await page.locator('input[data-filter="simplicity"][value="simple"]').check();

  await expect(page.locator("[data-result-count]")).toHaveText("1 app");
  await expect(page.locator(".catalog-card")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { level: 3, name: "UnitPath Coach" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator("[data-result-count]")).toHaveText("50 apps");
  await expect(page.locator(".catalog-card")).toHaveCount(50);

  await page.locator('input[data-filter="categories"][value="finance"]').check();
  await page.locator('input[data-filter="useCases"][value="education"]').check();
  await page.locator('input[data-filter="simplicity"][value="simple"]').check();

  await expect(page.locator("[data-result-count]")).toHaveText("0 apps");
  await expect(
    page.getByRole("heading", {
      level: 3,
      name: "No apps match this combination yet.",
    }),
  ).toBeVisible();

  await page
    .locator("[data-empty-state]")
    .getByRole("button", { name: "Clear filters" })
    .click();
  await expect(page.locator("[data-result-count]")).toHaveText("50 apps");
});

test("hosted-plan copy keeps readable contrast in dark mode", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");

  const contrast = await page.locator(".hosted-card").evaluate((card) => {
    const paragraph = card.querySelector("p:not(.card-label)");
    if (!paragraph) {
      return 0;
    }

    const channel = (value) => {
      const normalized = value / 255;
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    };

    const luminance = (color) => {
      const values = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number);
      if (!values || values.length !== 3) {
        return 0;
      }

      return (
        0.2126 * channel(values[0]) +
        0.7152 * channel(values[1]) +
        0.0722 * channel(values[2])
      );
    };

    const foreground = luminance(getComputedStyle(paragraph).color);
    const background = luminance(getComputedStyle(card).backgroundColor);
    const lighter = Math.max(foreground, background);
    const darker = Math.min(foreground, background);

    return (lighter + 0.05) / (darker + 0.05);
  });

  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test("the health endpoint is reachable through the local Worker", async ({
  request,
}) => {
  const response = await request.get("/api/health");

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({
    ok: true,
    service: "ownasquare-platform",
    status: "ready",
  });
});
