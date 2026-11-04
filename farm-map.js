(() => {
  "use strict";
  let preferences = {}, binding = null, job = null, retryAt = 0, message = "", suspended = false;
  const finite = Number.isFinite;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const wanted = () => preferences.enabled && preferences.searchScope === "map" && preferences.targetMode === "boss";
  function release() {
    if (job && binding && job.steer && binding.scene.autoX === job.steer[0] && binding.scene.autoY === job.steer[1]) {
      binding.scene.autoX = binding.scene.autoY = 0;
    }
    job = null;
  }
  function allowed(scene) {
    const driver = scene.driver;
    return scene.auto.on && scene.self && !scene.self.dead && !scene.leaving && driver
      && !driver.closing && !driver.reconnecting && !driver.displaced && (driver.online === false || driver.link?.open?.() === true)
      && !GSTFarmRouting.blocked(scene) && !scene.keyCapture && !scene.overlay?.dialogOpen && !scene.harvesting
      && !scene.auto.resting && !scene.self.med && !scene.self.fish && !scene.pendingSkill && !scene.aiming
      && !scene.heldAttack && !GSTFarmInput.movement(scene) && !scene.auto.moved
      && scene.now() >= scene.auto.pauseUntil && !(scene.self.realm?.inside?.protection > 0);
  }
  function destination(scene, host, time) {
    const enemies = typeof host.enemies === "function" ? host.enemies() : [];
    if (!Array.isArray(enemies)) return null;
    const bosses = enemies.filter((enemy) => !enemy.dead && enemy.hostile && finite(enemy.id)
      && finite(enemy.x) && finite(enemy.y) && (enemy.cls === "boss" || enemy.wb === true));
    const eligible = bosses.filter((enemy) => !(scene.auto.skipped.get(enemy.id) > time));
    // Preserve the current eligible target. Otherwise use the nearest known boss.
    const current = eligible.find((enemy) => enemy.id === scene.auto.target);
    const pursuing = job?.actor ? eligible.find((enemy) => enemy.id === job.id) : null;
    const boss = current ?? pursuing ?? eligible.sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py)
      - Math.hypot(b.x - scene.px, b.y - scene.py))[0];
    if (boss) return { ...boss, actor: true };
    if (bosses.length) { message = "Boss đang trong thời gian tạm bỏ của game; chờ trước khi tìm đường lại."; return null; }
    const known = [...scene.views.values()].some((actor) => actor.k === "m" && !actor.dead
      && (actor.st?.cls === "boss" || actor.st?.wb === true));
    if (known) { message = "Boss đã có dữ liệu nhưng không qua bộ lọc/ngưỡng né hiện tại."; return null; }
    const metadata = scene.self.realm?.inside?.boss;
    if (!metadata || !finite(metadata.hp) || metadata.hp <= 0) {
      message = metadata?.hp === 0 ? "Boss bí cảnh đã bị hạ; giữ bộ lọc Chỉ boss."
        : "Chưa có tọa độ boss trong dữ liệu game gửi về; chưa thể tự đi tìm boss này.";
      return null;
    }
    if (preferences.avoidEnabled) {
      message = "Boss chưa có dữ liệu level để áp dụng ngưỡng né; chưa tự đi tới tọa độ boss."; return null;
    }
    return { ...metadata, actor: false };
  }
  function guard() {
    const scene = binding?.scene;
    if (!scene) return;
    if (sceneNow() !== scene || binding.auto !== scene.auto || !scene.sys?.isActive?.()) { detach(); return; }
    if (job && (!allowed(scene) || scene.castAt !== job.castAt || GSTFarmBehavior.controls(scene))) {
      release(); retryAt = scene.now() + 3;
    }
  }
  function update(host, time) {
    const scene = binding?.scene;
    try {
      if (!scene || !wanted() || suspended || !allowed(scene) || GSTFarmBehavior.controls(scene)) { release(); return false; }
      if (typeof GSTHarvest.needsRecovery !== "function" || GSTHarvest.needsRecovery(scene)) { release(); return false; }
      const boss = destination(scene, host, time);
      if (!boss) { release(); return false; }
      if (!finite(boss.x) || !finite(boss.y) || !finite(scene.map?.w) || !finite(scene.map?.h)
          || boss.x < 0 || boss.y < 0 || boss.x >= scene.map.w || boss.y >= scene.map.h
          || !finite(scene.px) || !finite(scene.py) || !finite(time)
          || !["clear", "route"].every((key) => typeof host[key] === "function")) { release(); return false; }
      // Merely knowing a distant actor does not mean native pick() can route to it.
      // Its full route grid is bounded; native walk() can also use shorter hop() routes.
      const distance = Math.hypot(scene.px - boss.x, scene.py - boss.y);
      if (boss.actor && distance <= 6) {
        release(); message = "Đã tới gần boss; bàn giao chọn mục tiêu và chiến đấu cho Auto Farm gốc.";
        return false;
      }
      if (time < retryAt) { message = "Đang chờ hết thời gian thử lại đường tới boss."; return false; }
      if (performance.now() - binding.modalAt >= 250) {
        binding.modalAt = performance.now();
        binding.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) => el.getClientRects().length
          && getComputedStyle(el).visibility !== "hidden");
      }
      if (binding.modal) { release(); return false; }
      if (!job || job.id !== boss.id || job.actor !== boss.actor || Math.hypot(job.x - boss.x, job.y - boss.y) > 1) {
        release();
        const navigation = Object.assign(Object.create(scene.auto), { path: [], lastX: scene.px, lastY: scene.py,
          stillSince: time, pathAt: -Infinity, stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0 });
        job = { id: boss.id, actor: boss.actor, x: boss.x, y: boss.y, navigation, castAt: scene.castAt, progressAt: time,
          startedAt: time, steer: null };
      }
      if (GSTNavigation.progressed(scene, job, job.navigation.path, job.x, job.y)) job.progressAt = time;
      if (time - job.progressAt > 8 || time - job.startedAt > 120) {
        release(); retryAt = time + 15; message = "Chưa tiếp cận được boss; tạm bỏ đường này 15 giây."; return false;
      }
      const owner = job;
      const walking = { ...host, steer: (x, y) => { scene.autoX = x; scene.autoY = y; owner.steer = [x, y]; } };
      if (Math.hypot(scene.px - boss.x, scene.py - boss.y) <= 6) {
        walking.steer(0, 0); message = "Đã tới gần tọa độ boss; chờ game cung cấp actor boss để Auto Farm chọn mục tiêu.";
      } else if (!GSTNavigation.walk(scene, owner.navigation, walking, time, scene.px, scene.py, boss.x, boss.y, 5)) {
        release(); retryAt = time + 15; message = "Không có đường tới boss; chờ 15 giây trước khi thử lại."; return false;
      } else message = boss.actor ? "Đang đi tới boss đã biết trên map; tới gần sẽ bàn giao Auto Farm gốc đánh."
        : "Đang tới tọa độ boss bí cảnh bằng đường đi gốc; chưa tự tấn công khi thiếu actor.";
      return true;
    } catch { release(); retryAt = finite(time) ? time + 15 : 0; message = "Dữ liệu đường tới boss chưa phù hợp; đã nhường lại game."; return false; }
  }
  function detach() {
    release(); const old = binding; binding = null;
    if (old) { old.remove(); old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach); }
    retryAt = 0; message = "";
  }
  function attach(scene) {
    if (!wanted() || suspended) { detach(); return; }
    if (binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.walk !== "function" || typeof scene.now !== "function"
        || typeof scene.views?.values !== "function" || !scene.events?.on || !scene.events.off) return;
    binding = { scene, auto: scene.auto, remove: GSTFarmUpdate.add(scene, 4, update), modalAt: -Infinity, modal: false };
    scene.events.on("preupdate", guard); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmMap = {
    configure(scene, value) { detach(); preferences = value; this.attach(scene); },
    attach(scene) { try { attach(scene); } catch { detach(); } },
    controls: (scene) => !!binding && binding.scene === scene && job !== null,
    status: (scene) => binding && binding.scene === scene && scene.auto.on ? message : ""
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmMap.attach(sceneNow()); });
})();
