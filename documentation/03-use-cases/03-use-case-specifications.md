# 03. Detailed Use Case Specifications

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** Cockburn / RUP Use Case Specification Template  
**Phase:** Day 3 — Use Case Analysis  

---

## 1. DANH MỤC 10 USE CASES TRỌNG ĐIỂM (CORE USE CASES)

```text
┌────────────────────────────────────────────────────────────────────────┐
│                       CORE 10 USE CASE SPECIFICATIONS                  │
├────────┬──────────────────────────────────────┬────────────────────────┤
│ UC-01  │ User Registration & Authentication   │ Module 1: Auth         │
│ UC-02  │ Search & Compare Flights and Hotels  │ Module 2: Booking      │
│ UC-03  │ Create & Organize Multi-Day Trip     │ Module 3: Itinerary    │
│ UC-04  │ Validate GPS Location & Check-in     │ Module 4: Gamification │
│ UC-05  │ Take Cultural Quiz & Unlock Badge    │ Module 4: Gamification │
│ UC-06  │ Post Verified Answer in Community    │ Module 5: Community    │
│ UC-07  │ Clone Public Itinerary               │ Module 3: Itinerary    │
│ UC-08  │ Moderate Community & System Control  │ Module 6: Admin        │
│ UC-09  │ Invite Companions & Sync Shared Trip │ Module 7: Collaboration│
│ UC-10  │ Log Expense, Upload Bill & Settle Debt│ Module 7: Expense Hub  │
└────────┴──────────────────────────────────────┴────────────────────────┘
```

---

## 2. CHI TIẾT ĐẶC TẢ TỪNG USE CASE

---

### `UC-01`: User Registration & Authentication

* **Mã Use Case:** `UC-01`
* **Tên Use Case:** Đăng ký và Xác thực người dùng (User Registration & Authentication).
* **Tác nhân chính (Primary Actor):** `Traveler`.
* **Mô tả tóm tắt:** Cho phép người dùng mới tạo tài khoản và đăng nhập vào hệ thống để nhận mã xác thực JWT.
* **Sự kiện kích hoạt (Trigger):** Người dùng bấm nút "Đăng ký" hoặc "Đăng nhập" trên ứng dụng di động.
* **Tiền điều kiện (Pre-conditions):** Thiết bị di động có kết nối Internet.
* **Hậu điều kiện (Post-conditions):** Tài khoản được tạo trong PostgreSQL, mật khẩu được băm bằng Bcrypt, người dùng nhận được JWT Token và chuyển vào Home Screen.

#### Luồng sự kiện chính (Main Flow):
1. Người dùng mở màn hình Đăng ký, nhập Họ tên, Email và Mật khẩu.
2. Người dùng bấm nút "Đăng ký tài khoản".
3. Hệ thống kiểm tra định dạng email và độ mạnh mật khẩu (Tối thiểu 8 ký tự, có chữ hoa, thường, số).
4. Hệ thống kiểm tra email chưa từng tồn tại trong bảng `users` (PostgreSQL).
5. Hệ thống băm mật khẩu bằng Bcrypt (`saltRounds = 12`).
6. Hệ thống tạo bản ghi người dùng với `role = 'traveler'`, `xp = 0`, `level = 1`.
7. Hệ thống sinh mã JWT Access Token và Refresh Token.
8. Ứng dụng lưu JWT Token vào bộ nhớ an toàn (SecureStore) và điều hướng vào Trang chủ.

#### Các luồng phụ / ngoại lệ (Alternative & Exception Flows):
* **`3a. Dữ liệu nhập không hợp lệ:`** Hệ thống hiển thị thông báo lỗi chi tiết bên dưới ô nhập liệu (ví dụ: *"Mật khẩu phải chứa ít nhất 1 chữ số"*). Luồng quay lại bước 1.
* **`4a. Email đã tồn tại:`** Hệ thống trả về mã lỗi 400 Bad Request kèm thông báo *"Email này đã được sử dụng"*.
* **`5a. Đăng nhập sai mật khẩu:`** Hệ thống so sánh chuỗi băm thất bại, trả về mã 401 Unauthorized kèm thông báo *"Email hoặc mật khẩu không chính xác"*.

---

### `UC-02`: Search & Compare Flights and Hotels

* **Mã Use Case:** `UC-02`
* **Tên Use Case:** Tìm kiếm và So sánh Chuyến bay/Khách sạn (Search & Compare Travel Options).
* **Tác nhân chính:** `Traveler`.
* **Tác nhân phụ:** `Amadeus API`, `RapidAPI`, `Redis Cache Service`, `Mock Provider`.
* **Tiền điều kiện:** Người dùng đã vào Tab Tìm kiếm (Booking Tab).
* **Hậu điều kiện:** Danh sách kết quả được chuẩn hóa (Unified Schema) và hiển thị sắp xếp theo nhu cầu.

#### Luồng sự kiện chính (Main Flow):
1. Người dùng nhập điểm đi (Sân bay HAN), điểm đến (Sân bay DAD), ngày bay và số lượng khách.
2. Người dùng bấm nút "Tìm chuyến bay".
3. Hệ thống tạo chuỗi khóa xác định (Deterministic Cache Key): `nomadix:flight:HAN_DAD_2026-11-15_1_ECONOMY`.
4. Hệ thống kiểm tra dữ liệu trong Redis Cache:
   * *Nếu Cache Hit:* Lấy trực tiếp dữ liệu từ RAM Redis, đính kèm Header `X-Cache-Status: HIT` và trả về Client (Thời gian phản hồi $< 50\text{ms}$).
   * *Nếu Cache Miss:* Hệ thống gọi song song (`Promise.allSettled()`) tới các nhà cung cấp OTA (Amadeus, RapidAPI).
5. Cỗ máy Normalization Engine chuyển đổi dữ liệu thô từ nhiều nguồn sang `UnifiedFlight` Schema.
6. Hệ thống lọc trùng lặp chuyến bay và sắp xếp danh sách từ giá thấp nhất đến cao nhất.
7. Hệ thống lưu kết quả chuẩn hóa vào Redis với `TTL = 1800s` và trả về cho Client.
8. Ứng dụng hiển thị danh sách các thẻ chuyến bay kèm hãng bay, giờ bay và giá vé.

#### Các luồng phụ / ngoại lệ:
* **`4a. API đối tác bị Timeout hoặc lỗi mạng (> 5s):`** Hệ thống tự động chuyển sang `MockProvider`, trả về danh sách dữ liệu chuyến bay mẫu mà không gây gián đoạn trải nghiệm người dùng.
* **`8a. Người dùng áp dụng bộ lọc nâng cao:`** Người dùng kéo slider lọc giá $< 2,000,000\text{ VND}$ hoặc tick chọn *Bay thẳng*, ứng dụng tự động lọc lại danh sách hiển thị ngay trên máy.

---

### `UC-03`: Create & Organize Multi-Day Itinerary

* **Mã Use Case:** `UC-03`
* **Tên Use Case:** Lập kế hoạch chuyến đi nhiều ngày & Bản đồ định tuyến (Multi-Day Itinerary Planning).
* **Tác nhân chính:** `Traveler`.
* **Tác nhân phụ:** `Google Maps Platform (Distance Matrix API & Maps SDK)`.
* **Tiền điều kiện:** Người dùng đã đăng nhập vào hệ thống.
* **Hậu điều kiện:** Chuyến đi được tạo trong MongoDB và hiển thị đầy đủ lộ trình trên Google Maps.

#### Luồng sự kiện chính (Main Flow):
1. Người dùng vào Tab Lịch trình và bấm nút "+ Tạo chuyến đi mới".
2. Người dùng nhập tên chuyến đi (*"Khám phá Đà Nẵng 3N2Đ"*), chọn thành phố (*Đà Nẵng*) và chọn khoảng ngày (15/11/2026 – 17/11/2026).
3. Hệ thống tự động tạo bản ghi `Itinerary` trong MongoDB với 3 Tab Ngày (Day 1, Day 2, Day 3).
4. Người dùng bấm "+ Thêm địa điểm" vào Ngày 1, tìm kiếm và chọn "Cầu Rồng" và "Bảo tàng Chăm".
5. Hệ thống gọi Google Distance Matrix API tính khoảng cách km và thời gian di chuyển giữa 2 điểm.
6. Ứng dụng nhúng bản đồ Google Maps hiển thị 2 Marker đánh số ① Cầu Rồng và ② Bảo tàng Chăm, vẽ đường Polyline nối liền lộ trình kèm nhãn *"1.2 km • 5 phút"*.
7. Người dùng nhấn giữ thẻ "Bảo tàng Chăm" kéo lên trên "Cầu Rồng" ➔ Thứ tự đổi thành ① Bảo tàng Chăm, ② Cầu Rồng; bản đồ và khoảng cách tự động vẽ lại.

#### Các luồng phụ / ngoại lệ:
* **`5a. Mất kết nối Google Distance API / Hết Quota:`** Hệ thống tự động kích hoạt công thức toán học Haversine cục bộ để tính khoảng cách đường chim bay dự phòng.

---

### `UC-04`: Validate GPS Location & Landmark Check-in (USP)

* **Mã Use Case:** `UC-04`
* **Tên Use Case:** Xác thực GPS Geofencing và Chụp ảnh Check-in (GPS Check-in & Photo Upload).
* **Tác nhân chính:** `Traveler`.
* **Tác nhân phụ:** `Thiết bị GPS`, `Thiết bị Camera`, `Cloudinary CDN`.
* **Tiền điều kiện:** Người dùng đang đứng tại khu vực địa danh thực tế và cấp quyền Location/Camera.
* **Hậu điều kiện:** Bản ghi check-in được lưu vào PostgreSQL và ảnh được tải lên Cloudinary.

#### Luồng sự kiện chính (Main Flow):
1. Người dùng mở danh mục địa danh và chọn "Cầu Rồng Đà Nẵng".
2. Người dùng bấm nút "Bắt đầu Check-in".
3. Ứng dụng yêu cầu quyền vị trí và lấy tọa độ GPS thời gian thực `(userLat, userLng)`.
4. Ứng dụng gửi tọa độ lên API `POST /api/v1/checkins/validate`.
5. Backend tính toán khoảng cách Haversine tới tọa độ địa danh Cầu Rồng:
   $$\text{Distance} = 42\text{ mét} \le 100\text{ mét (Geofence Threshold)}$$
6. Backend trả về `{ isValid: true }` ➔ Ứng dụng tự động kích hoạt máy ảnh In-App Camera.
7. Người dùng chụp ảnh kỷ niệm ➔ Màn hình hiển thị lớp phủ Watermark (Tên địa danh + Tọa độ + Thời gian).
8. Người dùng bấm "Xác nhận & Gửi Check-in".
9. Ảnh được tải lên Cloudinary (`nomadix/checkins/`) và bản ghi được lưu vào bảng `checkins` trong PostgreSQL.
10. Hệ thống tự động chuyển tiếp người dùng sang màn hình làm bài Cultural Quiz (Xem `UC-05`).

#### Các luồng phụ / ngoại lệ:
* **`5a. Người dùng đứng ngoài bán kính 100m (Cách 500m):`** Backend trả về `{ isValid: false, distanceMeters: 500 }`. Nút Check-in bị khóa mờ kèm cảnh báo *"Bạn cần đến gần địa danh hơn để mở khóa Check-in"*.
* **`9a. Người dùng đã từng check-in địa danh này trước đó:`** Hệ thống báo lỗi trùng lặp `UNIQUE constraint`, không ghi nhận thêm điểm spam nhưng vẫn cho phép làm lại bài Quiz nếu muốn.

---

### `UC-05`: Take Cultural Quiz & Unlock City Badge (USP)

* **Mã Use Case:** `UC-05`
* **Tên Use Case:** Làm bài trắc nghiệm văn hóa & Mở khóa Huy hiệu thành phố (Cultural Quiz & Badge Progression).
* **Tác nhân chính:** `Traveler`.
* **Tiền điều kiện:** Người dùng vừa hoàn thành bước Chụp ảnh Check-in tại địa danh.
* **Hậu điều kiện:** Điểm XP được cộng, cấp độ Level tăng, và Huy hiệu thành phố được mở khóa nếu đủ điều kiện.

#### Luồng sự kiện chính (Main Flow):
1. Hệ thống lấy ngẫu nhiên 3 câu hỏi trắc nghiệm văn hóa liên quan đến địa danh từ bảng `quiz_questions` (Ẩn đáp án đúng).
2. Người dùng trả lời lần lượt 3 câu hỏi với thời gian đếm ngược 30 giây mỗi câu.
3. Người dùng bấm "Nộp bài thi".
4. Backend so khớp đáp án: Người dùng trả lời đúng 3/3 câu ($\ge 66\%$ ➔ Đạt).
5. Hệ thống lưu kết quả vào `quiz_attempts` và cộng $+150\text{ XP}$ vào tài khoản trong PostgreSQL.
6. Cỗ máy `badgeEvaluator.service.js` kiểm tra điều kiện mở khóa Huy hiệu Đà Nẵng:
   * Tổng số địa danh check-in tại Đà Nẵng: 3/3 (Đạt).
   * Số bài quiz văn hóa đã vượt qua: 1/1 (Đạt).
7. Hệ thống tự động `INSERT INTO user_badges` mở khóa **"Da Nang Explorer Badge"** và thưởng thêm $+300\text{ XP}$ bonus.
8. Màn hình điện thoại kích hoạt Modal chúc mừng rực rỡ với hiệu ứng pháo hoa và Huy hiệu mạ vàng xoay 3D.

#### Các luồng phụ / ngoại lệ:
* **`4a. Người dùng trả lời sai quá 2 câu (< 66%):`** Hệ thống thông báo chưa đạt, hiển thị phần giải thích kiến thức lịch sử bổ ích và cho phép thử lại sau 10 phút.

---

### `UC-06`: Post Verified Answer in Community Forum

* **Mã Use Case:** `UC-06`
* **Tên Use Case:** Đăng câu trả lời với Huy hiệu xác thực "City Verified" (Verified Trust Attachment).
* **Tác nhân chính:** `Experienced Traveler` (Người đã có Huy hiệu thành phố).
* **Tiền điều kiện:** Người dùng đã sở hữu Huy hiệu Thành phố tương ứng (Ví dụ: Da Nang Badge).
* **Hậu điều kiện:** Câu trả lời được lưu vào MongoDB với cờ `isCityVerified = true` và được ưu tiên xếp lên đầu.

#### Luồng sự kiện chính (Main Flow):
1. Người dùng mở mục Diễn đàn hỏi đáp thành phố Đà Nẵng.
2. Người dùng mở một câu hỏi: *"Đi Cầu Rồng xem phun lửa vào giờ nào đẹp nhất?"*.
3. Người dùng nhập câu trả lời: *"Nên đứng tại đầu cầu đường Bạch Đằng từ 20:45 Thứ 7 để có góc nhìn đẹp nhất"*.
4. Người dùng bấm "Gửi câu trả lời".
5. Backend tự động kiểm tra bảng `user_badges` trong PostgreSQL: Xác nhận người dùng này đã có `badge_id = 'da-nang-explorer'`.
6. Backend lưu câu trả lời vào MongoDB với các thuộc tính:
   * `isCityVerified: true`
   * `hasCityBadge: true`
   * `verifiedBadgeTitle: "Da Nang Explorer"`
7. Giao diện hiển thị câu trả lời với **khung viền mạ vàng nổi bật**, biểu tượng vương miện cạnh avatar và dòng nhãn: **"✓ Da Nang Verified — Đã khám phá 3 địa danh & hoàn thành Quiz"**.
8. Câu trả lời tự động được ghim lên vị trí Top đầu trong danh sách các câu trả lời.

#### Các luồng phụ / ngoại lệ:
* **`5a. Người dùng chưa có Huy hiệu thành phố:`** Backend gán `isCityVerified: false`. Thẻ câu trả lời hiển thị dạng khung viền xám tiêu chuẩn của thành viên bình thường.

---

### `UC-07`: Clone Public Itinerary to Personal Workspace

* **Mã Use Case:** `UC-07`
* **Tên Use Case:** Nhân bản lịch trình công khai (One-Click Itinerary Clone).
* **Tác nhân chính:** `Traveler`.
* **Tiền điều kiện:** Có lịch trình được chia sẻ công khai (`isPublic = true`) trên cộng đồng.
* **Hậu điều kiện:** Một bản sao độc lập của chuyến đi được tạo trong tài khoản người dùng.

#### Luồng sự kiện chính (Main Flow):
1. Người dùng duyệt danh sách các chuyến đi mẫu trên bảng tin Khám phá.
2. Người dùng chọn xem chi tiết chuyến đi *"Đà Nẵng - Hội An 4N3Đ Cực Tiết Kiệm"* của một Experienced Traveler.
3. Người dùng bấm nút **"Clone Trip" (Nhân bản lịch trình)**.
4. Backend tạo một bản ghi `Itinerary` mới trong MongoDB:
   * Sao chép toàn bộ tiêu đề, danh sách các ngày và các hoạt động chi tiết.
   * Gán `userId` mới là ID của người dùng đang thao tác.
   * Tăng biến đếm `cloneCount` của bản ghi gốc thêm $+1$.
5. Ứng dụng thông báo sao chép thành công và tự động chuyển hướng người dùng vào màn hình chỉnh sửa chuyến đi riêng của mình.

---

### `UC-08`: Moderate Community & Manage System Data (Admin)

* **Mã Use Case:** `UC-08`
* **Tên Use Case:** Quản trị dữ liệu & Kiểm duyệt nội dung (System Administration & Moderation).
* **Tác nhân chính:** `Administrator`.
* **Tiền điều kiện:** Đăng nhập bằng tài khoản có vai trò `role = 'admin'`.
* **Hậu điều kiện:** Dữ liệu địa danh/quiz được cập nhật hoặc nội dung vi phạm bị xóa bỏ.

#### Luồng sự kiện chính (Main Flow):
1. Quản trị viên đăng nhập vào Dashboard quản trị.
2. Quản trị viên mở mục "Quản lý Địa danh", nhập thông tin địa danh mới: Tên (*"Chùa Linh Ứng"*), Tọa độ Lat/Lng, Bán kính Geofence ($100\text{m}$), Ảnh bìa và bài viết giới thiệu.
3. Quản trị viên thêm bộ câu hỏi trắc nghiệm văn hóa cho địa danh đó.
4. Quản trị viên mở mục "Báo cáo vi phạm Diễn đàn" (Reported Posts):
   * Xem danh sách các bài viết bị người dùng gắn cờ báo cáo Spam.
   * Bấm nút "Xóa bài viết vi phạm" ➔ Hệ thống xóa bài khỏi MongoDB và gửi thông báo cảnh cáo tới người vi phạm.
5. Quản trị viên kiểm tra endpoint `/api/v1/health` theo dõi độ trễ thời gian thực của PostgreSQL, MongoDB, Redis.

---

### `UC-09`: Invite Companions & Synchronize Shared Trip

* **Mã Use Case:** `UC-09` (Traces to `FR-36`, `FR-37`, `US-29`, `US-30`)
* **Tên Use Case:** Mời bạn bè & Đồng bộ lịch trình nhóm (Invite Companions & Sync Shared Itinerary).
* **Tác nhân chính:** `Trip Owner`, `Trip Companion`.
* **Tiền điều kiện:** Chuyến đi đã được khởi tạo trong MongoDB; người được mời đã có tài khoản Nomadix.
* **Hậu điều kiện:** Thành viên được thêm vào `trip_members` (PostgreSQL) và `itineraries.collaborators` (MongoDB); tất cả thành viên nhìn thấy lịch trình cập nhật giống hệt nhau.

#### Luồng sự kiện chính (Main Flow):
1. Chủ chuyến đi (`Trip Owner`) mở màn hình chuyến đi, bấm biểu tượng "Thêm bạn bè" (+).
2. Chủ chuyến đi nhập Email hoặc Username của bạn đồng hành và chọn vai trò: `Editor` (có quyền thêm/sửa hoạt động và thêm chi phí) hoặc `Viewer` (chỉ xem).
3. Hệ thống tìm kiếm tài khoản người dùng trong PostgreSQL, kiểm tra hợp lệ và tạo bản ghi thành viên trong bảng `trip_members` và mảng `collaborators` của MongoDB.
4. Hệ thống gửi thông báo mời tham gia tới tài khoản bạn đồng hành.
5. Bạn đồng hành mở ứng dụng Nomadix, thấy chuyến đi xuất hiện ngay trong tab "Chuyến đi của tôi" kèm nhãn "Shared Trip".
6. Khi một trong các thành viên có quyền `Editor` thêm điểm đến mới hoặc đổi thứ tự lộ trình:
   * Bản ghi MongoDB được cập nhật và tăng số hiệu phiên bản `__v`.
   * Màn hình của tất cả các thành viên trong nhóm tự động đồng bộ hiển thị các Marker trên Google Maps và danh sách hoạt động giống nhau.

#### Các luồng phụ / ngoại lệ (Alternative & Exception Flows):
* **`3a. Người dùng chưa đăng ký:`** Hệ thống hiển thị thông báo *"Tài khoản không tồn tại"* và cho phép Chủ chuyến đi copy "Mã mời chuyến đi" (6 ký tự) gửi qua Zalo/tin nhắn để bạn bè đăng ký xong nhập mã tham gia sau.
* **`6a. Xung đột đồng thời (Concurrency):** Nếu hai người cùng sửa một lúc, hệ thống sử dụng Optimistic Concurrency Control (dựa trên `__v`) để đảm bảo không ghi đè dữ liệu mất mát và thông báo cho người thao tác sau làm mới dữ liệu.

---

### `UC-10`: Log Group Expense, Upload Bill & Settle Debts

* **Mã Use Case:** `UC-10` (Traces to `FR-38` đến `FR-42`, `US-32` đến `US-35`)
* **Tên Use Case:** Quản lý Chi tiêu Nhóm, Tải lên Hóa đơn & Quyết toán Công nợ (Log Expense, Upload Bill & Settle Debts).
* **Tác nhân chính:** `Trip Companion` (Owner hoặc Editor).
* **Tiền điều kiện:** Chuyến đi có từ 2 thành viên trở lên; người thực hiện là thành viên hợp lệ.
* **Hậu điều kiện:** Khoản chi được ghi nhận trong `trip_expenses`, hóa đơn được lưu trên Cloudinary, các phần chia nợ được tính trong `trip_expense_splits`, bảng số dư nhóm cập nhật bảo toàn $\sum \text{NetBalance} = 0$.

#### Luồng sự kiện chính (Main Flow):
1. Thành viên mở Tab "Chi tiêu Nhóm" (Group Expenses) của chuyến đi.
2. Bấm nút "Thêm khoản chi mới" (+):
   * Nhập tiêu đề khoản chi (ví dụ: *"Bữa tối Hải sản Bé Mặn"*).
   * Nhập số tiền đã thanh toán (ví dụ: `1.200.000 VND`).
   * Chọn người đã ứng tiền trước (`Payer`).
   * Chọn danh mục (Ăn uống, Chỗ ở, Di chuyển, Vé tham quan, Mua sắm, Khác).
3. Thành viên bấm "Chụp / Tải ảnh hóa đơn" ➔ Máy ảnh kích hoạt, ảnh hóa đơn được chụp và tải lên Cloudinary, trả về `receiptUrl`.
4. Thành viên chọn phương thức chia tiền:
   * **Chia đều:** Hệ thống tự động chia đều $1.200.000 / 3 = 400.000\text{ VND/người}$.
   * **Chia tùy chỉnh:** Chỉ định chính xác từng thành viên chịu bao nhiêu tiền.
5. Bấm "Lưu khoản chi" ➔ Hệ thống lưu vào PostgreSQL `trip_expenses` và `trip_expense_splits` trong cùng một Transaction ACID.
6. Màn hình Bảng tổng kết chi phí tự động cập nhật:
   * Tổng số tiền đã chi của cả nhóm.
   * Biểu đồ tròn tỷ trọng các danh mục chi tiêu.
   * Bảng số dư ròng hiển thị rõ ai là chủ nợ (+), ai là con nợ (-).
7. Khi nhóm bấm xem "Kế hoạch Quyết toán" (Settle Up):
   * Thuật toán Greedy Debt Simplification tự động tính toán phương án trả nợ tối ưu với số giao dịch ít nhất.
   * Hiển thị hướng dẫn chuyển khoản rõ ràng (*"Nam chuyển 400k cho Đức"*).
8. Khi người nợ chuyển tiền ngoài đời thực và chủ nợ bấm "Xác nhận đã nhận tiền":
   * Hệ thống cập nhật bản ghi `trip_settlements` sang trạng thái `completed`.
   * Cập nhật số dư nợ của hai người về 0.

#### Các luồng phụ / ngoại lệ (Alternative & Exception Flows):
* **`4a. Tổng tiền chia lẻ không khớp tổng hóa đơn:`** Hệ thống kiểm tra $\sum \text{Shares} \ne \text{Total Amount}$, thông báo lỗi và yêu cầu điều chỉnh lại số tiền trước khi lưu.
* **`3a. Không có hóa đơn giấy:`** Cho phép bỏ qua bước tải ảnh hóa đơn (tùy chọn) và chỉ nhập thông tin số tiền.
