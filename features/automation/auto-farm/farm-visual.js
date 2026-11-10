(() => {
  "use strict";
  let enabled = false, binding = null, suspended = false;
  function detach() {
    const old = binding; binding = null;
    if (!old) return;
    old.scene.events.off("postupdate", draw);
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    old.graphics.destroy();
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
      const journey = globalThis.GSTFarmMap?.journey(scene);
      const actor = journey ? null : scene.views?.get(scene.auto.target);
      const target = journey ?? (actor && !actor.dead ? actor : null);
      if (!target || ![scene.px, scene.py, target.x, target.y].every(Number.isFinite)) return;
      const start = scene.toPx(scene.px, scene.py), end = scene.toPx(target.x, target.y);
      const steeringTarget = journey?.next ?? target;
      const steerEnd = scene.toPx(steeringTarget.x, steeringTarget.y);
      const width = 2 / (scene.cameras?.main?.zoom || 1);
      graphics.lineStyle(width, journey?.scout ? 0xf5c86a : 0x5ce6bd, journey?.waiting ? 0.25 : 0.9);
      if (journey?.scout) {
        const count = Math.min(256, Math.ceil(Math.hypot(end[0] - start[0], end[1] - start[1]) / 16));
        for (let i = 0; i < count; i += 2) {
          const a = i / count, b = Math.min(1, (i + 1) / count);
          graphics.lineBetween(start[0] + (end[0] - start[0]) * a, start[1] + (end[1] - start[1]) * a,
            start[0] + (end[0] - start[0]) * b, start[1] + (end[1] - start[1]) * b);
        }
      } else if (!journey?.waiting) graphics.lineBetween(...start, ...steerEnd);
      // The ring marks the final camp; the line ends at the current
      // navigable checkpoint, not an unverified straight path through walls.
      graphics.strokeCircle(end[0], end[1], width * 3);
      if (journey?.next) graphics.strokeCircle(steerEnd[0], steerEnd[1], width * 2);
      const path = journey?.path ?? scene.auto.path;
      if (!Array.isArray(path)) return;
      graphics.lineStyle(width, 0x77baff, 0.8);
      let last = start;
      for (const point of path.slice(0, 64)) {
        if (!Array.isArray(point) || point.length !== 2 || !point.every(Number.isFinite)) break;
        const next = scene.toPx(...point);
        graphics.lineBetween(...last, ...next); last = next;
      }
    } catch { detach(); }
  }
  function attach(scene) {
    if (!enabled || suspended) { detach(); return; }
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
    configure(scene, value) { enabled = value.showTargetLine === true; safeAttach(scene); }, attach: safeAttach
  };
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
  window.addEventListener("pageshow", () => {
    suspended = false;
    safeAttach(window.game?.scene?.getScene?.("world") ?? window.__ntkScene);
  });
})();
