import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import HotelCard from '../../src/components/booking/HotelCard';
import { useThemeStore } from '../../src/stores/theme.store';

describe('Component Test: HotelCard', () => {
  const mockHotel = {
    id: 'hotel-vp-01',
    name: 'Vinpearl Luxury Landmark 81',
    city: 'Ho Chi Minh City',
    address: '720A Dien Bien Phu, Binh Thanh',
    starRating: 5,
    reviewScore: 9.4,
    pricePerNight: 3500000,
    currency: 'VND',
    nights: 2,
    totalPrice: 7000000,
  };

  test('RED-FE-BK-09: HotelCard should render hotel name, star rating, address, price per night, and total price', () => {
    const { getByText } = render(<HotelCard hotel={mockHotel} />);

    expect(getByText(/Vinpearl Luxury Landmark 81/i)).toBeTruthy();
    expect(getByText(/720A Dien Bien Phu/i)).toBeTruthy();
    expect(getByText(/3.500.000|3,500,000/i)).toBeTruthy();
    expect(getByText(/7.000.000|7,000,000/i)).toBeTruthy();
    expect(getByText(/5 sao|5\s*★|5 Stars/i)).toBeTruthy();
  });

  test('RED-FE-BK-10: HotelCard should fire onSelect callback with hotel payload when clicked', () => {
    const onSelectMock = jest.fn();
    const { getByTestId } = render(
      <HotelCard hotel={mockHotel} onSelect={onSelectMock} testID="hotel-card-vp-01" />
    );

    fireEvent.press(getByTestId('hotel-card-vp-01'));
    expect(onSelectMock).toHaveBeenCalledWith(mockHotel);
  });

  test('should return null when hotel prop is null or undefined', () => {
    const { toJSON } = render(<HotelCard hotel={null} />);
    expect(toJSON()).toBeNull();
  });

  test('should safely handle hotel with missing reviewScore, nights, and totalPrice', () => {
    const minimalHotel = {
      name: 'Haian Riverfront Hotel',
      address: '182 Bach Dang, Da Nang',
      starRating: 4,
      pricePerNight: 'invalid_price',
    };

    const { getByText, getByTestId } = render(
      <HotelCard hotel={minimalHotel} testID="minimal-hotel" />
    );

    expect(getByText('Haian Riverfront Hotel')).toBeTruthy();
    expect(getByText(/4 (sao|Stars) ★/)).toBeTruthy();
    expect(getByText(/0 [đ₫] \/ (đêm|night)/)).toBeTruthy();

    // Verify pressing without onSelect does not crash
    fireEvent.press(getByTestId('minimal-hotel'));
  });

  test('RED-FE-TH-03: HotelCard dynamically renders dark background (#1C1D21) and border (#2A2D35) in Dark Mode', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId } = render(
      <HotelCard hotel={mockHotel} testID="hotel-card-theme" />
    );
    const card = getByTestId('hotel-card-theme');
    const flatStyle = StyleSheet.flatten(card.props.style);
    expect(flatStyle.backgroundColor).toBe('#1C1D21');
    expect(flatStyle.borderColor).toBe('#2A2D35');

    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-HOTEL-CARD-IMG-01: HotelCard renders hotel photo image when thumbnailUrl is present', () => {
    const hotelWithImage = {
      ...mockHotel,
      thumbnailUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    };
    const { getByTestId } = render(<HotelCard hotel={hotelWithImage} />);
    const image = getByTestId('hotel-card-image');
    expect(image).toBeTruthy();
    expect(image.props.source).toEqual({
      uri: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
    });
  });

  test('RED-HOTEL-CARD-IMG-02: HotelCard renders fallback placeholder image when thumbnailUrl is missing', () => {
    const hotelWithoutImage = {
      ...mockHotel,
      thumbnailUrl: null,
    };
    const { getByTestId } = render(<HotelCard hotel={hotelWithoutImage} />);
    const image = getByTestId('hotel-card-image');
    expect(image).toBeTruthy();
    expect(image.props.source).toBeDefined();
    expect(image.props.source.uri).toContain('unsplash.com');
  });
});
