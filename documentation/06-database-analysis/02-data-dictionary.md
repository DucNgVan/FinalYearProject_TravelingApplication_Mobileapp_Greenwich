# 02. Comprehensive Data Dictionary (PostgreSQL & MongoDB)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** IEEE Database Design Documentation Standard  
**Phase:** Day 6 — Database Analysis & ERD Modeling  

---

## 1. TỪ ĐIỂN DỮ LIỆU POSTGRESQL (RELATIONAL SCHEMAS)

---

### 1.1 Bảng `roles` (Bảng phân quyền người dùng)
* **Mục đích:** Định nghĩa các cấp độ quyền hạn trong hệ thống (RBAC).
* **Khóa chính:** `id`.

| Tên trường (Column) | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `SERIAL` (INT) | NO | Auto | PRIMARY KEY | PK Index | Mã định danh quyền tự tăng (1: admin, 2: traveler). |
| `name` | `VARCHAR(50)` | NO | None | UNIQUE, NOT NULL | B-Tree UK | Tên quyền định danh duy nhất (`admin`, `traveler`). |
| `description` | `VARCHAR(255)` | YES | NULL | None | None | Mô tả chi tiết quyền hạn quản trị. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | None | None | Thời điểm tạo quyền. |

---

### 1.2 Bảng `users` (Bảng tài khoản người dùng)
* **Mục đích:** Lưu trữ danh tính, thông tin cá nhân và thông số Gamification của người dùng.
* **Khóa chính:** `id` (UUID v4).
* **Khóa ngoại:** `role_id` ➔ `roles(id)`.

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất toàn cầu cho tài khoản. |
| `email` | `VARCHAR(255)` | NO | None | UNIQUE, NOT NULL | B-Tree (Lower) | Email đăng nhập, chuẩn RFC 5322. |
| `password_hash` | `VARCHAR(255)` | NO | None | NOT NULL | None | Chuỗi mật khẩu băm Bcrypt 12 rounds (`$2a$12$...`). |
| `full_name` | `VARCHAR(100)` | NO | None | NOT NULL | None | Họ và tên hiển thị của người dùng. |
| `avatar_url` | `TEXT` | YES | NULL | None | None | Đường dẫn HTTPS ảnh đại diện trên Cloudinary. |
| `bio` | `VARCHAR(500)` | YES | NULL | None | None | Tiểu sử giới thiệu ngắn gọn của du khách. |
| `role_id` | `INT` | NO | `2` (traveler) | FOREIGN KEY | FK Index | Liên kết khóa ngoại tới `roles(id)`. |
| `xp` | `INT` | NO | `0` | CHECK (`xp >= 0`) | B-Tree Index | Tổng điểm kinh nghiệm tích lũy từ check-in và quiz. |
| `level` | `INT` | NO | `1` | CHECK (`level >= 1`) | B-Tree Index | Cấp độ: $\lfloor \sqrt{\text{xp} / 100} \rfloor + 1$. |
| `last_login_at` | `TIMESTAMPTZ` | YES | NULL | None | None | Thời điểm đăng nhập thành công gần nhất. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | None | None | Thời điểm đăng ký tài khoản. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | None | None | Thời điểm chỉnh sửa thông tin gần nhất. |

---

### 1.3 Bảng `landmarks` (Bảng danh mục địa danh văn hóa)
* **Mục đích:** Lưu trữ vị trí địa lý, tọa độ WGS84, bán kính Geofence và dữ liệu lịch sử của các địa danh.
* **Khóa chính:** `id` (UUID).

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất của địa danh. |
| `name` | `VARCHAR(150)` | NO | None | NOT NULL | B-Tree Index | Tên địa danh (ví dụ: *Cầu Rồng Đà Nẵng*). |
| `city` | `VARCHAR(100)` | NO | None | NOT NULL | B-Tree Index | Thành phố trực thuộc (ví dụ: *Đà Nẵng*). |
| `country` | `VARCHAR(100)` | NO | `'Việt Nam'` | NOT NULL | None | Quốc gia. |
| `latitude` | `NUMERIC(10, 7)` | NO | None | NOT NULL | Composite | Vĩ độ WGS84 (ví dụ: `16.0610450`). |
| `longitude` | `NUMERIC(10, 7)` | NO | None | NOT NULL | Composite | Kinh độ WGS84 (ví dụ: `108.2272340`). |
| `geofence_radius_meters` | `INT` | NO | `100` | CHECK (`radius >= 20`) | None | Bán kính mở khóa check-in (Mặc định: 100m). |
| `description` | `TEXT` | NO | None | NOT NULL | None | Bài viết giới thiệu nguồn gốc, kiến trúc, văn hóa. |
| `cover_image_url` | `TEXT` | NO | None | NOT NULL | None | URL ảnh bìa chất lượng cao trên Cloudinary. |
| `xp_reward` | `INT` | NO | `150` | CHECK (`xp >= 50`) | None | Điểm thưởng XP khi check-in thành công. |
| `historical_facts` | `JSONB` | YES | `'{}'` | None | GIN Index | Dữ liệu cấu trúc mở rộng (Giờ mở cửa, Giá vé, Tips). |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | None | None | Thời điểm tạo bản ghi. |

---

### 1.4 Bảng `checkins` (Bảng ghi nhận Check-in thực tế)
* **Mục đích:** Lưu trữ bằng chứng check-in tại địa danh kèm hình ảnh và tọa độ thời gian thực.
* **Khóa chính:** `id` (UUID).
* **Ràng buộc duy nhất:** `UNIQUE(user_id, landmark_id)`.

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất của lượt check-in. |
| `user_id` | `UUID` | NO | None | FOREIGN KEY | Composite UK | Khóa ngoại tham chiếu `users(id)`. |
| `landmark_id` | `UUID` | NO | None | FOREIGN KEY | Composite UK | Khóa ngoại tham chiếu `landmarks(id)`. |
| `latitude` | `NUMERIC(10, 7)` | NO | None | NOT NULL | None | Tọa độ GPS thực tế của điện thoại khi bấm chụp ảnh. |
| `longitude` | `NUMERIC(10, 7)` | NO | None | NOT NULL | None | Tọa độ GPS thực tế của điện thoại khi bấm chụp ảnh. |
| `photo_url` | `TEXT` | NO | None | NOT NULL | None | URL ảnh chụp có Watermark tải lên Cloudinary. |
| `verified_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | None | B-Tree Index | Thời điểm xác thực Geofence thành công. |

---

### 1.5 Bảng `badges` & `user_badges` (Bảng Huy hiệu & Sở hữu)
* **Mục đích:** Quản lý định nghĩa Huy hiệu thành phố và quyền sở hữu danh hiệu của người dùng.

#### Bảng `badges`:
| Tên trường | Kiểu dữ liệu | Nullable | Ràng buộc | Mô tả chi tiết |
|---|---|:---:|---|---|
| `id` | `UUID` | NO | PRIMARY KEY | Định danh huy hiệu. |
| `name` | `VARCHAR(100)` | NO | UNIQUE | Tên danh hiệu (ví dụ: *Da Nang Explorer Badge*). |
| `city` | `VARCHAR(100)` | NO | NOT NULL | Thành phố áp dụng (ví dụ: *Đà Nẵng*). |
| `badge_icon_url` | `TEXT` | NO | NOT NULL | URL icon huy hiệu mạ vàng 3D trên Cloudinary. |
| `required_checkins` | `INT` | NO | Mặc định: `3` | Số địa danh khác nhau cần check-in tại thành phố. |
| `required_quiz_score` | `NUMERIC(5, 2)` | NO | Mặc định: `66.0` | Tỷ lệ điểm quiz tối thiểu cần đạt ($\ge 66\%$). |
| `xp_bonus` | `INT` | NO | Mặc định: `300` | Điểm XP thưởng thêm khi mở khóa thành công. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Thời điểm tạo huy hiệu. |

#### Bảng `user_badges` (Bảng quan hệ N-N giữa User và Badge):
| Tên trường | Kiểu dữ liệu | Nullable | Ràng buộc | Mô tả chi tiết |
|---|---|:---:|---|---|
| `id` | `UUID` | NO | PRIMARY KEY | Định danh chứng nhận. |
| `user_id` | `UUID` | NO | FOREIGN KEY `users(id)` | Khóa ngoại người dùng sở hữu. |
| `badge_id` | `UUID` | NO | FOREIGN KEY `badges(id)` | Khóa ngoại huy hiệu đạt được. |
| `unlocked_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | Thời điểm mở khóa chính thức. |
* **Ràng buộc duy nhất:** `UNIQUE(user_id, badge_id)`.

---

### 1.6 Bảng `quizzes`, `quiz_questions` & `quiz_attempts` (Bảng Trắc nghiệm văn hóa)

#### Bảng `quizzes`:
* `id` UUID PK, `landmark_id` UUID FK `landmarks(id)` (Quan hệ 1-1), `title` VARCHAR(150), `description` TEXT, `created_at` TIMESTAMPTZ.

#### Bảng `quiz_questions`:
* `id` UUID PK, `quiz_id` UUID FK `quizzes(id)`.
* `question_text` TEXT NOT NULL: Nội dung câu hỏi.
* `option_a`, `option_b`, `option_c`, `option_d` VARCHAR(255) NOT NULL: 4 phương án lựa chọn.
* `correct_option` CHAR(1) NOT NULL CHECK (`correct_option IN ('A', 'B', 'C', 'D')`): Đáp án đúng (Ẩn khi thi).
* `explanation` TEXT NOT NULL: Bài học văn hóa giải thích sau khi nộp bài.

#### Bảng `quiz_attempts`:
* `id` UUID PK, `user_id` UUID FK `users(id)`, `quiz_id` UUID FK `quizzes(id)`.
* `score` NUMERIC(5, 2) NOT NULL: Tỷ lệ phần trăm đúng (ví dụ: `100.00`).
* `is_passed` BOOLEAN NOT NULL: Đạt nếu $\ge 66\%$.
* `attempted_at` TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP.

---

### 1.10 Bảng `trip_members` (Bảng thành viên đồng hành chuyến đi)
* **Mục đích:** Quản lý danh sách thành viên tham gia chuyến đi nhóm, vai trò phân quyền (owner/editor/viewer) và trạng thái lời mời.
* **Khóa chính:** `id` (UUID).
* **Khóa ngoại:** `user_id` ➔ `users(id)`, `invited_by` ➔ `users(id)`.
* **Ràng buộc duy nhất:** `UNIQUE(trip_id, user_id)` (Một người dùng chỉ có 1 bản ghi thành viên trong mỗi chuyến đi).

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất bản ghi thành viên. |
| `trip_id` | `VARCHAR(50)` | NO | None | NOT NULL | B-Tree Index | Tham chiếu chéo tới MongoDB `itineraries._id`. |
| `user_id` | `UUID` | NO | None | FOREIGN KEY | B-Tree Index | Tham chiếu người dùng tham gia `users(id)`. |
| `role` | `VARCHAR(20)` | NO | `'editor'` | CHECK (`role IN ('owner', 'editor', 'viewer')`) | None | Vai trò quyền hạn trong chuyến đi. |
| `invitation_status` | `VARCHAR(20)` | NO | `'accepted'` | CHECK (`invitation_status IN ('pending', 'accepted', 'declined')`) | None | Trạng thái tiếp nhận lời mời tham gia. |
| `invited_by` | `UUID` | YES | NULL | FOREIGN KEY | None | Người dùng gửi lời mời `users(id)`. |
| `joined_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | None | Thời điểm chấp nhận tham gia nhóm. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | None | Thời điểm tạo lời mời. |

---

### 1.11 Bảng `trip_expenses` (Bảng sổ chi tiêu nhóm chuyến đi)
* **Mục đích:** Lưu trữ các khoản chi thực tế phát sinh trong chuyến đi nhóm, người chi trả, danh mục, hình ảnh hóa đơn bill (Cloudinary) và phương thức chia tiền.
* **Khóa chính:** `id` (UUID).
* **Khóa ngoại:** `payer_id` ➔ `users(id)`.

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất khoản chi tiêu. |
| `trip_id` | `VARCHAR(50)` | NO | None | NOT NULL | B-Tree Index | Tham chiếu chéo tới MongoDB `itineraries._id`. |
| `payer_id` | `UUID` | NO | None | FOREIGN KEY | B-Tree Index | Người thanh toán khoản chi `users(id)`. |
| `title` | `VARCHAR(150)` | NO | None | NOT NULL | None | Tên hoặc mô tả khoản chi (ví dụ: *Hải Sản Bé Mặn*). |
| `amount` | `NUMERIC(12, 2)` | NO | None | CHECK (`amount > 0`) | None | Tổng giá trị khoản chi (VND). |
| `currency` | `CHAR(3)` | NO | `'VND'` | NOT NULL | None | Đơn vị tiền tệ chuẩn ISO 4217. |
| `category` | `VARCHAR(30)` | NO | `'other'` | CHECK (`category IN ('food', 'stay', 'transport', 'sightseeing', 'shopping', 'other')`) | None | Phân loại danh mục chi tiêu. |
| `receipt_url` | `TEXT` | YES | NULL | None | None | Đường dẫn HTTPS ảnh hóa đơn/bill trên Cloudinary. |
| `split_strategy` | `VARCHAR(20)` | NO | `'equal'` | CHECK (`split_strategy IN ('equal', 'exact', 'percentage', 'shares')`) | None | Chiến lược phân chia tiền trong nhóm. |
| `notes` | `VARCHAR(500)` | YES | NULL | None | None | Ghi chú thêm về khoản chi. |
| `expense_date` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | B-Tree Index | Thời điểm phát sinh chi phí thực tế. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | None | Thời điểm nhập khoản chi vào hệ thống. |
| `updated_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | None | Thời điểm cập nhật khoản chi gần nhất. |

---

### 1.12 Bảng `trip_expense_splits` (Bảng phân chia khoản chi từng thành viên)
* **Mục đích:** Ghi nhận nghĩa vụ tài chính chi tiết của từng thành viên trong nhóm đối với một khoản chi cụ thể.
* **Khóa chính:** `id` (UUID).
* **Khóa ngoại:** `expense_id` ➔ `trip_expenses(id)`, `user_id` ➔ `users(id)`.
* **Ràng buộc duy nhất:** `UNIQUE(expense_id, user_id)` (Mỗi thành viên chỉ có 1 phần chia trên 1 khoản chi).

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất phần chia. |
| `expense_id` | `UUID` | NO | None | FOREIGN KEY CASCADE | B-Tree Index | Tham chiếu tới khoản chi `trip_expenses(id)`. |
| `user_id` | `UUID` | NO | None | FOREIGN KEY RESTRICT | B-Tree Index | Thành viên có nghĩa vụ trả phần này `users(id)`. |
| `split_amount` | `NUMERIC(12, 2)` | NO | None | CHECK (`split_amount >= 0`) | None | Số tiền phần chia của thành viên này (VND). |
| `is_settled` | `BOOLEAN` | NO | `false` | NOT NULL | None | Đã quyết toán xong phần chi này chưa. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | None | Thời điểm tạo bản ghi phân chia. |

---

### 1.13 Bảng `trip_settlements` (Bảng quyết toán công nợ giữa các thành viên)
* **Mục đích:** Lưu trữ các giao dịch hoàn trả nợ trực tiếp (Settlement Transactions) giữa con nợ (Debtor) và chủ nợ (Creditor) theo thuật toán Greedy Min-Cashflow.
* **Khóa chính:** `id` (UUID).
* **Khóa ngoại:** `debtor_id` ➔ `users(id)`, `creditor_id` ➔ `users(id)`.
* **Ràng buộc:** CHECK (`debtor_id <> creditor_id`).

| Tên trường | Kiểu dữ liệu | Nullable | Mặc định | Ràng buộc | Chỉ mục (Index) | Mô tả chi tiết |
|---|---|:---:|---|---|:---:|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PRIMARY KEY | PK Index | Định danh duy nhất giao dịch quyết toán. |
| `trip_id` | `VARCHAR(50)` | NO | None | NOT NULL | B-Tree Index | Tham chiếu chéo tới MongoDB `itineraries._id`. |
| `debtor_id` | `UUID` | NO | None | FOREIGN KEY RESTRICT | B-Tree Index | Thành viên nợ tiền cần thanh toán `users(id)`. |
| `creditor_id` | `UUID` | NO | None | FOREIGN KEY RESTRICT | B-Tree Index | Thành viên nhận lại tiền `users(id)`. |
| `amount` | `NUMERIC(12, 2)` | NO | None | CHECK (`amount > 0`) | None | Số tiền chuyển khoản quyết toán (VND). |
| `currency` | `CHAR(3)` | NO | `'VND'` | NOT NULL | None | Đơn vị tiền tệ. |
| `status` | `VARCHAR(20)` | NO | `'pending'` | CHECK (`status IN ('pending', 'confirmed', 'rejected')`) | None | Trạng thái chuyển khoản: chờ duyệt, đã xác nhận, từ chối. |
| `proof_image_url` | `TEXT` | YES | NULL | None | None | Đường dẫn HTTPS ảnh bill/ủy nhiệm chi chuyển khoản ngân hàng. |
| `settled_at` | `TIMESTAMPTZ` | YES | NULL | None | None | Thời điểm chủ nợ xác nhận đã nhận đủ tiền. |
| `created_at` | `TIMESTAMPTZ` | NO | `CURRENT_TIMESTAMP` | NOT NULL | None | Thời điểm ghi nhận giao dịch thanh toán. |

---

## 2. TỪ ĐIỂN DỮ LIỆU MONGODB (DOCUMENT COLLECTIONS)

---

### 2.1 Collection `itineraries` (Lịch trình chuyến đi nhiều ngày)

```typescript
interface ItineraryDocument {
  _id: ObjectId;                     // Khóa chính MongoDB
  userId: string;                    // UUID String tham chiếu PostgreSQL users(id) [Indexed]
  title: string;                     // "Đà Nẵng - Hội An 3N2Đ Siêu Tiết Kiệm"
  city: string;                      // "Đà Nẵng" [Indexed]
  country: string;                   // "Việt Nam"
  startDate: Date;                   // 2026-11-15T00:00:00.000Z
  endDate: Date;                     // 2026-11-17T00:00:00.000Z
  budgetEstimate: number;            // 3500000 (VND)
  isPublic: boolean;                 // true/false [Indexed]
  cloneCount: number;                // 14 (Số lượt nhân bản)
  collaborators: Array<{             // Danh sách bạn bè cùng tham gia và xem chung chuyến đi
    userId: string;                  // UUID String tham chiếu PostgreSQL users(id) [Indexed]
    role: "owner" | "editor" | "viewer"; // Phân quyền chỉnh sửa hoặc chỉ xem
    joinedAt: Date;                  // Thời điểm tham gia chuyến đi
    status: "pending" | "accepted" | "declined"; // Trạng thái chấp thuận
  }>;
  days: Array<{                      // Mảng phân cấp các ngày trong chuyến đi
    dayNumber: number;               // 1, 2, 3...
    date: Date;                      // Ngày cụ thể
    items: Array<{                   // Danh sách hoạt động tham quan trong ngày
      itemType: "landmark" | "hotel" | "flight" | "restaurant" | "custom";
      destinationName: string;       // "Cầu Rồng Đà Nẵng"
      latitude: number;              // 16.061045
      longitude: number;             // 108.227234
      orderIndex: number;            // 1, 2, 3... (Dùng cho Drag-and-Drop)
      arrivalTime: string;           // "08:30"
      estimatedDurationMinutes: number; // 90
      estimatedCost: number;         // 50000 (VND)
      note: string;                  // "Xem cầu phun lửa vào tối thứ 7"
    }>;
  }>;
  createdAt: Date;                   // Timestamp tạo
  updatedAt: Date;                   // Timestamp cập nhật
}
```

* **Chỉ mục (MongoDB Compound Indexes):**
  * `db.itineraries.createIndex({ userId: 1, createdAt: -1 })`
  * `db.itineraries.createIndex({ "collaborators.userId": 1 })`
  * `db.itineraries.createIndex({ city: 1, isPublic: 1, cloneCount: -1 })`

---

### 2.2 Collection `forum_questions` & `forum_answers` (Diễn đàn Q&A)

#### Collection `forum_questions`:
```typescript
interface ForumQuestionDocument {
  _id: ObjectId;
  userId: string;                    // UUID String tham chiếu users(id) [Indexed]
  authorName: string;                // "Nguyễn Văn Đức"
  authorAvatar: string;              // URL Cloudinary
  country: string;                   // "Việt Nam"
  city: string;                      // "Đà Nẵng" [Indexed]
  title: string;                     // "Ăn hải sản ở đâu ngon bổ rẻ tại Đà Nẵng?"
  content: string;                   // Nội dung chi tiết câu hỏi
  tags: string[];                    // ["Food", "Seafood", "Budget"]
  upvotes: number;                   // 18
  answerCount: number;               // 5
  isResolved: boolean;               // false
  createdAt: Date;                   // [Indexed]
  updatedAt: Date;
}
```

#### Collection `forum_answers`:
```typescript
interface ForumAnswerDocument {
  _id: ObjectId;
  questionId: ObjectId;              // Ref forum_questions(_id) [Indexed]
  userId: string;                    // UUID String tham chiếu users(id)
  authorName: string;                // "Trần Văn A"
  authorAvatar: string;              // URL Cloudinary
  hasCityBadge: boolean;             // true
  isCityVerified: boolean;           // true [Indexed - Dùng để Sort ưu tiên]
  verifiedBadgeTitle: string;        // "Da Nang Explorer"
  content: string;                   // Nội dung tư vấn kinh nghiệm thực tế
  upvotes: number;                   // 24
  comments: Array<{                  // Bình luận thảo luận lồng nhau
    _id: ObjectId;
    userId: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
}
```

* **Chỉ mục truy vấn ưu tiên (Prioritized Sorting Index):**
  * `db.forum_answers.createIndex({ questionId: 1, isCityVerified: -1, upvotes: -1 })`
