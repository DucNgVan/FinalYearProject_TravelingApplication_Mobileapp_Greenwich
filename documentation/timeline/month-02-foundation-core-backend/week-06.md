# WEEK 06 — AUTHENTICATION, JWT SECURITY & MOBILE INTEGRATION

## Tháng 2: Foundation & Core Backend
**Milestone:** `W6 - Authentication`  
**Thời gian:** Ngày 36 – Ngày 42 (28/09/2026 – 04/10/2026)  
**Nhánh chính:** `feature/authentication` (tách từ `develop`)  
**Mục tiêu tuần:** Hoàn thiện toàn bộ hệ thống xác thực người dùng (Đăng ký, Đăng nhập, Băm mật khẩu Bcrypt, Cấp phát JWT Access/Refresh Tokens, Phân quyền RBAC) và kết nối giao diện Mobile React Native.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 36: USER ENTITY & BCRYPT PASSWORD HASHING (28/09/2026)
* **Mục tiêu:** Xây dựng User Model trong PostgreSQL và cài đặt thuật toán mã hóa mật khẩu an toàn.
* **Nhiệm vụ cụ thể:**
  1. Viết Migration tạo bảng `users` và `roles` trong PostgreSQL.
  2. Xây dựng User Repository / Model trong `server/src/models/user.model.js`.
  3. Cài đặt thư viện `bcryptjs`:
     * Tự động sinh muối (Salt rounds = 12) và băm mật khẩu trước khi lưu.
     * Viết phương thức kiểm tra mật khẩu `comparePassword(candidatePassword, userPassword)`.
* **Sản phẩm đầu ra:**
  * Model `user.model.js` và migration script.
* **Git Commit:** `feat(auth): implement postgres user entity with bcrypt password hashing`
* **DoD:** Mật khẩu lưu trong cơ sở dữ liệu luôn ở dạng chuỗi hash `$2a$12$...`.

---

### 🔹 DAY 37: REGISTRATION & LOGIN SERVICE (29/09/2026)
* **Mục tiêu:** Triển khai nghiệp vụ đăng ký và đăng nhập, cấp phát mã chứng thực JSON Web Token (JWT).
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện `jsonwebtoken`.
  2. Viết service tạo token:
     * Access Token: Hết hạn sau 1 ngày (chứa `userId`, `email`, `role`).
     * Refresh Token: Hết hạn sau 30 ngày (lưu an toàn).
  3. Xây dựng Controller & Service:
     * `POST /api/v1/auth/register`: Kiểm tra email trùng lặp ➔ Tạo user ➔ Khởi tạo XP = 0, Level = 1 ➔ Trả về User info & Token.
     * `POST /api/v1/auth/login`: Kiểm tra email & mật khẩu ➔ Trả về Token.
* **Sản phẩm đầu ra:**
  * `auth.service.js`, `auth.controller.js`, `auth.routes.js`.
* **Git Commit:** `feat(auth): implement user registration, login, and jwt token issuance`
* **DoD:** Gọi API qua Postman đăng ký/đăng nhập thành công nhận được JWT Token.

---

### 🔹 DAY 38: JWT AUTHENTICATION MIDDLEWARE (30/09/2026)
* **Mục tiêu:** Xây dựng middleware chặn và giải mã JWT token để bảo vệ các tài nguyên yêu cầu xác thực.
* **Nhiệm vụ cụ thể:**
  1. Viết middleware `server/src/middleware/auth.middleware.js`:
     * Lấy token từ Header `Authorization: Bearer <token>`.
     * Giải mã token bằng `jwt.verify(token, process.env.JWT_SECRET)`.
     * Truy vấn thông tin người dùng từ PostgreSQL và gán vào `req.user`.
     * Xử lý ngoại lệ: Token hết hạn (401), Token không hợp lệ (401), User đã bị xóa (401).
  2. Viết endpoint kiểm tra người dùng hiện tại: `GET /api/v1/users/me`.
* **Sản phẩm đầu ra:**
  * `auth.middleware.js` và route `users/me`.
* **Git Commit:** `feat(auth): create jwt protect middleware and get current user profile endpoint`
* **DoD:** Gửi request không có token hoặc token giả mạo tới `/api/v1/users/me` bị từ chối 401 Unauthorized.

---

### 🔹 DAY 39: ROLE-BASED ACCESS CONTROL (RBAC) (01/10/2026)
* **Mục tiêu:** Xây dựng middleware phân quyền người dùng (Traveler vs Administrator) để bảo vệ các chức năng quản trị.
* **Nhiệm vụ cụ thể:**
  1. Viết middleware phân quyền `server/src/middleware/restrictTo.js`:
     * Nhận danh sách các roles được phép (ví dụ: `restrictTo('admin')`).
     * So sánh `req.user.role` với danh sách quyền.
     * Trả về lỗi 403 Forbidden nếu không đủ quyền hạn.
  2. Tạo route thử nghiệm cho Admin: `GET /api/v1/admin/dashboard-stats`.
* **Sản phẩm đầu ra:**
  * Middleware `restrictTo.js`.
* **Git Commit:** `feat(auth): implement role-based access control middleware for admin authorization`
* **DoD:** Tài khoản vai trò `traveler` truy cập route admin nhận đúng mã 403.

---

### 🔹 DAY 40: MOBILE AUTH CONTEXT & SECURE STORAGE (02/10/2026)
* **Mục tiêu:** Xây dựng tầng quản lý trạng thái xác thực toàn cục (AuthContext) và lưu trữ token an toàn trên ứng dụng React Native.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt `react-native-keychain` hoặc `@react-native-async-storage/async-storage` trên Mobile.
  2. Xây dựng `client/src/context/AuthContext.js`:
     * Lưu trữ `user`, `token`, `isLoading`, `isAuthenticated`.
     * Cung cấp các hàm: `login()`, `register()`, `logout()`, `checkTokenValidity()`.
  3. Cấu hình Axios Interceptors (`client/src/services/api.js`):
     * Tự động đính kèm `Authorization: Bearer <token>` vào mọi request gửi lên server.
     * Bắt lỗi 401 để tự động đăng xuất người dùng nếu token hết hạn.
* **Sản phẩm đầu ra:**
  * `AuthContext.js` và cấu hình Axios Client trên Mobile.
* **Git Commit:** `feat(client): implement auth context and axios token interceptors`
* **DoD:** Mở app tự động đọc token từ bộ nhớ để duy trì trạng thái đăng nhập (Auto-login).

---

### 🔹 DAY 41: MOBILE LOGIN & REGISTER SCREENS WIRING (03/10/2026)
* **Mục tiêu:** Kết nối giao diện Đăng nhập / Đăng ký trên React Native với Backend API thật.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng form Đăng ký trên Mobile: Validate dữ liệu đầu vào, hiển thị trạng thái Loading, gửi API và chuyển hướng vào trang chính khi thành công.
  2. Xây dựng form Đăng nhập: Bắt lỗi sai mật khẩu, hiển thị thông báo Toast / Alert đẹp mắt.
  3. Xây dựng tính năng Đăng xuất: Xóa token khỏi bộ nhớ và chuyển hướng về màn hình Login.
* **Sản phẩm đầu ra:**
  * Giao diện và logic hoàn chỉnh tại `client/src/screens/Auth/`.
* **Git Commit:** `feat(client): connect login and register screens with backend authentication api`
* **DoD:** Người dùng thực hiện đăng ký và đăng nhập trực tiếp trên điện thoại/máy ảo thành công.

---

### 🔹 DAY 42: WEEK 6 REVIEW & E2E AUTHENTICATION TESTING (04/10/2026)
* **Mục tiêu:** Kiểm thử luồng xác thực End-to-End từ giao diện di động đến Database, viết tài liệu tuần và đóng Milestone Tuần 6.
* **Nhiệm vụ cụ thể:**
  1. Thực hiện kịch bản kiểm thử: Đăng ký tài khoản mới ➔ Tắt app mở lại (kiểm tra Auto-login) ➔ Đổi mật khẩu ➔ Đăng xuất ➔ Đăng nhập lại.
  2. Viết tài liệu tổng kết tuần `W6-Review-Summary.md`.
  3. Đóng Milestone `W6 - Authentication` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-06-review.md`.
* **Git Commit:** `test: verify end-to-end authentication flow and close milestone W6`
* **DoD:** Luồng xác thực hoạt động ổn định 100% không phát sinh lỗi.
