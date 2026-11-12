FINAL YEAR PROJECT PROPOSAL: NOMADIX
All-in-one Smart Travel Platform
1. EXECUTIVE SUMMARY
Nomadix is a mobile application designed to solve the fragmented experience of independent travelers. Typically, a user must juggle multiple applications to find flights and hotels (e.g., Agoda, Traveloka), plan itineraries (e.g., Google Docs, Maps), and share experiences (e.g., Facebook, Instagram).
Nomadix consolidates all these needs into a single, cohesive ecosystem. Furthermore, the project integrates a Gamification model to encourage users to deeply interact with local cultures and to build a high-quality, verified travel community.
2. CORE MODULES & WORKFLOW
2.1. Booking Aggregator (Smart Search Engine)
Acts as a Third-party Aggregator to provide the best travel deals.
Multi-API Integration: Connects with the Developer APIs of major Online Travel Agencies (OTAs): Booking.com, Trip.com, Agoda, Skyscanner, and Traveloka.
Data Normalization Algorithm: Receives diverse JSON data streams from 5 different API sources, processes them, and normalizes the data into a unified format for seamless user display.
Personalized Filtering: Enables cross-searching (e.g., matching the "Cheapest flight from Airline A" with a "4-star hotel nearest to the city center from Agoda/Booking").
Caching Mechanism: Utilizes Redis to cache popular search queries, minimizing external API calls and preventing the exhaustion of Developer API rate limits.
2.2. Itinerary Planner (Planning & Management)
Self-Planning Tool: Provides an intuitive Drag & Drop interface. Integrates the Google Maps API to estimate distances and travel times between destinations.
Touring Community (Social Sharing):
Users can publish their personal itineraries to the social News Feed.
Clone & Edit Feature: Allows users to duplicate another traveler's itinerary into their personal workspace with a single click, which they can then customize to fit their own schedule.
2.3. Gamification (Travel Experience Gamified)
This module serves as the Unique Selling Proposition (USP) of Nomadix.
Location-based Check-in: Utilizes the device's Geolocation (GPS) and Camera. The check-in photo upload feature is strictly unlocked only when the user is physically at the coordinates of a designated landmark.
Culture Quiz: A randomized multiple-choice question bank testing the user on the history, cuisine, and culture of the visited city.
Badge System: Completing Check-ins and Quizzes unlocks a "City Badge." These badges are prominently displayed on the user's Profile, establishing a Trust Score within the community.
2.4. Community Forum (Q&A)
A dedicated Q&A space categorized by Country and City.
Expert Verification: Users who have earned a "City Badge" will receive a prominent verification highlight when answering questions related to that specific city, increasing the credibility of their responses.
3. SYSTEM ARCHITECTURE & PROPOSED TECH STACK
The project adopts a Full-stack JavaScript architecture, optimizing development time and synchronizing data logic across the entire system.
Frontend (Mobile App Interface): React Native (JavaScript)
Justification: Enables cross-platform mobile app development (iOS and Android) with a single codebase. React Native offers robust support for map libraries (React Native Maps) and native hardware integration (Camera, GPS), which is mandatory for the Gamification and Itinerary Planner modules.
Backend (API & Logic Processing): Node.js (Express.js) with JavaScript
Justification: Node.js features a Non-blocking I/O architecture. This is critical for the Booking Aggregator module, as the server must simultaneously request and await data from 5 external third-party APIs without causing system bottlenecks.
Databases:
PostgreSQL: Stores highly relational and structured data (User profiles, Bookings, Badges).
MongoDB: Highly compatible with Node.js for storing unstructured, dynamic data (Flexible Itinerary structures, Forum posts, and comments).
Redis: Acts as an in-memory caching layer for frequent flight/hotel search results to accelerate response times.
Third-party Integrations:
Mapping Services: Google Maps API & Google Places API.
Cloud Storage: Cloudinary or AWS S3 for optimizing and storing user check-in images.
4. RISK MANAGEMENT & MITIGATION
Risk 1: Partner API Rate Limits: Developer API tiers often have strict request quotas.
Mitigation: Develop a fallback Mock Data system to test and seamlessly demonstrate the project in case the actual API quotas are exceeded during the final presentation.
Risk 2: Gamification Exploitation (Fake GPS): Users might spoof their location to collect badges without traveling.
Mitigation: Within the scope of a final year project, the system will focus on basic coordinate validation at the time of the image upload. Advanced anti-cheat mechanisms will be documented under "Future Developments" in the thesis report.
5. IMPLEMENTATION PLAN (5-MONTH AGILE ROADMAP)
Month 1: Conduct requirement analysis, design Database Schema (ERD), create UI/UX wireframes (Figma), and set up the Git repository with the base project structure.
Month 2: Develop the Authentication Module and Core Backend. Register for and successfully test data retrieval from OTA APIs (Agoda, Skyscanner, etc.).
Month 3: Build the core Itinerary Planner Module, implement Drag & Drop functionality, and integrate Google Maps.
Month 4: Develop the Gamification Module (GPS Check-in, Quiz logic) and the Community Forum.
Month 5: Perform full E2E system integration, conduct Unit/System Testing, fix bugs, and finalize the Thesis Report and Presentation Deck.

