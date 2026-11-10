(() => {
  "use strict";
  // This is an extension reaction threshold, not the game's attack range.
  const nearby = 1.3, finite = Number.isFinite;
  let enabled = false, configured = false, suspended = false, binding = null, episode = null, continuation = null;
  let message = "Chờ cài đặt tự vệ.", idleSince = null, idlePoint = null, lastIdleAt = -Infinity;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const boss = (actor) => actor?.st?.cls === "boss" || actor?.st?.wb === true;
  const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const actorFor = (scene, id) => {
    const actor = scene.views?.get?.(id);
    return actor?.id === id && actor?.k === "m" && actor.st && typeof actor.st.cls === "string" && actor.st.cls !== "pet"
      && !actor.dead && finite(actor.x) && finite(actor.y) ? actor : null;
  };
  function clearEpisode(note, retainContinuation = false) {
    const old = episode, scene = binding?.scene;
    episode = null;
    if (!retainContinuation) continuation = null;
    lastIdleAt = -Infinity; idleSince = null; idlePoint = null;
    if (old && scene) {
      if (old.steer && scene.autoX === old.steer[0] && scene.autoY === old.steer[1]) scene.autoX = scene.autoY = 0;
      if (old.facing && scene.lockId === old.id && scene.faceX === old.facing[0] && scene.faceY === old.facing[1]) {
        scene.lockId = old.previousLock; scene.faceX = old.previousFace[0]; scene.faceY = old.previousFace[1];
      }
    }
    if (note) message = note;
  }
  function otherOwner(scene) {
    return globalThis.GSTMapTravel?.active?.(scene) || globalThis.GSTQuest?.active?.(scene)
      || globalThis.GSTFarmSeals?.pending?.(scene) || globalThis.GSTFarmBehavior?.pendingLoot?.(scene)
      || globalThis.GSTFarmMap?.nativeHandling?.(scene)
      || ["GSTMapTravel", "GSTQuest", "GSTRealm", "GSTChest", "GSTFarmSeals", "GSTHarvest", "GSTFarmMap", "GSTFarmBossSafety"]
        .some((name) => globalThis[name]?.controls?.(scene));
  }
  function available(scene, host) {
    const d = scene.driver;
    return scene.sys?.isActive?.() && sceneNow() === scene && scene.auto === binding.auto
      && Number.isSafeInteger(scene.you) && scene.self && !scene.self.dead && !scene.leaving && d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true) && finite(scene.px) && finite(scene.py)
      && finite(scene.now()) && typeof host?.mapKey === "function" && typeof host.clear === "function"
      && typeof host.face === "function" && typeof host.basic === "function" && typeof host.steer === "function"
      && typeof host.enemies === "function" && typeof scene.views?.get === "function"
      && (!scene.auto.on || scene.auto.skipped instanceof Map);
  }
  // All event and action paths must observe the same scene, player and map.
  function validateContext(scene, host) {
    if (!binding || binding.scene !== scene || !available(scene, host)) {
      clearEpisode("Tự vệ không khả dụng; chờ kết nối và dữ liệu game.");
      return false;
    }
    const key = host.mapKey();
    if (typeof key !== "string" || !key.trim()) {
      clearEpisode("Tự vệ không khả dụng; thiếu thông tin bản đồ.");
      return false;
    }
    const identity = `${scene.you}:${key}`;
    if (identity !== binding.identity || scene.auto.on !== binding.farmOn) {
      binding.identity = identity; binding.farmOn = scene.auto.on;
      clearEpisode("Tự vệ đang nhường; chờ trạng thái ổn định.");
      return false;
    }
    return true;
  }
  function blocked(scene) {
    return GSTFarmInput.movement(scene) || scene.pendingSkill || scene.aiming || scene.heldAttack
      || scene.keyCapture || scene.chat?.typing || scene.inputFieldActive?.() || scene.panels?.open
      || scene.uiBlocked || scene.overlay?.dialogOpen || scene.harvesting || scene.nav || scene.self.med || scene.self.fish
      || scene.auto.resting || scene.dashT > 0 || (scene.self.realm?.inside?.protection ?? 0) > 0
      || (scene.auto.on && (scene.auto.moved || scene.now() < scene.auto.pauseUntil))
      || globalThis.GSTHarvest?.needsRecovery?.(scene) || GSTFarmRouting.blocked(scene) || otherOwner(scene);
  }
  function nativeBusy(scene, host) {
    if (!scene.auto.on) return false;
    if (scene.auto.target) return true;
    const radius = globalThis.GSTFarmCompatibility?.nativeRadius(scene.auto.radius);
    const enemies = host.enemies();
    if (!finite(radius) || !Array.isArray(enemies) || !finite(scene.auto.ax) || !finite(scene.auto.ay)) return true;
    return enemies.some((e) => !e.dead && (e.hostile === true || e.aggro === false)
      && finite(e.x) && finite(e.y) && Math.hypot(e.x - scene.auto.ax, e.y - scene.auto.ay) < radius
      && !(scene.auto.skipped?.get?.(e.id) > scene.now()));
  }
  function rawEnemies(host) {
    const enemies = typeof host.gstRawEnemies === "function" ? host.gstRawEnemies() : host.enemies();
    return Array.isArray(enemies) ? enemies : [];
  }
  function hostileRecord(host, id) {
    return rawEnemies(host).find((enemy) => enemy?.id === id && enemy.hostile === true) ?? null;
  }
  function threatCandidates(scene, host, pos) {
    const result = new Map();
    for (const enemy of rawEnemies(host)) {
      if (enemy?.hostile !== true || !Number.isSafeInteger(enemy.id)) continue;
      const actor = actorFor(scene, enemy.id);
      if (actor && distance(pos, actor) <= 3.2) result.set(actor.id, actor);
    }
    // Keep visible nearby bosses in the retreat safety set even when their
    // ordinary-target record is absent from the host list.
    for (const actor of scene.views.values()) {
      if (actor?.k === "m" && !actor.dead && boss(actor) && finite(actor.x) && finite(actor.y)
          && distance(pos, actor) <= 3.2) result.set(actor.id, actor);
    }
    return [...result.values()];
  }
  function nearbyBoss(scene, pos) {
    return [...scene.views.values()].some((actor) => actor?.k === "m" && !actor.dead && boss(actor)
      && finite(actor.x) && finite(actor.y) && distance(pos, actor) <= 3.2);
  }
  function boundary(scene, point) {
    if (!finite(scene.map?.w) || !finite(scene.map?.h) || point.x < 0 || point.y < 0
        || point.x >= scene.map.w || point.y >= scene.map.h) return false;
    if (!scene.auto.on) return true;
    const origin = globalThis.GSTHarvest?.farmOrigin?.(scene) ?? { x: scene.auto.ax, y: scene.auto.ay };
    const radius = binding.scope === "map" && binding.expanded ? Infinity
      : binding.expanded ? binding.radius : globalThis.GSTFarmCompatibility?.nativeRadius(scene.auto.radius);
    return finite(origin?.x) && finite(origin?.y) && (finite(radius) || radius === Infinity)
      && distance(point, origin) <= radius;
  }
  function retreat(scene, host, attackers) {
    const pos = { x: scene.px, y: scene.py };
    const away = attackers.reduce((sum, actor) => {
      const dx = pos.x - actor.x, dy = pos.y - actor.y, length = Math.hypot(dx, dy) || 1;
      return { x: sum.x + dx / length, y: sum.y + dy / length };
    }, { x: 0, y: 0 });
    if (Math.hypot(away.x, away.y) < 0.1) return null;
    const angle = Math.atan2(away.y, away.x);
    for (const offset of [0, 0.5, -0.5, 1, -1]) {
      const point = { x: pos.x + Math.cos(angle + offset) * 2, y: pos.y + Math.sin(angle + offset) * 2 };
      const dx = point.x - pos.x, dy = point.y - pos.y;
      const clearsThreats = attackers.every((actor) => dx * (pos.x - actor.x) + dy * (pos.y - actor.y) > 0);
      if (clearsThreats && boundary(scene, pos) && boundary(scene, point)
          && host.clear(pos.x, pos.y, point.x, point.y)) return point;
    }
    return null;
  }
  function record(event) {
    const scene = binding?.scene;
    if (!scene || !enabled) return;
    try {
      const host = scene.autoHost();
      if (!validateContext(scene, host)) return;
      if (event?.e !== "dmg" || event.kind !== "p" || event.id !== scene.you || !finite(event.v) || event.v <= 0) return;
      const time = scene.now(), pos = { x: scene.px, y: scene.py };
      if (!finite(time)) return;
      if (blocked(scene) || nativeBusy(scene, host)) {
        clearEpisode("Tự vệ đang nhường thao tác khác."); return;
      }
      const attributed = Number.isSafeInteger(event.by);
      const identified = attributed ? actorFor(scene, event.by) : null;
      if (attributed && !identified) {
        message = "Tự vệ nhường: mã nguồn sát thương không còn trong dữ liệu quái."; return;
      }
      const threats = threatCandidates(scene, host, pos);
      if (identified && distance(pos, identified) <= 3.2 && !threats.some((actor) => actor.id === identified.id))
        threats.push(identified);
      if (!threats.length) {
        message = "Tự vệ nhường: không có quái thù địch gần để chọn an toàn."; return;
      }
      const threatIds = threats.map((actor) => actor.id);
      if (episode) {
        episode.hitAt = time;
        if (continuation) continuation.hitAt = time;
        const added = threatIds.some((id) => !episode.threatIds.includes(id));
        episode.threatIds = [...new Set([...episode.threatIds, ...threatIds])];
        episode.boss ||= threats.some(boss);
        episode.ambiguous = episode.threatIds.length > 1;
        if (added && episode.ambiguous || episode.boss) episode.attackAllowed = false;
        return;
      }
      const continuing = continuation && time >= continuation.hitAt && time <= continuation.until
        && continuation.ids.some((id) => threatIds.includes(id) && actorFor(scene, id));
      const stationary = performance.now() - lastIdleAt <= 1200 && idlePoint && distance(pos, idlePoint) <= 0.1;
      if (!continuing && !stationary) {
        message = "Tự vệ nhường: chưa xác nhận trạng thái đứng chờ gần đây."; return;
      }
      if (scene.autoX || scene.autoY || (finite(scene.castAt) && scene.castAt > time && !continuing)) return;
      lastIdleAt = -Infinity;
      continuation = { ids: threatIds, hitAt: time, until: time + 8 };
      const single = threats.length === 1 ? threats[0] : null;
      const canAttack = !!single && !boss(single) && !nearbyBoss(scene, pos)
        && hostileRecord(host, single.id) !== null && distance(pos, single) <= nearby;
      episode = { id: single?.id ?? threatIds[0], threatIds, boss: threats.some(boss), attackAllowed: canAttack,
        ambiguous: threats.length > 1, started: time, hitAt: time, farmOn: scene.auto.on };
      message = episode.boss ? "Tự vệ · chuẩn bị lùi khỏi boss; không dùng đòn đánh thường."
        : episode.ambiguous ? "Tự vệ nhường đòn đánh: có nhiều mối đe dọa; đang tìm hướng lùi an toàn."
        : canAttack ? "Tự vệ · đang kiểm tra đường tới quái gần."
        : "Tự vệ · chưa đủ dữ liệu cho đòn đánh thường; đang kiểm tra đường lùi.";
    } catch { clearEpisode("Tự vệ không khả dụng; thiếu dữ liệu game."); }
  }
  function guard() {
    const scene = binding?.scene;
    if (!scene) return;
    try {
      const host = scene.autoHost();
      if (!validateContext(scene, host)) return;
      if (blocked(scene) || nativeBusy(scene, host)) { clearEpisode("Tự vệ đang nhường thao tác khác."); return; }
      if (episode) return;
      const time = scene.now(), now = performance.now();
      if (continuation && (time < continuation.hitAt || time > continuation.until
          || !continuation.ids.some((id) => actorFor(scene, id)))) continuation = null;
      if (scene.autoX || scene.autoY) { clearEpisode("Tự vệ đang nhường di chuyển khác."); return; }
      if (scene.self.combat || (finite(scene.castAt) && scene.castAt > time)) {
        idleSince = null;
        if (now - lastIdleAt > 1200) { idlePoint = null; lastIdleAt = -Infinity; }
        return;
      }
      continuation = null;
      const pos = { x: scene.px, y: scene.py };
      if (!idlePoint || distance(pos, idlePoint) > 0.1) { idlePoint = pos; idleSince = now; }
      if (now - idleSince >= 350) { lastIdleAt = now; message = "Tự vệ bật · đang chờ."; }
    } catch { clearEpisode("Tự vệ không khả dụng; thiếu dữ liệu hoặc giao diện game."); }
  }
  function update(host, time) {
    const scene = binding?.scene, job = episode;
    if (!scene || !job) return false;
    try {
      const pos = { x: scene.px, y: scene.py };
      if (!validateContext(scene, host)) return false;
      if (blocked(scene) || nativeBusy(scene, host)) {
        clearEpisode("Tự vệ đang nhường thao tác khác."); return false;
      }
      const priorThreatIds = new Set(job.threatIds);
      const attackersById = new Map(job.threatIds.map((id) => actorFor(scene, id)).filter(Boolean).map((actor) => [actor.id, actor]));
      const visibleThreats = threatCandidates(scene, host, pos);
      const newThreatVisible = visibleThreats.some((actor) => !priorThreatIds.has(actor.id));
      for (const actor of visibleThreats) attackersById.set(actor.id, actor);
      const attackers = [...attackersById.values()];
      if (!attackers.length || time < job.started) {
        clearEpisode("Tự vệ đã dừng và nhường game."); return false;
      }
      if (newThreatVisible || attackers.length > job.threatIds.length) {
        job.ambiguous = true;
        job.attackAllowed = false;
      }
      job.boss ||= attackers.some(boss);
      job.threatIds = attackers.map((actor) => actor.id);
      if (time - job.started > 4 || time - job.hitAt > 3) {
        clearEpisode("Tự vệ đã kết thúc lượt; chờ đòn mới.", true); return false;
      }
      const attacker = attackers.length === 1 ? attackers[0] : null;
      const ordinaryThreat = attacker && !boss(attacker) && hostileRecord(host, attacker.id);
      if (job.attackAllowed && !job.boss && !job.goal && attacker && ordinaryThreat
          && !nearbyBoss(scene, pos) && distance(pos, attacker) <= nearby
          && host.clear(pos.x, pos.y, attacker.x, attacker.y)) {
        if (!job.facing) { job.previousLock = scene.lockId; job.previousFace = [scene.faceX, scene.faceY]; }
        if (!validateContext(scene, host)) return false;
        host.face(attacker.x, attacker.y, attacker.id); job.facing = [scene.faceX, scene.faceY];
        host.basic(); message = "Tự vệ · đã yêu cầu đòn đánh thường; chưa xác minh trúng đích."; return true;
      }
      if (!job.goal) {
        job.goal = retreat(scene, host, attackers);
        if (!job.goal) {
          clearEpisode(job.ambiguous ? "Tự vệ nhường: nhiều mối đe dọa và không có hướng lùi an toàn." : "Tự vệ nhường: không có đường lùi an toàn.", true);
          return false;
        }
      }
      if (!boundary(scene, pos) || !boundary(scene, job.goal) || !host.clear(pos.x, pos.y, job.goal.x, job.goal.y)
          || distance(pos, job.goal) <= 0.3 || time - job.started > 3) {
        clearEpisode("Tự vệ đã kết thúc lượt lùi.", true); return false;
      }
      const dx = job.goal.x - pos.x, dy = job.goal.y - pos.y, length = Math.hypot(dx, dy);
      // Distance from every current threat must not decrease along the escape direction.
      if (attackers.some((actor) => dx * (pos.x - actor.x) + dy * (pos.y - actor.y) <= 0)) {
        clearEpisode("Tự vệ nhường: đường lùi không còn an toàn.", true); return false;
      }
      if (!validateContext(scene, host)) return false;
      host.steer(dx / length, dy / length); job.steer = [scene.autoX, scene.autoY];
      message = job.boss ? "Tự vệ · đang đi lùi khỏi boss." : job.ambiguous
        ? "Tự vệ · đang lùi khỏi nhóm mối đe dọa đã thấy." : "Tự vệ · đang đi lùi khỏi quái gần.";
      return true;
    } catch { clearEpisode("Tự vệ không khả dụng; đã nhường game."); return false; }
  }
  function detach() {
    clearEpisode(); const old = binding; binding = null;
    if (!old) return;
    old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    old.removeInput(); old.removeEvent(); old.removeUpdate();
  }
  function manual(event) {
    if (event.isTrusted && !event.repeat && !event.target?.closest?.("input,textarea,select,[contenteditable=true]"))
      clearEpisode("Tự vệ đang nhường thao tác tay.");
  }
  function attach(scene) {
    if (!enabled || !configured || suspended) { detach(); return; }
    if (binding?.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.auto || !scene.self || !scene.events?.on || !scene.events?.off || typeof scene.auto.update !== "function"
        || typeof scene.autoHost !== "function" || typeof scene.onEvent !== "function" || typeof scene.startClickOrder !== "function") {
      message = "Tự vệ không khả dụng; đang chờ scene và giao diện game."; return;
    }
    try {
      const host = scene.autoHost(), key = host.mapKey();
      if (!key) throw new Error("Map identity unavailable");
      binding = { scene, auto: scene.auto, identity: `${scene.you}:${key}`, farmOn: scene.auto.on,
        scope: settings.searchScope, expanded: settings.enabled, radius: settings.radius };
      binding.removeEvent = GSTFarmEvents.add(scene, record);
      binding.removeInput = GSTFarmInput.add(scene, (accepted) => { if (accepted) clearEpisode("Tự vệ đang nhường thao tác tay."); });
      binding.removeUpdate = GSTFarmUpdate.add(scene, 1.25, update);
      scene.events.on("preupdate", guard); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
      message = "Tự vệ bật · đang chờ.";
    } catch {
      const old = binding; binding = null;
      old?.removeInput?.(); old?.removeEvent?.(); old?.removeUpdate?.();
      message = "Tự vệ không khả dụng; thiếu giao diện game.";
    }
  }
  let settings = {};
  globalThis.GSTFarmDefense = {
    configure(scene, value) {
      const changed = enabled !== (value.selfDefense === true);
      settings = value; enabled = value.selfDefense === true; configured = true;
      if (changed) detach();
      if (binding) { binding.scope = value.searchScope; binding.expanded = value.enabled; binding.radius = value.radius; }
      attach(scene);
    },
    attach,
    controls: (scene) => binding?.scene === scene && episode !== null,
    status(scene, includeIdle = false) {
      if (!enabled || !scene || sceneNow() !== scene) return "";
      if (!binding || binding.scene !== scene) return includeIdle ? "Tự vệ không khả dụng; đang chờ scene." : "";
      try {
        const host = scene.autoHost(), key = host?.mapKey?.();
        if (typeof key !== "string" || !key.trim())
          return includeIdle ? "Tự vệ không khả dụng; thiếu thông tin bản đồ." : "";
        if (`${scene.you}:${key}` !== binding.identity || scene.auto.on !== binding.farmOn) return "";
        if (!available(scene, host)) return includeIdle ? "Tự vệ không khả dụng; chờ kết nối và dữ liệu game." : "";
        return episode || includeIdle ? message : "";
      } catch { return includeIdle ? "Tự vệ không khả dụng; thiếu dữ liệu game." : ""; }
    }
  };
  window.addEventListener("keydown", manual, true);
  window.addEventListener("pointerdown", (event) => {
    if (event.isTrusted && event.target instanceof HTMLCanvasElement) clearEpisode("Tự vệ đang nhường thao tác tay.");
  }, true);
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; attach(sceneNow()); });
})();
