# WEEK 17 — SYSTEM INTEGRATION & END-TO-END USER JOURNEY

## Tháng 5: Integration, Testing & Finalisation
**Milestone:** `W17 - Integration`  
**Thời gian:** Ngày 113 – Ngày 119 (14/12/2026 – 20/12/2026)  
**Nhánh chính:** `test/system-integration` (tách từ `develop`)  
**Mục tiêu tuần:** Kết nối toàn bộ 6 module thành một hệ sinh thái duy nhất không có vết nối (Seamless Ecosystem), kiểm thử toàn bộ luồng hành trình người dùng (Full User Journey) từ Đăng ký ➔ Tìm kiếm ➔ Lập lịch trình ➔ Khám phá ➔ Check-in ➔ Quiz ➔ Nhận Badge ➔ Đăng bài Verified trên Diễn đàn.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 113: AUTHENTICATION TO BOOKING & ITINERARY WIRING (14/12/2026)
* **Mục tiêu:** Kết nối luồng thông tin người dùng từ Auth sang Module Booking và chuyển kết quả tìm kiếm vào Lập lịch trình Itinerary.
* **Nhiệm vụ cụ thể:**
  1. Tính năng "Thêm chuyến bay/khách sạn vào Lịch trình":
     * Trên màn hình kết quả tìm kiếm chuyến bay hoặc khách sạn ➔ Bấm nút *"Thêm vào chuyến đi"*.
     * Mở Modal chọn chuyến đi hiện có (ví dụ: *"Chuyến đi Đà Nẵng 3N2Đ"*) hoặc tạo chuyến đi mới.
     * Tự động thêm thông tin chuyến bay vào Ngày 1 (Giờ cất cánh/hạ cánh) và Khách sạn vào Ngày 1 & Ngày 2.
  2. Kiểm tra tính đồng bộ dữ liệu giữa PostgreSQL (User) và MongoDB (Itinerary).
* **Sản phẩm đầu ra:**
  * Luồng chuyển tiếp từ Booking sang Itinerary.
* **Git Commit:** `feat(integration): seamlessly bridge booking search results into itinerary planner items`
* **DoD:** Chọn chuyến bay trong màn hình Booking lập tức xuất hiện trong lịch trình chuyến đi của user.

---

### 🔹 DAY 114: ITINERARY TO LANDMARK GEOFENCE WIRING (15/12/2026)
* **Mục tiêu:** Kết nối các địa điểm tham quan trong Lịch trình với Danh mục Địa danh Gamification để kích hoạt Check-in ngay từ Lịch trình.
* **Nhiệm vụ cụ thể:**
  1. Khi người dùng mở xem Lịch trình Ngày 1 và thấy địa điểm "Cầu Rồng":
     * Hệ thống tự động so khớp `destinationName` với bảng `landmarks` trong PostgreSQL.
     * Nếu tìm thấy địa danh tương ứng ➔ Hiển thị huy hiệu nhỏ *"Địa danh có Quiz (+150 XP)"* và nút *"Bắt đầu Check-in"* ngay trên thẻ lịch trình.
  2. Bấm vào nút Check-in từ Lịch trình tự động chuyển sang luồng quét GPS và mở Camera.
* **Sản phẩm đầu ra:**
  * Tích hợp sâu giữa Itinerary và Gamification.
* **Git Commit:** `feat(integration): connect itinerary destinations directly with landmark checkin triggers`
* **DoD:** Người dùng có thể bắt đầu quá trình Check-in và làm Quiz trực tiếp từ giao diện Lịch trình.

---

### 🔹 DAY 115: GAMIFICATION TO USER PROFILE & LEVEL PROGRESSION (16/12/2026)
* **Mục tiêu:** Đảm bảo toàn bộ điểm XP, Cấp độ Level và Huy hiệu đạt được sau khi Check-in & Quiz lập tức cập nhật đồng bộ trên toàn bộ ứng dụng.
* **Nhiệm vụ cụ thể:**
  1. Cấu hình cơ chế cập nhật trạng thái toàn cục (Global State Update) qua React Context / Redux / Event Emitter.
  2. Ngay khi nộp bài Quiz đạt kết quả tốt ➔ Điểm XP trên thanh Header của Home, Profile và Drawer tự động nhảy số thời gian thực.
  3. Lịch sử các địa danh vừa ghé thăm lập tức hiển thị trên Bản đồ nhiệt (Heatmap / Visited Map) trong trang cá nhân.
* **Sản phẩm đầu ra:**
  * Đồng bộ trạng thái Gamification toàn cục.
* **Git Commit:** `feat(integration): establish real-time global state synchronization for xp, level, and badges`
* **DoD:** Vừa làm xong Quiz, mở trang Profile thấy Level và Badge đã được cập nhật mới ngay lập tức.

---

### 🔹 DAY 116: BADGE TO COMMUNITY FORUM VERIFICATION WIRING (17/12/2026)
* **Mục tiêu:** Kiểm tra và hoàn thiện mắt xích cuối cùng: Huy hiệu mở khóa ở Module 4 lập tức biến người dùng thành "Chuyên gia thành phố" trong Module 5.
* **Nhiệm vụ cụ thể:**
  1. Người dùng vừa mở khóa *Da Nang Explorer Badge* ➔ Chuyển sang Tab Community ➔ Mở mục hỏi đáp Đà Nẵng.
  2. Hệ thống hiển thị Banner chúc mừng: *"Bạn đã là thành viên Verified của Đà Nẵng! Mọi câu trả lời của bạn sẽ được ưu tiên hiển thị với huy hiệu xác thực"*.
  3. Đăng câu trả lời mới ➔ Xác nhận thẻ câu trả lời có viền vàng và nhãn *Da Nang Verified*.
* **Sản phẩm đầu ra:**
  * Luồng liên kết trọn vẹn giữa Gamification và Diễn đàn.
* **Git Commit:** `feat(integration): complete badge to community verified credibility feedback loop`
* **DoD:** Mở khóa huy hiệu làm thay đổi trạng thái và giao diện đăng bài trong diễn đàn ngay lập tức.

---

### 🔹 DAY 117: FULL 19-STEP SCENARIO END-TO-END REHEARSAL (18/12/2026)
* **Mục tiêu:** Chạy thử nghiệm toàn bộ kịch bản 19 bước MVP (MVP Success Scenario) từ đầu đến cuối không dừng trên môi trường Staging.
* **Nhiệm vụ cụ thể:**
  1. Thực hiện lần lượt 19 bước:
     1. Đăng ký tài khoản mới ➔ 2. Đăng nhập ➔ 3. Tìm vé máy bay ➔ 4. Tìm khách sạn ➔ 5. Tạo chuyến đi ➔ 6. Thêm địa điểm ➔ 7. Kéo thả đổi thứ tự ➔ 8. Xem lộ trình trên Google Maps ➔ 9. Lưu chuyến đi ➔ 10. Mở danh mục Địa danh ➔ 11. Quét GPS tại Cầu Rồng ➔ 12. Xác thực Geofence $\le 100\text{m}$ ➔ 13. Mở Camera chụp ảnh ➔ 14. Tải ảnh lên Cloudinary ➔ 15. Làm bài Quiz văn hóa ➔ 16. Chấm điểm đạt 100% ➔ 17. Nhận XP và mở khóa Da Nang Badge ➔ 18. Mở Diễn đàn Đà Nẵng ➔ 19. Đăng câu trả lời và nhận nhãn "Da Nang Verified".
  2. Ghi lại các điểm nghẽn, lỗi giao diện hoặc giật lag phát sinh trong quá trình chạy liên hoàn.
* **Sản phẩm đầu ra:**
  * Nhật ký kiểm thử tích hợp `documentation/10-testing/01-e2e-rehearsal-log.md`.
* **Git Commit:** `test(integration): execute complete 19-step end-to-end user journey rehearsal`
* **DoD:** Toàn bộ 19 bước thực thi thành công không bị gián đoạn hay phát sinh lỗi crash.

---

### 🔹 DAY 118: DATA INTEGRITY & ORPHAN RECORD AUDIT (19/12/2026)
* **Mục tiêu:** Rà soát tính toàn vẹn dữ liệu giữa PostgreSQL và MongoDB sau khi chạy liên tục các kịch bản người dùng phức tạp.
* **Nhiệm vụ cụ thể:**
  1. Viết script kiểm toán dữ liệu `server/scripts/auditDataIntegrity.js`:
     * Kiểm tra xem có `itinerary` hoặc `forum_post` nào trong MongoDB tham chiếu tới `userId` không tồn tại trong PostgreSQL hay không.
     * Kiểm tra xem có `checkin` nào trong PostgreSQL tham chiếu tới `landmark_id` bị xóa hay không.
  2. Đảm bảo toàn bộ các giao dịch liên cơ sở dữ liệu đều có cơ chế xử lý ngoại lệ an toàn.
* **Sản phẩm đầu ra:**
  * Script kiểm toán dữ liệu và báo cáo toàn vẹn.
* **Git Commit:** `test(integrity): audit cross-database relational integrity between postgres and mongo`
* **DoD:** Báo cáo kiểm toán hiển thị 0 bản ghi mồ côi (Zero Orphaned Records).

---

### 🔹 DAY 119: WEEK 17 REVIEW & INTEGRATION SIGN-OFF (20/12/2026)
* **Mục tiêu:** Tổng kết Tuần 17, nghiệm thu tính liên thông toàn hệ thống, viết báo cáo tuần và đóng Milestone Tuần 17.
* **Nhiệm vụ cụ thể:**
  1. Rà soát lại tất cả các luồng tích hợp giữa 6 module.
  2. Viết tài liệu tổng kết tuần `W17-Review-Summary.md`.
  3. Đóng Milestone `W17 - Integration` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-17-review.md`.
* **Git Commit:** `docs: sign-off system integration milestone and close W17 - Integration`
* **DoD:** Toàn bộ hệ thống Nomadix đã được kết nối hoàn chỉnh thành một khối thống nhất.
