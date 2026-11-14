(() => {
  "use strict";

  function convertGroups(namespace, container, sourceSelector, definitions) {
    if (!container) return [];
    container.classList.remove("wide-groups", "feature-group-grid", "feature-flat-grid");
    container.classList.add("feature-organized");
    const sources = [...container.querySelectorAll(`:scope > ${sourceSelector}`)];
    return sources.map((source, index) => {
      const definition = definitions[index];
      if (!definition) return null;
      const title = source.querySelector(":scope > h3");
      const body = source.querySelector(":scope > .feature-group-body");
      const section = document.createElement("details");
      section.className = "feature-group ui-section";
      section.id = `${namespace}-section-${definition.key}`;
      section.dataset.uiSectionKey = `${namespace}:${definition.key}`;
      const summary = document.createElement("summary");
      summary.textContent = title?.textContent?.trim() || definition.title;
      if (title) title.remove();
      section.append(summary);
      if (body) section.append(body);
      source.replaceWith(section);
      return { section, open: definition.open };
    }).filter(Boolean);
  }

  const questSections = convertGroups("quest", document.querySelector("#questControls > .wide-groups"),
    "section.wide-group", [
      { key: "search", title: "Tìm & sắp xếp quest", open: true },
      { key: "list", title: "Danh sách & chạy quest", open: true },
    ]);
  const connectionSections = convertGroups("connection",
    document.querySelector('#connectionRecoveryControls > .feature-group-grid'),
    "section.feature-flat-section", [
      { key: "reconnect", title: "Kết nối lại", open: true },
      { key: "reload", title: "Tự tải lại khi lỗi kéo dài", open: false },
    ]);

  const interfaceSections = [...document.querySelectorAll('#featurePanels [data-panel="interface"] > .card-body > .interface-groups > details')]
    .map((section) => {
      const key = section.dataset.panel || "feature-management";
      section.classList.add("ui-section");
      section.id ||= `interface-section-${key}`;
      section.dataset.uiSectionKey = `interface:${key}`;
      return { section, open: false };
    });
  const allSections = [...questSections, ...connectionSections, ...interfaceSections];
  if (!allSections.length) return;

  const storagePrefix = "popupSectionOpen:v1:";
  const storageKey = (section) => storagePrefix + section.dataset.uiSectionKey;
  let pending = {};
  let ready = false;
  let saveQueue = Promise.resolve();

  for (const { section, open } of allSections) section.open = open;

  function save(section, open) {
    const key = storageKey(section);
    saveQueue = saveQueue
      .catch(() => {})
      .then(() => chrome.storage.local.set({ [key]: open }))
      .catch(() => {});
  }
  function remember(section, open) {
    if (!section?.matches?.("details.ui-section")) return;
    const key = section.dataset.uiSectionKey;
    if (!key) return;
    if (!ready) pending[key] = open;
    save(section, open);
  }
  function setOpen(section, open) {
    remember(section, open);
    section.open = open;
  }
  globalThis.GSTFeatureSectionLayout = { setOpen };

  for (const { section } of allSections) {
    const summary = section.querySelector(":scope > summary");
    section.addEventListener("click", (event) => {
      if ((event.target === summary || summary.contains(event.target)) && event.detail !== 0) {
        remember(section, !section.open);
      }
    }, true);
    summary?.addEventListener("keydown", (event) => {
      if (!event.repeat && event.key === "Enter") remember(section, !section.open);
    }, true);
    summary?.addEventListener("keyup", (event) => {
      if (event.key === " ") remember(section, !section.open);
    }, true);
  }

  void (async () => {
    let stored = {};
    try {
      stored = await chrome.storage.local.get(allSections.map(({ section }) => storageKey(section)));
    } catch (_) {}
    for (const { section, open } of allSections) {
      const key = section.dataset.uiSectionKey;
      const persisted = stored?.[storageKey(section)];
      section.open = Object.hasOwn(pending, key) ? pending[key]
        : typeof persisted === "boolean" ? persisted
        : open;
    }
    ready = true;
    for (const { section } of allSections) {
      const key = section.dataset.uiSectionKey;
      if (Object.hasOwn(pending, key)) save(section, pending[key]);
    }
    pending = {};
  })();
})();
