# WEEK 05 — BACKEND FOUNDATION & LAYERED ARCHITECTURE

## Tháng 2: Foundation & Core Backend
**Milestone:** `W5 - Backend`  
**Thời gian:** Ngày 29 – Ngày 35 (21/09/2026 – 27/09/2026)  
**Nhánh chính:** `feature/backend-foundation` (tách từ `develop`)  
**Mục tiêu tuần:** Xây dựng khung xử lý trung tâm cho Backend Node.js Express theo kiến trúc Clean Layered Architecture (Routing, Middleware, Global Error Handler, Logger và Request Validation).

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 29: CENTRALIZED ROUTING & HTTP PIPELINE (21/09/2026)
* **Mục tiêu:** Thiết lập hệ thống điều hướng Router trung tâm cho phiên bản API `v1` và chuẩn hóa cấu trúc phản hồi HTTP.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng file định tuyến gốc `server/src/routes/v1/index.js`.
  2. Tạo các nhánh Route con rỗng: `auth.routes.js`, `users.routes.js`, `flights.routes.js`, `hotels.routes.js`, `itineraries.routes.js`, `landmarks.routes.js`, `checkins.routes.js`, `quizzes.routes.js`, `community.routes.js`.
  3. Xây dựng lớp chuẩn hóa phản hồi API `server/src/utils/ApiResponse.js`:
     * Thành công: `{ success: true, statusCode: 200, message: "...", data: {...} }`
     * Thất bại: `{ success: false, statusCode: 4xx/5xx, message: "...", errors: [...] }`
* **Sản phẩm đầu ra:**
  * Bộ định tuyến `routes/v1/` và utility class `ApiResponse.js`.
* **Git Commit:** `feat(server): setup centralized v1 routing and standardized api response helper`
* **DoD:** Mọi route đều trả về đúng định dạng JSON chuẩn.

---

### 🔹 DAY 30: GLOBAL ERROR HANDLING & CUSTOM APP ERROR (22/09/2026)
* **Mục tiêu:** Xây dựng hệ thống bắt lỗi tập trung (Global Error Handler) ngăn chặn sập server và trả về mã lỗi HTTP chính xác.
* **Nhiệm vụ cụ thể:**
  1. Tạo class tùy chỉnh `server/src/utils/AppError.js` kế thừa từ `Error` (lưu `statusCode`, `isOperational`, `status`).
  2. Viết wrapper bắt lỗi bất đồng bộ `server/src/utils/catchAsync.js` để loại bỏ các khối `try/catch` lặp lại trong Controllers.
  3. Viết Global Error Middleware `server/src/middleware/errorHandler.js`:
     * Phân biệt môi trường Development (in chi tiết stack trace) và Production (ẩn thông tin nhạy cảm).
     * Bắt lỗi đặc thù: Lỗi khóa ngoại PostgreSQL, lỗi trùng khóa Mongoose duplicate key, lỗi TokenExpiredError của JWT.
* **Sản phẩm đầu ra:**
  * `AppError.js`, `catchAsync.js`, `errorHandler.js`.
* **Git Commit:** `feat(server): implement centralized error handling and async catch wrapper`
* **DoD:** Khi throw `new AppError("Not Found", 404)`, client nhận được đúng mã 404 và JSON lỗi chuẩn.

---

### 🔹 DAY 31: REQUEST VALIDATION MIDDLEWARE (JOI / ZOOD) (23/09/2026)
* **Mục tiêu:** Cài đặt middleware kiểm tra tính hợp lệ của dữ liệu đầu vào (Payload Validation) trước khi chuyển vào Service Layer.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện `joi` hoặc `zod`.
  2. Tạo middleware kiểm tra `server/src/middleware/validate.js` kiểm tra cả `req.body`, `req.query`, `req.params`.
  3. Viết Schema kiểm tra mẫu cho đăng ký/đăng nhập (`auth.validation.js`):
     * Email hợp lệ, Mật khẩu tối thiểu 8 ký tự (có chữ hoa, chữ thường, số), Tên không chứa ký tự lạ.
* **Sản phẩm đầu ra:**
  * `validate.js` và `auth.validation.js`.
* **Git Commit:** `feat(server): add request validation middleware using joi schemas`
* **DoD:** Gửi body thiếu trường hoặc sai định dạng bị trả về 400 Bad Request kèm chi tiết trường bị lỗi.

---

### 🔹 DAY 32: ENTERPRISE LOGGING SYSTEM (WINSTON + MORGAN) (24/09/2026)
* **Mục tiêu:** Xây dựng hệ thống ghi log chuyên nghiệp theo dõi các truy vấn HTTP và các ngoại lệ hệ thống.
* **Nhiệm vụ cụ thể:**
  1. Cấu hình thư viện `winston` trong `server/src/utils/logger.js`:
     * Định dạng log có màu trong Console cho môi trường Dev.
     * Ghi file log theo ngày (`logs/error-%DATE%.log`, `logs/combined-%DATE%.log`) sử dụng `winston-daily-rotate-file`.
  2. Tích hợp middleware `morgan` để log tự động thông tin mọi request HTTP (Method, URL, Status Code, Response Time).
* **Sản phẩm đầu ra:**
  * Module `logger.js` và thư mục lưu trữ `server/logs/`.
* **Git Commit:** `feat(server): integrate winston daily rotate logger and morgan http stream`
* **DoD:** Mọi request được in ra console và tự động ghi vào file log tương ứng.

---

### 🔹 DAY 33: SECURITY MIDDLEWARE & RATE LIMITING (25/09/2026)
* **Mục tiêu:** Gia cố bảo mật cho API server chống các cuộc tấn công thông dụng (DDoS, XSS, Brute-force).
* **Nhiệm vụ cụ thể:**
  1. Tích hợp `helmet` bảo vệ các HTTP headers an toàn.
  2. Cấu hình `cors` chỉ cho phép truy cập từ miền và mobile app xác định.
  3. Cài đặt `express-rate-limit` và `rate-limit-redis` giới hạn 100 requests / 15 phút cho mỗi địa chỉ IP.
  4. Cấu hình riêng Rate Limit nghiêm ngặt cho route đăng nhập: tối đa 5 lần thử sai / 15 phút.
* **Sản phẩm đầu ra:**
  * Cấu hình bảo mật trong `server/src/app.js`.
* **Git Commit:** `feat(server): configure helmet security headers, cors, and redis rate limiting`
* **DoD:** Gửi quá 5 request login sai liên tiếp bị trả về mã 429 Too Many Requests.

---

### 🔹 DAY 34: API HEALTH & DATABASE MONITORING ENDPOINT (26/09/2026)
* **Mục tiêu:** Xây dựng endpoint giám sát sức khỏe toàn diện kiểm tra kết nối sống còn tới PostgreSQL, MongoDB, Redis và Cloudinary.
* **Nhiệm vụ cụ thể:**
  1. Nâng cấp endpoint `GET /api/v1/health` thực hiện kiểm tra ping song song:
     * PostgreSQL: `SELECT 1;`
     * MongoDB: `mongoose.connection.db.admin().ping()`
     * Redis: `redis.ping()`
  2. Trả về thời gian phản hồi (Latency ms) của từng database.
* **Sản phẩm đầu ra:**
  * Controller `health.controller.js`.
* **Git Commit:** `feat(server): implement deep health check monitoring with db latency metrics`
* **DoD:** Gọi API `/api/v1/health` trả về trạng thái chi tiết của từng thành phần trong hệ thống.

---

### 🔹 DAY 35: WEEK 5 REVIEW & BACKEND BENCHMARK (27/09/2026)
* **Mục tiêu:** Kiểm tra lại toàn bộ nền tảng backend, chạy các Unit Test đầu tiên và đóng Milestone Tuần 5.
* **Nhiệm vụ cụ thể:**
  1. Viết Unit Test cơ bản kiểm tra `ApiResponse`, `AppError` và `validate` middleware bằng Jest / Supertest.
  2. Viết tài liệu tổng kết tuần `W5-Review-Summary.md`.
  3. Đóng Milestone `W5 - Backend` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-05-review.md`.
* **Git Commit:** `test(server): add unit tests for base middleware and close milestone W5`
* **DoD:** Chạy `npm test` đạt 100% pass cho các tầng middleware nền tảng.
