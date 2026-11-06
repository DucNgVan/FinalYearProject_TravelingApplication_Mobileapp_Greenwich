import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BoardingPassModal from '../../src/components/booking/BoardingPassModal';

describe('Component Test: BoardingPassModal', () => {
  const mockTicket = {
    id: 'tkt-001',
    pnr: 'VN-TEST99',
    ticketNumber: '738-9999999999',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T07:00:00Z',
    arrivalTime: '2026-10-15T09:10:00Z',
    durationMinutes: 130,
    cabinClass: 'Phổ thông',
    passenger: { fullName: 'Nguyễn Văn Đức', email: 'test@nomadix.vn' },
    status: 'CONFIRMED',
  };

  test('renders nothing when ticket is null', () => {
    const { toJSON } = render(<BoardingPassModal visible={true} ticket={null} onClose={jest.fn()} />);
    expect(toJSON()).toBeNull();
  });

  test('renders boarding pass with passenger name, PNR, and route', () => {
    const mockOnClose = jest.fn();
    const { getByText } = render(
      <BoardingPassModal visible={true} ticket={mockTicket} onClose={mockOnClose} />
    );

    expect(getByText(/THẺ LÊN MÁY BAY ĐIỆN TỬ|ELECTRONIC BOARDING PASS/i)).toBeTruthy();
    expect(getByText('Vietnam Airlines')).toBeTruthy();
    expect(getByText('VN-TEST99')).toBeTruthy();
    expect(getByText(/Nguyễn Văn Đức|John Doe/i)).toBeTruthy();
    expect(getByText('SGN')).toBeTruthy();
    expect(getByText('HAN')).toBeTruthy();

    // Close button
    fireEvent.press(getByText('✕'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('renders with fallback values when ticket details are partially missing', () => {
    const sparseTicket = {
      id: 'tkt-sparse',
    };
    const { getByText } = render(
      <BoardingPassModal visible={true} ticket={sparseTicket} onClose={jest.fn()} />
    );

    expect(getByText(/THẺ LÊN MÁY BAY ĐIỆN TỬ|ELECTRONIC BOARDING PASS/i)).toBeTruthy();
    expect(getByText('Vietnam Airlines')).toBeTruthy();
    expect(getByText('SGN')).toBeTruthy();
    expect(getByText('HAN')).toBeTruthy();
  });
});
