(() => {
  "use strict";
  let harvest = false, chest = false, harvestRevision = 0, chestRevision = 0;
  const send = () => window.postMessage({ channel: "gst:background:v1", harvest, chest }, "https://nghichthienky.online");
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.harvestPreferences) { harvestRevision++; harvest = changes.harvestPreferences.newValue?.enabled === true; }
    if (changes.chestPreferences) { chestRevision++; chest = changes.chestPreferences.newValue?.enabled === true; }
    if (changes.harvestPreferences || changes.chestPreferences) send();
  });
  const h = harvestRevision, c = chestRevision;
  chrome.storage.local.get(["harvestPreferences", "chestPreferences"]).then((saved) => {
    if (h === harvestRevision) harvest = saved.harvestPreferences?.enabled === true;
    if (c === chestRevision) chest = saved.chestPreferences?.enabled === true;
    send();
  }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === "https://nghichthienky.online" && event.data?.channel === "gst:background-ready:v1") send();
  });
  window.addEventListener("pageshow", send);
})();
