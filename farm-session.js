(() => {
  "use strict";
  const origin = "https://nghichthienky.online", storageKey = "gst:farm-intent:v1";
  let configured = false, keep = true, suspended = false, watcher = null, binding = null;
  let intent = null, stableAt = null, pausedUntil = 0, attempted = false, at = -Infinity;
  let resumeTimer = null;
  let seedCurrent = false;
  const restoreAttempts = new WeakSet();
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  function connected(scene) {
    const d = scene.driver;
    return !!d && !d.closing && !d.reconnecting && !d.displaced
      && (d.online === false || d.link?.open?.() === true);
  }
  function save(scene, on, blocked = false) {
    if (typeof scene.profile?.name !== "string") return;
    intent = { name: scene.profile.name, on, blocked };
    try { sessionStorage.setItem(storageKey, JSON.stringify(intent)); }
    catch { /* Do not claim persistence when browser storage is unavailable. */ }
    monitorResume();
  }
  function monitorResume() {
    const needed = configured && !suspended && binding && keep && intent?.on && !binding.scene.auto.on && !attempted;
    if (!needed && resumeTimer !== null) { clearInterval(resumeTimer); resumeTimer = null; }
    // Native background stepping only runs while auto.on. This timer only
    // waits to restore an OFF scene and stops as soon as native farming resumes.
    if (needed && resumeTimer === null) resumeTimer = setInterval(frame, 1000);
  }
  function detach() {
    if (!binding) return;
    const old = binding; binding = null;
    monitorResume();
    old.scene.events.off("preupdate", frame);
    old.scene.events.off("shutdown", shutdown);
    old.scene.events.off("destroy", shutdown);
    if (old.scene.toggleAutoFarm === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.scene, "toggleAutoFarm", old.descriptor);
      else delete old.scene.toggleAutoFarm;
    }
    stableAt = null; attempted = false;
  }
  function shutdown() { detach(); watch(); }
  function frame() {
    try {
      const scene = binding?.scene;
      if (!scene) return;
      if (sceneNow() !== scene || !scene.sys?.isActive?.() || scene.auto !== binding.auto) { detach(); watch(); return; }
      const now = performance.now();
      if (now - at < 200) return;
      at = now;
      if (!scene.self) { stableAt = null; return; }
      if (intent?.name !== scene.profile?.name) { save(scene, scene.auto.on); stableAt = null; }
      if (scene.driver?.displaced) { if (intent?.on) save(scene, false); stableAt = null; return; }
      if (scene.auto.on) {
        monitorResume();
        restoreAttempts.delete(scene.auto);
        binding.seenOn = true;
        if (!intent?.on) save(scene, true);
        stableAt = null; attempted = false;
        return;
      }
      if (binding.pendingToggle) return;
      if (binding.seenOn && !scene.leaving && connected(scene)) {
        save(scene, false, scene.auto.stopOnRevive === true);
        binding.seenOn = false;
      }
      if (!keep || !intent?.on || intent.blocked || suspended) return;
      if (connected(scene) && !scene.leaving && scene.self.dead) { stableAt = null; GSTHarvest.respawn(scene); return; }
      if (globalThis.GSTFarmConfigurationReady !== true) { stableAt = null; return; }
      if (!connected(scene) || scene.leaving || scene.uiBlocked || scene.pendingSkill || scene.aiming
          || scene.heldAttack || scene.clickOrder || scene.joyX || scene.joyY
          || ["W", "A", "S", "D", "UP", "DOWN", "LEFT", "RIGHT"].some((key) => scene.keys?.[key]?.isDown)) {
        stableAt = null; return;
      }
      if ([...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
        el.getClientRects().length && getComputedStyle(el).visibility !== "hidden")) { stableAt = null; return; }
      if ((scene.self.realm?.inside?.protection ?? 0) > 0 || now < pausedUntil) { stableAt = null; return; }
      stableAt ??= now;
      if (now - stableAt < 2000 || attempted || restoreAttempts.has(scene.auto)) return;
      attempted = true;
      restoreAttempts.add(scene.auto);
      monitorResume();
      binding.restoring = true;
      try {
        if (globalThis.GSTFarmDiagnostics) GSTFarmDiagnostics.restore(scene);
        else scene.toggleAutoFarm();
      }
      finally { if (binding?.scene === scene) binding.restoring = false; }
    } catch { detach(); watch(); }
  }
  function discover() {
    if (!configured || !keep || suspended || binding) return;
    try {
      const scene = sceneNow();
      if (!scene?.sys?.isActive?.() || !scene.self || typeof scene.profile?.name !== "string"
          || typeof scene.auto?.on !== "boolean" || typeof scene.toggleAutoFarm !== "function"
          || !connected(scene) || !scene.events?.on || !scene.events.off) return;
      try { intent = JSON.parse(sessionStorage.getItem(storageKey)); }
      catch { intent = null; }
      if (seedCurrent || !intent || intent.name !== scene.profile.name || typeof intent.on !== "boolean") save(scene, scene.auto.on);
      else if (scene.auto.on && !intent.on) save(scene, true);
      seedCurrent = false;
      const original = scene.toggleAutoFarm;
      const descriptor = Object.getOwnPropertyDescriptor(scene, "toggleAutoFarm");
      const wrapper = function (...args) {
        const owner = binding, before = this.auto.on, deathStop = this.auto.stopOnRevive === true;
        const result = original.apply(this, args);
        if (owner?.scene !== this || before === this.auto.on || owner.restoring || suspended || this.leaving) return result;
        restoreAttempts.delete(this.auto);
        if (this.auto.on) { save(this, true); owner.seenOn = true; attempted = false; }
        else {
          // Native click-to-move turns farm off before it creates clickOrder.
          // Inspect after that synchronous call; an intentional V/menu OFF remains OFF.
          owner.pendingToggle = true;
          queueMicrotask(() => {
            owner.pendingToggle = false;
            if (binding !== owner || suspended || this.leaving) return;
            if (keep && this.clickOrder && !deathStop && intent?.on) {
              pausedUntil = performance.now() + 3000;
              owner.seenOn = false; stableAt = null; attempted = false;
              monitorResume();
            } else { save(this, false, deathStop); owner.seenOn = false; }
          });
        }
        return result;
      };
      scene.toggleAutoFarm = wrapper;
      binding = { scene, auto: scene.auto, original, descriptor, wrapper, seenOn: scene.auto.on, pendingToggle: false, restoring: false };
      attempted = restoreAttempts.has(scene.auto);
      scene.events.on("preupdate", frame);
      scene.events.on("shutdown", shutdown);
      scene.events.on("destroy", shutdown);
      clearInterval(watcher); watcher = null; at = -Infinity;
      monitorResume();
    } catch { detach(); watch(); }
  }
  function watch() { if (configured && keep && !suspended && !binding && watcher === null) watcher = setInterval(discover, 1000); }
  globalThis.GSTFarmSession = {
    remember: (scene) => { if (keep && scene.auto?.on) save(scene, true); },
    waiting: (scene) => !!binding && binding.scene === scene && keep && intent?.on && !scene.auto.on,
    status: (scene) => binding && binding.scene === scene && keep && intent?.on && !scene.auto.on
      ? (globalThis.GSTFarmConfigurationReady !== true ? "Chờ đọc cài đặt Auto Farm trước khi khôi phục."
        : attempted ? "Chưa bật lại được Auto Farm; kiểm tra game hoặc bấm V bằng tay."
        : "Đang giữ ý định Auto Farm; chờ nhân vật ổn định để bật lại.") : ""
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:realm:v1"
        || event.data.type !== "configure") return;
    const nextKeep = event.data.preferences?.keepFarm !== false;
    if (configured && !keep && nextKeep) seedCurrent = true;
    keep = nextKeep;
    if (!keep) {
      configured = true; detach(); clearInterval(watcher); watcher = null; monitorResume(); return;
    }
    configured = true; watch(); discover(); monitorResume();
  });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
})();
