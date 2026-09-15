# 01. Clean Layered System Architecture & Data Separation

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** IEEE 1471 / ISO/IEC 42010 Architecture Description  
**Phase:** Day 4 — System Architecture Design  
**Milestone:** `D4 - System Architecture` / `W1 - Requirements & Analysis`  

---

## 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG (HIGH-LEVEL ARCHITECTURE)

Hệ thống **Nomadix** được thiết kế theo mô hình **Kiến trúc phân tầng sạch (Clean Layered Architecture)** kết hợp kiến trúc đa cơ sở dữ liệu (Polyglot Persistence), đảm bảo tính module hóa cao, dễ bảo trì và mở rộng:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   NOMADIX LAYERED ARCHITECTURE                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. PRESENTATION LAYER (React Native Mobile Client - iOS & Android)    │
│    ├── UI Components (Atomic Design System)                            │
│    ├── Screen Navigation (Stack & Bottom Tabs)                         │
│    ├── State Management (AuthContext, TripContext, ThemeContext)       │
│    └── Native Hardware Services (Camera, GPS Geolocation, MapView)     │
├────────────────────────────────────────────────────────────────────────┤
│ 2. API GATEWAY & SECURITY MIDDLEWARE LAYER                             │
│    ├── HTTP Request Routing (Express Router v1)                        │
│    ├── Security Guards (Helmet, CORS, Rate Limit)                      │
│    ├── Authentication & Authorization (JWT Verify, RBAC restrictTo)    │
│    ├── Payload Validation (Joi / Zod Schemas)                          │
│    └── Global Error Handler & Logging (Winston, Morgan)                │
├────────────────────────────────────────────────────────────────────────┤
│ 3. BUSINESS LOGIC & SERVICE LAYER                                      │
│    ├── Auth & Profile Service                                          │
│    ├── Booking Aggregator Service & Normalization Adapters             │
│    ├── Collaborative Itinerary & Companion Sync Service                │
│    ├── Group Expense & Bill Splitting Service                          │
│    ├── Debt Simplification Algorithm Engine (Greedy Cashflow)          │
│    ├── Gamification Geofence & Cultural Quiz Engine                    │
│    ├── Badge Evaluator & Level Progression Engine                      │
│    └── Community Q&A & "City Verified" Credibility Engine              │
├────────────────────────────────────────────────────────────────────────┤
│ 4. INTEGRATION & ADAPTER LAYER (3RD-PARTY SERVICES)                    │
│    ├── Amadeus Travel API Adapter                                      │
│    ├── RapidAPI Travel Adapter                                         │
│    ├── Fallback Mock Data Provider Engine                              │
│    ├── Google Maps & Distance Matrix API Client                        │
│    └── Cloudinary Media Optimization Client (Watermarks & Receipts)    │
├────────────────────────────────────────────────────────────────────────┤
│ 5. DATA PERSISTENCE & CACHING LAYER (POLYGLOT PERSISTENCE)             │
│    ├── PostgreSQL (ACID: Users, Badges, Quizzes, Expenses & Splits)    │
│    ├── MongoDB Atlas (Document Store: Itineraries & Collaborators, Q&A)│
│    └── Redis (In-Memory Key-Value: Search Queries & Rate Limits)       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CHI TIẾT CÁC TẦNG KIẾN TRÚC (LAYER SPECIFICATIONS)

### 2.1 Tầng Trình Diễn (Presentation Layer — React Native)
* **Công nghệ:** React Native (JavaScript) với JavaScript Engine **Hermes**.
* **Đặc tính:**
  * Xây dựng ứng dụng đa nền tảng (iOS & Android) dùng chung một cơ sở mã nguồn.
  * Tích hợp sâu phần cứng thiết bị: GPS Định vị chính xác cao (`react-native-geolocation-service`), Máy ảnh trực tiếp (`react-native-vision-camera`), Bản đồ tương tác (`react-native-maps`).
  * Tối ưu hóa bộ nhớ tạm hình ảnh với `react-native-fast-image`.

---

### 2.2 Tầng API Gateway & Middleware Bảo Mật (API Gateway & Security Layer)
* **Công nghệ:** Node.js + Express.js.
* **Nhiệm vụ:**
  * **Routing v1:** Điều hướng các yêu cầu HTTP tới đúng Controller tương ứng (`/api/v1/...`).
  * **Xác thực JWT:** Giải mã token trong Header `Authorization: Bearer <token>`, nạp thông tin người dùng vào `req.user`.
  * **Phân quyền RBAC:** Chặn các truy cập trái phép vào tài nguyên của Quản trị viên (`admin`).
  * **Lọc dữ liệu đầu vào:** Kiểm tra định dạng schema bằng Joi, khử trùng dữ liệu đầu vào chống NoSQL Injection và XSS.
  * **Rate Limiting:** Giới hạn 100 requests / 15 phút cho mỗi IP để chống tấn công từ chối dịch vụ (DDoS).

---

### 2.3 Tầng Nghiệp Vụ Cốt Lõi (Business Logic & Service Layer)
* **Nguyên tắc thiết kế:** Độc lập hoàn toàn với giao thức HTTP (Không nhận `req`, `res`), chỉ nhận dữ liệu đầu vào thuần túy (Plain JavaScript Objects) và trả về kết quả hoặc ném lỗi nghiệp vụ (`AppError`).
* **Các dịch vụ chính:**
  * `AuthService`: Xử lý băm mật khẩu Bcrypt, cấp phát token JWT.
  * `BookingAggregatorService`: Điều phối gọi đa nguồn API song song và điều phối Normalizer.
  * `ItineraryService`: Quản lý cấu trúc lịch trình nhiều ngày và tính toán lộ trình di chuyển.
  * `TripCollaborationService`: Xử lý mời bạn bè, phân quyền vai trò (`owner`, `editor`, `viewer`), và đồng bộ trạng thái kế hoạch nhóm.
  * `GroupExpenseService`: Quản lý lưu trữ hóa đơn, ghi nhận chi tiêu đa danh mục, tính toán bảng số dư ròng ($\sum \text{balances} = 0$).
  * `DebtSimplificationEngine`: Thuật toán Greedy tối ưu hóa dòng tiền, giảm số giao dịch chuyển khoản giữa các thành viên.
  * `GamificationService`: Tính toán khoảng cách Geofence Haversine, chấm điểm Quiz, tính điểm XP và mở khóa Badge.
  * `CommunityService`: Kiểm tra quyền sở hữu Huy hiệu và tự động gán nhãn "City Verified".

---

### 2.4 Tầng Tích Hợp Đa Nguồn (Adapter & Integration Layer)
* **Áp dụng Design Pattern:** **Adapter Pattern** và **Strategy Pattern**.
* **Nhiệm vụ:**
  * Đóng gói toàn bộ các giao tiếp mạng với bên ngoài (Amadeus, RapidAPI, Google Maps, Cloudinary).
  * Chuyển đổi các định dạng dữ liệu thô (Raw JSON) khác biệt về các mô hình thống nhất (`UnifiedFlight`, `UnifiedHotel`).
  * Tự động kích hoạt cơ chế dự phòng `MockProvider` khi API đối tác bị gián đoạn.

---

### 2.5 Tầng Lưu Trữ Đa Dạng (Polyglot Persistence Layer)

Hệ thống phân chia ranh giới lưu trữ dữ liệu rạch ròi thành 3 khối chuyên biệt:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   POLYGLOT DATA PERSISTENCE BOUNDARY                   │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ Hệ Cơ sở dữ liệu  │ Loại dữ liệu      │ Các thực thể / Bảng lưu trữ    │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 1. PostgreSQL     │ Relational (ACID) │ users, roles, landmarks,       │
│    (Port 5432)    │ Chuẩn hóa 3NF     │ checkins, badges, user_badges, │
│                   │ Khóa ngoại cứng   │ quizzes, quiz_questions        │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 2. MongoDB Atlas  │ Document Store    │ itineraries (Nested Days/Items)│
│    (Port 27017)   │ Dynamic JSON      │ forum_questions, forum_answers,│
│                   │ Khóa ngoại UUID   │ comments, reports              │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 3. Redis In-Memory│ Key-Value RAM     │ cache:flights:*, cache:hotels:*│
│    (Port 6379)    │ TTL ngắn hạn      │ rate_limit:*                   │
└───────────────────┴───────────────────┴────────────────────────────────┘
```

---

## 3. CƠ CHẾ ĐỒNG BỘ DỮ LIỆU LIÊN CƠ SỞ DỮ LIỆU (CROSS-DATABASE SYNC)

Để giải quyết triệt để rủi ro mất nhất quán dữ liệu giữa PostgreSQL và MongoDB (Điểm nhấn học thuật trong Luận văn):

1. **Chuẩn hóa khóa tham chiếu:** Mọi tài liệu trong MongoDB lưu trữ trường `userId` dưới dạng chuỗi String đại diện cho UUID trong PostgreSQL.
2. **Luồng xác thực Uy tín (City Verified Flow):**
   ```text
   Client gửi Answer lên MongoDB
              │
              ▼
   Backend đọc userId và City
              │
              ▼
   Truy vấn PostgreSQL (user_badges JOIN badges)
              │
         ┌────┴────┐
     Có Badge   Không có
         │         │
         ▼         ▼
     isCityVerified: true / false
         │
         ▼
   Lưu bản ghi vào MongoDB ForumAnswer
   ```
3. **Cơ chế Soft-Delete:** Khi tài khoản bị vô hiệu hóa trong PostgreSQL, Service tự động phát tín hiệu chuyển cờ `isArchived = true` trên các tài liệu liên quan bên MongoDB.
