"use strict";
const controls = document.getElementById("controls");
const enabledInput = document.getElementById("enabled");
const walkingInput = document.getElementById("walkingSpeed");
const flyingInput = document.getElementById("flyingSpeed");
const speedInputs = [walkingInput, flyingInput];
const statusText = document.getElementById("status");
const feedback = document.getElementById("feedback");
const displayControls = document.getElementById("displayControls");
const showOverlay = document.getElementById("showOverlay");
const displayFields = [...document.querySelectorAll("[data-display-field]")];
const fontControls = document.getElementById("fontControls");
const fontEnabled = document.getElementById("fontEnabled");
const fontFamily = document.getElementById("fontFamily");
const fontFeedback = document.getElementById("fontFeedback");
const farmControls = document.getElementById("farmControls");
const farmEnabled = document.getElementById("farmEnabled");
const autoRespawn = document.getElementById("autoRespawn");
const farmRadius = document.getElementById("farmRadius");
const farmTargetMode = document.getElementById("farmTargetMode");
const farmTargetLevel = document.getElementById("farmTargetLevel");
const farmStatus = document.getElementById("farmStatus");
const autoFarmValue = document.getElementById("autoFarmValue");
const farmFeedback = document.getElementById("farmFeedback");
const shortcutControls = document.getElementById("shortcutControls");
const shortcutLabel = document.getElementById("shortcutLabel");
const shortcutFeedback = document.getElementById("shortcutFeedback");
let capturingShortcut = false;

async function saveShortcut(code) {
  shortcutControls.disabled = true;
  const label = code === null ? "Đang dùng phím gốc của game (V)"
    : `Phím tùy chỉnh: ${code >= 112 ? `F${code - 111}` : String.fromCharCode(code)}`;
  try {
    await chrome.storage.local.set({ farmShortcut: { code } });
    shortcutLabel.textContent = label;
    shortcutFeedback.textContent = "Đã lưu.";
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:farm-shortcut", preferences: { code } });
      if (!result?.accepted) throw new Error("Not accepted.");
    } catch {
      shortcutFeedback.textContent = "Đã lưu. Tải lại trang game nếu chưa áp dụng được.";
    }
  } catch {
    shortcutFeedback.textContent = "Chưa lưu được phím. Hãy mở lại popup.";
  } finally { shortcutControls.disabled = false; }
}
document.getElementById("captureShortcut").addEventListener("click", () => {
  capturingShortcut = true;
  shortcutFeedback.textContent = "Bấm phím muốn dùng… (Esc để hủy)";
});
document.getElementById("resetShortcut").addEventListener("click", () => {
  capturingShortcut = false;
  saveShortcut(null);
});
window.addEventListener("keydown", (event) => {
  if (!capturingShortcut) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (event.key === "Escape") {
    capturingShortcut = false;
    shortcutFeedback.textContent = "Đã hủy.";
    return;
  }
  const code = event.keyCode;
  if (event.repeat || event.isComposing || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey
      || !((code >= 48 && code <= 57) || (code >= 65 && code <= 90)
        || (code >= 112 && code <= 121 && code !== 116))) {
    shortcutFeedback.textContent = "Chọn một chữ, số hoặc F1–F10 (trừ F5), không kèm Ctrl/Alt/Shift.";
    return;
  }
  capturingShortcut = false;
  saveShortcut(code);
}, true);
let farmBusy = false;
let farmSaving = false;

async function refreshFarm() {
  if (farmBusy) return;
  farmBusy = true;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab.");
    const status = await chrome.tabs.sendMessage(tab.id, { type: "gst:farm-status" });
    const farmLabel = status.autoOn === true ? "BẬT" : status.autoOn === false ? "TẮT" : "CHƯA RÕ";
    autoFarmValue.textContent = status.autoOn === true ? "Đang bật" : status.autoOn === false ? "Đã tắt" : "Chưa rõ";
    autoFarmValue.dataset.state = status.autoOn === true ? "on" : status.autoOn === false ? "off" : "unknown";
    farmStatus.textContent = `Auto Farm của game: ${farmLabel}${status.dead ? " · Đã chết" : ""}. ${status.message}`;
  } catch {
    autoFarmValue.textContent = "Chưa rõ";
    autoFarmValue.dataset.state = "unknown";
    farmStatus.textContent = "Mở tab game; tải lại tab sau khi cập nhật extension để đọc Auto Farm.";
  } finally { farmBusy = false; }
}

async function saveFarm(event) {
  if (farmSaving) return;
  const disabling = event?.target === farmEnabled && !farmEnabled.checked ? "enabled"
    : event?.target === autoRespawn && !autoRespawn.checked ? "autoRespawn" : null;
  let farmPreferences;
  if (!disabling) {
    if (!farmEnabled.checked && !farmRadius.checkValidity()) farmRadius.value = "22";
    if (!farmRadius.reportValidity()) return;
    const radius = farmRadius.valueAsNumber;
    if (!Number.isFinite(radius) || radius < 11 || radius > 100) return;
    const targetMode = ["maxLevel", "minLevel", "boss"].includes(farmTargetMode.value) ? farmTargetMode.value : "all";
    const needsLevel = targetMode === "maxLevel" || targetMode === "minLevel";
    if (needsLevel && !farmTargetLevel.reportValidity()) return;
    const targetLevel = farmTargetLevel.valueAsNumber;
    if (needsLevel && (!Number.isSafeInteger(targetLevel) || targetLevel < 1)) return;
    farmPreferences = { enabled: farmEnabled.checked, radius, autoRespawn: autoRespawn.checked,
      targetMode, targetLevel: Number.isSafeInteger(targetLevel) && targetLevel > 0 ? targetLevel : 1 };
  }
  farmSaving = true;
  farmControls.disabled = true;
  try {
    if (disabling) {
      // An OFF action must not depend on unfinished radius/level drafts.
      const saved = await chrome.storage.local.get("farmPreferences");
      farmPreferences = { ...saved.farmPreferences, [disabling]: false };
    }
    await chrome.storage.local.set({ farmPreferences });
    farmFeedback.textContent = "";
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab.");
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:farm-configure", preferences: farmPreferences });
      if (!result?.accepted) throw new Error("Not accepted.");
    } catch {
      farmFeedback.textContent = "Đã lưu. Hãy tải lại tab game nếu chưa áp dụng được.";
    }
    await refreshFarm();
  } catch {
    if (disabling) event.target.checked = true;
    farmFeedback.textContent = "Chưa lưu được tùy chọn Auto Farm. Hãy mở lại popup.";
  } finally {
    farmSaving = false;
    farmControls.disabled = false;
  }
}
document.getElementById("saveFarm").addEventListener("click", saveFarm);
document.getElementById("saveFarmFilter").addEventListener("click", saveFarm);
farmTargetMode.addEventListener("change", () => {
  farmTargetLevel.disabled = !["maxLevel", "minLevel"].includes(farmTargetMode.value);
});
farmTargetLevel.addEventListener("keydown", (event) => { if (event.key === "Enter") saveFarm(); });
farmEnabled.addEventListener("change", saveFarm);
autoRespawn.addEventListener("change", saveFarm);
farmRadius.addEventListener("keydown", (event) => { if (event.key === "Enter") saveFarm(); });
for (const name of Object.keys(GSTFont.families)) {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  fontFamily.append(option);
}
let busy = false;
let saving = false;

async function refresh() {
  refreshFarm();
  globalThis.GSTHarvestPopup?.refresh();
  if (busy) return;
  busy = true;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab.");
    const status = await chrome.tabs.sendMessage(tab.id, { type: "gst:status" });
    document.getElementById("current").textContent = status.current ?? "—";
    document.getElementById("fix").textContent = status.fix ?? "—";
    document.getElementById("state").textContent = status.state === "flying" ? "Đang bay"
      : status.state === "walking" ? "Đi bộ" : "Chưa rõ";
    statusText.textContent = status.message;
  } catch {
    for (const id of ["current", "fix"]) document.getElementById(id).textContent = "—";
    document.getElementById("state").textContent = "Chưa rõ";
    statusText.textContent = "Mở nghichthienky.online để đọc trạng thái. Nếu đã mở, hãy tải lại tab sau khi cập nhật extension; game cũng có thể đang chuyển map.";
  } finally {
    busy = false;
  }
}

async function save() {
  if (saving) return;
  if (!speedInputs.every((input) => input.reportValidity())) return;
  const walkingSpeed = walkingInput.valueAsNumber;
  const flyingSpeed = flyingInput.valueAsNumber;
  if (![walkingSpeed, flyingSpeed].every((speed) => Number.isFinite(speed) && speed >= 1 && speed <= 6)) return;
  saving = true;
  controls.disabled = true;
  try {
    await chrome.storage.local.set({ preferences: { enabled: enabledInput.checked, walkingSpeed, flyingSpeed } });
    feedback.textContent = "";
    await refresh();
  } catch {
    feedback.textContent = "Chưa lưu được cài đặt tốc độ. Hãy mở lại popup và thử lại.";
  } finally {
    controls.disabled = false;
    saving = false;
  }
}

document.getElementById("save").addEventListener("click", save);
enabledInput.addEventListener("change", () => {
  // Disabling must work even when the speed input contains invalid draft text.
  if (!enabledInput.checked) {
    if (!walkingInput.checkValidity()) walkingInput.value = "3.5";
    if (!flyingInput.checkValidity()) flyingInput.value = "2";
  }
  save();
});
for (const input of speedInputs) {
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") save();
  });
}

displayControls.addEventListener("change", async () => {
  displayControls.disabled = true;
  const displayPreferences = {
    visible: showOverlay.checked,
    fields: Object.fromEntries(displayFields.map((input) => [input.dataset.displayField, input.checked]))
  };
  try {
    await chrome.storage.local.set({ displayPreferences });
    feedback.textContent = "";
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab.");
      const result = await chrome.tabs.sendMessage(tab.id, {
        type: "gst:display", preferences: displayPreferences
      });
      const shouldHide = !displayPreferences.visible || !Object.values(displayPreferences.fields).some(Boolean);
      if (!result?.applied || (shouldHide && result.visible)) throw new Error("Display update not confirmed.");
    } catch {
      feedback.textContent = "Đã lưu lựa chọn hiển thị. Tải lại tab game nếu bảng chưa thay đổi sau khi cập nhật extension.";
    }
  } catch {
    feedback.textContent = "Chưa lưu được lựa chọn hiển thị. Hãy mở lại popup và thử lại.";
  } finally {
    displayControls.disabled = false;
  }
});

fontControls.addEventListener("change", async () => {
  fontControls.disabled = true;
  const fontPreferences = GSTFont.normalize({ enabled: fontEnabled.checked, font: fontFamily.value });
  try {
    await chrome.storage.local.set({ fontPreferences });
    fontFeedback.textContent = "";
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) throw new Error("No active tab.");
      const result = await chrome.tabs.sendMessage(tab.id, { type: "gst:font", preferences: fontPreferences });
      if (!result?.accepted) throw new Error("Font request not confirmed.");
    } catch {
      fontFeedback.textContent = "Đã lưu. Nếu font chưa đổi, hãy tải lại trang game sau khi cập nhật extension.";
    }
  } catch {
    fontFeedback.textContent = "Chưa lưu được font. Hãy mở lại popup và thử lại.";
  } finally {
    fontFamily.disabled = !fontEnabled.checked;
    fontControls.disabled = false;
  }
});

chrome.storage.local.get(["preferences", "displayPreferences", "fontPreferences", "farmPreferences", "farmShortcut"]).then(({ preferences, displayPreferences, fontPreferences, farmPreferences, farmShortcut }) => {
  enabledInput.checked = preferences?.enabled === true;
  for (const [input, fallback] of [[walkingInput, 3.5], [flyingInput, 2]]) {
    const speed = preferences?.[input.id];
    input.value = typeof speed === "number" && Number.isFinite(speed)
      ? Math.min(6, Math.max(1, speed)) : fallback;
  }
  controls.disabled = false;
  showOverlay.checked = displayPreferences?.visible !== false;
  for (const input of displayFields) {
    const key = input.dataset.displayField;
    input.checked = key === "harvest" ? displayPreferences?.fields?.[key] === true : displayPreferences?.fields?.[key] !== false;
  }
  displayControls.disabled = false;
  const font = GSTFont.normalize(fontPreferences);
  fontEnabled.checked = font.enabled;
  fontFamily.value = font.font;
  fontFamily.disabled = !font.enabled;
  fontControls.disabled = false;
  farmEnabled.checked = farmPreferences?.enabled === true;
  autoRespawn.checked = farmPreferences?.autoRespawn === true;
  farmTargetMode.value = farmPreferences?.targetMode === "level" ? "maxLevel"
    : ["maxLevel", "minLevel", "boss"].includes(farmPreferences?.targetMode) ? farmPreferences.targetMode : "all";
  farmTargetLevel.value = Number.isSafeInteger(farmPreferences?.targetLevel) && farmPreferences.targetLevel > 0
    ? farmPreferences.targetLevel : 1;
  farmTargetLevel.disabled = !["maxLevel", "minLevel"].includes(farmTargetMode.value);
  farmRadius.value = typeof farmPreferences?.radius === "number" && Number.isFinite(farmPreferences.radius)
    ? Math.max(11, Math.min(100, farmPreferences.radius)) : 22;
  farmControls.disabled = false;
  const shortcutCode = farmShortcut?.code;
  if (Number.isInteger(shortcutCode) && ((shortcutCode >= 48 && shortcutCode <= 57)
      || (shortcutCode >= 65 && shortcutCode <= 90) || (shortcutCode >= 112 && shortcutCode <= 121 && shortcutCode !== 116))) {
    shortcutLabel.textContent = `Phím tùy chỉnh: ${shortcutCode >= 112 ? `F${shortcutCode - 111}` : String.fromCharCode(shortcutCode)}`;
  }
  shortcutControls.disabled = false;
  refresh();
}).catch(() => {
  statusText.textContent = "Chưa đọc được cài đặt. Hãy mở lại popup.";
});
const refreshTimer = setInterval(refresh, 1000);
window.addEventListener("pagehide", () => clearInterval(refreshTimer), { once: true });
