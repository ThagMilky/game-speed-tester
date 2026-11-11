(() => {
  "use strict";
  // Boss-only safety. Native Auto Farm remains responsible for combat, pills and paths.
  const finite = Number.isFinite, distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const log = [], logKey = "gst:boss-safety:v1";
  // Keep a bounded record through same-tab reloads (no packet, URL or account data).
  try {
    const rows = JSON.parse(sessionStorage.getItem(logKey) ?? "[]");
    const allowed = ["pill", "retreat", "resume", "hazard", "kite", "no_route", "unsupported",
      "dash", "dash_result", "flight_drop", "cooldown_wait", "boss_cast", "return",
      "return_deferred", "area_excluded", "area_expired", "no_destination"];
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
  let settings = {}, binding = null, job = null, retreating = false, returnIntent = null, suspended = false;
  let retreatThreshold = 0.4, recoveryThreshold = 1;
  let retryAt = 0, message = "", noteUntil = 0, lastDashAt = -Infinity, dashObservation = null;
  let recentDamage = new Map(), threatSample = [], threatSampleAt = -Infinity, threatSampleScene = null;
  const areaThreatSamples = new Map();
  let visibleWarnings = [], cooldownHolding = false, recoverySteer = null, recoveryMeditation = null;
  const maxThreatScan = 256, maxLocalThreats = 24, maxPrioritizedAttackers = 8;
  const localThreatRadius = 12, threatFalloff = 9;
  const unsafeAreas = [], maxUnsafeAreas = 8, unsafeAreaTtl = 90_000;
  const unsafeAreaRadius = 8, unsafeRetrySeconds = 3, unsafeRepeatWindowMs = 30_000;
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
  function releaseJob() {
    const old = job; job = null;
    if (old && binding) {
      GSTNavigation.cancel(binding.scene, old.navigation);
      if (old.steer && binding.scene.autoX === old.steer[0] && binding.scene.autoY === old.steer[1]) {
        binding.scene.autoX = 0; binding.scene.autoY = 0;
      }
    }
  }
  function releaseRecoverySteer(scene = null) {
    // Clear only the last delegated native-recovery vector while it is still unchanged.
    const recovery = recoverySteer; recoverySteer = null;
    if (recovery && (!scene || recovery.scene === scene) && recovery.scene.auto === recovery.auto
        && recovery.scene.autoX === recovery.x && recovery.scene.autoY === recovery.y) {
      recovery.scene.autoX = 0; recovery.scene.autoY = 0;
    }
  }
  function release() { releaseJob(); releaseRecoverySteer(); }
  function setRecoveryMeditation(owner) {
    if (recoveryMeditation === owner) return;
    if (recoveryMeditation) window.removeEventListener("keydown", manualMeditationInput, true);
    recoveryMeditation = owner;
    if (owner) window.addEventListener("keydown", manualMeditationInput, true);
  }
  function clearRecoveryMeditation(handoff = true) {
    const old = recoveryMeditation;
    setRecoveryMeditation(null);
    if (old?.ownsResting && old.auto.resting === true) {
      const med = old.scene.self?.med;
      // Keep native recovery callable while a requested meditation is active or unconfirmed.
      if (!handoff || (med !== true && med !== undefined && old.phase !== "pending")) old.auto.resting = false;
    }
  }
  function clearUnsafeAreas() { unsafeAreas.length = 0; }
  function clearReturnIntent() { returnIntent = null; }
  function cancelRetreat(handoff = true) {
    const scene = recoveryMeditation?.scene ?? binding?.scene;
    clearRecoveryMeditation(handoff); release(); retreating = false; cooldownHolding = false;
    clearReturnIntent(); clearUnsafeAreas();
    return scene;
  }
  function manualMeditationInput(event) {
    const owner = recoveryMeditation;
    if (!owner || event.isTrusted !== true || event.repeat
        || (event.code !== "KeyT" && String(event.key).toLowerCase() !== "t")) return;
    const target = event.target;
    if (target?.isContentEditable || target?.matches?.("input, textarea, select")
        || owner.scene.chat?.typing || owner.scene.keyCapture) return;
    const scene = cancelRetreat(false);
    note(scene, null, "Đã nhường hồi phục cho thao tác thiền thủ công.");
  }
  function keepRecoveryResting(scene) {
    const owner = recoveryMeditation;
    if (owner?.scene === scene && owner.auto === scene.auto && owner.ownsResting
        && scene.auto.resting !== true) scene.auto.resting = true;
  }
  function eliteActor(actor) {
    return actor?.k === "m" && !actor.dead && finite(actor.x) && finite(actor.y)
      && globalThis.GSTFarmMonsterClassification?.isElite?.(actor) === true;
  }
  function hasVisibleElite(scene) {
    if (!settings.eliteDodge || scene?.auto?.on !== true || typeof scene.views?.values !== "function") return false;
    for (const actor of scene.views.values()) if (eliteActor(actor)) return true;
    return false;
  }
  const hasDodgePreference = () => settings.bossDodge || settings.eliteDodge;
  function warningEnabled(area) {
    return area.category === "elite" ? settings.eliteDodge : settings.bossDodge;
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
    return (retreating && settings.bossRetreat) || (!!returnIntent && returnIntent.scene === scene)
      || (bossMode && (settings.bossDodge || settings.bossRetreat))
      || !!sealThreat || hasVisibleElite(scene) || hasUnsafeAreas(scene);
  }
  function connected(scene) {
    const d = scene.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  }
  function currentMapKey(scene) {
    try { return scene?.autoHost?.()?.mapKey?.() ?? null; }
    catch { return null; }
  }
  function pruneUnsafeAreas(scene) {
    if (unsafeAreas.length && binding?.scene === scene && binding.mapKey != null) {
      const mapKey = currentMapKey(scene);
      if (mapKey != null && mapKey !== binding.mapKey) {
        cancelRetreat(); recentDamage.clear(); threatSample = []; areaThreatSamples.clear();
        binding.mapKey = mapKey;
        note(scene, "resume", "Map đã đổi; đã xóa vùng tránh và return cũ để chờ dữ liệu map mới.");
        return;
      }
    }
    for (let i = unsafeAreas.length - 1; i >= 0; i--) {
      const area = unsafeAreas[i];
      if (area.scene !== scene || area.auto !== scene?.auto || area.mapKey !== binding?.mapKey) {
        unsafeAreas.splice(i, 1);
      }
    }
  }
  function excludedArea(scene, point) {
    if (!scene || !finite(point?.x) || !finite(point?.y)) return null;
    pruneUnsafeAreas(scene);
    return unsafeAreas.find((area) => distance(area, point) <= area.radius) ?? null;
  }
  function allowsSegment(scene, start, end) {
    if (![start?.x, start?.y, end?.x, end?.y].every(finite)) return false;
    pruneUnsafeAreas(scene);
    return unsafeAreas.every((area) => {
      const radius = area.radius, current = distance(start, area), destination = distance(end, area);
      if (current < radius) {
        // A segment already inside an exclusion may make monotonic outward
        // progress; it must not turn back toward or through the center.
        const outward = (start.x - area.x) * (end.x - start.x)
          + (start.y - area.y) * (end.y - start.y);
        return outward >= 0 && destination > current + 0.05;
      }
      return segmentDistance(area, start, end) >= radius;
    });
  }
  function hasUnsafeAreas(scene) {
    return scene?.auto?.on === true && globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() === true
      && (pruneUnsafeAreas(scene), unsafeAreas.length > 0);
  }
  function excludeUnsafeArea(scene, intent, reason) {
    const mapKey = binding?.mapKey;
    if (mapKey == null || intent?.scene !== scene || intent.auto !== scene.auto) return false;
    const existing = unsafeAreas.find((area) => area.scene === scene && area.auto === scene.auto
      && area.mapKey === mapKey && distance(area, intent.point) <= unsafeAreaRadius);
    const entry = existing ?? { scene, auto: scene.auto, mapKey, x: intent.point.x, y: intent.point.y,
      radius: unsafeAreaRadius, expiresAt: 0 };
    entry.expiresAt = performance.now() + unsafeAreaTtl;
    entry.reason = reason;
    if (!existing) {
      if (unsafeAreas.length >= maxUnsafeAreas) unsafeAreas.shift();
      unsafeAreas.push(entry);
    }
    intent.excludedUntil = entry.expiresAt;
    intent.unsafeChecks = 0;
    note(scene, "area_excluded", `Tạm tránh khu farm trong ${Math.round(unsafeAreaTtl / 1000)} giây sau nhiều lần return không an toàn.`);
    return true;
  }
  function blocked(scene, imminent = false) {
    return suspended || (!imminent && globalThis.GSTFarmDefense?.controls?.(scene)) || !scene?.auto?.on || !scene.self || scene.self.dead || scene.leaving
      || !scene.sys?.isActive?.() || !connected(scene) || GSTFarmRouting.blocked(scene)
      || GSTFarmInput.movement(scene) || scene.auto.moved || scene.now() < scene.auto.pauseUntil
      // Pending native casts/aim are handled after reading danger zones in
      // update(): an imminent boss hit must not be silently ignored.
      || scene.heldAttack || scene.harvesting
      || (!retreating && (scene.auto.resting || scene.self.med)) || scene.self.fish || scene.keyCapture
      // Let the native Auto Farm drink pills before considering boss movement.
      || (!imminent && globalThis.GSTMapTravel?.active?.(scene)
        && globalThis.GSTHarvest?.needsRecovery?.(scene))
      || globalThis.GSTQuest?.active?.(scene)
      || ["GSTRealm", "GSTChest"].some((name) => globalThis[name]?.controls?.(scene))
      || (globalThis.GSTHarvest?.controls?.(scene) && !imminent && !retreating
        && !(returnIntent?.scene === scene && returnIntent.phase !== "excluded"))
      || (scene.self.realm?.inside?.protection ?? 0) > 0;
  }
  function retreatOwnerValid(scene) {
    return !!scene && sceneNow() === scene && binding?.scene === scene && binding.auto === scene.auto
      && settings.bossRetreat && globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() === true
      && scene.auto?.on === true && scene.self?.dead !== true && !scene.leaving
      && scene.sys?.isActive?.() && connected(scene) && !GSTFarmInput.movement(scene)
      && !scene.auto.moved;
  }
  function retreatContextValid(scene, time) {
    return retreatOwnerValid(scene) && !!scene.self && finite(time)
      && finite(scene.auto.pauseUntil) && time >= scene.auto.pauseUntil;
  }
  function holdForRecoveryData(scene, time, text) {
    release();
    if (!retreating && !returnIntent && unsafeAreas.length) {
      if (message !== text || performance.now() > noteUntil) note(scene, "unsupported", text);
      return true;
    }
    if (returnIntent && !retreating) {
      if (!retreatOwnerValid(scene)) { cancelRetreat(); return false; }
      if (message !== text || performance.now() > noteUntil) note(scene, "unsupported", text);
      return true;
    }
    if (!retreating || !retreatOwnerValid(scene)) {
      cancelRetreat(); return false;
    }
    keepRecoveryResting(scene);
    if (message !== text || performance.now() > noteUntil) note(scene, "unsupported", text);
    return true;
  }
  function delegateNativeRecovery(scene, host, time, delta) {
    const owner = recoveryMeditation;
    if (retreating && owner?.scene === scene && owner.auto === scene.auto
        && owner.phase === "stop-pending" && scene.self.med === false
        && finite(scene.selfAt) && scene.selfAt > owner.snapshotAtRequest
        && finite(owner.requestedAt) && time - owner.requestedAt >= 2
        && scene.self.hp / scene.self.mh < recoveryThreshold && typeof host.meditate === "function") {
      // Native rest() stops meditation at 95%; restart it only after a newer
      // snapshot confirms the stop, then keep waiting for the configured HP.
      owner.phase = "pending";
      owner.snapshotAtRequest = scene.selfAt;
      owner.requestedAt = time;
      try { host.meditate(); keepRecoveryResting(scene); }
      catch {
        owner.phase = "stop-pending";
        note(scene, "unsupported", "Không thể tiếp tục thiền hồi phục; đang chờ trạng thái game mới.");
      }
      return true;
    }
    // Keep an unchanged native vector between controller decision ticks.
    releaseJob();
    if (recoverySteer && (recoverySteer.scene !== scene || recoverySteer.auto !== scene.auto
        || scene.autoX !== recoverySteer.x || scene.autoY !== recoverySteer.y)) recoverySteer = null;
    const before = [scene.autoX, scene.autoY];
    const result = GSTFarmUpdate.runRecovery(scene, host, time, delta);
    if (!result?.ran) {
      releaseRecoverySteer(scene);
      note(scene, "unsupported", "Không thể gọi nhánh hồi phục gốc; đang giữ Auto Farm khỏi chọn mục tiêu.");
    } else {
      if (result.meditation === "start") {
        const owner = recoveryMeditation?.scene === scene && recoveryMeditation.auto === scene.auto
          ? recoveryMeditation : { scene, auto: scene.auto, ownsResting: result.restingBefore === false };
        owner.phase = "pending";
        owner.snapshotAtRequest = scene.selfAt;
        owner.requestedAt = time;
        setRecoveryMeditation(owner);
        keepRecoveryResting(scene);
      } else if (result.meditation === "stop" && recoveryMeditation?.scene === scene) {
        recoveryMeditation.phase = "stop-pending";
        recoveryMeditation.snapshotAtRequest = scene.selfAt;
        recoveryMeditation.requestedAt = time;
      } else keepRecoveryResting(scene);
      if ([scene.autoX, scene.autoY].every(finite)
          && (scene.autoX !== before[0] || scene.autoY !== before[1])) {
        if (scene.autoX !== 0 || scene.autoY !== 0)
          recoverySteer = { scene, auto: scene.auto, x: scene.autoX, y: scene.autoY };
        else if (recoverySteer?.scene === scene) recoverySteer = null;
      }
    }
    return true;
  }
  const bossActor = (actor) => (globalThis.GSTFarmMonsterClassification
    ? globalThis.GSTFarmMonsterClassification.isBoss(actor) === true
    : actor?.k === "m" && !actor.dead && (actor.st?.cls === "boss" || actor.st?.wb === true))
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
        at: time + area.at - serverNow, until: time + area.until - serverNow, category: "unknown" }));
    return [...realms, ...visibleWarnings];
  }
  function activeHazards(scene, time) {
    return hazardZones(scene, time).filter(warningEnabled);
  }
  function imminentWarning(scene, time) {
    return hasDodgePreference() && finite(time) && finite(scene?.px) && finite(scene?.py)
      && finite(scene?.selfAt) && time - scene.selfAt <= 3
      && activeHazards(scene, time).some((area) =>
        distance(area, { x: scene.px, y: scene.py }) <= area.radius + 0.8
        && area.at <= time + 0.42 && area.until >= time);
  }
  function criticalRetreat(scene) {
    if (!settings.bossRetreat || !scene?.self || !finite(scene.px) || !finite(scene.py)
        || !finite(scene.self.hp) || !finite(scene.self.mh) || scene.self.mh <= 0) return false;
    const hp = scene.self.hp / scene.self.mh;
    if (retreating) return hp < recoveryThreshold;
    if (hp >= retreatThreshold || !nearbyBoss(scene, { x: scene.px, y: scene.py })) return false;
    // When native meditation is intentionally enabled and no pills remain,
    // let the game's own resting logic handle the situation instead.
    if (!retreating && settings.noRetreat === false) {
      const pills = scene.autoHost?.()?.pills?.("hp");
      if (Array.isArray(pills) && pills.every((count) => count === 0)) return false;
    }
    return true;
  }
  function urgentEscape(scene, time) {
    return (retreating && finite(scene?.self?.hp) && finite(scene?.self?.mh)
      && scene.self.mh > 0 && scene.self.hp / scene.self.mh < recoveryThreshold)
      || imminentWarning(scene, time)
      || (hasDodgePreference() && job?.emergency === true && finite(time)
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
    return hasDodgePreference() && activeHazards(scene, time).some((area) =>
      distance(area, pos) <= area.radius + 0.8 && area.at <= time + 2.2 && area.until >= time);
  }
  function rememberWarning(scene, x, y, radius, seconds, source, category = "unknown") {
    if (!(category === "elite" ? settings.eliteDodge : settings.bossDodge) || !scene?.auto?.on
        || ![x, y, radius, seconds].every(finite) || radius <= 0 || radius >= 20
        || seconds <= 0 || seconds > 5) return false;
    const time = scene.now(), pos = { x: scene.px, y: scene.py };
    const boss = nearbyBoss(scene, pos);
    const sealWarning = globalThis.GSTFarmSeals?.pending?.(scene)
      && distance(pos, { x, y }) < 8;
    const relatedBoss = category !== "elite" && boss && distance(boss, { x, y }) <= 14;
    if (!finite(time) || category !== "elite" && !relatedBoss && !sealWarning) return false;
    const existing = visibleWarnings.find((area) => distance(area, { x, y }) < 0.3
      && Math.abs(area.radius - radius) < 0.3 && area.category === category && area.until > time);
    if (existing) existing.until = Math.max(existing.until, time + seconds);
    else visibleWarnings.push({ x, y, radius, at: time, until: time + seconds, source, category });
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
  function pathOutsideExclusions(scene, start, points) {
    if (!Array.isArray(points) || !points.length || points.length > 40) return false;
    let prior = start;
    for (const coords of points) {
      if (!Array.isArray(coords) || coords.length < 2 || !coords.slice(0, 2).every(finite)) return false;
      const next = { x: coords[0], y: coords[1] };
      if (!allowsSegment(scene, prior, next)) return false;
      prior = next;
    }
    return true;
  }
  function threatExposure(pos, threats) {
    return threats.reduce((sum, threat) => {
      const d = distance(pos, threat.actor);
      return sum + threat.weight * Math.max(0, (threatFalloff - d) / threatFalloff);
    }, 0);
  }
  function pathThreatExposure(start, path, threats) {
    let total = 0, prior = start;
    for (const coords of path) {
      const end = { x: coords[0], y: coords[1] };
      for (const fraction of [0.5, 1]) total += threatExposure({
        x: prior.x + (end.x - prior.x) * fraction,
        y: prior.y + (end.y - prior.y) * fraction
      }, threats);
      prior = end;
    }
    return total;
  }
  function safeExits(host, point, bounds, hazards) {
    let exits = 0;
    for (let index = 0; index < 8; index++) {
      const angle = index * Math.PI / 4;
      const next = { x: point.x + Math.cos(angle) * 2, y: point.y + Math.sin(angle) * 2 };
      if (inside(bounds, next) && host.clear(point.x, point.y, next.x, next.y)
          && hazards.every((area) => distance(area, next) > area.radius + 0.7)) exits++;
    }
    return exits;
  }
  function localThreats(scene, host, pos, time) {
    if (threatSampleScene === scene && time - threatSampleAt < 0.25)
      return threatSample.filter((item) => !item.actor.dead && distance(pos, item.actor) <= localThreatRadius);
    threatSampleScene = scene; threatSampleAt = time; threatSample = [];
    for (const [id, until] of recentDamage) if (until <= time || !scene.views?.get?.(id)) recentDamage.delete(id);
    const raw = typeof host.gstRawEnemies === "function" ? host.gstRawEnemies() : host.enemies?.();
    const candidates = new Map();
    const add = (entry, actor, attributed) => {
      if (!actor || actor.k !== "m" || actor.dead || !finite(actor.x) || !finite(actor.y)
          || !Number.isSafeInteger(actor.id)
          || (entry?.hostile !== true && !attributed)) return;
      const category = globalThis.GSTFarmMonsterClassification?.classify?.(actor);
      if (!category || distance(pos, actor) > localThreatRadius) return;
      const categoryWeight = category === "boss" ? 3 : category === "elite" ? 2 : 1;
      const previous = candidates.get(actor.id);
      if (!previous || attributed && !previous.attributed)
        candidates.set(actor.id, { actor, category, attributed, categoryWeight,
          weight: categoryWeight + (attributed ? 2 : 0) });
    };
    if (Array.isArray(raw)) {
      for (let index = 0; index < Math.min(raw.length, maxThreatScan); index++) {
        const entry = raw[index];
        add(entry, scene.views?.get?.(entry?.id), recentDamage.has(entry?.id));
      }
    }
    for (const [id, until] of recentDamage) {
      if (until > time) add(null, scene.views?.get?.(id), true);
    }
    const byDistance = (a, b) => distance(pos, a.actor) - distance(pos, b.actor)
      || Number(b.attributed) - Number(a.attributed)
      || b.categoryWeight - a.categoryWeight || a.actor.id - b.actor.id;
    const nearby = [...candidates.values()].filter((item) => distance(pos, item.actor) <= threatFalloff).sort(byDistance);
    const selected = nearby.slice(0, maxLocalThreats);
    const selectedIds = new Set(selected.map((item) => item.actor.id));
    const distantAttackers = [...candidates.values()].filter((item) => item.attributed
      && distance(pos, item.actor) > threatFalloff && !selectedIds.has(item.actor.id)).sort(byDistance);
    const reserved = distantAttackers.slice(0, Math.min(maxPrioritizedAttackers, maxLocalThreats - selected.length));
    for (const item of reserved) selectedIds.add(item.actor.id);
    const remaining = [...candidates.values()].filter((item) => !selectedIds.has(item.actor.id)).sort(byDistance);
    // Keep every available threat inside the active 9-cell exposure radius first;
    // reserve at most 8 nearest recent attackers beyond it, then fill by distance.
    threatSample = [...selected, ...reserved, ...remaining.slice(0, maxLocalThreats - selected.length - reserved.length)];
    return threatSample;
  }
  function threatsAt(scene, host, point, time) {
    const key = `${point.x.toFixed(1)}:${point.y.toFixed(1)}`;
    const cached = areaThreatSamples.get(key);
    if (cached?.scene === scene && time - cached.at < 0.25) return cached;
    const raw = typeof host.gstRawEnemies === "function" ? host.gstRawEnemies() : host.enemies?.();
    const candidates = new Map();
    let covered = Array.isArray(raw) && raw.length < maxThreatScan
      && typeof scene.views?.get === "function" && finite(scene.selfAt) && time - scene.selfAt <= 3;
    const add = (entry, actor, attributed) => {
      if (!actor || actor.k !== "m" || actor.dead || !finite(actor.x) || !finite(actor.y)
          || !Number.isSafeInteger(actor.id)) return;
      if (distance(point, actor) > localThreatRadius) return;
      if (entry?.hostile !== true && !attributed) return;
      const category = globalThis.GSTFarmMonsterClassification?.classify?.(actor);
      if (!category) return;
      const categoryWeight = category === "boss" ? 3 : category === "elite" ? 2 : 1;
      const previous = candidates.get(actor.id);
      if (!previous || attributed && !previous.attributed)
        candidates.set(actor.id, { actor, category, attributed, categoryWeight,
          weight: categoryWeight + (attributed ? 2 : 0) });
    };
    if (Array.isArray(raw)) for (let index = 0; index < Math.min(raw.length, maxThreatScan); index++) {
      const entry = raw[index], actor = scene.views?.get?.(entry?.id);
      if (entry?.hostile === true && !actor) covered = false;
      add(entry, actor, recentDamage.has(entry?.id));
    }
    for (const [id, until] of recentDamage) {
      if (until > time) add(null, scene.views?.get?.(id), true);
    }
    const byDistance = (a, b) => distance(point, a.actor) - distance(point, b.actor)
      || Number(b.attributed) - Number(a.attributed)
      || b.categoryWeight - a.categoryWeight || a.actor.id - b.actor.id;
    const nearby = [...candidates.values()].filter((item) => distance(point, item.actor) <= threatFalloff).sort(byDistance);
    const selected = nearby.slice(0, maxLocalThreats), selectedIds = new Set(selected.map((item) => item.actor.id));
    const attackers = [...candidates.values()].filter((item) => item.attributed
      && distance(point, item.actor) > threatFalloff && !selectedIds.has(item.actor.id)).sort(byDistance)
      .slice(0, Math.min(maxPrioritizedAttackers, maxLocalThreats - selected.length));
    for (const item of attackers) selectedIds.add(item.actor.id);
    const remaining = [...candidates.values()].filter((item) => !selectedIds.has(item.actor.id)).sort(byDistance);
    const threats = [...selected, ...attackers,
      ...remaining.slice(0, maxLocalThreats - selected.length - attackers.length)];
    const sample = { scene, at: time, threats, covered };
    areaThreatSamples.set(key, sample);
    while (areaThreatSamples.size > maxUnsafeAreas + 1)
      areaThreatSamples.delete(areaThreatSamples.keys().next().value);
    return sample;
  }
  function destination(scene, host, pos, boss, hazards, lowHp, zone, threats) {
    const danger = hazards.filter((area) => distance(area, pos) <= area.radius + 1);
    const origin = danger[0] ?? boss;
    const away = lowHp ? threats.reduce((sum, threat) => {
      const dx = pos.x - threat.actor.x, dy = pos.y - threat.actor.y;
      const length = Math.hypot(dx, dy) || 1, weight = threat.weight / Math.max(1, length);
      return { x: sum.x + dx / length * weight, y: sum.y + dy / length * weight };
    }, { x: 0, y: 0 }) : null;
    const baseAngle = danger.length ? Math.atan2(pos.y - danger[0].y, pos.x - danger[0].x)
      : away && Math.hypot(away.x, away.y) > 0.05 ? Math.atan2(away.y, away.x)
        : origin ? Math.atan2(pos.y - origin.y, pos.x - origin.x) : 0;
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
    const currentExposure = threatExposure(pos, threats);
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
      const routeExposure = pathThreatExposure(pos, route, threats);
      const destinationExposure = threatExposure(point, threats);
      if (lowHp && threats.length && destinationExposure >= currentExposure - 0.05) continue;
      const exits = safeExits(host, point, zone, hazards);
      const radialDrift = !lowHp && boss ? Math.abs(distance(point, boss) - bossRange) : 0;
      const value = length + routeExposure * 1.2 + destinationExposure * 3.5
        + (exits === 0 ? 8 : exits === 1 ? 3 : 0)
        + radialDrift * 1.2 + (candidate.orbit ? 0 : 0.35);
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
    if (!hasDodgePreference() || typeof scene.useSkill !== "function"
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
  function maxPathExposure(start, path, threats) {
    let maximum = threatExposure(start, threats), prior = start;
    for (const coords of path) {
      const end = { x: coords[0], y: coords[1] };
      for (const fraction of [0.5, 1]) maximum = Math.max(maximum, threatExposure({
        x: prior.x + (end.x - prior.x) * fraction,
        y: prior.y + (end.y - prior.y) * fraction
      }, threats));
      prior = end;
    }
    return maximum;
  }
  function refreshExpiredUnsafeAreas(scene, host, time, bounds, hazards) {
    const now = performance.now();
    for (let i = unsafeAreas.length - 1; i >= 0; i--) {
      const area = unsafeAreas[i];
      if (area.scene !== scene || area.auto !== scene.auto || area.mapKey !== binding?.mapKey
          || now < area.expiresAt) continue;
      const point = { x: area.x, y: area.y };
      const sample = threatsAt(scene, host, point, time);
      if (!sample.covered) {
        area.expiresAt = now + unsafeAreaTtl;
        area.reason = "coverage";
        note(scene, "area_excluded", "Chưa đủ dữ liệu quanh vùng tránh; tiếp tục giữ vùng loại trừ.");
        continue;
      }
      const threatened = threatExposure(point, sample.threats) > 0.2;
      const hazard = hazards.some((zone) => zone.until >= time && zone.at <= time + 2.2
        && distance(zone, point) <= zone.radius + area.radius);
      if (!inside(bounds, point) || threatened || hazard) {
        area.expiresAt = now + unsafeAreaTtl;
        area.reason = threatened ? "threat" : "route";
        note(scene, "area_excluded", "Khu farm vẫn có threat hoặc cảnh báo; gia hạn tránh tạm sau khi đánh giá lại.");
      } else {
        unsafeAreas.splice(i, 1);
        note(scene, "area_expired", "Hết hạn vùng tránh tạm sau khi threat/cảnh báo tại khu đã an toàn hơn.");
      }
    }
  }
  function deferReturn(scene, host, time, reason) {
    const intent = returnIntent;
    if (!intent || time < intent.retryAt) {
      release();
      return true;
    }
    const now = performance.now();
    if (intent.lastUnsafeReason !== reason || now - intent.lastUnsafeAt > unsafeRepeatWindowMs) {
      intent.unsafeChecks = 1;
    } else intent.unsafeChecks++;
    intent.lastUnsafeReason = reason;
    intent.lastUnsafeAt = now;
    intent.retryAt = time + unsafeRetrySeconds;
    release();
    GSTNavigation.resetLeg(intent.navigation, true);
    if (intent.navigation) { intent.navigation.path = []; intent.navigation.pathAt = -Infinity; }
    if (intent.unsafeChecks >= 2) {
      if (!excludeUnsafeArea(scene, intent, reason)) {
        if (intent.lastNoDestinationReason !== reason) {
          intent.lastNoDestinationReason = reason;
          note(scene, "no_destination", "Tuyến về bãi gốc chưa an toàn; đang đứng chờ dữ liệu hoặc tuyến phù hợp.");
        }
      } else intent.phase = "excluded";
    } else {
      note(scene, "return_deferred", reason === "threat"
        ? "Chưa quay về bãi gốc: mức đe dọa tại bãi vẫn cao hơn vị trí hiện tại."
        : "Chưa quay về bãi gốc: tuyến đang vướng cảnh báo kỹ năng hoặc vật cản.");
    }
    return true;
  }
  function runReturn(scene, host, time, pos, bounds, hazards, threats) {
    const intent = returnIntent;
    if (!intent || intent.scene !== scene || intent.auto !== scene.auto) return false;
    const excluded = excludedArea(scene, intent.point);
    if (excluded) {
      release();
      intent.phase = "excluded";
      if (intent.lastExcludedUntil !== excluded.expiresAt) {
        intent.lastExcludedUntil = excluded.expiresAt;
        note(scene, "no_destination", "Bãi gốc đang bị loại tạm vì các lần quay về trước không an toàn; chờ hết hạn để đánh giá lại.");
      }
      return null;
    }
    if (intent.phase === "excluded") {
      intent.phase = "returning"; intent.retryAt = time; intent.navigation = null;
      intent.unsafeChecks = 0; intent.lastDecision = "";
      note(scene, "return", "Vùng tránh tạm đã hết hạn; đang đánh giá lại threat và tuyến trước khi quay về.");
    }
    if (time < intent.retryAt) { release(); return true; }
    if (!inside(bounds, intent.point)) return deferReturn(scene, host, time, "route");
    const currentExposure = threatExposure(pos, threats);
    const targetSample = threatsAt(scene, host, intent.point, time);
    if (!targetSample.covered) {
      release();
      note(scene, "return_deferred", "Chưa đủ dữ liệu quanh bãi gốc để xác nhận an toàn; đang chờ snapshot mới.");
      intent.retryAt = time + unsafeRetrySeconds;
      return true;
    }
    const routeThreats = [...new Map([...threats, ...targetSample.threats]
      .map((item) => [item.actor.id, item])).values()];
    const targetExposure = threatExposure(intent.point, targetSample.threats);
    if (targetExposure > Math.max(0.2, currentExposure + 0.12))
      return deferReturn(scene, host, time, "threat");
    if (distance(pos, intent.point) <= 0.8) {
      release(); returnIntent = null; clearRecoveryMeditation();
      note(scene, "return", "Đã về gần tâm farm an toàn; Auto Farm gốc được phép chọn mục tiêu phù hợp.");
      return false;
    }
    const allowedPoint = (point) => inside(bounds, point)
      && (!excludedArea(scene, point) || allowsSegment(scene, pos, point))
      && clearOfHazards(pos, point, hazards)
      && threatExposure(point, routeThreats) <= currentExposure + 0.12;
    const allowedSegment = (start, end) => allowsSegment(scene, start, end);
    const walking = { ...host,
      clear: (x, y, gx, gy) => allowedPoint({ x: gx, y: gy }) && allowedSegment({ x, y }, { x: gx, y: gy })
        && host.clear(x, y, gx, gy)
        && clearOfHazards({ x, y }, { x: gx, y: gy }, hazards),
      route: (x, y, gx, gy) => {
        if (!allowedPoint({ x: gx, y: gy })) return null;
        const route = host.route(x, y, gx, gy);
        return pathSafe(scene, { x, y }, route, bounds, hazards)
          && pathOutsideExclusions(scene, { x, y }, route)
          && maxPathExposure({ x, y }, route, routeThreats) <= currentExposure + 0.2 ? route : null;
      },
      steer: (x, y) => {
        const next = { x: scene.px + x * 0.25, y: scene.py + y * 0.25 };
        if (!allowedPoint(next) || !allowedSegment(pos, next) || !clearOfHazards(pos, next, hazards)) {
          intent.denied = true; x = 0; y = 0;
        }
        scene.autoX = x; scene.autoY = y;
        if (job?.navigation === intent.navigation) job.steer = [x, y];
      }
    };
    if (!intent.navigation) intent.navigation = Object.assign(Object.create(scene.auto), {
      path: [], lastX: pos.x, lastY: pos.y, stillSince: time, pathAt: -Infinity,
      stuckCount: 0, sideUntil: 0, sideX: 0, sideY: 0
    });
    const navigation = intent.navigation;
    const next = GSTNavigation.leg(scene, navigation, walking, intent.point.x, intent.point.y, allowedPoint);
    if (!next) return deferReturn(scene, host, time, "route");
    if (!job || job.navigation !== navigation) {
      release();
      job = { navigation, point: { ...intent.point }, startedAt: time, progressAt: time,
        steer: null, emergency: false, mode: "return" };
    }
    intent.denied = false;
    if (GSTNavigation.progressed(scene, navigation, navigation.path, intent.point.x, intent.point.y, 0.3))
      job.progressAt = time;
    if (time - job.startedAt > 120 || time - job.progressAt > 12)
      return deferReturn(scene, host, time, "route");
    if (!GSTNavigation.walk(scene, navigation, walking, time, pos.x, pos.y, next.x, next.y, 0.8)
        || intent.denied) return deferReturn(scene, host, time, "route");
    if (intent.lastDecision !== "returning") {
      intent.lastDecision = "returning";
      note(scene, "return", "Đường về bãi gốc đang an toàn; quay lại bằng navigation Auto Farm hiện có.");
    }
    return true;
  }
  function update(host, time, delta) {
    const scene = binding?.scene;
    try {
      cooldownHolding = false;
      if (!scene || sceneNow() !== scene || binding?.auto !== scene.auto
          || globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() !== true || !enabled()) {
        cancelRetreat(); return false;
      }
      if (!finite(time)) return holdForRecoveryData(scene, time,
        "Dữ liệu thời gian tạm thời không hợp lệ; đang giữ trạng thái hồi phục.");
      if (!["steer", "route", "clear", "hp", "pills"].every((key) => typeof host?.[key] === "function"))
        return holdForRecoveryData(scene, time,
          "Thiếu dữ liệu Auto Farm để điều hướng; đang chờ dữ liệu hợp lệ trước khi tiếp tục.");
      if (!scene.self) return holdForRecoveryData(scene, time,
        "Chưa có dữ liệu nhân vật; đang giữ hồi phục và chờ snapshot mới.");
      if (unsafeAreas.length && (scene.self.dead || !connected(scene))) {
        cancelRetreat(); return false;
      }
      if (GSTFarmInput.movement(scene) || scene.auto.moved) {
        cancelRetreat(); return false;
      }
      if ((retreating || returnIntent) && !retreatOwnerValid(scene)) {
        cancelRetreat(); return false;
      }
      const mapKey = host.mapKey?.();
      if (binding.mapKey && mapKey == null) return holdForRecoveryData(scene, time,
        "Chưa nhận được mã map hiện tại; đang giữ hồi phục tới khi dữ liệu map ổn định.");
      if (binding.mapKey && mapKey !== binding.mapKey) {
        cancelRetreat(); recentDamage.clear(); threatSample = []; areaThreatSamples.clear();
        binding.mapKey = mapKey;
        note(scene, "resume", "Map đã đổi; hủy trạng thái rút lui và chờ Auto Farm gốc chọn lại.");
        return false;
      }
      if (!binding.mapKey && mapKey != null) {
        binding.mapKey = mapKey;
        if (returnIntent) returnIntent.mapKey = mapKey;
      }
      const pos = { x: scene.px, y: scene.py }, bounds = zone(scene);
      if (!bounds || !inside(bounds, pos) || !finite(scene.self.hp) || !finite(scene.self.mh) || scene.self.mh <= 0
          || !finite(scene.selfAt) || scene.now() - scene.selfAt > 3) {
        return holdForRecoveryData(scene, time,
          "Vị trí hoặc trạng thái nhân vật chưa cập nhật; đang giữ hồi phục và chờ dữ liệu mới.");
      }
      observeDash(scene, time);
      if (finite(scene.dashT) && scene.dashT > 0) return true; // Let native Q finish before choosing another movement.
      const boss = nearbyBoss(scene, pos), hp = scene.self.hp / scene.self.mh;
      if (recoveryMeditation?.scene === scene && recoveryMeditation.phase === "pending"
          && scene.self.med === true) recoveryMeditation.phase = "active";
      if (recoveryMeditation?.scene === scene && scene.self.med === true) keepRecoveryResting(scene);
      if (recoveryMeditation?.scene === scene && recoveryMeditation.phase !== "returning" && scene.self.med === false
          && !(recoveryMeditation.phase === "stop-pending" && hp < recoveryThreshold)
          && (recoveryMeditation.phase !== "pending"
            || finite(scene.selfAt) && scene.selfAt > recoveryMeditation.snapshotAtRequest))
        clearRecoveryMeditation();
      if (retreating && hp >= recoveryThreshold) {
        const owner = recoveryMeditation?.scene === scene ? recoveryMeditation : null;
        if (owner && scene.self.med !== true) return true; // Await pending/unknown meditation confirmation.
        if (owner && scene.self.med === true) {
          if (owner.phase !== "stop-pending" && typeof host.meditate === "function") {
            owner.phase = "stop-pending";
            try { host.meditate(); }
            catch { note(scene, "unsupported", "Không gửi được yêu cầu dừng thiền; đang giữ hồi phục và chờ trạng thái game."); }
          }
          return true; // Wait for the next game snapshot to confirm the native toggle.
        }
        release(); retreating = false; cooldownHolding = false;
        if (returnIntent?.scene === scene && returnIntent.auto === scene.auto) {
          returnIntent.phase = "returning"; returnIntent.retryAt = time;
          returnIntent.navigation = null; returnIntent.lastDecision = "";
          setRecoveryMeditation({ scene, auto: scene.auto, ownsResting: false, phase: "returning" });
          note(scene, "return", "Đã đạt ngưỡng hồi HP và kết thúc thiền; đang kiểm tra đường về bãi farm.");
          return true;
        }
        note(scene, "resume", "Đã đạt ngưỡng hồi HP; Auto Farm gốc tiếp tục tự chọn mục tiêu.");
        return false;
      }
      if (settings.bossRetreat && !retreating && boss && hp < retreatThreshold) {
        // A completed return marker is not a pending meditation owner. Retire
        // it before a new retreat, while preserving any real active meditation.
        if (recoveryMeditation?.scene === scene && recoveryMeditation.phase === "returning"
            && scene.self.med !== true) clearRecoveryMeditation();
        retreating = true;
        const home = globalThis.GSTHarvest?.farmOrigin?.(scene) ?? { x: scene.auto.ax, y: scene.auto.ay };
        returnIntent = [home?.x, home?.y].every(finite)
          ? { scene, auto: scene.auto, mapKey: binding.mapKey, point: { x: home.x, y: home.y },
            phase: "recovering", unsafeChecks: 0, retryAt: time }
          : null;
        note(scene, "retreat", `HP dưới ${settings.retreatHpPercent}%; đang rút khỏi nhóm quái và chờ hồi HP.`,
          { cooldown: typeof host.pillWait === "function" ? host.pillWait("hp") : null });
      }
      const currentUrgent = urgentEscape(scene, time);
      if (blocked(scene, currentUrgent)) {
        if (retreating && !retreatOwnerValid(scene)) { cancelRetreat(); return false; }
        release();
        if (returnIntent && !retreating && returnIntent.phase !== "excluded") return true;
        if (retreating && retreatContextValid(scene, scene.now())) {
          if (scene.auto.resting) return delegateNativeRecovery(scene, host, time, delta);
          if (scene.self.med) return true;
          host.steer(0, 0);
          return true;
        }
        if (retreating) return holdForRecoveryData(scene, time,
          "Đang chờ trạng thái hồi phục hợp lệ trước khi điều khiển tiếp.");
        cooldownHolding = false; return false;
      }
      if (retreating && scene.auto.resting) return delegateNativeRecovery(scene, host, time, delta);
      if (retreating && scene.self.med) { release(); return true; }
      const hazards = hasDodgePreference() ? activeHazards(scene, time) : [];
      const danger = hazards.some((area) => distance(area, pos) <= area.radius + 0.8
        && area.at <= time + 0.75 && area.until >= time);
      const avoidanceBoss = settings.bossDodge || retreating ? boss : null;
      const threats = localThreats(scene, host, pos, time);
      refreshExpiredUnsafeAreas(scene, host, time, bounds, hazards);
      if (job && danger) job.emergency = true;
      if (danger && job?.mode === "return") {
        release(); GSTNavigation.resetLeg(returnIntent?.navigation);
        if (returnIntent?.navigation) returnIntent.navigation.path = [];
      }
      // A pending realm seal owns combat before the boss. Keep urgent hazard
      // dodging and low-HP retreat, but do not kite/spam Q solely for the boss
      // while the seal handler is trying to approach and break seals.
      const cooling = settings.bossDodge && !globalThis.GSTFarmSeals?.pending?.(scene)
        && !!boss && offensiveCooldownGap(scene, host, time);
      const gapDistance = boss ? distance(pos, boss) : Infinity;
      // Only make a short spacing adjustment if the boss is almost touching us.
      // Waiting for attack cooldown alone must not trigger a long kite/Q dash.
      const cooldownKite = cooling && gapDistance < 4;
      // Do not interfere with normal native casting/aiming, but prioritize
      // movement out of a confirmed/estimated imminent warning, or a
      // critical low-HP retreat, over continuing that cast in place.
      if ((scene.pendingSkill || scene.aiming) && !danger && !retreating) {
        release();
        return returnIntent?.phase !== "excluded" ? !!returnIntent : false;
      }
      // When even one attack skill is available, immediately hand combat
      // back to native castSkills(). Do not add a second skill-spam engine.
      if (returnIntent && !retreating && !danger && !job?.emergency) {
        const returned = runReturn(scene, host, time, pos, bounds, hazards, threats);
        if (returned !== null) return returned;
      }
      if (!danger && !retreating && !cooldownKite && !job?.emergency) { release(); return false; }
      if (retreating && host.pills("hp")?.every((n) => n === 0) && settings.noRetreat === false) {
        return delegateNativeRecovery(scene, host, time, delta);
      }
      if (retreating) drinkIfReady(scene, host, time, hp);
      if (retreating && !danger && !threats.length) {
        release(); host.steer(0, 0);
        const cd = typeof host.pillWait === "function" ? host.pillWait("hp") : null;
        const pills = host.pills("hp");
        const empty = Array.isArray(pills) && pills.slice(0, 2).every((n) => n === 0);
        if (performance.now() > noteUntil) note(scene, null, empty
          ? `Không còn quái gần; hết đan HP, vẫn chờ đạt ${settings.recoveryHpPercent}%.`
          : finite(cd) && cd > 0 ? `Không còn quái gần; đan HP còn hồi ${cd.toFixed(1)} giây.`
            : `Không còn quái gần; chờ HP đạt ${settings.recoveryHpPercent}%.`);
        return true;
      }
      if ((danger || cooldownKite) && hasDodgePreference()) {
        const escape = job && inside(bounds, job.point) ? job : null;
        if (danger && tryDash(scene, host, time, pos, bounds, hazards, escape, avoidanceBoss,
          retreating)) return true;
      }
      if (job && (!inside(bounds, job.point) || hazards.some((area) => distance(area, job.point) <= area.radius + 0.7)
          || !pathSafe(scene, pos, job.navigation.path.length ? job.navigation.path : [[job.point.x, job.point.y]], bounds, hazards)
          || (retreating && threats.length
            && threatExposure(job.point, threats) >= threatExposure(pos, threats) - 0.05))) release();
      if (!job && time >= retryAt) {
        const next = destination(scene, host, pos, avoidanceBoss, hazards, retreating, bounds, threats);
        if (next) {
          const navigation = Object.assign(Object.create(scene.auto), { path: next.path.slice(),
            goalX: next.point.x, goalY: next.point.y, pathAt: time, lastX: pos.x, lastY: pos.y,
            stillSince: time, sideUntil: 0, sideX: 0, sideY: 0, stuckCount: 0 });
          job = { ...next, navigation, startedAt: time, progressAt: time,
            steer: null, emergency: danger };
          note(scene, danger ? "hazard" : "kite",
            danger ? "Đang thoát vùng cảnh báo kỹ năng."
              : retreating ? "Đang chọn đường rút lui tránh nhóm quái khi HP thấp."
                : "Skill tấn công đang hồi; đang giữ khoảng cách chờ hồi.");
        } else {
          retryAt = time + 1.5;
          if (performance.now() > noteUntil) note(scene, "no_route", retreating
            ? "Không có đường rút lui giảm nguy cơ trong vùng farm; đã dừng di chuyển và chờ hồi HP."
            : "Không có đường né cảnh báo kỹ năng an toàn trong vùng farm.");
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
      const holdRecovery = (retreating || returnIntent) && holdForRecoveryData(scene, time,
        "Dữ liệu rút lui không phù hợp; đang giữ trạng thái và chờ dữ liệu mới.");
      if (!holdRecovery) {
        cancelRetreat();
        note(scene, "unsupported", "Dữ liệu né boss không phù hợp; đã nhường Auto Farm.");
      }
      return holdRecovery;
    }
  }
  function guard() {
    const scene = binding?.scene;
    if (!scene) return;
    if (sceneNow() !== scene || binding.auto !== scene.auto || !scene.sys?.isActive?.()
        || globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() !== true) { detach(); return; }
    if ((retreating || returnIntent) && !scene.self) {
      holdForRecoveryData(scene, NaN, "Chưa có dữ liệu nhân vật; đang giữ hồi phục và chờ snapshot mới.");
      return;
    }
    if (unsafeAreas.length && !scene.self) {
      holdForRecoveryData(scene, NaN, "Chưa có dữ liệu nhân vật; đang giữ vùng tránh tạm tới khi có snapshot mới.");
      return;
    }
    if (unsafeAreas.length && (scene.self?.dead || !connected(scene)
        || GSTFarmInput.movement(scene) || scene.auto?.moved)) { cancelRetreat(); return; }
    let time;
    try { time = scene.now(); } catch { time = NaN; }
    if (retreating && !finite(time)) {
      holdForRecoveryData(scene, time, "Dữ liệu thời gian tạm thời không hợp lệ; đang giữ trạng thái hồi phục.");
      return;
    }
    if ((retreating || returnIntent) && !retreatOwnerValid(scene)) { cancelRetreat(); return; }
    const imminent = imminentWarning(scene, time);
    if (blocked(scene, imminent || criticalRetreat(scene))) {
      release(); cooldownHolding = false;
      if (retreating && !retreatOwnerValid(scene)) cancelRetreat();
      else if (retreating && !retreatContextValid(scene, time))
        holdForRecoveryData(scene, time, "Đang chờ trạng thái hồi phục hợp lệ trước khi điều khiển tiếp.");
      return;
    }
    // WorldScene skips auto.update while aiming or waiting to cast. Only an
    // imminent boss warning may interrupt that state, from this existing
    // preupdate guard; ordinary dodge/movement still uses GSTFarmUpdate.
    if ((!scene.aiming && !scene.pendingSkill) || !hasDodgePreference()
        || (finite(scene.dashT) && scene.dashT > 0)) return;
    if (!imminent) return;
    const pos = { x: scene.px, y: scene.py }, bounds = zone(scene);
    if (!bounds || !inside(bounds, pos)) return;
    const hazards = activeHazards(scene, time);
    const host = scene.autoHost?.();
    if (!host || typeof host.clear !== "function" || typeof host.route !== "function") return;
    const boss = nearbyBoss(scene, pos);
    // Q is the game's native dash and can run before auto.update resumes.
    if (tryDash(scene, host, time, pos, bounds, hazards, null,
        settings.bossDodge || retreating ? boss : null, false)) {
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
    cancelRetreat(); retryAt = 0; dashObservation = null;
    recentDamage.clear(); threatSample = []; threatSampleAt = -Infinity; threatSampleScene = null;
    areaThreatSamples.clear();
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
      if (event?.e === "dmg" && event.kind === "p" && event.id === scene.you
          && Number.isSafeInteger(event.by)) {
        const attacker = scene.views?.get?.(event.by);
        if (attacker?.k === "m" && !attacker.dead
            && globalThis.GSTFarmMonsterClassification?.classify?.(attacker)) {
          const time = scene.now();
          if (finite(time)) {
            recentDamage.set(attacker.id, time + 8);
            while (recentDamage.size > 16) recentDamage.delete(recentDamage.keys().next().value);
            threatSampleAt = -Infinity;
          }
        }
        return;
      }
      if (event?.e !== "cast" || !finite(event.ax) || !finite(event.ay)) return;
      const caster = scene.views?.get?.(event.id);
      const playerPos = { x: scene.px, y: scene.py };
      const isBoss = bossActor(caster);
      const isElite = eliteActor(caster);
      const sourceClass = globalThis.GSTFarmMonsterClassification?.classify?.(caster) ?? null;
      const uncertainMonster = settings.bossDodge && event.id !== scene.you
        && (!caster || caster.k === "m" && !caster.dead && caster.st?.cls !== "pet" && sourceClass === null);
      const sealMonster = globalThis.GSTFarmSeals?.pending?.(scene)
        && caster?.k === "m" && !caster.dead && caster.st?.cls !== "pet"
        && finite(caster.x) && finite(caster.y)
        && distance(caster, playerPos) <= 11
        && event.key !== "Q" && event.key !== "Space";
      if ((!isBoss && !isElite && !sealMonster && !uncertainMonster) || (isBoss && !scene.self?.combat
          && scene.auto?.target !== caster.id && !globalThis.GSTMapTravel?.active?.(scene)
          && !globalThis.GSTFarmSeals?.pending?.(scene))
          || distance(playerPos, { x: event.ax, y: event.ay }) > 7) return;
      // Ordinary monster cast locations are only cautious estimates; real
      // realm.hazards remain the preferred authoritative zone source.
      const radius = isBoss ? 3.5 : 2.3;
      const category = isElite ? "elite" : isBoss ? "boss" : "unknown";
      if (rememberWarning(scene, event.ax, event.ay, radius, 0.9,
          isElite ? "elite_cast_estimate" : "cast_estimate", category)
          && performance.now() > noteUntil)
        note(scene, isElite ? "hazard" : "boss_cast", isElite
          ? "Phát hiện cảnh báo kỹ năng tinh anh gần nhân vật; đang ưu tiên né."
          : "Phát hiện cảnh báo chiêu gần nhân vật; đang ưu tiên thoát vùng nguy hiểm.");
    });
  }
  function attach(scene) {
    if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || !enabled(scene) || suspended || !scene?.auto) { detach(); return; }
    if (binding?.scene === scene && binding.auto === scene.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.update !== "function" || !scene.events?.on
        || !scene.events.off || typeof scene.auto?.walk !== "function") return;
    // Urgent boss avoidance must be evaluated before optional close-range combat.
    const owner = { scene, auto: scene.auto, mapKey: scene.autoHost?.()?.mapKey?.(),
      remove: GSTFarmUpdate.add(scene, 1, update) };
    binding = owner;
    watchWarnings(owner);
    scene.events.on("preupdate", guard);
    scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmBossSafety = {
    configure(scene, value) {
      const stopRetreat = settings.bossRetreat === true && value.bossRetreat === false
        && (retreating || returnIntent);
      const retreatHpPercent = value.retreatHpPercent, recoveryHpPercent = value.recoveryHpPercent;
      const hpThresholds = Number.isSafeInteger(retreatHpPercent) && retreatHpPercent >= 1
        && Number.isSafeInteger(recoveryHpPercent) && retreatHpPercent < recoveryHpPercent && recoveryHpPercent <= 100
        ? { retreatHpPercent, recoveryHpPercent } : { retreatHpPercent: 40, recoveryHpPercent: 100 };
      settings = { targetMode: value.targetMode, bossDodge: value.bossDodge !== false,
        eliteDodge: value.eliteDodge === true,
        bossRetreat: value.bossRetreat !== false, enabled: value.enabled === true,
        radius: value.radius, searchScope: value.searchScope, noRetreat: value.noRetreat !== false,
        ...hpThresholds };
      retreatThreshold = settings.retreatHpPercent / 100;
      recoveryThreshold = settings.recoveryHpPercent / 100;
      if (stopRetreat) cancelRetreat();
      this.attach(scene);
    },
    attach(scene) { try { attach(scene); } catch { detach(); } },
    emergency,
    controls: (scene) => !!binding && binding.scene === scene
      && (job !== null || retreating || !!returnIntent && returnIntent.phase !== "excluded" || cooldownHolding),
    retreating: (scene) => !!binding && binding.scene === scene
      && (retreating || !!returnIntent && returnIntent.phase !== "excluded"),
    allowsTarget: (scene, point) => !excludedArea(scene, point),
    allowsSegment: (scene, from, to) => allowsSegment(scene, from, to),
    hasExclusions: (scene) => hasUnsafeAreas(scene),
    isAreaExcluded: (scene, point) => !!excludedArea(scene, point),
    status(scene) {
      if (binding?.scene !== scene || !scene?.auto?.on) return "";
      if (performance.now() < noteUntil) return message;
      if (retreating) return `HP thấp: đang rút lui khỏi nhóm quái; chờ đạt ${settings.recoveryHpPercent}% rồi mới tiếp tục farm.`;
      if (returnIntent?.scene === scene && returnIntent.phase !== "excluded")
        return "Đang giữ chọn mục tiêu; đánh giá đường an toàn để về tâm farm sau hồi phục.";
      if (cooldownHolding) return "Đang giữ khoảng cách với boss và chờ skill tấn công hồi.";
      return job ? "Đang di chuyển tránh vòng cảnh báo hoặc giữ khoảng cách với boss." : "";
    },
    snapshot: () => ({ build: "boss-safety-1", active: !!job, retreating,
      events: log.slice(-30).map((row) => ({ ...row })) })
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmBossSafety.attach(sceneNow()); });
})();
