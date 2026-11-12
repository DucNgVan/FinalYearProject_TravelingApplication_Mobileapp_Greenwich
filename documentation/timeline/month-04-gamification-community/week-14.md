# WEEK 14 — NATIVE CAMERA INTEGRATION & CLOUD MEDIA STORAGE

## Tháng 4: Gamification & Community (USP)
**Milestone:** `W14 - Check-in`  
**Thời gian:** Ngày 92 – Ngày 98 (23/11/2026 – 29/11/2026)  
**Nhánh chính:** `feature/camera-checkin` (tách từ `develop`)  
**Mục tiêu tuần:** Tích hợp máy ảnh chụp hình trực tiếp (In-App Camera) kèm hình mờ Watermark địa danh, tải ảnh bằng chứng lên Cloudinary và lưu bản ghi Check-in vào cơ sở dữ liệu PostgreSQL.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 92: CHECK-IN TRANSACTION ENTITY & SPAM PREVENTION (23/11/2026)
* **Mục tiêu:** Xây dựng mô hình dữ liệu Check-in trong PostgreSQL với cơ chế chống gian lận và chống spam nhiều lần.
* **Nhiệm vụ cụ thể:**
  1. Hoàn thiện bảng `checkins` trong PostgreSQL:
     * `id` UUID, `user_id` FK, `landmark_id` FK, `latitude` NUMERIC, `longitude` NUMERIC, `photo_url` TEXT, `verified_at` TIMESTAMP.
     * Ràng buộc duy nhất (Unique Constraint): `UNIQUE(user_id, landmark_id)` — Mỗi người dùng chỉ được nhận điểm Check-in 1 lần cho 1 địa danh (hoặc giới hạn 1 lần / 24 giờ).
  2. Viết API: `POST /api/v1/checkins`:
     * Kiểm tra: User đã check-in địa danh này chưa?
     * Kiểm tra: Tọa độ gửi lên có nằm trong bán kính Geofence của địa danh không?
     * Lưu bản ghi check-in vào cơ sở dữ liệu.
* **Sản phẩm đầu ra:**
  * `checkin.controller.js`, `checkin.service.js`, `checkin.routes.js`.
* **Git Commit:** `feat(gamify): implement checkin transaction entity with duplicate spam prevention`
* **DoD:** Gửi request check-in lần thứ 2 với cùng 1 địa danh bị từ chối 400 Bad Request kèm thông báo đã check-in trước đó.

---

### 🔹 DAY 93: CLOUDINARY CHECK-IN MEDIA UPLOAD PIPELINE (24/11/2026)
* **Mục tiêu:** Xây dựng đường ống tải ảnh check-in lên Cloudinary, nén ảnh tự động và tổ chức thư mục lưu trữ khoa học.
* **Nhiệm vụ cụ thể:**
  1. Cấu hình thư mục lưu trữ chuyên biệt trên Cloudinary: `nomadix/checkins/${city}/${landmarkId}/`.
  2. Tự động áp dụng bộ chuyển đổi hình ảnh:
     * Định dạng: Auto WebP (`f_auto,q_auto`).
     * Độ phân giải tối đa: $1280 \times 720$ pixels (Tối ưu hóa dung lượng đường truyền mobile $< 300\text{KB}$).
  3. Đính kèm Metadata vào ảnh trên Cloudinary: `tags: ['nomadix', 'checkin', landmarkName, userId]`.
* **Sản phẩm đầu ra:**
  * `checkinUpload.service.js`.
* **Git Commit:** `feat(gamify): configure cloudinary checkin media pipeline with automated webp optimization`
* **DoD:** Tải ảnh lên nhận được HTTPS URL tối ưu hóa hiển thị nhanh trên ứng dụng di động.

---

### 🔹 DAY 94: MOBILE IN-APP CAMERA WITH WATERMARK OVERLAY (25/11/2026)
* **Mục tiêu:** Xây dựng màn hình chụp ảnh trực tiếp trong app (In-App Camera) kèm khung ngắm Watermark hiển thị thông tin địa danh thời gian thực.
* **Nhiệm vụ cụ thể:**
  1. Sử dụng thư viện `react-native-vision-camera` hoặc `react-native-camera`.
  2. Dựng giao diện `CameraCaptureScreen.js`:
     * Khung ngắm toàn màn hình, nút chụp hình tròn ở giữa.
     * Nút đổi Camera trước/sau, nút bật/tắt đèn Flash.
     * Lớp phủ Watermark trong suốt ở góc dưới ảnh: Logo Nomadix + Tên địa danh (*Cầu Rồng Đà Nẵng*) + Ngày giờ + Tọa độ GPS.
* **Sản phẩm đầu ra:**
  * `CameraCaptureScreen.js` và component `CameraWatermarkOverlay.js`.
* **Git Commit:** `feat(client): build in-app native camera viewfinder with real-time landmark watermark overlay`
* **DoD:** Mở camera, bấm chụp ảnh mượt mà kèm khung thông tin địa danh hiển thị rõ nét.

---

### 🔹 DAY 95: PHOTO PREVIEW & CHECK-IN SUBMISSION FLOW (26/11/2026)
* **Mục tiêu:** Xây dựng màn hình xem lại ảnh vừa chụp (Photo Preview) và luồng gửi dữ liệu Check-in lên máy chủ.
* **Nhiệm vụ cụ thể:**
  1. Dựng màn hình `PhotoPreviewScreen.js`:
     * Hiển thị ảnh vừa chụp.
     * Nút "Chụp lại" (Quay lại camera) và Nút "Xác nhận & Gửi Check-in".
  2. Xử lý luồng gửi Check-in:
     * Hiển thị vòng tròn tiến trình tải ảnh (Upload Progress Bar %).
     * Gửi đồng thời ảnh + Tọa độ GPS hiện tại lên API `POST /api/v1/checkins`.
     * Khi thành công ➔ Tự động chuyển tiếp người dùng sang màn hình Làm bài trắc nghiệm văn hóa (Cultural Quiz).
* **Sản phẩm đầu ra:**
  * `PhotoPreviewScreen.js` và hook `useCheckinSubmit.js`.
* **Git Commit:** `feat(client): implement photo preview and seamless checkin submission pipeline`
* **DoD:** Bấm gửi check-in thành công lập tức chuyển tiếp sang màn hình làm bài Quiz văn hóa.

---

### 🔹 DAY 96: LANDMARK PHOTO GALLERY & CHECK-IN HISTORY (27/11/2026)
* **Mục tiêu:** Xây dựng bộ sưu tập hình ảnh những người đã từng check-in tại địa danh và hiển thị lịch sử check-in cá nhân.
* **Nhiệm vụ cụ thể:**
  1. Tạo endpoint: `GET /api/v1/landmarks/:id/checkins` (Lấy danh sách ảnh check-in gần đây của cộng đồng).
  2. Component `LandmarkCommunityGallery.js`: Hiển thị lưới ảnh check-in của các du khách khác kèm avatar và thời gian ghé thăm.
  3. Hiển thị danh sách địa danh đã check-in trên tab "Lịch sử du lịch" của trang Profile cá nhân.
* **Sản phẩm đầu ra:**
  * `LandmarkCommunityGallery.js` và API lấy thư viện ảnh.
* **Git Commit:** `feat: build community landmark photo gallery and personal checkin history showcase`
* **DoD:** Người dùng xem được ảnh check-in của chính mình và cộng đồng tại từng địa danh.

---

### 🔹 DAY 97: OFFLINE QUEUE & BACKGROUND UPLOAD RETRY (28/11/2026)
* **Mục tiêu:** Xây dựng hàng đợi lưu tạm (Offline Queue) để tự động gửi lại Check-in khi mạng 3G/4G chập chờn.
* **Nhiệm vụ cụ thể:**
  1. Sử dụng thư viện `@react-native-community/netinfo` theo dõi trạng thái kết nối Internet.
  2. Nếu mất mạng khi bấm gửi: Lưu thông tin check-in và ảnh cục bộ vào AsyncStorage.
  3. Khi có mạng trở lại: Tự động chạy ngầm gửi tiếp dữ liệu lên server và thông báo cho người dùng qua Toast notification.
* **Sản phẩm đầu ra:**
  * Module `offlineCheckinQueue.js`.
* **Git Commit:** `feat(client): add offline checkin queue with automated background retry on network recovery`
* **DoD:** Tắt mạng bấm check-in, bật mạng lại tự động tải ảnh lên thành công.

---

### 🔹 DAY 98: WEEK 14 REVIEW & CAMERA CHECK-IN TESTING (29/11/2026)
* **Mục tiêu:** Kiểm thử toàn diện module Camera & Check-in, viết tài liệu tuần và đóng Milestone Tuần 14.
* **Nhiệm vụ cụ thể:**
  1. Kiểm thử kịch bản: Chụp ảnh máy thật ➔ Tải lên Cloudinary ➔ Lưu PostgreSQL ➔ Kiểm tra ràng buộc chống check-in trùng lặp.
  2. Viết tài liệu tổng kết tuần `W14-Review-Summary.md`.
  3. Đóng Milestone `W14 - Check-in` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-14-review.md`.
* **Git Commit:** `test(gamify): verify end-to-end camera checkin upload and close milestone W14`
* **DoD:** Luồng Check-in bằng hình ảnh hoạt động trơn tru 100%; Milestone W14 hoàn thành.
