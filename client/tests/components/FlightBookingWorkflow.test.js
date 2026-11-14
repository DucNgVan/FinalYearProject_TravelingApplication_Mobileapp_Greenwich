import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';
import { useBookingStore } from '../../src/stores/booking.store';

describe('Frontend Test: 4-Step Flight Booking Workflow (Fare -> Passengers -> Seats -> Pay)', () => {
  const mockDuffelFlight = {
    id: 'off_duffel_real_999',
    provider: 'DUFFEL',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    airlineLogo: 'https://images.kiwi.com/airlines/64x64/VN.png',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    originAirportName: 'Tan Son Nhat International Airport',
    destinationAirportName: 'Noi Bai International Airport',
    aircraft: 'Airbus A350-900',
    departureTime: '2026-11-14T08:00:00Z',
    arrivalTime: '2026-11-14T10:15:00Z',
    durationMinutes: 135,
    stops: 0,
    cabinClass: 'ECONOMY',
    cabinMarketingName: 'Economy Classic',
    emissionsKg: 112,
    price: { currency: 'VND', amount: 2000000 },
  };

  beforeEach(() => {
    useBookingStore.setState({ bookedTickets: [] });
  });

  it('RED-FLT-STEP-01: renders 4-stage stepper (Fare, Passengers, Seats, Pay) with Fare active by default', () => {
    const { getByTestId, getByText, getAllByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockDuffelFlight}
        onClose={jest.fn()}
      />
    );

    // Stepper tabs are visible
    expect(getByTestId('booking-step-fare')).toBeTruthy();
    expect(getByTestId('booking-step-passengers')).toBeTruthy();
    expect(getByTestId('booking-step-seats')).toBeTruthy();
    expect(getByTestId('booking-step-pay')).toBeTruthy();

    // Step 1 Header & Subtitle
    expect(getAllByText(/Choose.*fare/i).length).toBeGreaterThanOrEqual(1);
    expect(getByText(/SGN → HAN|SGN.*HAN/i)).toBeTruthy();
    expect(getByText(/Economy.*per traveller/i)).toBeTruthy();
  });

  it('RED-FLT-STEP-02: displays 3 fare tiers (Lite, Classic [Most popular], Flex) with dynamic inclusions checklist', () => {
    const { getByTestId, getByText, getAllByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockDuffelFlight}
        onClose={jest.fn()}
      />
    );

    // 3 Fare options
    expect(getByTestId('fare-tier-lite')).toBeTruthy();
    expect(getByTestId('fare-tier-classic')).toBeTruthy();
    expect(getByTestId('fare-tier-flex')).toBeTruthy();

    // Most popular badge on Classic
    expect(getByText(/Most popular/i)).toBeTruthy();

    // Default selected is Classic
    expect(getByText(/Classic includes/i)).toBeTruthy();
    expect(getAllByText(/Checked bag/i).length).toBeGreaterThanOrEqual(1);
    expect(getAllByText(/20 kg/i).length).toBeGreaterThanOrEqual(1);

    // Switching to Lite updates the inclusions
    fireEvent.press(getByTestId('fare-tier-lite'));
    expect(getByText(/Lite includes/i)).toBeTruthy();
    expect(getAllByText(/0 kg|Cabin bag only/i).length).toBeGreaterThanOrEqual(1);

    // Switching to Flex updates inclusions
    fireEvent.press(getByTestId('fare-tier-flex'));
    expect(getByText(/Flex includes/i)).toBeTruthy();
    expect(getAllByText(/Free changes/i).length).toBeGreaterThanOrEqual(1);
  });

  it('RED-FLT-STEP-03: advances through 4 steps seamlessly to confirmed booking', async () => {
    const onBookingSuccessMock = jest.fn();
    const { getByTestId, getByText, findByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockDuffelFlight}
        onClose={jest.fn()}
        onBookingSuccess={onBookingSuccessMock}
      />
    );

    // --- STEP 1: FARE ---
    // Select Classic (default) and press Continue
    const continueFareBtn = getByTestId('btn-continue-fare');
    expect(continueFareBtn).toBeTruthy();
    fireEvent.press(continueFareBtn);

    // --- STEP 2: PASSENGERS ---
    // Now on Passengers step
    expect(getByTestId('input-passenger-fullname')).toBeTruthy();
    expect(getByTestId('input-passenger-id')).toBeTruthy();

    // Fill passenger information
    fireEvent.changeText(getByTestId('input-passenger-fullname'), 'Alex Nomad');
    fireEvent.changeText(getByTestId('input-passenger-id'), 'B98765432');
    fireEvent.changeText(getByTestId('input-passenger-email'), 'alex@nomadix.app');

    const continuePassengersBtn = getByTestId('btn-continue-passengers');
    fireEvent.press(continuePassengersBtn);

    // --- STEP 3: SEATS ---
    // Now on Seats step
    expect(getByTestId('seat-selection-view')).toBeTruthy();
    expect(getByTestId('btn-open-seatmap')).toBeTruthy();

    const continueSeatsBtn = getByTestId('btn-continue-seats');
    fireEvent.press(continueSeatsBtn);

    // --- STEP 4: PAY ---
    // Now on Review & Pay step
    expect(getByTestId('checkout-payment-method-card')).toBeTruthy();
    expect(getByText(/Duffel Sandbox Test Balance/i)).toBeTruthy();

    const confirmPayBtn = getByTestId('btn-confirm-booking');
    fireEvent.press(confirmPayBtn);

    // Confirmed booking success screen
    expect(await findByText(/Booking Confirmed Successfully/i)).toBeTruthy();
    expect(onBookingSuccessMock).toHaveBeenCalledTimes(1);

    // Check store ticket persistence
    const bookedTickets = useBookingStore.getState().bookedTickets;
    expect(bookedTickets.length).toBe(1);
    expect(bookedTickets[0].passenger.fullName).toBe('Alex Nomad');
    expect(bookedTickets[0].fareTier).toBe('Classic');
  });
});
