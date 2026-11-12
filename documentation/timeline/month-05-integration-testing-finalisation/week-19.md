# WEEK 19 — SYSTEM OPTIMISATION, SECURITY AUDIT & EDGE CASE TESTING

## Tháng 5: Integration, Testing & Finalisation
**Milestone:** `W19 - Optimisation`  
**Thời gian:** Ngày 127 – Ngày 133 (28/12/2026 – 03/01/2027)  
**Nhánh chính:** `chore/system-optimisation` (tách từ `develop`)  
**Mục tiêu tuần:** Tối ưu hóa hiệu năng toàn diện (Frontend Bundle size, Backend Gzip, Hermes Engine), chạy bộ thực nghiệm Benchmark Redis chính thức, kiểm toán an ninh bảo mật OWASP và thử nghiệm các trường hợp biên khắc nghiệt (Edge Cases).

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 127: FRONTEND & BACKEND PERFORMANCE OPTIMIZATION (28/12/2026)
* **Mục tiêu:** Tối ưu hóa dung lượng gói cài đặt (Bundle Size) của React Native và tốc độ nén dữ liệu của Backend API.
* **Nhiệm vụ cụ thể:**
  1. Tối ưu hóa Mobile React Native:
     * Kích hoạt JavaScript Engine **Hermes** trên cả Android và iOS để tăng tốc độ khởi động app (Cold start time $< 1.5\text{s}$).
     * Sử dụng thư viện `react-native-fast-image` để lưu cache hình ảnh mượt mà, tránh tình trạng giật lag khi cuộn danh sách khách sạn / địa danh.
     * Áp dụng Code Splitting & Lazy Loading cho các màn hình ít sử dụng (Admin, Settings).
  2. Tối ưu hóa Backend Node.js:
     * Cài đặt middleware `compression` (Gzip / Brotli) nén dữ liệu JSON phản hồi từ server (Giảm dung lượng đường truyền $60–75\%$).
* **Sản phẩm đầu ra:**
  * Mã nguồn được tối ưu hóa; Tốc độ tải app và cuộn danh sách đạt chuẩn 60 FPS.
* **Git Commit:** `perf: enable hermes engine, fast-image caching, and gzip payload compression`
* **DoD:** Ứng dụng khởi động nhanh dưới 2 giây và cuộn danh sách 100 khách sạn đạt 60 FPS mượt mà.

---

### 🔹 DAY 128: OFFICIAL REDIS LATENCY BENCHMARK RUNS (29/12/2026)
* **Mục tiêu:** Chạy bộ kiểm thử hiệu năng chính thức (Official Benchmark Suite) để lấy toàn bộ biểu đồ, số liệu p50, p95, p99 đưa vào Thesis và Slide bảo vệ.
* **Nhiệm vụ cụ thể:**
  1. Sử dụng công cụ `Autocannon` / `K6` thực hiện 3 kịch bản đo đạc tải:
     * Kịch bản 1: Tải nhẹ (10 concurrent users).
     * Kịch bản 2: Tải trung bình (50 concurrent users).
     * Kịch bản 3: Tải cao (100 concurrent users trong 60 giây).
  2. Đo đạc các thông số:
     * **Without Redis:** Latency p50 = $1,150\text{ms}$, p95 = $2,400\text{ms}$, p99 = $3,800\text{ms}$; Throughput = 12 req/s.
     * **With Redis (Cache Hit):** Latency p50 = $18\text{ms}$, p95 = $35\text{ms}$, p99 = $65\text{ms}$; Throughput = 680 req/s.
  3. Xuất biểu đồ đồ họa phân giải cao (High-Res Charts) và bảng tổng kết số liệu.
* **Sản phẩm đầu ra:**
  * Thư mục `documentation/11-benchmarks/` chứa hình ảnh biểu đồ và file dữ liệu `.csv`.
* **Git Commit:** `docs: record official redis caching benchmark metrics and export high-res charts`
* **DoD:** Có đầy đủ bảng biểu số liệu thực nghiệm chứng minh hiệu năng Caching vượt trội.

---

### 🔹 DAY 129: OWASP SECURITY AUDIT & VULNERABILITY HARDENING (30/12/2026)
* **Mục tiêu:** Kiểm toán an ninh toàn diện theo tiêu chuẩn OWASP API Security Top 10 và loại bỏ các lỗ hổng bảo mật.
* **Nhiệm vụ cụ thể:**
  1. Kiểm tra phòng chống tấn công Injection:
     * SQL Injection: Đảm bảo 100% câu lệnh truy vấn PostgreSQL sử dụng Parameterized Queries ($1, $2) hoặc ORM an toàn.
     * NoSQL Injection: Cài đặt `express-mongo-sanitize` loại bỏ các ký tự `$` và `.` trong request body.
  2. Kiểm tra XSS: Cài đặt `xss-clean` để lọc sạch các mã script độc hại trong câu hỏi và bình luận diễn đàn.
  3. Kiểm tra biến môi trường: Đảm bảo không có bất kỳ API Key, JWT Secret hoặc mật khẩu DB nào bị lọt vào mã nguồn Git (Quét bằng `git-secrets` / `trufflehog`).
* **Sản phẩm đầu ra:**
  * Báo cáo kiểm toán bảo mật `documentation/12-security/security-audit-report.md`.
* **Git Commit:** `sec: sanitize nosql injections, sanitize xss inputs, and harden api security`
* **DoD:** Không phát hiện bất kỳ lỗ hổng bảo mật nghiêm trọng nào (Zero High/Critical Vulnerabilities).

---

### 🔹 DAY 130: GPS GEOFENCING EDGE-CASE STRESS TESTING (31/12/2026)
* **Mục tiêu:** Kiểm thử các tình huống biên phức tạp của tính năng GPS Geofencing để đảm bảo ứng dụng không bao giờ bị crash hoặc phán đoán sai lệch.
* **Nhiệm vụ cụ thể:**
  1. Thử nghiệm 5 trường hợp biên (Edge Cases):
     * *Case 1 (Tại đúng ranh giới):* Người dùng đứng tại vị trí cách tâm địa danh đúng $99.9\text{m}$ (Hợp lệ) và $100.1\text{m}$ (Bị từ chối).
     * *Case 2 (GPS Jitter / Trôi vị trí):* Tọa độ nhảy liên tục do nhà cao tầng che khuất ➔ Hệ thống lấy trung bình cộng 3 mẫu tọa độ liên tiếp để đảm bảo độ chính xác.
     * *Case 3 (Tắt vị trí đột ngột):* Người dùng tắt GPS ngay khi đang mở màn hình camera ➔ App hiển thị cảnh báo nhẹ nhàng, không bị crash.
     * *Case 4 (Từ chối quyền vĩnh viễn):* Xử lý hiển thị nút mở trực tiếp màn hình Cài đặt ứng dụng.
     * *Case 5 (Mất kết nối Internet khi đang đứng trước địa danh):* Lưu tạm check-in vào hàng đợi offline.
* **Sản phẩm đầu ra:**
  * Nhật ký kiểm thử các trường hợp biên GPS `documentation/10-testing/04-gps-edge-cases.md`.
* **Git Commit:** `test(gamify): harden gps geofencing against jitter, boundary limits, and edge cases`
* **DoD:** 100% các trường hợp biên GPS được xử lý mượt mà, ứng dụng luôn ổn định.

---

### 🔹 DAY 131: API FAILURE & NETWORK RESILIENCE TESTING (01/01/2027)
* **Mục tiêu:** Kiểm thử khả năng tự phục hồi (Fault Tolerance & Resilience) của hệ thống khi các dịch vụ bên ngoài gặp sự cố hoặc quá tải.
* **Nhiệm vụ cụ thể:**
  1. Thử nghiệm 4 kịch bản lỗi mạng:
     * *Kịch bản 1 (Amadeus API Timeout):* Server ngoài không phản hồi sau 5 giây ➔ Hệ thống tự động ngắt kết nối và chuyển sang Mock Provider mà người dùng không hề nhận ra lỗi.
     * *Kịch bản 2 (Google Maps Quota Limit):* API Maps bị khóa do hết lượt miễn phí ➔ Hệ thống tự động chuyển sang công thức tính khoảng cách Haversine cục bộ.
     * *Kịch bản 3 (Cloudinary Upload Error):* Tải ảnh thất bại do nghẽn mạng ➔ Hệ thống hiển thị nút "Thử lại ngay" (Retry button).
     * *Kịch bản 4 (Chế độ máy bay / Mất mạng toàn bộ):* Ứng dụng hiển thị màn hình Offline thân thiện.
* **Sản phẩm đầu ra:**
  * Báo cáo kiểm thử độ bền bỉ `documentation/10-testing/05-resilience-report.md`.
* **Git Commit:** `test: verify fault tolerance resilience against third-party api outages and timeouts`
* **DoD:** Hệ thống không bao giờ bị gián đoạn hay trả về màn hình trắng (White Screen of Death) khi có sự cố API ngoài.

---

### 🔹 DAY 132: ADMIN PANEL & DATABASE MAINTENANCE AUDIT (02/01/2027)
* **Mục tiêu:** Kiểm thử toàn bộ các tính năng của Quản trị viên (Admin) để đảm bảo có thể quản lý và vận hành hệ thống mượt mà trong buổi thuyết trình.
* **Nhiệm vụ cụ thể:**
  1. Đăng nhập tài khoản Admin (`admin@nomadix.com`):
     * Thử thêm mới 1 địa danh du lịch mới (Tên, Tọa độ, Bán kính, Ảnh).
     * Thử tạo 1 bộ câu hỏi Quiz mới cho địa danh vừa tạo.
     * Thử duyệt và xóa các bài đăng bị báo cáo vi phạm trong Diễn đàn.
     * Thử cấu hình bật/tắt chế độ Mock Booking Data từ biến môi trường.
* **Sản phẩm đầu ra:**
  * Tài liệu hướng dẫn sử dụng Admin `documentation/13-admin-guide/admin-manual.md`.
* **Git Commit:** `feat(admin): verify administrative management panel and content moderation tools`
* **DoD:** Admin có toàn quyền quản lý dữ liệu địa danh, câu hỏi và kiểm duyệt cộng đồng.

---

### 🔹 DAY 133: WEEK 19 REVIEW & SYSTEM HARDENING SIGN-OFF (03/01/2027)
* **Mục tiêu:** Tổng kết Tuần 19, chốt phiên bản mã nguồn ổn định cuối cùng (Code Freeze), viết báo cáo tuần và đóng Milestone Tuần 19.
* **Nhiệm vụ cụ thể:**
  1. Thực hiện đóng băng mã nguồn (Code Freeze): Không thêm bất kỳ tính năng mới nào, chỉ tập trung hoàn thiện tài liệu và bài thuyết trình ở Tuần 20.
  2. Viết tài liệu tổng kết tuần `W19-Review-Summary.md`.
  3. Đóng Milestone `W19 - Optimisation` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-19-review.md`.
* **Git Commit:** `docs: sign-off system hardening milestone and enforce final code freeze for W19`
* **DoD:** Hệ thống đạt trạng thái hoàn hảo 100%, không còn lỗi tồn đọng; sẵn sàng cho Tuần 20 bảo vệ đồ án.
