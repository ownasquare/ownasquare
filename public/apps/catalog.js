import { catalogApps, catalogCategories } from "./catalog-data.js";

const simplicityLabels = {
  simple: "Simple · about 2 clicks",
  moderate: "Moderate · about 5 clicks",
  dashboard: "Full dashboard",
};

const useCaseLabels = {
  personal: "Personal",
  education: "Education",
  business: "Business",
};

const matchesGroup = (selected, values) =>
  selected.size === 0 || values.some((value) => selected.has(value));

export function filterCatalog(apps, filters) {
  return apps.filter(
    (app) =>
      matchesGroup(filters.categories, [app.category]) &&
      matchesGroup(filters.useCases, app.useCases) &&
      matchesGroup(filters.simplicity, [app.simplicity]) &&
      matchesGroup(filters.availability, [
        app.availability,
        ...(app.popularDemand ? ["popular"] : []),
      ]),
  );
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text) {
    element.textContent = text;
  }

  return element;
}

function makeFilterOption({ group, value, label, count, disabled = false }) {
  const option = makeElement("label", "catalog-filter-option");
  const input = document.createElement("input");
  const copy = makeElement("span", "catalog-filter-copy");
  const optionLabel = makeElement("span", null, label);
  const optionCount = makeElement("span", "catalog-filter-count", String(count));

  input.type = "checkbox";
  input.value = value;
  input.dataset.filter = group;
  input.disabled = disabled;
  copy.append(optionLabel, optionCount);
  option.append(input, copy);

  return option;
}

function makeStatus(app) {
  const status = makeElement(
    "span",
    `catalog-status catalog-status-${app.availability}`,
    app.availability === "preview" ? "Public preview" : "Source available",
  );
  status.prepend(makeElement("i", null));
  status.querySelector("i").setAttribute("aria-hidden", "true");
  return status;
}

function makeAction({ href, label, primary = false }) {
  const action = makeElement(
    "a",
    `library-action${primary ? " library-action-primary" : ""}`,
  );
  const arrow = makeElement("span", null, "↗");

  action.href = href;
  action.target = href.startsWith("https://github.com/") ? "_blank" : "_self";
  if (action.target === "_blank") {
    action.rel = "noreferrer";
  }
  action.append(document.createTextNode(label), arrow);
  arrow.setAttribute("aria-hidden", "true");
  return action;
}

function makeCard(app) {
  const card = makeElement("article", "library-card catalog-card");
  const topLine = makeElement("div", "library-card-topline");
  const mark = makeElement(
    "span",
    `library-mark catalog-mark catalog-mark-${app.category}`,
    app.name
      .split(/[\s-]+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  );
  const category = makeElement("p", "card-label", app.categoryLabel);
  const title = makeElement("h3", null, app.name);
  const description = makeElement(
    "p",
    "library-card-summary",
    app.description,
  );
  const metadata = makeElement("div", "catalog-card-meta");
  const actions = makeElement("div", "library-actions");

  card.dataset.appSlug = app.slug;
  mark.setAttribute("aria-hidden", "true");
  topLine.append(mark, makeStatus(app));

  for (const useCase of app.useCases) {
    metadata.append(
      makeElement("span", "catalog-meta-pill", useCaseLabels[useCase]),
    );
  }
  metadata.append(
    makeElement(
      "span",
      "catalog-meta-pill catalog-meta-simplicity",
      simplicityLabels[app.simplicity],
    ),
  );

  if (app.popularDemand) {
    metadata.append(
      makeElement("span", "catalog-meta-pill catalog-meta-popular", "Popular demand"),
    );
  }

  if (app.previewUrl) {
    actions.append(
      makeAction({
        href: app.previewUrl,
        label: `Open ${app.name}`,
        primary: true,
      }),
    );
  } else {
    const unavailable = makeElement(
      "span",
      "library-action library-action-disabled",
      "Hosted preview not available",
    );
    unavailable.setAttribute("aria-label", `${app.name} hosted preview not available`);
    actions.append(unavailable);
  }

  actions.append(
    makeAction({
      href: app.sourceUrl,
      label: `View ${app.name} source`,
      primary: !app.previewUrl,
    }),
  );

  card.append(topLine, category, title, description, metadata, actions);
  return card;
}

function selectedFilters(filterPanel) {
  const filters = {
    categories: new Set(),
    useCases: new Set(),
    simplicity: new Set(),
    availability: new Set(),
  };

  for (const input of filterPanel.querySelectorAll("input[data-filter]:checked")) {
    filters[input.dataset.filter].add(input.value);
  }

  return filters;
}

function activeFilterCount(filters) {
  return Object.values(filters).reduce((total, values) => total + values.size, 0);
}

function initializeCatalog() {
  const grid = document.querySelector("[data-catalog-grid]");
  const filterPanel = document.querySelector("[data-filter-panel]");
  const categoryOptions = document.querySelector("[data-category-options]");
  const resultCount = document.querySelector("[data-result-count]");
  const clearButton = document.querySelector("[data-clear-filters]");
  const emptyState = document.querySelector("[data-empty-state]");
  const emptyClear = document.querySelector("[data-empty-clear]");
  const selectedCount = document.querySelector("[data-selected-filter-count]");
  const filterToggle = document.querySelector("[data-filter-toggle]");

  if (
    !grid ||
    !filterPanel ||
    !categoryOptions ||
    !resultCount ||
    !clearButton ||
    !emptyState ||
    !selectedCount
  ) {
    return;
  }

  for (const category of catalogCategories) {
    categoryOptions.append(
      makeFilterOption({
        group: "categories",
        value: category.value,
        label: category.label,
        count: catalogApps.filter((app) => app.category === category.value).length,
      }),
    );
  }

  const render = () => {
    const filters = selectedFilters(filterPanel);
    const results = filterCatalog(catalogApps, filters);
    const selected = activeFilterCount(filters);

    grid.replaceChildren(...results.map(makeCard));
    resultCount.textContent = `${results.length} ${results.length === 1 ? "app" : "apps"}`;
    selectedCount.textContent = String(selected);
    selectedCount.hidden = selected === 0;
    clearButton.disabled = selected === 0;
    emptyState.hidden = results.length !== 0;
    grid.hidden = results.length === 0;
  };

  const clearFilters = () => {
    for (const input of filterPanel.querySelectorAll("input[data-filter]:checked")) {
      input.checked = false;
    }
    render();
  };

  filterPanel.addEventListener("change", render);
  clearButton.addEventListener("click", clearFilters);
  emptyClear?.addEventListener("click", clearFilters);

  filterToggle?.addEventListener("click", () => {
    const expanded = filterToggle.getAttribute("aria-expanded") === "true";
    filterToggle.setAttribute("aria-expanded", String(!expanded));
    filterPanel.hidden = expanded;
  });

  render();
}

if (typeof document !== "undefined") {
  initializeCatalog();
}
