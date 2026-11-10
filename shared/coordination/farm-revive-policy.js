(() => {
  "use strict";
  let binding = null, enabled = true;
  function detach() {
    if (!binding) return;
    const old = binding; binding = null;
    old.remove();
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
  }
  function attach(scene) {
    if (binding?.scene === scene && binding?.auto === scene?.auto && scene && GSTFarmUpdate.attached(scene)) return;
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.update !== "function"
        || typeof scene.auto.on !== "boolean" || typeof scene.auto.stopOnRevive !== "boolean"
        || !scene.events?.on || !scene.events.off) return;
    detach();
    const auto = scene.auto;
    const remove = GSTFarmUpdate.add(scene, 0, function () {
      // Preserve the native death history, revive timing, combat and user OFF.
      // Only veto the client-side repeated-death stop before native update runs.
      if (enabled && this === auto && auto.on && auto.stopOnRevive === true
          && (scene.self?.dead || (Number.isFinite(auto.deadAt) && auto.deadAt > 0))) auto.stopOnRevive = false;
      return false;
    });
    binding = { scene, auto, remove };
    scene.events.on("shutdown", detach);
    scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmRevivePolicy = {
    configure: (value) => { enabled = value === true; },
    attach: (scene) => { try { attach(scene); } catch { detach(); } },
    active: (scene) => !!binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)
  };
  window.addEventListener("pagehide", detach);
})();
