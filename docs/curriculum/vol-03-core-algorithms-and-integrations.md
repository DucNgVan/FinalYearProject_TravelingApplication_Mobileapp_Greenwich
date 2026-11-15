# TẬP 3: THUẬT TOÁN CỐT LÕI, TÀI CHÍNH NHÓM & TÍCH HỢP DỊCH VỤ
## Nomadix Software Engineering Curriculum — Volume 3

---

### 1. Thuật toán Tối giản Nợ Nhóm (Greedy Minimum Cash-Flow Reduction)

#### Bài toán thực tế:
Khi một nhóm 5 người đi du lịch cùng nhau trong 3 ngày:
- Bạn A trả tiền vé máy bay cho cả nhóm (10 triệu VND).
- Bạn B trả tiền khách sạn (6 triệu VND).
- Bạn C trả bữa tối hải sản (3 triệu VND).
- Bạn D trả tiền thuê xe (1.5 triệu VND).
- Bạn E không mang tiền mặt, chỉ tiêu ké.

Nếu tính toán thủ công từng người trả lại cho từng người, nhóm sẽ có **$5 \times 4 = 20$ giao dịch chéo rắc rối**. Mọi người sẽ liên tục chuyển khoản qua lại 50k, 100k, rất dễ nhầm lẫn và gây ức chế.

#### Bản chất Toán học của Thuật toán:
1. **Tính Dư nợ ròng (Net Balance) của mỗi thành viên:**
   $$\text{NetBalance}_i = \text{Tổng tiền } i \text{ đã trả} - \text{Tổng tiền } i \text{ phải chịu}$$
   - Nếu $\text{NetBalance}_i > 0$: Người này là **Chủ nợ (Creditor)** (được nhận tiền về).
   - Nếu $\text{NetBalance}_i < 0$: Người này là **Con nợ (Debtor)** (phải trả tiền đi).
   - Nếu $\text{NetBalance}_i = 0$: Đã hoà vốn.

2. **Bất biến bảo toàn dòng tiền:**
   $$\sum_{i=1}^{N} \text{NetBalance}_i = 0$$
   Tổng số tiền các con nợ phải trả luôn bằng chính xác tổng số tiền các chủ nợ cần nhận.

3. **Chiến lược Tham lam (Greedy Strategy với 2 Hàng đợi Ưu tiên):**
   - Lấy người nợ nhiều nhất (Max Debtor) trả trực tiếp cho người cần nhận nhiều nhất (Max Creditor).
   - Số tiền chuyển = $\min(|\text{Max Debtor}|, \text{Max Creditor})$.
   - Cập nhật số dư và đẩy lại vào Hàng đợi nếu chưa hết nợ.
   - **Kết quả:** Giảm số lần chuyển khoản từ $O(N^2)$ xuống tối đa chỉ còn **$N - 1$ giao dịch duy nhất**!

```
                    MÔ HÌNH THAM LAM 2 HÀNG ĐỢI
                    
     [CON NỢ (DEBTORS)]                   [CHỦ NỢ (CREDITORS)]
  ┌───────────────────────┐            ┌───────────────────────┐
  │ D: Nợ 2,500,000 VND   │            │ A: Cần nhận 3,500,000 │
  │ E: Nợ 2,000,000 VND   │            │ B: Cần nhận 1,000,000 │
  └───────────┬───────────┘            └───────────▲───────────┘
              │                                    │
              └──────── D trả A: 2,500,000 ────────┘
                               │
               (D hết nợ! A còn nhận 1,000,000)
```

#### Mã nguồn Cài đặt Thuật toán trong Nomadix:
```javascript
// server/src/utils/debt.util.js

function simplifyDebts(memberBalances) {
  // 1. Phân loại thành 2 danh sách: Con nợ và Chủ nợ
  const debtors = [];
  const creditors = [];

  for (const [userId, balance] of Object.entries(memberBalances)) {
    const net = Math.round(Number(balance));
    if (net < 0) {
      debtors.push({ userId, amount: Math.abs(net) });
    } else if (net > 0) {
      creditors.push({ userId, amount: net });
    }
  }

  // 2. Sắp xếp giảm dần theo số tiền (Mô phỏng Max-Heap)
  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  let dIdx = 0;
  let cIdx = 0;

  // 3. Khớp nối Greedy
  while (dIdx < debtors.length && cIdx < creditors.length) {
    const debtor = debtors[dIdx];
    const creditor = creditors[cIdx];

    const settleAmount = Math.min(debtor.amount, creditor.amount);

    transactions.push({
      fromUserId: debtor.userId,
      toUserId: creditor.userId,
      amount: settleAmount,
      currency: 'VND',
    });

    debtor.amount -= settleAmount;
    creditor.amount -= settleAmount;

    if (debtor.amount === 0) dIdx++;
    if (creditor.amount === 0) cIdx++;
  }

  return transactions;
}

module.exports = { simplifyDebts };
```

---

### 2. Thuật toán GPS Radar (Haversine Formula)

Để làm tính năng **Check-in Địa danh Văn hoá** nhận huy hiệu (Cultural Badges), ứng dụng cần biết người dùng có đang thực sự đứng gần địa danh đó hay không (ví dụ trong bán kính 500m quanh Chùa Cầu Hội An).

Do Trái Đất là một hình cầu (không phải mặt phẳng), ta không thể dùng công thức Pythagoras $\sqrt{\Delta x^2 + \Delta y^2}$ mà bắt buộc phải dùng **Công thức Haversine**:

$$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
*Trong đó: $R = 6371\text{ km}$ (bán kính Trái Đất), $\phi$ là vĩ độ (latitude), $\lambda$ là kinh độ (longitude).*

#### Mã nguồn Cài đặt:
```javascript
// server/src/utils/distance.util.js

function calculateHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Bán kính Trái Đất tính bằng km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

function isWithinCheckinRadius(userLat, userLon, spotLat, spotLon, radiusMeters = 500) {
  const distanceKm = calculateHaversineDistanceKm(userLat, userLon, spotLat, spotLon);
  return (distanceKm * 1000) <= radiusMeters;
}

module.exports = { calculateHaversineDistanceKm, isWithinCheckinRadius };
```

---

### 3. Tích hợp Dịch vụ Bên Thứ Ba & Mẫu Thiết kế Circuit Breaker

Trong môi trường thực tế, các dịch vụ bên ngoài (External APIs) có thể:
1. Bị sập máy chủ.
2. Quá tải mạng hoặc đứt cáp quốc tế.
3. Hết hạn mức dùng thử (API Quota Exceeded).

Nếu hệ thống của bạn gọi trực tiếp không có lớp bảo vệ, khi đối tác chết, **ứng dụng của bạn cũng chết theo**.

#### Kiến trúc Circuit Breaker & Fallback Adapter:
Mỗi adapter (Duffel API, Amadeus, OpenTripMap) trong Nomadix đều được trang bị cơ chế **Circuit Breaker**:

```
        ┌─────────────┐
        │ BÌNH THƯỜNG │ ───(Gặp lỗi liên tiếp > 5 lần)───┐
        │  (CLOSED)   │                                  │
        └──────▲──────┘                                  ▼
               │                                  ┌─────────────┐
        (Thử nghiệm OK)                           │  CẮT MẠCH   │
               │                                  │   (OPEN)    │
        ┌─────────────┐                           └──────┬──────┘
        │   THỬ LẠI   │                                  │
        │ (HALF-OPEN) │ ◄──(Hết thời gian chờ 60s)───────┘
        └─────────────┘
```

Code minh hoạ Adapter với Fallback Resilient:
```javascript
// server/src/providers/flight.provider.js
const axios = require('axios');
const mockFlights = require('../data/mockFlights.json');

class DuffelFlightProvider {
  constructor() {
    this.failureCount = 0;
    this.circuitOpen = false;
  }

  async searchFlights(origin, destination, date) {
    // Nếu mạch đang ngắt, dùng ngay dữ liệu dự phòng, không tốn thời gian chờ timeout
    if (this.circuitOpen) {
      console.warn('[Circuit Breaker] Tripped! Serving resilient fallback flights.');
      return this.getFallbackFlights(origin, destination);
    }

    try {
      const response = await axios.get('https://api.duffel.com/air/offer_requests', {
        headers: { Authorization: `Bearer ${process.env.DUFFEL_API_KEY}` },
        timeout: 5000, // Timeout sau 5 giây
      });
      this.failureCount = 0;
      return response.data;
    } catch (err) {
      this.failureCount++;
      if (this.failureCount >= 3) {
        this.circuitOpen = true;
        setTimeout(() => { this.circuitOpen = false; }, 60000); // Thử lại sau 1 phút
      }
      return this.getFallbackFlights(origin, destination);
    }
  }

  getFallbackFlights(origin, destination) {
    return mockFlights.filter(f => f.origin === origin && f.destination === destination);
  }
}

module.exports = new DuffelFlightProvider();
```

Nhờ mô hình này, người dùng **không bao giờ thấy màn hình trắng hoặc màn hình crash**, ngay cả khi đối tác API bên thứ ba gặp sự cố.

---

### 4. Bài tập Thực hành cho Học sinh

1. **Bài tập 3.1:** Chạy thuật toán `simplifyDebts` với kịch bản:
   - A trả 1,200,000 VND.
   - B trả 0 VND.
   - C trả 600,000 VND.
   - Cả 3 người chia đều tổng chi tiêu 1,800,000 VND (mỗi người chịu 600,000 VND).
   - Hãy chỉ ra ai phải chuyển khoản cho ai và số tiền là bao nhiêu.
2. **Bài tập 3.2:** Viết một test kiểm tra hàm `isWithinCheckinRadius` trả về `true` khi khoảng cách là 200m và trả về `false` khi khoảng cách là 650m.
