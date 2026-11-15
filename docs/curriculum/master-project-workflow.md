# Cẩm nang Toàn diện Workflow Hệ thống & Quy trình Kỹ thuật Nomadix
## Master End-to-End Project Workflow Blueprint

> *"Architecture is the decisions that you wish you could get right the first time. But a Workflow is the living heartbeat of your system — showing how data, code, state, and human interactions seamlessly travel across tiers to create value."*

---

## Mục lục
1. [Tổng quan Luồng Hệ thống (High-Level System Signal-Flow)](#1-tổng-quan-luồng-hệ-thống-high-level-system-signal-flow)
2. [Workflow 1: Vòng đời Kỹ thuật Phần mềm (Engineering & Development Workflow)](#2-workflow-1-vòng-đời-kỹ-thuật-phần-mềm-engineering--development-workflow)
3. [Workflow 2: Định danh & Phiên làm việc (Identity, Authentication & Session Lifecycle)](#3-workflow-2-định-danh--phiên-làm-việc-identity-authentication--session-lifecycle)
4. [Workflow 3: Đặt vé Thông minh & Cache-Aside (Smart Booking & Cache-Aside Pipeline)](#4-workflow-3-đặt-vé-thông-minh--cache-aside-smart-booking--cache-aside-pipeline)
5. [Workflow 4: Lập kế hoạch Du lịch Đa thành phố & Bản đồ (Multi-City Planning & Map Route Discovery)](#5-workflow-4-lập-kế-hoạch-du-lịch-đa-thành-phố--bản-đồ-multi-city-planning--map-route-discovery)
6. [Workflow 5: Đồng hành & Đồng bộ Nhóm Thời gian Thực (Squad Collaboration & Real-Time Sync)](#6-workflow-5-đồng-hành--đồng-bộ-nhóm-thời-gian-thực-squad-collaboration--real-time-sync)
7. [Workflow 6: Phân bổ Chi phí & Giải quyết Công nợ Nhóm (Group Expense Splitting & Debt Settlement Pipeline)](#7-workflow-6-phân-bổ-chi-phí--giải-quyết-công-nợ-nhóm-group-expense-splitting--debt-settlement-pipeline)
8. [Workflow 7: Điều phối Nhất quán Đa Cơ sở Dữ liệu (Polyglot Cross-Database Consistency)](#8-workflow-7-điều-phối-nhất-quán-đa-cơ-sở-dữ-liệu-polyglot-cross-database-consistency)

---

## 1. Tổng quan Luồng Hệ thống (High-Level System Signal-Flow)

Hệ thống **Nomadix** là một nền tảng du lịch kết hợp lập kế hoạch đồng đội, tích hợp sâu giữa ứng dụng di động React Native, API Gateway Express, các nhà cung cấp dịch vụ bên ngoài (Duffel, OpenTripMap, Cloudinary) và kiến trúc lưu trữ đa mô hình (**Polyglot Persistence: PostgreSQL + MongoDB + Redis**).

Dưới đây là sơ đồ luồng tín hiệu tổng thể thể hiện cách các thành phần tương tác:

```mermaid
flowchart TD
    subgraph TIER1["Tier 1: Mobile Client (React Native / Expo)"]
        UI_HOME["HomeScreen & Discovery"]
        UI_BOOK["Booking Flow (Flight & Hotel)"]
        UI_PLAN["Accordion Plan Wizard & Map"]
        UI_EXP["Group Expense Ledger"]
        STORES["6 Zustand Global Stores (Auth, Booking, Itinerary, Expense, Theme, Places)"]
    end

    subgraph TIER2["Tier 2: API Gateway & Security (Express)"]
        MW_RATE["Redis Rate Limiter (100 req/15min)"]
        MW_SEC["Helmet, CORS & Joi DTO Validators"]
        MW_AUTH["JWT Bearer Verification Middleware"]
    end

    subgraph TIER3["Tier 3: Core Domain Services"]
        SVC_AUTH["AuthService (Bcrypt & TokenService)"]
        SVC_BOOK["BookingService & NormalizerService"]
        SVC_PLAN["ItineraryService (Haversine & Timeline)"]
        SVC_EXP["ExpenseService & DebtSimplificationEngine"]
    end

    subgraph TIER4["Tier 4: External Providers & Adapters"]
        ADP_DUF["Duffel API (Flights NDC & Stays)"]
        ADP_OTM["OpenTripMap API (GeoJSON & Wikipedia)"]
        ADP_CLD["Cloudinary (Bill WebP Upload)"]
    end

    subgraph TIER5["Tier 5: Polyglot Persistence Layer"]
        DB_PG[("PostgreSQL 16 (ACID)\nUsers, Bookings, Ledgers\nNUMERIC(12, 2)")]
        DB_MG[("MongoDB Atlas 7\nPolymorphic Itineraries\nSub-15ms 1:Few Embeds")]
        DB_RD[("Redis 7.0 RAM\nCache-Aside & OTP TTL\nTokens & Rate Counters")]
    end

    STORES <--> UI_HOME & UI_BOOK & UI_PLAN & UI_EXP
    STORES == "HTTPS REST API (Axios Gateway)" ==> MW_RATE
    MW_RATE --> MW_SEC --> MW_AUTH
    MW_AUTH --> SVC_AUTH & SVC_BOOK & SVC_PLAN & SVC_EXP

    SVC_BOOK <--> ADP_DUF
    SVC_PLAN <--> ADP_OTM
    SVC_EXP <--> ADP_CLD

    SVC_AUTH <--> DB_PG & DB_RD
    SVC_BOOK <--> DB_RD & DB_PG
    SVC_PLAN <--> DB_MG
    SVC_EXP <--> DB_PG
```

---

## 2. Workflow 1: Vòng đời Kỹ thuật Phần mềm (Engineering & Development Workflow)

Để bảo đảm một hệ sinh thái lớn (222 test suites, hơn 846 tests) không bao giờ bị gãy hay sinh lỗi hồi quy (regression bugs), kỹ sư Nomadix tuân thủ nghiêm ngặt quy trình **Solo Extreme Programming (XP) & Test-Driven Development (TDD)**:

```mermaid
flowchart LR
    A["1. User Story & Gherkin Spec"] --> B["2. Write Failing Test (RED)"]
    B --> C["3. Verify Test Fails"]
    C --> D["4. Minimal Code (GREEN)"]
    D --> E["5. Verify Test Passes (100%)"]
    E --> F["6. Refactor & Optimize"]
    F --> G["7. Sync Memory Bank"]
    G --> H["8. Sanitized Git Push"]
```

### Các bước trong chu trình:
1. **Phân tích BDD / Gherkin:** Xác định hành vi nghiệp vụ kỳ vọng trước khi gõ code.
2. **Pha RED:** Viết test suite mô tả hành vi mong muốn (Unit test hoặc Component test). Chạy test và chứng minh test **thất bại** vì tính năng chưa tồn tại.
3. **Pha GREEN:** Viết số lượng code tối thiểu để bài test chuyển sang màu xanh.
4. **Pha REFACTOR:** Làm sạch code, loại bỏ duplicate, tối ưu thuật toán mà vẫn đảm bảo 100% test suites vượt qua.
5. **Cập nhật Memory Bank:** Đồng bộ hóa tự động tiến độ vào `memory-bank/activeContext.md` và `memory-bank/progress.md`.
6. **Kiểm tra Toàn vẹn & Phát hành (Delivery):** Chạy script Python loại bỏ mã nháp, file nội bộ và push lên kho lưu trữ chính thức.

---

## 3. Workflow 2: Định danh & Phiên làm việc (Identity, Authentication & Session Lifecycle)

Quy trình xác thực trong Nomadix được bảo vệ bằng mô hình đa lớp: **Bcrypt (12 rounds) + Dual JWT (Access Token 15 phút + Refresh Token lưu tại cơ sở dữ liệu)** cùng cơ chế lưu trữ an toàn trên thiết bị di động (`expo-secure-store`).

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách du lịch (Mobile User)
    participant Client as React Native Client (useAuthStore)
    participant Gateway as Express Gateway (Joi & RateLimiter)
    participant AuthService as AuthService & TokenService
    participant Postgres as PostgreSQL (users, refresh_tokens)
    participant Redis as Redis 7 (OTP & Blacklist)

    alt Đăng ký tài khoản với Mã OTP xác thực
        User->>Client: Nhập Họ tên, Ngày sinh, SĐT, Email, Mật khẩu
        Client->>Gateway: POST /api/v1/auth/send-otp { email }
        Gateway->>AuthService: Tạo 6-digit OTP
        AuthService->>Redis: SETEX nomadix:otp:{email} 300 {otpCode}
        Redis-->>Client: Mô phỏng SMS/Email gửi mã OTP (Demo Banner: 123456)
        User->>Client: Nhập mã PIN 6 số
        Client->>Gateway: POST /api/v1/auth/register { ..., otpCode }
        Gateway->>AuthService: Xác minh OTP khớp trong Redis
        AuthService->>Postgres: INSERT INTO users (hash mật khẩu Bcrypt 12 rounds)
    else Đăng nhập với Google OAuth 2.0
        User->>Client: Bấm "Continue with Google"
        Client->>Gateway: POST /api/v1/auth/google { googleToken }
        Gateway->>AuthService: Xác minh Google ID Token với Google API
        AuthService->>Postgres: UPSERT user theo google_id, cập nhật avatar_url
    end

    AuthService->>AuthService: Ký Access Token (JWT 15m, payload: { id, email, role })
    AuthService->>Postgres: Lưu Refresh Token hash (SHA-256) vào bảng refresh_tokens
    Gateway-->>Client: 200 OK { user, accessToken, refreshToken }
    Client->>Client: Lưu trữ Tokens vào SecureStore & gán Authorization: Bearer {token}
```

---

## 4. Workflow 3: Đặt vé Thông minh & Cache-Aside (Smart Booking & Cache-Aside Pipeline)

Luồng tìm kiếm chuyến bay và khách sạn xử lý hàng ngàn kết quả thông qua kiến trúc **Cache-Aside** trên Redis 7.0, kết hợp bộ chuẩn hóa dữ liệu đa nguồn (**Unified Normalizer**) và sinh thẻ **Boarding Pass** chuẩn hàng không.

```mermaid
sequenceDiagram
    autonumber
    actor User as Khách du lịch
    participant App as Mobile UI (FlightSearchScreen)
    participant Gateway as API Gateway (Rate Limiter)
    participant BookingSvc as BookingService & Normalizer
    participant Redis as Redis Cache (TTL 1800s)
    participant Duffel as Duffel Flights NDC API
    participant Postgres as PostgreSQL (bookings, passengers)

    User->>App: Tìm vé bay (SGN -> HND, Ngày bay, 1 Người lớn)
    App->>Gateway: GET /api/v1/flights?origin=SGN&dest=HND&date=...
    Gateway->>BookingSvc: searchFlights(params)
    BookingSvc->>Redis: GET nomadix:flight:SGN:HND:date
    alt Cache Hit (Dữ liệu đã có trong RAM)
        Redis-->>BookingSvc: Trả về danh sách JSON (< 5ms)
    else Cache Miss (Lần đầu tìm kiếm)
        BookingSvc->>Duffel: POST /air/offer_requests (NDC Integration)
        Duffel-->>BookingSvc: Trả về Raw Offers từ Hãng hàng không
        BookingSvc->>BookingSvc: Chuẩn hóa Normalizer (Thương hiệu, Logo, Giờ, Giá thấp nhất)
        BookingSvc->>Redis: SETEX nomadix:flight:SGN:HND:date 1800 {json}
    end
    BookingSvc-->>App: Danh sách Unified Flights
    User->>App: Chọn chuyến bay + Chọn ghế (A321 Seat Map) + Hành lý (+20kg)
    User->>App: Nhập thông tin hành khách & Bấm "Pay & Book"
    App->>Gateway: POST /api/v1/bookings/sandbox-checkout
    Gateway->>Postgres: BEGIN TRANSACTION
    Gateway->>Postgres: INSERT INTO bookings, INSERT INTO booking_passengers
    Gateway->>Postgres: COMMIT
    Gateway-->>App: 201 Created { bookingRef: "NMX-7890", status: "CONFIRMED" }
    App->>User: Hiển thị Thẻ Boarding Pass (Barcode SVG, Perforation Notches)
```

---

## 5. Workflow 4: Lập kế hoạch Du lịch Đa thành phố & Bản đồ (Multi-City Planning & Map Route Discovery)

Lập kế hoạch du lịch là trái tim của Nomadix. Luồng công việc này chuyển hóa ý tưởng của người dùng thành một lộ trình hoàn chỉnh có tọa độ địa lý, ảnh phong cảnh thực tế và điều hướng GPS:

```mermaid
sequenceDiagram
    autonumber
    actor User as Trưởng nhóm Du lịch
    participant Wizard as AccordionTripWizardModal
    participant PlacesStore as usePlacesStore
    participant Server as ItineraryController & OpenTripMapProvider
    participant OTM as OpenTripMap API
    participant Mongo as MongoDB Atlas (itineraries)

    User->>Wizard: Chọn Thành phố (Đà Nẵng), Số ngày (3 ngày), Sở thích (Ẩm thực, Di tích)
    Wizard->>PlacesStore: fetchPlaces("Đà Nẵng")
    PlacesStore->>Server: GET /api/v1/places?city=DaNang
    Server->>OTM: Geoname lookup (kinh độ, vĩ độ) & Radius Search
    OTM-->>Server: Trả về danh sách GeoJSON địa danh
    Server->>Server: Gán ảnh thật từ Wikimedia Commons / Unsplash Registry
    Server-->>PlacesStore: Danh sách địa danh thực (Cầu Rồng, Ngũ Hành Sơn, Bà Nà)
    User->>Wizard: Chọn các địa điểm tham quan theo từng ngày
    Wizard->>Wizard: Phân bổ khách sạn và phương tiện di chuyển
    Wizard->>Server: POST /api/v1/itineraries { name, days, items, budget }
    Server->>Server: Tính khoảng cách Haversine giữa các điểm dừng liên tiếp
    Server->>Mongo: INSERT document itineraries (1:Few days[] embedded)
    Mongo-->>Server: 201 Created {_id: "itinerary_123"}
    Server-->>Wizard: Trả về chuyến đi hoàn chỉnh
    Wizard->>User: Hiển thị trên PlanScreen Hub (Bản đồ kết nối đường đi & Apple/Google Maps deep-link)
```

---

## 6. Workflow 5: Đồng hành & Đồng bộ Nhóm Thời gian Thực (Squad Collaboration & Real-Time Sync)

Đi du lịch theo nhóm đòi hỏi sự đồng thuận cao. Nomadix cung cấp quy trình mời bạn đồng hành bảo mật và phân quyền vai trò (Role-Based Access Control) ngay trong lịch trình:

```mermaid
sequenceDiagram
    autonumber
    actor Owner as Chủ chuyến đi (Trip Owner)
    actor Mate as Bạn đồng hành (Squad Companion)
    participant ClientA as App (Owner)
    participant ClientB as App (Companion)
    participant ItinSvc as ItineraryService (Collaborator Logic)
    participant Mongo as MongoDB Atlas (itineraries)

    Owner->>ClientA: Bấm "+ Invite Squad" trên Thẻ Boarding Pass
    ClientA->>ItinSvc: POST /api/v1/itineraries/:id/invite
    ItinSvc->>Mongo: Sinh mã inviteCode ngẫu nhiên (ví dụ: `NX-DANANG-90`)
    Mongo-->>ClientA: Trả về link chia sẻ `nomadix.app/join/NX-DANANG-90`
    Owner-->>Mate: Gửi link qua tin nhắn (Zalo / iMessage)
    Mate->>ClientB: Nhấp link hoặc nhập mã trên màn hình Plan
    ClientB->>ItinSvc: POST /api/v1/itineraries/join { inviteCode: "NX-DANANG-90" }
    ItinSvc->>Mongo: Xác thực chuyến đi & kiểm tra trùng lặp thành viên
    ItinSvc->>Mongo: $push vào mảng `collaborators: [{ userId, role: "EDITOR", status: "ACCEPTED" }]`
    Mongo-->>ClientB: 200 OK (Đã tham gia thành công!)
    ClientB->>ClientB: Tải toàn bộ lộ trình và Danh sách đồ chuẩn bị chung (Shared Checklist)
    ClientA->>ClientA: Cập nhật danh sách Avatar nhóm trên Boarding Pass
```

---

## 7. Workflow 6: Phân bổ Chi phí & Giải quyết Công nợ Nhóm (Group Expense Splitting & Debt Settlement Pipeline)

Đây là quy trình phức tạp nhất về mặt kỹ thuật, kết hợp giữa **Lưu trữ Hóa đơn (Cloudinary)**, **Giao dịch Ngân hàng ACID (PostgreSQL)**, và **Thuật toán Tham lam Rút gọn Dòng tiền Tối thiểu (Greedy Minimum Cash-Flow Reduction $O(N \log N)$)**:

```mermaid
sequenceDiagram
    autonumber
    actor Payer as Người trả tiền (User A)
    actor Squad as Các thành viên (User B, User C)
    participant Mobile as Mobile App (ExpenseHub)
    participant ExpController as ExpenseController
    participant Cloudinary as Cloudinary Image Provider
    participant Postgres as PostgreSQL 16 (Ledger Engine)
    participant DebtAlgo as DebtSimplificationEngine

    Payer->>Mobile: Tạo hóa đơn ăn tối: $150 (User A trả trước)
    Payer->>Mobile: Chọn chia đều (Split Equal) cho A, B, C ($50/người)
    Payer->>Mobile: Chụp ảnh hóa đơn giấy
    Mobile->>ExpController: POST /api/v1/trips/:tripId/expenses (Multipart Form)
    ExpController->>Cloudinary: Nén ảnh client-side & Upload WebP format
    Cloudinary-->>ExpController: Trả về secure_url: `res.cloudinary.com/.../receipt.webp`
    ExpController->>Postgres: BEGIN TRANSACTION
    ExpController->>Postgres: INSERT INTO trip_expenses (amount: 150.00, paid_by: User A, receipt_url)
    ExpController->>Postgres: INSERT INTO trip_expense_splits (A: 50.00, B: 50.00, C: 50.00)
    ExpController->>Postgres: COMMIT TRANSACTION
    ExpController-->>Mobile: 201 Created

    Note over Mobile, DebtAlgo: Khi nhóm muốn thanh toán dứt điểm (Settle-Up)
    Squad->>Mobile: Mở tab "Settle Debts"
    Mobile->>ExpController: GET /api/v1/trips/:tripId/debts
    ExpController->>Postgres: SELECT sum(splits) - sum(paid) GROUP BY user_id
    Postgres-->>ExpController: Trả về Bảng cân đối Net Balance: [A: +100, B: -50, C: -50]
    ExpController->>DebtAlgo: settleGroupDebts(participants)
    Note over DebtAlgo: Kiểm tra Bất biến Zero-Sum: (+100) + (-50) + (-50) = 0
    Note over DebtAlgo: 2 Hàng đợi Ưu tiên (Max Heap) ghép nợ chỉ tốn 2 giao dịch!
    DebtAlgo-->>ExpController: Kế hoạch thanh toán tối ưu: [B trả A $50, C trả A $50]
    ExpController-->>Mobile: 200 OK (Kế hoạch dứt điểm nợ gọn gàng nhất)
```

---

## 8. Workflow 7: Điều phối Nhất quán Đa Cơ sở Dữ liệu (Polyglot Cross-Database Consistency)

Trong kiến trúc Polyglot của Nomadix, không tồn tại khóa ngoại vật lý (Physical Foreign Key) giữa PostgreSQL và MongoDB Atlas. Hệ thống duy trì tính nhất quán bằng mô hình **Application-Layer Referential Integrity**:

```
┌──────────────────────────────────────┐          ┌──────────────────────────────────────┐
│       POSTGRESQL 16 (RELATIONAL)     │          │       MONGODB ATLAS 7 (DOCUMENT)     │
├──────────────────────────────────────┤          ├──────────────────────────────────────┤
│ TABLE: users                         │          │ COLLECTION: itineraries              │
│   id: UUID (Primary Key)             │◄───┐     │   _id: ObjectId / String (Primary)   │
│   email: VARCHAR                     │    │     │   title: String                      │
│   full_name: VARCHAR                 │    │     │   destination: String                │
├──────────────────────────────────────┤    │     │   collaborators: [                   │
│ TABLE: trip_expenses                 │    │     │     {                                │
│   id: UUID (Primary Key)             │    │     │       userId: String, ───────────────┘
│   trip_id: VARCHAR(50) (Indexed) ────┼────┼───► │       role: "OWNER" | "EDITOR"       │
│   paid_by: UUID (FK -> users.id)     │    │     │     }                                │
│   amount: NUMERIC(12, 2)             │    │     │   ]                                  │
├──────────────────────────────────────┤    │     │   days: [                            │
│ TABLE: trip_settlements              │    │     │     { items: [ ... ] }               │
│   trip_id: VARCHAR(50) (Indexed) ────┼────┘     │   ]                                  │
│   debtor_id: UUID (FK -> users.id)   │          └──────────────────────────────────────┘
│   creditor_id: UUID (FK -> users.id) │
└──────────────────────────────────────┘
```

### Nguyên tắc Vàng trong Điều phối:
1. **MongoDB lưu trữ Lịch trình & Phân quyền:**
   Mỗi chuyến đi được định danh bằng một chuỗi `tripId` duy nhất trong MongoDB. Các cộng tác viên được lưu dưới dạng mảng con `collaborators` chứa `userId` (chuỗi UUID tương ứng với bảng `users` trong PostgreSQL).
2. **PostgreSQL lưu trữ Sổ cái Tài chính:**
   Bảng `trip_expenses` và `trip_settlements` chỉ cần lưu cột chỉ mục `trip_id VARCHAR(50)`. Khi người dùng muốn xem sổ nợ của chuyến đi `X`, PostgreSQL chỉ cần truy vấn `WHERE trip_id = 'X'` với tốc độ $< 2\text{ms}$ nhờ B-Tree Index.
3. **Không xảy ra Distributed Deadlock:**
   Toàn bộ tiền bạc, nợ nần, thanh toán đều nằm trọn vẹn trong PostgreSQL ACID Engine. MongoDB không bao giờ tham gia vào tính toán tiền bạc, loại trừ hoàn toàn nguy cơ mất dữ liệu hay xung đột khóa phân tán.

---
*Tài liệu tham khảo thuộc Bộ Giáo trình Đào tạo Kỹ sư Nomadix Core Platform.*
