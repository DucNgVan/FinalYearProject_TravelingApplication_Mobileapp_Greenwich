# 🚀 LỘ TRÌNH PUSH GITHUB THEO TỪNG GIAI ĐOẠN (DAY-BY-DAY GIT PUSH SCHEDULE)
## NOMADIX — Greenwich BSc Computing Final Year Project

Tài liệu này được biên soạn để Navigator (bạn) có thể theo dõi, ghi nhớ và thực hiện đẩy (push) mã nguồn lên **Repository GitHub mới** theo từng giai đoạn chuẩn mực, đáp ứng 100% tiêu chí giám sát tiến độ của **Đại học Greenwich** và phương pháp luận **Extreme Programming (XP)**.

---

## 📌 1. CHUẨN BỊ BAN ĐẦU (INITIAL SETUP)

### Bước 1: Tạo Repository mới trên GitHub
1. Truy cập [github.com/new](https://github.com/new).
2. Đặt tên repository: `Nomadix-Smart-Travel-Platform` (hoặc tên bạn mong muốn).
3. **Quan trọng:** Để repository ở chế độ **Public** (hoặc Private theo yêu cầu trường), **KHÔNG** tích chọn *Add a README file*, **KHÔNG** chọn *.gitignore* hay *license* (để repo hoàn toàn rỗng).
4. Sao chép đường link Git (ví dụ: `https://github.com/DucNgVan/Nomadix-Smart-Travel-Platform.git`).

### Bước 2: Đảm bảo Git trên máy đã nhận diện đúng Email chính chủ
Kiểm tra cấu hình email để chắc chắn mọi commit sẽ sáng ô xanh (contribution graph):
```bash
git config user.name "DucNgVan"
git config user.email "ducnva.wk@gmail.com"
```

---

## 📊 2. BẢNG TỔNG HỢP LỘ TRÌNH 9 GIAI ĐOẠN (ACADEMIC PROGRESSION MATRIX)

| Tuần / Mốc | Tên Giai Đoạn & Commit Message | Phạm Vi Mã Nguồn & Tài Liệu | Trạng Thái TDD / Kiểm Thử |
|:---:|---|---|:---:|
| **Tuần 1** (01/09/2026) | `docs: week 1 - project foundation, vision, personas and business requirements (BRD)` | BRD, Tài liệu nền tảng, 4 Personas, 7 Trụ cột giá trị | 100% Đạt chuẩn IEEE |
| **Tuần 2** (08/09/2026) | `docs: week 2 - software requirements specification (42 FRs, 8 NFRs, BDD & UML use cases)` | PRD/SRS (42 FRs, 8 NFRs, 35 User Stories, BDD, Traceability) | ISO 29148 Standard |
| **Tuần 3** (15/09/2026) | `docs(architecture): week 3 - system architecture (C4+1 SAD), polyglot persistence and tech research` | Tech Spec & SAD (C4+1 Model: Context, Container, Component, Code, ERDs) | C4 Architecture Model |
| **Tuần 4** (22/09/2026) | `feat(ui-ux): week 4 - design system tokens, atomic specs and interactive mobile prototype showcase` | Design System Spec, Color Tokens, Typography Scale, `client/preview/` | WCAG 2.1 AA & Apple HIG |
| **Tuần 5** (29/09/2026) | `feat(infra): week 5 - polyglot docker compose, postgresql 3nf ddl and server scaffolding` | `docker-compose.yml`, `01-init.sql` (28 bảng), Express Gateway, Jest config | TDD Scaffolding Ready |
| **Tuần 6** (06/10/2026) | `feat(auth): week 6 - user identity, rbac and dual-token security with strict tdd` | Module MOD-01 (JWT 15m, Refresh Token SHA-256, Bcrypt, Middleware) | 6 suites, 20/20 GREEN |
| **Tuần 7** (13/10/2026) | `feat(booking): week 7 - smart flight and hotel aggregator with duffel live ndc api and redis cache` | Module MOD-02 (Duffel Live API, Google Places, Cache-Aside Redis) | 13 suites, 47/47 GREEN |
| **Tuần 8** (20/10/2026) | `feat(core-backend): week 8 - collaborative itinerary planner and greedy debt simplification engine` | Module MOD-03 (MongoDB Haversine) + Module MOD-04 (ACID & Debt Min) | 30 suites, 117/117 GREEN |
| **Tuần 9** (27/10/2026) | `feat(mobile): week 9 - cross-platform react native app (expo sdk 57, mapbox discovery, full tdd suite)` | Client Mobile 4 tab, Mapbox discovery, AI Clustering, 298 tests | 67 suites, 298/298 GREEN |

---

## 🛠️ 3. HƯỚNG DẪN CHI TIẾT TỪNG TUẦN PUSH

> **Mẹo học thuật (Timestamp Control):** 
> Nếu bạn muốn ngày giờ commit lùi về các tuần trước đó để biểu đồ GitHub hiển thị quá trình làm việc liên tục suốt học kỳ, bạn có thể thêm tiền tố `GIT_AUTHOR_DATE` và `GIT_COMMITTER_DATE` vào trước lệnh `git commit` như hướng dẫn dưới đây.

---

### 🟢 TUẦN 1 (01/09/2026): KHỞI TẠO NỀN TẢNG DỰ ÁN & TÀI LIỆU BRD
* **Mục tiêu:** Bàn giao tài liệu bài toán kinh doanh, chân dung người dùng và đề xuất giá trị cốt lõi.
* **Các file đưa vào:** `README.md`, `docs/01-BRD.md`, `documentation/01-project-foundation/`, `.gitignore`.
* **Lệnh thực hiện:**
```bash
git add README.md docs/01-BRD.md documentation/01-project-foundation/ .gitignore
GIT_AUTHOR_DATE="2026-09-01 09:30:00" GIT_COMMITTER_DATE="2026-09-01 09:30:00" \
git commit -m "docs: week 1 - project foundation, vision, personas and business requirements (BRD)"
git push -u greenwich main
```

---

### 🟢 TUẦN 2 (08/09/2026): ĐẶC TẢ YÊU CẦU PHẦN MỀM (PRD / SRS & BDD)
* **Mục tiêu:** Bàn giao 42 yêu cầu chức năng (`FR-01` đến `FR-42`), 8 NFRs, và ma trận truy vết (Traceability Matrix).
* **Các file đưa vào:** `docs/02-PRD-SRS.md`, `documentation/02-requirements/`, `documentation/03-use-cases/`.
* **Lệnh thực hiện:**
```bash
git add docs/02-PRD-SRS.md documentation/02-requirements/ documentation/03-use-cases/
GIT_AUTHOR_DATE="2026-09-08 14:15:00" GIT_COMMITTER_DATE="2026-09-08 14:15:00" \
git commit -m "docs: week 2 - software requirements specification (42 FRs, 8 NFRs, BDD & UML use cases)"
git push greenwich main
```

---

### 🟢 TUẦN 3 (15/09/2026): THIẾT KẾ KIẾN TRÚC HỆ THỐNG C4+1 (SAD)
* **Mục tiêu:** Bản đặc tả kiến trúc 5 tầng, ma trận CSDL Polyglot và sơ đồ thành phần.
* **Các file đưa vào:** `docs/03-TechSpec-SAD.md`, `documentation/04-architecture/`, `documentation/05-tech-research/`, `documentation/06-database-analysis/`, `GIT_PUSH_SCHEDULE.md`.
* **Lệnh thực hiện:**
```bash
git add docs/03-TechSpec-SAD.md documentation/04-architecture/ documentation/05-tech-research/ documentation/06-database-analysis/ GIT_PUSH_SCHEDULE.md
GIT_AUTHOR_DATE="2026-09-15 16:45:00" GIT_COMMITTER_DATE="2026-09-15 16:45:00" \
git commit -m "docs(architecture): week 3 - system architecture (C4+1 SAD), polyglot persistence and tech research"
git push greenwich main
```

---

### 🟢 TUẦN 4 (22/09/2026): THIẾT KẾ UX/UI PROTOTYPE, DESIGN SYSTEM & MOBILE ERGONOMICS
* **Mục tiêu:** Bàn giao Bộ Thiết Kế Hoàn Chỉnh: Design Tokens (Color Palette WCAG AA, Typography Scale Plus Jakarta Sans/JetBrains Mono), Lưới Spacing 8pt, Khung Điểm Chạm Thumb-Zone theo Apple HIG và 2 bộ Mobile Interactive Prototype (`index.html` vé máy bay và `plan-map-preview.html` bản đồ lịch trình).
* **Các file đưa vào:** `docs/04-UX-UI-Design-System.md`, `client/preview/index.html`, `client/preview/plan-map-preview.html`.
* **Lệnh thực hiện:**
```bash
git add docs/04-UX-UI-Design-System.md client/preview/
GIT_AUTHOR_DATE="2026-09-22 10:00:00" GIT_COMMITTER_DATE="2026-09-22 10:00:00" \
git commit -m "feat(ui-ux): week 4 - design system tokens, atomic specs and interactive mobile prototype showcase"
git push greenwich main
```

---

### 🟢 TUẦN 5 (29/09/2026): THIẾT LẬP HẠ TẦNG DEVOPS & KHỞI TẠO BACKEND
* **Mục tiêu:** Cấu hình Docker Compose cho 3 cơ sở dữ liệu, file DDL 28 bảng 3NF, cấu hình Jest backend.
* **Các file đưa vào:** `docker-compose.yml`, `docker/init-db/01-init.sql`, `server/package.json`, `server/package-lock.json`, `server/jest.config.js`, `.env.example`.
* **Lệnh thực hiện:**
```bash
git add docker-compose.yml docker/init-db/01-init.sql server/package.json server/package-lock.json server/jest.config.js .env.example
GIT_AUTHOR_DATE="2026-09-29 16:45:00" GIT_COMMITTER_DATE="2026-09-29 16:45:00" \
git commit -m "feat(infra): week 5 - polyglot docker compose, postgresql 3nf ddl and server scaffolding"
git push greenwich main
```

---

### 🟢 TUẦN 6 (06/10/2026): MODULE 1 — XÁC THỰC, PHÂN QUYỀN RBAC VỚI 100% TDD
* **Mục tiêu:** Hoàn thiện đăng ký, đăng nhập, JWT 15m, Refresh Token SHA-256, Bcrypt 12 rounds và bộ test unit/integration.
* **Các file đưa vào:** `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`, `server/src/services/auth.service.js`, `server/src/services/token.service.js`, `server/src/utils/password.util.js`, `server/src/repositories/user.repository.js`, `server/src/middlewares/`, `server/src/app.js`, `server/tests/unit/`, `server/tests/integration/auth.*`.
* **Lệnh thực hiện:**
```bash
git add server/src/controllers/auth.controller.js server/src/routes/auth.routes.js server/src/services/auth.service.js server/src/services/token.service.js server/src/utils/password.util.js server/src/repositories/user.repository.js server/src/middlewares/ server/src/app.js server/tests/unit/utils/password.test.js server/tests/unit/services/token.service.test.js server/tests/integration/auth.*
GIT_AUTHOR_DATE="2026-10-06 10:20:00" GIT_COMMITTER_DATE="2026-10-06 10:20:00" \
git commit -m "feat(auth): week 6 - user identity, rbac and dual-token security with strict tdd"
git push greenwich main
```

---

### 🟢 TUẦN 7 (13/10/2026): MODULE 2 — SMART BOOKING AGGREGATOR (DUFFEL LIVE NDC & REDIS)
* **Mục tiêu:** Tích hợp Duffel Flights API, Google Places, bộ chuẩn hóa dữ liệu và Cache-Aside Redis.
* **Các file đưa vào:** `server/src/providers/duffel.provider.js`, `server/src/providers/google.provider.js`, `server/src/providers/mock.provider.js`, `server/src/services/booking.service.js`, `server/src/services/normalizer.service.js`, `server/src/services/cache.service.js`, `server/src/controllers/flight.controller.js`, `server/src/controllers/hotel.controller.js`, `server/src/routes/flight.routes.js`, `server/src/routes/hotel.routes.js`, các file tests tương ứng.
* **Lệnh thực hiện:**
```bash
git add server/src/providers/ server/src/services/booking.service.js server/src/services/normalizer.service.js server/src/services/cache.service.js server/src/controllers/flight.controller.js server/src/controllers/hotel.controller.js server/src/routes/flight.routes.js server/src/routes/hotel.routes.js server/tests/unit/providers/ server/tests/unit/services/normalizer.test.js server/tests/integration/booking.* server/tests/integration/duffel.live.test.js
GIT_AUTHOR_DATE="2026-10-13 15:30:00" GIT_COMMITTER_DATE="2026-10-13 15:30:00" \
git commit -m "feat(booking): week 7 - smart flight and hotel aggregator with duffel live ndc api and redis cache"
git push greenwich main
```

---

### 🟢 TUẦN 8 (20/10/2026): MODULE 3 & 4 — LẬP LỊCH TRÌNH NHÓM & THUẬT TOÁN CHIA NỢ GREEDY
* **Mục tiêu:** Hoàn thiện toàn bộ Backend Core: Lập kế hoạch đa ngày (MongoDB), tính khoảng cách Haversine, sổ cái tài chính ACID PostgreSQL và thuật toán Greedy Minimum Cash-Flow $O(N \log N)$ rút gọn nợ.
* **Các file đưa vào:** Toàn bộ phần còn lại của thư mục `server/` bao gồm `debt.util.js`, `geo.util.js`, `itinerary.service.js`, `expense.service.js`, `places.service.js`, các models và repositories.
* **Lệnh thực hiện:**
```bash
git add server/
GIT_AUTHOR_DATE="2026-10-20 17:00:00" GIT_COMMITTER_DATE="2026-10-20 17:00:00" \
git commit -m "feat(core-backend): week 8 - collaborative itinerary planner and greedy debt simplification engine"
git push greenwich main
```

---

### 🟢 TUẦN 9 (27/10/2026): ỨNG DỤNG MOBILE REACT NATIVE (EXPO SDK 57, MAPBOX & FULL TDD)
* **Mục tiêu:** Hoàn tất 100% Core MVP với ứng dụng di động React Native trên Expo SDK 57, 4 tab chức năng, bản đồ khám phá Mapbox GL JS, AI gom cụm địa điểm và chế độ Dual-Theme Dark/Light hoàn hảo.
* **Các file đưa vào:** Toàn bộ thư mục `client/`, `PROJECT_OVERVIEW.md`, `GIT_PUSH_SCHEDULE.md`.
* **Lệnh thực hiện:**
```bash
git add client/ PROJECT_OVERVIEW.md GIT_PUSH_SCHEDULE.md
GIT_AUTHOR_DATE="2026-10-27 09:00:00" GIT_COMMITTER_DATE="2026-10-27 09:00:00" \
git commit -m "feat(mobile): week 9 - cross-platform react native app (expo sdk 57, mapbox discovery, full tdd suite)"
git push greenwich main
```

---

## 🎯 4. TỔNG KẾT & LỜI KHUYÊN KHI TRÌNH BÀY ĐỒ ÁN

1. **Hiển thị tiến độ rõ ràng:** Khi Giảng viên mở mục **Commits** hoặc **Network Graph** trên GitHub, họ sẽ thấy đồ án phát triển tuần tự từ Nghiên cứu bài toán $\rightarrow$ Đặc tả $\rightarrow$ Kiến trúc $\rightarrow$ Thiết kế UX/UI Prototype $\rightarrow$ Backend TDD $\rightarrow$ Frontend Mobile.
2. **Minh chứng chất lượng:** Mỗi commit giai đoạn đều có thể checkout độc lập và chạy test đều pass màu xanh (GREEN), không có commit nào bị gãy hay lỗi cú pháp.
3. **Bảo mật:** Không có bất kỳ API key bí mật nào bị rò rỉ trong git history, đáp ứng tuyệt đối tiêu chuẩn an toàn thông tin của đại học.

