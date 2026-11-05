(() => {
  "use strict";
  const origin = "https://nghichthienky.online", pending = new Map();
  let preferences = null, measure = false, revision = 0, displayRevision = 0, sequence = 0, suspended = false;
  let navigating = false;
  let selfColor = null;
  function configure() {
    if (!preferences || suspended) return;
    const url = new URL(location.href);
    if ((preferences.enabled || measure) && !url.searchParams.has("timer")) {
      if (!navigating) {
        navigating = true;
        url.search += `${url.search ? "&" : "?"}timer`;
        location.replace(url.href);
      }
      return;
    }
    window.postMessage({ channel: "gst:fps:v1", type: "configure", preferences: { ...preferences, minimapSelfColor: selfColor }, measure }, origin);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:fps-status:v1") return;
    if (event.data.ready) { configure(); return; }
    const entry = pending.get(event.data.requestId);
    if (!entry) return;
    pending.delete(event.data.requestId); clearTimeout(entry.timer);
    entry.respond({ enabled: event.data.enabled === true, active: event.data.active === true,
      fps: Number.isFinite(event.data.fps) ? event.data.fps : null,
      message: typeof event.data.message === "string" ? event.data.message.slice(0, 240) : "Chưa đọc được trạng thái FPS." });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:fps-configure") {
      revision++;
      preferences = GSTFpsOptions.normalize(message.preferences);
      configure(); respond({ accepted: true }); return;
    }
    if (message?.type !== "gst:fps-status") return;
    const requestId = String(++sequence);
    const timer = setTimeout(() => {
      pending.delete(requestId);
      respond({ message: "Chưa kết nối tối ưu FPS. Tải lại extension rồi tải lại tab game." });
    }, 800);
    pending.set(requestId, { respond, timer });
    window.postMessage({ channel: "gst:fps:v1", type: "status", requestId }, origin);
    return true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.minimapSelfColor && /^#[0-9a-f]{6}$/i.test(changes.minimapSelfColor.newValue ?? "")) {
      selfColor = changes.minimapSelfColor.newValue; configure();
    }
    if (changes.fpsPreferences) { revision++; preferences = GSTFpsOptions.normalize(changes.fpsPreferences.newValue); }
    if (changes.displayPreferences) {
      displayRevision++;
      measure = changes.displayPreferences.newValue?.visible !== false
        && changes.displayPreferences.newValue?.fields?.fps === true;
    }
    if (changes.fpsPreferences || changes.displayPreferences) configure();
  });
  window.addEventListener("pagehide", () => {
    suspended = true;
    for (const entry of pending.values()) { clearTimeout(entry.timer); entry.respond({ message: "Đang rời trang." }); }
    pending.clear();
  });
  window.addEventListener("pageshow", () => { suspended = false; configure(); });
  const initialRevision = revision;
  const initialDisplayRevision = displayRevision;
  chrome.storage.local.get(["fpsPreferences", "displayPreferences", "minimapSelfColor"]).then(async (saved) => {
    if (!selfColor) {
      if (/^#[0-9a-f]{6}$/i.test(saved.minimapSelfColor ?? "")) selfColor = saved.minimapSelfColor;
      else {
        const palette = ["#ffe066", "#ffb86c", "#ff9ed2", "#f1f5ff", "#73f5e5"];
        selfColor = palette[Math.floor(Math.random() * palette.length)];
        await chrome.storage.local.set({ minimapSelfColor: selfColor }).catch(() => {});
      }
    }
    if (revision === initialRevision) preferences = GSTFpsOptions.normalize(saved.fpsPreferences);
    if (displayRevision === initialDisplayRevision) {
      measure = saved.displayPreferences?.visible !== false && saved.displayPreferences?.fields?.fps === true;
    }
    configure();
  }).catch(() => { /* No settings: leave the game untouched. */ });
})();
