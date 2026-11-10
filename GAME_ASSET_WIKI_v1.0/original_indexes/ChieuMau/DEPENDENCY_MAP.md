# DEPENDENCY_MAP.md

All edges are source observations, not proof of runtime execution.

## Imports

- `./phaser-DRI6y8R5.js`: `P as ht` → `ht.BlendModes`, `ht.Math.Vector2`, Phaser texture/display objects. **CONFIRMED**
- `./index-BIkbGDKp.js`: `f as ae` → flash gate; `c as ne` → camera shake gate; `R as Te` → reduced-motion-like gate (`Te.matches`). **CONFIRMED** for use; name semantics partly **INFERRED**.
- `./Character-DhQJ_Q0g.js`: `A as xo` → `xo.play/hit`; `e as Jt` → `Jt.init/want/lay/crit`. **CONFIRMED**.

## Exports

- `ye as C` (alias of `Mt`) → consumer-facing cast/FX orchestrator.
- `Po as J` → effect engine.
- `io as a` → compact mapping of selected skill IDs to classes.
- `Vt as b` → registry map.
- `_e as c` → effect/revision metadata map.

## Graph

`Scene` → `Mt` → `Po` visual engine

`Mt` → `Vt` skill registry (`ue`,`oo`) → `ba` or `Ao` registered `play` and `onHit` callbacks

`play` callbacks → schedule `Mt.update` event queue → `wt`/`vt` animation pools and `Po` overlays

`Mt.hit` → hit effects (`Po.stop/flash/knock/number/sparks`) → `Jt.crit` / `xo.hit`; optional callback hooks

`wt`/`vt` → injected `actorFn`, `env`, `toWorld` → external world / actor / terrain state

`Mt` → `host.actor`, `host.me`, `host.env`, `host.toWorld` → unresolved integration dependencies

## Unresolved edges

- External caller(s) of `Mt.castRegistry` and `Mt.hit`; chronology relative to authoritative events. **UNKNOWN**
- Source of `kit` (`range`, `contact`, `interval`, `hits`, `effects`, `shape`) and validity guarantees. **UNKNOWN**
- Phaser scene lifetime, texture resources and image `fx-chieu/`, `4/` and `6/`; missing PNG files. **UNKNOWN**
- External Character audio signal semantics and preference settings. **UNKNOWN**
- Optional `env.terrain`/`env.impact` behavior, whether anything persists to game state. **UNKNOWN**
- Network transport, server calculations, actual DPS, cooldowns, collisions and status effects. **UNKNOWN**
