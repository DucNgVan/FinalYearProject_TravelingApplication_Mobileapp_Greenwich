import { create } from 'zustand';

/**
 * Payment Cards Store for Nomadix
 * Supports card validation, formatting, brand detection, and default selection
 */
export const usePaymentStore = create((set, get) => ({
  cards: [],
  selectedCardId: null,

  getDefaultCard: () => {
    const { cards } = get();
    return cards.find((c) => c.isDefault) || cards[0] || null;
  },

  detectCardBrand: (cardNumber = '') => {
    const clean = cardNumber.replace(/\D/g, '');
    if (/^4/.test(clean)) return 'VISA';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MASTERCARD';
    if (/^35(2[89]|[3-8][0-9])/.test(clean)) return 'JCB';
    if (/^9704/.test(clean)) return 'NAPAS';
    if (/^3[47]/.test(clean)) return 'AMEX';
    return 'GENERIC';
  },

  formatCardNumber: (value = '') => {
    const clean = value.replace(/\D/g, '').slice(0, 16);
    const parts = [];
    for (let i = 0; i < clean.length; i += 4) {
      parts.push(clean.substring(i, i + 4));
    }
    return parts.join(' ');
  },

  formatExpiry: (value = '') => {
    const clean = value.replace(/\D/g, '').slice(0, 4);
    if (clean.length >= 3) {
      return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`;
    }
    return clean;
  },

  addCard: ({ cardNumber, cardHolder, expiryDate, cvv, isDefault = false }) => {
    const cleanNumber = cardNumber.replace(/\D/g, '');
    const last4 = cleanNumber.slice(-4) || '0000';
    const brand = get().detectCardBrand(cardNumber);
    const maskedNumber = `•••• •••• •••• ${last4}`;
    const id = `card-${Date.now()}`;

    const newCard = {
      id,
      cardNumber: maskedNumber,
      rawNumber: last4,
      cardHolder: (cardHolder || 'GUEST TRAVELER').toUpperCase().trim(),
      expiryDate: expiryDate || '12/28',
      cardType: `${brand === 'VISA' ? 'Visa' : brand === 'MASTERCARD' ? 'Mastercard' : brand} · Credit`,
      brand,
      isDefault,
      usedFor: 'Flights & hotel bookings',
      gradient: brand === 'VISA' 
        ? ['#0E1B2C', '#14485A', '#0B7A75']
        : ['#2D1B4E', '#4E1B3D', '#B83280'],
    };

    set((state) => {
      let updatedCards = state.cards;
      if (isDefault) {
        updatedCards = updatedCards.map((c) => ({ ...c, isDefault: false }));
      }
      return {
        cards: [...updatedCards, newCard],
        selectedCardId: isDefault ? id : state.selectedCardId,
      };
    });

    return newCard;
  },

  setDefaultCard: (id) => {
    set((state) => ({
      cards: state.cards.map((c) => ({
        ...c,
        isDefault: c.id === id,
      })),
      selectedCardId: id,
    }));
  },

  removeCard: (id) => {
    set((state) => {
      const remaining = state.cards.filter((c) => c.id !== id);
      if (remaining.length > 0 && !remaining.some((c) => c.isDefault)) {
        remaining[0].isDefault = true;
      }
      return {
        cards: remaining,
        selectedCardId: remaining[0]?.id || null,
      };
    });
  },
}));
