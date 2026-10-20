/**
 * Deterministic Cache-Aside Service
 * Supports Redis with in-memory fallback for test and offline resilience.
 */
class CacheService {
  constructor(redisClient = null) {
    this.redis = redisClient;
    this.memoryStore = new Map();
  }

  getFlightKey({ origin, destination, departureDate, passengers = 1, cabinClass = 'ECONOMY' }) {
    const o = origin.toUpperCase().trim();
    const d = destination.toUpperCase().trim();
    const c = cabinClass.toUpperCase().trim();
    return `nomadix:flight:${o}_${d}_${departureDate}_${passengers}_${c}`;
  }

  getHotelKey({ city, checkIn, checkOut, guests = 2, rooms = 1 }) {
    const c = city.toLowerCase().replace(/\s+/g, '');
    return `nomadix:hotel:${c}_${checkIn}_${checkOut}_${guests}_${rooms}`;
  }

  async get(key) {
    if (this.redis) {
      try {
        const val = await this.redis.get(key);
        return val ? JSON.parse(val) : null;
      } catch (err) {
        // Fallback to memoryStore
      }
    }

    const item = this.memoryStore.get(key);
    if (!item) return null;

    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.memoryStore.delete(key);
      return null;
    }

    return item.data;
  }

  async set(key, value, ttlSeconds = 1800) {
    if (this.redis) {
      try {
        await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch (err) {
        // Fallback to memoryStore
      }
    }

    this.memoryStore.set(key, {
      data: value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  async flush() {
    if (this.redis) {
      try {
        await this.redis.flushdb();
      } catch (err) {
        // Ignore
      }
    }
    this.memoryStore.clear();
  }
}

module.exports = new CacheService();
