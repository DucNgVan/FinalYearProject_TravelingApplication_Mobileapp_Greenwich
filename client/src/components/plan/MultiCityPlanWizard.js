import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';

const { width, height } = Dimensions.get('window');

const CITIES = [
  { key: 'danang', name: 'Da Nang', lat: 16.0610, lng: 108.2272, zoom: 12 },
  { key: 'hoian', name: 'Hoi An', lat: 15.8771, lng: 108.3260, zoom: 13 },
  { key: 'hanoi', name: 'Hanoi', lat: 21.0285, lng: 105.8542, zoom: 12 },
  { key: 'tokyo', name: 'Tokyo', lat: 35.6595, lng: 139.7004, zoom: 12 },
  { key: 'paris', name: 'Paris', lat: 48.8584, lng: 2.2945, zoom: 12 },
  { key: 'newyork', name: 'New York', lat: 40.7580, lng: -73.9855, zoom: 12 },
];

const BUDGET_TIERS = [
  { key: 'budget', label: '🎒 Budget', desc: '~$40/day', multiplier: 1000000 },
  { key: 'standard', label: '☕ Standard', desc: '~$100/day', multiplier: 2500000 },
  { key: 'luxury', label: '👑 Luxury', desc: '~$200/day', multiplier: 5000000 },
];

export default function MultiCityPlanWizard({
  places = [],
  onCompletePlan,
  onCancel,
}) {
  const { colors: themeColors, mode } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);

  const mapboxToken =
    process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
    'pk.eyJ1Ijoibm9tYWRpeCIsImEiOiJjbTFub21hZGl4ZGVtb3Rva2VuIn0.demo_token';

  // Wizard Stages: 'setup' (1) | 'map' (2) | 'summary' (3)
  const [stage, setStage] = useState('setup');

  // Stage 1: Setup State
  const [selectedCityKeys, setSelectedCityKeys] = useState(['danang', 'hoian']);
  const [cityDurations, setCityDurations] = useState({ danang: 2, hoian: 1 });
  const [selectedBudget, setSelectedBudget] = useState('standard');

  // Stage 2: Stage-by-Stage Map State
  const [currentCityIndex, setCurrentCityIndex] = useState(0);
  const [selectedPlacesMap, setSelectedPlacesMap] = useState({}); // { [placeId]: placeObj }
  const [activePlaceId, setActivePlaceId] = useState(null);

  // Active City for current stage
  const currentCityKey = selectedCityKeys[currentCityIndex] || selectedCityKeys[0] || 'danang';
  const currentCityObj = CITIES.find((c) => c.key === currentCityKey) || CITIES[0];

  // Filter places for active city
  const currentCityPlaces = places.filter((p) => {
    if (!p.city) return true;
    const normCity = p.city.toLowerCase();
    if (currentCityKey === 'danang') return /đà nẵng|da nang/i.test(normCity);
    if (currentCityKey === 'hoian') return /hội an|hoi an/i.test(normCity);
    if (currentCityKey === 'hanoi') return /hà nội|ha noi/i.test(normCity);
    if (currentCityKey === 'tokyo') return /tokyo/i.test(normCity);
    if (currentCityKey === 'paris') return /paris/i.test(normCity);
    if (currentCityKey === 'newyork') return /new york/i.test(normCity);
    return true;
  });

  // Calculate Mapbox Multi-pin URL
  const mapStyle = mode === 'dark' ? 'dark-v11' : 'streets-v12';
  const pinMarkers = currentCityPlaces.map((p, index) => {
    const isSelected = !!selectedPlacesMap[p.id];
    const isActive = (activePlaceId || currentCityPlaces[0]?.id) === p.id;
    const color = isActive ? 'EF4444' : isSelected ? '10B981' : '3B82F6';
    const lng = Number(p.lng || currentCityObj.lng).toFixed(4);
    const lat = Number(p.lat || currentCityObj.lat).toFixed(4);
    return `pin-s-${index + 1}+${color}(${lng},${lat})`;
  });

  const pinsParam = pinMarkers.length > 0
    ? pinMarkers.join(',')
    : `pin-s-star+3B82F6(${currentCityObj.lng},${currentCityObj.lat})`;

  const mapboxImageUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${pinsParam}/auto/600x320@2x?access_token=${mapboxToken}`
    : null;

  const toggleCitySelection = (cityKey) => {
    setSelectedCityKeys((prev) => {
      if (prev.includes(cityKey)) {
        if (prev.length <= 1) return prev; // Keep at least 1
        return prev.filter((k) => k !== cityKey);
      } else {
        return [...prev, cityKey];
      }
    });
  };

  const updateDuration = (cityKey, delta) => {
    setCityDurations((prev) => {
      const current = prev[cityKey] || 1;
      const next = Math.max(1, Math.min(14, current + delta));
      return { ...prev, [cityKey]: next };
    });
  };

  const togglePlace = (place) => {
    setSelectedPlacesMap((prev) => {
      const next = { ...prev };
      if (next[place.id]) {
        delete next[place.id];
      } else {
        next[place.id] = place;
      }
      return next;
    });
  };

  const currentCitySelectedCount = currentCityPlaces.filter((p) => selectedPlacesMap[p.id]).length;
  const allSelectedPlaces = Object.values(selectedPlacesMap);
  const totalDays = selectedCityKeys.reduce((acc, k) => acc + (cityDurations[k] || 1), 0);
  const totalEstimatedCost = allSelectedPlaces.reduce((acc, p) => acc + (p.estimatedCost || 100000), 0);

  const formatVND = (amount) => {
    return (Number(amount) || 0).toLocaleString('en-US') + ' VND';
  };

  // =========================================================================
  // STAGE 1: TRIP SETUP (CITIES, DURATIONS & BUDGET)
  // =========================================================================
  if (stage === 'setup') {
    return (
      <View testID="wizard-setup-stage" style={styles.container}>
        {/* Header Bar */}
        <View style={styles.topBar}>
          {onCancel && (
            <TouchableOpacity onPress={onCancel} style={styles.backPillBtn}>
              <Text style={styles.backPillText}>✕ Close</Text>
            </TouchableOpacity>
          )}
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>STEP 1 OF 3</Text>
          </View>
        </View>

        <ScrollView
          style={styles.setupScroll}
          contentContainerStyle={styles.setupScrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Smart Multi-City Journey Planner ✨</Text>
            <Text style={styles.heroSubtitle}>
              Select your destinations, stay durations, and travel style. The interactive map will guide you stage by stage!
            </Text>
          </View>

          {/* Section 1: Choose Cities */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>1. Select your destinations</Text>
            <View style={styles.citiesGrid}>
              {CITIES.map((c) => {
                const isSelected = selectedCityKeys.includes(c.key);
                return (
                  <TouchableOpacity
                    key={c.key}
                    style={[styles.cityCard, isSelected && styles.cityCardActive]}
                    onPress={() => toggleCitySelection(c.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.cityName, isSelected && styles.cityNameActive]}>
                      {c.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkPill}>
                        <Text style={styles.checkPillText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Section 2: Duration per city */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>2. Allocate days per destination</Text>
            {selectedCityKeys.map((k) => {
              const city = CITIES.find((c) => c.key === k);
              const days = cityDurations[k] || 1;
              return (
                <View key={k} style={styles.durationRow}>
                  <Text style={styles.durationCityName}>
                    {city?.name}
                  </Text>
                  <View style={styles.counterBox}>
                    <TouchableOpacity
                      onPress={() => updateDuration(k, -1)}
                      style={styles.counterBtn}
                    >
                      <Text style={styles.counterBtnText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{days} {days === 1 ? 'day' : 'days'}</Text>
                    <TouchableOpacity
                      onPress={() => updateDuration(k, 1)}
                      style={styles.counterBtn}
                    >
                      <Text style={styles.counterBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Section 3: Budget Tier */}
          <View style={styles.cardSection}>
            <Text style={styles.sectionLabel}>3. Estimated budget tier</Text>
            <View style={styles.budgetTiersRow}>
              {BUDGET_TIERS.map((tier) => {
                const isSelected = selectedBudget === tier.key;
                return (
                  <TouchableOpacity
                    key={tier.key}
                    style={[styles.budgetCard, isSelected && styles.budgetCardActive]}
                    onPress={() => setSelectedBudget(tier.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.budgetLabel, isSelected && styles.budgetLabelActive]}>
                      {tier.label}
                    </Text>
                    <Text style={styles.budgetDesc}>{tier.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View testID="wizard-bottom-action-bar" style={styles.bottomActionBar}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryCitiesCount}>
              {selectedCityKeys.length} {selectedCityKeys.length === 1 ? 'city' : 'cities'} • {totalDays} {totalDays === 1 ? 'day' : 'days'}
            </Text>
            <Text style={styles.summaryBudgetText}>
              {BUDGET_TIERS.find((t) => t.key === selectedBudget)?.label}
            </Text>
          </View>

          <TouchableOpacity
            testID="wizard-primary-cta-btn"
            style={styles.primaryCtaBtn}
            onPress={() => {
              setCurrentCityIndex(0);
              setStage('map');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryCtaText}>Start Stage 1 →</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // =========================================================================
  // STAGE 2: STAGE-BY-STAGE INTERACTIVE MAP
  // =========================================================================
  if (stage === 'map') {
    const isLastCity = currentCityIndex >= selectedCityKeys.length - 1;

    return (
      <View testID="wizard-map-stage" style={styles.container}>
        {/* Stage Header Stepper */}
        <View style={styles.mapTopHeader}>
          <TouchableOpacity
            onPress={() => {
              if (currentCityIndex > 0) {
                setCurrentCityIndex((i) => i - 1);
              } else {
                setStage('setup');
              }
            }}
            style={styles.backPillBtn}
          >
            <Text style={styles.backPillText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.stageTitleCenter}>
            <Text style={styles.stageSubtitle}>
              Stage {currentCityIndex + 1} of {selectedCityKeys.length}
            </Text>
            <Text style={styles.stageMainCity}>
              {currentCityObj.emoji} {currentCityObj.name} ({cityDurations[currentCityKey] || 1} {cityDurations[currentCityKey] === 1 ? 'day' : 'days'})
            </Text>
          </View>

          <View style={styles.stageCounterBadge}>
            <Text style={styles.stageCounterText}>
              {currentCitySelectedCount} {currentCitySelectedCount === 1 ? 'place' : 'places'}
            </Text>
          </View>
        </View>

        {/* DOMINANT HERO MAPBOX MAP CANVAS (60% VIEWPORT) */}
        <View style={styles.dominantMapFrame}>
          {mapboxImageUrl ? (
            <Image
              source={{ uri: mapboxImageUrl }}
              style={styles.dominantMapImage}
              resizeMode="cover"
              testID="wizard-mapbox-canvas"
            />
          ) : null}

          {/* Floating Map Badge */}
          <View style={styles.mapFloatingBadge}>
            <Text style={styles.mapFloatingBadgeText}>
              🗺️ Mapbox Engine • {currentCityObj.name.toUpperCase()} ({currentCityPlaces.length} places)
            </Text>
          </View>

          {/* Floating Interactive Pin Strip Over Map */}
          <View style={styles.mapPinsOverlayStrip}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.mapPinsStripContent}
            >
              {currentCityPlaces.map((place, idx) => {
                const isSelected = !!selectedPlacesMap[place.id];
                const isActive = (activePlaceId || currentCityPlaces[0]?.id) === place.id;
                return (
                  <TouchableOpacity
                    key={place.id}
                    style={[
                      styles.mapPinChip,
                      isActive && styles.mapPinChipActive,
                      isSelected && styles.mapPinChipSelected,
                    ]}
                    onPress={() => setActivePlaceId(place.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.mapPinChipNum, isActive && styles.mapPinChipNumActive]}>
                      <Text style={styles.mapPinChipNumText}>{idx + 1}</Text>
                    </View>
                    <Text style={styles.mapPinChipName} numberOfLines={1}>
                      Stop {idx + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* BOTTOM HORIZONTAL PLACES CAROUSEL */}
        <View style={styles.carouselSection}>
          <View style={styles.carouselTitleRow}>
            <Text style={styles.carouselTitleText}>
              📍 Recommended places in {currentCityObj.name}
            </Text>
            <Text style={styles.carouselSubtitleText}>
              {currentCitySelectedCount} {currentCitySelectedCount === 1 ? 'place' : 'places'} selected for this stage
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.carouselScrollContent}
          >
            {currentCityPlaces.map((place, idx) => {
              const isSelected = !!selectedPlacesMap[place.id];
              const isActive = (activePlaceId || currentCityPlaces[0]?.id) === place.id;

              return (
                <View
                  key={place.id}
                  style={[styles.wizardPlaceCard, isActive && styles.wizardPlaceCardActive]}
                >
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setActivePlaceId(place.id)}
                    style={styles.wizardPlaceCardTouch}
                  >
                    <View style={styles.cardHeaderRow}>
                      <View style={styles.placeIndexBadge}>
                        <Text style={styles.placeIndexText}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.placeCategoryTag}>
                        {place.categoryName || place.category}
                      </Text>
                      <Text style={styles.placeRatingTag}>★ {place.rating || '4.8'}</Text>
                    </View>

                    <Text style={styles.placeTitleText} numberOfLines={1}>
                      {place.name}
                    </Text>
                    <Text style={styles.placeAddressText} numberOfLines={1}>
                      {place.address}
                    </Text>

                    {place.estimatedCost !== undefined && (
                      <Text style={styles.placeCostText}>
                        Est. Cost: {formatVND(place.estimatedCost)}
                      </Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    testID={`wizard-place-select-${place.id}`}
                    style={[styles.placePickBtn, isSelected && styles.placePickBtnSelected]}
                    onPress={() => togglePlace(place)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.placePickBtnText, isSelected && styles.placePickBtnTextSelected]}>
                      {isSelected ? '✓ Added to Journey' : '+ Add to Journey'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* BOTTOM STEPPER ACTION BAR */}
        <View style={styles.bottomActionBar}>
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryCitiesCount}>
              {currentCitySelectedCount} {currentCitySelectedCount === 1 ? 'place selected' : 'places selected'}
            </Text>
            <Text style={styles.summaryBudgetText}>
              Stage {currentCityIndex + 1}/{selectedCityKeys.length}: {currentCityObj.name}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryCtaBtn}
            onPress={() => {
              if (isLastCity) {
                setStage('summary');
              } else {
                setCurrentCityIndex((i) => i + 1);
                setActivePlaceId(null);
              }
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryCtaText}>
              {isLastCity ? 'Finish & Review Plan ✨' : 'Next Stage →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // =========================================================================
  // STAGE 3: MULTI-CITY SUMMARY & FINAL PLAN POLISH
  // =========================================================================
  return (
    <View testID="wizard-summary-stage" style={styles.container}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => {
            setCurrentCityIndex(selectedCityKeys.length - 1);
            setStage('map');
          }}
          style={styles.backPillBtn}
        >
          <Text style={styles.backPillText}>← Back to Stages</Text>
        </TouchableOpacity>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>SUMMARY</Text>
        </View>
      </View>

      <ScrollView
        style={styles.setupScroll}
        contentContainerStyle={styles.setupScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Your Custom Itinerary 🎉</Text>
          <Text style={styles.heroSubtitle}>
            Multi-city journey across {selectedCityKeys.length} destinations in {totalDays} {totalDays === 1 ? 'day' : 'days'} is ready!
          </Text>
        </View>

        {/* Itinerary Timeline per City */}
        {selectedCityKeys.map((k, cIdx) => {
          const cityObj = CITIES.find((c) => c.key === k);
          const days = cityDurations[k] || 1;
          const cityPlaces = allSelectedPlaces.filter((p) => {
            if (!p.city) return true;
            const norm = p.city.toLowerCase();
            if (k === 'danang') return /đà nẵng|da nang/i.test(norm);
            if (k === 'hoian') return /hội an|hoi an/i.test(norm);
            if (k === 'hanoi') return /hà nội|ha noi/i.test(norm);
            if (k === 'tokyo') return /tokyo/i.test(norm);
            if (k === 'paris') return /paris/i.test(norm);
            if (k === 'newyork') return /new york/i.test(norm);
            return norm.includes(cityObj?.name?.toLowerCase() || '');
          });

          return (
            <View key={k} style={styles.cardSection}>
              <View style={styles.citySummaryHeader}>
                <Text style={styles.citySummaryTitle}>
                  Stage {cIdx + 1}: {cityObj?.emoji} {cityObj?.name} ({days} {days === 1 ? 'day' : 'days'})
                </Text>
                <Text style={styles.citySummaryCount}>
                  {cityPlaces.length} {cityPlaces.length === 1 ? 'place' : 'places'}
                </Text>
              </View>

              {cityPlaces.length === 0 ? (
                <Text style={styles.emptyCityPlaceText}>
                  No places selected yet (will auto-recommend top landmarks)
                </Text>
              ) : (
                cityPlaces.map((place, pIdx) => (
                  <View key={place.id} style={styles.summaryPlaceItem}>
                    <View style={styles.summaryPlaceNum}>
                      <Text style={styles.summaryPlaceNumText}>{pIdx + 1}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.summaryPlaceName}>{place.name}</Text>
                      <Text style={styles.summaryPlaceAddress}>{place.address}</Text>
                    </View>
                    <Text style={styles.summaryPlaceCost}>
                      {formatVND(place.estimatedCost || 50000)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          );
        })}

        {/* Estimated Budget vs Selected Tier */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionLabel}>Cost Estimate & Budget</Text>
          <View style={styles.budgetCompareBox}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetMutedText}>Travel Style:</Text>
              <Text style={styles.budgetHighlightText}>
                {BUDGET_TIERS.find((t) => t.key === selectedBudget)?.label}
              </Text>
            </View>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetMutedText}>Est. Places Cost:</Text>
              <Text style={styles.budgetPriceTotal}>
                {formatVND(totalEstimatedCost)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Plan CTA */}
      <View style={styles.bottomActionBar}>
        <TouchableOpacity
          style={styles.primaryCtaBtn}
          onPress={() => {
            if (onCompletePlan) {
              const cityNames = selectedCityKeys.map(
                (k) => CITIES.find((c) => c.key === k)?.name || k
              );
              onCompletePlan({
                title: `Journey ${cityNames.join(' - ')} (${totalDays} Days)`,
                cities: cityNames,
                places: allSelectedPlaces,
                totalEstimatedCost,
                totalDays,
                budgetTier: selectedBudget,
              });
            }
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryCtaText}>Save Plan to Itinerary ✨</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const getStyles = (themeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    topBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    backPillBtn: {
      backgroundColor: themeColors.card,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    backPillText: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.primary,
    },
    stepBadge: {
      backgroundColor: 'rgba(46, 125, 91, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(46, 125, 91, 0.25)',
    },
    stepBadgeText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    setupScroll: {
      flex: 1,
    },
    setupScrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 95,
      gap: 16,
    },
    heroSection: {
      marginTop: 4,
      marginBottom: 6,
    },
    heroTitle: {
      fontSize: 20,
      fontWeight: '900',
      color: themeColors.text,
      marginBottom: 4,
    },
    heroSubtitle: {
      fontSize: 13,
      lineHeight: 18,
      color: themeColors.textMuted,
    },
    cardSection: {
      backgroundColor: themeColors.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    sectionLabel: {
      fontSize: 13,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: 10,
    },
    citiesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    cityCard: {
      width: '31%',
      backgroundColor: 'rgba(0,0,0,0.03)',
      borderRadius: 12,
      paddingVertical: 10,
      paddingHorizontal: 6,
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: 'transparent',
      position: 'relative',
    },
    cityCardActive: {
      backgroundColor: 'rgba(46, 125, 91, 0.15)',
      borderColor: '#2E7D5B',
    },
    cityEmoji: {
      fontSize: 20,
      marginBottom: 4,
    },
    cityName: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.textMuted,
      textAlign: 'center',
    },
    cityNameActive: {
      color: themeColors.primary === '#FFFFFF' ? '#FFFFFF' : '#2E7D5B',
      fontWeight: '800',
    },
    checkPill: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#2E7D5B',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkPillText: {
      color: '#FFFFFF',
      fontSize: 10,
      fontWeight: '900',
    },
    durationRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.04)',
    },
    durationCityName: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.text,
    },
    counterBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    counterBtn: {
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: themeColors.cardSurface || themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    counterBtnText: {
      fontSize: 15,
      fontWeight: '800',
      color: themeColors.text,
    },
    counterValue: {
      fontSize: 13,
      fontWeight: '800',
      color: themeColors.text,
      minWidth: 50,
      textAlign: 'center',
    },
    budgetTiersRow: {
      flexDirection: 'row',
      gap: 8,
    },
    budgetCard: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.03)',
      borderRadius: 12,
      padding: 10,
      borderWidth: 1.5,
      borderColor: 'transparent',
    },
    budgetCardActive: {
      backgroundColor: 'rgba(46, 125, 91, 0.15)',
      borderColor: '#2E7D5B',
    },
    budgetLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 2,
    },
    budgetLabelActive: {
      color: themeColors.text,
      fontWeight: '800',
    },
    budgetDesc: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    bottomActionBar: {
      position: 'absolute',
      bottom: 74,
      left: 0,
      right: 0,
      backgroundColor: themeColors.card,
      borderTopWidth: 1,
      borderTopColor: themeColors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    summaryInfo: {
      flex: 1,
      marginRight: 12,
    },
    summaryCitiesCount: {
      fontSize: 13,
      fontWeight: '800',
      color: themeColors.text,
    },
    summaryBudgetText: {
      fontSize: 11,
      color: themeColors.textMuted,
      fontWeight: '600',
    },
    primaryCtaBtn: {
      backgroundColor: themeColors.primary,
      paddingHorizontal: 18,
      paddingVertical: 11,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    primaryCtaText: {
      color: themeColors.primary === '#FFFFFF' ? '#111827' : '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },

    // Stage 2: Map Stage Styles
    mapTopHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    stageTitleCenter: {
      alignItems: 'center',
    },
    stageSubtitle: {
      fontSize: 10,
      fontWeight: '700',
      color: '#2E7D5B',
      textTransform: 'uppercase',
    },
    stageMainCity: {
      fontSize: 15,
      fontWeight: '900',
      color: themeColors.text,
    },
    stageCounterBadge: {
      backgroundColor: 'rgba(46, 125, 91, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(46, 125, 91, 0.25)',
    },
    stageCounterText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    dominantMapFrame: {
      height: Math.round(height * 0.42),
      marginHorizontal: 16,
      borderRadius: 18,
      overflow: 'hidden',
      backgroundColor: '#0F172A',
      position: 'relative',
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    dominantMapImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    mapFloatingBadge: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(15, 23, 42, 0.8)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(59, 130, 246, 0.3)',
    },
    mapFloatingBadgeText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#60A5FA',
    },
    mapPinsOverlayStrip: {
      position: 'absolute',
      bottom: 8,
      left: 0,
      right: 0,
    },
    mapPinsStripContent: {
      paddingHorizontal: 8,
      gap: 6,
    },
    mapPinChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      borderRadius: 20,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      gap: 5,
    },
    mapPinChipActive: {
      backgroundColor: '#EF4444',
      borderColor: '#FFFFFF',
      transform: [{ scale: 1.05 }],
    },
    mapPinChipSelected: {
      borderColor: '#2E7D5B',
      borderWidth: 1.5,
    },
    mapPinChipNum: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mapPinChipNumActive: {
      backgroundColor: '#FFFFFF',
    },
    mapPinChipNumText: {
      fontSize: 9,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    mapPinChipName: {
      fontSize: 11,
      fontWeight: '700',
      color: '#F8FAFC',
      maxWidth: 120,
    },
    carouselSection: {
      flex: 1,
      paddingTop: 8,
    },
    carouselTitleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 6,
    },
    carouselTitleText: {
      fontSize: 12,
      fontWeight: '800',
      color: themeColors.text,
    },
    carouselSubtitleText: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    carouselScrollContent: {
      paddingHorizontal: 16,
      paddingBottom: 85,
      gap: 10,
    },
    wizardPlaceCard: {
      width: 230,
      backgroundColor: themeColors.card,
      borderRadius: 14,
      padding: 10,
      borderWidth: 1,
      borderColor: themeColors.border,
      justifyContent: 'space-between',
    },
    wizardPlaceCardActive: {
      borderColor: '#EF4444',
      borderWidth: 2,
    },
    wizardPlaceCardTouch: {
      marginBottom: 8,
    },
    cardHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    placeIndexBadge: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeIndexText: {
      fontSize: 10,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    placeCategoryTag: {
      fontSize: 10,
      fontWeight: '700',
      color: '#3B82F6',
      flex: 1,
    },
    placeRatingTag: {
      fontSize: 10,
      fontWeight: '800',
      color: '#F59E0B',
    },
    placeTitleText: {
      fontSize: 13,
      fontWeight: '800',
      color: themeColors.text,
      marginBottom: 2,
    },
    placeAddressText: {
      fontSize: 10,
      color: themeColors.textMuted,
      marginBottom: 4,
    },
    placeCostText: {
      fontSize: 10,
      fontWeight: '700',
      color: '#2E7D5B',
    },
    placePickBtn: {
      backgroundColor: '#3B82F6',
      paddingVertical: 7,
      borderRadius: 10,
      alignItems: 'center',
    },
    placePickBtnSelected: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
    },
    placePickBtnText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    placePickBtnTextSelected: {
      color: '#EF4444',
    },

    // Stage 3: Summary Styles
    citySummaryHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    citySummaryTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: themeColors.text,
    },
    citySummaryCount: {
      fontSize: 11,
      fontWeight: '700',
      color: '#3B82F6',
    },
    emptyCityPlaceText: {
      fontSize: 11,
      fontStyle: 'italic',
      color: themeColors.textMuted,
    },
    summaryPlaceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0,0,0,0.04)',
    },
    summaryPlaceNum: {
      width: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: '#3B82F6',
      alignItems: 'center',
      justifyContent: 'center',
    },
    summaryPlaceNumText: {
      fontSize: 9,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    summaryPlaceName: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.text,
    },
    summaryPlaceAddress: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    summaryPlaceCost: {
      fontSize: 11,
      fontWeight: '700',
      color: '#2E7D5B',
    },
    budgetCompareBox: {
      gap: 6,
    },
    budgetRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    budgetMutedText: {
      fontSize: 12,
      color: themeColors.textMuted,
    },
    budgetHighlightText: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.text,
    },
    budgetPriceTotal: {
      fontSize: 15,
      fontWeight: '900',
      color: '#2E7D5B',
    },
  });
