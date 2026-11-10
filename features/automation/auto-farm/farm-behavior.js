(() => {
  "use strict";
  const finite = Number.isFinite;
  let settings = { idleMode: "hold", preferLoot: true, autoMeditate: true, enabled: false, radius: 22 };
  let binding = null, configured = false, suspended = false, manualUntil = 0, noteUntil = 0, message = "";
  let lootTickAt = -Infinity, lootAt = -Infinity;
  let observedTarget = null, lootSite = null, lootActive = false, lootLastCount = 0, lootAbandoned = false;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  function mapContext(scene) {
    try {
      const host = scene?.autoHost?.(), key = typeof host?.mapKey === "function" ? host.mapKey() : null;
      return typeof key === "string" && key.length > 0 ? key : null;
    } catch { return null; }
  }
  function clearContextState(scene) {
    manualUntil = 0; noteUntil = 0; message = "";
    lootTickAt = -Infinity; lootAt = -Infinity;
    observedTarget = null; lootSite = null; lootActive = false; lootLastCount = 0; lootAbandoned = false;
    if (binding?.scene === scene) {
      Object.assign(binding, { idleAt: -Infinity, readySince: null, medOwned: false,
        medPending: null, medManual: false, cancelStart: false,
        lastScanAt: -Infinity, lastScanSafe: false });
    }
  }
  function syncContext(scene) {
    if (binding?.scene !== scene) return false;
    const key = mapContext(scene);
    if (key === null) {
      if (binding.contextKey !== null) clearContextState(scene);
      binding.contextKey = null;
      return false;
    }
    if (binding.contextKey === null) { binding.contextKey = key; return true; }
    if (binding.contextKey !== key) {
      clearContextState(scene);
      binding.contextKey = key;
    }
    return true;
  }
  const connected = (scene) => scene.driver && !scene.driver.closing && !scene.driver.reconnecting
    && !scene.driver.displaced && (scene.driver.online === false || scene.driver.link?.open?.() === true);
  function say(text, seconds = 4) { message = text; noteUntil = performance.now() + seconds * 1000; }
  function manual(scene) {
    return GSTFarmInput.movement(scene) || scene.pendingSkill || scene.aiming || scene.heldAttack
      || scene.auto.moved || scene.now() < scene.auto.pauseUntil;
  }
  function blocked(scene) {
    return globalThis.GSTMapTravel?.active(scene) || !scene.auto.on || !scene.self || scene.self.dead || !connected(scene) || scene.leaving
      || GSTFarmRouting.blocked(scene) || scene.keyCapture || scene.overlay?.dialogOpen || scene.harvesting
      || scene.self.med || scene.self.fish || scene.auto.resting
      || (scene.self.realm?.inside?.protection ?? 0) > 0;
  }
  function inFarmArea(scene, point) {
    if (!finite(point?.x) || !finite(point?.y)) return false;
    if (settings.enabled && settings.searchScope === "map")
      return finite(scene.map?.w) && finite(scene.map?.h)
        && point.x >= 0 && point.y >= 0 && point.x < scene.map.w && point.y < scene.map.h;
    const home = settings.enabled
      ? (globalThis.GSTHarvest?.farmOrigin?.(scene) ?? { x: scene.auto.ax, y: scene.auto.ay })
      : { x: scene.auto.ax, y: scene.auto.ay };
    const radius = settings.enabled ? settings.radius
      : globalThis.GSTFarmCompatibility?.nativeRadius(scene.auto.radius);
    return finite(home?.x) && finite(home?.y) && finite(radius) && radius >= 1
      && dist(point, home) <= radius;
  }
  function rawMonsters(host) {
    const list = typeof host?.gstRawEnemies === "function" ? host.gstRawEnemies()
      : typeof host?.enemies === "function" ? host.enemies() : null;
    return Array.isArray(list) ? list : null;
  }
  function idleSafe(owner, host) {
    const scene = owner.scene, now = performance.now();
    if (!scene.auto.on || !scene.self || scene.self.dead || !connected(scene) || scene.leaving
        || !scene.sys?.isActive?.() || scene.auto !== owner.auto || scene.auto.resting
        || scene.self.fish || scene.self.combat || scene.harvesting || scene.keyCapture
        || scene.chat?.typing || scene.uiBlocked || scene.panels?.open || scene.overlay?.dialogOpen
        || scene.pendingSkill || scene.aiming || scene.heldAttack || scene.auto.moved
        || scene.now() < scene.auto.pauseUntil || GSTFarmInput.movement(scene)
        || GSTFarmRouting.blocked(scene) || now < manualUntil
        || globalThis.GSTMapTravel?.active?.(scene) || globalThis.GSTQuest?.active?.(scene)
        || globalThis.GSTFarmSeals?.pending?.(scene) || collecting(scene)
        || ["GSTFarmDefense", "GSTFarmMap", "GSTRealm", "GSTChest", "GSTHarvest", "GSTFarmSeals", "GSTFarmBossSafety"]
          .some((name) => globalThis[name]?.controls?.(scene))) return false;
    const enemies = rawMonsters(host);
    if (!enemies || enemies.some((mob) => !mob.dead && finite(mob.x) && finite(mob.y)
        && (inFarmArea(scene, mob) || dist(mob, { x: scene.px, y: scene.py }) < 7))) return false;
    const loot = typeof host?.loot === "function" ? host.loot() : null;
    if (!Array.isArray(loot) || loot.some((item) => inFarmArea(scene, item)
        && !scene.auto.lootSkip?.has?.(`${item.x.toFixed(1)},${item.y.toFixed(1)}`))) return false;
    if (settings.idleMode === "home") {
      const home = globalThis.GSTHarvest?.farmOrigin?.(scene) ?? { x: scene.auto.ax, y: scene.auto.ay };
      if (!finite(scene.px) || !finite(scene.py) || !finite(home.x) || !finite(home.y)
          || dist({ x: scene.px, y: scene.py }, home) > 1.2) return false;
    }
    const selected = scene.views?.get?.(scene.auto.target);
    return (!selected || selected.dead) && !scene.autoX && !scene.autoY;
  }
  function toggleMeditation(owner, host, direction) {
    const now = performance.now();
    if (now - owner.medRequestAt < (direction === "stop" ? 800 : 4000)
        || typeof host?.meditate !== "function") return false;
    try {
      host.meditate(); // Game's native T action; no synthetic keypresses.
      owner.medPending = direction; owner.medRequestAt = now;
      return true;
    } catch { return false; }
  }
  function wakeMeditation(scene) {
    const owner = binding;
    if (!owner || owner.scene !== scene) return false;
    if (owner.medPending === "start") { owner.cancelStart = true; return true; }
    if (!owner.medOwned) return false;
    owner.readySince = null;
    if (!scene.self?.med) { owner.medOwned = false; owner.medPending = null; return true; }
    if (owner.medPending !== "stop") {
      try { toggleMeditation(owner, scene.autoHost(), "stop"); } catch { /* Yield to game. */ }
    }
    return true;
  }
  function meditationGuard(scene) {
    const owner = binding;
    if (!owner || owner.scene !== scene) return;
    const now = performance.now(), med = scene.self?.med === true;
    if (owner.medPending === "start" && med) {
      owner.medPending = null; owner.medOwned = !owner.medManual;
    } else if (owner.medPending === "stop" && !med) {
      owner.medPending = null; owner.medOwned = false;
    } else if (owner.medPending && now - owner.medRequestAt >= 3500) {
      owner.medPending = null;
      if (!med) owner.cancelStart = false;
    }
    if (owner.medOwned && !med && owner.medPending !== "start") owner.medOwned = false;
    if (owner.medManual && !med) owner.medManual = false;
    if (!settings.autoMeditate) {
      owner.readySince = null;
      if (owner.medOwned || owner.medPending === "start") wakeMeditation(scene);
      return;
    }
    if (med && !owner.medOwned && owner.medPending !== "start") return;
    // Sampling the game lists every 300ms avoids a full scan on each render frame.
    if (now - owner.lastScanAt >= 300) {
      owner.lastScanAt = now;
      owner.lastScanSafe = false;
      if (owner.contextKey !== null) {
        try { owner.lastScanSafe = idleSafe(owner, scene.autoHost()); } catch { /* Yield. */ }
      }
    }
    if (!owner.lastScanSafe || owner.cancelStart) {
      owner.readySince = null;
      if (owner.medOwned) wakeMeditation(scene);
      if (!med && owner.medPending !== "start") owner.cancelStart = false;
      return;
    }
    if (med || owner.medManual || owner.medPending) return; // Never cancel manual meditation.
    if (now - owner.idleAt > 1200) { owner.readySince = null; return; }
    owner.readySince ??= now;
    if (now - owner.readySince >= 1800) {
      try { toggleMeditation(owner, scene.autoHost(), "start"); } catch { /* Yield. */ }
    }
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
    if (!syncContext(scene)) return;
    if (manual(scene)) {
      manualUntil = performance.now() + 3000;
      say("Tạm nhường thao tác tay; chờ 3 giây rồi tiếp tục nhặt đồ/farm.");
    }
    meditationGuard(scene);
    if (!scene.auto.on || scene.self?.dead || !connected(scene) || scene.leaving) {
      manualUntil = 0; message = "";
      observedTarget = null; lootSite = null; lootActive = false; lootAbandoned = false; return;
    }
  }
  // A loot phase belongs to the LAST confirmed local kill. Never chase a
  // random old drop just because the route to the next camp passes nearby.
  function observeKill(scene, time) {
    if (!finite(scene.px) || !finite(scene.py) || !finite(time)) return;
    if (lootSite && (time > lootSite.until || dist(lootSite, { x: scene.px, y: scene.py }) > 12)) {
      lootAbandoned = true;
      lootSite = null;
    }
    if (observedTarget) {
      const previous = scene.views.get(observedTarget.id);
      if (!previous || previous.dead) {
        const site = { x: observedTarget.x, y: observedTarget.y };
        if (time - observedTarget.at < 8 && dist(site, { x: scene.px, y: scene.py }) < 9) {
          // The server can publish drops after the monster disappears.
          // Allow a bounded 2.5-second arrival window before leaving camp;
          // multiple kills reset it, and the 9-second collection cap remains.
          lootSite = { ...site, graceUntil: time + 2.5, until: time + 9 };
          lootAbandoned = false;
        }
        observedTarget = null;
      } else if (time - observedTarget.at > 8) observedTarget = null;
    }
    const actor = scene.views.get(scene.auto.target);
    if (actor?.k === "m" && !actor.dead && finite(actor.x) && finite(actor.y)
        && Math.hypot(scene.px - actor.x, scene.py - actor.y) < 7)
      observedTarget = { id: actor.id, x: actor.x, y: actor.y, at: time };
  }
  function lootPlan(scene, host, time) {
    if (!scene?.auto?.on || !finite(time) || !syncContext(scene)) return null;
    observeKill(scene, time);
    if (!settings.preferLoot || !lootSite || blocked(scene) || manual(scene)
        || !finite(scene.px) || !finite(scene.py)
        || typeof host?.loot !== "function" || typeof scene.auto?.idle !== "function"
        || typeof scene.auto.lootSkip?.has !== "function" || modal(binding)
        || performance.now() < manualUntil || GSTHarvest.needsRecovery?.(scene)
        || globalThis.GSTQuest?.active?.(scene)
        || ["GSTFarmSeals", "GSTChest", "GSTRealm", "GSTHarvest", "GSTQuest"]
          .some((name) => globalThis[name]?.controls?.(scene))) return null;
    const all = host.loot();
    if (!Array.isArray(all)) return null;
    const nearby = all.filter((item) => finite(item.x) && finite(item.y)
      && Math.hypot(item.x - scene.px, item.y - scene.py) < 11
      && Math.hypot(item.x - lootSite.x, item.y - lootSite.y) < 9);
    const eligible = nearby.filter((item) => !scene.auto.lootSkip.has(
      item.x.toFixed(1) + "," + item.y.toFixed(1)));
    const waiting = eligible.length === 0 && time < lootSite.graceUntil;
    if (!eligible.length && !waiting) {
      lootSite = null; // Collection finished, or the remaining objects are skipped.
      return { eligible, waiting: false, skipped: nearby.length > 0 };
    }
    // Avoid scanning every monster on every frame when no loot is available.
    // A combat flag can outlive the last monster, but an actual nearby threat cannot.
    const list = typeof host.gstRawEnemies === "function" ? host.gstRawEnemies()
      : typeof host.enemies === "function" ? host.enemies() : [];
    const monsters = Array.isArray(list) ? list.filter((enemy) => !enemy.dead && enemy.hostile
      && finite(enemy.x) && finite(enemy.y)) : [];
    if (monsters.some((enemy) => Math.hypot(enemy.x - scene.px, enemy.y - scene.py) < 3.5
        || host.inCombat?.() && Math.hypot(enemy.x - scene.px, enemy.y - scene.py) < 7)) return null;
    eligible.sort((a, b) => Math.hypot(a.x - scene.px, a.y - scene.py)
      - Math.hypot(b.x - scene.px, b.y - scene.py));
    return { eligible, skipped: false, waiting };
  }
  function collecting(scene) {
    if (!binding || binding.scene !== scene || !scene?.auto?.on || suspended) return false;
    try {
      const plan = lootPlan(scene, scene.autoHost(), scene.now());
      return !!plan && (plan.eligible.length > 0 || plan.waiting);
    } catch { return false; }
  }
  // Priority 2.5: collect drops before native target selection or map traversal.
  // Keep the native idle/walk/pickup path, six-second loot timeout and lootSkip.
  function collectLoot(host, time) {
    const scene = binding?.scene;
    try {
      if (!scene) return false;
      const plan = lootPlan(scene, host, time);
      if (!plan || !plan.eligible.length && !plan.waiting) {
        if (lootActive) {
          globalThis.GSTMovementDiagnostics?.event?.(scene,
            lootAbandoned || plan?.skipped ? "loot_skip" : "loot_done", { lootCount: lootLastCount });
          lootActive = false; lootLastCount = 0; lootAbandoned = false;
        }
        return false;
      }
      if (!lootActive) {
        lootActive = true;
        globalThis.GSTMovementDiagnostics?.event?.(scene, "loot_begin",
          { lootCount: plan.eligible.length });
      }
      lootLastCount = plan.eligible.length;
      globalThis.GSTFarmMap?.pauseForLoot?.(scene);
      if (plan.waiting) {
        host.steer(0, 0);
        return true;
      }
      if (time < lootTickAt) return true;
      lootTickAt = time + 0.3;
      const item = plan.eligible[0], auto = scene.auto;
      const ax = auto.ax, ay = auto.ay;
      // The last farm center may already belong to the NEXT pack. Redirect
      // native idle temporarily so it can see drops at the pack just killed.
      try {
        auto.ax = item.x; auto.ay = item.y;
        auto.idle({ ...host, loot: () => plan.eligible }, time, scene.px, scene.py);
      } finally {
        auto.ax = ax; auto.ay = ay;
      }
      lootAt = performance.now();
      return true;
    } catch { return false; } // Never interrupt native farming on malformed data.
  }
  // Shared event observer: targeting and other subscribers use one native
  // scene.onEvent wrapper with independently removable subscriptions.
  const eventHooks = new WeakMap();
  globalThis.GSTFarmEvents = {
    add(scene, callback) {
      let entry = eventHooks.get(scene);
      if (!entry) {
        const original = scene.onEvent;
        if (typeof original !== "function") throw new Error("Game event handler unavailable");
        const descriptor = Object.getOwnPropertyDescriptor(scene, "onEvent");
        entry = { descriptor, callbacks: new Map(), wrapper: null };
        entry.wrapper = function (...args) {
          const result = original.apply(this, args);
          if (this === scene) for (const observer of entry.callbacks.values()) {
            try { observer(args[0]); } catch { /* Never interrupt native events. */ }
          }
          return result;
        };
        scene.onEvent = entry.wrapper;
        eventHooks.set(scene, entry);
      }
      const token = Symbol();
      entry.callbacks.set(token, callback);
      return () => {
        entry.callbacks.delete(token);
        if (entry.callbacks.size || scene.onEvent !== entry.wrapper) return;
        if (entry.descriptor) Object.defineProperty(scene, "onEvent", entry.descriptor);
        else delete scene.onEvent;
        eventHooks.delete(scene);
      };
    }
  };
  function wrap(owner, object, key, factory) {
    const original = object[key], descriptor = Object.getOwnPropertyDescriptor(object, key);
    const wrapper = factory(original); object[key] = wrapper;
    owner.undo.push(() => {
      if (object[key] !== wrapper) return;
      if (descriptor) Object.defineProperty(object, key, descriptor); else delete object[key];
    });
  }
  function detach() {
    const old = binding; binding = null;
    if (old) {
      old.scene.events.off("preupdate", guard); old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
      for (const undo of old.undo.reverse()) undo();
    }
    manualUntil = 0; lootTickAt = -Infinity; lootAt = -Infinity;
    observedTarget = null; lootSite = null; lootActive = false; lootLastCount = 0; lootAbandoned = false;
  }
  function attach(scene) {
    if (!configured || suspended) { detach(); return; }
    if (binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || !scene.self || !connected(scene) || typeof scene.auto?.idle !== "function"
        || typeof scene.auto.walk !== "function" || typeof scene.auto.update !== "function" || typeof scene.onEvent !== "function"
        || typeof scene.views?.get !== "function" || typeof scene.views?.values !== "function"
        || typeof scene.auto.lootSkip?.has !== "function" || typeof scene.now !== "function" || !scene.events?.on || !scene.events.off) return;
    const owner = { scene, auto: scene.auto, undo: [], modalAt: -Infinity, modal: false,
      idleAt: -Infinity, readySince: null, medOwned: false, medPending: null,
      medManual: false, cancelStart: false, medRequestAt: -Infinity,
      lastScanAt: -Infinity, lastScanSafe: false, contextKey: mapContext(scene) };
    binding = owner;
    wrap(owner, scene.auto, "idle", (original) => function (host, time, x, y) {
      if (this !== owner.auto || !this.on || blocked(scene)
          || typeof host.loot !== "function" || typeof host.steer !== "function") return original.call(this, host, time, x, y);
      if (settings.idleMode !== "hold") {
        const result = original.call(this, host, time, x, y);
        owner.idleAt = performance.now();
        return result;
      }
      const nativeRadius = globalThis.GSTFarmCompatibility?.nativeRadius(this.radius);
      if (nativeRadius == null) return original.call(this, host, time, x, y);
      const loot = host.loot();
      if (!Array.isArray(loot) || loot.some((item) => finite(item.x) && finite(item.y)
          && Math.hypot(item.x - this.ax, item.y - this.ay) < nativeRadius
          && !this.lootSkip.has(`${item.x.toFixed(1)},${item.y.toFixed(1)}`))) return original.call(this, host, time, x, y);
      if (loot.length === 0) this.lootFails = 0;
      if (typeof this.rideIfIdle === "function" && this.rideIfIdle(host, time)) return;
      host.steer(0, 0); this.stillSince = time;
      owner.idleAt = performance.now();
    });
    owner.undo.push(GSTFarmUpdate.add(scene, 2.5, collectLoot));
    scene.events.on("preupdate", guard); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmBehavior = {
    configure(scene, value) {
      configured = true;
      const next = { idleMode: ["home", "seek"].includes(value.idleMode) ? value.idleMode : "hold",
        preferLoot: value.preferLoot !== false, autoMeditate: value.autoMeditate !== false,
        enabled: value.enabled === true, radius: value.radius, searchScope: value.searchScope };
      if (binding && binding.scene !== scene) detach();
      if (binding && Object.keys(next).some((key) => settings[key] !== next[key])) binding.readySince = null;
      settings = next; this.attach(scene);
    },
    attach(scene) { try { attach(scene); } catch { detach(); say("Chưa gắn được hành vi chờ/nhặt đồ."); } },
    pendingLoot: collecting,
    ownsMeditation: (scene) => binding?.scene === scene && binding.medOwned === true,
    wake: wakeMeditation,
    status(scene) {
      if (binding?.scene === scene && !syncContext(scene)) return "";
      if (!scene?.auto?.on) return "";
      if (!binding || binding.scene !== scene) return "";
      if (binding.medOwned) return "Auto Farm đang thiền chờ quái xuất hiện.";
      if (binding.medPending === "start") return "Auto Farm đang yêu cầu thiền khi hết quái.";
      if (binding.medPending === "stop") return "Auto Farm đang thoát thiền để tiếp tục.";
      if (performance.now() < noteUntil) return message;
      if (performance.now() - lootAt < 1500) return "Đang ưu tiên nhặt đồ tại bãi vừa đánh.";
      return performance.now() - binding.idleAt < 1500
        ? "Hết mục tiêu phù hợp và đồ cần nhặt; đang đứng chờ quái xuất hiện." : "";
    }
  };
  window.addEventListener("keydown", (event) => {
    if (!event.isTrusted || event.repeat || event.ctrlKey || event.altKey || event.metaKey
        || event.key?.toLowerCase() !== "t" || !binding?.scene?.self
        || binding.scene.keyCapture || binding.scene.chat?.typing
        || event.target?.closest?.("input,textarea,select,[contenteditable=true]")) return;
    // Manual meditation always owns its own toggle.
    binding.medManual = true; binding.medOwned = false; binding.cancelStart = true;
    binding.readySince = null; binding.medPending = null;
  }, true);
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmBehavior.attach(sceneNow()); });
})();
