# PLAYER — source-grounded module

**CONFIRMED**: Player model Ql: state, inventory, level, equipment, persistence serialization, reward grants, notes and stat sheet. Confirm saved field contracts by reading methods and external callers.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (18)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `Ql.constructor` | constructor | 549471–559166 | `T`, `wf`, `Am`, `Zm`, `th`, `wt`, `Ia`, `ts`, `kn`, `mh`, `Tf`, `sk` |
| `Ql.applyLevel` | method | 559166–561085 | `kn`, `[...this.worn.values()].map(r=>this.gear.find(h=>h.uid===r)).filter`, `[...this.worn.values()].map`, `this.worn.values`, `this.gear.find`, `ge`, `n.map`, `Cf`, `Hf`, `is`, `zh`, `Math.round` |
| `Ql.give` | method | 561085–561644 | `Number.isSafeInteger`, `Object.hasOwn`, `Math.max`, `fo`, `zn`, `gu`, `ot`, `Date.now().toString`, `Date.now`, `this.gear.push`, `du`, `this.inv.set` |
| `Ql.count` | method | 561644–561679 | `this.inv.get` |
| `Ql.freeCount` | method | 561679–561864 | `Ql.count`, `Object.hasOwn`, `Number.isSafeInteger`, `Math.max` |
| `Ql.takeFree` | method | 561864–561990 | `Number.isSafeInteger`, `Ql.freeCount`, `this.inv.set`, `Ql.count` |
| `Ql.grantRewardGear` | method | 561990–562370 | `He`, `this.gear.some`, `n.gear.some`, `this.pendingGear.some`, `Ql.gearFits`, `this.gear.push`, `this.pendingGear.push`, `Ql.note` |
| `Ql.grantGmSkills` | method | 562370–562419 | `Ql.grantAllSkills` |
| `Ql.grantAllSkills` | method | 562419–562877 | `this.def.skills.slice`, `this.learnedSkills.includes`, `this.learnedSkills.push`, `ea`, `this.def.skills.slice(5).find`, `this.skillSlots.includes` |
| `Ql.gearFits` | method | 562877–562940 | `Lf`, `this.worn.values` |
| `Ql.giveGear` | method | 562940–563159 | `gu`, `ot`, `zn`, `Date.now().toString`, `Date.now`, `Math.max`, `Math.min`, `this.gear.push` |
| `Ql.savePills` | method | 563159–563337 | `s.push` |
| `Ql.profile` | method | 563337–565980 | `t.epoch`, `Date.now`, `Object.fromEntries`, `Object.entries(this.rootExtra).map`, `Object.entries`, `Math.max`, `Object.entries(this.cd).filter(([g,d])=>/^[1-6]$/.test(g)\|\|g.startsWith("skill:")).filter(([,g])=>g>e).map`, `Object.entries(this.cd).filter(([g,d])=>/^[1-6]$/.test(g)\|\|g.startsWith("skill:")).filter`, `Object.entries(this.cd).filter`, `/^[1-6]$/.test`, `g.startsWith`, `xt.map` |
| `Ql.statSheet` | method | 565980–566347 | `Math.round`, `Hm`, `t`, `Math.min` |
| `Ql.note` | method | 566347–566391 | `this.events.push` |
| `Ql.toast` | method | 566391–566437 | `this.events.push` |
| `Ql.weeklyGlow` | method | 566437–566503 | `this.titles.owned.some`, `os`, `Ei` |
| `Ql.outfitCheck` | method | 566503–567376 | `o.uid.startsWith`, `this.gear.some`, `this.pendingGear.some`, `r.startsWith`, `this.worn.delete`, `this.gear.filter`, `e`, `this.pendingGear.filter`, `Ql.applyLevel`, `Ql.note`, `Number.isFinite`, `s.includes` |

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

### `Ql.constructor` — 549471–559166

- Conditions: `Number.isFinite(n.kimVanReadyAt)`; `Number.isFinite(n.xpFraction)`; `Array.isArray(n.bossMounts)`; `Array.isArray(n.codes)`; `n.mount&&fe(this,n.mount)`; `Number.isSafeInteger(n.pvpKills)`; `typeof d=="number"&&Number.isFinite(d)`; `typeof m.best=="string"`; `!f`; `d&&f.cls===n.classId`; `l`; `this.learnedSkills.includes(n.extraSkill??"")`; `u==="equipped"`; `u==="class:chosen"`; `u==="root:awaken"||u==="root:select"`; `Number.isFinite(n.attrLtReadyAt)`; `(r=this.disciple)==null`; `Array.isArray(n.pendingGear)`; `!u||i.some(m=>Aa(m,u))`; `u==="Thiết kiếm"||!g||m<=0`; `d`; `o&&(this.inv.set(Bn("tb-kiem-tien"),(this.inv.get(Bn("tb-kiem-tien"))??0)+o),this.inv.delete("Mảnh Thái Hư Tiên Kiếm")),s`; `this.theTuArmed=n.theTuArmed===!0,this.classId==="the-tu"&&!this.theTuArmed&&n.gear!==void 0&&(this.theTuArmed=!0,!this.gear.some(u=>{var m;return((m=ta[u.id])==null?void 0:m.class …`; `(m=ta[u.id])==null`; `u`; `(h=ta[m.id])==null`; `!this.gear.length&&n.gear===void 0`; `(c=n.kt)==null`; `u.load`
- Numeric literals: `0`, `1`, `2`, `1.5`, `0.999999`, `4`, `500`, `40`, `5`, `20`, `36`
- State writes: `this.donation`, `this.titles`, `this.kimVanReadyAt`, `n`, `this.forge`, `this.xpFraction`, `this.conBangUnlocked`, `this.hacLongUnlocked`, `this.bossMounts`, `this.attrResets`, `this.lootMin`, `this.lootRecover`, `this.codes`, `this.mount`, `this.pvpKills`, `this.pvpWeek`, `this.dosat`, `this.fishStats`, `this.fishDaily`, `this.realmRewards`, `this.realm`, `this.realmRetry`, `this.realmBooks`, `this.learnedRealms`, `this.realmSkill`, `this.inheritanceProgress`, `this.learnedSkills`, `this.extraSkill`, `this.skillSlots`, `this.skillLevels`, `this.skinId`, `this.id`, `this.name`, `this.classId`, `this.def`, `this.book`, `m`, `this.level`, `this.xp`, `this.inv`, `this.root`, `this.attributes`, `this.attrLtReadyAt`, `this.buyback`, `this.daily`

### `Ql.applyLevel` — 559166–561085

- Conditions: `Z.on`; `this.gm.speed`; `(s=e.wheel)==null`; `(i=r.bonus)==null`; `h`; `c==="atkPct"`; `c==="hpPct"`; `c==="armor"`; `this.def.id==="ky-mon"`
- Numeric literals: `0`, `25`, `2`, `1`, `100`, `5`, `3`, `0.012`, `1.2`
- State writes: `this.attributes`, `this.ring`, `this.stats`, `this.maxHp`, `this.maxMp`, `this.atkMult`, `this.atk`, `this.armor`, `this.defense`, `this.dmgScale`, `this.crit`, `this.critDmg`, `this.lifesteal`, `this.move`, `this.bonus`, `this.pas`, `this.wheelId`, `s`, `i`, `this.bonus[c]`, `this.guardSwords`, `this.cpEst`, `this.hp`, `this.healK`, `this.mp`, `o`

### `Ql.give` — 561085–561644

- Conditions: `!Number.isSafeInteger(n)||n===0`; `Object.hasOwn(this.donation.bound,t)`; `s`; `n>0&&i&&s&&Z.on`; `n>0&&i&&s`
- Numeric literals: `0`, `36`
- State writes: `this.donation.bound[t]`, `this.dirty`, `t`

### `Ql.count` — 561644–561679

- Numeric literals: `0`

### `Ql.freeCount` — 561679–561864

- Conditions: `Object.hasOwn(this.donation.bound,t)`; `Number.isSafeInteger(n)&&Number.isSafeInteger(e)`
- Numeric literals: `0`

### `Ql.takeFree` — 561864–561990

- Conditions: `!Number.isSafeInteger(n)||n<=0||this.freeCount(t)<n`
- Numeric literals: `0`, `1`
- State writes: `this.dirty`

### `Ql.grantRewardGear` — 561990–562370

- Conditions: `Z.on&&He(this,t)`; `this.gear.some(e=>e.uid===t.uid)||(n=this.disciple)!=null&&n.gear.some(e=>e.uid===t.uid)||this.pendingGear.some(e=>e.uid===t.uid)`; `this.gearFits([t])`
- Numeric literals: `0`, `1`
- State writes: `n`, `this.dirty`

### `Ql.grantAllSkills` — 562419–562877

- Conditions: `(n=this.def.skills.slice(5).find(e=>!this.skillSlots.includes(e.id)))==null`
- Numeric literals: `1`, `5`, `0`
- State writes: `t`, `this.skillSlots`, `this.dirty`, `this.skillSlots[5]`, `n`, `this.extraSkill`

### `Ql.giveGear` — 562940–563159

- Conditions: `Z.on`
- Numeric literals: `0`, `1`, `36`
- State writes: `this.dirty`

### `Ql.savePills` — 563159–563337

- Conditions: `s.length`
- Numeric literals: `0`

### `Ql.profile` — 563337–565980

- Conditions: `(r=this.room)==null`; `t==null`; `xt.length`; `g.save`; `o`; `this.fishStats.n`; `this.fishDaily.day`; `this.disciple`; `Object.keys(this.skillLevels).length`; `(h=this.pending)==null`; `(c=this.room)==null`; `(u=this.pending)==null`; `(m=this.pending)==null`; `this.meditating`; `this.tribRun`; `this.tribRetry>e`; `this.buyback.length`
- Numeric literals: `0`, `1000`, `2`, `60`, `60000`
- State writes: `r`, `h`, `c`, `u`, `m`

### `Ql.statSheet` — 565980–566347

- Numeric literals: `0`

### `Ql.outfitCheck` — 566503–567376

- Conditions: `this.gear.some(e)||this.pendingGear.some(e)`; `s.length`
- Numeric literals: `1`, `0`
- State writes: `this.gear`, `this.pendingGear`, `n`, `this.dirty`

