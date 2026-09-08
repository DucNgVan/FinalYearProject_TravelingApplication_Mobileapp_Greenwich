# 01. Functional Requirements Specification (FRS)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Phase:** Day 2 — Requirements Definition  
**Milestone:** `D2 - Requirements Definition` / `W1 - Requirements & Analysis`  

---

## 1. TỔNG QUAN HỆ THỐNG YÊU CẦU CHỨC NĂNG (OVERVIEW)

Hệ thống yêu cầu chức năng của **Nomadix** được phân rã thành **42 yêu cầu cụ thể (`FR-01` đến `FR-42`)**, bao quát 7 module cốt lõi và quản trị hệ thống:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   FUNCTIONAL REQUIREMENTS STRUCTURE                    │
├─────────────────────┬──────────────────────────────────────────────────┤
│ Module 1 (FR 01–05) │ Authentication & User Profile Management         │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Module 2 (FR 06–12) │ Smart Booking Search, Aggregation & Normalization│
├─────────────────────┼──────────────────────────────────────────────────┤
│ Module 3 (FR 13–18) │ Drag-and-Drop Itinerary Planner & Maps Routing   │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Module 4 (FR 19–25) │ GPS Geofencing, Native Camera, Quiz & Badges     │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Module 5 (FR 26–30) │ Community Q&A & "City Verified" Trust Attachment │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Module 6 (FR 31–35) │ Administrative Management & System Moderation    │
├─────────────────────┼──────────────────────────────────────────────────┤
│ Module 7 (FR 36–42) │ Collaborative Planning & Group Expense Splitting │
└─────────────────────┴──────────────────────────────────────────────────┘
```

---

## MODULE 1 — AUTHENTICATION & USER PROFILE MANAGEMENT

### `FR-01`: Đăng Ký Tài Khoản (User Registration)
* **Mô tả:** Hệ thống cho phép người dùng mới tạo tài khoản bằng Email và Mật khẩu.
* **Đầu vào (Input):** `email`, `password` (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số), `fullName`.
* **Luồng xử lý (Process):**
  1. Kiểm tra định dạng email và độ mạnh của mật khẩu.
  2. Kiểm tra email đã tồn tại trong bảng `users` (PostgreSQL) hay chưa.
  3. Băm mật khẩu bằng thuật toán Bcrypt với Salt rounds = 12.
  4. Tạo bản ghi người dùng mới với vai trò mặc định `traveler`, khởi tạo `xp = 0`, `level = 1`.
  5. Cấp phát cặp mã xác thực `accessToken` (JWT 1 ngày) và `refreshToken` (JWT 30 ngày).
* **Đầu ra (Output):** Thông tin người dùng (ẩn mật khẩu) và JWT Token.

---

### `FR-02`: Đăng Nhập & Cấp Quyền (User Login & JWT Session)
* **Mô tả:** Xác thực người dùng hiện tại và khởi tạo phiên làm việc bảo mật.
* **Đầu vào:** `email`, `password`.
* **Luồng xử lý:**
  1. Tìm kiếm user theo email trong PostgreSQL.
  2. So sánh mật khẩu ứng viên với chuỗi băm bằng `bcrypt.compare()`.
  3. Nếu khớp: Cấp phát JWT Token mới và cập nhật timestamp `last_login_at`.
  4. Nếu sai: Trả về lỗi 401 Unauthorized (ẩn thông tin chi tiết email hay password bị sai để bảo mật).
* **Đầu ra:** HTTP 200 OK + JWT Access Token + User Info.

---

### `FR-03`: Xem Hồ Sơ & Thống Kê Du Lịch (User Profile & Stats View)
* **Mô tả:** Hiển thị thông tin cá nhân, cấp độ, thanh tiến trình XP và các thành tựu du lịch.
* **Đầu vào:** `userId` (lấy từ JWT Token).
* **Luồng xử lý:**
  1. Truy vấn PostgreSQL: `full_name`, `avatar_url`, `bio`, `xp`, `level`, danh sách huy hiệu từ `user_badges`.
  2. Truy vấn PostgreSQL: Đếm tổng số địa danh đã check-in từ `checkins`.
  3. Truy vấn MongoDB: Đếm tổng số chuyến đi đã tạo từ `itineraries`.
  4. Tính toán số XP cần thiết để đạt cấp độ tiếp theo.
* **Đầu ra:** Dữ liệu JSON tổng hợp hồ sơ cá nhân và bảng thành tựu.

---

### `FR-04`: Cập Nhật Hồ Sơ & Tải Ảnh Đại Diện (Profile Update & Cloudinary Upload)
* **Mô tả:** Cho phép người dùng chỉnh sửa tên, tiểu sử và thay đổi ảnh đại diện.
* **Đầu vào:** `fullName`, `bio`, file ảnh đại diện (Multipart/form-data, tối đa 5MB).
* **Luồng xử lý:**
  1. Tải ảnh lên Cloudinary qua luồng nén tự động (Crop: 300x300, định dạng WebP).
  2. Cập nhật URL ảnh mới và thông tin vào bảng `users`.
* **Đầu ra:** Thông tin hồ sơ mới được cập nhật.

---

### `FR-05`: Đăng Xuất & Hủy Phiên Làm Việc (Logout & Session Invalidation)
* **Mô tả:** Đăng xuất an toàn khỏi thiết bị di động.
* **Luồng xử lý:** Xóa bỏ token khỏi AsyncStorage / SecureStore trên Mobile và vô hiệu hóa refreshToken trên server nếu có quản lý blacklist.
* **Đầu ra:** Chuyển hướng người dùng về màn hình Login.

---

## MODULE 2 — SMART BOOKING SEARCH & NORMALIZATION

### `FR-06`: Tìm Kiếm Chuyến Bay Đa Tiêu Chí (Flight Search)
* **Mô tả:** Cho phép người dùng tìm kiếm vé máy bay theo điểm đi, điểm đến, ngày bay và số lượng hành khách.
* **Đầu vào:** `originAirportCode` (IATA), `destinationAirportCode` (IATA), `departureDate`, `returnDate` (tùy chọn), `passengers`, `cabinClass`.
* **Luồng xử lý:**
  1. Kiểm tra tính hợp lệ của mã sân bay và ngày bay ($\text{departureDate} \ge \text{today}$).
  2. Kiểm tra bộ nhớ đệm Redis (Xem `FR-11`). Nếu có dữ liệu trả về ngay.
  3. Nếu không có cache: Gọi song song tới các Provider OTA (Amadeus, RapidAPI, MockProvider).
  4. Chuẩn hóa dữ liệu thô sang `UnifiedFlight` schema (Xem `FR-09`).
  5. Lưu kết quả vào Redis và trả về cho client.
* **Đầu ra:** Danh sách các chuyến bay phù hợp kèm giá vé, giờ bay, thời gian bay và hãng hàng không.

---

### `FR-07`: Tìm Kiếm Khách Sạn (Hotel Search)
* **Mô tả:** Cho phép tìm kiếm phòng khách sạn theo thành phố, ngày nhận/trả phòng và số lượng khách.
* **Đầu vào:** `cityCode` / `cityName`, `checkInDate`, `checkOutDate`, `guests`, `rooms`.
* **Luồng xử lý:** Tương tự luồng tìm kiếm chuyến bay (Check Redis ➔ Query Multi-Provider ➔ Normalize ➔ Cache ➔ Return).
* **Đầu ra:** Danh sách khách sạn kèm hình ảnh, hạng sao, điểm đánh giá, khoảng cách tới trung tâm và giá/đêm.

---

### `FR-08`: Tổng Hợp Dữ Liệu Đa Nguồn (Multi-Provider Aggregation)
* **Mô tả:** Hệ thống kết nối đồng thời nhiều nhà cung cấp OTA qua Design Pattern **Adapter**.
* **Xử lý:** Sử dụng `Promise.allSettled()` để gửi yêu cầu song song. Nếu một API đối tác gặp sự cố hoặc timeout $> 5000\text{ms}$, hệ thống tự động loại trừ provider lỗi hoặc fallback sang `MockProvider` mà không làm chết toàn bộ request.

---

### `FR-09`: Chuẩn Hóa Dữ Liệu Thống Nhất (Data Normalization Engine)
* **Mô tả:** Chuyển đổi toàn bộ cấu trúc JSON không đồng nhất từ các API bên ngoài về một định dạng chuẩn nội bộ duy nhất (`UnifiedFlight` & `UnifiedHotel`).
* **Quy tắc chuẩn hóa:**
  * Đồng bộ trường giá: `price: { amount: Number, currency: "VND", formatted: String }`.
  * Đồng bộ định dạng thời gian: Chuẩn ISO-8601 UTC string.
  * Đồng bộ thời gian bay: Chuyển đổi mã ISO duration (ví dụ: `PT1H20M`) thành số nguyên phút (`80`).

---

### `FR-10`: Lọc Trùng Lặp & Sắp Xếp Đa Tiêu Chí (Deduplication & Sorting)
* **Mô tả:** Loại bỏ các kết quả chuyến bay/khách sạn trùng nhau giữa các nhà cung cấp và sắp xếp theo nhu cầu người dùng.
* **Quy tắc:**
  * Khử trùng chuyến bay: Cùng Hãng + Số hiệu chuyến bay + Giờ khởi hành ➔ Chọn kết quả có giá thấp nhất.
  * Sắp xếp: *Giá thấp đến cao*, *Thời gian bay ngắn nhất*, *Đánh giá cao nhất*.
  * Bộ lọc: Khoảng giá slider, số điểm dừng (Bay thẳng / 1 điểm dừng), hạng sao khách sạn.

---

### `FR-11`: Caching Kết Quả Tìm Kiếm Bằng Redis (Redis Search Caching)
* **Mô tả:** Lưu trữ kết quả tìm kiếm vào bộ nhớ RAM Redis theo mẫu Cache-Aside để giảm tải API và tăng tốc độ phản hồi.
* **Quy tắc:**
  * Khóa Cache xác định: `nomadix:flight:${origin}_${destination}_${date}_${passengers}_${class}`.
  * Thời hạn sống (TTL): $1800\text{s}$ (30 phút) cho chuyến bay, $3600\text{s}$ (60 phút) cho khách sạn.
  * Hỗ trợ cờ `?refresh=true` để ép buộc làm mới cache.

---

### `FR-12`: Chuyển Hướng Đặt Vé Ngoại Vi (Provider Redirection & Deep-linking)
* **Mô tả:** Khi người dùng bấm "Đặt vé" / "Xem chi tiết", ứng dụng mở trình duyệt nhúng an toàn (In-App Browser) chuyển hướng tới trang đích của hãng bay/khách sạn kèm theo đầy đủ tham số tìm kiếm.

---

## MODULE 3 — ITINERARY PLANNER & MAPS ROUTING

### `FR-13`: Quản Lý Chuyến Đi (Itinerary CRUD)
* **Mô tả:** Cho phép người dùng tạo mới, xem danh sách, chỉnh sửa thông tin và xóa chuyến đi cá nhân.
* **Đầu vào:** `title`, `city`, `country`, `startDate`, `endDate`, `budgetEstimate`.
* **Lưu trữ:** Lưu vào Collection `itineraries` trong MongoDB, liên kết với `userId` (PostgreSQL UUID).

---

### `FR-14`: Quản Lý Hoạt Động Từng Ngày (Multi-Day Activity Management)
* **Mô tả:** Hệ thống tự động phân chia chuyến đi thành các Tab Ngày (Day 1, Day 2, Day N). Người dùng có thể thêm địa điểm tham quan, khách sạn, nhà hàng vào từng ngày cụ thể kèm ghi chú và giờ dự kiến.

---

### `FR-15`: Kéo-Thả Sắp Xếp Thứ Tự Lộ Trình (Drag-and-Drop Reordering)
* **Mô tả:** Cho phép người dùng nhấn giữ và kéo thẻ địa điểm lên/xuống trên giao diện di động để thay đổi thứ tự tham quan trong ngày.
* **Xử lý:** Tự động cập nhật lại chỉ số `orderIndex` (1, 2, 3...) và kích hoạt tính toán lại khoảng cách di chuyển mới.

---

### `FR-16`: Trực Quan Hóa Bản Đồ Google Maps (Google Maps Visualization)
* **Mô tả:** Nhúng bản đồ tương tác hiển thị các địa điểm trong ngày dưới dạng các Marker được đánh số thứ tự ①, ②, ③... và tự động vẽ đường Polyline nối liền lộ trình di chuyển.

---

### `FR-17`: Tính Toán Khoảng Cách & Thời Gian Di Chuyển (Distance & Duration Matrix)
* **Mô tả:** Tự động tính toán khoảng cách (km) và thời gian di chuyển (phút) giữa các điểm đến liên tiếp trong ngày thông qua Google Distance Matrix API (kèm thuật toán Haversine dự phòng offline).

---

### `FR-18`: Chia Sẻ & Nhân Bản Lịch Trình (Public Sharing & One-Click Clone)
* **Mô tả:** 
  1. Người dùng có thể bật chế độ `isPublic = true` để chia sẻ lịch trình lên bảng tin cộng đồng.
  2. Người dùng khác có thể bấm nút **"Clone Trip"** để sao chép toàn bộ lịch trình về tài khoản cá nhân và tự do chỉnh sửa.

---

## MODULE 4 — GAMIFICATION & LOCATION ENGINE (USP)

### `FR-19`: Tra Cứu Danh Mục Địa Danh Văn Hóa (Landmark Exploration Catalog)
* **Mô tả:** Hiển thị danh mục các địa danh lịch sử, văn hóa theo thành phố kèm tọa độ, hình ảnh, bài viết giới thiệu lịch sử và khoảng cách thời gian thực tính từ vị trí người dùng.

---

### `FR-20`: Xác Thực Vị Trí Bằng GPS Geofencing (GPS Geofence Validation)
* **Mô tả:** Kiểm tra xem người dùng có thực sự đứng trong bán kính hợp lệ của địa danh hay không.
* **Quy tắc:**
  * Nhận tọa độ thiết bị `(userLatitude, userLongitude)`.
  * Tính khoảng cách Haversine tới tọa độ địa danh.
  * Nếu $\text{Distance} \le 100\text{ mét}$: Mở khóa quyền Check-in và làm Quiz.
  * Nếu $\text{Distance} > 100\text{ mét}$: Khóa nút Check-in và thông báo khoảng cách cần di chuyển thêm.

---

### `FR-21`: Chụp Ảnh Check-in Bằng Camera Trong Ứng Dụng (In-App Camera Capture)
* **Mô tả:** Kích hoạt camera trực tiếp trong app để người dùng chụp ảnh thực tế tại địa danh, tự động gắn lớp phủ Watermark (Tên địa danh + Thời gian + Tọa độ GPS).

---

### `FR-22`: Tải Ảnh Check-in & Chống Gian Lận Trùng Lặp (Photo Upload & Anti-Spam)
* **Mô tả:** Tải ảnh lên Cloudinary và lưu bản ghi vào bảng `checkins` (PostgreSQL).
* **Ràng buộc:** Mỗi người dùng chỉ được ghi nhận điểm Check-in 1 lần cho 1 địa danh (`UNIQUE(user_id, landmark_id)`).

---

### `FR-23`: Sinh Bài Trắc Nghiệm Văn Hóa Ngẫu Nhiên (Randomized Cultural Quiz)
* **Mô tả:** Khi check-in thành công, hệ thống lấy ngẫu nhiên 3 câu hỏi trắc nghiệm văn hóa/lịch sử liên quan đến địa danh đó từ bảng `quiz_questions`.
* **Bảo mật:** Không trả trường đáp án đúng về client trong lúc làm bài.

---

### `FR-24`: Chấm Điểm Quiz, Tính Điểm XP & Thăng Cấp (Quiz Scoring & Level Progression)
* **Mô tả:**
  * Chấm điểm bài quiz: Đạt nếu đúng $\ge 2/3$ câu ($\ge 66\%$).
  * Cộng $+150\text{ XP}$ khi hoàn thành xuất sắc.
  * Tự động tính toán thăng cấp theo công thức: $\text{Level} = \lfloor \sqrt{\text{XP} / 100} \rfloor + 1$.

---

### `FR-25`: Thuật Toán Mở Khóa Huy Hiệu Thành Phố (City Badge Unlock Engine)
* **Mô tả:** Tự động kiểm tra và trao Huy hiệu Thành phố (Ví dụ: **"Da Nang Explorer Badge"**).
* **Điều kiện:**
  1. Người dùng đã check-in thành công tối thiểu **3 địa danh khác nhau** tại thành phố đó.
  2. Người dùng đã vượt qua tối thiểu **1 bài Cultural Quiz** tại thành phố đó.
* **Xử lý:** Tạo bản ghi trong `user_badges`, thưởng thêm $+300\text{ XP}$ và gửi thông báo chúc mừng kèm hiệu ứng mở khóa huy hiệu.

---

## MODULE 5 — COMMUNITY Q&A & VERIFIED TRUST ENGINE

### `FR-26`: Bảng Tin Hỏi Đáp Theo Thành Phố (Categorized Community Feed)
* **Mô tả:** Diễn đàn hỏi đáp du lịch được tổ chức theo Quốc gia, Thành phố (Đà Nẵng, Hà Nội, TP.HCM...) và Danh mục chủ đề (Ẩm thực, Đi lại, Địa điểm ẩn...).

---

### `FR-27`: Đăng Câu Hỏi Mới (Create Question Thread)
* **Mô tả:** Cho phép người dùng đặt câu hỏi về kinh nghiệm du lịch tại một thành phố xác định kèm tiêu đề, nội dung chi tiết và các thẻ tag liên quan.

---

### `FR-28`: Trả Lời Câu Hỏi, Bình Luận & Upvote (Answer, Comment & Upvoting)
* **Mô tả:** Cho phép các thành viên trong cộng đồng viết câu trả lời, phản hồi bình luận lồng nhau và bấm nút Upvote (Hữu ích) cho câu trả lời hay.

---

### `FR-29`: Tự Động Gắn Nhãn Xác Thực Uy Tín ("City Verified" Trust Attachment)
* **Mô tả:** Khi một người dùng đăng câu trả lời trong chủ đề Thành phố (Ví dụ: Đà Nẵng):
  * Backend tự động kiểm tra xem người dùng đó đã sở hữu **Huy hiệu Thành phố Đà Nẵng** trong PostgreSQL hay chưa.
  * Nếu có: Thẻ câu trả lời tự động được gắn cờ `isCityVerified: true`, hiển thị viền mạ vàng nổi bật kèm nhãn: **"✓ Da Nang Verified — Đã khám phá 3 địa danh & hoàn thành Quiz"**.
  * Nếu không: Hiển thị như thành viên bình thường.

---

### `FR-30`: Ưu Tiên Hiển Thị Câu Trả Lời Xác Thực (Verified Answer Priority Ranking)
* **Mô tả:** Các câu trả lời có nhãn "City Verified" tự động được thuật toán xếp hạng ưu tiên hiển thị lên đầu danh sách câu trả lời (Top Answers) để người đọc dễ dàng tiếp cận nguồn tin uy tín nhất.

---

## MODULE 6 — ADMINISTRATIVE MANAGEMENT & MODERATION

### `FR-31`: Phân Quyền Quản Trị Hệ Thống (Role-Based Access Control - RBAC)
* **Mô tả:** Phân định rõ ràng quyền hạn giữa người dùng `traveler` và `admin`. Các API quản trị được bảo vệ nghiêm ngặt bằng middleware `restrictTo('admin')`.

---

### `FR-32`: Quản Lý Danh Mục Địa Danh (Admin Landmark Management)
* **Mô tả:** Cho phép Admin tạo mới, chỉnh sửa tọa độ (Latitude, Longitude), bán kính Geofence (mét), thông tin lịch sử và hình ảnh của các địa danh du lịch.

---

### `FR-33`: Quản Lý Ngân Hàng Câu Hỏi Quiz (Admin Quiz Bank Management)
* **Mô tả:** Cho phép Admin thêm mới, cập nhật câu hỏi trắc nghiệm, 4 đáp án lựa chọn, đáp án đúng và phần giải thích văn hóa cho từng địa danh.

---

### `FR-34`: Kiểm Duyệt Nội Dung Diễn Đàn (Community Content Moderation)
* **Mô tả:** Cho phép người dùng báo cáo bài viết vi phạm và cung cấp giao diện/API cho Admin xem danh sách báo cáo, ẩn hoặc xóa vĩnh viễn các câu hỏi/câu trả lời spam, xúc phạm.

---

### `FR-35`: Cấu Hình Mock Data & Giám Sát Sức Khỏe Hệ Thống (System Health & Mock Toggle)
* **Mô tả:** Cho phép bật/tắt chế độ Mock Booking Data qua biến môi trường và cung cấp endpoint `GET /api/v1/health` giám sát độ trễ thời gian thực của PostgreSQL, MongoDB, Redis và Cloudinary.

---

## MODULE 7 — COLLABORATIVE PLANNING & GROUP EXPENSE SPLITTING

### `FR-36`: Mời & Quản Lý Thành Viên Chuyến Đi (Trip Companion Invitation & RBAC)
* **Mô tả:** Cho phép chủ sở hữu chuyến đi (`owner`) mời bạn bè tham gia chuyến đi qua Email, Username hoặc Mã mời 6 ký tự (`inviteCode`).
* **Đầu vào:** `itineraryId`, `inviteeIdentifier` (email/username), `role` (`editor` | `viewer`).
* **Luồng xử lý:**
  1. Kiểm tra quyền của người gửi: Phải là `owner` của chuyến đi.
  2. Tìm kiếm người dùng được mời trong PostgreSQL theo email hoặc username.
  3. Kiểm tra xem người dùng đã là thành viên của chuyến đi chưa.
  4. Tạo bản ghi thành viên với trạng thái `pending` hoặc `accepted`.
  5. Cập nhật mảng `collaborators` trong tài liệu `itineraries` (MongoDB) và bảng quan hệ `trip_members` (PostgreSQL).
* **Đầu ra:** HTTP 201 Created + Thông tin thành viên mới tham gia.

---

### `FR-37`: Đồng Bộ Lịch Trình Nhóm Thời Gian Thực (Shared Trip Synchronization)
* **Mô tả:** Cho phép tất cả các thành viên trong chuyến đi cùng thấy dữ liệu lịch trình, danh sách điểm dừng, ghi chú và lộ trình Google Maps đồng nhất như nhau.
* **Luồng xử lý:**
  1. Khi bất kỳ thành viên có quyền `editor` thêm, xóa hoặc kéo thả sắp xếp lại thứ tự điểm đến trong ngày, hệ thống cập nhật tài liệu MongoDB.
  2. Tăng chỉ số phiên bản tài liệu `__v` (Optimistic Concurrency Control) và phát thông báo đồng bộ tới các thiết bị của thành viên nhóm.
  3. Đảm bảo mọi thành viên khi mở màn hình lịch trình đều tải được trạng thái mới nhất từ server.
* **Đầu ra:** Toàn bộ thành viên nhìn thấy giao diện và lộ trình bản đồ hoàn toàn khớp nhau.

---

### `FR-38`: Tải Lên & Quản Lý Hóa Đơn Chuyến Đi (Receipt Bill Upload & Storage)
* **Mô tả:** Cho phép thành viên chụp ảnh trực tiếp hoặc tải hóa đơn thanh toán (nhà hàng, vé xe, khách sạn...) đính kèm vào khoản chi tiêu nhóm.
* **Đầu vào:** File ảnh hóa đơn (JPEG/PNG/HEIC, tối đa 10MB), `tripId`.
* **Luồng xử lý:**
  1. Xác thực người tải lên phải có vai trò `owner` hoặc `editor` trong chuyến đi.
  2. Nén và tải ảnh lên Cloudinary qua thư mục chuyên dụng `/nomadix/receipts/{tripId}/`.
  3. Nhận về URL ảnh an toàn (`secure_url`) và lưu trữ đính kèm vào bản ghi chi tiêu.
* **Đầu ra:** `receiptImageUrl` được xác thực và hiển thị ảnh phóng to khi thành viên bấm xem hóa đơn.

---

### `FR-39`: Ghi Nhận Khoản Chi Tiêu Nhóm Đa Danh Mục (Group Expense Logging)
* **Mô tả:** Cho phép ghi nhận các khoản tiền đã chi trong suốt chuyến đi kèm phân loại danh mục chi tiết.
* **Đầu vào:** `tripId`, `payerId` (thành viên đã ứng tiền trước), `amount` (số tiền > 0), `currency` (`VND`, `USD`), `category` (`food`, `stay`, `transport`, `sightseeing`, `shopping`, `other`), `description`, `receiptUrl`, `expenseDate`.
* **Luồng xử lý:**
  1. Kiểm tra tính hợp lệ của người chi tiền và số tiền.
  2. Lưu bản ghi vào bảng `trip_expenses` (PostgreSQL).
  3. Cập nhật tổng chi phí lũy kế của chuyến đi.
* **Đầu ra:** Bản ghi chi tiêu mới với ID duy nhất, hiển thị ngay trên bảng tin chi phí nhóm.

---

### `FR-40`: Cơ Chế Chia Tiền Linh Hoạt (Flexible Expense Splitting Engine)
* **Mô tả:** Hệ thống hỗ trợ đa dạng phương thức phân bổ chi phí giữa các thành viên:
  * **Chia đều (Split Equally):** Chia đều số tiền cho toàn bộ hoặc một nhóm thành viên được chọn: $\text{Share} = \text{Total} / N$.
  * **Chia theo số tiền cụ thể (Split by Exact Amount):** Chỉ định chính xác từng thành viên phải trả bao nhiêu, đảm bảo $\sum \text{Shares} = \text{Total}$.
  * **Chia theo phần trăm hoặc số phần (Split by Percentage / Ratio):** Phân bổ theo tỷ lệ thỏa thuận, đảm bảo $\sum \% = 100\%$.
* **Đầu ra:** Các bản ghi chi tiết trong bảng `trip_expense_splits` gán cho từng `userId`.

---

### `FR-41`: Bảng Tổng Hợp Chi Phí & Số Dư Ròng Nhóm (Group Spending Dashboard & Balances)
* **Mô tả:** Cung cấp giao diện trực quan hiển thị bức tranh tài chính toàn diện của chuyến đi:
  * Tổng số tiền nhóm đã chi và chi tiêu bình quân mỗi người.
  * Biểu đồ phân bổ chi phí theo từng danh mục (Ăn uống, Chỗ ở, Di chuyển...).
  * **Bảng Số Dư Ròng (Net Balance Sheet):** Đối với mỗi thành viên $i$:
    $$\text{NetBalance}_i = \text{TotalPaid}_i - \text{TotalOwed}_i$$
    * Nếu $\text{NetBalance}_i > 0$: Thành viên được nhận lại tiền (+).
    * Nếu $\text{NetBalance}_i < 0$: Thành viên đang nợ nhóm (-).
    * Ràng buộc bảo toàn: $\sum_{i=1}^N \text{NetBalance}_i = 0$.
* **Đầu ra:** Dữ liệu JSON bảng cân đối tài chính và danh sách công nợ trực quan.

---

### `FR-42`: Thuật Toán Cân Bằng Công Nợ & Xác Nhận Quyết Toán (Debt Simplification & Settlement)
* **Mô tả:** 
  1. **Thuật toán Tối ưu hóa Dòng tiền (Greedy Debt Simplification):** Tự động quy đổi mạng lưới nợ chéo phức tạp giữa nhiều người thành số lượng giao dịch chuyển khoản ít nhất (Ví dụ: Thay vì A trả B, B trả C thì chuyển trực tiếp A trả C).
  2. **Ghi nhận & Quyết toán (Settle Up):** Khi một thành viên đã chuyển khoản xong, người nhận xác nhận thanh toán; hệ thống cập nhật trạng thái `settled`, tự động trừ nợ và lưu vào lịch sử quyết toán `trip_settlements`.
* **Đầu ra:** Danh sách hướng dẫn chuyển khoản tối ưu (*"Ai cần chuyển cho Ai bao nhiêu tiền"*) và cập nhật trạng thái số dư về 0 khi tất cả đã tất toán.
