# 🎓 SỔ TAY BẢO VỆ ĐỒ ÁN TỐT NGHIỆP: GIẢI TRÌNH KIẾN TRÚC & MÃ NGUỒN CHI TIẾT
## NOMADIX — Collaborative Squad Travel & Smart Financial Settlement Platform
**Đại học:** University of Greenwich (BSc Computing FYP)  
**Sinh viên thực hiện:** Nguyễn Văn Đức (DucNgVan)  
**Email GitHub:** `ducnva.wk@gmail.com`  
**Giai đoạn:** Hoàn thiện Core MVP & Hệ thống Kiểm thử TDD (22/09/2026 – 18/10/2026)  
**Mục tiêu tài liệu:** Cung cấp bản giải trình kỹ thuật chi tiết nhất từng tệp tin (File), từng hàm (Function), vai trò kiến trúc và ngân hàng câu hỏi phản biện bảo vệ trước Hội đồng chấm thi.

---

# MỤC LỤC
1. [TỔNG QUAN KIẾN TRÚC HỆ THỐNG & TRIẾT LÝ THIẾT KẾ](#1-tổng-quan-kiến-trúc-hệ-thống--triết-lý-thiết-kế)
2. [HẠ TẦNG CSDL POLYGLOT & DEVOPS](#2-hạ-tầng-csdl-polyglot--devops)
3. [CHI TIẾT MÃ NGUỒN BACKEND SERVER (NODE.JS & EXPRESS)](#3-chi-tiết-mã-nguồn-backend-server-nodejs--express)
   - [3.1 Tầng Cấu Hình & Khởi Động (`server/`)](#31-tầng-cấu-hình--khởi-động-server)
   - [3.2 Tầng Trung Gian Bảo Mật & Xác Thực (`middlewares/`)](#32-tầng-trung-gian-bảo-mật--xác-thực-middlewares)
   - [3.3 Tầng Tiện Ích & Thuật Toán Cốt Lõi (`utils/`)](#33-tầng-tiện-ích--thuật-toán-cốt-lõi-utils)
   - [3.4 Tầng Tích Hợp Dịch Vụ Ngoài (`providers/`)](#34-tầng-tích-hợp-dịch-vụ-ngoài-providers)
   - [3.5 Tầng Truy Xuất Dữ Liệu (`repositories/` & `models/`)](#35-tầng-truy-xuất-dữ-liệu-repositories--models)
   - [3.6 Tầng Nghiệp Vụ Chuyên Sâu (`services/`)](#36-tầng-nghiệp-vụ-chuyên-sâu-services)
   - [3.7 Tầng Điều Hướng & Kiểm Soát API (`controllers/` & `routes/`)](#37-tầng-điều-hướng--kiểm-soát-api-controllers--routes)
4. [CHI TIẾT MÃ NGUỒN FRONTEND MOBILE (REACT NATIVE & EXPO SDK 57)](#4-chi-tiết-mã-nguồn-frontend-mobile-react-native--expo-sdk-57)
   - [4.1 Tầng Kết Nối Mạng & Design System (`api/` & `theme/`)](#41-tầng-kết-nối-mạng--design-system-api--theme)
   - [4.2 Tầng Quản Lý Trạng Thái Tập Trung (`stores/`)](#42-tầng-quản-lý-trạng-thái-tập-trung-stores)
   - [4.3 Tầng Thành Phần Giao Diện Nguyên Tử (`components/common/`)](#43-tầng-thành-phần-giao-diện-nguyên-tử-componentscommon)
   - [4.4 Tầng Thành Phần Nghiệp Vụ Booking (`components/booking/`)](#44-tầng-thành-phần-nghiệp-vụ-booking-componentsbooking)
   - [4.5 Tầng Thành Phần Bản Đồ & Kế Hoạch (`components/plan/`)](#45-tầng-thành-phần-bản-đồ--kế-hoạch-componentsplan)
   - [4.6 Tầng Màn Hình Ứng Dụng Chính (`screens/`)](#46-tầng-màn-hình-ứng-dụng-chính-screens)
   - [4.7 Điểm Đầu Vào Gốc Của Ứng Dụng (`App.js` & `index.js`)](#47-điểm-đầu-vào-gốc-của-ứng-dụng-appjs--indexjs)
5. [BỘ NGUYÊN MẪU TRẢI NGHIỆM TRÊN WEB (`client/preview/`)](#5-bộ-nguyên-mẫu-trải-nghiệm-trên-web-clientpreview)
6. [HỆ THỐNG KIỂM THỬ TỰ ĐỘNG & CI/CD PIPELINE](#6-hệ-thống-kiểm-thử-tự-động--cicd-pipeline)
7. [NGÂN HÀNG CÂU HỎI VÀ ĐÁP ÁN BẢO VỆ ĐỒ ÁN (DEFENSE Q&A CHEAT SHEET)](#7-ngân-hàng-câu-hỏi-và-đáp-án-bảo-vệ-đồ-án-defense-qa-cheat-sheet)

---

# 1. TỔNG QUAN KIẾN TRÚC HỆ THỐNG & TRIẾT LÝ THIẾT KẾ

### 1.1 Mô hình Kiến trúc 5 Tầng (5-Tier Modular Monolith)
Hệ thống được thiết kế theo mô hình **Modular Monolith sẵn sàng tách Microservices**, giao tiếp giữa Mobile App và Backend thông qua giao thức chuẩn hóa **RESTful JSON API**:
* **Tier 1 (Client Presentation):** Ứng dụng di động React Native trên nền **Expo SDK 57**, sử dụng Zustand quản lý trạng thái phản ứng (reactive state), Mapbox GL bản đồ vector tương tác.
* **Tier 2 (Security Gateway & Middlewares):** Cổng bảo vệ Express.js tích hợp Helmet (bảo mật HTTP headers), CORS, Zod & Joi DTO validation, Bearer JWT Auth guard.
* **Tier 3 (Core Domain Services):** Tầng logic cốt lõi thực thi các thuật toán tối ưu hóa (Haversine WGS84, Greedy Minimum Cash-Flow Reduction $O(N \log N)$, Data Normalizer, Cross-DB Consistency Guard).
* **Tier 4 (Adapter & Integration Layer):** Tích hợp dịch vụ thời gian thực từ bên thứ ba (Live Duffel NDC Flights API, Google Places New API, Cloudinary Storage).
* **Tier 5 (Polyglot Persistence Layer):** CSDL đa mô hình kết hợp 3 động cơ chuyên biệt: PostgreSQL 16 (Relational/ACID), MongoDB Atlas 7.0 (Document/Polymorphic), Redis 7.0 (In-Memory Cache).

### 1.2 Ma trận phân công nhiệm vụ CSDL Polyglot (Polyglot Matrix)
| Động cơ CSDL | Phạm vi dữ liệu quản lý | Lý do kiến trúc & Ưu điểm vượt trội |
|---|---|---|
| **PostgreSQL 16** | Tài khoản, Phân quyền RBAC, Đặt chỗ vé, **Sổ cái Chi tiêu nhóm & Lịch sử trả nợ** (28 bảng chuẩn 3NF). | Đảm bảo tính toán toàn vẹn dữ liệu tài chính tuyệt đối (ACID Transactions). Kiểu dữ liệu `NUMERIC(12, 2)` loại bỏ hoàn toàn lỗi làm tròn số thực (floating-point glitch), bảo toàn định lý $\sum \text{NetBalance}_i = 0$. |
| **MongoDB Atlas 7.0** | Lịch trình chuyến đi (Itineraries), danh sách điểm dừng nhiều ngày (`days[]`, `items[]`), danh sách cộng tác viên (`collaborators[]`). | Cấu trúc dữ liệu dạng cây linh hoạt (1:Few), không cần JOIN nhiều bảng, thời gian đọc toàn bộ lịch trình chuyến đi siêu tốc $< 15\text{ms}$. |
| **Redis 7.0** | Bộ nhớ đệm tìm kiếm vé máy bay (TTL 1800s), khách sạn (TTL 3600s), địa điểm du lịch, giới hạn tần suất gọi API (Rate limiting). | Bộ nhớ RAM tốc độ cao, độ trễ truy xuất $< 50\text{ms}$, tiết kiệm chi phí gọi API bên ngoài (Duffel / Google Places). |

---

# 2. HẠ TẦNG CSDL POLYGLOT & DEVOPS

### 2.1 File: `docker-compose.yml`
* **Vị trí:** Gốc dự án `/Users/3o/Documents/Study/FYP/docker-compose.yml`
* **Chức năng:** Tự động hóa khởi tạo và điều phối 3 container CSDL chạy cô lập trong mạng nội bộ (`nomadix-net`):
  * `nomadix-postgres`: Chạy PostgreSQL 16 Alpine trên cổng `5432`, gắn volume `postgres_data` và tự động nạp file SQL khởi tạo `01-init.sql`.
  * `nomadix-mongo`: Chạy MongoDB 7.0 trên cổng `27017`, gắn volume `mongo_data`.
  * `nomadix-redis`: Chạy Redis 7.0 Alpine trên cổng `6379`, gắn volume `redis_data`.

### 2.2 File: `docker/init-db/01-init.sql`
* **Vị trí:** `docker/init-db/01-init.sql`
* **Chức năng:** Kịch bản DDL chuẩn 3NF khởi tạo toàn bộ **28 bảng quan hệ** trong PostgreSQL:
  * Nhóm tài khoản & bảo mật: `roles`, `users`, `user_roles`, `user_refresh_tokens`, `user_profiles`.
  * Nhóm đặt chỗ vé: `bookings`, `booking_passengers`, `flight_tickets`, `hotel_reservations`.
  * Nhóm tài chính & chi tiêu nhóm: `trip_members`, `trip_expenses`, `trip_expense_splits`, `trip_settlements`.
  * Nhóm địa danh & gamification: `landmarks`, `checkins`, `quizzes`, `quiz_questions`, `badges`, `user_badges`.
* **Kỹ thuật trọng tâm:** Khóa chính `UUID`, khóa ngoại `ON DELETE CASCADE`, ràng buộc tiền tệ `NUMERIC(12, 2) NOT NULL CHECK (amount > 0)`.

### 2.3 File: `server/knexfile.js`
* **Vị trí:** `server/knexfile.js`
* **Chức năng:** Cấu hình Knex Query Builder & Migration Engine cho 3 môi trường (`development`, `test`, `production`).
* **Các thuộc tính chính:**
  * `client: 'pg'`: Sử dụng driver PostgreSQL native.
  * `connection`: Kết nối động lấy từ biến môi trường (`DATABASE_URL` hoặc `PG_HOST`, `PG_PORT`, `PG_DATABASE`...).
  * `pool`: Giới hạn kết nối tối thiểu (`min: 2`) và tối đa (`max: 10`).
  * `migrations`: Thư mục lưu trữ các file versioned migration `./migrations`.

### 2.4 File: `server/src/db/migrator.js`
* **Vị trí:** `server/src/db/migrator.js`
* **Chức năng:** Module wrapper đóng gói các lệnh thực thi migration cơ sở dữ liệu:
  * `migrateLatest(knexInstance)`: Chạy tất cả các migration chưa được thực thi lên phiên bản mới nhất (`knex.migrate.latest()`).
  * `rollback(knexInstance)`: Hoàn tác lô migration gần nhất (`knex.migrate.rollback()`).
  * `status(knexInstance)`: Kiểm tra danh sách migration đã chạy và đang chờ (`knex.migrate.status()`).

### 2.5 File: `server/migrations/20261017000001_create_initial_schema.js`
* **Vị trí:** `server/migrations/20261017000001_create_initial_schema.js`
* **Chức năng:** File versioned migration chính thức quản lý vòng đời bảng bằng Knex:
  * `exports.up(knex)`: Tự động chạy tạo 28 bảng quan hệ nếu bảng chưa tồn tại (`knex.schema.createTable`).
  * `exports.down(knex)`: Tự động rollback xóa toàn bộ các bảng theo đúng thứ tự phụ thuộc khóa ngoại ngược (`DROP TABLE IF EXISTS ... CASCADE`).

---

# 3. CHI TIẾT MÃ NGUỒN BACKEND SERVER (NODE.JS & EXPRESS)

## 3.1 Tầng Cấu Hình & Khởi Động (`server/`)

### File: `server/src/app.js`
* **Chức năng:** Khởi tạo instance Express application, đăng ký các tầng middleware bảo mật và định tuyến toàn bộ API endpoints.
* **Các middleware & cấu hình đăng ký:**
  * `helmet()`: Bảo vệ các HTTP response headers an toàn.
  * `cors()`: Cấu hình Cross-Origin Resource Sharing cho phép Mobile App truy cập.
  * `express.json()`: Phân tích JSON body với giới hạn dung lượng `10mb`.
  * `GET /health`: Endpoint giám sát sức khỏe sâu (Deep Health Check) trả về trạng thái của PostgreSQL, MongoDB và Redis.
  * Router mounts: `/api/v1/auth`, `/api/v1/flights`, `/api/v1/hotels`, `/api/v1/itineraries`, `/api/v1/trips/:tripId/expenses`, `/api/v1/places`.
  * Centralized Error Handler: Bắt toàn bộ lỗi phát sinh, định dạng JSON lỗi chuẩn `{ success: false, error: { message, code } }`.

### File: `server/src/server.js`
* **Chức năng:** Điểm khởi động HTTP Server lắng nghe trên cổng `PORT` (mặc định `5001`), bind vào địa chỉ `0.0.0.0` để các thiết bị trong mạng LAN và Android Emulator kết nối thông suốt.

---

## 3.2 Tầng Trung Gian Bảo Mật & Xác Thực (`middlewares/`)

### File: `server/src/middlewares/auth.middleware.js`
* **Chức năng:** Bảo vệ các endpoint nhạy cảm (Lịch trình, Chi tiêu, Đặt vé) bằng JSON Web Token.
* **Functions:**
  * `authenticateToken(req, res, next)`: Trích xuất Bearer token từ header `Authorization: Bearer <token>`. Gọi `tokenService.verifyAccessToken(token)`. Nếu hợp lệ, gán `req.user = decoded` và cho phép đi tiếp; nếu không có hoặc hết hạn, trả về `401 Unauthorized`.
  * `requireRole(...allowedRoles)`: Middleware kiểm tra quyền (RBAC). So sánh `req.user.role` với danh sách `allowedRoles`. Nếu không đủ quyền, trả về `403 Forbidden`.

### File: `server/src/middlewares/validate.middleware.js`
* **Chức năng:** Xác thực cấu trúc dữ liệu đầu vào (Payload Validation) dựa trên thư viện **Joi**.
* **Functions & Schemas:**
  * `validate(schema, property = 'body')`: Middleware bậc cao (High-Order Function) nhận vào schema và vị trí dữ liệu cần kiểm tra (`body`, `query`, hoặc `params`). Nếu phát hiện dữ liệu sai định dạng, ngắt kết nối và trả về `400 Bad Request` kèm danh sách chi tiết lỗi.
  * `registerSchema`, `loginSchema`: Kiểm tra email RFC 5322, mật khẩu tối thiểu 6 ký tự.
  * `flightSearchSchema`: Kiểm tra mã sân bay IATA 3 ký tự viết hoa (`origin`, `destination`), đảm bảo sân bay đi và đến không trùng nhau, ngày bay không được ở quá khứ.
  * `hotelSearchSchema`: Kiểm tra tên thành phố, ngày nhận phòng (`checkInDate`), ngày trả phòng (`checkOutDate`), số lượng khách.
  * `createItinerarySchema`, `addStopSchema`: Kiểm tra cấu trúc thêm điểm dừng và tạo chuyến đi.

### File: `server/src/middlewares/zod.middleware.js`
* **Chức năng:** Middleware kiểm tra kiểu dữ liệu thời gian chạy (Runtime DTO Validation) sử dụng **Zod**, đồng bộ trực tiếp với TypeScript types.
* **Functions:**
  * `validateZod(schema)`: Đóng gói phương thức `schema.safeParse(req.body)`. Nếu không hợp lệ (`success === false`), trả về mã lỗi `400 Bad Request` với cấu trúc Nomadix Standard Error Envelope chứa mảng `error.details`.

### File: `server/src/schemas/auth.zod.js` & `server/src/schemas/expense.zod.js`
* **Chức năng:** Định nghĩa các Data Transfer Object (DTO) bằng Zod:
  * `registerDtoSchema`: `{ email: z.string().email(), password: z.string().min(6), fullName: z.string().min(2) }`.
  * `loginDtoSchema`: `{ email: z.string().email(), password: z.string().min(1) }`.
  * `createExpenseDtoSchema`: `{ title, amount, payerId, splitType, splits: [{ userId, amount }] }`.
  * `settlementDtoSchema`: `{ fromUserId, toUserId, amount, paymentMethod }`.

---

## 3.3 Tầng Tiện Ích & Thuật Toán Cốt Lõi (`utils/`)

### File: `server/src/utils/debt.util.js` (🌟 THUẬT TOÁN RÚT GỌN NỢ ĐỘ PHỨC TẠP $O(N \log N)$)
* **Chức năng:** Giải thuật rút gọn mạng lưới công nợ phức tạp trong chuyến đi nhóm. Giảm từ mạng lưới nợ $N(N-1)/2$ giao dịch chằng chịt xuống còn tối đa **$N-1$ giao dịch thanh toán trực tiếp**.
* **Functions:**
  * `calculateNetBalances(members, expenses, splits, settlements)`: Tính toán số dư ròng ($\text{NetBalance}_i$) của từng thành viên:
    $$\text{NetBalance}_i = \text{Tổng tiền đã chi hộ} - \text{Tổng phần chi phí phải chịu} + \text{Đã nhận hoàn nợ} - \text{Đã trả nợ}$$
  * `verifyZeroSum(netBalances)`: Kiểm tra định lý bảo toàn số dư (Zero-Sum Invariant). Đảm bảo tổng số dư ròng của tất cả các thành viên bằng 0 ($\sum \text{NetBalance}_i = 0$). Nếu lệch quá $0.01$ do lỗi làm tròn, tự động bù trừ vào phần tử có sai số lớn nhất.
  * `simplifyDebts(netBalances)`: Phân loại thành 2 danh sách: Con nợ (Debtors: $\text{Balance} < 0$) và Chủ nợ (Creditors: $\text{Balance} > 0$). Sử dụng cấu trúc hàng đợi ưu tiên (Priority Queue / Heap) ghép cặp người nợ nhiều nhất trả trực tiếp cho người cần thu nhiều nhất.

### File: `server/src/utils/geo.util.js` (🌟 THUẬT TOÁN ĐƯỜNG TRÒN LỚN HAVERSINE)
* **Chức năng:** Tính toán khoảng cách địa lý thực tế giữa hai tọa độ địa lý $(\text{lat}_1, \text{lng}_1)$ và $(\text{lat}_2, \text{lng}_2)$ trên mặt cầu Trái Đất (WGS84 ellipsoid).
* **Functions:**
  * `haversineDistance(lat1, lon1, lat2, lon2)`: Áp dụng công thức lượng giác Haversine với bán kính Trái Đất $R = 6,371\text{km}$:
    $$a = \sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)$$
    $$c = 2 \cdot \text{atan2}\left(\sqrt{a}, \sqrt{1-a}\right), \quad d = R \cdot c$$
    Trả về khoảng cách chính xác tính bằng km.
  * `calculateTransitDuration(distanceKm, mode = 'DRIVING')`: Ước tính thời gian di chuyển (phút) dựa trên vận tốc trung bình theo phương tiện (Ô tô: $35\text{km/h}$ nội thành, Đi bộ: $4.5\text{km/h}$).

### File: `server/src/utils/password.util.js`
* **Chức năng:** Xử lý bảo mật mật khẩu người dùng.
* **Functions:**
  * `hashPassword(plainPassword)`: Sử dụng thư viện `bcryptjs` với độ muối **12 vòng (12 salt rounds)**, ngăn chặn hoàn toàn tấn công Rainbow Table.
  * `comparePassword(plainPassword, hashedPassword)`: So sánh mật khẩu bằng thuật toán so sánh chuỗi thời gian cố định (Constant-time comparison), chống tấn công thám mã thời gian (Timing Attacks).

---

## 3.4 Tầng Tích Hợp Dịch Vụ Ngoài (`providers/`)

### File: `server/src/providers/duffel.provider.js`
* **Chức năng:** Tích hợp trực tiếp với **Duffel Live NDC Flights API** — cổng kết nối hệ thống phân phối vé máy bay toàn cầu (GDS).
* **Functions:**
  * `searchFlights(searchParams)`: Gửi HTTP POST request kèm Bearer token tới Duffel API (`https://api.duffel.com/air/offer_requests`), phân tích 87 chuyến bay thực tế.
  * `parseDuration(isoDuration)`: Phân tích định dạng thời gian ISO 8601 (ví dụ `PT2H15M`) thành chuỗi hiển thị thân thiện (`2h 15m`).
  * `normalizeOffer(offer)`: Trích xuất các trường dữ liệu quan trọng: logo hãng hàng không PNG/SVG, tên máy bay (Airbus A321, Boeing 787), chính sách hành lý ký gửi/xách tay, phát thải carbon CO2, liên kết điều kiện vé.

### File: `server/src/providers/google.provider.js`
* **Chức năng:** Kết nối với **Google Places API (New)** tìm kiếm khách sạn theo thành phố.
* **Functions:**
  * `searchHotels(city, options)`: Gửi truy vấn `places:searchText` tới Google Places API. Tự động chuyển đổi sang Mock Provider nếu chưa cấu hình `GOOGLE_PLACES_API_KEY` hoặc hết hạn ngạch.

### File: `server/src/providers/mock.provider.js`
* **Chức năng:** Danh mục dữ liệu giả lập phong phú, chuẩn xác cho các chuyến bay nội địa Việt Nam (Vietnam Airlines, VietJet Air, Bamboo Airways) và khách sạn danh tiếng (Vinpearl, Novotel, InterContinental). Phục vụ chạy kiểm thử TDD ngoại tuyến siêu tốc dưới 1 giây.

### File: `server/src/providers/places.provider.js`
* **Chức năng:** Cung cấp dữ liệu địa điểm du lịch, danh lam thắng cảnh, quán ăn tại các thành phố du lịch lớn (Đà Nẵng, Hội An, Hà Nội, Tokyo, Paris, New York).

### File: `server/src/providers/cloudinary.provider.js`
* **Chức năng:** Quản lý lưu trữ ảnh hóa đơn chi tiêu nhóm lên đám mây Cloudinary, tự động nén định dạng WebP tối ưu dung lượng.

---

## 3.5 Tầng Truy Xuất Dữ Liệu (`repositories/` & `models/`)

### File: `server/src/repositories/user.repository.js`
* **Chức năng:** Quản lý truy vấn bảng `users` và `user_refresh_tokens`. Hỗ trợ **Dual-mode**: tự động nhận diện kết nối PostgreSQL thực hoặc bộ nhớ RAM in-memory để kiểm thử.
* **Functions:**
  * `create(userData)`: Thêm mới người dùng vào PostgreSQL.
  * `findByEmail(email)`: Tìm kiếm tài khoản theo email (chuẩn hóa chữ thường).
  * `findById(id)`: Lấy thông tin người dùng theo UUID.
  * `saveRefreshToken(userId, tokenHash, expiresAt)`: Lưu mã băm SHA-256 của Refresh Token.
  * `findRefreshToken(tokenHash)`: Đối soát token khi người dùng yêu cầu cấp mới Access Token.
  * `revokeRefreshToken(tokenHash)`: Đánh dấu vô hiệu hóa token khi đăng xuất.

### File: `server/src/models/itinerary.model.js`
* **Chức năng:** Mongoose Schema định nghĩa mô hình dữ liệu tài liệu linh hoạt trong MongoDB:
  * Embedded subdocuments `days[]`: Mảng các ngày trong chuyến đi.
  * Embedded subdocuments `items[]`: Danh sách các điểm dừng trong ngày (tên điểm, tọa độ `lat/lng`, thời gian bắt đầu, ghi chú).
  * Embedded array `collaborators[]`: Mảng cộng tác viên gồm `userId`, `role` (`OWNER`, `EDITOR`, `VIEWER`), `status` (`ACCEPTED`, `PENDING`).
  * Index: `createIndex({ "collaborators.userId": 1 })` giúp truy vấn danh sách chuyến đi của một người dùng trong vòng $< 15\text{ms}$.

### File: `server/src/repositories/itinerary.repository.js`
* **Chức năng:** Tầng truy xuất dữ liệu MongoDB cho lịch trình chuyến đi:
  * `create(itineraryData)`: Khởi tạo chuyến đi mới.
  * `findById(id)`: Lấy chi tiết lịch trình kèm toàn bộ các ngày và điểm dừng.
  * `findByUserId(userId)`: Lấy danh sách chuyến đi mà người dùng sở hữu hoặc được mời tham gia.
  * `updateTimeline(id, days)`: Cập nhật toàn bộ cấu trúc các ngày và điểm dừng sau khi người dùng kéo thả sắp xếp lại.
  * `addCollaborator(id, collaboratorData)`: Thêm bạn bè vào danh sách cộng tác viên.

### File: `server/src/repositories/expense.repository.js`
* **Chức năng:** Quản lý truy xuất dữ liệu sổ cái tài chính PostgreSQL với tính toàn vẹn giao dịch tuyệt đối (ACID Transactions).
* **Functions:**
  * `createExpenseWithSplits(expenseData, splitsData)`: **BẮT BUỘC CHẠY TRONG GIAO DỊCH DATABASE** (`BEGIN ... COMMIT / ROLLBACK`). Thêm đồng thời bản ghi chi phí vào `trip_expenses` và các bản ghi phân bổ vào `trip_expense_splits`. Nếu bất kỳ dòng split nào lỗi, toàn bộ giao dịch tự động hoàn tác (Rollback), không bao giờ để lại dữ liệu rác.
  * `findByTripId(tripId)`: Lấy toàn bộ lịch sử chi phí của một chuyến đi.
  * `getMemberBalances(tripId)`: Truy vấn số dư chi tiết của các thành viên.
  * `createSettlement(settlementData)`: Lưu vết thanh toán trả nợ vào bảng `trip_settlements`.

---

## 3.6 Tầng Nghiệp Vụ Chuyên Sâu (`services/`)

### File: `server/src/services/auth.service.js`
* **Chức năng:** Thực thi toàn bộ quy trình nghiệp vụ Đăng ký, Đăng nhập, Làm mới Token và Đăng xuất.
* **Functions:**
  * `register({ email, password, fullName })`: Kiểm tra trùng lặp email (trả về 409 Conflict nếu đã tồn tại). Băm mật khẩu bằng Bcrypt 12 rounds. Tạo người dùng mới và tạo cặp Dual-Token (Access Token + Refresh Token).
  * `login({ email, password })`: Đối soát email và kiểm tra mật khẩu bằng `comparePassword`. Nếu sai, trả về 401 Unauthorized. Nếu đúng, lưu Refresh Token và trả về thông tin người dùng kèm token.
  * `refresh(refreshToken)`: Kiểm tra mã băm SHA-256 của Refresh Token. Nếu hợp lệ, sinh cặp token mới và thu hồi token cũ (**Refresh Token Rotation — RTR**).
  * `logout(refreshToken)`: Thu hồi token trong CSDL.

### File: `server/src/services/token.service.js`
* **Chức năng:** Quản lý vòng đời JSON Web Token và mã hóa SHA-256.
* **Functions:**
  * `generateAccessToken(user)`: Ký JWT Access Token có thời hạn ngắn **15 phút**, chứa payload `{ id, email, role }`.
  * `generateRefreshToken()`: Tạo chuỗi ngẫu nhiên 64 ký tự an toàn cao (`crypto.randomBytes(32).toString('hex')`).
  * `hashToken(token)`: Băm Refresh Token bằng thuật toán **SHA-256** trước khi lưu vào CSDL.
  * `verifyAccessToken(token)`: Xác thực tính nguyên vẹn và hạn sử dụng của JWT.

### File: `server/src/services/booking.service.js`
* **Chức năng:** Điều phối tìm kiếm đa nguồn song song, tích hợp Cache-Aside và bộ lọc đa tiêu chí.
* **Functions:**
  * `searchFlights(searchParams)`: Tạo khóa cache xác định (`nomadix:flight:...`). Kiểm tra Redis Cache: nếu có (Cache Hit), trả về ngay trong $< 50\text{ms}$; nếu không có (Cache Miss), gọi song song Duffel Provider và Mock Provider, chuẩn hóa qua `normalizerService`, lưu vào Redis với TTL 1800s và trả về client.
  * `searchHotels(city, checkIn, checkOut, guests)`: Thực hiện quy trình tương tự với Redis TTL 3600s.
  * Hỗ trợ lọc theo giá (`maxPrice`), lọc bay thẳng (`directOnly`), xếp hạng sao (`minRating`), sắp xếp theo giá rẻ nhất hoặc thời gian bay nhanh nhất.

### File: `server/src/services/normalizer.service.js`
* **Chức năng:** Chuẩn hóa các nguồn dữ liệu vé máy bay và khách sạn không đồng nhất (heterogeneous) về hai chuẩn chung duy nhất: `UnifiedFlight` và `UnifiedHotel`. Tự động phát hiện và loại bỏ các chuyến bay trùng mã hành trình, giữ lại vé có giá thấp nhất.

### File: `server/src/services/cache.service.js`
* **Chức năng:** Đóng gói kết nối Redis Client (sử dụng thư viện `ioredis`), tự động fallback sang bộ nhớ RAM cục bộ nếu Redis Server gặp sự cố, đảm bảo dịch vụ không bao giờ bị gián đoạn.

### File: `server/src/services/itinerary.service.js`
* **Chức năng:** Quản lý tạo lịch trình, thêm điểm dừng, tự động tính toán khoảng cách di chuyển giữa các điểm dừng bằng thuật toán Haversine và kéo thả sắp xếp lại các điểm.

### File: `server/src/services/expense.service.js`
* **Chức năng:** Quản lý chia tiền nhóm, hỗ trợ 4 kiểu chia: Chia đều (`equal`), Số tiền cụ thể (`exact`), Phần trăm (`percentage`), Phần chia (`shares`). Kết hợp `debt.util.js` tính toán bảng cân đối thu chi và lập phương án trả nợ tối ưu nhất.

### File: `server/src/services/crossDbIntegrity.service.js`
* **Chức năng:** Giám sát tính nhất quán giữa PostgreSQL (chứa sổ cái tài chính) và MongoDB (chứa lịch trình chuyến đi).
* **Functions:**
  * `findOrphanTripExpenses(tripId)`: Kiểm tra xem có chi phí nào trong PostgreSQL thuộc về một chuyến đi đã bị xóa trong MongoDB hay không.
  * `verifyTripConsistency(tripId)`: Đối soát danh sách thành viên trong PostgreSQL `trip_members` với mảng `collaborators` trong MongoDB.
  * `executeWithCompensation(primaryAction, compensateAction)`: Thực thi giao dịch ghi kép (Dual-write) với cơ chế bồi hoàn tự động: nếu thao tác trên MongoDB thất bại, tự động kích hoạt `compensateAction` để rollback dữ liệu trên PostgreSQL.

### File: `server/src/services/places.service.js`
* **Chức năng:** Tìm kiếm địa điểm du lịch và triển khai thuật toán **AI Hierarchical Agglomerative Clustering (HAC)**: tự động phân nhóm các điểm tham quan theo khoảng cách địa lý và gom thành lịch trình từng ngày tối ưu nhất cho người dùng.

---

## 3.7 Tầng Điều Hướng & Kiểm Soát API (`controllers/` & `routes/`)

* **`auth.controller.js` & `auth.routes.js`:** Điều hướng các request đăng ký, đăng nhập, cấp lại token và đăng xuất.
* **`flight.controller.js` & `flight.routes.js`:** Nhận tham số tìm kiếm vé máy bay, validate dữ liệu và trả về danh sách `UnifiedFlight[]`.
* **`hotel.controller.js` & `hotel.routes.js`:** Nhận tham số tìm kiếm khách sạn và trả về danh sách `UnifiedHotel[]`.
* **`itinerary.controller.js` & `itinerary.routes.js`:** Nhận request CRUD chuyến đi, thêm điểm dừng, đổi thứ tự điểm dừng và mời bạn bè vào nhóm.
* **`expense.controller.js` & `expense.routes.js`:** Nhận request tạo chi phí, xem bảng nợ nhóm, sinh phương án rút gọn nợ và thanh toán trả nợ.
* **`places.controller.js` & `places.routes.js`:** Nhận request tìm kiếm địa điểm và kích hoạt thuật toán AI gom cụm lịch trình.

---

# 4. CHI TIẾT MÃ NGUỒN FRONTEND MOBILE (REACT NATIVE & EXPO SDK 57)

## 4.1 Tầng Kết Nối Mạng & Design System (`api/` & `theme/`)

### File: `client/src/api/client.js`
* **Chức năng:** Khởi tạo instance Axios HTTP Client kết nối với Backend API.
* **Functions & Interceptors:**
  * `resolveApiBaseUrl()`: **Hàm tự động dò tìm IP thông minh**. Tự động bóc tách địa chỉ IP máy chủ Metro từ biến môi trường `NativeModules.SourceCode.scriptURL`, hỗ trợ `EXPO_PUBLIC_API_URL`, fallback sang IP mạng LAN máy chủ và Android Emulator host `10.0.2.2:5001`. Giúp ứng dụng chạy mượt trên cả giả lập và máy thật mà không bao giờ bị lỗi `Network Error`.
  * Request Interceptor: Tự động trích xuất Access Token từ `auth.store.js` và đính kèm vào header `Authorization: Bearer <token>`.
  * Response Interceptor: Tự động mở gói (unwrap) phản hồi JSON chuẩn `{ success: true, data }` và chuẩn hóa thông báo lỗi thân thiện.

### File: `client/src/theme/colors.js` & `client/src/theme/typography.js`
* **Chức năng:** Định nghĩa Design Tokens của Nomadix:
  * Bảng màu Dual-Theme: Chế độ Sáng Pale Blue (`background: '#F0F6FF'`, `card: '#FFFFFF'`, `text: '#0F172A'`) và Chế độ Tối Deep Navy (`background: '#0D1B2A'`, `card: '#1E293B'`, `text: '#F8FAFC'`). Màu chủ đạo Primary Blue (`#2563EB`).
  * Typography: Thang bậc kiểu chữ từ `h1` (32px, bold), `h2` (24px), `body` (15px) đến `caption` (12px), tuân thủ tiêu chuẩn tương phản **WCAG 2.1 AA ($\ge 4.5:1$)**.

---

## 4.2 Tầng Quản Lý Trạng Thái Tập Trung (`stores/`)

Toàn bộ ứng dụng sử dụng **Zustand** — thư viện quản lý trạng thái hiện đại, nhẹ hơn Redux, không cần boilerplate code và không gây re-render dư thừa:
* **`auth.store.js`:** Quản lý thông tin đăng nhập người dùng (`user`), access token (`accessToken`), trạng thái đăng nhập và các action `login()`, `register()`, `logout()`.
* **`theme.store.js`:** Quản lý giao diện hiện tại (`isDarkMode: false`), cung cấp action `toggleTheme()` và `setDarkMode(bool)` đồng bộ tức thì trên toàn bộ ứng dụng.
* **`booking.store.js`:** Quản lý dữ liệu tìm kiếm vé máy bay (`flights[]`), khách sạn (`hotels[]`), bộ lọc đa tiêu chí (`filters`), vé đang chọn (`selectedFlight`), vé đã đặt (`bookedTickets[]`) và action `bookSandboxTicket()`.
* **`itinerary.store.js`:** Quản lý danh sách chuyến đi (`trips[]`), chuyến đi hiện tại (`currentTrip`), các ngày (`days[]`), các điểm dừng (`stops[]`), action `createTrip()`, `addStop()` và `applyAiPlan()`.
* **`expense.store.js`:** Quản lý chi phí chuyến đi (`expenses[]`), số dư các thành viên (`balances`), phương án trả nợ rút gọn (`settlements[]`) và action `settleDebt()`.
* **`places.store.js`:** Quản lý danh sách địa điểm khám phá (`places[]`), danh sách điểm yêu thích đã chọn (`selectedPlaces: Set`), action `togglePlaceSelection()` và `generateAiPlan()`.

---

## 4.3 Tầng Thành Phần Giao Diện Nguyên Tử (`components/common/`)

* **`Button.js`:** Nút bấm tái sử dụng hỗ trợ 2 biến thể: `primary` (nền xanh chữ trắng) và `outline` (viền mỏng trong suốt), tích hợp trạng thái tải xoay tròn (`ActivityIndicator`) và vô hiệu hóa khi xử lý (`disabled`).
* **`Input.js`:** Ô nhập liệu văn bản hoàn chỉnh có nhãn (`label`), văn bản gợi ý ví dụ (`placeholder="e.g. ..."`), nút bật tắt ẩn/hiện mật khẩu, và banner cảnh báo lỗi nhập liệu màu đỏ. Tự động đồng bộ màu nền và viền theo Dark/Light Mode.
* **`CalendarPickerModal.js`:** Hộp thoại lịch chọn ngày đi và ngày về theo phong cách thiết kế **Apple iOS HIG**. Hỗ trợ ràng buộc `minDate` (vô hiệu hóa các ngày trong quá khứ) và tự động tính toán số ngày đêm của chuyến đi.

---

## 4.4 Tầng Thành Phần Nghiệp Vụ Booking (`components/booking/`)

* **`FlightCard.js`:** Thẻ hiển thị vé máy bay: Logo hãng hàng không phân giải cao (Vietnam Airlines, VietJet, Duffel CDN), mã chuyến bay, giờ cất cánh/hạ cánh, thời gian bay, vạch hành trình với các chấm dừng (`stops`), chỉ báo tự động chuyển hành lý (`🔄 Chuyển hành lý tự động`) và giá vé định dạng tiền tệ `₫`.
* **`HotelCard.js`:** Thẻ hiển thị khách sạn: Hình ảnh đại diện, số sao đánh giá, địa chỉ, điểm đánh giá người dùng, giá mỗi đêm và tổng giá tiền cho toàn bộ kỳ nghỉ.
* **`FlightDetailModal.js`:** Hộp thoại xem chi tiết chặng bay, chính sách hành lý xách tay (7kg), hành lý ký gửi (20kg), model máy bay và lượng phát thải khí nhà kính CO2.
* **`FlightFilterModal.js`:** Hộp thoại bộ lọc nâng cao theo tiêu chuẩn quốc tế: Lọc bay thẳng, nối chuyến, có hành lý ký gửi, sắp xếp theo giá rẻ nhất hoặc giờ bay sớm nhất.
* **`SandboxBookingModal.js`:** Hộp thoại xác nhận đặt vé máy bay thử nghiệm: Nhập thông tin hành khách (Họ tên, Số CCCD/Hộ chiếu), chọn phương thức thanh toán giả lập và xuất vé tức thì.
* **`BoardingPassModal.js`:** Thẻ vé máy bay điện tử (e-Boarding Pass) hiển thị mã đặt chỗ PNR 6 ký tự, mã vạch Barcode mô phỏng, cửa ra máy bay (Gate), số ghế (Seat) và thông tin chuyến bay hoàn chỉnh.

---

## 4.5 Tầng Thành Phần Bản Đồ & Kế Hoạch (`components/plan/`)

### File: `client/src/components/plan/PlanMapDiscovery.js`
* **Chức năng:** Không gian tương tác bản đồ khám phá địa điểm du lịch:
  * Bản đồ **Mapbox GL** tương tác hiển thị ghim địa điểm đánh số trực quan (`Điểm 1`, `Điểm 2`...).
  * Thanh tìm kiếm nổi trực tiếp trên lớp bản đồ (`Floating Map Search Bar`).
  * Cụm nút chuyển đổi nhanh góc nhìn giữa các thành phố (`Đà Nẵng`, `Hội An`, `Hà Nội`, `Tokyo`, `Paris`, `New York`).
  * Bộ lọc danh mục nổi (`Tất cả`, `Di tích`, `Biển`, `Ẩm thực`, `Thiên nhiên`).
  * Khay trượt ngang hiển thị thẻ địa điểm đồng bộ với ghim bản đồ.
  * Thanh điều khiển dưới đáy hiển thị số lượng điểm đã chọn và nút kích hoạt **"✨ AI Lên Lịch Trình"**.

### File: `client/src/components/plan/MultiCityPlanWizard.js`
* **Chức năng:** Trợ lý thông minh hướng dẫn lập kế hoạch đa chặng qua **3 giai đoạn tuần tự**:
  1. **Bước 1 (Setup):** Chọn nhiều thành phố điểm đến cùng lúc (`[✓] Đà Nẵng`, `[✓] Hội An`), điều chỉnh số ngày lưu trú cho từng thành phố bằng nút tăng/giảm stepper, và chọn phân khúc ngân sách (`🎒 Tiết kiệm`, `☕ Tiêu chuẩn`, `👑 Nghỉ dưỡng`).
  2. **Bước 2 (Interactive Map Stage):** Màn hình bản đồ Mapbox phóng lớn ($42\%$ chiều cao màn hình), ghim các địa điểm gợi ý theo từng thành phố, người dùng chọn các điểm ưng ý và bấm nút chuyển chặng (`Sang chặng tiếp theo →`).
  3. **Bước 3 (Summary & Compile):** Tổng kết toàn bộ lộ trình đa chặng, danh sách điểm đã chọn cho từng thành phố, so sánh chi phí dự kiến với ngân sách đã đặt ra và bấm nút biên dịch lịch trình tự động.

---

## 4.6 Tầng Màn Hình Ứng Dụng Chính (`screens/`)

### File: `client/src/screens/booking/FlightSearchScreen.js`
* **Chức năng:** Màn hình tìm kiếm và tra cứu vé máy bay:
  * Form tìm kiếm: Chọn một chiều / khứ hồi, ô nhập nơi đi/đến có gợi ý tự động mã sân bay IATA (`HAN`, `SGN`, `DAD`...), bộ chọn ngày lịch iOS.
  * **Trending Flight Deals Carousel:** Danh sách thẻ trượt các chặng bay ưu đãi thịnh hành (Đà Nẵng ₫690k, Bangkok ₫1.25M, Tokyo ₫3.42M) hỗ trợ **1-chạm điền tự động lộ trình**.
  * **Nomadix Flight Guarantee Banner:** Banner cam kết 3 trụ cột niềm tin (Dữ liệu GDS thời gian thực 100%, Giữ chỗ miễn phí 24h, So sánh hành lý 20kg).
  * Danh sách kết quả vé máy bay có bộ lọc nhanh dạng viên thuốc (`Pills`).

### File: `client/src/screens/booking/HotelSearchScreen.js`
* **Chức năng:** Màn hình tìm kiếm khách sạn và khu nghỉ dưỡng:
  * Form tìm kiếm điểm đến và ngày lưu trú.
  * **Explore By Vibe Chips:** Danh mục khám phá theo phong cách sống (`🏝️ Beachfront`, `🏔️ Mountain`, `💎 Luxury`, `🏮 Heritage`, `🌿 Glamping`) hỗ trợ 1-chạm điền địa danh.
  * **Featured Stays Spotlight:** Giới thiệu các khu nghỉ dưỡng hàng đầu (Vinpearl Resort ★4.9, Anantara Resort ★4.8).
  * **Nomadix Squad Stay Perks:** Ưu đãi đặc quyền cho nhóm từ 3 khách (Miễn phí trả phòng muộn, tự động chia tiền phòng).

### File: `client/src/screens/plan/PlanScreen.js`
* **Chức năng:** Màn hình Lập kế hoạch chuyến đi, phân chia rõ ràng thành 2 trạng thái:
  * **Khi chưa có chuyến đi (`!trip`):** Hiển thị màn hình rỗng tinh gọn với duy nhất **2 lựa chọn chiến lược**:
    1. `✨ Smart Journey Wizard` (`MultiCityPlanWizard`): Bắt đầu wizard 3 bước lập kế hoạch đa chặng.
    2. `🗺️ Explore Places on Map First` (`PlanMapDiscovery`): Khám phá bản đồ và chọn trước các ghim yêu thích.
  * **Khi đã có chuyến đi:** Hiển thị 3 tab con chuyên biệt:
    1. `🗺️ Bản đồ & Khám phá` (`'map'`)
    2. `📅 Lịch trình & Đội nhóm` (`'itinerary'`): Hiển thị timeline từng ngày, danh sách điểm dừng, khoảng cách Haversine giữa các chặng và danh sách bạn bè đồng hành.
    3. `💰 Chi tiêu & Chia tiền` (`'expense'`): Quản lý các khoản chi, xem số dư từng người và kích hoạt thuật toán rút gọn nợ Greedy.

### File: `client/src/screens/account/ProfileScreen.js`
* **Chức năng:** Màn hình Hồ sơ người dùng và Quản lý vé:
  * Thẻ định danh du khách: Cấp bậc thành viên (Level 5 Explorer XP), trạng thái xác thực KYC, tài khoản ngân hàng nhận tiền hoàn nợ.
  * **Thẻ giao diện Appearance & Theme:** Cụm chuyển đổi chế độ Sáng (`☀️ Light Mode`) / Tối (`🌙 Dark Mode`) chuyên biệt, đã được loại bỏ hoàn toàn lỗi vệt trắng bóng đổ trên Android (`elevation: 0`).
  * Danh sách vé máy bay đã đặt trong phiên làm việc kèm nút mở xem e-Boarding Pass.
  * Nút đăng xuất tài khoản an toàn.

### File: `client/src/screens/auth/LoginScreen.js` & `RegisterScreen.js`
* **Chức năng:** Màn hình Đăng nhập và Đăng ký tài khoản:
  * Kiểm tra tính hợp lệ dữ liệu ngay tại máy khách (Client-side regex).
  * Nút đăng nhập nhanh tài khoản thử nghiệm 1-chạm (`abc@gmail.com` / `123`) giúp giảng viên chấm thi đăng nhập tức thì mà không cần gõ bàn phím.
  * Tự động điều hướng và đồng bộ trạng thái xác thực với Zustand store.

---

## 4.7 Điểm Đầu Vào Gốc Của Ứng Dụng (`App.js` & `index.js`)

### File: `client/App.js`
* **Chức năng:** Component gốc của ứng dụng React Native:
  * Bao bọc toàn bộ ứng dụng bằng `SafeAreaProvider` từ thư viện `react-native-safe-area-context` chuẩn mực (không sử dụng LogBox che giấu cảnh báo).
  * **Tái cấu trúc Top Header:** Đưa tiêu đề màn hình lớn nổi bật sang góc trên bên trái (`screenTitleTop`: `Search Flights`, `Hotels & Resorts`, `Trip Planner`, `My Profile`) và đặt logo thương hiệu nhỏ gọn `NOMADIX` sang góc trên bên phải.
  * Điều hướng thanh đáy Bottom Navigation Bar với 4 tab chức năng và biểu tượng tối giản đơn sắc (`✈ Flights`, `⌂ Hotels`, `⊞ Plan`, `⊙ Profile`).
  * Tự động lắng nghe thay đổi giao diện từ `theme.store.js` để đổi màu thanh trạng thái (Status Bar) và màu nền ứng dụng.

### File: `client/index.js`
* **Chức năng:** Đăng ký Component gốc với Metro Bundler và Expo 57 (`registerRootComponent(App)`).

---

# 5. BỘ NGUYÊN MẪU TRẢI NGHIỆM TRÊN WEB (`client/preview/`)

Nhằm phục vụ báo cáo tiến độ trực quan với Nhà trường trước khi hoàn thiện mã nguồn native, đồ án đã xây dựng bộ prototype tương tác chạy trực tiếp trên trình duyệt:
1. **`client/preview/index.html` (Showcase Dashboard Toàn Cảnh 3 Cột):**
   * **Cột trái:** Ma trận kiến trúc 5 tầng, ma trận CSDL Polyglot và bảng theo dõi chỉ số TDD (72 suites, 323 tests GREEN).
   * **Cột giữa:** Khung điện thoại iPhone 16 Pro Dynamic Island mô phỏng màn hình tìm kiếm vé máy bay, hiển thị 87 vé thực từ Duffel API, chấm nối chặng và bộ lọc quốc tế.
   * **Cột phải:** Tiêu điểm thuật toán Greedy Minimum Cash-Flow Reduction $O(N \log N)$ với biểu đồ so sánh trực quan rút gọn từ 6 khoản nợ đan xen xuống còn 2 giao dịch trực tiếp.
2. **`client/preview/plan-map-preview.html` (Bản đồ Khám phá & Lập lịch trình):**
   * Tích hợp bản đồ Mapbox GL JS v3 tương tác, thanh tìm kiếm nổi, chọn ghim đa thành phố và mô phỏng luồng AI gom cụm địa lý.
3. **`client/preview/ui-redesign-preview.html` (Bản mẫu Thử nghiệm Giao diện Mới):**
   * Trình diễn trước các thành phần làm phong phú giao diện (Trending Deals, Stay Vibes, Khung cam kết bảo đảm) trước khi đưa vào code React Native.

---

# 6. HỆ THỐNG KIỂM THỬ TỰ ĐỘNG & CI/CD PIPELINE

### 6.1 Thống kê Kết quả Kiểm thử (Test-Driven Development)
* **Tổng số Test Suites:** **72 suites** (33 suites Backend + 39 suites Frontend).
* **Tổng số Tests:** **323/323 tests passed (100% GREEN)**.
* **Độ bao phủ nhánh (Branch Coverage):** Đạt **$\ge 80.72\%$** trên toàn bộ hệ sinh thái mã nguồn, vượt xa tiêu chuẩn yêu cầu tối thiểu của Đại học Greenwich ($\ge 70\%$).

### 6.2 File: `.github/workflows/ci.yml`
* **Chức năng:** Kịch bản CI/CD tự động hóa trên GitHub Actions:
  * Kích hoạt tự động khi có thao tác `push` hoặc `pull_request` vào nhánh `main` hoặc `develop`.
  * Chạy trên môi trường ảo Ubuntu với Node.js 20.
  * Tự động khởi tạo dịch vụ PostgreSQL, MongoDB và Redis container trên GitHub runner.
  * Chạy quy chuẩn kiểm tra cú pháp ESLint & Prettier.
  * Chạy toàn bộ 323 bài kiểm thử Jest và đối soát ngưỡng bao phủ mã nguồn (Coverage Gate). Nếu có bất kỳ bài test nào bị gãy (RED), pipeline sẽ tự động từ chối và chặn việc merge mã nguồn lỗi.

---

# 7. NGÂN HÀNG CÂU HỎI VÀ ĐÁP ÁN BẢO VỆ ĐỒ ÁN (DEFENSE Q&A CHEAT SHEET)

Dưới đây là 10 câu hỏi hóc búa nhất mà Hội đồng chấm thi Đại học Greenwich thường chất vấn, cùng câu trả lời mẫu đạt điểm Xuất Sắc (Distinction):

#### ❓ Câu hỏi 1: Tại sao em lại sử dụng cùng lúc 3 CSDL (PostgreSQL, MongoDB, Redis) thay vì chỉ dùng 1 CSDL quan hệ duy nhất cho đơn giản?
> **Trả lời:** "Thưa Thầy/Cô, việc áp dụng kiến trúc **Polyglot Persistence** xuất phát từ bản chất kỹ thuật khác biệt của 3 bài toán trong đồ án:
> 1. Sổ cái chia tiền nhóm đòi hỏi tính toàn vẹn giao dịch tuyệt đối (**ACID Transactions**) và kiểu số chính xác `NUMERIC(12, 2)` để không bao giờ bị lệch một xu nào — điều này **PostgreSQL 16** xử lý hoàn hảo.
> 2. Lịch trình chuyến đi có cấu trúc đa ngày, đa điểm dừng lồng nhau và liên tục thay đổi (Polymorphic JSON). Nếu dùng PostgreSQL sẽ phải JOIN từ 5 đến 6 bảng, gây thắt cổ chai hiệu năng. Do đó em dùng **MongoDB Atlas 7.0** với cấu trúc nhúng sub-documents, giúp đọc toàn bộ chuyến đi chỉ bằng một truy vấn duy nhất dưới 15ms.
> 3. Tìm kiếm vé máy bay và khách sạn gọi API ngoài có chi phí và độ trễ cao. Em triển khai **Redis 7.0** làm tầng Cache-Aside với TTL hợp lý, giúp giảm độ trễ phản hồi từ 1.8 giây xuống còn dưới 50ms và bảo vệ hạn ngạch API."

#### ❓ Câu hỏi 2: Khi dùng cả PostgreSQL và MongoDB, làm sao em bảo đảm dữ liệu không bị lệch nhau (ví dụ: Chuyến đi bị xóa ở MongoDB nhưng chi phí vẫn còn ở PostgreSQL)?
> **Trả lời:** "Thưa Thầy/Cô, em đã xây dựng dịch vụ chuyên trách **`crossDbIntegrity.service.js`**. Dịch vụ này thực thi 2 cơ chế:
> 1. Cơ chế bồi hoàn giao dịch (**Compensating Transactions** qua hàm `executeWithCompensation`): Khi thực hiện ghi kép (Dual-write), nếu thao tác trên MongoDB thất bại thì hệ thống lập tức gọi hàm bồi hoàn để rollback dữ liệu tương ứng trên PostgreSQL.
> 2. Cơ chế quét chi phí mồ côi (`findOrphanTripExpenses`): Quét và phát hiện các bản ghi chi phí trong PostgreSQL trỏ tới `trip_id` không còn tồn tại trên MongoDB để xử lý dọn dẹp tự động."

#### ❓ Câu hỏi 3: Thuật toán rút gọn nợ Greedy Minimum Cash-Flow Reduction hoạt động như thế nào? Độ phức tạp là bao nhiêu?
> **Trả lời:** "Thuật toán được em cài đặt trong file `server/src/utils/debt.util.js`:
> * Đầu tiên, thuật toán tính **Số dư ròng ($\text{NetBalance}_i$)** của từng người và kiểm chứng định lý Zero-sum Invariant ($\sum \text{NetBalance} = 0$).
> * Tiếp theo, thuật toán đưa các con nợ ($\text{Balance} < 0$) và chủ nợ ($\text{Balance} > 0$) vào 2 cấu trúc Hàng đợi ưu tiên (Priority Queues / Max Heaps).
> * Ở mỗi bước, thuật toán lấy ra người nợ nhiều nhất và người cần thu nhiều nhất để thực hiện thanh toán trực tiếp số tiền $\min(|Debtor|, Creditor)$, sau đó cập nhật lại số dư vào hàng đợi.
> * Nhờ sử dụng Priority Queue, độ phức tạp thời gian đạt **$O(N \log N)$**, rút gọn tối đa từ $N(N-1)/2$ khoản nợ phức tạp xuống còn tối đa **$N-1$ giao dịch**, giúp việc giải quyết nợ trong nhóm bạn bè trở nên đơn giản nhất."

#### ❓ Câu hỏi 4: Cơ chế bảo mật xác thực người dùng trong hệ thống được thiết kế ra sao?
> **Trả lời:** "Hệ thống sử dụng cơ chế bảo mật xác thực kép:
> 1. Mật khẩu được băm bằng thư viện `bcryptjs` với độ muối **12 vòng (12 salt rounds)** kết hợp hàm so sánh chuỗi thời gian cố định.
> 2. Cơ chế Dual-Token: Access Token là **JSON Web Token (JWT)** có thời hạn ngắn **15 phút** chứa thông tin người dùng và phân quyền RBAC. Refresh Token là chuỗi ngẫu nhiên 64 ký tự an toàn (`crypto.randomBytes(32)`), được lưu dưới dạng băm **SHA-256** trong PostgreSQL với thời hạn 7 ngày.
> 3. Triển khai kỹ thuật **Refresh Token Rotation (RTR)**: Mỗi lần xin cấp mới Access Token, Refresh Token cũ sẽ bị hủy ngay lập tức và cấp một Refresh Token mới, ngăn chặn hoàn toàn nguy cơ bị chiếm quyền phiên đăng nhập (Token Replay Attacks)."

#### ❓ Câu hỏi 5: Tại sao ứng dụng di động trên máy ảo Android và điện thoại thật không bị lỗi 'Network Error' khi kết nối với máy chủ Backend?
> **Trả lời:** "Trong file `client/src/api/client.js`, em đã viết hàm **`resolveApiBaseUrl()`**. Hàm này không hardcode địa chỉ `localhost` (vốn sẽ trỏ vào chính máy ảo Android dẫn đến lỗi kết nối), mà tự động bóc tách địa chỉ IP thực của máy trạm phát gói Metro từ thuộc tính `NativeModules.SourceCode.scriptURL`. Đồng thời máy chủ Node.js được bind vào `0.0.0.0` thay vì `127.0.0.1`, cho phép mọi thiết bị trong cùng mạng Wi-Fi và Android Emulator kết nối thông suốt."

#### ❓ Câu hỏi 6: Em đã áp dụng phương pháp luận phát triển phần mềm nào và làm thế nào để chứng minh chất lượng mã nguồn?
> **Trả lời:** "Dự án tuân thủ nghiêm ngặt phương pháp luận **Extreme Programming (XP)** với cặp vai trò Driver/Navigator và thực thi quy trình **Test-Driven Development (TDD)** theo chu trình Red-Green-Refactor:
> * Mọi tính năng nghiệp vụ đều được viết bài kiểm thử thất bại (RED) trước khi viết code triển khai (GREEN).
> * Hệ thống sở hữu **72 test suites với 323 bài test tự động** đạt tỷ lệ thành công 100% GREEN.
> * Độ phủ nhánh (Branch Coverage) đạt **$80.72\%$**, được kiểm soát tự động qua cổng kiểm thử GitHub Actions CI/CD Pipeline."

---

*Bản tài liệu này được biên soạn đầy đủ, chính xác theo hiện trạng mã nguồn thực tế của đồ án Nomadix tính đến ngày 18/10/2026. Sinh viên có thể sử dụng trực tiếp để thuyết minh và trả lời phản biện trước Hội đồng tốt nghiệp.*
