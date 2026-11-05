(() => {
  "use strict";
  const key = "gst:background-log:v1", events = [];
  const reasons = new Set(["attach", "state", "frame_gap", "visibility", "focus", "blur", "freeze", "resume", "pagehide", "pageshow", "revive_request", "native_revive_attempt", "worker_failure", "detach"]);
  let binding = null, lastFrame = null, previous = "";
  function state(scene) {
    const d = scene?.driver;
    return { hidden: document.hidden, focused: document.hasFocus(), auto: scene?.auto?.on === true,
      dead: scene?.self?.dead === true, connected: !!d && !d.closing && !d.reconnecting && !d.displaced && (d.online === false || d.link?.open?.() === true),
      reconnecting: d?.reconnecting === true, displaced: d?.displaced === true,
      active: scene?.sys?.isActive?.() === true, paused: scene?.game?.isPaused === true,
      loopRunning: scene?.game?.loop?.running === true, wasDiscarded: document.wasDiscarded === true };
  }
  function clean(row) {
    if (!reasons.has(row?.reason)) return null;
    const result = { at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "", reason: row.reason };
    for (const k of ["hidden", "focused", "auto", "dead", "connected", "reconnecting", "displaced", "active", "paused", "loopRunning", "wasDiscarded"]) result[k] = row[k] === true;
    for (const k of ["gapMs", "sinceFrameMs"]) result[k] = Number.isFinite(row[k]) ? Math.max(0, Math.min(86400000, row[k])) : null;
    return result;
  }
  try { events.push(...JSON.parse(sessionStorage.getItem(key) ?? "[]").slice(-50).map(clean).filter(Boolean)); } catch {}
  function record(reason, scene = binding?.scene, gapMs = null) {
    if (!reasons.has(reason)) return;
    try {
      events.push(clean({ at: new Date().toISOString(), reason, ...state(scene), gapMs,
        sinceFrameMs: lastFrame === null ? null : performance.now() - lastFrame }));
      if (events.length > 50) events.shift();
      sessionStorage.setItem(key, JSON.stringify(events));
    } catch { /* Optional diagnostics must never break the game. */ }
  }
  function frame() {
    const scene = binding?.scene;
    if (!scene) return;
    const now = performance.now(), gap = lastFrame === null ? null : now - lastFrame;
    if (gap > 3000) record("frame_gap", scene, gap);
    lastFrame = now;
    const next = JSON.stringify(state(scene));
    if (next !== previous) { previous = next; record("state", scene); }
    if (scene.auto?.reviveTry !== binding.reviveTry) {
      if (scene.auto?.reviveTry > binding.reviveTry) record("native_revive_attempt", scene);
      binding.reviveTry = scene.auto?.reviveTry;
    }
  }
  function detach() {
    if (!binding) return;
    record("detach");
    const old = binding; binding = null;
    old.scene.events.off("postupdate", frame);
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    lastFrame = null; previous = "";
  }
  globalThis.GSTBackgroundDiagnostics = {
    record,
    clean,
    attach(scene) {
      try {
        if (binding?.scene === scene && scene) return;
        detach();
        if (!scene?.events?.on || !scene.events.off || !scene.sys?.isActive?.()) return;
        binding = { scene, reviveTry: scene.auto?.reviveTry }; lastFrame = null;
        scene.events.on("postupdate", frame); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
        record("attach", scene);
      } catch { detach(); }
    },
    snapshot: () => ({ build: "background-log-1", current: clean({ at: new Date().toISOString(), reason: "state", ...state(binding?.scene), sinceFrameMs: lastFrame === null ? null : performance.now() - lastFrame }), events: [...events] })
  };
  document.addEventListener("visibilitychange", () => record("visibility"));
  for (const name of ["freeze", "resume"]) document.addEventListener(name, () => record(name));
  for (const name of ["focus", "blur", "pageshow"]) window.addEventListener(name, () => record(name));
  window.addEventListener("pagehide", () => { record("pagehide"); detach(); });
})();
