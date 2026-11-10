import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

const CITIES = [
  { key: 'danang', name: 'Da Nang', center: '16.0610, 108.2272', lat: 16.0610, lng: 108.2272, zoom: 12, costWeight: 1.0 },
  { key: 'hoian', name: 'Hoi An', center: '15.8770, 108.3262', lat: 15.8770, lng: 108.3262, zoom: 13, costWeight: 0.9 },
  { key: 'hanoi', name: 'Hanoi', center: '21.0285, 105.8542', lat: 21.0285, lng: 105.8542, zoom: 12, costWeight: 1.0 },
  { key: 'dalat', name: 'Da Lat', center: '11.9404, 108.4583', lat: 11.9404, lng: 108.4583, zoom: 12, costWeight: 0.95 },
  { key: 'phuquoc', name: 'Phu Quoc', center: '10.2899, 103.9840', lat: 10.2899, lng: 103.9840, zoom: 12, costWeight: 1.2 },
  { key: 'tokyo', name: 'Tokyo', center: '35.6595, 139.7004', lat: 35.6595, lng: 139.7004, zoom: 12, costWeight: 1.8 },
  { key: 'paris', name: 'Paris', center: '48.8584, 2.2945', lat: 48.8584, lng: 2.2945, zoom: 12, costWeight: 2.0 },
  { key: 'newyork', name: 'New York', center: '40.7580, -73.9855', lat: 40.7580, lng: -73.9855, zoom: 12, costWeight: 2.2 },
  { key: 'bangkok', name: 'Bangkok', center: '13.7563, 100.5018', lat: 13.7563, lng: 100.5018, zoom: 12, costWeight: 1.1 },
  { key: 'singapore', name: 'Singapore', center: '1.3521, 103.8198', lat: 1.3521, lng: 103.8198, zoom: 12, costWeight: 1.9 },
  { key: 'seoul', name: 'Seoul', center: '37.5665, 126.9780', lat: 37.5665, lng: 126.9780, zoom: 12, costWeight: 1.5 },
  { key: 'london', name: 'London', center: '51.5074, -0.1278', lat: 51.5074, lng: -0.1278, zoom: 12, costWeight: 2.1 },
];

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'landmark', label: 'Attractions' },
  { key: 'beach', label: 'Beaches' },
  { key: 'food', label: 'Food & Dining' },
  { key: 'nature', label: 'Nature' },
];

const CITY_COLORS = ['#2E7D5B', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#14B8A6'];

const DEFAULT_GLOBAL_PLACES = [
  // Da Nang
  {
    id: 'dn-01',
    name: 'Dragon Bridge Da Nang',
    city: 'Da Nang',
    lat: 16.061,
    lng: 108.2272,
    category: 'landmark',
    categoryName: 'Landmarks & Icons',
    rating: 4.8,
    address: 'Nguyen Van Linh, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=500&q=80',
  },
  {
    id: 'dn-02',
    name: 'My Khe Beach',
    city: 'Da Nang',
    lat: 16.0595,
    lng: 108.2464,
    category: 'beach',
    categoryName: 'Beach & Resort',
    rating: 4.7,
    address: 'Vo Nguyen Giap, Son Tra, Da Nang',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80',
  },
  {
    id: 'dn-03',
    name: 'Ba Duong Local Pancakes',
    city: 'Da Nang',
    lat: 16.0592,
    lng: 108.214,
    category: 'food',
    categoryName: 'Local Dining',
    rating: 4.6,
    address: 'K280/23 Hoang Dieu, Hai Chau, Da Nang',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&q=80',
  },
  // Hoi An
  {
    id: 'ha-01',
    name: 'Japanese Covered Bridge',
    city: 'Hoi An',
    lat: 15.8771,
    lng: 108.326,
    category: 'landmark',
    categoryName: 'Ancient Heritage',
    rating: 4.9,
    address: 'Nguyen Thi Minh Khai, Hoi An Ancient Town',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=500&q=80',
  },
  {
    id: 'ha-02',
    name: 'Banh Mi Phuong Hoi An',
    city: 'Hoi An',
    lat: 15.8795,
    lng: 108.332,
    category: 'food',
    categoryName: 'Famous Street Food',
    rating: 4.7,
    address: '2B Phan Chau Trinh, Cam Chau, Hoi An',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&q=80',
  },
  // Hanoi
  {
    id: 'hn-01',
    name: 'Sword Lake & Turtle Tower',
    city: 'Hanoi',
    lat: 21.0285,
    lng: 105.8542,
    category: 'landmark',
    categoryName: 'Historical Heritage',
    rating: 4.8,
    address: 'Hang Trong, Hoan Kiem, Hanoi',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&q=80',
  },
  // Tokyo
  {
    id: 'tky-01',
    name: 'Shibuya Crossing & Hachiko',
    city: 'Tokyo',
    lat: 35.6595,
    lng: 139.7004,
    category: 'landmark',
    categoryName: 'Tokyo Landmark',
    rating: 4.8,
    address: 'Shibuya, Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500&q=80',
  },
  // Paris
  {
    id: 'prs-01',
    name: 'Eiffel Tower',
    city: 'Paris',
    lat: 48.8584,
    lng: 2.2945,
    category: 'landmark',
    categoryName: 'World Wonder',
    rating: 4.9,
    address: 'Champ de Mars, 5 Av. Anatole France, Paris, France',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=500&q=80',
  },
  // Bangkok
  {
    id: 'bkk-01',
    name: 'Grand Palace Bangkok',
    city: 'Bangkok',
    lat: 13.7500,
    lng: 100.4913,
    category: 'landmark',
    categoryName: 'Royal Palace',
    rating: 4.9,
    address: 'Na Phra Lan Rd, Bangkok, Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=500&q=80',
  },
];

export default function PlanMapDiscovery({
  places = [],
  selectedPlaceIds = null,
  onTogglePlace = null,
  onGenerateAiPlan = null,
}) {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);

  const mapboxToken =
    process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
    'pk.eyJ1Ijoibm9tYWRpeCIsImEiOiJjbTFub21hZGl4ZGVtb3Rva2VuIn0.demo_token';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [journeyCities, setJourneyCities] = useState([
    CITIES[0], // Da Nang
    CITIES[1], // Hoi An
    CITIES[5], // Tokyo
  ]);
  const [selectedCity, setSelectedCity] = useState('danang');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [internalSelected, setInternalSelected] = useState(new Set());
  const [activePlaceId, setActivePlaceId] = useState(null);

  // Duration & Budget State
  const [cityDurations, setCityDurations] = useState({
    danang: 3,
    hoian: 2,
    tokyo: 3,
  });
  const [totalBudget, setTotalBudget] = useState(25000000);
  const [budgetTier, setBudgetTier] = useState('standard'); // 'economy' | 'standard' | 'luxury'

  const activeCityObj =
    CITIES.find((c) => c.key === selectedCity) ||
    journeyCities.find((c) => c.key === selectedCity) ||
    CITIES[0];

  const mapStyle = themeColors.card === '#1E293B' ? 'dark-v11' : 'streets-v12';

  const effectiveSelectedIds = React.useMemo(() => {
    if (selectedPlaceIds instanceof Set) return selectedPlaceIds;
    if (Array.isArray(selectedPlaceIds)) return new Set(selectedPlaceIds);
    return internalSelected;
  }, [selectedPlaceIds, internalSelected]);

  const handleToggle = (placeId) => {
    if (onTogglePlace) {
      onTogglePlace(placeId);
    }
    setInternalSelected((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  };

  const handleAddCityToJourney = (cityObj) => {
    if (!journeyCities.some((c) => c.key === cityObj.key)) {
      setJourneyCities((prev) => [...prev, cityObj]);
      setCityDurations((prev) => ({ ...prev, [cityObj.key]: prev[cityObj.key] || 2 }));
    }
    setSelectedCity(cityObj.key);
    setActivePlaceId(null);
    setShowCityPicker(false);
  };

  const handleRemoveCity = (cityKey) => {
    const nextCities = journeyCities.filter((c) => c.key !== cityKey);
    setJourneyCities(nextCities);
    if (selectedCity === cityKey) {
      setSelectedCity(nextCities[0]?.key || 'danang');
    }
  };

  const updateCityDuration = (cityKey, delta) => {
    setCityDurations((prev) => {
      const current = prev[cityKey] || 2;
      const nextVal = Math.max(1, Math.min(14, current + delta));
      return { ...prev, [cityKey]: nextVal };
    });
  };

  const handleSelectBudgetTier = (tier, amount) => {
    setBudgetTier(tier);
    setTotalBudget(amount);
  };

  const totalTripDays = journeyCities.reduce((sum, c) => sum + (cityDurations[c.key] || 2), 0);

  // Compute AI smart budget distribution across cities
  const budgetBreakdown = React.useMemo(() => {
    const totalWeightedDays = journeyCities.reduce((sum, c) => {
      const days = cityDurations[c.key] || 2;
      const weight = c.costWeight || 1.0;
      return sum + days * weight;
    }, 0);

    const breakdown = {};
    journeyCities.forEach((c) => {
      const days = cityDurations[c.key] || 2;
      const weight = c.costWeight || 1.0;
      const ratio = totalWeightedDays > 0 ? (days * weight) / totalWeightedDays : 1 / Math.max(1, journeyCities.length);
      breakdown[c.key] = Math.round((totalBudget * ratio) / 100000) * 100000;
    });
    return breakdown;
  }, [journeyCities, cityDurations, totalBudget]);

  const placesList = places && places.length > 0 ? places : DEFAULT_GLOBAL_PLACES;

  const matchesCity = (p, cityKey) => {
    if (!cityKey || !p.city) return true;
    const lowerCity = p.city.toLowerCase();
    if (cityKey === 'danang') return /đà nẵng|da nang/i.test(p.city);
    if (cityKey === 'hoian') return /hội an|hoi an/i.test(p.city);
    if (cityKey === 'hanoi') return /hà nội|ha noi/i.test(p.city);
    if (cityKey === 'dalat') return /đà lạt|da lat/i.test(p.city);
    if (cityKey === 'phuquoc') return /phú quốc|phu quoc/i.test(p.city);
    if (cityKey === 'tokyo') return /tokyo/i.test(p.city);
    if (cityKey === 'paris') return /paris/i.test(p.city);
    if (cityKey === 'newyork') return /new york/i.test(p.city);
    if (cityKey === 'bangkok') return /bangkok/i.test(p.city);
    if (cityKey === 'singapore') return /singapore/i.test(p.city);
    if (cityKey === 'seoul') return /seoul/i.test(p.city);
    if (cityKey === 'london') return /london/i.test(p.city);
    return lowerCity.includes(cityKey.toLowerCase());
  };

  const filteredPlaces = placesList.filter((p) => {
    const matchCategory =
      activeCategory === 'all' ||
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());

    const matchSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      (p.address && p.address.toLowerCase().includes(searchQuery.toLowerCase().trim()));

    const matchCity = matchesCity(p, selectedCity);

    return matchCategory && matchSearch && matchCity;
  });

  // Compile multi-pin markers for Mapbox Static API
  const pinMarkers = filteredPlaces.map((p, index) => {
    const pinNumber = (index + 1).toString();
    const isSelected = effectiveSelectedIds.has(p.id);
    const isActive = (activePlaceId || filteredPlaces[0]?.id) === p.id;
    const pinColor = isSelected ? '10B981' : isActive ? '2E7D5B' : '3B82F6';
    const lng = Number(p.lng || activeCityObj.lng).toFixed(4);
    const lat = Number(p.lat || activeCityObj.lat).toFixed(4);
    return `pin-s-${pinNumber}+${pinColor}(${lng},${lat})`;
  });

  const pinsParam =
    pinMarkers.length > 0
      ? pinMarkers.join(',')
      : `pin-s-star+2E7D5B(${activeCityObj.lng},${activeCityObj.lat})`;

  // Expanded dominant map canvas
  const mapHeight = 260;
  const mapboxImageUrl = mapboxToken
    ? `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/${pinsParam}/auto/${Math.min(600, Math.round(width - 32))}x${mapHeight}@2x?access_token=${mapboxToken}`
    : null;

  const handleAiPlanPress = () => {
    const selectedList = placesList.filter((p) => effectiveSelectedIds.has(p.id));
    if (onGenerateAiPlan) {
      onGenerateAiPlan(selectedList, {
        cities: journeyCities,
        durations: cityDurations,
        totalBudget,
        budgetBreakdown,
      });
    }
  };

  const formatVND = (num) => {
    return (Number(num) || 0).toLocaleString('en-US') + ' ₫';
  };

  return (
    <View style={styles.rootWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Global Destination Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="e.g. Ba Na Hills, Eiffel Tower, Cafe..."
          placeholderTextColor={themeColors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. Interactive Dynamic Journey Route Bar */}
      <View testID="journey-route-bar" style={styles.journeyRouteBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.journeyRouteScrollContent}
        >
          {journeyCities.map((city, idx) => {
            const isCurrentActive = selectedCity === city.key;
            const placesInCity = placesList.filter(
              (p) => matchesCity(p, city.key) && effectiveSelectedIds.has(p.id)
            ).length;

            return (
              <React.Fragment key={city.key}>
                {idx > 0 && <Text style={styles.journeyRouteArrow}>→</Text>}
                <TouchableOpacity
                  testID={`journey-city-${city.key}`}
                  style={[styles.journeyCityChip, isCurrentActive && styles.journeyCityChipActive]}
                  onPress={() => {
                    setSelectedCity(city.key);
                    setActivePlaceId(null);
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.journeyCityStepText,
                      isCurrentActive && styles.journeyCityStepTextActive,
                    ]}
                  >
                    {idx + 1}.
                  </Text>
                  <Text
                    style={[
                      styles.journeyCityText,
                      isCurrentActive && styles.journeyCityTextActive,
                    ]}
                  >
                    {city.name}
                  </Text>
                  {placesInCity > 0 && (
                    <View
                      style={[
                        styles.journeyCityCountBadge,
                        isCurrentActive && styles.journeyCityCountBadgeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.journeyCityCountText,
                          isCurrentActive && styles.journeyCityCountTextActive,
                        ]}
                      >
                        {placesInCity}
                      </Text>
                    </View>
                  )}
                  {/* Remove city button */}
                  <TouchableOpacity
                    testID={`journey-remove-city-${city.key}`}
                    style={styles.journeyCityRemoveBtn}
                    onPress={(e) => {
                      e?.stopPropagation?.();
                      handleRemoveCity(city.key);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text
                      style={[
                        styles.journeyCityRemoveText,
                        isCurrentActive && styles.journeyCityRemoveTextActive,
                      ]}
                    >
                      ✕
                    </Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </React.Fragment>
            );
          })}

          <TouchableOpacity
            testID="journey-add-city-btn"
            style={styles.journeyAddCityBtn}
            onPress={() => setShowCityPicker(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.journeyAddCityText}>+ Add City</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* 4. Large Immersive Map Canvas Frame (Clean - No Glitchy Stop Pills) */}
      <View style={styles.mapCanvasFrame}>
        {mapboxImageUrl ? (
          <Image
            source={{ uri: mapboxImageUrl }}
            style={styles.mapCanvasImage}
            resizeMode="cover"
            testID="mapbox-canvas-image"
          />
        ) : null}
        <View style={styles.mapCityBadge}>
          <Text style={styles.mapCityBadgeText}>📍 {activeCityObj.name}</Text>
        </View>
      </View>

      {/* 5. Recommended Places Section */}
      <View testID="places-horizontal-carousel" style={styles.carouselContainer}>
        <View style={styles.carouselHeaderRow}>
          <Text style={styles.carouselSectionTitle}>
            📍 Recommended Places ({filteredPlaces.length})
          </Text>
          <Text style={styles.carouselSubtitle}>Tap to preview & pick</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselScrollContent}
        >
          {filteredPlaces.map((place, index) => {
            const isSelected = effectiveSelectedIds.has(place.id);
            const isActive = (activePlaceId || filteredPlaces[0]?.id) === place.id;
            return (
              <View
                key={place.id}
                testID={`carousel-place-card-${place.id}`}
                style={[
                  styles.carouselCard,
                  isSelected && styles.carouselCardSelected,
                  isActive && styles.carouselCardActive,
                ]}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() => setActivePlaceId(place.id)}
                  style={styles.carouselCardTouch}
                >
                  {place.image ? (
                    <Image source={{ uri: place.image }} style={styles.carouselImage} />
                  ) : (
                    <View style={styles.carouselImagePlaceholder}>
                      <Text style={{ fontSize: 24 }}>📍</Text>
                    </View>
                  )}
                  <View style={styles.carouselIndexBadge}>
                    <Text style={styles.carouselIndexText}>{index + 1}</Text>
                  </View>
                  <View style={styles.carouselInfo}>
                    <View style={styles.placeHeaderRow}>
                      <Text style={styles.placeCategory}>
                        {place.categoryName || place.category || 'Attraction'}
                      </Text>
                      <Text style={styles.placeRating}>★ {place.rating || '4.8'}</Text>
                    </View>
                    <Text style={styles.carouselPlaceName} numberOfLines={1}>
                      {place.name}
                    </Text>
                    <Text style={styles.carouselPlaceAddress} numberOfLines={1}>
                      {place.address}
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  testID={`place-select-btn-${place.id}`}
                  style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                  onPress={() => handleToggle(place.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.selectButtonText,
                      isSelected && styles.selectButtonTextActive,
                    ]}
                  >
                    {isSelected ? '✓ Selected' : '+ Select'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Category Filter Tabs (Positioned Below Recommended Places) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryChipsScroll}
        contentContainerStyle={styles.categoryChipsContainer}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
              onPress={() => setActiveCategory(cat.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isSelected && styles.categoryChipTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 6. Stay Duration Configuration Panel */}
      <View testID="trip-duration-config-panel" style={styles.configSection}>
        <View style={styles.configHeaderRow}>
          <Text style={styles.configSectionTitle}>Stay Duration</Text>
          <Text style={styles.configTotalDaysText}>
            Total: {totalTripDays} days ({Math.max(1, totalTripDays - 1)} nights)
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.durationScrollContent}
        >
          {journeyCities.map((city) => {
            const days = cityDurations[city.key] || 2;
            return (
              <View key={city.key} style={styles.durationCard}>
                <Text style={styles.durationCityName} numberOfLines={1}>
                  {city.name}
                </Text>
                <View style={styles.stepperRow}>
                  <TouchableOpacity
                    testID={`city-duration-dec-${city.key}`}
                    style={styles.stepperBtn}
                    onPress={() => updateCityDuration(city.key, -1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepperBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperValueText}>{days}d</Text>
                  <TouchableOpacity
                    testID={`city-duration-inc-${city.key}`}
                    style={styles.stepperBtn}
                    onPress={() => updateCityDuration(city.key, 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* 7. Total Trip Budget & AI Smart Allocation Panel */}
      <View testID="trip-budget-config-panel" style={styles.configSection}>
        <View style={styles.configHeaderRow}>
          <Text style={styles.configSectionTitle}>Travel Budget per Person</Text>
          <Text style={styles.configBudgetValueText}>{formatVND(totalBudget)}</Text>
        </View>
        <View style={styles.budgetTiersRow}>
          <TouchableOpacity
            testID="budget-tier-economy"
            style={[styles.budgetTierBtn, budgetTier === 'economy' && styles.budgetTierBtnActive]}
            onPress={() => handleSelectBudgetTier('economy', 10000000)}
            activeOpacity={0.8}
          >
            <Text style={[styles.budgetTierText, budgetTier === 'economy' && styles.budgetTierTextActive]}>
              Economy
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="budget-tier-standard"
            style={[styles.budgetTierBtn, budgetTier === 'standard' && styles.budgetTierBtnActive]}
            onPress={() => handleSelectBudgetTier('standard', 25000000)}
            activeOpacity={0.8}
          >
            <Text style={[styles.budgetTierText, budgetTier === 'standard' && styles.budgetTierTextActive]}>
              Standard
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID="budget-tier-luxury"
            style={[styles.budgetTierBtn, budgetTier === 'luxury' && styles.budgetTierBtnActive]}
            onPress={() => handleSelectBudgetTier('luxury', 50000000)}
            activeOpacity={0.8}
          >
            <Text style={[styles.budgetTierText, budgetTier === 'luxury' && styles.budgetTierTextActive]}>
              Luxury
            </Text>
          </TouchableOpacity>
        </View>

        {/* AI Smart Budget Allocation Breakdown */}
        <View testID="ai-budget-allocation-breakdown" style={styles.aiBudgetBreakdownCard}>
          <View style={styles.aiBreakdownHeader}>
            <Text style={styles.aiBreakdownTitle}>AI Budget Distribution</Text>
            <Text style={styles.aiBreakdownSub}>Calculated based on local living costs</Text>
          </View>

          {/* Proportional Segmented Progress Bar */}
          <View testID="ai-budget-distribution-bar" style={styles.distributionBar}>
            {journeyCities.map((city, idx) => {
              const allocated = budgetBreakdown[city.key] || Math.round(totalBudget / Math.max(1, journeyCities.length));
              const ratio = totalBudget > 0 ? allocated / totalBudget : 1 / Math.max(1, journeyCities.length);
              return (
                <View
                  key={`bar-${city.key}`}
                  style={[
                    styles.distributionBarSegment,
                    {
                      flex: Math.max(0.08, ratio),
                      backgroundColor: CITY_COLORS[idx % CITY_COLORS.length],
                    },
                  ]}
                />
              );
            })}
          </View>

          <View style={styles.aiBreakdownList}>
            {journeyCities.map((city, idx) => {
              const allocated = budgetBreakdown[city.key] || Math.round(totalBudget / Math.max(1, journeyCities.length));
              const percent = totalBudget > 0 ? Math.round((allocated / totalBudget) * 100) : 0;
              const dotColor = CITY_COLORS[idx % CITY_COLORS.length];
              return (
                <View key={city.key} style={styles.aiBreakdownRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[styles.cityDot, { backgroundColor: dotColor }]} />
                    <Text style={styles.aiBreakdownCity}>
                      {city.name} ({cityDurations[city.key] || 2}d)
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={styles.aiBreakdownPercent}>{percent}%</Text>
                    <Text style={styles.aiBreakdownAmount}>{formatVND(allocated)}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

        {/* 8. AI Planning Action Button (Inline below info panels) */}
        <View testID="map-bottom-bar" style={styles.inlineActionContainer}>
          <TouchableOpacity
            testID="ai-plan-generate-btn"
            style={styles.aiGenerateBtn}
            onPress={handleAiPlanPress}
            activeOpacity={0.85}
          >
            <Text style={styles.aiGenerateBtnText}>
              ✨ AI Itinerary Planning{effectiveSelectedIds.size > 0 ? ` (${effectiveSelectedIds.size} selected)` : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 9. City Picker Modal */}
      <Modal
        visible={showCityPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Destination to Journey</Text>
              <TouchableOpacity onPress={() => setShowCityPicker(false)} style={styles.modalCloseBtn}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {CITIES.map((c) => {
                const isAdded = journeyCities.some((jc) => jc.key === c.key);
                return (
                  <TouchableOpacity
                    key={c.key}
                    testID={`city-picker-option-${c.key}`}
                    style={[styles.cityPickerOption, isAdded && styles.cityPickerOptionAdded]}
                    onPress={() => handleAddCityToJourney(c)}
                    activeOpacity={0.8}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cityPickerOptionName}>{c.name}</Text>
                      <Text style={styles.cityPickerOptionSub}>
                        {isAdded ? 'Already in your route' : 'Tap to add to route'}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.cityPickerOptionAction,
                        isAdded && styles.cityPickerOptionActionAdded,
                      ]}
                    >
                      {isAdded ? '✓ Added' : '+ Add'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = (themeColors) =>
  StyleSheet.create({
    rootWrapper: {
      flex: 1,
      position: 'relative',
      backgroundColor: themeColors.background,
    },
    container: {
      flex: 1,
      backgroundColor: themeColors.background,
    },
    scrollContent: {
      paddingBottom: 130,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: themeColors.card,
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 6,
      borderRadius: 14,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
      height: 42,
    },
    searchIcon: {
      fontSize: 14,
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 13,
      color: themeColors.text,
      paddingVertical: 0,
    },
    clearBtn: {
      padding: 4,
    },
    clearBtnText: {
      color: themeColors.textMuted,
      fontSize: 14,
    },
    journeyRouteBar: {
      flexGrow: 0,
      height: 38,
      marginBottom: 4,
    },
    journeyRouteScrollContent: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 6,
    },
    journeyRouteArrow: {
      fontSize: 12,
      color: themeColors.textMuted,
      fontWeight: '700',
    },
    journeyCityChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 99,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      minHeight: 32,
      gap: 5,
    },
    journeyCityChipActive: {
      backgroundColor: '#2E7D5B',
      borderColor: '#2E7D5B',
    },
    journeyCityStepText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    journeyCityStepTextActive: {
      color: '#FFFFFF',
    },
    journeyCityText: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.text,
      includeFontPadding: false,
    },
    journeyCityTextActive: {
      color: '#FFFFFF',
      fontWeight: '800',
    },
    journeyCityCountBadge: {
      backgroundColor: 'rgba(46, 125, 91, 0.2)',
      borderRadius: 99,
      paddingHorizontal: 6,
      paddingVertical: 1,
    },
    journeyCityCountBadgeActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
    journeyCityCountText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    journeyCityCountTextActive: {
      color: '#FFFFFF',
    },
    journeyCityRemoveBtn: {
      marginLeft: 2,
      padding: 2,
    },
    journeyCityRemoveText: {
      fontSize: 10,
      fontWeight: '800',
      color: themeColors.textMuted,
    },
    journeyCityRemoveTextActive: {
      color: '#FFFFFF',
    },
    journeyAddCityBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 99,
      borderWidth: 1,
      borderColor: '#2E7D5B',
      borderStyle: 'dashed',
      backgroundColor: 'rgba(46, 125, 91, 0.08)',
      minHeight: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    journeyAddCityText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    categoryChipsScroll: {
      flexGrow: 0,
      height: 36,
      marginBottom: 6,
    },
    categoryChipsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      gap: 6,
    },
    categoryChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 99,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      minHeight: 30,
    },
    categoryChipActive: {
      backgroundColor: themeColors.primary,
      borderColor: themeColors.primary,
    },
    categoryIcon: {
      fontSize: 11,
    },
    categoryChipText: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
      includeFontPadding: false,
    },
    categoryChipTextActive: {
      color: themeColors.primary === '#FFFFFF' ? '#111827' : '#FFFFFF',
      fontWeight: '800',
    },
    mapCanvasFrame: {
      height: 260,
      marginHorizontal: 16,
      marginBottom: 10,
      borderRadius: 18,
      backgroundColor: '#0F172A',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: themeColors.border,
      position: 'relative',
    },
    mapCanvasImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
    },
    mapCityBadge: {
      position: 'absolute',
      top: 10,
      left: 10,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    mapCityBadgeText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    carouselContainer: {
      marginBottom: 12,
    },
    carouselHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      marginBottom: 6,
    },
    carouselSectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: themeColors.text,
    },
    carouselSubtitle: {
      fontSize: 10,
      color: themeColors.textMuted,
    },
    carouselScrollContent: {
      paddingHorizontal: 16,
      gap: 10,
    },
    carouselCard: {
      width: 190,
      height: 168,
      backgroundColor: themeColors.card,
      borderRadius: 14,
      padding: 8,
      borderWidth: 1,
      borderColor: themeColors.border,
      justifyContent: 'space-between',
    },
    carouselCardSelected: {
      borderColor: '#2E7D5B',
      borderWidth: 2,
    },
    carouselCardActive: {
      borderColor: '#2E7D5B',
      borderWidth: 2,
    },
    carouselCardTouch: {
      flex: 1,
    },
    carouselImage: {
      width: '100%',
      height: 72,
      borderRadius: 9,
      marginBottom: 4,
    },
    carouselImagePlaceholder: {
      width: '100%',
      height: 72,
      borderRadius: 9,
      backgroundColor: 'rgba(0,0,0,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    carouselIndexBadge: {
      position: 'absolute',
      top: 4,
      left: 4,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: 'rgba(15, 23, 42, 0.85)',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#FFFFFF',
    },
    carouselIndexText: {
      fontSize: 10,
      fontWeight: '900',
      color: '#FFFFFF',
    },
    carouselInfo: {
      flex: 1,
    },
    placeHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 1,
    },
    placeCategory: {
      fontSize: 9,
      fontWeight: '700',
      color: '#2E7D5B',
      textTransform: 'uppercase',
    },
    placeRating: {
      fontSize: 10,
      fontWeight: '700',
      color: '#F59E0B',
    },
    carouselPlaceName: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 1,
    },
    carouselPlaceAddress: {
      fontSize: 9,
      color: themeColors.textMuted,
    },
    selectButton: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: themeColors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    selectButtonActive: {
      backgroundColor: 'rgba(46, 125, 91, 0.15)',
      borderWidth: 1,
      borderColor: '#2E7D5B',
    },
    selectButtonText: {
      fontSize: 10,
      fontWeight: '800',
      color: themeColors.primary === '#FFFFFF' ? '#111827' : '#FFFFFF',
    },
    selectButtonTextActive: {
      color: '#2E7D5B',
    },
    configSection: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: themeColors.card,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    configHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    configSectionTitle: {
      fontSize: 12,
      fontWeight: '800',
      color: themeColors.text,
    },
    configTotalDaysText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#2E7D5B',
    },
    configBudgetValueText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    durationScrollContent: {
      gap: 8,
      paddingVertical: 2,
    },
    durationCard: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: themeColors.cardSurface || themeColors.background,
      borderWidth: 1,
      borderColor: themeColors.border,
      minWidth: 110,
      alignItems: 'center',
    },
    durationCityName: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.text,
      marginBottom: 6,
    },
    stepperRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    stepperBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: themeColors.card,
      borderWidth: 1,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepperBtnText: {
      fontSize: 14,
      fontWeight: '800',
      color: themeColors.text,
    },
    stepperValueText: {
      fontSize: 12,
      fontWeight: '800',
      color: themeColors.text,
    },
    budgetTiersRow: {
      flexDirection: 'row',
      gap: 6,
      marginBottom: 8,
    },
    budgetTierBtn: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 10,
      backgroundColor: themeColors.cardSurface || themeColors.background,
      borderWidth: 1,
      borderColor: themeColors.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    budgetTierBtnActive: {
      backgroundColor: '#2E7D5B',
      borderColor: '#2E7D5B',
    },
    budgetTierText: {
      fontSize: 10,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    budgetTierTextActive: {
      color: '#FFFFFF',
      fontWeight: '800',
    },
    aiBudgetBreakdownCard: {
      marginTop: 4,
      padding: 10,
      borderRadius: 12,
      backgroundColor: themeColors.cardSurface || themeColors.background,
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    aiBreakdownHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    aiBreakdownTitle: {
      fontSize: 11,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    aiBreakdownSub: {
      fontSize: 9,
      color: themeColors.textMuted,
    },
    distributionBar: {
      flexDirection: 'row',
      height: 8,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: 10,
      backgroundColor: themeColors.border,
    },
    distributionBarSegment: {
      height: '100%',
    },
    cityDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    aiBreakdownPercent: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    aiBreakdownList: {
      gap: 6,
    },
    aiBreakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    aiBreakdownCity: {
      fontSize: 11,
      color: themeColors.text,
      fontWeight: '600',
    },
    aiBreakdownAmount: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.text,
    },
    inlineActionContainer: {
      marginTop: 20,
      marginBottom: 32,
      marginHorizontal: 16,
    },
    bottomBar: {
      marginTop: 20,
      marginBottom: 32,
      marginHorizontal: 16,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    counterBadgeContainer: {
      display: 'none',
    },
    counterBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.text || '#0F172A',
    },
    aiGenerateBtn: {
      backgroundColor: '#0F172A',
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 3,
    },
    aiGenerateBtnDisabled: {
      backgroundColor: '#0F172A',
      shadowOpacity: 0.15,
      elevation: 2,
    },
    aiGenerateBtnText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    aiGenerateBtnTextDisabled: {
      color: '#FFFFFF',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: themeColors.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 40,
      maxHeight: '70%',
      borderWidth: 1,
      borderColor: themeColors.border,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: themeColors.text,
    },
    modalCloseBtn: {
      padding: 6,
    },
    modalCloseText: {
      fontSize: 16,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    modalScroll: {
      maxHeight: 380,
    },
    cityPickerOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: themeColors.border,
      marginBottom: 8,
      backgroundColor: themeColors.card,
    },
    cityPickerOptionAdded: {
      backgroundColor: 'rgba(46, 125, 91, 0.08)',
      borderColor: '#2E7D5B',
    },
    cityPickerOptionFlag: {
      fontSize: 22,
    },
    cityPickerOptionName: {
      fontSize: 14,
      fontWeight: '700',
      color: themeColors.text,
    },
    cityPickerOptionSub: {
      fontSize: 11,
      color: themeColors.textMuted,
      marginTop: 1,
    },
    cityPickerOptionAction: {
      fontSize: 12,
      fontWeight: '800',
      color: '#2E7D5B',
    },
    cityPickerOptionActionAdded: {
      color: '#2E7D5B',
    },
  });
