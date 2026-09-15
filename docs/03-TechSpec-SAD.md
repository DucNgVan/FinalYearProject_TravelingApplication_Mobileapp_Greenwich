# SOFTWARE ARCHITECTURE DOCUMENT (SAD) & TECHNICAL SPECIFICATION
## NOMADIX — 5-Tier Modular Monolith & Polyglot Persistence (C4+1 Model)

---

### DOCUMENT CONTROL & ARCHITECTURAL BASELINE
* **Architectural Style:** Microservice-Ready Modular Monolith (5-Tier)
* **Standard:** Simon Brown C4 Model & Philippe Kruchten 4+1 View Model
* **Author / Candidate:** Nguyen Van Duc (DucNgVan)
* **Institution:** University of Greenwich (BSc Computing FYP)
* **Status:** 100% Implemented & Verified (298/298 Tests GREEN)

---

## 1. ARCHITECTURAL DRIVERS & DESIGN PRINCIPLES

Nomadix is engineered around four immutable architectural pillars:
1. **Polyglot Database Optimization:** Deploying PostgreSQL for strict ACID financial ledgers, MongoDB Atlas for flexible multi-day polymorphic timelines, and Redis for sub-50ms cache-aside RAM latency.
2. **Extreme Programming & Test-Driven Development (TDD):** 100% of domain services, controllers, and state stores are developed strictly via RED $\rightarrow$ GREEN $\rightarrow$ REFACTOR cycles with $\ge 80\%$ branch coverage.
3. **Dual-Mode Repository Pattern:** Core repositories support dual backends: direct database pool drivers for production, and high-fidelity in-memory stores for instantaneous, zero-dependency CI/CD testing.
4. **Resilient Circuit-Breaker Integration:** External providers (Duffel NDC Flights, Google Places, Mapbox) are insulated with fallback catalogs ensuring 100% system availability even during external outages.

---

## 2. C4 LEVEL 1: SYSTEM CONTEXT DIAGRAM

The System Context diagram illustrates the boundaries of Nomadix and its interactions with human actors and external cloud services:

```mermaid
flowchart TD
    User(["👤 Traveler / Squad Member\n(iOS / Android Client)"])
    NomadixSystem["📦 Nomadix Travel Platform\n(Modular Monolith System)"]
    
    DuffelAPI["✈️ Duffel Flights NDC API\n(Live Flight Offers, Baggage, CO2)"]
    GooglePlacesAPI["📍 Google Places API (New)\n(Attraction & Hotel Search)"]
    MapboxCDN["🗺️ Mapbox GL JS / Tiles\n(Interactive Vector Maps)"]
    CloudinaryAPI["☁️ Cloudinary Storage\n(Bill Receipts & WebP Media)"]
    BankAPI["💳 Banking & VietQR\n(Debt Settlement Transfers)"]

    User <-->|"Searches flights, co-plans itineraries,\nsplits bills via HTTPS / JWT"| NomadixSystem
    NomadixSystem <-->|"Queries live flight manifests\n(Bearer Auth)"| DuffelAPI
    NomadixSystem <-->|"Searches hotels & attractions\n(API Key)"| GooglePlacesAPI
    NomadixSystem <-->|"Loads map vector tiles\n(Access Token)"| MapboxCDN
    NomadixSystem <-->|"Uploads compressed bill receipts"| CloudinaryAPI
    NomadixSystem -.->|"Generates payment deep-links"| BankAPI
```

---

## 3. C4 LEVEL 2: CONTAINER DIAGRAM (5-TIER ARCHITECTURE)

Nomadix divides responsibilities into 5 cleanly decoupled tiers:

```mermaid
flowchart TD
    subgraph Tier1["TIER 1: PRESENTATION LAYER (CROSS-PLATFORM CLIENT)"]
        MobileApp["📱 React Native Mobile App\n(Expo SDK 57, React 19, Zustand Stores)"]
        WebDashboard["🖥️ Panoramic Web Showcase\n(Tailwind CSS, Mapbox GL JS v3)"]
    end

    subgraph Tier2["TIER 2: API GATEWAY & SECURITY LAYER"]
        APIGateway["🛡️ Express Gateway\n(Helmet, CORS, Joi DTO Validation, Rate Limiter)"]
        AuthMiddleware["🔐 JWT Bearer Auth & RBAC Middleware"]
    end

    subgraph Tier3["TIER 3: APPLICATION & DOMAIN SERVICES"]
        AuthService["Auth & Token Service\n(Bcrypt, JWT 15m, Refresh SHA-256)"]
        BookingService["Booking Aggregator Service\n(Normalizer, Deduplication, Filters)"]
        ItineraryService["Itinerary & Squad Service\n(Haversine Routing, Drag-Drop)"]
        PlacesService["Places & AI Planning Service\n(HAC Clustering + TSP Heuristic)"]
        ExpenseService["Group Expense & Debt Service\n(Greedy Min-Cashflow O(N log N))"]
    end

    subgraph Tier4["TIER 4: ADAPTER & EXTERNAL INTEGRATION LAYER"]
        DuffelAdapter["Duffel NDC Adapter"]
        GoogleAdapter["Google Places Adapter"]
        CloudinaryAdapter["Cloudinary Receipt Adapter"]
    end

    subgraph Tier5["TIER 5: POLYGLOT PERSISTENCE LAYER"]
        PostgresDB[("🐘 PostgreSQL 16 (Relational ACID)\nUsers, Roles, Bookings, 3NF Expense Ledger")]
        MongoDB[("🍃 MongoDB Atlas 7.0 (Document)\nItineraries, Embedded Stops, Collaborators")]
        RedisCache[("⚡ Redis 7.0 (In-Memory RAM)\nFlight/Hotel Cache, Rate-Limit Nonces")]
    end

    MobileApp -->|"HTTPS / JSON"| APIGateway
    WebDashboard -->|"HTTPS / JSON"| APIGateway
    APIGateway --> AuthMiddleware
    AuthMiddleware --> AuthService
    AuthMiddleware --> BookingService
    AuthMiddleware --> ItineraryService
    AuthMiddleware --> PlacesService
    AuthMiddleware --> ExpenseService

    BookingService --> DuffelAdapter
    BookingService --> GoogleAdapter
    PlacesService --> GoogleAdapter
    ExpenseService --> CloudinaryAdapter

    AuthService --> PostgresDB
    BookingService --> RedisCache
    BookingService --> PostgresDB
    ItineraryService --> MongoDB
    PlacesService --> RedisCache
    ExpenseService --> PostgresDB
```

---

## 4. C4 LEVEL 3: COMPONENT DIAGRAM (MODULAR MONOLITH CORE)

Inside the Node.js / Express backend container, components communicate strictly via defined interfaces:

```mermaid
flowchart LR
    subgraph Controllers["API Controllers"]
        AC["AuthController"]
        BC["Flight/HotelController"]
        IC["ItineraryController"]
        EC["ExpenseController"]
        PC["PlacesController"]
    end

    subgraph Services["Domain Services"]
        AS["AuthService"]
        BS["BookingService"]
        IS["ItineraryService"]
        ES["ExpenseService"]
        PS["PlacesService"]
        NS["NormalizerService"]
        CS["CacheService"]
    end

    subgraph Engines["Mathematical Engines"]
        DE["DebtSimplificationEngine\n(Greedy Min-Cashflow O(N log N))"]
        HE["HaversineTransitEngine\n(WGS84 Great-Circle Distances)"]
        AE["AiClusteringEngine\n(Hierarchical Agglomerative)"]
    end

    subgraph Repositories["Dual-Mode Repositories"]
        UR["UserRepository (PG / Mock)"]
        IR["ItineraryRepository (Mongo / Mock)"]
        ER["ExpenseRepository (PG ACID / Mock)"]
    end

    AC --> AS --> UR
    BC --> BS
    BS --> NS
    BS --> CS
    IC --> IS --> IR
    IS --> HE
    PC --> PS --> AE
    EC --> ES --> ER
    ES --> DE
```

---

## 5. C4 LEVEL 4: CODE & DATA SCHEMA SPECIFICATION

### 5.1 Relational Financial Ledger Standard (PostgreSQL 16 in 3NF)
All monetary balances are stored using `NUMERIC(12, 2)` to eliminate floating-point precision loss:

```sql
-- PostgreSQL Strict Financial Ledger Schema (Excerpt)
CREATE TABLE trip_expenses (
    id VARCHAR(50) PRIMARY KEY,
    trip_id VARCHAR(50) NOT NULL,
    payer_id VARCHAR(50) NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    split_type VARCHAR(20) NOT NULL CHECK (split_type IN ('equal', 'exact', 'percentage', 'shares')),
    receipt_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trip_expense_splits (
    id VARCHAR(50) PRIMARY KEY,
    expense_id VARCHAR(50) NOT NULL REFERENCES trip_expenses(id) ON DELETE CASCADE,
    user_id VARCHAR(50) NOT NULL REFERENCES users(id),
    split_value NUMERIC(12, 2) NOT NULL,
    computed_amount NUMERIC(12, 2) NOT NULL CHECK (computed_amount >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trip_settlements (
    id VARCHAR(50) PRIMARY KEY,
    trip_id VARCHAR(50) NOT NULL,
    debtor_id VARCHAR(50) NOT NULL REFERENCES users(id),
    creditor_id VARCHAR(50) NOT NULL REFERENCES users(id),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
    paid_at TIMESTAMP WITH TIME ZONE
);
```

### 5.2 Polymorphic Document Schema (MongoDB Atlas 7.0)
Itineraries leverage 1:Few embedding for sub-15ms single-trip reads:

```json
{
  "_id": "itin_67890",
  "title": "Da Nang - Hoi An 4N3D Squad Trip",
  "destination": "Đà Nẵng",
  "startDate": "2026-11-01T00:00:00Z",
  "endDate": "2026-11-04T00:00:00Z",
  "collaborators": [
    { "userId": "usr_01", "role": "OWNER", "status": "ACCEPTED", "joinedAt": "2026-10-15T08:00:00Z" },
    { "userId": "usr_02", "role": "EDITOR", "status": "ACCEPTED", "joinedAt": "2026-10-15T09:30:00Z" }
  ],
  "days": [
    {
      "dayNumber": 1,
      "date": "2026-11-01",
      "items": [
        {
          "id": "stop_01",
          "name": "Bãi biển Mỹ Khê",
          "lat": 16.0592,
          "lng": 108.2435,
          "category": "beach",
          "transitToNext": { "distanceKm": 8.4, "durationMin": 15, "mode": "driving" }
        }
      ]
    }
  ]
}
```

---

## 6. +1 PROCESS VIEW: DYNAMIC EXECUTION SEQUENCES

### 6.1 Process 1: Smart Booking Search with Redis Cache-Aside
```mermaid
sequenceDiagram
    autonumber
    actor User as Mobile Client
    participant GW as API Gateway
    participant BS as BookingService
    participant RC as Redis Cache
    participant DP as Duffel Provider
    participant GP as Google Places

    User->>GW: GET /api/v1/flights/search?origin=SGN&destination=HAN&date=2026-11-01
    GW->>BS: searchFlights(query)
    BS->>RC: GET nomadix:flight:SGN:HAN:2026-11-01
    alt Cache Hit (Latency < 10ms)
        RC-->>BS: Cached UnifiedFlight[]
    else Cache Miss
        BS->>DP: Query Live Duffel Flights API
        DP-->>BS: Raw Duffel Offers (87 flights)
        BS->>BS: Normalize, filter & deduplicate
        BS->>RC: SETEX nomadix:flight:... TTL=1800s
    end
    BS-->>GW: Enveloped Result { success: true, data: { flights } }
    GW-->>User: 200 OK + Render FlightCards with Airline Logos
```

### 6.2 Process 2: Group Expense Creation & Greedy Debt Simplification
```mermaid
sequenceDiagram
    autonumber
    actor SquadMember as Squad Member (Payer)
    participant GW as Express Gateway
    participant ES as ExpenseService
    participant PG as PostgreSQL (ACID)
    participant DE as DebtSimplificationEngine

    SquadMember->>GW: POST /api/v1/trips/:tripId/expenses (Amount: 1,200,000 VND, Split: Equal)
    GW->>ES: createExpense(tripId, payload)
    Note over ES,PG: Execute within BEGIN ... COMMIT transaction
    ES->>PG: INSERT INTO trip_expenses (...)
    ES->>PG: INSERT INTO trip_expense_splits (...) (Compute exact splits & remainders)
    PG-->>ES: Transaction Committed
    ES->>DE: calculateSimplifiedDebts(tripId)
    Note over DE: 1. Calculate NetBalances (Sum = 0)<br/>2. Separate into Debtors & Creditors<br/>3. Greedy match max debtor to max creditor
    DE-->>ES: Minimized settlements (Condenses 6 debts -> 2 payments)
    ES-->>GW: Consolidated Balance Sheet & Settlement Plan
    GW-->>SquadMember: 201 Created
```

---

## 7. MATHEMATICAL & ALGORITHMIC SPECIFICATIONS

### 7.1 Haversine Distance Algorithm
Calculates the great-circle distance between two geographic coordinates $(lat_1, lng_1)$ and $(lat_2, lng_2)$ on Earth radius $R = 6,371\text{km}$:
$$a = \sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lng}}{2}\right)$$
$$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right)$$
$$d = R \cdot c$$

Transit duration is computed using velocity models: driving ($35\text{km/h}$ city), walking ($4.5\text{km/h}$), transit ($25\text{km/h}$).

### 7.2 Greedy Minimum Cash-Flow Reduction Algorithm
* **Input:** A directed debt graph $G = (V, E)$ where vertices are squad members and directed edges represent debts.
* **Net Balance Invariant:**
  $$\forall u \in V, \quad \text{NetBalance}(u) = \sum \text{Credit}(u) - \sum \text{Debit}(u), \quad \text{Invariant:} \sum_{u \in V} \text{NetBalance}(u) = 0$$
* **Algorithm Mechanism:**
  1. Construct two Max-Priority Queues: `Debtors` (members with $\text{NetBalance} < 0$) and `Creditors` (members with $\text{NetBalance} > 0$).
  2. Pop the maximum debtor $D$ and maximum creditor $C$.
  3. Settle amount $S = \min(|D|, C)$.
  4. Emit direct payment: $D \xrightarrow{S} C$.
  5. Update remaining balances and re-insert if $> 0.00$.
* **Complexity:** Time $O(N \log N)$ where $N = |V|$, space $O(N)$, producing at most $N-1$ settlement edges.
