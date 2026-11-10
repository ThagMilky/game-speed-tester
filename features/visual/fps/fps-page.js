(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const fields = ["hidePlayers", "hidePlayerEffects", "hideOwnEffects", "hideMonsterEffects",
    "hideMonsters", "hideNumbers", "reduceEnvironment", "reduceScreen", "simpleMap", "hideVegetation", "hideBuildings", "hideBosses", "hideBossEffects", "simpleMinimap", "minimapColors"];
  let settings = {}, measure = false, suspended = false, watcher = null, binding = null;
  let failure = "";
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  const wanted = () => settings.enabled && (settings.minimapRange > 1 || fields.some((key) => settings[key]));
  const on = (key) => settings.enabled && settings[key];

  const boss = (actor) => actor?.st?.cls === "boss" || actor?.st?.wb === true;
  function suppress(scene, id) {
    if (id === scene.you) return on("hideOwnEffects");
    const actor = scene.views.get(id);
    return actor?.k === "p" ? on("hidePlayers") || on("hidePlayerEffects")
      : actor?.k === "m" && actor.st?.cls !== "pet" ? boss(actor) ? on("hideBossEffects") : on("hideMonsterEffects") : false;
  }

  function restoreMasks(owner) {
    for (const [object, state] of owner.masks) {
      if (object.scene && object.cameraFilter === state.applied) object.cameraFilter = state.original;
    }
    owner.masks.clear();
  }
  function restoreDom(owner) {
    for (const [element, state] of owner.dom) {
      if (element.style.getPropertyValue("visibility") === "hidden"
          && element.style.getPropertyPriority("visibility") === "important") {
        if (state.value) element.style.setProperty("visibility", state.value, state.priority);
        else element.style.removeProperty("visibility");
      }
    }
    owner.dom.clear();
  }
  function hideDom(owner, element) {
    if (!element?.style || owner.dom.has(element)) return;
    owner.dom.set(element, { value: element.style.getPropertyValue("visibility"),
      priority: element.style.getPropertyPriority("visibility") });
    element.style.setProperty("visibility", "hidden", "important");
  }
  // Only walk known visual attachments, never the scene or game state graph.
  const visualKeys = ["view", "hand", "weapon", "armed", "trail", "back", "front", "rings", "motes",
    "art", "sprites", "satellites", "kimVan", "particles", "adornment", "clouds", "wisps", "seal", "glow", "radiance"];
  function mask(owner, value, depth = 0) {
    if (!value || depth > 5) return;
    if (Array.isArray(value)) { for (const item of value) mask(owner, item, depth + 1); return; }
    if (value.scene === owner.scene && Number.isInteger(value.cameraFilter)) {
      const bit = owner.scene.cameras.main.id;
      if (!Number.isInteger(bit)) return;
      const tracked = owner.masks.get(value);
      if (tracked) {
        tracked.seen = owner.epoch;
        if (value.cameraFilter !== tracked.applied) {
          tracked.original = value.cameraFilter & ~bit;
          tracked.applied = value.cameraFilter | bit;
          if (value.cameraFilter !== tracked.applied) value.cameraFilter = tracked.applied;
        }
        return;
      }
      if (value.cameraFilter & bit) return;
      const original = value.cameraFilter, applied = original | bit;
      owner.masks.set(value, { original, applied, seen: owner.epoch });
      value.cameraFilter = applied;
      return;
    }
    for (const key of visualKeys) if (value[key]) mask(owner, value[key], depth + 1);
  }
  function wrap(owner, object, key, handler) {
    if (typeof object?.[key] !== "function") return;
    const original = object[key], descriptor = Object.getOwnPropertyDescriptor(object, key);
    const wrapper = function (...args) { return handler.call(this, original, args); };
    object[key] = wrapper;
    owner.hooks.push(() => {
      if (object[key] !== wrapper) return;
      if (descriptor) Object.defineProperty(object, key, descriptor);
      else delete object[key];
    });
  }

  function before() {
    if (!binding) return;
    if (sceneNow() !== binding.scene || !binding.scene.sys?.isActive?.()) { detach(); return; }
  }
  function after() {
    const owner = binding;
    if (!owner || !wanted()) return;
    try {
      owner.epoch++;
      const scene = owner.scene;
      owner.mapReady = GSTFpsMap.update(scene, settings, (value) => mask(owner, value));
      if (on("hidePlayers") || on("hideMonsters") || on("hideBosses") || on("hideBossEffects") || on("hidePlayerEffects") || on("hideMonsterEffects")) {
        for (const actor of scene.views.values()) {
          const player = actor.k === "p" && actor.id !== scene.you;
          const monster = actor.k === "m" && actor.st?.cls !== "pet";
          if ((player && on("hidePlayers")) || (monster && (boss(actor) ? on("hideBosses") : on("hideMonsters")))) {
            mask(owner, actor.ch);
            mask(owner, actor.shadow);
            if (player) {
              mask(owner, scene.swords?.get(actor.id));
              mask(owner, scene.mounts?.get(actor.id));
            }
          }
          if (suppress(scene, actor.id)) {
            mask(owner, scene.auras?.get(actor.id));
            mask(owner, scene.cultivation?.entries?.get(actor.id));
          }
        }
      }
      if (on("hideOwnEffects")) {
        mask(owner, scene.myAura);
        mask(owner, scene.cultivation?.entries?.get(scene.you));
      }
      if (on("reduceEnvironment")) {
        for (const item of scene.emitters ?? []) for (const particle of item.em?.ps ?? []) mask(owner, particle.img);
        for (const fog of scene.air?.fog ?? []) mask(owner, fog.img);
        mask(owner, scene.air?.dust);
        hideDom(owner, scene.weather?.canvas);
      }
      if (on("reduceScreen")) {
        hideDom(owner, scene.liveSkills?.light);
        hideDom(owner, scene.combatFx?.vignette);
      }
      // Restore only attachments no longer selected, not every hidden object
      // on every frame. Discard destroyed objects rather than retaining them.
      for (const [object, state] of owner.masks) {
        if (object.scene !== owner.scene || state.seen !== owner.epoch) {
          if (object.scene && object.cameraFilter === state.applied) object.cameraFilter = state.original;
          owner.masks.delete(object);
        }
      }
    } catch {
      failure = "Một lớp hình ảnh không tương thích; đã ngừng tối ưu. Tắt rồi bật lại để thử.";
      detach();
    }
  }

  function detach() {
    if (!binding) return;
    const owner = binding; binding = null;
    owner.scene.events.off("preupdate", before);
    owner.scene.events.off("postupdate", after);
    owner.scene.events.off("shutdown", detach);
    owner.scene.events.off("destroy", detach);
    restoreMasks(owner);
    restoreDom(owner);
    GSTFpsMap.clear();
    for (const undo of owner.hooks.reverse()) undo();
  }
  function attach(scene) {
    if (binding?.scene === scene) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.views?.values !== "function"
        || typeof scene.views?.get !== "function" || !scene.events?.on || !scene.events.off
        || !Number.isInteger(scene.cameras?.main?.id)) return;
    const owner = { scene, masks: new Map(), dom: new Map(), hooks: [], suppressedCast: false, epoch: 0 };
    binding = owner;
    const minimapRange = () => settings.enabled ? settings.minimapRange : 1;
    wrap(owner, scene.minimap, "draw", GSTFpsMinimap.handler(scene, () => on("simpleMinimap"), minimapRange));
    wrap(owner, scene.minimap, "draw", GSTFpsMinimapZoom.handler(minimapRange));
    wrap(owner, scene.minimap, "draw", GSTFpsMinimapColors.handler(scene,
      () => ({ enabled: on("minimapColors"), selfColor: settings.minimapSelfColor })));
    // Preserve castFx's animation/timing branches. Suppress only its visual factories.
    wrap(owner, scene, "castFx", function (original, args) {
      const previous = owner.suppressedCast;
      owner.suppressedCast = suppress(scene, args[0]);
      try { return original.apply(this, args); }
      finally { owner.suppressedCast = previous; }
    });
    wrap(owner, scene.liveSkills, "play", function (original, args) {
      if (owner.suppressedCast) return;
      return original.apply(this, args);
    });
    wrap(owner, scene.weaponFx, "play", function (original, args) {
      if (owner.suppressedCast) return true; // Native uses true to avoid a second FX fallback.
      return original.apply(this, args);
    });
    wrap(owner, scene.statusFx, "render", function (original, args) {
      if (suppress(scene, args[0]) && typeof this.remove === "function") { this.remove(args[0]); return; }
      return original.apply(this, args);
    });
    wrap(owner, scene, "afterImage", function (original, args) {
      if (!on("hidePlayers") && !on("hidePlayerEffects") && !on("hideOwnEffects") && !on("hideMonsterEffects") && !on("hideBossEffects")) {
        return original.apply(this, args);
      }
      const character = args[0] ?? scene.player;
      if (character === scene.player && on("hideOwnEffects")) return;
      for (const actor of scene.views.values()) if (actor.ch === character && suppress(scene, actor.id)) return;
      return original.apply(this, args);
    });
    wrap(owner, scene, "floatText", function (original, args) {
      // Keep messages and non-combat text passed through this shared method.
      if (on("hideNumbers") && /^(?:[+-]?\d+(?:[.,]\d+)*|Né)$/.test(String(args[2]))) return;
      return original.apply(this, args);
    });
    wrap(owner, scene.weather, "update", function (original, args) {
      if (!on("reduceEnvironment")) return original.apply(this, args);
      const enabled = this.enabled;
      this.enabled = false;
      try { return original.apply(this, args); }
      finally { this.enabled = enabled; }
    });
    wrap(owner, scene.air, "update", function (original, args) {
      if (on("reduceEnvironment")) args[2] = false;
      return original.apply(this, args);
    });
    for (const item of scene.emitters ?? []) wrap(owner, item.em, "update", function (original, args) {
      if (on("reduceEnvironment")) return;
      return original.apply(this, args);
    });
    wrap(owner, scene, "feel", function (original, args) {
      const result = original.apply(this, args);
      if (on("reduceScreen")) this.cameraKick?.set?.(0, 0);
      return result;
    });
    scene.events.on("preupdate", before);
    scene.events.on("postupdate", after);
    scene.events.on("shutdown", detach);
    scene.events.on("destroy", detach);
    after();
  }
  function publish(requestId) {
    const scene = sceneNow();
    const fps = !document.hidden && scene?.sys?.isActive?.() ? scene.game?.loop?.actualFps : null;
    window.postMessage({ channel: "gst:fps-status:v1", requestId, enabled: settings.enabled === true,
      active: !!binding, fps: Number.isFinite(fps) && fps > 0 ? Math.round(fps) : null,
      message: failure || (!settings.enabled ? "Tối ưu FPS đang tắt."
        : !wanted() ? "Đã bật; hãy chọn phần hình ảnh cần giảm."
        : binding && settings.simpleMap && !binding.mapReady ? "Đang chuẩn bị bản đồ tối giản hoặc dữ liệu va chạm chưa tương thích; giữ nền gốc."
        : binding ? "Đang giảm hình ảnh đã chọn; giữ dữ liệu và điều khiển game."
        : "Đang chờ scene game tương thích; chưa thay đổi hình ảnh.") }, origin);
  }
  function tick() {
    if (!suspended && wanted() && !failure) {
      try { attach(sceneNow()); }
      catch { failure = "Không gắn được tối ưu FPS; tắt rồi bật lại để thử."; detach(); }
    } else detach();
    publish();
  }
  function monitor() {
    if (watcher !== null) clearInterval(watcher);
    watcher = null;
    if (suspended) { detach(); return; }
    tick();
    if (wanted() || measure) watcher = setInterval(tick, 1000);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:fps:v1") return;
    if (event.data.type === "configure") {
      const next = Object.fromEntries(["enabled", ...fields].map((key) => [key, event.data.preferences?.[key] === true]));
      next.minimapRange = [1, 2, 3, 4].includes(event.data.preferences?.minimapRange) ? event.data.preferences.minimapRange : 1;
      next.minimapSelfColor = /^#[0-9a-f]{6}$/i.test(event.data.preferences?.minimapSelfColor ?? "")
        ? event.data.preferences.minimapSelfColor : "#fff7da";
      const changed = ["enabled", ...fields, "minimapSelfColor", "minimapRange"].some((key) => settings[key] !== next[key]);
      const nextMeasure = event.data.measure === true;
      if (changed) { detach(); failure = ""; settings = next; }
      if (changed || measure !== nextMeasure) { measure = nextMeasure; monitor(); }
      else publish();
    } else if (event.data.type === "status") publish(event.data.requestId);
  });
  window.addEventListener("pagehide", () => { suspended = true; monitor(); });
  window.addEventListener("pageshow", () => { suspended = false; monitor(); });
  window.postMessage({ channel: "gst:fps-status:v1", ready: true }, origin);
})();
