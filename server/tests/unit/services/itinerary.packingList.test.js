const itineraryService = require('../../../src/services/itinerary.service');
const itineraryRepository = require('../../../src/repositories/itinerary.repository');

describe('Unit Test: ItineraryService (Trip Packing Checklist Persistence)', () => {
  let tripId;

  beforeEach(async () => {
    const trip = await itineraryService.createItinerary({
      userId: 'user-pck-1',
      title: 'Da Nang Squad Adventure',
      destination: 'Da Nang',
      startDate: '2026-11-20',
      endDate: '2026-11-24',
    });
    tripId = trip.id;
  });

  it('RED-PCK-01: should add new packing item and persist in trip document', async () => {
    const item = await itineraryService.addPackingItem(tripId, {
      title: 'Powerbank 20,000mAh',
      category: 'Electronics',
      assignee: 'Duc',
    });

    expect(item.id).toBeDefined();
    expect(item.title).toBe('Powerbank 20,000mAh');
    expect(item.checked).toBe(false);

    const list = await itineraryService.getPackingList(tripId);
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe('Powerbank 20,000mAh');
  });

  it('RED-PCK-02: should toggle packing item checked status', async () => {
    const item = await itineraryService.addPackingItem(tripId, {
      title: 'First Aid Kit',
      category: 'Medical',
      assignee: 'Sarah',
    });

    const toggled = await itineraryService.togglePackingItem(tripId, item.id);
    expect(toggled.checked).toBe(true);

    const toggledBack = await itineraryService.togglePackingItem(tripId, item.id);
    expect(toggledBack.checked).toBe(false);
  });

  it('RED-PCK-03: should delete packing item from trip document', async () => {
    const item = await itineraryService.addPackingItem(tripId, {
      title: 'Passport',
      category: 'Documents',
      assignee: 'All',
    });

    await itineraryService.deletePackingItem(tripId, item.id);
    const list = await itineraryService.getPackingList(tripId);
    expect(list.find((i) => i.id === item.id)).toBeUndefined();
  });
});
