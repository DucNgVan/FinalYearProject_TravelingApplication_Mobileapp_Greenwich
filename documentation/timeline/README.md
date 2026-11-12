# NOMADIX — 5-MONTH FYP MASTER TIMELINE (WEEK-BY-WEEK & DAY-BY-DAY)

## All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Timeline:** 5 Tháng (20 Tuần / 140 Ngày)  
**Tài liệu tham khảo:** [`00-master-plan-review/master-plan-evaluation.md`](../00-master-plan-review/master-plan-evaluation.md)

---

## 🗺️ TỔNG QUAN 5 THÁNG (MASTER ROADMAP)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 5-MONTH FYP ROADMAP                                    │
├─────────┬──────────────────────────┬───────────────────────────────────────────────────┤
│ Month 1 │ Analysis & System Design │ Chốt Requirements, UX/UI, Database, API Blueprint │
├─────────┼──────────────────────────┼───────────────────────────────────────────────────┤
│ Month 2 │ Foundation & Core Backend│ Node.js API, PostgreSQL, MongoDB, JWT Auth, Slice │
├─────────┼──────────────────────────┼───────────────────────────────────────────────────┤
│ Month 3 │ Booking & Itinerary      │ Aggregator, Normalizer, Redis Cache, Google Maps  │
├─────────┼──────────────────────────┼───────────────────────────────────────────────────┤
│ Month 4 │ Gamification & Community │ GPS Check-in, Quiz, Badges, Q&A Verified Badge    │
├─────────┼──────────────────────────┼───────────────────────────────────────────────────┤
│ Month 5 │ Testing & Finalisation   │ Integration, UAT, Benchmark, Thesis, Presentation │
└─────────┴──────────────────────────┴───────────────────────────────────────────────────┘
```

---

## 📁 MỤC LỤC DANH SÁCH 20 TUẦN (WEEKLY INDEX)

### 🟢 [THÁNG 1: ANALYSIS & SYSTEM DESIGN](./month-01-analysis-design/)
* [**Week 01 (Day 1 – Day 7):** Project Foundation, Requirements & Use Cases](./month-01-analysis-design/week-01.md)
* [**Week 02 (Day 8 – Day 14):** UX/UI Wireframing & Design System (Figma)](./month-01-analysis-design/week-02.md)
* [**Week 03 (Day 15 – Day 21):** Database Architecture (Postgres + Mongo) & API Specs](./month-01-analysis-design/week-03.md)
* [**Week 04 (Day 22 – Day 28):** Project Skeleton Setup (React Native + Node.js + CI/CD)](./month-01-analysis-design/week-04.md)

### 🔵 [THÁNG 2: FOUNDATION & CORE BACKEND](./month-02-foundation-core-backend/)
* [**Week 05 (Day 29 – Day 35):** Express.js Layered Architecture, Routing & Middleware](./month-02-foundation-core-backend/week-05.md)
* [**Week 06 (Day 36 – Day 42):** Authentication, Password Hashing & JWT Security](./month-02-foundation-core-backend/week-06.md)
* [**Week 07 (Day 43 – Day 49):** Database Repositories, User Profile & Stats Engine](./month-02-foundation-core-backend/week-07.md)
* [**Week 08 (Day 50 – Day 56):** Core REST API Endpoints, Swagger Docs & Vertical Slice](./month-02-foundation-core-backend/week-08.md)

### 🟡 [THÁNG 3: BOOKING AGGREGATOR & ITINERARY PLANNER](./month-03-booking-itinerary/)
* [**Week 09 (Day 57 – Day 63):** Flight & Hotel Aggregator Architecture & Mock Provider](./month-03-booking-itinerary/week-09.md)
* [**Week 10 (Day 64 – Day 70):** Data Normalization Engine & Unified Models](./month-03-booking-itinerary/week-10.md)
* [**Week 11 (Day 71 – Day 77):** Redis Caching Layer & Latency Measurement Setup](./month-03-booking-itinerary/week-11.md)
* [**Week 12 (Day 78 – Day 84):** Drag-and-Drop Itinerary Planner & Google Maps Routing](./month-03-booking-itinerary/week-12.md)

### 🟣 [THÁNG 4: GAMIFICATION & COMMUNITY FORUM (USP)](./month-04-gamification-community/)
* [**Week 13 (Day 85 – Day 91):** Landmark Catalog, GPS Geofencing & Distance Validation](./month-04-gamification-community/week-13.md)
* [**Week 14 (Day 92 – Day 98):** In-App Camera Integration & Cloud Media Storage Upload](./month-04-gamification-community/week-14.md)
* [**Week 15 (Day 99 – Day 105):** Cultural Quiz Engine, Scoring, XP & Badge Unlocking](./month-04-gamification-community/week-15.md)
* [**Week 16 (Day 106 – Day 112):** Community Q&A Forum & Verified City Badge Verification](./month-04-gamification-community/week-16.md)

### 🔴 [THÁNG 5: INTEGRATION, TESTING & FINALISATION](./month-05-integration-testing-finalisation/)
* [**Week 17 (Day 113 – Day 119):** Full System Integration & End-to-End User Journey](./month-05-integration-testing-finalisation/week-17.md)
* [**Week 18 (Day 120 – Day 126):** Comprehensive Testing (Unit, Integration, UAT 5-10 Users)](./month-05-integration-testing-finalisation/week-18.md)
* [**Week 19 (Day 127 – Day 133):** Redis Benchmark Evaluation, Security & Edge Case Audit](./month-05-integration-testing-finalisation/week-19.md)
* [**Week 20 (Day 134 – Day 140):** Final Thesis Documentation, Video Demo & FYP Defense](./month-05-integration-testing-finalisation/week-20.md)

---

## 🛠️ QUY ƯỚC QUẢN LÝ GIT & AGILE ĐỒ ÁN (GIT WORKFLOW)

```text
MỨC ĐỘ          ÁNH XẠ GITHUB                     VÍ DỤ
─────────────────────────────────────────────────────────────────────────────
Giai đoạn       GitHub Milestone lớn              M1 - Analysis & Design
Tuần            GitHub Milestone con / Epic       W1 - Requirements & Analysis
Ngày / Task     GitHub Issue                      D1-01 Define Project Overview
Tính năng       Git Branch                        feature/booking-aggregator
Thay đổi        Git Commit (Conventional)         feat(booking): add amadeus adapter
Nghiệm thu      Pull Request                      PR: Merge feature/booking -> develop
Phiên bản ổn    develop branch                    develop (staging/integration)
Bản phát hành   main branch                       main (v1.0.0 FYP Submission)
```
