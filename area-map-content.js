(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:area-map:v1";
  const allowed = /^(?:Period|Comma|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Minus|Equal|Backquote|Key[A-Z]|Digit[0-9]|F(?:[1-9]|10))$/;
  let shortcut = null, farmShortcut = null, version = 0;
  function configure() {
    const code = shortcut?.code;
    window.postMessage({ channel, type: "configure",
      code: typeof code === "string" && allowed.test(code) && !["KeyM", "KeyV", "F5"].includes(code)
        ? code : "Period",
      farmKey: Number.isSafeInteger(farmShortcut?.code) ? farmShortcut.code : 86
    }, origin);
  }
  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === origin && event.data?.channel === channel
        && event.data.type === "ready") configure();
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:area-map-toggle") return;
    window.postMessage({ channel, type: "toggle" }, origin);
    respond({ accepted: true });
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.areaMapShortcut) { version++; shortcut = changes.areaMapShortcut.newValue; }
    if (changes.farmShortcut) { version++; farmShortcut = changes.farmShortcut.newValue; }
    if (changes.areaMapShortcut || changes.farmShortcut) configure();
  });
  window.addEventListener("pageshow", configure);
  const current = version;
  chrome.storage.local.get(["areaMapShortcut", "farmShortcut"]).then((saved) => {
    if (version !== current) return;
    shortcut = saved.areaMapShortcut; farmShortcut = saved.farmShortcut;
    configure();
  }).catch(() => configure());
})();
