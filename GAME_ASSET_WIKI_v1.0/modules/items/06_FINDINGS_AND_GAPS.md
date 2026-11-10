# Kết luận kỹ thuật theo mức bằng chứng

## CONFIRMED — trực tiếp từ file

1. Export 15 ký hiệu: `C`, `a`, `b`, `c`, `d`, `e`, `f`, `g`, `h`, `i`, `j`, `k`, `l`, `r`, `s` (kiểm tra danh sách machine-readable để biết số lượng chính xác; file export 15 alias). Ký hiệu `Dn` cung cấp thêm object tên thuộc tính gồm `coinIcon`, `gearIcon`, `itemIcon`, `itemMeta`, `loadGearIcons`, `loadItemMeta`, `rewardItemName`.
2. Hàm tải dữ liệu là lazy, dùng `Promise.all`, catch lỗi riêng, cache Promise. Không retry trực tiếp khi lỗi vì `B` giữ Promise đã tạo.
3. Nhánh mô tả metadata vật phẩm rộng và ưu tiên thứ tự; một số item tách riêng khỏi `m[n]`.
4. Render icon qua DOM node, CSS background sprite, URL ảnh hoặc chữ dự phòng.
5. Tùy chọn điều khiển lưu theo key localStorage cố định, kiểm tra toàn bộ bộ key không trùng trước khi áp dụng.

## INFERRED — cần xác nhận với caller hoặc data

1. `items` khả năng là module giao diện chung cho túi đồ, trang bị, tooltip, điều khiển; file này **không cho biết nơi dùng**.
2. Caller nhiều khả năng chạy `In` và `Kn` trước khi hiển thị để có metadata/ảnh đầy đủ.
3. Dữ liệu `Z`, `Y`, `y`, `cn`, `rn` có thể là bảng gameplay dùng ở nơi khác, nhưng tại đây chỉ được đọc để tạo mô tả.

## UNKNOWN — cần hợp nhất tài sản khác

1. Cấu trúc thực và giá trị module `trangbi-iyUH-plT.js`; giá trị của từng import alias.
2. Định nghĩa `p` trong `index-BIkbGDKp.js`, các caller import exports của file items.
3. JSON runtime, asset file tồn tại hay không, URL cơ sở deploy, logic ghi nhận cooldown/buff/damage/drop/exp.
4. Khả năng browser load ảnh, tính hợp lệ của từng sprite, trạng thái storage trong thực tế.
5. Chưa chạy runtime, chưa chạy test, chưa so sánh phiên bản.

## Những điểm có nguy cơ (chỉ phân tích tĩnh)

- `Mn` dùng catch im lặng cho storage; không phân biệt dữ liệu cũ với lỗi truy cập storage.
- `In` cache Promise bất kể fetch nào lỗi; các lỗi mạng nuốt im lặng, dữ liệu có thể thiếu mãi trong vòng đời module.
- `N` giả định sau khi chuẩn hóa `id` là chuỗi (gọi `.startsWith`); `K` giả định `n` là chuỗi (gọi `.startsWith`); không thể kết luận lỗi thực tế khi chưa biết caller.
- `j` có fallback icon dựa trên `q` toàn module; một icon lỗi một lần sẽ không thử lại cùng identifier trong vòng đời trang.

## Gợi ý hợp nhất đa asset

Dùng `asset_file` và `source.sha256` trong `ASSET_INDEX.json` làm định danh; join trên `imports.module` và `imports.bindings.original_export`; giữ cả alias cục bộ và tên xuất minified; map từ `DEPENDENCY_MAP.md`. Không tự đổi tên minified khi merge; lưu mức bằng chứng và trạng thái phụ thuộc chưa giải quyết.
