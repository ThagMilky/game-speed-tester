# Scene lifecycle, authority boundaries and snapshots

## Scene construction and dependency graph — CONFIRMED

`A3.constructor` [UTF-16 830983–835850, line 1143]; `A3.init` [UTF-16 835850–835930, line 1143]; `A3.preload` [UTF-16 835930–837140, line 1143]; `A3.create` [UTF-16 837210–850036, line 1143]; `A3.update` [UTF-16 1005385–1010138, line 1143]; `A3.leave` [UTF-16 913662–914029, line 1143].

`A3` extends `et.Scene` with scene key `world`. Constructor initializes scene fields: `world`, `map`, `driver`, `collision`, `player`, `px/py`, `faceX/faceY`, `self`, `profile`, `views`, `objects`, `nodes`, `quests`, `auto = new Q4`, and over 100 render/UI/navigation fields. It constructs `Z2`, `hv`, `nw`, `R4`, and `Q4` before `create`. `init` receives external world/map/driver data; source assets and exact semantics are external.

`create` performs scene setup in source order: map sprite frame registration; ground bake/packing; `new xu(map.w,map.h,map.tris)` collision; player character creation using external appearance/animation definitions; NPC/stele/resource placement; realm overlay; environment emitters, weather, `ew` HUD, `fv` status icons, quests, skill controls, movement/keyboard/mouse/touch bindings, fishing and PvP HUD; audio and FX loading; camera bounds and zoom; `driver.onMessage = ...onServer`, `driver.onStatus = ...`, optional `driver.start()`; map ground manifest loading. Multiple event listeners are cleaned on Phaser scene shutdown. This enumeration describes visible client setup only.

## Incoming message dispatcher — CONFIRMED

`A3.onServer` [UTF-16 881263–882934, line 1143]; `A3.onSnap` [UTF-16 897472–898479, line 1143]; `A3.upsert` [UTF-16 898479–899748, line 1143]; `A3.dropView` [UTF-16 904034–904577, line 1143]; `A3.onEvent` [UTF-16 908671–913662, line 1143].

`A3.onServer` switches on incoming `t.t`: `joined`, `snap`, `profile`, `ranks`, `kt`, `market`, `error`. `joined` can switch scenes and installs profile, player ID, position and resource nodes; `snap` delegates to `onSnap`; `profile` refreshes UI; `kt`, `market` refresh dependent interfaces; `error` surfaces notifications and conditional disconnect. It does *not* establish which remote implementation sent these messages.

`onSnap` aligns a client-local clock to `t.time`, sets `self`, sends related local state to UI controllers, corrects `px,py` when `self.fix` changes, calls `upsert` for each `t.ents`, `dropView` for `t.gone`, then `onEvent` for `t.ev`. In online mode clock-offset jump reset is triggered by `abs(newOffset - oldOffset)>1`, whereas offline branch uses `.5`. Online delay estimation keeps up to 120 lateness samples, derives a 95th percentile, clamps target interpolation delay to `.08.. .3` seconds, then eases toward it with gain `.2` upward / `.02` downward. Offline offset smoothing is `.05` if not reset; online smoothing gain `.01` applies when offset decreases. See exact `onSnap` conditions for edge cases.

`upsert` retains up to 12 position samples per entity. A displacement greater than 4 tiles discards earlier samples. `updateViews` uses the calculated render clock to interpolate between samples. Online controlled extrapolation is capped at `.15s` when the last two samples are separated by `.001.. .3s` and less than 2 tiles; absent this, the last sample is shown. This is visual smoothing, not a verified server movement rule.

## Outgoing client-side messages — CONFIRMED

`A3.act` [UTF-16 860638–860745, line 1143]; `A3.sendMove` [UTF-16 916506–916837, line 1143]; `A3.useSkill` [UTF-16 920349–923646, line 1143]; `A3.interact` [UTF-16 988810–989489, line 1143]; `A3.teleport` [UTF-16 897379–897472, line 1143].

- `act(action,arg='',arg2='')` invokes optional tutorial hook and `driver.send({t:'action',action,arg,arg2})`.
- `sendMove()` compares a formatted position/direction/animation key with previously sent data, and sends `{t:'move',seq:++seq,x,y,d,a}` with coordinates rounded to 3 decimals. A 50ms send throttle is conditional on dash/idle state.
- `useSkill()` sends `{t:'skill',key,fx,fy}` or `{t:'skill',key,fx,fy,ax,ay}` after client-local checks; the client may play animation or calculate dash before receiving any confirmation.
- `create` wires chat send to `{t:'chat',text,ch}`; `invite` sends special chat commands.

The remote `driver` implementation and protocol authentication/validation are **UNKNOWN** here.

## Update ordering — CONFIRMED

The Phaser `update(t,i)` frame clamps movement `dt` to `.05` seconds. Visible high-level sequence: local move/sendMove → `driver.update` → queued skill flushing and held attack → realm/player/status/weapon visuals → auto controller → nearby NPCs → remote interpolated entities → weather/lighting and FX → minimap/HUD/guide/navigation → culling/ground streaming and fishing/PvP UI. Presence of a call does not prove the associated network operation succeeds.

## Scene exit — CONFIRMED

`leave(scene,x,y)` closes the driver, updates URL query parameters differently for online vs offline, updates display/loading state and schedules navigation to `location.search` after 320ms; separate shutdown handlers registered during `create` clean individual components. Verify external cleanup lifecycle with the Phaser module during merge.
