# WEEK 09 — BOOKING AGGREGATOR ARCHITECTURE & MULTI-PROVIDER INTEGRATION

## Tháng 3: Booking & Itinerary
**Milestone:** `W9 - Booking APIs`  
**Thời gian:** Ngày 57 – Ngày 63 (19/10/2026 – 25/10/2026)  
**Nhánh chính:** `feature/booking-aggregator` (tách từ `develop`)  
**Mục tiêu tuần:** Xây dựng kiến trúc dịch vụ tìm kiếm và tổng hợp thông tin Chuyến bay & Khách sạn từ nhiều nhà cung cấp (Amadeus, RapidAPI) kết hợp Mock Provider dự phòng.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 57: AGGREGATOR SERVICE ARCHITECTURE & INTERFACE CONTRACT (19/10/2026)
* **Mục tiêu:** Thiết kế lớp dịch vụ trung gian `BookingService` và định nghĩa giao diện trừu tượng (Interface/Contract) cho các nhà cung cấp OTA.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng lớp cơ sở `BaseBookingProvider.js`:
     * Phương thức bắt buộc: `searchFlights(searchParams)`, `searchHotels(searchParams)`.
  2. Xây dựng lớp quản lý trung tâm `BookingAggregatorService.js`:
     * Quản lý danh sách các provider đã đăng ký (`AmadeusProvider`, `RapidApiProvider`, `MockProvider`).
     * Cơ chế gọi song song (Parallel execution) sử dụng `Promise.allSettled()`.
  3. Cấu hình biến môi trường điều khiển: `USE_MOCK_BOOKING=false`, `AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`, `RAPIDAPI_KEY`.
* **Sản phẩm đầu ra:**
  * `BaseBookingProvider.js`, `BookingAggregatorService.js`.
* **Git Commit:** `feat(booking): design booking aggregator architecture with base provider contract`
* **DoD:** Aggregator service có thể đăng ký và điều phối nhiều provider linh hoạt.

---

### 🔹 DAY 58: AMADEUS FLIGHT & HOTEL API INTEGRATION (20/10/2026)
* **Mục tiêu:** Tích hợp SDK Amadeus Travel Innovation Sandbox để lấy dữ liệu chuyến bay và khách sạn thực tế.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện `amadeus`.
  2. Viết class `AmadeusProvider.js` kế thừa từ `BaseBookingProvider`:
     * Gọi API Flight Offers Search: `amadeus.shopping.flightOffersSearch.get({ originLocationCode, destinationLocationCode, departureDate, returnDate, adults, travelClass })`.
     * Gọi API Hotel Search: `amadeus.referenceData.locations.hotels.byCity.get({ cityCode })`.
  3. Bắt và xử lý các lỗi: Hết quota (Rate limit), Mã sân bay IATA không hợp lệ, Lỗi timeout.
* **Sản phẩm đầu ra:**
  * Provider `AmadeusProvider.js`.
* **Git Commit:** `feat(booking): implement amadeus flight and hotel search provider adapter`
* **DoD:** Gọi thử tìm kiếm chuyến bay HAN ➔ DAD nhận về JSON dữ liệu thực tế từ Amadeus.

---

### 🔹 DAY 59: RAPIDAPI TRAVEL DATA PROVIDER INTEGRATION (21/10/2026)
* **Mục tiêu:** Tích hợp nguồn dữ liệu thứ hai từ RapidAPI (Booking.com / Skyscanner RapidAPI) để tạo tính đa nguồn thực thụ.
* **Nhiệm vụ cụ thể:**
  1. Viết class `RapidApiProvider.js` kế thừa `BaseBookingProvider`.
  2. Cấu hình Axios instance với `X-RapidAPI-Key` và `X-RapidAPI-Host`.
  3. Xây dựng hàm tìm kiếm khách sạn theo thành phố (City Search) và tìm kiếm chuyến bay.
  4. Đặt thời gian timeout tối đa 5000ms để tránh việc API bên ngoài bị nghẽn làm chậm toàn bộ server.
* **Sản phẩm đầu ra:**
  * Provider `RapidApiProvider.js`.
* **Git Commit:** `feat(booking): integrate rapidapi secondary travel provider adapter`
* **DoD:** Dữ liệu từ RapidAPI được fetch thành công qua adapter độc lập.

---

### 🔹 DAY 60: ROBUST MOCK DATA PROVIDER ENGINE (22/10/2026)
* **Mục tiêu:** Xây dựng Mock Provider thông minh trả về dữ liệu mẫu thực tế khi không có internet, hết quota API hoặc phục vụ bài kiểm thử của Hội đồng.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng kho dữ liệu mẫu phong phú trong `server/src/mockData/`:
     * `mockFlights.json`: Chuyến bay Vietnam Airlines, Vietjet Air, Bamboo Airways từ Hà Nội, TP.HCM đến Đà Nẵng, Phú Quốc, Nha Trang.
     * `mockHotels.json`: Khách sạn 3-5 sao (Novotel, InterContinental, Mường Thanh...) kèm ảnh đẹp, tọa độ, tiện ích.
  2. Viết class `MockProvider.js` kế thừa `BaseBookingProvider`:
     * Lọc dữ liệu theo tham số người dùng nhập (Điểm đi, Điểm đến, Khoảng giá, Số sao).
     * Thêm độ trễ giả lập 300ms (`setTimeout`) để tái hiện hành vi mạng thực tế.
  3. Cơ chế tự động chuyển đổi: Nếu Amadeus/RapidAPI lỗi ➔ Tự động fallback sang MockProvider mà không làm người dùng bị gián đoạn.
* **Sản phẩm đầu ra:**
  * `MockProvider.js` và các file JSON dữ liệu mẫu.
* **Git Commit:** `feat(booking): build robust mock provider engine with auto-fallback resilience`
* **DoD:** Ngắt kết nối mạng hoặc nhập API key giả, hệ thống vẫn trả về kết quả tìm kiếm mượt mà từ Mock Data.

---

### 🔹 DAY 61: PARALLEL AGGREGATION & TIMEOUT HANDLING (23/10/2026)
* **Mục tiêu:** Tối ưu hóa việc gọi song song nhiều provider và gom kết quả phản hồi nhanh nhất.
* **Nhiệm vụ cụ thể:**
  1. Triển khai phương thức `searchFlightsAll()` trong `BookingAggregatorService`:
     * Bắn song song request tới cả Amadeus, RapidAPI và Mock (nếu được bật).
     * Sử dụng `Promise.allSettled()` để nếu 1 provider bị lỗi thì các provider khác vẫn trả về kết quả bình thường.
  2. Gom gộp mảng kết quả thô (Raw Results Array) từ tất cả các provider thành công.
* **Sản phẩm đầu ra:**
  * Logic gom dữ liệu song song trong `BookingAggregatorService.js`.
* **Git Commit:** `feat(booking): implement parallel multi-provider query execution with error resilience`
* **DoD:** Một provider bị lỗi 500 không làm ảnh hưởng tới kết quả của các provider còn lại.

---

### 🔹 DAY 62: MOBILE SEARCH UI & AUTOCOMPLETE INPUTS (24/10/2026)
* **Mục tiêu:** Xây dựng giao diện tìm kiếm Chuyến bay và Khách sạn trên Mobile React Native với tính năng tự động gợi ý sân bay/thành phố.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng component `AirportAutocompleteInput.js`: Nhập "Đà Nẵng" hoặc "DAD" tự động gợi ý danh sách sân bay IATA.
  2. Xây dựng component `DateRangePickerModal.js`: Chọn ngày đi và ngày về trực quan.
  3. Xây dựng component `PassengerSelectorModal.js`: Tăng giảm số người lớn, trẻ em và chọn hạng ghế.
* **Sản phẩm đầu ra:**
  * Các component tìm kiếm tại `client/src/components/Booking/`.
* **Git Commit:** `feat(client): build mobile flight and hotel search inputs with airport autocomplete`
* **DoD:** Người dùng dễ dàng chọn sân bay, ngày đi/về và số khách trên giao diện di động.

---

### 🔹 DAY 63: WEEK 9 REVIEW & AGGREGATOR STRESS TEST (25/10/2026)
* **Mục tiêu:** Kiểm thử tải và tính bền bỉ của Booking Aggregator, viết tài liệu tuần và đóng Milestone Tuần 9.
* **Nhiệm vụ cụ thể:**
  1. Viết Integration Test kiểm tra: Gọi tìm kiếm khi cả 2 API thật đều sống; Gọi tìm kiếm khi 1 API chết; Gọi tìm kiếm khi bật chế độ Mock.
  2. Viết tài liệu tổng kết tuần `W9-Review-Summary.md`.
  3. Đóng Milestone `W9 - Booking APIs` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-09-review.md`.
* **Git Commit:** `test(booking): add integration tests for multi-provider aggregator and close milestone W9`
* **DoD:** Aggregator chạy ổn định 100% trong mọi tình huống API lỗi; Milestone W9 hoàn thành.
