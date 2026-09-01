# 06. Core Functional Modules

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Modular Architecture Overview

Nomadix comprises seven core functional modules:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        NOMADIX SYSTEM MODULES                          │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Module 1                 │ Authentication & Profile                    │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 2                 │ Smart Booking Search                        │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 3                 │ Collaborative Itinerary Planner             │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 4                 │ Group Expense Tracking & Bill Splitting     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 5                 │ Cultural Gamification & Location Engine     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 6                 │ Community Q&A                               │
├──────────────────────────┼─────────────────────────────────────────────┤
│ Module 7                 │ Verified Travel Experience                  │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Module Specifications

### Module 1 — Authentication & Profile
* **Purpose:** Identity management, JWT session authorization, and travel profile stats.
* **Functions:** Register, Login, Logout, Profile edit, XP tracker, Level progression, Badges unlocked, Travel history.

### Module 2 — Smart Booking Search
* **Purpose:** Multi-provider travel option search and comparison.
* **Flight Search:** Origin, destination, dates, passenger count, cabin class, pricing, carrier, stops, duration.
* **Hotel Search:** Destination, check-in/out, guests, room type, nightly rate, amenities, ratings.
* **Normalization:** Standardized internal JSON schema with Mock Provider fallback and Redis cache.

### Module 3 — Collaborative Itinerary Planner
* **Purpose:** Multi-day travel schedule creation, companion collaboration, and route optimization.
* **Functions:** Create trip, set dates, add/remove destinations, drag-and-drop reordering, interactive Google Map route view, point-to-point distance and travel duration estimation, publish and clone itineraries.
* **Collaborative Capabilities:**
  * **Companion Invitations:** Invite fellow travelers by email, username, or shared trip invite code.
  * **Shared Itinerary View:** All group members view the identical real-time itinerary and map markers.
  * **Role-Based Trip Permissions:** `owner` (full control, invite/remove members), `editor` (add/edit activities, log expenses), `viewer` (read-only view).

### Module 4 — Group Expense Tracking & Bill Splitting
* **Purpose:** Transparent financial management and automated debt reconciliation for travel groups.
* **Functions:**
  * **Bill & Receipt Upload:** Capture or select receipt photos with Cloudinary hosting.
  * **Expense Logging:** Record expense item, payer (`paidBy`), total amount, currency (VND/USD), date, and category (Food & Drink, Stay, Transit, Tickets, Other).
  * **Flexible Splitting Models:** Split equally among all or selected members; custom split by percentage or exact amounts.
  * **Group Expense Dashboard:** Real-time summary of total trip spend, category breakdown charts, and individual member balance sheets ($+\text{to receive} / -\text{owed}$).
  * **Debt Simplification Engine:** Greedy minimum-cash-flow algorithm reducing transitive debts into the minimum number of direct settlement transactions.
  * **Settlement Ledger:** Record and mark debt settlements as paid upon confirmation.

### Module 5 — Cultural Gamification & Location Engine
* **Purpose:** On-site exploration and cultural learning.
* **Functions:** Landmark catalog, GPS geofence validation ($\le 100\text{m}$), native camera photo capture, Cloudinary photo upload, cultural quizzes, XP awards, Badge unlocking.

### Module 6 — Community Q&A
* **Purpose:** Destination-focused peer-to-peer knowledge sharing.
* **Functions:** Post questions, submit answers, threaded comments, filter by Country/City/Topic, report inappropriate content.

### Module 7 — Verified Travel Experience
* **Purpose:** Connect gamification achievements to community credibility.
* **Verification Rule:** When a user with a City Badge answers questions in that city's forum, the system attaches a visible **"City Verified"** indicator badge to their profile/answer and ranks it higher in the feed.
