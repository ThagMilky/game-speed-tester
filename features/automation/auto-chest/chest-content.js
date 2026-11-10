(() => {
  "use strict";
  const origin = "https://nghichthienky.online", pending = new Map();
  let preferences = null, revision = 0, sequence = 0;
  const normalize = (value) => ({ enabled: value?.enabled === true, allowFarm: value?.allowFarm === true,
    kind: ["common", "hidden", "treasure"].includes(value?.kind) ? value.kind : "all" });
  const configure = () => { if (preferences) window.postMessage({ channel: "gst:chest:v1", type: "configure", preferences }, origin); };
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.chestPreferences) { revision++; preferences = normalize(changes.chestPreferences.newValue); configure(); }
  });
  const initial = revision;
  chrome.storage.local.get("chestPreferences").then((saved) => { if (initial === revision) { preferences = normalize(saved.chestPreferences); configure(); } }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:chest-status:v1") return;
    if (event.data.ready) { configure(); return; }
    const item = pending.get(event.data.requestId); if (!item) return;
    pending.delete(event.data.requestId); clearTimeout(item.timer);
    item.respond({ enabled: event.data.enabled === true, message: typeof event.data.message === "string" ? event.data.message.slice(0, 300) : "Chờ dữ liệu rương." });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:chest-status") return;
    const requestId = `chest:${++sequence}`;
    const timer = setTimeout(() => { pending.delete(requestId); respond({ message: "Tải lại extension rồi tải lại game để kết nối nhặt rương." }); }, 800);
    pending.set(requestId, { respond, timer });
    window.postMessage({ channel: "gst:chest:v1", type: "status", requestId }, origin); return true;
  });
  window.addEventListener("pageshow", configure);
  window.addEventListener("pagehide", () => { for (const item of pending.values()) { clearTimeout(item.timer); item.respond({ message: "Đang rời trang." }); } pending.clear(); });
})();
