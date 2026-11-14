(() => {
  "use strict";
  const panel = document.querySelector('[data-panel="farm"]');
  const body = panel.querySelector(':scope > .card-body');
  const oldGrid = panel.querySelector('.farm-grid');
  const byId = (id) => document.getElementById(id);
  const groups = document.createElement('div');
  groups.className = 'farm-organized';
  oldGrid.before(groups);
  const destinations = {};
  for (const [key, title] of [['range', 'Phạm vi & di chuyển'], ['targets', 'Mục tiêu & chiến đấu'],
    ['defense', 'Tự vệ & né nguy hiểm'], ['recovery', 'Hồi máu & dùng đan'],
    ['revive', 'Hồi sinh & tiếp tục Farm'], ['interaction', 'Nhặt đồ & tương tác'],
    ['display', 'Hiển thị & phím tắt']]) {
    const section = document.createElement('details');
    section.className = 'farm-section'; section.id = 'farm-section-' + key;
    const heading = document.createElement('summary'); heading.textContent = title;
    const content = document.createElement('div'); content.className = 'farm-section-body';
    section.append(heading, content); groups.append(section); destinations[key] = content;
  }
  const sectionStoragePrefix = 'farmSectionOpen:v1:';
  const legacySectionStorageKey = 'farmSectionOpen:v1';
  const sectionDefaults = Object.fromEntries([...groups.children].map((section) =>
    [section.id, ['farm-section-range', 'farm-section-targets', 'farm-section-revive'].includes(section.id)]));
  let sectionOpen = { ...sectionDefaults }, pendingSectionOpen = {}, sectionsReady = false;
  const sectionStorageKey = (id) => sectionStoragePrefix + id.slice('farm-section-'.length);
  function logSectionState(event, id, detail = {}) {
    console.info('[GST Auto Farm UI]', event, { section: id, ...detail });
  }
  function saveSectionOpen(id, open) {
    try {
      chrome.storage.local.set({ [sectionStorageKey(id)]: open }).then(() => {
        logSectionState('saved', id, { open });
      }).catch((error) => {
        logSectionState('save-failed', id, { open, error: error?.message ?? String(error) });
      });
    } catch (error) {
      logSectionState('save-threw', id, { open, error: error?.message ?? String(error) });
    }
  }
  function rememberSectionOpen(section, open) {
    if (!Object.hasOwn(sectionDefaults, section?.id)) return;
    sectionOpen[section.id] = open;
    if (!sectionsReady) pendingSectionOpen[section.id] = open;
    logSectionState('change-requested', section.id, { open, ready: sectionsReady });
    saveSectionOpen(section.id, open);
  }
  function setSectionOpen(section, open) {
    rememberSectionOpen(section, open);
    section.open = open;
  }
  globalThis.GSTFarmSectionLayout = { setOpen: setSectionOpen };
  for (const section of groups.children) {
    const summary = section.querySelector(':scope > summary');
    section.addEventListener('click', (event) => {
      if (event.target === summary || summary.contains(event.target)) {
        logSectionState('summary-click', section.id, { detail: event.detail, open: section.open });
        if (event.detail !== 0) rememberSectionOpen(section, !section.open);
      }
    }, true);
    summary.addEventListener('keydown', (event) => {
      if (!event.repeat && event.key === 'Enter') rememberSectionOpen(section, !section.open);
    }, true);
    summary.addEventListener('keyup', (event) => {
      if (event.key === ' ') rememberSectionOpen(section, !section.open);
    }, true);
  }
  void (async () => {
    let stored = {};
    try {
      const keys = [...groups.children].map((section) => sectionStorageKey(section.id));
      stored = await chrome.storage.local.get([...keys, legacySectionStorageKey]);
    } catch (error) {
      logSectionState('load-failed', 'all', { error: error?.message ?? String(error) });
    }
    for (const section of groups.children) {
      const id = section.id;
      sectionOpen[id] = Object.hasOwn(pendingSectionOpen, id) ? pendingSectionOpen[id]
        : typeof stored?.[sectionStorageKey(id)] === 'boolean' ? stored[sectionStorageKey(id)]
        : typeof stored?.[legacySectionStorageKey]?.[id] === 'boolean' ? stored[legacySectionStorageKey][id]
        : sectionDefaults[id];
      logSectionState('restored', id, { open: sectionOpen[id], source: Object.hasOwn(pendingSectionOpen, id) ? 'pending'
        : typeof stored?.[sectionStorageKey(id)] === 'boolean' ? 'storage'
        : typeof stored?.[legacySectionStorageKey]?.[id] === 'boolean' ? 'legacy-storage' : 'default' });
    }
    sectionsReady = true;
    for (const section of groups.children) section.open = sectionOpen[section.id];
    for (const [id, open] of Object.entries(pendingSectionOpen)) saveSectionOpen(id, open);
  })();
  const mirrors = [];
  function move(nodes, key) {
    nodes = nodes.filter(Boolean);
    if (!nodes.length) return;
    const sources = new Set();
    for (const node of nodes) for (let parent = node.parentElement; parent; parent = parent.parentElement) {
      if (parent.tagName === 'FIELDSET') sources.add(parent);
    }
    const wrapper = document.createElement('fieldset'); wrapper.className = 'farm-section-controls';
    mirrors.push({ wrapper, sources });
    wrapper.append(...nodes); destinations[key].append(wrapper);
  }
  function pair(id, key) {
    const label = byId(id).closest('label');
    const hint = label.nextElementSibling;
    move([label, hint?.matches('.hint') ? hint : null], key);
  }
  function flatten(details, key) {
    const content = details.querySelector(':scope > .advanced-body');
    const summary = details.querySelector(':scope > summary');
    // Preserve IDs used by existing summary writers, without another accordion.
    summary.hidden = true;
    move([details], key);
    details.open = true; details.classList.add('farm-flat');
    content.classList.add('farm-flat-body');
  }
  pair('farmShowRange', 'display');
  pair('farmAutoRespawn', 'revive');
  move([byId('farmReturnDeath').closest('div.separated')], 'revive');
  pair('farmAllowPlayerTargets', 'targets');
  move([byId('breakSeals').closest('div.separated')], 'targets');
  pair('farmAcceptPartyInvites', 'interaction');
  flatten(byId('farmEncounterSummary').closest('details'), 'interaction');
  flatten(byId('farmPreferLoot').closest('details'), 'interaction');
  const retreat = byId('farmBossRetreat').closest('label');
  const thresholds = retreat.nextElementSibling;
  const error = thresholds.nextElementSibling;
  const help = error.nextElementSibling;
  move([retreat, thresholds, error, help], 'recovery');
  flatten(byId('farmRecoverySummary').closest('details'), 'recovery');
  flatten(byId('potionSummary').closest('details'), 'recovery');
  flatten(byId('farmBossSummary').closest('details'), 'defense');
  flatten(byId('farmDefenseSummary').closest('details'), 'defense');
  flatten(byId('farmShowTargetLine').closest('details'), 'display');
  const shortcut = byId('farmShortcutSummary').closest('details');
  const inner = shortcut.querySelector('details.diagnostic');
  const innerHeading = inner.querySelector(':scope > summary');
  const shortcutTitle = document.createElement('p');
  shortcutTitle.append(...innerHeading.childNodes); innerHeading.replaceWith(shortcutTitle);
  inner.replaceWith(...inner.children);
  flatten(shortcut, 'display');
  for (const [selector, key] of [['.farm-left', 'range'], ['.farm-target', 'targets']]) {
    const column = oldGrid.querySelector(selector);
    column.querySelector('.farm-group-title')?.remove();
    move([column], key);
  }
  const idle = byId('farmIdleMode');
  move([idle.previousElementSibling, idle, idle.nextElementSibling], 'range');
  pair('farmKeepAcrossMaps', 'range');
  for (const label of groups.querySelectorAll('label.check-row')) {
    const input = label.querySelector(':scope > input[type="checkbox"]');
    const text = label.querySelector(':scope > span');
    if (!input || !text) continue;
    label.classList.replace('check-row', 'switch-row');
    input.classList.add('switch');
    label.insertBefore(text, input);
  }
  oldGrid.hidden = true;
  function syncLocks() {
    for (const { wrapper, sources } of mirrors) {
      const disabled = [...sources].some((source) => source.disabled);
      // A later move can observe an earlier mirror as a source. Rewriting
      // its reflected attribute unchanged would retrigger this observer forever.
      if (wrapper.disabled !== disabled) wrapper.disabled = disabled;
    }
  }
  const locks = new MutationObserver(syncLocks);
  for (const source of new Set(mirrors.flatMap(({ sources }) => [...sources])))
    locks.observe(source, { attributes: true, attributeFilter: ['disabled'] });
  syncLocks();

  const bar = document.createElement('details'); bar.className = 'farm-status-bar';
  const summary = document.createElement('summary');
  const runtime = document.createElement('span'), count = document.createElement('span');
  const closeStatus = document.createElement('button'); closeStatus.type = 'button';
  closeStatus.className = 'farm-status-close'; closeStatus.textContent = 'Đóng';
  closeStatus.setAttribute('aria-label', 'Thu gọn trạng thái Auto Farm');
  closeStatus.addEventListener('click', (event) => {
    event.preventDefault(); event.stopPropagation(); bar.open = false;
  });
  summary.append(runtime, count, closeStatus);
  const scope = document.createElement('p'); scope.className = 'hint'; scope.setAttribute('role', 'status');
  const filters = document.createElement('div'); filters.className = 'farm-status-filters';
  const list = document.createElement('div'); list.className = 'farm-status-chips';
  const entries = [
    ['farm', 'enabled', 'Vùng farm mở rộng', 'farmSearchScope'],
    ['farm', 'excludeBoss', 'Loại trừ boss', 'farmExcludeBoss'],
    ['farm', 'allowPlayerTargets', 'Nhắm người chơi', 'farmAllowPlayerTargets'],
    ['farm', 'breakSeals', 'Phá phong ấn', 'breakSeals'],
    ['farm', 'selfDefense', 'Tự vệ', 'farmSelfDefense'],
    ['farm', 'nearbyClear', 'Dọn quái gần', 'farmNearbyClear'],
    ['farm', 'bossDodge', 'Né boss', 'farmBossDodge'],
    ['farm', 'eliteDodge', 'Né tinh anh', 'farmEliteDodge'],
    ['farm', 'bossRetreat', 'Rút lui hồi HP', 'farmBossRetreat'],
    ['farm', 'noRetreat', 'Không nghỉ khi hết đan', 'farmNoRetreat'],
    ['farm', 'autoRespawn', 'Tự hồi sinh', 'farmAutoRespawn'],
    ['map', 'returnDeath', 'Quay lại điểm chết (chung)', 'farmReturnDeath'],
    ['session', 'keepFarm', 'Giữ Farm qua map (chung)', 'farmKeepAcrossMaps'],
    ['farm', 'preferLoot', 'Ưu tiên nhặt đồ', 'farmPreferLoot'],
    ['farm', 'autoEncounter', 'Nhận kỳ ngộ', 'farmAutoEncounter'],
    ['farm', 'acceptPartyInvites', 'Nhận tổ đội', 'farmAcceptPartyInvites'],
    ['farm', 'showRange', 'Vòng phạm vi', 'farmShowRange'],
    ['farm', 'showTargetLine', 'Đường mục tiêu', 'farmShowTargetLine'],
    ['potion', 'hpEnabled', 'Đan HP (độc lập & chung)', 'potionHpEnabled'],
    ['potion', 'mpEnabled', 'Đan MP (độc lập & chung)', 'potionMpEnabled']
  ];
  const defaultOn = new Set(['bossDodge', 'bossRetreat', 'noRetreat', 'autoRespawn', 'preferLoot', 'keepFarm']);
  let values = null, selected = 'on', sequence = 0;
  const buttons = new Map();
  for (const [key, title] of [['on', 'Bật'], ['off', 'Tắt'], ['all', 'Tất cả']]) {
    const button = document.createElement('button'); button.type = 'button'; button.textContent = title;
    button.addEventListener('click', () => { selected = key; render(); });
    filters.append(button); buttons.set(key, button);
  }
  function render() {
    const state = byId('autoFarmValue').dataset.state;
    runtime.textContent = state === 'on' ? 'Auto Farm: Đang chạy' : state === 'off' ? 'Auto Farm: Đang tắt' : 'Auto Farm: Chưa rõ';
    const rows = entries.map(([owner, key, title, id]) => ({ title, id,
      on: values ? (defaultOn.has(key) ? values[owner]?.[key] !== false : values[owner]?.[key] === true) : null }));
    const on = rows.filter((row) => row.on === true).length, off = rows.filter((row) => row.on === false).length;
    count.textContent = values ? `${on} bật / ${off} tắt` : '? Chưa đọc được cài đặt';
    for (const [key, button] of buttons) {
      button.setAttribute('aria-pressed', String(key === selected));
      button.textContent = key === 'on' ? `Bật (${on})` : key === 'off' ? `Tắt (${off})` : 'Tất cả';
    }
    const chips = rows.filter((row) => row.on === null || selected === 'all' || (selected === 'on') === row.on).map((row) => {
      const chip = document.createElement('button'); chip.type = 'button';
      chip.className = 'farm-status-chip'; chip.dataset.state = row.on === null ? 'unknown' : row.on ? 'on' : 'off';
      chip.textContent = `${row.on === null ? '?' : row.on ? '● Bật:' : '○ Tắt:'} ${row.title}`;
      chip.addEventListener('click', () => {
        const input = byId(row.id); const section = input.closest('.farm-section'); setSectionOpen(section, true);
        (input.closest('label') ?? input).scrollIntoView({ block: 'center', behavior: 'smooth' });
        section.querySelector('summary').focus({ preventScroll: true });
      });
      return chip;
    });
    list.replaceChildren(...chips);
  }
  async function refresh() {
    const request = ++sequence; values = null; scope.textContent = 'Đang đọc cài đặt của tab đã chọn…'; render();
    const session = globalThis.GSTPopupAccountSession;
    await globalThis.GSTPopupAccountContextPromise;
    const context = session.current(), version = session.version();
    try {
      const binding = await session.validate(context, version);
      if (!binding.valid || !binding.context?.verified) throw new Error('Unconfirmed account');
      const stored = await chrome.storage.local.get(['farmPreferences', GSTAccountProfiles.profilesKey, 'areaMapOptions', 'realmPreferences', 'potionPreferences']);
      const latest = await session.validate(binding.context, version);
      if (request !== sequence || session.version() !== version) return;
      if (!latest.valid) throw new Error('Account changed');
      values = { farm: GSTAccountProfiles.currentProfile(binding.context, 'farm', stored),
        map: stored.areaMapOptions ?? {}, session: stored.realmPreferences ?? {}, potion: stored.potionPreferences ?? {} };
      scope.textContent = `Cài đặt đã lưu: ${binding.context.accountLabel || binding.context.character}. Đã bật không có nghĩa đang thực hiện; mục “chung” áp dụng nhiều nick.`;
    } catch { if (request !== sequence) return; scope.textContent = 'Chưa xác nhận đúng nick hoặc chưa đọc được dữ liệu; không coi là đã tắt.'; }
    if (request === sequence) render();
  }
  bar.append(summary, scope, filters, list); body.append(bar);
  const runtimeObserver = new MutationObserver(render);
  runtimeObserver.observe(byId('autoFarmValue'), { attributes: true, attributeFilter: ['data-state'] });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && ['farmPreferences', GSTAccountProfiles.profilesKey, 'areaMapOptions', 'realmPreferences', 'potionPreferences'].some((key) => changes[key])) void refresh();
  });
  window.addEventListener('gst:popup-account-context-change', () => { void refresh(); });
  window.addEventListener('pagehide', () => { locks.disconnect(); runtimeObserver.disconnect(); sequence++; }, { once: true });
  void refresh();
})();
