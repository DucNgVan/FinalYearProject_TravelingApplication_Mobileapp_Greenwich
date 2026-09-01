# 01. Project Overview

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  
**Duration:** 5 Months  

---

## 1. Executive Summary

**Nomadix** is a cross-platform mobile application designed to provide a unified, end-to-end travel experience for independent travelers. Instead of requiring users to switch between 5+ disconnected applications across the travel lifecycle, Nomadix consolidates travel search, itinerary planning, location-verified exploration, cultural gamification, and verified community discussions into a single cohesive platform.

---

## 2. Project Metadata

| Attribute | Specification |
|---|---|
| **Project Title** | Nomadix — All-in-one Smart Travel Platform |
| **Project Type** | Final Year Project (FYP) |
| **Academic Institution** | University of Greenwich |
| **Development Duration** | 5 Months (August 2026 – January 2027) |
| **Application Type** | Cross-platform Mobile Application |
| **Target Platform** | iOS & Android |

---

## 3. Technology Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                    NOMADIX TECH STACK                       │
├─────────────────┬───────────────────────────────────────────┤
│ Frontend Mobile │ React Native (JavaScript)                 │
├─────────────────┼───────────────────────────────────────────┤
│ Backend API     │ Node.js + Express.js (JavaScript)         │
├─────────────────┼───────────────────────────────────────────┤
│ Relational DB   │ PostgreSQL (Users, Trips, Badges, Checks) │
├─────────────────┼───────────────────────────────────────────┤
│ Document DB     │ MongoDB (Community Q&A, Comments, Quizzes)│
├─────────────────┼───────────────────────────────────────────┤
│ In-Memory Cache │ Redis (API Caching & Fast Reads)          │
├─────────────────┼───────────────────────────────────────────┤
│ Maps & Geo API  │ Google Maps Platform                      │
├─────────────────┼───────────────────────────────────────────┤
│ Cloud Storage   │ Cloudinary / AWS S3 (Photos & Assets)     │
└─────────────────┴───────────────────────────────────────────┘
```

---

## 4. Key Concept & Features

Nomadix integrates the entire independent and group travel continuum:

* **Travel Search & Discovery:** Multi-provider search and comparison for flights and hotels.
* **Smart & Collaborative Itinerary Planner:** Drag-and-drop daily scheduling with interactive Google Maps routing, distance/duration calculation, plus **multi-user companion invitation** where friends can view and edit the same shared itinerary in real time.
* **Group Expense Tracking & Bill Splitting:** Integrated trip treasury where companions can upload bills/receipts, log shared expenses across categories, split costs equally or custom, view real-time net balances, and run debt simplification settlement calculations.
* **Location-Based Check-in:** Real-time GPS geofence validation ($\le 100\text{m}$) and native camera photo upload.
* **Cultural Gamification:** Landmark-specific cultural quizzes, XP progression, and collectible City Badges.
* **Community Q&A with Verified Badges:** City-specific Q&A forums where answers from badge holders display a **"City Verified"** trust indicator.
