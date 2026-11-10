"use strict";

// UI-only navigation. Feature handlers and their stored preferences remain unchanged.
(() => {
  const container = document.getElementById("featurePanels");
  const overview = document.getElementById("overviewPage");
  const views = new Map([...container.querySelectorAll(":scope > [data-panel]")]
    .map((panel) => [panel.dataset.panel, panel]));
  const navigation = [...document.querySelectorAll("[data-nav-panel]")];
  const pageKey = "popupActivePage";
  let navigationRevision = 0;

  // Move the original log controls (not copies), preserving their IDs and
  // handlers attached by other popup scripts.
  for (const [buttonId, targetId] of [
    ["copyFarmDiagnostics", "diagnosticsFarm"],
    ["copyHarvestHistory", "diagnosticsHarvest"],
    ["copyHarvestDebug", "diagnosticsHarvest"],
    ["copychestHistory", "diagnosticsRealm"],
    ["copyportalHistory", "diagnosticsRealm"]
  ]) {
    const item = document.getElementById(buttonId)?.closest("details.diagnostic");
    const target = document.getElementById(targetId);
    if (item && target) target.append(item);
  }

  for (const panel of views.values()) {
    if (panel.tagName !== "DETAILS") continue;
    const heading = panel.querySelector(":scope > summary");
    heading.tabIndex = -1;
    heading.addEventListener("click", (event) => event.preventDefault());
  }

  function selectPage(page, save = true) {
    if (page !== "overview" && !views.has(page)) return;
    overview.hidden = page !== "overview";
    for (const [id, panel] of views) {
      const active = id === page;
      panel.hidden = !active;
      if (panel.tagName === "DETAILS") panel.open = active;
    }
    for (const item of navigation) {
      if (item.dataset.navPanel === page) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    }
    container.scrollTop = 0;
    if (save) {
      navigationRevision++;
      chrome.storage.local.set({ [pageKey]: page }).catch(() => {});
    }
  }

  for (const item of navigation) item.addEventListener("click", () => selectPage(item.dataset.navPanel));
  for (const item of document.querySelectorAll("[data-open-panel]")) {
    item.addEventListener("click", () => selectPage(item.dataset.openPanel));
  }

  document.body.classList.add("layout-ready");
  selectPage("overview", false);
  const initialRevision = navigationRevision;
  chrome.storage.local.get(pageKey).then((saved) => {
    if (navigationRevision === initialRevision) selectPage(saved[pageKey] ?? "overview", false);
  }).catch(() => {});
})();
