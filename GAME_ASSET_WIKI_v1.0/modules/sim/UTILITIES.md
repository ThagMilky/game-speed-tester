# UTILITIES — source-grounded module

**CONFIRMED**: Top-level helpers, constants, registries and inline callbacks. Not every name has known semantics; symbols remain exact without speculative renaming.

**Verification**: Static AST inspection only. No runtime, server/client authority or network integration tests.

## Indexed declarations (1084)

| Exact symbol | Kind | UTF-16 range [start,end) | Invoked symbols (AST, first 12) |
|---|---|---|---|
| `wg` | variable | 4–28 | — |
| `Tg` | arrow_function | 33–118 | `wg` |
| `T` | arrow_function | 123–167 | `Tg` |
| `rt` | variable | 2739–2746 | — |
| `fu` | variable | 2747–2754 | — |
| `ko` | variable | 2755–2761 | — |
| `Df` | variable | 2762–2769 | — |
| `on` | variable | 2770–2774 | — |
| `wn` | variable | 2775–2781 | — |
| `Ln` | variable | 2782–8546 | — |
| `ih` | variable | 8565–8570 | — |
| `ku` | variable | 8577–8583 | — |
| `yo` | variable | 8584–8590 | — |
| `Uf` | variable | 8591–8595 | — |
| `Kf` | variable | 8596–8602 | — |
| `If` | variable | 8603–8608 | — |
| `yu` | variable | 8609–8614 | — |
| `di` | variable | 8615–8621 | — |
| `ym` | arrow_function | 8622–8653 | `Math.max` |
| `Ff` | function | 8654–8811 | `Math.max`, `Math.min`, `Math.floor`, `Math.ceil` |
| `qf` | function | 8811–8954 | `Math.max`, `Math.min`, `Number.isFinite`, `Math.round` |
| `ke` | variable | 8960–8964 | — |
| `Of` | variable | 8965–8971 | — |
| `Gf` | variable | 8972–8977 | — |
| `gi` | arrow_function | 8978–9055 | `Math.max`, `Math.min`, `Math.floor`, `Number` |
| `nr` | arrow_function | 9056–9097 | `Math.max`, `Math.min` |
| `Vf` | arrow_function | 9098–9116 | — |
| `Ef` | function | 9117–9345 | `Array.isArray`, `Object.entries(a).slice`, `Object.entries`, `Math.floor`, `Number`, `Math.min` |
| `jf` | variable | 9351–9356 | — |
| `Wf` | arrow_function | 9357–9413 | `Vf`, `Math.min`, `Math.max` |
| `Xf` | variable | 9414–9420 | — |
| `Qf` | variable | 9421–9477 | — |
| `C3` | arrow_function | 9478–9554 | `Qf.has`, `Math.max` |
| `zf` | arrow_function | 9555–9605 | `String(Math.round(a*10)/10).replace`, `String`, `Math.round` |
| `H3` | arrow_function | 9606–9677 | `a.replace`, `zf` |
| `pu` | variable | 9678–9692 | — |
| `bu` | variable | 9693–9707 | — |
| `Yf` | function | 9708–9740 | `pm` |
| `pm` | function | 9740–10223 | `bu.get`, `a.worn.values`, `n.map`, `a.gear.find`, `e.map`, `bu.set` |
| `hn` | function | 10223–10869 | `pm`, `t.raw.filter`, `t.ids.join`, `pu.get`, `Yl(n,a.classId).filter(o=>o.pieces>=5).map`, `Yl(n,a.classId).filter`, `Yl`, `pu.set` |
| `lt` | arrow_function | 10875–10931 | `a.sets.has`, `t.startsWith` |
| `rn` | function | 10932–11004 | `lt` |
| `Jf` | class | 11004–15668 | — |
| `oh` | variable | 15674–15709 | — |
| `t1` | arrow_function | 15717–15769 | `Math.max`, `Math.min`, `Math.floor` |
| `n1` | variable | 15770–15774 | — |
| `Te` | variable | 15775–15792 | — |
| `e1` | arrow_function | 15793–15880 | — |
| `Jn` | arrow_function | 19382–19408 | `a1.find` |
| `i1` | variable | 22484–22515 | — |
| `bm` | arrow_function | 22820–22851 | `i1.filter` |
| `Bt` | arrow_function | 23801–23893 | `n.includes` |
| `Tn` | variable | 24844–24861 | — |
| `xm` | variable | 24869–24986 | — |
| `Hs` | variable | 24987–24992 | — |
| `u1` | variable | 24993–25003 | — |
| `c1` | arrow_function | 25004–25055 | `Math.max`, `Math.min`, `Math.floor` |
| `l1` | arrow_function | 25140–25161 | `Gi` |
| `Ls` | arrow_function | 25162–25181 | `Gi` |
| `g1` | variable | 25523–25530 | — |
| `f1` | variable | 25531–25538 | — |
| `k1` | variable | 25758–25793 | — |
| `Et` | function | 25794–25917 | `e.find` |
| `po` | function | 25917–26202 | `Number.isFinite`, `Math.min`, `(a.debuffs??[]).filter`, `r.findIndex`, `r.push` |
| `Sn` | arrow_function | 27343–27362 | — |
| `y1` | variable | 27409–27536 | — |
| `p1` | variable | 27537–27715 | — |
| `b1` | variable | 27716–27830 | — |
| `v1` | variable | 27831–27857 | — |
| `x1` | variable | 27858–27863 | — |
| `fi` | arrow_function | 29991–30035 | `ar.filter` |
| `$m` | arrow_function | 30036–30064 | — |
| `L3` | variable | 30065–30098 | — |
| `ki` | arrow_function | 30099–30154 | `Math.max`, `Math.min` |
| `Vi` | function | 30155–30274 | `/^([a-z]+)([0-3])$/.exec`, `Number` |
| `bo` | arrow_function | 30280–30343 | `Vi` |
| `hh` | variable | 30344–30354 | — |
| `Mu` | variable | 30355–30380 | — |
| `M1` | variable | 30381–30522 | — |
| `w1` | function | 30523–30746 | `Array.isArray`, `[...new Set(t.f.filter(e=>typeof e=="string"&&Vi(e)))].slice`, `t.f.filter`, `Vi`, `n.includes` |
| `Sm` | arrow_function | 30752–30808 | `Vi`, `sr` |
| `sr` | function | 30809–31083 | `vn`, `Vi`, `fi`, `n.bag.find`, `ki`, `Math.min`, `$m` |
| `T1` | variable | 31818–31846 | — |
| `$1` | arrow_function | 31847–31940 | `ki`, `fi`, `$m` |
| `yi` | variable | 31941–31946 | — |
| `S1` | variable | 31947–31953 | — |
| `wu` | arrow_function | 31954–31989 | `Math.max`, `Math.min` |
| `C1` | variable | 31990–31994 | — |
| `H1` | variable | 31995–32625 | — |
| `L1` | variable | 32626–32662 | — |
| `Cm` | function | 32663–32852 | `a.startsWith` |
| `Hm` | function | 32852–33010 | `Math.max`, `Math.min`, `wu` |
| `Tu` | function | 33010–33198 | `Math.max`, `Hm` |
| `P1` | function | 33198–33388 | `Cm`, `Math.min`, `Math.max` |
| `$u` | arrow_function | 33394–33493 | — |
| `vo` | variable | 33494–33526 | — |
| `xo` | variable | 33527–33562 | — |
| `A1` | variable | 33563–34538 | — |
| `Su` | variable | 34539–34549 | — |
| `R1` | function | 34550–34691 | `Su.get`, `A1.find`, `n.prefix.some`, `a.startsWith`, `Su.set` |
| `N1` | variable | 34697–35105 | — |
| `P3` | arrow_function | 35658–35756 | `ee`, `Jl` |
| `B1` | variable | 35757–35763 | — |
| `_1` | variable | 35764–35770 | — |
| `D1` | variable | 35771–35776 | — |
| `bt` | variable | 40637–40643 | — |
| `Ps` | variable | 40644–40650 | — |
| `I1` | variable | 79714–79757 | — |
| `X` | arrow_function | 81833–81851 | — |
| `Hu` | variable | 81852–81925 | — |
| `O1` | variable | 81926–81947 | — |
| `F` | arrow_function | 81948–81969 | `a.pas.get` |
| `fa` | arrow_function | 81970–81993 | — |
| `Lu` | variable | 81994–82008 | — |
| `un` | function | 82009–82191 | `Lu.get`, `Lu.set` |
| `et` | arrow_function | 82197–82254 | `un` |
| `Pu` | arrow_function | 82255–82297 | — |
| `ir` | arrow_function | 82298–82339 | `Math.log` |
| `yn` | arrow_function | 82340–82365 | — |
| `G1` | variable | 82867–82873 | — |
| `rh` | variable | 82874–82903 | — |
| `Gt` | variable | 82904–82937 | — |
| `uh` | variable | 82938–82943 | — |
| `or` | arrow_function | 82944–82991 | `Gg` |
| `Au` | arrow_function | 82992–83027 | `or` |
| `Ru` | arrow_function | 83028–83063 | `or` |
| `V1` | variable | 83264–83268 | — |
| `E1` | arrow_function | 83269–83310 | `yn` |
| `j1` | class | 83311–148242 | — |
| `Ca` | function | 148242–148375 | `Math.atan2`, `Math.abs`, `Lm` |
| `Lm` | function | 148375–148485 | `Math.atan2`, `Math.round` |
| `W1` | variable | 148491–148497 | — |
| `X1` | variable | 148498–148506 | — |
| `Bu` | variable | 148507–148516 | — |
| `ys` | function | 148517–148648 | `Date.UTC`, `t.getUTCFullYear`, `t.getUTCMonth`, `t.getUTCDate`, `t.getUTCDay` |
| `Q1` | function | 148648–149057 | `Object.create`, `Array.isArray`, `Object.entries`, `Number.isFinite`, `Number.isSafeInteger`, `Math.max` |
| `z1` | variable | 149063–149072 | — |
| `Y1` | function | 149073–149531 | `Number.isFinite`, `ys`, `Object.assign`, `Object.create`, `Number.isSafeInteger`, `Math.max`, `Object.entries`, `Object.hasOwn` |
| `J1` | function | 149531–149684 | `ys`, `Date.now`, `Number.isSafeInteger`, `Math.max` |
| `Z1` | function | 149684–149842 | `Number.isFinite`, `Math.round`, `tk` |
| `tk` | function | 149842–150443 | `Ua`, `kn`, `Object.values`, `ge`, `(t.gear??[]).filter`, `e.has`, `Math.round`, `is`, `zh`, `Math.min`, `Math.max`, `Qh` |
| `A3` | function | 150443–151697 | `ys`, `Date.now`, `a.filter(o=>o.name).map`, `a.filter`, `Ua`, `Z1`, `J1`, `[...n].sort((r,h)=>(o==="level"?h.lv-r.lv\|\|h.xp-r.xp:h[o]-r[o]\|\|h.lv-r.lv)\|\|r.name.localeCompare(h.name,"vi")).slice(0,100).map`, `[...n].sort((r,h)=>(o==="level"?h.lv-r.lv\|\|h.xp-r.xp:h[o]-r[o]\|\|h.lv-r.lv)\|\|r.name.localeCompare(h.name,"vi")).slice`, `[...n].sort`, `r.name.localeCompare`, `a.filter(o=>{var r;return o.name&&(((r=o.fishStats)==null?void 0:r.kg)??0)>0}).map(o=>({name:o.name,cls:Ua(o).classId,lv:o.level,kg:Math.round(o.fishStats.kg*10)/10,n:o.fishStats.n??0,best:o.fishStats.best&&o.fishStats.bestKg?`${o.fishStats.best} ${String(o.fishStats.bestKg).replace(".",",")} cân`:void 0})).sort((o,r)=>r.kg-o.kg\|\|r.n-o.n\|\|o.name.localeCompare(r.name,"vi")).slice(0,100).map` |
| `nk` | function | 151697–151956 | `t.map`, `Array.isArray`, `Ra`, `n.has`, `e.has`, `n.add`, `e.add`, `s.push` |
| `ek` | function | 151956–152298 | `[...a.gear,...a.pendingGear].filter`, `s.some`, `Aa`, `a.gearFits`, `a.pendingGear.push`, `a.gear.push`, `a.note` |
| `ak` | variable | 152304–154810 | — |
| `R3` | variable | 154811–155289 | — |
| `ch` | variable | 155290–155300 | — |
| `os` | arrow_function | 155301–155431 | `a.startsWith` |
| `N3` | arrow_function | 155432–155461 | — |
| `Pm` | arrow_function | 155462–155488 | `ak.find` |
| `Ei` | arrow_function | 155489–155594 | `Date.now`, `os`, `Number.isFinite` |
| `hr` | function | 155595–155709 | `Date.now`, `a.owned.some`, `Ei` |
| `Am` | function | 155709–156387 | `Date.now`, `Array.isArray`, `Pm`, `n.some`, `os`, `Number.isFinite`, `n.push`, `Math.max`, `Number`, `Math.floor`, `hr` |
| `In` | function | 156387–156698 | `a.owned.find`, `os`, `a.owned.push` |
| `sk` | function | 156698–156907 | `Date.now`, `Am`, `In`, `e.claimed.includes` |
| `lh` | function | 156907–157020 | `Date.now`, `a.owned.some`, `Ei` |
| `As` | function | 157020–157095 | `Date.now`, `Pm`, `lh` |
| `ik` | function | 157095–157443 | `Date.now`, `t.startsWith`, `hr`, `a.titles.owned.some`, `Ei`, `a.note` |
| `ok` | variable | 157449–157453 | — |
| `hk` | arrow_function | 157454–157496 | `Math.max`, `Number` |
| `zs` | arrow_function | 157497–157549 | `Math.hypot`, `hk` |
| `Rm` | variable | 157550–157643 | — |
| `rk` | arrow_function | 157644–157687 | — |
| `Nm` | arrow_function | 157688–157738 | `rk`, `zs` |
| `uk` | variable | 157739–157765 | — |
| `ck` | arrow_function | 157766–157905 | `Math.imul`, `n.charCodeAt` |
| `Mo` | function | 157906–158319 | `structuredClone`, `Ra`, `Math.min`, `Math.max`, `Math.trunc`, `jg`, `nm`, `ck`, `_n` |
| `lk` | function | 158319–159617 | `new Date().toISOString`, `structuredClone`, `Math.min`, `Math.max`, `s.filter(g=>g.slot==="weapon").map`, `s.filter`, `Object.entries`, `o`, `Eg.filter`, `s.filter(f=>f.slot===g.id).map`, `s.some`, `Qe` |
| `_u` | function | 159617–162176 | `t.startsWith`, `a.note`, `s`, `Wg.find`, `String`, `e.claimed.includes`, `(r.gear??[]).reduce`, `Ki`, `e.looks.includes`, `ot`, `a.give`, `m` |
| `mk` | variable | 162182–162347 | — |
| `dk` | function | 162348–162505 | `Math.max`, `Math.min`, `Math.floor`, `mk[n].map`, `Fa` |
| `Du` | function | 162505–162744 | `Math.max`, `Math.min`, `Math.floor` |
| `Uu` | variable | 162750–162769 | — |
| `Bm` | variable | 162770–162774 | — |
| `_m` | variable | 162775–162779 | — |
| `Vn` | arrow_function | 162780–162820 | `Math.floor` |
| `rr` | arrow_function | 162821–162846 | `Math.floor` |
| `B3` | arrow_function | 162847–162881 | `Vn` |
| `Fa` | arrow_function | 162882–162930 | `Math.round` |
| `gk` | arrow_function | 162931–162945 | `Ii` |
| `fk` | arrow_function | 162946–163015 | `Math.round`, `Math.max`, `Math.min` |
| `Dm` | function | 163016–163172 | `Math.imul` |
| `Um` | arrow_function | 163178–163219 | — |
| `kk` | function | 163220–163640 | `Dm`, `a.dailies.filter`, `Um`, `h.filter`, `s.includes`, `i.filter`, `s.push`, `Math.floor`, `e`, `o`, `i.filter(h=>(h.kind??0)===0).sort((h,c)=>(c.min??1)-(h.min??1)).slice`, `i.filter(h=>(h.kind??0)===0).sort` |
| `yk` | function | 163640–163814 | `Dm`, `a.weeklies.filter(o=>Um(o,n)).slice`, `a.weeklies.filter`, `Um`, `i.push`, `s.splice`, `Math.floor`, `e` |
| `Ku` | arrow_function | 163820–163907 | `a.keys.some`, `n.endsWith`, `t.startsWith` |
| `mh` | function | 163908–164106 | — |
| `Iu` | function | 164106–164538 | `Vn`, `rr`, `t.goals.some`, `a.dailies.some`, `kk`, `t.goals.map`, `t.wgoals.some`, `a.weeklies.some`, `yk`, `t.wgoals.map` |
| `pk` | arrow_function | 164544–164849 | `a.startsWith` |
| `bk` | function | 164850–165550 | `t.goals.forEach`, `a.dailies.find`, `Ku`, `Math.min`, `s.push`, `t.wgoals.forEach`, `a.weeklies.find`, `n.startsWith`, `n.slice`, `pk` |
| `vk` | arrow_function | 165556–165711 | `a.collection.filter`, `Number.isSafeInteger`, `t.collected.includes` |
| `xk` | arrow_function | 165712–165735 | `String`, `rr`, `Vn` |
| `Fu` | variable | 165736–166561 | — |
| `Mk` | function | 166562–167215 | `mt`, `Number.isInteger` |
| `Km` | function | 167215–175043 | `["forge-buy","forge-transfer","forge-merge","forge-craft","forge-protect","forge-accept","forge-reject","forge-reroll","forge-salvage","forge-salvage-batch","forge-refine","forge-upgrade","upgrade","dismantle"].includes`, `a.note`, `i`, `["forge-transfer","forge-merge","forge-craft","forge-reroll","forge-refine","forge-upgrade","upgrade"].includes`, `Nm`, `ts`, `Math.max`, `Zg.find`, `Number`, `Number.isSafeInteger`, `a.count`, `a.give` |
| `dh` | function | 175043–175525 | `(a.worn instanceof Map?[...a.worn.values()]:Object.values(a.worn)).includes`, `a.worn.values`, `Object.values`, `Ba`, `r0`, `Qe`, `sm`, `mt` |
| `Im` | function | 175525–175837 | `Qe`, `a.forgeLedger.reduce`, `Array.from({length:Math.min(16,a.upgrade??0)},(i,o)=>js(o,a.grade).required).reduce`, `Array.from`, `Math.min`, `js`, `sm`, `Math.floor` |
| `gh` | function | 175837–176159 | `li`, `Ba`, `e.some`, `s.some`, `dh`, `Im` |
| `qu` | function | 176159–176348 | `Im`, `a.give`, `Bn`, `n`, `a.gear.filter` |
| `wk` | variable | 176354–176360 | — |
| `Tk` | variable | 176361–176366 | — |
| `fh` | variable | 176367–177427 | — |
| `$k` | arrow_function | 177428–177482 | — |
| `tn` | variable | 177483–177790 | — |
| `Fm` | function | 177791–178038 | `Math.min`, `Math.max`, `Math.round` |
| `Sk` | arrow_function | 178044–178085 | `Ht.slice(1).includes`, `Ht.slice` |
| `qm` | function | 178086–179287 | `hm`, `ge`, `Object.entries`, `Number.isFinite`, `ym`, `V`, `Sk`, `k`, `Math.min`, `Math.max`, `Qh`, `Math.round` |
| `Ck` | arrow_function | 179293–179408 | `a.skillSlots.filter`, `t.reduce`, `nr`, `gi` |
| `wo` | arrow_function | 179409–179572 | — |
| `pi` | function | 179573–180877 | `kn`, `Fm`, `qm`, `g.map`, `Gm`, `e`, `n.push`, `o`, `Object.fromEntries`, `Object.entries(h.worn).map`, `Object.entries`, `c` |
| `Hk` | arrow_function | 180883–181066 | `[...a.worn.values()].map(t=>a.gear.find(n=>n.uid===t)).filter(t=>!!t).map`, `[...a.worn.values()].map(t=>a.gear.find(n=>n.uid===t)).filter`, `[...a.worn.values()].map`, `a.worn.values`, `a.gear.find` |
| `Lk` | arrow_function | 181067–181198 | `xt.map(t=>{var n;return[t.id,(n=t.bonus)==null?void 0:n.call(t,a,a.kt[t.id])]}).filter`, `xt.map`, `n.call`, `Object.keys` |
| `Pk` | function | 181199–181498 | `V`, `s.find` |
| `Ak` | arrow_function | 181504–181544 | `Pk`, `Hk` |
| `Om` | arrow_function | 181545–181676 | `zh`, `Ak`, `kn`, `Ck`, `Lk` |
| `Rk` | function | 181677–181869 | `Om`, `Math.round`, `Fm`, `qm`, `t.kt.map`, `Gm` |
| `ur` | function | 181869–182647 | `es.includes`, `Qn.filter(l=>!l.wheel&&l.classId===n&&l.level<=t).at`, `Qn.filter`, `Ye.filter(l=>(!l.classId\|\|l.classId===a)&&de[l.rarity]<=t).at`, `Ye.filter`, `Vt`, `tn.upgrade`, `nn.slice`, `tn.gems`, `tn.gemLevel`, `[e==null?void 0:e.id,...(s==null?void 0:s.pieces.map(l=>l.id))??[]].filter(l=>!!l).map`, `[e==null?void 0:e.id,...(s==null?void 0:s.pieces.map(l=>l.id))??[]].filter` |
| `Nk` | function | 182647–182905 | `V`, `tn.ktGemLevel`, `l0[i].slice(0,tn.ktAffixes).map`, `l0[i].slice`, `c0`, `tn.ktEnh` |
| `Bk` | function | 182905–183275 | `pi`, `Om`, `ur`, `t.lines.map`, `Math.round`, `e.reduce`, `e.map`, `$k`, `n.get` |
| `_k` | arrow_function | 183281–183308 | `pi`, `ur` |
| `$e` | variable | 183309–183353 | — |
| `Rs` | variable | 183354–183463 | — |
| `To` | variable | 183468–183475 | — |
| `$o` | variable | 183476–183481 | — |
| `Gm` | function | 183482–183894 | `Object.fromEntries`, `Rs.map`, `$e.map`, `pi`, `ur`, `Rs.reduce`, `Math.max`, `Math.min` |
| `Ou` | arrow_function | 183900–183935 | — |
| `Ys` | class | 183936–184873 | — |
| `Gu` | variable | 184879–184883 | — |
| `Ns` | arrow_function | 184884–184955 | `t.split` |
| `Dk` | variable | 184956–184971 | — |
| `Uk` | variable | 184972–184997 | — |
| `Vm` | arrow_function | 184998–185015 | — |
| `Oe` | arrow_function | 185016–185037 | `Vm` |
| `cr` | arrow_function | 185038–185087 | `Math.round` |
| `Kk` | arrow_function | 185088–185139 | `Math.round`, `Ii` |
| `Ik` | arrow_function | 185140–185208 | `Math.max`, `Math.round`, `cr` |
| `Fk` | class | 185209–190282 | — |
| `qk` | variable | 190288–190374 | — |
| `Ok` | variable | 190375–190448 | — |
| `Vu` | variable | 190449–190507 | — |
| `Gk` | variable | 190508–190585 | — |
| `Vk` | variable | 190586–190901 | — |
| `Eu` | variable | 190902–191251 | — |
| `Em` | function | 191252–191336 | `Gk.has`, `Ok.test` |
| `Ek` | function | 191336–191482 | `a.startsWith`, `Em` |
| `jk` | variable | 191488–191493 | — |
| `jm` | arrow_function | 191494–191520 | `jk.find` |
| `Wk` | variable | 191521–191883 | — |
| `ju` | variable | 191884–191890 | — |
| `Wu` | variable | 191891–191898 | — |
| `Xk` | function | 191899–192232 | `jm`, `Math.max`, `Math.min`, `Math.floor` |
| `Xu` | variable | 192238–192256 | — |
| `Qu` | variable | 192257–192274 | — |
| `qa` | variable | 192279–192299 | — |
| `Js` | variable | 192306–192316 | — |
| `zu` | arrow_function | 192317–192415 | `Number`, `Number.isFinite`, `Math.round` |
| `Qk` | function | 192416–192761 | `Gn.flatMap`, `s.skills.map`, `Object.entries`, `zu`, `t.has` |
| `zk` | function | 192761–192900 | `Qk`, `Js.has`, `Js.set`, `Js.get` |
| `Yk` | arrow_function | 192906–192915 | — |
| `_3` | arrow_function | 192916–192940 | — |
| `D3` | arrow_function | 192941–192965 | `Js.get` |
| `Wm` | variable | 192966–193495 | — |
| `So` | variable | 193496–193505 | — |
| `Jk` | variable | 193506–193516 | — |
| `Yu` | variable | 193517–193525 | — |
| `Xm` | function | 193526–193735 | `Math.ceil`, `Math.floor` |
| `Zk` | arrow_function | 193741–193780 | `Xm` |
| `ty` | variable | 193781–193873 | — |
| `ny` | arrow_function | 193874–194050 | — |
| `ey` | arrow_function | 194051–194092 | `Math.log` |
| `ay` | arrow_function | 194093–194168 | `Math.max`, `Math.min`, `ny`, `ey` |
| `sy` | arrow_function | 194169–194266 | `Math.round`, `xn`, `ay` |
| `iy` | arrow_function | 194267–194279 | — |
| `oy` | arrow_function | 194280–194318 | `Math.round`, `Je` |
| `Co` | variable | 194319–194326 | — |
| `Ju` | variable | 194327–194334 | — |
| `bi` | function | 194335–194628 | `Number.isFinite`, `t.set`, `t.get`, `[...t.values()].reduce`, `t.values`, `[...t].map(([e,s])=>({name:e,damage:s,percent:Math.round(s/n*1e4)/100})).sort`, `[...t].map`, `Math.round`, `e.name.localeCompare` |
| `vi` | arrow_function | 194634–194710 | `a.slice(0,3).map((t,n)=>`${n+1}. ${t.name} ${t.percent}%`).join`, `a.slice(0,3).map`, `a.slice` |
| `hy` | arrow_function | 194711–194935 | `Math.max`, `Math.floor`, `String(Math.floor(a/60)%60).padStart`, `String`, `String(a%60).padStart`, `String(Math.floor(a/60)).padStart` |
| `ry` | arrow_function | 194936–195040 | `Math.atan2`, `Math.round` |
| `ka` | arrow_function | 195041–195072 | `Math.random` |
| `kh` | arrow_function | 195073–195110 | `Math.max`, `Math.min` |
| `uy` | arrow_function | 195111–195154 | — |
| `Zu` | variable | 195155–195162 | — |
| `cy` | arrow_function | 195163–195199 | `kh` |
| `ly` | variable | 195200–195298 | — |
| `tc` | arrow_function | 195299–195361 | `(a<10?a.toFixed(2):a.toFixed(1)).replace`, `a.toFixed` |
| `my` | class | 195362–203869 | — |
| `yh` | variable | 203875–203880 | — |
| `ps` | function | 203881–203984 | `yh.some`, `yh.push` |
| `Qm` | arrow_function | 203990–204016 | `yh.find` |
| `Ho` | variable | 204017–204023 | — |
| `aa` | variable | 205533–205538 | — |
| `zt` | function | 205539–205599 | `aa.some`, `aa.push` |
| `zm` | variable | 206520–206718 | — |
| `dy` | arrow_function | 206719–206740 | `Date.now` |
| `Zs` | function | 206741–206803 | `Vn`, `dy` |
| `ph` | function | 206803–206927 | `Math.min`, `Math.floor` |
| `$t` | function | 206927–207346 | `vn`, `aa.find`, `Zs`, `ph`, `Math.min`, `a.note`, `zm.findIndex`, `a.toast` |
| `gy` | function | 207346–207470 | `e.some`, `i.endsWith`, `t.startsWith`, `$t` |
| `pn` | variable | 208431–208436 | — |
| `fy` | variable | 208437–208513 | — |
| `Ym` | variable | 208514–208595 | — |
| `ky` | variable | 208596–208602 | — |
| `yy` | variable | 208603–208682 | — |
| `py` | variable | 208683–208689 | — |
| `nc` | variable | 208690–208694 | — |
| `by` | variable | 208695–208700 | — |
| `vy` | variable | 208701–208706 | — |
| `ec` | variable | 208707–208713 | — |
| `xy` | variable | 208714–208720 | — |
| `My` | variable | 208721–208726 | — |
| `wy` | variable | 208727–208733 | — |
| `Ty` | variable | 208734–208738 | — |
| `Jm` | variable | 208739–208743 | — |
| `$y` | variable | 208744–208749 | — |
| `ac` | variable | 208750–208756 | — |
| `sc` | variable | 208757–208761 | — |
| `Sy` | variable | 208762–208766 | — |
| `Cy` | variable | 208767–208774 | — |
| `Hy` | variable | 208775–208781 | — |
| `Ly` | variable | 208782–208788 | — |
| `Py` | variable | 208789–208795 | — |
| `Ay` | variable | 208796–208800 | — |
| `Ry` | variable | 208801–208805 | — |
| `Ny` | variable | 208806–208812 | — |
| `ic` | variable | 208813–208819 | — |
| `By` | variable | 208820–208824 | — |
| `_y` | variable | 208825–208846 | — |
| `Dy` | variable | 208847–208871 | — |
| `Uy` | variable | 208872–208880 | — |
| `Ky` | variable | 208881–208889 | — |
| `oc` | variable | 208890–208904 | — |
| `bs` | arrow_function | 208905–208960 | `oc.get`, `oc.set` |
| `Zn` | function | 208961–209913 | `Math.max`, `Math.round`, `xn`, `t.collision.nearestOpen`, `a.newId`, `Wt`, `Je`, `wt`, `t.monsters.push` |
| `ae` | function | 209913–209989 | `a.monsters.indexOf`, `a.monsters.splice` |
| `lr` | function | 209989–210233 | `e[0].moves.map`, `Math.max`, `bs(a).add`, `bs` |
| `U3` | arrow_function | 210239–210276 | `[...bs(a)].find`, `bs` |
| `bh` | function | 210277–210364 | `[...a.room.players].filter`, `Math.hypot` |
| `hs` | function | 210364–210469 | `a.room.events.push` |
| `mr` | variable | 210473–210477 | — |
| `cn` | function | 210478–210695 | `a.newId`, `Math.max`, `t.strikes.push`, `t.room.slams.push` |
| `Lo` | arrow_function | 210701–210775 | `Math.hypot` |
| `hc` | function | 210776–210986 | `a.collision.move`, `Math.hypot`, `o.push` |
| `Iy` | function | 210986–213975 | `a.newId`, `[...s.players].filter(r=>!r.dead&&Math.hypot(r.x-e.x,r.y-e.y)<vy).sort`, `[...s.players].filter`, `Math.hypot`, `hs`, `cn`, `Math.random`, `Math.cos`, `Math.sin`, `i.slice`, `Lo`, `Math.atan2` |
| `Fy` | function | 213975–214366 | `Et`, `Math.max`, `Math.min`, `Math.round`, `a.combat.absorb`, `a.combat.incomingScale`, `i.events.push`, `a.die` |
| `qy` | function | 214366–215424 | `e.slams.filter`, `e.events.push`, `t.castHits.get`, `t.castHits.set`, `Math.hypot`, `i.has`, `i.add`, `Fy`, `a.combat.mobStatuses`, `o.note`, `Math.round`, `Math.max` |
| `Oy` | function | 215424–215678 | `ae`, `t.strikes.map`, `t.room.slams.filter`, `n.has`, `bs(a).delete`, `bs` |
| `Gy` | function | 215678–217151 | `bs`, `Math.hypot`, `Math.min`, `i.collision.move`, `n.strikes.filter`, `qy`, `n.castHits.keys`, `n.strikes.some`, `n.castHits.delete`, `i.monsters.includes`, `Oy`, `n.vents.map` |
| `Vy` | arrow_function | 217157–217173 | `bs` |
| `rc` | variable | 217174–217188 | — |
| `Ey` | function | 217189–217587 | `rc.get`, `rc.set`, `(((e=a.data.quests.kt)==null?void 0:e.campBosses)??[]).map`, `Vy(a).map`, `Vy`, `a.rooms.values`, `n.has`, `t.get`, `lr` |
| `E` | variable | 217593–217958 | — |
| `Zm` | arrow_function | 217959–218055 | `Object.create` |
| `jn` | arrow_function | 218056–218118 | `Math.max`, `Math.min`, `Math.floor`, `Number` |
| `jy` | function | 218119–218600 | `Zm`, `jn`, `Math.min`, `t.day.slice`, `Object.entries` |
| `Rt` | arrow_function | 218606–218631 | — |
| `td` | arrow_function | 218632–218685 | `Math.min` |
| `Wy` | arrow_function | 218686–218749 | `Date.now`, `new Date(a+7*36e5).toISOString().slice`, `new Date(a+7*36e5).toISOString` |
| `Xy` | function | 218750–218962 | `Date.now`, `Wy`, `Math.max`, `Math.min` |
| `xi` | function | 218962–219041 | `Math.max`, `Math.min` |
| `Qy` | function | 219041–219254 | `Math.abs`, `xi` |
| `zy` | function | 219254–219452 | `Math.max`, `xi` |
| `Yy` | function | 219452–219659 | `a.dsRetaliate.get`, `Rt` |
| `Jy` | function | 219659–220364 | `Date.now`, `r`, `Rt`, `ui`, `Math.abs`, `Object.hasOwn`, `Math.ceil`, `Object.keys` |
| `Zy` | variable | 220370–220387 | — |
| `Oa` | variable | 220388–220402 | — |
| `ji` | variable | 220403–220417 | — |
| `Wi` | function | 220418–220539 | `a.data.maps.get`, `a.createRealmRoom`, `ji.set` |
| `dr` | function | 220539–220628 | `a.rooms.get`, `ji.has`, `a.rooms.delete` |
| `Kt` | arrow_function | 220634–220658 | `ji.get` |
| `gr` | arrow_function | 220659–220681 | `Kt` |
| `fr` | function | 220682–221092 | `Oa.has`, `a.data.maps.get`, `Oa.set`, `ji.has`, `Oa.get`, `a.placeInRoom`, `t.events.push` |
| `uc` | function | 221092–221230 | `e.collision.nearestOpen` |
| `tp` | function | 221230–221332 | `wt`, `t.applyLevel` |
| `rs` | function | 221332–221538 | `Oa.get`, `Oa.delete`, `wt`, `t.applyLevel`, `a.players.get`, `a.travel` |
| `np` | variable | 221650–221656 | — |
| `Po` | variable | 221657–221671 | — |
| `nd` | function | 222137–222446 | `Jt.has`, `Kt`, `Math.min`, `Math.ceil`, `vt`, `a.note`, `e.toLocaleString` |
| `ep` | variable | 222452–222457 | — |
| `cc` | variable | 222458–222462 | — |
| `us` | variable | 222463–222477 | — |
| `K3` | variable | 222478–222482 | — |
| `I3` | variable | 222483–222488 | — |
| `F3` | variable | 222489–222494 | — |
| `ap` | arrow_function | 222495–222503 | — |
| `sp` | arrow_function | 222504–222550 | `ap` |
| `ip` | arrow_function | 222551–222576 | — |
| `q3` | function | 222577–222721 | `Math.max`, `Math.ceil`, `Math.floor` |
| `ed` | variable | 222727–223016 | — |
| `O3` | arrow_function | 223017–223038 | `ip` |
| `G3` | variable | 223039–223043 | — |
| `op` | variable | 223044–223101 | — |
| `hp` | function | 223102–223294 | `op.has`, `t.startsWith` |
| `rp` | function | 223294–223333 | `hp` |
| `lc` | arrow_function | 223339–223360 | `nd` |
| `Bs` | arrow_function | 223361–223425 | `Number.isFinite`, `Math.max`, `Math.min`, `Number` |
| `up` | function | 223426–223456 | — |
| `cp` | function | 223456–223482 | — |
| `mc` | function | 223482–223513 | — |
| `kr` | variable | 223852–223860 | — |
| `ad` | variable | 223861–223866 | — |
| `zl` | variable | 223871–223873 | — |
| `Ao` | variable | 223880–223926 | — |
| `lp` | arrow_function | 223927–224011 | `Number`, `Number.isFinite`, `Date.parse` |
| `mp` | variable | 224016–224148 | — |
| `sd` | arrow_function | 224155–224164 | — |
| `id` | arrow_function | 224165–224221 | `Date.now`, `Math.max`, `Math.floor`, `sd` |
| `dp` | arrow_function | 224226–224305 | `id`, `Math.min`, `Math.floor` |
| `vs` | arrow_function | 224312–224336 | `Date.now`, `dp` |
| `od` | arrow_function | 224337–224378 | `Math.min`, `Math.max` |
| `sa` | arrow_function | 224379–224412 | `Date.now`, `vs`, `od` |
| `gp` | arrow_function | 224413–224433 | `od` |
| `fp` | function | 224434–224499 | `sa` |
| `kp` | arrow_function | 224505–224624 | `e.npcs.find`, `Math.hypot` |
| `dc` | variable | 224625–224639 | — |
| `gc` | variable | 224640–224654 | — |
| `yp` | arrow_function | 224655–224710 | `dc.get`, `dc.set` |
| `pp` | function | 224711–224979 | `a.book.active().some`, `a.book.active`, `i.goals.some`, `a.book.progress`, `s.some` |
| `bp` | function | 224979–225219 | `Zn`, `lr`, `a.announce` |
| `fc` | function | 225219–225285 | `a.get`, `ae`, `a.delete` |
| `vp` | function | 225285–225985 | `gc.get`, `gc.set`, `Ey`, `yp`, `t.get`, `fc`, `[...i.room.players].some`, `Math.hypot`, `a.rooms.get`, `a.data.quests.landmarks.find`, `[...o.players].find`, `pp` |
| `xs` | arrow_function | 227100–227147 | `Date.now`, `Math.floor` |
| `kc` | arrow_function | 227148–227190 | `Date.now`, `Math.floor`, `xs` |
| `Ne` | variable | 227191–229004 | — |
| `xp` | function | 229005–229127 | `Math.min`, `V`, `a.book.lock` |
| `yr` | arrow_function | 229133–229193 | `Ne.filter`, `V`, `a.book.lock` |
| `Mi` | arrow_function | 229194–229237 | `Math.floor`, `Math.random` |
| `Ge` | arrow_function | 229238–229273 | `Math.round`, `cm` |
| `se` | function | 229274–229328 | `a.gainExp` |
| `bn` | variable | 229334–229411 | — |
| `ie` | variable | 229412–229432 | — |
| `vh` | variable | 229433–229437 | — |
| `Mp` | variable | 229438–229444 | — |
| `Ve` | variable | 229445–229509 | — |
| `wp` | variable | 229510–229999 | — |
| `Tp` | arrow_function | 230000–230036 | — |
| `yc` | variable | 230041–230045 | — |
| `$p` | arrow_function | 230052–230083 | `bn.every`, `a.count` |
| `Fn` | function | 230084–230603 | `sa`, `xs`, `bn.filter`, `t.count`, `Math.random`, `Math.floor`, `t.give`, `t.toast`, `a.record`, `bn.indexOf`, `a.announce` |
| `pc` | arrow_function | 230609–230630 | `Math.random` |
| `bc` | variable | 230631–230645 | — |
| `vc` | variable | 230646–230660 | — |
| `Sp` | function | 230661–230854 | `vc.get`, `sa`, `vc.set`, `a.players.values`, `t.count`, `t.give`, `Fn` |
| `wi` | variable | 233123–233247 | — |
| `ia` | variable | 233248–233260 | — |
| `Un` | variable | 233261–233266 | — |
| `pr` | variable | 233267–233870 | — |
| `Ti` | arrow_function | 233871–233897 | `pr.find` |
| `Cp` | function | 233898–233977 | `Math.min` |
| `Hp` | function | 233977–234282 | `Math.round`, `Math.pow`, `Math.min`, `Math.max`, `Math.ceil`, `br.find`, `i.push` |
| `Lp` | variable | 234288–234293 | — |
| `Pp` | arrow_function | 234294–234330 | `Math.max`, `Math.ceil` |
| `Ap` | variable | 234331–235031 | — |
| `br` | variable | 235032–235139 | — |
| `Ms` | arrow_function | 235140–235166 | `br.find` |
| `vr` | arrow_function | 235167–235201 | `Math.min`, `Math.max` |
| `Rp` | arrow_function | 235202–235223 | `Math.floor` |
| `Np` | arrow_function | 235224–235257 | `Math.max`, `Math.floor` |
| `xh` | variable | 235258–235263 | — |
| `Bp` | variable | 235264–235268 | — |
| `xc` | variable | 235269–235274 | — |
| `Mc` | variable | 235275–235279 | — |
| `_p` | arrow_function | 235280–235293 | — |
| `Mh` | variable | 235294–235299 | — |
| `Dp` | arrow_function | 235300–235364 | `Math.round`, `Math.max`, `Math.min` |
| `hd` | arrow_function | 235365–235376 | — |
| `rd` | arrow_function | 235377–235388 | — |
| `wc` | arrow_function | 235389–235433 | — |
| `Up` | arrow_function | 235434–235450 | — |
| `Kp` | arrow_function | 235451–235474 | `Math.floor` |
| `Tc` | arrow_function | 235475–235484 | — |
| `$c` | variable | 235485–235490 | — |
| `Ip` | arrow_function | 235491–235513 | — |
| `Fp` | arrow_function | 235514–235525 | — |
| `wh` | variable | 235526–235874 | — |
| `qp` | arrow_function | 235875–235951 | `Math.round`, `Math.pow` |
| `te` | variable | 235952–236448 | — |
| `Sc` | arrow_function | 236449–236472 | `Math.floor` |
| `Op` | arrow_function | 236473–236482 | — |
| `Gp` | arrow_function | 236483–236498 | — |
| `Cc` | variable | 236499–236503 | — |
| `Hc` | arrow_function | 236504–236514 | — |
| `Vp` | arrow_function | 236515–236591 | `br.find` |
| `xr` | variable | 236592–237073 | — |
| `ud` | arrow_function | 237074–237100 | `xr.find` |
| `Ep` | arrow_function | 237101–237114 | — |
| `Be` | variable | 237268–237281 | — |
| `cd` | variable | 237282–237300 | — |
| `st` | arrow_function | 237536–237590 | `Number.isFinite` |
| `jp` | function | 237591–237827 | `Array(vr(1)).fill`, `Array`, `vr` |
| `Wp` | function | 237827–239258 | `jp`, `Math.max`, `Math.min`, `Math.floor`, `st`, `Ti`, `vr`, `Array.from`, `Ms`, `Object.fromEntries`, `Object.entries(e.cp??{}).filter(([o])=>wh.some(r=>r.id===o)).map`, `Object.entries(e.cp??{}).filter` |
| `$i` | arrow_function | 239264–239292 | — |
| `Xp` | class | 239293–241088 | — |
| `Lc` | variable | 241094–241108 | — |
| `qn` | function | 241109–241175 | `Lc.get`, `Lc.set` |
| `ws` | arrow_function | 241181–241195 | — |
| `ld` | arrow_function | 241196–241212 | `V` |
| `ti` | arrow_function | 241213–241256 | `Math.floor(a).toLocaleString`, `Math.floor` |
| `_e` | arrow_function | 241257–241405 | `Math.max`, `Math.ceil`, `Math.floor` |
| `Pc` | arrow_function | 241406–241475 | `a.count`, `t.every` |
| `Ac` | arrow_function | 241476–241548 | `a.give` |
| `Rc` | arrow_function | 241549–241645 | `[t?`${ti(t)} linh thạch`:"",...a.map(([n,e])=>`${e} ${n}`)].filter(Boolean).join`, `[t?`${ti(t)} linh thạch`:"",...a.map(([n,e])=>`${e} ${n}`)].filter`, `ti`, `a.map` |
| `Mr` | function | 241646–241925 | `ws`, `qn`, `Math.max`, `Math.min`, `i.call`, `e.pub.set`, `ld`, `pr.map`, `n.pl.map`, `a.epoch` |
| `Ro` | function | 241925–242644 | `ws`, `a.epoch`, `Ti`, `Math.max`, `t.note`, `a.record`, `vr`, `n.pl.push`, `Vn`, `t.count`, `t.give`, `n.dec.includes` |
| `Qp` | function | 242644–243257 | `Th(a).find`, `Th`, `Math.min`, `Math.floor`, `t.give`, `$t`, `rd`, `i.inputs.map`, `t.count`, `t.note`, `hd` |
| `zp` | function | 243257–243558 | `ws`, `qn`, `o.readyAt`, `$i`, `o.crops.get`, `Math.max`, `Ms`, `o.crops.delete`, `t.give` |
| `Nc` | variable | 243564–243578 | — |
| `No` | arrow_function | 243579–243646 | `a.dropPet` |
| `Yp` | arrow_function | 243647–243751 | `Math.atan2`, `Math.round` |
| `Jp` | function | 243752–244695 | `Nc.get`, `Nc.set`, `a.players.values`, `n.set.has`, `n.set.set`, `te.find`, `a.players.has`, `No`, `n.set.delete`, `a.spawnPet`, `Math.hypot`, `Math.min` |
| `Zp` | function | 251914–253635 | `ws`, `qn`, `a.epoch`, `o.pub.get`, `Number.isInteger`, `t.note`, `Ms`, `$i`, `o.mark`, `o.readyAt`, `[...a.players.values()].find`, `a.players.values` |
| `Bc` | variable | 253641–253655 | — |
| `Th` | function | 253656–253917 | `Bc.get`, `(n.items??[]).filter(s=>s.category==="Đan dược").map`, `(n.items??[]).filter`, `(n.recipes??[]).filter`, `e.has`, `s.inputs.some`, `Bc.set` |
| `ya` | function | 253917–254107 | `[t,n,e,s,i].every`, `a.blocked`, `Math.hypot`, `a.cast` |
| `tb` | function | 254107–256514 | `ya`, `Math.max`, `Math.min`, `Math.ceil`, `Math.floor`, `new Int8Array(u*m).fill`, `a.blocked`, `g`, `d`, `p`, `l`, `Math.hypot` |
| `_c` | arrow_function | 256520–256611 | `$1` |
| `St` | variable | 256612–256907 | — |
| `nb` | variable | 256908–256912 | — |
| `md` | variable | 256913–256917 | — |
| `ni` | variable | 256918–256922 | — |
| `ye` | variable | 256923–256927 | — |
| `dd` | variable | 256928–256932 | — |
| `jt` | variable | 256933–261747 | — |
| `Ha` | variable | 261748–261766 | — |
| `pa` | variable | 261767–261816 | — |
| `wr` | variable | 261817–261966 | — |
| `J` | variable | 261967–262449 | — |
| `Ga` | variable | 262450–262598 | — |
| `gd` | arrow_function | 262599–262627 | — |
| `oa` | arrow_function | 262628–262654 | — |
| `fd` | variable | 262655–262666 | — |
| `eb` | variable | 262667–262671 | — |
| `kd` | variable | 262672–262677 | — |
| `ab` | function | 262710–262849 | `V`, `Math.max`, `Math.floor`, `e`, `Math.min` |
| `cs` | arrow_function | 262855–262868 | `ab` |
| `Tr` | variable | 262869–262874 | — |
| `ls` | arrow_function | 262875–262897 | — |
| `sb` | arrow_function | 262898–262924 | — |
| `pe` | arrow_function | 262925–262967 | `Math.floor`, `sb` |
| `oe` | arrow_function | 262968–263003 | `Math.round`, `vt`, `pe` |
| `ib` | function | 263004–263113 | `oa` |
| `Dc` | variable | 263119–263133 | — |
| `Va` | function | 263134–263889 | `ib`, `JSON.stringify`, `kt.map(d=>{const f=t[d];return f?`${f.u}${f.q}${f.g}${f.m.join("")}${f.a.map(l=>l.k+l.t).join("")}${f.c??""}`:""}).join`, `kt.map`, `f.m.join`, `f.a.map(l=>l.k+l.t).join`, `f.a.map`, `Dc.get`, `hm`, `ge`, `pe`, `ob` |
| `Si` | arrow_function | 263895–263909 | `Va` |
| `_s` | variable | 263914–263921 | — |
| `ob` | function | 263922–264486 | `Object.fromEntries`, `Ha.map`, `Array.from`, `oa`, `Va`, `o.reduce`, `Ha.forEach`, `Math.max`, `Math.min` |
| `$h` | function | 264486–264567 | `a.list.find`, `Si` |
| `hb` | arrow_function | 264573–264620 | `$h` |
| `rb` | variable | 264621–264637 | — |
| `ub` | variable | 264638–264650 | — |
| `cb` | function | 264651–264767 | `ls`, `Math.min` |
| `De` | arrow_function | 264773–264825 | `Math.min`, `Math.floor` |
| `Uc` | variable | 264826–264836 | — |
| `yd` | function | 264837–265122 | `Uc.get`, `De`, `oa`, `Si`, `Uc.set` |
| `Sh` | arrow_function | 265128–265177 | `Math.min`, `V` |
| `Kc` | variable | 265178–265188 | — |
| `lb` | function | 265189–265350 | `Kc.get`, `De`, `Math.round`, `_k`, `pe`, `yd`, `Kc.set` |
| `mb` | arrow_function | 265356–265392 | `Math.round`, `hb` |
| `V3` | arrow_function | 265393–265443 | `ys`, `Date.now` |
| `pd` | arrow_function | 265444–265505 | `a.list.find` |
| `bd` | function | 265506–265637 | `pd`, `Ga.guard.chance`, `ls`, `Ga.dan.speed` |
| `ba` | arrow_function | 265696–265729 | `Mr` |
| `Ch` | arrow_function | 265730–265838 | `t`, `a.reduce` |
| `db` | variable | 265839–265844 | — |
| `gb` | arrow_function | 265845–265888 | `Math.max`, `Math.ceil`, `vt` |
| `fb` | arrow_function | 265889–265944 | — |
| `Ic` | arrow_function | 265945–265962 | — |
| `kb` | variable | 265963–265985 | — |
| `yb` | variable | 265986–266007 | — |
| `vd` | variable | 266008–266013 | — |
| `Fc` | variable | 266014–266032 | — |
| `xd` | arrow_function | 266033–266132 | `Math.floor` |
| `pb` | function | 266133–266318 | `xd`, `n`, `e.some`, `e.push` |
| `bb` | variable | 266324–266542 | — |
| `vb` | arrow_function | 266543–266575 | — |
| `xb` | variable | 266576–266582 | — |
| `Mb` | function | 266583–267270 | `e.set`, `e.get`, `s`, `Math.round`, `vb`, `Math.floor`, `n`, `h.push`, `Ch`, `oe` |
| `wb` | variable | 267276–267365 | — |
| `Tb` | variable | 267366–267508 | — |
| `Ds` | arrow_function | 267509–267555 | `Math.floor`, `t` |
| `Md` | arrow_function | 267556–267694 | — |
| `ct` | arrow_function | 267695–267796 | `Math.floor`, `Number`, `Number.isFinite`, `Math.max`, `Math.min` |
| `$b` | function | 267797–269750 | `Md`, `Array.isArray`, `n.list.slice`, `e.has`, `ct`, `Math.min`, `Sb`, `oa`, `s.has`, `s.add`, `fd.includes`, `Number.isFinite` |
| `Sb` | function | 269750–269825 | `x0` |
| `Ci` | arrow_function | 269831–269872 | — |
| `wd` | arrow_function | 269873–270060 | `Ci` |
| `Xi` | arrow_function | 270061–270145 | `Md`, `wd` |
| `Hi` | arrow_function | 270146–270196 | `new Date(a+7*36e5).toISOString().slice`, `new Date(a+7*36e5).toISOString` |
| `Cb` | function | 270197–270398 | `Ds`, `Date.now` |
| `he` | function | 270398–270897 | `Xi`, `ct`, `cs`, `Cb`, `i.list.push`, `a.applyLevel`, `h.record`, `a.note`, `i.wait.push` |
| `Q` | arrow_function | 270903–270927 | `a.toast` |
| `Hb` | function | 270928–270986 | `Xi(a).save.list.find`, `Xi` |
| `Us` | function | 270986–271076 | — |
| `qc` | function | 271076–271260 | `oe`, `pe`, `Math.min` |
| `Td` | variable | 271266–271302 | — |
| `Lb` | function | 271501–272432 | `Xi`, `Date.now`, `Math.max`, `cs`, `Q`, `Hi`, `xd`, `e`, `t.count`, `t.give`, `pb`, `he` |
| `Pb` | arrow_function | 272438–272463 | `w0`, `T0` |
| `Bo` | function | 272464–272901 | `Nn`, `mm`, `Math.min`, `p0`, `V`, `Pb`, `Zh`, `a.give`, `a.note`, `as`, `o.bag.push`, `b0` |
| `Oc` | function | 272901–273511 | `Zo`, `Q`, `v0`, `a.count`, `o.silver.toLocaleString`, `a.give`, `Math.random`, `Math.min`, `lm`, `Math.max` |
| `Ab` | function | 273511–281599 | `Xi`, `Date.now`, `Hb`, `Us`, `Q`, `ba`, `t.toast`, `Number`, `fd.includes`, `Math.ceil`, `Mb`, `t.give` |
| `Li` | variable | 281605–281619 | — |
| `Gc` | variable | 281620–281626 | — |
| `Vc` | variable | 281627–281633 | — |
| `Ec` | variable | 281634–281639 | — |
| `Ks` | variable | 281640–281644 | — |
| `Is` | arrow_function | 281645–281749 | `Math.atan2`, `Math.round` |
| `jc` | arrow_function | 281750–281824 | `Math.min`, `Math.max` |
| `ei` | function | 281825–281975 | `a.collision.blocked`, `a.collision.nearestOpen` |
| `Rb` | variable | 281981–281986 | — |
| `Nb` | variable | 281987–281992 | — |
| `Wc` | variable | 281997–282002 | — |
| `Fs` | function | 282003–282909 | `u.blocked`, `ei`, `Math.hypot`, `Math.min`, `u.move`, `tb`, `e.pts.shift` |
| `Le` | function | 282909–283153 | `a.dropPet`, `Ci` |
| `Bb` | function | 283153–288258 | `a.players.has`, `Le`, `i.list.find`, `Jt.has`, `a.spawnPet`, `_c`, `pe`, `ei`, `Va`, `Math.max`, `Math.min`, `t.note` |
| `Xc` | function | 288258–288521 | `h`, `Math.abs`, `Math.hypot`, `o`, `a.dealMonster`, `$d` |
| `$d` | function | 288521–289120 | `t.st.dots.find`, `Math.max`, `t.st.dots.push`, `At`, `Math.min` |
| `Qc` | function | 289120–289367 | `Math.round`, `Math.max`, `Math.min` |
| `_b` | function | 289367–289704 | `Li.get`, `Li.set`, `a.players.values`, `n.set.add`, `Date.now`, `Bb`, `Le`, `n.set.delete` |
| `Hh` | variable | 289710–289720 | — |
| `Lh` | variable | 289721–289735 | — |
| `Db` | variable | 289969–290724 | — |
| `Qt` | variable | 290738–290746 | — |
| `Ub` | variable | 290747–290754 | — |
| `Kb` | variable | 290755–290824 | — |
| `Ib` | variable | 290825–290888 | — |
| `Fb` | arrow_function | 290889–290920 | `Kb.filter` |
| `$r` | function | 290921–291283 | `Math.max`, `Math.min`, `Math.floor`, `n.push` |
| `ms` | arrow_function | 291289–291315 | `Fb` |
| `Sr` | arrow_function | 291316–291331 | `$r`, `ms` |
| `Ea` | variable | 291332–291488 | — |
| `Sd` | variable | 291489–291495 | — |
| `zc` | variable | 291496–291502 | — |
| `Cd` | variable | 291503–291562 | — |
| `qb` | variable | 291563–291568 | — |
| `Ob` | variable | 291569–291574 | — |
| `Hd` | variable | 291575–291580 | — |
| `Yc` | variable | 291581–291586 | — |
| `_o` | variable | 291587–291619 | — |
| `Jc` | variable | 291620–291644 | — |
| `Zc` | variable | 291645–291659 | — |
| `tl` | function | 291660–292117 | — |
| `Gb` | arrow_function | 292123–292161 | `Math.max`, `Math.floor` |
| `Ld` | variable | 292162–292167 | — |
| `ai` | variable | 292168–292222 | — |
| `Vb` | arrow_function | 292223–292237 | — |
| `Eb` | function | 292238–292463 | `Math.floor` |
| `nl` | variable | 292469–292487 | — |
| `jb` | variable | 292488–292493 | — |
| `Ue` | variable | 292494–293100 | — |
| `Wb` | function | 293101–293271 | `Math.floor`, `Math.max`, `Math.min` |
| `E3` | arrow_function | 293277–293324 | `Ue.map` |
| `Xb` | variable | 293325–293346 | — |
| `Qb` | variable | 293347–293375 | — |
| `zb` | function | 293376–293949 | `V`, `he`, `Xt`, `ze`, `a.give` |
| `j3` | variable | 293955–294771 | — |
| `Ee` | variable | 295144–295437 | — |
| `Pd` | function | 295438–295713 | — |
| `va` | arrow_function | 295719–295781 | `Array.isArray`, `a.filter`, `Number.isSafeInteger` |
| `Dt` | arrow_function | 295782–295824 | `Number.isFinite`, `Number` |
| `Yb` | function | 295825–297655 | `Pd`, `Object.keys`, `Dt`, `va`, `Math.max`, `Object.entries`, `Number.isFinite`, `Array.isArray`, `n.awards.filter(f=>f&&typeof f.id=="string").slice`, `n.awards.filter`, `Number.isSafeInteger`, `n.denbuInfo.filter(f=>typeof f=="string").slice` |
| `Ad` | variable | 297661–297666 | — |
| `Cr` | arrow_function | 297667–297713 | `Pd` |
| `Jb` | arrow_function | 297714–297775 | `Math.min`, `a.count`, `Math.max` |
| `Zb` | arrow_function | 297776–297796 | `a.freeCount` |
| `Xt` | function | 297797–297891 | `a.give` |
| `ln` | function | 297891–298015 | `Number.isSafeInteger`, `a.takeFree`, `a.count`, `a.give` |
| `Qi` | arrow_function | 298021–298040 | `Vn`, `a.epoch` |
| `Cn` | arrow_function | 298041–298079 | — |
| `Rd` | function | 298080–298153 | — |
| `tv` | variable | 298159–298165 | — |
| `nv` | function | 298166–298272 | `Date.now` |
| `Do` | function | 298272–298424 | `Qi`, `Object.keys(Ea).some`, `Object.keys`, `Rd` |
| `ev` | function | 298424–298830 | `a.give`, `Xt`, `In`, `Date.now`, `Cr`, `n.cos.includes`, `n.cos.push`, `tr`, `a.applyLevel` |
| `Nd` | function | 298830–299962 | `V`, `Nn`, `t.applyLevel`, `t.note`, `Qi`, `Gb`, `i.claimed.filter`, `i.wclaimed.filter`, `Math.min`, `Date.now`, `ms`, `t.toast` |
| `av` | function | 299962–300618 | `Nn`, `a.note`, `V`, `Ki`, `ln`, `ze`, `Cn` |
| `sv` | function | 300618–301078 | `ns.includes`, `a.note`, `V`, `ln`, `Yh`, `Jh`, `a.give`, `Cn` |
| `iv` | function | 301078–305715 | `Cr`, `Qi`, `t.note`, `r`, `Nd`, `ms`, `$r`, `t.give`, `Xt`, `$t`, `ln`, `Cn` |
| `ov` | function | 305715–306414 | `t.note`, `V`, `i`, `Qi`, `rr`, `Math.max`, `ln`, `t.give` |
| `Uo` | variable | 306418–306422 | — |
| `el` | variable | 307038–307224 | — |
| `Ph` | variable | 307225–307236 | — |
| `al` | variable | 307237–307241 | — |
| `Ah` | variable | 307242–307246 | — |
| `hv` | variable | 307247–307251 | — |
| `rv` | variable | 307252–307269 | — |
| `an` | variable | 307270–307287 | — |
| `uv` | variable | 307288–307293 | — |
| `cv` | variable | 307294–307326 | — |
| `Bd` | variable | 307327–307336 | — |
| `si` | variable | 307337–307345 | — |
| `lv` | arrow_function | 307346–307373 | `Math.floor` |
| `mv` | variable | 307374–307424 | — |
| `dv` | arrow_function | 307425–307485 | `Math.round` |
| `sl` | arrow_function | 307486–307529 | — |
| `Ko` | arrow_function | 307530–307609 | `Number.isSafeInteger`, `Math.min` |
| `zi` | function | 307610–307722 | `vn`, `sl`, `lv`, `Object.assign` |
| `Hr` | function | 307722–307942 | `zi`, `Math.max`, `Math.floor`, `cv.vipExtra` |
| `_d` | function | 307942–308109 | `zi`, `a.count`, `a.give` |
| `gv` | function | 308109–308408 | `zi`, `Hr`, `e.runs.includes`, `a.count` |
| `fv` | function | 308408–308506 | `zi`, `Hr`, `_d`, `e.runs.push` |
| `Ke` | variable | 308997–309001 | — |
| `kv` | variable | 309002–309006 | — |
| `Dd` | arrow_function | 309007–309090 | `Zh` |
| `yv` | function | 309091–309404 | `V`, `Math.min`, `L0`, `Dd`, `a.give`, `a.note`, `s.map(([i,o])=>`${o} ${i}`).join`, `s.map` |
| `pv` | function | 309404–309768 | `C0`, `V`, `Dd`, `Math.min`, `mm`, `Math.floor`, `Math.random`, `H0`, `e.bag.push`, `Zh`, `o.push` |
| `bv` | variable | 309989–310005 | — |
| `Pi` | variable | 310006–310013 | — |
| `vv` | variable | 310014–310020 | — |
| `xv` | variable | 310021–310027 | — |
| `Se` | variable | 310028–310033 | — |
| `xa` | variable | 310034–310039 | — |
| `Rh` | variable | 310040–310049 | — |
| `Kn` | variable | 310050–310058 | — |
| `re` | arrow_function | 310059–310092 | `Math.floor` |
| `Lr` | function | 310093–310135 | `bv.map` |
| `La` | function | 310135–310251 | `re`, `Lr(t).filter`, `Lr`, `n.at` |
| `Io` | arrow_function | 310257–310273 | `La` |
| `Fo` | function | 310274–310387 | `re`, `Lr(t).find`, `Lr` |
| `W3` | arrow_function | 310393–310495 | `Lr(re(a)).map`, `Lr`, `re`, `Math.round` |
| `il` | arrow_function | 310496–310642 | `Math.floor`, `String(Math.floor(t/3600)).padStart`, `String`, `String(Math.floor(t/60)%60).padStart` |
| `Yn` | variable | 310643–310919 | — |
| `ol` | variable | 310920–311133 | — |
| `Mv` | variable | 311134–311139 | — |
| `Y` | variable | 311140–311355 | — |
| `Ma` | arrow_function | 311356–311422 | `Math.max`, `Y.findIndex`, `t.hosts.includes` |
| `wv` | arrow_function | 311423–311475 | `Math.max`, `Y.findIndex` |
| `Ud` | variable | 311476–311520 | — |
| `Tv` | variable | 311521–311526 | — |
| `hl` | arrow_function | 311527–311575 | `Math.random` |
| `ja` | arrow_function | 311576–311616 | `Math.max`, `Math.min`, `Ud.level` |
| `$v` | variable | 311617–311655 | — |
| `Wa` | variable | 311656–311660 | — |
| `Ai` | variable | 311661–311665 | — |
| `qo` | variable | 311666–312125 | — |
| `Lt` | arrow_function | 312126–312152 | — |
| `rl` | variable | 312153–312165 | — |
| `Sv` | arrow_function | 312166–312195 | — |
| `Cv` | variable | 312196–312216 | — |
| `Hv` | variable | 312217–312237 | — |
| `Lv` | variable | 312238–312258 | — |
| `ul` | arrow_function | 312259–312311 | `Math.round`, `xn` |
| `cl` | arrow_function | 312312–312379 | `Math.round`, `xn`, `Math.max`, `Math.min` |
| `ll` | arrow_function | 312380–312415 | `Math.round`, `xn` |
| `Pv` | variable | 312416–312438 | — |
| `Oo` | variable | 312439–312453 | — |
| `_t` | variable | 312454–312459 | — |
| `Pr` | variable | 312460–312483 | — |
| `ml` | variable | 312484–312496 | — |
| `dl` | variable | 312497–312521 | — |
| `Av` | variable | 312522–312527 | — |
| `qs` | variable | 312528–312533 | — |
| `Rv` | variable | 312534–312539 | — |
| `Nv` | variable | 312540–312546 | — |
| `Bv` | arrow_function | 312547–312589 | `Math.max`, `eh`, `Je` |
| `_v` | variable | 312590–312594 | — |
| `Dv` | variable | 312595–312605 | — |
| `Uv` | variable | 312606–312610 | — |
| `Kv` | variable | 312611–312616 | — |
| `Iv` | arrow_function | 312617–312666 | `Math.max`, `Math.min`, `Math.floor` |
| `Fv` | arrow_function | 312667–312708 | — |
| `qv` | variable | 312709–312714 | — |
| `Ov` | variable | 312715–312720 | — |
| `Gv` | variable | 312721–312726 | — |
| `Vv` | variable | 312727–312754 | — |
| `Ev` | variable | 312755–312768 | — |
| `Nh` | variable | 312769–312775 | — |
| `gl` | variable | 312776–312780 | — |
| `jv` | variable | 312781–312785 | — |
| `fl` | arrow_function | 312786–312936 | `Math.round`, `Math.max`, `Math.min` |
| `kl` | arrow_function | 312937–313029 | `n` |
| `Wv` | arrow_function | 313030–313088 | `a` |
| `je` | variable | 313089–313095 | — |
| `Xv` | function | 313096–313276 | `bi`, `e.reduce`, `Number.isFinite`, `e.filter`, `t.has` |
| `Go` | function | 313276–313655 | `t.map`, `e.map`, `Math.max`, `Math.floor`, `t.reduce`, `s.reduce`, `t.map((r,h)=>h).sort`, `t[r].name.localeCompare` |
| `yl` | function | 313655–313801 | `Number.isSafeInteger`, `n`, `Math.floor` |
| `pl` | arrow_function | 313807–313883 | `Math.floor`, `Math.min`, `n` |
| `Qv` | function | 313884–314146 | `pl`, `e.push`, `[...a.gear].sort((i,o)=>ds(o.id)-ds(i.id)).slice`, `[...a.gear].sort`, `ds`, `Math.floor` |
| `ds` | arrow_function | 314152–314250 | — |
| `mn` | function | 314251–315420 | `ja`, `Math.max`, `Math.min`, `Vt`, `Math.floor`, `s`, `d.get`, `v.push`, `d.set`, `c`, `d.values`, `f.map` |
| `zv` | arrow_function | 315426–315485 | — |
| `Vo` | arrow_function | 315486–315656 | `mn`, `console.error`, `zv` |
| `bl` | function | 315657–315824 | `Math.max`, `Math.min`, `Math.floor`, `dn`, `e` |
| `Yv` | arrow_function | 315830–315987 | `Math.floor`, `a` |
| `Jv` | arrow_function | 315988–316121 | `dn`, `Math.min`, `Math.floor` |
| `Zv` | arrow_function | 316122–316302 | `Math.floor`, `e`, `mn` |
| `tx` | variable | 316303–316307 | — |
| `nx` | variable | 316308–316314 | — |
| `vl` | variable | 316315–316398 | — |
| `ex` | variable | 316399–316625 | — |
| `dn` | function | 316626–316981 | `Math.max`, `Math.min`, `vl.slice`, `Math.abs`, `[...a.id].reduce`, `s.charCodeAt`, `t.map`, `Math.ceil` |
| `at` | variable | 316987–317670 | — |
| `Ot` | arrow_function | 317671–317732 | `/^(TtkCave\|TtkHauSon)/.test`, `at.some` |
| `ax` | arrow_function | 317733–317755 | — |
| `xl` | arrow_function | 317756–317786 | — |
| `Ml` | variable | 317787–317909 | — |
| `wl` | function | 317910–318075 | `a.flatMap`, `ee`, `Math.min` |
| `X3` | variable | 318081–318162 | — |
| `sx` | variable | 318163–318223 | — |
| `Xa` | class | 318224–356220 | — |
| `Qa` | arrow_function | 356226–356298 | `a.normalize("NFC").toUpperCase().replace(/[\s-]+/g,"").slice`, `a.normalize("NFC").toUpperCase().replace`, `a.normalize("NFC").toUpperCase`, `a.normalize` |
| `ix` | variable | 356299–356320 | — |
| `ox` | variable | 356321–356326 | — |
| `hx` | class | 356327–357967 | — |
| `rx` | function | 357967–358131 | `t`, `a.amount.toLocaleString` |
| `O` | variable | 358137–358589 | — |
| `ue` | variable | 358590–358872 | — |
| `Ar` | arrow_function | 358873–358946 | `ue.slice(0,5).reduce`, `ue.slice` |
| `Ri` | variable | 358947–358954 | — |
| `gn` | variable | 358955–358963 | — |
| `ha` | variable | 358964–358971 | — |
| `Kd` | arrow_function | 358972–358995 | — |
| `Id` | arrow_function | 358996–359052 | `Math.max`, `Math.floor`, `Kd` |
| `ux` | arrow_function | 359053–359085 | `Kd` |
| `Fd` | arrow_function | 359086–359132 | `new Date(a+ha).toISOString().slice`, `new Date(a+ha).toISOString` |
| `qd` | arrow_function | 359133–359169 | `Math.floor` |
| `Ni` | arrow_function | 359170–359208 | `new Date(a+ha).getUTCDay` |
| `Bh` | arrow_function | 359209–359243 | `new Date(a+ha).getUTCHours` |
| `Od` | arrow_function | 359244–359302 | `Ni`, `Bh` |
| `cx` | arrow_function | 359303–359360 | `Ni`, `Bh` |
| `lx` | function | 359361–359537 | `Math.floor`, `Ni` |
| `ut` | arrow_function | 359543–359644 | `Math.floor`, `Number`, `Number.isFinite`, `Math.max`, `Math.min` |
| `mx` | arrow_function | 359645–359766 | — |
| `dx` | function | 359767–360759 | `mx`, `ut`, `Math.max`, `t.hd.slice`, `Object.entries(t.opp&&typeof t.opp=="object"?t.opp:{}).slice`, `Object.entries`, `(Array.isArray(t.h)?t.h:[]).slice(0,O.histN).filter(i=>i&&typeof i.o=="string").map`, `(Array.isArray(t.h)?t.h:[]).slice(0,O.histN).filter`, `(Array.isArray(t.h)?t.h:[]).slice`, `Array.isArray`, `i.o.slice`, `String(i.c??"").slice` |
| `Mt` | arrow_function | 360765–360785 | `vn` |
| `Tl` | variable | 360786–360800 | — |
| `gx` | arrow_function | 360801–360896 | — |
| `ft` | function | 360897–361088 | `Tl.get`, `gx`, `Id`, `a.epoch`, `Tl.set` |
| `fx` | arrow_function | 361094–361160 | `ft`, `n.queue.has`, `n.byPlayer.has` |
| `Rr` | function | 361161–361358 | `ft`, `Object.entries(t.ladder.board).sort((n,e)=>e[1].r-n[1].r\|\|(n[0]<e[0]?-1:1)).slice(0,O.topN).map`, `Object.entries(t.ladder.board).sort((n,e)=>e[1].r-n[1].r\|\|(n[0]<e[0]?-1:1)).slice`, `Object.entries(t.ladder.board).sort`, `Object.entries` |
| `kx` | arrow_function | 361364–361454 | `Rr`, `n.findIndex` |
| `Nr` | function | 361455–361635 | `ft`, `((r=i.ladder.titles)[t]??(r[t]=[])).push`, `[...a.players.values()].find`, `a.players.values`, `Gd` |
| `Gd` | function | 361635–362036 | `ft`, `In`, `t.titles.owned.find`, `t.toast` |
| `_h` | function | 362036–362239 | `Mt`, `Fd`, `Math.max`, `Math.min` |
| `ce` | variable | 362245–362452 | — |
| `yx` | function | 362453–362803 | `Mt`, `a.applyLevel`, `a.toast`, `Math.round` |
| `$l` | variable | 362809–362819 | — |
| `Vd` | function | 362820–362966 | `V`, `$l.get`, `ge`, `kn`, `$l.set` |
| `Br` | variable | 362972–362986 | — |
| `Ed` | function | 362987–363641 | `Vd`, `V`, `Math.round`, `n.passives.map`, `is`, `kn`, `ir`, `Math.min` |
| `px` | arrow_function | 363647–363789 | `Vd` |
| `jd` | function | 363790–364096 | `V`, `Od`, `a.epoch`, `gr` |
| `bx` | arrow_function | 364102–364184 | `Math.max`, `Math.min` |
| `vx` | function | 364185–364420 | `Math.min`, `Math.max`, `Math.floor` |
| `xx` | function | 364420–365136 | `ft`, `[...t.queue].filter`, `a.players.get`, `jd`, `e.some`, `t.queue.delete`, `e.sort`, `s.has`, `vx`, `Math.min`, `Mt`, `V` |
| `Mx` | function | 365136–365645 | `ft`, `Wi`, `s.matches.push`, `s.byPlayer.set`, `s.byRoom.set`, `fr`, `Br.add`, `m.applyLevel`, `m.toast` |
| `wx` | function | 365645–366282 | `a.epoch`, `Fd`, `Mt`, `Math.max`, `Wd`, `o.toast` |
| `Wd` | arrow_function | 366288–366392 | `Math.round` |
| `za` | function | 366393–368025 | `ft`, `a.epoch`, `d.toast`, `Mt`, `Wd`, `Math.max`, `qd`, `_h`, `a.record`, `Ar`, `k.h.unshift`, `Math.floor` |
| `Xd` | function | 368025–368253 | `ft`, `n.byPlayer.delete`, `Br.delete`, `a.players.get`, `rs`, `e.applyLevel`, `n.byRoom.delete`, `n.matches.filter`, `dr` |
| `Sl` | function | 368253–368320 | `a.players.get` |
| `Tx` | function | 368320–368954 | `a.rooms.get`, `a.rooms.set`, `Sl`, `za`, `px`, `Ed`, `wx`, `Math.max`, `Math.abs`, `Xd` |
| `$x` | function | 368954–369123 | `ft`, `n.queue.delete`, `n.watch.delete`, `n.byPlayer.get`, `za`, `Xd` |
| `Sx` | function | 369123–369913 | `ft`, `a.epoch`, `Id`, `Rr(a).filter(o=>o[1]>=ue[5].min).map`, `Rr(a).filter`, `Rr`, `a.global.push`, `qd`, `cx`, `Object.entries(s.rows).filter(([,o])=>o.w>=O.fairChampMin).sort`, `Object.entries(s.rows).filter`, `Object.entries` |
| `Cl` | function | 369913–370455 | `ft`, `Mt`, `Gd`, `n.ladder.prevTop.includes`, `Ar`, `a.epoch`, `Nr`, `a.record`, `t.note`, `Math.round` |
| `q` | variable | 372481–373055 | — |
| `be` | variable | 373056–373062 | — |
| `Ie` | variable | 373063–373071 | — |
| `gs` | variable | 373072–373081 | — |
| `Qd` | arrow_function | 373082–373120 | `new Date(a+gs).getUTCDay` |
| `Cx` | function | 373121–373280 | `Math.floor`, `q.days.includes`, `Qd` |
| `Hx` | function | 373280–373448 | `Math.floor`, `q.days.includes`, `Qd` |
| `Lx` | arrow_function | 373454–373523 | `q.brackets.findIndex`, `V` |
| `zd` | variable | 373524–373575 | — |
| `Hl` | variable | 373576–373590 | — |
| `Zt` | arrow_function | 373591–373693 | `Hl.get`, `Hl.set` |
| `xe` | arrow_function | 373694–373713 | `a.epoch` |
| `Px` | arrow_function | 373714–373811 | `[...Zt(a).battles.values()].some`, `Zt(a).battles.values`, `Zt`, `n.mem.get` |
| `Yd` | arrow_function | 373812–373920 | `Zt`, `xe`, `Cx` |
| `Ax` | function | 373921–374306 | `Zt`, `e.battles.get`, `Wi`, `q.flags.map`, `e.battles.set`, `e.byRoom.set` |
| `Bi` | arrow_function | 374312–374421 | `a.mem.values` |
| `Rx` | function | 374422–374598 | `a.mem.values`, `Bi` |
| `ve` | arrow_function | 374604–374620 | — |
| `Ll` | arrow_function | 374621–374675 | `Math.hypot`, `ve` |
| `le` | function | 374676–374744 | `a.mem.values`, `n.p.toast` |
| `Nx` | function | 374744–375768 | `Yd`, `xe`, `V`, `gr`, `Lx`, `Ax`, `i.byName.get`, `Rx`, `i.byName.set`, `i.mem.delete`, `i.mem.set`, `ve` |
| `fs` | function | 375768–375884 | `a.players.get`, `rs`, `n.p.note` |
| `We` | function | 375884–375910 | — |
| `Bx` | function | 375910–376352 | `We`, `Math.max`, `a.record`, `le` |
| `_x` | function | 376352–377005 | `[...t.mem.values()].filter`, `t.mem.values`, `t.flags.forEach`, `Math.hypot`, `Math.min`, `Math.max`, `Math.abs`, `We`, `a.record`, `le` |
| `Dx` | function | 377005–378090 | `xe`, `t.carts.some`, `t.carts.push`, `ve`, `le`, `[...t.mem.values()].filter`, `t.mem.values`, `n.filter`, `Math.hypot`, `Math.sign`, `We`, `a.record` |
| `Ux` | function | 378090–378679 | `t.mem.values`, `a.players.get`, `fs`, `tp`, `ve`, `uc`, `Math.hypot` |
| `Kx` | function | 378679–379702 | `xe`, `[...t.mem.values()].filter(r=>r.here).sort`, `[...t.mem.values()].filter`, `t.mem.values`, `e.forEach`, `r.p.note`, `_h`, `Math.min`, `Math.floor`, `a.record`, `Nr`, `a.global.push` |
| `Ix` | function | 379702–380228 | `xe`, `a.rooms.get`, `a.rooms.set`, `le`, `t.mem.values`, `Ux`, `_x`, `Dx`, `Kx`, `fs`, `Zt`, `e.battles.delete` |
| `Fx` | function | 380228–380710 | `xe`, `[...a.mem.values()].filter(i=>i.here).sort((i,o)=>o.pts-i.pts).slice(0,5).map`, `[...a.mem.values()].filter(i=>i.here).sort((i,o)=>o.pts-i.pts).slice`, `[...a.mem.values()].filter(i=>i.here).sort`, `[...a.mem.values()].filter`, `a.mem.values`, `Math.max`, `Math.ceil`, `a.flags.map`, `Math.round`, `a.carts.map`, `Bi` |
| `Pa` | variable | 381987–381997 | — |
| `_i` | variable | 381998–382060 | — |
| `qx` | variable | 382061–382096 | — |
| `Dh` | arrow_function | 382097–382117 | `_i.includes` |
| `Ox` | variable | 382118–382169 | — |
| `Gx` | variable | 382170–382545 | — |
| `Vx` | arrow_function | 382546–382606 | `Gx.find` |
| `Ex` | variable | 382607–382613 | — |
| `Ya` | variable | 382614–382624 | — |
| `ra` | variable | 382625–382639 | — |
| `Xe` | variable | 382640–382654 | — |
| `Pl` | variable | 382659–382663 | — |
| `Uh` | arrow_function | 382670–382734 | `ra.get` |
| `Al` | function | 382735–382829 | `qn(a).pub.get`, `qn`, `ne` |
| `ne` | arrow_function | 382835–382905 | — |
| `jx` | function | 382906–383298 | `t.toLowerCase`, `Ya.get`, `a.rooms.get`, `a.data.maps.get`, `a.newId`, `a.rooms.set`, `a.epoch`, `Ya.set`, `ra.set` |
| `ii` | function | 383298–383942 | `t.note`, `jx`, `Xe.has`, `a.data.maps.get`, `Xe.set`, `ra.has`, `Dh`, `Xe.get`, `a.placeInRoom`, `t.events.push`, `n.toLowerCase`, `t.name.toLowerCase` |
| `Jd` | function | 383942–384219 | `Xe.get`, `a.data.maps.get`, `Xe.delete`, `a.travel` |
| `Wx` | function | 384219–384318 | `ra.has`, `Dh`, `Jd`, `ii`, `ne` |
| `Xx` | variable | 386464–386469 | — |
| `Qx` | variable | 386470–386475 | — |
| `zx` | variable | 386476–386481 | — |
| `Kh` | variable | 386482–386495 | — |
| `Rl` | variable | 386496–386510 | — |
| `Yi` | arrow_function | 386511–386566 | `Rl.get`, `Rl.set` |
| `Nl` | variable | 386571–386575 | — |
| `Yx` | arrow_function | 386582–386652 | — |
| `oi` | arrow_function | 386653–386725 | `[...Yi(a).values()].find`, `Yi(a).values`, `Yi`, `n.members.has` |
| `Jx` | arrow_function | 386726–386832 | `a.book.active().find`, `a.book.active`, `n.goals.some`, `a.book.progress` |
| `Zx` | arrow_function | 386833–386952 | `e.npcs.find`, `Math.hypot` |
| `t5` | function | 386953–387386 | `(((r=a.data.camps[t.scene])==null?void 0:r.camps)??[]).map(h=>[h.x,h.y]).filter(([h,c])=>!t.collision.blocked(h,c,.5)).map(h=>({c:h,d:Math.hypot(h[0]-e[0],h[1]-e[1])})).filter(h=>h.d>7).sort((h,c)=>h.d-c.d).map`, `(((r=a.data.camps[t.scene])==null?void 0:r.camps)??[]).map(h=>[h.x,h.y]).filter(([h,c])=>!t.collision.blocked(h,c,.5)).map(h=>({c:h,d:Math.hypot(h[0]-e[0],h[1]-e[1])})).filter(h=>h.d>7).sort`, `(((r=a.data.camps[t.scene])==null?void 0:r.camps)??[]).map(h=>[h.x,h.y]).filter(([h,c])=>!t.collision.blocked(h,c,.5)).map(h=>({c:h,d:Math.hypot(h[0]-e[0],h[1]-e[1])})).filter`, `(((r=a.data.camps[t.scene])==null?void 0:r.camps)??[]).map(h=>[h.x,h.y]).filter(([h,c])=>!t.collision.blocked(h,c,.5)).map`, `(((r=a.data.camps[t.scene])==null?void 0:r.camps)??[]).map(h=>[h.x,h.y]).filter`, `(((r=a.data.camps[t.scene])==null?void 0:r.camps)??[]).map`, `t.collision.blocked`, `Math.hypot`, `Math.min`, `o.push`, `o.map`, `t.collision.nearestOpen` |
| `Zd` | function | 387386–387990 | `t.mobs.push`, `Zn`, `Math.cos`, `Math.sin`, `Math.max`, `lr` |
| `Bl` | function | 387990–388138 | `ae`, `rs`, `Yi(a).delete`, `Yi`, `dr` |
| `n5` | function | 388138–389170 | `Yx(a).find`, `Yx`, `oi`, `Kt`, `t.note`, `Jx`, `Zx`, `a.data.maps.get`, `Wi`, `(((g=t.party)==null?void 0:g.members)??[]).filter`, `Math.hypot`, `Math.min` |
| `e5` | function | 389170–389986 | `Yi(a).values`, `Yi`, `t.members.delete`, `a.players.get`, `e.note`, `Bl`, `t.mobs.filter`, `ae`, `s.note`, `s.toast`, `Zd`, `a.record` |
| `Ih` | variable | 390619–390635 | — |
| `a5` | variable | 390636–390652 | — |
| `s5` | variable | 390653–390663 | — |
| `i5` | arrow_function | 390741–390780 | `Date.now`, `Math.max` |
| `o5` | arrow_function | 390781–390805 | `Math.ceil` |
| `Eo` | variable | 391794–391821 | — |
| `h5` | variable | 391822–391828 | — |
| `r5` | variable | 391829–391833 | — |
| `u5` | variable | 391834–391840 | — |
| `c5` | variable | 391841–391845 | — |
| `Fh` | variable | 391846–391850 | — |
| `l5` | variable | 391851–391894 | — |
| `tg` | variable | 391895–392711 | — |
| `m5` | arrow_function | 392712–392811 | `Ot` |
| `d5` | function | 392812–392987 | `tg.map(s=>[s,s.weight(a)]).filter`, `tg.map`, `s.weight`, `t.reduce`, `Math.random` |
| `g5` | function | 392987–393592 | `m5`, `xs`, `Math.random`, `d5`, `vs`, `h.collision.nearestOpen`, `Math.cos`, `Math.sin`, `Math.round`, `Date.now`, `h.events.push`, `t.toast` |
| `f5` | function | 393592–394376 | `tg.find`, `vs`, `[s.id,...n.log].slice`, `se`, `Ge`, `t.give`, `V`, `Fn`, `Math.random`, `o.call`, `a.record`, `t.toast` |
| `_l` | arrow_function | 396435–396520 | `Number.isFinite`, `Math.max` |
| `Dl` | arrow_function | 396521–396552 | `a.toLocaleString` |
| `k5` | function | 398313–398652 | `e.call`, `s.self`, `Number.isFinite`, `n.push`, `Math.round` |
| `y5` | variable | 399249–399257 | — |
| `Q3` | variable | 399258–399278 | — |
| `z3` | variable | 399279–399285 | — |
| `Y3` | variable | 399286–399292 | — |
| `J3` | variable | 399293–399339 | — |
| `Ja` | variable | 399453–399465 | — |
| `ng` | variable | 399466–399470 | — |
| `Di` | variable | 399471–399490 | — |
| `eg` | variable | 399491–399499 | — |
| `ag` | arrow_function | 399500–399523 | `Math.floor` |
| `p5` | function | 399524–399625 | `ag`, `Math.floor`, `Di.map` |
| `b5` | variable | 399631–399637 | — |
| `qt` | arrow_function | 399638–399797 | `Qm` |
| `v5` | variable | 399798–401138 | — |
| `sg` | arrow_function | 401139–401206 | `Di.map` |
| `Wn` | arrow_function | 401207–401245 | `Number.isSafeInteger` |
| `x5` | function | 401246–401555 | `sg`, `Wn`, `Math.min`, `Array.isArray`, `t.nhan.map`, `Object.entries` |
| `M5` | arrow_function | 401561–401607 | `sg` |
| `ig` | arrow_function | 401608–401659 | `Date.now` |
| `og` | function | 401660–401874 | `Date.now`, `ig`, `a.donation.payments.reduce`, `Math.max`, `Math.min`, `Zb` |
| `hg` | arrow_function | 401880–401901 | — |
| `Z3` | arrow_function | 401902–401931 | `hg` |
| `w5` | function | 401932–404358 | `M5`, `Date.now`, `t.note`, `r`, `Number`, `Number.isSafeInteger`, `ig`, `og`, `c.toLocaleString`, `t.takeFree`, `h.toLocaleString`, `ag(i.gui).toLocaleString` |
| `T5` | variable | 404591–405006 | — |
| `$5` | variable | 405007–491852 | — |
| `S5` | variable | 491853–507823 | — |
| `C5` | variable | 507824–508497 | — |
| `Os` | variable | 508498–508607 | — |
| `rg` | variable | 508608–508613 | — |
| `Ut` | arrow_function | 508614–508694 | `Number.isFinite`, `Math.max`, `Math.min` |
| `jo` | variable | 508695–508700 | — |
| `H5` | function | 508701–510179 | `Object.keys`, `Object.keys(t).map(Number).filter(u=>Number.isInteger(u)&&u>=1).sort`, `Object.keys(t).map(Number).filter`, `Object.keys(t).map`, `Number.isInteger`, `Ut`, `Object.keys(n).map(Number).filter(u=>Number.isInteger(u)&&u>=1).sort`, `Object.keys(n).map(Number).filter`, `Object.keys(n).map` |
| `L5` | arrow_function | 510185–510217 | `ug`, `or` |
| `ug` | arrow_function | 510218–510277 | — |
| `Ct` | variable | 510426–510525 | — |
| `Ji` | variable | 510526–510660 | — |
| `P5` | variable | 510661–511003 | — |
| `ua` | variable | 511004–511018 | — |
| `Ul` | variable | 511019–511033 | — |
| `sn` | arrow_function | 511034–511056 | `vn` |
| `qh` | arrow_function | 511057–511084 | `Kt` |
| `A5` | arrow_function | 511085–511111 | — |
| `Oh` | variable | 511112–511122 | — |
| `cg` | function | 511123–511319 | `A5`, `a.rooms.get`, `Kt`, `Wi`, `R5`, `Math.max`, `Oh.add` |
| `lg` | function | 511319–511646 | `sn`, `mg`, `a.placeInRoom`, `ua.has`, `Math.max`, `Math.round`, `xn`, `ua.get`, `Wt` |
| `mg` | function | 511646–511689 | — |
| `R5` | function | 511689–512558 | `mg`, `t.collision.nearestOpen`, `Math.round`, `xn`, `a.newId`, `Math.max`, `Wt`, `wt`, `ua.set`, `t.monsters.push` |
| `N5` | arrow_function | 512564–512579 | `ua.has` |
| `dg` | function | 512580–513189 | `Ul.has`, `Ul.add`, `a.join.bind`, `t`, `sn`, `cg`, `lg`, `_r`, `a.dealMonster.bind`, `N5`, `n`, `Math.max` |
| `B5` | function | 513189–513386 | `Math.min`, `Math.max` |
| `gg` | function | 513386–513482 | `a.ring.fill`, `a.ringDmg.fill` |
| `_r` | function | 513482–513708 | `sn`, `a.learnedSkills.includes`, `a.learnedSkills.push` |
| `Dr` | function | 513708–513902 | `sn`, `a.learnedSkills.filter`, `ea` |
| `_5` | function | 513902–514528 | `sn`, `qh`, `t.note`, `dg`, `cg`, `_r`, `gg`, `lg`, `t.events.push`, `t.def.skills.find` |
| `D5` | function | 514528–514694 | `sn`, `Dr`, `Kt`, `a.travel` |
| `U5` | function | 514694–515372 | `t.note`, `sn`, `Dr`, `yn`, `Ia`, `ea`, `t.grantGmSkills`, `mt`, `t.gear.find`, `_a`, `t.worn.delete`, `t.applyLevel` |
| `K5` | variable | 516731–516781 | — |
| `me` | variable | 517057–517062 | — |
| `fg` | variable | 517063–517067 | — |
| `hi` | variable | 517068–517074 | — |
| `I5` | variable | 517075–517082 | — |
| `F5` | variable | 517083–517089 | — |
| `q5` | variable | 517090–517096 | — |
| `Fe` | variable | 517097–517118 | — |
| `Wo` | variable | 517119–517135 | — |
| `Xo` | variable | 517136–517140 | — |
| `O5` | variable | 517141–517145 | — |
| `Kl` | variable | 517146–517387 | — |
| `Il` | variable | 517388–517402 | — |
| `G5` | variable | 517403–517497 | — |
| `Fl` | arrow_function | 517498–517617 | `e.npcs.find`, `Math.hypot` |
| `Gh` | arrow_function | 517618–517705 | `a.data.npcs.npcs.find` |
| `Ui` | arrow_function | 517706–517778 | `a.data.maps.get` |
| `ri` | function | 517779–518780 | `xp`, `Ui`, `Math.floor`, `Math.random`, `yr`, `Mi`, `Gh`, `a.data.quests.landmarks.find` |
| `V5` | function | 518780–518865 | — |
| `E5` | function | 518865–519753 | `yr`, `n.push`, `Ui`, `U0`, `t.book.lock`, `t.book.claimed`, `j5`, `e.push`, `n.splice`, `Math.floor`, `Math.random` |
| `j5` | arrow_function | 519759–519879 | `a.data.quests.quests.find`, `s.goals.some` |
| `W5` | function | 519880–520362 | `Ge`, `Math.max`, `Math.round`, `cr`, `se`, `t.give`, `Math.floor`, `Math.random`, `Fn`, `a.record`, `t.toast` |
| `X5` | function | 520362–520606 | `W5`, `ri`, `Date.now`, `t.note` |
| `ql` | variable | 520612–520626 | — |
| `fn` | variable | 524635–524640 | — |
| `G` | arrow_function | 524641–524656 | `fn.push` |
| `Ol` | variable | 524657–524685 | — |
| `Q5` | variable | 524686–525439 | — |
| `z5` | variable | 525688–526322 | — |
| `Y5` | variable | 527450–528099 | — |
| `J5` | variable | 528671–529286 | — |
| `kg` | variable | 530388–530770 | — |
| `Gl` | variable | 530771–530844 | — |
| `yg` | variable | 531015–532289 | — |
| `Tt` | arrow_function | 539426–539604 | `n.forEach`, `G`, `t.replace`, `Math.min` |
| `Pt` | arrow_function | 539605–539636 | `a.toLocaleString` |
| `Vl` | variable | 541307–542165 | — |
| `t2` | variable | 542237–542242 | — |
| `Vh` | variable | 542243–542253 | — |
| `Z5` | variable | 542331–542409 | — |
| `t3` | variable | 542410–542455 | — |
| `n3` | variable | 542456–542463 | — |
| `e3` | variable | 542464–542470 | — |
| `a3` | arrow_function | 542471–542494 | `Math.min` |
| `Gs` | function | 542495–542917 | `Vh.get`, `Math.min`, `t3.has`, `Math.max`, `n.done.includes`, `n.done.push`, `t.applyLevel`, `t.toast`, `a.announce` |
| `Hn` | variable | 543992–544047 | — |
| `pg` | variable | 544048–544053 | — |
| `s3` | function | 544054–545386 | `t.nearestOpen`, `s`, `e.push`, `Ce`, `pg`, `Math.hypot`, `e.some`, `n`, `Math.floor`, `t.blocked`, `u.push`, `m` |
| `Ce` | arrow_function | 545392–545417 | `Math.round` |
| `i3` | function | 545418–545584 | `[s,e].filter(Boolean).join`, `[s,e].filter` |
| `Eh` | variable | 545590–545600 | — |
| `n2` | function | 545601–545630 | `Eh.set` |
| `bg` | function | 545630–545826 | `Eh.get`, `a.room`, `s3`, `Eh.set` |
| `o3` | function | 545826–545914 | `t.slice`, `t.lastIndexOf`, `bg(a,n).find`, `bg` |
| `vg` | arrow_function | 545920–545963 | `t.endsWith`, `a.u.includes` |
| `h3` | function | 546966–547657 | `e.slice`, `e.lastIndexOf`, `pg`, `vg`, `a.data.exported.has`, `t.book.lock`, `a.data.maps.get`, `Nt` |
| `r3` | variable | 547663–548289 | — |
| `u3` | variable | 548290–548408 | — |
| `c3` | variable | 548409–548413 | — |
| `l3` | variable | 548414–548422 | — |
| `m3` | arrow_function | 548423–548460 | `l3.filter`, `V` |
| `d3` | function | 548461–548599 | `t`, `Math.floor` |
| `g3` | function | 548599–548938 | `a.count`, `a.give`, `m3`, `d3`, `s.set`, `s.get`, `[...s].map(([o,r])=>`${r} ${o}`).join`, `[...s].map`, `a.toast`, `a.note` |
| `f3` | variable | 548944–548979 | — |
| `xg` | variable | 548980–548986 | — |
| `k3` | arrow_function | 548987–549005 | — |
| `y3` | variable | 549006–549011 | — |
| `Vs` | arrow_function | 549012–549108 | `um`, `Jt.has` |
| `El` | arrow_function | 549109–549137 | `Math.random` |
| `jl` | arrow_function | 549138–549173 | `Math.random` |
| `Qo` | arrow_function | 549174–549214 | `a.taken.has` |
| `p3` | class | 549215–549330 | — |
| `p3.constructor` | constructor | 549224–549329 | `T`, `this.members.push` |
| `Es` | variable | 549336–549340 | — |
| `Wl` | variable | 549341–549346 | — |
| `b3` | variable | 549347–549352 | — |
| `jh` | variable | 549353–549362 | — |
| `Xl` | variable | 549363–549368 | — |
| `v3` | variable | 549369–549374 | — |
| `x3` | variable | 549375–549379 | — |
| `M3` | variable | 549380–549399 | — |
| `Pe` | arrow_function | 549400–549431 | `Ht.slice(1).includes`, `Ht.slice` |
| `w3` | function | 549432–549462 | `vt` |
| `Ql` | class | 549462–567377 | — |
| `Wh` | variable | 567383–567537 | — |
| `Xh` | class | 567538–571358 | — |
| `e2` | class | 571358–679209 | — |
| `zo` | function | 679209–679319 | `Math.atan2`, `Math.round` |

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

### `Tg` — 33–118

- Conditions: `t in a`
- Numeric literals: `0`
- State writes: `a[t]`

### `T` — 123–167

- Conditions: `typeof t!="symbol"`

### `ym` — 8622–8653

- Conditions: `t`
- Numeric literals: `0`, `1`

### `Ff` — 8654–8811

- Numeric literals: `1`, `12`, `11`, `5`, `0.65`, `4.6`, `1.4`, `1.15`, `0.3`, `0.19`, `0.008`

### `qf` — 8811–8954

- Conditions: `Number.isFinite(s)`; `n`; `e`
- Numeric literals: `0.5`, `0`, `1`, `1.6`, `0.7`

### `gi` — 8978–9055

- Conditions: `a==null`
- Numeric literals: `1`, `0`

### `nr` — 9056–9097

- Numeric literals: `1`

### `Vf` — 9098–9116

- Conditions: `a>=ke`
- Numeric literals: `1`

### `Ef` — 9117–9345

- Conditions: `!a||typeof a!="object"||Array.isArray(a)`
- Numeric literals: `0`, `64`, `2`
- State writes: `t[n]`

### `Wf` — 9357–9413

- Numeric literals: `1`, `0`

### `C3` — 9478–9554

- Conditions: `t.t==="poison"&&Qf.has(a)&&t.dur!==void 0`
- Numeric literals: `0`

### `zf` — 9555–9605

- Numeric literals: `10`

### `pm` — 9740–10223

- Conditions: `t&&t.gear===a.gear&&t.len===a.gear.length&&t.uids.length===a.worn.size`; `h!==t.uids[o]||c!==void 0&&(c.uid!==h||c.id!==t.raw[o])`; `r`; `o==null`
- Numeric literals: `0`, `1`
- State writes: `r`

### `hn` — 10223–10869

- Conditions: `Z.on`; `!s||s.signature!==e||a.dead`; `s==null`
- Numeric literals: `0`, `5`, `1`
- State writes: `t.ids`, `t.level`, `t.classId`, `t.signature`, `s`

### `lt` — 10875–10931

- Conditions: `t.startsWith("ex-set-")`

### `rn` — 10932–11004

- Conditions: `!lt(a,t)||(a.cd[t]??0)>n`
- Numeric literals: `0`, `1`
- State writes: `a.cd[t]`

### `t1` — 15717–15769

- Numeric literals: `3000`, `150000`, `150`

### `e1` — 15793–15880

- Conditions: `((t==="switch"?a==null?void 0:a.switches:a==null?void 0:a.resets)??0)>=1`; `t==="switch"`; `a==null`
- Numeric literals: `0`, `1`

### `Bt` — 23801–23893

- Conditions: `a==null`
- Numeric literals: `0`
- State writes: `n`

### `c1` — 25004–25055

- Numeric literals: `20000`, `400000`, `400`

### `l1` — 25140–25161

- Conditions: `a`
- Numeric literals: `1`

### `Et` — 25794–25917

- Conditions: `(s=(e=a.debuffs)==null?void 0:e.find(i=>i.kind===t&&i.until>n))==null`; `(e=a.debuffs)==null`
- Numeric literals: `0`
- State writes: `s`, `e`

### `po` — 25917–26202

- Conditions: `!Number.isFinite(n)||!Number.isFinite(e)||n<=0||e<=0`; `h<0`
- Numeric literals: `0`, `12`
- State writes: `r[h]`, `a.debuffs`

### `Sn` — 27343–27362

- Numeric literals: `3`

### `$m` — 30036–30064

- Conditions: `a>=6`; `a>=4`; `a>=2`
- Numeric literals: `6`, `3`, `4`, `2`, `1`, `0`

### `ki` — 30099–30154

- Conditions: `Tm[a]`
- Numeric literals: `0`, `3`

### `Vi` — 30155–30274

- Conditions: `a`; `t`; `n`
- Numeric literals: `1`, `0`, `2`

### `bo` — 30280–30343

- Conditions: `t`

### `w1` — 30523–30746

- Conditions: `a&&typeof a=="object"`; `Array.isArray(t.f)`; `t.k===1`; `typeof t.fw=="string"&&n.includes(t.fw)`
- Numeric literals: `0`, `64`, `1`

### `Sm` — 30752–30808

- Conditions: `(t=Vi(sr(a)))==null`
- Numeric literals: `0`
- State writes: `t`

### `sr` — 30809–31083

- Conditions: `t!=null&&t.fw&&Vi(t.fw)`; `n==null`; `!e||!s.length`; `i`; `t==null`
- Numeric literals: `0`, `1`

### `$1` — 31847–31940

- Conditions: `t===void 0`; `(n=fi(T1[a]??"")[0])==null`
- Numeric literals: `0`
- State writes: `n`

### `wu` — 31954–31989

- Numeric literals: `0`

### `Cm` — 32663–32852

- Conditions: `!a`; `a.startsWith("bay_gu_")`; `t`
- Numeric literals: `1`, `0`

### `Hm` — 32852–33010

- Conditions: `t==="phys"`
- Numeric literals: `0`, `1`

### `Tu` — 33010–33198

- Conditions: `t==="true"`; `t==="phys"`; `n==null`
- Numeric literals: `100`, `0`

### `P1` — 33198–33388

- Conditions: `t==="true"`; `t==="phys"`; `n==null`; `e<1`
- Numeric literals: `1`, `0`

### `$u` — 33394–33493

- Conditions: `t==="phys"`; `a==null`; `t==="magic"`
- Numeric literals: `0`

### `R1` — 34550–34691

- Conditions: `!a`
- Numeric literals: `0`
- State writes: `t`

### `P3` — 35658–35756

- Conditions: `t`

### `X` — 81833–81851

- Numeric literals: `0`

### `fa` — 81970–81993

- Numeric literals: `0`

### `un` — 82009–82191

- Conditions: `!a||a.hx!==void 0`; `!n`; `!e`
- Numeric literals: `0`
- State writes: `e`, `s`, `e[s]`

### `et` — 82197–82254

- Conditions: `(n=un(a,t))==null`
- Numeric literals: `0`
- State writes: `n`

### `Pu` — 82255–82297

- Numeric literals: `0`, `1`

### `ir` — 82298–82339

- Conditions: `a<=99`
- Numeric literals: `99`, `25`, `1`

### `or` — 82944–82991

- Numeric literals: `1`

### `Au` — 82992–83027

- Numeric literals: `1`

### `Ru` — 83028–83063

- Numeric literals: `1`

### `Ca` — 148242–148375

- Conditions: `t*t+n*n<.0025`; `Math.abs(e)<31`
- Numeric literals: `0.0025`, `180`, `45`, `540`, `360`, `31`

### `Lm` — 148375–148485

- Conditions: `a*a+t*t<1e-6`
- Numeric literals: `0.000001`, `2`, `180`, `45`, `8`

### `ys` — 148517–148648

- Numeric literals: `6`, `7`

### `Q1` — 148648–149057

- Conditions: `a&&typeof a=="object"`; `t.opponents&&typeof t.opponents=="object"&&!Array.isArray(t.opponents)`; `Number.isSafeInteger(t.week)`; `Number.isSafeInteger(t.kills)`
- Numeric literals: `0`
- State writes: `n[e]`

### `Y1` — 149073–149531

- Conditions: `!t||t===a.name||!Number.isFinite(n)`; `(s==null?void 0:s.week)===e`; `s==null`; `Number.isSafeInteger(i.kills)`; `Object.hasOwn(i.opponents,t)`
- Numeric literals: `1`, `0`
- State writes: `a.pvpWeek`, `i.opponents`, `i.kills`, `i.opponents[t]`

### `J1` — 149531–149684

- Conditions: `((n=a.pvpWeek)==null?void 0:n.week)===t&&Number.isSafeInteger(a.pvpWeek.kills)`; `(n=a.pvpWeek)==null`
- Numeric literals: `0`
- State writes: `n`

### `Z1` — 149684–149842

- Conditions: `(e=(n=a.kt)==null?void 0:n.lucchien)==null`; `(n=a.kt)==null`; `typeof t=="number"&&Number.isFinite(t)&&t>=0`
- Numeric literals: `0`
- State writes: `e`, `n`

### `tk` — 149842–150443

- Conditions: `t.classId==="the-tu"`
- Numeric literals: `0`, `1`, `5`, `10`, `0.1`, `0.2`, `100`

### `A3` — 150443–151697

- Conditions: `o==="level"`; `(r=o.fishStats)==null`; `o.fishStats.best&&o.fishStats.bestKg`; `(u=(c=o.kt)==null?void 0:c.detu)==null`; `(c=o.kt)==null`; `r==null`; `o.name&&r&&Number(r.wk)===t&&Number.isSafeInteger(h)&&h>0`
- Numeric literals: `0`, `100`, `10`
- State writes: `r`, `u`, `c`

### `nk` — 151697–151956

- Conditions: `!a||typeof a!="object"`; `Array.isArray(a.gear)`

### `ek` — 151956–152298

- Conditions: `!t`; `s.length||!a.gearFits([e])`
- Numeric literals: `0`
- State writes: `a.disciple`, `a.dirty`

### `hr` — 155595–155709

- Conditions: `a.selected&&!a.owned.some(n=>n.id===a.selected&&Ei(n,t))`
- Numeric literals: `0`, `1`
- State writes: `a.selected`

### `Am` — 155709–156387

- Conditions: `Array.isArray(a==null?void 0:a.owned)`; `a==null`; `Pm(s.id)&&!n.some(i=>i.id===s.id)`; `Number.isFinite(s.awardedAt)&&s.awardedAt>0`; `Number.isFinite(s.lastWeek)`; `i`; `Number.isFinite(s.expiresAt)&&s.expiresAt>=0`; `i&&Number.isFinite(s.outfitAt)`; `n.some(s=>s.id===(a==null?void 0:a.selected))`
- Numeric literals: `0`, `1`

### `In` — 156387–156698

- Conditions: `s`; `e===void 0||s.lastWeek===e`; `os(t)`
- Numeric literals: `0`, `1`
- State writes: `s.lastWeek`, `s.awardedAt`, `s.expiresAt`, `a.selected`

### `sk` — 156698–156907

- Numeric literals: `0`, `500000`
- State writes: `n.visible`

### `lh` — 156907–157020

- Conditions: `a!=null&&a.visible&&a.owned.some(n=>n.id===a.selected&&Ei(n,t))`

### `As` — 157020–157095

- Conditions: `n`

### `ik` — 157095–157443

- Conditions: `t.startsWith("title-")`; `t==="title-select"&&a.titles.owned.some(s=>s.id===n&&Ei(s,e))`; `t==="title-visible"&&(n==="on"||n==="off")`
- Numeric literals: `0`, `1`
- State writes: `a.dirty`, `a.titles.selected`, `a.titles.visible`

### `hk` — 157454–157496

- Numeric literals: `0`

### `rk` — 157644–157687

- Numeric literals: `0`, `231`

### `ck` — 157766–157905

- Numeric literals: `2166136261`, `0`, `16777619`, `13`, `17`, `5`, `4294967296`
- State writes: `t`

### `Mo` — 157906–158319

- Conditions: `a.equipmentVersion===2`; `!n`; `n.grade<=1`; `n.grade<=3`
- Numeric literals: `2`, `16`, `0`, `1`, `3`
- State writes: `n.upgrade`, `n.equipmentVersion`, `n.affixes`, `n.name`, `n.forgeLedger`

### `lk` — 158319–159617

- Conditions: `((u=a.forge)==null?void 0:u.version)===2`; `(u=a.forge)==null`; `d===1`; `d===2`; `e.level>=10`; `c`; `g.gear`
- Numeric literals: `0`, `2`, `5`, `10`, `1`, `20`, `40`, `3`, `60`, `4`, `100`, `3000`
- State writes: `u`, `i[g]`, `e.inv`, `e.gear`, `m`, `e.realm.gear`, `e.buyback`, `e.forge`, `e.forge.materials`, `e.forge.receipt`

### `_u` — 159617–162176

- Conditions: `!t.startsWith("donation-")`; `a.dead||a.realm||a.tribRun`; `t==="donation-claim"`; `!r||e.total<r.vnd||e.claimed.includes(r.vnd)`; `r.pending`; `h&&Ki(a)<h`; `r.slot&&!c`; `r.slot&&!c&&!u`; `u&&a.gear.length>=Xg`; `l&&(fe(a,l.mount)||a.count(d)>0)`; `t==="donation-incense"`; `a.count(Na)<1`; `e.incense.remaining>=3600`; `t==="donation-title"&&e.title`; `e.titleVisible`; `t==="donation-look"&&e.looks.length`
- Numeric literals: `1`, `0`, `200000`, `1000000`, `3600`, `1800`
- State writes: `e.bound[d]`, `u.bound`, `u.noSalvage`, `i`, `o`, `e.title`, `a.dirty`, `e.titleVisible`, `a.titles.selected`, `a.titles.visible`, `e.look`

### `dk` — 162348–162505

- Conditions: `s==="Linh thạch"`
- Numeric literals: `0`, `6`, `1`, `2`, `3`, `5`

### `Du` — 162505–162744

- Conditions: `t==="daily"`; `n>=151`; `n>=81`
- Numeric literals: `1`, `999`, `2`, `8`, `100`, `20`, `80`, `10`, `151`, `81`

### `Vn` — 162780–162820

- Numeric literals: `3600`, `86400`

### `rr` — 162821–162846

- Numeric literals: `3`, `7`

### `B3` — 162847–162881

- Numeric literals: `1`, `86400`, `3600`

### `Fa` — 162882–162930

- Numeric literals: `40`, `4`

### `gk` — 162931–162945

- Numeric literals: `0.1`

### `fk` — 162946–163015

- Numeric literals: `100`, `1`, `7`

### `Dm` — 163016–163172

- Numeric literals: `0`, `1831565813`, `15`, `1`, `7`, `61`, `14`, `4294967296`
- State writes: `t`, `n`

### `Um` — 163178–163219

- Numeric literals: `1`, `9999`

### `kk` — 163220–163640

- Conditions: `r`
- Numeric literals: `7919`, `13`, `0`, `1`, `2`, `0.5`
- State writes: `c`

### `yk` — 163640–163814

- Numeric literals: `104729`, `7`, `3`, `1`, `0`

### `mh` — 163908–164106

- Numeric literals: `0`, `1`

### `Iu` — 164106–164538

- Numeric literals: `1`, `0`
- State writes: `t.day`, `t.goals`, `t.progress`, `t.claimed`, `o`, `t.week`, `t.wgoals`, `t.wprogress`, `t.wclaimed`, `t.chest`, `t.medDay`, `t.meditated`

### `pk` — 164544–164849

- Conditions: `a.startsWith("kill-in:")`; `a.startsWith("rare:")`; `a.startsWith("harvest:")`; `a.startsWith("craft:")||a.startsWith("smelt:")`; `a.startsWith("discover:")`; `a==="quest-claim"`; `a==="daily-claim"`; `a==="worldboss"`; `a==="skill-learn"`

### `bk` — 164850–165550

- Conditions: `!h||t.claimed[r]||!Ku(h,n)`; `!n.startsWith(o)||n.length===o.length`
- Numeric literals: `1`, `0`
- State writes: `t.progress[r]`, `t.wprogress[r]`, `t.stats[h]`, `t.stats[r]`, `t.stats[i]`

### `vk` — 165556–165711

- Conditions: `e.stat==="level"`
- Numeric literals: `0`

### `Mk` — 166562–167215

- Conditions: `a.uid===t.uid||!e||!s`; `e.kind==="cosmetic"||s.kind==="cosmetic"`; `a.slot!==t.slot`; `e.classId&&s.classId&&e.classId!==s.classId`; `a.protected||t.protected`; `a.pendingAffixes||t.pendingAffixes`
- Numeric literals: `0`, `1`, `16`, `250`
- State writes: `i`

### `Km` — 167215–175043

- Conditions: `!["forge-buy","forge-transfer","forge-merge","forge-craft","forge-protect","forge-accept","forge-reject","forge-reroll","forge-salvage","forge-salvage-batch","forge-refine","forge- …`; `!a.room||a.dead`; `!o&&(a.realm||a.tribRun)`; `!o&&a.combatUntil>a.room.world.time`; `["forge-transfer","forge-merge","forge-craft","forge-reroll","forge-refine","forge-upgrade","upgrade"].includes(t)&&!Nm(a.room.map,a.x,a.y)`; `t==="forge-buy"`; `!k||!Number.isSafeInteger(y)||y<1||y>99`; `a.count(z)<k.price*y`; `t==="forge-merge"`; `!Number.isInteger(k)||k<1||k>=8`; `c("stone-"+k)<4`; `t==="forge-craft"`; `Object.hasOwn(Fu,n)`; `!k`; `a.level<(k.level??1)`; `!Number.isSafeInteger(y)||y<1||y>99`; `((m=a.forge.crafts)==null?void 0:m.week)===v`; `(m=a.forge.crafts)==null`; `k.limit`; `S<=0`; `k.powder`; `P<1`; `P<y`; `t==="forge-salvage-batch"`; `!Array.isArray(k)||!k.length||k.length>60||k.some(H=>typeof H!="string")`; `!L`; `dh(a,L)`; `y`; `v`; `$`
- Numeric literals: `1`, `0`, `99`, `8`, `4`, `60`, `16`, `3`, `5`, `65536`, `12`, `100`
- State writes: `a.forge`, `r[k]`, `a.dirty`, `m`, `$.counts[n]`, `a.forge.crafts`, `k`, `g`, `d`, `k.upgrade`, `k.forgeLedger`, `k.bound`, `u.upgrade`, `u.forgeLedger`, `u.bound`, `u.name`, `k.name`, `u.protected`, `u.affixes`, `f`, `u.affixes[y]`, `v`, `u.pendingAffixes`, `l`, `y`, `p`, `u.luck`

### `dh` — 175043–175525

- Conditions: `(a.worn instanceof Map?[...a.worn.values()]:Object.values(a.worn)).includes(t.uid)`; `a.worn instanceof Map`; `t.protected`; `Ba(t).length`; `r0(t.id)&&!Qe(t.id)`; `t.noSalvage&&!sm(t.uid)&&!((t.upgrade??0)>0)`; `((e=mt(t.id))==null?void 0:e.kind)==="cosmetic"`; `(e=mt(t.id))==null`; `!Qe(t.id)&&!im[t.grade]`
- Numeric literals: `0`
- State writes: `e`

### `Im` — 175525–175837

- Conditions: `(s=a.forgeLedger)!=null&&s.length`; `t||!!a.noSalvage&&!sm(a.uid)`; `t`
- Numeric literals: `0`, `16`, `0.5`
- State writes: `s`

### `gh` — 175837–176159

- Conditions: `t===null||t>=3||a.bound||a.protected||a.pendingAffixes||(a.upgrade??0)>0||Ba(a).length||a.setGrade!==void 0||(e=a.forgeLedger)!=null&&e.some(i=>i.energy>0)||(s=a.affixes)!=null&&s. …`; `n.stones||n.frags`
- Numeric literals: `3`, `0`
- State writes: `e`, `s`

### `qu` — 176159–176348

- Numeric literals: `0`
- State writes: `a.gear`, `a.dirty`

### `$k` — 177428–177482

- Conditions: `(t=fh[a])==null`
- Numeric literals: `0`
- State writes: `t`

### `Fm` — 177791–178038

- Numeric literals: `1`, `0`, `2`, `10`, `0.05`, `0.2`, `0.1`, `100`

### `Sk` — 178044–178085

- Numeric literals: `1`

### `qm` — 178086–179287

- Conditions: `s.gear.kt`; `h`; `o`; `s.mount`; `P==="atkPct"`; `P==="hpPct"`; `P==="armor"`; `s.tribs`; `y==="magic"`
- Numeric literals: `0`, `1`, `100`, `0.3`, `2`, `25`, `0.5`, `0.7`, `0.2`, `5`
- State writes: `p[P]`

### `Ck` — 179293–179408

- Conditions: `t.length`
- Numeric literals: `0`, `1`

### `wo` — 179409–179572

- Conditions: `t.up`; `t.affix&&a.affixes`; `t.gem`

### `pi` — 179573–180877

- Conditions: `a.gear.kt`; `o("tiemnang",e(s,a.attrs)),a.gear.kt`; `u.enh`; `u.set`; `u.aff`; `u.gem`
- Numeric literals: `0`, `1`
- State writes: `i`

### `Lk` — 181067–181198

- Conditions: `(n=t.bonus)==null`
- Numeric literals: `0`, `1`
- State writes: `n`

### `Pk` — 181199–181498

- Conditions: `(s=t==null?void 0:t.bag)==null`; `t==null`; `(c=t.worn)==null`; `(i=a.root)==null`
- Numeric literals: `0`
- State writes: `s`, `c`, `e[o]`, `i`

### `Ak` — 181504–181544

- Conditions: `Z.on`

### `Rk` — 181677–181869

- Numeric literals: `0`, `1`

### `ur` — 181869–182647

- Conditions: `es.includes(a)`; `e==null`; `s==null`; `p===0&&r.length`; `Z.on`
- Numeric literals: `1`, `0`, `2`

### `Nk` — 182647–182905

- Conditions: `o`
- Numeric literals: `0`
- State writes: `e[i]`, `s[i]`

### `Bk` — 182905–183275

- Conditions: `(r=fh[i])==null`; `(h=fh[i])==null`
- Numeric literals: `1`, `0`
- State writes: `r`, `h`

### `Gm` — 183482–183894

- Conditions: `$o`; `!To`; `!n`
- Numeric literals: `1`, `0`, `2`
- State writes: `$o`, `To`

### `Ou` — 183900–183935

- Numeric literals: `16384`, `32768`

### `Ns` — 184884–184955

- Conditions: `!t`
- Numeric literals: `0`

### `cr` — 185038–185087

- Numeric literals: `40`, `12`

### `Kk` — 185088–185139

- Numeric literals: `0`

### `Ik` — 185140–185208

- Numeric literals: `1`

### `Em` — 191252–191336

- Conditions: `e||Gk.has(t)`; `n`; `Ok.test(a)`

### `Ek` — 191336–191482

- Conditions: `Eu[t]!==void 0`; `s||a.startsWith("bay_gu_")`; `n`
- Numeric literals: `1`, `0`, `0.7`, `1.3`

### `Xk` — 191899–192232

- Conditions: `t+1>=Fi||n<1e3&&t+1>=y0`; `e==null`; `s<h`
- Numeric literals: `1`, `1000`, `0`, `5`
- State writes: `s`

### `zu` — 192317–192415

- Conditions: `Number.isFinite(e)&&e>=t&&e<=n`
- Numeric literals: `100`, `0`

### `Qk` — 192416–192761

- Conditions: `a&&typeof a=="object"`
- Numeric literals: `0`
- State writes: `n.range[s]`, `n.art[s]`

### `zk` — 192761–192900

- State writes: `qa`, `n.range`

### `_3` — 192916–192940

- Numeric literals: `1`

### `Xm` — 193526–193735

- Conditions: `a==="serpent"`; `o>=n`
- Numeric literals: `86400`, `0`, `2`, `3600`

### `Zk` — 193741–193780

- Conditions: `a==="serpent"`
- Numeric literals: `180`, `1`

### `ny` — 193874–194050

- Conditions: `t<=a[0][0]`; `t<=a[n][0]`
- Numeric literals: `0`, `1`

### `ey` — 194051–194092

- Conditions: `a<=99`
- Numeric literals: `99`, `25`, `1`

### `ay` — 194093–194168

- Numeric literals: `55`, `18`, `0`, `1`, `10`, `20`, `0.018`

### `sy` — 194169–194266

- Conditions: `a.roaming`
- Numeric literals: `150`, `0.75`, `100`

### `bi` — 194335–194628

- Numeric literals: `0`, `1`, `10000`, `100`

### `vi` — 194634–194710

- Numeric literals: `0`, `3`, `1`

### `hy` — 194711–194935

- Conditions: `a>=3600`
- Numeric literals: `0`, `3600`, `60`, `2`
- State writes: `a`

### `ry` — 194936–195040

- Conditions: `a*a+t*t<1e-6`
- Numeric literals: `0.000001`, `2`, `180`, `45`, `8`

### `uy` — 195111–195154

- Conditions: `t<=1`
- Numeric literals: `2`, `1`

### `cy` — 195163–195199

- Numeric literals: `0.12`, `0`, `1`

### `tc` — 195299–195361

- Conditions: `a<10`
- Numeric literals: `10`, `2`, `1`

### `ps` — 203881–203984

- Numeric literals: `0`

### `dy` — 206719–206740

- Numeric literals: `1000`

### `Zs` — 206741–206803

- Numeric literals: `0`
- State writes: `a.d`, `a.n`, `a.c`

### `ph` — 206803–206927

- Numeric literals: `0`

### `$t` — 206927–207346

- Conditions: `!e||!s||!(n>0)`; `i>=s.need`
- Numeric literals: `1`, `0`
- State writes: `e.n[t]`, `a.dirty`

### `gy` — 207346–207470

- Conditions: `i.endsWith(":")`
- State writes: `e`

### `bs` — 208905–208960

- State writes: `t`

### `Zn` — 208961–209913

- Conditions: `n.cls==="boss"`; `n.cls==="elite"`; `n.still`
- Numeric literals: `1`, `0.9`, `0.4`, `0`, `2.6`, `1.6`, `1.1`, `0.68`, `0.35`, `1.5`, `2.4`, `7`, `6`, `12`, `3`, `4`

### `ae` — 209913–209989

- Numeric literals: `0`, `1`

### `lr` — 209989–210233

- Conditions: `!(e!=null&&e.length)`
- Numeric literals: `0`, `3`, `0.5`, `1`, `5`

### `hs` — 210364–210469

- Numeric literals: `0.6`
- Event types: `root`

### `Lo` — 210701–210775

- Numeric literals: `1`

### `hc` — 210776–210986

- Conditions: `Math.hypot(m-r,g-h)<i*.6`
- Numeric literals: `0`, `0.000001`, `0.5`, `0.6`
- State writes: `r`, `h`, `c`

### `Iy` — 210986–213975

- Conditions: `!i.length`; `e.target&&!e.target.dead&&e.target.room===s`; `!u.pts.length`; `l===u.pts.length-1`; `g`; `t.pillars.some(c=>!c.dead&&s.monsters.includes(c))`
- Numeric literals: `0`, `2.4`, `6`, `2`, `1.9`, `8`, `5`, `1.5`, `1`, `0.5`, `100`, `180`, `2.6`, `10`, `1.4`, `0.95`, `1.2`, `1.1`, `3`, `2.5`, `12`, `4`, `0.9`, `0.6`
- State writes: `mr`, `e.st.stunUntil`, `e.st.rootUntil`, `t.adds`, `u.exp`, `u.target`, `u.notice`, `t.vents`, `t.pillars`, `d.exp`, `d.target`, `d.notice`, `e.bossWard`

### `Fy` — 213975–214366

- Conditions: `n.dead||o<n.invulnUntil||o<n.mobSafeUntil`
- Numeric literals: `0`, `1`, `1.9`
- State writes: `n.hp`, `n.combatUntil`
- Event types: `dmg`

### `qy` — 214366–215424

- Conditions: `e.slams=e.slams.filter(o=>o.id!==n.id),e.events.push({e:"fx",kind:n.kind==="vent"?"tox_erupt_m":"tox_erupt_l",x:n.x,y:n.y}),t.m.dead||n.vent&&n.vent.dead`; `n.kind==="vent"`; `!o.dead&&Math.hypot(o.x-n.x,o.y-n.y)<n.r+rt`; `n.kind==="phat"&&n.who&&n.who!==o||i.has(o)||(i.add(o),!Fy(a,t,o,n.hit,yy[n.kind]))`; `n.charge`
- Numeric literals: `2.2`, `100`, `1`, `0`
- State writes: `e.slams`, `t.m.x`, `t.m.y`, `t.m.tx`, `t.m.ty`, `t.m.st.rootUntil`, `t.m.st.stunUntil`
- Event types: `fx`, `root`

### `Oy` — 215424–215678

- Numeric literals: `0`
- State writes: `t.m.bossWard`, `t.room.slams`

### `Gy` — 215678–217151

- Conditions: `r.kind==="hut"&&r.pull`; `h.dead||m<.4||m>My`; `e.dead||!i.monsters.includes(e)`; `n.pillars.length&&!n.pillars.some(r=>!r.dead&&i.monsters.includes(r))`
- Numeric literals: `0.4`, `0.3`, `3`, `0`, `1`, `1.5`
- State writes: `[h.x,h.y]`, `n.strikes`, `n.pillars`, `e.bossWard`, `r.next`, `mr`, `n.next`, `e.attackCd`, `n.next[h]`

### `Ey` — 217189–217587

- Conditions: `t||rc.set(a,t=new Map((((e=a.data.quests.kt)==null?void 0:e.campBosses)??[]).map(s=>['${s.scene}:${s.name}',s.phases]))),!t.size`; `(e=a.data.quests.kt)==null`; `s.players.size`; `i.cls!=="boss"||i.dead||!i.target||n.has(i)`
- Numeric literals: `0`
- State writes: `t`, `e`

### `Zm` — 217959–218055

- Numeric literals: `1`, `0`

### `jn` — 218056–218118

- Numeric literals: `1000000000`, `0`

### `jy` — 218119–218600

- Conditions: `a&&typeof a=="object"`; `typeof t.day=="string"`; `t.victims&&typeof t.victims=="object"`
- Numeric literals: `0`, `100000`, `10`, `9000000000000000`, `40`
- State writes: `n.on`, `n.score`, `n.buff`, `n.day`, `n.dayPts`, `n.mobs`, `n.at`, `n.online`, `n.victims[e]`

### `Wy` — 218686–218749

- Numeric literals: `7`, `3600000`, `0`, `10`

### `Xy` — 218750–218962

- Numeric literals: `0`
- State writes: `a.day`, `a.dayPts`, `a.buff`

### `xi` — 218962–219041

- Numeric literals: `0`
- State writes: `a.score`, `a.buff`

### `Qy` — 219041–219254

- Conditions: `a.score<=0||Math.abs(t-n)>E.mobLevelGap`; `e`
- Numeric literals: `0`, `1`
- State writes: `a.mobs`, `s`

### `zy` — 219254–219452

- Conditions: `a.score<=0`
- Numeric literals: `0`, `1`
- State writes: `a.online`

### `Yy` — 219452–219659

- Conditions: `n<t.dsShieldUntil`; `(a.dsRetaliate.get(t)??0)>n`; `Rt(i)`; `Rt(s)&&!s.on`; `s.on&&i.on`
- Numeric literals: `1`, `0`

### `Jy` — 219659–220364

- Conditions: `!i.on`; `Rt(o)`; `t.level<E.victimMinLevel`; `Math.abs(t.level-a.level)>E.victimLevelGap`; `Object.hasOwn(i.victims,t.name)`; `h<E.sameVictimMs`; `c.length>60`; `t.cpEst<a.cpEst`
- Numeric literals: `0`, `60000`, `60`, `2`, `1`
- State writes: `s.r`, `i.victims[t.name]`

### `Wi` — 220418–220539

- Conditions: `!s`

### `Kt` — 220634–220658

- Conditions: `a`
- Numeric literals: `0`

### `fr` — 220682–221092

- Conditions: `!Oa.has(t)`; `i&&!ji.has(i)`; `o==null`
- Numeric literals: `0`, `1`
- State writes: `t.pending`, `t.meditating`, `t.harvest`, `t.dirty`
- Event types: `travel`

### `uc` — 221092–221230

- Conditions: `!e`
- Numeric literals: `4`, `32`, `2`, `0`
- State writes: `[a.x,a.y]`, `a.budget`, `a.dirty`

### `tp` — 221230–221332

- Numeric literals: `1`, `0`, `2`
- State writes: `t.dead`, `t.st`, `t.anim`, `t.invulnUntil`, `t.dirty`

### `rs` — 221332–221538

- Conditions: `n&&a.players.get(t.id)===t`
- Numeric literals: `1`, `0`, `3`
- State writes: `t.pending`, `t.dead`, `t.st`, `t.invulnUntil`, `t.dirty`

### `nd` — 222137–222446

- Conditions: `!a.dead||a.realm||!n||n.map.hub||n.map.noCombat||!n.map.pvp||n.map.pk==="safe"||Jt.has(n.scene)||Kt(n)||n.ktPk`; `e<=0`
- Numeric literals: `0`
- State writes: `a.xp`, `a.dirty`

### `sp` — 222504–222550

- Conditions: `t>=us`
- Numeric literals: `1`

### `ip` — 222551–222576

- Conditions: `a<=cc`
- Numeric literals: `1`

### `q3` — 222577–222721

- Conditions: `n>0`; `e`
- Numeric literals: `0`, `3600000`, `24`, `1`

### `hp` — 223102–223294

- Conditions: `!op.has(t)`; `a==="banghoi"`; `t.startsWith("war-")`; `a==="detu"`; `t==="break"`; `a==="loidai"||a==="tongkim"||a==="linhchau"`
- Numeric literals: `0`

### `rp` — 223294–223333

- Numeric literals: `1`

### `Bs` — 223361–223425

- Conditions: `Number.isFinite(a)`
- Numeric literals: `0`

### `cp` — 223456–223482

- Numeric literals: `1`

### `mc` — 223482–223513

- Numeric literals: `1`, `0`

### `lp` — 223927–224011

- Conditions: `!a`; `Number.isFinite(t)`

### `id` — 224165–224221

- Numeric literals: `0`, `1`

### `dp` — 224226–224305

- Conditions: `t<1`
- Numeric literals: `1`, `0`

### `od` — 224337–224378

- Numeric literals: `1`

### `gp` — 224413–224433

- Numeric literals: `1`

### `fp` — 224434–224499

- State writes: `a.ctx`

### `kp` — 224505–224624

- Conditions: `(e=a.room)==null`
- Numeric literals: `0`, `0.6`
- State writes: `e`

### `yp` — 224655–224710

- State writes: `t`

### `pp` — 224711–224979

- Conditions: `a.book.active().some(i=>i.goals.some((o,r)=>o[0]===n&&a.book.progress(i.id)[r]<o[2]))`
- Numeric literals: `0`, `2`
- State writes: `s`

### `vp` — 225285–225985

- Conditions: `a.time<(gc.get(a)??0)`; `(e=a.data.quests.kt)==null`; `i`; `i.m.dead`; `[...i.room.players].some(g=>!g.dead&&Math.hypot(g.x-i.m.x,g.y-i.m.y)<40)`; `!o||!o.players.size`; `!r`
- Numeric literals: `0`, `0.5`, `4`, `40`, `180`, `1`, `14`
- State writes: `e`, `i.quietSince`

### `xs` — 227100–227147

- Numeric literals: `7`, `3600000`, `86400000`

### `kc` — 227148–227190

- Numeric literals: `3`, `7`

### `xp` — 229005–229127

- Conditions: `!a.book.lock(Ne[t].scene)`
- Numeric literals: `1`, `0`

### `se` — 229274–229328

- Numeric literals: `0`

### `Tp` — 230000–230036

- Conditions: `a>=7`; `a>=4`
- Numeric literals: `7`, `4`

### `$p` — 230052–230083

- Numeric literals: `0`

### `Fn` — 230084–230603

- Conditions: `!sa(ie)`; `!s`; `s.day!==i&&(s.day=i,s.drops=0),!e&&s.drops>=vh`; `o.length&&Math.random()<.5`; `n==="bi-canh"`
- Numeric literals: `1`, `0`, `0.5`
- State writes: `s.day`, `s.drops`, `t.dirty`

### `Sp` — 230661–230854

- Conditions: `!(a.time<(vc.get(a)??0)||!sa(ie))`; `n>0`
- Numeric literals: `0`, `2`

### `Cp` — 233898–233977

- Conditions: `a.id==="linhdien"`
- Numeric literals: `2`, `1`

### `Hp` — 233977–234282

- Numeric literals: `200`, `1.8`, `10`, `24`, `3600`, `300`, `1.7`, `60`, `1`, `9`, `2`

### `Pp` — 234294–234330

- Numeric literals: `1`, `60`

### `vr` — 235167–235201

- Numeric literals: `12`, `5`, `1`

### `Rp` — 235202–235223

- Numeric literals: `4`

### `Np` — 235224–235257

- Numeric literals: `1`, `4`

### `_p` — 235280–235293

- Numeric literals: `20`, `10`

### `Dp` — 235300–235364

- Numeric literals: `60`, `1800`, `5`, `1`, `0.015`

### `hd` — 235365–235376

- Numeric literals: `0.02`

### `rd` — 235377–235388

- Numeric literals: `5`

### `wc` — 235389–235433

- Conditions: `a<=240`; `a<=1e3`; `a<=3e3`; `a<=6e3`
- Numeric literals: `240`, `1`, `1000`, `3`, `3000`, `6`, `6000`, `9`, `12`

### `Up` — 235434–235450

- Numeric literals: `0.15`, `0.025`

### `Kp` — 235451–235474

- Numeric literals: `8`, `3`

### `Tc` — 235475–235484

- Numeric literals: `2`

### `Ip` — 235491–235513

- Conditions: `a>=10`; `a>=5`
- Numeric literals: `10`, `2`, `5`, `1`, `0`

### `Fp` — 235514–235525

- Numeric literals: `0.02`

### `qp` — 235875–235951

- Numeric literals: `400`, `1.8`, `10`

### `Sc` — 236449–236472

- Numeric literals: `1`, `3`

### `Op` — 236473–236482

- Numeric literals: `3`

### `Gp` — 236483–236498

- Numeric literals: `2000`, `1`

### `Hc` — 236504–236514

- Numeric literals: `30`

### `Vp` — 236515–236591

- Conditions: `(t=br.find(n=>n.herb===a))==null`
- Numeric literals: `5`, `0`
- State writes: `t`

### `st` — 237536–237590

- Conditions: `typeof a=="number"&&Number.isFinite(a)`
- Numeric literals: `0`

### `jp` — 237591–237827

- Numeric literals: `1`, `0`

### `Wp` — 237827–239258

- Conditions: `a&&typeof a=="object"`; `(i=e.b)==null`; `(c=e.pl)==null`; `h&&Ms(h.s)`; `Array.isArray(e.pets)`; `Array.isArray(e.f)`; `Array.isArray(e.dec)`; `typeof e.ds=="string"&&n.dec.includes(e.ds)`
- Numeric literals: `1`, `0`, `60`
- State writes: `n.b[o.id]`, `i`, `n.up`, `n.tl`, `n.kp`, `n.pl`, `c`, `n.dan`, `n.dc`, `n.cp`, `n.eg`, `n.pets`, `n.act`, `n.f`, `n.d`, `n.dec`, `n.ds`, `n.seen`, `n.fo`, `n.au`

### `qn` — 241109–241175

- State writes: `t`

### `_e` — 241257–241405

- Conditions: `t`; `n`
- Numeric literals: `0`, `3600`, `60`, `1`
- State writes: `a`

### `Rc` — 241549–241645

- Conditions: `t`

### `Mr` — 241646–241925

- Conditions: `!dt`; `(i=Un.guard)==null`; `o`; `s>0`
- Numeric literals: `0`, `1`
- State writes: `i`, `e.changed`

### `Ro` — 241925–242644

- Conditions: `!dt`; `!n`; `n.up&&e>=n.up.end`; `n.pl.length<i`
- Numeric literals: `1`, `0`
- State writes: `n.b[n.up.b]`, `n.up`, `s`, `n.d`, `n.ds`, `t.dirty`

### `Qp` — 242644–243257

- Conditions: `o<=0||!i`; `s.got>=s.n`; `t.give(i.output,i.count*o+r),$t(t,Be),s.got<s.n`; `c<1`
- Numeric literals: `0`, `1`
- State writes: `n.dan`, `n.dc`

### `zp` — 243257–243558

- Conditions: `!i||e<o.readyAt(t.name,n,i)`; `(m=o.crops.get(r))==null`
- Numeric literals: `0`
- State writes: `m`, `s.pl[n]`, `o.changed`

### `No` — 243579–243646

- State writes: `t.m`, `t.room`

### `Yp` — 243647–243751

- Conditions: `a*a+t*t<1e-6`
- Numeric literals: `0.000001`, `2`, `180`, `45`, `8`

### `Jp` — 243752–244695

- Conditions: `!dt`; `n||(n={set:new Map,scan:0},Nc.set(a,n)),a.time>=n.scan`; `i!=null&&i.fo`; `!a.players.has(e.id)||!r||!o`; `!h||e.dead`; `Math.hypot(e.x-c.x,e.y-c.y)>9`; `g>.4`
- Numeric literals: `0`, `2`, `0.7`, `0.9`, `9`, `0.4`, `1`, `6.5`, `0.3`
- State writes: `n`, `n.scan`, `s.m`, `s.m.height`, `s.room`, `s.k`, `c.level`, `c.name`, `c.x`, `c.y`, `[c.x,c.y]`, `c.anim`, `c.dir`

### `Zp` — 251914–253635

- Conditions: `!h||e===t.name||!Number.isInteger(s)`; `!c`; `(v=Ms(u))==null`; `n==="water"`; `r>=k`; `p.w.includes(t.name)`; `p.w.length>=Bp`; `i.d.w>=xc`; `r<k`; `i.d.st>=Mc`; `p.st.includes(t.name)`; `p.st.length>=Np(d)`; `h.g&&Math.random()<h.g`
- Numeric literals: `0`, `1`
- State writes: `v`, `$`, `S`, `o.changed`, `t.dirty`, `y.dirty`, `P`

### `Th` — 253656–253917

- Conditions: `t`
- State writes: `t`

### `ya` — 253917–254107

- Conditions: `![t,n,e,s,i].every(Number.isFinite)||i<0||a.blocked(t,n,i)||a.blocked(e,s,i)`
- Numeric literals: `0`, `1`, `1e-9`

### `tb` — 254107–256514

- Conditions: `ya(a,t,n,e,s,i)`; `u<=0||m<=0`; `f[x]>=0`; `a.blocked(g(x),d(x),i)`; `K<0||R<0||K>=u||R>=m`; `k<0||y<0`; `!l(y)`; `B<0||j<0||B>=u||j>=m`; `x<0`; `!l(k)||!ya(a,t,n,g(k),d(k),i)`; `P[R][0]<=P[K][0]`; `P.length`; `R<P.length&&P[R][0]<P[U][0]&&(U=R),_<P.length&&P[_][0]<P[U][0]&&(U=_),U===K`; `S[x]`; `S[x]=1,x===y`; `!_&&!R`; `U<0||B<0||U>=u||B>=m`; `S[j]||!l(j)`; `_&&R`; `W>=v[j]||_&&R&&(!l(K*u+U)||!l(B*u+A))`; `D<0`
- Numeric literals: `0.5`, `8`, `0`, `128`, `1`, `3`, `2`, `0.414`, `6000`, `1.414`
- State writes: `f[x]`, `A`, `x`, `y`, `k`, `[P[R],P[K]]`, `K`, `P[0]`, `U`, `[P[U],P[K]]`, `v[k]`, `S[x]`, `D`, `v[j]`, `$[j]`, `[w,C]`

### `_c` — 256520–256611

- Conditions: `(t=a.kt.weapon)==null`
- Numeric literals: `0`
- State writes: `t`

### `ab` — 262710–262849

- Conditions: `t>=3`; `t>=6`
- Numeric literals: `3`, `1`, `0`, `6`, `8`

### `cs` — 262855–262868

- Numeric literals: `1`

### `ls` — 262875–262897

- Numeric literals: `10`, `1`

### `sb` — 262898–262924

- Numeric literals: `1`, `1000`

### `pe` — 262925–262967

- Numeric literals: `1`, `10`

### `oe` — 262968–263003

- Numeric literals: `2`

### `ib` — 263004–263113

- State writes: `t[n]`

### `Va` — 263134–263889

- Conditions: `f`; `e&&e.key===n`
- Numeric literals: `0`, `25`, `1`
- State writes: `g.cp`

### `ob` — 263922–264486

- Conditions: `!_s`; `(n=_s[a])==null`
- Numeric literals: `13`, `1`, `0`, `12`, `5`
- State writes: `_s`, `i[c]`, `e[c][s]`, `n`

### `$h` — 264486–264567

- Conditions: `t`
- Numeric literals: `0`

### `hb` — 264573–264620

- Conditions: `t`
- Numeric literals: `0`

### `cb` — 264651–264767

- Numeric literals: `0`, `1`

### `De` — 264773–264825

- Numeric literals: `12`, `1`

### `yd` — 264837–265122

- Conditions: `t!==void 0`
- Numeric literals: `0`, `1`
- State writes: `s[o]`

### `Sh` — 265128–265177

- Numeric literals: `12`, `1`

### `lb` — 265189–265350

- Conditions: `t!==void 0`
- Numeric literals: `0`, `1`

### `mb` — 265356–265392

- Numeric literals: `0`

### `V3` — 265393–265443

- Conditions: `a.duo.wk===t`
- Numeric literals: `0`

### `bd` — 265506–265637

- Conditions: `e`; `t==="guard"`
- Numeric literals: `0`

### `Ch` — 265730–265838

- Conditions: `n<a[e]`
- Numeric literals: `0`
- State writes: `n`

### `gb` — 265845–265888

- Numeric literals: `1`

### `fb` — 265889–265944

- Numeric literals: `300`, `1`, `2`

### `Ic` — 265945–265962

- Numeric literals: `50`, `1`, `2`

### `xd` — 266033–266132

- Conditions: `n<a[e]`
- Numeric literals: `10000`, `0`
- State writes: `n`

### `pb` — 266133–266318

- Conditions: `t+1>=vd`; `i>=ye`
- Numeric literals: `0`, `1`, `10`
- State writes: `i`, `t`

### `vb` — 266543–266575

- Conditions: `a<=1`; `a<=3`; `a<=6`
- Numeric literals: `1`, `0`, `3`, `6`, `2`

### `Mb` — 266583–267270

- Conditions: `n()<xb*t/4`; `c<.2`; `n()<.8`; `c<.6`
- Numeric literals: `0`, `40`, `1`, `0.25`, `2`, `3`, `4`, `0.2`, `0.8`, `0.6`, `0.05`
- State writes: `r`, `o`

### `Md` — 267556–267694

- Numeric literals: `1`, `0`

### `ct` — 267695–267796

- Conditions: `Number.isFinite(s)`

### `$b` — 267797–269750

- Conditions: `!a||typeof a!="object"`; `Array.isArray(n.list)`; `!k||typeof k.id!="string"||e.has(k.id)||!jt[k.sect]`; `(o=k.kt)==null`; `(r=k.enh)==null`; `(h=k.luck)==null`; `k.trip&&fd.includes(k.trip.h)&&Number.isFinite(k.trip.at)`; `typeof k.skin=="string"&&jt[k.sect].skins.includes(k.skin)`; `Number.isFinite(k.hurtUntil)`; `gd(k.job)&&!H`; `typeof n.active=="string"&&t.list.some(k=>k.id===n.active&&!k.trip)`; `Array.isArray(n.wait)`; `k==null`; `(c=n.duo)==null`; `typeof((u=n.duo)==null?void 0:u.day)=="string"`; `(u=n.duo)==null`; `(m=n.duo)==null`; `(g=n.duo)==null`; `(d=n.duo)==null`; `k.job&&(i.has(k.job)||k.id===t.active||k.trip)`; `(f=n.tower)==null`; `typeof((l=n.tower)==null?void 0:l.day)=="string"`; `(l=n.tower)==null`; `(p=n.tower)==null`; `typeof n.freeDay=="string"`
- Numeric literals: `0`, `12`, `4`, `100`, `24`, `1`, `10`, `1000000000000000`, `130`, `1000000000`
- State writes: `o`, `$[L]`, `r`, `S[L]`, `h`, `P[L]`, `t.active`, `t.wait`, `t.duo`, `c`, `u`, `m`, `g`, `d`, `t.tower`, `f`, `l`, `p`, `t.pity`, `t.pulls`, `t.freeDay`, `t.seq`

### `Sb` — 269750–269825

- Conditions: `t`
- Numeric literals: `1`
- State writes: `t.b`

### `Ci` — 269831–269872

- Numeric literals: `0`

### `wd` — 269873–270060

- Numeric literals: `1`, `0`, `9`

### `Xi` — 270061–270145

- State writes: `t`, `a.kt.detu`

### `Hi` — 270146–270196

- Numeric literals: `7`, `3600000`, `0`, `10`

### `Cb` — 270197–270398

- Numeric literals: `0`, `1`

### `he` — 270398–270897

- Conditions: `t=ct(t,0,4),i.list.length<cs(a)`; `(o=a.room)==null`; `i.wait.length>=Tr`
- Numeric literals: `1`, `0`, `4`
- State writes: `t`, `a.dirty`, `o`

### `Q` — 270903–270927

- Numeric literals: `1`

### `Us` — 270986–271076

- Conditions: `a.trip`; `(a.hurtUntil??0)>t`
- Numeric literals: `0`

### `qc` — 271076–271260

- Numeric literals: `0`, `10`, `1`
- State writes: `a.exp`

### `Lb` — 271501–272432

- Conditions: `n==="ten"`; `s.wait.length+o>Tr+Math.max(0,cs(t)-s.list.length)`; `n==="free"`; `s.freeDay===Hi(i)`; `n==="one"||n==="ten"`; `t.count(z)<u`; `h`
- Numeric literals: `10`, `1`, `0`
- State writes: `s.freeDay`, `r`, `s.pity`, `t.dirty`

### `Bo` — 272464–272901

- Conditions: `!o`; `i&&r.c&&(r.c=Pb(r.c,i)),o.bag.length>=Da`
- Numeric literals: `0`, `4`
- State writes: `r.c`, `a.dirty`

### `Oc` — 272901–273511

- Conditions: `o.error`; `a.count("Linh thạch")<o.silver||a.count(en)<o.stones`; `h&&a.count(Ws)<1`; `a.give("Linh thạch",-o.silver),a.give(en,-o.stones),Math.random()*100<o.chance`; `t.luck[n]=Math.min(100,i+lm(o.next)),h`; `r`; `c`
- Numeric literals: `0`, `1`, `100`
- State writes: `t.enh[n]`, `t.luck[n]`

### `Ab` — 273511–281599

- Conditions: `!h`; `d`; `!fd.includes(d)`; `o.active===h.id`; `f`; `!(h!=null&&h.trip)`; `r<d`; `s==="10"`; `h.lv>=10&&h.exp>=oe(h.tier,h.lv)`; `pe(h.tier,Math.min(10,h.lv+1))>t.level&&h.exp>=oe(h.tier,h.lv)`; `t.xp<f`; `h.lv<10||h.exp<oe(h.tier,h.lv)`; `h.tier+1>St[h.apt].cap`; `h.tier+1>=Ht.length||Ht[h.tier+1]>t.level`; `(u=i.live.m)==null`; `(m=i.live.m)==null`; `!d`; `!f`; `a.time<t.combatUntil`; `d.worn[f.s]===f.u`; `f.p`; `!oa(f.s,h.tier)`; `f.g>h.tier`; `!h||!Xr(s)`; `!d||!f`; `f.bag.length>=Da`; `!h||!Xr(f)`; `!oa(f,h.tier)`; `n==="enh"`; `S==="up"`
- Numeric literals: `0`, `3600000`, `60000`, `1`, `10`, `50`, `2`, `9`, `4`, `100`, `14`
- State writes: `o.active`, `i.live.hp`, `t.dirty`, `h.trip`, `t.xp`, `c`, `h.lv`, `h.exp`, `g`, `u`, `m`, `d.bag`, `f.b`, `h.kt[f.s]`, `f.day`, `f.used`, `f.best`, `d.day`, `d.used`, `d.wk`, `d.best`, `d.at`, `h.job`, `o.list`, `h.name`, `i.live.m.name`
- Event types: `fx`

### `Is` — 281645–281749

- Conditions: `a*a+t*t<1e-6`
- Numeric literals: `0.000001`, `2`, `180`, `45`, `8`

### `jc` — 281750–281824

- Numeric literals: `14`, `1.1`, `0`, `4`

### `ei` — 281825–281975

- Conditions: `a.collision.blocked(n,e,s)`; `a.collision.blocked(t.x,t.y,s)`

### `Fs` — 282003–282909

- Conditions: `e.foe!==s&&(e.foe=s,e.pts=[],e.at=0),u.blocked(n.x,n.y,h)`; `m<1e-4`; `!e.pts.length`; `((l-n.x)*(i-n.x)+(p-n.y)*(o-n.y))/m>=Math.min(r,m)*.5`; `c>=e.at&&c!==Wc&&(!e.pts.length||Math.hypot(i-e.gx,o-e.gy)>1)`; `f`; `!f||l>Nb`; `p<.08`; `$<k*.2`; `n.x=y,n.y=v,d=!0,g-=$,$<k-.001`; `d`
- Numeric literals: `0`, `1`, `0.0001`, `0.5`, `0.08`, `0.2`, `0.001`
- State writes: `e.foe`, `e.pts`, `e.at`, `[n.x,n.y]`, `n.x`, `n.y`, `Wc`, `e.gx`, `e.gy`, `p`, `k`, `d`, `g`

### `Le` — 282909–283153

- Numeric literals: `0`, `9`
- State writes: `t.beast`, `t.zones.length`, `t.ox`, `t.oy`, `t.route`, `t.broute`, `t.skip`, `t.ospd`, `t.oAt`, `t.m`, `t.room`, `t.target`, `t.given`

### `Bb` — 283153–288258

- Conditions: `!a.players.has(t.id)||!r`; `!h||h.trip`; `(h.hurtUntil??0)>s||Jt.has(r.scene)||t.dead`; `!o.m||o.room!==r`; `L`; `c>=o.ai`; `o.given>0`; `t.st.shieldUntil>c`; `A>0&&(o.hp-=A,o.given-=A),o.seen=x,x<=0&&(o.given=0),o.hp<=0`; `L&&(L.dead||Math.hypot(L.x-t.x,L.y-t.y)>Ks+1)&&(L=o.target=null),!L&&c>=o.seek`; `R.dead||R.owner||R===o.skip&&c<o.skipUntil||Math.abs(R.x-A)>Ks||Math.abs(R.y-K)>Ks`; `_>Ks||R.passive&&R.hp>=R.maxHp&&R.target!==t`; `R.target===t`; `A`; `c>=A.until`; `w&&C&&L&&c>=o.bcd&&Math.hypot(L.x-C.x,L.y-C.y)<=1.2+L.radius`; `!(c<(o.cd[x.id]??0))`; `x.kind==="heal"`; `!H||t.hp>=t.maxHp*.8`; `x.kind==="guard"`; `!H`; `!(!L||Math.hypot(L.x-u.x,L.y-u.y)>x.range+L.radius)`; `o.cd[x.id]=c+x.cd,u.anim=x===N.skills[0]?"attack":"cast",o.atkUntil=c+(x===N.skills[0]?.35:.6),x.blink`; `x===N.skills[0]`; `u.dir=Is(L.x-u.x,L.y-u.y),x.kind==="hit"`; `x.exec&&L.hp<L.maxHp*.35`; `x.kind==="zone"`; `x.range>2`; `m`; `e>0`
- Numeric literals: `1`, `0`, `1.6`, `0.3`, `0.25`, `1000`, `0.5`, `1000000000`, `4`, `7`, `0.05`, `0.9`, `0.2`, `1.2`, `0.8`, `0.6`, `0.35`, `0.4`, `5`, `2`, `3`, `0.001`, `0.18`, `7.5`, `6.5`, `0.7`, `8`
- State writes: `i.active`, `h.hurtUntil`, `o.hp`, `H.name`, `H.level`, `H.height`, `[H.x,H.y]`, `N.name`, `N.height`, `N.level`, `[N.x,N.y]`, `o.beast`, `o.m`, `o.room`, `o.maxHp`, `o.ai`, `u.level`, `u.set`, `o.given`, `o.seen`, `t.dirty`, `L`, `o.target`, `o.seek`, `x`, `o.cd.guard`, `o.bcd`, `C.anim`, `C.dir`, `o.cd[x.id]`, `u.anim`, `o.atkUntil`, `[u.x,u.y]`, `u.dir`, `o.ospd`, `o.ox`, `o.oy`, `o.oAt`, `o.skip`, `o.skipUntil`, `v.x`, `v.y`, `$`, `v.anim`, `v.dir`
- Event types: `fx`

### `Xc` — 288258–288521

- Conditions: `h(u)&&Math.abs(u.x-e)<=c+u.radius&&Math.abs(u.y-s)<=c+u.radius&&Math.hypot(u.x-e,u.y-s)<=c+u.radius`
- Numeric literals: `2`, `0`

### `$d` — 288521–289120

- Conditions: `n.dot&&e>0`; `c`; `i==="bleed"`; `t.st.slowUntil>s`
- Numeric literals: `0`, `1`, `6`
- State writes: `c.dps`, `c.until`, `t.st.stunUntil`, `t.windupAt`, `t.st.slowF`, `t.st.slowUntil`

### `Qc` — 289120–289367

- Conditions: `s<=0`; `a.st.shieldUntil>e`
- Numeric literals: `0`, `6`
- State writes: `a.st.shield`, `a.st.shieldUntil`, `t.given`, `t.seen`

### `_b` — 289367–289704

- Conditions: `n||(n={set:new Set,scan:0},Li.set(a,n)),a.time>=n.scan`; `!n.set.size`
- Numeric literals: `0`, `2`
- State writes: `n`, `n.scan`

### `$r` — 290921–291283

- Conditions: `a`
- Numeric literals: `0`, `15`, `1`, `500`, `2`, `5`, `10`, `13`, `3`, `8`
- State writes: `a`

### `tl` — 291660–292117

- Conditions: `!t`; `n`; `a%2`; `Jc[a]`; `Zc[a]!==void 0`; `a%3===0`; `a%3===1`
- Numeric literals: `10`, `0`, `20`, `2`, `300`, `40`, `5`, `360`, `80`, `60`, `3`, `1`, `16`, `84`

### `Gb` — 292123–292161

- Numeric literals: `0`

### `Vb` — 292223–292237

- Conditions: `a>=6`
- Numeric literals: `6`, `4`, `3`

### `Eb` — 292238–292463

- Numeric literals: `40`, `180`, `12`, `2`, `1`, `3`

### `Wb` — 293101–293271

- Conditions: `t+1>=jb`; `n<Ue[e].w`
- Numeric literals: `1`, `0`, `0.9999`, `10000`
- State writes: `n`

### `E3` — 293277–293324

- Numeric literals: `100`

### `zb` — 293376–293949

- Conditions: `t.kind==="tien"||t.kind==="thien"`; `t.kind==="tien"`; `h`; `h==="wait"`; `t.kind==="mount"`; `a.conBangUnlocked`; `s!==void 0`; `ze(a,s,n,e)`
- Numeric literals: `0`, `300`, `60`, `50`, `5`
- State writes: `a.conBangUnlocked`, `a.dirty`

### `Pd` — 295438–295713

- Numeric literals: `1`, `0`

### `va` — 295719–295781

- Conditions: `Array.isArray(a)`

### `Dt` — 295782–295824

- Conditions: `Number.isFinite(a)`
- Numeric literals: `0`

### `Yb` — 295825–297655

- Conditions: `!a||typeof a!="object"`; `(e=n.cards)==null`; `t.fund={bought:((s=n.fund)==null?void 0:s.bought)===!0,claimed:va((i=n.fund)==null?void 0:i.claimed)},n.pass&&(t.pass={season:Dt(n.pass.season,-1),pts:Math.max(0,Dt(n.pass.pts)),pr …`; `(s=n.fund)==null`; `(i=n.fund)==null`; `(o=n.pass.seen)==null`; `(r=n.pass.seen)==null`; `(h=n.pass.seen)==null`; `(c=n.pass.seen)==null`; `Array.isArray(n.awards)`; `Array.isArray(n.cos)`; `(u=n.wheel)==null`; `(m=n.wheel)==null`; `typeof((g=n.open)==null?void 0:g.id)=="string"`; `(g=n.open)==null`; `(d=n.open)==null`
- Numeric literals: `0`, `1`, `30`, `40`
- State writes: `e`, `t.cards[f]`, `t.fund`, `s`, `i`, `t.pass`, `o`, `r`, `h`, `c`, `t.packs.realm`, `t.packs.bought`, `t.packs.openAt[f]`, `t.vipDay`, `t.vipSeen`, `t.shop[f]`, `t.awards`, `t.buys[f]`, `t.denbu`, `t.denbuInfo`, `t.expX2Until`, `t.goldAura`, `t.enhAtTrucCo`, `t.chest[f]`, `t.cos`, `t.wheel`, `u`, `m`, `t.open`, `g`, `d`

### `Cr` — 297667–297713

- State writes: `t`, `t[Qt]`

### `Jb` — 297714–297775

- Numeric literals: `0`

### `Xt` — 297797–297891

- Numeric literals: `0`
- State writes: `a.donation.bound[z]`, `a.dirty`

### `ln` — 297891–298015

- Conditions: `!Number.isSafeInteger(t)||t<0`; `t`; `n==="free"`; `a.count(z)<t`
- Numeric literals: `0`, `1`

### `Cn` — 298041–298079

- Numeric literals: `0`, `1`
- State writes: `a.buys[t]`

### `Rd` — 298080–298153

- Numeric literals: `0`

### `nv` — 298166–298272

- Conditions: `n!=null&&n.expX2Until&&t<n.expX2Until&&a.level<tv`
- Numeric literals: `2`, `1`

### `Do` — 298272–298424

- Conditions: `(s=a.room)==null`; `!t||!n`; `Object.keys(Ea).some(i=>Rd(t,i,e))`
- Numeric literals: `0`, `1`
- State writes: `s`

### `ev` — 298424–298830

- Numeric literals: `0`, `1`
- State writes: `a.conBangUnlocked`, `e`, `a.dirty`

### `Nd` — 298830–299962

- Conditions: `n.enhAtTrucCo&&V(t.level)>=1`; `g`; `n.packs.realm<0`; `u>n.packs.realm`; `m!==n.vipSeen`
- Numeric literals: `1`, `0`, `8`
- State writes: `g.enh[d]`, `n.enhAtTrucCo`, `t.dirty`, `n.pass`, `o.day`, `o.d`, `o.week`, `o.w`, `n.pass.pts`, `n.packs.realm`, `n.packs.openAt[g]`, `n.vipSeen`

### `av` — 299962–300618

- Conditions: `!Nn(a)`; `!(n.perGen>0&&n.price>0)`; `o+e>n.perGen`; `Ki(a)<e`; `!ln(a,n.price*e,n.pay)`; `n.pay==="free"`
- Numeric literals: `0`
- State writes: `t.chest[i]`, `a.dirty`

### `sv` — 300618–301078

- Conditions: `!ns.includes(n)`; `o>=e.perGen`; `!ln(a,e.price,e.pay)`
- Numeric literals: `0`, `1`
- State writes: `t.chest[i]`, `a.donation.bound[r]`, `a.dirty`

### `iv` — 301078–305715

- Conditions: `t.dead||t.realm||t.tribRun`; `!h`; `i.vipDay===o`; `!c`; `h==="life"&&u`; `u&&u.until>=0&&u.until-o>=60`; `!ln(t,c.price,"free")`; `u&&u.until>=o`; `h==="life"`; `u==null`; `i.fund.bought`; `!ln(t,zc,"free")`; `!i.fund.bought`; `i.pass.premium`; `!ln(t,Yc,"free")`; `!i.pass.free.includes(g)`; `i.pass.premium&&!i.pass.prem.includes(g)`; `!u`; `!ai[h]||!c`; `Date.now()>c+Ld*Ub`; `i.packs.bought.includes(h)`; `!ln(t,ai[h],"free")`; `e===gm.id`; `h`; `c`; `fe(t,h)`; `!ln(t,Ho,"free")`; `e==="ten"`; `h===10`; `!ln(t,c,"any")`
- Numeric literals: `0`, `60`, `1`, `20`, `10`, `99`
- State writes: `i.vipDay`, `t.dirty`, `i.cards[h]`, `u.last`, `i.fund.bought`, `i.pass.premium`, `i.wheel.pity`

### `ov` — 305715–306414

- Conditions: `e.minRealm&&V(t.level)<e.minRealm`; `e.limit`; `e.limit.per==="day"`; `e.limit.per==="week"`; `((u=n.shop[e.id])==null?void 0:u.k)===r`; `(u=n.shop[e.id])==null`; `e.limit&&h+s>e.limit.n`; `!ln(t,c,e.pay)`; `e.pay==="free"`
- Numeric literals: `0`
- State writes: `u`, `n.shop[e.id]`, `n.buys["shop-"+e.id]`, `t.dirty`

### `dv` — 307425–307485

- Numeric literals: `3600`

### `sl` — 307486–307529

- Numeric literals: `0`

### `Ko` — 307530–307609

- Conditions: `typeof a=="number"&&Number.isSafeInteger(a)&&a>=0`
- Numeric literals: `1000000`, `0`

### `zi` — 307610–307722

- State writes: `n`, `a.kt[Ph]`

### `Hr` — 307722–307942

- Numeric literals: `0`

### `_d` — 307942–308109

- Conditions: `n.tokens>=Ah`; `a.count(an)<1`
- Numeric literals: `1`, `0`
- State writes: `a.dirty`

### `gv` — 308109–308408

- Conditions: `e.runs.includes(n)`; `s.left>0||a.count(an)>0&&s.tokenLeft>0`; `s.tokenLeft>0`
- Numeric literals: `0`

### `fv` — 308408–308506

- Numeric literals: `0`
- State writes: `a.dirty`

### `Dd` — 309007–309090

- Conditions: `t>0`
- Numeric literals: `0`

### `yv` — 309091–309404

- Conditions: `t<=0`
- Numeric literals: `0`
- State writes: `e`

### `pv` — 309404–309768

- Conditions: `t<=0`; `e.bag.length<Da`
- Numeric literals: `0`, `1`
- State writes: `a.kt`, `n[Qr]`

### `Lr` — 310093–310135

- Numeric literals: `3600`

### `La` — 310135–310251

- Conditions: `n.length`
- Numeric literals: `1`, `0`

### `Fo` — 310274–310387

- Conditions: `n!==void 0`
- Numeric literals: `0`

### `W3` — 310393–310495

- Conditions: `a<t`; `a<t+Pi`
- Numeric literals: `3600`

### `il` — 310496–310642

- Numeric literals: `3600`, `2`, `60`

### `Ma` — 311356–311422

- Numeric literals: `0`

### `wv` — 311423–311475

- Numeric literals: `0`

### `hl` — 311527–311575

- Conditions: `a.early&&Math.random()>=Tv`
- Numeric literals: `0`

### `ja` — 311576–311616

- Numeric literals: `1`

### `Sv` — 312166–312195

- Conditions: `a<=rl[0]`; `a<=rl[1]`
- Numeric literals: `0`, `3`, `1`, `2`

### `Iv` — 312617–312666

- Numeric literals: `2`, `0`

### `Fv` — 312667–312708

- Conditions: `a===0`; `a===1`; `t<.5`
- Numeric literals: `0`, `1`, `0.5`, `2`, `3`

### `fl` — 312786–312936

- Conditions: `n>=2`
- Numeric literals: `2`, `60`, `30`, `1`, `0`, `0.5`, `6`, `3`

### `kl` — 312937–313029

- Conditions: `Y[a].max>=160&&n()<.02`; `Y[a].max>=120&&n()<.06`; `n()<Yn[t].gold`
- Numeric literals: `160`, `0.02`, `6`, `120`, `0.06`, `5`, `4`, `3`

### `Wv` — 313030–313088

- Conditions: `t<.05`; `t<.35`
- Numeric literals: `0.05`, `6`, `0.35`, `5`, `4`

### `Xv` — 313096–313276

- Conditions: `!Number.isFinite(s)||s<=0`
- Numeric literals: `0`, `1e-9`

### `Go` — 313276–313655

- Conditions: `n<=0||!t.length||a<=0`; `i<=0`
- Numeric literals: `0`, `1e-9`

### `yl` — 313655–313801

- Conditions: `Number.isSafeInteger(s)&&s>0`
- Numeric literals: `0`
- State writes: `a["essence-credit"]`

### `pl` — 313807–313883

- Conditions: `n()<e-s`
- Numeric literals: `1`, `0`

### `Qv` — 313884–314146

- Numeric literals: `0`

### `ds` — 314152–314250

- Conditions: `(t=ta[a])==null`; `(n=Za[a])==null`
- Numeric literals: `0`, `1`
- State writes: `t`, `n`

### `mn` — 314251–315420

- Conditions: `!y.wheel&&y.rarity<=t&&y.level<=r`; `!d.size`; `de[t]>r`; `t>0`; `(k=mn(a,t-1,"armor",e,s,r))==null`; `!Ye.some(v=>v.id!=="set-kim-van"&&!nh.has(v.id)&&v.rarity===t)&&t>3`; `(y=mn(a,t-1,"armor",e,s,r))==null`; `v.id!=="set-kim-van"&&!nh.has(v.id)&&v.rarity===t`; `f`; `n==="weapon"`; `n==="armor"`; `s()<.5`
- Numeric literals: `1`, `0`, `3`, `0.5`
- State writes: `k`, `y`, `l.noSalvage`

### `zv` — 315426–315485

- Numeric literals: `8`, `40`

### `Vo` — 315486–315656

- Conditions: `t>3`; `s`
- Numeric literals: `3`

### `bl` — 315657–315824

- Conditions: `e()<.5`
- Numeric literals: `0`, `5`, `2`, `0.5`, `1`, `3`

### `Yv` — 315830–315987

- Conditions: `n===e`
- Numeric literals: `2`

### `Jv` — 315988–316121

- Numeric literals: `8`, `4`, `2`, `1`, `5`

### `Zv` — 316122–316302

- Conditions: `e()<Ev[t-1]`
- Numeric literals: `1`, `3`, `10`, `20`
- State writes: `s.gear`

### `dn` — 316626–316981

- Conditions: `a.kind==="material"`; `a.kind==="potion"`
- Numeric literals: `0`, `5`, `2`, `31`, `1`

### `ax` — 317733–317755

- Conditions: `a<.7`; `a<.95`
- Numeric literals: `0.7`, `0`, `0.95`, `1`, `2`

### `xl` — 317756–317786

- Conditions: `a<.65`; `a<.9`; `a<.99`
- Numeric literals: `0.65`, `0`, `0.9`, `1`, `0.99`, `2`, `3`

### `wl` — 317910–318075

- Conditions: `s`
- Numeric literals: `4`, `1`

### `Qa` — 356226–356298

- Numeric literals: `0`, `24`

### `rx` — 357967–358131

- Conditions: `a.gear`; `a.upgrade`; `a.amount>1`
- Numeric literals: `1`

### `Ar` — 358873–358946

- Conditions: `t&&a>=ue[5].min`; `a>=e.min`
- Numeric literals: `5`, `0`

### `Id` — 358996–359052

- Numeric literals: `0`

### `ux` — 359053–359085

- Numeric literals: `1`

### `Fd` — 359086–359132

- Numeric literals: `0`, `10`

### `qd` — 359133–359169

- Numeric literals: `3`, `7`

### `Ni` — 359170–359208

- Numeric literals: `6`, `7`

### `lx` — 359361–359537

- Conditions: `Ni(e)===O.fairDay&&e+(O.fairTo-O.fairFrom)*Ri>a`
- Numeric literals: `0`, `7`

### `ut` — 359543–359644

- Conditions: `Number.isFinite(s)`
- Numeric literals: `0`

### `mx` — 359645–359766

- Numeric literals: `0`, `1`

### `dx` — 359767–360759

- Conditions: `a&&typeof a=="object"`; `typeof t.hd=="string"`; `t.opp&&typeof t.opp=="object"`; `Array.isArray(t.h)`; `i.k==="w"||i.k==="l"`; `i.f`; `(e=t.seal)==null`; `(s=t.seal)==null`
- Numeric literals: `0`, `10000`, `100000`, `10000000`, `1000000000`, `10`, `1000000`, `80`, `40`, `1000`, `1`, `20`, `500`, `100000000000`, `1000000000000`
- State writes: `n.s`, `n.r`, `n.pk`, `n.w`, `n.l`, `n.d`, `n.hon`, `n.hd`, `n.hn`, `n.opp[i]`, `n.fw`, `n.fwn`, `n.fln`, `n.rw`, `n.h`, `n.seal`, `e`, `s`, `n.cur`

### `gx` — 360801–360896

- Numeric literals: `1`, `0`

### `ft` — 360897–361088

- Numeric literals: `1000`, `1`, `0`
- State writes: `t`

### `Rr` — 361161–361358

- Conditions: `n[0]<e[0]`
- Numeric literals: `1`, `0`
- State writes: `t.top`

### `kx` — 361364–361454

- Conditions: `e>=0&&n[e][1]>=ue[5].min`
- Numeric literals: `0`, `1`, `5`

### `Nr` — 361455–361635

- Numeric literals: `0`
- State writes: `r`, `r[t]`, `i.changed`

### `Gd` — 361635–362036

- Conditions: `e!=null&&e.length`; `In(t.titles,s.id,s.at,s.week)`; `s.id==="tien-de"`; `s.id==="cong-bang"`
- Numeric literals: `0`
- State writes: `i.expiresAt`, `n.changed`, `t.dirty`

### `_h` — 362036–362239

- Conditions: `!s||t<=0`; `n`
- Numeric literals: `0`
- State writes: `s.hd`, `s.hn`, `s.opp`, `a.dirty`

### `yx` — 362453–362803

- Conditions: `t!=="def"&&t!=="atk"`; `e>=ce.cost.length`; `n.hon<i`
- Numeric literals: `1`, `0`, `1000`, `10`
- State writes: `n.hon`, `n.seal[t]`, `a.dirty`

### `Vd` — 362820–362966

- Numeric literals: `1`, `0`
- State writes: `e`

### `Ed` — 362987–363641

- Conditions: `(s=n.wheel)==null`; `a.gm.speed`; `a.def.id==="ky-mon"`; `t`
- Numeric literals: `1`, `25`, `0`, `2`, `5`, `0.012`, `1.2`
- State writes: `a.maxHp`, `a.atkMult`, `a.atk`, `a.armor`, `a.defense`, `a.dmgScale`, `a.crit`, `a.critDmg`, `a.lifesteal`, `a.bonus`, `a.pas`, `a.wheelId`, `s`, `a.move`, `a.maxMp`, `a.healK`, `a.hp`, `a.mp`, `a.dirty`

### `jd` — 363790–364096

- Conditions: `V(t.level)<O.minRealm`; `n&&!Od(a.epoch()*1e3)`; `t.dead`; `t.realm||t.tribRun`; `gr(t)`; `t.dosat.on`
- Numeric literals: `1000`

### `bx` — 364102–364184

- Numeric literals: `1`

### `vx` — 364185–364420

- Conditions: `a>=O.cpGapAfterSec`
- Numeric literals: `0`, `1`

### `xx` — 364420–365136

- Conditions: `s.has(i)`; `c===i||s.has(c)||o.fair!==u.fair||i.party&&i.party===c.party`; `o.fair`; `V(i.level)!==V(c.level)`; `!bx(i,c,m.cp)||Math.abs(g-d)>m.r`
- Numeric literals: `0`, `1`, `100`, `4`
- State writes: `h`, `r`

### `Mx` — 365136–365645

- Conditions: `!r`; `e`; `m===t`
- Numeric literals: `2`, `1`, `6`, `0`
- State writes: `m.st.stunUntil`, `m.cd`, `m.invulnUntil`

### `wx` — 365645–366282

- Conditions: `t.rated=!t.fair&&(s.opp[t.b.name]??0)<O.sameOppPerDay&&(i.opp[t.a.name]??0)<O.sameOppPerDay,s.opp[t.b.name]=(s.opp[t.b.name]??0)+1,i.opp[t.a.name]=(i.opp[t.a.name]??0)+1,t.rated`; `t.rated||t.fair`
- Numeric literals: `1000`, `0`, `1`
- State writes: `t.phase`, `t.at`, `t.ends`, `o.hd`, `o.hn`, `o.opp`, `t.rated`, `s.opp[t.b.name]`, `i.opp[t.a.name]`, `h.cur`, `h.r`, `o.dirty`, `o.invulnUntil`

### `Wd` — 366288–366392

- Conditions: `a.w+a.l+a.d<O.newGames`
- Numeric literals: `1`, `10`, `400`

### `za` — 366393–368025

- Conditions: `t.phase==="end"`; `!s&&!n`; `((h=Mt(t.a).cur)==null?void 0:h.id)===t.id`; `(h=Mt(t.a).cur)==null`; `((c=Mt(t.b).cur)==null?void 0:c.id)===t.id`; `(c=Mt(t.b).cur)==null`; `n`; `n===d`; `y==="w"`; `y==="d"`; `(u=k.cur)==null`; `y==="l"`; `t.fair`; `a.record(d,"loidai-match"),y==="w"&&a.record(d,t.fair?"loidai-fair-win":"loidai-win"),t.rated`; `t.rated`; `$>=0`; `S`
- Numeric literals: `1000`, `0`, `1`, `0.5`
- State writes: `t.phase`, `t.at`, `t.ends`, `t.result`, `h`, `c`, `u`, `k.r`, `k.l`, `k.cur`, `$`, `k.pk`, `i.ladder.board[d.name]`, `i.changed`, `i.top`, `k.fw`, `k.fwn`, `k.fln`, `i.ladder.fair`, `m`, `g`, `m[g]`, `S`, `k.h.length`, `d.dirty`

### `Xd` — 368025–368253

- Conditions: `e.room===t.room||a.players.get(e.id)!==e`
- Numeric literals: `1`
- State writes: `n.matches`

### `Tx` — 368320–368954

- Conditions: `t.phase!=="end"&&a.rooms.get(t.key)!==t.room&&a.rooms.set(t.key,t.room),t.phase!=="end"`; `e||s`; `e&&s`; `e`; `t.fair`; `t.phase==="ready"&&n>=t.ends`; `t.phase==="fight"`; `t.a.dead||t.b.dead`; `t.a.dead&&t.b.dead`; `t.a.dead`; `n>=t.ends`; `Math.abs(e-s)<=O.drawHp`; `e>s`
- Numeric literals: `1`

### `$x` — 368954–369123

- Conditions: `t===e.a`

### `Sx` — 369123–369913

- Conditions: `e>t.ladder.season`; `i[0]`; `s.week&&t.ladder.fairPaid!==s.week&&(s.week<qd(n)||cx(n))`
- Numeric literals: `1000`, `1`, `5`, `0`
- State writes: `t.ladder`, `t.changed`, `t.top`, `t.ladder.fairPaid`
- Event types: `chat`

### `Cl` — 369913–370455

- Conditions: `!e||(n.ladder.titles[t.name]&&Gd(a,t),e.s>=s)`; `e.rw<e.s&&i>=O.minSeasonGames`; `e.hon+=ue[r].honor,e.rw=e.s,r===5`
- Numeric literals: `5`, `1000`, `2`, `0`
- State writes: `e.rw`, `e.r`, `e.pk`, `e.w`, `e.l`, `e.d`, `e.s`, `e.cur`, `t.dirty`

### `Qd` — 373082–373120

- Numeric literals: `6`, `7`

### `Cx` — 373121–373280

- Conditions: `q.days.includes(Qd(n))&&a>=n-q.signupMin*be&&a<n+q.fightMin*be+q.closeSec*1e3`
- Numeric literals: `3600000`, `1000`

### `Hx` — 373280–373448

- Conditions: `q.days.includes(Qd(e))&&e+q.fightMin*be>a`
- Numeric literals: `0`, `7`, `3600000`

### `Zt` — 373591–373693

- Numeric literals: `0`
- State writes: `t`

### `xe` — 373694–373713

- Numeric literals: `1000`

### `Px` — 373714–373811

- Conditions: `(e=n.mem.get(t))==null`
- Numeric literals: `0`
- State writes: `e`

### `Yd` — 373812–373920

- Conditions: `t.forced!==null&&n<t.forced+q.fightMin*be+q.closeSec*1e3`
- Numeric literals: `1000`

### `Ax` — 373921–374306

- Conditions: `i`; `o`
- Numeric literals: `0`, `1`
- State writes: `i`

### `Bi` — 374312–374421

- Numeric literals: `0`

### `Rx` — 374422–374598

- Conditions: `t.party`; `s.here&&s.p.party===t.party`; `n.cp!==e.cp`; `n.cp<e.cp`; `n.n<=e.n`
- Numeric literals: `0`, `1`

### `Ll` — 374621–374675

- Numeric literals: `0`, `1`

### `Nx` — 374744–375768

- Conditions: `n===null`; `e>=n+q.fightMin*be`; `V(t.level)<q.minRealm`; `t.dead`; `t.realm||t.tribRun`; `gr(t)`; `s>=0`; `!i`; `o!=null&&o.afk`
- Numeric literals: `0`, `1`, `0.5`, `3`
- State writes: `o`, `o.p`, `o.here`, `o.active`, `t.dosat.on`, `[o.lx,o.ly]`

### `fs` — 375768–375884

- Numeric literals: `1`
- State writes: `n.here`

### `Bx` — 375910–376352

- Conditions: `t.phase!=="fight"||n.side===e.side`
- Numeric literals: `5`, `0`
- State writes: `n.best`, `e.streak`, `e.deadAt`

### `_x` — 376352–377005

- Conditions: `i[0]&&!i[1]`; `i[1]&&!i[0]`; `o>=0`; `o===0`; `e.prog=Math.max(-1,Math.min(1,e.prog+r*h)),e.owner!==o&&Math.abs(e.prog)>=1`
- Numeric literals: `0`, `1`, `2`, `0.25`
- State writes: `e.prog`, `e.owner`, `e.hold`

### `Dx` — 377005–378090

- Conditions: `xe(a)>=t.nextCart`; `s.length&&!i.length`; `r>0&&e.x>=o||r<0&&e.x<=o`; `i.length&&!s.length&&++e.alone>=q.cartLostSec`
- Numeric literals: `1000`, `0`, `1`
- State writes: `e.alone`, `h.escort`, `t.carts`

### `Ux` — 378090–378679

- Conditions: `!n.here`; `a.players.get(e.id)!==e||e.room!==t.room`; `e.dead`; `n.deadAt||(n.deadAt=a.time),a.time-n.deadAt>=q.respawnSec`; `n.deadAt`
- Numeric literals: `0`, `0.3`, `60`
- State writes: `n.deadAt`, `n.active`, `n.lx`, `n.ly`, `n.afk`

### `Kx` — 378679–379702

- Conditions: `t.score[0]===t.score[1]`; `t.score[0]>t.score[1]`; `r.pts<s.minPts`; `t.winner===-1`; `t.winner===r.side`; `i`
- Numeric literals: `0`, `1`, `3600000`
- State writes: `t.phase`, `t.closeAt`, `t.winner`
- Event types: `chat`

### `Ix` — 379702–380228

- Conditions: `t.phase!=="end"&&a.rooms.get(t.key)!==t.room&&a.rooms.set(t.key,t.room),t.phase==="signup"&&n>=t.start`; `Ux(a,t),t.phase==="fight"`; `t.phase==="end"&&a.time>=t.closeAt`
- Numeric literals: `0`
- State writes: `t.phase`, `t.nextCart`, `e.active`, `t.view`

### `Fx` — 380228–380710

- Conditions: `a.view&&a.view.at===t.time`; `a.phase==="signup"`
- Numeric literals: `0`, `5`, `1000`, `100`, `10`, `1`
- State writes: `a.view`

### `Vx` — 382546–382606

- Numeric literals: `2`, `1`

### `Uh` — 382670–382734

- Conditions: `a`; `(t=ra.get(a))==null`
- Numeric literals: `0`
- State writes: `t`

### `Al` — 382735–382829

- Numeric literals: `0`
- State writes: `n.th`, `qn(a).changed`

### `ne` — 382835–382905

- Conditions: `t==null`
- Numeric literals: `0`

### `jx` — 382906–383298

- Conditions: `i&&i.room.scene===s&&a.rooms.get(e)===i.room||i&&i.room.players.size`; `!o`
- Numeric literals: `0`, `1`, `1000`
- State writes: `r.monsters.length`, `r.wb`

### `ii` — 383298–383942

- Conditions: `t.dead||t.tribRun`; `!s`; `!Xe.has(t)`; `i&&!ra.has(i)&&!Dh(i.scene)`; `o==null`
- Numeric literals: `1`, `0`
- State writes: `t.pending`, `t.meditating`, `t.harvest`, `t.dirty`
- Event types: `travel`

### `Jd` — 383942–384219

- Conditions: `(e=a.data.maps.get("SuoiDa_CharacterTest"))==null`; `(s=a.data.maps.get("SuoiDa_CharacterTest"))==null`
- Numeric literals: `0`
- State writes: `e`, `s`, `t.pending`

### `Wx` — 384219–384318

- Conditions: `ra.has(n)||Dh(n.scene)`; `Dh(e)`
- Numeric literals: `0`, `1`

### `Yi` — 386511–386566

- State writes: `t`

### `Yx` — 386582–386652

- Conditions: `(t=a.data.quests.kt)==null`
- Numeric literals: `0`
- State writes: `t`

### `Jx` — 386726–386832

- Numeric literals: `0`, `2`

### `Zx` — 386833–386952

- Conditions: `(e=a.room)==null`
- Numeric literals: `0`, `0.6`
- State writes: `e`

### `t5` — 386953–387386

- Conditions: `(r=a.data.camps[t.scene])==null`
- Numeric literals: `0`, `0.5`, `1`, `7`, `4`, `2`, `6`, `5`
- State writes: `r`

### `Zd` — 387386–387990

- Conditions: `t.stage<t.def.waves.length`; `o<i.n`; `o.mirror&&i`; `o.mirror`
- Numeric literals: `0`, `2`, `2.2`, `1`, `0.6`, `0.4`, `1.9`

### `Bl` — 387990–388138

- Conditions: `n.room===t.room`
- State writes: `n.pending`

### `n5` — 388138–389170

- Conditions: `!e`; `oi(a,t)||Kt(t.room)`; `!s`; `!Zx(t,e.npc)`; `t.dead||t.tribRun||t.realm`; `!i`; `!r`; `(g=t.party)==null`
- Numeric literals: `0`, `1`, `60`
- State writes: `g`

### `e5` — 389170–389986

- Conditions: `!t.members.size||a.time>t.endAt`; `t.doneAt`; `!t.mobs.filter(e=>!e.dead).length`; `t.mobs=[],t.stage<t.def.waves.length`; `t.stage<t.def.waves.length`
- Numeric literals: `1`, `0`
- State writes: `e.pending`, `t.mobs`, `t.doneAt`, `e.dirty`

### `i5` — 390741–390780

- Numeric literals: `0`

### `o5` — 390781–390805

- Numeric literals: `86400000`

### `d5` — 392812–392987

- Conditions: `(e-=i)<0`
- Numeric literals: `0`
- State writes: `e`

### `g5` — 392987–393592

- Conditions: `!s||m5(t)||s.active`; `s.day!==i&&(s.day=i,s.today=0),s.today>=r5||(s.tries++,!e&&s.tries<h5&&Math.random()>=n)`
- Numeric literals: `1`, `0`, `2`, `2.5`, `0.4`, `10`, `1000`
- State writes: `s.day`, `s.today`, `s.active`, `s.tries`, `t.dirty`
- Event types: `fx`

### `f5` — 393592–394376

- Conditions: `i>=Fh`; `V(t.level)>=2`; `r<(h?.08:.02)`; `h`; `r<(h?.35:.2)`; `(o=pn.disciple)==null`
- Numeric literals: `0`, `5`, `1`, `3`, `2`, `0.08`, `0.02`, `0.35`, `0.2`
- State writes: `n.active`, `n.log`, `t.dirty`, `o`

### `_l` — 396435–396520

- Conditions: `a==null`; `Number.isFinite(t)`
- Numeric literals: `0`

### `k5` — 398313–398652

- Conditions: `s.id==="lucchien"`; `(e=s.power)==null`; `i===void 0&&s.id==="detu"&&a&&s.self`; `typeof(o==null?void 0:o.cp)=="number"`; `o==null`
- Numeric literals: `0`
- State writes: `e`, `i`

### `ag` — 399500–399523

- Numeric literals: `5`, `4`

### `p5` — 399524–399625

- Conditions: `i===n-1`
- Numeric literals: `1`

### `qt` — 399638–399797

- Conditions: `e.minRealm`
- Numeric literals: `2`, `0`

### `sg` — 401139–401206

- Numeric literals: `0`

### `Wn` — 401207–401245

- Conditions: `Number.isSafeInteger(a)&&a>0`
- Numeric literals: `0`

### `x5` — 401246–401555

- Conditions: `!a||typeof a!="object"`
- State writes: `t.at`, `t.cplt`, `t.gui`, `t.diem`, `t.goc`, `t.nhan`, `t.mua[e]`

### `M5` — 401561–401607

- State writes: `t`, `t[Ja]`

### `ig` — 401608–401659

- Numeric literals: `0`

### `og` — 401660–401874

- Conditions: `!ig(t,n)`; `i.promotion==="legacy"`; `i.promotion==="first"`
- Numeric literals: `0`

### `Z3` — 401902–401931

- Numeric literals: `0`

### `w5` — 401932–404358

- Conditions: `t.dead||t.realm||t.tribRun`; `!Number.isSafeInteger(h)||h<=0`; `s===""||Number(s)!==i.gui`; `!ig(i,o)`; `i.cplt`; `h>c`; `!t.takeFree(z,h)`; `!i.gui`; `Di.forEach((m,g)=>{h>=m&&c[g]>i.nhan[g]&&(u+=c[g]-i.nhan[g],i.nhan[g]=c[g])}),!u`; `!h`; `s===""||Number(s)!==i.diem`; `h.minRealm&&c<h.minRealm`; `h.maxLevel&&t.level>h.maxLevel`; `h.title&&t.titles.owned.some(g=>g.id===h.title)`; `(i.mua[u]??0)>=h.limit`; `i.diem<h.pts`; `h.item`; `m&&(fe(t,m.mount)||t.count(h.item)>0)`; `h.chest&&Ki(t)<1`; `h.chest&&!ze(t,h.chest,c,"Cửa hàng Công Đức")`; `i.diem-=h.pts,i.mua[u]=(i.mua[u]??0)+1,h.gem`; `h.n&&h.n>1`
- Numeric literals: `0`, `1`
- State writes: `t.dirty`, `i.nhan[g]`, `i.diem`, `i.mua[u]`, `t.donation.bound[g]`, `t.donation.bound[h.item]`

### `Ut` — 508614–508694

- Conditions: `typeof a=="number"&&Number.isFinite(a)`

### `H5` — 508701–510179

- Conditions: `a.pvpVs&&typeof a.pvpVs=="object"`; `(e=t[u])==null`; `a.bands&&typeof a.bands=="object"`; `(i=(s=n[u])==null?void 0:s[m])==null`; `(s=n[u])==null`; `(r=(o=n[u])==null?void 0:o[m])==null`; `(o=n[u])==null`; `(c=(h=n[u])==null?void 0:h[m])==null`; `(h=n[u])==null`; `g.dmg===1`; `g.aoe===1`; `g.pvpDeal===1&&g.pvpTake===1`
- Numeric literals: `1`, `0`, `0.3`, `3`, `50`, `200`, `1.95`, `0.5`, `4`, `0.17`, `2`
- State writes: `Ts.scale`, `Ts.bands`, `jo[u]`, `e`, `m[f]`, `Ts.scale[`${u}|${f}`]`, `Gt.bands`, `Gt.dmg`, `Gt.hp`, `Gt.aoe`, `i`, `s`, `r`, `o`, `c`, `h`, `Gt.dmg[`${u}|${m}`]`, `Gt.hp[`${u}|${m}`]`, `Gt.aoe[`${u}|${m}`]`, `g.weaponLow`, `g.weaponHigh`, `g.armorPerLevel`, `rg[u]`, `rh[u]`, `uh[u]`, `Yr[u]`, `oo.low`, `oo.high`, `oo.armor`

### `ug` — 510218–510277

- Numeric literals: `1`, `0`

### `cg` — 511123–511319

- Conditions: `!e||Kt(e)!==Ct.owner`; `e=Wi(a,n,Ct.owner,Ct.scene),!e`
- Numeric literals: `0`, `1`
- State writes: `e`, `e.monsters.length`

### `lg` — 511319–511646

- Conditions: `e.home`
- Numeric literals: `0.5`, `1`
- State writes: `t.pending`, `o.level`, `o.maxHp`, `o.hp`, `o.hit`

### `mg` — 511646–511689

- Numeric literals: `2`

### `R5` — 511689–512558

- Conditions: `i.kind==="counter"`; `i.kind==="walk"`
- Numeric literals: `0.9`, `0`, `1`, `1.2`, `1.1`, `0.45`, `1.6`, `3.5`, `2`

### `dg` — 512580–513189

- Conditions: `Ul.has(a)`; `i!=null&&i.home&&s.room&&!s.dead&&!s.realm`; `!N5(i)`
- Numeric literals: `1000000000000`, `0`, `1`
- State writes: `a.join`, `a.dealMonster`, `i.hp`, `i.fleeUntil`, `f.ring[f.head]`, `f.ringDmg[f.head]`, `f.head`, `f.since`

### `B5` — 513189–513386

- Conditions: `t.since`
- Numeric literals: `0`, `1`

### `gg` — 513386–513482

- Numeric literals: `0`
- State writes: `a.head`, `a.total`, `a.crits`, `a.hits`, `a.since`

### `_r` — 513482–513708

- Conditions: `!n`
- State writes: `t.before`, `t.lent`, `e[n.slot]`, `a.skillSlots`

### `Dr` — 513708–513902

- State writes: `a.learnedSkills`, `t.lent`, `a.skillSlots`, `t.before`

### `_5` — 513902–514528

- Conditions: `qh(t)`; `t.dead`; `t.realm`; `!e`; `!s`; `i`
- Numeric literals: `1`, `0`
- State writes: `n.home`, `t.cd`, `t.meditating`, `t.harvest`, `t.dirty`
- Event types: `travel`

### `D5` — 514528–514694

- Conditions: `!n.home`
- Numeric literals: `0`
- State writes: `n.home`, `t.pending`, `t.dirty`

### `U5` — 514694–515372

- Conditions: `!a.testHooks&&!t.isGm`; `!Ji[n]||n===t.classId`; `(i=t.gear.find(u=>u.uid===h))==null`; `(o=ah[n])==null`
- Numeric literals: `30`, `0`
- State writes: `s`, `t.root`, `t.level`, `t.xp`, `t.classId`, `t.def`, `t.cls`, `t.cd`, `t.skillSlots`, `t.guardSwords`, `t.guardAt`, `i`, `t.dirty`, `o`

### `Fl` — 517498–517617

- Conditions: `(e=a.room)==null`
- Numeric literals: `0`, `0.6`
- State writes: `e`

### `Gh` — 517618–517705

- Conditions: `(n=a.data.npcs.npcs.find(e=>e.id===t))==null`
- Numeric literals: `0`
- State writes: `n`

### `Ui` — 517706–517778

- Conditions: `(n=a.data.maps.get(t))==null`
- Numeric literals: `0`
- State writes: `n`

### `ri` — 517779–518780

- Conditions: `o.length`; `r==null`; `s>3`
- Numeric literals: `1`, `5`, `6`, `8`, `0`, `2`, `3`

### `V5` — 518780–518865

- Numeric literals: `0`, `1`
- State writes: `a.day`, `a.step`, `a.task`, `a.rerolls`, `a.started`

### `E5` — 518865–519753

- Conditions: `(s=a.data.camps[o.scene])==null`; `(i=a.data.quests.kt)==null`
- Numeric literals: `0`, `1`, `401`, `491`, `3`
- State writes: `s`, `i`

### `j5` — 519759–519879

- Conditions: `(e=a.data.quests.quests.find(s=>s.goals.some(i=>i[0]==='leader:${t}:${n}')))==null`
- Numeric literals: `0`
- State writes: `e`

### `W5` — 519880–520362

- Conditions: `n.step===10`; `n.step===me`
- Numeric literals: `1`, `0.1`, `5`, `10`

### `X5` — 520362–520606

- Conditions: `n.step<me`; `(e=n.task)==null`
- Numeric literals: `0`, `1000`
- State writes: `n.task`, `e`, `n.task.until`, `t.dirty`

### `Tt` — 539426–539604

- Conditions: `o`; `e`
- Numeric literals: `1`, `6`, `0`

### `Gs` — 542495–542917

- Conditions: `!i`; `t3.has(e)`; `r.title`
- Numeric literals: `1000000000`, `0`, `1`, `5`
- State writes: `n.c[e]`, `t.dirty`

### `s3` — 544054–545386

- Conditions: `t==null`; `r.door||pg(r.to)||e.length>=Hn.max`; `t&&a.w>=150`; `v<0||$<0||v>=r||$>=h`; `e.length>=Hn.max+3`; `k<0||y>30`
- Numeric literals: `0`, `1.5`, `6`, `2`, `1`, `150`, `0.5`, `0.25`, `5`, `0.75`, `3`, `30`, `1.6`
- State writes: `c[g]`, `c[S]`, `y`, `k`

### `Ce` — 545392–545417

- Numeric literals: `10`

### `i3` — 545418–545584

- Conditions: `n>a.h*.62`; `n<a.h*.38`; `t>a.w*.62`; `t<a.w*.38`; `e||s`
- Numeric literals: `0.62`, `0.38`

### `bg` — 545630–545826

- Conditions: `n`; `a==null`; `e`; `(i=a.data.titles[s])==null`
- Numeric literals: `0`
- State writes: `n`, `i`

### `o3` — 545826–545914

- Numeric literals: `0`

### `h3` — 546966–547657

- Conditions: `!i`; `!o||pg(o)`; `t.dead`; `t.realm`; `s<n.cd`; `t.st.rootUntil>s||t.st.stunUntil>s||s<t.cls.moveLockUntil`; `!vg(n,e)`; `o!==i.scene`; `!a.data.exported.has(o)`; `r`; `((h==null?void 0:h.reqLevel)??0)>t.level`; `h==null`
- Numeric literals: `0`

### `d3` — 548461–548599

- Conditions: `n<o`
- Numeric literals: `1`, `0`
- State writes: `e`, `n`

### `g3` — 548599–548938

- Conditions: `!e`; `a.dead||a.count(t)<1`
- Numeric literals: `1`, `0`
- State writes: `a.dirty`

### `k3` — 548987–549005

- Conditions: `a>=.75`
- Numeric literals: `0.75`, `20`, `10`

### `El` — 549109–549137

- Numeric literals: `120`, `180`

### `jl` — 549138–549173

- Numeric literals: `1`, `3`

### `p3.constructor` — 549224–549329

- Numeric literals: `0`
- State writes: `this.id`, `this.leader`

### `Pe` — 549400–549431

- Numeric literals: `1`

### `w3` — 549432–549462

- Numeric literals: `2`

### `zo` — 679209–679319

- Conditions: `a*a+t*t<1e-6`
- Numeric literals: `0.000001`, `2`, `180`, `45`, `8`

