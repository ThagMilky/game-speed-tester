(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let settings = null;
  let revision = 0;
  let shortcut = null;
  let shortcutRevision = 0;
  let sequence = 0;
  let navigating = false;
  const pending = new Map();

  function configureShortcut(value) {
    const code = value?.code;
    shortcut = Number.isInteger(code) && ((code >= 48 && code <= 57) || (code >= 65 && code <= 90)
      || (code >= 112 && code <= 121 && code !== 116)) ? code : null;
    if (shortcut !== null) {
      const url = new URL(location.href);
      if (!url.searchParams.has("timer")) {
        if (!navigating) {
          navigating = true;
          url.search += `${url.search ? "&" : "?"}timer`;
          // Diagnostic marker only: no URL, account or network data is stored.
          try { sessionStorage.setItem("gst:background-redirect:v1", "extension_timer"); } catch {}
          location.replace(url.href);
        }
        return;
      }
    }
    window.postMessage({ channel: "gst:farm:v1", type: "shortcut", code: shortcut }, origin);
  }

  function configure(value) {
    settings = {
      enabled: value?.enabled === true,
      showTargetLine: value?.showTargetLine === true,
      autoRespawn: true,
      noRetreat: value?.noRetreat !== false,
      bossDodge: value?.bossDodge !== false,
      bossRetreat: value?.bossRetreat !== false,
      searchScope: value?.searchScope === "map" ? "map" : "radius",
      breakSeals: value?.breakSeals === true,
      idleMode: ["home", "seek"].includes(value?.idleMode) ? value.idleMode : "hold",
      preferLoot: value?.preferLoot !== false,
      excludeBoss: value?.excludeBoss === true,
      targetMode: value?.targetMode === "level" ? "maxLevel"
        : value?.targetMode === "bossFirst" ? "bossLevel"
        : ["maxLevel", "minLevel", "range", "boss", "bossLevel", "highLevel", "lowLevel"].includes(value?.targetMode) ? value.targetMode : "all",
      targetLevel: Number.isSafeInteger(value?.targetLevel) && value.targetLevel > 0 ? value.targetLevel : 1,
      targetMinLevel: Number.isSafeInteger(value?.targetMinLevel) && value.targetMinLevel > 0 ? value.targetMinLevel : 1,
      targetMaxLevel: Number.isSafeInteger(value?.targetMaxLevel) && value.targetMaxLevel > 0 ? value.targetMaxLevel : 20,
      radius: typeof value?.radius === "number" && Number.isFinite(value.radius)
        ? Math.max(1, Math.min(1000, value.radius)) : 22
    };
    const url = new URL(location.href);
    if ((settings.enabled || settings.autoRespawn || settings.breakSeals || settings.targetMode !== "all") && !url.searchParams.has("timer")) {
      if (!navigating) {
        navigating = true;
        url.search += `${url.search ? "&" : "?"}timer`;
        // Diagnostic marker only: no URL, account or network data is stored.
        try { sessionStorage.setItem("gst:background-redirect:v1", "extension_timer"); } catch {}
        location.replace(url.href);
      }
      return;
    }
    window.postMessage({ channel: "gst:farm:v1", type: "configure", ...settings }, origin);
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:farm-status:v1") return;
    if (event.data.ready) {
      if (settings) configure(settings);
      configureShortcut({ code: shortcut });
    }
    const entry = pending.get(event.data.requestId);
    if (!entry) return;
    clearTimeout(entry.timeout);
    pending.delete(event.data.requestId);
    entry.respond({
      autoOn: typeof event.data.autoOn === "boolean" ? event.data.autoOn : null,
      dead: typeof event.data.dead === "boolean" ? event.data.dead : null,
      message: typeof event.data.message === "string" ? event.data.message.slice(0, 240) : "No Auto Farm status."
    });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:farm-shortcut") {
      shortcutRevision++;
      configureShortcut(message.preferences);
      respond({ accepted: true });
      return;
    }
    if (message?.type === "gst:farm-configure") {
      revision++;
      configure(message.preferences);
      respond({ accepted: true });
      return;
    }
    if (message?.type !== "gst:farm-status") return;
    const requestId = String(++sequence);
    const timeout = setTimeout(() => {
      pending.delete(requestId);
      respond({ message: "Auto Farm bridge unavailable; reload the game tab after updating the extension." });
    }, 800);
    pending.set(requestId, { respond, timeout });
    window.postMessage({ channel: "gst:farm:v1", type: "status", requestId }, origin);
    return true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.farmShortcut) {
      shortcutRevision++;
      configureShortcut(changes.farmShortcut.newValue);
    }
    if (area === "local" && changes.farmPreferences) {
      revision++;
      configure(changes.farmPreferences.newValue);
    }
  });
  window.addEventListener("pageshow", () => {
    if (settings) configure(settings);
    configureShortcut({ code: shortcut });
  });
  window.addEventListener("pagehide", () => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timeout);
      entry.respond({ message: "Page is navigating." });
    }
    pending.clear();
  });
  const initialRevision = revision;
  const initialShortcutRevision = shortcutRevision;
  chrome.storage.local.get(["farmPreferences", "farmShortcut"]).then(({ farmPreferences, farmShortcut }) => {
    if (revision === initialRevision) configure(farmPreferences);
    if (shortcutRevision === initialShortcutRevision) configureShortcut(farmShortcut);
  }).catch(() => { /* Do not replace saved filters or authorize auto-resume with guessed defaults. */ });
})();
