import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../../App';
import HomeScreen from '../../src/screens/home/HomeScreen';
import GroupScreen from '../../src/screens/group/GroupScreen';
import { useAuthStore } from '../../src/stores/auth.store';

describe('Component Test: Mockup Harmonization (Matching nomadix_app_mockup.html)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 'u-1', fullName: 'Guest Traveler', email: 'guest@nomadix.app' },
      isAuthenticated: true,
      isGuest: false,
    });
  });

  test('RED-FE-MOCKUP-01: App bottom dock renders elevated Home button with Nomadix N logo badge and Home label', () => {
    const { getByTestId, getByText } = render(<App initialHasCompletedOnboarding={true} />);

    const homeTabBtn = getByTestId('tab-btn-home');
    expect(homeTabBtn).toBeTruthy();
    expect(getByTestId('center-home-logo-n')).toBeTruthy();
    expect(getByText('Home')).toBeTruthy();
  });

  test('RED-FE-MOCKUP-02: App navigates to Profile from HomeScreen avatar button', () => {
    const { getByTestId, getAllByText } = render(<App initialHasCompletedOnboarding={true} />);

    const avatarBtn = getByTestId('home-avatar-btn');
    expect(avatarBtn).toBeTruthy();

    fireEvent.press(avatarBtn);
    expect(getAllByText(/Profile/i).length).toBeGreaterThan(0);
  });

  test('RED-FE-MOCKUP-03: HomeScreen renders all components matching nomadix_app_mockup.html exactly', () => {
    const mockNavigate = jest.fn();
    const mockProfile = jest.fn();

    const { getByText, getAllByText, getByTestId, getByDisplayValue } = render(
      <HomeScreen onNavigateTab={mockNavigate} onOpenProfile={mockProfile} />
    );

    // 1. Header with [N] logo, NOMADIX, Smart Squad Travel, Bell, Avatar G
    expect(getByText('N')).toBeTruthy();
    expect(getByText(/NOMADIX/i)).toBeTruthy();
    expect(getByText(/Smart Squad Travel/i)).toBeTruthy();
    expect(getByTestId('home-bell-btn')).toBeTruthy();
    expect(getByText('G')).toBeTruthy();

    // 2. Hero Card Berlin 2026
    expect(getByText(/Recent/i)).toBeTruthy();
    expect(getByText('Berlin 2026')).toBeTruthy();
    expect(getByText(/19 days/i)).toBeTruthy();
    expect(getByText(/13 destinations/i)).toBeTruthy();
    expect(getByText(/3 travelers/i)).toBeTruthy();

    // 3. Status nav pills
    expect(getByText('Planned')).toBeTruthy();
    expect(getByText('Archived')).toBeTruthy();
    expect(getByText('Completed')).toBeTruthy();

    // 4. Currency section
    expect(getByText(/Currency/i)).toBeTruthy();
    expect(getByDisplayValue('100')).toBeTruthy();
    expect(getByText('EUR')).toBeTruthy();
    expect(getByText('115.46')).toBeTruthy();
    expect(getByText('USD')).toBeTruthy();
    expect(getByText(/1 EUR = 1.1546 USD/i)).toBeTruthy();

    // 5. Collections
    expect(getByText(/Collections/i)).toBeTruthy();
    expect(getByText('Tokyo 2025')).toBeTruthy();
    expect(getByText(/Explored Itinerary|Lịch trình đã khám phá/i)).toBeTruthy();

    // 6. Quick shortcuts
    expect(getByText(/Quick Shortcuts/i)).toBeTruthy();
    expect(getByText(/Flights|Vé máy bay/i)).toBeTruthy();
    expect(getByText(/Hotels|Khách sạn/i)).toBeTruthy();
    expect(getAllByText(/Plan|Kế hoạch/i).length).toBeGreaterThan(0);
    expect(getByText(/Squad & Split|Group & Quỹ/i)).toBeTruthy();
  });

  test('RED-FE-MOCKUP-04: GroupScreen renders squad members, expenses, and packing snippet matching mockup', () => {
    const { getByText, getByTestId } = render(<GroupScreen />);

    // Header
    expect(getByText('Group & Sổ Quỹ')).toBeTruthy();
    expect(getByText(/Đà Nẵng & Hội An 2026 • 3 Thành viên/i)).toBeTruthy();
    expect(getByText('+ Mời bạn')).toBeTruthy();

    // Squad members
    expect(getByText('Guest Traveler')).toBeTruthy();
    expect(getByText('guest@nomadix.app')).toBeTruthy();
    expect(getByText(/Chủ chuyến đi \(Owner\)/i)).toBeTruthy();

    expect(getByText('Linh Hoàng')).toBeTruthy();
    expect(getByText('linh@gmail.com')).toBeTruthy();
    expect(getByText('Editor')).toBeTruthy();

    expect(getByText('Nam Trần')).toBeTruthy();
    expect(getByText('nam@gmail.com')).toBeTruthy();
    expect(getByText('Viewer')).toBeTruthy();

    // Expenses
    expect(getByText('12.450.000 ₫')).toBeTruthy();
    expect(getByText(/Bạn đang nợ \(You owe\)/i)).toBeTruthy();
    expect(getByText('0 ₫')).toBeTruthy();
    expect(getByText(/Bạn được nhận \(You're owed\)/i)).toBeTruthy();
    expect(getByText('850.000 ₫')).toBeTruthy();
    expect(getByText(/Mọi người đã cân bằng nợ/i)).toBeTruthy();

    // Packing list
    expect(getByText(/Đồ cần chuẩn bị \(Packing List\)/i)).toBeTruthy();
    expect(getByText(/3\/5 hoàn thành/i)).toBeTruthy();
  });
});
