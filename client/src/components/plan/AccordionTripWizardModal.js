import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../../stores/theme.store';
import { usePlacesStore } from '../../stores/places.store';
import { MOCK_COUNTRIES, MOCK_CITIES, MOCK_SPOTS_BY_CITY, getCitySpotsCatalog, getSpotGalleryImages } from '../../data/mockPlanData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INTEREST_TAGS = [
  { id: 'beaches', label: '🏖️ Beaches & Nature', testId: 'pref-chip-beaches' },
  { id: 'food', label: '🍜 Local Food & Dining', testId: 'pref-chip-food' },
  { id: 'culture', label: '🏛️ Culture & Landmarks', testId: 'pref-chip-culture' },
  { id: 'adventure', label: '🏄 Adventure & Sports', testId: 'pref-chip-adventure' },
  { id: 'nightlife', label: '🛍️ Shopping & Nightlife', testId: 'pref-chip-nightlife' },
  { id: 'cafes', label: '☕ Cafes & Chill', testId: 'pref-chip-cafes' },
];

export default function AccordionTripWizardModal({
  visible = false,
  inline = false,
  onClose,
  onComplete,
}) {
  const { mode, colors: themeColors } = useThemeStore();
  const isDark = mode === 'dark';
  const styles = useMemo(() => getStyles(themeColors, isDark), [themeColors, isDark]);

  // Current Active Step:
  // 1 = Where, 2 = When, 3 = Preferences, 4 = Spots, 5 = Stay, 6 = Invite
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [selectedCountryCode, setSelectedCountryCode] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(MOCK_CITIES[0]); // Default Đà Nẵng
  const [dateMode, setDateMode] = useState('flexible'); // 'flexible' | 'specific'
  const [daysCount, setDaysCount] = useState(3);
  const [selectedInterests, setSelectedInterests] = useState(new Set(['beaches', 'culture']));
  const [spotsViewMode, setSpotsViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedSpots, setSelectedSpots] = useState(new Set(['spot-my-khe', 'spot-dragon-bridge']));
  const [stayType, setStayType] = useState('hotel'); // 'hotel' | 'airbnb' | 'friends' | 'skip'
  const [detailSpot, setDetailSpot] = useState(null); // Spot Detail Modal (OpenTripMap Data)
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  const handleOpenSpotDetail = (spot) => {
    setActivePhotoIdx(0);
    setDetailSpot(spot);
  };
  const [inviteRole, setInviteRole] = useState('EDITOR'); // 'EDITOR' | 'VIEWER'
  const [inviteCopied, setInviteCopied] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const [assignedHotel, setAssignedHotel] = useState(null);
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [travelMode, setTravelMode] = useState('solo'); // 'solo' | 'group'
  const [travelersCount, setTravelersCount] = useState(1);
  const [budgetPerPerson, setBudgetPerPerson] = useState('2000000');

  const toggleCategoryExpand = (catId) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  // Filtered Cities for Search & Country Selection
  const filteredTrending = useMemo(() => {
    let list = MOCK_CITIES;
    if (selectedCountryCode && selectedCountryCode !== 'ALL') {
      list = list.filter((c) => c.code === selectedCountryCode);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q)
      );
    }
    return list;
  }, [searchQuery, selectedCountryCode]);

  const placesStore = usePlacesStore();
  const fetchPlaces = placesStore?.fetchPlaces;
  const apiPlaces = placesStore?.places || [];

  // Automatically fetch real OpenTripMap places whenever selectedCity changes or on mount
  React.useEffect(() => {
    if (selectedCity?.name && typeof fetchPlaces === 'function') {
      try {
        const p = fetchPlaces(selectedCity.name);
        if (p && typeof p.catch === 'function') {
          p.catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  }, [selectedCity?.name, fetchPlaces]);

  // City Spots Data (Merges offline catalog with live OpenTripMap API places)
  const cityData = useMemo(() => {
    const baseData =
      MOCK_SPOTS_BY_CITY[selectedCity?.name] ||
      getCitySpotsCatalog(selectedCity?.name, selectedCity?.country);
    if (!apiPlaces || apiPlaces.length === 0) {
      return baseData;
    }

    // Existing spot IDs in baseData to avoid duplication
    const existingIds = new Set(
      baseData?.categories?.flatMap((c) => c.spots).map((s) => s.id) || []
    );

    const apiLandmarks = [];
    const apiCulture = [];
    const apiBeaches = [];
    const apiDining = [];

    apiPlaces.forEach((p) => {
      if (existingIds.has(p.id)) return;
      const spotObj = {
        id: p.id,
        testId: `spot-card-${p.id}`,
        name: p.name,
        subtitle: p.address || `${p.city || selectedCity?.name} • OpenTripMap`,
        rating: p.rating || 4.8,
        duration: p.suggestedDuration ? parseFloat(p.suggestedDuration) : 1.5,
        lat: p.lat || 16.06,
        lng: p.lng || 108.22,
        address: p.address || `${selectedCity?.name}`,
        description: p.description || `${p.name} is a premier attraction in ${selectedCity?.name}.`,
        rate: p.rate || 3,
        kinds: p.kinds || p.category || 'landmark',
        image: p.image || p.preview || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
      };

      const catLower = (p.category || '').toLowerCase();
      if (catLower.includes('beach') || catLower.includes('nature')) {
        apiBeaches.push(spotObj);
      } else if (catLower.includes('food') || catLower.includes('dining') || catLower.includes('market')) {
        apiDining.push(spotObj);
      } else if (
        catLower.includes('cultur') ||
        catLower.includes('theatre') ||
        catLower.includes('museum') ||
        catLower.includes('religion')
      ) {
        apiCulture.push(spotObj);
      } else {
        apiLandmarks.push(spotObj);
      }
    });

    const categories = (baseData.categories || []).map((cat) => {
      let extra = [];
      if (cat.id === 'beaches' || cat.id === 'nature') extra = apiBeaches;
      else if (cat.id === 'landmarks') extra = [...apiLandmarks, ...apiCulture];
      else if (cat.id === 'dining') extra = apiDining;
      else if (cat.id === 'culture') extra = apiCulture;

      // Enrich existing spots with real API images if matching
      const enrichedSpots = cat.spots.map((spot) => {
        const match = apiPlaces.find(
          (p) =>
            p.id === spot.id ||
            (p.name && spot.name && (
              p.name.toLowerCase().includes(spot.name.toLowerCase()) ||
              spot.name.toLowerCase().includes(p.name.toLowerCase())
            ))
        );
        if (match && match.image) {
          return { ...spot, image: match.image };
        }
        return spot;
      });

      // Place real API places at the top of category so they are immediately visible on spot cards
      const mergedSpots = [...extra, ...enrichedSpots];
      return {
        ...cat,
        spots: mergedSpots,
        count: mergedSpots.length,
      };
    });

    const categoryIds = new Set(categories.map((c) => c.id));
    if (!categoryIds.has('dining') && apiDining.length > 0) {
      categories.push({
        id: 'dining',
        name: 'Dining & Street Food',
        count: apiDining.length,
        spots: apiDining,
      });
    }
    if (!categoryIds.has('nature') && !categoryIds.has('beaches') && apiBeaches.length > 0) {
      categories.push({
        id: 'nature',
        name: 'Parks & Nature',
        count: apiBeaches.length,
        spots: apiBeaches,
      });
    }

    return {
      ...baseData,
      categories,
    };
  }, [selectedCity, apiPlaces]);

  // Synchronize assigned hotel with selected destination
  React.useEffect(() => {
    if (cityData?.stay) {
      setAssignedHotel(cityData.stay);
    }
  }, [cityData]);

  // Filtered suggested hotels for Stay step search
  const suggestedHotelsList = useMemo(() => {
    const list = cityData?.suggestedHotels || [
      { id: 'h1', name: `${selectedCity?.name} Boutique Hotel`, address: `Central ${selectedCity?.name}`, rating: 4.8 },
      { id: 'h2', name: `${selectedCity?.name} Grand Palace`, address: `Downtown ${selectedCity?.name}`, rating: 4.9 },
    ];
    if (!hotelSearchQuery.trim()) return list;
    return list.filter(
      (h) =>
        h.name.toLowerCase().includes(hotelSearchQuery.toLowerCase()) ||
        h.address.toLowerCase().includes(hotelSearchQuery.toLowerCase())
    );
  }, [cityData, selectedCity, hotelSearchQuery]);

  // Handlers
  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setCurrentStep(2); // Auto-advance to When?
  };

  const handleToggleInterest = (tagId) => {
    setSelectedInterests((prev) => {
      const next = new Set(prev);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return next;
    });
  };

  const handleToggleSpot = (spotId) => {
    setSelectedSpots((prev) => {
      const next = new Set(prev);
      if (next.has(spotId)) {
        next.delete(spotId);
      } else {
        next.add(spotId);
      }
      return next;
    });
  };

  const handleFinish = () => {
    if (onComplete) {
      const numBudgetPerPerson = parseFloat(String(budgetPerPerson).replace(/[^0-9]/g, '')) || 2000000;
      const count = travelMode === 'solo' ? 1 : Math.max(1, travelersCount);
      onComplete({
        destination: selectedCity?.name || 'Đà Nẵng',
        country: selectedCity?.country || 'Việt Nam',
        daysCount,
        selectedInterests: Array.from(selectedInterests),
        selectedSpots: Array.from(selectedSpots),
        stayType,
        stayInfo: cityData?.stay || null,
        inviteRole,
        travelMode,
        travelersCount: count,
        budgetPerPerson: numBudgetPerPerson,
        budget: count * numBudgetPerPerson,
      });
    }
  };

  if (!visible) return null;

  // Inner Wizard Content
  const wizardContent = (
    <View style={styles.contentWrap}>
      {/* Header Bar matching User Image 2-6 */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="header-back-btn"
          style={styles.headerIconBtn}
          onPress={() => {
            if (currentStep > 1) {
              setCurrentStep(currentStep - 1);
            } else if (onClose) {
              onClose();
            }
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.headerIconText}>‹</Text>
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Create Trip</Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textMuted }]}>
            Step {currentStep} of 5 • {currentStep === 1 ? 'Where' : currentStep === 2 ? 'When' : currentStep === 3 ? 'Squad' : currentStep === 4 ? 'Spots' : 'Invite'}
          </Text>
        </View>

        <View style={styles.progressPercentPill}>
          <Text style={styles.progressPercentText}>{Math.min(100, currentStep * 20)}%</Text>
        </View>
      </View>

      {/* 5-Segment Progress Bar matching User Images */}
      <View testID="wizard-step-progress-bar" style={styles.stepProgressBarWrap}>
        {[1, 2, 3, 4, 5].map((st) => (
          <View
            key={st}
            style={[
              styles.stepProgressSegment,
              { backgroundColor: st <= currentStep ? (isDark ? '#FFFFFF' : '#0F172A') : (isDark ? '#334155' : '#E2E8F0') },
            ]}
          />
        ))}
      </View>

      {/* Summary Pill Bar on Steps 2 to 5 */}
      {currentStep > 1 ? (
        <View style={styles.wizardSummaryPillBar}>
          <Text style={styles.wizardSummaryPillText} numberOfLines={1}>
            📍 {selectedCity?.name} • {daysCount}d (Balanced) • {travelersCount} pax • {selectedSpots.size} spots
          </Text>
          <TouchableOpacity onPress={() => setCurrentStep(1)} style={styles.wizardSummaryEditBtn}>
            <Text style={styles.wizardSummaryEditText}>EDIT ✎</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Scrollable Accordion Cards Container */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* STEP 1: WHERE?                                            */}
        {/* ========================================================= */}
        {currentStep === 1 ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Where?</Text>

            {/* Destination Search Input */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                testID="destination-search-input"
                style={styles.searchInput}
                placeholder="Search for a destination"
                placeholderTextColor={themeColors.textMuted || '#94A3B8'}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Country Selector Chips: Pick Country then Pick City */}
            <View style={styles.countryFilterBlock}>
              <Text style={styles.sectionEyebrow}>Select Country</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.countryFilterScroll}
              >
                {MOCK_COUNTRIES.map((ctry) => {
                  const isActive = selectedCountryCode === ctry.code;
                  const filterCode = ctry.code.toLowerCase() === 'all' ? 'all' : (ctry.code || ctry.id);
                  return (
                    <TouchableOpacity
                      key={ctry.id}
                      testID={`country-filter-${filterCode}`}
                      style={[
                        styles.countryChip,
                        isActive && styles.countryChipActive,
                      ]}
                      onPress={() => setSelectedCountryCode(ctry.code)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.countryChipText,
                          isActive && styles.countryChipTextActive,
                        ]}
                      >
                        {ctry.flag} {ctry.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Saved Section */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionEyebrow}>Saved</Text>
              <TouchableOpacity
                style={styles.savedCard}
                onPress={() => handleSelectCity(MOCK_CITIES[0])}
                activeOpacity={0.7}
              >
                <View style={styles.savedThumbWrap}>
                  <Text style={styles.flagIcon}>🇻🇳</Text>
                </View>
                <View style={styles.savedInfo}>
                  <Text style={styles.savedTitle}>Việt Nam</Text>
                  <Text style={styles.savedSub}>1 spot pinned</Text>
                </View>
                <Text style={styles.chevronIcon}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Trending Destinations */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionEyebrow}>Trending</Text>
              <View style={styles.trendingList}>
                {filteredTrending.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    testID={`trending-destination-${city.id}`}
                    accessibilityLabel={`wizard-dest-card-${city.name}`}
                    style={[
                      styles.trendingCard,
                      selectedCity?.id === city.id && styles.trendingCardActive,
                    ]}
                    onPress={() => handleSelectCity(city)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.trendingLeft}>
                      <View style={styles.trendingFlag}>
                        <Text style={{ fontSize: 18 }}>
                          {MOCK_COUNTRIES.find((c) => c.code === city.code)?.flag || '🌍'}
                        </Text>
                      </View>
                      <View>
                        <Text testID={`wizard-dest-card-${city.name}`} style={styles.trendingName}>{city.name}</Text>
                        <Text style={styles.trendingCountry}>{city.country}</Text>
                      </View>
                    </View>
                    <View
                      testID={`dest-spots-badge-${city.name}`}
                      style={[
                        styles.spotsCountBadge,
                        selectedCity?.id === city.id && { backgroundColor: isDark ? '#FFFFFF' : '#0F172A' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.spotsCountText,
                          selectedCity?.id === city.id && { color: isDark ? '#0F172A' : '#FFFFFF' },
                        ]}
                      >
                        {city.spotsCount} spots
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Collapsed Accordion Pills for Next Steps */}
            <View style={styles.collapsedPillsWrap}>
              <TouchableOpacity
                testID="accordion-pill-when"
                style={styles.collapsedPill}
                onPress={() => setCurrentStep(2)}
                activeOpacity={0.7}
              >
                <Text style={styles.collapsedPillLabel}>When</Text>
                <Text style={styles.collapsedPillValue}>Add dates ›</Text>
              </TouchableOpacity>
              <TouchableOpacity
                testID="accordion-pill-preferences"
                style={styles.collapsedPill}
                onPress={() => setCurrentStep(3)}
                activeOpacity={0.7}
              >
                <Text style={styles.collapsedPillLabel}>Preferences</Text>
                <Text style={styles.collapsedPillValue}>Add interests ›</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Collapsed Where Header Pill */
          <TouchableOpacity
            testID="accordion-pill-where-active"
            style={styles.collapsedHeaderCard}
            onPress={() => setCurrentStep(1)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.collapsedHeaderEyebrow}>Where</Text>
              <Text style={styles.collapsedHeaderTitle}>
                {selectedCity?.name}, {selectedCity?.country}
              </Text>
            </View>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        )}

        {/* ========================================================= */}
        {/* STEP 2: WHEN? (IMG_7824)                                  */}
        {/* ========================================================= */}
        {currentStep === 2 ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>When?</Text>

            {/* Flexible vs Specific Dates Switcher */}
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                testID="when-toggle-flexible"
                style={[
                  styles.segmentBtn,
                  dateMode === 'flexible' && styles.segmentBtnActive,
                ]}
                onPress={() => setDateMode('flexible')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    dateMode === 'flexible' && styles.segmentBtnTextActive,
                  ]}
                >
                  Flexible
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="when-toggle-specific"
                style={[
                  styles.segmentBtn,
                  dateMode === 'specific' && styles.segmentBtnActive,
                ]}
                onPress={() => setDateMode('specific')}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.segmentBtnText,
                    dateMode === 'specific' && styles.segmentBtnTextActive,
                  ]}
                >
                  Specific Dates
                </Text>
              </TouchableOpacity>
            </View>

            {/* Number of Days Counter / Stepper */}
            <View style={styles.daysSelectorCard}>
              <Text style={styles.daysSelectorLabel}>How many days?</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setDaysCount((prev) => Math.max(1, prev - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </TouchableOpacity>

                <View testID="when-days-display" style={styles.daysDisplayBox}>
                  <Text style={styles.daysNumberText}>{daysCount}</Text>
                  <Text style={styles.daysSubText}>days</Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setDaysCount((prev) => prev + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Next Button */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => setDaysCount(3)}
                activeOpacity={0.7}
              >
                <Text style={styles.clearBtnText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="when-next-btn"
                style={styles.primaryNextBtn}
                onPress={() => setCurrentStep(3)}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryNextBtnText}>Next →</Text>
              </TouchableOpacity>
            </View>

            {/* Collapsed Preferences Pill below When */}
            <TouchableOpacity
              testID="accordion-pill-preferences"
              style={[styles.collapsedPill, { marginTop: 14 }]}
              onPress={() => setCurrentStep(3)}
              activeOpacity={0.7}
            >
              <Text style={styles.collapsedPillLabel}>Preferences</Text>
              <Text style={styles.collapsedPillValue}>Add interests ›</Text>
            </TouchableOpacity>
          </View>
        ) : currentStep > 2 ? (
          /* Collapsed When Pill */
          <TouchableOpacity
            testID="accordion-pill-when-active"
            style={styles.collapsedHeaderCard}
            onPress={() => setCurrentStep(2)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.collapsedHeaderEyebrow}>When</Text>
              <Text style={styles.collapsedHeaderTitle}>
                {daysCount} Days • {dateMode === 'flexible' ? 'Flexible Dates' : 'Specific Dates'}
              </Text>
            </View>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : null}

        {/* ========================================================= */}
        {/* STEP 3: PREFERENCES (Add interests & budget)               */}
        {/* ========================================================= */}
        {currentStep === 3 ? (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Preferences & Budget</Text>
            <Text style={styles.stepSub}>Select travel style, group size, and estimated cost per person</Text>

            {/* Travel Mode & Estimated Budget (Who is traveling & budget) */}
            <View style={styles.wizardBudgetSection}>
              <Text style={styles.wizardSectionSubtitle}>Who is traveling & Budget:</Text>

              <View style={styles.wizardBudgetModeRow}>
                <TouchableOpacity
                  testID="wizard-budget-mode-solo"
                  style={[
                    styles.wizardBudgetModeBtn,
                    travelMode === 'solo' && styles.wizardBudgetModeBtnActive,
                  ]}
                  onPress={() => {
                    setTravelMode('solo');
                    setTravelersCount(1);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.wizardBudgetModeBtnText,
                      travelMode === 'solo' && styles.wizardBudgetModeBtnTextActive,
                    ]}
                  >
                    Solo (1 Traveler)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="wizard-budget-mode-group"
                  style={[
                    styles.wizardBudgetModeBtn,
                    travelMode === 'group' && styles.wizardBudgetModeBtnActive,
                  ]}
                  onPress={() => {
                    setTravelMode('group');
                    if (travelersCount <= 1) setTravelersCount(3);
                  }}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.wizardBudgetModeBtnText,
                      travelMode === 'group' && styles.wizardBudgetModeBtnTextActive,
                    ]}
                  >
                    Group ({travelMode === 'group' ? travelersCount : 3} Travelers)
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.wizardBudgetInputRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.wizardInputLabel}>Estimated Cost per Person (₫):</Text>
                  <TextInput
                    testID="wizard-budget-per-person"
                    style={styles.wizardBudgetTextInput}
                    keyboardType="numeric"
                    value={String(budgetPerPerson)}
                    onChangeText={setBudgetPerPerson}
                    placeholder="e.g. 2,000,000"
                    placeholderTextColor="#64748B"
                  />
                </View>

                {travelMode === 'group' && (
                  <View style={{ width: 95 }}>
                    <Text style={styles.wizardInputLabel}>Travelers:</Text>
                    <TextInput
                      testID="wizard-travelers-count"
                      style={styles.wizardBudgetTextInput}
                      keyboardType="numeric"
                      value={String(travelersCount)}
                      onChangeText={(t) => setTravelersCount(Math.max(1, parseInt(t.replace(/[^0-9]/g, ''), 10) || 1))}
                      placeholder="3"
                      placeholderTextColor="#64748B"
                    />
                  </View>
                )}
              </View>

              <View style={styles.wizardBudgetPreviewBox}>
                <Text style={styles.wizardBudgetPreviewText}>
                  Est. Total: {(travelMode === 'solo' ? 1 : travelersCount)} Traveler{(travelMode === 'solo' ? 1 : travelersCount) > 1 ? 's' : ''} × {Number(budgetPerPerson || 0).toLocaleString('vi-VN')} ₫ = {((travelMode === 'solo' ? 1 : travelersCount) * Number(budgetPerPerson || 0)).toLocaleString('vi-VN')} ₫
                </Text>
              </View>
            </View>

            <Text style={[styles.wizardSectionSubtitle, { marginTop: 14 }]}>What are your interests?</Text>

            {/* Interest Chips Grid */}
            <View style={styles.interestChipsGrid}>
              {INTEREST_TAGS.map((tag) => {
                const isSelected = selectedInterests.has(tag.id);
                return (
                  <TouchableOpacity
                    key={tag.id}
                    testID={tag.testId}
                    style={[
                      styles.interestChip,
                      isSelected && styles.interestChipActive,
                    ]}
                    onPress={() => handleToggleInterest(tag.id)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.interestChipText,
                        isSelected && styles.interestChipTextActive,
                      ]}
                    >
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Action Row */}
            <TouchableOpacity
              testID="preferences-next-btn"
              style={[styles.continueStickyBtn, { marginTop: 16 }]}
              onPress={() => setCurrentStep(4)}
              activeOpacity={0.85}
            >
              <Text style={styles.continueStickyBtnText}>Explore Spots →</Text>
            </TouchableOpacity>
          </View>
        ) : currentStep > 3 ? (
          /* Collapsed Preferences Pill */
          <TouchableOpacity
            testID="accordion-pill-pref-active"
            style={styles.collapsedHeaderCard}
            onPress={() => setCurrentStep(3)}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.collapsedHeaderEyebrow}>Preferences & Budget</Text>
              <Text style={styles.collapsedHeaderTitle}>
                {travelMode === 'solo' ? 'Solo' : `Group (${travelersCount})`} • {selectedInterests.size} Interests
              </Text>
            </View>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : null}

        {/* ========================================================= */}
        {/* STEP 4: SPOTS GRID & MAP (IMG_7828)                       */}
        {/* ========================================================= */}
        {currentStep === 4 && (
          <View style={styles.stepCard}>
            {/* Toolbar */}
            <View style={styles.spotsToolbar}>
              <View style={styles.spotsToolbarLeft}>
                <Text style={styles.stepTitle}>Explore Spots</Text>
                <Text style={styles.spotsSubtitle}>
                  {selectedCity?.name} ({selectedSpots.size} chosen)
                </Text>
              </View>

              {/* View Mode Switcher */}
              <View style={styles.viewModeSwitcher}>
                <TouchableOpacity
                  testID="spots-mode-grid"
                  style={[
                    styles.viewModeBtn,
                    spotsViewMode === 'grid' && styles.viewModeBtnActive,
                  ]}
                  onPress={() => setSpotsViewMode('grid')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.viewModeBtnText,
                      spotsViewMode === 'grid' && styles.viewModeBtnTextActive,
                    ]}
                  >
                    ⊞ Grid
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="spots-mode-map"
                  style={[
                    styles.viewModeBtn,
                    spotsViewMode === 'map' && styles.viewModeBtnActive,
                  ]}
                  onPress={() => setSpotsViewMode('map')}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.viewModeBtnText,
                      spotsViewMode === 'map' && styles.viewModeBtnTextActive,
                    ]}
                  >
                    🗺️ Map
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Map Canvas View */}
            {spotsViewMode === 'map' ? (
              <View testID="spots-map-canvas" style={styles.mapCanvasContainer}>
                <View style={styles.mapCanvasPlaceholder}>
                  <Text style={styles.mapCanvasIcon}>🗺️</Text>
                  <Text style={styles.mapCanvasTitle}>Interactive Mapbox Preview</Text>
                  <Text style={styles.mapCanvasCoords}>
                    Center: {selectedCity?.name} ({cityData?.categories?.[0]?.spots?.[0]?.lat},{' '}
                    {cityData?.categories?.[0]?.spots?.[0]?.lng})
                  </Text>
                  <View style={styles.mapPinsRow}>
                    {cityData?.categories?.flatMap((c) => c.spots).map((spot, idx) => (
                      <View
                        key={spot.id}
                        style={[
                          styles.mapPinBadge,
                          selectedSpots.has(spot.id) && styles.mapPinBadgeActive,
                        ]}
                      >
                        <Text style={styles.mapPinText}>
                          {idx + 1}. {spot.name.slice(0, 10)}...
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            ) : (
              /* 2-Column Square Cards Grid View (IMG_7828) */
              <View testID="spots-grid-container" style={styles.gridContainer}>
                {cityData?.categories?.map((cat) => {
                  const isExpanded = expandedCategories.has(cat.id);
                  const spotsToDisplay = isExpanded ? cat.spots : cat.spots.slice(0, 2);
                  return (
                    <View key={cat.id} style={styles.categorySection}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryTitle}>{cat.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{cat.spots.length} spots</Text>
                          </View>
                          {cat.spots.length > 2 && (
                            <TouchableOpacity
                              testID={`category-see-all-${cat.id}`}
                              onPress={() => toggleCategoryExpand(cat.id)}
                              activeOpacity={0.7}
                              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            >
                              <Text style={styles.seeAllText}>
                                {isExpanded ? 'Show less' : 'See all ›'}
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      <View style={styles.spotsTwoColumnGrid}>
                        {spotsToDisplay.map((spot) => {
                        const isSelected = selectedSpots.has(spot.id);
                        return (
                          <TouchableOpacity
                            key={spot.id}
                            testID={spot.testId || `spot-card-${spot.id}`}
                            style={[
                              styles.spotCard,
                              isSelected && styles.spotCardSelected,
                            ]}
                            onPress={() => handleToggleSpot(spot.id)}
                            onLongPress={() => handleOpenSpotDetail(spot)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.spotImageWrap}>
                              <Image
                                source={{ uri: spot.image }}
                                style={styles.spotImage}
                                resizeMode="cover"
                              />

                              {/* Selection Checkmark Circle in Top-Right */}
                              <View
                                style={[
                                  styles.selectionCircle,
                                  isSelected && styles.selectionCircleActive,
                                ]}
                              >
                                <Text style={styles.checkmarkText}>
                                  {isSelected ? '✓' : ''}
                                </Text>
                              </View>
                            </View>

                            <View style={styles.spotCardInfo}>
                              <Text style={styles.spotCardName} numberOfLines={1}>
                                {spot.name}
                              </Text>
                              <Text style={styles.spotCardSubtitle} numberOfLines={1}>
                                {spot.subtitle}
                              </Text>
                              <View style={styles.spotMetaRow}>
                                <View style={styles.spotMetaLeft}>
                                  <Text style={styles.spotRating}>★ {spot.rating}</Text>
                                  <Text style={styles.spotDuration}>⏱ {spot.duration}h</Text>
                                </View>
                                {/* Details Button at bottom of card */}
                                <TouchableOpacity
                                  testID={`spot-details-btn-${spot.id}`}
                                  style={styles.spotDetailsBtnBottom}
                                  onPress={() => handleOpenSpotDetail(spot)}
                                  activeOpacity={0.7}
                                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                  <Text style={styles.spotDetailsBtnBottomText}>Details ℹ️</Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
              </View>
            )}

            {/* Continue Sticky Button */}
            <TouchableOpacity
              testID="spots-continue-btn"
              style={styles.continueStickyBtn}
              onPress={() => setCurrentStep(5)}
              activeOpacity={0.85}
            >
              <Text style={styles.continueStickyBtnText}>
                Continue ({selectedSpots.size} Spots Selected) →
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 5: WHERE ARE YOU STAYING? (IMG_7825 & IMG_7826)      */}
        {/* ========================================================= */}
        {currentStep === 5 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Where are you staying?</Text>
            <Text style={styles.stepSub}>Skip if you haven't decided yet</Text>

            {/* Options List (Image 2 Exact Match) */}
            <View style={styles.stayOptionsList}>
              <TouchableOpacity
                testID="stay-option-hotel"
                style={[
                  styles.stayOptionRowCard,
                  stayType === 'hotel' && styles.stayOptionRowCardActive,
                ]}
                onPress={() => setStayType('hotel')}
                activeOpacity={0.8}
              >
                <View style={[styles.stayOptionIconContainer, styles.hotelIconContainer]}>
                  <Text style={styles.stayOptionIconText}>🛏️</Text>
                </View>
                <Text style={styles.stayOptionRowTitle}>Hotel</Text>
              </TouchableOpacity>

              {/* Hotel Search and Assignment Section */}
              {stayType === 'hotel' && (
                <View style={styles.hotelSearchContainer}>
                  <Text style={styles.hotelSearchLabel}>
                    Search & assign your hotel in {selectedCity?.name}:
                  </Text>
                  <View style={styles.hotelSearchInputRow}>
                    <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
                    <TextInput
                      testID="hotel-search-input"
                      style={styles.hotelSearchInput}
                      placeholder={`Search hotel in ${selectedCity?.name || 'city'}...`}
                      placeholderTextColor={themeColors.textMuted || '#94A3B8'}
                      value={hotelSearchQuery}
                      onChangeText={setHotelSearchQuery}
                    />
                  </View>

                  {/* Assigned Hotel confirmation card */}
                  {assignedHotel && (
                    <View testID="assigned-hotel-card" style={styles.assignedHotelCard}>
                      <View style={styles.assignedHotelLeft}>
                        <Text style={{ fontSize: 20, marginRight: 8 }}>🏨</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.assignedHotelName}>{assignedHotel.name}</Text>
                          <Text style={styles.assignedHotelAddress} numberOfLines={1}>
                            {assignedHotel.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.assignedHotelBadge}>
                        <Text style={styles.assignedHotelBadgeText}>✓ Assigned</Text>
                      </View>
                    </View>
                  )}

                  {/* Suggestions List */}
                  <View testID="hotel-search-suggestions" style={styles.hotelSuggestionsList}>
                    {suggestedHotelsList
                      .filter((hotel) => hotel.name !== assignedHotel?.name)
                      .slice(0, 3)
                      .map((hotel, idx) => (
                      <TouchableOpacity
                        key={hotel.id || idx}
                        testID={`hotel-suggestion-${idx}`}
                        style={styles.hotelSuggestionRow}
                        onPress={() => {
                          setAssignedHotel(hotel);
                          setHotelSearchQuery(hotel.name);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={{ fontSize: 16, marginRight: 8 }}>🛏️</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.hotelSuggestionName}>{hotel.name}</Text>
                          <Text style={styles.hotelSuggestionSub} numberOfLines={1}>
                            {hotel.address}
                          </Text>
                        </View>
                        <Text style={styles.hotelSuggestionRating}>★ {hotel.rating || 4.8}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity
                testID="stay-option-airbnb"
                style={[
                  styles.stayOptionRowCard,
                  stayType === 'airbnb' && styles.stayOptionRowCardActive,
                ]}
                onPress={() => setStayType('airbnb')}
                activeOpacity={0.8}
              >
                <View style={[styles.stayOptionIconContainer, styles.airbnbIconContainer]}>
                  <Text style={styles.stayOptionIconText}>🏠</Text>
                </View>
                <Text style={styles.stayOptionRowTitle}>Airbnb / Rental</Text>
              </TouchableOpacity>

              <TouchableOpacity
                testID="stay-option-friends"
                style={[
                  styles.stayOptionRowCard,
                  stayType === 'friends' && styles.stayOptionRowCardActive,
                ]}
                onPress={() => setStayType('friends')}
                activeOpacity={0.8}
              >
                <View style={[styles.stayOptionIconContainer, styles.friendsIconContainer]}>
                  <Text style={styles.stayOptionIconText}>👥</Text>
                </View>
                <Text style={styles.stayOptionRowTitle}>Staying with Friends</Text>
              </TouchableOpacity>

              {/* Divider row (Image 2) */}
              <View testID="stay-or-divider" style={styles.stayOrDividerRow}>
                <View style={styles.stayOrDividerLine} />
                <Text style={styles.stayOrDividerText}>OR</Text>
                <View style={styles.stayOrDividerLine} />
              </View>

              <TouchableOpacity
                testID="stay-option-skip"
                style={[
                  styles.stayOptionRowCard,
                  stayType === 'skip' && styles.stayOptionRowCardActive,
                ]}
                onPress={() => setStayType('skip')}
                activeOpacity={0.8}
              >
                <View style={[styles.stayOptionIconContainer, styles.skipIconContainer]}>
                  <Text style={styles.stayOptionIconText}>🕒</Text>
                </View>
                <View style={styles.stayOptionRowTextCol}>
                  <Text style={styles.stayOptionRowTitle}>Skip for now</Text>
                  <Text style={styles.stayOptionRowSub}>Not booked yet</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Continue to Invites */}
            <TouchableOpacity
              testID="stay-continue-btn"
              style={styles.continueStickyBtn}
              onPress={() => setCurrentStep(6)}
              activeOpacity={0.85}
            >
              <Text style={styles.continueStickyBtnText}>Continue to Invites →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================= */}
        {/* STEP 6: INVITE FRIENDS (IMG_7827)                         */}
        {/* ========================================================= */}
        {currentStep === 6 && (
          <View style={styles.stepCard}>
            <Text style={styles.stepTitle}>Invite Friends</Text>
            <Text style={styles.stepSub}>
              Share your itinerary boarding pass so friends can vote and edit stops.
            </Text>

            {/* Boarding Pass Ticket Card (IMG_7827) */}
            <View testID="invite-ticket-card" style={styles.ticketCard}>
              <View style={styles.ticketHeader}>
                <View>
                  <Text style={styles.ticketEyebrow}>NOMADIX SQUAD EXPEDITION</Text>
                  <Text style={styles.ticketDestTitle}>
                    {selectedCity?.name} Trip
                  </Text>
                </View>
                <View style={styles.ticketLogoBadge}>
                  <Text style={styles.ticketLogoText}>NX</Text>
                </View>
              </View>

              <View style={styles.ticketDivider}>
                <View style={styles.ticketNotchLeft} />
                <View style={styles.ticketDashedLine} />
                <View style={styles.ticketNotchRight} />
              </View>

              <View style={styles.ticketBody}>
                <View style={styles.ticketMetaRow}>
                  <View>
                    <Text style={styles.ticketMetaLabel}>DURATION</Text>
                    <Text style={styles.ticketMetaVal}>{daysCount} Days</Text>
                  </View>
                  <View>
                    <Text style={styles.ticketMetaLabel}>SPOTS</Text>
                    <Text style={styles.ticketMetaVal}>{selectedSpots.size} Selected</Text>
                  </View>
                  <View>
                    <Text style={styles.ticketMetaLabel}>ROLE</Text>
                    <Text style={styles.ticketMetaVal}>{inviteRole}</Text>
                  </View>
                </View>

                {/* Shareable Link Box */}
                <View style={styles.inviteLinkBox}>
                  <Text style={styles.inviteLinkText} numberOfLines={1}>
                    https://nomadix.app/join/{selectedCity?.id || 'trip'}?code=NX9281
                  </Text>
                  <TouchableOpacity
                    style={styles.copyLinkBtn}
                    onPress={() => setInviteCopied(true)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.copyLinkText}>
                      {inviteCopied ? 'Copied ✓' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Role Selector */}
                <View testID="invite-role-selector" style={styles.roleSelectorRow}>
                  <Text style={styles.roleSelectorLabel}>Companion Access:</Text>
                  <View style={styles.rolePillsWrap}>
                    <TouchableOpacity
                      style={[
                        styles.rolePill,
                        inviteRole === 'EDITOR' && styles.rolePillActive,
                      ]}
                      onPress={() => setInviteRole('EDITOR')}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.rolePillText,
                          inviteRole === 'EDITOR' && styles.rolePillTextActive,
                        ]}
                      >
                        👁️ Editor
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.rolePill,
                        inviteRole === 'VIEWER' && styles.rolePillActive,
                      ]}
                      onPress={() => setInviteRole('VIEWER')}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.rolePillText,
                          inviteRole === 'VIEWER' && styles.rolePillTextActive,
                        ]}
                      >
                        🔒 Viewer
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Final Submit / Share and View Plan Button */}
            <TouchableOpacity
              testID="invite-share-view-plan-btn"
              style={styles.continueStickyBtn}
              onPress={handleFinish}
              activeOpacity={0.85}
            >
              <Text style={styles.continueStickyBtnText}>
                Share Invite & View Plan ✨
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Spot Detail Modal (OpenTripMap Data) */}
      <Modal
        visible={Boolean(detailSpot)}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailSpot(null)}
      >
        <View style={styles.detailModalOverlay}>
          <View testID="spot-detail-modal" style={styles.detailModalContent}>
            {detailSpot && (
              <>
                {/* Cover Image Gallery & Close Button */}
                {(() => {
                  const galleryImages = getSpotGalleryImages(detailSpot);
                  const currentImageUri = galleryImages[activePhotoIdx] || detailSpot.image;

                  return (
                    <>
                      <View style={styles.detailImageContainer}>
                        <Image
                          testID="spot-detail-image"
                          source={{ uri: currentImageUri }}
                          style={styles.detailImage}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          testID="spot-detail-close-btn"
                          style={styles.detailCloseBtn}
                          onPress={() => setDetailSpot(null)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.detailCloseText}>✕</Text>
                        </TouchableOpacity>

                        {/* Photo Counter Pill (e.g. 📷 1/4) */}
                        <View testID="spot-detail-photo-counter" style={styles.detailPhotoCounter}>
                          <Text style={styles.detailPhotoCounterText}>
                            📷 {activePhotoIdx + 1}/{galleryImages.length}
                          </Text>
                        </View>

                        <View style={styles.detailCategoryBadge}>
                          <Text style={styles.detailCategoryText}>
                            {detailSpot.kinds ? detailSpot.kinds.split(',')[0].toUpperCase() : 'ATTRACTION'}
                          </Text>
                        </View>
                      </View>

                      {/* Interactive Thumbnails Row for 3-4 Photos */}
                      <View testID="spot-detail-thumbnails" style={styles.detailThumbnailsRow}>
                        {galleryImages.map((thumbUri, idx) => {
                          const isActive = activePhotoIdx === idx;
                          return (
                            <TouchableOpacity
                              key={`thumb-btn-${idx}`}
                              testID={`spot-detail-thumb-${idx}`}
                              style={[
                                styles.detailThumbBtn,
                                isActive && styles.detailThumbBtnActive,
                              ]}
                              onPress={() => setActivePhotoIdx(idx)}
                              activeOpacity={0.8}
                            >
                              <Image
                                testID={`spot-detail-gallery-image-${idx}`}
                                source={{ uri: thumbUri }}
                                style={styles.detailThumbImg}
                                resizeMode="cover"
                              />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </>
                  );
                })()}

                <ScrollView style={styles.detailBodyScroll} showsVerticalScrollIndicator={false}>
                  {/* Title & Rating */}
                  <Text testID="spot-detail-name" style={styles.detailTitle}>
                    {detailSpot.name}
                  </Text>

                  <View style={styles.detailMetaRow}>
                    <View style={styles.detailMetaItem}>
                      <Text testID="spot-detail-rating" style={styles.detailRatingText}>
                        ★ {detailSpot.rating || 4.8} {detailSpot.rate ? `• Top ${detailSpot.rate}★ Landmark` : ''}
                      </Text>
                    </View>
                    <View style={styles.detailMetaItem}>
                      <Text testID="spot-detail-duration" style={styles.detailDurationText}>
                        ⏱ {detailSpot.duration || 1.5}h visit
                      </Text>
                    </View>
                  </View>

                  {/* Address */}
                  <View style={styles.detailAddressBox}>
                    <Text style={styles.detailAddressIcon}>📍</Text>
                    <Text testID="spot-detail-address" style={styles.detailAddressText}>
                      {detailSpot.address || `${detailSpot.lat}, ${detailSpot.lng}`}
                    </Text>
                  </View>

                  {/* Description (Wikipedia extract from OpenTripMap) */}
                  <View style={styles.detailDescSection}>
                    <Text style={styles.detailDescHeader}>About This Destination</Text>
                    <Text testID="spot-detail-description" style={styles.detailDescText}>
                      {detailSpot.description ||
                        `${detailSpot.name} is a premier attraction featuring remarkable architecture, rich historical significance, and panoramic views.`}
                    </Text>
                  </View>
                </ScrollView>

                {/* Action Footer Button */}
                <View style={styles.detailFooter}>
                  <TouchableOpacity
                    testID="spot-detail-toggle-btn"
                    style={[
                      styles.detailToggleBtn,
                      selectedSpots.has(detailSpot.id) && styles.detailToggleBtnSelected,
                    ]}
                    onPress={() => handleToggleSpot(detailSpot.id)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.detailToggleBtnText,
                        selectedSpots.has(detailSpot.id) && styles.detailToggleBtnTextSelected,
                      ]}
                    >
                      {selectedSpots.has(detailSpot.id) ? '✓ Spot Selected (Tap to remove)' : '+ Select This Spot'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );

  // If inline mode: render in View so bottom navigation dock stays visible
  if (inline) {
    return (
      <View testID="accordion-wizard-inline-container" style={[styles.inlineRoot, { backgroundColor: themeColors.background }]}>
        {wizardContent}
      </View>
    );
  }

  // Otherwise render in standard Modal
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
        {wizardContent}
      </SafeAreaView>
    </Modal>
  );
}

function getStyles(themeColors, isDark) {
  const primaryColor = isDark ? '#FFFFFF' : '#0F172A'; // Black/White per Image 1
  const primaryText = isDark ? '#0F172A' : '#FFFFFF';
  const bgCard = isDark ? '#1C1D21' : '#FFFFFF';
  const bgSubtle = isDark ? '#121316' : '#F8FAFC';
  const borderCol = isDark ? '#2A2D35' : '#E2E8F0';
  const textCol = isDark ? '#FFFFFF' : '#0F172A';
  const textMuted = isDark ? '#94A3B8' : '#64748B';

  return StyleSheet.create({
    container: {
      flex: 1,
    },
    inlineRoot: {
      flex: 1,
      width: '100%',
    },
    contentWrap: {
      flex: 1,
      width: '100%',
      maxWidth: 480,
      alignSelf: 'center',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: borderCol,
    },
    headerIconBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: bgCard,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: borderCol,
    },
    headerIconText: {
      fontSize: 18,
      color: textCol,
      fontWeight: 'bold',
      marginTop: -2,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '800',
      color: textCol,
      letterSpacing: -0.3,
    },
    headerSubtitle: {
      fontSize: 11,
      fontWeight: '600',
      marginTop: 2,
    },
    progressPercentPill: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 12,
    },
    progressPercentText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#10B981',
    },
    stepProgressBarWrap: {
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    stepProgressSegment: {
      flex: 1,
      height: 4,
      borderRadius: 2,
    },
    wizardSummaryPillBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: bgCard,
      borderWidth: 1,
      borderColor: borderCol,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    wizardSummaryPillText: {
      flex: 1,
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
      marginRight: 8,
    },
    wizardSummaryEditBtn: {
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    wizardSummaryEditText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#64748B',
    },
    scrollContent: {
      flex: 1,
    },
    scrollInner: {
      paddingHorizontal: 16,
      paddingVertical: 14,
      paddingBottom: 40,
    },
    stepCard: {
      backgroundColor: bgCard,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 12,
      elevation: 3,
    },
    stepTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: textCol,
      letterSpacing: -0.5,
      marginBottom: 8,
    },
    stepSub: {
      fontSize: 13,
      color: textMuted,
      marginBottom: 16,
      lineHeight: 18,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bgSubtle,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: borderCol,
      paddingHorizontal: 12,
      marginVertical: 12,
      height: 44,
    },
    searchIcon: {
      fontSize: 14,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: textCol,
      fontWeight: '500',
    },
    countryFilterBlock: {
      marginTop: 14,
      marginBottom: 6,
    },
    countryFilterScroll: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    countryChip: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: bgCard,
      borderWidth: 1,
      borderColor: borderCol,
    },
    countryChipActive: {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
    countryChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
    },
    countryChipTextActive: {
      color: primaryText,
      fontWeight: '800',
    },
    sectionBlock: {
      marginTop: 16,
    },
    sectionEyebrow: {
      fontSize: 12,
      fontWeight: '800',
      color: textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 8,
    },
    savedCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bgSubtle,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: borderCol,
    },
    savedThumbWrap: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: bgCard,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    flagIcon: {
      fontSize: 20,
    },
    savedInfo: {
      flex: 1,
    },
    savedTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: textCol,
    },
    savedSub: {
      fontSize: 12,
      color: textMuted,
      marginTop: 2,
    },
    chevronIcon: {
      fontSize: 18,
      color: textMuted,
      fontWeight: 'bold',
    },
    trendingList: {
      gap: 8,
    },
    trendingCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: bgSubtle,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 6,
    },
    trendingCardActive: {
      borderColor: primaryColor,
      backgroundColor: isDark ? '#23252A' : '#F1F5F9',
    },
    trendingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    trendingFlag: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: bgCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trendingName: {
      fontSize: 14,
      fontWeight: '700',
      color: textCol,
    },
    trendingCountry: {
      fontSize: 12,
      color: textMuted,
      marginTop: 2,
    },
    spotsCountBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: isDark ? '#2A2D35' : '#E2E8F0',
    },
    spotsCountText: {
      fontSize: 11,
      fontWeight: '700',
      color: textMuted,
    },
    collapsedPillsWrap: {
      marginTop: 18,
      gap: 8,
    },
    collapsedPill: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: bgSubtle,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: borderCol,
      opacity: 0.85,
    },
    collapsedPillLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: textCol,
    },
    collapsedPillValue: {
      fontSize: 12,
      color: textCol,
      fontWeight: '700',
    },
    collapsedHeaderCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: bgCard,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 12,
    },
    collapsedHeaderEyebrow: {
      fontSize: 10,
      fontWeight: '800',
      color: textMuted,
      textTransform: 'uppercase',
    },
    collapsedHeaderTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: textCol,
      marginTop: 2,
    },
    editBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
    },
    segmentedControl: {
      flexDirection: 'row',
      backgroundColor: bgSubtle,
      borderRadius: 14,
      padding: 4,
      marginVertical: 12,
    },
    segmentBtn: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    segmentBtnActive: {
      backgroundColor: primaryColor,
    },
    segmentBtnText: {
      fontSize: 13,
      fontWeight: '600',
      color: textMuted,
    },
    segmentBtnTextActive: {
      color: primaryText,
      fontWeight: '800',
    },
    daysSelectorCard: {
      backgroundColor: bgSubtle,
      borderRadius: 18,
      padding: 16,
      alignItems: 'center',
      marginVertical: 12,
      borderWidth: 1,
      borderColor: borderCol,
    },
    daysSelectorLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: textMuted,
      marginBottom: 12,
    },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    stepperBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: bgCard,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: borderCol,
    },
    stepperBtnText: {
      fontSize: 22,
      fontWeight: '800',
      color: textCol,
    },
    daysDisplayBox: {
      alignItems: 'center',
      minWidth: 80,
    },
    daysNumberText: {
      fontSize: 32,
      fontWeight: '900',
      color: textCol,
    },
    daysSubText: {
      fontSize: 12,
      color: textMuted,
      fontWeight: '600',
    },
    actionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 18,
      gap: 12,
    },
    clearBtn: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 14,
      backgroundColor: bgSubtle,
      borderWidth: 1,
      borderColor: borderCol,
    },
    clearBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: textMuted,
    },
    primaryNextBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 16,
      backgroundColor: primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryNextBtnText: {
      fontSize: 15,
      fontWeight: '800',
      color: primaryText,
    },
    wizardBudgetSection: {
      marginVertical: 10,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: bgSubtle,
    },
    wizardSectionSubtitle: {
      fontSize: 13,
      fontWeight: '700',
      color: textCol,
      marginBottom: 8,
    },
    wizardBudgetModeRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 10,
    },
    wizardBudgetModeBtn: {
      flex: 1,
      paddingVertical: 9,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: borderCol,
      backgroundColor: bgCard,
      alignItems: 'center',
      justifyContent: 'center',
    },
    wizardBudgetModeBtnActive: {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
    wizardBudgetModeBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: textMuted,
    },
    wizardBudgetModeBtnTextActive: {
      color: primaryText,
    },
    wizardBudgetInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    wizardInputLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: textMuted,
      marginBottom: 4,
    },
    wizardBudgetTextInput: {
      backgroundColor: bgCard,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 9,
      fontSize: 13,
      fontWeight: '700',
      borderWidth: 1,
      borderColor: borderCol,
      color: textCol,
    },
    wizardBudgetPreviewBox: {
      marginTop: 2,
      paddingVertical: 4,
    },
    wizardBudgetPreviewText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#10B981',
    },
    interestChipsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginVertical: 10,
    },
    interestChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 14,
      backgroundColor: bgSubtle,
      borderWidth: 1.5,
      borderColor: borderCol,
    },
    interestChipActive: {
      borderColor: primaryColor,
      backgroundColor: primaryColor,
    },
    interestChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: textMuted,
    },
    interestChipTextActive: {
      color: primaryText,
      fontWeight: '800',
    },
    spotsToolbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    spotsToolbarLeft: {
      flex: 1,
    },
    spotsSubtitle: {
      fontSize: 12,
      color: textMuted,
      fontWeight: '600',
      marginTop: -4,
    },
    viewModeSwitcher: {
      flexDirection: 'row',
      backgroundColor: bgSubtle,
      borderRadius: 12,
      padding: 3,
      borderWidth: 1,
      borderColor: borderCol,
    },
    viewModeBtn: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 9,
    },
    viewModeBtnActive: {
      backgroundColor: primaryColor,
    },
    viewModeBtnText: {
      fontSize: 11,
      fontWeight: '700',
      color: textMuted,
    },
    viewModeBtnTextActive: {
      color: primaryText,
    },
    mapCanvasContainer: {
      borderRadius: 18,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: bgSubtle,
      padding: 20,
      marginBottom: 16,
    },
    mapCanvasPlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapCanvasIcon: {
      fontSize: 36,
      marginBottom: 8,
    },
    mapCanvasTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: textCol,
      marginBottom: 4,
    },
    mapCanvasCoords: {
      fontSize: 11,
      color: textMuted,
      marginBottom: 16,
    },
    mapPinsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      justifyContent: 'center',
    },
    mapPinBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      backgroundColor: bgCard,
      borderWidth: 1,
      borderColor: borderCol,
    },
    mapPinBadgeActive: {
      borderColor: primaryColor,
      backgroundColor: isDark ? '#23252A' : '#F1F5F9',
    },
    mapPinText: {
      fontSize: 10,
      fontWeight: '700',
      color: textCol,
    },
    gridContainer: {
      marginBottom: 16,
    },
    categorySection: {
      marginBottom: 16,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    categoryTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: textCol,
    },
    categoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      backgroundColor: isDark ? '#2A2D35' : '#E2E8F0',
    },
    categoryBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: textMuted,
    },
    seeAllText: {
      fontSize: 12,
      fontWeight: '700',
      color: isDark ? '#A5B4FC' : '#4F46E5',
    },
    spotsTwoColumnGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
    },
    spotCard: {
      width: '48.5%',
      backgroundColor: bgSubtle,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: borderCol,
      marginBottom: 6,
    },
    spotCardSelected: {
      borderColor: primaryColor,
    },
    spotImageWrap: {
      width: '100%',
      height: 110,
      position: 'relative',
    },
    spotImage: {
      width: '100%',
      height: '100%',
    },
    selectionCircle: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderWidth: 1.5,
      borderColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectionCircleActive: {
      backgroundColor: primaryColor,
      borderColor: primaryColor,
    },
    checkmarkText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '900',
    },
    spotCardInfo: {
      padding: 10,
    },
    spotCardName: {
      fontSize: 13,
      fontWeight: '800',
      color: textCol,
    },
    spotCardSubtitle: {
      fontSize: 11,
      color: textMuted,
      marginTop: 2,
    },
    spotMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6,
    },
    spotMetaLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    spotDetailsBtnBottom: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 7,
      paddingVertical: 3,
      borderRadius: 8,
      backgroundColor: isDark ? '#2A2D35' : '#F1F5F9',
      borderWidth: 1,
      borderColor: isDark ? '#3E424D' : '#E2E8F0',
    },
    spotDetailsBtnBottomText: {
      fontSize: 10,
      fontWeight: '700',
      color: isDark ? '#E2E8F0' : '#475569',
    },
    spotRating: {
      fontSize: 11,
      fontWeight: '700',
      color: '#F59E0B',
    },
    spotDuration: {
      fontSize: 10,
      color: textMuted,
      fontWeight: '600',
    },
    continueStickyBtn: {
      backgroundColor: primaryColor,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: primaryColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
      marginTop: 8,
    },
    continueStickyBtnText: {
      color: primaryText,
      fontSize: 15,
      fontWeight: '800',
    },
    stayOptionsList: {
      flexDirection: 'column',
      gap: 10,
      marginBottom: 16,
    },
    stayOptionRowCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bgSubtle,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1.5,
      borderColor: borderCol,
      gap: 14,
    },
    stayOptionRowCardActive: {
      borderColor: '#2E7D5B',
      borderWidth: 2,
      backgroundColor: isDark ? 'rgba(46, 125, 91, 0.12)' : '#F0FDF4',
    },
    stayOptionIconContainer: {
      width: 38,
      height: 38,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: 0.75,
    },
    hotelIconContainer: {
      backgroundColor: isDark ? 'rgba(168, 85, 247, 0.12)' : 'rgba(168, 85, 247, 0.08)',
    },
    airbnbIconContainer: {
      backgroundColor: isDark ? 'rgba(236, 72, 153, 0.12)' : 'rgba(236, 72, 153, 0.08)',
    },
    friendsIconContainer: {
      backgroundColor: isDark ? 'rgba(20, 184, 166, 0.12)' : 'rgba(20, 184, 166, 0.08)',
    },
    skipIconContainer: {
      backgroundColor: isDark ? '#23252A' : '#F1F5F9',
    },
    stayOptionIconText: {
      fontSize: 18,
    },
    hotelSearchContainer: {
      backgroundColor: isDark ? '#1C1D21' : '#F8FAFC',
      borderWidth: 1,
      borderColor: borderCol,
      borderRadius: 16,
      padding: 12,
      marginTop: 4,
      marginBottom: 10,
    },
    hotelSearchLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
      marginBottom: 8,
    },
    hotelSearchInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#121316' : '#FFFFFF',
      borderWidth: 1,
      borderColor: borderCol,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 10,
    },
    hotelSearchInput: {
      flex: 1,
      fontSize: 13,
      color: textCol,
      padding: 0,
    },
    assignedHotelCard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: isDark ? 'rgba(46, 125, 91, 0.15)' : '#F0FDF4',
      borderWidth: 1,
      borderColor: '#2E7D5B',
      borderRadius: 12,
      padding: 10,
      marginBottom: 8,
    },
    assignedHotelLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    assignedHotelName: {
      fontSize: 13,
      fontWeight: '700',
      color: textCol,
    },
    assignedHotelAddress: {
      fontSize: 11,
      color: textMuted,
      marginTop: 2,
    },
    assignedHotelBadge: {
      backgroundColor: '#2E7D5B',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    assignedHotelBadgeText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '700',
    },
    hotelSuggestionsList: {
      gap: 6,
    },
    hotelSuggestionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 10,
      backgroundColor: isDark ? '#17181C' : '#FFFFFF',
      borderWidth: 1,
      borderColor: borderCol,
    },
    hotelSuggestionRowActive: {
      borderColor: '#2E7D5B',
      backgroundColor: isDark ? 'rgba(46, 125, 91, 0.1)' : '#F0FDF4',
    },
    hotelSuggestionName: {
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
    },
    hotelSuggestionSub: {
      fontSize: 10,
      color: textMuted,
    },
    hotelSuggestionRating: {
      fontSize: 11,
      fontWeight: '700',
      color: '#EAB308',
      marginLeft: 6,
    },
    stayOptionRowTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: textCol,
    },
    stayOptionRowTextCol: {
      flexDirection: 'column',
      justifyContent: 'center',
    },
    stayOptionRowSub: {
      fontSize: 11,
      fontWeight: '500',
      color: textMuted,
      marginTop: 2,
    },
    stayOrDividerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 4,
    },
    stayOrDividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: borderCol,
    },
    stayOrDividerText: {
      marginHorizontal: 12,
      fontSize: 11,
      fontWeight: '700',
      color: textMuted,
      letterSpacing: 1,
    },
    stayOptionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 16,
    },
    stayOptionCard: {
      width: (SCREEN_WIDTH - 64 - 10) / 2,
      backgroundColor: bgSubtle,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1.5,
      borderColor: borderCol,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stayOptionCardActive: {
      borderColor: '#2E7D5B',
      borderWidth: 2,
      backgroundColor: isDark ? 'rgba(46, 125, 91, 0.12)' : '#F0FDF4',
    },
    stayOptionIcon: {
      fontSize: 26,
      marginBottom: 6,
    },
    stayOptionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
      textAlign: 'center',
    },
    confirmedStayCard: {
      flexDirection: 'row',
      backgroundColor: bgSubtle,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 16,
      padding: 10,
      gap: 12,
    },
    confirmedStayImg: {
      width: 70,
      height: 70,
      borderRadius: 12,
    },
    confirmedStayInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    confirmedStayHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    confirmedStayName: {
      fontSize: 14,
      fontWeight: '800',
      color: textCol,
      flex: 1,
    },
    confirmedStayBadge: {
      backgroundColor: isDark ? '#2A2D35' : '#E2E8F0',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginLeft: 6,
    },
    confirmedStayBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: textMuted,
    },
    confirmedStayAddress: {
      fontSize: 11,
      color: textMuted,
      marginTop: 2,
    },
    confirmedStayRating: {
      fontSize: 11,
      fontWeight: '700',
      color: '#F59E0B',
      marginTop: 4,
    },
    ticketCard: {
      backgroundColor: bgSubtle,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: borderCol,
      overflow: 'hidden',
      marginBottom: 16,
    },
    ticketHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
    },
    ticketEyebrow: {
      fontSize: 10,
      fontWeight: '800',
      color: primaryColor,
      letterSpacing: 0.8,
    },
    ticketDestTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: textCol,
      marginTop: 2,
    },
    ticketLogoBadge: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ticketLogoText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '900',
    },
    ticketDivider: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 20,
      backgroundColor: bgSubtle,
    },
    ticketNotchLeft: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: bgCard,
      marginLeft: -8,
      borderWidth: 1,
      borderColor: borderCol,
    },
    ticketDashedLine: {
      flex: 1,
      height: 1,
      borderWidth: 1,
      borderColor: borderCol,
      borderStyle: 'dashed',
    },
    ticketNotchRight: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: bgCard,
      marginRight: -8,
      borderWidth: 1,
      borderColor: borderCol,
    },
    ticketBody: {
      padding: 16,
      gap: 14,
    },
    ticketMetaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: borderCol,
    },
    ticketMetaLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: textMuted,
    },
    ticketMetaVal: {
      fontSize: 13,
      fontWeight: '800',
      color: textCol,
      marginTop: 2,
    },
    inviteLinkBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bgCard,
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: borderCol,
    },
    inviteLinkText: {
      flex: 1,
      fontSize: 12,
      color: textMuted,
      fontWeight: '500',
      marginRight: 8,
    },
    copyLinkBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: primaryColor,
    },
    copyLinkText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    roleSelectorRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    roleSelectorLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: textCol,
    },
    rolePillsWrap: {
      flexDirection: 'row',
      gap: 6,
    },
    rolePill: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      backgroundColor: bgCard,
      borderWidth: 1,
      borderColor: borderCol,
    },
    rolePillActive: {
      borderColor: primaryColor,
      backgroundColor: primaryColor,
    },
    rolePillText: {
      fontSize: 11,
      fontWeight: '700',
      color: textMuted,
    },
    rolePillTextActive: {
      color: primaryText,
      fontWeight: '800',
    },
    spotDetailsPill: {
      position: 'absolute',
      top: 8,
      left: 8,
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 10,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    spotDetailsPillText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    detailModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      justifyContent: 'flex-end',
    },
    detailModalContent: {
      backgroundColor: bgCard,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '85%',
      overflow: 'hidden',
    },
    detailImageContainer: {
      width: '100%',
      height: 220,
      position: 'relative',
    },
    detailImage: {
      width: '100%',
      height: '100%',
    },
    detailCloseBtn: {
      position: 'absolute',
      top: 16,
      right: 16,
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      zIndex: 10,
    },
    detailCloseText: {
      fontSize: 16,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    detailCategoryBadge: {
      position: 'absolute',
      bottom: 12,
      left: 16,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
    },
    detailCategoryText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    detailPhotoCounter: {
      position: 'absolute',
      bottom: 12,
      right: 16,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    detailPhotoCounterText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    detailThumbnailsRow: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 4,
      gap: 10,
    },
    detailThumbBtn: {
      width: 58,
      height: 42,
      borderRadius: 8,
      overflow: 'hidden',
      borderWidth: 2,
      borderColor: isDark ? '#2A2D35' : '#E2E8F0',
    },
    detailThumbBtnActive: {
      borderColor: '#0F172A',
      transform: [{ scale: 1.05 }],
    },
    detailThumbImg: {
      width: '100%',
      height: '100%',
    },
    detailBodyScroll: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
    },
    detailTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: textCol,
      letterSpacing: -0.3,
      marginBottom: 8,
    },
    detailMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14,
    },
    detailMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    detailRatingText: {
      fontSize: 13,
      fontWeight: '700',
      color: isDark ? '#FBBF24' : '#D97706',
    },
    detailDurationText: {
      fontSize: 13,
      fontWeight: '600',
      color: textMuted,
    },
    detailAddressBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: bgSubtle,
      padding: 12,
      borderRadius: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: borderCol,
    },
    detailAddressIcon: {
      fontSize: 15,
      marginRight: 8,
      marginTop: 1,
    },
    detailAddressText: {
      flex: 1,
      fontSize: 13,
      color: textCol,
      lineHeight: 18,
      fontWeight: '500',
    },
    detailDescSection: {
      marginBottom: 20,
    },
    detailDescHeader: {
      fontSize: 15,
      fontWeight: '700',
      color: textCol,
      marginBottom: 6,
    },
    detailDescText: {
      fontSize: 14,
      lineHeight: 22,
      color: textMuted,
    },
    detailFooter: {
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: borderCol,
      backgroundColor: bgCard,
    },
    detailToggleBtn: {
      backgroundColor: primaryColor,
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    detailToggleBtnSelected: {
      backgroundColor: isDark ? '#23252A' : '#E2E8F0',
      borderWidth: 1.5,
      borderColor: primaryColor,
    },
    detailToggleBtnText: {
      fontSize: 15,
      fontWeight: '800',
      color: primaryText,
    },
    detailToggleBtnTextSelected: {
      color: textCol,
    },
  });
}
