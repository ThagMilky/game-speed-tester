(() => {
  "use strict";
  let state = null, serial = 0;
  function clear() {
    if (!state) return;
    state.backdrop.destroy();
    for (const item of state.chunks.values()) { item.image.destroy(); state.scene.textures.remove(item.key); }
    state = null;
  }
  function prepare(scene) {
    if (state && (state.scene !== scene || state.collision !== scene.collision || state.map !== scene.map)) clear();
    if (state) return state;
    const { w, h } = scene.map ?? {}, collision = scene.collision;
    const resolution = collision?.cols / w;
    if (!Number.isInteger(w) || !Number.isInteger(h) || w <= 0 || h <= 0
        || ![1, 2, 4, 8, 16].includes(resolution) || collision.rows !== h * resolution
        || typeof collision.blockedCell !== "function" || typeof scene.toPx !== "function") return null;
    const zero = scene.toPx(0, 0), one = scene.toPx(1, 1), scale = one[0] - zero[0];
    if (zero[0] !== 0 || zero[1] !== h * 32 || scale !== 32 || one[1] - zero[1] !== -32) return null;
    // Keep one cheap solid surface while detailed grid chunks are being built.
    // Readiness of a newly visible chunk must never reveal native terrain again.
    const backdrop = scene.add.graphics().setDepth(-951);
    backdrop.fillStyle(0x202932, 1).fillRect(0, 0, w * 32, h * 32);
    state = { scene, map: scene.map, collision, resolution, backdrop, chunks: new Map(), visuals: [], scanAt: -Infinity };
    return state;
  }
  function paint(owner, cx, cy) {
    const canvas = document.createElement("canvas"); canvas.width = canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas unavailable");
    context.fillStyle = "#202932"; context.fillRect(0, 0, 512, 512);
    context.fillStyle = "#66727e";
    const count = 16 * owner.resolution, unit = 32 / owner.resolution;
    for (let row = 0; row < count; row++) {
      let start = -1;
      for (let col = 0; col <= count; col++) {
        const x = cx * 16 + (col + 0.5) / owner.resolution;
        const y = owner.map.h - cy * 16 - (row + 0.5) / owner.resolution;
        const blocked = col < count && (x >= owner.map.w || y < 0 || owner.collision.blockedCell(x, y));
        if (blocked && start < 0) start = col;
        if (!blocked && start >= 0) { context.fillRect(start * unit, row * unit, (col - start) * unit, unit); start = -1; }
      }
    }
    // One grid cell is one world unit. Bake lines into the cached image,
    // leaving the collision subcells intact instead of filling whole cells.
    context.fillStyle = "#34414d";
    for (let edge = 0; edge < 512; edge += 32) {
      context.fillRect(edge, 0, 1, 512);
      context.fillRect(0, edge, 512, 1);
    }
    // The last chunk can extend beyond the map; keep that region distinct.
    const width = Math.max(0, Math.min(512, (owner.map.w - cx * 16) * 32));
    const height = Math.max(0, Math.min(512, (owner.map.h - cy * 16) * 32));
    context.fillStyle = "#0b1015";
    if (width < 512) context.fillRect(width, 0, 512 - width, 512);
    if (height < 512) context.fillRect(0, height, 512, 512 - height);
    const key = `gst:simple-map:${++serial}`;
    owner.scene.textures.addCanvas(key, canvas);
    const image = owner.scene.add.image(cx * 512, cy * 512, key).setOrigin(0, 0).setDepth(-950).setVisible(false);
    return { key, image };
  }
  function update(scene, preferences, mask) {
    const owner = preferences.simpleMap ? prepare(scene) : null;
    if (!preferences.simpleMap && state) clear();
    let ready = !preferences.simpleMap;
    if (owner) {
      const view = scene.cameras.main.worldView, needed = new Set();
      const left = Math.max(0, Math.floor(view.x / 512)), top = Math.max(0, Math.floor(view.y / 512));
      const right = Math.min(Math.ceil(owner.map.w / 16) - 1, Math.floor(view.right / 512));
      const bottom = Math.min(Math.ceil(owner.map.h / 16) - 1, Math.floor(view.bottom / 512));
      // Bound work even at extreme zoom: select at most 8 x 8 chunks nearest
      // the viewport center, with the solid backdrop covering the remainder.
      const centerX = Math.floor((view.x + view.width / 2) / 512);
      const centerY = Math.floor((view.y + view.height / 2) / 512);
      const startX = Math.max(left, Math.min(centerX - 3, right - 7));
      const startY = Math.max(top, Math.min(centerY - 3, bottom - 7));
      {
        for (let y = startY; y <= Math.min(bottom, startY + 7); y++) {
          for (let x = startX; x <= Math.min(right, startX + 7); x++) needed.add(`${x}:${y}`);
        }
        for (const [id, item] of owner.chunks) {
          if (!needed.has(id) && owner.chunks.size >= 64) { item.image.destroy(); scene.textures.remove(item.key); owner.chunks.delete(id); }
        }
        let budget = 2;
        for (const id of needed) if (!owner.chunks.has(id) && budget-- > 0) {
          if (owner.chunks.size >= 64) break;
          const [x, y] = id.split(":").map(Number); owner.chunks.set(id, paint(owner, x, y));
        }
        ready = true;
        for (const [id, item] of owner.chunks) {
          const visible = needed.has(id);
          if (item.image.visible !== visible) item.image.setVisible(visible);
        }
      }
    }
    if (preferences.hideVegetation || preferences.simpleMap && ready) for (const item of scene.sway ?? []) mask(item.img);
    if (preferences.hideBuildings || preferences.simpleMap && ready) for (const item of scene.occluders ?? []) mask(item.img);
    if (preferences.simpleMap && ready) {
      for (const image of scene.groundLoaded?.values?.() ?? []) mask(image);
      // Static map frames use m:<index>; actors and resources use separate world frames.
      if (performance.now() - owner.scanAt >= 1000) {
        owner.scanAt = performance.now(); owner.visuals = [];
        const frames = new Set((scene.map.frames ?? []).map((frame) => frame.tex));
        const tiles = [...(scene.map.tiles ?? [])].filter((tile) => Number.isFinite(tile.layer) && Number.isFinite(tile.order))
          .sort((a, b) => a.layer - b.layer || a.order - b.order);
        const bakedDepth = tiles.length ? tiles[0].layer * 1e5 + tiles[0].order - 1 : null;
        for (const image of scene.children.list) {
          const key = image.texture?.key;
          if (typeof key === "string" && (key.startsWith(`ground:${scene.map.scene}:`) || key === `ground-overview:${scene.map.scene}`
              || frames.has(key) && /^m:\d+$/.test(String(image.frame?.name)))) owner.visuals.push(image);
          else if (image.type === "RenderTexture" && bakedDepth !== null && image.depth === bakedDepth) owner.visuals.push(image);
        }
      }
      for (const image of owner.visuals) if (image.scene === scene) mask(image);
    }
    return !preferences.simpleMap || ready;
  }
  globalThis.GSTFpsMap = { update, clear };
})();
