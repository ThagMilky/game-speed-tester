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
  let shortcut = { code: "KeyH", ctrl: false, alt: true, shift: false, meta: false }, shortcutRevision = 0, shortcutBusy = false;
  let accountProfileReady = false, accountProfileVerified = false;
  const shortcutCode = (value) => ({ code: typeof value?.code === "string" ? value.code : "KeyH",
    ctrl: value?.ctrl === true, alt: value?.alt !== false, shift: value?.shift === true, meta: value?.meta === true });
  function editableKeyTarget(event) {
    return [document.activeElement, ...event.composedPath()].some((node) => node instanceof HTMLElement
      && (node.isContentEditable || node.matches("input, textarea, select, [role='textbox']")));
  }
  window.addEventListener("keydown", (event) => {
    if (event.code !== shortcut.code || event.ctrlKey !== shortcut.ctrl || event.altKey !== shortcut.alt
        || event.shiftKey !== shortcut.shift || event.metaKey !== shortcut.meta
        || event.repeat || event.isComposing || !event.isTrusted || document.hidden || !document.hasFocus()
        || editableKeyTarget(event) || document.getElementById("gst-game-menu")?.dataset.open === "true") return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (shortcutBusy || navigating) return;
    shortcutBusy = true;
    const state = GSTAccountProfiles.context();
    const context = state.ready ? state.context : null;
    if (!state.ready || !accountProfileReady || !accountProfileVerified || context?.verified !== true) {
      shortcutBusy = false;
      return;
    }
    const expectedIdentity = GSTAccountProfiles.identity(context);
    GSTAccountProfiles.updateFeature(context, "harvest", (saved) => {
      const previous = GSTHarvest.normalize(saved);
      return { enabled: !previous.enabled };
    }, () => {
      const latest = GSTAccountProfiles.context();
      return latest.ready && latest.context?.verified === true
        && GSTAccountProfiles.matchesIdentity(latest.context, expectedIdentity, expectedIdentity.tabId);
    }).catch((error) => { failure("shortcut.toggle", error); }).finally(() => { shortcutBusy = false; });
  }, true);
  let debugEnabled = false;
  const debugRows = [];
  const lastDebug = new Map();
  let lastFailure = null;
  let mainSnapshot = null;
  function moduleState() {
    let isolatedDeclared = null;
    let storageApi = "unavailable";
    try {
      storageApi = typeof chrome.storage?.local?.get;
      isolatedDeclared = chrome.runtime.getManifest().content_scripts.some((script) =>
        (!script.world || script.world === "ISOLATED") && script.js?.includes("features/automation/auto-harvest/harvest-options.js"));
    } catch { /* Context-invalid diagnostics should still be readable. */ }
    return {
      build: "harvest-bridge-log-2-events", world: "ISOLATED",
      helper: typeof globalThis.GSTHarvest, normalize: typeof globalThis.GSTHarvest?.normalize,
      optionsBuild: globalThis.__gstHarvestOptionsLoad?.build ?? "missing",
      normalizeAtLoad: globalThis.__gstHarvestOptionsLoad?.normalizeAtLoad ?? "missing",
      isolatedOptionsDeclared: isolatedDeclared,
      storageApi, timer: new URL(location.href).searchParams.has("timer"),
      desiredEnabled: preferences?.enabled ?? null
    };
  }
  function record(event, detail) {
    if (!debugEnabled) return;
    // Normal initialization and successful attempts need no diagnostic history.
    if (!["failure", "harvest.release", "main.timeout"].includes(event)) return;
    if (event === "harvest.release" && !["node_unavailable_before_ack", "request_timeout",
      "interaction_target_other", "interaction_cache_timeout", "interact_error", "stalled",
      "approach_timeout", "no_path", "path_blocked", "harvest_unconfirmed", "attack_timeout"].includes(detail?.code)) return;
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
    return { enabled: debugEnabled, build: "harvest-bridge-log-2-events", module: moduleState(), main: mainSnapshot, lastFailure, rows: [...debugRows] };
  }
  function setDebug(value) {
    const next = value === true;
    window.postMessage({ channel: "gst:harvest:v1", type: "debug-configure", enabled: next }, origin);
    if (next === debugEnabled) return;
    debugEnabled = next;
    lastDebug.clear();
    if (debugEnabled) record("debug.enabled", moduleState());
    else { debugRows.length = 0; lastFailure = null; mainSnapshot = null; }
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
    const state = GSTAccountProfiles.context();
    if (!accountProfileReady || !accountProfileVerified || !state.ready || state.context?.verified !== true) return false;
    const before = revision;
    let saved;
    try {
      saved = await chrome.storage.local.get(["harvestPreferences", GSTAccountProfiles.profilesKey]);
    } catch (error) {
      failure("storage.read", error);
      readError = /context invalidated/i.test(String(error?.message)) ? "HS-CONTEXT" : "HS-STORAGE";
      return false;
    }
    try {
      if (before === revision) {
        const next = GSTHarvest.normalize(GSTAccountProfiles.currentProfile(state.context, "harvest", saved));
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
    if (event.source === window && event.origin === origin && event.data?.channel === "gst:account-profile:v1"
        && event.data.type === "profile") {
      const state = GSTAccountProfiles.context();
      if (!state.ready || state.context?.verified !== (event.data.verified === true)
          || (event.data.verified === true && state.context?.profileKey !== event.data.profileKey)) return;
      accountProfileReady = true;
      accountProfileVerified = event.data.verified === true;
      revision++;
      const value = accountProfileVerified ? event.data.harvestPreferences
        : { ...(event.data.harvestPreferences ?? {}), enabled: false };
      try { configure(value); }
      catch (error) { failure("account-profile.configure", error); }
      return;
    }
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
        "stalled", "approach_timeout", "no_path", "path_blocked", "manual_pointer", "manual_key", "manual_skill",
        "harvest_success", "harvest_unconfirmed", "attack_timeout"];
      record(data.event, {
        code: codes.includes(data.code) ? data.code : "unknown",
        attempt: Number.isSafeInteger(data.attempt) && data.attempt > 0 ? data.attempt : null,
        node: Number.isSafeInteger(data.node) && data.node >= 0 ? data.node : null,
        phase: ["moving", "request", "harvesting", "confirming"].includes(data.phase) ? data.phase : "unknown",
        elapsedMs: Number.isFinite(data.elapsedMs) ? Math.max(0, Math.min(86400000, data.elapsedMs)) : null,
        distance: Number.isFinite(data.distance) ? Math.max(0, Math.min(1000000, data.distance)) : null,
        ready: data.ready === true, fixChanged: typeof data.fixChanged === "boolean" ? data.fixChanged : null
      });
      return;
    }
    if (data.type === "diagnostics") {
      const page = data.debug;
      mainSnapshot = {
        build: typeof page?.build === "string" ? page.build.slice(0, 60) : "missing",
        helper: typeof page?.helper === "string" ? page.helper.slice(0, 20) : "unknown",
        normalize: typeof page?.normalize === "string" ? page.normalize.slice(0, 20) : "unknown",
        optionsBuild: typeof page?.optionsBuild === "string" ? page.optionsBuild.slice(0, 60) : "missing",
        enabled: page?.enabled === true, scene: page?.scene === true,
        controlling: page?.controlling === true
      };
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
      recentAttempts: (Array.isArray(data.recentAttempts) ? data.recentAttempts : []).slice(-10).map((row) => ({
        at: typeof row?.at === "string" ? row.at.slice(0, 30) : "",
        attempt: Number.isSafeInteger(row?.attempt) ? row.attempt : null,
        item: typeof row?.item === "string" ? row.item.slice(0, 120) : "",
        node: Number.isSafeInteger(row?.node) ? row.node : null,
        phase: ["moving", "request", "harvesting", "confirming"].includes(row?.phase) ? row.phase : "unknown",
        result: ["success", "failed", "unconfirmed", "canceled"].includes(row?.result) ? row.result : "unknown",
        code: typeof row?.code === "string" && /^[a-z_]{1,50}$/.test(row.code) ? row.code : "unknown",
        reason: typeof row?.reason === "string" ? row.reason.slice(0, 220) : "",
        elapsedMs: Number.isFinite(row?.elapsedMs) ? Math.max(0, row.elapsedMs) : null,
        distance: Number.isFinite(row?.distance) ? row.distance : null,
        requests: Number.isSafeInteger(row?.requests) ? row.requests : 0,
        inventoryBefore: Number.isFinite(row?.inventoryBefore) ? row.inventoryBefore : null,
        inventoryAtLastRequest: Number.isFinite(row?.inventoryAtLastRequest) ? row.inventoryAtLastRequest : null,
        inventoryAfter: Number.isFinite(row?.inventoryAfter) ? row.inventoryAfter : null,
        currentHarvestNode: Number.isSafeInteger(row?.currentHarvestNode) ? row.currentHarvestNode : null,
        nativeHarvesting: row?.nativeHarvesting === true, nodeSame: row?.nodeSame === true,
        freshTarget: { type: ["none", "other", "realm", "gate", "resource", "npc_or_other", "unobserved"].includes(row?.freshTarget?.type) ? row.freshTarget.type : "unknown", node: Number.isSafeInteger(row?.freshTarget?.node) ? row.freshTarget.node : null },
        cachedTarget: { type: ["none", "other", "realm", "gate", "resource", "npc_or_other", "unobserved"].includes(row?.cachedTarget?.type) ? row.cachedTarget.type : "unknown", node: Number.isSafeInteger(row?.cachedTarget?.node) ? row.cachedTarget.node : null },
        closerApproach: row?.closerApproach === true,
        requestedReach: Number.isFinite(row?.requestedReach) ? row.requestedReach : null,
        confirmationWaitMs: Number.isFinite(row?.confirmationWaitMs) ? row.confirmationWaitMs : null,
        requestPosition: cleanPosition(row?.requestPosition), endPosition: cleanPosition(row?.endPosition),
        gameNotices: (Array.isArray(row?.gameNotices) ? row.gameNotices : []).slice(-3).map((notice) => ({
          type: notice?.type === "toast" ? "toast" : "note",
          text: typeof notice?.text === "string" ? notice.text.slice(0, 180) : ""
        })),
        endedBy: ["manual_key", "manual_skill", "manual_pointer", "allow_farm_revoked", "auto_farm_activated", "native_request_yield"].includes(row?.endedBy) ? row.endedBy : null,
        followUp: ["watching_after_yield", "watching_after_permission_revoke", "watching_after_auto_farm_activated", "watching_after_request_yield", "success", "unconfirmed_after_8s", "scene_observation_ended", "ambiguous_new_attempt"].includes(row?.followUp) ? row.followUp : null,
        serverRejectionObserved: false,
        requested: row?.requested === true, acknowledged: row?.acknowledged === true,
        attacked: row?.attacked === true, ready: row?.ready === true, fixChanged: row?.fixChanged === true,
        searchScope: row?.searchScope === "map" ? "map" : "radius"
      })),
      available: data.available === true, mapAvailable: data.mapAvailable === true,
      catalog: (Array.isArray(data.catalog) ? data.catalog : [])
        .filter((item) => typeof item?.name === "string" && item.name.length <= 120).slice(0, 200)
        .map((item) => ({ name: item.name, inMap: item.inMap === true, kind: ["plant", "ore", "both"].includes(item.kind) ? item.kind : "unknown" })) });
  });
  function cleanPosition(value) {
    if (!value || typeof value !== "object") return null;
    return Object.fromEntries(["localX", "localY", "snapshotX", "snapshotY", "snapshotAgeMs", "snapshotDistance"]
      .map((key) => [key, Number.isFinite(value[key]) ? value[key] : null]));
  }
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
      const context = GSTAccountProfiles.context();
      if (!accountProfileReady || !accountProfileVerified
          || !Number.isInteger(message.targetTabId)
          || message.profileIdentity?.tabId !== message.targetTabId
          || !GSTAccountProfiles.matchesIdentity(context.context, message.profileIdentity, message.targetTabId)) {
        respond({ accepted: false, applied: false, reason: "account_identity_mismatch" });
        return;
      }
      revision++;
      try { configure(message.preferences, respond); }
      catch (error) {
        failure("runtime.configure", error);
        readError = typeof globalThis.GSTHarvest?.normalize === "function" ? "HS-CONFIGURE" : "HS-OPTIONS";
        respond({ accepted: false, applied: false, error: readError });
      }
      return true;
    }
    if (!["gst:harvest-status", "gst:harvest-history"].includes(message?.type)) return;
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
        respond({ message: "Chưa kết nối Thu hoạch; tải lại trang game sau khi cập nhật extension.",
          enabled: null, applied: false, catalog: [], available: false });
      }, 800);
      pending.set(requestId, { timer, respond });
      window.postMessage({ channel: "gst:harvest:v1", type: "synchronize", preferences, requestId }, origin);
    });
    return true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.harvestShortcut) {
      shortcutRevision++;
      shortcut = shortcutCode(changes.harvestShortcut.newValue);
    }
    if (area === "local" && changes.harvestDebugEnabled) setDebug(changes.harvestDebugEnabled.newValue);
    // Profile-scoped configuration is delivered by account-content after identity confirmation.
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
  window.postMessage({ channel: "gst:account-profile:v1", type: "ready" }, origin);
  const initialRevision = revision, initialShortcutRevision = shortcutRevision;
  chrome.storage.local.get(["harvestPreferences", "harvestDebugEnabled", "harvestShortcut"]).then((saved) => {
    if (initialShortcutRevision === shortcutRevision) shortcut = shortcutCode(saved.harvestShortcut);
    setDebug(saved.harvestDebugEnabled);
    record("bridge.start", moduleState());
    if (initialRevision === revision && accountProfileReady) readPreferences();
  }).catch((error) => {
    failure("bridge.start", error);
    // MAIN starts disabled already. A failed read must not send guessed OFF
    // settings or overwrite a configuration received from the popup.
    if (initialRevision === revision) readError = "HS-INITIAL";
  });
})();
