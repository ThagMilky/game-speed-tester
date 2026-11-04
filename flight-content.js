(() => {
  "use strict";
  const origin = "https://nghichthienky.online", pending = new Map();
  let always = false, revision = 0, sequence = 0, navigating = false;
  function configure() {
    const url = new URL(location.href);
    if (always && !url.searchParams.has("timer")) {
      if (!navigating) { navigating = true; url.search += `${url.search ? "&" : "?"}timer`; location.replace(url.href); }
      return;
    }
    window.postMessage({ channel: "gst:flight:v1", type: "configure", always }, origin);
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.flightPreferences) { revision++; always = changes.flightPreferences.newValue?.always === true; configure(); }
  });
  const initial = revision;
  chrome.storage.local.get("flightPreferences").then((value) => { if (initial === revision) { always = value.flightPreferences?.always === true; configure(); } }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:flight-status:v1") return;
    if (event.data.ready) { configure(); return; }
    const item = pending.get(event.data.requestId); if (!item) return;
    pending.delete(event.data.requestId); clearTimeout(item.timer);
    item.respond({ message: String(event.data.message ?? "").slice(0, 300), always: event.data.always === true });
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:flight-status") return;
    const requestId = `flight:${++sequence}`;
    const timer = setTimeout(() => { pending.delete(requestId); respond({ message: "Tải lại extension và game để kết nối điều khiển bay." }); }, 800);
    pending.set(requestId, { respond, timer }); window.postMessage({ channel: "gst:flight:v1", type: "status", requestId }, origin); return true;
  });
  window.addEventListener("pageshow", configure);
  window.addEventListener("pagehide", () => { for (const item of pending.values()) { clearTimeout(item.timer); item.respond({ message: "Đang rời trang." }); } pending.clear(); });
})();
