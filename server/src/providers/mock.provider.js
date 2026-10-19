const crypto = require('crypto');

/**
 * Mock Booking Provider for Vietnam Domestic Flights and Hotels
 * Provides high-fidelity, realistic localized data with guaranteed availability.
 */
class MockBookingProvider {
  /**
   * Search domestic flights
   */
  async searchFlights({ origin, destination, departureDate, passengers = 1, cabinClass = 'ECONOMY' }) {
    const datePrefix = departureDate;
    const flightCatalog = [
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VNA',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/VN.png',
        aircraft: 'Boeing 787-9 Dreamliner',
        baggageSummary: '1 kiện ký gửi (23kg) • 1 kiện xách tay (12kg)',
        emissionsKg: '52',
        flightNumber: 'VN-128',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T08:00:00Z`,
        arrivalTime: `${datePrefix}T09:30:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 1450000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VIETJET',
        airlineCode: 'VJ',
        airlineName: 'Vietjet Air',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/VJ.png',
        aircraft: 'Airbus A321',
        baggageSummary: '1 kiện ký gửi (20kg) • 1 kiện xách tay (7kg)',
        emissionsKg: '45',
        flightNumber: 'VJ-502',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T10:15:00Z`,
        arrivalTime: `${datePrefix}T11:45:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 980000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_BAMBOO',
        airlineCode: 'QH',
        airlineName: 'Bamboo Airways',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/QH.png',
        aircraft: 'Airbus A321NEO',
        baggageSummary: '1 kiện ký gửi (20kg) • 1 kiện xách tay (7kg)',
        emissionsKg: '46',
        flightNumber: 'QH-154',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T14:00:00Z`,
        arrivalTime: `${datePrefix}T15:30:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 1250000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VIETJET',
        airlineCode: 'VJ',
        airlineName: 'Vietjet Air',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/VJ.png',
        aircraft: 'Airbus A320',
        baggageSummary: '1 kiện xách tay (7kg)',
        emissionsKg: '50',
        flightNumber: 'VJ-518',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T17:30:00Z`,
        arrivalTime: `${datePrefix}T20:00:00Z`,
        durationMinutes: 150,
        stops: 1,
        baggageTransfer: 'Chuyển hành lý tự động',
        baggageTransferType: 'automatic',
        cabinClass,
        price: {
          currency: 'VND',
          amount: 850000 * passengers,
        },
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_VNA',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        airlineLogo: 'https://images.kiwi.com/airlines/64x64/VN.png',
        aircraft: 'Airbus A350-900',
        baggageSummary: '1 kiện ký gửi (23kg) • 1 kiện xách tay (12kg)',
        emissionsKg: '49',
        flightNumber: 'VN-136',
        origin: origin.toUpperCase(),
        destination: destination.toUpperCase(),
        departureTime: `${datePrefix}T19:00:00Z`,
        arrivalTime: `${datePrefix}T20:30:00Z`,
        durationMinutes: 90,
        stops: 0,
        cabinClass,
        price: {
          currency: 'VND',
          amount: 1650000 * passengers,
        },
      },
    ];

    return flightCatalog;
  }

  /**
   * Search domestic accommodations
   */
  async searchHotels({ city, checkIn, checkOut, guests = 2, rooms = 1 }) {
    const cleanCity = (city || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '');

    const allHotels = [
      // Đà Lạt
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Ana Mandara Villas Dalat Resort',
        city: 'Đà Lạt',
        cityKey: 'dalat',
        address: 'Đường Lê Lai, Phường 5, TP. Đà Lạt',
        starRating: 5,
        reviewScore: 9.6,
        pricePerNight: 3200000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Hôtel Colline Đà Lạt',
        city: 'Đà Lạt',
        cityKey: 'dalat',
        address: '10 Phan Bội Châu, Phường 2, TP. Đà Lạt',
        starRating: 4,
        reviewScore: 9.1,
        pricePerNight: 1450000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Dalat Edensee Lake Resort & Spa',
        city: 'Đà Lạt',
        cityKey: 'dalat',
        address: 'Khu du lịch Hồ Tuyền Lâm, TP. Đà Lạt',
        starRating: 5,
        reviewScore: 9.4,
        pricePerNight: 2600000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
      },
      // Đà Nẵng
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Vinpearl Resort & Spa Da Nang',
        city: 'Đà Nẵng',
        cityKey: 'danang',
        address: '23 Truong Sa, Hoa Hai, Ngu Hanh Son, Da Nang',
        starRating: 5,
        reviewScore: 9.3,
        pricePerNight: 2800000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Novotel Danang Premier Han River',
        city: 'Đà Nẵng',
        cityKey: 'danang',
        address: '36 Bach Dang, Thach Thang, Hai Chau, Da Nang',
        starRating: 4,
        reviewScore: 8.8,
        pricePerNight: 1750000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
      },
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'InterContinental Danang Sun Peninsula Resort',
        city: 'Đà Nẵng',
        cityKey: 'danang',
        address: 'Bai Bac, Son Tra Peninsula, Da Nang',
        starRating: 5,
        reviewScore: 9.6,
        pricePerNight: 8500000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
      },
      // Hà Nội
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'InterContinental Hanoi Westlake',
        city: 'Hà Nội',
        cityKey: 'hanoi',
        address: '05 Từ Hoa, Quảng An, Tây Hồ, Hà Nội',
        starRating: 5,
        reviewScore: 9.5,
        pricePerNight: 3500000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
      },
      // TP. Hồ Chí Minh
      {
        id: crypto.randomUUID(),
        provider: 'MOCK_HOTEL_PROVIDER',
        name: 'Vinpearl Luxury Landmark 81',
        city: 'TP. Hồ Chí Minh',
        cityKey: 'hochiminh',
        address: '720A Điện Biên Phủ, Bình Thạnh, TP. HCM',
        starRating: 5,
        reviewScore: 9.7,
        pricePerNight: 4200000 * rooms,
        currency: 'VND',
        thumbnailUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600',
      },
    ];

    const matchedHotels = allHotels.filter(
      (h) => h.cityKey.includes(cleanCity) || cleanCity.includes(h.cityKey)
    );

    return matchedHotels.length > 0 ? matchedHotels : allHotels;
  }
}

module.exports = new MockBookingProvider();
