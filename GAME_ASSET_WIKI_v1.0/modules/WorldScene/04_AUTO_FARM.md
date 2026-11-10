# Auto-farm controller (Q4) — client-side confirmed mechanics

**Primary locations:** `Q4` [UTF-16 682645–690190, line 866]; `A3.autoHost` [UTF-16 933672–936183, line 1143]; `A3.toggleAutoFarm` [UTF-16 932407–932714, line 1143]; `A3.backgroundAuto` [UTF-16 932714–933353, line 1143]; `A3.update` [UTF-16 1005385–1010138, line 1143].

## Configuration and controller state

Top-level declarations immediately before `Q4` include constants `bc=11` (radius from the initial auto anchor), `K4=.25` (human-input pause duration), `F4=.2` (decision interval), `V4=.4` (default HP potion threshold), `G4=.25` (default MP potion threshold), `_4=.95` (rest exit threshold), `W4=.25` (when to favor larger potion), `rm=3` (recent death stop count). Numeric selectable HP thresholds in `d0=[.3,.4,.5,.6]` and MP thresholds in `p0=[.15,.25,.35,.5]`. `g0` and `m0` read from localStorage `tm-auto-hp`, `tm-auto-mp` and accept values only from the respective fixed arrays.

`Q4.constructor` starts `on=false`, keeps anchor `ax/ay`, `target`, `think`, `pauseUntil`, potion timer and press cooldowns, skipped/reachability caches, path/stuck counters, resting state, death count, revive attempt time. `Q4.toggle` flips the flag, clears target/path caches, and captures the player position `e.pos()` as the new anchor.

## Tick order (`Q4.update`) — CONFIRMED

1. If disabled, return. If dead, zero steer, clear target/path, start death clock; keep death timestamps within 600 seconds, mark `stopOnRevive` when count reaches `rm`, try `e.respawn()` after `t-deadAt>5.3` and no more often than 2 seconds.
2. When alive after death, either shut down auto when death count hit 3 within 600s or resume with a note. **The file does not store the last death tile for navigation:** returning to the original anchor is shown; server respawn location is external.
3. Suppress decisions during `pauseUntil`, or until `think` interval of `.2s` elapses.
4. If `resting`, invoke `rest`. Otherwise read potion inventory and `hp()/mp()` fractions. `drink` sends an item-use action, sets shared `pillAt=now+1` and per-type `pressed[type]=now+1.5`. Low HP without HP pills enters rest.
5. Prune expired skipped targets/loot. Choose nearby hostile enemies within `bc=11` of the recorded anchor; while in combat permit aggro enemies within 3.2 tiles of current position. Favor aggro, lower HP, accessible and reasonably leveled targets with `pick`.
6. If no target, collect own loot/gear when available (`idle`); otherwise return to anchor. If target exists, face it and try skill usage via `castSkills`; if not cast, chase until within `(1.3 or 1.6)+target.radius` then `basic()`.

## Target scoring (`Q4.pick`) — CONFIRMED

Candidate score starts as current distance; aggro adds a **−8** score preference; damaged target modifies score by `−4*(1-hpPct)`. A monster tagged as taken by another actor adds +30 unless aggro/boss; elite adds +1 or +4 based on level; a higher tier (`ai(mobLevel)-ai(playerLevel)`) adds `tierDifference*10` plus 10 for elite/boss (unless aggro). Up to 4 ranked candidates receive reachability checks; result cache remains for 2 seconds, size clears above 200. Unreachable targets enter skip map for short periods.

## Walking and obstruction (`Q4.walk`, `Q4.hop`) — CONFIRMED

Distance over `.15` since last position sample clears stuck counter. If stopped over 1.2 seconds, path is reset and alternating sideways steering lasts `.5s`; after 3 repeated stuck events `walk` returns false. If line of sight is clear, steer directly; otherwise route via `e.route` and fallback `hop`. Routes are refreshed if stale >2s or goal moves >1.5; waypoints closer than `.35` are consumed. `hop` only tries if goal at least 16 tiles away and samples angular offsets `[0,.5,-.5,1,-1,1.5,-1.5]` at distance 14.

Chasing a distant target for >6 seconds while >3 tiles away causes a 15-second skip. Loot not reached within >6 seconds can be skipped 60 seconds; pickup occurs at <=.6 tile. Anchor recovery begins if more than 1.5 tiles away.

## Skills, potions, meditation, revival

`Q4.castSkills` uses round-robin slots from `nextSlot`, evaluates `shape`, `range`, target count and `e.cast` success; it does not compute actual combat outcome. `Q4.rest` exits at HP >= .95; while in combat retreats; out of combat stops steering and toggles meditation through `e.meditate` no more often than 2 seconds. `A3.autoHost` maps these abstract callbacks to `WorldScene` view state, collision functions, `act('use',...)`, `act('respawn')`, `act('meditate')`, `act('pickup','auto')` and `useSkill`.

`A3.backgroundAuto` creates a Web Worker whose sole purpose is to emit a **50ms** interval tick when `document.hidden && auto.on`; it calls `game.headlessStep` with delta capped to 250ms. This is a client-side attempt to keep simulation ticking in a hidden tab; execution when backgrounded and server acceptance are **UNKNOWN** and browser-dependent.

## Explicit non-claims

No tested loop timing, actual enemy pursuit, resurrection success, server-side potion cooldown or auto navigation to the *death location* is established. Existing `Q4` returns to stored auto anchor, not a separately recorded death coordinate.
