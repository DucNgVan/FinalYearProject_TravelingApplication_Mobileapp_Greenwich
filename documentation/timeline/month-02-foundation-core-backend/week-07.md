# WEEK 07 — DATABASE INTEGRATION & USER PROFILE STATS

## Tháng 2: Foundation & Core Backend
**Milestone:** `W7 - Database & Profile`  
**Thời gian:** Ngày 43 – Ngày 49 (05/10/2026 – 11/10/2026)  
**Nhánh chính:** `feature/user-profile` (tách từ `develop`)  
**Mục tiêu tuần:** Xây dựng đầy đủ nghiệp vụ quản lý hồ sơ cá nhân (Profile CRUD), tích hợp tải ảnh đại diện lên Cloudinary, công thức tính toán cấp độ Level/XP và tổng hợp lịch sử du lịch từ cả 2 cơ sở dữ liệu.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 43: USER PROFILE MANAGEMENT API (05/10/2026)
* **Mục tiêu:** Xây dựng các API cho phép xem và cập nhật thông tin cá nhân của người dùng.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng endpoint:
     * `GET /api/v1/users/profile`: Trả về thông tin chi tiết người dùng (Full name, Email, Avatar, Bio, XP, Level, Vai trò, Ngày tham gia).
     * `PUT /api/v1/users/profile`: Cập nhật `full_name`, `bio`, `avatar_url`, `travel_preferences`.
  2. Viết hàm kiểm tra dữ liệu đầu vào (Validation) ngăn chặn việc người dùng tự sửa điểm `xp` hoặc `level` qua API cập nhật thông thường.
* **Sản phẩm đầu ra:**
  * `user.controller.js`, `user.service.js`.
* **Git Commit:** `feat(user): implement get and update user profile api endpoints`
* **DoD:** Gọi API cập nhật thông tin thành công và dữ liệu được cập nhật chính xác trong PostgreSQL.

---

### 🔹 DAY 44: CLOUDINARY AVATAR UPLOAD PIPELINE (06/10/2026)
* **Mục tiêu:** Xây dựng luồng tải ảnh đại diện lên Cloudinary thông qua Server trung gian và tối ưu hóa kích thước ảnh.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện `multer` và `cloudinary`.
  2. Cấu hình middleware `upload.js` lưu file tạm trong bộ nhớ RAM (Memory Storage), giới hạn dung lượng tối đa 5MB, chỉ chấp nhận định dạng `.jpg`, `.png`, `.webp`.
  3. Viết service tải ảnh `cloudinary.service.js` tự động chuyển đổi định dạng sang `webp` và thu nhỏ kích thước (Crop: 300x300 pixel, Quality: auto).
  4. Tạo endpoint: `POST /api/v1/users/avatar` trả về URL ảnh an toàn (HTTPS).
* **Sản phẩm đầu ra:**
  * `cloudinary.service.js` và route tải ảnh đại diện.
* **Git Commit:** `feat(user): integrate multer and cloudinary image optimization for user avatars`
* **DoD:** Tải ảnh lên server nhận được URL Cloudinary và cập nhật trực tiếp vào trường `avatar_url` của user.

---

### 🔹 DAY 45: XP ACCUMULATOR & LEVEL PROGRESSION FORMULA (07/10/2026)
* **Mục tiêu:** Thiết lập thuật toán tích lũy điểm kinh nghiệm (XP) và tự động tính toán nâng cấp Level cho người dùng.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng công thức tính cấp độ trong `server/src/utils/gamificationHelper.js`:
     $$\text{Level} = \left\lfloor \sqrt{\frac{\text{XP}}{100}} \right\rfloor + 1$$
     * Level 1: 0 – 99 XP
     * Level 2: 100 – 399 XP
     * Level 3: 400 – 899 XP
     * Level 4: 900 – 1599 XP
  2. Viết service `addXpToUser(userId, amount)`: Tự động cộng XP, tính toán xem có lên cấp (Level Up) hay không, cập nhật vào PostgreSQL và trả về cờ `hasLeveledUp: true/false`.
* **Sản phẩm đầu ra:**
  * `gamificationHelper.js` và Unit Test công thức tính điểm.
* **Git Commit:** `feat(gamify): implement xp progression engine and dynamic level calculation formula`
* **DoD:** Test truyền XP = 450 tự động trả về Level = 3.

---

### 🔹 DAY 46: BADGES & TRAVEL STATS AGGREGATOR SERVICE (08/10/2026)
* **Mục tiêu:** Xây dựng service tổng hợp dữ liệu toàn diện từ cả PostgreSQL (Badges, Check-ins) và MongoDB (Chuyến đi đã hoàn thành) để trả về cho trang Profile.
* **Nhiệm vụ cụ thể:**
  1. Viết service truy vấn tổng hợp `getUserTravelStats(userId)`:
     * Đếm tổng số địa danh đã Check-in từ bảng `checkins` (PostgreSQL).
     * Lấy danh sách các Huy hiệu thành phố đã mở khóa từ `user_badges` JOIN `badges` (PostgreSQL).
     * Đếm tổng số chuyến đi và thành phố đã lập lịch từ `itineraries` (MongoDB).
  2. Tạo endpoint: `GET /api/v1/users/stats`.
* **Sản phẩm đầu ra:**
  * Endpoint tổng hợp thông số người dùng.
* **Git Commit:** `feat(user): build cross-database travel statistics and badge aggregator service`
* **DoD:** Endpoint trả về một payload JSON đầy đủ thông tin: XP, Level, Check-in Count, Badges Array, Total Trips.

---

### 🔹 DAY 47: MOBILE PROFILE & ACHIEVEMENT SCREEN (09/10/2026)
* **Mục tiêu:** Xây dựng giao diện màn hình Hồ sơ cá nhân (Profile Screen) trên React Native hiển thị trực quan cấp độ, thanh tiến trình XP và lưới Huy hiệu.
* **Nhiệm vụ cụ thể:**
  1. Dựng Header: Ảnh đại diện tròn, Tên, Bio, Nút chỉnh sửa.
  2. Dựng Level Card: Hiển thị Level hiện tại, thanh Progress Bar (số XP hiện có / số XP cần để lên cấp tiếp theo).
  3. Dựng Lưới Huy hiệu (Badges Grid): Hiển thị các huy hiệu màu (đã đạt) và huy hiệu mờ xám (chưa mở khóa). Bấm vào huy hiệu hiển thị modal giải thích tiêu chí.
  4. Dựng Thẻ thống kê: Số địa danh đã check-in, số chuyến đi đã tạo.
* **Sản phẩm đầu ra:**
  * `client/src/screens/Profile/ProfileScreen.js`.
* **Git Commit:** `feat(client): build user profile screen with level progress bar and badges grid`
* **DoD:** Giao diện hiển thị đúng dữ liệu thật lấy từ API `/api/v1/users/stats`.

---

### 🔹 DAY 48: MOBILE PROFILE EDIT & AVATAR PICKER (10/10/2026)
* **Mục tiêu:** Xây dựng màn hình Chỉnh sửa hồ sơ và tính năng chọn ảnh từ thư viện/chụp ảnh để cập nhật avatar.
* **Nhiệm vụ cụ thể:**
  1. Dựng màn hình `EditProfileScreen.js` cho phép sửa Tên, Tiểu sử.
  2. Tích hợp `react-native-image-picker`: Cho phép người dùng chọn ảnh đại diện từ Gallery hoặc Camera.
  3. Viết hàm upload ảnh qua FormData gửi lên API `POST /api/v1/users/avatar`.
  4. Cập nhật dữ liệu người dùng trong `AuthContext` ngay sau khi lưu thành công.
* **Sản phẩm đầu ra:**
  * `EditProfileScreen.js` và hàm xử lý upload ảnh di động.
* **Git Commit:** `feat(client): implement profile edit form with mobile image picker integration`
* **DoD:** Chọn ảnh từ máy ảo/điện thoại, upload thành công và avatar mới lập tức hiển thị trên Profile.

---

### 🔹 DAY 49: WEEK 7 REVIEW & PROFILE MODULE TESTING (11/10/2026)
* **Mục tiêu:** Kiểm thử toàn diện module Profile, viết báo cáo tiến độ và đóng Milestone Tuần 7.
* **Nhiệm vụ cụ thể:**
  1. Kiểm thử các trường hợp: Cập nhật thông tin hợp lệ/không hợp lệ, upload ảnh dung lượng lớn, kiểm tra tính toán Level khi cộng XP.
  2. Viết tài liệu tổng kết tuần `W7-Review-Summary.md`.
  3. Đóng Milestone `W7 - Database & Profile` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-07-review.md`.
* **Git Commit:** `test: verify user profile and avatar upload flows and close milestone W7`
* **DoD:** Module Profile hoạt động hoàn hảo; Milestone W7 đạt 100%.
