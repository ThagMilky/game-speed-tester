(() => {
  "use strict";
  let display = false, notices = false, revision = 0, noticeRevision = 0;
  const send = () => window.postMessage({ channel: "gst:realm-time:v1", display, notices }, "https://nghichthienky.online");
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || (!changes.displayPreferences && !changes.realmNotices)) return;
    if (changes.displayPreferences) { revision++; const value = changes.displayPreferences.newValue; display = value?.visible !== false && value?.fields?.realm === true; }
    if (changes.realmNotices) { noticeRevision++; notices = changes.realmNotices.newValue === true; }
    send();
  });
  const initial = revision, initialNotice = noticeRevision;
  chrome.storage.local.get(["displayPreferences", "realmNotices"]).then((saved) => {
    if (revision === initial) display = saved.displayPreferences?.visible !== false && saved.displayPreferences?.fields?.realm === true;
    if (noticeRevision === initialNotice) notices = saved.realmNotices === true;
    send();
  }).catch(() => {});
  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === "https://nghichthienky.online" && event.data?.channel === "gst:realm-time-ready:v1") send();
  });
  window.addEventListener("pageshow", send);
})();
