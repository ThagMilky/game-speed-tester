(() => {
  "use strict";
  let enabled = false, binding = null, suspended = false;
  let preferences = {};
  function detach() {
    const old = binding; binding = null;
    if (!old) return;
    old.scene.events.off("postupdate", draw);
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    old.graphics.destroy();
  }
  function drawRange(scene, graphics) {
    if (!preferences.showRange || !Number.isFinite(scene.px) || !Number.isFinite(scene.py)) return;
    const zoom = scene.cameras?.main?.zoom || 1;
    const circle = (point, tiles, color, alpha) => {
      if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)
          || !Number.isFinite(tiles) || tiles < 1) return;
      const center = scene.toPx(point.x, point.y);
      const edge = scene.toPx(point.x + tiles, point.y);
      const radius = Math.abs(edge[0] - center[0]);
      if (!Number.isFinite(radius) || radius <= 0) return;
      graphics.lineStyle(1.5 / zoom, color, alpha);
      graphics.strokeCircle(center[0], center[1], radius);
    };
    const home = globalThis.GSTHarvest?.farmOrigin?.(scene)
      ?? { x: scene.auto.ax, y: scene.auto.ay };
    const native = globalThis.GSTFarmCompatibility?.nativeRadius(scene.auto.radius);
    if (preferences.searchScope !== "map" || !preferences.enabled)
      circle(home, preferences.enabled ? preferences.radius : native, 0x64baff, 0.7);
    circle({ x: scene.auto.ax, y: scene.auto.ay }, native, 0x73d3c2, 0.55);
    if (preferences.nearbyClear)
      circle({ x: scene.px, y: scene.py }, preferences.nearbyRadius, 0xffd27d, 0.85);
  }
  function otherMovementOwner(scene, includeFarmMap = false) {
    try {
      if (globalThis.GSTFarmInput?.movement?.(scene) || globalThis.GSTMapTravel?.active?.(scene)) return true;
      const owners = ["GSTHarvest", "GSTFarmSeals", "GSTRealm", "GSTChest", "GSTQuest",
        "GSTFarmDefense", "GSTFarmBossSafety"].some((name) => globalThis[name]?.controls?.(scene));
      return owners || includeFarmMap && globalThis.GSTFarmMap?.controls?.(scene) === true;
    } catch { return true; }
  }
  function verifiedPath(scene, path, pathAt, moving) {
    const points = Array.isArray(path) ? path.slice(0, 64) : null;
    const time = scene.now?.(), vectorLength = Math.hypot(scene.autoX, scene.autoY);
    if (!moving || !points?.length
        || !Number.isFinite(time) || !Number.isFinite(pathAt) || time < pathAt || time - pathAt > 2.5
        || ![scene.px, scene.py, scene.autoX, scene.autoY].every(Number.isFinite) || vectorLength < 0.05
        || points.some((point) => !Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite))) return null;
    const first = points[0], dx = first[0] - scene.px, dy = first[1] - scene.py, distance = Math.hypot(dx, dy);
    if (distance < 0.35 || (scene.autoX * dx + scene.autoY * dy) / (vectorLength * distance) < 0.65) return null;
    return points;
  }
  function draw() {
    const owner = binding;
    if (!owner) return;
    const { scene, graphics } = owner;
    if (!scene.auto?.on || scene.self?.dead || scene.leaving || document.hidden) { graphics.clear(); return; }
    if (performance.now() < owner.nextAt) return;
    owner.nextAt = performance.now() + 100;
    graphics.clear();
    try {
      drawRange(scene, graphics);
      if (!preferences.showTargetLine) return;
      const journey = globalThis.GSTFarmMap?.journey(scene);
      const actor = journey ? null : scene.views?.get(scene.auto.target);
      const target = journey ?? (actor && !actor.dead ? actor : null);
      if (!target || ![scene.px, scene.py, target.x, target.y].every(Number.isFinite)) return;
      const start = scene.toPx(scene.px, scene.py), end = scene.toPx(target.x, target.y);
      const width = 2 / (scene.cameras?.main?.zoom || 1);
      const color = journey?.scout ? 0xf5c86a : 0x5ce6bd;
      const blockedByOwner = otherMovementOwner(scene, !journey);
      const active = journey ? journey.moving && !journey.waiting && !blockedByOwner
        : !blockedByOwner && !scene.auto.resting && !scene.self?.med && !scene.self?.fish
          && !scene.auto.moved && !scene.harvesting && !scene.pendingSkill && !scene.aiming
          && !scene.heldAttack && scene.now() >= scene.auto.pauseUntil
          && Math.hypot(scene.autoX, scene.autoY) >= 0.05;
      const path = journey
        ? verifiedPath(scene, journey.path, journey.pathAt, active)
        : verifiedPath(scene, scene.auto.path, scene.auto.pathAt, active);
      // Destination uses the feature color; only controller-confirmed path legs
      // use blue, with a separate marker for the active first waypoint.
      graphics.lineStyle(width, color, journey?.waiting ? 0.4 : 0.9);
      graphics.strokeCircle(end[0], end[1], width * 3);
      if (!path) return;
      graphics.lineStyle(width, 0x77baff, 0.8);
      let last = start;
      for (const point of path) {
        const next = scene.toPx(...point);
        graphics.lineBetween(...last, ...next); last = next;
      }
      const waypoint = scene.toPx(...path[0]);
      graphics.fillStyle(0x77baff, 0.9).fillCircle(waypoint[0], waypoint[1], width * 1.6);
      graphics.lineStyle(width, 0x77baff, 0.95).strokeCircle(waypoint[0], waypoint[1], width * 2.5);
    } catch { detach(); }
  }
  function attach(scene) {
    if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || !enabled || suspended) { detach(); return; }
    if (binding?.scene === scene) return;
    detach();
    if (!scene?.sys?.isActive?.() || typeof scene.add?.graphics !== "function" || typeof scene.toPx !== "function"
        || !scene.events?.on || !scene.events.off) return;
    const graphics = scene.add.graphics(); graphics.setDepth(1000000);
    binding = { scene, graphics, nextAt: 0 };
    scene.events.on("postupdate", draw); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
  }
  function safeAttach(scene) { try { attach(scene); } catch { detach(); } }
  globalThis.GSTFarmVisual = {
    configure(scene, value) {
      preferences = value;
      enabled = value.showTargetLine === true || value.showRange === true;
      safeAttach(scene);
    }, attach: safeAttach
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => {
    suspended = false;
    safeAttach(window.game?.scene?.getScene?.("world") ?? window.__ntkScene);
  });
})();
