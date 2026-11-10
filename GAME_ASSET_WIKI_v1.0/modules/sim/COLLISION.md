# COLLISION — source-grounded module

**CONFIRMED**: Navigation mesh raster and boundary segments: Ln / ih, grid resolution 8, segments from edges appearing once, hash cells width 2, sweep/slide collision and walk-angle fallback. nearestOpen searches radial rings. Code-level behavior only.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (14)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Ln.constructor` | constructor | 2794–4581 | `T`, `e.slice`, `m.every`, `Math.abs`, `[0,2,4].map(d=>`${m[d]},${m[d+1]}`).sort().join`, `[0,2,4].map(d=>`${m[d]},${m[d+1]}`).sort`, `[0,2,4].map`, `s.has`, `s.add`, `i.push`, `Math.ceil`, `Ln.fill` |
| `Ln.segmentCount` | getter | 4581–4626 | — |
| `Ln.fill` | method | 4626–5101 | `Math.max`, `Math.floor`, `Math.min`, `Math.ceil`, `Math.abs` |
| `Ln.blockedCell` | method | 5101–5246 | `Math.floor` |
| `Ln.near` | method | 5246–5650 | `this.seen.fill`, `Math.max`, `Math.floor`, `this.cells.get` |
| `Ln.wallDistance` | method | 5650–5943 | `Ln.near`, `Math.max`, `Math.min`, `Math.hypot` |
| `Ln.blocked` | method | 5943–6097 | `Ln.blockedCell`, `Ln.wallDistance` |
| `Ln.nearestOpen` | method | 6097–6442 | `Number.isFinite`, `Ln.clampX`, `Ln.clampY`, `Ln.blocked`, `Math.ceil`, `Math.cos`, `Math.sin` |
| `Ln.cast` | method | 6442–7581 | `Math.min`, `Math.max`, `Ln.near`, `Math.hypot`, `Math.sqrt` |
| `Ln.sweep` | method | 7581–7853 | `Math.hypot`, `Ln.cast`, `Math.max`, `Math.min` |
| `Ln.move` | method | 7853–8088 | `Math.hypot`, `Ln.clampX`, `Ln.clampY`, `Math.max`, `Math.ceil`, `Ln.sweep` |
| `Ln.walk` | method | 8088–8432 | `Math.hypot`, `Ln.move`, `m`, `Math.cos`, `Math.sin` |
| `Ln.clampX` | method | 8432–8488 | `Math.max`, `Math.min` |
| `Ln.clampY` | method | 8488–8545 | `Math.max`, `Math.min` |

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

### `Ln.constructor` — 2794–4581

- Conditions: `!m.every(Number.isFinite)||Math.abs((m[2]-m[0])*(m[5]-m[1])-(m[4]-m[0])*(m[3]-m[1]))<1e-7`; `!(Math.abs(g)<1e-7)`; `p===k`; `p<k`; `v`
- Numeric literals: `0`, `5`, `6`, `2`, `1`, `4`, `3`, `1e-7`, `1000`, `22`
- State writes: `this.width`, `this.height`, `e`, `this.cols`, `this.rows`, `this.grid`, `this.segs`, `this.gw`, `v`, `this.seen`, `c`, `this.cellArr`, `this.cellArr[u]`

### `Ln.segmentCount` — 4581–4626

- Numeric literals: `4`

### `Ln.fill` — 4626–5101

- Conditions: `!(Math.abs(g)<1e-9)`
- Numeric literals: `0`, `1`, `1e-9`, `0.5`, `0.000001`
- State writes: `this.grid[d*this.cols+f]`

### `Ln.blockedCell` — 5101–5246

- Conditions: `e<0||s<0||e>=this.cols||s>=this.rows`
- Numeric literals: `0`, `1`

### `Ln.near` — 5246–5650

- Conditions: `d<this.cellArr.length`; `f`
- Numeric literals: `0`, `4294967295`, `1`
- State writes: `this.stamp`, `this.seen[l]`, `i[o++]`

### `Ln.wallDistance` — 5650–5943

- Numeric literals: `1`, `0`, `4`, `2`, `3`
- State writes: `s`

### `Ln.blocked` — 5943–6097

- Conditions: `t<wn-1e-6||n<wn-1e-6||t>this.width-wn+1e-6||n>this.height-wn+1e-6||this.blockedCell(t,n)`
- Numeric literals: `0.0001`, `0.000001`, `0`, `0.01`

### `Ln.nearestOpen` — 6097–6442

- Conditions: `!Number.isFinite(t)||!Number.isFinite(n)`; `t=this.clampX(t),n=this.clampY(n),!this.blocked(t,n,e)`; `!this.blocked(c,u,e+ko)`
- Numeric literals: `4`, `0.125`, `2`, `0`
- State writes: `t`, `n`

### `Ln.cast` — 6442–7581

- Conditions: `D<1e-9`; `w<o-1e-6`; `w>1e-9`; `K<-1e-9`; `R>=-1e-6&&R<=i`; `B>=0&&B<=1`; `R`; `ht<=0||W>=0`; `It<0`; `yt<0||yt>i`; `l`
- Numeric literals: `0.05`, `0`, `1`, `4`, `2`, `3`, `1e-9`, `0.000001`, `0.0001`
- State writes: `l`, `g`, `d`, `f`, `C`, `x`

### `Ln.sweep` — 7581–7853

- Conditions: `!u`
- Numeric literals: `0`, `3`, `1e-7`
- State writes: `e`, `s`

### `Ln.move` — 7853–8088

- Conditions: `o<1e-9`
- Numeric literals: `1e-9`, `1`, `0.001`, `0`
- State writes: `[t,n]`, `t`, `n`

### `Ln.walk` — 8088–8432

- Conditions: `o<1e-9`; `g>o*.6`
- Numeric literals: `1e-9`, `0.6`, `30`, `60`, `180`, `0.15`
- State writes: `g`, `r`, `h`


## Collision mathematics — CONFIRMED

- `Ln` [2782, 8546) constructs occupancy cells with `Res = 8` cells per world unit, i.e. cell width `1/8`; degenerate triangles have near-zero area and duplicate triangles are removed.
- `Ln.fill` [4626, 5101) marks cell centers when all barycentric coordinates are >= `-1e-6`; near-zero triangle determinant `< 1e-9` is skipped.
- `Ln.blockedCell` [5101, 5246) treats cells beyond raster bounds as blocked. `Ln.blocked` [5943, 6097) also enforces a `0.25` world-unit boundary margin and proximity to wall segments.
- `Ln.near` [5246, 5650) uses a segment spatial hash with cell width `2`; deduplicates with a `Uint32Array` stamp. `Ln.wallDistance` [5650, 5943) computes minimum point-to-line-segment distance.
- `Ln.cast` [6442, 7581) computes continuous circular collision with edges and endpoints; returns fractional travel `t` and collision normal (`nx`, `ny`).
- `Ln.sweep` [7581, 7853) tries up to 3 collision-slide passes. `Ln.move` [7853, 8088) subdivides displacement into steps of at most about `0.075` world units.
- `Ln.walk` [8088, 8432) attempts the original movement and then angle alternatives ±30° and ±60° if projected progress is insufficient (`<= 0.6 * requested distance`).
- `Ln.nearestOpen` [6097, 6442) scans concentric rings at increments of `0.125`, with default maximum radius 4; failure yields `null`.

These are local geometric operations. They do not establish synchronization or server authority.
