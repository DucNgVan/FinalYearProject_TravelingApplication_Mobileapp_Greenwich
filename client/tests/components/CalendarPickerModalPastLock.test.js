import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarPickerModal from '../../src/components/common/CalendarPickerModal';

describe('Component Test: CalendarPickerModal Past Lock & Default minDate', () => {
  const mockOnSelectDate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-CAL-LOCK-01: CalendarPickerModal defaults minDate to today when minDate prop is not provided', () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const [year, month, day] = todayStr.split('-').map(Number);

    const { getByTestId } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate={todayStr}
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );

    // If today is after the 2nd of the month, day 1 is guaranteed in past
    if (day > 1) {
      const pastDayStr = `${year}-${String(month).padStart(2, '0')}-01`;
      const pastDayBtn = getByTestId(`cal-day-${pastDayStr}`);
      expect(pastDayBtn.props.accessibilityState.disabled).toBe(true);
    }
  });

  test('RED-CAL-LOCK-02: tapping a date prior to minDate does not call onSelectDate or onClose', () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const [year, month] = todayStr.split('-').map(Number);
    const minDate = `${year}-${String(month).padStart(2, '0')}-15`;

    const { getByTestId } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate={minDate}
        minDate={minDate}
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );

    const disabledDayStr = `${year}-${String(month).padStart(2, '0')}-10`;
    const disabledDayBtn = getByTestId(`cal-day-${disabledDayStr}`);
    fireEvent.press(disabledDayBtn);
    expect(mockOnSelectDate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('RED-CAL-LOCK-03: selecting a valid date on or after minDate calls onSelectDate and onClose', () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const [year, month] = todayStr.split('-').map(Number);
    const minDate = `${year}-${String(month).padStart(2, '0')}-10`;
    const validTargetDay = `${year}-${String(month).padStart(2, '0')}-20`;

    const { getByTestId } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate={minDate}
        minDate={minDate}
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );

    const validBtn = getByTestId(`cal-day-${validTargetDay}`);
    fireEvent.press(validBtn);
    expect(mockOnSelectDate).toHaveBeenCalledWith(validTargetDay);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
