# Additional specialized class visual FX

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

**CONFIRMED**: A second animation pool class `vt` is defined at char `126028`; metadata in `fo` uses the `4/` key prefix while the earlier pool `wt` uses `6/`. Both pools allocate 96 sprite entries, support a color layer and optional additive light layer, follow actors, fly between points, and clean up on scene shutdown. The exact asset loading convention must be confirmed externally.

**CONFIRMED**: `Ao` registers class-specific definitions from the later source segments. These include effects with sprite prefixes `kq`, `tq`, `mq`, `cg`, as well as prefixed overlays `kt_`, `od_`, `mt_`, `tt_` and `bq_`. `ft` selects small/medium/large effects based on thresholds.

**CONFIRMED**: Selected threshold and math details: `P(count,radius,offset)` at char 131598 uses angle `(index+offset)*2.39996`, distance `sqrt((index+.5)/count)*radius`, and y flattened by 0.5. `X` at char 154395 schedules a traveling effect in `max(3,round(duration/.033))` stages. Prefix pools use fixed memory limits instead of allocating a new sprite per trigger.

**UNKNOWN**: No inference should be made that the `4/` and `6/` paths imply server version numbers.
