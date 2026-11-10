# Movement, collision and navigation

## Local player movement — CONFIRMED

`A3.move` [UTF-16 914412–916429, line 1143]; `A3.sendMove` [UTF-16 916506–916837, line 1143]; `A3.clickDirection` [UTF-16 858364–860237, line 1143]; `A3.startClickOrder` [UTF-16 858083–858364, line 1143]; `A3.cancelClickOrder` [UTF-16 857766–857806, line 1143].

`move(dt)` combines keyboard `WASD/arrows`, joystick `joyX/joyY`, auto steer (`autoX/autoY`) and click-order direction. Nonzero direct human input calls `stopNav`, `cancelClickOrder`, `auto.pause(now)` and zeros auto steer. Movement is suppressed by UI blocking (except auto case), death, harvesting or movement-lock statuses. Dash branch uses the current `dashVX/dashVY` and `collision.move` for at most `min(dt,dashT)`; ordinary movement uses `collision.walk` and normalized direction. Character speed is selected by fly/run/walk, multiplied by self movement modifier (`self.ms`, default imported class base) and halved when status string `self.fx` includes `w`. Since speed constants `_x`, `Mp`, and `Nn` come from other code, effective speed must be merged across modules.

`clickDirection` may issue a basic attack within `de.reach*.85 + target.radius` when collision line clear; stuck if less than `.12` tile movement for 2.5 seconds; waypoint consumption threshold `.22` tile; route recalculation every `.8s`, or a long fallback search under additional conditions (`lo(...,6e4,true)`); user can retarget in MOBA mouse mode.

## Autonav, portal routes and map paths — CONFIRMED

`A3.goTo` [UTF-16 892067–893906, line 1143]; `A3.navGates` [UTF-16 891862–892067, line 1143]; `A3.stepNav` [UTF-16 894228–895346, line 1143]; `A3.stopNav` [UTF-16 893906–894018, line 1143]; `A3.resumeNav` [UTF-16 894018–894228, line 1143]; `A3.drawNav` [UTF-16 895346–896263, line 1143]; `A3.questTarget` [UTF-16 896263–897248, line 1143].

`goTo(scene,x,y,label)` rejects death/leaving and locked quest scenes, disables auto farm, resolves cross-scene routes using `f4(...)`, uses gate/intermediate target when needed, and plans collision paths via `lo(collision,...)`. If destination is unreachable and not a portal route it requests nearest reachable fallback (`lo(...,25e4,true)`), distinguishes partial goal from exact arrival, records navigation state, and may store `kt-nav` in session storage for at most 180,000ms.

`stepNav` consumes waypoints closer than `.6` tiles; considers a non-gate destination arrived closer than `.5`, or gate within 2.6; attempts `act('travel',String(gate))` with a 3s gate retry interval; replans up to 3 retries for repeated waypoint keys, then stops with a blocked notice. A click order receives the active waypoint. This is client navigation; portal acceptance remains unknown.

`resumeNav` / `stopNav` manage the navigation state and saved session target; `drawNav` renders path/markers in scene space. Navigation is also accessible from the minimap and world/area map panels.

## Coordinates — CONFIRMED

`A3.toPx(x,y)` uses `x*Q` for screen X and `(map.h-y)*Q` for screen Y; game world Y and Phaser pixel Y run in opposite directions. `Q` is an imported alias, so its literal value is not proven by this asset alone. `Tv` independently has `unit=32`, but equating that to `Q` requires the imported module.

## Cross-module UNKNOWN

`lo`, `Th`, `us`, `yi`, `f4`, `ka`, `hi`, `de`, `Mp`, `_x`, `Q` and map collision data define essential pathfinding, movement speed, reach, gate availability, and collision semantics. Their implementation/values should be linked during final merge; do not reconstruct unseen authority from client use sites.
