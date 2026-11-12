import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HotelSearchScreen from '../../src/screens/booking/HotelSearchScreen';
import { useBookingStore } from '../../src/stores/booking.store';

jest.mock('../../src/stores/booking.store');

describe('Component Test: HotelSearchScreen Date Picker & Single Error Banner', () => {
  const mockSearchHotels = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useBookingStore.mockReturnValue({
      hotels: [],
      isLoadingHotels: false,
      hotelError: null,
      searchHotels: mockSearchHotels,
    });
  });

  test('RED-HOTEL-CAL-01: tapping Check-in opens CalendarPickerModal for check-in', () => {
    const { getByTestId, queryByTestId, getByText } = render(<HotelSearchScreen />);

    // Expand if collapsed
    const editBtn = getByText('Edit');
    fireEvent.press(editBtn);

    // Trigger check-in calendar
    const checkInTrigger = getByTestId('date-picker-trigger-checkin');
    fireEvent.press(checkInTrigger);

    // Check-in modal should be visible
    expect(getByTestId('cal-modal-checkin')).toBeTruthy();
  });

  test('RED-HOTEL-CAL-02: tapping Check-out opens CalendarPickerModal for check-out', () => {
    const { getByTestId, queryByTestId, getByText } = render(<HotelSearchScreen />);

    // Expand if collapsed
    const editBtn = getByText('Edit');
    fireEvent.press(editBtn);

    // Trigger check-out calendar
    const checkOutTrigger = getByTestId('date-picker-trigger-checkout');
    fireEvent.press(checkOutTrigger);

    expect(getByTestId('cal-modal-checkout')).toBeTruthy();
  });

  test('RED-HOTEL-NO-DOUBLE-ERR-01: renders only a single error message banner when hotelError is present in both collapsed and expanded states', () => {
    useBookingStore.mockReturnValue({
      hotels: [],
      isLoadingHotels: false,
      hotelError: 'No hotels found for the selected dates',
      searchHotels: mockSearchHotels,
    });

    const { getAllByText, getByText } = render(<HotelSearchScreen />);

    // In collapsed state:
    expect(getAllByText('No hotels found for the selected dates').length).toBe(1);

    // Expand search box:
    fireEvent.press(getByText('Edit'));

    // In expanded state, there must STILL be only 1 error banner rendered (no duplicate inside + outside box):
    const errorsExpanded = getAllByText('No hotels found for the selected dates');
    expect(errorsExpanded.length).toBe(1);
  });

  test('RED-HOTEL-CAL-COLLAPSED-01: tapping collapsed calendar summary row opens CalendarPickerModal directly', () => {
    const { getByTestId } = render(<HotelSearchScreen />);

    // Tap collapsed calendar summary trigger
    const collapsedCalendarTrigger = getByTestId('date-picker-trigger-checkin-collapsed');
    fireEvent.press(collapsedCalendarTrigger);

    // Calendar modal for checkin opens
    expect(getByTestId('cal-modal-checkin')).toBeTruthy();
  });

  test('RED-HOTEL-CITY-CHIP-NO-DEST-01: clicking city quick chip calls searchHotels with city and without destination property', () => {
    const { getByText } = render(<HotelSearchScreen />);

    const chipDaLat = getByText('Đà Lạt');
    fireEvent.press(chipDaLat);

    expect(mockSearchHotels).toHaveBeenCalledTimes(1);
    const calledArgs = mockSearchHotels.mock.calls[0][0];
    expect(calledArgs).toHaveProperty('city', 'Đà Lạt');
    expect(calledArgs).not.toHaveProperty('destination');
  });

  test('RED-HOTEL-NO-UNCAUGHT-PROMISE-01: clicking city quick chip catches rejected promise safely', () => {
    mockSearchHotels.mockRejectedValueOnce(new Error('Network error'));
    const { getByText } = render(<HotelSearchScreen />);

    const chipDaLat = getByText('Đà Lạt');
    // Must not throw uncaught error
    expect(() => {
      fireEvent.press(chipDaLat);
    }).not.toThrow();
  });
});
