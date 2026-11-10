(() => {
  "use strict";
  globalThis.GSTFpsMinimapZoom = {
    handler(factor) {
      return function (original, args) {
        const zoom = factor(), { w, h, safe } = this;
        if (![2, 3, 4].includes(zoom) || this.off || !this.base || !Array.isArray(args[2])
            || this.canvas?.width !== 168 || this.canvas.height !== 168 || w <= 0 || h <= 0
            || ![w, h, args[0], args[1]].every(Number.isFinite)) return original.apply(this, args);
        // Native draw uses a fixed 32-unit viewport. Change only its temporary
        // drawing coordinate system, including every marker and safe zone.
        const dots = args[2].map((dot) => ({ ...dot, x: dot.x / zoom, y: dot.y / zoom }));
        this.w = w / zoom; this.h = h / zoom;
        if (safe) this.safe = { ...safe, x: safe.x / zoom, y: safe.y / zoom, r: safe.r / zoom };
        try { return original.apply(this, [args[0] / zoom, args[1] / zoom, dots, ...args.slice(3)]); }
        finally { this.w = w; this.h = h; this.safe = safe; }
      };
    }
  };
})();
