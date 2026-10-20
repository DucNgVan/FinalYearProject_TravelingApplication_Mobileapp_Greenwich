# 🌍 Nomadix — Smart Collaborative Travel Platform & Expense Splitting

> **Final Year Project (FYP) — University of Greenwich**  
> **Student:** Nguyễn Văn Đức (DucNgVan) — `ducnva.wk@gmail.com`  
> **Degree Program:** BSc (Hons) Computing  
> **Current Status:** Phase 3 Active (Module 2 Smart Booking Aggregator Complete - 100% TDD GREEN)  

---

## 📖 Project Overview
Nomadix is a modern collaborative travel mobile platform designed to streamline squad trip planning and automated shared expense settlement.

### 🎯 Key Value Pillars
1. **Smart Booking Discovery:** Aggregation of live flight NDC offers and accommodations with sub-50ms Redis cache-aside response.
2. **Collaborative Itinerary Planning:** Interactive mapping with synchronized squad timeline and multi-city route visualization.
3. **Group Expense Ledger & Debt Simplification:** In-trip shared financial ledger with automated debt reduction algorithm minimizing payments among squad members.

---

## 🚀 Backend Implementation Progress (Module 1 & 2 Complete)
* **Module 1 (Auth & RBAC):** Bcrypt 12 rounds, JWT + SHA-256 Refresh Token rotation, Dual-mode UserRepository, Joi DTO validation.
* **Module 2 (Smart Booking Aggregator):**
  * Live Duffel NDC Flights API integration with aircraft details, baggage policies, and CO2 carbon emissions.
  * Google Places API (New) adapter for accommodations and domestic high-fidelity mock fallback.
  * `NormalizerService`: Heterogeneous data standardization to `UnifiedFlight` and `UnifiedHotel` with price-optimized deduplication.
  * `CacheService`: Redis Cache-Aside engine with sub-50ms RAM latency (TTL 1800s flights / 3600s hotels).
* **Testing & Quality:**
  * Backend Unit & Integration Tests: 100% Passing (128/128 tests GREEN).
* **Active Endpoints:**
  * `GET /`: API Manifest
  * `GET /health`: System health status
  * `POST /api/v1/auth/register`: User registration
  * `POST /api/v1/auth/login`: User login
  * `GET /api/v1/flights/search`: Flight offers aggregation, multi-facet filtering & sorting
  * `GET /api/v1/hotels/search`: Hotel discovery & accommodation search

---

## 🔮 Next Milestone
* **Phase 4:** Module 3 (Collaborative Itinerary Planner in MongoDB) & Module 4 (Group Expense Hub & Greedy Minimum Cash-Flow Reduction Algorithm in PostgreSQL).
