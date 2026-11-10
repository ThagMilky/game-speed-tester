# Quy tắc mặc, tính chỉ số và tạo vật phẩm

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Các hàm chọn, tạo, kiểm tra và tổng hợp trang bị.
- Character offset vùng: [193553, 205625) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `pl` | function | 193553–194073 | bS | `ln`, `ht`, `Ci`, `it`, `be`, `ye`, `Ni`, `re`, `Be`, `Ki`, `U`, `st` |
| `fl` | function | 194073–194222 | dc | `xi` |
| `yl` | function | 194222–194586 | f8 | `U` |
| `vo` | function | 194586–194790 |  | `U` |
| `kl` | function_expression | 194796–194858 | dP |  |
| `Gi` | function | 194859–194988 | dT | `U`, `mn`, `Zc` |
| `De` | function_expression | 194994–195045 | cr | `U` |
| `xo` | function | 195046–195573 | cM | `U`, `R`, `No`, `De`, `mn`, `Le`, `Ii`, `Ma`, `Gi` |
| `Po` | function | 195573–195738 | eX | `U`, `De`, `mn`, `Le`, `Gi` |
| `wo` | function | 195738–196061 | da |  |
| `bl` | variable | 196067–196195 | f6 |  |
| `Ho` | function | 196196–196363 |  |  |
| `Tl` | function_expression | 196369–196397 | eQ | `Mo` |
| `Mo` | function | 196398–197396 |  | `Ho`, `Da` |
| `vl` | variable | 197402–197452 | eH |  |
| `It` | variable | 197453–197458 | cW |  |
| `Ko` | variable | 197459–197486 |  |  |
| `Co` | variable | 197487–197508 |  |  |
| `Bo` | variable | 197509–197534 |  |  |
| `xl` | variable | 197535–197541 | cJ |  |
| `Pl` | variable | 197542–197547 | cK |  |
| `Lo` | function_expression | 197646–197688 |  | `R`, `yn`, `w`, `un` |
| `Kn` | function_expression | 197689–197753 | c1 |  |
| `So` | function | 197754–198119 | eW | `mo`, `Kn`, `R`, `Un`, `Lo` |
| `No` | function | 198119–198578 |  | `Un`, `mt` |
| `$o` | function | 198578–198895 | bI | `U`, `yn` |
| `Do` | function | 198895–199192 |  | `U`, `vi`, `R`, `ki`, `go`, `po` |
| `Io` | function | 199192–199571 |  | `xi` |
| `Go` | function | 199571–199754 |  | `w` |
| `wl` | function | 199754–203236 | f | `Ia`, `Dt`, `ue`, `Do`, `U`, `De`, `mn`, `ht`, `ln`, `Ci`, `Le`, `Pe` |
| `ta` | variable | 203242–203247 | bv |  |
| `qo` | variable | 203248–203253 | bx |  |
| `ea` | variable | 203254–203260 | dV |  |
| `Vo` | function | 203261–203503 | bw | `U`, `Un` |
| `aa` | function | 203503–203694 | bu | `Vo` |
| `Ro` | function | 203694–203851 | d1 | `aa` |
| `Hl` | function | 203851–203932 | er | `Ro` |
| `Ml` | variable | 203938–204035 | d0 |  |
| `Qo` | function | 204036–204192 | d_ | `U`, `ln`, `Un` |
| `Kl` | function_expression | 204198–204244 | eR | `Qo` |
| `Cl` | variable | 204245–204270 | $ |  |
| `Fo` | variable | 204271–204276 |  |  |
| `ct` | function | 204277–204455 | a0 |  |
| `Ao` | function | 204455–204548 | el | `ct` |
| `qi` | variable | 204554–205454 | O |  |
| `Bl` | function | 205455–205557 | eF | `ct` |
| `Ll` | function | 205557–205625 | m | `ct` |

## Source-grounded implementation notes

### `pl` — **CONFIRMED**
- Source: [193553, 194073) UTF-16; [208866, 209386) bytes. 
- Initial source: `function pl(n,t){const e=(ln(n.id)||ht(n.id))&&t!==void 0?Math.max(n.tier??0,Ci(t)):n.tier,a=it(e),i=be(n.id,t);if(i){const o=n.slot==="weapon"?ye(n.upgrade??0):Ni(n.upgr`…
- Internal dependencies: `ln`, `ht`, `Ci`, `it`, `be`, `ye`, `Ni`, `re`, `Be`, `Ki`, `U`, `$i`, `st`, `Pi`, `fi`.

### `fl` — **CONFIRMED**
- Source: [194073, 194222) UTF-16; [209386, 209535) bytes. 
- Initial source: `function fl(n,t){if(t&&(n==="iron-sword"||n==="jade-sword"))return wi[t].look;const e=xi(n);return e?\`${et}${e.set.classId}~${e.set.id}~${e.slot}\`:n}`
- Internal dependencies: `wi`, `xi`, `et`.

### `yl` — **CONFIRMED**
- Source: [194222, 194586) UTF-16; [209535, 209899) bytes. 
- Initial source: `function yl(n){const t=m=>n.find(f=>{var y;return((y=U(f.id))==null?void 0:y.slot)===m}),e=m=>{var f;return m?((f=U(m.id))==null?void 0:f.grade)??-1:-1},a=e(t("head")),i=`…
- Internal dependencies: `U`.

### `vo` — **CONFIRMED**
- Source: [194586, 194790) UTF-16; [209899, 210103) bytes. 
- Initial source: `function vo(n){let t=-1,e=-1,a=-1;for(const i of n){const h=i?U(i):void 0;if(!h||h.slot==="legs"||h.slot==="back")continue;const o=h.auraGrade;o>t?(a=e,e=t,t=o):o>e?(a=e,`…
- Internal dependencies: `U`, `Mc`.

### `kl` — **CONFIRMED**
- Source: [194796, 194858) UTF-16; [210109, 210171) bytes. 
- Initial source: `kl=(n,t)=>n.uid===t.uid&&JSON.stringify(n)===JSON.stringify(t)`
- Internal dependencies: none statically named in module.

### `Gi` — **CONFIRMED**
- Source: [194859, 194988) UTF-16; [210172, 210303) bytes. 
- Initial source: `function Gi(n,t=0,e,a=0){const i=U(n),h=i?i.name:n,o=mn(a);return h+(e?" · "+wi[e].name:"")+(t>0?" +"+t:"")+(o>0?" · "+Zc(o):"")}`
- Internal dependencies: `U`, `mn`, `wi`, `Zc`.

### `De` — **CONFIRMED**
- Source: [194994, 195045) UTF-16; [210309, 210360) bytes. 
- Initial source: `De=n=>{const t=U(n);return!!t&&t.kind!=="cosmetic"}`
- Internal dependencies: `U`.

### `xo` — **CONFIRMED**
- Source: [195046, 195573) UTF-16; [210361, 210888) bytes. 
- Initial source: `function xo(n,t,e=0,a,i=0){const h=U(n);if(!h)return null;const o=h.kind!=="cosmetic"?R(Math.trunc(e),0,It):0,c=h.kind==="weapon"&&a&&No(n)===null?a:void 0,r=De(n)?mn(i):`…
- Internal dependencies: `U`, `R`, `It`, `No`, `De`, `mn`, `Le`, `Ma`, `Ii`, `Gi`.

### `Po` — **CONFIRMED**
- Source: [195573, 195738) UTF-16; [210888, 211053) bytes. 
- Initial source: `function Po(n,t){const e=U(n.id),a=De(n.id)?mn(t):0;e&&(a?n.tier=a:delete n.tier,n.level=Math.max(e.requiredLevel,a?Le(a):0),n.name=Gi(n.id,n.upgrade??0,n.inlay,a))}`
- Internal dependencies: `U`, `De`, `mn`, `Le`, `Gi`.

### `wo` — **CONFIRMED**
- Source: [195738, 196061) UTF-16; [211053, 211382) bytes. 
- Initial source: `function wo(n){const t=new RegExp(\`^(.*?)(?: \\+(1[0-6]|[1-9]))?(?: · (Hỏa|Kim))?(?: \\+(1[0-6]|[1-9]))?(?: · (?:${An.join("|")}))?$\`).exec(n.trim());if(!t)return null;co`…
- Internal dependencies: `An`, `Ot`.

### `bl` — **CONFIRMED**
- Source: [196067, 196195) UTF-16; [211388, 211531) bytes. 
- Object/configuration registry.
- Initial source: `bl={items:[{name:"Thiết kiếm",count:1},{name:"Áo lữ hành",count:1},{name:"Hồi Xuân Đan",count:3},{name:"Hồi Linh Đan",count:3}]}`
- Internal dependencies: none statically named in module.

### `Ho` — **CONFIRMED**
- Source: [196196, 196363) UTF-16; [211532, 211699) bytes. 
- Initial source: `function Ho(n,t={}){return Rc.includes(n)?n:t.worldBoss?t.worldBoss:n==="elite"||n==="boss"?"miniboss":t.archetype==="melee"||t.archetype==="thrower"?"goblin":"beast"}`
- Internal dependencies: `Rc`.

### `Tl` — **CONFIRMED**
- Source: [196369, 196397) UTF-16; [211705, 211733) bytes. 
- Initial source: `Tl=(...n)=>tc.on?[]:Mo(...n)`
- Internal dependencies: `tc`, `Mo`.

### `Mo` — **CONFIRMED**
- Source: [196398, 197396) UTF-16; [211734, 212732) bytes. 
- Initial source: `function Mo(n,t,e,a=Math.random,i){const h=Ho(n,i),o=h==="serpent"||h==="kraken",c=n==="boss"||o,r=n==="elite"||h==="mother"||h==="miniboss";if(a()>=(o?1:c?.75:r?.2:.06))`…
- Internal dependencies: `Ho`, `E`, `Cn`, `Mt`, `Ht`, `Da`.

### `vl` — **CONFIRMED**
- Source: [197402, 197452) UTF-16; [212738, 212788) bytes. 
- Object/configuration registry.
- Initial source: `vl={ownerSeconds:30,gearSeconds:120,noticeGrade:4}`
- Internal dependencies: none statically named in module.

### `It` — **CONFIRMED**
- Source: [197453, 197458) UTF-16; [212789, 212794) bytes. 
- Initial source: `It=16`
- Internal dependencies: none statically named in module.

### `Ko` — **CONFIRMED**
- Source: [197459, 197486) UTF-16; [212795, 212822) bytes. 
- Array of static or computed entries.
- Initial source: `Ko=[0,100,500,2e3,8e3,24e3]`
- Internal dependencies: none statically named in module.

### `Co` — **CONFIRMED**
- Source: [197487, 197508) UTF-16; [212823, 212844) bytes. 
- Array of static or computed entries.
- Initial source: `Co=[20,40,70,110,160]`
- Internal dependencies: none statically named in module.

### `Bo` — **CONFIRMED**
- Source: [197509, 197534) UTF-16; [212845, 212870) bytes. 
- Array of static or computed entries.
- Initial source: `Bo=[1e3,3e3,8e3,15e3,3e4]`
- Internal dependencies: none statically named in module.

### `xl` — **CONFIRMED**
- Source: [197535, 197541) UTF-16; [212871, 212877) bytes. 
- Initial source: `xl=100`
- Internal dependencies: none statically named in module.

### `Pl` — **CONFIRMED**
- Source: [197542, 197547) UTF-16; [212878, 212883) bytes. 
- Initial source: `Pl=20`
- Internal dependencies: none statically named in module.

### `Lo` — **CONFIRMED**
- Source: [197646, 197688) UTF-16; [212982, 213024) bytes. 
- Initial source: `Lo=(n,t)=>un(w(Ko[R(n,0,5)]*w(mi[yn(t)])))`
- Internal dependencies: `un`, `w`, `Ko`, `R`, `mi`, `yn`.

### `Kn` — **CONFIRMED**
- Source: [197689, 197753) UTF-16; [213025, 213091) bytes. 
- Initial source: `Kn=n=>{var t;return"Mảnh "+(((t=on[n])==null?void 0:t.name)??n)}`
- Internal dependencies: `on`.

### `So` — **CONFIRMED**
- Source: [197754, 198119) UTF-16; [213092, 213472) bytes. 
- Initial source: `function So(n,t){if(n<1||n>It)return[];if(mo(t))return[{item:Kn(t),amount:Co[R(n-1,0,4)]},{item:"Linh thạch",amount:Bo[R(n-1,0,4)]}];const e=[{item:"Thỏi sắt",amount:n*2}`…
- Internal dependencies: `It`, `mo`, `Kn`, `Co`, `R`, `Bo`, `Lo`, `Un`.

### `No` — **CONFIRMED**
- Source: [198119, 198578) UTF-16; [213472, 214017) bytes. 
- Initial source: `function No(n,t){if(n===Qn.brush)return"Điểm Tiên Bút giữ thuộc tính mực, chưa hỗ trợ khảm Hỏa/Kim.";const e=on[n];return e&&!e.classId?"Pháp khí giữ thuộc tính riêng, ch`…
- Internal dependencies: `Qn`, `on`, `V`, `mt`, `Un`.

### `$o` — **CONFIRMED**
- Source: [198578, 198895) UTF-16; [214017, 214334) bytes. 
- Initial source: `function $o(n,t=0){const e=U(n);return e?Z[n]?{[-1]:2,0:8,1:24,2:80,3:240,4:600,5:1200,6:2400}[Z[n].set.rarity]??8:e.kind==="armor"?vt[yn(e.grade)]:V[n]&&!V[n].wheel?(vt[`…
- Internal dependencies: `U`, `Z`, `vt`, `yn`, `V`.

### `Do` — **CONFIRMED**
- Source: [198895, 199192) UTF-16; [214334, 214631) bytes. 
- Initial source: `function Do(n){if(n.id)return U(n.id)?n.id:null;if(!n.slot||n.grade===void 0)return null;if(n.setId){const t=vi(n.setId);return t&&n.slot!=="weapon"?ki(t.classId,t.id,n.s`…
- Internal dependencies: `U`, `vi`, `ki`, `R`, `nn`, `go`, `si`, `po`.

### `Io` — **CONFIRMED**
- Source: [199192, 199571) UTF-16; [214631, 215010) bytes. 
- Initial source: `function Io(n,t){const e=new Map;for(const a of n){const i=xi(a);if(!i||i.set.classId!==t)continue;const h=e.get(i.set);e.set(i.set,h?{pieces:h.pieces+1,grade:Math.min(h.`…
- Internal dependencies: `xi`, `nn`.

### `Go` — **CONFIRMED**
- Source: [199571, 199754) UTF-16; [215010, 215193) bytes. 
- Initial source: `function Go(n){const t={};for(const e of n)if(e.two){let a=w(e.set.two.value*w(e.scale));e.set.two.stat!=="armor"&&(a=w(a/100)),t[e.set.two.stat]=w((t[e.set.two.stat]??0)`…
- Internal dependencies: `w`.

### `wl` — **CONFIRMED**
- Source: [199754, 203236) UTF-16; [215193, 218718) bytes. 
- Initial source: `function wl(n,t,e,a,i,h){var Ee;const o=Ia(i,t),c=Dt(n),r=n==="the-tu"?{...c,armor:c.armor+Math.round((ue(t)-1)*xt.armor)}:c,u=[],l=new Map;for(const k of e){const M=Do(k`…
- Internal dependencies: `Ia`, `Dt`, `ue`, `xt`, `Do`, `U`, `De`, `mn`, `ht`, `ln`, `Ci`, `Le`, `Pe`, `io`, `R`, `It`, `Ni`, `it`, `be`, `Ki`, `Be`, `si`, `Dn`, `ri`, `Me`, `oi`, `He`, `$t`, `un`, `w`.

### `ta` — **CONFIRMED**
- Source: [203242, 203247) UTF-16; [218724, 218729) bytes. 
- Initial source: `ta=60`
- Internal dependencies: none statically named in module.

### `qo` — **CONFIRMED**
- Source: [203248, 203253) UTF-16; [218730, 218735) bytes. 
- Initial source: `qo=99`
- Internal dependencies: none statically named in module.

### `ea` — **CONFIRMED**
- Source: [203254, 203260) UTF-16; [218736, 218742) bytes. 
- Initial source: `ea=240`
- Internal dependencies: none statically named in module.

### `Vo` — **CONFIRMED**
- Source: [203261, 203503) UTF-16; [218743, 218985) bytes. 
- Initial source: `function Vo(n){var e,a,i;if(((e=U(n.id))==null?void 0:e.kind)!=="weapon")return null;const t=Un(n.id);return t<0||t>=3||(n.upgrade??0)>0||n.inlay||(a=n.gems)!=null&&a.len`…
- Internal dependencies: `U`, `Un`.

### `aa` — **CONFIRMED**
- Source: [203503, 203694) UTF-16; [218985, 219176) bytes. 
- Initial source: `function aa(n,t=new Set){const e=new Map;let a=0;for(const i of n){const h=t.has(i.uid)?null:Vo(i);h===null?a++:e.set(h,(e.get(h)??0)+1)}for(const i of e.values())a+=Math`…
- Internal dependencies: `Vo`, `qo`.

### `Ro` — **CONFIRMED**
- Source: [203694, 203851) UTF-16; [219176, 219333) bytes. 
- Initial source: `function Ro(n,t,e){return typeof e=="number"?aa(n,t)+e<=ta&&n.length+e<=ea:n.length+e.length<=ea&&aa([...n,...e.map((a,i)=>({...a,uid:\`\0new${i}\`}))],t)<=ta}`
- Internal dependencies: `aa`, `ta`, `ea`.

### `Hl` — **CONFIRMED**
- Source: [203851, 203932) UTF-16; [219333, 219414) bytes. 
- Initial source: `function Hl(n,t,e){let a=0;for(;a<e.length&&Ro(n,t,e.slice(0,a+1));)a++;return a}`
- Internal dependencies: `Ro`.

### `Ml` — **CONFIRMED**
- Source: [203938, 204035) UTF-16; [219420, 219547) bytes. 
- Array of static or computed entries.
- Initial source: `Ml=["Nhặt tất cả","Từ xanh lục trở lên","Từ xanh lam trở lên","Từ tím trở lên","Từ vàng trở lên"]`
- Internal dependencies: none statically named in module.

### `Qo` — **CONFIRMED**
- Source: [204036, 204192) UTF-16; [219548, 219704) bytes. 
- Initial source: `function Qo(n){const t=U(n.id);return!t||n.setGrade!==void 0||t.kind==="cosmetic"||ln(n.id)?null:t.kind==="weapon"?Math.max(0,Un(n.id)):Math.max(0,n.grade)}`
- Internal dependencies: `U`, `ln`, `Un`.

### `Kl` — **CONFIRMED**
- Source: [204198, 204244) UTF-16; [219710, 219756) bytes. 
- Initial source: `Kl=(n,t)=>{const e=Qo(n);return e!==null&&e<t}`
- Internal dependencies: `Qo`.

### `Cl` — **CONFIRMED**
- Source: [204245, 204270) UTF-16; [219757, 219782) bytes. 
- Array of static or computed entries.
- Initial source: `Cl=["thach-su","be-ngan"]`
- Internal dependencies: none statically named in module.

### `ct` — **CONFIRMED**
- Source: [204277, 204455) UTF-16; [219789, 219967) bytes. 
- Initial source: `function ct(n,t){var e;return t==="sword"||t==="con-bang"&&n.conBangUnlocked===!0||t==="hac-long"&&Fo&&n.hacLongUnlocked===!0||((e=n.bossMounts)==null?void 0:e.includes(t`…
- Internal dependencies: `Fo`.

### `Ao` — **CONFIRMED**
- Source: [204455, 204548) UTF-16; [219967, 220060) bytes. 
- Initial source: `function Ao(n,t){return n.dirty=!0,ct(n,t)?!1:((n.bossMounts??(n.bossMounts=[])).push(t),!0)}`
- Internal dependencies: `ct`.

### `qi` — **CONFIRMED**
- Source: [204554, 205454) UTF-16; [220066, 221130) bytes. 
- Object/configuration registry.
- Initial source: `qi={sword:{name:"Phi kiếm",passive:"Ngự Phong",speed:.05,description:"+5% tốc độ khi đang cưỡi và ngoài giao chiến."},"con-bang":{name:"Côn Bằng",passive:"Bằng Trình",spe`…
- Internal dependencies: none statically named in module.

### `Bl` — **CONFIRMED**
- Source: [205455, 205557) UTF-16; [221131, 221233) bytes. 
- Initial source: `function Bl(n,t){return!n.flying||n.dead||t<n.combatUntil?1:1+qi[ct(n,n.mount)?n.mount:"sword"].speed}`
- Internal dependencies: `qi`, `ct`.

### `Ll` — **CONFIRMED**
- Source: [205557, 205625) UTF-16; [221233, 221301) bytes. 
- Initial source: `function Ll(n){return n.mount==="hac-long"&&ct(n,"hac-long")?1.05:1}`
- Internal dependencies: `ct`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.