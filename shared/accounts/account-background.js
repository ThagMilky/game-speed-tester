"use strict";

const accountsKey = "gstAccounts:v1";
const attemptsKey = "gstAccountAttempts:v1";
const attemptsLock = "gst:account-attempts:v1";
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
async function updateAttempts(update) {
  return navigator.locks.request(attemptsLock, async () => {
    const value = await chrome.storage.session.get(attemptsKey);
    const records = value[attemptsKey] && typeof value[attemptsKey] === "object"
      ? { ...value[attemptsKey] } : {};
    const mapChanges = [];
    const now = Date.now();
    for (const [key, record] of Object.entries(records)) {
      if (!record || !Number.isFinite(record.deadline) || record.deadline < now) {
        delete records[key];
        const tabId = Number(key);
        const expiredId = typeof record?.attemptId === "string" ? record.attemptId : tabAttempts.get(tabId);
        if (expiredId) mapChanges.push({ tabId, attemptId: expiredId, remove: true });
      }
    }
    const result = await update(records, mapChanges);
    await chrome.storage.session.set({ [attemptsKey]: records });
    for (const change of mapChanges) {
      if (change.remove) {
        if (tabAttempts.get(change.tabId) === change.attemptId) tabAttempts.delete(change.tabId);
      } else tabAttempts.set(change.tabId, change.attemptId);
    }
    return result;
  });
}
function getAttempt(tabId) {
  return updateAttempts((records) => {
    const record = records[String(tabId)];
    return record ? { ...record } : null;
  });
}
function createAttempt(tabId, attempt) {
  return updateAttempts((records, mapChanges) => {
    const key = String(tabId);
    if (records[key]) return false;
    records[key] = attempt;
    mapChanges.push({ tabId, attemptId: attempt.attemptId, remove: false });
    return true;
  });
}
function clearAttempt(tabId, expectedAttemptId) {
  if (typeof expectedAttemptId !== "string" || !expectedAttemptId) return Promise.resolve(false);
  return updateAttempts((records, mapChanges) => {
    const key = String(tabId), record = records[key];
    if (record?.attemptId !== expectedAttemptId) return false;
    delete records[key];
    mapChanges.push({ tabId, attemptId: expectedAttemptId, remove: true });
    return true;
  });
}
async function clearRemovedTabAttempt(tabId, expectedAttemptId) {
  const observedId = expectedAttemptId || (await getAttempt(tabId))?.attemptId;
  if (observedId) await clearAttempt(tabId, observedId);
}
async function recoveryAttempt(tabId, attemptId, accountId, slot, markLogout = false) {
  if (!Number.isInteger(tabId) || typeof attemptId !== "string" || !attemptId
      || typeof accountId !== "string" || !accountId || typeof slot !== "string" || !slot) return null;
  return updateAttempts((records) => {
    const record = records[String(tabId)];
    if (!record || record.attemptId !== attemptId || record.accountId !== accountId || record.slot !== slot
        || record.deadline < Date.now()) return null;
    if (markLogout) {
      if ((record.logoutAttempts ?? 0) >= 1) return null;
      record.logoutAttempts = (record.logoutAttempts ?? 0) + 1;
      record.recoveryRequested = true;
    } else if (record.recoveryRequested !== true) return null;
    return { ...record };
  });
}
async function readTabContext(tabId) {
  try { return await chrome.tabs.sendMessage(tabId, { type: "gst:account-context" }); }
  catch { return null; }
}
async function waitForContent(tabId, expected, timeoutMs = 30000) {
  const until = Date.now() + timeoutMs;
  while (Date.now() < until) {
    try {
      await chrome.tabs.get(tabId);
      const context = await readTabContext(tabId);
      // tabs.update() may resolve while the old document still answers messages.
      // A bridge response is ready only when it belongs to this navigation.
      if (context?.slot === expected.slot && context.launchAttemptId === expected.attemptId
          && (context.launchUrl || context.reason === "native_login_required")) return true;
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
function senderMatchesAttempt(sender, record) {
  try {
    const url = new URL(sender.url);
    return url.origin === origin && url.searchParams.get("slot") === record.slot
      && url.searchParams.get("gstAttempt") === record.attemptId;
  } catch { return false; }
}
async function launch(message, automaticTabId = null) {
  if (!crypto.randomUUID || !["current", "additional"].includes(message.mode))
    return { accepted: false, reason: "launcher_unavailable" };
  const account = await getAccount(message.accountId);
  if (!account || typeof account.slot !== "string" || !account.slot
      || typeof account.username !== "string" || !account.username
      || typeof account.password !== "string" || !account.password)
    return { accepted: false, reason: "account_not_found" };
  const [active] = automaticTabId !== null ? [{ id: automaticTabId }]
    : await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  const source = active?.id ? await readTabContext(active.id) : null;
  if (message.mode === "current") {
    if (!active?.id || !source?.launchUrl || source.offline) return { accepted: false, reason: "open_game_tab_first" };
    if (source.verified && source.accountId === account.id) {
      await chrome.storage.local.set({ gstLastAccountId: account.id });
      return { accepted: true, reused: true, character: source.character };
    }
    if (automaticTabId !== null && (!source.defaultLoginEligible || source.connected || source.autoOn))
      return { accepted: false, reason: "automatic_login_skipped" };
    if (tabAttempts.has(active.id)) return { accepted: false, reason: "attempt_already_active" };
    let stopped;
    try { stopped = automaticTabId !== null ? { ready: true, autoOn: false }
      : await chrome.tabs.sendMessage(active.id, { type: "gst:account-stop" }); }
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
  const record = { attemptId, accountId: account.id, slot: account.slot, deadline: Date.now() + 120000 };
  try {
    if (!await createAttempt(targetTabId, record)) {
      return { accepted: false, reason: "attempt_already_active" };
    }
    const base = source?.launchUrl || origin + "/?online=1&timer";
    if (automaticTabId !== null) {
      const latest = await readTabContext(targetTabId);
      if (!latest?.defaultLoginEligible || latest.connected || latest.autoOn) {
        await clearAttempt(targetTabId, attemptId);
        return { accepted: false, reason: "automatic_login_skipped" };
      }
    }
    await chrome.tabs.update(targetTabId, { url: buildTargetUrl(base, account, attemptId) });
  } catch {
    await clearAttempt(targetTabId, attemptId);
    return { accepted: false, reason: "tab_navigation_failed" };
  }

  const ready = await waitForContent(targetTabId, record);
  if (!ready) { await clearAttempt(targetTabId, attemptId); return { accepted: false, reason: "tab_load_timeout" }; }
  try {
    const result = await chrome.tabs.sendMessage(targetTabId, {
      type: "gst:account-attempt", attemptId, accountId: account.id, slot: account.slot,
      deadline: record.deadline
    });
    if (result?.accepted !== true) {
      await clearAttempt(targetTabId, attemptId);
      return { accepted: false, reason: result?.reason ?? "native_login_failed" };
    }
    if (result.reused) {
      await chrome.storage.local.set({ gstLastAccountId: account.id });
      await clearAttempt(targetTabId, attemptId);
      return { accepted: true, reused: true, character: result.character };
    }
    return { accepted: true, submitted: result.submitted === true,
      recoveryStarted: result.recoveryStarted === true, tabId: targetTabId };
  } catch {
    const record = await getAttempt(targetTabId).catch(() => null);
    if (record?.attemptId === attemptId && record.recoveryRequested === true && record.deadline > Date.now())
      return { accepted: true, recoveryStarted: true, tabId: targetTabId };
    await clearAttempt(targetTabId, attemptId);
    return { accepted: false, reason: "target_tab_unavailable" };
  }
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (sender.id !== chrome.runtime.id) return;
  if (message?.type === "gst:account-auto-login") {
    (async () => {
      const url = new URL(sender.url);
      if (!Number.isInteger(sender.tab?.id) || sender.frameId !== 0 || url.origin !== origin
          || !["/", "/index.html"].includes(url.pathname)
          || url.searchParams.has("slot") || url.searchParams.has("gstAttempt")
          || url.searchParams.has("map") || url.searchParams.has("at") || url.searchParams.get("online") === "0")
        return { accepted: false, reason: "automatic_login_skipped" };
      const saved = await chrome.storage.local.get(["gstAutoLogin", "gstLastAccountId"]);
      const preferences = saved.gstAutoLogin;
      const accountId = preferences?.mode === "account" ? preferences.accountId
        : preferences?.mode === "last" ? saved.gstLastAccountId : "";
      if (typeof accountId !== "string" || !accountId) return { accepted: false, reason: "automatic_login_skipped" };
      return launch({ mode: "current", accountId }, sender.tab.id);
    })().then(respond).catch(() => respond({ accepted: false, reason: "automatic_login_failed" }));
    return true;
  }
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
      const record = await getAttempt(tabId);
      if (!record || record.attemptId !== message.attemptId || record.accountId !== message.accountId
          || record.slot !== message.slot || record.deadline < Date.now())
        return { accepted: false, reason: "attempt_expired" };
      if (typeof message.character !== "string" || !message.character.trim())
        return { accepted: false, reason: "identity_unconfirmed" };
      const update = await navigator.locks.request("gst:accounts:v1", async () => {
        const rows = await readAccounts();
        const index = rows.findIndex((item) => item?.id === record.accountId && item.slot === record.slot);
        if (index < 0) throw new Error("Account changed.");
        const account = rows[index];
        if ((account.expectedCharacter && account.expectedCharacter !== message.character)
            || (account.expectedClassId && account.expectedClassId !== message.classId)
            || (account.expectedCharacterId && account.expectedCharacterId !== message.characterId))
          return { conflict: true };
        rows[index] = { ...account, expectedCharacter: message.character,
          expectedClassId: typeof message.classId === "string" ? message.classId : "",
          expectedCharacterId: typeof message.characterId === "string" ? message.characterId : "" };
        await chrome.storage.local.set({ [accountsKey]: rows });
        return { conflict: false };
      });
      if (update.conflict) {
        await clearAttempt(tabId, record.attemptId);
        return { accepted: false, reason: "saved_identity_conflict" };
      }
      await clearAttempt(tabId, record.attemptId);
      await chrome.storage.local.set({ gstLastAccountId: record.accountId });
      return { accepted: true };
    })().then(respond).catch(async () => {
      if (Number.isInteger(sender.tab?.id) && typeof message.attemptId === "string")
        await clearAttempt(sender.tab.id, message.attemptId);
      respond({ accepted: false, reason: "identity_save_failed" });
    });
    return true;
  }
  if (message?.type === "gst:account-attempt-recovery") {
    (async () => {
      const tabId = sender.tab?.id;
      if (!senderMatchesAttempt(sender, { attemptId: message.attemptId, slot: message.slot }))
        return { accepted: false, reason: "attempt_expired" };
      const record = await recoveryAttempt(tabId, message.attemptId, message.accountId, message.slot, true);
      return record
        ? { accepted: true, deadline: record.deadline }
        : { accepted: false, reason: "attempt_expired" };
    })().then(respond).catch(() => respond({ accepted: false, reason: "attempt_expired" }));
    return true;
  }
  if (message?.type === "gst:account-attempt-resume") {
    (async () => {
      const tabId = sender.tab?.id;
      if (!senderMatchesAttempt(sender, { attemptId: message.attemptId, slot: message.slot }))
        return { accepted: false, reason: "attempt_url_mismatch" };
      const observed = await getAttempt(tabId);
      if (!observed) return { accepted: false, reason: "attempt_record_missing_or_expired" };
      if (observed.attemptId !== message.attemptId || observed.accountId !== message.accountId
          || observed.slot !== message.slot)
        return { accepted: false, reason: "attempt_record_mismatch" };
      if (observed?.attemptId === message.attemptId && observed.accountId === message.accountId
          && observed.slot === message.slot && observed.recoveryRequested !== true)
        return { accepted: false, reason: "recovery_not_pending" };
      const record = await recoveryAttempt(tabId, message.attemptId, message.accountId, message.slot);
      if (!record) return { accepted: false, reason: "attempt_expired" };
      const account = await getAccount(record.accountId);
      if (!account || account.slot !== record.slot) return { accepted: false, reason: "account_not_found" };
      return { accepted: true, attemptId: record.attemptId, accountId: record.accountId,
        slot: record.slot, deadline: record.deadline, logoutAttempts: record.logoutAttempts ?? 0 };
    })().then(respond).catch(() => respond({ accepted: false, reason: "attempt_expired" }));
    return true;
  }
  if (message?.type === "gst:account-attempt-failed") {
    (async () => {
      const tabId = sender.tab?.id;
      if (!Number.isInteger(tabId)) return { accepted: false };
      const record = await getAttempt(tabId);
      if (!record || record.attemptId !== message.attemptId || record.accountId !== message.accountId
          || record.slot !== message.slot) {
        return { accepted: false };
      }
      await clearAttempt(tabId, record.attemptId);
      return { accepted: true };
    })().then(respond).catch(() => respond({ accepted: false }));
    return true;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  const expectedAttemptId = tabAttempts.get(tabId) ?? "";
  void clearRemovedTabAttempt(tabId, expectedAttemptId).catch(() => {});
});
