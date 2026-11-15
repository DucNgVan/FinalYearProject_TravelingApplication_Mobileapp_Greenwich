# TẬP 2: HẠ TẦNG POLYGLOT DATABASE & BACKEND MODULAR MONOLITH
## Nomadix Software Engineering Curriculum — Volume 2

---

### 1. Tại sao một dự án chuyên nghiệp cần Cơ sở dữ liệu Đa mô hình (Polyglot Persistence)?

Một sai lầm rất phổ biến của người mới học là: *"Tôi học MySQL thì dùng MySQL cho mọi thứ"* hoặc *"Tôi học MongoDB thì nhét tất cả vào MongoDB"*. 

Trong thực tế, **không có một loại cơ sở dữ liệu nào hoàn hảo cho mọi bài toán**:
- Cơ sở dữ liệu quan hệ (SQL) cực giỏi về tính nhất quán, ràng buộc khoá ngoại và giao dịch tài chính.
- Cơ sở dữ liệu tài liệu (NoSQL) cực giỏi về lưu trữ dữ liệu lồng nhau phức tạp, biến đổi linh hoạt và đọc siêu tốc.
- Cơ sở dữ liệu trong bộ nhớ (In-Memory RAM) cực giỏi về tốc độ đọc tính bằng micro-giây và tự động hủy dữ liệu hết hạn (TTL).

Do đó, **Nomadix** sử dụng kiến trúc **Polyglot Persistence** phân định trách nhiệm rõ ràng:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MA TRẬN TRÁCH NHIỆM POLYGLOT DATABASE                          │
├─────────────────┬──────────────────────────────────────┬───────────────────────────────┤
│ DATABASE ENGINE │ MIỀN NGHIỆP VỤ ĐẢM NHIỆM             │ LÝ DO THIẾT KẾ KIẾN TRÚC      │
├─────────────────┼──────────────────────────────────────┼───────────────────────────────┤
│ PostgreSQL 16   │ • Tài khoản, Định danh & RBAC        │ Cần giao dịch ACID nghiêm ngặt│
│ (Relational)    │ • Đặt vé & Danh sách hành khách      │ Chuẩn hoá 3NF, kiểu số tiền   │
│                 │ • Sổ cái chi tiêu nhóm & Chia tiền   │ NUMERIC(12, 2) chống sai số.  │
├─────────────────┼──────────────────────────────────────┼───────────────────────────────┤
│ MongoDB Atlas 7 │ • Lịch trình đa ngày (Itineraries)   │ Cấu trúc lồng nhau 1:Few,     │
│ (Document)      │ • Danh sách địa điểm tham quan       │ linh hoạt số ngày/số chặng,   │
│                 │ • Thành viên Squad cộng tác          │ đọc toàn bộ trip dưới 15ms.   │
├─────────────────┼──────────────────────────────────────┼───────────────────────────────┤
│ Redis 7.0       │ • Cache tìm kiếm chuyến bay & phòng  │ Tốc độ RAM sub-50ms, tự động  │
│ (In-Memory)     │ • Bộ đếm Rate Limiting theo IP       │ hết hạn TTL, bảo vệ quota API │
│                 │ • Lưu phiên làm việc tạm thời        │ đối tác bên ngoài.            │
└─────────────────┴──────────────────────────────────────┴───────────────────────────────┘
```

---

### 2. Thiết lập Môi trường Đồng nhất bằng Docker Compose

Để đảm bảo mọi thành viên trong nhóm phát triển đều có môi trường giống hệt nhau, ta đóng gói hạ tầng qua `docker-compose.yml`:

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: nomadix-postgres
    environment:
      POSTGRES_DB: nomadix_db
      POSTGRES_USER: nomadix_user
      POSTGRES_PASSWORD: secret_password
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./docker/init-db/01-init.sql:/docker-entrypoint-initdb.d/01-init.sql

  redis:
    image: redis:7-alpine
    container_name: nomadix-redis
    ports:
      - "6379:6379"
    volumes:
      - redisdata:/data

volumes:
  pgdata:
  redisdata:
```

Chỉ cần một lệnh: `docker compose up -d`, toàn bộ hạ tầng cơ sở dữ liệu đã sẵn sàng hoạt động mà không cần cài đặt rườm rà lên máy cá nhân.

---

### 3. PostgreSQL 16: Chuẩn hoá 3NF & Tính Toàn Vẹn Tài Chính

#### Bài học sống còn: Tuyệt đối không dùng `FLOAT` để lưu tiền!
Trong khoa học máy tính, máy tính biểu diễn số thực dấu phẩy động theo chuẩn IEEE 754:
$$0.1 + 0.2 = 0.30000000000000004$$
Nếu dùng `FLOAT` trong ứng dụng chia tiền nhóm, tài khoản của bạn sẽ dần bị hao hụt hoặc chênh lệch vài xu, gây mất lòng tin ở người dùng.

Trong PostgreSQL, bắt buộc phải dùng **`NUMERIC(12, 2)`** hoặc **`DECIMAL`**:
```sql
CREATE TABLE trip_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id VARCHAR(64) NOT NULL,
    payer_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(128) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(64) DEFAULT 'Food & Dining',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Giao dịch ACID trong thanh toán:
Khi A thanh toán nợ cho B, hai hành động (trừ tiền A và cộng tiền B) bắt buộc phải nằm trong cùng một khối giao dịch. Nếu máy chủ bị cúp điện giữa chừng, toàn bộ thay đổi phải bị `ROLLBACK`:

```javascript
// server/src/repositories/settlement.repository.js
const pool = require('../db/postgres.pool');

async function recordSettlement(tripId, fromUserId, toUserId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Khởi đầu giao dịch

    // 1. Ghi nhận giao dịch giải quyết nợ
    const insertQuery = `
      INSERT INTO trip_settlements (trip_id, from_user_id, to_user_id, amount, status)
      VALUES ($1, $2, $3, $4, 'COMPLETED')
      RETURNING *;
    `;
    const res = await client.query(insertQuery, [tripId, fromUserId, toUserId, amount]);

    // 2. Cập nhật trạng thái số dư thành viên
    await client.query(`
      UPDATE trip_members 
      SET last_settled_at = CURRENT_TIMESTAMP 
      WHERE trip_id = $1 AND user_id = $2
    `, [tripId, fromUserId]);

    await client.query('COMMIT'); // Cam kết thành công
    return res.rows[0];
  } catch (err) {
    await client.query('ROLLBACK'); // Hoàn tác nếu có bất kỳ lỗi nào!
    throw err;
  } finally {
    client.release();
  }
}
```

---

### 4. MongoDB Atlas: Lịch trình Đa ngày Linh hoạt

Với lịch trình du lịch, một chuyến đi có thể kéo dài 2 ngày (chỉ có 3 địa điểm) hoặc 10 ngày (hàng chục địa điểm với thông số di chuyển, nhà hàng, thời gian đến). Nếu ép vào SQL, bạn sẽ phải join qua 4-5 bảng (`trips`, `days`, `day_stops`, `stop_transits`, `collaborators`).

Trong MongoDB, toàn bộ cấu trúc này được lưu trữ như một **Tài liệu hoàn chỉnh (Complete Document)**:

```javascript
// server/src/models/itinerary.model.js
const mongoose = require('mongoose');

const ItinerarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  destinationCity: { type: String, required: true },
  country: { type: String, default: 'Việt Nam' },
  daysCount: { type: Number, default: 3 },
  travelMode: { type: String, enum: ['solo', 'group'], default: 'group' },
  budgetPerPerson: { type: Number, default: 2000000 },
  days: [
    {
      dayNumber: Number,
      date: String,
      distanceKm: Number,
      items: [
        {
          id: String,
          name: String,
          category: String,
          time: String,
          duration: String,
          transitToNext: {
            mode: String,
            distanceKm: Number,
            durationMin: Number,
          },
        },
      ],
    },
  ],
  collaborators: [
    {
      userId: String,
      fullName: String,
      role: { type: String, enum: ['OWNER', 'EDITOR', 'VIEWER'], default: 'EDITOR' },
      status: { type: String, default: 'ACCEPTED' },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Itinerary', ItinerarySchema);
```
Nhờ cấu trúc này, khi người dùng mở một chuyến đi, ứng dụng chỉ cần thực hiện đúng **1 câu truy vấn `findById`** và nhận về toàn bộ dữ liệu trong vòng chưa đầy 15 miligiây!

---

### 5. Redis 7.0: Chiến lược Bộ nhớ đệm Cache-Aside

Khi người dùng tìm kiếm vé máy bay từ SGN đến HAN:
- Gọi API bên thứ ba mất **1.8 giây** và tốn tiền ngạch API.
- Nếu 1,000 người cùng tìm một chuyến bay trong 15 phút, gọi 1,000 lần sẽ làm cạn kiệt tài khoản và nghẽn mạng!

Giải pháp là **Mô hình Cache-Aside**:

```
 [CLIENT] ──(1) Tìm chuyến bay SGN -> HAN──> [SERVER]
                                                 │
                                   (2) Kiểm tra Redis Cache?
                                      /              \
                             (Có - Cache Hit)    (Không - Cache Miss)
                                   /                    \
                         Trả về ngay (< 50ms)     (3) Gọi API ngoài (1.8s)
                                                         │
                                                  (4) Lưu vào Redis (TTL 1800s)
                                                         │
                                                  (5) Trả về Client
```

Code minh hoạ Cache-Aside:
```javascript
// server/src/services/flight.service.js
async function searchFlights(origin, destination, date) {
  const cacheKey = `flights:${origin}:${destination}:${date}`;
  
  // 1. Thử lấy từ Redis
  const cachedData = await redisClient.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData); // Trả về siêu tốc (< 50ms)
  }

  // 2. Cache miss: Gọi đối tác API Duffel
  const liveResults = await duffelApiProvider.search(origin, destination, date);

  // 3. Ghi vào Redis với thời gian sống TTL = 1800 giây (30 phút)
  await redisClient.set(cacheKey, JSON.stringify(liveResults), 'EX', 1800);

  return liveResults;
}
```

---

### 6. Bài tập Thực hành cho Học sinh

1. **Bài tập 2.1:** Viết một câu lệnh SQL trong PostgreSQL để tính toán tổng số tiền mà từng thành viên đã chi trả trong một chuyến đi cụ thể (`GROUP BY payer_id`).
2. **Bài tập 2.2:** Viết một hàm middleware Express kiểm tra JWT Token từ `Authorization: Bearer <token>`, nếu token hợp lệ thì gán `req.user = decoded`, nếu không hợp lệ hoặc hết hạn thì trả về HTTP 401.
