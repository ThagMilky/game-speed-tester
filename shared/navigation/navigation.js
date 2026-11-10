(() => {
  "use strict";
  const previous = new WeakMap(), progress = new WeakMap(), finite = Number.isFinite;
  const movers = new Map();
  function detach(scene) {
    const entry = movers.get(scene); if (!entry) return;
    entry.intent = null;
    movers.delete(scene);
    scene.events.off("shutdown", entry.cleanup); scene.events.off("destroy", entry.cleanup);
    if (scene.move === entry.wrapper) {
      if (entry.descriptor) Object.defineProperty(scene, "move", entry.descriptor); else delete scene.move;
    }
  }
  function schedule(scene, nav, gx, gy, reach) {
    if (typeof scene.move !== "function" || !scene.events?.on || !scene.events.off) return;
    let entry = movers.get(scene);
    if (!entry) {
      const original = scene.move;
      entry = { descriptor: Object.getOwnPropertyDescriptor(scene, "move"), intent: null };
      entry.cleanup = () => detach(scene);
      entry.wrapper = function (delta, ...rest) {
        const intent = entry.intent; entry.intent = null;
        if (this === scene && intent && scene.self && scene.self.fix !== intent.fix
            && scene.autoX === intent.x && scene.autoY === intent.y && !GSTFarmInput.movement(scene)) {
          scene.autoX = scene.autoY = 0;
          return original.call(this, delta, ...rest);
        }
        if (this !== scene || !intent || !finite(delta) || delta <= 0 || !scene.self || scene.self.dead
            || scene.leaving || scene.dashT > 0 || GSTFarmInput.movement(scene) || scene.pendingSkill || scene.aiming
            || scene.self.fix !== intent.fix || scene.autoX !== intent.x || scene.autoY !== intent.y
            || Math.hypot(scene.px - intent.point[0], scene.py - intent.point[1]) > 3) return original.call(this, delta, ...rest);
        // Preserve native movement/collision and ms. Near a navigation
        // endpoint, split this frame's movement and stop at actual arrival,
        // rather than pretending a crossed, out-of-range point was reached.
        let remaining = delta, result;
        // Distribute the entire frame over at most 16 collision-checked steps.
        // The old fixed 1/240-second cap silently discarded surplus time
        // on frames longer than 16/240 seconds (unless already at the goal).
        const stepSize = Math.max(1 / 240, delta / 16);
        for (let i = 0; remaining > 1e-8 && i < 16; i++) {
          if (Math.hypot(scene.px - intent.point[0], scene.py - intent.point[1]) <= intent.reach) {
            scene.autoX = scene.autoY = 0; break;
          }
          const step = i === 15 ? remaining : Math.min(remaining, stepSize);
          result = original.call(this, step, ...rest); remaining -= step;
        }
        return result;
      };
      movers.set(scene, entry); scene.move = entry.wrapper;
      scene.events.on("shutdown", entry.cleanup); scene.events.on("destroy", entry.cleanup);
    }
    const point = Array.isArray(nav.path?.[0]) ? nav.path[0] : [gx, gy];
    if (!Array.isArray(point) || point.length !== 2 || !point.every(finite)) return;
    entry.intent = { nav, x: scene.autoX, y: scene.autoY, fix: scene.self?.fix, point: [...point],
      reach: Math.hypot(point[0] - gx, point[1] - gy) < 0.01 ? reach : 0.25 };
  }
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
  function invalidate(scene, owner) {
    if (!owner?.navigation) return;
    owner.navigation.path = [];
    owner.navigation.pathAt = -Infinity;
    const entry = movers.get(scene);
    if (entry?.intent?.nav === owner.navigation) entry.intent = null;
  }
  // Shared bounded route-leg selection for farm, seal, chest and realm exits.
  // Use only game collision/route APIs. A leg stays selected until reached
  // instead of reselecting every frame and pulling the player backwards.
  function leg(scene, owner, host, gx, gy, allowed = () => true) {
    const px = scene?.px, py = scene?.py, time = scene?.now?.();
    if (![px, py, gx, gy, time].every(finite) || !owner
        || typeof host?.clear !== "function" || typeof host?.route !== "function") return null;
    const pos = { x: px, y: py }, goal = { x: gx, y: gy };
    owner.legArrived = false;
    const range = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
    if (owner.legGoal && range(owner.legGoal, goal) > 2.5) {
      resetLeg(owner); invalidate(scene, owner);
    }
    owner.legGoal = goal;
    if (owner.checkpoint) {
      if (range(owner.checkpoint, pos) > 1.2) {
        if (allowed(owner.checkpoint)) return owner.checkpoint;
        // The intermediate point became invalid, not successfully reached.
        resetLeg(owner, true); invalidate(scene, owner);
        owner.legGoal = goal;
      } else {
        owner.visited ??= [];
        owner.visited.push(owner.checkpoint);
        if (owner.visited.length > 8) owner.visited.shift();
        owner.checkpoint = null;
        invalidate(scene, owner);
        // Callers use different time units (scene seconds vs UI milliseconds).
        owner.legArrived = true;
      }
    }
    const remaining = range(pos, goal);
    if (!allowed(goal)) return null;
    if (remaining <= 2.2 || time < (owner.directUntil ?? -Infinity)) return goal;
    if (time < (owner.checkpointRetryAt ?? -Infinity)) return null;
    // Avoid expensive far-distance route probes which the game's limited
    // native grid may not support. Clear line-of-sight is cheap enough.
    if (host.clear(px, py, gx, gy)
        || (remaining <= 30 && host.route(px, py, gx, gy)?.length)) {
      owner.directUntil = time + 1.5;
      return goal;
    }
    let best = null, score = Infinity;
    const visited = owner.visited ?? [];
    const offsets = [0, 0.4, -0.4, 0.85, -0.85, 1.35, -1.35, 1.9, -1.9, 2.5, -2.5];
    const angle = Math.atan2(gy - py, gx - px);
    // A short nearby leg is useful when the forward 12-tile ring is blocked.
    for (const radius of [...new Set([Math.min(12, Math.max(3.5, remaining - 3)), 6, 3.5])]) {
      let routeProbes = 0;
      for (const offset of offsets) {
        const point = { x: px + Math.cos(angle + offset) * radius,
          y: py + Math.sin(angle + offset) * radius };
        if (!allowed(point) || visited.some((v) => range(v, point) < 3)) continue;
        if (!host.clear(px, py, point.x, point.y)) {
          // Route checks cost more than collision raycasts. Cap expensive
          // checks per ring, while still trying short/lateral clear legs.
          if (routeProbes >= 4) continue;
          routeProbes++;
          if (!host.route(px, py, point.x, point.y)?.length) continue;
        }
        const candidate = range(point, goal) + Math.abs(offset) * 1.8
          + (radius < 6 ? 1 : 0);
        if (candidate < score) { best = point; score = candidate; }
      }
      if (best) break;
    }
    if (best) owner.checkpoint = best;
    else owner.checkpointRetryAt = time + 0.9;
    invalidate(scene, owner);
    return best;
  }
  function resetLeg(owner, failed = false) {
    if (!owner) return;
    if (failed && owner.checkpoint) {
      owner.visited ??= [];
      owner.visited.push(owner.checkpoint);
      if (owner.visited.length > 8) owner.visited.shift();
    }
    owner.checkpoint = null;
    owner.legGoal = null;
    if (owner.navigation) {
      owner.navigation.path = [];
      owner.navigation.pathAt = -Infinity;
    }
    owner.directUntil = -Infinity;
    owner.checkpointRetryAt = -Infinity;
  }
  globalThis.GSTNavigation = {
    schedule, leg, resetLeg,
    cancel(scene, nav) {
      const entry = movers.get(scene);
      if (entry?.intent?.nav === nav) entry.intent = null;
    },
    progressed(scene, owner, path, gx, gy, threshold = 0.5) {
      const x = scene.px, y = scene.py, fix = scene.self?.fix;
      if (![x, y, gx, gy].every(finite)) return false;
      const point = path?.[0], valid = Array.isArray(point) && point.length === 2 && point.every(finite);
      const remaining = Math.hypot(gx - x, gy - y);
      let old = progress.get(owner), advanced = false;
      if (old && old.gx === gx && old.gy === gy && old.fix === fix) {
        advanced = old.remaining - remaining >= threshold || (valid && old.point
          && point[0] === old.point[0] && point[1] === old.point[1]
          && old.pointDistance - Math.hypot(point[0] - x, point[1] - y) >= threshold);
      } else old = null;
      // Keep the baseline until enough distance accumulates. A correction or a
      // new goal only rebases; neither counts as successful navigation.
      if (!old || advanced) old = { gx, gy, fix, remaining, point: null };
      if (valid && (!old.point || point[0] !== old.point[0] || point[1] !== old.point[1])) {
        old.point = [...point]; old.pointDistance = Math.hypot(point[0] - x, point[1] - y);
      }
      progress.set(owner, old);
      return advanced;
    },
    remember(scene, nav, gx, gy) {
      previous.set(nav, { x: scene.px, y: scene.py, fix: scene.self?.fix, path: nav.path,
        point: Array.isArray(nav.path?.[0]) ? [...nav.path[0]] : null, goal: [gx, gy] });
    },
    walk(scene, nav, host, time, x, y, gx, gy, reach) {
      if (nav === scene.auto) return scene.auto.walk.call(nav, host, time, x, y, gx, gy, reach);
      if (typeof host.clear === "function") prune(scene, nav, host);
      const result = scene.auto.walk.call(nav, host, time, x, y, gx, gy, reach);
      if (result) schedule(scene, nav, gx, gy, reach);
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
  window.addEventListener("pagehide", () => { for (const scene of [...movers.keys()]) detach(scene); });
})();
