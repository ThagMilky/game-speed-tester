"use strict";

// UI-only navigation. Feature handlers and their stored preferences remain unchanged.
(() => {
  const container = document.getElementById("featurePanels");
  const overview = document.getElementById("overviewPage");
  const views = new Map([...container.querySelectorAll(":scope > [data-panel]")]
    .map((panel) => [panel.dataset.panel, panel]));
  const navigation = [...document.querySelectorAll("[data-nav-panel]")];
  const otherPages = new Set(["farm", "harvest", "quest", "management", "connection", "speed"]);
  const pageKey = "popupActivePage";
  let navigationRevision = 0;
  let contextExpired = false;
  function contextAlive() {
    if (contextExpired) return false;
    try { if (chrome.runtime.id) return true; } catch {}
    showExpiredContext();
    return false;
  }
  function showExpiredContext() {
    if (contextExpired) return;
    contextExpired = true;
    const notice = document.createElement("p");
    notice.className = "notice";
    notice.setAttribute("role", "status");
    notice.textContent = "Extension đã được tải lại. Hãy tải lại trang game hoặc mở lại popup để tiếp tục dùng tool.";
    document.body.prepend(notice);
  }
  function storageFailed(error) {
    if (/extension context invalidated/i.test(String(error?.message ?? ""))) showExpiredContext();
    else contextAlive();
  }
  async function savePage(page) {
    if (!contextAlive()) return;
    try { await chrome.storage.local.set({ [pageKey]: page }); }
    catch (error) { storageFailed(error); }
  }

  // Move the original log controls (not copies), preserving their IDs and
  // handlers attached by other popup scripts.
  for (const [buttonId, targetId] of [
    ["copyFarmDiagnostics", "diagnosticsFarm"],
    ["copyHarvestHistory", "diagnosticsHarvest"],
    ["copyHarvestDebug", "diagnosticsHarvest"],
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
      if (item.dataset.navPanel === (otherPages.has(page) ? "other" : page)) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    }
    container.scrollTop = 0;
    if (save) {
      navigationRevision++;
      void savePage(page);
    }
  }
  globalThis.GSTPopupLayout = { selectPage };

  for (const item of navigation) item.addEventListener("click", () => selectPage(item.dataset.navPanel));
  for (const item of document.querySelectorAll("[data-open-panel]")) {
    item.addEventListener("click", () => selectPage(item.dataset.openPanel));
  }

  document.body.classList.add("layout-ready");
  selectPage("overview", false);
  const initialRevision = navigationRevision;
  async function restorePage() {
    if (!contextAlive()) return;
    try {
      const saved = await chrome.storage.local.get(pageKey);
      if (!contextExpired && navigationRevision === initialRevision) selectPage(saved[pageKey] ?? "overview", false);
    } catch (error) { storageFailed(error); }
  }
  void restorePage();
})();

// Presentation preferences are independent of automation settings.
(() => {
  const themeButton = document.getElementById("themeToggle");
  const root = document.documentElement;
  const systemTheme = matchMedia("(prefers-color-scheme: dark)");
  const themeKey = "popupTheme";
  let themeRevision = 0;
  function applyTheme(value) {
    if (value === "light" || value === "dark") root.dataset.theme = value;
    else delete root.dataset.theme;
    const dark = root.dataset.theme ? root.dataset.theme === "dark" : systemTheme.matches;
    themeButton.textContent = dark ? "☀" : "☾";
    themeButton.title = themeButton.ariaLabel = dark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";
  }
  applyTheme();
  const initialRevision = themeRevision;
  chrome.storage.local.get(themeKey).then((saved) => {
    if (themeRevision === initialRevision) applyTheme(saved[themeKey]);
  }).catch(() => {});
  themeButton.addEventListener("click", async () => {
    const previous = root.dataset.theme;
    const revision = ++themeRevision;
    const dark = previous ? previous === "dark" : systemTheme.matches;
    const next = dark ? "light" : "dark";
    themeButton.disabled = true;
    applyTheme(next);
    try { await chrome.storage.local.set({ [themeKey]: next }); }
    catch {
      if (revision === themeRevision) applyTheme(previous);
      themeButton.title = "Chưa lưu được giao diện. Bấm để thử lại.";
    } finally { themeButton.disabled = false; }
  });
  systemTheme.addEventListener("change", () => applyTheme(root.dataset.theme));
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[themeKey]) {
      themeRevision++;
      applyTheme(changes[themeKey].newValue);
    }
  });

  const nav = document.querySelector(".feature-navigation");
  const toggle = document.getElementById("navigationToggle");
  const items = document.getElementById("navigationItems");
  const wide = matchMedia("(min-width: 760px)");
  const expandedKey = "popupNavigationExpanded";
  let expandedRevision = 0;
  let pinned = false, hovered = false, closeTimer;
  function expanded(value) {
    nav.classList.toggle("nav-expanded", value);
    toggle.setAttribute("aria-expanded", String(value));
  }
  function label() {
    const active = items.querySelector('[aria-current="page"]');
    toggle.textContent = `${active?.textContent ?? "Chọn chức năng"} · Chọn mục ▾`;
  }
  function orientation() {
    const horizontal = document.body.classList.contains("embedded")
      && document.body.dataset.orientation === "horizontal" && wide.matches;
    nav.classList.toggle("nav-collapsible", !horizontal);
    expanded(horizontal || pinned || hovered || items.contains(document.activeElement));
  }
  function closeLater() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      if (!pinned && !hovered && !nav.contains(document.activeElement)) expanded(false);
    }, 250);
  }
  nav.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovered = true;
    clearTimeout(closeTimer);
    expanded(true);
  });
  nav.addEventListener("pointerleave", () => { hovered = false; closeLater(); });
  nav.addEventListener("focusin", (event) => { if (event.target !== toggle) expanded(true); });
  nav.addEventListener("focusout", closeLater);
  toggle.addEventListener("click", () => {
    pinned = !nav.classList.contains("nav-expanded");
    expanded(pinned);
    const revision = ++expandedRevision;
    void chrome.storage.local.set({ [expandedKey]: pinned }).catch(() => {
      if (revision === expandedRevision) toggle.title = "Chưa lưu được trạng thái menu.";
    });
  });
  nav.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !nav.classList.contains("nav-collapsible")) return;
    pinned = false;
    toggle.focus();
    expanded(false);
    const revision = ++expandedRevision;
    void chrome.storage.local.set({ [expandedKey]: false }).catch(() => {
      if (revision === expandedRevision) toggle.title = "Chưa lưu được trạng thái menu.";
    });
    event.preventDefault();
  });
  new MutationObserver(label).observe(items, { subtree: true, attributes: true, attributeFilter: ["aria-current"] });
  new MutationObserver(orientation).observe(document.body, { attributes: true, attributeFilter: ["class", "data-orientation"] });
  wide.addEventListener("change", orientation);
  label();
  orientation();
  const initialExpandedRevision = expandedRevision;
  chrome.storage.local.get(expandedKey).then((saved) => {
    if (expandedRevision !== initialExpandedRevision || typeof saved[expandedKey] !== "boolean") return;
    pinned = saved[expandedKey];
    const horizontal = document.body.classList.contains("embedded")
      && document.body.dataset.orientation === "horizontal" && wide.matches;
    expanded(horizontal || pinned || hovered || items.contains(document.activeElement));
  }).catch(() => {});
})();
