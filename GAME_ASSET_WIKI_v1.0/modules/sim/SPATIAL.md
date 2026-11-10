# SPATIAL — source-grounded module

**CONFIRMED**: Helper spatial indexing Ys: rebuild/query. Review query consumers to determine indexing scope and efficiency.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (3)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Ys.constructor` | constructor | 183945–184081 | `T` |
| `Ys.rebuild` | method | 184081–184484 | `this.cells.clear`, `Math.floor`, `Ou`, `Number.isFinite`, `this.cells.get`, `o.push`, `this.cells.set` |
| `Ys.query` | method | 184484–184872 | `Math.max`, `Math.floor`, `Math.min`, `this.cells.get`, `Ou`, `Math.abs`, `i.push` |

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

### `Ys.constructor` — 183945–184081

- Numeric literals: `16`, `1`, `0`
- State writes: `this.size`

### `Ys.rebuild` — 184081–184484

- Conditions: `o`
- Numeric literals: `1`, `0`
- State writes: `this.minCx`, `this.minCy`, `this.maxCx`, `this.maxCy`

### `Ys.query` — 184484–184872

- Conditions: `g`

