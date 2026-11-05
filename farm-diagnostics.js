(() => {
  "use strict";
  const key = "gst:farm-stop-log:v1";
  let binding = null, cause = null, rows = [], at = -Infinity, onAt = performance.now();
  const codes = ["shortcut", "restore", "native_game", "death_limit", "click_to_move", "state_changed",
    "background_click_blocked", "blocking_dialog", "displaced", "navigation"];
  function flags(scene) {
    return { on: scene?.auto?.on === true, hidden: document.hidden, focused: document.hasFocus(),
      dead: scene?.self?.dead === true, deaths: scene?.auto?.deaths?.length ?? 0,
      clickOrder: !!scene?.clickOrder, reconnecting: !!scene?.driver?.reconnecting,
      displaced: !!scene?.driver?.displaced };
  }
  function clean(row) {
    if (!row || !codes.includes(row.cause) || !["on", "off", "context", "input"].includes(row.event)) return null;
    return { at: typeof row.at === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(row.at) ? row.at : "", event: row.event, cause: row.cause,
      on: row.on === true, hidden: row.hidden === true, focused: row.focused === true, dead: row.dead === true,
      deaths: Number.isFinite(row.deaths) ? Math.max(0, Math.min(10000, row.deaths)) : 0,
      clickOrder: row.clickOrder === true, reconnecting: row.reconnecting === true, displaced: row.displaced === true,
      uptimeMs: Number.isFinite(row.uptimeMs) ? Math.max(0, row.uptimeMs) : null,
      callers: (Array.isArray(row.callers) ? row.callers : []).filter((value) =>
        typeof value === "string" && /^[A-Za-z0-9_.-]+\.js:\d+:\d+$/.test(value)).slice(0, 4) };
  }
  try { rows = (JSON.parse(sessionStorage.getItem(key)) ?? []).map(clean).filter(Boolean).slice(-20); }
  catch { rows = []; }
  function record(scene, event, reason, callers = [], snapshot = null) {
    const row = clean({ at: new Date().toISOString(), event, cause: reason, ...(snapshot ?? flags(scene)),
      uptimeMs: performance.now() - onAt, callers });
    if (!row) return;
    const previous = rows.at(-1);
    if (previous?.event === event && previous.cause === reason && previous.hidden === row.hidden
        && performance.now() - (binding?.lastRecordAt ?? -Infinity) < 1000) return;
    rows.push(row); rows = rows.slice(-20);
    if (binding) binding.lastRecordAt = performance.now();
    try { sessionStorage.setItem(key, JSON.stringify(rows)); } catch { /* Diagnostic data is optional. */ }
  }
  function detach() {
    if (!binding) return;
    const old = binding; binding = null;
    old.removeInput();
    old.scene.events.off("preupdate", frame);
    old.scene.events.off("shutdown", detach); old.scene.events.off("destroy", detach);
    if (old.auto.toggle === old.wrapper) {
      if (old.descriptor) Object.defineProperty(old.auto, "toggle", old.descriptor);
      else delete old.auto.toggle;
    }
  }
  function frame() {
    const owner = binding;
    if (!owner) return;
    const scene = owner.scene;
    if (scene.auto !== owner.auto || !scene.sys?.isActive?.()) { detach(); return; }
    if (performance.now() - at < 500) return;
    at = performance.now();
    if (scene.auto.on !== owner.lastOn) {
      record(scene, scene.auto.on ? "on" : "off", "state_changed");
      owner.lastOn = scene.auto.on;
      if (scene.auto.on) onAt = performance.now();
    }
    const modal = [...document.querySelectorAll('[role="alertdialog"]')].some((el) =>
      el.getClientRects().length && getComputedStyle(el).visibility !== "hidden");
    if (modal && !owner.modal) record(scene, "context", "blocking_dialog");
    owner.modal = modal;
    if (scene.driver?.displaced && !owner.displaced) record(scene, "context", "displaced");
    owner.displaced = !!scene.driver?.displaced;
  }
  function attach(scene) {
    globalThis.GSTBackgroundDiagnostics?.attach(scene);
    if (binding && binding.scene === scene && binding.auto === scene?.auto) return;
    if (!scene?.sys?.isActive?.() || typeof scene.auto?.toggle !== "function"
        || typeof scene.startClickOrder !== "function" || !scene.events?.on || !scene.events.off) return;
    detach();
    const auto = scene.auto, original = auto.toggle;
    const descriptor = Object.getOwnPropertyDescriptor(auto, "toggle");
    const wrapper = function (...args) {
      const before = this.on, deathStop = this.stopOnRevive === true, deaths = this.deaths?.length ?? 0;
      const reason = cause ?? "native_game";
      const callers = [...String(new Error().stack).matchAll(/[A-Za-z0-9_.-]+\.js:\d+:\d+/g)]
        .map((match) => match[0]).filter((value) => !value.startsWith("farm-diagnostics.js:")).slice(0, 4);
      const result = original.apply(this, args);
      if (this === auto && before !== this.on) {
        const snapshot = { ...flags(scene), deaths };
        if (binding?.auto === auto) binding.lastOn = this.on;
        if (this.on) { onAt = performance.now(); record(scene, "on", reason, callers, snapshot); }
        else queueMicrotask(() => record(scene, "off", reason === "shortcut" ? reason
          : deathStop ? "death_limit" : scene.clickOrder ? "click_to_move" : reason, callers,
          { ...snapshot, clickOrder: !!scene.clickOrder }));
      }
      return result;
    };
    const removeInput = GSTFarmInput.add(scene, (accepted) => {
      if (!accepted) record(scene, "input", "background_click_blocked");
    });
    try { auto.toggle = wrapper; }
    catch { removeInput(); return; }
    binding = { scene, auto, descriptor, wrapper, removeInput, lastOn: auto.on, modal: false, displaced: false };
    scene.events.on("preupdate", frame); scene.events.on("shutdown", detach); scene.events.on("destroy", detach);
    at = -Infinity; onAt = performance.now();
  }
  function toggle(scene, reason) {
    const previous = cause; cause = reason;
    try { return scene.toggleAutoFarm(); } finally { cause = previous; }
  }
  globalThis.GSTFarmDiagnostics = {
    attach: (scene) => { try { attach(scene); } catch { detach(); } },
    toggleByUser: (scene) => toggle(scene, "shortcut"),
    restore: (scene) => toggle(scene, "restore"),
    snapshot: () => ({ build: "farm-stop-1", tracking: binding !== null,
      background: globalThis.GSTBackgroundDiagnostics?.snapshot(),
      current: flags(binding?.scene), lastStop: rows.findLast((row) => row.event === "off") ?? null, events: [...rows] })
  };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== "https://nghichthienky.online"
        || event.data?.channel !== "gst:farm-debug-request:v1" || typeof event.data.requestId !== "string") return;
    at = -Infinity; frame();
    window.postMessage({ channel: "gst:farm-debug:v1", requestId: event.data.requestId,
      diagnostics: GSTFarmDiagnostics.snapshot() }, "https://nghichthienky.online");
  });
  window.addEventListener("pagehide", () => {
    if (binding) record(binding.scene, "context", "navigation");
    detach();
  });
})();
