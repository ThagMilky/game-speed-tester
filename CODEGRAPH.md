# CodeGraph — Game Speed Tester

> Bản đồ code extension trên `main` tại commit `e531d79` (2026-11-07). Tài liệu tĩnh; không phải trình tạo graph tự động hoặc bằng chứng gameplay.

## 1. Đọc từ đâu?

- Xác định tính năng tại **bảng định tuyến** (mục 5), sau đó đọc implementation và call site thật.
- `manifest.json` quyết định script nào được chạy, **thứ tự nạp**, `MAIN`/`ISOLATED` và quyền extension. Các nhóm dưới đây là **nhóm logic**, không phải thư mục thực tế.
- `CODEGRAPH.md` mô tả **extension**; `GAME_ASSET_WIKI_v0.7.md` và `game-reference/` mô tả **source game tham khảo**. Cần đối chiếu source hiện tại trước khi sửa.

## 2. Nhóm file

| Nhóm | File liên quan |
| --- | --- |
| Entry / UI | `manifest.json`, `popup.html`, `popup.css`, `popup.js`, `popup-layout.js`, `popup-help.js` |
| Menu trong game | `game-menu.js`, `menu-position.js`, `menu-popup.js`, `menu-monitor.js`, `menu-orientation.js` |
| Speed, bay | `content.js`, `page.js`, `flight-content.js`, `flight-page.js`, `flight-popup.js` |
| Auto Farm | `farm-page.js`, `farm-content.js`, `farm-session.js`, `farm-behavior.js`, `farm-boss-safety.js`, `farm-map.js`, `farm-visual.js`, `farm-seals.js`, `farm-combat.js`, `farm-revive-policy.js` |
| Điều phối / navigation | `farm-update.js`, `farm-input.js`, `farm-routing.js`, `navigation.js` |
| Tự hái | `harvest-main-options.js`, `harvest-options.js`, `harvest-content.js`, `harvest-page.js`, `harvest-popup.js`, `harvest-visual.js` |
| Bí cảnh / history | `realm-content.js`, `realm-page.js`, `realm-popup.js`, `realm-history.js`, `realm-history-content.js`, `realm-history-popup.js`, `realm-time-page.js`, `realm-time-content.js`, `realm-time-popup.js` |
| Rương, quest | `chest-content.js`, `chest-page.js`, `chest-popup.js`, `quest-content.js`, `quest-page.js`, `quest-popup.js` |
| FPS / minimap | `fps-content.js`, `fps-page.js`, `fps-popup.js`, `fps-options.js`, `fps-map.js`, `fps-minimap.js`, `fps-minimap-zoom.js`, `fps-minimap-colors.js` |
| Nền, font, chẩn đoán | `background-page.js`, `background-content.js`, `background-diagnostics.js`, `font.js`, `font-options.js`, `farm-diagnostics.js`, `farm-diagnostics-content.js`, `farm-diagnostics-popup.js`, `movement-diagnostics.js`, `movement-log-schema.js` |
| Docs / source snapshot | `AGENTS.md`, `README.md`, `GAME_ASSET_WIKI_v0.7.md`, `game-reference/README.md`, `QA-report.md`, `QA-2026-11-05.md` |

Trong MAIN, `harvest-main-options.js` tạo `GSTHarvest`; `farm-update.js`, `navigation.js` và `farm-input.js` được nạp trước các consumer. Trong ISOLATED, `harvest-options.js` đứng trước `harvest-content.js`. Các `*-popup.js` được nạp theo thẻ `<script>` trong `popup.html`, không theo danh sách content script trong manifest.

## 3. Luồng popup → game

```mermaid
flowchart LR
  P["popup.html / popup.js / feature popup"] --> S["chrome.storage.local"]
  S --> I["ISOLATED: content.js + feature-content.js"]
  I <-->|"window.postMessage / gst:*"| M["MAIN: page.js + feature-page.js"]
  M <--> G["Native game scene / world"]
  X["game-menu.js"] --> E["popup.html?embedded=1"]
  E --> P
```

- **Popup** lưu cấu hình và hỏi status từ tab qua Chrome messaging.
- **ISOLATED** làm cầu nối Chrome Storage/extension với trang. Các cặp `*-content.js` và `*-page.js` định nghĩa cách gửi, nhận và xác nhận message.
- **MAIN** dùng scene và API gốc của game. `content.js`/`page.js` còn quản lý tốc độ và overlay trạng thái.
- Channel xác nhận trong source gồm `gst:farm:v1`, `gst:harvest:v1`, `gst:realm:v1`, `gst:chest:v1`, `gst:quest:v1`, `gst:fps:v1` và các channel status. Tên channel **không thay thế** việc đọc payload/ACK thực tế.
- `farm-session.js` giữ ý định Auto Farm trong `sessionStorage` theo tab/nhân vật; preferences được lưu trong `chrome.storage.local`.

## 4. Điều phối nhiều module cùng dùng Auto Farm

```mermaid
flowchart TD
  G["scene.auto.update gốc"] --> D["farm-update.js: GSTFarmUpdate"]
  D --> H["Callbacks theo priority tăng dần"]
  H --> T{"Handler trả true?"}
  T -- Có --> O["Handler xử lý lượt update"]
  T -- Không --> N["Fallback: auto.update gốc"]
  N --> C["farm-combat.js có thể bọc host khi active"]
  H --- F["routing / behavior / quest / seals / map / realm / chest / harvest"]
  F --> V["GSTNavigation + GSTFarmInput"]
```

`GSTFarmUpdate.add(scene, priority, callback)` đăng ký callback, sắp **số nhỏ trước** và trả hàm gỡ đăng ký. Nếu callback trả `true`, dispatcher dừng ở đó; nếu không ai xử lý, gọi `auto.update` gốc. Handler cuối bị gỡ sẽ khôi phục wrapper nếu module vẫn sở hữu nó.

| Priority | Module đăng ký |
| ---: | --- |
| -1 | `farm-combat.js` |
| 0 | `farm-revive-policy.js` |
| 0.5 | `realm-page.js` (phát hiện cổng hợp lệ, ưu tiên di chuyển cả khi combat) |
| 0.75 | `chest-page.js` (rương bí cảnh, xử lý quái chắn rương; hoạt động khi Auto Farm tắt) |
| 1 | `farm-routing.js` |
| 1.5 | `farm-boss-safety.js` (boss bí cảnh: né vùng skill; boss: HP thấp chờ hồi đan) |
| 2 | `farm-behavior.js` (né quái) |
| 2.5 | `farm-behavior.js` (ưu tiên nhặt vật phẩm) |
| 3 | `quest-page.js` |
| 3.5 | `farm-seals.js` |
| 4 | `farm-map.js` (đi mục tiêu) |
| 20 | `harvest-page.js` |
| 25 | `farm-map.js` (quét mục tiêu bổ sung) |

**Priority không phải ưu tiên tuyệt đối của toàn tính năng**: mỗi handler có điều kiện kích hoạt/nhường quyền riêng (combat, thao tác tay, UI, hồi phục, scene, owner khác). Không đổi thứ tự khi chưa đọc đầy đủ các guard.

Điểm ownership cần bảo vệ:

- `farm-update.js` là dispatcher chung của `scene.auto.update`. Tránh thêm vòng update hoặc chủ sở hữu cạnh tranh.
- `farm-routing.js` bọc `scene.auto.walk`; `navigation.js` hỗ trợ đường đi và bọc `scene.move` khi gần đích; `farm-input.js` bảo vệ thao tác người chơi.
- `farm-page.js` quản lý bộ lọc/mở rộng Auto Farm; `farm-session.js` theo dõi ý định ON/OFF; `farm-seals.js`, `harvest-page.js`, `realm-page.js`, `chest-page.js`, `quest-page.js` phối hợp quyền điều khiển tạm thời.
- API `globalThis` dùng chéo gồm `GSTFarmUpdate`, `GSTNavigation`, `GSTFarmInput`, `GSTFarmRouting`, `GSTHarvest`, `GSTFarmSession`. Kiểm tra chữ ký hàm và call site trước khi thay đổi.
- `popup.js` cung cấp `GSTClipboard.write(text)` cho các nút sao chép log; popup nhúng trong iframe sẽ chọn nội dung để người dùng bấm Ctrl+C nếu quyền clipboard bị chặn. `farm-diagnostics-content.js` có bộ làm sạch log dự phòng nếu `GSTMovementLogSchema` không khả dụng trong ISOLATED world.
- `popup-layout.js` điều hướng một trang chức năng tại mỗi thời điểm, ghi nhớ trang bằng `popupActivePage`, chuyển các nút log hiện có sang trang Chẩn đoán và dùng nút Lưu cố định gọi lại handler Auto Farm cũ; không còn dùng kéo/sắp xếp `popupPanelOrder`. `menu-monitor.js` cập nhật thẻ trạng thái trang Tổng quan.
- `farm-map.js` dùng thêm `GSTFarmPriority` từ `farm-page.js` để xếp thứ tự mục tiêu ở chế độ tìm toàn map; đường vòng tránh boss tận dụng `host.clear`/`host.route` gốc thay vì thêm pathfinder mới.
- `background-diagnostics.js` xuất log build `background-log-2`: mốc bắt đầu trang (`boot`), HP/vị trí trước khi chết, thay đổi vị trí lớn, mất nhịp, kết nối và trạng thái Auto Farm; giữ 80 sự kiện và 24 mốc quan trọng trong `sessionStorage` của cùng tab để đối chiếu qua navigation. `farm-content.js` chỉ ghi dấu `extension_timer` khi chính extension thêm tham số timer. `farm-diagnostics-content.js` lọc trường trước khi xuất log, không truyền URL, packet hoặc thông tin tài khoản.
- `realm-page.js` có `entryMode: enter|stand` từ `realm-popup.js` → `realm-content.js`: khi có cổng phù hợp, ưu tiên đi tới không chờ hết giao tranh; `stand` cố ý đứng cạnh cổng, `enter` chỉ dùng callback gốc nếu game cho phép. Nếu đang combat tại cổng, tạm bỏ cổng 6 giây và nhường Auto Farm gốc tiếp tục đánh; vẫn nhường thao tác tay, quest, thu hoạch, hồi phục và điều kiện Auto Farm đã cấu hình.
- `chest-page.js` ưu tiên rương bí cảnh trước tìm quái thường; khi quái thù địch cản trở trong vùng gần, điều khiển tiếp cận và gọi `host.face/basic` hoặc `scene.auto.castSkills` gốc, **không bật Auto Farm**. Khi chờ combat tại rương >2.5 giây hoặc chưa chọn đúng target F sau 2 giây, tạm bỏ rương 6/10 giây để nhường farm; không gửi F khi sai mục tiêu. Giữ thao tác tay, chế độ farm/chest, bảo vệ bí cảnh và quyền nhận đồ gốc.
- `farm-behavior.js` ưu tiên nhặt đồ hợp lệ qua `scene.auto.idle()` ở priority 2.5 (sau né quái, trước các chuyến tìm bãi); `farm-map.js` có `pauseForLoot(scene)` để nhường đường và dùng sẵn `GSTNavigation` cho chế độ `idleMode: seek` trong bán kính tâm farm hoặc toàn map. Tùy chọn `preferLoot` và `idleMode` đi từ `popup.js` → `farm-content.js` → `farm-page.js`.
- `flight-page.js` đọc cấu hình bridge Auto Farm qua `autoRespawn`, quyết định hỗ trợ bay bằng `scene.auto.on` (không dùng `enabled` của vùng tìm quái). Chờ snapshot game mới, giới hạn thử lại lệnh `scene.act('fly')` và xuất `GSTFlight.snapshot()` cho log chẩn đoán.
- `movement-diagnostics.js` ghi K/U: bảng `skills`/`workshop`/`other` khi mở/đóng, khung hình ngắt trên 500ms, lệnh điều khiển và trạng thái Auto Farm. Bổ sung `movement-log-3`: ngắt khung hình 120–999ms, có lệnh đi nhưng không tiến triển >=350ms, đổi module điều khiển, server correction, tính lại đường, cổng/rương nhường farm. Giữ tối đa 60 incident đã lọc qua navigation trong cùng tab bằng `sessionStorage` (không thay đổi render game).
- `farm-boss-safety.js` dùng `GSTFarmUpdate.add` priority 1.5, chỉ kích hoạt với `targetMode: boss`: né vùng `scene.self.realm.inside.hazards` khi dữ liệu còn mới, ưu tiên gọi `scene.useSkill("Q", false, false)` khi đòn sắp trúng, Q sẵn sàng và hướng thoát đã kiểm tra bằng `host.clear`; ngoài ra chạy né bằng `GSTNavigation`. Dưới 30% HP lùi an toàn, dùng `scene.auto.wait()/drink()` gốc (cooldown từ `pillWait('hp')`), trở lại đánh khi ≥ 40%. Ghi `dash`, `dash_result`, `flight_drop` trong log. `flight-page.js` chờ xác nhận bay từ snapshot mới, sau đó thử lại có giới hạn nếu vẫn tắt (không spam lệnh toggle). Boss ngoài map chưa được xác nhận cung cấp hazard. Có `controls()` cho map/seals nhường quyền.

## 5. Bảng định tuyến theo yêu cầu

| Muốn sửa | File đọc đầu tiên | Kiểm tra tiếp |
| --- | --- | --- |
| Speed đi bộ/bay, khôi phục | `popup.js`, `content.js`, `page.js` | `flight-page.js`, `farm-page.js` |
| Menu tool và popup: điều hướng từng trang, Tổng quan, Chẩn đoán, nút Lưu cố định | `popup.html`, `popup-layout.js`, `popup.css` | `menu-monitor.js`, `menu-orientation.js`, `game-menu.js` |
| Auto Farm đứng yên, bật/tắt, lọc quái | `farm-page.js`, `farm-content.js`, `farm-session.js` | `farm-routing.js`, `farm-behavior.js`, `farm-map.js` |
| Kẹt đường/overshoot | `navigation.js`, `farm-routing.js`, `farm-input.js` | `farm-map.js`, owner liên quan |
| Xung đột farm/thu hoạch/bí cảnh/rương/quest | `farm-update.js`, `farm-routing.js` | `harvest-page.js`, `realm-page.js`, `chest-page.js`, `quest-page.js`, `farm-seals.js` |
| Hồi sinh, farm qua reload/đổi map | `farm-revive-policy.js`, `farm-page.js`, `farm-session.js` | `harvest-page.js`, `realm-page.js` |
| Tự hái | `harvest-page.js`, `harvest-content.js`, `harvest-popup.js` | `harvest-options.js`, `harvest-main-options.js`, `farm-update.js` |
| Vào bí cảnh | `realm-page.js`, `realm-content.js`, `realm-popup.js` | `realm-history.js`, `realm-time-page.js`, `farm-session.js` |
| Phá phong ấn | `farm-seals.js`, `farm-page.js` | `farm-combat.js`, `realm-page.js` |
| Mở rương | `chest-page.js`, `chest-content.js`, `chest-popup.js` | `realm-history.js`, `navigation.js` |
| Quest | `quest-page.js`, `quest-content.js`, `quest-popup.js` | `farm-page.js`, `farm-update.js`, `navigation.js` |
| FPS/minimap/ẩn hiệu ứng | `fps-page.js`, `fps-content.js`, `fps-popup.js` | `fps-map.js`, `fps-minimap.js`, `fps-minimap-zoom.js`, `fps-minimap-colors.js` |
| Popup/menu/font/overlay | `popup.html`, `popup.css`, `popup.js` | `popup-layout.js`, `game-menu.js`, `font.js`, `content.js` |
| Auto Farm tự tắt/tab nền | `farm-diagnostics.js`, `background-diagnostics.js`, `farm-diagnostics-content.js` | `farm-input.js`, `farm-session.js`, `movement-diagnostics.js` |

## 6. Source game tham khảo và giới hạn

- `game-reference/` gồm `WorldScene.js`, `index.js`, `economy-BhEd6Dz4.js`, `giftcodes-DtRLIkN2.js`, `items-DiH_Rqzx.js`, `phaser-DRI6y8R5.js`, `tm-direct.js`, `tm-guard.js`. Dùng Wiki để xác định bundle cần đọc; không tự yêu cầu lại toàn bộ.
- Đây là snapshot khoảng 2026-11-05–07; **không bảo đảm giống game live**. Không sửa, triển khai hoặc đưa file snapshot vào runtime extension.
- Graph dựa trên source tại commit nền; không xác nhận gameplay, CI hoặc server chấp nhận thao tác.

## 7. Duy trì CodeGraph khi sửa code

1. Định tuyến từ mục 5, rồi đối chiếu code hiện tại và manifest; với game source dùng `GAME_ASSET_WIKI_v0.7.md`.
2. Cập nhật phần liên quan **trong cùng task** nếu thêm/xoá/đổi tên module, sửa load order/world, channel/bridge, API chung, dispatcher priority hoặc quan hệ owner/dependency.
3. Chỉ chỉnh phần đã thay đổi, cập nhật mốc commit/source nếu graph đổi. Không cập nhật graph khi chỉ sửa logic nội bộ và quan hệ module giữ nguyên.
4. Không suy ra dependency từ tên file, chỉ ghi quan hệ có call site/source. Luôn phân biệt source snapshot và runtime chưa xác minh.
5. CodeGraph không yêu cầu dependency, generator hay test; test và Git tuân `AGENTS.md` và quyền người dùng cấp cho task hiện tại.

## 8. Event & Handler Map — tra theo sự kiện

Chỉ liệt kê **điểm kích hoạt quan trọng đã thấy trong source** tại baseline `e531d79`; không phải toàn bộ listener. Tên handler `anonymous/inline` nghĩa là callback viết trực tiếp trong `addEventListener`, không phải một hàm tên riêng. Khi debug, bắt đầu ở handler tương ứng rồi đọc tiếp hàm nó gọi và điều kiện guard.

### 8.1. Thao tác người dùng, cài đặt và cầu nối

| Sự kiện / thông điệp | File → handler | Vai trò chính |
| --- | --- | --- |
| Popup bấm **Lưu tốc độ** (`click`) | `popup.js` → `save()` | Kiểm tra input, lưu `preferences` vào `chrome.storage.local`. |
| Popup bấm **Lưu Auto Farm** (`click`) | `popup.js` → `saveFarm("scope" / "filter" / "behavior")` | Lưu riêng nhóm phạm vi, bộ lọc hoặc hành vi farm. |
| Phím điều khiển Auto Farm (`keydown`) | `farm-page.js` → `guardFarmKey(event)` | Kiểm tra focus, ô nhập, phím mặc định/tùy chỉnh; gọi đường bật/tắt Auto Farm khi được phép. |
| Phím điều khiển tay khi đang tự hái (`keydown`) | `harvest-page.js` → `onKey(event)` | Tạm nhường điều khiển sau thao tác di chuyển/chiến đấu/tương tác tay hợp lệ. |
| Cài đặt đổi (`chrome.storage.onChanged`) | `content.js` → callback inline → `configure()` / `renderOverlay()` | Đồng bộ thay đổi tốc độ và bảng trạng thái từ storage. |
| Popup hỏi trạng thái/hiển thị (`chrome.runtime.onMessage`) | `content.js` → callback inline | Nhận `gst:status`, `gst:display`; trả lời hoặc chuyển `gst:command:v1` sang MAIN. |
| `window.message`: `gst:command:v1` | `page.js` → callback inline | Nhận cấu hình tốc độ (`configure`) hoặc chụp trạng thái (`snapshot`); điều khiển timer và `publish()`. |
| `window.message`: `gst:farm:v1` | `farm-page.js` → callback inline | Nhận `shortcut`/`configure`/`status`, đồng bộ module farm và phát `gst:farm-status:v1`. |
| `window.message`: `gst:harvest:v1` | `harvest-page.js` → callback inline | Nhận `configure`/`synchronize`/`status`/chẩn đoán; phản hồi `gst:harvest-status:v1`. |
| `window.message`: `gst:realm:v1` | `realm-page.js` → callback inline; `farm-session.js` → callback inline (`configure`) | Đổi cấu hình vào bí cảnh; cập nhật lựa chọn **giữ Auto Farm** khi đổi map. |
| `window.message`: `gst:chest:v1` | `chest-page.js` → callback inline | Đổi cấu hình rương và trả trạng thái `gst:chest-status:v1`. |
| `window.message`: `gst:quest:v1` | `quest-page.js` → callback inline | Nhận `configure`/`start`/`stop`, quản lý danh sách quest và gửi status. |
| Menu trong game: `click`, `pointer*`, `keydown`, `gst:menu-*` | `game-menu.js` → `open()` / `close()` / `beginEdit()` / `savePosition()` và callbacks inline | Mở/đóng popup nhúng, kéo vị trí, xử lý Esc và thông điệp menu. |

### 8.2. Nhịp game và module sở hữu lượt điều khiển

| Sự kiện / điểm hook | File → handler | Vai trò chính |
| --- | --- | --- |
| `scene.events.preupdate` | `page.js` → `onSpeedFrame()` | Hỗ trợ áp tốc độ theo nhịp scene khi cơ chế tương ứng được gắn. |
| `scene.events.preupdate` | `farm-page.js` → `onFrame()` | Theo dõi và phối hợp logic hỗ trợ Auto Farm trong scene. |
| `scene.events.preupdate` | `farm-session.js` → `frame()` | Quan sát/khôi phục ý định Auto Farm theo điều kiện phiên. |
| `scene.events.preupdate` | `harvest-page.js` → `onFrame()` | Điều phối vòng theo dõi thu hoạch và trạng thái nhân vật. |
| `scene.events.preupdate` | `realm-page.js`, `chest-page.js`, `quest-page.js` → `guard()` | Theo dõi trạng thái scene và khả năng tiếp tục/gỡ điều khiển của từng tính năng. |
| `scene.auto.update` qua `GSTFarmUpdate.add()` | `farm-update.js` → callback của từng module (xem **mục 4**) | Gọi các handler theo priority; callback trả `true` thì dừng lượt, ngược lại nhường update gốc. **Không phải** DOM event hay một timer riêng cho mỗi tính năng. |
| `scene.events.postupdate` | `background-page.js` → `frame()` → `monitor()` | Theo dõi nhịp cập nhật scene cho chức năng khi tab nền (khi đã bật và gắn scene). |

### 8.3. Vòng đời trang / scene

| Sự kiện | File → handler | Vai trò chính |
| --- | --- | --- |
| `DOMContentLoaded` | `content.js` → `renderOverlay()`; `game-menu.js` → `mount()` | Gắn bảng trạng thái hoặc nút menu khi DOM sẵn sàng (cả hai có đường gọi trực tiếp phù hợp). |
| `visibilitychange` | `background-page.js` → callback inline → `discover()` / `monitor()` | Kiểm tra lại cơ chế hỗ trợ nhịp nền khi tab đổi trạng thái hiển thị. |
| `pagehide` | `page.js`, `content.js`, `farm-session.js`, `harvest-page.js`, `realm-page.js`, `chest-page.js`, `quest-page.js`, `game-menu.js` | Tạm dừng hoặc gỡ watcher, wrapper, timer/overlay theo quyền sở hữu từng module. |
| `pageshow` | Cùng nhóm module trên | Khởi động lại theo dõi hoặc gắn lại khi điều kiện cho phép; **không có nghĩa tự động bật mọi tính năng**. |
| `scene.events.shutdown` / `destroy` | `farm-page.js` → `onShutdown()`; `realm-page.js`, `chest-page.js`, `quest-page.js` → `shutdown()`; `harvest-page.js` → `onShutdown()` | Dọn handler/quyền điều khiển khi scene kết thúc hoặc bị hủy. |

**Cách tra lỗi nhanh:** (1) Xác định hành động/sự kiện bắt đầu lỗi; (2) tìm handler trong mục 8; (3) đọc guard, hàm gọi tiếp và owner liên quan ở mục 4–5; (4) nếu phụ thuộc hành vi game, đối chiếu source snapshot theo Wiki. Các mô tả ở đây chỉ xác nhận wiring trong source, không khẳng định event đã xảy ra ở runtime hoặc game server chấp nhận hành động.
