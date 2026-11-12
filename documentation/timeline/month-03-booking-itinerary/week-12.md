# WEEK 12 — ITINERARY PLANNER, MAPS ROUTING & MONTH 3 DEFINITION OF DONE

## Tháng 3: Booking & Itinerary
**Milestone:** `W12 - Itinerary` & `M3 - Booking & Itinerary`  
**Thời gian:** Ngày 78 – Ngày 84 (09/11/2026 – 15/11/2026)  
**Nhánh chính:** `feature/itinerary-planner` (tách từ `develop`)  
**Mục tiêu tuần:** Hoàn thiện toàn bộ module Lập kế hoạch chuyến đi (Itinerary Planner): CRUD trên MongoDB, Kéo-thả sắp xếp thứ tự trên React Native, Bản đồ Google Maps định tuyến khoảng cách/thời gian di chuyển, tính năng Nhân bản chuyến đi (Clone Itinerary) và đóng Milestone Tháng 3.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 78: ITINERARY CRUD BACKEND SERVICE (MONGODB) (09/11/2026)
* **Mục tiêu:** Xây dựng các API quản lý lịch trình chuyến đi lưu trữ trong cơ sở dữ liệu MongoDB.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng Mongoose Model `server/src/models/itinerary.model.js`.
  2. Triển khai các API:
     * `POST /api/v1/itineraries`: Tạo chuyến đi mới (Tiêu đề, Ngày bắt đầu/kết thúc, Thành phố, Ngân sách).
     * `GET /api/v1/itineraries/me`: Lấy danh sách chuyến đi của người dùng hiện tại.
     * `GET /api/v1/itineraries/:id`: Xem chi tiết lịch trình theo từng ngày.
     * `PUT /api/v1/itineraries/:id`: Cập nhật hoạt động, thứ tự các địa điểm trong ngày.
     * `DELETE /api/v1/itineraries/:id`: Xóa chuyến đi.
     * `POST /api/v1/itineraries/:id/clone`: Sao chép lịch trình của người khác vào tài khoản của mình.
* **Sản phẩm đầu ra:**
  * `itinerary.controller.js`, `itinerary.service.js`, `itinerary.routes.js`.
* **Git Commit:** `feat(itinerary): implement full mongodb itinerary crud and clone api endpoints`
* **DoD:** Thực hiện đầy đủ tạo, sửa, xem, xóa và nhân bản chuyến đi qua Postman thành công.

---

### 🔹 DAY 79: GOOGLE MAPS DISTANCE & TRANSIT ESTIMATION SERVICE (10/11/2026)
* **Mục tiêu:** Tích hợp Google Distance Matrix API để tự động tính toán khoảng cách (km) và thời gian di chuyển (phút) giữa các điểm đến liên tiếp trong ngày.
* **Nhiệm vụ cụ thể:**
  1. Viết service `server/src/services/map.service.js`:
     * Nhận danh sách tọa độ các điểm trong ngày: `[Point A (Lat, Lng), Point B (Lat, Lng), Point C (Lat, Lng)]`.
     * Gọi Google Distance Matrix API tính toán: Khoảng cách A ➔ B, Thời gian lái xe / đi bộ A ➔ B.
  2. Bổ sung thuật toán Haversine dự phòng cục bộ (Offline Fallback) để tính khoảng cách đường chim bay khi không có API key hoặc hết quota:
     $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \varphi}{2}\right) + \cos(\varphi_1)\cos(\varphi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
* **Sản phẩm đầu ra:**
  * `map.service.js` với cơ chế tính khoảng cách online + offline.
* **Git Commit:** `feat(itinerary): integrate google distance matrix api and offline haversine distance calculation`
* **DoD:** Nhập 2 tọa độ bất kỳ trả về khoảng cách km chính xác và thời gian di chuyển dự kiến.

---

### 🔹 DAY 80: MOBILE ITINERARY CREATION WIZARD & TIMELINE UI (11/11/2026)
* **Mục tiêu:** Xây dựng giao diện tạo chuyến đi từng bước và xem dòng thời gian lịch trình nhiều ngày trên React Native.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng màn hình `CreateTripModal.js`: Nhập tên chuyến đi, chọn thành phố, chọn dải ngày (ví dụ: 3 ngày 2 đêm), tự động khởi tạo 3 Tab Ngày (Day 1, Day 2, Day 3).
  2. Xây dựng component `DayTimelineView.js`: Hiển thị danh sách các thẻ địa điểm trong ngày kèm giờ dự kiến, ghi chú hoạt động và chi phí ước tính.
  3. Xây dựng nút "Thêm địa điểm": Tìm kiếm địa danh nổi tiếng hoặc chọn từ danh sách gợi ý để thêm vào ngày.
* **Sản phẩm đầu ra:**
  * Giao diện quản lý chuyến đi tại `client/src/screens/Itinerary/`.
* **Git Commit:** `feat(client): build multi-day itinerary creation wizard and timeline day view`
* **DoD:** Tạo chuyến đi 3 ngày hiển thị đầy đủ các tab ngày và danh sách hoạt động tương ứng.

---

### 🔹 DAY 81: MOBILE DRAG-AND-DROP REORDERING (12/11/2026)
* **Mục tiêu:** Tích hợp tính năng Kéo-và-Thả (Drag & Drop) mượt mà để thay đổi thứ tự tham quan các địa điểm trong ngày.
* **Nhiệm vụ cụ thể:**
  1. Cài đặt thư viện `react-native-draggable-flatlist` hoặc `react-native-reanimated`.
  2. Triển khai component `DraggableDayList.js`:
     * Nhấn giữ thẻ địa điểm ➔ Thẻ nổi lên kèm hiệu ứng rung haptic nhẹ ➔ Kéo lên/xuống đổi vị trí.
     * Thả tay ➔ Tự động cập nhật lại trường `orderIndex` (1, 2, 3...) và tự động gọi API cập nhật lại khoảng cách di chuyển mới.
* **Sản phẩm đầu ra:**
  * Component `DraggableDayList.js`.
* **Git Commit:** `feat(client): implement smooth drag-and-drop activity reordering with haptic feedback`
* **DoD:** Kéo đổi thứ tự địa điểm lập tức cập nhật lại giao diện và lưu thành công xuống cơ sở dữ liệu.

---

### 🔹 DAY 82: INTERACTIVE MAP VIEW WITH NUMBERED MARKERS & POLYLINES (13/11/2026)
* **Mục tiêu:** Nhúng bản đồ tương tác Google Maps hiển thị các điểm đến được đánh số thứ tự và vẽ đường nối (Polyline) lộ trình di chuyển trong ngày.
* **Nhiệm vụ cụ thể:**
  1. Component `ItineraryMapView.js`:
     * Hiển thị các Marker có số thứ tự hình tròn nổi bật: ① Cầu Rồng, ② Bảo tàng Chăm, ③ Chợ Cồn.
     * Tự động điều chỉnh khung nhìn (Fit to coordinates) để bao quát toàn bộ các điểm trong ngày.
  2. Vẽ đường Polyline kết nối giữa các điểm:
     * Hiển thị nhãn thông tin nhỏ ở giữa đoạn đường: *"2.5 km • 8 phút di chuyển"*.
  3. Bấm vào Marker mở thẻ thông tin tóm tắt (Callout card) ở cạnh dưới màn hình.
* **Sản phẩm đầu ra:**
  * `ItineraryMapView.js`.
* **Git Commit:** `feat(client): render interactive google maps routing with numbered markers and route polylines`
* **DoD:** Bản đồ hiển thị lộ trình di chuyển liên tục, bấm chuyển ngày thì bản đồ tự động vẽ lại theo ngày đó.

---

### 🔹 DAY 83: PUBLIC ITINERARY SHARING & ONE-CLICK CLONE FEATURE (14/11/2026)
* **Mục tiêu:** Xây dựng tính năng chia sẻ lịch trình ra cộng đồng và cho phép người dùng khác sao chép (Clone) lịch trình chỉ bằng 1 nút bấm.
* **Nhiệm vụ cụ thể:**
  1. Chức năng Public: Bật/Tắt công tắc `isPublic = true` để đưa chuyến đi lên bảng tin khám phá chung.
  2. Màn hình `ExploreTripsScreen.js`: Duyệt xem các lịch trình hay nhất do cộng đồng tạo.
  3. Nút **"Clone Trip" (Nhân bản lịch trình)**:
     * Sao chép toàn bộ cấu trúc các ngày và địa điểm sang một bản ghi mới thuộc sở hữu của người dùng hiện tại.
     * Tự động chuyển hướng vào màn hình chỉnh sửa riêng để người dùng tự do cá nhân hóa.
* **Sản phẩm đầu ra:**
  * Tính năng chia sẻ và nhân bản chuyến đi.
* **Git Commit:** `feat: implement public itinerary sharing and one-click clone to personal workspace`
* **DoD:** Người dùng B clone chuyến đi của Người dùng A thành công và có thể tự do thêm bớt địa điểm mà không ảnh hưởng tới bản gốc của A.

---

### 🔹 DAY 84: MONTH 3 GRAND REVIEW & DEFINITION OF DONE (15/11/2026)
* **Mục tiêu:** Tổng kết toàn bộ Tháng 3, kiểm tra Month 3 Definition of Done, quay video demo kịch bản Tìm kiếm Booking + Lập lịch trình Maps cho Giảng viên hướng dẫn và đóng Milestone M3.
* **Nhiệm vụ cụ thể:**
  1. Đối soát bảng tiêu chuẩn **Month 3 Definition of Done**:
     - [x] Tìm kiếm chuyến bay & khách sạn hoạt động ổn định (Amadeus, RapidAPI, Mock Provider).
     - [x] Cỗ máy Normalization Engine chuẩn hóa dữ liệu đa nguồn mượt mà.
     - [x] Tầng đệm Redis Caching hoạt động và có số liệu Benchmark tăng tốc.
     - [x] Lập lịch trình nhiều ngày lưu trữ thành công trên MongoDB.
     - [x] Kéo-thả đổi thứ tự địa điểm hoạt động mượt mà.
     - [x] Bản đồ Google Maps vẽ đúng số thứ tự điểm đến và khoảng cách di chuyển.
     - [x] Tính năng Clone chuyến đi hoạt động hoàn hảo.
  2. Viết tài liệu tổng kết tháng `month-03-summary.md`.
  3. Đóng Milestone `M3 - Booking & Itinerary` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tổng kết Tháng 3 và video demo Booking + Itinerary.
* **Git Commit:** `docs: finalize month 3 milestone and close M3 - Booking & Itinerary`
* **DoD:** Toàn bộ tính năng Booking & Itinerary hoàn tất 100%; sẵn sàng bước vào Month 4 (Gamification & Community - USP).
