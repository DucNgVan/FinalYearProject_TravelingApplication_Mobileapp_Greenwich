# Kịch Bản Thuyết Trình & Trình Diễn Hệ Thống Toàn Diện
## Master Presentation & Live Demo Script: Nomadix Travel Platform

> **Đề tài:** Nền tảng Du lịch Thông minh & Lập kế hoạch Đồng đội Toàn diện (Collaborative Squad Travel & Smart Booking Platform)  
> **Thời lượng chuẩn:** 10 – 12 phút thuyết trình + 5 – 8 phút vấn đáp  
> **Phong thái:** Chuyên nghiệp, đĩnh đạc, ngôn ngữ kỹ sư chuẩn mực, kết hợp nhịp nhàng giữa Lời nói (`[Lời thoại]`) và Thao tác màn hình (`[Hành động]`).

---

## Mục lục
1. [Kế hoạch Phân bổ Thời gian (Timing Breakdown)](#1-kế-hoạch-phân-bổ-thời-gian-timing-breakdown)
2. [PHẦN 1: Mở đầu & Nỗi đau Nghiệp vụ (1.5 phút)](#phần-1-mở-đầu--nỗi-đau-nghiệp-vụ-15-phút)
3. [PHẦN 2: Tổng quan Kiến trúc Kỹ thuật (1.5 phút)](#phần-2-tổng-quan-kiến-trúc-kỹ-thuật-15-phút)
4. [PHẦN 3: Trình diễn Trực tiếp Hệ thống (Live Demo Showcase - 6 Cảnh) (6.0 phút)](#phần-3-trình-diễn-trực-tiếp-hệ-thống-live-demo-showcase---6-cảnh-60-phút)
   - [Cảnh 1: Xác thực & Đăng nhập An toàn](#cảnh-1-xác-thực--đăng-nhập-an-toàn)
   - [Cảnh 2: Đặt vé Máy bay & Bộ đệm Redis Cache-Aside](#cảnh-2-đặt-vé-máy-bay--bộ-đệm-redis-cache-aside)
   - [Cảnh 3: Lập kế hoạch Du lịch Đa thành phố với Accordion Trip Wizard](#cảnh-3-lập-kế-hoạch-du-lịch-đa-thành-phố-với-accordion-trip-wizard)
   - [Cảnh 4: Mời Bạn Đồng Hành & Đồng Bộ Nhóm](#cảnh-4-mời-bạn-đồng-hành--đồng-bộ-nhóm)
   - [Cảnh 5: Chia tiền Nhóm & Thuật toán Greedy Tối ưu Công nợ](#cảnh-5-chia-tiền-nhóm--thuật-toán-greedy-tối-ưu-công-nợ)
   - [Cảnh 6: Quản lý Cá nhân & Kiến trúc Zero Mock Data](#cảnh-6-quản-lý-cá-nhân--kiến-trúc-zero-mock-data)
5. [PHẦN 4: Chất lượng Mã nguồn & Quy chuẩn Kiểm thử (1.5 phút)](#phần-4-chất-lượng-mã-nguồn--quy-chuẩn-kiểm-thử-15-phút)
6. [PHẦN 5: Lời kết & 3 Mẹo Vàng Thuyết trình Đạt Điểm Tuyệt Đối (0.5 phút)](#phần-5-lời-kết--3-mẹo-vàng-thuyết-trình-đạt-điểm-tuyệt-đối-05-phút)

---

## 1. Kế hoạch Phân bổ Thời gian (Timing Breakdown)

| Phần | Nội dung trọng tâm | Thời lượng | Trạng thái hiển thị |
| :---: | :--- | :---: | :--- |
| **Phần 1** | Giới thiệu & Bối cảnh Nỗi đau Du lịch Nhóm | **1.5 phút** | Slide Bìa / Màn hình Onboarding |
| **Phần 2** | Kiến trúc 5-Tier & Polyglot Database (3 DBs) | **1.5 phút** | Sơ đồ Kiến trúc C4 / System Flow |
| **Phần 3** | Trình diễn Trực tiếp 6 Cảnh Nghiệp vụ Cốt lõi | **6.0 phút** | **Thao tác trực tiếp trên Điện thoại** |
| **Phần 4** | Chất lượng Code, TDD 100% Green & DevOps | **1.5 phút** | Terminal Test Suites & CI/CD Logs |
| **Phần 5** | Lời kết & Mở màn Vòng Vấn đáp (Q&A) | **0.5 phút** | Slide Cảm ơn & Thông tin Liên hệ |
| **TỔNG** | **Toàn bộ tiến trình Thuyết trình Bảo vệ** | **11.0 phút** | **Kiểm soát thời gian hoàn hảo** |

---

## PHẦN 1: Mở đầu & Nỗi đau Nghiệp vụ (1.5 phút)

* **[Hành động]:** Đứng thẳng, tự tin, mắt nhìn bao quát Hội đồng, mở điện thoại ở màn hình Onboarding của ứng dụng Nomadix.
* **[Lời thoại]:**
> *"Kính thưa quý thầy cô trong Hội đồng phản biện,*  
> *Em xin tự giới thiệu, em là **[Tên bạn]**, sinh viên chuyên ngành Kỹ thuật Phần mềm. Hôm nay, em rất vinh dự được trình bày đồ án tốt nghiệp của mình với đề tài: **Nomadix – Nền tảng Du lịch Thông minh & Lập kế hoạch Đồng đội Toàn diện (Collaborative Squad Travel & Smart Booking Platform)**.*
>
> *Thưa thầy cô, du lịch theo nhóm bạn bè là một trong những nhu cầu phổ biến nhất của giới trẻ hiện nay. Tuy nhiên, quá trình chuẩn bị cho một chuyến đi nhóm luôn đi kèm với 3 nỗi đau nhức nhối:*
> 1. * **Sự phân mảnh thông tin:** Người đặt vé máy bay qua ứng dụng hãng, người đặt khách sạn qua trang web khác, trong khi lịch trình tham quan lại bàn tán rời rạc qua các nhóm chat.*
> 2. * **Khó khăn khi thống nhất hành trình:** Việc sắp xếp các điểm dừng chân hợp lý theo khoảng cách địa lý và thời gian mở cửa luôn tốn hàng giờ tra cứu thủ công.*
> 3. * **Xung đột tài chính sau chuyến đi:** Việc nhiều người cùng trả tiền ăn uống, taxi chéo nhau tạo ra một ma trận nợ nần phức tạp, dễ dẫn đến bất hòa vì những sai số làm tròn hoặc quên sót hóa đơn.*
>
> *Đó chính là lý do em xây dựng **Nomadix** — một hệ sinh thái khép kín giúp người dùng từ bước tìm vé máy bay quốc tế, đặt phòng khách sạn, lập kế hoạch chi tiết từng ngày cùng đồng đội, cho đến thuật toán tự động giải quyết dứt điểm các khoản nợ nhóm chỉ trong một nút bấm."*

---

## PHẦN 2: Tổng quan Kiến trúc Kỹ thuật (1.5 phút)

* **[Hành động]:** Chuyển sang slide sơ đồ kiến trúc 5 tầng và cơ sở dữ liệu Polyglot.
* **[Lời thoại]:**
> *"Để giải quyết trọn vẹn bài toán trên, Nomadix được thiết kế theo kiến trúc **Modular Monolith phân tách 5 tầng nghiêm ngặt**, kết hợp chiến lược **Lưu trữ Đa mô hình (Polyglot Persistence)**:*
>
> 1. * **Tầng 1 (Client Layer):** Ứng dụng di động đa nền tảng phát triển trên **React Native & Expo**, quản lý trạng thái bằng **6 Zustand Domain Stores** độc lập với kỹ thuật Atomic Selector đảm bảo mượt mà 60 FPS.*
> 2. * **Tầng 2 (Security Gateway):** Xây dựng trên **Node.js/Express**, bảo vệ bằng Redis Rate Limiter chống spam, Joi DTO validation và cơ chế Stateless JWT Bearer Token.*
> 3. * **Tầng 3 (Domain Service Layer):** Chứa toàn bộ nghiệp vụ cốt lõi, từ thuật toán tối ưu tài chính cho đến xử lý dữ liệu địa lý.*
> 4. * **Tầng 4 (External Adapters):** Kết nối với giao thức hàng không **Duffel NDC API**, hệ sinh thái địa danh **OpenTripMap API**, và lưu trữ hóa đơn đám mây **Cloudinary WebP** qua bộ đệm Circuit Breaker.*
> 5. * **Tầng 5 (Polyglot Persistence Layer):** Sử dụng 3 động cơ chuyên biệt:
>    * **PostgreSQL 16 (ACID):** Quản lý định danh và sổ cái tài chính với kiểu `NUMERIC(12, 2)` triệt tiêu hoàn toàn sai số làm tròn số thực IEEE 754.
>    * **MongoDB Atlas 7.0:** Lưu trữ tài liệu lịch trình du lịch đa ngày dạng nhúng 1:Few cho tốc độ đọc sub-15ms.
>    * **Redis 7.0:** Đóng vai trò bộ đệm Cache-Aside cho vé máy bay/khách sạn và quản lý mã OTP thời gian thực.*
>
> *Sau đây, em xin phép được trình diễn trực tiếp ứng dụng đang chạy thực tế trên thiết bị di động."*

---

## PHẦN 3: Trình diễn Trực tiếp Hệ thống (Live Demo Showcase - 6 Cảnh) (6.0 phút)

### Cảnh 1: Xác thực & Đăng nhập An toàn
* **[Hành động]:** Mở app màn hình Login $\rightarrow$ Bấm nút "1-Tap Demo Fill" hoặc "Continue with Google" $\rightarrow$ Ứng dụng chuyển vào HomeScreen mượt mà.
* **[Lời thoại]:**
> *"Đầu tiên là tầng bảo mật. Nomadix hỗ trợ đăng nhập bằng **Google OAuth 2.0** và xác thực số điện thoại/email qua **OTP 6 chữ số** với thời gian sống TTL 300 giây trên Redis.*  
> *Khi đăng nhập thành công, hệ thống cấp phát một cặp Token: **Access Token 15 phút** và **Refresh Token (được băm SHA-256 lưu trong PostgreSQL)**. Client tự động lưu trữ an toàn cấp phần cứng bằng `expo-secure-store` (tận dụng Keychain trên iOS và Keystore trên Android) thay vì lưu plain-text trên AsyncStorage."*

---

### Cảnh 2: Đặt vé Máy bay & Bộ đệm Redis Cache-Aside
* **[Hành động]:** Chuyển sang Tab **Flights** $\rightarrow$ Tìm chặng `SGN` (Sài Gòn) đến `HND` (Tokyo Haneda) $\rightarrow$ Xem danh sách vé bay $\rightarrow$ Chọn chuyến bay $\rightarrow$ Chọn ghế ngồi A321 $\rightarrow$ Thanh toán Sandbox $\rightarrow$ Hiển thị Thẻ Boarding Pass.
* **[Lời thoại]:**
> *"Tại Tab Flights, hệ thống tích hợp trực tiếp với giao thức hàng không quốc tế **Duffel NDC API**.  
> * **Về hiệu năng:** Lần tìm kiếm đầu tiên (Cache Miss) mất khoảng 2 giây để gọi sang Duffel và lưu vào Redis. Nhưng khi em tìm kiếm lại cùng chặng bay này, kỹ thuật **Cache-Aside** với khóa Deterministic Key `nomadix:flight:SGN:HND:...` giúp dữ liệu phản hồi tức thì từ RAM trong chưa đầy **5 mili-giây**!*  
> * **Về độ bền bỉ (Resilience):** Hệ thống trang bị sẵn Circuit Breaker với Timeout 5 giây. Nếu Duffel API bị nghẽn mạng hoặc hết hạn ngạch, hệ thống sẽ tự động chuyển hướng sang Mock Provider dự phòng chuyến bay nội địa để app không bao giờ bị đơ.*  
> * **Trải nghiệm UX:** Em tự xây dựng sơ đồ ghế máy bay Airbus A321 và thẻ vé **Boarding Pass** đục lỗ theo phong cách Executive Monochrome với mã vạch SVG chân thực."*

---

### Cảnh 3: Lập kế hoạch Du lịch Đa thành phố với Accordion Trip Wizard
* **[Hành động]:** Chuyển sang Tab **Plan** $\rightarrow$ Bấm `+ New Trip` $\rightarrow$ Chọn thành phố (Đà Nẵng), 3 ngày, chọn sở thích $\rightarrow$ Chọn các địa danh từ OpenTripMap $\rightarrow$ Bấm Hoàn thành.
* **[Lời thoại]:**
> *"Trái tim của Nomadix là **Accordion Trip Wizard 5 bước**.  
> * Người dùng không phải nhập dữ liệu mù mờ. Hệ thống kết nối với **OpenTripMap API** để tự động kéo về các địa danh thực tế có tọa độ GPS và ảnh chụp độ phân giải cao từ Wikipedia Commons Registry.*  
> * Khi lưu kế hoạch, backend áp dụng **Công thức Lượng giác Haversine** trên mô hình elip Trái Đất $R = 6371\text{km}$ để tính toán ma trận khoảng cách và thời gian di chuyển giữa các điểm dừng liên tiếp, đồng thời tích hợp nút Deep Link điều hướng trực tiếp sang **Apple Maps / Google Maps** cho khách du lịch ngoài đời thực.*  
> * Dữ liệu được lưu trong **MongoDB Atlas** dưới dạng mảng nhúng nguyên tử, giúp tải toàn bộ lộ trình 3 ngày chỉ trong 1 truy vấn duy nhất."*

---

### Cảnh 4: Mời Bạn Đồng Hành & Đồng Bộ Nhóm
* **[Hành động]:** Trên thẻ Plan, bấm vào nút **Invite Squad** $\rightarrow$ Hiển thị mã mời `NX-...` $\rightarrow$ Mở danh sách đồ cần chuẩn bị chung (Shared Checklist).
* **[Lời thoại]:**
> *"Để du lịch cùng nhóm, chủ chuyến đi chỉ cần bấm nút **Invite Squad** để sinh mã mời ngẫu nhiên 8 ký tự. Bạn đồng hành chỉ cần nhập mã là được thêm vào mảng `collaborators` với phân quyền RBAC rõ ràng (`OWNER`, `EDITOR`, `VIEWER`). Cả nhóm có thể cùng nhau tick chọn danh sách đồ dùng mang theo mà không bị trùng lặp."*

---

### Cảnh 5: Chia tiền Nhóm & Thuật toán Greedy Tối ưu Công nợ
* **[Hành động]:** Mở Tab **Group Expenses** $\rightarrow$ Thêm 1 hóa đơn ăn tối $150 (A trả, chia cho A, B, C) $\rightarrow$ Xem bảng cân đối Net Balance $\rightarrow$ Mở tab **Settle Debts**.
* **[Lời thoại]:**
> *"Đây là điểm tự hào nhất của đồ án về mặt khoa học máy tính:*  
> * Khi một thành viên chụp ảnh hóa đơn giấy, ảnh được nén client-side và upload định dạng WebP lên **Cloudinary**.  
> * Dữ liệu tiền tệ được ghi vào PostgreSQL trong một **Database Transaction (`BEGIN...COMMIT`)**, đảm bảo nếu việc ghi nợ chi tiết thất bại thì hóa đơn tự động Rollback, không để lại dữ liệu rác.  
> * **Thuật toán cốt lõi:** Nếu 10 người cùng chi tiêu chéo nhau, một đồ thị nợ thông thường sẽ cần tới 45 giao dịch chuyển khoản lộn xộn. Em đã triển khai **Thuật toán Tham lam Rút gọn Dòng tiền Tối thiểu (Greedy Minimum Cash-Flow Reduction)** sử dụng 2 Hàng đợi Ưu tiên (Max-Heaps) với độ phức tạp **$O(N \log N)$**. Thuật toán đảm bảo dứt điểm toàn bộ nợ nần của cả nhóm với **tối đa chỉ $N - 1$ giao dịch**, triệt tiêu hoàn toàn mâu thuẫn tiền bạc."*

---

### Cảnh 6: Quản lý Cá nhân & Kiến trúc Zero Mock Data
* **[Hành động]:** Mở sang Tab **Profile**, cho thấy phụ đề *"No active flight tickets"*, *"No saved cards"* khi chưa có dữ liệu $\rightarrow$ Bấm nút chuyển đổi giao diện Dark/Light mode.
* **[Lời thoại]:**
> *"Toàn bộ ứng dụng tuân thủ tiêu chuẩn **Zero Mock Data Architecture**. Không có bất kỳ vé máy bay ma hay thẻ ngân hàng giả nào hiển thị trên tài khoản mới. Mọi trạng thái trống (Empty State) đều hiển thị trung thực và có nút điều hướng kích thích người dùng hành động.*  
> *Hệ thống thiết kế hỗ trợ chuyển đổi giao diện Obsidian Dark Mode và Light Mode tức thì thông qua store `useThemeStore` mà không hề làm giật lag giao diện."*

---

## PHẦN 4: Chất lượng Mã nguồn & Quy chuẩn Kiểm thử (1.5 phút)

* **[Hành động]:** Chiếu màn hình Terminal chạy lệnh `npm test` trên backend và frontend.
* **[Lời thoại]:**
> *"Thưa thầy cô, một dự án lớn không thể vận hành bền bỉ nếu thiếu kiểm thử. Em đã áp dụng phương pháp luận **Solo Extreme Programming (XP) và Test-Driven Development (TDD)** nghiêm ngặt:*
> * Dự án sở hữu **224 Test Suites với 861/861 bài kiểm thử đạt tỷ lệ 100% GREEN**, bao phủ từ Unit Test thuật toán, API Integration Test với Supertest, cho đến Component Test trên React Native.*
> * Mọi kết nối cơ sở dữ liệu đều được quản lý giải phóng chặt chẽ (`client.release()` trong khối `finally`), loại trừ hoàn toàn nguy cơ rò rỉ kết nối (Connection Leak).*
> * Quy trình phát hành mã nguồn được tự động hóa hoàn toàn bằng **Python Release Pipeline**, tự động quét sạch các tệp nháp và đồng bộ hóa an toàn lên GitHub."*

---

## PHẦN 5: Lời kết & 3 Mẹo Vàng Thuyết trình Đạt Điểm Tuyệt Đối (0.5 phút)

* **[Hành động]:** Quay trở lại nhìn thẳng vào Hội đồng, mỉm cười và cúi chào nhẹ.
* **[Lời thoại]:**
> *"Kính thưa quý thầy cô, **Nomadix** không chỉ là một bài tập tốt nghiệp mô phỏng, mà là một sản phẩm hoàn thiện sẵn sàng cho môi trường Production, kết hợp chặt chẽ giữa tính thẩm mỹ hiện đại, hiệu năng di động tối ưu và nền tảng thuật toán tài chính chuẩn xác.*
>
> *Em xin chân thành cảm ơn quý thầy cô đã chú ý lắng nghe bài trình bày. Em rất mong nhận được những nhận xét, góp ý và xin sẵn sàng trả lời các câu hỏi từ Hội đồng phản biện ạ!"*

---

### 💡 3 Mẹo Vàng Khi Trình Bày:
1. **Kiểm soát Tốc độ (Pacing):** Nói với tốc độ vừa phải, nhấn mạnh vào các từ khóa kỹ thuật then chốt: *ACID, $O(N \log N)$, Cache-Aside, Atomic Selector, Zero Mock Data*.
2. **Không sợ Demo lỗi:** Nếu mạng chập chờn, hãy bình tĩnh nói ngay: *"Như thầy cô thấy, hệ thống của em đã tự động kích hoạt Circuit Breaker Fallback để giữ app không bị sập"* $\rightarrow$ Biến sự cố mạng thành minh chứng cho thấy hệ thống của bạn có khả năng chịu lỗi (Fault-Tolerant) cực đỉnh!
3. **Mắt luôn hướng về Hội đồng (Eye Contact):** Thao tác tay bấm trên màn hình điện thoại, nhưng mắt luôn ngước lên nhìn thầy cô để tạo sự tự tin và cuốn hút.

---
*Tài liệu nội bộ thuộc Hệ thống Đào tạo & Giải thích Mã nguồn Nomadix.*
