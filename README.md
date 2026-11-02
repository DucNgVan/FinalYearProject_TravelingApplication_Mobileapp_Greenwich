# 🌍 Nomadix — Smart Collaborative Travel Platform & Expense Splitting

> **Final Year Project (FYP) — University of Greenwich**  
> **Student:** Nguyễn Văn Đức (DucNgVan) — `ducnva.wk@gmail.com`  
> **Degree Program:** BSc (Hons) Computing  
> **Current Status:** Phase 5 Active (Module 4 Group Expense Ledger, Greedy Debt Simplification & Cross-DB Guard Complete - 100% TDD GREEN)  

---

## 📖 Project Overview
Nomadix is a modern collaborative travel mobile platform designed to streamline squad trip planning and automated shared expense settlement. It eliminates "app sprawl" by combining flight/hotel booking discovery, real-time shared multi-day itineraries, and in-trip group expense splitting into one seamless mobile experience.

### 🎯 Key Value Pillars
1. **Smart Booking Discovery:** Aggregation of live flight NDC offers and accommodations with sub-50ms Redis cache-aside response.
2. **Collaborative Itinerary Planning:** Interactive mapping with synchronized squad timeline and multi-city route visualization.
3. **Group Expense Ledger & Debt Simplification:** In-trip shared financial ledger with automated debt reduction algorithm minimizing payments among squad members.

---

## 🚀 Backend Implementation Progress (Module 1, 2, 3 & 4 Complete)
* **Module 1 (Auth & RBAC):** Bcrypt 12 rounds, JWT + SHA-256 Refresh Token rotation, Dual-mode UserRepository, Joi DTO validation.
* **Module 2 (Smart Booking Aggregator):**
  * Live Duffel NDC Flights API integration with aircraft details, baggage policies, and CO2 carbon emissions.
  * Google Places API (New) adapter for accommodations and domestic high-fidelity mock fallback.
  * `NormalizerService`: Heterogeneous data standardization to `UnifiedFlight` and `UnifiedHotel` with price-optimized deduplication.
  * `CacheService`: Redis Cache-Aside engine with sub-50ms RAM latency (TTL 1800s flights / 3600s hotels).
* **Module 3 (Collaborative Itinerary Planner & Maps):**
  * Mongoose Schema for MongoDB Atlas 7.0 supporting multi-day timelines (`days[]`), activities (`items[]`), and squad members (`collaborators[]`).
  * `GeoUtil`: Haversine great-circle distance algorithm on WGS84 ellipsoid & multi-modal transit duration calculator.
  * `ItineraryService`: Creation, stop additions with automated distance calculation, atomic drag-and-drop timeline reordering, and squad role authorization (`OWNER`, `EDITOR`, `VIEWER`).
* **Module 4 (Group Expense Tracking & Bill Splitting Hub):**
  * PostgreSQL 16 ACID financial ledger (`trip_expenses`, `trip_expense_splits`, `trip_settlements`) with atomic transaction lifecycle (`BEGIN...COMMIT/ROLLBACK`).
  * `DebtUtil`: Greedy Minimum Cash-Flow Reduction Algorithm ($O(N \log N)$) condensing tangled multi-member debts to at most $N-1$ direct payments while preserving zero-sum balance invariant ($\sum \text{NetBalance}_i = 0$).
  * 4 split modes supported: Equal (`equal`), Exact (`exact`), Percentage (`percentage`), and Shares (`shares`) with remainder cent/dong redistribution eliminating rounding losses.
  * Cloudinary receipt integration with automated WebP conversion and client-side compression.
  * `CrossDbIntegrityService`: Cross-database consistency guard detecting orphan PostgreSQL expense records and executing compensating rollbacks.
* **Global Places & AI Clustering:**
  * Curated global places search and hierarchical clustering algorithm minimizing inter-stop travel time across itinerary days.
* **Testing & Quality:**
  * 100% TDD GREEN (All 36 backend test suites passed, 136 tests passing with >= 80% branch coverage).
* **Active Endpoints:**
  * `GET /`: API Manifest
  * `GET /health`: System health status
  * `POST /api/v1/auth/register`: User registration
  * `POST /api/v1/auth/login`: User login
  * `GET /api/v1/flights/search`: Flight offers aggregation, multi-facet filtering & sorting
  * `GET /api/v1/hotels/search`: Hotel discovery & accommodation search
  * `POST /api/v1/itineraries`: Create new multi-day collaborative trip
  * `GET /api/v1/itineraries`: List user trips (as owner or collaborator)
  * `GET /api/v1/itineraries/:id`: Fetch detailed trip timeline & collaborators
  * `DELETE /api/v1/itineraries/:id`: Remove trip (Owner only)
  * `POST /api/v1/itineraries/:id/collaborators`: Invite squad companion
  * `PATCH /api/v1/itineraries/:id/collaborators/:userId/status`: Accept/decline squad invitation
  * `POST /api/v1/itineraries/:id/days/:dayNumber/items`: Add stop to day timeline (with auto-calculated Haversine transit)
  * `PUT /api/v1/itineraries/:id/days/:dayNumber/reorder`: Atomic drag-and-drop reordering of stops
  * `POST /api/v1/trips/:tripId/expenses`: Record group expense with split allocations
  * `GET /api/v1/trips/:tripId/expenses`: List all trip expenses and splits
  * `POST /api/v1/trips/:tripId/expenses/receipt`: Upload bill receipt image to Cloudinary
  * `GET /api/v1/trips/:tripId/expenses/summary`: Member net balance sheet
  * `GET /api/v1/trips/:tripId/debts/settlement-plan`: Optimized minimal debt settlement plan
  * `POST /api/v1/trips/:tripId/debts/settle`: Settle debt between members
  * `GET /api/v1/places/search`: Global places search with category filtering
  * `POST /api/v1/places/ai-plan`: Geographic clustering of places into multi-day itinerary

---

## 🔮 Next Milestone
* **Phase 6:** Client Mobile Application (React Native / Expo SDK 57) — Interactive Map Discovery, Multi-City Route Planner, Booking Hub, and Squad Expense Sharing UI.
