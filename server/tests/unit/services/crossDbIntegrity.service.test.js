// RED state test: crossDbIntegrity.service does not exist yet
const crossDbIntegrityService = require('../../../src/services/crossDbIntegrity.service');

describe('Unit Test: Cross-Database Consistency Guard (TDD Phase 3)', () => {
  let mockMongoRepo;
  let mockPgExpenseRepo;

  beforeEach(() => {
    mockMongoRepo = {
      findById: jest.fn(),
      deleteById: jest.fn().mockResolvedValue(true),
    };
    mockPgExpenseRepo = {
      findExpensesByTripId: jest.fn(),
      findAllTripIdsWithExpenses: jest.fn(),
    };
  });

  test('RED-CDB-01: findOrphanExpenses() should detect PostgreSQL expenses referencing non-existent MongoDB trips', async () => {
    // PG has expenses for trip_1 and trip_orphan
    mockPgExpenseRepo.findAllTripIdsWithExpenses.mockResolvedValue(['trip_1', 'trip_orphan']);
    // Mongo has trip_1, but NOT trip_orphan
    mockMongoRepo.findById.mockImplementation(async (id) => {
      if (id === 'trip_1') return { _id: 'trip_1', title: 'Valid Trip' };
      return null;
    });

    const result = await crossDbIntegrityService.findOrphanTripExpenses({
      mongoRepo: mockMongoRepo,
      pgRepo: mockPgExpenseRepo,
    });

    expect(result.hasOrphans).toBe(true);
    expect(result.orphanTripIds).toEqual(['trip_orphan']);
  });

  test('RED-CDB-02: verifyTripConsistency() should return consistent: true when trip exists in both databases', async () => {
    mockMongoRepo.findById.mockResolvedValue({
      _id: 'trip_123',
      title: 'Hoi An Ancient Town 3N2D',
      collaborators: [{ userId: 'usr_1', role: 'OWNER' }],
    });
    mockPgExpenseRepo.findExpensesByTripId.mockResolvedValue([
      { id: 'exp_1', trip_id: 'trip_123', amount: 500000 },
    ]);

    const verification = await crossDbIntegrityService.verifyTripConsistency('trip_123', {
      mongoRepo: mockMongoRepo,
      pgRepo: mockPgExpenseRepo,
    });

    expect(verification.consistent).toBe(true);
    expect(verification.issues).toHaveLength(0);
    expect(verification.tripTitle).toBe('Hoi An Ancient Town 3N2D');
  });

  test('RED-CDB-03: compensateTripCreationFailure() should delete MongoDB itinerary if PostgreSQL initialization fails', async () => {
    const tripId = 'trip_temp_999';
    const errorToCatch = new Error('PostgreSQL connection timeout during member seeding');

    const result = await crossDbIntegrityService.executeWithCompensation({
      primaryAction: async () => ({ id: tripId }),
      secondaryAction: async () => {
        throw errorToCatch;
      },
      compensateAction: async () => {
        await mockMongoRepo.deleteById(tripId);
      },
    });

    expect(result.success).toBe(false);
    expect(result.compensated).toBe(true);
    expect(mockMongoRepo.deleteById).toHaveBeenCalledWith(tripId);
    expect(result.error).toBe(errorToCatch.message);
  });
});
