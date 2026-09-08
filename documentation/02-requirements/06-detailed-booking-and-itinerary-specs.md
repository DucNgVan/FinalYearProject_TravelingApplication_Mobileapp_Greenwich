# 06. Detailed User Stories & BDD Acceptance Criteria: Booking Aggregator & Itinerary Planner

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Program:** BSc (Hons) Computing  
**Module Focus:** Epic 2 (Smart Booking Search & Aggregation) & Epic 3 (Interactive Itinerary Planner & Maps)  
**Methodology:** Agile / Scrum with Behavior-Driven Development (BDD Gherkin Syntax)  
**Traceability Mapping:** FR-06 to FR-18 | UC-02, UC-03, UC-07 | ISO/IEC 25010 Standards  

---

## 1. EXECUTIVE SUMMARY & ARCHITECTURAL FOUNDATION

The **Booking Aggregator** (Module 2) and **Itinerary Planner** (Module 3) constitute the core planning and execution engines of the **Nomadix** platform.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                NOMADIX ARCHITECTURAL MAPPING                           │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Booking Aggregator (Module 2) │ Node.js/Express Adapter Pattern + Redis Cache-Aside    │
│                               │ Heterogeneous OTA Normalization (Amadeus, RapidAPI)    │
│                               │ Sub-50ms Cache Hit Latency | Fallback Mock Provider    │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ Itinerary Planner (Module 3)  │ MongoDB Atlas Flexible Nested Document Store           │
│                               │ Google Maps Platform (Distance Matrix + Dynamic Poly)  │
│                               │ Haversine Offline Resilient Fallback | Drag-and-Drop   │
│                               │ One-Click Public Trip Cloning Engine                   │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

This specification document provides an exhaustive, industry-grade breakdown of **User Stories** and **BDD Acceptance Criteria (Given-When-Then)** covering Happy Paths, Alternative Flows, Negative Scenarios, Edge Cases, and Non-Functional Benchmarks.

---

## 2. MODULE 2: SMART BOOKING SEARCH & AGGREGATION (EPIC 2)

```
┌─────────────┬─────────────────────────────────────────────────┬──────────┬───────────┐
│ Story ID    │ User Story Title                                │ Priority │ Est. Pts  │
├─────────────┼─────────────────────────────────────────────────┼──────────┼───────────┤
│ US-BOOK-01  │ Multi-Criteria Flight Search Query & Validation │ MUST     │ 5 Pts     │
│ US-BOOK-02  │ Multi-Provider Parallel Aggregation & Resiliency│ MUST     │ 8 Pts     │
│ US-BOOK-03  │ Multi-Criteria Hotel Search & Room Parameters   │ MUST     │ 5 Pts     │
│ US-BOOK-04  │ Data Normalization & Duplicate De-duplication   │ MUST     │ 5 Pts     │
│ US-BOOK-05  │ Dynamic Multi-Facet Filtering & Multi-Key Sort  │ SHOULD   │ 3 Pts     │
│ US-BOOK-06  │ Two-Tier Redis Caching & Cache-Aside Management │ MUST     │ 5 Pts     │
│ US-BOOK-07  │ Secure Outbound Hand-off & Deep-link Redirection│ SHOULD   │ 3 Pts     │
└─────────────┴─────────────────────────────────────────────────┴──────────┴───────────┘
```

---

### `US-BOOK-01`: Multi-Criteria Flight Search Query & Validation

* **Story ID:** `US-BOOK-01` (Traces to `FR-06`, `UC-02`)
* **Role / Persona:** Independent Budget Traveler (`Traveler`)
* **User Story Statement:**
  > **As an** Independent Traveler,  
  > **I want to** search for one-way and round-trip flights by entering origin, destination, travel dates, passenger counts, and cabin class,  
  > **So that** I can explore available flights that match my journey schedule and party size without invalid queries reaching external APIs.
* **Priority:** `Must Have` (MoSCoW)
* **Estimation:** 5 Story Points
* **Pre-conditions:**
  1. The user has navigated to the Flight Search tab in the mobile application.
  2. The device possesses an active network connection.
* **Dependencies:** IATA Airport Code Registry, Form Validation Engine (Joi / Zod).

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 1.1: Successful Search with Valid Input Parameters (Happy Path)
```gherkin
Scenario: Valid One-Way Flight Search Submission
  Given the user is on the Flight Search screen
  When the user selects origin airport "HAN" (Noi Bai International)
    And the user selects destination airport "DAD" (Da Nang International)
    And the user selects a departure date 14 days from today
    And the user sets passengers to 1 Adult and cabin class to "ECONOMY"
    And the user clicks the "Search Flights" button
  Then the system validates all input fields successfully
    And the mobile app transitions to the Flight Results screen showing a shimmer loading skeleton
    And a GET request is dispatched to "/api/v1/flights/search?origin=HAN&destination=DAD&departureDate=YYYY-MM-DD&adults=1&cabinClass=ECONOMY"
    And the system responds with HTTP 200 OK containing an array of available flights
```

##### Scenario 1.2: Rejection of Departure Date in the Past (Validation Negative)
```gherkin
Scenario: Validation Rejection on Past Departure Date
  Given the user is on the Flight Search screen
  When the user selects a departure date earlier than the current date
  Then the date picker component visually disallows selection of past dates
  When the user attempts to bypass UI validation by dispatching an API call with departureDate = "2020-01-01"
  Then the API Gateway Joi validator rejects the payload with HTTP 400 Bad Request
    And the response body contains:
      """
      {
        "status": "fail",
        "message": "Validation Error: departureDate must be greater than or equal to today"
      }
      """
    And external OTA provider endpoints are not contacted
```

##### Scenario 1.3: Rejection of Identical Origin and Destination (Boundary / Edge Case)
```gherkin
Scenario: Rejection of Identical Origin and Destination Airports
  Given the user selects origin airport "SGN" (Tan Son Nhat)
  When the user attempts to select destination airport "SGN"
  Then the application displays an inline validation message: "Origin and destination cannot be identical"
    And the "Search Flights" button remains disabled
```

##### Scenario 1.4: Round-Trip Return Date Preceding Departure Date (Edge Case)
```gherkin
Scenario: Validation Rejection on Return Date Preceding Departure
  Given the user selects "Round Trip" trip type
    And the user sets departure date to "2026-11-20"
  When the user attempts to set return date to "2026-11-18"
  Then the UI automatically adjusts the return date minimum selectable date to "2026-11-20"
    And an inline alert warns "Return date cannot be earlier than departure date"
```

---

### `US-BOOK-02`: Multi-Provider Parallel Aggregation & Resiliency

* **Story ID:** `US-BOOK-02` (Traces to `FR-08`, `FR-35`, `UC-02`, `NFR-03`)
* **Role / Persona:** Backend Integration Layer (`System`)
* **User Story Statement:**
  > **As a** System Architect / Platform Consumer,  
  > **I want the** Booking Aggregator service to query multiple external providers (Amadeus, RapidAPI) concurrently and degrade gracefully to a Mock Provider upon failures,  
  > **So that** travelers always receive travel options within strict latency limits even when third-party partner APIs degrade or crash.
* **Priority:** `Must Have`
* **Estimation:** 8 Story Points
* **Technical Invariants:**
  1. Concurrency managed via `Promise.allSettled()`.
  2. Individual provider network timeout configured at $5000\text{ms}$.
  3. Circuit breaker/fallback: if all providers fail, return high-fidelity data from `MockBookingProvider`.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 2.1: Concurrent Multi-Provider Fetch under Normal Conditions (Happy Path)
```gherkin
Scenario: Concurrent Multi-Provider Query Execution
  Given Redis cache does not contain search results for key "nomadix:flight:HAN_DAD_2026-11-15_1_ECONOMY"
  When the BookingAggregatorService dispatches parallel requests to "AmadeusProvider" and "RapidApiProvider"
  Then both providers return HTTP 200 within 2500ms
    And the Aggregator consolidates results from both sources
    And the consolidated list is normalized and sent to the client within 3000ms
```

##### Scenario 2.2: Partial External Provider Failure (Resilience / Fault Tolerance)
```gherkin
Scenario: Graceful Handling of Single Provider Failure
  Given "RapidApiProvider" encounters an HTTP 503 Service Unavailable error or network timeout > 5000ms
    And "AmadeusProvider" responds successfully with 15 flight offers in 1800ms
  When the BookingAggregatorService evaluates the settled promises
  Then the failed provider error is logged into Winston logger as a warning without throwing an uncaught exception
    And the user receives the 15 valid offers from Amadeus
    And the response payload includes metadata:
      """
      {
        "status": "success",
        "providersQueried": 2,
        "providersSucceeded": 1,
        "data": [ ... ]
      }
      """
    And the mobile user experiences zero interruption or error dialogues
```

##### Scenario 2.3: Total External Provider Outage with Mock Fallback (Degraded Mode)
```gherkin
Scenario: Automated Fallback to Mock Provider on Catastrophic Partner Outage
  Given all external providers (Amadeus, RapidAPI) return network timeouts (> 5000ms) or rate limit 429 errors
  When the BookingAggregatorService detects zero successful external provider results
  Then the service activates "MockBookingProvider"
    And loads localized high-fidelity sample flight data matching HAN to DAD
    And returns the results to the client with response header "X-Data-Source: MOCK_FALLBACK"
    And the mobile app displays the flights normally with an unobtrusive notice: "Displaying cached partner preview rates"
```

---

### `US-BOOK-03`: Multi-Criteria Hotel Search & Room Parameters

* **Story ID:** `US-BOOK-03` (Traces to `FR-07`, `UC-02`)
* **Role / Persona:** Culture Explorer / Family Vacationer (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** search for accommodations by destination city, check-in/out dates, guest count, and required rooms,  
  > **So that** I can find suitable lodgings near cultural attractions within my budget.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Pre-conditions:** Check-in date $\ge$ today; Check-out date $>$ Check-in date.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 3.1: Successful Hotel Search Submission
```gherkin
Scenario: Successful Hotel Query by City and Guest Count
  Given the user selects destination city "Đà Nẵng"
    And sets check-in date to "2026-11-15" and check-out date to "2026-11-18" (3 nights)
    And sets guests to 2 Adults, 1 Child and rooms to 1
  When the user submits the search request
  Then the API dispatches "GET /api/v1/hotels/search?city=DaNang&checkIn=2026-11-15&checkOut=2026-11-18&guests=3&rooms=1"
    And returns a list of hotels including name, star rating, address, price per night, total price, and thumbnail image
    And total price is correctly calculated as: "pricePerNight * 3 nights"
```

##### Scenario 3.2: Rejection of Same-Day Check-in and Check-out
```gherkin
Scenario: Validation Rejection for Zero-Night Stay
  Given check-in date is set to "2026-11-15"
  When the user sets check-out date to "2026-11-15"
  Then the system rejects the input with an error: "Check-out date must be at least 1 day after check-in date"
    And the search query is blocked
```

##### Scenario 3.3: Exceeding Maximum Room/Guest Ratios
```gherkin
Scenario: Guest to Room Capacity Boundary Rejection
  Given the user sets rooms to 1
  When the user attempts to enter 15 guests for 1 room
  Then the validation engine returns an error: "A single room can accommodate a maximum of 4 guests"
```

---

### `US-BOOK-04`: Data Normalization & Duplicate De-duplication

* **Story ID:** `US-BOOK-04` (Traces to `FR-09`, `FR-10`, `UC-02`)
* **Role / Persona:** Backend Normalizer Engine (`System`)
* **User Story Statement:**
  > **As a** System Service,  
  > **I want to** transform heterogeneous raw JSON structures from various OTAs into unified internal models (`UnifiedFlight` and `UnifiedHotel`) and de-duplicate identical offerings,  
  > **So that** the client application renders consistent UI cards and users never see duplicate listings for the same flight or hotel.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points

#### Schema Invariants (`UnifiedFlight` & `UnifiedHotel`):
* All currencies standardized to `VND` (Vietnamese Dong).
* All timestamps converted to ISO-8601 UTC.
* Durations normalized from ISO 8601 string (`PT1H20M`) to integer minutes (`80`).
* De-duplication key for flights: `${airlineCode}_${flightNumber}_${departureTimeUTC}`.
* De-duplication strategy: retain the offer with the lowest `price.amount`.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 4.1: Normalization of Raw Provider Flight Data to Unified Schema
```gherkin
Scenario: Standardizing Raw Vendor Payload
  Given Amadeus returns a raw flight item with duration "PT2H15M" and price currency "EUR" (amount 50)
  When the Normalizer Engine processes the raw item
  Then the resulting "UnifiedFlight" entity has:
    | Field                     | Expected Value                     |
    | id                        | Non-empty UUID string              |
    | provider                  | "AMADEUS"                          |
    | flightNumber              | "VN123"                            |
    | durationMinutes           | 135                                |
    | price.currency            | "VND"                              |
    | price.amount              | Equivalent converted VND amount    |
    | departureTime             | Valid ISO-8601 UTC timestamp       |
```

##### Scenario 4.2: De-duplication of Identical Flights from Different Providers
```gherkin
Scenario: Duplicate Flight Deduplication Favoring Lowest Price
  Given Amadeus returns flight "Vietnam Airlines VN-128" departing at "08:00 UTC" for 1,500,000 VND
    And RapidAPI returns flight "Vietnam Airlines VN-128" departing at "08:00 UTC" for 1,350,000 VND
  When the Deduplication Service analyzes the flight list
  Then the service identifies both items as duplicates using key "VN_128_2026-11-15T08:00:00Z"
    And strips the higher priced offer (1,500,000 VND)
    And retains the 1,350,000 VND offer with provider provenance preserved
    And the final list contains exactly 1 entry for flight VN-128
```

---

### `US-BOOK-05`: Dynamic Multi-Facet Filtering & Multi-Key Sorting

* **Story ID:** `US-BOOK-05` (Traces to `FR-10`, `UC-02`)
* **Role / Persona:** Budget-Conscious Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** filter results by price range, number of stops, specific airlines, or hotel star ratings, and sort by price, duration, or rating,  
  > **So that** I can rapidly pinpoint the optimal travel option that matches my constraints.
* **Priority:** `Should Have`
* **Estimation:** 3 Story Points

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 5.1: Filtering by Non-Stop Flights and Price Ceiling
```gherkin
Scenario: Applying Multi-Facet Flight Filters
  Given the search results screen displays 40 flights (mix of direct and 1-stop, prices 800,000 VND to 4,500,000 VND)
  When the user adjusts the price slider max value to 2,000,000 VND
    And ticks the filter checkbox "Direct Flights Only"
  Then the list instantly filters to show only flights where:
    | Condition      | Operator | Value          |
    | stops          | EQUALS   | 0              |
    | price.amount   | <=       | 2000000        |
    And the result counter updates to show: "Showing 8 of 40 flights"
```

##### Scenario 5.2: Sorting by Duration (Shortest First)
```gherkin
Scenario: Sorting Flights by Shortest Duration
  Given a list of filtered flights is currently displayed on screen
  When the user selects sort option "Duration: Shortest First"
  Then the list re-renders with the shortest duration flight at index 0
    And for every consecutive item i and i+1, item[i].durationMinutes <= item[i+1].durationMinutes
```

##### Scenario 5.3: Handling Zero Filter Matches (Edge Case)
```gherkin
Scenario: Zero Matches Handling
  Given the user sets a filter criterion that matches 0 results (e.g., price < 300,000 VND)
  Then the application displays a friendly empty state illustration: "No flights match your filters"
    And displays a primary action button: "Reset Filters"
  When the user taps "Reset Filters"
  Then all filter sliders and checkboxes restore to defaults and all original 40 results reappear
```

---

### `US-BOOK-06`: Two-Tier Redis Caching & Cache-Aside Management

* **Story ID:** `US-BOOK-06` (Traces to `FR-11`, `UC-02`, `NFR-01`)
* **Role / Persona:** Backend Performance Architecture (`System`)
* **User Story Statement:**
  > **As a** System Architect,  
  > **I want to** cache normalized flight search results in Redis for 1800 seconds (30 minutes) and hotel results for 3600 seconds (60 minutes) using deterministic cache keys,  
  > **So that** frequent queries return within 50ms and external API quota consumption is reduced by over 75%.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points

#### Key Taxonomy:
* Flights: `nomadix:flight:${origin}_${destination}_${date}_${passengers}_${class}` (TTL: $1800\text{s}$)
* Hotels: `nomadix:hotel:${city}_${checkIn}_${checkOut}_${guests}_${rooms}` (TTL: $3600\text{s}$)

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 6.1: Cache Miss on Initial Search (Cold Query)
```gherkin
Scenario: Cache Miss Dispatches External Fetch and Populates Redis
  Given Redis has no key matching "nomadix:flight:HAN_DAD_2026-11-15_1_ECONOMY"
  When the Express API receives a search request matching these parameters
  Then the service checks Redis and receives a null response
    And dispatches requests to external adapters
    And saves normalized results to Redis via "SETEX nomadix:flight:HAN_DAD_2026-11-15_1_ECONOMY 1800 <json_string>"
    And returns HTTP 200 to the client with response header "X-Cache-Status: MISS"
    And end-to-end response time is between 1000ms and 3000ms
```

##### Scenario 6.2: Cache Hit on Subsequent Search (Hot Query)
```gherkin
Scenario: Cache Hit Delivers Sub-50ms Response Time
  Given key "nomadix:flight:HAN_DAD_2026-11-15_1_ECONOMY" exists in Redis with remaining TTL of 1200 seconds
  When an identical search request is received by the Express API
  Then the service retrieves data directly from Redis RAM without invoking external adapters
    And returns HTTP 200 with response header "X-Cache-Status: HIT"
    And the server-side API processing latency is strictly less than 50ms
```

##### Scenario 6.3: Forced Cache Invalidation via Refresh Flag
```gherkin
Scenario: Client Bypasses Cache with Force Refresh Query
  Given key "nomadix:flight:HAN_DAD_2026-11-15_1_ECONOMY" exists in Redis
  When the client sends a request with query parameter "?refresh=true"
  Then the service bypasses the Redis read
    And executes fresh calls to external provider adapters
    And updates Redis with the new result set and resets TTL to 1800 seconds
    And returns HTTP 200 with header "X-Cache-Status: REFRESHED"
```

---

### `US-BOOK-07`: Secure Outbound Hand-off & Deep-link Redirection

* **Story ID:** `US-BOOK-07` (Traces to `FR-12`, `UC-02`)
* **Role / Persona:** Ready-to-Book Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** tap "Book on Partner Site" to seamlessly open the airline or hotel provider's official booking page in a secure in-app browser with pre-populated itinerary details,  
  > **So that** I can complete booking payment directly with the provider without re-entering my travel dates and party details.
* **Priority:** `Should Have`
* **Estimation:** 3 Story Points

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 7.1: Seamless In-App Browser Deep Linking
```gherkin
Scenario: Launching In-App Browser with Deep Link
  Given the user has selected a Vietnam Airlines flight offer with booking reference URL "https://www.vietnamairlines.com/deal?ref=nomadix&flight=VN128"
  When the user taps "Book on Airline Website"
  Then the mobile application opens an In-App Browser modal (React Native InAppBrowser / Safari View Controller / Chrome Custom Tabs)
    And loads the partner URL with query parameters intact
    And keeps the Nomadix application active in background memory
```

##### Scenario 7.2: Broken URL Fallback Handling (Edge Case)
```gherkin
Scenario: Fallback when Partner Deep Link is Malformed or Unreachable
  Given the provider offer lacks a direct deep link or provides an invalid URL format
  When the user taps "Book on Airline Website"
  Then the application safely falls back to the provider's main portal (e.g. "https://www.vietnamairlines.com")
    And presents an informational toast: "Direct flight link unavailable. Redirecting to official airline homepage."
    And copies the flight number "VN-128" and date to the device clipboard
```

---

## 3. MODULE 3: INTERACTIVE ITINERARY PLANNER & MAPS ROUTING (EPIC 3)

```
┌─────────────┬─────────────────────────────────────────────────┬──────────┬───────────┐
│ Story ID    │ User Story Title                                │ Priority │ Est. Pts  │
├─────────────┼─────────────────────────────────────────────────┼──────────┼───────────┤
│ US-ITIN-01  │ Multi-Day Itinerary Creation & Metadata Setup   │ MUST     │ 5 Pts     │
│ US-ITIN-02  │ Daily Activity & Destination Management (CRUD)  │ MUST     │ 5 Pts     │
│ US-ITIN-03  │ Drag-and-Drop Activity Reordering & Optimistic  │ MUST     │ 8 Pts     │
│ US-ITIN-04  │ Google Maps Dynamic Routing & Sequenced Markers │ MUST     │ 8 Pts     │
│ US-ITIN-05  │ Distance & Duration Matrix with Haversine Drop  │ MUST     │ 5 Pts     │
│ US-ITIN-06  │ Importing Aggregated Bookings into Itinerary    │ SHOULD   │ 5 Pts     │
│ US-ITIN-07  │ Public Community Sharing & One-Click Trip Clone │ MUST     │ 5 Pts     │
│ US-ITIN-08  │ Travel Companion Invitation & Role Permissions  │ MUST     │ 5 Pts     │
│ US-ITIN-09  │ Multi-User Shared Itinerary Synchronization     │ MUST     │ 8 Pts     │
└─────────────┴─────────────────────────────────────────────────┴──────────┴───────────┘
```

---

### `US-ITIN-01`: Multi-Day Itinerary Creation & Metadata Setup

* **Story ID:** `US-ITIN-01` (Traces to `FR-13`, `FR-14`, `UC-03`)
* **Role / Persona:** Trip Planner (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** create a new multi-day trip by specifying trip title, destination city, country, start date, end date, and estimated budget,  
  > **So that** the system automatically provisions Day tabs (Day 1, Day 2... Day N) in MongoDB where I can organize my daily schedule.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Pre-conditions:** Authenticated user with valid JWT Access Token.
* **Storage Target:** MongoDB Collection `itineraries` with `userId` linked to PostgreSQL `users(id)` UUID.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 1.1: Successful Creation of a 3-Day Trip (Happy Path)
```gherkin
Scenario: Creating a 3-Day Itinerary Auto-Generates 3 Day Sub-documents
  Given an authenticated user with UUID "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
  When the user submits a trip creation form with:
    | Field          | Value                          |
    | title          | "Đà Nẵng - Hội An 3N2Đ"        |
    | city           | "Đà Nẵng"                      |
    | country        | "Việt Nam"                     |
    | startDate      | "2026-11-15"                   |
    | endDate        | "2026-11-17"                   |
    | budgetEstimate | 4500000                        |
  Then the system computes trip duration as 3 days (inclusive)
    And creates a MongoDB document in "itineraries" with:
      - userId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
      - isPublic: false
      - cloneCount: 0
      - days array length: 3
      - days[0].dayNumber: 1, days[0].date: "2026-11-15"
      - days[1].dayNumber: 2, days[1].date: "2026-11-16"
      - days[2].dayNumber: 3, days[2].date: "2026-11-17"
    And returns HTTP 201 Created with the new itinerary document
    And the mobile app transitions to the newly created itinerary workspace with "Day 1" selected
```

##### Scenario 1.2: Rejection when End Date Precedes Start Date (Validation Negative)
```gherkin
Scenario: Trip End Date Preceding Start Date Rejection
  Given the user sets start date to "2026-11-20"
  When the user sets end date to "2026-11-18"
    And clicks "Create Itinerary"
  Then the client shows an error: "End date must be on or after start date"
    And if sent to API, returns HTTP 400 Bad Request
    And no document is written to MongoDB
```

##### Scenario 1.3: Enforcing Maximum Trip Duration Limit (Boundary Condition)
```gherkin
Scenario: Trip Duration Exceeding Platform Limit (Max 30 Days)
  Given the user attempts to create a trip from "2026-11-01" to "2026-12-15" (45 days)
  When the form is submitted
  Then the API rejects the request with HTTP 400 Bad Request
    And response message: "Maximum itinerary duration allowed is 30 days"
```

---

### `US-ITIN-02`: Daily Activity & Destination Management (CRUD)

* **Story ID:** `US-ITIN-02` (Traces to `FR-14`, `UC-03`)
* **Role / Persona:** Traveler on a Schedule (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** add, edit, and remove activity items (cultural landmarks, hotels, booked flights, restaurants, custom stops) within any designated day tab,  
  > **So that** every day has an accurate timeline of places to visit, times, and notes.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points

#### Data Invariant (`itinerary.days[d].items[i]`):
```typescript
{
  itemType: "landmark" | "hotel" | "flight" | "restaurant" | "custom",
  destinationName: string,
  latitude: number,
  longitude: number,
  orderIndex: number, // 1-indexed sequential integer
  arrivalTime: string, // "08:30"
  estimatedDurationMinutes: number, // 90
  estimatedCost: number, // 50000 VND
  note: string
}
```

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 2.1: Adding a Landmark from the Cultural Catalog (Happy Path)
```gherkin
Scenario: Adding a Cultural Landmark to Day 1
  Given the user is on Day 1 of itinerary "Đà Nẵng - Hội An 3N2Đ"
  When the user taps "+ Add Stop" and selects landmark "Cầu Rồng" from the catalog
    And sets arrivalTime to "09:00", duration to 60 minutes, and note to "Check-in and take photos"
  Then the system appends a new item into "days[0].items"
    And assigns orderIndex = (current item count + 1)
    And auto-populates latitude = 16.061045 and longitude = 108.227234 from PostgreSQL landmark table
    And returns HTTP 200 OK
    And Day 1 list updates to display the new item card
```

##### Scenario 2.2: Adding a Custom Location with Manual Coordinates
```gherkin
Scenario: Adding a Custom Location
  Given the user searches for a custom cafe not in the landmark catalog
  When the user enters name "Mây Cafe", latitude 16.0680, longitude 108.2210, arrivalTime "11:00"
  Then the system saves the item with itemType = "custom"
    And the item displays with a custom pin icon on the map
```

##### Scenario 2.3: Deleting an Item and Reindexing Order (Integrity Scenario)
```gherkin
Scenario: Deleting an Item Automatically Re-indexes Succeeding Items
  Given Day 1 contains 3 items:
    | Item Name        | orderIndex |
    | Cầu Rồng         | 1          |
    | Bảo tàng Chăm    | 2          |
    | Chợ Cồn          | 3          |
  When the user swipes and deletes "Bảo tàng Chăm" (orderIndex 2)
  Then the item is removed from MongoDB "days[0].items"
    And "Chợ Cồn" orderIndex is automatically updated from 3 to 2
    And the resulting list has contiguous orderIndices [1, 2]
    And the route polyline on Google Maps automatically reconnects Cầu Rồng directly to Chợ Cồn
```

---

### `US-ITIN-03`: Drag-and-Drop Activity Reordering & Optimistic Sync

* **Story ID:** `US-ITIN-03` (Traces to `FR-15`, `UC-03`, `NFR-04`)
* **Role / Persona:** Mobile Traveler on the go (`Traveler`)
* **User Story Statement:**
  > **As a** Mobile Traveler,  
  > **I want to** long-press and drag activity cards up or down to change the visit order within a day,  
  > **So that** I can intuitively optimize my travel sequence without deleting and recreating stops.
* **Priority:** `Must Have`
* **Estimation:** 8 Story Points

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 3.1: Drag-and-Drop Item Reordering with Optimistic UI (Happy Path)
```gherkin
Scenario: Reordering Activities within the Same Day
  Given Day 1 currently has 3 stops: ① Cầu Rồng, ② Bảo tàng Chăm, ③ Chợ Cồn
  When the user long-presses "Chợ Cồn" (index 3) and drags it to position 1
  Then the mobile UI instantly updates the card order to: ① Chợ Cồn, ② Cầu Rồng, ③ Bảo tàng Chăm (Optimistic Update)
    And the map immediately redraws the markers with new numbers ①, ②, ③
    And an API request "PATCH /api/v1/itineraries/:id/days/1/reorder" is sent in the background with payload:
      """
      {
        "orderedItemIds": ["id_cho_con", "id_cau_rong", "id_bao_tang_cham"]
      }
      """
    And the server updates orderIndex values [1, 2, 3] in MongoDB and responds with HTTP 200 OK
```

##### Scenario 3.2: Network Failure Rollback on Reorder (Resilience / Edge Case)
```gherkin
Scenario: Optimistic UI Rollback on Server Sync Failure
  Given Day 1 order is ① Cầu Rồng, ② Bảo tàng Chăm
  When the user drags "Bảo tàng Chăm" to position 1
    And the background API request fails due to network disconnection (HTTP 500 / Timeout)
  Then the mobile application rolls back the card order to original state: ① Cầu Rồng, ② Bảo tàng Chăm
    And displays a non-blocking toast alert: "Could not save order. Restored original sequence."
    And the map polyline returns to its original configuration
```

##### Scenario 3.3: Moving an Activity to a Different Day Tab (Inter-Day Move)
```gherkin
Scenario: Moving an Activity from Day 1 to Day 2
  Given an activity "Ngũ Hành Sơn" exists on Day 1
  When the user taps "Move to Another Day" and selects "Day 2"
  Then the item is removed from Day 1 array and appended to Day 2 array
    And orderIndex on Day 1 is decremented for succeeding items
    And orderIndex on Day 2 is set to (Day 2 items count + 1)
    And both Day 1 and Day 2 route polylines are updated accordingly
```

---

### `US-ITIN-04`: Google Maps Dynamic Routing & Sequenced Markers

* **Story ID:** `US-ITIN-04` (Traces to `FR-16`, `UC-03`)
* **Role / Persona:** Visual Trip Navigator (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** see an embedded interactive Google Map that plots all stops of my selected day with numbered markers (①, ②, ③...) and colored route polylines,  
  > **So that** I can visualize my geographic journey and identify logical travel clusters.
* **Priority:** `Must Have`
* **Estimation:** 8 Story Points
* **Technical Integration:** `react-native-maps`, Google Maps SDK, Encoded Polylines.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 4.1: Initial Map Rendering and Auto-Fit Coordinates (Happy Path)
```gherkin
Scenario: Map Renders and Fits Bounds to Day Stops
  Given the user opens Day 1 containing 3 stops in Da Nang (Cầu Rồng, Chợ Cồn, Bán đảo Sơn Trà)
  When the map component mounts
  Then Google Maps renders with 3 distinct markers:
    | Stop Name          | Marker Label | Latitude  | Longitude  |
    | Cầu Rồng           | "1"          | 16.061045 | 108.227234 |
    | Chợ Cồn            | "2"          | 16.067821 | 108.214432 |
    | Bán đảo Sơn Trà    | "3"          | 16.108210 | 108.258712 |
    And the map camera automatically adjusts zoom and center using "fitToCoordinates()" with 50px edge padding
    And a colored polyline connects Stop 1 -> Stop 2 -> Stop 3
```

##### Scenario 4.2: Bi-directional Interaction between Cards and Markers
```gherkin
Scenario: Card Selection Highlights Corresponding Map Marker
  Given the map is displayed with 3 markers
  When the user taps the card for Stop 2 ("Chợ Cồn") in the bottom scroll sheet
  Then Marker 2 on the map transitions to an active pulsing state
    And the camera smoothly pans to center on Marker 2 at zoom level 16
  When the user taps Marker 3 ("Bán đảo Sơn Trà") directly on the map
  Then the bottom scroll sheet automatically scrolls to reveal Stop 3 card
```

##### Scenario 4.3: Handling Days with Zero or One Stop (Boundary Conditions)
```gherkin
Scenario: Map Display for Single Stop or Empty Day
  Given the user selects Day 3 which currently has 0 items
  Then the map defaults to the city center coordinates of "Đà Nẵng" with zoom level 12
    And no markers or polylines are rendered
  When the user adds exactly 1 stop
  Then 1 marker labeled "1" is rendered with no polyline
    And camera centers directly on that single coordinate at zoom level 15
```

---

### `US-ITIN-05`: Distance & Duration Matrix with Haversine Drop

* **Story ID:** `US-ITIN-05` (Traces to `FR-17`, `UC-03`, `NFR-03`)
* **Role / Persona:** Logistics Planner (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want the** application to calculate real transit distance (km) and travel duration (minutes) between consecutive stops using Google Distance Matrix API, with automatic fallback to Haversine calculation,  
  > **So that** I know how long it will take to travel between locations and don't overschedule my day.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Formula (Haversine Fallback):**
  $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  *(Assuming average urban driving velocity $v = 30\text{ km/h}$ for duration estimation).*

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 5.1: Online Distance Calculation via Google Distance Matrix (Happy Path)
```gherkin
Scenario: Accurate Distance & Travel Time Calculation
  Given Stop 1 is "Cầu Rồng" (16.0610, 108.2272) and Stop 2 is "Bảo tàng Chăm" (16.0602, 108.2234)
  When the route metrics service queries Google Distance Matrix API with travel mode "driving"
  Then the API returns actual driving distance "1.2 km" and duration "5 mins"
    And the UI renders a transit badge between Stop 1 and Stop 2 card: "🚗 1.2 km • 5 mins"
```

##### Scenario 5.2: Fallback to Haversine Straight-Line Distance on API Outage (Resilience)
```gherkin
Scenario: Automatic Haversine Fallback on Google API Quota Exceeded or Network Drop
  Given Google Distance Matrix API returns HTTP 429 Quota Exceeded or request times out
  When the MapsService evaluates the failure
  Then the service invokes the local "haversineCalculator.js" utility
    And calculates straight-line distance between Stop 1 and Stop 2 as "0.8 km"
    And estimates driving duration as: "(0.8 km / 30 km/h) * 60 = 1.6 mins" (rounded to 2 mins)
    And the UI renders: "🚗 ~0.8 km • ~2 mins (est.)"
    And the application does not crash or throw unhandled UI errors
```

##### Scenario 5.3: Cumulative Daily Travel Statistics Summary
```gherkin
Scenario: Day Summary Metric Aggregation
  Given Day 1 has 3 legs of travel: Leg 1 (1.2 km, 5 min), Leg 2 (3.5 km, 12 min), Leg 3 (10.0 km, 20 min)
  Then the top summary widget for Day 1 displays:
    | Metric                | Calculated Value |
    | Total Stops           | 4 stops          |
    | Total Transit Distance| 14.7 km          |
    | Total Transit Time    | 37 mins          |
```

---

### `US-ITIN-06`: Importing Aggregated Bookings into Itinerary

* **Story ID:** `US-ITIN-06` (Traces to `FR-06`, `FR-07`, `FR-14`, Cross-Module Flow)
* **Role / Persona:** Traveler with booked travel (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want to** directly import flights and hotels found in the Booking Aggregator into my itinerary schedule,  
  > **So that** my arrival flight lands on Day 1 and my hotel stay is automatically pinned to my trip days.
* **Priority:** `Should Have`
* **Estimation:** 5 Story Points

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 6.1: Adding Booked Flight to Day 1 Timeline
```gherkin
Scenario: Importing Selected Flight as First Item of Itinerary
  Given the user has selected a flight "Vietnam Airlines VN-128" arriving at Da Nang at "09:20 AM" on "2026-11-15"
  When the user taps "Add to Itinerary" and selects trip "Đà Nẵng - Hội An 3N2Đ"
  Then the flight is added as itemType = "flight" in Day 1 with orderIndex = 1
    And arrivalTime is preset to "09:20"
    And destinationName is set to "Sân bay Quốc tế Đà Nẵng (DAD)"
    And flight details (Flight Number, Airline) are saved in the item's note field
```

##### Scenario 6.2: Adding Hotel as Accommodations Pin for all Trip Nights
```gherkin
Scenario: Importing Hotel Booking as Base Stay
  Given the user has found hotel "Novotel Danang Premier Han River" in the Hotel Search
  When the user taps "Add to Itinerary"
  Then the hotel is recorded in the itinerary metadata
    And an itemType = "hotel" card is placed at the conclusion of Day 1, Day 2, and Day 3
    And hotel coordinates (16.0792, 108.2244) are mapped as the daily starting/ending location
```

---

### `US-ITIN-07`: Public Community Sharing & One-Click Trip Clone

* **Story ID:** `US-ITIN-07` (Traces to `FR-18`, `UC-07`)
* **Role / Persona:** First-Time Traveler (`Explorer`) & Experienced Author (`Contributor`)
* **User Story Statement:**
  > **As a** First-Time Traveler,  
  > **I want to** clone an existing public itinerary created by another user into my personal account with one click,  
  > **So that** I can instantly inherit a proven travel schedule and customize it without planning from scratch.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Storage Invariants:**
  * Original itinerary: `cloneCount` atomically incremented via `$inc: { cloneCount: 1 }`.
  * Cloned itinerary: New MongoDB `_id`, `userId = req.user.id`, `isPublic = false`, `cloneCount = 0`, timestamps reset.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 7.1: One-Click Clone of a Public Itinerary (Happy Path)
```gherkin
Scenario: Successful One-Click Trip Cloning
  Given Traveler B is viewing a public itinerary "Đà Nẵng 3N2Đ Tiết Kiệm" authored by Traveler A (ID "itin_123")
    And "itin_123" has cloneCount = 10
  When Traveler B taps the "Clone Trip" button
  Then the backend creates a deep copy of "itin_123":
    | Property         | Value for Cloned Document                  |
    | _id              | Generated new ObjectId                     |
    | userId           | Traveler B's UUID                          |
    | isPublic         | false                                      |
    | cloneCount       | 0                                          |
    | title            | "Đà Nẵng 3N2Đ Tiết Kiệm (Copy)"            |
    | days             | Identical nested days and items array      |
    And atomically updates "itin_123" with cloneCount = 11
    And returns HTTP 201 Created with the new itinerary ID "itin_999"
    And the app automatically navigates Traveler B to their private itinerary editor
```

##### Scenario 7.2: Preventing Self-Cloning (Business Rule / Edge Case)
```gherkin
Scenario: Author Viewing Own Public Itinerary
  Given Traveler A is viewing their own published itinerary
  When the screen renders
  Then the "Clone Trip" button is hidden or replaced with "Edit Itinerary"
    And if an API request "POST /api/v1/itineraries/:ownId/clone" is sent
    Then the server returns HTTP 400 Bad Request with "You cannot clone your own itinerary"
```

##### Scenario 7.3: Toggling Itinerary Visibility between Private and Public
```gherkin
Scenario: Publishing Private Itinerary to Community
  Given an itinerary is currently private (isPublic = false)
    And has at least 1 day with 1 item
  When the owner toggles "Share with Community" switch to ON
  Then the server updates isPublic = true
    And the itinerary becomes instantly discoverable on the Community Explore feed
```

##### Scenario 7.4: Rejection of Empty Itinerary Publication (Validation Negative)
```gherkin
Scenario: Rejection of Publishing Empty Itinerary
  Given an itinerary contains 0 stops across all days
  When the user attempts to toggle "Share with Community"
  Then the system blocks the action with message: "Cannot share an empty itinerary. Add at least one destination before publishing."
    And isPublic remains false
```

---

## 4. CROSS-MODULE TRACEABILITY & INTEGRATION MATRIX

| User Story ID | Functional Req | Use Case ID | DB Entity / Collection | Cache / API Dependency | Test Scenario File |
|---|---|---|---|---|---|
| **`US-BOOK-01`** | `FR-06` | `UC-02` | None (Stateless) | Express Joi Validator | `flight-search.spec.js` |
| **`US-BOOK-02`** | `FR-08`, `FR-35` | `UC-02` | None (Stateless) | Amadeus API / MockProvider | `provider-resilience.spec.js`|
| **`US-BOOK-03`** | `FR-07` | `UC-02` | None (Stateless) | RapidAPI / Booking Adapter | `hotel-search.spec.js` |
| **`US-BOOK-04`** | `FR-09`, `FR-10` | `UC-02` | None (Stateless) | NormalizerEngine | `normalizer.spec.js` |
| **`US-BOOK-05`** | `FR-10` | `UC-02` | None (Stateless) | Client Filter / Sorter | `filter-sort.spec.js` |
| **`US-BOOK-06`** | `FR-11` | `UC-02` | Redis Key-Value | Redis Cache Engine (`SETEX`) | `redis-cache.spec.js` |
| **`US-BOOK-07`** | `FR-12` | `UC-02` | None (Client URL) | React Native InAppBrowser | `deep-link.spec.js` |
| **`US-ITIN-01`** | `FR-13`, `FR-14` | `UC-03` | MongoDB `itineraries` | Express ItineraryRouter | `itinerary-crud.spec.js` |
| **`US-ITIN-02`** | `FR-14` | `UC-03` | MongoDB `itineraries` | PostgreSQL `landmarks` (Coord) | `day-items.spec.js` |
| **`US-ITIN-03`** | `FR-15` | `UC-03` | MongoDB `itineraries` | React Native Draggable FlatList| `drag-drop-reorder.spec.js` |
| **`US-ITIN-04`** | `FR-16` | `UC-03` | MongoDB `itineraries` | Google Maps SDK Polylines | `maps-polyline.spec.js` |
| **`US-ITIN-05`** | `FR-17` | `UC-03` | MongoDB `itineraries` | Google Distance Matrix / Haversine | `distance-matrix.spec.js`|
| **`US-ITIN-07`** | `FR-18` | `UC-07` | MongoDB `itineraries` | MongoDB Atomic `$inc` | `clone-trip.spec.js` |
| **`US-ITIN-08`** | `FR-36` | `UC-20` | PostgreSQL `trip_members` | Express ItineraryRouter | `trip-collaborators.spec.js` |
| **`US-ITIN-09`** | `FR-37` | `UC-20` | MongoDB `collaborators`, `__v` | Client Sync & Polling | `trip-sync.spec.js` |

---

## 5. QUALITY ATTRIBUTES & NON-FUNCTIONAL ACCEPTANCE CRITERIA

In accordance with **ISO/IEC 25010** software quality standards:

1. **Performance Efficiency (`NFR-01`):**
   * Flight & Hotel search responses under Redis Cache Hit must be returned to client within **$< 50\text{ms}$**.
   * Under Cache Miss, parallel aggregation across all external providers must complete or timeout within **$< 3500\text{ms}$**.
   * Reordering itinerary stops via drag-and-drop must deliver an immediate 60fps optimistic UI update ($< 16\text{ms}$ frame time).

2. **Reliability & Fault Tolerance (`NFR-03`):**
   * If Amadeus or RapidAPI times out ($> 5000\text{ms}$) or returns HTTP 429/500, the system must degrade gracefully to `MockBookingProvider` without unhandled crashes.
   * If Google Distance Matrix quota is exceeded or network connection drops, the system must compute transit metrics using the offline Haversine formula.

3. **Data Integrity & Polyglot Consistency (`NFR-04`):**
   * In `itineraries` collection, the field `userId` must always store a valid UUID string referencing `users(id)` in PostgreSQL.
   * Reordering must guarantee contiguous sequential integers for `orderIndex` ($1, 2, 3...$) with no gaps or duplicates.
   * Cloning an itinerary must atomically increment `cloneCount` of the source document by $+1$.

---

## 6. SIGN-OFF & VERIFICATION CHECKLIST

- [x] All User Stories adhere to the standard Connextra format (*As a... I want to... So that...*).
- [x] Every User Story has at least 3 detailed BDD Gherkin Acceptance Scenarios covering Happy Path, Validation Failures, and Edge/Boundary Cases.
- [x] Technical integration details (Redis keys, TTL, MongoDB schemas, Haversine fallback formula, API status codes) are specified.
- [x] Direct mapping to project milestones, Functional Requirements (`FR-06` to `FR-18`), and Use Cases (`UC-02`, `UC-03`, `UC-07`).
- [x] Non-functional acceptance criteria verified against ISO/IEC 25010 quality models.
