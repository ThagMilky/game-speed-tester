(() => {
  "use strict";
  const key = "gst:quest-handoff:v1", routeKey = "kt-nav", maxAge = 180000;
  const finite = Number.isFinite;
  function storedRoute() {
    try {
      const value = sessionStorage.getItem(routeKey), target = value ? JSON.parse(value) : null;
      return target && typeof target.scene === "string" && finite(target.x) && finite(target.y)
        && typeof target.label === "string" ? { value, target } : null;
    } catch { return null; }
  }
  function route() {
    const current = storedRoute();
    return current && current.target.until >= Date.now() ? current : null;
  }
  function sameTarget(a, b) {
    return !!a && !!b && a.scene === b.scene && a.x === b.x && a.y === b.y && a.label === b.label;
  }
  function write(payload) {
    const current = route();
    if (!current || !sameTarget(current.target, payload?.route) || payload.expectedMap !== current.target.scene) return null;
    const record = { ...payload, version: 1, nonce: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`,
      savedAt: Date.now(), sourceTimeOrigin: performance.timeOrigin, path: location.pathname,
      route: { scene: current.target.scene, x: current.target.x, y: current.target.y, label: current.target.label } };
    try { sessionStorage.setItem(key, JSON.stringify(record)); return record; } catch { return null; }
  }
  function inspect() {
    let record;
    try { record = JSON.parse(sessionStorage.getItem(key) || "null"); } catch { return { invalid: true, reason: "Handoff data is unreadable." }; }
    if (!record) return { none: true };
    const invalid = (reason) => ({ invalid: true, reason, record });
    if (record.version !== 1 || typeof record.nonce !== "string" || !finite(record.savedAt)
        || Date.now() - record.savedAt < 0 || Date.now() - record.savedAt > maxAge) return invalid("Handoff expired or has an unsupported format.");
    const navigation = performance.getEntriesByType?.("navigation")?.[0];
    if (navigation?.type !== "navigate" || !(performance.timeOrigin > record.savedAt)) return invalid("The page was reloaded or no new document navigation was confirmed.");
    if (location.pathname !== record.path) return invalid("The page path changed outside the expected game handoff.");
    const current = route();
    if (!current || !sameTarget(current.target, record.route)) return invalid("Native navigation no longer points to the recorded quest destination.");
    if (typeof record.expectedSearch !== "string" || location.search !== record.expectedSearch)
      return invalid("The destination URL does not match the native leave transition.");
    const params = new URLSearchParams(location.search);
    if (record.online === true) {
      if (params.has("map") || params.has("at")) return invalid("Online leave URL does not match the native transition.");
    } else {
      const at = params.get("at")?.split(",").map(Number);
      if (params.get("map") !== record.hopMap || !at || at.length !== 2 || !at.every(finite))
        return invalid("Offline leave URL does not match the expected map transition.");
    }
    return { record };
  }
  function consume(record) {
    try { const current = JSON.parse(sessionStorage.getItem(key) || "null"); if (current?.nonce === record?.nonce) sessionStorage.removeItem(key); }
    catch { /* The one-shot handoff may already have been consumed. */ }
  }
  function clearNavigation(target) {
    const current = storedRoute();
    if (!current || !sameTarget(current.target, target)) return false;
    try { sessionStorage.removeItem(routeKey); return true; } catch { return false; }
  }
  function clear(record, target = record?.route) {
    consume(record);
    return clearNavigation(target);
  }
  function discard() { try { sessionStorage.removeItem(key); return true; } catch { return false; } }
  globalThis.GSTQuestHandoff = { key, route, sameTarget, write, inspect, consume, clear, clearNavigation, discard };
})();
