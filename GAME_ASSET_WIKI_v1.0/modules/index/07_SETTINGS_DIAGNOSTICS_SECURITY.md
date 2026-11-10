# 07 SETTINGS DIAGNOSTICS SECURITY

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Cài đặt và theo dõi
- CONFIRMED: `tm-shake`, `tm-flash`, `tm-env-off`, `tm-low-fx`, `tm-fps-30` đọc localStorage và được expose bằng các hàm `yn`, `kn`, `Ln`, `Mn`, `Zo`; `Qo` heuristic `deviceMemory<=3` hoặc `hardwareConcurrency<=2`.
- CONFIRMED: `prefers-reduced-motion` vô hiệu shake/flash ở getter, không xóa cài đặt.
- CONFIRMED: `Vo` (UTF-16 [104541, 105138), L468–L468) capture keydown F12 và các tổ hợp DevTools, `Ctrl+U/S`, đồng thời heuristic hiệu kích thước cửa sổ >**200** px chiều rộng hoặc >**260** px chiều cao, lặp mỗi **2,000 ms**.
- CONFIRMED: `ce` (UTF-16 [105155, 105553), L468–L468) báo `/api/devtools` qua `navigator.sendBeacon` hoặc `fetch keepalive`; payload có key, token từ session storage và path/query cắt **40** ký tự; mỗi key throttling **30,000 ms**. Đây là chức năng client quan sát được, không chứng minh server xử lý thế nào.
- CONFIRMED: `q` (UTF-16 [16457, 17215), L2–L5) + F9 / query `?net` tạo overlay RTT/jitter/setup/reconnect.
- CONFIRMED: chưa có cơ sở cho rằng việc chặn DevTools là bảo vệ mã nguồn hiệu quả. Không có chứng cứ nào trong file xác nhận cơ chế xác thực bảo mật server.

## Symbol lookup chi tiết

- `Vo` (UTF-16 [104541, 105138), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `addEventListener`, `toUpperCase`, `includes`, `e.preventDefault`, `e.stopImmediatePropagation`, `ce`, `matchMedia`, `setInterval`.
- `ce` (UTF-16 [105155, 105553), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Date.now`, `le.get`, `le.set`, `sessionStorage.getItem`, `JSON.stringify`, `slice`, `a.call`, `Blob`, `fetch`.
- `wn` (UTF-16 [107306, 107343), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `bt`.
- `Sn` (UTF-16 [107343, 107380), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `bt`.
- `Cn` (UTF-16 [107507, 107584), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.setItem`.
- `zn` (UTF-16 [107823, 107861), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `bt`.
- `Pn` (UTF-16 [107877, 107915), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `bt`.
- `Qo` (UTF-16 [107603, 107668), L468–L468) — `variable`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `q` (UTF-16 [16457, 17215), L2–L5) — `object`; lời gọi trực tiếp/gián tiếp trong AST: `e.push`, `e.shift`, `sort`, `reduce`, `e.slice`, `Math.abs`, `Math.round`.
