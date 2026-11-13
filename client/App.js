import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import OnboardingScreen from './src/screens/onboarding/OnboardingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import FlightSearchScreen from './src/screens/booking/FlightSearchScreen';
import HotelSearchScreen from './src/screens/booking/HotelSearchScreen';
import HomeScreen from './src/screens/home/HomeScreen';
import PlanScreen from './src/screens/plan/PlanScreen';
import GroupScreen from './src/screens/group/GroupScreen';
import ProfileScreen from './src/screens/account/ProfileScreen';
import LucideIcon from './src/components/common/LucideIcon';
import {
  FlightIcon,
  HotelIcon,
  HomeIcon,
  PlanIcon,
  ProfileIcon,
} from './src/components/common/NomadixIcons';
import { useAuthStore } from './src/stores/auth.store';
import { useThemeStore } from './src/stores/theme.store';
import { colors } from './src/theme/colors';
import { typography } from './src/theme/typography';

export default function App({ initialHasCompletedOnboarding = false, initialTab = null }) {
  const { isAuthenticated, isGuest } = useAuthStore();
  const { mode, colors: themeColors, toggleTheme } = useThemeStore();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(initialHasCompletedOnboarding);
  const [activeTab, setActiveTab] = useState(initialTab || (isGuest ? 'flights' : 'home')); // 'flights' | 'hotels' | 'home' | 'plan' | 'group' | 'profile'
  const [authScreen, setAuthScreen] = useState('login'); // 'login' | 'register'

  const authNavigation = {
    navigate: (screen) => {
      if (screen === 'Register' || screen === 'register') {
        setAuthScreen('register');
      } else if (screen === 'Onboarding') {
        setHasCompletedOnboarding(false);
      } else {
        setAuthScreen('login');
      }
    },
  };

  const isDark = mode === 'dark';

  // Pre-Login Flow: 3 Onboarding Tabs (Book, Plan, Split)
  if (!isAuthenticated && !isGuest && !hasCompletedOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: isDark ? '#07122B' : '#F8FAFC' }]}
          edges={['top', 'bottom']}
        >
          <StatusBar
            barStyle={isDark ? 'light-content' : 'dark-content'}
            backgroundColor={isDark ? '#07122B' : '#F8FAFC'}
          />
          <OnboardingScreen
            onComplete={() => setHasCompletedOnboarding(true)}
            onSkip={() => setHasCompletedOnboarding(true)}
            onLogin={() => {
              setHasCompletedOnboarding(true);
              setAuthScreen('login');
            }}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Auth Flow: Login or Register Screen
  if (!isAuthenticated && !isGuest && hasCompletedOnboarding) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={[styles.container, { backgroundColor: '#0F172A' }]}
          edges={[]}
        >
          <StatusBar barStyle="light-content" translucent={true} backgroundColor="transparent" />
          {authScreen === 'register' ? (
            <RegisterScreen navigation={authNavigation} />
          ) : (
            <LoginScreen navigation={authNavigation} />
          )}
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // Main Authenticated or Guest Flow: 5 Balanced Tabs (TREK Architecture)
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'flights':
        return <FlightSearchScreen />;
      case 'hotels':
        return <HotelSearchScreen />;
      case 'home':
        return (
          <HomeScreen
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenProfile={() => setActiveTab('profile')}
          />
        );
      case 'plan':
        return <PlanScreen />;
      case 'group':
        return <GroupScreen />;
      case 'profile':
      case 'account':
        return (
          <ProfileScreen
            onLogout={() => {
              setActiveTab('home');
              setAuthScreen('login');
            }}
          />
        );
      default:
        return (
          <HomeScreen
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenProfile={() => setActiveTab('profile')}
          />
        );
    }
  };

  return (
    <SafeAreaProvider
      testID="app-root-safe-area-provider"
      style={[styles.container, { backgroundColor: isDark ? '#121316' : (themeColors.background || '#F8FAFC') }]}
    >
      <SafeAreaView
        testID="app-root-safe-area"
        style={[styles.container, { backgroundColor: isDark ? '#121316' : (themeColors.background || '#F8FAFC') }]}
        edges={['top', 'bottom']}
      >
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#121316' : (themeColors.background || '#F8FAFC')}
        />

        {/* Main Screen Content */}
        <View style={styles.screenContainer}>{renderActiveScreen()}</View>

        {/* Bottom Navigation Dock: 5 Tabs (TREK Layout: Flights, Hotels, Home, Plan, Group) */}
        <View
          testID="app-bottom-tabbar"
          style={[
            styles.bottomBar,
            {
              backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
              borderColor: isDark ? '#2A2D35' : '#E5E7EB',
            },
          ]}
        >
          {/* Left 1: Flights */}
          <TouchableOpacity
            testID="tab-btn-flights"
            style={styles.tabButton}
            onPress={() => setActiveTab('flights')}
            activeOpacity={0.7}
          >
            <FlightIcon
              testID="lucide-icon-plane"
              color={activeTab === 'flights' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted}
              size={20}
            />
            <Text
              testID="tab-label-flights"
              style={[
                styles.tabLabel,
                { color: activeTab === 'flights' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted },
                activeTab === 'flights' && styles.tabLabelActive,
              ]}
            >
              Flights
            </Text>
          </TouchableOpacity>

          {/* Left 2: Hotels */}
          <TouchableOpacity
            testID="tab-btn-hotels"
            style={styles.tabButton}
            onPress={() => setActiveTab('hotels')}
            activeOpacity={0.7}
          >
            <HotelIcon
              testID="lucide-icon-hotel"
              color={activeTab === 'hotels' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted}
              size={20}
            />
            <Text
              testID="tab-label-hotels"
              style={[
                styles.tabLabel,
                { color: activeTab === 'hotels' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted },
                activeTab === 'hotels' && styles.tabLabelActive,
              ]}
            >
              Hotels
            </Text>
          </TouchableOpacity>

          {/* Center: Home (Focal Dock Button without outer circular ring) */}
          <View testID="tab-col-home" style={styles.centerHomeColumn}>
            <TouchableOpacity
              testID="tab-btn-home"
              style={styles.centerHomeButton}
              onPress={() => setActiveTab('home')}
              activeOpacity={0.8}
            >
              <View
                testID="center-home-logo-n"
                style={[
                  styles.centerHomeNBadge,
                  {
                    backgroundColor: isDark ? '#FFFFFF' : '#0E1B2C',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.centerHomeNText,
                    {
                      color: isDark ? '#0E1B2C' : '#FFFFFF',
                    },
                  ]}
                >
                  N
                </Text>
              </View>
              <Text
                style={[
                  styles.centerHomeLabel,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Home
              </Text>
            </TouchableOpacity>
          </View>

          {/* Right 1: Plan */}
          <TouchableOpacity
            testID="tab-btn-plan"
            style={styles.tabButton}
            onPress={() => setActiveTab('plan')}
            activeOpacity={0.7}
          >
            <PlanIcon
              testID="lucide-icon-map"
              color={activeTab === 'plan' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted}
              size={20}
            />
            <Text
              testID="tab-label-plan"
              style={[
                styles.tabLabel,
                { color: activeTab === 'plan' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted },
                activeTab === 'plan' && styles.tabLabelActive,
              ]}
            >
              Plan
            </Text>
          </TouchableOpacity>

          {/* Right 2: Profile */}
          <TouchableOpacity
            testID="tab-btn-profile"
            style={styles.tabButton}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <ProfileIcon
              testID="lucide-icon-users"
              color={activeTab === 'profile' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted}
              size={20}
            />
            <Text
              testID="tab-label-profile"
              style={[
                styles.tabLabel,
                { color: activeTab === 'profile' ? (isDark ? '#FFFFFF' : '#0F172A') : themeColors.textMuted },
                activeTab === 'profile' && styles.tabLabelActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    borderWidth: 1,
    marginHorizontal: 12,
    marginBottom: 8,
    borderRadius: 28,
    height: 66,
    paddingHorizontal: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  tabButtonActive: {
    transform: [{ scale: 1.02 }],
  },
  tabGlyph: {
    fontSize: 16,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginTop: 5,
    textAlign: 'center',
  },
  tabLabelActive: {
    fontWeight: '900',
  },
  centerHomeColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHomeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 2,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  centerHomeNBadge: {
    width: 22,
    height: 22,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  centerHomeNText: {
    fontSize: 13,
    fontWeight: '900',
    includeFontPadding: false,
    textAlign: 'center',
    lineHeight: 15,
  },
  centerHomeLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.3,
    marginTop: 1,
    color: '#0F172A',
  },
});
