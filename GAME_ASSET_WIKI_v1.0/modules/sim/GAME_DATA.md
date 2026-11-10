# GAME_DATA — source-grounded module

**CONFIRMED**: Class and skill metadata K1, Gn, Cu, U1 and related config; class variants include kiem-tien, co-su, ma-tong and the-tu via imports. Do not equate tooltip text with executed logic; j1.run/damage decide outcomes.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (20)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `er` | variable | 26208–27145 | — |
| `it` | variable | 27146–27342 | — |
| `wm` | function | 27864–28034 | — |
| `ar` | variable | 28040–29947 | — |
| `Tm` | variable | 29948–29990 | — |
| `ee` | function | 35106–35652 | `a.split`, `Number`, `Number.isInteger`, `Jl` |
| `U1` | function | 35777–40365 | `t`, `a.skills.slice(0,5).map`, `a.skills.slice` |
| `$n` | variable | 40371–40491 | — |
| `Ka` | variable | 40492–40533 | — |
| `Re` | variable | 40534–40636 | — |
| `K1` | variable | 40651–79713 | — |
| `Gn` | variable | 79758–80162 | — |
| `F1` | variable | 80268–80518 | — |
| `q1` | variable | 80828–81152 | — |
| `Cu` | variable | 81153–81203 | — |
| `wt` | arrow_function | 81204–81464 | — |
| `Ia` | arrow_function | 81465–81832 | — |
| `is` | function | 82366–82476 | — |
| `ea` | function | 82476–82861 | `yn`, `[...s.slice(0,5),...s.slice(5).filter(c=>c.free)].map`, `s.slice`, `s.slice(5).filter`, `Array.isArray`, `i.slice`, `s.slice(5).find`, `Array.from`, `o.has`, `s.some`, `i.includes`, `t.includes` |
| `Nu` | function | 83064–83258 | `/^[1-6]$/.test`, `yn`, `s.find`, `Number`, `s.slice(5).find`, `s.slice`, `s.slice(0,5).find`, `String` |

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

### `wm` — 27864–28034

- Conditions: `i`
- Numeric literals: `3`, `0.7`, `0.28`, `1`

### `ee` — 35106–35652

- Conditions: `!e||!Number.isInteger(s)||s<0||s>5`; `t==="kiem-tien"`
- Numeric literals: `0`, `5`, `6`, `18`, `0.1`, `65`, `12`, `1`, `3.2`, `160`, `0.35`, `0.7`

### `U1` — 35777–40365

- Conditions: `a.id==="co-su"`; `a.id==="ma-tong"`; `a.id==="kiem-tien"`
- Numeric literals: `7`, `0.06`, `1`, `0.7`, `0`, `0.26`, `0.3`, `2`, `3`, `5`, `30`, `35`, `24`, `3.2`, `1.52`, `3.3`, `6`, `9`, `26`, `1.2`, `0.72`, `0.33`, `10`, `38`, `0.8`, `0.95`, `16`, `0.55`, `4`, `2.5`, `1.225`, `0.5`, `22`, `18`, `2.2`, `0.9`, `0.2`, `0.012`, `12`, `2.4`, `0.045`, `0.035`, `20`, `4.5`, `28`, `2.7`, `0.85`, `1.5`, `1.1`, `0.65`, `8`, `14`, `0.6`, `1.7`, `1.3`, `2.3`, `32`, `0.03`, `0.02`, `25`, `65`, `0.35`, `3.5`, `0.08`, `60`

### `wt` — 81204–81464

- Numeric literals: `0`, `1`

### `Ia` — 81465–81832

- Numeric literals: `40`, `0`, `1`, `50`

### `is` — 82366–82476

- Numeric literals: `0`, `1`

### `ea` — 82476–82861

- Conditions: `Array.isArray(n)`; `(h=s.slice(5).find(c=>c.free))==null`; `typeof m!="string"||o.has(m)||!s.some(g=>g.id===m)||!i.includes(m)&&!t.includes(m)`
- Numeric literals: `0`, `5`, `6`
- State writes: `h`

### `Nu` — 83064–83258

- Conditions: `!/^[1-6]$/.test(t)`; `e`; `t==="6"`
- Numeric literals: `1`, `5`, `0`


## Skill table vs. executable behavior

- `K1` [40651, 79713) contains static class metadata, core skills, mechanics and many Vietnamese descriptions.
- `U1` [35777, 40365) replaces/extends skill arrays for selected classes, and `Gn` [79758, 80162) builds enabled definitions from imported class filters and extra skills; `Cu` [81153, 81203) indexes resulting class definitions.
- `Nu` [83064, 83258) resolves selected skill slots, `ea` [82476, 82861) normalizes the 6 configured slots. A listed `text`/`note` is descriptive data, not independently verified gameplay.
- Skill fields `dmg`, `dmg2`, `hits`, `interval`, `shape`, `range`, `castRange`, `contact`, `lock`, `manaPct`, `effects`, `fx` and `anim` are used by different execution paths. Actual damage uses `j1.damage` [94669, 99733), and per-shape dispatch uses `j1.run` [89947, 93143).
- The visible base configuration includes five-element talents, ten-class catalog plus externally supplied class definitions, pets, cosmetic weapons, a dash formula and progression constants. Exact active catalog is conditional on imported functions and data.
