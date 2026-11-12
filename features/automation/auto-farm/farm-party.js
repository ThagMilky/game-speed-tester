(() => {
  "use strict";
  let binding = null;
  let options = { policyMode: "native", identityBlocked: true, identityVerified: false,
    accountProfileKey: "", accountId: "", acceptPartyInvites: false };
  let pendingInvite = "", suppressedInvite = "", message = "";

  function snapshotInvite(scene) {
    const value = scene?.self?.invite;
    return typeof value === "string" && value.trim() ? value.normalize("NFC") : "";
  }
  function currentSnapshot(scene) {
    const driver = scene?.driver;
    if (!scene?.self || !driver || driver.reconnecting || driver.handingOver
        || typeof driver.link?.open !== "function") return false;
    try { return driver.link.open() === true; } catch { return false; }
  }
  function displayedInvite(scene) {
    const inviter = snapshotInvite(scene), hud = scene?.hud;
    const button = hud?.inviteEl?.querySelector?.("button.ui-btn.ok");
    if (!inviter || hud?.inviteFrom !== scene.self.invite || !button?.isConnected || button.disabled
        || button.textContent?.trim() !== "Vào tổ đội" || !button.getClientRects?.().length) return "";
    return inviter;
  }
  function eligible(scene) {
    const driver = scene?.driver;
    if (!scene?.sys?.isActive?.() || scene.leaving || scene.self?.dead || scene.auto?.on !== true
        || options.policyMode !== "extended" || options.identityBlocked || !options.identityVerified
        || !options.accountProfileKey || !options.acceptPartyInvites
        || driver?.online !== true || driver.ready !== true || driver.closing || driver.reconnecting
        || driver.handingOver || driver.displaced || typeof driver.link?.open !== "function") return false;
    try { return driver.link.open() === true; } catch { return false; }
  }
  function restoreInviteHandler(owner) {
    if (!owner.hud || owner.hud.onInvite !== owner.wrapper) return;
    try {
      if (owner.descriptor) Object.defineProperty(owner.hud, "onInvite", owner.descriptor);
      else delete owner.hud.onInvite;
    } catch { /* Keep the native callback if this HUD no longer permits restoration. */ }
  }
  function installInviteHandler(owner) {
    if (typeof owner.hud?.onInvite !== "function" || owner.hud.onInvite === owner.wrapper) return;
    if (owner.wrapper) restoreInviteHandler(owner);
    const original = owner.hud.onInvite;
    const descriptor = Object.getOwnPropertyDescriptor(owner.hud, "onInvite");
    owner.original = original;
    owner.descriptor = descriptor;
    owner.wrapper = function (accept, ...args) {
      const inviter = displayedInvite(owner.scene);
      if (accept === true && inviter) {
        if (pendingInvite === inviter) return undefined;
        pendingInvite = inviter;
      }
      return original.call(this, accept, ...args);
    };
    try {
      owner.hud.onInvite = owner.wrapper;
      if (owner.hud.onInvite !== owner.wrapper) owner.wrapper = null;
    } catch { owner.wrapper = null; }
  }
  function detach() {
    const old = binding;
    binding = null;
    if (!old) return;
    old.scene.events.off("preupdate", frame);
    old.scene.events.off("shutdown", detach);
    old.scene.events.off("destroy", detach);
    restoreInviteHandler(old);
  }
  function attach(scene) {
    if (!scene?.sys?.isActive?.() || !scene.events?.on || !scene.events?.off || !scene.events?.once) {
      detach();
      message = options.acceptPartyInvites ? "Không có scene native tương thích để theo dõi lời mời." : "";
      return;
    }
    if (binding?.scene === scene) {
      if (binding.hud !== scene.hud) {
        restoreInviteHandler(binding);
        binding.hud = scene.hud ?? null;
        binding.wrapper = null;
        installInviteHandler(binding);
      }
      return;
    }
    detach();
    binding = { scene, hud: scene.hud ?? null, original: null, descriptor: null, wrapper: null, farmWasOn: null };
    installInviteHandler(binding);
    scene.events.on("preupdate", frame);
    scene.events.once("shutdown", detach);
    scene.events.once("destroy", detach);
  }
  function frame() {
    const owner = binding, scene = owner?.scene;
    if (!scene || !scene.sys?.isActive?.()) { detach(); return; }
    if (scene.hud !== owner.hud) {
      restoreInviteHandler(owner);
      owner.hud = scene.hud ?? null;
      owner.wrapper = null;
    }
    if (!owner.hud) {
      message = "Đang chờ HUD native để theo dõi lời mời.";
      return;
    }
    installInviteHandler(owner);
    if (!currentSnapshot(scene)) {
      message = options.acceptPartyInvites ? "Đang chờ snapshot native hiện tại trước khi xử lý lời mời." : "";
      return;
    }
    const inviter = snapshotInvite(scene);
    if (!inviter) {
      pendingInvite = "";
      suppressedInvite = "";
      message = "";
    } else {
      if (pendingInvite && pendingInvite !== inviter) { pendingInvite = ""; message = ""; }
      if (suppressedInvite && suppressedInvite !== inviter) { suppressedInvite = ""; message = ""; }
    }
    if (owner.farmWasOn === true && scene.auto?.on !== true && inviter)
      suppressedInvite = inviter;
    owner.farmWasOn = scene.auto?.on === true;

    if (!options.acceptPartyInvites && !pendingInvite) { message = ""; detach(); return; }
    if (!inviter) return;
    if (displayedInvite(scene) !== inviter) {
      message = "Đang chờ HUD native xác nhận nút của lời mời hiện tại.";
      return;
    }
    if (pendingInvite === inviter) {
      message = "Callback nhận lời mời gốc đã được gọi một lần; đang chờ snapshot của game.";
      return;
    }
    if (suppressedInvite === inviter) {
      message = "Lời mời hiện tại được giữ nguyên sau khi tùy chọn, Auto Farm hoặc tài khoản thay đổi.";
      return;
    }
    if (!options.acceptPartyInvites) return;
    if (!options.identityVerified || options.identityBlocked || !options.accountProfileKey) {
      message = "Tự nhận lời mời đang chờ xác nhận đúng tài khoản.";
      return;
    }
    if (options.policyMode !== "extended") {
      message = "Tự nhận lời mời chỉ hoạt động trong chế độ Tool hỗ trợ.";
      return;
    }
    if (scene.auto?.on !== true) {
      message = "Tự nhận lời mời đang chờ Auto Farm gốc bật.";
      return;
    }
    if (!eligible(scene)) {
      message = "Tự nhận lời mời đang chờ trạng thái kết nối an toàn.";
      return;
    }
    const button = scene.hud.inviteEl?.querySelector?.("button.ui-btn.ok");
    if (typeof scene.hud.onInvite !== "function" || !button?.isConnected || button.disabled
        || button.textContent?.trim() !== "Vào tổ đội" || !button.getClientRects?.().length) {
      message = "Không tìm thấy nút nhận lời mời gốc; không gửi yêu cầu tự động.";
      return;
    }
    // The wrapper records this before invoking the native callback so repeated
    // snapshots cannot submit again while the result is pending.
    try { scene.hud.onInvite.call(scene.hud, true); }
    catch { message = "Callback gốc đã được gọi nhưng chưa thể xác nhận kết quả; không thử lại khi lời mời này còn hiển thị."; }
  }
  function configure(scene, value = {}) {
    const next = {
      policyMode: value.policyMode === "extended" ? "extended" : value.policyMode === "disabled" ? "disabled" : "native",
      identityBlocked: value.identityBlocked === true,
      identityVerified: value.identityVerified === true,
      accountProfileKey: typeof value.accountProfileKey === "string" ? value.accountProfileKey : "",
      accountId: typeof value.accountId === "string" ? value.accountId : "",
      acceptPartyInvites: value.acceptPartyInvites === true
    };
    const old = options, liveInvite = snapshotInvite(binding?.scene ?? scene);
    const identityChanged = old.identityVerified && (old.accountProfileKey !== next.accountProfileKey
      || old.accountId !== next.accountId || !next.identityVerified);
    if (liveInvite && (identityChanged
        || old.acceptPartyInvites && !next.acceptPartyInvites
        || old.policyMode === "extended" && next.policyMode !== "extended"))
      suppressedInvite = liveInvite;
    options = next;
    if (scene && binding?.scene !== scene) attach(scene);
    else if (!scene && options.acceptPartyInvites && !binding)
      message = "Đang chờ HUD native để theo dõi lời mời.";
    if (!options.acceptPartyInvites && !pendingInvite) {
      message = "";
      if (binding) detach();
    } else if (binding) frame();
  }
  globalThis.GSTFarmParty = {
    configure,
    status(scene) { return binding?.scene === scene || options.acceptPartyInvites ? message : ""; }
  };
  window.addEventListener("pagehide", detach);
  window.addEventListener("pageshow", () => { if (options.acceptPartyInvites || pendingInvite) attach(sceneNow()); });
  function sceneNow() {
    return window.game?.scene?.getScene?.("world")
      ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  }
})();
