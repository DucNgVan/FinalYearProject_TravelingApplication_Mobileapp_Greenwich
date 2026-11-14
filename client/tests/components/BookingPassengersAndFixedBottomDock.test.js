import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';
import { useAuthStore } from '../../src/stores/auth.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: Passenger Real Data, Edit & Add Passengers, and Fixed Bottom Dock', () => {
  const sampleFlight = {
    id: 'flt-vj-1513',
    airline: 'VietJet Air',
    airlineCode: 'VJ',
    flightNumber: 'VJ-1513',
    origin: 'HAN',
    originCity: 'Hà Nội',
    destination: 'DAD',
    destinationCity: 'Đà Nẵng',
    departureTime: '2026-11-14T22:25:00Z',
    arrivalTime: '2026-11-14T23:45:00Z',
    durationMinutes: 80,
    stops: 0,
    price: { amount: 1168290, currency: 'VND' },
    cabinClass: 'ECONOMY',
  };

  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
    useAuthStore.setState({
      user: {
        id: 'user-duc',
        fullName: 'Nguyễn Văn Đức',
        email: 'ducnv1792005@gmail.com',
        phoneNumber: '0901234567',
        dateOfBirth: '2005-09-17',
      },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-PAX-USER-01: Passengers step populates real logged-in user data and eliminates Indonesian mock data', () => {
    const { getByText, queryByText, getByDisplayValue } = render(
      <SandboxBookingModal
        visible={true}
        flight={sampleFlight}
        initialStep="passengers"
        onClose={jest.fn()}
      />
    );

    // Must NOT contain Indonesian mock data
    expect(queryByText(/Arya Pratama/i)).toBeNull();
    expect(queryByText(/\+62 812 3456 7890/i)).toBeNull();
    expect(queryByText(/Indonesia/i)).toBeNull();

    // Must contain real user's details
    expect(getByText('Nguyễn Văn Đức')).toBeTruthy();
    expect(getByDisplayValue('ducnv1792005@gmail.com')).toBeTruthy();
    expect(getByDisplayValue('0901234567')).toBeTruthy();
  });

  test('RED-PAX-EDIT-02: Tapping Edit opens passenger editor modal and updates passenger info', () => {
    const { getByTestId, getByText, getByPlaceholderText } = render(
      <SandboxBookingModal
        visible={true}
        flight={sampleFlight}
        initialStep="passengers"
        onClose={jest.fn()}
      />
    );

    // Tap Edit button on traveller 1
    const editBtn = getByTestId('btn-edit-passenger-0');
    fireEvent.press(editBtn);

    // Edit modal/form must appear
    expect(getByTestId('passenger-edit-modal')).toBeTruthy();

    // Change full name to family member
    const nameInput = getByTestId('edit-passenger-name-input');
    fireEvent.changeText(nameInput, 'Trần Thị Mai');

    // Change passport / ID
    const idInput = getByTestId('edit-passenger-id-input');
    fireEvent.changeText(idInput, '001205009999');

    // Save changes
    const saveBtn = getByTestId('btn-save-passenger-edit');
    fireEvent.press(saveBtn);

    // Passenger card must now show updated name
    expect(getByText('Trần Thị Mai')).toBeTruthy();
  });

  test('RED-PAX-ADD-03: Allows adding another passenger for family/companion travel', () => {
    const { getByTestId, getByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={sampleFlight}
        initialStep="passengers"
        onClose={jest.fn()}
      />
    );

    // Add passenger button must exist
    const addBtn = getByTestId('btn-add-passenger');
    expect(addBtn).toBeTruthy();

    fireEvent.press(addBtn);

    // Traveller 2 must now appear
    expect(getByText(/Traveller 2/i)).toBeTruthy();
  });

  test('RED-DOCK-FIXED-04: Fixed bottom dock is anchored at the bottom across steps with active continue buttons', () => {
    const { getByTestId } = render(
      <SandboxBookingModal
        visible={true}
        flight={sampleFlight}
        initialStep="fare"
        onClose={jest.fn()}
      />
    );

    // Fixed bottom dock must be rendered
    const dock = getByTestId('fixed-booking-bottom-dock');
    expect(dock).toBeTruthy();

    // In Fare step, continue button is btn-continue-fare
    expect(getByTestId('btn-continue-fare')).toBeTruthy();

    // Advance to Passengers step
    fireEvent.press(getByTestId('btn-continue-fare'));

    // Fixed bottom dock is still rendered and has btn-continue-passengers
    expect(getByTestId('fixed-booking-bottom-dock')).toBeTruthy();
    expect(getByTestId('btn-continue-passengers')).toBeTruthy();
  });
});
