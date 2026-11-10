import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import LucideIcon from '../common/LucideIcon';
import CalendarPickerModal from '../common/CalendarPickerModal';
import { colors } from '../../theme/colors';

const { height } = Dimensions.get('window');

const POPULAR_CITIES = [
  { id: 'paris', name: 'Paris', country: 'France', fullName: 'Paris, France' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', fullName: 'Tokyo, Japan' },
  { id: 'newyork', name: 'New York', country: 'USA', fullName: 'New York, USA' },
  { id: 'london', name: 'London', country: 'UK', fullName: 'London, UK' },
  { id: 'rome', name: 'Rome', country: 'Italy', fullName: 'Rome, Italy' },
  { id: 'danang', name: 'Da Nang', country: 'Vietnam', fullName: 'Da Nang, Vietnam' },
  { id: 'hoian', name: 'Hoi An', country: 'Vietnam', fullName: 'Hoi An, Vietnam' },
  { id: 'hanoi', name: 'Hanoi', country: 'Vietnam', fullName: 'Hanoi, Vietnam' },
];

const INTERESTS = [
  { id: 'history', label: 'History', icon: 'landmark' },
  { id: 'nature', label: 'Nature', icon: 'tree' },
  { id: 'architecture', label: 'Architecture', icon: 'building' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping-bag' },
  { id: 'art', label: 'Art', icon: 'palette' },
  { id: 'beaches', label: 'Beaches', icon: 'umbrella' },
  { id: 'adventure', label: 'Adventure', icon: 'compass' },
  { id: 'local-culture', label: 'Local Culture', icon: 'users' },
];

export default function NewTripModal({ visible, onClose, onCreateTrip }) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';

  const [selectedCity, setSelectedCity] = useState(null);
  const [citySheetVisible, setCitySheetVisible] = useState(false);
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [cityFilterTab, setCityFilterTab] = useState('popular'); // 'recent' | 'popular'

  const [daysCount, setDaysCount] = useState('5');
  const [startDate, setStartDate] = useState('');
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [scheduleFrom, setScheduleFrom] = useState('09:00');
  const [scheduleTo, setScheduleTo] = useState('18:00');

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [stayAddress, setStayAddress] = useState('');
  const [errorBanner, setErrorBanner] = useState('');

  const toggleInterest = (label) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const handleSelectCity = (cityObj) => {
    setSelectedCity(cityObj);
    setCitySheetVisible(false);
    setErrorBanner('');
  };

  const filteredCities = POPULAR_CITIES.filter((c) =>
    c.fullName.toLowerCase().includes(citySearchQuery.trim().toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedCity) {
      setErrorBanner('Please select destination city');
      return;
    }
    const days = parseInt(daysCount, 10) || 3;
    const start = startDate || new Date().toISOString().split('T')[0];
    const endObj = new Date(start);
    endObj.setDate(endObj.getDate() + Math.max(0, days - 1));
    const end = endObj.toISOString().split('T')[0];

    const payload = {
      city: selectedCity.name,
      country: selectedCity.country,
      title: selectedCity.name,
      destination: selectedCity.fullName,
      destinationCity: selectedCity.name,
      days,
      daysCount: days,
      startDate: start,
      endDate: end,
      schedule: {
        from: scheduleFrom || '09:00',
        to: scheduleTo || '18:00',
      },
      interests: selectedInterests,
      stayAddress: stayAddress.trim(),
      status: 'Draft',
    };

    onCreateTrip?.(payload);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#121316' : '#F8FAFC' },
        ]}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity
            testID="newtrip-back-btn"
            style={[
              styles.backBtn,
              { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF' },
            ]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <LucideIcon
              name="arrow-left"
              size={20}
              color={isDark ? '#FFFFFF' : '#0F172A'}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.screenTitle,
              { color: isDark ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            New Trip
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Destination Selector */}
          <Text style={[styles.fieldLabel, { color: themeColors.textMuted }]}>
            WHERE TO?
          </Text>
          <TouchableOpacity
            testID="newtrip-destination-picker"
            style={[
              styles.pickerCard,
              {
                backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                borderColor: isDark ? '#2A2D35' : '#E2E8F0',
              },
            ]}
            onPress={() => setCitySheetVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.pickerLeftRow}>
              <LucideIcon name="map-pin" size={18} color="#2E7D5B" />
              <Text
                testID="newtrip-selected-city-text"
                style={[
                  styles.pickerValueText,
                  {
                    color: selectedCity
                      ? (isDark ? '#FFFFFF' : '#0F172A')
                      : themeColors.textMuted,
                  },
                ]}
              >
                {selectedCity ? selectedCity.fullName : 'Where to?'}
              </Text>
            </View>
            <LucideIcon
              name="chevron-down"
              size={18}
              color={themeColors.textMuted}
            />
          </TouchableOpacity>

          {/* Number of Days */}
          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.textMuted, marginTop: 18 },
            ]}
          >
            NUMBER OF DAYS
          </Text>
          <View
            style={[
              styles.pickerCard,
              {
                backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                borderColor: isDark ? '#2A2D35' : '#E2E8F0',
              },
            ]}
          >
            <LucideIcon name="calendar" size={18} color="#0EA5E9" />
            <TextInput
              testID="newtrip-days-input"
              style={[
                styles.textInputStyle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              placeholder="e.g. 5 days"
              placeholderTextColor={themeColors.textMuted}
              value={daysCount}
              onChangeText={setDaysCount}
              keyboardType="numeric"
            />
          </View>

          {/* Start Date */}
          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.textMuted, marginTop: 18 },
            ]}
          >
            START DATE
          </Text>
          <TouchableOpacity
            testID="newtrip-start-date-picker"
            style={[
              styles.pickerCard,
              {
                backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                borderColor: isDark ? '#2A2D35' : '#E2E8F0',
              },
            ]}
            onPress={() => setIsDatePickerVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.pickerLeftRow}>
              <LucideIcon name="calendar" size={18} color="#F59E0B" />
              <Text
                style={[
                  styles.pickerValueText,
                  {
                    color: startDate
                      ? (isDark ? '#FFFFFF' : '#0F172A')
                      : themeColors.textMuted,
                  },
                ]}
              >
                {startDate ? startDate : 'Optional — pick a date'}
              </Text>
            </View>
            <LucideIcon
              name="chevron-right"
              size={18}
              color={themeColors.textMuted}
            />
          </TouchableOpacity>

          {/* Schedule Time Window */}
          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.textMuted, marginTop: 18 },
            ]}
          >
            SCHEDULE
          </Text>
          <View style={styles.scheduleRow}>
            <View
              style={[
                styles.scheduleInputWrap,
                {
                  backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                },
              ]}
            >
              <LucideIcon name="clock" size={16} color={themeColors.textMuted} />
              <TextInput
                testID="newtrip-schedule-from"
                style={[
                  styles.scheduleInput,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
                value={scheduleFrom}
                onChangeText={setScheduleFrom}
                placeholder="09:00"
                placeholderTextColor={themeColors.textMuted}
              />
            </View>

            <Text
              style={[styles.scheduleToText, { color: themeColors.textMuted }]}
            >
              to
            </Text>

            <View
              style={[
                styles.scheduleInputWrap,
                {
                  backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                  borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                },
              ]}
            >
              <LucideIcon name="clock" size={16} color={themeColors.textMuted} />
              <TextInput
                testID="newtrip-schedule-to"
                style={[
                  styles.scheduleInput,
                  { color: isDark ? '#FFFFFF' : '#0F172A' },
                ]}
                value={scheduleTo}
                onChangeText={setScheduleTo}
                placeholder="18:00"
                placeholderTextColor={themeColors.textMuted}
              />
            </View>
          </View>

          {/* What Are You Into? (8 Interest Pills) */}
          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.textMuted, marginTop: 18 },
            ]}
          >
            WHAT ARE YOU INTO?
          </Text>
          <View style={styles.interestsWrap}>
            {INTERESTS.map((item) => {
              const active = selectedInterests.includes(item.label);
              return (
                <TouchableOpacity
                  key={item.id}
                  testID={`newtrip-interest-${item.id}`}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: active
                        ? '#2E7D5B'
                        : isDark
                        ? '#1C1D21'
                        : '#FFFFFF',
                      borderColor: active
                        ? '#2E7D5B'
                        : isDark
                        ? '#2A2D35'
                        : '#E2E8F0',
                    },
                  ]}
                  onPress={() => toggleInterest(item.label)}
                  activeOpacity={0.75}
                >
                  <Text
                    style={[
                      styles.interestChipText,
                      {
                        color: active
                          ? '#FFFFFF'
                          : isDark
                          ? '#E2E8F0'
                          : '#0F172A',
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Place of Stay */}
          <Text
            style={[
              styles.fieldLabel,
              { color: themeColors.textMuted, marginTop: 18 },
            ]}
          >
            PLACE OF STAY
          </Text>
          <View
            style={[
              styles.pickerCard,
              {
                backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
                borderColor: isDark ? '#2A2D35' : '#E2E8F0',
              },
            ]}
          >
            <LucideIcon name="home" size={18} color="#8B5CF6" />
            <TextInput
              testID="newtrip-stay-input"
              style={[
                styles.textInputStyle,
                { color: isDark ? '#FFFFFF' : '#0F172A' },
              ]}
              placeholder="e.g. Khai Tri Hotel or apartment address"
              placeholderTextColor={themeColors.textMuted}
              value={stayAddress}
              onChangeText={setStayAddress}
            />
          </View>
          <Text style={[styles.fieldHint, { color: themeColors.textMuted }]}>
            Your daily starting point for travel.
          </Text>

          {errorBanner ? (
            <Text style={styles.errorBannerText}>{errorBanner}</Text>
          ) : null}

          {/* Bottom Submit Button */}
          <TouchableOpacity
            testID="newtrip-submit-btn"
            style={styles.createTripBtn}
            onPress={handleSubmit}
            activeOpacity={0.88}
          >
            <LucideIcon name="sparkles" size={18} color="#FFFFFF" />
            <Text style={styles.createTripBtnText}>Create Trip</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* City Selection Bottom Sheet */}
        <Modal
          visible={citySheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setCitySheetVisible(false)}
        >
          <TouchableOpacity
            style={styles.sheetOverlay}
            activeOpacity={1}
            onPress={() => setCitySheetVisible(false)}
          >
            <TouchableOpacity
              testID="city-picker-sheet"
              style={[
                styles.sheetContent,
                { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF' },
              ]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.sheetHandle} />

              <View style={styles.sheetHeader}>
                <Text
                  style={[
                    styles.sheetTitle,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Select City
                </Text>
                <TouchableOpacity
                  onPress={() => setCitySheetVisible(false)}
                  style={styles.sheetCloseBtn}
                >
                  <LucideIcon
                    name="x"
                    size={20}
                    color={themeColors.textMuted}
                  />
                </TouchableOpacity>
              </View>

              {/* Search Bar */}
              <View
                style={[
                  styles.citySearchWrap,
                  {
                    backgroundColor: isDark ? '#121316' : '#F1F5F9',
                    borderColor: isDark ? '#2A2D35' : '#E2E8F0',
                  },
                ]}
              >
                <LucideIcon
                  name="search"
                  size={16}
                  color={themeColors.textMuted}
                />
                <TextInput
                  testID="city-picker-search-input"
                  style={[
                    styles.citySearchInput,
                    { color: isDark ? '#FFFFFF' : '#0F172A' },
                  ]}
                  placeholder="Search cities..."
                  placeholderTextColor={themeColors.textMuted}
                  value={citySearchQuery}
                  onChangeText={setCitySearchQuery}
                />
              </View>

              {/* Filter Tabs: Recent / Popular */}
              <View style={styles.sheetTabsRow}>
                <TouchableOpacity
                  style={[
                    styles.sheetTabPill,
                    cityFilterTab === 'recent' && styles.sheetTabPillActive,
                  ]}
                  onPress={() => setCityFilterTab('recent')}
                >
                  <Text
                    style={[
                      styles.sheetTabPillText,
                      cityFilterTab === 'recent' &&
                        styles.sheetTabPillTextActive,
                    ]}
                  >
                    ⏱ Recent
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sheetTabPill,
                    cityFilterTab === 'popular' && styles.sheetTabPillActive,
                  ]}
                  onPress={() => setCityFilterTab('popular')}
                >
                  <Text
                    style={[
                      styles.sheetTabPillText,
                      cityFilterTab === 'popular' &&
                        styles.sheetTabPillTextActive,
                    ]}
                  >
                    ⭐ Popular
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                style={[
                  styles.destinationSectionTitle,
                  { color: themeColors.textMuted },
                ]}
              >
                POPULAR DESTINATIONS
              </Text>

              <ScrollView
                style={{ maxHeight: 320 }}
                showsVerticalScrollIndicator={false}
              >
                {filteredCities.map((city) => (
                  <TouchableOpacity
                    key={city.id}
                    testID={`city-option-${city.id}`}
                    style={[
                      styles.cityOptionRow,
                      {
                        borderBottomColor: isDark ? '#2A2D35' : '#F1F5F9',
                      },
                    ]}
                    onPress={() => handleSelectCity(city)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.cityOptionLeft}>
                      <LucideIcon name="globe" size={18} color="#2E7D5B" />
                      <Text
                        style={[
                          styles.cityOptionName,
                          { color: isDark ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        {city.fullName}
                      </Text>
                    </View>
                    <LucideIcon
                      name="chevron-right"
                      size={16}
                      color={themeColors.textMuted}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Calendar Picker Modal */}
        <CalendarPickerModal
          visible={isDatePickerVisible}
          selectedDate={startDate || new Date().toISOString().split('T')[0]}
          onSelectDate={(d) => {
            setStartDate(d);
            setErrorBanner('');
          }}
          onClose={() => setIsDatePickerVisible(false)}
          title="Select Start Date"
          minDate={new Date().toISOString().split('T')[0]}
          testID="newtrip-calendar-modal"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 54,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  pickerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  pickerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pickerValueText: {
    fontSize: 15,
    fontWeight: '600',
  },
  textInputStyle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    marginLeft: 12,
    paddingVertical: 0,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
  },
  scheduleInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 0,
  },
  scheduleToText: {
    fontSize: 13,
    fontWeight: '600',
  },
  interestsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  interestChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  fieldHint: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 14,
  },
  createTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D5B', // Pine Green
    paddingVertical: 16,
    borderRadius: 18,
    marginTop: 28,
    gap: 8,
    shadowColor: '#2E7D5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  createTripBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    backgroundColor: 'rgba(156, 163, 175, 0.4)',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sheetCloseBtn: {
    padding: 6,
  },
  citySearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 8,
    marginBottom: 14,
  },
  citySearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 0,
  },
  sheetTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  sheetTabPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(156, 163, 175, 0.15)',
  },
  sheetTabPillActive: {
    backgroundColor: 'rgba(46, 125, 91, 0.2)',
  },
  sheetTabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  sheetTabPillTextActive: {
    color: '#2E7D5B',
    fontWeight: '700',
  },
  destinationSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  cityOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  cityOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cityOptionName: {
    fontSize: 15,
    fontWeight: '600',
  },
});
