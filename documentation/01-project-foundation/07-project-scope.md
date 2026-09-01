# 07. Project Scope & Boundary Definition

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Scope Classification

```text
┌─────────────────────────────────────────────────────────────┐
│                       PROJECT SCOPE                         │
├──────────────────────────────┬──────────────────────────────┤
│ 1. Must Have (Core MVP)      │ Required for core FYP        │
├──────────────────────────────┼──────────────────────────────┤
│ 2. Should Have               │ Implemented if time permits  │
├──────────────────────────────┼──────────────────────────────┤
│ 3. Future Development        │ Documented for roadmap       │
└──────────────────────────────┴──────────────────────────────┘
```

---

## 2. Feature Prioritization Breakdown

### 2.1 Must-Have Features (Core FYP)
* **Authentication:** User registration, login, JWT token auth, profile management.
* **Booking Search:** Flight search, hotel search, multi-provider results, filtering, data normalization, mock provider fallback.
* **Collaborative Itinerary:** Create trip, add/remove destinations, reorder activities, multi-day planning, Google Map display, distance & time calculation, publish & clone trips, **invite companions by username/email/code**, **synchronized multi-user view**, role permissions (`owner`, `editor`, `viewer`).
* **Group Expense Tracking & Bill Splitting:** Upload bill/receipt photos (Cloudinary), log group expenses across categories, split costs equally or custom (amounts/shares), group spending dashboard with net balances, and automated debt simplification algorithm.
* **Gamification:** Landmarks catalog, GPS geofence validation, check-in, camera photo upload, cultural quizzes, XP & badge engine.
* **Community:** Ask questions, post answers, filter by city categories, verified city badge indicators.

### 2.2 Should-Have Features (Post-Core Enhancements)
* **Redis Caching:** API response caching with measured latency improvements for the thesis.
* **Advanced Filtering:** Complex multi-parameter search filters.
* **Travel History:** Detailed visual trip logs.
* **Image Optimization:** Automated image compression on upload.
* **Community Moderation:** Flag and report inappropriate content.
* **Badge Levels:** Tiered progression for badges (Bronze, Silver, Gold).
* **Expense Receipt OCR:** Optional automated text extraction from uploaded bills.

### 2.3 Future Development (Deferred Features)
* AI Travel Assistant (LLM conversational planner).
* Direct Bank-to-Bank Automated Settlement (Stripe Connect / Direct API banking wire clearing).
* Advanced GPS Anti-cheat (mock-location sensor detection).
* Real-time 1-on-1 private chat.
* Social following feeds.
* ML personalized recommendation engine.

---

## 3. Core Design Principle

> **"Every feature must contribute to the cohesive solo and group travel lifecycle."**

```text
BOOKING → CO-PLANNING → TRAVEL TOGETHER → SHARED EXPENSES → GAMIFICATION → COMMUNITY
```

---

## 4. Final Scope Map

```text
                                NOMADIX
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         │                         │                         │
         ▼                         ▼                         ▼
      DISCOVER               PLAN & CO-TRAVEL             EXPERIENCE
         │                         │                         │
         ▼                         ▼                         ▼
      Booking             Collaborative Trip                GPS
      Search             Invite Companions & Sync         Check-in
      Compare                Interactive Map               Camera
      Filter               Distance & Duration              Quiz
         │                         │                         │
         │                         ▼                         │
         │                 GROUP EXPENSE HUB                 │
         │                 Upload Bill Receipts              │
         │                 Equal / Custom Split              │
         │                 Debt Simplification               │
         │                         │                         │
         └─────────────────────────┼─────────────────────────┘
                                   │
                                   ▼
                                GAMIFY
                                   │
                            ┌──────┴──────┐
                            ▼             ▼
                           XP           Badge
                            │             │
                            └──────┬──────┘
                                   ▼
                              COMMUNITY
                                   │
                            ┌──────┴──────┐
                            ▼             ▼
                         Question       Answer
                                           │
                                           ▼
                                    City Verification
```
