(() => {
  "use strict";
  const pending = new Map(); let sequence = 0;
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== "https://nghichthienky.online" || event.data?.channel !== "gst:realm-history:v1") return;
    const entry = pending.get(event.data.requestId);
    if (!entry || entry.kind !== event.data.kind) return;
    pending.delete(event.data.requestId); clearTimeout(entry.timer);
    const targets = ["chest", "portal", "exit", "other_or_none", "unobserved"];
    const current = event.data.current;
    entry.respond({ build: "realm-history-1", kind: entry.kind,
      current: { enabled: current?.enabled === true, attached: current?.attached === true,
        phase: ["idle", "moving", "finishingCombat", "request", "waiting_target"].includes(current?.phase) ? current.phase : "unknown",
        message: typeof current?.message === "string" ? current.message.replace(/https?:\/\/\S+|[\w.+-]+@[\w.-]+|[A-Za-z0-9_-]{32,}/g, "[REDACTED]").slice(0, 240) : "",
        count: Number.isSafeInteger(current?.count) ? Math.max(0, current.count) : 0,
        autoOn: current?.autoOn === true, allowFarm: current?.allowFarm === true,
        protection: Number.isFinite(current?.protection) ? Math.max(0, current.protection) : null },
      rows: (Array.isArray(event.data.rows) ? event.data.rows : []).slice(-10).map((row) => ({
        at: typeof row?.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "",
        phase: ["moving", "finishingCombat", "request", "waiting_target"].includes(row?.phase) ? row.phase : "unknown",
        outcome: ["ended", "entered", "disappeared"].includes(row?.outcome) ? row.outcome : "unknown",
        reason: typeof row?.reason === "string" ? row.reason.replace(/https?:\/\/\S+|[\w.+-]+@[\w.-]+|[A-Za-z0-9_-]{32,}/g, "[REDACTED]").slice(0, 240) : "",
        elapsedMs: Number.isFinite(row?.elapsedMs) ? Math.max(0, Math.min(86400000, row.elapsedMs)) : null,
        distance: Number.isFinite(row?.distance) ? Math.max(0, row.distance) : null,
        targetMatched: row?.targetMatched === true, requested: row?.requested === true, autoOn: row?.autoOn === true, dead: row?.dead === true,
        freshTarget: targets.includes(row?.freshTarget) ? row.freshTarget : "unknown",
        cachedTarget: targets.includes(row?.cachedTarget) ? row.cachedTarget : "unknown"
      })) });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:realm-history" || !["chest", "portal"].includes(message.kind)) return;
    const requestId = `realm-history:${++sequence}`;
    const timer = setTimeout(() => { pending.delete(requestId); respond({ unavailable: true }); }, 1200);
    pending.set(requestId, { timer, respond, kind: message.kind });
    window.postMessage({ channel: "gst:realm-history-request:v1", requestId, kind: message.kind }, "https://nghichthienky.online");
    return true;
  });
  window.addEventListener("pagehide", () => { for (const entry of pending.values()) { clearTimeout(entry.timer); entry.respond({ unavailable: true }); } pending.clear(); });
})();
