# 06 MOBILE INPUT FULLSCREEN

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Điều khiển thiết bị
- CONFIRMED: `Po` (UTF-16 [61653, 61922), L308–L308) xác định chế độ mobile từ query `mobile=1/0`, `tm-input-mode`, `matchMedia`, user agent; `Mo` (UTF-16 [45629, 45852), L159–L159) thay query bằng `history.replaceState`.
- CONFIRMED: `vn` (UTF-16 [61922, 67389), L308–L308) tạo joystick pointer. Chia offset XY cho **48**, normalize khi vector >1, dead-zone `<0.15`, bố trí knob offset **38** px; hooks.move nhận x và y đảo dấu theo tọa độ màn hình.
- CONFIRMED: kỹ năng 1–6 dùng `vn.dragAim` (UTF-16 [66312, 67388), L308–L308). Khi chế độ `tm-skill-drag-aim` bật: kéo >**10** px tính aim, độ lớn chuẩn hóa theo **80** px, nhả trong nút HỦY hủy; tap khi không kéo gọi `hooks.tap`.
- CONFIRMED: nút Space, Q, các phím T/R/V/F/G, menu và nút `Tự đánh` gửi `hooks.press("V")`; không tìm thấy thuật toán auto-farm trong file entry.
- CONFIRMED: `Ko` (UTF-16 [101374, 103918), L468–L468) chặn một số browser gestures, tạo nút fullscreen, hỗ trợ `Alt+Enter` và request orientation landscape; `ct` (UTF-16 [100134, 100534), L468–L468) gọi Fullscreen API, thử `screen.orientation.lock("landscape")`, thử keyboard lock Escape; lỗi được bắt và bỏ qua.
- CONFIRMED: CSS mobile có rotation hint khi portrait, layout kỹ năng, minimap, HUD, status, touchscreen.
- UNKNOWN: thực tế hook trong `WorldScene`, tốc độ di chuyển, tấn công, state combat, pathfinding, target selection và auto-farm.

## Symbol lookup chi tiết

- `vn` (UTF-16 [61922, 67389), L308–L308) — `class`; lời gọi trực tiếp/gián tiếp trong AST: `L`, `document.createElement`, `add`, `dispatchEvent`, `Event`, `appendChild`, `a.setAttribute`, `i.setAttribute`, `i.append`, `remove`, `l.removeAttribute`, `s.removeAttribute`, `move`, `i.addEventListener`, `g.preventDefault`, `i.setPointerCapture`, `i.getBoundingClientRect`, `Math.max`.
- `Po` (UTF-16 [61653, 61922), L308–L308) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `get`, `URLSearchParams`, `Le`, `matchMedia`, `test`.
- `Mo` (UTF-16 [45629, 45852), L159–L159) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.setItem`, `URL`, `delete`, `set`, `history.replaceState`.
- `Co` (UTF-16 [45420, 45506), L159–L159) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.getItem`.
- `Le` (UTF-16 [45507, 45628), L159–L159) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.getItem`.
- `Ko` (UTF-16 [101374, 103918), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `document.createElement`, `appendChild`, `document.addEventListener`, `closest`, `R`, `r.preventDefault`, `d.preventDefault`, `Vo`, `matchMedia`, `yt`, `add`, `Ro`, `addEventListener`, `<expression>`, `sessionStorage.getItem`, `it`, `d`, `ct`.
- `ct` (UTF-16 [100134, 100534), L468–L468) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `it`, `t.requestFullscreen`, `e.call`, `n.call`, `i.call`.
- `Do` (UTF-16 [100534, 100717), L468–L468) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `it`, `ct`, `t.call`, `e.call`.
- `Ho` (UTF-16 [100872, 101364), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `document.getElementById`, `document.createElement`, `t.setAttribute`, `t.querySelector`, `t.remove`, `appendChild`.
- `yt` (UTF-16 [99951, 100134), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `matchMedia`.
- `Fo` (UTF-16 [103918, 104541), L468–L468) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `test`, `sessionStorage.getItem`, `sessionStorage.setItem`, `document.createElement`, `e.setAttribute`, `e.querySelector`, `e.remove`, `appendChild`.
