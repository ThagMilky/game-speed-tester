(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let preferences = { enabled: false, allowFarm: false, keepFarm: true };
  let binding = null, job = null, watcher = null, suspended = false, manualUntil = 0;
  let message = "Tự vào bí cảnh đang tắt.", lastScan = -Infinity;
  let lastEntry = null;
  let lastReviveAt = -Infinity;
  let modalAt = -Infinity, modal = false;
  const skipped = new Map(), finite = Number.isFinite;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  function connected(scene) {
    const d = scene.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  }
  function release(reason, skip = false) {
    if (job && binding) {
      const scene = binding.scene;
      if (skip) skipped.set(job.id, performance.now() + 30000);
      if (job.steer && scene.autoX === job.steer[0] && scene.autoY === job.steer[1]) scene.autoX = scene.autoY = 0;
      if (scene.auto.on && scene.auto.target === job.nativeTarget) {
        scene.auto.chaseSince = scene.now(); scene.auto.think = 0;
      }
    }
    job = null;
    if (reason) message = reason;
  }
  function manual(scene) {
    return scene.clickOrder || scene.joyX || scene.joyY || scene.pendingSkill || scene.aiming || scene.heldAttack
      || (!scene.chat?.typing && !scene.inputFieldActive?.() && !scene.keyCapture
        && ["W", "A", "S", "D", "UP", "DOWN", "LEFT", "RIGHT"].some((key) => scene.keys?.[key]?.isDown));
  }
  function modalOpen(fresh = false) {
    if (!fresh && performance.now() - modalAt < 200) return modal;
    modalAt = performance.now();
    modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
      el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    return modal;
  }
  function guard() {
    try {
      const scene = binding?.scene;
      if (!scene) return;
      if (sceneNow() !== scene || !scene.sys?.isActive?.() || scene.auto !== binding.auto
          || !GSTFarmUpdate.attached(scene) || !connected(scene) || scene.leaving) { detach(); watch(); return; }
      if (globalThis.GSTFarmBehavior?.controls(scene)) { release("Nhường di chuyển để né quái level cao."); return; }
      if (scene.self.dead) {
        if (performance.now() - lastReviveAt >= 1000) {
          lastReviveAt = performance.now();
          release(GSTHarvest.respawn(scene));
        }
        return;
      }
      if (manual(scene) || (job && job.phase !== "finishingCombat" && finite(scene.castAt) && scene.castAt !== job.castAt)) {
        manualUntil = performance.now() + 3000;
        release("Tạm nhường thao tác tay; tự tiếp tục sau 3 giây.");
      }
      if (job && (scene.self.dead || scene.uiBlocked || scene.harvesting || scene.auto.resting
          || scene.self.med || scene.self.fish || (!preferences.allowFarm && scene.auto.on))) release("Đang nhường giao diện/hồi phục hoặc Auto Farm.");
    } catch { detach(); message = "Dữ liệu cổng thay đổi; đã dọn điều khiển."; watch(); }
  }
  function captureEntry(scene, portal) {
    // Let the native dialog compute level/combat/cooldown eligibility and its
    // own entry callback. Capture only this synchronous dialog; do not render it.
    const panels = scene.panels, original = panels.show;
    const descriptor = Object.getOwnPropertyDescriptor(panels, "show");
    let action = null;
    const wrapper = function (title, subtitle, body, actions, ...rest) {
      if (title === "Bước vào bí cảnh" && Array.isArray(actions) && actions.length === 1) {
        const candidate = actions[0];
        if (candidate.label === "Vào bí cảnh" && candidate.primary === true
            && typeof candidate.disabled === "boolean" && typeof candidate.onClick === "function") action = candidate;
        return;
      }
      return original.call(this, title, subtitle, body, actions, ...rest);
    };
    panels.show = wrapper;
    try { scene.realmUI.interact({ action: "realm-enter", arg: portal.id }); }
    finally {
      if (panels.show === wrapper) {
        if (descriptor) Object.defineProperty(panels, "show", descriptor);
        else delete panels.show;
      }
    }
    return action;
  }
  function update(host, time) {
    try {
      const scene = binding?.scene;
      if (!scene || !preferences.enabled || suspended) return false;
      if (globalThis.GSTFarmBehavior?.controls(scene)) { release("Nhường di chuyển để né quái level cao."); return false; }
      if (scene.self?.dead) return false;
      const now = performance.now(), realm = scene.self?.realm;
      if (realm?.inside) {
        release("Đã ở trong bí cảnh; giữ nguyên bộ lọc farm của bạn.");
        if (!scene.self.dead && realm.inside.protection > 0 && scene.auto.on) {
          scene.autoX = scene.autoY = 0;
          message = "Đã vào bí cảnh; chờ hết bảo vệ ban đầu rồi tiếp tục farm.";
          return true;
        }
        return false;
      }
      if (!realm || !Array.isArray(realm.events) || !finite(realm.now) || !finite(realm.retryAt)) {
        release("Chờ game cung cấp danh sách cổng bí cảnh."); return false;
      }
      if (job?.phase === "request") {
        scene.autoX = scene.autoY = 0;
        if (now - job.requestedAt > 8000) release("Chưa xác nhận vào bí cảnh; tạm bỏ cổng này.", true);
        return job !== null;
      }
      if (manual(scene) || now < manualUntil || globalThis.GSTFarmSession?.waiting(scene)) {
        release("Tạm nhường thao tác tay hoặc chờ khôi phục Auto Farm."); return false;
      }
      if (scene.self.dead || !connected(scene) || scene.leaving || scene.uiBlocked || scene.harvesting
          || scene.auto.resting || scene.self.med || scene.self.fish) { release("Chờ nhân vật/giao diện/lượt hái ổn định."); return false; }
      if (GSTHarvest.needsRecovery(scene)) { release("Nhường cơ chế hồi HP/MP của Auto Farm."); return false; }
      if (scene.auto.on && !preferences.allowFarm) { release("Chưa cho phép vào bí cảnh khi Auto Farm bật."); return false; }
      if (realm.retryAt > realm.now) { release(`Chờ tái nhập bí cảnh · còn ${Math.ceil(realm.retryAt - realm.now)} giây.`); return false; }
      if (!job && now - lastScan < 1000) return false;
      if (modalOpen()) { release("Chờ bạn xử lý hộp kiểm tra người chơi."); return false; }
      if (!finite(time) || !finite(scene.px) || !finite(scene.py)
          || !["clear", "route", "steer"].every((name) => typeof host?.[name] === "function")) return false;
      const candidates = realm.events.filter((portal) => (typeof portal.id === "string" || Number.isSafeInteger(portal.id)) && portal.host === scene.map.scene
        && !portal.closing && finite(portal.ends) && portal.ends > realm.now && finite(portal.x) && finite(portal.y));
      const pos = { x: scene.px, y: scene.py };
      if (job && !candidates.some((portal) => portal.id === job.id && portal.x === job.x && portal.y === job.y)) release("Cổng đã đóng hoặc thay đổi; tiếp tục công việc trước đó.");
      if (!job) {
        lastScan = now;
        for (const [id, until] of skipped) if (until <= now || !candidates.some((portal) => portal.id === id)) skipped.delete(id);
        const next = candidates.filter((portal) => !skipped.has(portal.id)
          && !(lastEntry?.id === portal.id && now < lastEntry.until)).sort((a, b) => distance(a, pos) - distance(b, pos))
          .find((portal) => captureEntry(scene, portal) !== null);
        if (!next) { message = "Không có cổng hợp lệ trong map hiện tại; tiếp tục tìm toàn map."; return false; }
        const navigation = Object.assign(Object.create(scene.auto), { path: [], lastX: pos.x, lastY: pos.y,
          stillSince: time, stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0, pathAt: -Infinity });
        job = { id: next.id, x: next.x, y: next.y, phase: scene.self.combat ? "finishingCombat" : "moving", navigation,
          nativeTarget: scene.auto.target, castAt: scene.castAt, startAt: now, progressAt: now, previous: pos, steer: null };
      }
      const portal = candidates.find((candidate) => candidate.id === job.id);
      const steeringHost = { ...host, steer: (x, y) => { scene.autoX = x; scene.autoY = y; job.steer = [x, y]; } };
      if (scene.self.combat) {
        job.phase = "finishingCombat";
        if (now - job.startAt > 120000) { release("Giao tranh kéo dài; tạm bỏ cổng này.", true); return false; }
        job.progressAt = now;
        const target = scene.views?.get(scene.auto.target);
        if (scene.auto.on && target && !target.dead) {
          message = "Đã thấy cổng; chờ đánh xong mục tiêu hiện tại.";
          return false;
        }
        steeringHost.steer(0, 0);
        message = "Đã thấy cổng; tạm ngừng chọn quái mới, chờ hết giao tranh.";
        return true;
      }
      if (job.phase === "finishingCombat") { job.phase = "moving"; job.castAt = scene.castAt; job.previous = pos; }
      if (distance(pos, job.previous) > 0.2) { job.previous = pos; job.progressAt = now; }
      if (now - job.progressAt > 5000 || now - job.startAt > 120000) { release("Không tới được cổng; tạm bỏ 30 giây.", true); return false; }
      if (distance(pos, portal) > 2.5 || !host.clear(pos.x, pos.y, portal.x, portal.y)) {
        if (!scene.auto.walk.call(job.navigation, steeringHost, time, pos.x, pos.y, portal.x, portal.y, 2.5)) {
          release("Đường tới cổng bị chặn; tạm bỏ 30 giây.", true); return false;
        }
        message = `Đang tới cổng bí cảnh · còn ${distance(pos, portal).toFixed(1)} ô.`;
        return true;
      }
      steeringHost.steer(0, 0);
      const validTarget = (target) => target?.realm?.action === "realm-enter" && target.realm.arg === portal.id;
      if (!validTarget(scene.pickTarget()) || !validTarget(scene.target)) {
        job.targetAt ??= now;
        if (now - job.targetAt > 1000) release("Game chưa chọn đúng cổng bí cảnh; tạm bỏ qua.", true);
        return job !== null;
      }
      if (modalOpen(true) || scene.self.combat || scene.uiBlocked || scene.leaving) { release("Tạm dừng trước khi vào cổng."); return false; }
      const action = captureEntry(scene, portal);
      if (!action || action.disabled) { release("Game chưa cho phép vào cổng này.", true); return false; }
      job.phase = "request"; job.requestedAt = now;
      lastEntry = { id: portal.id, until: now + 8000 };
      globalThis.GSTFarmSession?.remember(scene);
      scene.sendMove();
      action.onClick();
      message = "Đã yêu cầu vào bí cảnh; chờ game xác nhận.";
      return true;
    } catch { release("Interface bí cảnh chưa tương thích; đã nhường điều khiển.", true); return false; }
  }
  function detach() {
    release();
    if (!binding) return;
    const old = binding; binding = null;
    old.remove(); old.scene.events.off("preupdate", guard);
    old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown);
    skipped.clear();
  }
  function shutdown() { detach(); watch(); }
  function watch() { if (preferences.enabled && !suspended && !binding && watcher === null) watcher = setInterval(discover, 1000); }
  function discover() {
    if (!preferences.enabled || suspended || binding) return;
    try {
      const scene = sceneNow();
      if (!scene?.sys?.isActive?.() || !scene.self || !connected(scene) || typeof scene.auto?.walk !== "function"
          || typeof scene.realmUI?.interact !== "function" || typeof scene.panels?.show !== "function"
          || typeof scene.pickTarget !== "function" || typeof scene.sendMove !== "function"
          || typeof scene.now !== "function" || !scene.events?.on || !scene.events?.off) return;
      const remove = GSTFarmUpdate.add(scene, 5, update);
      binding = { scene, auto: scene.auto, remove };
      scene.events.on("preupdate", guard); scene.events.on("shutdown", shutdown); scene.events.on("destroy", shutdown);
      clearInterval(watcher); watcher = null; lastScan = -Infinity; lastReviveAt = -Infinity;
      message = "Đang tìm cổng bí cảnh trong toàn map hiện tại.";
    } catch { detach(); message = "Chưa gắn được hỗ trợ bí cảnh; chờ game."; watch(); }
  }
  globalThis.GSTRealm = { controls: (scene) => binding?.scene === scene && job !== null };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:realm:v1") return;
    if (event.data.type === "configure") {
      const value = event.data.preferences;
      preferences = { enabled: value?.enabled === true, allowFarm: value?.allowFarm === true, keepFarm: value?.keepFarm !== false };
      if (!preferences.enabled) { detach(); clearInterval(watcher); watcher = null; message = "Tự vào bí cảnh đang tắt."; }
      else { watch(); discover(); }
    }
    if (["configure", "status"].includes(event.data.type)) {
      window.postMessage({ channel: "gst:realm-status:v1", requestId: event.data.requestId, enabled: preferences.enabled,
        configKey: JSON.stringify(preferences), message }, origin);
    }
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
  window.postMessage({ channel: "gst:realm-status:v1", ready: true }, origin);
})();
