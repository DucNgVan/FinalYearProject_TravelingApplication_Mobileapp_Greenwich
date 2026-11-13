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

  test('RED-FE-MOCKUP-02: App navigates to Profile from bottom dock profile button', () => {
    const { getByTestId, getAllByText } = render(<App initialHasCompletedOnboarding={true} />);

    const profileBtn = getByTestId('tab-btn-profile');
    expect(profileBtn).toBeTruthy();

    fireEvent.press(profileBtn);
    expect(getAllByText(/Profile/i).length).toBeGreaterThan(0);
  });

  test('RED-FE-MOCKUP-03: HomeScreen renders all components matching nomadix_app_mockup.html exactly', () => {
    const mockNavigate = jest.fn();
    const mockProfile = jest.fn();

    const { getByText, getAllByText, getByTestId, getByDisplayValue } = render(
      <HomeScreen onNavigateTab={mockNavigate} onOpenProfile={mockProfile} />
    );

    // 1. Header with [N] logo, NOMADIX, Smart Squad Travel, Bell
    expect(getAllByText('N').length).toBeGreaterThan(0);
    expect(getByText(/NOMADIX/i)).toBeTruthy();
    expect(getByText(/Smart Squad Travel/i)).toBeTruthy();
    expect(getByTestId('home-bell-btn')).toBeTruthy();

    // 2. Hero Card (Berlin 2026 or Suggested Expedition)
    expect(getByText(/Recent|FEATURED EXPEDITION|SUGGESTED JOURNEY/i)).toBeTruthy();

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

    // 6. Travel Radar & Weather widget
    expect(getByText(/TRAVEL RADAR & WEATHER/i)).toBeTruthy();
    expect(getAllByText('Da Nang').length).toBeGreaterThan(0);
    expect(getByText('Today')).toBeTruthy();
  });

  test('RED-FE-MOCKUP-04: GroupScreen renders squad members, expenses, and packing snippet matching mockup', () => {
    const { getByText, getByTestId } = render(<GroupScreen />);

    // Header
    expect(getByText(/Group & Sổ Quỹ|Squad & Shared Ledger/i)).toBeTruthy();
    expect(getByText(/Đà Nẵng & Hội An 2026 • 3 Thành viên|Danang & Hoi An 2026 • 3 Members/i)).toBeTruthy();
    expect(getByText(/\+ Mời bạn|\+ Invite Friend/i)).toBeTruthy();

    // Squad members
    expect(getByText('Guest Traveler')).toBeTruthy();
    expect(getByText('guest@nomadix.app')).toBeTruthy();
    expect(getByText(/Chủ chuyến đi \(Owner\)|Trip Owner/i)).toBeTruthy();

    expect(getByText(/Linh Hoàng|Linh Hoang/i)).toBeTruthy();
    expect(getByText('linh@gmail.com')).toBeTruthy();
    expect(getByText('Editor')).toBeTruthy();

    expect(getByText(/Nam Trần|Nam Tran/i)).toBeTruthy();
    expect(getByText('nam@gmail.com')).toBeTruthy();
    expect(getByText('Viewer')).toBeTruthy();

    // Expenses
    expect(getByText(/12\.450\.000 ₫|12,450,000 ₫/i)).toBeTruthy();
    expect(getByText(/Bạn đang nợ \(You owe\)|You Owe/i)).toBeTruthy();
    expect(getByText('0 ₫')).toBeTruthy();
    expect(getByText(/Bạn được nhận \(You're owed\)|You're Owed/i)).toBeTruthy();
    expect(getByText(/850\.000 ₫|850,000 ₫/i)).toBeTruthy();
    expect(getByText(/Mọi người đã cân bằng nợ|All balances are settled/i)).toBeTruthy();

    // Packing list
    expect(getByText(/Đồ cần chuẩn bị \(Packing List\)|PACKING LIST/i)).toBeTruthy();
    expect(getByText(/3\/5 hoàn thành|3\/5 completed/i)).toBeTruthy();
  });
});
