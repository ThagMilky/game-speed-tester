(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const pending = new Map();
  let preferences = null;
  let revision = 0;
  let sequence = 0;
  let navigating = false;
  let repairedKey = null;
  function configure(value, respond) {
    const next = GSTHarvest.normalize(value);
    if (respond || JSON.stringify(next) !== JSON.stringify(preferences)) repairedKey = null;
    preferences = next;
    const url = new URL(location.href);
    if (preferences.enabled && !url.searchParams.has("timer")) {
      if (!navigating) {
        navigating = true;
        url.search += `${url.search ? "&" : "?"}timer`;
        location.replace(url.href);
      }
      respond?.({ accepted: true, applied: false, navigating: true });
      return;
    }
    let requestId;
    if (respond) {
      requestId = `configure:${++sequence}`;
      const timer = setTimeout(() => {
        pending.delete(requestId);
        respond({ accepted: true, applied: false });
      }, 800);
      pending.set(requestId, { timer, respond, kind: "configure", key: JSON.stringify(preferences) });
    }
    window.postMessage({ channel: "gst:harvest:v1", type: "configure", preferences, requestId }, origin);
  }
  function repair(data) {
    if (!preferences || navigating || data.type === "configured" || typeof data.configKey !== "string") return false;
    const key = JSON.stringify(preferences);
    if (data.configKey === key || repairedKey === key) return false;
    repairedKey = key;
    configure(preferences);
    return true;
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:harvest-status:v1") return;
    if (event.data.ready) { if (preferences) configure(preferences); return; }
    const entry = pending.get(event.data.requestId);
    const data = event.data;
    if (!entry) { repair(data); return; }
    if (entry.kind === "configure") {
      if (data.type !== "configured") return;
      pending.delete(data.requestId);
      clearTimeout(entry.timer);
      entry.respond({ accepted: true, applied: data.configKey === entry.key });
      return;
    }
    const applied = preferences !== null && data.configKey === JSON.stringify(preferences);
    if (!applied && !entry.retried && repair(data)) {
      // Recover a missed initial configure before returning a stale OFF status.
      // The page handles identical configurations without resetting its job.
      entry.retried = true;
      window.postMessage({ channel: "gst:harvest:v1", type: "status", requestId: data.requestId }, origin);
      return;
    }
    pending.delete(event.data.requestId);
    clearTimeout(entry.timer);
    entry.respond({ message: preferences && !applied
      ? "Cài đặt đã lưu chưa khớp với trang game. Tải lại trang game để nhận bản extension mới."
      : typeof data.message === "string" ? data.message.slice(0, 240) : "Chờ dữ liệu thu hoạch.",
      enabled: typeof data.enabled === "boolean" ? data.enabled : null, applied,
      available: data.available === true,
      catalog: (Array.isArray(data.catalog) ? data.catalog : [])
        .filter((item) => typeof item?.name === "string" && item.name.length <= 120).slice(0, 200)
        .map((item) => ({ name: item.name, inMap: item.inMap === true })) });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:harvest-configure") {
      revision++;
      configure(message.preferences, respond);
      return true;
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
    for (const { timer, respond, kind } of pending.values()) {
      clearTimeout(timer);
      respond(kind === "configure" ? { accepted: true, applied: false, navigating: true }
        : { message: "Đang chuyển trang.", catalog: [], available: false, applied: false });
    }
    pending.clear();
  });
  window.addEventListener("pageshow", () => {
    repairedKey = null;
    if (preferences) configure(preferences);
  });
  const initialRevision = revision;
  chrome.storage.local.get("harvestPreferences").then((saved) => {
    if (initialRevision === revision) configure(saved.harvestPreferences);
  }).catch(() => { if (initialRevision === revision) configure(null); });
})();
