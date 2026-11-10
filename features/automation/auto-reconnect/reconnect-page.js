(() => {
  "use strict";
  // Recovery is best-effort. Never change the game's session, auth, movement,
  // WebSocket transport, or server rejection handling.
  const retryDelays = [15000, 30000, 60000];
  let suspended = false, timer = null, state = null;

  function sceneNow() {
    try {
      return window.game?.scene?.getScene?.("world")
        ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
    } catch { return null; }
  }
  function valid(scene) {
    const driver = scene?.driver;
    return scene?.sys?.isActive?.() === true && sceneNow() === scene && !scene.leaving
      && driver?.online === true && !driver.closing && !driver.displaced && !driver.noticed
      && navigator.onLine !== false && typeof driver.link?.open === "function";
  }
  function watch() {
    if (suspended) return;
    const scene = sceneNow();
    if (!valid(scene)) { state = null; return; }
    const driver = scene.driver, now = performance.now();
    if (!state || state.driver !== driver || state.scene !== scene) {
      state = { driver, scene, downSince: null, restoredAt: null,
        attempts: 0, lastAttempt: -Infinity, pending: false, lastProbe: -Infinity };
    }
    const owner = state;
    let open;
    try { open = driver.link.open() === true; } catch { return; }

    if (open && !driver.reconnecting && !driver.handingOver) {
      if (owner.downSince !== null) {
        owner.restoredAt ??= now;
        // Avoid resetting the retry budget for a briefly opened, unstable socket.
        if (now - owner.restoredAt >= 10000) {
          owner.downSince = null;
          owner.restoredAt = null;
          owner.attempts = 0;
          owner.lastAttempt = -Infinity;
        }
      }
      // Native background Auto Farm / Harvest normally advances the game itself.
      // Only run the native network tick if its own update has stalled.
      const working = scene.auto?.on === true
        || globalThis.GSTHarvest?.isEnabled?.() === true;
      if (working && !owner.pending && typeof driver.update === "function"
          && Number.isFinite(driver.tickAt) && driver.tickAt > 0
          && now - driver.tickAt >= 6000 && now - owner.lastProbe >= 6000) {
        owner.lastProbe = now;
        try { driver.update(); } catch { /* Never interfere with game updates. */ }
      }
      return;
    }

    owner.restoredAt = null;
    owner.downSince ??= now;
    if (open || driver.reconnecting || driver.handingOver || owner.pending
        || owner.attempts >= retryDelays.length || typeof driver.reconnect !== "function") return;

    const delay = retryDelays[owner.attempts];
    const since = owner.attempts === 0 ? owner.downSince : owner.lastAttempt;
    if (now - since < delay) return;

    owner.attempts++;
    owner.lastAttempt = now;
    owner.pending = true;
    try {
      Promise.resolve(driver.reconnect("Đường truyền bị ngắt")).catch(() => {
        // The game's own status and error handlers remain authoritative.
      }).finally(() => {
        if (state === owner) owner.pending = false;
      });
    } catch { owner.pending = false; }
  }
  function start() {
    if (suspended || timer !== null) return;
    timer = setInterval(watch, 3000);
    watch();
  }
  globalThis.GSTConnectionRecovery = {
    status(scene) {
      if (!state || state.scene !== scene || state.downSince === null) return "";
      if (state.attempts >= retryDelays.length && !state.pending && !scene.driver?.reconnecting)
        return "Mạng: hết lượt thử tự kết nối lại; cần kiểm tra kết nối thủ công.";
      return state.pending || scene.driver?.reconnecting
        ? "Mạng: đang thử kết nối lại." : "Mạng: mất kết nối; sẽ thử lại khi an toàn.";
    }
  };
  window.addEventListener("pagehide", () => {
    suspended = true;
    clearInterval(timer); timer = null; state = null;
  });
  window.addEventListener("pageshow", () => { suspended = false; start(); });
  start();
})();
