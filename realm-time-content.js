(() => {
  "use strict";
  let display = false, notices = false, revision = 0;
  const send = () => window.postMessage({ channel: "gst:realm-time:v1", display, notices }, "https://nghichthienky.online");
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.displayPreferences) { revision++; const value = changes.displayPreferences.newValue; display = value?.visible !== false && value?.fields?.realm === true; }
    if (changes.realmNotices) { revision++; notices = changes.realmNotices.newValue === true; }
    send();
  });
  const initial = revision;
  chrome.storage.local.get(["displayPreferences", "realmNotices"]).then((saved) => {
    if (revision !== initial) return;
    display = saved.displayPreferences?.visible !== false && saved.displayPreferences?.fields?.realm === true;
    notices = saved.realmNotices === true; send();
  }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === "https://nghichthienky.online" && event.data?.channel === "gst:realm-time-ready:v1") send();
  });
  window.addEventListener("pageshow", send);
})();
