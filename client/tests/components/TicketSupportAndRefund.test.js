import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import BoardingPassModal from '../../src/components/booking/BoardingPassModal';
import ProfileScreen from '../../src/screens/account/ProfileScreen';
import TicketSupportModal from '../../src/components/booking/TicketSupportModal';
import { useBookingStore } from '../../src/stores/booking.store';
import { useAuthStore } from '../../src/stores/auth.store';

jest.mock('../../src/stores/auth.store');

describe('Ticket Support, Change & Refund Flow (TDD RED)', () => {
  const mockTicket = {
    id: 'tkt-supp-001',
    pnr: 'VN-REFUND1',
    ticketNumber: '738-9988776655',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    totalPrice: 2000000,
    status: 'CONFIRMED',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.mockReturnValue({
      user: { id: 'u-1', fullName: 'John Doe', email: 'traveler@nomadix.vn' },
      logout: jest.fn(),
    });
    useBookingStore.setState({
      bookedTickets: [mockTicket],
    });
  });

  test('RED-SUP-01: BoardingPassModal renders "Bạn cần hỗ trợ?" prompt below ticket and triggers support action', () => {
    const onOpenSupportMock = jest.fn();
    const { getByText, getByTestId } = render(
      <BoardingPassModal
        visible={true}
        ticket={mockTicket}
        onClose={jest.fn()}
        onOpenSupport={onOpenSupportMock}
      />
    );

    const supportBtn = getByTestId('boarding-pass-support-btn');
    expect(supportBtn).toBeTruthy();
    expect(getByText(/Bạn cần hỗ trợ\?|Need support\?/i)).toBeTruthy();

    fireEvent.press(supportBtn);
    expect(onOpenSupportMock).toHaveBeenCalledWith(mockTicket);
  });

  test('RED-SUP-02: ProfileScreen renders Ticket Support & Refund Center row in action menu', () => {
    const { getByText, getByTestId } = render(<ProfileScreen />);
    const supportRow = getByTestId('profile-ticket-support-row');
    expect(supportRow).toBeTruthy();
    expect(getByText(/Hỗ trợ.*Đổi.*Hoàn vé|Ticket Support & Refunds/i)).toBeTruthy();
  });

  test('RED-SUP-03: TicketSupportModal calculates Duffel cancellation quote and confirms refund in store', async () => {
    const onRefundSuccessMock = jest.fn();
    const { getByText, getAllByText, getByTestId } = render(
      <TicketSupportModal
        visible={true}
        ticket={mockTicket}
        onClose={jest.fn()}
        onSuccess={onRefundSuccessMock}
      />
    );

    expect(getAllByText(/Trung tâm Hỗ trợ & Đổi\/Hoàn vé|Ticket Support & Refunds/i).length).toBeGreaterThanOrEqual(1);
    expect(getByText(/Báo giá hoàn tiền|Refund Quote/i)).toBeTruthy();

    // Confirm Cancellation & Refund
    const refundBtn = getByTestId('btn-confirm-refund');
    await act(async () => {
      fireEvent.press(refundBtn);
    });

    expect(onRefundSuccessMock).toHaveBeenCalled();
    const updatedTickets = useBookingStore.getState().bookedTickets;
    const refunded = updatedTickets.find((t) => t.id === mockTicket.id);
    expect(refunded.status).toBe('REFUNDED');
  });
});
