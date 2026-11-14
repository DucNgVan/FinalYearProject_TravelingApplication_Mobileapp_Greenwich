import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import GroupScreen from '../../src/screens/group/GroupScreen';
import { useItineraryStore } from '../../src/stores/itinerary.store';

describe('Frontend Test: GroupScreen Persistent Packing List Integration', () => {
  beforeEach(() => {
    useItineraryStore.setState({
      currentTrip: {
        id: 'trip-group-test',
        title: 'Da Nang Squad Tour',
        collaborators: [
          { id: 'u1', fullName: 'Duc Nguyen', role: 'OWNER' },
          { id: 'u2', fullName: 'Sarah', role: 'EDITOR' },
        ],
        packingList: [
          { id: 'p1', title: 'Passports & Visa', category: 'Documents', assignee: 'All Squad', checked: true },
          { id: 'p2', title: 'Sunscreen SPF 50', category: 'Personal', assignee: 'Duc', checked: false },
        ],
      },
    });
  });

  it('RED-FE-PCK-01: renders packing list from currentTrip and toggles item completion', async () => {
    const { getByText, getByTestId } = render(<GroupScreen />);

    expect(getByText('Passports & Visa')).toBeTruthy();
    expect(getByText('Sunscreen SPF 50')).toBeTruthy();

    const toggleBtn = getByTestId('packing-item-toggle-p2');
    fireEvent.press(toggleBtn);

    const trip = useItineraryStore.getState().currentTrip;
    const item = trip.packingList.find((i) => i.id === 'p2');
    expect(item.checked).toBe(true);
  });
});
