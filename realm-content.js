(() => {
  "use strict";
  const origin = "https://nghichthienky.online", pending = new Map();
  let preferences = null, revision = 0, sequence = 0;
  const normalize = (value) => ({ enabled: value?.enabled === true, allowFarm: value?.allowFarm === true,
    keepFarm: value?.keepFarm !== false, entryMode: value?.entryMode === "stand" ? "stand" : "enter",
    seekBoss: value?.seekBoss === true, seekExit: value?.seekExit === true,
    exitMode: value?.exitMode === "leave" ? "leave" : "stand" });
  function configure(value, requestId) {
    preferences = normalize(value);
    if ((preferences.enabled || preferences.keepFarm) && !new URL(location.href).searchParams.has("timer")) {
      const url = new URL(location.href);
      url.search += `${url.search ? "&" : "?"}timer`;
      location.replace(url.href);
      return;
    }
    window.postMessage({ channel: "gst:realm:v1", type: "configure", preferences, requestId }, origin);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:realm-status:v1") return;
    const data = event.data;
    if (data.ready) { if (preferences) configure(preferences); return; }
    const entry = pending.get(data.requestId);
    if (!entry) return;
    pending.delete(data.requestId); clearTimeout(entry.timer);
    entry.respond({ enabled: typeof data.enabled === "boolean" ? data.enabled : null,
      applied: data.configKey === entry.key, message: typeof data.message === "string" ? data.message.slice(0, 300) : "Chờ dữ liệu bí cảnh." });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || !["gst:realm-status", "gst:realm-configure"].includes(message?.type)) return;
    const requestId = `realm:${++sequence}`;
    const timer = setTimeout(() => {
      pending.delete(requestId);
      respond({ enabled: null, applied: false, message: "Chưa kết nối bí cảnh; tải lại extension rồi tải lại game." });
    }, 800);
    const next = normalize(message.preferences ?? preferences);
    pending.set(requestId, { respond, timer, key: JSON.stringify(next) });
    revision++;
    configure(next, requestId);
    return true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.realmPreferences) { revision++; configure(changes.realmPreferences.newValue); }
  });
  const initialRevision = revision;
  chrome.storage.local.get("realmPreferences").then((saved) => {
    if (initialRevision === revision) configure(saved.realmPreferences);
  }).catch(() => { /* Do not send guessed defaults after a storage failure. */ });
  window.addEventListener("pageshow", () => { if (preferences) configure(preferences); });
  window.addEventListener("pagehide", () => {
    for (const { timer, respond } of pending.values()) {
      clearTimeout(timer); respond({ enabled: null, applied: false, message: "Đang đổi map; chờ game tải xong." });
    }
    pending.clear();
  });
})();
