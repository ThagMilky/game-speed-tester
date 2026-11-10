# 04 AUTH PROFILE STORAGE

**Nguồn:** `source/index-BIkbGDKp.js` (được giữ nguyên). **Quy ước:** `CONFIRMED` = suy ra trực tiếp từ mã nguồn; `INFERRED` = diễn giải có căn cứ nhưng chưa kiểm nghiệm; `UNKNOWN` = cần module/thiết bị/máy chủ. Offset là khoảng **[start,end)** theo chỉ số ký tự UTF-16 của JavaScript (0-based), không phải byte; số dòng 1-based. Không chạy game, không xác nhận hành vi runtime.

## Đăng nhập và lưu trữ
- CONFIRMED: khóa `tm-token`/`tm-remember` thay đổi theo query `slot`; `tm-remember-off`, `tm-last-user`. `$t` (UTF-16 [6720, 6914), L2–L2) lưu token vào `sessionStorage`, tùy chọn ghi user/token vào `localStorage`; `ye` (UTF-16 [6914, 6997), L2–L2) xóa các token tương ứng; `Bt` (UTF-16 [6997, 7086), L2–L2) đọc remember JSON.
- CONFIRMED: `_o` (UTF-16 [80851, 95386), L400–L441) dựng UI đăng nhập, khách, đăng ký, quên mật khẩu; gọi GET `/api/auth/email` timeout **3,000 ms** để quyết định đăng ký có bước Gmail; POST `/api/auth/register/start`, `/api/auth/register/verify`, `/api/auth/register/complete`, `/api/auth/reset/start`, `/api/auth/reset/finish` timeout **18,000 ms**.
- CONFIRMED: client yêu cầu username regex `^[a-z0-9_]{3,20}$`, tên hiển thị Unicode 2–16 ký tự, email regex đơn giản, pass tối thiểu **6** ký tự, OTP **6** chữ số; UI thông báo OTP hiệu lực **10 phút** (chỉ là văn bản UI).
- CONFIRMED: guest gửi `{t:"hello",guest:{name,skinId}}`; login gửi `{t:"hello",user,pass}`; phiên nhớ gửi `{t:"hello",token}`. `Ne` (UTF-16 [80615, 80851), L400–L400) có logic lưu thông tin đăng nhập vào `navigator.credentials` khi khả dụng.
- CONFIRMED: `Kt` (UTF-16 [5951, 6292), L2–L2) đọc `tm-save2`, fallback di chuyển một số trường từ `tm-save`; `to` (UTF-16 [4369, 4488), L2–L2) chuẩn hóa `skinId`, `classId`; `classId=untrained` nếu thiếu root hoặc class không hợp lệ.
- CONFIRMED: danh sách môn phái `Qe` và ngoại hình `F` được định nghĩa trong entry; mapping legacy qua `ve` (UTF-16 [4230, 4368), L2–L2).
- UNKNOWN: thời gian hiệu lực của guest, OTP, token và quyền truy cập là do server quyết định; giao diện chỉ cung cấp nội dung mô tả và yêu cầu.

## Symbol lookup chi tiết

- `_o` (UTF-16 [80851, 95386), L400–L441) — `async_function`; lời gọi trực tiếp/gián tiếp trong AST: `gt`, `fetch`, `AbortSignal.timeout`, `n.json`, `Promise`, `document.createElement`, `appendChild`, `forEach`, `i.querySelectorAll`, `add`, `f.setAttribute`, `setProperty`, `$e`, `l`, `b.addEventListener`, `W.addEventListener`, `i.querySelector`, `Le`.
- `Oo` (UTF-16 [95386, 96637), L441–L441) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `gt`, `Promise`, `document.createElement`, `append`, `$e`, `o.querySelector`, `Te`, `a.preventDefault`, `replace`, `trim`, `normalize`, `test`, `o.remove`, `e.remove`, `t`.
- `Ne` (UTF-16 [80615, 80851), L400–L400) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `mt`, `catch`, `store`, `e`.
- `Io` (UTF-16 [80481, 80531), L400–L400) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `t.includes`, `toLowerCase`, `t.trim`, `lt`.
- `lt` (UTF-16 [80131, 80247), L400–L400) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `replace`, `toLowerCase`, `t.normalize`.
- `ae` (UTF-16 [80532, 80554), L400–L400) — `variable`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `jo` (UTF-16 [80555, 80582), L400–L400) — `variable`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `No` (UTF-16 [80583, 80614), L400–L400) — `variable`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `Ft` (UTF-16 [6534, 6650), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.removeItem`, `localStorage.setItem`.
- `mt` (UTF-16 [6462, 6534), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.getItem`.
- `$t` (UTF-16 [6720, 6914), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `sessionStorage.setItem`, `t.includes`, `t.startsWith`, `localStorage.setItem`, `mt`, `JSON.stringify`.
- `Bt` (UTF-16 [6997, 7086), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `JSON.parse`, `localStorage.getItem`.
- `ye` (UTF-16 [6914, 6997), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `sessionStorage.removeItem`, `localStorage.removeItem`.
- `Vt` (UTF-16 [6650, 6720), L2–L2) — `function`; lời gọi trực tiếp/gián tiếp trong AST: `localStorage.getItem`.
- `Qe` (UTF-16 [3348, 3587), L2–L2) — `object`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `F` (UTF-16 [3614, 4203), L2–L2) — `array`; lời gọi trực tiếp/gián tiếp trong AST: không xác định.
- `fe` (UTF-16 [4204, 4229), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `F.some`.
- `ve` (UTF-16 [4230, 4368), L2–L2) — `arrow_function`; lời gọi trực tiếp/gián tiếp trong AST: `F.find`.
