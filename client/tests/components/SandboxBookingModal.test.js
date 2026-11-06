import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import SandboxBookingModal from '../../src/components/booking/SandboxBookingModal';

describe('Component Test: SandboxBookingModal', () => {
  const mockFlight = {
    id: 'off_vna_001',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    price: { currency: 'VND', amount: 2073060 },
  };

  test('RED-FE-SBX-04: renders passenger info, Duffel sandbox balance, and payment amount', () => {
    const { getByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        onBookingSuccess={jest.fn()}
      />
    );

    expect(getByText(/Duffel API Sandbox Payment/i)).toBeTruthy();
    expect(getByText(/Duffel Sandbox Test Balance|Số dư Duffel Sandbox Test/i)).toBeTruthy();
    expect(getByText(/50\.000\.000|50,000,000/i)).toBeTruthy();
    expect(getByText(/2\.073\.060|2,073,060/i)).toBeTruthy();
    expect(getByText(/Confirm Booking.*Save to Account|Xác nhận Đặt Vé/i)).toBeTruthy();
  });

  test('RED-FE-SBX-05: confirming booking triggers success and displays PNR and e-ticket number', async () => {
    const onBookingSuccessMock = jest.fn();
    const { getByText, findByText } = render(
      <SandboxBookingModal
        visible={true}
        flight={mockFlight}
        onClose={jest.fn()}
        onBookingSuccess={onBookingSuccessMock}
      />
    );

    const confirmBtn = getByText(/Confirm Booking.*Save to Account|Xác nhận Đặt Vé/i);
    await act(async () => {
      fireEvent.press(confirmBtn);
    });

    expect(await findByText(/Booking Confirmed Successfully|Đặt Vé Thật Thành Công|Đặt Vé Thành Công/i)).toBeTruthy();
    expect(onBookingSuccessMock).toHaveBeenCalledTimes(1);
  });
});
