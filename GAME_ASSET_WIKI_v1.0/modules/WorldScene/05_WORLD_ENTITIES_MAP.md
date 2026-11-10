# World entities, maps and interactive navigation

## Entity snapshots and actor views — CONFIRMED

`A3.upsert` [UTF-16 898479–899748, line 1143]; `A3.makeActor` [UTF-16 899748–901425, line 1143]; `A3.ensureSet` [UTF-16 901425–902212, line 1143]; `A3.addObject` [UTF-16 902212–903964, line 1143]; `A3.updateViews` [UTF-16 904697–908671, line 1143]; `A3.dropView` [UTF-16 904034–904577, line 1143].

`upsert` distinguishes `k:'o'` object entities from actor views (`k:'m'` monsters, `k:'p'` players). Actor creation stores minified `st` state, position sample buffer `buf`, class, height, bounding radius (clamped `.2.. .9` from `height*.26`), animation names, flash/death state. Actors are rebuilt when expected skin/pet height changes; resurrection changes visibility with a `.5s` tween and empties the interpolation buffer. `dropView` releases render objects and associated caches.

`A3.updateViews` interpolates position (`renderTime`), updates per-actor animation, tint and status FX, attachments/mounts/auras, sprites and shadows. Off-screen camera-filter margins are 200/40/320 pixels around the camera world view. Player aura candidate refresh every `.5s`, prioritizing up to 8 nearby players within 18 tiles. Such culling/LOD choices are rendering only.

## Map data, scene coordinates and ground streaming — CONFIRMED

`A3.preload` and `A3.create` consume map/wolrd data injected externally. `bakeTiles`, `placeSprites`, `packSprites`, `cull`, `toneTexture`, `streamGround`, `loadGround`, `addGround`, `checkLoaded` implement layered tiles, packing, color/lighting and camera-proximity ground streaming. `streamGround` scans every **100ms**, considers tiles near the worldView with padding `max(512, round(viewWidth*.6))`, prioritizes visible pieces, and allows at most **4** simultaneously pending requests; distant loaded pieces are destroyed. `checkLoaded` completes the client loading overlay if visible tiles are ready or an 8s fallback has elapsed, with the player snapshot available. This is not evidence of complete asset loading in all runtime cases.

## World map, area map and minimap — CONFIRMED

`A3.worldMapBody` [UTF-16 980281–983839, line 1143]; `A3.areaMapBody` [UTF-16 985350–987825, line 1143]; `A3.openWorldMap` [UTF-16 983839–984615, line 1143]; `A3.drawMinimap` [UTF-16 1003257–1004853, line 1143]; `R4.draw` [UTF-16 676212–677355, line 866].

World map regions are read from `world.worldmap.regions`; locked scenes are gated by quest `lock(scene)`, fast travel button sends `act('fasttravel',scene)` only if conditions hold. Scene map buttons can call `goTo`. The area map uses pixel-to-world conversion based on map width/height; canvas click triggers navigation to selected tile, and overlays gates, NPCs, station states, quest target, current nav destination, KT markers and current player dot.

Minimap markers include map gates, NPC, stele, players/party, monsters (boss/elite distinct), realm markers, discovered stations, KT markers, navigation target, nearby harvestable nodes and quest guide. `R4` draws local map with safe-zone metadata. `drawMinimap` is called when `time.now - miniAt > 120` (Phaser ms), approximately an 8.3Hz refresh ceiling, not necessarily guaranteed.

## Object interactions — CONFIRMED

`A3.pickTarget` prioritizes realm target, nodes, nearby portal, NPC, teleport stations, stele and KT interactions. `A3.interact` dispatches `travel`, `harvest`, a realmUI action, KTM interaction, NPC dialog or stele display. `teleport` sends `act('kt:truyentong:go',station.id, 'x,y')`. Destination acceptance/price is outside this asset.
