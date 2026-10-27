# 🌍 Nomadix — Smart Collaborative Travel Platform & Expense Splitting

> **Final Year Project (FYP) — University of Greenwich**  
> **Student:** Nguyễn Văn Đức (DucNgVan) — `ducnva.wk@gmail.com`  
> **Degree Program:** BSc (Hons) Computing  
> **Current Status:** Phase 4 Active (Module 3 Collaborative Itinerary Planner & Maps Complete - 100% TDD GREEN)  

---

## 📖 Project Overview
Nomadix is a modern collaborative travel mobile platform designed to streamline squad trip planning and automated shared expense settlement. It eliminates "app sprawl" by combining flight/hotel booking discovery, real-time shared multi-day itineraries, and in-trip group expense splitting into one seamless mobile experience.

### 🎯 Key Value Pillars
1. **Smart Booking Discovery:** Aggregation of live flight NDC offers and accommodations with sub-50ms Redis cache-aside response.
2. **Collaborative Itinerary Planning:** Interactive mapping with synchronized squad timeline and multi-city route visualization.
3. **Group Expense Ledger & Debt Simplification:** In-trip shared financial ledger with automated debt reduction algorithm minimizing payments among squad members.

---

## 🚀 Backend Implementation Progress (Module 1, 2 & 3 Complete)
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
* **Testing & Quality:**
  * 100% TDD GREEN (Unit & Integration tests passing with >= 80% branch coverage).
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

---

## 🔮 Next Milestone
* **Phase 5:** Module 4 — Group Expense Ledger & Greedy Minimum Cash-Flow Debt Reduction Algorithm ($O(N \log N)$) in PostgreSQL.
