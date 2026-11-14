(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const list = byId("accountList"), form = byId("accountForm");
  const labelInput = byId("accountLabel"), usernameInput = byId("accountUsername");
  const passwordInput = byId("accountPassword"), feedback = byId("accountFeedback");
  const status = byId("accountActiveStatus"), title = byId("accountFormTitle");
  byId("accountAddButton").addEventListener("click", () => {
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    usernameInput.focus({ preventScroll: true });
  });
  const cancel = byId("accountCancel");
  let rows = [], editingId = "", busy = false;
  const autoMode = byId("accountAutoLoginMode"), autoAccount = byId("accountAutoLoginAccount");
  const autoTarget = byId("accountAutoLoginTarget"), autoStatus = byId("accountAutoLoginStatus");
  let autoPreferences = { mode: "off", accountId: "" }, autoLoaded = false, autoSaving = false;
  autoMode.disabled = autoAccount.disabled = true;
  function renderAutoLogin() {
    autoMode.value = ["last", "account"].includes(autoPreferences.mode) ? autoPreferences.mode : "off";
    autoTarget.hidden = autoMode.value !== "account";
    const placeholder = new Option("Chọn tài khoản", "");
    autoAccount.replaceChildren(placeholder, ...rows.map((row) => new Option(row.label, row.id)));
    autoAccount.value = rows.some((row) => row.id === autoPreferences.accountId) ? autoPreferences.accountId : "";
    autoMode.disabled = autoAccount.disabled = !autoLoaded || autoSaving;
    if (autoPreferences.mode === "account" && !autoAccount.value)
      autoStatus.textContent = "Chưa có tài khoản mặc định hợp lệ; chưa tự đăng nhập.";
  }
  async function saveAutoLogin() {
    if (!autoLoaded || autoSaving) return;
    const next = { mode: autoMode.value, accountId: autoAccount.value };
    if (next.mode === "account" && !next.accountId) {
      autoTarget.hidden = false;
      autoStatus.textContent = "Chọn tài khoản để lưu chế độ này.";
      return;
    }
    autoSaving = true;
    autoMode.disabled = autoAccount.disabled = true;
    try {
      await chrome.storage.local.set({ gstAutoLogin: next });
      autoPreferences = next;
      autoStatus.textContent = "Đã lưu lựa chọn tự đăng nhập.";
    } catch { autoStatus.textContent = "Chưa lưu được lựa chọn; giữ cài đặt cũ."; }
    finally { autoSaving = false; renderAutoLogin(); }
  }
  autoMode.addEventListener("change", () => { autoTarget.hidden = autoMode.value !== "account"; void saveAutoLogin(); });
  autoAccount.addEventListener("change", () => { void saveAutoLogin(); });
  chrome.storage.local.get("gstAutoLogin").then((saved) => {
    if (!autoLoaded) autoPreferences = saved.gstAutoLogin ?? autoPreferences;
    autoLoaded = true; renderAutoLogin();
  }).catch(() => { autoStatus.textContent = "Chưa đọc được lựa chọn tự đăng nhập."; });
  const uuid = () => crypto.randomUUID?.() ?? [...crypto.getRandomValues(new Uint8Array(16))]
    .map((value) => value.toString(16).padStart(2, "0")).join("");
  const reasons = {
    open_game_tab_first: "Mở tab game trước khi đăng nhập ở tab hiện tại.",
    game_not_connected: "Tab game chưa kết nối hoặc đang ở chế độ offline.",
    automation_stop_unconfirmed: "Chưa xác nhận được các tính năng đã dừng; chưa đổi nick.",
    harvest_request_pending: "Thu hoạch đang chờ kết quả native. Hãy chờ lượt đó xong rồi thử lại.",
    task_stop_unconfirmed: "Chưa xác nhận được Bí cảnh/Rương đã dừng; chưa đổi nick.",
    map_travel_stop_unconfirmed: "Chưa xác nhận được hành trình bản đồ đã dừng; chưa đổi nick.",
    quest_stop_unconfirmed: "Chưa xác nhận được Auto Quest đã dừng; chưa đổi nick.",
    farm_stop_unconfirmed: "Chưa xác nhận được Auto Farm đã dừng; chưa đổi nick.",
    verification_required: "Game yêu cầu xác minh thêm. Hãy hoàn tất bằng giao diện game.",
    native_login_rejected: "Game chưa nhận thông tin đăng nhập. Kiểm tra tên đăng nhập và mật khẩu trong form.",
    native_login_timeout: "Không thấy form đăng nhập phù hợp trong thời gian chờ.",
    native_login_ui_changed: "Form đăng nhập của game đã đổi; không tự điền vào giao diện khác.",
    native_logout_unavailable: "Không tìm thấy nút đăng xuất native của game; chưa đổi nhân vật.",
    native_logout_not_effective: "Game vẫn giữ nhân vật cũ sau khi đăng xuất; hãy xử lý trong giao diện game rồi thử lại.",
    native_settings_unavailable: "Không mở được bảng cài đặt native an toàn; chưa đổi nhân vật.",
    identity_changed_during_recovery: "Nhân vật trong tab đã đổi trong lúc xử lý; lượt đăng nhập đã dừng để bảo vệ hồ sơ.",
    unexpected_character: "Nhân vật trong game không khớp tài khoản đã xác nhận.",
    identity_confirmation_required: "Tab đang có nhân vật chưa được xác nhận cho tài khoản này.",
    saved_identity_conflict: "Nhân vật đăng nhập khác dấu xác nhận đã lưu. Dùng nút “Xác nhận lại nhân vật” nếu thông tin cũ sai; hồ sơ riêng sẽ được giữ.",
    account_not_found: "Không tìm thấy tài khoản đã lưu.",
    attempt_already_active: "Tab này đang có một lần đăng nhập khác.",
    attempt_expired: "Lượt đăng nhập đã hết hạn hoặc không còn hợp lệ. Hãy bắt đầu lại từ nút tài khoản.",
    attempt_context_unavailable: "Chưa kiểm tra lại được lượt đăng nhập sau khi tải lại trang. Hãy thử đăng nhập lại.",
    tab_load_timeout: "Tab game chưa tải xong để tiếp tục đăng nhập.",
    account_context_unavailable: "Chưa đọc được trạng thái tài khoản trong tab."
  };
  function explain(reason) { return reasons[reason] || "Chưa hoàn tất thao tác. Kiểm tra tab game rồi thử lại."; }
  Object.assign(reasons, {
    automatic_login_failed: "Chưa tự mở được tài khoản mặc định. Hãy dùng nút đăng nhập hoặc kiểm tra lại cài đặt.",
    attempt_url_mismatch: "URL sau reload không khớp lượt đăng nhập hoặc slot đã chọn.",
    attempt_record_missing_or_expired: "Bản ghi lượt đăng nhập không còn hoặc đã hết hạn sau reload.",
    attempt_record_mismatch: "Tab đang giữ một lượt đăng nhập khác với lượt cần tiếp tục."
  });
  const stageLabels = {
    page_loaded: "Tải trang", attempt_received: "Nhận lượt đăng nhập", waiting_form: "Chờ form",
    form_seen: "Thấy form", credentials_filled: "Đã điền", form_submitted: "Đã gửi form",
    logout_requested: "Đã yêu cầu logout", resume_requested: "Kiểm tra lượt sau reload",
    resume_accepted: "Cho phép tiếp tục", resume_rejected: "Chưa thể tiếp tục",
    login_failed: "Lượt đăng nhập dừng", identity_confirmed: "Đúng nhân vật"
  };
  function setBusy(value) {
    busy = value;
    byId("accountSave").disabled = value;
    [...list.querySelectorAll("button")].forEach((button) => { button.disabled = value; });
  }
  function resetForm() {
    editingId = "";
    form.reset();
    passwordInput.type = "password";
    byId("accountPasswordToggle").textContent = "Hiện";
    byId("accountPasswordToggle").setAttribute("aria-pressed", "false");
    passwordInput.required = true;
    passwordInput.autocomplete = "new-password";
    title.textContent = "Thêm tài khoản";
    byId("accountSave").textContent = "Lưu tài khoản";
    cancel.hidden = true;
  }
  function edit(row) {
    editingId = row.id;
    labelInput.value = row.label;
    usernameInput.value = row.username;
    passwordInput.value = row.password;
    passwordInput.required = false;
    passwordInput.type = "text";
    byId("accountPasswordToggle").textContent = "Ẩn";
    byId("accountPasswordToggle").setAttribute("aria-pressed", "true");
    passwordInput.autocomplete = "current-password";
    title.textContent = "Sửa tài khoản";
    byId("accountSave").textContent = "Lưu thay đổi";
    cancel.hidden = false;
    feedback.textContent = "Mật khẩu đã lưu đang hiển thị. Sửa trực tiếp nếu muốn đổi; để trống thì giữ mật khẩu cũ.";
    labelInput.focus();
  }
  function render() {
    const nodes = rows.map((row) => {
      const view = { id: row.id, slot: row.slot, label: row.label, username: row.username,
        expectedCharacter: row.expectedCharacter, expectedClassId: row.expectedClassId,
        expectedCharacterId: row.expectedCharacterId };
      const card = document.createElement("article");
      card.className = "account-entry";
      const info = document.createElement("div");
      info.className = "account-entry-info";
      const heading = document.createElement("h3");
      heading.textContent = row.label;
      const user = document.createElement("div");
      user.className = "account-entry-detail";
      const userLabel = document.createElement("strong");
      userLabel.textContent = "Tên đăng nhập: ";
      const userValue = document.createElement("span");
      userValue.textContent = row.username;
      user.append(userLabel, userValue);
      const identity = document.createElement("div");
      identity.className = "account-entry-detail";
      const identityLabel = document.createElement("strong");
      identityLabel.textContent = row.expectedCharacter ? "Đã xác nhận nhân vật: " : "Trạng thái nhân vật: ";
      const identityValue = document.createElement("span");
      identityValue.textContent = row.expectedCharacter
        ? row.expectedCharacter + (row.expectedClassId ? " · lớp " + row.expectedClassId : "")
        : "Chưa xác nhận";
      identity.append(identityLabel, identityValue);
      const actions = document.createElement("div");
      actions.className = "account-entry-actions";
      const login = document.createElement("button");
      login.type = "button"; login.textContent = "Login ở tab này";
      login.addEventListener("click", () => { void launch(view, "current"); });
      const open = document.createElement("button");
      open.type = "button"; open.textContent = "Mở ở tab mới";
      open.addEventListener("click", () => { void launch(view, "additional"); });
      const editButton = document.createElement("button");
      editButton.type = "button"; editButton.className = "quiet"; editButton.textContent = "Sửa";
      editButton.addEventListener("click", () => edit({ ...view, password: row.password }));
      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "quiet"; remove.textContent = "Xóa";
      remove.addEventListener("click", () => { void removeAccount(view); });
      actions.append(login, open, editButton);
      if (row.expectedCharacter || row.expectedClassId || row.expectedCharacterId) {
        const reverify = document.createElement("button");
        reverify.type = "button"; reverify.className = "quiet"; reverify.textContent = "Xác nhận lại nhân vật";
        reverify.title = "Dùng khi dấu xác nhận nhân vật đã lưu không đúng. Thao tác này xóa dấu xác nhận, giữ hồ sơ Farm/Thu hoạch và yêu cầu xác nhận lại ở lần đăng nhập kế tiếp.";
        reverify.addEventListener("click", () => { void clearSavedIdentity(view); });
        actions.append(reverify);
      }
      actions.append(remove);
      info.append(heading, user, identity);
      card.append(info, actions);
      return card;
    });
    if (!nodes.length) {
      const empty = document.createElement("p");
      empty.className = "hint"; empty.textContent = "Chưa có tài khoản nào được lưu.";
      nodes.push(empty);
    }
    list.replaceChildren(...nodes);
  }
  async function reload() {
    rows = (await GSTAccountProfiles.readAccounts()).filter((row) => row && typeof row.id === "string"
      && typeof row.slot === "string" && typeof row.username === "string" && typeof row.password === "string")
      .map((row) => ({ ...row, label: typeof row.label === "string" && row.label.trim() ? row.label : row.username }));
    render();
    renderAutoLogin();
  }
  async function refreshStatus() {
    const context = await GSTAccountProfiles.activeContext();
    const trace = Array.isArray(context?.loginTrace) ? context.loginTrace : [];
    const steps = trace.slice(-8).map((row) => stageLabels[row?.stage]).filter(Boolean);
    if (!context) {
      status.textContent = "Tab hiện tại chưa có cầu nối game để xác nhận nick.";
      return;
    }
    if (context.verified) {
      status.textContent = "Tab hiện tại: " + (context.accountLabel || "Nick hiện tại") + " · " + context.character + ".";
    } else if (context.loginError) {
      status.textContent = explain(context.loginError);
    } else if (context.reason === "native_login_required") {
      status.textContent = "Tab hiện tại đang chờ đăng nhập bằng giao diện game.";
    } else if (context.reason === "unexpected_character") {
      status.textContent = "Nhân vật không khớp tài khoản đã lưu; Farm và Thu hoạch đang bị khóa.";
    } else {
      status.textContent = "Tab hiện tại chưa xác nhận nick; Farm và Thu hoạch đang bị khóa.";
    }
    if (steps.length) status.textContent += " · Tiến trình: " + steps.join(" → ");
  }
  async function launch(row, mode) {
    if (busy) return;
    setBusy(true);
    feedback.textContent = mode === "current" ? "Đang dừng công việc hiện tại rồi mở form game…" : "Đang mở tab game mới…";
    try {
      const result = await chrome.runtime.sendMessage({ type: "gst:account-launch", accountId: row.id, mode });
      if (result?.accepted) {
        feedback.textContent = result.reused
          ? "Đã xác nhận " + row.label + " · " + result.character + "."
          : result.recoveryStarted ? "Đã dùng nút đăng xuất của game trên tab này; đang chờ form để đăng nhập lại."
          : result.submitted ? "Đã gửi form đăng nhập của game; chờ game xác nhận nhân vật."
            : "Tab game đã mở; chờ giao diện game xác nhận tài khoản.";
      } else feedback.textContent = explain(result?.reason);
      await refreshStatus();
    } catch { feedback.textContent = "Chưa liên hệ được bộ mở tài khoản."; }
    finally { setBusy(false); }
  }
  async function removeAccount(row) {
    if (busy || !window.confirm("Xóa tài khoản “" + row.label
        + "” khỏi extension? Cài đặt riêng của tài khoản cũng sẽ bị xóa; dữ liệu game không bị xóa.")) return;
    setBusy(true);
    try {
      const active = await GSTAccountProfiles.activeContext();
      if (active?.verified && active.accountId === row.id) {
        feedback.textContent = "Chuyển khỏi tài khoản đang mở trước khi xóa để giữ an toàn cho công việc đang chạy.";
        return;
      }
      await GSTAccountProfiles.updateAccounts((current) => current.filter((item) => item.id !== row.id));
      await GSTAccountProfiles.removeAccountProfiles(row.slot);
      if (editingId === row.id) resetForm();
      await reload();
      feedback.textContent = "Đã xóa tài khoản và cài đặt riêng trong extension.";
    } catch { feedback.textContent = "Chưa xóa được tài khoản."; }
    finally { setBusy(false); }
  }
  async function clearSavedIdentity(row) {
    if (busy || !window.confirm("Xóa dấu xác nhận nhân vật “" + (row.expectedCharacter || "đã lưu")
        + "” của tài khoản “" + row.label + "”? Hồ sơ Farm/Thu hoạch sẽ được giữ nguyên. Lần đăng nhập kế tiếp sẽ xác nhận lại nhân vật.")) return;
    setBusy(true);
    try {
      const captured = await GSTAccountProfiles.captureActiveContext();
      if (captured.context?.verified && captured.context.accountId === row.id) {
        let stopped;
        try { stopped = await chrome.tabs.sendMessage(captured.tabId, { type: "gst:account-stop" }); }
        catch { stopped = null; }
        if (stopped?.ready !== true || stopped.autoOn !== false) {
          feedback.textContent = explain(stopped?.reason || "automation_stop_unconfirmed");
          return;
        }
      }
      await GSTAccountProfiles.updateAccounts((current) => {
        const existing = current.find((item) => item.id === row.id && item.slot === row.slot);
        if (!existing || existing.expectedCharacter !== row.expectedCharacter
            || existing.expectedClassId !== row.expectedClassId
            || existing.expectedCharacterId !== row.expectedCharacterId)
          throw new Error("Saved identity changed.");
        return current.map((item) => item.id === row.id
          ? { ...item, expectedCharacter: "", expectedClassId: "", expectedCharacterId: "" }
          : item);
      });
      await reload();
      feedback.textContent = "Đã xóa dấu xác nhận nhân vật. Hồ sơ riêng được giữ nguyên; hãy đăng nhập lại để xác nhận.";
      await refreshStatus();
    } catch { feedback.textContent = "Chưa cập nhật được dấu xác nhận nhân vật."; }
    finally { setBusy(false); }
  }
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    const username = usernameInput.value.trim(), password = passwordInput.value;
    const label = labelInput.value.trim() || username;
    if (!username || (!editingId && !password)) {
      feedback.textContent = "Nhập tên đăng nhập và mật khẩu.";
      return;
    }
    setBusy(true);
    try {
      let updated = null, previousSlot = "", usernameChanged = false;
      const next = await GSTAccountProfiles.updateAccounts((current) => {
        const existing = current.find((row) => row.id === editingId);
        if (editingId && !existing) throw new Error("Account no longer exists.");
        usernameChanged = !!existing && existing.username !== username;
        previousSlot = existing?.slot ?? "";
        updated = existing ? {
          ...existing, label, username, password: password || existing.password,
          slot: usernameChanged ? uuid() : existing.slot,
          expectedCharacter: usernameChanged ? "" : existing.expectedCharacter ?? "",
          expectedClassId: usernameChanged ? "" : existing.expectedClassId ?? "",
          expectedCharacterId: usernameChanged ? "" : existing.expectedCharacterId ?? ""
        } : {
          id: uuid(), slot: uuid(), label, username, password,
          expectedCharacter: "", expectedClassId: "", expectedCharacterId: ""
        };
        return existing ? current.map((row) => row.id === existing.id ? updated : row) : [...current, updated];
      });
      const existing = editingId ? rows.find((row) => row.id === editingId) : null;
      if (usernameChanged) await GSTAccountProfiles.removeAccountProfiles(previousSlot);
      rows = next;
      render(); resetForm();
      feedback.textContent = usernameChanged
        ? "Đã lưu. Tên đăng nhập đổi nên extension tạo slot và hồ sơ mới."
        : existing ? "Đã cập nhật tài khoản." : "Đã lưu tài khoản trên trình duyệt này.";
    } catch { feedback.textContent = "Chưa lưu được tài khoản."; }
    finally { setBusy(false); }
  });
  cancel.addEventListener("click", resetForm);
  byId("accountPasswordToggle").addEventListener("click", (event) => {
    const show = passwordInput.type === "password";
    passwordInput.type = show ? "text" : "password";
    event.currentTarget.textContent = show ? "Ẩn" : "Hiện";
    event.currentTarget.setAttribute("aria-pressed", String(show));
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[GSTAccountProfiles.accountsKey]) void reload();
    if (area === "local" && changes.gstAutoLogin) {
      autoPreferences = changes.gstAutoLogin.newValue ?? { mode: "off", accountId: "" };
      autoLoaded = true;
      renderAutoLogin();
    }
  });
  void reload().catch(() => { feedback.textContent = "Chưa đọc được danh sách tài khoản."; });
  void refreshStatus();
  const timer = setInterval(() => { void refreshStatus(); }, 1500);
  window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
})();
