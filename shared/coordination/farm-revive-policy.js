(() => {
  "use strict";
  let binding = null, enabled = true;
  function restoreNativePolicy(owner) {
    if (!owner?.modified) return;
    // Restore only the value this policy changed, not a separate game update.
    try {
      if (owner.auto.stopOnRevive === false) owner.auto.stopOnRevive = owner.originalStopOnRevive;
    } catch { /* The native controller may already be gone. */ }
    owner.modified = false;
  }
  function detach() {
    if (!binding) return;
    const old = binding; binding = null;
    restoreNativePolicy(old);
    old.remove();
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
  }
  function attach(scene) {
    if (globalThis.GSTFarmPolicy?.isNative?.()) { detach(); return; }
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
          && (scene.self?.dead || (Number.isFinite(auto.deadAt) && auto.deadAt > 0))) {
        auto.stopOnRevive = false;
        binding.modified = true;
      }
      return false;
    });
    binding = { scene, auto, remove, modified: false, originalStopOnRevive: auto.stopOnRevive };
    scene.events.on("shutdown", detach);
    scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmRevivePolicy = {
    configure: (value) => {
      enabled = value === true && !globalThis.GSTFarmPolicy?.isNative?.();
      if (!enabled) detach();
    },
    attach: (scene) => { try { if (!enabled) { detach(); return; } attach(scene); } catch { detach(); } },
    active: (scene) => enabled && !!binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)
  };
  window.addEventListener("pagehide", detach);
})();
