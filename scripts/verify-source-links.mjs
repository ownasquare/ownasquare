import { catalogApps } from "../public/apps/catalog-data.js";

const concurrency = 8;

async function verify(app) {
  try {
    const response = await fetch(app.sourceUrl, {
      method: "HEAD",
      redirect: "follow",
      headers: {
        "User-Agent": "OwnASquare-catalog-verifier",
      },
    });
    return {
      slug: app.slug,
      sourceUrl: app.sourceUrl,
      status: response.status,
      verified: response.ok,
    };
  } catch (error) {
    return {
      slug: app.slug,
      sourceUrl: app.sourceUrl,
      status: 0,
      verified: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = [];
for (let offset = 0; offset < catalogApps.length; offset += concurrency) {
  results.push(
    ...(await Promise.all(
      catalogApps.slice(offset, offset + concurrency).map(verify),
    )),
  );
}

process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
if (results.some(({ verified }) => !verified)) process.exitCode = 1;
