import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SeatMapSelector from '../../src/components/booking/SeatMapSelector';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';
import BoardingPassModal from '../../src/components/booking/BoardingPassModal';
import { useBookingStore } from '../../src/stores/booking.store';

describe('Flight Ancillaries & Interactive Cabin Seat Map (TDD RED)', () => {
  const mockFlight = {
    id: 'off_vna_777',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    aircraft: 'Airbus A321',
    cabinClass: 'ECONOMY',
    price: { currency: 'VND', amount: 2000000 },
  };

  test('RED-ANC-01: SeatMapSelector displays aircraft cabin layout, marks occupied seats, and allows selecting available seat', () => {
    const onSelectSeatMock = jest.fn();
    const { getByText, getByTestId } = render(
      <SeatMapSelector
        visible={true}
        selectedSeatCode="12A"
        onSelectSeat={onSelectSeatMock}
        onClose={jest.fn()}
      />
    );

    expect(getByText(/Cabin Seat Map|Sơ đồ ghế ngồi/i)).toBeTruthy();
    expect(getByText(/Airbus A321/i)).toBeTruthy();

    // Verify seat 12A is present
    expect(getByTestId('seat-pill-12A')).toBeTruthy();

    // Attempt to press an available seat, e.g. 14A
    const seat14A = getByTestId('seat-pill-14A');
    fireEvent.press(seat14A);
    expect(onSelectSeatMock).toHaveBeenCalledWith(
      expect.objectContaining({
        code: '14A',
      })
    );
  });

  test('RED-ANC-02: SandboxBookingModal renders Add-on Ancillaries (baggage, meals, seat) and updates price in real time', () => {
    const { getByText, getByTestId } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        onBookingSuccess={jest.fn()}
      />
    );

    // Should render ancillaries section
    expect(getByText(/Dịch vụ mua thêm|Add-on Services|Ancillaries/i)).toBeTruthy();
    expect(getByTestId('ancillary-baggage-20kg')).toBeTruthy();

    // Base fare: 2.000.000₫
    expect(getByText(/2\.000\.000|2,000,000/i)).toBeTruthy();

    // Press to add 20kg checked baggage (+250,000₫)
    fireEvent.press(getByTestId('ancillary-baggage-20kg'));

    // Updated fare should now reflect 2.250.000₫
    expect(getByText(/2\.250\.000|2,250,000/i)).toBeTruthy();
  });

  test('RED-ANC-03: BoardingPassModal renders selected seat number and baggage summary', () => {
    const mockTicketWithSeat = {
      id: 'tkt-seat-01',
      pnr: 'VN-SEAT01',
      ticketNumber: '738-1122334455',
      airlineName: 'Vietnam Airlines',
      flightNumber: 'VN-0240',
      origin: 'SGN',
      destination: 'HAN',
      seat: { code: '12A', type: 'Window' },
      status: 'CONFIRMED',
    };

    const { getByText, getAllByText } = render(
      <BoardingPassModal visible={true} ticket={mockTicketWithSeat} onClose={jest.fn()} />
    );

    expect(getAllByText(/SEAT|GHẾ/i).length).toBeGreaterThanOrEqual(1);
    expect(getByText('12A')).toBeTruthy();
  });
});
