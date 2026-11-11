(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const list = byId("accountList"), form = byId("accountForm");
  const labelInput = byId("accountLabel"), usernameInput = byId("accountUsername");
  const passwordInput = byId("accountPassword"), feedback = byId("accountFeedback");
  const status = byId("accountActiveStatus"), title = byId("accountFormTitle");
  const cancel = byId("accountCancel");
  let rows = [], editingId = "", busy = false;
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
    unexpected_character: "Nhân vật trong game không khớp tài khoản đã xác nhận.",
    identity_confirmation_required: "Tab đang có nhân vật chưa được xác nhận cho tài khoản này.",
    account_not_found: "Không tìm thấy tài khoản đã lưu.",
    attempt_already_active: "Tab này đang có một lần đăng nhập khác.",
    tab_load_timeout: "Tab game chưa tải xong để tiếp tục đăng nhập.",
    account_context_unavailable: "Chưa đọc được trạng thái tài khoản trong tab."
  };
  function explain(reason) { return reasons[reason] || "Chưa hoàn tất thao tác. Kiểm tra tab game rồi thử lại."; }
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
    title.textContent = "Thêm tài khoản";
    byId("accountSave").textContent = "Lưu tài khoản";
    cancel.hidden = true;
  }
  function edit(row) {
    editingId = row.id;
    labelInput.value = row.label;
    usernameInput.value = row.username;
    passwordInput.value = "";
    passwordInput.required = false;
    passwordInput.type = "password";
    title.textContent = "Sửa tài khoản";
    byId("accountSave").textContent = "Lưu thay đổi";
    cancel.hidden = false;
    feedback.textContent = "Để trống mật khẩu nếu muốn giữ mật khẩu đã lưu.";
    labelInput.focus();
  }
  function render() {
    const nodes = rows.map((row) => {
      const view = { id: row.id, slot: row.slot, label: row.label, username: row.username,
        expectedCharacter: row.expectedCharacter, expectedClassId: row.expectedClassId };
      const card = document.createElement("article");
      card.className = "account-entry";
      const heading = document.createElement("h3");
      heading.textContent = row.label;
      const identity = document.createElement("small");
      identity.textContent = row.expectedCharacter
        ? "Đã xác nhận nhân vật: " + row.expectedCharacter + (row.expectedClassId ? " · lớp " + row.expectedClassId : "")
        : "Chưa xác nhận nhân vật";
      const user = document.createElement("small");
      user.textContent = "Tên đăng nhập: " + row.username;
      const actions = document.createElement("div");
      actions.className = "account-entry-actions";
      const login = document.createElement("button");
      login.type = "button"; login.textContent = "Đăng nhập ở tab này";
      login.addEventListener("click", () => { void launch(view, "current"); });
      const open = document.createElement("button");
      open.type = "button"; open.textContent = "Mở thêm nick";
      open.addEventListener("click", () => { void launch(view, "additional"); });
      const editButton = document.createElement("button");
      editButton.type = "button"; editButton.className = "quiet"; editButton.textContent = "Sửa";
      editButton.addEventListener("click", () => edit(view));
      const remove = document.createElement("button");
      remove.type = "button"; remove.className = "quiet"; remove.textContent = "Xóa";
      remove.addEventListener("click", () => { void removeAccount(view); });
      actions.append(login, open, editButton, remove);
      card.append(heading, user, identity, actions);
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
  }
  async function refreshStatus() {
    const context = await GSTAccountProfiles.activeContext();
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy || !form.reportValidity()) return;
    const label = labelInput.value.trim(), username = usernameInput.value.trim(), password = passwordInput.value;
    if (!label || !username || (!editingId && !password)) {
      feedback.textContent = "Nhập tên gợi nhớ, tên đăng nhập và mật khẩu.";
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
  });
  void reload().catch(() => { feedback.textContent = "Chưa đọc được danh sách tài khoản."; });
  void refreshStatus();
  const timer = setInterval(() => { void refreshStatus(); }, 1500);
  window.addEventListener("pagehide", () => clearInterval(timer), { once: true });
})();
