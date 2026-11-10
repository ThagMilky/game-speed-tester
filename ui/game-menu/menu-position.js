(() => {
  "use strict";
  const presets = { "top-center": [0.5, 0], "top-left": [0, 0], "top-right": [1, 0],
    "bottom-left": [0, 1], "bottom-center": [0.5, 1], "bottom-right": [1, 1] };
  const clamp = (value, fallback) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : fallback;
  globalThis.GSTMenuPosition = { presets, normalize(value) {
    const position = value?.position === "custom" || Object.hasOwn(presets, value?.position) ? value.position : "top-center";
    const point = presets[position];
    return { position, x: point ? point[0] : clamp(value?.x, 0.5), y: point ? point[1] : clamp(value?.y, 0) };
  } };
})();
