(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let enabled = false;
  let suspended = false;
  let watcher = null;
  let binding = null;
  let job = null;
  let message = "";
  let manualUntil = 0;
  let modalAt = -Infinity;
  let modal = false;
  let thresholdsAt = -Infinity;
  let hpThreshold = 0.4, mpThreshold = 0.25;
  const skipped = new Map();
  const finite = Number.isFinite;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const inside = (scene) => scene.self?.realm?.inside;
  function connected(scene) {
    const d = scene.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  }
  function seals(scene) {
    const area = inside(scene);
    if (!area || !finite(area.boss?.hp) || area.boss.hp <= 0 || !Array.isArray(area.seals)) return [];
    return area.seals.map((seal, index) => ({ ...seal, index }))
      .filter((seal) => finite(seal.x) && finite(seal.y) && finite(seal.hits) && seal.hits > 0);
  }
  const key = (seal) => `${seal.index}:${seal.x}:${seal.y}`;
  function stopJob(reason, skip = false) {
    if (job && binding) {
      const scene = binding.scene;
      if (skip) skipped.set(job.key, job.hits);
      if (job.steer && scene.autoX === job.steer[0] && scene.autoY === job.steer[1]) {
        scene.autoX = 0; scene.autoY = 0;
      }
      // Time spent on seals is not a failed chase of the preserved boss target.
      if (scene.auto.on && scene.auto.target === job.nativeTarget && finite(scene.now())) {
        scene.auto.chaseSince = scene.now();
        scene.auto.think = 0;
      }
    }
    job = null;
    if (reason) message = reason;
  }
  function steer(scene, x, y) {
    scene.autoX = x; scene.autoY = y;
    if (job) job.steer = [x, y];
  }
  function yieldReason(scene, freshModal = false) {
    if (!enabled || suspended || !scene.auto.on) return "";
    if (globalThis.GSTFarmBehavior?.controls(scene)) return "Nhường di chuyển để né quái level cao.";
    if (globalThis.GSTRealm?.controls(scene)) return "Nhường di chuyển để vào bí cảnh.";
    if (!scene.self || scene.self.dead || scene.leaving || !connected(scene)) return "Chờ nhân vật/kết nối ổn định.";
    if (scene.uiBlocked || scene.keyCapture) return "Chờ đóng giao diện trước khi phá phong ấn.";
    const now = performance.now();
    if (freshModal || now - modalAt >= 200) {
      modalAt = now;
      modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
        el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    }
    if (modal) return "Chờ bạn xử lý hộp kiểm tra người chơi.";
    if (scene.harvesting || scene.self.fish || scene.self.med || scene.auto.resting) return "Nhường lượt hái hoặc hồi phục của game.";
    if (scene.pendingSkill || scene.aiming || scene.heldAttack || scene.clickOrder || scene.joyX || scene.joyY
        || ["W", "A", "S", "D", "UP", "DOWN", "LEFT", "RIGHT"].some((name) => scene.keys?.[name]?.isDown)
        || scene.auto.moved || scene.now() < scene.auto.pauseUntil) return "Nhường thao tác di chuyển/chiến đấu tay.";
    if (job && finite(scene.castAt) && scene.castAt !== job.castAt) manualUntil = scene.now() + 3;
    if (scene.now() < manualUntil) return "Tạm nhường 3 giây sau thao tác chiến đấu tay.";
    const host = scene.autoHost();
    if (now - thresholdsAt >= 1000) {
      thresholdsAt = now; hpThreshold = 0.4; mpThreshold = 0.25;
      try {
        const h = Number(localStorage.getItem("tm-auto-hp")), m = Number(localStorage.getItem("tm-auto-mp"));
        if ([0.3, 0.4, 0.5, 0.6].includes(h)) hpThreshold = h;
        if ([0.15, 0.25, 0.35, 0.5].includes(m)) mpThreshold = m;
      } catch { /* Same thresholds/defaults as the native farm. */ }
    }
    if (typeof host.hp !== "function" || typeof host.mp !== "function" || typeof host.pills !== "function"
        || host.hp() < hpThreshold || (host.mp() < mpThreshold && host.pills("mp").some((count) => count > 0))) return "Nhường hồi HP/MP cho Auto Farm gốc.";
    return null;
  }
  function guard() {
    try {
      const scene = binding?.scene;
      if (!scene) return;
      if (sceneNow() !== scene || scene.auto !== binding.auto || !scene.sys?.isActive?.()
          || !GSTFarmUpdate.attached(scene) || !connected(scene) || scene.leaving) {
        detach(); watch(); return;
      }
      if (!scene.auto.on || scene.self?.dead) {
        stopJob(); skipped.clear(); manualUntil = 0;
        message = scene.self?.dead ? "Nhân vật đã chết; nhường hồi sinh cho game."
          : "Chờ bật Auto Farm để hỗ trợ phá phong ấn.";
      } else if (job) {
        const reason = yieldReason(scene);
        if (reason !== null || !seals(scene).some((seal) => key(seal) === job.key)) stopJob(reason);
      }
    } catch {
      detach(); message = "Dữ liệu phong ấn thay đổi; đã dọn điều khiển và chờ game."; watch();
    }
  }
  function update(host, time) {
    const scene = binding?.scene;
    try {
      if (!scene || !enabled || suspended || !scene.auto.on) return false;
      const active = seals(scene);
      for (const [id, hits] of skipped) {
        if (!active.some((seal) => key(seal) === id && seal.hits === hits)) skipped.delete(id);
      }
      if (!active.length) {
        stopJob(); skipped.clear(); message = "Không có phong ấn cần phá trong bí cảnh."; return false;
      }
      const reason = yieldReason(scene);
      if (reason !== null) { stopJob(reason); return false; }
      if (!finite(time) || !finite(scene.px) || !finite(scene.py) || typeof scene.auto.walk !== "function"
          || !["clear", "route", "steer", "basic"].every((name) => typeof host?.[name] === "function")) {
        stopJob("Chưa đọc đủ cơ chế di chuyển/đánh phong ấn của game."); return false;
      }
      const pos = { x: scene.px, y: scene.py };
      if (job && !active.some((seal) => key(seal) === job.key)) stopJob();
      if (!job) {
        const next = active.filter((seal) => skipped.get(key(seal)) !== seal.hits)
          .sort((a, b) => distance(a, pos) - distance(b, pos))[0];
        if (!next) { message = "Chưa phá được phong ấn; đã dừng thử. Đổi trạng thái phong ấn hoặc tắt/bật Auto Farm để thử lại."; return false; }
        // Use native navigation on private state; preserve the boss target/path/center.
        const navigation = Object.assign(Object.create(scene.auto), { path: [], lastX: pos.x, lastY: pos.y,
          stillSince: time, stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0, pathAt: -Infinity });
        job = { key: key(next), hits: next.hits, nativeTarget: scene.auto.target, castAt: scene.castAt,
          navigation, startAt: time, progressAt: time,
          attackAt: null, nextAt: time, steer: null };
      }
      const seal = active.find((candidate) => key(candidate) === job.key);
      if (seal.hits < job.hits) { job.progressAt = time; job.attackAt = time; }
      job.hits = seal.hits;
      const reach = 1; // Conservative approach distance; never enlarge the game's hit range.
      if (distance(seal, pos) > reach || !host.clear(pos.x, pos.y, seal.x, seal.y)) {
        if (time - job.startAt > 15) { stopJob("Không tới được phong ấn; tạm bỏ mục tiêu này.", true); return false; }
        const owner = job;
        const walkingHost = { ...host, steer: (x, y) => steer(scene, x, y) };
        if (!scene.auto.walk.call(owner.navigation, walkingHost, time, pos.x, pos.y, seal.x, seal.y, reach)) {
          stopJob("Đường tới phong ấn bị chặn; tạm bỏ mục tiêu này.", true); return false;
        }
        message = `Đang tới phong ấn · còn ${seal.hits} đòn.`;
        return true;
      }
      steer(scene, 0, 0);
      job.attackAt ??= time;
      if (time - Math.max(job.attackAt, job.progressAt) > 8) {
        stopJob("Phong ấn không giảm số đòn; đã dừng thử để tránh đánh mãi.", true); return false;
      }
      if (time < job.nextAt) return true;
      job.nextAt = time + 0.2; // Native attack decision interval; approach steering stays per-frame.
      const length = distance(seal, pos);
      if (length > 0.05) {
        scene.faceX = (seal.x - pos.x) / length;
        scene.faceY = (seal.y - pos.y) / length;
      }
      const beforeAttack = yieldReason(scene, true);
      if (beforeAttack !== null) { stopJob(beforeAttack); return false; }
      host.basic(); // Native useSkill("Space", true, false): retain facing and all hit/cooldown rules.
      job.castAt = scene.castAt;
      message = `Đang phá phong ấn · còn ${seal.hits} đòn.`;
      return true;
    } catch {
      stopJob("Interface phong ấn thay đổi; đã nhường lại Auto Farm.", true);
      return false;
    }
  }
  function detach() {
    stopJob();
    if (!binding) return;
    const old = binding; binding = null;
    old.remove();
    old.scene.events.off("preupdate", guard);
    old.scene.events.off("shutdown", shutdown);
    old.scene.events.off("destroy", shutdown);
    skipped.clear();
  }
  function shutdown() { detach(); watch(); }
  function watch() {
    if (enabled && !suspended && !binding && watcher === null) watcher = setInterval(discover, 1000);
  }
  function discover() {
    if (!enabled || suspended || binding) return;
    try {
      const scene = sceneNow();
      if (!scene?.sys?.isActive?.() || !scene.self || !connected(scene)
          || typeof scene.auto?.update !== "function" || typeof scene.autoHost !== "function"
          || typeof scene.now !== "function" || typeof scene.events?.on !== "function"
          || typeof scene.events.off !== "function") return;
      const remove = GSTFarmUpdate.add(scene, 10, update);
      binding = { scene, auto: scene.auto, remove };
      scene.events.on("preupdate", guard);
      scene.events.on("shutdown", shutdown);
      scene.events.on("destroy", shutdown);
      clearInterval(watcher); watcher = null;
      message = "Sẵn sàng hỗ trợ phong ấn khi Auto Farm bật trong bí cảnh.";
    } catch { message = "Chưa gắn được hỗ trợ phong ấn; chờ game."; }
  }
  globalThis.GSTFarmSeals = {
    controls: (scene) => binding?.scene === scene && job !== null,
    status: (scene) => enabled && binding && binding.scene === scene && scene.auto.on && inside(scene) ? message : ""
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:farm:v1"
        || event.data.type !== "configure") return;
    enabled = event.data.breakSeals === true;
    if (!enabled) { detach(); clearInterval(watcher); watcher = null; message = ""; }
    else { watch(); discover(); }
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
})();
