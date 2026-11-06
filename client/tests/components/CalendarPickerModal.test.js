import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CalendarPickerModal from '../../src/components/common/CalendarPickerModal';

describe('Component Test: CalendarPickerModal', () => {
  const mockOnSelectDate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-FE-CAL-01: renders modal when visible with month header and days of week', () => {
    const { getByText, getByTestId } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate="2026-10-15"
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
        title="Chọn ngày khởi hành"
      />
    );

    expect(getByText(/Chọn ngày khởi hành/i)).toBeTruthy();
    expect(getByText(/October|Tháng 10/i)).toBeTruthy();
    expect(getByText(/Mon|T2/i)).toBeTruthy();
    expect(getByText(/Sun|CN/i)).toBeTruthy();

    // Close button
    fireEvent.press(getByTestId('cal-close-btn'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('RED-FE-CAL-02: selecting a date triggers onSelectDate with formatted YYYY-MM-DD', () => {
    const { getByText } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate="2026-10-15"
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );

    // Click on day 20
    const day20 = getByText('20');
    fireEvent.press(day20);

    expect(mockOnSelectDate).toHaveBeenCalledWith('2026-10-20');
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('RED-FE-CAL-03: navigation buttons allow moving between months and across year boundary', () => {
    const { getByText, getByTestId } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate="2026-12-15"
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );

    expect(getByText(/December.*2026|Tháng 12.*2026/i)).toBeTruthy();

    // Next month crosses to Jan 2027
    fireEvent.press(getByTestId('cal-next-month'));
    expect(getByText(/January.*2027|Tháng 1.*2027/i)).toBeTruthy();

    // Prev month crosses back to Dec 2026
    fireEvent.press(getByTestId('cal-prev-month'));
    expect(getByText(/December.*2026|Tháng 12.*2026/i)).toBeTruthy();

    // Further prev to Jan 2026 and across to Dec 2025
    const janModal = render(
      <CalendarPickerModal
        visible={true}
        selectedDate="2026-01-15"
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );
    fireEvent.press(janModal.getByTestId('cal-prev-month'));
    expect(janModal.getByText(/December.*2025|Tháng 12.*2025/i)).toBeTruthy();
  });

  test('handles default props when selectedDate and callbacks are undefined', () => {
    const { getByText } = render(<CalendarPickerModal visible={true} selectedDate="" />);
    expect(getByText(/October.*2026|Tháng 10.*2026/i)).toBeTruthy();
  });

  test('RED-FE-CAL-04: disables dates prior to minDate and prevents onSelectDate', () => {
    const { getByText } = render(
      <CalendarPickerModal
        visible={true}
        selectedDate="2026-10-15"
        minDate="2026-10-10"
        onSelectDate={mockOnSelectDate}
        onClose={mockOnClose}
      />
    );

    // Day 5 is before minDate (2026-10-10)
    const day5 = getByText('5');
    fireEvent.press(day5);

    expect(mockOnSelectDate).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
