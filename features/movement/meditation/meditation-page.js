(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const RETRY_LIMIT = 3;
  let enabled = false, suspended = false, revision = -1;
  let binding = null, watcher = null, pending = null;
  let attempts = 0, retryAt = 0, stableAt = null, stablePosition = null, flightReleaseUntil = 0, lastMeditating = false;
  let episode = "", lastBlocked = "", statusText = "Đang chờ đọc cài đặt Luôn thiền.", farmActivatedAt = 0;
  let statusObserved = "unknown", lastSentStatus = "";

  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const finite = Number.isFinite;
  function connected(scene) {
    const d = scene?.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  }
  function fresh(scene) {
    return typeof scene?.now === "function" && finite(scene.selfAt)
      && scene.now() >= scene.selfAt && scene.now() - scene.selfAt <= 2;
  }
  function identity(scene) {
    return `${scene.profile?.name ?? "?"}|${scene.map?.scene ?? "?"}`;
  }
  function observed(scene) {
    return !scene?.self || !fresh(scene) ? "unknown" : scene.self.med === true ? "on" : "off";
  }
  function clearStability() { stableAt = null; stablePosition = null; }
  function emit(type = "status", extra = {}) {
    const scene = binding?.scene ?? sceneNow();
    const status = {
      enabled, autoOn: scene?.auto?.on === true,
      meditating: scene?.self?.med === true,
      observed: observed(scene),
      message: statusText, phase: pending ? "pending" : statusObserved,
      requestCount: attempts, requestLimit: RETRY_LIMIT,
      ...(extra ?? {})
    };
    statusObserved = status.observed;
    const key = JSON.stringify(status);
    if (type === "status" && !Number.isSafeInteger(extra.requestId) && key === lastSentStatus) return;
    lastSentStatus = key;
    window.postMessage({ channel: "gst:meditation-status:v1", type, status, ...extra }, origin);
  }
  function cancelLocal() {
    pending = null;
    retryAt = 0;
    clearStability();
  }
  function stopForFarm(scene) {
    if (!enabled) return;
    enabled = false;
    cancelLocal();
    detach(); clearInterval(watcher); watcher = null;
    globalThis.GSTFarmActivation?.sync?.();
    farmActivatedAt = Date.now();
    statusText = "Auto Farm vừa bật; Luôn thiền đã tắt. Nếu đã gửi lệnh thiền, lệnh đó không thể thu hồi.";
    emit("farm-started", { revision, occurredAt: farmActivatedAt, character: scene.profile?.name ?? "" });
  }
  function activityReason(scene) {
    if (!scene?.self || scene.self.dead) return "Chờ nhân vật hồi sinh.";
    if (!connected(scene) || scene.leaving) return "Chờ kết nối và bản đồ ổn định.";
    if (!fresh(scene)) return "Chờ snapshot nhân vật mới từ game.";
    if (scene.auto?.on) return "Auto Farm đang bật; farm giữ quyền thiền.";
    if (scene.self.fly) return "Nhường khi nhân vật đang bay.";
    if (globalThis.GSTFlight?.snapshot?.().requested) return "Chờ yêu cầu bay gốc trước khi bắt đầu thiền.";
    if (scene.self.fish) return "Nhường khi đang câu cá.";
    let combat = scene.self.combat === true;
    if (!combat) {
      try { const host = scene.autoHost(); combat = typeof host?.inCombat === "function" && host.inCombat() === true; }
      catch { /* If native combat state cannot be read, other guards still apply. */ }
    }
    if (combat) return "Nhường khi đang giao tranh.";
    if (scene.harvesting || globalThis.GSTHarvest?.controls?.(scene)) return "Nhường khi Thu hoạch đang thao tác.";
    if (globalThis.GSTChest?.controls?.(scene)) return "Nhường khi đang thao tác với rương.";
    if (globalThis.GSTRealm?.controls?.(scene)) return "Nhường khi Bí cảnh đang điều khiển nhân vật.";
    if (globalThis.GSTQuest?.active?.(scene) || globalThis.GSTQuest?.controls?.(scene)) return "Nhường khi Auto Quest đang chạy.";
    if (globalThis.GSTMapTravel?.active?.(scene)) return "Nhường khi đang đi theo bản đồ.";
    if (globalThis.GSTFarmInput?.movement?.(scene)) return "Nhường khi bạn đang di chuyển bằng tay.";
    if (scene.pendingSkill || scene.aiming || scene.heldAttack || scene.dashT > 0) return "Nhường khi đang dùng hoặc ngắm kỹ năng.";
    if (scene.auto?.resting || scene.now() < scene.auto?.pauseUntil) return "Chờ nhân vật đứng yên sau thao tác.";
    if (scene.uiBlocked || scene.keyCapture || scene.overlay?.dialogOpen || scene.panels?.open || scene.nav
        || document.activeElement?.matches?.("input,textarea,select,[contenteditable=true]")
        || [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
          el.getClientRects().length && getComputedStyle(el).visibility !== "hidden"))
      return "Nhường khi menu, hộp thoại hoặc đổi phím đang mở.";
    if (scene.self.realm?.inside?.protection > 0) return "Chờ hết trạng thái bảo vệ trong bí cảnh.";
    if (!finite(scene.px) || !finite(scene.py) || scene.autoX || scene.autoY) return "Chờ nhân vật đứng yên.";
    return "";
  }
  function safeEpisode(scene) {
    return `${identity(scene)}|${!!scene.self?.fish}|${!!scene.self?.combat}`;
  }
  function detach() {
    const old = binding; binding = null;
    if (!old) return;
    old.scene.events.off("preupdate", guardedFrame);
    old.scene.events.off("shutdown", shutdown);
    old.scene.events.off("destroy", shutdown);
  }
  function attach(scene) {
    if (binding?.scene === scene && binding.auto === scene.auto) return;
    const keepRequest = pending && pending.character === scene?.profile?.name;
    detach();
    if (!keepRequest) { cancelLocal(); attempts = 0; retryAt = 0; }
    else clearStability();
    if (!scene?.sys?.isActive?.() || !scene.events?.on || !scene.events?.off
        || typeof scene.auto?.on !== "boolean" || typeof scene.autoHost !== "function") return;
    binding = { scene, auto: scene.auto, lastAutoOn: scene.auto.on };
    scene.events.on("preupdate", guardedFrame);
    scene.events.on("shutdown", shutdown);
    scene.events.on("destroy", shutdown);
  }
  function shutdown() { detach(); clearStability(); if (enabled) watch(); }
  function watch() {
    if (!enabled || suspended || binding || watcher !== null) return;
    watcher = setInterval(() => { try { discover(); } catch { /* Wait for a usable scene. */ } }, 750);
  }
  function discover() {
    if (!enabled || suspended || binding) return;
    const scene = sceneNow();
    if (!scene?.sys?.isActive?.() || !scene.auto || !scene.self) return;
    if (scene.auto.on) { stopForFarm(scene); return; }
    attach(scene);
    if (binding) { clearInterval(watcher); watcher = null; guardedFrame(); }
  }
  function requestMeditation(scene) {
    if (!fresh(scene) || !connected(scene) || sceneNow() !== scene || !scene.sys?.isActive?.()
        || !episode.startsWith(`${identity(scene)}|`) || scene.self?.med || scene.auto?.on) return false;
    const host = scene.autoHost();
    if (typeof host?.meditate !== "function") {
      attempts = RETRY_LIMIT;
      statusText = "Game chưa cung cấp thao tác thiền gốc tương thích.";
      emit(); return false;
    }
    pending = { scene, character: scene.profile?.name ?? "", map: scene.map?.scene ?? "",
      episode, snapshotAt: scene.selfAt, sentAt: performance.now() };
    attempts++;
    try { host.meditate(); }
    catch {
      statusText = "Lệnh thiền chưa xác nhận; chờ snapshot mới trước khi thử lại.";
      emit(); return false;
    }
    clearStability();
    statusText = "Đã gửi một yêu cầu thiền gốc; đang chờ snapshot mới xác nhận.";
    emit();
    return true;
  }
  function frame() {
    const scene = binding?.scene;
    if (!scene || suspended) return;
    if (sceneNow() !== scene || scene.auto !== binding.auto || !scene.sys?.isActive?.()) {
      const replacement = sceneNow();
      const sameCharacter = replacement && replacement.profile?.name === scene.profile?.name;
      detach();
      if (!sameCharacter) { cancelLocal(); attempts = 0; episode = ""; }
      else clearStability();
      if (enabled) watch(); return;
    }
    if (scene.auto.on && !binding.lastAutoOn) { stopForFarm(scene); return; }
    binding.lastAutoOn = scene.auto.on === true;
    if (!enabled) { emit(); return; }
    const currentEpisode = safeEpisode(scene);
    if (episode !== currentEpisode) {
      episode = currentEpisode;
      if (!pending) { attempts = 0; retryAt = 0; }
      clearStability();
    }
    if (pending) {
      if (scene.profile?.name !== pending.character) {
        pending = null; clearStability(); attempts = 0; retryAt = 0;
      } else if (scene.selfAt > pending.snapshotAt && fresh(scene)) {
        const contextChanged = scene.map?.scene !== pending.map || safeEpisode(scene) !== pending.episode;
        pending = null;
        if (scene.self.med) {
          lastMeditating = true;
          statusText = "Game đã xác nhận đang thiền.";
          clearStability(); emit(); return;
        }
        if (contextChanged) { attempts = 0; retryAt = 0; episode = ""; }
        retryAt = performance.now() + Math.min(8000, 1500 * 2 ** Math.max(0, attempts - 1));
        statusText = attempts >= RETRY_LIMIT
          ? "Đã thử đủ số lần; không gửi thêm lệnh trong tình huống này."
          : "Snapshot mới vẫn ghi nhận chưa thiền; sẽ thử lại sau khi chờ.";
        clearStability(); emit();
      } else {
        statusText = performance.now() - pending.sentAt >= 8000
          ? "Game chưa gửi snapshot xác nhận; chưa gửi lệnh mới để tránh đảo trạng thái."
          : "Đang chờ snapshot nhân vật mới; chưa gửi lệnh lặp.";
        emit();
        return;
      }
    }
    if (fresh(scene)) {
      const meditating = scene.self.med === true;
      if (lastMeditating && !meditating) {
        flightReleaseUntil = performance.now() + 2500;
        clearStability();
        statusText = "Lượt thiền đã kết thúc; Luôn bay được kiểm tra lại trước lượt thiền kế tiếp.";
        emit();
      }
      lastMeditating = meditating;
    }
    if (scene.self?.med) {
      statusText = "Đang thiền theo trạng thái game; không gửi thao tác bật/tắt.";
      clearStability(); emit(); return;
    }
    const blocked = activityReason(scene);
    if (blocked) {
      if (lastBlocked && blocked !== lastBlocked) { attempts = 0; retryAt = 0; }
      lastBlocked = blocked;
      if (stableAt !== null) { clearStability(); emit(); }
      if (statusText !== blocked) { statusText = blocked; emit(); }
      statusText = blocked;
      return;
    }
    if (lastBlocked) { attempts = 0; retryAt = 0; lastBlocked = ""; }
    if (attempts >= RETRY_LIMIT) { statusText = "Đã hết lượt thử trong tình huống này; tắt rồi bật lại để thử mới."; emit(); return; }
    const now = performance.now(), pos = { x: scene.px, y: scene.py };
    if (!stablePosition || Math.hypot(pos.x - stablePosition.x, pos.y - stablePosition.y) > 0.12) {
      stablePosition = pos; stableAt = now;
      statusText = "Chờ đứng yên khoảng 2 giây trước khi yêu cầu thiền.";
      emit(); return;
    }
    stableAt ??= now;
    if (now < retryAt) { statusText = `Đang chờ ${Math.ceil((retryAt - now) / 1000)} giây trước lượt thử tiếp theo.`; emit(); return; }
    statusText = "Đang chờ nhân vật đứng yên đủ lâu.";
    if (now - stableAt >= 2000) requestMeditation(scene);
    else emit();
  }
  function guardedFrame() {
    try { frame(); }
    catch {
      statusText = "Chưa đọc ổn định được trạng thái thiền; chờ snapshot tiếp theo.";
      emit();
    }
  }
  function configure(data) {
    if (data.revision < revision) return;
    const updatedAt = finite(data.updatedAt) && data.updatedAt >= 0 ? data.updatedAt : 0;
    if (data.enabled && ((farmActivatedAt > 0 && updatedAt <= farmActivatedAt) || sceneNow()?.auto?.on === true)) {
      revision = Math.max(revision, data.revision);
      enabled = false; cancelLocal();
      detach(); clearInterval(watcher); watcher = null;
      globalThis.GSTFarmActivation?.sync?.();
      statusText = sceneNow()?.auto?.on === true
        ? "Không thể bật Luôn thiền khi Auto Farm đang chạy; hãy dừng farm trước."
        : "Đã bỏ qua yêu cầu bật cũ hơn lần Auto Farm vừa chạy.";
      emit("refused", { revision, occurredAt: Date.now() });
      return;
    }
    const changed = enabled !== data.enabled;
    revision = data.revision; enabled = data.enabled;
    if (changed) {
      if (data.enabled && !pending) cancelLocal();
      else { retryAt = 0; clearStability(); }
      attempts = 0; episode = ""; lastBlocked = "";
    }
    globalThis.GSTFarmActivation?.sync?.();
    if (!enabled) {
      retryAt = 0; clearStability();
      statusText = "Luôn thiền đang tắt; trạng thái thiền hiện tại không bị thay đổi.";
      detach(); clearInterval(watcher); watcher = null;
      emit(); return;
    }
    const scene = sceneNow();
    if (scene?.auto?.on) { stopForFarm(scene); return; }
    statusText = "Luôn thiền đang bật; chờ nhân vật an toàn và đứng yên.";
    discover(); watch(); emit();
  }
  function setEnabled(value, nextRevision) {
    if (nextRevision <= revision) return false;
    configure({ enabled: value === true, revision: nextRevision });
    return !(value && !enabled);
  }
  function snapshot() {
    const scene = binding?.scene ?? sceneNow();
    return { enabled, autoOn: scene?.auto?.on === true, meditating: scene?.self?.med === true,
      observed: observed(scene),
      message: statusText, requestPending: !!pending, requestCount: attempts, requestLimit: RETRY_LIMIT };
  }
  globalThis.GSTMeditation = Object.freeze({
    configure, setEnabled, status: snapshot,
    wantsFarmActivationObserver: () => enabled,
    farmStarted(scene) { if (enabled && scene?.auto?.on === true) stopForFarm(scene); },
    blocksFlight(scene) {
      if (!enabled || !scene || scene !== (binding?.scene ?? sceneNow())) return false;
      if (performance.now() < flightReleaseUntil) return false;
      return !scene.self?.fly && (!!pending || stableAt !== null || scene.self?.med === true);
    }
  });
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:meditation:v1") return;
    if (event.data.type === "configure" && Number.isSafeInteger(event.data.revision)
        && typeof event.data.enabled === "boolean") configure(event.data);
    else if (event.data.type === "status" && Number.isSafeInteger(event.data.requestId))
      emit("status", { requestId: event.data.requestId });
  });
  window.addEventListener("pagehide", () => {
    suspended = true;
    detach();
    clearInterval(watcher); watcher = null;
  });
  window.addEventListener("pageshow", () => {
    suspended = false;
    window.postMessage({ channel: "gst:meditation-status:v1", type: "ready" }, origin);
    if (enabled) { discover(); watch(); }
  });
  window.postMessage({ channel: "gst:meditation-status:v1", type: "ready" }, origin);
})();
