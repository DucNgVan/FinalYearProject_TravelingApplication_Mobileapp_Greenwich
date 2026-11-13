import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PaymentCardsModal from '../../../src/screens/account/PaymentCardsModal';
import { usePaymentStore } from '../../../src/stores/payment.store';

describe('TDD RED Phase: PaymentCardsModal UI Component', () => {
  beforeEach(() => {
    usePaymentStore.setState({
      cards: [
        {
          id: 'card-default-4821',
          cardNumber: '•••• •••• •••• 4821',
          rawNumber: '4821',
          cardHolder: 'GUEST TRAVELER',
          expiryDate: '08/28',
          cardType: 'Visa · Credit',
          brand: 'VISA',
          isDefault: true,
          usedFor: 'Flights & hotel bookings',
        },
      ],
      selectedCardId: 'card-default-4821',
    });
  });

  test('RED-MODAL-01: renders payment card stack with VISA brand, masked number and holder', () => {
    const { getByText, getByTestId } = render(
      <PaymentCardsModal visible={true} onClose={() => {}} />
    );

    expect(getByText('Payment Cards')).toBeTruthy();
    expect(getByText('VISA')).toBeTruthy();
    expect(getByText('•••• •••• •••• 4821')).toBeTruthy();
    expect(getByText('GUEST TRAVELER')).toBeTruthy();
    expect(getByText('08/28')).toBeTruthy();
    expect(getByText('Default payment method')).toBeTruthy();
    expect(getByTestId('btn-add-card')).toBeTruthy();
  });

  test('RED-MODAL-02: opens Add Card form when clicking Add new card', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <PaymentCardsModal visible={true} onClose={() => {}} />
    );

    fireEvent.press(getByTestId('btn-add-card'));
    expect(getByPlaceholderText('1234 5678 9012 3456')).toBeTruthy();
    expect(getByPlaceholderText('FULL NAME')).toBeTruthy();
  });
});
