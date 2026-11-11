(() => {
  "use strict";
  let binding = null, enabled = true;
  function sameDeathHistory(auto, history) {
    return Array.isArray(auto?.deaths) && Array.isArray(history)
      && auto.deaths.length === history.length && auto.deaths.every((value, index) => value === history[index]);
  }
  function restoreNativePolicy(owner) {
    if (!owner?.modified) return;
    // A native toggle resets its death history and stop flag. Never carry this
    // restore across that new farm session or across a replaced controller.
    try {
      if (binding === owner && owner.scene.auto === owner.auto && owner.auto.on === true
          && owner.auto.stopOnRevive === false && sameDeathHistory(owner.auto, owner.modifiedDeaths))
        owner.auto.stopOnRevive = owner.restoreValue;
    } catch { /* The native controller may already be gone. */ }
    owner.modified = false;
    owner.modifiedDeaths = null;
  }
  function detach() {
    if (!binding) return;
    const old = binding;
    restoreNativePolicy(old);
    binding = null;
    old.remove();
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
  }
  function attach(scene) {
    if (!globalThis.GSTFarmPolicy?.hasExtensionAssistance?.()) { detach(); return; }
    if (binding?.scene === scene && binding?.auto === scene?.auto && scene && GSTFarmUpdate.attached(scene)) return;
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.update !== "function"
        || typeof scene.auto.on !== "boolean" || typeof scene.auto.stopOnRevive !== "boolean"
        || !scene.events?.on || !scene.events.off) return;
    detach();
    const auto = scene.auto;
    const owner = { scene, auto, remove: null, modified: false, modifiedDeaths: null, restoreValue: null };
    const remove = GSTFarmUpdate.add(scene, 0, function () {
      if (owner.modified && (auto.on !== true || !sameDeathHistory(auto, owner.modifiedDeaths))) {
        owner.modified = false;
        owner.modifiedDeaths = null;
      }
      // Preserve the native death history, revive timing, combat and user OFF.
      // Only veto the client-side repeated-death stop before native update runs.
      if (enabled && this === auto && auto.on && Array.isArray(auto.deaths) && auto.stopOnRevive === true
          && (scene.self?.dead || (Number.isFinite(auto.deadAt) && auto.deadAt > 0))) {
        owner.restoreValue = auto.stopOnRevive;
        owner.modifiedDeaths = Array.isArray(auto.deaths) ? auto.deaths.slice() : null;
        auto.stopOnRevive = false;
        owner.modified = owner.modifiedDeaths !== null;
      }
      return false;
    });
    owner.remove = remove;
    binding = owner;
    scene.events.on("shutdown", detach);
    scene.events.on("destroy", detach);
  }
  globalThis.GSTFarmRevivePolicy = {
    configure: (value) => {
      enabled = value === true && globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() === true;
      if (!enabled) detach();
    },
    attach: (scene) => { try { if (!enabled) { detach(); return; } attach(scene); } catch { detach(); } },
    active: (scene) => enabled && !!binding && binding.scene === scene && binding.auto === scene?.auto && GSTFarmUpdate.attached(scene)
  };
  window.addEventListener("pagehide", detach);
})();
