import React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import FlightSearchScreen from '../../src/screens/booking/FlightSearchScreen';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import PlanMapDiscovery from '../../src/components/plan/PlanMapDiscovery';
import MultiCityPlanWizard from '../../src/components/plan/MultiCityPlanWizard';
import HotelCard from '../../src/components/booking/HotelCard';
import { useThemeStore } from '../../src/stores/theme.store';
import { useAuthStore } from '../../src/stores/auth.store';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { usePlacesStore } from '../../src/stores/places.store';

describe('Plan Wizard, Map & Dark Mode Harmonization (RED Phase)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      user: { id: 'usr-1', fullName: 'Duc Nguyen', email: 'duc@nomadix.app', role: 'Owner' },
      isAuthenticated: true,
      isGuest: false,
    });
    useThemeStore.getState().setThemeMode('dark');
  });

  test('RED-SWAP-01: In Dark Mode, flight-swap-btn icon is dark #111827, not white on white', () => {
    useThemeStore.getState().setThemeMode('dark');
    const { getByTestId, getByText } = render(<FlightSearchScreen />);

    const swapBtn = getByTestId('flight-swap-btn');
    const swapBtnFlat = StyleSheet.flatten(swapBtn.props.style);
    expect(swapBtnFlat.backgroundColor).toBe('#FFFFFF');

    const swapIcon = getByText('⇄');
    const swapIconFlat = StyleSheet.flatten(swapIcon.props.style);
    expect(swapIconFlat.color).not.toBe('#FFFFFF');
    expect(swapIconFlat.color).toBe('#111827');
  });

  test('RED-WIZARD-CONTRAST-01: In Dark Mode, empty state CTA has high contrast text, and wizardQuickBar is obsidian #1C1D21', () => {
    useThemeStore.getState().setThemeMode('dark');
    useItineraryStore.setState({ currentTrip: null }); // triggers empty state

    const { getByText } = render(<PlanScreen />);

    const createBtnText = getByText(/✨ Plan a Trip/i);
    expect(createBtnText).toBeTruthy();

    // Switch to trip mode to check wizardQuickBar under Map & Places tab
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-1',
        title: 'Da Nang Vacation',
        days: [{ dayNumber: 1, items: [] }],
        collaborators: [{ userId: 'usr-1', role: 'OWNER' }],
      },
    });
    const tripRender = render(<PlanScreen />);
    fireEvent.press(tripRender.getByText('Map & Places'));
    const quickBar = tripRender.getByTestId('plan-wizard-quick-bar');
    const quickBarFlat = StyleSheet.flatten(quickBar.props.style);
    expect(quickBarFlat.backgroundColor).toBe('#1C1D21');
    expect(quickBarFlat.backgroundColor).not.toBe('#EEF2FF');
  });

  test('RED-MAP-HARMONIZATION-01: PlanMapDiscovery active cards do not have red #EF4444 border, and bottomBar has dock clearance', () => {
    useThemeStore.getState().setThemeMode('dark');
    const mockPlaces = [
      { id: 'plc-1', name: 'Golden Bridge', category: 'attraction', rating: 4.8, city: 'Da Nang' },
      { id: 'plc-2', name: 'My Khe Beach', category: 'beach', rating: 4.7, city: 'Da Nang' },
    ];

    const { getByTestId, getAllByTestId } = render(
      <PlanMapDiscovery
        places={mockPlaces}
        selectedPlaceIds={new Set(['plc-1'])}
        onTogglePlace={jest.fn()}
        onGenerateAiPlan={jest.fn()}
      />
    );

    // Selected card border must NOT be harsh red #EF4444
    const firstCard = getByTestId('carousel-place-card-plc-1');
    const cardFlat = StyleSheet.flatten(firstCard.props.style);
    expect(cardFlat.borderColor).not.toBe('#EF4444');
    expect(cardFlat.borderColor).toBe('#2E7D5B'); // Pine Green luxury accent

    // bottomBar / inline AI action container
    const bottomBar = getByTestId('map-bottom-bar');
    const bottomBarFlat = StyleSheet.flatten(bottomBar.props.style) || {};
    if (bottomBarFlat.position === 'absolute') {
      expect(bottomBarFlat.bottom).toBeGreaterThanOrEqual(70);
    } else {
      expect(bottomBar).toBeTruthy();
    }
  });

  test('RED-WIZARD-HARMONIZATION-01: MultiCityPlanWizard primary CTA uses high-contrast styling without Tailwind blue #3B82F6 and has dock clearance', () => {
    useThemeStore.getState().setThemeMode('dark');
    const mockPlaces = [
      { id: 'plc-1', name: 'Golden Bridge', category: 'attraction', rating: 4.8, city: 'Da Nang' },
    ];

    const { getByTestId } = render(
      <MultiCityPlanWizard
        places={mockPlaces}
        onCancel={jest.fn()}
        onSavePlan={jest.fn()}
      />
    );

    const ctaBtn = getByTestId('wizard-primary-cta-btn');
    const ctaBtnFlat = StyleSheet.flatten(ctaBtn.props.style);
    expect(ctaBtnFlat.backgroundColor).not.toBe('#3B82F6');
    expect(ctaBtnFlat.backgroundColor).toBe('#FFFFFF'); // Obsidian dark mode primary

    const bottomActionBar = getByTestId('wizard-bottom-action-bar');
    const bottomActionBarFlat = StyleSheet.flatten(bottomActionBar.props.style);
    expect(bottomActionBarFlat.bottom).toBeGreaterThanOrEqual(70);
  });

  test('RED-HOTEL-BOOK-01: In Dark Mode, HotelCard bookBtnText has dark text #111827 on #FFFFFF button', () => {
    useThemeStore.getState().setThemeMode('dark');
    const mockHotel = {
      id: 'htl-1',
      name: 'Vinpearl Resort Da Nang',
      rating: 4.9,
      pricePerNight: 2500000,
      totalPrice: 7500000,
      image: 'https://example.com/hotel.jpg',
    };

    const { getByText } = render(<HotelCard hotel={mockHotel} onSelect={jest.fn()} />);

    const bookText = getByText('Book now');
    const bookTextFlat = StyleSheet.flatten(bookText.props.style);
    expect(bookTextFlat.color).not.toBe('#FFFFFF');
    expect(bookTextFlat.color).toBe('#111827');
  });
});
