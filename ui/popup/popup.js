"use strict";
// Embedded extension menus run in a cross-origin iframe, where clipboard-write
// can be denied by the parent document's Permissions Policy.
globalThis.GSTClipboard = {
  async write(text) {
    if (window.top !== window || typeof navigator.clipboard?.writeText !== "function") return false;
    try {
      const policy = document.permissionsPolicy ?? document.featurePolicy;
      if (policy?.allowsFeature?.("clipboard-write") === false) return false;
      await navigator.clipboard.writeText(text);
      return true;
    } catch { return false; }
  }
};
const controls = document.getElementById("controls");
const enabledInput = document.getElementById("enabled");
const walkingInput = document.getElementById("walkingSpeed");
const flyingInput = document.getElementById("flyingSpeed");
const farmWalkingInput = document.getElementById("farmWalkingSpeed");
const farmFlyingInput = document.getElementById("farmFlyingSpeed");
const speedInputs = [walkingInput, flyingInput, farmWalkingInput, farmFlyingInput];
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
const farmRightControls = document.getElementById("farmRightControls");
const farmNoRetreat = document.getElementById("farmNoRetreat");
const farmReturnDeath = document.getElementById("farmReturnDeath");
const breakSeals = document.getElementById("breakSeals");
const farmSearchScope = document.getElementById("farmSearchScope");
const farmShowTargetLine = document.getElementById("farmShowTargetLine");
const farmRadius = document.getElementById("farmRadius");
const farmTargetMode = document.getElementById("farmTargetMode");
const farmBossDodge = document.getElementById("farmBossDodge");
const farmBossRetreat = document.getElementById("farmBossRetreat");
const farmExcludeBoss = document.getElementById("farmExcludeBoss");
const farmTargetLevel = document.getElementById("farmTargetLevel");
const farmTargetMinLevel = document.getElementById("farmTargetMinLevel");
const farmTargetMaxLevel = document.getElementById("farmTargetMaxLevel");
const farmIdleMode = document.getElementById("farmIdleMode");
const farmPreferLoot = document.getElementById("farmPreferLoot");
const farmAvoidEnabled = document.getElementById("farmAvoidEnabled");
const farmAvoidLevel = document.getElementById("farmAvoidLevel");
const farmAvoidDistance = document.getElementById("farmAvoidDistance");
const positiveLevel = (value, fallback) => Number.isSafeInteger(value) && value > 0 ? value : fallback;
const farmCompatibility = globalThis.GSTFarmCompatibility;
function fillFarmThreshold(select, kind, current) {
  const options = farmCompatibility.options(kind, current);
  select.replaceChildren(...options.map(({ value, label }) => {
    const option = document.createElement("option");
    option.value = String(value);
    option.textContent = label;
    return option;
  }));
  select.value = String(current);
}
function syncFarmLevelInputs() {
  const range = farmTargetMode.value === "range";
  document.getElementById("farmSingleLevel").hidden = !["maxLevel", "minLevel"].includes(farmTargetMode.value);
  document.getElementById("farmLevelRange").hidden = !range;
  farmTargetLevel.disabled = !["maxLevel", "minLevel"].includes(farmTargetMode.value);
  farmTargetMinLevel.disabled = farmTargetMaxLevel.disabled = !range;
  fillFarmThreshold(farmTargetLevel, farmTargetMode.value === "minLevel" ? "min" : "max",
    Number(farmTargetLevel.value) || 1);
}
fillFarmThreshold(farmAvoidLevel, "min", 10);
const farmStatus = document.getElementById("farmStatus");
const autoFarmValue = document.getElementById("autoFarmValue");
const farmFeedback = document.getElementById("farmFeedback");
const shortcutControls = document.getElementById("shortcutControls");
const shortcutLabel = document.getElementById("shortcutLabel");
const shortcutFeedback = document.getElementById("shortcutFeedback");
let capturingShortcut = false;

async function saveShortcut(code) {
  shortcutControls.disabled = true;
  const label = code === null ? "V (mặc định)"
    : `Phím tùy chỉnh: ${code >= 112 ? `F${code - 111}` : String.fromCharCode(code)}`;
  try {
    await chrome.storage.local.set({ farmShortcut: { code } });
    shortcutLabel.textContent = label;
    document.getElementById("farmShortcutSummary").textContent = `Phím tắt · ${label}`;
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
let farmSaveQueue = Promise.resolve();
function updateFarmPreferences(patch) {
  const save = farmSaveQueue.catch(() => {}).then(() => navigator.locks.request("gst:farm-preferences", async () => {
    const saved = await chrome.storage.local.get("farmPreferences");
    const farmPreferences = { ...saved.farmPreferences, ...patch };
    await chrome.storage.local.set({ farmPreferences });
    return farmPreferences;
  }));
  farmSaveQueue = save;
  return save;
}

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

let farmConfirmed = {};
let farmDraftError = false;
function farmHasDraft() {
  return farmDraftError || Number(farmTargetMinLevel.value) !== farmConfirmed.targetMinLevel
    || Number(farmTargetMaxLevel.value) !== farmConfirmed.targetMaxLevel
    || [farmRadius, farmAvoidDistance].some((input) => input.value !== String(farmConfirmed[input === farmRadius ? "radius" : "avoidDistance"]));
}
function farmMessage(message) {
  farmFeedback.textContent = message + (farmDraftError ? " · Khoảng tu vi không hợp lệ, chưa lưu." : farmHasDraft() ? " · Có bản nháp chưa lưu." : "");
}
function syncFarmScope() {
  farmRadius.closest(".input-action").hidden = farmSearchScope.value !== "radius";
  document.getElementById("farmAvoidFields").hidden = !farmAvoidEnabled.checked;
}
function farmSummaries() {
  document.getElementById("farmBossSummary").textContent = `Boss · ${farmConfirmed.excludeBoss ? "không chọn boss" : "cho phép boss"}`;
  document.getElementById("farmAvoidSummary").textContent = `Né quái mạnh · ${farmConfirmed.avoidEnabled ? "bật" : "tắt"}`;
  document.getElementById("farmRecoverySummary").textContent = `Hồi phục · ${farmConfirmed.noRetreat ? "không rút lui" : "theo game"}`;
}
async function saveFarmPatch(patch, rollback) {
  farmMessage("Đang lưu…");
  try {
    await updateFarmPreferences(patch);
    Object.assign(farmConfirmed, patch);
    farmSummaries();
    farmMessage("Đã lưu lựa chọn.");
  } catch {
    rollback?.();
    farmMessage("Chưa lưu được lựa chọn; cài đặt cũ được giữ.");
  }
}
for (const [input, key] of [[farmShowTargetLine, "showTargetLine"], [farmNoRetreat, "noRetreat"],
  [breakSeals, "breakSeals"], [farmPreferLoot, "preferLoot"], [farmBossDodge, "bossDodge"],
  [farmBossRetreat, "bossRetreat"], [farmAvoidEnabled, "avoidEnabled"]]) {
  input.addEventListener("change", async () => {
    const next = input.checked;
    input.disabled = true;
    syncFarmScope();
    await saveFarmPatch({ [key]: next }, () => { input.checked = farmConfirmed[key]; syncFarmScope(); });
    input.disabled = false;
  });
}
farmExcludeBoss.addEventListener("change", async () => {
  const next = farmExcludeBoss.checked;
  const patch = { excludeBoss: next };
  if (next && ["boss", "bossLevel"].includes(farmConfirmed.targetMode)) patch.targetMode = "highLevel";
  farmExcludeBoss.disabled = farmTargetMode.disabled = true;
  if (patch.targetMode) { farmTargetMode.value = patch.targetMode; syncFarmLevelInputs(); }
  await saveFarmPatch(patch, () => { farmExcludeBoss.checked = farmConfirmed.excludeBoss; farmTargetMode.value = farmConfirmed.targetMode; syncFarmLevelInputs(); });
  farmExcludeBoss.disabled = farmTargetMode.disabled = false;
});
farmTargetMode.addEventListener("change", async () => {
  const mode = farmTargetMode.value;
  const patch = { targetMode: mode };
  if (["boss", "bossLevel"].includes(mode)) patch.excludeBoss = false;
  farmTargetMode.disabled = farmExcludeBoss.disabled = true;
  if (patch.excludeBoss === false) farmExcludeBoss.checked = false;
  syncFarmLevelInputs();
  await saveFarmPatch(patch, () => { farmTargetMode.value = farmConfirmed.targetMode; farmExcludeBoss.checked = farmConfirmed.excludeBoss; syncFarmLevelInputs(); });
  farmTargetMode.disabled = farmExcludeBoss.disabled = false;
});
for (const [input, key] of [[farmSearchScope, "searchScope"], [farmIdleMode, "idleMode"],
  [farmTargetLevel, "targetLevel"], [farmAvoidLevel, "avoidLevel"]]) {
  input.addEventListener("change", async () => {
    const value = input.tagName === "SELECT" && [farmTargetLevel, farmAvoidLevel].includes(input) ? Number(input.value) : input.value;
    const patch = key === "searchScope" ? { enabled: true, searchScope: value, ...(farmConfirmed.enabled ? {} : { radius: 11 }) } : { [key]: value };
    input.disabled = true;
    syncFarmScope();
    await saveFarmPatch(patch, () => { input.value = String(farmConfirmed[key]); syncFarmScope(); });
    input.disabled = false;
  });
}
for (const input of [farmTargetMinLevel, farmTargetMaxLevel]) {
  input.addEventListener("change", async () => {
    const min = Number(farmTargetMinLevel.value), max = Number(farmTargetMaxLevel.value);
    if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || min < 1 || max < 1 || min > max) {
      farmDraftError = true;
      farmFeedback.textContent = "Khoảng tu vi không hợp lệ; mức kết thúc phải từ mức bắt đầu trở lên.";
      return;
    }
    farmTargetMinLevel.disabled = farmTargetMaxLevel.disabled = true;
    farmDraftError = false;
    await saveFarmPatch({ targetMinLevel: min, targetMaxLevel: max });
    farmTargetMinLevel.disabled = farmTargetMaxLevel.disabled = false;
  });
}
for (const [input, key, valid] of [[farmRadius, "radius", (n) => Number.isSafeInteger(n) && n >= 1 && n <= 1000],
  [farmAvoidDistance, "avoidDistance", (n) => Number.isFinite(n) && n >= 1 && n <= 6 && Number.isInteger(n * 2)]]) {
  input.addEventListener("input", () => farmMessage("Bản nháp chưa lưu; nhấn Enter để xác nhận."));
  input.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const value = input.valueAsNumber;
    if (!input.checkValidity() || !valid(value)) { farmFeedback.textContent = "Giá trị không hợp lệ; cài đặt cũ được giữ."; return; }
    input.disabled = true;
    await saveFarmPatch(key === "radius" ? { enabled: true, radius: value } : { [key]: value }, () => { input.value = String(farmConfirmed[key]); });
    input.disabled = false;
  });
}
farmReturnDeath.addEventListener("change", async () => {
  const next = farmReturnDeath.checked;
  farmReturnDeath.disabled = true;
  try {
    // Keep the existing saved returnDeath flag: no migration or loss of
    // preferences when moving the checkbox out of the map UI.
    const saved = await chrome.storage.local.get("areaMapOptions");
    await chrome.storage.local.set({
      areaMapOptions: { ...saved.areaMapOptions, returnDeath: next }
    });
    farmMessage("Đã lưu lựa chọn.");
  } catch {
    farmReturnDeath.checked = !next;
    farmFeedback.textContent = "Chưa lưu được tùy chọn quay lại điểm chết. Hãy thử lại.";
  } finally { farmReturnDeath.disabled = false; }
});
for (const name of Object.keys(GSTFont.families)) {
  const option = document.createElement("option");
  option.value = name;
  option.textContent = name;
  fontFamily.append(option);
}
let busy = false;
let saving = false;

async function refresh() {
  globalThis.GSTMenuMonitor?.render();
  refreshFarm();
  globalThis.GSTHarvestPopup?.refresh();
  globalThis.GSTRealmPopup?.refresh();
  globalThis.GSTFpsPopup?.refresh();
  globalThis.GSTChestPopup?.refresh();
  globalThis.GSTQuestPopup?.refresh();
  globalThis.GSTFlightPopup?.refresh();
  document.getElementById("speedSettings").hidden = !enabledInput.checked;
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
  if (!speedInputs.map((input) => input.valueAsNumber).every((speed) => Number.isFinite(speed) && speed >= 1 && speed <= 6)) return;
  saving = true;
  controls.disabled = true;
  try {
    await chrome.storage.local.set({ preferences: { enabled: enabledInput.checked, walkingSpeed, flyingSpeed,
      farmWalkingSpeed: farmWalkingInput.valueAsNumber, farmFlyingSpeed: farmFlyingInput.valueAsNumber } });
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
  document.getElementById("speedSettings").hidden = !enabledInput.checked;
  // Disabling must work even when the speed input contains invalid draft text.
  if (!enabledInput.checked) {
    if (!walkingInput.checkValidity()) walkingInput.value = "3.5";
    if (!flyingInput.checkValidity()) flyingInput.value = "2";
    if (!farmWalkingInput.checkValidity()) farmWalkingInput.value = "2";
    if (!farmFlyingInput.checkValidity()) farmFlyingInput.value = "1.5";
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

chrome.storage.local.get(["preferences", "displayPreferences", "fontPreferences", "farmPreferences", "farmShortcut", "areaMapOptions"]).then(({ preferences, displayPreferences, fontPreferences, farmPreferences, farmShortcut, areaMapOptions }) => {
  enabledInput.checked = preferences?.enabled === true;
  document.getElementById("speedSettings").hidden = !enabledInput.checked;
  for (const [input, fallback] of [[walkingInput, 3.5], [flyingInput, 2], [farmWalkingInput, 2], [farmFlyingInput, 1.5]]) {
    const speed = preferences?.[input.id];
    input.value = typeof speed === "number" && Number.isFinite(speed)
      ? Math.min(6, Math.max(1, speed)) : fallback;
  }
  controls.disabled = false;
  showOverlay.checked = displayPreferences?.visible !== false;
  for (const input of displayFields) {
    const key = input.dataset.displayField;
    input.checked = ["harvest", "fps", "realm"].includes(key) ? displayPreferences?.fields?.[key] === true : displayPreferences?.fields?.[key] !== false;
  }
  displayControls.disabled = false;
  const font = GSTFont.normalize(fontPreferences);
  fontEnabled.checked = font.enabled;
  fontFamily.value = font.font;
  fontFamily.disabled = !font.enabled;
  fontControls.disabled = false;
  farmSearchScope.value = farmPreferences?.enabled === true && farmPreferences?.searchScope === "map" ? "map" : "radius";
  farmNoRetreat.checked = farmPreferences?.noRetreat !== false;
  farmReturnDeath.checked = areaMapOptions?.returnDeath === true;
  farmBossDodge.checked = farmPreferences?.bossDodge !== false;
  farmBossRetreat.checked = farmPreferences?.bossRetreat !== false;
  syncFarmScope();
  farmShowTargetLine.checked = farmPreferences?.showTargetLine === true;
  breakSeals.checked = farmPreferences?.breakSeals === true;
  breakSeals.disabled = false;
  farmIdleMode.value = ["home", "seek"].includes(farmPreferences?.idleMode) ? farmPreferences.idleMode : "hold";
  farmPreferLoot.checked = farmPreferences?.preferLoot !== false;
  farmAvoidEnabled.checked = farmPreferences?.avoidEnabled === true;
  farmExcludeBoss.checked = farmPreferences?.excludeBoss === true;
  fillFarmThreshold(farmAvoidLevel, "min", positiveLevel(farmPreferences?.avoidLevel, 10));
  farmAvoidDistance.value = Number.isFinite(farmPreferences?.avoidDistance)
    ? Math.max(1, Math.min(6, farmPreferences.avoidDistance)) : 2;
  farmTargetMode.value = farmPreferences?.targetMode === "level" ? "maxLevel"
    : farmPreferences?.targetMode === "bossFirst" ? "bossLevel"
    : ["maxLevel", "minLevel", "range", "boss", "bossLevel", "highLevel", "lowLevel"].includes(farmPreferences?.targetMode) ? farmPreferences.targetMode : "all";
  if (farmExcludeBoss.checked && ["boss", "bossLevel"].includes(farmTargetMode.value)) {
    farmTargetMode.value = "highLevel";
    updateFarmPreferences({ targetMode: "highLevel" }).catch(() => {
      farmFeedback.textContent = "Chưa đồng bộ được bộ lọc boss; hãy lưu lại.";
    });
  } else if (farmPreferences?.targetMode === "bossFirst") {
    updateFarmPreferences({ targetMode: "bossLevel" }).catch(() => {
      farmFeedback.textContent = "Chưa lưu được bộ lọc cũ; hãy bấm Lưu lựa chọn quái.";
    });
  }
  const targetLevel = positiveLevel(farmPreferences?.targetLevel, 1);
  const targetMinLevel = positiveLevel(farmPreferences?.targetMinLevel, 1);
  const targetMaxLevel = positiveLevel(farmPreferences?.targetMaxLevel, 20);
  fillFarmThreshold(farmTargetLevel, farmTargetMode.value === "minLevel" ? "min" : "max", targetLevel);
  fillFarmThreshold(farmTargetMinLevel, "min", targetMinLevel);
  fillFarmThreshold(farmTargetMaxLevel, "max", targetMaxLevel);
  syncFarmLevelInputs();
  farmRadius.value = typeof farmPreferences?.radius === "number" && Number.isFinite(farmPreferences.radius)
    ? Math.max(1, Math.min(1000, farmPreferences.radius)) : 22;
  if (farmPreferences?.enabled !== true) farmRadius.value = "11";
  farmConfirmed = {
    enabled: farmPreferences?.enabled === true, radius: Number(farmRadius.value), searchScope: farmSearchScope.value,
    targetMode: farmTargetMode.value, targetLevel, targetMinLevel, targetMaxLevel,
    avoidLevel: Number(farmAvoidLevel.value), avoidDistance: Number(farmAvoidDistance.value),
    avoidEnabled: farmAvoidEnabled.checked, excludeBoss: farmExcludeBoss.checked,
    noRetreat: farmNoRetreat.checked, showTargetLine: farmShowTargetLine.checked,
    breakSeals: breakSeals.checked, idleMode: farmIdleMode.value, preferLoot: farmPreferLoot.checked,
    bossDodge: farmBossDodge.checked, bossRetreat: farmBossRetreat.checked
  };
  syncFarmScope();
  farmSummaries();
  farmControls.disabled = false;
  farmRightControls.disabled = false;
  const shortcutCode = farmShortcut?.code;
  if (Number.isInteger(shortcutCode) && ((shortcutCode >= 48 && shortcutCode <= 57)
      || (shortcutCode >= 65 && shortcutCode <= 90) || (shortcutCode >= 112 && shortcutCode <= 121 && shortcutCode !== 116))) {
    shortcutLabel.textContent = `Phím tùy chỉnh: ${shortcutCode >= 112 ? `F${shortcutCode - 111}` : String.fromCharCode(shortcutCode)}`;
  }
  document.getElementById("farmShortcutSummary").textContent = `Phím tắt · ${shortcutLabel.textContent}`;
  shortcutControls.disabled = false;
  refresh();
}).catch(() => {
  statusText.textContent = "Chưa đọc được cài đặt. Hãy mở lại popup.";
});
const refreshTimer = setInterval(refresh, 1000);
window.addEventListener("pagehide", () => clearInterval(refreshTimer), { once: true });

// Restore through the existing OFF path, without forcing estimated native speeds.
document.getElementById("resetGameSpeed").addEventListener("click", async () => {
  if (saving) return;
  saving = true; controls.disabled = true;
  try {
    const saved = await chrome.storage.local.get("preferences");
    await chrome.storage.local.set({ preferences: { ...saved.preferences, enabled: false } });
    enabledInput.checked = false;
    feedback.textContent = "Đã tắt điều chỉnh tốc độ để dùng tốc độ gốc của game.";
    await refresh();
  } catch { feedback.textContent = "Chưa khôi phục được tốc độ. Thử lại."; }
  finally { saving = false; controls.disabled = false; }
});
