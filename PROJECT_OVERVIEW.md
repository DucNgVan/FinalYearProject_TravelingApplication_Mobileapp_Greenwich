# NOMADIX — BÁO CÁO TỔNG QUAN DỰ ÁN & LỘ TRÌNH PHÁT TRIỂN

> **Dự án tốt nghiệp (Final Year Project - FYP) — University of Greenwich**  
> **Chuyên ngành:** BSc (Hons) Computing  
> **Sinh viên thực hiện:** Nguyễn Văn Đức  
> **Thời gian thực hiện:** Tháng 08/2026 – Tháng 01/2027 (16–20 Tuần)  
> **Phương pháp phát triển:** Extreme Programming (XP) & Test-Driven Development (TDD)  
> **Trạng thái kiểm thử hiện tại:** **59 Test Suites — 255/255 Tests Passed (100% GREEN)**

---

## 📑 MỤC LỤC
1. [Giới Thiệu & Tầm Nhìn Dự Án](#1-giới-thiệu--tầm-nhìn-dự-án)
2. [Kiến Trúc Kỹ Thuật Đa Tầng & Polyglot Persistence](#2-kiến-trúc-kỹ-thuật-đa-tầng--polyglot-persistence)
3. [Báo Cáo Chi Tiết: NHỮNG GÌ ĐÃ HOÀN THÀNH (WHAT IS DONE)](#3-báo-cáo-chi-tiết-những-gì-đã-hoàn-thành-what-is-done)
   - [3.1 Hồ sơ Phân tích & Đặc tả Hệ thống (Phases 1–6)](#31-hồ-sơ-phân-tích--đặc-tả-hệ-thống-phases-16)
   - [3.2 Hạ tầng & Backend Core (Modules 1–4)](#32-hạ-tầng--backend-core-modules-14)
   - [3.3 Ứng dụng Di động React Native (Phases 1–10)](#33-ứng-dụng-di-động-react-native-phases-110)
   - [3.4 Panoramic Showcase Dashboard (Phase 11)](#34-panoramic-showcase-dashboard-phase-11)
   - [3.5 Chỉ số Chất lượng TDD & Độ bao phủ Code](#35-chỉ-số-chất-lượng-tdd--độ-bao-phủ-code)
4. [Báo Cáo Chi Tiết: NHỮNG GÌ CẦN LÀM TIẾP THEO (WHAT NEEDS TO BE DONE)](#4-báo-cáo-chi-tiết-những-gì-cần-làm-tiếp-theo-what-needs-to-be-done)
   - [4.1 Hành động tức thì (Git Commit & Sync)](#41-hành-động-tức-thì-git-commit--sync)
   - [4.2 Module 5: Cultural Gamification & Location Engine (USP)](#42-module-5-cultural-gamification--location-engine-usp)
   - [4.3 Module 6 & 7: Community Forum & "City Verified" Trust Indicator](#43-module-6--7-community-forum--city-verified-trust-indicator)
   - [4.4 Kiểm thử Toàn diện E2E & Benchmark Hiệu năng](#44-kiểm-thử-toàn-diện-e2e--benchmark-hiệu-năng)
   - [4.5 Luận văn Tốt nghiệp & Chuẩn bị Bảo vệ](#45-luận-văn-tốt-nghiệp--chuẩn-bị-bảo-vệ)
5. [Lộ Trình Tuần & Bảng Phân Công Thực Hiện](#5-lộ-trình-tuần--bảng-phân-công-thực-hiện)
6. [Hướng Dẫn Khởi Chạy & Trải Nghiệm Demo](#6-hướng-dẫn-khởi-chạy--trải-nghiệm-demo)

---

## 1. Giới Thiệu & Tầm Nhìn Dự Án

### 1.1 Vấn Đề Thực Tế (Problem Statement)
Người du lịch độc lập (solo travelers) và các nhóm bạn trẻ đi du lịch cùng nhau (squad travel) đang phải đối mặt với các vấn đề nhức nhối:
1. **Travel App Sprawl (Phân mảnh ứng dụng):** Phải luân chuyển giữa 5+ ứng dụng khác nhau trong một chuyến đi (Skyscanner xem vé bay, Agoda tìm phòng, Google Maps lưu ghim, Zalo/Messenger nhắn tin lịch trình, Splitwise/Excel chia tiền nợ, và TripAdvisor đọc review).
2. **Lịch trình nhóm lệch pha (Collaborative Friction):** Lịch trình gửi qua ảnh hoặc tin nhắn trôi đi, một người đổi giờ bay/điểm đến thì cả nhóm dùng thông tin cũ.
3. **Mâu thuẫn tài chính nhóm (Group Expense Conflicts):** Chia tiền ăn uống, di chuyển, khách sạn bằng Excel thủ công dễ nhầm lẫn, mất hóa đơn, phát sinh các khoản nợ chéo vòng quanh gây ngại ngùng.
4. **Đánh giá ảo tràn lan (Fake Reviews Epidemic):** Các đánh giá trên mạng xã hội thiếu cơ chế xác minh người viết có thực sự đến địa điểm đó hay không.

### 1.2 Giải Pháp Nomadix
Nomadix hợp nhất toàn bộ hành trình du lịch vào **một ứng dụng di động duy nhất**:
$$\text{Tìm vé \& Khách sạn} \longrightarrow \text{Lập lịch trình nhóm} \longrightarrow \text{Chia tiền \& Tối ưu nợ} \longrightarrow \text{Khám phá văn hóa GPS} \longrightarrow \text{Đánh giá uy tín}$$

---

## 2. Kiến Trúc Kỹ Thuật Đa Tầng & Polyglot Persistence

Dự án được xây dựng theo mô hình **5-Tier Modular Monolith** hiện đại:

```text
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 1: CLIENT PRESENTATION (REACT NATIVE)               │
│ Screens, Atomic Components, Zustand Stores, Dual Theme, Dynamic Island │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / JWT Auth Header
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            TIER 2: API GATEWAY & SECURITY MIDDLEWARE (EXPRESS)         │
│ CORS, Helmet, Rate Limiter (Redis), Joi Input Validation, JWT Auth     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Validated DTOs
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 3: CORE DOMAIN & APPLICATION SERVICE LAYER            │
│ AuthService, ItineraryService, BookingService, GroupExpenseService,    │
│ GreedyDebtSimplificationEngine, GamificationService                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ External Calls / Storage Access
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 4: ADAPTER & EXTERNAL INTEGRATION LAYER             │
│ Duffel NDC Flights API, Google Places New API, Cloudinary CDN          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Optimized Queries
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              TIER 5: POLYGLOT PERSISTENCE LAYER (3 ENGINES)            │
│   PostgreSQL 16 (ACID)   │  MongoDB Atlas 7 (Documents)  │  Redis 7    │
└──────────────────────────┴───────────────────────────────┴─────────────┘
```

### Ma Trận Trách Nhiệm Polyglot Persistence

| Hệ Quản Trị CSDL | Nhiệm Vụ Nghiệp Vụ Cốt Lõi | Lý Do Thiết Kế Học Thuật |
|---|---|---|
| **PostgreSQL 16** (Relational) | • Tài khoản người dùng, Roles, JWT Refresh Tokens<br>• Di tích văn hóa & Huy hiệu cá nhân<br>• **Sổ cái chi tiêu nhóm & Chia nợ (`trip_expenses`, `trip_settlements`)** | Đảm bảo tính toán tài chính chính xác tuyệt đối với kiểu dữ liệu `NUMERIC(12, 2)`, giao dịch ACID chặt chẽ (`BEGIN...COMMIT`), tránh lỗi làm tròn số thực (`FLOAT`). |
| **MongoDB Atlas 7.0** (Document) | • Lịch trình du lịch nhiều ngày (`itineraries`)<br>• Danh sách cộng tác viên nhóm (`collaborators[]`)<br>• Diễn đàn hỏi đáp cộng đồng (`forum_questions`, `answers`) | Cấu trúc dữ liệu đa hình linh hoạt, tài liệu nhúng nhiều cấp (`days[]` $\rightarrow$ `items[]`), tốc độ đọc lịch trình siêu nhanh (< 15ms), chỉ mục không gian GeoJSON 2dsphere. |
| **Redis 7.0** (In-Memory) | • Bộ nhớ đệm tìm kiếm chuyến bay (TTL 1800s)<br>• Bộ nhớ đệm tìm kiếm khách sạn (TTL 3600s)<br>• Giới hạn tần suất gọi API (Rate Limiting) | Tốc độ RAM sub-50ms, tự động giải phóng bộ nhớ theo TTL, giảm thiểu số lần gọi API bên thứ ba (tiết kiệm chi phí và hạn chế chạm quota). |

---

## 3. Báo Cáo Chi Tiết: NHỮNG GÌ ĐÃ HOÀN THÀNH (WHAT IS DONE)

### 3.1 Hồ sơ Phân tích & Đặc tả Hệ thống (Phases 1–6)
* [x] **Phase 1 (Foundation):** 7 core modules, 4 chân dung người dùng (personas), 7 trụ cột giá trị, kịch bản thử nghiệm MVP 22 bước (thư mục `documentation/01-project-foundation/`).
* [x] **Phase 2 (Requirements):** 42 yêu cầu chức năng (`FR-01` đến `FR-42`), 8 yêu cầu phi chức năng (NFRs), 35 User Stories kèm Acceptance Criteria chuẩn BDD Gherkin (`documentation/02-requirements/`).
* [x] **Phase 3 (Use Cases):** 5 tác nhân (Actors), 22 ca sử dụng (Use Cases), 10 sơ đồ & đặc tả tuần tự UML 2.5 (`documentation/03-use-cases/`).
* [x] **Phase 4 (Architecture):** Thiết kế 5-Tier Architecture, 6 sequence diagrams (Đồng bộ nhóm, Upload hóa đơn, Giải nợ) (`documentation/04-architecture/`).
* [x] **Phase 5 (Tech Research):** Đánh giá công nghệ, giải thuật Greedy Minimum Cash-Flow $O(N \log N)$, tích hợp Cloudinary, Duffel và Google Places (`documentation/05-tech-research/`).
* [x] **Phase 6 (Database Analysis):** Master Polyglot Schema gồm 28 bảng PostgreSQL chuẩn 3NF, 4 MongoDB collections, từ điển dữ liệu (Data Dictionary), và script DDL khởi tạo (`documentation/06-database-analysis/`).

---

### 3.2 Hạ tầng & Backend Core (Modules 1–4)
* [x] **Hạ tầng Docker Polyglot:** File `docker-compose.yml` cấu hình sẵn PostgreSQL 16, MongoDB 7.0, Redis 7.0 và nạp tự động `docker/init-db/01-init.sql`.
* [x] **Kiến trúc Dual-Mode Repository:** Cho phép toàn bộ test suite chạy offline độc lập với tốc độ sub-second hoặc kết nối cơ sở dữ liệu thật khi triển khai.
* [x] **Module 1 — User Identity, RBAC & Authentication:**
  * Băm mật khẩu bằng Bcrypt 12 salt rounds (`server/src/utils/password.util.js`).
  * Cơ chế cấp phát Access Token (JWT 15m) và Refresh Token SHA-256 (7 ngày) với Refresh Token Rotation (`server/src/services/token.service.js`).
  * Middleware xác thực Bearer token và kiểm tra quyền RBAC.
  * Kiểm tra hợp lệ DTO bằng Joi với mã lỗi 400 và chuẩn hóa envelope response `{ success, data/error }`.
* [x] **Module 2 — Smart Booking Aggregator (Flights & Hotels):**
  * Tích hợp trực tiếp **Duffel Flights API Sandbox** (`server/src/providers/duffel.provider.js`) truy vấn 87+ chuyến bay thật.
  * Tích hợp **Google Places New API (SearchText v1)** (`server/src/providers/google.provider.js`) tìm kiếm khách sạn và điểm dừng.
  * Bộ dữ liệu Mock nội địa Việt Nam đầy đủ thông tin (Vietnam Airlines, Vietjet Air, Bamboo Airways, Novotel, Vinpearl...).
  * Dịch vụ chuẩn hóa dữ liệu thống nhất `UnifiedFlight` và `UnifiedHotel` (`server/src/services/normalizer.service.js`).
  * Cơ chế Cache-Aside trên Redis (`server/src/services/cache.service.js`) kèm bộ lọc đa tiêu chí (giá, số chặng dừng, giờ bay).
* [x] **Module 3 — Collaborative Itinerary Planner & Maps:**
  * Giải thuật Haversine tính khoảng cách tọa độ GPS trên mặt cầu elip WGS84 và ước tính thời gian di chuyển (`server/src/utils/geo.util.js`).
  * Mongoose Schema với cấu trúc nhúng nhiều ngày `days[]`, điểm dừng `items[]` và thành viên nhóm `collaborators[]` (`OWNER`, `EDITOR`, `VIEWER`).
  * Cơ chế sắp xếp lại thứ tự điểm dừng nguyên tử (Atomic Drag-and-Drop Reordering) tự động tính lại chặng đường tiếp theo.
* [x] **Module 4 — Group Expense Tracking & Bill Splitting Hub:**
  * **Thuật toán Greedy Minimum Cash-Flow Reduction** (`server/src/utils/debt.util.js`): Giảm thiểu số lượng giao dịch chuyển khoản giữa $N$ thành viên từ $O(N^2)$ xuống tối đa $N - 1$ giao dịch, đảm bảo định lý bảo toàn số dư $\sum \text{NetBalance}_i = 0$.
  * 4 phương thức chia chi phí: Chia đều (`equal`), số tiền cụ thể (`exact`), phần trăm (`percentage`), số phần (`shares`) bảo toàn số tiền lẻ không bị thất thoát.
  * Tích hợp lưu trữ hóa đơn Cloudinary và chu trình xác nhận trả nợ (`trip_settlements`).

---

### 3.3 Ứng dụng Di động React Native (Phases 1–10)
* [x] **Cấu trúc Nền tảng Client:** React Native 0.74, Zustand State Stores, Axios HTTP Client với Interceptor tự động tiêm Bearer token và chuẩn hóa phản hồi lỗi.
* [x] **Phân giải URL Động (`resolveApiBaseUrl`):** Tự động nhận diện IP máy chủ thông qua Metro `scriptURL`, biến môi trường `EXPO_PUBLIC_API_URL`, và IP mạng nội bộ LAN (`http://192.168.1.26:5001/api/v1`).
* [x] **Hệ thống Giao diện Kép (Dual Theme System):**
  * Hỗ trợ **Light Mode** (`#F0F6FF` xanh nhạt thanh lịch) và **Dark Mode** (`#0D1B2A` xanh navy đậm).
  * Chuyển đổi tức thì từ nút bấm trên thanh Header, tự động đồng bộ tất cả màn hình, ô nhập liệu (`Input.js`), thẻ vé (`FlightCard.js`), thẻ khách sạn (`HotelCard.js`) và các hộp thoại modal.
* [x] **4 Màn hình Chức năng Chính (App.js):**
  1. **Màn hình Vé máy bay (`FlightSearchScreen.js`):**
     * Tìm kiếm khứ hồi hoặc một chiều, tích hợp bộ giải mã mã sân bay IATA Việt Nam (`airport.util.js`: gõ "Hà Nội" tự nhận "HAN", "Sài Gòn" tự nhận "SGN").
     * Bộ chọn ngày phong cách Apple iOS (`CalendarPickerModal.js`).
     * Bộ lọc quốc tế: Lọc bay thẳng, nối chuyến, có hành lý ký gửi, sắp xếp theo giá rẻ, bay sớm, bay muộn.
     * Thẻ chuyến bay hiển thị logo hãng hàng không chính thức, loại máy bay, khí thải CO2, vạch lộ trình vẽ $N$ chấm dừng động theo số chặng, và nhãn phân biệt chuyển hành lý tự động vs hành khách tự chuyển.
     * Hộp thoại xem chi tiết vé (`FlightDetailModal.js`), đặt vé thử nghiệm (`SandboxBookingModal.js`), và xem thẻ lên máy bay (`BoardingPassModal.js`).
  2. **Màn hình Khách sạn (`HotelSearchScreen.js`):**
     * Tìm kiếm khách sạn theo thành phố, lọc theo khoảng giá và số sao, thanh tìm kiếm thu gọn thông minh.
  3. **Màn hình Kế hoạch & Chi tiêu Nhóm (`PlanScreen.js`):**
     * Trạng thái khởi tạo rõ ràng ("Chưa có kế hoạch nào" $\rightarrow$ bấm nút "+ Tạo kế hoạch mới").
     * Lịch trình du lịch nhiều ngày, thêm điểm dừng, ước tính khoảng cách di chuyển.
     * Mời thành viên cùng tham gia (`Squad Members`).
     * **Hub chi tiêu nhóm (Group Expenses):** Ghi nhận khoản chi, chọn người trả và người hưởng, chia tiền theo nhiều mô hình, xem bảng cân đối tài chính cá nhân, và xem danh sách giải nợ tối ưu theo thuật toán Greedy.
  4. **Màn hình Tài khoản & Vé đã đặt (`ProfileScreen.js`):**
     * Hồ sơ cá nhân, cấp độ kinh nghiệm (Level 5 XP Badge), trạng thái KYC, tài khoản ngân hàng nhận tiền nợ.
     * Quản lý danh sách vé máy bay đã đặt và mở xem Boarding Pass với mã QR/Barcode.

---

### 3.4 Panoramic Showcase Dashboard (Phase 11)
* [x] **Giao diện Trình diễn 3 Cột Toàn Cảnh (`client/preview/index.html`):**
  * Tối ưu hóa hoàn toàn cho màn hình máy tính để trình chiếu trước giảng viên và hội đồng chấm thi mà không có khoảng trống thừa xung quanh.
  * **Cột trái (Kiến trúc & Hệ thống):** Sơ đồ 5-Tier Modular Monolith, Ma trận Polyglot Persistence, Chỉ số kiểm thử TDD, Giao thức bảo mật Dual Token.
  * **Cột giữa (Mô phỏng Điện thoại iPhone 16 Pro):** Dynamic Island, thanh trạng thái, chạy toàn bộ giao diện React Native với đầy đủ chuyến bay thật, chuyển đổi linh hoạt giữa 3 chặng bay (`SGN ⇄ HAN`, `HAN ⇄ DAD`, `SGN ⇄ DAD`), hỗ trợ chuyển đổi Dark/Light mode đồng bộ cả màn hình web lẫn điện thoại.
  * **Cột phải (Dữ liệu Live API & Thuật toán):** Giới thiệu kết nối API Duffel, Google Places, Cloudinary và bảng so sánh trực quan thuật toán Greedy giảm từ 6 giao dịch nợ chéo xuống còn đúng 2 giao dịch trực tiếp.

---

### 3.5 Chỉ số Chất lượng TDD & Độ bao phủ Code

| Hạng mục kiểm thử | Số Suite | Số Test Case | Trạng thái | Độ bao phủ (Coverage) |
|---|:---:|:---:|:---:|:---:|
| **Backend Unit & Integration Tests** | 27 Suites | 103 Tests | ✅ 100% PASS | 93.8% Statements, 80.5% Branches |
| **Frontend Component & Unit Tests** | 32 Suites | 152 Tests | ✅ 100% PASS | 95.1% Statements, 81.8% Branches |
| **Tổng cộng toàn hệ thống** | **59 Suites** | **255 Tests** | ✅ **100% GREEN** | **Vượt xa ngưỡng yêu cầu ($\ge 80\%$)** |

---

## 4. Báo Cáo Chi Tiết: NHỮNG GÌ CẦN LÀM TIẾP THEO (WHAT NEEDS TO BE DONE)

Dựa theo kế hoạch 16–20 tuần của Đồ án tốt nghiệp Greenwich, dưới đây là các bước tiếp theo cần thực hiện:

### 4.1 Hành động tức thì (Git Commit & Sync)
Hiện tại trong máy cục bộ đang có các file mới và sửa đổi liên quan đến Theme, Bộ lọc chuyến bay, và Dashboard Showcase.
* **Nhiệm vụ:**
  1. Kiểm tra lại toàn bộ file chưa commit trên Git (`git status`).
  2. Tạo commit theo quy chuẩn:
     ```bash
     git add .
     git commit -m "feat(client): implement dual theme, duffel rich metadata, international filters, and panoramic showcase preview"
     git push origin develop  # hoặc main
     ```

---

### 4.2 Module 5: Cultural Gamification & Location Engine (USP Cốt Lõi)
Đây là tính năng tạo điểm nhấn học thuật khác biệt lớn nhất (Unique Selling Proposition) để đồ án đạt điểm cao (Distinction):
1. **Catalog Di tích & Danh thắng Văn hóa (Landmarks Catalog):**
   * Quản lý danh sách các địa điểm văn hóa tại Việt Nam (Văn Miếu, Hoàng Thành Thăng Long, Cầu Rồng, Phố Cổ Hội An, Dinh Độc Lập...) lưu trữ trong PostgreSQL kèm tọa độ WGS84 chính xác.
2. **Cơ chế Xác thực Vị trí GPS Geofencing ($\le 100\text{m}$):**
   * Thuật toán kiểm tra khoảng cách thực tế giữa vị trí GPS của điện thoại người dùng và tọa độ di tích.
   * Chỉ cho phép mở khóa nút "Check-in" khi người dùng ở trong bán kính $\le 100\text{m}$.
3. **Chụp ảnh Native Camera có Watermark xác thực (Proof-of-Visit):**
   * Chụp ảnh tại chỗ, tự động dập watermark tọa độ GPS, thời gian và huy hiệu địa điểm trước khi lưu lên Cloudinary.
4. **Cultural Quiz Engine & Hệ thống Tích lũy XP / Mở khóa Huy hiệu:**
   * Ngân hàng câu hỏi trắc nghiệm 4 đáp án về lịch sử, văn hóa tại mỗi di tích.
   * Cơ chế cộng điểm: Check-in (+150 XP), Trả lời đúng Quiz (+50 XP).
   * Mở khóa huy hiệu thành phố (ví dụ: "Da Nang Explorer" khi check-in đủ $\ge 3$ di tích và đạt $\ge 66\%$ câu hỏi trắc nghiệm).

---

### 4.3 Module 6 & 7: Community Forum & "City Verified" Trust Indicator
1. **Diễn đàn Hỏi - Đáp Du lịch (Community Q&A Forum):**
   * Xây dựng API và giao diện diễn đàn trên MongoDB (`forum_questions`, `forum_answers`).
   * Phân loại câu hỏi theo điểm đến (thành phố, chủ đề ẩm thực, lưu trú, di chuyển).
2. **Cơ chế Gắn Huy hiệu Bảo chứng Vàng "City Verified":**
   * Liên kết logic giữa bảng `user_badges` trong PostgreSQL và câu trả lời trong MongoDB.
   * Khi một người dùng đã sở hữu huy hiệu "Da Nang Explorer" trả lời câu hỏi về Đà Nẵng, hệ thống tự động gắn huy hiệu vàng **"City Verified"** và ưu tiên đẩy câu trả lời lên đầu danh sách để đảm bảo độ tin cậy tuyệt đối.
3. **Hàng đợi Báo cáo Vi phạm (Anti-Abuse Reporting Queue):**
   * Báo cáo nội dung rác, thông tin sai lệch để người quản trị kiểm duyệt.

---

### 4.4 Kiểm thử Toàn diện E2E & Benchmark Hiệu năng
1. **Kiểm thử Tự động E2E với Detox:**
   * Viết kịch bản tự động hóa luồng người dùng hoàn chỉnh: Đăng ký tài khoản $\rightarrow$ Tìm chuyến bay $\rightarrow$ Tạo lịch trình $\rightarrow$ Mời bạn bè $\rightarrow$ Nhập chi phí $\rightarrow$ Giải nợ $\rightarrow$ Đăng xuất.
2. **Đo lường Hiệu năng Bộ nhớ đệm Redis (Evaluation Metrics):**
   * Thu thập dữ liệu thực tế: Thời gian phản hồi API khi có Redis Cache (< 50ms) so với khi truy vấn trực tiếp nhà cung cấp (> 800ms) để đưa biểu đồ so sánh vào Chương 5 của Luận văn.

---

### 4.5 Luận văn Tốt nghiệp & Chuẩn bị Bảo vệ (Academic Deliverables)
1. **Soạn thảo Luận văn FYP (6 Chương theo chuẩn Greenwich):**
   * **Chapter 1 — Introduction:** Bối cảnh, vấn đề phân mảnh du lịch, mục tiêu và phạm vi đồ án.
   * **Chapter 2 — Literature Review & Technical Evaluation:** So sánh các giải pháp hiện nay (Splitwise, TripAdvisor, Google Trips), đánh giá kiến trúc Polyglot vs Single Database, phân tích toán học thuật toán Greedy Minimum Cash-Flow.
   * **Chapter 3 — Requirements Engineering & System Design:** Đặc tả 42 FRs, 8 NFRs, ca sử dụng UML, thiết kế CSDL 28 bảng chuẩn 3NF, API Endpoints.
   * **Chapter 4 — Implementation:** Trình bày quy trình Extreme Programming, kỷ luật TDD Red-Green-Refactor, kiến trúc thư mục nguồn, giải pháp xử lý IP mạng LAN động.
   * **Chapter 5 — Testing & Evaluation:** Báo cáo kết quả 255 bài kiểm tra TDD đạt 100%, độ bao phủ code $>80-95\%$, kết quả đo lường độ trễ Redis Cache, kết quả thử nghiệm người dùng (Usability Testing).
   * **Chapter 6 — Conclusion, Limitations & Future Work:** Kết luận, hạn chế kỹ thuật và hướng mở rộng tương lai (thanh toán tự động VietQR, AI gợi ý lịch trình).
2. **Video Demo & Bài Thuyết Trình:**
   * Quay video demo kịch bản 22 bước chứng minh toàn bộ tính năng hoạt động trơn tru.
   * Chuẩn bị Slide thuyết trình bảo vệ đồ án kết hợp trình chiếu trực tiếp Showcase Dashboard.

---

## 5. Lộ Trình Tuần & Bảng Phân Công Thực Hiện

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              NOMADIX FYP TIMELINE TRACKER                              │
├─────────┬──────────────────────────┬──────────────────────┬────────────────────────────┤
│ Giai đoạn│ Nội dung                 │ Thời gian            │ Trạng thái                 │
├─────────┼──────────────────────────┼──────────────────────┼────────────────────────────┤
│ Month 1 │ Phân tích & Thiết kế HT  │ Tuần 01 – Tuần 04    │ ✅ HOÀN THÀNH (100%)       │
│ Month 2 │ Nền tảng Backend & Auth  │ Tuần 05 – Tuần 08    │ ✅ HOÀN THÀNH (100%)       │
│ Month 3 │ Booking & Lịch trình     │ Tuần 09 – Tuần 12    │ ✅ HOÀN THÀNH (100%)       │
│         │ + Chi tiêu nhóm & Split  │ (Đẩy sớm tiến độ)    │ ✅ HOÀN THÀNH (100%)       │
│ Month 4 │ Gamification (GPS, Quiz) │ Tuần 13 – Tuần 16    │ ⏸️ TIẾP THEO (CHUẨN BỊ LÀM)│
│         │ & Community Q&A Verified │                      │                            │
│ Month 5 │ Kiểm thử E2E & Luận văn  │ Tuần 17 – Tuần 20    │ ⏳ KẾ HOẠCH BẢO VỆ         │
└─────────┴──────────────────────────┴──────────────────────┴────────────────────────────┘
```

---

## 6. Hướng Dẫn Khởi Chạy & Trải Nghiệm Demo

### 6.1 Mở Showcase Dashboard Toàn Cảnh (Khuyên dùng khi báo cáo/xem nhanh)
Chỉ cần mở file sau trực tiếp trên bất kỳ trình duyệt nào (Chrome, Safari, Edge):
```bash
open client/preview/index.html
```
* **Các tính năng có sẵn trên Dashboard:**
  * Chọn tuyến bay: `SGN ⇄ HAN` (76 vé), `HAN ⇄ DAD` (6 vé), `SGN ⇄ DAD` (5 vé).
  * Chuyển đổi Dark Mode 🌙 / Light Mode ☀️ đồng bộ toàn màn hình.
  * Xem thẻ vé máy bay với vạch chặng dừng động, nhãn chuyển hành lý tự động.
  * Thử nghiệm bộ lọc quốc tế, modal đặt vé thử nghiệm, và xem Boarding Pass có mã QR.
  * Xem sơ đồ so sánh thuật toán giải nợ Greedy giảm từ 6 giao dịch nợ chéo xuống 2 giao dịch.

### 6.2 Chạy Toàn Bộ Kiểm Thử TDD (Kiểm tra sức khỏe mã nguồn)
* **Kiểm tra Backend (27 suites, 103 tests):**
  ```bash
  npm --prefix server test
  ```
* **Kiểm tra Frontend (32 suites, 152 tests):**
  ```bash
  npm --prefix client test
  ```

### 6.3 Chạy Ứng Dụng Đầy Đủ trong Môi Trường Dev
1. **Khởi động 3 Cơ sở dữ liệu bằng Docker:**
   ```bash
   docker compose up -d
   ```
2. **Khởi động Backend Server:**
   ```bash
   cd server && npm run dev
   ```
   *(Server lắng nghe tại `http://localhost:5001` hoặc IP mạng LAN)*
3. **Khởi động Mobile Client với Expo:**
   ```bash
   cd client && npx expo start
   ```
   *(Quét mã QR bằng ứng dụng Expo Go trên điện thoại thật hoặc mở trình giả lập iOS/Android)*

---
*Tài liệu được khởi tạo và đồng bộ tự động theo tiêu chuẩn Extreme Programming của đồ án Nomadix.*
