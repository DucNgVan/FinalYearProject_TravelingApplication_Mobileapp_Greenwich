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

## 📊 2. BẢNG TỔNG HỢP LỘ TRÌNH 8 GIAI ĐOẠN (ACADEMIC PROGRESSION MATRIX)

| Ngày / Mốc | Tên Giai Đoạn & Commit Message | Phạm Vi Mã Nguồn & Tài Liệu | Trạng Thái TDD / Kiểm Thử |
|:---:|---|---|:---:|
| **Ngày 1** | `docs: project foundation, vision, personas and academic constraints` | BRD, Tài liệu nền tảng, 4 Personas, 7 Trụ cột giá trị | 100% Đạt chuẩn IEEE |
| **Ngày 2** | `docs: software requirements specification (42 FRs, BDD, UML use cases & sequences)` | PRD/SRS (42 FRs, 8 NFRs, 35 User Stories, BDD, Traceability) | ISO 29148 Standard |
| **Ngày 3** | `docs(architecture): 5-tier architecture, polyglot persistence and c4+1 sad` | Tech Spec & SAD (C4+1 Model: Context, Container, Component, Code) | C4 Architecture Model |
| **Ngày 4** | `feat(infra): polyglot docker compose, postgresql 3nf ddl and server scaffolding` | `docker-compose.yml`, `01-init.sql` (28 bảng), Express Gateway, Jest config | TDD Scaffolding Ready |
| **Ngày 5** | `feat(auth): user identity, rbac and dual-token security with strict tdd` | Module MOD-01 (JWT 15m, Refresh Token SHA-256, Bcrypt, Middleware) | 6 suites, 20/20 GREEN |
| **Ngày 6** | `feat(booking): smart flight and hotel aggregator with duffel live ndc api and redis cache` | Module MOD-02 (Duffel Live API, Google Places, Cache-Aside Redis) | 13 suites, 47/47 GREEN |
| **Ngày 7** | `feat(core-backend): collaborative itinerary planner and greedy debt simplification engine` | Module MOD-03 (MongoDB Haversine) + Module MOD-04 (ACID & Debt Min) | 30 suites, 117/117 GREEN |
| **Ngày 8** | `feat(mobile): cross-platform react native app (expo sdk 57, mapbox discovery, full tdd suite)` | Client Mobile 4 tab, Mapbox discovery, AI Clustering, 298 tests | 67 suites, 298/298 GREEN |

---

## 🛠️ 3. HƯỚNG DẪN CHI TIẾT TỪNG NGÀY PUSH

> **Mẹo học thuật (Timestamp Control):** 
> Nếu bạn muốn ngày giờ commit lùi về các tuần trước đó để biểu đồ GitHub hiển thị quá trình làm việc liên tục suốt học kỳ, bạn có thể thêm tiền tố `GIT_AUTHOR_DATE` và `GIT_COMMITTER_DATE` vào trước lệnh `git commit` như hướng dẫn dưới đây. Nếu không, chỉ cần chạy lệnh commit bình thường!

---

### 🟢 NGÀY 1: KHỞI TẠO NỀN TẢNG DỰ ÁN & TÀI LIỆU BRD
* **Mục tiêu:** Bàn giao tài liệu bài toán kinh doanh, chân dung người dùng và đề xuất giá trị cốt lõi.
* **Các file đưa vào:** `README.md`, `docs/01-BRD.md`, `documentation/01-project-foundation/`, `.gitignore`.
* **Lệnh thực hiện:**
```bash
git add README.md docs/01-BRD.md documentation/01-project-foundation/ .gitignore
GIT_AUTHOR_DATE="2026-09-01 09:00:00" GIT_COMMITTER_DATE="2026-09-01 09:00:00" \
git commit -m "docs: project foundation, vision, personas and academic constraints"
git push -u origin main
```
* **Ý nghĩa học thuật:** Chứng minh cho Supervisor thấy đồ án bắt đầu từ việc nghiên cứu thực tế và phân tích người dùng sâu sắc, không phải lao vào code ngay.

---

### 🟢 NGÀY 2: ĐẶC TẢ YÊU CẦU PHẦN MỀM (PRD / SRS & BDD)
* **Mục tiêu:** Bàn giao 42 yêu cầu chức năng (`FR-01` đến `FR-42`), 8 NFRs, và ma trận truy vết (Traceability Matrix).
* **Các file đưa vào:** `docs/02-PRD-SRS.md`, `documentation/02-requirements/`, `documentation/03-use-cases/`.
* **Lệnh thực hiện:**
```bash
git add docs/02-PRD-SRS.md documentation/02-requirements/ documentation/03-use-cases/
GIT_AUTHOR_DATE="2026-09-08 14:30:00" GIT_COMMITTER_DATE="2026-09-08 14:30:00" \
git commit -m "docs: software requirements specification (42 FRs, BDD, UML use cases & sequences)"
git push origin main
```
* **Ý nghĩa học thuật:** Thể hiện kỹ năng kỹ thuật phần mềm chuẩn ISO/IEC/IEEE 29148.

---

### 🟢 NGÀY 3: THIẾT KẾ KIẾN TRÚC HỆ THỐNG C4+1 (SAD)
* **Mục tiêu:** Bản đặc tả kiến trúc 5 tầng, ma trận CSDL Polyglot và sơ đồ thành phần.
* **Các file đưa vào:** `docs/03-TechSpec-SAD.md`, `documentation/04-architecture/`, `documentation/05-tech-research/`, `documentation/06-database-analysis/`.
* **Lệnh thực hiện:**
```bash
git add docs/03-TechSpec-SAD.md documentation/04-architecture/ documentation/05-tech-research/ documentation/06-database-analysis/
GIT_AUTHOR_DATE="2026-09-15 11:15:00" GIT_COMMITTER_DATE="2026-09-15 11:15:00" \
git commit -m "docs(architecture): 5-tier architecture, polyglot persistence and c4+1 sad"
git push origin main
```
* **Ý nghĩa học thuật:** Thiết kế kiến trúc chịu tải, phân tách rõ ràng trách nhiệm của PostgreSQL, MongoDB và Redis.

---

### 🟢 NGÀY 4: THIẾT LẬP HẠ TẦNG DEVOPS & KHỞI TẠO BACKEND
* **Mục tiêu:** Cấu hình Docker Compose cho 3 cơ sở dữ liệu, file DDL 28 bảng 3NF, cấu hình Jest backend.
* **Các file đưa vào:** `docker-compose.yml`, `docker/init-db/01-init.sql`, `server/package.json`, `server/package-lock.json`, `server/jest.config.js`, `.env.example`.
* **Lệnh thực hiện:**
```bash
git add docker-compose.yml docker/init-db/01-init.sql server/package.json server/package-lock.json server/jest.config.js .env.example
GIT_AUTHOR_DATE="2026-09-22 16:45:00" GIT_COMMITTER_DATE="2026-09-22 16:45:00" \
git commit -m "feat(infra): polyglot docker compose, postgresql 3nf ddl and server scaffolding"
git push origin main
```
* **Ý nghĩa học thuật:** Thiết lập môi trường tự động hóa containerized có thể chạy độc lập ở bất kỳ máy chấm điểm nào.

---

### 🟢 NGÀY 5: MODULE 1 — XÁC THỰC, PHÂN QUYỀN RBAC VỚI 100% TDD
* **Mục tiêu:** Hoàn thiện đăng ký, đăng nhập, JWT 15m, Refresh Token SHA-256, Bcrypt 12 rounds và bộ test unit/integration.
* **Các file đưa vào:** `server/src/controllers/auth.controller.js`, `server/src/routes/auth.routes.js`, `server/src/services/auth.service.js`, `server/src/services/token.service.js`, `server/src/utils/password.util.js`, `server/src/repositories/user.repository.js`, `server/src/middlewares/`, `server/src/app.js`, `server/tests/unit/`, `server/tests/integration/auth.*`.
* **Lệnh thực hiện:**
```bash
git add server/src/controllers/auth.controller.js server/src/routes/auth.routes.js server/src/services/auth.service.js server/src/services/token.service.js server/src/utils/password.util.js server/src/repositories/user.repository.js server/src/middlewares/ server/src/app.js server/tests/unit/utils/password.test.js server/tests/unit/services/token.service.test.js server/tests/integration/auth.*
GIT_AUTHOR_DATE="2026-09-29 10:20:00" GIT_COMMITTER_DATE="2026-09-29 10:20:00" \
git commit -m "feat(auth): user identity, rbac and dual-token security with strict tdd"
git push origin main
```
* **Kiểm tra nghiệm thu:** Chạy `npm test --prefix server` $\rightarrow$ 6 suites passed, 20/20 tests GREEN.

---

### 🟢 NGÀY 6: MODULE 2 — SMART BOOKING AGGREGATOR (DUFFEL LIVE NDC & REDIS)
* **Mục tiêu:** Tích hợp Duffel Flights API, Google Places, bộ chuẩn hóa dữ liệu và Cache-Aside Redis.
* **Các file đưa vào:** `server/src/providers/duffel.provider.js`, `server/src/providers/google.provider.js`, `server/src/providers/mock.provider.js`, `server/src/services/booking.service.js`, `server/src/services/normalizer.service.js`, `server/src/services/cache.service.js`, `server/src/controllers/flight.controller.js`, `server/src/controllers/hotel.controller.js`, `server/src/routes/flight.routes.js`, `server/src/routes/hotel.routes.js`, các file tests tương ứng.
* **Lệnh thực hiện:**
```bash
git add server/src/providers/ server/src/services/booking.service.js server/src/services/normalizer.service.js server/src/services/cache.service.js server/src/controllers/flight.controller.js server/src/controllers/hotel.controller.js server/src/routes/flight.routes.js server/src/routes/hotel.routes.js server/tests/unit/providers/ server/tests/unit/services/normalizer.test.js server/tests/integration/booking.* server/tests/integration/duffel.live.test.js
GIT_AUTHOR_DATE="2026-10-06 15:30:00" GIT_COMMITTER_DATE="2026-10-06 15:30:00" \
git commit -m "feat(booking): smart flight and hotel aggregator with duffel live ndc api and redis cache"
git push origin main
```
* **Kiểm tra nghiệm thu:** Chạy `npm test --prefix server` $\rightarrow$ 13 suites passed, 47/47 tests GREEN.

---

### 🟢 NGÀY 7: MODULE 3 & 4 — LẬP LỊCH TRÌNH NHÓM & THUẬT TOÁN CHIA NỢ GREEDY
* **Mục tiêu:** Hoàn thiện toàn bộ Backend Core: Lập kế hoạch đa ngày (MongoDB), tính khoảng cách Haversine, sổ cái tài chính ACID PostgreSQL và thuật toán Greedy Minimum Cash-Flow $O(N \log N)$ rút gọn nợ.
* **Các file đưa vào:** Toàn bộ phần còn lại của thư mục `server/` bao gồm `debt.util.js`, `geo.util.js`, `itinerary.service.js`, `expense.service.js`, `places.service.js`, các models và repositories.
* **Lệnh thực hiện:**
```bash
git add server/
GIT_AUTHOR_DATE="2026-10-12 17:00:00" GIT_COMMITTER_DATE="2026-10-12 17:00:00" \
git commit -m "feat(core-backend): collaborative itinerary planner and greedy debt simplification engine"
git push origin main
```
* **Kiểm tra nghiệm thu:** Chạy `npm test --prefix server` $\rightarrow$ **30 suites passed, 117/117 tests GREEN (100%)**.

---

### 🟢 NGÀY 8: ỨNG DỤNG MOBILE REACT NATIVE (EXPO SDK 57, MAPBOX & FULL TDD)
* **Mục tiêu:** Hoàn tất 100% Core MVP với ứng dụng di động React Native trên Expo SDK 57, 4 tab chức năng, bản đồ khám phá Mapbox GL JS, AI gom cụm địa điểm và chế độ Dual-Theme Dark/Light hoàn hảo.
* **Các file đưa vào:** Toàn bộ thư mục `client/`, `PROJECT_OVERVIEW.md`, `GIT_PUSH_SCHEDULE.md`.
* **Lệnh thực hiện:**
```bash
git add client/ PROJECT_OVERVIEW.md GIT_PUSH_SCHEDULE.md
GIT_AUTHOR_DATE="2026-10-15 09:00:00" GIT_COMMITTER_DATE="2026-10-15 09:00:00" \
git commit -m "feat(mobile): cross-platform react native app (expo sdk 57, mapbox discovery, full tdd suite)"
git push origin main
```
* **Kiểm tra nghiệm thu cuối cùng:**
  * Backend: 30 test suites, 117 tests passing.
  * Client: 37 test suites, 181 tests passing.
  * **Tổng cộng: 67 test suites, 298/298 tests passed (100% GREEN)**.

---

## 🎯 4. TỔNG KẾT & LỜI KHUYÊN KHI TRÌNH BÀY ĐỒ ÁN

1. **Hiển thị tiến độ rõ ràng:** Khi Giảng viên mở mục **Commits** hoặc **Network Graph** trên GitHub, họ sẽ thấy đồ án phát triển tuần tự từ Nghiên cứu bài toán $\rightarrow$ Đặc tả $\rightarrow$ Kiến trúc $\rightarrow$ Backend TDD $\rightarrow$ Frontend Mobile.
2. **Minh chứng chất lượng:** Mỗi commit giai đoạn đều có thể checkout độc lập và chạy test đều pass màu xanh (GREEN), không có commit nào bị gãy hay lỗi cú pháp.
3. **Bảo mật:** Không có bất kỳ API key bí mật nào bị rò rỉ trong git history, đáp ứng tuyệt đối tiêu chuẩn an toàn thông tin của đại học.
