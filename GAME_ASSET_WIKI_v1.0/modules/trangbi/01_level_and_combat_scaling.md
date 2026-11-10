# Cấp độ, kinh nghiệm, chỉ số quái và hệ số PvP

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Các hàm nội suy và công thức tăng trưởng được định nghĩa; chưa xác nhận nơi gọi hoặc máy chủ dùng chúng.
- Character offset vùng: [0, 3581) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `ji` | variable | 6–215 |  |  |
| `Wi` | variable | 216–361 |  |  |
| `Xi` | variable | 362–395 |  |  |
| `Yi` | variable | 396–410 |  |  |
| `Ji` | variable | 411–449 |  |  |
| `zi` | variable | 450–495 |  |  |
| `pn` | variable | 496–501 | dh |  |
| `fa` | function | 502–692 |  |  |
| `Zi` | function_expression | 698–741 |  | `fa` |
| `nh` | function_expression | 742–786 |  | `fa` |
| `sn` | variable | 787–793 | Q |  |
| `th` | variable | 794–798 | P |  |
| `F` | variable | 799–850 | bn |  |
| `An` | variable | 851–1014 | J |  |
| `Ir` | variable | 1015–1178 | b$ |  |
| `vn` | function_expression | 1179–1223 | R |  |
| `Gr` | function_expression | 1224–1239 | eS | `vn` |
| `qr` | function_expression | 1240–1265 | eD | `vn` |
| `fn` | function_expression | 1266–1331 | eq |  |
| `ya` | function_expression | 1332–1396 |  | `fn` |
| `de` | function_expression | 1397–1457 |  |  |
| `ka` | function_expression | 1458–1490 |  | `fn` |
| `pe` | function_expression | 1491–1519 |  | `fn`, `de` |
| `ba` | function_expression | 1520–1549 |  | `fn`, `de` |
| `eh` | function_expression | 1550–1579 |  | `fn`, `de` |
| `Ln` | function_expression | 1580–1630 | e9 | `fn` |
| `ah` | function_expression | 1631–1654 |  | `ka`, `pe`, `ba` |
| `Yn` | variable | 1655–1662 |  |  |
| `ih` | variable | 1663–1705 |  |  |
| `jt` | variable | 1706–1757 |  |  |
| `hh` | function_expression | 1758–1803 |  |  |
| `sh` | function_expression | 1804–2577 |  | `hh` |
| `ch` | variable | 2578–2585 |  | `sh` |
| `Ta` | function_expression | 2586–2601 |  | `fn` |
| `Vr` | function_expression | 2602–2616 | ed | `Ln` |
| `wt` | function_expression | 2617–2646 | bj | `Ln`, `Ta` |
| `oh` | function_expression | 2647–2688 |  | `Ln`, `ka`, `pe`, `eh` |
| `rh` | function_expression | 2689–2718 |  | `Ln`, `ah` |
| `uh` | function_expression | 2719–2769 |  | `Ln`, `fn` |
| `lh` | function_expression | 2770–2787 | bq | `ba`, `pe` |
| `Rr` | function_expression | 2788–2823 | bm | `wt`, `lh` |
| `Qr` | function_expression | 2824–2854 | ee | `Ta` |
| `Fr` | function | 2855–3049 | ex | `Ln` |
| `Ar` | function_expression | 3055–3130 | dd | `ya`, `Zi` |
| `Er` | function_expression | 3131–3186 | de | `ya`, `nh` |
| `Ur` | variable | 3187–3366 | ea |  |
| `_r` | function | 3367–3581 | f4 | `rh`, `oh`, `uh`, `wt` |

## Source-grounded implementation notes

### `ji` — **CONFIRMED**
- Source: [6, 215) UTF-16; [6, 215) bytes. 
- Object/configuration registry.
- Initial source: `ji={levels:[18,60,122,198,278,364,454,544,634,724,814,904,976],hp:[1.561,.638,.375,.394,.452,.537,.667,.838,1.056,1.287,1.632,2.085,2.706],hit:[.533,.22,.142,.139,.161,.1`…
- Internal dependencies: none statically named in module.

### `Wi` — **CONFIRMED**
- Source: [216, 361) UTF-16; [216, 361) bytes. 
- Object/configuration registry.
- Initial source: `Wi={elite:{hp:10.45,hit:2.65},boss:{hp:53.19,hit:6.74},storyHp:1.9,realmBoss:1009,partyBoss:100.9,trialBoss:20,guildBase:6116,guildPerLevel:1530}`
- Internal dependencies: none statically named in module.

### `Xi` — **CONFIRMED**
- Source: [362, 395) UTF-16; [362, 395) bytes. 
- Object/configuration registry.
- Initial source: `Xi={realmScale:1.289,medHours:.1}`
- Internal dependencies: none statically named in module.

### `Yi` — **CONFIRMED**
- Source: [396, 410) UTF-16; [396, 410) bytes. 
- Object/configuration registry.
- Initial source: `Yi={share:.65}`
- Internal dependencies: none statically named in module.

### `Ji` — **CONFIRMED**
- Source: [411, 449) UTF-16; [411, 449) bytes. 
- Object/configuration registry.
- Initial source: `Ji={mobStone:.171,activityStone:10.12}`
- Internal dependencies: none statically named in module.

### `zi` — **CONFIRMED**
- Source: [450, 495) UTF-16; [450, 495) bytes. 
- Object/configuration registry.
- Initial source: `zi={monster:ji,kind:Wi,exp:Xi,pvp:Yi,econ:Ji}`
- Internal dependencies: `ji`, `Wi`, `Xi`, `Yi`, `Ji`.

### `pn` — **CONFIRMED**
- Source: [496, 501) UTF-16; [496, 501) bytes. 
- Initial source: `pn=zi`
- Internal dependencies: `zi`.

### `fa` — **CONFIRMED**
- Source: [502, 692) UTF-16; [502, 692) bytes. 
- Linear interpolation over level knots.
- Initial source: `function fa(n,t,e){if(!n.length)return 1;if(e<=n[0])return t[0]??1;for(let a=1;a<n.length;a++)if(e<=n[a]){const i=(e-n[a-1])/(n[a]-n[a-1]);return t[a-1]*(1-i)+t[a]*i}retu`…
- Internal dependencies: none statically named in module.

### `Zi` — **CONFIRMED**
- Source: [698, 741) UTF-16; [698, 741) bytes. 
- Initial source: `Zi=n=>fa(pn.monster.levels,pn.monster.hp,n)`
- Internal dependencies: `fa`, `pn`.

### `nh` — **CONFIRMED**
- Source: [742, 786) UTF-16; [742, 786) bytes. 
- Initial source: `nh=n=>fa(pn.monster.levels,pn.monster.hit,n)`
- Internal dependencies: `fa`, `pn`.

### `sn` — **CONFIRMED**
- Source: [787, 793) UTF-16; [787, 793) bytes. 
- Initial source: `sn=999`
- Internal dependencies: none statically named in module.

### `th` — **CONFIRMED**
- Source: [794, 798) UTF-16; [794, 798) bytes. 
- Initial source: `th=5`
- Internal dependencies: none statically named in module.

### `F` — **CONFIRMED**
- Source: [799, 850) UTF-16; [799, 850) bytes. 
- Array of static or computed entries.
- Initial source: `F=[1,31,81,151,231,311,401,491,581,671,761,851,941]`
- Internal dependencies: none statically named in module.

### `An` — **CONFIRMED**
- Source: [851, 1014) UTF-16; [851, 1055) bytes. 
- Array of static or computed entries.
- Initial source: `An=["Luyện Khí","Trúc Cơ","Kim Đan","Nguyên Anh","Hóa Thần","Luyện Hư","Hợp Thể","Đại Thừa","Chân Tiên","Kim Tiên","Thái Ất Ngọc Tiên","Đại La Chân Tiên","Đạo Tổ"]`
- Internal dependencies: none statically named in module.

### `Ir` — **CONFIRMED**
- Source: [1015, 1178) UTF-16; [1056, 1219) bytes. 
- Array of static or computed entries.
- Initial source: `Ir=["luyen-khi","truc-co","kim-dan","nguyen-anh","hoa-than","luyen-hu","hop-the","dai-thua","chan-tien","kim-tien","thai-at-ngoc-tien","dai-la-chan-tien","dao-to"]`
- Internal dependencies: none statically named in module.

### `vn` — **CONFIRMED**
- Source: [1179, 1223) UTF-16; [1220, 1264) bytes. 
- Initial source: `vn=n=>Math.max(0,F.filter(t=>n>=t).length-1)`
- Internal dependencies: `F`.

### `Gr` — **CONFIRMED**
- Source: [1224, 1239) UTF-16; [1265, 1280) bytes. 
- Initial source: `Gr=n=>An[vn(n)]`
- Internal dependencies: `An`, `vn`.

### `qr` — **CONFIRMED**
- Source: [1240, 1265) UTF-16; [1281, 1306) bytes. 
- Initial source: `qr=n=>(F[vn(n)+1]??1e3)-1`
- Internal dependencies: `F`, `vn`.

### `fn` — **CONFIRMED**
- Source: [1266, 1331) UTF-16; [1307, 1372) bytes. 
- Initial source: `fn=n=>Math.max(1,Math.min(sn,Number.isFinite(n)?Math.floor(n):1))`
- Internal dependencies: `sn`.

### `ya` — **CONFIRMED**
- Source: [1332, 1396) UTF-16; [1373, 1437) bytes. 
- Initial source: `ya=n=>{const t=fn(n);return t<=99?t:99+25*Math.log1p((t-99)/25)}`
- Internal dependencies: `fn`.

### `de` — **CONFIRMED**
- Source: [1397, 1457) UTF-16; [1438, 1498) bytes. 
- Initial source: `de=n=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)}`
- Internal dependencies: none statically named in module.

### `ka` — **CONFIRMED**
- Source: [1458, 1490) UTF-16; [1499, 1531) bytes. 
- Initial source: `ka=n=>8+272*((fn(n)-1)/998)**.78`
- Internal dependencies: `fn`.

### `pe` — **CONFIRMED**
- Source: [1491, 1519) UTF-16; [1532, 1560) bytes. 
- Initial source: `pe=n=>1+.25*de((fn(n)-1)/29)`
- Internal dependencies: `de`, `fn`.

### `ba` — **CONFIRMED**
- Source: [1520, 1549) UTF-16; [1561, 1590) bytes. 
- Initial source: `ba=n=>1-.5*de((fn(n)-125)/25)`
- Internal dependencies: `de`, `fn`.

### `eh` — **CONFIRMED**
- Source: [1550, 1579) UTF-16; [1591, 1620) bytes. 
- Initial source: `eh=n=>1-.5*de((fn(n)-150)/81)`
- Internal dependencies: `de`, `fn`.

### `Ln` — **CONFIRMED**
- Source: [1580, 1630) UTF-16; [1621, 1671) bytes. 
- Initial source: `Ln=n=>Math.round(20+6*(fn(n)-1)+.025*(fn(n)-1)**2)`
- Internal dependencies: `fn`.

### `ah` — **CONFIRMED**
- Source: [1631, 1654) UTF-16; [1672, 1695) bytes. 
- Initial source: `ah=n=>ka(n)*pe(n)/ba(n)`
- Internal dependencies: `ka`, `pe`, `ba`.

### `ih` — **CONFIRMED**
- Source: [1663, 1705) UTF-16; [1704, 1746) bytes. 
- Array of static or computed entries.
- Initial source: `ih=[5,23,29,29,29,29,29,29,29,29,29,29,90]`
- Internal dependencies: none statically named in module.

### `hh` — **CONFIRMED**
- Source: [1758, 1803) UTF-16; [1799, 1844) bytes. 
- Initial source: `hh=n=>n>=F[1]?1:.04+.96*((n-1)/(F[1]-1))**1.6`
- Internal dependencies: `F`.

### `sh` — **CONFIRMED**
- Source: [1804, 2577) UTF-16; [1845, 2618) bytes. 
- Iterative XP-per-level curve calibration.
- Initial source: `sh=()=>{const n=[...F,sn],t=F.length-1,e=new Array(sn+1).fill(0),a=F.slice(0,t).map((m,f)=>(m+n[f+1]-1)/2),i=(m,f)=>{if(f<=a[0])return m[0];if(f>=a[t-1])return m[t-1];let`…
- Internal dependencies: `F`, `sn`, `jt`, `Yn`, `hh`.

### `Ta` — **CONFIRMED**
- Source: [2586, 2601) UTF-16; [2627, 2642) bytes. 
- Initial source: `Ta=n=>ch[fn(n)]`
- Internal dependencies: `ch`, `fn`.

### `Vr` — **CONFIRMED**
- Source: [2602, 2616) UTF-16; [2643, 2657) bytes. 
- Initial source: `Vr=n=>Yn*Ln(n)`
- Internal dependencies: `Yn`, `Ln`.

### `wt` — **CONFIRMED**
- Source: [2617, 2646) UTF-16; [2658, 2687) bytes. 
- Initial source: `wt=n=>Math.round(Ln(n)*Ta(n))`
- Internal dependencies: `Ln`, `Ta`.

### `oh` — **CONFIRMED**
- Source: [2647, 2688) UTF-16; [2688, 2729) bytes. 
- Initial source: `oh=n=>Math.round(Ln(n)*ka(n)*pe(n)/eh(n))`
- Internal dependencies: `Ln`, `ka`, `pe`, `eh`.

### `rh` — **CONFIRMED**
- Source: [2689, 2718) UTF-16; [2730, 2759) bytes. 
- Initial source: `rh=n=>Math.round(Ln(n)*ah(n))`
- Internal dependencies: `Ln`, `ah`.

### `uh` — **CONFIRMED**
- Source: [2719, 2769) UTF-16; [2760, 2810) bytes. 
- Initial source: `uh=n=>Ln(n)*Math.round(8+272*((fn(n)-1)/998)**.78)`
- Internal dependencies: `Ln`, `fn`.

### `lh` — **CONFIRMED**
- Source: [2770, 2787) UTF-16; [2811, 2828) bytes. 
- Initial source: `lh=n=>ba(n)/pe(n)`
- Internal dependencies: `ba`, `pe`.

### `Rr` — **CONFIRMED**
- Source: [2788, 2823) UTF-16; [2829, 2864) bytes. 
- Initial source: `Rr=(n,t)=>Math.round(wt(n)*t*lh(n))`
- Internal dependencies: `wt`, `lh`.

### `Qr` — **CONFIRMED**
- Source: [2824, 2854) UTF-16; [2865, 2895) bytes. 
- Initial source: `Qr=n=>pn.exp.medHours*Yn/Ta(n)`
- Internal dependencies: `pn`, `Yn`, `Ta`.

### `Fr` — **CONFIRMED**
- Source: [2855, 3049) UTF-16; [2896, 3090) bytes. 
- Level-based XP reward modifier.
- Initial source: `function Fr(n,t){const e=n-t,a=Math.max(20,n*.1);if(e>0)return Math.max(.02,Math.exp(-e/a));const i=Math.max(0,-e-Math.max(20,n*.15));return e===0?1:Ln(n)/Ln(t)*Math.max(`…
- Internal dependencies: `Ln`.

### `Ar` — **CONFIRMED**
- Source: [3055, 3130) UTF-16; [3096, 3171) bytes. 
- Initial source: `Ar=n=>{const t=ya(n)-1;return Math.round((120+14.85*t+1.91*t*t*.35)*Zi(n))}`
- Internal dependencies: `ya`, `Zi`.

### `Er` — **CONFIRMED**
- Source: [3131, 3186) UTF-16; [3172, 3227) bytes. 
- Initial source: `Er=n=>{const t=ya(n)-1;return(12+1.6*t+.012*t*t)*nh(n)}`
- Internal dependencies: `ya`, `nh`.

### `Ur` — **CONFIRMED**
- Source: [3187, 3366) UTF-16; [3228, 3407) bytes. 
- Object/configuration registry.
- Initial source: `Ur={gu:{hp:.6,hit:.55},monster:{hp:1.25,hit:1.15},elite:pn.kind.elite,boss:pn.kind.boss,player:{hp:1,hit:1},npc:{hp:1,hit:1},herb:{hp:1,hit:1},ore:{hp:1,hit:1},stele:{hp:`…
- Internal dependencies: `pn`.

### `_r` — **CONFIRMED**
- Source: [3367, 3581) UTF-16; [3408, 3622) bytes. 
- Partial reward/expression conversion capped relative to wt.
- Initial source: `function _r(n,t,e){if(n>=sn||!Number.isFinite(t))return 0;const a=n-1,i=e===4?rh(n):e===3?oh(n):e===2?uh(n):120+45*a+8*a*a,h=wt(n),o=e===th||Math.round(i)===h;return Math`…
- Internal dependencies: `sn`, `rh`, `oh`, `uh`, `wt`, `th`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.