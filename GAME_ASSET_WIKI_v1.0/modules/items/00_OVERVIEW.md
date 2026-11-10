# Asset: `items-nDkzNEls.js` — tổng quan

**Phạm vi:** chỉ phân tích tĩnh toàn bộ 18,028 byte của file gốc. Không chạy game, không gọi network, không mở các module phụ thuộc, không so sánh phiên bản. Mọi hành vi bên dưới chỉ thể hiện **mã phía client**, không khẳng định quy tắc server.

**Nguồn và tính toàn vẹn:** `source/items-nDkzNEls.js`; SHA-256 `5f77311ae9d6e9fab8eff378a809fcacf3f16af2304aa3f577bee1aab1d0b343`. UTF-8, 16,097 codepoint, 16,097 UTF-16 code unit, 14 dòng. Tệp minified có một số dòng rất dài. Tọa độ trong `ASSET_INDEX.json` là offset 0-based, lưu cả UTF-16 và byte. Nếu công cụ khác tính offset theo byte, không dùng nhầm offset ký tự.

## Mục đích xác nhận từ source

- Bảng phím mặc định, đọc/ghi tùy chọn điều khiển trong `localStorage` và tên phím hiển thị: `M`, `D`, `Cn`, `Hn`, `Mn`, `Xn`, `Nn`, `Ln`, `H`.
- Đường dẫn biểu tượng trang bị/vật phẩm, tải metadata và công thức, dựng biểu tượng DOM hoặc glyph dự phòng: `Kn`, `N`, `In`, `K`, `G`, `j`, `w`, `qn`.
- Mô tả item liên quan thuốc hồi phục, tăng công/thủ, kinh nghiệm, bế quan, khảm, đá nâng cấp, thời trang, trứng thú cưỡi, bí kíp. Mô tả **không chứng minh** logic server tiêu hao thuốc, tính sát thương, rơi đồ hoặc giao dịch.

## Nhận định giới hạn

- **CONFIRMED:** file có những nhánh xử lý, đường dẫn, dữ liệu chuỗi, lời gọi `fetch`, `localStorage`, các DOM element được tạo.
- **INFERRED:** module phục vụ UI túi đồ/trang bị/cài đặt do biểu tượng và mô tả; chưa có file gọi module để xác nhận màn hình cụ thể.
- **UNKNOWN:** dữ liệu JSON thực tế, giá trị runtime của mọi import từ `trangbi-iyUH-plT.js`, thứ tự tải trước khi gọi UI, cơ chế xác thực server, chính sách lỗi mạng, độ tương thích đường dẫn khi deploy.

## Cách đọc

Xem `01_CONTROLS.md`, `02_ITEM_METADATA.md`, `03_ICONS_RENDERING.md`, `04_DATA_DEPENDENCIES.md`, `05_SYMBOL_CATALOG.md`, `06_FINDINGS_AND_GAPS.md`; tra chức năng tại `FUNCTION_MAP.md`, phụ thuộc tại `DEPENDENCY_MAP.md`, máy đọc tại `ASSET_INDEX.json`.
