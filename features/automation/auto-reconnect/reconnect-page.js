(() => {
  "use strict";
  // Observe native transport health; keep handshake, credentials and retry
  // decisions inside the game's original driver.
  const retryDelays = [15000, 30000, 60000];
  const replyTimeout = 12000;
  let suspended = false, timer = null, state = null;

  function sceneNow() {
    try {
      return window.game?.scene?.getScene?.("world")
        ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
    } catch { return null; }
  }
  function eligible(scene) {
    const driver = scene?.driver;
    return scene?.sys?.isActive?.() === true && sceneNow() === scene && !scene.leaving
      && driver?.online === true && driver.ready === true
      && !driver.closing && !driver.displaced
      && typeof driver.link?.open === "function";
  }
  function detach() {
    const previous = state;
    state = null;
    if (!previous) return;
    const { driver } = previous;
    try {
      if (driver.receive === previous.receiveHook) {
        if (previous.receiveDescriptor) Object.defineProperty(driver, "receive", previous.receiveDescriptor);
        else delete driver.receive;
      }
      if (driver.onStatus === previous.statusHook) driver.onStatus = previous.originalStatus;
    } catch { /* Never disturb the native driver during scene teardown. */ }
  }
  function attach(scene) {
    const driver = scene.driver;
    if (state?.scene === scene && state.driver === driver
        && driver.receive === state.receiveHook && driver.onStatus === state.statusHook) return state;
    detach();
    if (typeof driver.receive !== "function" || typeof driver.onStatus !== "function") return null;
    const now = performance.now();
    const owner = {
      scene, driver, lastInbound: now, waitingSince: null, downSince: null,
      healthySince: null, attempts: 0, lastAttempt: -Infinity, pending: false,
      confirmed: false, receiveDescriptor: Object.getOwnPropertyDescriptor(driver, "receive"),
      originalReceive: driver.receive, originalStatus: driver.onStatus
    };
    owner.receiveHook = function (...args) {
      const result = owner.originalReceive.apply(this, args);
      // The original decoder handles all packets. Only observe arrival time.
      if (state === owner && this === driver && typeof args[0] === "string") {
        owner.lastInbound = performance.now();
        owner.waitingSince = null;
        if (!driver.reconnecting && !driver.handingOver && owner.downSince !== null) {
          owner.healthySince ??= owner.lastInbound;
          owner.downSince = null;
        }
      }
      return result;
    };
    owner.statusHook = function (...args) {
      const result = owner.originalStatus.apply(this, args);
      // The game emits this only after the server accepted resume.
      if (state === owner && this === driver && args[0] === "Đã kết nối lại") {
        owner.confirmed = true;
      }
      return result;
    };
    try {
      driver.receive = owner.receiveHook;
      driver.onStatus = owner.statusHook;
      if (driver.receive !== owner.receiveHook || driver.onStatus !== owner.statusHook)
        throw new Error("Driver callbacks unavailable");
      state = owner;
      return owner;
    } catch {
      try {
        if (driver.receive === owner.receiveHook) {
          if (owner.receiveDescriptor) Object.defineProperty(driver, "receive", owner.receiveDescriptor);
          else delete driver.receive;
        }
        if (driver.onStatus === owner.statusHook) driver.onStatus = owner.originalStatus;
      } catch { /* Preserve the game's callbacks if the bridge is unsupported. */ }
      return null;
    }
  }
  function restoreGameUI(owner) {
    const scene = owner.scene;
    // Do not hide a rejection or fabricate a connection. Only a confirmed
    // native "resumed" status with an open transport authorizes restoration.
    const lost = document.getElementById("lost");
    const button = lost?.querySelector("button");
    if (lost && button?.textContent?.trim() === "Kết nối lại"
        && /Mất kết nối/.test(lost.textContent ?? "")) lost.remove();
    const chat = scene.chat;
    if (chat?.connected !== false || !(chat.root instanceof HTMLElement)
        || chat.root.id !== "chat" || !chat.root.isConnected) return;
    const label = chat.root.querySelector(".connection");
    const send = chat.root.querySelector("button.send");
    if (!(label instanceof HTMLElement) || !(send instanceof HTMLButtonElement)
        || !(chat.feedback instanceof HTMLElement)) return;
    chat.connected = true;
    label.textContent = "Trực tuyến";
    chat.feedback.textContent = "";
    send.disabled = false;
  }
  function recoverableNetworkNotice() {
    // The native retry loop emits this exact network error after exhaustion.
    // An error received from the server can also set "noticed" for this text;
    // that flag alone does not prove a permanently rejected session.
    // Do not retry other errors, including rejection/other-login notices.
    const panel = document.getElementById("lost");
    return panel?.firstChild?.nodeType === Node.TEXT_NODE
      && panel.firstChild.textContent?.trim() === "Mất kết nối máy chủ"
      && panel.querySelector("button")?.textContent?.trim() === "Kết nối lại";
  }
  function retry(owner, now, staleOpen) {
    const { driver } = owner;
    if (owner.pending || owner.attempts >= retryDelays.length
        || (driver.noticed && !recoverableNetworkNotice())
        || driver.reconnecting || driver.handingOver || navigator.onLine === false
        || typeof driver.reconnect !== "function") return;
    const since = owner.attempts === 0
      ? (staleOpen ? owner.waitingSince : owner.downSince) : owner.lastAttempt;
    const delay = owner.attempts === 0 && staleOpen ? replyTimeout : retryDelays[owner.attempts];
    if (since === null || now - since < delay) return;
    owner.pending = true;
    owner.attempts++;
    owner.lastAttempt = now;
    try {
      Promise.resolve(driver.reconnect("Mất phản hồi đường truyền")).catch(() => {
        // Server responses and the game's native error UI remain authoritative.
      }).finally(() => { if (state === owner) owner.pending = false; });
    } catch { owner.pending = false; }
  }
  function watch() {
    if (suspended) return;
    const scene = sceneNow();
    if (!eligible(scene)) { detach(); return; }
    const owner = attach(scene);
    if (!owner) return;
    const { driver } = owner, now = performance.now();
    let open;
    try { open = driver.link.open() === true; } catch { return; }
    const stable = open && !driver.reconnecting && !driver.handingOver;

    if (stable && owner.confirmed) {
      owner.confirmed = false;
      owner.lastInbound = now;
      owner.waitingSince = null;
      owner.downSince = null;
      owner.healthySince = now;
      restoreGameUI(owner);
    }
    if (!stable) {
      owner.healthySince = null;
      owner.downSince ??= now;
      if (!open) retry(owner, now, false);
      return;
    }

    // The game may stop updating when idle, even if neither automation is ON.
    // Advance only the original network tick, never movement or gameplay.
    if (navigator.onLine !== false && !driver.noticed && !owner.pending
        && typeof driver.update === "function" && Number.isFinite(driver.tickAt)
        && now - driver.tickAt >= 1700) {
      try { driver.update(); } catch { /* Leave gameplay in control. */ }
    }

    // Native update resets waitingSince after >2s between ticks. Track the
    // first unanswered ping ourselves, using actual inbound server messages.
    if (Number.isFinite(driver.pingAt) && driver.pingAt > owner.lastInbound
        && owner.waitingSince === null) owner.waitingSince = driver.pingAt;
    if (owner.waitingSince !== null && now - owner.waitingSince >= replyTimeout) {
      owner.downSince ??= owner.waitingSince;
      owner.healthySince = null;
      retry(owner, now, true);
      return;
    }
    if (owner.attempts > 0 && owner.healthySince !== null
        && now - owner.healthySince >= 10000 && now - owner.lastInbound < 3000) {
      owner.downSince = null;
      owner.attempts = 0;
      owner.lastAttempt = -Infinity;
      owner.healthySince = null;
    }
  }
  function start() {
    if (suspended || timer !== null) return;
    timer = setInterval(watch, 1000);
    watch();
  }
  globalThis.GSTConnectionRecovery = {
    status(scene) {
      if (!state || state.scene !== scene) return "";
      const { driver } = state;
      let open = false;
      try { open = driver.link.open() === true && !driver.reconnecting && !driver.handingOver; }
      catch { /* Report the last known state. */ }
      if (open && state.healthySince !== null && performance.now() - state.lastInbound < 10000) return "";
      if (driver.displaced || (driver.noticed && !recoverableNetworkNotice()))
        return "Mạng: phiên không thể tự khôi phục; hãy dùng Kết nối lại của game.";
      if (state.downSince === null) return "";
      if (state.attempts >= retryDelays.length && !state.pending && !driver.reconnecting)
        return "Mạng: hết lượt thử; hãy kiểm tra kết nối thủ công.";
      return state.pending || driver.reconnecting
        ? "Mạng: đang thử kết nối lại." : "Mạng: mất phản hồi; đang theo dõi và sẽ thử lại.";
    }
  };
  window.addEventListener("pagehide", () => {
    suspended = true;
    clearInterval(timer); timer = null; detach();
  });
  window.addEventListener("pageshow", () => { suspended = false; start(); });
  start();
})();
