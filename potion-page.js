(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:potion:v1";
  const finite = Number.isFinite;
  let settings = { hpEnabled: false, mpEnabled: false, hpPercent: 40, mpPercent: 25 };
  let binding = null, watcher = null, suspended = false;

  const enabled = () => settings.hpEnabled || settings.mpEnabled;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  function connected(scene) {
    return !!scene.driver && !scene.driver.closing && !scene.driver.reconnecting
      && !scene.driver.displaced && (scene.driver.online === false || scene.driver.link?.open?.() === true);
  }
  const percent = (value, fallback) => Number.isSafeInteger(value) && value >= 1 && value <= 99 ? value : fallback;
  function ratio(scene, kind) {
    const current = scene.self?.[kind], max = scene.self?.[kind === "hp" ? "mh" : "mm"];
    return finite(current) && finite(max) && max > 0 ? current / max : null;
  }
  function tick() {
    const owner = binding;
    if (!owner || suspended || !enabled()) return;
    const { scene, auto } = owner;
    try {
      if (!scene.self || scene.self.dead || scene.leaving || !connected(scene)
          || !scene.sys?.isActive?.() || scene.auto !== auto) return;
      const time = scene.now();
      if (!finite(time) || time < owner.nextAt) return;
      owner.nextAt = time + 0.2;
      if (typeof scene.autoHost !== "function" || typeof auto.wait !== "function") return;
      const host = scene.autoHost();
      if (typeof host.pills !== "function" || typeof host.pillWait !== "function") return;
      for (const kind of ["hp", "mp"]) {
        if (!settings[kind + "Enabled"]) continue;
        const value = ratio(scene, kind), limit = settings[kind + "Percent"] / 100;
        if (value === null || value >= limit) continue;
        const pills = host.pills(kind);
        if (!Array.isArray(pills) || pills.length < 2 || !pills.slice(0, 2)
            .every((count) => Number.isSafeInteger(count) && count >= 0) || pills[0] + pills[1] <= 0) continue;
        // The native wait/drink methods own pill choice, server cooldown and
        // shared HP/MP throttling. Never send a separate input or change HP.
        const wait = auto.wait(host, kind, time);
        if (!(time > auto.pillAt) || !finite(wait) || wait > 0) continue;
        auto.drink(host, kind, pills, value, time);
        break; // HP first; MP on a later eligible tick.
      }
    } catch { /* A potion helper must not interrupt the game frame. */ }
  }
  function detach() {
    const old = binding;
    binding = null;
    if (!old) return;
    old.scene.events.off("preupdate", tick);
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
    if (old.auto.drink === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.auto, "drink", old.descriptor);
      else delete old.auto.drink;
    }
  }
  function discover() {
    if (!enabled() || suspended) { detach(); return; }
    try {
      const scene = sceneNow();
      if (binding && binding.scene === scene && binding.auto === scene?.auto
          && scene.auto.drink === binding.wrapper) return;
      detach();
      if (!scene?.sys?.isActive?.() || !scene.auto || !scene.events?.on || !scene.events.off
          || typeof scene.now !== "function" || typeof scene.autoHost !== "function"
          || typeof scene.auto.drink !== "function" || typeof scene.auto.wait !== "function") return;
      const auto = scene.auto, original = auto.drink, descriptor = Object.getOwnPropertyDescriptor(auto, "drink");
      const wrapper = function (host, kind, pills, value, time) {
        if (this === auto && (kind === "hp" || kind === "mp") && settings[kind + "Enabled"]) {
          // Suppress the native Auto Farm threshold if it differs from the chosen one.
          const actual = ratio(scene, kind);
          if (actual === null || actual >= settings[kind + "Percent"] / 100) return;
        }
        return original.apply(this, arguments);
      };
      auto.drink = wrapper;
      binding = { scene, auto, wrapper, descriptor, nextAt: -Infinity };
      scene.events.on("preupdate", tick);
      scene.events.on("shutdown", detach);
      scene.events.on("destroy", detach);
    } catch { detach(); }
  }
  function configure(value) {
    settings = {
      hpEnabled: value?.hpEnabled === true,
      mpEnabled: value?.mpEnabled === true,
      hpPercent: percent(value?.hpPercent, 40),
      mpPercent: percent(value?.mpPercent, 25)
    };
    if (!enabled()) {
      clearInterval(watcher); watcher = null; detach();
      return;
    }
    discover();
    if (watcher === null && !suspended) watcher = setInterval(discover, 1000);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin
        || event.data?.channel !== channel || event.data.type !== "configure") return;
    configure(event.data.preferences);
  });
  window.addEventListener("pagehide", () => {
    suspended = true; clearInterval(watcher); watcher = null; detach();
  });
  window.addEventListener("pageshow", () => {
    suspended = false; configure(settings);
  });
  window.postMessage({ channel, type: "ready" }, origin);
})();
