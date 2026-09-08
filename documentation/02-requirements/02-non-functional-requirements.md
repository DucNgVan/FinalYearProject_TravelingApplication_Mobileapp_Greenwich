# 02. Non-Functional Requirements Specification (NFRS)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** ISO/IEC 25010 Software Product Quality Model  
**Phase:** Day 2 — Requirements Definition  

---

## 1. TỔNG QUAN YÊU CẦU PHI CHỨC NĂNG (OVERVIEW)

Hệ thống yêu cầu phi chức năng của **Nomadix** được thiết kế theo tiêu chuẩn quốc tế **ISO/IEC 25010**, phân loại thành 8 nhóm yêu cầu đo lường được định lượng:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   ISO/IEC 25010 QUALITY ATTRIBUTES                     │
├──────────────┬────────────────────────┬────────────────────────────────┤
│ Mã NFR       │ Thuộc tính chất lượng  │ Tiêu chí trọng tâm             │
├──────────────┼────────────────────────┼────────────────────────────────┤
│ NFR-01       │ Performance Efficiency │ Độ trễ phản hồi & Redis Cache  │
│ NFR-02       │ Security & Privacy     │ Bcrypt, JWT & Chống gian lận   │
│ NFR-03       │ Reliability            │ Khả năng phục hồi & Fallback   │
│ NFR-04       │ Usability              │ Trải nghiệm UI/UX di động      │
│ NFR-05       │ Scalability            │ Kiến trúc Dual DB & Caching    │
│ NFR-06       │ Maintainability        │ Clean Architecture & Code Cov  │
│ NFR-07       │ Compatibility          │ Tương thích iOS, Android & OS  │
│ NFR-08       │ Academic Rigor         │ Dữ liệu thực nghiệm cho Thesis │
└──────────────┴────────────────────────┴────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC YÊU CẦU PHI CHỨC NĂNG

### `NFR-01`: Hiệu Năng & Độ Trễ Phản Hồi (Performance Efficiency)

* **`NFR-01.1` (Tốc độ phản hồi Caching):**  
  Mọi truy vấn tìm kiếm Chuyến bay / Khách sạn khi gặp trạng thái **Cache Hit trong Redis** phải trả về kết quả cho Client với thời gian phản hồi $\le 50\text{ms}$ (ở mức tải thông thường) và $\le 100\text{ms}$ (ở mức tải 100 concurrent requests).
* **`NFR-01.2` (Tốc độ phản hồi API ngoài):**  
  Khi xảy ra **Cache Miss**, thời gian xử lý tổng hợp, chuẩn hóa và phản hồi từ các API đối tác bên ngoài không được vượt quá $3,000\text{ms}$ (3 giây). Nếu vượt quá $5,000\text{ms}$, hệ thống tự động kích hoạt timeout và fallback sang Mock Provider.
* **`NFR-01.3` (Tốc độ khung hình giao diện Mobile):**  
  Ứng dụng React Native phải duy trì tốc độ khung hình ổn định ở mức **60 FPS** trong các tác vụ: Cuộn danh sách kết quả tìm kiếm (FlatList), Kéo-thả sắp xếp lịch trình (Drag & Drop), và Tương tác phóng to/thu nhỏ trên bản đồ Google Maps.
* **`NFR-01.4` (Thời gian khởi động ứng dụng):**  
  Thời gian khởi động nguội (Cold Start) của ứng dụng di động trên thiết bị chuẩn phải đạt $\le 2.0\text{s}$ nhờ việc tối ưu hóa JavaScript Engine Hermes.

---

### `NFR-02`: An Toàn & Bảo Mật Dữ Liệu (Security & Privacy)

* **`NFR-02.1` (Mã hóa mật khẩu):**  
  100% mật khẩu người dùng phải được băm (hash) bằng thuật toán **Bcrypt** với hệ số muối (Salt Rounds) tối thiểu là `12` trước khi lưu trữ vào PostgreSQL. Hệ thống tuyệt đối không lưu mật khẩu ở dạng văn bản thuần (Plaintext).
* **`NFR-02.2` (Xác thực & Quản lý phiên JWT):**  
  Hệ thống sử dụng cơ chế cấp phát mã xác thực **JSON Web Token (JWT)** với thuật toán ký `HS256` hoặc `RS256`, khóa bí mật có độ dài tối thiểu 256-bit. `accessToken` có thời hạn sống tối đa 24 giờ; `refreshToken` được lưu trữ an toàn trong Secure Storage / Keychain trên mobile.
* **`NFR-02.3` (Chống tấn công Injection & XSS):**  
  * 100% câu truy vấn PostgreSQL phải sử dụng **Parameterized Queries** ($1, $2) hoặc ORM an toàn để ngăn chặn hoàn toàn SQL Injection.
  * Mọi dữ liệu đầu vào trong Diễn đàn phải được khử trùng (Sanitized) bằng middleware `express-mongo-sanitize` (chống NoSQL Injection) và `xss-clean` (chống Cross-Site Scripting).
* **`NFR-02.4` (Bảo mật đường truyền HTTPS & CORS):**  
  Toàn bộ giao tiếp giữa Mobile Client, Backend Server, Cloudinary và Cơ sở dữ liệu phải được mã hóa qua giao thức **TLS/HTTPS**. Cấu hình CORS chỉ cho phép các nguồn hợp lệ.
* **`NFR-02.5` (Bảo mật chống gian lận vị trí GPS):**  
  Hệ thống tính toán khoảng cách Geofence trực tiếp tại Backend (Server-side Validation) dựa trên tọa độ thời gian thực, ngăn chặn việc Client tự ý sửa đổi cờ `isNearLandmark: true`.

---

### `NFR-03`: Độ Tin Cậy & Khả Năng Tự Phục Hồi (Reliability & Fault Tolerance)

* **`NFR-03.1` (Tính khả dụng hệ thống - Uptime):**  
  Hệ thống Backend API và Cơ sở dữ liệu hướng tới mục tiêu hoạt động liên tục với chỉ số khả dụng $\ge 99.5\%$ trong suốt giai đoạn thử nghiệm.
* **`NFR-03.2` (Khả năng chịu lỗi API bên ngoài):**  
  Khi các API đối tác (Amadeus, RapidAPI, Google Maps) gặp sự cố mạng, bị quá tải hoặc hết hạn mức truy cập (Quota Exceeded), hệ thống phải tự động chuyển tiếp sang **Mock Provider** hoặc thuật toán Haversine cục bộ mà không làm gián đoạn trải nghiệm người dùng hay gây crash ứng dụng.
* **`NFR-03.3` (Xử lý gián đoạn mạng Mobile - Offline Queue):**  
  Khi người dùng thực hiện Check-in tại địa danh trong điều kiện mất sóng 3G/4G, ứng dụng phải lưu tạm bản ghi vào bộ nhớ đệm cục bộ và tự động gửi lại lên Server ngay khi có kết nối Internet trở lại.

---

### `NFR-04`: Tính Khả Dụng & Trải Nghiệm Người Dùng (Usability & Accessibility)

* **`NFR-04.1` (Chuẩn thiết kế giao diện Nielsen Norman):**  
  Giao diện ứng dụng phải tuân thủ 10 nguyên tắc khả dụng của Nielsen Norman (Phản hồi trạng thái hệ thống rõ ràng, Thao tác nhất quán, Phòng ngừa lỗi, Phục hồi sau lỗi dễ dàng).
* **`NFR-04.2` (Độ tương phản & Khả năng tiếp cận):**  
  Độ tương phản màu sắc của văn bản và các nút bấm chính phải đạt chuẩn tối thiểu **WCAG 2.1 Level AA** (Tỷ lệ tương phản tối thiểu $4.5:1$ đối với văn bản thông thường).
* **`NFR-04.3` (Mục tiêu điểm số khả dụng SUS):**  
  Trong đợt kiểm thử nghiệm thu người dùng (UAT) ở Tháng 5 với 5–10 người dùng thật, điểm số Hệ thống Khả dụng (System Usability Scale - SUS) phải đạt mục tiêu $\text{SUS Score} \ge 80.0 / 100$ (Tương đương mức xếp hạng **"Grade A - Excellent"**).

---

### `NFR-05`: Khả Năng Mở Rộng & Dung Lượng Kiến Trúc (Scalability & Architecture Capacity)

* **`NFR-05.1` (Tách biệt kiến trúc Dual-Database):**  
  * Dữ liệu quan hệ, phân quyền, giao dịch điểm XP, check-in và huy hiệu được lưu trữ trong **PostgreSQL** đảm bảo tính toàn vẹn ACID tuyệt đối.
  * Dữ liệu linh hoạt, phi cấu trúc gồm lịch trình chuyến đi nhiều ngày và diễn đàn hỏi đáp được lưu trữ trong **MongoDB** để tối ưu hóa khả năng mở rộng tài liệu.
* **`NFR-05.2` (Khả năng xử lý đồng thời):**  
  Hệ thống Backend kết hợp Redis Caching có khả năng phục vụ tối thiểu $500\text{ requests/second}$ mà không bị nghẽn CPU ($< 70\%$ CPU utilization).

---

### `NFR-06`: Khả Năng Bảo Trì & Chất Lượng Mã Nguồn (Maintainability & Code Quality)

* **`NFR-06.1` (Kiến trúc phân tầng Clean Layered Architecture):**  
  Mã nguồn Backend phải được phân tách rạch ròi thành các tầng độc lập: `Routes` ➔ `Middleware` ➔ `Controllers` ➔ `Services` ➔ `Models / Repositories` ➔ `Adapters`. Tuyệt đối không viết logic nghiệp vụ trực tiếp trong Controller hoặc Route.
* **`NFR-06.2` (Độ bao phủ kiểm thử tự động - Code Coverage):**  
  Bộ Unit Test tự động cho các Services trọng điểm (Authentication, Normalization Engine, Caching, Quiz & Badge Engine) phải đạt độ bao phủ mã nguồn tối thiểu $\ge 80\%$.
* **`NFR-06.3` (Quy chuẩn định dạng & Tài liệu hóa API):**  
  Mã nguồn phải tuân thủ nghiêm ngặt chuẩn ESLint & Prettier. Toàn bộ API Endpoints phải được đặc tả 100% bằng chuẩn **OpenAPI 3.0 / Swagger** và có bộ Postman Collection tự động đi kèm.

---

### `NFR-07`: Tính Tương Thích & Tính Khả Di (Compatibility & Portability)

* **`NFR-07.1` (Hệ điều hành di động):**  
  Ứng dụng React Native phải tương thích hoàn hảo và hiển thị đúng bố cục trên cả hai nền tảng:
  * **iOS:** Phiên bản iOS 14.0 trở lên (iPhone 8 đến iPhone 16 Pro Max).
  * **Android:** Phiên bản Android 10.0 trở lên (API Level 29 đến API Level 34).
* **`NFR-07.2` (Môi trường Server):**  
  Backend Node.js phải tương thích hoàn toàn trên môi trường Node.js v18 LTS và Node.js v20 LTS trên các hệ điều hành Linux (Ubuntu), macOS và Docker Containers.

---

### `NFR-08`: Tính Khoa Học & Dữ Liệu Thực Nghiệm Cho Luận Văn (Academic Rigor)

* **`NFR-08.1` (Khả năng đo đạc thực nghiệm Benchmark):**  
  Hệ thống phải có cơ chế ghi lại log thời gian phản hồi (Response Latency ms) có/không có Redis Caching để xuất ra biểu đồ thực nghiệm định lượng phục vụ trực tiếp cho Chapter 6 (Testing & Evaluation) của Luận văn tốt nghiệp.
* **`NFR-08.2` (Tính truy xuất nguồn gốc - Traceability):**  
  100% các yêu cầu chức năng (FR) và phi chức năng (NFR) phải được ánh xạ trực tiếp sang các bài kiểm thử và mục tiêu nghiên cứu trong Ma trận RTM (Requirements Traceability Matrix).
