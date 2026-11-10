# Bộ trang bị, phẩm chất và thuộc tính phụ

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Các bộ trang bị thông thường, mở rộng, Kim Vân, phần thưởng số món, thuộc tính phụ và độ hiếm.
- Character offset vùng: [3581, 89488) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `Or` | variable | 3587–3654 | dn |  |
| `mh` | variable | 3655–3661 |  |  |
| `gh` | variable | 3662–3666 |  |  |
| `va` | variable | 3667–3690 |  |  |
| `xa` | variable | 3691–3703 |  |  |
| `ln` | function_expression | 3704–3738 | bY |  |
| `fe` | variable | 3739–5141 | bX |  |
| `dh` | function | 5142–5414 |  |  |
| `Pa` | variable | 5420–5432 |  |  |
| `ph` | variable | 5433–5456 |  |  |
| `wa` | variable | 5457–5600 |  |  |
| `ee` | variable | 5601–5709 |  |  |
| `fh` | variable | 5710–5778 | c4 |  |
| `ye` | function_expression | 5779–5830 |  |  |
| `jr` | function_expression | 5831–5894 | c5 |  |
| `Wr` | function_expression | 5895–5928 | dR |  |
| `yh` | variable | 5929–6375 | cf |  |
| `Ha` | variable | 6376–6586 |  |  |
| `kh` | function_expression | 6587–6657 | c6 |  |
| `bh` | function_expression | 6658–7049 |  |  |
| `Ma` | function | 7050–7509 | dS | `kh`, `bh`, `Th` |
| `Th` | function_expression | 7515–7557 | ci |  |
| `Xr` | function_expression | 7558–7571 | e0 |  |
| `Yr` | variable | 7572–7597 | ce |  |
| `Jr` | variable | 7598–7602 | cg |  |
| `zr` | variable | 7603–7607 | ch |  |
| `Zr` | function_expression | 7608–7682 | bT |  |
| `vh` | variable | 7683–8036 | c9 |  |
| `nu` | function_expression | 8037–8194 | bo |  |
| `tu` | variable | 8195–8243 | e2 |  |
| `eu` | variable | 8244–8248 | cc |  |
| `xh` | variable | 8249–8254 | cd |  |
| `Ph` | function_expression | 8255–8330 | cb |  |
| `au` | function | 8331–8786 | ca | `Ph` |
| `wh` | variable | 8792–8796 |  |  |
| `Ka` | function_expression | 8797–8828 | dq |  |
| `Ca` | function_expression | 8829–8844 |  |  |
| `Ba` | variable | 8845–14102 |  |  |
| `Hh` | variable | 14103–14108 |  |  |
| `iu` | variable | 14109–14114 | dy |  |
| `Mh` | function_expression | 14115–14548 | i | `Ca` |
| `Kh` | variable | 14549–14607 | I | `Mh` |
| `Ch` | variable | 14608–14694 |  |  |
| `La` | variable | 14695–28662 |  |  |
| `Bh` | variable | 28663–28799 | dv |  |
| `hu` | variable | 28800–28851 | dB |  |
| `Lh` | function | 28852–29339 | e | `Ca` |
| `su` | variable | 29345–29414 | E | `Lh` |
| `Sh` | variable | 29415–29429 | dO |  |
| `Sa` | variable | 29430–29492 |  |  |
| `cu` | variable | 29493–29629 | c |  |
| `Nh` | variable | 29630–31261 |  |  |
| `ou` | variable | 31262–32284 | T |  |
| `$h` | variable | 32285–44658 |  |  |
| `Dh` | variable | 44659–74120 |  |  |
| `Ih` | variable | 74121–86365 |  |  |
| `Rt` | variable | 86366–86389 | ae |  |
| `Wt` | variable | 86390–86442 |  |  |
| `ke` | variable | 86443–87131 |  |  |
| `Qt` | variable | 87132–87162 |  |  |
| `Cn` | variable | 87163–87168 | cX |  |
| `Z` | variable | 87169–87245 | b_ |  |
| `Ht` | variable | 87246–87299 | cS |  |
| `Gh` | variable | 87300–87367 |  |  |
| `Na` | variable | 87368–87459 | e8 |  |
| `Mt` | variable | 87460–87487 | bZ |  |
| `qh` | variable | 87488–87515 |  |  |
| `ru` | function | 87516–87662 | d6 |  |
| `Vh` | variable | 87697–87702 |  |  |
| `Rh` | function | 87703–87939 | bW |  |
| `be` | function | 87939–88343 |  | `ln` |
| `Qh` | variable | 88349–88355 |  |  |
| `Fh` | function | 88356–89488 | cU | `Rh` |

## Source-grounded implementation notes

### `Or` — **CONFIRMED**
- Source: [3587, 3654) UTF-16; [3628, 3695) bytes. 
- Object/configuration registry.
- Initial source: `Or={threshold:.35,shield:.05,pvpShield:.025,duration:4,cooldown:60}`
- Internal dependencies: none statically named in module.

### `ln` — **CONFIRMED**
- Source: [3704, 3738) UTF-16; [3751, 3785) bytes. 
- Initial source: `ln=n=>n.startsWith("set-kim-van-")`
- Internal dependencies: none statically named in module.

### `fe` — **CONFIRMED**
- Source: [3739, 5141) UTF-16; [3786, 5385) bytes. 
- Object/configuration registry.
- Initial source: `fe={id:"set-kim-van",name:"Kim Vân",rarity:2,color:xa,classId:null,bonuses:[{pieces:3,name:"Kim Vân Hộ Thể",description:"+4% máu, +7% sát thương, +9% sát thương kỹ năng, `…
- Internal dependencies: `xa`.

### `dh` — **CONFIRMED**
- Source: [5142, 5414) UTF-16; [5386, 5708) bytes. 
- Initial source: `function dh(n){var e;const t=(e=fe.pieces.find(a=>a.id===n))==null?void 0:e.passive;return t?\`${t.name}: ${t.description} Phẩm ${va} · chỉ số gốc cao hơn 10% đồ thường cù`…
- Internal dependencies: `fe`, `va`.

### `wa` — **CONFIRMED**
- Source: [5457, 5600) UTF-16; [5757, 5927) bytes. 
- Object/configuration registry.
- Initial source: `wa={[-1]:"Phế Khí",0:"Phàm Khí",1:"Pháp Khí",2:"Linh Khí",3:"Pháp Bảo",4:"Linh Bảo",5:"Tiên Bảo",6:"Tiên Thiên Chí Bảo",7:"Hồng Mông Pháp Bảo"}`
- Internal dependencies: none statically named in module.

### `ee` — **CONFIRMED**
- Source: [5601, 5709) UTF-16; [5928, 6036) bytes. 
- Object/configuration registry.
- Initial source: `ee={[-1]:"#8b8b8b",0:"#dbe1e8",1:"#6dcf8c",2:"#65b9f3",3:"#c394f5",4:"#f3c768",5:"#ff9852",6:"#ff535f",7:Pa}`
- Internal dependencies: `Pa`.

### `fh` — **CONFIRMED**
- Source: [5710, 5778) UTF-16; [6037, 6105) bytes. 
- Array of static or computed entries.
- Initial source: `fh=[1,1.1,1.2,1.3,1.4,1.5,1.6,1.7,1.8,1.9,2,2.2,2.45,2.75,3.1,3.5,4]`
- Internal dependencies: none statically named in module.

### `ye` — **CONFIRMED**
- Source: [5779, 5830) UTF-16; [6106, 6157) bytes. 
- Initial source: `ye=n=>fh[Math.max(0,Math.min(16,Math.trunc(n)||0))]`
- Internal dependencies: `fh`.

### `jr` — **CONFIRMED**
- Source: [5831, 5894) UTF-16; [6158, 6221) bytes. 
- Initial source: `jr=n=>Math.floor(Math.max(0,Math.min(16,Math.trunc(n)||0))/4)*4`
- Internal dependencies: none statically named in module.

### `Wr` — **CONFIRMED**
- Source: [5895, 5928) UTF-16; [6222, 6255) bytes. 
- Initial source: `Wr=()=>({version:2,materials:{}})`
- Internal dependencies: none statically named in module.

### `yh` — **CONFIRMED**
- Source: [5929, 6375) UTF-16; [6256, 6779) bytes. 
- Object/configuration registry.
- Initial source: `yh={atkPct:"Sát thương",hpPct:"Máu tối đa",dmgReducePct:"Giảm sát thương",critPct:"Chí mạng",critDmgPct:"Sát thương chí mạng",movePct:"Tốc độ chạy",skillDmgPct:"Sát thươn`…
- Internal dependencies: none statically named in module.

### `Ha` — **CONFIRMED**
- Source: [6376, 6586) UTF-16; [6780, 6990) bytes. 
- Object/configuration registry.
- Initial source: `Ha={atkPct:.008,hpPct:.012,dmgReducePct:.004,critPct:.004,critDmgPct:.015,movePct:.004,skillDmgPct:.01,poisonDmgPct:.015,directLeech:.003,manaCostReduce:.007,manaRegenPct`…
- Internal dependencies: none statically named in module.

### `kh` — **CONFIRMED**
- Source: [6587, 6657) UTF-16; [6991, 7061) bytes. 
- Initial source: `kh=(n,t)=>n<1?0:(t?[0,2,3,4,5,5,5,5]:[0,1,1,2,2,3,3,3])[Math.min(7,n)]`
- Internal dependencies: none statically named in module.

### `bh` — **CONFIRMED**
- Source: [6658, 7049) UTF-16; [7062, 7453) bytes. 
- Initial source: `bh=(n,t)=>[...t==="weapon"?["atkPct","critPct","critDmgPct","skillDmgPct","monsterDmgPct"]:["hpPct","dmgReducePct","monsterDmgPct",...t==="feet"?["movePct"]:["atkPct"]],.`…
- Internal dependencies: none statically named in module.

### `Ma` — **CONFIRMED**
- Source: [7050, 7509) UTF-16; [7454, 7913) bytes. 
- Random affix selection and rank assignment.
- Initial source: `function Ma(n,t,e,a=Math.random,i=[],h){const o=kh(n,t==="weapon"),c=i.map(l=>({...l})),r=bh(e,t).filter(l=>!c.some(m=>m.key===l)),u=n===1?[80,20,0,0,0]:n===2?[60,30,10,0`…
- Internal dependencies: `kh`, `bh`, `Th`.

### `Th` — **CONFIRMED**
- Source: [7515, 7557) UTF-16; [7919, 7961) bytes. 
- Initial source: `Th=(n,t)=>Math.round((Ha[n]??0)*t*1e4)/1e4`
- Internal dependencies: `Ha`.

### `Xr` — **CONFIRMED**
- Source: [7558, 7571) UTF-16; [7962, 7975) bytes. 
- Initial source: `Xr=n=>n in Ha`
- Internal dependencies: `Ha`.

### `Yr` — **CONFIRMED**
- Source: [7572, 7597) UTF-16; [7976, 8001) bytes. 
- Array of static or computed entries.
- Initial source: `Yr=[0,3,6,10,15,20,35,50]`
- Internal dependencies: none statically named in module.

### `Jr` — **CONFIRMED**
- Source: [7598, 7602) UTF-16; [8002, 8006) bytes. 
- Initial source: `Jr=8`
- Internal dependencies: none statically named in module.

### `zr` — **CONFIRMED**
- Source: [7603, 7607) UTF-16; [8007, 8011) bytes. 
- Initial source: `zr=5`
- Internal dependencies: none statically named in module.

### `Zr` — **CONFIRMED**
- Source: [7608, 7682) UTF-16; [8012, 8089) bytes. 
- Initial source: `Zr=n=>\`${yh[n.key]??n.key} +${+(n.value*100).toFixed(2)}% · bậc ${n.rank}\``
- Internal dependencies: `yh`.

### `vh` — **CONFIRMED**
- Source: [7683, 8036) UTF-16; [8090, 8482) bytes. 
- Array of static or computed entries.
- Initial source: `vh=[{id:"stone-1",name:"Đá cường hóa cấp 1",price:2,amount:20},{id:"reroll",name:"Tẩy Luyện Thạch",price:1,amount:1},{id:"seal",name:"Phù Giữ Thuộc Tính",price:2,amount:1`…
- Internal dependencies: none statically named in module.

### `nu` — **CONFIRMED**
- Source: [8037, 8194) UTF-16; [8483, 8653) bytes. 
- Initial source: `nu=n=>{var t;return n==="powder"?"Bột luyện khí":/^stone-[1-8]$/.test(n)?\`Đá cường hóa cấp ${n.slice(-1)}\`:((t=vh.find(e=>e.id===n))==null?void 0:t.name)??n}`
- Internal dependencies: `vh`.

### `tu` — **CONFIRMED**
- Source: [8195, 8243) UTF-16; [8654, 8702) bytes. 
- Object/configuration registry.
- Initial source: `tu={[-1]:1,0:3,1:10,2:25,3:60,4:120,5:240,6:480}`
- Internal dependencies: none statically named in module.

### `eu` — **CONFIRMED**
- Source: [8244, 8248) UTF-16; [8703, 8707) bytes. 
- Initial source: `eu=3`
- Internal dependencies: none statically named in module.

### `xh` — **CONFIRMED**
- Source: [8249, 8254) UTF-16; [8708, 8713) bytes. 
- Initial source: `xh=30`
- Internal dependencies: none statically named in module.

### `Ph` — **CONFIRMED**
- Source: [8255, 8330) UTF-16; [8714, 8789) bytes. 
- Initial source: `Ph=n=>Math.max(0,Math.min(xh,Math.floor(Number(n==null?void 0:n.luck)||0)))`
- Internal dependencies: `xh`.

### `au` — **CONFIRMED**
- Source: [8331, 8786) UTF-16; [8790, 9245) bytes. 
- Enhancement materials, chance, luck and silver-cost estimator.
- Initial source: `function au(n,t,e=1,a=1,i=!1,h=0){const o=n+1,c=[0,2,4,8,16,32,48,72,108,160,240,360,540,810,1215,1823,2734][o]??1/0,r=[0,100,100,95,90,80,70,60,50,40,30,20,16,12,9,7,5][`…
- Internal dependencies: `Ph`.

### `Ka` — **CONFIRMED**
- Source: [8797, 8828) UTF-16; [9256, 9287) bytes. 
- Initial source: `Ka=n=>({...n,range:n.range*wh})`
- Internal dependencies: `wh`.

### `Ca` — **CONFIRMED**
- Source: [8829, 8844) UTF-16; [9288, 9303) bytes. 
- Initial source: `Ca=n=>n.map(Ka)`
- Internal dependencies: `Ka`.

### `Ba` — **CONFIRMED**
- Source: [8845, 14102) UTF-16; [9304, 15351) bytes. 
- Object/configuration registry.
- Initial source: `Ba={"kiem-tien":[["cuu-tieu-kiem-hai","Cửu Tiêu Kiếm Hải","field",8,58,9,.6,[{t:"slow",v:.65,dur:1.4}],"Kiếm hải phủ bán kính 9 ô, chín đợt kiếm vũ làm chậm 35%."],["tinh`…
- Internal dependencies: none statically named in module.

### `iu` — **CONFIRMED**
- Source: [14109, 14114) UTF-16; [15358, 15363) bytes. 
- Initial source: `iu=.7`
- Internal dependencies: none statically named in module.

### `Mh` — **CONFIRMED**
- Source: [14115, 14548) UTF-16; [15364, 15797) bytes. 
- Transform endgame skill tuples into structured skills.
- Initial source: `Mh=n=>Ca((Ba[n]??[]).map(([t,e,a,i,h,o,c,r,u],l)=>({dmg:Math.round(h*Hh*100)/100,id:"tt-"+t,icon:"tt-"+t,name:e,text:u,slot:6,unlock:[80,120,160][l],cd:[45,60,80][l],mana`…
- Internal dependencies: `Ca`, `Ba`, `Hh`.

### `Kh` — **CONFIRMED**
- Source: [14549, 14607) UTF-16; [15798, 15856) bytes. 
- Initial source: `Kh=new Set(Object.keys(Ba).flatMap(n=>Mh(n).map(t=>t.id)))`
- Internal dependencies: `Ba`, `Mh`.

### `Ch` — **CONFIRMED**
- Source: [14608, 14694) UTF-16; [15857, 15943) bytes. 
- Object/configuration registry.
- Initial source: `Ch={"tt-long-tuong-tran-gioi":50,"tt-luc-dao-bang-thien":70,"tt-ban-co-khai-thien":90}`
- Internal dependencies: none statically named in module.

### `La` — **CONFIRMED**
- Source: [14695, 28662) UTF-16; [15944, 31915) bytes. 
- Object/configuration registry.
- Initial source: `La={"kiem-tien":[["tuyet-anh","Tuyết Ảnh Kiếm","line",7,32,3,8,[{t:"slow",v:.65,dur:2}],"Ba luồng kiếm tuyết xuyên thẳng, làm chậm 35% trong 2 giây."],["truc-nhat","Trục `…
- Internal dependencies: none statically named in module.

### `Bh` — **CONFIRMED**
- Source: [28663, 28799) UTF-16; [31916, 32052) bytes. 
- Object/configuration registry.
- Initial source: `Bh={...Ch,"ex-thiet-son":20,"ex-kim-than":35,"ex-toai-tinh":25,"ex-huyet-mach":25,"ex-tran-nguc":40,"ex-long-tuong":55,"ex-bat-diet":75}`
- Internal dependencies: `Ch`.

### `hu` — **CONFIRMED**
- Source: [28800, 28851) UTF-16; [32053, 32104) bytes. 
- Object/configuration registry.
- Initial source: `hu={"ex-chan-dia":12,"ex-long-bo":5,"ex-phuc-ho":4}`
- Internal dependencies: none statically named in module.

### `Lh` — **CONFIRMED**
- Source: [28852, 29339) UTF-16; [32105, 32592) bytes. 
- Transform extended skill tuples into structured skills.
- Initial source: `function Lh(n){return Ca((La[n]??[]).map(([t,e,a,i,h,o,c,r,u],l)=>({id:"ex-"+t,icon:"ex-"+t,name:e,shape:a,range:i,dmg:h,hits:o,cd:c,effects:r,text:u,slot:6,unlock:[10,15`…
- Internal dependencies: `Ca`, `La`.

### `su` — **CONFIRMED**
- Source: [29345, 29414) UTF-16; [32598, 32667) bytes. 
- Initial source: `su=new Set([...Kh,...Object.keys(La).flatMap(n=>Lh(n).map(t=>t.id))])`
- Internal dependencies: `Kh`, `La`, `Lh`.

### `Sh` — **CONFIRMED**
- Source: [29415, 29429) UTF-16; [32668, 32682) bytes. 
- Initial source: `Sh=25/(80*1.6)`
- Internal dependencies: none statically named in module.

### `Sa` — **CONFIRMED**
- Source: [29430, 29492) UTF-16; [32683, 32747) bytes. 
- Object/configuration registry.
- Initial source: `Sa={name:"Thể Tu",hp:175,hpPerLevel:6.2,armor:16,atk:1,move:1}`
- Internal dependencies: none statically named in module.

### `cu` — **CONFIRMED**
- Source: [29493, 29629) UTF-16; [32748, 32884) bytes. 
- Object/configuration registry.
- Initial source: `cu={...Bh,"thanh-the":20,"bao-son-an":25,"luc-dao":60,"dau-tu-bi":20,"giai-tu-bi":30,"gia-tu-bi":25,"thanh-lien":35,"thien-de-quyen":80}`
- Internal dependencies: `Bh`.

### `Nh` — **CONFIRMED**
- Source: [29630, 31261) UTF-16; [32885, 34841) bytes. 
- Array of static or computed entries.
- Initial source: `Nh=[["ba-quyen","Bá Quyền",3,.38,1.3,90,"cone",3.4,"Ba quyền ở giây 0,38 / 0,65 / 0,94. Mỗi nhịp trúng nhận 8 Thánh Huyết; quyền cuối khiến mục tiêu nhận thêm 15% sát thư`…
- Internal dependencies: none statically named in module.

### `ou` — **CONFIRMED**
- Source: [31262, 32284) UTF-16; [34842, 35983) bytes. 
- Object/configuration registry.
- Initial source: `ou={id:"the-tu",...Sa,role:"Hổ trảo · Thánh Huyết · Thân thể trâu bền",difficulty:3,splash:1,hitStyle:"physical",outfit:"player_nam_nau",weapon:"wp-thiet-quyen-sao",weapo`…
- Internal dependencies: `Sa`, `Nh`, `Sh`.

### `$h` — **CONFIRMED**
- Source: [32285, 44658) UTF-16; [35984, 49796) bytes. 
- Embedded JSON registry (16 entries).
- Initial source: `$h=JSON.parse('[{"id":"set-tho-bo","name":"Thô Bố","rarity":0,"color":"#c0c5cf","classId":null,"bonuses":[{"pieces":3,"name":"Bền Bỉ","description":"+5% máu tối đa."},{"p`…
- Internal dependencies: none statically named in module.

### `Dh` — **CONFIRMED**
- Source: [44659, 74120) UTF-16; [49797, 81577) bytes. 
- Embedded JSON registry (33 entries).
- Initial source: `Dh=JSON.parse('[{"id":"ex-set-tro-bui","name":"Tro Bụi","rarity":-1,"rarityName":"Phế Khí","color":"#8b8b8b","level":1,"classId":null,"source":"Quái và tinh anh cấp 1 trở`…
- Internal dependencies: none statically named in module.

### `Ih` — **CONFIRMED**
- Source: [74121, 86365) UTF-16; [81578, 94546) bytes. 
- Embedded JSON registry (48 entries).
- Initial source: `Ih=JSON.parse('[{"id":"ex-wp-doan-thiet-kiem","asset":"ex-wp-doan-thiet-kiem","name":"Đoản Thiết Kiếm","classId":"kiem-tien","rarity":-1,"rarityName":"Phế Khí","color":"#`…
- Internal dependencies: none statically named in module.

### `Rt` — **CONFIRMED**
- Source: [86366, 86389) UTF-16; [94547, 94570) bytes. 
- Object/configuration registry.
- Initial source: `Rt={sets:Dh,weapons:Ih}`
- Internal dependencies: `Dh`, `Ih`.

### `Qt` — **CONFIRMED**
- Source: [87132, 87162) UTF-16; [95377, 95407) bytes. 
- Array of static or computed entries.
- Initial source: `Qt=[...$h,...Rt.sets,fe,...ke]`
- Internal dependencies: `$h`, `Rt`, `fe`, `ke`.

### `Cn` — **CONFIRMED**
- Source: [87163, 87168) UTF-16; [95408, 95413) bytes. 
- Initial source: `Cn=Qt`
- Internal dependencies: `Qt`.

### `Z` — **CONFIRMED**
- Source: [87169, 87245) UTF-16; [95414, 95490) bytes. 
- Initial source: `Z=Object.fromEntries(Qt.flatMap(n=>n.pieces.map(t=>[t.id,{set:n,piece:t}])))`
- Internal dependencies: `Qt`.

### `Ht` — **CONFIRMED**
- Source: [87246, 87299) UTF-16; [95491, 95544) bytes. 
- Initial source: `Ht=Object.assign([1,10,25,45,80,120,160,40],{[-1]:1})`
- Internal dependencies: none statically named in module.

### `Gh` — **CONFIRMED**
- Source: [87300, 87367) UTF-16; [95545, 95612) bytes. 
- Array of static or computed entries.
- Initial source: `Gh=["kiem-tien","co-su","ma-tong","the-tu",...ke.map(n=>n.classId)]`
- Internal dependencies: `ke`.

### `Na` — **CONFIRMED**
- Source: [87368, 87459) UTF-16; [95613, 95704) bytes. 
- Initial source: `Na=Gh.map(n=>Qt.filter(t=>t.classId===n).sort((t,e)=>e.rarity-t.rarity)[0]).filter(Boolean)`
- Internal dependencies: `Gh`, `Qt`.

### `Mt` — **CONFIRMED**
- Source: [87460, 87487) UTF-16; [95705, 95732) bytes. 
- Initial source: `Mt=new Set(Na.map(n=>n.id))`
- Internal dependencies: `Na`.

### `ru` — **CONFIRMED**
- Source: [87516, 87662) UTF-16; [95761, 95907) bytes. 
- Initial source: `function ru(n){const t=Z[n];return!t||!qh.has(t.set.id)?null:\`/data/kt-gear/${t.set.classId}/${t.piece.slot==="back"?"belt":t.piece.slot}-q5.png\`}`
- Internal dependencies: `Z`, `qh`.

### `Rh` — **CONFIRMED**
- Source: [87703, 87939) UTF-16; [95948, 96184) bytes. 
- Count equipped set pieces by valid slot and class.
- Initial source: `function Rh(n,t){const e=new Map;for(const a of n){const i=Z[a];i&&(!i.set.classId||i.set.classId===t)&&e.set(i.piece.slot,a)}return Qt.map(a=>({set:a,pieces:[...e.values`…
- Internal dependencies: `Z`, `Qt`.

### `be` — **CONFIRMED**
- Source: [87939, 88343) UTF-16; [96184, 96588) bytes. 
- Compute base stats for a named set piece.
- Initial source: `function be(n,t=25){const e=Z[n];if(!e)return null;const a=ln(n),i=a?Math.max(2,...[2,3,4,5,6].filter(r=>r<=gh&&Ht[r]<=t)):e.set.rarity,h=e.piece.slot,o={[-1]:.55,0:1,1:1`…
- Internal dependencies: `Z`, `ln`, `gh`, `Ht`, `mh`.

### `Fh` — **CONFIRMED**
- Source: [88356, 89488) UTF-16; [96601, 97733) bytes. 
- Compute gear set bonuses.
- Initial source: `function Fh(n,t){const e={},a=(i,h)=>e[i]=(e[i]??0)+h;for(const i of new Set(n)){const h=fe.pieces.find(o=>o.id===i);if(h)for(const[o,c]of Object.entries(h.passive.bonus)`…
- Internal dependencies: `fe`, `Rh`, `Rt`, `Qh`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.