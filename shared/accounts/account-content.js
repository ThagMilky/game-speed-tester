(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const channel = "gst:account:v1";
  const slot = new URLSearchParams(location.search).get("slot") ?? "";
  const attemptId = new URLSearchParams(location.search).get("gstAttempt") ?? "";
  const pageRequests = new Map();
  let sequence = 0, lastIdentity = "", lastProfile = "", pendingAttempt = null, attemptBusy = false;
  let currentContext = null, refreshBusy = false, lastError = "";
  const traceKey = "gst:account-login-trace:v1";
  const stages = ["page_loaded", "attempt_received", "waiting_form", "form_seen", "credentials_filled",
    "form_submitted", "logout_requested", "resume_requested", "resume_accepted", "resume_rejected",
    "login_failed", "identity_confirmed"];
  let loginTrace = [];
  try {
    const saved = JSON.parse(sessionStorage.getItem(traceKey) ?? "[]");
    if (Array.isArray(saved)) loginTrace = saved.filter((row) => stages.includes(row?.stage)
      && Number.isFinite(row.at)).slice(-19).map(({ stage, at }) => ({ stage, at }));
  } catch {}
  function trace(stage) {
    if (!stages.includes(stage)) return;
    loginTrace.push({ stage, at: Date.now() });
    loginTrace = loginTrace.slice(-20);
    try { sessionStorage.setItem(traceKey, JSON.stringify(loginTrace)); } catch {}
  }
  trace("page_loaded");
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const visible = (element) => !!element?.getClientRects?.().length;

  function pageRequest(type, timeout = 1200, details = {}) {
    const requestId = "account:" + (++sequence);
    return new Promise((resolve) => {
      const timer = setTimeout(() => { pageRequests.delete(requestId); resolve(null); }, timeout);
      pageRequests.set(requestId, (value) => { clearTimeout(timer); resolve(value); });
      window.postMessage({ channel, type, requestId, ...details }, origin);
    });
  }
  function safeLaunchUrl(value) {
    try {
      const url = new URL(value);
      if (url.origin !== origin) return "";
      url.username = ""; url.password = ""; url.hash = "";
      for (const key of [...url.searchParams.keys()])
        if (/(user|login|pass(word)?|token|auth|credential|email|secret)/i.test(key)) url.searchParams.delete(key);
      url.searchParams.delete("slot");
      url.searchParams.delete("gstAttempt");
      url.searchParams.set("online", "1");
      url.searchParams.set("timer", "");
      return url.href;
    } catch { return ""; }
  }
  async function accountForSlot() {
    if (!slot) return null;
    const accounts = await GSTAccountProfiles.readAccounts();
    return accounts.find((account) => account?.slot === slot) ?? null;
  }
  async function sendProfile(context, force = false) {
    const storage = await chrome.storage.local.get(["farmPreferences", "harvestPreferences", GSTAccountProfiles.profilesKey]);
    const key = context?.profileKey ?? "";
    const profile = key ? storage[GSTAccountProfiles.profilesKey]?.[key] : null;
    const verified = context?.verified === true;
    const farmPreferences = verified
      ? { ...(storage.farmPreferences ?? {}), ...(profile?.farm ?? {}) }
      : { ...(storage.farmPreferences ?? {}), enabled: false, autoRespawn: false, breakSeals: false };
    const harvestPreferences = verified
      ? { ...(storage.harvestPreferences ?? {}), ...(profile?.harvest ?? {}) }
      : { ...(storage.harvestPreferences ?? {}), enabled: false };
    const nextKey = (verified ? "ready" : "blocked") + ":" + key + ":"
      + JSON.stringify([storage.farmPreferences, storage.harvestPreferences, profile ?? {}]);
    if (!force && nextKey === lastProfile) return;
    lastProfile = nextKey;
    window.postMessage({ channel: "gst:account-profile:v1", type: "profile", verified,
      profileKey: verified ? key : "", farmPreferences, harvestPreferences }, origin);
    GSTAccountProfiles.setContext(context);
  }
  async function confirmFirstIdentity(snapshot, account) {
    if (!account) {
      if (pendingAttempt) await failPendingAttempt("account_not_found");
      return;
    }
    if (!pendingAttempt?.submitted || pendingAttempt.slot !== slot || pendingAttempt.accountId !== account.id
        || !snapshot?.connected || snapshot.loginVisible || snapshot.loginRejected || !snapshot.character) return;
    if ((account.expectedCharacter && snapshot.character !== account.expectedCharacter)
        || (account.expectedClassId && account.expectedClassId !== snapshot.classId)
        || (account.expectedCharacterId && account.expectedCharacterId !== snapshot.characterId)) {
      await failPendingAttempt("saved_identity_conflict");
      return;
    }
    let response;
    try {
      response = await chrome.runtime.sendMessage({ type: "gst:account-confirm", attemptId: pendingAttempt.id,
        accountId: account.id, slot, character: snapshot.character, classId: snapshot.classId,
        characterId: snapshot.characterId });
    } catch { lastError = "identity_save_failed"; return; }
    if (response?.accepted) {
      trace("identity_confirmed");
      account.expectedCharacter = snapshot.character;
      account.expectedClassId = snapshot.classId;
      account.expectedCharacterId = snapshot.characterId;
      pendingAttempt = null;
      lastError = "";
      removeAttemptFromUrl();
    } else if (response?.reason) await failPendingAttempt(response.reason);
  }
  async function failPendingAttempt(reason) {
    const pending = pendingAttempt;
    if (!pending) return;
    pendingAttempt = null;
    lastError = reason;
    trace("login_failed");
    try {
      await chrome.runtime.sendMessage({ type: "gst:account-attempt-failed",
        attemptId: pending.id, accountId: pending.accountId, slot: pending.slot });
    } catch { /* The short-lived worker record expires if the extension is unavailable. */ }
    removeAttemptFromUrl();
  }
  async function refresh(forceProfile = false) {
    if (refreshBusy) return currentContext;
    refreshBusy = true;
    try {
      const snapshot = await pageRequest("status");
      const account = await accountForSlot();
      if (pendingAttempt && Date.now() > pendingAttempt.deadline)
        await failPendingAttempt("native_login_timeout");
      if (snapshot?.loginRejected) await failPendingAttempt("native_login_rejected");
      if (snapshot?.loginVisible && pendingAttempt?.submitted) {
        const root = document.querySelector("#login");
        if (root && challengeDetected(root, root.querySelector('input[name="login"]'), root.querySelector('input[name="lpass"]')))
          await failPendingAttempt("verification_required");
      }
      if (snapshot?.connected) await confirmFirstIdentity(snapshot, account);
      let verified = false, reason = "character_unconfirmed", key = "", displayAccount = "";
      if (snapshot?.offline) reason = "offline_game";
      else if (snapshot?.connected && !snapshot.loginVisible && snapshot.character) {
        if (!slot) {
          verified = true;
          key = GSTAccountProfiles.profileKey("", snapshot.character);
          displayAccount = "Nick hiện tại";
          reason = "legacy_character_confirmed";
        } else if (!account) reason = "slot_not_managed";
        else if (account.expectedCharacter && (account.expectedCharacter !== snapshot.character
            || (account.expectedClassId && account.expectedClassId !== snapshot.classId)
            || (account.expectedCharacterId && account.expectedCharacterId !== snapshot.characterId)))
          reason = "unexpected_character";
        else if (account.expectedCharacter === snapshot.character) {
          verified = true;
          key = GSTAccountProfiles.profileKey(slot, snapshot.character);
          displayAccount = account.label;
          reason = "account_character_confirmed";
        } else {
          reason = pendingAttempt?.submitted ? "waiting_for_login_confirmation" : "first_login_required";
        }
      } else if (snapshot?.loginVisible) reason = "native_login_required";
      else if (!snapshot) reason = "game_bridge_unavailable";
      const identity = verified
        ? slot + ":" + snapshot.character + ":" + snapshot.characterId + ":" + snapshot.classId
        : "unverified:" + slot + ":" + reason;
      const context = {
        verified, profileKey: key, slot, launchAttemptId: attemptId,
        character: verified ? snapshot.character : "",
        classId: verified ? snapshot.classId : "", characterId: verified ? snapshot.characterId : "",
        accountId: verified ? account?.id ?? "" : "", accountLabel: displayAccount,
        reason,
        loginVisible: snapshot?.loginVisible === true, connected: snapshot?.connected === true,
        autoOn: snapshot?.autoOn === true, offline: snapshot?.offline === true,
        launchUrl: safeLaunchUrl(snapshot?.launchUrl), loginError: lastError,
        loginTrace: loginTrace.map(({ stage, at }) => ({ stage, at }))
      };
      currentContext = context;
      GSTAccountProfiles.setContext(context);
      if (identity !== lastIdentity || forceProfile) {
        lastIdentity = identity;
        await sendProfile(context, true);
      } else await sendProfile(context);
      return context;
    } catch {
      lastError = "account_context_unavailable";
      currentContext = { verified: false, profileKey: "", slot, reason: lastError, launchUrl: "" };
      GSTAccountProfiles.setContext(currentContext);
      await sendProfile(currentContext, true).catch(() => {});
      return currentContext;
    } finally { refreshBusy = false; }
  }
  async function refreshLatestContext() {
    while (refreshBusy) await delay(10);
    return refresh();
  }
  function removeAttemptFromUrl() {
    try {
      const url = new URL(location.href);
      url.searchParams.delete("gstAttempt");
      history.replaceState(history.state, "", url.pathname + url.search + url.hash);
    } catch { /* URL cleanup is best effort; it contains no credentials. */ }
  }
  function challengeDetected(root, user, pass) {
    const explicit = root.querySelector('[name*="captcha" i], [name*="otp" i], [name*="verify" i], [name="code"], [id*="captcha" i], [id*="otp" i]');
    if (explicit && visible(explicit)) return true;
    return [...root.querySelectorAll("input")].some((input) => visible(input)
      && input !== user && input !== pass
      && !["hidden", "checkbox", "radio", "submit", "button"].includes(input.type));
  }
  async function stopForAccountSwitch() {
    const result = await pageRequest("stop-for-switch", 3500);
    return result
      ? { ready: result.ready === true, reason: result.reason ?? "unknown", autoOn: result.autoOn }
      : { ready: false, reason: "automation_stop_unconfirmed" };
  }
  function sameTargetIdentity(snapshot, expected) {
    return snapshot?.connected === true && snapshot.slot === slot
      && snapshot.character === expected.character && snapshot.classId === expected.classId
      && snapshot.characterId === expected.characterId;
  }
  async function recoveryAttemptValid(pending) {
    try {
      const result = await chrome.runtime.sendMessage({ type: "gst:account-attempt-resume",
        attemptId: pending.id, accountId: pending.accountId, slot: pending.slot });
      return result?.accepted === true && result.attemptId === pending.id
        && result.accountId === pending.accountId && result.slot === pending.slot
        && result.deadline === pending.deadline && result.deadline > Date.now();
    } catch { return false; }
  }
  async function waitForFreshLogoutButton(previousButton, until) {
    while (Date.now() < until) {
      const panel = document.querySelector('.panel[data-title="Cài đặt"]');
      const button = panel?.querySelector("#logout-button");
      if (panel && visible(panel) && button?.isConnected && button !== previousButton
          && !button.disabled && visible(button)) return { panel, button };
      await delay(100);
    }
    return null;
  }
  async function fillNativeLogin(message) {
    if (!message || typeof message.attemptId !== "string" || message.attemptId !== attemptId
        || message.slot !== slot || typeof message.accountId !== "string")
      return { accepted: false, reason: "attempt_mismatch" };
    if (pendingAttempt?.id === message.attemptId)
      return { accepted: true, submitted: pendingAttempt.submitted, recoveryStarted: pendingAttempt.logoutRequested === true };
    if (pendingAttempt || attemptBusy) return { accepted: false, reason: "another_attempt_active" };
    const account = await accountForSlot();
    if (!account || account.id !== message.accountId) return { accepted: false, reason: "account_not_found" };
    lastError = "";
    trace("attempt_received");
    pendingAttempt = { id: message.attemptId, accountId: account.id, slot, submitted: false,
      logoutRequested: message.resume === true, deadline: Number.isFinite(message.deadline)
        ? message.deadline : Date.now() + 120000 };
    attemptBusy = true;
    try {
      return await continueNativeLogin(account, message.resume === true);
    } catch {
      await failPendingAttempt("native_login_failed");
      return { accepted: false, reason: "native_login_failed" };
    } finally { attemptBusy = false; }
  }
  async function requestNativeLogout() {
    const pending = pendingAttempt;
    if (!pending) return { accepted: false, reason: "attempt_expired" };
    let target;
    try { target = await pageRequest("status"); } catch { target = null; }
    if (!target?.connected || target.slot !== slot || !target.character) {
      await failPendingAttempt("account_context_unavailable");
      return { accepted: false, reason: "account_context_unavailable" };
    }
    pending.identity = { character: target.character, classId: target.classId, characterId: target.characterId };
    let stopped;
    try { stopped = await stopForAccountSwitch(); } catch { stopped = null; }
    if (stopped?.ready !== true || stopped.autoOn !== false) {
      const reason = stopped?.reason || "automation_stop_unconfirmed";
      await failPendingAttempt(reason);
      return { accepted: false, reason };
    }
    let marked;
    try {
      marked = await chrome.runtime.sendMessage({ type: "gst:account-attempt-recovery",
        attemptId: pending.id, accountId: pending.accountId, slot: pending.slot });
    } catch { marked = null; }
    if (marked?.accepted !== true) {
      await failPendingAttempt(marked?.reason || "attempt_expired");
      return { accepted: false, reason: marked?.reason || "attempt_expired" };
    }
    pending.logoutRequested = true;
    pending.deadline = marked.deadline;
    const previousButton = document.querySelector('.panel[data-title="Cài đặt"] #logout-button');
    let opened;
    try {
      opened = await pageRequest("open-settings-for-logout", 1500, {
        attemptId: pending.id, slot: pending.slot, identity: pending.identity
      });
    } catch { opened = null; }
    if (opened?.ready !== true || opened.settingsOpen !== true) {
      await failPendingAttempt(opened?.reason || "native_settings_unavailable");
      return { accepted: false, reason: opened?.reason || "native_settings_unavailable" };
    }
    const buttonResult = await waitForFreshLogoutButton(previousButton, Math.min(Date.now() + 2500, pending.deadline));
    if (!buttonResult) {
      const panel = document.querySelector('.panel[data-title="Cài đặt"]');
      const reason = panel && visible(panel) ? "native_logout_unavailable" : "native_settings_unavailable";
      await failPendingAttempt(reason);
      return { accepted: false, reason };
    }
    const latest = await pageRequest("status");
    const stoppedAgain = await stopForAccountSwitch();
    const identityStillMatches = sameTargetIdentity(latest, pending.identity);
    const shutdownConfirmed = stoppedAgain?.ready === true && stoppedAgain.autoOn === false;
    const attemptStillValid = await recoveryAttemptValid(pending);
    if (!identityStillMatches || !shutdownConfirmed || !attemptStillValid) {
      const reason = !identityStillMatches ? "identity_changed_during_recovery"
        : !shutdownConfirmed ? stoppedAgain?.reason || "automation_stop_unconfirmed" : "attempt_expired";
      await failPendingAttempt(reason);
      return { accepted: false, reason };
    }
    const currentPanel = document.querySelector('.panel[data-title="Cài đặt"]');
    const logout = currentPanel?.querySelector("#logout-button");
    if (currentPanel !== buttonResult.panel || !visible(currentPanel) || logout !== buttonResult.button
        || !logout?.isConnected || logout.disabled || !visible(logout)) {
      await failPendingAttempt("native_logout_unavailable");
      return { accepted: false, reason: "native_logout_unavailable" };
    }
    trace("logout_requested");
    logout.click();
    return { accepted: true, recoveryStarted: true };
  }
  async function continueNativeLogin(account, resumed = false) {
    trace("waiting_form");
    let status = await refresh();
    if (status?.verified && status.accountId === account.id) {
      pendingAttempt = null;
      removeAttemptFromUrl();
      return { accepted: true, reused: true, character: status.character };
    }
    if (status?.connected) {
      if (resumed || pendingAttempt.logoutRequested) {
        await failPendingAttempt("native_logout_not_effective");
        return { accepted: false, reason: "native_logout_not_effective" };
      }
      return requestNativeLogout();
    }
    const until = Math.min(Date.now() + 20000, pendingAttempt?.deadline ?? Date.now() + 20000);
    while (Date.now() < until && pendingAttempt?.id === attemptId) {
      status = await refresh();
      if (status?.verified && status.accountId === account.id) {
        pendingAttempt = null;
        removeAttemptFromUrl();
        return { accepted: true, reused: true, character: status.character };
      }
      if (status?.connected) {
        if (pendingAttempt.logoutRequested) {
          await failPendingAttempt("native_logout_not_effective");
          return { accepted: false, reason: "native_logout_not_effective" };
        }
        return requestNativeLogout();
      }
      if (status?.loginError === "native_login_rejected") {
        await failPendingAttempt("native_login_rejected");
        return { accepted: false, reason: "native_login_rejected" };
      }
      const root = document.querySelector("#login");
      const form = root?.querySelector("form");
      if (root && form && visible(root)) {
        if (loginTrace.at(-1)?.stage !== "form_seen") trace("form_seen");
        const user = root.querySelector('input[name="login"]');
        const pass = root.querySelector('input[name="lpass"]');
        if (challengeDetected(root, user, pass)) {
          await failPendingAttempt("verification_required");
          return { accepted: false, reason: "verification_required" };
        }
        const other = root.querySelector(".other");
        if (other && visible(other)) { other.click(); await delay(100); continue; }
        const loginTab = root.querySelector('.tabs [data-mode="login"]');
        if (loginTab && !loginTab.classList.contains("on")) { loginTab.click(); await delay(50); continue; }
        const nativeForm = user?.form;
        if (!user || !pass || nativeForm !== form || !nativeForm.requestSubmit) {
          await failPendingAttempt("native_login_ui_changed");
          return { accepted: false, reason: "native_login_ui_changed" };
        }
        const remember = root.querySelector('input[name="keep"]');
        if (remember) remember.checked = false;
        user.value = account.username;
        pass.value = account.password;
        trace("credentials_filled");
        user.dispatchEvent(new Event("input", { bubbles: true }));
        user.dispatchEvent(new Event("change", { bubbles: true }));
        pass.dispatchEvent(new Event("input", { bubbles: true }));
        pass.dispatchEvent(new Event("change", { bubbles: true }));
        pendingAttempt.submitted = true;
        nativeForm.requestSubmit();
        trace("form_submitted");
        return { accepted: true, submitted: true };
      }
      await delay(250);
    }
    await failPendingAttempt("native_login_timeout");
    return { accepted: false, reason: "native_login_timeout" };
  }
  async function resumePendingAttempt() {
    if (!attemptId || !slot || pendingAttempt || attemptBusy) return;
    const account = await accountForSlot();
    if (!account) return;
    let response;
    try {
      trace("resume_requested");
      response = await chrome.runtime.sendMessage({ type: "gst:account-attempt-resume",
        attemptId, accountId: account.id, slot });
    } catch {
      lastError = "attempt_context_unavailable";
      await refresh(true);
      return;
    }
    if (response?.accepted !== true || response.attemptId !== attemptId || response.slot !== slot) {
      trace("resume_rejected");
      if (response?.reason !== "recovery_not_pending") {
        lastError = response?.reason || "attempt_expired";
        if (response?.reason === "attempt_expired" || response?.reason === "account_not_found") removeAttemptFromUrl();
        await refresh(true);
      }
      return;
    }
    trace("resume_accepted");
    await fillNativeLogin({ ...response, resume: true });
  }

  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === origin
        && event.data?.channel === "gst:account-profile:v1" && event.data.type === "ready") {
      if (currentContext) void sendProfile(currentContext, true);
      else void refresh(true);
      return;
    }
    if (event.source !== window || event.origin !== origin || event.data?.channel !== "gst:account-status:v1") return;
    const respond = pageRequests.get(event.data.requestId);
    if (!respond) return;
    pageRequests.delete(event.data.requestId);
    respond(event.data);
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && [GSTAccountProfiles.accountsKey, GSTAccountProfiles.profilesKey,
      "farmPreferences", "harvestPreferences"].some((key) => changes[key])) void refresh(true);
  });
  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:account-context") {
      (message.fresh === true ? refreshLatestContext() : refresh()).then(respond);
      return true;
    }
    if (message?.type === "gst:account-attempt") {
      fillNativeLogin(message).then(respond).catch(() => respond({ accepted: false, reason: "native_login_failed" }));
      return true;
    }
    if (message?.type === "gst:account-stop") {
      stopForAccountSwitch().then(respond);
      return true;
    }
  });
  setInterval(() => { void refresh(); }, 1000);
  void refresh(true);
  void resumePendingAttempt();
})();
