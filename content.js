(() => {
  "use strict";
  const origin = "https://nghichthienky.online";
  const pending = new Map();
  let preferences = null;
  let revision = 0;
  let requestSequence = 0;
  let navigating = false;
  let overlay = null;
  let overlayText = null;
  let latestStatus = null;
  let displayPreferences = null;
  let displayRevision = 0;
  let autoFarmOn = null;
  let farmDisplayTimer = null;
  let displaySuspended = false;

  function monitorFarmDisplay() {
    const needed = !displaySuspended && displayPreferences?.visible && displayPreferences.fields.autoFarm;
    if (!needed && farmDisplayTimer !== null) {
      clearInterval(farmDisplayTimer);
      farmDisplayTimer = null;
    }
    if (needed && farmDisplayTimer === null) {
      const read = () => window.postMessage({ channel: "gst:farm:v1", type: "status" }, origin);
      read();
      farmDisplayTimer = setInterval(read, 1000);
    }
  }

  function normalizeDisplay(value) {
    return {
      visible: value?.visible !== false,
      fields: Object.fromEntries(["override", "speed", "movement", "autoFarm", "fix", "message"]
        .map((key) => [key, value?.fields?.[key] !== false]))
    };
  }

  function renderOverlay() {
    monitorFarmDisplay();
    if (!displayPreferences?.visible || !Object.values(displayPreferences.fields).some(Boolean)) {
      overlay?.remove();
      return;
    }
    if (!document.body) return;
    if (!overlay) {
      overlay = document.createElement("div");
      const shadow = overlay.attachShadow({ mode: "closed" });
      const style = document.createElement("style");
      style.textContent = `
        :host {
          all: initial !important;
          position: fixed !important;
          bottom: 12px !important;
          right: 12px !important;
          z-index: 2147483647 !important;
          display: block !important;
          pointer-events: none !important;
        }
        pre {
          box-sizing: border-box;
          max-width: min(250px, calc(100vw - 24px));
          margin: 0;
          padding: 9px 12px;
          border: 1px solid #ffffff30;
          border-radius: 6px;
          background: #101820d9;
          color: #b9ffca;
          font: 12px/1.5 ui-monospace, Consolas, monospace;
          white-space: pre-wrap;
          overflow-wrap: anywhere;
          user-select: none;
        }
      `;
      overlayText = document.createElement("pre");
      shadow.append(style, overlayText);
    }
    if (!overlay.isConnected) document.body.append(overlay);
    const status = latestStatus;
    const movement = status?.state === "walking" ? "Đi bộ"
      : status?.state === "flying" ? "Bay" : "Chưa rõ";
    const fields = displayPreferences.fields;
    const lines = ["GAME SPEED TESTER"];
    if (fields.override) lines.push(`Override: ${status ? (status.enabled ? "BẬT" : "TẮT") : "—"}`);
    if (fields.speed) lines.push(`Tốc độ: ${status?.current ?? "—"}`);
    if (fields.movement) lines.push(`Trạng thái: ${movement}`);
    if (fields.autoFarm) lines.push(`Auto Farm game: ${autoFarmOn === true ? "BẬT" : autoFarmOn === false ? "TẮT" : "CHƯA RÕ"}`);
    if (fields.fix) lines.push(`Fix (từ lần đổi tốc độ): ${status?.fix ?? "—"}`);
    if (fields.message) {
      lines.push(status?.message ?? "Đang kết nối…");
      if (status && !status.enabled) lines.push("Tạm dừng cập nhật khi tắt.");
    }
    const text = lines.join("\n");
    if (overlayText.textContent !== text) overlayText.textContent = text;
  }

  document.addEventListener("DOMContentLoaded", renderOverlay, { once: true });
  renderOverlay();

  function normalize(value) {
    const clampSpeed = (speed, fallback) => typeof speed === "number" && Number.isFinite(speed)
      ? Math.min(6, Math.max(1, speed)) : fallback;
    return {
      enabled: value?.enabled === true,
      walkingSpeed: clampSpeed(value?.walkingSpeed, 3.5),
      flyingSpeed: clampSpeed(value?.flyingSpeed, 2)
    };
  }

  function configure() {
    if (!preferences) return;
    const url = new URL(location.href);
    if (preferences.enabled && !url.searchParams.has("timer")) {
      if (!navigating) {
        navigating = true;
        // Append without reserializing existing query values, order or duplicates.
        url.search += `${url.search ? "&" : "?"}timer`;
        location.replace(url.href);
      }
      return;
    }
    window.postMessage({ channel: "gst:command:v1", type: "configure", ...preferences }, origin);
  }

  window.addEventListener("message", (event) => {
    if (event.source === window && event.origin === origin && event.data?.channel === "gst:farm-status:v1"
        && !event.data.ready) {
      autoFarmOn = typeof event.data.autoOn === "boolean" ? event.data.autoOn : null;
      renderOverlay();
      return;
    }
    if (event.source !== window || event.origin !== origin
        || event.data?.channel !== "gst:status:v1") return;
    if (event.data.ready) configure();
    if (!event.data.status) return;
    // Explicit scalar allowlist; page messages never become extension commands.
    const value = event.data.status;
    latestStatus = {
      enabled: value?.enabled === true,
      current: Number.isFinite(value?.current) ? value.current : null,
      fix: Number.isFinite(value?.fix) ? value.fix : null,
      state: typeof value?.state === "string" ? value.state.slice(0, 80) : "unknown",
      message: typeof value?.message === "string" ? value.message.slice(0, 240) : "No status."
    };
    renderOverlay();
    const entry = pending.get(event.data.requestId);
    if (!entry) return;
    clearTimeout(entry.timeout);
    pending.delete(event.data.requestId);
    entry.respond(latestStatus);
  });

  chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id !== chrome.runtime.id) return;
    if (message?.type === "gst:display") {
      // Apply immediately, including while the page's speed timer is stopped.
      displayRevision++;
      displayPreferences = normalizeDisplay(message.preferences);
      renderOverlay();
      respond({ applied: true, visible: overlay?.isConnected === true });
      return;
    }
    if (message?.type !== "gst:status") return;
    const requestId = String(++requestSequence);
    const timeout = setTimeout(() => {
      pending.delete(requestId);
      respond({ message: "Page bridge unavailable. Reload this tab after installing/updating the extension." });
    }, 800);
    pending.set(requestId, { respond, timeout });
    window.postMessage({ channel: "gst:command:v1", type: "snapshot", requestId }, origin);
    return true;
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.displayPreferences) {
      displayRevision++;
      displayPreferences = normalizeDisplay(changes.displayPreferences.newValue);
      renderOverlay();
    }
    if (changes.preferences) {
      revision++;
      preferences = normalize(changes.preferences.newValue);
      configure();
    }
  });
  window.addEventListener("pageshow", () => {
    displaySuspended = false;
    renderOverlay();
    configure();
  });
  window.addEventListener("pagehide", () => {
    displaySuspended = true;
    monitorFarmDisplay();
    overlay?.remove();
    for (const entry of pending.values()) {
      clearTimeout(entry.timeout);
      entry.respond({ message: "Page is navigating." });
    }
    pending.clear();
  });
  const initialRevision = revision;
  const initialDisplayRevision = displayRevision;
  chrome.storage.local.get(["preferences", "displayPreferences"]).then((saved) => {
    if (displayRevision === initialDisplayRevision) {
      displayPreferences = normalizeDisplay(saved.displayPreferences);
      renderOverlay();
    }
    if (revision === initialRevision) {
      preferences = normalize(saved.preferences);
      configure();
    }
  }).catch(() => {
    // Fail closed: no preferences means no modifications or navigation.
    preferences = normalize(null);
    configure();
  });
})();
