# WEEK 15 — CULTURAL QUIZ ENGINE, XP PROGRESSION & BADGE UNLOCKING

## Tháng 4: Gamification & Community (USP)
**Milestone:** `W15 - Quiz & Badge`  
**Thời gian:** Ngày 99 – Ngày 105 (30/11/2026 – 06/12/2026)  
**Nhánh chính:** `feature/quiz-badges` (tách từ `develop`)  
**Mục tiêu tuần:** Xây dựng cỗ máy câu hỏi trắc nghiệm văn hóa (Cultural Quiz Engine), chấm điểm tự động, cộng điểm kinh nghiệm (XP) và thuật toán kích hoạt mở khóa Huy hiệu thành phố (City Badge Unlock Engine).

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 99: CULTURAL QUIZ DATA MODEL & RANDOMIZATION (30/11/2026)
* **Mục tiêu:** Xây dựng mô hình dữ liệu câu hỏi trắc nghiệm và thuật toán chọn ngẫu nhiên bộ câu hỏi cho từng địa danh.
* **Nhiệm vụ cụ thể:**
  1. Hoàn thiện bảng `quizzes` và `quiz_questions` trong PostgreSQL:
     * `quiz_questions`: `id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option` (Ẩn không trả về client khi làm bài), `explanation`.
  2. Viết API: `GET /api/v1/quizzes/:landmarkId`:
     * Lấy ngẫu nhiên 3 câu hỏi trắc nghiệm văn hóa liên quan đến địa danh (`ORDER BY RANDOM() LIMIT 3`).
     * Không trả về trường `correct_option` để chống gian lận (Anti-cheat) bằng cách soi Network inspect.
* **Sản phẩm đầu ra:**
  * `quiz.controller.js`, `quiz.service.js`.
* **Git Commit:** `feat(gamify): build cultural quiz bank schema and randomized question generator`
* **DoD:** Gọi API lấy bài quiz trả về đúng 3 câu hỏi ngẫu nhiên và bảo mật đáp án.

---

### 🔹 DAY 100: QUIZ SCORING & ATTEMPT LOGGING SERVICE (01/12/2026)
* **Mục tiêu:** Xây dựng service chấm điểm bài thi, lưu lịch sử thi và tự động tính toán thưởng XP.
* **Nhiệm vụ cụ thể:**
  1. Viết API: `POST /api/v1/quizzes/submit`:
     * Body: `{ landmarkId, answers: [{ questionId, selectedOption }] }`.
     * Xử lý: So khớp từng câu trả lời với đáp án trong DB ➔ Tính số câu đúng (ví dụ: $2/3$ câu $\approx 67\%$).
     * Điều kiện Đạt (Pass): Đúng tối thiểu $2/3$ câu ($\ge 66\%$).
  2. Lưu bản ghi vào bảng `quiz_attempts` (`user_id`, `quiz_id`, `score`, `is_passed`, `attempted_at`).
  3. Nếu Đạt: Tự động gọi `addXpToUser(userId, +150 XP)` và kích hoạt bộ đánh giá Huy hiệu (Badge Evaluator).
* **Sản phẩm đầu ra:**
  * Logic chấm điểm trong `quiz.service.js`.
* **Git Commit:** `feat(gamify): implement backend quiz scoring engine and automated xp award pipeline`
* **DoD:** Nộp bài đúng 3/3 nhận 100% điểm, cộng 150 XP và trả về giải thích chi tiết từng câu.

---

### 🔹 DAY 101: CITY BADGE UNLOCK EVALUATOR SERVICE (02/12/2026)
* **Mục tiêu:** Xây dựng thuật toán đánh giá điều kiện mở khóa Huy hiệu thành phố (City Badge Unlock Engine) — Trọng tâm xác thực của Nomadix.
* **Nhiệm vụ cụ thể:**
  1. Định nghĩa điều kiện mở khóa Huy hiệu Thành phố (Ví dụ: **Da Nang Explorer Badge**):
     * *Điều kiện 1:* Đã check-in tối thiểu **3 địa danh khác nhau** tại Đà Nẵng (Cầu Rồng, Ngũ Hành Sơn, Sơn Trà).
     * *Điều kiện 2:* Đã vượt qua (Passed) ít nhất **1 bài Cultural Quiz** tại Đà Nẵng.
  2. Viết service `server/src/services/badgeEvaluator.service.js`:
     * Hàm `evaluateCityBadgeEligibility(userId, city)`:
       * Đếm số check-in hợp lệ của user tại `city`.
       * Đếm số quiz đã pass của user tại `city`.
       * Nếu đủ điều kiện và chưa có badge ➔ Tự động `INSERT INTO user_badges` ➔ Thưởng thêm $+300\text{ XP}$ bonus ➔ Trả về cờ `unlockedBadge: { id, name, iconUrl }`.
* **Sản phẩm đầu ra:**
  * `badgeEvaluator.service.js` và Unit Tests.
* **Git Commit:** `feat(gamify): build automated city badge eligibility evaluation and unlock engine`
* **DoD:** User hoàn thành đủ 3 check-in và 1 quiz tự động mở khóa thành công Huy hiệu thành phố.

---

### 🔹 DAY 102: MOBILE CULTURAL QUIZ INTERACTIVE UI (03/12/2026)
* **Mục tiêu:** Xây dựng giao diện làm bài trắc nghiệm văn hóa trên React Native với hiệu ứng tương tác sinh động.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng màn hình `CulturalQuizScreen.js`:
     * Thanh tiến trình câu hỏi: Câu 1/3, Câu 2/3, Câu 3/3.
     * Đồng hồ đếm ngược 30 giây cho mỗi câu hỏi.
     * Thẻ câu hỏi nổi bật, 4 nút lựa chọn A, B, C, D to rõ, dễ bấm trên màn hình cảm ứng.
  2. Trạng thái lựa chọn: Bấm vào đổi màu nút (Selected), hỗ trợ nút "Tiếp tục" hoặc tự động chuyển câu.
* **Sản phẩm đầu ra:**
  * `CulturalQuizScreen.js` và component `QuizOptionButton.js`.
* **Git Commit:** `feat(client): build interactive cultural quiz ui with countdown timer and progress steps`
* **DoD:** Trải nghiệm làm bài trắc nghiệm mượt mà, trực quan và không bị lag khi chuyển câu.

---

### 🔹 DAY 103: QUIZ RESULT, XP COUNTER & BADGE UNLOCK CELEBRATION (04/12/2026)
* **Mục tiêu:** Xây dựng màn hình Tổng kết kết quả, hiệu ứng số đếm XP tăng vọt và Modal vinh danh khi mở khóa Huy hiệu mới.
* **Nhiệm vụ cụ thể:**
  1. Dựng màn hình `QuizResultScreen.js`:
     * Vòng tròn điểm số (ví dụ: *3/3 - Xuất sắc!*).
     * Danh sách xem lại giải thích lịch sử của các câu hỏi.
     * Hiệu ứng chữ nổi `+150 XP` bay lên.
  2. Dựng Modal chúc mừng `BadgeUnlockedModal.js`:
     * Hiệu ứng pháo hoa / Confetti rơi toàn màn hình.
     * Hình ảnh Huy hiệu thành phố mạ vàng xoay nhẹ.
     * Dòng chữ vinh danh: *"Chúc mừng! Bạn đã chính thức đạt danh hiệu Nhà khám phá Đà Nẵng!"*.
* **Sản phẩm đầu ra:**
  * `QuizResultScreen.js` và `BadgeUnlockedModal.js`.
* **Git Commit:** `feat(client): implement animated quiz result summary and celebration badge unlock modal`
* **DoD:** Mở khóa huy hiệu kích hoạt hiệu ứng chúc mừng rực rỡ và cập nhật lại điểm XP ngay tức thì.

---

### 🔹 DAY 104: BADGE SHOWCASE & CITY EXPLORER LEADERBOARD (05/12/2026)
* **Mục tiêu:** Xây dựng phòng trưng bày Huy hiệu (Badge Showcase) và Bảng xếp hạng du khách theo thành phố (City Leaderboard).
* **Nhiệm vụ cụ thể:**
  1. Component `BadgeDetailModal.js`: Bấm vào huy hiệu trên Profile hiển thị: Ngày đạt, Số địa danh đã ghé, Quyền lợi *"Da Nang Verified"* trong cộng đồng.
  2. Màn hình `CityLeaderboardScreen.js`: Hiển thị Top 10 du khách có nhiều XP và check-in nhất tại thành phố (Huy chương Vàng, Bạc, Đồng).
* **Sản phẩm đầu ra:**
  * Màn hình Bảng xếp hạng và Modal chi tiết huy hiệu.
* **Git Commit:** `feat(client): create badge showcase detail modal and top city explorers leaderboard`
* **DoD:** Bảng xếp hạng hiển thị đúng thứ tự người dùng có điểm XP cao nhất.

---

### 🔹 DAY 105: WEEK 15 REVIEW & GAMIFICATION INTEGRATION TEST (06/12/2026)
* **Mục tiêu:** Kiểm thử liên hoàn chuỗi tính năng Gamification: Check-in ➔ Quiz ➔ XP ➔ Mở khóa Badge ➔ Hiển thị Profile, viết báo cáo tuần và đóng Milestone.
* **Nhiệm vụ cụ thể:**
  1. Kiểm thử kịch bản đầy đủ trên điện thoại: Check-in 3 địa danh Đà Nẵng ➔ Làm bài quiz ➔ Đạt kết quả tốt ➔ Nhận thông báo mở khóa Da Nang Badge ➔ Kiểm tra trang Profile thấy Badge sáng màu.
  2. Viết tài liệu tổng kết tuần `W15-Review-Summary.md`.
  3. Đóng Milestone `W15 - Quiz & Badge` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-15-review.md`.
* **Git Commit:** `test(gamify): verify complete gamification progression loop and close milestone W15`
* **DoD:** Toàn bộ chuỗi Gamification hoạt động hoàn hảo 100%; Milestone W15 hoàn tất.
