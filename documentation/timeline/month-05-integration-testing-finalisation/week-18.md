# WEEK 18 — COMPREHENSIVE TESTING & USER ACCEPTANCE TESTING (UAT)

## Tháng 5: Integration, Testing & Finalisation
**Milestone:** `W18 - Testing`  
**Thời gian:** Ngày 120 – Ngày 126 (21/12/2026 – 27/12/2026)  
**Nhánh chính:** `test/comprehensive-testing` (tách từ `develop`)  
**Mục tiêu tuần:** Thực hiện kiểm thử toàn diện đa cấp độ (Unit Test $> 80\%$ Coverage, Integration Test, System Test) và tổ chức đợt Kiểm thử nghiệm thu người dùng (UAT) với 5–10 người dùng thật để thu thập số liệu đánh giá cho Luận văn tốt nghiệp.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 120: BACKEND UNIT & INTEGRATION TEST COVERAGE (21/12/2026)
* **Mục tiêu:** Mở rộng bộ kiểm thử tự động Backend bằng Jest và Supertest đạt độ bao phủ mã nguồn (Code Coverage) trên 80%.
* **Nhiệm vụ cụ thể:**
  1. Viết Unit Tests cho các module nghiệp vụ cốt lõi:
     * Auth Service: Hash password, Tạo token, Xác thực token.
     * Booking Normalizer: Chuyển đổi 20+ mẫu JSON khác nhau sang Unified Model.
     * Cache Service: Kiểm tra Cache Hit, Cache Miss, Invalidation.
     * Quiz & Badge Service: Thuật toán chấm điểm, Công thức XP, Điều kiện mở khóa Huy hiệu.
  2. Viết Integration Tests kiểm tra các API routes với Database thật (Test Database).
  3. Xuất báo cáo Istanbul Code Coverage HTML.
* **Sản phẩm đầu ra:**
  * Báo cáo Code Coverage: `server/coverage/index.html`.
* **Git Commit:** `test(server): expand unit and integration test coverage to over 80 percent`
* **DoD:** Chạy `npm run test:coverage` đạt $> 80\%$ Statements, Branches, Functions, Lines.

---

### 🔹 DAY 121: MOBILE CLIENT COMPONENT & REGRESSION TESTING (22/12/2026)
* **Mục tiêu:** Viết kiểm thử cho các thành phần giao diện chính trên React Native sử dụng `React Native Testing Library`.
* **Nhiệm vụ cụ thể:**
  1. Test các component giao diện:
     * Form Đăng nhập & Đăng ký: Bắt lỗi validation khi nhập sai email/mật khẩu.
     * Thẻ chuyến bay & khách sạn: Hiển thị đúng giá và nhãn tag.
     * Thẻ câu trả lời Diễn đàn: Hiển thị đúng viền vàng khi `isCityVerified === true`.
  2. Kiểm tra độ ổn định (Regression Testing) trên cả hai nền tảng iOS Simulator và Android Emulator.
* **Sản phẩm đầu ra:**
  * Bộ test client tại `client/__tests__/`.
* **Git Commit:** `test(client): add mobile component snapshot and regression tests`
* **DoD:** Các Unit Test trên Mobile chạy mượt mà không có cảnh báo đỏ.

---

### 🔹 DAY 122: UAT PROTOCOL & QUESTIONNAIRE DESIGN (SUS) (23/12/2026)
* **Mục tiêu:** Chuẩn bị kịch bản kiểm thử người dùng (UAT Protocol) và bảng câu hỏi đo lường trải nghiệm chuẩn quốc tế (System Usability Scale - SUS).
* **Nhiệm vụ cụ thể:**
  1. Tuyển chọn 5–10 người dùng thử nghiệm đại diện cho nhóm Independent Travelers (Sinh viên, người đi làm trẻ tuổi).
  2. Thiết kế kịch bản UAT gồm 5 nhiệm vụ chính:
     * Task 1: Tìm chuyến bay từ Hà Nội đi Đà Nẵng và lưu khách sạn yêu thích.
     * Task 2: Tạo lịch trình chuyến đi Đà Nẵng 3 ngày và sắp xếp lại thứ tự các địa điểm.
     * Task 3: Xem bản đồ lộ trình và khoảng cách di chuyển.
     * Task 4: Thực hiện quét GPS check-in tại địa danh và làm bài trắc nghiệm văn hóa.
     * Task 5: Đăng câu trả lời trên diễn đàn và kiểm tra huy hiệu xác thực.
  3. Soạn bảng câu hỏi khảo sát 10 câu theo chuẩn thang đo **SUS (System Usability Scale)** trên Google Forms.
* **Sản phẩm đầu ra:**
  * Tài liệu `documentation/10-testing/02-uat-protocol-and-survey.md`.
* **Git Commit:** `docs: prepare user acceptance testing protocol and sus survey questionnaire`
* **DoD:** Kịch bản UAT và Form khảo sát sẵn sàng cho người dùng trải nghiệm.

---

### 🔹 DAY 123: UAT EXECUTION & FEEDBACK COLLECTION (24/12/2026)
* **Mục tiêu:** Tổ chức buổi kiểm thử thực tế với 5–10 người dùng, ghi lại thời gian hoàn thành tác vụ (Time on Task), tỷ lệ thành công và các phản hồi định tính.
* **Nhiệm vụ cụ thể:**
  1. Cho từng tester cài đặt ứng dụng (File `.apk` Android / TestFlight iOS) và thực hiện 5 nhiệm vụ mà không có sự can thiệp hay hướng dẫn trước.
  2. Ghi lại:
     * Tỷ lệ hoàn thành nhiệm vụ (Task Completion Rate %): Mục tiêu $> 90\%$.
     * Thời gian trung bình để tạo lịch trình: Mục tiêu $< 3$ phút.
     * Các lỗi giao diện (UI quirks), nút bấm khó hiểu hoặc điểm nghẽn người dùng gặp phải.
  3. Thu thập phiếu đánh giá SUS từ tất cả người dùng.
* **Sản phẩm đầu ra:**
  * Bảng dữ liệu thô kết quả UAT: `documentation/10-testing/uat-raw-results.xlsx` (hoặc `.csv`).
* **Git Commit:** `docs: record empirical uat testing sessions and raw feedback metrics`
* **DoD:** Thu thập đủ 100% phiếu khảo sát và nhật ký kiểm thử từ nhóm tester.

---

### 🔹 DAY 124: BUG TRIAGE & CRITICAL FIXES SPRINT (25/12/2026)
* **Mục tiêu:** Phân loại toàn bộ các lỗi phát sinh trong đợt UAT lên GitHub Issues và thực hiện sửa lỗi dứt điểm.
* **Nhiệm vụ cụ thể:**
  1. Tạo các GitHub Issues gắn nhãn `bug`:
     * Nhãn `severity/critical`: Lỗi crash app hoặc tính sai điểm XP.
     * Nhãn `severity/major`: Lỗi hiển thị bản đồ lệch tọa độ hoặc lỗi layout.
     * Nhãn `severity/minor`: Lỗi font chữ hoặc khoảng cách lề.
  2. Mở nhánh nóng `fix/uat-feedback-fixes` và sửa toàn bộ lỗi `critical` và `major`.
  3. Đóng các Bug Issues tương ứng trên GitHub.
* **Sản phẩm đầu ra:**
  * Bản vá lỗi hoàn chỉnh trên cả Client và Server.
* **Git Commit:** `fix: resolve critical and major usability issues identified during uat sprint`
* **DoD:** Toàn bộ lỗi mức Critical và Major được khắc phục và kiểm thử lại thành công.

---

### 🔹 DAY 125: USABILITY EVALUATION & SUS SCORE ANALYSIS (26/12/2026)
* **Mục tiêu:** Tính toán điểm số Hệ thống Khả dụng (SUS Score) và phân tích thống kê định lượng phục vụ Chapter 6 của Luận văn.
* **Nhiệm vụ cụ thể:**
  1. Tính toán điểm SUS theo công thức chuẩn:
     $$\text{SUS Score} = 2.5 \times \left( \sum_{i \in \text{odd}} (R_i - 1) + \sum_{i \in \text{even}} (5 - R_i) \right)$$
  2. Tổng hợp điểm số trung bình (Target: $\text{SUS} \ge 80.5/100$ — Đạt mức xếp hạng **"Grade A / Excellent"**).
  3. Vẽ biểu đồ phân bố điểm số và biểu đồ mức độ hài lòng của người dùng.
* **Sản phẩm đầu ra:**
  * Báo cáo phân tích SUS trong `documentation/10-testing/03-sus-evaluation-report.md`.
* **Git Commit:** `docs: analyze sus usability metrics and generate empirical evaluation charts`
* **DoD:** Điểm SUS được tính toán khoa học kèm bảng số liệu chi tiết cho Thesis.

---

### 🔹 DAY 126: WEEK 18 REVIEW & THESIS TESTING CHAPTER (27/12/2026)
* **Mục tiêu:** Hoàn thiện toàn bộ nội dung Chapter 6 (Testing & Evaluation) của Luận văn và đóng Milestone Tuần 18.
* **Nhiệm vụ cụ thể:**
  1. Soạn thảo hoàn chỉnh Chapter 6 của Thesis:
     * 6.1 Testing Strategy (Unit, Integration, System, UAT).
     * 6.2 Test Case Specifications & Results Matrix.
     * 6.3 Code Coverage Analysis.
     * 6.4 Usability Evaluation (SUS Analysis & User Feedback).
  2. Viết tài liệu tổng kết tuần `W18-Review-Summary.md`.
  3. Đóng Milestone `W18 - Testing` trên GitHub.
* **Sản phẩm đầu ra:**
  * Bản nháp Chapter 6 hoàn chỉnh.
* **Git Commit:** `docs: complete thesis chapter 6 testing and evaluation and close milestone W18`
* **DoD:** Chapter 6 được viết đầy đủ bằng tiếng Anh học thuật với dữ liệu thực nghiệm phong phú; Milestone W18 hoàn thành.
