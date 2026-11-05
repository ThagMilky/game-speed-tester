(() => {
  "use strict";
  const controls = document.getElementById("fpsControls");
  const enabled = document.getElementById("fpsEnabled");
  const range = document.getElementById("minimapRange");
  const inputs = [...document.querySelectorAll("[data-fps-field]")];
  const feedback = document.getElementById("fpsFeedback");
  const status = document.getElementById("fpsStatus");
  let saved = null, busy = false, saving = false;
  function render() {
    enabled.checked = saved.enabled;
    range.value = String(saved.minimapRange);
    for (const input of inputs) input.checked = saved[input.dataset.fpsField];
  }
  async function refresh() {
    if (busy) return;
    busy = true;
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No tab");
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:fps-status" });
      status.textContent = `${Number.isFinite(result.fps) ? `FPS: ${result.fps} · ` : ""}${result.message}`;
    } catch { status.textContent = "Mở tab game; tải lại tab sau khi cập nhật để dùng tối ưu FPS."; }
    finally { busy = false; }
  }
  async function save(reset = false) {
    if (!saved || saving) return;
    const next = reset ? GSTFpsOptions.normalize(null) : GSTFpsOptions.normalize({ enabled: enabled.checked,
      minimapRange: Number(range.value),
      ...Object.fromEntries(inputs.map((input) => [input.dataset.fpsField, input.checked])) });
    saving = true; controls.disabled = true;
    try {
      await chrome.storage.local.set({ fpsPreferences: next });
      saved = next; render(); feedback.textContent = "";
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab?.id) throw new Error("No tab");
        const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:fps-configure", preferences: saved });
        if (!result?.accepted) throw new Error("No bridge");
      } catch { feedback.textContent = "Đã lưu. Tải lại tab game nếu chưa áp dụng được."; }
      await refresh();
    } catch { render(); feedback.textContent = "Chưa lưu được tùy chọn FPS. Thử mở lại popup."; }
    finally { saving = false; controls.disabled = false; }
  }
  controls.addEventListener("change", () => save());
  document.getElementById("fpsReset").addEventListener("click", () => save(true));
  for (const [id, value] of [["fpsSelectAll", true], ["fpsSelectNone", false]]) {
    document.getElementById(id).addEventListener("click", () => {
      if (!saved || saving) return;
      for (const input of inputs) input.checked = value;
      save();
    });
  }
  chrome.storage.local.get("fpsPreferences").then(({ fpsPreferences }) => {
    saved = GSTFpsOptions.normalize(fpsPreferences); render(); controls.disabled = false;
  }).catch(() => { feedback.textContent = "Không đọc được cài đặt FPS. Thử mở lại popup."; });
  globalThis.GSTFpsPopup = { refresh };
  refresh();
})();
