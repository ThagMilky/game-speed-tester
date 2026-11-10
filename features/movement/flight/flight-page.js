(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let always = false, farm = false, binding = null, rideBinding = null, watcher = null, suspended = false;
  let stableAt = null, requestedAt = null, last = -Infinity, message = "Luôn bay đang tắt.";
  let sentScene = null, sentAt = -Infinity, retryAfter = -Infinity, requestSelfAt = null, failures = 0;
  const sceneNow = () => window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
  function reset() {
    stableAt = null; requestedAt = null; last = -Infinity; retryAfter = -Infinity;
    requestSelfAt = null; failures = 0;
  }
  function waitingForMount(scene, now) {
    if (requestedAt !== null) {
      if (now - requestedAt < 8000) {
        message = "Đã yêu cầu bay; chờ game xác nhận."; return true;
      }
      // Fly is a toggle: retry only after a newer fresh snapshot still reports fly=false.
      if (!finiteSceneTime(scene) || !Number.isFinite(requestSelfAt) || scene.selfAt <= requestSelfAt) {
        record("no_snapshot", scene);
        message = "Chờ dữ liệu bay mới từ game; chưa gửi lại lệnh bật/tắt."; return true;
      }
      record("unconfirmed", scene);
      requestedAt = null;
      failures++;
      retryAfter = now + Math.min(60000, 7000 * 2 ** Math.min(failures - 1, 4));
      message = "Game chưa xác nhận bay; sẽ thử lại có giới hạn khi trạng thái vẫn tắt.";
      return true;
    }
    if (sentScene === scene && now - sentAt < 8000) {
      requestedAt = sentAt; requestSelfAt ??= scene.selfAt;
      message = "Chờ yêu cầu bay trước đó; không gửi trùng khi đổi cài đặt nhanh."; return true;
    }
    if (now < retryAfter) {
      record("wait", scene);
      message = `Game chưa xác nhận bay; chờ ${Math.ceil((retryAfter - now) / 1000)} giây trước khi thử lại.`;
      return true;
    }
    return false;
  }
  function requestMount(scene, send) {
    const now = performance.now();
    if (waitingForMount(scene, now)) return false;
    requestedAt = now; requestSelfAt = scene.selfAt;
    sentScene = scene; sentAt = now;
    send();
    record("request", scene);
    message = "Đã yêu cầu bay; chờ game xác nhận.";
    return true;
  }
  function detachRideCoordination() {
    const old = rideBinding; rideBinding = null;
    if (!old || old.auto.rideIfIdle !== old.wrapper) return;
    if (old.descriptor) Object.defineProperty(old.auto, "rideIfIdle", old.descriptor);
    else delete old.auto.rideIfIdle;
  }
  function attachRideCoordination(scene) {
    const auto = scene?.auto;
    if (rideBinding?.auto === auto && auto?.rideIfIdle === rideBinding.wrapper) return;
    detachRideCoordination();
    const original = auto?.rideIfIdle;
    if (typeof original !== "function") return;
    const descriptor = Object.getOwnPropertyDescriptor(auto, "rideIfIdle");
    if ((descriptor && descriptor.writable === false && !descriptor.set)
        || (!descriptor && !Object.isExtensible(auto))) {
      message = "Không thể phối hợp yêu cầu bay với Auto Farm gốc; giữ nguyên cơ chế gốc.";
      return;
    }
    const wrapper = function (host, time, ...args) {
      if (this !== auto || typeof host?.ride !== "function") return original.call(this, host, time, ...args);
      const coordinatedHost = { ...host, ride: (...rideArgs) => {
        let result;
        const sent = requestMount(scene, () => { result = host.ride(...rideArgs); });
        return sent ? result : false;
      } };
      return original.call(this, coordinatedHost, time, ...args);
    };
    auto.rideIfIdle = wrapper;
    if (auto.rideIfIdle === wrapper) rideBinding = { auto, descriptor, wrapper };
    else message = "Không thể phối hợp yêu cầu bay với Auto Farm gốc; giữ nguyên cơ chế gốc.";
  }
  function finiteSceneTime(scene) {
    return typeof scene.now === "function" && Number.isFinite(scene.selfAt)
      && scene.now() - scene.selfAt >= 0 && scene.now() - scene.selfAt <= 2;
  }
  // Small event history for the existing Auto Farm diagnostic export. Never save URLs or packets.
  const flightLogKey = "gst:flight-log:v1";
  const flightReasons = ["request", "confirmed", "unconfirmed", "blocked", "disconnected", "no_snapshot", "wait"];
  const flightEvents = [];
  let lastLogState = "", lastLogAt = -Infinity;
  try {
    const past = JSON.parse(sessionStorage.getItem(flightLogKey) ?? "[]");
    if (Array.isArray(past)) for (const row of past.slice(-30)) {
      if (flightReasons.includes(row?.type) && typeof row.at === "string"
          && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at)) {
        flightEvents.push({ at: row.at, type: row.type, auto: row.auto === true,
          flying: row.flying === true, always: row.always === true, farm: row.farm === true });
      }
    }
  } catch { /* Optional diagnostics. */ }
  function record(type, scene) {
    if (!flightReasons.includes(type)) return;
    const now = performance.now();
    const signature = type + ":" + !!scene?.auto?.on + ":" + !!scene?.self?.fly;
    if (signature === lastLogState && now - lastLogAt < 10000) return;
    lastLogState = signature; lastLogAt = now;
    flightEvents.push({ at: new Date().toISOString(), type, auto: scene?.auto?.on === true,
      flying: scene?.self?.fly === true, always, farm });
    if (flightEvents.length > 30) flightEvents.shift();
    try { sessionStorage.setItem(flightLogKey, JSON.stringify(flightEvents)); } catch {}
  }
  function ensure(scene) {
    if (!scene?.auto) { reset(); message = "Chờ scene world và Auto Farm sẵn sàng để kiểm tra bay."; return false; }
    if (binding?.scene !== scene) discover();
    if (binding?.scene !== scene || suspended) return false;
    attachRideCoordination(scene);
    if (!(always || farm && scene.auto?.on)) { reset(); message = "Luôn bay đang tắt; Auto Farm giữ hỗ trợ bay riêng khi được bật."; return true; }
    const now = performance.now(), d = scene.driver;
    if (!scene.self || scene.self.dead || scene.leaving || !d || d.closing || d.reconnecting || d.displaced
        || !(d.online === false || d.link?.open?.() === true)) {
      record("disconnected", scene);
      reset(); message = "Chờ nhân vật/kết nối ổn định để kiểm tra bay."; return false;
    }
    if (scene.self.fly) {
      if (requestedAt !== null) record("confirmed", scene);
      if (sentScene === scene) { sentScene = null; sentAt = -Infinity; }
      reset(); message = "Đang bay."; return true;
    }
    if (waitingForMount(scene, now)) return false;
    if (now - last < 250) return false;
    last = now;
    if (scene.uiBlocked || scene.pendingSkill || scene.aiming || scene.harvesting || scene.self.med || scene.self.fish
        || (Number.isFinite(scene.dashT) && scene.dashT > 0)
        || (finiteSceneTime(scene) === false)
        || GSTFarmRouting.blocked(scene) || scene.self.realm?.inside?.protection > 0) {
      record("blocked", scene);
      stableAt = null; message = "Chờ giao diện/thao tác nhân vật ổn định trước khi bật bay."; return false;
    }
    stableAt ??= now;
    if (now - stableAt < 1000) { message = "Chuẩn bị bật bay sau 1 giây ổn định."; return false; }
    if (typeof scene.act !== "function") { message = "Chưa có thao tác bay tương thích trong game."; return false; }
    if (scene.auto?.on && typeof scene.auto.rideIfIdle === "function"
        && rideBinding?.auto !== scene.auto) {
      message = "Auto Farm gốc đang xử lý yêu cầu bay; chờ trạng thái xác nhận.";
      return false;
    }
    requestMount(scene, () => scene.act("fly"));
    return false;
  }
  function frame() {
    try {
      if (!binding) return;
      if (sceneNow() !== binding.scene || !binding.scene.sys?.isActive?.()) { detach(); watch(); return; }
      ensure(binding.scene);
    } catch { message = "Chưa bật được bay; chờ scene ổn định."; }
  }
  function detach() {
    detachRideCoordination();
    const old = binding; binding = null; reset();
    if (old) { old.scene.events.off("preupdate", frame); old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown); }
  }
  function shutdown() { detach(); watch(); }
  function discover() {
    if (binding || suspended || !(always || farm)) return;
    const scene = sceneNow();
    if (!scene?.sys?.isActive?.() || !scene.events?.on || !scene.events.off) return;
    binding = { scene }; reset();
    attachRideCoordination(scene);
    scene.events.on("preupdate", frame); scene.events.on("shutdown", shutdown); scene.events.on("destroy", shutdown);
    clearInterval(watcher); watcher = null;
  }
  function watch() { if (!binding && !suspended && (always || farm) && watcher === null) watcher = setInterval(() => { try { discover(); } catch { /* Wait for scene. */ } }, 1000); }
  function configure() {
    if (!(always || farm)) { detach(); clearInterval(watcher); watcher = null; message = "Luôn bay đang tắt."; }
    else { if (!binding) message = "Chờ scene world; game cần tham số timer để truy cập trạng thái bay."; watch(); discover(); }
  }
  globalThis.GSTFlight = {
    ensure, status: () => message,
    snapshot() {
      const scene = binding?.scene;
      return { build: "flight-log-1", always, farm, wanted: always || farm && scene?.auto?.on === true,
        flying: scene?.self?.fly === true, auto: scene?.auto?.on === true,
        requested: requestedAt !== null,
        pendingMs: requestedAt !== null ? Math.max(0, performance.now() - requestedAt) : null,
        retryMs: Math.max(0, retryAfter - performance.now()),
        hasScene: !!scene, fresh: !!scene && finiteSceneTime(scene),
        blocked: !!scene?.uiBlocked,
        events: flightEvents.slice(-30).map((row) => ({ ...row })) };
    }
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin) return;
    const data = event.data;
    if (data?.channel === "gst:farm:v1" && data.type === "configure") {
      // autoRespawn marks an installed Auto Farm bridge, unlike 'enabled' (expanded radius).
      farm = data.autoRespawn === true;
      configure();
    }
    if (data?.channel !== "gst:flight:v1") return;
    if (data.type === "configure") {
      const next = data.always === true;
      const demand = always || farm && binding?.scene.auto?.on;
      always = next;
      if (demand !== (always || farm && binding?.scene.auto?.on)) reset();
      configure();
    }
    window.postMessage({ channel: "gst:flight-status:v1", requestId: data.requestId, message, always }, origin);
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; configure(); });
  window.postMessage({ channel: "gst:flight-status:v1", ready: true }, origin);
})();
