# QUESTS — source-grounded module

**CONFIRMED**: Quest manager Fk: available, accept, progress, complete, claim, record, save/load; data consistency also depends on imported quest definitions.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (25)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Fk.constructor` | constructor | 185218–185432 | `T` |
| `Fk.def` | method | 185432–185577 | `this.data.quests.map`, `this.index.get` |
| `Fk.rec` | method | 185577–185611 | `this.records.get` |
| `Fk.claimed` | method | 185611–185688 | `this.records.get` |
| `Fk.available` | method | 185688–185823 | `this.records.has`, `(t.requires??[]).every`, `Fk.claimed`, `Fk.level`, `Fk.allowed` |
| `Fk.allowed` | method | 185823–186010 | `this.ctx.classId`, `Ns`, `this.ctx.bookOpen` |
| `Fk.skips` | method | 186010–186054 | `Ns` |
| `Fk.npcLine` | method | 186054–186215 | `Fk.claimed`, `Ns` |
| `Fk.text` | method | 186215–186345 | `Object.entries`, `Ns` |
| `Fk.choose` | method | 186345–186670 | `Fk.active`, `s.choice.options.some`, `s.goals.findIndex`, `this.records.get` |
| `Fk.pin` | method | 186670–186800 | `this.records.has`, `Fk.claimed`, `[t,...this.pins.filter(n=>n!==t)].slice`, `this.pins.filter` |
| `Fk.unpin` | method | 186800–186846 | `this.pins.filter` |
| `Fk.active` | method | 186846–186949 | `[...this.records.values()].filter(t=>!t.claimed).map(t=>this.def(t.id)).filter`, `[...this.records.values()].filter(t=>!t.claimed).map`, `[...this.records.values()].filter`, `this.records.values`, `Fk.def` |
| `Fk.lock` | method | 186949–187060 | `this.data.unlocks.find`, `Fk.claimed`, `Fk.def` |
| `Fk.accept` | method | 187060–187254 | `Fk.def`, `Fk.available`, `this.records.set`, `n.goals.map`, `Fk.refreshState` |
| `Fk.progress` | method | 187254–187462 | `Fk.def`, `this.records.get`, `n.goals.map`, `Fk.skips`, `s[0].startsWith`, `Math.min`, `this.inventory().get`, `Fk.inventory`, `s[0].slice` |
| `Fk.goalsLeft` | method | 187462–187588 | `Fk.def`, `Fk.progress`, `n.goals.filter((s,i)=>e[i]<s[2]&&!this.skips(s)).map`, `n.goals.filter`, `Fk.skips` |
| `Fk.complete` | method | 187588–187694 | `Fk.def`, `Fk.rec`, `this.progress(t).every`, `Fk.progress` |
| `Fk.claim` | method | 187694–188323 | `Fk.def`, `this.records.get`, `Fk.complete`, `Oe`, `r[0].startsWith`, `Fk.skips`, `r[0].slice`, `Fk.inventory`, `Fk.consume`, `c.set`, `Math.max`, `c.get` |
| `Fk.record` | method | 188323–188775 | `this.records.values`, `Fk.def`, `i.goals.forEach`, `Uk.test`, `Fk.skips`, `o[0].startsWith`, `h.endsWith`, `t.startsWith`, `h.startsWith`, `h.includes`, `h.split("\|").includes`, `h.split` |
| `Fk.refreshState` | method | 188775–189028 | `this.records.values`, `Fk.def`, `n.goals.forEach`, `o.call`, `Math.min`, `Math.max` |
| `Fk.forNpc` | method | 189028–189313 | `this.active().filter`, `Fk.active`, `Oe`, `Fk.complete`, `this.data.quests.filter`, `Vm`, `Fk.available`, `n.goals.some`, `e[0].startsWith`, `Fk.progress` |
| `Fk.mark` | method | 189313–189409 | `Fk.forNpc` |
| `Fk.save` | method | 189409–189683 | `[...this.records.values()].map`, `this.records.values`, `Fk.def`, `n.goals.map`, `Object.keys` |
| `Fk.load` | method | 189683–190281 | `Object.entries`, `(Array.isArray(t.pins)?t.pins:[]).filter(n=>typeof n=="string"&&this.def(n)).slice`, `(Array.isArray(t.pins)?t.pins:[]).filter`, `Array.isArray`, `Fk.def`, `this.records.clear`, `this.records.set`, `this.def(n.id).goals.map`, `Math.min`, `Math.max`, `i.includes`, `n.keys.indexOf` |

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

### `Fk.constructor` — 185218–185432

- State writes: `this.data`, `this.inventory`, `this.level`, `this.current`, `this.consume`

### `Fk.def` — 185432–185577

- State writes: `this.index`

### `Fk.claimed` — 185611–185688

- Conditions: `(n=this.records.get(t))==null`
- Numeric literals: `0`
- State writes: `n`

### `Fk.available` — 185688–185823

- Numeric literals: `0`

### `Fk.skips` — 186010–186054

- Numeric literals: `3`

### `Fk.npcLine` — 186054–186215

- Conditions: `(s=(e=this.data.kt)==null?void 0:e.npcTalk)==null`; `(e=this.data.kt)==null`
- Numeric literals: `0`
- State writes: `s`, `e`, `n`

### `Fk.text` — 186215–186345

- Conditions: `n==="intro"`; `Ns(this.flags,s)`

### `Fk.choose` — 186345–186670

- Conditions: `((e=s.choice)==null?void 0:e.id)!==t||!s.choice.options.some(r=>r.v===n)`; `(e=s.choice)==null`; `!(i<0||(o.progress[i]??0)>=s.goals[i][2])`
- Numeric literals: `0`, `2`
- State writes: `e`, `this.flags[t]`, `o.progress[i]`

### `Fk.pin` — 186670–186800

- Conditions: `!this.records.has(t)||this.claimed(t)`
- Numeric literals: `1`, `0`
- State writes: `this.pins`, `this.tracked`

### `Fk.unpin` — 186800–186846

- State writes: `this.pins`

### `Fk.lock` — 186949–187060

- Conditions: `n&&!this.claimed(n.quest)`

### `Fk.accept` — 187060–187254

- Conditions: `!n||!this.available(n)`
- Numeric literals: `1`, `0`
- State writes: `this.tracked`

### `Fk.progress` — 187254–187462

- Conditions: `!n||!e`; `this.skips(s)`; `s[0].startsWith("collect:")`
- Numeric literals: `2`, `0`, `8`

### `Fk.goalsLeft` — 187462–187588

- Conditions: `n`
- Numeric literals: `2`, `0`

### `Fk.complete` — 187588–187694

- Numeric literals: `2`

### `Fk.claim` — 187694–188323

- Conditions: `!e||!s||s.claimed||!this.complete(t)||Oe(e)!==n`; `r[0].startsWith("collect:")&&!this.skips(r)`; `this.consume`; `e.repeatable`; `(o=this.active()[0])==null`
- Numeric literals: `0`, `8`, `2`
- State writes: `s.claimed`, `this.flags[r]`, `this.tracked`, `o`

### `Fk.record` — 188323–188775

- Conditions: `s.claimed`; `Uk.test(o[0])||s.progress[r]>=o[2]||this.skips(o)||o[0].startsWith("choice:")`
- Numeric literals: `1`, `0`, `2`
- State writes: `s.progress[r]`

### `Fk.refreshState` — 188775–189028

- Conditions: `t.claimed`; `(o=this.current)==null`
- Numeric literals: `0`, `2`
- State writes: `o`, `t.progress[s]`

### `Fk.forNpc` — 189028–189313

- Numeric literals: `0`, `2`

### `Fk.mark` — 189313–189409

- Conditions: `n.handIn.length||n.talk.length`; `n.offers.length`

### `Fk.save` — 189409–189683

- Conditions: `(n=this.def(t.id))==null`; `Object.keys(this.flags).length`; `this.pins.length`
- Numeric literals: `0`
- State writes: `n`

### `Fk.load` — 189683–190281

- Conditions: `Array.isArray(t.pins)`; `(i=n.keys)!=null&&i.includes(e[0])`; `n.claimed`; `t.tracked&&this.def(t.tracked)`
- Numeric literals: `40`, `0`, `2`
- State writes: `this.flags`, `this.flags[n]`, `this.pins`, `i`, `this.tracked`

