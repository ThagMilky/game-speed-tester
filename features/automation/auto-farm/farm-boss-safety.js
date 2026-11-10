(() => {
  "use strict";
  // Boss-only safety. Native Auto Farm remains responsible for combat, pills and paths.
  const finite = Number.isFinite, distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const log = [], logKey = "gst:boss-safety:v1", threshold = 0.3, recovered = 0.4;
  // Keep a bounded record through same-tab reloads (no packet, URL or account data).
  try {
    const rows = JSON.parse(sessionStorage.getItem(logKey) ?? "[]");
    const allowed = ["pill", "retreat", "resume", "hazard", "kite", "no_route", "unsupported",
      "dash", "dash_result", "flight_drop", "cooldown_wait", "boss_cast"];
    if (Array.isArray(rows)) log.push(...rows.slice(-30).filter((row) => allowed.includes(row?.type)
      && typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at))
      .map((row) => ({ at: row.at, type: row.type,
        hp: finite(row.hp) ? Math.max(0, Math.min(1, row.hp)) : null,
        position: Array.isArray(row.position) && row.position.length === 2 && row.position.every(finite)
          ? row.position.map((v) => Math.max(-1e6, Math.min(1e6, v))) : null,
        cooldown: finite(row.cooldown) ? Math.max(0, Math.min(86400, row.cooldown)) : null,
        direction: Array.isArray(row.direction) && row.direction.length === 2 && row.direction.every(finite)
          ? row.direction.map((v) => Math.max(-1, Math.min(1, v))) : null,
        distance: finite(row.distance) ? Math.max(0, Math.min(1000, row.distance)) : null,
        flying: row.flying === true })));
  } catch { /* Optional log, never influence Auto Farm. */ }
  let settings = {}, binding = null, job = null, retreating = false, suspended = false;
  let retryAt = 0, message = "", noteUntil = 0, lastDashAt = -Infinity, dashObservation = null;
  let visibleWarnings = [], cooldownHolding = false;
  const warningHooks = new WeakMap();
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  function note(scene, type, text, extra = {}) {
    message = text; noteUntil = performance.now() + 2500;
    if (!scene || type === null) return;
    log.push({ at: new Date().toISOString(), type, hp: finite(scene.self?.hp) && finite(scene.self?.mh) && scene.self.mh > 0
      ? Math.round(scene.self.hp / scene.self.mh * 1000) / 1000 : null,
      position: [scene.px, scene.py].every(finite) ? [scene.px, scene.py].map((n) => Math.round(n * 100) / 100) : null,
      cooldown: finite(extra.cooldown) ? Math.round(Math.max(0, extra.cooldown) * 10) / 10 : null,
      direction: Array.isArray(extra.direction) && extra.direction.length === 2 && extra.direction.every(finite)
        ? extra.direction.map((n) => Math.round(Math.max(-1, Math.min(1, n)) * 1000) / 1000) : null,
      distance: finite(extra.distance) ? Math.round(Math.max(0, extra.distance) * 100) / 100 : null,
      flying: extra.flying === true });
    if (log.length > 30) log.shift();
    try { sessionStorage.setItem(logKey, JSON.stringify(log)); } catch { /* Optional diagnostics. */ }
  }
  function release() {
    const old = job; job = null;
    if (!old || !binding) return;
    GSTNavigation.cancel(binding.scene, old.navigation);
    if (old.steer && binding.scene.autoX === old.steer[0] && binding.scene.autoY === old.steer[1]) {
      binding.scene.autoX = 0; binding.scene.autoY = 0;
    }
  }
  function enabled(scene = binding?.scene) {
    // Native Auto Farm can select a live boss even in "all" target mode.
    const activeBoss = scene?.auto?.on === true
      && bossActor(scene.views?.get?.(scene.auto.target));
    const bossMode = ["boss", "bossLevel"].includes(settings.targetMode)
      || globalThis.GSTRealm?.seekBoss?.(scene) === true || activeBoss;
    // Seals can be attacked with any farm target filter. Their hazard warnings
    // still need the same safety owner, without enabling routine boss kiting.
    const sealThreat = settings.bossDodge && globalThis.GSTFarmSeals?.pending?.(scene);
    return (bossMode && (settings.bossDodge || settings.bossRetreat)) || !!sealThreat;
  }
  function connected(scene) {
    const d = scene.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  }
  function blocked(scene, imminent = false) {
    return suspended || !scene?.auto?.on || !scene.self || scene.self.dead || scene.leaving
      || !scene.sys?.isActive?.() || !connected(scene) || GSTFarmRouting.blocked(scene)
      || GSTFarmInput.movement(scene) || scene.auto.moved || scene.now() < scene.auto.pauseUntil
      // Pending native casts/aim are handled after reading danger zones in
      // update(): an imminent boss hit must not be silently ignored.
      || scene.heldAttack || scene.harvesting
      || scene.auto.resting || scene.self.med || scene.self.fish || scene.keyCapture
      // Let the native Auto Farm drink pills before considering boss movement.
      || (!imminent && globalThis.GSTMapTravel?.active?.(scene)
        && globalThis.GSTHarvest?.needsRecovery?.(scene))
      || globalThis.GSTQuest?.active?.(scene)
      || ["GSTRealm", "GSTChest", "GSTHarvest"].some((name) => globalThis[name]?.controls?.(scene))
      || (scene.self.realm?.inside?.protection ?? 0) > 0;
  }
  const bossActor = (actor) => actor?.k === "m" && !actor.dead
    && (actor.st?.cls === "boss" || actor.st?.wb === true)
    && finite(actor.x) && finite(actor.y);
  function nearbyBoss(scene, pos) {
    const current = scene.views?.get?.(scene.auto.target);
    if (bossActor(current) && distance(pos, current) < 12) return current;
    const meta = scene.self?.realm?.inside?.boss;
    // Combat with an ordinary monster must not make a distant realm boss
    // count as a nearby threat, even during an existing retreat.
    if (finite(meta?.hp) && meta.hp > 0 && finite(meta.x) && finite(meta.y)
        && distance(pos, meta) < 12) return meta;
    // While following a map destination, detect nearby bosses even outside combat.
    // This supports both low-HP retreat and warnings outside the normal farm circle.
    if (!scene.self.combat && !globalThis.GSTMapTravel?.active?.(scene)) return null;
    return [...(scene.views?.values?.() ?? [])].filter(bossActor)
      .sort((a, b) => distance(a, pos) - distance(b, pos)).find((actor) => distance(actor, pos) < 12) ?? null;
  }
  function zone(scene) {
    const w = scene.map?.w, h = scene.map?.h;
    // The farm circle is not the safe-movement boundary for an explicit map journey.
    // Keep the native map edges and collision/path checks for emergency escapes.
    if (globalThis.GSTMapTravel?.active?.(scene))
      return finite(w) && finite(h) && w > 0 && h > 0
        ? { w, h, home: { x: scene.px, y: scene.py }, radius: Infinity } : null;
    const wholeMap = settings.enabled && settings.searchScope === "map";
    const radius = wholeMap ? Infinity : settings.enabled ? settings.radius
      : globalThis.GSTFarmCompatibility?.nativeRadius(scene.auto?.radius) ?? null;
    const home = GSTHarvest.farmOrigin(scene) ?? { x: scene.auto.ax, y: scene.auto.ay };
    if (![w, h, home.x, home.y].every(finite) || w <= 0 || h <= 0
        || !wholeMap && (!finite(radius) || radius < 1)) return null;
    // Ordinary radius farming stays inside its circle. An explicit realm
    // boss/seal objective may travel beyond it; only then use map boundaries
    // for emergency dodges rather than disabling safety outside the circle.
    const realmObjective = globalThis.GSTRealm?.seekBoss?.(scene) === true
      || globalThis.GSTFarmSeals?.pending?.(scene) === true;
    const outsideFarmCircle = !wholeMap && distance({ x: scene.px, y: scene.py }, home) > radius;
    return { w, h, home, radius: wholeMap || (realmObjective && outsideFarmCircle) ? Infinity : radius };
  }
  function inside(zone, pos) {
    return finite(pos?.x) && finite(pos?.y) && pos.x >= 0 && pos.y >= 0
      && pos.x < zone.w && pos.y < zone.h && distance(pos, zone.home) <= zone.radius;
  }
  // Client warnings use local monotonic seconds. Server realm hazards use
  // offset-adjusted server time. Neither source is treated as verified damage.
  function hazardZones(scene, time) {
    visibleWarnings = visibleWarnings.filter((area) => area.until > time - 0.1);
    const raw = scene.self?.realm?.inside?.hazards;
    if (!Array.isArray(raw) || !finite(scene.clockOffset)
        || !finite(scene.selfAt) || time - scene.selfAt > 3) return [...visibleWarnings];
    const serverNow = performance.now() / 1000 + scene.clockOffset;
    const realms = raw.filter((area) => [area.x, area.y, area.radius, area.at, area.until].every(finite)
      && area.radius > 0 && area.radius < 20 && area.until >= serverNow - 0.15
      && area.at <= serverNow + 2.2 && area.until > area.at)
      .map((area) => ({ x: area.x, y: area.y, radius: area.radius,
        at: time + area.at - serverNow, until: time + area.until - serverNow }));
    return [...realms, ...visibleWarnings];
  }
  function imminentWarning(scene, time) {
    return settings.bossDodge && finite(time) && finite(scene?.px) && finite(scene?.py)
      && finite(scene?.selfAt) && time - scene.selfAt <= 3
      && hazardZones(scene, time).some((area) =>
        distance(area, { x: scene.px, y: scene.py }) <= area.radius + 0.8
        && area.at <= time + 0.42 && area.until >= time);
  }
  function criticalRetreat(scene) {
    if (!settings.bossRetreat || !scene?.self || !finite(scene.px) || !finite(scene.py)
        || !finite(scene.self.hp) || !finite(scene.self.mh) || scene.self.mh <= 0
        || scene.self.hp / scene.self.mh >= (retreating ? recovered : threshold)
        || !nearbyBoss(scene, { x: scene.px, y: scene.py })) return false;
    // When native meditation is intentionally enabled and no pills remain,
    // let the game's own resting logic handle the situation instead.
    if (settings.noRetreat === false) {
      const pills = scene.autoHost?.()?.pills?.("hp");
      if (Array.isArray(pills) && pills.every((count) => count === 0)) return false;
    }
    return true;
  }
  function urgentEscape(scene, time) {
    return imminentWarning(scene, time)
      || (settings.bossDodge && job?.emergency === true && finite(time)
        && time - job.startedAt < 6) || criticalRetreat(scene);
  }
  function emergency(scene, time) {
    const urgent = urgentEscape(scene, time);
    if (!binding || binding.scene !== scene || binding.auto !== scene?.auto
        || !enabled() || !finite(time) || blocked(scene, urgent)
        || !finite(scene.px) || !finite(scene.py)
        || !finite(scene.selfAt) || time - scene.selfAt > 3) return false;
    const pos = { x: scene.px, y: scene.py }, bounds = zone(scene);
    if (!bounds || !inside(bounds, pos)) return false;
    // An imminent warning, a bounded escape route, or critical HP beside a boss
    // keeps the safety owner active. Its retreat uses the game's native HP pills.
    if (urgent) return true;
    // Ordinary recovery stays with the native game; future warnings can wait.
    if (globalThis.GSTHarvest?.needsRecovery?.(scene)) return false;
    return settings.bossDodge && hazardZones(scene, time).some((area) =>
      distance(area, pos) <= area.radius + 0.8 && area.at <= time + 2.2 && area.until >= time);
  }
  function rememberWarning(scene, x, y, radius, seconds, source) {
    if (!settings.bossDodge || !scene?.auto?.on
        || ![x, y, radius, seconds].every(finite) || radius <= 0 || radius >= 20
        || seconds <= 0 || seconds > 5) return false;
    const time = scene.now(), pos = { x: scene.px, y: scene.py };
    const boss = nearbyBoss(scene, pos);
    const sealWarning = globalThis.GSTFarmSeals?.pending?.(scene)
      && distance(pos, { x, y }) < 8;
    if (!finite(time) || !(boss && distance(boss, { x, y }) <= 14) && !sealWarning) return false;
    const existing = visibleWarnings.find((area) => distance(area, { x, y }) < 0.3
      && Math.abs(area.radius - radius) < 0.3 && area.until > time);
    if (existing) existing.until = Math.max(existing.until, time + seconds);
    else visibleWarnings.push({ x, y, radius, at: time, until: time + seconds, source });
    if (visibleWarnings.length > 16) visibleWarnings.splice(0, visibleWarnings.length - 16);
    return true;
  }
  // Native Auto Farm owns all attacks. Count only real slotted attack
  // cooldowns, excluding global animation/skill lock so a just-cast skill
  // does not trigger an unnecessary Q while another attack is ready.
  function offensiveCooldownGap(scene, host, time) {
    if (!settings.bossDodge || !finite(scene.selfAt) || time - scene.selfAt > 3
        || typeof host.skills !== "function" || typeof host.kit !== "function") return false;
    const slots = host.skills();
    if (!Array.isArray(slots)) return false;
    let attacks = 0;
    for (const slot of slots) {
      if (typeof slot !== "string" || !/^[1-6]$/.test(slot)) continue;
      const kit = host.kit(slot);
      if (!kit || !finite(kit.dmg) || kit.dmg <= 0) continue;
      attacks++;
      const local = (scene.cdLocal?.[slot] ?? 0) - time;
      const server = (scene.self?.cd?.[slot] ?? 0) - Math.max(0, time - scene.selfAt);
      if (![local, server].every(finite) || Math.max(local, server) <= 0.22) return false;
    }
    return attacks > 0;
  }
  function segmentDistance(point, from, to) {
    const dx = to.x - from.x, dy = to.y - from.y, len = dx * dx + dy * dy;
    const t = len ? Math.max(0, Math.min(1, ((point.x - from.x) * dx + (point.y - from.y) * dy) / len)) : 0;
    return Math.hypot(from.x + dx * t - point.x, from.y + dy * t - point.y);
  }
  function clearOfHazards(start, end, hazards) {
    return hazards.every((area) => {
      const radius = area.radius + 0.6, current = distance(start, area), destination = distance(end, area);
      if (current < radius) {
        // An endpoint farther away is not enough: the segment could cross
        // the center of the warning before exiting on the other side.
        const outward = (start.x - area.x) * (end.x - start.x)
          + (start.y - area.y) * (end.y - start.y);
        return outward >= 0 && destination > current + 0.15;
      }
      return segmentDistance(area, start, end) >= radius;
    });
  }
  function pathSafe(scene, start, points, zone, hazards) {
    if (!Array.isArray(points) || !points.length || points.length > 40) return false;
    let prior = start, length = 0;
    for (const coords of points) {
      if (!Array.isArray(coords) || coords.length < 2 || !coords.slice(0, 2).every(finite)) return false;
      const point = { x: coords[0], y: coords[1] };
      length += distance(prior, point);
      if (length > 20 || !inside(zone, point) || !clearOfHazards(prior, point, hazards)) return false;
      prior = point;
    }
    return true;
  }
  function destination(scene, host, pos, boss, hazards, lowHp, zone) {
    const danger = hazards.filter((area) => distance(area, pos) <= area.radius + 1);
    const origin = danger[0] ?? boss;
    const baseAngle = origin ? Math.atan2(pos.y - origin.y, pos.x - origin.x) : 0;
    const steps = lowHp ? [3, 5, 7, 9] : [1.5, 2.5, 3.5, 5, 7];
    const candidates = [];
    const bossRange = boss ? distance(pos, boss) : 0;
    if (!lowHp && boss && bossRange > 1) {
      // Move along a short arc around the boss first, keeping attack range
      // instead of retreating in a straight line for every small warning.
      const angle = Math.atan2(pos.y - boss.y, pos.x - boss.x);
      for (const step of steps) for (const side of [-1, 1]) {
        const nextAngle = angle + side * step / bossRange;
        candidates.push({ point: {
          x: boss.x + Math.cos(nextAngle) * bossRange,
          y: boss.y + Math.sin(nextAngle) * bossRange
        }, orbit: true });
      }
    }
    for (const step of steps) for (const turn of [Math.PI / 2, -Math.PI / 2, 0, 0.6, -0.6, 1.2, -1.2, Math.PI]) {
      const angle = baseAngle + turn;
      candidates.push({ point: {
        x: pos.x + Math.cos(angle) * step,
        y: pos.y + Math.sin(angle) * step
      }, orbit: false });
    }
    let best = null, score = Infinity;
    for (const candidate of candidates) {
      const point = candidate.point;
      if (!inside(zone, point) || hazards.some((area) => distance(area, point) <= area.radius + 0.7)) continue;
      if (lowHp && boss && distance(point, boss) < Math.max(7, bossRange + 0.5)) continue;
      if (!lowHp && boss && distance(point, boss) < Math.max(2, bossRange - 0.5)) continue;
      const route = host.clear(pos.x, pos.y, point.x, point.y)
        ? [[point.x, point.y]] : host.route(pos.x, pos.y, point.x, point.y);
      if (!pathSafe(scene, pos, route, zone, hazards)) continue;
      const length = route.reduce((total, waypoint, index) => {
        const before = index ? { x: route[index - 1][0], y: route[index - 1][1] } : pos;
        return total + distance(before, { x: waypoint[0], y: waypoint[1] });
      }, 0);
      const radialDrift = !lowHp && boss ? Math.abs(distance(point, boss) - bossRange) : 0;
      const value = length + radialDrift * 1.2 + (candidate.orbit ? 0 : 0.35);
      if (value < score) { score = value; best = { point, path: route }; }
    }
    return best;
  }
  function observeDash(scene, time) {
    if (!dashObservation || !finite(scene?.px) || !finite(scene?.py)) return;
    const previous = dashObservation;
    if (time - previous.time < 0.35 || (finite(scene.dashT) && scene.dashT > 0)) return;
    dashObservation = null;
    const travelled = distance({ x: scene.px, y: scene.py }, previous.position);
    note(scene, "dash_result", "Q đã kết thúc; ghi lại quãng lướt và trạng thái bay.",
      { distance: travelled, direction: previous.direction, flying: scene.self?.fly === true });
    if (previous.flying && scene.self?.fly === false) {
      note(scene, "flight_drop", "Game báo đã mất trạng thái bay sau lần lướt Q.",
        { distance: travelled, direction: previous.direction });
    }
  }
  function tryDash(scene, host, time, pos, bounds, hazards, target, boss, lowHp) {
    // Q is reserved for an imminent hazard, not ordinary attack cooldowns.
    // Never synthesize key events.
    if (!settings.bossDodge || typeof scene.useSkill !== "function"
        || time - lastDashAt < 0.75 || (finite(scene.dashT) && scene.dashT > 0)
        || !finite(scene.faceX) || !finite(scene.faceY)
        || (scene.cdLocal?.Q ?? -Infinity) > time
        || (scene.self?.cd?.Q ?? 0) - Math.max(0, time - scene.selfAt) > 0.08
        || scene.self?.fx?.includes?.("r") || scene.self?.fx?.includes?.("s")) return false;
    const imminent = hazards.filter((area) => distance(pos, area) <= area.radius + 0.8
      && area.at - time <= 0.42 && area.until >= time);
    if (!imminent.length) return false;
    const closest = imminent.sort((a, b) => distance(pos, a) - distance(pos, b))[0];
    const outwardAngle = Math.atan2(pos.y - closest.y, pos.x - closest.x);
    const bossAngle = boss ? Math.atan2(pos.y - boss.y, pos.x - boss.x) : outwardAngle;
    const goalAngle = target ? Math.atan2(target.point.y - pos.y, target.point.x - pos.x) : null;
    const angles = [bossAngle + Math.PI / 2, bossAngle - Math.PI / 2,
      outwardAngle + Math.PI / 2, outwardAngle - Math.PI / 2,
      outwardAngle + Math.PI / 4, outwardAngle - Math.PI / 4,
      outwardAngle, goalAngle].filter(finite);
    let best = null, score = -Infinity;
    for (const angle of angles) {
      const direction = [Math.cos(angle), Math.sin(angle)];
      // Source snapshot: class Q dash is <= 2.04 cells. Use 2.4 cells
      // as a conservative collision/zone preview, not just the old 1.9.
      // A circular farm zone is convex: a safe segment stays inside it.
      const preview = { x: pos.x + direction[0] * 2.4, y: pos.y + direction[1] * 2.4 };
      const shortEnd = { x: pos.x + direction[0] * 1.75, y: pos.y + direction[1] * 1.75 };
      if (!inside(bounds, preview) || !inside(bounds, shortEnd)
          || !host.clear(pos.x, pos.y, preview.x, preview.y)
          || !clearOfHazards(pos, preview, hazards)
          || imminent.some((area) => distance(shortEnd, area) <= area.radius + 0.3)
          || (lowHp && boss && distance(shortEnd, boss) < distance(pos, boss) - 0.1)) continue;
      const progress = distance(preview, closest) - distance(pos, closest);
      if (progress < 0.2) continue;
      const clearance = Math.min(...hazards.map((area) => distance(preview, area) - area.radius));
      const radialDrift = !lowHp && boss
        ? Math.abs(distance(preview, boss) - distance(pos, boss)) : 0;
      const candidate = Math.min(clearance, 3) * 0.6 + Math.min(progress, 2) * 0.25
        - radialDrift * 1.2 + (goalAngle === angle ? 0.1 : 0);
      if (candidate > score) { best = direction; score = candidate; }
    }
    if (!best) return false;
    const oldDash = scene.dashT, oldCooldown = scene.cdLocal?.Q;
    const oldFace = [scene.faceX, scene.faceY], flying = scene.self.fly === true;
    scene.faceX = best[0]; scene.faceY = best[1];
    // The third arg disables the game's manual-input cancellation. Auto Farm owns this frame.
    scene.useSkill("Q", false, false);
    const accepted = (finite(scene.dashT) && scene.dashT > 0 && scene.dashT !== oldDash)
      || (finite(scene.cdLocal?.Q) && scene.cdLocal.Q > time + 0.1 && scene.cdLocal.Q !== oldCooldown);
    if (!accepted) {
      scene.faceX = oldFace[0]; scene.faceY = oldFace[1];
      return false;
    }
    release();
    lastDashAt = time;
    retryAt = time + 0.3;
    dashObservation = { time, position: { ...pos }, direction: best, flying };
    note(scene, "dash", "Đã dùng Q để thoát vùng cảnh báo sắp trúng.",
      { direction: best, flying, cooldown: scene.self.cd?.Q });
    return true;
  }
  function drinkIfReady(scene, host, time, hp) {
    const pills = host.pills?.("hp");
    if (!Array.isArray(pills) || pills.length < 2 || !pills.slice(0, 2).every(finite)
        || pills[0] + pills[1] <= 0 || typeof host.pillWait !== "function"
        || typeof scene.auto.wait !== "function" || typeof scene.auto.drink !== "function") return false;
    const cd = scene.auto.wait(host, "hp", time);
    if (!finite(cd) || cd > 0 || !(time > scene.auto.pillAt)) return false;
    // Native selection and native pill action; no invented cooldown or duplicate input.
    scene.auto.drink(host, "hp", pills, hp, time);
    note(scene, "pill", "Đang dùng đan HP bằng cơ chế gốc.");
    return true;
  }
  function update(host, time) {
    const scene = binding?.scene;
    try {
      cooldownHolding = false;
      if (scene && finite(time)) observeDash(scene, time);
      const urgent = scene && urgentEscape(scene, time);
      if (!scene || !enabled() || blocked(scene, urgent) || !finite(time)
          || !["steer", "route", "clear", "hp", "pills"].every((key) => typeof host?.[key] === "function")) {
        release(); retreating = false; return false;
      }
      const pos = { x: scene.px, y: scene.py }, bounds = zone(scene);
      if (!bounds || !inside(bounds, pos) || !finite(scene.self.hp) || !finite(scene.self.mh) || scene.self.mh <= 0
          || !finite(scene.selfAt) || scene.now() - scene.selfAt > 3) {
        release(); retreating = false; return false;
      }
      if (finite(scene.dashT) && scene.dashT > 0) return true; // Let native Q finish before choosing another movement.
      const boss = nearbyBoss(scene, pos), hp = scene.self.hp / scene.self.mh;
      const hazards = settings.bossDodge ? hazardZones(scene, time) : [];
      const danger = hazards.some((area) => distance(area, pos) <= area.radius + 0.8
        && area.at <= time + 0.75 && area.until >= time);
      if (job && danger) job.emergency = true;
      // A pending realm seal owns combat before the boss. Keep urgent hazard
      // dodging and low-HP retreat, but do not kite/spam Q solely for the boss
      // while the seal handler is trying to approach and break seals.
      const cooling = !globalThis.GSTFarmSeals?.pending?.(scene)
        && !!boss && offensiveCooldownGap(scene, host, time);
      const gapDistance = boss ? distance(pos, boss) : Infinity;
      // Only make a short spacing adjustment if the boss is almost touching us.
      // Waiting for attack cooldown alone must not trigger a long kite/Q dash.
      const cooldownKite = cooling && gapDistance < 4;
      if (settings.bossRetreat && !retreating && boss && hp < threshold) {
        retreating = true;
        note(scene, "retreat", "HP dưới 30%; ưu tiên giữ khoảng cách và chờ đan HP.",
          { cooldown: typeof host.pillWait === "function" ? host.pillWait("hp") : null });
      }
      if (retreating && (hp >= recovered || !boss)) {
        retreating = false; release(); note(scene, "resume", "HP đã hồi an toàn hoặc boss không còn; tiếp tục Auto Farm.");
        return false;
      }
      // Do not interfere with normal native casting/aiming, but prioritize
      // movement out of a confirmed/estimated imminent warning, or a
      // critical low-HP retreat, over continuing that cast in place.
      if ((scene.pendingSkill || scene.aiming) && !danger && !retreating) {
        release();
        return false;
      }
      // When even one attack skill is available, immediately hand combat
      // back to native castSkills(). Do not add a second skill-spam engine.
      if (!danger && !retreating && !cooldownKite) { release(); return false; }
      if (retreating && host.pills("hp")?.every((n) => n === 0) && settings.noRetreat === false) {
        release(); retreating = false; return false; // Hand back native resting when pills are exhausted.
      }
      if (retreating) drinkIfReady(scene, host, time, hp);
      if (retreating && !danger && boss && distance(pos, boss) >= 8) {
        release(); host.steer(0, 0);
        const cd = typeof host.pillWait === "function" ? host.pillWait("hp") : null;
        const pills = host.pills("hp");
        const empty = Array.isArray(pills) && pills.slice(0, 2).every((n) => n === 0);
        if (performance.now() > noteUntil) note(scene, null, empty
          ? "Hết đan HP; đang cố giữ khoảng cách với boss."
          : finite(cd) && cd > 0 ? `Đang giữ khoảng cách; đan HP còn hồi ${cd.toFixed(1)} giây.`
            : "Đang giữ khoảng cách với boss để hồi HP.");
        return true;
      }
      if ((danger || cooldownKite) && settings.bossDodge) {
        const escape = job && inside(bounds, job.point) ? job : null;
        if (danger && tryDash(scene, host, time, pos, bounds, hazards, escape, boss,
          retreating)) return true;
      }
      if (job && (!inside(bounds, job.point) || hazards.some((area) => distance(area, job.point) <= area.radius + 0.7)
          || !pathSafe(scene, pos, job.navigation.path.length ? job.navigation.path : [[job.point.x, job.point.y]], bounds, hazards)
          || (retreating && boss && distance(job.point, boss) < 7))) release();
      if (!job && time >= retryAt) {
        const next = destination(scene, host, pos, boss, hazards, retreating, bounds);
        if (next) {
          const navigation = Object.assign(Object.create(scene.auto), { path: next.path.slice(),
            goalX: next.point.x, goalY: next.point.y, pathAt: time, lastX: pos.x, lastY: pos.y,
            stillSince: time, sideUntil: 0, sideX: 0, sideY: 0, stuckCount: 0 });
          job = { ...next, navigation, startedAt: time, progressAt: time,
            steer: null, emergency: danger };
          note(scene, danger ? "hazard" : "kite",
            danger ? "Đang thoát vòng cảnh báo boss."
              : retreating ? "Đang lùi xa boss khi HP thấp."
                : "Skill tấn công đang hồi; đang giữ khoảng cách chờ hồi.");
        } else {
          retryAt = time + 1.5;
          if (performance.now() > noteUntil) note(scene, "no_route", "Không có đường né boss an toàn trong vùng farm.");
        }
      }
      if (!job) {
        cooldownHolding = cooldownKite;
        host.steer(0, 0); return true;
      }
      const owner = job;
      if (GSTNavigation.progressed(scene, owner, owner.navigation.path, owner.point.x, owner.point.y, 0.3)) owner.progressAt = time;
      if (distance(pos, owner.point) < 0.7 || time - owner.progressAt > 3 || time - owner.startedAt > 6) {
        release(); retryAt = time + 0.5; host.steer(0, 0); return true;
      }
      const walking = { ...host,
        clear: (x, y, gx, gy) => host.clear(x, y, gx, gy)
          && inside(bounds, { x: gx, y: gy }) && clearOfHazards({ x, y }, { x: gx, y: gy }, hazards),
        route: (x, y, gx, gy) => {
          const route = host.route(x, y, gx, gy);
          return pathSafe(scene, { x, y }, route, bounds, hazards) ? route : null;
        },
        steer: (x, y) => {
          const next = { x: pos.x + x * 0.25, y: pos.y + y * 0.25 };
          if (!finite(x) || !finite(y) || !inside(bounds, next)
              || !clearOfHazards(pos, next, hazards)) {
            owner.denied = true; x = 0; y = 0;
          }
          scene.autoX = x; scene.autoY = y;
          if (job === owner) owner.steer = [x, y];
        }
      };
      owner.denied = false;
      if (!GSTNavigation.walk(scene, owner.navigation, walking, time, pos.x, pos.y,
          owner.point.x, owner.point.y, 0.5) || owner.denied) {
        release(); retryAt = time + 1.5; host.steer(0, 0);
      }
      return true;
    } catch {
      release(); retreating = false; note(scene, "unsupported", "Dữ liệu né boss không phù hợp; đã nhường Auto Farm.");
      return false;
    }
  }
  function guard() {
    const scene = binding?.scene;
    if (!scene) return;
    if (sceneNow() !== scene || binding.auto !== scene.auto || !scene.sys?.isActive?.()) { detach(); return; }
    const time = scene.now(), imminent = imminentWarning(scene, time);
    if (blocked(scene, imminent || criticalRetreat(scene))) { release(); retreating = false; cooldownHolding = false; return; }
    // WorldScene skips auto.update while aiming or waiting to cast. Only an
    // imminent boss warning may interrupt that state, from this existing
    // preupdate guard; ordinary dodge/movement still uses GSTFarmUpdate.
    if ((!scene.aiming && !scene.pendingSkill) || !settings.bossDodge
        || (finite(scene.dashT) && scene.dashT > 0)) return;
    if (!imminent) return;
    const pos = { x: scene.px, y: scene.py }, bounds = zone(scene);
    if (!bounds || !inside(bounds, pos)) return;
    const hazards = hazardZones(scene, time);
    const host = scene.autoHost?.();
    if (!host || typeof host.clear !== "function" || typeof host.route !== "function") return;
    const boss = nearbyBoss(scene, pos);
    // Q is the game's native dash and can run before auto.update resumes.
    if (tryDash(scene, host, time, pos, bounds, hazards, null, boss, false)) {
      // Native Q with the no-manual-cancel argument leaves pendingSkill intact.
      // Cancel that queued cast after a successful emergency dash, too.
      if (scene.aiming && typeof scene.cancelAim === "function") scene.cancelAim();
      if (scene.pendingSkill) scene.pendingSkill = null;
      return;
    }
    // With Q unavailable, interrupt the aimed/queued cast to allow normal dodge.
    if (scene.aiming && typeof scene.cancelAim === "function") scene.cancelAim();
    if (scene.pendingSkill) scene.pendingSkill = null;
  }
  function restoreWarnings(scene) {
    const hooks = warningHooks.get(scene);
    for (const [name, saved] of hooks ?? []) {
      if (scene[name] !== saved.wrapper) continue;
      if (saved.descriptor) Object.defineProperty(scene, name, saved.descriptor);
      else delete scene[name];
      hooks.delete(name);
    }
  }
  function detach() {
    release(); retreating = false; retryAt = 0; dashObservation = null;
    visibleWarnings = []; cooldownHolding = false;
    const old = binding; binding = null;
    if (!old) return;
    // Another module may currently own the top onEvent wrapper.
    restoreWarnings(old.scene);
    old.remove(); old.scene.events.off("preupdate", guard);
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    // On a configuration change, farm-behavior may remove its outer wrapper
    // later in the same task. Restore the now-exposed hook when disabled.
    queueMicrotask(() => { if (binding?.scene !== old.scene) restoreWarnings(old.scene); });
  }
  function watchWarnings(owner) {
    const scene = owner.scene;
    let hooks = warningHooks.get(scene);
    if (!hooks) { hooks = new Map(); warningHooks.set(scene, hooks); }
    function observe(name, handler) {
      // An earlier hook can be nested inside another module's wrapper.
      // Reuse it rather than stacking another hook on each configuration.
      if (hooks.has(name)) return;
      const original = scene[name];
      if (typeof original !== "function") return;
      const descriptor = Object.getOwnPropertyDescriptor(scene, name);
      const wrapped = function (...args) {
        if (binding?.scene === scene && enabled()) {
          try { handler(args); } catch { /* Warnings must not disrupt native visual effects. */ }
        }
        return original.apply(this, args);
      };
      try {
        scene[name] = wrapped;
        if (scene[name] !== wrapped) return;
        hooks.set(name, { wrapper: wrapped, descriptor });
      } catch { /* Unsupported game implementation: continue with realm hazards only. */ }
    }
    // A native circle warning, if the live game actually calls this method.
    observe("telegraph", ([x, y, radius, seconds]) => {
      rememberWarning(scene, x, y, radius, seconds, "telegraph");
    });
    // The supplied snapshot also reports cast events. For a nearby boss
    // with explicit aim coordinates, treat a small radius as a *cautious
    // estimate*, not an exact server-declared hit area.
    observe("onEvent", ([event]) => {
      if (event?.e !== "cast" || !finite(event.ax) || !finite(event.ay)) return;
      const caster = scene.views?.get?.(event.id);
      const playerPos = { x: scene.px, y: scene.py };
      const isBoss = bossActor(caster);
      const sealMonster = globalThis.GSTFarmSeals?.pending?.(scene)
        && caster?.k === "m" && !caster.dead && caster.st?.cls !== "pet"
        && finite(caster.x) && finite(caster.y)
        && distance(caster, playerPos) <= 11
        && event.key !== "Q" && event.key !== "Space";
      if ((!isBoss && !sealMonster) || (isBoss && !scene.self?.combat
          && scene.auto?.target !== caster.id && !globalThis.GSTMapTravel?.active?.(scene)
          && !globalThis.GSTFarmSeals?.pending?.(scene))
          || distance(playerPos, { x: event.ax, y: event.ay }) > 7) return;
      // Ordinary monster cast locations are only cautious estimates; real
      // realm.hazards remain the preferred authoritative zone source.
      const radius = isBoss ? 3.5 : 2.3;
      if (rememberWarning(scene, event.ax, event.ay, radius, 0.9, "cast_estimate")
          && performance.now() > noteUntil)
        note(scene, "boss_cast", "Phát hiện cảnh báo chiêu gần nhân vật; đang ưu tiên thoát vùng nguy hiểm.");
    });
  }
  function attach(scene) {
    if (!enabled(scene) || suspended || !scene?.auto) { detach(); return; }
    if (binding?.scene === scene && binding.auto === scene.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.update !== "function" || !scene.events?.on
        || !scene.events.off || typeof scene.auto?.walk !== "function") return;
    const owner = { scene, auto: scene.auto, remove: GSTFarmUpdate.add(scene, 1.5, update) };
    binding = owner;
    watchWarnings(owner);
    scene.events.on("preupdate", guard);
    scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmBossSafety = {
    configure(scene, value) {
      settings = { targetMode: value.targetMode, bossDodge: value.bossDodge !== false,
        bossRetreat: value.bossRetreat !== false, enabled: value.enabled === true,
        radius: value.radius, searchScope: value.searchScope, noRetreat: value.noRetreat !== false };
      detach(); this.attach(scene);
    },
    attach(scene) { try { attach(scene); } catch { detach(); } },
    emergency,
    controls: (scene) => !!binding && binding.scene === scene
      && (job !== null || retreating || cooldownHolding),
    status(scene) {
      if (binding?.scene !== scene || !scene?.auto?.on) return "";
      if (performance.now() < noteUntil) return message;
      if (retreating) return "HP thấp: đang né boss và chờ đan HP, chưa tiếp tục đánh.";
      if (cooldownHolding) return "Đang giữ khoảng cách với boss và chờ skill tấn công hồi.";
      return job ? "Đang di chuyển tránh vòng cảnh báo hoặc giữ khoảng cách với boss." : "";
    },
    snapshot: () => ({ build: "boss-safety-1", active: !!job, retreating,
      events: log.slice(-30).map((row) => ({ ...row })) })
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmBossSafety.attach(sceneNow()); });
})();
