# FUNCTION_MAP.md

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.


## Tra cứu tính năng → symbol

### Startup / Phaser / map

- `an` (UTF-16 [108950, 113072), L468–L468)
- `nn` (UTF-16 [108676, 108950), L468–L468)
- `on` (UTF-16 [108144, 108676), L468–L468)
- `Pt` (UTF-16 [69203, 69624), L308–L308)
- `V` (UTF-16 [70178, 70407), L308–L308)
- `M` (UTF-16 [4500, 4610), L2–L2)
- `Je` (UTF-16 [2520, 2553), L2–L2)

### WebSocket / RTC / reconnection

- `lo` (UTF-16 [17850, 18966), L5–L5)
- `io` (UTF-16 [7274, 14836), L2–L2)
- `io.receive` (UTF-16 [8271, 8934), L2–L2)
- `io.update` (UTF-16 [9315, 9673), L2–L2)
- `io.upgrade` (UTF-16 [9731, 13161), L2–L2)
- `io.reconnect` (UTF-16 [13283, 14835), L2–L2)
- `so` (UTF-16 [15400, 16451), L2–L2)
- `ro` (UTF-16 [14868, 15100), L2–L2)
- `Wt` (UTF-16 [15233, 15400), L2–L2)
- `q` (UTF-16 [16457, 17215), L2–L5)

### Snapshot / network delta

- `eo` (UTF-16 [4807, 5931), L2–L2)
- `eo.decode` (UTF-16 [4871, 5930), L2–L2)

### Authentication / guest / save

- `_o` (UTF-16 [80851, 95386), L400–L441)
- `Oo` (UTF-16 [95386, 96637), L441–L441)
- `Kt` (UTF-16 [5951, 6292), L2–L2)
- `$t` (UTF-16 [6720, 6914), L2–L2)
- `Bt` (UTF-16 [6997, 7086), L2–L2)
- `ye` (UTF-16 [6914, 6997), L2–L2)
- `Ne` (UTF-16 [80615, 80851), L400–L400)

### Avatar / skin / animation

- `Te` (UTF-16 [39635, 41583), L130–L138)
- `ve` (UTF-16 [4230, 4368), L2–L2)
- `wo` (UTF-16 [37835, 38118), L130–L130)
- `bn` (UTF-16 [38628, 39163), L130–L130)
- `fn` (UTF-16 [39180, 39563), L130–L130)
- `Eo` (UTF-16 [41589, 42754), L138–L138)

### Texture decode / encrypted assets

- `_e` (UTF-16 [105590, 105980), L468–L468)
- `Wo` (UTF-16 [106050, 106304), L468–L468)
- `Xo` (UTF-16 [106314, 106783), L468–L468)
- `Jo` (UTF-16 [106783, 107035), L468–L468)

### Theme / tooltip / visuals

- `gt` (UTF-16 [34314, 34850), L130–L130)
- `hn` (UTF-16 [34850, 35057), L130–L130)
- `tt` (UTF-16 [35262, 35709), L130–L130)
- `we` (UTF-16 [35709, 36292), L130–L130)
- `fo` (UTF-16 [36404, 37061), L130–L130)
- `mn` (UTF-16 [37077, 37388), L130–L130)

### Mobile / input / auto button

- `vn` (UTF-16 [61922, 67389), L308–L308)
- `vn.dragAim` (UTF-16 [66312, 67388), L308–L308)
- `Po` (UTF-16 [61653, 61922), L308–L308)
- `Mo` (UTF-16 [45629, 45852), L159–L159)

### Fullscreen / UX restriction

- `Ko` (UTF-16 [101374, 103918), L468–L468)
- `ct` (UTF-16 [100134, 100534), L468–L468)
- `Do` (UTF-16 [100534, 100717), L468–L468)
- `Ho` (UTF-16 [100872, 101364), L468–L468)

### Diagnostics / DevTools reporting

- `Vo` (UTF-16 [104541, 105138), L468–L468)
- `ce` (UTF-16 [105155, 105553), L468–L468)
- `q` (UTF-16 [16457, 17215), L2–L5)

### FPS / visual settings

- `nn` (UTF-16 [108676, 108950), L468–L468)
- `zn` (UTF-16 [107823, 107861), L468–L468)
- `Pn` (UTF-16 [107877, 107915), L468–L468)
- `wn` (UTF-16 [107306, 107343), L468–L468)
- `Sn` (UTF-16 [107343, 107380), L468–L468)
- `Cn` (UTF-16 [107507, 107584), L468–L468)

## Giới hạn tra cứu
Không có hàm thực thi combat, AI hay auto-farm được xác định trong entry; entry chỉ chứa nút `V` và hooks. Khi gộp wiki, liên kết `WorldScene` và `LocalDriver` trước khi kết luận gameplay.
