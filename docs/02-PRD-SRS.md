# PRODUCT REQUIREMENTS DOCUMENT (PRD) & SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## NOMADIX — Smart Collaborative Travel Platform & Group Expense Splitting

---

### DOCUMENT CONTROL & COMPLIANCE
* **Standard:** ISO/IEC/IEEE 29148:2018 & IEEE Std 830-1998
* **Academic Institution:** University of Greenwich (BSc Computing FYP)
* **Author / Candidate:** Nguyen Van Duc (DucNgVan)
* **Version:** 1.0.0
* **Scope:** 42 Functional Requirements, 8 Non-Functional Requirements, BDD Specifications & Traceability Matrix

---

## 1. INTRODUCTION & PRODUCT SCOPE

### 1.1 Purpose
This document provides the definitive, unambiguous functional and non-functional specifications for the **Nomadix** software platform. It serves as the baseline contract between requirements, architectural design, database schemas, and the 298-test automated TDD verification suite.

### 1.2 Product Vision & Core Modules
Nomadix is structured as a **Microservice-ready Modular Monolith** supporting cross-platform mobile access (React Native / Expo SDK 57) across 7 specialized functional modules:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                NOMADIX MODULAR SCOPE                                   │
├───────────────┬────────────────────────────────────────────┬───────────────────────────┤
│ Module ID     │ Module Name                                │ Release Milestone         │
├───────────────┼────────────────────────────────────────────┼───────────────────────────┤
│ **MOD-01**    │ User Identity, Security & RBAC             │ Core MVP (100% GREEN)     │
│ **MOD-02**    │ Smart Booking Aggregator (Flights & Hotels)│ Core MVP (100% GREEN)     │
│ **MOD-03**    │ Collaborative Itinerary Planner & Maps     │ Core MVP (100% GREEN)     │
│ **MOD-04**    │ Group Expense Tracking & Bill Splitting    │ Core MVP (100% GREEN)     │
│ **MOD-PLACES**│ Global Places Discovery & AI HAC Clustering│ Core MVP (100% GREEN)     │
│ **MOD-05**    │ Cultural Gamification & Location Check-ins │ Post-MVP (Extended)       │
│ **MOD-06**    │ Verified Community Travel Forum            │ Post-MVP (Extended)       │
│ **MOD-07**    │ Admin Moderation & Audit Console           │ Post-MVP (Extended)       │
└───────────────┴────────────────────────────────────────────┴───────────────────────────┘
```

---

## 2. FUNCTIONAL REQUIREMENTS SPECIFICATION (42 FRS)

### 2.1 Module 1: User Identity, Security & RBAC (`FR-01` to `FR-05`)
* **`FR-01` (User Registration):** The system shall allow users to register with full name, unique email, and password. Passwords MUST be hashed with Bcrypt (minimum 12 rounds) before persistence.
* **`FR-02` (User Authentication):** The system shall authenticate users and issue a short-lived JSON Web Token (JWT, 15-minute expiry) in the response payload.
* **`FR-03` (Refresh Token Rotation):** The system shall issue a 7-day refresh token stored as a SHA-256 hash in PostgreSQL `user_refresh_tokens`, invalidating the old token upon reissue.
* **`FR-04` (Role-Based Access Control):** The system shall enforce RBAC with 3 default roles (`USER`, `MODERATOR`, `ADMIN`).
* **`FR-05` (Input Validation):** All incoming authentication requests MUST be validated against Joi DTO schemas, rejecting invalid emails or weak passwords with `400 Bad Request`.

### 2.2 Module 2: Smart Booking Aggregator (`FR-06` to `FR-11`)
* **`FR-06` (Multi-Provider Flight Search):** The system shall query the Duffel NDC Live API and resilient domestic mock providers (Vietnam Airlines, Vietjet, Bamboo) in parallel.
* **`FR-07` (Multi-Provider Hotel Search):** The system shall search hotels via Google Places API v1 (SearchText) and curated catalogs.
* **`FR-08` (Normalization & Deduplication):** Heterogeneous raw provider payloads MUST be normalized into unified `UnifiedFlight` and `UnifiedHotel` schemas, removing duplicate offers and prioritizing lowest price.
* **`FR-09` (Redis Cache-Aside Layer):** Search results MUST be cached in Redis with deterministic keys (`nomadix:flight:...` TTL 1800s, `nomadix:hotel:...` TTL 3600s).
* **`FR-10` (Multi-Facet Filtering & Sorting):** The client shall support filtering by `directOnly`, baggage allowance, price range, and sorting by duration or departure time.
* **`FR-11` (Sandbox Instant Booking & Boarding Pass):** The system shall support instant sandbox ticket generation with airline logos, airport codes, and visual barcode boarding passes.

### 2.3 Module 3: Collaborative Itinerary Planner & Maps (`FR-12` to `FR-17`)
* **`FR-12` (Multi-Day Itinerary Management):** The system shall store itineraries with embedded days and stops in MongoDB Atlas 7.0.
* **`FR-13` (Squad Collaboration & Roles):** Users can invite friends to itineraries with designated roles: `OWNER` (full control), `EDITOR` (add/edit stops), `VIEWER` (read-only).
* **`FR-14` (Haversine Transit Calculation):** The system shall automatically calculate great-circle distances and transit durations between successive stops on the WGS84 ellipsoid.
* **`FR-15` (Timeline Reordering):** Users shall be able to reorder stops within a day or move stops between days atomically.
* **`FR-16` (Global Places Discovery & Wishlist):** Users shall search attractions on a Mapbox GL JS map and curate a wishlist prior to scheduling.
* **`FR-17` (AI Hierarchical Agglomerative Clustering):** The system shall automatically cluster wishlisted attractions into daily routes minimizing total transit time using HAC + TSP heuristic.

### 2.4 Module 4: Group Expenses & Bill Splitting Hub (`FR-36` to `FR-42`)
* **`FR-36` (ACID Financial Ledger):** All group expense creations, updates, and splits MUST execute inside PostgreSQL ACID transactions (`BEGIN...COMMIT`) with `NUMERIC(12, 2)` columns.
* **`FR-37` (Multi-Model Expense Splitting):** The system shall support 4 splitting mechanisms: `Equal`, `Exact amounts`, `Percentages` ($\sum = 100\%$), and `Shares`.
* **`FR-38` (Remainder Cent/Dong Distribution):** In equal splits with non-divisible totals, remainders MUST be distributed cent-by-cent to prevent precision loss.
* **`FR-39` (Zero-Sum Invariant):** The system shall enforce that the sum of all members' net balances in a trip is strictly zero: $\sum_{i=1}^N \text{NetBalance}_i = 0$.
* **`FR-40` (Greedy Minimum Cash-Flow Reduction):** The system shall simplify group debts using dual priority queues, condensing $N(N-1)/2$ multi-member debts into at most $N-1$ direct settlement payments in $O(N \log N)$ time.
* **`FR-41` (Receipt Storage):** The system shall support uploading bill receipt images to Cloudinary with automated WebP compression.
* **`FR-42` (Debt Settlement Lifecycle):** Users can mark settlement payments as `PAID`, atomically updating member ledger balances.

### 2.5 Extended Modules: Gamification, Community & Admin (`FR-18` to `FR-35`)
* **`FR-18` to `FR-22`:** Geofenced check-in verification within 100m radius of historical landmarks using PostGIS/Haversine.
* **`FR-23` to `FR-28`:** Cultural quizzes, XP progression, and badge reward minting.
* **`FR-29` to `FR-35`:** Community Q&A forum with verified traveler badges and upvoting.

---

## 3. NON-FUNCTIONAL REQUIREMENTS SPECIFICATION (8 NFRS)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         NON-FUNCTIONAL REQUIREMENTS MATRIX                             │
├─────────┬───────────────────┬──────────────────────────────────────────────────────────┤
│ NFR ID  │ Dimension         │ Specific Measurable Target                               │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-01  │ Read Latency      │ Itinerary timeline reads $\le 15\text{ms}$ ($P_{95}$)    │
│         │                   │ via MongoDB compound index on `collaborators.userId`.    │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-02  │ Financial Ledger  │ Strict zero floating-point error using `NUMERIC(12, 2)`. │
│         │ Accuracy          │ Transaction rollback on any split imbalance.             │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-03  │ Security & Auth   │ Bcrypt $\ge 12$ rounds; JWT 15-min expiration;           │
│         │                   │ SHA-256 hashed refresh token in database.                │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-04  │ External Quota    │ $\ge 70\%$ cache hit ratio on repeated flight/hotel      │
│         │ Protection        │ queries via Redis Cache-Aside.                           │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-05  │ Code Quality      │ $\ge 80\%$ Branch Coverage, $\ge 90\%$ Statement Coverage│
│         │ (TDD Mandate)     │ across all business domain services.                     │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-06  │ Cross-Platform UX │ 60 FPS mobile rendering on iOS and Android with dynamic  │
│         │                   │ Light/Dark theme switching without UI artifacts.         │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-07  │ Fault Tolerance   │ Graceful degradation: in-memory mock fallback if Duffel, │
│         │                   │ Google Places, or PostgreSQL/MongoDB are unreachable.    │
├─────────┼───────────────────┼──────────────────────────────────────────────────────────┤
│ NFR-08  │ Data Portability  │ Clean JSON REST envelope standard for all endpoints:     │
│         │                   │ `{ "success": true, "data": { ... } }`.                  │
└─────────┴───────────────────┴──────────────────────────────────────────────────────────┘
```

---

## 4. USER STORIES WITH BDD ACCEPTANCE CRITERIA

### US-01: Collaborative Group Debt Simplification
* **As a** Squad Leader on a multi-day group vacation,
* **I want** the system to automatically simplify who owes whom into the minimum number of payments,
* **So that** our group avoids dozens of tangled bank transfers and avoids financial arguments.

```gherkin
Feature: Greedy Debt Simplification Engine
  Scenario: Simplify multi-member tangled debts
    Given a trip with 4 members: "Alice", "Bob", "Charlie", and "David"
    And Alice paid 1,200,000 VND for shared dinner split equally
    And Bob paid 800,000 VND for taxi split equally
    When the system executes the Greedy Minimum Cash-Flow algorithm
    Then the total net balance of all 4 members must equal 0 VND
    And the total number of settlement transactions must be <= 3
    And Alice should receive her net positive creditor balance
```

### US-02: AI Itinerary Clustering from Wishlist
* **As a** Traveler browsing attractions on an interactive map,
* **I want** to select interesting places and have AI organize them into daily schedules,
* **So that** I don't waste time traveling back and forth across the city.

```gherkin
Feature: AI Hierarchical Agglomerative Clustering
  Scenario: Cluster 6 attractions across Da Nang into a 2-day trip
    Given a user has selected 6 attractions in Da Nang on the map
    When the user clicks "AI Lên Lịch Trình" with a 2-day duration
    Then the system clusters geographically proximate stops together
    And Day 1 contains coastal stops (My Khe, Marble Mountains)
    And Day 2 contains city center stops (Dragon Bridge, Han Market)
    And each stop has calculated Haversine transit time estimates
```

---

## 5. REQUIREMENTS TRACEABILITY MATRIX (RTM)

| FR ID | Description | Database Table / Collection | Backend Service | Client Screen | Test Suite ID |
|:---:|---|---|---|---|:---:|
| `FR-01` | Register & Bcrypt | PostgreSQL `users` | `AuthService` | `RegisterScreen` | `auth.register.test.js` |
| `FR-02` | Login & JWT 15m | PostgreSQL `users` | `TokenService` | `LoginScreen` | `auth.login.test.js` |
| `FR-06` | Duffel Flights API | Redis `nomadix:flight:...` | `BookingService` | `FlightSearchScreen` | `duffel.provider.test.js` |
| `FR-12` | Itinerary Mongo | MongoDB `itineraries` | `ItineraryService` | `PlanScreen` | `itinerary.service.test.js`|
| `FR-14` | Haversine Routing | MongoDB `items.transitToNext` | `geo.util.js` | `PlanScreen` | `geo.util.test.js` |
| `FR-17` | AI HAC Clustering | Redis `nomadix:places:...` | `PlacesService` | `PlanMapDiscovery` | `places.service.test.js` |
| `FR-36` | ACID Expense Splits | PostgreSQL `trip_expenses` | `ExpenseService` | `PlanScreen` | `expense.crud.test.js` |
| `FR-40` | Greedy Debt Engine | PostgreSQL `trip_settlements`| `debt.util.js` | `PlanScreen` | `debt.util.test.js` |
