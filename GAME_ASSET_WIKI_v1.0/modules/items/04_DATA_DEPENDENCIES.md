# Hệ thống dữ liệu, I/O, bất định

## Import tĩnh

- `./trangbi-iyUH-plT.js`: 40 alias (L1, UTF-16 [0]), hỗ trợ normalization ID, nhận diện trang bị, metadata đồ/vật phẩm, ngọc khảm, đá rèn, thời trang, thú cưỡi, thần binh. Danh sách chính xác cùng original export và vị trí nằm trong `ASSET_INDEX.json`.
- `./index-BIkbGDKp.js`: `d as p`, factory tạo DOM node.
- Không có import động và không có export default trong file.

## File tải lúc runtime

- `data/gear/gear.json`: trường `.icons` thông qua `Kn`.
- `data/items/items-meta.json`: trường `.items`, `.cell`, `.atlas` thông qua `In`.
- `data/items.json`: trường `.recipes` qua `In`.
- Ảnh liên quan thư mục `data/equipment-expansion-v2`, `data/equipment-sets-v1`, `data/donation-v1`, `data/fx/the-tu-v1`, `data/gear`, `data/items`, `data/ui/currency`, `data/mounts`, `kt-ui/items`.

## Storage và trạng thái module

- `localStorage["tm-controls-v1"]` qua `Mn`/`Xn`; scope trình duyệt; parse và save lỗi đều im lặng.
- `k=null` cache icon gear; `m={}` metadata; `W=40` kích thước cell; `A="items-v3.png"` atlas; `B=null` cache Promise; `L=[]` recipes; `q=new Set` cache lỗi ảnh cho `j`.
- `Kn()` và `In()` được export để caller chủ động tải. Trong source không có lệnh gọi khởi động tự động đến 2 hàm này.

## Mạng và quyền quyết định

- Có `fetch` các file JSON và tải image (qua DOM). **Không tìm thấy** WebSocket, `XMLHttpRequest`, `sendBeacon`, mutation game server, xử lý packet hoặc HTTP API gameplay trong file.
- Mô tả buff, cooldown, drop, chi phí rèn, chuyển chức, vật phẩm sự kiện là **data dành cho người chơi**. Không có bằng chứng server thực thi đúng các chuỗi này.
- Không có vòng lặp game, physics, pathfinding, kiểm tra khoảng cách, AI, damage computation, combat events hay state machine gameplay chạy trong file này.

## Đường đi dữ liệu

`Mn → localStorage → kiểm tra hợp lệ → bindings → H → chuỗi nhãn`

`In → items-meta.json → m/W/A → K/j` và `In → items.json → L → G/K`

`Kn → gear.json.icons → k → N → j` (trường hợp item được `X(n)` xem là trang bị)

`trangbi module → Z/Y/y/… → K → metadata mô tả → j → DOM icon`

`index module p → j/qn → DOM node`
