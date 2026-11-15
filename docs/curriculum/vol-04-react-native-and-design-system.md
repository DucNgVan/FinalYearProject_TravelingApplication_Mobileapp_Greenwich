# TẬP 4: LẬP TRÌNH DI ĐỘNG REACT NATIVE & EXECUTIVE DESIGN SYSTEM
## Nomadix Software Engineering Curriculum — Volume 4

---

### 1. Kiến trúc Client React Native & Quản lý Trạng thái với Zustand

Khi xây dựng ứng dụng di động phức tạp, bài toán đau đầu nhất của các lập trình viên là **Quản lý trạng thái (State Management)**. Nếu truyền state qua prop từ cha xuống con qua 5 tầng giao diện (Prop Drilling), code sẽ trở thành một mớ hỗn độn không thể bảo trì.

Nomadix chọn **Zustand** thay vì Redux Toolkit vì:
1. Không cần boilerplate rườm rà (không cần actions, reducers, dispatchers).
2. Tốc độ thực thi cực nhanh, dung lượng siêu nhẹ (< 1KB).
3. Đọc và ghi state trực tiếp từ bất kỳ component nào chỉ bằng 1 dòng hook.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   HỆ THỐNG ZUSTAND STORES CỦA NOMADIX                  │
├─────────────────┬──────────────────────────────────────────────────────┤
│ STORE NAME      │ TRÁCH NHIỆM QUẢN LÝ                                  │
├─────────────────┼──────────────────────────────────────────────────────┤
│ auth.store      │ Token xác thực, Thông tin User (fullName, email, DOB)│
│ booking.store   │ Chuyến bay, phòng khách sạn, vé đã đặt (bookedTickets)│
│ itinerary.store │ Danh sách chuyến đi (trips), chuyến đi active        │
│ expense.store   │ Chi tiêu nhóm, ma trận nợ, hoá đơn đã tải lên        │
│ theme.store     │ Giao diện Sáng / Tối (Light Mode / Dark Mode)        │
│ payment.store   │ Thẻ tín dụng đã lưu, thương hiệu thẻ (Visa, Master)  │
└─────────────────┴──────────────────────────────────────────────────────┘
```

#### Ví dụ Cài đặt Zustand Store chuẩn mẫu:
```javascript
// client/src/stores/booking.store.js
import { create } from 'zustand';

export const useBookingStore = create((set, get) => ({
  bookedTickets: [],
  bookedHotels: [],

  // Hành động đặt vé máy bay
  bookFlight: (flight, passengerDetails) => {
    const newTicket = {
      id: `tkt-${Date.now()}`,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      passengerName: passengerDetails.fullName,
      totalPrice: flight.price.amount,
      status: 'CONFIRMED',
    };

    set((state) => ({
      bookedTickets: [newTicket, ...state.bookedTickets],
    }));

    return newTicket;
  },

  // Xoá toàn bộ dữ liệu khi đăng xuất
  clearBookings: () => set({ bookedTickets: [], bookedHotels: [] }),
}));
```

---

### 2. Hệ Thống Thiết Kế Tương Phản Cao (Executive Monochrome Design System)

Giao diện của các ứng dụng "sinh viên" thường mắc các lỗi:
- Dùng quá nhiều màu sắc cầu vồng, xanh đỏ tím vàng hỗn loạn.
- Dùng màu pastel nhạt nhoà trên nền trắng khiến người dùng bị mỏi mắt.
- Nút bấm bị hẹp, chữ chạm viền hoặc khoảng trống trắng vô lý.

**Nomadix** chuẩn hoá toàn bộ ứng dụng theo trường phái **Executive Black-White-Slate**:

```
┌────────────────────────────────────────────────────────┐
│             BẢNG MÃ MÀU CHUẨN NOMADIX EXECUTIVE       │
├──────────────┬────────────┬────────────────────────────┤
│ TÊN MÃ MÀU   │ MÃ HEX     │ ỨNG DỤNG TRONG GIAO DIỆN   │
├──────────────┼────────────┼────────────────────────────┤
│ Navy Header  │ `#0E1B2C`  │ Dải header tối màu trên    │
│              │            │ cùng của Boarding Pass card│
├──────────────┼────────────┼────────────────────────────┤
│ Active Pill  │ `#111827`  │ Viên nang được chọn ở tab  │
│              │            │ chế độ Sáng (Chữ trắng tinh)│
├──────────────┼────────────┼────────────────────────────┤
│ Slate Dark   │ `#0F172A`  │ Nút bấm chính, Avatar, Text│
├──────────────┼────────────┼────────────────────────────┤
│ Clean Slate  │ `#F8FAFC`  │ Nền màn hình Sáng, rãnh xé │
├──────────────┼────────────┼────────────────────────────┤
│ Emerald Live │ `#10B981`  │ Huy hiệu trạng thái EDITOR │
└──────────────┴────────────┴────────────────────────────┘
```

#### Thiết kế Phân khúc Viên nang (Segmented Capsule Pills):
Thay vì các đường viền tab cổ điển, Nomadix sử dụng thanh trượt viên nang chuẩn Apple iOS:
```javascript
// client/src/components/common/SegmentedCapsule.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function SegmentedCapsule({ tabs, activeTab, onSelectTab, isDark }) {
  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1C1D21' : '#F1F5F9' }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onSelectTab(tab.id)}
            style={[
              styles.tabPill,
              isActive && {
                backgroundColor: isDark ? '#FFFFFF' : '#111827',
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                { color: isActive ? (isDark ? '#0F172A' : '#FFFFFF') : '#64748B' },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginVertical: 12,
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
```

---

### 3. Kỹ thuật Dựng Thẻ Vé Máy Bay Boarding Pass 1:1

Thẻ vé máy bay là biểu tượng nhận diện thương hiệu độc đáo nhất của Nomadix. Thẻ vé này được cấu thành từ 4 kỹ thuật đồ hoạ đặc thù:

```
┌────────────────────────────────────────────────────────┐
│ NOMADIX SQUAD BOARDING PASS                       [NX] │ ◄── Header tối màu #0E1B2C
│ HÀ NỘI EXPEDITION                                      │
├─) - - - - - - - - - - - - - - - - - - - - - - - - - (─┤ ◄── 2 Vết khuyết bán nguyệt
│ DURATION           SPOTS             ACCESS            │     & Đường đứt nét xé vé
│ 3 Days            3 Pinned           Editor            │ ◄── 3 Cột thông số
│                                                        │
│ [ nomadix.app/join/nx26                   ] [  Copy  ] │ ◄── Ô mời nhóm Monospace
└────────────────────────────────────────────────────────┘
```

#### Bí quyết tạo vết khuyết xé vé bằng CSS React Native:
Bằng cách đặt 2 hình tròn nhỏ có màu nền **trùng với màu nền màn hình** đè lên mép thẻ, ta tạo ra ảo giác vết khuyết vé máy bay hoàn hảo:

```javascript
// Trích đoạn styles trong TripCardHero.js
perforationWrap: {
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  marginVertical: 4,
  height: 20,
},
cutoutLeft: {
  position: 'absolute',
  left: -10,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#F8FAFC', // Trùng màu nền màn hình!
  zIndex: 2,
},
cutoutRight: {
  position: 'absolute',
  right: -10,
  width: 20,
  height: 20,
  borderRadius: 10,
  backgroundColor: '#F8FAFC',
  zIndex: 2,
},
dashedLine: {
  flex: 1,
  height: 1,
  borderWidth: 1,
  borderColor: '#CBD5E1',
  borderStyle: 'dashed',
  marginHorizontal: 12,
},
```

---

### 4. Điều hướng Luồng Màn hình Plan (Travel Hub vs Details)

Một bài học sâu sắc từ trải nghiệm người dùng thực tế:
- Khi người dùng bấm vào Tab **Plan**, họ muốn thấy **Trang Tổng Quan Lập Kế Hoạch (Travel Plan Hub)** gồm danh sách tất cả các chuyến đi đã tạo, kèm nút `+ New Trip`.
- **Tuyệt đối không tự động ép người dùng nhảy ngay vào màn hình chi tiết (Details)** của chuyến đi đầu tiên!
- Khi người dùng chạm vào một thẻ chuyến đi, ứng dụng mới chuyển sang xem chi tiết (Timeline, Map, Expenses).
- Tại màn hình chi tiết, **bắt buộc phải có nút `[← All Trips]`** ở góc trên bên trái để người dùng quay lại Hub bất kỳ lúc nào.

---

### 5. Bài tập Thực hành cho Học sinh

1. **Bài tập 4.1:** Sử dụng `useBookingStore`, hãy viết một component hiển thị số lượng vé đã đặt. Nếu số lượng = 0, hiển thị dòng thông báo rỗng `"No active flight tickets"` và ẩn hoàn toàn huy hiệu `1 active`.
2. **Bài tập 4.2:** Tự tạo một thẻ khách sạn (`HotelCard`) có nút bấm `Book Stay` với chiều rộng tối thiểu `minWidth: 120` và `paddingHorizontal: 24`, đảm bảo chữ bên trong không bao giờ bị chạm vào đường viền nút.
