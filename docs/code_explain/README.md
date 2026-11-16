# NOMADIX CODE EXPLANATION SERIES
## Tuyển Tập Giải Thích Mã Nguồn & Sơ Đồ Kiến Trúc Chi Tiết

> Tuyển tập tài liệu đào sâu trực tiếp vào từng dòng code thực thi, cơ chế bất đồng bộ, bảo mật và lưu trữ trong dự án **Nomadix Travel Platform**. Mỗi chuyên đề đều đi kèm sơ đồ luồng tín hiệu (Mermaid Diagrams), phân tích rủi ro kỹ thuật, và bộ câu hỏi vấn đáp bảo vệ đồ án chuẩn Senior Engineer.

---

### 📂 Danh mục Chuyên đề

| Chuyên đề | Tiêu đề & Trọng tâm Kỹ thuật | File liên kết | Sơ đồ đính kèm |
| :---: | :--- | :---: | :---: |
| **01** | **Bảo mật Middleware & Giao dịch Cơ sở Dữ liệu ACID**<br>• Trích xuất Bearer Token & Gán `req.user`<br>• Khối `try...catch...finally` với `client.release()`<br>• Chống rò rỉ kết nối Connection Leak trong PostgreSQL Pool | [01-auth-middleware-and-acid-transactions.md](./01-auth-middleware-and-acid-transactions.md) | `flowchart TD`<br>`sequenceDiagram` |

---

### 🎯 Quy chuẩn Kỹ thuật của Bộ Tài liệu
1. **Source Code First:** Trực tiếp trích dẫn mã nguồn thực tế đang chạy trong dự án (`server/src/`, `client/src/`).
2. **Visual Architecture:** Mọi luồng đi của dữ liệu đều được mô hình hóa bằng sơ đồ Mermaid đạt chuẩn C4/Sequence/Flowchart.
3. **Defense-Ready:** Tích hợp sẵn bộ câu hỏi vấn đáp với câu trả lời mẫu điểm 10 giúp lập trình viên tự tin làm chủ và bảo vệ dự án trước bất kỳ hội đồng chuyên môn nào.
