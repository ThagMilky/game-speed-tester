(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  let preferences = { enabled: false, revision: 0 }, loaded = false, storageRevision = 0, sequence = 0;
  let latestStatus = { observed: "unknown", message: "Đang chờ trạng thái từ tab game." };
  let statusNotice = "";
  const pending = new Map();
  function configure() {
    if (!loaded) return;
    window.postMessage({ channel: "gst:meditation:v1", type: "configure",
      enabled: preferences.enabled, revision: preferences.revision, updatedAt: preferences.updatedAt }, origin);
  }
  function normalize(value) {
    return { ...(value && typeof value === "object" ? value : {}),
      enabled: value?.enabled === true,
      revision: Number.isSafeInteger(value?.revision) && value.revision >= 0 ? value.revision : 0,
      updatedAt: Number.isFinite(value?.updatedAt) && value.updatedAt >= 0 ? value.updatedAt : 0 };
  }
  async function disableAfterFarm(expectedRevision, occurredAt, reason) {
    try {
      const saved = await navigator.locks.request("gst:meditation-preferences", async () => {
        const current = normalize((await chrome.storage.local.get("meditationPreferences")).meditationPreferences);
        if (!current.enabled || current.updatedAt > occurredAt) return current;
        const next = { ...current, enabled: false, revision: Math.max(current.revision, expectedRevision) + 1,
          updatedAt: Date.now(), farmStoppedAt: occurredAt };
        await chrome.storage.local.set({ meditationPreferences: next });
        return next;
      });
      preferences = saved; loaded = true; configure();
      latestStatus = { ...latestStatus, enabled: false, message: saved.enabled ? latestStatus.message : reason };
      if (!saved.enabled) statusNotice = reason;
    } catch {
      window.postMessage({ channel: "gst:meditation:v1", type: "configure", enabled: false,
        revision: Math.max(preferences.revision + 1, expectedRevision + 1) }, origin);
      latestStatus = { ...latestStatus, enabled: false,
        message: `${reason} Không lưu được trạng thái TẮT; thao tác thiền vẫn đã dừng trong tab này.` };
      statusNotice = latestStatus.message;
    }
  }
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes.meditationPreferences) return;
    storageRevision++;
    const next = normalize(changes.meditationPreferences.newValue);
    if (!loaded || next.revision >= preferences.revision) {
      preferences = next; loaded = true; configure();
      if (next.enabled) statusNotice = "";
    }
  });
  const initialRevision = storageRevision;
  chrome.storage.local.get("meditationPreferences").then((result) => {
    if (storageRevision !== initialRevision) return;
    preferences = normalize(result.meditationPreferences); loaded = true; configure();
  }).catch(() => {
    latestStatus = { observed: "unknown", message: "Chưa đọc được cài đặt Luôn thiền." };
  });
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:meditation-status:v1") return;
    const data = event.data;
    if (data.type === "ready") { configure(); return; }
    if (data.status && typeof data.status === "object") latestStatus = { ...data.status };
    if (data.type === "farm-started") {
      latestStatus = { ...latestStatus, enabled: false,
        message: "Auto Farm vừa bật; đang lưu Luôn thiền thành TẮT." };
      statusNotice = latestStatus.message;
      void disableAfterFarm(Number.isSafeInteger(data.revision) ? data.revision : preferences.revision,
        Number.isFinite(data.occurredAt) ? data.occurredAt : Date.now(),
        "Auto Farm vừa bật; Luôn thiền đã tắt.");
      return;
    }
    if (data.type === "refused") {
      latestStatus = { ...latestStatus, enabled: false,
        message: String(data.status?.message ?? "Không thể bật Luôn thiền khi Auto Farm đang chạy.") };
      statusNotice = latestStatus.message;
      void disableAfterFarm(Number.isSafeInteger(data.revision) ? data.revision : preferences.revision,
        Number.isFinite(data.occurredAt) ? data.occurredAt : Date.now(), latestStatus.message);
      return;
    }
    const item = pending.get(data.requestId);
    if (!item) return;
    pending.delete(data.requestId); clearTimeout(item.timer);
    item.respond({ ...latestStatus, message: statusNotice || latestStatus.message, preferences: { ...preferences } });
  });
  function requestStatus(respond) {
    const requestId = ++sequence;
    const timer = setTimeout(() => {
      pending.delete(requestId);
      respond({ ...latestStatus, preferences: { ...preferences }, loaded,
        message: statusNotice || (loaded ? "Chưa nhận được trạng thái thiền từ game." : "Chưa đọc được cài đặt Luôn thiền.") });
    }, 1000);
    pending.set(requestId, { respond, timer });
    window.postMessage({ channel: "gst:meditation:v1", type: "status", requestId }, origin);
  }
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id || message?.type !== "gst:meditation-status") return;
    requestStatus(respond); return true;
  });
  window.addEventListener("pagehide", () => {
    for (const [id, item] of pending) {
      clearTimeout(item.timer); item.respond({ ...latestStatus, preferences: { ...preferences }, message: "Đang rời tab game." });
      pending.delete(id);
    }
  });
})();
