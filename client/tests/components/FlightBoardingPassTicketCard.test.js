import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FlightCard from '../../src/components/booking/FlightCard';

describe('Component Test: Flight Boarding Pass Ticket Card (Black & White Theme)', () => {
  const mockFlight = {
    id: 'fl-ga159',
    airline: 'Garuda Indonesia',
    airlineName: 'Garuda Indonesia',
    flightNumber: 'GA 159',
    origin: 'DPS',
    originCity: 'Denpasar',
    destination: 'CGK',
    destinationCity: 'Jakarta',
    departureTime: '2026-09-04T06:05:00',
    arrivalTime: '2026-09-04T06:55:00',
    durationMinutes: 110,
    stops: 0,
    cabinClass: 'Economy',
    availableSeats: 30,
    price: { amount: 113, currency: 'USD' },
    aircraft: 'Boeing 737-800',
  };

  test('RED-FE-CARD-01: should render ticket card with main body and perforated stub', () => {
    const { getByTestId, getByText } = render(
      <FlightCard flight={mockFlight} onSelect={jest.fn()} />
    );

    expect(getByTestId('flight-ticket-main')).toBeTruthy();
    expect(getByTestId('flight-ticket-stub')).toBeTruthy();
    expect(getByTestId('ticket-perforation-line')).toBeTruthy();
  });

  test('RED-FE-CARD-02: should render dark header strip with airline name and date on stub', () => {
    const { getByText, getByTestId } = render(
      <FlightCard flight={mockFlight} onSelect={jest.fn()} />
    );

    expect(getByText('Garuda Indonesia')).toBeTruthy();
    expect(getByTestId('ticket-header-airline')).toBeTruthy();
    expect(getByTestId('ticket-header-date')).toBeTruthy();
  });

  test('RED-FE-CARD-03: should render FROM and TO details with airport codes, cities, times, and flight arc duration', () => {
    const { getByText, getByTestId } = render(
      <FlightCard flight={mockFlight} onSelect={jest.fn()} />
    );

    expect(getByText('DPS')).toBeTruthy();
    expect(getByText('Denpasar')).toBeTruthy();
    expect(getByText(/6:05/)).toBeTruthy();

    expect(getByText('CGK')).toBeTruthy();
    expect(getByText('Jakarta')).toBeTruthy();
    expect(getByText(/6:55/)).toBeTruthy();

    expect(getByText(/1h 50m/)).toBeTruthy();
    expect(getByTestId('ticket-flight-arc')).toBeTruthy();
  });

  test('RED-FE-CARD-04: should render FLIGHT, CLASS, SEATS, FARE, per person, and barcode graphic', () => {
    const { getByText, getByTestId } = render(
      <FlightCard flight={mockFlight} onSelect={jest.fn()} />
    );

    expect(getByText(/FLIGHT/i)).toBeTruthy();
    expect(getByText('GA 159')).toBeTruthy();

    expect(getByText(/CLASS/i)).toBeTruthy();
    expect(getByText(/Economy/i)).toBeTruthy();

    expect(getByText(/SEATS/i)).toBeTruthy();
    expect(getByText(/30 left/i)).toBeTruthy();

    expect(getByText(/FARE/i)).toBeTruthy();
    expect(getByText(/per person/i)).toBeTruthy();
    expect(getByTestId('ticket-barcode-view')).toBeTruthy();
  });
});
