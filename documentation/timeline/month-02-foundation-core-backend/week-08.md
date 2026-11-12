# WEEK 08 — BACKEND API FOUNDATION & MONTH 2 VERTICAL SLICE

## Tháng 2: Foundation & Core Backend
**Milestone:** `W8 - API Foundation` & `M2 - Foundation`  
**Thời gian:** Ngày 50 – Ngày 56 (12/10/2026 – 18/10/2026)  
**Nhánh chính:** `feature/api-foundation` (tách từ `develop`)  
**Mục tiêu tuần:** Tích hợp tài liệu tương tác Swagger UI cho toàn bộ API, nạp dữ liệu mẫu ban đầu (Database Seeders), hoàn thiện lát cắt dọc đầu tiên (Vertical Slice: Mobile App ➔ Node.js API ➔ Databases) và đóng Milestone Tháng 2.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 50: SWAGGER UI INTERACTIVE DOCUMENTATION (12/10/2026)
* **Mục tiêu:** Nhúng giao diện tài liệu Swagger UI trực tiếp vào server backend để bất kỳ ai cũng có thể đọc và thử nghiệm API trên trình duyệt.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện `swagger-ui-express` và `yamljs`.
  2. Nạp file `documentation/09-api-design/openapi-spec.yaml` vào server.
  3. Cấu hình endpoint: `http://localhost:5000/api/docs`.
  4. Bổ sung tính năng "Authorize" trên Swagger để gắn token JWT vào các request có bảo mật.
* **Sản phẩm đầu ra:**
  * Endpoint `/api/docs` chạy trực tiếp trên Server.
* **Git Commit:** `feat(server): serve interactive swagger openapi documentation at /api/docs`
* **DoD:** Mở trình duyệt vào `/api/docs` có thể bấm "Try it out" và thực thi các API Auth, User, Health.

---

### 🔹 DAY 51: AUTOMATED NEWMAN API TEST SUITE (13/10/2026)
* **Mục tiêu:** Tự động hóa kiểm thử toàn bộ các kịch bản API bằng công cụ Newman CLI trong terminal và tích hợp vào CI/CD.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt `newman` và `newman-reporter-html`.
  2. Thêm script vào `server/package.json`: `"test:api": "newman run ../documentation/09-api-design/Nomadix_API.postman_collection.json -e ../documentation/09-api-design/Nomadix_Env.postman_environment.json"`.
  3. Viết kịch bản kiểm tra: Đăng ký ➔ Đăng nhập ➔ Lấy Profile ➔ Cập nhật Profile ➔ Kiểm tra lỗi 401/403.
* **Sản phẩm đầu ra:**
  * Báo cáo HTML kết quả kiểm thử API tự động.
* **Git Commit:** `test(server): configure automated newman postman test runner`
* **DoD:** Chạy `npm run test:api` trong terminal thực thi 100% test assertions thành công.

---

### 🔹 DAY 52: DATABASE SEEDERS & MOCK DATA FACTORY (14/10/2026)
* **Mục tiêu:** Xây dựng script nạp dữ liệu mẫu ban đầu (Landmarks, Quizzes, Badges, Admin User) vào Database phục vụ phát triển.
* **Nhiệm vụ cụ thể:**
  1. Viết script `server/src/seeders/seed.js`:
     * Tạo 2 tài khoản mặc định: `admin@nomadix.com` (Role: Admin) và `traveler@nomadix.com` (Role: Traveler).
     * Nạp dữ liệu 5 địa danh nổi tiếng Đà Nẵng: *Cầu Rồng*, *Ngũ Hành Sơn*, *Bán đảo Sơn Trà*, *Bà Nà Hills*, *Cầu Tình Yêu* (Kèm tọa độ Latitude/Longitude và bán kính Geofence 100m).
     * Nạp bộ câu hỏi Cultural Quiz trắc nghiệm cho từng địa danh.
     * Nạp định nghĩa Huy hiệu: *Da Nang Explorer Badge*.
  2. Thêm lệnh `"db:seed": "node src/seeders/seed.js"`.
* **Sản phẩm đầu ra:**
  * File `server/src/seeders/seed.js` và dữ liệu mẫu.
* **Git Commit:** `feat(server): build database seeders for landmarks, quizzes, and badges`
* **DoD:** Chạy `npm run db:seed` tự động nạp đầy đủ dữ liệu sạch vào cơ sở dữ liệu.

---

### 🔹 DAY 53: MONTH 2 VERTICAL SLICE INTEGRATION (15/10/2026)
* **Mục tiêu:** Kiểm chứng lát cắt dọc đầu tiên của hệ thống: Người dùng thao tác trên điện thoại di động ➔ Gửi API ➔ Xử lý tại Backend ➔ Lưu trữ vào Database ➔ Phản hồi lại giao diện.
* **Nhiệm vụ cụ thể:**
  1. Chạy ứng dụng React Native trên máy thật / Simulator.
  2. Thực hiện luồng: Đăng ký tài khoản ➔ Đăng nhập ➔ Mở trang Profile xem Level 1 (0 XP) ➔ Chỉnh sửa tên và cập nhật ảnh đại diện mới.
  3. Mở PostgreSQL và Cloudinary kiểm tra xem dữ liệu có lưu chính xác hay không.
* **Sản phẩm đầu ra:**
  * Toàn bộ luồng Vertical Slice hoạt động thông suốt.
* **Git Commit:** `feat: connect full vertical slice from mobile client to backend databases`
* **DoD:** Hoàn thành trọn vẹn kịch bản người dùng từ giao diện đến database không có bất kỳ lỗi nào.

---

### 🔹 DAY 54: PERFORMANCE BASELINE & QUERY OPTIMIZATION (16/10/2026)
* **Mục tiêu:** Đo lường thời gian phản hồi ban đầu của các API nền tảng và tối ưu hóa câu lệnh SQL.
* **Nhiệm vụ cụ thể:**
  1. Sử dụng lệnh `EXPLAIN ANALYZE` trên PostgreSQL để đánh giá tốc độ truy vấn bảng `users` và `checkins`.
  2. Đảm bảo các trường tìm kiếm thường xuyên (`email`, `landmark_id`, `user_id`) đều đã có B-Tree Index.
  3. Ghi lại chỉ số thời gian phản hồi trung bình (Baseline Latency: $< 50\text{ms}$ cho các truy vấn cục bộ).
* **Sản phẩm đầu ra:**
  * Bảng số liệu đo đạc Baseline Latency trong `documentation/08-database-design/performance-baseline.md`.
* **Git Commit:** `perf(server): optimize database query indexes and establish performance baseline`
* **DoD:** Thời gian phản hồi trung bình của API Auth và Profile đạt dưới 100ms.

---

### 🔹 DAY 55: THESIS CHAPTER 4 REFINEMENT (17/10/2026)
* **Mục tiêu:** Cập nhật các sơ đồ kiến trúc thực tế và các giải pháp kỹ thuật đã triển khai vào bản nháp Chapter 4 của Luận văn tốt nghiệp.
* **Nhiệm vụ cụ thể:**
  1. Chụp ảnh màn hình Swagger UI, Postman Runner, cấu trúc mã nguồn Layered Architecture.
  2. Bổ sung phần giải thích chi tiết về bảo mật Bcrypt, JWT Token Lifecycle và cơ chế phân quyền RBAC vào Thesis.
  3. Viết phần giải trình về việc lựa chọn PostgreSQL kết hợp MongoDB.
* **Sản phẩm đầu ra:**
  * Bản cập nhật Chapter 4 hoàn chỉnh có hình ảnh minh họa thực tế.
* **Git Commit:** `docs: update thesis chapter 4 with implemented backend architecture and security models`
* **DoD:** Hoàn thành 100% nội dung kỹ thuật của Chapter 4.

---

### 🔹 DAY 56: MONTH 2 GRAND REVIEW & DEFINITION OF DONE (18/10/2026)
* **Mục tiêu:** Tổng kết toàn bộ Tháng 2, kiểm tra Month 2 Definition of Done, quay video demo ngắn cho Giảng viên hướng dẫn và đóng Milestone M2.
* **Nhiệm vụ cụ thể:**
  1. Đối soát bảng tiêu chuẩn **Month 2 Definition of Done**:
     - [x] Node.js Express API chạy ổn định theo kiến trúc phân tầng.
     - [x] Hệ thống xác thực JWT, Bcrypt, Middleware phân quyền hoàn chỉnh.
     - [x] Tải ảnh đại diện lên Cloudinary tối ưu hóa hoạt động tốt.
     - [x] Công thức XP / Level progression hoạt động chuẩn xác.
     - [x] Dữ liệu mẫu (Landmarks, Quizzes, Badges) đã được seed vào DB.
     - [x] Swagger UI trực quan tại `/api/docs`.
     - [x] Mobile React Native thực hiện mượt mà luồng Đăng ký ➔ Đăng nhập ➔ Hồ sơ cá nhân.
  2. Viết tài liệu tổng kết tháng `month-02-summary.md`.
  3. Đóng Milestone `M2 - Foundation` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tổng kết Tháng 2 và video demo Vertical Slice.
* **Git Commit:** `docs: finalize month 2 milestone and close M2 - Foundation`
* **DoD:** Milestone M2 đạt 100% hoàn thành; sẵn sàng bước vào Month 3 (Booking & Itinerary).
