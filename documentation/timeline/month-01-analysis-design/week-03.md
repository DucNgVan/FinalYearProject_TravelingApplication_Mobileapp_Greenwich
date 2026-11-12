# WEEK 03 — DATABASE ARCHITECTURE & API DESIGN

## Tháng 1: Analysis & System Design
**Milestone:** `W3 - Database & API Design`  
**Thời gian:** Ngày 15 – Ngày 21 (07/09/2026 – 13/09/2026)  
**Nhánh chính:** `design/database-and-api` (tách từ `develop`)  
**Mục tiêu tuần:** Thiết kế chi tiết lược đồ cơ sở dữ liệu PostgreSQL (ERD vật lý), mô hình MongoDB, chiến lược Caching Redis và tài liệu đặc tả API chuẩn OpenAPI/Swagger.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 15: POSTGRESQL PHYSICAL SCHEMA & RELATIONAL ERD (07/09/2026)
* **Mục tiêu:** Xây dựng lược đồ vật lý chuẩn hóa 3NF cho PostgreSQL, định nghĩa bảng, kiểu dữ liệu, ràng buộc khóa chính/khóa ngoại và chỉ mục (Indexes).
* **Nhiệm vụ cụ thể:**
  1. Thiết kế các bảng phân quyền & người dùng:
     * `roles` (`id`, `name`, `description`).
     * `users` (`id` UUID, `email`, `password_hash`, `full_name`, `avatar_url`, `bio`, `role_id`, `xp`, `level`, `created_at`, `updated_at`).
  2. Thiết kế các bảng Gamification & Khám phá:
     * `landmarks` (`id`, `name`, `city`, `country`, `latitude`, `longitude`, `geofence_radius_meters`, `description`, `image_url`, `xp_reward`).
     * `checkins` (`id`, `user_id`, `landmark_id`, `latitude`, `longitude`, `photo_url`, `verified_at`).
     * `badges` (`id`, `name`, `city`, `badge_icon_url`, `required_checkins`, `required_quiz_score`, `xp_bonus`).
     * `user_badges` (`id`, `user_id`, `badge_id`, `unlocked_at`).
  3. Thiết kế các bảng Cultural Quiz:
     * `quizzes` (`id`, `landmark_id`, `title`, `description`).
     * `quiz_questions` (`id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`, `explanation`).
     * `quiz_attempts` (`id`, `user_id`, `quiz_id`, `score`, `is_passed`, `attempted_at`).
  4. Đánh chỉ mục hiệu năng (Composite Indexes, Geolocation spatial indexes).
* **Sản phẩm đầu ra:**
  * File SQL Schema DDL: `documentation/08-database-design/postgresql-schema.sql`.
  * Sơ đồ Physical ERD Diagram (`.png` / Mermaid).
* **Git Commit:** `docs: design physical postgresql schema and relational ERD`
* **DoD:** Toàn bộ khóa ngoại, ràng buộc NOT NULL, UNIQUE, CHECK constraint và Indexes được khai báo chi tiết.

---

### 🔹 DAY 16: MONGODB COLLECTIONS & DOCUMENT SCHEMAS (08/09/2026)
* **Mục tiêu:** Thiết kế cấu trúc tài liệu JSON linh hoạt cho MongoDB nhằm lưu trữ lịch trình chuyến đi và diễn đàn cộng đồng.
* **Nhiệm vụ cụ thể:**
  1. Thiết kế `Itinerary` Document Schema:
     * `_id`, `userId` (String UUID), `title`, `city`, `country`, `startDate`, `endDate`, `budgetEstimate`, `isPublic`, `cloneCount`, `days: [{ dayNumber, date, items: [{ itemType, destinationName, latitude, longitude, orderIndex, arrivalTime, estimatedDurationMinutes, note }] }]`.
  2. Thiết kế `ForumQuestion` Document Schema:
     * `_id`, `userId`, `authorName`, `authorAvatar`, `country`, `city`, `title`, `content`, `tags: []`, `upvotes`, `answerCount`, `isResolved`, `createdAt`.
  3. Thiết kế `ForumAnswer` & `Comment` Document Schema:
     * `_id`, `questionId`, `userId`, `authorName`, `authorAvatar`, `hasCityBadge` (Boolean), `isCityVerified` (Boolean), `content`, `upvotes`, `comments: [{ userId, authorName, content, createdAt }]`, `createdAt`.
  4. Thiết kế Compound Indexes cho việc tìm kiếm theo `city` + `createdAt`.
* **Sản phẩm đầu ra:**
  * Schema definition: `documentation/08-database-design/mongodb-schemas.json`.
* **Git Commit:** `docs: design mongodb document schemas for itineraries and community`
* **DoD:** Mongoose schema syntax chuẩn xác, mô hình hóa cấu trúc mảng lồng nhau (Embedded documents) hợp lý.

---

### 🔹 DAY 17: DUAL-DATABASE SYNC & INTEGRITY STRATEGY (09/09/2026)
* **Mục tiêu:** Xây dựng giải pháp giải quyết rủi ro mất nhất quán dữ liệu giữa PostgreSQL và MongoDB (Architectural highlight cho Thesis).
* **Nhiệm vụ cụ thể:**
  1. Định nghĩa chuẩn khóa tham chiếu: `userId` (UUID sinh bởi PostgreSQL) được lưu đồng nhất dưới dạng String trong toàn bộ tài liệu MongoDB.
  2. Thiết kế cơ chế đảm bảo tính toàn vẹn khi User cập nhật Profile (Tên/Avatar):
     * *Phương án 1 (Live Reference):* API Backend tự động join/lookup dữ liệu Profile từ PostgreSQL khi trả về Forum Posts.
     * *Phương án 2 (Eventual Consistency):* Cập nhật bất đồng bộ qua Service Layer.
  3. Thiết kế cơ chế xóa mềm (Soft Delete): Khi User bị vô hiệu hóa trong PostgreSQL, các bài đăng bên MongoDB được chuyển cờ `isArchived = true`.
* **Sản phẩm đầu ra:**
  * Tài liệu `documentation/08-database-design/03-dual-database-integration-strategy.md`.
* **Git Commit:** `docs: establish dual-database synchronization and integrity pattern`
* **DoD:** Luồng dữ liệu qua lại giữa PostgreSQL và MongoDB được mô hình hóa bằng Sequence Diagram.

---

### 🔹 DAY 18: REDIS CACHE ARCHITECTURE & KEY TAXONOMY (10/09/2026)
* **Mục tiêu:** Thiết kế chiến lược lưu bộ nhớ tạm (Cache-Aside Pattern) cho các truy vấn chuyến bay và khách sạn để giảm tải API và phục vụ bài toán Benchmark ở Month 5.
* **Nhiệm vụ cụ thể:**
  1. Thiết kế quy tắc đặt tên Khóa Cache (Key Taxonomy):
     * Flight Cache Key: `cache:flights:${origin}:${destination}:${departureDate}:${returnDate}:${passengers}:${cabinClass}`
     * Hotel Cache Key: `cache:hotels:${destinationCity}:${checkInDate}:${checkOutDate}:${guests}:${rooms}`
     * Popular Landmarks: `cache:landmarks:${city}`
  2. Thiết lập thời gian sống (TTL - Time to Live):
     * Flight Search Results: TTL = $1800\text{s}$ (30 phút).
     * Hotel Search Results: TTL = $3600\text{s}$ (60 phút).
     * Landmark Static Data: TTL = $86400\text{s}$ (24 giờ).
  3. Thiết kế luồng xử lý Cache-Aside (Check Cache ➔ Hit: Return ➔ Miss: Fetch API ➔ Normalize ➔ Save Cache ➔ Return).
* **Sản phẩm đầu ra:**
  * Tài liệu `documentation/08-database-design/04-redis-caching-strategy.md`.
* **Git Commit:** `docs: design redis cache key architecture and ttl strategy`
* **DoD:** Sơ đồ luồng Caching hoàn chỉnh kèm công thức tính toán tài nguyên bộ nhớ RAM.

---

### 🔹 DAY 19: RESTFUL API SPECIFICATION (OPENAPI / SWAGGER) (11/09/2026)
* **Mục tiêu:** Viết đặc tả toàn diện cho tất cả các API Endpoints của hệ thống theo chuẩn OpenAPI 3.0 / Swagger.
* **Nhiệm vụ cụ thể:**
  1. Module Auth & User: `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/users/me`, `PUT /api/v1/users/profile`.
  2. Module Booking Search: `GET /api/v1/flights/search`, `GET /api/v1/hotels/search`.
  3. Module Itinerary: `POST /api/v1/itineraries`, `GET /api/v1/itineraries/me`, `GET /api/v1/itineraries/:id`, `PUT /api/v1/itineraries/:id`, `POST /api/v1/itineraries/:id/clone`.
  4. Module Gamification: `GET /api/v1/landmarks`, `POST /api/v1/checkins/validate`, `POST /api/v1/checkins`, `GET /api/v1/quizzes/:landmarkId`, `POST /api/v1/quizzes/submit`.
  5. Module Community: `GET /api/v1/community/questions`, `POST /api/v1/community/questions`, `POST /api/v1/community/questions/:id/answers`.
* **Sản phẩm đầu ra:**
  * File đặc tả API: `documentation/09-api-design/openapi-spec.yaml` (hoặc `swagger.json`).
* **Git Commit:** `docs: specify restful api contracts using openapi 3.0`
* **DoD:** 100% endpoints có mô tả Headers, Query params, Request Body, Response 200, 400, 401, 404, 500.

---

### 🔹 DAY 20: POSTMAN COLLECTION & MOCK API SETUP (12/09/2026)
* **Mục tiêu:** Tạo bộ Postman Collection hoàn chỉnh có biến môi trường (Environment Variables) để phục vụ kiểm thử API độc lập.
* **Nhiệm vụ cụ thể:**
  1. Tạo Postman Workspace: *Nomadix FYP API Collection*.
  2. Cấu hình biến môi trường: `{{baseUrl}}`, `{{authToken}}`, `{{testLandmarkId}}`, `{{testCity}}`.
  3. Thêm các kịch bản kiểm thử tự động (Pre-request Script & Tests) để tự động lưu JWT token sau khi Login.
  4. Cấu hình Postman Mock Server mô phỏng phản hồi từ API.
* **Sản phẩm đầu ra:**
  * `documentation/09-api-design/Nomadix_API.postman_collection.json`.
  * `documentation/09-api-design/Nomadix_Env.postman_environment.json`.
* **Git Commit:** `docs: configure postman collection and mock server environment`
* **DoD:** Bộ collection chạy tự động (Runner) kiểm thử được các luồng cơ bản.

---

### 🔹 DAY 21: WEEK 3 REVIEW & THESIS CHAPTER 4 DRAFTING (13/09/2026)
* **Mục tiêu:** Tổng kết toàn bộ thiết kế Database & API, hoàn thành bản nháp Chapter 4 (System Design) cho Thesis và lập báo cáo tuần.
* **Nhiệm vụ cụ thể:**
  1. Rà soát lại tính tương thích giữa Frontend Screens (Week 2) và API Endpoints (Week 3).
  2. Soạn thảo bản nháp Chapter 4 của Luận văn: Kiến trúc hệ thống, Lược đồ ERD, MongoDB Schema, Chiến lược Caching, Thiết kế API.
  3. Viết tài liệu tổng kết tuần `W3-Review-Summary.md` và gửi cập nhật cho Giảng viên hướng dẫn.
  4. Đóng Milestone `W3 - Database & API Design` trên GitHub.
* **Sản phẩm đầu ra:**
  * Báo cáo tuần `week-03-review.md`.
  * Bản nháp Chapter 4 Thesis Report.
* **Git Commit:** `docs: complete week 3 database and api design review`
* **DoD:** Toàn bộ blueprint kỹ thuật đã sẵn sàng để chuyển sang Week 4 (Project Setup).
