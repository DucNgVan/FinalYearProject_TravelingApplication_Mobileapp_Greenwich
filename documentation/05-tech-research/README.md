# Day 5 — Technology Research & API Feasibility

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Milestone:** `D5 - Technology Research` / `W1 - Requirements & Analysis`  
**Branch:** `docs/tech-research`  

---

## 📑 DANH MỤC TÀI LIỆU KHẢO SÁT CÔNG NGHỆ (DELIVERABLES INDEX)

Thư mục này chứa đầy đủ hồ sơ khảo sát công nghệ, đánh giá hạn ngạch API bên ngoài và thiết kế cỗ máy dữ liệu mẫu Mock Provider cho đồ án Nomadix:

| Mã Tài Liệu | Tên Tài Liệu | Nội Dung Cốt Lõi |
|---|---|---|
| **D5-01** | [**`01-technology-stack-evaluation.md`**](./01-technology-stack-evaluation.md) | **Báo cáo biện luận Tech Stack (Chapter 2 Thesis)**: Phân tích so sánh định lượng giữa React Native vs Flutter/Native, Node.js vs Spring Boot/Django, Kiến trúc Polyglot Database (PostgreSQL + MongoDB + Redis), **Thuật toán Cân bằng Công nợ Greedy Min-Cashflow** và các thư viện React Native phần cứng & xử lý ảnh hóa đơn. |
| **D5-02** | [**`02-api-feasibility-matrix.md`**](./02-api-feasibility-matrix.md) | **Ma trận khảo sát khả dụng API bên ngoài**: Chi tiết Endpoints, Hạn ngạch Quotas, Cơ chế Auth và Giải pháp quản lý rủi ro đối với Amadeus Sandbox (2,000 free calls), RapidAPI, Google Maps ($200 credit) và Cloudinary CDN lưu trữ ảnh địa danh & hóa đơn chi tiêu. |
| **D5-03** | [**`03-mock-provider-design.md`**](./03-mock-provider-design.md) | **Kiến trúc cỗ máy Mock Data Provider Engine**: Cơ chế tự động chuyển mạch Circuit Breaker khi API thật bị timeout/hết quota, cấu trúc dữ liệu mẫu các chuyến bay và khách sạn thật tại Việt Nam, giả lập độ trễ mạng $300\text{ms}$. |

---

## 🛡️ TỔNG KẾT BẢO ĐẢM HỌC THUẬT & AN TOÀN DEMO

1. **Không rủi ro chi phí:** Toàn bộ dịch vụ bên ngoài (Google Maps, Cloudinary, Amadeus, MongoDB Atlas) hoạt động trong giới hạn gói miễn phí dành cho sinh viên / Credit $200.
2. **Không rủi ro gián đoạn mạng:** Khi API thật gặp sự cố hoặc mất mạng, `MockProvider` tự động kích hoạt bảo đảm ứng dụng luôn chạy mượt mà $100\%$ trong mọi buổi thuyết trình và chấm thi.
3. **Sẵn sàng cho Luận văn:** Toàn bộ nội dung của `01-technology-stack-evaluation.md` được viết chuẩn văn phong học thuật tiếng Anh/Việt, chuyển thẳng thành Chapter 2 (Literature Review & Technology Evaluation) của Báo cáo tốt nghiệp.

---

## 🔄 BƯỚC TIẾP THEO (DAY 6 TRANSITION)

Với các khảo sát công nghệ và API đã hoàn tất, **Day 6 (D6 - Database Analysis & Preliminary ERD)** sẽ thực hiện:
1. Xây dựng Sơ đồ Quan hệ Thực thể (Preliminary ERD) chuẩn hóa 3NF cho PostgreSQL.
2. Thiết kế chi tiết Từ điển Dữ liệu (Data Dictionary) với kiểu dữ liệu, ràng buộc khóa chính/ngoại, Indexes.
3. Thiết kế Document Schemas cho MongoDB.
