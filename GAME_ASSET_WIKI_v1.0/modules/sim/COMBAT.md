# COMBAT — source-grounded module

**CONFIRMED**: Combat engine: basic, cast, run dispatch by skill shape, damage and mitigations, status ticks, DoT, heal, PvP and class-specific state. Entry points are j1.basic, j1.cast, j1.damage, j1.tick. Damage uses random critical/variance and delegates monster/player HP changes to world methods. Examine j1.run to distinguish scheduling on contact and later ticks.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (92)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `j1.constructor` | constructor | 83320–83817 | `T`, `j1.heal`, `j1.damage`, `j1.enemies`, `j1.guMark` |
| `j1.t` | getter | 83817–83844 | — |
| `j1.basic` | method | 83844–84769 | `wm`, `Sm`, `j1.speedFactor`, `t.events.push`, `j1.later`, `j1.enemies`, `Math.hypot`, `Math.max`, `j1.radius`, `j1.damage`, `this.w.realms.hitSeals`, `j1.slash` |
| `j1.slash` | method | 84769–85960 | `this.enemies(t,n).filter`, `j1.enemies`, `Math.hypot`, `j1.radius`, `F`, `j1.damage`, `t.events.push`, `r`, `j1.heal`, `j1.dot`, `j1.hardControl` |
| `j1.dodge` | method | 85960–86374 | `F`, `E1`, `this.w.record`, `t.events.push` |
| `j1.cast` | method | 86374–89748 | `n.learnedRealms.includes`, `ee`, `Nu`, `n.def.skills.slice(5).some`, `n.def.skills.slice`, `n.learnedSkills.includes`, `ma`, `n.note`, `h1`, `vu`, `j1.sealed`, `h.effects.find` |
| `j1.releaseGuard` | method | 89748–89947 | — |
| `j1.run` | method | 89947–93143 | `Math.max`, `j1.releaseGuard`, `j1.selfEffects`, `j1.later`, `g`, `d`, `j1.area`, `j1.bonusRaw`, `j1.detonate`, `j1.makhiAfter`, `j1.brew`, `j1.cone` |
| `j1.area` | method | 93143–93816 | `this.enemies(t,n).filter(f=>Math.hypot(f.x-s,f.y-i)-this.radius(f)<o).sort`, `this.enemies(t,n).filter`, `j1.enemies`, `Math.hypot`, `j1.radius`, `h.slice`, `u.forEach`, `j1.damage`, `j1.statuses`, `F`, `Math.min` |
| `j1.cone` | method | 93816–94091 | `Math.cos`, `j1.enemies`, `Math.hypot`, `j1.radius`, `j1.damage`, `j1.statuses` |
| `j1.line` | method | 94091–94317 | `j1.enemies`, `Math.abs`, `j1.radius`, `j1.damage`, `j1.statuses` |
| `j1.nearest` | method | 94317–94492 | `this.enemies(t,n).filter(r=>Math.hypot(r.x-n.x,r.y-n.y)<=i+this.radius(r)).sort((r,h)=>Math.hypot(r.x-e,r.y-s)-Math.hypot(h.x-e,h.y-s)).slice`, `this.enemies(t,n).filter(r=>Math.hypot(r.x-n.x,r.y-n.y)<=i+this.radius(r)).sort`, `this.enemies(t,n).filter`, `j1.enemies`, `Math.hypot`, `j1.radius` |
| `j1.enemies` | method | 94492–94635 | `e.push`, `this.w.pkOk` |
| `j1.radius` | method | 94635–94669 | `X` |
| `j1.damage` | method | 94669–99733 | `this.w.realms.protected`, `X`, `this.w.pkOk`, `Math.min`, `En`, `et`, `Math.random`, `t.events.push`, `this.equipment.multiplier`, `fa`, `Qh`, `nr` |
| `j1.proc` | method | 99733–102214 | `F`, `j1.heal`, `j1.dot`, `e.st.dots.some`, `f.startsWith`, `this.enemies(t,n).filter`, `j1.enemies`, `Math.hypot`, `j1.radius`, `t.events.push`, `j1.damage`, `d` |
| `j1.behind` | method | 102214–102364 | `Math.cos`, `Math.sin`, `Math.hypot` |
| `j1.bonusRaw` | method | 102364–102616 | — |
| `j1.onKill` | method | 102616–102980 | `F`, `j1.heal`, `j1.setSkillCd`, `Math.max`, `Math.min` |
| `j1.statuses` | method | 102980–105460 | `this.w.realms.protected`, `X`, `this.w.pkOk`, `Math.min`, `Or`, `xu`, `ma`, `["stun","knock","root","slow","pull","silence"].includes`, `["stun","knock","root","slow","pull","silence","taunt"].includes`, `["stun","knock","root","slow","silence"].includes`, `j1.dot`, `j1.hardControl` |
| `j1.hitType` | method | 105460–105533 | `Kg` |
| `j1.typeK` | method | 105533–105634 | `X`, `P1`, `Tu` |
| `j1.statusDamage` | method | 105634–106243 | `Ta`, `et`, `X`, `un`, `j1.inZone` |
| `j1.inZone` | method | 106243–106547 | `Math.hypot`, `Math.max` |
| `j1.afterHit` | method | 106547–107275 | `et`, `un`, `j1.heal`, `Math.max`, `j1.dot`, `X`, `En`, `Math.min`, `Math.round`, `t.events.push` |
| `j1.speedFactor` | method | 107275–107428 | `En`, `Math.max`, `Math.min` |
| `j1.wake` | method | 107428–107536 | `X`, `this.hot.get`, `this.hot.set`, `e.set.add` |
| `j1.setSkillCd` | method | 107536–107635 | `t.skillSlots.indexOf`, `String` |
| `j1.shiftKeyCd` | method | 107635–107730 | `Number` |
| `j1.cdrOf` | method | 107730–107772 | `fa`, `r1` |
| `j1.sx` | method | 107772–108248 | `Ig`, `X`, `o.push`, `n.split`, `r.findIndex`, `g.startsWith`, `Math.round`, `r.push`, `Number`, `r[u].split`, `r.sort().join`, `r.sort` |
| `j1.controlDuration` | method | 108248–108383 | `X`, `Math.min`, `Math.max`, `et` |
| `j1.hardControl` | method | 108383–108732 | `ma`, `j1.controlDuration`, `X`, `Fg`, `Math.max` |
| `j1.dot` | method | 108732–109280 | `F`, `t.st.dots.find`, `Math.max`, `Math.min`, `t.st.dots.push`, `j1.wake` |
| `j1.healingMultiplier` | method | 109280–109554 | `fa`, `Bt`, `Math.min`, `Math.max`, `Et`, `En`, `j1.poisonCut` |
| `j1.poisonCut` | method | 109554–109718 | `Math.max`, `et`, `this.w.players.get` |
| `j1.pvpBurst` | method | 109718–109847 | `qg`, `j1.pvpTime`, `this.pvpLog.get`, `this.pvpLog.set`, `Og` |
| `j1.pvpMana` | method | 109847–109889 | `j1.inPvp` |
| `j1.pvpTouch` | method | 109889–109996 | `j1.inPvp`, `this.pvpStart.set`, `this.pvpAt.set` |
| `j1.pvpTime` | method | 109996–110068 | `j1.inPvp`, `this.pvpStart.get` |
| `j1.inPvp` | method | 110068–110120 | `this.pvpAt.get` |
| `j1.heal` | method | 110120–110742 | `j1.inPvp`, `Vr`, `j1.pvpTime`, `Math.round`, `et`, `j1.healingMultiplier`, `Math.min`, `t.events.push`, `F` |
| `j1.selfEffects` | method | 110742–112872 | `j1.friends`, `F`, `[...t.players].filter(l=>l!==n&&!l.dead&&l.party&&l.party===n.party).sort`, `[...t.players].filter`, `Math.hypot`, `i.push`, `e.id.startsWith`, `["heal","hot","buff","guard","shield"].includes`, `j1.heal`, `j1.hpScale`, `et`, `Math.max` |
| `j1.friends` | method | 112872–113012 | `Math.hypot`, `this.w.pkOk`, `s.push` |
| `j1.hpScale` | method | 113012–113098 | `Math.max`, `ir` |
| `j1.beat` | method | 113098–113723 | `Math.round`, `Math.abs`, `F`, `Math.min`, `j1.maxStacks`, `j1.hpScale`, `j1.heal`, `Math.hypot`, `Math.max` |
| `j1.maxStacks` | method | 113723–113801 | `F` |
| `j1.jarMax` | method | 113801–113872 | `F` |
| `j1.soulMax` | method | 113872–113943 | `F` |
| `j1.makhiGain` | method | 113943–114261 | `Math.max`, `Math.min`, `F`, `t.note`, `t.toast` |
| `j1.makhiAfter` | method | 114261–114345 | `j1.makhiGain` |
| `j1.gainSat` | method | 114345–114443 | `Math.min`, `F` |
| `j1.classAfter` | method | 114443–115943 | `j1.makhiAfter`, `j1.jarMax`, `o.jar.push`, `F`, `this.enemies(t,n).filter`, `j1.enemies`, `g.st.dots.some`, `Math.hypot`, `j1.statuses`, `o.nodes.push`, `this.w.newId`, `o.nodes.shift` |
| `j1.sealed` | method | 115943–116043 | `t.monsters.filter`, `Math.hypot` |
| `j1.detonate` | method | 116043–117024 | `F`, `j1.sealed`, `m.st.seals.splice`, `j1.damage`, `Math.min`, `j1.dot`, `Math.max`, `t.monsters.find`, `Math.hypot`, `j1.shiftKeyCd` |
| `j1.brew` | method | 117024–117389 | `o.filter`, `Math.hypot`, `j1.dot`, `Math.max`, `Math.min` |
| `j1.tame` | method | 117389–118225 | `t.monsters.filter(u=>!u.dead&&!u.owner&&u.cls!=="boss"&&(o?u.cls==="gu":!0)&&Math.hypot(u.x-s,u.y-i)-u.radius<e.range+.6).sort`, `t.monsters.filter`, `Math.hypot`, `n.note`, `j1.damage`, `F`, `this.w.dealMonster`, `j1.jarMax`, `n.cls.jar.push`, `Math.floor`, `Math.random`, `n.toast` |
| `j1.tick` | method | 118225–119813 | `this.hot.get`, `this.hot.set`, `Pu`, `h.set.add`, `h.set.delete`, `j1.statusTick`, `this.equipment.tick`, `j1.passiveTick`, `F`, `Math.max`, `j1.array`, `j1.petTick` |
| `j1.passiveTick` | method | 119813–120372 | `un`, `this.cleanseAt.get`, `wa`, `this.cleanseAt.set`, `t.events.push`, `Math.abs`, `Math.hypot`, `this.w.pkOk` |
| `j1.statusTick` | method | 120372–121708 | `s.debuffs.filter`, `X`, `this.w.players.get`, `this.w.pkOk`, `j1.mobDotTick`, `Ru`, `this.castFirst.get`, `Au`, `Math.hypot`, `et`, `j1.typeK`, `$u` |
| `j1.array` | method | 121708–123113 | `s.nodes.filter`, `F`, `s.nodes.map`, `Math.max`, `Math.min`, `Math.hypot`, `c`, `this.w.pkOk`, `j1.damage`, `j1.statuses`, `this.w.dealMonster`, `Math.round` |
| `j1.avatarTick` | method | 123113–123555 | `Nu`, `j1.area`, `t.events.push`, `j1.nearest` |
| `j1.petTick` | method | 123555–125552 | `Sn`, `this.w.spawnPet`, `Math.round`, `t.events.push`, `Math.max`, `this.lastFoe.get`, `Math.hypot`, `m`, `X`, `this.w.pkOk`, `this.enemies(t,n).filter($=>m($,4.5)).sort`, `this.enemies(t,n).filter` |
| `j1.petSkill` | method | 125552–126815 | `Sn`, `this.lastFoe.get`, `X`, `this.w.dealMonster`, `Math.max`, `Math.round`, `j1.typeK`, `j1.damage`, `j1.dot`, `j1.enemies`, `Math.hypot`, `j1.statuses` |
| `j1.quyShell` | method | 126815–127248 | `Sn`, `o.events.push`, `this.w.dropPet`, `t.note` |
| `j1.roarEffects` | method | 127248–127503 | `Sn` |
| `j1.petSwapCombo` | method | 127503–127977 | `Sn`, `Math.max`, `n.note`, `j1.heal`, `t.events.push` |
| `j1.guTop` | method | 127977–128271 | `j1.guStacks`, `this.w.pkOk` |
| `j1.guStacks` | method | 128271–128391 | `t.st.dots.find` |
| `j1.guMark` | method | 128391–128896 | `this.w.realms.protected`, `X`, `this.w.pkOk`, `t.st.dots.find`, `Math.min`, `t.st.dots.push` |
| `j1.blood` | method | 128896–128984 | `Math.min` |
| `j1.bodyCast` | method | 128984–131968 | `vu`, `Yl([...n.worn.values()].map(H=>{var L;return((L=n.gear.find(N=>N.uid===H))==null?void 0:L.id)??""}).filter(H=>{var L;return!(((L=n.stats)==null?void 0:L.ignored.some(N=>N.id===H))??!0)}),n.classId).find`, `Yl`, `[...n.worn.values()].map(H=>{var L;return((L=n.gear.find(N=>N.uid===H))==null?void 0:L.id)??""}).filter`, `[...n.worn.values()].map`, `n.worn.values`, `n.gear.find`, `L.ignored.some`, `Math.max`, `j1.later`, `p`, `L` |
| `j1.cultivationCast` | method | 131968–134652 | `j1.releaseGuard`, `j1.later`, `r`, `m`, `this.enemies(t,n).filter(g=>Math.hypot(g.x-s,g.y-i)-this.radius(g)<=u).sort((g,d)=>Math.hypot(g.x-s,g.y-i)-Math.hypot(d.x-s,d.y-i)).slice`, `this.enemies(t,n).filter(g=>Math.hypot(g.x-s,g.y-i)-this.radius(g)<=u).sort`, `this.enemies(t,n).filter`, `j1.enemies`, `Math.hypot`, `j1.radius`, `["kiem-cuong","giap-co","huyet-giap"].includes`, `j1.selfEffects` |
| `j1.rootHit` | method | 134652–138103 | `Bt`, `u`, `this.rootCasts.get`, `f.has`, `Number`, `e.st.dots.some`, `Ls`, `Math.min`, `j1.heal`, `j1.rootDot`, `j1.rootDebuff`, `j1.rootCleanse` |
| `j1.rootNote` | method | 138103–138186 | `t.events.push` |
| `j1.rootDot` | method | 138186–138512 | `Ls`, `t.st.dots.find`, `Math.max`, `t.st.dots.push` |
| `j1.rootResource` | method | 138512–138739 | `Ls`, `j1.blood`, `Math.min` |
| `j1.rootDebuff` | method | 138739–139025 | `this.w.realms.protected`, `X`, `this.w.pkOk`, `Bt`, `po` |
| `j1.rootCleanse` | method | 139025–139566 | `s.some`, `e.debuffs.find`, `e.debuffs.filter`, `e.dots.find`, `e.dots.filter`, `j1.rootNote` |
| `j1.rootCast` | method | 139566–140276 | `Bt`, `Ls`, `e`, `Number`, `j1.rootResource`, `j1.rootCleanse`, `j1.heal`, `j1.enemies`, `Math.hypot`, `j1.statuses`, `j1.rootNote`, `Math.round` |
| `j1.mobTaken` | method | 140276–140377 | `Ta`, `Et` |
| `j1.mobStatuses` | method | 140377–141679 | `this.w.realms.protected`, `Math.min`, `Or`, `xu`, `ma`, `["stun","knock","root","slow","silence","taunt"].includes`, `j1.mobDot`, `j1.controlDuration`, `Math.max`, `At`, `po` |
| `j1.mobDot` | method | 141679–141984 | `t.st.dots.find`, `Math.max`, `Math.min`, `t.st.dots.push` |
| `j1.mobDotTick` | method | 141984–142468 | `et`, `Math.hypot`, `Math.max`, `Math.round`, `j1.absorb`, `t.events.push`, `this.w.die` |
| `j1.mobProc` | method | 142468–142839 | `R1`, `this.mobCd.get`, `Math.random`, `this.mobCd.set`, `j1.mobStatuses`, `i.effects.map`, `Math.max` |
| `j1.incomingScale` | method | 142839–143853 | `Bt`, `Math.hypot`, `F`, `Tu`, `Cm`, `j1.mobTaken`, `et` |
| `j1.onHurt` | method | 143853–144841 | `Math.min`, `En`, `et`, `Math.random`, `t.events.push`, `this.w.dealMonster`, `Math.max`, `Math.round`, `F` |
| `j1.absorb` | method | 144841–146159 | `j1.quyShell`, `j1.blood`, `this.equipment.absorb`, `X`, `Math.min`, `j1.damage`, `j1.guMark`, `this.enemies(i,t).filter`, `j1.enemies`, `Math.hypot`, `i.events.push`, `Bt` |
| `j1.flags` | method | 146159–146776 | `e.dots.some`, `Et`, `ma` |
| `j1.gauge` | method | 146776–147673 | `j1.maxStacks`, `Math.round`, `F`, `j1.guTop`, `Math.max`, `Sn`, `Math.ceil`, `this.sealed(t.room,t).reduce`, `j1.sealed` |
| `j1.fieldPulse` | method | 147673–148184 | `j1.area`, `j1.enemies`, `Math.hypot`, `j1.radius`, `j1.statuses`, `j1.heal`, `j1.hpScale`, `Math.max`, `j1.controlDuration` |
| `j1.later` | method | 148184–148241 | `e`, `t.pending.push` |

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

### `j1.constructor` — 83320–83817

- Numeric literals: `1`, `0`
- State writes: `this.w`

### `j1.basic` — 83844–84769

- Conditions: `(n.cd.Space??0)>e+1e-6||n.st.stunUntil>e||n.classId==="the-tu"&&s.castLockUntil>e`; `n.classId==="the-tu"`; `!(n.dead||n.room!==t||c&&(n.cls.body!==c||n.st.stunUntil>this.t))`
- Numeric literals: `0`, `0.000001`, `1`, `0.3`, `0.65`, `0.25`
- State writes: `n.cd.Space`, `n.anim`, `n.lockUntil`, `n.combatUntil`, `s.castLockUntil`, `n.st.stealthUntil`
- Event types: `cast`

### `j1.slash` — 84769–85960

- Conditions: `h&&i===2`; `n.slashes%3===0`
- Numeric literals: `0.4`, `0.2`, `2`, `1.6`, `1.2`, `0`, `3`, `4`, `60`, `0.03`, `1`, `50`, `5`, `2.6`, `25`, `8`, `1.7`, `20`, `6`
- State writes: `c.st.glyphBy`, `c.st.glyphUntil`
- Event types: `fx`

### `j1.dodge` — 85960–86374

- Conditions: `(n.cd.Q??0)>e+.08||n.st.stunUntil>e||n.st.rootUntil>e`; `s==null`
- Numeric literals: `0`, `0.08`, `2`, `0.4`, `0.1`
- State writes: `n.dashBuffUntil`, `n.cd.Q`, `n.invulnUntil`, `n.anim`, `n.lockUntil`
- Event types: `cast`

### `j1.cast` — 86374–89748

- Conditions: `e==="H"&&n.learnedRealms.includes(n.realmSkill)`; `e==="H"`; `(o==null?void 0:o.cls)===n.classId`; `o==null`; `!h||e!=="H"&&!h.free&&n.def.skills.slice(5).some(H=>H.id===h.id)&&!n.learnedSkills.includes(h.id)`; `ma(n.st,"silence",r)`; `(n.cd['skill:${h.id}']??0)>r+.08`; `n.level<h.unlock&&!n.isGm`; `(n.cd[e]??0)>r+.08||r<c.castLockUntil-.08||n.st.stunUntil>r||r<c.overloadUntil`; `(h.shape==="dash"||h.shape==="blink")&&n.st.rootUntil>r`; `u>n.mp+.5`; `n.classId==="the-tu"&&c.body.blood<m`; `h.id==="doat-menh"&&c.sat<1`; `h.id==="luyen-co"&&!c.jar.length`; `h.id==="kich-phu"&&!this.sealed(t,n).length`; `(h.id==="thu-vuong"||h.id==="hoan-thu")&&n.level<5`; `(P=h.effects.find(H=>H.t==="resource"&&(H.v??0)<0))==null`; `n.def.id==="ma-tong"&&(["huyet-giap","doat-hon","huyet-nguyet"].includes(h.id)||no.has(h.id))&&c.makhi<-g`; `h.id==="van-co"&&!this.enemies(t,n).some(H=>Math.hypot(H.x-n.x,H.y-n.y)<=10&&this.guStacks(H,n)>=1)`; `!Number.isFinite(l)||l<.05`; `h.shape==="blink"&&!this.nearest(t,n,k,y,h.range,1).length`; `n.mp-=u,n.cd[e]=r+Wf(h.cd,gi(n.skillLevels,h.id),this.cdrOf(n)+(n.def.skills.slice(0,4).some(H=>H.id===h.id)?n.bonus.basicCdr??0:0),this.speedFactor(n)),c.castLockUntil=r+(n.classI …`; `n.def.skills.slice(0,4).some(H=>H.id===h.id)`; `n.classId==="the-tu"||Fr.has(h.id)`; `v`; `h.id==="kn-hung-ho"&&(S.effects=this.roarEffects(n)),this.rootCast(t,n),no.has(h.id)`
- Numeric literals: `0`, `5`, `1.5`, `0.08`, `1`, `0.5`, `10`, `0.05`, `0.6`, `4`, `1.2`, `2`, `0.2`, `0.4`
- State writes: `n.cd.silenceNote`, `P`, `d`, `f`, `l`, `n.faceX`, `n.faceY`, `n.cd.noTargetNote`, `n.mp`, `n.cd[e]`, `c.castLockUntil`, `c.moveLockUntil`, `n.cd[`skill:${h.id}`]`, `n.dirty`, `n.anim`, `n.lockUntil`, `n.combatUntil`, `n.speedUntil`, `S.effects`, `n.cls.body.blood`
- Event types: `cast`

### `j1.releaseGuard` — 89748–89947

- Conditions: `r||n.dead||n.room!==t||n.st!==e||n.cls!==s`; `!o`; `(e.interrupts??0)!==i`
- Numeric literals: `0`, `1`
- State writes: `r`, `o`

### `j1.run` — 89947–93143

- Conditions: `!g()`; `e.shape==="cone"`; `e.shape==="line"`; `e.id==="thuan-thu"||e.id==="thuan-co"`; `e.id==="dai-tran"&&h.nodes.length>=3`; `u>1`; `e.id==="lien-hoan"||e.id==="han-quang"`; `!f.length`; `e.id==="anh-bo"`; `l.dead`
- Numeric literals: `1`, `0.25`, `0`, `2.5`, `10`, `1.8`, `3`, `8`, `0.8`, `0.5`, `0.3`, `1.55`, `0.6`, `1.4`, `2`, `4`, `1.2`, `5`, `2.8`, `12.5`, `0.9`, `0.4`
- State writes: `h.avatarUntil`, `h.avatarNext`, `l`, `h.boostUntil`, `l.until`, `n.invulnUntil`, `n.x`, `n.y`, `n.budget`, `n.faceX`, `n.faceY`, `l.st.flankUntil`, `n.st.flankUntil`

### `j1.area` — 93143–93816

- Conditions: `l===0`; `m&&u.length`
- Numeric literals: `1`, `0`, `2`, `0.3`, `3`, `30`, `0.25`
- State writes: `n.refundCast`, `n.mp`

### `j1.cone` — 93816–94091

- Conditions: `p-this.radius(d)>h||p>.45&&(f*o+l*r)/p<g`
- Numeric literals: `151`, `2`, `180`, `0.45`, `0`

### `j1.line` — 94091–94317

- Conditions: `f<-.3||f>h||l-this.radius(m)>c/2`
- Numeric literals: `0.3`, `2`, `0`

### `j1.nearest` — 94317–94492

- Numeric literals: `0`

### `j1.radius` — 94635–94669

- Conditions: `X(t)`
- Numeric literals: `0.3`

### `j1.damage` — 94669–99733

- Conditions: `e.dead||n.dead||n.room!==t||this.w.realms.protected(n)||!X(e)&&(!this.w.pkOk(t,n,e)||this.t<e.invulnUntil)`; `!X(e)&&!i.proc`; `U>0&&Math.random()<U`; `i.basic||i.proc`; `!i.basic&&!i.proc&&(u*=1+fa(n,"skillDmgPct")+Qh(n.attributes)),r&&!i.basic&&!i.proc&&(u*=nr(gi(n.skillLevels,r.id))),n.st.powerUntil>o&&(u*=1+n.st.power),n.pillBuff.atkUntil>o&&(u* …`; `r==null`; `!B||B.serial!==U`; `g==null`; `(I=F(n,"huyetSatCap"))==null`; `(b=F(n,"maPower"))==null`; `l&&p&&(p.stacks??1)>=(l.threshold??3)&&(u*=1+(l.bonus??.12)),n.wheelId==="u-minh-fan"&&p&&(u*=1.12),e.st.glyphBy===n.id&&(e.st.glyphUntil??0)>o&&(u*=1.15),n.wheelId==="van-hon-phie …`; `(M=F(n,"dashEmpower"))==null`; `(C=(w=n.stats)==null?void 0:w.magic)==null`; `(w=n.stats)==null`; `(x=n.root)==null`; `(A=n.stats)==null`; `(R=F(n,"backstabCrit"))==null`; `r&&r.slot===5&&((_=n.def.skills[4])==null?void 0:_.id)===r.id`; `(_=n.def.skills[4])==null`; `g&&m>d`; `!y&&P>0&&Math.random()<P&&(y=!0,u*=n.critDmg),(r==null?void 0:r.id)==="ex-am-nang"||(r==null?void 0:r.id)==="ex-co-de"||(r==null?void 0:r.id)==="tt-co-than-diet-gioi"`; `r.id==="tt-co-than-diet-gioi"`; `r.id==="ex-co-de"`; `X(e)?this.w.dealMonster(t,n,e,H,y,i.knock??(r?.2:.25),!!r):this.w.hurtByPlayer(t,e,n,H,y),H=Math.max(0,L-Math.max(0,e.hp)),this.lastDt="p",H>0&&(n.classId==="the-tu"&&i.basic&&!i.p …`; `X(e)`; `r`; `U`; `F(n,"lowHpLifesteal")&&n.hp<n.maxHp*(F(n,"lowHpLifesteal").below??.4)`; `F(n,"fedLifesteal")&&c.satiety>=(F(n,"fedLifesteal").fedAt??60)`
- Numeric literals: `1`, `0.75`, `0`, `1.9`, `1.15`, `1.05`, `0.7`, `1.12`, `0.2`, `0.03`, `0.01`, `0.007`, `0.04`, `0.1`, `3`, `0.12`, `0.02`, `0.4`, `0.07`, `2.1`, `2`, `1.6`, `5`, `4`, `7.6`, `0.3`, `0.8`, `0.08`, `0.14`, `0.25`, `0.95`, `8`, `60`, `0.5`, `100`
- State writes: `I`, `b`, `M`, `n.dashBuffUntil`, `e.st.marks`, `C`, `w`, `x`, `K`, `A`, `y`, `R`, `_`, `this.lastDt`, `e.st.dots`, `H`, `c.body.basic`, `n.dirty`, `c.satiety`
- Event types: `dmg`, `fx`

### `j1.proc` — 99733–102214

- Conditions: `r==null`; `u&&(r==null?void 0:r.id)==="am-sat"&&this.dot(e,n,s*(u.power??.3)/(u.time??3)/(bt*n.atkMult),u.time??3,u.stacks??3),n.wheelId==="tb-ky-mon"&&e.st.dots.some(l=>l.src===n.id)&&o>=n.h …`; `n.wheelId==="tb-thieu-lam"||n.wheelId==="tb-tran-phap-su"`; `n.wheelId==="tb-ky-mon"||n.wheelId==="tb-anh-sat"`; `n.procHits%m`; `X(e)&&e.cls==="monster"`; `e.hp/Math.max(1,e.maxHp??e.maxHp)<.3`; `l===0`; `l===1`
- Numeric literals: `0`, `1`, `4`, `0.01`, `0.3`, `3`, `0.015`, `0.2`, `5`, `40`, `1.8`, `50`, `0.6`, `45`, `2`, `0.7`, `55`, `1.5`, `10`, `0.5`, `60`, `8`, `0.4`, `0.8`
- State writes: `n.meleeHeal`, `n.healProcAt`, `f`, `n.procAt`, `e.st.slowUntil`, `e.st.slowF`, `p.st.slowUntil`, `p.st.slowF`
- Event types: `fx`

### `j1.behind` — 102214–102364

- Numeric literals: `4`, `1`, `100`, `180`

### `j1.bonusRaw` — 102364–102616

- Conditions: `n.id==="tuyet-am"`; `n.id==="ma-diem"||n.id==="thien-ma"`; `n.id==="van-co"&&e.satiety>=50`
- Numeric literals: `16.6`, `0`, `50`, `2`
- State writes: `e.stacks`, `e.satiety`

### `j1.onKill` — 102616–102980

- Conditions: `o==null`
- Numeric literals: `0.04`, `0`, `1`, `3`, `10`, `100`, `12`
- State writes: `i.sat`, `n.cd.Q`, `n.souls`, `n.soulsAt`, `i.satiety`

### `j1.statuses` — 102980–105460

- Conditions: `this.w.realms.protected(n)||!X(e)&&(!this.w.pkOk(t,n,e)||this.t<e.invulnUntil)`; `X(e)`; `X(e)&&e.cls==="boss"&&["stun","knock","root","slow","pull","silence"].includes(f.t)||u&&["stun","knock","root","slow","pull","silence","taunt"].includes(f.t)`; `["stun","knock","root","slow","silence"].includes(f.t)`; `l.t==="burn"`; `(g=F(n,"ccExtend"))==null`; `e.st.slowUntil>r`; `e.st.markUntil>r`; `X(e)&&e.cls!=="boss"`; `p<=0`; `m`; `p.length`
- Numeric literals: `1`, `0.4`, `0.6`, `4`, `3`, `0.5`, `0`, `1.2`, `2`, `6`, `0.3`, `2.5`, `0.25`, `0.1`
- State writes: `g`, `e.st.slowF`, `e.st.slowUntil`, `((d=e.st).by??(d.by={})).slow`, `d`, `d.by`, `e.st.marks`, `e.st.markUntil`, `[e.x,e.y]`, `e.st.interrupts`, `e.windupAt`, `e.target`, `e.st.stealthUntil`
- Event types: `fx`

### `j1.hitType` — 105460–105533

- Conditions: `e.basic||e.proc||n==null`
- Numeric literals: `0`

### `j1.typeK` — 105533–105634

- Conditions: `X(n)`; `n.owner`; `t==null`
- Numeric literals: `1`, `0`

### `j1.statusDamage` — 105634–106243

- Conditions: `i`; `h&&h.src!==e.id&&(o*=1-h.v),!((u=n.def.passives)!=null&&u.length)`
- Numeric literals: `1`, `0`, `0.4`
- State writes: `u`

### `j1.inZone` — 106243–106547

- Conditions: `h.owner===n&&Math.hypot(e.x-h.x,e.y-h.y)<h.r`; `s.length<2`
- Numeric literals: `0`, `2`, `1`, `0.6`
- State writes: `r`

### `j1.afterHit` — 106547–107275

- Conditions: `(c=n.def.passives)!=null&&c.length`; `m&&n.hp<n.maxHp*(m.below??.4)`; `X(e)||i.proc||e.dead`; `e.st.shield>0&&e.st.shieldUntil>r||e.st.guardUntil>r||e.rootState.shield>0&&e.rootState.shieldUntil>r`; `h>0&&!n.dead`
- Numeric literals: `0.4`, `0`, `1`, `0.5`, `4`, `3`, `0.6`, `1.9`
- State writes: `c`, `n.hp`, `n.combatUntil`, `n.dirty`
- Event types: `dmg`

### `j1.speedFactor` — 107275–107428

- Conditions: `!e&&!s`
- Numeric literals: `1`

### `j1.wake` — 107428–107536

- Conditions: `!t||!X(n)`
- Numeric literals: `0`
- State writes: `e`

### `j1.setSkillCd` — 107536–107635

- Numeric literals: `0`, `1`
- State writes: `t.cd[`skill:${n}`]`, `t.cd[String(s+1)]`

### `j1.shiftKeyCd` — 107635–107730

- Numeric literals: `1`
- State writes: `t.cd[`skill:${s}`]`

### `j1.sx` — 107772–108248

- Conditions: `X(t)`; `i.until>e&&(i.hp>0||i.blocks>0)&&o.push(["sh",i.until]),s.guardUntil>e&&o.push(["gd",s.guardUntil]),s.powerUntil>e&&o.push(["pw",s.powerUntil]),!o.length`; `n`; `u<0`
- Numeric literals: `0`, `10`, `1`
- State writes: `r[u]`

### `j1.controlDuration` — 108248–108383

- Conditions: `X(t)`; `t.cls==="boss"`
- Numeric literals: `0`, `1`, `0.5`

### `j1.hardControl` — 108383–108732

- Conditions: `ma(t.st,"ccimmune",this.t)`; `n==="stunUntil"`; `X(t)`
- Numeric literals: `0`, `1`
- State writes: `i`, `t.st[n]`, `((o=t.st).by??(o.by={}))[n==="stunUntil"?"stun":"root"]`, `o`, `o.by`, `t.st.interrupts`, `t.windupAt`

### `j1.dot` — 108732–109280

- Conditions: `n.def.id==="ky-mon"`; `o==="poison"`; `(g=F(n,"poisonDeep"))==null`; `m`; `u>1`; `o==="bleed"`
- Numeric literals: `0`, `1.2`, `1`
- State writes: `g`, `m.dps`, `m.until`, `m.stacks`

### `j1.healingMultiplier` — 109280–109554

- Conditions: `((e=t.root)==null?void 0:e.active)==="moc"&&Bt(t.root,"mach")`; `(e=t.root)==null`; `n`; `t.tribRun`
- Numeric literals: `1`, `0`, `0.08`, `0.8`
- State writes: `e`

### `j1.poisonCut` — 109554–109718

- Numeric literals: `0`
- State writes: `n`

### `j1.pvpBurst` — 109718–109847

- State writes: `e`

### `j1.pvpMana` — 109847–109889

- Conditions: `this.inPvp(t)`
- Numeric literals: `0`

### `j1.pvpTime` — 109996–110068

- Conditions: `this.inPvp(t)`
- Numeric literals: `0`

### `j1.inPvp` — 110068–110120

- Numeric literals: `1000000000`

### `j1.heal` — 110120–110742

- Conditions: `n.dead||e<=0`; `s`; `o<1`; `h&&s&&o>r`; `n.st.shieldUntil>u`
- Numeric literals: `0`, `1`, `1.9`, `0.15`, `5`, `0.5`, `0.04`
- State writes: `n.hp`, `n.st.shield`, `n.st.shieldUntil`, `i.manaRefundAt`, `i.mp`
- Event types: `dmg`

### `j1.selfEffects` — 110742–112872

- Conditions: `e.shape==="ally"`; `o==null`; `o&&e.shape!=="ally"`; `h&&f.r`; `["heal","hot","buff","guard","shield"].includes(f.t)`; `l.st.powerUntil>s`; `e.id==="hoan-thu"&&n.cls.form!==1`; `l.st.guardUntil>s`; `f.x&&l.hp<l.maxHp*f.x`; `l===n`; `(d=F(n,"stealthLong"))==null`
- Numeric literals: `4`, `1`, `0`, `8`, `0.25`, `0.45`, `6`, `0.1`, `2`, `0.2`, `3`, `5`, `0.5`
- State writes: `l.st.hot`, `l.st.hotUntil`, `l.st.hotNext`, `((c=l.st).by??(c.by={})).hot`, `c`, `c.by`, `l.st.power`, `l.st.powerUntil`, `((u=l.st).by??(u.by={})).power`, `u`, `u.by`, `l.st.guard`, `l.st.guardUntil`, `((m=l.st).by??(m.by={})).guard`, `m`, `m.by`, `l.st.shield`, `l.st.shieldUntil`, `((g=l.st).by??(g.by={})).shield`, `g`, `g.by`, `l.speedUntil`, `n.st.stealthUntil`, `d`, `n.stealthWas`, `p.target`, `p.windupAt`, `n.st.life`, `n.st.lifeUntil`, `n.hp`
- Event types: `fx`

### `j1.hpScale` — 113012–113098

- Numeric literals: `1`

### `j1.beat` — 113098–113723

- Conditions: `t.def.id!=="am-tong"`; `n.lastCast>0&&s<=4`; `r>=1&&r<=4&&Math.abs(o-r)*.8<=.15*(1+(((i=F(t,"beatWindow"))==null?void 0:i.widen)??0))`; `(i=F(t,"beatWindow"))==null`; `c&&(this.heal(c,t,u,!0),m)`
- Numeric literals: `0`, `4`, `0.8`, `1`, `0.15`, `2`, `3`
- State writes: `i`, `n.stacks`, `t.mp`, `n.lastCast`

### `j1.maxStacks` — 113723–113801

- Conditions: `(n=F(t,"resonanceMax"))==null`
- Numeric literals: `5`, `0`
- State writes: `n`

### `j1.jarMax` — 113801–113872

- Conditions: `(n=F(t,"guJarMax"))==null`
- Numeric literals: `3`, `0`
- State writes: `n`

### `j1.soulMax` — 113872–113943

- Conditions: `(n=F(t,"soulMax"))==null`
- Numeric literals: `3`, `0`
- State writes: `n`

### `j1.makhiGain` — 113943–114261

- Conditions: `e.makhi=Math.max(0,Math.min(100,e.makhi+n)),e.makhiAt=this.t,e.makhi>=100`; `s==null`
- Numeric literals: `0`, `100`, `30`, `3`, `1`, `0.15`
- State writes: `e.makhi`, `e.makhiAt`, `e.overloadUntil`, `t.st.stunUntil`, `t.hp`

### `j1.makhiAfter` — 114261–114345

- Numeric literals: `0`

### `j1.gainSat` — 114345–114443

- Conditions: `(e=F(t,"satYMax"))==null`
- Numeric literals: `5`, `0`
- State writes: `t.cls.sat`, `e`

### `j1.classAfter` — 114443–115943

- Conditions: `e.id==="doc-co"`; `e.id==="huyet-co"`; `e.id==="kim-tam"`; `c&&o.jar.length<this.jarMax(n)&&o.jar.push(c),e.id==="luyen-co"&&(o.jar=[]),F(n,"slowHunger")&&e.id==="doc-co"&&o.satiety>=60`; `(r=F(n,"nodeLife"))==null`; `e.id==="hoa-phu"||e.id==="loi-phu"||e.id==="bang-phu"`; `e.id==="hoa-phu"`; `e.id==="loi-phu"`; `!u.dead&&Math.hypot(u.x-s,u.y-i)-u.radius<e.range`; `m&&O1[c]===m.k`; `(h=F(n,"sealChainPlus"))==null`; `e.id==="hoan-thu"`
- Numeric literals: `60`, `2.5`, `0`, `12`, `1`, `4`, `6`, `5`, `3`, `0.3`, `10`
- State writes: `o.jar`, `o.sat`, `r`, `h`, `o.form`, `o.petHp`, `o.pet`, `o.petAt`, `o.petBoostUntil`, `o.souls`

### `j1.sealed` — 115943–116043

- Numeric literals: `14`

### `j1.detonate` — 116043–117024

- Conditions: `h==null`; `d>=2&&(s=!0),this.damage(t,n,m,15.9*Math.min(2.5,1+u*d),{}),m.dead`; `g.k==="H"&&this.dot(m,n,6.4*(1+((i==null?void 0:i.power)??0)),3+((i==null?void 0:i.time)??0),1,"burn"),g.k==="L"&&d>=1`; `i==null`; `o==null`; `m.st.stunUntil=Math.max(m.st.stunUntil,this.t+f),m.windupAt=0,o!=null&&o.jump`; `r`; `s`; `c==null`
- Numeric literals: `1`, `0.35`, `0`, `2`, `15.9`, `2.5`, `6.4`, `3`, `0.5`, `10`
- State writes: `s`, `m.st.stunUntil`, `m.windupAt`, `l.st.stunUntil`, `l.windupAt`, `m.st.slowUntil`, `m.st.slowF`, `n.mp`

### `j1.brew` — 117024–117389

- Conditions: `r===3&&h===1`; `r===3&&h===3`
- Numeric literals: `3`, `1`, `3.6`, `1.15`, `5`, `1.2`, `0.5`, `0`
- State writes: `g.st.stunUntil`, `g.windupAt`

### `j1.tame` — 117389–118225

- Conditions: `o`; `!r`; `(c=F(n,"easyTame"))==null`; `!r.dead&&r.hp/r.maxHp<=h`
- Numeric literals: `0`, `0.6`, `0.35`, `0.5`, `1`, `3`, `60`, `100`
- State writes: `c`, `n.cls.souls`, `n.cls.soulsUntil`

### `j1.tick` — 118225–119813

- Conditions: `h||this.hot.set(t,h={set:new Set,sweep:0}),e>=h.sweep`; `c.dead||!c.st.dots.length&&!c.st.seals.length&&!((i=c.st.debuffs)!=null&&i.length)&&!Pu(c.st.rootMarks)`; `this.equipment.tick(t,h,e),h.dead`; `u==null`; `(r=F(h,"slowHunger"))==null`; `g&&h.guardSwords<(g.count??3)&&e>=h.guardAt&&(h.guardSwords++,h.guardAt=e+(g.regen??8)),h.souls&&e-h.soulsAt>20&&(h.souls=0),h.stealthWas&&h.st.stealthUntil<=e`
- Numeric literals: `0`, `1`, `4`, `3`, `6`, `0.8`, `0.35`, `30`, `0.03`, `8`, `20`
- State writes: `h`, `h.sweep`, `s`, `i`, `o`, `c.stacks`, `c.makhi`, `c.satiety`, `r`, `h.lowRegenAt`, `h.st.hot`, `h.st.hotUntil`, `h.st.hotNext`, `h.guardAt`, `h.souls`, `h.stealthWas`, `h.speedUntil`, `c.souls`

### `j1.passiveTick` — 119813–120372

- Conditions: `i`
- Numeric literals: `0`, `1`, `8`, `4`
- State writes: `n.dirty`, `o.st.stealthUntil`
- Event types: `fx`

### `j1.statusTick` — 120372–121708

- Conditions: `h.until<=e`; `X(n)`; `s.dots.length`; `h.next+=1,h.mob!==void 0`; `(c==null?void 0:c.classId)==="co-su"&&!h.scaled`; `c==null`; `c&&((o=this.castFirst.get(c))==null?void 0:o.u)!==n`; `(o=this.castFirst.get(c))==null`; `((r=n.root)==null?void 0:r.active)==="kim"&&Bt(n.root,"chan")&&n.rootState.shield>0&&n.rootState.shieldUntil>e`; `(r=n.root)==null`
- Numeric literals: `1`, `0`, `0.000001`, `0.85`
- State writes: `i`, `s.debuffs`, `o`, `h.mx`, `h.my`, `this.lastDt`, `r`, `s.dots`, `s.seals`

### `j1.array` — 121708–123113

- Conditions: `o<2`; `o===2`; `o===3`; `s.boostUntil>i`; `(m=F(n,"arrayDps"))==null`; `o>=3&&c(n.x,n.y)`; `n.st.guardUntil>i`; `u==null`; `o>=3&&u`; `d.st.guardUntil>i`; `s.healBank+=e,!(s.healBank<1)`; `(g=F(n,"arrayTrap"))==null`
- Numeric literals: `2`, `8.8`, `3`, `11`, `15`, `1`, `0`, `0.6`, `0.25`, `0.3`, `0.02`, `0.15`, `0.5`, `1.2`
- State writes: `s.nodes`, `m`, `k`, `l`, `n.st.guard`, `n.st.guardUntil`, `n.mp`, `d.st.guard`, `d.st.guardUntil`, `s.healBank`, `d.st.slowUntil`, `d.st.slowF`, `g`

### `j1.avatarTick` — 123113–123555

- Conditions: `!i`; `s>=e.avatarUntil`; `s<e.avatarNext`
- Numeric literals: `0`, `1.8`, `7.5`, `1`, `1.2`, `91`
- State writes: `e.avatarUntil`, `e.avatarNext`
- Event types: `fx`

### `j1.petTick` — 123555–125552

- Conditions: `n.level<5||i<s.petAt`; `s.petBoostUntil>i`; `h>1`; `s.petMode==="theo"`; `u&&m(u,6)&&(X(u)||this.w.pkOk(t,n,u))`; `g`; `e>0`; `l>p||v`; `v`; `i>=(s.petSkillAt??0)&&(g||r.id!=="loi-bao")&&this.petSkill(t,n,g),g&&l<=p+.2&&i>=c.attackCd`; `s.petBite=1,X(g)?this.w.dealMonster(t,n,g,Math.max(1,Math.round($*bt*n.atkMult*this.typeK(n,g,"phys"))),!1,.1,!0):this.damage(t,n,g,$*bt,{proc:!0}),t.events.push({e:"fx",kind:'pet: …`; `X(g)`; `r.id==="loi-bao"`
- Numeric literals: `5`, `2.2`, `1`, `0`, `2`, `1.6`, `6`, `4.5`, `1.2`, `9`, `0.8`, `0.2`, `0.001`, `0.18`, `14`, `1.1`, `4`, `0.0001`, `0.3`, `0.25`, `0.15`, `0.1`, `3`
- State writes: `s.pet`, `s.petHpMax`, `s.petHp`, `s.petSkillAt`, `c.height`, `c.hp`, `c.maxHp`, `c.x`, `c.y`, `s.petOwnerSpd`, `s.petOx`, `s.petOy`, `s.petOwnerAt`, `[c.x,c.y]`, `c.anim`, `c.dir`, `c.attackCd`, `c.windupAt`, `s.petBite`
- Event types: `fx`

### `j1.petSkill` — 125552–126815

- Conditions: `!r||i<(s.petSkillAt??0)`; `e??(e=this.lastFoe.get(n)),e!=null&&e.dead&&(e=void 0),s.petSkillAt=i+o.skill.every,o.id==="loi-bao"`; `!e`; `X(e)`; `o.id==="huyen-quy"`; `n.st.shieldUntil>i`; `o.id==="bach-loc"`; `m.st.hotUntil>i`; `i>=(s.petCleanseAt??0)`
- Numeric literals: `0`, `1`, `0.5`, `0.2`, `3`, `4`, `6`, `0.3`
- State writes: `e`, `s.petSkillAt`, `r.x`, `r.y`, `n.st.shield`, `n.st.shieldUntil`, `((c=n.st).by??(c.by={})).shield`, `c`, `c.by`, `m.st.hot`, `m.st.hotUntil`, `m.st.hotNext`, `((u=m.st).by??(u.by={})).hot`, `u`, `u.by`, `m`, `s.petCleanseAt`, `n.dirty`
- Event types: `fx`

### `j1.quyShell` — 126815–127248

- Conditions: `s.id!=="huyen-quy"||!e.pet||e.pet.dead||!((e.petHp??0)>0)||this.t<e.petAt`; `e.petHp=(e.petHp??0)-i*(1-s.armor),e.petHp<=0`
- Numeric literals: `0`, `1`
- State writes: `e.petHp`, `e.pet`, `e.petAt`
- Event types: `fx`

### `j1.roarEffects` — 127248–127503

- Conditions: `t.cls.pet`; `n==="bach-loc"`; `n==="loi-bao"`
- Numeric literals: `5`, `4`, `3`, `0.1`, `1`

### `j1.petSwapCombo` — 127503–127977

- Conditions: `n.st.shieldUntil>r`
- Numeric literals: `0`, `5`, `1`
- State writes: `n.st.shield`, `n.st.shieldUntil`, `n.cls.petBite`
- Event types: `fx`

### `j1.guTop` — 127977–128271

- Conditions: `!s.dead&&!s.owner&&s.st.dots.length`; `i<=e||(e=i!==i?NaN:i),e!==e`; `i!==i`; `s.st.dots.length&&this.w.pkOk(t,n,s)`
- Numeric literals: `0`
- State writes: `e`

### `j1.guStacks` — 128271–128391

- Conditions: `e==null`
- Numeric literals: `0`

### `j1.guMark` — 128391–128896

- Conditions: `t.dead||n.dead||n.room!==(t.room??n.room)||this.w.realms.protected(n)||!X(t)&&(!n.room||!this.w.pkOk(n.room,n,t)||t.invulnUntil>this.t)`; `s`; `s.until>this.t`
- Numeric literals: `1`, `5`, `0`, `5.5`, `6`
- State writes: `s.stacks`, `s.until`, `s.dps`

### `j1.blood` — 128896–128984

- Numeric literals: `100`, `1`, `0`
- State writes: `t.cls.body.blood`

### `j1.bodyCast` — 128984–131968

- Conditions: `c.powerUntil>u`; `e.dmg>0&&c.echoUntil>u&&c.echo>0`; `(P=Yl([...n.worn.values()].map(H=>{var L;return((L=n.gear.find(N=>N.uid===H))==null?void 0:L.id)??""}).filter(H=>{var L;return!(((L=n.stats)==null?void 0:L.ignored.some(N=>N.id===H …`; `(L=n.gear.find(N=>N.uid===H))==null`; `(L=n.stats)==null`; `n.st.shieldUntil>u`; `h==="ba-quyen"`; `L===2`; `h==="hanh-tu-bi"`; `h==="thanh-the"`; `n.st.shieldUntil>this.t`; `h==="bao-son-an"`; `h==="luc-dao"`; `H`; `L===5`; `h==="dau-tu-bi"`; `h==="giai-tu-bi"`; `h==="gia-tu-bi"`; `h==="thanh-lien"`; `h==="thien-de-quyen"`
- Numeric literals: `0`, `1.6`, `1`, `0.45`, `5`, `60`, `180`, `1400`, `4`, `8`, `0.04`, `0.4`, `0.65`, `2`, `1.5`, `0.12`, `0.38`, `0.94`, `160`, `90`, `0.75`, `0.5`, `9`, `0.05`, `3`, `14`, `400`, `6`, `0.25`, `0.8`, `80`, `4.3`, `40`
- State writes: `c.blood`, `P`, `L`, `n.st.shield`, `n.st.shieldUntil`, `c.setAt`, `b.st.bodyBrokenUntil`, `n.x`, `n.y`, `c.guardUntil`, `c.echo`, `c.echoUntil`, `c.powerUntil`, `c.lotusX`, `c.lotusY`, `c.lotusUntil`

### `j1.cultivationCast` — 131968–134652

- Conditions: `["kiem-cuong","giap-co","huyet-giap"].includes(o)`; `o==="giap-co"`; `o==="huyet-giap"`; `o==="kiem-cuong"`; `o==="van-kiem"`; `n.classId==="co-su"`; `o==="ky-sinh"`; `o==="thuc-cot"`; `o==="dan-co"`; `o==="bao-co"`; `o==="co-vuong"`; `g`; `o==="phe-huyet"`; `o==="to-doc"`; `o==="on-dich"`; `o==="van-co"`; `o==="u-minh"||o==="doat-hon"||o==="huyet-nguyet"`; `this.selfEffects(t,n,e),this.makhiAfter(n,e),o==="u-minh"&&h(e.contact,()=>{for(const u of c(e.range,3))this.damage(t,n,u,e.dmg,{def:e}),this.statuses(t,n,u,[{t:"pull",v:2.5},{t:"r …`; `u.hp/u.maxHp<.35`
- Numeric literals: `1`, `0`, `0.3`, `0.38`, `3`, `4`, `6`, `1.52`, `0.2`, `3.2`, `95`, `5`, `0.15`, `0.45`, `0.5`, `0.25`, `2`, `2.4`, `0.18`, `0.1`, `30`, `2.5`, `0.35`, `20`, `8`, `0.65`, `0.6`, `6.35`, `60`
- State writes: `n.ward`, `g.st.dots`

### `j1.rootHit` — 134652–138103

- Conditions: `!r||i`; `!s&&o===c.burst&&(r.active==="kim"||r.active==="hoa")`; `u("thien")`; `c.until>h`; `d`; `p`; `u("phuong")&&e.hp/e.maxHp<.35`; `k`; `r.active==="kim"&&(!d&&(!g||h-g.at>=.45)&&(e.st.rootMarks[n.id]={n:Math.min(3,(g&&g.until>h?g.n:0)+1),until:h+6,at:h}),d&&(delete e.st.rootMarks[n.id],c.next=h+3,c.burst=o,c.burstM …`; `g&&g.until>h`; `u("cuong")`; `u("bat")&&n.hp<n.maxHp*.35`; `u("bat")`; `u("tich")`; `u("phan")`; `u("tro")`; `u("lien")`; `!(s||c.next>h)`; `r.active==="moc"`; `u("truong")`; `u("tham")`; `u("cot")`; `u("doc")`; `this.rootDot(e,n,P,S,"moc"),u("lien")`; `u("sinh")&&n.hp<n.maxHp*.35`; `n.hp>H+.5`; `r.active==="thuy"`; `u("tuyen")`; `u("luu")`; `u("hoi")`
- Numeric literals: `1`, `2`, `3`, `0`, `1.3`, `0.1`, `0.15`, `1.35`, `0.2`, `0.35`, `0.25`, `1.1`, `0.05`, `1.06`, `0.45`, `6`, `0.08`, `4`, `0.04`, `100`, `64`, `12`, `8`, `0.16`, `0.03`, `5`, `0.06`, `0.18`, `0.02`, `0.5`, `0.7`, `0.8`, `2.5`, `1.5`, `0.6`
- State writes: `y`, `e.st.rootMarks[n.id]`, `c.next`, `c.burst`, `c.burstMult`, `c.shield`, `c.shieldUntil`, `c.cast`, `c.hits`, `c.until`
- Event types: `fx`

### `j1.rootNote` — 138103–138186

- Numeric literals: `2.3`
- Event types: `root`

### `j1.rootDot` — 138186–138512

- Conditions: `t.dead`; `i==="hoa"`; `i==="kim"`; `r`; `r.until>this.t`
- Numeric literals: `0`, `1`
- State writes: `r.dps`, `r.until`, `r.kind`, `r.scaled`

### `j1.rootResource` — 138512–138739

- Conditions: `t.classId==="the-tu"`
- Numeric literals: `100`, `0`
- State writes: `t.mp`, `t.dirty`

### `j1.rootDebuff` — 138739–139025

- Conditions: `(r=e.root)==null`
- Numeric literals: `0.5`, `0`, `0.75`
- State writes: `r`

### `j1.rootCleanse` — 139025–139566

- Conditions: `n.rootExtra.cleanseAt>this.t`; `e.stunUntil>this.t`; `e.rootUntil>this.t`; `e.slowUntil>this.t`; `(s=e.debuffs)!=null&&s.some(i=>i.until>this.t)`; `!i`
- Numeric literals: `1`, `12`, `0`
- State writes: `e.stunUntil`, `e.rootUntil`, `e.slowUntil`, `e.slowF`, `s`, `e.debuffs`, `e.dots`, `n.rootExtra.cleanseAt`, `n.dirty`

### `j1.rootCast` — 139566–140276

- Conditions: `((i=n.root)==null?void 0:i.active)!=="tho"||n.rootState.next>this.t`; `(i=n.root)==null`; `n.rootState.next=this.t+(e("than")?4:6),n.rootState.shield=s*n.maxHp*(.16+Number(e("thach"))*.05+Number(e("son"))*.1+(e("thanh")&&n.hp<n.maxHp*.5?.04:0)),n.rootState.shieldUntil=th …`; `e("than")`; `e("thanh")&&n.hp<n.maxHp*.5`; `e("son")`
- Numeric literals: `0`, `4`, `6`, `0.16`, `0.05`, `0.1`, `0.5`, `0.04`, `7`, `5`, `0.02`, `1`, `2.5`, `0.85`, `2`
- State writes: `i`, `n.rootState.next`, `n.rootState.shield`, `n.rootState.shieldUntil`
- Event types: `fx`

### `j1.mobTaken` — 140276–140377

- Conditions: `e`
- Numeric literals: `1`, `0`

### `j1.mobStatuses` — 140377–141679

- Conditions: `e.dead||i<e.invulnUntil||this.w.realms.protected(e)`; `r&&m`; `m`; `u.t==="root"`; `f<=0`; `d==="stunUntil"`; `e.st.slowUntil>i`
- Numeric literals: `1`, `0.4`, `0`, `0.5`, `0.3`, `0.2`, `0.1`
- State writes: `e.st[d]`, `((h=e.st).by??(h.by={}))[d==="stunUntil"?"stun":"root"]`, `h`, `h.by`, `e.st.interrupts`, `e.st.slowF`, `e.st.slowUntil`, `((c=e.st).by??(c.by={})).slow`, `c`, `c.by`, `e.dirty`

### `j1.mobDot` — 141679–141984

- Conditions: `h`; `o==="bleed"`
- Numeric literals: `0`, `1`
- State writes: `h.dps`, `h.until`, `h.stacks`

### `j1.mobDotTick` — 141984–142468

- Conditions: `n.dead||this.t<n.invulnUntil`; `o!=="p"`
- Numeric literals: `1`, `0`, `1.9`
- State writes: `e.mx`, `e.my`, `n.hp`, `n.combatUntil`
- Event types: `dmg`

### `j1.mobProc` — 142468–142839

- Conditions: `s<=0||e.dead||n.owner||n.wb||n.cls!=="monster"&&n.cls!=="elite"`; `!i`; `n.cls==="elite"`; `r.t==="poison"||r.t==="burn"||r.t==="bleed"`
- Numeric literals: `0`, `1`, `0.1`

### `j1.incomingScale` — 142839–143853

- Conditions: `e&&!e.owner`; `((r=n.root)==null?void 0:r.active)==="tho"&&Bt(n.root,"giap")&&n.rootState.shield>0&&n.rootState.shieldUntil>s&&(i*=.9),n.st.guardUntil>s&&(i*=1-n.st.guard),n.pillBuff.defUntil>s&& …`; `(r=n.root)==null`; `(h=F(n,"batKhuatEarly"))==null`; `(c=F(n,"coTheBoost"))==null`
- Numeric literals: `1`, `0`, `0.9`, `0.6`, `4.3`, `0.75`, `0.5`, `0.85`, `0.88`, `0.08`, `5`, `0.3`
- State writes: `r`, `h`, `c`

### `j1.onHurt` — 143853–144841

- Conditions: `r>0&&Math.random()<r`; `n.st.shield>0&&n.st.shieldUntil>s||n.st.guardUntil>s`; `n.guardSwords>0&&F(n,"guardSwords")`
- Numeric literals: `0.75`, `0`, `1.9`, `1`, `0.6`, `8`, `0.15`
- State writes: `n.guardAt`, `e.st.stunUntil`, `e.windupAt`
- Event types: `dmg`, `fx`

### `j1.absorb` — 144841–146159

- Conditions: `e&&n>0&&t.classId==="ngu-thu-su"&&(n=this.quyShell(t,n)),t.classId==="the-tu"&&e&&n>0&&this.t>=t.cls.body.hurtAt&&(t.cls.body.hurtAt=this.t+.5,this.blood(t,6)),e&&s.until>this.t&&s …`; `n=this.equipment.absorb(t,n,this.t,!!e&&(!X(e)||!!e.owner)),s.until>this.t&&s.hp>0`; `s.hp-=r,n-=r,e&&i&&s.kind==="giap-co"&&s.next<=this.t&&(s.next=this.t+1,this.damage(i,t,e,18,{proc:!0}),this.guMark(e,t)),s.hp<=0&&i&&s.kind==="huyet-giap"`; `t.rootState.shield>0&&t.rootState.shieldUntil>this.t`; `(o=t.root)==null`; `t.st.shield>0&&t.st.shieldUntil>this.t`; `r`; `e&&!X(e)`
- Numeric literals: `0`, `0.5`, `6`, `1`, `18`, `2.5`, `40`, `0.1`, `3`, `4`, `0.02`, `0.2`
- State writes: `n`, `t.cls.body.hurtAt`, `s.hp`, `s.next`, `s.kind`, `t.rootState.shield`, `o`, `t.rootExtra.reactAt`, `t.rootExtra.resourceAt`, `t.st.shield`
- Event types: `fx`

### `j1.flags` — 146159–146776

- Numeric literals: `0`
- State writes: `i`

### `j1.gauge` — 146776–147673

- Conditions: `(e=F(t,"satYMax"))==null`; `t.room`; `n.pet`
- Numeric literals: `100`, `5`, `0`, `4`, `1`, `10`
- State writes: `e`

### `j1.fieldPulse` — 147673–148184

- Conditions: `!(e.dead||e.room!==t)`; `n.raw>0`; `n.def.id==="van-doc"&&Math.hypot(e.x-n.x,e.y-n.y)<n.r&&this.heal(t,e,6*this.hpScale(e),!0),n.def.id==="dai-tran"`
- Numeric literals: `0`, `6`, `1.2`, `0.5`
- State writes: `s.st.slowUntil`, `s.st.slowF`

### `j1.later` — 148184–148241

- Conditions: `n<=0`
- Numeric literals: `0`


## Detailed execution paths

### Skill initiation and delayed resolution — CONFIRMED

- `j1.cast` [86374, 89748) validates skill selection, silence/stun, cooldowns, level, mana, class resource costs, root restrictions, target availability. It records cooldown, cast serial, animation and event payload before resolving effects. Cast time and hit time are distinct.
- `j1.run` [89947, 93143) dispatches by `shape`: `self`, `ally`, `circle`, `cone`, `line`, `field`, `dash`, `blink`, `star`, `projectile`. Delayed callbacks are gated by `j1.releaseGuard` [89748, 89947); this matters when interrupted, dead or moved to another room.
- `j1.area` [93143, 93816), `j1.cone` [93816, 94091), `j1.line` [94091, 94317) apply target search and filtering. `area` sorts targets by distance and uses target limit and splash scaling for additional targets.
- `j1.damage` [94669, 99733) checks room, death, invulnerability and PK rules; applies base scaling, skill/gear/class/passive/status modifiers, type defenses, critical chance and randomized final rounding. Final integer damage is `max(1, round(raw * multiplier * (0.95 + Math.random() * 0.1)))` in the visible branch, before actual HP delta and other world functions. Not all raw paths share the same modifiers.
- The first hit and subsequent target handling use a WeakMap (`castFirst`) and `Au` scaling; confirm tuning imports before assuming AoE progression values. Actual HP changes are delegated to world `dealMonster` or `hurtByPlayer`; the final result can differ from the computed requested damage.
- `j1.statuses` [102980, 105460), `j1.dot` [108732, 109280), `j1.statusTick` [120372, 121708) implement control, stacking and periodic damage. Boss and immune-control checks can skip stun, knock, root, slow, pull and silence. Dot stacks, expiry and tick scheduling are stored on `st`.
- `j1.heal` [110120, 110742) applies PvP sustain and healing modifiers, rounds HP recovery, enforces max HP and may produce overflow-shield effects. `j1.absorb` [144841, 146159) and `j1.incomingScale` [142839, 143853) belong to incoming damage paths; distinguish defense from outgoing damage.

### Class resources and state — CONFIRMED

- `am-tong`: `j1.beat` [113098, 113723) evaluates 0.8-second beat multiples with ±0.15-second tolerance and up to four beats; stacks cap through `maxStacks`.
- `ma-tong`: `j1.makhiGain` [113943, 114261) caps Ma Khí 0–100; reaching 100 enters overload with stun and HP cost unless an exception passive applies.
- `co-su`: `j1.guStacks` [128271, 128391), `j1.guMark` [128391, 128896), `j1.brew` [117024, 117389) regulate poison marks and jar mixing.
- `the-tu`: `j1.blood` [128896, 128984), `j1.bodyCast` [128984, 131968) mediate Thánh Huyết and body-system skills.
- `phu-su`: `j1.detonate` [116043, 117024) executes stored seals; chain factor `min(2.5, 1 + (0.35 + addedStep) * step)`.
- `tran-phap-su`: `j1.array` [121708, 123113) processes array nodes and periodic area effects.
- `ngu-thu-su`: `j1.petTick` [123555, 125552), `j1.petSkill` [125552, 126815) control summoned pet behaviors.

**UNKNOWN**: Whether this simulation executes on client, server, or both; in the absence of deployment information no authoritative server claims are made.
