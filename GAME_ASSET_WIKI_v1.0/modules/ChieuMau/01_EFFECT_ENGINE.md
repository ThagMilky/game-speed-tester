# Runtime effects, rendering, and lifecycle

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

## `Po` (central effect engine)

**CONFIRMED**: `Po` preallocates 384 particles (`H`), 16 arcs, 12 rings, 24 ground decals, 24 additive lights, 64 animated sprite sheets, 28 afterimages and 14 floating damage text slots. It creates 64×64 glow and 64×32 scorch textures dynamically, as well as graphics layers and full-screen flash/dim rectangles. For emissions, fixed pools select an unused slot, otherwise reuse a prior slot.

**CONFIRMED**: Particles use typed arrays for position, velocity, elapsed age, lifetime, gravity, exponential drag and floor collision; `draw(e)` advances movement and draws primitive shapes. For velocity `vx`, `vx *= exp(-drag*dt)` and `vy = vy*exp(-drag*dt)+gravity*dt`; positions advance by `v*dt`. Sprite frames progress with `floor(elapsed*fps)`, with optional loops, alpha fades and follower coordinates. Camera shake and hit-stop are local presentation state.

**CONFIRMED**: `rate(entity)` returns 0 if local stop >0, otherwise 1; no proof this controls authoritative game simulation. `flash`, `knock`, `shake`, `screenFlash`, `screenDim` and `number` affect presentation only in this file. Preferences `ae()`, `ne()` and `Te.matches` gate some screen effects. `destroy()` disposes render objects.

## Method offsets

### `Po`

- `Po.constructor` at `797` (end `4364 `).
- `Po.preload` at `4364` (end `4532 `).
- `Po.define` at `4532` (end `4569 `).
- `Po.ready` at `4569` (end `4624 `).
- `Po.sheet` at `4624` (end `5301 `).
- `Po.warm` at `5301` (end `5579 `).
- `Po.hold` at `5579` (end `5689 `).
- `Po.stop` at `5689` (end `5776 `).
- `Po.flash` at `5776` (end `5839 `).
- `Po.knock` at `5839` (end `5936 `).
- `Po.rate` at `5936` (end `5993 `).
- `Po.flashing` at `5993` (end `6058 `).
- `Po.offset` at `6058` (end `6304 `).
- `Po.shake` at `6304` (end `6542 `).
- `Po.screenFlash` at `6542` (end `6677 `).
- `Po.screenDim` at `6677` (end `6776 `).
- `Po.slash` at `6776` (end `7031 `).
- `Po.ring` at `7031` (end `7204 `).
- `Po.light` at `7204` (end `7488 `).
- `Po.ghost` at `7488` (end `7885 `).
- `Po.decal` at `7885` (end `8613 `).
- `Po.gash` at `8613` (end `8860 `).
- `Po.particle` at `8860` (end `9185 `).
- `Po.sparks` at `9185` (end `9374 `).
- `Po.chips` at `9374` (end `9592 `).
- `Po.motes` at `9592` (end `9821 `).
- `Po.number` at `9821` (end `10118 `).
- `Po.busy` at `10118` (end `10229 `).
- `Po.update` at `10229` (end `12880 `).
- `Po.draw` at `12880` (end `16133 `).
- `Po.setUnderDepth` at `16133` (end `16173 `).
- `Po.destroy` at `16173` (end `16501 `).

### `wt`

- `wt.constructor` at `38779` (end `39401 `).
- `wt.of` at `39401` (end `39573 `).
- `wt.actor` at `39573` (end `39605 `).
- `wt.lay` at `39605` (end `39645 `).
- `wt.snd` at `39645` (end `39784 `).
- `wt.px` at `39784` (end `39808 `).
- `wt.centre` at `39808` (end `39879 `).
- `wt.ter` at `39879` (end `39937 `).
- `wt.dir8` at `39937` (end `40006 `).
- `wt.dir16` at `40006` (end `40079 `).
- `wt.dur` at `40079` (end `40133 `).
- `wt.dir5` at `40133` (end `40314 `).
- `wt.take` at `40314` (end `40425 `).
- `wt.fx` at `40425` (end `41365 `).
- `wt.fly` at `41365` (end `41429 `).
- `wt.flyNow` at `41429` (end `41620 `).
- `wt.on` at `41620` (end `41702 `).
- `wt.move` at `41702` (end `42122 `).
- `wt.place` at `42122` (end `42224 `).
- `wt.impact` at `42224` (end `42784 `).
- `wt.ghosts` at `42784` (end `42902 `).
- `wt.update` at `42902` (end `43342 `).
- `wt.destroy` at `43342` (end `43409 `).

### `vt`

- `vt.constructor` at `126037` (end `126677 `).
- `vt.of` at `126677` (end `126849 `).
- `vt.actor` at `126849` (end `126881 `).
- `vt.lay` at `126881` (end `126921 `).
- `vt.snd` at `126921` (end `127060 `).
- `vt.px` at `127060` (end `127084 `).
- `vt.centre` at `127084` (end `127155 `).
- `vt.ter` at `127155` (end `127213 `).
- `vt.dir8` at `127213` (end `127282 `).
- `vt.dir16` at `127282` (end `127355 `).
- `vt.has` at `127355` (end `127377 `).
- `vt.dur` at `127377` (end `127419 `).
- `vt.take` at `127419` (end `127530 `).
- `vt.fx` at `127530` (end `128563 `).
- `vt.fly` at `128563` (end `128627 `).
- `vt.flyNow` at `128627` (end `128818 `).
- `vt.on` at `128818` (end `128900 `).
- `vt.move` at `128900` (end `129312 `).
- `vt.place` at `129312` (end `129414 `).
- `vt.impact` at `129414` (end `129974 `).
- `vt.ghosts` at `129974` (end `130092 `).
- `vt.update` at `130092` (end `130532 `).
- `vt.destroy` at `130532` (end `130599 `).

### `Mt`

- `Mt.constructor` at `194800` (end `195076 `).
- `Mt.snd` at `195076` (end `195222 `).
- `Mt.lay` at `195222` (end `195399 `).
- `Mt.preload` at `195399` (end `195539 `).
- `Mt.ensure` at `195539` (end `195893 `).
- `Mt.petFx` at `195893` (end `196225 `).
- `Mt.has` at `196225` (end `196258 `).
- `Mt.cast` at `196258` (end `197091 `).
- `Mt.hanQuang` at `197091` (end `198408 `).
- `Mt.onDich` at `198408` (end `199503 `).
- `Mt.bite` at `199503` (end `199962 `).
- `Mt.maDiem` at `199962` (end `201676 `).
- `Mt.baQuyen` at `201676` (end `203428 `).
- `Mt.castRegistry` at `203428` (end `204262 `).
- `Mt.hit` at `204262` (end `206262 `).
- `Mt.update` at `206262` (end `206670 `).

