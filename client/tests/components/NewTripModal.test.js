import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewTripModal from '../../src/components/plan/NewTripModal';

describe('NewTripModal Component (RED Phase)', () => {
  const mockOnClose = jest.fn();
  const mockOnCreateTrip = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-NEWTRIP-01: Renders destination selector, number of days, schedule, interest chips and place of stay', () => {
    const { getByTestId, getByText } = render(
      <NewTripModal
        visible={true}
        onClose={mockOnClose}
        onCreateTrip={mockOnCreateTrip}
      />
    );

    // Title & Destination
    expect(getByText('New Trip')).toBeTruthy();
    expect(getByTestId('newtrip-destination-picker')).toBeTruthy();

    // Days & Start date
    expect(getByTestId('newtrip-days-input')).toBeTruthy();
    expect(getByTestId('newtrip-start-date-picker')).toBeTruthy();

    // Schedule window
    expect(getByTestId('newtrip-schedule-from')).toBeTruthy();
    expect(getByTestId('newtrip-schedule-to')).toBeTruthy();

    // 8 Interest pills
    expect(getByTestId('newtrip-interest-history')).toBeTruthy();
    expect(getByTestId('newtrip-interest-nature')).toBeTruthy();
    expect(getByTestId('newtrip-interest-architecture')).toBeTruthy();
    expect(getByTestId('newtrip-interest-shopping')).toBeTruthy();
    expect(getByTestId('newtrip-interest-art')).toBeTruthy();
    expect(getByTestId('newtrip-interest-beaches')).toBeTruthy();
    expect(getByTestId('newtrip-interest-adventure')).toBeTruthy();
    expect(getByTestId('newtrip-interest-local-culture')).toBeTruthy();

    // Place of stay & Create button
    expect(getByTestId('newtrip-stay-input')).toBeTruthy();
    expect(getByTestId('newtrip-submit-btn')).toBeTruthy();
  });

  test('RED-NEWTRIP-02: Opens city selection bottom sheet, searches, and selects a city', () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <NewTripModal
        visible={true}
        onClose={mockOnClose}
        onCreateTrip={mockOnCreateTrip}
      />
    );

    // Open City Picker sheet
    fireEvent.press(getByTestId('newtrip-destination-picker'));
    expect(getByTestId('city-picker-sheet')).toBeTruthy();
    expect(getByText('Select City')).toBeTruthy();

    // Search for Tokyo
    const searchInput = getByTestId('city-picker-search-input');
    fireEvent.changeText(searchInput, 'Tokyo');

    // Select Tokyo
    const tokyoOption = getByTestId('city-option-tokyo');
    fireEvent.press(tokyoOption);

    // Sheet should close and destination display Tokyo
    expect(getByText(/Tokyo/i)).toBeTruthy();
  });

  test('RED-NEWTRIP-03: Toggles interest chips and submits trip with complete payload', () => {
    const { getByTestId } = render(
      <NewTripModal
        visible={true}
        onClose={mockOnClose}
        onCreateTrip={mockOnCreateTrip}
      />
    );

    // Select City
    fireEvent.press(getByTestId('newtrip-destination-picker'));
    fireEvent.press(getByTestId('city-option-paris'));

    // Toggle interests (Nature & Art)
    fireEvent.press(getByTestId('newtrip-interest-nature'));
    fireEvent.press(getByTestId('newtrip-interest-art'));

    // Set stay address
    fireEvent.changeText(getByTestId('newtrip-stay-input'), 'Khai Tri Hotel');

    // Submit
    fireEvent.press(getByTestId('newtrip-submit-btn'));

    expect(mockOnCreateTrip).toHaveBeenCalledTimes(1);
    expect(mockOnCreateTrip).toHaveBeenCalledWith(
      expect.objectContaining({
        city: expect.stringMatching(/Paris/i),
        interests: expect.arrayContaining(['Nature', 'Art']),
        stayAddress: 'Khai Tri Hotel',
      })
    );
  });
});
