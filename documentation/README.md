# 🧭 Nomadix — Master Documentation Portal & System Navigation Guide

## Final Year Project (FYP) — University of Greenwich
* **Project Name:** **Nomadix** — All-in-one Smart Travel Platform with Collaborative Planning, Group Expense Splitting, Cultural Gamification & Verified Community
* **Student:** Nguyễn Văn Đức
* **Program:** BSc (Hons) Computing — University of Greenwich (Alliance with FPT)
* **Status:** Week 1 Complete (Analysis & Design Phase: Day 1 to Day 6)
* **Architecture:** Microservice-ready Modular Monolith | Polyglot Persistence (PostgreSQL + MongoDB + Redis)

---

## 🌟 1. GIỚI THIỆU TỔNG QUAN HỆ THỐNG TÀI LIỆU (PORTAL OVERVIEW)

Chào mừng bạn đến với **Cổng Thông Tin Tài Liệu Toàn Diện (Master Documentation Portal)** của đồ án **Nomadix**.

Toàn bộ tài liệu kỹ thuật của dự án đã được chuẩn hóa theo chuẩn kỹ nghệ phần mềm quốc tế (**IEEE / RUP / ISO/IEC 25010 / Agile Scrum**), phân chia logic thành **6 Pha Nghiệp Vụ tương ứng với 6 ngày làm việc chuyên sâu của Tuần 1 (Week 1 — Analysis & Design)**:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                NOMADIX DOCUMENTATION ROADMAP                                     │
├──────────┬──────────────────────────────────────┬────────────────────────────────────────────────┤
│ Pha 1    │ Day 1: Project Foundation & Vision   │ Định vị bài toán, mục tiêu, phạm vi & MVP 22b  │
├──────────┼──────────────────────────────────────┼────────────────────────────────────────────────┤
│ Pha 2    │ Day 2: Requirements Specification    │ 42 FRs, 8 NFRs, 35 User Stories & 17+ Scenarios│
├──────────┼──────────────────────────────────────┼────────────────────────────────────────────────┤
│ Pha 3    │ Day 3: Use Case & Actor Analysis     │ 5 Actors, 22 Use Cases, 10 Đặc tả chuyên sâu   │
├──────────┼──────────────────────────────────────┼────────────────────────────────────────────────┤
│ Pha 4    │ Day 4: System Architecture Design    │ C4 Architecture, 6 Luồng Sequence UML chi tiết │
├──────────┼──────────────────────────────────────┼────────────────────────────────────────────────┤
│ Pha 5    │ Day 5: Technical Research & Feasib.  │ Tech Stack, Greedy Min-Cashflow, Cloudinary API│
├──────────┼──────────────────────────────────────┼────────────────────────────────────────────────┤
│ Pha 6    │ Day 6: Database Schema & ERD Models  │ 28 Postgres 3NF, 4 Mongo Colls, Redis Caching  │
└──────────┴──────────────────────────────────────┴────────────────────────────────────────────────┘
```

---

## 🗺️ 2. BẢN ĐỒ ĐIỀU HƯỚNG CHI TIẾT THEO TỪNG PHA (SYSTEMATIC SITEMAP)

---

### 🟢 PHA 1: NỀN TẢNG DỰ ÁN & ĐỊNH HƯỚNG SẢN PHẨM (`01-project-foundation/`)
*Mục tiêu: Thiết lập bối cảnh học thuật, vấn đề thực tế của du lịch tự túc và du lịch nhóm, tuyên ngôn tầm nhìn và phạm vi MVP.*

| Mã TL | Tài Liệu Chi Tiết | Tóm Tắt Nội Dung Cốt Lõi |
|---|---|---|
| **D1-00** | [**`01-project-foundation/README.md`**](./01-project-foundation/README.md) | Thư mục nền tảng dự án, bảng chỉ số deliverables Day 1. |
| **D1-01** | [**`01-project-overview.md`**](./01-project-foundation/01-project-overview.md) | Tổng quan hệ thống Nomadix, định vị all-in-one travel app kết hợp lập kế hoạch đồng đội & quản lý chi tiêu nhóm. |
| **D1-02** | [**`02-problem-statement.md`**](./01-project-foundation/02-problem-statement.md) | 5 nỗi đau cốt lõi: App sprawl, Lên lịch thủ công, Gian lận review, Lệch pha kế hoạch nhóm & Xung đột chia tiền bill. |
| **D1-03** | [**`03-project-vision.md`**](./01-project-foundation/03-project-vision.md) | Tuyên ngôn sứ mệnh 7 trụ cột: Khám phá, Lập kế hoạch, Gắn kết bạn bè, Minh bạch tài chính, Học văn hóa và Chứng thực uy tín. |
| **D1-04** | [**`04-project-objectives.md`**](./01-project-foundation/04-project-objectives.md) | Mục tiêu SMART (Thời gian phản hồi, độ chính xác GPS, bảo toàn số dư $\sum \text{NetBalance} = 0$). |
| **D1-05** | [**`05-target-users.md`**](./01-project-foundation/05-target-users.md) | 4 chân dung người dùng: Solo Traveler, Squad Organizer, Culture Explorer, First-time Planner. |
| **D1-06** | [**`06-core-modules.md`**](./01-project-foundation/06-core-modules.md) | 7 Module chức năng: Auth, Booking, Itinerary, Group Expenses, Gamification, Community, Verified. |
| **D1-07** | [**`07-project-scope.md`**](./01-project-foundation/07-project-scope.md) | Ranh giới tính năng trong phạm vi luận văn 16 tuần (Must/Should/Could/Won't Have). |
| **D1-08** | [**`08-mvp-definition.md`**](./01-project-foundation/08-mvp-definition.md) | **Kịch bản kiểm thử 22 bước** chứng minh thành công toàn diện cho buổi bảo vệ tốt nghiệp. |
| **D1-09** | [**`09-out-of-scope.md`**](./01-project-foundation/09-out-of-scope.md) | Các tính năng hoãn lại (Cổng thanh toán bù trừ tự động liên ngân hàng, AI thời gian thực). |
| **D1-10** | [**`10-project-constraints.md`**](./01-project-foundation/10-project-constraints.md) | Các ràng buộc kỹ thuật (Ngân sách API 0 đồng, thời hạn nộp bài Greenwich). |

---

### 🔵 PHA 2: ĐẶC TẢ YÊU CẦU HỆ THỐNG (`02-requirements/`)
*Mục tiêu: Chuyển hóa nhu cầu thành 42 yêu cầu chức năng, tiêu chuẩn chất lượng ISO/IEC 25010 và kịch bản BDD.*

| Mã TL | Tài Liệu Chi Tiết | Tóm Tắt Nội Dung Cốt Lõi |
|---|---|---|
| **D2-00** | [**`02-requirements/README.md`**](./02-requirements/README.md) | Tổng quan bộ yêu cầu kỹ thuật và bảng theo dõi tiến độ (42 FRs, 35 USs). |
| **D2-01** | [**`01-functional-requirements.md`**](./02-requirements/01-functional-requirements.md) | **42 Yêu cầu Chức năng (`FR-01` đến `FR-42`)** bao gồm Module 7: Group Expenses & Splitting. |
| **D2-02** | [**`02-non-functional-requirements.md`**](./02-requirements/02-non-functional-requirements.md) | **8 nhóm chuẩn ISO/IEC 25010**: Performance (<50ms cache), Security, Financial Integrity. |
| **D2-03** | [**`03-user-stories.md`**](./02-requirements/03-user-stories.md) | **35 User Stories tổng thể (`US-01` đến `US-35`)** bao gồm Epic 7 (Companions) và Epic 8 (Group Expenses). |
| **D2-04** | [**`04-acceptance-criteria.md`**](./02-requirements/04-acceptance-criteria.md) | **17 Kịch bản kiểm thử nghiệm thu** chuẩn ngôn ngữ **BDD Gherkin** (*Given-When-Then*). |
| **D2-05** | [**`05-traceability-matrix.md`**](./02-requirements/05-traceability-matrix.md) | **Ma trận truy xuất RTM** kết nối Mục tiêu ➔ User Stories ➔ FR ➔ Database ➔ Test. |
| **D2-06** | [**`06-detailed-booking-and-itinerary-specs.md`**](./02-requirements/06-detailed-booking-and-itinerary-specs.md) | **Đặc tả Booking & Itinerary** (16 Stories bao gồm mời bạn bè và đồng bộ lịch trình). |
| **D2-07** | [**`07-detailed-gamification-and-community-specs.md`**](./02-requirements/07-detailed-gamification-and-community-specs.md) | **Đặc tả Gamification Geofence & Community Forum** (13 Stories, 39 kịch bản BDD). |
| **D2-08** | [**`08-detailed-collaborative-planning-and-expense-sharing-specs.md`**](./02-requirements/08-detailed-collaborative-planning-and-expense-sharing-specs.md) | **[MỚI] Đặc tả Chuyên sâu Lập Kế Hoạch Đồng Đội & Sổ Chi Tiêu Nhóm** (10 Stories, BDD chi tiết, Thuật toán Greedy Min-Cashflow). |

---

### 🟡 PHA 3: PHÂN TÍCH USE CASE & TÁC NHÂN (`03-use-cases/`)
*Mục tiêu: Mô hình hóa hành vi người dùng bằng chuẩn UML 2.5 Use Case Specifications.*

| Mã TL | Tài Liệu Chi Tiết | Tóm Tắt Nội Dung Cốt Lõi |
|---|---|---|
| **D3-00** | [**`03-use-cases/README.md`**](./03-use-cases/README.md) | Tổng quan phân tích Use Case và vai trò 5 Tác nhân (Actors). |
| **D3-01** | [**`01-actors-and-use-cases.md`**](./03-use-cases/01-actors-and-use-cases.md) | 5 Tác nhân: Traveler, Trip Companion, Verified Explorer, Moderator, External APIs; 22 Use Cases. |
| **D3-02** | [**`02-use-case-diagrams.md`**](./03-use-cases/02-use-case-diagrams.md) | **Sơ đồ Use Case toàn hệ thống** Mermaid kèm phân rã Module 7 (Group Expenses). |
| **D3-03** | [**`03-use-case-specifications.md`**](./03-use-cases/03-use-case-specifications.md) | **10 Đặc tả Use Case trọng điểm (`UC-01` đến `UC-10`)**: Main Flow, Alternative & Exception. |

---

### 🟣 PHA 4: KIẾN TRÚC HỆ THỐNG & SƠ ĐỒ TUẦN TỰ (`04-architecture/`)
*Mục tiêu: Thiết kế kiến trúc tổng thể 5 tầng, sơ đồ component và 6 luồng sequence nghiệp vụ trọng yếu.*

| Mã TL | Tài Liệu Chi Tiết | Tóm Tắt Nội Dung Cốt Lõi |
|---|---|---|
| **D4-00** | [**`04-architecture/README.md`**](./04-architecture/README.md) | Tổng quan kiến trúc hệ thống và hướng tiếp cận Modular Monolith. |
| **D4-01** | [**`01-system-architecture.md`**](./04-architecture/01-system-architecture.md) | **Mô hình 5 tầng (5-Tier Architecture)**: Client, Gateway, Services (thêm Collaboration & GroupExpense), Adapter, Polyglot. |
| **D4-02** | [**`02-component-diagrams.md`**](./04-architecture/02-component-diagrams.md) | Sơ đồ thành phần liên kết giữa Express, MongoDB, Postgres, Redis và Cloudinary. |
| **D4-03** | [**`03-data-flow-and-sequence-diagrams.md`**](./04-architecture/03-data-flow-and-sequence-diagrams.md) | **6 Sơ đồ tuần tự cốt lõi**: Search Cache, Drag-drop, GPS Quiz, Cross-DB Bridge, Companion Sync, Bill Upload & Debt Settlement. |

---

### 🟠 PHA 5: NGHIÊN CỨU KỸ THUẬT & KHẢ THI API (`05-tech-research/`)
*Mục tiêu: Đánh giá chọn lựa công nghệ, thuật toán tối ưu hóa công nợ và hạn ngạch API bên ngoài.*

| Mã TL | Tài Liệu Chi Tiết | Tóm Tắt Nội Dung Cốt Lõi |
|---|---|---|
| **D5-00** | [**`05-tech-research/README.md`**](./05-tech-research/README.md) | Tổng quan phân tích nghiên cứu công nghệ và giải pháp dự phòng. |
| **D5-01** | [**`01-technology-stack-evaluation.md`**](./05-tech-research/01-technology-stack-evaluation.md) | Đánh giá so sánh: React Native vs Flutter, Node.js vs Go, Postgres vs MySQL, Thuật toán Greedy Min-Cashflow ($O(N \log N)$). |
| **D5-02** | [**`02-api-feasibility-matrix.md`**](./05-tech-research/02-api-feasibility-matrix.md) | Khảo sát hạn ngạch Amadeus, Google Maps, RapidAPI, Cloudinary (`/nomadix/receipts/`). |
| **D5-03** | [**`03-mock-provider-design.md`**](./05-tech-research/03-mock-provider-design.md) | **Thiết kế Circuit Breaker & Mock Provider**: Tự động fallback khi API bên ngoài lỗi/hết quota. |

---

### 🔴 PHA 6: THIẾT KẾ CƠ SỞ DỮ LIỆU ĐA NỀN TẢNG (`06-database-analysis/`)
*Mục tiêu: Mô hình hóa toàn diện 28 bảng PostgreSQL 3NF, 4 Collection MongoDB Atlas và sơ đồ quan hệ.*

| Mã TL | Tài Liệu Chi Tiết | Tóm Tắt Nội Dung Cốt Lõi |
|---|---|---|
| **D6-00** | [**`00-master-database-schema.md`**](./06-database-analysis/00-master-database-schema.md) | **Hồ sơ Đặc tả Cơ sở Dữ liệu Tổng thể (Master Specification)**: 28 bảng Postgres 3NF, 4 Collection Mongo, Redis key taxonomy, DDL đầy đủ. |
| **D6-01** | [**`01-preliminary-erd.md`**](./06-database-analysis/01-preliminary-erd.md) | Sơ đồ ERD 13 bảng trọng tâm PostgreSQL, Collection MongoDB và Polyglot Persistence Map. |
| **D6-02** | [**`02-data-dictionary.md`**](./06-database-analysis/02-data-dictionary.md) | Từ điển dữ liệu chuẩn IEEE: Bảng đặc tả 100% các cột, kiểu dữ liệu, index cho 28 bảng và Mongo docs. |
| **D6-03** | [**`03-polyglot-data-model.md`**](./06-database-analysis/03-polyglot-data-model.md) | Mô hình liên cơ sở dữ liệu: Khóa ngoại hai chiều UUID / ObjectId String, Giao thức đồng bộ chuyến đi & chi tiêu nhóm. |
| **D6-04** | [**`04-core-users-auth-erd.md`**](./06-database-analysis/04-core-users-auth-erd.md) | **Sơ đồ ERD Chuyên sâu Users & Authentication**: 9 bảng bảo mật (RBAC, Sessions, OAuth, Resets, Audits). |
| **D6-05** | [**`05-booking-models-and-user-profile-erd.md`**](./06-database-analysis/05-booking-models-and-user-profile-erd.md) | **Sơ đồ ERD Chuyên sâu Booking Models & User Profiles**: 8 bảng quản lý vé, khách sạn, manifest, thanh toán. |
| **D6-06** | [**`06-nosql-itinerary-schema-design.md`**](./06-database-analysis/06-nosql-itinerary-schema-design.md) | **Thiết kế NoSQL MongoDB Schema cho Lịch trình**: Cấu trúc nhúng 1:Few, mảng `collaborators`, GeoJSON, Pipelines. |
| **D6-07** | [**`07-gamification-and-community-forum-erd.md`**](./06-database-analysis/07-gamification-and-community-forum-erd.md) | **Sơ đồ ERD Chuyên sâu Gamification & Community**: Tọa độ WGS84, Geofence 100m, Quizzes, Cầu nối "City Verified". |
| **D6-08** | [**`08-group-expenses-and-collaboration-erd.md`**](./06-database-analysis/08-group-expenses-and-collaboration-erd.md) | **[MỚI] Sơ đồ ERD Chuyên sâu Trip Companionship, Group Expenses & Settlements**: 4 bảng tài chính nhóm, Greedy Debt Simplification DDL. |
| **Export** | [**`06-database-analysis/diagrams/`**](./06-database-analysis/diagrams/) | **Thư mục Sơ đồ Thiết kế Xuất bản (.mmd)**: Chứa các file Mermaid độc lập phục vụ render đồ họa và thuyết trình. |

---

## 🏗️ 3. TỔNG QUAN KIẾN TRÚC DỮ LIỆU ĐA NỀN TẢNG (POLYGLOT PERSISTENCE SUMMARY)

```
                            ┌─────────────────────────────────────────┐
                            │          REACT NATIVE CLIENT            │
                            └────────────────────┬────────────────────┘
                                                 │ HTTP / JWT
                                                 ▼
                            ┌─────────────────────────────────────────┐
                            │        EXPRESS.JS API GATEWAY           │
                            └────┬───────────────┼───────────────┬────┘
                                 │               │               │
                 ┌───────────────┘               │               └───────────────┐
                 ▼                               ▼                               ▼
    ┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
    │      POSTGRESQL 16      │     │     MONGODB ATLAS 7     │     │         REDIS 7         │
    │  (Relational 3NF ACID)  │     │   (Flexible Documents)  │     │    (In-Memory Cache)    │
    ├─────────────────────────┤     ├─────────────────────────┤     ├─────────────────────────┤
    │ • 9 Auth & RBAC Tables  │     │ • `itineraries`         │     │ • Flights Cache (1800s) │
    │ • 7 Gamification Tables │     │   (collaborators array) │     │ • Hotels Cache (3600s)  │
    │ • 8 Booking Tables      │     │ • `forum_questions`     │     │ • Landmark Cache (24h)  │
    │ • 4 Group Expense Tabs  │     │ • `forum_answers`       │     │ • Rate Limiting (900s)  │
    │   (Total: 28 Tables)    │     │ • `community_reports`   │     │ • Check-in Nonce (300s) │
    └─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

---

## 📖 4. HƯỚNG DẪN ĐỌC TÀI LIỆU DÀNH CHO CÁC ĐỐI TƯỢNG (HOW TO READ)

1. **Dành cho Giảng viên Hướng dẫn & Hội đồng Chấm thi (Academic Reviewers):**
   * Bắt đầu với [`01-project-foundation/01-project-overview.md`](./01-project-foundation/01-project-overview.md) và [`01-project-foundation/08-mvp-definition.md`](./01-project-foundation/08-mvp-definition.md) để nắm bắt bài toán và kịch bản thành công 22 bước.
   * Xem [`02-requirements/05-traceability-matrix.md`](./02-requirements/05-traceability-matrix.md) để đánh giá tính học thuật và khả năng kiểm soát yêu cầu (RTM).
   * Đánh giá kiến trúc kỹ thuật tại [`04-architecture/01-system-architecture.md`](./04-architecture/01-system-architecture.md) và cơ sở dữ liệu tại [`06-database-analysis/00-master-database-schema.md`](./06-database-analysis/00-master-database-schema.md) cùng [`06-database-analysis/08-group-expenses-and-collaboration-erd.md`](./06-database-analysis/08-group-expenses-and-collaboration-erd.md).

2. **Dành cho Lập trình viên Backend (Backend Engineers):**
   * Xem tài liệu DDL và mô hình dữ liệu tại [`06-database-analysis/00-master-database-schema.md`](./06-database-analysis/00-master-database-schema.md) và [`06-database-analysis/08-group-expenses-and-collaboration-erd.md`](./06-database-analysis/08-group-expenses-and-collaboration-erd.md).
   * Xem luồng tương tác và API contracts tại [`04-architecture/03-data-flow-and-sequence-diagrams.md`](./04-architecture/03-data-flow-and-sequence-diagrams.md).
   * Triển khai thuật toán Greedy Min-Cashflow tại [`05-tech-research/01-technology-stack-evaluation.md`](./05-tech-research/01-technology-stack-evaluation.md) và cơ chế chịu lỗi tại [`05-tech-research/03-mock-provider-design.md`](./05-tech-research/03-mock-provider-design.md).

3. **Dành cho Lập trình viên Mobile Frontend (React Native Engineers):**
   * Nắm bắt kịch bản giao diện và nghiệp vụ qua [`02-requirements/06-detailed-booking-and-itinerary-specs.md`](./02-requirements/06-detailed-booking-and-itinerary-specs.md), [`02-requirements/07-detailed-gamification-and-community-specs.md`](./02-requirements/07-detailed-gamification-and-community-specs.md), và [**`02-requirements/08-detailed-collaborative-planning-and-expense-sharing-specs.md`**](./02-requirements/08-detailed-collaborative-planning-and-expense-sharing-specs.md).
   * Xem định dạng GeoJSON và schema lịch trình tại [`06-database-analysis/06-nosql-itinerary-schema-design.md`](./06-database-analysis/06-nosql-itinerary-schema-design.md).

4. **Dành cho Kiểm thử viên (QA / Test Engineers):**
   * Sử dụng toàn bộ các kịch bản BDD Gherkin (*Given-When-Then*) trong [`02-requirements/04-acceptance-criteria.md`](./02-requirements/04-acceptance-criteria.md), [`02-requirements/06-detailed-booking-and-itinerary-specs.md`](./02-requirements/06-detailed-booking-and-itinerary-specs.md), [`02-requirements/07-detailed-gamification-and-community-specs.md`](./02-requirements/07-detailed-gamification-and-community-specs.md), và [`02-requirements/08-detailed-collaborative-planning-and-expense-sharing-specs.md`](./02-requirements/08-detailed-collaborative-planning-and-expense-sharing-specs.md) làm Test Case tự động hóa (Jest / Supertest / Detox).
