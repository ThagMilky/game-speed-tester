# Game Speed Tester

**Người dùng không biết code:** mở [HUONG-DAN.html](HUONG-DAN.html) hoặc [BAT-DAU.txt](BAT-DAU.txt). Giải nén ZIP, cài bằng Load unpacked; không cần build, Node hoặc tài khoản GitHub.

Chrome Extension Manifest V3 phục vụ kiểm thử anti-cheat có sự cho phép, chỉ trên `https://nghichthienky.online/*`. Mặc định **tắt**; tốc độ **đi bộ 3.5**, **bay 2**; mỗi giá trị điều chỉnh trong **1.0–6.0**.

Cập nhật 2026-11-04: bộ lọc ≤ / ≥ / boss và áp dụng tốc độ trước bước di chuyển đã triển khai. Tests/lint/typecheck/browser/gameplay cho các thay đổi này: **NOT RUN**; behavior: **UNVERIFIED**; CI: **NOT CHECKED**. Kết quả 29/29 bên dưới là QA lịch sử trước các thay đổi này, xem [QA-report.md](QA-report.md).

## Cấu trúc

```text
game-speed-tester/
  manifest.json   Quyền storage và hai content script giới hạn đúng website
  content.js     Đọc cài đặt, thêm timer, cầu nối popup và bảng trạng thái trên game
  font-options.js Danh sách 10 font và quy tắc tùy chọn dùng chung
  font.js        Bật/tắt và áp dụng font giao diện web sau 1 giây
  farm-page.js   Mở rộng tâm tìm kiếm của Auto Farm có sẵn, chạy trong MAIN world
  farm-content.js Storage và cầu nối riêng cho tùy chọn/trạng thái Auto Farm
  page.js        Truy cập Phaser, tách snapshot dùng cho scene rồi chỉnh ms
  popup.html     Giao diện
  popup.css      Định dạng giao diện
  popup.js       Lưu tùy chọn và đọc trạng thái tab đang mở
  README.md
```

## Cài đặt

1. Dùng Chrome 111 trở lên. Mở `chrome://extensions`.
2. Bật **Developer mode**.
3. Chọn **Load unpacked**, rồi chọn thư mục `game-speed-tester` chứa `manifest.json` này.
4. Mở trang game. Nếu trang đã mở trước khi cài hoặc cập nhật extension, tải lại trang một lần.
5. Mở extension từ biểu tượng Extensions; có thể ghim để truy cập nhanh.

Không cần build, npm, backend hoặc dependency.

## Bố cục popup

Đầu popup có bốn chỉ số: Auto Farm thật của game, trạng thái di chuyển, tốc độ hiện tại và Fix. Bên dưới là bốn nhóm bấm để mở/thu gọn: **Auto Farm** (mở sẵn, gồm bán kính/hồi sinh/phím tắt), **Tốc độ di chuyển**, **Bảng trạng thái**, **Font chữ**. Các thông báo kỹ thuật nằm trong mục chi tiết; lỗi lưu cài đặt vẫn có thông báo riêng. Checkbox hiển thị/font/hồi sinh và phím tắt vẫn tự lưu; nhập bán kính/tốc độ vẫn dùng nút Lưu hoặc Enter như trước. Popup dùng nhãn tiếng Việt, bố cục hai cột cho số liệu/ô tốc độ, hỗ trợ giao diện sáng/tối theo hệ thống. Cài đặt và hành vi game giữ nguyên; chưa chạy kiểm tra giao diện trên trình duyệt thực tế.

## Tiếp cận mục tiêu khi đang tăng tốc

Mã game cung cấp đặt nhịp quyết định Auto Farm gốc `em = .2` giây (`code.txt` 14929, 15057–15059). Khi dùng override tốc độ cao, nhân vật có thể vượt qua tầm đánh/điểm rẽ trong thời gian giữa hai quyết định, dẫn tới đổi hướng qua lại. Đây là nguyên nhân khả dĩ được xác định từ source và thông tin người dùng đang bật tăng tốc; chưa xác nhận là nguyên nhân duy nhất trong gameplay.

Khi tốc độ hiện tại đúng là giá trị extension vừa tăng trên bản sao của nhân vật, `page.js` gắn một listener `preupdate` để đọc khoảng cách tới mục tiêu/điểm đường đi hiện có. Chỉ khi Auto Farm đang điều khiển di chuyển và gần những điểm này, cho `auto.think` về 0 để Auto Farm gốc sớm quyết định lại. Khi đứng đánh, nghỉ hồi máu, thao tác kỹ năng/UI, di chuyển tay hoặc chưa tăng tốc so với giá trị game, không điều chỉnh nhịp này. Không đổi mục tiêu, tâm farm, tọa độ, mức tốc độ cấu hình, attack speed hoặc cooldown; không gọi đánh thường/skill thay game. Có thể tăng số lần game cân nhắc quyết định trong những khung hình gần mục tiêu, nhưng kỹ năng/đánh vẫn phải qua điều kiện và cooldown gốc. Không thêm timer; tắt override, rời trang hoặc kết thúc scene sẽ tháo listener.

Bản sửa tiếp theo xử lý waypoint đã đi qua: lưu vị trí từ lượt cập nhật trước và kiểm tra đoạn di chuyển có đi xuyên qua vùng nhận diện 0.35 quanh waypoint hay không. Chỉ bỏ **một waypoint đầu** khi vẫn cùng mảng đường đi/điểm đầu, `fix` gốc có số và không thay đổi, còn điểm tiếp theo, và `autoHost().clear()` xác nhận đoạn từ vị trí hiện tại tới điểm tiếp theo thông. Không bỏ điểm cuối, không sửa tọa độ, không nới va chạm, không đổi toàn bộ đường hoặc bỏ mục tiêu. Nếu điều kiện không đủ thì giữ nguyên đường để game xử lý. Dữ liệu vị trí trước được xóa khi tháo listener. QA cục bộ dùng lớp Auto Farm gốc đã qua **29/29 ca**, gồm hai ca từng lỗi (tốc độ 2 / 20 FPS, tốc độ 6 / 60 FPS) và các ca chặn bỏ waypoint không an toàn. Route/kiểm tra clear trong harness là giả lập, chưa phải bản đồ/gameplay thật.

Không bảo đảm xử lý được việc server sửa vị trí liên tục, đường đi không đến được, hết linh lực, đang rút lui hồi máu hoặc không có quái đúng level. Đặc biệt mức 5–6 chưa có bằng chứng ổn định trên server. Kiểm tra cú pháp file sửa và harness cục bộ: **PASS**. Browser/gameplay: **NOT RUN / UNVERIFIED**.

## Extended Auto Farm Range

### Lọc level quái

Trong nhóm **Auto Farm → Quái muốn farm**, chọn **Tất cả quái** (mặc định), **Level ≤ mức chọn**, **Level ≥ mức chọn**, hoặc **Chỉ boss**. Hai chế độ level cần số nguyên dương: ≤ 10 gồm level 10 trở xuống, ≥ 10 gồm level 10 trở lên, kể cả boss khớp level. Chỉ boss gồm boss thường và boss thế giới, bỏ qua ô level. Nhấn **Lưu lựa chọn quái** hoặc Enter trong ô level; nút Lưu bán kính cũng lưu toàn bộ tùy chọn farm đang nhập. Cài đặt lưu trong `farmPreferences.targetMode/targetLevel`, giữ qua đổi map. Chế độ `level` cũ được đọc thành `maxLevel` (≤ mức đã lưu); các chế độ mới là `all`, `maxLevel`, `minLevel`, `boss`. Các tùy chọn khác giữ nguyên.

Bộ lọc hoạt động độc lập với mở rộng bán kính: tắt mở rộng vẫn lọc trong vùng gốc 11 ô. Chỉ farm khi Auto Farm game đang bật; không tự bật phím V/phím tùy chỉnh. Khi chỉ bật lọc level, extension không tự bật bay hoặc dịch tâm; các thao tác đó vẫn thuộc phần mở rộng bán kính.

Đối chiếu source `code.txt`, host cung cấp `enemy.lv`, `enemy.cls` và `enemy.wb`; game đặt `cls: "boss"` cho boss thế giới. Extension bọc riêng `scene.autoHost()` để giữ nguyên các chức năng và lọc `enemies()` khi game lựa chọn mục tiêu; cả Auto Farm gốc và phần mở rộng cùng nhận danh sách phù hợp. Chỉ boss khớp `cls === "boss"` hoặc `wb === true`. Không đoán level/boss từ tên hoặc HP; quái thiếu level hợp lệ bị loại trong hai chế độ level. Khi game đang nghỉ hồi máu (`auto.resting`), trả danh sách mối đe dọa đầy đủ để cơ chế rút lui vẫn nhận ra quái ngoài bộ lọc, không dùng việc đó để chọn mục tiêu farm.

Đổi level đặt lại nhịp chọn mục tiêu `think` để game tự bỏ mục tiêu không còn khớp ở lượt xử lý kế tiếp; không hủy ngược kỹ năng đã được game phát hoặc đang chờ thực thi. Không có quái khớp thì game chờ/nhặt loot/quay về theo hành vi gốc; phần mở rộng cũng trả tâm về khi phù hợp. Chọn Tất cả sẽ gỡ wrapper, khôi phục descriptor/hàm gốc nếu vẫn do extension sở hữu. Dừng phiên, chết, mất kết nối hoặc rời trang cũng gỡ wrapper; khi đang chờ bật Auto Farm có thể cài lại wrapper nhưng chưa lọc khi `auto.on` tắt. Không sửa level, HP, damage, packet hoặc tạo bộ chiến đấu mới.

Bộ lọc giới hạn mục tiêu Auto Farm lựa chọn, không sửa vùng tác động của kỹ năng: đòn đánh lan vẫn có thể trúng quái ngoài bộ lọc. Quái phù hợp vẫn phải qua điều kiện chọn mục tiêu, đường đi và chiến đấu gốc; chế độ boss không ép game chọn boss bị cơ chế gốc loại bỏ hoặc chưa được server cung cấp.

Nguồn/interface đã đối chiếu tĩnh và có kiểm tra khi cài wrapper. Việc bắt đầu lọc phụ thuộc phát hiện scene (watcher khoảng 1 giây), không bảo đảm hủy các hành động game đã chọn trước khi wrapper được gắn. Bộ lọc khoảng level/boss mới: **Tests/lint/typecheck/browser/gameplay: NOT RUN. Behavior: UNVERIFIED.** Kết quả harness bộ lọc chính xác cũ không xác minh các chế độ mới.

### Phím Auto Farm tùy chỉnh

Trong popup, chọn **Đặt phím**, sau đó bấm phím muốn dùng. Hỗ trợ một chữ A–Z, số 0–9 hoặc F1–F10 trừ F5, không kèm Ctrl/Alt/Shift/Meta; Esc hủy. Gợi ý **F6**. Lưu riêng ở `farmShortcut`, giữ qua tải lại/đổi map, áp dụng cho các tab game. Nếu cần, URL được thêm `timer` và tải lại một lần để truy cập scene; không bỏ tham số khác.

Khi có phím tùy chỉnh, phím bật Auto Farm gốc của game (thường V) bị chặn; phím mới gọi đúng `scene.toggleAutoFarm()` một lần mỗi lần bấm hợp lệ. Không sửa `auto.on`, không tạo Auto Farm riêng và không cần tự xóa binding V trong game. Nhấn **Dùng phím gốc** để bỏ tùy chỉnh và dùng binding game hiện có. Khi truy cập được scene, cả phím gốc lẫn phím tùy chỉnh đều gọi trực tiếp hàm này sau khi kiểm tra focus, thay vì chuyển sự kiện xuống hàng đợi phím Phaser. Nếu chưa truy cập được scene và không đặt phím tùy chỉnh, phím gốc vẫn được game xử lý khi trang có focus. Những chỗ ghi V trong hướng dẫn này được hiểu là phím Auto Farm mới nếu đã tùy chỉnh. Nhãn/hướng dẫn phím do chính game vẽ có thể vẫn ghi V vì extension không sửa bảng binding của game.

Chỉ xử lý phím trong trang game đang hiển thị và có focus, không trong ô nhập liệu/chat, composition hoặc key repeat. Phím trùng binding của hành động khác sẽ không bật/tắt Auto Farm và popup báo chọn phím khác; hãy tránh các phím game đang dùng. Nút Auto Farm trên giao diện game vẫn hoạt động. Không có phím tắt toàn hệ thống; chưa chứng minh hoặc sửa tận gốc hiện tượng được báo khi gõ trong ứng dụng khác. Hiển thị/phím tắt thực tế: **UNVERIFIED**, chưa chạy browser/gameplay test.

- Trong popup, bật **Mở rộng vùng Auto Farm**, nhập bán kính rồi chọn **Lưu bán kính** hoặc Enter. Mặc định tính năng tắt, bán kính **22 đơn vị game**, cho phép **11–100**. Phạm vi website/quyền vẫn như trước. Cài đặt được lưu riêng ở `farmPreferences`, không thay tùy chọn tốc độ, font hoặc bảng trạng thái.
- Dùng **V của game** để bật/tắt Auto Farm như bình thường. Extension không bật Auto Farm thay người dùng và không tạo một hệ thống chiến đấu khác. Khi bật tính năng trên URL thiếu `timer`, trang tải lại một lần để game công khai `window.game`; giữ query/fragment hiện có.
- Bảo vệ phím Auto Farm: listener `keydown` cài từ `document_start` trước listener Phaser, theo mã phím `scene.controls.bindings.V` (dự phòng V nếu scene chưa sẵn sàng). Chặn sự kiện đến game khi trang bị ẩn/mất focus, đang nhập trong input/textarea/select/contenteditable/textbox, đang composition, giữ phím lặp hoặc dùng Ctrl/Alt/Meta. Đọc cả activeElement và composedPath để nhận diện ô nhập. Chỉ gọi `preventDefault` khi nhận phím Auto Farm hợp lệ để xử lý trực tiếp; sự kiện bị bỏ qua vẫn giữ hành vi nhập liệu mặc định. Không tạo phím tắt toàn hệ thống, không tự bật lại Auto Farm. Listener được tháo khi rời trang và gắn lại khi quay về; hoạt động độc lập với checkbox mở rộng phạm vi. Các thao tác thông thường từ nút Auto Farm của game vẫn giữ nguyên. Đây là lớp bảo vệ cho sự kiện **được gửi tới trang game**; chưa chứng minh game thật sự nhận được phím từ tab/ứng dụng khác. Thay đổi xử lý phím gốc lần này: tests/browser/gameplay **NOT RUN**, hiệu quả với lỗi được báo **UNVERIFIED**; kết quả QA cũ không xác minh thay đổi này.
- Popup có checkbox **Tự bấm hồi sinh khi nút sẵn sàng** (mặc định tắt, tự lưu). Tùy chọn này hoạt động độc lập với mở rộng bán kính và speed override. Khi bật trên URL thiếu `timer`, trang cũng cần tải lại một lần. Chỉ bấm `scene.hud.deathBtn` của game khi nhân vật đang chết, scene hoạt động, kết nối hợp lệ, nút hiện và không bị disabled. Nút của game gọi action respawn gốc (`code.txt` dòng 12426, 19672 và 12797–12807), không sửa HP, đồng hồ hồi sinh hoặc packet.
- Game có sẵn yêu cầu hồi sinh của Auto Farm sau khoảng 5,3 giây, thử lại cách 2 giây (`code.txt` 15025–15035). Extension không bấm trùng khi `auto.reviveTry` còn đang chờ. Khi đến lượt extension, chỉ bấm một lần trong mỗi đợt chết rồi chờ xác nhận; nếu game từ chối/mất phản hồi thì người dùng có thể bấm lại bằng tay, không tự spam. Tắt tùy chọn ngừng các lần bấm mới, không hủy yêu cầu game đã nhận. Đóng tab/rời trang dọn watcher; bật riêng tự hồi sinh có tối đa một watcher 1 giây, không bật lại V thay người dùng.
- Popup và bảng góc phải dưới có trạng thái **Auto Farm của game: BẬT/TẮT/CHƯA RÕ**, đọc trực tiếp `scene.auto.on`; không lấy checkbox mở rộng làm trạng thái Auto Farm. Có thể chọn ẩn/hiện mục này qua checkbox riêng. Khi mục đang hiện, dùng một timer **chỉ đọc trạng thái mỗi giây**, kể cả lúc speed override và mở rộng bán kính tắt; ẩn bảng/bỏ chọn mục/rời trang sẽ dừng timer này.
- Game có quy tắc tự tắt Auto Farm sau **3 lần chết trong 10 phút** (`code.txt` 14934, 15030–15044). Extension giữ nguyên quy tắc đó, không sửa `deaths`/`stopOnRevive` và không tự bật V. Nếu đã quan sát cờ chết nhiều lần rồi thấy `auto.on` tắt, popup báo rõ thông tin đó. Sau hồi sinh, chỉ tiếp tục phạm vi mở rộng và kiểm tra bay nếu Auto Farm gốc còn bật; trạng thái BẬT/TẮT giúp phân biệt game tự dừng với việc chờ bay hoặc chờ hồi sinh.
- Khi phần mở rộng đang bật và Auto Farm V đang hoạt động: nếu `scene.self.fly` đã bật thì không gửi thao tác bay, tiếp tục xử lý phạm vi farm. Nếu chưa bay, sau 1 giây quan sát trạng thái sẵn sàng sẽ gọi **`scene.act("fly")` một lần**, cùng thao tác game gán cho R (`code.txt`, dòng 19717 và 20031). Chờ game xác nhận `self.fly`; không sửa trực tiếp `fly`, không giả phím hoặc chỉnh packet. Trong lúc chờ, Auto Farm gốc vẫn hoạt động, chỉ tạm dừng dịch tâm mở rộng.
- Không gửi lại toggle khi chưa xác nhận, vì gửi lặp có thể làm hạ xuống. Nếu sau 8 giây vẫn chưa bay thì popup báo kiểm tra điều kiện game hoặc dùng R; không tự gửi liên tục. Sau khi đã quan sát được đang bay, nếu về sau game hạ xuống thì một đợt mới có thể yêu cầu bật lại. Không yêu cầu bay khi đang nghỉ/hồi máu, thao tác UI/kỹ năng, chết, mất kết nối hoặc rời scene. Không tự hạ xuống khi tắt V/phần mở rộng. Game/server quyết định có cho phép bay hay không; việc này chưa được kiểm chứng live.
- Khi nhận diện phiên Auto Farm đang bật, lưu `auto.ax/ay` làm tâm farm gốc. Nếu mục tiêu hiện tại vẫn hợp lệ thì giữ mục tiêu đó. Nếu vùng tìm kiếm hiện tại có mục tiêu mà bộ chọn gốc tiếp cận được, không dịch tâm để tranh quyền chọn mục tiêu.
- Khi vùng hiện tại không có mục tiêu phù hợp, xét quái còn sống, hostile, trong bán kính cấu hình tính từ tâm gốc, không nằm trong danh sách bỏ qua đang hiệu lực. Tìm quái gần người chơi nhất mà `auto.pick()` của game chấp nhận. Bộ chọn này dùng `auto.reachable`, `auto.skipped`, `host.clear()` và `host.route()`, bao gồm thời gian bỏ qua mục tiêu không đến được. Mỗi lượt chỉ thử tối đa bốn ứng viên ngoài vùng hiện tại; các lượt sau tiếp tục khi game đã đánh dấu bỏ qua các ứng viên không phù hợp.
- Dịch `auto.ax/ay` về phía quái vừa tìm được, giữ toàn bộ vòng tìm kiếm gốc bán kính 11 bên trong vòng mở rộng. Đặt lại `auto.think` khi tâm thực sự thay đổi để game tự cân nhắc vùng mới. Phần tìm mục tiêu không gán mục tiêu, không sửa `auto.path`, không gọi hàm đánh, dùng kỹ năng, hồi máu, nhặt đồ hay gửi lệnh mạng; chỉ thao tác hỗ trợ bay gọi action gốc như đã nêu. Chiến đấu, va chạm và tìm đường vẫn do Auto Farm gốc xử lý. Skill/pill cooldown không bị thay đổi hoặc bỏ qua.
- Cho game xử lý loot quanh tâm hiện tại trước khi mở vùng khác. Khi không còn quái phù hợp, trả tâm về gốc để `idle()` của game tự nhặt loot và đi về; việc quay về vẫn phụ thuộc đường đi hợp lệ của game. Tạm ngừng dịch tâm khi Auto Farm đang nghỉ/hồi máu, người chơi tự di chuyển, mở UI hoặc dùng kỹ năng. Nếu người dùng tự đổi tâm theo điều khiển gốc, chấp nhận tâm mới thay vì kéo lại tâm cũ.
- Tắt tính năng sẽ tháo listener scene, dừng watcher và khôi phục tâm gốc một lần nếu tâm hiện tại vẫn do extension sở hữu. Không ghi đè tâm mới do thao tác người dùng/game đặt lại. Không thay `auto.on`, vì vậy Auto Farm gốc tiếp tục hoạt động với bán kính gốc. V tắt sẽ dừng phiên mở rộng; bật V lại có thể tạo phiên mới.
- Khi chết: dừng phiên mở rộng, tháo listener và khôi phục tâm còn sở hữu; watcher chờ hồi sinh và chỉ bấm nút sẵn sàng nếu tùy chọn tự hồi sinh đã bật. Sau khi game xác nhận sống lại và Auto Farm gốc xử lý xong trạng thái chết, chờ **2 giây** rồi tiếp tục nếu `auto.on` vẫn bật. Phiên mới kiểm tra bay lại: đã bay thì bỏ qua; chưa bay thì yêu cầu bật một lần theo cơ chế chờ 1 giây nêu trên. Nếu Auto Farm gốc tự tắt do chết nhiều lần hoặc người dùng tắt V/phần mở rộng, không tự bật lại. Không thay đổi giới hạn chết hoặc thời gian chờ hồi sinh của game.
- Khi driver mất kết nối/đang reconnect, rời scene hoặc interface không hợp lệ: dừng phiên và không tự tiếp tục trên cùng instance. Sau khi kết nối lại vẫn cần **V tắt rồi V bật**. Đổi map tạo scene mới cần bật Auto Farm bằng điều khiển game như thông thường. Cơ chế tiếp tục sau hồi sinh chỉ áp dụng khi còn cùng scene/instance và kết nối vẫn hợp lệ.
- Khi mở rộng hoặc tự hồi sinh bật nhưng đang chờ Auto Farm/scene, dùng một watcher mỗi giây. Khi đã gắn scene, dừng watcher và dùng event `preupdate` có giới hạn xử lý mỗi 500 ms. Không tạo timer theo từng quái; khi tắt cả hai tùy chọn hoặc rời trang không còn watcher/listener scene của các thao tác tự động này. Timer chỉ đọc của bảng trạng thái là riêng và phụ thuộc mục Auto Farm đang được hiển thị. Popup đọc thông báo riêng trong **Extended Auto Farm Range**, không phụ thuộc timer speed override.

### Nguồn và giới hạn xác minh

Đã đối chiếu mã người dùng cung cấp: `code.txt` có `za = 11` (dòng 14927), `lm.update/pick/idle/walk` (15022–15234), `autoHost()` (22362–22471). Mỗi phiên chạy có kiểm tra kiểu/trường của `scene.auto`, event scene, driver và host trước khi sử dụng; nếu không tương thích thì dừng, không tự đoán đường dẫn khác. Ưu tiên scene `world` qua `window.game`; chỉ dùng `window.__ntkScene` khi có key scene `world`.

**Chưa trực tiếp kiểm chứng interface trong phiên game live hiện tại; runtime/behavior: UNVERIFIED.** Chỉ thấy các quái được game cung cấp qua `autoHost().enemies()`; mở rộng bán kính không khiến server gửi thêm quái ngoài vùng đang hiển thị/stream. Kiểm tra trạng thái theo nhịp 500 ms có thể trễ và bỏ lỡ thay đổi quá nhanh; tab nền có thể bị hạn chế nhịp. Không bảo đảm farm ổn định ở mọi bản đồ hoặc khi game cập nhật module. Các tính năng speed override cũ vẫn độc lập; phần mở rộng Auto Farm không đọc/sửa `ms`, damage, attack speed hoặc cooldown.

Các giới hạn gốc vẫn tồn tại: game có thể ưu tiên quái đang tấn công sát người chơi ngoài vòng tìm kiếm; extension không chặn cơ chế tự vệ đó. Sau khi phiên mở rộng dừng vì mất kết nối, nên để V ở trạng thái tắt ít nhất một lượt watcher (khoảng 1 giây ở tab hoạt động) trước khi bật lại để nhận diện phiên mới. Sau hồi sinh bình thường không cần thao tác này nếu Auto Farm gốc vẫn bật; thời gian chờ có thể dài hơn ở tab nền.

Đã chạy harness cục bộ theo yêu cầu QA: **29/29 PASS** sau bản sửa waypoint. Lint, typecheck, browser smoke tests và live gameplay tests: **NOT RUN**. CI: **NOT CHECKED**. Không coi harness/source/diff là bằng chứng gameplay.

## Font giao diện web

Trong popup, mục **Font giao diện web** có checkbox **Đổi font web** và danh sách 10 font: Times New Roman, Arial, Calibri, Segoe UI, Verdana, Tahoma, Georgia, Cambria, Consolas, Courier New. Mặc định bật với **Times New Roman**, giữ cách hiển thị của bản trước. Chọn font hoặc bật/tắt sẽ tự lưu vào `chrome.storage.local`, độc lập với tùy chọn tốc độ và hiển thị bảng trạng thái.

Sau khi DOM sẵn sàng hoặc quay về trang từ bộ nhớ điều hướng, chờ **1 giây** rồi áp dụng một stylesheet duy nhất. Đổi font liên tiếp sẽ hủy lượt chờ cũ và tính lại từ lựa chọn cuối cùng; chỉ dùng tối đa một timeout. **Tắt Đổi font web sẽ hủy lượt chờ và gỡ stylesheet ngay**, trả lại font hiện tại do game quy định, không cần tải lại trang. Bật lại dùng font đã chọn. Đổi map tải trang mới sẽ tự đọc lại lựa chọn; nếu rời trang trước khi hết thời gian chờ thì hủy timer. Các phần tử HTML tạo thêm tự nhận quy tắc CSS, không quét DOM, không polling và không ghi stylesheet lặp lại. Các tab game khác nhận tùy chọn qua storage.

Chỉ dùng font có sẵn trên máy, mỗi lựa chọn có font dự phòng nếu máy thiếu font, không tải font từ mạng. Font áp dụng chỉ trên website game, kể cả khi speed override tắt. Không thêm thông tin font vào bảng trạng thái; bảng trạng thái và chữ của popup vẫn dùng font riêng. CSS thay biến `--ui-font` của game và font-family các phần tử HTML; **không đổi chữ đã vẽ trong canvas Phaser, chữ trong ảnh hoặc nội dung shadow DOM riêng của game**. Sau khi cập nhật extension, Reload extension rồi tải lại tab game một lần để bỏ stylesheet/script bản cũ. Khi gỡ extension cũng cần tải lại tab để bỏ CSS còn trong tab. Chưa kiểm chứng hiển thị thực tế trên trình duyệt.

## Sử dụng

- Nhập riêng **Walking speed** (mặc định 3.5) và **Flying speed** (mặc định 2), mỗi ô từ **1.0 đến 6.0**; chọn **Save speeds** hoặc Enter. Đây là giá trị gán trực tiếp vào `self.ms`, không phải hệ số nhân. Có thể nhập 5 hoặc 6 để tự kiểm tra độ ổn định; chưa có kết quả kiểm thử các mức này.
- Khi bật lần đầu hoặc có người chơi sau khoảng chờ, extension áp dụng ngay tốc độ của trạng thái hiện tại. Sau đó, trạng thái mới phải giữ liên tục **1 giây** qua các lần quan sát mới đổi tốc độ. Trong thời gian chờ vẫn dùng tốc độ của trạng thái đã chấp nhận; đổi trở lại trước khi đủ thời gian sẽ hủy lượt chờ. Bộ đếm không bị đặt lại chỉ vì game thay đối tượng `self` trong snapshot. Quan sát bằng `preupdate` khi scene hoạt động; thời gian thực tế còn phụ thuộc nhịp game và giới hạn tab nền của Chrome.
- Bảng hiển thị trạng thái bay/đi bộ thật ngay khi đọc được, kèm thông báo đang chờ đủ 1 giây khi tốc độ chưa đổi. Chỉnh tốc độ bằng popup được áp dụng ngay cho trạng thái đã chấp nhận, không thêm thời gian chờ hoặc timer.
- Khi nâng cấp từ bản chỉ có một ô tốc độ, giá trị chung cũ không được dùng cho hai trạng thái: mặc định mới là đi bộ 3.5, bay 2; giữ tùy chọn bật/tắt đã lưu. Nhấn **Save speeds** để lưu hai giá trị mới. Những lần sau sẽ dùng lại tốc độ riêng đã lưu. Nếu trước đây đã lưu tốc độ đi bộ 4, giá trị đã lưu được giữ; nhập 3.5 rồi lưu để áp dụng mức mới.
- Bật **Enable speed override** để bắt đầu. Thao tác bật/tắt lưu ngay cả tốc độ đang nhập hợp lệ.
- Lần bật trên URL chưa có tham số `timer`, extension dùng `location.replace` để tải lại cùng địa chỉ với tham số này. Việc tải lại có thể làm gián đoạn hoạt động đang diễn ra.
- Đọc **Current speed**, **Movement state** và **Fix since speed change**. `Fix` hiển thị là bộ đếm tương đối của extension, bắt đầu ở **1** mỗi khi bắt đầu áp dụng một tốc độ khác. Nếu giá trị gốc `self.fix` tăng thêm N, số hiển thị tăng thêm N. Ví dụ: vừa đổi tốc độ là 1, server sửa thêm một lần là 2. Chỉ chỉnh tốc độ của trạng thái chưa áp dụng hoặc game ghi lại cùng tốc độ không làm reset. Khi đang chờ đổi trạng thái 1 giây, bộ đếm chưa reset; chỉ reset khi tốc độ mới được áp dụng. Khi tắt override hoặc dữ liệu gốc không có/chưa phải số thì hiển thị `—`.
- Bảng nhỏ kiểu bộ đếm FPS ở **góc phải dưới màn hình game** hiển thị bật/tắt override, tốc độ, bay/đi bộ, `fix` và thông báo. Bảng không đo FPS và không chặn thao tác chuột. Khi bật, bảng nhận cập nhật từ interval 500 ms sẵn có, không cần mở popup hay thêm timer. Chỉ thay nội dung bảng khi thông tin thay đổi.
- Trong popup, **Show status panel** bật/tắt riêng bảng trạng thái. Các checkbox bên dưới chọn từng mục muốn hiện: bật/tắt override, tốc độ, bay/đi bộ, `fix`, thông báo. Lựa chọn lưu ngay, độc lập với tốc độ, áp dụng cho mọi tab game và giữ qua đổi map/tải lại. Bỏ chọn tất cả mục cũng ẩn bảng. Mặc định hiện bảng với tất cả mục. Tắt bảng không tắt speed override; không thêm thông tin font vào bảng.
- Popup gửi thêm lệnh áp dụng hiển thị trực tiếp tới content script của tab đang mở và nhận xác nhận, kể cả khi override tắt và không còn timer game. Các tab khác nhận thay đổi qua storage. Nếu tab chưa có script bản mới hoặc không nhận được xác nhận, popup báo đã lưu lựa chọn và cần tải lại tab; không báo là đã áp dụng thành công. Lệnh hiển thị không đi qua Phaser, không ghi tốc độ và không bật lại override.
- Khi tắt, bảng nhận trạng thái cuối rồi tạm dừng cập nhật tự động; mở popup vẫn có thể làm mới số liệu đọc. Bảng được gỡ khi rời trang và tạo lại khi quay về. Bảng có thể không hiện khi game dùng chế độ toàn màn hình riêng cho canvas.
- Tắt **Enable speed override** để dừng bộ theo dõi và trả quyền điều khiển tốc độ cho game. Extension khôi phục tốc độ gốc đã quan sát **một lần**, chỉ khi đúng đối tượng người chơi hiện tại vẫn giữ giá trị extension đã ghi và trạng thái bay/đi bộ khớp lúc đọc tốc độ gốc. Nếu game đã đổi tốc độ, extension giữ nguyên giá trị mới của game. Nếu vừa đổi trạng thái và chưa có tốc độ gốc phù hợp, không đoán con số mặc định; chờ bản cập nhật tốc độ kế tiếp từ game và báo rõ trên giao diện. Sau đó không còn ghi lặp lại. Các ô cấu hình 3.5/2 vẫn được giữ để dùng khi bật lại; tắt override không ép game về các giá trị cấu hình này và không đổi trạng thái bay/đi bộ.
- Bản sửa khôi phục tốc độ: decoder của game giữ `self` để ghép các snapshot dạng delta (`this.self = {...this.self}`); scene nhận cùng đối tượng đó. Nếu sửa `ms` trực tiếp, delta sau không chứa `ms` có thể mang tiếp giá trị override và bị nhận nhầm là tốc độ gốc. Vì vậy, trước mỗi lần cần đổi tốc độ, extension gán cho `scene.self` một bản sao nông của đối tượng hiện tại, chỉ thay giá trị `ms`. Giữ nguyên mọi giá trị/trường khác và không sửa snapshot decoder, packet hoặc đường truyền. Khi tắt, snapshot nguồn của game vẫn sạch để khôi phục/tiếp tục cập nhật. **Sau khi cập nhật từ bản cũ, cần Reload extension rồi tải lại trang game một lần** để loại dữ liệu đã bị bản cũ sửa; chỉ reload extension không sửa được dữ liệu đã nhiễm trong tab cũ.
- Tùy chọn được lưu trong `chrome.storage.local`, áp dụng cho mọi tab đúng website và qua lần khởi động Chrome tiếp theo. Popup chỉ hiển thị trạng thái tab đang được chọn.
- Tắt override trước khi tắt/gỡ extension. Chrome không bảo đảm script trong tab cũ được dọn ngay khi extension bị vô hiệu hóa/cập nhật; tải lại tab với override tắt để chắc chắn ngừng script cũ.

## Tham số timer và điều hướng

Extension không giả định có thể tìm Phaser khi thiếu `window.game`. Nó dựa trên điều kiện đã cung cấp: game chỉ công khai biến này khi trang **được tải** với tham số `timer`.

Khi override bật và tham số còn thiếu, code thêm `timer` bằng cách nối vào query hiện có, không dùng `searchParams.set/append` để tránh mã hóa lại giá trị tham số cũ. Giữ nguyên đường dẫn, các tham số trùng tên, thứ tự tham số, giá trị và fragment. Ví dụ:

```text
https://nghichthienky.online/?foo=a%20b&foo=c#world
https://nghichthienky.online/?foo=a%20b&foo=c&timer#world
```

Nếu đã có khóa `timer` (kể cả `timer=...`), extension không sửa giá trị hoặc tải lại. Nếu game yêu cầu giá trị cụ thể khác, cần điều chỉnh URL bằng tay; extension không tự đoán. Tắt override không xóa `timer`, tránh phát sinh tải lại khi tắt.

Mỗi lần chuyển bản đồ làm tải trang mới, content script đọc lại tùy chọn và bổ sung tham số nếu cần. Extension không thay link, không chặn điều hướng hoặc sửa History API. Khi chỉ đổi scene trong cùng trang, bộ theo dõi tìm lại `world` và `self`.

## Cách hoạt động và giới hạn

- Hai content script tĩnh: một script chạy trong môi trường trang để truy cập `window.game`, một script chạy trong môi trường riêng của extension để dùng storage và liên lạc với popup. Không cần service worker, quyền `tabs`, `scripting`, `activeTab`, hoặc tài nguyên public cho trang.
- Chỉ xin quyền API `storage`; phạm vi website nằm trong `content_scripts.matches`. Không inject vào subdomain, HTTP, website khác hoặc iframe. Xem [tài liệu Chrome về content scripts và execution worlds](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts).
- Khi bật, dùng duy nhất một interval **500 ms** mỗi trang để tìm lại scene và cập nhật bảng. Listener `preupdate` sẵn có áp dụng tốc độ trước bước di chuyển, rồi mới hỗ trợ tiếp cận Auto Farm. Chỉ tạo bản sao `self` với `ms` mới khi giá trị khác cấu hình; không sửa đối tượng dữ liệu gốc decoder giữ. Không thêm timer hoặc listener theo mỗi snapshot. Tắt override sẽ tháo listener, dừng interval và khôi phục tốc độ gốc một lần nếu còn sở hữu giá trị. Khi popup mở, popup yêu cầu ảnh chụp trạng thái mỗi giây; đóng popup sẽ kết thúc việc này.
- Scene/người chơi chưa có hoặc đang được tạo lại: chờ và thử lại. `pagehide` dừng interval và khôi phục một lần nếu phù hợp; `pageshow` cho phép hoạt động lại khi quay về trang từ bộ nhớ điều hướng.
- Snapshot thay `self` được xử lý ở lượt `preupdate` kế tiếp của scene, thay vì chờ interval 500 ms; chuyển bay/đi bộ vẫn có độ trễ ổn định 1 giây. Scene mới sau đổi map có thể cần chờ phát hiện bằng interval. Không bảo đảm nhịp game ở tab nền, thứ tự ghi từ module khác hoặc việc server chấp nhận tốc độ; server sửa vị trí vẫn cần quan sát Fix và giảm tốc độ nếu cần.
- Trạng thái bay/đi bộ đọc trực tiếp từ `scene.self.fly` trong mỗi bản tin trạng thái, độc lập với tốc độ override. Dùng cùng quy tắc với game: `fly` truthy là bay, falsy là đi bộ; chưa có `self` thì `unknown`. Không lưu trạng thái nhận diện một lần hoặc suy đoán từ `ms`. Việc game thay đối tượng `self` theo bản tin mới không làm mất khả năng đọc trạng thái. Đây là trạng thái bay, không phân biệt đi bộ với chạy hoặc đứng yên.
- Nguồn đối chiếu tĩnh ngày 2026-11-03: [WorldScene-BFrp0V0P.js](https://nghichthienky.online/assets/WorldScene-BFrp0V0P.js) dùng `self.fly` khi tính tốc độ di chuyển và hiển thị thú cưỡi, đồng thời gán lại `this.self` từ snapshot. [index-Cj0KitBn.js](https://nghichthienky.online/assets/index-Cj0KitBn.js) chỉ gán `window.game` khi URL có `timer`. Chỉ tải và đọc mã JavaScript công khai, không thực thi mã game, đăng nhập hoặc gọi API game.
- `self.fix` gốc chỉ được đọc nếu là số hữu hạn, không bị sửa. Bộ đếm giao diện lấy độ tăng giữa hai lần đọc và không bị reset chỉ vì game thay đối tượng `self`; nếu bộ đếm gốc giảm (ví dụ server bắt đầu lại), giao diện bắt đầu lại từ 1. Tải lại trang bắt đầu phiên đếm mới. Ý nghĩa và vòng đời giá trị gốc do game quyết định. Override không bảo đảm vượt qua kiểm tra phía server; server vẫn có thể sửa vị trí.
- Chỉ thay giá trị tốc độ `ms` trên bản sao `scene.self` dùng cho hiển thị/di chuyển; khi tắt có thể ghi lại tốc độ gốc một lần. Không thay giá trị HP, damage, authentication, packet, mã nguồn game hoặc server. Không có fetch/XHR, telemetry, script từ xa hoặc phụ thuộc mạng. Tải lại trang để thêm `timer` vẫn khiến chính game tải tài nguyên như bình thường.
- Cầu nối `postMessage` chỉ truyền tùy chọn và trạng thái dạng số/chuỗi; phía storage không thực thi lệnh từ trang. MAIN world dùng chung môi trường JavaScript với game, nên trang có thể quan sát/giả mạo thông điệp hoặc can thiệp vào script; đây không phải ranh giới bảo mật đối với chính website.
- Các truy cập `window.game`, scene `world` và `self.fly` đã được đối chiếu với mã công khai; hành vi khi chơi thật chưa kiểm chứng. Không tự tìm hoặc móc vào Phaser khi `window.game` không có. Thay đổi cấu trúc game có thể khiến extension chỉ hiển thị trạng thái chờ hoặc cần cập nhật trường trạng thái.

## Trạng thái xác minh lúc bàn giao

Đã rà source/diff, kiểm tra cú pháp 7 file JavaScript trong lượt QA và kiểm tra lại file page.js sau FIX. Harness cục bộ: **29/29 PASS**. Lint/typecheck/browser QA/E2E: **NOT RUN**. Hành vi trên game/server thật: **UNVERIFIED**. CI: **NOT CHECKED**. Xem [QA-report.md](QA-report.md) để biết các fixture/giới hạn và kết quả trước/sau sửa. Lượt đóng gói không chạy lại gameplay hoặc bộ test.

Nếu tự kiểm tra sau khi có quyền: xác nhận tắt mặc định; thử URL có nhiều tham số và fragment; bật và quan sát tải lại thêm `timer`; đổi tốc độ; chuyển bay/đi bộ và bản đồ; tắt rồi kiểm tra extension không tiếp tục ghi tốc độ. Không dùng kết quả đọc source làm bằng chứng chạy thực tế.
