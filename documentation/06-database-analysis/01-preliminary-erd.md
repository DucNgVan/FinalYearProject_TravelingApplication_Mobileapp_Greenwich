# 01. Comprehensive Entity-Relationship Diagram (ERD)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** Relational 3NF & Document Schemas (Mermaid ERD Specification)  
**Phase:** Day 6 — Database Analysis & ERD Modeling  
**Milestone:** `D6 - Database Analysis` / `W1 - Requirements & Analysis`  

---

## 1. SƠ ĐỒ THỰC THỂ QUAN HỆ TOÀN DIỆN POSTGRESQL (RELATIONAL ERD 3NF)

Sơ đồ dưới đây mô hình hóa **toàn bộ 13 bảng quan hệ trọng tâm** trong cơ sở dữ liệu PostgreSQL của hệ thống Nomadix, tuân thủ chuẩn hóa 3NF (Third Normal Form), thể hiện đầy đủ các trường, kiểu dữ liệu, khóa chính (PK), khóa ngoại (FK) và mối quan hệ (Cardinality):

```mermaid
erDiagram
    ROLES {
        int id PK "Tự tăng (1: Admin, 2: Traveler)"
        varchar name UK "Tên quyền: admin, traveler"
        varchar description "Mô tả chi tiết quyền hạn"
        timestamp created_at "Thời gian tạo"
    }

    USERS {
        uuid id PK "UUID v4 định danh duy nhất"
        varchar email UK "Email đăng nhập chuẩn RFC 5322"
        varchar password_hash "Chuỗi mã hóa Bcrypt 12 rounds"
        varchar full_name "Họ và tên người dùng"
        text avatar_url "HTTPS URL ảnh trên Cloudinary"
        text bio "Tiểu sử cá nhân ngắn"
        int role_id FK "Tham chiếu ROLES(id)"
        int xp "Tổng điểm kinh nghiệm tích lũy"
        int level "Cấp độ hiện tại: floor(sqrt(xp/100))+1"
        timestamp last_login_at "Thời điểm đăng nhập gần nhất"
        timestamp created_at "Thời điểm tạo tài khoản"
        timestamp updated_at "Thời điểm cập nhật gần nhất"
    }

    LANDMARKS {
        uuid id PK "UUID v4 định danh địa danh"
        varchar name "Tên địa danh (ví dụ: Cầu Rồng)"
        varchar city "Thành phố (ví dụ: Đà Nẵng)"
        varchar country "Quốc gia (ví dụ: Việt Nam)"
        numeric latitude "Vĩ độ WGS84: 16.0610"
        numeric longitude "Kinh độ WGS84: 108.2272"
        int geofence_radius_meters "Bán kính quét: 100m"
        text description "Bài viết giới thiệu lịch sử"
        text cover_image_url "Ảnh bìa địa danh trên Cloudinary"
        int xp_reward "Điểm XP thưởng (Mặc định: 150)"
        jsonb historical_facts "Thông tin lịch sử mở rộng JSONB"
        timestamp created_at "Thời điểm tạo"
    }

    CHECKINS {
        uuid id PK "UUID v4 định danh bản ghi check-in"
        uuid user_id FK "Tham chiếu USERS(id)"
        uuid landmark_id FK "Tham chiếu LANDMARKS(id)"
        numeric latitude "Tọa độ GPS thực tế của thiết bị"
        numeric longitude "Tọa độ GPS thực tế của thiết bị"
        text photo_url "HTTPS URL ảnh check-in có watermark"
        timestamp verified_at "Thời điểm xác thực thành công"
    }

    BADGES {
        uuid id PK "UUID v4 định danh huy hiệu"
        varchar name UK "Tên huy hiệu: Da Nang Explorer"
        varchar city "Thành phố áp dụng: Đà Nẵng"
        text badge_icon_url "HTTPS URL icon huy hiệu mạ vàng"
        int required_checkins "Số địa danh cần check-in: 3"
        int required_quiz_score "Điểm quiz tối thiểu: 66%"
        int xp_bonus "Điểm XP thưởng thêm khi đạt: 300"
        timestamp created_at "Thời điểm tạo"
    }

    USER_BADGES {
        uuid id PK "UUID v4 định danh chứng nhận"
        uuid user_id FK "Tham chiếu USERS(id)"
        uuid badge_id FK "Tham chiếu BADGES(id)"
        timestamp unlocked_at "Thời điểm mở khóa chính thức"
    }

    QUIZZES {
        uuid id PK "UUID v4 định danh bài quiz"
        uuid landmark_id FK "Tham chiếu LANDMARKS(id) (1-1)"
        varchar title "Tiêu đề bài trắc nghiệm văn hóa"
        text description "Mô tả nội dung bài kiểm tra"
        timestamp created_at "Thời điểm tạo"
    }

    QUIZ_QUESTIONS {
        uuid id PK "UUID v4 định danh câu hỏi"
        uuid quiz_id FK "Tham chiếu QUIZZES(id)"
        text question_text "Nội dung câu hỏi trắc nghiệm"
        varchar option_a "Lựa chọn A"
        varchar option_b "Lựa chọn B"
        varchar option_c "Lựa chọn C"
        varchar option_d "Lựa chọn D"
        char correct_option "Đáp án đúng (A, B, C, D) - Ẩn"
        text explanation "Giải thích kiến thức văn hóa sau thi"
    }

    QUIZ_ATTEMPTS {
        uuid id PK "UUID v4 định danh lượt thi"
        uuid user_id FK "Tham chiếu USERS(id)"
        uuid quiz_id FK "Tham chiếu QUIZZES(id)"
        numeric score "Điểm số đạt được (ví dụ: 100.0%)"
        boolean is_passed "Trạng thái đạt: true/false"
        timestamp attempted_at "Thời điểm hoàn thành bài thi"
    }

    TRIP_MEMBERS {
        uuid id PK "UUID v4 định danh thành viên nhóm"
        varchar trip_id "Chuỗi ObjectId tham chiếu MongoDB itineraries(_id)"
        uuid user_id FK "Tham chiếu USERS(id)"
        varchar role "Quyền hạn: owner, editor, viewer"
        varchar invitation_status "Trạng thái: pending, accepted, declined"
        uuid invited_by FK "Tham chiếu USERS(id)"
        timestamp joined_at "Thời điểm tham gia"
    }

    TRIP_EXPENSES {
        uuid id PK "UUID v4 định danh khoản chi"
        varchar trip_id "Chuỗi ObjectId tham chiếu MongoDB itineraries(_id)"
        uuid payer_id FK "Tham chiếu USERS(id) người thanh toán"
        varchar title "Mục chi tiêu (ví dụ: Ăn tối Hải Sản Bé Mặn)"
        numeric amount "Tổng số tiền chi (VND)"
        char currency "Mã tiền tệ: VND"
        varchar category "food, stay, transport, sightseeing, shopping, other"
        text receipt_url "HTTPS URL hóa đơn trên Cloudinary"
        varchar split_strategy "equal, exact, percentage, shares"
        varchar notes "Ghi chú chi tiêu"
        timestamp expense_date "Thời điểm phát sinh chi phí"
    }

    TRIP_EXPENSE_SPLITS {
        uuid id PK "UUID v4 định danh phần chia khoản chi"
        uuid expense_id FK "Tham chiếu TRIP_EXPENSES(id)"
        uuid user_id FK "Tham chiếu USERS(id) người có nghĩa vụ trả"
        numeric split_amount "Số tiền phải chia (VND)"
        boolean is_settled "Trạng thái đã thanh quyết toán: true/false"
    }

    TRIP_SETTLEMENTS {
        uuid id PK "UUID v4 định danh thanh toán công nợ"
        varchar trip_id "Chuỗi ObjectId tham chiếu MongoDB itineraries(_id)"
        uuid debtor_id FK "Tham chiếu USERS(id) người nợ"
        uuid creditor_id FK "Tham chiếu USERS(id) người nhận tiền"
        numeric amount "Số tiền chuyển khoản quyết toán (VND)"
        char currency "Mã tiền tệ: VND"
        varchar status "Trạng thái: pending, confirmed, rejected"
        text proof_image_url "HTTPS URL ủy nhiệm chi / ảnh chuyển khoản"
        timestamp settled_at "Thời điểm xác nhận hoàn tất"
    }

    %% CÁC QUAN HỆ RÀNG BUỘC KHÓA NGOẠI (RELATIONSHIPS)
    ROLES ||--o{ USERS : "defines_role_of"
    USERS ||--o{ CHECKINS : "performs"
    LANDMARKS ||--o{ CHECKINS : "registered_location"
    USERS ||--o{ USER_BADGES : "earns_and_owns"
    BADGES ||--o{ USER_BADGES : "awarded_to"
    LANDMARKS ||--|| QUIZZES : "has_cultural_quiz"
    QUIZZES ||--o{ QUIZ_QUESTIONS : "composed_of"
    USERS ||--o{ QUIZ_ATTEMPTS : "takes_exam"
    QUIZZES ||--o{ QUIZ_ATTEMPTS : "attempted_in"
    USERS ||--o{ TRIP_MEMBERS : "joins_as_member"
    USERS ||--o{ TRIP_EXPENSES : "pays_for_expense"
    TRIP_EXPENSES ||--|{ TRIP_EXPENSE_SPLITS : "split_among"
    USERS ||--o{ TRIP_EXPENSE_SPLITS : "owes_share"
    USERS ||--o{ TRIP_SETTLEMENTS : "transfers_or_receives"
```

---

## 2. SƠ ĐỒ CẤU TRÚC TÀI LIỆU MONGODB (DOCUMENT COLLECTIONS ERD)

Sơ đồ dưới đây mô hình hóa cấu trúc tài liệu phân cấp lồng nhau (Embedded & Referenced Documents) của MongoDB Atlas:

```mermaid
erDiagram
    ITINERARIES {
        ObjectId _id PK "Định danh tài liệu chuyến đi"
        string userId "UUID chuỗi tham chiếu PostgreSQL USERS(id)"
        string title "Tiêu đề chuyến đi (ví dụ: Đà Nẵng 3N2Đ)"
        string city "Thành phố đích (Đà Nẵng)"
        string country "Quốc gia (Việt Nam)"
        date startDate "Ngày bắt đầu chuyến đi"
        date endDate "Ngày kết thúc chuyến đi"
        number budgetEstimate "Ngân sách ước tính VND"
        boolean isPublic "Công khai chia sẻ cộng đồng: true/false"
        number cloneCount "Số lượt người dùng khác nhân bản"
        array collaborators "Mảng thành viên đồng hành: [{ userId, role, joinedAt, status }]"
        array days "Mảng các ngày: Array of DayObjects"
        date createdAt "Thời điểm tạo"
        date updatedAt "Thời điểm cập nhật"
    }

    FORUM_QUESTIONS {
        ObjectId _id PK "Định danh câu hỏi diễn đàn"
        string userId "UUID chuỗi tham chiếu PostgreSQL USERS(id)"
        string authorName "Tên hiển thị của tác giả"
        string authorAvatar "URL ảnh đại diện tác giả"
        string country "Quốc gia (Việt Nam)"
        string city "Thành phố (Đà Nẵng)"
        string title "Tiêu đề câu hỏi thảo luận"
        string content "Nội dung chi tiết câu hỏi"
        array tags "Mảng các nhãn: ['Food', 'Budget']"
        number upvotes "Số lượt bình chọn hữu ích"
        number answerCount "Tổng số câu trả lời"
        boolean isResolved "Đã có câu trả lời thỏa đáng"
        date createdAt "Thời điểm đăng"
    }

    FORUM_ANSWERS {
        ObjectId _id PK "Định danh câu trả lời"
        ObjectId questionId FK "Tham chiếu FORUM_QUESTIONS(_id)"
        string userId "UUID chuỗi tham chiếu PostgreSQL USERS(id)"
        string authorName "Tên hiển thị tác giả câu trả lời"
        string authorAvatar "URL ảnh đại diện tác giả"
        boolean hasCityBadge "Có huy hiệu thành phố này không"
        boolean isCityVerified "Xác thực danh hiệu: true/false"
        string verifiedBadgeTitle "Tên danh hiệu: Da Nang Explorer"
        string content "Nội dung câu trả lời kinh nghiệm"
        number upvotes "Số lượt bình chọn hữu ích"
        array comments "Mảng bình luận lồng nhau: Array of Comments"
        date createdAt "Thời điểm đăng"
    }

    REPORTS {
        ObjectId _id PK "Định danh báo cáo vi phạm"
        string reporterUserId "UUID người gửi báo cáo"
        string targetType "Loại đối tượng: 'question' / 'answer'"
        string targetId "ID của câu hỏi hoặc câu trả lời"
        string reason "Lý do: 'Spam', 'Inappropriate', 'Fake'"
        string status "Trạng thái: 'pending', 'resolved', 'dismissed'"
        date createdAt "Thời điểm báo cáo"
    }

    %% QUAN HỆ MONGODB
    FORUM_QUESTIONS ||--o{ FORUM_ANSWERS : "contains_answers"
    FORUM_QUESTIONS ||--o{ REPORTS : "can_be_reported"
    FORUM_ANSWERS ||--o{ REPORTS : "can_be_reported"
```

---

## 3. SƠ ĐỒ LIÊN KẾT ĐA CƠ SỞ DỮ LIỆU (POLYGLOT PERSISTENCE MAP)

Sơ đồ dưới đây thể hiện sự phối hợp nhịp nhàng giữa **PostgreSQL**, **MongoDB** và **Redis**:

```mermaid
graph TD
    subgraph "PostgreSQL 16 (Relational - ACID Engine)"
        PG_User["users (id: UUID)"]
        PG_Badge["badges (id: UUID, city: 'Da Nang')"]
        PG_UserBadge["user_badges (user_id, badge_id)"]
        PG_Checkin["checkins (user_id, landmark_id)"]
        PG_Member["trip_members (trip_id, user_id, role)"]
        PG_Expense["trip_expenses (trip_id, payer_id, amount)"]
        PG_Split["trip_expense_splits (expense_id, user_id, split_amount)"]
        PG_Settlement["trip_settlements (trip_id, debtor_id, creditor_id)"]

        PG_User --> PG_UserBadge
        PG_Badge --> PG_UserBadge
        PG_User --> PG_Checkin
        PG_User --> PG_Member
        PG_User --> PG_Expense
        PG_Expense --> PG_Split
        PG_User --> PG_Split
        PG_User --> PG_Settlement
    end

    subgraph "MongoDB Atlas (Document Store)"
        MG_Itin["itineraries (_id: ObjectId, userId: UUID, collaborators[])"]
        MG_Question["forum_questions (userId: UUID string)"]
        MG_Answer["forum_answers (userId: UUID string, isCityVerified: bool)"]

        MG_Question --> MG_Answer
    end

    subgraph "Redis 7 (In-Memory Fast Caching)"
        RD_Flight["cache:flights:HAN_DAD_* (TTL: 1800s)"]
        RD_Hotel["cache:hotels:DaNang_* (TTL: 3600s)"]
        RD_Rate["rate_limit:ip_* (TTL: 900s)"]
    end

    %% LIÊN KẾT THAM CHIẾU CHÉO (CROSS-REFERENCES)
    PG_User -.->|"userId (UUID String Reference)"| MG_Itin
    PG_User -.->|"userId (UUID String Reference)"| MG_Question
    PG_UserBadge -.->|"Check City Badge Ownership\n➔ Set isCityVerified=true"| MG_Answer
    MG_Itin -.->|"_id String Reference (trip_id)"| PG_Member
    MG_Itin -.->|"_id String Reference (trip_id)"| PG_Expense
    MG_Itin -.->|"_id String Reference (trip_id)"| PG_Settlement
```
