# 02. External API Feasibility & Quota Assessment Matrix

## Nomadix — All-in-one Smart Travel Platform
**Final Year Project (FYP) — University of Greenwich**  
**Student:** Nguyễn Văn Đức  
**Standard:** External Service Risk & Feasibility Assessment  
**Phase:** Day 5 — Technology Research & API Feasibility  

---

## 1. MA TRẬN KHẢ DỤNG CÁC API BÊN NGOÀI (API FEASIBILITY MATRIX)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL API FEASIBILITY MATRIX                                 │
├─────────────────┬────────────────────┬──────────────┬──────────────────┬───────────────┤
│ API Service     │ Endpoint chính     │ Hạn ngạch    │ Cơ chế Auth      │ Khả năng dùng │
├─────────────────┼────────────────────┼──────────────┼──────────────────┼───────────────┤
│ Amadeus Travel  │ /v2/shopping/      │ 2,000 calls/ │ OAuth2 (Client   │ 100% Khả thi  │
│ (Self-Service)  │ flight-offers      │ tháng (Free) │ ID + Secret)     │ (Sandbox)     │
├─────────────────┼────────────────────┼──────────────┼──────────────────┼───────────────┤
│ RapidAPI        │ /hotels/search     │ 500 calls/   │ X-RapidAPI-Key   │ 100% Khả thi  │
│ (Booking Data)  │ /flights/search    │ tháng (Free) │ Header           │ (Freemium)    │
├─────────────────┼────────────────────┼──────────────┼──────────────────┼───────────────┤
│ Google Maps     │ Maps SDK (Mobile)  │ Không giới   │ Android SHA-1 &  │ 100% Khả thi  │
│ Platform        │ Distance Matrix API│ hạn trên App │ iOS Bundle ID    │ ($200 Credit) │
├─────────────────┼────────────────────┼──────────────┼──────────────────┼───────────────┤
│ Cloudinary CDN  │ /v1_1/nomadix/     │ 25 Credits/  │ API Key & Secret │ 100% Khả thi  │
│ (Media Storage) │ image/upload       │ tháng (Free) │ / Upload Preset  │ (~25,000 ảnh) │
├─────────────────┼────────────────────┼──────────────┼──────────────────┼───────────────┤
│ Mock Provider   │ Cục bộ (Local Data)│ Vô hạn       │ None             │ 100% Sẵn sàng │
│ (Dự phòng)      │ Trong Server Node  │ (Không giới) │ (Internal)       │ (Tự thiết kế) │
└─────────────────┴────────────────────┴──────────────┴──────────────────┴───────────────┘
```

---

## 2. CHI TIẾT KHẢO SÁT TỪNG DỊCH VỤ API

---

### 2.1 Amadeus Travel Innovation Sandbox API
* **Đăng ký:** Tài khoản Amadeus for Developers (Self-Service Sandbox).
* **Endpoints sử dụng:**
  * Flight Offers Search v2: `GET https://test.api.amadeus.com/v2/shopping/flight-offers`
  * Hotel List by City: `GET https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city`
* **Cơ chế xác thực (Authentication):**
  * Gửi `POST https://test.api.amadeus.com/v1/security/oauth2/token` với `client_id` và `client_secret` để lấy Bearer Token (Có hiệu lực 30 phút).
* **Đặc điểm dữ liệu & Thách thức:**
  * Dữ liệu trả về rất chi tiết (hãng bay, loại máy bay, hành lý, từng chặng bay segments).
  * Cấu trúc JSON phức tạp, cần Normalizer chuyển đổi về `UnifiedFlight`.
* **Giới hạn & Rủi ro:** Giới hạn 10 requests / giây và 2,000 calls / tháng.

---

### 2.2 RapidAPI Travel Aggregators (Booking.com / Skyscanner Data)
* **Đăng ký:** Tài khoản RapidAPI Developer Hub.
* **Endpoints sử dụng:**
  * Booking Hotels Search: `GET https://booking-com.p.rapidapi.com/v1/hotels/search`
* **Cơ chế xác thực:** Header `X-RapidAPI-Key` và `X-RapidAPI-Host`.
* **Đặc điểm dữ liệu:** Trả về danh sách khách sạn phong phú kèm hình ảnh và điểm đánh giá thực tế.
* **Giới hạn & Rủi ro:** Hạn mức gói Free là 500 requests/tháng. Nếu hết hạn ngạch ➔ Hệ thống tự động chuyển sang `MockProvider`.

---

### 2.3 Google Maps Platform (Maps SDK & Distance Matrix)
* **Đăng ký:** Google Cloud Console Project với phương thức thanh toán có hạn mức thẻ sinh viên.
* **Endpoints & SDKs sử dụng:**
  * Google Maps SDK for Android & iOS (Bản đồ tương tác di động): **Miễn phí hoàn toàn không giới hạn** khi cấu hình đúng Fingerprint SHA-1 và Package Name.
  * Google Distance Matrix API: `https://maps.googleapis.com/maps/api/distancematrix/json?origins=...&destinations=...&key=...`
* **Hạn mức & Chi phí:**
  * Google cấp **$200 tín dụng miễn phí mỗi tháng** cho mỗi tài khoản Google Cloud.
  * Giá của Distance Matrix API là $5.00 cho 1,000 requests ➔ Với $200 free credit, sinh viên có thể thực hiện tối đa **40,000 lượt tính toán khoảng cách mỗi tháng** mà không tốn một đồng chi phí nào.
* **Biện pháp bảo vệ ngân sách (Budget Alert):** Cài đặt Budget Alert $0 trên Google Cloud Console để ngắt kết nối nếu vượt quá credit miễn phí.

---

### 2.4 Cloudinary Media Service
* **Đăng ký:** Tài khoản Cloudinary Developer Plan.
* **Hạn mức miễn phí:** 25 Credits / tháng tương đương khoảng 25,000 lượt tải ảnh hoặc $25\text{ GB}$ lưu trữ và băng thông.
* **Cấu trúc thư mục lưu trữ:**
  * `/nomadix/avatars/`: Ảnh đại diện người dùng (`c_fill,g_face,w_300,h_300`).
  * `/nomadix/checkins/`: Ảnh chụp thực tế tại địa danh văn hóa (kèm lớp phủ watermark tọa độ và thời gian).
  * `/nomadix/receipts/{tripId}/`: Ảnh chụp hóa đơn chi tiêu của nhóm phục vụ tính năng chia tiền và lưu trữ chứng từ minh bạch.
* **Quy trình tối ưu hóa (Transformations):**
  * Tự động chuyển đổi định dạng: `f_auto` ➔ WebP trên Android/iOS.
  * Tự động nén chất lượng: `q_auto` (Giảm dung lượng $70\%$ mà không giảm chất lượng nhìn thấy bằng mắt thường).
  * Cắt xén thông minh ảnh đại diện: `c_fill,g_face,w_300,h_300`.

---

## 3. MA TRẬN PHÂN TÍCH RỦI RO & PHƯƠNG ÁN DỰ PHÒNG (RISK & MITIGATION)

| Rủi ro kỹ thuật | Mức độ | Khả năng xảy ra | Biện pháp giải quyết triệt để |
|---|:---:|:---:|---|
| **Hết Quota Amadeus / RapidAPI** | Cao | Trung bình | Tự động kích hoạt **Mock Provider Fallback Engine** trong vòng $< 100\text{ms}$. |
| **API đối tác bị Timeout (> 5s)** | Trung bình | Cao | Đặt `timeout: 5000` trên Axios instance ➔ Tự ngắt và chuyển sang Mock Data. |
| **Google Maps Quota bị khóa** | Thấp | Thấp | Kích hoạt công thức toán học **Haversine cục bộ** tính khoảng cách đường chim bay. |
| **Mất kết nối Internet khi Check-in** | Cao | Trung bình | Hàng đợi **Offline Check-in Queue** lưu tạm vào AsyncStorage và tự upload lại khi có mạng. |
| **Ảnh hóa đơn bị mờ / Dung lượng lớn** | Thấp | Trung bình | Tự động nén ảnh trên Mobile bằng `react-native-image-resizer` xuống $< 1\text{MB}$ trước khi đẩy lên Cloudinary. |
