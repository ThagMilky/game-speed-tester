# Rơi đồ, chế tạo, phân giải và túi đồ

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Hàm sinh thưởng, xử lý vật phẩm và sự kiện liên quan.
- Character offset vùng: [214747, 223297) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `mm` | function_expression | 214753–214794 | bb | `Xa`, `Va` |
| `gm` | function_expression | 214795–214876 | au | `Qa` |
| `dm` | function_expression | 214877–214894 | b1 | `Fa` |
| `pm` | function_expression | 214895–214943 | ac |  |
| `ca` | function_expression | 214944–214977 | d9 |  |
| `fm` | variable | 214978–215028 | bh | `ca` |
| `ym` | variable | 215029–215208 | d8 |  |
| `Qi` | variable | 215209–215221 | en |  |
| `oa` | variable | 215222–215298 | aB |  |
| `ra` | variable | 215299–215326 | aC |  |
| `pr` | variable | 215327–215332 | aA |  |
| `fr` | variable | 215333–215359 | aI |  |
| `yr` | variable | 215360–215378 |  |  |
| `qt` | variable | 215379–215574 | aD |  |
| `xn` | variable | 215575–215617 |  |  |
| `kr` | variable | 215618–215662 | db |  |
| `ua` | variable | 215663–215840 | aG |  |
| `br` | function_expression | 215841–215889 | aF |  |
| `Tr` | function | 215890–216263 | az | `br` |
| `ot` | variable | 216269–216285 | aE |  |
| `vr` | function_expression | 216286–216354 |  |  |
| `xr` | function | 216355–216637 | dW | `rn`, `vr` |
| `te` | variable | 216643–216655 |  |  |
| `N` | variable | 216660–216673 |  |  |
| `cn` | function_expression | 216680–216777 |  |  |
| `Vt` | function | 216778–216928 |  | `cn` |
| `la` | function | 216928–217153 |  | `cn` |
| `Pr` | function_expression | 217159–217188 |  |  |
| `wr` | function | 217189–217671 | ej | `Rn`, `cn`, `Lt`, `xe`, `ni`, `L`, `la`, `Pr` |
| `Hr` | function | 217671–218372 | em | `wr`, `cn`, `Vt` |
| `rn` | function_expression | 218378–218392 |  | `_o` |
| `km` | variable | 218393–218398 | dY |  |
| `q` | function_expression | 218399–218415 |  | `vn` |
| `Fi` | function_expression | 218416–218485 |  |  |
| `rt` | function | 218486–218635 | eg | `Fi`, `L`, `kt`, `N`, `ai`, `ge` |
| `Pt` | function_expression | 218641–218687 | ei | `z` |
| `bm` | function | 218688–218909 | f7 | `rn`, `q`, `gc` |
| `Tm` | function | 218909–218967 | dU | `rn` |
| `ge` | function_expression | 218973–219032 |  | `ti`, `N`, `Gt` |
| `ut` | function | 219033–219538 |  | `q`, `Ri`, `ce`, `z`, `Pt` |
| `Ai` | function | 219538–219737 | ep | `rn`, `L`, `q`, `N`, `Aa`, `rt`, `ut` |
| `vm` | function | 219737–219930 | dX | `rn`, `L`, `q`, `N`, `rt`, `ut` |
| `Mr` | function_expression | 219936–219972 |  | `N` |
| `Ge` | variable | 219973–219977 | eu |  |
| `xm` | function | 219978–220565 | eP | `rn`, `vn`, `q`, `N`, `Ai`, `z`, `Mr`, `rs`, `bn` |
| `Kr` | variable | 220571–220649 |  |  |
| `ma` | variable | 220650–220675 |  |  |
| `Cr` | variable | 220676–220680 |  |  |
| `Br` | function | 220681–220920 |  |  |
| `Lr` | function_expression | 220926–220971 |  | `N` |
| `Sr` | function | 220972–221111 |  | `ti`, `Gt` |
| `Nr` | function | 221111–221501 | eZ | `rn`, `Lr`, `q`, `Br`, `bc`, `rt`, `Sr`, `ut`, `U`, `z` |
| `Pm` | function | 221501–221719 | f9 | `U`, `Nr` |
| `$r` | function | 221719–222596 | eV | `rn`, `q`, `Ai`, `N` |
| `Ei` | variable | 222602–222623 | aH |  |
| `wm` | function_expression | 222624–222713 | eO | `Jo` |
| `Hm` | function | 222714–222918 | f2 | `rn` |
| `ga` | variable | 222924–223296 |  |  |

## Source-grounded implementation notes

### `mm` — **CONFIRMED**
- Source: [214753, 214794) UTF-16; [231245, 231286) bytes. 
- Initial source: `mm=(n,t,e)=>({...Xa(n,t,e),drop:Va(n+1)})`
- Internal dependencies: `Xa`, `Va`.

### `gm` — **CONFIRMED**
- Source: [214795, 214876) UTF-16; [231287, 231368) bytes. 
- Initial source: `gm=(n,t)=>({inputs:yt,rate:Kt[n]??0,...n<Kt.length?Qa(n,t):{essence:0,silver:0}})`
- Internal dependencies: `yt`, `Kt`, `Qa`.

### `dm` — **CONFIRMED**
- Source: [214877, 214894) UTF-16; [231369, 231386) bytes. 
- Initial source: `dm=n=>Fa(n.q,n.g)`
- Internal dependencies: `Fa`.

### `pm` — **CONFIRMED**
- Source: [214895, 214943) UTF-16; [231387, 231435) bytes. 
- Initial source: `pm=(n,t)=>\`data/kt-gear/${t}/${n.s}-q${n.q}.png\``
- Internal dependencies: none statically named in module.

### `ca` — **CONFIRMED**
- Source: [214944, 214977) UTF-16; [231436, 231469) bytes. 
- Initial source: `ca=n=>\`data/kt-gear/mat/${n}.png\``
- Internal dependencies: none statically named in module.

### `fm` — **CONFIRMED**
- Source: [214978, 215028) UTF-16; [231470, 231520) bytes. 
- Object/configuration registry.
- Initial source: `fm={combine:ca("da-ghep"),salvage:ca("phan-giai")}`
- Internal dependencies: `ca`.

### `ym` — **CONFIRMED**
- Source: [215029, 215208) UTF-16; [231521, 231731) bytes. 
- Object/configuration registry.
- Initial source: `ym={"Phù Bảo Hộ":"phu-bao-ho","Đá cường hóa":"da-cuong-hoa","Đá tẩy luyện":"da-tay-luyen","Đá khóa":"da-khoa","Tinh thạch thăng phẩm":"tinh-thach","Hồn Thức Tỉnh":"hon-th`…
- Internal dependencies: none statically named in module.

### `Qi` — **CONFIRMED**
- Source: [215209, 215221) UTF-16; [231732, 231744) bytes. 
- Initial source: `Qi="trangbi"`
- Internal dependencies: none statically named in module.

### `oa` — **CONFIRMED**
- Source: [215222, 215298) UTF-16; [231745, 231821) bytes. 
- Array of static or computed entries.
- Initial source: `oa=[{atkPct:.005,hpPct:.01},{atkPct:.01,hpPct:.015},{atkPct:.015,hpPct:.02}]`
- Internal dependencies: none statically named in module.

### `ra` — **CONFIRMED**
- Source: [215299, 215326) UTF-16; [231822, 231849) bytes. 
- Object/configuration registry.
- Initial source: `ra={atkPct:.002,hpPct:.003}`
- Internal dependencies: none statically named in module.

### `pr` — **CONFIRMED**
- Source: [215327, 215332) UTF-16; [231850, 231855) bytes. 
- Initial source: `pr=12`
- Internal dependencies: none statically named in module.

### `fr` — **CONFIRMED**
- Source: [215333, 215359) UTF-16; [231856, 231888) bytes. 
- Array of static or computed entries.
- Initial source: `fr=["Thường","Quý","Hiếm"]`
- Internal dependencies: none statically named in module.

### `qt` — **CONFIRMED**
- Source: [215379, 215574) UTF-16; [231911, 232106) bytes. 
- Initial source: `qt=Cn.filter(n=>!n.classId&&n.rarity>=3||n.id==="set-kim-van").map(n=>({id:n.id,name:n.name,item:yr+n.name,tier:n.id==="set-kim-van"||n.rarity>=5?2:n.rarity>=4?1:0,pieces`…
- Internal dependencies: `Cn`, `yr`.

### `kr` — **CONFIRMED**
- Source: [215618, 215662) UTF-16; [232150, 232194) bytes. 
- Initial source: `kr=Object.fromEntries(qt.map(n=>[n.item,n]))`
- Internal dependencies: `qt`.

### `ua` — **CONFIRMED**
- Source: [215663, 215840) UTF-16; [232195, 232389) bytes. 
- Array of static or computed entries.
- Initial source: `ua=[{vnd:0,name:"Nhất Trọng",pct:.03},{vnd:1e6,name:"Nhị Trọng",pct:.04},{vnd:2e6,name:"Tam Trọng",pct:.05},{vnd:5e6,name:"Tứ Trọng",pct:.06},{vnd:1e7,name:"Ngũ Trọng",pc`…
- Internal dependencies: none statically named in module.

### `br` — **CONFIRMED**
- Source: [215841, 215889) UTF-16; [232390, 232438) bytes. 
- Initial source: `br=n=>[...ua].reverse().find(t=>n>=t.vnd)??ua[0]`
- Internal dependencies: `ua`.

### `Tr` — **CONFIRMED**
- Source: [215890, 216263) UTF-16; [232439, 232812) bytes. 
- Initial source: `function Tr(n,t=0){const e=Math.min(pr,(n.f??[]).filter(h=>xn[h]).length),a=n.fw?xn[n.fw]:void 0;if(!e&&!a)return;const i={atkPct:ra.atkPct*e,hpPct:ra.hpPct*e};if(a&&(i.a`…
- Internal dependencies: `pr`, `xn`, `ra`, `oa`, `ot`, `br`.

### `ot` — **CONFIRMED**
- Source: [216269, 216285) UTF-16; [232818, 232834) bytes. 
- Initial source: `ot="set-kim-van"`
- Internal dependencies: none statically named in module.

### `vr` — **CONFIRMED**
- Source: [216286, 216354) UTF-16; [232835, 232903) bytes. 
- Initial source: `vr=n=>!!xn[ot]&&xn[ot].pieces.every(t=>n==null?void 0:n.includes(t))`
- Internal dependencies: `xn`, `ot`.

### `xr` — **CONFIRMED**
- Source: [216355, 216637) UTF-16; [232904, 233221) bytes. 
- Initial source: `function xr(n,t=rn(n)){var e;return!t||t.kv||!vr((e=n.donation)==null?void 0:e.looks)?!1:(t.f.includes(ot)||t.f.push(ot),t.kv=1,n.dirty=!0,n.note("Mốc nạp Kim Vân: bộ thờ`…
- Internal dependencies: `rn`, `vr`, `ot`.

### `te` — **CONFIRMED**
- Source: [216643, 216655) UTF-16; [233227, 233239) bytes. 
- Array of static or computed entries.
- Initial source: `te=[70,25,5]`
- Internal dependencies: none statically named in module.

### `cn` — **CONFIRMED**
- Source: [216680, 216777) UTF-16; [233264, 233361) bytes. 
- Initial source: `cn=(n,t,e)=>{const a=Math.floor(Number(n));return Number.isFinite(a)?Math.min(e,Math.max(t,a)):t}`
- Internal dependencies: none statically named in module.

### `Vt` — **CONFIRMED**
- Source: [216778, 216928) UTF-16; [233362, 233512) bytes. 
- Initial source: `function Vt(n){const t=n;return!t||typeof t!="object"||!Number.isFinite(Number(t.maxQ))?null:{maxQ:cn(t.maxQ,0,lt-1),old:!!t.old,keepSet:!!t.keepSet}}`
- Internal dependencies: `cn`, `lt`.

### `la` — **CONFIRMED**
- Source: [216928, 217153) UTF-16; [233512, 233737) bytes. 
- Initial source: `function la(n,t,e){if(!Array.isArray(e))return[];const a=[];for(const i of e){const h=i==null?void 0:i.k;typeof h!="string"||!(h in Ya)||a.some(o=>o.k===h)||a.push({k:h,t`…
- Internal dependencies: `Ya`, `cn`, `Ra`.

### `Pr` — **CONFIRMED**
- Source: [217159, 217188) UTF-16; [233743, 233772) bytes. 
- Initial source: `Pr=n=>n.s==="weapon"&&n.q>=Ut`
- Internal dependencies: `Ut`.

### `wr` — **CONFIRMED**
- Source: [217189, 217671) UTF-16; [233773, 234255) bytes. 
- Initial source: `function wr(n){const t=n;if(!t||typeof t!="object"||typeof t.u!="string"||!t.u||t.u.length>40||!Rn(t.s))return null;const e=cn(t.q,0,lt),a=Array.from({length:os},(h,o)=>{`…
- Internal dependencies: `Rn`, `cn`, `lt`, `os`, `Lt`, `xe`, `ni`, `L`, `la`, `Pr`, `$n`.

### `Hr` — **CONFIRMED**
- Source: [217671, 218372) UTF-16; [234255, 234956) bytes. 
- Initial source: `function Hr(n){var r,u,l;const t=n??{},e=new Set,a=[];for(const m of Array.isArray(t.bag)?t.bag:[]){const f=wr(m);f&&!e.has(f.u)&&a.length<En&&(e.add(f.u),a.push(f))}cons`…
- Internal dependencies: `wr`, `En`, `Y`, `cn`, `Sn`, `xn`, `Vt`.

### `rn` — **CONFIRMED**
- Source: [218378, 218392) UTF-16; [234962, 234976) bytes. 
- Initial source: `rn=n=>_o(n,Qi)`
- Internal dependencies: `_o`, `Qi`.

### `km` — **CONFIRMED**
- Source: [218393, 218398) UTF-16; [234977, 234982) bytes. 
- Initial source: `km=rn`
- Internal dependencies: `rn`.

### `q` — **CONFIRMED**
- Source: [218399, 218415) UTF-16; [234983, 234999) bytes. 
- Initial source: `q=n=>vn(n.level)`
- Internal dependencies: `vn`.

### `Fi` — **CONFIRMED**
- Source: [218416, 218485) UTF-16; [235000, 235069) bytes. 
- Initial source: `Fi=(n,t)=>\`k${n.id}${Date.now().toString(36)}${(++t.n).toString(36)}\``
- Internal dependencies: none statically named in module.

### `rt` — **CONFIRMED**
- Source: [218486, 218635) UTF-16; [235070, 235219) bytes. 
- Initial source: `function rt(n,t,e,a,i,h){const o={u:Fi(n,t),s:e,g:L(a),q:i,a:kt(e,i,N,[],n.classId),m:["","",""]};return N()<ai(i)&&(o.c=ge(n.classId)),h&&(o.b=1),o}`
- Internal dependencies: `Fi`, `L`, `kt`, `N`, `ai`, `ge`.

### `Pt` — **CONFIRMED**
- Source: [218641, 218687) UTF-16; [235225, 235271) bytes. 
- Initial source: `Pt=(n,t)=>\`{${ja[n.q]}}[${hn[n.q]}] ${z(n,t)}\``
- Internal dependencies: `ja`, `hn`, `z`.

### `bm` — **CONFIRMED**
- Source: [218688, 218909) UTF-16; [235272, 235493) bytes. 
- Initial source: `function bm(n){var i;const t=rn(n);if(!t)return;const e={},a=q(n);for(const h of Y){const o=t.bag.find(c=>c.u===t.worn[h]);o&&o.g<=a&&(e[h]=o)}return gc({worn:e,enh:t.enh`…
- Internal dependencies: `rn`, `q`, `Y`, `gc`.

### `Tm` — **CONFIRMED**
- Source: [218909, 218967) UTF-16; [235493, 235551) bytes. 
- Initial source: `function Tm(n){const t=rn(n);return t?En-t.bag.length:1/0}`
- Internal dependencies: `rn`, `En`.

### `ge` — **CONFIRMED**
- Source: [218973, 219032) UTF-16; [235557, 235616) bytes. 
- Initial source: `ge=n=>{const t=ti(n);return t==="*"?t:Gt(t,N()<.5?"a":"b")}`
- Internal dependencies: `ti`, `Gt`, `N`.

### `ut` — **CONFIRMED**
- Source: [219033, 219538) UTF-16; [235617, 236137) bytes. 
- Initial source: `function ut(n,t,e,a){if(t.af&&Ri(e,t.af,q(n),new Set(Object.values(t.worn)))){const i=ce(e);return n.give(W,i.essence),n.give(O,i.stones),n.dirty=!0,z(e,n.classId)}if(t.b`…
- Internal dependencies: `Ri`, `q`, `ce`, `W`, `O`, `z`, `En`, `Pt`, `hn`.

### `Ai` — **CONFIRMED**
- Source: [219538, 219737) UTF-16; [236137, 236340) bytes. 
- Initial source: `function Ai(n,t,e,a="Nhận trang bị",i=!1,h={}){const o=rn(n);if(!o)return null;const c=Math.min(L(e),q(n)),r=h.slot??Y[Math.floor(N()*Y.length)],u=h.q??Aa(t,N),l=rt(n,o,r`…
- Internal dependencies: `rn`, `L`, `q`, `Y`, `N`, `Aa`, `rt`, `ut`.

### `vm` — **CONFIRMED**
- Source: [219737, 219930) UTF-16; [236340, 236533) bytes. 
- Initial source: `function vm(n,t,e,a,i=!0,h){const o=rn(n);if(!o)return null;const c=Math.min(L(e),q(n)),r=rt(n,o,h??Y[Math.floor(N()*Y.length)],c,Math.max(0,Math.min(lt,Math.floor(t))),i`…
- Internal dependencies: `rn`, `L`, `q`, `rt`, `Y`, `N`, `lt`, `ut`.

### `Mr` — **CONFIRMED**
- Source: [219936, 219972) UTF-16; [236539, 236575) bytes. 
- Initial source: `Mr=()=>Bt[Math.floor(N()*Bt.length)]`
- Internal dependencies: `Bt`, `N`.

### `Ge` — **CONFIRMED**
- Source: [219973, 219977) UTF-16; [236576, 236580) bytes. 
- Initial source: `Ge=4`
- Internal dependencies: none statically named in module.

### `xm` — **CONFIRMED**
- Source: [219978, 220565) UTF-16; [236581, 237170) bytes. 
- Initial source: `function xm(n,t,e,a){if(!rn(n)||n.dead)return[];const i=t==="worldboss"?"worldboss":t==="boss"?"boss":t==="elite"?"elite":"monster";if((i==="monster"||i==="elite")&&Math.`…
- Internal dependencies: `rn`, `vn`, `q`, `ks`, `N`, `Ai`, `hn`, `z`, `Ge`, `bs`, `bn`, `Mr`, `rs`.

### `Kr` — **CONFIRMED**
- Source: [220571, 220649) UTF-16; [237176, 237254) bytes. 
- Object/configuration registry.
- Initial source: `Kr={weapon:"weapon",head:"head",body:"body",legs:"legs",feet:"feet",back:null}`
- Internal dependencies: none statically named in module.

### `ma` — **CONFIRMED**
- Source: [220650, 220675) UTF-16; [237255, 237280) bytes. 
- Array of static or computed entries.
- Initial source: `ma=["belt","ring","jade"]`
- Internal dependencies: none statically named in module.

### `Br` — **CONFIRMED**
- Source: [220681, 220920) UTF-16; [237286, 237525) bytes. 
- Initial source: `function Br(n){var e,a;if(on[n.id])return 5;const t=((e=V[n.id])==null?void 0:e.rarity)??((a=Z[n.id])==null?void 0:a.set.rarity);return t!==void 0&&t>=0?t:n.setGrade!==vo`…
- Internal dependencies: `on`, `V`, `Z`.

### `Lr` — **CONFIRMED**
- Source: [220926, 220971) UTF-16; [237531, 237576) bytes. 
- Initial source: `Lr=n=>n&&Kr[n]||ma[Math.floor(N()*ma.length)]`
- Internal dependencies: `Kr`, `ma`, `N`.

### `Sr` — **CONFIRMED**
- Source: [220972, 221111) UTF-16; [237577, 237716) bytes. 
- Initial source: `function Sr(n,t){const e=ti(n);if(e==="*")return e;const a=Gt(e,"a"),i=Gt(e,"b"),h=o=>t.bag.filter(c=>c.c===o).length;return h(i)>h(a)?i:a}`
- Internal dependencies: `ti`, `Gt`.

### `Nr` — **CONFIRMED**
- Source: [221111, 221501) UTF-16; [237716, 238135) bytes. 
- Initial source: `function Nr(n,t,e="Nhận trang bị"){var o;const a=rn(n);if(!a||!t)return null;const i=rt(n,a,Lr(t.slot),q(n),Math.min(Cr,bc(Br(t))),!!t.bound);i.c&&(i.q>=5||t.id.startsWit`…
- Internal dependencies: `rn`, `rt`, `Lr`, `q`, `Cr`, `bc`, `Br`, `Sr`, `ut`, `U`, `z`, `hn`.

### `Pm` — **CONFIRMED**
- Source: [221501, 221719) UTF-16; [238135, 238357) bytes. 
- Initial source: `function Pm(n,t,e,a="Nhận trang bị"){const i=U(t),h=(i==null?void 0:i.slot)??(V[t]||on[t]?"weapon":void 0);let o=0;for(let c=0;c<Math.min(60,e);c++)Nr(n,{id:t,grade:(i==n`…
- Internal dependencies: `U`, `V`, `on`, `Nr`.

### `$r` — **CONFIRMED**
- Source: [221719, 222596) UTF-16; [238357, 239303) bytes. 
- Initial source: `function $r(n,t){const e=rn(n);if(!e)return!1;if(t==="Rương yêu thú")return n.count(t)<1||(n.give(t,-1),Ai(n,"elite",q(n),"Mở Rương yêu thú"),n.give(O,3),n.dirty=!0),!0;i`…
- Internal dependencies: `rn`, `Ai`, `q`, `O`, `Ei`, `N`, `te`, `qt`, `fr`, `kr`.

### `Ei` — **CONFIRMED**
- Source: [222602, 222623) UTF-16; [239309, 239334) bytes. 
- Initial source: `Ei="Rương thời trang"`
- Internal dependencies: none statically named in module.

### `wm` — **CONFIRMED**
- Source: [222624, 222713) UTF-16; [239335, 239424) bytes. 
- Initial source: `wm=n=>hn.slice(Ge).some(t=>n.startsWith(\`[${t}]\`))||n.includes(Bn)||n.includes(Ei)||Jo(n)`
- Internal dependencies: `hn`, `Ge`, `Bn`, `Ei`, `Jo`.

### `Hm` — **CONFIRMED**
- Source: [222714, 222918) UTF-16; [239425, 239629) bytes. 
- Initial source: `function Hm(n,t){const e=rn(n),a=e!=null&&e.fw?xn[e.fw]:void 0;return a?[...a.pieces,...t.filter(i=>i.startsWith("wp-")||i.startsWith("ex-wp-")||i==="iron-sword"||i==="ja`…
- Internal dependencies: `rn`, `xn`, `on`, `V`.

### `ga` — **CONFIRMED**
- Source: [222924, 223296) UTF-16; [239635, 240095) bytes. 
- Object/configuration registry.
- Initial source: `ga={equip:"Đã mặc.",unequip:"Đã tháo.",ascend:"Thăng phẩm thành công.",reroll:"Tẩy luyện xong: chọn giữ hay nhận dòng mới.",keep:"Đã chọn dòng.",lock:"Đã đổi khóa dòng.",`…
- Internal dependencies: none statically named in module.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.