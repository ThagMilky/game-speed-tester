(() => {
  "use strict";
  const accountsKey = "gstAccounts:v1";
  const profilesKey = "gstAccountProfiles:v1";
  const locks = new Map();
  const listeners = new Set();
  let contextState = { ready: false, context: null };

  function profileKey(slot, character) {
    if (typeof character !== "string" || !character.trim()) return "";
    return (typeof slot === "string" && slot ? "slot:" + slot : "legacy") + ":" + character.normalize("NFC");
  }
  function currentProfile(context, feature, storage) {
    const base = storage[feature === "farm" ? "farmPreferences" : "harvestPreferences"] ?? {};
    if (!context?.verified || !context.profileKey) return base;
    return { ...base, ...(storage[profilesKey]?.[context.profileKey]?.[feature] ?? {}) };
  }
  async function updateFeature(context, feature, update) {
    if (!["farm", "harvest"].includes(feature)) throw new Error("Unknown account preference.");
    const globalKey = feature === "farm" ? "farmPreferences" : "harvestPreferences";
    const scoped = !!context?.verified && !!context.profileKey;
    const lockName = scoped ? "gst:account-profiles"
      : feature === "farm" ? "gst:farm-preferences" : "gst:harvest-preferences";
    const queued = locks.get(lockName) ?? Promise.resolve();
    const save = queued.catch(() => {}).then(() => navigator.locks.request(lockName, async () => {
      const storage = await chrome.storage.local.get(scoped ? [globalKey, profilesKey] : [globalKey]);
      const current = scoped
        ? { ...(storage[globalKey] ?? {}), ...(storage[profilesKey]?.[context.profileKey]?.[feature] ?? {}) }
        : { ...(storage[globalKey] ?? {}) };
      const patch = typeof update === "function" ? update(current) : update;
      const value = { ...current, ...patch };
      if (!scoped) {
        await chrome.storage.local.set({ [globalKey]: value });
        return value;
      }
      const profiles = { ...(storage[profilesKey] ?? {}) };
      const record = { ...(profiles[context.profileKey] ?? {}) };
      record[feature] = value;
      profiles[context.profileKey] = record;
      await chrome.storage.local.set({ [profilesKey]: profiles });
      return value;
    }));
    locks.set(lockName, save);
    try { return await save; }
    finally { if (locks.get(lockName) === save) locks.delete(lockName); }
  }
  function setContext(context) {
    contextState = { ready: true, context: context && typeof context === "object" ? context : null };
    for (const listener of listeners) {
      try { listener(contextState.context); } catch { /* One feature cannot block the other profile listeners. */ }
    }
  }
  const api = {
    accountsKey, profilesKey, profileKey, currentProfile, updateFeature,
    context: () => contextState,
    onContext(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    setContext,
    async readAccounts() {
      const stored = await chrome.storage.local.get(accountsKey);
      return Array.isArray(stored[accountsKey]) ? stored[accountsKey] : [];
    },
    async writeAccounts(accounts) {
      await navigator.locks.request("gst:accounts:v1", async () => {
        await chrome.storage.local.set({ [accountsKey]: accounts });
      });
    },
    async updateAccounts(update) {
      return navigator.locks.request("gst:accounts:v1", async () => {
        const accounts = await api.readAccounts();
        const next = update(accounts);
        if (!Array.isArray(next)) throw new Error("Invalid account list.");
        await chrome.storage.local.set({ [accountsKey]: next });
        return next;
      });
    },
    async activeContext() {
      const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
      if (!tab?.id) return null;
      try {
        const context = await chrome.tabs.sendMessage(tab.id, { type: "gst:account-context" });
        return context && typeof context === "object" ? { ...context, tabId: tab.id } : null;
      } catch { return null; }
    },
    removeAccountProfiles(slot) {
      return navigator.locks.request("gst:account-profiles", async () => {
        const saved = await chrome.storage.local.get(profilesKey);
        const profiles = { ...(saved[profilesKey] ?? {}) };
        const prefix = "slot:" + slot + ":";
        for (const key of Object.keys(profiles)) if (key.startsWith(prefix)) delete profiles[key];
        await chrome.storage.local.set({ [profilesKey]: profiles });
      });
    }
  };
  globalThis.GSTAccountProfiles = api;
})();
