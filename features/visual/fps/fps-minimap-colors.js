(() => {
  "use strict";
  globalThis.GSTFpsMinimapColors = {
    handler(scene, preferences) {
      return function (original, args) {
        const settings = preferences(), dots = args[2], canvas = this.canvas;
        if (!settings.enabled || this.off || !this.base || !Array.isArray(dots)
            || canvas?.width !== 168 || canvas.height !== 168 || !scene.views?.values || !Array.isArray(scene.npcs)) {
          return original.apply(this, args);
        }
        // Native dots have no actor ID. Match only known native marker shapes
        // at exact scene coordinates, preserving portals/resources/quest guides.
        const result = dots.map((dot) => ({ ...dot })), markers = new Map();
        const key = (x, y, color, radius) => `${x}:${y}:${color}:${radius}`;
        dots.forEach((dot, index) => {
          const id = key(dot.x, dot.y, dot.c, dot.r);
          if (!markers.has(id)) markers.set(id, []);
          markers.get(id).push(index);
        });
        function replace(entity, colors, radius, color, size, omit = false) {
          let index = -1;
          for (const c of colors) for (const r of radius) {
            const entries = markers.get(key(entity.x, entity.y, c, r));
            if (index < 0 && entries?.length) index = entries.pop();
          }
          if (index >= 0) { result[index] = omit ? null : { ...result[index], c: color, r: size }; }
          else if (!omit && Number.isFinite(entity.x) && Number.isFinite(entity.y)) {
            result.push({ x: entity.x, y: entity.y, c: color, r: size });
          }
        }
        for (const npc of scene.npcs) replace(npc, ["#ffd23a", "#f2e2b0"], [2.5, 3.5], "#52e080", 2.5);
        for (const actor of scene.views.values()) {
          if (actor.dead) continue;
          if (actor.k === "p") {
            replace(actor, ["#8cf07a", "#6fb8ff"], [2.8], "#55aaff", 2.8, actor.id === scene.you);
          } else if (actor.k === "m" && actor.st && actor.st.cls !== "pet") {
            const boss = actor.st?.cls === "boss" || actor.st?.wb === true;
            replace(actor, ["#ff3b2f", "#ffb23a", "#e24a3a"], [1.6, 3], boss ? "#c875ff" : "#ff5353", boss ? 3.5 : 2);
          }
        }
        const realm = scene.self?.realm?.inside;
        for (const chest of realm?.chests ?? []) {
          replace(chest, ["#d5b16d", "#7ff0ff", "#d795ff"], [3], "#ffbe45", 3);
        }
        if (realm?.boss) {
          replace(realm.boss, ["#ff535e"], [4], "#c875ff", 4, realm.boss.hp === 0);
        }
        const context = canvas.getContext("2d");
        if (!context) return original.apply(this, args);
        const fill = context.fill, descriptor = Object.getOwnPropertyDescriptor(context, "fill");
        context.fill = function (...values) {
          const previous = this.fillStyle;
          if (previous === "#fff7da") this.fillStyle = settings.selfColor;
          try { return fill.apply(this, values); } finally { this.fillStyle = previous; }
        };
        try { return original.apply(this, [args[0], args[1], result.filter(Boolean), ...args.slice(3)]); }
        finally {
          if (descriptor) Object.defineProperty(context, "fill", descriptor); else delete context.fill;
        }
      };
    }
  };
})();
