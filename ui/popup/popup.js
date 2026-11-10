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
const farmRadiusError = document.getElementById("farmRadiusError");
const farmTargetMinLevelError = document.getElementById("farmTargetMinLevelError");
const farmTargetMaxLevelError = document.getElementById("farmTargetMaxLevelError");
const farmIdleMode = document.getElementById("farmIdleMode");
const farmPreferLoot = document.getElementById("farmPreferLoot");
const farmSelfDefense = document.getElementById("farmSelfDefense");
const farmAutoMeditate = document.getElementById("farmAutoMeditate");
const farmAutoRespawn = document.getElementById("farmAutoRespawn");
const farmAutoEncounter = document.getElementById("farmAutoEncounter");
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
let farmPendingSaves = 0;
function updateFarmPreferences(patch) {
  farmPendingSaves++;
  const save = farmSaveQueue.catch(() => {}).then(() => navigator.locks.request("gst:farm-preferences", async () => {
    const saved = await chrome.storage.local.get("farmPreferences");
    const current = saved.farmPreferences ?? {};
    const farmPreferences = { ...current, ...patch };
    if (["boss", "bossLevel"].includes(normalizeFarmTargetMode(patch.targetMode))) farmPreferences.excludeBoss = false;
    else if (patch.excludeBoss === true && ["boss", "bossLevel"].includes(normalizeFarmTargetMode(current.targetMode)))
      farmPreferences.targetMode = "highLevel";
    else if (Object.keys(patch).length === 0) {
      if (current.excludeBoss === true && ["boss", "bossLevel"].includes(normalizeFarmTargetMode(current.targetMode)))
        farmPreferences.targetMode = "highLevel";
      else if (current.targetMode === "bossFirst") farmPreferences.targetMode = "bossLevel";
      else if (current.targetMode === "level") farmPreferences.targetMode = "maxLevel";
    }
    await chrome.storage.local.set({ farmPreferences });
    return farmPreferences;
  }));
  farmSaveQueue = save;
  void save.then(() => { farmPendingSaves--; }, () => { farmPendingSaves--; });
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
    document.getElementById("farmEncounterStatus").textContent = status.encounterStatus || "";
  } catch {
    autoFarmValue.textContent = "Chưa rõ";
    autoFarmValue.dataset.state = "unknown";
    farmStatus.textContent = "Mở tab game; tải lại tab sau khi cập nhật extension để đọc Auto Farm.";
    document.getElementById("farmEncounterStatus").textContent = "";
  } finally { farmBusy = false; }
}

let farmConfirmed = {};
let farmDraftError = false;
let farmSyncReady = false;
let farmStorageRevision = 0;
let latestFarmPreferences;
function normalizeFarmTargetMode(mode) {
  return mode === "level" ? "maxLevel" : mode === "bossFirst" ? "bossLevel"
    : ["maxLevel", "minLevel", "range", "boss", "bossLevel", "highLevel", "lowLevel"].includes(mode) ? mode : "all";
}
function normalizedFarmPreferences(raw = {}) {
  const mode = normalizeFarmTargetMode(raw.targetMode);
  const radius = Number.isSafeInteger(raw.radius)
    ? Math.max(1, Math.min(1000, raw.radius)) : 22;
  return {
    enabled: raw.enabled === true, radius: raw.enabled === true ? radius : 11,
    searchScope: raw.enabled === true && raw.searchScope === "map" ? "map" : "radius",
    targetMode: mode, targetLevel: positiveLevel(raw.targetLevel, 1),
    targetMinLevel: positiveLevel(raw.targetMinLevel, 1), targetMaxLevel: positiveLevel(raw.targetMaxLevel, 20),
    excludeBoss: raw.excludeBoss === true, noRetreat: raw.noRetreat !== false,
    showTargetLine: raw.showTargetLine === true, breakSeals: raw.breakSeals === true,
    idleMode: ["home", "seek"].includes(raw.idleMode) ? raw.idleMode : "hold",
    preferLoot: raw.preferLoot !== false, selfDefense: raw.selfDefense === true,
    autoMeditate: raw.autoMeditate !== false, autoRespawn: raw.autoRespawn !== false,
    autoEncounter: raw.autoEncounter === true, bossDodge: raw.bossDodge !== false,
    bossRetreat: raw.bossRetreat !== false
  };
}
function syncFarmPreferences(raw, { preserveDraft = true, forceKeys = [] } = {}) {
  const keepDraft = preserveDraft && farmHasDraft();
  const next = normalizedFarmPreferences(raw);
  farmConfirmed = next;
  farmSearchScope.value = next.searchScope;
  farmNoRetreat.checked = next.noRetreat;
  farmBossDodge.checked = next.bossDodge;
  farmBossRetreat.checked = next.bossRetreat;
  farmShowTargetLine.checked = next.showTargetLine;
  breakSeals.checked = next.breakSeals;
  farmIdleMode.value = next.idleMode;
  farmPreferLoot.checked = next.preferLoot;
  farmSelfDefense.checked = next.selfDefense;
  farmAutoMeditate.checked = next.autoMeditate;
  farmAutoRespawn.checked = next.autoRespawn;
  farmAutoEncounter.checked = next.autoEncounter;
  farmExcludeBoss.checked = next.excludeBoss;
  farmTargetMode.value = next.targetMode;
  farmTargetLevel.value = String(next.targetLevel);
  const minValue = keepDraft && !forceKeys.includes("targetMinLevel") ? Number(farmTargetMinLevel.value) : next.targetMinLevel;
  const maxValue = keepDraft && !forceKeys.includes("targetMaxLevel") ? Number(farmTargetMaxLevel.value) : next.targetMaxLevel;
  fillFarmThreshold(farmTargetMinLevel, "min", Number.isSafeInteger(minValue) ? minValue : next.targetMinLevel);
  fillFarmThreshold(farmTargetMaxLevel, "max", Number.isSafeInteger(maxValue) ? maxValue : next.targetMaxLevel);
  if (keepDraft && !forceKeys.includes("targetMinLevel") && !Number.isSafeInteger(minValue)) farmTargetMinLevel.value = "";
  if (keepDraft && !forceKeys.includes("targetMaxLevel") && !Number.isSafeInteger(maxValue)) farmTargetMaxLevel.value = "";
  if (!keepDraft || forceKeys.includes("radius")) farmRadius.value = String(next.radius);
  if (forceKeys.includes("targetMinLevel") && forceKeys.includes("targetMaxLevel")) farmDraftError = false;
  syncFarmScope(); syncFarmLevelInputs(); farmSummaries();
  farmFeedback.textContent = farmHasDraft() ? "Có bản nháp chưa lưu." : "Đã đồng bộ cài đặt.";
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !changes.farmPreferences) return;
  farmStorageRevision++;
  latestFarmPreferences = changes.farmPreferences.newValue ?? {};
  if (farmSyncReady) syncFarmPreferences(latestFarmPreferences);
});
function farmHasDraft() {
  return farmDraftError || Number(farmTargetMinLevel.value) !== farmConfirmed.targetMinLevel
    || Number(farmTargetMaxLevel.value) !== farmConfirmed.targetMaxLevel
    || farmRadius.value !== String(farmConfirmed.radius);
}
function farmMessage(message) {
  farmFeedback.textContent = message + (farmDraftError ? " & Khoảng tu vi không hợp lệ, chưa lưu." : farmHasDraft() ? " & Có bản nháp chưa lưu." : "");
}
function syncFarmScope() {
  farmRadius.closest(".input-action").hidden = farmSearchScope.value !== "radius";
}
function farmSummaries() {
  document.getElementById("farmEncounterSummary").textContent = `Auto nhận kỳ ngộ · ${farmConfirmed.autoEncounter ? "bật" : "tắt"}`;
  document.getElementById("farmDefenseSummary").textContent = `Tự vệ ${farmConfirmed.selfDefense ? "bật" : "tắt"} · Thiền ${farmConfirmed.autoMeditate ? "bật" : "tắt"} · Hồi sinh ${farmConfirmed.autoRespawn ? "bật" : "tắt"}`;
  document.getElementById("farmBossSummary").textContent = `Boss · ${farmConfirmed.excludeBoss ? "không chọn boss" : "cho phép boss"}`;
  document.getElementById("farmRecoverySummary").textContent = `Hồi phục · ${farmConfirmed.noRetreat ? "không rút lui" : "theo game"}`;
}
async function saveFarmPatch(patch, rollback) {
  farmMessage("Đang lưu…");
  try {
    const written = await updateFarmPreferences(patch);
    let committed = written;
    try { committed = (await chrome.storage.local.get("farmPreferences")).farmPreferences ?? written; } catch {}
    latestFarmPreferences = committed;
    syncFarmPreferences(committed, { forceKeys: [...Object.keys(patch), "targetMode", "excludeBoss"] });
    farmMessage("Đã lưu cài đặt.");
    return true;
  } catch {
    rollback?.();
    farmMessage("Chưa lưu được lựa chọn; cài đặt cũ được giữ.");
    return false;
  }
}
for (const [input, key] of [[farmShowTargetLine, "showTargetLine"], [farmNoRetreat, "noRetreat"],
  [breakSeals, "breakSeals"], [farmPreferLoot, "preferLoot"], [farmSelfDefense, "selfDefense"],
  [farmAutoMeditate, "autoMeditate"], [farmAutoRespawn, "autoRespawn"], [farmAutoEncounter, "autoEncounter"], [farmBossDodge, "bossDodge"],
  [farmBossRetreat, "bossRetreat"]]) {
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
  [farmTargetLevel, "targetLevel"]]) {
  input.addEventListener("change", async () => {
    const value = input === farmTargetLevel ? Number(input.value) : input.value;
    const patch = key === "searchScope" ? { enabled: true, searchScope: value, ...(farmConfirmed.enabled ? {} : { radius: 11 }) } : { [key]: value };
    input.disabled = true;
    syncFarmScope();
    await saveFarmPatch(patch, () => { input.value = String(farmConfirmed[key]); syncFarmScope(); });
    input.disabled = false;
  });
}
let farmRangeCommit = null, farmRadiusCommit = null;
function clearFarmRangeErrors() {
  farmTargetMinLevelError.textContent = "";
  farmTargetMaxLevelError.textContent = "";
}
function commitFarmRange() {
  if (farmRangeCommit) return farmRangeCommit;
  const min = Number(farmTargetMinLevel.value), max = Number(farmTargetMaxLevel.value);
  clearFarmRangeErrors();
  if (!Number.isSafeInteger(min) || min < 1) {
    farmDraftError = true;
    farmTargetMinLevelError.textContent = "Chọn cảnh giới/tầng tối thiểu hợp lệ.";
    farmFeedback.textContent = farmTargetMinLevelError.textContent;
    return Promise.resolve(false);
  }
  if (!Number.isSafeInteger(max) || max < 1) {
    farmDraftError = true;
    farmTargetMaxLevelError.textContent = "Chọn cảnh giới/tầng tối đa hợp lệ.";
    farmFeedback.textContent = farmTargetMaxLevelError.textContent;
    return Promise.resolve(false);
  }
  if (min > max) {
    farmDraftError = true;
    farmTargetMaxLevelError.textContent = "Tu vi tối đa phải lớn hơn hoặc bằng tối thiểu.";
    farmFeedback.textContent = farmTargetMaxLevelError.textContent;
    return Promise.resolve(false);
  }
  farmDraftError = false;
  if (min === farmConfirmed.targetMinLevel && max === farmConfirmed.targetMaxLevel) {
    farmFeedback.textContent = farmHasDraft() ? "Có bản nháp chưa lưu." : "";
    return Promise.resolve(true);
  }
  const save = (async () => {
    farmTargetMinLevel.disabled = farmTargetMaxLevel.disabled = true;
    const saved = await saveFarmPatch({ targetMinLevel: min, targetMaxLevel: max });
    farmTargetMinLevel.disabled = farmTargetMaxLevel.disabled = false;
    if (!saved) {
      farmTargetMaxLevelError.textContent = "Chưa lưu được khoảng tu vi.";
      farmFeedback.textContent = "Lỗi lưu cài đặt; khoảng tu vi đã lưu trước đó được giữ.";
    }
    return saved;
  })();
  farmRangeCommit = save;
  save.finally(() => { if (farmRangeCommit === save) farmRangeCommit = null; });
  return save;
}
for (const input of [farmTargetMinLevel, farmTargetMaxLevel]) {
  input.addEventListener("change", () => { void commitFarmRange(); });
  input.addEventListener("blur", () => { void commitFarmRange(); });
}
function commitFarmRadius() {
  if (farmRadiusCommit) return farmRadiusCommit;
  farmRadiusError.textContent = "";
  const value = farmRadius.valueAsNumber;
  if (!farmRadius.value.trim() || !farmRadius.checkValidity() || !Number.isSafeInteger(value) || value < 1 || value > 1000) {
    farmRadiusError.textContent = "Giới hạn vùng farm phải là số nguyên từ 1 đến 1.000 ô.";
    farmFeedback.textContent = farmRadiusError.textContent;
    return Promise.resolve(false);
  }
  if (value === farmConfirmed.radius && farmConfirmed.enabled) {
    farmRadius.value = String(farmConfirmed.radius);
    farmFeedback.textContent = farmHasDraft() ? "Có bản nháp chưa lưu." : "";
    return Promise.resolve(true);
  }
  const save = (async () => {
    farmRadius.disabled = true;
    const saved = await saveFarmPatch({ enabled: true, radius: value });
    farmRadius.disabled = false;
    if (!saved) {
      farmRadiusError.textContent = "Chưa lưu được giới hạn vùng farm; cài đặt đã lưu trước đó được giữ.";
      farmFeedback.textContent = farmRadiusError.textContent;
    }
    return saved;
  })();
  farmRadiusCommit = save;
  save.finally(() => { if (farmRadiusCommit === save) farmRadiusCommit = null; });
  return save;
}
farmRadius.addEventListener("input", () => {
  farmRadiusError.textContent = "";
  farmMessage("Bản nháp chưa lưu.");
});
farmRadius.addEventListener("blur", () => { void commitFarmRadius(); });
farmRadius.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  void commitFarmRadius();
});
async function flushFarmNumericDrafts() {
  if (!farmSyncReady) return { saved: false, reason: "load" };
  const pending = [];
  if (farmRangeCommit) pending.push(farmRangeCommit);
  else if (Number(farmTargetMinLevel.value) !== farmConfirmed.targetMinLevel
      || Number(farmTargetMaxLevel.value) !== farmConfirmed.targetMaxLevel || farmDraftError)
    pending.push(commitFarmRange());
  if (farmRadiusCommit) pending.push(farmRadiusCommit);
  else if (farmRadius.value !== String(farmConfirmed.radius)) pending.push(commitFarmRadius());
  const hadPendingSave = farmPendingSaves > 0;
  const results = await Promise.all(pending);
  const queueSaved = !hadPendingSave || await farmSaveQueue.then(() => true, () => false);
  const min = Number(farmTargetMinLevel.value), max = Number(farmTargetMaxLevel.value);
  if (!farmRadius.value.trim() || !farmRadius.checkValidity()
      || !Number.isSafeInteger(farmRadius.valueAsNumber) || farmRadius.valueAsNumber < 1 || farmRadius.valueAsNumber > 1000)
    return { saved: false, reason: "invalid", field: "radius" };
  if (!Number.isSafeInteger(min) || min < 1)
    return { saved: false, reason: "invalid", field: "min" };
  if (!Number.isSafeInteger(max) || max < 1 || min > max)
    return { saved: false, reason: "invalid", field: "max" };
  if (!results.every(Boolean) || !queueSaved) return { saved: false, reason: "persistence" };
  const saved = !farmDraftError && farmRadius.value === String(farmConfirmed.radius)
    && min === farmConfirmed.targetMinLevel && max === farmConfirmed.targetMaxLevel;
  return saved ? { saved: true } : { saved: false, reason: "persistence" };
}
const trustedGameOrigin = "https://nghichthienky.online";
window.addEventListener("message", async (event) => {
  if (window.top === window || event.source !== window.parent || event.origin !== trustedGameOrigin
      || event.data?.channel !== "gst:menu-before-close:v1"
      || !Number.isSafeInteger(event.data.id) || event.data.id <= 0) return;
  let result;
  try {
    result = await flushFarmNumericDrafts();
    if (result.saved) {
      const potion = globalThis.GSTPotionPopup?.flushNumericDrafts;
      const harvest = globalThis.GSTHarvestPopup?.flushNumericDrafts;
      if (!potion || !harvest) result = { saved: false, reason: "load" };
      else {
        for (const flush of [potion, harvest, flushSpeedNumericDrafts]) {
          result = await flush();
          if (!result.saved) break;
        }
      }
    }
  } catch { result = { saved: false, reason: "persistence" }; }
  window.parent.postMessage({ channel: "gst:menu-before-close-result:v1", id: event.data.id, ...result }, trustedGameOrigin);
});
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
let speedConfirmed = null, speedReady = false, speedSaveQueue = Promise.resolve();

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

const speedLabels = {
  walkingSpeed: "Tốc độ đi bộ", flyingSpeed: "Tốc độ bay",
  farmWalkingSpeed: "Tốc độ đi bộ khi farm", farmFlyingSpeed: "Tốc độ bay khi farm"
};
function invalidSpeedInput() {
  return speedInputs.find((input) => !input.checkValidity()
    || !Number.isFinite(input.valueAsNumber) || input.valueAsNumber < 1 || input.valueAsNumber > 6);
}
function speedSnapshot() {
  return { enabled: enabledInput.checked, walkingSpeed: walkingInput.valueAsNumber,
    flyingSpeed: flyingInput.valueAsNumber, farmWalkingSpeed: farmWalkingInput.valueAsNumber,
    farmFlyingSpeed: farmFlyingInput.valueAsNumber };
}
function save() {
  if (saving) return Promise.resolve(false);
  const invalid = invalidSpeedInput();
  if (invalid) {
    feedback.textContent = `${speedLabels[invalid.id]} phải từ 1 đến 6.`;
    return Promise.resolve(false);
  }
  const values = speedSnapshot();
  const operation = speedSaveQueue.catch(() => {}).then(async () => {
    if (speedConfirmed && Object.keys(values).every((key) => speedConfirmed[key] === values[key])) return true;
    try {
      await chrome.storage.local.set({ preferences: values });
      speedConfirmed = { ...values };
      feedback.textContent = "";
      void refresh();
      return true;
    } catch {
      feedback.textContent = "Chưa lưu được cài đặt tốc độ. Hãy thử lưu lại.";
      return false;
    }
  });
  speedSaveQueue = operation;
  return operation;
}
async function flushSpeedNumericDrafts() {
  if (!speedReady) return { saved: false, reason: "load" };
  // Reset/disabled speed must not be blocked by an inactive numeric draft.
  if (!enabledInput.checked) {
    const queued = await speedSaveQueue.then((saved) => saved !== false, () => false);
    return queued ? { saved: true } : { saved: false, reason: "persistence" };
  }
  const invalid = invalidSpeedInput();
  if (invalid) return { saved: false, reason: "invalid", field: invalid.id };
  return await save() ? { saved: true } : { saved: false, reason: "persistence" };
}

document.getElementById("save").addEventListener("click", () => { void save(); });
enabledInput.addEventListener("change", () => {
  document.getElementById("speedSettings").hidden = !enabledInput.checked;
  // Disabling must work even when the speed input contains invalid draft text.
  if (!enabledInput.checked) {
    if (!walkingInput.checkValidity()) walkingInput.value = "3.5";
    if (!flyingInput.checkValidity()) flyingInput.value = "2";
    if (!farmWalkingInput.checkValidity()) farmWalkingInput.value = "2";
    if (!farmFlyingInput.checkValidity()) farmFlyingInput.value = "1.5";
  }
  void save();
});
for (const input of speedInputs) {
  input.addEventListener("blur", () => { void save(); });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") { event.preventDefault(); void save(); }
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

const farmLoadRevision = farmStorageRevision;
chrome.storage.local.get(["preferences", "displayPreferences", "fontPreferences", "farmPreferences", "farmShortcut", "areaMapOptions"]).then(({ preferences, displayPreferences, fontPreferences, farmPreferences, farmShortcut, areaMapOptions }) => {
  enabledInput.checked = preferences?.enabled === true;
  document.getElementById("speedSettings").hidden = !enabledInput.checked;
  for (const [input, fallback] of [[walkingInput, 3.5], [flyingInput, 2], [farmWalkingInput, 2], [farmFlyingInput, 1.5]]) {
    const speed = preferences?.[input.id];
    input.value = typeof speed === "number" && Number.isFinite(speed)
      ? Math.min(6, Math.max(1, speed)) : fallback;
  }
  speedConfirmed = speedSnapshot();
  speedReady = true;
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
  farmReturnDeath.checked = areaMapOptions?.returnDeath === true;
  const initialFarmPreferences = farmLoadRevision === farmStorageRevision
    ? (farmPreferences ?? {}) : (latestFarmPreferences ?? {});
  syncFarmPreferences(initialFarmPreferences, { preserveDraft: false });
  breakSeals.disabled = false;
  latestFarmPreferences = initialFarmPreferences;
  farmSyncReady = true;
  const migrationNeeded = initialFarmPreferences.excludeBoss && ["boss", "bossLevel"].includes(normalizeFarmTargetMode(initialFarmPreferences.targetMode))
    || ["bossFirst", "level"].includes(initialFarmPreferences.targetMode);
  if (migrationNeeded) updateFarmPreferences({}).then((committed) => {
    chrome.storage.local.get("farmPreferences").then(({ farmPreferences: current }) => {
      latestFarmPreferences = current ?? committed;
      syncFarmPreferences(latestFarmPreferences);
    }).catch(() => {
      latestFarmPreferences = committed;
      syncFarmPreferences(committed);
    });
  }).catch(() => { farmFeedback.textContent = "Chưa đồng bộ được bộ lọc boss; hãy lưu lại."; });
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
  const operation = speedSaveQueue.catch(() => {}).then(async () => {
    const saved = await chrome.storage.local.get("preferences");
    const value = { ...saved.preferences, enabled: false };
    await chrome.storage.local.set({ preferences: value });
    speedConfirmed = { ...speedSnapshot(), ...value, enabled: false };
  });
  speedSaveQueue = operation;
  try {
    await operation;
    enabledInput.checked = false;
    feedback.textContent = "Đã tắt điều chỉnh tốc độ để dùng tốc độ gốc của game.";
    await refresh();
  } catch { feedback.textContent = "Chưa khôi phục được tốc độ. Thử lại."; }
  finally { saving = false; controls.disabled = false; }
});
