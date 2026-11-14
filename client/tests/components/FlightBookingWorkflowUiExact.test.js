import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';

describe('Component Test: Flight Booking 4-Step Workflow Exact UI Match (Black & White Theme)', () => {
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
    price: { amount: 128, currency: 'USD' },
    aircraft: 'Airbus A320',
  };

  test('RED-FE-WIZARD-01: Step 1 Choose Fare should render 3 tier cards, Most popular badge, and Inclusions card', () => {
    const { getByTestId, getAllByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        initialStep="fare"
      />
    );

    expect(getAllByText(/Choose.*fare/i).length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('fare-tier-lite')).toBeTruthy();
    expect(getByTestId('fare-tier-classic')).toBeTruthy();
    expect(getByTestId('fare-tier-flex')).toBeTruthy();
    expect(getByTestId('fare-tier-popular-badge')).toBeTruthy();

    expect(getAllByText(/Cabin bag/i).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/Checked bag/i).length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('btn-continue-fare')).toBeTruthy();
  });

  test('RED-FE-WIZARD-02: Step 2 Passengers should render Who is flying, passenger details card, and contact info', () => {
    const { getByTestId, getAllByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        initialStep="passengers"
      />
    );

    expect(getAllByText(/Who.*flying/i).length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('passenger-passport-card')).toBeTruthy();
    expect(getByTestId('passenger-contact-card')).toBeTruthy();
    expect(getByTestId('btn-continue-passengers')).toBeTruthy();
  });

  test('RED-FE-WIZARD-03: Step 3 Choose Seats should render airplane nose arc, seat map cabin, and passenger seat chip', () => {
    const { getByTestId, getAllByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        initialStep="seats"
      />
    );

    expect(getAllByText(/Choose Seats/i).length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('airplane-nose-arc')).toBeTruthy();
    expect(getByTestId('passenger-seat-chip')).toBeTruthy();
    expect(getByTestId('cabin-seats-grid')).toBeTruthy();
    expect(getByTestId('btn-continue-seats')).toBeTruthy();
  });

  test('RED-FE-WIZARD-04: Step 4 Review & Pay should render flight summary, payment card, promo code, and pay button', () => {
    const { getByTestId, getAllByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        initialStep="pay"
      />
    );

    expect(getAllByText(/Review & Pay/i).length).toBeGreaterThanOrEqual(1);
    expect(getByTestId('checkout-flight-summary-bar')).toBeTruthy();
    expect(getByTestId('checkout-payment-method-card')).toBeTruthy();
    expect(getByTestId('checkout-promo-card')).toBeTruthy();
    expect(getByTestId('btn-pay-now')).toBeTruthy();
  });
});
