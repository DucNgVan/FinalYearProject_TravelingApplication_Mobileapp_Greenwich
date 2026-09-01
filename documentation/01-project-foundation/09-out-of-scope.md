# 09. Out-of-Scope Items

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyen Van Duc  

---

## 1. Explicitly Excluded Features

To maintain quality and ensure successful completion within the 5-month timeline, the following items are formally declared out of scope for the MVP:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        OUT-OF-SCOPE BOUNDARIES                         │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Direct Bank Clearing  │ No automated bank-to-bank money transfers   │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 2. Full OTA Ticketing    │ Aggregation & redirection only; no ticketing│
├──────────────────────────┼─────────────────────────────────────────────┤
│ 3. Advanced Anti-Cheat   │ Basic GPS geofencing; no kernel mock checks │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 4. AI Travel Assistant   │ Conversational LLM deferred to roadmap      │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 5. Real-Time Chat        │ No direct 1-on-1 socket-based chat          │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 6. Social Following      │ No friend graphs or follower activity feeds │
└──────────────────────────┴─────────────────────────────────────────────┘
```

---

## 2. Rationale for Exclusions

1. **Automated Bank-to-Bank Money Transfers:** While Nomadix provides a complete Group Expense & Debt Settlement ledger (calculating balances, splits, and optimal payee-payer transactions), executing real-world financial wire transfers directly inside the app would require an official payment intermediary license, banking compliance, and strict PCI-DSS auditing. Instead, users settle debts using standard external banking apps or QR codes and mark settlements as confirmed in-app.
2. **Full OTA Booking Operations:** Focus is placed on data normalization, search, comparison, and provider redirection rather than handling ticketing and cancellations.
3. **Advanced Anti-Fraud:** Standard mobile GPS coordinates and Haversine distance verification are sufficient for project evaluation without low-level device attestation.
4. **AI & Social Chat:** These features are preserved in the future roadmap to avoid diluting development efforts away from the core travel continuum.
