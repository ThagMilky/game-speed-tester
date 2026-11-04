# Kết quả QA extension — 2026-11-03

Lưu ý cập nhật 2026-11-04: kết quả 29 ca bên dưới là lịch sử. Lượt QA tự tắt tab nền trước có 27 ca cục bộ; lượt chính sách hồi sinh mới có 32 ca, ghi riêng ở Kết luận; không thay thế bằng chứng browser/gameplay. Các mục cũ ghi NOT RUN vẫn chưa được kiểm chứng nếu không nằm trong lượt QA mới. Lint/typecheck/CI không được kiểm tra trong lượt này.

## Kết luận

**Toàn map + boss riêng, 2026-11-04 — chưa QA.** Thêm searchScope radius/map xuyên popup/storage/bridge/MAIN và phạm vi né theo biên map. Toàn map tìm quái trong views/autoHost đã lọc, tâm tạm tới mục tiêu; chỉ gia hạn chase khi tiến gần thật. Source t.ents/gone không chứng minh có mọi quái xa; inside.boss.x/y/hp có trong minimap. Thêm tiếp cận metadata boss bằng walk riêng, priority 4, không giả actor/đánh khi thiếu actor, không vượt tránh level khi boss chưa có level, nhường hồi phục/tay/né và cleanup scene. Tách hideBosses/hideBossEffects khỏi quái thường, mặc định boss vẫn hiện; chọn nhanh gồm hai tick mới. **Tests/lint/typecheck/browser/gameplay: NOT RUN; dữ liệu quái xa, tới boss và hiển thị/FX thực tế: UNVERIFIED; CI: NOT CHECKED.** Chỉ review source/diff/status; PASS lịch sử không bao phủ thay đổi này.

**Bản đồ tối giản, 2026-11-04 — chưa QA.** Thêm simpleMap/hideVegetation/hideBuildings và Chọn tất cả/Bỏ chọn tất cả, không bật công tắc tổng thay người dùng. Đối chiếu bakeTiles/placeSprites/groundLoaded/groundUnderlay/sway/occluders và debug collision; tài nguyên placeNodes dùng frame w:, map dùng m:. Vẽ nền và blockedCell thành canvas vùng 16×16 ô, tối đa 2 vùng dựng/frame và 64 vùng cache; hiển thị khi viewport sẵn sàng, fallback nền gốc khi interface không khớp. Giữ collision và tương tác; dọn image/texture khi tắt/rời scene. Phân loại nhà/cây chưa đầy đủ, atlas/tone đặc biệt có thể còn hiện; collision thay đổi trong cùng instance chưa được theo dõi. **Tests/lint/typecheck/browser/gameplay: NOT RUN; độ khớp vật cản và mức tăng FPS: UNVERIFIED; CI: NOT CHECKED.** Chỉ review source/diff/status, không dùng các kết quả PASS cũ cho tính năng này.

**Chờ/né quái, 2026-11-04 — implementation, chưa QA.** idleMode=hold mặc định mới giữ nguyên loot trước rồi dừng steer thay nhánh quay về ax/ay; có lựa chọn home để dùng lại idle gốc. Không đổi tâm tìm kiếm hoặc rest/backOff. Né mặc định OFF, level ≥10, khoảng lùi 2 (1–6) ô; quan sát onEvent gốc với by rõ nguồn, không suy từ HP/độ gần. Loại quái ngưỡng né khỏi mục tiêu khi không hồi phục; navigation riêng dùng clear/route/walk gốc và dispatcher priority 2. Bàn giao với hái/cổng/phong ấn, nghỉ 3 giây, lượt tối đa 3 giây, đường trong vùng farm, bộ nhớ thủ phạm 8 giây, dọn hook khi tắt/rời scene. Source xác nhận game gọi this.onEvent theo lookup method và có by ở một số nhánh; chưa xác nhận by luôn có cho đòn quái đánh người. **Tests/lint/typecheck/browser/gameplay: NOT RUN; hành vi chờ/né và schema sát thương thực tế: UNVERIFIED; CI: NOT CHECKED.** Không dùng PASS lịch sử để suy ra tính năng này hoạt động thực tế.

**Tối ưu FPS, 2026-11-04 — implementation, chưa QA.** Thêm nhóm popup độc lập, 8 lựa chọn mặc định tắt, storage/cầu nối MAIN và mục FPS tùy chọn trên bảng trạng thái. Đối chiếu code.txt: views/ch.view và attachment, cameraFilter ở updateViews, visible ở updateOverlay/updateBars, castFx/liveSkills.play/weaponFx.play, statusFx.render, floatText, weather/air/emitter và feel. Giữ castFx/onEvent và game loop; chỉ chặn factory FX xác định được nguồn, che lớp vẽ bằng cameraFilter với hoàn trả trước update. Dọn hook/mask/CSS khi tắt/đổi scene, không replay hiệu ứng đã bỏ tạo; hiệu ứng đang chạy có thể tồn tại đến hết hạn. Chỉ review source/diff/status, không chạy module hoặc gameplay. **Tests/lint/typecheck/browser/live: NOT RUN; hiệu quả FPS, cleanup và tương thích runtime: UNVERIFIED; CI: NOT CHECKED.** Các kết quả PASS lịch sử bên dưới không bao phủ tính năng FPS mới.

**Cập nhật chính sách hồi sinh 2026-11-04: 32/32 PASS cục bộ.** Chạy lại `node work/qa-auto-stop.cjs` từ workspace cha, kết quả `work/qa-auto-stop-results.json`. Bỏ riêng cờ stopOnRevive khi farm ON trong lượt chết/hồi sinh, giữ nguyên lịch sử chết/native respawn và thời gian chờ. Mô phỏng 10 lần chết liên tiếp vẫn ON; hoạt động khi keepFarm tắt; V/F10 OFF trong lượt chết thứ ba vẫn OFF; di trú blocked từ bản cũ; không can thiệp cờ khi farm OFF. Giữ các ca click/phím nền, 30 phút đồng hồ giả, lease Tự hái, scene/page cleanup và giới hạn quyền. Ca game gốc không extension vẫn dừng ở lần thứ ba là bằng chứng đối chiếu, không phải hành vi extension mới. Không thêm timer chính sách hoặc sửa HP/combat/network. Browser/live gameplay **NOT RUN / UNVERIFIED**; lint/typecheck/full historical suite **NOT RUN**; CI **NOT CHECKED**. Các mô tả giữ giới hạn chết bên dưới là lịch sử trước yêu cầu mới, đã được thay thế.

**QA tự tắt Auto Farm, 2026-11-04: 27/27 PASS cục bộ.** Lệnh `node work/qa-auto-stop.cjs` từ workspace cha; kết quả `work/qa-auto-stop-results.json`. Trước sửa, hai ca mong muốn chặn click khi hidden/unfocused FAIL; native startClickOrder thực sự gọi tắt farm trong mô hình dùng đúng method nguồn. Sau thêm guard thực thi và input lease chung, hai ca PASS; click hợp lệ vẫn chạy native, Tự hái bật/tắt 10 vòng không chồng wrapper hoặc tháo guard còn dùng. Có kiểm tra V/F10 nền, repeat, OFF chủ động, 30 phút đồng hồ mô phỏng không tự OFF, native lần chết thứ ba/10 phút vẫn dừng, ON/OFF qua reload/nhân vật khác, cleanup, log 20 mốc, privacy/cầu nối và file/ID/permissions.

Nguồn thực thi chỉ là class Auto Farm và các method toggle/click trích từ code.txt cùng module extension liên quan, timer/DOM/host giả; không toàn bộ Phaser, OS input, socket hoặc game server. Không tái hiện trên phiên chơi thật; **nguyên nhân của mọi lần tự tắt người dùng báo vẫn UNVERIFIED**. Thêm chẩn đoán tạm 20 mốc theo tab, caller đã lọc và thời gian quan sát, không đoán native_game là user tắt hoặc tự ép khôi phục. blocking_dialog chỉ là dấu hiệu để đối chiếu; không tự xử lý hộp kiểm tra. **Local targeted QA: PASS 27/27. Browser/live E2E: NOT RUN. Lint/typecheck/full historical suite: NOT RUN. CI: NOT CHECKED.**

Tự vào bí cảnh/giữ farm: thêm nhóm riêng và prefs local; đọc cổng toàn map từ realm.events, chụp callback dialog native trong lời gọi đồng bộ để dùng điều kiện level/combat/cooldown của game, xác nhận đúng mục tiêu trước vào. Dùng native walk state riêng/dispatcher; nhường tay 3 giây, chờ kết thúc mục tiêu để không chọn quái mới liên tục. SessionStorage theo tab/nhân vật giữ ý định farm qua reload, không ghi OFF từ khởi tạo scene; dừng do chết nhiều lần hoặc OFF chủ động không tự khôi phục. Tự hồi sinh được chuẩn hóa luôn ON khi auto farm/hái/cổng đang hoạt động, dùng chung latch deathBtn. Đã đối chiếu source UI portal, leave(), native stop(), click-to-move và review diff; chưa chạy module game/đi cổng/hồi sinh. **Tests/lint/typecheck/browser/gameplay: NOT RUN; behavior/server: UNVERIFIED; CI: NOT CHECKED**. Không tự mở rương/thoát hoặc đổi bộ lọc boss; nguồn game/phạm vi runtime hiện tại chưa được kiểm chứng live.

Lọc khoảng level: thêm targetMode=range cùng targetMinLevel/targetMaxLevel qua popup → storage → bridge → MAIN → native host.enemies; điều kiện min ≤ enemy.lv ≤ max, loại quái thiếu level. Hai ô chỉ hiện khi chọn khoảng; chặn khoảng ngược/ô trống/số lẻ khi lưu, giữ nguyên các chế độ cũ và luồng OFF độc lập với draft. Không đổi damage/path/cooldown hoặc cơ chế hồi phục; chỉ review diff. **Tests/lint/typecheck/browser/gameplay: NOT RUN; behavior: UNVERIFIED; CI: NOT CHECKED**.

Báo cáo người dùng: sau khi tắt farm, đi ra xa để trang bị, bật V lại thì cờ BẬT nhưng đứng yên; di chuyển tay làm chạy tiếp. Source toggle giữ lastX/Y, stillSince, sideUntil, stuckCount, reachable và moved; native walk làm mới một số trạng thái khi đổi vị trí. Bổ sung khởi tạo navigation một lần khi V/phím tùy chỉnh thực sự chuyển OFF→ON, gỡ phiên hỗ trợ cũ trước toggle để không ghi đè tâm mới, bỏ khóa phiên mở rộng cũ, gọi discover ngay. Thêm lý do chờ thực tế trong Chi tiết Auto Farm. Chưa có trạng thái runtime lúc lỗi, nên chưa xác nhận nguyên nhân duy nhất hoặc toàn bộ trường hợp đã được sửa. **Tests/lint/typecheck/browser/gameplay: NOT RUN; behavior: UNVERIFIED; CI: NOT CHECKED**.

Hỗ trợ phong ấn bí cảnh: đọc x/y/hits từ self.realm.inside.seals, boss.hp; native autoHost chỉ trả quái nên trước đây không chọn phong ấn. Thêm tùy chọn tắt mặc định, dùng auto.walk trên state riêng và host.basic gốc giữ hướng, theo dõi hits giảm; bỏ mục tiêu khi 8 giây không giảm/15 giây không tới, không tự trừ hits. Một dispatcher update dùng chung với Tự hái để không lồng wrapper/tạo timer trùng. Đã review diff và đối chiếu source người dùng cho native walk/basic/ui; không chạy source game, mô phỏng, test hoặc gameplay. **Tests/lint/typecheck/browser/gameplay: NOT RUN; server nhận đòn và behavior: UNVERIFIED; CI: NOT CHECKED**. Chưa xác minh mọi class có thể phá bằng đánh thường. Đây không bao gồm các đề xuất khoảng level/tự tìm boss/khôi phục treo lâu.

File log người dùng gửi không ghi exception cầu nối, có các lượt harvest_ended/ready=false và MAIN build 4-revive hoạt động; đây chưa chứng minh nhận vật phẩm hoặc hết mọi lỗi. Bổ sung xác nhận theo lượt đã bắt đầu/kết thúc + cây hết ready + số lượng vật phẩm trong inv tăng, chờ cập nhật tối đa 1,5 giây và hiện kết quả 5 giây. Giới hạn: không phân biệt cùng vật phẩm đến từ nguồn khác, có thể thiếu xác nhận nếu tiêu thụ đồng thời hoặc cập nhật chậm. Thêm ba tooltip giải thích vùng và thu gọn log chỉ giữ lỗi/lượt chưa xác nhận. Chỉ review source/diff; **tests/lint/typecheck/browser/gameplay: NOT RUN; behavior: UNVERIFIED; CI: NOT CHECKED**.

Tự hồi sinh cho Tự hái: thêm tùy chọn riêng mặc định tắt; dùng chung checkRespawn/trạng thái yêu cầu với Auto Farm, giữ nút game và thời gian chờ gốc. Dọn lượt khi chết, giữ tâm cũ trong cùng scene và chờ 2 giây ổn định sau hồi sinh trước khi gắn lại. Không tự bật native Auto Farm hoặc quay map qua cổng. Đã đọc source nút deathBtn/onRespawn và native reviveTry; chỉ review diff, không kích hoạt chết/hồi sinh. **Tests/lint/typecheck/browser/gameplay: NOT RUN; behavior: UNVERIFIED; CI: NOT CHECKED**.

Hỗ trợ mở kho/bảng thông tin và gõ chat trong lúc Tự hái: bỏ chặn UI thông thường, chỉ nhường lệnh di chuyển/chiến đấu/tương tác tay; nhận nút chiêu qua wrapper useSkill. Giữ chặn hộp thoại tương tác, đổi phím và hộp kiểm tra người chơi. Đối chiếu source người dùng: move() chặn uiBlocked khi native Auto Farm tắt, interact() đóng kho trước khi xử lý node. Bản sửa dùng ngoại lệ uiBlocked chỉ trong native move rồi khôi phục bằng finally và dùng đúng nhánh native harvest khi kho mở. Chỉ đọc source/diff; **tests/lint/typecheck/browser/gameplay: NOT RUN; behavior: UNVERIFIED; CI: NOT CHECKED**. Log mới người dùng gửi xác nhận enabled/helper/config nhưng không có sự kiện từng lượt; controlling bật/tắt không tự chứng minh lỗi thu hoạch.

Người dùng đã xác nhận sau bản tách helper: nhân vật tự di chuyển và hái được; log cho thấy helper/normalize hiện diện ở cả world và cấu hình khớp. Bằng chứng này chỉ xác nhận luồng cơ bản, không xác nhận mọi cây. Báo cáo còn vài lượt fail chưa có sự kiện từng lượt trong log cũ. Bổ sung log start/request/ack/release và chờ cache mục tiêu tối đa 500 ms khi mục tiêu mới đúng cây; chưa tái hiện hoặc xác định nguyên nhân tất cả lượt fail. **Tests/lint/typecheck/browser/gameplay của agent: NOT RUN. Behavior bản sửa cache: UNVERIFIED. CI: NOT CHECKED.**

Log người dùng cung cấp đã xác nhận lỗi trước sửa: ISOLATED không có GSTHarvest/normalize/marker dù manifest khai báo helper; MAIN có helper object/normalize function; storage API tồn tại và timer=true. Đối chiếu mã Chromium cho thấy loại trừ file theo đường dẫn đã inject. Sửa manifest dùng bản helper sinh có đường dẫn MAIN riêng, giữ helper chuẩn làm nguồn duy nhất và đặt trước cầu nối ISOLATED. **Lỗi trước sửa: có bằng chứng log người dùng. Sau sửa: chưa có log runtime. Tests/lint/typecheck/browser/gameplay: NOT RUN. CI: NOT CHECKED.** Không dùng bằng chứng lỗi trước sửa để tuyên bố hành vi sau sửa đã PASS.

Log chẩn đoán HS-OPTIONS: thêm buffer tạm 60 dòng, trạng thái module/marker từng world, nhận diện manifest options ISOLATED, lỗi theo giai đoạn và sao chép/xóa/tắt log trong popup. Không chạy module game để thử, không lưu nội dung log ra storage hoặc gửi mạng. Chỉ review source/diff. **Tests/lint/typecheck/browser/gameplay: NOT RUN. CI: NOT CHECKED.** Đang chờ log thực tế để xác định vì sao normalize vắng ở cầu nối.

Sau báo cáo lỗi đọc cài đặt trong tab: popup gửi cấu hình đã đọc qua thông điệp nội bộ; không bắt buộc lần đọc storage thứ hai trong tab, chặn gửi mặc định trước khi popup tải xong, không gửi OFF khi khởi tạo lỗi và tách mã lỗi từng giai đoạn. Chỉ review source/diff. **Tests/lint/typecheck/browser/gameplay: NOT RUN. Behavior: UNVERIFIED. CI: NOT CHECKED.** Chưa có kết quả runtime sau bản sửa này.

Theo báo cáo Tự hái vẫn TẮT dù checkbox bật: đối chiếu lại storage khi hỏi trạng thái, nhận biết cầu nối cũ trong popup, cập nhật checkbox theo thay đổi storage, hiển thị cờ Tự hái thực tế trên overlay và bỏ tiêu đề overlay. **Tests/lint/typecheck/browser/gameplay: NOT RUN**, behavior **UNVERIFIED**, CI **NOT CHECKED**. Chưa khẳng định đã xử lý dứt điểm trường hợp live của người dùng.

Sửa đồng bộ Tự hái sau báo cáo checkbox bật nhưng trang báo tắt: xác nhận cấu hình MAIN, đối chiếu trạng thái, thử lại có giới hạn, không đặt lại lượt hái với cấu hình trùng, bảo vệ lệnh mới khỏi lỗi storage khởi tạo muộn. Chỉ review source/diff; **tests/lint/typecheck/browser/gameplay: NOT RUN**, behavior **UNVERIFIED**, CI **NOT CHECKED**. Chưa chứng minh xử lý dứt điểm trường hợp live được báo.

Bổ sung chẩn đoán Tự hái đứng yên: tách lý do chặn và đưa thông báo lên đầu nhóm popup. Chỉ review source/diff; **tests/lint/typecheck/browser/gameplay: NOT RUN**. Chưa xác định nguyên nhân báo cáo live nếu chưa có thông báo trạng thái từ tab của người dùng.

Tùy chọn Bỏ qua kiểm tra quái gần (mặc định tắt) đã triển khai. Chỉ review source/diff; **tests/lint/typecheck/browser/gameplay: NOT RUN**, behavior **UNVERIFIED**, CI **NOT CHECKED**. Không dùng QA lịch sử dưới đây để xác nhận tùy chọn này.

Tự hái cây (2026-11-04) đã triển khai module riêng, bộ lọc tìm/tick tên, phạm vi và quyền phối hợp với Auto Farm. Chỉ review source/diff và trạng thái Git. **Tests/lint/typecheck/smoke/browser/gameplay: NOT RUN. Behavior: UNVERIFIED. CI: NOT CHECKED.** Không dùng các kết quả QA lịch sử bên dưới để xác nhận tính năng Tự hái; chưa xác minh server cho hái khi bay, phản hồi bị từ chối hoặc ngắt bởi sát thương.

Bổ sung sau review 2026-11-04: đã sửa lệnh tắt không phụ thuộc bản nháp level/bán kính, giữ bộ lọc qua hồi sinh, phục hồi sau BFCache và nhường phím cho bộ chọn phím của game. Chỉ review source/diff; **tests/lint/typecheck/browser/gameplay: NOT RUN**, behavior **UNVERIFIED**, CI **NOT CHECKED**. Các kết quả bên dưới không xác minh bốn sửa đổi này.

Sau yêu cầu FIX, đã sửa nhận diện waypoint đi qua trong `page.js`. Kết quả hiện tại: **29 PASS, 0 FAIL**; `node --check` cho file sửa: **PASS**. Hai ca từng thất bại (2 / 20 FPS và 6 / 60 FPS) đều tới mục tiêu và gọi được callback đánh thường trong mô phỏng. Chưa xác nhận hành vi trên bản đồ/gameplay thật.

Bổ sung kiểm tra từ chối bỏ waypoint nếu đường kế tiếp bị chặn, thiếu hàm clear, mảng đường đã đổi, `fix` server đổi, override tắt hoặc là điểm cuối. Khi cho phép, chỉ bỏ một điểm đầu đã đi qua; không thay tốc độ, tọa độ, mục tiêu, cooldown hoặc va chạm.

Để kiểm tra điều kiện an toàn, route fixture được làm rõ: đoạn tới mục tiêu còn bị che bởi góc rẽ; đoạn tới điểm kế tiếp chỉ được báo thông sau khi đã qua góc trước. **Trước khi sửa source**, fixture này vẫn tái hiện đúng 20 PASS / 2 FAIL. **Sau khi sửa**, cả hai ca qua; bổ sung bảy ca bảo vệ đưa tổng số lên 29. Host clear/route là giả lập, không coi là kiểm chứng hệ thống va chạm thật.

Các phần dưới ghi lại kết quả QA ban đầu và giới hạn mô phỏng.

## Finding ban đầu: Medium — Chỉ cập nhật quyết định sớm hơn vẫn chưa ngăn vượt qua điểm rẽ

`page.js`, hàm `stabilizeApproach()`, chỉ đưa `auto.think` về 0 khi gần mục tiêu/waypoint. Trong lớp Auto Farm gốc, `walk()` chỉ bỏ qua waypoint khi khoảng cách nhỏ hơn 0.35. Nếu một bước di chuyển của khung hình đi từ bên này sang bên kia điểm rẽ mà cả hai đầu vẫn ngoài ngưỡng đó, nhân vật có thể tiếp tục đổi hướng mà không đi tiếp tới quái. Giảm thời gian chờ giữa các quyết định không làm nhỏ bước di chuyển của khung hình.

Đã tái hiện trong mô phỏng 8 giây, dùng chính lớp `lm` trích từ `code.txt`, ghép với extension hiện tại. Route giả lập có các điểm `(0.25, 0.25)`, `(0.25, 5.25)`, rồi tới mục tiêu `(8.123, 5)`; `host.clear()` trả false để đi qua route. Hai ca không gọi được đánh thường:

| Tốc độ | FPS mô phỏng | Kết quả |
|---|---:|---|
| 2 | 20 | FAIL — không gọi basic(), đi qua lại gần điểm rẽ |
| 6 | 60 | FAIL — không gọi basic(), không tới được quái |
| 2 | 60 | PASS — tới mục tiêu và gọi basic() |

Đây là mô phỏng route được cung cấp sẵn, **không chạy thuật toán route trên bản đồ thật**, không mô phỏng toàn bộ va chạm, server correction, skill hoặc kết nối. Kết quả chứng minh giới hạn của cách sửa trong mô hình này; chưa chứng minh chính hai điều kiện đó gây lỗi trong phiên chơi người dùng.

Finding đã được xử lý trong phạm vi mô phỏng như kết luận ở trên; vẫn cần kiểm chứng trên bản đồ thật, không coi kết quả cục bộ là đủ để kết luận gameplay ổn định.

## Phần đã qua kiểm tra cục bộ

- Manifest V3, quyền storage, phạm vi website; file khai báo tồn tại; các ID popup được JavaScript tham chiếu có trong HTML và không bị trùng.
- Tắt override khôi phục tốc độ đã quan sát, không làm thay đổi snapshot nguồn; dọn timer/listener.
- Độ trễ chuyển đi bộ/bay và bộ đếm Fix tương đối.
- Bộ lọc level đi tới Auto Farm gốc, giữ danh sách mối đe dọa lúc nghỉ hồi máu; gỡ wrapper khi chuyển lại Tất cả.
- Phím tùy chỉnh không bật/tắt khi mất focus, đang nhập hoặc giữ phím lặp; gọi thao tác gốc một lần khi hợp lệ.
- Tự hồi sinh chờ nút sẵn sàng, bấm một lần mỗi đợt chết; không tự bật Auto Farm.
- Dọn listener khi chết/tắt tính năng.
- 12 ca đường thẳng: tốc độ 2 / 3.5 / 5 / 6 tại 60 / 30 / 20 FPS đều gọi được basic() với bản sửa. Những lần gọi này là callback mô phỏng, không phải bằng chứng có damage hay đánh thành công trên server.

## Phạm vi và trạng thái

Harness dùng Node VM, timer giả lập và lớp Auto Farm từ source người dùng cung cấp; không đăng nhập, không gọi API game, không thực thi toàn bộ bundle hoặc mở gameplay. Chỉ source extension và mã lớp Auto Farm được thực thi trong môi trường cục bộ với các host giả lập.

- Local syntax/logic: đã chạy, kết quả như trên.
- Browser/UI QA: **NOT RUN**.
- Live gameplay/E2E, tab nền, hồi sinh trên server: **NOT RUN / UNVERIFIED**.
- CI: **NOT CHECKED**.
- Git trong lượt QA: lúc đó thư mục chưa thuộc repository; không commit/push trong lượt QA. Việc tạo repo private và phát hành source được thực hiện ở bước bàn giao sau, theo yêu cầu riêng của người dùng.
- Changes to extension: sửa `page.js` và cập nhật README theo yêu cầu FIX. Harness/kết quả nằm trong `work/`, báo cáo nằm trong `outputs/`. Không chạy thêm gameplay/live API.
