"use strict";

const accountsKey = "gstAccounts:v1";
const attemptsKey = "gstAccountAttempts:v1";
const origin = "https://nghichthienky.online";
const tabAttempts = new Map();
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readAccounts() {
  const saved = await chrome.storage.local.get(accountsKey);
  return Array.isArray(saved[accountsKey]) ? saved[accountsKey] : [];
}
async function getAccount(accountId) {
  return (await readAccounts()).find((item) => item?.id === accountId) ?? null;
}
async function attempts() {
  const value = await chrome.storage.session.get(attemptsKey);
  const records = value[attemptsKey] && typeof value[attemptsKey] === "object" ? value[attemptsKey] : {};
  const now = Date.now();
  for (const [tabId, record] of Object.entries(records)) {
    if (!record || record.deadline < now) {
      delete records[tabId];
      tabAttempts.delete(Number(tabId));
    }
  }
  return records;
}
async function setAttempt(tabId, attempt) {
  const value = await attempts();
  value[String(tabId)] = attempt;
  await chrome.storage.session.set({ [attemptsKey]: value });
}
async function clearAttempt(tabId) {
  const value = await attempts();
  delete value[String(tabId)];
  await chrome.storage.session.set({ [attemptsKey]: value });
  tabAttempts.delete(tabId);
}
async function readTabContext(tabId) {
  try { return await chrome.tabs.sendMessage(tabId, { type: "gst:account-context" }); }
  catch { return null; }
}
async function waitForContent(tabId, timeoutMs = 30000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    try {
      await chrome.tabs.get(tabId);
      const context = await readTabContext(tabId);
      if (context?.launchUrl || context?.reason === "native_login_required") return true;
    } catch { return false; }
    await sleep(300);
  }
  return false;
}
function buildTargetUrl(base, account, attemptId) {
  let url;
  try { url = new URL(base); } catch { url = new URL(origin + "/?online=1&timer"); }
  if (url.origin !== origin) url = new URL(origin + "/?online=1&timer");
  url.username = ""; url.password = ""; url.hash = "";
  for (const key of [...url.searchParams.keys()])
    if (/(user|login|pass(word)?|token|auth|credential|email|secret)/i.test(key)) url.searchParams.delete(key);
  url.searchParams.set("online", "1");
  url.searchParams.set("timer", "");
  url.searchParams.set("slot", account.slot);
  url.searchParams.set("gstAttempt", attemptId);
  return url.href;
}
async function launch(message) {
  if (!crypto.randomUUID || !["current", "additional"].includes(message.mode))
    return { accepted: false, reason: "launcher_unavailable" };
  const account = await getAccount(message.accountId);
  if (!account || typeof account.slot !== "string" || !account.slot
      || typeof account.username !== "string" || !account.username
      || typeof account.password !== "string" || !account.password)
    return { accepted: false, reason: "account_not_found" };
  const [active] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const source = active?.id ? await readTabContext(active.id) : null;
  if (message.mode === "current") {
    if (!active?.id || !source?.launchUrl || source.offline) return { accepted: false, reason: "open_game_tab_first" };
    if (source.verified && source.accountId === account.id)
      return { accepted: true, reused: true, character: source.character };
    if (tabAttempts.has(active.id)) return { accepted: false, reason: "attempt_already_active" };
    let stopped;
    try { stopped = await chrome.tabs.sendMessage(active.id, { type: "gst:account-stop" }); }
    catch { return { accepted: false, reason: "automation_stop_unconfirmed" }; }
    if (stopped?.ready !== true || stopped.autoOn !== false)
      return { accepted: false, reason: stopped?.reason ?? "automation_stop_unconfirmed" };
  }

  const attemptId = crypto.randomUUID();
  let targetTabId = message.mode === "current" ? active.id : null;
  if (message.mode === "additional") {
    try { targetTabId = (await chrome.tabs.create({ url: "about:blank", active: true }))?.id; }
    catch { return { accepted: false, reason: "tab_open_failed" }; }
  }
  if (!Number.isInteger(targetTabId)) return { accepted: false, reason: "tab_open_failed" };
  if (tabAttempts.has(targetTabId))
    return { accepted: false, reason: "attempt_already_active" };
  tabAttempts.set(targetTabId, attemptId);
  try {
    if ((await attempts())[String(targetTabId)]) {
      tabAttempts.delete(targetTabId);
      return { accepted: false, reason: "attempt_already_active" };
    }
  } catch {
    tabAttempts.delete(targetTabId);
    return { accepted: false, reason: "attempt_storage_unavailable" };
  }
  const record = { attemptId, accountId: account.id, slot: account.slot, deadline: Date.now() + 120000 };
  try {
    await setAttempt(targetTabId, record);
    const base = source?.launchUrl || origin + "/?online=1&timer";
    await chrome.tabs.update(targetTabId, { url: buildTargetUrl(base, account, attemptId) });
  } catch {
    await clearAttempt(targetTabId);
    return { accepted: false, reason: "tab_navigation_failed" };
  }

  const ready = await waitForContent(targetTabId);
  if (!ready) { await clearAttempt(targetTabId); return { accepted: false, reason: "tab_load_timeout" }; }
  try {
    const result = await chrome.tabs.sendMessage(targetTabId, {
      type: "gst:account-attempt", attemptId, accountId: account.id, slot: account.slot
    });
    if (result?.accepted !== true) {
      await clearAttempt(targetTabId);
      return { accepted: false, reason: result?.reason ?? "native_login_failed" };
    }
    if (result.reused) {
      await clearAttempt(targetTabId);
      return { accepted: true, reused: true, character: result.character };
    }
    return { accepted: true, submitted: result.submitted === true, tabId: targetTabId };
  } catch {
    await clearAttempt(targetTabId);
    return { accepted: false, reason: "target_tab_unavailable" };
  }
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id) return;
  if (message?.type === "gst:account-launch") {
    launch(message).then(respond).catch(() => respond({ accepted: false, reason: "launcher_failed" }));
    return true;
  }
  if (message?.type === "gst:account-confirm") {
    (async () => {
      const tabId = sender.tab?.id;
      if (!Number.isInteger(tabId) || typeof message.slot !== "string" || !message.slot
          || typeof message.attemptId !== "string" || typeof message.accountId !== "string")
        return { accepted: false, reason: "attempt_context_missing" };
      const record = (await attempts())[String(tabId)];
      if (!record || record.attemptId !== message.attemptId || record.accountId !== message.accountId
          || record.slot !== message.slot || record.deadline < Date.now())
        return { accepted: false, reason: "attempt_expired" };
      if (typeof message.character !== "string" || !message.character.trim())
        return { accepted: false, reason: "identity_unconfirmed" };
      await navigator.locks.request("gst:accounts:v1", async () => {
        const rows = await readAccounts();
        const index = rows.findIndex((item) => item?.id === record.accountId && item.slot === record.slot);
        if (index < 0) throw new Error("Account changed.");
        const account = rows[index];
        if ((account.expectedCharacter && account.expectedCharacter !== message.character)
            || (account.expectedClassId && account.expectedClassId !== message.classId)
            || (account.expectedCharacterId && account.expectedCharacterId !== message.characterId))
          throw new Error("Identity changed.");
        rows[index] = { ...account, expectedCharacter: message.character,
          expectedClassId: typeof message.classId === "string" ? message.classId : "",
          expectedCharacterId: typeof message.characterId === "string" ? message.characterId : "" };
        await chrome.storage.local.set({ [accountsKey]: rows });
      });
      await clearAttempt(tabId);
      return { accepted: true };
    })().then(respond).catch(async () => {
      if (Number.isInteger(sender.tab?.id)) await clearAttempt(sender.tab.id);
      respond({ accepted: false, reason: "identity_save_failed" });
    });
    return true;
  }
  if (message?.type === "gst:account-attempt-failed") {
    (async () => {
      const tabId = sender.tab?.id;
      if (!Number.isInteger(tabId)) return { accepted: false };
      const record = (await attempts())[String(tabId)];
      if (!record || record.attemptId !== message.attemptId || record.accountId !== message.accountId
          || record.slot !== message.slot) {
        tabAttempts.delete(tabId);
        return { accepted: false };
      }
      await clearAttempt(tabId);
      return { accepted: true };
    })().then(respond).catch(() => respond({ accepted: false }));
    return true;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => { void clearAttempt(tabId).catch(() => {}); });
