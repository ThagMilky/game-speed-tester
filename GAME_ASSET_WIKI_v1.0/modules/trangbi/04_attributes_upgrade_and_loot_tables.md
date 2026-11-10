# Điểm thuộc tính, cường hóa, ngọc, kinh tế và bảng rơi

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Điểm nhân vật, bảng giá, tỷ lệ và bảng rơi được khai báo dưới dạng dữ liệu client.
- Character offset vùng: [103427, 108200) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `Ia` | function | 103427–103781 | n | `ie` |
| `yu` | function | 103781–103855 | o | `ie`, `Ia` |
| `ku` | function_expression | 103861–103905 | t |  |
| `bu` | function_expression | 103906–103950 | u |  |
| `Oh` | function_expression | 103951–103994 | s |  |
| `jh` | function_expression | 103995–104092 |  |  |
| `Wh` | variable | 104093–104098 | b0 |  |
| `L` | function_expression | 104099–104116 | eh | `jh` |
| `lt` | variable | 104117–104121 | a_ |  |
| `Xh` | variable | 104122–104126 | aZ |  |
| `Ga` | variable | 104127–104159 |  |  |
| `Yh` | variable | 104160–104220 |  |  |
| `Jh` | variable | 104221–104284 |  |  |
| `zh` | variable | 104285–104335 |  |  |
| `Zh` | variable | 104336–104340 |  |  |
| `ns` | variable | 104341–104359 |  |  |
| `Sn` | variable | 104360–104365 | ek |  |
| `ts` | variable | 104366–104425 |  |  |
| `qa` | variable | 104426–104528 |  |  |
| `es` | variable | 104529–104625 |  |  |
| `Ue` | function_expression | 104626–104650 | bf |  |
| `as` | function_expression | 104651–104699 | ao |  |
| `Jn` | variable | 104700–104715 | ak |  |
| `Va` | function_expression | 104716–104739 | bl |  |
| `is` | variable | 104740–104921 | aL |  |
| `Ra` | variable | 104922–104940 |  |  |
| `hs` | variable | 104941–105053 |  |  |
| `ss` | variable | 105054–105066 |  |  |
| `cs` | function_expression | 105067–105151 | aY | `L` |
| `Nn` | variable | 105152–105157 | aw |  |
| `os` | variable | 105158–105162 |  |  |
| `pt` | variable | 105163–105167 | av |  |
| `he` | function_expression | 105168–105218 | aT |  |
| `rs` | function_expression | 105219–105264 |  |  |
| `yt` | variable | 105265–105269 | at |  |
| `Kt` | variable | 105270–105293 |  |  |
| `Qa` | function_expression | 105294–105407 |  | `L` |
| `Fa` | function_expression | 105408–105520 |  | `L` |
| `Xn` | variable | 105521–105672 |  |  |
| `us` | function_expression | 105673–105689 | aQ | `L` |
| `W` | variable | 105690–105715 | aj |  |
| `O` | variable | 105716–105732 | ag |  |
| `Tn` | variable | 105733–105750 | ah |  |
| `Ct` | variable | 105751–105763 | ai |  |
| `Fn` | variable | 105764–105779 | af |  |
| `Bn` | variable | 105780–105798 | al |  |
| `ls` | variable | 105799–105819 |  |  |
| `ms` | function_expression | 105820–105932 | a$ | `L` |
| `gs` | variable | 105933–105954 |  |  |
| `ds` | variable | 105955–105974 |  |  |
| `Xt` | variable | 105975–105996 |  |  |
| `ps` | function_expression | 105997–106076 | bi | `L` |
| `fs` | variable | 106077–106084 | ay |  |
| `ys` | variable | 106085–106299 |  |  |
| `ks` | variable | 106300–106420 |  |  |
| `bs` | variable | 106421–106667 |  |  |
| `Aa` | function | 106668–106796 | eo |  |
| `qn` | variable | 106802–106826 |  |  |
| `Ts` | variable | 106827–107495 | aJ |  |
| `zn` | variable | 107496–107501 |  |  |
| `Tu` | variable | 107502–107883 | a1 |  |
| `vs` | variable | 107884–107998 | a2 |  |
| `vu` | function_expression | 107999–108031 | a9 | `he` |
| `xs` | variable | 108032–108038 |  |  |
| `Ps` | variable | 108039–108045 |  |  |
| `xu` | function | 108046–108200 | eK |  |

## Source-grounded implementation notes

### `Ia` — **CONFIRMED**
- Source: [103427, 103781) UTF-16; [112357, 112711) bytes. 
- Validate allocated character stats.
- Initial source: `function Ia(n,t){const e={vitality:0,spirit:0,agility:0,insight:0};if(!n||typeof n!="object"||Array.isArray(n)||"strength"in n||"fortitude"in n)return e;for(const{id:a}of`…
- Internal dependencies: `_h`, `ie`.

### `yu` — **CONFIRMED**
- Source: [103781, 103855) UTF-16; [112711, 112785) bytes. 
- Initial source: `function yu(n,t){return ie(n)-Object.values(Ia(t,n)).reduce((e,a)=>e+a,0)}`
- Internal dependencies: `ie`, `Ia`.

### `ku` — **CONFIRMED**
- Source: [103861, 103905) UTF-16; [112791, 112835) bytes. 
- Initial source: `ku=n=>.15*(n.insight??0)/((n.insight??0)+50)`
- Internal dependencies: none statically named in module.

### `bu` — **CONFIRMED**
- Source: [103906, 103950) UTF-16; [112836, 112880) bytes. 
- Initial source: `bu=n=>.25*(n.insight??0)/((n.insight??0)+50)`
- Internal dependencies: none statically named in module.

### `Oh` — **CONFIRMED**
- Source: [103951, 103994) UTF-16; [112881, 112924) bytes. 
- Initial source: `Oh=n=>.1*(n.agility??0)/((n.agility??0)+40)`
- Internal dependencies: none statically named in module.

### `jh` — **CONFIRMED**
- Source: [103995, 104092) UTF-16; [112925, 113022) bytes. 
- Initial source: `jh=(n,t,e)=>{const a=Math.floor(Number(n));return Number.isFinite(a)?Math.min(e,Math.max(t,a)):t}`
- Internal dependencies: none statically named in module.

### `Wh` — **CONFIRMED**
- Source: [104093, 104098) UTF-16; [113023, 113028) bytes. 
- Initial source: `Wh=13`
- Internal dependencies: none statically named in module.

### `L` — **CONFIRMED**
- Source: [104099, 104116) UTF-16; [113029, 113046) bytes. 
- Clamp realm tier input.
- Initial source: `L=n=>jh(n,0,Wh-1)`
- Internal dependencies: `jh`, `Wh`.

### `lt` — **CONFIRMED**
- Source: [104117, 104121) UTF-16; [113047, 113051) bytes. 
- Initial source: `lt=6`
- Internal dependencies: none statically named in module.

### `Xh` — **CONFIRMED**
- Source: [104122, 104126) UTF-16; [113052, 113056) bytes. 
- Initial source: `Xh=5`
- Internal dependencies: none statically named in module.

### `Ga` — **CONFIRMED**
- Source: [104127, 104159) UTF-16; [113057, 113089) bytes. 
- Array of static or computed entries.
- Initial source: `Ga=[1,1.2,1.45,1.75,2.1,2.5,4.5]`
- Internal dependencies: none statically named in module.

### `Yh` — **CONFIRMED**
- Source: [104160, 104220) UTF-16; [113090, 113150) bytes. 
- Array of static or computed entries.
- Initial source: `Yh=[150,188,234,293,366,458,572,715,894,1118,1397,1746,2183]`
- Internal dependencies: none statically named in module.

### `Jh` — **CONFIRMED**
- Source: [104221, 104284) UTF-16; [113151, 113214) bytes. 
- Array of static or computed entries.
- Initial source: `Jh=[350,427,521,636,775,946,1154,1408,1718,2096,2557,3119,3805]`
- Internal dependencies: none statically named in module.

### `zh` — **CONFIRMED**
- Source: [104285, 104335) UTF-16; [113215, 113265) bytes. 
- Array of static or computed entries.
- Initial source: `zh=[60,66,73,80,88,97,106,117,129,141,156,171,188]`
- Internal dependencies: none statically named in module.

### `ns` — **CONFIRMED**
- Source: [104341, 104359) UTF-16; [113271, 113289) bytes. 
- Array of static or computed entries.
- Initial source: `ns=[2,2,3,3,4,4,5]`
- Internal dependencies: none statically named in module.

### `Sn` — **CONFIRMED**
- Source: [104360, 104365) UTF-16; [113290, 113295) bytes. 
- Initial source: `Sn=30`
- Internal dependencies: none statically named in module.

### `qa` — **CONFIRMED**
- Source: [104426, 104528) UTF-16; [113356, 113458) bytes. 
- Array of static or computed entries.
- Initial source: `qa=[0,100,100,100,100,100,100,90,85,80,75,70,65,60,55,50,45,42,38,35,32,28,25,22,20,18,16,14,13,12,10]`
- Internal dependencies: none statically named in module.

### `es` — **CONFIRMED**
- Source: [104529, 104625) UTF-16; [113459, 113555) bytes. 
- Array of static or computed entries.
- Initial source: `es=[0,1,1,2,2,3,3,4,5,6,8,10,14,18,24,30,40,50,62,76,92,110,130,152,176,202,230,260,292,326,362]`
- Internal dependencies: none statically named in module.

### `Ue` — **CONFIRMED**
- Source: [104626, 104650) UTF-16; [113556, 113580) bytes. 
- Initial source: `Ue=n=>Math.ceil(qa[n]/2)`
- Internal dependencies: `qa`.

### `as` — **CONFIRMED**
- Source: [104651, 104699) UTF-16; [113581, 113629) bytes. 
- Initial source: `as=n=>Math.min(Sn,6+2*Math.max(0,Math.floor(n)))`
- Internal dependencies: `Sn`.

### `Jn` — **CONFIRMED**
- Source: [104700, 104715) UTF-16; [113630, 113650) bytes. 
- Initial source: `Jn="Phù Bảo Hộ"`
- Internal dependencies: none statically named in module.

### `Va` — **CONFIRMED**
- Source: [104716, 104739) UTF-16; [113651, 113674) bytes. 
- Initial source: `Va=n=>n>=20?2:n>=10?1:0`
- Internal dependencies: none statically named in module.

### `is` — **CONFIRMED**
- Source: [104740, 104921) UTF-16; [113675, 113856) bytes. 
- Array of static or computed entries.
- Initial source: `is=[{min:5,atkPct:.02,hpPct:.02},{min:10,atkPct:.04,hpPct:.04},{min:15,atkPct:.06,hpPct:.06},{min:20,atkPct:.08,hpPct:.08},{min:25,atkPct:.1,hpPct:.1},{min:30,atkPct:.12,`…
- Internal dependencies: none statically named in module.

### `Ra` — **CONFIRMED**
- Source: [104922, 104940) UTF-16; [113857, 113875) bytes. 
- Array of static or computed entries.
- Initial source: `Ra=[0,1,2,3,3,4,4]`
- Internal dependencies: none statically named in module.

### `hs` — **CONFIRMED**
- Source: [104941, 105053) UTF-16; [113876, 113988) bytes. 
- Array of static or computed entries.
- Initial source: `hs=[[100,0,0,0,0],[60,30,10,0,0],[40,35,20,5,0],[25,35,25,13,2],[15,25,32,22,6],[5,20,35,30,10],[0,10,30,40,20]]`
- Internal dependencies: none statically named in module.

### `ss` — **CONFIRMED**
- Source: [105054, 105066) UTF-16; [113989, 114001) bytes. 
- Array of static or computed entries.
- Initial source: `ss=[0,1,3,6]`
- Internal dependencies: none statically named in module.

### `cs` — **CONFIRMED**
- Source: [105067, 105151) UTF-16; [114002, 114086) bytes. 
- Initial source: `cs=(n,t)=>({reroll:1,lock:ss[Math.min(3,n)]??99,silver:Math.round(500*(1+.3*L(t)))})`
- Internal dependencies: `ss`, `L`.

### `Nn` — **CONFIRMED**
- Source: [105152, 105157) UTF-16; [114087, 114092) bytes. 
- Initial source: `Nn=10`
- Internal dependencies: none statically named in module.

### `pt` — **CONFIRMED**
- Source: [105163, 105167) UTF-16; [114098, 114102) bytes. 
- Initial source: `pt=3`
- Internal dependencies: none statically named in module.

### `he` — **CONFIRMED**
- Source: [105168, 105218) UTF-16; [114103, 114153) bytes. 
- Initial source: `he=n=>Math.min(Nn,2+Math.round(.67*Math.max(0,n)))`
- Internal dependencies: `Nn`.

### `rs` — **CONFIRMED**
- Source: [105219, 105264) UTF-16; [114154, 114199) bytes. 
- Initial source: `rs=n=>Math.max(1,Math.floor(Math.max(0,n)/3))`
- Internal dependencies: none statically named in module.

### `yt` — **CONFIRMED**
- Source: [105265, 105269) UTF-16; [114200, 114204) bytes. 
- Initial source: `yt=3`
- Internal dependencies: none statically named in module.

### `Kt` — **CONFIRMED**
- Source: [105270, 105293) UTF-16; [114205, 114228) bytes. 
- Array of static or computed entries.
- Initial source: `Kt=[100,100,35,18,34,6]`
- Internal dependencies: none statically named in module.

### `Qa` — **CONFIRMED**
- Source: [105294, 105407) UTF-16; [114229, 114342) bytes. 
- Initial source: `Qa=(n,t)=>({essence:Math.ceil([4,8,90,240,260,1200][n]*(1+.2*L(t))),silver:Math.round(2e3*(n+1)**2*(1+.3*L(t)))})`
- Internal dependencies: `L`.

### `Fa` — **CONFIRMED**
- Source: [105408, 105520) UTF-16; [114343, 114455) bytes. 
- Initial source: `Fa=(n,t)=>({essence:Math.ceil([0,2,6,16,28,55,180][n]*(1+.2*L(t))),silver:Math.round(3e3*(n+1)**2*(1+.3*L(t)))})`
- Internal dependencies: `L`.

### `Xn` — **CONFIRMED**
- Source: [105521, 105672) UTF-16; [114456, 114607) bytes. 
- Object/configuration registry.
- Initial source: `Xn={chestCamPerGen:12,chestTimPerGen:12,chestDoPerGen:4,chestDoPrice:150,chestThanPerGen:2,chestThanPrice:250,gemBoxPerGen:6,gemBoxPrice:50,gemBoxLv:1}`
- Internal dependencies: none statically named in module.

### `us` — **CONFIRMED**
- Source: [105673, 105689) UTF-16; [114608, 114624) bytes. 
- Initial source: `us=n=>1+.03*L(n)`
- Internal dependencies: `L`.

### `W` — **CONFIRMED**
- Source: [105690, 105715) UTF-16; [114625, 114655) bytes. 
- Initial source: `W="Tinh thạch thăng phẩm"`
- Internal dependencies: none statically named in module.

### `O` — **CONFIRMED**
- Source: [105716, 105732) UTF-16; [114656, 114678) bytes. 
- Initial source: `O="Đá cường hóa"`
- Internal dependencies: none statically named in module.

### `Tn` — **CONFIRMED**
- Source: [105733, 105750) UTF-16; [114679, 114702) bytes. 
- Initial source: `Tn="Đá tẩy luyện"`
- Internal dependencies: none statically named in module.

### `Ct` — **CONFIRMED**
- Source: [105751, 105763) UTF-16; [114703, 114718) bytes. 
- Initial source: `Ct="Đá khóa"`
- Internal dependencies: none statically named in module.

### `Fn` — **CONFIRMED**
- Source: [105764, 105779) UTF-16; [114719, 114736) bytes. 
- Initial source: `Fn="Linh thạch"`
- Internal dependencies: none statically named in module.

### `Bn` — **CONFIRMED**
- Source: [105780, 105798) UTF-16; [114737, 114761) bytes. 
- Initial source: `Bn="Hồn Thức Tỉnh"`
- Internal dependencies: none statically named in module.

### `ls` — **CONFIRMED**
- Source: [105799, 105819) UTF-16; [114762, 114782) bytes. 
- Array of static or computed entries.
- Initial source: `ls=[6,12,24,150,250]`
- Internal dependencies: none statically named in module.

### `ms` — **CONFIRMED**
- Source: [105820, 105932) UTF-16; [114783, 114895) bytes. 
- Initial source: `ms=(n,t)=>({essence:Math.ceil((ls[n]??0)*(1+.25*L(t))),silver:Math.round(1e3*(n+1)**2*(1+.3*L(t))),fodder:n>=2})`
- Internal dependencies: `ls`, `L`.

### `gs` — **CONFIRMED**
- Source: [105933, 105954) UTF-16; [114896, 114917) bytes. 
- Array of static or computed entries.
- Initial source: `gs=[1,2,4,8,16,32,64]`
- Internal dependencies: none statically named in module.

### `ds` — **CONFIRMED**
- Source: [105955, 105974) UTF-16; [114918, 114937) bytes. 
- Array of static or computed entries.
- Initial source: `ds=[1,1,2,3,5,8,12]`
- Internal dependencies: none statically named in module.

### `Xt` — **CONFIRMED**
- Source: [105975, 105996) UTF-16; [114938, 114959) bytes. 
- Array of static or computed entries.
- Initial source: `Xt=[0,45,40,15,0,0,0]`
- Internal dependencies: none statically named in module.

### `ps` — **CONFIRMED**
- Source: [105997, 106076) UTF-16; [114960, 115039) bytes. 
- Initial source: `ps=n=>({essence:Math.ceil(40*(1+.25*L(n))),silver:Math.round(3e3*(1+.4*L(n)))})`
- Internal dependencies: `L`.

### `fs` — **CONFIRMED**
- Source: [106077, 106084) UTF-16; [115040, 115047) bytes. 
- Initial source: `fs=1500`
- Internal dependencies: none statically named in module.

### `ys` — **CONFIRMED**
- Source: [106085, 106299) UTF-16; [115048, 115262) bytes. 
- Object/configuration registry.
- Initial source: `ys={monster:[70,25,4.7,.28,.02,0,0],elite:[20,45,28,6.5,.5,0,0],boss:[5,35,42,16,1.8,.2,0],worldboss:[0,10,40,38,10.5,1.4,.1],realm:[0,25,45,25,4.5,.5,0],"chest-tim":[0,0`…
- Internal dependencies: none statically named in module.

### `ks` — **CONFIRMED**
- Source: [106300, 106420) UTF-16; [115263, 115383) bytes. 
- Object/configuration registry.
- Initial source: `ks={monster:{chance:.003,pieces:1},elite:{chance:.05,pieces:1},boss:{chance:.4,pieces:1},worldboss:{chance:.5,pieces:1}}`
- Internal dependencies: none statically named in module.

### `bs` — **CONFIRMED**
- Source: [106421, 106667) UTF-16; [115384, 115634) bytes. 
- Object/configuration registry.
- Initial source: `bs={monster:[[O,.05,1],["gem",5e-4,1]],elite:[[O,1,1],[Tn,.05,1],["gem",.03,1]],boss:[[O,1,3],[Tn,.5,1],["gem",.4,1],[W,1,4],[Jn,.03,1]],worldboss:[[O,1,6],[Tn,1,1],[Ct,.`…
- Internal dependencies: `O`, `Tn`, `W`, `Jn`, `Ct`, `Bn`.

### `Aa` — **CONFIRMED**
- Source: [106668, 106796) UTF-16; [115635, 115763) bytes. 
- Weighted rarity selector for drop source.
- Initial source: `function Aa(n,t){const e=ys[n];let a=t()*e.reduce((i,h)=>i+h,0);for(let i=0;i<e.length;i++){if(a<e[i])return i;a-=e[i]}return 0}`
- Internal dependencies: `ys`.

### `Ts` — **CONFIRMED**
- Source: [106827, 107495) UTF-16; [115800, 116494) bytes. 
- Array of static or computed entries.
- Initial source: `Ts=[{id:"stone",name:\`${O} ×1\`,currency:Fn,price:400,give:[O,1],note:"Linh thạch"},{id:"reroll",name:\`${Tn} ×1\`,currency:Fn,price:2e3,give:[Tn,1],note:"Linh thạch"},{id:"`…
- Internal dependencies: `O`, `Fn`, `Tn`, `qn`, `Ct`, `W`, `Bn`.

### `Tu` — **CONFIRMED**
- Source: [107502, 107883) UTF-16; [116501, 116904) bytes. 
- Array of static or computed entries.
- Initial source: `Tu=[{id:"p-tim",name:"Rương trang bị Tím",q:3,price:20,perGen:Xn.chestTimPerGen,pay:"any"},{id:"p-cam",name:"Rương trang bị Cam",q:4,price:80,perGen:Xn.chestCamPerGen,pay`…
- Internal dependencies: `Xn`, `zn`.

### `vs` — **CONFIRMED**
- Source: [107884, 107998) UTF-16; [116905, 117025) bytes. 
- Object/configuration registry.
- Initial source: `vs={id:"gem-box",name:"Hộp ngọc cấp cao",pay:"free",price:zn.gemBoxPrice,perGen:zn.gemBoxPerGen,below:zn.gemBoxLv}`
- Internal dependencies: `zn`.

### `vu` — **CONFIRMED**
- Source: [107999, 108031) UTF-16; [117026, 117058) bytes. 
- Initial source: `vu=n=>Math.max(1,he(n)-vs.below)`
- Internal dependencies: `he`, `vs`.

### `xu` — **CONFIRMED**
- Source: [108046, 108200) UTF-16; [117073, 117227) bytes. 
- Nonlinear capped-like logarithmic formula.
- Initial source: `function xu(n,t,e){if(!Number.isFinite(n)||!Number.isFinite(t)||!Number.isFinite(e)||n<=0||t<=0||e<=0)return 0;const a=t*Ps;return a*Math.log1p(n*xs*e/a)}`
- Internal dependencies: `Ps`, `xs`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.