# 02 NETWORK PROTOCOL

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Trình điều khiển kết nối
- CONFIRMED: `io` (UTF-16 [7274, 14836), L2–L2) quản lý WebSocket + nâng cấp sang RTC; `online=true`, `delay=0.1`, `snapshots=new eo`, `queue`, `held`, `ready`, `latency`, `waitingSince`, `reconnecting`, `displaced`, `onMessage`, `onStatus`.
- CONFIRMED: `lo` (UTF-16 [17850, 18966), L5–L5) kết nối `ws(s)://<location.host>/ws`, timeout **15,000 ms**, gửi JSON hello với `pd:1,sd:1`, chấp nhận `joined`, xử lý `auth`, `error`; trả `{driver:new io(socket,profile),joined}`.
- CONFIRMED: `io.receive` (UTF-16 [8271, 8934), L2–L2) parse JSON; `snap2` gọi `eo.decode`, `pong` tính RTT bằng `performance.now()-at`, `profile` cập nhật/merge và đẩy message vào queue trước `start()`. `moved`, `resumed`, `auth`, `error` có nhánh riêng.
- CONFIRMED: `io.send` (UTF-16 [9195, 9315), L2–L2) chỉ gửi JSON khi transport mở; nếu `held` tồn tại, giới hạn queue **64** phần tử (vượt giới hạn bị bỏ qua).
- CONFIRMED: `io.update` (UTF-16 [9315, 9673), L2–L2) ping mỗi **1,000 ms**; nếu không phản hồi trong **8,000 ms**, bắt đầu `reconnect`; khi khoảng cách update > **2,000 ms** sẽ reset bộ đếm đợi.
- CONFIRMED: `io.upgrade` (UTF-16 [9731, 13161), L2–L2) lấy `/api/rtc/config` với bearer token và timeout **1,500 ms**; nếu enabled, gọi `/api/rtc/offer` có SDP. `timeoutMs` mặc định **5,000 ms**, chặn trên **6,000 ms**. RTC DataChannel `game` `ordered:true`; signaling gắn `hello` với `resume:1,pd:1,sd:1`; chờ `resumed` timeout **1,500 ms**; chuyển transport sau handshake và trả queue.
- CONFIRMED: `so` (UTF-16 [15400, 16451), L2–L2) đọc ICE stats, loại `relay` (TURN) và các kiểu address nội bộ / riêng được mã liệt kê; nhãn pair có dạng candidate type và IPv4/IPv6. Đây là kiểm tra phía client, không chứng minh peer-to-peer thật khi chạy.
- CONFIRMED: `io.reconnect` (UTF-16 [13283, 14835), L2–L2) tối đa **4 lần** với delay bổ sung `700*i` ms, timeout mỗi lần **5,000 ms**, dùng `/ws` và gửi `{t:"hello",token,resume:1,pd:1,sd:1}`. Phân biệt `resumed`, `joined`, `error`; `displaced` có quy trình thông báo riêng.
- CONFIRMED: `ro` (UTF-16 [14868, 15100), L2–L2) nhớ lý do RTC lỗi trong session storage **300,000 ms**, tránh nâng cấp lại trong tab. `Wt` (UTF-16 [15233, 15400), L2–L2) POST báo cáo `/api/rtc/report`, lỗi được nuốt.
- CONFIRMED: đối tượng `q` (UTF-16 [16457, 17215), L2–L5) giữ `route`, `rtt`, `jitter`, `setupMs`, `reason`, `reconnects`, `pair`, `samples`; giữ tối đa **20** mẫu, RTT median và jitter trung bình sai khác liền kề. F9 / `?net` hiện chẩn đoán.
- UNKNOWN: các message `snap2`, `joined`, `resumed`, `profile`, `moved`, `ping`, `pong` là hợp đồng phía client được quan sát; không suy đoán validation hay quyền xử lý từ phía server.

## Symbol lookup chi tiết

- `io` (UTF-16 [7274, 14836), L2–L2) — `class`; lời gọi trực tiếp/gián tiếp trong AST: `L`, `eo`, `Ut`, `watchWs`, `send`, `e.addEventListener`, `receive`, `String`, `displacedNotice`, `reconnect`, `l.feed`, `JSON.parse`, `decode`, `moved`, `q.sample`, `performance.now`, `$t`, `test`.
- `lo` (UTF-16 [17850, 18966), L5–L5) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `Promise`, `WebSocket`, `window.setTimeout`, `s`, `Error`, `clearTimeout`, `a.removeEventListener`, `l`, `a.close`, `o`, `a.send`, `JSON.stringify`, `JSON.parse`, `String`, `$t`, `ke`, `e`, `io`.
- `q` (UTF-16 [16457, 17215), L2–L5) — `object`; lời gọi trực tiếp/gián tiếp trong AST: `e.push`, `e.shift`, `sort`, `reduce`, `e.slice`, `Math.abs`, `Math.round`.
- `ro` (UTF-16 [14868, 15100), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `sessionStorage.getItem`, `JSON.parse`, `Date.now`, `sessionStorage.removeItem`.
- `Gt` (UTF-16 [15100, 15190), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `sessionStorage.setItem`, `JSON.stringify`, `Date.now`.
- `Wt` (UTF-16 [15233, 15400), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `catch`, `fetch`, `JSON.stringify`.
- `so` (UTF-16 [15400, 16451), L2–L2) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `t.getStats`, `Map`, `e.forEach`, `o.set`, `o.forEach`, `o.get`, `String`, `s.includes`, `s.toLowerCase`, `map`, `m.split`, `m.endsWith`, `m.startsWith`, `test`.
- `Ut` (UTF-16 [7092, 7178), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `t.send`, `t.close`.
- `no` (UTF-16 [7179, 7273), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `t.send`, `t.close`, `e.close`.
- `X` (UTF-16 [15196, 15232), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `Promise`, `setTimeout`.
