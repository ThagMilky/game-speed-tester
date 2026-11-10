(() => {
  "use strict";
  const style = document.createElement("style");
  let timer = null;
  let preferences = null;
  let appliedFont = null;
  let revision = 0;
  let suspended = false;

  function scheduleFont() {
    if (timer !== null) clearTimeout(timer);
    timer = null;
    if (!preferences) return;
    if (!preferences.enabled) {
      style.remove();
      appliedFont = null;
      return;
    }
    if (suspended || document.readyState === "loading") return;
    if (style.isConnected && appliedFont === preferences.font) return;
    // Debounce changes; reuse one stylesheet without touching the game's CSS.
    timer = setTimeout(() => {
      timer = null;
      const family = GSTFont.families[preferences.font];
      style.textContent = `
        :root { --ui-font: ${family} !important; }
        html, body, body * { font-family: ${family} !important; }
      `;
      if (!style.isConnected) document.documentElement.append(style);
      appliedFont = preferences.font;
    }, 1000);
  }

  function configure(value) {
    revision++;
    preferences = GSTFont.normalize(value);
    scheduleFont();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.fontPreferences) configure(changes.fontPreferences.newValue);
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:font") return;
    configure(message.preferences);
    respond({ accepted: true });
  });
  document.addEventListener("DOMContentLoaded", scheduleFont, { once: true });
  window.addEventListener("pageshow", () => {
    suspended = false;
    scheduleFont();
  });
  window.addEventListener("pagehide", () => {
    suspended = true;
    if (timer !== null) clearTimeout(timer);
    timer = null;
    style.remove();
    appliedFont = null;
  });

  const initialRevision = revision;
  chrome.storage.local.get("fontPreferences").then(({ fontPreferences }) => {
    if (revision === initialRevision) configure(fontPreferences);
  }).catch(() => {
    // Keep the game's font if preferences could not be read.
  });
})();
