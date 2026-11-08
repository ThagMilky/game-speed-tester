(() => {
  "use strict";
  let preferences = {}, binding = null, job = null, retryAt = 0, message = "", suspended = false;
  const finite = Number.isFinite, deferred = new Map();
  const explored = new Map();
  let scanAt = 0, correctionUntil = 0, lastFix;
  let resumeTarget = null, handoff = null, resumeReason = null, centerSync = null;
  const nativeReach = 6.5, handoffReach = 5.5;
  const hitHooks = new WeakMap();
  function observeHit(scene, event) {
    const owner = binding;
    if (owner?.scene !== scene || event?.e !== "dmg" || event.kind !== "p"
        || event.id !== scene.you || !finite(event.v) || event.v <= 0
        || !Number.isSafeInteger(event.by)) return;
    const actor = scene.views?.get?.(event.by), time = scene.now();
    // aggro means a monster is aggressive, not that it attacked the player.
    if (actor?.k !== "m" || actor.dead || actor.st?.cls === "pet" || !finite(time)) return;
    owner.hitSequence = (owner.hitSequence || 0) + 1;
    owner.lastHit = { id: event.by, at: time, sequence: owner.hitSequence };
  }
  function attachHits(scene) {
    if (typeof scene.onEvent !== "function") return;
    let hook = hitHooks.get(scene);
    if (!hook) {
      const original = scene.onEvent;
      const descriptor = Object.getOwnPropertyDescriptor(scene, "onEvent");
      hook = { original, descriptor, wrapper: null, active: false };
      hook.wrapper = function (...args) {
        const result = original.apply(this, args);
        if (this === scene && hook.active) {
          try { observeHit(scene, args[0]); } catch { /* Native game events always proceed. */ }
        }
        return result;
      };
      scene.onEvent = hook.wrapper;
      hitHooks.set(scene, hook);
    }
    hook.active = true;
  }
  function detachHits(scene) {
    const hook = hitHooks.get(scene);
    if (!hook) return;
    hook.active = false;
    if (scene.onEvent !== hook.wrapper) return; // Another owner may wrap ours.
    if (hook.descriptor) Object.defineProperty(scene, "onEvent", hook.descriptor);
    else delete scene.onEvent;
    hitHooks.delete(scene);
  }
  function routeLog(scene, reason, extra = {}) {
    globalThis.GSTMovementDiagnostics?.event?.(scene, reason, extra);
  }
  function endHandoff(reason = "target_unavailable") {
    if (handoff?.fromMap) resumeReason = reason;
    handoff = null;
  }
  function nativeTarget(scene, enemies, area, time) {
    if (!Number.isSafeInteger(scene.auto.target)) return null;
    return Array.isArray(enemies) ? enemies.find((enemy) => enemy.id === scene.auto.target
      && !enemy.dead && enemy.hostile && withinArea(area, enemy)
      && !(scene.auto.skipped.get(enemy.id) > time)
      && !(deferred.get(enemy.id) > time)) ?? null : null;
  }
  function yieldToNative(scene, time, target, reason) {
    const fromMap = !!job?.actor || handoff?.fromMap === true;
    if (job?.actor && target.id !== job.id) resumeTarget = job.id;
    if (job?.actor) {
      routeLog(scene, "map_handoff", { targetId: target.id, remaining: range(target, { x: scene.px, y: scene.py }),
        fromOwner: "GSTFarmMap", toOwner: "native_farm_eligible", handoffReason: reason });
    }
    if (!handoff || handoff.id !== target.id) handoff = { id: target.id, at: time, fromMap };
    // Native pick()/idle() search within 11 units of auto.ax/ay. A map target
    // may be 40+ units away from the old center, so hand off the center too.
    if (finite(target.x) && finite(target.y)) {
      scene.auto.ax = target.x; scene.auto.ay = target.y;
      centerSync = { x: target.x, y: target.y };
      scene.auto.think = 0; scene.auto.chaseSince = time;
    }
    if (Number.isSafeInteger(target.id)) scene.auto.target = target.id;
    release();
    message = "Đang nhường Auto Farm gốc xử lý mục tiêu ở gần; chưa tìm bãi khác.";
  }
  function nativeBusy(scene, host, area, time) {
    const enemies = typeof host.enemies === "function" ? host.enemies() : [];
    const target = nativeTarget(scene, enemies, area, time);
    const distance = target ? range(target, { x: scene.px, y: scene.py }) : Infinity;
    const engaged = target && distance <= nativeReach
      && (distance <= 2.2 || host.clear?.(scene.px, scene.py, target.x, target.y));
    // Hand off only for a confirmed recent hit on the player. The game's
    // enemy.aggro flag describes monster type, not the attacker.
    const hit = binding?.lastHit;
    const recent = hit && hit.sequence !== binding.handledHit
      && time >= hit.at && time - hit.at <= 1.5 && Array.isArray(enemies)
      ? enemies.find((enemy) => enemy.id === hit.id && !enemy.dead && enemy.hostile
          && withinArea(area, enemy) && !(scene.auto.skipped.get(enemy.id) > time)
          && range(enemy, { x: scene.px, y: scene.py }) < 3.2) : null;
    if (recent && (!engaged || distance > 4) && target?.id !== recent.id) {
      binding.handledHit = hit.sequence;
      if (handoff?.id !== recent.id) yieldToNative(scene, time, recent, "recent_attacker");
      return true;
    }
    // A newly discovered boss may preempt a normal native target, but not an
    // actively engaged close-range fight.
    const ranked = globalThis.GSTFarmPriority;
    const bosses = preferences.targetMode === "bossLevel" && Array.isArray(enemies)
      ? enemies.filter((enemy) => isBoss(enemy) && !enemy.dead && enemy.hostile
        && withinArea(area, enemy) && !(scene.auto.skipped.get(enemy.id) > time)) : [];
    const boss = bosses.sort((a, b) => range(a, { x: scene.px, y: scene.py })
      - range(b, { x: scene.px, y: scene.py }))[0];
    const bossPriority = !!boss && !!target && !isBoss(target)
      && !(host.inCombat?.() && distance <= handoffReach) && boss.id !== target.id
      && ranked?.switchReason?.(target, boss, { x: scene.px, y: scene.py }, 3) === "boss_priority";
    if (bossPriority && handoff) endHandoff("priority_preempt");
    if (bossPriority) return false;
    if (handoff) {
      const held = Array.isArray(enemies) && enemies.find((enemy) => enemy.id === handoff.id
        && !enemy.dead && enemy.hostile && withinArea(area, enemy));
      if (!held) endHandoff("target_unavailable");
      else if (scene.auto.target !== handoff.id) endHandoff("native_target_changed");
      else {
        const heldDistance = range(held, { x: scene.px, y: scene.py });
        // Only an ongoing fight may hold native ownership indefinitely.
        if (engaged && target?.id === held.id && host.inCombat?.()) {
          if (job) release();
          return true;
        }
        if (heldDistance <= nativeReach && time - handoff.at < 2) return true;
        if (time - handoff.at >= 2 && Number.isSafeInteger(handoff.id))
          deferred.set(handoff.id, time + 3);
        endHandoff(time - handoff.at >= 2 ? "handoff_timeout" : "native_out_of_range");
        return false; // Do not immediately re-handoff the expired target.
      }
    }
    if (!engaged) return false;
    // Native has a genuinely nearby target, not simply an actor within 11 tiles.
    if (job && !(host.inCombat?.() && distance <= handoffReach)) return false;
    yieldToNative(scene, time, target, job ? "native_engaged" : "native_target");
    return true;
  }
  function recover(scene, host, time, reason, remaining) {
    if (!job) return false;
    if (job.replans < 2 && time - job.lastReplanAt >= 1) {
      job.replans++;
      job.lastReplanAt = time;
      job.retryUntil = time + 0.6;
      job.navigation.path = [];
      job.navigation.pathAt = -Infinity;
      job.navigation.sideUntil = 0;
      GSTNavigation.resetLeg(job, true);
      GSTNavigation.cancel(scene, job.navigation);
      host.steer(0, 0);
      routeLog(scene, "map_replan", { targetId: job.id, remaining,
        stuckMs: Math.max(0, (time - job.progressAt) * 1000),
        replanReason: reason, attempt: job.replans, action: "retry" });
      message = "Đang thử tính lại đường tới mục tiêu cũ trước khi đổi bãi.";
      return true;
    }
    if (job.replans < 2 || time - job.lastReplanAt < 1) {
      host.steer(0, 0);
      return true;
    }
    routeLog(scene, "map_stuck", { targetId: job.id, remaining,
      stuckMs: Math.max(0, (time - job.progressAt) * 1000),
      replanReason: reason, attempt: job.replans, action: "defer", retryMs: job.scout ? 60000 : 15000 });
    defer(time);
    message = "Đường vẫn bị chặn sau hai lần thử; tạm bỏ mục tiêu và xét bãi khác.";
    return false;
  }
  const isBoss = (enemy) => enemy?.cls === "boss" || enemy?.wb === true;
  const range = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  // Use the same bounded leg selector as seals/chests/realm portals,
  // with farm-area limits and existing boss avoidance preserved.
  function checkpoint(scene, host, owner, area) {
    const bosses = bossObstacles(scene);
    const safe = {
      clear: (x, y, gx, gy) => host.clear(x, y, gx, gy)
        && (!bosses.length || clearOfBoss({ x, y }, { x: gx, y: gy }, bosses)),
      route: (x, y, gx, gy) => {
        const result = bosses.length
          ? safeBossRoute(scene, host, { x, y }, { x: gx, y: gy }, bosses)
          : host.route(x, y, gx, gy);
        if (!Array.isArray(result)) return null;
        return result.every((point) => Array.isArray(point) && point.length >= 2
          && withinArea(area, { x: point[0], y: point[1] })) ? result : null;
      }
    };
    return GSTNavigation.leg(scene, owner, safe, owner.x, owner.y,
      (point) => withinArea(area, point));
  }
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
  const seekRealmBoss = (scene) => globalThis.GSTRealm?.seekBoss?.(scene) === true;
  const wanted = (scene) => (preferences.enabled && (preferences.searchScope === "map"
    || (preferences.searchScope === "radius" && preferences.idleMode === "seek")))
    || seekRealmBoss(scene);
  function searchArea(scene) {
    const w = scene.map?.w, h = scene.map?.h;
    if (![w, h].every(finite) || w <= 0 || h <= 0) return null;
    if (preferences.searchScope === "map" || seekRealmBoss(scene))
      return { minX: 0, minY: 0, maxX: w, maxY: h, home: null };
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
      && !globalThis.GSTFarmSeals?.pending?.(scene)
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
    // Opt-in realm boss search uses the known encounter coordinates. Actual
    // attacks still belong to the user's native Auto Farm skill/target filter.
    // The metadata is NOT a fabricated monster actor.
    if (seekRealmBoss(scene)) {
      const metadata = scene.self.realm.inside.boss;
      if (withinArea(area, metadata)) {
        const liveBoss = eligible.find((enemy) => isBoss(enemy));
        if (liveBoss) return { ...liveBoss, actor: true };
        if (!scouting) return { id: "realm:boss", x: metadata.x, y: metadata.y, actor: false };
      }
    }
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
    const challenger = ordered[0], position = { x: scene.px, y: scene.py };
    const better = pursuing && challenger && challenger.id !== pursuing.id
      ? priority?.switchReason?.(pursuing, challenger, position, time - job.startedAt) : "";
    const localPriority = !pursuing && current && challenger && challenger.id !== current.id
      ? priority?.switchReason?.(current, challenger, position, 3) : "";
    const target = better || localPriority ? challenger : pursuing ?? returning ?? current ?? nearbyAggro ?? challenger;
    if (target?.id === resumeTarget) resumeTarget = null;
    if (target) return { ...target, actor: true, switchReason: better || localPriority || "" };
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
    if (job && (globalThis.GSTMapTravel?.active(scene) || !allowed(scene) || scene.castAt !== job.castAt || GSTFarmBehavior.controls(scene)
        || globalThis.GSTFarmBossSafety?.controls(scene))) {
      release(); retryAt = scene.now() + 0.5;
    }
  }
  function update(host, time, scouting = false) {
    const scene = binding?.scene;
    try {
      if (!scene || !wanted(scene) || suspended || globalThis.GSTMapTravel?.active(scene)
          || !allowed(scene) || GSTFarmBehavior.controls(scene)
          || globalThis.GSTFarmBossSafety?.controls(scene)) {
        release();
        if (!scene?.auto?.on || !wanted(scene) || suspended || (scene && GSTFarmInput.movement(scene)))
          endHandoff("manual_override");
        return false;
      }
      const area = searchArea(scene);
      if (!area) { release(); return false; }
      if (typeof GSTHarvest.needsRecovery !== "function" || GSTHarvest.needsRecovery(scene)) { release(); return false; }
      if (lastFix !== undefined && lastFix !== scene.self.fix && job) {
        GSTNavigation.cancel(scene, job.navigation);
        if (job.steer && scene.autoX === job.steer[0] && scene.autoY === job.steer[1])
          scene.autoX = scene.autoY = 0;
        // Keep the destination, but discard the route calculated from the old position.
        job.navigation.path = []; job.navigation.pathAt = -Infinity;
        job.navigation.sideUntil = 0; job.progressAt = time;
        GSTNavigation.resetLeg(job);
        job.replans = 0; job.lastReplanAt = -Infinity; job.retryUntil = 0; job.steer = null;
        correctionUntil = time + 0.12;
        routeLog(scene, "map_correction", { pauseMs: 120, targetId: job.id, action: "retry" });
      }
      lastFix = scene.self.fix;
      if (time < correctionUntil) {
        host.steer(0, 0); message = "Game vừa chỉnh vị trí; đang chờ ổn định trước khi tiếp tục."; return true;
      }
      if (nativeBusy(scene, host, area, time)) return false;
      if (globalThis.GSTFarmBehavior?.pendingLoot?.(scene)) {
        release(); message = "Đang nhường nhặt đồ ở bãi vừa đánh trước khi tìm quái mới."; return false;
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
          yieldToNative(scene, time, blocker, "native_engaged");
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
      if (target.actor && distance <= handoffReach
          && (distance <= 2.2 || host.clear(scene.px, scene.py, target.x, target.y))) {
        yieldToNative(scene, time, target, "near_target");
        return false;
      }
      if (!job && globalThis.GSTChest?.ready(scene)) { message = "Nhường mở rương an toàn gần trước khi tìm bãi xa."; return false; }
      if (time < retryAt || job && time < job.retryUntil) {
        host.steer(0, 0); message = "Đang chờ nhịp thử lại đường tới bãi quái."; return true;
      }
      if (performance.now() - binding.modalAt >= 250) {
        binding.modalAt = performance.now();
        binding.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) => el.getClientRects().length
          && getComputedStyle(el).visibility !== "hidden");
      }
      if (binding.modal) { release(); return false; }
      if (!job || job.id !== target.id || job.actor !== target.actor) {
        if (job?.actor && target.actor && job.id !== target.id) {
          routeLog(scene, "target_switch", { fromId: job.id, toId: target.id,
            switchSource: "map", switchReason: target.switchReason || "target_unavailable" });
        }
        release();
        const navigation = Object.assign(Object.create(scene.auto), { path: [], lastX: scene.px, lastY: scene.py,
          stillSince: time, pathAt: -Infinity, stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0 });
        job = { id: target.id, actor: target.actor, scout: target.scout === true, x: target.x, y: target.y, navigation, castAt: scene.castAt, progressAt: time,
          startedAt: time, steer: null, retargetAt: time, replans: 0, lastReplanAt: -Infinity, retryUntil: 0,
          checkpoint: null, visited: [], directUntil: -Infinity, checkpointRetryAt: -Infinity };
        if (resumeReason) {
          routeLog(scene, "map_resume", { targetId: target.id,
            fromOwner: "native_farm_eligible", toOwner: "GSTFarmMap", handoffReason: resumeReason });
          resumeReason = null;
        }
      } else if (Math.hypot(job.x - target.x, job.y - target.y) > 3 && time - job.retargetAt >= 3) {
        // Keep the existing route when a moving monster shifts only a little.
        job.x = target.x; job.y = target.y; job.retargetAt = time;
        GSTNavigation.resetLeg(job);
        job.navigation.path = []; job.navigation.pathAt = -Infinity;
      }
      // Reaching a detour checkpoint is progress even if that leg initially
      // increases distance to the final camp behind a wall.
      const progressGoal = job.checkpoint ?? job;
      if (GSTNavigation.progressed(scene, job, job.navigation.path, progressGoal.x, progressGoal.y)) {
        job.progressAt = time;
        job.replans = 0; job.lastReplanAt = -Infinity;
      }
      const remaining = Math.hypot(scene.px - job.x, scene.py - job.y);
      if (time - job.progressAt > (remaining > 18 ? 6 : 4) || time - job.startedAt > 120) {
        if (time - job.startedAt > 120) {
          routeLog(scene, "map_stuck", { targetId: job.id, remaining,
            stuckMs: Math.max(0, (time - job.progressAt) * 1000),
            replanReason: "timeout", attempt: job.replans, action: "defer", retryMs: job.scout ? 60000 : 15000 });
          defer(time); message = "Đã theo đuổi quá lâu; tạm bỏ mục tiêu để xét bãi khác."; return false;
        }
        return recover(scene, host, time, "no_progress", remaining);
      }
      const owner = job;
      const bosses = bossObstacles(scene);
      if (bosses.length && owner.navigation.path.length) {
        const point = owner.navigation.path[0];
        if (Array.isArray(point) && point.length === 2 && point.every(finite)
            && !clearOfBoss({ x: scene.px, y: scene.py }, { x: point[0], y: point[1] }, bosses)) {
          owner.navigation.path = []; owner.navigation.pathAt = -Infinity;
          if (!Number.isFinite(owner.lastBossReplanAt) || time - owner.lastBossReplanAt >= 1) {
            owner.lastBossReplanAt = time;
            routeLog(scene, "map_replan", { targetId: owner.id,
              remaining: Math.hypot(scene.px - owner.x, scene.py - owner.y),
              stuckMs: Math.max(0, (time - owner.progressAt) * 1000),
              replanReason: "boss_blocked", attempt: owner.replans, action: "retry" });
          }
        }
      }
      owner.denied = false;
      const nearBossMetadata = !target.actor && !target.scout && distance <= 6;
      const next = !nearBossMetadata && (owner.checkpoint || distance > 2.2)
        ? checkpoint(scene, host, owner, area) : { x: owner.x, y: owner.y };
      if (owner.legArrived) {
        owner.progressAt = time;
        owner.replans = 0; owner.lastReplanAt = -Infinity;
      }
      // No reachable segment: count as a route failure instead of trying the
      // same blocked 14-unit hop indefinitely.
      if (!next) return recover(scene, host, time, "walk_failed", remaining);
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
      } else if (!target.actor && !target.scout && Math.hypot(scene.px - target.x, scene.py - target.y) <= 6) {
        walking.steer(0, 0); message = "Đã tới gần tọa độ boss; chờ game cung cấp actor boss để Auto Farm chọn mục tiêu.";
      } else if (!GSTNavigation.walk(scene, owner.navigation, walking, time, scene.px, scene.py, next.x, next.y,
          owner.checkpoint ? 0.8 : target.scout ? 1 : target.actor ? 1.8 : 5) || owner.denied) {
        return recover(scene, walking, time, owner.denied ? "blocked" : "walk_failed",
          Math.hypot(scene.px - owner.x, scene.py - owner.y));
      } else message = target.scout ? `Đang dò vùng mới tìm quái đúng bộ lọc · còn ${distance.toFixed(1)} ô.`
        : target.actor ? `Đang tới mục tiêu/bãi quái tiếp theo · còn ${distance.toFixed(1)} ô; tới gần sẽ dùng Auto Farm gốc đánh.`
        : "Đang tới tọa độ boss bí cảnh bằng đường đi gốc; chưa tự tấn công khi thiếu actor.";
      return true;
    } catch { release(); retryAt = finite(time) ? time + 15 : 0; message = "Dữ liệu đường tới mục tiêu chưa phù hợp; đã nhường lại game."; return false; }
  }
  function detach() {
    release(); const old = binding; binding = null;
    if (old) {
      old.remove(); old.removeScout(); detachHits(old.scene);
      old.scene.events.off("preupdate", guard);
      old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    }
    retryAt = 0; message = ""; deferred.clear(); explored.clear(); scanAt = 0; lastFix = undefined; correctionUntil = 0;
    resumeTarget = null; handoff = null; resumeReason = null; centerSync = null;
  }
  function attach(scene) {
    if (!wanted(scene) || suspended) { detach(); return; }
    if (binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.walk !== "function" || typeof scene.now !== "function"
        || typeof scene.views?.values !== "function" || !scene.events?.on || !scene.events.off) return;
    binding = { scene, auto: scene.auto, remove: GSTFarmUpdate.add(scene, 4, (host, time) => update(host, time)),
      removeScout: GSTFarmUpdate.add(scene, 25, (host, time) => update(host, time, true)),
      modalAt: -Infinity, modal: false, lastHit: null, handledHit: null, hitSequence: 0 };
    attachHits(scene);
    scene.events.on("preupdate", guard); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmMap = {
    configure(scene, value) { detach(); preferences = value; this.attach(scene); },
    attach(scene) { try { attach(scene); } catch { detach(); } },
    // Exploration has lower priority than portals/chests/harvest. It must not
    // advertise a lock that prevents those earlier handlers from starting.
    controls: (scene) => !!binding && binding.scene === scene && job !== null && !job.scout,
    nativeHandling: (scene) => !!binding && binding.scene === scene && !!scene?.auto?.on && handoff !== null,
    consumeCenter(scene) {
      if (binding?.scene !== scene) return null;
      const aligned = centerSync;
      centerSync = null;
      return aligned;
    },
    pauseForLoot(scene) {
      if (!binding || binding.scene !== scene || !job) return;
      if (job?.actor) resumeReason = "loot_priority";
      release(); endHandoff("loot_priority"); retryAt = scene.now() + 0.3;
    },
    journey: (scene) => binding?.scene === scene && job ? {
      id: job.id, x: job.x, y: job.y, scout: job.scout, path: job.navigation.path,
      next: job.checkpoint ? { ...job.checkpoint } : null,
      waiting: scene.now() < retryAt || scene.now() < job.retryUntil
    } : null,
    status: (scene) => binding && binding.scene === scene && scene.auto.on ? message : ""
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmMap.attach(sceneNow()); });
})();
