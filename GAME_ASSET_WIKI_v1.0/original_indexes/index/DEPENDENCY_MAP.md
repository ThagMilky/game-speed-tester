# DEPENDENCY_MAP.md

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.


## Dynamic import xác nhận (chuỗi gốc)

- `./LocalDriver-DMfdN3Dc.js` — offset 111223; xem `ASSET_INDEX.json` để đối chiếu call sites.
- `./items-nDkzNEls.js` — offset 112150; xem `ASSET_INDEX.json` để đối chiếu call sites.
- `./phaser-DRI6y8R5.js` — offset 112393; xem `ASSET_INDEX.json` để đối chiếu call sites.
- `./WorldScene-b_2tpaKT.js` — offset 112464; xem `ASSET_INDEX.json` để đối chiếu call sites.
- `./boot-B_u-AwaO.js` — offset 113098; xem `ASSET_INDEX.json` để đối chiếu call sites.

## Danh sách chunk preloading Vite

- `LocalDriver-DMfdN3Dc.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `trangbi-iyUH-plT.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `sim-CvoxXTtu.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `items-nDkzNEls.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `WorldScene-b_2tpaKT.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `phaser-DRI6y8R5.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `Character-DhQJ_Q0g.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `ChieuMau-CEtRLp-4.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.
- `boot-B_u-AwaO.js` — xuất hiện trong bảng `__vite__mapDeps`; không có nội dung trong asset hiện tại.

## Sơ đồ quan hệ xác nhận
```text
index entry
 ├─ load data/*.json → config/maps, sprites, quests, items, classes
 ├─ online → lo → io → WebSocket ↔ server /ws
 │                         └─ upgrade → /api/rtc/config, /api/rtc/offer → RTC DataChannel
 │                         └─ snapshot eo.decode → WorldScene (driver callback unknown)
 ├─ offline → LocalDriver(data,profile)
 ├─ assets → items.loadItemMeta/loadGearIcons
 ├─ Phaser.Game → WorldScene(map, textures, driver, profile, ...)
 ├─ UI → theme, mobile input, skin, loading, auth
 └─ ?lab=1 → boot.labBoot()
```

## External runtime/platform dependencies
- `window`, `document`, `navigator`, `location`, `localStorage`, `sessionStorage`, `fetch`, WebSocket, RTCPeerConnection, HTMLImageElement, Canvas, Fullscreen API, requestAnimationFrame.
- Server endpoints confirmed in asset: `/ws`, `/api/auth/email`, `/api/auth/register/start`, `/api/auth/register/verify`, `/api/auth/register/complete`, `/api/auth/reset/start`, `/api/auth/reset/finish`, `/api/rtc/config`, `/api/rtc/offer`, `/api/rtc/report`, `/api/devtools`.
- Đây là chiều gọi phía client. Không có server source để xác nhận hành vi server.

## Unresolved cross-module dependencies
1. `WorldScene`: movement/combat, minimap, portals, abilities, input hooks, entity render lifecycle, AI logic.
2. `LocalDriver`: world tick, offline command processing, snapshot production, interactions and drops.
3. `items`: item metadata, quality, gear icon sources.
4. `trangbi`, `sim`: game data conversion, simulation functions (không thể khẳng định nội dung từ tên chunk).
5. `Character`, `ChieuMau`: character animations and effects (chưa đọc).
6. `phaser`: actual rendering implementation / loader behavior after monkey patch.
7. `boot`: lab boot flow and flags.
8. Server: auth validation, RTC protocol, anti-cheat, authorization, combat/drops/state authority.
