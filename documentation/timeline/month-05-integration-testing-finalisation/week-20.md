# WEEK 20 — THESIS FINALISATION, DEMO VIDEO & FYP DEFENSE

## Tháng 5: Integration, Testing & Finalisation
**Milestone:** `W20 - Finalisation` & `M5 - Finalisation`  
**Thời gian:** Ngày 134 – Ngày 140 (04/01/2027 – 10/01/2027)  
**Nhánh chính:** `docs/final-thesis-and-release` (tách từ `develop`)  
**Mục tiêu tuần:** Hoàn thiện 100% Báo cáo Luận văn tốt nghiệp (Final Thesis Report 80–120 trang), Quay video Demo chất lượng cao, Thiết kế Slide thuyết trình chuyên nghiệp, Hợp nhất mã nguồn vào nhánh `main` và bảo vệ đồ án tốt nghiệp trước Hội đồng giám khảo.

---

## 📅 CHI TIẾT NHIỆM VỤ TỪNG NGÀY (DAY-BY-DAY)

### 🔹 DAY 134: COMPLETE THESIS REPORT COMPILATION (04/01/2027)
* **Mục tiêu:** Tổng hợp toàn bộ 7 chương của Luận văn tốt nghiệp theo đúng chuẩn học thuật của University of Greenwich.
* **Nhiệm vụ cụ thể:**
  1. Rà soát cấu trúc toàn bộ 7 chương:
     * **Chapter 1:** Introduction (Background, Problem Statement, Objectives, Project Scope, Value Proposition).
     * **Chapter 2:** Literature Review & Technology Evaluation (Comparative analysis of travel apps, Justification of Tech Stack: React Native, Node.js, Dual DB Postgres/Mongo, Redis, Maps).
     * **Chapter 3:** Requirements Analysis & Specification (FR-01 to FR-35, NFRs, User Stories, Gherkin Acceptance Criteria, RTM).
     * **Chapter 4:** System Design & Architecture (Layered Architecture, Component Diagrams, Relational ERD 3NF, MongoDB Schemas, Caching Architecture, RESTful API Specs, UX/UI Design System).
     * **Chapter 5:** Implementation & Technical Innovations (Data Normalization Engine / Adapter Pattern, Redis Caching Strategy, Geofencing Validation, Native Camera Pipeline, Quiz & Badge Engine, "City Verified" Credibility Attachment).
     * **Chapter 6:** Testing, Evaluation & Results (Unit Testing, Integration Testing, UAT Results with 5–10 Users, SUS Usability Score Analysis, Redis Latency Benchmark Experiments).
     * **Chapter 7:** Conclusion, Critical Evaluation & Future Work (Project Success Evaluation, Limitations, Future Roadmap: AI Assistant, Anti-cheat, Real-time Chat).
* **Sản phẩm đầu ra:**
  * File tài liệu Luận văn hoàn chỉnh: `Nomadix_Final_Thesis_Report.docx` / `.pdf`.
* **Git Commit:** `docs: compile full 7-chapter final year project thesis report`
* **DoD:** Toàn bộ 7 chương được biên soạn đầy đủ, số trang từ 80 đến 120 trang.

---

### 🔹 DAY 135: ACADEMIC FORMATTING, CITATIONS & PROOFREADING (05/01/2027)
* **Mục tiêu:** Định dạng văn bản chuẩn quốc tế (Harvard Referencing), lập danh mục bảng biểu và kiểm tra ngữ pháp tiếng Anh học thuật.
* **Nhiệm vụ cụ thể:**
  1. Định dạng trang bìa, lời cảm ơn (Acknowledgements), tóm tắt đồ án (Abstract / Executive Summary).
  2. Tạo tự động: Mục lục (Table of Contents), Danh mục hình ảnh (List of Figures), Danh mục bảng biểu (List of Tables), Danh mục từ viết tắt (List of Abbreviations).
  3. Kiểm tra trích dẫn tài liệu tham khảo (References) theo chuẩn **Harvard Referencing Style** (Tối thiểu 25–40 nguồn học thuật uy tín).
  4. Sử dụng công cụ kiểm tra chính tả, ngữ pháp học thuật (Grammarly / LanguageTool).
* **Sản phẩm đầu ra:**
  * Bản PDF Luận văn chính thức sẵn sàng in ấn và nộp qua Turnitin.
* **Git Commit:** `docs: format academic citations using harvard style and generate table of figures`
* **DoD:** Luận văn được căn lề, đánh số trang và trích dẫn chuẩn mực 100%.

---

### 🔹 DAY 136: PROFESSIONAL DEMO VIDEO RECORDING & EDITING (06/01/2027)
* **Mục tiêu:** Sản xuất một video Demo chuyên nghiệp (thời lượng 3–5 phút) quay trực tiếp màn hình ứng dụng di động để trình chiếu trong buổi bảo vệ và lưu trữ hồ sơ đồ án.
* **Nhiệm vụ cụ thể:**
  1. Lên kịch bản quay (Storyboard) theo đúng kịch bản MVP 19 bước:
     * *Phút 1 (Khám phá & Lập lịch):* Đăng nhập ➔ Tìm vé máy bay & khách sạn ➔ Tạo lịch trình Đà Nẵng 3 ngày ➔ Kéo thả đổi thứ tự ➔ Xem bản đồ Google Maps.
     * *Phút 2 (Khám phá thực tế & Gamification):* Quét GPS trước Cầu Rồng ➔ Bấm Check-in ➔ Mở Camera chụp ảnh có Watermark ➔ Làm bài Quiz văn hóa ➔ Nhận hiệu ứng pháo hoa mở khóa Da Nang Badge.
     * *Phút 3 (Cộng đồng uy tín):* Mở diễn đàn Đà Nẵng ➔ Đăng câu trả lời ➔ Hệ thống tự động gắn nhãn vàng **"Da Nang Verified"** nổi bật.
  2. Quay màn hình điện thoại thật độ phân giải Full HD (1080p), lồng tiếng thuyết minh tiếng Anh rõ ràng (Voiceover) và chèn nhạc nền nhẹ nhàng.
* **Sản phẩm đầu ra:**
  * Video `Nomadix_Product_Demo_HD.mp4` (Tải lên YouTube Unlisted / Google Drive).
* **Git Commit:** `docs: record and produce professional high-definition product demo video`
* **DoD:** Video demo mượt mà, âm thanh rõ nét, truyền tải trọn vẹn giá trị USP của đồ án.

---

### 🔹 DAY 137: PRESENTATION SLIDE DECK DESIGN (07/01/2027)
* **Mục tiêu:** Thiết kế bộ Slide thuyết trình bảo vệ đồ án (Pitch Deck 15–20 slides) theo phong cách hiện đại, trực quan, cô đọng.
* **Nhiệm vụ cụ thể:**
  1. Cấu trúc bộ Slide:
     * Slide 1: Title & Student Information (Nguyen Van Duc - University of Greenwich).
     * Slide 2: Problem Statement (The Fragmented Travel Experience).
     * Slide 3: Proposed Solution & Core Vision (Nomadix Ecosystem).
     * Slide 4: Unique Selling Proposition (USP - Location-Verified Travel & Gamification).
     * Slide 5: System Architecture & Tech Stack (React Native, Node.js, Postgres + Mongo + Redis).
     * Slide 6: Key Technical Highlights (Data Normalization Adapter & Redis Caching Benchmark).
     * Slide 7: Live Demonstration Walkthrough (19-Step MVP Journey).
     * Slide 8: Empirical Testing & Usability Results (SUS Score = 82.5/100, Performance Gains).
     * Slide 9: Project Management & Agile Git Workflow (5-Month Milestones, Commit Discipline).
     * Slide 10: Limitations & Future Work (AI Assistant, Anti-cheat, Real-time Chat).
     * Slide 11: Conclusion & Q&A.
* **Sản phẩm đầu ra:**
  * Bộ Slide thuyết trình `Nomadix_Final_Defense_Presentation.pptx` / `.pdf`.
* **Git Commit:** `docs: design professional 20-slide final presentation deck for thesis defense`
* **DoD:** Slide được thiết kế đẹp mắt, nhiều hình ảnh minh họa thực tế, ít chữ, chuẩn phong cách hội đồng quốc tế.

---

### 🔹 DAY 138: DEFENSE REHEARSAL & MOCK Q&A PREPARATION (08/01/2027)
* **Mục tiêu:** Luyện tập thuyết trình căn đúng thời gian (15 phút thuyết trình + 10 phút Q&A) và chuẩn bị câu trả lời cho các câu hỏi hóc búa của Hội đồng giám khảo.
* **Nhiệm vụ cụ thể:**
  1. Chuẩn bị bộ câu hỏi phản biện thường gặp (Defense Q&A Cheat Sheet):
     * *Câu hỏi 1:* Tại sao chọn kiến trúc Dual-Database (Postgres + Mongo) thay vì chỉ dùng 1 loại DB?
     * *Câu hỏi 2:* Nếu các OTA API thực tế từ chối cấp quyền hoặc bị giới hạn, hệ thống xử lý thế nào? (Trả lời: Kiến trúc Adapter Pattern và Mock Provider tự động fallback).
     * *Câu hỏi 3:* Làm thế nào để ngăn chặn người dùng Fake GPS để lấy Badge ảo? (Trả lời: Ranh giới phạm vi MVP vs Định hướng phát triển tương lai trong Chapter 7).
     * *Câu hỏi 4:* Số liệu chứng minh Redis Caching thực sự cải thiện hiệu năng hệ thống? (Trả lời: Trình bày biểu đồ Benchmark so sánh Latency p50 và Throughput ở Week 19).
  2. Luyện tập thuyết trình thử 3 lần trước gương hoặc ghi âm tự nghe lại.
* **Sản phẩm đầu ra:**
  * Tài liệu `documentation/14-presentation/defense-qna-preparation.md`.
* **Git Commit:** `docs: prepare comprehensive defense qna cheat sheet and presentation notes`
* **DoD:** Thuyết trình trôi chảy trong đúng 15 phút và nắm vững câu trả lời cho mọi câu hỏi kỹ thuật.

---

### 🔹 DAY 139: RELEASE TAGGING (V1.0.0-FYP) & MERGE TO MAIN (09/01/2027)
* **Mục tiêu:** Hợp nhất toàn bộ nhánh phát triển vào nhánh chính `main`, gắn thẻ phát hành chính thức (`v1.0.0-fyp`) và xuất bản bản cài đặt Release.
* **Nhiệm vụ cụ thể:**
  1. Mở Pull Request cuối cùng: `develop` ➔ `main`.
     * Tiêu đề: `Release v1.0.0 — Nomadix All-in-one Smart Travel Platform (FYP Final Submission)`.
  2. Thực hiện Merge PR vào `main`.
  3. Gắn thẻ Git Tag: `git tag -a v1.0.0-fyp -m "Nomadix Final Year Project v1.0.0 Release"`.
  4. Đẩy tag lên GitHub: `git push origin v1.0.0-fyp`.
  5. Tạo **GitHub Release v1.0.0-fyp** đính kèm:
     * File cài đặt ứng dụng Android `Nomadix-v1.0.0.apk`.
     * File Luận văn `Nomadix_Final_Thesis_Report.pdf`.
     * File Slide thuyết trình `Nomadix_Presentation.pdf`.
     * Release Notes tóm tắt 20 tuần phát triển.
* **Sản phẩm đầu ra:**
  * GitHub Release chính thức trên repository.
* **Git Commit:** `release: merge develop into main and publish v1.0.0-fyp official release`
* **DoD:** Nhánh `main` sạch sẽ 100%, có Tag `v1.0.0-fyp` và file APK tải về cài được ngay.

---

### 🔹 DAY 140: FINAL FYP DEFENSE & PROJECT SIGN-OFF (10/01/2027)
* **Mục tiêu:** Thực hiện bảo vệ đồ án tốt nghiệp xuất sắc trước Hội đồng giám khảo University of Greenwich, đóng toàn bộ các Milestone và hoàn tất kỳ đồ án tốt nghiệp 5 tháng.
* **Nhiệm vụ cụ thể:**
  1. Thuyết trình bài báo cáo đồ án và trình chiếu Live Demo ứng dụng Nomadix.
  2. Trả lời tự tin, thuyết phục toàn bộ câu hỏi phản biện của Giám khảo và Giảng viên hướng dẫn.
  3. Đóng Milestone cuối cùng trên GitHub: `M5 - Finalisation` (100% Completed).
  4. Lưu trữ toàn bộ mã nguồn, cơ sở dữ liệu và tài liệu vào thư mục lưu trữ vĩnh viễn.
* **Sản phẩm đầu ra:**
  * Đồ án tốt nghiệp hoàn thành xuất sắc với điểm số tối đa (First Class Honors / Distinction).
* **Git Commit:** `docs: project completion sign-off and close final milestone M5`
* **DoD:** Toàn bộ 20 tuần (140 ngày) hoàn tất 100%; Đồ án FYP kết thúc thành công rực rỡ!
