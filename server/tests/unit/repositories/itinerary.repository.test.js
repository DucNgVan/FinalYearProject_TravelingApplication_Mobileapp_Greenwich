const itineraryRepository = require('../../../src/repositories/itinerary.repository');

describe('Unit Test: ItineraryRepository with Mock Mongoose Model', () => {
  const mockTripDoc = {
    _id: 'mock-trip-id',
    title: 'Da Nang Trip',
    toObject: () => ({ id: 'mock-trip-id', title: 'Da Nang Trip' }),
  };

  const mockModel = {
    create: jest.fn().mockResolvedValue(mockTripDoc),
    findById: jest.fn().mockResolvedValue(mockTripDoc),
    find: jest.fn().mockResolvedValue([mockTripDoc]),
    findByIdAndUpdate: jest.fn().mockResolvedValue(mockTripDoc),
    findByIdAndDelete: jest.fn().mockResolvedValue(true),
  };

  const ItineraryRepositoryClass = itineraryRepository.constructor;
  const repoWithModel = new ItineraryRepositoryClass(mockModel);

  test('should call model methods when model is provided', async () => {
    const created = await repoWithModel.create({ title: 'Da Nang Trip' });
    expect(mockModel.create).toHaveBeenCalled();
    expect(created.title).toBe('Da Nang Trip');

    const found = await repoWithModel.findById('mock-trip-id');
    expect(mockModel.findById).toHaveBeenCalled();
    expect(found.id).toBe('mock-trip-id');

    const list = await repoWithModel.findByUser('user-1');
    expect(mockModel.find).toHaveBeenCalled();
    expect(list).toHaveLength(1);

    const updated = await repoWithModel.update('mock-trip-id', { title: 'Updated' });
    expect(mockModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(updated).toBeDefined();

    const deleted = await repoWithModel.delete('mock-trip-id');
    expect(mockModel.findByIdAndDelete).toHaveBeenCalled();
    expect(deleted).toBe(true);
  });

  test('should fallback to memory store if model throws an error', async () => {
    const mockFailingModel = {
      findById: jest.fn().mockRejectedValue(new Error('Mongo disconnected')),
      find: jest.fn().mockRejectedValue(new Error('Mongo disconnected')),
      create: jest.fn().mockRejectedValue(new Error('Mongo disconnected')),
      findByIdAndUpdate: jest.fn().mockRejectedValue(new Error('Mongo disconnected')),
      findByIdAndDelete: jest.fn().mockRejectedValue(new Error('Mongo disconnected')),
    };

    const repoFailing = new ItineraryRepositoryClass(mockFailingModel);
    const created = await repoFailing.create({ title: 'Fallback Trip' });
    expect(created.title).toBe('Fallback Trip');

    const found = await repoFailing.findById(created.id);
    expect(found).toBeDefined();
    expect(found.title).toBe('Fallback Trip');

    const updated = await repoFailing.update(created.id, { title: 'Updated Fallback' });
    expect(updated.title).toBe('Updated Fallback');

    const deleted = await repoFailing.delete(created.id);
    expect(deleted).toBe(true);
  });
});
