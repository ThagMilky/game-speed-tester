# Metadata vật phẩm, tính chất và công thức — phân tích nhánh `K`, `G`

## Tải dữ liệu và hàm phụ

- `In()` (L1, UTF-16 [2798]): lazy-load và cache Promise `B`. Chạy song song `fetch("data/items/items-meta.json")` (gán `m=n.items`, `W=n.cell`, `A=n.atlas`) và `fetch("data/items.json")` (gán `L=n.recipes??[]`). Cả hai có `.catch(()=>{})` độc lập nên lỗi được nuốt; Promise tổng có thể hoàn thành ngay cả khi dữ liệu thiếu. Không có logic retry sau khi `B` đã tạo.
- `G(n,i,c,t)` (L1, UTF-16 [4602]): tìm `L.find(g=>g.output===n)`, định dạng nguyên liệu `inputs` và lượng tạo thành `count`; chọn hướng dẫn dùng `Bn[n]` nếu có, nếu không dùng Túi + phím `H("B")`; nối ghi chú `S[t]`; trả đối tượng metadata có các trường `i`, `g`, `c`, `d`, `s`. Thông tin đây là **text mô tả**, không tự tiêu nguyên liệu.
- `C(n)` (L1, UTF-16 [4553]): thời lượng `n>=120 && n%60===0` hiển thị thành phút, trường hợp khác thành giây.
- `Bn` (L1, UTF-16 [3048]): hướng dẫn dùng cho Hồi Xuân/Đại Hồi Xuân, Hồi Linh/Đại Hồi Linh, Tụ Linh/Đại Tụ Linh, Độ Kiếp Đan, Tẩy Sát Đan.
- `S` (L1, UTF-16 [3706]): ghi chú cho `heal`, `mana`, `regen`, `attack`, `defense`, `exp`, `cultivate`, `cleanse`. Chuỗi gồm cooldown (ví dụ heal 10/20/15 giây, khi độ kiếp 1 giây; mana 10/20 giây; cleanse chia sẻ 15 giây), không cộng dồn, chỉ nhận XP diệt quái. Chỉ là dữ liệu hiển thị, không chứng minh xử lý tác dụng.

## Thứ tự điều kiện `K(n)` — L3, UTF-16 [5023]

Thứ tự quan trọng vì nhánh đầu tiên trúng sẽ trả ngay:

1. `n===J`: item hương thưởng nạp, icon và mô tả `+20% tu vi` trong 30 phút thời gian chơi, tối đa 60 phút/ngày; ranh giới server chưa xác minh.
2. `I[n]`: trứng thú từ boss, `mount`, `boss` dùng đặt icon, category thú cưỡi, mô tả ngoại hình và giới hạn sở hữu.
3. `n===U` và `n===Q`: item Hắc Long, Côn Bằng; ghép passive + description của `x["hac-long"]`/`x["con-bang"]` vào văn bản.
4. `n==="Tẩy Linh Đan" || n==="Tẩy Tủy Đan"`: đọc công thức trong `L`, ghi hướng dẫn đổi hệ linh căn/hoàn điểm hoặc hoàn điểm tiềm năng; phí 1 viên/lần và lần đầu miễn phí là **mô tả UI**, không chứng nhận quy tắc thực thi.
5. Bốn đan phục hồi cố định: Hồi Xuân Đan 35% HP, Đại Hồi Xuân Đan 75% HP, Hồi Linh Đan 35% MP, Đại Hồi Linh Đan 75% MP; icon `v2:*`; rarity lần lượt `1` hoặc `2`.
6. `t=Z[n]` hoặc `n==="Tụ Linh Đan"`: tạo mô tả tùy `t.kind` (`heal`, `heal-pct`, `regen`, `attack`, `defense`, `exp`, `cultivate`, `cleanse`, `tribulation`, `cleanse-pk`; loại khác dùng `t.note`). Dùng `t.hpPct`, `t.regenPct`, `t.v`, `t.dur` và `C()`. Riêng `Tụ Linh Đan` ghi ×2 tu vi trong 60 phút bế quan. Giá trị cụ thể của `Z` ngoài những gì branch cố định hiển thị là **UNKNOWN** khi chưa có module trang bị.
7. Regex `/ cấp ([2-5])$/`: bỏ hậu tố, tra `Y.find(a=>y[a].material===r)`, nếu trúng trả metadata cấp cao, rarity `Math.min(5,1+Number(e[1]))`, ghi ghép 3 viên cấp trước và hiệu quả × cấp; lấy `K(r)` đệ quy.
8. Vật liệu hệ thuộc `Y/y`: icon tùy hệ `moc`, `thuy`, `tho`; mô tả cộng `tn`, `hn`, `an`, nguyên liệu `z`, `nn`; không tính sát thương thật.
9. Bảng vật liệu khóa bằng `vn`, `bn`, `Tn`, `kn`, `$n`, `yn`, `fn`: icon tương ứng đá cường hóa/tẩy luyện/khóa dòng/bột rèn/phù bảo hiểm/thức tỉnh/hộp thời trang, kèm text về mục đích và nguồn.
10. `cn[n]`: metadata thời trang với `cn`, `en`, `gn`, `N({id:...})`; grade `3+2*d.tier`, mô tả `% atk/hp` từ `a.atkPct`,`a.hpPct`. Chưa xác nhận dữ liệu các tier.
11. `E(n)`: nhận dạng ngọc khảm, icon theo hệ và level; rarity `Math.min(9,f.lv-1)`, mô tả từ `sn(f.el,f.lv)` và ghép 3 viên cùng cấp.
12. Regex `/^(Nhất|Nhị|Tam|Tứ|Ngũ|Lục|Thất) Tinh Linh Châu$/`: icon `px:kt/linh-chau-1..7`.
13. Item tên cố định: `Dịch Căn Đan`, `Bí cảnh lệnh`, `Cảnh giới tinh hoa` (ghi nâng cảnh trang bị từ Nguyên Anh; mỗi bậc k cần k−2 viên).
14. `m[n]` trong JSON metadata: nếu có, trả trực tiếp.
15. `n.startsWith("Mảnh ")`: tra `rn.find($=>un($.id)===n)`, `ln(a.id)` lấy hình, mô tả ghép 100 mảnh thần binh hoặc tinh luyện.
16. `n===dn`: bí kíp Vạn Kiếm; tra ngược `Object.entries(pn)` cho bí kíp truyền thừa còn lại.
17. Không trúng: `{i:"",g:0,c:"Khác"}`.

## Công thức và ngưỡng hiển thị được xác nhận trong source

- `Math.round(t.hpPct*100)`, `Math.round(t.regenPct*100)`, `Math.round(t.v*100)` để đổi tỷ lệ sang %.
- Hồi HP theo % có thể ghi mức tối thiểu `t.v`; regen hiển thị `t.v*t.dur` hoặc tối thiểu HP/s, phụ thuộc nhánh.
- Kinh nghiệm dùng `t.dur/60` phút; bế quan dùng `t.dur/3600` giờ; số giây chia 60 nếu `>=120` và chia hết cho 60.
- Trường hợp thiếu `m[n]`, metadata mặc định `{i:"",g:1}` trong `G`; fallback `K` là `{i:"",g:0,c:"Khác"}`.
- Mô tả: 3 đá cấp thấp → 1 đá cấp cao; 3 ngọc cấp thấp → 1 ngọc cấp cao; 100 mảnh → 1 thần binh. **Chưa xác minh** quy trình ghép phía server.

## Vấn đề tiềm ẩn và chưa xác minh

- `K(n)` gọi `n.startsWith(...)`: nếu `n` không là chuỗi, có thể gây lỗi; caller contract **UNKNOWN**. Một số nhánh gọi `n.id.startsWith` tương tự.
- Dữ liệu `m`,`L` ban đầu rỗng; phải gọi `In` và chờ Promise mới có đủ metadata; **UNKNOWN** caller có làm điều đó.
- Regex phân giải cấp chỉ nhận đúng hậu tố cấp 2..5, không xác minh hệ cấp khác.
- Các lời ghi trong `Bn`, `S` có thể khác logic game hoặc server. Không suy ra mức sát thương/cooldown thực tế từ mô tả UI.
