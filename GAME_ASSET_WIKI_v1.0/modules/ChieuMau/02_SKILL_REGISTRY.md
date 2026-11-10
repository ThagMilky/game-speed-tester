# Skill registry and scheduler

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

**CONFIRMED**: `Vt` is a `Map`; `ue(t)` at 16525 stores entries by `t.id`; `oo(cls)` at 16555 combines sprite metadata from registered entries (optionally filtered by class). `ba` at 115477 registers six-family/special moves; `Ao` at 130697 registers later class-four move definitions.

**CONFIRMED**: Registry entries store `id`, `cls`, FX `sheets`, revision metadata `rev`, `pin`, visual hit color/spark/knock, `lastHit`, `delay`, `onHit` and `play` closures. `play` creates a time-based list of effect callbacks; registration itself does not establish game mechanics.

**CONFIRMED**: `Mt.castRegistry(...)` finds `Vt.get(a.id)` and requires matching `cls`; it captures caster, target, normalized direction, up to 5 `foes`, contact, interval, `Math.max(1,a.hits??1)`, and event callbacks. `events` sorted by `at`; `Mt.update(dt)` increments local elapsed time and runs due callbacks. `Mt.hit` finds eligible active cast with `cast.t >= contact - .15` and `cast.t <= end`, tracks per-target hitCount, schedules delayed FX when defined, emits sound/critical notification, and returns a boolean. It does not, here, apply damage to entity HP.

**CONFIRMED**: `Mt.on` defaults enabled unless browser URL query has `chieu=0`; `Mt.sounds` starts false. `Mt.preload` and `Mt.ensure` resolve sprite assets; `Mt` initialization warms sprite textures via `postupdate`.

**UNKNOWN**: Exact contract and timing of the caller of `Mt.hit` and `Mt.castRegistry`; whether hit events are server-sent or predicted cannot be decided without call sites.
