(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let root = null;
  const dismissTimers = new Set();
  function mount() {
    if (root || !document.body) return;
    root = document.createElement("div"); root.id = "gst-feature-toasts";
    root.style.cssText = "all:initial;position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:2147483646;display:flex;flex-direction:column;gap:8px;pointer-events:none";
    document.body.append(root);
  }
  function show(feature, enabled) {
    mount(); if (!root) return;
    const toast = document.createElement("div");
    toast.textContent = `${feature === "farm" ? "Auto Farm" : "Thu hoạch"}: ${enabled ? "BẬT" : "TẮT"}`;
    toast.style.cssText = "all:initial;display:block;box-sizing:border-box;padding:10px 14px;border-radius:8px;background:#14231f;color:#e8fff6;border:1px solid #69dfb7;box-shadow:0 4px 18px #0008;font:600 14px/1.3 sans-serif;white-space:nowrap;pointer-events:none";
    root.append(toast);
    const dismiss = setTimeout(() => { toast.remove(); dismissTimers.delete(dismiss); }, 2000);
    dismissTimers.add(dismiss);
  }
  function onMessage(event) {
    const data = event.data;
    if (event.source !== window || event.origin !== origin || data?.channel !== "gst:feature-toast:v1"
        || !["farm", "harvest"].includes(data.feature) || typeof data.enabled !== "boolean"
        || typeof data.identity !== "string" || !data.identity) return;
    show(data.feature, data.enabled);
  }
  function cleanup() {
    for (const dismiss of dismissTimers) clearTimeout(dismiss);
    dismissTimers.clear(); root?.remove(); root = null;
  }
  window.addEventListener("message", onMessage);
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount, { once: true });
  window.addEventListener("pagehide", cleanup, { once: true });
  window.addEventListener("pageshow", mount);
})();
