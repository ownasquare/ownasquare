const makeApp = ({
  slug,
  name,
  description,
  category,
  categoryLabel,
  useCases,
  simplicity,
  preview = false,
}) =>
  Object.freeze({
    slug,
    name,
    description,
    category,
    categoryLabel,
    useCases: Object.freeze(useCases),
    simplicity,
    availability: preview ? "preview" : "source",
    previewUrl: preview ? `https://${slug}.ownasquare.com` : null,
    sourceUrl: `https://github.com/ownasquare/${slug}`,
    popularDemand: false,
  });

export const catalogApps = Object.freeze([
  makeApp({
    slug: "ncr-family-lens",
    name: "NCR Family Lens",
    description:
      "Find likely-related nonconformance description families locally with complete source-row evidence.",
    category: "compliance",
    categoryLabel: "Compliance",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "personal-rag-system",
    name: "Personal RAG System",
    description:
      "Build a private document library and ask cited questions across your own source material.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["personal", "education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "session-minute-ledger",
    name: "Session Minute Ledger",
    description:
      "Create a source-linked factual minute ledger from one event attendance CSV without double-counting overlaps.",
    category: "events",
    categoryLabel: "Events",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "coverage-letter-map",
    name: "Coverage Letter Map",
    description:
      "Turn one insurer reservation-of-rights letter into a source-grounded preparation map.",
    category: "insurance",
    categoryLabel: "Insurance",
    useCases: ["personal", "business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "handoff-forge",
    name: "Handoff Forge",
    description:
      "Create validated, local-first project handoffs that help the next coding session resume with evidence.",
    category: "developer-tools",
    categoryLabel: "Developer tools",
    useCases: ["business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "laundry-odor-triage",
    name: "Laundry Odor Triage",
    description:
      "Get a bounded first-response plan for a recurring laundry odor without pretending to diagnose the cause.",
    category: "home",
    categoryLabel: "Home",
    useCases: ["personal"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "unitpath-coach",
    name: "UnitPath Coach",
    description:
      "Find the first broken step in a chemistry factor chain without handing over the answer.",
    category: "education",
    categoryLabel: "Education",
    useCases: ["education", "personal"],
    simplicity: "simple",
    preview: true,
  }),
  makeApp({
    slug: "split-ticket-rescue",
    name: "Split Ticket Rescue",
    description:
      "Turn one travel disruption and a separate onward ticket into a source-grounded recovery plan.",
    category: "travel",
    categoryLabel: "Travel",
    useCases: ["personal", "business"],
    simplicity: "simple",
    preview: true,
  }),
  makeApp({
    slug: "move-thesis",
    name: "Move Thesis",
    description:
      "Pressure-test one relocation idea through assumptions, a countercase, failure modes, and a small experiment.",
    category: "decisions",
    categoryLabel: "Decisions",
    useCases: ["personal"],
    simplicity: "simple",
    preview: true,
  }),
  makeApp({
    slug: "cleanout-reach-map",
    name: "Cleanout Reach Map",
    description:
      "Check modeled drainage cleanout reach coverage locally with source-linked intervals.",
    category: "field-operations",
    categoryLabel: "Field operations",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "cue-current",
    name: "Cue Current",
    description:
      "Run live event cues locally and preserve planned-versus-actual timing receipts.",
    category: "events",
    categoryLabel: "Events",
    useCases: ["personal", "business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "filing-rejection-index",
    name: "Filing Rejection Index",
    description:
      "Turn user-owned filing rejection notices into a local, source-linked issue ledger.",
    category: "compliance",
    categoryLabel: "Compliance",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "surge-sampler",
    name: "Surge Sampler",
    description:
      "Review questions with local-density-aware sampling instead of repeatedly seeing the same easy cluster.",
    category: "education",
    categoryLabel: "Education",
    useCases: ["education", "personal", "business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "org-chain-preflight",
    name: "Org Chain Preflight",
    description:
      "Check workforce hierarchy CSVs for broken reporting chains with source-linked findings.",
    category: "workforce",
    categoryLabel: "Workforce",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "doorfirst",
    name: "Doorfirst",
    description:
      "Catch rear-door pallet sequence conflicts before a multi-stop trailer is sealed.",
    category: "logistics",
    categoryLabel: "Logistics",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "inbound-case-note",
    name: "Inbound Case Note",
    description:
      "Turn one closed FBA shipment discrepancy table into a factual, copy-ready research-request note.",
    category: "ecommerce",
    categoryLabel: "Ecommerce",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "evalforge",
    name: "EvalForge",
    description:
      "Compare prompts and models with correctness, groundedness, relevance, safety, latency, and cost evidence.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "stakeholder-span",
    name: "Stakeholder Span",
    description:
      "Map renewal relationship concentration from stakeholder and interaction CSVs without sending the data away.",
    category: "customer-success",
    categoryLabel: "Customer success",
    useCases: ["business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "reserve-roll",
    name: "Reserve Roll",
    description:
      "Audit an Amazon settlement reserve roll-forward across consecutive reports with local evidence.",
    category: "finance",
    categoryLabel: "Finance",
    useCases: ["business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "overdelivery-preflight",
    name: "Overdelivery Preflight",
    description:
      "Decode self-serve ad budget exposure locally for individuals and small personal brands.",
    category: "marketing",
    categoryLabel: "Marketing",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "context-cut",
    name: "Context Cut",
    description:
      "Check proposed short-form video cuts against their local source context before publishing.",
    category: "media",
    categoryLabel: "Media",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "key-packet-press",
    name: "Key Packet Press",
    description:
      "Turn a local rooming list into an ordered, printable key-packet PDF.",
    category: "events",
    categoryLabel: "Events",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "beatcue",
    name: "BeatCue",
    description:
      "Build a local verbatim rehearsal cue deck for solo creators and presenters.",
    category: "media",
    categoryLabel: "Media",
    useCases: ["personal", "education", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "record-release-index",
    name: "Record Release Index",
    description:
      "Create an exact inventory and duplicate-aware manifest from one public-records ZIP.",
    category: "government",
    categoryLabel: "Government",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "status-light-trace",
    name: "Status Light Trace",
    description:
      "Turn a local camera sample into a literal status-light timing trace.",
    category: "hardware",
    categoryLabel: "Hardware",
    useCases: ["personal", "education", "business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "flakepacket",
    name: "FlakePacket",
    description:
      "Create deterministic JUnit retry evidence packets for developer reliability work.",
    category: "developer-tools",
    categoryLabel: "Developer tools",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "punch-freeze-diff",
    name: "Punch Freeze Diff",
    description:
      "Compare punch-list CSV revisions locally and preserve source-row evidence for every drift.",
    category: "construction",
    categoryLabel: "Construction",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "swap-roster-receipt",
    name: "Swap Roster Receipt",
    description:
      "Reconcile an approved shift swap against the current roster and produce a local receipt.",
    category: "workforce",
    categoryLabel: "Workforce",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "plow-gap-map",
    name: "Plow Gap Map",
    description:
      "Compare a planned GeoJSON route with an actual GPX track and map likely missed segments.",
    category: "field-operations",
    categoryLabel: "Field operations",
    useCases: ["business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "roster-fit",
    name: "Roster Fit",
    description:
      "Build a fair, maximum-coverage nonprofit volunteer roster entirely in the browser.",
    category: "workforce",
    categoryLabel: "Workforce",
    useCases: ["personal", "business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "handofflint",
    name: "HandoffLint",
    description:
      "Check sales-to-customer-success handoff notes for documented readiness gaps.",
    category: "sales",
    categoryLabel: "Sales",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "access-review-lint",
    name: "Access Review Lint",
    description:
      "Check offline access-review CSV evidence for missing readiness details.",
    category: "security",
    categoryLabel: "Privacy & security",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "credential-calendar-maker",
    name: "Credential Calendar Maker",
    description:
      "Turn a local credential-expiry CSV into a calendar without uploading the source.",
    category: "compliance",
    categoryLabel: "Compliance",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "addendum-echo",
    name: "Addendum Echo",
    description:
      "Check public-works bid proposals for local addendum acknowledgment evidence.",
    category: "government",
    categoryLabel: "Government",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "reimburse-binder",
    name: "Reimburse Binder",
    description:
      "Build one ordered, indexed reimbursement PDF from local support files.",
    category: "finance",
    categoryLabel: "Finance",
    useCases: ["personal", "business"],
    simplicity: "moderate",
  }),
  makeApp({
    slug: "exhibit-gap",
    name: "Exhibit Gap",
    description:
      "Preflight a contract locally for referenced attachments that are missing from the supplied files.",
    category: "legal",
    categoryLabel: "Legal",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "inspect-receipt",
    name: "Inspect Receipt",
    description:
      "Check municipal inspection email scheduling wording privately and locally.",
    category: "government",
    categoryLabel: "Government",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "dwell-docket",
    name: "Dwell Docket",
    description:
      "Turn one stop CSV into a local detention reconciliation docket.",
    category: "logistics",
    categoryLabel: "Logistics",
    useCases: ["business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "notedock",
    name: "NoteDock",
    description:
      "Turn scattered video revision notes into one sorted, source-preserving local checklist.",
    category: "media",
    categoryLabel: "Media",
    useCases: ["personal", "business"],
    simplicity: "simple",
  }),
  makeApp({
    slug: "context-loom",
    name: "Context Loom",
    description:
      "Compile local, fidelity-audited context packages for AI chat harnesses.",
    category: "developer-tools",
    categoryLabel: "Developer tools",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "ticket-tune",
    name: "Ticket Tune",
    description:
      "Fine-tune and locally deploy structured support-ticket triage models with reproducible evidence.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "human-in-the-loop-agent",
    name: "Human-in-the-Loop Agent",
    description:
      "Run an approval-first agent workflow with durable human review before consequential actions.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "multimodal-document-intelligence",
    name: "Multimodal Document Intelligence",
    description:
      "Ask cited questions across local document text, tables, charts, images, diagrams, and scans.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["personal", "education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "dataset-foundry",
    name: "Dataset Foundry",
    description:
      "Generate, filter, review, and export local synthetic training data for fine-tuning.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "atlas-agent",
    name: "Atlas Agent",
    description:
      "Plan complex work, use tools safely, review outcomes, and retain useful local context.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["personal", "education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "patchscope",
    name: "PatchScope",
    description:
      "Review a codebase with cited evidence and stage safer, inspectable refactors.",
    category: "developer-tools",
    categoryLabel: "Developer tools",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "privacy-first-local-llm",
    name: "Privacy-First Local LLM",
    description:
      "Run a private local chat and document workspace with Ollama, Open WebUI, and Chroma.",
    category: "security",
    categoryLabel: "Privacy & security",
    useCases: ["personal", "education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "codebase-intelligence",
    name: "Codebase Intelligence",
    description:
      "Ask questions about a codebase and inspect the cited source behind every answer.",
    category: "developer-tools",
    categoryLabel: "Developer tools",
    useCases: ["education", "business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "llm-observability-platform",
    name: "LLM Observability Platform",
    description:
      "Track provider-neutral LLM cost, latency, quality analytics, and operational alerts.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["business"],
    simplicity: "dashboard",
  }),
  makeApp({
    slug: "autonomous-research-system",
    name: "Autonomous Research System",
    description:
      "Run source-grounded multi-agent research with durable memory and cited reports.",
    category: "ai-research",
    categoryLabel: "AI & research",
    useCases: ["personal", "education", "business"],
    simplicity: "dashboard",
  }),
]);

export const catalogCategories = Object.freeze(
  [...new Map(catalogApps.map((app) => [app.category, app.categoryLabel]))]
    .map(([value, label]) => Object.freeze({ value, label }))
    .sort((left, right) => left.label.localeCompare(right.label)),
);
