import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Modal,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import { useItineraryStore } from '../../stores/itinerary.store';
import { useCurrencyStore } from '../../stores/currency.store';
import LucideIcon from '../../components/common/LucideIcon';
import {
  SwapIcon,
  BellIcon,
} from '../../components/common/NomadixIcons';
import { REDESIGN_THEME } from '../../theme/designTokens';

const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
];

const GPS_WEATHER_DATA = {
  city: 'Da Nang',
  locationLabel: 'GPS Location',
  temp: '28°C',
  condition: 'Sunny',
  icon: '☀️',
  highLow: 'High 29° • Low 23°',
  humidity: '65%',
  forecast: [
    { day: 'Today', date: 'Fri', temp: '28°', highLow: '29° / 23°', icon: '☀️', condition: 'Sunny' },
    { day: 'Tomorrow', date: 'Sat', temp: '29°', highLow: '30° / 24°', icon: '⛅', condition: 'Partly Cloudy' },
    { day: 'Sun', date: 'Sun', temp: '26°', highLow: '27° / 22°', icon: '🌧️', condition: 'Showers' },
    { day: 'Mon', date: 'Mon', temp: '28°', highLow: '29° / 23°', icon: '🌤️', condition: 'Pleasant' },
  ],
};

export default function HomeScreen({ onNavigateTab, onOpenProfile }) {
  const { colors: themeColors, mode } = useThemeStore();
  const { user } = useAuthStore();
  const trips = useItineraryStore((state) => state.trips) || [];
  const { getRate, convert, fetchRates, isLive } = useCurrencyStore();

  const [activeSegment, setActiveSegment] = useState('planned'); // 'planned' | 'archived' | 'completed'
  const [fromAmount, setFromAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [selectingCurrencyTarget, setSelectingCurrencyTarget] = useState('from'); // 'from' | 'to'
  const [convertFormModalVisible, setConvertFormModalVisible] = useState(false);
  const [modalAmount, setModalAmount] = useState('100');
  const [inlinePickerTarget, setInlinePickerTarget] = useState(null); // null | 'from' | 'to'
  const [weatherData, setWeatherData] = useState(GPS_WEATHER_DATA);

  useEffect(() => {
    fetchRates('USD');
    const loadWeather = async () => {
      try {
        const res = await fetch('/api/v1/weather/forecast?city=Da%20Nang');
        if (res && res.ok) {
          const json = await res.json();
          if (json && json.success && json.data) {
            setWeatherData((prev) => ({
              ...prev,
              ...json.data,
              city: json.data.city || prev.city,
              temp: json.data.temp || prev.temp,
              condition: json.data.condition || prev.condition,
              icon: json.data.icon || prev.icon,
              forecast: json.data.forecast || prev.forecast,
            }));
          }
        }
      } catch (e) {
        // Resilient fallback to offline GPS_WEATHER_DATA
      }
    };
    loadWeather();
  }, []);

  // Real-time Exchange rate logic powered by CurrencyRateAPI
  const rate = getRate(fromCurrency, toCurrency);
  const exchangeRate = typeof rate === 'number' && !isNaN(rate)
    ? (rate >= 100 ? Math.round(rate).toLocaleString() : rate.toFixed(4))
    : '1.0';

  const convertedAmount = (() => {
    const raw = convert(fromAmount, fromCurrency, toCurrency);
    const num = parseFloat(raw);
    if (isNaN(num)) return '0.00';
    if (toCurrency === 'VND' || toCurrency === 'JPY' || toCurrency === 'KRW') {
      return Math.round(num).toLocaleString();
    }
    return raw;
  })();

  const modalConvertedAmount = (() => {
    const raw = convert(modalAmount, fromCurrency, toCurrency);
    const num = parseFloat(raw);
    if (isNaN(num)) return '0.00';
    if (toCurrency === 'VND' || toCurrency === 'JPY' || toCurrency === 'KRW') {
      return Math.round(num).toLocaleString();
    }
    return raw;
  })();

  const handleSwapCurrency = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const isDark = mode === 'dark';
  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E3E6E0');

  const activeTrip = trips.length > 0 ? trips[0] : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: bg }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Bar: Brand Logo & Outline Bell Notification */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <View style={[styles.brandLogoIcon, { backgroundColor: isDark ? '#FFFFFF' : '#0E1B2C' }]}>
            <Text style={[styles.brandLogoGlyph, { color: isDark ? '#0E1B2C' : '#FFFFFF' }]}>N</Text>
          </View>
          <View>
            <Text style={[styles.brandTitle, { color: textColor }]}>NOMADIX</Text>
            <Text style={[styles.brandSubtitle, { color: textMuted }]}>Smart Squad Travel</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity
            testID="home-bell-btn"
            style={[styles.iconButton, { backgroundColor: cardBg, borderColor }]}
            activeOpacity={0.7}
          >
            <BellIcon size={20} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Hero Trip Card (Live Plan when trips > 0, Curated Suggestion when trips === 0) */}
      {activeTrip ? (
        <View testID="hero-trip-card" style={styles.heroCardContainer}>
          <ImageBackground
            source={{ uri: activeTrip.coverImage || 'https://images.unsplash.com/photo-1560969184-10fe8719e047?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.heroCardBg}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopActions}>
                <View style={styles.recentBadge}>
                  <Text style={styles.recentBadgeText}>RECENT</Text>
                </View>

                <View style={styles.heroActionPills}>
                  <TouchableOpacity
                    style={styles.glassPillBtn}
                    activeOpacity={0.7}
                    onPress={() => onNavigateTab && onNavigateTab('plan')}
                  >
                    <Text style={styles.glassPillIcon}>Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.heroBottomContent}>
                <Text style={styles.heroTripTitle}>{activeTrip.title || 'Danang Expedition 2026'}</Text>
                <View style={styles.heroMetadataRow}>
                  <View style={styles.heroMetaPill}>
                    <LucideIcon name="calendar" size={13} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.heroMetaText}>{activeTrip.days?.length || 1} days</Text>
                  </View>
                  <View style={styles.heroMetaPill}>
                    <Text style={styles.heroMetaText}>
                      {activeTrip.days?.reduce((sum, d) => sum + (d.items?.length || 0), 0) || 8} destinations
                    </Text>
                  </View>
                  <View style={styles.heroMetaPill}>
                    <LucideIcon name="users" size={13} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.heroMetaText}>{activeTrip.collaborators?.length || 3} travelers</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View testID="hero-suggestion-card" style={styles.heroCardContainer}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.heroCardBg}
            imageStyle={{ borderRadius: 24 }}
          >
            <View style={styles.heroOverlay}>
              <View style={styles.heroTopActions}>
                <View style={[styles.recentBadge, { backgroundColor: '#2E7D5B' }]}>
                  <Text style={[styles.recentBadgeText, { color: '#FFFFFF' }]}>FEATURED EXPEDITION</Text>
                </View>

                <View style={styles.heroActionPills}>
                  <TouchableOpacity
                    style={[styles.glassPillBtn, { backgroundColor: '#FFFFFF', paddingHorizontal: 12 }]}
                    activeOpacity={0.8}
                    onPress={() => onNavigateTab && onNavigateTab('plan')}
                  >
                    <Text style={[styles.glassPillIcon, { color: '#0E1B2C', fontWeight: '800' }]}>+ Plan This Trip</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.heroBottomContent}>
                <Text style={styles.heroTripTitle}>Da Nang & Hoi An 2026</Text>
                <View style={styles.heroMetadataRow}>
                  <View style={styles.heroMetaPill}>
                    <LucideIcon name="calendar" size={13} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.heroMetaText}>3 days</Text>
                  </View>
                  <View style={styles.heroMetaPill}>
                    <Text style={styles.heroMetaText}>8 destinations</Text>
                  </View>
                  <View style={styles.heroMetaPill}>
                    <LucideIcon name="users" size={13} color="#FFFFFF" strokeWidth={2.2} />
                    <Text style={styles.heroMetaText}>3 travelers</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      )}

      {/* 3. Segmented Filter Pills: Planned, Archived, Completed (High-Contrast Flight-Style Capsule) */}
      <View
        testID="home-segmented-container"
        style={[styles.segmentedContainer, { backgroundColor: isDark ? '#1C1D21' : '#E2E8F0' }]}
      >
        <TouchableOpacity
          testID="segmented-pill-planned"
          style={[
            styles.segmentPill,
            activeSegment === 'planned' && [
              styles.segmentPillActive,
              { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
            ],
          ]}
          onPress={() => setActiveSegment('planned')}
        >
          <Text
            style={[
              styles.segmentPillText,
              {
                color: activeSegment === 'planned'
                  ? (isDark ? '#111827' : '#FFFFFF')
                  : (isDark ? '#94A3B8' : '#64748B'),
              },
              activeSegment === 'planned' && styles.segmentPillTextActive,
            ]}
          >
            Planned
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="segmented-pill-archived"
          style={[
            styles.segmentPill,
            activeSegment === 'archived' && [
              styles.segmentPillActive,
              { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
            ],
          ]}
          onPress={() => setActiveSegment('archived')}
        >
          <Text
            style={[
              styles.segmentPillText,
              {
                color: activeSegment === 'archived'
                  ? (isDark ? '#111827' : '#FFFFFF')
                  : (isDark ? '#94A3B8' : '#64748B'),
              },
              activeSegment === 'archived' && styles.segmentPillTextActive,
            ]}
          >
            Archived
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          testID="segmented-pill-completed"
          style={[
            styles.segmentPill,
            activeSegment === 'completed' && [
              styles.segmentPillActive,
              { backgroundColor: isDark ? '#FFFFFF' : '#111827' },
            ],
          ]}
          onPress={() => setActiveSegment('completed')}
        >
          <Text
            style={[
              styles.segmentPillText,
              {
                color: activeSegment === 'completed'
                  ? (isDark ? '#111827' : '#FFFFFF')
                  : (isDark ? '#94A3B8' : '#64748B'),
              },
              activeSegment === 'completed' && styles.segmentPillTextActive,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Currency Converter Widget with Flight-Card Dark Header Strip (#0E1B2C) */}
      <View
        testID="currency-converter-widget"
        style={[
          styles.executiveCardWrapper,
          {
            backgroundColor: cardBg,
            borderColor,
          },
        ]}
      >
        {/* Dark Header Strip */}
        <View
          testID="currency-header-strip"
          style={[
            styles.executiveHeaderStrip,
            { backgroundColor: isDark ? '#0B131F' : '#0E1B2C' },
          ]}
        >
          <View style={styles.headerStripLeft}>
            <SwapIcon size={15} color="#FFFFFF" />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.headerStripTitle}>CURRENCY EXCHANGE</Text>
              <Text style={styles.headerStripSubtitle}>Real-Time FX Rates</Text>
            </View>
          </View>
        </View>

        {/* Card Body */}
        <View style={styles.executiveCardBody}>
          <View style={styles.converterInputsRow}>
            {/* FROM Box */}
            <View
              style={[
                styles.currencyBox,
                { backgroundColor: isDark ? '#121316' : '#F8FAFC', borderColor },
              ]}
            >
              <TouchableOpacity
                testID="currency-from-box"
                style={{ flex: 1 }}
                onPress={() => {
                  setModalAmount(fromAmount);
                  setInlinePickerTarget(null);
                  setConvertFormModalVisible(true);
                }}
                activeOpacity={0.85}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.currencyBoxLabel}>FROM</Text>
                  <Text style={{ fontSize: 9, color: textMuted, fontWeight: '700' }}>✎ TAP</Text>
                </View>
                <TextInput
                  testID="currency-from-input"
                  value={fromAmount}
                  onChangeText={setFromAmount}
                  keyboardType="numeric"
                  style={[styles.currencyAmountInput, { color: textColor }]}
                />
              </TouchableOpacity>
              <TouchableOpacity
                testID="currency-from-select"
                style={styles.currencyBadge}
                onPress={() => {
                  setSelectingCurrencyTarget('from');
                  setCurrencyModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.currencyBadgeText, { color: textColor }]}>{fromCurrency}</Text>
                <Text style={{ fontSize: 10, color: textMuted, marginLeft: 2 }}>▾</Text>
              </TouchableOpacity>
            </View>

            {/* Swap Button with Outline SwapIcon */}
            <TouchableOpacity
              testID="currency-swap-btn"
              style={[styles.swapButton, { backgroundColor: isDark ? '#334155' : '#0E1B2C' }]}
              onPress={handleSwapCurrency}
              activeOpacity={0.8}
            >
              <SwapIcon size={18} color="#FFFFFF" />
            </TouchableOpacity>

            {/* TO Box */}
            <View
              style={[
                styles.currencyBox,
                { backgroundColor: isDark ? '#121316' : '#F8FAFC', borderColor },
              ]}
            >
              <Text style={styles.currencyBoxLabel}>TO</Text>
              <Text style={[styles.currencyAmountInput, { color: textColor }]}>
                {convertedAmount}
              </Text>
              <TouchableOpacity
                testID="currency-to-select"
                style={styles.currencyBadge}
                onPress={() => {
                  setSelectingCurrencyTarget('to');
                  setCurrencyModalVisible(true);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.currencyBadgeText, { color: textColor }]}>{toCurrency}</Text>
                <Text style={{ fontSize: 10, color: textMuted, marginLeft: 2 }}>▾</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={[styles.exchangeRateFormula, { color: textMuted }]}>
            1 {fromCurrency} = {exchangeRate} {toCurrency}
          </Text>
        </View>
      </View>

      {/* 5. Travel Radar & Weather Widget with Flight-Card Dark Header Strip (#0E1B2C) */}
      <View
        testID="home-travel-radar-widget"
        style={[
          styles.executiveCardWrapper,
          {
            backgroundColor: cardBg,
            borderColor,
            marginTop: 16,
          },
        ]}
      >
        <View testID="gps-weather-card">
          {/* Dark Header Strip */}
          <View
            testID="weather-header-strip"
            style={[
              styles.executiveHeaderStrip,
              { backgroundColor: isDark ? '#0B131F' : '#0E1B2C' },
            ]}
          >
            <View style={styles.headerStripLeft}>
              <Text style={{ fontSize: 16 }}>📍</Text>
              <View style={{ marginLeft: 6 }}>
                <Text style={styles.headerStripTitle}>TRAVEL RADAR & WEATHER</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 1 }}>
                  <Text style={[styles.headerStripSubtitle, { fontWeight: '700', color: '#FFFFFF' }]}>
                    {weatherData.city}
                  </Text>
                  <Text style={styles.headerStripSubtitle}>
                    • GPS Location • Humidity {weatherData.humidity || '65%'}
                  </Text>
                </View>
              </View>
            </View>
            <View testID="weather-temp-badge" style={styles.headerStripBadge}>
              <Text style={styles.headerStripBadgeText}>
                {weatherData.icon} {weatherData.temp} • {weatherData.condition}
              </Text>
            </View>
          </View>

          {/* 3-4 Day Forecast Row */}
          <View style={styles.executiveCardBody}>
            <View style={styles.forecastRow}>
              {(weatherData.forecast || []).map((fc, idx) => (
                <View
                  key={fc.day || idx}
                  testID={`weather-forecast-day-${idx}`}
                  style={[
                    styles.forecastCard,
                    {
                      backgroundColor: isDark ? '#121316' : '#F8FAFC',
                      borderColor,
                    },
                    idx === 0 && { borderColor: isDark ? '#475569' : '#0E1B2C', borderWidth: 1.5 },
                  ]}
                >
                  <Text
                    style={[
                      styles.forecastDayText,
                      { color: idx === 0 ? (isDark ? '#FFFFFF' : '#0E1B2C') : textMuted },
                    ]}
                  >
                    {fc.day}
                  </Text>
                  <Text style={styles.forecastIcon}>{fc.icon}</Text>
                  <Text style={[styles.forecastTemp, { color: textColor }]}>{fc.temp}</Text>
                  <Text style={[styles.forecastCondition, { color: textMuted }]} numberOfLines={1}>
                    {fc.condition}
                  </Text>
                  <Text style={[styles.forecastHighLow, { color: textMuted }]}>
                    {fc.highLow || fc.temp}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* 6. Collections Card with Flight-Card Dark Header Strip (#0E1B2C) */}
      <View
        testID="collections-card"
        style={[
          styles.executiveCardWrapper,
          {
            backgroundColor: cardBg,
            borderColor,
            marginTop: 16,
          },
        ]}
      >
        <View
          testID="collections-header-strip"
          style={[
            styles.executiveHeaderStrip,
            { backgroundColor: isDark ? '#0B131F' : '#0E1B2C' },
          ]}
        >
          <View style={styles.headerStripLeft}>
            <LucideIcon name="bookmark" size={14} color="#FFFFFF" strokeWidth={2.4} />
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.headerStripTitle}>COLLECTIONS</Text>
              <Text style={styles.headerStripSubtitle}>Expedition Archive</Text>
            </View>
          </View>
          <View style={styles.headerStripBadge}>
            <Text style={styles.headerStripBadgeText}>1 Explored</Text>
          </View>
        </View>

        <View style={styles.executiveCardBody}>
          <TouchableOpacity
            testID="collection-item-card"
            style={[
              styles.collectionItemCard,
              { backgroundColor: isDark ? '#161920' : '#0E1B2C' },
            ]}
            activeOpacity={0.85}
            onPress={() => onNavigateTab && onNavigateTab('plan')}
          >
            <View style={styles.collectionTextGroup}>
              <Text style={styles.collectionTitle}>Tokyo 2025</Text>
              <Text style={styles.collectionSubtitle}>Explored Itinerary</Text>
            </View>
            <View testID="home-explored-badge" style={styles.cleanCountBadge}>
              <Text style={styles.cleanCountBadgeText}>8</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Currency Selection Modal */}
      <Modal
        testID="currency-picker-modal"
        visible={currencyModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setCurrencyModalVisible(false)}
        >
          <View
            style={[
              styles.currencyModalCard,
              { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor },
            ]}
          >
            <View style={[styles.currencyModalHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.currencyModalTitle, { color: textColor }]}>
                Select {selectingCurrencyTarget === 'from' ? 'Source (FROM)' : 'Target (TO)'} Currency
              </Text>
              <TouchableOpacity
                onPress={() => setCurrencyModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ fontSize: 16, color: textMuted, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
              {SUPPORTED_CURRENCIES.map((c) => {
                const isSelected = selectingCurrencyTarget === 'from'
                  ? fromCurrency === c.code
                  : toCurrency === c.code;

                return (
                  <TouchableOpacity
                    key={c.code}
                    testID={`currency-option-${c.code}`}
                    style={[
                      styles.currencyModalOption,
                      isSelected && { backgroundColor: isDark ? '#2A2D35' : '#F1F5F9' },
                    ]}
                    onPress={() => {
                      if (selectingCurrencyTarget === 'from') {
                        setFromCurrency(c.code);
                      } else {
                        setToCurrency(c.code);
                      }
                      setCurrencyModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.currencyOptionCode, { color: textColor }]}>{c.code}</Text>
                      <Text style={[styles.currencyOptionName, { color: textMuted }]}>
                        {c.name} ({c.symbol})
                      </Text>
                    </View>
                    {isSelected && (
                      <Text style={{ color: '#0B7A75', fontWeight: '800' }}>✓</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Dedicated Currency Exchange Form Modal */}
      <Modal
        testID="currency-converter-form-modal"
        visible={convertFormModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConvertFormModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setConvertFormModalVisible(false)}
        >
          <View
            style={[
              styles.converterFormCard,
              { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor },
            ]}
          >
            {/* Modal Header */}
            <View style={[styles.currencyModalHeader, { borderBottomColor: borderColor }]}>
              <View>
                <Text style={[styles.currencyModalTitle, { color: textColor }]}>
                  Currency Exchange Form
                </Text>
                <Text style={{ fontSize: 12, color: textMuted, marginTop: 2 }}>
                  Enter amount & convert in real-time
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setConvertFormModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={{ fontSize: 18, color: textMuted, fontWeight: '700' }}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Currency Selector Row with Swap in Form */}
            <View style={styles.modalCurrencyPickerRow}>
              <TouchableOpacity
                testID="modal-currency-from-btn"
                style={[
                  styles.modalCurrencyBtn,
                  { borderColor, backgroundColor: inlinePickerTarget === 'from' ? (isDark ? '#2A2D35' : '#E2E8F0') : (isDark ? '#121316' : '#F8FAFC') },
                ]}
                onPress={() => {
                  setInlinePickerTarget(inlinePickerTarget === 'from' ? null : 'from');
                }}
              >
                <Text style={styles.modalCurrencyBtnLabel}>FROM</Text>
                <Text style={[styles.modalCurrencyBtnCode, { color: textColor }]}>{fromCurrency} ▾</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="modal-currency-swap-btn"
                style={styles.modalSwapBtn}
                onPress={handleSwapCurrency}
                activeOpacity={0.8}
              >
                <SwapIcon size={18} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                testID="modal-currency-to-btn"
                style={[
                  styles.modalCurrencyBtn,
                  { borderColor, backgroundColor: inlinePickerTarget === 'to' ? (isDark ? '#2A2D35' : '#E2E8F0') : (isDark ? '#121316' : '#F8FAFC') },
                ]}
                onPress={() => {
                  setInlinePickerTarget(inlinePickerTarget === 'to' ? null : 'to');
                }}
              >
                <Text style={styles.modalCurrencyBtnLabel}>TO</Text>
                <Text style={[styles.modalCurrencyBtnCode, { color: textColor }]}>{toCurrency} ▾</Text>
              </TouchableOpacity>
            </View>

            {/* Inline Currency Selector (avoids modal stacking collision) */}
            {inlinePickerTarget && (
              <View testID="inline-currency-selector" style={[styles.inlineCurrencySelector, { borderColor, backgroundColor: isDark ? '#121316' : '#F8FAFC' }]}>
                <Text style={[styles.inlineSelectorTitle, { color: textMuted }]}>
                  Select {inlinePickerTarget === 'from' ? 'Source (FROM)' : 'Target (TO)'} Currency:
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.inlineChipsScroll}>
                  {SUPPORTED_CURRENCIES.map((c) => {
                    const isSelected = inlinePickerTarget === 'from' ? fromCurrency === c.code : toCurrency === c.code;
                    return (
                      <TouchableOpacity
                        key={c.code}
                        testID={`inline-currency-option-${c.code}`}
                        style={[
                          styles.inlineCurrencyChip,
                          { borderColor },
                          isSelected
                            ? { backgroundColor: '#0B7A75', borderColor: '#0B7A75' }
                            : { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF' },
                        ]}
                        onPress={() => {
                          if (inlinePickerTarget === 'from') {
                            setFromCurrency(c.code);
                          } else {
                            setToCurrency(c.code);
                          }
                          setInlinePickerTarget(null);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.inlineChipCode, { color: isSelected ? '#FFFFFF' : textColor }]}>
                          {c.code}
                        </Text>
                        <Text style={[styles.inlineChipSymbol, { color: isSelected ? 'rgba(255,255,255,0.85)' : textMuted }]}>
                          {c.symbol}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Big Amount Input Field */}
            <Text style={[styles.modalFieldLabel, { color: textMuted }]}>
              ENTER AMOUNT ({fromCurrency})
            </Text>
            <View style={[styles.modalBigInputWrap, { backgroundColor: isDark ? '#121316' : '#F8FAFC', borderColor }]}>
              <Text style={[styles.modalInputSymbol, { color: textColor }]}>
                {SUPPORTED_CURRENCIES.find((c) => c.code === fromCurrency)?.symbol || '$'}
              </Text>
              <TextInput
                testID="modal-currency-amount-input"
                value={modalAmount}
                onChangeText={setModalAmount}
                keyboardType="numeric"
                style={[styles.modalBigAmountInput, { color: textColor }]}
                placeholder="0"
                placeholderTextColor={textMuted}
              />
            </View>

            {/* Quick Preset Amount Chips */}
            <View style={styles.presetChipsRow}>
              {[50, 100, 500, 1000, 5000].map((amt) => {
                const isSelected = modalAmount === String(amt);
                return (
                  <TouchableOpacity
                    key={amt}
                    testID={`preset-amount-${amt}`}
                    style={[
                      styles.presetChip,
                      { borderColor },
                      isSelected
                        ? { backgroundColor: '#0E1B2C', borderColor: '#0E1B2C' }
                        : { backgroundColor: isDark ? '#121316' : '#F1F5F9' },
                    ]}
                    onPress={() => setModalAmount(String(amt))}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        isSelected ? { color: '#FFFFFF' } : { color: textColor },
                      ]}
                    >
                      {amt >= 1000 ? `${amt / 1000}k` : amt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Conversion Result Live Preview Box */}
            <View
              testID="modal-conversion-preview"
              style={[
                styles.modalPreviewBox,
                { backgroundColor: isDark ? '#142E25' : '#E8F5E9', borderColor: isDark ? '#1E4A3B' : '#C8E6C9' },
              ]}
            >
              <Text style={[styles.modalPreviewLabel, { color: isDark ? '#A7F3D0' : '#166534' }]}>
                YOU WILL RECEIVE APPROXIMATELY
              </Text>
              <Text style={[styles.modalPreviewAmount, { color: isDark ? '#34D399' : '#15803D' }]}>
                {modalConvertedAmount} {toCurrency}
              </Text>
              <Text style={[styles.modalPreviewFormula, { color: isDark ? '#A7F3D0' : '#2E7D5B' }]}>
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </Text>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              testID="modal-apply-amount-btn"
              style={[styles.modalApplyBtn, { backgroundColor: '#0E1B2C' }]}
              onPress={() => {
                setFromAmount(modalAmount);
                setConvertFormModalVisible(false);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.modalApplyBtnText}>Apply & Convert</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogoIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandLogoGlyph: {
    fontSize: 20,
    fontWeight: '800',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCardContainer: {
    height: 190,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroCardBg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(14, 27, 44, 0.45)',
    borderRadius: 24,
  },
  heroTopActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  recentBadgeText: {
    color: '#0E1B2C',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroActionPills: {
    flexDirection: 'row',
    gap: 6,
  },
  glassPillBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  glassPillIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroBottomContent: {},
  heroTripTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  heroMetadataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  heroMetaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  heroMetaText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: 99,
    padding: 4,
    marginBottom: 16,
  },
  segmentPill: {
    flex: 1,
    height: 38,
    borderRadius: 99,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentPillActive: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  segmentPillTextActive: {
    fontWeight: '800',
  },
  cardContainer: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
  },
  executiveCardWrapper: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 2,
  },
  executiveHeaderStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerStripTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.6,
  },
  headerStripSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    marginTop: 1,
  },
  headerStripBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 99,
  },
  headerStripBadgeText: {
    color: '#F1F5F9',
    fontSize: 11,
    fontWeight: '700',
  },
  gpsRadarPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  gpsRadarPillText: {
    color: '#CBD5E1',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  executiveCardBody: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveCurrencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
    marginLeft: 8,
  },
  liveCurrencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 5,
  },
  liveCurrencyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  cardSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  converterInputsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  currencyBox: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    borderWidth: 1,
  },
  currencyBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  currencyAmountInput: {
    fontSize: 18,
    fontWeight: '800',
    marginVertical: 4,
    height: 28,
    padding: 0,
  },
  currencyBadge: {
    alignSelf: 'flex-start',
  },
  currencyBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exchangeRateFormula: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: '500',
  },
  gpsWeatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  gpsCityTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  gpsCitySub: {
    fontSize: 12,
    fontWeight: '600',
  },
  gpsWeatherHighLow: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 3,
  },
  gpsCurrentTemp: {
    fontSize: 20,
    fontWeight: '900',
  },
  gpsCurrentCondition: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  forecastRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  forecastCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  forecastDayText: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 2,
  },
  forecastIcon: {
    fontSize: 20,
    marginVertical: 4,
  },
  forecastTemp: {
    fontSize: 14,
    fontWeight: '800',
  },
  forecastCondition: {
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  forecastHighLow: {
    fontSize: 9,
    fontWeight: '500',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  currencyModalCard: {
    width: '100%',
    maxHeight: 460,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  currencyModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  currencyModalTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  currencyModalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 2,
  },
  currencyOptionCode: {
    fontSize: 15,
    fontWeight: '800',
    width: 48,
  },
  currencyOptionName: {
    fontSize: 13,
    fontWeight: '500',
  },
  converterFormCard: {
    width: '92%',
    maxHeight: 560,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  modalCurrencyPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
    gap: 8,
  },
  modalCurrencyBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalCurrencyBtnLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    marginBottom: 2,
  },
  modalCurrencyBtnCode: {
    fontSize: 14,
    fontWeight: '800',
  },
  modalSwapBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#0E1B2C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalFieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  modalBigInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 54,
  },
  modalInputSymbol: {
    fontSize: 22,
    fontWeight: '800',
    marginRight: 8,
  },
  modalBigAmountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    height: 50,
  },
  presetChipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    gap: 6,
  },
  presetChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalPreviewBox: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginVertical: 10,
    alignItems: 'center',
  },
  modalPreviewLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  modalPreviewAmount: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  modalPreviewFormula: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalApplyBtn: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  modalApplyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  collectionItemCard: {
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collectionTextGroup: {},
  collectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  collectionSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    marginTop: 2,
  },
  cleanCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  cleanCountBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  inlineCurrencySelector: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginTop: 8,
    marginBottom: 4,
  },
  inlineSelectorTitle: {
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  inlineChipsScroll: {
    gap: 8,
    paddingRight: 8,
  },
  inlineCurrencyChip: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  inlineChipCode: {
    fontSize: 13,
    fontWeight: '800',
  },
  inlineChipSymbol: {
    fontSize: 12,
    fontWeight: '600',
  },
});
