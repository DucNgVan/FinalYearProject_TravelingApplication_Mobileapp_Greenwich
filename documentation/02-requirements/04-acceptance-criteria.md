# 04. Acceptance Criteria (Gherkin Specification)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** BDD Gherkin Syntax (*Given – When – Then*)  
**Phase:** Day 2 — Requirements Definition  

---

## 1. TỔNG QUAN BDD ACCEPTANCE CRITERIA

Tài liệu này đặc tả các kịch bản kiểm thử chấp nhận (Acceptance Criteria) theo ngôn ngữ **Gherkin**, làm tiêu chuẩn nghiệm thu chính thức cho các bài kiểm thử tự động (E2E & Integration Tests) và buổi bảo vệ đồ án tốt nghiệp.

---

## 2. CHI TIẾT CÁC KỊCH BẢN CHẤP NHẬN (SCENARIOS)

### 🟢 MODULE 1: AUTHENTICATION & PROFILE

#### Kịch bản 1: Đăng ký tài khoản mới thành công
```gherkin
Scenario: Successful User Registration
  Given người dùng đang ở màn hình Đăng ký tài khoản trên ứng dụng di động
  When người dùng nhập "duc.nguyen@nomadix.com" vào ô Email
    And người dùng nhập "DucNguyen2026@" vào ô Mật khẩu
    And người dùng nhập "Nguyễn Văn Đức" vào ô Họ và tên
    And người dùng bấm nút "Đăng ký"
  Then hệ thống tạo mới một bản ghi người dùng trong bảng users của PostgreSQL
    And mật khẩu được băm an toàn bằng thuật toán Bcrypt
    And người dùng nhận được mã phản hồi HTTP 201 Created kèm JWT Token
    And màn hình tự động chuyển hướng vào Trang chủ Nomadix
```

#### Kịch bản 2: Đăng nhập thất bại do sai mật khẩu
```gherkin
Scenario: Failed Login with Invalid Password
  Given người dùng có tài khoản đã đăng ký với email "traveler@nomadix.com"
  When người dùng nhập email "traveler@nomadix.com" và mật khẩu sai "WrongPassword123"
    And người dùng bấm nút "Đăng nhập"
  Then hệ thống từ chối yêu cầu và trả về mã lỗi HTTP 401 Unauthorized
    And hiển thị thông báo lỗi "Email hoặc mật khẩu không chính xác" trên giao diện
    And không cấp phát mã JWT Token
```

---

### 🔵 MODULE 2: SMART BOOKING SEARCH & REDIS CACHING

#### Kịch bản 3: Tìm kiếm chuyến bay lần đầu (Cache Miss) và lưu vào Redis
```gherkin
Scenario: Flight Search on Cache Miss
  Given chưa có dữ liệu lưu đệm cho chặng bay "HAN" đến "DAD" ngày "2026-11-15"
  When người dùng gửi yêu cầu tìm kiếm vé máy bay từ "HAN" đến "DAD" vào ngày "2026-11-15"
  Then hệ thống ghi nhận trạng thái Header "X-Cache-Status: MISS"
    And hệ thống gọi đồng thời tới các OTA APIs bên ngoài
    And dữ liệu thô được chuẩn hóa về định dạng UnifiedFlight Schema
    And kết quả được lưu vào bộ nhớ Redis với thời gian TTL là 1800 giây
    And ứng dụng hiển thị danh sách các chuyến bay kèm thẻ giá thấp nhất
```

#### Kịch bản 4: Tìm kiếm chuyến bay lần thứ hai (Cache Hit) với độ trễ siêu tốc
```gherkin
Scenario: Flight Search on Cache Hit
  Given đã có dữ liệu tìm kiếm chặng "HAN" đến "DAD" ngày "2026-11-15" trong Redis
  When người dùng gửi lại đúng yêu cầu tìm kiếm chặng bay trên
  Then hệ thống lấy dữ liệu trực tiếp từ RAM Redis mà không gọi ra API ngoài
    And hệ thống trả về Header "X-Cache-Status: HIT"
    And thời gian phản hồi API đạt dưới 50ms
    And giao diện hiển thị danh sách kết quả ngay lập tức
```

---

### 🟡 MODULE 3: ITINERARY PLANNER & MAPS ROUTING

#### Kịch bản 5: Tạo lịch trình chuyến đi nhiều ngày và thêm địa điểm
```gherkin
Scenario: Create Multi-day Itinerary and Add Destinations
  Given người dùng đã đăng nhập thành công vào hệ thống
  When người dùng tạo chuyến đi mới tên "Khám phá Đà Nẵng" từ "2026-11-15" đến "2026-11-17"
  Then hệ thống tự động khởi tạo 3 Tab Ngày (Day 1, Day 2, Day 3) trong MongoDB
  When người dùng thêm "Cầu Rồng" và "Bảo tàng Chăm" vào Ngày 1
  Then hệ thống lưu danh sách địa điểm vào mảng days[0].items
    And bản đồ Google Maps tự động vẽ 2 Marker đánh số ① và ②
    And hệ thống tính toán và hiển thị khoảng cách di chuyển "1.2 km • 5 phút"
```

#### Kịch bản 6: Kéo-thả thay đổi thứ tự và tự động cập nhật bản đồ
```gherkin
Scenario: Drag-and-Drop Activity Reordering
  Given Ngày 1 đang có thứ tự ① Cầu Rồng, ② Bảo tàng Chăm, ③ Chợ Cồn
  When người dùng nhấn giữ thẻ "Chợ Cồn" và kéo lên vị trí số 1
  Then thứ tự mới tự động cập nhật thành ① Chợ Cồn, ② Cầu Rồng, ③ Bảo tàng Chăm
    And chỉ số orderIndex trong MongoDB được cập nhật tương ứng
    And bản đồ Google Maps tự động vẽ lại đường Polyline nối từ Chợ Cồn đến Cầu Rồng
    And khoảng cách và thời gian di chuyển giữa các điểm được tính toán lại chính xác
```

#### Kịch bản 7: Nhân bản lịch trình công khai (One-Click Clone)
```gherkin
Scenario: Clone Public Itinerary to Personal Workspace
  Given Người dùng A đã xuất bản một lịch trình công khai "Đà Nẵng 3N2Đ Siêu Tiết Kiệm"
  When Người dùng B đang xem lịch trình của A và bấm nút "Clone Trip"
  Then hệ thống sao chép toàn bộ các ngày và địa điểm sang một bản ghi Itinerary mới
    And bản ghi mới được gán userId là ID của Người dùng B
    And số lượt cloneCount của bản ghi gốc được tăng thêm 1
    And Người dùng B được tự động chuyển vào màn hình chỉnh sửa chuyến đi riêng của mình
```

---

### 🟣 MODULE 4: GAMIFICATION & LOCATION ENGINE (USP)

#### Kịch bản 8: Quét GPS Geofence thành công khi đứng trong bán kính 100m
```gherkin
Scenario: GPS Geofence Validation Success
  Given địa danh "Cầu Rồng" có tọa độ (16.0610° N, 108.2272° E) và bán kính geofence 100m
    And người dùng đang đứng tại tọa độ (16.0612° N, 108.2275° E) với khoảng cách đo được là 42 mét
  When người dùng bấm nút "Bắt đầu Check-in" trên màn hình địa danh
  Then Backend xác nhận khoảng cách 42m <= 100m
    And hệ thống mở khóa quyền chụp ảnh và làm bài Quiz
    And ứng dụng tự động kích hoạt máy ảnh In-App Camera
```

#### Kịch bản 9: Bị từ chối Check-in khi đứng ngoài bán kính 100m
```gherkin
Scenario: GPS Geofence Validation Rejected
  Given người dùng đang ở Hà Nội với khoảng cách tới Cầu Rồng Đà Nẵng là 600 km
  When người dùng cố gắng bấm nút "Bắt đầu Check-in" tại Cầu Rồng
  Then Backend từ chối yêu cầu và trả về isValid: false
    And nút Check-in bị vô hiệu hóa kèm thông báo "Bạn đang cách địa danh 600km, vui lòng đến gần hơn để mở khóa"
    And không cho phép mở camera hay nộp bài Quiz
```

#### Kịch bản 10: Chụp ảnh, Làm Quiz và Nhận thưởng XP
```gherkin
Scenario: Quiz Completion and XP Progression
  Given người dùng đã chụp ảnh kỷ niệm tại Cầu Rồng và tải lên Cloudinary thành công
  When người dùng trả lời đúng 3/3 câu hỏi trắc nghiệm văn hóa về Cầu Rồng
    And người dùng bấm nút "Nộp bài"
  Then hệ thống chấm điểm đạt 100% (Passed)
    And hệ thống cộng thêm +150 XP vào tài khoản người dùng trong PostgreSQL
    And cấp độ Level tự động tính toán lại theo công thức toán học
    And màn hình hiển thị pháo hoa chúc mừng kèm số XP nhận được
```

#### Kịch bản 11: Tự động mở khóa Huy hiệu Thành phố (City Badge Unlock)
```gherkin
Scenario: Automated City Badge Unlock
  Given người dùng đã hoàn thành Check-in tại 2 địa danh ở Đà Nẵng trước đó
  When người dùng hoàn thành Check-in và Quiz tại địa danh thứ 3 "Bán đảo Sơn Trà"
  Then hệ thống phát hiện người dùng đã thỏa mãn điều kiện: >= 3 check-in + >= 1 quiz đạt
    And hệ thống tự động thêm bản ghi vào bảng user_badges với badge_id của "Da Nang Explorer"
    And thưởng thêm +300 XP bonus
    And màn hình bật Modal chúc mừng mở khóa thành công "Da Nang Explorer Badge"
```

---

### 🟡 MODULE 5: COMMUNITY Q&A & VERIFIED TRUST ENGINE

#### Kịch bản 12: Đăng câu trả lời với Huy hiệu "City Verified" mạ vàng
```gherkin
Scenario: Verified Contributor Answers City Question
  Given Người dùng A đã sở hữu "Da Nang Explorer Badge" trong cơ sở dữ liệu
    And có một câu hỏi trong diễn đàn: "Nên đi Cầu Rồng xem phun lửa vào thứ mấy?"
  When Người dùng A đăng câu trả lời: "Cầu Rồng phun lửa vào 21:00 Thứ Bảy và Chủ Nhật hàng tuần bạn nhé"
  Then hệ thống tự động kiểm tra và xác nhận Người dùng A có Huy hiệu Đà Nẵng
    And câu trả lời được gán cờ isCityVerified = true
    And thẻ câu trả lời hiển thị viền vàng nổi bật kèm nhãn "✓ Da Nang Verified — Đã khám phá 3 địa danh & hoàn thành Quiz"
    And câu trả lời được ưu tiên đẩy lên vị trí đầu tiên trong danh sách câu trả lời
```

#### Kịch bản 13: Đăng câu trả lời bởi người dùng chưa có Huy hiệu
```gherkin
Scenario: Regular Contributor Answers Question
  Given Người dùng B chưa từng check-in hay có Huy hiệu nào tại Đà Nẵng
  When Người dùng B đăng câu trả lời trong mục hỏi đáp Đà Nẵng
  Then hệ thống gán cờ isCityVerified = false
    And thẻ câu trả lời hiển thị khung viền màu xám tiêu chuẩn
    And không có biểu tượng ngôi sao xác thực hay nhãn City Verified
```

---

### 🔴 MODULE 6: FAULT TOLERANCE & RESILIENCE

#### Kịch bản 14: Tự động chuyển sang Mock Provider khi API đối tác bị quá tải
```gherkin
Scenario: Graceful Fallback to Mock Data on External API Failure
  Given API đối tác Amadeus bị mất kết nối mạng hoặc hết hạn ngạch truy cập
  When người dùng thực hiện tìm kiếm chuyến bay từ "HAN" đến "DAD"
  Then hệ thống phát hiện lỗi timeout sau 5 giây
    And hệ thống tự động kích hoạt MockProvider trả về dữ liệu mẫu chất lượng cao
    And ứng dụng hiển thị danh sách chuyến bay bình thường mà không hề báo lỗi đỏ hay crash app
```

---

### 🟤 MODULE 7: COLLABORATIVE PLANNING & GROUP EXPENSES

#### Kịch bản 15: Mời bạn bè vào chuyến đi và đồng bộ hiển thị cùng thấy
```gherkin
Scenario: Invite Travel Companion and Synchronize Shared Itinerary
  Given Người dùng A đã tạo chuyến đi "Đà Nẵng 3N2Đ cùng Hội Bạn"
  When Người dùng A gửi lời mời tới bạn bè "travelmate@nomadix.com" với vai trò Editor
  Then hệ thống tạo bản ghi trong trip_members với trạng thái accepted
    And bạn "travelmate" nhận được thông báo mời vào chuyến đi
  When bạn "travelmate" mở ứng dụng Nomadix trên thiết bị của mình
  Then ứng dụng tải chính xác chuyến đi "Đà Nẵng 3N2Đ cùng Hội Bạn"
    And bạn nhìn thấy toàn bộ các Tab Ngày, danh sách điểm dừng và đường nối lộ trình trên Google Maps hoàn toàn giống với Người dùng A
    And khi một người cập nhật thêm điểm đến mới, thiết bị người kia tự động đồng bộ hiển thị
```

#### Kịch bản 16: Tải lên hóa đơn bữa ăn và chia tiền đều cho nhóm
```gherkin
Scenario: Upload Bill Receipt and Split Expense Equally
  Given chuyến đi "Đà Nẵng 3N2Đ" gồm 3 thành viên: Đức (Payer), Nam, và Hoa
  When Đức chụp ảnh hóa đơn bữa ăn hải sản Bé Mặn giá "1.200.000 VND"
    And Đức chọn phương thức chia đều cho cả 3 người
    And Đức bấm nút "Lưu khoản chi"
  Then hệ thống nén và tải ảnh hóa đơn lên Cloudinary an toàn
    And hệ thống lưu bản ghi khoản chi 1.200.000 VND vào bảng trip_expenses
    And tự động tạo 3 bản ghi chi tiết trong trip_expense_splits với số tiền 400.000 VND/người
    And Bảng số dư ròng hiển thị: Đức (+800.000 VND), Nam (-400.000 VND), Hoa (-400.000 VND)
    And tổng số dư cả nhóm luôn đảm bảo bằng 0 (800k - 400k - 400k = 0)
```

#### Kịch bản 17: Thuật toán tối ưu hóa công nợ và quyết toán (Settle Up)
```gherkin
Scenario: Greedy Debt Simplification and Settle Up
  Given chuyến đi có mạng lưới chi tiêu chéo: Nam nợ Đức 400.000 VND, Đức nợ Hoa 400.000 VND
  When các thành viên mở tab "Quyết toán Công nợ" (Debt Settlement)
  Then thuật toán tối ưu hóa công nợ tự động triệt tiêu giao dịch trung gian của Đức
    And đưa ra giải pháp chuyển tiền tối thiểu: "Nam chuyển trực tiếp 400.000 VND cho Hoa"
  When Nam chuyển khoản ngoài cho Hoa và Hoa bấm nút "Xác nhận đã nhận tiền"
  Then hệ thống chuyển trạng thái khoản nợ sang "settled"
    And cập nhật số dư của toàn bộ thành viên về 0 VND
    And lưu vết giao dịch quyết toán vào bảng trip_settlements
```
