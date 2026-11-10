# Quest, NPC, tutorial and harvesting interactions

## Quests and guide — CONFIRMED

`A3.questTarget` [UTF-16 896263–897248, line 1143]; `A3.questGuide` [UTF-16 960271–966266, line 1143]; `A3.guideTarget` [UTF-16 966266–966683, line 1143]; `A3.drawGuide` [UTF-16 966683–968246, line 1143]; `A3.updateTracker` [UTF-16 968246–969983, line 1143]; `A3.openJournal` [UTF-16 958490–960168, line 1143].

The scene instantiates an imported quest manager `gf(world.quests,inventory,level)` and wires account/player data to quest UI. The quest tracker `trackerEl`, guide effects and `trackerGo` navigation button connect mission target selection to `goTo(scene,x,y,label)`. Additional KTM panels and quest integrations use imported registries (`$i`, `kh`, `ktHost`, `ktSecond` etc.) for map markers and interactable actions. This scene does not own all quest definitions or server progress persistence.

## NPC, resource and interaction flows — CONFIRMED

`A3.placeNpcs` [UTF-16 950506–951204, line 1143]; `A3.placeNodes` [UTF-16 954591–955296, line 1143]; `A3.setNode` [UTF-16 914029–914163, line 1143]; `A3.npcDialog` [UTF-16 955369–957957, line 1143]; `A3.pickTarget` [UTF-16 987970–988810, line 1143]; `A3.interact` [UTF-16 988810–989489, line 1143]; `A3.openHerbs` [UTF-16 953024–954591, line 1143].

NPC spawns are read from external world maps and attached to `ha` actors, and `npcDialog` selects custom handlers including fishing NPC. `interact()` checks modal/overlay state, then sends `act('travel',...)`, `act('harvest',...)`, draws dialogs, or delegates to realm/KT UI. `A3.setNode` responds to incoming `node` events with `ready` state. Harvest success, loot table and node respawn timers cannot be inferred from client button click.

## Tutorial overlay — CONFIRMED

Classes `w4` and `L4` implement prompt sequence/save/advance and action-aware onboarding. In `A3.create`, e.g. `coach.mark` and `coach.act` are invoked during actions. They may be client-side hints or local persistent progress and should not be treated as authoritative quest state.
