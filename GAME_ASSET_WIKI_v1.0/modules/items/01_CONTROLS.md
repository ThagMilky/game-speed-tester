# Điều khiển và lưu cấu hình — CONFIRMED (mã client)

## Bảng mặc định `M` — L1, UTF-16 [416]

Mỗi phần tử `[identifier, keyCode, nhãn]`. Các phím: W 87 lên; S 83 xuống; A 65 trái; D 68 phải; SHIFT 16 chạy; SPACE 32 đánh thường; Q 81 né; ONE..SIX 49..54 chiêu 1..6; H 72 chiêu truyền thừa; TAB 9 đổi mục tiêu; F 70 tương tác; E 69 nhặt đồ; Z 90 đan máu; X 88 đan linh; T 84 thiền; R 82 cưỡi thú; V 86 tự luyện; G 71 độ kiếp; N 78 nhiệm vụ; B 66 túi; C 67 trang bị; K 75 kỹ năng; P 80 tổ đội; M 77 bản đồ; J 74 hằng ngày; L 76 xếp hạng; U 85 xưởng; ENTER 13 trò chuyện.

## Các hàm

- `D` = `"tm-controls-v1"` (L1, UTF-16 [1104]).
- `Cn()` (L1, UTF-16 [1123]): trả object mới `clickMove: true`, `clickAttack: true`, `mouseMode: "moba"`, `bindings: Object.fromEntries(M.map(...))`.
- `Hn(n)` (L1, UTF-16 [1230]): chỉ nhận số nguyên thuộc `9,13,16,32`, mã `48..57`, hoặc `65..90`. Không chấp nhận phím ngoài tập này.
- `Mn()` (L1, UTF-16 [1312]): lấy mặc định, `JSON.parse(localStorage.getItem(D) ?? "null")`; chỉ áp dụng `clickMove`/`clickAttack` khi boolean, `mouseMode` chỉ `"moba"` hoặc `"left"`; danh sách mã phím được ghi đè **chỉ nếu tất cả hợp lệ và không trùng** (`c.every(Hn) && new Set(c).size===c.length`), mọi lỗi bị `catch{}` nuốt và trả cấu hình hiện có.
- `Xn(n)` (L1, UTF-16 [1787]): `localStorage.setItem(D,JSON.stringify(n))` trong `try/catch{}`, không trả thông tin thành công/thất bại.
- `Nn(n)` (L1, UTF-16 [1856]): đặc cách 9/13/16/32 thành `Tab`, `Enter`, `Shift`, `Space`; các mã khác dùng `String.fromCharCode`.
- `Ln(n)` (L1, UTF-16 [1947]): `Space`→`SPACE`, `1..6`→`ONE..SIX`, còn lại `n.toUpperCase()`; input được kỳ vọng là chuỗi.
- `H(n)` (L1, UTF-16 [2056]): trả nhãn phím của hành động qua `Nn(Mn().bindings[Ln(n)] ?? 0)`; **mỗi lần gọi `H` lại đọc `localStorage` qua `Mn`**.

## Ranh giới

Không có listener keyboard, dispatch movement, input simulation hoặc gửi điều khiển tới server trong file này. File chỉ quản lý mapping và nhãn phím. **UNKNOWN:** module áp dụng mapping khi game đang chạy và các keycode có bị hệ thống input xử lý khác không.
