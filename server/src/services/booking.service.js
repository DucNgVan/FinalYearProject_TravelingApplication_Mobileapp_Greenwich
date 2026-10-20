const mockProvider = require('../providers/mock.provider');
const duffelProvider = require('../providers/duffel.provider');
const googleProvider = require('../providers/google.provider');
const normalizerService = require('./normalizer.service');
const cacheService = require('./cache.service');

class BookingService {
  /**
   * Search and aggregate flights
   */
  async searchFlights(query) {
    const {
      origin,
      destination,
      departureDate,
      passengers = 1,
      cabinClass = 'ECONOMY',
      directOnly,
      maxPrice,
      sortBy,
    } = query;

    const cacheKey = cacheService.getFlightKey({
      origin,
      destination,
      departureDate,
      passengers,
      cabinClass,
    });

    // 1. Check Redis / Memory Cache
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      const filtered = this._filterAndSortFlights(cachedData, { directOnly, maxPrice, sortBy });
      return {
        flights: filtered,
        meta: {
          totalResults: filtered.length,
          cached: true,
          dataSource: 'CACHE',
        },
      };
    }

    // 2. Fetch from External Provider with Mock Fallback
    let rawOffers = [];
    let dataSource = 'MOCK_FALLBACK';

    if (process.env.DUFFEL_API_TOKEN && process.env.NODE_ENV !== 'test') {
      try {
        rawOffers = await duffelProvider.searchFlights({
          origin,
          destination,
          departureDate,
          passengers: parseInt(passengers, 10),
          cabinClass,
        });
        dataSource = 'DUFFEL_LIVE';
      } catch (err) {
        // Fallback gracefully to mock provider
        rawOffers = await mockProvider.searchFlights({
          origin,
          destination,
          departureDate,
          passengers: parseInt(passengers, 10),
          cabinClass,
        });
        dataSource = 'MOCK_FALLBACK';
      }
    } else {
      rawOffers = await mockProvider.searchFlights({
        origin,
        destination,
        departureDate,
        passengers: parseInt(passengers, 10),
        cabinClass,
      });
    }

    // 3. Normalize and Deduplicate
    const normalized = rawOffers.map((f) => normalizerService.normalizeFlight(f));
    const deduplicated = normalizerService.deduplicateFlights(normalized);

    // 4. Store in Cache (TTL: 1800s / 30m)
    await cacheService.set(cacheKey, deduplicated, 1800);

    // 5. Apply filters & sorting
    const filtered = this._filterAndSortFlights(deduplicated, { directOnly, maxPrice, sortBy });

    return {
      flights: filtered,
      meta: {
        totalResults: filtered.length,
        cached: false,
        dataSource,
      },
    };
  }

  /**
   * Search and aggregate hotels
   */
  async searchHotels(query) {
    const {
      city,
      checkIn,
      checkOut,
      guests = 2,
      rooms = 1,
      minRating,
      maxPrice,
      sortBy,
    } = query;

    const nights = Math.max(
      1,
      Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
    );

    const cacheKey = cacheService.getHotelKey({
      city,
      checkIn,
      checkOut,
      guests,
      rooms,
    });

    // 1. Check Cache
    const cachedData = await cacheService.get(cacheKey);
    if (cachedData) {
      const filtered = this._filterAndSortHotels(cachedData, { minRating, maxPrice, sortBy });
      return {
        hotels: filtered,
        meta: {
          totalResults: filtered.length,
          cached: true,
          dataSource: 'CACHE',
        },
      };
    }

    // 2. Fetch from Provider (Google Places with resilient fallback to Mock Provider)
    let rawHotels = [];
    let dataSource = 'MOCK_PROVIDER';

    if (process.env.GOOGLE_PLACES_API_KEY && process.env.NODE_ENV !== 'test') {
      try {
        rawHotels = await googleProvider.searchHotels({
          city,
          checkIn,
          checkOut,
          guests: parseInt(guests, 10),
        });
        if (rawHotels && rawHotels.length > 0) {
          dataSource = 'GOOGLE_PLACES_LIVE';
        } else {
          rawHotels = await mockProvider.searchHotels({
            city,
            checkIn,
            checkOut,
            guests: parseInt(guests, 10),
            rooms: parseInt(rooms, 10),
          });
          dataSource = 'MOCK_PROVIDER';
        }
      } catch (err) {
        rawHotels = await mockProvider.searchHotels({
          city,
          checkIn,
          checkOut,
          guests: parseInt(guests, 10),
          rooms: parseInt(rooms, 10),
        });
        dataSource = 'MOCK_PROVIDER';
      }
    } else {
      rawHotels = await mockProvider.searchHotels({
        city,
        checkIn,
        checkOut,
        guests: parseInt(guests, 10),
        rooms: parseInt(rooms, 10),
      });
      dataSource = 'MOCK_PROVIDER';
    }

    // 3. Normalize
    const normalized = rawHotels.map((h) => normalizerService.normalizeHotel(h, nights));

    // 4. Store in Cache (TTL: 3600s / 60m)
    await cacheService.set(cacheKey, normalized, 3600);

    // 5. Filter and Sort
    const filtered = this._filterAndSortHotels(normalized, { minRating, maxPrice, sortBy });

    return {
      hotels: filtered,
      meta: {
        totalResults: filtered.length,
        cached: false,
        dataSource: 'MOCK_PROVIDER',
      },
    };
  }

  _filterAndSortFlights(flights, { directOnly, maxPrice, sortBy }) {
    let result = [...flights];

    if (directOnly === true || directOnly === 'true') {
      result = result.filter((f) => f.stops === 0);
    }

    if (maxPrice) {
      const ceiling = parseFloat(maxPrice);
      if (!isNaN(ceiling)) {
        result = result.filter((f) => f.price.amount <= ceiling);
      }
    }

    if (sortBy === 'price:asc') {
      result.sort((a, b) => a.price.amount - b.price.amount);
    } else if (sortBy === 'price:desc') {
      result.sort((a, b) => b.price.amount - a.price.amount);
    } else if (sortBy === 'duration:asc') {
      result.sort((a, b) => a.durationMinutes - b.durationMinutes);
    }

    return result;
  }

  _filterAndSortHotels(hotels, { minRating, maxPrice, sortBy }) {
    let result = [...hotels];

    if (minRating) {
      const minStars = parseFloat(minRating);
      if (!isNaN(minStars)) {
        result = result.filter((h) => h.starRating >= minStars);
      }
    }

    if (maxPrice) {
      const ceiling = parseFloat(maxPrice);
      if (!isNaN(ceiling)) {
        result = result.filter((h) => h.pricePerNight <= ceiling);
      }
    }

    if (sortBy === 'price:asc') {
      result.sort((a, b) => a.pricePerNight - b.pricePerNight);
    } else if (sortBy === 'price:desc') {
      result.sort((a, b) => b.pricePerNight - a.pricePerNight);
    } else if (sortBy === 'rating:desc') {
      result.sort((a, b) => b.reviewScore - a.reviewScore);
    }

    return result;
  }
}

module.exports = new BookingService();
