# Day 3 — Use Case Analysis & Specification

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Milestone:** `D3 - Use Case Analysis` / `W1 - Requirements & Analysis`  
**Branch:** `docs/use-cases`  

---

## 📑 DANH MỤC TÀI LIỆU USE CASE (DELIVERABLES INDEX)

Thư mục này chứa đầy đủ hồ sơ phân tích hành vi người dùng và mô hình hóa Use Case cho hệ thống Nomadix:

| Mã Tài Liệu | Tên Tài Liệu | Nội Dung Cốt Lõi |
|---|---|---|
| **D3-01** | [**`01-actors-and-use-cases.md`**](./01-actors-and-use-cases.md) | Phân loại **5 nhóm Tác nhân hệ thống** (`Traveler`, `Trip Companion`, `Experienced Traveler`, `Administrator`, `External APIs`), sơ đồ kế thừa Class Diagram và Danh mục 22 Use Cases tổng thể. |
| **D3-02** | [**`02-use-case-diagrams.md`**](./02-use-case-diagrams.md) | **Sơ đồ Use Case tổng thể** và **7 sơ đồ phân rã theo module** (bao gồm Kế hoạch Nhóm & Chi tiêu) vẽ bằng cú pháp chuẩn **Mermaid UML** thể hiện các quan hệ `<<include>>` và `<<extend>>`. |
| **D3-03** | [**`03-use-case-specifications.md`**](./03-use-case-specifications.md) | **Đặc tả chi tiết 10 Use Cases trọng điểm** (`UC-01` đến `UC-10`) với đầy đủ Trigger, Pre-conditions, Post-conditions, Main Flow, Alternative Flows và Exception Flows. |

---

## 🎭 TỔNG KẾT MỐI QUAN HỆ CỐT LÕI (CORE RELATIONSHIPS)

* **Check-in Địa danh** `<<include>>` **Xác thực GPS Geofencing ($\le 100\text{m}$)**
* **Check-in Địa danh** `<<include>>` **Chụp ảnh có Watermark & Upload Cloudinary**
* **Check-in Địa danh** `<<include>>` **Làm bài Trắc nghiệm văn hóa (Quiz)**
* **Làm Quiz & Tích lũy XP** `<<extend>>` **Mở khóa Huy hiệu Thành phố (City Badge)**
* **Đăng câu trả lời Diễn đàn** `<<extend>>` **Tự động gắn nhãn "City Verified" (nếu có Huy hiệu)**
* **Ghi nhận Chi tiêu Nhóm** `<<include>>` **Chia tiền linh hoạt (Đều / Phần trăm / Số tiền)**
* **Ghi nhận Chi tiêu Nhóm** `<<extend>>` **Tải ảnh Hóa đơn đính kèm Cloudinary**
* **Xem Bảng Số Dư Nhóm** `<<include>>` **Thuật toán Tối ưu hóa Công nợ (Greedy Debt Simplification)**
* **Tìm kiếm Chuyến bay/Khách sạn** `<<include>>` **Kiểm tra Redis Cache & Chuẩn hóa dữ liệu**

---

## 🔄 BƯỚC TIẾP THEO (DAY 4 TRANSITION)

Với mô hình Use Case hoàn chỉnh, **Day 4 (D4 - System Architecture)** sẽ thiết kế:
1. Kiến trúc phân tầng Clean Layered Architecture (Client ➔ Controller ➔ Service ➔ Repository ➔ DB).
2. Sơ đồ thành phần tương tác (Component & Sequence Diagrams).
3. Luồng dữ liệu tích hợp Google Maps, Cloudinary và OTA APIs.
