(() => {
  "use strict";
  // Observe native transport health; keep handshake, credentials and retry
  // decisions inside the game's original driver.
  const retryDelays = [15000, 30000, 60000];
  const replyTimeout = 12000;
  const defaults = Object.freeze({ autoReconnect: true, autoReload: false, reloadDelaySeconds: 90 });
  const episodeStorageKey = "gst:connection-recovery:v1";
  const reloadWindowMs = 15 * 60 * 1000;
  const reloadLimit = 3;
  const cancelSeconds = 10;
  let suspended = false, timer = null, state = null;
  let preferences = { ...defaults }, profileContext = null, preferencesReady = false;
  let activeScopeKey = "", reloadTimer = null, reloadBanner = null;
  const memoryCanceled = new Set();

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
      && !driver.closing
      && typeof driver.link?.open === "function";
  }
  function normalizePreferences(value = {}) {
    const delay = Number.isSafeInteger(value.reloadDelaySeconds)
      ? Math.max(30, Math.min(600, value.reloadDelaySeconds)) : defaults.reloadDelaySeconds;
    return {
      autoReconnect: value.autoReconnect !== false,
      autoReload: value.autoReload === true,
      reloadDelaySeconds: delay
    };
  }
  function readRecords() {
    try {
      const value = JSON.parse(sessionStorage.getItem(episodeStorageKey) ?? "{}");
      return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    } catch { return {}; }
  }
  function writeRecords(records) {
    try { sessionStorage.setItem(episodeStorageKey, JSON.stringify(records)); return true; }
    catch { return false; }
  }
  function recordFor(scopeKey, now, outageStart = now) {
    const records = readRecords();
    const old = records[scopeKey];
    const validOld = old && old.version === 1 && old.scopeKey === scopeKey
      && Number.isFinite(old.startedAt) && Array.isArray(old.reloads)
      && Number.isSafeInteger(old.extensionAttempts);
    if (validOld && old.startedAt > 0) return old;
    const next = { version: 1, scopeKey, startedAt: outageStart, extensionAttempts: 0,
      reloads: validOld ? old.reloads : [], countdownStartedAt: 0, canceled: false };
    records[scopeKey] = next;
    return writeRecords(records) ? next : null;
  }
  function saveRecord(record) {
    const records = readRecords();
    records[record.scopeKey] = record;
    return writeRecords(records);
  }
  function clearRecord(scopeKey) {
    if (!scopeKey) return;
    const records = readRecords();
    const old = records[scopeKey];
    records[scopeKey] = { version: 1, scopeKey, startedAt: 0, extensionAttempts: 0,
      reloads: Array.isArray(old?.reloads) ? old.reloads : [], countdownStartedAt: 0, canceled: false };
    writeRecords(records);
    memoryCanceled.delete(scopeKey);
  }
  function hideReloadBanner() {
    reloadBanner?.remove();
    reloadBanner = null;
  }
  function stopReloadCountdown() {
    clearTimeout(reloadTimer);
    reloadTimer = null;
  }
  function showReloadBanner(message, cancelAction = null) {
    if (!reloadBanner?.isConnected) {
      const root = document.createElement("div");
      root.setAttribute("role", "status");
      root.setAttribute("aria-live", "assertive");
      root.style.cssText = "position:fixed;right:16px;bottom:16px;z-index:2147483646;max-width:min(420px,calc(100vw - 32px));padding:12px 14px;border:1px solid #f0b44d;border-radius:9px;background:#211d16;color:#fff;font:14px/1.45 system-ui,sans-serif;box-shadow:0 4px 24px #0008";
      const text = document.createElement("span");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Hủy tải lại";
      button.style.cssText = "display:block;margin-top:8px;padding:7px 12px;border:1px solid #f0b44d;border-radius:6px;background:#3a3020;color:#fff;font:inherit;cursor:pointer";
      root.append(text, button);
      (document.body ?? document.documentElement).append(root);
      reloadBanner = { root, text, button };
    }
    reloadBanner.text.textContent = message;
    reloadBanner.button.hidden = typeof cancelAction !== "function";
    reloadBanner.button.onclick = typeof cancelAction === "function" ? cancelAction : null;
  }
  function nativeIdentity(scene) {
    const profile = scene?.profile;
    const character = typeof profile?.name === "string" ? profile.name.normalize("NFC") : "";
    const classId = typeof profile?.classId === "string" ? profile.classId : "";
    const characterId = typeof scene?.you === "string" || Number.isSafeInteger(scene?.you) ? String(scene.you) : "";
    return { character, classId, characterId };
  }
  function reloadScope(scene) {
    const params = new URLSearchParams(location.search);
    const slot = params.get("slot") ?? "";
    const loginForm = document.querySelector("#login form");
    if (params.has("gstAttempt") || loginForm?.getClientRects?.().length) return null;
    const verification = document.querySelector('[name*="captcha" i], [name*="otp" i], [name*="verify" i], [name="code"], [id*="captcha" i], [id*="otp" i]');
    if (verification?.getClientRects?.().length) return null;
    const current = nativeIdentity(scene);
    if (!current.character) return null;
    const context = profileContext;
    if (slot) {
      if (!context?.managed || context.slot !== slot || !context.accountId || !context.expectedCharacter
          || current.character !== context.expectedCharacter
          || context.expectedClassId && current.classId !== context.expectedClassId) return null;
      return JSON.stringify({ type: "managed", slot, accountId: context.accountId,
        profileKey: context.profileKey, character: context.expectedCharacter,
        classId: context.expectedClassId || current.classId });
    }
    if (context?.managed || context?.slot) return null;
    return JSON.stringify({ type: "unmanaged", character: current.character,
      classId: current.classId, characterId: current.characterId });
  }
  function cancelCurrentOutage(scopeKey, text = "Tự tải lại đã bị hủy cho lần mất kết nối này.") {
    if (!scopeKey) return;
    memoryCanceled.add(scopeKey);
    const record = readRecords()[scopeKey];
    if (record) { record.canceled = true; record.countdownStartedAt = 0; saveRecord(record); }
    stopReloadCountdown();
    showReloadBanner(text);
  }
  function applyProfileMessage(data) {
    const context = data.connectionRecoveryContext;
    if (!context || typeof context !== "object") return;
    const slot = new URLSearchParams(location.search).get("slot") ?? "";
    if ((context.slot ?? "") !== slot || context.managed !== !!slot
        || typeof context.accountId !== "string" || typeof context.profileKey !== "string") return;
    const previous = preferences;
    const previousScope = activeScopeKey;
    profileContext = {
      managed: context.managed === true, slot, accountId: context.accountId,
      profileKey: context.profileKey,
      expectedCharacter: typeof context.expectedCharacter === "string" ? context.expectedCharacter.normalize("NFC") : "",
      expectedClassId: typeof context.expectedClassId === "string" ? context.expectedClassId : "",
      verified: data.verified === true
    };
    preferences = normalizePreferences(data.connectionRecoveryPreferences);
    preferencesReady = true;
    const scene = sceneNow();
    const nextScope = scene ? reloadScope(scene) : null;
    if (previousScope && nextScope !== previousScope) {
      const oldRecord = readRecords()[previousScope];
      if (oldRecord?.countdownStartedAt) { oldRecord.countdownStartedAt = 0; saveRecord(oldRecord); }
      stopReloadCountdown();
      hideReloadBanner();
    }
    activeScopeKey = nextScope ?? "";
    if (previous.autoReload && !preferences.autoReload && previousScope && previousScope === nextScope)
      cancelCurrentOutage(previousScope, "Tự tải lại đã tắt; lần mất kết nối hiện tại sẽ không tự tải lại.");
  }
  function detach() {
    const previous = state;
    state = null;
    if (activeScopeKey) {
      const record = readRecords()[activeScopeKey];
      if (record?.countdownStartedAt) { record.countdownStartedAt = 0; saveRecord(record); }
    }
    stopReloadCountdown();
    hideReloadBanner();
    activeScopeKey = "";
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
      scene, driver, lastInbound: now, waitingSince: null, downSince: null, downSinceWall: null,
      healthySince: null, attempts: 0, lastAttempt: -Infinity, pending: false,
      nativeReconnectStarted: false,
      confirmed: false, receiveDescriptor: Object.getOwnPropertyDescriptor(driver, "receive"),
      originalReceive: driver.receive, originalStatus: driver.onStatus
    };
    owner.receiveHook = function (...args) {
      const result = owner.originalReceive.apply(this, args);
      // The original decoder handles all packets. Only observe arrival time.
      if (state === owner && this === driver && typeof args[0] === "string") {
        owner.lastInbound = performance.now();
        owner.waitingSince = null;
        if (!driver.reconnecting && !driver.handingOver) {
          owner.healthySince ??= owner.lastInbound;
          if (owner.downSince !== null) {
            owner.downSince = null;
            owner.downSinceWall = null;
          }
        }
      }
      return result;
    };
    owner.statusHook = function (...args) {
      const result = owner.originalStatus.apply(this, args);
      if (state === owner && this === driver && args[0] === "Mất kết nối · đang kết nối lại…")
        owner.nativeReconnectStarted = true;
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
    const button = panel?.querySelector("button");
    return sceneNow()?.driver?.noticed === true && panel?.firstChild?.nodeType === Node.TEXT_NODE
      && panel.firstChild.textContent?.trim() === "Mất kết nối máy chủ"
      && panel.getClientRects?.().length > 0 && button?.getClientRects?.().length > 0
      && button.textContent?.trim() === "Kết nối lại";
  }
  function retry(owner, now, staleOpen) {
    const { driver } = owner;
    if (!preferencesReady || !preferences.autoReconnect || owner.pending || owner.attempts >= retryDelays.length
        || driver.displaced
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
    const scopeKey = reloadScope(owner.scene);
    if (scopeKey) {
      const wallNow = Date.now();
      const record = recordFor(scopeKey, wallNow, owner.downSinceWall ?? wallNow);
      if (record) { record.extensionAttempts++; saveRecord(record); }
    }
    try {
      Promise.resolve(driver.reconnect("Mất phản hồi đường truyền")).catch(() => {
        // Server responses and the game's native error UI remain authoritative.
      }).finally(() => { if (state === owner) owner.pending = false; });
    } catch { owner.pending = false; }
  }
  function manageReload(owner, now) {
    const { driver } = owner;
    const scopeKey = reloadScope(owner.scene);
    if (scopeKey !== activeScopeKey) {
      const oldRecord = activeScopeKey ? readRecords()[activeScopeKey] : null;
      if (oldRecord?.countdownStartedAt) { oldRecord.countdownStartedAt = 0; saveRecord(oldRecord); }
      stopReloadCountdown();
      hideReloadBanner();
      activeScopeKey = scopeKey ?? "";
    }
    if (!scopeKey || !preferencesReady || !preferences.autoReload) return;
    if (!recoverableNetworkNotice()) {
      const current = readRecords()[scopeKey];
      if (current?.countdownStartedAt) { current.countdownStartedAt = 0; saveRecord(current); }
      stopReloadCountdown();
      hideReloadBanner();
      return;
    }
    const wallNow = Date.now();
    const record = recordFor(scopeKey, wallNow, owner.downSinceWall ?? wallNow);
    if (!record) {
      showReloadBanner("Không lưu được giới hạn an toàn trong tab; extension sẽ không tự tải lại.");
      return;
    }
    const retainedReloads = record.reloads.filter((at) => Number.isFinite(at) && wallNow - at < reloadWindowMs);
    if (retainedReloads.length !== record.reloads.length) {
      record.reloads = retainedReloads;
      if (!saveRecord(record)) {
        showReloadBanner("Không lưu được giới hạn an toàn trong tab; extension sẽ không tự tải lại.");
        return;
      }
    }
    if (navigator.onLine === false || owner.pending || driver.reconnecting || driver.handingOver
        || driver.closing || driver.displaced || new URLSearchParams(location.search).has("gstAttempt")) {
      if (record.countdownStartedAt) { record.countdownStartedAt = 0; saveRecord(record); }
      stopReloadCountdown();
      hideReloadBanner();
      return;
    }
    if (record.canceled || memoryCanceled.has(scopeKey)) {
      showReloadBanner("Tự tải lại đã bị hủy cho lần mất kết nối này.");
      return;
    }
    if (!owner.nativeReconnectStarted
        || preferences.autoReconnect && record.extensionAttempts < retryDelays.length) return;
    if (wallNow - record.startedAt < preferences.reloadDelaySeconds * 1000) return;
    if (record.reloads.length >= reloadLimit) {
      showReloadBanner("Đã đạt giới hạn 3 lần tải lại trong 15 phút. Hãy kiểm tra kết nối thủ công.");
      return;
    }
    if (!record.countdownStartedAt) {
      record.countdownStartedAt = wallNow;
      if (!saveRecord(record)) {
        showReloadBanner("Không lưu được đếm ngược an toàn; extension sẽ không tự tải lại.");
        return;
      }
    }
    const due = record.countdownStartedAt + cancelSeconds * 1000;
    const remaining = Math.max(0, Math.ceil((due - wallNow) / 1000));
    showReloadBanner(`Kết nối vẫn lỗi; trang sẽ tải lại sau ${remaining} giây.`, () => {
      const latestScope = reloadScope(owner.scene);
      if (latestScope !== scopeKey) { stopReloadCountdown(); hideReloadBanner(); return; }
      cancelCurrentOutage(scopeKey);
    });
    if (reloadTimer !== null || remaining > 0) {
      if (reloadTimer === null) reloadTimer = setTimeout(() => { reloadTimer = null; }, remaining * 1000);
      return;
    }
    const latestScope = reloadScope(owner.scene);
    if (latestScope !== scopeKey || !preferences.autoReload || !recoverableNetworkNotice()
        || navigator.onLine === false || owner.pending || driver.reconnecting || driver.handingOver
        || driver.closing || driver.displaced || new URLSearchParams(location.search).has("gstAttempt")) return;
    record.reloads.push(wallNow);
    record.countdownStartedAt = 0;
    if (!saveRecord(record)) {
      showReloadBanner("Không lưu được giới hạn an toàn trong tab; extension sẽ không tự tải lại.");
      return;
    }
    stopReloadCountdown();
    location.reload();
  }
  function observedFailureStatus(owner) {
    if (!owner) return "";
    const { driver } = owner;
    if (recoverableNetworkNotice()) {
      if (driver.displaced)
        return "Mạng: trạng thái phiên đang mơ hồ; extension tạm dừng hành động tự động để tránh tải lại nhầm.";
      const scopeKey = reloadScope(owner.scene);
      if (!preferencesReady) return "Mạng: lỗi kết nối đã được game xác nhận; đang đọc cài đặt.";
      if (preferences.autoReload && !scopeKey)
        return "Mạng: tự tải lại đang chờ xác nhận nhân vật/tab; không đủ identity an toàn.";
      if (preferences.autoReload && navigator.onLine === false)
        return "Mạng: trình duyệt đang offline; chờ kết nối trước khi tự tải lại.";
      if (preferences.autoReload && !driver.reconnecting && !driver.handingOver && !owner.pending) {
        const record = scopeKey ? readRecords()[scopeKey] : null;
        if (record?.reloads?.filter((at) => Date.now() - at < reloadWindowMs).length >= reloadLimit)
          return "Mạng: đã đạt giới hạn tự tải lại; cần kiểm tra thủ công.";
        if (!owner.nativeReconnectStarted)
          return "Mạng: đang chờ xác nhận kết quả lần thử reconnect gốc của game.";
        if (preferences.autoReconnect && (record?.extensionAttempts ?? 0) < retryDelays.length)
          return "Mạng: game báo mất kết nối; đang chờ các lần thử bổ sung kết thúc.";
        if (preferences.autoReload) return "Mạng: đang chờ thời gian tải lại đã đặt.";
      }
      if (!preferences.autoReconnect && !preferences.autoReload)
        return "Mạng: hỗ trợ reconnect của extension đang tắt; dùng nút Kết nối lại của game nếu cần.";
      return "Mạng: game báo mất kết nối; đang chờ hoặc thử kết nối lại.";
    }
    if (driver.noticed)
      return "Mạng: game đã phát lỗi phiên/kết nối khác; extension đã dừng thử tự động.";
    if (driver.displaced)
      return "Mạng: game đánh dấu phiên cần kiểm tra; nguyên nhân chưa xác định nên extension đã dừng tự động.";
    if (owner.downSince !== null) return "Mạng: mất phản hồi; đang theo dõi kết nối.";
    return "";
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
      owner.nativeReconnectStarted = false;
      owner.lastInbound = now;
      owner.waitingSince = null;
      owner.downSince = null;
      owner.downSinceWall = null;
      owner.healthySince = now;
      clearRecord(reloadScope(scene));
      stopReloadCountdown();
      hideReloadBanner();
      restoreGameUI(owner);
    }
    if (!stable) {
      owner.healthySince = null;
      if (owner.downSince === null) {
        owner.downSince = now;
        owner.downSinceWall = Date.now();
      }
      if (!open) retry(owner, now, false);
      manageReload(owner, now);
      return;
    }

    // The game may stop updating when idle, even if neither automation is ON.
    // Advance only the original network tick, never movement or gameplay.
    if (navigator.onLine !== false && !driver.noticed && !driver.displaced && !owner.pending
        && typeof driver.update === "function" && Number.isFinite(driver.tickAt)
        && now - driver.tickAt >= 1700) {
      try { driver.update(); } catch { /* Leave gameplay in control. */ }
    }

    // Native update resets waitingSince after >2s between ticks. Track the
    // first unanswered ping ourselves, using actual inbound server messages.
    if (Number.isFinite(driver.pingAt) && driver.pingAt > owner.lastInbound
        && owner.waitingSince === null) owner.waitingSince = driver.pingAt;
    if (owner.waitingSince !== null && now - owner.waitingSince >= replyTimeout) {
      if (owner.downSince === null) {
        owner.downSince = owner.waitingSince;
        owner.downSinceWall = Date.now() - Math.max(0, now - owner.waitingSince);
      }
      owner.healthySince = null;
      retry(owner, now, true);
      return;
    }
    const persistedEpisode = readRecords()[reloadScope(scene) ?? ""];
    if ((owner.attempts > 0 || owner.nativeReconnectStarted || persistedEpisode?.startedAt > 0)
        && owner.healthySince !== null
        && now - owner.healthySince >= 10000 && now - owner.lastInbound < 3000
        && !recoverableNetworkNotice() && !driver.noticed && !driver.displaced) {
      owner.downSince = null;
      owner.downSinceWall = null;
      owner.attempts = 0;
      owner.lastAttempt = -Infinity;
      owner.healthySince = null;
      owner.nativeReconnectStarted = false;
      clearRecord(reloadScope(scene));
      stopReloadCountdown();
      hideReloadBanner();
    }
    manageReload(owner, now);
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
      if (open && state.healthySince !== null && performance.now() - state.lastInbound < 10000
          && !recoverableNetworkNotice() && !driver.noticed && !driver.displaced) return "";
      const failure = observedFailureStatus(state);
      if (failure) return failure;
      if (state.downSince === null) return "";
      if (state.attempts >= retryDelays.length && !state.pending && !driver.reconnecting)
        return "Mạng: hết lượt thử; hãy kiểm tra kết nối thủ công.";
      return state.pending || driver.reconnecting
        ? "Mạng: đang thử kết nối lại." : "Mạng: mất phản hồi; đang theo dõi và sẽ thử lại.";
    }
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== location.origin
        || event.data?.channel !== "gst:account-profile:v1" || event.data.type !== "profile") return;
    applyProfileMessage(event.data);
  });
  window.postMessage({ channel: "gst:account-profile:v1", type: "ready" }, location.origin);
  window.addEventListener("pagehide", () => {
    suspended = true;
    clearInterval(timer); timer = null; detach();
  });
  window.addEventListener("pageshow", () => { suspended = false; start(); });
  start();
})();
