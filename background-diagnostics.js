(() => {
  "use strict";
  // Read-only, bounded log. Same-tab sessionStorage preserves context after navigation.
  const key = "gst:background-log:v1", redirectKey = "gst:background-redirect:v1";
  const maxEvents = 80, maxIncidents = 24, events = [], incidents = [];
  const reasons = new Set(["boot", "attach", "state", "heartbeat", "death", "revived", "position_jump",
    "frame_gap", "visibility", "focus", "blur", "freeze", "resume", "pagehide", "pageshow",
    "revive_request", "native_revive_attempt", "worker_failure", "detach"]);
  const important = new Set(["boot", "death", "revived", "position_jump", "pagehide", "worker_failure", "frame_gap"]);
  let binding = null, lastFrame = null, previous = "", lastAlive = null, lastObserved = null, generation = 1;
  const finite = Number.isFinite;
  const date = (value) => typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ? value : "";
  const number = (value, limit = 86400000) => finite(value)
    ? Math.round(Math.max(0, Math.min(limit, value)) * 1000) / 1000 : null;
  const signed = (value) => finite(value) ? Math.round(Math.max(-1e6, Math.min(1e6, value)) * 1000) / 1000 : null;
  const point = (value) => Array.isArray(value) && value.length === 2 && value.every(finite)
    ? value.map(signed) : null;
  function compact(row) {
    if (!row || typeof row !== "object") return null;
    return { at: date(row.at), auto: row.auto === true, dead: row.dead === true,
      hidden: row.hidden === true, connected: row.connected === true,
      hp: number(row.hp, 1e9), maxHp: number(row.maxHp, 1e9), hpPct: number(row.hpPct, 1),
      position: point(row.position), serverPosition: point(row.serverPosition), fix: number(row.fix, 1e9) };
  }
  function state(scene) {
    const d = scene?.driver, self = scene?.self;
    const hp = number(self?.hp, 1e9), maxHp = number(self?.mh, 1e9);
    return { hidden: document.hidden, focused: document.hasFocus(), auto: scene?.auto?.on === true,
      dead: self?.dead === true,
      connected: !!d && !d.closing && !d.reconnecting && !d.displaced
        && (d.online === false || d.link?.open?.() === true),
      reconnecting: d?.reconnecting === true, displaced: d?.displaced === true,
      active: scene?.sys?.isActive?.() === true, paused: scene?.game?.isPaused === true,
      loopRunning: scene?.game?.loop?.running === true, wasDiscarded: document.wasDiscarded === true,
      hp, maxHp, hpPct: hp !== null && maxHp > 0 ? number(hp / maxHp, 1) : null,
      position: point([scene?.px, scene?.py]), serverPosition: point([self?.x, self?.y]),
      fix: number(self?.fix, 1e9) };
  }
  function clean(row) {
    if (!reasons.has(row?.reason)) return null;
    const result = { at: date(row.at), reason: row.reason, generation: number(row.generation, 1e7) };
    for (const k of ["hidden", "focused", "auto", "dead", "connected", "reconnecting",
      "displaced", "active", "paused", "loopRunning", "wasDiscarded"]) result[k] = row[k] === true;
    for (const k of ["gapMs", "sinceFrameMs", "positionDelta"]) result[k] = number(row[k]);
    result.hp = number(row.hp, 1e9); result.maxHp = number(row.maxHp, 1e9);
    result.hpPct = number(row.hpPct, 1);
    result.position = point(row.position); result.serverPosition = point(row.serverPosition);
    result.previousPosition = point(row.previousPosition);
    result.fix = number(row.fix, 1e9); result.previousFix = number(row.previousFix, 1e9);
    result.before = compact(row.before);
    result.navigationType = ["navigate", "reload", "back_forward", "prerender"].includes(row.navigationType)
      ? row.navigationType : null;
    result.redirectReason = row.redirectReason === "extension_timer" ? "extension_timer" : null;
    result.persisted = typeof row.persisted === "boolean" ? row.persisted : null;
    return result;
  }
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) ?? "null");
    const prior = Array.isArray(saved) ? saved : saved?.events;
    if (Array.isArray(prior)) events.push(...prior.slice(-maxEvents).map(clean).filter(Boolean));
    if (Array.isArray(saved?.incidents)) incidents.push(...saved.incidents.slice(-maxIncidents).map(clean).filter(Boolean));
    lastAlive = compact(saved?.lastAlive);
    lastObserved = compact(saved?.lastObserved);
    generation = Math.min(1e7, Math.max(1, Math.floor(saved?.generation || 0) + 1));
  } catch { /* No prior log. */ }
  function persist() {
    try { sessionStorage.setItem(key, JSON.stringify({ generation, events, incidents, lastAlive, lastObserved })); }
    catch { /* Diagnostics are optional. */ }
  }
  function record(reason, scene = binding?.scene, gapMs = null, extra = {}) {
    if (!reasons.has(reason)) return;
    try {
      const row = clean({ at: new Date().toISOString(), reason, generation, ...state(scene),
        gapMs, sinceFrameMs: lastFrame === null ? null : performance.now() - lastFrame, ...extra });
      if (!row) return;
      events.push(row); if (events.length > maxEvents) events.shift();
      if (important.has(reason) && (reason !== "frame_gap" || gapMs >= 10000)) {
        incidents.push(row); if (incidents.length > maxIncidents) incidents.shift();
      }
      if (row.position || row.hp !== null) lastObserved = compact(row);
      if (!row.dead && row.hp !== null && row.hp > 0) lastAlive = compact(row);
      persist();
    } catch { /* Never interrupt the game. */ }
  }
  function frame() {
    try {
      const owner = binding, scene = owner?.scene;
      if (!scene) return;
      const now = performance.now(), gap = lastFrame === null ? null : now - lastFrame;
      const current = state(scene), before = owner.previousFrame;
      if (gap > 3000) record("frame_gap", scene, gap, { before });
      if (owner.previousState && !owner.previousState.dead && current.dead) {
        record("death", scene, null, { before: owner.lastAlive ?? lastAlive ?? before });
      } else if (owner.previousState?.dead && !current.dead) {
        record("revived", scene, null, { before });
      }
      const previousPosition = before?.position;
      const delta = previousPosition && current.position ? Math.hypot(current.position[0] - previousPosition[0],
        current.position[1] - previousPosition[1]) : null;
      const fixChanged = owner.previousState?.fix !== null && current.fix !== null
        && owner.previousState?.fix !== current.fix;
      if (gap !== null && gap < 700 && delta !== null && (fixChanged && delta >= 3 || delta >= 12)) {
        record("position_jump", scene, null, { before, previousPosition,
          previousFix: owner.previousState?.fix, positionDelta: delta });
      }
      lastFrame = now;
      const signature = JSON.stringify([current.hidden, current.focused, current.auto, current.dead,
        current.connected, current.reconnecting, current.displaced, current.active,
        current.paused, current.loopRunning, current.wasDiscarded]);
      if (signature !== previous) { previous = signature; record("state", scene); }
      if (current.hidden && current.auto && now - owner.heartbeatAt >= 60000) {
        owner.heartbeatAt = now; record("heartbeat", scene);
      }
      if (!current.dead && current.hp !== null && current.hp > 0) {
        owner.lastAlive = compact({ ...current, at: new Date().toISOString() }); lastAlive = owner.lastAlive;
      }
      owner.previousFrame = compact({ ...current, at: new Date().toISOString() });
      owner.previousState = current;
      if (scene.auto?.reviveTry !== owner.reviveTry) {
        if (scene.auto?.reviveTry > owner.reviveTry) record("native_revive_attempt", scene);
        owner.reviveTry = scene.auto?.reviveTry;
      }
    } catch { /* Read-only diagnostics. */ }
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
    record, clean,
    attach(scene) {
      try {
        if (binding?.scene === scene && scene) return;
        detach();
        if (!scene?.events?.on || !scene.events.off || !scene.sys?.isActive?.()) return;
        binding = { scene, reviveTry: scene.auto?.reviveTry, previousFrame: null,
          previousState: null, lastAlive: null, heartbeatAt: performance.now() };
        lastFrame = null;
        scene.events.on("postupdate", frame); scene.events.on("shutdown", detach);
        scene.events.on("destroy", detach); record("attach", scene);
      } catch { detach(); }
    },
    snapshot: () => ({ build: "background-log-2", generation,
      current: clean({ at: new Date().toISOString(), reason: "state", generation,
        ...state(binding?.scene), sinceFrameMs: lastFrame === null ? null : performance.now() - lastFrame }),
      lastAlive: compact(lastAlive), lastObserved: compact(lastObserved),
      events: [...events], incidents: [...incidents] })
  };
  // Distinguish an extension-initiated ?timer redirect without storing a URL.
  let redirectReason = null;
  try {
    if (sessionStorage.getItem(redirectKey) === "extension_timer"
        && new URL(location.href).searchParams.has("timer")) redirectReason = "extension_timer";
    sessionStorage.removeItem(redirectKey);
  } catch { /* Storage can be unavailable. */ }
  const nav = performance.getEntriesByType?.("navigation")?.[0]?.type;
  record("boot", null, null, { before: lastObserved, navigationType: nav, redirectReason });
  document.addEventListener("visibilitychange", () => record("visibility"));
  for (const name of ["freeze", "resume"]) document.addEventListener(name, () => record(name));
  for (const name of ["focus", "blur"]) window.addEventListener(name, () => record(name));
  window.addEventListener("pageshow", (event) => record("pageshow", binding?.scene, null, { persisted: event.persisted }));
  window.addEventListener("pagehide", (event) => {
    record("pagehide", binding?.scene, null, { persisted: event.persisted }); detach();
  });
})();