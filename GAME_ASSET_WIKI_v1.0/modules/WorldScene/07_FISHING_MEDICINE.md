# Fishing, fish market and pill buff UI

## Local fishing interface — CONFIRMED

`tv` [UTF-16 5548–51645, line 1] is a scene-scoped factory returning `{update, npc, destroy}`; significant nested functions are explicitly indexed in `ASSET_INDEX.json` (`nested_functions`) by exact offsets.

- Nested `D`: checks `map.water.rows` tile strings for water cells. `T` ray-marches 3 orientation directions and water distances from `.5` to 2.25 at `.25` tile increments, then adjusts to bank edge. `S` checks nearby fishable water; fallback reads `map.fish` circle regions.
- `Y` begins a cast or enters power phase: may disable auto farm, cancel click order, reset held attack and call `act('fish','cast')`. `ct` releases power with `act('fish','cast',R.toFixed(4))`. `At` sends `act('fish','hold','1'|'0')`. Key binding defaults to 70 (`F`) through current controls binding.
- UI phases `power`, `cast`, `wait`, `bite`, `reel`, `lift` are read from `self.fish.ph` in nested `Yi`. UI creates DOM/canvas and attaches pointer/key listeners. Phase transitions themselves, fish RNG, catch acceptance and award calculations are **UNKNOWN server-side**.
- Power bar estimation nested `B` extrapolates `u + sp*(now-t)/1000` and uses a triangle-fold function nested `E`; when incoming state diverges, smooths with threshold `.35` and blending `.5`. Reel visualization uses incoming `k`, `kv`, `c`, `pr`, `w`, `rp` and a local presentation estimator clamped to `dt <= .05s`, 0.25s limited extrapolation and blending. This is **only animation prediction**.
- Nested `Ti`/`Un` load animated ambient map assets and build fish, water, lamp, firefly, glow, butterfly, river and portal visuals. Nested `lt` updates environmental effects and floating line/bobber; `Ra` draws a curved fishing line using 28 samples; `za` animates the float; `Te` and `dt` paint canvas reel/power controls.

## Fisher NPC: sales, rods, exchange, crafting — CONFIRMED

`tv` fetches `data/fishing.json`, `data/items/items-meta.json`, `data/items.json` using an AbortController. `mn` presents NPC `ngu-ong`, sale and trade menus, `Ln` renders a fish encyclopedia. It reads rods/lakes/shop data from JSON; rod `bar`, `up`, `price` and fish `tier`,`kg`,`price` are data-driven, not declared in source. Actions:

- `act('fish','rod',String(index))` buy/upgrade rod; `act('fish','sell',name|'all')` sell fish; `act('fish','trade',name|'all')` exchange for fish essence.
- Crafting buttons call `act('craft',recipeId,quantity)` for `ngu-tu-linh`, `ngu-ngo-tinh`, `ngu-thong-thien`, `ngu-dai-tu-linh`. UI displays fixed recipe amounts and current inventory, but server-side recipe validity is not confirmed.

## Pill buff display — CONFIRMED

Nested `ot` reads `self.pb`, builds pill buff icons/countdown and pause styling; `map.medRate>=2` and `self.med` alter visibility/paused countdown for some pill categories. It tracks time from `performance.now()` (client elapsed time) and displays remaining duration; it does not prove the actual buff expires on the server at that exact local clock time. Some Vietnamese pill descriptions are presentation strings, not a source of numeric authoritative buffs.

## Cleanup

`tv.destroy` aborts fetches, removes listeners and DOM nodes, kills game tweens, destroys temporary visual resources and restores `hud.note`. The factory initializes DOM handlers with an `AbortController` signal where supported.
