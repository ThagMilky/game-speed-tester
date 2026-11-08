(() => {
  "use strict";
  const origin = "https://nghichthienky.online", channel = "gst:area-map:v1";
  const allowed = /^(?:Period|Comma|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Minus|Equal|Backquote|Key[A-Z]|Digit[0-9]|F(?:[1-9]|10))$/;
  let shortcut = null, farmShortcut = null, mapOptions = null, loaded = false;
  const changedKeys = new Set();
  const defaults = { npcs: true, resources: true, gates: true, portals: true,
    exits: true, clickMove: false, returnDeath: false };
  const normalize = (value) => Object.fromEntries(Object.keys(defaults)
    .map((key) => [key, typeof value?.[key] === "boolean" ? value[key] : defaults[key]]));
  function configure() {
    // Never overwrite the pending death destination with defaults before storage loads.
    if (!loaded) return;
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
    if (changes.areaMapShortcut) { changedKeys.add("areaMapShortcut"); shortcut = changes.areaMapShortcut.newValue; }
    if (changes.farmShortcut) { changedKeys.add("farmShortcut"); farmShortcut = changes.farmShortcut.newValue; }
    if (changes.areaMapOptions) { changedKeys.add("areaMapOptions"); mapOptions = changes.areaMapOptions.newValue; }
    if (changes.areaMapShortcut || changes.farmShortcut || changes.areaMapOptions) configure();
  });
  window.addEventListener("pageshow", configure);
  chrome.storage.local.get(["areaMapShortcut", "farmShortcut", "areaMapOptions"]).then((saved) => {
    if (!changedKeys.has("areaMapShortcut")) shortcut = saved.areaMapShortcut;
    if (!changedKeys.has("farmShortcut")) farmShortcut = saved.farmShortcut;
    if (!changedKeys.has("areaMapOptions")) mapOptions = saved.areaMapOptions;
    loaded = true;
    configure();
  }).catch(() => { loaded = true; configure(); });
})();
