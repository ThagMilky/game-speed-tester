# Kết quả QA extension — 2026-11-03

Lưu ý cập nhật 2026-11-04: báo cáo bên dưới là kết quả lịch sử trước các sửa đổi phím tắt, áp dụng tốc độ theo `preupdate` và bộ lọc ≤ / ≥ / boss. Các thay đổi mới chỉ được đọc lại source/diff; tests, lint, typecheck và browser/gameplay: **NOT RUN**. Hành vi mới: **UNVERIFIED**. CI: **NOT CHECKED**.

## Kết luận

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
