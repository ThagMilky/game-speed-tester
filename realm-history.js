(() => {
  "use strict";
  const rows = { chest: [], portal: [] }, providers = {};
  globalThis.GSTRealmHistory = {
    register(kind, provider) { if (rows[kind]) providers[kind] = provider; },
    record(kind, scene, job, reason, outcome = "ended") {
      try {
        if (!rows[kind] || !job) return;
        const target = job.point;
        const describe = (value) => value?.realm?.action === "realm-chest" ? "chest"
          : value?.realm?.action === "realm-enter" ? "portal" : value?.realm?.action === "realm-exit" ? "exit" : "other_or_none";
        rows[kind].push({ at: new Date().toISOString(), phase: job.phase || "moving", outcome,
          reason: String(reason || "Đã dừng hoặc đổi cài đặt.").slice(0, 240),
          elapsedMs: Math.max(0, Math.round(performance.now() - job.logStartedAt)),
          targetMatched: job.targetMatched === true,
          requested: job.requestedAt !== null && job.requestedAt !== undefined,
          distance: target && scene ? Math.round(Math.hypot(target.x - scene.px, target.y - scene.py) * 100) / 100 : null,
          freshTarget: job.freshTarget || "unobserved", cachedTarget: describe(scene?.target),
          autoOn: scene?.auto?.on === true, dead: scene?.self?.dead === true });
        if (rows[kind].length > 10) rows[kind].shift();
      } catch { /* Logging must never affect movement or native actions. */ }
    },
    target(value) { return value?.realm?.action === "realm-chest" ? "chest" : value?.realm?.action === "realm-enter" ? "portal" : value?.realm?.action === "realm-exit" ? "exit" : "other_or_none"; }
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== "https://nghichthienky.online"
        || event.data?.channel !== "gst:realm-history-request:v1" || typeof event.data.requestId !== "string") return;
    const kind = event.data.kind;
    if (!rows[kind]) return;
    window.postMessage({ channel: "gst:realm-history:v1", requestId: event.data.requestId, kind, current: providers[kind]?.(), rows: rows[kind] }, event.origin);
  });
})();
