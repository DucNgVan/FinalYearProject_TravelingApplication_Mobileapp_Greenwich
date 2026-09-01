# 08. Minimum Viable Product (MVP) Definition & Test Scenario

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. MVP Concept & Hypothesis

The Nomadix MVP validates the core product hypothesis:

> **"Travelers can discover travel options, co-plan a trip with companions, synchronize their shared itinerary in real time, upload bill receipts to transparently split group expenses with automated debt settlement, physically visit destinations, verify via GPS geofencing, learn through cultural quizzes, earn achievements, and establish verified credibility in the community."**

```text
REGISTER → SEARCH → CO-PLAN → SYNC WITH FRIENDS → UPLOAD BILL → SPLIT EXPENSES → TRAVEL → GPS CHECK-IN → QUIZ → BADGE → COMMUNITY
```

---

## 2. 22-Step MVP Success Scenario

The MVP is complete and successful if an evaluator can execute this complete end-to-end script:

| Step | Action | Expected Output | Module |
|---|---|---|---|
| **1** | Open app & select Register | Account registration form renders | Auth |
| **2** | Submit valid registration | User saved in PostgreSQL; JWT returned | Auth |
| **3** | Log into application | Navigates to Home dashboard | Auth |
| **4** | Search for flight (HAN → DAD) | Displays flight comparison cards | Booking Search |
| **5** | Search for hotel in Da Nang | Displays hotel comparison cards | Booking Search |
| **6** | Create trip "Da Nang Squad Trip" | Trip initialized in MongoDB & Postgres | Collaborative Itinerary |
| **7** | Add Marble Mountains & Dragon Bridge | Activities scheduled across Day 1 & Day 2 | Collaborative Itinerary |
| **8** | View trip on Google Map | Route plotted with distance and travel time | Collaborative Itinerary |
| **9** | Invite friend `@travelmate` to trip | Invite dispatched; companion joins with `editor` role | Collaborative Itinerary |
| **10** | Companion logs in on 2nd device | Companion sees identical shared itinerary & map | Collaborative Itinerary |
| **11** | Companion snaps & uploads seafood bill | Bill receipt uploaded to Cloudinary; expense logged (1,200,000 VND) | Group Expense Hub |
| **12** | Configure split model (Equal 50/50) | System computes individual shares (600,000 VND each) | Group Expense Hub |
| **13** | View Group Expense Dashboard | Total spend 1.2M VND; Net balance (+600k payer, -600k user); Debt settlement plan generated | Group Expense Hub |
| **14** | Open Landmarks → "Dragon Bridge" | Landmark card & Check-in button display | Gamification |
| **15** | Trigger GPS Check-in | Requests device GPS location | Gamification |
| **16** | Location validated ($\le 100\text{m}$) | System unlocks check-in button | Gamification |
| **17** | Capture photo via camera | Camera opens, watermarked photo captured | Gamification |
| **18** | Upload photo | Photo uploaded to Cloudinary | Gamification |
| **19** | Take Cultural Quiz | 3-question quiz presented | Gamification |
| **20** | Submit Quiz | Answers scored; XP awarded | Gamification |
| **21** | View Profile | XP updated; "Da Nang Explorer" badge unlocked | Auth / Gamification |
| **22** | Open Community Q&A & Answer | Answer published with authenticated **"Da Nang Verified"** gold badge | Verified Experience |
