# WEEK 02 — UX/UI DESIGN & INTERACTIVE PROTOTYPING

## Tháng 1: Analysis & System Design
**Milestone:** `W2 - UX/UI Design`  
**Thời gian:** Ngày 8 – Ngày 14 (31/08/2026 – 06/09/2026)  
**Nhánh chính:** `design/ui-wireframes` (tách từ `develop`)  
**Mục tiêu tuần:** Thiết kế hoàn chỉnh Design System và toàn bộ giao diện màn hình (High-Fidelity UI Wireframes) trên Figma kèm kịch bản luồng tương tác (User Flow) cho toàn bộ ứng dụng Nomadix.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 8: DESIGN SYSTEM & STYLE GUIDE (31/08/2026)
* **Mục tiêu:** Thiết lập bộ nhận diện thương hiệu, bảng màu, typography, và thư viện thành phần giao diện (UI Components) tái sử dụng.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng Bảng màu (Color Palette):
     * Primary Color: Ocean Travel Blue (`#1E88E5`).
     * Secondary / Accent: Sunrise Gold / Orange (`#FF9800` - dùng cho Gamification, XP, Badges).
     * Backgrounds: Light Mode (`#F8F9FA`) & Dark Neutral (`#121212`).
     * Semantic Colors: Success (`#4CAF50`), Error (`#F44336`), Warning (`#FFC107`), Info (`#2196F3`).
  2. Định nghĩa Typography (Font: Inter / Roboto, kích thước H1, H2, H3, Body, Caption).
  3. Xây dựng UI Components tái sử dụng (Buttons, Input Fields, Badges, Cards, Modals, Bottom Navigation Bar, Top App Bar).
  4. Lựa chọn bộ biểu tượng chuẩn (Lucide Icons / Feather Icons).
* **Sản phẩm đầu ra:**
  * File thiết kế Figma: *Nomadix Design System & Style Guide*.
  * Tài liệu `documentation/07-ux-ui/01-design-system-and-style-guide.md`.
* **Git Commit:** `design: establish nomadix design system and component library`
* **DoD:** Bộ Design System hoàn chỉnh trên Figma với đầy đủ variants và tokens.

---

### 🔹 DAY 9: UI SCREENS — AUTHENTICATION & HOME DASHBOARD (01/09/2026)
* **Mục tiêu:** Thiết kế toàn bộ giao diện đăng nhập, đăng ký, quên mật khẩu và màn hình trang chủ khám phá.
* **Nhiệm vụ cụ thể:**
  1. Màn hình **Splash Screen** & **Onboarding Carousel** (Giới thiệu 3 giá trị cốt lõi: Search, Plan, Earn Badges).
  2. Màn hình **Login Screen** (Email, Password, Remember Me, Social Login placeholder).
  3. Màn hình **Register Screen** (Name, Email, Password, Terms agreement).
  4. Màn hình **Forgot Password Screen** (OTP input / Reset Link).
  5. Màn hình **Home Dashboard** (Banner chào mừng, thanh tìm kiếm nhanh, danh mục thành phố nổi bật, lối tắt tạo chuyến đi nhanh, bảng tin cộng đồng).
* **Sản phẩm đầu ra:**
  * 5 màn hình High-Fidelity trên Figma.
  * Tài liệu `documentation/07-ux-ui/screens/01-auth-and-home.md`.
* **Git Commit:** `design: create auth and home dashboard high-fidelity screens`
* **DoD:** Màn hình thể hiện rõ ràng các trạng thái Default, Focused, Error, và Loading.

---

### 🔹 DAY 10: UI SCREENS — SMART BOOKING SEARCH (02/09/2026)
* **Mục tiêu:** Thiết kế giao diện tìm kiếm và so sánh chuyến bay, khách sạn với các bộ lọc đa tiêu chí.
* **Nhiệm vụ cụ thể:**
  1. Màn hình **Flight Search Screen** (Khứ hồi/Một chiều, Sân bay đi/đến, Ngày bay, Số hành khách, Hạng ghế).
  2. Màn hình **Flight Results Screen** (Danh sách thẻ chuyến bay: Hãng bay, Giờ cất/hạ cánh, Điểm dừng, Giá vé, Nút xem chi tiết / Đặt vé).
  3. Màn hình **Hotel Search Screen** (Điểm đến, Ngày Check-in/Check-out, Số khách, Số phòng).
  4. Màn hình **Hotel Results Screen** (Thẻ khách sạn: Ảnh bìa, Tên, Số sao, Điểm đánh giá, Khoảng cách tới trung tâm, Giá/đêm).
  5. Màn hình **Filter & Sort Modal** (Lọc theo mức giá slider, xếp hạng sao, hãng bay, thời gian cất cánh, sắp xếp rẻ nhất / nhanh nhất).
* **Sản phẩm đầu ra:**
  * 5 màn hình Figma module Booking.
  * Tài liệu `documentation/07-ux-ui/screens/02-booking-search.md`.
* **Git Commit:** `design: create flight and hotel search and comparison screens`
* **DoD:** Giao diện so sánh thông tin rõ ràng, không gây rối mắt, chuẩn mobile responsiveness.

---

### 🔹 DAY 11: UI SCREENS — ITINERARY PLANNER & MAPS (03/09/2026)
* **Mục tiêu:** Thiết kế giao diện quản lý chuyến đi, lập lịch trình nhiều ngày và bản đồ tương tác định tuyến.
* **Nhiệm vụ cụ thể:**
  1. Màn hình **My Trips Screen** (Danh sách chuyến đi: Đang lên kế hoạch, Sắp tới, Đã hoàn thành, Chuyến đi mẫu được cộng đồng chia sẻ).
  2. Màn hình **Create Trip Modal / Wizard** (Tên chuyến đi, Thành phố, Ngày bắt đầu/kết thúc, Ngân sách dự kiến).
  3. Màn hình **Day Planner Timeline** (Chia theo Tab: Ngày 1, Ngày 2, Ngày N; Thẻ hoạt động có tay nắm kéo-thả để đổi thứ tự).
  4. Màn hình **Interactive Map View** (Bản đồ Google Maps hiển thị các điểm đánh dấu có số thứ tự 1, 2, 3 kết nối bằng đường polyline định tuyến, hiển thị khoảng cách km và thời gian di chuyển dự kiến).
  5. Màn hình **Itinerary Share / Clone Modal** (Xem công khai, nút "Clone to My Trips").
* **Sản phẩm đầu ra:**
  * 5 màn hình Figma module Itinerary.
  * Tài liệu `documentation/07-ux-ui/screens/03-itinerary-planner.md`.
* **Git Commit:** `design: create itinerary drag-and-drop and map visualization screens`
* **DoD:** Thể hiện rõ trạng thái kéo-thả (Drag state) và chi tiết định tuyến trên bản đồ.

---

### 🔹 DAY 12: UI SCREENS — GAMIFICATION, GPS CHECK-IN & QUIZ (04/09/2026)
* **Mục tiêu:** Thiết kế giao diện trải nghiệm khám phá địa danh, xác thực GPS geofence, chụp ảnh check-in và làm bài trắc nghiệm văn hóa.
* **Nhiệm vụ cụ thể:**
  1. Màn hình **Landmark Discovery Screen** (Danh sách địa danh theo thành phố, thẻ địa danh có khoảng cách tính từ vị trí người dùng, tag trạng thái: "Đã Check-in" / "Chưa ghé thăm").
  2. Màn hình **Landmark Detail Screen** (Hình ảnh, lịch sử, tọa độ, nút "Check-in ngay" kích hoạt kiểm tra GPS).
  3. Màn hình **GPS Validation & Camera Overlay Screen** (Khung ngắm máy ảnh chụp trực tiếp với watermark địa điểm và tọa độ thời gian thực).
  4. Màn hình **Cultural Quiz Screen** (Thẻ câu hỏi trắc nghiệm 4 lựa chọn, thanh đếm ngược thời gian, tiến trình 1/3, 2/3, 3/3).
  5. Màn hình **Quiz Result & Badge Unlocked Modal** (Hiệu ứng pháo hoa, số XP nhận được, hình ảnh Huy hiệu thành phố xoay 3D mở khóa).
* **Sản phẩm đầu ra:**
  * 5 màn hình Figma module Gamification.
  * Tài liệu `documentation/07-ux-ui/screens/04-gamification-and-quiz.md`.
* **Git Commit:** `design: create landmark check-in, camera overlay, and quiz screens`
* **DoD:** Màn hình thể hiện trọn vẹn luồng cảm xúc người dùng từ lúc đứng trước địa danh đến lúc nhận huy hiệu.

---

### 🔹 DAY 13: UI SCREENS — COMMUNITY Q&A, PROFILE & ADMIN (05/09/2026)
* **Mục tiêu:** Thiết kế giao diện diễn đàn hỏi đáp du lịch có gắn huy hiệu xác thực, trang cá nhân và màn hình quản trị.
* **Nhiệm vụ cụ thể:**
  1. Màn hình **Community Feed Screen** (Bộ lọc theo Quốc gia/Thành phố/Chủ đề: Ẩm thực, Đi lại, Địa điểm ẩn).
  2. Màn hình **Question Detail & Answer Screen** (Câu hỏi, câu trả lời; câu trả lời của người có Badge thành phố sẽ có viền vàng nổi bật và nhãn **"Da Nang Verified"**).
  3. Màn hình **Create Question Screen** (Chọn thành phố, nhập tiêu đề, nội dung, gắn thẻ tag).
  4. Màn hình **User Profile & Achievement Screen** (Ảnh đại diện, Cấp độ Level, Thanh tiến trình XP, Bộ sưu tập Huy hiệu thành phố, Lịch sử du lịch).
  5. Màn hình **Admin Dashboard Screen** (Quản lý địa danh, ngân hàng câu hỏi quiz, duyệt nội dung báo cáo).
* **Sản phẩm đầu ra:**
  * 5 màn hình Figma module Community, Profile & Admin.
  * Tài liệu `documentation/07-ux-ui/screens/05-community-and-profile.md`.
* **Git Commit:** `design: create community qna with verified badge and profile screens`
* **DoD:** Thể hiện rõ điểm khác biệt của nhãn "City Verified" so với người dùng thông thường.

---

### 🔹 DAY 14: INTERACTIVE PROTOTYPE & DESIGN REVIEW (06/09/2026)
* **Mục tiêu:** Nối toàn bộ các màn hình thành một bản mẫu tương tác hoàn chỉnh (Clickable Figma Prototype) và đánh giá độ khả dụng (Usability Heuristics).
* **Nhiệm vụ cụ thể:**
  1. Thiết lập các liên kết Prototype trên Figma (Transitions, Modals, Bottom Sheet, Tabs).
  2. Chạy thử nghiệm kịch bản người dùng 19 bước trên Figma Prototype.
  3. Kiểm tra theo 10 nguyên tắc Nielsen Norman Usability Heuristics.
  4. Xuất toàn bộ Assets (Icons, SVG logos, Mock imagery) chuẩn bị cho quá trình code React Native.
  5. Viết báo cáo tổng kết tuần `W2-Review-Summary.md` và chuẩn bị báo cáo tiến độ cho Supervisor.
* **Sản phẩm đầu ra:**
  * Link Clickable Figma Prototype chính thức.
  * Tài liệu `documentation/07-ux-ui/02-prototype-and-usability-review.md`.
* **Git Commit:** `design: complete interactive figma prototype and close milestone W2`
* **DoD:** Prototype chạy mượt mà không bị gãy luồng; Milestone W2 đạt 100%.
