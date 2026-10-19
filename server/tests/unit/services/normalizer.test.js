const {
  normalizeFlight,
  deduplicateFlights,
  normalizeHotel,
} = require('../../../src/services/normalizer.service');

describe('Unit Test: Booking Data Normalizer & Deduplication Service', () => {
  describe('Flight Normalization & Deduplication', () => {
    test('RED-BK-01: normalizeFlight should standardize raw flight data to UnifiedFlight schema', () => {
      const rawAmadeusFlight = {
        id: 'amadeus-flight-101',
        provider: 'AMADEUS',
        airlineCode: 'VN',
        airlineName: 'Vietnam Airlines',
        flightNumber: 'VN-123',
        origin: 'HAN',
        destination: 'DAD',
        departureTime: '2026-11-20T08:30:00Z',
        arrivalTime: '2026-11-20T10:00:00Z',
        durationMinutes: 90,
        stops: 0,
        cabinClass: 'ECONOMY',
        price: {
          currency: 'VND',
          amount: 1550000,
        },
      };

      const normalized = normalizeFlight(rawAmadeusFlight);

      expect(normalized).toBeDefined();
      expect(normalized.id).toBeDefined();
      expect(normalized.provider).toBe('AMADEUS');
      expect(normalized.flightNumber).toBe('VN-123');
      expect(normalized.origin).toBe('HAN');
      expect(normalized.destination).toBe('DAD');
      expect(normalized.durationMinutes).toBe(90);
      expect(normalized.price.currency).toBe('VND');
      expect(normalized.price.amount).toBe(1550000);
      expect(normalized.stops).toBe(0);
      expect(normalized.airlineLogo).toBeDefined();
      expect(normalized.aircraft).toBeDefined();
      expect(normalized.baggageSummary).toBeDefined();
    });

    test('should parse ISO 8601 duration strings like PT2H15M in normalizeFlight', () => {
      const flightWithIso = {
        airlineCode: 'VN',
        flightNumber: 'VN-200',
        duration: 'PT2H15M',
        price: { amount: 1000000 },
      };

      const normalized = normalizeFlight(flightWithIso);
      expect(normalized.durationMinutes).toBe(135);
      expect(normalized.provider).toBe('UNKNOWN');
      expect(normalized.cabinClass).toBe('ECONOMY');
    });

    test('RED-BE-FLT-02: normalizeFlight should retain and normalize baggageTransfer and baggageTransferType for connecting flights', () => {
      const transitRawFlight = {
        airlineCode: 'VJ',
        flightNumber: 'VJ-304',
        origin: 'SGN',
        destination: 'HAN',
        stops: 1,
        baggageTransfer: 'Chuyển hành lý tự động',
        baggageTransferType: 'automatic',
        price: { amount: 1500000 },
      };

      const normalized = normalizeFlight(transitRawFlight);
      expect(normalized.stops).toBe(1);
      expect(normalized.baggageTransfer).toBe('Chuyển hành lý tự động');
      expect(normalized.baggageTransferType).toBe('automatic');
    });

    test('RED-BK-02: deduplicateFlights should remove duplicate flights favoring the lowest price', () => {
      const duplicateOfferA = {
        id: 'offer-1',
        provider: 'AMADEUS',
        airlineCode: 'VN',
        flightNumber: 'VN-128',
        origin: 'HAN',
        destination: 'DAD',
        departureTime: '2026-11-20T08:00:00Z',
        price: { currency: 'VND', amount: 1600000 },
      };

      const duplicateOfferB = {
        id: 'offer-2',
        provider: 'RAPIDAPI',
        airlineCode: 'VN',
        flightNumber: 'VN-128',
        origin: 'HAN',
        destination: 'DAD',
        departureTime: '2026-11-20T08:00:00Z',
        price: { currency: 'VND', amount: 1350000 }, // Cheaper
      };

      const uniqueOfferC = {
        id: 'offer-3',
        provider: 'AMADEUS',
        airlineCode: 'VJ',
        flightNumber: 'VJ-502',
        origin: 'HAN',
        destination: 'DAD',
        departureTime: '2026-11-20T11:00:00Z',
        price: { currency: 'VND', amount: 980000 },
      };

      const deduplicated = deduplicateFlights([duplicateOfferA, duplicateOfferB, uniqueOfferC]);

      expect(deduplicated).toHaveLength(2);
      // Ensure the cheaper VN-128 offer (offer-2) was kept
      const vn128 = deduplicated.find((f) => f.flightNumber === 'VN-128');
      expect(vn128).toBeDefined();
      expect(vn128.price.amount).toBe(1350000);
      expect(vn128.provider).toBe('RAPIDAPI');
    });
  });

  describe('Hotel Normalization', () => {
    test('RED-BK-03: normalizeHotel should compute total price from pricePerNight and nights', () => {
      const rawHotel = {
        id: 'hotel-vinpearl-danang',
        provider: 'RAPIDAPI',
        name: 'Vinpearl Resort & Spa Da Nang',
        city: 'DaNang',
        address: '23 Truong Sa, Hoa Hai, Ngu Hanh Son, Da Nang',
        starRating: 5,
        reviewScore: 9.2,
        pricePerNight: 2500000,
        currency: 'VND',
        thumbnailUrl: 'https://images.nomadix.vn/hotels/vinpearl.jpg',
      };

      const nights = 3;
      const normalized = normalizeHotel(rawHotel, nights);

      expect(normalized).toBeDefined();
      expect(normalized.name).toBe('Vinpearl Resort & Spa Da Nang');
      expect(normalized.starRating).toBe(5);
      expect(normalized.pricePerNight).toBe(2500000);
      expect(normalized.totalPrice).toBe(7500000); // 2,500,000 * 3
      expect(normalized.nights).toBe(3);
    });
  });
});
