# 07. Detailed User Stories & BDD Acceptance Criteria: Gamification & Community Forum

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Program:** BSc (Hons) Computing  
**Module Focus:** Epic 4 (Cultural Gamification & Location Engine - USP) & Epic 5 (Community Forum & Verified Trust Engine)  
**Methodology:** Agile / Scrum with Behavior-Driven Development (BDD Gherkin Syntax)  
**Traceability Mapping:** FR-19 to FR-30 | UC-04, UC-05, UC-06 | PostgreSQL 16 & MongoDB Atlas 7  

---

## 1. EXECUTIVE SUMMARY & ARCHITECTURAL FOUNDATION

The **Gamification Module** (Epic 4) and **Community Forum** (Epic 5) form the unique selling proposition (USP) and retention core of the **Nomadix** platform.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                NOMADIX ARCHITECTURAL MAPPING                           │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Gamification Module (Epic 4)  │ PostgreSQL 16 ACID Relational Store                   │
│                               │ GPS Geofencing (Haversine <= 100m Threshold)           │
│                               │ In-App Camera with Dynamic Watermark Overlay           │
│                               │ Randomized Cultural Quiz Engine | XP Level Progression │
│                               │ Automated City Explorer Badge Unlock Engine            │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ Community Forum (Epic 5)      │ MongoDB Atlas Flexible Document Store                  │
│                               │ Polyglot Cross-Database Verification Bridge            │
│                               │ "City Verified" Gold Trust Attachment & Top Ranking    │
│                               │ Atomic Upvoting, Anti-Spam & Content Moderation        │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. MODULE 4: CULTURAL GAMIFICATION & LOCATION ENGINE (EPIC 4 - USP)

```
┌─────────────┬─────────────────────────────────────────────────┬──────────┬───────────┐
│ Story ID    │ User Story Title                                │ Priority │ Est. Pts  │
├─────────────┼─────────────────────────────────────────────────┼──────────┼───────────┤
│ US-GAME-01  │ Cultural Landmark Catalog & Live Proximity Sort │ MUST     │ 5 Pts     │
│ US-GAME-02  │ GPS Geofence Proximity Verification (100m Radius)│ MUST     │ 8 Pts     │
│ US-GAME-03  │ In-App Camera Capture with Dynamic Watermarking │ MUST     │ 5 Pts     │
│ US-GAME-04  │ Check-in Verification & Anti-Spam Constraint    │ MUST     │ 5 Pts     │
│ US-GAME-05  │ Randomized Cultural Quiz Generation & Timed Quiz│ MUST     │ 5 Pts     │
│ US-GAME-06  │ Quiz Scoring, XP Reward & Level Progression     │ MUST     │ 5 Pts     │
│ US-GAME-07  │ Automated City Explorer Badge Unlock Engine     │ MUST     │ 8 Pts     │
└─────────────┴─────────────────────────────────────────────────┴──────────┴───────────┘
```

---

### `US-GAME-01`: Cultural Landmark Catalog & Live Proximity Sort

* **Story ID:** `US-GAME-01` (Traces to `FR-19`, `UC-04`)
* **Role / Persona:** Cultural Explorer (`Traveler`)
* **User Story Statement:**
  > **As a** Cultural Explorer,  
  > **I want to** browse a curated catalog of historical and cultural landmarks filtered by city and sorted by real-time distance from my current GPS coordinates,  
  > **So that** I can easily identify nearby heritage sites to visit and unlock achievements.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Pre-conditions:** Device location permissions granted (`ACCESS_FINE_LOCATION`).
* **Data Store:** PostgreSQL `landmarks` table joined with user coordinate inputs.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 1.1: Browsing Landmarks with Real-Time Proximity Sorting (Happy Path)
```gherkin
Scenario: Landmark List Sorted by Real-Time Proximity
  Given the user is authenticated and location permission is granted
    And the user's current GPS location is (16.0600° N, 108.2200° E) in Da Nang
  When the user opens the "Cultural Landmarks" tab for city "Đà Nẵng"
  Then the system fetches landmarks from PostgreSQL table "landmarks"
    And computes the Haversine distance from the user's coordinates to each landmark
    And displays the landmarks sorted in ascending order of distance:
      | Landmark Name    | Calculated Distance | Geofence Status |
      | Cầu Rồng         | 0.8 km              | Outside Range   |
      | Bảo tàng Chăm    | 1.1 km              | Outside Range   |
      | Chùa Linh Ứng    | 9.4 km              | Outside Range   |
    And each card displays a thumbnail, historical era tag, and distance indicator
```

##### Scenario 1.2: Location Permission Denied Fallback
```gherkin
Scenario: Handling Denied Location Permissions
  Given the user has denied GPS location permissions on their mobile device
  When the user navigates to the Cultural Landmarks catalog
  Then the app does not crash or block access
    And displays an informational banner: "Enable location to see real-time distances to landmarks"
    And renders the landmark catalog sorted by popularity (check-in count descending)
```

---

### `US-GAME-02`: GPS Geofence Proximity Verification (100m Radius)

* **Story ID:** `US-GAME-02` (Traces to `FR-20`, `UC-04`, `NFR-02`)
* **Role / Persona:** Explorer at a Destination (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler standing at a landmark,  
  > **I want the** system to verify my GPS coordinates against the landmark's geofence boundary ($\le 100\text{ meters}$),  
  > **So that** check-in actions and cultural quizzes are only unlocked when I am physically present at the site.
* **Priority:** `Must Have`
* **Estimation:** 8 Story Points
* **Formula:** Haversine formula calculation executed on the backend to prevent client-side GPS spoofing.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 2.1: Successful Geofence Validation within 100m (Happy Path)
```gherkin
Scenario: Geofence Verification Passes within 100m
  Given landmark "Cầu Rồng" is registered at coordinates (16.061045° N, 108.227234° E) with geofence radius 100m
    And the traveler is standing at coordinates (16.061200° N, 108.227400° E)
  When the traveler taps "Check-in Here"
  Then the mobile app sends payload "{ landmarkId: '...', latitude: 16.061200, longitude: 108.227400 }" to "POST /api/v1/checkins/validate"
    And the backend calculates the Haversine distance as 24.3 meters
    And validates that 24.3m <= 100.0m
    And returns HTTP 200 OK with:
      """
      {
        "status": "success",
        "isValid": true,
        "distanceMeters": 24.3,
        "checkinToken": "signed_jwt_nonce_valid_5_minutes"
      }
      """
    And the mobile app unlocks and activates the In-App Camera button
```

##### Scenario 2.2: Geofence Rejection when Outside 100m Radius (Negative Flow)
```gherkin
Scenario: Geofence Verification Rejection Outside 100m
  Given the traveler is at their hotel located 1.5 km away from "Cầu Rồng"
  When the traveler attempts to trigger "Check-in Here"
  Then the backend calculates distance as 1500 meters
    And validates that 1500m > 100.0m
    And returns HTTP 403 Forbidden with:
      """
      {
        "status": "fail",
        "isValid": false,
        "distanceMeters": 1500,
        "message": "You are 1.5 km away from Cầu Rồng. Move within 100m to unlock check-in."
      }
      """
    And the "Start Check-in" button remains disabled with a distance countdown indicator
```

##### Scenario 2.3: Anti-Tampering Nonce Validation (Security Scenario)
```gherkin
Scenario: Tampering Prevention with Expired or Forged Checkin Token
  Given a user attempts to bypass GPS validation by sending an expired or forged "checkinToken" directly to the photo submission endpoint
  When the server verifies the token signature
  Then the token verification fails
    And returns HTTP 401 Unauthorized: "Invalid or expired check-in session"
    And the check-in attempt is rejected
```

---

### `US-GAME-03`: In-App Camera Capture with Dynamic Watermarking

* **Story ID:** `US-GAME-03` (Traces to `FR-21`, `UC-04`)
* **Role / Persona:** Verified Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler who passed geofence verification,  
  > **I want to** capture a souvenir photo using the in-app camera that automatically stamps a branded watermark with the landmark name, date/time, and GPS coordinates,  
  > **So that** I have an authentic, visually validated proof of my visit to display on my profile.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Technical Integration:** `react-native-vision-camera`, `react-native-image-marker`, Cloudinary CDN.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 3.1: Capturing and Stamping Photo with Real-Time Watermark (Happy Path)
```gherkin
Scenario: In-App Camera Photo Capture with Watermark
  Given the user has successfully validated within the geofence of "Cầu Rồng"
  When the user taps the camera shutter button in the In-App Camera view
  Then the application captures the native sensor image
    And applies an image overlay at the bottom margin containing:
      - Landmark Name: "Cầu Rồng — Đà Nẵng"
      - GPS Coordinates: "16.0610° N, 108.2272° E"
      - Timestamp: "2026-11-15 15:30:22 UTC+7"
      - Nomadix Branded Logo badge
    And presents a preview screen with "Retake" and "Confirm & Submit" options
```

##### Scenario 3.2: Gallery Upload Prevention (Integrity Scenario)
```gherkin
Scenario: Enforcing Native In-App Camera Only (No Gallery Imports)
  Given the user is on the Check-in photo capture screen
  Then there is no option to choose pre-existing photos from the device photo gallery
    And the app strictly captures from the live camera stream to prevent fake/downloaded photo uploads
```

---

### `US-GAME-04`: Check-in Verification & Anti-Spam Constraint

* **Story ID:** `US-GAME-04` (Traces to `FR-22`, `UC-04`, `NFR-04`)
* **Role / Persona:** Platform Integrity Service (`System`)
* **User Story Statement:**
  > **As a** Platform System,  
  > **I want to** record the check-in in PostgreSQL and enforce a unique constraint (`UNIQUE(user_id, landmark_id)`),  
  > **So that** users cannot repeatedly farm XP or falsify visits by submitting multiple check-ins for the same landmark.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Storage Invariant:** Table `checkins`: `user_id` UUID, `landmark_id` UUID, `photo_url` TEXT, `created_at` TIMESTAMPTZ, `UNIQUE(user_id, landmark_id)`.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 4.1: First-Time Check-in Submission (Happy Path)
```gherkin
Scenario: First-Time Successful Check-in Record
  Given user "user_123" has never checked into landmark "landmark_cau_rong"
  When the user submits the watermarked photo with valid checkinToken
  Then the photo is uploaded to Cloudinary folder "nomadix/checkins/"
    And an entry is inserted into PostgreSQL table "checkins":
      | user_id    | landmark_id          | photo_url                   |
      | "user_123" | "landmark_cau_rong"  | "https://res.cloudinary..." |
    And the server responds with HTTP 201 Created
    And the app automatically transitions to the Cultural Quiz screen (US-GAME-05)
```

##### Scenario 4.2: Duplicate Check-in Prevention (Anti-Spam / Integrity Scenario)
```gherkin
Scenario: Duplicate Check-in Blocked by Unique Constraint
  Given user "user_123" already has an existing check-in record for "landmark_cau_rong"
  When the user attempts to submit a second check-in for the same landmark
  Then the PostgreSQL database triggers a unique violation error (23505 unique_violation)
    And the API returns HTTP 409 Conflict:
      """
      {
        "status": "fail",
        "message": "You have already completed check-in at this landmark. Repeat check-ins do not award additional XP."
      }
      """
    And no duplicate row is created in "checkins"
    And the user is offered to retake the Cultural Quiz for fun without duplicate XP rewards
```

---

### `US-GAME-05`: Randomized Cultural Quiz Generation & Timed Attempt

* **Story ID:** `US-GAME-05` (Traces to `FR-23`, `UC-05`)
* **Role / Persona:** Curious Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler who just completed a check-in,  
  > **I want to** take a 3-question multiple-choice cultural quiz with a 30-second timer per question,  
  > **So that** I can test my knowledge of local heritage while the experience is fresh in my mind.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Security Rule:** Correct answers (`correct_option`) MUST NOT be sent in the quiz query payload to the client.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 5.1: Fetching Randomized Quiz Questions without Solution Leakage
```gherkin
Scenario: Generating Randomized 3-Question Quiz
  Given user has completed check-in at "Cầu Rồng"
  When the client calls "GET /api/v1/quizzes/landmark/landmark_cau_rong/start"
  Then the backend selects 3 random questions from "quiz_questions" where quiz_id maps to "Cầu Rồng"
    And returns the questions with options A, B, C, D
    And strips the "correct_option" and "explanation" fields from the HTTP response
    And starts a 30-second countdown timer on the mobile screen for Question 1
```

##### Scenario 5.2: Question Timeout Auto-Advance (Edge Case)
```gherkin
Scenario: Timer Expiry Automatically Advances Question
  Given Question 1 is active with 30-second countdown
  When 30 seconds elapse without the user selecting an option
  Then the client marks Question 1 as unanswered ("null")
    And automatically advances to Question 2 with an alert: "Time expired for this question!"
```

---

### `US-GAME-06`: Quiz Scoring, XP Reward & Level Progression

* **Story ID:** `US-GAME-06` (Traces to `FR-24`, `UC-05`, `NFR-01`)
* **Role / Persona:** Gamified Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler,  
  > **I want my** quiz answers evaluated on the server with $+150\text{ XP}$ awarded for passing ($\ge 66\%$), causing my Level progress bar to update,  
  > **So that** I feel rewarded for learning about local culture and progress toward new explorer ranks.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Mathematical Invariant:** $\text{Level} = \lfloor \sqrt{\text{XP} / 100} \rfloor + 1$. Passing criteria: score $\ge 66.0\%$ ($\ge 2/3$ correct).

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 6.1: Passing the Cultural Quiz and Gaining XP (Happy Path)
```gherkin
Scenario: Successful Quiz Submission Awards XP and Updates Level
  Given the user currently has XP = 350 (Level = 2) in PostgreSQL
  When the user submits answers with 3 out of 3 correct responses
  Then the server grades the quiz as 100% (Passed: true)
    And records the attempt in "quiz_attempts" table
    And adds +150 XP to the user's account (New XP = 500)
    And re-evaluates Level: floor(sqrt(500 / 100)) + 1 = floor(2.236) + 1 = 3
    And detects a Level Up event (from Level 2 to Level 3)
    And returns HTTP 200 OK with:
      """
      {
        "score": 100,
        "isPassed": true,
        "xpAwarded": 150,
        "totalXp": 500,
        "previousLevel": 2,
        "currentLevel": 3,
        "leveledUp": true
      }
      """
    And the mobile app renders a celebration modal with fireworks and level-up banner
```

##### Scenario 6.2: Failing the Quiz (Educational Scenario)
```gherkin
Scenario: Failing the Quiz Shows Explanations Without Bonus XP
  Given the user answers only 1 out of 3 questions correctly (Score = 33.3%)
  When the submission is processed
  Then the server marks isPassed = false
    And awards 0 bonus XP
    And returns the correct answers and educational explanations for all 3 questions
    And the UI shows: "Almost there! Read the cultural insights below and try again on your next visit."
```

---

### `US-GAME-07`: Automated City Explorer Badge Unlock Engine

* **Story ID:** `US-GAME-07` (Traces to `FR-25`, `UC-05`, `NFR-04`)
* **Role / Persona:** Dedicated Explorer (`Traveler`)
* **User Story Statement:**
  > **As a** Dedicated Explorer,  
  > **I want the** system to automatically award me a prestigious "City Explorer Badge" (e.g. *Da Nang Explorer*) once I complete $\ge 3$ landmark check-ins and $\ge 1$ passed quiz in that city,  
  > **So that** I gain recognized authority as a verified traveler in that destination.
* **Priority:** `Must Have`
* **Estimation:** 8 Story Points
* **Storage Invariant:** Table `user_badges`: `user_id` UUID, `badge_id` UUID, `unlocked_at` TIMESTAMPTZ, `UNIQUE(user_id, badge_id)`.
* **Bonus Reward:** $+300\text{ XP}$ upon badge unlock.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 7.1: Qualifying for and Unlocking City Badge (Happy Path)
```gherkin
Scenario: Automated City Badge Evaluation and Award
  Given user "user_123" has checked in at 2 landmarks in Da Nang (Cầu Rồng, Bảo tàng Chăm)
  When the user checks in at their 3rd Da Nang landmark ("Bán đảo Sơn Trà")
    And successfully passes the Cultural Quiz
  Then the "BadgeEvaluatorService" executes:
    | Criteria                   | Required | User State | Status |
    | Da Nang Distinct Checkins  | >= 3     | 3          | PASS   |
    | Da Nang Passed Quizzes     | >= 1     | 2          | PASS   |
    | Existing Da Nang Badge     | None     | None       | PASS   |
    And inserts a row into "user_badges" with badge_id = "badge_da_nang_explorer"
    And awards +300 bonus XP to the user
    And returns HTTP 200 OK with badge details:
      """
      {
        "badgeUnlocked": true,
        "badge": {
          "id": "badge_da_nang_explorer",
          "name": "Da Nang Explorer Badge",
          "city": "Đà Nẵng",
          "iconUrl": "https://res.cloudinary.com/.../badge_danang_gold.png",
          "xpBonus": 300
        }
      }
      """
    And the mobile app renders a 3D spinning Gold Badge unlock modal with haptic feedback
```

##### Scenario 7.2: Not Yet Qualified for Badge (Progress Tracking)
```gherkin
Scenario: Incomplete Badge Criteria Shows Progress
  Given user has 2 check-ins and 1 passed quiz in Da Nang
  When the badge evaluator runs
  Then it determines criteria: 2/3 check-ins completed
    And does not insert into "user_badges"
    And the profile badge screen displays: "Da Nang Explorer: 2 of 3 landmarks visited (66%)"
```

---

## 3. MODULE 5: COMMUNITY FORUM & VERIFIED TRUST ENGINE (EPIC 5)

```
┌─────────────┬─────────────────────────────────────────────────┬──────────┬───────────┐
│ Story ID    │ User Story Title                                │ Priority │ Est. Pts  │
├─────────────┼─────────────────────────────────────────────────┼──────────┼───────────┤
│ US-COMM-01  │ Categorized City Discussion Feed & Tag Navigation│ MUST     │ 5 Pts     │
│ US-COMM-02  │ Create Question Thread with Location Tagging    │ MUST     │ 5 Pts     │
│ US-COMM-03  │ Cross-DB "City Verified" Answer Attachment      │ MUST     │ 8 Pts     │
│ US-COMM-04  │ Verified Answer Priority Ranking Algorithm      │ MUST     │ 5 Pts     │
│ US-COMM-05  │ Nested Discussion Comments & Upvote Mechanism   │ SHOULD   │ 5 Pts     │
│ US-COMM-06  │ Content Flagging & Community Moderation Queue   │ SHOULD   │ 3 Pts     │
└─────────────┴─────────────────────────────────────────────────┴──────────┴───────────┘
```

---

### `US-COMM-01`: Categorized City Discussion Feed & Tag Navigation

* **Story ID:** `US-COMM-01` (Traces to `FR-26`)
* **Role / Persona:** Travel Researcher (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler preparing for a trip,  
  > **I want to** browse community question feeds organized by city and topic tags (e.g. *Food & Dining*, *Transportation*, *Hidden Gems*),  
  > **So that** I can easily find relevant, practical advice specific to my destination.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Storage Target:** MongoDB Collection `forum_questions` indexed on `{ city: 1, createdAt: -1 }`.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 1.1: Loading City-Specific Questions (Happy Path)
```gherkin
Scenario: Browsing Questions for Specific City and Category
  Given the user navigates to the Community tab and selects city "Đà Nẵng"
    And taps tag filter "Food & Dining"
  When the request is dispatched to "GET /api/v1/community/questions?city=DaNang&category=Food"
  Then the API queries MongoDB collection "forum_questions"
    And returns questions matching city "Đà Nẵng" and category "Food"
    And each question card displays title, author avatar, reply count, and upvote count
```

##### Scenario 1.2: Searching Questions by Keyword
```gherkin
Scenario: Searching Question Feed by Text Search
  Given the user is on the Da Nang forum feed
  When the user types "bánh xèo" into the search bar
  Then the system performs a text search on title and content fields
    And returns matching discussion threads within 100ms
```

---

### `US-COMM-02`: Create Question Thread with Location Tagging

* **Story ID:** `US-COMM-02` (Traces to `FR-27`)
* **Role / Persona:** Inquiring Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Traveler with a question,  
  > **I want to** post a new inquiry in a designated city forum with a title, description, and category tag,  
  > **So that** experienced local travelers can share their advice with me.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Validation Rules:** Title length $\ge 10$ chars, Description $\ge 20$ chars, valid destination city.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 2.1: Successfully Posting a Question Thread
```gherkin
Scenario: Posting a New Question Thread
  Given an authenticated user
  When the user submits a new question with:
    | Field       | Value                                                   |
    | city        | "Đà Nẵng"                                               |
    | title       | "Where can I find the best seafood near My Khe beach?"  |
    | category    | "Food & Dining"                                         |
    | content     | "Looking for fresh, reasonable prices where locals eat."|
  Then the system validates title and content length
    And creates a document in MongoDB "forum_questions" with:
      - userId: user's PostgreSQL UUID
      - replyCount: 0
      - upvotes: 0
      - isResolved: false
    And returns HTTP 201 Created
    And the user is redirected to the newly created question thread
```

##### Scenario 2.2: Rejection of Short or Spammy Inquiries
```gherkin
Scenario: Rejecting Short Title or Blank Content
  Given the user enters title "Help" (4 characters)
  When the form is submitted
  Then validation fails with: "Title must be at least 10 characters long"
    And no question is saved to the database
```

---

### `US-COMM-03`: Cross-DB "City Verified" Answer Attachment (USP)

* **Story ID:** `US-COMM-03` (Traces to `FR-28`, `FR-29`, `UC-06`, `NFR-04`)
* **Role / Persona:** Experienced Traveler with Badge (`Contributor`)
* **User Story Statement:**
  > **As an** Experienced Traveler holding a City Badge,  
  > **I want my** posted answers in that city's forum to automatically receive an authenticated gold "City Verified" badge frame,  
  > **So that** other travelers immediately recognize my response as grounded in real on-the-ground experience.
* **Priority:** `Must Have`
* **Estimation:** 8 Story Points
* **Polyglot Bridge Flow:**
  1. API receives answer submission in Express.
  2. API queries PostgreSQL `user_badges` JOIN `badges` matching `req.user.id` and question's `city`.
  3. If badge exists: insert into MongoDB `forum_answers` with `isCityVerified: true`, `hasCityBadge: true`, `verifiedBadgeTitle: "Da Nang Explorer"`.
  4. If badge absent: insert with `isCityVerified: false`.

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 3.1: Answering with Verified City Badge (Happy Path / USP)
```gherkin
Scenario: Verified Author Posts Answer in City Forum
  Given User A possesses "Da Nang Explorer Badge" recorded in PostgreSQL table "user_badges"
    And Question Q1 belongs to city "Đà Nẵng"
  When User A posts an answer: "Visit Quan Be Man on Vo Nguyen Giap street. Fresh seafood and fair prices."
  Then the Express backend queries PostgreSQL:
    """
    SELECT b.name FROM user_badges ub 
    JOIN badges b ON ub.badge_id = b.id 
    WHERE ub.user_id = $1 AND b.city = 'Đà Nẵng'
    """
    And finds the active badge "Da Nang Explorer"
    And inserts the answer into MongoDB collection "forum_answers" with:
      - isCityVerified: true
      - hasCityBadge: true
      - verifiedBadgeTitle: "Da Nang Explorer"
    And returns HTTP 201 Created
    And the answer card renders with:
      - A distinctive gold metallic border
      - A golden crown icon beside the author avatar
      - A verification label: "✓ Da Nang Verified — Visited 3 landmarks & passed Quiz"
```

##### Scenario 3.2: Regular User Answering without City Badge
```gherkin
Scenario: Unverified Author Posts Answer
  Given User B does not possess a badge for "Đà Nẵng"
  When User B posts an answer to the same Da Nang question
  Then the PostgreSQL cross-check returns zero badge records
    And the answer is saved in MongoDB with "isCityVerified: false"
    And the answer renders with standard grey borders and no verification badge
```

---

### `US-COMM-04`: Verified Answer Priority Ranking Algorithm

* **Story ID:** `US-COMM-04` (Traces to `FR-30`, `UC-06`)
* **Role / Persona:** Advice-Seeking Traveler (`Traveler`)
* **User Story Statement:**
  > **As a** Question Asker,  
  > **I want** answers from "City Verified" travelers to be automatically prioritized at the top of the discussion thread,  
  > **So that** I read authentic, vetted advice before unverified opinions.
* **Priority:** `Must Have`
* **Estimation:** 5 Story Points
* **Sorting Hierarchy:**
  1. `isCityVerified: -1` (Verified answers first)
  2. `upvotes: -1` (Most upvoted next)
  3. `createdAt: 1` (Oldest/chronological tie-breaker)

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 4.1: Verified Answers Pinned to Top of Thread
```gherkin
Scenario: Priority Sorting of Verified Answers Over Unverified Answers
  Given a question thread with 3 answers:
    | Answer ID | Author  | isCityVerified | Upvotes | Created Timestamp |
    | Ans_1     | User_B  | false          | 12      | 10:00 AM          |
    | Ans_2     | User_C  | false          | 3       | 10:30 AM          |
    | Ans_3     | User_A  | true           | 5       | 11:00 AM          |
  When a user views the question thread
  Then the answers are sorted in the exact sequence:
    1. Ans_3 (isCityVerified: true, 5 upvotes)
    2. Ans_1 (isCityVerified: false, 12 upvotes)
    3. Ans_2 (isCityVerified: false, 3 upvotes)
    And Ans_3 displays at position #1 with a highlighted "Top Verified Answer" badge
```

---

### `US-COMM-05`: Nested Discussion Comments & Upvote Mechanism

* **Story ID:** `US-COMM-05` (Traces to `FR-28`)
* **Role / Persona:** Community Member (`Traveler`)
* **User Story Statement:**
  > **As a** Community Member,  
  > **I want to** upvote helpful answers and reply with nested comments,  
  > **So that** I can express gratitude and seek clarifications without cluttering the top-level answer list.
* **Priority:** `Should Have`
* **Estimation:** 5 Story Points
* **Integrity Constraint:** One upvote per user per answer (`$addToSet: { upvotedBy: userId }`).

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 5.1: Upvoting an Answer with Anti-Duplicate Protection
```gherkin
Scenario: Toggling Upvote on an Answer
  Given an authenticated user viewing an answer with upvotes = 5
    And user has not previously upvoted this answer
  When the user taps the "Helpful / Upvote" button
  Then the API executes an atomic update on MongoDB:
    """
    db.forum_answers.updateOne(
      { _id: answerId, upvotedBy: { $ne: userId } },
      { $inc: { upvotes: 1 }, $push: { upvotedBy: userId } }
    )
    """
    And upvotes count updates to 6
    And the button icon fills in with an active color
  When the user taps the Upvote button a second time
  Then the upvote is retracted: upvotes decrements to 5 and userId is removed from upvotedBy
```

##### Scenario 5.2: Adding a Nested Comment to an Answer
```gherkin
Scenario: Submitting a Nested Clarification Comment
  Given an existing answer "Ans_1"
  When the user posts a reply: "What time does Quan Be Man close in the evening?"
  Then a new document is inserted into "comments" with reference "answerId: Ans_1"
    And the comment renders indented beneath Ans_1
```

---

### `US-COMM-06`: Content Flagging & Community Moderation Queue

* **Story ID:** `US-COMM-06` (Traces to `FR-34`, `UC-08`)
* **Role / Persona:** Responsible Community Member (`Traveler`) / Admin (`Moderator`)
* **User Story Statement:**
  > **As a** Community Member,  
  > **I want to** report abusive, spammy, or commercial advertisement posts,  
  > **So that** moderators can review and remove harmful content to keep the travel forum trustworthy.
* **Priority:** `Should Have`
* **Estimation:** 3 Story Points

#### Detailed Acceptance Criteria (Gherkin Scenarios)

##### Scenario 6.1: Reporting a Spam Answer
```gherkin
Scenario: User Flags a Spam Post
  Given an inappropriate answer containing commercial spam links
  When the user taps "Report" and selects reason "Commercial Spam / Advertising"
  Then the system records a report in MongoDB collection "reports":
    - targetType: "answer"
    - targetId: answerId
    - reporterId: userId
    - reason: "SPAM"
    - status: "PENDING_REVIEW"
    And returns HTTP 200 OK: "Thank you. Your report has been submitted to moderators."
```

##### Scenario 6.2: Automated Shadow-Hiding upon Multiple Reports
```gherkin
Scenario: Automatic Hiding After Exceeding Report Threshold
  Given an answer accumulates 3 independent reports from distinct users
  When the 3rd report is recorded
  Then the system sets "isReported: true" and "isHidden: true"
    And the answer is hidden from public view pending admin review
```

---

## 4. CROSS-MODULE TRACEABILITY & INTEGRATION MATRIX

| User Story ID | Functional Req | Use Case ID | Primary Data Store | Secondary Data Store | Primary Service / Component |
|---|---|---|---|---|---|
| **`US-GAME-01`** | `FR-19` | `UC-04` | PostgreSQL `landmarks` | None | `LandmarkService` |
| **`US-GAME-02`** | `FR-20` | `UC-04` | None (Runtime Calc) | PostgreSQL `landmarks` | `GeofenceValidator` (Haversine) |
| **`US-GAME-03`** | `FR-21` | `UC-04` | None (Local Camera) | Cloudinary CDN | `InAppCamera` & Watermark |
| **`US-GAME-04`** | `FR-22` | `UC-04` | PostgreSQL `checkins` | Cloudinary CDN | `CheckinService` (Unique Anti-Spam)|
| **`US-GAME-05`** | `FR-23` | `UC-05` | PostgreSQL `quiz_questions`| None | `QuizService` (Randomized Fetch) |
| **`US-GAME-06`** | `FR-24` | `UC-05` | PostgreSQL `users, quiz_attempts`| None | `ScoringEngine` (XP & Level) |
| **`US-GAME-07`** | `FR-25` | `UC-05` | PostgreSQL `user_badges, badges`| None | `BadgeEvaluatorService` |
| **`US-COMM-01`** | `FR-26` | None | MongoDB `forum_questions` | None | `CommunityFeedService` |
| **`US-COMM-02`** | `FR-27` | None | MongoDB `forum_questions` | None | `QuestionService` |
| **`US-COMM-03`** | `FR-28, 29`| `UC-06` | MongoDB `forum_answers` | PostgreSQL `user_badges` | `PolyglotVerificationBridge` (USP)|
| **`US-COMM-04`** | `FR-30` | `UC-06` | MongoDB `forum_answers` | None | `AnswerRankingAlgorithm` |
| **`US-COMM-05`** | `FR-28` | None | MongoDB `forum_answers, comments`| None | `InteractionService` |
| **`US-COMM-06`** | `FR-34` | `UC-08` | MongoDB `reports` | None | `ModerationService` |

---

## 5. QUALITY ATTRIBUTES & NON-FUNCTIONAL ACCEPTANCE CRITERIA

In accordance with **ISO/IEC 25010** software quality standards:

1. **Precision & Security (`NFR-02`, `NFR-04`):**
   * Geofencing distance calculation must execute on the backend server using verified coordinates to prevent client-side GPS spoofing.
   * Quiz answers must never be exposed to the client bundle prior to answer submission.
   * Check-in records must enforce strict database constraints (`UNIQUE(user_id, landmark_id)`).

2. **Performance Efficiency (`NFR-01`):**
   * Polyglot cross-check between PostgreSQL `user_badges` and MongoDB `forum_answers` must execute in **$< 80\text{ms}$** upon answer submission.
   * City question feed query with pagination must deliver response times **$< 120\text{ms}$**.

3. **Data Consistency (`NFR-04`):**
   * All `userId` fields in MongoDB collections (`forum_questions`, `forum_answers`, `comments`, `reports`) must store valid UUID strings corresponding to `users(id)` in PostgreSQL.
