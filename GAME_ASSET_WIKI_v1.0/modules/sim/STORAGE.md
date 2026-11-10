# STORAGE — source-grounded module

**CONFIRMED**: Storage helper hx: restore/save/get/check/consume lifecycle.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (10)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `hx.constructor` | constructor | 356336–356395 | `T` |
| `hx.list` | method | 356395–356470 | `[...this.codes.values()].sort`, `this.codes.values` |
| `hx.get` | method | 356470–356506 | `this.codes.get`, `Qa` |
| `hx.save` | method | 356506–356532 | `hx.list` |
| `hx.restore` | method | 356532–356700 | `Array.isArray`, `this.codes.set` |
| `hx.put` | method | 356700–357506 | `Qa`, `ix.test`, `(Array.isArray(t.rewards)?t.rewards:[]).slice(0,ox).map(c=>({...c.item?{item:String(c.item)}:{},...c.gear?{gear:String(c.gear),upgrade:Math.max(0,Math.min(10,(c.upgrade??0)\|0))}:{},amount:Math.max(1,Math.min(1e7,Math.floor(Number(c.amount)\|\|1)))})).filter`, `(Array.isArray(t.rewards)?t.rewards:[]).slice(0,ox).map`, `(Array.isArray(t.rewards)?t.rewards:[]).slice`, `Array.isArray`, `String`, `Math.max`, `Math.min`, `Math.floor`, `Number`, `s` |
| `hx.setDisabled` | method | 357506–357588 | `hx.get` |
| `hx.remove` | method | 357588–357661 | `this.codes.delete`, `Qa` |
| `hx.check` | method | 357661–357901 | `hx.get`, `n.includes` |
| `hx.consume` | method | 357901–357966 | `hx.get` |

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

### `hx.constructor` — 356336–356395

- Numeric literals: `1`

### `hx.restore` — 356532–356700

- Conditions: `Array.isArray(t)`
- Numeric literals: `0`

### `hx.put` — 356700–357506

- Conditions: `!ix.test(i)`; `Array.isArray(t.rewards)`; `c.item`; `c.gear`; `!o.length`; `r==null`; `Number(t.days)>0`
- Numeric literals: `0`, `10`, `1`, `10000000`, `1000000`, `80`, `3650`, `86400000`
- State writes: `this.changed`

### `hx.setDisabled` — 357506–357588

- Numeric literals: `0`
- State writes: `e.disabled`, `this.changed`

### `hx.remove` — 357588–357661

- Numeric literals: `0`
- State writes: `this.changed`

### `hx.check` — 357661–357901

- Conditions: `!s||s.disabled`; `s.expiresAt&&e>s.expiresAt`; `n.includes(s.code)`; `s.maxUses&&s.used>=s.maxUses`

### `hx.consume` — 357901–357966

- Numeric literals: `0`
- State writes: `this.changed`

