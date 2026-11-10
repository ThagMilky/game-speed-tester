# EQUIPMENT — source-grounded module

**CONFIRMED**: Equipment/set hook engine Jf: cast, multiplier, landed, hurt, absorb, speed, detonate, tick. Equipment activation uses hn, pm and rn with weak-map caches, cooldown guards and set membership. Effects may alter damage, shields, healing, speed or periodic actions.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (10)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Jf.constructor` | constructor | 11013–11081 | — |
| `Jf.cast` | method | 11081–11677 | `hn`, `rn`, `lt`, `Math.min`, `["van-kiem","co-vuong","thien-ma","loi-kiem","van-co","huyet-nguyet"].includes` |
| `Jf.multiplier` | method | 11677–12245 | `hn`, `lt`, `n.st.dots.some` |
| `Jf.landed` | method | 12245–13998 | `hn`, `String`, `Jf.heal`, `rn`, `Math.min`, `Jf.hit`, `this.foes(t,n).filter(l=>l!==e&&!l.dead&&Math.hypot(l.x-e.x,l.y-e.y)<=la.radius).slice`, `this.foes(t,n).filter`, `Jf.foes`, `Math.hypot`, `lt`, `this.foes(t,n).filter(g=>Math.hypot(g.x-e.x,g.y-e.y)<=2).slice` |
| `Jf.hurt` | method | 13998–14695 | `hn`, `r.world.epoch`, `Date.now`, `lt`, `t.note`, `Math.round`, `rn` |
| `Jf.absorb` | method | 14695–14893 | `hn`, `lt`, `Math.min` |
| `Jf.shield` | method | 14893–14953 | `hn` |
| `Jf.speed` | method | 14953–15051 | `hn` |
| `Jf.detonate` | method | 15051–15173 | `hn`, `rn` |
| `Jf.tick` | method | 15173–15667 | `hn`, `lt`, `Jf.heal`, `this.foes(t,n).filter(r=>Math.hypot(r.x-i.x,r.y-i.y)<=2.5).slice`, `this.foes(t,n).filter`, `Jf.foes`, `Math.hypot`, `i.marked.has`, `i.marked.add`, `Jf.mark`, `Jf.hit` |

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

### `Jf.constructor` — 11013–11081

- State writes: `this.heal`, `this.hit`, `this.foes`, `this.mark`

### `Jf.cast` — 11081–11677

- Conditions: `(h=n.def.skills[4])==null`; `o.ready>s&&e.dmg>0`
- Numeric literals: `6`, `2`, `0`, `3`, `8`, `0.05`, `4`, `18`, `0.15`, `20`, `5`, `25`, `1`
- State writes: `o.speed`, `o.paid`, `o.cd["linh-tuyen"]`, `n.mp`, `h`, `o.shield`, `o.shieldUntil`, `o.buff`, `o.ready`, `o.empowered`

### `Jf.multiplier` — 11677–12245

- Conditions: `lt(o,"ex-set-bat-diet-thanh-cot")`; `lt(o,"thien-ma-huyet-y")`; `lt(o,"ex-set-vo-thuy-kiem-tam")`
- Numeric literals: `1`, `0`, `0.4`, `1.12`, `1.08`, `1.15`, `1.18`, `5`, `0.5`

### `Jf.landed` — 12245–13998

- Conditions: `s<=0||n.dead`; `o==null`; `n.bonus.directLeech&&this.heal(t,n,s*n.bonus.directLeech*(u?1:1/3)*("hx"in e?1:Pn.sustain)),h.hits.leech=c,e.dead&&"hx"in e&&e.cls!=="boss"&&rn(h,"son-lam",i,3)&&this.heal(t,n,n.ma …`; `u`; `"hx"in e`; `m>0&&(h.cd["kt-awaken"]??0)<=i`; `h.cd["kt-awaken"]=i+la.cd[g],this.hit(t,n,e,d),la.extra[g]`; `lt(h,"loi-van")&&++h.lightning>=4&&(h.cd["loi-van"]??0)<=i`; `h.swordReady&&(h.cd["thai-at-kiem-tong"]??0)<=i&&lt(h,"thai-at-kiem-tong")`
- Numeric literals: `1`, `0`, `3`, `0.02`, `0.4`, `20`, `0.18`, `6`, `5`, `4`, `2`, `15`, `8`, `10`, `12`
- State writes: `h.hits.leech`, `h.shield`, `h.shieldUntil`, `h.buff`, `h.hits.skill`, `h.cd["kt-awaken"]`, `h.lightning`, `h.cd["loi-van"]`, `h.swordReady`, `h.cd["thai-at-kiem-tong"]`, `h.chainUntil`, `h.ready`, `h.cd["linh-hu"]`, `h.swordUntil`, `h.cd["ex-set-vo-thuy-kiem-tam"]`

### `Jf.hurt` — 13998–14695

- Conditions: `t.dead||t.hp<=0`; `(r=t.room)==null`; `s`
- Numeric literals: `0`, `1`, `1000`, `0.5`, `20`, `4`, `0.02`, `0.4`, `0.12`, `6`, `0.3`, `40`, `0.25`, `0.025`
- State writes: `r`, `t.kimVanReadyAt`, `t.dirty`, `i.kimVanPvp`, `i.shield`, `i.shieldUntil`, `i.hot`, `i.hotRate`, `i.next`

### `Jf.absorb` — 14695–14893

- Conditions: `i.shieldUntil<=e`
- Numeric literals: `1`, `0`
- State writes: `i.kimVanPvp`, `i.shield`

### `Jf.shield` — 14893–14953

- Conditions: `e.shieldUntil>n`
- Numeric literals: `0`

### `Jf.speed` — 14953–15051

- Conditions: `hn(t).speed>n`; `n>=t.combatUntil&&!t.dead`
- Numeric literals: `1.12`, `1`, `0`

### `Jf.detonate` — 15051–15173

- Numeric literals: `5`, `8`, `3`, `1`
- State writes: `i.field`

### `Jf.tick` — 15173–15667

- Conditions: `n.dead`; `i&&i.until>=e`; `e>=i.next`
- Numeric literals: `1`, `0.01`, `0.02`, `2.5`, `0`, `5`, `6.25`
- State writes: `s.next`, `s.field`

