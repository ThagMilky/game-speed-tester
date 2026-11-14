(() => {
  "use strict";
  const panel = document.querySelector('[data-panel="harvest"]');
  const controls = panel?.querySelector("#harvestControls");
  const oldGrid = controls?.querySelector(":scope > .harvest-grid");
  if (!panel || !controls || !oldGrid) return;

  const groups = document.createElement("div");
  groups.className = "harvest-organized";
  oldGrid.before(groups);
  const destinations = {};
  for (const [key, title] of [
    ["range", "Phạm vi & di chuyển"],
    ["resources", "Tài nguyên"],
    ["coordination", "Phối hợp & hiển thị"],
    ["advanced", "Nâng cao & phím tắt"],
  ]) {
    const section = document.createElement("details");
    section.className = "harvest-section";
    section.id = `harvest-section-${key}`;
    const heading = document.createElement("summary");
    heading.textContent = title;
    const content = document.createElement("div");
    content.className = "harvest-section-body";
    section.append(heading, content);
    groups.append(section);
    destinations[key] = content;
  }

  const storagePrefix = "harvestSectionOpen:v1:";
  const defaults = Object.fromEntries([...groups.children].map((section) => [
    section.id,
    ["harvest-section-range", "harvest-section-resources"].includes(section.id),
  ]));
  const storageKey = (id) => storagePrefix + id.slice("harvest-section-".length);
  let pending = {};
  let ready = false;
  let saveQueue = Promise.resolve();
  for (const section of groups.children) section.open = defaults[section.id];

  function save(id, open) {
    saveQueue = saveQueue
      .catch(() => {})
      .then(() => chrome.storage.local.set({ [storageKey(id)]: open }))
      .catch(() => {});
  }
  function remember(section, open) {
    if (!Object.hasOwn(defaults, section?.id)) return;
    if (!ready) pending[section.id] = open;
    save(section.id, open);
  }
  function setOpen(section, open) {
    remember(section, open);
    section.open = open;
  }
  globalThis.GSTHarvestSectionLayout = { setOpen };

  for (const section of groups.children) {
    const summary = section.querySelector(":scope > summary");
    section.addEventListener("click", (event) => {
      if ((event.target === summary || summary.contains(event.target)) && event.detail !== 0) {
        remember(section, !section.open);
      }
    }, true);
    summary.addEventListener("keydown", (event) => {
      if (!event.repeat && event.key === "Enter") remember(section, !section.open);
    }, true);
    summary.addEventListener("keyup", (event) => {
      if (event.key === " ") remember(section, !section.open);
    }, true);
  }

  void (async () => {
    let stored = {};
    try {
      stored = await chrome.storage.local.get([...groups.children].map((section) => storageKey(section.id)));
    } catch (_) {}
    for (const section of groups.children) {
      const key = storageKey(section.id);
      section.open = Object.hasOwn(pending, section.id) ? pending[section.id]
        : typeof stored?.[key] === "boolean" ? stored[key]
        : defaults[section.id];
    }
    ready = true;
    for (const [id, open] of Object.entries(pending)) save(id, open);
    pending = {};
  })();

  const settings = oldGrid.querySelector(".harvest-settings");
  const settingsBody = settings?.querySelector(":scope > .feature-group-body");
  const resourceBody = oldGrid.querySelector(".harvest-selection > .feature-group-body");
  if (settingsBody) {
    settings.querySelector(":scope > h3")?.remove();
    const ordinaryControls = [];
    for (const node of [...settingsBody.childNodes]) {
      if (node.nodeType === Node.ELEMENT_NODE && node.matches("details")) break;
      ordinaryControls.push(node);
    }
    destinations.range.append(...ordinaryControls);

    const coordination = settingsBody.querySelector("#harvestCoordSummary")?.closest("details");
    const advanced = settingsBody.querySelector("#harvestAdvancedSummary")?.closest("details");
    const activity = settingsBody.querySelector(":scope > details.diagnostic");
    if (coordination) destinations.coordination.append(coordination);
    if (advanced) destinations.advanced.append(advanced);
    if (activity) destinations.advanced.append(activity);
  }
  if (resourceBody) {
    oldGrid.querySelector(".harvest-selection > h3")?.remove();
    destinations.resources.append(...resourceBody.childNodes);
  }
  const shortcut = controls.querySelector(":scope > details.advanced");
  if (shortcut) destinations.advanced.prepend(shortcut);
  oldGrid.remove();
})();
