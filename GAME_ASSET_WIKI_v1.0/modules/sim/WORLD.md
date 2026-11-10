# WORLD — source-grounded module

**CONFIRMED**: World simulation and event flow: e2.handle, e2.tick, e2.move, e2.updatePlayer, e2.updateMonsters, e2.processPaths, e2.updateShots, e2.snapshot, e2.eventsFor. Also NPC, party, travel, loot, deaths, spawning and boss lifecycle. Network transport outside this file is not established merely by event payloads.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (91)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `e2.constructor` | constructor | 571367–572197 | `T`, `Date.now` |
| `e2.newEntityId` | method | 572197–572229 | — |
| `e2.bossState` | method | 572229–572364 | — |
| `e2.bossRanking` | method | 572364–572677 | `bi`, `Object.entries`, `this.realms.events.find`, `e2.bossState`, `[...e.dmg].map`, `[...n.tag??[]].map` |
| `e2.bossContribution` | method | 572677–573378 | `this.bossCache.get`, `n.monsters.filter`, `this.bossCache.set`, `e.bosses.filter(h=>!h.dead&&Math.hypot(h.x-t.x,h.y-t.y)<=32).sort`, `e.bosses.filter`, `Math.hypot`, `this.damageCache.get`, `e2.bossRanking`, `this.damageCache.set`, `o.rows.find`, `o.rows.indexOf`, `o.rows.slice(0,3).map` |
| `e2.saveRoaming` | method | 573378–573669 | `Object.fromEntries`, `this.bossRanking(t.room,n).map`, `e2.bossRanking` |
| `e2.restoreRoaming` | method | 573669–574078 | `e2.room`, `e2.epoch`, `e2.worldBossTick`, `Math.min` |
| `e2.spawnRoamingBoss` | method | 574078–575311 | `[...this.rooms.values()].filter`, `this.rooms.values`, `Ot`, `this.realms.inRoom`, `Y.some`, `e.hosts.includes`, `[...n.players].some`, `t.some`, `t.filter`, `t.sort`, `t.slice`, `Math.random` |
| `e2.startRoaming` | method | 575311–575807 | `Math.round`, `Wt`, `e2.epoch`, `e2.worldBossTick` |
| `e2.endRoaming` | method | 575807–576157 | `n.room.monsters.indexOf`, `n.room.monsters.splice`, `n.room.slams.filter`, `e2.announce` |
| `e2.roamingTick` | method | 576157–576573 | `e2.epoch`, `Math.ceil`, `e2.endRoaming`, `e2.worldBossTick`, `e2.spawnRoamingBoss` |
| `e2.createRealmRoom` | method | 576573–576758 | `e2.newId`, `this.rooms.set` |
| `e2.newId` | method | 576758–576784 | — |
| `e2.addField` | method | 576784–576834 | `t.fields.push` |
| `e2.addShot` | method | 576834–576863 | `t.shots.push` |
| `e2.spawnPet` | method | 576863–577299 | `wt`, `t.pets.push` |
| `e2.dropPet` | method | 577299–577343 | `t.pets.filter` |
| `e2.room` | method | 577343–577489 | `this.rooms.get`, `this.data.maps.get`, `this.rooms.set` |
| `e2.join` | method | 577489–579603 | `this.realms.resume`, `this.players.set`, `this.data.maps.has`, `this.data.maps.get`, `e2.place`, `ek`, `this.realms.join`, `e2.resumeParty`, `Number.isFinite`, `Math.max`, `Math.min`, `e2.epoch` |
| `e2.leave` | method | 579603–579772 | `n.call`, `e2.failTribulation`, `this.realms.disconnect`, `e2.removePlayer` |
| `e2.holdParty` | method | 579772–580025 | `n.members.filter`, `this.partyHold.set`, `t.name.toLowerCase` |
| `e2.resumeParty` | method | 580025–580276 | `t.name.toLowerCase`, `this.partyHold.get`, `this.partyHold.delete`, `e.party.members.push` |
| `e2.expirePartyHolds` | method | 580276–580630 | `this.partyHold.delete`, `e2.sys`, `[...this.partyHold.values()].some`, `this.partyHold.values` |
| `e2.removePlayer` | method | 580630–580811 | `e2.holdParty`, `e2.dropPet`, `n.players.delete`, `this.players.delete` |
| `e2.place` | method | 580811–580863 | `e2.placeInRoom`, `e2.room` |
| `e2.placeInRoom` | method | 580863–581451 | `e2.failTribulation`, `e2.dropPet`, `r.players.delete`, `n.players.add`, `n.collision.nearestOpen`, `t.inside.clear`, `n.map.gates.some`, `Ot`, `Math.hypot`, `t.known.clear`, `e2.record` |
| `e2.handle` | method | 581451–582650 | `e2.move`, `Number.isFinite`, `Math.hypot`, `e2.skill`, `String`, `e2.action`, `String(n.text??"").replace(/[\u0000-\u001f]/g,"").trim().slice`, `String(n.text??"").replace(/[\u0000-\u001f]/g,"").trim`, `String(n.text??"").replace`, `e.startsWith`, `/^\/(p\|to\|w\|tg) /i.test`, `e2.command` |
| `e2.announce` | method | 582650–582825 | `this.global.push`, `Date.now().toString`, `Date.now` |
| `e2.announceLoot` | method | 582825–583122 | `e2.announce`, `Jr`, `K0` |
| `e2.sys` | method | 583122–583189 | `t.events.push` |
| `e2.partySay` | method | 583189–583401 | `e2.sys`, `e.events.push`, `As`, `e2.epoch` |
| `e2.command` | method | 583401–585626 | `n.slice(1).split`, `n.slice`, `s.join(" ").trim`, `s.join`, `e.toLowerCase`, `h.members.some`, `["p","to","w","tg","tuchoi","từchối"].includes`, `t.note`, `[...this.players.values()].find`, `this.players.values`, `m.name.toLowerCase`, `u.toLowerCase` |
| `e2.leaveParty` | method | 585626–586044 | `e.members.filter`, `e2.sys` |
| `e2.sharers` | method | 586044–586232 | `n.party.members.filter`, `Math.hypot` |
| `e2.allyNear` | method | 586232–586363 | `n.members.some`, `Math.hypot` |
| `e2.tick` | method | 586363–589804 | `n.call`, `e2.expirePartyHolds`, `this.realms.tick`, `e2.roamingTick`, `i.loot.filter`, `i.monsters.some`, `e2.worldBossTick`, `Ot`, `this.realms.inRoom`, `this.rooms.delete`, `hr`, `e2.epoch` |
| `e2.updatePlayer` | method | 589804–591366 | `I0`, `e2.epoch`, `Math.floor`, `Object.keys`, `Math.min`, `this.combat.healingMultiplier`, `this.combat.pvpMana`, `e2.allyNear`, `this.combat.equipment.speed`, `Zr`, `Math.max`, `Qo` |
| `e2.rootStatus` | method | 591366–592085 | `Math.ceil`, `"●".repeat`, `Math.min`, `"○".repeat`, `Math.max`, `c.includes`, `s.query`, `Math.abs`, `h`, `Math.round` |
| `e2.move` | method | 592085–592861 | `Number.isFinite`, `Math.hypot`, `r.collision.blocked`, `Math.floor`, `this.realms.cancel`, `t.note`, `this.fishing.cancel`, `e2.record`, `/^[a-z_]{1,16}$/.test` |
| `e2.updateMonsters` | method | 592861–597918 | `t.playerGrid.rebuild`, `Ot`, `this.realms.inRoom`, `this.realms.protected`, `Math.hypot`, `t.playerGrid.query`, `this.paths.delete`, `s.push`, `Ta`, `this.players.get`, `e2.lineOpen`, `e2.requestPath` |
| `e2.requestPath` | method | 597918–597990 | `this.paths.set` |
| `e2.processPaths` | method | 597990–598302 | `this.paths.delete`, `e2.pathFor` |
| `e2.lineOpen` | method | 598302–598476 | `Math.hypot`, `Math.ceil`, `t.collision.blocked` |
| `e2.pathFor` | method | 598476–600149 | `Math.max`, `Math.min`, `Math.ceil`, `Math.floor`, `new Int8Array(h*c).fill`, `t.collision.blocked`, `u`, `m`, `f`, `new Float32Array(h*c).fill`, `new Int32Array(h*c).fill`, `Math.abs` |
| `e2.updateShots` | method | 600149–600590 | `this.combat.enemies`, `e.hit.has`, `Math.hypot`, `this.combat.radius`, `e.hit.add`, `e.onHit`, `this.combat.damage`, `t.collision.blockedCell`, `t.shots.filter` |
| `e2.skill` | method | 600590–600940 | `this.fishing.cancel`, `this.realms.protected`, `this.realms.unprotect`, `this.realms.cancel`, `t.note`, `fe`, `this.combat.basic`, `this.combat.dodge`, `this.combat.cast` |
| `e2.pkOk` | method | 600940–601541 | `this.realms.protected`, `this.realms.inBossRoom`, `t.ktPk`, `i.call`, `this.realms.inRoom`, `Jt.has`, `zs`, `V`, `e2.dosatZone`, `Yy` |
| `e2.dosatZone` | method | 601541–601675 | `this.realms.inRoom`, `Jt.has`, `Vs` |
| `e2.dosatKill` | method | 601675–603448 | `this.realms.inRoom`, `Jt.has`, `Rt`, `xi`, `e.applyLevel`, `Math.min`, `Math.floor`, `e.count`, `e.give`, `n.give`, `e.worn.values`, `e.gear.filter` |
| `e2.dosatToggle` | method | 603448–604193 | `Date.now`, `t.note`, `Math.ceil`, `t.toast`, `Rt`, `Nt` |
| `e2.hurtByPlayer` | method | 604193–605611 | `e2.pkOk`, `t.events.push`, `Et`, `q0`, `O0`, `V`, `m.call`, `g.call`, `G0`, `this.combat.incomingScale`, `V0`, `this.combat.pvpBurst` |
| `e2.dealMonster` | method | 605611–606623 | `this.realms.protected`, `Et`, `this.realms.damage`, `Math.max`, `Math.round`, `e2.bossState`, `g.dmg.set`, `g.dmg.get`, `Math.min`, `(e.tag??(e.tag=new Map)).set`, `e.tag.get`, `Math.hypot` |
| `e2.worldBossKill` | method | 606623–609010 | `e2.bossState`, `e2.bossRanking`, `t.events.push`, `[...t.players].find`, `f.note`, `e2.record`, `e2.gainExp`, `Math.max`, `Math.round`, `eh`, `e.give`, `r.get` |
| `e2.codeRewardOk` | method | 609010–609265 | `mt`, `e.some`, `E0.some`, `Bn`, `Object.values(eu).includes`, `Object.values` |
| `e2.pillView` | method | 609265–609611 | `i.push`, `Math.ceil`, `o` |
| `e2.fishShop` | method | 609611–611083 | `t.note`, `e2.npcNear`, `Object.values(s.lakes).flat`, `Object.values`, `[...new Map(i.map(m=>[m.name,m])).values()].filter`, `new Map(i.map(m=>[m.name,m])).values`, `i.map`, `t.freeCount`, `e2.sellable`, `ro`, `t.takeFree`, `f.push` |
| `e2.usePill` | method | 611083–613432 | `n.note`, `n.count`, `Math.ceil`, `Math.max`, `Math.min`, `Math.round`, `this.combat.healingMultiplier`, `t.events.push`, `c`, `n.st.dots.filter`, `Rt`, `n.give` |
| `e2.redeemCode` | method | 613432–614396 | `t.note`, `t.mailVerified`, `Qa`, `this.codes.check`, `Date.now`, `this.codes.get`, `o.rewards.reduce`, `Ki`, `t.gearFits`, `o.rewards.flatMap`, `Array.from`, `Math.min` |
| `e2.cttCommand` | method | 614396–614464 | `e2.gmAction` |
| `e2.cttBoss` | method | 614464–615053 | `Ot`, `this.realms.inRoom`, `e.collision.blocked`, `e.collision.nearestOpen`, `Y.find`, `r.hosts.includes`, `Math.max`, `Math.min`, `e2.startRoaming` |
| `e2.gmAction` | method | 615053–619623 | `JSON.parse`, `this.codes.put`, `Date.now`, `e2.codeRewardOk`, `n.note`, `this.codes.get`, `this.codes.setDisabled`, `this.codes.remove`, `Qa`, `n.events.push`, `this.codes.list`, `this.data.maps.get` |
| `e2.later` | method | 619623–619674 | `t.pending.push` |
| `e2.kill` | method | 619674–621896 | `this.paths.delete`, `this.realms.killed`, `e2.worldBossKill`, `wt`, `Ot`, `this.realms.inRoom`, `t.events.push`, `e2.bossRanking`, `e2.announce`, `vi`, `[...t.players].find`, `u.note` |
| `e2.drops` | method | 621896–624089 | `iu`, `e2.announce`, `as`, `o.sets.includes`, `Math.random`, `s.push`, `Math.floor`, `Math.max`, `Math.round`, `this.realms.inRoom`, `this.realms.eliteLoot`, `this.realms.bag` |
| `e2.pickup` | method | 624089–625080 | `Math.hypot`, `W0`, `gh`, `n.gearFits`, `n.gear.push`, `i.push`, `lo`, `e2.announceLoot`, `li`, `n.grantRewardGear`, `n.note`, `n.give` |
| `e2.gainExp` | method | 625080–625845 | `Number.isFinite`, `up`, `ga`, `V`, `nv`, `Xn`, `l1`, `Math.floor`, `Math.max`, `vt`, `cp`, `Pe` |
| `e2.worldBossTick` | method | 625845–627776 | `e2.epoch`, `sy`, `iy`, `oy`, `wt`, `t.monsters.push`, `n.dmg.clear`, `ui`, `Math.round`, `e2.announce`, `this.global.at`, `t.slams.push` |
| `e2.meditate` | method | 627776–628537 | `n.note`, `Math.floor`, `e2.record`, `Math.max`, `vt`, `Xs`, `Do`, `e2.gainExp` |
| `e2.dailyClaim` | method | 628537–630504 | `Iu`, `Date.now`, `Number`, `i.dailies.find`, `Fa`, `gk`, `o.claimed.filter`, `n.give`, `e2.gainExp`, `e2.record`, `Du`, `fk` |
| `e2.startTribulation` | method | 630504–631743 | `Pe`, `n.note`, `mc`, `vt`, `Math.ceil`, `Ot`, `/Cave/.test`, `V`, `n.count`, `n.give`, `Ff`, `this.fishing.cancel` |
| `e2.failTribulation` | method | 631743–632079 | `Math.ceil`, `vt`, `Math.max`, `this.rooms.values`, `i.bolts.filter`, `t.toast`, `t.note` |
| `e2.tribTick` | method | 632079–633034 | `Math.hypot`, `e2.failTribulation`, `t.bolts.push`, `i`, `Math.cos`, `Math.sin`, `t.bolts.some`, `n.applyLevel`, `n.toast`, `X0`, `n.note`, `t.events.push` |
| `e2.hurt` | method | 633034–633886 | `t.events.push`, `this.combat.onHurt`, `Math.max`, `Math.round`, `this.combat.absorb`, `Math.random`, `this.combat.incomingScale`, `this.realms.inRoom`, `tm`, `V`, `Et`, `this.realms.cancel` |
| `e2.die` | method | 633886–634373 | `n.note`, `wt`, `Ia`, `e2.failTribulation`, `this.realms.onDeath`, `t.events.push` |
| `e2.sellable` | method | 634373–634736 | `Q0`, `t.note`, `t.freeCount` |
| `e2.soldBack` | method | 634736–634900 | `Date.now`, `t.buyback.push`, `e.toString`, `(++this.ids).toString`, `t.buyback.filter(s=>e-s.at<jh).slice`, `t.buyback.filter` |
| `e2.recordSale` | method | 634900–635000 | `Math.min`, `e2.record` |
| `e2.record` | method | 635000–635544 | `/^(monster\|rare\|discover\|worldboss):/.test`, `bk`, `t.note`, `gy`, `t.book.refreshState`, `t.book.record`, `i.call`, `t.book.active().find`, `t.book.active`, `t.book.complete`, `t.toast` |
| `e2.npcNear` | method | 635544–635671 | `s.npcs.find`, `Math.hypot` |
| `e2.action` | method | 635671–669070 | `n.startsWith`, `n.split`, `rp`, `xt.find`, `h.call`, `ee`, `t.realmBooks.indexOf`, `t.note`, `ui`, `t.learnedRealms.some`, `t.realmBooks.splice`, `t.learnedRealms.filter` |
| `e2.travel` | method | 669070–669227 | `this.data.maps.has`, `e2.place`, `t.events.push` |
| `e2.snapshotPlayers` | method | 669227–669789 | `this.rooms.values`, `c.push`, `t.set`, `new Ys().rebuild`, `Object.assign`, `[...this.players.values()].map`, `this.players.values`, `e2.playerSnapshot` |
| `e2.dosatSelf` | method | 669789–670495 | `[...this.players.values()].filter(o=>Rt(o.dosat)&&o.room&&!o.dead).slice(0,20).map`, `[...this.players.values()].filter(o=>Rt(o.dosat)&&o.room&&!o.dead).slice`, `[...this.players.values()].filter`, `this.players.values`, `Rt`, `Math.round`, `t.dsRetaliate.delete`, `i.push`, `td`, `Math.max`, `Math.ceil`, `Date.now` |
| `e2.playerSnapshot` | method | 670495–671794 | `t.x.toFixed`, `t.y.toFixed`, `Math.ceil`, `t.weeklyGlow`, `e2.epoch`, `this.combat.flags`, `this.combat.sx`, `Yf`, `vf`, `m.find`, `mt`, `sr` |
| `e2.monsterSnapshot` | method | 671794–672473 | `this.combat.flags`, `this.combat.sx`, `this.monsterSnaps.get`, `e2.monsterSnapshotBuild`, `this.monsterSnaps.set` |
| `e2.monsterSnapshotBuild` | method | 672473–672951 | `t.x.toFixed`, `t.y.toFixed`, `Math.max`, `Math.ceil` |
| `e2.ktSelf` | method | 672951–673083 | `e.self` |
| `e2.snapshot` | method | 673083–678877 | `o.add`, `t.known.get`, `i.push`, `H.has`, `$.deltas.get`, `Object.keys`, `Array.isArray`, `D.every`, `($.deltas??($.deltas=new Map)).set`, `t.known.set`, `r`, `$` |
| `e2.eventsFor` | method | 678877–679007 | `n.events.filter`, `n.near`, `e.push` |
| `e2.endTick` | method | 679007–679128 | `this.rooms.values`, `this.players.values` |
| `e2.nodeStates` | method | 679128–679208 | `n.nodes.map`, `Qo` |

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

### `e2.constructor` — 571367–572197

- Numeric literals: `0`, `1`, `1000`
- State writes: `this.data`, `this.combat`, `this.realms`, `this.fishing`

### `e2.bossState` — 572229–572364

- Conditions: `(e=n.wb)!=null&&e.roaming`; `((s=this.roamingBoss)==null?void 0:s.room)===t`; `(s=this.roamingBoss)==null`
- Numeric literals: `0`
- State writes: `e`, `s`

### `e2.bossRanking` — 572364–572677

- Conditions: `n.realmBoss`; `(s=this.realms.events.find(i=>i.id===n.realmBoss))==null`; `n.wb`; `e`
- Numeric literals: `0`
- State writes: `s`

### `e2.bossContribution` — 572677–573378

- Conditions: `!n`; `!i`; `r==null`; `r`; `i.realmBoss`
- Numeric literals: `32`, `0`, `1`, `3`
- State writes: `e`, `o`

### `e2.saveRoaming` — 573378–573669

- Conditions: `t==null`; `t&&n&&!n.dead`
- Numeric literals: `0`

### `e2.restoreRoaming` — 573669–574078

- Conditions: `!t`; `!n||!e||n.hp<=0||n.ends<=this.epoch()`
- Numeric literals: `0`, `1`
- State writes: `this.roamingNextAt`, `this.roamingLastHost`, `this.roamingBoss`, `s.m.hp`, `this.roamingChanged`

### `e2.spawnRoamingBoss` — 574078–575311

- Conditions: `this.roamingBoss`; `!s.collision.blocked(p,k,4)&&Math.hypot(p-s.map.entryX,k-s.map.entryY)>14&&o.every(y=>Math.hypot(p-y.x,k-y.y)>8)&&r.every(y=>Math.hypot(p-y.x,k-y.y)>(y.cls==="boss"?20:5))&&h.every …`; `y.cls==="boss"`; `!c`
- Numeric literals: `1`, `0`, `3`, `512`, `4`, `14`, `8`, `20`, `5`, `10`, `2`
- State writes: `t`, `n`, `c`

### `e2.startRoaming` — 575311–575807

- Conditions: `i.attack==="poison"`
- Numeric literals: `0`, `1`, `3.8`, `20`, `1.5`, `2.5`
- State writes: `this.roamingBoss`, `this.roamingLastHost`, `this.roamingNextAt`, `this.roamingChanged`

### `e2.endRoaming` — 575807–576157

- Conditions: `!n`; `e`
- Numeric literals: `0`, `1`
- State writes: `n.room.slams`, `this.roamingBoss`, `this.roamingChanged`

### `e2.roamingTick` — 576157–576573

- Conditions: `t>=n.ends`
- Numeric literals: `1`, `0`, `60`
- State writes: `this.roamingNextAt`, `this.roamingPersistAt`, `this.roamingChanged`, `this.roamingCheckAt`

### `e2.createRealmRoom` — 576573–576758

- Numeric literals: `0`, `1`
- State writes: `e.monsters.length`, `e.nodes.length`, `e.npcs.length`, `e.wb`, `e.stele`

### `e2.spawnPet` — 576863–577299

- Numeric literals: `1.1`, `0.3`, `6`, `0`, `1`

### `e2.dropPet` — 577299–577343

- State writes: `t.pets`

### `e2.room` — 577343–577489

- Conditions: `n`; `e`
- State writes: `n`

### `e2.join` — 577489–579603

- Conditions: `n instanceof Ql`; `t.scene&&this.data.maps.has(t.scene)`; `(this.data.maps.get(s).reqLevel??0)>e.level`; `this.place(e,i,t.scene===i&&t.x?t.x:o.entryX,t.scene===i&&t.y?t.y:o.entryY),ek(e),this.realms.join(e),this.resumeParty(e),Number.isFinite(t.tribRetryAt)&&(e.tribRetry=this.time+Mat …`; `t.scene===i&&t.x`; `t.scene===i&&t.y`; `(r=t.tribAttempt)==null`; `Number.isFinite(t.medOfflineAt)&&e.room`; `Array.isArray(t.pillBuffs)`; `!Array.isArray(c)`; `!["atk","def","exp","regen"].includes(u)||!Number.isFinite(m)||!Number.isFinite(f)||!(f>0)`; `l==="regen"`; `(h=t.rootPassiveReadyAt)==null`
- Numeric literals: `0`, `60`, `1000`, `3600000`, `1`, `120`, `4`, `1000000`, `10800`, `40`, `8`, `12`
- State writes: `t`, `e.tribRetry`, `r`, `e.xp`, `e.dirty`, `e.cd[c]`, `e.pillBuff[l]`, `e.pillBuff[`${l}Until`]`, `e.pillName[l]`, `e.pillName.cul`, `e.rootState.next`, `h`, `e.rootExtra[c]`

### `e2.leave` — 579603–579772

- State writes: `n`

### `e2.holdParty` — 579772–580025

- Conditions: `!n`
- Numeric literals: `0`, `60`
- State writes: `t.party`, `n.members`, `n.leader`

### `e2.resumeParty` — 580025–580276

- State writes: `t.party`, `e.party.leader`

### `e2.expirePartyHolds` — 580276–580630

- Conditions: `n.until>=this.time`
- Numeric literals: `1`, `0`
- State writes: `e.members[0].party`, `e.members`

### `e2.removePlayer` — 580630–580811

- State writes: `t.cls.pet`, `n`, `t.room`

### `e2.placeInRoom` — 580863–581451

- Conditions: `!o`
- Numeric literals: `3.2`, `2`, `0`
- State writes: `t.cls.pet`, `r`, `t.room`, `t.cls.nodes`, `[t.x,t.y]`, `t.harvest`, `t.fishing`, `t.gateReady`, `t.budget`, `t.dirty`

### `e2.handle` — 581451–582650

- Conditions: `Number.isFinite(n.fx)&&Number.isFinite(n.fy)&&(n.fx||n.fy)`; `Number.isFinite(n.ax)`; `Number.isFinite(n.ay)`; `!e||!t.room`; `e.startsWith("/")&&!/^\/(p|to|w|tg) /i.test(e)`; `this.time<(t.cd.cmd??0)`; `this.time<(t.chatAt??0)`; `t.chatAt=this.time+.8,e.startsWith("/")`; `n.ch==="party"`; `n.ch==="guild"`; `n.ch==="world"`
- Numeric literals: `1`, `3`, `0`, `160`, `0.5`, `0.8`, `1000`
- State writes: `t.faceX`, `t.faceY`, `t.cd.cmd`, `t.chatAt`
- Event types: `chat`

### `e2.announce` — 582650–582825

- Numeric literals: `0`, `36`
- Event types: `chat`

### `e2.announceLoot` — 582825–583122

- Conditions: `(s=ta[n.id])==null`; `e!==void 0`; `(i=t.room)==null`; `(o=t.room)==null`
- Numeric literals: `0`, `3`
- State writes: `s`, `i`, `o`

### `e2.sys` — 583122–583189

- Numeric literals: `0`
- Event types: `chat`

### `e2.partySay` — 583189–583401

- Conditions: `!t.party`
- Numeric literals: `1000`
- Event types: `chat`

### `e2.command` — 583401–585626

- Conditions: `(t.realm||(h=t.party)!=null&&h.members.some(u=>u.realm))&&!["p","to","w","tg","tuchoi","từchối"].includes(o)`; `o==="p"||o==="to"`; `o==="moi"||o==="mời"||o==="invite"`; `!u||u===t`; `i`; `u.realm`; `u.party`; `t.party||(t.party=new p3(++this.parties,t)),t.party.leader!==t`; `t.party.members.length>=Es`; `o==="nhan"||o==="nhận"||o==="accept"`; `t.invite=null,!u||u.until<this.time||!u.party.members.length`; `u.party.members.some(m=>m.realm)`; `u.party.members.length>=Es`; `o==="tuchoi"||o==="từchối"`; `o==="roi"||o==="rời"||o==="leave"`; `t.party`; `o==="kick"||o==="duoi"`; `(c=t.party)==null`; `o==="w"||o==="tg"`
- Numeric literals: `1`, `60`, `0`, `1000`
- State writes: `h`, `t.party`, `u.invite`, `t.invite`, `c`
- Event types: `chat`

### `e2.leaveParty` — 585626–586044

- Conditions: `e`; `e.leader!==t&&e.members.length`
- Numeric literals: `0`, `1`
- State writes: `t.party`, `e.members`, `e.leader`, `e.members[0].party`

### `e2.sharers` — 586044–586232

- Conditions: `!n.party`

### `e2.allyNear` — 586232–586363

- State writes: `n`

### `e2.tick` — 586363–589804

- Conditions: `i.players.size===0&&(i.idle+=t,i.loot.length&&(i.loot=i.loot.filter(r=>r.until>this.time)),!(i.pending.length||i.shots.length||i.fields.length||i.bolts.length||i.slams.length||i.mo …`; `(e=this.roamingBoss)==null`; `this.updateMonsters(i,t),this.updateShots(i,t),i.wb&&this.worldBossTick(i),i.pending.length`; `i.loot.length&&i.loot.some(o=>o.until<=this.time)&&(i.loot=i.loot.filter(o=>o.until>this.time)),i.bolts.length`; `!h||r.dead||r.room!==i||h.room!==i||(i.events.push({e:"fx",kind:o.final?"trib_final":"trib_bolt",x:o.main?r.x:o.x,y:o.main?r.y:o.y}),!o.main)`; `o.final`; `o.main`; `Math.hypot(r.x-h.x,r.y-h.y)>h.radius`; `r.party`; `g===0`; `o.flipAt<0`; `o.active`
- Numeric literals: `0`, `120`, `1000`, `10`, `0.2`, `1`, `0.5`, `1.9`, `100`
- State writes: `n`, `i.loot`, `e`, `i.idle`, `o.dirty`, `o.outfitNext`, `o.autoLootAt`, `o.combatUntil`, `o.dailyAt`, `i.pending`, `d.hp`, `d.combatUntil`, `d.dirty`, `r.hp`, `r.combatUntil`, `r.dirty`, `i.bolts`, `i.fields`, `o.flipAt`, `o.active`
- Event types: `fx`, `dmg`, `node`

### `e2.updatePlayer` — 589804–591366

- Conditions: `n.gm.nocd`; `s>n.combatUntil`; `this.allyNear(n)`; `n.flying`; `n.budget=Math.min(Math.max(3,i),n.budget+i*e),n.flying&&(n.dead||n.st.rootUntil>s||n.st.stunUntil>s)&&(n.flying=!1),!n.dead`; `n.harvest`; `!o||!Qo(o,n)||Math.hypot(o.x-n.x,o.y-n.y)>1.8`; `(n.landmarkCheck-=e)<=0`; `o.scene!==t.scene||!o.at`; `r&&!n.inside.has(o.id)`
- Numeric literals: `0`, `1`, `0.03`, `1.2`, `7.5`, `1.25`, `1.35`, `3`, `1.8`, `0.4`
- State writes: `n.dirty`, `n.cd[o]`, `n.mp`, `n.hp`, `n.budget`, `n.flying`, `n.harvest`, `n.landmarkCheck`
- Event types: `node`

### `e2.rootStatus` — 591366–592085

- Conditions: `!i`; `o.next>e`; `(c=i.nodes)!=null&&c.includes("kim-thien")`; `s==null`; `g.dead||Math.abs(g.x-t.x)>8||Math.abs(g.y-t.y)>8`; `o.until>e`; `o.shieldUntil>e&&o.shield>0`
- Numeric literals: `0`, `2`, `3`, `8`
- State writes: `c`, `m`

### `e2.move` — 592085–592861

- Conditions: `!r||!Number.isFinite(n)||!Number.isFinite(e)`; `t.seq=o|0,t.dead`; `h>t.budget+.3||r.collision.blocked(n,e,rt,fu)`; `h>.05&&(t.st.rootUntil>this.time||t.st.stunUntil>this.time)`; `r.collision.blocked(t.x+(n-t.x)*m,t.y+(e-t.y)*m,rt,fu)`; `/^[a-z_]{1,16}$/.test(i)&&i!=="death"&&i!=="die"`
- Numeric literals: `0`, `0.3`, `0.05`, `1`, `0.4`, `0.001`, `8`
- State writes: `t.seq`, `t.budget`, `t.movedAt`, `t.harvest`, `t.meditating`, `t.x`, `t.y`, `t.dir`, `t.anim`

### `e2.updateMonsters` — 592861–597918

- Conditions: `l.moved=!1,l.dead`; `i||l.realmBoss||l.wb||e<l.respawnAt||o>=8`; `p`; `l.target||l.hp<l.maxHp||e>=(l.senseAt??0)`; `I.dead||this.realms.protected(I)||I.st.stealthUntil>e`; `k>34`; `l.owner||s.push(l),l.st.stunUntil>e`; `l.target`; `l.target=S?l.target&&Math.hypot(l.target.x-l.x,l.target.y-l.y)<k+2?l.target:p:null,(u=l.st.fx)!=null&&u.length`; `S`; `l.target&&Math.hypot(l.target.x-l.x,l.target.y-l.y)<k+2`; `l.target&&l.target!==P&&!this.lineOpen(t,l,l.target.x,l.target.y)&&this.requestPath(t,l,l.target.x,l.target.y),!l.realmBoss&&!l.target&&y>3&&(l.hp=Math.min(l.maxHp,l.hp+l.maxHp*.5* …`; `e<l.fleeUntil&&p`; `b>v`; `l.cls==="boss"`; `y>3&&(l.tx=l.hx,l.ty=l.hy,l.wait=0),(l.wait-=n)<=0&&Math.hypot(l.tx-l.x,l.ty-l.y)<.5`; `l.tx=C,l.ty=x,!t.collision.blocked(C,x,l.radius)`; `y>3`; `l.target&&(H||L)`; `!l.target&&y>3`; `!D`; `(m=l.path)!=null&&m.length`; `(d=l.path)!=null&&d.length`; `this.paths.has(l)&&!((f=l.path)!=null&&f.length)&&(H=L=0),(H||L)&&!N&&l.st.rootUntil<=e`; `l.st.slowUntil>e`; `I`; `l.target||e<l.fleeUntil||y>3`; `l.blockT=A?(l.blockT??0)+n:0,A`; `A`; `e<l.detourUntil&&l.detour`
- Numeric literals: `0`, `1`, `8`, `34`, `0.45`, `0.15`, `4`, `0.025`, `3`, `12`, `2`, `0.5`, `0.01`, `1.9`, `1.4`, `0.35`, `5`, `2.5`, `0.2`, `0.25`, `1.5`, `0.3`, `0.6`, `0.55`, `40`, `80`, `120`, `180`, `0.4`, `0.001`, `0.8`, `0.02`, `0.85`, `0.0001`, `2.4`
- State writes: `l.moved`, `l.dead`, `l.deathAt`, `l.hp`, `l.x`, `l.y`, `l.tx`, `l.ty`, `l.target`, `l.anim`, `l.path`, `l.blockT`, `l.senseAt`, `l.nearest`, `p`, `k`, `l.windupAt`, `u`, `H`, `L`, `l.attackCd`, `l.dir`, `l.flashUntil`, `l.wait`, `m`, `g`, `d`, `f`, `U`, `B`, `j`, `W`, `C`, `x`, `l.detour`, `l.detourUntil`, `l.calmUntil`, `l.stuck`, `l.hx`, `l.hy`, `l.turnAt`, `[p.x,p.y]`, `[y.x,y.y]`, `c`

### `e2.processPaths` — 597990–598302

- Conditions: `this.paths.delete(n),!(n.dead||!e.room.players.size||n.target!==e.target||e.target&&(e.target.dead||e.target.room!==e.room))&&(n.path=this.pathFor(e.room,n,e.x,e.y),n.pathAt=this.t …`
- Numeric literals: `8`, `3`, `0`
- State writes: `n.path`, `n.pathAt`, `n.target`, `n.calmUntil`

### `e2.lineOpen` — 598302–598476

- Conditions: `t.collision.blocked(n.x+(e-n.x)*r/o,n.y+(s-n.y)*r/o,n.radius*.8)`
- Numeric literals: `0.4`, `1`, `0.8`, `0`

### `e2.pathFor` — 598476–600149

- Conditions: `g[b]>=0`; `t.collision.blocked(u(b),m(b),n.radius*.9)`; `w<0||C<0||w>=h||C>=c`; `l<0||p<0`; `v[C][0]<=v[w][0]`; `v.length`; `C<v.length&&v[C][0]<v[A][0]&&(A=C),x<v.length&&v[x][0]<v[A][0]&&(A=x),A===w`; `b===p`; `K<0||R<0||K>=h||R>=c`; `!d(_)&&_!==p||C&&x&&(!d(w*h+K)||!d(R*h+M))`; `H<0`
- Numeric literals: `0`, `8`, `96`, `0.5`, `1`, `0.9`, `0.414`, `2`, `5000`, `1.414`
- State writes: `g[b]`, `[v[C],v[w]]`, `w`, `v[0]`, `A`, `[v[A],v[w]]`, `k[l]`, `H`, `k[_]`, `y[_]`, `b`, `I`

### `e2.updateShots` — 600149–600590

- Conditions: `e.left<=0||e.hit.has(i)`; `e.onHit`
- Numeric literals: `0.6`, `0`, `1.8`, `0.4`, `0.9`
- State writes: `e.left`, `t.shots`

### `e2.skill` — 600590–600940

- Conditions: `n==="Space"`; `n==="Q"`
- Numeric literals: `1`
- State writes: `t.meditating`, `t.flying`

### `e2.pkOk` — 600940–601541

- Conditions: `!(n.room===t&&e.room===t&&n!==e&&!n.dead&&!e.dead&&!(n.party&&n.party===e.party)&&!this.realms.protected(n)&&!this.realms.protected(e)&&!this.realms.inBossRoom(n)&&!this.realms.inB …`; `t.ktPk`; `(i=o.pk)==null`; `r!==void 0`; `this.realms.inRoom(t)`; `Jt.has(t.scene)`; `zs(t.map,n.x,n.y)||zs(t.map,e.x,e.y)`
- Numeric literals: `1`, `0`
- State writes: `i`

### `e2.dosatKill` — 601675–603448

- Conditions: `this.realms.inRoom(t)||Jt.has(t.scene)`; `i`; `(f=mt(d.id))==null`; `g.length&&Math.random()<E.wantedDropChance`; `d.grade<0`; `c`; `h<=0&&n.dosat.on&&!i&&r.r&&n.note('Không cộng điểm đồ sát: ${r.r}'),h>0`; `h>1`
- Numeric literals: `1`, `0`, `2`, `0.35`, `0.22`, `3`, `6`
- State writes: `e.dirty`, `n.dirty`, `f`, `e.gear`

### `e2.dosatToggle` — 603448–604193

- Conditions: `this.dosatOff`; `e-n.at<E.toggleCdMs`; `n.on`; `i<E.offCalmSec`; `Rt(n)`; `t.level<E.victimMinLevel`
- Numeric literals: `1000`, `1`, `0`
- State writes: `n.on`, `t.meditating`, `n.at`, `t.dirty`

### `e2.hurtByPlayer` — 604193–605611

- Conditions: `n.dead||!this.pkOk(t,e,n)`; `this.time<n.invulnUntil`; `(m=f.pvpScale)==null`; `this.combat.pvpTouch(n,e),n.lastHit++,this.realms.cancel(n),n.hp-=u,u>0&&this.combat.equipment.hurt(n,this.time,u,!0),n.combatUntil=this.time+gt,e.combatUntil=this.time+gt,t.events …`; `this.combat.lastDt!=="p"`; `this.die(t,n,e.name),n.dead&&this.record(e,"pvp-win"),n.dead&&t.ktKill`; `n.dead`; `f`
- Numeric literals: `1`, `0`, `1.9`, `1000`
- State writes: `m`, `g`, `r`, `n.hp`, `n.combatUntil`, `e.combatUntil`, `e.dirty`, `d`
- Event types: `dmg`

### `e2.dealMonster` — 605611–606623

- Conditions: `e.dead||n.dead||n.room!==t||this.realms.protected(n)||(s*=(1-Et(n.st,"weak",this.time))*(1+Et(e.st,"vulnerable",this.time)),n.gm.power&&(s*=100),s=this.realms.damage(n,e,s,h),s<=0)`; `e.bossWard!==void 0&&(s=Math.max(1,Math.round(s*e.bossWard))),e.wb`; `h==="dot"`; `this.combat.lastDt!=="p"`
- Numeric literals: `1`, `100`, `0`, `0.09`, `3`
- State writes: `s`, `e.tag`, `e.hp`, `e.flashUntil`, `[e.x,e.y]`, `e.fleeUntil`, `e.target`, `n.combatUntil`
- Event types: `dmg`

### `e2.worldBossKill` — 606623–609010

- Conditions: `!s`; `Z.on`; `!p`; `u`; `!f||f===e||d.percent<2`; `i.roaming`
- Numeric literals: `0`, `2`, `1`, `3`, `10`, `100`
- State writes: `n.dead`, `n.deathAt`, `n.hp`, `n.anim`, `n.target`, `d.dirty`, `this.roamingBoss`, `this.roamingChanged`, `s.nextAt`, `s.m`
- Event types: `die`

### `e2.codeRewardOk` — 609010–609265

- Conditions: `t.gear`

### `e2.pillView` — 609265–609611

- Conditions: `i.length`
- Numeric literals: `0`, `1`

### `e2.fishShop` — 609611–611083

- Conditions: `!s`; `t.dead||t.dosat.on`; `!this.npcNear(t,"ngu-ong")`; `n==="sell"`; `!this.sellable(t,l.name,!1)`; `!d`; `!o`; `e==="all"&&m.tier==="huyen_thoai"`; `!g||!this.sellable(t,m.name,!1)`; `!h`; `(u=s.daily)==null`; `m>0`; `d.day!==g&&(d.day=g,d.n=0,d.ess=0),d.ess+h>m`
- Numeric literals: `0`, `1`
- State writes: `t.dirty`, `u`, `d.day`, `d.n`, `d.ess`

### `e2.usePill` — 611083–613432

- Conditions: `t.map.noPills`; `!s||n.dead||n.count(e)<1`; `r`; `(n.cd[h]??0)>i`; `n.hp>=n.maxHp`; `o.regenUntil>i&&o.regen>u`; `o.atkUntil>i&&o.atk>s.v`; `o.defUntil>i&&o.def>s.v`; `o.expUntil>i&&o.exp>s.v`; `(t.map.medRate??1)>=2`; `n.dosat.score<=0`; `u&&!Rt(n.dosat)`; `r&&!n.tribRun`
- Numeric literals: `1`, `0`, `1.9`, `2`, `5`
- State writes: `o.regen`, `o.regenUntil`, `n.pillName.regen`, `o.atk`, `o.atkUntil`, `n.pillName.atk`, `o.def`, `o.defUntil`, `n.pillName.def`, `o.exp`, `o.expUntil`, `n.pillName.exp`, `n.daily.tuLinh`, `n.pillName.cul`, `n.st.dots`, `n.dirty`, `n.cd[h]`
- Event types: `dmg`

### `e2.redeemCode` — 613432–614396

- Conditions: `e<(t.cd.code??0)`; `t.cd.code=e+2,!t.mailVerified()`; `i`; `c.gear`; `r&&(Z.on?Ki(t)<r:!t.gearFits(o.rewards.flatMap(h=>h.gear?Array.from({length:Math.min(h.amount,60)},()=>({id:zn(h.gear,t.classId)??h.gear,upgrade:h.upgrade??0})):[])))`; `Z.on`; `h.gear`; `(u=mt(c))==null`
- Numeric literals: `0`, `2`, `60`, `1`
- State writes: `t.cd.code`, `t.dirty`, `u`

### `e2.cttCommand` — 614396–614464

- Conditions: `s`
- Numeric literals: `1`

### `e2.cttBoss` — 614464–615053

- Conditions: `!e`; `this.roamingBoss`; `e.map.hub||Ot(e.scene)||this.realms.inRoom(e)`; `e.collision.blocked(t.x,t.y,1.5)`; `!s`; `i`
- Numeric literals: `1.5`, `0`, `1`

### `e2.gmAction` — 615053–619623

- Conditions: `e==="code-save"`; `h`; `typeof c=="string"`; `e==="code-toggle"`; `h.disabled`; `!h&&!this.data.exported.has(s)`; `s===t.scene`; `h==null`; `n.gm[h]`; `c`; `t.map.hub||Ot(t.scene)||this.realms.inRoom(t)`; `!Number.isFinite(g)||!Number.isFinite(d)||g<0||d<0||g>t.map.w||d>t.map.h`; `t.collision.blocked(g,d,1.5)`; `!f||Math.hypot(f[0]-g,f[1]-d)>6`; `u`; `m&&Number.isFinite(Number(m))`; `p`; `!u.goals.every((d,f)=>m[f]>=d[2])`; `g`; `!Rn(s)&&s!==sh||s===n.classId`; `(o=n.gear.find(m=>m.uid===c))==null`; `!u`; `n.worn.get(m.slot)===m.uid`; `!h`; `(r=t.wb)!=null&&r.m&&!t.wb.m.dead`
- Numeric literals: `0`, `2`, `1`, `1.5`, `6`, `999`, `60`, `14`
- State writes: `h`, `[n.x,n.y]`, `n.budget`, `n.flying`, `n.dead`, `n.hp`, `n.mp`, `n.st`, `n.cd`, `n.dirty`, `n.gm[h]`, `c.progress`, `n.forge.materials[d]`, `i`, `n.root`, `n.classId`, `n.def`, `n.cls`, `n.skillSlots`, `n.guardSwords`, `n.guardAt`, `o`, `n.daily`, `r`
- Event types: `codes`

### `e2.kill` — 619674–621896

- Conditions: `e.dead`; `e.deathAt=this.time,this.paths.delete(e),e.realmBoss`; `e.wb`; `e.dead=!0,e.hp=0,e.windupAt=0,e.target=null,e.anim="death",e.st=wt(),e.respawnAt=Ot(t.scene)||this.realms.inRoom(t)?1/0:this.time+(e.cls==="boss"?90:e.cls==="elite"?45:20),t.events …`; `Ot(t.scene)||this.realms.inRoom(t)`; `e.cls==="boss"`; `e.cls==="elite"`; `this.realms.inRoom(t)`; `i>1`; `o>1&&e.guard!==void 0`; `h.pillBuff.expUntil>this.time`; `e.cls!=="boss"&&au(h.donation,this.epoch())`; `h===n`; `e.cls==="boss"&&e.tag`; `i>1&&n.party`
- Numeric literals: `0`, `1`, `90`, `45`, `20`, `0.1`, `1.2`, `15`, `0.05`
- State writes: `e.deathAt`, `e.dead`, `e.hp`, `e.windupAt`, `e.target`, `e.anim`, `e.st`, `e.respawnAt`, `h.dirty`, `e.tag`, `r.dirty`
- Event types: `die`

### `e2.drops` — 621896–624089

- Conditions: `n.dosat.on`; `t.scene==="TtkRungThachKhe"&&Math.random()<.5&&s.push(["Gỗ mộc",1]),s.push(["Linh thạch",Math.max(1,Math.round(e.level*(1+Math.random())*M3*(n.dosat.on?E.gainMult:1)))]),n.realm&&t …`; `s[s.length-1][1]*=2,e.cls==="elite"`; `o!=null&&o.gear`; `o==null`; `e.cls==="gu"`; `Math.abs(n.level-e.level)<=Math.max(20,n.level*.15)`; `e.cls==="boss"`; `e.cls==="elite"`; `Math.random()<.15`; `s.length>1`; `n.dosat.on&&Math.random()>E.gainMult`; `!r`; `r.grade<0`
- Numeric literals: `1`, `0.5`, `2`, `0`, `3`, `20`, `0.15`, `8`, `0.2`, `60`, `1000`, `36`, `0.35`, `0.22`, `6`
- State writes: `n.forge.materials["stone-1"]`, `n.dirty`, `n.forge.materials.reroll`

### `e2.pickup` — 624089–625080

- Conditions: `n.dead||n.room!==t||n.realm`; `h.until<=s||Math.hypot(h.x-n.x,h.y-n.y)>1.6||h.owner&&h.owner!==n&&s<h.free`; `!!c&&!e&&W0(c,n.lootMin)`; `n.lootRecover`; `n.gearFits([c])`; `(li(c)??-1)>=3&&h.owner===n`
- Numeric literals: `1`, `0`, `1.6`, `3`, `5`
- State writes: `h.gear`, `n.dirty`, `n.lootFullNoticeAt`, `h.items`, `h.until`, `t.loot`, `n.forge.materials.powder`
- Event types: `fx`

### `e2.gainExp` — 625080–625845

- Conditions: `!Number.isFinite(e)||e<0||n.level>=An`; `Pe(n.level)&&n.trib<n.level`; `V(n.level)===r&&ga(n.level).tier!==o`
- Numeric literals: `1`, `0`, `1e-9`
- State writes: `e`, `n.xpFraction`, `n.dirty`, `n.xp`, `n.gateNoted`
- Event types: `level`

### `e2.worldBossTick` — 625845–627776

- Conditions: `!n`; `!n.m&&s>=n.nextAt`; `t.monsters.push(g),n.m=g,n.dmg.clear(),n.slamAt=i+6,e&&!o.quiet`; `o.roaming`; `f==null`; `r!=null&&r.target&&(r.target.dead||r.target.room!==t)&&(r.target=null),r&&!r.dead&&r.target&&i>=n.slamAt&&r.st.stunUntil<=i`; `u`; `t.events.push({e:"fx",kind:((h=u.boss.wb)==null?void 0:h.kind)==="kraken"?"nt_quake":"tox_erupt_l",x:u.x,y:u.y}),!u.boss.dead`; `((h=u.boss.wb)==null?void 0:h.kind)==="kraken"`; `(h=u.boss.wb)==null`; `!m.dead&&Math.hypot(m.x-u.x,m.y-u.y)<u.r+rt&&i>=m.invulnUntil&&i>=m.mobSafeUntil`; `(c=u.boss.wb)==null`; `u.boss.hp<u.boss.maxHp*.5`
- Numeric literals: `0`, `0.9`, `1.4`, `8`, `1`, `2`, `6`, `0.5`, `4.5`, `7`, `1.3`, `1.1724137931034482`, `1.9`
- State writes: `n.m`, `n.slamAt`, `f.location`, `r.target`, `h`, `c`, `m.hp`, `m.combatUntil`, `t.slams`
- Event types: `fx`, `dmg`

### `e2.meditate` — 627776–628537

- Conditions: `!i&&s.meditated>=12*3600`; `i`; `n.medGoal=(n.medGoal??0)+e,n.medGoal>=1`; `r&&(s.tuLinh=Math.max(0,(s.tuLinh??0)-e)),n.medFrac+=vt(n.level)*Xs(n.level)/3600*e*Math.max(r?2:1,o)*Do(n),n.medFrac>=1`; `r`
- Numeric literals: `1`, `2`, `12`, `3600`, `0`
- State writes: `n.meditating`, `n.medGoal`, `n.anim`, `s.tuLinh`, `n.medFrac`

### `e2.dailyClaim` — 628537–630504

- Conditions: `!i`; `e==="daily-claim"`; `!h||o.claimed[r]||o.progress[r]<h.count`; `m`; `o.streakDay===o.day-1`; `e==="weekly-claim"`; `!h||o.wclaimed[r]||o.wprogress[r]<h.count`; `e==="weekly-chest"`; `o.chest||!o.wclaimed.length||!o.wclaimed.every(Boolean)`; `e==="login-claim"`; `o.loginDay===o.day`; `e==="collect-claim"`; `!h`
- Numeric literals: `1000`, `2`, `0`, `1`, `7`
- State writes: `o.claimed[r]`, `n.forge.materials[d]`, `o.streak`, `o.streakDay`, `g`, `o.wclaimed[r]`, `o.chest`, `n.forge.materials[m]`, `o.loginDay`, `o.loginStep`, `o.stats.login`, `n.dirty`

### `e2.startTribulation` — 630504–631743

- Conditions: `!Pe(n.level)||n.trib>=n.level`; `!mc()`; `n.xp<vt(n.level)`; `n.tribRun||n.dead`; `e<n.tribRetry`; `t!==n.room||t.map.hub||n.realm||Ot(t.scene)||/Cave/.test(t.scene)`; `e<n.combatUntil`; `i`
- Numeric literals: `1`, `0`, `4.5`, `1.5`, `0.61`, `1.4`
- State writes: `n.tribRun`, `n.meditating`, `n.flying`, `n.harvest`, `n.dirty`
- Event types: `fx`

### `e2.failTribulation` — 631743–632079

- Conditions: `!e`
- Numeric literals: `0`, `60`
- State writes: `t.tribRun`, `t.xp`, `t.tribRetry`, `t.dirty`, `i.bolts`

### `e2.tribTick` — 632079–633034

- Conditions: `n.dead||t!==e.room||n.level!==e.level||Math.hypot(n.x-e.x,n.y-e.y)>e.radius`; `n.dead`; `e.wave<e.waves-1&&s>=e.next&&(e.wave++,e.next+=e.interval,i(e.x,e.y,e.radius,e.tele,!0)),e.finalAt&&s>=e.finalAt`; `s>=e.endAt&&e.wave===e.waves-1&&e.finalAt===0&&!t.bolts.some(o=>o.owner===n)`; `e.hits!==e.waves`
- Numeric literals: `1`, `0`, `1.5`, `4`, `2`, `1.8`, `0.9`, `1.75`, `0.12`
- State writes: `e.finalAt`, `n.tribRun`, `n.trib`, `n.dirty`
- Event types: `fx`

### `e2.hurt` — 633034–633886

- Conditions: `n.dead`; `this.time<n.invulnUntil||this.time<n.mobSafeUntil`; `e.wb`; `e.hp<e.maxHp*.5`; `t.map.hub`; `e.level===1&&e.cls!=="boss"`; `!this.combat.onHurt(t,n,e)`; `e.wb||this.realms.inRoom(t)`
- Numeric literals: `0`, `1.9`, `0.5`, `50`, `42`, `1`, `4`, `3`, `2`, `0.9`, `0.2`
- State writes: `n.hp`, `n.combatUntil`, `n.meditating`
- Event types: `dmg`

### `e2.die` — 633886–634373

- Conditions: `n.gm.god`
- Numeric literals: `0`, `5`
- State writes: `n.hp`, `n.dead`, `n.deadUntil`, `n.anim`, `n.harvest`, `n.fishing`, `n.st`, `n.ward.hp`, `n.ward.blocks`, `n.rootState.shield`, `n.rootState.hits`, `n.cls.avatarUntil`, `n.cls.body`, `n.cls.body.blood`, `s.target`, `s.windupAt`
- Event types: `die`

### `e2.sellable` — 634373–634736

- Conditions: `Q0(n)`; `(t.donation.bound[n]??0)>0&&t.freeCount(n)===0||n===Na`; `!n||n==="Linh thạch"||n===z||n==="nâng cấp"||n==="Thẻ Đổi Tên"`; `n===Te||n===we`
- Numeric literals: `1`, `0`

### `e2.soldBack` — 634736–634900

- Numeric literals: `36`, `20`
- State writes: `t.buyback`

### `e2.recordSale` — 634900–635000

- Numeric literals: `0`
- State writes: `t.buybackDebt`

### `e2.record` — 635000–635544

- Conditions: `this.data.daily&&(n==="worldboss"||n==="skill-learn"||/^(monster|rare|discover|worldboss):/.test(n))&&(t.dirty=!0),this.data.daily`
- Numeric literals: `1`, `0`
- State writes: `t.dirty`, `i`

### `e2.npcNear` — 635544–635671

- Conditions: `(s=t.room)==null`; `e&&Math.hypot(e.x-t.x,e.y-t.y)<qi+.6`
- Numeric literals: `0`, `0.6`
- State writes: `s`

### `e2.action` — 635671–669070

- Conditions: `!i`; `n.startsWith("kt:")`; `rp(this,t,b,M)`; `(r=xt.find(w=>w.id===b))==null`; `n==="inherit-learn"`; `!b||M<0||t.dead||t.realm`; `!((c=t.root)!=null&&c.elements.length)||b.cls!==t.classId||t.level<b.level||o<t.combatUntil`; `t.learnedRealms.some(w=>{const C=ee(w);return(C==null?void 0:C.cls)===b.cls&&C.grade>=b.grade})`; `C==null`; `(C=ee(w))==null`; `n==="inherit-cast"`; `!this.realms.action(t,n,e,s)`; `t.realm&&["travel","fasttravel","market","harvest","meditate","tribulation"].includes(n)`; `!ik(t,n,e,this.epoch()*1e3)&&!_u(t,n,e)`; `t.dosat.on&&/^(forge-|smelt|craft|buy|sell|upgrade$|dismantle$|market)/.test(n)`; `n==="dosat"`; `(n==="craft"||n==="smelt"||n==="forge-weapon")&&!Nm(i.map,t.x,t.y)`; `!Km(t,n,e,s)`; `t.dead||t.realm||t.tribRun`; `e!=="all"&&w.uid!==e`; `(u=t.disciple)==null`; `C.some(x=>Aa(x,w))`; `C.length||t.pendingGear.some(x=>x!==w&&x.uid===w.uid&&!Aa(x,w))`; `b`; `!this.testHooks&&!t.isGm`; `e==="realm"`; `t.realm&&["travel","heal","killall","bosskill"].includes(e)`; `e==="skill-size"`; `b.reset==="all"`; `b.reset`
- Numeric literals: `0`, `1`, `3`, `1000`, `2`, `200`, `100000`, `5`, `8`, `1.5`, `4`, `100`, `36`, `6`, `2.6`, `999`, `99`, `10`, `0.35`, `0.75`, `3600`, `1.9`, `1.8`, `2.2`, `1.1`, `3.4`
- State writes: `h`, `r`, `c`, `t.learnedRealms`, `C`, `t.realmSkill`, `t.dirty`, `this.realms.changed`, `u`, `t.pendingGear`, `M`, `b`, `M.range`, `M.art`, `M.range[b.id]`, `M.art[b.id]`, `m`, `[t.x,t.y]`, `t.budget`, `t.level`, `t.xp`, `g`, `i.wb.nextAt`, `t.attrLtReadyAt`, `t.attributes`, `t.hp`, `t.mp`, `t.dead`, `t.invulnUntil`, `t.dsShieldUntil`, `t.anim`, `t.cd.emote`, `t.mount`, `t.flying`, `t.meditating`, `t.lootRecover`, `t.lootMin`, `t.book.tracked`, `t.forge.materials[w]`, `t.skinId`, `d`, `t.classId`, `t.def`, `t.cls`, `t.cd`
- Event types: `skill-tuning`, `emote`, `root`, `fx`, `gacha`, `chat`, `dmg`

### `e2.travel` — 669070–669227

- Conditions: `this.data.maps.has(n)`
- Numeric literals: `0`
- State writes: `e`, `s`, `t.pending`, `t.dirty`
- Event types: `travel`

### `e2.snapshotPlayers` — 669227–669789

- Conditions: `s.players.size`
- Numeric literals: `1`, `0`
- State writes: `i`, `o`, `r`, `h`

### `e2.dosatSelf` — 669789–670495

- Conditions: `r<=s`
- Numeric literals: `0`, `20`, `1000`, `10`
- State writes: `this.wantedCache`

### `e2.playerSnapshot` — 670495–671794

- Conditions: `(l=t.stats)==null`; `Z.on`; `(v=mt(y))==null`; `(p=t.kt.lucchien)==null`; `(k=t.kt.nap)!=null&&k.goldAura`; `t.donation.look||i`; `t.donation.glow||i`; `t.dosat.on`; `Rt(t.dosat)`
- Numeric literals: `2`, `1000`, `0`, `1`, `3`
- State writes: `l`, `v`, `p`, `k`

### `e2.monsterSnapshot` — 671794–672473

- Conditions: `s&&s.x===t.x&&s.y===t.y&&s.dir===t.dir&&s.anim===t.anim&&s.hp===t.hp&&s.maxHp===t.maxHp&&s.level===t.level&&s.name===t.name&&s.set===t.set&&s.cls===t.cls&&s.height===t.height&&s.de …`; `(o=t.wb)==null`; `(r=t.wb)==null`
- Numeric literals: `0`
- State writes: `o`, `r`

### `e2.monsterSnapshotBuild` — 672473–672951

- Conditions: `t.wb`; `(h=t.wb)==null`
- Numeric literals: `2`, `0`, `1`
- State writes: `h`

### `e2.ktSelf` — 672951–673083

- Conditions: `!e.self`
- Numeric literals: `0`
- State writes: `(n??(n={}))[e.id]`, `n`

### `e2.snapshot` — 673083–678877

- Conditions: `(P==null?void 0:P.sig)!==v`; `P==null`; `P===void 0`; `(H=$==null?void 0:$.deltas)!=null&&H.has(P.sig)`; `$==null`; `((S=t.known.get(y))==null?void 0:S.sig)===v`; `(S=t.known.get(y))==null`; `n==null`; `c`; `t.x>=c.x0&&t.x<=c.x1&&t.y>=c.y0&&t.y<=c.y1`; `c==null`; `y===t||!e.near(y.x,y.y,t.x,t.y)`; `u==null`; `!e.near(y.x,y.y,t.x,t.y)||y.dead&&s>(y.deathAt??y.respawnAt-(y.cls==="boss"?90:y.cls==="elite"?45:20))+1`; `y.cls==="boss"`; `y.cls==="elite"`; `n&&!v`; `!e.near(y.x,y.y,t.x,t.y)`; `!v`; `(l=y.owner)==null`; `e.near(y.x,y.y,t.x,t.y)`; `y.gear`; `v`; `($=y.owner)==null`; `y.cls.boostUntil>s`; `y==="Space"`; `(v=y.wb)==null`; `(p=this.roamingBoss)!=null&&p.state.m`; `Pe(t.level)&&t.trib<t.level&&t.xp>=vt(t.level)&&!t.tribRun&&mc(this,t,!0)`; `t.harvest`
- Numeric literals: `0`, `90`, `45`, `20`, `1`, `2`, `0.6`, `100`, `3`, `1.2`
- State writes: `H`, `L[N]`, `L.x`, `L.y`, `$.deltas`, `S`, `c.all`, `v`, `l`, `$`, `g[y]`, `p`, `k`

### `e2.endTick` — 679007–679128

- State writes: `t.events`, `this.global`

### `e2.nodeStates` — 679128–679208

- Conditions: `(n=t.room)==null`
- Numeric literals: `0`
- State writes: `n`


## World execution graph — CONFIRMED / INFERRED

- World object `e2` [571358, 679209) owns room lifecycle, entity IDs, monster placement, boss spawns, party persistence, pickups, skill requests and game events. This role is **INFERRED** from method names and direct calls; method declarations themselves are **CONFIRMED**.
- Input-facing entry points include `e2.handle` [581451, 582650), `e2.command` [583401, 585626), `e2.action` [635671, 669070), `e2.skill` [600590, 600940) and `e2.move` [592085, 592861). Inspect caller and packet receiver in other modules before classifying input as trusted.
- Periodic path: `e2.tick` [586363, 589804) to `e2.updatePlayer` [589804, 591366), `e2.updateMonsters` [592861, 597918), `e2.processPaths` [597990, 598302), `e2.updateShots` [600149, 600590), then snapshots/events via `e2.snapshot` [673083, 678877) and `e2.eventsFor` [678877, 679007). Execution order must be verified from the complete method body for each scenario.
- Navigation: `e2.requestPath` [597918, 597990), `e2.pathFor` [598476, 600149) and `e2.lineOpen` [598302, 598476) use geometry/path decisions, while collision methods resolve physical movement.
- Death/loot progression: `e2.hurt` [633034, 633886), `e2.die` [633886, 634373), `e2.kill` [619674, 621896), `e2.drops` [621896, 624089), `e2.pickup` [624089, 625080), `e2.gainExp` [625080, 625845). The first two names are not interchangeable: consult their call sites.
- Message-like event payloads (`e: "cast"`, `e: "fx"`, `e: "dmg"`) appear in gameplay logic; the network transport and receiving renderer are cross-module dependencies, **UNKNOWN** from this asset alone.
