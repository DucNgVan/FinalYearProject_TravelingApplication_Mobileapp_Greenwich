const cacheService = require('../../../src/services/cache.service');

describe('Unit Test: CacheService', () => {
  beforeEach(async () => {
    await cacheService.flush();
  });

  test('should return null and evict expired items in memoryStore', async () => {
    await cacheService.set('short_lived_key', { test: true }, -1); // Expired immediately
    const result = await cacheService.get('short_lived_key');
    expect(result).toBeNull();
  });

  test('should operate with mock Redis client when redis is provided', async () => {
    const mockStore = new Map();
    const mockRedis = {
      get: jest.fn().mockImplementation(async (k) => mockStore.get(k) || null),
      set: jest.fn().mockImplementation(async (k, v) => mockStore.set(k, v)),
      flushdb: jest.fn().mockImplementation(async () => mockStore.clear()),
    };

    const CacheServiceClass = cacheService.constructor;
    const redisCache = new CacheServiceClass(mockRedis);

    await redisCache.set('redis_key', { msg: 'hello' }, 100);
    expect(mockRedis.set).toHaveBeenCalled();

    const data = await redisCache.get('redis_key');
    expect(mockRedis.get).toHaveBeenCalled();
    expect(data.msg).toBe('hello');

    // Test Redis cache miss returning null
    mockRedis.get.mockResolvedValueOnce(null);
    const miss = await redisCache.get('missing_redis_key');
    expect(miss).toBeNull();

    await redisCache.flush();
    expect(mockRedis.flushdb).toHaveBeenCalled();
  });

  test('should fallback to memoryStore when redis throws error', async () => {
    const mockFailingRedis = {
      get: jest.fn().mockRejectedValue(new Error('Redis down')),
      set: jest.fn().mockRejectedValue(new Error('Redis down')),
      flushdb: jest.fn().mockRejectedValue(new Error('Redis down')),
    };

    const CacheServiceClass = cacheService.constructor;
    const fallbackCache = new CacheServiceClass(mockFailingRedis);

    await fallbackCache.set('fallback_key', { fallback: true }, 100);
    const data = await fallbackCache.get('fallback_key');
    expect(data.fallback).toBe(true);

    await fallbackCache.flush();
    const flushed = await fallbackCache.get('fallback_key');
    expect(flushed).toBeNull();
  });
});
