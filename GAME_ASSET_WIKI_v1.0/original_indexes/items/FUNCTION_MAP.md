# FUNCTION_MAP — feature → symbols (source minified names)

| Feature | Symbols | Evidence | Notes |
|---|---|---|---|
| Bảng phím mặc định | `M`, `Cn` | CONFIRMED | key identifiers + keycodes + labels |
| Kiểm tra mã phím | `Hn` | CONFIRMED | integers in allowed set |
| Đọc lưu điều khiển | `D`, `Mn`, `Xn` | CONFIRMED | browser `localStorage` |
| Nhãn phím | `Nn`, `Ln`, `H` | CONFIRMED | formats and reads saved settings |
| Tải ảnh trang bị | `Kn`, `k`, `N` | CONFIRMED | fetch gear.json and icon fallbacks |
| Tên thưởng khi đúng phái | `Pn`, `X`, `mn` | CONFIRMED | only adjusts display text |
| Tải metadata item/công thức | `In`, `m`, `W`, `A`, `B`, `L` | CONFIRMED | two `fetch`, cached Promise |
| Hướng dẫn dùng thuốc | `Bn`, `S`, `G`, `C` | CONFIRMED | text only |
| Các thuốc, buff, tẩy điểm | `K`, `G`, `Z`, `Bn`, `S` | CONFIRMED | tooltip metadata, not execution |
| Đá khảm/ngọc khảm/Ngũ Hành | `K`, `E`, `Y`, `y`, `tn`, `hn`, `an`, `z`, `nn`, `sn` | CONFIRMED | displayed bonuses, not combat formula |
| Rèn/nâng cấp và vật liệu | `K`, `vn`, `bn`, `Tn`, `kn`, `$n`, `yn`, `fn` | CONFIRMED | metadata descriptions |
| Thời trang/đồ đổi | `K`, `cn`, `en`, `gn`, `N` | CONFIRMED | metadata descriptions |
| Thú cưỡi | `K`, `I`, `U`, `Q`, `x` | CONFIRMED | descriptions/passive strings |
| Thần binh và mảnh | `K`, `rn`, `un`, `ln`, `dn`, `pn` | CONFIRMED | metadata |
| Render biểu tượng item | `j`, `K`, `N`, `P`, `E`, `_`, `q`, `Gn`, `Sn`, `w` | CONFIRMED | DOM + sprite + glyph |
| Render tiền tệ | `qn` | CONFIRMED | img node |
| Map public API | `Dn` and named exports | CONFIRMED | alias API |
| Real gameplay damage/cooldown | none | UNKNOWN | no execution machinery in this file |
| Network game operations | none | UNKNOWN | only static asset fetch evidenced |

**Locations:** every top-level symbol and import in `ASSET_INDEX.json` contains accurate start offsets; search exact minified token in untouched `source/`. Export mapping also recorded there.
