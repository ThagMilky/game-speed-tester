# Biểu tượng và DOM rendering — CONFIRMED mã client

## `Kn()` và `N(n)`

- `Kn()` (L1, UTF-16 [2116]): tải `data/gear/gear.json`, lấy `.icons` vào cache `k`; catch đặt `k={}`; nếu `k` truthy thì không tải lại. Đây là cache cục bộ, không có retry sau lỗi nếu đã đặt `{}`.
- `N(n)` (L1, UTF-16 [2262]): clone `n` và chuẩn hóa `id` bằng `O(n.id)??n.id`. Ưu tiên icon `F(id)` trước. Sau đó:
  1. `id.startsWith("ex-")` → `/data/equipment-expansion-v2/64/${id}.png`.
  2. `set-hoang-co-thanh-the-` → `/data/fx/the-tu-v1/gear/${id.slice(23)}.png`.
  3. `set-kim-van-` → `/data/donation-v1/${id.slice(12)}.png`.
  4. `R[id]` → `/data/equipment-sets-v1/64/${id}.png`.
  5. `V(id)` nếu truthy.
  6. `k?.[xn(n.id,n.inlay)]` → `data/gear/${icon}`.
  7. Nếu không có → `null`.
- **UNKNOWN**: hành vi chuẩn hóa `O`, nhận diện `F`/`V`, nội dung `R`, quy tắc khóa icon `xn` đều từ module khác.

## `j(n,i=40,c)` — L13, UTF-16 [13131]

1. `t=E(n)`; id ảnh ưu tiên `_[n]` hoặc `ngoc-${t.el}${t.lv}`; nếu chưa nằm trong `q` (Set ảnh lỗi), tạo `img` với đường dẫn `P(e)`; cỡ `i<=32` đổi `.png`→`-32.png`, `onerror` ghi id vào `q` và `replaceWith(j(n,i,c))` để thử fallback. Dòng này chỉ chạy **khi ảnh được browser tải và báo lỗi**.
2. Tính tỉ lệ `r=i/W`; nếu `c` vắng, thử `X(n)` nhận dạng đồ → `N(o)` lấy icon; có đường dẫn thì tạo `img` kích thước `i`.
3. Lấy `K(n)` và phân nhánh `u.i`:
   - `mount:con-bang`: `div` với background sprite `/data/mounts/con-bang-v3/south.png`, kích thước sprite `i*3 × i*2`.
   - `file:`: `img` URL `data/items/${g.slice(5)}` và `object-fit:contain`.
   - `v3:x,y`: `div` cắt atlas `data/items/${A}`, background position `-x*r`, `-y*r`, atlas `640*r × 256*r`; nếu `u.t`, áp CSS filter `w(u.t)`.
   - `v2:`, `cur:`, `px:`: `img` lần lượt từ `data/items/v2`, `data/ui/currency`, `data/items`; ảnh hiển thị `Math.round(32*r)` trong hộp i và margin căn giữa.
   - `Gn[n]`: icon `kt-ui/items/${slug}.png` cho thiệp đệ tử, linh châu, bản đồ kho báu.
   - fallback: `Sn[u.c] ?? ["物","#8a8a9a"]`; tạo `div` chứa ký tự Hán category, màu và radial-gradient.
4. `p(tag,class,text?)` import từ `index-BIkbGDKp.js` tạo DOM node; gán `.src`, `.style.cssText`, `.alt`, `.draggable`, `.onerror`; không có canvas/WebGL trực tiếp trong file.

## `w(n)` — L13, UTF-16 [15311]

Chuyển màu hex RGB (`n.slice(1,3)`, `(3,5)`, `(5,7)` base16) → hue qua `atan2(sqrt(3)*(G-B),2R-G-B)*180/PI -30`, tạo filter `sepia(.35) hue-rotate(...deg) saturate(1.2)`. Đây là **biến đổi màu trình duyệt**, không phải chỉ số gameplay.

## `qn(n,i=16)` — L13, UTF-16 [15532]

Tạo icon linh thạch: `n` truthy chọn `cuc-pham-linh-thach`, false chọn `linh-thach`; filename size `32` khi `i>=32`, ngược lại `16`, nhưng CSS kích thước đúng `i`. Không xử lý `onerror` riêng.

## Lưu ý về đường dẫn

Source pha trộn absolute `/data/...` và relative `data/...`, `kt-ui/...`; **UNKNOWN** base URL/bundler routing tại runtime. `j` và `N` chỉ trả hoặc gán hình ảnh, không gửi event network game. Browser có thể tự tải ảnh qua src/CSS theo cơ chế bình thường.
