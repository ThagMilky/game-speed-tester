# PROGRESS — source-grounded module

**CONFIRMED**: Progress helper Xp: marks, logs, state restore/save and adjacency.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (8)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Xp.constructor` | constructor | 239302–239424 | `T` |
| `Xp.mark` | method | 239424–239505 | `this.crops.get`, `this.crops.set` |
| `Xp.addLog` | method | 239505–239626 | `this.log.get`, `e.push`, `e.splice`, `this.log.set` |
| `Xp.save` | method | 239626–239708 | `this.pub.values` |
| `Xp.restore` | method | 239708–240033 | `((t==null?void 0:t.pub)??[]).filter(n=>n&&typeof n.n=="string").map`, `((t==null?void 0:t.pub)??[]).filter`, `((t==null?void 0:t.crops)??[]).filter`, `Array.isArray`, `((t==null?void 0:t.log)??[]).filter` |
| `Xp.readyAt` | method | 240033–240153 | `this.crops.get`, `$i` |
| `Xp.neighbours` | method | 240153–240721 | `[...this.log.get(t)??[]].reverse().map`, `[...this.log.get(t)??[]].reverse`, `this.log.get`, `c.pl.reduce`, `Xp.readyAt`, `[...new Set([...n,...i])].filter`, `this.pub.has`, `[...this.pub.values()].filter(u=>u.n!==t&&!h.includes(u.n)).sort`, `[...this.pub.values()].filter`, `this.pub.values`, `h.includes`, `o` |
| `Xp.view` | method | 240721–241087 | `this.pub.get`, `(this.log.get(t)??[]).slice`, `this.log.get`, `e.pl.map`, `this.crops.get`, `$i`, `Ms`, `Xp.readyAt` |

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

### `Xp.constructor` — 239302–239424

- Numeric literals: `1`

### `Xp.mark` — 239424–239505

- State writes: `n`

### `Xp.addLog` — 239505–239626

- Numeric literals: `20`, `0`
- State writes: `this.changed`

### `Xp.restore` — 239708–240033

- Conditions: `t==null`
- Numeric literals: `0`, `1`
- State writes: `this.pub`, `this.crops`, `this.log`, `this.changed`

### `Xp.readyAt` — 240033–240153

- Conditions: `(i=this.crops.get($i(t,n,e.at)))==null`
- Numeric literals: `0`
- State writes: `i`

### `Xp.neighbours` — 240153–240721

- Conditions: `m&&e>=this.readyAt(c.n,g,{at:m[1],rd:m[2]})`; `m&&e<this.readyAt(c.n,g,{at:m[1],rd:m[2]})`; `h.length<s`; `h.push(c.n),h.length>=s`; `n.includes(c)`
- Numeric literals: `20`, `1`, `2`, `0`

### `Xp.view` — 240721–241087

- Conditions: `e`; `!s`; `(r=Ms(s[0]))==null`; `o==null`
- Numeric literals: `8`, `0`, `1`, `2`, `3`
- State writes: `r`

