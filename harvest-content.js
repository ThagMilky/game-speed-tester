(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const pending = new Map();
  let preferences = null;
  let revision = 0;
  let sequence = 0;
  let navigating = false;
  function configure(value) {
    preferences = GSTHarvest.normalize(value);
    const url = new URL(location.href);
    if (preferences.enabled && !url.searchParams.has("timer")) {
      if (!navigating) {
        navigating = true;
        url.search += `${url.search ? "&" : "?"}timer`;
        location.replace(url.href);
      }
      return;
    }
    window.postMessage({ channel: "gst:harvest:v1", type: "configure", preferences }, origin);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:harvest-status:v1") return;
    if (event.data.ready) { if (preferences) configure(preferences); return; }
    const entry = pending.get(event.data.requestId);
    if (!entry) return;
    pending.delete(event.data.requestId);
    clearTimeout(entry.timer);
    const data = event.data;
    entry.respond({ message: typeof data.message === "string" ? data.message.slice(0, 240) : "Chờ dữ liệu thu hoạch.",
      available: data.available === true,
      catalog: (Array.isArray(data.catalog) ? data.catalog : [])
        .filter((item) => typeof item?.name === "string" && item.name.length <= 120).slice(0, 200)
        .map((item) => ({ name: item.name, inMap: item.inMap === true })) });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:harvest-configure") {
      revision++;
      configure(message.preferences);
      respond({ accepted: true });
      return;
    }
    if (message?.type !== "gst:harvest-status") return;
    const requestId = `popup:${++sequence}`;
    const timer = setTimeout(() => {
      pending.delete(requestId);
      respond({ message: "Chưa kết nối Tự hái; tải lại trang game sau khi cập nhật extension.", catalog: [], available: false });
    }, 800);
    pending.set(requestId, { timer, respond });
    window.postMessage({ channel: "gst:harvest:v1", type: "status", requestId }, origin);
    return true;
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.harvestPreferences) {
      revision++; configure(changes.harvestPreferences.newValue);
    }
  });
  window.addEventListener("pagehide", () => {
    for (const { timer, respond } of pending.values()) {
      clearTimeout(timer);
      respond({ message: "Đang chuyển trang.", catalog: [], available: false });
    }
    pending.clear();
  });
  window.addEventListener("pageshow", () => { if (preferences) configure(preferences); });
  const initialRevision = revision;
  chrome.storage.local.get("harvestPreferences").then((saved) => {
    if (initialRevision === revision) configure(saved.harvestPreferences);
  }).catch(() => configure(null));
})();
