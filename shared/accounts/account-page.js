(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const channel = "gst:account:v1";
  let sequence = 0;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const connected = (scene) => !!scene?.driver && !scene.driver.closing && !scene.driver.reconnecting
    && !scene.driver.displaced && (scene.driver.online === false || scene.driver.link?.open?.() === true);
  function launchUrl() {
    const url = new URL(location.href);
    url.username = ""; url.password = ""; url.hash = "";
    for (const key of [...url.searchParams.keys()])
      if (/(user|login|pass(word)?|token|auth|credential|email|secret)/i.test(key)) url.searchParams.delete(key);
    url.searchParams.delete("slot");
    url.searchParams.delete("gstAttempt");
    url.searchParams.set("online", "1");
    url.searchParams.set("timer", "");
    return url.href;
  }
  function snapshot() {
    const scene = sceneNow(), profile = scene?.profile;
    const active = !!scene?.sys?.isActive?.() && connected(scene);
    const loginError = document.querySelector("#login .err");
    return {
      slot: new URLSearchParams(location.search).get("slot") ?? "",
      connected: active,
      character: active && typeof profile?.name === "string" ? profile.name.normalize("NFC") : "",
      classId: active && typeof profile?.classId === "string" ? profile.classId : "",
      characterId: active && (typeof scene.you === "string" || Number.isSafeInteger(scene.you)) ? String(scene.you) : "",
      autoOn: active && scene.auto?.on === true,
      loginVisible: !!document.querySelector("#login form")?.getClientRects?.().length,
      loginRejected: !!loginError?.getClientRects?.().length && !!loginError.textContent?.trim(),
      offline: new URL(location.href).searchParams.get("online") === "0",
      launchUrl: location.origin === origin ? launchUrl() : ""
    };
  }
  function openSettingsForLogout(data) {
    const scene = sceneNow();
    const before = snapshot();
    const expected = data?.identity;
    if (!scene || typeof scene.openSettings !== "function")
      return { ready: false, reason: "native_settings_unavailable" };
    if (data.slot !== before.slot || data.attemptId !== new URL(location.href).searchParams.get("gstAttempt")
        || before.connected !== true || !expected || before.character !== expected.character
        || before.classId !== expected.classId || before.characterId !== expected.characterId)
      return { ready: false, reason: "identity_changed_during_recovery" };
    try { scene.openSettings(); }
    catch { return { ready: false, reason: "native_settings_unavailable" }; }
    const after = snapshot();
    if (sceneNow() !== scene || after.connected !== true || after.slot !== data.slot
        || after.character !== expected.character || after.classId !== expected.classId
        || after.characterId !== expected.characterId)
      return { ready: false, reason: "identity_changed_during_recovery" };
    return { ready: true, settingsOpen: true };
  }
  function waitForConfiguration(statusChannel, requestId, predicate, timeoutMs = 1200) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        window.removeEventListener("message", onMessage);
        resolve(false);
      }, timeoutMs);
      function onMessage(event) {
        if (event.source !== window || event.origin !== origin || event.data?.channel !== statusChannel
            || event.data.requestId !== requestId) return;
        clearTimeout(timer);
        window.removeEventListener("message", onMessage);
        resolve(predicate(event.data));
      }
      window.addEventListener("message", onMessage);
    });
  }
  async function disableFeature(channelName, statusName, preferences, predicate) {
    const requestId = "account-stop:" + (++sequence);
    const ack = waitForConfiguration(statusName, requestId, predicate);
    window.postMessage({ channel: channelName, type: "configure", requestId, preferences }, origin);
    return ack;
  }
  async function stopForSwitch() {
    const scene = sceneNow();
    const offline = new URL(location.href).searchParams.get("online") === "0";
    const loginVisible = !!document.querySelector("#login form")?.getClientRects?.().length;
    // A native login screen with no world scene has no in-game owner to stop.
    // If a scene object exists but is inactive/disconnected, keep the safe abort.
    if (offline || (scene
        ? (!scene.sys?.isActive?.() || !connected(scene))
        : !loginVisible))
      return { ready: false, reason: "game_not_connected" };
    if (typeof globalThis.GSTHarvest?.prepareAccountSwitch !== "function"
        || globalThis.GSTHarvest.prepareAccountSwitch(scene) !== true
        || globalThis.GSTHarvest.canSwitchAccount?.(scene) === false)
      return { ready: false, reason: "harvest_request_pending" };
    if (typeof globalThis.GSTQuest?.stopForAccountSwitch !== "function"
        || globalThis.GSTQuest.stopForAccountSwitch() !== true)
      return { ready: false, reason: "quest_stop_unconfirmed" };
    try {
      globalThis.GSTMapTravel?.cancel?.();
      if (globalThis.GSTMapTravel?.active?.(scene) === true)
        return { ready: false, reason: "map_travel_stop_unconfirmed" };
    } catch { return { ready: false, reason: "map_travel_stop_unconfirmed" }; }
    const [chestStopped] = await Promise.all([
      disableFeature("gst:chest:v1", "gst:chest-status:v1", { enabled: false },
        (data) => data.enabled === false)
    ]);
    if (!chestStopped) return { ready: false, reason: "task_stop_unconfirmed" };
    if (scene?.auto?.on === true) {
      try { globalThis.GSTFarmSession?.forget?.(scene); } catch { return { ready: false, reason: "farm_stop_failed" }; }
      try { scene.toggleAutoFarm(); } catch { return { ready: false, reason: "farm_stop_failed" }; }
    }
    if (scene) {
      try { globalThis.GSTFarmSession?.forget?.(scene); } catch { return { ready: false, reason: "farm_stop_failed" }; }
      if (scene.auto?.on !== false) return { ready: false, reason: "farm_stop_unconfirmed" };
    }
    if (globalThis.GSTHarvest.canSwitchAccount?.(scene) === false)
      return { ready: false, reason: "harvest_request_pending" };
    return { ready: true, reason: "automation_stopped", autoOn: false };
  }
  window.addEventListener("message", async (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== channel) return;
    const data = event.data;
    if (!["status", "stop-for-switch", "open-settings-for-logout"].includes(data.type)
        || typeof data.requestId !== "string") return;
    let result;
    try {
      if (data.type === "stop-for-switch") result = await stopForSwitch();
      else if (data.type === "open-settings-for-logout") result = openSettingsForLogout(data);
      else result = { ready: true, ...snapshot() };
    } catch { result = { ready: false, reason: "account_status_unavailable" }; }
    window.postMessage({ channel: "gst:account-status:v1", requestId: data.requestId, ...result }, origin);
  });
})();
