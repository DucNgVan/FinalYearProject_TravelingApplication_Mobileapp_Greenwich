# WEEK 13 — LANDMARK CATALOG, GPS GEOFENCING & LOCATION ENGINE

## Tháng 4: Gamification & Community (USP)
**Milestone:** `W13 - GPS`  
**Thời gian:** Ngày 85 – Ngày 91 (16/11/2026 – 22/11/2026)  
**Nhánh chính:** `feature/landmark-gps` (tách từ `develop`)  
**Mục tiêu tuần:** Xây dựng danh mục địa danh văn hóa, triển khai thuật toán xác thực vị trí thời gian thực qua GPS Geofencing ($\le 100\text{m}$) trên cả Backend và Mobile — Nền tảng cốt lõi của tính năng Gamification độc quyền.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 85: LANDMARK CATALOG BACKEND APIS & SEED DATA (16/11/2026)
* **Mục tiêu:** Xây dựng các API quản lý và tra cứu địa danh du lịch theo từng thành phố lưu trữ trong PostgreSQL.
* **Nhiệm vụ cụ thể:**
  1. Hoàn thiện bảng `landmarks` với các trường: `id`, `name`, `city`, `country`, `latitude`, `longitude`, `geofence_radius_meters` (Mặc định: 100m), `description`, `cover_image_url`, `xp_reward` (Mặc định: 150 XP), `historical_facts`.
  2. Viết các API:
     * `GET /api/v1/landmarks`: Lấy danh sách địa danh (Lọc theo `?city=Da Nang`, hỗ trợ phân trang).
     * `GET /api/v1/landmarks/:id`: Lấy thông tin chi tiết của 1 địa danh kèm trạng thái check-in của user hiện tại.
     * `POST /api/v1/admin/landmarks`: Tạo địa danh mới (Dành cho Admin).
* **Sản phẩm đầu ra:**
  * `landmark.controller.js`, `landmark.service.js`, `landmark.routes.js`.
* **Git Commit:** `feat(gamify): build landmark catalog api endpoints and spatial database seeders`
* **DoD:** Gọi API lấy danh sách địa danh trả về đầy đủ tọa độ, bán kính và thông tin lịch sử.

---

### 🔹 DAY 86: GEOFENCING VALIDATION ALGORITHM (HAVERSINE) (17/11/2026)
* **Mục tiêu:** Cài đặt thuật toán tính khoảng cách địa lý chính xác (Haversine Formula) tại Backend để xác minh người dùng có thực sự đứng trong bán kính cho phép của địa danh hay không.
* **Nhiệm vụ cụ thể:**
  1. Viết module `server/src/utils/geoHelper.js`:
     * Hàm `calculateHaversineDistance(lat1, lon1, lat2, lon2)` trả về khoảng cách tính bằng mét ($m$).
     * Hàm `isWithinGeofence(userLat, userLng, landmarkLat, landmarkLng, radiusMeters)`.
  2. Viết API kiểm tra nhanh: `POST /api/v1/checkins/validate-location`:
     * Body: `{ landmarkId, userLatitude, userLongitude }`.
     * Xử lý: Lấy tọa độ địa danh từ DB ➔ Tính khoảng cách ➔ Nếu $\le 100\text{m}$ trả về `{ isValid: true, distanceMeters: 42 }` ➔ Nếu $> 100\text{m}$ trả về `{ isValid: false, distanceMeters: 350, message: "Bạn đang cách địa danh 350m, vui lòng đến gần hơn" }`.
* **Sản phẩm đầu ra:**
  * `geoHelper.js` và endpoint validate vị trí.
* **Git Commit:** `feat(gamify): implement backend haversine geofencing validation service`
* **DoD:** Unit Test kiểm tra các cặp tọa độ cách nhau 50m (Hợp lệ) và 200m (Bị từ chối) đạt 100% độ chính xác.

---

### 🔹 DAY 87: MOBILE GEOLOCATION TRACKER & PERMISSION HANDLER (18/11/2026)
* **Mục tiêu:** Xây dựng module định vị di động với độ chính xác cao (High Accuracy GPS) trên React Native và xử lý các trạng thái từ chối quyền.
* **Nhiệm vụ cụ thể:**
  1. Viết service `client/src/services/locationService.js`:
     * Yêu cầu quyền vị trí `requestLocationPermission()`.
     * Lấy tọa độ hiện tại `getCurrentPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 })`.
  2. Bổ sung giao diện xử lý ngoại lệ:
     * Người dùng chưa bật GPS thiết bị ➔ Hiển thị Modal yêu cầu bật Location Services.
     * Người dùng từ chối cấp quyền ➔ Hiển thị hướng dẫn mở Cài đặt ứng dụng.
* **Sản phẩm đầu ra:**
  * `locationService.js` và Permission Modals.
* **Git Commit:** `feat(client): implement high-accuracy mobile geolocation service with robust permission handling`
* **DoD:** Ứng dụng lấy được tọa độ Latitude, Longitude thực tế của thiết bị với độ chính xác cao.

---

### 🔹 DAY 88: MOCK LOCATION DEBUGGER TOOL FOR EMULATORS (19/11/2026)
* **Mục tiêu:** Xây dựng công cụ giả lập tọa độ nội bộ (Debug Location Drawer) để phục vụ quá trình test trên Emulator và demo cho Hội đồng chấm đồ án.
* **Nhiệm vụ cụ thể:**
  1. Tạo component `LocationDebugTool.js` (Chỉ hiển thị khi `__DEV__ === true` hoặc bật chế độ Demo Mode):
     * Danh sách nút chọn nhanh tọa độ các địa danh: *"Đứng tại Cầu Rồng Đà Nẵng"*, *"Đứng tại Ngũ Hành Sơn"*, *"Đứng cách Cầu Rồng 500m (Test ngoài vùng)"*.
  2. Cho phép tester dễ dàng kiểm thử tính năng Check-in mà không bắt buộc phải di chuyển vật lý đến thành phố đó.
* **Sản phẩm đầu ra:**
  * Component `LocationDebugTool.js` trong thư mục `client/src/components/DevTools/`.
* **Git Commit:** `feat(client): integrate internal mock location injector tool for developer testing`
* **DoD:** Chọn tọa độ mẫu trên công cụ Debug lập tức cập nhật tọa độ GPS giả lập của app.

---

### 🔹 DAY 89: MOBILE LANDMARK DISCOVERY & DISTANCE RADAR UI (20/11/2026)
* **Mục tiêu:** Xây dựng giao diện Khám phá địa danh trên React Native hiển thị khoảng cách thời gian thực tính từ vị trí người dùng.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng màn hình `ExploreLandmarksScreen.js`:
     * Bộ lọc theo thành phố (Đà Nẵng, Hà Nội, TP.HCM...).
     * Thẻ địa danh: Ảnh bìa, Tên địa danh, Tag *"Cách bạn 85m"* (Màu xanh lá) hoặc *"Cách bạn 2.4 km"* (Màu xám).
     * Tag trạng thái: *"Đã khám phá ✓"* hoặc *"Chưa ghé thăm"*.
  2. Nút "Chỉ đường": Bấm vào tự động mở Google Maps dẫn đường đến địa danh.
* **Sản phẩm đầu ra:**
  * `ExploreLandmarksScreen.js` và `LandmarkCard.js`.
* **Git Commit:** `feat(client): build landmark exploration radar screen with live proximity distance tags`
* **DoD:** Danh sách địa danh tự động sắp xếp theo thứ tự gần người dùng nhất lên đầu.

---

### 🔹 DAY 90: MOBILE LANDMARK DETAIL & GEOFENCE STATUS CARD (21/11/2026)
* **Mục tiêu:** Xây dựng màn hình Chi tiết địa danh và Thẻ trạng thái Geofence với nút Check-in thông minh.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng `LandmarkDetailScreen.js`:
     * Ảnh bìa panorama chất lượng cao, bài viết giới thiệu lịch sử, văn hóa, giờ mở cửa.
     * Thẻ Geofence Radar: Hiển thị radar xoay quét vị trí.
     * Nút **"Bắt đầu Check-in"**:
       * Nếu đang ở trong bán kính $\le 100\text{m}$ ➔ Nút màu cam sáng, bấm vào chuyển sang màn hình Chụp ảnh & Làm Quiz.
       * Nếu đang ở ngoài bán kính ➔ Nút bị khóa mờ kèm thông báo: *"Bạn cần đến gần địa danh hơn để mở khóa Check-in"*.
* **Sản phẩm đầu ra:**
  * `LandmarkDetailScreen.js`.
* **Git Commit:** `feat(client): create landmark detail screen with dynamic geofence unlock state`
* **DoD:** Nút Check-in tự động chuyển từ trạng thái Khóa sang Mở khóa khi người dùng bước vào bán kính 100m.

---

### 🔹 DAY 91: WEEK 13 REVIEW & GPS GEOFENCE TESTING (22/11/2026)
* **Mục tiêu:** Kiểm thử toàn diện thuật toán Geofencing với cả tọa độ thật và giả lập, viết báo cáo tuần và đóng Milestone Tuần 13.
* **Nhiệm vụ cụ thể:**
  1. Kiểm thử kịch bản: Người dùng đứng ngoài 100m (Bị khóa) ➔ Di chuyển vào trong 100m (Mở khóa) ➔ Mất sóng GPS (Báo lỗi mất kết nối).
  2. Viết tài liệu tổng kết tuần `W13-Review-Summary.md`.
  3. Đóng Milestone `W13 - GPS` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-13-review.md`.
* **Git Commit:** `test(gamify): verify gps geofence proximity detection and close milestone W13`
* **DoD:** Tính năng quét vị trí địa danh hoạt động ổn định 100%; Milestone W13 hoàn tất.
