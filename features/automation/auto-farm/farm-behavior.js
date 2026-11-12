(() => {
  "use strict";
  const finite = Number.isFinite;
  let settings = { idleMode: "hold", preferLoot: true, enabled: false, radius: 22 };
  let binding = null, configured = false, suspended = false, manualUntil = 0, noteUntil = 0, message = "";
  let lootTickAt = -Infinity, lootAt = -Infinity;
  let observedTarget = null, lootSite = null, lootActive = false, lootWaiting = false, lootLastCount = 0, lootAbandoned = false;
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
    observedTarget = null; lootSite = null; lootActive = false; lootWaiting = false; lootLastCount = 0; lootAbandoned = false;
    if (binding?.scene === scene) {
      binding.idleAt = -Infinity;
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
    return globalThis.GSTMapTravel?.active(scene) || !scene.auto.on || !scene.self || scene.self.dead
      || !connected(scene) || scene.leaving || GSTFarmRouting.blocked(scene) || scene.keyCapture
      || scene.overlay?.dialogOpen || (scene.self.realm?.inside?.protection ?? 0) > 0 || scene.harvesting
      || scene.self.med || scene.self.fish || scene.auto.resting;
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
    if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()) {
      detach();
      return;
    }
    if (!syncContext(scene)) return;
    if (manual(scene)) {
      manualUntil = performance.now() + 3000;
      say("Tạm nhường thao tác tay; chờ 3 giây rồi tiếp tục nhặt đồ/farm.");
    }
    if (!scene.auto.on || scene.self?.dead || !connected(scene) || scene.leaving) {
      manualUntil = 0; message = "";
      observedTarget = null; lootSite = null; lootActive = false; lootWaiting = false; lootAbandoned = false; return;
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
    if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || !binding || binding.scene !== scene || !scene?.auto?.on || suspended) return false;
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
      if (!scene || !globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()) return false;
      const plan = lootPlan(scene, host, time);
      if (plan?.waiting) lootWaiting = true;
      else if (lootWaiting && (!plan || !plan.waiting)) {
        const handoffBlocked = manual(scene) || scene.auto.moved || scene.pendingSkill || scene.aiming
          || scene.auto.resting || scene.self?.med || scene.harvesting
          || globalThis.GSTMapTravel?.active?.(scene)
          || ["GSTFarmSeals", "GSTChest", "GSTRealm", "GSTHarvest", "GSTQuest"]
            .some((name) => globalThis[name]?.controls?.(scene));
        const waitEnded = !!plan || !lootSite || !settings.preferLoot;
        if (waitEnded && !handoffBlocked) {
          if (globalThis.GSTFarmRouting?.rebaseNativeWalk?.(scene) === true) lootWaiting = false;
        }
      }
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
    observedTarget = null; lootSite = null; lootActive = false; lootWaiting = false; lootLastCount = 0; lootAbandoned = false;
  }
  function attach(scene) {
    if (!configured || !globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || suspended) { detach(); return; }
    if (binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)) return;
    detach();
    if (!scene?.sys?.isActive?.() || !scene.self || !connected(scene) || typeof scene.auto?.idle !== "function"
        || typeof scene.auto.walk !== "function" || typeof scene.auto.update !== "function" || typeof scene.onEvent !== "function"
        || typeof scene.views?.get !== "function" || typeof scene.views?.values !== "function"
        || typeof scene.auto.lootSkip?.has !== "function" || typeof scene.now !== "function" || !scene.events?.on || !scene.events.off) return;
    const owner = { scene, auto: scene.auto, undo: [], modalAt: -Infinity, modal: false,
      idleAt: -Infinity, contextKey: mapContext(scene) };
    binding = owner;
    wrap(owner, scene.auto, "idle", (original) => function (host, time, x, y) {
      if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || this !== owner.auto || !this.on || blocked(scene)
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
        preferLoot: value.preferLoot !== false,
        enabled: value.enabled === true, radius: value.radius, searchScope: value.searchScope,
        nearbyClear: value.nearbyClear === true, nearbyRadius: value.nearbyRadius };
      if (binding && binding.scene !== scene) detach();
      settings = next;
      if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()) {
        detach();
        return;
      }
      this.attach(scene);
    },
    attach(scene) { try { attach(scene); } catch { detach(); say("Chưa gắn được hành vi chờ/nhặt đồ."); } },
    pendingLoot: collecting,
    ownsMeditation: () => false,
    wake: () => false,
    status(scene) {
      if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()) return "";
      if (binding?.scene === scene && !syncContext(scene)) return "";
      if (!scene?.auto?.on) return "";
      if (!binding || binding.scene !== scene) return "";
      if (performance.now() < noteUntil) return message;
      if (performance.now() - lootAt < 1500) return "Đang ưu tiên nhặt đồ tại bãi vừa đánh.";
      return performance.now() - binding.idleAt < 1500
        ? "Hết mục tiêu phù hợp và đồ cần nhặt; đang đứng chờ quái xuất hiện." : "";
    }
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => { suspended = false; GSTFarmBehavior.attach(sceneNow()); });
})();
