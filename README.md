# 🌍 Nomadix — Smart Collaborative Travel Platform & Expense Splitting

> **Final Year Project (FYP) — University of Greenwich**  
> **Student:** Nguyễn Văn Đức (DucNgVan) — `ducnva.wk@gmail.com`  
> **Degree Program:** BSc (Hons) Computing  
> **Current Status:** Phase 2 Complete (Backend Polyglot Infrastructure & Module 1 Auth/RBAC - 100% TDD GREEN)  

---

## 📖 Project Overview
Nomadix is a modern collaborative travel mobile platform designed to streamline squad trip planning and automated shared expense settlement.

### 🎯 Key Value Pillars
1. **Smart Booking Discovery:** Aggregation of live flight NDC offers and accommodations with sub-50ms Redis cache-aside response.
2. **Collaborative Itinerary Planning:** Interactive mapping with synchronized squad timeline and multi-city route visualization.
3. **Group Expense Ledger & Debt Simplification:** In-trip shared financial ledger with automated debt reduction algorithm minimizing payments among squad members.

---

## 🚀 Backend Implementation Progress (Module 1: Auth & RBAC Complete)
* **Polyglot Database Infrastructure:** Docker Compose running PostgreSQL 16 (Relational ACID), MongoDB 7.0 (Timelines), Redis 7.0 (RAM Cache).
* **Security & Authentication:**
  * Bcrypt password hashing (12 salt rounds, timing-safe equality check).
  * Dual-Token Session: 15-minute JWT Access Token + SHA-256 hashed Refresh Token with rotation.
  * Role-Based Access Control (RBAC): `TRAVELER`, `TOUR_GUIDE`, `PARTNER`, `ADMIN`.
* **Testing:** 100% TDD GREEN (Unit & Integration tests passing with >= 80% branch coverage).
* **Active Endpoints:**
  * `GET /`: API Manifest
  * `GET /health`: System health status
  * `POST /api/v1/auth/register`: New user registration
  * `POST /api/v1/auth/login`: User authentication & token issuance

---

## 🔮 Next Milestone
* **Phase 3:** Module 2 — Smart Booking Aggregator (Duffel Live NDC Flights API, Google Places, Normalizer Service & Redis Cache-Aside).
