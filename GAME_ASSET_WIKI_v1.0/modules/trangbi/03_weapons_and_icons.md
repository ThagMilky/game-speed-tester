# Vũ khí, danh mục, icon và chọn theo phẩm

Asset: `trangbi-iyUH-plT.js`. Status: **CONFIRMED** nếu trích từ cú pháp/file; **INFERRED** nếu chỉ suy luận vai trò; **UNKNOWN** nếu chưa có nguồn thực thi.

## Phạm vi
Danh mục vũ khí và thuật toán chọn vũ khí theo môn phái/phẩm/cấp.
- Character offset vùng: [89488, 103427) UTF-16; một số module chủ ý giao nhau về nội dung.
- Dữ liệu và hàm trong file là phía mã nguồn được cung cấp; không suy ra máy chủ có cùng công thức.

## Symbol inventory (exact names)
| Symbol | Kind | UTF-16 [start,end) | Export(s) | Internal calls |
|---|---|---|---|---|
| `E` | variable | 89494–100579 | ad |  |
| `Te` | variable | 100608–100839 | cT |  |
| `ae` | variable | 101090–101133 | W |  |
| `V` | variable | 101134–101174 | N |  |
| `$a` | variable | 101175–101211 | c0 |  |
| `Ah` | variable | 101212–101246 |  |  |
| `uu` | function | 101247–101759 | F |  |
| `Da` | function | 101759–102046 | ew |  |
| `Eh` | function | 102046–102207 |  | `Da` |
| `lu` | function | 102207–102759 | z | `Eh` |
| `mu` | function_expression | 102765–102881 | c2 |  |
| `Uh` | variable | 102882–102886 | q |  |
| `gu` | variable | 102887–102893 | x |  |
| `du` | function_expression | 102894–102946 | w |  |
| `pu` | variable | 102947–102963 | v |  |
| `fu` | variable | 102964–102969 | j |  |
| `_h` | variable | 102970–103356 | A |  |
| `ie` | function_expression | 103357–103426 | e7 |  |

## Source-grounded implementation notes

### `E` — **CONFIRMED**
- Source: [89494, 100579) UTF-16; [97739, 109386) bytes. 
- Array of static or computed entries.
- Initial source: `E=[{id:"wp-thiet-kiem",asset:"wp-thiet-kiem",name:"Thiết Kiếm",classId:"kiem-tien",rarity:0,rarityName:"Phàm Khí",color:"#c0c5cf",subgrade:"Hạ",level:1,damage:25,wheel:!1`…
- Internal dependencies: none statically named in module.

### `Te` — **CONFIRMED**
- Source: [100608, 100839) UTF-16; [109415, 109701) bytes. 
- Object/configuration registry.
- Initial source: `Te={"anh-sat":"Vô Ảnh Đoạt Mệnh Song Chủy","phu-su":"Càn Khôn Thần Phù Bút","ngu-thu-su":"Vạn Thú Vương Cốt Trượng","ky-mon":"Cửu Chuyển Dược Hồ Lô","am-tong":"Cửu Tiêu P`…
- Internal dependencies: none statically named in module.

### `ae` — **CONFIRMED**
- Source: [101090, 101133) UTF-16; [109952, 109995) bytes. 
- Array of static or computed entries.
- Initial source: `ae=["kiem-tien","co-su","ma-tong","the-tu"]`
- Internal dependencies: none statically named in module.

### `V` — **CONFIRMED**
- Source: [101134, 101174) UTF-16; [109996, 110036) bytes. 
- Initial source: `V=Object.fromEntries(E.map(n=>[n.id,n]))`
- Internal dependencies: `E`.

### `$a` — **CONFIRMED**
- Source: [101175, 101211) UTF-16; [110037, 110073) bytes. 
- Initial source: `$a=E.filter(n=>n.wheel).map(n=>n.id)`
- Internal dependencies: `E`.

### `Ah` — **CONFIRMED**
- Source: [101212, 101246) UTF-16; [110074, 110108) bytes. 
- Object/configuration registry.
- Initial source: `Ah={"the-tu":"trao","co-su":"sao"}`
- Internal dependencies: none statically named in module.

### `uu` — **CONFIRMED**
- Source: [101247, 101759) UTF-16; [110109, 110621) bytes. 
- Resolve weapon icon path.
- Initial source: `function uu(n,t=64){const e=V[n],a=e&&Ah[e.classId];if(a)return\`kt-vukhi/icons/${[32,48,64,128,256].includes(t)?t:64}/${a}${e.rarity>=5?3:e.rarity>=3?2:e.rarity>=1?1:0}.p`…
- Internal dependencies: `V`, `Ah`, `Te`.

### `Da` — **CONFIRMED**
- Source: [101759, 102046) UTF-16; [110621, 110908) bytes. 
- Select candidate weapon by class, rarity, level.
- Initial source: `function Da(n,t,e=Math.random,a=999){const i=Math.max(-1,Math.min(6,Math.trunc(t))),h=E.filter(c=>!c.wheel&&c.rarity===i&&c.level<=a&&(!n||c.classId===n)),o=h.length?h:E.`…
- Internal dependencies: `E`.

### `Eh` — **CONFIRMED**
- Source: [102046, 102207) UTF-16; [110908, 111069) bytes. 
- Stable-hash mapping of item to weapon.
- Initial source: `function Eh(n,t){let e=2166136261;for(const a of\`${n.id}:${n.quantity}:${t}\`)e=Math.imul(e^a.charCodeAt(0),16777619);return Da(t,n.grade,()=>(e>>>0)/4294967296)}`
- Internal dependencies: `Da`.

### `lu` — **CONFIRMED**
- Source: [102207, 102759) UTF-16; [111069, 111621) bytes. 
- Grade/level aware deterministic weapon fallback.
- Initial source: `function lu(n,t,e){const a=Math.max(0,Math.min(4,Math.trunc(n.grade))),i=E.filter(c=>!c.wheel&&c.rarity===a&&c.classId===t),h=i.length?Math.min(...i.map(c=>c.level)):1;le`…
- Internal dependencies: `E`, `Eh`.

### `mu` — **CONFIRMED**
- Source: [102765, 102881) UTF-16; [111627, 111743) bytes. 
- Initial source: `mu=n=>$a.includes(n)?Te[V[n].classId]?\`data/items/fragments/${n}.png\`:\`data/items/divine-fragments-v1/${n}.png\`:null`
- Internal dependencies: `$a`, `Te`, `V`.

### `Uh` — **CONFIRMED**
- Source: [102882, 102886) UTF-16; [111744, 111748) bytes. 
- Initial source: `Uh=5`
- Internal dependencies: none statically named in module.

### `gu` — **CONFIRMED**
- Source: [102887, 102893) UTF-16; [111749, 111755) bytes. 
- Initial source: `gu=600`
- Internal dependencies: none statically named in module.

### `du` — **CONFIRMED**
- Source: [102894, 102946) UTF-16; [111756, 111808) bytes. 
- Initial source: `du=n=>Math.max(3e3,Math.min(15e4,Math.floor(n)*150))`
- Internal dependencies: none statically named in module.

### `pu` — **CONFIRMED**
- Source: [102947, 102963) UTF-16; [111809, 111830) bytes. 
- Initial source: `pu="Tẩy Tủy Đan"`
- Internal dependencies: none statically named in module.

### `fu` — **CONFIRMED**
- Source: [102964, 102969) UTF-16; [111831, 111836) bytes. 
- Initial source: `fu=20`
- Internal dependencies: none statically named in module.

### `_h` — **CONFIRMED**
- Source: [102970, 103356) UTF-16; [111837, 112286) bytes. 
- Array of static or computed entries.
- Initial source: `_h=[{id:"vitality",name:"Thể phách",effect:"+10 máu tối đa",bonus:10},{id:"spirit",name:"Linh lực",effect:"+5 linh lực và +0,5 công; mọi đường tu đều tăng công",bonus:5},`…
- Internal dependencies: none statically named in module.

### `ie` — **CONFIRMED**
- Source: [103357, 103426) UTF-16; [112287, 112356) bytes. 
- Initial source: `ie=n=>Uh*Math.max(1,Math.min(999,Number.isFinite(n)?Math.floor(n):1))`
- Internal dependencies: `Uh`.

## Interpretation / unresolved
- **CONFIRMED:** Values, branches, formulas, and call sites shown above occur in the supplied JS source.
- **INFERRED:** Names and string descriptions suggest intended player-facing behavior, but the execution owner and server authority cannot be established from this asset alone.
- **UNKNOWN:** Whether network handlers call these helpers, server-side verification, persistence rules, effect stacking in live gameplay, and runtime asset availability require importing modules and runtime investigation.