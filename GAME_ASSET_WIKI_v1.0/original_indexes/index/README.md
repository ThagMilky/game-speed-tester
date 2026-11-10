# GAME_ASSET_WIKI_v1.0 — index-BIkbGDKp.js

Độc lập, chỉ phân tích tĩnh đúng file đính kèm, không so sánh phiên bản.

- `source/`: bản gốc giữ nguyên từng byte.
- `modules/`: tài liệu kỹ thuật theo hệ thống, bao gồm lỗi cú pháp và giới hạn suy luận.
- `ASSET_INDEX.json`: index symbol, alias export, call names, literal, vị trí UTF-16 gốc.
- `FUNCTION_MAP.md`: tra cứu tính năng.
- `DEPENDENCY_MAP.md`: import/chunk/API và unresolved modules.
- `ANALYSIS_PROGRESS.json`: tiến độ và xác nhận/chưa xác minh.

**Lưu ý:** file gốc chứa lỗi cú pháp ở dòng 468. Parser chỉ thêm dấu `;` trong bản sao RAM để thu thập metadata; không can thiệp nguồn lưu. Không thực hiện runtime tests.
