# WEEK 16 — COMMUNITY Q&A, VERIFIED TRUST ENGINE & MONTH 4 DEFINITION OF DONE

## Tháng 4: Gamification & Community (USP)
**Milestone:** `W16 - Community` & `M4 - Gamification & Community`  
**Thời gian:** Ngày 106 – Ngày 112 (07/12/2026 – 13/12/2026)  
**Nhánh chính:** `feature/community-forum` (tách từ `develop`)  
**Mục tiêu tuần:** Hoàn thiện Diễn đàn Hỏi đáp du lịch (Community Q&A) kết nối với Cỗ máy Xác thực Uy tín ("City Verified" Trust Engine) — Khép kín toàn bộ vòng đời du lịch độc quyền của Nomadix và đóng Milestone Tháng 4.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 106: COMMUNITY FORUM BACKEND SERVICE (MONGODB) (07/12/2026)
* **Mục tiêu:** Xây dựng hệ thống API cho diễn đàn hỏi đáp lưu trữ trên MongoDB, phân loại theo Quốc gia, Thành phố và Chủ đề.
* **Nhiệm vụ cụ thể:**
  1. Hoàn thiện Mongoose Models: `ForumQuestion.js` và `ForumAnswer.js`.
  2. Viết các API:
     * `GET /api/v1/community/questions`: Lấy danh sách câu hỏi (Lọc theo `?city=Da Nang&category=Food`, hỗ trợ phân trang).
     * `POST /api/v1/community/questions`: Tạo câu hỏi mới (Tiêu đề, Nội dung, Thành phố, Tags).
     * `GET /api/v1/community/questions/:id`: Lấy chi tiết câu hỏi và toàn bộ danh sách câu trả lời.
     * `POST /api/v1/community/questions/:id/answers`: Đăng câu trả lời.
     * `POST /api/v1/community/answers/:id/upvote`: Bấm Thích / Hữu ích cho câu trả lời.
* **Sản phẩm đầu ra:**
  * `community.controller.js`, `community.service.js`, `community.routes.js`.
* **Git Commit:** `feat(community): implement mongodb forum qna backend service with city filtering`
* **DoD:** Thực hiện đầy đủ các thao tác đăng câu hỏi, trả lời và upvote thành công qua API.

---

### 🔹 DAY 107: "CITY VERIFIED" CREDIBILITY ATTACHMENT ENGINE (08/12/2026)
* **Mục tiêu:** Xây dựng cỗ máy liên kết dữ liệu thời gian thực giữa PostgreSQL (Huy hiệu) và MongoDB (Bài viết) để tự động gắn nhãn "City Verified" cho các câu trả lời uy tín — **Trọng tâm đề tài FYP**.
* **Nhiệm vụ cụ thể:**
  1. Triển khai logic kiểm tra xác thực trong `server/src/services/community.service.js`:
     * Khi người dùng trả lời câu hỏi thuộc chủ đề `city = "Da Nang"`:
     * Service tự động truy vấn PostgreSQL: `SELECT * FROM user_badges WHERE user_id = $1 AND badge_id IN (SELECT id FROM badges WHERE city = 'Da Nang')`.
     * Nếu tìm thấy bản ghi ➔ Gán `isCityVerified = true`, `hasCityBadge = true`, `verifiedBadgeTitle = "Da Nang Explorer"` vào tài liệu câu trả lời bên MongoDB.
     * Nếu không tìm thấy ➔ Gán `isCityVerified = false`.
  2. Cơ chế sắp xếp ưu tiên: Các câu trả lời có gắn nhãn "City Verified" sẽ tự động được đẩy lên đầu danh sách câu trả lời (Pinned / Top Answers).
* **Sản phẩm đầu ra:**
  * Logic xác thực uy tín liên cơ sở dữ liệu (Cross-DB Verification Logic).
* **Git Commit:** `feat(community): build dynamic cross-database city verified trust attachment engine`
* **DoD:** Người dùng có Huy hiệu Đà Nẵng đăng câu trả lời tự động nhận nhãn `isCityVerified: true` và được xếp lên đầu.

---

### 🔹 DAY 108: MOBILE COMMUNITY FORUM FEED & FILTERING UI (09/12/2026)
* **Mục tiêu:** Xây dựng giao diện Bảng tin Diễn đàn hỏi đáp trên React Native với thanh chọn thành phố và danh mục chủ đề.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng màn hình `CommunityFeedScreen.js`:
     * Thanh cuộn ngang chọn thành phố: *Tất cả*, *Đà Nẵng*, *Hà Nội*, *Hội An*, *TP.HCM*.
     * Thanh lọc chủ đề: *Ăn uống*, *Đi lại*, *Khách sạn*, *Địa điểm check-in*, *Lịch trình*.
     * Nút nổi (Floating Action Button) "+" để đặt câu hỏi mới.
  2. Component `QuestionCard.js`: Hiển thị Avatar tác giả, Tên, Tag thành phố, Tiêu đề câu hỏi, Số lượt trả lời, Số lượt upvote.
* **Sản phẩm đầu ra:**
  * `CommunityFeedScreen.js` và `QuestionCard.js`.
* **Git Commit:** `feat(client): build community forum feed with horizontal city tabs and topic filtering`
* **DoD:** Chuyển đổi giữa các thành phố lập tức tải danh sách câu hỏi tương ứng mượt mà.

---

### 🔹 DAY 109: MOBILE QUESTION DETAIL & VERIFIED ANSWER CARD UI (10/12/2026)
* **Mục tiêu:** Xây dựng màn hình Chi tiết câu hỏi với thiết kế đặc biệt nổi bật cho các câu trả lời từ người dùng "City Verified".
* **Nhiệm vụ cụ thể:**
  1. Xây dựng màn hình `QuestionDetailScreen.js`:
     * Hiển thị toàn văn nội dung câu hỏi, thời gian đăng, các tags.
     * Danh sách các câu trả lời bên dưới.
  2. Component `AnswerCard.js` (Phân biệt 2 trạng thái rõ rệt):
     * **Trạng thái Thường:** Khung viền xám nhạt, thông tin tác giả bình thường.
     * **Trạng thái Verified (Có Huy hiệu thành phố):** Khung viền mạ vàng nổi bật, huy hiệu vương miện/sao vàng cạnh avatar, dòng nhãn nổi bật: **"✓ Da Nang Verified — Đã khám phá 3 địa danh & hoàn thành Quiz"**.
  3. Nút "Hữu ích" (Upvote) kèm số đếm tăng giảm thời gian thực.
* **Sản phẩm đầu ra:**
  * `QuestionDetailScreen.js` và `AnswerCard.js`.
* **Git Commit:** `feat(client): render high-contrast verified answer cards with golden trust indicators`
* **DoD:** Câu trả lời của người có Huy hiệu hiển thị đẳng cấp và uy tín vượt trội so với người dùng thông thường.

---

### 🔹 DAY 110: MOBILE CREATE QUESTION & ANSWER SUBMISSION (11/12/2026)
* **Mục tiêu:** Xây dựng màn hình Đăng câu hỏi mới và khung nhập câu trả lời nhanh ở chân trang.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng màn hình `CreateQuestionScreen.js`:
     * Chọn Thành phố liên quan từ danh sách thả xuống.
     * Nhập tiêu đề câu hỏi (Ví dụ: *"Nên đi Cầu Rồng xem phun lửa vào thứ mấy?"*).
     * Nhập nội dung chi tiết và chọn tags liên quan.
  2. Khung soạn thảo câu trả lời (Bottom Sticky Input):
     * Gõ câu trả lời, bấm gửi ➔ Tự động thêm câu trả lời mới vào danh sách mà không cần reload toàn bộ trang.
* **Sản phẩm đầu ra:**
  * `CreateQuestionScreen.js` và `AnswerInputBar.js`.
* **Git Commit:** `feat(client): implement question creation form and real-time answer submission bar`
* **DoD:** Đăng câu hỏi và trả lời thành công hiển thị ngay lập tức trên giao diện.

---

### 🔹 DAY 111: COMMUNITY CONTENT MODERATION & REPORTING (12/12/2026)
* **Mục tiêu:** Xây dựng tính năng Báo cáo vi phạm (Report) và API kiểm duyệt nội dung cho Quản trị viên (Admin Moderation).
* **Nhiệm vụ cụ thể:**
  1. Bổ sung nút "Báo cáo" (Cờ báo cáo 3 chấm) trên từng câu hỏi và câu trả lời.
  2. Viết API: `POST /api/v1/community/report`:
     * Lưu lý do báo cáo: *Spam*, *Nội dung xúc phạm*, *Thông tin sai lệch*.
  3. Xây dựng API Quản trị: `GET /api/v1/admin/reports` và `DELETE /api/v1/admin/community/answers/:id` để xóa bài vi phạm.
* **Sản phẩm đầu ra:**
  * Module Moderation trên cả Server và Mobile.
* **Git Commit:** `feat: implement community content reporting and admin moderation endpoints`
* **DoD:** Người dùng có thể báo cáo bài viết xấu và Admin có quyền xóa bỏ bài viết đó.

---

### 🔹 DAY 112: MONTH 4 GRAND REVIEW & DEFINITION OF DONE (13/12/2026)
* **Mục tiêu:** Tổng kết toàn bộ Tháng 4, kiểm tra Month 4 Definition of Done, quay video demo kịch bản USP hoàn chỉnh (GPS ➔ Check-in ➔ Quiz ➔ Badge ➔ Verified Community) và đóng Milestone M4.
* **Nhiệm vụ cụ thể:**
  1. Đối soát bảng tiêu chuẩn **Month 4 Definition of Done (MVP USP Complete)**:
     - [x] Danh mục địa danh văn hóa và Geofencing ($\le 100\text{m}$) hoạt động chuẩn xác.
     - [x] Máy ảnh In-App Camera chụp và upload ảnh check-in lên Cloudinary thành công.
     - [x] Cỗ máy Quiz văn hóa chấm điểm, cộng XP và nâng cấp Level chính xác.
     - [x] Thuật toán mở khóa Huy hiệu thành phố (City Badge) hoạt động hoàn hảo.
     - [x] Diễn đàn hỏi đáp gắn đúng nhãn "City Verified" cho thành viên có huy hiệu.
     - [x] Khép kín 100% vòng đời du lịch độc quyền của Nomadix.
  2. Viết tài liệu tổng kết tháng `month-04-summary.md`.
  3. Đóng Milestone `M4 - Gamification & Community` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tổng kết Tháng 4 và video demo USP toàn diện.
* **Git Commit:** `docs: finalize month 4 milestone and close M4 - Gamification & Community`
* **DoD:** Toàn bộ tính năng MVP cốt lõi đã hoàn thành 100%; sẵn sàng bước vào Month 5 (Testing & Finalisation).
