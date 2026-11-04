(() => {
  "use strict";
  const previous = new WeakMap(), finite = Number.isFinite;
  function crossed(scene, nav, point, tolerance) {
    const old = previous.get(nav), fix = scene.self?.fix;
    if (!old || !finite(fix) || old.fix !== fix || !finite(scene.px) || !finite(scene.py)) return false;
    const dx = scene.px - old.x, dy = scene.py - old.y, square = dx * dx + dy * dy;
    if (square < 1e-10) return false;
    const t = ((point[0] - old.x) * dx + (point[1] - old.y) * dy) / square;
    return t > 0 && t < 1 && Math.hypot(old.x + t * dx - point[0], old.y + t * dy - point[1]) < tolerance;
  }
  function prune(scene, nav, host, native = false) {
    const old = previous.get(nav), point = nav.path?.[0], next = nav.path?.[1];
    if (!old || (nav === scene.auto && !native) || old.path !== nav.path || !Array.isArray(point) || !Array.isArray(next)
        || !old.point || old.point[0] !== point[0] || old.point[1] !== point[1]
        || !point.every(finite) || !next.every(finite) || point.length !== 2 || next.length !== 2) return;
    if (crossed(scene, nav, point, 0.35) && host.clear(scene.px, scene.py, next[0], next[1])) nav.path.shift();
  }
  globalThis.GSTNavigation = {
    remember(scene, nav, gx, gy) {
      previous.set(nav, { x: scene.px, y: scene.py, fix: scene.self?.fix, path: nav.path,
        point: Array.isArray(nav.path?.[0]) ? [...nav.path[0]] : null, goal: [gx, gy] });
    },
    walk(scene, nav, host, time, x, y, gx, gy, reach) {
      if (nav === scene.auto) return scene.auto.walk.call(nav, host, time, x, y, gx, gy, reach);
      if (typeof host.clear === "function") prune(scene, nav, host);
      const result = scene.auto.walk.call(nav, host, time, x, y, gx, gy, reach);
      previous.set(nav, { x: scene.px, y: scene.py, fix: scene.self?.fix, path: nav.path,
        point: Array.isArray(nav.path?.[0]) ? [...nav.path[0]] : null, goal: [gx, gy] });
      return result;
    },
    arrived(scene, nav, host, gx, gy, reach) {
      if (Math.hypot(scene.px - gx, scene.py - gy) <= reach) return true;
      const old = previous.get(nav);
      return !!old && old.goal[0] === gx && old.goal[1] === gy && crossed(scene, nav, [gx, gy], reach)
        && typeof host.clear === "function" && host.clear(scene.px, scene.py, gx, gy);
    },
    prune
  };
})();
