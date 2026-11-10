(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:potion:v1";
  let revision = 0, settings = null;
  function configure(value) {
    settings = {
      hpEnabled: value?.hpEnabled === true,
      mpEnabled: value?.mpEnabled === true,
      hpPercent: Number.isSafeInteger(value?.hpPercent) && value.hpPercent >= 1 && value.hpPercent <= 99 ? value.hpPercent : 40,
      mpPercent: Number.isSafeInteger(value?.mpPercent) && value.mpPercent >= 1 && value.mpPercent <= 99 ? value.mpPercent : 25
    };
    window.postMessage({ channel, type: "configure", preferences: settings }, origin);
  }
  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === origin && event.data?.channel === channel
        && event.data.type === "ready" && settings) configure(settings);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.potionPreferences) {
      revision++;
      configure(changes.potionPreferences.newValue);
    }
  });
  window.addEventListener("pageshow", () => { if (settings) configure(settings); });
  const initialRevision = revision;
  chrome.storage.local.get("potionPreferences").then(({ potionPreferences }) => {
    if (revision === initialRevision) configure(potionPreferences);
  }).catch(() => { /* Never enable automatic item usage on a failed storage read. */ });
})();
