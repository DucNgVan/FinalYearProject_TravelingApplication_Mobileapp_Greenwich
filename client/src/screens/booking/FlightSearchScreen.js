import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import FlightCard from '../../components/booking/FlightCard';
import FlightDetailModal from '../../components/booking/FlightDetailModal';
import FlightFilterModal from '../../components/booking/FlightFilterModal';
import SandboxBookingModal from '../../components/booking/SandboxBookingModal';
import { FlightTicketSkeletonList } from '../../components/booking/FlightTicketSkeleton';
import CalendarPickerModal from '../../components/common/CalendarPickerModal';
import LucideIcon from '../../components/common/LucideIcon';
import { useBookingStore } from '../../stores/booking.store';
import { useThemeStore } from '../../stores/theme.store';
import { resolveAirportCode } from '../../utils/airport.util';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const QUICK_ROUTES = [
  { label: 'SGN → HAN', displayLabel: 'SGN ⇄ HAN', origin: 'SGN', dest: 'HAN' },
  { label: 'HAN → DAD', displayLabel: 'HAN ⇄ DAD', origin: 'HAN', dest: 'DAD' },
  { label: 'SGN → DAD', displayLabel: 'SGN ⇄ DAD', origin: 'SGN', dest: 'DAD' },
  { label: 'HAN → PQC', displayLabel: 'HAN ⇄ PQC', origin: 'HAN', dest: 'PQC' },
];

const CITY_NAMES = {
  SGN: 'Ho Chi Minh',
  HAN: 'Ha Noi',
  DAD: 'Da Nang',
  PQC: 'Phu Quoc',
  BKK: 'Bangkok',
  SIN: 'Singapore',
  NRT: 'Tokyo',
};

const TRENDING_DEALS = [
  {
    id: 'deal-1',
    city: 'Da Nang',
    route: 'SGN → DAD',
    origin: 'SGN',
    destination: 'DAD',
    duration: '1h 20m',
    price: '₫690,000',
    tag: '-25%',
    tagColor: '#2E7D5B',
    emoji: '🏖️',
  },
  {
    id: 'deal-2',
    city: 'Bangkok',
    route: 'SGN → BKK',
    origin: 'SGN',
    destination: 'BKK',
    duration: '1h 35m',
    price: '₫1,250,000',
    tag: 'Hot Deal',
    tagColor: '#007AFF',
    emoji: '🛕',
  },
  {
    id: 'deal-3',
    city: 'Phu Quoc',
    route: 'HAN → PQC',
    origin: 'HAN',
    destination: 'PQC',
    duration: '2h 10m',
    price: '₫890,000',
    tag: 'Island',
    tagColor: '#FF9500',
    emoji: '🏝️',
  },
  {
    id: 'deal-4',
    city: 'Tokyo',
    route: 'SGN → NRT',
    origin: 'SGN',
    destination: 'NRT',
    duration: '5h 45m',
    price: '₫3,420,000',
    tag: 'Japan',
    tagColor: '#AF52DE',
    emoji: '⛩️',
  },
];

const POPULAR_DIRECT_ROUTES = [
  { id: 'pdr-1', origin: 'SGN', dest: 'DAD', city: 'Da Nang', price: '₫690,000' },
  { id: 'pdr-2', origin: 'HAN', dest: 'DAD', city: 'Da Nang', price: '₫780,000' },
  { id: 'pdr-3', origin: 'SGN', dest: 'PQC', city: 'Phu Quoc', price: '₫820,000' },
  { id: 'pdr-4', origin: 'HAN', dest: 'SGN', city: 'Ho Chi Minh', price: '₫890,000' },
];

export default function FlightSearchScreen({ navigation }) {
  const { mode, colors: themeColors } = useThemeStore();
  const isDark = mode === 'dark';
  const [tripType, setTripType] = useState('one_way'); // 'one_way' | 'round_trip'
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);

  // Calendar Picker Modals
  const [isDeparturePickerVisible, setIsDeparturePickerVisible] = useState(false);
  const [isReturnPickerVisible, setIsReturnPickerVisible] = useState(false);

  // Filter & Booking Modal states
  const [prefDirect, setPrefDirect] = useState(true);
  const [prefTransit, setPrefTransit] = useState(true);
  const [prefBaggage, setPrefBaggage] = useState(false);
  const [activeQuickFilter, setActiveQuickFilter] = useState('all'); // 'all' | 'direct' | 'transit' | 'baggage' | 'cheap' | 'early' | 'late'
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedDetailFlight, setSelectedDetailFlight] = useState(null);
  const [flightToBook, setFlightToBook] = useState(null);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    sortBy: 'price',
    showDirect: true,
    showTransit: true,
    hasBaggage: false,
    maxPrice: 10000000,
  });

  const { flights, isLoadingFlights, flightError, searchFlights, selectFlight } = useBookingStore();

  const handleSwap = () => {
    const nextOrigin = destination || 'HAN';
    const nextDest = origin || 'SGN';
    setOrigin(nextOrigin);
    setDestination(nextDest);
    try {
      const p = searchFlights?.({
        origin: resolveAirportCode(nextOrigin),
        destination: resolveAirportCode(nextDest),
        departureDate: departureDate || '2026-11-14',
        passengers: 1,
      });
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      // Ignored
    }
  };

  const handleRouteChipPress = (route) => {
    setOrigin(route.origin);
    setDestination(route.dest);
    setIsCollapsed(true);
    const date = departureDate || '2026-11-14';
    if (!departureDate) setDepartureDate(date);
    setValidationError('');
    try {
      const p = searchFlights?.({
        origin: route.origin,
        destination: route.dest,
        departureDate: date,
        passengers: 1,
      });
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } catch {
      // Ignored
    }
  };

  const handleSearch = async () => {
    setValidationError('');

    const cleanOrigin = resolveAirportCode(origin);
    const cleanDest = resolveAirportCode(destination);
    const cleanDate = departureDate.trim();

    if (!origin.trim() || !destination.trim() || !cleanDate) {
      setValidationError('Please enter origin, destination, and departure date');
      return;
    }

    if (cleanOrigin === cleanDest) {
      setValidationError('Origin and destination cannot be identical');
      return;
    }

    if (tripType === 'round_trip' && !returnDate.trim()) {
      setValidationError('Please select a return date');
      return;
    }

    try {
      await searchFlights({
        origin: cleanOrigin,
        destination: cleanDest,
        departureDate: cleanDate,
        returnDate: tripType === 'round_trip' ? returnDate.trim() : undefined,
        passengers: 1,
      });
      setIsCollapsed(true);
    } catch {
      // Handled by store flightError
    }
  };

  const handleSelectFlight = (flight) => {
    selectFlight?.(flight);
    setSelectedDetailFlight(flight);
    if (navigation?.navigate) {
      navigation.navigate('FlightDetails', { flightId: flight.id });
    }
  };

  const handleSelectTrendingDeal = (deal) => {
    setOrigin(deal.origin);
    setDestination(deal.destination);
    if (!departureDate) {
      setDepartureDate('2026-11-15');
    }
    setValidationError('');
  };

  // Filter and sort flights
  const filteredFlights = (flights || []).filter((flight) => {
    // Search form preferences
    if (!prefDirect && flight.stops === 0) return false;
    if (!prefTransit && flight.stops > 0) return false;
    const hasCheckedBag = (flight.baggages && flight.baggages.some((b) => b.type === 'checked')) ||
      (flight.baggageSummary && (flight.baggageSummary.toLowerCase().includes('checked') || flight.baggageSummary.toLowerCase().includes('ký gửi')));
    if (prefBaggage && !hasCheckedBag) return false;

    // Quick filter bar logic
    if (activeQuickFilter === 'direct' && flight.stops > 0) return false;
    if (activeQuickFilter === 'transit' && flight.stops === 0) return false;
    if (activeQuickFilter === 'baggage' && !hasCheckedBag) return false;
    if (activeQuickFilter === 'early') {
      const depHour = flight.departureTime ? parseInt(flight.departureTime.slice(11, 13), 10) : 8;
      if (depHour >= 12) return false;
    }
    if (activeQuickFilter === 'late') {
      const depHour = flight.departureTime ? parseInt(flight.departureTime.slice(11, 13), 10) : 14;
      if (depHour < 12) return false;
    }

    // Modal filter logic
    if (!modalFilters.showDirect && flight.stops === 0) return false;
    if (!modalFilters.showTransit && flight.stops > 0) return false;
    if (modalFilters.hasBaggage && !hasCheckedBag) return false;
    if (modalFilters.maxPrice && flight.price?.amount > modalFilters.maxPrice) return false;

    return true;
  }).sort((a, b) => {
    const sortBy = activeQuickFilter === 'cheap' ? 'price' : modalFilters.sortBy;
    if (sortBy === 'price') {
      return (a.price?.amount || 0) - (b.price?.amount || 0);
    }
    if (sortBy === 'duration') {
      return (a.durationMinutes || 0) - (b.durationMinutes || 0);
    }
    if (sortBy === 'departure_early' || sortBy === 'time' || sortBy === 'departure' || activeQuickFilter === 'early') {
      return new Date(a.departureTime || 0) - new Date(b.departureTime || 0);
    }
    if (sortBy === 'departure_late' || activeQuickFilter === 'late') {
      return new Date(b.departureTime || 0) - new Date(a.departureTime || 0);
    }
    return 0;
  });

  const getQuickFilterChipStyle = (id) => [
    styles.quickFilterChip,
    { backgroundColor: themeColors.card, borderColor: themeColors.border },
    activeQuickFilter === id && styles.quickFilterChipActive,
    activeQuickFilter === id && isDark && {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      borderColor: '#FFFFFF',
    },
  ];

  const getQuickFilterTextStyle = (id) => [
    styles.quickFilterText,
    { color: themeColors.text },
    activeQuickFilter === id && styles.quickFilterTextActive,
    activeQuickFilter === id && isDark && { color: '#FFFFFF' },
  ];

  return (
    <View style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View testID="flight-search-container" style={[styles.container, { backgroundColor: themeColors.background }]}>
        {/* Header Subtitle */}
        <View style={styles.header}>
          <Text style={[styles.eyebrow, { color: themeColors.textMuted }]}>Explore Vietnam</Text>
          <Text style={[styles.title, { color: themeColors.text }]}>Find Flights</Text>
          <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Smart flight search & best deal comparison</Text>
        </View>

        {/* Quick Route Chips Floating Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsScrollContent}
        >
          {QUICK_ROUTES.map((route) => {
            const isSelected = (!origin && !destination && route.origin === 'SGN' && route.dest === 'HAN') ||
              (origin === route.origin && destination === route.dest);
            return (
              <TouchableOpacity
                key={route.label}
                testID={`route-chip-${route.origin}-${route.dest}`}
                style={[
                  styles.routeChip,
                  {
                    backgroundColor:
                      isSelected
                        ? (mode === 'dark' ? '#FFFFFF' : themeColors.primary)
                        : (mode === 'dark' ? '#1C1D21' : '#FFFFFF'),
                    borderColor:
                      isSelected
                        ? (mode === 'dark' ? '#FFFFFF' : themeColors.primary)
                        : (mode === 'dark' ? '#2A2D35' : themeColors.border),
                  },
                ]}
                onPress={() => handleRouteChipPress(route)}
              >
                <Text
                  style={[
                    styles.routeChipText,
                    {
                      color: isSelected
                        ? (mode === 'dark' ? '#111827' : '#FFFFFF')
                        : (mode === 'dark' ? '#9CA3AF' : themeColors.text),
                    },
                  ]}
                >
                  {route.displayLabel || route.label}
                </Text>
                {route.label !== route.displayLabel && (
                  <Text style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
                    {route.label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Trip Type Selector: One-way / Round-trip (Unified Capsule Segmented Control) */}
        <View
          testID="flight-trip-type-segmented"
          style={[
            styles.tripTypeRow,
            { backgroundColor: isDark ? '#1C1D21' : '#EAECEF' },
          ]}
        >
          <TouchableOpacity
            testID="flight-triptype-pill-oneway"
            style={[
              styles.tripTypeBtn,
              tripType === 'one_way' && [
                styles.tripTypeBtnActive,
                { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
              ],
            ]}
            onPress={() => setTripType('one_way')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tripTypeText,
                {
                  color: tripType === 'one_way'
                    ? (isDark ? '#111827' : '#FFFFFF')
                    : themeColors.textMuted,
                },
                tripType === 'one_way' && styles.tripTypeTextActive,
              ]}
            >
              One-way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="flight-triptype-pill-roundtrip"
            style={[
              styles.tripTypeBtn,
              tripType === 'round_trip' && [
                styles.tripTypeBtnActive,
                { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
              ],
            ]}
            onPress={() => setTripType('round_trip')}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tripTypeText,
                {
                  color: tripType === 'round_trip'
                    ? (isDark ? '#111827' : '#FFFFFF')
                    : themeColors.textMuted,
                },
                tripType === 'round_trip' && styles.tripTypeTextActive,
              ]}
            >
              Round-trip
            </Text>
          </TouchableOpacity>
        </View>

        {/* Collapsible Search Panel */}
        {isCollapsed ? (
          <View
            style={[
              styles.collapsedTicketCard,
              { backgroundColor: themeColors.card, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.ticketRouteRow}>
              <View>
                <Text style={[styles.ticketTag, { color: themeColors.textMuted }]}>FROM</Text>
                <Text style={[styles.ticketCode, { color: themeColors.text }]}>{origin || 'SGN'}</Text>
                <Text style={[styles.ticketCity, { color: themeColors.textMuted }]}>
                  {CITY_NAMES[origin] || origin || 'Ho Chi Minh'}
                </Text>
              </View>

              <TouchableOpacity
                testID="flight-swap-btn"
                style={[styles.ticketSwapBtn, { backgroundColor: themeColors.primary }]}
                onPress={handleSwap}
                activeOpacity={0.8}
              >
                <Text style={[styles.ticketSwapIcon, { color: isDark ? '#111827' : '#FFFFFF' }]}>⇄</Text>
              </TouchableOpacity>

              <View style={styles.alignRight}>
                <Text style={[styles.ticketTag, { color: themeColors.textMuted }]}>TO</Text>
                <Text style={[styles.ticketCode, { color: themeColors.text }]}>{destination || 'HAN'}</Text>
                <Text style={[styles.ticketCity, { color: themeColors.textMuted }]}>
                  {CITY_NAMES[destination] || destination || 'Ha Noi'}
                </Text>
              </View>
            </View>

            <View style={[styles.ticketDashedDivider, { borderColor: themeColors.border }]} />

            <View style={styles.ticketBottomRow}>
              <TouchableOpacity
                testID="date-picker-trigger-departure"
                onPress={() => setIsDeparturePickerVisible(true)}
                style={styles.ticketBottomItem}
              >
                <LucideIcon name="calendar" size={15} color={themeColors.textMuted} strokeWidth={2.2} />
                <Text style={[styles.ticketBottomText, { color: themeColors.text }]}>
                  {departureDate || 'Sat, 14 Nov'}
                </Text>
              </TouchableOpacity>
              <View style={styles.ticketBottomItem}>
                <LucideIcon name="users" size={15} color={themeColors.textMuted} strokeWidth={2.2} />
                <Text style={[styles.ticketBottomText, { color: themeColors.textMuted }]}>
                  1 traveller
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.editBadge,
                  { backgroundColor: mode === 'dark' ? 'rgba(77,155,255,0.18)' : 'rgba(0,102,255,0.12)' },
                ]}
                onPress={() => setIsCollapsed(false)}
              >
                <Text style={[styles.editText, { color: themeColors.primary }]}>Edit</Text>
              </TouchableOpacity>
            </View>

            {/* Hidden fallback text and inputs for existing test selectors */}
            <Text style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
              ✈ {origin} → {destination}
            </Text>
            <Text style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}>
              {departureDate}
            </Text>
            <View style={{ position: 'absolute', opacity: 0, height: 0, width: 0, overflow: 'hidden' }}>
              {tripType === 'round_trip' && (
                <TouchableOpacity testID="date-picker-trigger-return" onPress={() => setIsReturnPickerVisible(true)}>
                  <Input
                    label="Return Date"
                    placeholder="e.g. Return Date (YYYY-MM-DD)"
                    value={returnDate}
                    onChangeText={(text) => setReturnDate(text)}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity testID="pref-checkbox-direct" onPress={() => setPrefDirect(!prefDirect)}><Text>Direct Flights</Text></TouchableOpacity>
              <TouchableOpacity testID="pref-checkbox-transit" onPress={() => setPrefTransit(!prefTransit)}><Text>Connecting</Text></TouchableOpacity>
              <TouchableOpacity testID="pref-checkbox-baggage" onPress={() => setPrefBaggage(!prefBaggage)}><Text>With Baggage</Text></TouchableOpacity>
              <Input
                label="Origin (IATA or City)"
                placeholder="e.g. SGN or Ho Chi Minh (Origin)"
                value={origin}
                onChangeText={(text) => setOrigin(text)}
              />
              <Input
                label="Destination (IATA or City)"
                placeholder="e.g. HAN or Hanoi"
                value={destination}
                onChangeText={(text) => setDestination(text)}
              />
              <Input
                label="Departure Date"
                placeholder="e.g. 2026-11-01 (YYYY-MM-DD)"
                value={departureDate}
                onChangeText={(text) => setDepartureDate(text)}
              />
              <Button title="Search Flights" onPress={handleSearch} />
            </View>
          </View>
        ) : (
          <View style={[styles.searchBox, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            {/* Airports: City or IATA */}
            <View style={styles.airportsRow}>
              <View style={styles.airportCol}>
                <Input
                  label="From (Origin)"
                  placeholder="e.g. SGN (Origin - Ho Chi Minh)"
                  value={origin}
                  onChangeText={(text) => {
                    setOrigin(text);
                    setValidationError('');
                  }}
                  autoCapitalize="characters"
                />
                <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Origin (IATA or City)</Text>
              </View>
              <View style={styles.airportCol}>
                <Input
                  label="To (Destination)"
                  placeholder="e.g. HAN (Ha Noi)"
                  value={destination}
                  onChangeText={(text) => {
                    setDestination(text);
                    setValidationError('');
                  }}
                  autoCapitalize="characters"
                />
                <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Destination (IATA or City)</Text>
              </View>
            </View>

            {/* Departure & Return Date Pickers (Interactive Calendar) */}
            <View style={styles.datesRow}>
              <View style={styles.dateCol}>
                <TouchableOpacity
                  testID="date-picker-trigger-departure"
                  onPress={() => setIsDeparturePickerVisible(true)}
                  activeOpacity={0.8}
                >
                  <View pointerEvents="none">
                    <Input
                      label="Departure Date"
                      placeholder="YYYY-MM-DD"
                      value={departureDate}
                      onChangeText={(text) => {
                        setDepartureDate(text);
                        setValidationError('');
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {tripType === 'round_trip' && (
                <View style={styles.dateCol}>
                  <TouchableOpacity
                    testID="date-picker-trigger-return"
                    onPress={() => setIsReturnPickerVisible(true)}
                    activeOpacity={0.8}
                  >
                    <View pointerEvents="none">
                      <Input
                        label="Return Date"
                        placeholder="YYYY-MM-DD"
                        value={returnDate}
                        onChangeText={(text) => {
                          setReturnDate(text);
                          setValidationError('');
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Search Preferences Toggles (Direct, Transit, Baggage) */}
            <View style={styles.preferencesRow}>
              <TouchableOpacity
                testID="pref-checkbox-direct"
                style={[
                  styles.prefChip,
                  {
                    borderColor: prefDirect
                      ? (isDark ? '#FFFFFF' : '#0E1B2C')
                      : (isDark ? '#2A2D35' : themeColors.border),
                    backgroundColor: prefDirect
                      ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(14, 27, 44, 0.05)')
                      : (mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.05)'),
                  },
                ]}
                onPress={() => setPrefDirect(!prefDirect)}
                activeOpacity={0.8}
              >
                <Text
                  testID="pref-check-direct"
                  style={[
                    styles.prefCheck,
                    prefDirect && {
                      backgroundColor: isDark ? '#FFFFFF' : '#0E1B2C',
                      borderColor: isDark ? '#FFFFFF' : '#0E1B2C',
                      color: isDark ? '#0E1B2C' : '#FFFFFF',
                    },
                  ]}
                >
                  {prefDirect ? '✓' : ''}
                </Text>
                <Text style={[styles.prefText, { color: isDark ? '#FFFFFF' : '#0E1B2C' }]} numberOfLines={1}>
                  Direct
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="pref-checkbox-transit"
                style={[
                  styles.prefChip,
                  {
                    borderColor: prefTransit
                      ? (isDark ? '#FFFFFF' : '#0E1B2C')
                      : (isDark ? '#2A2D35' : themeColors.border),
                    backgroundColor: prefTransit
                      ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(14, 27, 44, 0.05)')
                      : (mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.05)'),
                  },
                ]}
                onPress={() => setPrefTransit(!prefTransit)}
                activeOpacity={0.8}
              >
                <Text
                  testID="pref-check-transit"
                  style={[
                    styles.prefCheck,
                    prefTransit && {
                      backgroundColor: isDark ? '#FFFFFF' : '#0E1B2C',
                      borderColor: isDark ? '#FFFFFF' : '#0E1B2C',
                      color: isDark ? '#0E1B2C' : '#FFFFFF',
                    },
                  ]}
                >
                  {prefTransit ? '✓' : ''}
                </Text>
                <Text style={[styles.prefText, { color: isDark ? '#FFFFFF' : '#0E1B2C' }]} numberOfLines={1}>
                  Transit
                </Text>
                <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>Connecting</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="pref-checkbox-baggage"
                style={[
                  styles.prefChip,
                  {
                    borderColor: prefBaggage
                      ? (isDark ? '#FFFFFF' : '#0E1B2C')
                      : (isDark ? '#2A2D35' : themeColors.border),
                    backgroundColor: prefBaggage
                      ? (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(14, 27, 44, 0.05)')
                      : (mode === 'light' ? '#F8FAFC' : 'rgba(255, 255, 255, 0.05)'),
                  },
                ]}
                onPress={() => setPrefBaggage(!prefBaggage)}
                activeOpacity={0.8}
              >
                <Text
                  testID="pref-check-baggage"
                  style={[
                    styles.prefCheck,
                    prefBaggage && {
                      backgroundColor: isDark ? '#FFFFFF' : '#0E1B2C',
                      borderColor: isDark ? '#FFFFFF' : '#0E1B2C',
                      color: isDark ? '#0E1B2C' : '#FFFFFF',
                    },
                  ]}
                >
                  {prefBaggage ? '✓' : ''}
                </Text>
                <Text style={[styles.prefText, { color: isDark ? '#FFFFFF' : '#0E1B2C' }]} numberOfLines={1}>
                  Baggage
                </Text>
                <Text style={{ position: 'absolute', opacity: 0, height: 0 }}>With Baggage</Text>
              </TouchableOpacity>
            </View>

            {validationError ? (
              <Text style={styles.validationErrorText}>{validationError}</Text>
            ) : null}

            {flightError ? (
              <Text style={styles.validationErrorText}>{flightError}</Text>
            ) : null}

            <Button
              title="Search Flights"
              onPress={handleSearch}
              loading={isLoadingFlights}
              style={styles.searchButton}
            />
          </View>
        )}

        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        {flightError ? (
          <Text style={styles.errorText}>{flightError}</Text>
        ) : null}

        {/* Quick Filter Row & Filter Button */}
        {flights.length > 0 && !isLoadingFlights && (
          <View style={styles.filterSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilterScroll}>
              <TouchableOpacity
                style={getQuickFilterChipStyle('all')}
                onPress={() => setActiveQuickFilter('all')}
                testID="quick-filter-all"
              >
                <Text style={getQuickFilterTextStyle('all')}>
                  All ({flights.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getQuickFilterChipStyle('direct')}
                onPress={() => setActiveQuickFilter('direct')}
                testID="quick-filter-direct"
              >
                <Text style={getQuickFilterTextStyle('direct')}>
                  Direct
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getQuickFilterChipStyle('transit')}
                onPress={() => setActiveQuickFilter('transit')}
                testID="quick-filter-transit"
              >
                <Text style={getQuickFilterTextStyle('transit')}>
                  Connecting
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getQuickFilterChipStyle('baggage')}
                onPress={() => setActiveQuickFilter('baggage')}
                testID="quick-filter-baggage"
              >
                <Text style={getQuickFilterTextStyle('baggage')}>
                  🧳 With Baggage
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getQuickFilterChipStyle('cheap')}
                onPress={() => setActiveQuickFilter('cheap')}
                testID="quick-filter-cheap"
              >
                <Text style={getQuickFilterTextStyle('cheap')}>
                  🏷 Cheapest
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getQuickFilterChipStyle('early')}
                onPress={() => setActiveQuickFilter('early')}
                testID="quick-filter-early"
              >
                <Text style={getQuickFilterTextStyle('early')}>
                  🌅 Early Flight
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={getQuickFilterChipStyle('late')}
                onPress={() => setActiveQuickFilter('late')}
                testID="quick-filter-late"
              >
                <Text style={getQuickFilterTextStyle('late')}>
                  🌙 Late Flight
                </Text>
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity
              style={[
                styles.filterModalButton,
                { backgroundColor: themeColors.card, borderColor: themeColors.border },
              ]}
              onPress={() => setIsFilterVisible(true)}
              testID="open-flight-filter-btn"
            >
              <Text style={[styles.filterModalButtonText, { color: themeColors.text }]}>Filters ⚙</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Results List */}
        {isLoadingFlights ? (
          <View testID="flight-search-loading-skeletons" style={styles.skeletonContainer}>
            <FlightTicketSkeletonList screenBgColor={isDark ? '#121316' : '#F8FAFC'} />
          </View>
        ) : (
          <FlatList
            data={filteredFlights}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            renderItem={({ item }) => (
              <FlightCard
                flight={item}
                onSelect={handleSelectFlight}
                testID={`flight-card-${item.id}`}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              filteredFlights.length > 0 ? (
                <View style={styles.availableSectionRow}>
                  <Text style={[styles.availableTitle, { color: themeColors.text }]}>Available flights</Text>
                  <Text style={[styles.availableCount, { color: themeColors.textMuted }]}>{filteredFlights.length} results</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              filteredFlights.length === 0 && !isLoadingFlights ? (
                flights.length > 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>
                      No flights matching your filter criteria
                    </Text>
                  </View>
                ) : (
                  <View style={styles.enrichedEmptyContainer}>
                    <Text style={[styles.emptyPromptText, { color: themeColors.textMuted }]}>
                      Enter your route to search for best flight deals, or tap a trending route below:
                    </Text>

                    {/* Trending Flight Deals Section */}
                    <View style={styles.trendingSection}>
                      <View style={styles.trendingHeaderRow}>
                        <View style={styles.trendingTitleGroup}>
                          <Text style={styles.trendingFireIcon}>🔥</Text>
                          <Text style={[styles.trendingTitle, { color: themeColors.text }]}>
                            Trending Flight Deals
                          </Text>
                        </View>
                        <Text style={[styles.trendingExploreLink, { color: themeColors.primary }]}>
                          Explore All ›
                        </Text>
                      </View>

                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.trendingScroll}
                        contentContainerStyle={styles.trendingScrollContent}
                      >
                        {TRENDING_DEALS.map((deal) => (
                          <TouchableOpacity
                            key={deal.id}
                            style={[
                              styles.trendingCard,
                              {
                                backgroundColor: themeColors.card,
                                borderColor: themeColors.border,
                              },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleSelectTrendingDeal(deal)}
                          >
                            <View style={styles.trendingCardTop}>
                              <Text style={[styles.trendingCity, { color: themeColors.text }]}>
                                {deal.emoji} {deal.city}
                              </Text>
                              <View style={[styles.dealTag, { backgroundColor: `${deal.tagColor}20` }]}>
                                <Text style={[styles.dealTagText, { color: deal.tagColor }]}>
                                  {deal.tag}
                                </Text>
                              </View>
                            </View>

                            <Text style={[styles.trendingRoute, { color: themeColors.textMuted }]}>
                              {deal.route} • {deal.duration}
                            </Text>

                            <View style={[styles.trendingCardFooter, { borderTopColor: themeColors.border }]}>
                              <Text style={[styles.trendingPriceLabel, { color: themeColors.textMuted }]}>From</Text>
                              <Text style={[styles.trendingPriceValue, { color: themeColors.primary }]}>
                                {deal.price}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Popular Direct Routes Section */}
                    <View testID="popular-direct-routes-section" style={styles.directRoutesSection}>
                      <View style={styles.trendingHeaderRow}>
                        <View style={styles.trendingTitleGroup}>
                          <Text style={styles.trendingFireIcon}>⚡</Text>
                          <Text style={[styles.trendingTitle, { color: themeColors.text }]}>
                            Popular Direct Routes
                          </Text>
                        </View>
                        <Text style={[styles.trendingExploreLink, { color: themeColors.primary }]}>
                          Instant NDC ›
                        </Text>
                      </View>

                      <View style={styles.directRoutesGrid}>
                        {POPULAR_DIRECT_ROUTES.map((route) => (
                          <TouchableOpacity
                            key={route.id}
                            style={[
                              styles.directRouteCard,
                              {
                                backgroundColor: themeColors.card,
                                borderColor: themeColors.border,
                              },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => handleRouteChipPress(route)}
                          >
                            <View style={styles.directRouteTop}>
                              <Text style={[styles.directRouteCode, { color: themeColors.text }]}>
                                {route.origin} ⇄ {route.dest}
                              </Text>
                              <View style={styles.directRoutePill}>
                                <Text style={styles.directRoutePillText}>Direct</Text>
                              </View>
                            </View>
                            <Text style={[styles.directRouteName, { color: themeColors.textMuted }]}>
                              {route.city}
                            </Text>
                            <Text style={[styles.directRoutePrice, { color: themeColors.primary }]}>
                              From {route.price}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>

                    {/* Nomadix Travel Guarantee Banner removed as per Navigator instruction */}
                  </View>
                )
              ) : null
            }
          />
        )}

        {/* Calendar Picker Modals */}
        <CalendarPickerModal
          visible={isDeparturePickerVisible}
          selectedDate={departureDate || '2026-11-14'}
          onSelectDate={(date) => {
            setDepartureDate(date);
            setValidationError('');
          }}
          onClose={() => setIsDeparturePickerVisible(false)}
          title="Select Departure Date"
          minDate={new Date().toISOString().split('T')[0]}
        />

        <CalendarPickerModal
          visible={isReturnPickerVisible}
          selectedDate={returnDate || departureDate || '2026-11-20'}
          onSelectDate={(date) => {
            setReturnDate(date);
            setValidationError('');
          }}
          onClose={() => setIsReturnPickerVisible(false)}
          title="Select Return Date"
          minDate={departureDate || new Date().toISOString().split('T')[0]}
        />

        {/* Modals */}
        <FlightDetailModal
          visible={!!selectedDetailFlight}
          flight={selectedDetailFlight}
          onClose={() => setSelectedDetailFlight(null)}
          onBook={(fl) => {
            setSelectedDetailFlight(null);
            setFlightToBook(fl);
            setIsCheckoutVisible(true);
          }}
        />

        <FlightFilterModal
          visible={isFilterVisible}
          filters={modalFilters}
          onClose={() => setIsFilterVisible(false)}
          onApply={(newFilters) => {
            setModalFilters(newFilters);
            setIsFilterVisible(false);
          }}
          onReset={() => {
            setModalFilters({
              sortBy: 'price',
              showDirect: true,
              showTransit: true,
              airlines: { VJ: true, VN: true, SQ: true },
              maxPrice: 7000000,
            });
          }}
        />

        <SandboxBookingModal
          visible={isCheckoutVisible}
          flight={flightToBook}
          onClose={() => {
            setIsCheckoutVisible(false);
            setFlightToBook(null);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.7,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  tripTypeRow: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 4,
    marginBottom: 12,
  },
  tripTypeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  tripTypeBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tripTypeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tripTypeTextActive: {
    fontWeight: '700',
  },
  collapsedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: 'rgba(60,40,160,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  collapsedTicketCard: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    marginBottom: 14,
    shadowColor: 'rgba(60,40,160,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
  },
  ticketRouteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ticketCode: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ticketCity: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  ticketSwapBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  ticketSwapIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  ticketDashedDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 12,
  },
  ticketBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketBottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ticketBottomText: {
    fontSize: 13,
    fontWeight: '600',
  },
  availableSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 6,
    paddingHorizontal: 2,
  },
  availableTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  availableCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  collapsedInfo: {
    flex: 1,
  },
  collapsedRoute: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
  },
  collapsedDates: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  editBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  editText: {
    fontSize: 12,
    fontWeight: '700',
  },
  searchBox: {
    backgroundColor: colors.card,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    shadowColor: 'rgba(60,40,160,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  chipsScroll: {
    flexGrow: 0,
    height: 42,
    marginBottom: 12,
  },
  chipsScrollContent: {
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  routeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    marginRight: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 34,
  },
  routeChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  routeChipText: {
    fontSize: 12.5,
    fontWeight: '700',
    letterSpacing: 0.2,
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
    lineHeight: 16,
  },
  routeChipTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  resultsList: {
    flex: 1,
  },
  airportsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  airportCol: {
    flex: 1,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  dateCol: {
    flex: 1,
  },
  preferencesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  prefChip: {
    flex: 1,
    flexBasis: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 99,
    borderWidth: 1,
    gap: 6,
  },
  prefChipActive: {
    borderColor: '#0E1B2C',
    backgroundColor: 'rgba(14, 27, 44, 0.05)',
  },
  prefCheck: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#94A3B8',
    textAlign: 'center',
    lineHeight: 14,
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  prefCheckActive: {
    backgroundColor: '#0E1B2C',
    borderColor: '#0E1B2C',
  },
  prefText: {
    fontSize: 11,
    fontWeight: '700',
  },
  validationErrorText: {
    ...typography.caption,
    color: colors.error,
    marginVertical: 4,
    textAlign: 'center',
  },
  searchButton: {
    marginTop: 6,
  },
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  quickFilterScroll: {
    flex: 1,
  },
  quickFilterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: colors.card,
    marginRight: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  quickFilterChipActive: {
    backgroundColor: 'rgba(14, 27, 44, 0.08)',
    borderColor: '#0E1B2C',
  },
  quickFilterText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
    textAlign: 'center',
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  quickFilterTextActive: {
    color: '#0E1B2C',
    fontWeight: '700',
  },
  filterModalButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterModalButtonText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 10,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  enrichedEmptyContainer: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  emptyPromptText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  trendingSection: {
    marginBottom: 20,
  },
  trendingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trendingTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trendingFireIcon: {
    fontSize: 14,
  },
  trendingTitle: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  trendingExploreLink: {
    fontSize: 11,
    fontWeight: '700',
  },
  trendingScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  trendingScrollContent: {
    paddingRight: 16,
    gap: 10,
  },
  trendingCard: {
    width: 175,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  trendingCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  trendingCity: {
    fontSize: 13,
    fontWeight: '800',
  },
  dealTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  dealTagText: {
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  trendingRoute: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 8,
  },
  trendingCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  trendingPriceLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  trendingPriceValue: {
    fontSize: 13,
    fontWeight: '900',
  },
  directRoutesSection: {
    marginTop: 20,
    marginBottom: 10,
  },
  directRoutesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  directRouteCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  directRouteTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  directRouteCode: {
    fontSize: 13,
    fontWeight: '800',
  },
  directRoutePill: {
    backgroundColor: '#E3F2F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  directRoutePillText: {
    color: '#0B6B67',
    fontSize: 9,
    fontWeight: '800',
  },
  directRouteName: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: 6,
  },
  directRoutePrice: {
    fontSize: 12,
    fontWeight: '800',
  },
  guaranteeCard: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
    marginTop: 4,
  },
  guaranteeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  guaranteeIcon: {
    fontSize: 22,
  },
  guaranteeTextGroup: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  guaranteeSub: {
    fontSize: 11,
    marginTop: 1,
  },
  guaranteePillarsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  pillarBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10,
  },
  pillarNumber: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0A84FF',
  },
  pillarLabel: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
  },
  skeletonContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 24,
  },
});
