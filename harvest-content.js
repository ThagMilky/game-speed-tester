(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const pending = new Map();
  let preferences = null;
  let revision = 0;
  let sequence = 0;
  let navigating = false;
  let repairedKey = null;
  let readError = "";
  let debugEnabled = false;
  const debugRows = [];
  const lastDebug = new Map();
  let lastFailure = null;
  function moduleState() {
    let isolatedDeclared = null;
    try {
      isolatedDeclared = chrome.runtime.getManifest().content_scripts.some((script) =>
        (!script.world || script.world === "ISOLATED") && script.js?.includes("harvest-options.js"));
    } catch { /* Context-invalid diagnostics should still be readable. */ }
    return {
      build: "harvest-bridge-log-2-events", world: "ISOLATED",
      helper: typeof globalThis.GSTHarvest, normalize: typeof globalThis.GSTHarvest?.normalize,
      optionsBuild: globalThis.__gstHarvestOptionsLoad?.build ?? "missing",
      normalizeAtLoad: globalThis.__gstHarvestOptionsLoad?.normalizeAtLoad ?? "missing",
      isolatedOptionsDeclared: isolatedDeclared,
      storageApi: typeof chrome.storage?.local?.get, timer: new URL(location.href).searchParams.has("timer"),
      desiredEnabled: preferences?.enabled ?? null
    };
  }
  function record(event, detail) {
    if (!debugEnabled) return;
    const key = JSON.stringify({ event, detail });
    const group = `${event}:${detail?.stage ?? ""}`;
    if (key === lastDebug.get(group)) return;
    lastDebug.set(group, key);
    debugRows.push({ at: new Date().toISOString(), event, ...detail });
    if (debugRows.length > 60) debugRows.shift();
  }
  function failure(stage, error) {
    if (!debugEnabled) return;
    const text = String(error?.message ?? "");
    const location = String(error?.stack ?? "").match(/([a-z-]+\.js):(\d+):(\d+)/i);
    lastFailure = {
      stage, name: String(error?.name ?? "Error").slice(0, 40),
      reason: /GSTHarvest/.test(text) ? "GSTHarvest reference unavailable"
        : /normalize/i.test(text) ? "normalize unavailable or not callable"
          : /context invalidated/i.test(text) ? "extension context invalidated" : "details omitted",
      location: location ? location[0] : "unavailable", ...moduleState()
    };
    record("failure", lastFailure);
  }
  function debugState() {
    return { enabled: debugEnabled, build: "harvest-bridge-log-2-events", module: moduleState(), lastFailure, rows: [...debugRows] };
  }
  function setDebug(value) {
    const next = value === true;
    window.postMessage({ channel: "gst:harvest:v1", type: "debug-configure", enabled: next }, origin);
    if (next === debugEnabled) return;
    debugEnabled = next;
    lastDebug.clear();
    if (debugEnabled) record("debug.enabled", moduleState());
    else { debugRows.length = 0; lastFailure = null; }
  }
  function configure(value, respond) {
    const next = GSTHarvest.normalize(value);
    if (respond || JSON.stringify(next) !== JSON.stringify(preferences)) repairedKey = null;
    preferences = next;
    record("configure", { enabled: preferences.enabled, helper: typeof globalThis.GSTHarvest?.normalize });
    const url = new URL(location.href);
    if (preferences.enabled && !url.searchParams.has("timer")) {
      if (!navigating) {
        navigating = true;
        url.search += `${url.search ? "&" : "?"}timer`;
        location.replace(url.href);
      }
      respond?.({ accepted: true, applied: false, navigating: true });
      return;
    }
    let requestId;
    if (respond) {
      requestId = `configure:${++sequence}`;
      const timer = setTimeout(() => {
        pending.delete(requestId);
        respond({ accepted: true, applied: false });
      }, 800);
      pending.set(requestId, { timer, respond, kind: "configure", key: JSON.stringify(preferences) });
    }
    window.postMessage({ channel: "gst:harvest:v1", type: "configure", preferences, requestId }, origin);
  }
  function repair(data) {
    if (!preferences || navigating || data.type === "configured" || typeof data.configKey !== "string") return false;
    const key = JSON.stringify(preferences);
    if (data.configKey === key || repairedKey === key) return false;
    repairedKey = key;
    configure(preferences);
    return true;
  }
  async function readPreferences() {
    const before = revision;
    let saved;
    try {
      saved = await chrome.storage.local.get("harvestPreferences");
    } catch (error) {
      failure("storage.read", error);
      readError = /context invalidated/i.test(String(error?.message)) ? "HS-CONTEXT" : "HS-STORAGE";
      return false;
    }
    try {
      if (before === revision) {
        const next = GSTHarvest.normalize(saved.harvestPreferences);
        if (JSON.stringify(next) !== JSON.stringify(preferences)) configure(next);
      }
      readError = "";
      return true;
    } catch (error) {
      failure("storage.normalize-or-configure", error);
      readError = typeof globalThis.GSTHarvest?.normalize === "function" ? "HS-CONFIGURE" : "HS-OPTIONS";
      return false;
    }
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:harvest-status:v1") return;
    if (event.data.ready) {
      window.postMessage({ channel: "gst:harvest:v1", type: "debug-configure", enabled: debugEnabled }, origin);
      if (preferences) configure(preferences);
      return;
    }
    const entry = pending.get(event.data.requestId);
    const data = event.data;
    if (data.type === "harvest-event") {
      if (!["harvest.start", "harvest.request", "harvest.ack", "harvest.release"].includes(data.event)) return;
      const codes = ["selected", "native_F", "started", "yield", "detach", "yield_native", "blocked",
        "harvest_ended", "node_unavailable_before_ack", "request_timeout", "target_changed", "danger",
        "interaction_target_other", "interaction_cache_timeout", "pre_interaction_blocked", "interact_error",
        "stalled", "approach_timeout", "no_path", "path_blocked", "manual_pointer", "manual_key", "manual_skill"];
      record(data.event, {
        code: codes.includes(data.code) ? data.code : "unknown",
        attempt: Number.isSafeInteger(data.attempt) && data.attempt > 0 ? data.attempt : null,
        node: Number.isSafeInteger(data.node) && data.node >= 0 ? data.node : null,
        phase: ["moving", "request", "harvesting"].includes(data.phase) ? data.phase : "unknown",
        elapsedMs: Number.isFinite(data.elapsedMs) ? Math.max(0, Math.min(86400000, data.elapsedMs)) : null,
        distance: Number.isFinite(data.distance) ? Math.max(0, Math.min(1000000, data.distance)) : null,
        ready: data.ready === true, fixChanged: typeof data.fixChanged === "boolean" ? data.fixChanged : null
      });
      return;
    }
    if (data.type === "diagnostics") {
      const page = data.debug;
      record("main.snapshot", {
        build: typeof page?.build === "string" ? page.build.slice(0, 60) : "missing",
        helper: typeof page?.helper === "string" ? page.helper.slice(0, 20) : "unknown",
        normalize: typeof page?.normalize === "string" ? page.normalize.slice(0, 20) : "unknown",
        optionsBuild: typeof page?.optionsBuild === "string" ? page.optionsBuild.slice(0, 60) : "missing",
        enabled: page?.enabled === true, scene: page?.scene === true,
        controlling: page?.controlling === true
      });
      if (entry?.kind === "debug") {
        pending.delete(data.requestId); clearTimeout(entry.timer); entry.respond(debugState());
      }
      return;
    }
    if (!entry) {
      if (data.type !== "configured") readPreferences().then((ok) => { if (ok) repair(data); });
      return;
    }
    if (entry.kind === "configure") {
      if (data.type !== "configured") return;
      pending.delete(data.requestId);
      clearTimeout(entry.timer);
      record("configure.ack", { applied: data.configKey === entry.key });
      entry.respond({ accepted: true, applied: data.configKey === entry.key });
      return;
    }
    const applied = preferences !== null && data.configKey === JSON.stringify(preferences);
    record("status", { applied, engineEnabled: typeof data.enabled === "boolean" ? data.enabled : null,
      desiredEnabled: preferences?.enabled ?? null });
    if (!applied && !entry.retried && repair(data)) {
      // Recover a missed initial configure before returning a stale OFF status.
      // The page handles identical configurations without resetting its job.
      entry.retried = true;
      window.postMessage({ channel: "gst:harvest:v1", type: "status", requestId: data.requestId }, origin);
      return;
    }
    pending.delete(event.data.requestId);
    clearTimeout(entry.timer);
    entry.respond({ message: preferences && !applied
      ? "Cài đặt đã lưu chưa khớp với trang game. Tải lại trang game để nhận bản extension mới."
      : typeof data.message === "string" ? data.message.slice(0, 240) : "Chờ dữ liệu thu hoạch.",
      enabled: typeof data.enabled === "boolean" ? data.enabled : null, applied,
      available: data.available === true,
      catalog: (Array.isArray(data.catalog) ? data.catalog : [])
        .filter((item) => typeof item?.name === "string" && item.name.length <= 120).slice(0, 200)
        .map((item) => ({ name: item.name, inMap: item.inMap === true })) });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:harvest-debug-set") {
      setDebug(message.enabled); respond(debugState()); return;
    }
    if (message?.type === "gst:harvest-debug-clear") {
      debugRows.length = 0; lastDebug.clear(); lastFailure = null;
      respond(debugState()); return;
    }
    if (message?.type === "gst:harvest-debug-get") {
      if (!debugEnabled) { respond(debugState()); return; }
      record("module.snapshot", moduleState());
      const requestId = `debug:${++sequence}`;
      const timer = setTimeout(() => {
        pending.delete(requestId); record("main.timeout", { received: false }); respond(debugState());
      }, 800);
      pending.set(requestId, { timer, respond, kind: "debug" });
      window.postMessage({ channel: "gst:harvest:v1", type: "diagnostics", requestId, enabled: true }, origin);
      return true;
    }
    if (message?.type === "gst:harvest-configure") {
      revision++;
      try { configure(message.preferences, respond); }
      catch (error) {
        failure("runtime.configure", error);
        readError = typeof globalThis.GSTHarvest?.normalize === "function" ? "HS-CONFIGURE" : "HS-OPTIONS";
        respond({ accepted: false, applied: false, error: readError });
      }
      return true;
    }
    if (message?.type !== "gst:harvest-status") return;
    // The popup has already read storage. Use that authenticated extension
    // message rather than requiring a second storage read in the tab.
    let preparation;
    if (typeof message.preferences?.enabled === "boolean") {
      try {
        revision++;
        configure(message.preferences);
        preparation = Promise.resolve(true);
      } catch (error) {
        failure("popup.configure", error);
        readError = typeof globalThis.GSTHarvest?.normalize === "function" ? "HS-CONFIGURE" : "HS-OPTIONS";
        preparation = Promise.resolve(false);
      }
    } else preparation = readPreferences();
    preparation.then((ok) => {
      if (!ok) {
        respond({ message: `Chưa chuẩn bị được cài đặt trong tab (${readError || "HS-UNKNOWN"}). Tải lại extension rồi tải lại trang game.`,
          enabled: null, applied: false, catalog: [], available: false });
        return;
      }
      const requestId = `popup:${++sequence}`;
      const timer = setTimeout(() => {
        pending.delete(requestId);
        respond({ message: "Chưa kết nối Tự hái; tải lại trang game sau khi cập nhật extension.",
          enabled: null, applied: false, catalog: [], available: false });
      }, 800);
      pending.set(requestId, { timer, respond });
      window.postMessage({ channel: "gst:harvest:v1", type: "synchronize", preferences, requestId }, origin);
    });
    return true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.harvestDebugEnabled) setDebug(changes.harvestDebugEnabled.newValue);
    if (area === "local" && changes.harvestPreferences) {
      revision++; configure(changes.harvestPreferences.newValue);
    }
  });
  window.addEventListener("pagehide", () => {
    for (const { timer, respond, kind } of pending.values()) {
      clearTimeout(timer);
      respond(kind === "debug" ? debugState() : kind === "configure" ? { accepted: true, applied: false, navigating: true }
        : { message: "Đang chuyển trang.", catalog: [], available: false, applied: false });
    }
    pending.clear();
  });
  window.addEventListener("pageshow", () => {
    repairedKey = null;
    if (preferences) configure(preferences);
  });
  const initialRevision = revision;
  chrome.storage.local.get(["harvestPreferences", "harvestDebugEnabled"]).then((saved) => {
    setDebug(saved.harvestDebugEnabled);
    record("bridge.start", moduleState());
    if (initialRevision === revision) configure(saved.harvestPreferences);
  }).catch((error) => {
    failure("bridge.start", error);
    // MAIN starts disabled already. A failed read must not send guessed OFF
    // settings or overwrite a configuration received from the popup.
    if (initialRevision === revision) readError = "HS-INITIAL";
  });
})();
