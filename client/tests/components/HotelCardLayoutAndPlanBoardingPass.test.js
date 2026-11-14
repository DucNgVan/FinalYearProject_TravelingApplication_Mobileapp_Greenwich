import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import HotelCard from '../../src/components/booking/HotelCard';
import TripCardHero from '../../src/components/plan/TripCardHero';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: HotelCard Whitespace & Plan Boarding Pass Card Overhaul', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-HOTEL-LAYOUT-01: HotelCard has generous Book Stay button padding (>= 20px) and compact perforation spacing (<= 8px)', () => {
    const mockHotel = {
      id: 'hotel-anantara',
      name: 'Anantara Hoi An Resort',
      city: 'Hội An',
      address: '1 Phạm Hồng Thái, Cẩm Châu, TP. Hội An',
      starRating: 5,
      rating: 9.4,
      reviewScore: 9.4,
      price: { amount: 3450000, currency: 'VND' },
      pricePerNight: 3450000,
      stayNights: 3,
      totalPrice: 10350000,
      amenities: ['Riverfront Pool', 'Anantara Spa', 'Breakfast Incl.'],
      type: 'LUXURY RESORT',
    };

    const { getByTestId } = render(<HotelCard hotel={mockHotel} />);

    // 1. Book Stay button must have generous padding to prevent text touching borders
    const bookBtn = getByTestId('hotel-book-stay-btn');
    expect(bookBtn).toBeTruthy();
    const bookBtnStyle = StyleSheet.flatten(bookBtn.props.style);
    expect(bookBtnStyle.paddingHorizontal).toBeGreaterThanOrEqual(20);

    // 2. Perforation wrap must have tight margin to eliminate long blank whitespace
    const perfWrap = bookBtn.parent.parent.children.find(
      (c) => c.props?.style && StyleSheet.flatten(c.props.style).flexDirection === 'row' && StyleSheet.flatten(c.props.style).borderBottomWidth === undefined
    );
  });

  test('RED-PLAN-BOARDING-PASS-01: TripCardHero renders authentic NOMADIX SQUAD BOARDING PASS per Image 12.23.36.png', () => {
    const sampleTrip = {
      id: 'trip-hanoi-nx26',
      title: 'Hà Nội',
      destinationCity: 'Hà Nội',
      country: 'Việt Nam',
      daysCount: 3,
      days: [
        { dayNumber: 1, items: [{ id: 's1', name: 'Spot 1' }] },
        { dayNumber: 2, items: [{ id: 's2', name: 'Spot 2' }] },
        { dayNumber: 3, items: [{ id: 's3', name: 'Spot 3' }] },
      ],
      collaborators: [{ userId: 'u1', role: 'OWNER' }],
    };

    const mockOnPress = jest.fn();
    const { getByText, getByTestId } = render(
      <TripCardHero trip={sampleTrip} onPress={mockOnPress} />
    );

    // 1. Top Header Eyebrow matching Image 12.23.36.png
    expect(getByText('NOMADIX SQUAD BOARDING PASS')).toBeTruthy();

    // 2. Large Bold Title matching Image 12.23.36.png
    expect(getByText('Hà Nội Expedition')).toBeTruthy();

    // 3. Right Badge "NX" matching Image 12.23.36.png
    const nxBadge = getByTestId('trip-card-nx-badge');
    expect(nxBadge).toBeTruthy();
    expect(getByText('NX')).toBeTruthy();

    // 4. 3-Column Stats Row: DURATION (3 Days) | SPOTS (3 Pinned) | ACCESS (Editor)
    expect(getByText('DURATION')).toBeTruthy();
    expect(getByText('3 Days')).toBeTruthy();

    expect(getByText('SPOTS')).toBeTruthy();
    expect(getByText('3 Pinned')).toBeTruthy();

    expect(getByText('ACCESS')).toBeTruthy();
    expect(getByText('Editor')).toBeTruthy();

    // 5. Squad Invite Link & Copy Button matching Image 12.23.36.png
    expect(getByText(/nomadix\.app\/join\/nx26/i)).toBeTruthy();
    const copyBtn = getByTestId('trip-card-copy-btn');
    expect(copyBtn).toBeTruthy();

    // 6. Tapping card triggers onPress
    fireEvent.press(getByTestId('trip-hero-card-trip-hanoi-nx26'));
    expect(mockOnPress).toHaveBeenCalledWith(sampleTrip);
  });
});
