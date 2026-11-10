# FUNCTION_MAP — feature → exact symbol and source offsets

Original minified names are retained; offset pairs use original UTF-16 `[start,end)`. Look up full byte ranges, params, calls and comparisons in ASSET_INDEX.json. All mappings CONFIRMED as symbol occurrences; a feature role not directly visible in a method body is INFERRED and must be checked against source.

## Bootstrap, scene and connections
- `A3` [UTF-16 830957–1010139, line 1143]
- `A3.init` [UTF-16 835850–835930, line 1143]
- `A3.preload` [UTF-16 835930–837140, line 1143]
- `A3.create` [UTF-16 837210–850036, line 1143]
- `A3.onServer` [UTF-16 881263–882934, line 1143]
- `A3.onSnap` [UTF-16 897472–898479, line 1143]
- `A3.onEvent` [UTF-16 908671–913662, line 1143]
- `A3.update` [UTF-16 1005385–1010138, line 1143]
- `A3.leave` [UTF-16 913662–914029, line 1143]

## Movement and collision
- `A3.move` [UTF-16 914412–916429, line 1143]
- `A3.sendMove` [UTF-16 916506–916837, line 1143]
- `A3.clickDirection` [UTF-16 858364–860237, line 1143]
- `A3.startClickOrder` [UTF-16 858083–858364, line 1143]
- `A3.cancelClickOrder` [UTF-16 857766–857806, line 1143]
- `A3.syncPlayer` [UTF-16 1004853–1005385, line 1143]
- `A3.toPx` [UTF-16 837140–837179, line 1143]

## Navigation / portals / map
- `A3.goTo` [UTF-16 892067–893906, line 1143]
- `A3.navGates` [UTF-16 891862–892067, line 1143]
- `A3.stepNav` [UTF-16 894228–895346, line 1143]
- `A3.stopNav` [UTF-16 893906–894018, line 1143]
- `A3.resumeNav` [UTF-16 894018–894228, line 1143]
- `A3.drawNav` [UTF-16 895346–896263, line 1143]
- `A3.teleport` [UTF-16 897379–897472, line 1143]
- `A3.worldMapBody` [UTF-16 980281–983839, line 1143]
- `A3.areaMapBody` [UTF-16 985350–987825, line 1143]
- `A3.openWorldMap` [UTF-16 983839–984615, line 1143]
- `A3.drawMinimap` [UTF-16 1003257–1004853, line 1143]
- `R4.draw` [UTF-16 676212–677355, line 866]

## Combat / skill input
- `A3.useSkill` [UTF-16 920349–923646, line 1143]
- `A3.skillWait` [UTF-16 919808–920037, line 1143]
- `A3.flushSkill` [UTF-16 920037–920349, line 1143]
- `A3.castFx` [UTF-16 924623–928775, line 1143]
- `A3.drawAim` [UTF-16 918286–919808, line 1143]
- `A3.cycleTarget` [UTF-16 928775–929307, line 1143]
- `A3.anyEnemy` [UTF-16 923646–923879, line 1143]
- `A3.nearestEnemy` [UTF-16 923879–924274, line 1143]
- `A3.aimAtNearest` [UTF-16 924274–924511, line 1143]
- `A3.targetRing` [UTF-16 917813–918286, line 1143]
- `A3.drawTarget` [UTF-16 929307–930213, line 1143]
- `A3.onEvent` [UTF-16 908671–913662, line 1143]

## Autofarm and resurrection
- `Q4.toggle` [UTF-16 683376–683723, line 866]
- `Q4.update` [UTF-16 683805–686156, line 866]
- `Q4.pick` [UTF-16 686156–686906, line 866]
- `Q4.idle` [UTF-16 686906–687470, line 866]
- `Q4.walk` [UTF-16 687470–688412, line 866]
- `Q4.hop` [UTF-16 688412–688626, line 866]
- `Q4.drink` [UTF-16 688687–688798, line 866]
- `Q4.castSkills` [UTF-16 689074–689918, line 866]
- `Q4.rest` [UTF-16 689918–690189, line 866]
- `A3.autoHost` [UTF-16 933672–936183, line 1143]
- `A3.toggleAutoFarm` [UTF-16 932407–932714, line 1143]
- `A3.backgroundAuto` [UTF-16 932714–933353, line 1143]

## Enemies / entity interpolation
- `A3.upsert` [UTF-16 898479–899748, line 1143]
- `A3.makeActor` [UTF-16 899748–901425, line 1143]
- `A3.updateViews` [UTF-16 904697–908671, line 1143]
- `A3.dropView` [UTF-16 904034–904577, line 1143]
- `A3.addObject` [UTF-16 902212–903964, line 1143]
- `A3.ensureSet` [UTF-16 901425–902212, line 1143]

## Fishing / NPC / medicine
- `tv` [UTF-16 5548–51645, line 1]
- `A3.npcDialog` [UTF-16 955369–957957, line 1143]
- `A3.interact` [UTF-16 988810–989489, line 1143]
- `A3.placeNpcs` [UTF-16 950506–951204, line 1143]

## PvP, wanted & ranks
- `sv` [UTF-16 54108–62864, line 45]
- `A3.openRanks` [UTF-16 930213–930325, line 1143]
- `A3.showRanks` [UTF-16 930325–930944, line 1143]
- `A3.worldMapBody` [UTF-16 980281–983839, line 1143]
- `dv` [UTF-16 89304–91157, line 221]
- `Qs` [UTF-16 88583–89304, line 221]

## Quests / guide
- `A3.questGuide` [UTF-16 960271–966266, line 1143]
- `A3.questTarget` [UTF-16 896263–897248, line 1143]
- `A3.guideTarget` [UTF-16 966266–966683, line 1143]
- `A3.drawGuide` [UTF-16 966683–968246, line 1143]
- `A3.updateTracker` [UTF-16 968246–969983, line 1143]
- `A3.openJournal` [UTF-16 958490–960168, line 1143]
- `A3.placeNodes` [UTF-16 954591–955296, line 1143]
- `A3.setNode` [UTF-16 914029–914163, line 1143]

## Inventory / equipment / crafting
- `A3.bagHost` [UTF-16 969983–970713, line 1143]
- `A3.openBag` [UTF-16 972556–972955, line 1143]
- `A3.openGear` [UTF-16 930944–931724, line 1143]
- `A3.openPendingGear` [UTF-16 972955–974143, line 1143]
- `A3.openAttributes` [UTF-16 974143–974688, line 1143]
- `A3.openWash` [UTF-16 974688–975064, line 1143]
- `A3.openWorkshop` [UTF-16 977205–978638, line 1143]
- `A3.pickPillSlot` [UTF-16 970775–972556, line 1143]
- `A3.usePillSlot` [UTF-16 970713–970775, line 1143]

## Panel, HUD, chat
- `hv.show` [UTF-16 82027–86979, line 216]
- `hv.close` [UTF-16 81641–82027, line 216]
- `Z2.openDialog` [UTF-16 381103–381999, line 413]
- `ew.cooldowns` [UTF-16 413657–414876, line 524]
- `ew.note` [UTF-16 415557–416029, line 524]
- `nw.send` [UTF-16 427488–427989, line 582]
- `nw.render` [UTF-16 430351–430880, line 582]
- `A3.openSettings` [UTF-16 936326–947935, line 1143]
- `Z5.setEntries` [UTF-16 604299–604438, line 794]

## Rendering / FX / environment
- `Tv.play` [UTF-16 120332–120665, line 221]
- `Tv.spawn` [UTF-16 122814–123970, line 221]
- `Tv.tick` [UTF-16 124188–124701, line 221]
- `Mv.render` [UTF-16 100226–100747, line 221]
- `Mv.actor` [UTF-16 106947–113623, line 221]
- `Mv.hit` [UTF-16 101423–102166, line 221]
- `fv.draw` [UTF-16 94396–95182, line 221]
- `Sv.thunder` [UTF-16 127891–128376, line 221]
- `Ou.update` [UTF-16 258847–259186, line 237]
- `Fu.update` [UTF-16 262556–263433, line 237]
- `xk.update` [UTF-16 266631–266745, line 237]
- `k$.update` [UTF-16 728636–731691, line 965]
- `vc.update` [UTF-16 737335–740078, line 965]
- `z4.update` [UTF-16 666992–668228, line 866]
- `A3.streamGround` [UTF-16 878067–879112, line 1143]
- `A3.cull` [UTF-16 876378–876866, line 1143]
- `A3.updateShade` [UTF-16 1001337–1002553, line 1143]

## Client-only skill simulators
- `ik.input` [UTF-16 198780–199018, line 237]
- `ik.cast` [UTF-16 199048–199525, line 237]
- `ik.resolve` [UTF-16 200162–204042, line 237]
- `ik.snapshot` [UTF-16 206092–206340, line 237]
- `ok.input` [UTF-16 224620–224841, line 237]
- `ok.cast` [UTF-16 224841–225465, line 237]
- `ok.resolve` [UTF-16 228525–230073, line 237]
- `ok.snapshot` [UTF-16 230835–231181, line 237]
- `zu.render` [UTF-16 189118–193222, line 237]
- `sk.render` [UTF-16 214385–219374, line 237]
- `rk.render` [UTF-16 239761–243093, line 237]

## Other symbols
Complete top-level declarations: `modules/TOP_LEVEL_SYMBOLS.md`; 554 methods by class: `modules/classes/`; nested callables including 2627 callback/declaration nodes: `ASSET_INDEX.json` and `modules/NESTED_FUNCTIONS.md`.
