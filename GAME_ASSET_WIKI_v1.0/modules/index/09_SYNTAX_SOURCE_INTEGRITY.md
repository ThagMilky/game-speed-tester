# 09 SYNTAX SOURCE INTEGRITY

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Lỗi cú pháp trong tệp được gửi
- CONFIRMED: phân tích bằng `acorn` (ECMAScript latest, module mode) **thất bại** với `Unexpected token (468:8283)` tại offset UTF-16 **108034** gần chuỗi `const tn=function en(){console.log(...)}en();`.
- CONFIRMED: văn bản thực là `const tn=function en(){console.log("%c"+tn,"font-family: monospace; font-size: 9px; line-height: 9px; color: #e8c170")}en();`. Giữa dấu `}` đóng biểu thức function và lời gọi `en()` thiếu dấu ngắt câu `;` hoặc một cú pháp hợp lệ tương đương.
- CONFIRMED: để lập chỉ mục phần còn lại, bản sao **chỉ trong bộ nhớ** được chèn đúng **1** dấu `;` ngay trước `en();`. Parser sau đó đọc được **135** statement cấp module. **Tệp nguồn trong ZIP không sửa** và các offset đều ánh xạ ngược về nguồn gốc.
- INFERRED: nếu file gốc được trình duyệt nạp nguyên như JavaScript module, đoạn này gây `SyntaxError` và ngăn thực thi toàn module. Không chạy trang web nên không xác nhận đây có phải chính xác nội dung đang được triển khai hay không.
- UNKNOWN: lỗi sinh từ quá trình xuất/tải/copy, mã gốc tại server, hay chủ đích; không tự khắc phục source.
