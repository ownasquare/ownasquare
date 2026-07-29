import { catalogApps } from "../public/apps/catalog-data.js";

const attempts = 12;
const retryDelayMs = 3_000;
const concurrency = 6;

async function verify(app) {
  let lastStatus = 0;
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(app.previewUrl, {
        method: "GET",
        redirect: "follow",
      });
      lastStatus = response.status;
      const body = await response.text();
      if (response.ok && body.toLowerCase().includes("<html")) {
        return {
          slug: app.slug,
          previewUrl: app.previewUrl,
          status: response.status,
          verified: true,
        };
      }
      lastError = response.ok
        ? "response was not an HTML document"
        : `HTTP ${response.status}`;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    if (attempt < attempts) {
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
  return {
    slug: app.slug,
    previewUrl: app.previewUrl,
    status: lastStatus,
    verified: false,
    error: lastError,
  };
}

export async function verifyPreviewFleet(apps = catalogApps) {
  const results = [];
  for (let offset = 0; offset < apps.length; offset += concurrency) {
    const batch = apps.slice(offset, offset + concurrency);
    results.push(...(await Promise.all(batch.map(verify))));
  }
  return results;
}

const results = await verifyPreviewFleet();
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
const failures = results.filter(({ verified }) => !verified);
if (failures.length > 0) process.exitCode = 1;
