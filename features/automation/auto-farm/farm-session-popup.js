(() => {
  "use strict";
  const input = document.getElementById("farmKeepAcrossMaps");
  let revision = 0;
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.realmPreferences) { revision++; input.checked = changes.realmPreferences.newValue?.keepFarm !== false; }
  });
  const initial = revision;
  chrome.storage.local.get("realmPreferences").then((saved) => {
    if (revision === initial) input.checked = saved.realmPreferences?.keepFarm !== false;
    input.disabled = false;
  }).catch(() => {});
  input.addEventListener("change", async () => {
    input.disabled = true;
    try {
      await navigator.locks.request("gst:realm-preferences", async () => {
        const saved = await chrome.storage.local.get("realmPreferences");
        await chrome.storage.local.set({ realmPreferences: { ...saved.realmPreferences, keepFarm: input.checked } });
      });
    } catch {
      try { const saved = await chrome.storage.local.get("realmPreferences"); input.checked = saved.realmPreferences?.keepFarm !== false; } catch {}
    } finally { input.disabled = false; }
  });
})();
