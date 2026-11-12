# WEEK 01 — PROJECT FOUNDATION & REQUIREMENTS ANALYSIS

## Tháng 1: Analysis & System Design
**Milestone:** `W1 - Requirements & Analysis`  
**Thời gian:** Ngày 1 – Ngày 7 (23/08/2026 – 29/08/2026)  
**Nhánh chính:** `docs/requirements` (tách từ `develop`)  
**Mục tiêu tuần:** Hoàn thiện 100% hồ sơ nền tảng, đặc tả yêu cầu chức năng (FR), yêu cầu phi chức năng (NFR), Use Case, khảo sát công nghệ & sơ đồ cơ sở dữ liệu ban đầu.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 1: PROJECT FOUNDATION & SCOPE DEFINITION (23/08/2026)
* **Mục tiêu:** Định nghĩa rõ ràng bài toán, tầm nhìn, đối tượng người dùng, 6 module cốt lõi, phạm vi dự án và kịch bản MVP 19 bước.
* **Nhiệm vụ cụ thể:**
  1. Xác định vấn đề cốt lõi của du lịch tự túc (chuyển đổi 5+ ứng dụng rời rạc).
  2. Viết Vision, Mission, và Định nghĩa hệ thống chính thức của Nomadix.
  3. Định nghĩa chân dung 3 nhóm người dùng: Independent Traveler, Experienced Traveler, Administrator.
  4. Xác định ranh giới 6 module cốt lõi và phân loại phạm vi MoSCoW (Must, Should, Future).
  5. Xây dựng kịch bản kiểm thử demo MVP 19 bước và xác định rõ Out-of-scope.
* **Sản phẩm đầu ra (Deliverables):**
  * Thư mục `documentation/01-project-foundation/` gồm 10 file tài liệu từ `01-project-overview.md` đến `10-project-constraints.md` kèm `README.md`.
* **Git Workflow:**
  * Branch: `docs/project-foundation`
  * Commit: `docs: complete day 1 project foundation`
  * PR: `D1 - Complete Project Foundation` ➔ `develop`
* **Definition of Done (DoD):** Tất cả 10 tài liệu nền tảng được review, PR được merge vào `develop`.

---

### 🔹 DAY 2: REQUIREMENTS DEFINITION (FR & NFR) (24/08/2026 – 25/08/2026)
* **Mục tiêu:** Chuyển đổi Scope thành bộ đặc tả yêu cầu chi tiết (Formal SRS) gồm Functional Requirements, Non-Functional Requirements, User Stories và Acceptance Criteria.
* **Nhiệm vụ cụ thể:**
  1. Xây dựng danh sách mã hóa yêu cầu chức năng:
     * `FR-01` đến `FR-05`: Authentication & Profile Management.
     * `FR-06` đến `FR-12`: Smart Booking Search & Normalization.
     * `FR-13` đến `FR-18`: Drag-and-drop Itinerary Planner & Maps.
     * `FR-19` đến `FR-25`: GPS Check-in, Cultural Quiz & Badges.
     * `FR-26` đến `FR-30`: Community Q&A & Verified Badge Attachment.
     * `FR-31` đến `FR-35`: Admin Management & Moderation.
  2. Xây dựng danh sách yêu cầu phi chức năng chuẩn ISO/IEC 25010:
     * `NFR-01` (Performance & Latency với Redis Cache).
     * `NFR-02` (Security: Bcrypt, JWT, Geofencing validation).
     * `NFR-03` (Reliability: Mock data fallback khi OTA API lỗi).
     * `NFR-04` (Usability & Responsiveness di động).
     * `NFR-05` (Scalability: Dual DB Postgres + Mongo).
  3. Viết tập User Stories theo định dạng: *As a [User], I want to [Action], so that [Value]*.
  4. Viết tiêu chí chấp nhận (Acceptance Criteria) theo chuẩn Gherkin (*Given - When - Then*).
  5. Thiết lập Ma trận truy xuất nguồn gốc yêu cầu (Requirements Traceability Matrix - RTM).
* **Sản phẩm đầu ra (Deliverables):**
  * `documentation/02-requirements/01-functional-requirements.md`
  * `documentation/02-requirements/02-non-functional-requirements.md`
  * `documentation/02-requirements/03-user-stories.md`
  * `documentation/02-requirements/04-acceptance-criteria.md`
  * `documentation/02-requirements/05-traceability-matrix.md`
* **Git Workflow:**
  * Branch: `docs/requirements`
  * Commit: `docs: define functional and non-functional requirements`
  * Issue: `D2-01` đến `D2-05` ➔ Milestone `W1 - Requirements`
* **DoD:** Mọi tính năng MVP đều có mã FR tương ứng và có ít nhất 1 User Story kèm kịch bản Given/When/Then.

---

### 🔹 DAY 3: USE CASE ANALYSIS & MODELING (26/08/2026)
* **Mục tiêu:** Mô hình hóa hành vi người dùng bằng Use Case Diagrams và Use Case Specifications chi tiết cho 6 module.
* **Nhiệm vụ cụ thể:**
  1. Xác định danh sách 4 Actors:
     * `Traveler` (Người dùng chính)
     * `Experienced Traveler` (Người đóng góp đã có badge)
     * `Administrator` (Quản trị viên)
     * `External API System` (Google Maps, Cloudinary, OTA API)
  2. Vẽ Sơ đồ Use Case tổng thể (System Use Case Diagram) bằng PlantUML / Mermaid.
  3. Viết Use Case Specification chi tiết cho 8 Use Cases trọng điểm:
     * UC-01: User Registration & Authentication.
     * UC-02: Search & Compare Flights and Hotels.
     * UC-03: Create & Organize Multi-day Itinerary.
     * UC-04: Validate GPS Location & Landmark Check-in.
     * UC-05: Take Cultural Quiz & Unlock City Badge.
     * UC-06: Post Verified Answer in Community Forum.
     * UC-07: Clone Public Itinerary.
     * UC-08: Moderate Community Content (Admin).
  4. Mỗi Use Case phải có: Actor, Pre-conditions, Main Flow, Alternative Flows, Post-conditions.
* **Sản phẩm đầu ra (Deliverables):**
  * `documentation/03-use-cases/01-actors-and-use-cases.md`
  * `documentation/03-use-cases/02-use-case-diagrams.md`
  * `documentation/03-use-cases/03-use-case-specifications.md`
* **Git Workflow:**
  * Branch: `docs/use-cases`
  * Commit: `docs: complete use case analysis and specifications`
  * Issue: `D3-01` đến `D3-03`
* **DoD:** Sơ đồ Use Case render rõ ràng; 8 Use Case cốt lõi có luồng Exception/Alternative đầy đủ.

---

### 🔹 DAY 4: SYSTEM ARCHITECTURE DESIGN (27/08/2026)
* **Mục tiêu:** Thiết kế kiến trúc phân tầng (Layered Architecture), luồng dữ liệu Client-Server và sơ đồ tương tác thành phần.
* **Nhiệm vụ cụ thể:**
  1. Thiết kế High-Level Architecture Diagram (React Native ➔ Node/Express API ➔ Controller ➔ Service ➔ Repository ➔ Postgres / Mongo / Redis).
  2. Thiết kế luồng dữ liệu 3rd-party:
     * Flow 1: Google Maps / Geolocation Geofencing.
     * Flow 2: Cloudinary Media Upload pipeline.
     * Flow 3: Booking Aggregator Service ➔ Adapter Pattern ➔ Mock Fallback.
  3. Phân định ranh giới lưu trữ dữ liệu (Data Separation Boundary):
     * Dữ liệu quan hệ / giao dịch (PostgreSQL): User, Role, CheckIn, Badge, QuizAttempt.
     * Dữ liệu động / phi cấu trúc (MongoDB): Itinerary, ForumQuestion, ForumAnswer, Comment.
     * Caching Layer (Redis): Search queries, Cache keys, TTL strategy.
  4. Thiết kế cơ chế bảo mật (JWT Authentication, API Gateway rate-limit, Helmet, CORS).
* **Sản phẩm đầu ra (Deliverables):**
  * `documentation/04-architecture/01-system-architecture.md`
  * `documentation/04-architecture/02-component-diagrams.md`
  * `documentation/04-architecture/03-data-flow-diagrams.md`
* **Git Workflow:**
  * Branch: `docs/architecture`
  * Commit: `docs: design layered system architecture`
* **DoD:** Có sơ đồ Mermaid/PlantUML biểu diễn chi tiết các tầng từ Client đến Database và Cloud Services.

---

### 🔹 DAY 5: TECHNOLOGY RESEARCH & API FEASIBILITY (28/08/2026)
* **Mục tiêu:** Khảo sát thực tế tính khả thi của các công nghệ, đặc biệt là quyền truy cập và giới hạn của các API bên ngoài.
* **Nhiệm vụ cụ thể:**
  1. Đăng ký & kiểm tra API thực tế:
     * Google Maps Platform (Maps SDK for React Native, Distance Matrix API, Places API).
     * Cloudinary Developer Account (Media upload preset, signature security).
     * Amadeus Travel API (Self-service test account - 2000 free calls/month).
     * RapidAPI Flight/Hotel search APIs (Đánh giá response schema & latency).
  2. Phân tích rủi ro API Rate Limit và chốt thiết kế **Mock Data Adapter Architecture**.
  3. Khảo sát thư viện React Native cốt lõi: `react-native-maps`, `react-native-geolocation-service`, `react-native-image-picker`, `@react-navigation/native`.
  4. Viết báo cáo đánh giá công nghệ (Technology Evaluation Report) phục vụ Chapter 2 của Thesis.
* **Sản phẩm đầu ra (Deliverables):**
  * `documentation/05-tech-research/01-technology-stack-evaluation.md`
  * `documentation/05-tech-research/02-api-feasibility-matrix.md`
  * `documentation/05-tech-research/03-mock-provider-design.md`
* **Git Workflow:**
  * Branch: `docs/tech-research`
  * Commit: `docs: analyze technology feasibility and api availability`
* **DoD:** Xác nhận 100% các API cần dùng có phương án thật hoặc Mock Provider sẵn sàng.

---

### 🔹 DAY 6: DATABASE ANALYSIS & PRELIMINARY ERD (29/08/2026)
* **Mục tiêu:** Phân tích thực thể (Entities), quan hệ (Relationships) và xây dựng Sơ đồ quan hệ thực thể (ERD) sơ bộ cho PostgreSQL và Document Schemas cho MongoDB.
* **Nhiệm vụ cụ thể:**
  1. Xác định các thực thể PostgreSQL (Chuẩn hóa 3NF):
     * `users`, `roles`, `landmarks`, `checkins`, `badges`, `user_badges`, `quizzes`, `questions`, `quiz_attempts`.
  2. Xác định các Document Collections MongoDB:
     * `itineraries`, `itinerary_days`, `itinerary_items`, `forum_questions`, `forum_answers`, `comments`.
  3. Định nghĩa liên kết khóa ngoại chéo (Foreign Key Cross-Reference: `userId` UUID làm string reference trong MongoDB).
  4. Vẽ sơ đồ ERD sơ bộ và Data Dictionary giải thích kiểu dữ liệu của từng trường.
* **Sản phẩm đầu ra (Deliverables):**
  * `documentation/06-database-analysis/01-preliminary-erd.md`
  * `documentation/06-database-analysis/02-data-dictionary.md`
* **Git Workflow:**
  * Branch: `docs/database-analysis`
  * Commit: `docs: construct preliminary ERD and data dictionary`
* **DoD:** ERD hiển thị đầy đủ Cardinality (1-1, 1-N, N-N) và danh mục kiểu dữ liệu.

---

### 🔹 DAY 7: WEEK 1 REVIEW, THESIS SYNOPSIS & PROGRESS REPORT (30/08/2026)
* **Mục tiêu:** Tổng kết toàn bộ kết quả của Tuần 1, kiểm tra Definition of Done (DoD), viết tóm tắt Chapter 1 & 3 cho Luận văn và lập báo cáo tiến độ gửi Giảng viên hướng dẫn (Supervisor).
* **Nhiệm vụ cụ thể:**
  1. Rà soát lại tất cả deliverables của Day 1 đến Day 6.
  2. Tổng hợp thành tài liệu `W1-Review-Summary.md`.
  3. Soạn báo cáo tiến độ tuần (Weekly Progress Report #1) cho Supervisor.
  4. Viết khung sườn Chapter 1 (Introduction) và Chapter 3 (System Requirements) cho Thesis.
  5. Đóng Milestone `W1 - Requirements & Analysis` trên GitHub (100% Completed).
* **Sản phẩm đầu ra (Deliverables):**
  * `documentation/timeline/month-01-analysis-design/week-01-review.md`
  * Báo cáo tiến độ gửi Giảng viên hướng dẫn.
* **Git Workflow:**
  * Merge các docs branches vào `develop`.
  * Commit: `docs: finalize week 1 review and close milestone W1`
* **DoD:** Milestone W1 đạt 100%, tất cả PRs được merge vào `develop`.
