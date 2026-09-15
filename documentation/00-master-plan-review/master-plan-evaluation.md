# Đánh Giá Chuyên Sâu & Phân Tích Kế Hoạch 5 Tháng (Master Plan Review)

## Dự Án: NOMADIX — All-in-one Smart Travel Platform
**Loại hình:** Final Year Project (FYP) — University of Greenwich  
**Sinh viên thực hiện:** Nguyễn Văn Đức  
**Thời gian thực hiện:** 5 Tháng (20 Tuần / 140 Ngày)  
**Ngày đánh giá:** 25/08/2026  

---

## 1. TỔNG QUAN ĐÁNH GIÁ (EXECUTIVE SUMMARY)

| Tiêu chí | Đánh giá | Điểm số (Thang 10) | Nhận xét nhanh |
|---|---|:---:|---|
| **Tính khả thi (Feasibility)** | Rất Tốt | 9.0/10 | Lộ trình phân bổ hợp lý, đi từ Requirement → Design → Core → Feature → Polish. |
| **Tính học thuật & Kỹ thuật (Academic & Technical Depth)** | Xuất sắc | 9.5/10 | Có điểm nhấn kỹ thuật mạnh (Redis Benchmark, Adapter Pattern, Dual DB, GPS Geofencing). |
| **Mức độ kiểm soát rủi ro (Risk Management)** | Khá tốt | 8.0/10 | Đã nhận diện rủi ro OTA API và Fake GPS, nhưng cần bổ sung kế hoạch dự phòng sớm. |
| **Tính chuẩn mực quy trình (Software Engineering / Agile)** | Xuất sắc | 9.5/10 | Quy trình Git, Branching, Milestone, Issue và DoD rất bài bản, gây ấn tượng mạnh với Hội đồng. |

---

## 2. PHÂN TÍCH ĐIỂM MẠNH CỦA KẾ HOẠCH (STRENGTHS)

1. **Phân tầng thời gian chuẩn Agile & Engineering:**
   * **Month 1 (Analysis & Design):** Dành trọn vẹn 1 tháng đầu để chốt Requirements, UX/UI, Database và API Design trước khi code. Đây là điểm cộng lớn giúp tránh tình trạng "vừa code vừa sửa kiến trúc" (Refactoring trap).
   * **Month 2 (Foundation):** Xây dựng "Vertical Slice" đầu tiên (Auth + Profile + Database) để kiểm chứng luồng hoạt động giữa Frontend và Backend.
   * **Month 3 & Month 4 (Core Features & USP):** Tách bạch rõ giữa phần nghiệp vụ booking/itinerary và phần giá trị cốt lõi (Gamification + Community).
   * **Month 5 (Integration & Finalisation):** Không dồn việc sửa bug vào phút chót mà có tuần kiểm thử UAT, đo đạc Benchmark Redis và hoàn thiện Thesis.

2. **Điểm nhấn kỹ thuật rõ ràng cho báo cáo luận văn (Thesis Highlights):**
   * *Data Normalization Engine (Adapter Pattern):* Xử lý đa nguồn dữ liệu từ nhiều OTA APIs.
   * *Performance Benchmark (Redis Caching):* Có số liệu thực nghiệm định lượng (Response time có/không có cache) chứng minh tính khoa học.
   * *Dual-Database Architecture:* Phân chia rõ ràng dữ liệu quan hệ có cấu trúc (PostgreSQL) và dữ liệu động phi cấu trúc (MongoDB).

3. **Cơ chế quản lý tiến độ minh bạch (Traceability & Accountability):**
   * Mapping rõ ràng: `Day` ➔ `Issue`, `Week` ➔ `Milestone`, `Feature` ➔ `Branch`, `Change` ➔ `Commit`, `PR` ➔ `develop`.
   * Tạo bằng chứng phát triển liên tục (Git commit graph dày dặn) để trình bày cho Giảng viên hướng dẫn (Supervisor).

---

## 3. CÁC ĐIỂM THIẾU SÓT & RỦI RO TIỀM ẨN CẦN BỔ SUNG (GAPS & RISKS)

Mặc dù kế hoạch rất chi tiết, nhưng dưới góc độ phản biện đồ án tốt nghiệp, có **5 điểm rủi ro then chốt** cần được bổ sung ngay:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        5 RỦI RO THEN CHỐT CẦN LƯU Ý                    │
├──────────────────────────┬─────────────────────────────────────────────┤
│ 1. Rủi ro OTA APIs       │ Không có API key chính thức hoặc bị chặn CORS│
├──────────────────────────┼─────────────────────────────────────────────┤
│ 2. Đồng bộ Dual-Database │ Nguy cơ mất nhất quán giữa Postgres & Mongo │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 3. Kiểm thử GPS Mobile   │ Khó test GPS thực tế khi chạy Simulator     │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 4. Viết Thesis quá muộn  │ Dồn viết luận văn vào Tháng 5 gây quá tải   │
├──────────────────────────┼─────────────────────────────────────────────┤
│ 5. Phản hồi Supervisor   │ Thiếu các mốc Review định kỳ chính thức     │
└──────────────────────────┴─────────────────────────────────────────────┘
```

### Chi tiết từng rủi ro và giải pháp khắc phục:

### ⚠️ Rủi ro 1: Khả dụng của OTA APIs (Agoda, Booking, Skyscanner, Traveloka)
* **Vấn đề:** Các OTA lớn hiện nay hầu như không cấp Developer API miễn phí cho sinh viên cá nhân, hoặc yêu cầu chứng minh doanh nghiệp Affiliate với thủ tục xét duyệt hàng tháng.
* **Khắc phục:** 
  * Ngay trong **Week 1 Day 5** hoặc **Week 3**, phải tiến hành khảo sát các Public RapidAPI (như *Booking.com RapidAPI*, *Skyscanner RapidAPI*, *Amadeus Self-Service API* - Amadeus cấp 2000 free calls/tháng cho developer).
  * Xây dựng sẵn **Mock Data Provider Engine** ngay từ Week 9 với schema chuẩn xác, đảm bảo hệ thống chuyển đổi qua lại giữa Real API và Mock API chỉ bằng 1 biến môi trường `.env` (`USE_MOCK_BOOKING=true/false`).

### ⚠️ Rủi ro 2: Nhất quán dữ liệu giữa PostgreSQL và MongoDB (Dual DB)
* **Vấn đề:** PostgreSQL lưu `users` và `checkins`, trong khi MongoDB lưu `itineraries` và `forum_posts`. Khi xóa hoặc cập nhật user, dữ liệu liên kết bên Mongo có thể bị mồ côi (Orphaned data).
* **Khắc phục:** 
  * Quy định rõ `userId` (UUID kiểu string từ PostgreSQL) làm khóa ngoại tham chiếu trong MongoDB schema.
  * Thiết kế Service Layer đóng vai trò điều phối (Orchestrator) đảm bảo tính toàn vẹn dữ liệu.

### ⚠️ Rủi ro 3: Kiểm thử GPS và Camera trên Thiết bị di động
* **Vấn đề:** Chạy máy ảo (Android Emulator / iOS Simulator) không có camera thật và vị trí GPS cố định, gây khó khăn cho việc test tính năng Check-in & Geofence.
* **Khắc phục:** 
  * Tích hợp công cụ **Mock Location Injector** (chức năng giả lập tọa độ nội bộ trong chế độ Debug của app) để tester có thể chọn vị trí bất kỳ (ví dụ Cầu Rồng Đà Nẵng) trên Simulator.
  * Cài đặt chế độ Camera Debug (chọn ảnh có sẵn từ thư viện ảnh máy ảo khi không có camera phần cứng).

### ⚠️ Rủi ro 4: Kế hoạch viết Luận văn (Thesis Writing Cadence)
* **Vấn đề:** Nếu để toàn bộ việc viết luận văn vào Tháng 5 (Week 20), bạn sẽ bị quá tải vì vừa phải quay video demo, sửa bug, vừa viết 60–100 trang báo cáo tiếng Anh.
* **Khắc phục:** 
  * **Viết Thesis song song cuối mỗi tháng:**
    * Hết Tháng 1: Hoàn thành Chapter 1 (Introduction & Problem) + Chapter 2 (Literature Review & Technology) + Chapter 3 (Requirements & Analysis).
    * Hết Tháng 2: Hoàn thành Chapter 4 (System Architecture & Database Design).
    * Hết Tháng 3 & 4: Hoàn thành Chapter 5 (Implementation & Core Modules).
    * Tháng 5: Chỉ tập trung viết Chapter 6 (Testing & Evaluation), Chapter 7 (Conclusion) và hiệu đính (Proofreading).

### ⚠️ Rủi ro 5: Các mốc báo cáo với Giảng viên hướng dẫn (Supervisor Checkpoints)
* **Khắc phục:** Bổ sung cố định ngày **Chủ Nhật cuối mỗi Tuần (Weekly Review)** để tổng kết DoD và chuẩn bị Slide/Báo cáo ngắn cho Supervisor vào sáng Thứ Hai.

---

## 4. BẢNG MA TRẬN ĐỐI SOÁT CHUẨN ĐỒ ÁN GREENWICH (ASSESSMENT CRITERIA ALIGNMENT)

| Tiêu chuẩn Đồ án tốt nghiệp | Vị trí thể hiện trong Kế hoạch | Kết quả kỳ vọng |
|---|---|---|
| **Critical Thinking & Problem Identification** | Month 1 (Week 1 — Day 1, 2, 3) | Bộ tài liệu Scope, Problem Statement, FR/NFR và Use Case toàn diện. |
| **System Architecture & Technical Design** | Month 1 (Week 3, 4) & Month 2 (Week 5) | Kiến trúc Clean Layered Architecture, ERD chuẩn 3NF, Caching Pattern. |
| **Implementation Complexity & Code Quality** | Month 2, 3, 4 (Week 6 đến 16) | Fullstack React Native + Node.js Express + Dual DB + Adapter Pattern + Geofencing. |
| **Critical Evaluation & Scientific Testing** | Month 5 (Week 17, 18, 19) | Unit Test coverage, UAT feedback thực tế, Biểu đồ Benchmark hiệu năng Redis. |
| **Professionalism & Project Management** | Toàn bộ 20 tuần qua Git & Milestones | Git history minh bạch, Commit rõ ràng, Issue tracking đúng tiến độ Agile. |

---

## 5. KẾT LUẬN & HƯỚNG DẪN TRIỂN KHAI

Kế hoạch 5 tháng (20 tuần) của bạn là **rất chuẩn xác, chặt chẽ và có tính học thuật cao**. 

Toàn bộ các nhiệm vụ chi tiết từ **Week 1 đến Week 20** (với phân rã công việc từng Day cụ thể từ Day 1 đến Day 140) đã được tạo đầy đủ trong thư mục [`documentation/timeline/`](file:///Users/3o/Documents/Study/FYP/documentation/timeline).
