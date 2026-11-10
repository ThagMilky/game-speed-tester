(() => {
  "use strict";
  const modes = Object.freeze(["extended", "native", "disabled"]);
  const DEFAULT_MODE = "extended";
  const normalize = (value) => modes.includes(value) ? value : DEFAULT_MODE;

  globalThis.GSTFarmPolicy = Object.freeze({
    modes,
    defaultMode: DEFAULT_MODE,
    normalize,
    read(preferences) { return normalize(preferences?.policyMode); },
    withMode(preferences, mode) { return { ...(preferences ?? {}), policyMode: normalize(mode) }; },
    async save(mode) {
      return navigator.locks.request("gst:farm-preferences", async () => {
        const saved = await chrome.storage.local.get("farmPreferences");
        const next = { ...(saved.farmPreferences ?? {}), policyMode: normalize(mode) };
        await chrome.storage.local.set({ farmPreferences: next });
        return next.policyMode;
      });
    }
  });
})();
