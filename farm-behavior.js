(() => {
  "use strict";
  const finite = Number.isFinite;
  let settings = { idleMode: "hold", avoidEnabled: false, avoidLevel: 10, avoidDistance: 2, enabled: false, radius: 22 };
  let binding = null, job = null, configured = false, suspended = false, manualUntil = 0, retryAt = 0, noteUntil = 0, message = "";
  const hits = new Map();
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const connected = (scene) => scene.driver && !scene.driver.closing && !scene.driver.reconnecting
    && !scene.driver.displaced && (scene.driver.online === false || scene.driver.link?.open?.() === true);
  function dangerous(actor) {
    return actor?.k === "m" && !actor.dead && actor.st?.cls !== "pet"
      && finite(actor.st?.lv) && actor.st.lv >= settings.avoidLevel && finite(actor.x) && finite(actor.y);
  }
  function threats(scene, now) {
    const result = [];
    for (const [id, at] of hits) {
      const actor = scene.views.get(id);
      if (now - at > 8 || !dangerous(actor)) hits.delete(id);
      else result.push(actor);
    }
    return result;
  }
  function segmentDistance(point, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y, length = dx * dx + dy * dy;
    const t = length ? Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / length)) : 0;
    return Math.hypot(point.x - a.x - dx * t, point.y - a.y - dy * t);
  }
  const reach = (actor) => Math.max(3, (finite(actor.radius) ? actor.radius : 0) + 1.6);
  function say(text, seconds = 4) { message = text; noteUntil = performance.now() + seconds * 1000; }
  function release(reason) {
    if (job && binding) {
      const scene = binding.scene;
      if (job.steer && scene.autoX === job.steer[0] && scene.autoY === job.steer[1]) scene.autoX = scene.autoY = 0;
      if (scene.auto.on && scene.auto.target === job.target && finite(scene.now())) {
        scene.auto.chaseSince = scene.now(); scene.auto.think = 0;
      }
    }
    job = null;
    if (reason) say(reason);
  }
  function manual(scene) {
    return GSTFarmInput.movement(scene) || scene.pendingSkill || scene.aiming || scene.heldAttack
      || scene.auto.moved || scene.now() < scene.auto.pauseUntil;
  }
  function blocked(scene) {
    return !scene.auto.on || !scene.self || scene.self.dead || !connected(scene) || scene.leaving
      || GSTFarmRouting.blocked(scene) || scene.keyCapture || scene.overlay?.dialogOpen || scene.harvesting
      || scene.self.med || scene.self.fish || scene.auto.resting
      || (scene.self.realm?.inside?.protection ?? 0) > 0;
  }
  function modal(owner) {
    if (performance.now() - owner.modalAt >= 250) {
      owner.modalAt = performance.now();
      owner.modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
        el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    }
    return owner.modal;
  }
  function guard() {
    const scene = binding?.scene;
    if (!scene) return;
    if (sceneNow() !== scene || scene.auto !== binding.auto || !scene.sys?.isActive?.()) { detach(); return; }
    if (!scene.auto.on || scene.self?.dead || !connected(scene) || scene.leaving) {
      release(); hits.clear(); manualUntil = 0; message = ""; return;
    }
    if (manual(scene) || (job && scene.castAt !== job.castAt)) {
      manualUntil = performance.now() + 3000;
      release("Tạm nhường thao tác tay; chờ 3 giây rồi tiếp tục né/farm.");
    } else if (job && blocked(scene)) release("Nhường hồi phục hoặc giao diện game.");
  }
  function recordHit(scene, event) {
    if (!settings.avoidEnabled || suspended || !scene.auto.on || scene.self?.dead
        || event?.e !== "dmg" || event.kind !== "p" || event.id !== scene.you || !finite(event.v) || event.v <= 0) return;
    // Observe the existing event only. Do not infer an attacker from proximity or HP drops.
    if (!Number.isSafeInteger(event.by) || !dangerous(scene.views.get(event.by))) {
      if (!Number.isSafeInteger(event.by) || !scene.views.has(event.by)) {
        say("Nhận sát thương chưa rõ nguồn; không đoán quái để né.");
      }
      return;
    }
    hits.set(event.by, scene.now());
    if (hits.size > 16) hits.delete(hits.keys().next().value);
    say(`Đã nhận đòn từ quái level ${scene.views.get(event.by).st.lv}; chuẩn bị né.`);
  }
  function area(scene) {
    const home = GSTHarvest.farmOrigin(scene) ?? { x: scene.auto.ax, y: scene.auto.ay };
    return { home, radius: settings.enabled && settings.searchScope === "map" ? Infinity : settings.enabled ? settings.radius : 11,
      w: scene.map?.w, h: scene.map?.h, whole: settings.enabled && settings.searchScope === "map" };
  }
  function safePath(scene, points, origin, zone, primary) {
    if (!Array.isArray(points) || !points.length || !finite(zone.home.x) || !finite(zone.home.y)) return false;
    // Include unfiltered monsters so the level/boss target filter cannot hide danger.
    const nearby = [...scene.views.values()].filter(dangerous);
    let previous = origin, length = 0;
    for (const point of points) {
      if (!Array.isArray(point) || point.length < 2 || !finite(point[0]) || !finite(point[1])) return false;
      const next = { x: point[0], y: point[1] };
      if (dist(next, zone.home) > zone.radius || zone.whole && (!finite(zone.w) || !finite(zone.h)
          || next.x < 0 || next.y < 0 || next.x >= zone.w || next.y >= zone.h)) return false;
      length += dist(previous, next);
      if (length > settings.avoidDistance * 2 + 2) return false;
      for (const actor of nearby) {
        const clearance = Math.min(reach(actor), dist(actor, origin));
        if (segmentDistance(actor, previous, next) < clearance - 0.1) return false;
      }
      previous = next;
    }
    return dist(previous, primary) >= dist(origin, primary) + 0.1;
  }
  function destination(scene, host, primary, origin) {
    const zone = area(scene), angle = Math.atan2(origin.y - primary.y, origin.x - primary.x);
    for (const offset of [0, 0.5, -0.5, 1, -1, 1.5, -1.5]) {
      const point = { x: origin.x + Math.cos(angle + offset) * settings.avoidDistance,
        y: origin.y + Math.sin(angle + offset) * settings.avoidDistance };
      if (dist(point, zone.home) > zone.radius || zone.whole && (!finite(zone.w) || !finite(zone.h)
          || point.x < 0 || point.y < 0 || point.x >= zone.w || point.y >= zone.h)) continue;
      const route = host.clear(origin.x, origin.y, point.x, point.y)
        ? [[point.x, point.y]] : host.route(origin.x, origin.y, point.x, point.y);
      const path = Array.isArray(route) ? [...route, [point.x, point.y]] : null;
      if (dist(point, primary) >= dist(origin, primary) + 0.5
          && safePath(scene, path, origin, zone, primary)) return { point, path, zone };
    }
    return null;
  }
  function update(host, time) {
    const scene = binding?.scene;
    try {
      if (!scene || !settings.avoidEnabled || suspended || blocked(scene) || !finite(time)) { release(); return false; }
      if (manual(scene) || performance.now() < manualUntil || modal(binding)) { release(); return false; }
      if (typeof GSTHarvest.needsRecovery !== "function" || GSTHarvest.needsRecovery(scene)) { release(); return false; }
      if (!["clear", "route", "steer"].every((key) => typeof host[key] === "function")) { release(); return false; }
      const pos = { x: scene.px, y: scene.py };
      if (!finite(pos.x) || !finite(pos.y)) { release(); return false; }
      const active = threats(scene, time).sort((a, b) => dist(a, pos) - dist(b, pos));
      if (!job) {
        if (time < retryAt || !active.length) return false;
        const primary = active.find((actor) => time - hits.get(actor.id) <= 1.5 && hits.get(actor.id) > binding.usedHit);
        // Start only after a fresh hit. Nearness alone cannot start repeated retreats.
        if (!primary) return false;
        const hitAt = hits.get(primary.id);
        binding.usedHit = hitAt;
        const next = destination(scene, host, primary, pos);
        retryAt = time + 3;
        if (!next) { say("Không có đường né ngắn an toàn trong vùng farm; nhường xử lý gốc."); return false; }
        const navigation = Object.assign(Object.create(scene.auto), { path: next.path, goalX: next.point.x,
          goalY: next.point.y, pathAt: time, lastX: pos.x, lastY: pos.y, stillSince: time,
          sideUntil: 0, sideX: 0, sideY: 0, stuckCount: 0 });
        job = { ...next, navigation, id: primary.id, start: time, target: scene.auto.target, castAt: scene.castAt,
          steer: null, primaryDistance: dist(pos, primary) };
      }
      const primary = active.find((actor) => actor.id === job.id);
      if (!primary || GSTNavigation.arrived(scene, job.navigation, host, job.point.x, job.point.y, 0.35) || time - job.start > 3
          || (dist(primary, pos) >= reach(primary) + 0.75 && dist(primary, pos) >= job.primaryDistance + 0.5)) {
        retryAt = time + 3; release("Đã kết thúc lượt né; tiếp tục tìm quái phù hợp."); return false;
      }
      const goal = job.point, owner = job;
      GSTNavigation.prune(scene, owner.navigation, host);
      while (owner.navigation.path.length > 1 && Math.hypot(pos.x - owner.navigation.path[0][0], pos.y - owner.navigation.path[0][1]) < 0.35) {
        owner.navigation.path.shift();
      }
      if (!safePath(scene, owner.navigation.path.length ? owner.navigation.path : [[goal.x, goal.y]], pos, owner.zone, primary)) {
        retryAt = time + 3; release("Quái đã chặn đường né; dừng lượt né và nhường xử lý gốc."); return false;
      }
      const walkingHost = { ...host,
        clear: (x, y, gx, gy) => host.clear(x, y, gx, gy)
          && safePath(scene, [[gx, gy]], { x, y }, owner.zone, primary),
        route: (x, y, gx, gy) => {
          const route = host.route(x, y, gx, gy);
          return safePath(scene, route, { x, y }, owner.zone, primary) ? route : null;
        },
        steer: (x, y) => {
          const next = { x: pos.x + x * 0.25, y: pos.y + y * 0.25 };
          if (!finite(x) || !finite(y) || dist(next, owner.zone.home) > owner.zone.radius
              || owner.zone.whole && (!finite(owner.zone.w) || !finite(owner.zone.h) || next.x < 0 || next.y < 0
                || next.x >= owner.zone.w || next.y >= owner.zone.h)
              || [...scene.views.values()].filter(dangerous).some((actor) =>
                segmentDistance(actor, pos, next) < Math.min(reach(actor), dist(pos, actor)) - 0.1)) {
            owner.denied = true; x = 0; y = 0;
          }
          scene.autoX = x; scene.autoY = y;
          if (job === owner) owner.steer = [x, y];
        }
      };
      if (!GSTNavigation.walk(scene, owner.navigation, walkingHost, time, pos.x, pos.y, goal.x, goal.y, 0.35) || owner.denied) {
        retryAt = time + 3; release("Đường né bị chặn; dừng thử và nhường Auto Farm."); return false;
      }
      say(`Đang né quái level ${primary.st.lv} · lùi tối đa ${settings.avoidDistance} ô.`);
      return true;
    } catch { release("Interface né quái chưa phù hợp; đã nhường lại game."); return false; }
  }
  function wrap(owner, object, key, factory) {
    const original = object[key], descriptor = Object.getOwnPropertyDescriptor(object, key);
    const wrapper = factory(original); object[key] = wrapper;
    owner.undo.push(() => {
      if (object[key] !== wrapper) return;
      if (descriptor) Object.defineProperty(object, key, descriptor); else delete object[key];
    });
  }
  function detach() {
    release();
    const old = binding; binding = null;
    if (old) {
      old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
      for (const undo of old.undo.reverse()) undo();
    }
    hits.clear(); retryAt = 0; manualUntil = 0;
  }
  function attach(scene) {
    if (!configured || suspended || (settings.idleMode !== "hold" && !settings.avoidEnabled)) { detach(); return; }
    if (binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || !scene.self || !connected(scene) || typeof scene.auto?.idle !== "function"
        || typeof scene.auto.walk !== "function" || typeof scene.auto.update !== "function" || typeof scene.onEvent !== "function"
        || typeof scene.views?.get !== "function" || typeof scene.views?.values !== "function"
        || typeof scene.auto.lootSkip?.has !== "function" || typeof scene.now !== "function" || !scene.events?.on || !scene.events.off) return;
    const owner = { scene, auto: scene.auto, undo: [], modalAt: -Infinity, modal: false, usedHit: -Infinity, idleAt: -Infinity };
    binding = owner;
    wrap(owner, scene.auto, "idle", (original) => function (host, time, x, y) {
      if (this !== owner.auto || !this.on || settings.idleMode !== "hold" || blocked(scene)
          || typeof host.loot !== "function" || typeof host.steer !== "function") return original.call(this, host, time, x, y);
      const loot = host.loot();
      if (!Array.isArray(loot) || loot.some((item) => finite(item.x) && finite(item.y)
          && Math.hypot(item.x - this.ax, item.y - this.ay) < 11
          && !this.lootSkip.has(`${item.x.toFixed(1)},${item.y.toFixed(1)}`))) return original.call(this, host, time, x, y);
      host.steer(0, 0); this.stillSince = time;
      owner.idleAt = performance.now();
    });
    if (settings.avoidEnabled) wrap(owner, scene, "onEvent", (original) => function (...args) {
      const result = original.apply(this, args);
      try { if (this === scene) recordHit(scene, args[0]); } catch { /* Never break native event handling. */ }
      return result;
    });
    owner.undo.push(GSTFarmUpdate.add(scene, 2, update));
    scene.events.on("preupdate", guard); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmBehavior = {
    configure(scene, value) {
      configured = true;
      const next = { idleMode: value.idleMode === "home" ? "home" : "hold", avoidEnabled: value.avoidEnabled === true,
        avoidLevel: Number.isSafeInteger(value.avoidLevel) && value.avoidLevel > 0 ? value.avoidLevel : 10,
        avoidDistance: finite(value.avoidDistance) ? Math.max(1, Math.min(6, value.avoidDistance)) : 2,
        enabled: value.enabled === true, radius: value.radius, searchScope: value.searchScope };
      if (Object.keys(next).some((key) => settings[key] !== next[key])) detach();
      settings = next; this.attach(scene);
    },
    attach(scene) { try { attach(scene); } catch { detach(); say("Chưa gắn được hành vi chờ/né quái."); } },
    controls: (scene) => !!binding && binding.scene === scene && job !== null,
    status(scene) {
      if (!scene?.auto?.on) return "";
      if (!binding || binding.scene !== scene) return settings.avoidEnabled ? "Chưa gắn được cơ chế né quái; chưa có lệnh né." : "";
      if (performance.now() < noteUntil) return message;
      return performance.now() - binding.idleAt < 1500
        ? "Hết mục tiêu phù hợp và đồ cần nhặt; đang đứng chờ quái xuất hiện." : "";
    },
    allowsTarget(scene, enemy) {
      if (!settings.avoidEnabled || binding?.scene !== scene) return true;
      if (!finite(enemy.lv) || enemy.lv >= settings.avoidLevel) return false;
      const pos = { x: scene.px, y: scene.py };
      return threats(scene, scene.now()).every((actor) => segmentDistance(actor, pos, enemy) >= Math.min(reach(actor), dist(pos, actor)) - 0.1
        && dist(actor, enemy) >= reach(actor));
    }
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmBehavior.attach(sceneNow()); });
})();
