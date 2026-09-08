# 08. Detailed Specifications: Collaborative Planning & Group Expense Management

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Program:** BSc (Hons) Computing  
**Module Focus:** Epic 7 (Collaborative Companion Planning) & Epic 8 (Group Expense Hub & Bill Splitting)  
**Methodology:** Agile / Scrum with Behavior-Driven Development (BDD Gherkin Syntax)  
**Traceability Mapping:** FR-36 to FR-42 | UC-20, UC-21, UC-22 | ISO/IEC 25010 Standards  

---

## 1. TỔNG QUAN NGHIỆP VỤ & MÔ HÌNH TOÁN HỌC (EXECUTIVE SUMMARY)

Module **Collaborative Planning & Group Expense Management** giải quyết triệt để hai rào cản lớn nhất khi đi du lịch nhóm:
1. **Lên kế hoạch rời rạc (Fragmented Planning):** Cho phép bạn bè cùng tham gia vào một chuyến đi, cùng xem chung lịch trình trên bản đồ số, cùng thêm/sửa địa điểm và phân quyền rõ ràng (`owner`, `editor`, `viewer`).
2. **Áp lực & Rắc rối chia tiền (Awkward Expense Splitting):** Cho phép thành viên chụp và lưu trữ hóa đơn (bill receipt) trực tiếp qua Cloudinary, ghi nhận ai đã trả tiền, chia đều hoặc chia theo phần trăm/số tiền thực tế, và tự động chạy **Thuật toán Tối ưu hóa Công nợ (Greedy Debt Simplification)** để giảm thiểu số lượng giao dịch chuyển khoản giữa các thành viên.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        NOMADIX GROUP COLLABORATION & EXPENSE HUB                       │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ Collaborative Workspace       │ Shared Itinerary Document (MongoDB `collaborators[]`)  │
│                               │ Relational Membership & Access Control (`trip_members`)│
│                               │ Real-time / Polling Sync across multi-device clients   │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ Cloud Bill & Receipt Ledger   │ Cloudinary Secured Storage (`/nomadix/receipts/...`)   │
│                               │ PostgreSQL ACID Relational Ledger (`trip_expenses`)    │
│                               │ Split Allocations Breakdown (`trip_expense_splits`)    │
├───────────────────────────────┼────────────────────────────────────────────────────────┤
│ Debt Simplification Engine    │ Greedy Min-Cashflow Transaction Optimization Algorithm │
│                               │ Zero-Sum Balance Integrity: Σ NetBalances = 0          │
│                               │ Settlement Audit Trail (`trip_settlements`)            │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. EPIC 7: COLLABORATIVE COMPANION PLANNING (CHI TIẾT BDD SCENARIOS)

```
┌─────────────┬─────────────────────────────────────────────────┬──────────┬───────────┐
│ Story ID    │ User Story Title                                │ Priority │ Est. Pts  │
├─────────────┼─────────────────────────────────────────────────┼──────────┼───────────┤
│ US-COLLAB-01│ Mời bạn bè tham gia chuyến đi qua Email/Code    │ MUST     │ 5 Pts     │
│ US-COLLAB-02│ Quản lý vai trò & phân quyền thành viên         │ MUST     │ 5 Pts     │
│ US-COLLAB-03│ Đồng bộ dữ liệu lịch trình nhóm cùng thấy       │ MUST     │ 8 Pts     │
│ US-COLLAB-04│ Xử lý xung đột khi nhiều người cùng sửa         │ SHOULD   │ 5 Pts     │
└─────────────┴─────────────────────────────────────────────────┴──────────┴───────────┘
```

### `US-COLLAB-01`: Mời bạn bè tham gia chuyến đi qua Email / Username / Mã mời

* **Mã nghiệp vụ:** `US-COLLAB-01` (Traces to `FR-36`)
* **Tác nhân:** Chủ chuyến đi (`Trip Owner`)
* **Mô tả:** Là người tổ chức chuyến đi, tôi muốn mời bạn bè tham gia bằng email, username hoặc gửi mã mời 6 ký tự để bạn bè có thể tham gia vào kế hoạch du lịch chung.

#### Kịch bản BDD:
```gherkin
Scenario: Owner invites friend via valid email address
  Given người dùng "Đức" (UUID: "user-duc-01") là Owner của chuyến đi "Đà Nẵng 3N2Đ" (Trip ID: "trip-dn-101")
  When Đức gửi lời mời tới email "nam.tran@nomadix.com" với vai trò "editor"
  Then hệ thống tìm thấy tài khoản của "Nam Trần" trong bảng users của PostgreSQL
    And tạo một bản ghi mới trong bảng trip_members:
      | trip_id      | user_id      | role   | status   |
      | trip-dn-101  | user-nam-02  | editor | accepted |
    And cập nhật mảng collaborators trong MongoDB itineraries:
      | userId       | role   | joinedAt             |
      | user-nam-02  | editor | 2026-11-15T08:00:00Z |
    And trả về mã HTTP 201 Created kèm thông tin thành viên mới
    And gửi thông báo mời tới thiết bị của Nam Trần
```

```gherkin
Scenario: Prevent inviting a non-existent email
  Given người dùng "Đức" đang ở màn hình Quản lý thành viên chuyến đi
  When Đức nhập email chưa đăng ký "unknown_user@random.com"
  Then hệ thống trả về mã lỗi HTTP 404 Not Found
    And thông báo giao diện: "Không tìm thấy người dùng với email này trên hệ thống Nomadix"
    And không tạo bản ghi nào trong cơ sở dữ liệu
```

---

### `US-COLLAB-02`: Quản lý vai trò & phân quyền thành viên (`owner`, `editor`, `viewer`)

* **Mã nghiệp vụ:** `US-COLLAB-02` (Traces to `FR-36`, `FR-31`)
* **Tác nhân:** `Trip Owner`, `Trip Editor`, `Trip Viewer`
* **Quy tắc phân quyền:**
  * **`owner`:** Toàn quyền thêm/xóa thành viên, đổi quyền, chỉnh sửa lịch trình, ghi nhận chi phí, xóa chuyến đi.
  * **`editor`:** Xem lịch trình, thêm/xóa/sắp xếp địa điểm, tải lên hóa đơn, ghi nhận khoản chi, tham gia chia tiền.
  * **`viewer`:** Chỉ xem lịch trình và bảng chi tiêu, không được thêm/sửa/xóa bất kỳ dữ liệu nào.

#### Kịch bản BDD:
```gherkin
Scenario: Editor successfully adds a new landmark to shared day schedule
  Given người dùng "Nam" có vai trò "editor" trong chuyến đi "Đà Nẵng 3N2Đ"
  When Nam thêm địa điểm "Chùa Linh Ứng" vào Ngày 2
  Then hệ thống chấp thuận quyền và chèn điểm đến vào mảng days[1].items trong MongoDB
    And phản hồi HTTP 200 OK với dữ liệu cập nhật
```

```gherkin
Scenario: Viewer attempts to delete an activity (Permission Denied)
  Given người dùng "Lan" có vai trò "viewer" trong chuyến đi "Đà Nẵng 3N2Đ"
  When Lan gửi yêu cầu DELETE /api/v1/itineraries/trip-dn-101/days/1/items/item-05
  Then hệ thống từ chối yêu cầu và trả về HTTP 403 Forbidden
    And thông báo lỗi: "Bạn chỉ có quyền xem, không được phép chỉnh sửa chuyến đi này"
```

---

### `US-COLLAB-03`: Đồng bộ dữ liệu lịch trình nhóm cùng thấy (Real-Time Shared Sync)

* **Mã nghiệp vụ:** `US-COLLAB-03` (Traces to `FR-37`)
* **Mô tả:** Khi một thành viên chỉnh sửa thứ tự hoặc thêm địa điểm mới, tất cả các thành viên khác khi xem chuyến đi đều thấy dữ liệu đồng nhất.

#### Kịch bản BDD:
```gherkin
Scenario: Synchronized Shared View across Multi-Device Companions
  Given Đức và Nam đều đang mở chuyến đi "Đà Nẵng 3N2Đ" trên hai điện thoại khác nhau
  When Đức kéo thẻ "Bảo tàng Chăm" lên trước "Cầu Rồng" và lưu lại
  Then phiên bản document MongoDB tăng lên (__v = __v + 1)
  When thiết bị của Nam kích hoạt đồng bộ (hoặc kéo vuốt làm mới / sync poll)
  Then giao diện của Nam lập tức cập nhật thứ tự mới: ① Bảo tàng Chăm, ② Cầu Rồng
    And bản đồ Google Maps trên máy của Nam vẽ lại lộ trình chính xác theo thứ tự mới
```

---

## 3. EPIC 8: GROUP EXPENSE HUB & BILL SPLITTING (CHI TIẾT BDD SCENARIOS)

```
┌─────────────┬─────────────────────────────────────────────────┬──────────┬───────────┐
│ Story ID    │ User Story Title                                │ Priority │ Est. Pts  │
├─────────────┼─────────────────────────────────────────────────┼──────────┼───────────┤
│ US-EXP-01   │ Tải lên hóa đơn chi tiêu đính kèm qua Cloudinary│ MUST     │ 5 Pts     │
│ US-EXP-02   │ Ghi nhận khoản chi tiêu nhóm đa danh mục        │ MUST     │ 5 Pts     │
│ US-EXP-03   │ Chia tiền linh hoạt: Đều, Số tiền & Phần trăm   │ MUST     │ 8 Pts     │
│ US-EXP-04   │ Bảng tổng hợp chi phí & Số dư ròng thành viên   │ MUST     │ 5 Pts     │
│ US-EXP-05   │ Thuật toán cân bằng công nợ tối ưu (Greedy)     │ MUST     │ 8 Pts     │
│ US-EXP-06   │ Xác nhận thanh toán & Quyết toán công nợ        │ MUST     │ 5 Pts     │
└─────────────┴─────────────────────────────────────────────────┴──────────┴───────────┘
```

### `US-EXP-01`: Tải lên hóa đơn chi tiêu đính kèm qua Cloudinary

* **Mã nghiệp vụ:** `US-EXP-01` (Traces to `FR-38`)
* **Tác nhân:** `Trip Companion` (Owner / Editor)
* **Mô tả:** Cho phép chụp hoặc chọn ảnh hóa đơn ăn uống, khách sạn, vé tham quan để lưu trữ bằng chứng chi tiêu minh bạch cho cả nhóm.

#### Kịch bản BDD:
```gherkin
Scenario: Uploading bill receipt image successfully
  Given người dùng "Đức" đang tạo khoản chi "Bữa tối Hải sản Bé Mặn"
  When Đức đính kèm file ảnh hóa đơn "receipt_haisan.jpg" dung lượng 2.4MB
  Then hệ thống tự động tải ảnh lên Cloudinary thư mục "nomadix/receipts/trip-dn-101"
    And áp dụng định dạng WebP tối ưu dung lượng
    And nhận về đường dẫn an toàn "https://res.cloudinary.com/nomadix/image/upload/v1/receipts/trip-dn-101/rec_01.webp"
    And gán URL này vào trường receipt_url của khoản chi
```

---

### `US-EXP-02` & `US-EXP-03`: Ghi nhận khoản chi & Chia tiền linh hoạt

* **Mã nghiệp vụ:** `US-EXP-02`, `US-EXP-03` (Traces to `FR-39`, `FR-40`)
* **Mô tả:** Ghi nhận khoản tiền, người ứng trước (`paidBy`), phân loại danh mục và áp dụng phương thức chia tiền (Chia đều, Chia theo phần trăm hoặc Chia theo số tiền cố định).

#### Kịch bản BDD:
```gherkin
Scenario: Split bill equally among all 3 members (Happy Path)
  Given chuyến đi có 3 thành viên: Đức (ID: 1), Nam (ID: 2), Hoa (ID: 3)
  When Đức chi "1.200.000 VND" cho bữa ăn hải sản và chọn chia đều cho cả 3 người
  Then hệ thống tạo bản ghi trong bảng trip_expenses:
    | id | trip_id | payer_id | amount    | category | description            |
    | 50 | 101     | 1        | 1200000.00| food     | "Hải sản Bé Mặn tối N1"|
    And tạo 3 bản ghi trong bảng trip_expense_splits:
      | expense_id | user_id | split_amount | split_percentage |
      | 50         | 1       | 400000.00    | 33.333           |
      | 50         | 2       | 400000.00    | 33.333           |
      | 50         | 3       | 400000.00    | 33.333           |
    And tổng số tiền chia bằng đúng 1.200.000 VND (400k + 400k + 400k = 1.2M)
```

```gherkin
Scenario: Split bill by exact custom amounts
  Given tiền thuê xe máy 2 ngày tổng cộng "300.000 VND" do Nam trả
    And chỉ có Đức và Nam thuê xe (Hoa đi taxi riêng)
  When Nam chọn phương thức chia theo số tiền: Đức trả "150.000 VND", Nam trả "150.000 VND", Hoa trả "0 VND"
  Then hệ thống kiểm tra tổng các khoản chia: 150.000 + 150.000 = 300.000 VND (Hợp lệ)
    And tạo bản ghi chi tiêu với người nợ chỉ bao gồm Đức (150k) và Nam (150k)
    And số dư của Hoa hoàn toàn không bị ảnh hưởng
```

```gherkin
Scenario: Rejection when custom split sum does not match total amount (Validation Error)
  Given tổng hóa đơn là "500.000 VND"
  When người dùng nhập số tiền chia: Đức 200.000 VND, Nam 200.000 VND (Tổng = 400.000 VND)
  Then hệ thống chặn lưu dữ liệu và trả về mã HTTP 422 Unprocessable Entity
    And thông báo lỗi: "Tổng số tiền các thành viên (400.000 VND) phải bằng đúng tổng hóa đơn (500.000 VND)"
```

---

### `US-EXP-04`: Bảng tổng hợp chi phí & Số dư ròng thành viên (Net Balance Sheet)

* **Mã nghiệp vụ:** `US-EXP-04` (Traces to `FR-41`)
* **Công thức toán học:**
  * Với mỗi thành viên $i$:
    $$\text{TotalPaid}_i = \sum \text{Amount of expenses where Payer} = i$$
    $$\text{TotalOwed}_i = \sum \text{SplitAmount of splits where User} = i$$
    $$\text{NetBalance}_i = \text{TotalPaid}_i - \text{TotalOwed}_i$$
  * Định lý bảo toàn số dư nhóm:
    $$\sum_{i=1}^N \text{NetBalance}_i = 0$$

#### Kịch bản BDD:
```gherkin
Scenario: Calculation of Group Net Balances after Multiple Expenses
  Given chuyến đi gồm 3 người: Đức, Nam, Hoa với các chi tiêu sau:
    | Người chi | Số tiền     | Mục đích         | Thành viên chia đều |
    | Đức       | 1.200.000   | Bữa ăn hải sản   | Đức, Nam, Hoa       |
    | Nam       | 600.000     | Vé tham quan     | Đức, Nam, Hoa       |
    | Hoa       | 300.000     | Cà phê tráng miệng| Đức, Nam, Hoa      |
  When hệ thống tính toán bảng tổng kết chi phí
  Then tổng chi phí chuyến đi là 2.100.000 VND (Bình quân 700.000 VND/người)
    And số dư ròng của từng thành viên được tính chính xác:
      - Đức: Đã trả 1.200.000 - Phải chịu 700.000 = +500.000 VND (Được nhận lại)
      - Nam: Đã trả 600.000 - Phải chịu 700.000 = -100.000 VND (Đang nợ)
      - Hoa: Đã trả 300.000 - Phải chịu 700.000 = -400.000 VND (Đang nợ)
    And tổng số dư cả nhóm bằng 0: (+500k) + (-100k) + (-400k) = 0 VND
```

---

### `US-EXP-05`: Thuật toán cân bằng công nợ tối ưu (Greedy Debt Simplification)

* **Mã nghiệp vụ:** `US-EXP-05` (Traces to `FR-42`)
* **Mục tiêu thuật toán:** Giảm thiểu số lần chuyển tiền từ mạng lưới $O(N^2)$ giao dịch nợ chéo xuống tối đa $N-1$ giao dịch chuyển khoản trực tiếp.
* **Nguyên lý:**
  1. Phân loại thành viên thành hai tập hợp:
     * Tập Con Nợ (Debtors): Những người có $\text{NetBalance} < 0$.
     * Tập Chủ Nợ (Creditors): Những người có $\text{NetBalance} > 0$.
  2. Tại mỗi bước tham lam (Greedy Step), lấy người nợ nhiều nhất ghép với người được nhận nhiều nhất:
     $$\text{SettlementAmount} = \min(|\text{MaxDebtor.Balance}|, \text{MaxCreditor.Balance})$$
  3. Ghi nhận giao dịch: `MaxDebtor` chuyển `SettlementAmount` cho `MaxCreditor`.
  4. Cập nhật số dư và lặp lại cho đến khi toàn bộ số dư bằng 0.

#### Kịch bản BDD:
```gherkin
Scenario: Debt Simplification generates minimal payment transactions
  Given bảng số dư: Đức (+500.000), Nam (-100.000), Hoa (-400.000)
  When hệ thống chạy thuật toán Greedy Debt Simplification
  Then hệ thống sinh ra danh sách hướng dẫn chuyển tiền tối ưu chỉ gồm 2 giao dịch:
    | Giao dịch | Người gửi (Debtor) | Người nhận (Creditor) | Số tiền       |
    | 1         | Hoa                | Đức                   | 400.000 VND   |
    | 2         | Nam                | Đức                   | 100.000 VND   |
    And không có bất kỳ giao dịch trung gian nào giữa Nam và Hoa
```

---

### `US-EXP-06`: Xác nhận thanh toán & Quyết toán công nợ (Settle Up)

* **Mã nghiệp vụ:** `US-EXP-06` (Traces to `FR-42`)
* **Mô tả:** Cho phép ghi nhận việc thanh toán nợ ngoài đời thực (chuyển khoản ngân hàng hoặc tiền mặt) và đánh dấu trạng thái hoàn tất để số dư trở về 0.

#### Kịch bản BDD:
```gherkin
Scenario: Settle up payment confirmation updates debt status
  Given Hoa nợ Đức 400.000 VND theo kế hoạch quyết toán
  When Hoa thực hiện chuyển khoản cho Đức và bấm "Đã chuyển tiền" trên ứng dụng
  Then hệ thống tạo bản ghi trong bảng trip_settlements với status = "pending_confirmation"
  When Đức kiểm tra tài khoản ngân hàng và bấm nút "Xác nhận đã nhận đủ tiền"
  Then hệ thống cập nhật status = "completed" trong trip_settlements
    And số dư nợ của Hoa đối với Đức giảm từ -400.000 VND về 0 VND
    And số dư được nhận của Đức giảm từ +500.000 VND xuống còn +100.000 VND
    And gửi thông báo chúc mừng hoàn tất thanh toán cho cả hai thành viên
```

---

## 4. MA TRẬN TRUY XUẤT YÊU CẦU & KIỂM THỬ (MODULE 7 RTM)

| Story ID | Tên Chức Năng | FR Liên Quan | API Endpoint | Bảng Dữ Liệu | Mã Test Case |
|---|---|---|---|---|---|
| `US-COLLAB-01` | Mời thành viên | `FR-36` | `POST /api/v1/itineraries/:id/members` | PostgreSQL `trip_members`, Mongo `collaborators` | `TC-COL-01` |
| `US-COLLAB-02` | Phân quyền vai trò | `FR-36`, `FR-31`| `PATCH /api/v1/itineraries/:id/members/:uid` | PostgreSQL `trip_members.role` | `TC-COL-02` |
| `US-COLLAB-03` | Đồng bộ lịch trình | `FR-37` | `GET /api/v1/itineraries/:id/sync` | MongoDB `itineraries.__v` | `TC-COL-03` |
| `US-EXP-01` | Tải lên hóa đơn | `FR-38` | `POST /api/v1/trips/:id/expenses/receipt` | Cloudinary Storage | `TC-EXP-01` |
| `US-EXP-02` | Ghi nhận chi tiêu | `FR-39` | `POST /api/v1/trips/:id/expenses` | PostgreSQL `trip_expenses` | `TC-EXP-02` |
| `US-EXP-03` | Chia tiền linh hoạt| `FR-40` | `POST /api/v1/trips/:id/expenses` | PostgreSQL `trip_expense_splits` | `TC-EXP-03` |
| `US-EXP-04` | Bảng số dư ròng | `FR-41` | `GET /api/v1/trips/:id/expenses/summary` | Query Aggregation | `TC-EXP-04` |
| `US-EXP-05` | Cân bằng công nợ | `FR-42` | `GET /api/v1/trips/:id/debts/settlement-plan` | Greedy Algorithm Engine | `TC-EXP-05` |
| `US-EXP-06` | Quyết toán nợ | `FR-42` | `POST /api/v1/trips/:id/debts/settle` | PostgreSQL `trip_settlements` | `TC-EXP-06` |
