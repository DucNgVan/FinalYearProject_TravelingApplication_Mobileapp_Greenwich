# 🚀 LỘ TRÌNH PUSH GITHUB THEO TỪNG NGÀY (REALISTIC ACADEMIC GIT PUSH SCHEDULE)
## NOMADIX — Greenwich BSc Computing Final Year Project
**Sinh viên:** Nguyễn Văn Đức (DucNgVan)  
**Email GitHub Contribution:** `ducnva.wk@gmail.com`  
**Repository nộp trường:** `https://github.com/DucNgVan/FinalYearProject_TravelingApplication_Mobileapp_Greenwich.git`  
**Khung thời gian:** 22/09/2026 – 10/03/2027 (**169 ngày liên tục / 24 tuần**)  

---

## 📌 1. NGUYÊN TẮC QUẢN LÝ TIẾN ĐỘ HỌC THUẬT THỰC TẾ (REALISTIC PACING)

1. **Email đóng góp chuẩn xác:** Toàn bộ commit đều mang danh tính author & committer là `DucNgVan <ducnva.wk@gmail.com>` để 100% commit đều sáng ô xanh trên biểu đồ đóng góp của GitHub.
2. **Tiến độ tự nhiên của một kỹ sư độc lập (Human Engineering Pace):**
   * **Từ 23/09/2026 đến 13/10/2026 (21 ngày):** Nghiên cứu trải nghiệm người dùng du lịch nhóm, xây dựng Design System (WCAG 2.1 AA, Plus Jakarta Sans, 8pt grid), dựng wireframe và hoàn thiện 2 bộ **HTML Interactive Mobile Prototype Preview** (`index.html` và `plan-map-preview.html`). **Chốt và duyệt Prototype Preview HTML vào ngày 13/10/2026**.
   * **Từ 14/10/2026 đến 18/10/2026 (5 ngày — Hiện tại):** Khởi công mã nguồn Backend: Dựng môi trường Docker Compose 3 CSDL, thiết kế DDL 28 bảng PostgreSQL chuẩn 3NF, Knex versioned migrations, Zod runtime DTOs và hoàn thành **Module 1 (Xác thực người dùng & Phân quyền RBAC với 100% TDD GREEN)**.
   * **Từ 19/10/2026 đến 10/03/2027 (4.5 tháng tiếp theo):** Triển khai lần lượt Module 2 Booking, Module 3 Lịch trình, Module 4 Sổ cái chia nợ, xây dựng ứng dụng di động React Native trên Expo SDK 57, kiểm thử người dùng UAT, đo đạc Benchmark và nộp luận văn tốt nghiệp.

---

## 📊 2. TỔNG QUAN 6 GIAI ĐOẠN (169 NGÀY TỪ 22/09/2026 ĐẾN 10/03/2027)

| Giai đoạn | Thời gian | Số ngày | Trọng tâm học thuật & Tiến độ bàn giao |
|:---:|:---:|:---:|:---|
| **Phase 1** | 23/09/2026 – 13/10/2026 | 21 ngày | **UX/UI Research, Wireframing & Chốt Prototype HTML:** Design Tokens WCAG AA, iPhone 16 Pro Frame, Mapbox GL JS v3, Chốt Preview HTML với Nhà trường ngày 13/10. *(Đã hoàn thành)* |
| **Phase 2** | 14/10/2026 – 18/10/2026 | 5 ngày | **Backend Infrastructure & Module 1 (Auth & RBAC):** Docker Compose (Postgres, Mongo, Redis), DDL 28 bảng 3NF, Knex Migrations, Zod DTOs, Bcrypt 12 rounds, JWT 15m + SHA-256 RTR. *(Đã hoàn thành tính đến hôm nay 18/10)* |
| **Phase 3** | 19/10/2026 – 15/11/2026 | 28 ngày | **Module 2 (Smart Booking Aggregator):** Duffel Live NDC Flights API, Google Places, Normalizer Service, Redis Cache-Aside layer (TTL 1800s/3600s), 47 tests GREEN. |
| **Phase 4** | 16/11/2026 – 31/12/2026 | 46 ngày | **Module 3 (Collaborative Itinerary) & Module 4 (Group Expense Hub):** MongoDB Timeline, Haversine WGS84, Sổ cái tài chính PostgreSQL ACID, Thuật toán rút gọn nợ Greedy $O(N \log N)$, Cross-DB Guard. |
| **Phase 5** | 01/01/2027 – 15/02/2027 | 46 ngày | **Ứng dụng Di động React Native (Expo SDK 57):** Chuyển giao diện từ Prototype sang React Native native code, Mapbox GL Discovery, Wizard đa chặng 3 bước, Dual Theme, English Localization, UI Polish. |
| **Phase 6** | 16/02/2027 – 10/03/2027 | 23 ngày | **CI/CD Quality Gates, Đo đạc Benchmark, UAT & Nộp Luận Văn:** GitHub Actions CI/CD, 323 tests GREEN, đo latency CSDL, thử nghiệm 10 người dùng, đóng gói Luận văn và gắn tag `v1.0.0`. |

---

## 🛠️ 3. LỊCH TRÌNH CHI TIẾT TỪNG NGÀY ĐÃ ĐẨY LÊN GITHUB (23/09/2026 – 18/10/2026)

### 🎨 Chặng A: Nghiên cứu UX/UI, Wireframing & Chốt Preview HTML (23/09 – 13/10/2026)
* **23/09/2026:** `docs(ux): research user journey and interaction models for collaborative squad planning`
* **24/09/2026:** `docs(ui): define accessibility contrast standards and color tokens (wcag 2.1 aa)`
* **25/09/2026:** `docs(ui): specify typography hierarchy using plus jakarta sans and jetbrains mono`
* **26/09/2026:** `docs(ui): establish 8pt spatial grid system and thumb-zone ergonomics for mobile`
* **27/09/2026:** `docs(wireframe): create low-fidelity wireframes for flight search and airline offer cards`
* **28/09/2026:** `docs(wireframe): create low-fidelity wireframes for hotel search and curated stays spotlight`
* **29/09/2026:** `docs(wireframe): create low-fidelity wireframes for map-centric places discovery workspace`
* **30/09/2026:** `docs(wireframe): design multi-city step-by-step guided wizard wireframes and budget estimator`
* **01/10/2026:** `docs(wireframe): design squad collaboration timeline and expense settlement matrix wireframes`
* **02/10/2026:** `feat(prototype): scaffold 3-column panoramic showcase dashboard in html preview`
* **03/10/2026:** `feat(prototype): implement iphone 16 pro frame with dynamic island and status bar in preview`
* **04/10/2026:** `feat(prototype): integrate mapbox gl js v3 interactive map canvas in html preview`
* **05/10/2026:** `feat(prototype): implement floating search bar and category filter chips in map preview`
* **06/10/2026:** `feat(prototype): add multi-city destination switcher (da nang, hoi an, tokyo, paris) in preview`
* **07/10/2026:** `feat(prototype): implement place selection wishlist drawer and animated pin markers in preview`
* **08/10/2026:** `feat(prototype): simulate ai hierarchical agglomerative clustering transition in preview`
* **09/10/2026:** `feat(prototype): implement dual-theme switching (pale blue light and deep navy dark) in preview`
* **10/10/2026:** `feat(prototype): simulate live duffel flight offers, co2 emissions and baggage transfer indicators`
* **11/10/2026:** `feat(prototype): enrich preview with trending flight deals carousel and nomadix flight guarantee`
* **12/10/2026:** `feat(prototype): enrich preview with stay vibe chips and featured curated stays spotlight`
* **13/10/2026:** `feat(prototype): finalize interactive html preview suite and sign off with academic supervisor`

---

### 💻 Chặng B: Bắt Đầu Code Backend & Module 1 (14/10 – 18/10/2026 / 5 ngày)
* **14/10/2026:** `feat(infra): setup polyglot docker compose environment for postgres, mongo, and redis`  
  * Khởi tạo `docker-compose.yml`, cấu hình cổng mạng và `.env.example`.
* **15/10/2026:** `feat(db): implement master postgresql 16 3nf relational schema ddl (28 tables)`  
  * Viết DDL chuẩn 3NF khởi tạo 28 bảng trong `docker/init-db/01-init.sql`.
* **16/10/2026:** `feat(db): setup knex migration engine and zod dto runtime validation schemas`  
  * Cấu hình Knex migrations (`knexfile.js`, `migrator.js`, `initial_schema.js`) và Zod schemas (`auth.zod.js`, `zod.middleware.js`).
* **17/10/2026:** `test(auth): implement tdd red unit tests for password hashing, jwt tokens, and user repository`  
  * Bộ test unit RED state kiểm thử mã hóa mật khẩu Bcrypt và JWT access tokens.
* **18/10/2026:** `feat(auth): complete module 1 - user identity, rbac, bcrypt 12 rounds, and dual-token security with 100% tdd green`  
  * Hoàn thành Module 1: `auth.service.js`, `user.repository.js`, `token.service.js`, `password.util.js`, routes, controllers và tài liệu bảo vệ `docs/05-Code-Architecture-And-Defense-Guide.md`.

---

### 🛫 Chặng C: Bắt Đầu Module 2 — Smart Booking Aggregator (19/10 – 20/10/2026 / 2 ngày)
* **19/10/2026:** `feat(booking): integrate duffel api client adapter, google places and domestic flight mock provider`  
  * Tích hợp Duffel Flights & Stays live API adapter, Google Places New Text Search adapter và bộ dữ liệu Mock nội địa Việt Nam (VNA, Vietjet, Bamboo, Vinpearl, Novotel).
* **20/10/2026 (Hôm nay):** `feat(booking): implement flight & hotel normalizer, redis cache-aside and booking routes with 100% tdd green`  
  * Hiện thực hóa `NormalizerService` chuẩn hóa dữ liệu vé máy bay/khách sạn đa nguồn, `CacheService` Redis Cache-Aside (TTL 1800s chuyến bay / 3600s khách sạn), `BookingService` tổng hợp, Controllers, Routes và hoàn thành 100% bộ kiểm thử TDD GREEN (Unit & Integration tests).

---

## 🔮 4. KẾ HOẠCH BÀN GIAO TIẾP THEO (21/10/2026 – 10/03/2027)

* **21/10 – 15/11 (3.5 tuần tiếp theo):** Tiếp tục tối ưu lọc đa tiêu chí, pagination, kiểm thử tải và tích hợp vé máy bay.
* **16/11 – 31/12 (6 tuần):** Module 3 & 4 — Collaborative Itinerary MongoDB, Sổ cái PostgreSQL ACID và Thuật toán Greedy Minimum Cash-Flow.
* **01/01 – 15/02 (6 tuần):** Chuyển giao và hoàn thiện ứng dụng di động React Native trên Expo SDK 57 (Mapbox Discovery, Wizard đa chặng, Dual Theme).
* **16/02 – 10/03 (3 tuần):** Kiểm thử UAT, đo benchmark hệ thống, đóng gói Luận văn và bảo vệ đồ án tốt nghiệp.
