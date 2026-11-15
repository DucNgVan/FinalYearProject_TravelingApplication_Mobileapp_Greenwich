# NOMADIX SOFTWARE ENGINEERING CURRICULUM
## Giáo Trình Đào Tạo Kỹ Sư Phần Mềm Full-Stack: Xây Dựng Nền Tảng Du Lịch Thông Minh

> **Mục tiêu giáo trình:** Dẫn dắt một học sinh / sinh viên từ trình độ cơ bản về lập trình từng bước làm chủ toàn bộ tư duy kỹ thuật, kiến trúc hệ thống, thuật toán cốt lõi, quy trình kiểm thử và xây dựng thành công ứng dụng du lịch thông minh **Nomadix** đạt tiêu chuẩn Production-grade.

---

### 🗺️ BẢN ĐỒ LỘ TRÌNH 5 TẬP (THE 5-VOLUME ROADMAP)

> 🌟 **KIM CHỈ NAM HỆ THỐNG:** Trước khi bắt đầu chi tiết từng tập, hãy nghiên cứu kỹ **[Cẩm Nang Toàn Diện Workflow Hệ Thống (Master End-to-End Project Workflow Blueprint)](./master-project-workflow.md)** để nắm trọn vẹn bức tranh luồng tín hiệu từ Mobile Client, Express Gateway, Polyglot Databases đến Third-Party APIs.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        LỘ TRÌNH ĐÀO TẠO KỸ SƯ NOMADIX                                  │
├─────────────────┬───────────────────────────────────────┬──────────────────────────────┤
│ TẬP GIÁO TRÌNH  │ TRỌNG TÂM KIẾN THỨC                   │ SẢN PHẨM ĐẦU RA              │
├─────────────────┼───────────────────────────────────────┼──────────────────────────────┤
│ 🗺️ WORKFLOW    │ Toàn Bộ Luồng Tín Hiệu & Quy Trình    │ • 7 Master Workflows Chi Tiết│
│    MASTER GUIDE │ Xuyên Suốt Hệ Thống Nomadix           │ • Sơ Đồ Mermaid & Polyglot DB│
├─────────────────┼───────────────────────────────────────┼──────────────────────────────┤
│ 📘 TẬP 1        │ Tư Duy Kỹ Sư, Kiến Trúc Hệ Thống      │ • Quy trình Solo XP & TDD    │
│                 │ & Phương Pháp Luận TDD                │ • Đặc tả 42 Yêu Cầu & Gherkin│
│                 │                                       │ • Sơ đồ 5-Tier Architecture  │
├─────────────────┼───────────────────────────────────────┼──────────────────────────────┤
│ 📙 TẬP 2        │ Hạ Tầng Polyglot Database             │ • Docker Compose (3 DBs)     │
│                 │ & Backend Modular Monolith            │ • PostgreSQL 28 bảng ACID    │
│                 │                                       │ • MongoDB Atlas & Redis RAM  │
│                 │                                       │ • Express API Gateway + JWT  │
├─────────────────┼───────────────────────────────────────┼──────────────────────────────┤
│ 📕 TẬP 3        │ Thuật Toán Cốt Lõi, Tài Chính Nhóm    │ • Thuật toán Greedy O(NlogN) │
│                 │ & Tích Hợp API Bên Thứ Ba             │ • Haversine GPS Radar        │
│                 │                                       │ • Duffel Flights & Amadeus   │
│                 │                                       │ • Circuit Breaker & Fallback │
├─────────────────┼───────────────────────────────────────┼──────────────────────────────┤
│ 📗 TẬP 4        │ Lập Trình Di Động React Native        │ • Cấu trúc Expo + React Native│
│                 │ & Executive Design System             │ • 6 Zustand Global Stores    │
│                 │                                       │ • Thẻ Boarding Pass 1:1      │
│                 │                                       │ • Wizard Lập kế hoạch 5 Bước │
├─────────────────┼───────────────────────────────────────┼──────────────────────────────┤
│ 📓 TẬP 5        │ Kiểm Thử Toàn Diện (Testing Pyramid), │ • 222 Test Suites 100% Green │
│                 │ DevOps & Đóng Gói Dự Án               │ • Zero Mock Data Architecture│
│                 │                                       │ • Python Clean Release Auto  │
└─────────────────┴───────────────────────────────────────┴──────────────────────────────┘
```

---

### 🎯 TRIẾT LÝ SƯ PHẠM (PEDAGOGICAL PRINCIPLES)

1. **Hiểu "Tại sao" trước khi gõ "Làm thế nào" (Architecture First):**
   - Học sinh thường vội vàng nhảy vào viết code mà không hiểu bối cảnh. Giáo trình này bắt buộc học sinh hiểu rõ bản chất vấn đề trước khi gõ phím.
2. **Kiểm thử dẫn đường (Test-Driven Development - TDD):**
   - Mọi chức năng đều bắt đầu bằng một bài test thất bại (**RED**), sau đó viết mã nguồn tối thiểu để test thành công (**GREEN**), và tối ưu hoá tái cấu trúc (**REFACTOR**).
3. **Tiêu chuẩn công nghiệp (No Toy Code):**
   - Tuyệt đối không dùng code tạm bợ. Từ kiểu dữ liệu tiền tệ `NUMERIC(12, 2)` đến mã vạch vé máy bay SVG hay thuật toán tối ưu hoá nợ đồ thị, mọi dòng code đều được xây dựng theo chuẩn mực kỹ thuật cao nhất.

---

### 📂 DANH MỤC CÁC TẬP TÀI LIỆU

- [**Cẩm Nang Toàn Diện Master Workflow Dự Án (Toàn Bộ Luồng Hệ Thống)**](./master-project-workflow.md)
- [**Tập 1: Tư Duy Kỹ Sư, Kiến Trúc Hệ Thống & Phương Pháp Luận TDD**](./vol-01-engineering-mindset-and-architecture.md)
- [**Tập 2: Hạ Tầng Polyglot Database & Backend Modular Monolith**](./vol-02-polyglot-persistence-and-backend.md)
- [**Tập 3: Thuật Toán Cốt Lõi, Tài Chính & Tích Hợp API Bên Thứ Ba**](./vol-03-core-algorithms-and-integrations.md)
- [**Tập 4: Lập Trình Di Động React Native & Executive Design System**](./vol-04-react-native-and-design-system.md)
- [**Tập 5: Kiểm Thử Toàn Diện, DevOps & Đóng Gói Dự Án**](./vol-05-testing-devops-and-delivery.md)
