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
const farmPolicyMode = document.getElementById("farmPolicyMode");
const farmPolicySavedMode = document.getElementById("farmPolicySavedMode");
const farmPolicyDescription = document.getElementById("farmPolicyDescription");
const farmPolicyRuntimeStatus = document.getElementById("farmPolicyRuntimeStatus");
const farmPolicyFeedback = document.getElementById("farmPolicyFeedback");
const farmAssistanceAvailability = document.getElementById("farmAssistanceAvailability");
const farmNoRetreat = document.getElementById("farmNoRetreat");
const farmReturnDeath = document.getElementById("farmReturnDeath");
const breakSeals = document.getElementById("breakSeals");
const farmSearchScope = document.getElementById("farmSearchScope");
const farmShowTargetLine = document.getElementById("farmShowTargetLine");
const farmShowRange = document.getElementById("farmShowRange");
const farmNearbyClear = document.getElementById("farmNearbyClear");
const farmNearbyRadius = document.getElementById("farmNearbyRadius");
const farmRadius = document.getElementById("farmRadius");
const farmTargetMode = document.getElementById("farmTargetMode");
const farmBossFilter = document.getElementById("farmBossFilter");
const farmBossFilterHelp = document.getElementById("farmBossFilterHelp");
const farmBossDodge = document.getElementById("farmBossDodge");
const farmEliteDodge = document.getElementById("farmEliteDodge");
const farmBossRetreat = document.getElementById("farmBossRetreat");
const farmRetreatHpPercent = document.getElementById("farmRetreatHpPercent");
const farmRecoveryHpPercent = document.getElementById("farmRecoveryHpPercent");
const farmRetreatThresholdError = document.getElementById("farmRetreatThresholdError");
const farmExcludeBoss = document.getElementById("farmExcludeBoss");
const farmExcludeBossHelp = document.getElementById("farmExcludeBossHelp");
const farmTargetRealm = document.getElementById("farmTargetRealm");
const farmTargetTier = document.getElementById("farmTargetTier");
const farmTargetMinRealm = document.getElementById("farmTargetMinRealm");
const farmTargetMinTier = document.getElementById("farmTargetMinTier");
const farmTargetMaxRealm = document.getElementById("farmTargetMaxRealm");
const farmTargetMaxTier = document.getElementById("farmTargetMaxTier");
const farmRadiusError = document.getElementById("farmRadiusError");
const farmTargetLevelError = document.getElementById("farmTargetLevelError");
const farmTargetMinLevelError = document.getElementById("farmTargetMinLevelError");
const farmTargetMaxLevelError = document.getElementById("farmTargetMaxLevelError");
const farmIdleMode = document.getElementById("farmIdleMode");
const farmPreferLoot = document.getElementById("farmPreferLoot");
const farmSelfDefense = document.getElementById("farmSelfDefense");
const farmAutoRespawn = document.getElementById("farmAutoRespawn");
const farmAutoEncounter = document.getElementById("farmAutoEncounter");
const positiveLevel = (value, fallback) => Number.isSafeInteger(value) && value > 0 ? value : fallback;
const validFarmHpThresholds = (retreat, recovery) => Number.isSafeInteger(retreat) && retreat >= 1 && retreat < recovery
  && Number.isSafeInteger(recovery) && recovery <= 100;
const farmCompatibility = globalThis.GSTFarmCompatibility;
const farmTargetRows = {
  single: { realm: farmTargetRealm, tier: farmTargetTier, error: farmTargetLevelError },
  min: { realm: farmTargetMinRealm, tier: farmTargetMinTier, error: farmTargetMinLevelError },
  max: { realm: farmTargetMaxRealm, tier: farmTargetMaxTier, error: farmTargetMaxLevelError }
};
function fillFarmRealms(row, includeLegacy = false) {
  const options = [new Option("Chọn cảnh giới", ""), ...farmCompatibility.realms.map((realm) => new Option(realm, realm))];
  if (includeLegacy) options.push(new Option("Mức đã lưu (giữ nguyên)", "legacy"));
  row.realm.replaceChildren(...options);
}
function fillFarmTiers(row) {
  row.tier.replaceChildren(new Option("Chọn tầng", ""),
    ...farmCompatibility.tierNumbers.map((tier) => new Option(String(tier), String(tier))));
}
function setFarmSelection(row, kind, value, preserveDraft = false) {
  if (preserveDraft) {
    if (row.realm.value === "legacy" && ![...row.realm.options].some((option) => option.value === "legacy"))
      row.realm.add(new Option("Mức đã lưu (giữ nguyên)", "legacy"));
    return;
  }
  const selected = farmCompatibility.selection(kind, value);
  fillFarmRealms(row, selected.legacy);
  row.realm.value = selected.realm;
  row.realm.dataset.legacyValue = String(value);
  fillFarmTiers(row);
  row.tier.value = selected.legacy ? "" : String(selected.tier);
  row.tier.disabled = selected.legacy;
}
function farmSelectionValue(row, kind) {
  if (row.realm.value === "legacy") {
    const value = Number(row.realm.dataset.legacyValue);
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  return farmCompatibility.valueFor(row.realm.value, row.tier.value, kind);
}
function activeFarmTargetMode() { return farmTargetMode.value || farmConfirmed.targetMode || "all"; }
function farmLevelDraft() {
  const mode = activeFarmTargetMode();
  if (["maxLevel", "minLevel"].includes(mode)) {
    const kind = mode === "minLevel" ? "min" : "max";
    const value = farmSelectionValue(farmTargetRows.single, kind);
    return { active: true, valid: value !== null, dirty: value === null || value !== farmConfirmed.targetLevel };
  }
  if (mode === "range") {
    const min = farmSelectionValue(farmTargetRows.min, "min");
    const max = farmSelectionValue(farmTargetRows.max, "max");
    return { active: true, valid: min !== null && max !== null && min <= max,
      dirty: min === null || max === null || min !== farmConfirmed.targetMinLevel || max !== farmConfirmed.targetMaxLevel };
  }
  return { active: false, valid: true, dirty: false };
}
function clearFarmTargetErrors() {
  for (const row of Object.values(farmTargetRows)) row.error.textContent = "";
}
for (const row of Object.values(farmTargetRows)) { fillFarmRealms(row); fillFarmTiers(row); }
function syncFarmLevelInputs() {
  const mode = activeFarmTargetMode(), single = ["maxLevel", "minLevel"].includes(mode), range = mode === "range";
  document.getElementById("farmSingleLevel").hidden = !single;
  document.getElementById("farmLevelRange").hidden = !range;
  document.getElementById("farmSingleLevelLabel").textContent = mode === "minLevel"
    ? "≥ Cảnh giới đã chọn" : "≤ Cảnh giới đã chọn";
  farmTargetRows.single.realm.disabled = !single;
  farmTargetRows.single.tier.disabled = !single || farmTargetRows.single.realm.value === "legacy";
  for (const name of ["min", "max"]) {
    farmTargetRows[name].realm.disabled = !range;
    farmTargetRows[name].tier.disabled = !range || farmTargetRows[name].realm.value === "legacy";
  }
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
const farmWrites = new Map();
let farmPreferenceWritesPending = 0;
let popupAccountContext = null;
let popupAccountTabId = null;
let popupAccountContextVersion = 0;
let popupAccountBindingRequired = false;
let accountContextLoaded = false;
let popupContextRead = null;
function samePopupContext(expected, actual, tabId) {
  if (expected === null) return actual === null;
  if (!expected || !actual || expected.tabId !== tabId || actual.tabId !== tabId) return false;
  if (expected.verified === true)
    return GSTAccountProfiles.matchesIdentity(actual, GSTAccountProfiles.identity(expected), tabId);
  return actual.verified !== true && expected.reason === actual.reason && expected.slot === actual.slot;
}
function updatePopupAccountContext(context) {
  const previous = popupAccountContext;
  if (context && popupAccountTabId !== null) context = { ...context, tabId: popupAccountTabId };
  if (samePopupContext(popupAccountContext, context, popupAccountTabId)) return false;
  if (previous !== null || context !== null) popupAccountBindingRequired = true;
  popupAccountContext = context;
  popupAccountContextVersion++;
  globalThis.GSTPopupAccountContext = context;
  const status = document.getElementById("accountActiveStatus");
  if (status) status.textContent = context?.verified
    ? "Tab hiện tại: " + (context.accountLabel || "Nick hiện tại") + " · " + context.character + "."
    : "Chưa xác nhận được nick trong tab hiện tại; cài đặt Farm/Thu hoạch bị khóa.";
  window.dispatchEvent(new CustomEvent("gst:popup-account-context-change", {
    detail: { context, previous, version: popupAccountContextVersion }
  }));
  return true;
}
const accountContextPromise = GSTAccountProfiles.captureActiveContext().catch(() => ({ tabId: null, context: null })).then(({ tabId, context }) => {
  popupAccountTabId = tabId;
  popupAccountContext = context;
  popupAccountBindingRequired = context !== null;
  accountContextLoaded = true;
  globalThis.GSTPopupAccountContext = context;
  const status = document.getElementById("accountActiveStatus");
  if (status && context) {
    status.textContent = context.verified
      ? "Tab hiện tại: " + (context.accountLabel || "Nick hiện tại") + " · " + context.character + "."
      : "Chưa xác nhận được nick trong tab hiện tại; cài đặt Farm/Thu hoạch bị khóa.";
  }
  syncFarmPolicyUI(farmConfirmed);
  return context;
});
async function validatePopupAccountContext(expected, version) {
  await accountContextPromise;
  const tabId = popupAccountTabId;
  const startingVersion = popupAccountContextVersion;
  if (!popupContextRead) {
    popupContextRead = (tabId === null ? Promise.resolve(null) : GSTAccountProfiles.contextForTab(tabId, { fresh: true }))
      .finally(() => { popupContextRead = null; });
  }
  const fresh = await popupContextRead;
  if (startingVersion !== popupAccountContextVersion)
    return { valid: false, context: popupAccountContext, tabId, version: popupAccountContextVersion };
  const valid = version === popupAccountContextVersion && samePopupContext(expected, fresh, tabId);
  if (!samePopupContext(popupAccountContext, fresh, tabId)) updatePopupAccountContext(fresh);
  return { valid, context: fresh, tabId, version: popupAccountContextVersion };
}
globalThis.GSTPopupAccountContextPromise = accountContextPromise;
globalThis.GSTPopupAccountSession = {
  current: () => popupAccountContext,
  tabId: () => popupAccountTabId,
  version: () => popupAccountContextVersion,
  bindingRequired: () => popupAccountBindingRequired,
  validate: validatePopupAccountContext
};
void accountContextPromise.then(() => {
  if (popupAccountTabId === null) return;
  const timer = setInterval(() => {
    void validatePopupAccountContext(popupAccountContext, popupAccountContextVersion);
  }, 1200);
  window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
});
function updateFarmPreferences(patch, { draftWrite = false } = {}) {
  const expectedContext = popupAccountContext;
  const expectedVersion = popupAccountContextVersion;
  const save = farmSaveQueue.catch(() => {}).then(async () => {
    await accountContextPromise;
    const binding = await validatePopupAccountContext(expectedContext, expectedVersion);
    if (!binding.valid || (binding.context && binding.context.verified !== true)
        || (popupAccountBindingRequired && binding.context?.verified !== true))
      throw new Error("Account identity changed or is not confirmed.");
    const context = binding.context;
    return GSTAccountProfiles.updateFeature(context, "farm", (current) => {
    const policyMode = Object.prototype.hasOwnProperty.call(patch, "policyMode")
      ? globalThis.GSTFarmPolicy.normalize(patch.policyMode) : globalThis.GSTFarmPolicy.read(current);
    const farmPreferences = globalThis.GSTFarmPolicy.withMode({ ...current, ...patch },
      policyMode);
    if (patch.bossFilter === "world"
        || ["boss", "bossLevel"].includes(normalizeFarmTargetMode(patch.targetMode))) farmPreferences.excludeBoss = false;
    else if (patch.excludeBoss === true && ["boss", "bossLevel"].includes(normalizeFarmTargetMode(current.targetMode)))
      farmPreferences.targetMode = "highLevel";
    else if (Object.keys(patch).length === 0) {
      if (current.excludeBoss === true && ["boss", "bossLevel"].includes(normalizeFarmTargetMode(current.targetMode)))
        farmPreferences.targetMode = "highLevel";
      else if (current.targetMode === "bossFirst") farmPreferences.targetMode = "bossLevel";
      else if (current.targetMode === "level") farmPreferences.targetMode = "maxLevel";
    }
    return farmPreferences;
    }, async () => {
      const latest = await validatePopupAccountContext(expectedContext, expectedVersion);
      return latest.valid && (!popupAccountBindingRequired || latest.context?.verified === true);
    });
  });
  farmSaveQueue = save;
  farmWrites.set(save, draftWrite);
  void save.then(() => { farmWrites.delete(save); }, () => { farmWrites.delete(save); });
  return save;
}
async function readCurrentFarmPreferences() {
  await accountContextPromise;
  const stored = await chrome.storage.local.get(["farmPreferences", GSTAccountProfiles.profilesKey]);
  if (popupAccountBindingRequired && popupAccountContext?.verified !== true) return {};
  return GSTAccountProfiles.currentProfile(popupAccountContext, "farm", stored);
}

const connectionRecoveryDefaults = Object.freeze({
  autoReconnect: true, autoReload: false, reloadDelaySeconds: 90,
  reloadCountdownSeconds: 10, reloadLimit: 3, reloadWindowMinutes: 15
});
const connectionRecoveryControls = document.getElementById("connectionRecoveryControls");
const connectionAutoReconnect = document.getElementById("connectionAutoReconnect");
const connectionAutoReload = document.getElementById("connectionAutoReload");
const connectionReloadDelay = document.getElementById("connectionReloadDelay");
const connectionReloadCountdown = document.getElementById("connectionReloadCountdown");
const connectionReloadLimit = document.getElementById("connectionReloadLimit");
const connectionReloadWindow = document.getElementById("connectionReloadWindow");
const connectionRecoveryScope = document.getElementById("connectionRecoveryScope");
const connectionRecoveryFeedback = document.getElementById("connectionRecoveryFeedback");
let connectionRecoveryConfirmed = { ...connectionRecoveryDefaults };
let connectionRecoveryReady = false;
let connectionRecoveryRevision = 0;
let connectionRecoveryQueue = Promise.resolve();
function normalizeConnectionRecovery(raw = {}) {
  const bounded = (value, min, max, fallback) => Number.isSafeInteger(value)
    ? Math.max(min, Math.min(max, value)) : fallback;
  return {
    autoReconnect: raw.autoReconnect !== false,
    autoReload: raw.autoReload === true,
    reloadDelaySeconds: bounded(raw.reloadDelaySeconds, 30, 600, 90),
    reloadCountdownSeconds: bounded(raw.reloadCountdownSeconds, 3, 60, 10),
    reloadLimit: bounded(raw.reloadLimit, 1, 10, 3),
    reloadWindowMinutes: bounded(raw.reloadWindowMinutes, 5, 120, 15)
  };
}
function syncConnectionRecovery(raw, { allowed, managed, known = true, label = "" } = {}) {
  connectionRecoveryConfirmed = normalizeConnectionRecovery(raw);
  connectionAutoReconnect.checked = connectionRecoveryConfirmed.autoReconnect;
  connectionAutoReload.checked = connectionRecoveryConfirmed.autoReload;
  connectionReloadDelay.value = String(connectionRecoveryConfirmed.reloadDelaySeconds);
  connectionReloadCountdown.value = String(connectionRecoveryConfirmed.reloadCountdownSeconds);
  connectionReloadLimit.value = String(connectionRecoveryConfirmed.reloadLimit);
  connectionReloadWindow.value = String(connectionRecoveryConfirmed.reloadWindowMinutes);
  connectionRecoveryControls.disabled = !connectionRecoveryReady || !allowed;
  connectionAutoReconnect.disabled = !connectionRecoveryReady || !allowed;
  connectionAutoReload.disabled = !connectionRecoveryReady || !allowed;
  connectionReloadDelay.disabled = !allowed || !connectionRecoveryReady || !connectionRecoveryConfirmed.autoReload;
  connectionReloadCountdown.disabled = !allowed || !connectionRecoveryReady || !connectionRecoveryConfirmed.autoReload;
  connectionReloadLimit.disabled = !allowed || !connectionRecoveryReady || !connectionRecoveryConfirmed.autoReload;
  connectionReloadWindow.disabled = !allowed || !connectionRecoveryReady || !connectionRecoveryConfirmed.autoReload;
  connectionRecoveryScope.textContent = !known
    ? "Không xác định được phạm vi của tab; cài đặt kết nối đang khóa để tránh ghi nhầm hồ sơ."
    : !allowed
      ? "Tab nick được quản lý chưa xác nhận; cài đặt kết nối đang khóa để tránh ghi nhầm hồ sơ."
    : managed ? `Cài đặt kết nối riêng cho ${label || "nick đã xác nhận"}.`
      : "Đang dùng mặc định chung cho tab không quản lý nick.";
}
async function loadConnectionRecovery() {
  const revision = connectionRecoveryRevision;
  await accountContextPromise;
  const expectedContext = popupAccountContext, expectedVersion = popupAccountContextVersion;
  const [stored, binding] = await Promise.all([
    chrome.storage.local.get(["connectionRecoveryPreferences", GSTAccountProfiles.profilesKey]),
    validatePopupAccountContext(expectedContext, expectedVersion)
  ]);
  if (revision !== connectionRecoveryRevision) return;
  const context = binding.context;
  const known = binding.valid && !!context && binding.tabId === popupAccountTabId
    && context.tabId === popupAccountTabId;
  const accountManaged = known && !!context.slot;
  const allowed = known && (!accountManaged || context.verified === true && !!context.accountId);
  const preferences = !known ? connectionRecoveryDefaults
    : accountManaged && !allowed ? stored.connectionRecoveryPreferences ?? {}
      : GSTAccountProfiles.currentProfile(context, "connectionRecovery", stored);
  connectionRecoveryReady = true;
  syncConnectionRecovery(preferences, { allowed, managed: accountManaged, known,
    label: context?.verified ? context.accountLabel || context.character : "" });
}
function updateConnectionRecovery(patch) {
  const expectedContext = popupAccountContext;
  const expectedVersion = popupAccountContextVersion;
  const revision = ++connectionRecoveryRevision;
  const save = connectionRecoveryQueue.catch(() => {}).then(async () => {
    await accountContextPromise;
    const binding = await validatePopupAccountContext(expectedContext, expectedVersion);
    const context = binding.context;
    const known = binding.valid && !!context && binding.tabId === popupAccountTabId
      && context.tabId === popupAccountTabId;
    const accountManaged = known && !!context.slot;
    if (!known || accountManaged && (context.verified !== true || !context.accountId))
      throw new Error("Nick hoặc tab đã thay đổi; chưa lưu cài đặt kết nối.");
    const written = await GSTAccountProfiles.updateFeature(context, "connectionRecovery",
      (current) => normalizeConnectionRecovery({ ...current, ...patch }), async () => {
        const latest = await validatePopupAccountContext(expectedContext, expectedVersion);
        const latestContext = latest.context;
        return latest.valid && !!latestContext && latest.tabId === binding.tabId
          && latestContext.tabId === binding.tabId
          && !!latestContext.slot === accountManaged
          && (!accountManaged || latestContext.verified === true && latestContext.accountId === context.accountId);
      });
    if (Number.isInteger(binding.tabId)) {
      try { await chrome.tabs.sendMessage(binding.tabId, { type: "gst:account-context", fresh: true }); }
      catch { /* The storage change still syncs on the next bridge refresh. */ }
    }
    if (revision === connectionRecoveryRevision) {
      connectionRecoveryFeedback.textContent = "Đã lưu cài đặt kết nối.";
      await loadConnectionRecovery();
    }
    return written;
  });
  connectionRecoveryQueue = save;
  void save.catch((error) => {
    if (revision !== connectionRecoveryRevision) return;
    connectionRecoveryFeedback.textContent = error?.message || "Chưa lưu được cài đặt kết nối.";
    void loadConnectionRecovery();
  });
  return save;
}
for (const [input, key] of [[connectionAutoReconnect, "autoReconnect"], [connectionAutoReload, "autoReload"]]) {
  input.addEventListener("change", () => {
    input.disabled = true;
    connectionRecoveryFeedback.textContent = "Đang lưu cài đặt kết nối…";
    void updateConnectionRecovery({ [key]: input.checked });
  });
}
for (const [input, key, min, max, label] of [
  [connectionReloadDelay, "reloadDelaySeconds", 30, 600, "Khoảng chờ phải từ 30 đến 600 giây."],
  [connectionReloadCountdown, "reloadCountdownSeconds", 3, 60, "Đếm ngược phải từ 3 đến 60 giây."],
  [connectionReloadLimit, "reloadLimit", 1, 10, "Số lần tải lại phải từ 1 đến 10."],
  [connectionReloadWindow, "reloadWindowMinutes", 5, 120, "Khoảng giới hạn phải từ 5 đến 120 phút."]
]) input.addEventListener("change", () => {
  const value = Number(input.value);
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    connectionRecoveryFeedback.textContent = label;
    input.value = String(connectionRecoveryConfirmed[key]);
    return;
  }
  input.disabled = true;
  connectionRecoveryFeedback.textContent = "Đang lưu cài đặt kết nối…";
  void updateConnectionRecovery({ [key]: value });
});
void accountContextPromise.then(loadConnectionRecovery);
window.addEventListener("gst:popup-account-context-change", () => { void loadConnectionRecovery(); });
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && (changes.connectionRecoveryPreferences || changes[GSTAccountProfiles.profilesKey]))
    void loadConnectionRecovery();
});

async function refreshFarm() {
  if (farmBusy) return;
  farmBusy = true;
  try {
    const tabId = popupAccountTabId;
    if (!Number.isInteger(tabId)) throw new Error("No bound game tab.");
    const status = await chrome.tabs.sendMessage(tabId, { type: "gst:farm-status" });
    const farmLabel = status.autoOn === true ? "BẬT" : status.autoOn === false ? "TẮT" : "CHƯA RÕ";
    autoFarmValue.textContent = status.autoOn === true ? "Đang bật" : status.autoOn === false ? "Đã tắt" : "Chưa rõ";
    autoFarmValue.dataset.state = status.autoOn === true ? "on" : status.autoOn === false ? "off" : "unknown";
    farmPolicyRuntimeStatus.textContent = `Auto Farm gốc trong tab đang mở: ${farmLabel}${status.dead ? " · nhân vật đã chết" : ""}.`;
    farmStatus.textContent = `Auto Farm của game: ${farmLabel}${status.dead ? " · Đã chết" : ""}. ${status.message}`;
    document.getElementById("farmEncounterStatus").textContent = status.encounterStatus || "";
  } catch {
    autoFarmValue.textContent = "Chưa rõ";
    autoFarmValue.dataset.state = "unknown";
    farmPolicyRuntimeStatus.textContent = "Auto Farm gốc trong tab đang mở: CHƯA RÕ.";
    farmStatus.textContent = "Mở tab game; tải lại tab sau khi cập nhật extension để đọc Auto Farm.";
    document.getElementById("farmEncounterStatus").textContent = "";
  } finally { farmBusy = false; }
}

let farmConfirmed = {};
let farmDraftError = false;
let farmSyncReady = false;
let farmStorageRevision = 0;
let latestFarmPreferences;
let farmHpEditRevision = 0, farmHpSyncedEditRevision = 0;
let farmHpThresholdOperation = null, farmHpThresholdFollowupCount = 0, farmHpThresholdFollowupRequested = false;
let farmPolicyLoaded = false;
let farmPolicyHasSavedValue = false;
let farmPolicyConfirmed = null;
let farmPolicyPending = 0;
let farmPolicyRequestRevision = 0;
let farmPolicyWaiters = [];
let selectingFarmPolicy = false;
const farmPolicyLabels = Object.freeze({ extended: "Tool hỗ trợ", native: "Theo game gốc", disabled: "Khóa Auto Farm" });
const farmPolicyDescriptions = Object.freeze({
  extended: "Đang chọn Tool hỗ trợ: dùng farm gốc với các hỗ trợ đã cài của extension.",
  native: "Đang chọn Theo game gốc: farm gốc tự điều khiển, không có hỗ trợ farm riêng của extension.",
  disabled: "Đang chọn Khóa Auto Farm: dừng farm đang chạy và chặn các đường bật được hỗ trợ."
});
function normalizeFarmTargetMode(mode) {
  return mode === "level" ? "maxLevel" : mode === "bossFirst" ? "bossLevel"
    : ["maxLevel", "minLevel", "range", "boss", "bossLevel", "highLevel", "lowLevel"].includes(mode) ? mode : "all";
}
function normalizedFarmPreferences(raw = {}) {
  const mode = normalizeFarmTargetMode(raw.targetMode);
  const retreatHpPercent = Number.isSafeInteger(raw.retreatHpPercent) ? raw.retreatHpPercent : 40;
  const recoveryHpPercent = Number.isSafeInteger(raw.recoveryHpPercent) ? raw.recoveryHpPercent : 100;
  const hpThresholds = validFarmHpThresholds(retreatHpPercent, recoveryHpPercent)
    ? { retreatHpPercent, recoveryHpPercent } : { retreatHpPercent: 40, recoveryHpPercent: 100 };
  const radius = Number.isSafeInteger(raw.radius)
    ? Math.max(1, Math.min(1000, raw.radius)) : 22;
  return {
    policyMode: globalThis.GSTFarmPolicy.read(raw),
    enabled: raw.enabled === true, radius: raw.enabled === true ? radius : 11,
    searchScope: raw.enabled === true && raw.searchScope === "map" ? "map" : "radius",
    targetMode: mode, targetLevel: positiveLevel(raw.targetLevel, 1),
    bossFilter: raw.bossFilter === "world" ? "world" : "all",
    targetMinLevel: positiveLevel(raw.targetMinLevel, 1), targetMaxLevel: positiveLevel(raw.targetMaxLevel, 20),
    excludeBoss: raw.excludeBoss === true, noRetreat: raw.noRetreat !== false,
    showTargetLine: raw.showTargetLine === true, showRange: raw.showRange === true,
    nearbyClear: raw.nearbyClear === true,
    nearbyRadius: Number.isSafeInteger(raw.nearbyRadius) ? Math.max(1, Math.min(6, raw.nearbyRadius)) : 2,
    breakSeals: raw.breakSeals === true,
    idleMode: ["home", "seek"].includes(raw.idleMode) ? raw.idleMode : "hold",
    preferLoot: raw.preferLoot !== false, selfDefense: raw.selfDefense === true,
    autoRespawn: raw.autoRespawn !== false,
    autoEncounter: raw.autoEncounter === true, bossDodge: raw.bossDodge !== false,
    eliteDodge: raw.eliteDodge === true, bossRetreat: raw.bossRetreat !== false,
    ...hpThresholds
  };
}
function syncFarmPolicyUI(raw = {}) {
  const confirmedMode = farmConfirmed.policyMode;
  farmPolicyConfirmed = confirmedMode;
  farmPolicyHasSavedValue = typeof raw.policyMode === "string" && globalThis.GSTFarmPolicy.modes.includes(raw.policyMode);
  const pendingSelection = farmPolicyPending > 0 ? farmPolicyMode.value : null;
  farmPolicyMode.value = confirmedMode;
  if (pendingSelection && globalThis.GSTFarmPolicy.modes.includes(pendingSelection)) farmPolicyMode.value = pendingSelection;
  const accountAllowed = !accountContextLoaded || (popupAccountContext
    ? popupAccountContext.verified === true : !popupAccountBindingRequired);
  farmPolicyMode.disabled = !farmPolicyLoaded || !accountAllowed;
  farmPolicySavedMode.textContent = farmPolicyHasSavedValue
    ? `Chế độ đã lưu: ${farmPolicyLabels[confirmedMode]}.`
    : `Chưa có chế độ hợp lệ được lưu; mặc định hiện tại: ${farmPolicyLabels[confirmedMode]}.`;
  farmPolicyDescription.textContent = farmPolicyDescriptions[farmPolicyMode.value] ?? "Đang đọc chế độ…";
  const extended = confirmedMode === "extended";
  farmControls.disabled = !farmSyncReady || !extended || !accountAllowed;
  farmRightControls.disabled = !farmSyncReady || !extended || !accountAllowed;
  syncBossTargetControls();
  breakSeals.disabled = !farmSyncReady || !extended || !accountAllowed;
  shortcutControls.disabled = !farmSyncReady || !extended || !accountAllowed;
  farmAssistanceAvailability.hidden = extended || !farmSyncReady;
  farmAssistanceAvailability.textContent = !accountAllowed
    ? "Xác nhận nick trong tab game trước khi sửa cài đặt riêng."
    : confirmedMode === "disabled"
    ? "Tùy chọn hỗ trợ farm đã lưu được giữ nguyên; chúng dùng lại khi bạn mở khóa và chọn chế độ phù hợp."
    : "Tùy chọn hỗ trợ farm đã lưu được giữ nguyên; chúng chỉ áp dụng ở Tool hỗ trợ.";
}
function syncFarmPreferences(raw, { preserveDraft = true, forceKeys = [] } = {}) {
  const keepDraft = preserveDraft && farmHasDraft();
  const oldMode = activeFarmTargetMode(), levelDraft = keepDraft ? farmLevelDraft() : { dirty: false };
  const preserveHpDraft = farmHpEditRevision > farmHpSyncedEditRevision;
  const hpThresholdDraft = keepDraft ? farmHpThresholdDraft() : { dirty: false };
  const draftSingleValue = ["maxLevel", "minLevel"].includes(oldMode)
    ? farmSelectionValue(farmTargetRows.single, oldMode === "minLevel" ? "min" : "max") : null;
  const draftMinValue = oldMode === "range" ? farmSelectionValue(farmTargetRows.min, "min") : null;
  const draftMaxValue = oldMode === "range" ? farmSelectionValue(farmTargetRows.max, "max") : null;
  const next = normalizedFarmPreferences(raw);
  farmConfirmed = next;
  farmSearchScope.value = next.searchScope;
  farmNoRetreat.checked = next.noRetreat;
  farmBossDodge.checked = next.bossDodge;
  farmEliteDodge.checked = next.eliteDodge;
  farmBossRetreat.checked = next.bossRetreat;
  farmShowTargetLine.checked = next.showTargetLine;
  farmShowRange.checked = next.showRange;
  farmNearbyClear.checked = next.nearbyClear;
  breakSeals.checked = next.breakSeals;
  farmIdleMode.value = next.idleMode;
  farmPreferLoot.checked = next.preferLoot;
  farmSelfDefense.checked = next.selfDefense;
  farmAutoRespawn.checked = next.autoRespawn;
  farmAutoEncounter.checked = next.autoEncounter;
  farmExcludeBoss.checked = next.excludeBoss;
  farmTargetMode.value = next.targetMode;
  farmBossFilter.value = next.bossFilter;
  const preserveSingle = levelDraft.dirty && ["maxLevel", "minLevel"].includes(oldMode)
    && ["maxLevel", "minLevel"].includes(next.targetMode) && !forceKeys.includes("targetLevel");
  if (preserveSingle && draftSingleValue !== null)
    setFarmSelection(farmTargetRows.single, next.targetMode === "minLevel" ? "min" : "max", draftSingleValue);
  else setFarmSelection(farmTargetRows.single, next.targetMode === "minLevel" ? "min" : "max", next.targetLevel,
    preserveSingle);
  const preserveRange = levelDraft.dirty && oldMode === "range" && next.targetMode === "range"
    && !forceKeys.includes("targetMinLevel") && !forceKeys.includes("targetMaxLevel");
  setFarmSelection(farmTargetRows.min, "min", preserveRange && draftMinValue !== null ? draftMinValue : next.targetMinLevel,
    preserveRange && draftMinValue === null);
  setFarmSelection(farmTargetRows.max, "max", preserveRange && draftMaxValue !== null ? draftMaxValue : next.targetMaxLevel,
    preserveRange && draftMaxValue === null);
  if (!keepDraft || forceKeys.includes("radius")) farmRadius.value = String(next.radius);
  if (!keepDraft || forceKeys.includes("nearbyRadius")) farmNearbyRadius.value = String(next.nearbyRadius);
  if (!preserveHpDraft && (!keepDraft || forceKeys.includes("retreatHpPercent") || forceKeys.includes("recoveryHpPercent"))) {
    farmRetreatHpPercent.value = String(next.retreatHpPercent);
    farmRecoveryHpPercent.value = String(next.recoveryHpPercent);
    farmRetreatThresholdError.textContent = "";
  } else if (hpThresholdDraft.error) farmRetreatThresholdError.textContent = hpThresholdDraft.error;
  if (!keepDraft || forceKeys.includes("targetLevel")
      || forceKeys.includes("targetMinLevel") && forceKeys.includes("targetMaxLevel")) {
    farmDraftError = false;
    clearFarmTargetErrors();
  }
  syncFarmScope(); syncFarmLevelInputs(); farmSummaries();
  syncFarmPolicyUI(raw);
  farmFeedback.textContent = farmHasDraft() ? "Có bản nháp chưa lưu." : "Đã đồng bộ cài đặt.";
  syncBossTargetControls();
}
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local" || !(changes.farmPreferences || changes[GSTAccountProfiles.profilesKey])) return;
  farmStorageRevision++;
  void readCurrentFarmPreferences().then((value) => {
    latestFarmPreferences = value ?? {};
    if (farmSyncReady) syncFarmPreferences(latestFarmPreferences);
  }).catch(() => {});
});
window.addEventListener("gst:popup-account-context-change", async (event) => {
  const version = event.detail?.version;
  const stored = await chrome.storage.local.get(["farmPreferences", GSTAccountProfiles.profilesKey]);
  if (version !== popupAccountContextVersion) return;
  const context = popupAccountContext;
  const preferences = popupAccountBindingRequired && context?.verified !== true
    ? {} : GSTAccountProfiles.currentProfile(context, "farm", stored);
  farmStorageRevision++;
  latestFarmPreferences = preferences;
  farmHpSyncedEditRevision = farmHpEditRevision;
  farmDraftError = false;
  clearFarmTargetErrors();
  syncFarmPreferences(preferences, { preserveDraft: false, forceKeys: ["radius", "nearbyRadius",
    "targetLevel", "targetMinLevel", "targetMaxLevel", "retreatHpPercent", "recoveryHpPercent"] });
});
farmPolicyMode.addEventListener("change", async () => {
  const mode = globalThis.GSTFarmPolicy.normalize(farmPolicyMode.value);
  const requestRevision = ++farmPolicyRequestRevision;
  if (mode === farmPolicyConfirmed && farmPolicyPending === 0) {
    farmPolicyMode.value = farmPolicyConfirmed;
    farmPolicyDescription.textContent = farmPolicyDescriptions[farmPolicyConfirmed];
    return;
  }
  farmPolicyPending++;
  syncBossTargetControls();
  farmPolicyDescription.textContent = farmPolicyDescriptions[mode];
  farmPolicyFeedback.textContent = "Đang lưu chế độ Auto Farm…";
  try {
    const written = await updateFarmPreferences({ policyMode: mode });
    let committed = written;
    const revisionAtRead = farmStorageRevision;
    try { committed = await readCurrentFarmPreferences() ?? written; } catch {}
    if (requestRevision !== farmPolicyRequestRevision) return;
    if (farmStorageRevision !== revisionAtRead && latestFarmPreferences) committed = latestFarmPreferences;
    latestFarmPreferences = committed;
    syncFarmPreferences(committed);
    farmPolicyFeedback.textContent = committed.policyMode === mode
      ? `Đã lưu chế độ ${farmPolicyLabels[mode]}. Trạng thái farm được đọc riêng từ game.`
      : `Đã đồng bộ chế độ ${farmPolicyLabels[committed.policyMode]} từ cài đặt mới nhất.`;
  } catch {
    if (requestRevision === farmPolicyRequestRevision) {
      let rollback = latestFarmPreferences ?? farmConfirmed;
      const revisionAtRead = farmStorageRevision;
      try { rollback = await readCurrentFarmPreferences() ?? rollback; } catch {}
      if (farmStorageRevision !== revisionAtRead && latestFarmPreferences) rollback = latestFarmPreferences;
      latestFarmPreferences = rollback;
      syncFarmPreferences(rollback);
      farmPolicyMode.value = farmPolicyConfirmed;
      farmPolicyDescription.textContent = farmPolicyDescriptions[farmPolicyConfirmed];
      farmPolicyFeedback.textContent = "Chưa lưu được chế độ; đã trả bộ chọn về giá trị đã xác nhận gần nhất.";
    }
  } finally {
    farmPolicyPending--;
    if (farmPolicyPending === 0 && requestRevision === farmPolicyRequestRevision) {
      farmPolicyMode.value = farmPolicyConfirmed;
      farmPolicyDescription.textContent = farmPolicyDescriptions[farmPolicyConfirmed];
    }
    syncBossTargetControls();
    if (farmPolicyPending === 0) {
      const waiters = farmPolicyWaiters; farmPolicyWaiters = [];
      for (const resolve of waiters) resolve();
    }
  }
});
farmPolicyMode.addEventListener("pointerdown", () => {
  selectingFarmPolicy = true;
  queueMicrotask(() => { selectingFarmPolicy = false; });
}, true);
function farmHasDraft() {
  return farmDraftError || farmLevelDraft().dirty
    || farmRadius.value !== String(farmConfirmed.radius)
    || farmNearbyRadius.value !== String(farmConfirmed.nearbyRadius)
    || farmHpThresholdDraft().dirty;
}
function farmHpThresholdDraft() {
  const retreat = farmRetreatHpPercent.value.trim() === "" ? NaN : Number(farmRetreatHpPercent.value);
  const recovery = farmRecoveryHpPercent.value.trim() === "" ? NaN : Number(farmRecoveryHpPercent.value);
  const valid = validFarmHpThresholds(retreat, recovery);
  return { retreat, recovery, valid,
    dirty: farmHpEditRevision > farmHpSyncedEditRevision
      || !valid || retreat !== farmConfirmed.retreatHpPercent || recovery !== farmConfirmed.recoveryHpPercent,
    error: valid ? "" : "Nhập số nguyên: 1 ≤ HP rút lui < HP quay lại ≤ 100%.",
  };
}
function farmMessage(message) {
  farmFeedback.textContent = message + (farmDraftError ? " · Cảnh giới/tầng chưa hợp lệ, chưa lưu."
    : farmHpThresholdDraft().error ? ` · ${farmHpThresholdDraft().error}` : farmHasDraft() ? " · Có bản nháp chưa lưu." : "");
}
function syncFarmScope() {
  farmRadius.closest(".input-action").hidden = farmSearchScope.value !== "radius";
}
function syncBossTargetControls() {
  const mode = farmTargetMode.value || farmConfirmed.targetMode || "all";
  const excluded = farmExcludeBoss.checked;
  const ordinaryOnly = ["highLevel", "lowLevel"].includes(mode);
  const unavailable = !farmSyncReady || farmConfirmed.policyMode !== "extended"
    || farmPreferenceWritesPending > 0 || farmPolicyPending > 0;
  farmBossFilter.disabled = unavailable || excluded || ordinaryOnly;
  farmExcludeBoss.disabled = unavailable;
  farmBossFilterHelp.textContent = excluded ? "Đang bỏ qua tất cả boss."
    : ordinaryOnly ? "Chế độ này chỉ chọn quái thường; boss bị loại trừ."
    : mode === "boss" ? "Chỉ đánh boss thuộc loại đã chọn."
      : mode === "bossLevel" ? "Ưu tiên boss phù hợp, sau đó đánh quái thường."
        : "Bộ lọc này chỉ giới hạn loại boss, không loại quái thường.";
  farmExcludeBossHelp.textContent = farmConfirmed.excludeBoss
    ? "Tự lưu · không chọn boss làm mục tiêu."
    : "Tự lưu · tắt để cho phép các boss phù hợp với bộ lọc.";
}
function farmSummaries() {
  const prefs = farmConfirmed, compatibility = farmCompatibility;
  const targetSummary = prefs.targetMode === "maxLevel" ? `Chỉ farm ≤ ${compatibility.describe(prefs.targetLevel, "max")}`
    : prefs.targetMode === "minLevel" ? `Chỉ farm ≥ ${compatibility.describe(prefs.targetLevel, "min")}`
    : prefs.targetMode === "range" ? prefs.targetMinLevel <= prefs.targetMaxLevel
      ? `Chỉ farm trong khoảng ${compatibility.describe(prefs.targetMinLevel, "min")} đến ${compatibility.describe(prefs.targetMaxLevel, "max")}`
      : "Khoảng cảnh giới đã lưu chưa hợp lệ; chưa chọn quái."
      : "";
  document.getElementById("farmTargetSummary").textContent = targetSummary;
  document.getElementById("farmEncounterSummary").textContent = `Auto nhận kỳ ngộ · ${farmConfirmed.autoEncounter ? "bật" : "tắt"}`;
  document.getElementById("farmDefenseSummary").textContent = `Tự vệ ${farmConfirmed.selfDefense ? "bật" : "tắt"} · Dọn gần ${farmConfirmed.nearbyClear ? "bật" : "tắt"} · Hồi sinh ${farmConfirmed.autoRespawn ? "bật" : "tắt"}`;
  document.getElementById("farmBossSummary").textContent = `Tự bảo vệ · ${farmConfirmed.bossDodge ? "né boss" : "né boss tắt"} · ${farmConfirmed.eliteDodge ? "né tinh anh" : "né tinh anh tắt"}`;
  document.getElementById("farmRecoverySummary").textContent = `Hồi phục · ${farmConfirmed.noRetreat ? "không rút lui" : "theo game"}`;
}
async function saveFarmPatch(patch, rollback, { draftWrite = false, preserveDraftKeys = [], successMessage } = {}) {
  const contextVersion = popupAccountContextVersion;
  farmPreferenceWritesPending++;
  syncBossTargetControls();
  farmMessage("Đang lưu…");
  try {
    const written = await updateFarmPreferences(patch, { draftWrite });
    if (contextVersion !== popupAccountContextVersion) return false;
    let committed = written;
    const revisionAtRead = farmStorageRevision;
    try { committed = await readCurrentFarmPreferences() ?? written; } catch {}
    if (contextVersion !== popupAccountContextVersion) return false;
    if (farmStorageRevision !== revisionAtRead && latestFarmPreferences) committed = latestFarmPreferences;
    latestFarmPreferences = committed;
    syncFarmPreferences(committed, { forceKeys: [...Object.keys(patch), "targetMode", "excludeBoss"]
      .filter((key) => !preserveDraftKeys.includes(key)) });
    farmMessage(typeof successMessage === "function" ? successMessage(committed) : "Đã lưu cài đặt.");
    return true;
  } catch {
    if (contextVersion !== popupAccountContextVersion) return false;
    rollback?.();
    farmMessage("Chưa lưu được lựa chọn; cài đặt cũ được giữ.");
    return false;
  } finally {
    farmPreferenceWritesPending--;
    syncBossTargetControls();
  }
}
for (const [input, key] of [[farmShowTargetLine, "showTargetLine"], [farmShowRange, "showRange"],
  [farmNearbyClear, "nearbyClear"], [farmNoRetreat, "noRetreat"],
  [breakSeals, "breakSeals"], [farmPreferLoot, "preferLoot"], [farmSelfDefense, "selfDefense"],
  [farmAutoRespawn, "autoRespawn"], [farmAutoEncounter, "autoEncounter"], [farmBossDodge, "bossDodge"],
  [farmEliteDodge, "eliteDodge"],
  [farmBossRetreat, "bossRetreat"]]) {
  input.addEventListener("change", async () => {
    const next = input.checked;
    input.disabled = true;
    syncFarmScope();
    await saveFarmPatch({ [key]: next }, () => { input.checked = farmConfirmed[key]; syncFarmScope(); });
    input.disabled = false;
  });
}
farmNearbyRadius.addEventListener("keydown", (event) => {
  if (event.key === "Enter") farmNearbyRadius.blur();
});
farmNearbyRadius.addEventListener("change", async () => {
  const value = Number(farmNearbyRadius.value);
  if (!Number.isSafeInteger(value) || value < 1 || value > 6) {
    farmNearbyRadius.value = String(farmConfirmed.nearbyRadius);
    farmMessage("Bán kính dọn gần phải là số nguyên từ 1 đến 6.");
    return;
  }
  farmNearbyRadius.disabled = true;
  await saveFarmPatch({ nearbyRadius: value },
    () => { farmNearbyRadius.value = String(farmConfirmed.nearbyRadius); });
  farmNearbyRadius.disabled = false;
});
farmExcludeBoss.addEventListener("change", async () => {
  const next = farmExcludeBoss.checked;
  const patch = { excludeBoss: next };
  if (next && ["boss", "bossLevel"].includes(farmConfirmed.targetMode)) patch.targetMode = "highLevel";
  if (patch.targetMode) { farmTargetMode.value = patch.targetMode; syncFarmLevelInputs(); }
  syncBossTargetControls();
  await saveFarmPatch(patch, () => { farmExcludeBoss.checked = farmConfirmed.excludeBoss; farmTargetMode.value = farmConfirmed.targetMode; syncFarmLevelInputs(); });
});
farmTargetMode.addEventListener("change", async () => {
  const mode = farmTargetMode.value;
  const previousMode = farmConfirmed.targetMode;
  farmTargetMode.disabled = true;
  farmTargetMode.value = previousMode;
  const targetSaved = await commitFarmTargetDraft(previousMode);
  if (!targetSaved) {
    farmTargetMode.value = previousMode;
    syncFarmLevelInputs();
    farmTargetMode.disabled = false;
    syncBossTargetControls();
    farmMessage("Hoàn tất lựa chọn cảnh giới/tầng hiện tại trước khi đổi chế độ.");
    return;
  }
  farmTargetMode.value = mode;
  const patch = { targetMode: mode };
  if (["boss", "bossLevel"].includes(mode)) patch.excludeBoss = false;
  if (patch.excludeBoss === false) farmExcludeBoss.checked = false;
  const disabledBossesBefore = farmConfirmed.excludeBoss;
  await saveFarmPatch(patch, () => { farmTargetMode.value = farmConfirmed.targetMode; farmExcludeBoss.checked = farmConfirmed.excludeBoss; syncFarmLevelInputs(); }, {
    successMessage: (committed) => disabledBossesBefore && committed.excludeBoss === false
      ? "Đã tắt ‘Không chọn boss’ theo lựa chọn của bạn." : "Đã lưu cài đặt."
  });
  farmTargetMode.disabled = false;
  syncBossTargetControls();
});
farmBossFilter.addEventListener("change", async () => {
  const next = farmBossFilter.value === "world" ? "world" : "all";
  const disabledBossesBefore = farmConfirmed.excludeBoss;
  const patch = { bossFilter: next };
  if (next === "world") patch.excludeBoss = false;
  if (patch.excludeBoss === false) farmExcludeBoss.checked = false;
  syncBossTargetControls();
  await saveFarmPatch(patch, () => {
    farmBossFilter.value = farmConfirmed.bossFilter;
    farmExcludeBoss.checked = farmConfirmed.excludeBoss;
  }, { successMessage: (committed) => disabledBossesBefore && next === "world" && committed.excludeBoss === false
    ? "Đã tắt ‘Không chọn boss’ theo lựa chọn của bạn." : "Đã lưu cài đặt." });
});
for (const [input, key] of [[farmSearchScope, "searchScope"], [farmIdleMode, "idleMode"]]) {
  input.addEventListener("change", async () => {
    const value = input.value;
    const patch = key === "searchScope" ? { enabled: true, searchScope: value, ...(farmConfirmed.enabled ? {} : { radius: 11 }) } : { [key]: value };
    input.disabled = true;
    syncFarmScope();
    await saveFarmPatch(patch, () => { input.value = String(farmConfirmed[key]); syncFarmScope(); });
    input.disabled = false;
  });
}
let farmSingleCommit = null, farmRangeCommit = null, farmRadiusCommit = null, farmHpThresholdCommit = null;
function commitFarmSingle(mode = activeFarmTargetMode()) {
  if (farmSingleCommit) return farmSingleCommit;
  if (!["maxLevel", "minLevel"].includes(mode)) return Promise.resolve(true);
  const kind = mode === "minLevel" ? "min" : "max", row = farmTargetRows.single;
  row.error.textContent = "";
  const value = farmSelectionValue(row, kind);
  if (value === null) {
    farmDraftError = true;
    row.error.textContent = "Chọn đủ cảnh giới và tầng từ 1 đến 10.";
    farmFeedback.textContent = row.error.textContent;
    return Promise.resolve(false);
  }
  farmDraftError = false;
  if (value === farmConfirmed.targetLevel) return Promise.resolve(true);
  const save = (async () => {
    row.realm.disabled = row.tier.disabled = true;
    const saved = await saveFarmPatch({ targetLevel: value }, undefined, { draftWrite: true });
    syncFarmLevelInputs();
    if (!saved) {
      row.error.textContent = "Chưa lưu được lựa chọn; mức đã lưu trước đó vẫn được giữ.";
      farmFeedback.textContent = row.error.textContent;
    }
    return saved;
  })();
  farmSingleCommit = save;
  save.finally(() => { if (farmSingleCommit === save) farmSingleCommit = null; });
  return save;
}
function commitFarmRange() {
  if (farmRangeCommit) return farmRangeCommit;
  const min = farmSelectionValue(farmTargetRows.min, "min");
  const max = farmSelectionValue(farmTargetRows.max, "max");
  clearFarmTargetErrors();
  if (min === farmConfirmed.targetMinLevel && max === farmConfirmed.targetMaxLevel) {
    farmDraftError = false;
    return Promise.resolve(true);
  }
  if (min === null) {
    farmDraftError = true;
    farmTargetMinLevelError.textContent = "Chọn đủ cảnh giới và tầng tối thiểu từ 1 đến 10.";
    farmFeedback.textContent = farmTargetMinLevelError.textContent;
    return Promise.resolve(false);
  }
  if (max === null) {
    farmDraftError = true;
    farmTargetMaxLevelError.textContent = "Chọn đủ cảnh giới và tầng tối đa từ 1 đến 10.";
    farmFeedback.textContent = farmTargetMaxLevelError.textContent;
    return Promise.resolve(false);
  }
  if (min > max) {
    farmDraftError = true;
    farmTargetMaxLevelError.textContent = "Cảnh giới/tầng tối đa phải bằng hoặc cao hơn tối thiểu.";
    farmFeedback.textContent = farmTargetMaxLevelError.textContent;
    return Promise.resolve(false);
  }
  farmDraftError = false;
  const save = (async () => {
    for (const name of ["min", "max"]) farmTargetRows[name].realm.disabled = farmTargetRows[name].tier.disabled = true;
    const saved = await saveFarmPatch({ targetMinLevel: min, targetMaxLevel: max }, undefined, { draftWrite: true });
    syncFarmLevelInputs();
    if (!saved) {
      farmTargetMaxLevelError.textContent = "Chưa lưu được khoảng cảnh giới; mức đã lưu trước đó vẫn được giữ.";
      farmFeedback.textContent = farmTargetMaxLevelError.textContent;
    }
    return saved;
  })();
  farmRangeCommit = save;
  save.finally(() => { if (farmRangeCommit === save) farmRangeCommit = null; });
  return save;
}
function commitFarmTargetDraft(mode = activeFarmTargetMode()) {
  if (["maxLevel", "minLevel"].includes(mode)) return commitFarmSingle(mode);
  return mode === "range" ? commitFarmRange() : Promise.resolve(true);
}
for (const [name, row] of Object.entries(farmTargetRows)) {
  row.realm.addEventListener("change", () => {
    const key = name === "single" ? "targetLevel" : name === "min" ? "targetMinLevel" : "targetMaxLevel";
    row.realm.dataset.legacyValue = String(farmConfirmed[key]);
    fillFarmTiers(row);
    row.tier.value = "";
    row.tier.disabled = row.realm.value === "legacy" || row.realm.disabled;
    if (row.realm.value !== "legacy") {
      farmDraftError = true;
      row.error.textContent = "Chọn tầng để hoàn tất lựa chọn cảnh giới.";
      farmFeedback.textContent = row.error.textContent;
    } else void (name === "single" ? commitFarmSingle() : commitFarmRange());
    syncFarmLevelInputs();
  });
  row.tier.addEventListener("change", () => {
    if (name === "single") void commitFarmSingle();
    else void commitFarmRange();
  });
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
    const saved = await saveFarmPatch({ enabled: true, radius: value }, undefined, { draftWrite: true });
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
function commitFarmHpThresholds() {
  if (farmHpThresholdCommit) {
    if (farmHpThresholdFollowupCount < 2) farmHpThresholdFollowupRequested = true;
    return farmHpThresholdCommit;
  }
  const draft = farmHpThresholdDraft();
  if (!draft.valid) {
    farmRetreatThresholdError.textContent = draft.error;
    farmFeedback.textContent = draft.error;
    return Promise.resolve(false);
  }
  farmRetreatThresholdError.textContent = "";
  if (!draft.dirty) return Promise.resolve(true);
  const revision = farmHpEditRevision;
  const pair = { retreatHpPercent: draft.retreat, recoveryHpPercent: draft.recovery };
  const operation = { revision, pair };
  farmHpThresholdOperation = operation;
  const rollback = () => {
    if (farmHpEditRevision !== revision) return;
    farmHpSyncedEditRevision = revision;
    farmRetreatHpPercent.value = String(farmConfirmed.retreatHpPercent);
    farmRecoveryHpPercent.value = String(farmConfirmed.recoveryHpPercent);
  };
  const save = saveFarmPatch(pair, rollback, { draftWrite: true, preserveDraftKeys: Object.keys(pair) })
    .then((saved) => {
      if (farmHpThresholdOperation === operation) farmHpThresholdOperation = null;
      if (saved && farmHpEditRevision === revision) {
        farmHpSyncedEditRevision = revision;
        syncFarmPreferences(latestFarmPreferences ?? farmConfirmed, { forceKeys: Object.keys(pair) });
      }
      if (!saved) farmRetreatThresholdError.textContent = "Chưa lưu được cặp ngưỡng HP; cài đặt đã lưu trước đó được giữ.";
      if (farmHpThresholdFollowupRequested && farmHpThresholdFollowupCount < 2
          && farmConfirmed.policyMode === "extended") {
        farmHpThresholdFollowupRequested = false;
        farmHpThresholdFollowupCount++;
        farmHpThresholdCommit = null;
        return commitFarmHpThresholds();
      }
      return saved;
    });
  farmHpThresholdCommit = save;
  save.finally(() => {
    if (farmHpThresholdCommit === save) farmHpThresholdCommit = null;
    if (!farmHpThresholdCommit) {
      farmHpThresholdFollowupCount = 0;
      farmHpThresholdFollowupRequested = false;
    }
  });
  return save;
}
for (const input of [farmRetreatHpPercent, farmRecoveryHpPercent]) {
  input.addEventListener("input", () => {
    farmHpEditRevision++;
    if (farmHpThresholdCommit && farmHpThresholdFollowupCount < 2
        && farmConfirmed.policyMode === "extended") farmHpThresholdFollowupRequested = true;
    farmRetreatThresholdError.textContent = "";
  });
  input.addEventListener("blur", (event) => {
    if (farmConfirmed.policyMode !== "extended" || selectingFarmPolicy
        || event.relatedTarget === farmPolicyMode || document.activeElement === farmPolicyMode) return;
    void commitFarmHpThresholds();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault(); void commitFarmHpThresholds();
  });
}
farmRadius.addEventListener("input", () => {
  farmRadiusError.textContent = "";
  farmMessage("Bản nháp chưa lưu.");
});
farmRadius.addEventListener("blur", (event) => {
  if (farmConfirmed.policyMode !== "extended" || selectingFarmPolicy
      || event.relatedTarget === farmPolicyMode || document.activeElement === farmPolicyMode) return;
  void commitFarmRadius();
});
farmRadius.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  void commitFarmRadius();
});
async function flushFarmNumericDrafts({ discardInactiveDrafts = false } = {}) {
  if (!farmSyncReady) return { saved: false, reason: "load" };
  const writesAtRequest = [...farmWrites.entries()];
  if (farmPolicyPending > 0) await new Promise((resolve) => farmPolicyWaiters.push(resolve));
  const startedWrites = [...new Map([...writesAtRequest, ...farmWrites.entries()]).entries()];
  const pending = [];
  const active = farmConfirmed.policyMode === "extended";
  const mode = activeFarmTargetMode(), targetDraft = farmLevelDraft();
  if (farmSingleCommit) pending.push(farmSingleCommit);
  else if (active && ["maxLevel", "minLevel"].includes(mode) && targetDraft.dirty) pending.push(commitFarmSingle(mode));
  if (farmRangeCommit) pending.push(farmRangeCommit);
  else if (active && mode === "range" && targetDraft.dirty)
    pending.push(commitFarmRange());
  if (farmRadiusCommit) pending.push(farmRadiusCommit);
  else if (active && farmRadius.value !== String(farmConfirmed.radius)) pending.push(commitFarmRadius());
  if (farmHpThresholdCommit) pending.push(farmHpThresholdCommit);
  else if (active && farmHpThresholdDraft().dirty) pending.push(commitFarmHpThresholds());
  let results = await Promise.all(pending);
  if (active) {
    // A write may finish while the user is still editing. Drain a small,
    // bounded number of latest complete pairs; leave any newer draft visible.
    for (let attempt = 0; attempt < 3 && farmHpThresholdDraft().dirty; attempt++) {
      if (farmConfirmed.policyMode !== "extended") break;
      if (!farmHpThresholdDraft().valid) break;
      results = [...results, await commitFarmHpThresholds()];
    }
  }
  if (active && farmConfirmed.policyMode !== "extended")
    return { saved: false, reason: "policy-changed" };
  const writes = new Map([...startedWrites, ...farmWrites.entries()]);
  const writeEntries = [...writes.entries()];
  const writeResults = await Promise.allSettled(writeEntries.map(([promise]) => promise));
  const failedWrites = writeResults.flatMap((result, index) => result.status === "rejected"
    ? [{ draftWrite: writeEntries[index][1] }] : []);
  const failedDraftWrite = failedWrites.some((write) => write.draftWrite);
  const failedOtherWrite = failedWrites.some((write) => !write.draftWrite);
  if (!active) {
    if (discardInactiveDrafts) {
      // Re-check in case a newer confirmed policy arrived while writes settled.
      if (farmConfirmed.policyMode === "extended") return { saved: false, reason: "policy-changed" };
      if (failedOtherWrite) return { saved: false, reason: "persistence" };
      if (farmHasDraft()) {
        farmHpSyncedEditRevision = farmHpEditRevision;
        syncFarmPreferences(latestFarmPreferences ?? farmConfirmed, { preserveDraft: false });
      }
      else if (failedDraftWrite || !results.every(Boolean)) return { saved: false, reason: "persistence" };
      return { saved: true };
    }
    if (failedOtherWrite) return { saved: false, reason: "persistence" };
    if (farmHasDraft()) return { saved: false, reason: "inactive-draft", writeFailed: failedDraftWrite || !results.every(Boolean) };
    return !failedDraftWrite && results.every(Boolean) ? { saved: true } : { saved: false, reason: "persistence" };
  }
  if (!farmHpThresholdDraft().valid)
    return { saved: false, reason: "invalid", field: "retreatHpPercent" };
  if (farmHpThresholdDraft().dirty)
    return { saved: false, reason: "persistence" };
  if (failedWrites.length || !results.every(Boolean)) return { saved: false, reason: "persistence" };
  if (!farmRadius.value.trim() || !farmRadius.checkValidity()
      || !Number.isSafeInteger(farmRadius.valueAsNumber) || farmRadius.valueAsNumber < 1 || farmRadius.valueAsNumber > 1000)
    return { saved: false, reason: "invalid", field: "radius" };
  if (farmDraftError) return { saved: false, reason: "invalid", field: mode === "range" ? "min" : "target" };
  const saved = !farmLevelDraft().dirty && farmRadius.value === String(farmConfirmed.radius);
  return saved ? { saved: true } : { saved: false, reason: "persistence" };
}
const trustedGameOrigin = "https://nghichthienky.online";
window.addEventListener("message", async (event) => {
  if (window.top === window || event.source !== window.parent || event.origin !== trustedGameOrigin
      || event.data?.channel !== "gst:menu-before-close:v1"
      || !Number.isSafeInteger(event.data.id) || event.data.id <= 0) return;
  let result;
  try {
    result = await flushFarmNumericDrafts({ discardInactiveDrafts: event.data.discardInactiveFarmDrafts === true });
    if (result.saved) {
      const meditation = await globalThis.GSTMeditationPopup?.flushPendingSave?.();
      if (meditation?.saved === false) result = { saved: false, reason: "persistence" };
    }
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
chrome.storage.local.get(["preferences", "displayPreferences", "fontPreferences", "farmPreferences",
  GSTAccountProfiles.profilesKey, "farmShortcut", "areaMapOptions"]).then(async ({ preferences, displayPreferences, fontPreferences, farmPreferences, farmShortcut, areaMapOptions, [GSTAccountProfiles.profilesKey]: accountProfiles }) => {
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
  await accountContextPromise;
  const context = popupAccountContext;
  const storedFarmPreferences = { farmPreferences, [GSTAccountProfiles.profilesKey]: accountProfiles };
  const initialFarmPreferences = farmLoadRevision === farmStorageRevision
    ? popupAccountBindingRequired && context?.verified !== true ? {}
      : GSTAccountProfiles.currentProfile(context, "farm", storedFarmPreferences)
    : (latestFarmPreferences ?? {});
  const farmPreferencesWithPolicy = globalThis.GSTFarmPolicy.withMode(initialFarmPreferences,
    globalThis.GSTFarmPolicy.read(initialFarmPreferences));
  syncFarmPreferences(farmPreferencesWithPolicy, { preserveDraft: false });
  breakSeals.disabled = false;
  latestFarmPreferences = farmPreferencesWithPolicy;
  farmSyncReady = true;
  farmPolicyLoaded = true;
  syncFarmPolicyUI(farmPreferencesWithPolicy);
  farmPolicyFeedback.textContent = "";
  const accountAllowed = !context || context.verified === true;
  const migrationNeeded = accountAllowed && (initialFarmPreferences.excludeBoss && ["boss", "bossLevel"].includes(normalizeFarmTargetMode(initialFarmPreferences.targetMode))
    || ["bossFirst", "level"].includes(initialFarmPreferences.targetMode));
  if (migrationNeeded) {
    const migrationPolicyRevision = farmPolicyRequestRevision;
    updateFarmPreferences({}).then(async (committed) => {
      let current = committed;
      const revisionAtRead = farmStorageRevision;
      try { current = await readCurrentFarmPreferences() ?? committed; } catch {}
      if (farmPolicyRequestRevision !== migrationPolicyRevision) return;
      if (farmStorageRevision !== revisionAtRead && latestFarmPreferences) current = latestFarmPreferences;
      latestFarmPreferences = current;
      syncFarmPreferences(current);
    }).catch(() => { farmFeedback.textContent = "Chưa đồng bộ được bộ lọc boss; hãy lưu lại."; });
  }
  const shortcutCode = farmShortcut?.code;
  if (Number.isInteger(shortcutCode) && ((shortcutCode >= 48 && shortcutCode <= 57)
      || (shortcutCode >= 65 && shortcutCode <= 90) || (shortcutCode >= 112 && shortcutCode <= 121 && shortcutCode !== 116))) {
    shortcutLabel.textContent = `Phím tùy chỉnh: ${shortcutCode >= 112 ? `F${shortcutCode - 111}` : String.fromCharCode(shortcutCode)}`;
  }
  document.getElementById("farmShortcutSummary").textContent = `Phím tắt · ${shortcutLabel.textContent}`;
  refresh();
}).catch(() => {
  statusText.textContent = "Chưa đọc được cài đặt. Hãy mở lại popup.";
  farmPolicySavedMode.textContent = "Không đọc được chế độ Auto Farm đã lưu.";
  farmPolicyFeedback.textContent = "Bộ chọn đang khóa để tránh ghi đè cài đặt chưa đọc được. Hãy mở lại cửa sổ cài đặt để thử lại.";
  farmPolicyMode.disabled = true;
  farmPolicyRuntimeStatus.textContent = "Auto Farm gốc trong tab đang mở: chưa rõ.";
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
