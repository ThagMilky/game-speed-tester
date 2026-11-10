# ELEMENTS — source-grounded module

**CONFIRMED**: Five elemental root types, grades, talents, activation and root skill effects. Several thresholds and percentages are embedded in data arrays; see corresponding symbol offsets.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (16)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Zf` | variable | 15710–15716 | — |
| `a1` | variable | 15881–19381 | — |
| `s1` | variable | 19409–22483 | — |
| `na` | function | 22516–22814 | `Jn`, `[0,1].flatMap`, `t.nodes.slice`, `s1[t.id].slice`, `e.map`, `Math.min` |
| `o1` | function | 22852–23445 | `Array.isArray`, `Jn`, `a.elements.find`, `Number.isFinite`, `Math.max`, `Math.floor`, `e`, `Math.min`, `na`, `i.has`, `vm`, `s.nodes.push` |
| `vm` | function | 23445–23795 | `na(a.active).find`, `na`, `s.includes`, `ui`, `na(a.active).some`, `bm` |
| `h1` | arrow_function | 23894–23993 | `Bt` |
| `vu` | arrow_function | 23994–24125 | `Math.min`, `Math.ceil`, `Bt` |
| `r1` | arrow_function | 24126–24187 | `Bt` |
| `xu` | arrow_function | 24188–24327 | `Bt`, `Number` |
| `Dn` | variable | 24328–24843 | — |
| `ss` | variable | 24862–24868 | — |
| `Gi` | arrow_function | 25056–25139 | `Math.max`, `Math.min`, `Math.floor` |
| `m1` | function | 25182–25315 | `Dn.reduce` |
| `d1` | function | 25315–25517 | `Math.floor`, `Math.min` |
| `Mm` | function | 25539–25752 | `Gi`, `na`, `n.has` |

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

### `na` — 22516–22814

- Conditions: `t`; `r`
- Numeric literals: `0`, `1`, `3`, `5`, `15`, `30`, `151`, `401`, `671`, `2`

### `o1` — 22852–23445

- Conditions: `!a||!Array.isArray(a.elements)`; `Jn(a.active)`; `!n&&!a.elements.length`; `Number.isFinite(o)`; `Array.isArray(a.nodes)`
- Numeric literals: `0`, `1`
- State writes: `s.switches`, `s.resets`, `s.ltReadyAt`, `s.grade`, `s.luck`

### `vm` — 23445–23795

- Conditions: `e`; `s.includes(t)`; `n<e.level`; `e.parent&&!s.includes(e.parent)`; `e.tier===3&&na(a.active).some(i=>i.tier===3&&s.includes(i.id))`; `s.length>=bm(n)`
- Numeric literals: `3`

### `h1` — 23894–23993

- Conditions: `(a==null?void 0:a.active)==="hoa"`; `a==null`; `(a==null?void 0:a.active)==="thuy"&&Bt(a,"tinh")`
- Numeric literals: `0`, `1.03`, `0.85`, `1`

### `vu` — 23994–24125

- Conditions: `(a==null?void 0:a.active)==="hoa"`; `a==null`; `(a==null?void 0:a.active)==="thuy"&&Bt(a,"tinh")`
- Numeric literals: `100`, `0`, `1.03`, `0.9`, `1`

### `r1` — 24126–24187

- Conditions: `(a==null?void 0:a.active)==="thuy"&&Bt(a,"tuyen")`; `a==null`
- Numeric literals: `0`, `0.08`

### `xu` — 24188–24327

- Conditions: `(a==null?void 0:a.active)==="kim"&&Bt(a,"tam")`; `a==null`; `(a==null?void 0:a.active)==="tho"`
- Numeric literals: `0`, `0.08`

### `Gi` — 25056–25139

- Conditions: `a==null`
- Numeric literals: `0`, `1`

### `m1` — 25182–25315

- Conditions: `n-=Dn[e].weight,n<0`
- Numeric literals: `0`
- State writes: `n`

### `d1` — 25315–25517

- Conditions: `e`; `(a.luck??0)>=ss||t<e.chance`
- Numeric literals: `0`, `1`

### `Mm` — 25539–25752

- Conditions: `!(a!=null&&a.active)`; `i.branch===0`
- Numeric literals: `0`


## Element/root rules — CONFIRMED

- `oh = ["kim", "moc", "thuy", "hoa", "tho"]`; `a1` [15881, 19381) and `s1` [19409, 22483) describe talent routes; `na` [22516, 22814) generates skill-tree nodes and prerequisites.
- `vm` [23445, 23795) checks level requirement, prerequisite node, tier-3 exclusivity and available point budget; `i1 = [5, 10, 20, 30, 151, 401, 671, 941]` controls point availability through `bm`.
- `Dn` [24328, 24843) defines five quality grades with weighted probabilities and attributes; `m1` [25182, 25315) samples from weights; `d1` [25315, 25517) calculates grade advancement and pity-like luck increments.
- `Mm` [25539, 25752) sums grade attack/HP multipliers and branch node bonuses; `h1` [23894, 23993) and `vu` [23994, 24125) adjust energy and Thánh Huyết costs by active element/node.
- Active element effects during casts and hits are implemented separately in `j1.rootCast` [139566, 140276) and `j1.rootHit` [134652, 138103).
