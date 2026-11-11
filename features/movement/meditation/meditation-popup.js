(() => {
  "use strict";
  const input = document.getElementById("alwaysMeditating");
  const savedStatus = document.getElementById("meditationSavedStatus");
  const runtimeStatus = document.getElementById("meditationRuntimeStatus");
  const feedback = document.getElementById("meditationFeedback");
  let loaded = false, saving = false, confirmed = { enabled: false, revision: 0, updatedAt: 0 };
  let operation = 0, pendingSave = Promise.resolve({ saved: true });
  function normalize(value) {
    return { ...(value && typeof value === "object" ? value : {}),
      enabled: value?.enabled === true,
      revision: Number.isSafeInteger(value?.revision) && value.revision >= 0 ? value.revision : 0,
      updatedAt: Number.isFinite(value?.updatedAt) && value.updatedAt >= 0 ? value.updatedAt : 0 };
  }
  function syncSaved() {
    if (!saving) input.checked = confirmed.enabled;
    savedStatus.textContent = loaded
      ? `Lựa chọn đã lưu: ${confirmed.enabled ? "BẬT" : "TẮT"}. Đồng bộ cho các tab game.`
      : "Chưa đọc được lựa chọn đã lưu.";
    input.disabled = !loaded || saving;
  }
  let storageRevision = 0;
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.meditationPreferences) return;
    storageRevision++;
    const next = normalize(changes.meditationPreferences.newValue);
    if (!loaded || next.revision >= confirmed.revision) {
      confirmed = next; loaded = true;
      if (!saving) syncSaved();
    }
  });
  const initialRevision = storageRevision;
  chrome.storage.local.get("meditationPreferences").then((value) => {
    if (storageRevision !== initialRevision) return;
    confirmed = normalize(value.meditationPreferences); loaded = true; syncSaved();
  }).catch(() => {
    input.disabled = true;
    savedStatus.textContent = "Không đọc được cài đặt Luôn thiền; bộ chọn vẫn khóa để tránh ghi đè.";
  });

  async function farmIsRunningInOpenTabs() {
    const tabs = await chrome.tabs.query({ url: "https://nghichthienky.online/*" });
    const replies = await Promise.all(tabs.filter((tab) => Number.isInteger(tab.id)).map(async (tab) => {
      try {
        const meditation = await chrome.tabs.sendMessage(tab.id, { type: "gst:meditation-status" });
        if (typeof meditation?.autoOn === "boolean") return { autoOn: meditation.autoOn, unknown: false };
      } catch { /* Older open tabs may not have this bridge until reloaded. */ }
      try {
        const farm = await chrome.tabs.sendMessage(tab.id, { type: "gst:farm-status" });
        if (typeof farm?.autoOn === "boolean") return { autoOn: farm.autoOn, unknown: false };
      } catch { /* The tab may not have the extension content scripts yet. */ }
      return { autoOn: false, unknown: true };
    }));
    return { running: replies.some((reply) => reply.autoOn), unknown: replies.some((reply) => reply.unknown) };
  }
  async function saveChoice(choice, baseRevision, requestedAt) {
    try {
      if (choice) {
        const farm = await farmIsRunningInOpenTabs();
        if (farm.running) throw new Error("Auto Farm đang chạy ở một tab game; hãy dừng farm trước khi bật Luôn thiền.");
        if (farm.unknown) throw new Error("Chưa xác nhận được trạng thái Auto Farm ở mọi tab game; hãy tải lại các tab rồi thử lại.");
      }
      const next = await navigator.locks.request("gst:meditation-preferences", async () => {
        const current = normalize((await chrome.storage.local.get("meditationPreferences")).meditationPreferences);
        if (current.revision !== baseRevision)
          throw new Error("Cài đặt vừa được đổi ở cửa sổ khác; đã đồng bộ giá trị mới nhất.");
        const saved = { ...current, enabled: choice, revision: current.revision + 1, updatedAt: requestedAt };
        await chrome.storage.local.set({ meditationPreferences: saved });
        return saved;
      });
      if (next.revision >= confirmed.revision) {
        confirmed = next; loaded = true;
        feedback.textContent = `Đã lưu Luôn thiền ${choice ? "BẬT" : "TẮT"}. Trạng thái thiền được đọc riêng từ game.`;
      } else {
        feedback.textContent = "Cửa sổ khác đã lưu lựa chọn mới hơn; đã giữ giá trị mới nhất.";
      }
      return { saved: true };
    } catch (error) {
      const message = String(error?.message ?? "Chưa lưu được Luôn thiền.");
      try {
        const latest = normalize((await chrome.storage.local.get("meditationPreferences")).meditationPreferences);
        if (latest.revision >= confirmed.revision) confirmed = latest;
      } catch { /* Keep the last confirmed value. */ }
      feedback.textContent = message;
      return { saved: false, reason: "persistence" };
    } finally {
      syncSaved();
    }
  }
  input.addEventListener("change", () => {
    if (!loaded || saving) { syncSaved(); return; }
    const choice = input.checked, baseRevision = confirmed.revision, requestedAt = Date.now(), current = ++operation;
    saving = true; syncSaved(); feedback.textContent = "Đang lưu Luôn thiền…";
    pendingSave = saveChoice(choice, baseRevision, requestedAt).then((result) => {
      if (current !== operation) return result;
      return result;
    }).finally(() => { saving = false; syncSaved(); });
  });
  async function refresh() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active game tab.");
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:meditation-status" });
      const observed = result?.observed === "on" ? "ĐANG THIỀN"
        : result?.observed === "off" ? "CHƯA THIỀN" : "CHƯA RÕ";
      runtimeStatus.textContent = `Trạng thái thiền theo game trong tab đang mở: ${observed}. ${result?.message ?? ""}`;
      if (result?.autoOn && confirmed.enabled) {
        runtimeStatus.textContent += " Auto Farm đang bật.";
      }
    } catch {
      runtimeStatus.textContent = "Trạng thái thiền theo game trong tab đang mở: CHƯA RÕ.";
    }
  }
  input.addEventListener("change", () => { void refresh(); });
  const timer = setInterval(() => { void refresh(); }, 1200);
  void refresh();
  globalThis.GSTMeditationPopup = {
    async flushPendingSave() { return await pendingSave; },
    refresh
  };
  window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
})();
