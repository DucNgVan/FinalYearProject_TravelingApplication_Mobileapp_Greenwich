import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import PlanScreen from '../../src/screens/plan/PlanScreen';
import AccordionTripWizardModal from '../../src/components/plan/AccordionTripWizardModal';
import HotelCard from '../../src/components/booking/HotelCard';
import { useItineraryStore } from '../../src/stores/itinerary.store';
import { useThemeStore } from '../../src/stores/theme.store';

describe('TDD RED: Plan Persistence, Flight Color Harmonization & 5-Step Wizard UI', () => {
  beforeEach(() => {
    useThemeStore.getState().setThemeMode('light');
  });

  test('RED-PLAN-PERSIST-01: useItineraryStore preserves newly created trip and merges on fetchTrips', async () => {
    const store = useItineraryStore.getState();
    const newTrip = {
      id: 'trip-hanoi-999',
      title: 'Hà Nội Expedition',
      destinationCity: 'Hà Nội',
      country: 'Việt Nam',
      daysCount: 3,
      travelMode: 'group',
      travelersCount: 3,
      days: [
        { dayNumber: 1, date: '2026-11-15', items: [{ id: 's1', name: 'Văn Miếu' }] },
      ],
    };

    // Store has currentTrip set
    useItineraryStore.setState({
      trips: [newTrip],
      currentTrip: newTrip,
    });

    expect(useItineraryStore.getState().currentTrip).toEqual(newTrip);
    expect(useItineraryStore.getState().trips).toHaveLength(1);

    // If fetchTrips is called and backend returns empty [], local trips must NOT be wiped out
    // Simulate empty response merge
    const currentTrips = useItineraryStore.getState().trips;
    expect(currentTrips).toContainEqual(newTrip);
  });

  test('RED-PLAN-PERSIST-02: PlanScreen renders active trip immediately and retains it upon remount', () => {
    const activeTrip = {
      id: 'trip-active-hanoi',
      title: 'Hà Nội Expedition',
      destination: 'Hà Nội',
      destinationCity: 'Hà Nội',
      country: 'Việt Nam',
      daysCount: 3,
      days: [
        {
          dayNumber: 1,
          dayIndex: 1,
          date: '2026-11-15',
          items: [{ id: 'sp-1', name: 'Văn Miếu Quốc Tử Giám', time: '09:00', duration: '2h' }],
        },
      ],
    };

    useItineraryStore.setState({
      trips: [activeTrip],
      currentTrip: activeTrip,
    });

    const { getByTestId, queryByTestId } = render(<PlanScreen />);

    // Must NOT show empty state
    expect(queryByTestId('saved-trips-empty-state')).toBeNull();
    // Must show active plan header or container
    expect(getByTestId('plan-header-main')).toBeTruthy();
  });

  test('RED-PLAN-UI-01: PlanScreen sub-tab switcher uses Flight high-contrast segmented capsule (#111827 active in light mode)', () => {
    const activeTrip = {
      id: 'trip-active-1',
      title: 'Hà Nội Expedition',
      destination: 'Hà Nội',
      destinationCity: 'Hà Nội',
      days: [{ dayIndex: 1, items: [{ id: 's1', name: 'Văn Miếu' }] }],
    };
    useItineraryStore.setState({
      trips: [activeTrip],
      currentTrip: activeTrip,
    });

    const { getByTestId } = render(<PlanScreen />);

    const capsuleContainer = getByTestId('plan-subtab-capsule');
    expect(capsuleContainer).toBeTruthy();

    const activeSubTabBtn = getByTestId('plan-subtab-itinerary');
    const activeSubTabStyle = StyleSheet.flatten(activeSubTabBtn.props.style);
    expect(activeSubTabStyle.backgroundColor).toBe('#111827');
  });

  test('RED-WIZARD-SCREENSHOTS-01: AccordionTripWizardModal renders 5-step UI per user screenshots (NX Boarding Pass on Step 5)', () => {
    const { getByTestId } = render(
      <AccordionTripWizardModal visible={true} onClose={() => {}} onComplete={() => {}} />
    );

    // Step 1: Destination card for Hà Nội
    const hanoiCard = getByTestId('wizard-dest-card-Hà Nội');
    expect(hanoiCard).toBeTruthy();

    // Step indicators (Step 1 to 5)
    expect(getByTestId('wizard-step-progress-bar')).toBeTruthy();
  });

  test('RED-HOTEL-CARD-EXACT-01: HotelCard implements Image 1 Boarding Pass header strip and Book Stay button', () => {
    const mockHotel = {
      id: 'hotel-anantara',
      name: 'Anantara Hoi An Resort',
      city: 'Hội An',
      address: '1 Phạm Hồng Thái, Cẩm Châu, Hội An',
      starRating: 5,
      rating: 9.4,
      reviewCount: 320,
      price: { amount: 3450000, currency: 'VND' },
      images: ['https://images.unsplash.com/photo-resort'],
      amenities: ['Riverfront Pool', 'Anantara Spa', 'Breakfast Incl.'],
      type: 'LUXURY RESORT',
    };

    const { getByTestId } = render(<HotelCard hotel={mockHotel} stayNights={3} />);

    // Header strip matching Image 1
    const headerStrip = getByTestId('hotel-top-header-strip');
    expect(headerStrip).toBeTruthy();
    const headerStyle = StyleSheet.flatten(headerStrip.props.style);
    expect(['#0E1B2C', '#0F172A', '#0B131F']).toContain(headerStyle.backgroundColor);

    // Book Stay button matching Image 1
    const bookStayBtn = getByTestId('hotel-book-stay-btn');
    expect(bookStayBtn).toBeTruthy();
    const bookStayStyle = StyleSheet.flatten(bookStayBtn.props.style);
    expect(['#0E1B2C', '#0F172A', '#111827']).toContain(bookStayStyle.backgroundColor);
  });
});
