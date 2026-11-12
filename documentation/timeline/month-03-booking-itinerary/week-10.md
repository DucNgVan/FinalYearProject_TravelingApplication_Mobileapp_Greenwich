# WEEK 10 — DATA NORMALIZATION ENGINE & ADAPTER PATTERN

## Tháng 3: Booking & Itinerary
**Milestone:** `W10 - Data Normalization`  
**Thời gian:** Ngày 64 – Ngày 70 (26/10/2026 – 01/11/2026)  
**Nhánh chính:** `feature/data-normalization` (tách từ `develop`)  
**Mục tiêu tuần:** Xây dựng cỗ máy chuẩn hóa dữ liệu du lịch đa nguồn (Data Normalization Engine) chuyển đổi các định dạng JSON khác nhau thành một mô hình thống nhất (Unified Model) — Điểm nhấn kỹ thuật trọng tâm cho Luận văn tốt nghiệp.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 64: UNIFIED DATA SCHEMAS MODELING (26/10/2026)
* **Mục tiêu:** Định nghĩa cấu trúc dữ liệu chuẩn mực (Nomadix Unified Schema) cho Chuyến bay và Khách sạn.
* **Nhiệm vụ cụ thể:**
  1. Định nghĩa `UnifiedFlight` Schema:
     ```json
     {
       "id": "provider_A_12345",
       "provider": "Amadeus",
       "price": { "amount": 1500000, "currency": "VND", "formatted": "1,500,000 ₫" },
       "airline": { "code": "VN", "name": "Vietnam Airlines", "logoUrl": "https://..." },
       "flightNumber": "VN123",
       "origin": { "airportCode": "HAN", "cityName": "Hanoi" },
       "destination": { "airportCode": "DAD", "cityName": "Da Nang" },
       "departureTime": "2026-11-15T08:00:00.000Z",
       "arrivalTime": "2026-11-15T09:20:00.000Z",
       "durationMinutes": 80,
       "stops": 0,
       "cabinClass": "ECONOMY",
       "bookingUrl": "https://..."
     }
     ```
  2. Định nghĩa `UnifiedHotel` Schema:
     * `id`, `provider`, `name`, `starRating`, `reviewScore`, `reviewCount`, `pricePerNight`, `totalPrice`, `address`, `location: { lat, lng }`, `amenities: []`, `photos: []`, `bookingUrl`.
* **Sản phẩm đầu ra:**
  * `server/src/models/unified/flight.schema.js` & `hotel.schema.js`.
* **Git Commit:** `feat(normalization): define standard unified json schemas for flights and hotels`
* **DoD:** Bộ Schema chuẩn hóa được viết bằng Joi/Zod và tài liệu hóa trong Thesis.

---

### 🔹 DAY 65: ADAPTER TRANSFORMATION ENGINE (27/10/2026)
* **Mục tiêu:** Triển khai Design Pattern **Adapter** để bóc tách và chuyển đổi các trường dữ liệu thô từ từng nhà cung cấp sang Unified Schema.
* **Nhiệm vụ cụ thể:**
  1. Viết `AmadeusNormalizer.js`:
     * Bóc tách trường `itineraries[0].segments`, tính tổng thời gian bay từ mã ISO-8601 duration (`PT1H20M` ➔ 80 phút).
     * Bóc tách giá vé từ `price.total`.
  2. Viết `RapidApiNormalizer.js`:
     * Chuyển đổi tên trường `gross_amount` ➔ `amount`, `hotel_name` ➔ `name`.
  3. Viết `MockNormalizer.js`:
     * Đảm bảo tính tương thích đồng bộ 100%.
* **Sản phẩm đầu ra:**
  * Các Normalizer classes trong `server/src/adapters/normalizers/`.
* **Git Commit:** `feat(normalization): implement adapter pattern normalizers for amadeus and rapidapi`
* **DoD:** Dữ liệu đầu vào từ bất kỳ nguồn nào đều cho ra đầu ra có cấu trúc thống nhất.

---

### 🔹 DAY 66: CURRENCY CONVERTER & DATETIME STANDARDIZATION (28/10/2026)
* **Mục tiêu:** Chuẩn hóa quy đổi tiền tệ và đồng bộ múi giờ quốc tế ISO-8601.
* **Nhiệm vụ cụ thể:**
  1. Viết Utility `currencyConverter.js`:
     * Hỗ trợ quy đổi giữa USD, EUR và VND theo tỷ giá tham chiếu.
     * Định dạng hiển thị tiền tệ địa phương theo chuẩn `Intl.NumberFormat`.
  2. Viết Utility `dateNormalizer.js`:
     * Đồng bộ toàn bộ timestamp về chuẩn UTC ISO-8601 string.
     * Tính toán thời gian bay qua đêm (Overnight flights) và chênh lệch múi giờ.
* **Sản phẩm đầu ra:**
  * `currencyConverter.js` và `dateNormalizer.js`.
* **Git Commit:** `feat(normalization): build currency conversion and iso-8601 datetime standardizer`
* **DoD:** Các giá vé có đơn vị tiền tệ khác nhau đều được quy đổi đồng nhất về VND hoặc USD theo yêu cầu client.

---

### 🔹 DAY 67: DEDUPLICATION, SORTING & FILTERING PIPELINE (29/10/2026)
* **Mục tiêu:** Xây dựng đường ống xử lý dữ liệu (Data Pipeline) loại bỏ kết quả trùng lặp và lọc theo yêu cầu người dùng.
* **Nhiệm vụ cụ thể:**
  1. Thuật toán lọc trùng lặp (Deduplication Algorithm):
     * Với Chuyến bay: Trùng `airline` + `flightNumber` + `departureTime` ➔ Giữ lại kết quả có giá thấp nhất.
     * Với Khách sạn: So khớp tên khách sạn (Levenshtein Distance tương đồng $> 85\%$) và tọa độ GPS ➔ Giữ lại ưu đãi tốt nhất.
  2. Bộ sắp xếp (Sorting Engine): Sắp xếp theo: *Giá rẻ nhất*, *Thời gian bay ngắn nhất*, *Đánh giá cao nhất*.
  3. Bộ lọc (Filtering Engine): Lọc theo khoảng giá slider, số điểm dừng (Direct only / 1 stop), hạng sao khách sạn (3, 4, 5 sao).
* **Sản phẩm đầu ra:**
  * `pipeline.service.js` trong server.
* **Git Commit:** `feat(normalization): implement deduplication, multi-criteria sorting, and filtering pipeline`
* **DoD:** Kết quả trả về cho client sạch sẽ, không có chuyến bay trùng lặp và được sắp xếp đúng thứ tự.

---

### 🔹 DAY 68: MOBILE SEARCH RESULTS & CARD COMPONENTS (30/10/2026)
* **Mục tiêu:** Xây dựng giao diện hiển thị danh sách kết quả tìm kiếm Chuyến bay và Khách sạn trên React Native.
* **Nhiệm vụ cụ thể:**
  1. Component `FlightCard.js`: Logo hãng bay, giờ bay, thời gian bay, nhãn tag nổi bật (*Rẻ nhất*, *Bay nhanh nhất*), giá vé to rõ.
  2. Component `HotelCard.js`: Hình ảnh slider, tên khách sạn, số sao vàng, điểm đánh giá (ví dụ: *8.8 Tuyệt vời*), khoảng cách tới trung tâm.
  3. Component `FilterModal.js`: Cho phép người dùng tick chọn bộ lọc và áp dụng tức thì.
* **Sản phẩm đầu ra:**
  * Các màn hình kết quả tại `client/src/screens/Booking/`.
* **Git Commit:** `feat(client): build flight and hotel result cards with dynamic tag badges and filter modal`
* **DoD:** Giao diện hiển thị mượt mà danh sách kết quả sau chuẩn hóa kèm bộ lọc hoạt động tức thì.

---

### 🔹 DAY 69: DEEP-LINKING & EXTERNAL REDIRECTION (31/10/2026)
* **Mục tiêu:** Xây dựng tính năng chuyển hướng người dùng sang trang web của hãng bay/khách sạn khi bấm nút "Xem chi tiết / Đặt vé".
* **Nhiệm vụ cụ thể:**
  1. Sử dụng thư viện `react-native-inappbrowser-reborn` hoặc `Linking` của React Native.
  2. Xử lý mở trình duyệt nhúng an toàn trong ứng dụng (In-App Browser) giữ nguyên trải nghiệm người dùng.
  3. Đính kèm các tham số ngày đi/về và mã chuyến bay vào URL đích.
* **Sản phẩm đầu ra:**
  * Service `deepLinking.js` trên mobile.
* **Git Commit:** `feat(client): implement in-app browser redirection for external booking deep-links`
* **DoD:** Bấm nút "Đặt vé" mở trang đối tác trong In-App Browser mượt mà, có nút quay lại app Nomadix.

---

### 🔹 DAY 70: WEEK 10 REVIEW & NORMALIZATION UNIT TESTS (01/11/2026)
* **Mục tiêu:** Kiểm thử toàn diện thuật toán chuẩn hóa dữ liệu với hơn 50 mẫu JSON đầu vào khác nhau, viết báo cáo tuần và đóng Milestone.
* **Nhiệm vụ cụ thể:**
  1. Viết bộ Unit Test kiểm tra tính toàn vẹn của Normalizers bằng Jest:
     * Test chuyển đổi Amadeus JSON ➔ Unified Schema.
     * Test chuyển đổi RapidAPI JSON ➔ Unified Schema.
     * Test thuật toán lọc trùng lặp chuyến bay.
  2. Soạn thảo tài liệu giải trình thuật toán phục vụ Chapter 5 của Thesis.
  3. Đóng Milestone `W10 - Data Normalization` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-10-review.md` và bộ Unit Test.
* **Git Commit:** `test(normalization): add comprehensive unit test suite for normalizer adapters and close W10`
* **DoD:** 100% Unit Tests cho Normalization Engine pass; Milestone W10 hoàn tất.
