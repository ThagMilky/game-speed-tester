# 03 SNAPSHOT STATE

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Giải nén trạng thái
- CONFIRMED: `eo` (UTF-16 [4807, 5931), L2–L2) có `self={}`, `seen=new Set`. `eo.decode` (UTF-16 [4871, 5930), L2–L2) xử lý `reset`, danh sách `self` delta theo đường dẫn `a.b`, `ents` và `gone`, `ev`, `time`.
- CONFIRMED: trường entity được ánh xạ từ mask bit theo `wt=["x","y","d","a","hp","fx"]`; bit `1<<r` quyết định có trường, giá trị bắt đầu từ vị trí **2** của mảng entry.
- CONFIRMED: khi `reset`, `self` khởi tạo lại, `seen` cũ không xuất hiện trong `ents` được thêm vào `gone`; `gone` được khử trùng lặp bằng Set.
- CONFIRMED: từ chối path segment/key `__proto__`, `constructor`, `prototype`, ngăn ghi prototype qua snapshot delta.
- CONFIRMED: dọn `self.realm.inside.boss` rỗng, `inside` rỗng, `realm` rỗng; trả `{t:"snap",time,self,ents,gone,ev}`.
- UNKNOWN: ý nghĩa chính xác `d`, `a`, `fx`, khoảng lượng tử tọa độ, chu kỳ tick, thứ tự giao thức và điều kiện nào khiến server phát `reset`/`gone`.

## Symbol lookup chi tiết

- `eo` (UTF-16 [4807, 5931), L2–L2) — `class`; lời gọi trực tiếp/gián tiếp trong AST: `L`, `Set`, `i.split`, `s.slice`, `Error`, `Object.keys`, `map`, `Array.isArray`, `filter`, `n.has`, `clear`, `add`, `delete`, `Object.assign`.
- `wt` (UTF-16 [4746, 4776), L2–L2) — `array`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `cn` (UTF-16 [4494, 4499), L2–L2) — `variable`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
