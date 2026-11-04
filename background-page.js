(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let enabled = false, harvestEnabled = false, chestEnabled = false, suspended = false, binding = null, watcher = null, worker = null, url = null;
  let lastFrame = 0, failure = "";
  function sceneNow() {
    try { return window.game?.scene?.getScene?.("world")
      ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null); }
    catch { return null; }
  }
  function stop() {
    if (worker) { worker.terminate(); worker = null; }
    if (url) { URL.revokeObjectURL(url); url = null; }
  }
  function monitor() {
    const scene = binding?.scene, driver = scene?.driver;
    const connected = driver && !driver.closing && !driver.reconnecting && !driver.displaced
      && (driver.online === false || driver.link?.open?.() === true);
    if (!enabled || (!harvestEnabled && !(chestEnabled && scene?.self?.realm?.inside)) || suspended || !document.hidden || failure || !scene?.sys?.isActive?.()
        || sceneNow() !== scene || scene.auto?.on !== false || !connected) { stop(); return; }
    if (worker) return;
    const game = scene.game;
    if (typeof game?.headlessStep !== "function") { failure = "Game không cung cấp nhịp nền tương thích."; return; }
    try {
      url = URL.createObjectURL(new Blob([`let timer=null;onmessage=e=>{clearInterval(timer);timer=e.data?setInterval(()=>postMessage(0),50):null};postMessage("ready")`], { type: "text/javascript" }));
      const current = new Worker(url); worker = current;
      lastFrame = performance.now();
      current.onerror = () => {
        if (worker !== current) return;
        failure = "Không chạy được Worker nền; trình duyệt có thể chặn hoặc đình chỉ tab."; stop();
      };
      current.onmessage = (event) => {
        if (worker !== current) return;
        if (event.data === "ready") {
          if (url) { URL.revokeObjectURL(url); url = null; }
          current.postMessage(true); return;
        }
        // The game's own worker owns background stepping whenever native Auto Farm is ON.
        if (!enabled || (!harvestEnabled && !(chestEnabled && scene.self?.realm?.inside)) || suspended || !document.hidden || scene.auto?.on !== false
            || sceneNow() !== scene || !scene.sys?.isActive?.()) { stop(); return; }
        const d = scene.driver;
        if (!d || d.closing || d.reconnecting || d.displaced || !(d.online === false || d.link?.open?.() === true)) { stop(); return; }
        const now = performance.now(), delta = now - lastFrame;
        // A normal/headless frame already ran: do not advance the game a second time.
        if (delta < 40) return;
        try { game.headlessStep(now, Math.min(50, delta)); }
        catch { failure = "Nhịp nền không tương thích; đã dừng và nhường lại game."; stop(); }
      };
    } catch { failure = "Trình duyệt chặn Worker nền; giữ nhịp game gốc."; stop(); }
  }
  function frame() { lastFrame = performance.now(); monitor(); }
  function detach() {
    stop(); const old = binding; binding = null;
    if (old) { old.scene.events.off("postupdate", frame); old.scene.events.off("shutdown", shutdown); old.scene.events.off("destroy", shutdown); }
  }
  function discover() {
    if (!enabled || suspended) return;
    const scene = sceneNow();
    if (binding?.scene !== scene || !scene?.sys?.isActive?.()) detach();
    if (!binding && scene?.sys?.isActive?.() && typeof scene.auto?.on === "boolean" && typeof scene.events?.on === "function" && typeof scene.events.off === "function") {
      binding = { scene }; lastFrame = performance.now();
      scene.events.on("postupdate", frame); scene.events.on("shutdown", shutdown); scene.events.on("destroy", shutdown);
      if (watcher !== null) clearInterval(watcher); watcher = null;
    }
    if (!binding) watch();
    monitor();
  }
  function watch() { if (enabled && !suspended && !binding && watcher === null) watcher = setInterval(discover, 1000); }
  function shutdown() { detach(); watch(); }
  globalThis.GSTBackground = { status: () => failure ? `Nền: ${failure}` : "" };
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:background:v1") return;
    harvestEnabled = event.data.harvest === true; chestEnabled = event.data.chest === true;
    const next = harvestEnabled || chestEnabled;
    if (next !== enabled) failure = "";
    enabled = next;
    if (!enabled) { detach(); clearInterval(watcher); watcher = null; }
    else { watch(); discover(); }
  });
  document.addEventListener("visibilitychange", () => { discover(); monitor(); });
  window.addEventListener("pagehide", () => { suspended = true; detach(); clearInterval(watcher); watcher = null; });
  window.addEventListener("pageshow", () => { suspended = false; watch(); discover(); });
  window.postMessage({ channel: "gst:background-ready:v1" }, origin);
})();
