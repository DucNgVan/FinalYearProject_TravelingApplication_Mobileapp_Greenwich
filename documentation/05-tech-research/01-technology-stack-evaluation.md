# 01. Technology Stack Justification & Evaluation Report

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** IEEE Software Technology Evaluation Framework  
**Academic Alignment:** Chapter 2 (Literature Review & Technology Justification)  
**Phase:** Day 5 — Technology Research & API Feasibility  

---

## 1. TỔNG QUAN ĐÁNH GIÁ CÔNG NGHỆ (EXECUTIVE SUMMARY)

Tài liệu này cung cấp các luận cứ khoa học, phân tích so sánh định lượng và lý do lựa chọn bộ công nghệ (Technology Stack) cho dự án **Nomadix**, phục vụ trực tiếp cho nội dung **Chapter 2 của Luận văn tốt nghiệp**:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   NOMADIX TECHNOLOGY STACK JUSTIFICATION               │
├─────────────────┬───────────────────────────┬──────────────────────────┤
│ Lớp Công Nghệ   │ Lựa Chọn Chính Thức       │ Đối Thủ So Sánh          │
├─────────────────┼───────────────────────────┼──────────────────────────┤
│ Mobile Frontend │ React Native (JavaScript) │ Flutter (Dart), Swift/KT │
│ Backend API     │ Node.js + Express.js      │ Java Spring Boot, Django │
│ Relational DB   │ PostgreSQL (ACID 3NF)     │ MySQL, Microsoft SQL     │
│ Document DB     │ MongoDB Atlas             │ Couchbase, DynamoDB      │
│ In-Memory Cache │ Redis                     │ Memcached, Hazelcast     │
│ Mapping SDK     │ Google Maps Platform      │ Mapbox, OpenStreetMap    │
│ Cloud Storage   │ Cloudinary                │ AWS S3, Firebase Storage │
└─────────────────┴───────────────────────────┴──────────────────────────┘
```

---

## 2. BIỆN LUẬN LỰA CHỌN CÔNG NGHỆ (DETAILED JUSTIFICATIONS)

---

### 2.1 Mobile Client: React Native vs. Flutter vs. Native (Swift/Kotlin)

| Tiêu chí so sánh | React Native (Lựa chọn) | Flutter (Google) | Native (Swift / Kotlin) |
|---|---|---|---|
| **Ngôn ngữ lập trình** | **JavaScript / TypeScript** (Đồng bộ với Backend) | Dart (Cần học thêm cú pháp mới) | Swift (iOS) + Kotlin (Android) |
| **Thời gian phát triển (5 tháng)** | **Rất nhanh** (Tái sử dụng $85-90\%$ code 2 nền tảng) | Nhanh | Rất chậm (Phải viết 2 codebase riêng) |
| **Hỗ trợ phần cứng (GPS, Camera)** | **Tuyệt vời** (Native Modules trưởng thành) | Tốt | Tốt nhất |
| **Hỗ trợ Bản đồ Google Maps** | **Rất mạnh** (`react-native-maps` chuẩn) | Tốt (`google_maps_flutter`) | Tốt |
| **Tối ưu hóa hiệu năng** | **Engine Hermes** (Khởi động $< 2\text{s}$, 60 FPS) | Impeller Engine | Cao nhất |

> **Quyết định học thuật:** Chọn **React Native** vì cho phép xây dựng ứng dụng di động đa nền tảng (iOS & Android) hoàn chỉnh trong thời hạn 5 tháng của đồ án FYP. Việc dùng chung ngôn ngữ JavaScript trên cả Client và Server giúp giảm thiểu ngữ cảnh chuyển đổi (Context Switching) và đồng bộ hóa các Schema dữ liệu JSON dễ dàng.

---

### 2.2 Backend API: Node.js + Express.js vs. Java Spring Boot vs. Python Django

| Tiêu chí so sánh | Node.js + Express (Lựa chọn) | Java Spring Boot | Python Django |
|---|---|---|---|
| **Mô hình I/O** | **Asynchronous Non-blocking I/O (Event Loop)** | Multi-threaded Blocking / WebFlux | Synchronous WSGI / ASGI |
| **Xử lý gọi đa API song song** | **Cực kỳ tối ưu** (`Promise.allSettled()`) | Tốt nhưng tốn RAM | Khá chậm khi gọi đồng thời |
| **Dung lượng bộ nhớ RAM** | **Rất nhẹ** (~80–120 MB RAM) | Nặng (~400–800 MB RAM) | Trung bình (~150–250 MB) |
| **Tốc độ phát triển REST API** | **Rất nhanh**, cú pháp tối giản | Chậm do nhiều cấu hình Boilerplate | Nhanh |

> **Quyết định học thuật:** Chọn **Node.js (Express.js)** vì kiến trúc **Non-blocking I/O (Bất đồng bộ)** là giải pháp hoàn hảo cho bài toán **Booking Aggregator** (Module 2). Server phải gửi đồng thời nhiều truy vấn tới các OTA APIs bên ngoài (Amadeus, RapidAPI, Mock) và đợi phản hồi mà không làm nghẽn luồng xử lý chính của người dùng khác.

---

### 2.3 Cơ Sở Dữ Liệu Đa Dạng (Polyglot Persistence): PostgreSQL + MongoDB + Redis

Hệ thống kết hợp 3 loại cơ sở dữ liệu để giải quyết 3 bài toán lưu trữ hoàn toàn khác biệt:

```text
PostgreSQL (Dữ liệu quan hệ chuẩn 3NF, Giao dịch ACID)
   ├── Bảng users & roles (Bảo mật tài khoản)
   ├── Bảng landmarks & checkins (Toàn vẹn quan hệ, chống check-in trùng lặp)
   └── Bảng badges, user_badges, quizzes (Quy tắc tính điểm & mở khóa chính xác 100%)

MongoDB Atlas (Dữ liệu tài liệu động, Mảng lồng nhau nhiều cấp)
   ├── Collection itineraries (Cấu trúc lịch trình: Chuyến đi ➔ Ngày ➔ Hoạt động ➔ Ghi chú)
   └── Collection forum_questions, forum_answers, comments (Cấu trúc thảo luận dạng cây lồng nhau)

Redis (Bộ nhớ đệm In-Memory siêu tốc)
   ├── Lưu cache kết quả tìm kiếm vé máy bay & khách sạn (Giảm tải API ngoài, phản hồi < 50ms)
   └── Rate limiting đếm số lượng request theo IP (Bảo mật chống DDoS)
```

---

### 2.4 Dịch Vụ Lưu Trữ Đám Mây & Bản Đồ: Google Maps & Cloudinary

1. **Google Maps Platform:**
   * Cung cấp thư viện bản đồ tương tác chuẩn mực nhất toàn cầu, độ chính xác tọa độ cao tại Việt Nam và Đông Nam Á.
   * Dịch vụ **Google Distance Matrix API** hỗ trợ tính toán khoảng cách thực tế trên đường bộ (Driving / Walking) thay vì chỉ đo đường chim bay.
2. **Cloudinary Media Service:**
   * Tích hợp đường ống nén tự động (Auto-compression WebP) và tối ưu hóa hình ảnh di động ngay tại rìa CDN (Edge delivery).
   * Giúp ứng dụng di động hiển thị ảnh địa danh, ảnh check-in có watermark và ảnh hóa đơn chi tiêu (Receipt Bills) sắc nét với dung lượng đường truyền tối thiểu ($< 300\text{KB}$/ảnh).

---

### 2.8 Thuật toán Cân bằng Công nợ: Greedy Minimum Cash-Flow vs. Pairwise Matrix

Khi nhiều thành viên cùng chi tiêu trong chuyến đi (Người trả tiền ăn, người trả tiền khách sạn, người trả tiền xăng xe...), bài toán chia nợ tạo ra một mạng lưới giao dịch chéo phức tạp:

| Tiêu chí | Pairwise Direct (Thông thường) | Greedy Min-Cashflow (Nomadix Lựa chọn) | Max-Flow Min-Cut (Đồ thị) |
|---|---|---|---|
| **Số giao dịch** | $O(N^2)$ (rất nhiều lần chuyển tiền) | **Tối đa $N-1$ giao dịch** (tối giản) | Tối ưu số tiền nhưng khó phân rã |
| **Độ phức tạp** | $O(1)$ cho mỗi giao dịch | **$O(N \log N)$** (rất nhanh trên Mobile/API) | $O(V \cdot E^2)$ (quá phức tạp) |
| **Trải nghiệm người dùng** | Gây rối mắt, dễ nhầm lẫn nợ chéo | **Rõ ràng, trực quan, 1 người chỉ trả 1-2 lần** | Phức tạp trong diễn giải |
| **Tính bảo toàn** | Không tự cân bằng nợ trung gian | **$\sum \text{NetBalance} = 0$ tuyệt đối** | Bảo toàn |

> **Kết luận học thuật:** Nomadix lựa chọn giải thuật **Greedy Minimum Cash-Flow** kết hợp hai hàng đợi ưu tiên (Max Heap Debtors & Max Heap Creditors) giúp giảm triệt để số giao dịch chuyển tiền cho nhóm bạn sau chuyến đi.

---

## 3. DANH SÁCH THƯ VIỆN REACT NATIVE CỐT LÕI (MOBILE CORE LIBRARIES)

```text
┌──────────────────────────────────────┬─────────────────────────────────┐
│ Thư viện Mobile                      │ Vai trò & Mục đích sử dụng      │
├──────────────────────────────────────┼─────────────────────────────────┤
│ @react-navigation/native (v6)        │ Quản lý điều hướng Stack & Tabs │
│ react-native-maps                    │ Bản đồ tương tác Google Maps    │
│ react-native-geolocation-service     │ Định vị GPS độ chính xác cao    │
│ react-native-vision-camera           │ Chụp ảnh check-in & hóa đơn bill│
│ react-native-image-picker            │ Chọn ảnh hóa đơn từ thư viện ảnh│
│ react-native-draggable-flatlist      │ Kéo-thả sắp xếp thứ tự lịch     │
│ react-native-fast-image              │ Lưu cache hình ảnh mượt mà      │
│ @react-native-async-storage          │ Lưu trữ token và cache cục bộ   │
│ axios                                │ Gọi REST API với Interceptors   │
└──────────────────────────────────────┴─────────────────────────────────┘
```
