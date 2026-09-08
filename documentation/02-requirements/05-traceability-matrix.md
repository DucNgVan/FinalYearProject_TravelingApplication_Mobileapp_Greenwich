# 05. Requirements Traceability Matrix (RTM)

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** IEEE 830 / ISO/IEC/IEEE 29148 Traceability Standard  
**Phase:** Day 2 — Requirements Definition  

---

## 1. MỤC ĐÍCH CỦA MA TRẬN TRUY XUẤT NGUỒN GỐC (RTM PURPOSE)

Ma trận truy xuất nguồn gốc yêu cầu (Requirements Traceability Matrix - RTM) là tài liệu học thuật then chốt kết nối toàn bộ vòng đời phát triển của **Nomadix**:

$$\text{Mục tiêu Đồ án (Obj)} \longleftrightarrow \text{User Stories (US)} \longleftrightarrow \text{Functional Req (FR)} \longleftrightarrow \text{API \& Database} \longleftrightarrow \text{Kịch bản Test (TC)} \longleftrightarrow \text{Tuần triển khai}$$

Bảng ma trận này giúp Giảng viên hướng dẫn (Supervisor) và Hội đồng chấm đồ án dễ dàng kiểm tra xem mọi mục tiêu nghiên cứu có được chuyển đổi thành mã nguồn và kiểm thử đầy đủ hay không.

---

## 2. BẢNG MA TRẬN TRUY XUẤT TOÀN DIỆN (FULL TRACEABILITY MATRIX)

| Mục tiêu FYP | User Story | Yêu cầu FR / NFR | Thành phần DB / Cache | API Endpoint liên quan | Kịch bản Acceptance | Tuần thực hiện |
|---|---|---|---|---|---|:---:|
| **OBJ-1:** Xác thực & Hồ sơ | `US-01`, `US-02` | `FR-01`, `FR-02`, `NFR-02` | PostgreSQL: `users`, `roles` | `POST /api/v1/auth/register`<br>`POST /api/v1/auth/login` | Scenario 1, 2 | **Week 06** |
| **OBJ-1:** Quản lý Hồ sơ | `US-03`, `US-04` | `FR-03`, `FR-04`, `FR-05` | PostgreSQL: `users`<br>Cloudinary: Avatars | `GET /api/v1/users/me`<br>`PUT /api/v1/users/profile`<br>`POST /api/v1/users/avatar` | Scenario 1 | **Week 07** |
| **OBJ-2:** Tìm kiếm chuyến bay | `US-05`, `US-07` | `FR-06`, `FR-08`, `FR-09`, `FR-10` | Amadeus SDK<br>RapidAPI<br>Mock Data | `GET /api/v1/flights/search` | Scenario 3 | **Week 09, 10** |
| **OBJ-2:** Tìm kiếm khách sạn | `US-06`, `US-07` | `FR-07`, `FR-08`, `FR-09`, `FR-10` | RapidAPI / Amadeus<br>Mock Data | `GET /api/v1/hotels/search` | Scenario 3 | **Week 09, 10** |
| **OBJ-2:** Tối ưu hóa Cache | `US-08` | `FR-11`, `NFR-01`, `NFR-08` | Redis RAM (TTL 1800s/3600s) | Headers: `X-Cache-Status`<br>`X-Response-Time-Ms` | Scenario 4 | **Week 11, 19** |
| **OBJ-2:** Đặt vé ngoại vi | `US-09` | `FR-12`, `NFR-04` | In-App Browser (Deep Link) | Client-side Linking | Scenario 3 | **Week 10** |
| **OBJ-3:** Lập lịch trình đa ngày | `US-10` | `FR-13`, `FR-14`, `NFR-05` | MongoDB: `itineraries` | `POST /api/v1/itineraries`<br>`GET /api/v1/itineraries/me` | Scenario 5 | **Week 12** |
| **OBJ-3:** Kéo-thả đổi thứ tự | `US-11` | `FR-15`, `NFR-04` | MongoDB: `days.items.orderIndex` | `PUT /api/v1/itineraries/:id` | Scenario 6 | **Week 12** |
| **OBJ-3:** Bản đồ & Định tuyến | `US-12` | `FR-16`, `FR-17`, `NFR-03` | Google Maps SDK<br>Distance Matrix API | Google Directions API<br>`/api/v1/maps/distance` | Scenario 5, 6 | **Week 12** |
| **OBJ-3:** Chia sẻ & Nhân bản | `US-13`, `US-14` | `FR-18` | MongoDB: `isPublic`, `cloneCount` | `POST /api/v1/itineraries/:id/clone` | Scenario 7 | **Week 12** |
| **OBJ-4:** Khám phá địa danh | `US-15` | `FR-19` | PostgreSQL: `landmarks` | `GET /api/v1/landmarks` | Scenario 8 | **Week 13** |
| **OBJ-4:** Xác thực GPS Geofence | `US-16` | `FR-20`, `NFR-02` | PostgreSQL: `geofence_radius`<br>Haversine Formula | `POST /api/v1/checkins/validate` | Scenario 8, 9 | **Week 13** |
| **OBJ-4:** Máy ảnh & Tải ảnh | `US-17` | `FR-21`, `FR-22` | PostgreSQL: `checkins`<br>Cloudinary Check-in Store | `POST /api/v1/checkins` | Scenario 8, 10 | **Week 14** |
| **OBJ-4:** Trắc nghiệm văn hóa | `US-18` | `FR-23`, `FR-24` | PostgreSQL: `quizzes`, `quiz_questions`, `quiz_attempts` | `GET /api/v1/quizzes/:landmarkId`<br>`POST /api/v1/quizzes/submit` | Scenario 10 | **Week 15** |
| **OBJ-4:** XP & Thăng cấp Level | `US-19` | `FR-24` | PostgreSQL: `users.xp`, `users.level` | `gamificationHelper.js` | Scenario 10 | **Week 07, 15** |
| **OBJ-4:** Mở khóa Huy hiệu (USP) | `US-20` | `FR-25` | PostgreSQL: `badges`, `user_badges` | `badgeEvaluator.service.js` | Scenario 11 | **Week 15** |
| **OBJ-5:** Diễn đàn hỏi đáp | `US-21`, `US-22` | `FR-26`, `FR-27` | MongoDB: `forum_questions` | `GET /api/v1/community/questions`<br>`POST /api/v1/community/questions` | Scenario 12, 13 | **Week 16** |
| **OBJ-5:** Gắn nhãn City Verified | `US-23`, `US-24` | `FR-29`, `FR-30` | Cross-DB Join:<br>Postgres `user_badges` ➔ Mongo `forum_answers` | `POST /api/v1/community/questions/:id/answers` | Scenario 12, 13 | **Week 16** |
| **OBJ-5:** Tương tác cộng đồng | `US-25` | `FR-28` | MongoDB: `forum_answers.upvotes` | `POST /api/v1/community/answers/:id/upvote` | Scenario 12 | **Week 16** |
| **OBJ-6:** Phân quyền quản trị | `US-26`, `US-27` | `FR-31`, `FR-32`, `FR-33` | PostgreSQL: `roles`, `landmarks`, `quizzes` | `POST /api/v1/admin/landmarks`<br>`POST /api/v1/admin/quizzes` | Admin Tests | **Week 06, 19** |
| **OBJ-6:** Kiểm duyệt vi phạm | `US-28` | `FR-34` | MongoDB: `reports` | `POST /api/v1/community/report`<br>`GET /api/v1/admin/reports` | Admin Tests | **Week 16, 19** |
| **OBJ-7:** Khả năng tự phục hồi | Hệ thống | `FR-35`, `NFR-03` | Mock Data Fallback Engine | `GET /api/v1/health` | Scenario 14 | **Week 09, 19** |
| **OBJ-8:** Đồng hành & Kế hoạch nhóm | `US-29`, `US-30`, `US-31` | `FR-36`, `FR-37`, `NFR-05` | PostgreSQL: `trip_members`<br>MongoDB: `collaborators` | `POST /api/v1/itineraries/:id/members`<br>`GET /api/v1/itineraries/:id/sync` | Scenario 15 | **Week 12** |
| **OBJ-9:** Hóa đơn & Chia tiền nhóm | `US-32`, `US-33` | `FR-38`, `FR-39`, `FR-40` | PostgreSQL: `trip_expenses`, `trip_expense_splits`<br>Cloudinary: Receipts | `POST /api/v1/trips/:id/expenses`<br>`POST /api/v1/trips/:id/expenses/receipt` | Scenario 16 | **Week 13** |
| **OBJ-9:** Cân đối tài chính & Quyết toán nợ | `US-34`, `US-35` | `FR-41`, `FR-42`, `NFR-02` | PostgreSQL: `trip_settlements`<br>Greedy Debt Simplifier | `GET /api/v1/trips/:id/expenses/summary`<br>`POST /api/v1/trips/:id/settlements` | Scenario 17 | **Week 13** |

---

## 3. ĐỐI SOÁT VỚI TIÊU CHÍ ĐÁNH GIÁ LUẬN VĂN (THESIS ALIGNMENT)

1. **Tính hoàn thiện (Completeness):** 100% các tính năng trong phạm vi MVP đã có mã FR, User Story và kịch bản Test tương ứng.
2. **Tính kiểm chứng được (Verifiability):** Mọi yêu cầu đều có tiêu chí chấp nhận định lượng (Ví dụ: Geofence $\le 100\text{m}$, Cache hit $\le 50\text{ms}$, SUS $\ge 80.0$).
3. **Tính liên tục (Continuity):** Ma trận RTM là sợi chỉ đỏ xuyên suốt từ Day 1 (Foundation) đến Day 140 (Bảo vệ đồ án).
