import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightDetailModal from '../../src/components/booking/FlightDetailModal';

describe('Component Test: FlightDetailModal', () => {
  const mockFlightDirect = {
    id: 'off_vna_001',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T07:00:00Z',
    arrivalTime: '2026-10-15T09:10:00Z',
    durationMinutes: 130,
    stops: 0,
    aircraft: 'Airbus A350-900',
    cabinClass: 'ECONOMY',
    price: { currency: 'VND', amount: 2073060 },
  };

  const mockFlightTransit = {
    id: 'off_vna_002',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-1404',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T06:55:00Z',
    arrivalTime: '2026-10-15T11:30:00Z',
    durationMinutes: 275,
    stops: 1,
    aircraft: 'Airbus A321',
    cabinClass: 'ECONOMY',
    price: { currency: 'VND', amount: 3130920 },
  };

  test('RED-FE-DTL-01: renders carrier, flight number, aircraft, route timeline, baggage allowance, and price when visible', () => {
    const { getByText } = render(
      <FlightDetailModal visible={true} flight={mockFlightDirect} onClose={jest.fn()} onBookSandbox={jest.fn()} />
    );

    expect(getByText(/Vietnam Airlines/i)).toBeTruthy();
    expect(getByText(/VN-0240/i)).toBeTruthy();
    expect(getByText(/Airbus A350-900/i)).toBeTruthy();
    expect(getByText(/SGN/i)).toBeTruthy();
    expect(getByText(/HAN/i)).toBeTruthy();
    expect(getByText(/Direct|Bay thẳng/i)).toBeTruthy();
    expect(getByText(/2.073.060|2,073,060/i)).toBeTruthy();
    expect(getByText(/Book.*Sandbox|Đặt Vé Sandbox/i)).toBeTruthy();
  });

  test('RED-FE-DTL-02: displays transit layover alert when stops > 0', () => {
    const { getAllByText, getByText } = render(
      <FlightDetailModal visible={true} flight={mockFlightTransit} onClose={jest.fn()} onBookSandbox={jest.fn()} />
    );

    expect(getAllByText(/1 stop|1 điểm dừng|Quá cảnh/i).length).toBeGreaterThanOrEqual(1);
    expect(getByText(/VN-1404/i)).toBeTruthy();
  });

  test('RED-FE-DTL-03: triggers onBookSandbox with flight object when "Đặt Vé Sandbox" is tapped', () => {
    const onBookMock = jest.fn();
    const { getByText } = render(
      <FlightDetailModal visible={true} flight={mockFlightDirect} onClose={jest.fn()} onBookSandbox={onBookMock} />
    );

    const bookBtn = getByText(/Book.*Sandbox|Đặt Vé Sandbox/i);
    fireEvent.press(bookBtn);

    expect(onBookMock).toHaveBeenCalledWith(mockFlightDirect);
  });

  test('RED-FE-DTL-04: triggers onClose when close button is tapped', () => {
    const onCloseMock = jest.fn();
    const { getByTestId } = render(
      <FlightDetailModal visible={true} flight={mockFlightDirect} onClose={onCloseMock} onBookSandbox={jest.fn()} />
    );

    const closeBtn = getByTestId('close-flight-detail-btn');
    fireEvent.press(closeBtn);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test('renders emissions information when emissionsKg is provided', () => {
    const flightWithEmissions = {
      ...mockFlightDirect,
      emissionsKg: '52',
    };
    const { getByText } = render(
      <FlightDetailModal visible={true} flight={flightWithEmissions} onClose={jest.fn()} />
    );
    expect(getByText(/52 kg CO₂/i)).toBeTruthy();
  });

  test('returns null when flight prop is null', () => {
    const { toJSON } = render(<FlightDetailModal visible={true} flight={null} />);
    expect(toJSON()).toBeNull();
  });
});
