import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const workspaceRoot = path.resolve(scriptDirectory, "../..");
const secretSafeExecutable =
  "/Users/fortunevieyra/.codex/bin/codex-secret-safe-exec.py";

export const previewBatch = Object.freeze([
  {
    slug: "cue-current",
    repositoryPath: "factory-apps/lane-16/cue-current",
  },
  {
    slug: "filing-rejection-index",
    repositoryPath: "factory-apps/lane-11/filing-rejection-index",
  },
  {
    slug: "surge-sampler",
    repositoryPath: "factory-apps/lane-22/surge-sampler",
  },
  {
    slug: "org-chain-preflight",
    repositoryPath: "factory-apps/lane-12/org-chain-preflight",
  },
  {
    slug: "doorfirst",
    repositoryPath: "factory-apps/lane-14/doorfirst",
  },
  {
    slug: "stakeholder-span",
    repositoryPath: "factory-apps/lane-04/stakeholder-span",
  },
  {
    slug: "overdelivery-preflight",
    repositoryPath: "factory-apps/lane-29/overdelivery-preflight",
  },
  {
    slug: "context-cut",
    repositoryPath: "factory-apps/lane-27/context-cut",
  },
  {
    slug: "key-packet-press",
    repositoryPath: "factory-apps/lane-16/key-packet-press",
  },
  {
    slug: "beatcue",
    repositoryPath: "factory-apps/lane-23/beatcue",
  },
  {
    slug: "record-release-index",
    repositoryPath: "factory-apps/lane-19/record-release-index",
  },
  {
    slug: "status-light-trace",
    repositoryPath: "factory-apps/lane-18/status-light-trace",
  },
  {
    slug: "punch-freeze-diff",
    repositoryPath: "factory-apps/lane-13/punch-freeze-diff",
  },
  {
    slug: "swap-roster-receipt",
    repositoryPath: "factory-apps/lane-12/swap-roster-receipt",
  },
  {
    slug: "plow-gap-map",
    repositoryPath: "factory-apps/lane-14/plow-gap-map",
  },
  {
    slug: "roster-fit",
    repositoryPath: "factory-apps/lane-17/roster-fit",
  },
  {
    slug: "addendum-echo",
    repositoryPath: "factory-apps/lane-13/addendum-echo",
  },
  {
    slug: "reimburse-binder",
    repositoryPath: "factory-apps/lane-17/reimburse-binder",
  },
]);

function commandEnvironment() {
  const environment = { ...process.env };
  delete environment.CLOUDFLARE_ACCOUNT_ID;
  return environment;
}

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      secretSafeExecutable,
      ["--unset", "CLOUDFLARE_ACCOUNT_ID", "--", command, ...args],
      {
        cwd,
        env: commandEnvironment(),
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

async function testCommand(repositoryDirectory) {
  const packageJson = JSON.parse(
    await readFile(path.join(repositoryDirectory, "package.json"), "utf8"),
  );
  if (packageJson.scripts?.test) return ["test"];
  if (packageJson.scripts?.["test:unit"]) return ["run", "test:unit"];
  return null;
}

async function verifyPreview(slug) {
  const url = `https://${slug}.ownasquare.com`;
  let lastStatus = 0;
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    const response = await fetch(url, { method: "HEAD", redirect: "follow" });
    lastStatus = response.status;
    if (response.ok) return response.status;
    if (attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 2_000));
    }
  }
  throw new Error(`${url} returned HTTP ${lastStatus}`);
}

export async function deployPreviewBatch(entries = previewBatch) {
  const results = [];
  for (const entry of entries) {
    const repositoryDirectory = path.join(
      workspaceRoot,
      entry.repositoryPath,
    );
    const publicUrl = `https://${entry.slug}.ownasquare.com`;
    try {
      await run("npm", ["ci"], repositoryDirectory);
      const testArgs = await testCommand(repositoryDirectory);
      if (testArgs) await run("npm", testArgs, repositoryDirectory);
      await run("npm", ["run", "build"], repositoryDirectory);
      await run(
        "npx",
        [
          "wrangler",
          "deploy",
          "dist",
          "--name",
          `ownasquare-${entry.slug}`,
          "--domain",
          `${entry.slug}.ownasquare.com`,
          "--compatibility-date",
          "2026-07-29",
          "--profile",
          "ownasquare",
        ],
        repositoryDirectory,
      );
      const status = await verifyPreview(entry.slug);
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
      ? previewBatch
      : previewBatch.filter((entry) => requestedSlugs.has(entry.slug));
  const missing = [...requestedSlugs].filter(
    (slug) => !entries.some((entry) => entry.slug === slug),
  );
  if (missing.length > 0) {
    throw new Error(`Unknown preview slug(s): ${missing.join(", ")}`);
  }
  const results = await deployPreviewBatch(entries);
  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
  if (results.some((result) => !result.deployed)) process.exitCode = 1;
}
