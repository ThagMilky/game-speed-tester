# ROOMS — source-grounded module

**CONFIRMED**: Room and scene data Xh; check world construction for topology, portal rendering and positions.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (5)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Xh.constructor` | constructor | 567547–570195 | `T`, `(((u=s.camps[i])==null?void 0:u.camps)??[]).flatMap`, `l.members.map`, `(n.monsters??[]).filter`, `Em`, `Ek`, `Math.max`, `Math.round`, `xn`, `Math.min`, `Xh.bossClearing`, `this.collision.nearestOpen` |
| `Xh.bossClearing` | method | 570195–570628 | `this.collision.nearestOpen`, `this.collision.blocked`, `Math.round`, `i.has`, `i.add`, `s.push` |
| `Xh.arena` | method | 570628–571265 | `Math.floor`, `this.collision.blocked`, `r`, `o.push`, `Math.hypot`, `Math.min` |
| `Xh.scene` | getter | 571265–571299 | — |
| `Xh.near` | method | 571299–571357 | `Math.abs` |

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

### `Xh.constructor` — 567547–570195

- Conditions: `(u=s.camps[i])==null`; `p.elite`; `l.gu`; `l.level===1&&p!=="boss"`; `p==="boss"`; `!S`; `p==="elite"`; `l.gu||Vu.test(l.set)`; `p==="gu"`; `(m=s.herbs.scenes.find(p=>p.scene===i))==null`; `(g=s.posts[i])==null`; `(d=s.posts[i])==null`; `c`; `c.spawn&&!this.collision.blocked(...c.spawn,3)`; `(f=s.camps[i])==null`
- Numeric literals: `0`, `2`, `1`, `0.5`, `0.2`, `0.9`, `0.26`, `1.5`, `1.9`, `1.7`, `6`, `5`, `4.5`, `3`, `12`, `4`, `0.6`, `8`, `30`, `60`, `1000`
- State writes: `this.world`, `this.map`, `this.nextId`, `this.collision`, `u`, `m`, `g`, `this.stele`, `d`, `f`, `this.wb`

### `Xh.bossClearing` — 570195–570628

- Conditions: `!e`; `!this.collision.blocked(r,h,4)`
- Numeric literals: `0.9`, `0`, `4`, `1`, `2`

### `Xh.arena` — 570628–571265

- Conditions: `p>=12`
- Numeric literals: `1`, `0.5`, `0.35`, `0`, `12`, `1000000000`, `4`, `16`, `0.01`
- State writes: `i[c*e+h]`, `k`, `m`, `u`, `i[S]`

