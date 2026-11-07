# Hướng dẫn làm việc với Game Speed Tester

## Giao tiếp và phạm vi

- Trao đổi bằng tiếng Việt đơn giản. Prompt/report dành cho Agent viết bằng English.
- Task chỉ review/phân tích: chỉ đọc, báo `Changes: None`. Yêu cầu tạo prompt chỉ tạo prompt.
- Task lớn chưa rõ hướng: phân tích và đưa plan ngắn, chờ chốt trước khi sửa. Đã duyệt hoặc yêu cầu làm trực tiếp thì không hỏi lại.
- Chỉ thực hiện task hiện tại; đề xuất, handoff và plan cũ không tự cấp quyền mới.
- Giữ thay đổi nhỏ, architecture và tính năng đang hoạt động; không refactor, thêm dependency/quyền extension hoặc sửa issue ngoài scope nếu không cần.

## Workflow dựa trên Wiki

Áp dụng cho feature, sửa đổi, debug và tối ưu:

1. Đọc AGENTS.md và tham khảo `GAME_ASSET_WIKI_v0.7.md` ở root trước.
2. Xác định hệ thống game liên quan; dùng asset registry/feature routing của Wiki để khoanh vùng bundle cần đọc.
3. Đọc flow extension hiện có và tái sử dụng source/thông tin đã có trước khi yêu cầu file ngoài.
4. Không tự động xin source cho mọi task. Nếu extension và Wiki đã đủ để xử lý an toàn, tiếp tục.
5. Nếu thiếu source thực sự cần thiết, chỉ xin file cụ thể và giải thích lý do. Không xin toàn bộ assets trừ khi task thực sự cần.
6. Trước khi sửa dựa vào implementation game cụ thể, đối chiếu source thật, imports/exports, chữ ký hàm và call site liên quan.
7. Phân biệt hành vi được source xác nhận, giả định và hành vi runtime chưa kiểm chứng.

Quy tắc xin source trong AGENTS.md này được ưu tiên hơn các câu trong Wiki yêu cầu luôn xin full current source: chỉ xin khi thiếu source cần thiết hoặc phiên bản chưa đủ căn cứ; không xin lại file đã có và phù hợp.

Nếu Wiki thiếu: báo rõ, không bịa nội dung hoặc tuyên bố đã đọc. Có thể tiếp tục phần độc lập bằng source sẵn có; nếu task phụ thuộc routing/thông tin trong Wiki thì xin đúng file này trước.

## Wiki là bản đồ điều hướng, không phải bằng chứng runtime

- Tên class/hàm minified, dependency và hành vi trong Wiki có thể thuộc bản game cũ; không mặc định bản deployed hiện tại giống hệt.
- Không bịa hàm, biến, event, network message hoặc API từ suy đoán.
- Ưu tiên source mới do người dùng cung cấp. File WorldScene.js/index.js có thể là bản đổi tên của hashed bundle nhưng phải xác minh khi phiên bản ảnh hưởng kết quả.
- Khi có cả hai bản, so sánh hash; kiểm tra imports/exports và code liên quan, không chỉ tên file.
- Source sẵn có có thể nằm trong `work/` hoặc đường dẫn người dùng đã cung cấp; kiểm tra tồn tại trước khi dùng. Không mặc định đường dẫn lịch sử còn đúng.
- Khi được cung cấp asset mới: đọc hệ thống liên quan, cập nhật registry/routing trong Wiki bằng thông tin đã xác minh, giữ entry hữu ích và ghi limitations/version. Nếu chưa có Wiki gốc, xin file trước khi cập nhật.
- Không tự sửa Wiki chỉ vì extension đổi code mà không có thông tin game-source mới đã xác minh.

## Source game cục bộ do người dùng cung cấp

- Ưu tiên đọc source đã có trong `game-reference/` của repository. Chỉ kiểm tra `C:\Users\Milk\Downloads\Game` khi Agent thực sự có quyền truy cập máy cục bộ; không giả định ChatGPT/GitHub connector đọc được đường dẫn này.
- Đây là snapshot source game hiện được người dùng lưu, không bảo đảm trùng bản game live trong tương lai. Game có thể cập nhật nội dung, tên bundle/hash và tên minified.
- Không phụ thuộc tên file cố định: liệt kê file hiện có, dùng Wiki để định hướng rồi đối chiếu nội dung, imports/exports và call site để nhận diện đúng hệ thống. `WorldScene.js`/`index.js` có thể là tên người dùng đổi lại.
- Nếu thiếu file cần thiết, không xác định được file nào tương ứng, hoặc có nghi vấn về tên/phiên bản ảnh hưởng kết quả, hỏi người dùng ngắn gọn và nêu rõ điểm chưa chắc. Không yêu cầu lại toàn bộ source mặc định.
- Source trong thư mục cục bộ phục vụ đọc/đối chiếu; không tự sửa, di chuyển hoặc xóa. Chỉ lưu bản sao vào `game-reference/` khi được người dùng cho phép rõ ràng và repository đích phù hợp về quyền phân phối.

## Ranh giới implementation

- Ưu tiên sửa extension; không sửa bundle game/engine bên thứ ba trừ khi có nhu cầu thực sự và quyền phù hợp.
- Không sửa damage, attack speed, cooldown, packet, authentication hoặc game server trong scope extension này.
- Không nhầm presentation phía client với quyền quyết định server; ghi client HP/FX/movement không chứng minh server thay đổi quy tắc.
- Ưu tiên integration point ổn định thay vì hardcode tên minified. Thiếu API/đổi version phải nhường lại game và báo trạng thái rõ.
- Giữ dispatcher `farm-update.js`, đường đi native và ownership giữa farm/quest/seals/realm/chest/harvest; không thêm combat engine hoặc vòng di chuyển cạnh tranh.
- Không deploy, restart service hoặc sửa production config khi chưa có yêu cầu rõ.
- Không dùng subagent nếu người dùng chưa yêu cầu.

## Repo và Git

- Trước sửa: xác nhận repo/branch/worktree, status và diff liên quan.
- Không tự tạo/switch branch, merge, rebase, reset, clean, stash hoặc ghi đè local/untracked ngoài task.
- Review diff/status sau sửa; việc này không phải QA/test.
- Mặc định commit phần task trên branch hiện tại khi implementation hoàn tất và không có blocker rõ. Chỉ stage đúng scope; kiểm tra `.gitignore`, file được track; không commit secret, .env, dependency hay runtime data.
- Chỉ push khi người dùng yêu cầu; không force-push. Nếu chỉ review/local-only/chưa commit thì không commit.
- Không theo dõi CI tự động. Báo đúng commit/push thất bại nếu có.

## Tests và bằng chứng

- Không tự chạy tests, regression, smoke, lint, typecheck, benchmark, browser QA hoặc live E2E nếu người dùng chưa yêu cầu rõ cho công việc đang thực hiện.
- Khi đã được yêu cầu, chọn checks phù hợp scope. Review source/diff được phép trong task, không thay thế kết quả thực thi.
- Test chưa chạy: `NOT RUN`; CI chưa xem: `NOT CHECKED`; runtime chưa xác minh: `UNVERIFIED`.
- Phân biệt fixture/VM/DOM giả, browser thật, gameplay và receipt server. Không dùng kết quả lịch sử làm bằng chứng cho HEAD hiện tại.
- Không thêm yêu cầu live API/model/game call hoặc hành động phá hủy từ plan/handoff cũ.
- Không để lộ token, credential, raw packet hoặc secret trong log/báo cáo. Dùng `[REDACTED_SECRET]` khi cần mô tả secret bị lộ.

## Xin source và báo kết quả

Khi thực sự thiếu source:

**Files cần cung cấp:**

- `filename.js` — lý do cần file này.

**Mục đích:** phần cần kiểm tra.

Khi hoàn tất: nêu thay đổi, các file extension sửa (gọn), source game đã đọc, checks thực tế, Git, limitations/blocker. Không nhận định PASS/verified khi chưa có kết quả.

## Trạng thái setup

- AGENTS.md được tạo từ yêu cầu setup Wiki-driven workflow ngày 2026-11-05.
- Đã đưa `GAME_ASSET_WIKI_v0.7.md` từ Downloads vào root và đọc toàn bộ ngày 2026-11-05. Giữ nguyên bản gốc trong Downloads và nội dung Wiki.
- Wiki v0.7 là reconstructed reference edition, có provenance/limitations riêng; các nhãn CONFIRMED trong Wiki là bằng chứng lịch sử của tác giả, không phải xác minh live hoặc toàn bộ source trong lần setup này.
- Setup workflow đã hoàn tất; chưa triển khai các đề xuất tính năng cũ (auto click, rương, cổng) từ bước setup này.

## Game source snapshots

- Game source snapshots are available in `game-reference/`.
- Read `GAME_ASSET_WIKI_v0.7.md` to identify the relevant files before implementing a feature.
- Use the available snapshots before requesting additional source from the user.
- Treat these files as read-only reference material.
- Do not modify, regenerate, or include game source files in the extension runtime.
- Do not assume the snapshots match the current live game.
- Request updated files only when the available source is missing, outdated, or insufficient.
- Keep game source changes separate from extension implementation changes.
