(() => {
  "use strict";
  let revision = 0;
  const configure = (value) => window.postMessage({ channel: "gst:farm-session:v1", type: "configure",
    preferences: { keepFarm: value?.keepFarm !== false } }, location.origin);
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.realmPreferences) { revision++; configure(changes.realmPreferences.newValue); }
  });
  const initial = revision;
  chrome.storage.local.get("realmPreferences").then((saved) => {
    if (revision === initial) configure(saved.realmPreferences);
  }).catch(() => {});
})();
