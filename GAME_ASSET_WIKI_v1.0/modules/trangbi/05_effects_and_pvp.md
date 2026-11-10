# Hiệu ứng trạng thái, giới hạn sát thương và PvP

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Hiệu ứng, cộng dồn, giải hiệu ứng, mã hóa trạng thái; không xác nhận server authoritative.
- Character offset vùng: [108200, 125429) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `_e` | variable | 108206–108265 | eB |  |
| `Oe` | variable | 108266–108288 | eA |  |
| `ws` | function | 108289–108592 | dN | `vn` |
| `Hs` | function_expression | 108598–108657 |  | `ws` |
| `Pu` | function_expression | 108658–108771 | eL | `Hs` |
| `Ms` | function_expression | 108772–108862 | d2 |  |
| `wu` | variable | 108863–108868 | eJ |  |
| `Zn` | variable | 108869–109011 | dk |  |
| `Hu` | function | 109012–109167 | ec |  |
| `Ks` | function | 109167–109438 | dH |  |
| `Mu` | function_expression | 109444–109561 | eI |  |
| `Hn` | variable | 109562–109694 | dD |  |
| `A` | variable | 109695–112458 | a |  |
| `Cs` | variable | 112459–112476 | S |  |
| `Bs` | variable | 112477–112524 |  |  |
| `X` | variable | 112525–112674 | dI |  |
| `Ku` | function_expression | 112675–112769 | dL |  |
| `Cu` | function_expression | 112770–112842 | dJ |  |
| `Bu` | function | 112843–113164 | dK |  |
| `Ea` | function | 113164–113251 | dF |  |
| `Lu` | function | 113251–113307 | dx | `Ea` |
| `Ls` | function_expression | 113313–113336 | du | `Ea` |
| `Ss` | function | 113337–113770 | dg |  |
| `Ns` | function | 113770–113824 |  |  |
| `Su` | function | 113824–113930 | df | `Ls`, `Ks` |
| `Ua` | function | 113930–115034 | di |  |
| `$s` | function | 115034–115741 | fb | `Ns` |
| `Nu` | function | 115741–115979 | dC | `Ua`, `$s` |
| `$u` | function | 115979–116415 | dG | `Ua` |
| `Du` | function | 116415–116639 | p |  |
| `Iu` | function | 116639–117120 | ez |  |
| `Gu` | function | 117120–117584 | ey | `Ss` |
| `Ds` | variable | 117590–119042 | h |  |
| `qu` | function_expression | 119043–119107 | fd |  |
| `P` | function_expression | 119108–119136 |  |  |
| `C` | function_expression | 119137–119190 |  |  |
| `an` | function_expression | 119191–119235 |  |  |
| `Is` | variable | 119236–120791 | g |  |
| `Gs` | function_expression | 120792–122360 |  | `P`, `C`, `an` |
| `se` | variable | 122430–122436 |  |  |
| `qs` | function_expression | 122437–122968 |  | `an`, `C` |
| `_a` | function | 122969–124977 |  | `C`, `P`, `an` |
| `Vs` | function | 124977–125429 |  | `qs`, `_a`, `C` |

## Source-grounded implementation notes

### `_e` — **CONFIRMED**
- Source: [108206, 108265) UTF-16; [117233, 117292) bytes. 
- Object/configuration registry.
- Initial source: `_e={"the-tu":{deal:.8,take:1.2},"co-su":{deal:1.3,take:.9}}`
- Internal dependencies: none statically named in module.

### `Oe` — **CONFIRMED**
- Source: [108266, 108288) UTF-16; [117293, 117315) bytes. 
- Object/configuration registry.
- Initial source: `Oe={bands:[],scale:{}}`
- Internal dependencies: none statically named in module.

### `ws` — **CONFIRMED**
- Source: [108289, 108592) UTF-16; [117316, 117619) bytes. 
- Interpolate matchup scales by realm.
- Initial source: `function ws(n,t,e){if(!n.length)return 1;const a=vn(t),i=n.filter(h=>vn(h)===a);if(!i.length){let h=n[0];for(const o of n)t>=o&&(h=o);return e(h)}if(t<=i[0])return e(i[0]`…
- Internal dependencies: `vn`.

### `Hs` — **CONFIRMED**
- Source: [108598, 108657) UTF-16; [117625, 117684) bytes. 
- Initial source: `Hs=(n,t,e)=>ws(Oe.bands,e,a=>Oe.scale[\`${a}|${n}>${t}\`]??1)`
- Internal dependencies: `ws`, `Oe`.

### `Pu` — **CONFIRMED**
- Source: [108658, 108771) UTF-16; [117685, 117798) bytes. 
- Class matchup damage scale.
- Initial source: `Pu=(n,t,e=0)=>{var a,i;return(((a=_e[n])==null?void 0:a.deal)??1)*(((i=_e[t])==null?void 0:i.take)??1)*Hs(n,t,e)}`
- Internal dependencies: `_e`, `Hs`.

### `Ms` — **CONFIRMED**
- Source: [108772, 108862) UTF-16; [117799, 117889) bytes. 
- Initial source: `Ms=(n,t)=>{const e=(t|0)-(n|0);return e>0?Math.max(.3,.75**e):e<0?Math.min(2.5,1.3**-e):1}`
- Internal dependencies: none statically named in module.

### `wu` — **CONFIRMED**
- Source: [108863, 108868) UTF-16; [117890, 117895) bytes. 
- Initial source: `wu=Ms`
- Internal dependencies: `Ms`.

### `Zn` — **CONFIRMED**
- Source: [108869, 109011) UTF-16; [117896, 118038) bytes. 
- Object/configuration registry.
- Initial source: `Zn={share:pn.pvp.share,sustain:.5,shieldPass:.5,ccSecond:.5,ccImmuneSec:5,ccWindowSec:8,resistCap:.4,dmgCap:.2,contestRealm:2,deathCulPct:.01}`
- Internal dependencies: `pn`.

### `Hu` — **CONFIRMED**
- Source: [109012, 109167) UTF-16; [118039, 118194) bytes. 
- Determine PvP mode using region and flags.
- Initial source: `function Hu(n,t,e){return n.hub||n.noCombat?"safe":n.pk==="safe"||n.pk==="field"||n.pk==="contest"?n.pk:t?"arena":n.pvp&&(n.minLevel??0)>=e?"field":"safe"}`
- Internal dependencies: none statically named in module.

### `Ks` — **CONFIRMED**
- Source: [109167, 109438) UTF-16; [118194, 118465) bytes. 
- Control-chain immunity and diminishing duration.
- Initial source: `function Ks(n,t,e){if((n.ccImmune??0)>t)return 0;(n.controlReset??0)<=t&&(n.controlCount=0,n.controlReset=t+Zn.ccWindowSec);const a=n.controlCount??0;return a>=2?(n.ccImm`…
- Internal dependencies: `Zn`.

### `Mu` — **CONFIRMED**
- Source: [109444, 109561) UTF-16; [118471, 118588) bytes. 
- PvP attack/resistance multipliers.
- Initial source: `Mu=(n,t)=>(1+Math.min(Zn.dmgCap,Math.max(0,n.pvpDmgPct??0)))*(1-Math.min(Zn.resistCap,Math.max(0,t.pvpResistPct??0)))`
- Internal dependencies: `Zn`.

### `Hn` — **CONFIRMED**
- Source: [109562, 109694) UTF-16; [118589, 118721) bytes. 
- Object/configuration registry.
- Initial source: `Hn={bleedMoving:.6,bleedMoveDist:.25,sunderPerStack:.06,sunderShield:.12,speedCap:[.6,1.5],tauntOthers:.3,maxCleanse:4,speedMove:.2}`
- Internal dependencies: none statically named in module.

### `A` — **CONFIRMED**
- Source: [109695, 112458) UTF-16; [118722, 121852) bytes. 
- Object/configuration registry.
- Initial source: `A={stun:{code:"st",name:"Choáng",bad:!0,cc:"hard",max:1,dispel:!0,text:"Không đi, không đánh, không ra chiêu."},root:{code:"rt",name:"Trói chân",bad:!0,cc:"hard",max:1,di`…
- Internal dependencies: `Hn`.

### `Cs` — **CONFIRMED**
- Source: [112459, 112476) UTF-16; [121853, 121870) bytes. 
- Initial source: `Cs=Object.keys(A)`
- Internal dependencies: `A`.

### `X` — **CONFIRMED**
- Source: [112525, 112674) UTF-16; [121919, 122068) bytes. 
- Object/configuration registry.
- Initial source: `X={window:3,budget:.4,over:.25,budget2:.55,over2:.1,dampFrom:15,dampStep:5,dampPer:.1,dampMax:.6,rageFrom:20,rageStep:5,ragePer:.3,mana:.02,damage:1}`
- Internal dependencies: none statically named in module.

### `Ku` — **CONFIRMED**
- Source: [112675, 112769) UTF-16; [122069, 122163) bytes. 
- Initial source: `Ku=n=>n<X.dampFrom?1:1-Math.min(X.dampMax,(Math.floor((n-X.dampFrom)/X.dampStep)+1)*X.dampPer)`
- Internal dependencies: `X`.

### `Cu` — **CONFIRMED**
- Source: [112770, 112842) UTF-16; [122164, 122236) bytes. 
- Initial source: `Cu=n=>n<X.rageFrom?1:1+Math.floor((n-X.rageFrom)/X.rageStep+1)*X.ragePer`
- Internal dependencies: `X`.

### `Bu` — **CONFIRMED**
- Source: [112843, 113164) UTF-16; [122237, 122558) bytes. 
- Damage budget in sliding window.
- Initial source: `function Bu(n,t,e,a){for(;n.length&&n[0][0]<=t-X.window;)n.shift();let i=0;for(const[,m]of n)i+=m;const h=X.budget*e,o=X.budget2*e;let c=a,r=i,u=0;const l=(m,f)=>{if(c<=0`…
- Internal dependencies: `X`.

### `Ea` — **CONFIRMED**
- Source: [113164, 113251) UTF-16; [122558, 122645) bytes. 
- Initial source: `function Ea(n,t,e){const a=n.fx;if(a){for(const i of a)if(i.k===t&&i.until>e)return i}}`
- Internal dependencies: none statically named in module.

### `Lu` — **CONFIRMED**
- Source: [113251, 113307) UTF-16; [122645, 122701) bytes. 
- Initial source: `function Lu(n,t,e){const a=Ea(n,t,e);return a?a.v*a.n:0}`
- Internal dependencies: `Ea`.

### `Ls` — **CONFIRMED**
- Source: [113313, 113336) UTF-16; [122707, 122730) bytes. 
- Initial source: `Ls=(n,t,e)=>!!Ea(n,t,e)`
- Internal dependencies: `Ea`.

### `Ss` — **CONFIRMED**
- Source: [113337, 113770) UTF-16; [122731, 123164) bytes. 
- Apply or refresh timed effect with stack cap.
- Initial source: `function Ss(n,t,e,a){if(!(a.dur>0)||!Number.isFinite(a.dur))return;const i=A[t],h=Number.isFinite(a.v)?a.v:0,o=Math.max(1,Math.floor(a.n??1)),c=n.fx??(n.fx=[]);for(let l=`…
- Internal dependencies: `A`.

### `Ns` — **CONFIRMED**
- Source: [113770, 113824) UTF-16; [123164, 123218) bytes. 
- Initial source: `function Ns(n,t){n.fx&&(n.fx=n.fx.filter(e=>e.k!==t))}`
- Internal dependencies: none statically named in module.

### `Su` — **CONFIRMED**
- Source: [113824, 113930) UTF-16; [123218, 123324) bytes. 
- Initial source: `function Su(n,t,e,a,i){const h=A[t];return!h.cc||a<=0?a:Ls(n,"ccimmune",e)?0:h.cc==="hard"&&i?Ks(n,e,a):a}`
- Internal dependencies: `A`, `Ls`, `Ks`.

### `Ua` — **CONFIRMED**
- Source: [113930, 115034) UTF-16; [123324, 124428) bytes. 
- Normalize legacy and new status effects.
- Initial source: `function Ua(n,t){const e=[],a=n.by??{},i=(h,o,c,r,u)=>{const l=e.find(m=>m.k===h);l?(l.n=Math.min(A[h].max,Math.max(l.n,o)),c>l.until&&(l.until=c,l.src=r),l.v=Math.max(l.`…
- Internal dependencies: `A`.

### `$s` — **CONFIRMED**
- Source: [115034, 115741) UTF-16; [124428, 125135) bytes. 
- Initial source: `function $s(n,t,e){switch(t){case"stun":n.stunUntil=Math.min(n.stunUntil,e);break;case"root":n.rootUntil=Math.min(n.rootUntil,e);break;case"slow":n.slowUntil=Math.min(n.s`…
- Internal dependencies: `Ns`.

### `Nu` — **CONFIRMED**
- Source: [115741, 115979) UTF-16; [125135, 125373) bytes. 
- Dispel selected status effects by priority.
- Initial source: `function Nu(n,t,e,a){const i=c=>(A[c.k].cc==="hard"?2:A[c.k].cc?1:0)*1e6+c.until,o=Ua(n,t).filter(c=>A[c.k].bad===e&&A[c.k].dispel).sort((c,r)=>i(r)-i(c)).slice(0,Math.mi`…
- Internal dependencies: `A`, `Ua`, `Hn`, `$s`.

### `$u` — **CONFIRMED**
- Source: [115979, 116415) UTF-16; [125373, 125809) bytes. 
- Initial source: `function $u(n,t){var i,h;if(!(n.stunUntil>t||n.rootUntil>t||n.slowUntil>t||n.shieldUntil>t||n.guardUntil>t||n.powerUntil>t||n.hotUntil>t||n.stealthUntil>t||n.lifeUntil>t|`…
- Internal dependencies: `Ua`, `A`.

### `Du` — **CONFIRMED**
- Source: [116415, 116639) UTF-16; [125809, 126033) bytes. 
- Deserialize compact effect status string.
- Initial source: `function Du(n){if(!n)return[];const t=[];for(const e of n.split(",")){const a=/^([a-z]{2})(\d*)@(\d+)$/.exec(e);if(!a)continue;const i=Bs[a[1]];i&&t.push({k:i,code:a[1],n`…
- Internal dependencies: `Bs`.

### `Iu` — **CONFIRMED**
- Source: [116639, 117120) UTF-16; [126033, 126514) bytes. 
- Collect persistent buffs for transfer.
- Initial source: `function Iu(n,t){const e=[];for(const a of n.fx??[])a.until-t>=1&&!A[a.k].cc&&e.push({k:a.k,n:a.n,v:+a.v.toFixed(4),left:+(a.until-t).toFixed(1)});return n.shield>0&&n.sh`…
- Internal dependencies: `A`.

### `Gu` — **CONFIRMED**
- Source: [117120, 117584) UTF-16; [126514, 126978) bytes. 
- Restore persistent buffs.
- Initial source: `function Gu(n,t,e){if(Array.isArray(e))for(const a of e.slice(0,12)){const i=a,h=i.k;if(!h||!A[h]||A[h].cc||typeof i.left!="number"||!(i.left>0))continue;const o=Math.min`…
- Internal dependencies: `A`, `Ss`.

### `Ds` — **CONFIRMED**
- Source: [117590, 119042) UTF-16; [126984, 128758) bytes. 
- Object/configuration registry.
- Initial source: `Ds={"the-tu":{beats:["anh-sat","ma-tong"],why:["Phản đòn + choáng trả lại đòn mở màn của sát thủ","Phản đòn ăn vào máu Ma tu tự đốt; khiêu khích cắt 30% sát thương"]},"ma`…
- Internal dependencies: none statically named in module.

### `qu` — **CONFIRMED**
- Source: [119043, 119107) UTF-16; [128759, 128823) bytes. 
- Initial source: `qu=(n,t)=>{var e;return!!((e=Ds[n])!=null&&e.beats.includes(t))}`
- Internal dependencies: `Ds`.

### `P` — **CONFIRMED**
- Source: [119108, 119136) UTF-16; [128824, 128852) bytes. 
- Initial source: `P=n=>\`${Math.round(n*100)}%\``
- Internal dependencies: none statically named in module.

### `C` — **CONFIRMED**
- Source: [119137, 119190) UTF-16; [128853, 128907) bytes. 
- Initial source: `C=n=>\`${String(+n.toFixed(1)).replace(".",",")} giây\``
- Internal dependencies: none statically named in module.

### `an` — **CONFIRMED**
- Source: [119191, 119235) UTF-16; [128908, 128952) bytes. 
- Initial source: `an=n=>String(+n.toFixed(1)).replace(".",",")`
- Internal dependencies: none statically named in module.

### `Is` — **CONFIRMED**
- Source: [119236, 120791) UTF-16; [128953, 130589) bytes. 
- Object/configuration registry.
- Initial source: `Is={"the-tu":[{id:"tt-thanh-the",name:"Hoang Cổ Thánh Thể",kind:"ccReduce",v:.3,text:""},{id:"tt-bat-dong",name:"Bất Động Như Sơn",kind:"shieldReflect",v:.12,text:""}],"m`…
- Internal dependencies: none statically named in module.

### `Gs` — **CONFIRMED**
- Source: [120792, 122360) UTF-16; [130590, 132428) bytes. 
- Initial source: `Gs=n=>{switch(n.kind){case"ccReduce":return\`Thời gian bị khống chế giảm ${P(n.v)}.\`;case"shieldReflect":return\`Khi có khiên hoặc hộ thể, trả lại ${P(n.v)} sát thương trực`…
- Internal dependencies: `P`, `C`, `an`.

### `qs` — **CONFIRMED**
- Source: [122437, 122968) UTF-16; [132505, 133083) bytes. 
- Initial source: `qs=n=>{switch(n.shape){case"cone":return\`hình quạt tầm ${an(n.range)}\`;case"line":return\`đường thẳng dài ${an(n.range)}\`;case"circle":return n.castRange?\`bán kính ${an(n.`…
- Internal dependencies: `an`, `C`.

### `_a` — **CONFIRMED**
- Source: [122969, 124977) UTF-16; [133084, 135285) bytes. 
- Initial source: `function _a(n){const t=e=>A[e].name.toLowerCase();switch(n.t){case"poison":case"burn":case"bleed":return\`${t(n.t)} ${Math.round((n.v??0)*se)}/giây ${C(n.dur??4)}${(n.stac`…
- Internal dependencies: `A`, `se`, `C`, `P`, `Hn`, `an`.

### `Vs` — **CONFIRMED**
- Source: [124977, 125429) UTF-16; [135285, 135754) bytes. 
- Initial source: `function Vs(n,t=""){const e=[],a=Math.round(n.dmg*se),i=qs(n);n.dmg>0?e.push(\`${t||"Gây"} ${a} sát thương${n.hits>1?\` × ${n.hits} lần\`:""}${i?" "+i:""}\`):t?e.push(i?\`${t}`…
- Internal dependencies: `se`, `qs`, `_a`, `C`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.