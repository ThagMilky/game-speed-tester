# Inventory, equipment, crafting and resource interfaces

## Inventory presentation — CONFIRMED

`A3.openBag` [UTF-16 972556–972955, line 1143]; `A3.bagHost` [UTF-16 969983–970713, line 1143]; `A3.pickPillSlot` [UTF-16 970775–972556, line 1143]; `A3.openGear` [UTF-16 930944–931724, line 1143]; `A3.openPendingGear` [UTF-16 972955–974143, line 1143]; `A3.openAttributes` [UTF-16 974143–974688, line 1143]; `A3.openWash` [UTF-16 974688–975064, line 1143].

`A3` displays profile inventory, equipped items, wearable slots, pill shortcuts and equipment attributes through imported item/gear components. `bagHost` maps action callbacks to `act(action,arg,arg2)`. `pickPillSlot` stores mapping for HP/MP in localStorage `tm-pill-slots`; `usePillSlot` passes configured action (server determines acceptance). Item metadata/images also loaded by nested fishing UI from local JSON.

## Workshop / market — CONFIRMED UI boundaries

`A3.openWorkshop` [UTF-16 977205–978638, line 1143]; `A3.openGm` [UTF-16 976043–977205, line 1143]; `A3.openCommunity` [UTF-16 975914–976043, line 1143]; `A3.openDaily` [UTF-16 932074–932407, line 1143]; `A3.onServer` [UTF-16 881263–882934, line 1143].

Workshop and market screens invoke imported craft/market panels, render profile and server market messages, and issue `act(...)` commands. `onServer('market')` stores the market data and refreshes an open market tab. No payment settlement, inventory transaction commit, forge RNG or economy authority is present in this module.

## Fishing-specific economy

The fisherman UI allows rod upgrade, fish sale, fish essence exchange, and pill recipes in `tv` nested `mn`; see `07_FISHING_MEDICINE.md` for actions and locally displayed costs. Imported inventory and recipe modules must be consulted for definitive data, and server for authoritative confirmation.
