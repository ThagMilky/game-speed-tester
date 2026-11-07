(() => {
  "use strict";
  let preferences = {}, binding = null, job = null, retryAt = 0, message = "", suspended = false;
  const finite = Number.isFinite, deferred = new Map();
  const explored = new Map();
  let scanAt = 0, correctionUntil = 0, lastFix;
  let resumeTarget = null;
  const isBoss = (enemy) => enemy?.cls === "boss" || enemy?.wb === true;
  const range = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const segmentDistance = (point, start, end) => {
    const dx = end.x - start.x, dy = end.y - start.y;
    const length = dx * dx + dy * dy;
    const t = length ? Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / length)) : 0;
    return Math.hypot(point.x - start.x - t * dx, point.y - start.y - t * dy);
  };
  function bossObstacles(scene) {
    if (!preferences.excludeBoss && !["highLevel", "lowLevel"].includes(preferences.targetMode)) return [];
    return [...scene.views.values()].filter((actor) => actor.k === "m" && !actor.dead
      && (actor.st?.cls === "boss" || actor.st?.wb === true) && finite(actor.x) && finite(actor.y));
  }
  const clearance = (actor) => Math.max(2.5, (finite(actor.radius) ? actor.radius : 1) + 1.5);
  const clearOfBoss = (from, to, bosses) => bosses.every((actor) =>
    segmentDistance(actor, from, to) >= clearance(actor));
  function nativeSafeLeg(host, from, to, bosses) {
    const points = host.clear(from.x, from.y, to.x, to.y) ? [[to.x, to.y]]
      : host.route(from.x, from.y, to.x, to.y);
    if (!Array.isArray(points) || !points.length) return null;
    const route = [...points];
    if (route.some((point) => !Array.isArray(point) || point.length < 2 || !point.slice(0, 2).every(finite))) return null;
    const last = route[route.length - 1];
    if (Math.hypot(last[0] - to.x, last[1] - to.y) > 0.25) route.push([to.x, to.y]);
    let previous = from;
    for (const point of route) {
      const next = { x: point[0], y: point[1] };
      if (!clearOfBoss(previous, next, bosses)) return null;
      previous = next;
    }
    return route;
  }
  function safeBossRoute(scene, host, from, to, bosses) {
    const direct = nativeSafeLeg(host, from, to, bosses);
    if (direct) return direct;
    const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
    if (length < 0.1) return null;
    const blockers = bosses.filter((actor) => segmentDistance(actor, from, to) < clearance(actor))
      .sort((a, b) => range(a, from) - range(b, from)).slice(0, 3);
    for (const actor of blockers) for (const side of [1, -1]) for (const extra of [1, 3]) {
      const offset = clearance(actor) + extra;
      const point = { x: actor.x - dy / length * side * offset, y: actor.y + dx / length * side * offset };
      if (!(point.x >= 0 && point.y >= 0 && point.x < scene.map?.w && point.y < scene.map?.h)) continue;
      const first = nativeSafeLeg(host, from, point, bosses);
      if (!first) continue;
      const second = nativeSafeLeg(host, point, to, bosses);
      if (second) return [...first, ...second];
    }
    return null;
  }
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const wanted = () => preferences.enabled && (preferences.searchScope === "map"
    || (preferences.searchScope === "radius" && preferences.idleMode === "seek"));
  function searchArea(scene) {
    const w = scene.map?.w, h = scene.map?.h;
    if (![w, h].every(finite) || w <= 0 || h <= 0) return null;
    if (preferences.searchScope === "map") return { minX: 0, minY: 0, maxX: w, maxY: h, home: null };
    const home = globalThis.GSTHarvest?.farmOrigin?.(scene), radius = preferences.radius;
    if (!home || ![home.x, home.y, radius].every(finite) || radius < 11) return null;
    return { minX: Math.max(0, home.x - radius), maxX: Math.min(w, home.x + radius),
      minY: Math.max(0, home.y - radius), maxY: Math.min(h, home.y + radius), home, radius };
  }
  const withinArea = (area, point) => area && finite(point?.x) && finite(point?.y)
    && point.x >= 0 && point.y >= 0 && point.x < area.maxX && point.y < area.maxY && point.x >= area.minX && point.y >= area.minY
    && (!area.home || range(point, area.home) <= area.radius);
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
    const area = searchArea(scene);
    if (!area) return null;
    const enemies = typeof host.enemies === "function" ? host.enemies() : [];
    if (!Array.isArray(enemies)) return null;
    for (const [id, until] of deferred) if (until <= time) deferred.delete(id);
    const monsters = enemies.filter((enemy) => !enemy.dead && enemy.hostile && finite(enemy.id)
      && withinArea(area, enemy));
    const eligible = monsters.filter((enemy) => !(scene.auto.skipped.get(enemy.id) > time) && !deferred.has(enemy.id));
    // Keep a valid target/journey stable before considering a different actor.
    const current = eligible.find((enemy) => enemy.id === scene.auto.target);
    const pursuing = job?.actor ? eligible.find((enemy) => enemy.id === job.id) : null;
    const nearbyAggro = host.inCombat?.() ? eligible.filter((enemy) => enemy.aggro
      && Math.hypot(enemy.x - scene.px, enemy.y - scene.py) < 3.2)
      .sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py) - Math.hypot(b.x - scene.px, b.y - scene.py))[0] : null;
    const priority = globalThis.GSTFarmPriority;
    const ordered = [...eligible].sort((a, b) =>
      (priority?.ranked?.() === true ? priority.compare(a, b) : 0)
      || Math.hypot(a.x - scene.px, a.y - scene.py) - Math.hypot(b.x - scene.px, b.y - scene.py));
    const returning = resumeTarget === null ? null : eligible.find((enemy) => enemy.id === resumeTarget);
    if (resumeTarget !== null && !returning) resumeTarget = null;
    const target = current ?? pursuing ?? returning ?? nearbyAggro ?? ordered[0];
    if (target?.id === resumeTarget) resumeTarget = null;
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
    if (!withinArea(area, metadata)) {
      message = "Tọa độ boss nằm ngoài vùng farm đã chọn; không tự đi tới."; return null;
    }
    return { ...metadata, actor: false };
  }
  function scout(scene, time) {
    const area = searchArea(scene);
    if (!area) { message = "Chưa xác định được phạm vi tìm quái an toàn."; return null; }
    if (job?.scout && withinArea(area, job) && Math.hypot(scene.px - job.x, scene.py - job.y) > 1.2) {
      return { id: job.id, x: job.x, y: job.y, actor: false, scout: true };
    }
    if (job?.scout) { explored.set(job.id, Infinity); release(); }
    if (time < scanAt) { message = "Chưa thấy quái phù hợp; chờ nhịp dò vùng tiếp theo."; return null; }
    scanAt = time + 1;
    if (![scene.px, scene.py].every(finite) || typeof scene.collision?.blockedCell !== "function") {
      message = "Thiếu dữ liệu va chạm để dò map an toàn."; return null;
    }
    // Sample only inside the selected map/radius; native walk/hop still owns routes.
    const width = area.maxX - area.minX, height = area.maxY - area.minY;
    const columns = Math.min(32, Math.ceil(width / 10)), rows = Math.min(32, Math.ceil(height / 10));
    if (columns < 1 || rows < 1) return null;
    let best = null, distance = Infinity;
    for (let row = 0; row < rows; row++) {
      const y = area.minY + (row + 0.5) * height / rows;
      for (let col = 0; col < columns; col++) {
        const x = area.minX + (col + 0.5) * width / columns;
        const id = `scout:${x}:${y}`, d = Math.hypot(x - scene.px, y - scene.py);
        if (!withinArea(area, { x, y }) || d < 2 || explored.get(id) > time
            || scene.collision.blockedCell(x, y)) continue;
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
    if (job && (!allowed(scene) || scene.castAt !== job.castAt || GSTFarmBehavior.controls(scene)
        || globalThis.GSTFarmBossSafety?.controls(scene))) {
      release(); retryAt = scene.now() + 3;
    }
  }
  function update(host, time, scouting = false) {
    const scene = binding?.scene;
    try {
      if (!scene || !wanted() || suspended || !allowed(scene) || GSTFarmBehavior.controls(scene)
          || globalThis.GSTFarmBossSafety?.controls(scene)) { release(); return false; }
      const area = searchArea(scene);
      if (!area) { release(); return false; }
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
      if (!scouting && job?.actor && target.actor && job.id === target.id && !scene.auto.target
          && typeof host.enemies === "function") {
        const pos = { x: scene.px, y: scene.py };
        const blocker = host.enemies().filter((enemy) => !isBoss(enemy) && enemy.id !== target.id
          && !enemy.dead && enemy.hostile && finite(enemy.x) && finite(enemy.y)
          && range(enemy, pos) < 3.5 && range(enemy, { x: scene.auto.ax, y: scene.auto.ay }) < 11
          && segmentDistance(enemy, pos, target) < (finite(enemy.radius) ? enemy.radius : 1) + 0.7)
          .sort((a, b) => range(a, pos) - range(b, pos))[0];
        if (blocker && !(scene.auto.skipped.get(blocker.id) > time)
            && scene.auto.pick(host, time, [blocker], [], scene.px, scene.py)) {
          resumeTarget = target.id;
          scene.auto.target = blocker.id;
          scene.auto.think = 0;
          release();
          message = "Quái thường cản đường: nhường Auto Farm gốc xử lý rồi tiếp tục mục tiêu cũ.";
          return false;
        }
      }
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
      const bosses = bossObstacles(scene);
      if (bosses.length && owner.navigation.path.length) {
        const point = owner.navigation.path[0];
        if (Array.isArray(point) && point.length === 2 && point.every(finite)
            && !clearOfBoss({ x: scene.px, y: scene.py }, { x: point[0], y: point[1] }, bosses)) {
          owner.navigation.path = []; owner.navigation.pathAt = -Infinity;
        }
      }
      owner.denied = false;
      const walking = { ...host,
        clear: (x, y, gx, gy) => (!area.home
            || withinArea(area, { x, y }) && withinArea(area, { x: gx, y: gy }))
          && host.clear(x, y, gx, gy)
          && (!bosses.length || clearOfBoss({ x, y }, { x: gx, y: gy }, bosses)),
        route: (x, y, gx, gy) => {
          if (area.home && (!withinArea(area, { x, y }) || !withinArea(area, { x: gx, y: gy }))) return null;
          const route = bosses.length
            ? safeBossRoute(scene, host, { x, y }, { x: gx, y: gy }, bosses)
            : host.route(x, y, gx, gy);
          if (!area.home || route === null) return route;
          return Array.isArray(route) && route.every((point) => Array.isArray(point) && point.length >= 2
            && withinArea(area, { x: point[0], y: point[1] })) ? route : null;
        },
        steer: (x, y) => {
          if (area.home && (!finite(x) || !finite(y)
              || !withinArea(area, { x: scene.px + x * 0.25, y: scene.py + y * 0.25 }))) {
            owner.denied = true; x = 0; y = 0;
          }
          scene.autoX = x; scene.autoY = y; owner.steer = [x, y];
        } };
      if (target.scout && Math.hypot(scene.px - target.x, scene.py - target.y) <= 1.2) {
        explored.set(target.id, Infinity); release(); walking.steer(0, 0);
        message = "Đã tới điểm dò; đang tìm quái đúng bộ lọc.";
      } else if (!target.scout && Math.hypot(scene.px - target.x, scene.py - target.y) <= 6) {
        walking.steer(0, 0); message = "Đã tới gần tọa độ boss; chờ game cung cấp actor boss để Auto Farm chọn mục tiêu.";
      } else if (!GSTNavigation.walk(scene, owner.navigation, walking, time, scene.px, scene.py, target.x, target.y, target.scout ? 1 : 5)
          || owner.denied) {
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
    resumeTarget = null;
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
    pauseForLoot(scene) {
      if (!binding || binding.scene !== scene || !job) return;
      release(); retryAt = scene.now() + 0.3;
    },
    journey: (scene) => binding?.scene === scene && job ? {
      id: job.id, x: job.x, y: job.y, scout: job.scout, path: job.navigation.path
    } : null,
    status: (scene) => binding && binding.scene === scene && scene.auto.on ? message : ""
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmMap.attach(sceneNow()); });
})();
