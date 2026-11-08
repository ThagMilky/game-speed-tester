(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:area-map:v1";
  const allowed = /^(?:Period|Comma|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Minus|Equal|Backquote|Key[A-Z]|Digit[0-9]|F(?:[1-9]|10))$/;
  let shortcut = null, farmShortcut = null, mapOptions = null, version = 0;
  const defaults = { npcs: true, resources: true, gates: true, portals: true,
    exits: true, clickMove: false, returnDeath: false };
  const normalize = (value) => Object.fromEntries(Object.keys(defaults)
    .map((key) => [key, typeof value?.[key] === "boolean" ? value[key] : defaults[key]]));
  function configure() {
    const code = shortcut?.code;
    window.postMessage({ channel, type: "configure",
      code: typeof code === "string" && allowed.test(code) && !["KeyM", "KeyV", "F5"].includes(code)
        ? code : "Period",
      farmKey: Number.isSafeInteger(farmShortcut?.code) ? farmShortcut.code : 86,
      options: normalize(mapOptions)
    }, origin);
  }
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== channel) return;
    if (event.data.type === "ready") configure();
    else if (event.data.type === "options" && event.data.options
        && Object.keys(defaults).every((key) => typeof event.data.options[key] === "boolean")) {
      mapOptions = normalize(event.data.options);
      version++;
      chrome.storage.local.set({ areaMapOptions: mapOptions }).catch(() => configure());
    }
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
    if (changes.areaMapOptions) { version++; mapOptions = changes.areaMapOptions.newValue; }
    if (changes.areaMapShortcut || changes.farmShortcut || changes.areaMapOptions) configure();
  });
  window.addEventListener("pageshow", configure);
  const current = version;
  chrome.storage.local.get(["areaMapShortcut", "farmShortcut", "areaMapOptions"]).then((saved) => {
    if (version !== current) return;
    shortcut = saved.areaMapShortcut; farmShortcut = saved.farmShortcut;
    mapOptions = saved.areaMapOptions;
    configure();
  }).catch(() => configure());
})();
