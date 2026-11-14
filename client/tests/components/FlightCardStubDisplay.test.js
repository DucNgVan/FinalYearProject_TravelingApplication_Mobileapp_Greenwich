import React from 'react';
import { render } from '@testing-library/react-native';
import FlightCard from '../../src/components/booking/FlightCard';

describe('TDD RED: Flight Card Stub Price & Barcode Visibility (VietJet VJ-1513 HAN -> DAD)', () => {
  const vietJetFlight = {
    id: 'off_034xCOMtV5NFtdKSHvUbGC',
    provider: 'DUFFEL',
    airlineCode: 'VJ',
    airlineName: 'VietJet Air',
    aircraft: 'Airbus A321',
    flightNumber: 'VJ-1513',
    origin: 'HAN',
    originCity: 'Hanoi',
    destination: 'DAD',
    destinationCity: 'Da Nang',
    departureTime: '2026-11-20T22:25:00',
    arrivalTime: '2026-11-20T23:45:00',
    durationMinutes: 80,
    stops: 0,
    cabinClass: 'ECONOMY',
    availableSeats: 30,
    price: {
      currency: 'VND',
      amount: 1168290,
    },
    baggageSummary: '1 kiện ký gửi (20kg) • 1 kiện xách tay (7kg)',
  };

  test('RED-FE-STUB-01: renders formatted VND price and per person label clearly in right stub', () => {
    const { getByText, getByTestId } = render(
      <FlightCard flight={vietJetFlight} onSelect={jest.fn()} />
    );

    const stub = getByTestId('flight-ticket-stub');
    expect(stub).toBeTruthy();

    expect(getByText('FARE')).toBeTruthy();
    expect(getByText('1,168,290 ₫')).toBeTruthy();
    expect(getByText('per person')).toBeTruthy();
  });

  test('RED-FE-STUB-02: barcode bars must have explicit numeric height (28px) to prevent Yoga layout engine collapse', () => {
    const { getByTestId } = render(
      <FlightCard flight={vietJetFlight} onSelect={jest.fn()} />
    );

    const barcodeBox = getByTestId('ticket-barcode-view');
    expect(barcodeBox).toBeTruthy();

    // Check all barcode bar children
    const barcodeBars = barcodeBox.props.children?.props?.children;
    expect(Array.isArray(barcodeBars)).toBe(true);
    expect(barcodeBars.length).toBeGreaterThan(0);

    // Each barcode bar should have an explicit numeric height of 28px in style
    const firstBar = barcodeBars[0];
    const flatStyle = Array.isArray(firstBar.props.style)
      ? Object.assign({}, ...firstBar.props.style)
      : firstBar.props.style;

    expect(flatStyle.height).toBe(28);
  });
});
