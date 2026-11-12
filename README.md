# 🌍 Nomadix — Smart Travel Platform with Collaborative Planning & Cultural Gamification

> **Final Year Project (FYP) — University of Greenwich**  
> **Student:** Nguyễn Văn Đức  
> **Degree Program:** BSc (Hons) Computing  
> **Status:** Week 1 Complete (Analysis & Design Phase)  

---

## 📖 About Nomadix

**Nomadix** is an all-in-one mobile travel ecosystem engineered to eliminate "app sprawl" for independent and group travelers. It seamlessly bridges:

1. **Smart Booking Search & Aggregation:** Live comparison of flights and hotels across multiple OTA providers with a sub-50ms Redis cache-aside engine and automatic mock fallback.
2. **Collaborative Itinerary Planner & Maps Routing:** Multi-day journey mapping with embedded Google Maps routing, dynamic polyline visualization, drag-and-drop stop reordering, and **real-time companion invitations** where all travel squad members view and edit the exact same synchronized itinerary.
3. **Group Expense Tracking & Bill Splitting Hub:** In-trip shared financial ledger where members capture/upload bill receipts (Cloudinary CDN), log expenditures across categories, split costs equally or custom (exact amounts/shares), view live net balances ($\sum \text{NetBalance}_i = 0$), and execute a **Greedy Minimum Cash-Flow Reduction Algorithm** to settle group debts in at most $N-1$ payments.
4. **Cultural Gamification & Location Engine (USP):** Verified on-site GPS geofencing ($\le 100\text{m}$), native watermarked photo capture, educational cultural quizzes, XP progression, and automated City Explorer Badges.
5. **Verified Community Q&A Forum:** A destination-oriented travel forum where travelers holding City Badges automatically receive an authenticated gold **"City Verified"** badge on their answers, solving the widespread epidemic of unvetted, fake travel advice.

---

## 🏛️ System Architecture & Polyglot Persistence

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           REACT NATIVE MOBILE CLIENT                             │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTPS / JWT
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                       EXPRESS.JS MODULAR API GATEWAY                             │
└──────────────┬─────────────────────────┼─────────────────────────┬───────────────┘
               │                         │                         │
               ▼                         ▼                         ▼
┌─────────────────────────────┐ ┌────────────────────────┐ ┌─────────────────────────┐
│        POSTGRESQL 16        │ │    MONGODB ATLAS 7     │ │         REDIS 7         │
│    (Relational 3NF ACID)    │ │  (Embedded Documents)  │ │    (In-Memory Cache)    │
├─────────────────────────────┤ ├────────────────────────┤ ├─────────────────────────┤
│ • 9 Identity & RBAC Tables  │ │ • `itineraries`        │ │ • Flight Cache (1800s)  │
│ • 7 Gamification Tables     │ │   (collaborators array)│ │ • Hotel Cache (3600s)   │
│ • 8 Booking & Manifest Tabs │ │ • `forum_questions`    │ │ • Landmark Cache (24h)  │
│ • 4 Group Expense & Debts   │ │ • `forum_answers`      │ │ • Rate Limiting (900s)  │
│   (28 Tables Total)         │ │ • `community_reports`  │ │ • Check-in Nonce (300s) │
└─────────────────────────────┘ └────────────────────────┘ └─────────────────────────┘
```

---

## 📑 Complete Documentation Portal

The entire project specification has been organized into a dedicated **[Master Documentation Portal (documentation/README.md)](./documentation/README.md)**:

* **[Phase 1: Project Foundation (Day 1)](./documentation/01-project-foundation/README.md)** — Problem statements, vision, target personas, SMART objectives, 7 core modules, and 22-step MVP script.
* **[Phase 2: Requirements Specification (Day 2)](./documentation/02-requirements/README.md)** — 42 Functional Requirements (`FR-01` to `FR-42`), 8 ISO/IEC 25010 NFRs, 35 User Stories, and exhaustive BDD Gherkin specifications for [Booking & Itinerary](./documentation/02-requirements/06-detailed-booking-and-itinerary-specs.md), [Gamification & Forum](./documentation/02-requirements/07-detailed-gamification-and-community-specs.md), and [Collaborative Planning & Expense Sharing](./documentation/02-requirements/08-detailed-collaborative-planning-and-expense-sharing-specs.md).
* **[Phase 3: Use Case Analysis (Day 3)](./documentation/03-use-cases/README.md)** — 5 system actors (including Trip Companion), 22 Use Cases with UML 2.5 diagrams, and 10 core specifications (`UC-01` to `UC-10`).
* **[Phase 4: System Architecture (Day 4)](./documentation/04-architecture/README.md)** — 5-tier architecture, component models, and 6 core sequence flow diagrams (including Companion Invitation & Bill Split/Settlement).
* **[Phase 5: Technical Research (Day 5)](./documentation/05-tech-research/README.md)** — Technology stack evaluation (Greedy Cash-Flow $O(N \log N)$), external API feasibility matrices (`/nomadix/receipts/{tripId}/`), and Mock Provider fallback engine.
* **[Phase 6: Database Schema & ERD (Day 6)](./documentation/06-database-analysis/README.md)** — **[00-master-database-schema.md](./documentation/06-database-analysis/00-master-database-schema.md)** (28 PostgreSQL 3NF tables, 4 MongoDB collections, Redis taxonomy, production DDL, [08-group-expenses-and-collaboration-erd.md](./documentation/06-database-analysis/08-group-expenses-and-collaboration-erd.md), and [exported .mmd diagrams](./documentation/06-database-analysis/diagrams/)).

---

## 💻 Tech Stack Summary

| Layer | Technologies |
|---|---|
| **Mobile Client** | React Native, React Navigation, react-native-maps, VisionCamera |
| **API Gateway & Services** | Node.js, Express.js, Joi, Winston, Bcrypt, JWT |
| **Relational Database** | PostgreSQL 16 (strict 3NF, 28 tables, UUID v4, ACID financial transactions) |
| **Document Store** | MongoDB Atlas 7.0, Mongoose 8 (collaborators array, GeoJSON, 2dsphere indexing) |
| **In-Memory Cache** | Redis 7 (Cache-Aside, TTL expiration, Rate limiting) |
| **Cloud Assets** | Cloudinary CDN (Bill receipts `/nomadix/receipts/{tripId}/`, watermark overlays) |
| **Algorithms & Logic** | Greedy Min-Cashflow Algorithm ($O(N \log N)$), Haversine GPS formula, WGS84 Geofencing ($\le 100\text{m}$) |
| **External Providers** | Amadeus Flight Offers API, RapidAPI Hotels, Google Maps Distance Matrix |
