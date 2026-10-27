const Itinerary = require('../../../src/models/itinerary.model');

describe('Unit Test: Itinerary Mongoose Model', () => {
  test('should compile Itinerary model with correct schema properties', () => {
    expect(Itinerary).toBeDefined();
    expect(Itinerary.modelName).toBe('Itinerary');
    expect(Itinerary.schema.paths.title).toBeDefined();
    expect(Itinerary.schema.paths.destinationCity).toBeDefined();
    expect(Itinerary.schema.paths.totalDays).toBeDefined();
    expect(Itinerary.schema.paths.collaborators).toBeDefined();
    expect(Itinerary.schema.paths.days).toBeDefined();
  });
});
