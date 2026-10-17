const userRepository = require('../../../src/repositories/user.repository');

describe('Unit Test: UserRepository with Mock Database Pool', () => {
  test('should query pool when pool is provided to UserRepository', async () => {
    const mockUser = {
      id: 'mock-uuid',
      email: 'mock@nomadix.vn',
      role: 'traveler',
      password_hash: 'hash',
    };

    const mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [mockUser] }),
    };

    const UserRepositoryClass = userRepository.constructor;
    const repoWithPool = new UserRepositoryClass(mockPool);

    // Test findByEmail with pool
    const found = await repoWithPool.findByEmail('mock@nomadix.vn');
    expect(mockPool.query).toHaveBeenCalled();
    expect(found.id).toBe(mockUser.id);

    // Test create with pool
    const created = await repoWithPool.create({
      email: 'mock@nomadix.vn',
      passwordHash: 'hash',
      fullName: 'Mock User',
    });
    expect(created.email).toBe('mock@nomadix.vn');

    // Test saveRefreshToken with pool
    const savedToken = await repoWithPool.saveRefreshToken({
      userId: 'mock-uuid',
      tokenHash: 'sha256hash',
      expiresAt: new Date(),
    });
    expect(savedToken.token_hash).toBe('sha256hash');

    // Test findByEmail when user is not found in pool
    const mockEmptyPool = {
      query: jest.fn().mockResolvedValue({ rows: [] }),
    };
    const emptyRepo = new UserRepositoryClass(mockEmptyPool);
    const notFound = await emptyRepo.findByEmail('missing@nomadix.vn');
    expect(notFound).toBeNull();
  });

  test('should fallback to memory store if pool throws error', async () => {
    const mockFailingPool = {
      query: jest.fn().mockRejectedValue(new Error('DB Connection Refused')),
    };

    const UserRepositoryClass = userRepository.constructor;
    const repoFailingPool = new UserRepositoryClass(mockFailingPool);

    // Should not throw, should fallback to memory
    const user = await repoFailingPool.findByEmail('traveler@nomadix.vn');
    expect(user).toBeDefined();
    expect(user.email).toBe('traveler@nomadix.vn');
  });
});
