# 04. Project Objectives & Success Measures

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Day 1 Objectives

The goal of Day 1 is to establish a clear and controlled foundation for the Nomadix project, answering 8 fundamental questions:

1. **What problem does Nomadix solve?**  
   Resolves the fragmented travel lifecycle and eliminates group travel coordination chaos and bill splitting friction by unifying search, collaborative planning, shared expense splitting, GPS check-in, quizzes, and verified community Q&A into one app.
2. **Who will use Nomadix?**  
   Independent solo travelers and companion travel groups (primary), experienced travel contributors (secondary), and system administrators.
3. **What is the main purpose of Nomadix?**  
   To provide an integrated smart travel ecosystem connecting discovery, collaborative planning, group expense transparency, physical exploration, gamified learning, and verified community knowledge.
4. **What are the core modules?**  
   Seven modules: Authentication & Profile, Smart Booking Search, Collaborative Itinerary Planner, Group Expense Tracking & Bill Splitting, Gamification & Location Engine, Community Q&A, and Verified Travel Experience.
5. **What functionality is included in the project?**  
   All core MVP workflows across the 7 modules including companion invitations, real-time shared trip viewing, bill photo upload, automated expense splitting, debt simplification settlement, and should-have enhancements (Redis caching, advanced filters).
6. **What functionality is excluded?**  
   Direct banking gateway payment wire transfers (settlement is recorded and verified in-app without direct banking license integration), full commercial OTA ticketing, advanced kernel-level mock GPS detection, and real-time private 1-on-1 chat.
7. **What is the Minimum Viable Product (MVP)?**  
   A cohesive flow proving travelers can search, plan a multi-day trip, invite friends to the plan who see updates in sync, upload a bill to split group expenses with debt settlement, physically visit a landmark, verify via GPS, complete a quiz, earn a badge, and display a verified badge in community Q&A.
8. **What makes Nomadix different from existing travel applications?**  
   The unique convergence of location-verified cultural gamification, trusted community authority, and seamless multi-companion itinerary collaboration with integrated debt-simplification expense splitting.

---

## 2. Project Success Measures

```text
┌─────────────────────────────────────────────────────────────┐
│                   SUCCESS EVALUATION CRITERIA               │
├─────────────────┬───────────────────────────────────────────┤
│ 1. Functional   │ Core workflows execute without errors     │
├─────────────────┼───────────────────────────────────────────┤
│ 2. Collaboration│ Multi-user itinerary sync & permissioning │
├─────────────────┼───────────────────────────────────────────┤
│ 3. Financial    │ 100% balance integrity (Σ net balances = 0)│
├─────────────────┼───────────────────────────────────────────┤
│ 4. Technical    │ Multi-tech stack integration & stability  │
├─────────────────┼───────────────────────────────────────────┤
│ 5. Usability    │ Frictionless user journey without manuals │
├─────────────────┼───────────────────────────────────────────┤
│ 6. Performance  │ Quantifiable Redis caching latency gains  │
└─────────────────┴───────────────────────────────────────────┘
```

### Performance & Calculation Benchmark Goals
* Demonstrate measurable latency reduction between cold external API requests and warm Redis cache hits during Month 5 testing:
  $$\text{Response Time}_{\text{Redis}} \ll \text{Response Time}_{\text{External API}}$$
* Guarantee strict double-entry balance consistency for group expense splitting:
  $$\sum_{i=1}^{n} \text{NetBalance}_i = 0$$

---

## 3. Definition of Done (DoD) Checklist for Day 1

- [x] Problem statement finalized and documented (including group coordination & expense pain points).
- [x] Project vision & mission finalized.
- [x] Core objectives and evaluation criteria defined.
- [x] Target users and personas identified (solo & squad travelers).
- [x] Seven core functional modules defined.
- [x] MVP boundaries and 21-step scenario established.
- [x] Out-of-scope boundaries demarcated.
- [x] Project constraints documented.
- [x] Day 1 deliverables organized and committed.
