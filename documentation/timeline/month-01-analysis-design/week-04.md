# WEEK 04 — PROJECT SETUP & MONTH 1 DEFINITION OF DONE

## Tháng 1: Analysis & System Design
**Milestone:** `W4 - Project Setup` & `M1 - Analysis & Design`  
**Thời gian:** Ngày 22 – Ngày 28 (14/09/2026 – 20/09/2026)  
**Nhánh chính:** `chore/project-setup` (tách từ `develop`)  
**Mục tiêu tuần:** Chuyển đổi từ giai đoạn thiết kế (Planning) sang thiết lập khung sườn mã nguồn thực tế (Project Skeleton) cho cả Mobile Client và Backend API, kết nối cơ sở dữ liệu và hoàn tất Milestone Tháng 1.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 22: REPOSITORY STRUCTURE & CODE CONVENTIONS (14/09/2026)
* **Mục tiêu:** Thiết lập cấu trúc thư mục dự án chuẩn mực, cấu hình linting, formatting và quy ước commit tự động.
* **Nhiệm vụ cụ thể:**
  1. Tổ chức cấu trúc thư mục tổng:
     ```text
     NOMADIX/
     ├── client/         (React Native Mobile Application)
     ├── server/         (Node.js + Express.js Backend API)
     ├── documentation/  (System Docs, Specifications, Thesis Drafts)
     └── .github/        (Workflows, Issue Templates, PR Templates)
     ```
  2. Cấu hình ESLint & Prettier dùng chung để chuẩn hóa phong cách code JavaScript.
  3. Cài đặt Husky + Commitlint để tự động kiểm tra định dạng commit (`feat:`, `fix:`, `docs:`, `chore:`).
  4. Tạo file `.gitignore` loại trừ `node_modules`, `.env`, build artifacts (`android/app/build`, `ios/Pods`).
* **Sản phẩm đầu ra:**
  * Khung thư mục và các file cấu hình `.eslintrc.js`, `.prettierrc`, `.commitlintrc.json`.
* **Git Commit:** `chore: initialize repository structure and code quality tools`
* **DoD:** Commit thử sai định dạng bị chặn; chạy `npm run lint` hoạt động tốt.

---

### 🔹 DAY 23: BACKEND EXPRESS.JS SKELETON SETUP (15/09/2026)
* **Mục tiêu:** Khởi tạo dự án Node.js Backend với kiến trúc phân tầng (Clean Layered Architecture) và các middleware nền tảng.
* **Nhiệm vụ cụ thể:**
  1. Khởi tạo `server/package.json` với các thư viện: `express`, `dotenv`, `cors`, `helmet`, `morgan`, `winston`, `nodemon`.
  2. Xây dựng cấu trúc thư mục tầng nghiệp vụ bên trong `server/src/`:
     ```text
     server/src/
     ├── config/       (Database, Redis, Cloudinary config)
     ├── controllers/  (HTTP Request/Response handling)
     ├── services/     (Core Business Logic)
     ├── models/       (PostgreSQL schemas & MongoDB models)
     ├── routes/       (API Route definitions)
     ├── middleware/   (Auth, Error handler, Rate limit)
     ├── utils/        (Logger, Helper functions, Constants)
     ├── adapters/     (OTA API Adapters & Mock Provider)
     └── app.js / server.js
     ```
  3. Cấu hình Health Check endpoint: `GET /api/v1/health` (trả về status 200 OK, timestamp, uptime).
* **Sản phẩm đầu ra:**
  * Mã nguồn khung backend chạy được lệnh `npm run dev` trên cổng `http://localhost:5000`.
* **Git Commit:** `feat(server): scaffold express.js layered architecture and health check`
* **DoD:** Gọi `curl http://localhost:5000/api/v1/health` trả về JSON `{"status": "UP"}`.

---

### 🔹 DAY 24: DATABASE & REDIS CONNECTION DRIVERS (16/09/2026)
* **Mục tiêu:** Cấu hình kết nối thực tế tới PostgreSQL, MongoDB và Redis với cơ chế tự động kết nối lại (Auto-reconnect) và log lỗi chi tiết.
* **Nhiệm vụ cụ thể:**
  1. Cấu hình kết nối **PostgreSQL**:
     * Sử dụng thư viện `pg` (Connection Pool) hoặc ORM (`Prisma` / `Sequelize`).
     * Viết file kiểm tra kết nối `server/src/config/postgres.js`.
  2. Cấu hình kết nối **MongoDB**:
     * Sử dụng thư viện `mongoose`.
     * Viết file kiểm tra kết nối `server/src/config/mongo.js` kết nối tới MongoDB Atlas.
  3. Cấu hình kết nối **Redis**:
     * Sử dụng thư viện `ioredis`.
     * Viết file kết nối `server/src/config/redis.js` kèm xử lý sự kiện `connect`, `error`, `ready`.
  4. Tích hợp trạng thái DB vào endpoint `GET /api/v1/health` (kiểm tra Postgres: OK, Mongo: OK, Redis: OK).
* **Sản phẩm đầu ra:**
  * `server/src/config/` hoàn chỉnh.
  * File `.env.example` với đầy đủ mẫu biến môi trường kết nối.
* **Git Commit:** `feat(server): establish postgresql, mongodb, and redis connection pool`
* **DoD:** Server khởi động in log xanh kết nối thành công tới cả 3 hệ thống cơ sở dữ liệu.

---

### 🔹 DAY 25: REACT NATIVE MOBILE SKELETON SETUP (17/09/2026)
* **Mục tiêu:** Khởi tạo dự án Mobile React Native, cấu hình Navigation điều hướng và cài đặt Theme cơ bản theo bản thiết kế Figma.
* **Nhiệm vụ cụ thể:**
  1. Khởi tạo dự án `client/` (React Native CLI).
  2. Cài đặt các thư viện điều hướng:
     * `@react-navigation/native`, `@react-navigation/stack`, `@react-navigation/bottom-tabs`, `react-native-screens`, `react-native-safe-area-context`.
  3. Xây dựng cấu trúc cây thư mục mobile:
     ```text
     client/src/
     ├── assets/      (Images, Icons, Fonts)
     ├── components/  (Reusable Buttons, Inputs, Cards)
     ├── navigation/  (AppNavigator, AuthStack, MainTabNavigator)
     ├── screens/     (Auth, Home, Booking, Itinerary, Gamify, Community, Profile)
     ├── services/    (Axios API Client, Storage, Location)
     ├── context/     (AuthContext, ThemeContext)
     ├── constants/   (Colors, Typography, Layout)
     └── utils/
     ```
  4. Dựng thanh Bottom Tab Navigation với 5 tabs chính: *Home*, *Booking*, *Itinerary*, *Explore (Gamify)*, *Community*, *Profile*.
* **Sản phẩm đầu ra:**
  * Ứng dụng chạy mượt mà trên iOS Simulator / Android Emulator.
* **Git Commit:** `feat(client): initialize react native app and bottom tab navigation`
* **DoD:** Ứng dụng build thành công và có thể chuyển đổi qua lại giữa các tab màn hình rỗng.

---

### 🔹 DAY 26: HARDWARE & 3RD-PARTY SDK CONFIGURATION (18/09/2026)
* **Mục tiêu:** Cài đặt và cấu hình cấp quyền phần cứng (GPS, Camera, Storage) và tích hợp Google Maps SDK trên ứng dụng di động.
* **Nhiệm vụ cụ thể:**
  1. Cấu hình **Google Maps**:
     * Cài đặt `react-native-maps`.
     * Thêm Google Maps API Key vào `AndroidManifest.xml` và `AppDelegate.mm`.
     * Tạo màn hình test hiển thị bản đồ Google Maps tương tác.
  2. Cấu hình **GPS Geolocation**:
     * Cài đặt `react-native-geolocation-service`.
     * Thêm quyền `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` trên Android & `NSLocationWhenInUseUsageDescription` trên iOS.
  3. Cấu hình **Camera & Image Picker**:
     * Cài đặt `react-native-image-picker` / `react-native-vision-camera`.
     * Thêm quyền `CAMERA` và `READ_EXTERNAL_STORAGE`.
* **Sản phẩm đầu ra:**
  * Ứng dụng di động có khả năng xin quyền vị trí, mở camera và hiển thị bản đồ mà không bị crash.
* **Git Commit:** `feat(client): integrate google maps, geolocation, and camera permissions`
* **DoD:** Chạy thử trên máy thật hoặc emulator xin quyền Location và render được bản đồ.

---

### 🔹 DAY 27: CI/CD PIPELINE SETUP (GITHUB ACTIONS) (19/09/2026)
* **Mục tiêu:** Xây dựng quy trình tích hợp liên tục (CI) tự động kiểm tra cú pháp và chạy test khi tạo Pull Request vào `develop`.
* **Nhiệm vụ cụ thể:**
  1. Tạo file `.github/workflows/ci.yml`.
  2. Cấu hình Job 1: `server-ci` (Cài đặt dependencies, chạy ESLint, chạy Unit Tests).
  3. Cấu hình Job 2: `client-ci` (Cài đặt dependencies, chạy ESLint, kiểm tra cú pháp React Native).
  4. Thiết lập quy tắc Branch Protection trên GitHub (Bắt buộc CI pass mới cho Merge vào `develop`).
* **Sản phẩm đầu ra:**
  * File `.github/workflows/ci.yml` hoạt động tự động.
* **Git Commit:** `ci: configure automated github actions workflow for client and server`
* **DoD:** Đẩy commit lên GitHub thấy biểu tượng tích xanh (Green Checkmark) của GitHub Actions.

---

### 🔹 DAY 28: MONTH 1 GRAND REVIEW & DEFINITION OF DONE (20/09/2026)
* **Mục tiêu:** Tổng kết toàn bộ Tháng 1, đối chiếu với Month 1 Definition of Done, nghiệm thu toàn bộ tài liệu và khung mã nguồn.
* **Nhiệm vụ cụ thể:**
  1. Kiểm tra bảng kiểm tra **Month 1 Definition of Done**:
     - [x] Requirements & SRS đầy đủ (FR, NFR, Traceability).
     - [x] Sơ đồ Use Case & Use Case Specifications 6 module.
     - [x] Bộ giao diện Figma High-Fidelity & Prototype hoàn chỉnh.
     - [x] Lược đồ PostgreSQL ERD & MongoDB Schemas chuẩn hóa.
     - [x] Đặc tả API OpenAPI/Swagger & Postman Collection.
     - [x] Khảo sát công nghệ & Chiến lược Caching Redis.
     - [x] Khung dự án React Native + Node.js Express kết nối được DB & Maps.
     - [x] GitHub CI/CD Actions hoạt động ổn định.
  2. Viết tài liệu tổng kết tháng: `documentation/timeline/month-01-analysis-design/month-01-summary.md`.
  3. Đóng Milestone `M1 - Analysis & Design` trên GitHub.
  4. Chuẩn bị Slide báo cáo kết thúc Tháng 1 cho Giảng viên hướng dẫn.
* **Sản phẩm đầu ra:**
  * Báo cáo tổng kết Tháng 1; Hệ thống sẵn sàng 100% bước vào Tháng 2 (Development).
* **Git Commit:** `docs: finalize month 1 milestone and close M1 - Analysis & Design`
* **DoD:** Milestone M1 đạt 100% hoàn thành; sẵn sàng code tính năng Backend ở Month 2.
