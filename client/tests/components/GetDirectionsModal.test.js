import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Linking } from 'react-native';
import GetDirectionsModal from '../../src/components/plan/GetDirectionsModal';

jest.spyOn(Linking, 'openURL').mockImplementation(() => Promise.resolve(true));

describe('GetDirectionsModal Component (RED Phase)', () => {
  const mockOnClose = jest.fn();
  const samplePlace = {
    name: 'Tuileries Garden',
    lat: 48.8635,
    lng: 2.3275,
    address: 'Pl. de la Concorde, 75001 Paris, France',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('RED-NAV-01: Renders place name, subtitle, Apple Maps button, and Google Maps button', () => {
    const { getByText, getByTestId } = render(
      <GetDirectionsModal
        visible={true}
        place={samplePlace}
        onClose={mockOnClose}
      />
    );

    expect(getByText('GET DIRECTIONS')).toBeTruthy();
    expect(getByText('Tuileries Garden')).toBeTruthy();
    expect(getByTestId('directions-apple-maps-btn')).toBeTruthy();
    expect(getByTestId('directions-google-maps-btn')).toBeTruthy();
  });

  test('RED-NAV-02: Pressing Apple Maps invokes Linking.openURL with maps:// scheme and coordinates', () => {
    const { getByTestId } = render(
      <GetDirectionsModal
        visible={true}
        place={samplePlace}
        onClose={mockOnClose}
      />
    );

    fireEvent.press(getByTestId('directions-apple-maps-btn'));

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    const openedUrl = Linking.openURL.mock.calls[0][0];
    expect(openedUrl).toMatch(/^maps:\/\//);
    expect(openedUrl).toContain('48.8635');
    expect(openedUrl).toContain('2.3275');
  });

  test('RED-NAV-03: Pressing Google Maps invokes Linking.openURL with google.com/maps and coordinates', () => {
    const { getByTestId } = render(
      <GetDirectionsModal
        visible={true}
        place={samplePlace}
        onClose={mockOnClose}
      />
    );

    fireEvent.press(getByTestId('directions-google-maps-btn'));

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    const openedUrl = Linking.openURL.mock.calls[0][0];
    expect(openedUrl).toMatch(/google\.com\/maps/);
    expect(openedUrl).toContain('48.8635');
    expect(openedUrl).toContain('2.3275');
  });
});
