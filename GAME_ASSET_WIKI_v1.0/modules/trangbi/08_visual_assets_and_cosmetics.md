# Hiển thị trang bị, ngoại hình và dữ liệu asset

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Đường dẫn ảnh, màu, tên, dữ liệu phục trang và cấu hình vũ khí.
- Character offset vùng: [158027, 193553) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `w` | variable | 158033–158046 |  |  |
| `R` | function_expression | 158047–158083 |  |  |
| `yn` | function_expression | 158084–158113 |  | `R` |
| `tt` | function_expression | 158114–158201 |  |  |
| `Hc` | variable | 158202–158475 | bU |  |
| `Ju` | variable | 158476–158518 | bB |  |
| `si` | variable | 158519–158544 |  |  |
| `ci` | variable | 158545–158584 |  |  |
| `Dn` | variable | 158585–158590 |  |  |
| `Mc` | variable | 158591–158595 |  |  |
| `Kc` | variable | 158596–158602 |  |  |
| `Cc` | variable | 158603–158609 |  |  |
| `Bc` | variable | 158610–158615 |  |  |
| `oi` | variable | 158616–158620 |  |  |
| `ri` | variable | 158621–158625 |  |  |
| `ui` | variable | 158626–158799 |  |  |
| `Lc` | variable | 158800–158889 |  |  |
| `Sc` | variable | 158890–159011 |  |  |
| `we` | variable | 159012–159044 | e$ |  |
| `bt` | variable | 159045–159134 |  |  |
| `Tt` | variable | 159135–159238 |  |  |
| `li` | variable | 159239–159268 |  |  |
| `He` | variable | 159269–159305 |  |  |
| `Me` | variable | 159306–159336 |  |  |
| `_t` | variable | 159337–159371 |  |  |
| `vt` | variable | 159372–159415 |  |  |
| `mi` | variable | 159416–159444 |  |  |
| `Ke` | variable | 159445–159568 |  |  |
| `en` | function_expression | 159569–159668 |  |  |
| `Nc` | variable | 159669–160153 |  | `en` |
| `$c` | variable | 160154–160166 |  | `en` |
| `$t` | function | 160167–160437 |  | `w` |
| `Dc` | function | 160437–160938 | bV | `un` |
| `gi` | variable | 160944–161503 |  |  |
| `Ce` | variable | 161504–161860 |  |  |
| `di` | variable | 161861–162035 |  |  |
| `Ic` | variable | 162036–162121 |  |  |
| `Gc` | variable | 162122–162174 |  |  |
| `qc` | function_expression | 162175–162210 | eG |  |
| `Vc` | variable | 162211–162706 |  | `qc`, `tt`, `$t` |
| `mt` | function_expression | 162707–162722 | B | `yn` |
| `pi` | function_expression | 162723–162763 | D | `tt`, `yn` |
| `Rc` | variable | 162764–162841 |  |  |
| `Qc` | variable | 162842–162983 |  |  |
| `Fc` | variable | 162984–163309 |  |  |
| `re` | function_expression | 163310–163349 |  |  |
| `fi` | function | 163350–163610 |  | `yn`, `re`, `$i` |
| `ze` | variable | 163616–164486 | bH |  |
| `Dt` | function_expression | 164487–164515 |  |  |
| `ue` | function | 164516–164620 |  | `R`, `w` |
| `Ac` | function | 164620–164697 |  | `Dt`, `ue`, `w`, `un` |
| `yi` | variable | 164703–164773 |  |  |
| `nn` | variable | 164774–164978 |  |  |
| `Ec` | variable | 164979–165107 |  |  |
| `Uc` | variable | 165108–165574 |  |  |
| `_c` | variable | 165575–177537 |  |  |
| `et` | variable | 177538–177547 |  |  |
| `Oc` | function_expression | 177548–177601 | bC | `R` |
| `ki` | function_expression | 177602–177649 |  |  |
| `jc` | function_expression | 177650–177688 |  | `Oc` |
| `Wc` | function | 177689–177814 | bF | `w` |
| `bi` | variable | 177820–178271 |  | `Wc`, `ki`, `jc` |
| `Ti` | variable | 178272–178337 |  |  |
| `vi` | function_expression | 178338–178349 | bE |  |
| `xi` | function | 178350–178594 |  |  |
| `Pi` | function | 178594–178781 |  | `R`, `w`, `un` |
| `Xc` | function_expression | 178787–178809 |  |  |
| `Yc` | function_expression | 178810–178835 | bQ | `R`, `pi` |
| `wi` | variable | 178836–178983 |  |  |
| `Jc` | variable | 178984–178990 |  |  |
| `Ze` | variable | 178991–178997 |  |  |
| `at` | variable | 178998–179033 | cw |  |
| `Mn` | variable | 179034–179748 | cy |  |
| `Hi` | variable | 179749–179811 |  |  |
| `zc` | variable | 179812–179876 |  |  |
| `Mi` | variable | 179877–179889 |  |  |
| `mn` | function_expression | 179890–179922 | cs | `R` |
| `it` | function_expression | 179923–179938 | cp | `mn` |
| `Be` | function_expression | 179939–179954 | cq | `mn` |
| `Ki` | function_expression | 179955–179975 |  | `Be` |
| `Zc` | function_expression | 179976–179991 | ct | `mn` |
| `Le` | function_expression | 179992–180006 | ev | `mn` |
| `Ci` | function_expression | 180007–180028 | co | `vn`, `R` |
| `no` | variable | 180029–180052 | d$ |  |
| `zu` | function | 180053–180282 | cu | `mn`, `it`, `R` |
| `ht` | function_expression | 180288–180335 | c8 |  |
| `to` | variable | 180336–180341 | cH |  |
| `eo` | variable | 180342–180347 |  |  |
| `ao` | variable | 180348–180517 |  |  |
| `io` | function_expression | 180518–180583 | bt |  |
| `xt` | variable | 180584–180617 | eC |  |
| `ho` | function_expression | 180618–180664 |  | `R` |
| `so` | variable | 180665–180671 | cN |  |
| `Zu` | variable | 180672–180678 | cO |  |
| `co` | variable | 180679–180685 | cx |  |
| `nl` | variable | 180686–180690 | cC |  |
| `tl` | variable | 180691–180696 | cD |  |
| `el` | variable | 180697–180703 | cB |  |
| `al` | function_expression | 180704–180773 | dz |  |
| `Se` | variable | 180774–180778 | cE |  |
| `il` | variable | 180779–180783 | cF |  |
| `hl` | function_expression | 180784–180795 | cP |  |
| `sl` | function_expression | 180796–180881 | cz |  |
| `na` | function_expression | 180882–180982 | cA | `R` |
| `oo` | function | 180983–181164 |  |  |
| `Bi` | function | 181164–181310 | cv |  |
| `ro` | variable | 181316–181322 |  |  |
| `uo` | variable | 181323–181328 |  |  |
| `lo` | variable | 181329–181333 |  |  |
| `Qn` | variable | 181334–181444 |  |  |
| `Q` | function_expression | 181445–181606 |  | `tt` |
| `Ne` | variable | 181607–186096 | cl | `Q` |
| `Li` | variable | 186097–186319 |  |  |
| `on` | variable | 186320–186362 | bG |  |
| `Un` | function | 186363–186588 |  |  |
| `st` | function | 186588–186898 | cG | `ht`, `Un` |
| `Si` | function_expression | 186904–186924 |  | `ye` |
| `Ni` | function_expression | 186925–186946 |  | `ye` |
| `$i` | function_expression | 186947–186974 |  | `Si`, `w`, `un` |
| `mo` | function_expression | 186975–186988 |  |  |
| `go` | function_expression | 186989–187047 |  | `yn` |
| `po` | function_expression | 187048–187140 |  | `yn` |
| `fo` | function_expression | 187141–187187 |  |  |
| `yo` | function_expression | 187188–187278 |  | `yn` |
| `ko` | function_expression | 187279–187471 |  | `$t`, `Dc`, `mt` |
| `_n` | variable | 187472–187482 |  |  |
| `gt` | function_expression | 187483–187505 |  |  |
| `Pn` | function_expression | 187506–187661 |  | `gt` |
| `dt` | function_expression | 188236–188442 |  | `Un`, `st`, `gt` |
| `$e` | function_expression | 190621–190641 |  |  |
| `Di` | function | 190680–191477 | d5 | `$e` |
| `cl` | function | 191477–192390 | dQ | `Di`, `xo`, `Bi`, `oo`, `Po`, `ln`, `Ii`, `Ma` |
| `ol` | function | 192390–192613 | f5 | `Kn`, `$e`, `Di` |
| `U` | function_expression | 192619–192633 | bs |  |
| `rl` | function_expression | 192634–192657 | cY |  |
| `Ot` | variable | 192658–192708 |  |  |
| `ul` | function_expression | 192845–193025 | bz | `bo` |
| `ll` | function_expression | 193026–193058 | e1 |  |
| `bo` | function_expression | 193059–193138 | by | `ln`, `ht` |
| `Ii` | function_expression | 193139–193208 | c7 | `ln`, `U` |
| `ml` | function_expression | 193209–193363 | bD | `ln`, `mt` |
| `gl` | function_expression | 193364–193382 | cZ |  |
| `To` | function_expression | 193383–193494 | bR | `ln`, `pi` |
| `dl` | function_expression | 193495–193552 | c3 | `Yc`, `To` |

## Source-grounded implementation notes

### `R` — **CONFIRMED**
- Source: [158047, 158083) UTF-16; [169844, 169880) bytes. 
- Initial source: `R=(n,t,e)=>Math.min(e,Math.max(t,n))`
- Internal dependencies: none statically named in module.

### `yn` — **CONFIRMED**
- Source: [158084, 158113) UTF-16; [169881, 169910) bytes. 
- Initial source: `yn=n=>R(Math.trunc(n),0,Dn-1)`
- Internal dependencies: `R`, `Dn`.

### `tt` — **CONFIRMED**
- Source: [158114, 158201) UTF-16; [169911, 169998) bytes. 
- Initial source: `tt=(n,t,e)=>"#"+[n,t,e].map(a=>Math.round(a*255).toString(16).padStart(2,"0")).join("")`
- Internal dependencies: none statically named in module.

### `Hc` — **CONFIRMED**
- Source: [158202, 158475) UTF-16; [169999, 170293) bytes. 
- Array of static or computed entries.
- Initial source: `Hc=[{id:"head",index:0,name:"Đầu",cell:"Đầu"},{id:"body",index:1,name:"Áo",cell:"Áo"},{id:"legs",index:2,name:"Quần",cell:"Quần"},{id:"feet",index:3,name:"Giày",cell:"Già`…
- Internal dependencies: none statically named in module.

### `Ju` — **CONFIRMED**
- Source: [158476, 158518) UTF-16; [170294, 170336) bytes. 
- Initial source: `Ju=Object.fromEntries(Hc.map(n=>[n.id,n]))`
- Internal dependencies: `Hc`.

### `si` — **CONFIRMED**
- Source: [158519, 158544) UTF-16; [170337, 170362) bytes. 
- Array of static or computed entries.
- Initial source: `si=["head","body","feet"]`
- Internal dependencies: none statically named in module.

### `ci` — **CONFIRMED**
- Source: [158545, 158584) UTF-16; [170363, 170402) bytes. 
- Array of static or computed entries.
- Initial source: `ci=["head","body","legs","feet","back"]`
- Internal dependencies: none statically named in module.

### `ui` — **CONFIRMED**
- Source: [158626, 158799) UTF-16; [170444, 170667) bytes. 
- Array of static or computed entries.
- Initial source: `ui=["Hạ phẩm","Trung phẩm","Thượng phẩm","Cực phẩm","Hậu Thiên Linh Bảo","Hậu Thiên Chí Bảo","Tiên Thiên Linh Bảo","Tiên Thiên Chí Bảo","Hỗn Độn Linh Bảo","Hỗn Độn Chí Bả`…
- Internal dependencies: none statically named in module.

### `Lc` — **CONFIRMED**
- Source: [158800, 158889) UTF-16; [170668, 170769) bytes. 
- Array of static or computed entries.
- Initial source: `Lc=["Hạ","Trung","Thượng","Cực","HT Linh","HT Chí","TT Linh","TT Chí","HĐ Linh","HĐ Chí"]`
- Internal dependencies: none statically named in module.

### `Sc` — **CONFIRMED**
- Source: [158890, 159011) UTF-16; [170770, 170891) bytes. 
- Array of static or computed entries.
- Initial source: `Sc=[[.78,.8,.82],[.4,.9,.5],[.35,.7,1],[.75,.45,1],[1,.84,.3],[1,.58,.2],[1,.32,.28],[1,.35,.65],[.45,.95,1],[1,.95,.85]]`
- Internal dependencies: none statically named in module.

### `we` — **CONFIRMED**
- Source: [159012, 159044) UTF-16; [170892, 170924) bytes. 
- Array of static or computed entries.
- Initial source: `we=[1,5,15,25,27,29,31,33,36,40]`
- Internal dependencies: none statically named in module.

### `bt` — **CONFIRMED**
- Source: [159045, 159134) UTF-16; [170925, 171014) bytes. 
- Array of static or computed entries.
- Initial source: `bt=[[1,2,4,6,9,13,18,24,31,40],[3,6,11,17,25,35,48,64,84,110],[1,2,3,5,7,10,14,19,25,32]]`
- Internal dependencies: none statically named in module.

### `Tt` — **CONFIRMED**
- Source: [159135, 159238) UTF-16; [171015, 171118) bytes. 
- Array of static or computed entries.
- Initial source: `Tt=[[4,8,14,22,33,48,68,94,128,170],[8,18,32,50,75,110,155,215,290,390],[3,6,10,16,24,35,50,70,95,128]]`
- Internal dependencies: none statically named in module.

### `li` — **CONFIRMED**
- Source: [159239, 159268) UTF-16; [171119, 171148) bytes. 
- Array of static or computed entries.
- Initial source: `li=[1,2,4,6,8,10,13,16,20,25]`
- Internal dependencies: none statically named in module.

### `He` — **CONFIRMED**
- Source: [159269, 159305) UTF-16; [171149, 171185) bytes. 
- Array of static or computed entries.
- Initial source: `He=[6,12,20,30,45,65,90,125,170,230]`
- Internal dependencies: none statically named in module.

### `Me` — **CONFIRMED**
- Source: [159306, 159336) UTF-16; [171186, 171216) bytes. 
- Array of static or computed entries.
- Initial source: `Me=[2,4,6,8,11,15,20,26,33,42]`
- Internal dependencies: none statically named in module.

### `_t` — **CONFIRMED**
- Source: [159337, 159371) UTF-16; [171217, 171251) bytes. 
- Array of static or computed entries.
- Initial source: `_t=[25,30,35,40,46,53,61,70,80,92]`
- Internal dependencies: none statically named in module.

### `vt` — **CONFIRMED**
- Source: [159372, 159415) UTF-16; [171252, 171295) bytes. 
- Array of static or computed entries.
- Initial source: `vt=[8,24,80,240,600,1500,4e3,12e3,4e4,12e4]`
- Internal dependencies: none statically named in module.

### `mi` — **CONFIRMED**
- Source: [159416, 159444) UTF-16; [171296, 171324) bytes. 
- Array of static or computed entries.
- Initial source: `mi=[1,1,1.5,2,3,4,6,8,11,15]`
- Internal dependencies: none statically named in module.

### `Ke` — **CONFIRMED**
- Source: [159445, 159568) UTF-16; [171325, 171474) bytes. 
- Array of static or computed entries.
- Initial source: `Ke=["Thô Bố","Thanh Trúc","Huyền Tơ","Hải Long","Linh Hư","Huyền Hoàng","Thái Ất","Thái Cực","Hồng Mông","Nghịch Thiên Ký"]`
- Internal dependencies: none statically named in module.

### `en` — **CONFIRMED**
- Source: [159569, 159668) UTF-16; [171475, 171574) bytes. 
- Initial source: `en=(n,t)=>({name:n,damage:0,reduce:0,lifesteal:0,thorns:0,execute:0,lowHealthReduce:0,move:0,...t})`
- Internal dependencies: none statically named in module.

### `Nc` — **CONFIRMED**
- Source: [159669, 160153) UTF-16; [171575, 172098) bytes. 
- Array of static or computed entries.
- Initial source: `Nc=[en("Da Thô",{reduce:.03}),en("Trúc Ảnh",{move:.05}),en("Huyền Ti Hấp Huyết",{lifesteal:.02}),en("Long Lân Phản Kích",{thorns:.1}),en("Linh Áp",{damage:.08}),en("Kim Q`…
- Internal dependencies: `en`.

### `$t` — **CONFIRMED**
- Source: [160167, 160437) UTF-16; [172112, 172382) bytes. 
- Initial source: `function $t(n,t){if(n<0||n>=Dn)return $c;const e=Nc[n];if(!t)return e;const a=i=>w(w(i)*w(Kc));return{name:e.name,damage:a(e.damage),reduce:a(e.reduce),lifesteal:a(e.life`…
- Internal dependencies: `Dn`, `$c`, `Nc`, `w`, `Kc`.

### `Dc` — **CONFIRMED**
- Source: [160437, 160938) UTF-16; [172382, 172926) bytes. 
- Initial source: `function Dc(n){const t=a=>un(a*100)+"%",e=[];return n.damage>0&&e.push(\`+${t(n.damage)} sát thương\`),n.execute>0&&e.push(\`+${t(n.execute)} sát thương lên mục tiêu dưới ${`…
- Internal dependencies: `un`, `Cc`, `Bc`.

### `gi` — **CONFIRMED**
- Source: [160944, 161503) UTF-16; [172932, 173602) bytes. 
- Array of static or computed entries.
- Initial source: `gi=[["Thô Bố Cân","Thô Bố Y","Thảo Hài"],["Thanh Trúc Cân","Thanh Trúc Bào","Thanh Trúc Hài"],["Huyền Tơ Cân","Huyền Tơ Bào","Huyền Tơ Ngoa"],["Hải Long Cân","Hải Long Bà`…
- Internal dependencies: none statically named in module.

### `Ce` — **CONFIRMED**
- Source: [161504, 161860) UTF-16; [173603, 174037) bytes. 
- Array of static or computed entries.
- Initial source: `Ce=[["Mộc nâu","Đỏ gạch","Lam chàm"],["Ngọc lục","Lam hồ","Đào phấn"],["Tử mặc","Xích huyết","Băng lam"],["Hải kim","Bạch kim","Huyền hỏa"],["Ngân bạch","Thiên thanh","Tử`…
- Internal dependencies: none statically named in module.

### `di` — **CONFIRMED**
- Source: [161861, 162035) UTF-16; [174038, 174257) bytes. 
- Array of static or computed entries.
- Initial source: `di=[null,null,"Huyền Thiết Kiếm","Hải Long Kiếm","Linh Hư Kiếm","Huyền Hoàng Kiếm","Thái Ất Tiên Kiếm","Thái Cực Tiên Kiếm","Hồng Mông Thần Kiếm","Nghịch Thiên Ký Thần Ki`…
- Internal dependencies: none statically named in module.

### `Ic` — **CONFIRMED**
- Source: [162036, 162121) UTF-16; [174258, 174343) bytes. 
- Array of static or computed entries.
- Initial source: `Ic=[[.92,.94,1],[.35,1,.45],[.3,.62,1],[.74,.4,1],[1,.58,.16],[1,.24,.2],[1,.84,.28]]`
- Internal dependencies: none statically named in module.

### `Gc` — **CONFIRMED**
- Source: [162122, 162174) UTF-16; [174344, 174405) bytes. 
- Array of static or computed entries.
- Initial source: `Gc=["trắng","lục","lam","tím","cam","đỏ","vàng kim"]`
- Internal dependencies: none statically named in module.

### `qc` — **CONFIRMED**
- Source: [162175, 162210) UTF-16; [174406, 174441) bytes. 
- Initial source: `qc=n=>n<0?-1:n<=3?n:n<=5?4:n<=7?5:6`
- Internal dependencies: none statically named in module.

### `mt` — **CONFIRMED**
- Source: [162707, 162722) UTF-16; [174938, 174953) bytes. 
- Initial source: `mt=n=>ui[yn(n)]`
- Internal dependencies: `ui`, `yn`.

### `pi` — **CONFIRMED**
- Source: [162723, 162763) UTF-16; [174954, 174994) bytes. 
- Initial source: `pi=n=>n<0?tt(.78,.8,.82):Vc[yn(n)].color`
- Internal dependencies: `tt`, `Vc`, `yn`.

### `Rc` — **CONFIRMED**
- Source: [162764, 162841) UTF-16; [174995, 175072) bytes. 
- Array of static or computed entries.
- Initial source: `Rc=["goblin","beast","spider","other","mother","miniboss","serpent","kraken"]`
- Internal dependencies: none statically named in module.

### `Qc` — **CONFIRMED**
- Source: [162842, 162983) UTF-16; [175073, 175252) bytes. 
- Array of static or computed entries.
- Initial source: `Qc=["Cấp 1–6","Cấp 7–11","Cấp 12–17","Cấp 18–21","Cấp 22–39","Cấp 40–79","Cấp 80–139","Cấp 140–219","Cấp 220–300","Tinh anh / boss cấp 220+"]`
- Internal dependencies: none statically named in module.

### `Fc` — **CONFIRMED**
- Source: [162984, 163309) UTF-16; [175253, 175578) bytes. 
- Array of static or computed entries.
- Initial source: `Fc=[[8800,1200,0,0,0,0,0,0,0,0],[5e3,4200,800,0,0,0,0,0,0,0],[1500,5e3,3e3,500,0,0,0,0,0,0],[0,3e3,5e3,1800,200,0,0,0,0,0],[0,1500,5e3,3e3,450,50,0,0,0,0],[0,0,3200,4600,`…
- Internal dependencies: none statically named in module.

### `re` — **CONFIRMED**
- Source: [163310, 163349) UTF-16; [175579, 175618) bytes. 
- Initial source: `re=()=>({hp:0,armor:0,attack:0,move:0})`
- Internal dependencies: none statically named in module.

### `fi` — **CONFIRMED**
- Source: [163350, 163610) UTF-16; [175619, 175879) bytes. 
- Initial source: `function fi(n,t,e=0){const a=yn(t),i=re();if(n==="weapon")return i.weaponDamage=_t[a],i.weaponAtk=$i(i.weaponDamage,e),i;const h=n==="head"?0:n==="body"?1:n==="feet"?2:-1`…
- Internal dependencies: `yn`, `re`, `_t`, `$i`, `bt`, `Tt`, `li`.

### `ze` — **CONFIRMED**
- Source: [163616, 164486) UTF-16; [175885, 176795) bytes. 
- Object/configuration registry.
- Initial source: `ze={"the-tu":Sa,untrained:{name:"Chưa nhập đạo",hp:130,hpPerLevel:3.9,armor:0,atk:1,move:1},"ky-mon":{name:"Dược Vương Cốc",hp:150,hpPerLevel:3.9,armor:4,atk:.97,move:1},`…
- Internal dependencies: `Sa`.

### `Dt` — **CONFIRMED**
- Source: [164487, 164515) UTF-16; [176796, 176824) bytes. 
- Initial source: `Dt=n=>ze[n]??ze["kiem-tien"]`
- Internal dependencies: `ze`.

### `ue` — **CONFIRMED**
- Source: [164516, 164620) UTF-16; [176825, 176929) bytes. 
- Initial source: `function ue(n){const t=R(Math.trunc(n),1,999);return t<=99?t:w(99+w(25*w(Math.log(w(1+w((t-99)/25))))))}`
- Internal dependencies: `R`, `w`.

### `Ac` — **CONFIRMED**
- Source: [164620, 164697) UTF-16; [176929, 177006) bytes. 
- Initial source: `function Ac(n,t){const e=Dt(n);return e.hp+un(w(w(ue(t)-1)*w(e.hpPerLevel)))}`
- Internal dependencies: `Dt`, `un`, `w`, `ue`.

### `yi` — **CONFIRMED**
- Source: [164703, 164773) UTF-16; [177012, 177088) bytes. 
- Object/configuration registry.
- Initial source: `yi={head:"Quan",body:"Bào",legs:"Hộ Thối",feet:"Hài",back:"Phi Phong"}`
- Internal dependencies: none statically named in module.

### `nn` — **CONFIRMED**
- Source: [164774, 164978) UTF-16; [177089, 177302) bytes. 
- Array of static or computed entries.
- Initial source: `nn=[{id:"linh",name:"Linh phẩm",level:30,statScale:1,bonusScale:1},{id:"huyen",name:"Huyền phẩm",level:60,statScale:2.1,bonusScale:1.25},{id:"tien",name:"Tiên phẩm",level`…
- Internal dependencies: none statically named in module.

### `Ec` — **CONFIRMED**
- Source: [164979, 165107) UTF-16; [177303, 177431) bytes. 
- Object/configuration registry.
- Initial source: `Ec={head:{armor:18,hp:70,atk:12},body:{armor:48,hp:160},legs:{armor:30,hp:100},feet:{armor:14,hp:50,move:6},back:{hp:80,atk:10}}`
- Internal dependencies: none statically named in module.

### `Uc` — **CONFIRMED**
- Source: [165108, 165574) UTF-16; [177432, 177962) bytes. 
- Object/configuration registry.
- Initial source: `Uc={atkPct:"+{v}% sát thương",hpPct:"+{v}% HP tối đa",armor:"+{v} giáp",movePct:"+{v}% tốc chạy",critPct:"+{v}% tỉ lệ chí mạng",critDmgPct:"+{v}% sát thương chí mạng",cdr`…
- Internal dependencies: none statically named in module.

### `_c` — **CONFIRMED**
- Source: [165575, 177537) UTF-16; [177963, 191343) bytes. 
- Array of static or computed entries.
- Initial source: `_c=[{id:"ky-mon",name:"Dược Vương Cốc",sets:[{id:"bach-thao",name:"Bách Thảo Kinh",short:"Bách Thảo",role:"Hồi phục",magicElement:"moc",two:["healPct",15],three:{key:"hea`…
- Internal dependencies: none statically named in module.

### `Oc` — **CONFIRMED**
- Source: [177548, 177601) UTF-16; [191354, 191409) bytes. 
- Initial source: `Oc=n=>nn[R(n,0,nn.length-1)].name.replace(" phẩm","")`
- Internal dependencies: `nn`, `R`.

### `ki` — **CONFIRMED**
- Source: [177602, 177649) UTF-16; [191410, 191457) bytes. 
- Initial source: `ki=(n,t,e,a)=>\`${et}${n}~${t}~${e}~${nn[a].id}\``
- Internal dependencies: `et`, `nn`.

### `jc` — **CONFIRMED**
- Source: [177650, 177688) UTF-16; [191458, 191497) bytes. 
- Initial source: `jc=(n,t,e)=>\`${n} ${yi[t]} · ${Oc(e)}\``
- Internal dependencies: `yi`, `Oc`.

### `Wc` — **CONFIRMED**
- Source: [177689, 177814) UTF-16; [191498, 191623) bytes. 
- Initial source: `function Wc(n,t,e=1){const a=w(t*w(e)),i=a%1===0?String(a):String(Math.round(a*10)/10),h=Uc[n];return h?h.replace("{v}",i):n}`
- Internal dependencies: `w`, `Uc`.

### `vi` — **CONFIRMED**
- Source: [178338, 178349) UTF-16; [192147, 192158) bytes. 
- Initial source: `vi=n=>Ti[n]`
- Internal dependencies: `Ti`.

### `xi` — **CONFIRMED**
- Source: [178350, 178594) UTF-16; [192159, 192403) bytes. 
- Initial source: `function xi(n){if(!n.startsWith(et))return null;const t=n.slice(et.length).split("~");if(t.length!==4)return null;const e=Ti[\`${t[0]}/${t[1]}\`],a=t[2],i=nn.findIndex(h=>h`…
- Internal dependencies: `et`, `Ti`, `nn`, `ci`.

### `Pi` — **CONFIRMED**
- Source: [178594, 178781) UTF-16; [192403, 192590) bytes. 
- Initial source: `function Pi(n,t){const e=Ec[n]??{},a=w(nn[R(t,0,nn.length-1)].statScale),i=h=>h?un(w(h*a)):0;return{armor:i(e.armor),hp:i(e.hp),attack:i(e.atk),move:e.move?un(w(e.move*w(`…
- Internal dependencies: `Ec`, `w`, `nn`, `R`, `un`.

### `Xc` — **CONFIRMED**
- Source: [178787, 178809) UTF-16; [192596, 192618) bytes. 
- Initial source: `Xc=n=>n<=0?6:n===1?8:9`
- Internal dependencies: none statically named in module.

### `Yc` — **CONFIRMED**
- Source: [178810, 178835) UTF-16; [192619, 192644) bytes. 
- Initial source: `Yc=n=>pi(R(n*3+3,0,Dn-1))`
- Internal dependencies: `pi`, `R`, `Dn`.

### `wi` — **CONFIRMED**
- Source: [178836, 178983) UTF-16; [192645, 192798) bytes. 
- Object/configuration registry.
- Initial source: `wi={fire:{name:"Hỏa",material:"Hỏa tinh",element:"hoa",look:"sword-fire"},metal:{name:"Kim",material:"Kim thạch",element:"kim",look:"sword-metal"}}`
- Internal dependencies: none statically named in module.

### `at` — **CONFIRMED**
- Source: [178998, 179033) UTF-16; [192813, 192848) bytes. 
- Array of static or computed entries.
- Initial source: `at=["kim","moc","thuy","tho","hoa"]`
- Internal dependencies: none statically named in module.

### `Mn` — **CONFIRMED**
- Source: [179034, 179748) UTF-16; [192849, 193628) bytes. 
- Object/configuration registry.
- Initial source: `Mn={kim:{name:"Kim",material:"Kim thạch",herb:"Kim linh thảo",color:"#f4db9a",aliases:[],stat:"atkPct",value:.03,text:"+3% sát thương"},moc:{name:"Mộc",material:"Mộc ngọc`…
- Internal dependencies: none statically named in module.

### `Hi` — **CONFIRMED**
- Source: [179749, 179811) UTF-16; [193629, 193691) bytes. 
- Array of static or computed entries.
- Initial source: `Hi=[1,1.3,2.3,2.6,2.9,3.05,3.15,3.25,3.35,3.45,3.55,3.65,3.75]`
- Internal dependencies: none statically named in module.

### `zc` — **CONFIRMED**
- Source: [179812, 179876) UTF-16; [193692, 193756) bytes. 
- Array of static or computed entries.
- Initial source: `zc=[1,1.1,1.27,1.43,1.64,1.76,1.84,1.92,1.98,2.02,2.05,2.1,2.15]`
- Internal dependencies: none statically named in module.

### `mn` — **CONFIRMED**
- Source: [179890, 179922) UTF-16; [193770, 193802) bytes. 
- Initial source: `mn=n=>R(Math.trunc(n??0),0,Mi-1)`
- Internal dependencies: `R`, `Mi`.

### `it` — **CONFIRMED**
- Source: [179923, 179938) UTF-16; [193803, 193818) bytes. 
- Initial source: `it=n=>Hi[mn(n)]`
- Internal dependencies: `Hi`, `mn`.

### `Be` — **CONFIRMED**
- Source: [179939, 179954) UTF-16; [193819, 193834) bytes. 
- Initial source: `Be=n=>zc[mn(n)]`
- Internal dependencies: `zc`, `mn`.

### `Ki` — **CONFIRMED**
- Source: [179955, 179975) UTF-16; [193835, 193855) bytes. 
- Initial source: `Ki=n=>1+(Be(n)-1)*.5`
- Internal dependencies: `Be`.

### `Zc` — **CONFIRMED**
- Source: [179976, 179991) UTF-16; [193856, 193871) bytes. 
- Initial source: `Zc=n=>An[mn(n)]`
- Internal dependencies: `An`, `mn`.

### `Le` — **CONFIRMED**
- Source: [179992, 180006) UTF-16; [193872, 193886) bytes. 
- Initial source: `Le=n=>F[mn(n)]`
- Internal dependencies: `F`, `mn`.

### `Ci` — **CONFIRMED**
- Source: [180007, 180028) UTF-16; [193887, 193908) bytes. 
- Initial source: `Ci=n=>R(vn(n),0,Mi-1)`
- Internal dependencies: `R`, `vn`, `Mi`.

### `no` — **CONFIRMED**
- Source: [180029, 180052) UTF-16; [193909, 193936) bytes. 
- Initial source: `no="Cảnh giới tinh hoa"`
- Internal dependencies: none statically named in module.

### `zu` — **CONFIRMED**
- Source: [180053, 180282) UTF-16; [193937, 194173) bytes. 
- Initial source: `function zu(n,t){let e=0,a=0,i=0,h=0;for(let o=mn(n)+1;o<=mn(t);o++)e+=Math.round(800*o*o*R((it(o)/it(o-1)-1)/.1,.35,1)),a+=2*o,i+=o,h+=Math.max(0,o-2);return e?[["Thỏi s`…
- Internal dependencies: `mn`, `R`, `it`, `no`.

### `ht` — **CONFIRMED**
- Source: [180288, 180335) UTF-16; [194179, 194226) bytes. 
- Initial source: `ht=n=>{var t;return!!((t=V[n])!=null&&t.wheel)}`
- Internal dependencies: `V`.

### `to` — **CONFIRMED**
- Source: [180336, 180341) UTF-16; [194227, 194232) bytes. 
- Initial source: `to=.1`
- Internal dependencies: none statically named in module.

### `io` — **CONFIRMED**
- Source: [180518, 180583) UTF-16; [194409, 194474) bytes. 
- Initial source: `io=(n,t)=>t.slot!=="weapon"||n==="the-tu"==(t.classId==="the-tu")`
- Internal dependencies: none statically named in module.

### `xt` — **CONFIRMED**
- Source: [180584, 180617) UTF-16; [194475, 194508) bytes. 
- Object/configuration registry.
- Initial source: `xt={low:1.95,high:1.95,armor:.17}`
- Internal dependencies: none statically named in module.

### `ho` — **CONFIRMED**
- Source: [180618, 180664) UTF-16; [194509, 194555) bytes. 
- Initial source: `ho=n=>xt.low+(xt.high-xt.low)*R((n-60)/40,0,1)`
- Internal dependencies: `xt`, `R`.

### `so` — **CONFIRMED**
- Source: [180665, 180671) UTF-16; [194556, 194562) bytes. 
- Initial source: `so=.06`
- Internal dependencies: none statically named in module.

### `Zu` — **CONFIRMED**
- Source: [180672, 180678) UTF-16; [194563, 194569) bytes. 
- Initial source: `Zu=.03`
- Internal dependencies: none statically named in module.

### `co` — **CONFIRMED**
- Source: [180679, 180685) UTF-16; [194570, 194576) bytes. 
- Initial source: `co=.05`
- Internal dependencies: none statically named in module.

### `nl` — **CONFIRMED**
- Source: [180686, 180690) UTF-16; [194577, 194581) bytes. 
- Initial source: `nl=5`
- Internal dependencies: none statically named in module.

### `tl` — **CONFIRMED**
- Source: [180691, 180696) UTF-16; [194582, 194587) bytes. 
- Initial source: `tl=50`
- Internal dependencies: none statically named in module.

### `el` — **CONFIRMED**
- Source: [180697, 180703) UTF-16; [194588, 194594) bytes. 
- Initial source: `el=200`
- Internal dependencies: none statically named in module.

### `al` — **CONFIRMED**
- Source: [180704, 180773) UTF-16; [194595, 194664) bytes. 
- Initial source: `al=n=>n?at.includes(n)?n:at.find(t=>Mn[t].aliases.includes(n)):void 0`
- Internal dependencies: `at`, `Mn`.

### `Se` — **CONFIRMED**
- Source: [180774, 180778) UTF-16; [194665, 194669) bytes. 
- Initial source: `Se=5`
- Internal dependencies: none statically named in module.

### `il` — **CONFIRMED**
- Source: [180779, 180783) UTF-16; [194670, 194674) bytes. 
- Initial source: `il=3`
- Internal dependencies: none statically named in module.

### `hl` — **CONFIRMED**
- Source: [180784, 180795) UTF-16; [194675, 194686) bytes. 
- Initial source: `hl=n=>200*n`
- Internal dependencies: none statically named in module.

### `sl` — **CONFIRMED**
- Source: [180796, 180881) UTF-16; [194687, 194774) bytes. 
- Initial source: `sl=(n,t=1)=>t>=2?\`${Mn[n].material} cấp ${Math.min(Se,Math.floor(t))}\`:Mn[n].material`
- Internal dependencies: `Mn`, `Se`.

### `na` — **CONFIRMED**
- Source: [180882, 180982) UTF-16; [194775, 194875) bytes. 
- Initial source: `na=(n,t)=>{var e;return R(Math.floor(Number((e=n==null?void 0:n.gemLv)==null?void 0:e[t])||1),1,Se)}`
- Internal dependencies: `R`, `Se`.

### `oo` — **CONFIRMED**
- Source: [180983, 181164) UTF-16; [194876, 195057) bytes. 
- Initial source: `function oo(n,t){if(!n||typeof n!="object")return;const e={};for(const a of t){const i=Math.floor(Number(n[a])||1);i>=2&&(e[a]=Math.min(Se,i))}return Object.keys(e).lengt`…
- Internal dependencies: `Se`.

### `Bi` — **CONFIRMED**
- Source: [181164, 181310) UTF-16; [195057, 195203) bytes. 
- Initial source: `function Bi(n){const t=new Set((n.gems??[]).filter(e=>at.includes(e)));return n.inlay&&t.add(n.inlay==="fire"?"hoa":"kim"),at.filter(e=>t.has(e))}`
- Internal dependencies: `at`.

### `Qn` — **CONFIRMED**
- Source: [181334, 181444) UTF-16; [195227, 195337) bytes. 
- Object/configuration registry.
- Initial source: `Qn={sword:"do-than-sword",fan:"u-minh-fan",scythe:"u-xa-scythe",banner:"van-hon-phien",brush:"immortal-brush"}`
- Internal dependencies: none statically named in module.

### `Q` — **CONFIRMED**
- Source: [181445, 181606) UTF-16; [195338, 195499) bytes. 
- Initial source: `Q=(n,t,e,a,i,h,o,c,r,u={},l)=>({id:n,name:t,classId:e,subtitle:a,color:tt(...i),hitName:h,hitText:o,passiveName:c,passiveText:r,stats:u,...l?{conditional:l}:{}})`
- Internal dependencies: `tt`.

### `Ne` — **CONFIRMED**
- Source: [181607, 186096) UTF-16; [195500, 200956) bytes. 
- Array of static or computed entries.
- Initial source: `Ne=[Q("tb-ky-mon","Cửu Chuyển Dược Hồ Lô","ky-mon","Cửu chuyển độc phong",[.62,1,.55],"Cửu Chuyển Độc Phong","mỗi đòn trúng thứ 3 thổi phong độc: 10 sát thương/giây trong`…
- Internal dependencies: `Q`, `Qn`.

### `Li` — **CONFIRMED**
- Source: [186097, 186319) UTF-16; [200957, 201223) bytes. 
- Object/configuration registry.
- Initial source: `Li={"tb-ky-mon":"Cửu Chuyển Huyền Phiến","tb-am-tong":"Cửu Tiêu Phượng Cầm","tb-ngu-thu-su":"Vạn Thú Vương Thương","tb-phu-su":"Càn Khôn Thần Bút","tb-tran-phap-su":"Chu `…
- Internal dependencies: none statically named in module.

### `on` — **CONFIRMED**
- Source: [186320, 186362) UTF-16; [201224, 201266) bytes. 
- Initial source: `on=Object.fromEntries(Ne.map(n=>[n.id,n]))`
- Internal dependencies: `Ne`.

### `Un` — **CONFIRMED**
- Source: [186363, 186588) UTF-16; [201267, 201492) bytes. 
- Initial source: `function Un(n){if(!n)return-1;if(V[n])return V[n].rarity;if(n==="iron-sword")return 0;if(n==="jade-sword")return 1;const t=on[n];if(t)return t.classId?lo:3;const e=/^gswo`…
- Internal dependencies: `V`, `on`, `lo`, `Dn`.

### `st` — **CONFIRMED**
- Source: [186588, 186898) UTF-16; [201492, 201802) bytes. 
- Initial source: `function st(n,t=40){var a;if(n&&ht(n)){const i=V[n],h=Math.max(...E.filter(o=>!o.wheel&&o.classId===i.classId&&o.level<=t).map(o=>o.damage));return Math.max(i.damage,Math`…
- Internal dependencies: `ht`, `V`, `E`, `ao`, `on`, `ro`, `Un`, `_t`.

### `Si` — **CONFIRMED**
- Source: [186904, 186924) UTF-16; [201808, 201828) bytes. 
- Initial source: `Si=n=>1+(ye(n)-1)*.6`
- Internal dependencies: `ye`.

### `Ni` — **CONFIRMED**
- Source: [186925, 186946) UTF-16; [201829, 201850) bytes. 
- Initial source: `Ni=n=>1+(ye(n)-1)*1.2`
- Internal dependencies: `ye`.

### `$i` — **CONFIRMED**
- Source: [186947, 186974) UTF-16; [201851, 201878) bytes. 
- Initial source: `$i=(n,t)=>un(w(n*w(Si(t))))`
- Internal dependencies: `un`, `w`, `Si`.

### `mo` — **CONFIRMED**
- Source: [186975, 186988) UTF-16; [201879, 201892) bytes. 
- Initial source: `mo=n=>!!on[n]`
- Internal dependencies: `on`.

### `go` — **CONFIRMED**
- Source: [186989, 187047) UTF-16; [201893, 201951) bytes. 
- Initial source: `go=n=>n<=0?"iron-sword":n===1?"jade-sword":"gsword-"+yn(n)`
- Internal dependencies: `yn`.

### `po` — **CONFIRMED**
- Source: [187048, 187140) UTF-16; [201952, 202044) bytes. 
- Initial source: `po=(n,t,e=0)=>{const a=t==="head"?0:t==="body"?1:2;return\`loot-${yn(n)}-${a}${e?"-c"+e:""}\`}`
- Internal dependencies: `yn`.

### `fo` — **CONFIRMED**
- Source: [187141, 187187) UTF-16; [202045, 202092) bytes. 
- Initial source: `fo=(n,t,e)=>gi[n][t]+(e===0?"":" · "+Ce[n][e])`
- Internal dependencies: `gi`, `Ce`.

### `yo` — **CONFIRMED**
- Source: [187188, 187278) UTF-16; [202093, 202188) bytes. 
- Initial source: `yo=n=>"Rơi từ quái: "+Qc.filter((t,e)=>Fc[e][yn(n)]>0).map(t=>t.toLowerCase()).join(" · ")`
- Internal dependencies: `Qc`, `Fc`, `yn`.

### `ko` — **CONFIRMED**
- Source: [187279, 187471) UTF-16; [202189, 202412) bytes. 
- Initial source: `ko=n=>{const t=$t(n,!1);return\`Bộ ${Ke[n]}: 2 món +${He[n]} HP; 3 món thêm ${Me[n]} giáp và nội tại «${t.name}»: ${Dc(t)}. Kèm vũ khí ${mt(n)}: nội tại ×1.5. Các màu cùng`…
- Internal dependencies: `$t`, `Ke`, `He`, `Me`, `Dc`, `mt`.

### `gt` — **CONFIRMED**
- Source: [187483, 187505) UTF-16; [202424, 202446) bytes. 
- Initial source: `gt=n=>{_n.set(n.id,n)}`
- Internal dependencies: `_n`.

### `Pn` — **CONFIRMED**
- Source: [187506, 187661) UTF-16; [202447, 202604) bytes. 
- Initial source: `Pn=(n,t,e,a)=>gt({id:n,name:t,slot:e,kind:"cosmetic",grade:-1,auraGrade:-1,requiredLevel:1,hp:0,armor:0,attack:0,move:0,description:a,source:"Trang phục"})`
- Internal dependencies: `gt`.

### `dt` — **CONFIRMED**
- Source: [188236, 188442) UTF-16; [203287, 203493) bytes. 
- Initial source: `dt=(n,t,e,a,i,h)=>{const o=Un(n);gt({id:n,name:t,slot:"weapon",kind:"weapon",grade:o,auraGrade:o,requiredLevel:e,hp:0,armor:0,attack:0,move:0,weaponDamage:st(n),descripti`…
- Internal dependencies: `Un`, `gt`, `st`.

### `$e` — **CONFIRMED**
- Source: [190621, 190641) UTF-16; [205877, 205897) bytes. 
- Initial source: `$e=n=>!!(V[n]||Z[n])`
- Internal dependencies: `V`, `Z`.

### `Di` — **CONFIRMED**
- Source: [190680, 191477) UTF-16; [205936, 206733) bytes. 
- Legacy item ID conversion.
- Initial source: `function Di(n,t="kiem-tien"){var r;if($e(n))return n;const e=_n.get(n);if(!e)return null;const a=ae.includes(e.classId??"")?e.classId:ae.includes(t)?t:"kiem-tien";if(e.sl`…
- Internal dependencies: `$e`, `_n`, `ae`, `on`, `E`, `Cn`.

### `cl` — **CONFIRMED**
- Source: [191477, 192390) UTF-16; [206733, 207646) bytes. 
- Initial source: `function cl(n,t="kiem-tien"){var i,h,o,c;const e=Di(n.id,t),a=e?xo(e,n.uid,n.upgrade,n.inlay):null;if(a&&((i=n.gems)!=null&&i.length)&&a.slot==="weapon"&&(a.gems=Bi(n)),a`…
- Internal dependencies: `Di`, `xo`, `Bi`, `oo`, `Po`, `ln`, `Ma`, `Ii`.

### `ol` — **CONFIRMED**
- Source: [192390, 192613) UTF-16; [207646, 207878) bytes. 
- Initial source: `function ol(n,t="kiem-tien"){if(n==="Mảnh Thái Hư Tiên Kiếm")return Kn("tb-kiem-tien");for(const[a,i]of Object.entries(Li))if(n==="Mảnh "+i)return Kn(a);const e=Ne.find(a`…
- Internal dependencies: `Kn`, `Li`, `Ne`, `$e`, `Di`.

### `U` — **CONFIRMED**
- Source: [192619, 192633) UTF-16; [207884, 207898) bytes. 
- Initial source: `U=n=>_n.get(n)`
- Internal dependencies: `_n`.

### `rl` — **CONFIRMED**
- Source: [192634, 192657) UTF-16; [207899, 207922) bytes. 
- Initial source: `rl=()=>[..._n.values()]`
- Internal dependencies: `_n`.

### `ul` — **CONFIRMED**
- Source: [192845, 193025) UTF-16; [208118, 208338) bytes. 
- Initial source: `ul=n=>n.expiresAt?"Trang phục có hạn không bán được":n.protected?"Đã đánh dấu giữ":n.pendingAffixes?"Đang chờ chọn dòng tẩy luyện":bo(n.id)?"Đồ Hồng Mông không bán cho cử`…
- Internal dependencies: `bo`.

### `ll` — **CONFIRMED**
- Source: [193026, 193058) UTF-16; [208339, 208371) bytes. 
- Initial source: `ll=n=>/^(realm-|forged)/.test(n)`
- Internal dependencies: none statically named in module.

### `bo` — **CONFIRMED**
- Source: [193059, 193138) UTF-16; [208372, 208451) bytes. 
- Initial source: `bo=n=>{var t;return ln(n)||ht(n)||Mt.has(((t=Z[n])==null?void 0:t.set.id)??"")}`
- Internal dependencies: `ln`, `ht`, `Mt`, `Z`.

### `Ii` — **CONFIRMED**
- Source: [193139, 193208) UTF-16; [208452, 208521) bytes. 
- Initial source: `Ii=(n,t=0)=>{var e;return ln(n)?5:((e=U(n))==null?void 0:e.grade)??t}`
- Internal dependencies: `ln`, `U`.

### `ml` — **CONFIRMED**
- Source: [193209, 193363) UTF-16; [208522, 208676) bytes. 
- Initial source: `ml=(n,t)=>{var e,a;return ln(n)?va:Mt.has(((e=Z[n])==null?void 0:e.set.id)??"")?ph:((a=V[n])==null?void 0:a.rarityName)??(Z[n]?Vh[Z[n].set.rarity]:mt(t))}`
- Internal dependencies: `ln`, `va`, `Mt`, `Z`, `ph`, `V`, `Vh`, `mt`.

### `gl` — **CONFIRMED**
- Source: [193364, 193382) UTF-16; [208677, 208695) bytes. 
- Initial source: `gl=n=>ee[n]??ee[0]`
- Internal dependencies: `ee`.

### `To` — **CONFIRMED**
- Source: [193383, 193494) UTF-16; [208696, 208807) bytes. 
- Initial source: `To=(n,t)=>{var e,a;return ln(n)?xa:((e=V[n])==null?void 0:e.color)??((a=Z[n])==null?void 0:a.set.color)??pi(t)}`
- Internal dependencies: `ln`, `xa`, `V`, `Z`, `pi`.

### `dl` — **CONFIRMED**
- Source: [193495, 193552) UTF-16; [208808, 208865) bytes. 
- Initial source: `dl=n=>n.setGrade!==void 0?Yc(n.setGrade):To(n.id,n.grade)`
- Internal dependencies: `Yc`, `To`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.