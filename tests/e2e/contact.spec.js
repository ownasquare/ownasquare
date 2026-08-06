import { expect, test } from "@playwright/test";

test("the contact tab opens the contact page from the home nav", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Contact" }).click();

  await expect(page).toHaveURL(/\/contact-us\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Say hello. Ask anything." }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "hello@ownasquare.com" }),
  ).toHaveAttribute("href", "mailto:hello@ownasquare.com");
});

test("submitting an empty form surfaces field-level validation", async ({
  page,
}) => {
  await page.goto("/contact-us/");

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("check the highlighted");
  await expect(page.getByLabel("Your name")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

test("a complete message reports success and clears the form", async ({
  page,
}) => {
  await page.goto("/contact-us/");

  await page.getByLabel("Your name").fill("Ada Lovelace");
  await page.getByLabel("Email address").fill("ada@example.com");
  await page.getByLabel("Message").fill("Testing the contact form end to end.");

  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByRole("status")).toContainText("on its way");
  await expect(page.getByLabel("Your name")).toHaveValue("");

  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  const viewportWidth = page.viewportSize()?.width;
  expect(pageWidth).toBeLessThanOrEqual(viewportWidth ?? pageWidth);
});
