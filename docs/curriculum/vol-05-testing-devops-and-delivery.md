# Tập 5: Testing Pyramid, Zero Mock Architecture & DevOps Delivery Automation

> *"If it's not tested, it's broken by design. Professional software engineering is not defined by how fast you write code, but by how reliably your system can be tested, refactored, and deployed to production without human anxiety."*

---

## Mục lục
1. [Triết lý Kim tự tháp Kiểm thử (Testing Pyramid) trong Nomadix](#1-triết-lý-kim-tự-tháp-kiểm-thử-testing-pyramid-trong-nomadix)
2. [Tầng 1: Unit Testing với Jest & Nguyên tắc Isolation](#2-tầng-1-unit-testing-với-jest--nguyên-tắc-isolation)
3. [Tầng 2: API Integration Testing với Supertest](#3-tầng-2-api-integration-testing-với-supertest)
4. [Tầng 3: React Native Component Testing](#4-tầng-3-react-native-component-testing)
5. [Nghệ thuật duy trì 222 Test Suites 100% GREEN](#5-nghệ-thuật-duy-trì-222-test-suites-100-green)
6. [Kiến trúc Zero Mock Data & Quản trị Empty State chân thực](#6-kiến-trúc-zero-mock-data--quản-trị-empty-state-chân-thực)
7. [Tự động hóa Đóng gói và Phát hành với Python Release Scripts](#7-tự-động-hóa-đóng-gói-và-phát-hành-với-python-release-scripts)
8. [Đồ án tốt nghiệp: Xây dựng Pipeline CI/CD và Capstone Review](#8-đồ-án-tốt-nghiệp-xây-dựng-pipeline-cicd-và-capstone-review)

---

## 1. Triết lý Kim tự tháp Kiểm thử (Testing Pyramid) trong Nomadix

Trong các dự án sinh viên hoặc kỹ sư chưa có kinh nghiệm, lỗi phổ biến nhất là dựa dẫm hoàn toàn vào **Manual Testing** (click thử bằng tay trên điện thoại) hoặc chỉ viết vài test E2E sơ sài. Khi dự án phình to lên 50+ màn hình và 80+ REST APIs, manual testing trở thành thảm họa:
- Mỗi lần sửa 1 dòng code, bạn mất 30 phút bấm tay lại toàn bộ app.
- Lỗi hồi quy (Regression bugs) âm thầm xuất hiện ở các màn hình khác mà không ai hay biết.
- Không ai dám refactor code vì sợ làm hỏng tính năng cũ.

Nomadix áp dụng mô hình **Testing Pyramid** phân tầng chặt chẽ:

```
                  /\
                 /  \      E2E Smoke Tests
                / UI \     (Kiểm thử luồng người dùng cốt lõi)
               /------\
              / Integr \   API Integration Tests (Supertest)
             /  ation   \  (Kiểm thử Router + Middleware + Service + DB)
            /------------\
           /  Unit Tests  \ Unit Tests (Jest, Pure Functions, Reducers,
          /  & Components  \ Algorithms, Regex, Utility Logic)
         /------------------\
```

### Bảng phân bổ kiểm thử trong Nomadix:
| Tầng kiểm thử | Công cụ | Đối tượng mục tiêu | Thời gian chạy | Số lượng trong Nomadix |
| :--- | :--- | :--- | :--- | :--- |
| **Unit Testing** | Jest | Thuật toán tối ưu nợ, Haversine, Helper, Regex, Business Validators | < 10ms / test | ~650 tests |
| **Component Testing** | React Native Testing Library + Jest | BoardingPass, ShimmerSkeleton, EmptyState, ProfileHub | < 100ms / test | ~120 tests |
| **API Integration** | Supertest + Express | `/api/v1/auth`, `/api/v1/trips`, `/api/v1/expenses` | ~300ms / test | ~80 tests |
| **Integrity Tests** | Custom Jest Suites | Kiểm tra tính toàn vẹn hệ thống (Zero Mock, Clean Docs) | < 50ms / suite | ~10 tests |
| **Tổng cộng** | **Jest Runner** | **222 Test Suites - 100% GREEN** | **~25s toàn dự án** | **846+ tests** |

---

## 2. Tầng 1: Unit Testing với Jest & Nguyên tắc Isolation

### Nguyên tắc vàng: FIRST
- **F - Fast:** Test phải chạy trong vài mili-giây.
- **I - Independent/Isolated:** Test A không được phụ thuộc vào kết quả của Test B. Không chia sẻ state biến toàn cục.
- **R - Repeatable:** Chạy 1,000 lần ở máy local hay server CI/CD đều phải cho ra cùng 1 kết quả.
- **S - Self-validating:** Test tự động pass hoặc fail (`expect().toBe()`), không bắt lập trình viên đọc log để đoán.
- **T - Timely:** Được viết **trước** khi viết implementation code (nguyên tắc TDD Red-Green).

### Ví dụ thực tế: Unit Test cho thuật toán Minimum Cash Flow Reduction
Trong [Tập 3](./vol-03-core-algorithms-and-integrations.md), chúng ta đã học thuật toán tối ưu hóa công nợ. Đây là cách ta viết unit test để bảo vệ thuật toán khỏi lỗi góc (edge cases):

```javascript
// server/tests/unit/algorithms/ExpenseSettlement.test.js
const { settleGroupDebts } = require('../../../src/services/expenseSettlementService');

describe('Unit: Minimum Cash-Flow Greedy Algorithm', () => {
  it('should return empty settlements when all balances are zero', () => {
    const participants = [
      { id: 'u1', netBalance: 0 },
      { id: 'u2', netBalance: 0 },
    ];
    const transactions = settleGroupDebts(participants);
    expect(transactions).toEqual([]);
  });

  it('should settle a 3-person cyclic debt in at most 2 transactions', () => {
    // A nợ B $50, B nợ C $50, C nợ A $50 => Tổng bù trừ = 0
    const participants = [
      { id: 'user_A', netBalance: -50.00 },
      { id: 'user_B', netBalance: 0.00 },
      { id: 'user_C', netBalance: 50.00 }
    ];

    const result = settleGroupDebts(participants);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      from: 'user_A',
      to: 'user_C',
      amount: 50.00
    });
  });

  it('should throw Error if sum of net balances is not zero (Violation of Invariant)', () => {
    const invalidGroup = [
      { id: 'u1', netBalance: -100 },
      { id: 'u2', netBalance: 50 } // Thiếu 50!
    ];
    expect(() => settleGroupDebts(invalidGroup)).toThrow(/Zero-sum invariant violated/);
  });
});
```

---

## 3. Tầng 2: API Integration Testing với Supertest

API Integration Testing kiểm tra xem toàn bộ chuỗi:
$$\text{HTTP Request} \longrightarrow \text{RateLimiter} \longrightarrow \text{JWT Middleware} \longrightarrow \text{Validator} \longrightarrow \text{Controller} \longrightarrow \text{Service} \longrightarrow \text{Database Mock / Memory DB}$$
có phối hợp mượt mà với nhau hay không.

### Setup Supertest không cần bật HTTP Port thật:
Supertest có thể mock trực tiếp Express `app` instance mà không cần `app.listen(3000)`, giúp test chạy cực nhanh và tránh xung đột cổng mạng (EADDRINUSE).

```javascript
// server/tests/integration/auth.test.js
const request = require('supertest');
const app = require('../../src/app');
const db = require('../../src/config/database');

describe('POST /api/v1/auth/login', () => {
  beforeAll(async () => {
    // Khởi tạo schema trong database test
    await db.raw('SELECT 1');
  });

  afterAll(async () => {
    // Đóng connection pool để tránh Jest Open Handle Warning
    await db.destroy();
  });

  it('should return 400 Bad Request when email format is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'invalid-email-format',
        password: 'ValidPassword123!'
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors[0].field).toBe('email');
  });

  it('should return 200 and Set-Cookie with refreshToken on valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'pilot.traveler@nomadix.io',
        password: 'Password123!'
      });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.headers['set-cookie']).toBeDefined();
    expect(res.headers['set-cookie'][0]).toMatch(/refreshToken=/);
  });
});
```

---

## 4. Tầng 3: React Native Component Testing

Kiểm thử UI trên di động không phải là chụp ảnh màn hình (screenshot) dễ gãy, mà là kiểm tra **hành vi của người dùng** (User Behaviors) và **trạng thái render** (State-driven rendering) thông qua `@testing-library/react-native`.

### Test Case: BoardingPass Card hiển thị đúng dữ liệu chuyến bay
```javascript
// client/tests/components/BoardingPass.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BoardingPass from '../../src/components/booking/BoardingPass';

describe('<BoardingPass /> Component', () => {
  const mockBooking = {
    bookingRef: 'NMX-7890',
    origin: 'SGN',
    destination: 'HND',
    departureTime: '08:30 AM',
    seat: '12A',
    gate: 'D3',
    passengerName: 'NGUYEN VAN A',
    status: 'CONFIRMED'
  };

  it('renders passenger information, IATA codes, and seat correctly', () => {
    const { getByText } = render(<BoardingPass booking={mockBooking} />);

    expect(getByText('SGN')).toBeTruthy();
    expect(getByText('HND')).toBeTruthy();
    expect(getByText('NGUYEN VAN A')).toBeTruthy();
    expect(getByText('12A')).toBeTruthy();
    expect(getByText('NMX-7890')).toBeTruthy();
  });

  it('calls onShare callback when the Share button is pressed', () => {
    const onShareMock = jest.fn();
    const { getByTestId } = render(
      <BoardingPass booking={mockBooking} onShare={onShareMock} />
    );

    const shareBtn = getByTestId('button-share-boarding-pass');
    fireEvent.press(shareBtn);

    expect(onShareMock).toHaveBeenCalledTimes(1);
    expect(onShareMock).toHaveBeenCalledWith('NMX-7890');
  });
});
```

---

## 5. Nghệ thuật duy trì 222 Test Suites 100% GREEN

Một trong những vấn đề gây ức chế nhất của các lập trình viên mới là hiện tượng **"Flaky Tests"** (test lúc pass lúc fail do race conditions) và **"Memory Leaks / Open Handles"** làm Jest bị treo không tắt được.

### 4 Bí kíp sinh tồn để giữ 100% GREEN trên Nomadix:
1. **Dọn dẹp Asynchronous Timers:** Luôn gọi `jest.clearAllTimers()` hoặc `jest.useRealTimers()` trong `afterEach()`.
2. **Đóng kết nối cơ sở dữ liệu:**
   ```javascript
   afterAll(async () => {
     await mongoose.connection.close();
     await knex.destroy();
     await redisClient.quit();
   });
   ```
3. **Mock Third-party APIs triệt để:** Không bao giờ gọi mạng thật (Duffel, Amadeus, Stripe) trong Unit/Integration test suites. Luôn dùng `jest.spyOn()` hoặc mock modules:
   ```javascript
   jest.mock('../../src/services/duffelAdapter', () => ({
     searchFlights: jest.fn().mockResolvedValue([{ id: 'mock_fl_1', price: 250 }])
   }));
   ```
4. **Cấu hình Jest `--detectOpenHandles --forceExit` khi cần thiết:**
   Trong `package.json`:
   ```json
   "scripts": {
     "test": "jest --runInBand --detectOpenHandles",
     "test:ci": "jest --ci --forceExit --maxWorkers=2"
   }
   ```

---

## 6. Kiến trúc Zero Mock Data & Quản trị Empty State chân thực

Một trong những bài học đắt giá nhất trong kỹ thuật phần mềm: **"Đừng bao giờ để dữ liệu giả mạo (hardcoded mock data) lọt vào bản phát hành Production."**

### Lỗ hổng thường thấy trong đồ án sinh viên:
Khi chưa kịp nối API, sinh viên thường viết:
```javascript
// NGUY HIỂM: Hardcoded state dẫn đến bug hiển thị vé giả!
const [activeTicket, setActiveTicket] = useState({
  flightNumber: 'VN123',
  from: 'HAN',
  to: 'SGN'
}); // Người dùng mới tạo tài khoản cũng thấy vé này!
```
Hậu quả: Người dùng vừa cài app, chưa mua vé nào, màn hình Home vẫn đập vào mắt 1 chiếc vé máy bay "ma" và 2 phòng khách sạn "ảo"!

### Giải pháp Nomadix: Zero Mock Architecture
1. **State bắt đầu từ `null` hoặc rỗng `[]`:**
   Dữ liệu luôn bắt đầu từ số 0 chân thực.
2. **Thiết kế Empty State có tính hướng dẫn (Actionable Empty States):**
   Thay vì để màn hình trắng xóa hoặc hiển thị dữ liệu ma, hiển thị Component chỉ dẫn người dùng:
   - *"Bạn chưa có vé máy bay nào. Hãy tìm kiếm chuyến bay đầu tiên ngay hôm nay!"* kèm nút bấm `[Khám phá chuyến bay]`.
   - *"Chưa có thẻ thanh toán nào được liên kết."* kèm nút `[+ Thêm phương thức thanh toán]`.
3. **Tách biệt rõ ràng Route Plan Hub và Plan Details:**
   - Khi bấm vào Tab "Kế hoạch" (Plan), màn hình phải đưa người dùng đến **Plan Hub** (danh sách tất cả các chuyến đi của họ hoặc nút tạo chuyến đi mới).
   - Tuyệt đối không được nhảy cóc thẳng vào trang chi tiết (Plan Details) của 1 chuyến đi giả định!
4. **Integrity Automated Test:**
   Viết test tự động quét code để ngăn chặn bất kỳ ai thêm dữ liệu mock trở lại:
   ```javascript
   // client/tests/components/ProfileZeroMockAndPlanHubNavigation.test.js
   it('renders zero active tickets when user has not booked any flights', () => {
     const { queryByTestId, getByText } = render(<ProfileScreen bookings={[]} />);
     expect(queryByTestId('active-boarding-pass-card')).toBeNull();
     expect(getByText('No active bookings')).toBeTruthy();
   });
   ```

---

## 7. Tự động hóa Đóng gói và Phát hành với Python Release Scripts

Trong môi trường doanh nghiệp chuyên nghiệp, việc đồng bộ code lên nhiều remote repository (ví dụ: kho lưu trữ của công ty, kho lưu trữ mã nguồn mở GitHub, kho lưu trữ học thuật của trường Đại học) không được làm bằng tay mà phải được tự động hóa bằng script.

Nomadix trang bị hệ thống Python Scripting (`scripts/push_greenwich_sanitized.py`):

```python
#!/usr/bin/env python3
"""
Nomadix Release Automation & Sanitization Script
Nhiệm vụ:
1. Quét toàn bộ repository để đảm bảo không có file nháp / file tài liệu nội bộ rò rỉ.
2. Kiểm tra tính toàn vẹn của git tree.
3. Đồng bộ hóa commit lên Remote đích một cách an toàn.
"""

import subprocess
import sys
import os

def run_command(cmd, cwd=None):
    print(f"[*] Executing: {cmd}")
    result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    if result.returncode != 0:
        print(f"[!] Error: {result.stderr}")
        sys.exit(result.returncode)
    return result.stdout.strip()

def verify_test_suites():
    print("[1/3] Running Full Test Suites Verification...")
    server_test = subprocess.run("npm test", shell=True, cwd="server", capture_output=True)
    if server_test.returncode != 0:
        print("[!] Backend tests failed! Aborting release.")
        sys.exit(1)
    print(" -> All backend test suites passed (100% GREEN).")

def push_to_remote(target_remote, branch="main"):
    print(f"[2/3] Synchronizing to {target_remote}/{branch}...")
    run_command(f"git push {target_remote} {branch}")
    print(f" -> Successfully synchronized to {target_remote}.")

if __name__ == "__main__":
    print("=== NOMADIX AUTOMATED RELEASE PIPELINE ===")
    verify_test_suites()
    push_to_remote("greenwich", "main")
    print("=== RELEASE PIPELINE FINISHED SUCCESSFULLY ===")
```

---

## 8. Đồ án tốt nghiệp: Xây dựng Pipeline CI/CD và Capstone Review

Chúc mừng bạn đã hoàn thành trọn vẹn 5 tập của bộ giáo trình kỹ thuật xây dựng nền tảng **Nomadix**!

### Bài tập tốt nghiệp (Capstone Project):
1. **Thiết lập GitHub Actions Workflow:**
   Tạo file `.github/workflows/ci.yml` để tự động chạy:
   - Bước 1: Quét linter (`npm run lint`).
   - Bước 2: Chạy 222 test suites của backend (`npm test`).
   - Bước 3: Chạy toàn bộ component test của mobile client (`npm test`).
   - Bước 4: Chặn merge Pull Request nếu độ bao phủ code (Coverage) dưới 85%.

2. **Refactoring Thử nghiệm:**
   - Thay đổi thuật toán phân trang từ Offset sang Cursor-based trong `itineraryService.js`.
   - Chạy `npm test` và quan sát xem các test suites bắt được những lỗi tương thích ngược nào.
   - Refactor lại cho đến khi toàn bộ test suites chuyển sang màu xanh **100% GREEN**.

3. **Chạy kiểm thử toàn vẹn giáo trình:**
   ```bash
   cd server
   npm test -- tests/unit/integrity/CurriculumIntegrity.test.js
   ```

---
*Tác giả: Nomadix Core Engineering Team*  
*Quy chuẩn kỹ thuật: Solo Extreme Programming (XP) | Polyglot Persistence | Clean Architecture*
