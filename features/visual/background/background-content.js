(() => {
  "use strict";
  let chest = false, chestRevision = 0;
  const send = () => window.postMessage({ channel: "gst:background:v1", chest }, "https://nghichthienky.online");
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.chestPreferences) { chestRevision++; chest = changes.chestPreferences.newValue?.enabled === true; }
    if (changes.chestPreferences) send();
  });
  const c = chestRevision;
  chrome.storage.local.get(["chestPreferences"]).then((saved) => {
    if (c === chestRevision) chest = saved.chestPreferences?.enabled === true;
    send();
  }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === "https://nghichthienky.online" && event.data?.channel === "gst:background-ready:v1") send();
  });
  window.addEventListener("pageshow", send);
})();
