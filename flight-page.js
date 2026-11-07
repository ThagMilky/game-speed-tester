(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let always = false, farm = false, binding = null, watcher = null, suspended = false;
  let stableAt = null, requestedAt = null, last = -Infinity, message = "Luôn bay đang tắt.";
  let sentScene = null, sentAt = -Infinity, retryAfter = -Infinity, requestSelfAt = null;
  const sceneNow = () => window.game?.scene?.getScene?.("world") ?? window.__ntkScene;
  function reset() { stableAt = null; requestedAt = null; last = -Infinity; retryAfter = -Infinity; requestSelfAt = null; }
  function finiteSceneTime(scene) {
    return typeof scene.now === "function" && Number.isFinite(scene.selfAt)
      && scene.now() - scene.selfAt >= 0 && scene.now() - scene.selfAt <= 2;
  }
  function ensure(scene) {
    if (!scene?.auto) { reset(); message = "Chờ scene world và Auto Farm sẵn sàng để kiểm tra bay."; return false; }
    if (binding?.scene !== scene) discover();
    if (binding?.scene !== scene || suspended) return false;
    if (!(always || farm && scene.auto?.on)) { reset(); message = "Luôn bay đang tắt; Auto Farm giữ hỗ trợ bay riêng khi được bật."; return true; }
    const now = performance.now(), d = scene.driver;
    if (!scene.self || scene.self.dead || scene.leaving || !d || d.closing || d.reconnecting || d.displaced
        || !(d.online === false || d.link?.open?.() === true)) {
      reset(); message = "Chờ nhân vật/kết nối ổn định để kiểm tra bay."; return false;
    }
    if (scene.self.fly) {
      if (sentScene === scene) { sentScene = null; sentAt = -Infinity; }
      reset(); message = "Đang bay."; return true;
    }
    if (requestedAt !== null) {
      if (now - requestedAt < 8000) {
        message = "Đã yêu cầu bay; chờ game xác nhận."; return false;
      }
      // Fly is a toggle: only retry after a fresh server snapshot still reports fly=false.
      if (!finiteSceneTime(scene) || !Number.isFinite(requestSelfAt)
          || scene.selfAt <= requestSelfAt) {
        message = "Chờ dữ liệu bay mới từ game; chưa gửi lại lệnh bật/tắt."; return false;
      }
      requestedAt = null;
      retryAfter = now + 15000; // 23+ seconds between requests; avoid flip-flopping.
      message = "Game chưa xác nhận bay; sẽ thử lại có giới hạn khi trạng thái vẫn tắt.";
      return false;
    }
    if (now < retryAfter) {
      message = "Game chưa xác nhận bay; đang chờ trước khi thử lại."; return false;
    }
    if (now - last < 250) return false;
    last = now;
    if (scene.uiBlocked || scene.pendingSkill || scene.aiming || scene.harvesting || scene.self.med || scene.self.fish
        || (Number.isFinite(scene.dashT) && scene.dashT > 0)
        || (finiteSceneTime(scene) === false)
        || GSTFarmRouting.blocked(scene) || scene.self.realm?.inside?.protection > 0) {
      stableAt = null; message = "Chờ giao diện/thao tác nhân vật ổn định trước khi bật bay."; return false;
    }
    stableAt ??= now;
    if (now - stableAt < 1000) { message = "Chuẩn bị bật bay sau 1 giây ổn định."; return false; }
    if (typeof scene.act !== "function") { message = "Chưa có thao tác bay tương thích trong game."; return false; }
    if (sentScene === scene && now - sentAt < 8000) {
      requestedAt = sentAt; requestSelfAt = scene.selfAt;
      message = "Chờ yêu cầu bay trước đó; không gửi trùng khi đổi cài đặt nhanh."; return false;
    }
    requestedAt = now;
    requestSelfAt = scene.selfAt;
    sentScene = scene; sentAt = now;
    scene.act("fly"); message = "Đã yêu cầu bay; chờ game xác nhận.";
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
    const old = binding; binding = null; reset();
    if (old) { old.scene.events.off("preupdate", frame); old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown); }
  }
  function shutdown() { detach(); watch(); }
  function discover() {
    if (binding || suspended || !(always || farm)) return;
    const scene = sceneNow();
    if (!scene?.sys?.isActive?.() || !scene.events?.on || !scene.events.off) return;
    binding = { scene }; reset();
    scene.events.on("preupdate", frame); scene.events.on("shutdown", shutdown); scene.events.on("destroy", shutdown);
    clearInterval(watcher); watcher = null;
  }
  function watch() { if (!binding && !suspended && (always || farm) && watcher === null) watcher = setInterval(() => { try { discover(); } catch { /* Wait for scene. */ } }, 1000); }
  function configure() {
    if (!(always || farm)) { detach(); clearInterval(watcher); watcher = null; message = "Luôn bay đang tắt."; }
    else { if (!binding) message = "Chờ scene world; game cần tham số timer để truy cập trạng thái bay."; watch(); discover(); }
  }
  globalThis.GSTFlight = { ensure, status: () => message };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin) return;
    const data = event.data;
    if (data?.channel === "gst:farm:v1" && data.type === "configure") { farm = data.enabled === true; configure(); }
    if (data?.channel !== "gst:flight:v1") return;
    if (data.type === "configure") {
      const next = data.always === true;
      const demand = always || farm && binding?.scene.auto?.on;
      always = next;
      if (demand !== (always || farm && binding?.scene.auto?.on) || requestedAt !== null && performance.now() - requestedAt >= 8000) reset();
      configure();
    }
    window.postMessage({ channel: "gst:flight-status:v1", requestId: data.requestId, message, always }, origin);
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; configure(); });
  window.postMessage({ channel: "gst:flight-status:v1", ready: true }, origin);
})();
