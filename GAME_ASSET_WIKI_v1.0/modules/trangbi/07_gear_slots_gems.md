# Ô trang bị, đá quý, phẩm, nâng cấp và thức tỉnh

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Cấu trúc ô trang bị, bảng giá và công thức liên quan.
- Character offset vùng: [147627, 158027) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `tc` | variable | 147633–147728 | br |  |
| `ve` | variable | 147729–147984 | as |  |
| `Y` | variable | 147985–148002 | L |  |
| `Rn` | function_expression | 148003–148042 | ef |  |
| `dn` | function_expression | 148043–148074 | M |  |
| `hn` | variable | 148075–148123 | U |  |
| `ja` | variable | 148124–148198 | V |  |
| `Eu` | variable | 148199–148217 | ab |  |
| `Wa` | variable | 148218–148373 | an |  |
| `ec` | variable | 148374–148619 |  |  |
| `tn` | function_expression | 148620–148717 |  |  |
| `ac` | function_expression | 148718–148740 |  | `tn` |
| `Xa` | function | 148741–149073 | bk | `as` |
| `Ya` | variable | 149079–149383 |  |  |
| `ic` | variable | 149384–149971 | aP |  |
| `We` | variable | 149972–150808 | e4 |  |
| `Ja` | function_expression | 150809–150876 |  | `tn`, `L` |
| `za` | function_expression | 150877–150908 |  |  |
| `Uu` | function_expression | 150909–150958 | aX | `Ja`, `za` |
| `hc` | function | 150959–151063 |  |  |
| `sc` | function | 151063–151226 |  |  |
| `kt` | function | 151226–151454 |  | `sc`, `hc` |
| `Bt` | variable | 151460–151495 | _ |  |
| `At` | variable | 151496–151801 | a3 |  |
| `Jt` | function_expression | 151802–151827 |  | `tn` |
| `cc` | variable | 151828–151883 |  |  |
| `oc` | variable | 151884–151944 |  |  |
| `Za` | function | 151945–152210 |  | `tn`, `Jt` |
| `_u` | function | 152210–152366 | ax | `Za`, `za` |
| `bn` | function_expression | 152372–152420 | aa | `tn` |
| `Xe` | function | 152421–152604 | d7 |  |
| `xe` | function_expression | 152610–152661 | aW |  |
| `rc` | variable | 152662–152669 |  |  |
| `zt` | function_expression | 152670–152681 | bd |  |
| `Ye` | function_expression | 152682–152693 | aV |  |
| `ni` | function_expression | 152694–152714 | e3 |  |
| `Lt` | function | 152715–152894 | aU |  |
| `uc` | variable | 152900–152912 | aO |  |
| `St` | variable | 152913–152918 |  |  |
| `Et` | function_expression | 152919–152939 | aN |  |
| `lc` | function_expression | 152940–152979 | aM | `L`, `Et` |
| `En` | variable | 152980–152986 | am |  |
| `mc` | function | 152987–153226 | aq | `L`, `tn`, `ac` |
| `z` | function_expression | 153232–153383 | ap | `dn`, `L`, `Et` |
| `gc` | function | 153384–154584 | aR | `mc`, `Ja`, `Lt`, `xe`, `Za`, `L`, `Et`, `lc`, `us`, `dc` |
| `dc` | function | 154584–154907 |  |  |
| `ti` | function_expression | 154913–154930 |  |  |
| `Ut` | variable | 154931–154935 | b7 |  |
| `$n` | variable | 154936–154940 | b9 |  |
| `Je` | variable | 154941–154945 | b8 |  |
| `ei` | variable | 154946–154960 |  |  |
| `pc` | function_expression | 154961–155038 | ba | `tn`, `L` |
| `ft` | variable | 155039–155112 | dl |  |
| `fc` | variable | 155113–155264 | dm |  |
| `yc` | variable | 155265–155294 | bg |  |
| `Nt` | variable | 155295–155960 |  |  |
| `kc` | function_expression | 155961–155988 | b5 |  |
| `Ou` | function_expression | 155989–156223 | b6 | `tn` |
| `bc` | function_expression | 156224–156239 |  | `tn` |
| `Tc` | function_expression | 156240–156334 | b4 | `L` |
| `ce` | function_expression | 156335–156499 | ar | `tn`, `L` |
| `ai` | function_expression | 156500–156522 |  |  |
| `ju` | function | 156523–156686 | aS |  |
| `vc` | variable | 156692–156739 |  |  |
| `oe` | variable | 156740–156745 | fc |  |
| `xc` | function_expression | 156746–156779 |  |  |
| `ii` | function_expression | 156780–156845 |  |  |
| `Pc` | function | 156846–156891 |  |  |
| `hi` | function | 156891–156987 | fe | `Pc` |
| `nt` | function | 156987–157208 | r | `ii`, `hi`, `xc` |
| `Wu` | function | 157208–157469 | G | `ii`, `nt`, `hi`, `wt` |
| `Pe` | function_expression | 157475–157492 | l | `nt` |
| `Xu` | function_expression | 157493–157548 | d | `nt` |
| `wc` | function | 157549–157760 | y | `nt` |
| `Yu` | function | 157760–157948 | d3 | `wc`, `Pe` |
| `un` | function | 157948–158027 |  |  |

## Source-grounded implementation notes

### `tc` — **CONFIRMED**
- Source: [147633, 147728) UTF-16; [159012, 159107) bytes. 
- Object/configuration registry.
- Initial source: `tc={on:((pa=(da=globalThis.process)==null?void 0:da.env)==null?void 0:pa.KT_LEGACY_GEAR)!=="1"}`
- Internal dependencies: `pa`, `da`.

### `ve` — **CONFIRMED**
- Source: [147729, 147984) UTF-16; [159108, 159377) bytes. 
- Array of static or computed entries.
- Initial source: `ve=[{id:"weapon",name:"Vũ khí",atk:!0},{id:"head",name:"Mũ",atk:!1},{id:"body",name:"Áo",atk:!1},{id:"legs",name:"Quần",atk:!1},{id:"feet",name:"Giày",atk:!1},{id:"belt",`…
- Internal dependencies: none statically named in module.

### `Y` — **CONFIRMED**
- Source: [147985, 148002) UTF-16; [159378, 159395) bytes. 
- Initial source: `Y=ve.map(n=>n.id)`
- Internal dependencies: `ve`.

### `Rn` — **CONFIRMED**
- Source: [148003, 148042) UTF-16; [159396, 159435) bytes. 
- Initial source: `Rn=n=>typeof n=="string"&&Y.includes(n)`
- Internal dependencies: `Y`.

### `dn` — **CONFIRMED**
- Source: [148043, 148074) UTF-16; [159436, 159467) bytes. 
- Initial source: `dn=n=>ve.find(t=>t.id===n).name`
- Internal dependencies: `ve`.

### `hn` — **CONFIRMED**
- Source: [148075, 148123) UTF-16; [159468, 159526) bytes. 
- Array of static or computed entries.
- Initial source: `hn=["Trắng","Lục","Lam","Tím","Cam","Đỏ","Thần"]`
- Internal dependencies: none statically named in module.

### `ja` — **CONFIRMED**
- Source: [148124, 148198) UTF-16; [159527, 159601) bytes. 
- Array of static or computed entries.
- Initial source: `ja=["#c7ccd1","#66e680","#59b3ff","#bf73ff","#ff9433","#ff5247","#ff5cf0"]`
- Internal dependencies: none statically named in module.

### `Eu` — **CONFIRMED**
- Source: [148199, 148217) UTF-16; [159602, 159620) bytes. 
- Array of static or computed entries.
- Initial source: `Eu=[0,1,2,3,5,6,7]`
- Internal dependencies: none statically named in module.

### `Wa` — **CONFIRMED**
- Source: [148218, 148373) UTF-16; [159621, 159810) bytes. 
- Array of static or computed entries.
- Initial source: `Wa=["Phàm Thiết","Thanh Mộc","Xích Kim","Huyền Băng","Tử Lôi","Hư Không","Hỗn Nguyên","Vạn Tượng","Tiên Linh","Kim Ô","Thái Ất","Đại La","Nghịch Thiên Ký"]`
- Internal dependencies: none statically named in module.

### `ec` — **CONFIRMED**
- Source: [148374, 148619) UTF-16; [159811, 160056) bytes. 
- Object/configuration registry.
- Initial source: `ec={weapon:{atk:.7,hp:0,armor:0},ring:{atk:.15,hp:0,armor:0},jade:{atk:.1,hp:.1,armor:0},belt:{atk:.05,hp:.12,armor:.08},head:{atk:0,hp:.16,armor:.2},body:{atk:0,hp:.3,ar`…
- Internal dependencies: none statically named in module.

### `tn` — **CONFIRMED**
- Source: [148620, 148717) UTF-16; [160057, 160154) bytes. 
- Initial source: `tn=(n,t,e)=>{const a=Math.floor(Number(n));return Number.isFinite(a)?Math.min(e,Math.max(t,a)):t}`
- Internal dependencies: none statically named in module.

### `ac` — **CONFIRMED**
- Source: [148718, 148740) UTF-16; [160155, 160177) bytes. 
- Initial source: `ac=n=>1+ts[tn(n,0,Sn)]`
- Internal dependencies: `ts`, `tn`, `Sn`.

### `Xa` — **CONFIRMED**
- Source: [148741, 149073) UTF-16; [160178, 160532) bytes. 
- Initial source: `function Xa(n,t,e){const a=n+1,i=as(e);return n>=Sn?{next:a,cap:i,chance:0,stones:0,silver:0,error:\`Ô đã đạt +${Sn}.\`}:n>=i?{next:a,cap:i,chance:0,stones:0,silver:0,error`…
- Internal dependencies: `as`, `Sn`, `qa`, `es`.

### `Ya` — **CONFIRMED**
- Source: [149079, 149383) UTF-16; [160538, 160842) bytes. 
- Object/configuration registry.
- Initial source: `Ya={atkPct:.03,hpPct:.04,critPct:.02,critDmgPct:.06,skillDmgPct:.03,monsterDmgPct:.04,lifestealPct:.012,cdrPct:.015,dmgReducePct:.015,controlDurationReduce:.04,movePct:.0`…
- Internal dependencies: none statically named in module.

### `ic` — **CONFIRMED**
- Source: [149384, 149971) UTF-16; [160843, 161521) bytes. 
- Object/configuration registry.
- Initial source: `ic={atkPct:"Sát thương",hpPct:"Máu tối đa",critPct:"Chí mạng",critDmgPct:"Sát thương chí mạng",skillDmgPct:"Sát thương chiêu",monsterDmgPct:"Sát thương lên quái",lifestea`…
- Internal dependencies: none statically named in module.

### `We` — **CONFIRMED**
- Source: [149972, 150808) UTF-16; [161522, 162358) bytes. 
- Object/configuration registry.
- Initial source: `We={weapon:["atkPct","critPct","critDmgPct","skillDmgPct","monsterDmgPct","lifestealPct","armorPenPct","magPenPct","physDmgPct","magDmgPct"],ring:["atkPct","critPct","cri`…
- Internal dependencies: none statically named in module.

### `Ja` — **CONFIRMED**
- Source: [150809, 150876) UTF-16; [162359, 162426) bytes. 
- Initial source: `Ja=(n,t,e)=>Math.round((Ya[n]??0)*tn(t,1,5)/5*(1+.05*L(e))*1e4)/1e4`
- Internal dependencies: `Ya`, `tn`, `L`.

### `za` — **CONFIRMED**
- Source: [150877, 150908) UTF-16; [162427, 162458) bytes. 
- Initial source: `za=n=>\`${+(n*100).toFixed(2)}%\``
- Internal dependencies: none statically named in module.

### `Uu` — **CONFIRMED**
- Source: [150909, 150958) UTF-16; [162459, 162508) bytes. 
- Initial source: `Uu=(n,t)=>\`${ic[n.k]??n.k} +${za(Ja(n.k,n.t,t))}\``
- Internal dependencies: `ic`, `za`, `Ja`.

### `hc` — **CONFIRMED**
- Source: [150959, 151063) UTF-16; [162509, 162613) bytes. 
- Initial source: `function hc(n,t){const e=hs[n];let a=t()*100;for(let i=0;i<5;i++){if(a<e[i])return i+1;a-=e[i]}return 1}`
- Internal dependencies: `hs`.

### `sc` — **CONFIRMED**
- Source: [151063, 151226) UTF-16; [162613, 162776) bytes. 
- Initial source: `function sc(n,t){if(!t)return We[n];const e=(Oa[t]??"phys")==="phys"?["magPenPct","magDmgPct"]:["armorPenPct","physDmgPct"];return We[n].filter(a=>!e.includes(a))}`
- Internal dependencies: `We`, `Oa`.

### `kt` — **CONFIRMED**
- Source: [151226, 151454) UTF-16; [162776, 163004) bytes. 
- Initial source: `function kt(n,t,e,a=[],i){const h=a.map(c=>({...c})),o=sc(n,i).filter(c=>!h.some(r=>r.k===c));for(;h.length<Ra[t]&&o.length;){const c=o.splice(Math.min(o.length-1,Math.fl`…
- Internal dependencies: `sc`, `Ra`, `hc`.

### `Bt` — **CONFIRMED**
- Source: [151460, 151495) UTF-16; [163010, 163045) bytes. 
- Array of static or computed entries.
- Initial source: `Bt=["kim","moc","thuy","hoa","tho"]`
- Internal dependencies: none statically named in module.

### `At` — **CONFIRMED**
- Source: [151496, 151801) UTF-16; [163046, 163370) bytes. 
- Object/configuration registry.
- Initial source: `At={kim:{name:"Kim",color:"#f4db9a",atkSlots:!0,text:"công"},hoa:{name:"Hỏa",color:"#ff7a4a",atkSlots:!0,text:"chí mạng"},moc:{name:"Mộc",color:"#7cf08a",atkSlots:!1,text`…
- Internal dependencies: none statically named in module.

### `Jt` — **CONFIRMED**
- Source: [151802, 151827) UTF-16; [163371, 163396) bytes. 
- Initial source: `Jt=n=>1.4**(tn(n,1,Nn)-1)`
- Internal dependencies: `tn`, `Nn`.

### `cc` — **CONFIRMED**
- Source: [151828, 151883) UTF-16; [163397, 163452) bytes. 
- Array of static or computed entries.
- Initial source: `cc=[0,.003,.005,.008,.012,.017,.023,.03,.038,.047,.057]`
- Internal dependencies: none statically named in module.

### `oc` — **CONFIRMED**
- Source: [151884, 151944) UTF-16; [163453, 163513) bytes. 
- Array of static or computed entries.
- Initial source: `oc=[0,.002,.0035,.0055,.008,.011,.0145,.0185,.023,.028,.034]`
- Internal dependencies: none statically named in module.

### `Za` — **CONFIRMED**
- Source: [151945, 152210) UTF-16; [163514, 163779) bytes. 
- Initial source: `function Za(n,t){const e=tn(t,1,Nn);switch(n){case"kim":return{atk:Math.round(3*Jt(e))};case"moc":return{hp:Math.round(25*Jt(e))};case"tho":return{armor:Math.round(2*Jt(e`…
- Internal dependencies: `tn`, `Nn`, `Jt`, `cc`, `oc`.

### `_u` — **CONFIRMED**
- Source: [152210, 152366) UTF-16; [163779, 163938) bytes. 
- Initial source: `function _u(n,t){const e=Za(n,t);return e.atk?\`+${e.atk} công\`:e.hp?\`+${e.hp} máu\`:e.armor?\`+${e.armor} giáp\`:e.bonus?\`+${za(e.bonus[1])} ${At[n].text}\`:""}`
- Internal dependencies: `Za`, `za`, `At`.

### `bn` — **CONFIRMED**
- Source: [152372, 152420) UTF-16; [163944, 163996) bytes. 
- Initial source: `bn=(n,t)=>\`Ngọc ${At[n].name} cấp ${tn(t,1,Nn)}\``
- Internal dependencies: `At`, `tn`, `Nn`.

### `Xe` — **CONFIRMED**
- Source: [152421, 152604) UTF-16; [163997, 164192) bytes. 
- Initial source: `function Xe(n){const t=/^Ngọc (Kim|Mộc|Thủy|Hỏa|Thổ) cấp (\d+)$/.exec(n);if(!t)return null;const e=Bt.find(i=>At[i].name===t[1]),a=Number(t[2]);return e&&a>=1&&a<=Nn?{el:`…
- Internal dependencies: `Bt`, `At`, `Nn`.

### `xe` — **CONFIRMED**
- Source: [152610, 152661) UTF-16; [164198, 164249) bytes. 
- Initial source: `xe=(n,t)=>ve.find(e=>e.id===n).atk===At[t].atkSlots`
- Internal dependencies: `ve`, `At`.

### `zt` — **CONFIRMED**
- Source: [152670, 152681) UTF-16; [164258, 164269) bytes. 
- Initial source: `zt=n=>200*n`
- Internal dependencies: none statically named in module.

### `Ye` — **CONFIRMED**
- Source: [152682, 152693) UTF-16; [164270, 164281) bytes. 
- Initial source: `Ye=n=>500*n`
- Internal dependencies: none statically named in module.

### `ni` — **CONFIRMED**
- Source: [152694, 152714) UTF-16; [164282, 164302) bytes. 
- Initial source: `ni=(n,t)=>\`${n}${t}\``
- Internal dependencies: none statically named in module.

### `Lt` — **CONFIRMED**
- Source: [152715, 152894) UTF-16; [164303, 164482) bytes. 
- Initial source: `function Lt(n){if(typeof n!="string")return null;const t=/^(kim|moc|thuy|hoa|tho)(\d{1,2})$/.exec(n);if(!t)return null;const e=Number(t[2]);return e>=1&&e<=Nn?{el:t[1],lv`…
- Internal dependencies: `Nn`.

### `uc` — **CONFIRMED**
- Source: [152900, 152912) UTF-16; [164488, 164500) bytes. 
- Array of static or computed entries.
- Initial source: `uc=[2,4,6,8]`
- Internal dependencies: none statically named in module.

### `Et` — **CONFIRMED**
- Source: [152919, 152939) UTF-16; [164507, 164527) bytes. 
- Initial source: `Et=n=>St[n]??St["*"]`
- Internal dependencies: `St`.

### `lc` — **CONFIRMED**
- Source: [152940, 152979) UTF-16; [164528, 164568) bytes. 
- Initial source: `lc=(n,t)=>\`${Wa[L(t)]} · ${Et(n).name}\``
- Internal dependencies: `Wa`, `L`, `Et`.

### `En` — **CONFIRMED**
- Source: [152980, 152986) UTF-16; [164569, 164575) bytes. 
- Initial source: `En=120`
- Internal dependencies: none statically named in module.

### `mc` — **CONFIRMED**
- Source: [152987, 153226) UTF-16; [164576, 164815) bytes. 
- Initial source: `function mc(n,t=0){const e=L(n.g),a=tn(n.q,0,lt),i=ec[n.s],h=Ga[a]*ac(t)/Zh,o=Math.round(Yh[e]*i.atk*h);return{wd:n.s==="weapon"?o:0,atk:n.s==="weapon"?0:o,hp:Math.round(`…
- Internal dependencies: `L`, `tn`, `lt`, `ec`, `Ga`, `ac`, `Zh`, `Yh`, `Jh`, `zh`, `ns`.

### `z` — **CONFIRMED**
- Source: [153232, 153383) UTF-16; [164821, 164973) bytes. 
- Initial source: `z=(n,t)=>{var e;return\`${n.s==="weapon"?nc[t??((e=n.c)==null?void 0:e.split(":")[0])??""]??dn(n.s):dn(n.s)} ${Wa[L(n.g)]}${n.c?" · "+Et(n.c).name:""}\`}`
- Internal dependencies: `nc`, `dn`, `Wa`, `L`, `Et`.

### `gc` — **CONFIRMED**
- Source: [153384, 154584) UTF-16; [164974, 166174) bytes. 
- Initial source: `function gc(n,t){const e={wd:0,atk:0,hp:0,armor:0,move:0,bonus:{},sets:[],body:0},a=(c,r)=>{e.bonus[c]=Math.round(((e.bonus[c]??0)+r)*1e4)/1e4},i=new Map;for(const c of Y`…
- Internal dependencies: `Y`, `mc`, `Ja`, `Ut`, `$n`, `Lt`, `xe`, `Za`, `rc`, `St`, `L`, `Et`, `lc`, `uc`, `us`, `dc`, `is`.

### `dc` — **CONFIRMED**
- Source: [154584, 154907) UTF-16; [166174, 166497) bytes. 
- Initial source: `function dc(n){const t=l=>{const m=n.worn[l];return m?m.q>=6?7:m.q:-1},e=Y.filter(l=>l!=="legs").map(t).sort((l,m)=>m-l),a=e[2]??-1,i=t("head"),h=t("weapon"),o=i>=0&&i===`…
- Internal dependencies: `Y`.

### `ti` — **CONFIRMED**
- Source: [154913, 154930) UTF-16; [166503, 166520) bytes. 
- Initial source: `ti=n=>St[n]?n:"*"`
- Internal dependencies: `St`.

### `Ut` — **CONFIRMED**
- Source: [154931, 154935) UTF-16; [166521, 166525) bytes. 
- Initial source: `Ut=5`
- Internal dependencies: none statically named in module.

### `$n` — **CONFIRMED**
- Source: [154936, 154940) UTF-16; [166526, 166530) bytes. 
- Initial source: `$n=5`
- Internal dependencies: none statically named in module.

### `Je` — **CONFIRMED**
- Source: [154941, 154945) UTF-16; [166531, 166535) bytes. 
- Initial source: `Je=3`
- Internal dependencies: none statically named in module.

### `ei` — **CONFIRMED**
- Source: [154946, 154960) UTF-16; [166536, 166550) bytes. 
- Array of static or computed entries.
- Initial source: `ei=[1,2,3,5,8]`
- Internal dependencies: none statically named in module.

### `pc` — **CONFIRMED**
- Source: [154961, 155038) UTF-16; [166551, 166628) bytes. 
- Initial source: `pc=(n,t)=>({souls:ei[tn(n,0,$n-1)],silver:Math.round(2e4*(n+1)*(1+.3*L(t)))})`
- Internal dependencies: `ei`, `tn`, `$n`, `L`.

### `ft` — **CONFIRMED**
- Source: [155039, 155112) UTF-16; [166629, 166702) bytes. 
- Object/configuration registry.
- Initial source: `ft={raw:[15,22,30,40,55],cd:[8,7.5,7,6.5,6],extra:[0,0,0,0,2],radius:2.5}`
- Internal dependencies: none statically named in module.

### `fc` — **CONFIRMED**
- Source: [155113, 155264) UTF-16; [166703, 166854) bytes. 
- Object/configuration registry.
- Initial source: `fc={"kiem-tien":.94,"co-su":1.77,"ma-tong":.85,"the-tu":.64,"ky-mon":.83,"am-tong":.79,"ngu-thu-su":1.08,"phu-su":.9,"tran-phap-su":.71,"anh-sat":1.07}`
- Internal dependencies: none statically named in module.

### `yc` — **CONFIRMED**
- Source: [155265, 155294) UTF-16; [166855, 166884) bytes. 
- Array of static or computed entries.
- Initial source: `yc=[.014,.022,.031,.043,.065]`
- Internal dependencies: none statically named in module.

### `Nt` — **CONFIRMED**
- Source: [155295, 155960) UTF-16; [166885, 167702) bytes. 
- Object/configuration registry.
- Initial source: `Nt={"kiem-tien":{name:"Kiếm Hồn Thức Tỉnh",fx:"một đạo kiếm quang"},"co-su":{name:"Cổ Thần Thức Tỉnh",fx:"một đàn cổ trùng"},"ma-tong":{name:"Huyết Hồn Thức Tỉnh",fx:"một`…
- Internal dependencies: none statically named in module.

### `kc` — **CONFIRMED**
- Source: [155961, 155988) UTF-16; [167703, 167730) bytes. 
- Initial source: `kc=n=>(Nt[n]??Nt["*"]).name`
- Internal dependencies: `Nt`.

### `Ou` — **CONFIRMED**
- Source: [155989, 156223) UTF-16; [167731, 167980) bytes. 
- Initial source: `Ou=(n,t)=>{const e=tn(t,1,$n)-1;return\`Chiêu trúng đích phóng ${(Nt[n]??Nt["*"]).fx} (${Math.round(ft.raw[e]*(fc[n]??1))} sức chiêu)${ft.extra[e]?\`, lan thêm ${ft.extra[e`…
- Internal dependencies: `tn`, `$n`, `Nt`, `ft`, `fc`.

### `bc` — **CONFIRMED**
- Source: [156224, 156239) UTF-16; [167981, 167996) bytes. 
- Initial source: `bc=n=>tn(n,0,6)`
- Internal dependencies: `tn`.

### `Tc` — **CONFIRMED**
- Source: [156240, 156334) UTF-16; [167997, 168091) bytes. 
- Initial source: `Tc=(n,t)=>({essence:Math.ceil(20*(n+1)*(1+.2*L(t))),silver:Math.round(5e3*(n+1)*(1+.3*L(t)))})`
- Internal dependencies: `L`.

### `ce` — **CONFIRMED**
- Source: [156335, 156499) UTF-16; [168092, 168256) bytes. 
- Initial source: `ce=n=>({essence:Math.round(gs[tn(n.q,0,6)]*(1+.2*L(n.g))),stones:ds[tn(n.q,0,6)],souls:(n.q>=6?1:0)+Math.floor(ei.slice(0,tn(n.w??0,0,$n)).reduce((t,e)=>t+e,0)/2)})`
- Internal dependencies: `gs`, `tn`, `L`, `ds`, `ei`, `$n`.

### `ai` — **CONFIRMED**
- Source: [156500, 156522) UTF-16; [168257, 168279) bytes. 
- Initial source: `ai=n=>n>=5?1:n>=3?.3:0`
- Internal dependencies: none statically named in module.

### `ju` — **CONFIRMED**
- Source: [156523, 156686) UTF-16; [168280, 168443) bytes. 
- Initial source: `function ju(n){return Math.round(n.attack*n.damageScale*(1+Math.min(1,Math.max(0,n.crit))*Math.max(0,n.critDmg-1))*10+n.maxHp/Math.max(.1,n.defenseMultiplier)*.2)}`
- Internal dependencies: none statically named in module.

### `vc` — **CONFIRMED**
- Source: [156692, 156739) UTF-16; [168449, 168510) bytes. 
- Array of static or computed entries.
- Initial source: `vc=["Sơ kỳ","Trung kỳ","Hậu kỳ","Đại viên mãn"]`
- Internal dependencies: none statically named in module.

### `oe` — **CONFIRMED**
- Source: [156740, 156745) UTF-16; [168511, 168516) bytes. 
- Initial source: `oe=10`
- Internal dependencies: none statically named in module.

### `xc` — **CONFIRMED**
- Source: [156746, 156779) UTF-16; [168517, 168550) bytes. 
- Initial source: `xc=n=>vc[n>=10?3:n>=7?2:n>=4?1:0]`
- Internal dependencies: `vc`.

### `ii` — **CONFIRMED**
- Source: [156780, 156845) UTF-16; [168551, 168616) bytes. 
- Initial source: `ii=n=>Math.max(1,Math.min(sn,Number.isFinite(n)?Math.floor(n):1))`
- Internal dependencies: `sn`.

### `Pc` — **CONFIRMED**
- Source: [156846, 156891) UTF-16; [168617, 168662) bytes. 
- Initial source: `function Pc(n){return[F[n],(F[n+1]??sn+1)-1]}`
- Internal dependencies: `F`, `sn`.

### `hi` — **CONFIRMED**
- Source: [156891, 156987) UTF-16; [168662, 168758) bytes. 
- Initial source: `function hi(n,t){const[e,a]=Pc(n),i=a-e+1;return[e+Math.ceil((t-1)*i/oe),e+Math.ceil(t*i/oe)-1]}`
- Internal dependencies: `Pc`, `oe`.

### `nt` — **CONFIRMED**
- Source: [156987, 157208) UTF-16; [168758, 168982) bytes. 
- Initial source: `function nt(n){const t=ii(n),e=Math.max(0,F.filter(o=>t>=o).length-1);let a=1;for(;a<oe&&hi(e,a)[1]<t;)a++;const i=An[e],h=xc(a);return{realmIndex:e,realm:i,tier:a,stage:`…
- Internal dependencies: `ii`, `F`, `oe`, `hi`, `An`, `xc`.

### `Wu` — **CONFIRMED**
- Source: [157208, 157469) UTF-16; [168982, 169243) bytes. 
- Initial source: `function Wu(n,t){const e=ii(n),a=nt(e),[i,h]=hi(a.realmIndex,a.tier);if(e>=sn)return{have:1,need:1,frac:1};let o=0,c=0;for(let r=i;r<=h&&r<sn;r++){const u=wt(r);o+=u,r<e&`…
- Internal dependencies: `ii`, `nt`, `hi`, `sn`, `wt`.

### `Pe` — **CONFIRMED**
- Source: [157475, 157492) UTF-16; [169249, 169266) bytes. 
- Initial source: `Pe=n=>nt(n).short`
- Internal dependencies: `nt`.

### `Xu` — **CONFIRMED**
- Source: [157493, 157548) UTF-16; [169267, 169324) bytes. 
- Initial source: `Xu=n=>{const t=nt(n);return\`${t.realm} tầng ${t.tier}\`}`
- Internal dependencies: `nt`.

### `wc` — **CONFIRMED**
- Source: [157549, 157760) UTF-16; [169325, 169542) bytes. 
- Initial source: `function wc(n,t){const e=nt(n),a=nt(t),i=e.tier===1&&a.tier===10;return e.realm!==a.realm?i?\`${e.realm} – ${a.realm}\`:\`${e.short} – ${a.short}\`:i?e.realm:e.tier===a.tier?`…
- Internal dependencies: `nt`.

### `Yu` — **CONFIRMED**
- Source: [157760, 157948) UTF-16; [169542, 169745) bytes. 
- Initial source: `function Yu(n){return n.replace(/(?:[Cc]ấp\s*)?(\d{1,3})\s*[–-]\s*(\d{1,3})(?!\s*(?:%|giây|phút|người|ô))/g,(t,e,a)=>wc(+e,+a)).replace(/[Cc]ấp\s*(\d{1,3})\+/g,(t,e)=>\`${`…
- Internal dependencies: `wc`, `Pe`.

### `un` — **CONFIRMED**
- Source: [157948, 158027) UTF-16; [169745, 169824) bytes. 
- Initial source: `function un(n){const t=Math.floor(n),e=n-t;return e>.5?t+1:e<.5||t%2===0?t:t+1}`
- Internal dependencies: none statically named in module.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.