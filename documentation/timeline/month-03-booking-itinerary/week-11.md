# WEEK 11 — REDIS CACHING STRATEGY & LATENCY BENCHMARK SETUP

## Tháng 3: Booking & Itinerary
**Milestone:** `W11 - Redis`  
**Thời gian:** Ngày 71 – Ngày 77 (02/11/2026 – 08/11/2026)  
**Nhánh chính:** `feature/redis-caching` (tách từ `develop`)  
**Mục tiêu tuần:** Tích hợp tầng đệm bộ nhớ tạm Redis theo mẫu Cache-Aside Pattern, cấu hình thu thập dữ liệu đo đạc độ trễ phản hồi (Response Latency) làm cơ sở thực nghiệm định lượng cho Báo cáo Luận văn tốt nghiệp.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 71: CACHE-ASIDE PATTERN IMPLEMENTATION (02/11/2026)
* **Mục tiêu:** Xây dựng module quản lý Cache-Aside trung tâm trong backend Node.js với thư viện `ioredis`.
* **Nhiệm vụ cụ thể:**
  1. Viết lớp tiện ích `server/src/services/cache.service.js`:
     * Phương thức `get(key)`: Đọc và giải nén JSON từ Redis.
     * Phương thức `set(key, value, ttlSeconds)`: Nén JSON và lưu với thời hạn sống TTL.
     * Phương thức `getOrSet(key, fetchFunction, ttlSeconds)`: Tự động kiểm tra Cache ➔ Nếu có trả về ngay (HIT) ➔ Nếu không gọi `fetchFunction()`, lưu vào Redis rồi trả về (MISS).
  2. Bổ sung header kiểm toán vào HTTP Response:
     * `X-Cache-Status: HIT` hoặc `X-Cache-Status: MISS`.
     * `X-Response-Time-Ms: <duration>`.
* **Sản phẩm đầu ra:**
  * `cache.service.js` và middleware đo đạc thời gian.
* **Git Commit:** `feat(cache): implement cache-aside service with dynamic x-cache-status headers`
* **DoD:** Gọi API lần 1 nhận `X-Cache-Status: MISS`, gọi lần 2 nhận `X-Cache-Status: HIT`.

---

### 🔹 DAY 72: DETERMINISTIC CACHE KEY GENERATION (03/11/2026)
* **Mục tiêu:** Xây dựng thuật toán sinh khóa Cache xác định (Deterministic Cache Keys) cho các truy vấn tìm kiếm phức tạp.
* **Nhiệm vụ cụ thể:**
  1. Viết hàm sinh khóa chuẩn trong `server/src/utils/cacheKeyHelper.js`:
     * Chuyến bay: `nomadix:flight:${origin}_${destination}_${date}_${passengers}_${cabinClass}`
     * Khách sạn: `nomadix:hotel:${city}_${checkIn}_${checkOut}_${guests}_${rooms}`
  2. Xử lý chuẩn hóa chữ hoa/thường và sắp xếp các tham số query để dù người dùng nhập thứ tự nào cũng trỏ về cùng một khóa Cache.
  3. Cấu hình TTL tối ưu: 30 phút cho chuyến bay ($1800\text{s}$), 60 phút cho khách sạn ($3600\text{s}$).
* **Sản phẩm đầu ra:**
  * `cacheKeyHelper.js` và Unit Tests.
* **Git Commit:** `feat(cache): build deterministic cache key generator for flight and hotel search queries`
* **DoD:** Các query tìm kiếm giống nhau nhưng đảo thứ tự tham số đều tạo ra cùng một Cache Key.

---

### 🔹 DAY 73: CACHE INVALIDATION & BACKGROUND REFRESH (04/11/2026)
* **Mục tiêu:** Xây dựng cơ chế làm mới và hủy bộ nhớ đệm (Cache Invalidation) khi dữ liệu hết hạn hoặc khi có yêu cầu ép buộc làm mới.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng tham số query `?refresh=true` cho phép người dùng hoặc Admin bỏ qua cache để lấy dữ liệu thời gian thực mới nhất từ API.
  2. Viết hàm xóa cache theo mẫu (Pattern Invalidation): `invalidateByPattern("nomadix:flight:HAN_DAD*")`.
  3. Xử lý phòng chống lỗi **Cache Stampede** (khi hàng trăm request cùng lúc truy cập một khóa vừa hết hạn): Sử dụng cơ chế khóa tạm thời (Mutex Lock).
* **Sản phẩm đầu ra:**
  * Logic Invalidation trong `cache.service.js`.
* **Git Commit:** `feat(cache): implement cache invalidation triggers and cache stampede protection`
* **DoD:** Gửi request kèm `?refresh=true` ép buộc server gọi API ngoài và cập nhật lại cache.

---

### 🔹 DAY 74: PERFORMANCE METRICS LOGGER & COLLECTOR (05/11/2026)
* **Mục tiêu:** Xây dựng cơ chế tự động ghi lại số liệu đo đạc thời gian phản hồi (Response Latency) vào cơ sở dữ liệu / file log để vẽ biểu đồ cho Thesis.
* **Nhiệm vụ cụ thể:**
  1. Viết interceptor lưu thông số hiệu năng vào file `logs/benchmark-metrics.csv`:
     * Cột: `Timestamp`, `Endpoint`, `CacheStatus (HIT/MISS)`, `Provider`, `ResponseTimeMs`, `PayloadSizeBytes`.
  2. Viết script phân tích thống kê `server/scripts/analyzeMetrics.js` tính toán:
     * Thời gian phản hồi trung bình (Average Latency) khi Cache MISS vs Cache HIT.
     * Tỷ lệ Cache Hit Rate ($\% = \frac{\text{Hits}}{\text{Total Requests}} \times 100$).
* **Sản phẩm đầu ra:**
  * File thu thập số liệu và script phân tích.
* **Git Commit:** `feat(perf): build automated latency metrics logger and statistical analysis tool`
* **DoD:** Chạy script xuất ra báo cáo tóm tắt chỉ số p50, p90, p99 và Hit Rate.

---

### 🔹 DAY 75: MOBILE CACHED DATA INDICATOR & PULL-TO-REFRESH (06/11/2026)
* **Mục tiêu:** Cập nhật giao diện ứng dụng di động hiển thị trạng thái dữ liệu đệm và tính năng Kéo-để-làm-mới (Pull-to-Refresh).
* **Nhiệm vụ cụ thể:**
  1. Hiển thị thanh thông báo nhỏ trên đầu màn hình kết quả: *"Kết quả tìm kiếm được cập nhật lúc 14:30 (Được lưu đệm)"*.
  2. Tích hợp `RefreshControl` trên React Native: Kéo màn hình từ trên xuống để tự động gửi request kèm `?refresh=true` lấy giá vé mới nhất.
  3. Hiển thị Skeleton Loading khi đang tải dữ liệu mới.
* **Sản phẩm đầu ra:**
  * Giao diện cập nhật tại `client/src/screens/Booking/FlightResultsScreen.js`.
* **Git Commit:** `feat(client): add pull-to-refresh forced update and cached result status indicator`
* **DoD:** Kéo màn hình thực hiện reload dữ liệu và cập nhật lại timestamp hiển thị.

---

### 🔹 DAY 76: AUTOMATED LOAD TESTING & BENCHMARK SCRIPTING (07/11/2026)
* **Mục tiêu:** Sử dụng công cụ `Autocannon` / `Artillery` để giả lập 100 yêu cầu tìm kiếm đồng thời và so sánh hiệu năng khi có/không có Redis.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện kiểm thử tải `autocannon`.
  2. Viết kịch bản kiểm thử `benchmark-test.sh`:
     * Kịch bản A: 100 requests gọi trực tiếp API ngoài (Cold Cache / No Redis).
     * Kịch bản B: 100 requests gọi qua Redis Caching (Warm Cache).
  3. Ghi lại kết quả so sánh:
     * No Cache: Latency trung bình ~ $1,250\text{ms}$, Requests/sec ~ 8 req/s.
     * With Redis Cache: Latency trung bình ~ $25\text{ms}$, Requests/sec ~ 450 req/s.
     * Hiệu năng tăng tốc gấp **50 lần**.
* **Sản phẩm đầu ra:**
  * Kịch bản `server/benchmark/run-benchmark.js` và bảng dữ liệu thực nghiệm.
* **Git Commit:** `test(perf): execute automated latency load testing and generate benchmark comparison dataset`
* **DoD:** Tạo ra bộ số liệu định lượng hoàn chỉnh với biểu đồ so sánh cho Luận văn.

---

### 🔹 DAY 77: WEEK 11 REVIEW & THESIS BENCHMARK CHAPTER (08/11/2026)
* **Mục tiêu:** Tổng kết Tuần 11, đưa toàn bộ số liệu đo đạc thực nghiệm và biểu đồ Benchmark vào bản nháp Luận văn, đóng Milestone Tuần 11.
* **Nhiệm vụ cụ thể:**
  1. Vẽ biểu đồ so sánh thời gian phản hồi (Bar Chart / Line Chart) giữa Cache Hit và Cache Miss.
  2. Viết phần thảo luận kết quả (Evaluation & Discussion) cho Thesis.
  3. Viết tài liệu tổng kết tuần `W11-Review-Summary.md`.
  4. Đóng Milestone `W11 - Redis` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-11-review.md`.
* **Git Commit:** `docs: document redis caching evaluation in thesis and close milestone W11`
* **DoD:** Phần đánh giá thực nghiệm hiệu năng Redis được hoàn thiện bài bản; Milestone W11 đạt 100%.
