import { spawn } from "node:child_process";
import {
  access,
  copyFile,
  cp,
  mkdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { catalogApps } from "../public/apps/catalog-data.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const workspaceRoot = path.resolve(scriptDirectory, "../..");
export const buildRoot = path.resolve(scriptDirectory, "../.preview-build");
const configRoot = path.join(buildRoot, "configs");
const secretSafeExecutable =
  "/Users/fortunevieyra/.codex/bin/codex-secret-safe-exec.py";

const screenshot = (repositoryPath, relativePath) =>
  path.join(repositoryPath, relativePath);

export const remainingPreviews = Object.freeze([
  {
    slug: "inbound-case-note",
    repositoryPath: "factory-apps/lane-06/inbound-case-note",
    kind: "static",
    copies: [
      { from: "public", to: "." },
      { from: "src", to: "src" },
    ],
    test: true,
  },
  {
    slug: "reserve-roll",
    repositoryPath: "factory-apps/lane-06/reserve-roll",
    kind: "static",
    copies: [
      { from: "public", to: "." },
      { from: "src", to: "src" },
    ],
    test: true,
  },
  {
    slug: "credential-calendar-maker",
    repositoryPath: "factory-apps/lane-12/credential-calendar-maker",
    kind: "static",
    copies: [
      { from: "index.html", to: "index.html" },
      { from: "src", to: "src" },
    ],
    test: true,
  },
  {
    slug: "inspect-receipt",
    repositoryPath: "factory-apps/lane-19/inspect-receipt",
    kind: "static",
    copies: [
      { from: "index.html", to: "index.html" },
      { from: "src", to: "src" },
    ],
    test: true,
  },
  {
    slug: "dwell-docket",
    repositoryPath: "factory-apps/lane-14/dwell-docket",
    kind: "static",
    copies: [
      { from: "index.html", to: "index.html" },
      { from: "src", to: "src" },
    ],
    test: true,
  },
  {
    slug: "notedock",
    repositoryPath: "factory-apps/lane-05/notedock",
    kind: "static",
    copies: [
      { from: "index.html", to: "index.html" },
      { from: "styles.css", to: "styles.css" },
      { from: "src", to: "src" },
    ],
    test: true,
  },
  {
    slug: "context-loom",
    repositoryPath: "context-loom",
    kind: "vite",
    buildPath: "frontend",
    previewPath: "/?demo=1",
  },
  {
    slug: "dataset-foundry",
    repositoryPath: "dataset-foundry",
    kind: "vite",
    buildPath: "frontend",
    buildEnvironment: { VITE_DEMO_MODE: "true" },
    prebuildScripts: ["typecheck"],
  },
  {
    slug: "personal-rag-system",
    repositoryPath: "personal-rag-system",
    kind: "showcase",
    screenshotPath: screenshot(
      "personal-rag-system",
      "docs/assets/personal-library-overview.jpg",
    ),
  },
  {
    slug: "handoff-forge",
    repositoryPath: "ai-harness-handoff-system",
    kind: "showcase",
    screenshotPath: screenshot(
      "ai-harness-handoff-system",
      "docs/assets/handoff-workbench-desktop.png",
    ),
  },
  {
    slug: "evalforge",
    repositoryPath: "llm-evaluation-dashboard",
    kind: "showcase",
    screenshotPath: screenshot(
      "llm-evaluation-dashboard",
      "docs/assets/evalforge-results.png",
    ),
  },
  {
    slug: "flakepacket",
    repositoryPath: "factory-apps/lane-03/flakepacket",
    kind: "showcase",
  },
  {
    slug: "handofflint",
    repositoryPath: "factory-apps/lane-04/handofflint",
    kind: "showcase",
  },
  {
    slug: "access-review-lint",
    repositoryPath: "factory-apps/lane-10/access-review-lint",
    kind: "showcase",
  },
  {
    slug: "exhibit-gap",
    repositoryPath: "factory-apps/lane-11/exhibit-gap",
    kind: "showcase",
    screenshotPath: screenshot(
      "factory-apps/lane-11/exhibit-gap",
      "proof/browser/desktop-light.png",
    ),
  },
  {
    slug: "ticket-tune",
    repositoryPath: "ticket-tune",
    kind: "showcase",
  },
  {
    slug: "human-in-the-loop-agent",
    repositoryPath: "human-in-the-loop-agent",
    kind: "showcase",
    screenshotPath: screenshot(
      "human-in-the-loop-agent",
      "docs/assets/relay-approval-workflow.jpg",
    ),
  },
  {
    slug: "multimodal-document-intelligence",
    repositoryPath: "multimodal-document-intelligence",
    kind: "showcase",
    screenshotPath: screenshot(
      "multimodal-document-intelligence",
      "docs/assets/document-intelligence-workspace.png",
    ),
  },
  {
    slug: "atlas-agent",
    repositoryPath: "atlas-agent",
    kind: "showcase",
  },
  {
    slug: "patchscope",
    repositoryPath: "patchscope",
    kind: "showcase",
  },
  {
    slug: "privacy-first-local-llm",
    repositoryPath: "privacy-first-local-llm",
    kind: "showcase",
  },
  {
    slug: "codebase-intelligence",
    repositoryPath: "codebase-intelligence",
    kind: "showcase",
  },
  {
    slug: "llm-observability-platform",
    repositoryPath: "llm-observability-platform",
    kind: "showcase",
  },
  {
    slug: "autonomous-research-system",
    repositoryPath: "autonomous-research-system",
    kind: "showcase",
  },
]);

function commandEnvironment(overrides = {}) {
  const environment = { ...process.env, ...overrides };
  delete environment.CLOUDFLARE_ACCOUNT_ID;
  return environment;
}

function run(command, args, cwd, environment = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      secretSafeExecutable,
      ["--unset", "CLOUDFLARE_ACCOUNT_ID", "--", command, ...args],
      {
        cwd,
        env: commandEnvironment(environment),
        stdio: "inherit",
      },
    );
    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `${command} ${args.join(" ")} failed with ${
            signal ? `signal ${signal}` : `exit ${code}`
          }`,
        ),
      );
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function simplicityCopy(simplicity) {
  if (simplicity === "simple") return "A focused path in about two clicks.";
  if (simplicity === "moderate") return "A guided workflow in about five clicks.";
  return "A full workspace for multi-step work.";
}

function showcaseHtml(app, screenshotFile) {
  const useCases = app.useCases
    .map((useCase) => `<span>${escapeHtml(useCase)}</span>`)
    .join("");
  const screenshotMarkup = screenshotFile
    ? `<figure class="preview-frame">
        <img src="/${escapeHtml(screenshotFile)}" alt="${escapeHtml(app.name)} interface preview" />
        <figcaption>Repository-owned interface proof</figcaption>
      </figure>`
    : `<div class="preview-frame preview-map" aria-label="Product workflow preview">
        <div><span>01</span><strong>Bring your source</strong><small>Keep the work scoped to the material you control.</small></div>
        <div><span>02</span><strong>Review the evidence</strong><small>See the bounded workflow before running the full stack.</small></div>
        <div><span>03</span><strong>Keep the result</strong><small>Use the public source when you need full local processing.</small></div>
      </div>`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light dark" />
    <meta name="description" content="${escapeHtml(app.description)}" />
    <title>${escapeHtml(app.name)} — OwnASquare hosted preview</title>
    <link rel="stylesheet" href="/styles.css" />
    <script src="/app.js" defer></script>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to preview</a>
    <header>
      <a class="brand" href="https://ownasquare.com/apps/">
        <i aria-hidden="true"><b></b><b></b><b></b><b></b></i>
        OwnASquare
      </a>
      <span class="status"><i aria-hidden="true"></i> Hosted product preview</span>
    </header>
    <main id="main">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(app.categoryLabel)}</p>
          <h1>${escapeHtml(app.name)}</h1>
          <p class="lede">${escapeHtml(app.description)}</p>
          <div class="tags">${useCases}<span>${escapeHtml(simplicityCopy(app.simplicity))}</span></div>
          <div class="actions">
            <button type="button" data-explore>Explore the workflow <span aria-hidden="true">↓</span></button>
            <a href="${escapeHtml(app.sourceUrl)}" target="_blank" rel="noreferrer">View open source <span aria-hidden="true">↗</span></a>
          </div>
        </div>
        ${screenshotMarkup}
      </section>
      <section class="tour" data-tour tabindex="-1">
        <div class="tour-heading">
          <div>
            <p class="eyebrow">What this preview proves</p>
            <h2>See the product shape before running the stack.</h2>
          </div>
          <p>This public page is a read-only interface and workflow tour. It does not run the repository’s private, local, Python, model, or provider-backed processing.</p>
        </div>
        <div class="tour-tabs" role="tablist" aria-label="Preview details">
          <button role="tab" aria-selected="true" data-tab="purpose">Purpose</button>
          <button role="tab" aria-selected="false" data-tab="flow">Typical flow</button>
          <button role="tab" aria-selected="false" data-tab="boundary">Runtime boundary</button>
        </div>
        <div class="tour-panel" data-panel="purpose">
          <p class="eyebrow">One narrow job</p>
          <h3>${escapeHtml(app.description)}</h3>
          <p>The hosted tour keeps the product idea inspectable without collecting your documents, credentials, or project data.</p>
        </div>
        <div class="tour-panel" data-panel="flow" hidden>
          <p class="eyebrow">A clear path</p>
          <ol><li>Open or select the source material in your own runtime.</li><li>Review the app’s bounded analysis or workflow.</li><li>Export or act on the result with the source evidence beside it.</li></ol>
        </div>
        <div class="tour-panel" data-panel="boundary" hidden>
          <p class="eyebrow">Truthful availability</p>
          <h3>The interface is public. Full processing stays with the source.</h3>
          <p>Clone the repository to run the complete application, its local services, and any optional model or provider integrations.</p>
          <a class="inline-link" href="${escapeHtml(app.sourceUrl)}" target="_blank" rel="noreferrer">Open ${escapeHtml(app.name)} on GitHub ↗</a>
        </div>
      </section>
    </main>
    <footer><span>${escapeHtml(app.name)}</span><a href="https://ownasquare.com/apps/">Back to the app library</a></footer>
  </body>
</html>`;
}

const showcaseCss = `:root{font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#151611;background:#f4f1e8;font-synthesis:none}*{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(circle at 80% 12%,rgba(255,106,61,.13),transparent 30%),#f4f1e8}a{color:inherit}.skip-link{position:fixed;left:1rem;top:1rem;transform:translateY(-200%);background:#151611;color:#fff;padding:.75rem 1rem;z-index:10}.skip-link:focus{transform:none}header,main,footer{width:min(1180px,calc(100% - 40px));margin-inline:auto}header{height:96px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;align-items:center;gap:.7rem;text-decoration:none;font-weight:850}.brand i{display:grid;grid-template-columns:repeat(2,7px);gap:2px}.brand b{width:7px;height:7px;background:#151611;border-radius:1px}.brand b:nth-child(2){background:#ff6a3d}.status{display:flex;align-items:center;gap:.55rem;border:1px solid #ccc8bd;border-radius:999px;padding:.55rem .8rem;font-size:.78rem;font-weight:750}.status i{width:9px;height:9px;border-radius:50%;background:#baf04c;box-shadow:0 0 0 4px rgba(186,240,76,.2)}.hero{min-height:650px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(420px,1.1fr);align-items:center;gap:5rem;padding:4rem 0 6rem}.eyebrow{text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;font-weight:850;color:#68685f}.hero h1{font-size:clamp(3.6rem,7vw,7.3rem);line-height:.82;letter-spacing:-.075em;margin:1.1rem 0 2rem;max-width:8ch}.lede{font-size:clamp(1.2rem,2.2vw,1.65rem);line-height:1.45;color:#5f6057;max-width:33rem}.tags{display:flex;flex-wrap:wrap;gap:.55rem;margin:2rem 0}.tags span{border:1px solid #cbc8bd;border-radius:999px;padding:.45rem .7rem;font-size:.74rem;text-transform:capitalize}.actions{display:flex;flex-wrap:wrap;gap:.75rem}.actions button,.actions a{border:1px solid #151611;border-radius:14px;padding:1rem 1.15rem;font:inherit;font-weight:800;text-decoration:none;cursor:pointer}.actions button{background:#151611;color:#fff}.actions a{background:transparent}.preview-frame{border:1px solid #cbc8bd;border-radius:28px;background:#fbfaf6;box-shadow:0 35px 90px rgba(28,27,22,.12);overflow:hidden;min-height:430px;margin:0}.preview-frame img{display:block;width:100%;height:430px;object-fit:cover;object-position:top}.preview-frame figcaption{padding:.8rem 1rem;font-size:.73rem;color:#6a6a62}.preview-map{padding:1.1rem;display:grid;gap:.8rem;align-content:center}.preview-map div{min-height:112px;border:1px solid #d9d6cb;border-radius:18px;padding:1rem;display:grid;grid-template-columns:3rem 1fr;column-gap:.75rem}.preview-map span{grid-row:1/3;display:grid;place-items:center;width:2.5rem;height:2.5rem;border-radius:12px;background:#baf04c;font-weight:850}.preview-map strong{font-size:1.05rem}.preview-map small{color:#68685f;line-height:1.4;margin-top:.3rem}.tour{border-top:1px solid #cbc8bd;padding:6rem 0}.tour-heading{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:end}.tour-heading h2{font-size:clamp(2.4rem,5vw,4.7rem);letter-spacing:-.055em;line-height:.95;margin:.8rem 0}.tour-heading>p{font-size:1.05rem;color:#66665e;line-height:1.6}.tour-tabs{display:flex;gap:.5rem;margin:3rem 0 1rem}.tour-tabs button{border:1px solid #cbc8bd;border-radius:999px;padding:.7rem 1rem;background:transparent;font:inherit;font-size:.8rem;font-weight:750;cursor:pointer}.tour-tabs button[aria-selected=true]{background:#151611;color:#fff;border-color:#151611}.tour-panel{border:1px solid #cbc8bd;border-radius:24px;background:#fbfaf6;padding:clamp(1.5rem,4vw,3rem);min-height:250px}.tour-panel h3{font-size:clamp(1.8rem,4vw,3.3rem);letter-spacing:-.04em;line-height:1.05;max-width:22ch}.tour-panel>p:not(.eyebrow),.tour-panel li{font-size:1rem;line-height:1.65;color:#65655d}.tour-panel ol{display:grid;gap:.65rem}.inline-link{display:inline-block;margin-top:1rem;font-weight:850}footer{height:130px;border-top:1px solid #cbc8bd;display:flex;align-items:center;justify-content:space-between;font-size:.8rem;font-weight:700}@media(max-width:850px){.hero{grid-template-columns:1fr;gap:3rem;padding-top:2rem}.preview-frame{min-height:320px}.preview-frame img{height:320px}.tour-heading{grid-template-columns:1fr}.hero h1{font-size:clamp(3.4rem,16vw,6rem)}}@media(max-width:520px){header,main,footer{width:min(100% - 28px,1180px)}header{height:80px}.status{font-size:0;width:42px;height:42px;justify-content:center}.status i{margin:0}.hero{padding-bottom:4rem}.actions{display:grid}.actions button,.actions a{text-align:center}.tour{padding:4rem 0}.tour-tabs{overflow-x:auto}.tour-tabs button{white-space:nowrap}footer{align-items:flex-start;justify-content:center;flex-direction:column;gap:.5rem}}@media(prefers-color-scheme:dark){:root{color:#f5f1e8;background:#10110e}body{background:radial-gradient(circle at 80% 12%,rgba(255,106,61,.12),transparent 30%),#10110e}.brand b{background:#f5f1e8}.brand b:nth-child(2){background:#ff6a3d}.status,.tags span,.preview-frame,.preview-map div,.tour,.tour-tabs button,.tour-panel,footer{border-color:#34362f}.preview-frame,.tour-panel{background:#171914}.lede,.tour-heading>p,.tour-panel>p:not(.eyebrow),.tour-panel li,.preview-map small{color:#adaea4}.actions button,.tour-tabs button[aria-selected=true]{background:#f5f1e8;color:#11120f;border-color:#f5f1e8}.actions a{border-color:#f5f1e8}}`;

const showcaseScript = `const explore=document.querySelector("[data-explore]");const tour=document.querySelector("[data-tour]");explore?.addEventListener("click",()=>{tour?.scrollIntoView({behavior:"smooth",block:"start"});tour?.focus({preventScroll:true})});const tabs=[...document.querySelectorAll("[data-tab]")];const panels=[...document.querySelectorAll("[data-panel]")];for(const tab of tabs){tab.addEventListener("click",()=>{for(const candidate of tabs)candidate.setAttribute("aria-selected",String(candidate===tab));for(const panel of panels)panel.hidden=panel.dataset.panel!==tab.dataset.tab})}`;

async function copyEntry(sourceRoot, outputRoot, copy) {
  const source = path.join(sourceRoot, copy.from);
  const destination = path.join(outputRoot, copy.to);
  const sourceStats = await stat(source);
  await mkdir(path.dirname(destination), { recursive: true });
  if (sourceStats.isDirectory()) {
    await cp(source, destination, { recursive: true });
  } else {
    await copyFile(source, destination);
  }
}

async function testStaticRepository(repositoryDirectory) {
  const packageJson = JSON.parse(
    await readFile(path.join(repositoryDirectory, "package.json"), "utf8"),
  );
  await run("npm", ["ci"], repositoryDirectory);
  if (packageJson.scripts?.test) {
    await run("npm", ["test"], repositoryDirectory);
  } else if (packageJson.scripts?.["test:unit"]) {
    await run("npm", ["run", "test:unit"], repositoryDirectory);
  }
}

async function prepareStatic(entry, repositoryDirectory, outputDirectory) {
  if (entry.test) await testStaticRepository(repositoryDirectory);
  for (const copy of entry.copies) {
    await copyEntry(repositoryDirectory, outputDirectory, copy);
  }
}

async function prepareVite(entry, repositoryDirectory, outputDirectory) {
  const buildDirectory = path.join(
    repositoryDirectory,
    entry.buildPath ?? ".",
  );
  await run("npm", ["ci"], buildDirectory, entry.buildEnvironment);
  for (const script of entry.prebuildScripts ?? []) {
    await run(
      "npm",
      ["run", script],
      buildDirectory,
      entry.buildEnvironment,
    );
  }
  await run(
    "npm",
    ["run", "build", "--", "--outDir", outputDirectory, "--emptyOutDir"],
    buildDirectory,
    entry.buildEnvironment,
  );
}

async function prepareShowcase(
  entry,
  repositoryDirectory,
  outputDirectory,
) {
  const app = catalogApps.find(({ slug }) => slug === entry.slug);
  if (!app) throw new Error(`${entry.slug} is missing from the catalog`);
  await access(path.join(repositoryDirectory, "README.md"));
  let screenshotFile = null;
  if (entry.screenshotPath) {
    const screenshotSource = path.join(workspaceRoot, entry.screenshotPath);
    await access(screenshotSource);
    screenshotFile = `interface-preview${path.extname(screenshotSource)}`;
    await copyFile(
      screenshotSource,
      path.join(outputDirectory, screenshotFile),
    );
  }
  await writeFile(
    path.join(outputDirectory, "index.html"),
    showcaseHtml(app, screenshotFile),
  );
  await writeFile(path.join(outputDirectory, "styles.css"), showcaseCss);
  await writeFile(path.join(outputDirectory, "app.js"), showcaseScript);
}

async function preparePreview(entry) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) {
    throw new Error(`Unsafe preview slug: ${entry.slug}`);
  }
  const repositoryDirectory = path.join(
    workspaceRoot,
    entry.repositoryPath,
  );
  const outputDirectory = path.join(buildRoot, entry.slug);
  await access(repositoryDirectory);
  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory, { recursive: true });
  if (entry.kind === "static") {
    await prepareStatic(entry, repositoryDirectory, outputDirectory);
  } else if (entry.kind === "vite") {
    await prepareVite(entry, repositoryDirectory, outputDirectory);
  } else if (entry.kind === "showcase") {
    await prepareShowcase(entry, repositoryDirectory, outputDirectory);
  } else {
    throw new Error(`Unknown preview kind: ${entry.kind}`);
  }
  return outputDirectory;
}

async function writePreviewConfig(entry, outputDirectory) {
  await mkdir(configRoot, { recursive: true });
  const configPath = path.join(configRoot, `${entry.slug}.jsonc`);
  const config = {
    name: `ownasquare-${entry.slug}`,
    compatibility_date: "2026-07-29",
    workers_dev: true,
    preview_urls: false,
    assets: {
      directory: outputDirectory,
      not_found_handling: "single-page-application",
    },
    routes: [
      {
        pattern: `${entry.slug}.ownasquare.com`,
        custom_domain: true,
      },
    ],
  };
  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`);
  return configPath;
}

async function verifyPreview(entry) {
  const suffix = entry.previewPath ?? "/";
  const url = new URL(suffix, `https://${entry.slug}.ownasquare.com`);
  let lastStatus = 0;
  for (let attempt = 1; attempt <= 20; attempt += 1) {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
    });
    lastStatus = response.status;
    if (response.ok) {
      const body = await response.text();
      if (!body.toLowerCase().includes("<html")) {
        throw new Error(`${url} did not return an HTML document`);
      }
      return response.status;
    }
    if (attempt < 20) {
      await new Promise((resolve) => setTimeout(resolve, 3_000));
    }
  }
  throw new Error(`${url} returned HTTP ${lastStatus}`);
}

export async function deployRemainingPreviews(entries = remainingPreviews) {
  const results = [];
  await mkdir(buildRoot, { recursive: true });
  for (const entry of entries) {
    const publicUrl = new URL(
      entry.previewPath ?? "/",
      `https://${entry.slug}.ownasquare.com`,
    ).href;
    try {
      const outputDirectory = await preparePreview(entry);
      const configPath = await writePreviewConfig(entry, outputDirectory);
      await run(
        "npx",
        [
          "wrangler",
          "deploy",
          "--config",
          configPath,
          "--profile",
          "ownasquare",
        ],
        scriptDirectory,
      );
      const status = await verifyPreview(entry);
      results.push({ ...entry, publicUrl, status, deployed: true });
    } catch (error) {
      results.push({
        ...entry,
        publicUrl,
        deployed: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return results;
}

const invokedPath = process.argv[1]
  ? pathToFileURL(path.resolve(process.argv[1])).href
  : null;

if (invokedPath === import.meta.url) {
  const requestedSlugs = new Set(process.argv.slice(2));
  const entries =
    requestedSlugs.size === 0
      ? remainingPreviews
      : remainingPreviews.filter((entry) =>
          requestedSlugs.has(entry.slug),
        );
  const missing = [...requestedSlugs].filter(
    (slug) => !entries.some((entry) => entry.slug === slug),
  );
  if (missing.length > 0) {
    throw new Error(`Unknown preview slug(s): ${missing.join(", ")}`);
  }
  const results = await deployRemainingPreviews(entries);
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  if (results.some((result) => !result.deployed)) process.exitCode = 1;
}
