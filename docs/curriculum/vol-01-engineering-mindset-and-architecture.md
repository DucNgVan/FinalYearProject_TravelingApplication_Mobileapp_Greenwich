# TẬP 1: TƯ DUY KỸ SƯ, KIẾN TRÚC HỆ THỐNG & PHƯƠNG PHÁP LUẬN TDD
## Nomadix Software Engineering Curriculum — Volume 1

---

### 1. Giới thiệu & Triết lý Solo Extreme Programming (XP)

Trong thế giới phát triển phần mềm hiện đại, sự khác biệt lớn nhất giữa một "thợ code" (code monkey) và một "kỹ sư phần mềm" (software engineer) không nằm ở số dòng code họ gõ mỗi ngày, mà nằm ở **phương pháp luận, tính kỷ luật và tư duy kiến trúc**.

Khi bạn làm việc độc lập hoặc có sự trợ giúp của AI (như trong mô hình Antigravity Agent), mô hình làm việc hiệu quả nhất là **Solo Extreme Programming (XP)**:

```
┌────────────────────────────────────────────────────────┐
│             MÔ HÌNH SOLO EXTREME PROGRAMMING           │
├──────────────────────────┬─────────────────────────────┤
│ NGƯỜI ĐIỀU HƯỚNG         │ NGƯỜI LÁI XE                │
│ (NAVIGATOR - BẠN)        │ (DRIVER - AI / EXECUTOR)    │
├──────────────────────────┼─────────────────────────────┤
│ • Xác định bài toán lớn  │ • Viết test kiểm thử trước  │
│ • Thẩm định kiến trúc    │ • Viết code tối thiểu pass  │
│ • Đưa ra quyết định chốt │ • Tối ưu và dọn dẹp mã      │
│ • Kiểm duyệt chất lượng  │ • Đồng bộ hoá tài liệu      │
└──────────────────────────┴─────────────────────────────┘
```

#### Quy tắc vàng 3 bước (Context ➔ Plan ➔ TDD):
1. **Context Loading (Đọc trước khi viết):** Không bao giờ bắt tay vào code khi chưa hiểu rõ kiến trúc tổng thể của hệ thống.
2. **Planning (Lên kế hoạch trước khi code):** Liệt kê chính xác file nào cần tạo, hàm nào cần sửa, và test nào sẽ thất bại trước.
3. **Strict TDD Execution:** Nghiêm túc tuân thủ chu trình Đỏ - Xanh - Tối ưu hoá.

---

### 2. Chu trình Kiểm thử Dẫn đường: TDD (Test-Driven Development)

TDD là kỹ thuật viết kiểm thử **trước khi** viết mã nguồn nghiệp vụ. Nhiều người mới học lập trình thường cảm thấy việc này "tốn thời gian", nhưng thực tế TDD giúp tiết kiệm 70% thời gian gỡ lỗi (debugging) về sau.

```
   ┌──────────────┐
   │   BẮT ĐẦU    │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │   1. RED     │ ◄── Viết test mô tả hành vi mong muốn.
   │  (Fail Test) │     Chạy test và BẮT BUỘC test phải thất bại!
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │  2. GREEN    │ ◄── Viết lượng code TỐI THIỂU để test chuyển sang XANH.
   │  (Pass Test) │     Không viết thừa tính năng chưa được test bảo vệ!
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │ 3. REFACTOR  │ ◄── Tối ưu hoá cấu trúc code, đặt lại tên biến,
   │  (Clean Up)  │     tách hàm mà KHÔNG làm vỡ bất kỳ test nào.
   └──────┬───────┘
          │
          └─────────── Trở lại bước 1 cho tính năng tiếp theo!
```

#### Ví dụ TDD thực tế trong Nomadix: Tính toán ngân sách mỗi người

**Bước 1: Viết test RED trước**
```javascript
// server/tests/unit/utils/budget.test.js
const { calculatePerPersonBudget } = require('../../../src/utils/budget.util');

describe('Budget Utility - TDD Example', () => {
  test('RED-BUDGET-01: calculates correct budget per person for group', () => {
    const totalBudget = 6000000; // 6 triệu VND
    const travelersCount = 3;
    
    // Kỳ vọng: mỗi người 2,000,000 VND
    const perPerson = calculatePerPersonBudget(totalBudget, travelersCount);
    expect(perPerson).toBe(2000000);
  });

  test('RED-BUDGET-02: throws error when travelers count is invalid (<= 0)', () => {
    expect(() => calculatePerPersonBudget(5000000, 0)).toThrow('Invalid travelers count');
  });
});
```
*Chạy test ngay lúc này:* Test sẽ báo lỗi `calculatePerPersonBudget is not a function` ➔ **ĐẠT TRẠNG THÁI RED**.

**Bước 2: Viết code tối thiểu để GREEN**
```javascript
// server/src/utils/budget.util.js
function calculatePerPersonBudget(totalBudget, travelersCount) {
  if (!travelersCount || travelersCount <= 0) {
    throw new Error('Invalid travelers count');
  }
  return Math.round(totalBudget / travelersCount);
}

module.exports = { calculatePerPersonBudget };
```
*Chạy lại test:* Toàn bộ test chuyển sang màu xanh ➔ **ĐẠT TRẠNG THÁI GREEN**.

**Bước 3: REFACTOR**
Kiểm tra xem có cần xử lý số dư hoặc ép kiểu Number không. Cải tiến hàm mà test vẫn luôn Xanh!

---

### 3. Phân tích Yêu cầu Nghiệp vụ (Requirements Engineering)

Một hệ sinh thái du lịch phức tạp như Nomadix không thể xây dựng dựa trên suy nghĩ mơ hồ. Dự án chuẩn hoá theo mô hình 3 cấp độ:

```
┌────────────────────────────────────────────────────────┐
│             CẤP ĐỘ PHÂN TÍCH YÊU CẦU DỰ ÁN             │
├────────────────────────────────────────────────────────┤
│ 1. Business Requirements (BRD): Mục tiêu kinh doanh,   │
│    nỗi đau của du khách (quản lý tiền nhóm, vé rời rạc)│
├────────────────────────────────────────────────────────┤
│ 2. Product Requirements (PRD/SRS): 42 Yêu cầu chức năng│
│    (FR-01 đến FR-42), Personas, User Stories           │
├────────────────────────────────────────────────────────┤
│ 3. Acceptance Criteria: Kịch bản Gherkin chuẩn BDD     │
│    (Given - When - Then) làm tiêu chuẩn nghiệm thu     │
└────────────────────────────────────────────────────────┘
```

#### Ví dụ User Story & BDD Gherkin:
* **User Story:** Là một trưởng nhóm du lịch (Squad Leader), tôi muốn mời các thành viên tham gia chuyến đi bằng đường link mã ngắn, để mọi người cùng xem và chỉnh sửa lịch trình mà không cần tạo tài khoản thủ công rườm rà.
* **Gherkin Scenario:**
  ```gherkin
  Scenario: Successfully join a squad trip via short invite code
    Given a trip "Da Nang Expedition" exists with invite code "nx26"
    When traveler "Nam Hoang" enters "nomadix.app/join/nx26"
    Then the system adds "Nam Hoang" to the trip collaborators list with role "EDITOR"
    And sends a real-time notification to the trip owner
  ```

---

### 4. Kiến trúc Hệ thống 5 Tầng (The 5-Tier Architecture)

Nomadix áp dụng kiến trúc **Microservice-ready Modular Monolith**, chia tách hệ thống thành 5 tầng độc lập:

```
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 1: CLIENT PRESENTATION (REACT NATIVE)               │
│ Screens, Atomic Components, Zustand Stores, React Native Maps          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS / Bearer JWT Token
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│            TIER 2: API GATEWAY & SECURITY MIDDLEWARE (EXPRESS)         │
│ Helmet, CORS, Redis Rate Limiter, Joi/Zod Input DTOs, Auth Guard       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Validated Data Transfer Objects
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             TIER 3: CORE DOMAIN & APPLICATION SERVICE LAYER            │
│ AuthService, ItineraryService, DebtSimplificationEngine, Gamification  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Business Operations
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│               TIER 4: ADAPTER & EXTERNAL INTEGRATION LAYER             │
│ DuffelAPI (Flights), Amadeus (Hotels), CurrencyRate, Cloudinary        │
│ (Equipped with Circuit Breaker & Resilient Mock Fallbacks)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Storage Operations
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│              TIER 5: POLYGLOT PERSISTENCE LAYER (3 ENGINES)            │
│   PostgreSQL 16 (ACID)   │  MongoDB Atlas 7 (Documents)  │  Redis 7    │
└──────────────────────────┴───────────────────────────────┴─────────────┘
```

#### Nguyên tắc cốt lõi:
- **Tầng trên chỉ gọi tầng dưới, không bao giờ gọi ngược lại.**
- **Controllers không chứa nghiệp vụ logic:** Controller chỉ nhận request, chuyển cho Service xử lý và trả về HTTP response.
- **Services không trực tiếp gõ câu lệnh SQL/NoSQL:** Service gọi qua Repositories để trừu tượng hoá việc lưu trữ.

---

### 5. Bài tập Thực hành cho Học sinh (Hands-on Challenge)

1. **Bài tập 1.1:** Tự cài đặt một hàm kiểm tra định dạng email `isValidEmail(email)` bằng TDD:
   - Viết test với các trường hợp: email hợp lệ, thiếu `@`, thiếu tên miền, chứa khoảng trắng.
   - Viết hàm cài đặt để tất cả test chuyển sang màu xanh.
2. **Bài tập 1.2:** Hãy vẽ lại sơ đồ tuần tự (Sequence Diagram) thể hiện hành trình của 1 người dùng từ lúc bấm nút "Book Stay" trên ứng dụng di động đến khi dữ liệu được ghi vào cơ sở dữ liệu.
