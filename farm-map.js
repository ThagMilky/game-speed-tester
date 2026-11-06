(() => {
  "use strict";
  let preferences = {}, binding = null, job = null, retryAt = 0, message = "", suspended = false;
  const finite = Number.isFinite, deferred = new Map();
  const explored = new Map();
  let scanAt = 0, correctionUntil = 0, lastFix;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const wanted = () => preferences.enabled && preferences.searchScope === "map";
  function release() {
    if (job && binding) GSTNavigation.cancel(binding.scene, job.navigation);
    if (job && binding && job.steer && binding.scene.autoX === job.steer[0] && binding.scene.autoY === job.steer[1]) {
      binding.scene.autoX = binding.scene.autoY = 0;
    }
    job = null;
  }
  function allowed(scene) {
    const driver = scene.driver;
    return (!globalThis.GSTQuest?.active(scene) || (!GSTQuest.controls(scene) && preferences.targetMode === "all")) && scene.auto.on && scene.self && !scene.self.dead && !scene.leaving && driver
      && !driver.closing && !driver.reconnecting && !driver.displaced && (driver.online === false || driver.link?.open?.() === true)
      && !globalThis.GSTFarmSeals?.controls(scene) && !globalThis.GSTChest?.controls(scene)
      && !globalThis.GSTRealm?.controls(scene) && !globalThis.GSTHarvest?.controls(scene)
      && !GSTFarmRouting.blocked(scene) && !scene.keyCapture && !scene.overlay?.dialogOpen && !scene.harvesting
      && !scene.auto.resting && !scene.self.med && !scene.self.fish && !scene.pendingSkill && !scene.aiming
      && !scene.heldAttack && !GSTFarmInput.movement(scene) && !scene.auto.moved
      && scene.now() >= scene.auto.pauseUntil && !(scene.self.realm?.inside?.protection > 0);
  }
  function destination(scene, host, time, scouting) {
    const enemies = typeof host.enemies === "function" ? host.enemies() : [];
    if (!Array.isArray(enemies)) return null;
    for (const [id, until] of deferred) if (until <= time) deferred.delete(id);
    const monsters = enemies.filter((enemy) => !enemy.dead && enemy.hostile && finite(enemy.id)
      && finite(enemy.x) && finite(enemy.y) && finite(scene.map?.w) && finite(scene.map?.h)
      && enemy.x >= 0 && enemy.y >= 0 && enemy.x < scene.map.w && enemy.y < scene.map.h);
    const eligible = monsters.filter((enemy) => !(scene.auto.skipped.get(enemy.id) > time) && !deferred.has(enemy.id));
    // Keep a valid target/journey stable before considering a different actor.
    const current = eligible.find((enemy) => enemy.id === scene.auto.target);
    const pursuing = job?.actor ? eligible.find((enemy) => enemy.id === job.id) : null;
    const nearbyAggro = host.inCombat?.() ? eligible.filter((enemy) => enemy.aggro
      && Math.hypot(enemy.x - scene.px, enemy.y - scene.py) < 3.2)
      .sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py) - Math.hypot(b.x - scene.px, b.y - scene.py))[0] : null;
    const isBoss = (enemy) => enemy && (enemy.cls === "boss" || enemy.wb === true);
    const boss = preferences.targetMode === "bossFirst"
      ? (isBoss(current) ? current : isBoss(pursuing) ? pursuing : eligible.filter(isBoss)
        .sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py) - Math.hypot(b.x - scene.px, b.y - scene.py))[0]) : null;
    const target = boss ?? current ?? pursuing ?? nearbyAggro ?? eligible.sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py)
      - Math.hypot(b.x - scene.px, b.y - scene.py))[0];
    if (target) return { ...target, actor: true };
    if (monsters.length) { message = "Các mục tiêu phù hợp đang được tạm bỏ do cooldown/đường bị chặn; chờ trước khi thử lại."; return null; }
    if (preferences.targetMode !== "boss") {
      return scouting ? scout(scene, time) : null;
    }
    const known = [...scene.views.values()].some((actor) => actor.k === "m" && !actor.dead
      && (actor.st?.cls === "boss" || actor.st?.wb === true));
    if (known) { message = "Boss đã có dữ liệu nhưng không qua bộ lọc/ngưỡng né hiện tại."; return null; }
    const metadata = scene.self.realm?.inside?.boss;
    if (!metadata || !finite(metadata.hp) || metadata.hp <= 0) {
      message = metadata?.hp === 0 ? "Boss bí cảnh đã bị hạ; giữ bộ lọc Chỉ boss."
        : "Chưa có tọa độ boss trong dữ liệu game gửi về; chưa thể tự đi tìm boss này.";
      return metadata?.hp === 0 || !scouting ? null : scout(scene, time);
    }
    if (preferences.avoidEnabled) {
      message = "Boss chưa có dữ liệu level để áp dụng ngưỡng né; chưa tự đi tới tọa độ boss."; return null;
    }
    return { ...metadata, actor: false };
  }
  function scout(scene, time) {
    if (job?.scout && Math.hypot(scene.px - job.x, scene.py - job.y) > 1.2) {
      return { id: job.id, x: job.x, y: job.y, actor: false, scout: true };
    }
    if (job?.scout) { explored.set(job.id, Infinity); release(); }
    if (time < scanAt) { message = "Chưa thấy quái phù hợp; chờ nhịp dò vùng tiếp theo."; return null; }
    scanAt = time + 1;
    const { w, h } = scene.map ?? {};
    if (![w, h, scene.px, scene.py].every(finite) || w <= 0 || h <= 0
        || typeof scene.collision?.blockedCell !== "function") {
      message = "Thiếu dữ liệu va chạm để dò map an toàn."; return null;
    }
    // Bounded spatial sampling, not a second pathfinder. Native walk/hop
    // validates each journey and retains the game's collision rules.
    const columns = Math.min(32, Math.ceil(w / 10)), rows = Math.min(32, Math.ceil(h / 10));
    let best = null, distance = Infinity;
    for (let row = 0; row < rows; row++) {
      const y = (row + 0.5) * h / rows;
      for (let col = 0; col < columns; col++) {
        const x = (col + 0.5) * w / columns;
        const id = `scout:${x}:${y}`, d = Math.hypot(x - scene.px, y - scene.py);
        if (d < 2 || explored.get(id) > time || scene.collision.blockedCell(x, y)) continue;
        if (d < distance) { best = { id, x, y, actor: false, scout: true }; distance = d; }
      }
    }
    if (!best) {
      for (const [id, until] of explored) if (until === Infinity) explored.delete(id);
      scanAt = time + 10; message = "Đã dò các điểm hiện có; chờ trước khi dò lại.";
    }
    return best;
  }
  function defer(time) {
    const id = job?.id;
    if (job?.scout) explored.set(id, time + 60);
    if (finite(id)) {
      if (deferred.size >= 200) deferred.delete(deferred.keys().next().value);
      deferred.set(id, time + 15);
    }
    release(); retryAt = time + (finite(id) ? 0.5 : 15);
  }
  function guard() {
    const scene = binding?.scene;
    if (!scene) return;
    if (sceneNow() !== scene || binding.auto !== scene.auto || !scene.sys?.isActive?.()) { detach(); return; }
    if (job && (!allowed(scene) || scene.castAt !== job.castAt || GSTFarmBehavior.controls(scene))) {
      release(); retryAt = scene.now() + 3;
    }
  }
  function update(host, time, scouting = false) {
    const scene = binding?.scene;
    try {
      if (!scene || !wanted() || suspended || !allowed(scene) || GSTFarmBehavior.controls(scene)) { release(); return false; }
      if (typeof GSTHarvest.needsRecovery !== "function" || GSTHarvest.needsRecovery(scene)) { release(); return false; }
      if (lastFix !== undefined && lastFix !== scene.self.fix && job) {
        release(); correctionUntil = time + 0.45;
      }
      lastFix = scene.self.fix;
      if (time < correctionUntil) {
        host.steer(0, 0); message = "Game vừa chỉnh vị trí; đang chờ ổn định trước khi tiếp tục."; return true;
      }
      if (!job && !scene.auto.target && typeof host.loot === "function" && host.loot().some((loot) => finite(loot.x) && finite(loot.y)
          && Math.hypot(loot.x - scene.px, loot.y - scene.py) < 11
          && Math.hypot(loot.x - scene.auto.ax, loot.y - scene.auto.ay) < 11
          && !scene.auto.lootSkip?.has(`${loot.x.toFixed(1)},${loot.y.toFixed(1)}`))) {
        message = "Chờ game nhặt chiến lợi phẩm gần trước khi tới bãi quái tiếp theo."; return false;
      }
      const target = destination(scene, host, time, scouting);
      if (!target) { if (scouting || !job?.scout) release(); return false; }
      if (scouting && !target.scout) return false;
      if (!finite(target.x) || !finite(target.y) || !finite(scene.map?.w) || !finite(scene.map?.h)
          || target.x < 0 || target.y < 0 || target.x >= scene.map.w || target.y >= scene.map.h
          || !finite(scene.px) || !finite(scene.py) || !finite(time)
          || !["clear", "route"].every((key) => typeof host[key] === "function")) { release(); return false; }
      // Merely knowing a distant actor does not mean native pick() can route to it.
      // Its full route grid is bounded; native walk() can also use shorter hop() routes.
      const distance = Math.hypot(scene.px - target.x, scene.py - target.y);
      if (target.actor && distance <= 6) {
        release(); message = "Đã tới gần mục tiêu; bàn giao chọn quái và chiến đấu cho Auto Farm gốc.";
        return false;
      }
      if (!job && globalThis.GSTChest?.ready(scene)) { message = "Nhường mở rương an toàn gần trước khi tìm bãi xa."; return false; }
      if (time < retryAt) { host.steer(0, 0); message = "Đang chờ nhịp thử lại đường tới bãi quái."; return true; }
      if (performance.now() - binding.modalAt >= 250) {
        binding.modalAt = performance.now();
        binding.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) => el.getClientRects().length
          && getComputedStyle(el).visibility !== "hidden");
      }
      if (binding.modal) { release(); return false; }
      if (!job || job.id !== target.id || job.actor !== target.actor || Math.hypot(job.x - target.x, job.y - target.y) > 1) {
        release();
        const navigation = Object.assign(Object.create(scene.auto), { path: [], lastX: scene.px, lastY: scene.py,
          stillSince: time, pathAt: -Infinity, stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0 });
        job = { id: target.id, actor: target.actor, scout: target.scout === true, x: target.x, y: target.y, navigation, castAt: scene.castAt, progressAt: time,
          startedAt: time, steer: null };
      }
      if (GSTNavigation.progressed(scene, job, job.navigation.path, job.x, job.y)) job.progressAt = time;
      if (time - job.progressAt > 8 || time - job.startedAt > 120) {
        const delay = job.scout ? 60 : 15;
        defer(time); message = `Chưa tiếp cận được mục tiêu; tạm bỏ ${delay} giây và xét mục tiêu khác.`; return false;
      }
      const owner = job;
      const walking = { ...host, steer: (x, y) => { scene.autoX = x; scene.autoY = y; owner.steer = [x, y]; } };
      if (target.scout && Math.hypot(scene.px - target.x, scene.py - target.y) <= 1.2) {
        explored.set(target.id, Infinity); release(); walking.steer(0, 0);
        message = "Đã tới điểm dò; đang tìm quái đúng bộ lọc.";
      } else if (!target.scout && Math.hypot(scene.px - target.x, scene.py - target.y) <= 6) {
        walking.steer(0, 0); message = "Đã tới gần tọa độ boss; chờ game cung cấp actor boss để Auto Farm chọn mục tiêu.";
      } else if (!GSTNavigation.walk(scene, owner.navigation, walking, time, scene.px, scene.py, target.x, target.y, target.scout ? 1 : 5)) {
        const delay = job.scout ? 60 : 15;
        defer(time); message = `Đường tới mục tiêu bị chặn; tạm bỏ ${delay} giây và xét mục tiêu khác.`; return false;
      } else message = target.scout ? `Đang dò vùng mới tìm quái đúng bộ lọc · còn ${distance.toFixed(1)} ô.`
        : target.actor ? `Đang tới mục tiêu/bãi quái tiếp theo · còn ${distance.toFixed(1)} ô; tới gần sẽ dùng Auto Farm gốc đánh.`
        : "Đang tới tọa độ boss bí cảnh bằng đường đi gốc; chưa tự tấn công khi thiếu actor.";
      return true;
    } catch { release(); retryAt = finite(time) ? time + 15 : 0; message = "Dữ liệu đường tới mục tiêu chưa phù hợp; đã nhường lại game."; return false; }
  }
  function detach() {
    release(); const old = binding; binding = null;
    if (old) { old.remove(); old.removeScout(); old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach); }
    retryAt = 0; message = ""; deferred.clear(); explored.clear(); scanAt = 0; lastFix = undefined; correctionUntil = 0;
  }
  function attach(scene) {
    if (!wanted() || suspended) { detach(); return; }
    if (binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.walk !== "function" || typeof scene.now !== "function"
        || typeof scene.views?.values !== "function" || !scene.events?.on || !scene.events.off) return;
    binding = { scene, auto: scene.auto, remove: GSTFarmUpdate.add(scene, 4, (host, time) => update(host, time)),
      removeScout: GSTFarmUpdate.add(scene, 25, (host, time) => update(host, time, true)), modalAt: -Infinity, modal: false };
    scene.events.on("preupdate", guard); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmMap = {
    configure(scene, value) { detach(); preferences = value; this.attach(scene); },
    attach(scene) { try { attach(scene); } catch { detach(); } },
    // Exploration has lower priority than portals/chests/harvest. It must not
    // advertise a lock that prevents those earlier handlers from starting.
    controls: (scene) => !!binding && binding.scene === scene && job !== null && !job.scout,
    journey: (scene) => binding?.scene === scene && job ? {
      id: job.id, x: job.x, y: job.y, scout: job.scout, path: job.navigation.path
    } : null,
    status: (scene) => binding && binding.scene === scene && scene.auto.on ? message : ""
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmMap.attach(sceneNow()); });
})();
