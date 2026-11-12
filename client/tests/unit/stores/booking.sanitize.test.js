import { useBookingStore } from '../../../src/stores/booking.store';
import apiClient from '../../../src/api/client';

jest.mock('../../../src/api/client');

describe('Unit Test: Booking Store searchHotels Parameter Sanitization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-HOTEL-STORE-PARAM-01: searchHotels strips redundant destination parameter when city is present', async () => {
    apiClient.get.mockResolvedValueOnce([]);

    await useBookingStore.getState().searchHotels({
      city: 'Đà Lạt',
      destination: 'Đà Lạt',
      checkIn: '2026-11-14',
      checkOut: '2026-11-17',
      guests: 2,
    });

    expect(apiClient.get).toHaveBeenCalledWith('/hotels/search', {
      params: {
        city: 'Đà Lạt',
        checkIn: '2026-11-14',
        checkOut: '2026-11-17',
        guests: 2,
      },
    });
    // destination must not be sent to apiClient.get
    const calledParams = apiClient.get.mock.calls[0][1].params;
    expect(calledParams).not.toHaveProperty('destination');
  });
});
