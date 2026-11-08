(() => {
  "use strict";
  const channel = "gst:area-map:v1", origin = "https://nghichthienky.online";
  const allowed = /^(?:Period|Comma|Slash|Semicolon|Quote|BracketLeft|BracketRight|Backslash|Minus|Equal|Backquote|Key[A-Z]|Digit[0-9]|F(?:[1-9]|10))$/;
  const keys = { Period: 190, Comma: 188, Slash: 191, Semicolon: 186, Quote: 222,
    BracketLeft: 219, BracketRight: 221, Backslash: 220, Minus: 189, Equal: 187, Backquote: 192 };
  let shortcut = "Period", farmShortcut = null, suspended = false, ui = null;
  // Snapshot memory belongs to the map, not to the open/closed dialog.
  // Per-map caches last until the page session ends, without writing game
  // coordinates to persistent extension storage.
  const knownMaps = new Map(), unkeyedMaps = new WeakMap();
  const defaults = { npcs: true, resources: true, gates: true, portals: true,
    exits: true, clickMove: false, returnDeath: false };
  let options = { ...defaults };
  const normalize = (value) => Object.fromEntries(Object.keys(defaults)
    .map((key) => [key, typeof value?.[key] === "boolean" ? value[key] : defaults[key]]));
  const mapKey = (map) => typeof map?.scene === "string"
    ? map.scene + ":" + map.w + "x" + map.h : null;
  let observer = null;
  const valid = Number.isFinite;
  const sceneNow = () => window.game?.scene?.getScene?.("world")
    ?? (window.__ntkScene?.sys?.settings?.key === "world" ? window.__ntkScene : null);
  function shortcutNumber(code) {
    if (keys[code]) return keys[code];
    if (/^Key[A-Z]$/.test(code)) return code.charCodeAt(3);
    if (/^Digit[0-9]$/.test(code)) return code.charCodeAt(5);
    return /^F(?:[1-9]|10)$/.test(code) ? Number(code.slice(1)) + 111 : null;
  }
  function level(entity) {
    const n = entity?.lv ?? entity?.level ?? entity?.lvl ?? entity?.st?.lv ?? entity?.st?.level;
    return Number.isSafeInteger(n) && n > 0 && n <= 10000 ? n : null;
  }
  const boss = (enemy) => enemy?.cls === "boss" || enemy?.wb === true
    || enemy?.st?.cls === "boss" || enemy?.st?.wb === true || enemy?.boss === true;
  const inside = (map, point) => point && valid(point.x) && valid(point.y)
    && point.x >= 0 && point.y >= 0 && point.x < map.w && point.y < map.h;
  let campsPromise = null;
  function loadCamps(state, map) {
    // The game's loader also reads this asset. It may contain fixed camp
    // coordinates absent from the current monster snapshots; use only
    // explicit finite positions, never invent a camp from its set name.
    if (typeof map.scene !== "string") return;
    if (!campsPromise) campsPromise = fetch("data/camps.json", { cache: "force-cache" })
      .then((response) => response.ok ? response.json() : null).catch(() => null);
    campsPromise.then((data) => {
      if ((mapKey(map) ? knownMaps.get(mapKey(map)) : unkeyedMaps.get(map)) !== state) return;
      const camps = data?.[map.scene]?.camps;
      if (!Array.isArray(camps)) return;
      for (const entry of camps.slice(0, 2000)) {
        const point = { x: entry?.x ?? entry?.ax, y: entry?.y ?? entry?.ay };
        if (!inside(map, point)) continue;
        addCamp(state, { ...point, level: level(entry), boss: boss(entry),
          live: false, source: "camps" });
      }
    }).catch(() => { /* Optional static data; live markers still work. */ });
  }
  function addCamp(state, item) {
    const match = state.camps.find((camp) => camp.boss === item.boss
      && (camp.level === item.level || camp.level === null || item.level === null)
      && Math.hypot(camp.x - item.x, camp.y - item.y) < (item.boss ? 4 : 6));
    if (match) {
      if (match.level === null) match.level = item.level;
      if (item.source === "camps" && match.source === "seen") match.source = "camps";
      if (item.live) { match.live = true; match.count++; }
      return;
    }
    state.camps.push({ ...item, count: item.live ? 1 : 0 });
  }
  function setScene(state, scene) {
    state.scene = scene; state.map = scene.map; state.collision = scene.collision;
    state.terrain = null; state.terrainFailed = false;
    state.scanAt = 0; state.markers = []; state.zoom = 1;
    state.center = { x: scene.map.w / 2, y: scene.map.h / 2 };
    state.camps = memoryFor(scene).camps;
  }
  function memoryFor(scene) {
    const map = scene.map;
    const key = mapKey(map);
    let memory = key ? knownMaps.get(key) : unkeyedMaps.get(map);
    if (!memory) {
      memory = { camps: [], lastScan: -Infinity };
      if (key) {
        knownMaps.set(key, memory);
        if (knownMaps.size > 12) knownMaps.delete(knownMaps.keys().next().value);
      } else unkeyedMaps.set(map, memory);
      for (const entry of Array.isArray(map.monsters) ? map.monsters : []) {
        const point = { x: entry?.x ?? entry?.ax, y: entry?.y ?? entry?.ay };
        if (inside(map, point)) addCamp(memory, { ...point, level: level(entry),
          boss: boss(entry), live: false, source: "map" });
      }
      loadCamps(memory, map);
    }
    return memory;
  }
  function remember(scene) {
    if (!scene?.sys?.isActive?.() || !scene.map || typeof scene.views?.values !== "function") return;
    const memory = memoryFor(scene), time = performance.now();
    if (time - memory.lastScan < 850) return;
    memory.lastScan = time;
    scan(memory, scene);
  }
  function scan(state, scene) {
    for (const camp of state.camps) { camp.live = false; camp.count = 0; }
    for (const actor of scene.views?.values?.() ?? []) {
      if (actor?.k !== "m" || actor.dead || actor.st?.cls === "pet" || !inside(scene.map, actor)) continue;
      addCamp(state, { x: actor.x, y: actor.y, level: level(actor), boss: boss(actor),
        live: true, source: "seen" });
    }
    // Never retain thousands of old markers as the player explores.
    if (state.camps.length > 1500) {
      const stable = state.camps.filter((c) => c.source === "map" || c.source === "camps");
      const recent = state.camps.filter((c) => c.source === "seen").slice(-Math.max(0, 1500 - stable.length));
      state.camps.splice(0, state.camps.length, ...stable, ...recent);
    }
  }
  function raster(state) {
    const map = state.map, collision = state.collision;
    if (!map || !valid(map.w) || !valid(map.h) || map.w <= 0 || map.h <= 0
        || typeof collision?.blockedCell !== "function") return null;
    const density = Math.max(0.08, Math.min(2, 2048 / map.w, 2048 / map.h, Math.sqrt(700000 / (map.w * map.h))));
    const w = Math.max(1, Math.round(map.w * density)), h = Math.max(1, Math.round(map.h * density));
    const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d"); if (!ctx) return null;
    return { canvas, ctx, w, h, row: 0, image: ctx.createImageData(w, h) };
  }
  function paintRaster(state) {
    const t = state.terrain;
    if (!t || t.row >= t.h) return;
    const deadline = performance.now() + 2.5;
    try {
      do {
        const row = t.row++;
        for (let col = 0; col < t.w; col++) {
          const x = (col + 0.5) * state.map.w / t.w;
          const y = state.map.h - (row + 0.5) * state.map.h / t.h;
          const blocked = !!state.collision.blockedCell(x, y), at = (row * t.w + col) * 4;
          t.image.data[at] = blocked ? 106 : 31;
          t.image.data[at + 1] = blocked ? 117 : 46;
          t.image.data[at + 2] = blocked ? 126 : 57;
          t.image.data[at + 3] = 255;
        }
      } while (t.row < t.h && performance.now() < deadline);
      if (t.row >= t.h) t.ctx.putImageData(t.image, 0, 0);
    } catch { state.terrain = null; state.terrainFailed = true; }
  }
  function clamp(state, w, h) {
    const map = state.map;
    if (!map) return;
    const unit = Math.min(w / map.w, h / map.h) * state.zoom;
    if (!valid(unit) || unit <= 0) return;
    const hx = w / (2 * unit), hy = h / (2 * unit);
    state.center.x = hx >= map.w / 2 ? map.w / 2 : Math.max(hx, Math.min(map.w - hx, state.center.x));
    state.center.y = hy >= map.h / 2 ? map.h / 2 : Math.max(hy, Math.min(map.h - hy, state.center.y));
  }
  function draw() {
    if (!ui) return;
    const state = ui, scene = sceneNow(), { canvas, status } = state;
    if (state.scene && state.scene !== scene && (!scene?.sys?.isActive?.() || !scene.map)) {
      state.scene = null; state.map = null; state.collision = null;
      state.camps = []; state.terrain = null; state.terrainFailed = false; state.markers = [];
    }
    if (scene?.sys?.isActive?.() && scene.map && scene.collision
        && (state.map !== scene.map || state.collision !== scene.collision)) setScene(state, scene);
    const rect = canvas.getBoundingClientRect(), w = rect.width, h = rect.height;
    if (!w || !h) return;
    const dpr = Math.min(2, devicePixelRatio || 1), bw = Math.round(w * dpr), bh = Math.round(h * dpr);
    if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#101923"; ctx.fillRect(0, 0, w, h);
    if (!state.map) {
      status.textContent = "Chưa có dữ liệu khu vực. Hãy vào game rồi mở bản đồ lại.";
      return;
    }
    if (!state.terrain && !state.terrainFailed) state.terrain = raster(state);
    paintRaster(state); clamp(state, w, h);
    const map = state.map, unit = Math.min(w / map.w, h / map.h) * state.zoom;
    const sx = (x) => w / 2 + (x - state.center.x) * unit;
    const sy = (y) => h / 2 + (state.center.y - y) * unit;
    const left = sx(0), top = sy(map.h), width = map.w * unit, height = map.h * unit;
    ctx.fillStyle = "#23323b"; ctx.fillRect(left, top, width, height);
    if (state.terrain?.row === state.terrain?.h) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(state.terrain.canvas, left, top, width, height);
    }
    ctx.strokeStyle = "#658395"; ctx.lineWidth = 1; ctx.strokeRect(left, top, width, height);
    if (unit >= 16) {
      const xMin = Math.max(0, Math.ceil(state.center.x - w / (2 * unit)));
      const xMax = Math.min(map.w, Math.floor(state.center.x + w / (2 * unit)));
      const yMin = Math.max(0, Math.ceil(state.center.y - h / (2 * unit)));
      const yMax = Math.min(map.h, Math.floor(state.center.y + h / (2 * unit)));
      ctx.strokeStyle = "#91aab526"; ctx.beginPath();
      for (let x = xMin; x <= xMax && x < xMin + 160; x++) { ctx.moveTo(sx(x), top); ctx.lineTo(sx(x), top + height); }
      for (let y = yMin; y <= yMax && y < yMin + 160; y++) { ctx.moveTo(left, sy(y)); ctx.lineTo(left + width, sy(y)); }
      ctx.stroke();
    }
    if (scene && scene.map === map) remember(scene);
    if (scene && scene.map === map && scene.auto?.on && valid(scene.px) && valid(scene.py)) {
      const job = globalThis.GSTFarmMap?.journey?.(scene);
      const live = scene.views?.get?.(scene.auto.target);
      const goal = job ?? (!live?.dead ? live : null);
      if (inside(map, goal)) {
        const path = Array.isArray(job?.path) ? job.path : scene.auto.path;
        const points = Array.isArray(path) ? path.filter((p) => Array.isArray(p) && p.length === 2
          && p.every(valid)).slice(0, 80) : [];
        if (!points.length && inside(map, job?.next)) points.push([job.next.x, job.next.y]);
        if (points.length && !job?.waiting) {
          ctx.strokeStyle = "#6af1d2"; ctx.lineWidth = 2; ctx.beginPath();
          ctx.moveTo(sx(scene.px), sy(scene.py));
          for (const p of points) ctx.lineTo(sx(p[0]), sy(p[1]));
          ctx.stroke();
        }
        ctx.strokeStyle = "#6af1d2"; ctx.beginPath();
        ctx.arc(sx(goal.x), sy(goal.y), 7, 0, Math.PI * 2); ctx.stroke();
      }
    }
    state.markers = [];
    const place = (point, type, label, color, size = 4) => {
      if (!inside(map, point)) return;
      const x = sx(point.x), y = sy(point.y);
      if (x < -65 || x > w + 65 || y < -20 || y > h + 20) return;
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, size, 0, Math.PI * 2); ctx.fill();
      if (unit >= 4) {
        ctx.font = "11px system-ui"; ctx.textBaseline = "middle";
        const width = Math.min(175, ctx.measureText(label).width);
        ctx.fillStyle = "#06121cde"; ctx.fillRect(x + 7, y - 9, width + 10, 18);
        ctx.save(); ctx.beginPath(); ctx.rect(x + 9, y - 8, width + 6, 16); ctx.clip();
        ctx.fillStyle = color; ctx.fillText(label, x + 11, y); ctx.restore();
      }
      state.markers.push({ x, y, item: { type, x: point.x, y: point.y, label,
        ready: point.ready, ore: point.ore } });
    };
    for (const gate of options.gates && Array.isArray(map.gates) ? map.gates : []) {
      if (!inside(map, gate)) continue;
      const x = sx(gate.x), y = sy(gate.y);
      if (x < -15 || x > w + 15 || y < -15 || y > h + 15) continue;
      ctx.fillStyle = "#94b9ff"; ctx.fillRect(x - 4, y - 4, 8, 8);
      state.markers.push({ x, y, item: { ...gate, type: "gate" } });
    }
    for (const camp of [...state.camps].sort((a, b) => Number(a.live) - Number(b.live))) {
      const x = sx(camp.x), y = sy(camp.y);
      if (x < -80 || x > w + 80 || y < -20 || y > h + 20) continue;
      const label = camp.boss ? (camp.level === null ? "Boss" : "Boss Lv." + camp.level)
        : camp.level === null ? "Bãi quái" : "Lv." + camp.level;
      const color = camp.boss ? "#d19bff" : camp.live ? "#ffb867" : "#9bb2be";
      ctx.globalAlpha = camp.live || camp.source === "map" ? 1 : 0.56;
      ctx.beginPath(); ctx.arc(x, y, camp.boss ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
      ctx.font = "bold 11px system-ui"; ctx.textBaseline = "middle";
      const measured = ctx.measureText(label).width;
      ctx.fillStyle = "#06121ce0"; ctx.fillRect(x + 7, y - 9, measured + 10, 18);
      ctx.fillStyle = color; ctx.fillText(label, x + 12, y);
      ctx.globalAlpha = 1;
      state.markers.push({ x, y, item: { ...camp, type: "camp" } });
    }
    if (scene?.map === map) {
      if (options.npcs) for (const npc of Array.isArray(scene.npcs) ? scene.npcs.slice(0, 300) : [])
        place(npc, "npc", String(npc.info?.name ?? "NPC").slice(0, 70), "#ffe3a2", 4.5);
      if (options.resources) for (const node of Array.isArray(scene.nodes) ? scene.nodes.slice(0, 1200) : [])
        place(node, "resource", String(node.item ?? (node.ore ? "Quặng" : "Linh thảo")).slice(0, 70)
          + (node.ready ? " · Sẵn sàng" : " · Chưa sẵn sàng"),
          node.ready ? (node.ore ? "#9ee4ff" : "#68e6a0") : "#687b81", 3.5);
      const realmState = scene.self?.realm;
      if (options.portals && !realmState?.inside && Array.isArray(realmState?.events))
        for (const portal of realmState.events.slice(0, 100)) {
          if (portal.host !== map.scene || portal.closing || !valid(portal.ends)
              || !valid(realmState.now) || portal.ends <= realmState.now) continue;
          place(portal, "realm-portal", String(portal.name ?? "Cổng bí cảnh").slice(0, 70), "#ff87b0", 6);
        }
    }
    // Unlike ordinary enemies, realm metadata is available at any distance,
    // including sealed objectives, chest positions and exit coordinates.
    const realm = scene?.map === map ? scene.self?.realm?.inside : null;
    if (realm) {
      const markers = [];
      const b = realm.boss;
      if (inside(map, b) && valid(b.hp) && b.hp > 0)
        markers.push({ type: "realm-boss", x: b.x, y: b.y, hp: b.hp, label: "BOSS", color: "#ff576d" });
      for (const seal of Array.isArray(realm.seals) ? realm.seals : [])
        if (inside(map, seal) && valid(seal.hits) && seal.hits > 0)
          markers.push({ type: "seal", x: seal.x, y: seal.y, hits: seal.hits,
            label: "Ấn " + seal.hits, color: "#f3a967" });
      for (const chest of Array.isArray(realm.chests) ? realm.chests : [])
        if (inside(map, chest))
          markers.push({ type: "chest", x: chest.x, y: chest.y, kind: chest.kind,
            label: chest.kind === "hidden" ? "Rương ẩn" : chest.kind === "treasure" ? "Linh tàng" : "Rương",
            color: chest.kind === "hidden" ? "#78e9f2" : "#f6da72" });
      for (const exit of options.exits && Array.isArray(realm.exits) ? realm.exits : [])
        if (Array.isArray(exit) && exit.length >= 2
            && inside(map, { x: exit[0], y: exit[1] }))
          markers.push({ type: "exit", x: exit[0], y: exit[1],
            label: "Thoát", color: "#68b5ff" });
      for (const marker of markers) {
        const x = sx(marker.x), y = sy(marker.y);
        if (x < -75 || x > w + 75 || y < -20 || y > h + 20) continue;
        ctx.globalAlpha = 1;
        ctx.fillStyle = marker.color;
        ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#07101c"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.font = "bold 11px system-ui"; ctx.textBaseline = "middle";
        const measured = ctx.measureText(marker.label).width;
        ctx.fillStyle = "#06121ce0"; ctx.fillRect(x + 7, y - 9, measured + 10, 18);
        ctx.fillStyle = marker.color; ctx.fillText(marker.label, x + 12, y);
        state.markers.push({ x, y, item: marker });
      }
    }
    const travel = scene?.map === map ? globalThis.GSTMapTravel?.snapshot(scene) : null;
    if (travel && inside(map, travel)) {
      const points = Array.isArray(travel.path) ? travel.path.filter((p) =>
        Array.isArray(p) && p.length === 2 && p.every(valid)).slice(0, 80) : [];
      ctx.strokeStyle = "#ffdc76"; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(sx(scene.px), sy(scene.py));
      for (const point of points) ctx.lineTo(sx(point[0]), sy(point[1]));
      if (!points.length) ctx.lineTo(sx(travel.x), sy(travel.y));
      ctx.stroke();
      ctx.fillStyle = "#ffdc76"; ctx.beginPath(); ctx.arc(sx(travel.x), sy(travel.y), 7, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffdc76"; ctx.stroke();
    }
    if (scene?.map === map && valid(scene.px) && valid(scene.py)) {
      ctx.beginPath(); ctx.arc(sx(scene.px), sy(scene.py), 6, 0, Math.PI * 2);
      ctx.fillStyle = "#fffdec"; ctx.fill(); ctx.strokeStyle = "#182832"; ctx.lineWidth = 2; ctx.stroke();
    }
    status.textContent = String(map.title ?? map.scene ?? "Khu vực") + " · " + map.w + "×" + map.h
      + " ô · " + state.camps.length + " bãi đã biết" + (realm ? " · Bí cảnh" : "")
      + (state.terrain && state.terrain.row < state.terrain.h ? " · Đang dựng địa hình…" : "")
      + (globalThis.GSTMapTravel?.status() ? " · " + GSTMapTravel.status() : "");
    if (state.stopTravel) state.stopTravel.disabled = !globalThis.GSTMapTravel?.active(scene);
  }
  function zoom(state, factor, x, y) {
    const w = state.canvas.clientWidth, h = state.canvas.clientHeight, map = state.map;
    if (!map || !w || !h) return;
    const before = Math.min(w / map.w, h / map.h) * state.zoom;
    const ax = state.center.x + (x - w / 2) / before;
    const ay = state.center.y - (y - h / 2) / before;
    state.zoom = Math.max(1, Math.min(16, state.zoom * factor));
    const after = Math.min(w / map.w, h / map.h) * state.zoom;
    state.center.x = ax - (x - w / 2) / after;
    state.center.y = ay + (y - h / 2) / after;
    clamp(state, w, h);
  }
  function close() {
    if (!ui) return;
    cancelAnimationFrame(ui.raf); ui.root.remove(); ui = null;
  }
  function loop() {
    if (!ui || suspended) return;
    const current = performance.now();
    // Redraw at 6 fps while open. Terrain is built in small time slices
    // to avoid blocking the game's render/update loop.
    if (current - ui.lastPaint >= (ui.terrain && ui.terrain.row < ui.terrain.h ? 35 : 160)) {
      ui.lastPaint = current;
      try { draw(); } catch { ui.status.textContent = "Không thể vẽ bản đồ lúc này; dữ liệu game có thể đang thay đổi."; }
    }
    ui.raf = requestAnimationFrame(loop);
  }
  function open() {
    if (ui || suspended || !document.body) return;
    const root = document.createElement("div"); root.id = "gst-area-map";
    const shadow = root.attachShadow({ mode: "closed" });
    shadow.innerHTML = '<style>:host{all:initial!important;position:fixed!important;inset:0!important;z-index:2147483646!important;background:#04090ddd!important;display:flex!important;align-items:center!important;justify-content:center!important;color:#edf6fa;font:13px/1.4 system-ui;pointer-events:auto!important}*{box-sizing:border-box}button{border:1px solid #7f9dad;border-radius:7px;background:#233a48;color:#eef6fa;padding:7px 11px;font:inherit;cursor:pointer}button:hover,button:focus-visible{border-color:#71e7cf}section{display:flex;flex-direction:column;width:min(1100px,96vw);height:min(810px,94vh);background:#111b25;border:1px solid #718e9e;border-radius:13px;overflow:hidden;box-shadow:0 18px 75px #000b}header,footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:10px 13px}header{border-bottom:1px solid #485f6b}footer{border-top:1px solid #485f6b;color:#c2d1da}h2{font-size:16px;margin:0 auto 0 0}#map{flex:1;min-height:0;overflow:hidden;touch-action:none;cursor:grab}#map:active{cursor:grabbing}canvas{width:100%;height:100%;display:block}#legend{padding:0 13px 9px;font-size:11px;color:#a5baca}#detail{flex:1;min-width:180px}#filters{display:flex;align-items:center;flex-wrap:wrap;gap:6px 13px;padding:9px 13px;background:#172630;border-bottom:1px solid #415865}#filters label{display:inline-flex;align-items:center;gap:5px;cursor:pointer;white-space:nowrap}#filters input{accent-color:#6af1d2}button:disabled{opacity:.45;cursor:default}@media(max-width:600px){section{height:96vh;width:98vw}h2{width:100%}header,footer{padding:8px}}</style>'
      + '<section role="dialog" aria-modal="true" aria-label="Bản đồ toàn khu vực"><header><h2>Bản đồ toàn khu vực</h2><button id="less" title="Thu nhỏ">−</button><button id="more" title="Phóng to">＋</button><button id="here">Về nhân vật</button><button id="close">Đóng ×</button></header><div id="filters" role="group" aria-label="Tùy chọn bản đồ"><label><input type="checkbox" data-option="npcs"> NPC</label><label><input type="checkbox" data-option="resources"> Thu hoạch</label><label><input type="checkbox" data-option="gates"> Cổng dịch chuyển</label><label><input type="checkbox" data-option="portals"> Cổng bí cảnh</label><label><input type="checkbox" data-option="exits"> Cổng thoát</label><label><input type="checkbox" data-option="clickMove"> Click để di chuyển</label><label><input type="checkbox" data-option="returnDeath"> Quay lại nơi chết (trừ bí cảnh)</label></div><div id="map"><canvas aria-label="Bản đồ có vị trí bãi quái"></canvas></div><div id="legend">Trắng: nhân vật · Cam: quái đang thấy · Xám: đã thấy · Tím: boss · Đỏ: boss bí cảnh · Vàng: rương · Xanh: cổng thoát · Ấn: phong ấn · Xanh ngọc: tuyến đã có. Kéo để xem, cuộn để phóng to. Khi bật Click để di chuyển, chọn một điểm sẽ bắt đầu hành trình.</div><footer><span id="status">Đang đọc bản đồ…</span><span id="detail">Chạm biểu tượng để xem chi tiết.</span><button id="stopTravel" type="button">Dừng di chuyển</button></footer></section>';
    document.body.append(root);
    const scene = sceneNow(), canvas = shadow.querySelector("canvas");
    ui = { root, shadow, canvas, status: shadow.getElementById("status"), detail: shadow.getElementById("detail"),
      scene: null, map: null, collision: null, center: { x: 0, y: 0 }, zoom: 1,
      camps: [], markers: [], scanAt: 0, terrain: null, terrainFailed: false,
      raf: 0, lastPaint: -Infinity, drag: null, stopTravel: shadow.getElementById("stopTravel") };
    if (scene?.sys?.isActive?.() && scene.map && scene.collision) setScene(ui, scene);
    for (const input of shadow.querySelectorAll("[data-option]")) {
      const key = input.dataset.option;
      input.checked = options[key] === true;
      input.addEventListener("change", () => {
        options = { ...options, [key]: input.checked };
        globalThis.GSTMapTravel?.configure(options);
        window.postMessage({ channel, type: "options", options: { ...options } }, origin);
      });
    }
    ui.stopTravel.addEventListener("click", () => globalThis.GSTMapTravel?.cancel());
    const more = shadow.getElementById("more"), less = shadow.getElementById("less");
    more.addEventListener("click", () => zoom(ui, 1.5, canvas.clientWidth / 2, canvas.clientHeight / 2));
    less.addEventListener("click", () => zoom(ui, 1 / 1.5, canvas.clientWidth / 2, canvas.clientHeight / 2));
    shadow.getElementById("here").addEventListener("click", () => {
      const current = sceneNow();
      if (!ui?.map || current?.map !== ui.map) return;
      ui.center = { x: valid(current.px) ? current.px : ui.map.w / 2,
        y: valid(current.py) ? current.py : ui.map.h / 2 }; ui.zoom = Math.max(ui.zoom, 3);
    });
    const closeButton = shadow.getElementById("close");
    closeButton.addEventListener("click", close);
    for (const event of ["pointerdown", "pointerup", "pointermove", "click", "wheel"])
      root.addEventListener(event, (e) => e.stopPropagation());
    const viewport = shadow.getElementById("map");
    viewport.addEventListener("pointerdown", (e) => {
      if (!ui || e.button !== 0) return;
      viewport.setPointerCapture(e.pointerId);
      ui.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, distance: 0 };
    });
    viewport.addEventListener("pointermove", (e) => {
      const drag = ui?.drag, map = ui?.map;
      if (!drag || drag.id !== e.pointerId || !map) return;
      const unit = Math.min(canvas.clientWidth / map.w, canvas.clientHeight / map.h) * ui.zoom;
      ui.center.x -= (e.clientX - drag.x) / unit;
      ui.center.y += (e.clientY - drag.y) / unit;
      drag.distance += Math.hypot(e.clientX - drag.x, e.clientY - drag.y);
      drag.x = e.clientX; drag.y = e.clientY;
    });
    viewport.addEventListener("pointerup", (e) => {
      const drag = ui?.drag;
      if (!drag || drag.id !== e.pointerId) return;
      ui.drag = null;
      if (drag.distance > 6) return;
      const rect = canvas.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
      const found = ui.markers.map((m) => ({ marker: m, d: Math.hypot(m.x - x, m.y - y) }))
        .filter((m) => m.d < 15).sort((a, b) => a.d - b.d)[0]?.marker?.item;
      const unit = Math.min(canvas.clientWidth / ui.map.w, canvas.clientHeight / ui.map.h) * ui.zoom;
      const point = found ?? { x: ui.center.x + (x - canvas.clientWidth / 2) / unit,
        y: ui.center.y - (y - canvas.clientHeight / 2) / unit };
      if (!inside(ui.map, point)) return;
      if (!found) ui.detail.textContent = "Điểm " + point.x.toFixed(1) + ", " + point.y.toFixed(1);
      else {
      const coord = "(" + found.x.toFixed(1) + ", " + found.y.toFixed(1) + ")";
      if (found.type === "gate") ui.detail.textContent = "Cổng tới " + String(found.to ?? "map khác") + " " + coord;
      else if (found.type === "realm-boss") ui.detail.textContent = "Boss bí cảnh · HP còn " + found.hp + " · " + coord;
      else if (found.type === "seal") ui.detail.textContent = "Phong ấn · còn " + found.hits + " đòn · " + coord;
      else if (found.type === "chest") ui.detail.textContent = "Rương bí cảnh · " + String(found.kind ?? "chưa rõ loại") + " · " + coord;
      else if (found.type === "exit") ui.detail.textContent = "Cổng thoát bí cảnh · " + coord;
      else if (found.type === "npc") ui.detail.textContent = "NPC · " + found.label + " " + coord;
      else if (found.type === "resource") ui.detail.textContent = (found.ore ? "Quặng" : "Linh thảo")
        + " · " + found.label + " " + coord;
      else if (found.type === "realm-portal") ui.detail.textContent = found.label + " " + coord;
      else ui.detail.textContent = (found.boss ? "Boss" : "Bãi quái") + " · "
        + (found.level === null ? "Chưa biết level" : "Lv." + found.level)
        + " · " + (found.live ? "Đang thấy"
          : found.source === "map" || found.source === "camps" ? "Dữ liệu map" : "Đã thấy trước đó") + " " + coord;
      }
      if (options.clickMove) {
        const result = globalThis.GSTMapTravel?.go(sceneNow(), point.x, point.y);
        if (typeof result === "string") ui.detail.textContent = result;
      }
    });
    viewport.addEventListener("pointercancel", () => { if (ui) ui.drag = null; });
    viewport.addEventListener("wheel", (e) => {
      e.preventDefault(); if (!ui?.map) return;
      const rect = canvas.getBoundingClientRect();
      zoom(ui, e.deltaY < 0 ? 1.25 : 0.8, e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });
    loop(); closeButton.focus();
  }
  function toggle() { if (ui) close(); else open(); }
  function keyHandler(e) {
    if (suspended || e.isComposing || e.repeat || !e.isTrusted) return;
    if (ui) {
      if (e.key === "Tab" || e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === "Enter" || e.key === " ") {
        const focused = ui.shadow.activeElement;
        if (focused?.tagName === "BUTTON") {
          e.preventDefault(); e.stopImmediatePropagation(); focused.click(); return;
        }
      }
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.key === "Escape" || e.code === shortcut || (shortcut === "Period" && e.code === "NumpadDecimal")) close();
      return;
    }
    if (!(e.code === shortcut || (shortcut === "Period" && e.code === "NumpadDecimal"))
        || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey
        || document.getElementById("gst-game-menu")?.dataset.open === "true") return;
    if ([e.target, ...e.composedPath()].some((n) => n instanceof HTMLElement
        && (n.isContentEditable || n.matches("input,textarea,select,[role='textbox']")))) return;
    const scene = sceneNow();
    if (scene?.keyCapture || scene?.chat?.typing || scene?.inputFieldActive?.()
        || scene?.panels?.open || scene?.overlay?.dialogOpen) return;
    const number = shortcutNumber(shortcut);
    if (number === farmShortcut || Object.values(scene?.controls?.bindings ?? {}).includes(number)) return;
    e.preventDefault(); e.stopImmediatePropagation(); open();
  }
  window.addEventListener("keydown", keyHandler, true);
  window.addEventListener("message", (e) => {
    if (e.source !== window || e.origin !== origin || e.data?.channel !== channel) return;
    if (e.data.type === "configure") {
      shortcut = typeof e.data.code === "string" && allowed.test(e.data.code)
        && !["KeyM", "KeyV"].includes(e.data.code) ? e.data.code : "Period";
      farmShortcut = Number.isSafeInteger(e.data.farmKey) ? e.data.farmKey : null;
      options = normalize(e.data.options);
      globalThis.GSTMapTravel?.configure(options);
      if (ui) for (const input of ui.shadow.querySelectorAll("[data-option]"))
        input.checked = options[input.dataset.option] === true;
    } else if (e.data.type === "toggle") toggle();
  });
  observer = setInterval(() => {
    if (suspended) return;
    try { remember(sceneNow()); } catch { /* A scene change must never affect gameplay. */ }
  }, 1100);
  window.addEventListener("pagehide", () => { suspended = true; close(); clearInterval(observer); observer = null; });
  window.addEventListener("pageshow", () => {
    suspended = false;
    if (!observer) observer = setInterval(() => {
      try { remember(sceneNow()); } catch { /* Fail closed on a changing scene. */ }
    }, 1100);
    window.postMessage({ channel, type: "ready" }, origin);
  });
  window.postMessage({ channel, type: "ready" }, origin);
})();
