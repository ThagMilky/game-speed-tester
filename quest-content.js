(() => {
  "use strict";
  const origin = "https://nghichthienky.online", pending = new Map();
  let selected = [], sequence = 0, revision = 0;
  const normalize = (v) => Array.isArray(v?.selected) ? [...new Set(v.selected.filter((id) => typeof id === "string" && id.length <= 150))].slice(0, 200) : [];
  function configure() { window.postMessage({ channel: "gst:quest:v1", type: "configure", selected }, origin); }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.questPreferences) { revision++; selected = normalize(changes.questPreferences.newValue); configure(); }
  });
  const initial = revision;
  chrome.storage.local.get("questPreferences").then((value) => {
    if (initial === revision) { selected = normalize(value.questPreferences); configure(); }
  }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:quest-status:v1") return;
    if (event.data.ready) { configure(); return; }
    const item = pending.get(event.data.requestId); if (!item) return;
    pending.delete(event.data.requestId); clearTimeout(item.timer);
    const quests = Array.isArray(event.data.quests) ? event.data.quests.slice(0, 200).map((q) => ({
      id: typeof q.id === "string" ? q.id.slice(0, 150) : "", title: String(q.title ?? "").slice(0, 500),
      done: q.done === true, supported: q.supported === true, support: String(q.support ?? "").slice(0, 500),
      progress: String(q.progress ?? "").slice(0, 2000), reward: String(q.reward ?? "").slice(0, 500),
      xp: Number.isFinite(q.xp) ? q.xp : null, coins: Number.isFinite(q.coins) ? q.coins : null
    })) : [];
    item.respond({ running: event.data.running === true, message: String(event.data.message ?? "").slice(0, 500), quests });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:quest" || !["status", "start", "stop"].includes(message.command)) return;
    const requestId = `quest:${++sequence}`;
    const timer = setTimeout(() => { pending.delete(requestId); respond({ message: "Reload extension rồi tải lại game với tham số timer để đọc quest.", unavailable: true }); }, 1200);
    pending.set(requestId, { respond, timer });
    // Send preferences before Start so a just-saved selection cannot lag behind the command.
    if (message.command === "start") {
      revision++; selected = normalize({ selected: message.selected }); configure();
    }
    window.postMessage({ channel: "gst:quest:v1", type: message.command, requestId }, origin);
    return true;
  });
  window.addEventListener("pageshow", configure);
  window.addEventListener("pagehide", () => {
    for (const item of pending.values()) { clearTimeout(item.timer); item.respond({ unavailable: true, message: "Đang rời trang game." }); }
    pending.clear();
  });
})();
