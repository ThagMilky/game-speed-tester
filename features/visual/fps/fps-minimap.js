(() => {
  "use strict";
  globalThis.GSTFpsMinimap = {
    handler(scene, active, zoom = () => 1) {
      let cache = null;
      return function (original, args) {
        const [x, y] = args, { w, h, canvas, base } = this;
        if (!active() || this.off || !base || canvas?.width !== 168 || canvas.height !== 168
            || ![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0
            || typeof scene.collision?.blockedCell !== "function") return original.apply(this, args);
        const factor = zoom(), worldW = w * factor, worldH = h * factor;
        const span = Math.min(32, w, h) * factor, scale = 168 / span;
        const left = Math.max(0, Math.min(worldW - span, x * factor - span / 2));
        const bottom = Math.max(0, Math.min(worldH - span, y * factor - span / 2));
        const gx = Math.floor(left / 8) * 8, gy = Math.ceil((bottom + span) / 8) * 8, cells = Math.ceil(span) + 16;
        // Retain a padded viewport while it still covers the visible region.
        // Camera movement within it needs only a new draw offset, not a repaint.
        if (!cache || cache.w !== worldW || cache.h !== worldH || cache.cells !== cells
            || left < cache.x || left + span > cache.x + cache.cells
            || bottom < cache.y - cache.cells || bottom + span > cache.y
            || cache.collision !== scene.collision) {
          const image = document.createElement("canvas"); image.width = image.height = cells * 8;
          const paint = image.getContext("2d");
          if (!paint) return original.apply(this, args);
          for (let row = 0; row < cells; row++) for (let col = 0; col < cells; col++) {
            const cx = gx + col + 0.5, cy = gy - row - 0.5;
            const outside = cx < 0 || cy < 0 || cx >= worldW || cy >= worldH;
            paint.fillStyle = outside ? "#0b1015" : scene.collision.blockedCell(cx, cy) ? "#66727e" : "#202932";
            paint.fillRect(col * 8, row * 8, 8, 8);
            paint.fillStyle = "#34414d";
            paint.fillRect(col * 8, row * 8, 8, 1); paint.fillRect(col * 8, row * 8, 1, 8);
          }
          cache = { x: gx, y: gy, w: worldW, h: worldH, cells, collision: scene.collision, image };
        }
        const context = canvas.getContext("2d");
        if (!context) return original.apply(this, args);
        const draw = context.drawImage, descriptor = Object.getOwnPropertyDescriptor(context, "drawImage");
        // Replace only the native terrain draw during this synchronous call.
        // Native markers, player indicator, safe zone, PK and controls stay intact.
        context.drawImage = function (source, ...rest) {
          if (source !== base) return draw.call(this, source, ...rest);
          return draw.call(this, cache.image, (cache.x - left) * scale, 168 - (cache.y - bottom) * scale,
            cache.cells * scale, cache.cells * scale);
        };
        try { return original.apply(this, args); }
        finally {
          if (descriptor) Object.defineProperty(context, "drawImage", descriptor); else delete context.drawImage;
        }
      };
    }
  };
})();
