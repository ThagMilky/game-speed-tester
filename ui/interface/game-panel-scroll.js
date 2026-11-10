(() => {
  "use strict";

  // The native game recreates body > .panel on profile/market refresh.
  // Restore only user-scrolled content within an unchanged game panel.
  const panelSelector = 'body > .panel[role="dialog"][data-title]';
  const scrollSelectors = [".body", ".inner-scroll", ".skill-cards", ".skill-detail",
    ".bag-grid", ".forge2 .grid", ".root-detail-content"];
  const navigationSelector = '[role="tab"], [data-rank], .bag-tabs button, .inventory-nav button, ' +
    '.workshop .tabs button, .forge2 .tabs button, .workshop-back, summary';

  let active = null, observer = null, pointerHeld = false;
  let scrollInputAt = -Infinity, navigationAt = -Infinity, inputRevision = 0;

  function panelOf(node) {
    if (!(node instanceof Element)) return null;
    const panel = node.closest('.panel[role="dialog"][data-title]');
    return panel?.parentElement === document.body ? panel : null;
  }

  function context(panel) {
    const workshop = panel.querySelector(".workshop");
    return [panel.dataset.title, panel.className, workshop?.dataset.tab ?? "",
      workshop?.dataset.banner ?? "", workshop?.dataset.sub ?? ""].join("|");
  }

  function keyedScrolls(panel) {
    const items = new Map();
    for (const selector of scrollSelectors) {
      const nodes = panel.querySelectorAll(selector);
      nodes.forEach((element, index) => {
        const key = selector + "|" + index + "|" + (element.getAttribute("data-scroll-key") ?? "");
        items.set(element, key);
      });
    }
    return items;
  }

  function recordScroll(event) {
    const panel = panelOf(event.target);
    if (!active || active.panel !== panel || active.restoring ||
        !(event.target instanceof HTMLElement)) return;
    // Browser-generated scroll events also fire when the game resets scrollTop.
    // Do not mistake such resets for the user's chosen position.
    if (!pointerHeld && performance.now() - scrollInputAt > 900) return;
    const key = keyedScrolls(panel).get(event.target);
    if (key) active.positions.set(key, Math.max(0, event.target.scrollTop));
  }

  function restore(panel, saved, revision) {
    if (active?.panel !== panel || !panel.isConnected || inputRevision !== revision) return;
    for (const [element, key] of keyedScrolls(panel)) {
      const previous = saved.get(key);
      if (!Number.isFinite(previous) || previous <= 0) continue;
      const limit = Math.max(0, element.scrollHeight - element.clientHeight);
      if (limit > 0) element.scrollTop = Math.min(previous, limit);
    }
  }

  function reconcile() {
    const panel = document.querySelector(panelSelector);
    if (active?.panel === panel) return;
    const previous = active;
    active = panel ? { panel, context: context(panel), positions: new Map(), restoring: false } : null;
    if (!previous || !active || active.context !== previous.context ||
        performance.now() - navigationAt < 600) return;

    // A profile refresh removes and rebuilds the same panel synchronously.
    // A genuinely closed panel clears active state on the removal notification.
    active.positions = new Map(previous.positions);
    const revision = inputRevision, saved = new Map(active.positions);
    active.restoring = true;
    restore(panel, saved, revision);
    requestAnimationFrame(() => {
      restore(panel, saved, revision);
      if (active?.panel === panel) active.restoring = false;
    });
  }

  function markScrollInput(event) {
    if (!panelOf(event.target)) return;
    scrollInputAt = performance.now();
    inputRevision++;
    if (active) active.restoring = false;
  }

  document.addEventListener("wheel", markScrollInput, { capture: true, passive: true });
  document.addEventListener("touchmove", markScrollInput, { capture: true, passive: true });
  document.addEventListener("pointerdown", (event) => {
    if (!panelOf(event.target)) return;
    pointerHeld = true;
    markScrollInput(event);
  }, true);
  for (const event of ["pointerup", "pointercancel"]) {
    document.addEventListener(event, () => { pointerHeld = false; }, true);
  }
  document.addEventListener("keydown", (event) => {
    if (!panelOf(event.target)) return;
    if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key))
      markScrollInput(event);
    if (["Enter", " "].includes(event.key) && event.target.closest(navigationSelector))
      navigationAt = performance.now();
  }, true);
  document.addEventListener("click", (event) => {
    if (panelOf(event.target) && event.target.closest(navigationSelector))
      navigationAt = performance.now();
  }, true);
  document.addEventListener("change", (event) => {
    if (panelOf(event.target) && event.target.matches('select, input[type="radio"]'))
      navigationAt = performance.now();
  }, true);
  document.addEventListener("scroll", recordScroll, true);

  function mount() {
    if (observer || !document.body) return;
    observer = new MutationObserver(reconcile);
    // The game appends/removes its panel directly under document.body.
    // Do not observe every DOM update inside the game or run a polling timer.
    observer.observe(document.body, { childList: true });
    reconcile();
  }
  document.addEventListener("DOMContentLoaded", mount, { once: true });
  if (document.body) mount();
  window.addEventListener("pagehide", () => {
    observer?.disconnect(); observer = null; active = null; pointerHeld = false;
  });
  window.addEventListener("pageshow", mount);
})();
