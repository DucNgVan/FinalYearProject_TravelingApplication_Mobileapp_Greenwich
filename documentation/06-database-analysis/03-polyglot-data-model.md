# 03. Polyglot Data Model & Cross-Database Integration Pattern

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** Polyglot Persistence Architecture & Data Integrity Pattern  
**Phase:** Day 6 — Database Analysis & ERD Modeling  

---

## 1. NGUYÊN LÝ THIẾT KẾ ĐA CƠ SỞ DỮ LIỆU (POLYGLOT PERSISTENCE PRINCIPLE)

Hệ thống **Nomadix** áp dụng mô hình **Polyglot Persistence** (Sử dụng đồng thời nhiều công nghệ cơ sở dữ liệu chuyên biệt), trong đó mỗi hệ quản trị được giao nhiệm vụ đúng với sở trường tối ưu nhất của nó:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   POLYGLOT DATABASE RESPONSIBILITY MATRIX              │
├─────────────────┬───────────────────┬──────────────────────────────────┤
│ Hệ Cơ Sở Dữ Liệu│ Trách nhiệm chính │ Tại sao chọn?                    │
├─────────────────┼───────────────────┼──────────────────────────────────┤
│ PostgreSQL 16   │ Identity, Auth,   │ Tính toàn vẹn ACID, chuẩn hóa    │
│ (Relational)    │ Gamification XP,  │ 3NF, bảo vệ điểm số, sổ chi tiêu │
│                 │ Badges, Check-ins,│ nhóm (Group Expenses & Splits),  │
│                 │ Group Expenses,   │ quyết toán công nợ (Settlements),│
│                 │ Debt Settlements  │ chống sai lệch số dư tài chính.  │
├─────────────────┼───────────────────┼──────────────────────────────────┤
│ MongoDB Atlas 7 │ Itineraries,      │ Cấu trúc tài liệu JSON linh hoạt,│
│ (Document Store)│ Collaborators,    │ phân cấp nhiều tầng (Days/Items),│
│                 │ Community Q&A,    │ tối ưu hóa ghi đọc đồng bộ nhóm, │
│                 │ Comments, Reports │ bản đồ địa lý 2dsphere GeoJSON.  │
├─────────────────┼───────────────────┼──────────────────────────────────┤
│ Redis 7         │ Search Caching,   │ Bộ nhớ RAM siêu tốc, phản hồi    │
│ (In-Memory)     │ Rate Limiting,    │ < 50ms, TTL tự động hủy dữ liệu  │
│                 │ Session Cache     │ cũ, giảm 80% tải API bên ngoài.  │
└─────────────────┴───────────────────┴──────────────────────────────────┘
```

---

## 2. CHIẾN LƯỢC KHÓA NGOẠI THAM CHIẾU CHÉO HAI CHIỀU (BIDIRECTIONAL CROSS-DB REFERENCE PATTERN)

Do PostgreSQL và MongoDB nằm trên hai hệ quản trị vật lý độc lập, hệ thống không thể sử dụng cơ chế Foreign Key Cascade truyền thống ở tầng database. 

Thay vào đó, Nomadix triển khai **Design Pattern: Application-Level Referential Integrity** với liên kết tham chiếu hai chiều đồng nhất:

```text
Chiều 1: PostgreSQL USERS(id) [UUID v4] ───► MongoDB Documents
  ├── itineraries.userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' (Trip Owner)
  ├── itineraries.collaborators[].userId: 'b1ffcd88-...' (Travel Companions)
  ├── forum_questions.userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  └── forum_answers.userId: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

Chiều 2: MongoDB ITINERARIES(_id) [ObjectId String] ───► PostgreSQL Tables
  ├── trip_members.trip_id: '650f1a2b3c4d5e6f7a8b9c0d' (Role, Invitation Status)
  ├── trip_expenses.trip_id: '650f1a2b3c4d5e6f7a8b9c0d' (Group Expense Ledger)
  ├── trip_settlements.trip_id: '650f1a2b3c4d5e6f7a8b9c0d' (Debt Settlements)
  └── bookings.itinerary_id: '650f1a2b3c4d5e6f7a8b9c0d' (OTA Booking Binding)
```

---

## 3. GIAO THỨC XÁC THỰC UY TÍN LIÊN DATABASE (CITY VERIFIED PROTOCOL)

Khi một thành viên đăng bài hoặc trả lời trong diễn đàn, hệ thống thực hiện bắt cầu dữ liệu (Data Bridge) theo lưu đồ Mermaid sau:

```mermaid
sequenceDiagram
    autonumber
    actor User as Experienced Traveler
    participant API as Express API Server
    participant Postgres as PostgreSQL (user_badges)
    participant Mongo as MongoDB (forum_answers)

    User->>API: POST /api/v1/community/questions/:id/answers (Content: "...")
    API->>API: Xác định City của câu hỏi (e.g., 'Da Nang')
    API->>Postgres: SELECT ub.unlocked_at FROM user_badges ub JOIN badges b ON ub.badge_id = b.id WHERE ub.user_id = $1 AND b.city = 'Da Nang'
    
    alt Tìm thấy bản ghi Huy hiệu Đà Nẵng
        Postgres-->>API: Return Badge Info { name: 'Da Nang Explorer' }
        API->>Mongo: INSERT forum_answers { content, isCityVerified: true, hasCityBadge: true, verifiedBadgeTitle: 'Da Nang Explorer' }
    else Không tìm thấy Huy hiệu
        Postgres-->>API: Return null
        API->>Mongo: INSERT forum_answers { content, isCityVerified: false, hasCityBadge: false }
    end

    Mongo-->>API: Acknowledge Insert
    API-->>User: HTTP 201 Created (Answer Rendered with Golden Badge Frame)
```

---

### 3.2 GIAO THỨC ĐỒNG BỘ CHUYẾN ĐI NHÓM & QUYẾT TOÁN CHI PHÍ (COLLABORATIVE TRIP & GROUP EXPENSE BRIDGE)

Khi tổ chức chuyến đi chung (Collaborative Trip) và ghi nhận chi phí chia sẻ (Group Expense Splitting), luồng điều phối liên cơ sở dữ liệu diễn ra như sau:

```mermaid
sequenceDiagram
    autonumber
    actor Organizer as Trip Organizer (User A)
    actor Companion as Travel Companion (User B)
    participant API as Express API Gateway
    participant Postgres as PostgreSQL 16 (Relational ACID)
    participant Mongo as MongoDB Atlas (Document Store)
    participant Cloudinary as Cloudinary CDN

    Note over Organizer, Mongo: 1. Thêm bạn bè vào chuyến đi (Invite Companion)
    Organizer->>API: POST /api/v1/trips/:id/collaborators { email: "userB@gmail.com", role: "editor" }
    API->>Postgres: SELECT id FROM users WHERE email = 'userB@gmail.com'
    Postgres-->>API: Found user_id (UUID-B)
    API->>Mongo: UPDATE itineraries SET collaborators.push({ userId: UUID-B, role: 'editor', status: 'pending' })
    API->>Postgres: INSERT INTO trip_members (trip_id, user_id, role, invitation_status, invited_by)
    Postgres-->>API: Confirm Membership Stored
    API-->>Organizer: HTTP 201 Created (Invitation Sent)

    Note over Companion, Mongo: 2. Cùng xem chung & chỉnh sửa lịch trình (Real-time View)
    Companion->>API: GET /api/v1/itineraries/:id
    API->>Mongo: findOne({ _id: :id, $or: [{ userId: UUID-B }, { 'collaborators.userId': UUID-B }] })
    Mongo-->>API: Return Full Itinerary Timeline & Days Schedule
    API-->>Companion: Render Identical Map & Timeline to Companion

    Note over Companion, Postgres: 3. Gửi hóa đơn & Chia sẻ chi phí (Group Expense Logging)
    Companion->>API: POST /api/v1/trips/:id/expenses (Multi-part Bill Image + Expense Details)
    API->>Cloudinary: Upload Receipt Image (/nomadix/receipts/{tripId}/)
    Cloudinary-->>API: Return secure_url
    API->>Postgres: BEGIN TRANSACTION
    API->>Postgres: INSERT INTO trip_expenses (trip_id, payer_id: UUID-B, amount, category, receipt_url, split_strategy)
    API->>Postgres: INSERT INTO trip_expense_splits (expense_id, user_id, split_amount) FOR EACH MEMBER
    API->>Postgres: COMMIT TRANSACTION
    Postgres-->>API: Confirm ACID Financial Ledger Written
    API-->>Companion: HTTP 201 Created (Expense Logged & Balance Updated)
```

---

## 4. CHIẾN LƯỢC QUẢN LÝ BỘ NHỚ REDIS & TAXONOMY KHÓA

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        REDIS KEY TAXONOMY MATRIX                       │
├─────────────────┬──────────────────────────────────┬───────────────────┤
│ Loại dữ liệu    │ Cấu trúc Khóa (Key Pattern)      │ Thời hạn sống TTL │
├─────────────────┼──────────────────────────────────┼───────────────────┤
│ Chuyến bay      │ cache:flights:${origin}:${dest}: │ 1800 giây         │
│                 │ ${date}:${pax}:${class}          │ (30 phút)         │
├─────────────────┼──────────────────────────────────┼───────────────────┤
│ Khách sạn       │ cache:hotels:${city}:${checkIn}: │ 3600 giây         │
│                 │ ${checkOut}:${guests}:${rooms}   │ (60 phút)         │
├─────────────────┼──────────────────────────────────┼───────────────────┤
│ Địa danh static │ cache:landmarks:${city}          │ 86400 giây        │
│                 │                                  │ (24 giờ)          │
├─────────────────┼──────────────────────────────────┼───────────────────┤
│ Giới hạn tải    │ rate_limit:${ipAddress}          │ 900 giây          │
│ (Rate Limit)    │                                  │ (15 phút)         │
└─────────────────┴──────────────────────────────────┴───────────────────┘
```

### Ước tính dung lượng bộ nhớ RAM (Memory Sizing Calculation):
* Kích thước trung bình 1 bản ghi tìm kiếm sau chuẩn hóa: $\approx 15\text{ KB}$.
* Với $1,000$ truy vấn tìm kiếm đồng thời được lưu cache:
  $$\text{RAM Capacity} = 1,000 \times 15\text{ KB} \approx 15\text{ MB RAM}$$
* Dung lượng này chiếm chưa tới $5\%$ hạn mức gói Redis Cloud Free Tier ($30\text{ MB}$), bảo đảm hệ thống vận hành cực kỳ an toàn và tiết kiệm tài nguyên.
