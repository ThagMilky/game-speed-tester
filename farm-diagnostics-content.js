(() => {
  "use strict";
  const origin = "https://nghichthienky.online", pending = new Map();
  let sequence = 0;
  const codes = ["shortcut", "restore", "native_game", "death_limit", "click_to_move", "state_changed",
    "background_click_blocked", "blocking_dialog", "displaced", "navigation"];
  function flags(value) {
    return { on: value?.on === true, hidden: value?.hidden === true, focused: value?.focused === true,
      dead: value?.dead === true, deaths: Number.isFinite(value?.deaths) ? Math.max(0, Math.min(10000, value.deaths)) : 0,
      clickOrder: value?.clickOrder === true, reconnecting: value?.reconnecting === true, displaced: value?.displaced === true };
  }
  function clean(row) {
    if (!codes.includes(row?.cause) || !["on", "off", "context", "input"].includes(row?.event)) return null;
    return { at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "", event: row.event, cause: row.cause,
      ...flags(row), uptimeMs: Number.isFinite(row.uptimeMs) ? Math.max(0, row.uptimeMs) : null,
      callers: (Array.isArray(row.callers) ? row.callers : []).filter((value) => typeof value === "string"
        && /^[A-Za-z0-9_.-]+\.js:\d+:\d+$/.test(value)).slice(0, 4) };
  }
  // Allowlist MAIN -> ISOLATED diagnostic data; never relay URL or account details.
  const bgDate = (value) => typeof value === "string"
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) ? value : "";
  const bgNumber = (value, limit = 86400000) => Number.isFinite(value)
    ? Math.round(Math.max(0, Math.min(limit, value)) * 1000) / 1000 : null;
  const bgPoint = (value) => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite)
    ? value.map((v) => Math.round(Math.max(-1e6, Math.min(1e6, v)) * 1000) / 1000) : null;
  function cleanVitals(row) {
    if (!row || typeof row !== "object") return null;
    return { at: bgDate(row.at), auto: row.auto === true, dead: row.dead === true,
      hidden: row.hidden === true, connected: row.connected === true,
      hp: bgNumber(row.hp, 1e9), maxHp: bgNumber(row.maxHp, 1e9), hpPct: bgNumber(row.hpPct, 1),
      position: bgPoint(row.position), serverPosition: bgPoint(row.serverPosition),
      fix: bgNumber(row.fix, 1e9) };
  }
  function cleanBackground(row) {
    const reasons = ["boot", "attach", "state", "heartbeat", "death", "revived", "position_jump",
      "frame_gap", "visibility", "focus", "blur", "freeze", "resume", "pagehide", "pageshow",
      "revive_request", "native_revive_attempt", "worker_failure", "detach"];
    if (!reasons.includes(row?.reason)) return null;
    const result = { reason: row.reason, at: bgDate(row.at), generation: bgNumber(row.generation, 1e7) };
    for (const key of ["hidden", "focused", "auto", "dead", "connected", "reconnecting",
      "displaced", "active", "paused", "loopRunning", "wasDiscarded"]) result[key] = row[key] === true;
    for (const key of ["gapMs", "sinceFrameMs", "positionDelta"]) result[key] = bgNumber(row[key]);
    result.hp = bgNumber(row.hp, 1e9); result.maxHp = bgNumber(row.maxHp, 1e9);
    result.hpPct = bgNumber(row.hpPct, 1);
    result.position = bgPoint(row.position); result.serverPosition = bgPoint(row.serverPosition);
    result.previousPosition = bgPoint(row.previousPosition);
    result.fix = bgNumber(row.fix, 1e9); result.previousFix = bgNumber(row.previousFix, 1e9);
    result.before = cleanVitals(row.before);
    result.navigationType = ["navigate", "reload", "back_forward", "prerender"].includes(row.navigationType)
      ? row.navigationType : null;
    result.redirectReason = row.redirectReason === "extension_timer" ? "extension_timer" : null;
    result.persisted = typeof row.persisted === "boolean" ? row.persisted : null;
    return result;
  }
  // Isolated-world log collection must still work if the shared schema was not
  // initialized in this page; preserve its field allowlist on that fallback.
  function cleanMovement(row) {
    const schema = globalThis.GSTMovementLogSchema;
    if (typeof schema?.clean === "function") return schema.clean(row);
    const reasons = ["attach", "state", "correction", "frame_gap", "sample", "detach"];
    if (!reasons.includes(row?.reason)) return null;
    const number = (value) => Number.isFinite(value) ? Math.round(Math.max(-1e8, Math.min(1e8, value)) * 1000) / 1000 : null;
    const point = (value) => Array.isArray(value) && value.length === 2 && value.every(Number.isFinite) ? value.map(number) : null;
    const result = { at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "", reason: row.reason };
    for (const key of ["auto", "manual", "clickOrder", "paused", "moved", "dead", "stunned", "rooted", "slowed", "moveLocked", "harvesting", "pendingSkill", "aiming", "resting", "target", "targetChanged", "hidden", "focused", "littleProgress"]) result[key] = row[key] === true;
    for (const key of ["fix", "elapsedMs", "distance", "stillMs", "pathLength", "radius", "moveMultiplier"]) result[key] = number(row[key]);
    for (const key of ["position", "serverPosition", "targetPosition", "center", "home", "steerBefore", "steerAfter", "waypoint"]) result[key] = point(row[key]);
    result.scope = ["radius", "map"].includes(row.scope) ? row.scope : null;
    const owners = ["native_farm_eligible", "GSTHarvest", "GSTFarmBehavior", "GSTFarmMap", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest"];
    result.owners = (Array.isArray(row.owners) ? row.owners : []).filter((name) => owners.includes(name)).slice(0, owners.length);
    return result;
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:farm-debug:v1") return;
    const entry = pending.get(event.data.requestId);
    if (!entry) return;
    pending.delete(event.data.requestId); clearTimeout(entry.timer);
    const data = event.data.diagnostics;
    entry.respond({ build: data?.build === "farm-stop-1" ? data.build : "unknown", tracking: data?.tracking === true,
      background: { build: ["background-log-1", "background-log-2"].includes(data?.background?.build)
          ? data.background.build : "unavailable",
        generation: bgNumber(data?.background?.generation, 1e7),
        current: cleanBackground(data?.background?.current),
        lastAlive: cleanVitals(data?.background?.lastAlive),
        lastObserved: cleanVitals(data?.background?.lastObserved),
        events: (Array.isArray(data?.background?.events) ? data.background.events : []).slice(-80).map(cleanBackground).filter(Boolean),
        incidents: (Array.isArray(data?.background?.incidents) ? data.background.incidents : []).slice(-24).map(cleanBackground).filter(Boolean) },
      movement: { build: data?.movement?.build === "movement-log-1" ? "movement-log-1" : "unavailable",
        tracking: data?.movement?.tracking === true,
        scope: "Last 120 observations in this page; reset on reload",
        current: cleanMovement(data?.movement?.current),
        events: (Array.isArray(data?.movement?.events) ? data.movement.events : []).slice(-120).map(cleanMovement).filter(Boolean) },
      current: flags(data?.current), lastStop: clean(data?.lastStop),
      events: (Array.isArray(data?.events) ? data.events : []).slice(-20).map(clean).filter(Boolean) });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:farm-diagnostics") return;
    const requestId = `farm-debug:${++sequence}`;
    const timer = setTimeout(() => { pending.delete(requestId); respond({ build: "unavailable", tracking: false }); }, 800);
    pending.set(requestId, { respond, timer });
    window.postMessage({ channel: "gst:farm-debug-request:v1", requestId }, origin);
    return true;
  });
  window.addEventListener("pagehide", () => {
    for (const { timer, respond } of pending.values()) { clearTimeout(timer); respond({ build: "navigating", tracking: false }); }
    pending.clear();
  });
})();
