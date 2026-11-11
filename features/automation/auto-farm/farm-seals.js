(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let enabled = false;
  let suspended = false;
  let watcher = null;
  let binding = null;
  let job = null, holding = false;
  let message = "";
  let manualUntil = 0;
  let modalAt = -Infinity;
  let modal = false;
  let thresholdsAt = -Infinity;
  let hpThreshold = 0.4, mpThreshold = 0.25;
  // Failed seals remain skipped until their hits/position changes or the session resets.
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
      if (skip) skipped.set(job.key, { hits: job.hits, until: performance.now() + 12000 });
      GSTNavigation.cancel(scene, job.navigation);
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
    if (globalThis.GSTMapTravel?.active(scene)) return "Nhường cho hành trình bản đồ.";
    if (globalThis.GSTQuest?.active(scene)) return "Nhường cho Auto Quest đang chạy.";
    if (globalThis.GSTFarmBossSafety?.controls(scene)) return "Nhường di chuyển để né skill boss hoặc hồi HP.";
    if (globalThis.GSTRealm?.controls(scene)) return "Nhường di chuyển để vào bí cảnh.";
    if (!scene.self || scene.self.dead || scene.leaving || !connected(scene)) return "Chờ nhân vật/kết nối ổn định.";
    if (GSTFarmRouting.blocked(scene) || scene.keyCapture) return "Chờ đóng hội thoại/bảng bảo vệ trước khi phá phong ấn.";
    const now = performance.now();
    if (freshModal || now - modalAt >= 200) {
      modalAt = now;
      modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
        el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    }
    if (modal) return "Chờ bạn xử lý hộp kiểm tra người chơi.";
    if (scene.harvesting || scene.self.fish || scene.self.med || scene.auto.resting) return "Nhường lượt hái hoặc hồi phục của game.";
    if (scene.pendingSkill || scene.aiming || scene.heldAttack || GSTFarmInput.movement(scene)
        || scene.auto.moved || scene.now() < scene.auto.pauseUntil) return "Nhường thao tác di chuyển/chiến đấu tay.";
    if (job && finite(scene.castAt) && scene.castAt !== job.castAt) manualUntil = scene.now() + 3;
    if (scene.now() < manualUntil) return "Tạm nhường 3 giây sau thao tác chiến đấu tay.";
    if (globalThis.GSTFarmCombat?.keepsFighting?.() === false && GSTHarvest.needsRecovery(scene)) return "Nhường hồi phục cho Auto Farm gốc.";
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
        || (host.hp() < hpThreshold && host.pills("hp").some((count) => count > 0)) || (host.mp() < mpThreshold && host.pills("mp").some((count) => count > 0))) return "Nhường hồi HP/MP cho Auto Farm gốc.";
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
      // A seal objective may appear without a scene reload. Re-evaluate the
      // existing boss-safety owner only on transitions, including seal removal.
      const sealPending = enabled && scene.auto.on && seals(scene).length > 0;
      if (binding.safetyPending !== sealPending) {
        const owner = binding;
        binding.safetyPending = sealPending;
        queueMicrotask(() => {
          if (binding === owner) globalThis.GSTFarmBossSafety?.attach(scene);
        });
      }
      if (!scene.auto.on || scene.self?.dead) {
        holding = false;
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
      holding = false;
      if (!scene || !enabled || suspended || !scene.auto.on || globalThis.GSTMapTravel?.active(scene)) return false;
      const active = seals(scene);
      for (const [id, entry] of skipped) {
        if (performance.now() >= entry.until
            || !active.some((seal) => key(seal) === id && seal.hits === entry.hits)) skipped.delete(id);
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
        const next = active.filter((seal) => !skipped.has(key(seal)))
          .sort((a, b) => distance(a, pos) - distance(b, pos))[0];
        if (!next) {
          // Do not resume hitting the boss while an active seal remains.
          // The skip expires after 12 seconds, then the same seal is retried.
          holding = true; host.steer(0, 0);
          message = "Phong ấn còn hoạt động nhưng đường/đòn đánh chưa tiến triển; chờ thử lại sau tối đa 12 giây.";
          return true;
        }
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
        const owner = job;
        const walkingHost = { ...host, steer: (x, y) => steer(scene, x, y) };
        const next = GSTNavigation.leg(scene, owner, host, seal.x, seal.y,
          (point) => finite(point?.x) && finite(point?.y)
            && point.x >= 0 && point.y >= 0 && point.x < scene.map?.w && point.y < scene.map?.h);
        const goal = next ?? { x: seal.x, y: seal.y };
        if (owner.legArrived || GSTNavigation.progressed(scene, owner, owner.navigation.path, goal.x, goal.y, 0.3))
          owner.progressAt = time;
        if (time - owner.progressAt > 7 || time - owner.startAt > 120) {
          stopJob("Không tiến tới phong ấn; tạm bỏ 12 giây rồi thử lại.", true);
          holding = true; host.steer(0, 0); return true;
        }
        if (!next) {
          holding = true; host.steer(0, 0);
          message = "Chưa tìm được chặng tới phong ấn; đang chờ tính lại.";
          return true;
        }
        if (!GSTNavigation.walk(scene, owner.navigation, walkingHost, time, pos.x, pos.y, next.x, next.y,
          owner.checkpoint ? 0.8 : reach)) {
          GSTNavigation.resetLeg(owner, true);
          stopJob("Đường tới phong ấn bị chặn; thử lại sau 12 giây.", true);
          holding = true; host.steer(0, 0); return true;
        }
        message = `Đang tới phong ấn · còn ${seal.hits} đòn.`;
        return true;
      }
      steer(scene, 0, 0);
      job.attackAt ??= time;
      if (time - Math.max(job.attackAt, job.progressAt) > 8) {
        stopJob("Phong ấn không giảm số đòn; bỏ qua đến khi dữ liệu thay đổi.", true); holding = true; host.steer(0, 0); return true;
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
    holding = false; stopJob();
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
    if (enabled && globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() === true && !suspended && !binding && watcher === null) watcher = setInterval(discover, 1000);
  }
  function discover() {
    if (!enabled || !globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || suspended || binding) return;
    try {
      const scene = sceneNow();
      if (!scene?.sys?.isActive?.() || !scene.self || !connected(scene)
          || typeof scene.auto?.update !== "function" || typeof scene.autoHost !== "function"
          || typeof scene.now !== "function" || typeof scene.events?.on !== "function"
          || typeof scene.events.off !== "function") return;
      // Safety Q remains at 1.5; seal objectives preempt routine
      // farming, loot collection and boss attacks at 1.75.
      const remove = GSTFarmUpdate.add(scene, 1.75, update);
      binding = { scene, auto: scene.auto, remove };
      scene.events.on("preupdate", guard);
      scene.events.on("shutdown", shutdown);
      scene.events.on("destroy", shutdown);
      clearInterval(watcher); watcher = null;
      message = "Sẵn sàng hỗ trợ phong ấn khi Auto Farm bật trong bí cảnh.";
    } catch { message = "Chưa gắn được hỗ trợ phong ấn; chờ game."; }
  }
  globalThis.GSTFarmSeals = {
    pending: (scene) => enabled && !suspended && !!scene?.auto?.on
      && !!scene.self && !scene.self.dead && seals(scene).length > 0,
    controls: (scene) => binding?.scene === scene && (job !== null || holding),
    status: (scene) => enabled && binding && binding.scene === scene && scene.auto.on && inside(scene) ? message : ""
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:farm:v1"
        || event.data.type !== "configure") return;
    enabled = event.data.breakSeals === true && event.data.policyMode === "extended";
    if (!enabled) {
      detach(); clearInterval(watcher); watcher = null; message = "";
      // If safety existed only because seals were active, release it now.
      globalThis.GSTFarmBossSafety?.attach(sceneNow());
    } else { watch(); discover(); }
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
})();
