# PvP / đồ sát / ranking / titles

## Đồ sát UI — CONFIRMED

`sv` [UTF-16 54108–62864, line 45] creates scene-attached `ds-btn`, `ds-tip`, `ds-layer`, and `ds-wanted` elements, reads `self.ds`, and sends `act('dosat','')` when user toggles. It labels state from `ds.on`, `ds.w`, score `ds.sc`, combat bonus `ds.bp`, number of mobs `ds.mobs`, cooldown `ds.cd`, protection `ds.sh`, and wanted players `ds.wl`. Remote player status `st.ds` bit flags are tested via `flag & 1` (on) and `flag & 2` (wanted). A patched minimap draw adds location marker/arrow for nearby wanted list entries; the original draw is restored on UI destruction.

Tooltip explanatory text mentions 30% penalty, 50-point wanted threshold, wanted drops and 1000 mobs/point. **Classification: INFERRED gameplay rule / CONFIRMED displayed copy**, not server-confirmed implementation. Payout, restrictions and toggling logic are not implemented in this file.

## Ranking and titles — CONFIRMED UI

`A3.openRanks` [UTF-16 930213–930325, line 1143]; `A3.showRanks` [UTF-16 930325–930944, line 1143]; `dv` [UTF-16 89304–91157, line 221]; `Qs` [UTF-16 88583–89304, line 221].

Rank panel requests `act('ranks')` and listens to `onServer('ranks')`; `dv` builds a title chooser from imported `Qx`, `Jx`, `Tp`, `Ro`, `Zx`, `tb`, `Sp` and emits `title-select`/`title-visible` via callbacks. UI text states some titles last seven days and ranking closes each Monday 00:00 Vietnam time; these statements describe **displayed UI policy**, not verified reward scheduler. `Qs` assembles banner assets and text placement from imported definitions.

## PvP targeting, map markers — CONFIRMED

`A3.clickDirection` allows target player click actions only under local PvP state (`self.pk`). `A3.worldMapBody` overlays wanted lists for a region from `self.ds.wl`; `A3.drawMinimap` renders party/player and PvP map status markers. Authority for PvP damage, loot loss or protections resides outside this client file.
