# FISHING — source-grounded module

**CONFIRMED**: Fishing subsystem my: rod verification, aim, release, reel, landing, shop, tick and view. Verify conditions in method bodies.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (19)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `my.constructor` | constructor | 195371–195397 | — |
| `my.spots` | method | 195397–195424 | — |
| `my.nearest` | method | 195424–195550 | `this.spots(t).forEach`, `my.spots`, `Math.hypot` |
| `my.waterAt` | method | 195550–195724 | `Math.floor` |
| `my.aim` | method | 195724–195995 | `Math.cos`, `Math.sin`, `my.waterAt` |
| `my.rodIndex` | method | 195995–196127 | `n.forEach`, `t.count` |
| `my.rod` | method | 196127–196250 | `my.rodIndex` |
| `my.cancel` | method | 196250–196329 | `t.note` |
| `my.pos` | method | 196329–196368 | `uy` |
| `my.verify` | method | 196368–196581 | `my.pos`, `Math.min`, `Math.max`, `Number.isFinite`, `kh` |
| `my.action` | method | 196581–198141 | `my.cancel`, `my.buyRod`, `Number`, `o`, `my.startReel`, `n.note`, `ka`, `my.release`, `my.aim`, `my.nearest`, `my.spots`, `ry` |
| `my.release` | method | 198141–198605 | `my.verify`, `(o.dist[0]+(o.dist[1]-o.dist[0])*r).toFixed`, `t.note` |
| `my.pick` | method | 198605–198910 | `Math.max`, `s.reduce`, `i`, `Math.random` |
| `my.tier` | method | 198910–199007 | — |
| `my.startReel` | method | 199007–199500 | `my.pick`, `my.cancel`, `Math.pow`, `Math.random`, `(r.kg[0]+(r.kg[1]-r.kg[0])*e.size).toFixed`, `my.tier`, `my.rod`, `cy`, `ka` |
| `my.land` | method | 199500–200393 | `t.give`, `t.note`, `Vn`, `Date.now`, `Math.max`, `Math.round`, `tc`, `t.toast` |
| `my.buyRod` | method | 200393–201115 | `Number.isInteger`, `t.note`, `my.rodIndex`, `t.count`, `o.price.toLocaleString`, `t.give`, `t.toast`, `Math.round` |
| `my.tick` | method | 201115–202951 | `Math.hypot`, `my.cancel`, `my.release`, `Math.max`, `ka`, `n.note`, `Math.random`, `Math.abs`, `Math.min`, `my.land` |
| `my.view` | method | 202951–203868 | `i.toFixed`, `o.toFixed`, `(e.u0+e.sp*(n-e.t0)).toFixed`, `Object.assign`, `Math.max`, `(e.until-n).toFixed`, `e.c.toFixed`, `e.kim.toFixed`, `e.bw.toFixed`, `e.kv.toFixed`, `e.ct.toFixed`, `(e.kv2??2).toFixed` |

## Interpretation boundaries

- **CONFIRMED** declarations, calls, string literals and numeric constants can be located in ASSET_INDEX.json and the untouched source.
- **INFERRED** runtime role described above from method names and local flow; it is not independently tested.
- **UNKNOWN** imported function internals, network counterpart implementation, authority boundaries, real-time execution behavior and hidden state outside this asset.

## Merge checklist

- Match import aliases against original exports from other assets, then update unresolved links.
- Check event payload producers against consumers; confirm state writes against persisted fields.
- Preserve symbols/offsets; avoid replacing source IDs with translated feature names.

## Additional static control-flow inventory

The following conditions, numeric literals and writes are extracted from AST nodes. These are observations, not an assertion that each branch executes. Arrays are capped for readability; inspect source for exhaustive statements.

### `my.constructor` — 195371–195397

- State writes: `this.cfg`

### `my.nearest` — 195424–195550

- Numeric literals: `1`, `1000000000`
- State writes: `i`, `s`

### `my.waterAt` — 195550–195724

- Conditions: `(r=t.water)==null`; `!s`
- Numeric literals: `0`, `1`
- State writes: `r`

### `my.aim` — 195724–195995

- Conditions: `!this.waterAt(t,n+h*u,e+c*u)`
- Numeric literals: `0`, `1`, `8`, `4`, `0.5`, `2.25`, `0.25`, `1.75`
- State writes: `m`

### `my.rodIndex` — 195995–196127

- Conditions: `(s=this.cfg)==null`
- Numeric literals: `0`
- State writes: `s`, `e`

### `my.rod` — 196127–196250

- Conditions: `(e=this.cfg)==null`
- Numeric literals: `0`, `1`
- State writes: `e`

### `my.cancel` — 196250–196329

- State writes: `t.fishing`, `t.anim`

### `my.verify` — 196368–196581

- Conditions: `Number.isFinite(e)&&e>=i-.015&&e<=o+.015`
- Numeric literals: `1`, `0`, `12`, `0.015`, `2`
- State writes: `i`, `o`

### `my.action` — 196581–198141

- Conditions: `!r`; `s==="stop"`; `s==="rod"`; `s==="hold"`; `!h||h.phase!=="reel"||i!=="1"&&i!=="0"||(e-h.hwT>=1&&(h.hwT=e,h.hwN=0),++h.hwN>20)`; `s==="hook"`; `!h`; `h.phase==="bite"`; `e-(h.biteAt??e)<.1`; `s!=="cast"`; `h`; `!(c!=null&&c.length)`; `n.dead||n.flying`; `e<n.combatUntil`; `t.water`; `!d`; `u=this.nearest(t,n.x,n.y),u<0`
- Numeric literals: `1`, `0`, `20`, `0.1`, `9`, `2`, `0.5`, `0.2`, `0.3`, `0.15`
- State writes: `h.hwT`, `h.hwN`, `h.hold`, `h.noteAt`, `h.until`, `m`, `g`, `n.dir`, `u`, `n.meditating`, `n.fishing`, `n.anim`

### `my.release` — 198141–198605

- Conditions: `r>=o.perfect[0]&&r<=o.perfect[1]`; `r>=o.orange[0]&&r<=o.orange[1]`; `n.luck===2`; `n.luck===1`
- Numeric literals: `0`, `1`, `2`, `0.4`, `0.6`
- State writes: `n.pow`, `n.luck`, `n.d0`, `n.bx`, `n.by`, `n.phase`, `n.until`, `t.anim`

### `my.pick` — 198605–198910

- Conditions: `h.tier==="hiem"`; `h.tier==="huyen_thoai"`; `h.tier==="rac"`; `r-=i(h),r<=0`
- Numeric literals: `1`, `0.1`, `0`
- State writes: `r`

### `my.tier` — 198910–199007

- Conditions: `(n=t.fish)==null`
- Numeric literals: `0`
- State writes: `n`

### `my.startReel` — 199007–199500

- Conditions: `!r`; `r.kg`
- Numeric literals: `1`, `0`, `2`, `0.5`, `0.2`, `0.6`, `1.4`, `1.6`
- State writes: `e.fish`, `e.size`, `e.kg`, `e.phase`, `e.prog`, `e.ends`, `e.c`, `e.ct`, `e.kim`, `e.kv`, `e.hold`, `e.bw`, `e.up`, `e.down`, `e.mv`, `e.turnAt`, `e.nextCt`, `n.anim`

### `my.land` — 199500–200393

- Conditions: `s.tier==="rac"`; `(o=this.cfg.daily)==null`; `h&&u&&h.n++,i=u&&s.u&&s.price?Math.max(0,Math.round(s.price*(n.kg/s.u-1))):0,i>0&&t.give("Linh thạch",i),u&&t.fishStats`; `u&&s.u&&s.price`; `i>0`; `r&&h&&!u`; `r&&h&&h.n===r`
- Numeric literals: `1`, `0`, `1000`, `100`, `1.6`
- State writes: `o`, `h.day`, `h.n`, `h.ess`, `i`, `m.kg`, `m.bestKg`, `m.best`, `n.res`, `n.phase`, `n.until`, `t.anim`, `n.won`

### `my.buyRod` — 200393–201115

- Conditions: `(r=this.cfg)==null`; `!Number.isInteger(n)||n<1||n>=s.length`; `!e`; `n<=i`; `n!==i+1`; `t.count("Linh thạch")<o.price`; `i>0`
- Numeric literals: `0`, `1`, `100`
- State writes: `r`

### `my.tick` — 201115–202951

- Conditions: `!i||!o`; `n.dead||Math.hypot(i.sx-n.x,i.sy-n.y)>.6`; `n.dead`; `n.dir=i.d,i.phase==="lift"`; `i.phase==="power"`; `i.phase==="cast"`; `n.anim=i.phase==="reel"?"cau_keo":"cau_cho",i.phase==="wait"`; `i.phase==="reel"`; `i.phase==="bite"`; `e>=i.until`; `i.nextCt!==void 0&&e>=(i.nextAt??0)&&(i.ct=i.nextCt,i.nextCt=void 0,i.kv2=i.nextKv??i.kv2),e>=i.turnAt`; `m`; `Math.random()<.5`; `i.c>=i.kim`; `m&&Math.random()<.35*h`; `i.hold`; `i.kv<0`; `i.prog=Math.min(1,Math.max(0,i.prog+(u?i.up:e<i.ends-r.timeS+1?0:-i.down)*s)),i.prog>=1`; `u`; `e<i.ends-r.timeS+1`; `i.prog<=0||e>=i.ends`
- Numeric literals: `0.6`, `1.5`, `0`, `1`, `0.08`, `0.3`, `0.35`, `0.1`, `0.22`, `0.5`, `0.32`, `0.8`, `0.4`, `0.96`, `0.04`, `0.98`, `0.02`, `2.5`, `5`, `2`, `3`, `0.25`, `0.9`, `1.8`
- State writes: `n.dir`, `n.anim`, `n.fishing`, `i.phase`, `i.until`, `i.biteAt`, `i.ct`, `i.nextCt`, `i.kv2`, `d`, `l`, `i.nextKv`, `i.nextAt`, `i.turnAt`, `i.kv`, `i.kim`, `i.prog`

### `my.view` — 202951–203868

- Conditions: `!e`; `e.phase==="cast"`; `e.phase==="lift"`; `e.phase==="reel"`; `e.phase==="power"&&Object.assign(r,{u:h,sp:e.sp,oz:this.cfg.power.orange,pz:this.cfg.power.perfect,left:Math.max(0,+(e.until-n).toFixed(1))}),(e.phase==="cast"||e.phase==="wait"||e …`; `e.hold`
- Numeric literals: `2`, `0`, `1`, `4`, `3`
- State writes: `r.win`, `r.lk`, `r.res`

