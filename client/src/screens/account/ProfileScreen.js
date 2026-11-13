import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/auth.store';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import BoardingPassModal from '../../components/booking/BoardingPassModal';
import TicketSupportModal from '../../components/booking/TicketSupportModal';
import PaymentCardsModal from './PaymentCardsModal';
import AccountSettingsModal from './AccountSettingsModal';
import MyTicketsModal from './MyTicketsModal';
import MyBookingsModal from './MyBookingsModal';
import AppSettingsModal from './AppSettingsModal';
import HelpSupportModal from './HelpSupportModal';
import LegalPrivacyModal from './LegalPrivacyModal';
import {
  CardIcon,
  TicketIcon,
  BedIcon,
  SupportIcon,
  ChevronRightIcon,
  ProfileIcon,
  CheckIcon,
  BellIcon,
  SettingsIcon,
  HelpCircleIcon,
  ShieldLockIcon,
} from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export default function ProfileScreen({ onLogout } = {}) {
  const { user, logout } = useAuthStore();
  const { mode, colors: themeColors, toggleTheme } = useThemeStore();
  const isDark = mode === 'dark';
  const bookedTickets = useBookingStore((state) => state.bookedTickets) || [];
  const bookedHotels = useBookingStore((state) => state.bookedHotels) || [];

  const [activeSubScreen, setActiveSubScreen] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [supportTicket, setSupportTicket] = useState(null);
  const [isSupportVisible, setIsSupportVisible] = useState(false);
  const [isPaymentCardsVisible, setIsPaymentCardsVisible] = useState(false);
  const [isAccountSettingsVisible, setIsAccountSettingsVisible] = useState(false);
  const [isMyTicketsVisible, setIsMyTicketsVisible] = useState(false);
  const [isMyBookingsVisible, setIsMyBookingsVisible] = useState(false);
  const [isAppSettingsVisible, setIsAppSettingsVisible] = useState(false);
  const [isHelpSupportVisible, setIsHelpSupportVisible] = useState(false);
  const [isLegalPrivacyVisible, setIsLegalPrivacyVisible] = useState(false);

  const fullName = user?.fullName || 'Guest Traveler';
  const email = user?.email || 'guest@nomadix.app';
  const initial = (fullName.charAt(0) || 'G').toUpperCase();

  const defaultTicket = {
    id: 'tkt-seed-001',
    pnr: 'VN-8X2K9P',
    ticketNumber: '738-2491048291',
    airlineCode: 'VN',
    airlineName: 'Vietnam Airlines',
    flightNumber: 'VN-0240',
    origin: 'SGN',
    destination: 'HAN',
    departureTime: '2026-10-15T07:00:00Z',
    arrivalTime: '2026-10-15T09:10:00Z',
    durationMinutes: 130,
    stops: 0,
    aircraft: 'Airbus A350-900',
    cabinClass: 'Economy',
    totalPrice: 2073060,
    passenger: { fullName, email },
    status: 'CONFIRMED',
  };

  const ticketsToDisplay = bookedTickets.length > 0 ? bookedTickets : [defaultTicket];

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');

  const closeSubScreen = () => {
    setActiveSubScreen(null);
    setIsMyTicketsVisible(false);
    setIsMyBookingsVisible(false);
    setIsPaymentCardsVisible(false);
    setIsAccountSettingsVisible(false);
    setIsAppSettingsVisible(false);
    setIsHelpSupportVisible(false);
    setIsLegalPrivacyVisible(false);
  };

  return (
    <View testID="profile-root-container" style={[styles.safeArea, { backgroundColor: bg }]}>
      <ScrollView
        testID="profile-scroll-view"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Title and Edit Settings Button */}
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.eyebrow, { color: textMuted }]}>ACCOUNT</Text>
            <Text style={[styles.title, { color: textColor }]}>Profile</Text>
            <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>
              Travel profile, explorer rank & account settings
            </Text>
          </View>
          <TouchableOpacity
            testID="profile-edit-settings-btn"
            style={[styles.headerEditBtn, { borderColor, backgroundColor: cardBg }]}
            onPress={() => setIsAccountSettingsVisible(true)}
            activeOpacity={0.7}
          >
            <ProfileIcon size={20} color={textColor} />
          </TouchableOpacity>
        </View>

        {/* Hero Card: Refined White/Obsidian Personal Card */}
        <View
          testID="profile-user-card"
          style={[
            styles.heroCard,
            {
              backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
              borderColor: isDark ? '#2A2D35' : '#E2E8F0',
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.heroUserRow}>
            <View
              testID="profile-avatar-container"
              style={[
                styles.avatarCircle,
                { backgroundColor: isDark ? '#2A2D35' : '#E3F2F0' },
              ]}
            >
              {user?.avatarUrl ? (
                <Image
                  testID="profile-avatar-image"
                  source={{ uri: user.avatarUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text
                  testID="profile-avatar-initial"
                  style={[
                    styles.avatarText,
                    { color: isDark ? '#FFFFFF' : '#0B6B67' },
                  ]}
                >
                  {initial}
                </Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heroUserName, { color: textColor }]}>{fullName}</Text>
              <Text style={[styles.heroUserEmail, { color: textMuted }]}>{email}</Text>
            </View>
            <View
              style={[
                styles.roleBadgePill,
                { backgroundColor: isDark ? 'rgba(11, 122, 117, 0.25)' : '#E3F2F0' },
              ]}
            >
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: isDark ? '#34D399' : '#0B7A75' },
                ]}
              >
                {user?.role || 'Explorer'}
              </Text>
            </View>
          </View>

          {/* Level XP Bar */}
          <View
            testID="profile-level-badge"
            style={styles.levelRow}
          >
            <Text
              testID="profile-level-badge-text"
              style={[
                styles.levelText,
                { color: isDark ? '#34D399' : '#2E7D5B' },
              ]}
            >
              <Text>Explorer Level 5</Text> • <Text>1,450 XP</Text>
            </Text>
          </View>
          <View
            style={[
              styles.progressBarTrack,
              { backgroundColor: isDark ? '#2A2D35' : '#E2E8F0' },
            ]}
          >
            <View
              testID="profile-hero-progress-fill"
              style={[
                styles.progressBarFill,
                { backgroundColor: isDark ? '#34D399' : '#2E7D5B', width: '68%' },
              ]}
            />
          </View>

          {/* 3 Stat Boxes */}
          <View style={styles.heroStatsRow}>
            <View
              testID="profile-stat-trips"
              style={[
                styles.heroStatBox,
                {
                  backgroundColor: isDark ? '#121316' : '#F8FAFC',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.statCount, { color: textColor }]}>4</Text>
              <Text style={[styles.statSubLabel, { color: textMuted }]}>Trips</Text>
            </View>
            <View
              testID="profile-stat-checkins"
              style={[
                styles.heroStatBox,
                {
                  backgroundColor: isDark ? '#121316' : '#F8FAFC',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.statCount, { color: isDark ? '#34D399' : '#2E7D5B' }]}>12</Text>
              <Text style={[styles.statSubLabel, { color: textMuted }]}>Check-ins</Text>
            </View>
            <View
              testID="profile-stat-badges"
              style={[
                styles.heroStatBox,
                {
                  backgroundColor: isDark ? '#121316' : '#F8FAFC',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                  borderWidth: 1,
                },
              ]}
            >
              <Text style={[styles.statCount, { color: isDark ? '#60A5FA' : '#2563EB' }]}>6</Text>
              <Text style={[styles.statSubLabel, { color: textMuted }]}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Region 1: SERVICES & BOOKINGS */}
        <Text style={[styles.sectionGroupTitle, { color: textMuted }]}>SERVICES & BOOKINGS</Text>
        <View style={[styles.menuContainer, { backgroundColor: cardBg, borderColor }]}>
          {/* Row 1: My Tickets */}
          <TouchableOpacity
            testID="profile-menu-tickets"
            style={styles.menuItemRow}
            onPress={() => setIsMyTicketsVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="badge-icon-tickets" style={[styles.menuIconBadge, { backgroundColor: '#E3F2F0' }]}>
              <TicketIcon size={20} color="#0B6B67" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuTitle, { color: textColor }]}>My Tickets</Text>
              <Text style={[styles.menuSubtitle, { color: textMuted }]}>SGN → HAN · Sat, 14 Nov</Text>
            </View>
            <View style={styles.activeTag}>
              <Text style={styles.activeTagText}>1 active</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>

          {/* Row 2: My Bookings */}
          <TouchableOpacity
            testID="profile-menu-bookings"
            style={styles.menuItemRow}
            onPress={() => setIsMyBookingsVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="badge-icon-bookings" style={[styles.menuIconBadge, { backgroundColor: '#FDECE7' }]}>
              <BedIcon size={20} color="#A8341D" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuTitle, { color: textColor }]}>My Bookings</Text>
              <Text style={[styles.menuSubtitle, { color: textMuted }]}>2 upcoming stays · Vinpearl Resort</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>
        </View>

        {/* Region 2: PAYMENT & FINANCE */}
        <Text style={[styles.sectionGroupTitle, { color: textMuted }]}>PAYMENT & FINANCE</Text>
        <View style={[styles.menuContainer, { backgroundColor: cardBg, borderColor }]}>
          {/* Row 3: Payment Methods */}
          <TouchableOpacity
            testID="profile-menu-payment"
            style={styles.menuItemRow}
            onPress={() => setIsPaymentCardsVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="profile-payment-cards-row" style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View testID="badge-icon-payment" style={[styles.menuIconBadge, { backgroundColor: '#E8EAF8' }]}>
                <CardIcon size={20} color="#3B3F9E" />
              </View>
              <View style={styles.menuTextGroup}>
                <Text style={[styles.menuTitle, { color: textColor }]}>Payment Methods</Text>
                <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Payment Cards & Methods</Text>
                <Text style={[styles.menuSubtitle, { color: textMuted }]}>Visa •••• 4821 · Default card</Text>
              </View>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>

          {/* Row 4: Account Settings */}
          <TouchableOpacity
            testID="profile-menu-account"
            style={styles.menuItemRow}
            onPress={() => setIsAccountSettingsVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="badge-icon-account" style={[styles.menuIconBadge, { backgroundColor: '#E3F2F0' }]}>
              <ProfileIcon size={20} color="#0B7A75" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuTitle, { color: textColor }]}>Account Settings</Text>
              <Text style={[styles.menuSubtitle, { color: textMuted }]}>Personal details, security & password</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>
        </View>

        {/* Region 3: SYSTEM & SUPPORT */}
        <Text style={[styles.sectionGroupTitle, { color: textMuted }]}>SYSTEM & SUPPORT</Text>
        <View style={[styles.menuContainer, { backgroundColor: cardBg, borderColor }]}>
          {/* Row 5: Preferences & Settings */}
          <TouchableOpacity
            testID="profile-menu-settings"
            style={styles.menuItemRow}
            onPress={() => setIsAppSettingsVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="badge-icon-settings" style={[styles.menuIconBadge, { backgroundColor: '#EAE8F8' }]}>
              <SettingsIcon size={20} color="#5C4B99" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuTitle, { color: textColor }]}>Preferences & Settings</Text>
              <Text style={[styles.menuSubtitle, { color: textMuted }]}>Theme, currency, language & alerts</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>

          {/* Row 6: Help & Support */}
          <TouchableOpacity
            testID="profile-menu-help"
            style={styles.menuItemRow}
            onPress={() => setIsHelpSupportVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="profile-ticket-support-row" style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View testID="profile-menu-support" style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View testID="badge-icon-help" style={[styles.menuIconBadge, { backgroundColor: '#FBF1D6' }]}>
                  <HelpCircleIcon size={20} color="#7A4A06" />
                </View>
                <View style={styles.menuTextGroup}>
                  <Text style={[styles.menuTitle, { color: textColor }]}>
                    <Text>Help & Support</Text> · <Text>Ticket Support & Refunds</Text>
                  </Text>
                  <Text style={[styles.menuSubtitle, { color: textMuted }]}>24/7 hotline 1900 6868 & refunds</Text>
                </View>
              </View>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>

          {/* Row 7: Legal & Privacy */}
          <TouchableOpacity
            testID="profile-menu-legal"
            style={styles.menuItemRow}
            onPress={() => setIsLegalPrivacyVisible(true)}
            activeOpacity={0.7}
          >
            <View testID="badge-icon-legal" style={[styles.menuIconBadge, { backgroundColor: '#E2F5EA' }]}>
              <ShieldLockIcon size={20} color="#166534" />
            </View>
            <View style={styles.menuTextGroup}>
              <Text style={[styles.menuTitle, { color: textColor }]}>Legal & Privacy</Text>
              <Text style={[styles.menuSubtitle, { color: textMuted }]}>Terms of service, GDPR & data rights</Text>
            </View>
            <ChevronRightIcon size={18} color={textMuted} />
          </TouchableOpacity>
        </View>

        {/* Appearance Switcher Card */}
        <View style={[styles.appearanceCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.appearanceTitle, { color: textColor }]}>Appearance</Text>
          <View
            testID="app-theme-segmented"
            style={[styles.themePillsRow, { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' }]}
          >
            <TouchableOpacity
              testID="theme-pill-light"
              style={[
                styles.themePillBtn,
                mode === 'light' && [styles.themePillBtnActive, { backgroundColor: '#FFFFFF' }],
              ]}
              onPress={() => mode !== 'light' && toggleTheme()}
              activeOpacity={0.8}
            >
              <Text style={[styles.themePillBtnText, { color: mode === 'light' ? '#0E1B2C' : textMuted }]}>
                Light Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="theme-toggle-row"
              style={[
                styles.themePillBtn,
                mode === 'dark' && [styles.themePillBtnActive, { backgroundColor: '#0E1B2C' }],
              ]}
              onPress={() => mode !== 'dark' && toggleTheme()}
              activeOpacity={0.8}
            >
              <Text style={[styles.themePillBtnText, { color: mode === 'dark' ? '#FFFFFF' : textMuted }]}>
                Dark Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          testID="profile-logout-btn"
          style={styles.logoutBtn}
          onPress={() => {
            logout?.();
            onLogout?.();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Full-Page Dedicated Sub-Screens */}
      {(activeSubScreen === 'tickets' || isMyTicketsVisible) && (
        <MyTicketsModal
          visible={true}
          onClose={closeSubScreen}
        />
      )}
      {(activeSubScreen === 'bookings' || isMyBookingsVisible) && (
        <MyBookingsModal
          visible={true}
          onClose={closeSubScreen}
        />
      )}
      {(activeSubScreen === 'payment' || isPaymentCardsVisible) && (
        <PaymentCardsModal
          visible={true}
          onClose={closeSubScreen}
        />
      )}
      {(activeSubScreen === 'account' || isAccountSettingsVisible) && (
        <AccountSettingsModal
          visible={true}
          onClose={closeSubScreen}
        />
      )}
      {(activeSubScreen === 'preferences' || isAppSettingsVisible) && (
        <AppSettingsModal
          visible={true}
          onClose={closeSubScreen}
        />
      )}
      {(activeSubScreen === 'help' || isHelpSupportVisible) && (
        <HelpSupportModal
          visible={true}
          onClose={closeSubScreen}
          onOpenTicketSupport={() => {
            closeSubScreen();
            setSupportTicket(selectedTicket || bookedTickets[0] || defaultTicket);
            setIsSupportVisible(true);
          }}
        />
      )}
      {(activeSubScreen === 'legal' || isLegalPrivacyVisible) && (
        <LegalPrivacyModal
          visible={true}
          onClose={closeSubScreen}
        />
      )}

      {/* Boarding Pass Modal */}
      <BoardingPassModal
        visible={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onOpenSupport={(tkt) => {
          setSupportTicket(tkt);
          setIsSupportVisible(true);
        }}
      />

      {/* Ticket Support Modal */}
      <TicketSupportModal
        visible={isSupportVisible}
        ticket={supportTicket}
        onClose={() => setIsSupportVisible(false)}
        onSuccess={() => {
          setIsSupportVisible(false);
          setSelectedTicket(null);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  headerEditBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    borderRadius: 28,
    padding: 20,
    backgroundColor: '#0E1B2C',
    marginBottom: 16,
  },
  heroUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  avatarText: {
    color: '#0B7A75',
    fontSize: 24,
    fontWeight: '800',
  },
  heroUserName: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
  },
  heroUserEmail: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    marginTop: 2,
  },
  roleBadgePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  roleBadgeText: {
    color: '#0E1B2C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  levelRow: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  levelText: {
    fontSize: 13,
    fontWeight: '800',
  },
  xpText: {
    fontSize: 13,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '68%',
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC53D',
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
  },
  heroStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCount: {
    fontSize: 20,
    fontWeight: '800',
  },
  statSubLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
  },
  sectionGroupTitle: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 18,
    marginBottom: 8,
    paddingLeft: 4,
  },
  menuContainer: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 14,
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  menuSubtitle: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  activeTag: {
    backgroundColor: '#E3F2F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginRight: 8,
  },
  activeTagText: {
    color: '#0B6B67',
    fontSize: 11,
    fontWeight: '800',
  },
  appearanceCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  appearanceTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  themePillsRow: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    width: 180,
  },
  themePillBtn: {
    flex: 1,
    height: 34,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themePillBtnActive: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  themePillBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    fontSize: 14,
    marginRight: 12,
    width: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bookedSection: {
    marginBottom: 16,
  },
  sectionHeaderRow: {
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ticketCard: {
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  ticketCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  airlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  miniBadge: {
    width: 20,
    height: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  ticketAirlineText: {
    fontSize: 12,
    fontWeight: '800',
  },
  confirmedBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  confirmedBadgeText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  ticketRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  ticketRouteText: {
    fontSize: 16,
    fontWeight: '800',
  },
  ticketTimeText: {
    fontSize: 12,
    marginTop: 2,
  },
  pnrCodeLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  pnrCodeValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 6,
  },
  boardingPassLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0B7A75',
  },
  ticketPriceText: {
    fontSize: 12,
    fontWeight: '800',
  },
  logoutBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 15,
    fontWeight: '700',
  },
});
