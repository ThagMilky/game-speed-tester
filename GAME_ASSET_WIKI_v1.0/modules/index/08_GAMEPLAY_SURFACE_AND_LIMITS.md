# 08 GAMEPLAY SURFACE AND LIMITS

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Các hệ thống được nhắc tới, không phải implementation đầy đủ
- CONFIRMED: `data/classes.json` chứa metadata class được tải; entry có class keys `kiem-tien`, `co-su`, `ma-tong`, `the-tu`, `anh-sat`, `phu-su`, `ngu-thu-su`, `ky-mon`, `am-tong`, `tran-phap-su`; `tan-thu`, `untrained` xuất hiện trong cấu hình skin/profile.
- CONFIRMED: `data/world.json`, `posts.json`, `herbs.json`, `camps.json`, `quests.json`, `items.json`, `realm-cores.json`, `fishing.json`, `worldmap.json`, `maps/<scene>.json` được nạp và đưa cho scene / offline driver.
- CONFIRMED: bộ dữ liệu map offline gồm `entryX/entryY`, `minLevel/maxLevel`, `hub/pvp`, `medRate`, `noPills`, `fish`, `water`, `tris`, `gates`, `monsters` (được lọc trường `gu`), `camps`, `quests`, `items`, `npcs`, `posts`. Những trường này là hợp đồng dữ liệu, không phải chứng cứ cho công thức gameplay.
- CONFIRMED: UI hiển thị câu hướng dẫn di chuyển chuột phải, đánh chuột trái, R cưỡi, V tự luyện, T thiền, F hái, M mở bản đồ, Z/X uống đan, G độ kiếp; chỉ là mô tả sản phẩm, không khẳng định thuật toán.
- INFERRED: phần tính combat/skill/AI/pathfinding/bản đồ/nhặt đồ chủ yếu ở `WorldScene`, `Character`, `ChieuMau` hoặc các module runtime/game data; cần đọc các file tương ứng.
- UNKNOWN: damage, crit, hút máu, boss drop, aggro, hồi sinh, tốc độ di chuyển, farming timer, collision, thuật toán tìm đường, map chuyển cảnh, mua bán, random cây/rương, quyền server. Không suy ra công thức từ câu mô tả UI.
