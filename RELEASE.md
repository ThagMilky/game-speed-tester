# Phát hành Game Speed Tester

Repository này là Chrome Extension Manifest V3. Không cần build, Node.js, npm hoặc file EXE. Workflow phát hành hiện có tại [`.github/workflows/release-extension.yml`](.github/workflows/release-extension.yml). **Khi commit thay đổi `manifest.json` trên nhánh `main`, workflow tự phát hành phiên bản mới.** Commit chỉ sửa code hoặc tài liệu khác không tự tạo Release.

## Tạo Release trực tiếp trên GitHub (không cần dùng Git)

1. **Khi thực sự muốn phát hành phiên bản mới**, cập nhật trường `version` trong `manifest.json` trên nhánh `main`, ví dụ từ `1.0.2` thành `1.0.3`, rồi commit thay đổi. GitHub tự chạy workflow để tạo Release.
2. Khi workflow thành công, vào **Releases** để lấy file `Game-Speed-Tester-vX.Y.Z.zip` và gửi cho bạn bè.
3. Nếu muốn phát hành lại theo phiên bản hiện đang có mà chưa có Release, vào **Actions** → **Release extension** → **Run workflow** trên nhánh **main**.

Workflow thủ công tạo GitHub Release (và tag `vX.Y.Z` nếu chưa tồn tại) theo phiên bản trong `manifest.json`, rồi đính kèm ZIP. Mỗi phiên bản chỉ nên phát hành một lần. Nếu tag hoặc Release đã tồn tại ở commit khác, không dùng lại phiên bản cũ; hãy tăng `version`.

Cách khác: đẩy một Git tag `vX.Y.Z` trùng với `manifest.json`; workflow sẽ tự chạy để tạo Release. Không tạo tag cho code chưa có workflow này.

## Bạn bè cài đặt

1. Tải file ZIP ở trang **Releases**, giải nén.
2. Mở Chrome 111 trở lên và vào `chrome://extensions`.
3. Bật **Developer mode** (Chế độ nhà phát triển).
4. Chọn **Load unpacked** (Tải tiện ích đã giải nén), trỏ đến thư mục **Game-Speed-Tester** chứa `manifest.json`.
5. Mở hoặc tải lại trang game và ghim tiện ích nếu cần.

Khi cập nhật, giải nén phiên bản mới vào **cùng đường dẫn thư mục cũ**, sau đó nhấn **Reload** ở `chrome://extensions` và tải lại tab game. Nếu thay đổi đường dẫn cài đặt, Chrome có thể tạo ID khác và cài đặt cũ không nhất thiết được giữ nguyên.

## Nội dung ZIP và giới hạn

ZIP chỉ chứa `manifest.json`, các file `.js`, `.css`, `.html` ở thư mục gốc và `INSTALL.txt` cho người dùng. File tài liệu `.md` không nằm trong gói và một commit chỉ sửa tài liệu không yêu cầu tạo ZIP mới. Workflow kiểm tra các file được tham chiếu trong manifest trước khi tạo ZIP. Thư mục `game-reference/`, tài liệu phát triển, Git history, thư mục `work/` và dữ liệu cục bộ không nằm trong gói.

Đây là cách phân phối tiện ích **Load unpacked**, không phải CRX hay Chrome Web Store; không có cập nhật tự động trong trình duyệt. ZIP không che giấu mã nguồn.

Nếu workflow thất bại ở bước xuất bản do `GITHUB_TOKEN` thiếu quyền, cần kiểm tra quyền **Actions → General → Workflow permissions** và chính sách của repository. Không cấp quyền rộng hơn `contents: write` cho workflow này.
