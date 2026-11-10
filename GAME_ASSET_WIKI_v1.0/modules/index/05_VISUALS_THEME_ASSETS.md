# 05 VISUALS THEME ASSETS

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Giao diện, texture và animation
- CONFIRMED: `gt` (UTF-16 [34314, 34850), L130–L130) chèn CSS `ho`, tính scale UI từ viewport (desktop clamp **0.85..1.6**, mobile **0.78..1**); `hn` (UTF-16 [34850, 35057), L130–L130) thay class CSS theo `classId` và màu viền.
- CONFIRMED: `tt` (UTF-16 [35262, 35709), L130–L130) tải hình, vẽ canvas, nhân mỗi kênh RGB theo màu (`original * target / 255`), giữ alpha gốc, rồi tạo data URL và cache `ut`. `we` (UTF-16 [35709, 36292), L130–L130) áp dụng ảnh frame/slot theo màu phẩm cấp `Tt` và bảng `It`.
- CONFIRMED: `fo` (UTF-16 [36404, 37061), L130–L130) tooltip `show/move/hide`, tính vị trí tránh tràn màn hình; `mn` (UTF-16 [37077, 37388), L130–L130) gắn pointer handlers.
- CONFIRMED: `wo` (UTF-16 [37835, 38118), L130–L130) tạo ID skin tùy `look`, `refskin` và `classId`; `fn` (UTF-16 [39180, 39563), L130–L130) nạp `kt-skins/<id>/set.json` và atlas texture vào Phaser, memoize promise trong `Qt`; `bn` (UTF-16 [38628, 39163), L130–L130) chèn fallback animation clip theo bảng `Jt`, đặt fps chạy `>=14` hoặc `13` cho sprint.
- CONFIRMED: `Te` (UTF-16 [39635, 41583), L130–L138) dựng skin picker; `Eo` preview qua static image hoặc atlas dữ liệu; `Image` + canvas vẽ `imageSmoothingEnabled=false`.
- CONFIRMED: `Pe` (UTF-16 [69624, 69956), L308–L308) tải loading art, fallback `kt-boot.png`; `V` (UTF-16 [70178, 70407), L308–L308) không cho thanh tiến độ giảm (`max(previous,clamp(0..100))`); `Ae` (UTF-16 [70487, 70864), L308–L308) có trì hoãn tối thiểu **600 ms** sau `Pt` và fade **520 ms**.
- CONFIRMED: `_e` (UTF-16 [105590, 105980), L468–L468) kiểm tra byte đầu `TMX1` (`[84,77,88,49]`), tạo seed từ 4 byte header XOR `1797074579`, chạy XORShift32 và XOR payload (32-bit little-endian, byte dư). Nếu không có magic hoặc len<8 thì trả dữ liệu như cũ. Đây là biến đổi client-side, không phải mã hóa an toàn.
- CONFIRMED: `Xo` (UTF-16 [106314, 106783), L468–L468) can thiệp `HTMLImageElement.prototype.src` + `decode` cho path `data/(art|armed-skins-v1|fx|TtkGround)/`; `Jo` (UTF-16 [106783, 107035), L468–L468) thay `t.Loader.File.createObjectURL` của Phaser để decode trước khi tạo blob URL.
- UNKNOWN: cấu trúc thực của các sprite sheets, clips và quy tắc scene render không có trong bundle này.

## Symbol lookup chi tiết

- `gt` (UTF-16 [34314, 34850), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `document.createElement`, `prepend`, `contains`, `Math.min`, `Math.max`, `Math.sqrt`, `setProperty`, `toFixed`, `e`, `addEventListener`, `we`, `getPropertyValue`, `getComputedStyle`.
- `hn` (UTF-16 [34850, 35057), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `gt`, `Array.from`, `o.startsWith`, `remove`, `add`, `we`.
- `mo` (UTF-16 [35057, 35157), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Promise`, `Image`, `e`.
- `tt` (UTF-16 [35262, 35709), L130–L130) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `ut.get`, `mo`, `document.createElement`, `i.getContext`, `l.drawImage`, `l.getImageData`, `go`, `l.putImageData`, `i.toDataURL`, `ut.set`.
- `we` (UTF-16 [35709, 36292), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `e.setProperty`, `catch`, `then`, `tt`, `t.trim`, `o`, `ut.has`, `ut.set`, `Tt.forEach`.
- `fo` (UTF-16 [36404, 37061), L130–L130) — `class`; lời gọi trực tiếp/gián tiếp trong AST: `L`, `bo`, `appendChild`, `o`, `setProperty`, `move`, `add`, `Math.round`, `Math.max`, `Math.min`, `remove`.
- `mn` (UTF-16 [37077, 37388), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `t.addEventListener`, `rt.show`, `rt.move`, `rt.hide`.
- `wo` (UTF-16 [37835, 38118), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Se.has`, `yo.has`, `exec`, `jt`.
- `bn` (UTF-16 [38628, 39163), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Yt.get`, `Map`, `split`, `a.set`, `a.get`, `Set`, `map`, `a.has`, `i.push`, `slice`, `Math.max`, `Yt.set`.
- `fn` (UTF-16 [39180, 39563), L130–L130) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Qt.get`, `catch`, `then`, `fetch`, `Ct`, `n.json`, `Promise`, `a`, `So`, `exists`, `image`, `once`, `isLoading`, `start`, `Qt.set`.
- `Te` (UTF-16 [39635, 41583), L130–L138) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `gt`, `document.getElementById`, `document.createElement`, `appendChild`, `n.append`, `st.find`, `forEach`, `a.querySelectorAll`, `h.setAttribute`, `String`, `i.replaceChildren`, `d.setAttribute`, `m.append`, `i.append`, `e`, `Eo`, `l`, `a.appendChild`.
- `Eo` (UTF-16 [41589, 42754), L138–L138) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `wo`, `Image`, `Ct`, `t.getContext`, `Math.max`, `Math.floor`, `Math.min`, `i.clearRect`, `i.drawImage`, `Math.round`, `Promise.all`, `then`, `fetch`, `c.json`, `find`, `Map`, `catch`, `h.decode`.
- `Pe` (UTF-16 [69624, 69956), L308–L308) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `D`, `Image`, `String`, `toggle`, `test`, `$o`, `add`, `Pe`.
- `Pt` (UTF-16 [69203, 69624), L308–L308) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `D`, `contains`, `remove`, `performance.now`, `toggle`, `Pe`, `Me`, `oe`, `window.setInterval`.
- `V` (UTF-16 [70178, 70407), L308–L308) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Math.max`, `Math.min`, `D`, `n.toFixed`, `Math.round`.
- `Ae` (UTF-16 [70487, 70864), L308–L308) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `D`, `contains`, `V`, `add`, `window.setTimeout`, `clearInterval`, `Math.max`, `performance.now`, `sessionStorage.removeItem`.
- `_e` (UTF-16 [105590, 105980), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Bo.some`, `t.slice`, `DataView`, `i.setUint32`, `i.getUint32`.
- `Wo` (UTF-16 [106050, 106304), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `kt.get`, `then`, `fetch`, `Error`, `String`, `o.arrayBuffer`, `URL.createObjectURL`, `Blob`, `_e`, `Uint8Array`, `e.catch`, `kt.delete`, `kt.set`.
- `Xo` (UTF-16 [106314, 106783), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Object.getOwnPropertyDescriptor`, `WeakMap`, `Object.defineProperty`, `Go.test`, `call`, `then`, `Wo`, `URL`, `n.set`, `n.get`, `o.call`.
- `Jo` (UTF-16 [106783, 107035), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `catch`, `then`, `n.arrayBuffer`, `URL.createObjectURL`, `Blob`, `_e`, `Uint8Array`, `i.call`, `Event`.
- `It` (UTF-16 [19317, 20507), L5–L5) — `object`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `Tt` (UTF-16 [19128, 19316), L5–L5) — `array`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `Jt` (UTF-16 [38282, 38616), L130–L130) — `object`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
