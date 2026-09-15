# Day 6 — Database Analysis & Preliminary ERD

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Milestone:** `D6 - Database Analysis` / `W1 - Requirements & Analysis`  
**Branch:** `docs/database-analysis`  

---

## 📑 DANH MỤC TÀI LIỆU CƠ SỞ DỮ LIỆU (DELIVERABLES INDEX)

Thư mục này chứa đầy đủ hồ sơ phân tích cơ sở dữ liệu, sơ đồ ERD toàn diện và từ điển dữ liệu cho hệ sinh thái Nomadix:

| Mã Tài Liệu | Tên Tài Liệu | Nội Dung Cốt Lõi |
|---|---|---|
| **D6-00** | [**`00-master-database-schema.md`**](./00-master-database-schema.md) | **Hồ sơ Đặc tả Cơ sở Dữ liệu Tổng thể (Master Specification)**: Bản hợp nhất toàn diện 100% của 28 bảng PostgreSQL 3NF, 4 Collection MongoDB, Taxonomy khóa Redis và DDL Production hoàn chỉnh cho cả 4 phân hệ. |
| **D6-01** | [**`01-preliminary-erd.md`**](./01-preliminary-erd.md) | **Sơ đồ ERD toàn diện chi tiết 100% bằng Mermaid**: Sơ đồ 13 bảng quan hệ chuẩn 3NF của PostgreSQL (Users, Badges, Checkins, Quizzes, Trip Members, Expenses, Splits, Settlements), Sơ đồ 4 Collection của MongoDB Atlas và Sơ đồ bản đồ kiến trúc đa cơ sở dữ liệu (Polyglot Map). |
| **D6-02** | [**`02-data-dictionary.md`**](./02-data-dictionary.md) | **Từ điển dữ liệu hoàn chỉnh (Data Dictionary)**: Bảng đặc tả 100% các cột, kiểu dữ liệu, ràng buộc NOT NULL/UNIQUE/CHECK, khóa chính/ngoại, Indexes và Typescript Interfaces (bao gồm toàn bộ 4 bảng sổ chi tiêu nhóm và mảng collaborators). |
| **D6-03** | [**`03-polyglot-data-model.md`**](./03-polyglot-data-model.md) | **Mô hình hóa liên cơ sở dữ liệu (Polyglot Architecture)**: Chiến lược khóa ngoại chéo hai chiều UUID / ObjectId String, Giao thức kiểm tra danh hiệu "City Verified", Giao thức đồng bộ chuyến đi nhóm & quyết toán chi phí, Bảng Taxonomy khóa Redis và công thức tính toán RAM. |
| **D6-04** | [**`04-core-users-auth-erd.md`**](./04-core-users-auth-erd.md) | **Sơ đồ ERD & Đặc tả chuyên sâu Core Entities (Users & Authentication)**: Sơ đồ 3NF 9 bảng bảo mật (Users, Roles, Permissions, Sessions/Refresh Tokens, OAuth, Preferences, Password Resets, Audit Logs) kèm DDL PostgreSQL đầy đủ. |
| **D6-05** | [**`05-booking-models-and-user-profile-erd.md`**](./05-booking-models-and-user-profile-erd.md) | **Sơ đồ ERD & Đặc tả chuyên sâu Booking Models & User Profiles**: Sơ đồ 3NF 8 bảng quản lý đặt vé (Bookings, Flight Bookings, Hotel Bookings, Saved Offers, Traveler Profiles, Passengers, Payments, Affiliate Tracking) kèm liên kết liên cơ sở dữ liệu tới Itinerary. |
| **D6-06** | [**`06-nosql-itinerary-schema-design.md`**](./06-nosql-itinerary-schema-design.md) | **Thiết kế NoSQL MongoDB Schema cho Cấu trúc Lịch trình Linh hoạt**: Mô hình tài liệu phân cấp lồng nhau (Embedded Sub-documents), Pattern đa hình Polymorphic Discriminator cho hoạt động, Mảng đồng hành collaborators, Tọa độ GeoJSON 2dsphere và Pipeline kéo thả/nhân bản/đồng bộ nhóm. |
| **D6-07** | [**`07-gamification-and-community-forum-erd.md`**](./07-gamification-and-community-forum-erd.md) | **Sơ đồ ERD & Đặc tả chuyên sâu Gamification & Community Forum**: Sơ đồ quan hệ chuẩn 3NF PostgreSQL cho Geofencing, Tọa độ WGS84, Quizzes & Badges kết hợp cùng Document Models MongoDB cho Diễn đàn và Cầu nối Uy tín "City Verified". |
| **D6-08** | [**`08-group-expenses-and-collaboration-erd.md`**](./08-group-expenses-and-collaboration-erd.md) | **Sơ đồ ERD & Đặc tả chuyên sâu Trip Companionship, Group Expenses & Debt Settlement**: Sơ đồ quan hệ chuẩn 3NF 4 bảng tài chính nhóm (`trip_members`, `trip_expenses`, `trip_expense_splits`, `trip_settlements`), Thuật toán Greedy Min-Cashflow $O(N \log N)$, bảo toàn số dư $\sum \text{NetBalance}_i = 0$ và DDL hoàn chỉnh. |
| **Export** | [**`diagrams/`**](./diagrams/) | **Thư mục Sơ đồ Thiết kế Xuất bản (.mmd)**: Chứa các file Mermaid độc lập (`master-polyglot-erd.mmd`, `postgresql-relational-erd.mmd`, `mongodb-document-erd.mmd`, `cross-database-trust-flow.mmd`). |

---

## 📊 THỐNG KÊ THÀNH PHẦN CƠ SỞ DỮ LIỆU (DATABASE METRICS)

* **PostgreSQL Relational Tables:** 28 bảng chuẩn hóa 3NF tuyệt đối:
  * Module A: Identity, Authentication & RBAC (9 bảng)
  * Module B: Cultural Gamification, Coordinates & Badges (7 bảng)
  * Module C: Bookings, Manifests & Financial Transactions (8 bảng)
  * Module D: Trip Companionship, Group Expenses & Debt Settlement (4 bảng)
* **MongoDB Document Collections:** 4 collections (`itineraries` với embedded `collaborators`, `forum_questions`, `forum_answers`, `community_reports`)
* **Redis Key Patterns:** 5 mẫu khóa chính (`nomadix:flight:*`, `nomadix:hotel:*`, `nomadix:landmarks:*`, `rate_limit:*`, `checkin_token:*`)
* **Mức độ chuẩn hóa:** Chuẩn hóa 3NF tuyệt đối cho toàn bộ dữ liệu giao dịch tài chính và định danh; Cấu trúc phân cấp tài liệu tối ưu cho lịch trình hành trình và diễn đàn cộng đồng.

---

## 🔄 BƯỚC TIẾP THEO (DAY 7 TRANSITION)

Với thiết kế cơ sở dữ liệu đã hoàn tất vững chắc, **Day 7 (D7 - Week 1 Synthesis & Review)** sẽ thực hiện:
1. Rà soát lại toàn bộ 6 ngày làm việc của Tuần 1 theo bảng tiêu chuẩn **Definition of Done (DoD)**.
2. Tổng hợp báo cáo tiến độ tuần (Weekly Progress Report #1) cho Giảng viên hướng dẫn (Supervisor).
3. Soạn thảo khung sườn Chapter 1 (Introduction) và Chapter 3 (System Requirements) cho Luận văn tốt nghiệp.
