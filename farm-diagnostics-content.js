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
  function cleanBackground(row) {
    const reasons = ["attach", "state", "frame_gap", "visibility", "focus", "blur", "freeze", "resume", "pagehide", "pageshow", "revive_request", "native_revive_attempt", "worker_failure", "detach"];
    if (!reasons.includes(row?.reason)) return null;
    const result = { reason: row.reason, at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "" };
    for (const key of ["hidden", "focused", "auto", "dead", "connected", "reconnecting", "displaced", "active", "paused", "loopRunning", "wasDiscarded"]) result[key] = row[key] === true;
    for (const key of ["gapMs", "sinceFrameMs"]) result[key] = Number.isFinite(row[key]) ? Math.max(0, Math.min(86400000, row[key])) : null;
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
      background: { build: "background-log-1", current: cleanBackground(data?.background?.current), events: (Array.isArray(data?.background?.events) ? data.background.events : []).slice(-50).map(cleanBackground).filter(Boolean) },
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
