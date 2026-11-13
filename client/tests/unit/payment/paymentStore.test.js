import { renderHook, act } from '@testing-library/react-native';
import { usePaymentStore } from '../../../src/stores/payment.store';

describe('TDD RED Phase: Payment Cards Store & Card Validation', () => {
  beforeEach(() => {
    // Reset store before each test
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
          gradient: ['#0E1B2C', '#14485A', '#0B7A75'],
        },
      ],
      selectedCardId: 'card-default-4821',
    });
  });

  test('RED-PAY-01: initial store should have default seed Visa card 4821', () => {
    const { result } = renderHook(() => usePaymentStore());
    expect(result.current.cards.length).toBe(1);
    expect(result.current.cards[0].brand).toBe('VISA');
    expect(result.current.cards[0].cardHolder).toBe('GUEST TRAVELER');
    expect(result.current.cards[0].expiryDate).toBe('08/28');
    expect(result.current.cards[0].isDefault).toBe(true);
    expect(result.current.getDefaultCard()?.id).toBe('card-default-4821');
  });

  test('RED-PAY-02: detectCardBrand accurately detects Visa, Mastercard, JCB, Napas', () => {
    const { result } = renderHook(() => usePaymentStore());
    expect(result.current.detectCardBrand('4111 2222 3333 4444')).toBe('VISA');
    expect(result.current.detectCardBrand('5100 1234 5678 9999')).toBe('MASTERCARD');
    expect(result.current.detectCardBrand('3528 1234 5678 9999')).toBe('JCB');
    expect(result.current.detectCardBrand('9704 1234 5678 9999')).toBe('NAPAS');
    expect(result.current.detectCardBrand('1234 5678 9999 0000')).toBe('GENERIC');
  });

  test('RED-PAY-03: formatCardNumber formats input into 4-digit chunks', () => {
    const { result } = renderHook(() => usePaymentStore());
    expect(result.current.formatCardNumber('4111222233334444')).toBe('4111 2222 3333 4444');
    expect(result.current.formatCardNumber('4111 222233')).toBe('4111 2222 33');
    expect(result.current.formatExpiry('0828')).toBe('08/28');
  });

  test('RED-PAY-04: addCard successfully stores new card and sets default if requested', () => {
    const { result } = renderHook(() => usePaymentStore());
    
    act(() => {
      result.current.addCard({
        cardNumber: '5100 1234 5678 9999',
        cardHolder: 'NGUYEN VAN DUC',
        expiryDate: '12/29',
        cvv: '888',
        isDefault: true,
      });
    });

    expect(result.current.cards.length).toBe(2);
    const newCard = result.current.cards.find(c => c.cardHolder === 'NGUYEN VAN DUC');
    expect(newCard).toBeDefined();
    expect(newCard.brand).toBe('MASTERCARD');
    expect(newCard.cardNumber).toBe('•••• •••• •••• 9999');
    expect(newCard.isDefault).toBe(true);

    // Old card should no longer be default
    const oldCard = result.current.cards.find(c => c.id === 'card-default-4821');
    expect(oldCard.isDefault).toBe(false);
  });

  test('RED-PAY-05: setDefaultCard updates default card and removeCard deletes card', () => {
    const { result } = renderHook(() => usePaymentStore());
    
    let addedId;
    act(() => {
      const added = result.current.addCard({
        cardNumber: '3528 1234 5678 1234',
        cardHolder: 'TRAVELER DUC',
        expiryDate: '05/30',
        cvv: '123',
        isDefault: false,
      });
      addedId = added?.id;
    });

    expect(result.current.cards.length).toBe(2);

    act(() => {
      result.current.setDefaultCard(addedId);
    });

    expect(result.current.getDefaultCard()?.id).toBe(addedId);

    act(() => {
      result.current.removeCard(addedId);
    });

    expect(result.current.cards.length).toBe(1);
    expect(result.current.cards.find(c => c.id === addedId)).toBeUndefined();
  });
});
