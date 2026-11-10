# Sprite asset and animation metadata

Asset: `ChieuMau-CEtRLp-4.js`. Source offsets are 0-based character positions. Statuses: **CONFIRMED** = directly observed source; **INFERRED** = reasonable interpretation; **UNKNOWN** = requires another module/runtime. No tests executed.

**CONFIRMED**: 596 literal sprite metadata entries found, grouped by prefix: `as`=68, `bq`=4, `cg`=42, `dv`=66, `hq`=9, `ht`=68, `kq`=46, `kt`=9, `md`=2, `mq`=39, `mt`=7, `od`=9, `ps`=50, `ta`=47, `tq`=36, `tt`=4, `vt`=90. Every key is indexed individually under `ASSET_INDEX.json > sprite_assets` with source position and `w`, `h`, `frames`, `fps`, `anchor`.

**CONFIRMED**: `Po.preload(scene,base,defs)` adds sheets with `scene.load.spritesheet('juice:'+key, base+'/'+key+'.png', frameWidth/Height)` unless already present. Both `wt`/`vt` FX classes may use light overlays named `key+'.l'`. The existing `ready` checks the Phaser texture registry.

**UNKNOWN**: Actual image binary contents, existence on CDN, visual appearance and completeness of preloads, since PNG files and runtime were not supplied.
