(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let settings = null;
  let revision = 0;
  let shortcut = null;
  let shortcutRevision = 0;
  let sequence = 0;
  let navigating = false;
  let suspended = false, loadTimer = null, loadAttempts = 0, loading = false;
  let configurationSent = false, loadError = "";
  let accountProfileReady = false, accountProfileVerified = false, accountProfileKey = "", accountId = "";
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
    // The storage bridge must still deliver configuration if its isolated-world
    // helper is unavailable. Preserve explicit native/disabled modes; MAIN also
    // validates the mode before applying it.
    const policyMode = typeof globalThis.GSTFarmPolicy?.read === "function"
      ? globalThis.GSTFarmPolicy.read(value)
      : ["native", "disabled"].includes(value?.policyMode) ? value.policyMode : "extended";
    const retreatHpPercent = value?.retreatHpPercent, recoveryHpPercent = value?.recoveryHpPercent;
    const hpThresholds = Number.isSafeInteger(retreatHpPercent) && retreatHpPercent >= 1
      && Number.isSafeInteger(recoveryHpPercent) && retreatHpPercent < recoveryHpPercent && recoveryHpPercent <= 100
      ? { retreatHpPercent, recoveryHpPercent } : { retreatHpPercent: 40, recoveryHpPercent: 100 };
    settings = {
      policyMode,
      identityBlocked: value?.identityBlocked === true,
      identityVerified: accountProfileReady && accountProfileVerified,
      accountProfileKey: accountProfileVerified ? accountProfileKey : "",
      accountId: accountProfileVerified ? accountId : "",
      enabled: value?.enabled === true,
      showTargetLine: value?.showTargetLine === true,
      showRange: value?.showRange === true,
      nearbyClear: value?.nearbyClear === true,
      nearbyRadius: Number.isSafeInteger(value?.nearbyRadius)
        ? Math.max(1, Math.min(6, value.nearbyRadius)) : 2,
      autoRespawn: value?.autoRespawn !== false,
      noRetreat: value?.noRetreat !== false,
      bossDodge: value?.bossDodge !== false,
      eliteDodge: value?.eliteDodge === true,
      bossRetreat: value?.bossRetreat !== false,
      ...hpThresholds,
      searchScope: value?.searchScope === "map" ? "map" : "radius",
      breakSeals: value?.breakSeals === true,
      idleMode: ["home", "seek"].includes(value?.idleMode) ? value.idleMode : "hold",
      preferLoot: value?.preferLoot !== false,
      selfDefense: value?.selfDefense === true,
      autoEncounter: value?.autoEncounter === true,
      acceptPartyInvites: accountProfileReady && accountProfileVerified && value?.acceptPartyInvites === true,
      allowPlayerTargets: accountProfileReady && accountProfileVerified && value?.allowPlayerTargets === true,
      excludeBoss: value?.excludeBoss === true,
      bossFilter: value?.bossFilter === "world" ? "world" : "all",
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
    // The network monitor also needs an exposed game scene when farm and harvest are OFF.
    // The game only exposes window.game in its native ?timer mode; avoid offline lab mode.
    const monitorOnlineConnection = url.searchParams.get("online") !== "0";
    if ((monitorOnlineConnection || settings.enabled || settings.autoRespawn || settings.breakSeals
        || settings.targetMode !== "all" || settings.bossFilter === "world") && !url.searchParams.has("timer")) {
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
    configurationSent = true;
    loadError = "";
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
      configuration: {
        policyHelper: typeof globalThis.GSTFarmPolicy?.read === "function",
        loaded: settings !== null, sent: configurationSent,
        received: event.data.configurationReceived === true,
        ready: event.data.configurationReady === true, error: loadError
      },
      autoOn: typeof event.data.autoOn === "boolean" ? event.data.autoOn : null,
      dead: typeof event.data.dead === "boolean" ? event.data.dead : null,
      encounterStatus: typeof event.data.encounterStatus === "string" ? event.data.encounterStatus.slice(0, 160) : "",
      message: loadError || (typeof event.data.message === "string" ? event.data.message.slice(0, 240) : "No Auto Farm status.")
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
      const context = GSTAccountProfiles.context();
      if (!accountProfileReady || !accountProfileVerified
          || !Number.isInteger(message.targetTabId)
          || message.profileIdentity?.tabId !== message.targetTabId
          || !GSTAccountProfiles.matchesIdentity(context.context, message.profileIdentity, message.targetTabId)) {
        respond({ accepted: false, reason: "account_identity_mismatch" });
        return;
      }
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
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:account-profile:v1"
        || event.data.type !== "profile") return;
    const state = GSTAccountProfiles.context();
    if (!state.ready || state.context?.verified !== (event.data.verified === true)
        || (event.data.verified === true && state.context?.profileKey !== event.data.profileKey)) return;
    accountProfileReady = true;
    accountProfileVerified = event.data.verified === true;
    accountProfileKey = accountProfileVerified ? event.data.profileKey : "";
    accountId = accountProfileVerified ? event.data.connectionRecoveryContext?.accountId ?? "" : "";
    revision++;
    const preferences = accountProfileVerified
      ? event.data.farmPreferences
      : { ...(event.data.farmPreferences ?? {}), identityBlocked: true,
          enabled: false, autoRespawn: false, breakSeals: false };
    configure(preferences);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.farmShortcut) {
      shortcutRevision++;
      configureShortcut(changes.farmShortcut.newValue);
    }
    // Farm preferences are routed by account-content after native identity confirmation.
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    loadAttempts = 0; void loadPreferences();
  });
  window.addEventListener("pagehide", () => {
    suspended = true;
    clearTimeout(loadTimer); loadTimer = null;
    for (const entry of pending.values()) {
      clearTimeout(entry.timeout);
      entry.respond({ message: "Page is navigating." });
    }
    pending.clear();
  });
  async function loadPreferences() {
    if (suspended || loading) return;
    loading = true;
    clearTimeout(loadTimer); loadTimer = null;
    const initialShortcutRevision = shortcutRevision;
    loadAttempts++;
    try {
      const { farmShortcut } = await chrome.storage.local.get(["farmShortcut"]);
      if (suspended) return;
      if (shortcutRevision === initialShortcutRevision) configureShortcut(farmShortcut);
    } catch (error) {
      if (suspended) return;
      const kind = ["TypeError", "ReferenceError", "RangeError"].includes(error?.name) ? error.name : "Error";
      loadError = `Chưa đọc/gửi được cấu hình Auto Farm (${kind}); đã thử ${loadAttempts}/3 lần.`;
      // Retry saved configuration only; never authorize automation using guessed settings.
      if (loadAttempts < 3) loadTimer = setTimeout(loadPreferences, loadAttempts * 1000);
    } finally { loading = false; }
  }
  window.postMessage({ channel: "gst:account-profile:v1", type: "ready" }, origin);
  void loadPreferences();
})();
