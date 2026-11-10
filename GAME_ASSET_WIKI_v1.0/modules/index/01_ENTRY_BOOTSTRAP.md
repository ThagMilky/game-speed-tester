# 01 ENTRY BOOTSTRAP

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Tải ban đầu và khởi tạo
- CONFIRMED: `an` (UTF-16 [108950, 113072), L468–L468) là hàm khởi tạo game. Đọc `data/textures.json`, `data/classes.json`, `data/scenes.json`, `data/regions.json`, `data/worldmap.json`; tải `data/maps/${r}.json` và metadata (`sets`, `world`, `posts`, `herbs`, `camps`, `quests`, `items`, `realm-cores`). Một số tải có `.catch` và giá trị dự phòng.
- CONFIRMED: `const t=N.get("online")==="1"||N.get("online")!=="0"&&!0` tương đương `online === "1"`. Nếu không có `?online=1`, nhánh offline dùng `Kt` (UTF-16 [5951, 6292), L2–L2) hoặc hồ sơ mới. Điều này chỉ phản ánh nhánh chọn client.
- CONFIRMED: nhánh online gọi `on` (UTF-16 [108144, 108676), L468–L468) và `lo` (UTF-16 [17850, 18966), L5–L5); offline dùng dynamic import `LocalDriver-DMfdN3Dc.js`, truyền tập dữ liệu và hồ sơ. Không thể biết engine offline xử lý các sự kiện thế nào nếu chưa có module đó.
- CONFIRMED: `Je` (UTF-16 [2520, 2553), L2–L2) lọc cổng `TtkDongPhu*` khi `ge` không bật. `ge` lấy từ `globalThis.process?.env?.KT_DONGPHU` (với fallback `We=false`).
- CONFIRMED: nạp module icon `items`, Phaser runtime, `WorldScene`; khởi tạo `new I.Game` `type:I.AUTO`, `pixelArt:true`, `roundPixels:true`, `Scale.RESIZE`, nền `#0e0c12`. Gọi `H.scene.add("world",U,true,{...})` và đánh dấu `window.__tmStarted=true`.
- CONFIRMED: `?lab=1` chuyển sang dynamic import `boot-B_u-AwaO.js`, gọi `labBoot()`, không đi vào `an()` thông thường. `?timer`, `?uncapped` điều chỉnh cấu hình FPS.
- CONFIRMED: `nn` (UTF-16 [108676, 108950), L468–L468) đo 16 khung `requestAnimationFrame`; chọn FPS limit `65` nếu median khung trong khoảng `7 < median < 9.5` ms, ngược lại `0`. `?uncapped` ưu tiên `0`; cài đặt `tm-fps-30` ưu tiên `32`. Target `60`.
- INFERRED: tài sản này là entry bundle Vite được tree-shake/minify, có bootstrap game, UI và mạng; gameplay chính của scene nằm ngoài file.
- UNKNOWN: vòng đời scene, mô phỏng bản đồ, combat thực tế, logic của server; phải đối chiếu module `WorldScene` và driver.

## Symbol lookup chi tiết

- `an` (UTF-16 [108950, 113072), L468–L468) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `Ko`, `Xo`, `N.get`, `V`, `Promise.all`, `M`, `catch`, `on`, `Promise.resolve`, `Kt`, `Ae`, `Object.assign`, `Oo`, `Pt`, `fe`, `Math.max`, `Number`, `n.includes`.
- `on` (UTF-16 [108144, 108676), L468–L468) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `sessionStorage.getItem`, `mt`, `Bt`, `Ae`, `_o`, `Pt`, `V`, `lo`, `sessionStorage.setItem`, `Ne`, `ye`.
- `nn` (UTF-16 [108676, 108950), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Promise`, `setTimeout`, `t`, `e.push`, `requestAnimationFrame`, `clearTimeout`, `sort`, `map`, `e.slice`.
- `M` (UTF-16 [4500, 4610), L2–L2) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `fetch`, `Error`, `e.json`.
- `Je` (UTF-16 [2520, 2553), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `t.filter`, `Xe`.
- `Xe` (UTF-16 [2487, 2519), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `t.startsWith`.
- `to` (UTF-16 [4369, 4488), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `ve`, `Ze`.
- `Kt` (UTF-16 [5951, 6292), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `JSON.parse`, `localStorage.getItem`.
