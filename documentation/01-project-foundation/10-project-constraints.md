# 10. Project Constraints & Risk Management

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Project Constraints

| Constraint Category | Constraint Description | Impact & Mitigation |
|---|---|---|
| **Time Constraint** | Strict 5-month development lifecycle (August 2026 – January 2027). | Follow strict Agile sprints; maintain controlled MVP scope. |
| **API Availability & Rate Limits** | External travel APIs may experience outages, changes, or strict query quotas. | Implement a dedicated **Mock Provider fallback** and **Redis cache** layer to decouple development from external uptime. |
| **Budget Constraint** | Student academic project budget does not support enterprise-tier API subscriptions. | Use free developer tiers for Google Maps Platform, Cloudinary, MongoDB Atlas, and mock flight/hotel data. |
| **Technical Constraint** | Consistent full-stack JavaScript architecture across client and server. | React Native for iOS/Android frontends, Node.js + Express.js backend, PostgreSQL + MongoDB + Redis. |

---

## 2. Risk Management & Fallback Strategies

```text
┌─────────────────────────────────────────────────────────────┐
│                    PROJECT RISKS & FALLBACKS                │
├─────────────────┬───────────────────────────────────────────┤
│ API Quota Limit │ Automatically switch to Mock Travel Data  │
├─────────────────┼───────────────────────────────────────────┤
│ Device GPS Test │ Inject mock coordinates during dev tests  │
├─────────────────┼───────────────────────────────────────────┤
│ Cloud Storage   │ Fallback local filesystem image storage   │
├─────────────────┼───────────────────────────────────────────┤
│ Scope Creep     │ Enforce strict Day 1 scope boundaries     │
└─────────────────┴───────────────────────────────────────────┘
```
