(() => {
  "use strict";
  const panels = [...document.querySelectorAll('#featurePanels > [data-panel]')];
  const overview = document.getElementById("overviewPage");
  const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "d").toLocaleLowerCase("vi").replace(/\s+/g, " ").trim();
  const searchable = "label, button, summary, legend, h2, h3, h4, .hint, .feature-status, .field-title, dt";
  let highlighted = null, highlightTimer = null;

  function highlightResult(entry) {
    clearTimeout(highlightTimer);
    highlighted?.classList.remove("feature-search-highlight");
    highlighted = null;
    highlighted = entry.highlight;
    highlighted?.classList.add("feature-search-highlight");
    highlightTimer = setTimeout(() => {
      highlighted?.classList.remove("feature-search-highlight");
      highlighted = null;
    }, 2800);
  }

  function addSearch(host, { global = false, inside = false, alwaysOpen = false, title = "Tìm trong tính năng này" } = {}) {
    const tools = document.createElement("div");
    tools.className = `feature-search${global ? " feature-search-global" : ""}${alwaysOpen ? " feature-search-always" : ""}`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "feature-search-toggle";
    button.textContent = global ? "⌕  Tìm mọi tính năng" : "⌕  Tìm trong tính năng này";
    button.setAttribute("aria-expanded", String(alwaysOpen));
    button.setAttribute("aria-label", title);
    const area = document.createElement("div");
    area.className = "feature-search-area";
    area.hidden = !alwaysOpen;
    const input = document.createElement("input");
    input.type = "search";
    input.autocomplete = "off";
    input.placeholder = global ? "Tìm trong tất cả tính năng…" : "Tìm cài đặt trong tính năng này…";
    input.setAttribute("aria-label", input.placeholder);
    const status = document.createElement("p");
    status.className = "feature-search-status";
    status.setAttribute("role", "status");
    const results = document.createElement("div");
    results.className = "feature-search-results";
    area.append(input, status, results);
    tools.append(button, area);
    if (inside) host.prepend(tools);
    else host.insertAdjacentElement("afterend", tools);

    button.addEventListener("click", (event) => {
      event.preventDefault(); event.stopPropagation();
      const opening = area.hidden;
      area.hidden = !opening;
      button.setAttribute("aria-expanded", String(opening));
      if (opening) input.focus(); else { input.value = ""; render(); }
    });

    function collect() {
      const scopes = global ? panels : [host.closest("[data-panel]")];
      const entries = [], seen = new Set();
      for (const scope of scopes.filter(Boolean)) {
        const panelName = scope.querySelector(":scope > summary strong, .page-heading h2")?.textContent?.trim() ?? "Tính năng";
        for (const node of scope.querySelectorAll(searchable)) {
          if (node.closest(".feature-search") || node.hidden || !node.textContent.trim()) continue;
          let target = node;
          if (node.tagName === "LABEL") target = node.control ?? node;
          if (node.tagName === "SUMMARY") target = node;
          const highlight = node.tagName === "LABEL" ? (node.closest(".check-row, .switch-row") ?? node) : node;
          const copy = node.cloneNode(true);
          copy.querySelectorAll(".feature-search").forEach((searchUi) => searchUi.remove());
          const text = copy.textContent.replace(/\s+/g, " ").trim();
          if (!text || text.length > 260 || seen.has(target)) continue;
          seen.add(target);
          entries.push({ target, highlight, text, panel: scope, panelName });
        }
      }
      return entries;
    }
    function render() {
      const query = normalize(input.value);
      if (!query) { status.textContent = global ? "Nhập từ khóa để tìm trong các tính năng." : "Nhập từ khóa để tìm trong trang này."; results.replaceChildren(); return; }
      const matches = collect().filter((entry) => normalize(entry.text).includes(query));
      status.textContent = matches.length ? `Có ${matches.length} kết quả.` : "Không tìm thấy kết quả.";
      results.replaceChildren(...matches.slice(0, 40).map((entry) => {
        const result = document.createElement("button");
        result.type = "button";
        result.className = "feature-search-result";
        result.textContent = global ? `${entry.panelName} · ${entry.text}` : entry.text;
        result.title = result.textContent;
        result.addEventListener("click", () => {
          if (global) globalThis.GSTPopupLayout?.selectPage(entry.panel.dataset.panel);
          requestAnimationFrame(() => {
            for (let parent = entry.target.parentElement; parent; parent = parent.parentElement) {
              if (parent.matches?.("details.farm-section")) globalThis.GSTFarmSectionLayout?.setOpen(parent, true);
              else if (parent.tagName === "DETAILS") parent.open = true;
              if (parent === entry.panel) break;
            }
            entry.target.scrollIntoView({ behavior: "smooth", block: "center" });
            highlightResult(entry);
            const focusTarget = entry.target.matches?.("input, select, textarea, button, summary, [tabindex]")
              ? entry.target : entry.target.querySelector?.("input, select, textarea, button");
            focusTarget?.focus?.({ preventScroll: true });
          });
        });
        return result;
      }));
    }
    input.addEventListener("input", render);
    return { render };
  }

  const overviewHeading = overview.querySelector(".dashboard-heading");
  addSearch(overviewHeading, { global: true, alwaysOpen: true, title: "Tìm trên tất cả tính năng" });
  for (const panel of panels) {
    if (panel.dataset.panel === "accounts") continue;
    const heading = panel.querySelector(":scope > summary, :scope > .page-heading");
    if (!heading) continue;
    const body = panel.querySelector(":scope > .card-body");
    addSearch(body ?? heading, { inside: !!body, alwaysOpen: true,
      title: `Tìm trong ${heading.querySelector("strong, h2")?.textContent?.trim() ?? "tính năng này"}` });
  }
})();
