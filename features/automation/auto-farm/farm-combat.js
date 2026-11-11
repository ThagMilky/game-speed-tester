(() => {
  "use strict";
  let binding = null, enabled = true;
  function detach() {
    const old = binding; binding = null;
    if (!old) return;
    old.remove(); old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
  }
  globalThis.GSTFarmCombat = {
    keepsFighting: () => enabled,
    configure(scene, value) { enabled = value !== false; if (!enabled) detach(); else this.attach(scene); },
    active: (scene) => enabled && !!binding && binding.scene === scene && binding.auto === scene.auto && scene.auto.on,
    host(scene, host) {
      if (!this.active(scene) || typeof host.hp !== "function" || typeof host.pills !== "function"
          || typeof host.inCombat !== "function") return host;
      const pills = host.pills("hp");
      if (!Array.isArray(pills) || pills.length < 2 || !pills.slice(0, 2).every(Number.isFinite) || pills[0] + pills[1] > 0) return host;
      let combat = false;
      // The supplied native update checks empty HP pills before inCombat(),
      // then calls its own picker/castSkills/walk/basic. Suppress only that
      // pre-combat rest check. Every combat/skill HP read stays authoritative;
      // self.hp/mh, inventories, pill timers and the server are never written.
      return { ...host, hp: () => combat ? host.hp() : 1,
        inCombat: () => { combat = true; return host.inCombat(); } };
    },
    attach(scene) {
      if (!enabled || !globalThis.GSTFarmPolicy?.hasExtensionAssistance?.() || !scene?.auto) { detach(); return; }
      if (binding && binding.scene === scene && binding.auto === scene.auto && GSTFarmUpdate.attached(scene)) return;
      detach();
      if (!scene?.sys?.isActive?.() || typeof scene.auto?.update !== "function" || !scene.events?.on || !scene.events.off) return;
      const owner = { scene, auto: scene.auto, requested: false };
      owner.remove = GSTFarmUpdate.add(scene, -1, function (host) {
        if (!this.on || scene.self?.dead || !this.resting) { owner.requested = false; return false; }
        if (host.meditating?.()) {
          if (!owner.requested && typeof host.meditate === "function") { owner.requested = true; host.meditate(); }
          host.steer(0, 0); return true;
        }
        // Exit an old native recovery episode once; never cancel manual meditation.
        this.resting = false; this.think = 0; owner.requested = false;
        return false;
      });
      binding = owner;
      scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
    }
  };
  window.addEventListener("pagehide", detach);
})();
