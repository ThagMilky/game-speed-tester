# Vật phẩm tiêu hao, cửa hàng và tài nguyên

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Cấu hình item, shop, sự kiện, giá và mức thưởng.
- Character offset vùng: [205625, 214747) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `Sl` | variable | 205631–205637 | c$ |  |
| `Nl` | variable | 205638–205644 | c_ |  |
| `$l` | variable | 205645–205651 | d4 |  |
| `Dl` | variable | 205652–205657 | f0 |  |
| `Il` | variable | 205658–205663 | f1 |  |
| `Gl` | variable | 205664–205669 | fa |  |
| `Eo` | variable | 205670–205674 |  |  |
| `ql` | function_expression | 205675–205683 | bp |  |
| `Vl` | variable | 205684–205688 | dt |  |
| `Rl` | variable | 205689–205717 | eb |  |
| `Ql` | variable | 205718–205970 | cn |  |
| `Fl` | variable | 205971–207858 | bP |  |
| `Al` | variable | 207859–207864 | cR |  |
| `ia` | variable | 207865–207870 | e5 |  |
| `Uo` | function | 207871–207931 | dj |  |
| `_o` | function_expression | 207937–207954 | dp |  |
| `Oo` | variable | 207955–207978 | bN |  |
| `El` | variable | 207979–207983 | b |  |
| `Ul` | function_expression | 207984–208198 | es |  |
| `jo` | variable | 208199–208211 |  |  |
| `_l` | function | 208212–208502 | et |  |
| `Wo` | variable | 208508–208516 |  |  |
| `Ie` | variable | 208517–208639 | K |  |
| `Xo` | variable | 208640–208684 |  |  |
| `Yo` | variable | 208685–208728 | bJ |  |
| `Jo` | function_expression | 208729–208764 | eT |  |
| `zo` | variable | 208769–208783 |  |  |
| `Ol` | function | 208784–208842 | eN | `zo` |
| `Zt` | variable | 208848–208854 |  |  |
| `ne` | variable | 208855–208879 |  |  |
| `jl` | function | 208880–209629 | eU | `ct`, `Ao` |
| `Wl` | variable | 209635–209653 | bA |  |
| `Zo` | variable | 209654–210786 | Z |  |
| `Xl` | variable | 210787–210985 | dZ |  |
| `nr` | function_expression | 210986–211011 | cj |  |
| `Yl` | function | 211012–211178 | Y | `nr` |
| `Jl` | variable | 211184–211190 | X |  |
| `tr` | function_expression | 211191–211348 | f3 |  |
| `zl` | function | 211349–211453 | H | `tr` |
| `Vi` | function_expression | 211459–211513 |  |  |
| `Zl` | function | 211514–211606 | eM | `Vi` |
| `nm` | function | 211606–211794 | eE | `Vi` |
| `er` | variable | 211800–211910 |  |  |
| `ar` | variable | 211911–211954 |  |  |
| `ir` | variable | 211955–211961 |  |  |
| `hr` | variable | 211962–211968 |  |  |
| `sr` | variable | 211969–211975 |  |  |
| `cr` | function | 211976–212264 | bM | `wo`, `$o` |
| `or` | function | 212264–212445 |  | `cr` |
| `tm` | function | 212445–212825 | cL | `or` |
| `le` | variable | 212831–212836 | a8 |  |
| `em` | variable | 212837–212841 | a4 |  |
| `am` | variable | 212842–212847 | a5 |  |
| `rr` | variable | 212848–212854 | a7 |  |
| `ur` | variable | 212855–212879 | k |  |
| `im` | variable | 212880–212885 | cm |  |
| `hm` | variable | 212886–212899 | bK |  |
| `lr` | variable | 212900–212913 | bL |  |
| `ha` | variable | 212914–212918 | cI |  |
| `sm` | variable | 212919–213027 | bO |  |
| `me` | variable | 213028–213156 | ck |  |
| `mr` | function | 213157–213671 | e_ | `Kn` |
| `cm` | function | 213671–213798 | eY | `So`, `Kn` |
| `gr` | variable | 213804–213835 | cQ |  |
| `om` | function_expression | 213836–213928 | cV |  |
| `rm` | function | 213929–214383 | a6 | `mr` |
| `Gt` | function_expression | 214389–214421 | be |  |
| `um` | function_expression | 214422–214443 | b3 |  |
| `lm` | function_expression | 214444–214474 | b2 |  |
| `Ri` | function_expression | 214475–214582 | bc |  |
| `sa` | function_expression | 214583–214606 |  |  |
| `dr` | function | 214607–214747 | aK | `sa` |

## Source-grounded implementation notes

### `Sl` — **CONFIRMED**
- Source: [205631, 205637) UTF-16; [221307, 221313) bytes. 
- Initial source: `Sl=2.5`
- Internal dependencies: none statically named in module.

### `Nl` — **CONFIRMED**
- Source: [205638, 205644) UTF-16; [221314, 221320) bytes. 
- Initial source: `Nl=4.5`
- Internal dependencies: none statically named in module.

### `$l` — **CONFIRMED**
- Source: [205645, 205651) UTF-16; [221321, 221327) bytes. 
- Initial source: `$l=2.2`
- Internal dependencies: none statically named in module.

### `Dl` — **CONFIRMED**
- Source: [205652, 205657) UTF-16; [221328, 221333) bytes. 
- Initial source: `Dl=30`
- Internal dependencies: none statically named in module.

### `Il` — **CONFIRMED**
- Source: [205658, 205663) UTF-16; [221334, 221339) bytes. 
- Initial source: `Il=20`
- Internal dependencies: none statically named in module.

### `Gl` — **CONFIRMED**
- Source: [205664, 205669) UTF-16; [221340, 221345) bytes. 
- Initial source: `Gl=30`
- Internal dependencies: none statically named in module.

### `ql` — **CONFIRMED**
- Source: [205675, 205683) UTF-16; [221351, 221359) bytes. 
- Initial source: `ql=n=>Eo`
- Internal dependencies: `Eo`.

### `Vl` — **CONFIRMED**
- Source: [205684, 205688) UTF-16; [221360, 221364) bytes. 
- Initial source: `Vl=5`
- Internal dependencies: none statically named in module.

### `Rl` — **CONFIRMED**
- Source: [205689, 205717) UTF-16; [221365, 221393) bytes. 
- Initial source: `Rl=new Set(["TtkDauTruong"])`
- Internal dependencies: none statically named in module.

### `Ql` — **CONFIRMED**
- Source: [205718, 205970) UTF-16; [221394, 221680) bytes. 
- Object/configuration registry.
- Initial source: `Ql={0:[["Thỏi sắt",3],["Linh thạch",100]],1:[["Thỏi sắt",8],["Kim thạch",2],["Linh thạch",600]],2:[["Thỏi sắt",15],["Kim thạch",5],["Yêu nha",5],["Linh thạch",2500]],3:[[`…
- Internal dependencies: none statically named in module.

### `Fl` — **CONFIRMED**
- Source: [205971, 207858) UTF-16; [221681, 223838) bytes. 
- Object/configuration registry.
- Initial source: `Fl={"Tiểu Hồi Khí Đan":{kind:"heal",v:35,hpPct:.08,dur:0,note:"hồi 8% sinh lực tối đa, ít nhất 35 HP"},"Ngọc Lộ Đan":{kind:"heal",v:160,hpPct:.45,dur:0,note:"hồi 45% sinh`…
- Internal dependencies: none statically named in module.

### `Al` — **CONFIRMED**
- Source: [207859, 207864) UTF-16; [223839, 223844) bytes. 
- Initial source: `Al=20`
- Internal dependencies: none statically named in module.

### `ia` — **CONFIRMED**
- Source: [207865, 207870) UTF-16; [223845, 223850) bytes. 
- Array of static or computed entries.
- Initial source: `ia=[]`
- Internal dependencies: none statically named in module.

### `Uo` — **CONFIRMED**
- Source: [207871, 207931) UTF-16; [223851, 223911) bytes. 
- Initial source: `function Uo(n){return ia.some(t=>t.id===n.id)||ia.push(n),n}`
- Internal dependencies: `ia`.

### `_o` — **CONFIRMED**
- Source: [207937, 207954) UTF-16; [223917, 223934) bytes. 
- Initial source: `_o=(n,t)=>n.kt[t]`
- Internal dependencies: none statically named in module.

### `Oo` — **CONFIRMED**
- Source: [207955, 207978) UTF-16; [223935, 223964) bytes. 
- Initial source: `Oo="Bí kíp Truyền Thừa"`
- Internal dependencies: none statically named in module.

### `El` — **CONFIRMED**
- Source: [207979, 207983) UTF-16; [223965, 223969) bytes. 
- Initial source: `El=6`
- Internal dependencies: none statically named in module.

### `Ul` — **CONFIRMED**
- Source: [207984, 208198) UTF-16; [223970, 224184) bytes. 
- Initial source: `Ul=n=>({shards:Number.isSafeInteger(n==null?void 0:n.shards)?Math.max(0,Math.min(1e6,n.shards)):0,claims:[...new Set((Array.isArray(n==null?void 0:n.claims)?n.claims:[]).`…
- Internal dependencies: none statically named in module.

### `jo` — **CONFIRMED**
- Source: [208199, 208211) UTF-16; [224185, 224197) bytes. 
- Array of static or computed entries.
- Initial source: `jo=[0,3,2,1]`
- Internal dependencies: none statically named in module.

### `_l` — **CONFIRMED**
- Source: [208212, 208502) UTF-16; [224198, 224488) bytes. 
- Initial source: `function _l(n,t,e){if(!e||t.dead||n.claims.includes(t.id)||!((t.kills??0)>=5||(t.opened??0)>0||t.fought))return 0;const a=3+Math.max(0,Math.min(2,Math.floor(t.tier??0)))+`…
- Internal dependencies: `jo`.

### `Ie` — **CONFIRMED**
- Source: [208517, 208639) UTF-16; [224503, 224640) bytes. 
- Array of static or computed entries.
- Initial source: `Ie=[{boss:"Khai Minh Thú",egg:"Trứng Thạch Sư",mount:"thach-su"},{boss:"Xích Sô Ngô",egg:"Trứng Bệ Ngạn",mount:"be-ngan"}]`
- Internal dependencies: none statically named in module.

### `Yo` — **CONFIRMED**
- Source: [208685, 208728) UTF-16; [224686, 224729) bytes. 
- Initial source: `Yo=Object.fromEntries(Ie.map(n=>[n.egg,n]))`
- Internal dependencies: `Ie`.

### `Jo` — **CONFIRMED**
- Source: [208729, 208764) UTF-16; [224730, 224765) bytes. 
- Initial source: `Jo=n=>Ie.some(t=>n.includes(t.egg))`
- Internal dependencies: `Ie`.

### `Ol` — **CONFIRMED**
- Source: [208784, 208842) UTF-16; [224785, 224843) bytes. 
- Initial source: `function Ol(n){const t=Xo[n];return t&&zo()<Wo?t.egg:null}`
- Internal dependencies: `Xo`, `zo`, `Wo`.

### `jl` — **CONFIRMED**
- Source: [208880, 209629) UTF-16; [224887, 225716) bytes. 
- Initial source: `function jl(n,t){var i;const e=Yo[t];if(!e)return null;if(n.dead||n.count(t)<1)return"kept";const a=qi[e.mount].name;if(ct(n,e.mount)&&(((i=n.donation)==null?void 0:i.bou`…
- Internal dependencies: `Yo`, `qi`, `ct`, `ne`, `Zt`, `Ao`.

### `Wl` — **CONFIRMED**
- Source: [209635, 209653) UTF-16; [225722, 225744) bytes. 
- Initial source: `Wl="Tụ Linh Hương"`
- Internal dependencies: none statically named in module.

### `Zo` — **CONFIRMED**
- Source: [209654, 210786) UTF-16; [225745, 227044) bytes. 
- Array of static or computed entries.
- Initial source: `Zo=[{vnd:2e4,top:"Tụ Linh Hương",incense:1,slot:""},{vnd:5e4,top:"Mảnh Kim Vân · Hài",incense:1,slot:"feet",items:[["Tinh thạch thăng phẩm",18]]},{vnd:1e5,top:"Mảnh Kim V`…
- Internal dependencies: none statically named in module.

### `Xl` — **CONFIRMED**
- Source: [210787, 210985) UTF-16; [227045, 227293) bytes. 
- Object/configuration registry.
- Initial source: `Xl={"Tụ Linh Hương":3,"Tinh thạch thăng phẩm":5/60,"Đá cường hóa":5/20,"Đá tẩy luyện":1,"Đá khóa":2,"Rương thời trang":30,"Hồn Thức Tỉnh":60,"Phù Bảo Hộ":30,"Trứng Thạch `…
- Internal dependencies: none statically named in module.

### `nr` — **CONFIRMED**
- Source: [210986, 211011) UTF-16; [227294, 227319) bytes. 
- Initial source: `nr=n=>Zo.find(t=>t.vnd>n)`
- Internal dependencies: `Zo`.

### `Yl` — **CONFIRMED**
- Source: [211012, 211178) UTF-16; [227320, 227506) bytes. 
- Initial source: `function Yl(n){const t=nr(n);return t?\`Còn ${(t.vnd-n).toLocaleString("vi-VN")}đ tới mốc ${t.vnd.toLocaleString("vi-VN")}đ: ${t.top}.\`:"Bạn đã đạt mốc nạp cao nhất."}`
- Internal dependencies: `nr`.

### `Jl` — **CONFIRMED**
- Source: [211184, 211190) UTF-16; [227512, 227518) bytes. 
- Initial source: `Jl=500`
- Internal dependencies: none statically named in module.

### `tr` — **CONFIRMED**
- Source: [211191, 211348) UTF-16; [227519, 227676) bytes. 
- Initial source: `tr=()=>({total:0,payments:[],claimed:[],eventBonus:{},bound:{},book:0,looks:[],look:!1,glow:!1,title:!1,titleVisible:!0,incense:{remaining:0,day:"",used:0}})`
- Internal dependencies: none statically named in module.

### `zl` — **CONFIRMED**
- Source: [211349, 211453) UTF-16; [227677, 227781) bytes. 
- Initial source: `function zl(n){const t=tr();return n?{...t,...structuredClone(n),incense:{...t.incense,...n.incense}}:t}`
- Internal dependencies: `tr`.

### `Vi` — **CONFIRMED**
- Source: [211459, 211513) UTF-16; [227787, 227841) bytes. 
- Initial source: `Vi=n=>new Date(n*1e3+7*36e5).toISOString().slice(0,10)`
- Internal dependencies: none statically named in module.

### `Zl` — **CONFIRMED**
- Source: [211514, 211606) UTF-16; [227842, 227934) bytes. 
- Initial source: `function Zl(n,t){return n.incense.remaining>0&&(n.incense.day!==Vi(t)||n.incense.used<3600)}`
- Internal dependencies: `Vi`.

### `nm` — **CONFIRMED**
- Source: [211606, 211794) UTF-16; [227934, 228122) bytes. 
- Initial source: `function nm(n,t,e){const a=n.incense,i=Vi(e);a.day!==i&&(a.day=i,a.used=0);const h=Math.max(0,Math.min(t,a.remaining,3600-a.used));return a.remaining=Math.max(0,a.remaini`…
- Internal dependencies: `Vi`.

### `er` — **CONFIRMED**
- Source: [211800, 211910) UTF-16; [228128, 228265) bytes. 
- Array of static or computed entries.
- Initial source: `er=["Hỏa quặng","Hỏa tinh","Kim thạch","Bí cảnh lệnh","Cảnh giới tinh hoa","Mộc ngọc","Thủy châu","Thổ phách"]`
- Internal dependencies: none statically named in module.

### `ar` — **CONFIRMED**
- Source: [211911, 211954) UTF-16; [228266, 228322) bytes. 
- Array of static or computed entries.
- Initial source: `ar=["Độc Tâm Thảo","U Vụ Hoa","Huyết Đằng"]`
- Internal dependencies: none statically named in module.

### `cr` — **CONFIRMED**
- Source: [211976, 212264) UTF-16; [228344, 228648) bytes. 
- Initial source: `function cr(n,t){const e=wo(t);if(e)return $o(e.id,e.upgrade);const a=n.find(h=>h.name===t);if(a&&a.price>0)return a.price;if(t==="Vảy Kraken")return sr;const i=(a==null?`…
- Internal dependencies: `wo`, `$o`, `sr`.

### `or` — **CONFIRMED**
- Source: [212264, 212445) UTF-16; [228648, 228844) bytes. 
- Initial source: `function or(n,t){if(t==="Thiết kiếm")return 60;if(t==="Ngọc kiếm")return 600;if(t==="Vảy Kraken")return hr;if(t==="Yêu nha")return ir;const e=cr(n,t);return t==="Thỏi sắt`…
- Internal dependencies: `hr`, `ir`, `cr`.

### `tm` — **CONFIRMED**
- Source: [212445, 212825) UTF-16; [228844, 229231) bytes. 
- Initial source: `function tm(n,t="kiem-tien"){const e=ae.includes(t)?t:"kiem-tien",a=E.filter(i=>i.classId===e&&!i.wheel&&i.subgrade==="Hạ"&&i.rarity<=1).map(i=>({name:i.name,weapon:i.id,`…
- Internal dependencies: `ae`, `E`, `er`, `ar`, `or`.

### `le` — **CONFIRMED**
- Source: [212831, 212836) UTF-16; [229237, 229242) bytes. 
- Initial source: `le=10`
- Internal dependencies: none statically named in module.

### `em` — **CONFIRMED**
- Source: [212837, 212841) UTF-16; [229243, 229247) bytes. 
- Initial source: `em=5`
- Internal dependencies: none statically named in module.

### `am` — **CONFIRMED**
- Source: [212842, 212847) UTF-16; [229248, 229253) bytes. 
- Initial source: `am=48`
- Internal dependencies: none statically named in module.

### `rr` — **CONFIRMED**
- Source: [212848, 212854) UTF-16; [229254, 229260) bytes. 
- Initial source: `rr=100`
- Internal dependencies: none statically named in module.

### `ur` — **CONFIRMED**
- Source: [212855, 212879) UTF-16; [229261, 229291) bytes. 
- Initial source: `ur="Cực phẩm linh thạch"`
- Internal dependencies: none statically named in module.

### `im` — **CONFIRMED**
- Source: [212880, 212885) UTF-16; [229292, 229297) bytes. 
- Initial source: `im=$a`
- Internal dependencies: `$a`.

### `hm` — **CONFIRMED**
- Source: [212886, 212899) UTF-16; [229298, 229313) bytes. 
- Initial source: `hm="Hắc Long"`
- Internal dependencies: none statically named in module.

### `lr` — **CONFIRMED**
- Source: [212900, 212913) UTF-16; [229314, 229330) bytes. 
- Initial source: `lr="Côn Bằng"`
- Internal dependencies: none statically named in module.

### `ha` — **CONFIRMED**
- Source: [212914, 212918) UTF-16; [229331, 229335) bytes. 
- Initial source: `ha=0`
- Internal dependencies: none statically named in module.

### `sm` — **CONFIRMED**
- Source: [212919, 213027) UTF-16; [229336, 229464) bytes. 
- Object/configuration registry.
- Initial source: `sm={"van-kiem":"Bí kíp Vạn Kiếm Quy Tông","thien-phien":"Bí kíp Thiên Phiên Ấn","son-ha":"Bí kíp Sơn Hà Đồ"}`
- Internal dependencies: none statically named in module.

### `me` — **CONFIRMED**
- Source: [213028, 213156) UTF-16; [229465, 229614) bytes. 
- Array of static or computed entries.
- Initial source: `me=[["Thỏi sắt",5],["Kim thạch",3],["Hỏa tinh",3],["Yêu nha",3],["Mộc ngọc",2],["Thủy châu",2],["Thổ phách",2],["Vảy Kraken",1]]`
- Internal dependencies: none statically named in module.

### `mr` — **CONFIRMED**
- Source: [213157, 213671) UTF-16; [229615, 230129) bytes. 
- Initial source: `function mr(n,t,e){const a=on[n],i=Kn(n);if(t+1>=rr||e<1e3&&t+1>=le)return{kind:"main",item:(a==null?void 0:a.name)??n,count:1,weapon:n};let h=e-1e3;if(h<3e4)return{kind:`…
- Internal dependencies: `on`, `Kn`, `rr`, `le`, `Oo`, `ha`, `lr`, `me`.

### `cm` — **CONFIRMED**
- Source: [213671, 213798) UTF-16; [230129, 230256) bytes. 
- Initial source: `function cm(n,t){var a;let e=0;for(let i=1;i<=t;i++)e+=((a=So(i,n).find(h=>h.item===Kn(n)))==null?void 0:a.amount)??0;return e}`
- Internal dependencies: `So`, `Kn`.

### `gr` — **CONFIRMED**
- Source: [213804, 213835) UTF-16; [230262, 230293) bytes. 
- Object/configuration registry.
- Initial source: `gr={ingot:10,"fire-crystal":20}`
- Internal dependencies: none statically named in module.

### `om` — **CONFIRMED**
- Source: [213836, 213928) UTF-16; [230294, 230386) bytes. 
- Initial source: `om=(n,t)=>n?Math.max(0,Math.min(n.amount,Math.floor((t-n.startedAt)/(gr[n.recipe]??1e9)))):0`
- Internal dependencies: `gr`.

### `rm` — **CONFIRMED**
- Source: [213929, 214383) UTF-16; [230387, 230875) bytes. 
- Initial source: `function rm(){const n=(t,e)=>{let a=0;for(let i=0;i<1e5;i++){const h=mr("_",le,i);h.kind===t&&(e===void 0||h.item===e)&&a++}return a/1e3};return[{label:"Thần binh của vòn`…
- Internal dependencies: `mr`, `le`, `me`.

### `Gt` — **CONFIRMED**
- Source: [214389, 214421) UTF-16; [230881, 230913) bytes. 
- Initial source: `Gt=(n,t="a")=>t==="a"?n:\`${n}:b\``
- Internal dependencies: none statically named in module.

### `um` — **CONFIRMED**
- Source: [214422, 214443) UTF-16; [230914, 230935) bytes. 
- Initial source: `um=n=>n.split(":")[0]`
- Internal dependencies: none statically named in module.

### `lm` — **CONFIRMED**
- Source: [214444, 214474) UTF-16; [230936, 230966) bytes. 
- Initial source: `lm=n=>n.endsWith(":b")?"b":"a"`
- Internal dependencies: none statically named in module.

### `Ri` — **CONFIRMED**
- Source: [214475, 214582) UTF-16; [230967, 231074) bytes. 
- Initial source: `Ri=(n,t,e,a)=>!a.has(n.u)&&!n.k&&!n.p&&!n.m.some(Boolean)&&n.q<=t.maxQ&&(!t.keepSet||!n.c)&&(t.old||n.g>=e)`
- Internal dependencies: none statically named in module.

### `sa` — **CONFIRMED**
- Source: [214583, 214606) UTF-16; [231075, 231098) bytes. 
- Initial source: `sa=n=>Ga[n.q]*1.25**n.g`
- Internal dependencies: `Ga`.

### `dr` — **CONFIRMED**
- Source: [214607, 214747) UTF-16; [231099, 231239) bytes. 
- Initial source: `function dr(n,t){const e={};for(const a of Y){const i=n.filter(h=>h.s===a&&h.g<=t&&!h.p).sort((h,o)=>sa(o)-sa(h))[0];i&&(e[a]=i.u)}return e}`
- Internal dependencies: `Y`, `sa`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.