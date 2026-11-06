import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightFilterModal from '../../src/components/booking/FlightFilterModal';

describe('Component Test: FlightFilterModal', () => {
  const initialFilters = {
    sortBy: 'price',
    showDirect: true,
    showTransit: true,
    hasBaggage: false,
    maxPrice: 7000000,
  };

  test('RED-FE-FLT-01: renders international filters (Bay thẳng, Nối chuyến, Hành lý nhiều, Giá rẻ, Bay sớm, Bay muộn) and NO local airlines', () => {
    const { getByText, queryByText } = render(
      <FlightFilterModal
        visible={true}
        filters={initialFilters}
        onClose={jest.fn()}
        onApply={jest.fn()}
        onReset={jest.fn()}
      />
    );

    expect(getByText(/Flight Filters|Bộ Lọc Chuyến Bay/i)).toBeTruthy();
    expect(getByText(/Cheapest|Giá rẻ nhất/i)).toBeTruthy();
    expect(getByText(/Early Flight|Bay sớm/i)).toBeTruthy();
    expect(getByText(/Late Flight|Bay muộn/i)).toBeTruthy();
    expect(getByText(/Direct|Bay thẳng/i)).toBeTruthy();
    expect(getByText(/Connecting|Nối chuyến/i)).toBeTruthy();
    expect(getByText(/Includes Checked Baggage|Hành lý nhiều|Có hành lý ký gửi/i)).toBeTruthy();

    // Verify local airlines are NOT present
    expect(queryByText(/VietJet Air/i)).toBeNull();
    expect(queryByText(/Vietnam Airlines/i)).toBeNull();
  });

  test('RED-FE-FLT-02: triggers onApply with new filter criteria (Bay muộn, Hành lý nhiều) when applied', () => {
    const onApplyMock = jest.fn();
    const { getByText } = render(
      <FlightFilterModal
        visible={true}
        filters={initialFilters}
        onClose={jest.fn()}
        onApply={onApplyMock}
        onReset={jest.fn()}
      />
    );

    const sortLateBtn = getByText(/Late Flight|Bay muộn/i);
    fireEvent.press(sortLateBtn);

    const baggageToggle = getByText(/Includes Checked Baggage|Hành lý nhiều|Có hành lý ký gửi/i);
    fireEvent.press(baggageToggle);

    const applyBtn = getByText(/Apply Filters|Áp dụng bộ lọc/i);
    fireEvent.press(applyBtn);

    expect(onApplyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: 'departure_late',
        hasBaggage: true,
      })
    );
  });

  test('RED-FE-FLT-03: triggers onReset when reset button is tapped', () => {
    const onResetMock = jest.fn();
    const { getByText } = render(
      <FlightFilterModal
        visible={true}
        filters={initialFilters}
        onClose={jest.fn()}
        onApply={jest.fn()}
        onReset={onResetMock}
      />
    );

    const resetBtn = getByText(/Reset|Đặt lại/i);
    fireEvent.press(resetBtn);

    expect(onResetMock).toHaveBeenCalledTimes(1);
  });

  test('toggles flight types, baggage filter, and closes modal', () => {
    const onCloseMock = jest.fn();
    const onApplyMock = jest.fn();
    const { getByText } = render(
      <FlightFilterModal
        visible={true}
        filters={initialFilters}
        onClose={onCloseMock}
        onApply={onApplyMock}
        onReset={jest.fn()}
      />
    );

    // Toggle types
    fireEvent.press(getByText(/Direct|Bay thẳng/i));
    fireEvent.press(getByText(/Connecting|Nối chuyến/i));

    // Toggle baggage
    fireEvent.press(getByText(/Includes Checked Baggage|Hành lý nhiều|Có hành lý ký gửi/i));

    // Close button
    fireEvent.press(getByText('✕'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
