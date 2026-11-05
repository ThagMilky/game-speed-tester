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
    if (scene.self?.dead || scene.leaving || document.hidden) { graphics.clear(); return; }
    if (performance.now() < owner.nextAt) return;
    owner.nextAt = performance.now() + 100;
    graphics.clear();
    try {
      const journey = globalThis.GSTHarvest?.journey?.(scene);
      const target = journey;
      if (!target || ![scene.px, scene.py, target.x, target.y].every(Number.isFinite)) return;
      const start = scene.toPx(scene.px, scene.py), end = scene.toPx(target.x, target.y);
      const width = 2 / (scene.cameras?.main?.zoom || 1);
      graphics.lineStyle(width, 0xf5c86a, 0.9);
      graphics.lineBetween(...start, ...end);
      graphics.strokeCircle(end[0], end[1], width * 3);
      const path = journey?.path;
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
  globalThis.GSTHarvestVisual = {
    configure(scene, value) { enabled = value === true; safeAttach(scene); }, attach: safeAttach
  };
  window.addEventListener("pageshow", () => { suspended = false; });
  window.addEventListener("pagehide", () => { suspended = true; detach(); });
})();
