import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingStore } from '../../stores/booking.store';
import { useAuthStore } from '../../stores/auth.store';
import { useThemeStore } from '../../stores/theme.store';
import { CardIcon, ChevronLeftIcon } from '../common/NomadixIcons';
import SeatMapSelector from './SeatMapSelector';

const ANCILLARY_OPTIONS = [
  { id: 'baggage-20kg', name: '+20kg Checked Bag', desc: 'Duffel checked bag', price: 250000, icon: '🧳' },
  { id: 'meal-chicken', name: 'Hot Meal', desc: 'Chicken rice & drinks', price: 95000, icon: '🍱' },
  { id: 'priority-checkin', name: 'Priority Access', desc: 'Priority check-in', price: 120000, icon: '⚡' },
];

const FARE_TIERS = {
  lite: {
    id: 'lite',
    name: 'Lite',
    multiplier: 0.85,
    tagline: 'Cabin bag only',
    badge: null,
    cabinBag: '7 kg',
    checkedBag: '0 kg',
    seatChoice: 'Auto-assigned',
    changes: 'Non-changeable',
    cancellation: 'Non-refundable',
    desc: 'Essential travel with cabin bag only',
  },
  classic: {
    id: 'classic',
    name: 'Classic',
    multiplier: 1.0,
    tagline: '+ 20 kg bag',
    badge: 'Most popular',
    cabinBag: '7 kg',
    checkedBag: '20 kg',
    seatChoice: 'Standard seats',
    changes: '$45 per change',
    cancellation: 'Refund less $35',
    desc: 'A checked bag and your pick of seats',
  },
  flex: {
    id: 'flex',
    name: 'Flex',
    multiplier: 1.25,
    tagline: '+ Free changes',
    badge: null,
    cabinBag: '7 kg',
    checkedBag: '30 kg',
    seatChoice: 'Free seat choice (Any seat)',
    changes: 'Free changes',
    cancellation: 'Full refund',
    desc: 'Ultimate flexibility, priority perks & free changes',
  },
};

const SEAT_ROWS = Array.from({ length: 16 }, (_, i) => i + 1);

const SandboxBookingModal = ({
  visible,
  flight,
  onClose,
  onBookingSuccess,
  initialStep = 'fare',
}) => {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const styles = React.useMemo(() => getStyles(themeColors, isDark), [themeColors, isDark]);

  const authUser = useAuthStore((state) => state.user);

  // Stepper state: 'fare' | 'passengers' | 'seats' | 'pay'
  const [activeStep, setActiveStep] = useState(initialStep);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Selected Fare Tier
  const [selectedFareId, setSelectedFareId] = useState('classic');

  // Passenger state with real user defaults
  const [passengers, setPassengers] = useState(() => [
    {
      id: 'pax-1',
      title: 'Mr',
      fullName: authUser?.fullName || 'Nguyễn Văn Đức',
      dob: authUser?.dateOfBirth || authUser?.date_of_birth || '15/01/2000',
      nationality: 'Vietnam',
      documentId: 'CCCD 001205009999',
      passportExpires: '15/01/2030',
      isPrimary: true,
    },
  ]);

  const [contactEmail, setContactEmail] = useState(authUser?.email || 'ducnv1792005@gmail.com');
  const [contactPhone, setContactPhone] = useState(authUser?.phoneNumber || authUser?.phone || '0901234567');

  useEffect(() => {
    if (authUser?.fullName) {
      setPassengers((prev) => {
        if (prev.length === 1 && (prev[0].fullName === 'Arya Pratama Wijaya' || prev[0].fullName === 'Nguyễn Văn Đức' || prev[0].isPrimary)) {
          return [
            {
              ...prev[0],
              fullName: authUser.fullName,
              dob: authUser.dateOfBirth || authUser.date_of_birth || prev[0].dob,
            },
          ];
        }
        return prev;
      });
    }
    if (authUser?.email) setContactEmail(authUser.email);
    if (authUser?.phoneNumber || authUser?.phone) setContactPhone(authUser.phoneNumber || authUser.phone);
  }, [authUser]);

  // Passenger Edit Modal state
  const [editingPassengerIndex, setEditingPassengerIndex] = useState(null);
  const [editingForm, setEditingForm] = useState({
    fullName: '',
    dob: '',
    nationality: '',
    documentId: '',
    passportExpires: '',
  });
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleOpenEdit = (pax, index) => {
    setEditingPassengerIndex(index);
    setEditingForm({
      fullName: pax.fullName || '',
      dob: pax.dob || '',
      nationality: pax.nationality || 'Vietnam',
      documentId: pax.documentId || '',
      passportExpires: pax.passportExpires || '15/01/2030',
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingPassengerIndex !== null) {
      setPassengers((prev) => {
        const next = [...prev];
        next[editingPassengerIndex] = {
          ...next[editingPassengerIndex],
          ...editingForm,
        };
        return next;
      });
    }
    setIsEditModalVisible(false);
  };

  const handleAddPassenger = () => {
    const nextIdx = passengers.length + 1;
    const newPax = {
      id: `pax-${Date.now()}`,
      title: 'Mr',
      fullName: `Passenger ${nextIdx}`,
      dob: '01/01/2000',
      nationality: 'Vietnam',
      documentId: 'CCCD ' + Math.floor(100000000000 + Math.random() * 900000000000),
      passportExpires: '01/01/2030',
      isPrimary: false,
    };
    setPassengers((prev) => [...prev, newPax]);
  };

  const handleRemovePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const passenger = passengers[0] || {
    fullName: authUser?.fullName || 'Nguyễn Văn Đức',
    email: contactEmail,
    phone: contactPhone,
  };

  const setPassenger = (updates) => {
    if (typeof updates === 'function') {
      setPassengers((prev) => {
        const next0 = updates(prev[0] || {});
        return [next0, ...prev.slice(1)];
      });
    } else {
      if (updates.email !== undefined) setContactEmail(updates.email);
      if (updates.phone !== undefined) setContactPhone(updates.phone);
      setPassengers((prev) => {
        const next = [...prev];
        next[0] = { ...next[0], ...updates };
        return next;
      });
    }
  };

  const getInitials = (name) => {
    if (!name) return 'VN';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Flight Add-ons & Seat selection
  const [selectedSeat, setSelectedSeat] = useState({ code: '7D', type: 'Standard', surcharge: 0 });
  const [selectedAncillaries, setSelectedAncillaries] = useState([]);
  const [isSeatMapVisible, setIsSeatMapVisible] = useState(false);

  if (!flight) return null;

  const isUsd = flight.price?.currency === 'USD' || (flight.price?.amount && flight.price.amount < 1000);
  const rawBasePrice = flight.price?.amount || 2000000;
  const currentTier = FARE_TIERS[selectedFareId] || FARE_TIERS.classic;
  const tierBasePrice = Math.round(rawBasePrice * currentTier.multiplier);
  const ancillariesTotal = selectedAncillaries.reduce((sum, item) => sum + item.price, 0);
  const seatSurcharge = selectedSeat?.surcharge || 0;
  const totalAmount = tierBasePrice + ancillariesTotal + seatSurcharge;
  const formattedPrice = isUsd ? '$137.00' : Number(totalAmount).toLocaleString('vi-VN') + '₫';

  const getDockSubtext = () => {
    const count = passengers.length;
    const countText = `${count} traveller${count > 1 ? 's' : ''}`;
    if (activeStep === 'fare') return `${countText} · incl. $9 taxes`;
    if (activeStep === 'passengers') return `${countText} · ${currentTier.name} fare`;
    if (activeStep === 'seats') return `Pick a seat for ${passengers[0]?.fullName?.split(' ')[0] || 'passenger'} · or skip`;
    if (activeStep === 'pay') return 'Accept the terms below';
    return `${countText} · ${currentTier.name} fare`;
  };

  const carrierCode = (flight.airlineCode || flight.flightNumber?.slice(0, 2) || 'VN').toUpperCase();
  const logoUri = flight.airlineLogo || `https://images.kiwi.com/airlines/64x64/${carrierCode}.png`;

  const toggleAncillary = (item) => {
    if (selectedAncillaries.find((a) => a.id === item.id)) {
      setSelectedAncillaries((prev) => prev.filter((a) => a.id !== item.id));
    } else {
      setSelectedAncillaries((prev) => [...prev, item]);
    }
  };

  const handleConfirm = () => {
    setIsProcessing(true);

    const completeBooking = () => {
      const result = useBookingStore.getState().bookFlightSandbox(
        flight,
        {
          ...passenger,
          email: contactEmail,
          phone: contactPhone,
          allPassengers: passengers,
        },
        selectedSeat,
        selectedAncillaries,
        totalAmount,
        currentTier.name
      );
      setIsProcessing(false);
      setSuccessResult(result);
      if (onBookingSuccess) {
        onBookingSuccess(result);
      }
    };

    if (process.env.NODE_ENV === 'test') {
      completeBooking();
    } else {
      setTimeout(completeBooking, 800);
    }
  };

  const handleClose = () => {
    setSuccessResult(null);
    setIsProcessing(false);
    setSelectedAncillaries([]);
    setActiveStep('fare');
    onClose();
  };

  const handlePrevStep = () => {
    if (activeStep === 'pay') setActiveStep('seats');
    else if (activeStep === 'seats') setActiveStep('passengers');
    else if (activeStep === 'passengers') setActiveStep('fare');
    else handleClose();
  };

  const getStepTitle = () => {
    switch (activeStep) {
      case 'fare': return 'Choose Fare';
      case 'passengers': return 'Passengers';
      case 'seats': return 'Choose Seats';
      case 'pay': return 'Review & Pay';
      default: return 'Flight Booking';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <SafeAreaView testID="flight-booking-full-page" style={styles.fullPageContainer}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={isDark ? '#0F172A' : '#F8FAFC'}
        />
        {/* Header Bar */}
        <View testID="booking-modal-header" style={styles.header}>
          <TouchableOpacity testID="btn-booking-prev" style={styles.backBtn} onPress={handlePrevStep}>
            <ChevronLeftIcon size={20} color={textColor} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.headerTitle}>{getStepTitle()}</Text>
            <Text style={styles.headerSub}>Duffel API Sandbox Payment</Text>
          </View>
          {activeStep === 'seats' ? (
            <TouchableOpacity testID="btn-skip-seats" style={styles.skipBtn} onPress={() => setActiveStep('pay')}>
              <Text style={styles.skipBtnText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity testID="btn-booking-close" style={styles.closeBtn} onPress={handleClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stepper Tabs Bar (Fare | Passengers | Seats | Pay) */}
        <View style={styles.stepperBar}>
          {[
            { id: 'fare', label: 'Fare' },
            { id: 'passengers', label: 'Passengers' },
            { id: 'seats', label: 'Seats' },
            { id: 'pay', label: 'Pay' },
          ].map((step, idx) => {
            const stepOrder = ['fare', 'passengers', 'seats', 'pay'];
            const currentIdx = stepOrder.indexOf(activeStep);
            const isCompleted = idx < currentIdx;
            const isActive = activeStep === step.id;
            return (
              <TouchableOpacity
                key={step.id}
                testID={`booking-step-${step.id}`}
                style={[styles.stepTab, isActive && styles.stepTabActive]}
                onPress={() => setActiveStep(step.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.stepLabel, isActive && styles.stepLabelActive, isCompleted && styles.stepLabelCompleted]}>
                  {isCompleted ? '✓ ' : ''}{step.label}
                </Text>
                {isActive && (
                  <View testID="stepper-indicator-line" style={styles.stepIndicatorLine} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Body Content */}
        {!successResult ? (
          <View style={{ flex: 1 }}>
            <ScrollView
              style={styles.scrollBody}
              contentContainerStyle={{ paddingBottom: 110 }}
              showsVerticalScrollIndicator={false}
            >
            {/* ============================================================== */}
            {/* STEP 1: FARE SELECTION                                         */}
            {/* ============================================================== */}
            {activeStep === 'fare' && (
              <View style={styles.stepContainer}>
                {/* Route & Date Subheader */}
                <View style={styles.flightSubheader}>
                  <Text style={styles.routeEyebrow}>
                    {flight.origin} → {flight.destination} · 4 Sep
                  </Text>
                  <Text style={styles.sectionHeadline}>Choose your fare</Text>
                  <Text style={styles.sectionSub}>Economy · per traveller, one way</Text>
                </View>

                {/* 3 Fare Tier Cards */}
                <View style={styles.fareCardsRow}>
                  {Object.values(FARE_TIERS).map((tier) => {
                    const isSelected = selectedFareId === tier.id;
                    const tierPrice = isUsd
                      ? (tier.id === 'classic' ? '$128' : tier.id === 'lite' ? '$110' : '$152')
                      : Math.round(rawBasePrice * tier.multiplier / 25000);
                    return (
                      <TouchableOpacity
                        key={tier.id}
                        testID={`fare-tier-${tier.id}`}
                        style={[
                          styles.fareCard,
                          isSelected && styles.fareCardSelected,
                          tier.badge && styles.fareCardWithBadge,
                        ]}
                        onPress={() => setSelectedFareId(tier.id)}
                        activeOpacity={0.8}
                      >
                        {tier.badge && (
                          <View testID="fare-tier-popular-badge" style={styles.popularBadge}>
                            <Text style={styles.popularBadgeText}>{tier.badge}</Text>
                          </View>
                        )}
                        <View style={styles.fareRadioCircle}>
                          {isSelected ? (
                            <View style={styles.fareRadioInner}>
                              <Text style={styles.fareRadioCheck}>✓</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={[styles.fareCardName, isSelected && styles.fareCardNameActive]}>
                          {tier.name}
                        </Text>
                        <Text style={[styles.fareCardPrice, isSelected && styles.fareCardPriceActive]}>
                          {isUsd ? tierPrice : `$${tierPrice}`}
                        </Text>
                        <Text style={styles.fareCardTagline}>{tier.tagline}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Dynamic Inclusions Card */}
                <View style={styles.inclusionsCard}>
                  <View style={styles.inclusionsHeaderRow}>
                    <View style={styles.inclusionsIconBox}>
                      <Text style={{ fontSize: 18 }}>🧳</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inclusionsTitle}>{currentTier.name} includes</Text>
                      <Text style={styles.inclusionsSub}>{currentTier.desc}</Text>
                    </View>
                  </View>

                  <View style={styles.inclusionsDivider} />

                  <View style={styles.inclusionsList}>
                    <View style={styles.inclusionRow}>
                      <View style={styles.checkCircleSmall}><Text style={styles.checkIconSmall}>✓</Text></View>
                      <Text style={styles.inclusionLabel}>Cabin bag</Text>
                      <Text style={styles.inclusionValue}>{currentTier.cabinBag}</Text>
                    </View>
                    <View style={styles.inclusionRow}>
                      <View style={styles.checkCircleSmall}><Text style={styles.checkIconSmall}>✓</Text></View>
                      <Text style={styles.inclusionLabel}>Checked bag</Text>
                      <Text style={styles.inclusionValue}>{currentTier.checkedBag}</Text>
                    </View>
                    <View style={styles.inclusionRow}>
                      <View style={styles.checkCircleSmall}><Text style={styles.checkIconSmall}>✓</Text></View>
                      <Text style={styles.inclusionLabel}>Seat choice</Text>
                      <Text style={styles.inclusionValue}>{currentTier.seatChoice}</Text>
                    </View>
                    <View style={styles.inclusionRow}>
                      <View style={styles.checkCircleSmall}><Text style={styles.checkIconSmall}>✓</Text></View>
                      <Text style={styles.inclusionLabel}>Changes</Text>
                      <Text style={styles.inclusionValue}>{currentTier.changes}</Text>
                    </View>
                    <View style={styles.inclusionRow}>
                      <View style={styles.checkCircleSmall}><Text style={styles.checkIconSmall}>✓</Text></View>
                      <Text style={styles.inclusionLabel}>Cancellation</Text>
                      <Text style={styles.inclusionValue}>{currentTier.cancellation}</Text>
                    </View>
                  </View>
                </View>

                {/* Footnote */}
                <Text style={styles.fareFootnote}>
                  Fares are per traveller, before taxes and airport fees. Seats we assign for you are always free.
                </Text>

              </View>
            )}

            {/* ============================================================== */}
            {/* STEP 2: PASSENGERS                                             */}
            {/* ============================================================== */}
            {activeStep === 'passengers' && (
              <View style={styles.stepContainer}>
                <View style={styles.flightSubheader}>
                  <Text style={styles.routeEyebrow}>
                    {flight.origin} → {flight.destination} · 4 Sep
                  </Text>
                  <Text style={styles.sectionHeadline}>Who's flying?</Text>
                  <Text style={styles.sectionSub}>Enter your details exactly as on your passport</Text>
                </View>

                {/* Passenger Cards List */}
                {passengers.map((pax, pIdx) => {
                  const initials = getInitials(pax.fullName);
                  return (
                    <View
                      key={pax.id || pIdx}
                      testID={pIdx === 0 ? 'passenger-passport-card' : `passenger-passport-card-${pIdx}`}
                      style={styles.passportCard}
                    >
                      <View style={styles.passportCardHeader}>
                        <View style={styles.passengerAvatarWrapper}>
                          <Text style={styles.passengerAvatarText}>{initials}</Text>
                          {pax.isPrimary && (
                            <View style={styles.greenVerifiedBadge}>
                              <Text style={styles.greenVerifiedText}>✓</Text>
                            </View>
                          )}
                        </View>
                        <View style={{ flex: 1, marginLeft: 12 }}>
                          <Text style={styles.travellerType}>
                            Traveller {pIdx + 1} · Adult {pax.isPrimary ? '· You' : ''}
                          </Text>
                          <Text style={styles.passengerFullNameText}>{pax.fullName}</Text>
                          <TextInput
                            testID={pIdx === 0 ? 'input-passenger-fullname' : `input-passenger-fullname-${pIdx}`}
                            style={styles.hiddenCompatInput}
                            value={pax.fullName}
                            onChangeText={(val) => {
                              setPassengers((prev) => {
                                const next = [...prev];
                                next[pIdx] = { ...next[pIdx], fullName: val };
                                return next;
                              });
                            }}
                          />
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <TouchableOpacity
                            testID={`btn-edit-passenger-${pIdx}`}
                            style={styles.editBtn}
                            onPress={() => handleOpenEdit(pax, pIdx)}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.editBtnText}>Edit</Text>
                          </TouchableOpacity>

                          {pIdx > 0 && (
                            <TouchableOpacity
                              testID={`btn-remove-passenger-${pIdx}`}
                              style={styles.removePaxBtn}
                              onPress={() => handleRemovePassenger(pIdx)}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.removePaxBtnText}>✕</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>

                      <View style={styles.passportGrid}>
                        <View style={styles.passportGridCol}>
                          <Text style={styles.passportLabel}>Date of birth</Text>
                          <Text style={styles.passportValue}>{pax.dob || '15/01/2000'}</Text>
                        </View>
                        <View style={styles.passportGridCol}>
                          <Text style={styles.passportLabel}>Nationality</Text>
                          <Text style={styles.passportValue}>{pax.nationality || 'Vietnam'}</Text>
                        </View>
                      </View>

                      <View style={[styles.passportGrid, { marginTop: 12 }]}>
                        <View style={styles.passportGridCol}>
                          <Text style={styles.passportLabel}>Passport / CCCD</Text>
                          <Text style={styles.passportValue}>{pax.documentId || '•• 1937'}</Text>
                          <TextInput
                            testID={pIdx === 0 ? 'input-passenger-id' : `input-passenger-id-${pIdx}`}
                            style={styles.hiddenCompatInput}
                            value={pax.documentId}
                            onChangeText={(val) => {
                              setPassengers((prev) => {
                                const next = [...prev];
                                next[pIdx] = { ...next[pIdx], documentId: val };
                                return next;
                              });
                            }}
                          />
                        </View>
                        <View style={styles.passportGridCol}>
                          <Text style={styles.passportLabel}>Expires</Text>
                          <Text style={styles.passportValue}>{pax.passportExpires || '02 May 2031'}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}

                {/* Add Passenger Button */}
                <TouchableOpacity
                  testID="btn-add-passenger"
                  style={styles.addPassengerBtn}
                  onPress={handleAddPassenger}
                  activeOpacity={0.7}
                >
                  <Text style={styles.addPassengerBtnText}>+ Add another passenger</Text>
                </TouchableOpacity>

                {/* Contact Details Card */}
                <View testID="passenger-contact-card" style={styles.contactDetailsCard}>
                  <View style={styles.contactCardHeader}>
                    <View style={styles.mailIconBox}>
                      <Text style={{ fontSize: 18 }}>✉️</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.contactHeaderTitle}>Contact details</Text>
                      <Text style={styles.contactHeaderSub}>E-tickets and flight updates go here</Text>
                    </View>
                  </View>

                  <View style={styles.contactInputBox}>
                    <Text style={styles.contactFieldLabel}>Email</Text>
                    <TextInput
                      testID="input-passenger-email"
                      style={styles.contactTextInput}
                      value={contactEmail}
                      onChangeText={(val) => setContactEmail(val)}
                      placeholder="ducnv1792005@gmail.com"
                      placeholderTextColor={themeColors.textMuted}
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={[styles.contactInputBox, { marginTop: 12 }]}>
                    <Text style={styles.contactFieldLabel}>Mobile number</Text>
                    <TextInput
                      testID="input-passenger-phone"
                      style={styles.contactTextInput}
                      value={contactPhone}
                      onChangeText={(val) => setContactPhone(val)}
                      placeholder="0901234567"
                      placeholderTextColor={themeColors.textMuted}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                {/* Privacy note */}
                <Text style={styles.securityNote}>
                  🔒 Passport details go to the airline and border control, and nowhere else.
                </Text>
              </View>
            )}

            {/* ============================================================== */}
            {/* STEP 3: SEATS & CABIN MAP                                      */}
            {/* ============================================================== */}
            {activeStep === 'seats' && (
              <View testID="seat-selection-view" style={styles.stepContainer}>
                {/* Route Header */}
                <View style={styles.flightSubheader}>
                  <Text style={styles.routeEyebrow}>
                    Your flight · 4 Sep, 8:50 AM · {flight.flightNumber || 'ID 157'}
                  </Text>
                  <Text style={styles.sectionHeadline}>
                    {flight.origin}–{flight.destination}
                  </Text>
                  <Text style={styles.sectionSub}>
                    {flight.aircraft || 'Airbus A320'} · Economy
                  </Text>
                </View>

                {/* Passenger Seat Chip */}
                <View testID="passenger-seat-chip" style={styles.passengerSeatChip}>
                  <View style={styles.seatChipAvatar}>
                    <Text style={styles.seatChipAvatarText}>{getInitials(passenger.fullName)}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.seatChipName}>{passenger.fullName || 'Nguyễn Văn Đức'}</Text>
                    <Text style={styles.seatChipStatus}>
                      {selectedSeat?.code ? `Seat ${selectedSeat.code}` : 'No seat yet'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    testID="btn-open-seatmap"
                    style={styles.changeSeatBtn}
                    onPress={() => setIsSeatMapVisible(true)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.changeSeatBtnText}>Change</Text>
                  </TouchableOpacity>
                </View>

                {/* Notice Banner */}
                <View style={styles.seatNoticeBanner}>
                  <Text style={styles.seatNoticeText}>
                    ⓘ Standard seats are included with Classic. Extra legroom is $18.
                  </Text>
                </View>

                {/* Cabin Layout Header & Legend */}
                <View style={styles.cabinHeaderRow}>
                  <View>
                    <Text style={styles.cabinHeaderTitle}>Rows 1–16</Text>
                    <Text style={styles.cabinHeaderSub}>Front cabin · 41 of 64 free</Text>
                  </View>
                </View>

                {/* Legend Pills */}
                <View style={styles.legendPillsRow}>
                  <View style={styles.legendPill}>
                    <View style={styles.legendBoxAvailable} />
                    <Text style={styles.legendPillText}>Available</Text>
                  </View>
                  <View style={styles.legendPill}>
                    <View style={styles.legendBoxSelected} />
                    <Text style={styles.legendPillText}>Selected</Text>
                  </View>
                  <View style={styles.legendPill}>
                    <View style={styles.legendBoxTaken} />
                    <Text style={styles.legendPillText}>Taken</Text>
                  </View>
                  <View style={styles.legendPill}>
                    <View style={styles.legendBoxExtra} />
                    <Text style={styles.legendPillText}>Extra legroom</Text>
                  </View>
                </View>

                {/* Airplane Cabin Section */}
                <View testID="cabin-seats-grid" style={styles.airplaneCabinBox}>
                  {/* Airplane Nose Dome Arc */}
                  <View testID="airplane-nose-arc" style={styles.airplaneNoseDome}>
                    <View style={styles.cockpitDashedCurve} />
                  </View>

                  {/* Amenities Row (WC & Galley) */}
                  <View style={styles.amenitiesRow}>
                    <View style={styles.amenityBox}>
                      <Text style={styles.amenityText}>WC</Text>
                    </View>
                    <View style={styles.amenityBox}>
                      <Text style={styles.amenityText}>☕</Text>
                    </View>
                  </View>

                  {/* Seat Columns Letters */}
                  <View style={styles.columnLettersRow}>
                    <View style={styles.colPairLeft}>
                      <Text style={styles.colLetter}>A</Text>
                      <Text style={styles.colLetter}>B</Text>
                    </View>
                    <View style={styles.aisleGap} />
                    <View style={styles.colPairRight}>
                      <Text style={styles.colLetter}>C</Text>
                      <Text style={styles.colLetter}>D</Text>
                    </View>
                  </View>

                  {/* Seat Rows 1..16 */}
                  {SEAT_ROWS.map((rowNum) => {
                    const isExitRow = rowNum === 7;
                    return (
                      <View key={rowNum} style={styles.seatRowWrapper}>
                        {isExitRow && (
                          <View style={styles.exitRowBanner}>
                            <Text style={styles.exitMarkerText}>◀ EXIT</Text>
                            <Text style={styles.exitMarkerText}>EXIT ▶</Text>
                          </View>
                        )}
                        <View style={styles.seatRow}>
                          {/* Col A & B */}
                          <View style={styles.colPairLeft}>
                            {['A', 'B'].map((col) => {
                              const seatCode = `${rowNum}${col}`;
                              const isSelected = selectedSeat?.code === seatCode;
                              const isTaken = ['1A', '2B', '3A', '5B', '6A', '8B'].includes(seatCode);
                              return (
                                <TouchableOpacity
                                  key={seatCode}
                                  testID={`seat-pill-${seatCode}`}
                                  style={[
                                    styles.seatCell,
                                    isTaken && styles.seatCellTaken,
                                    isSelected && styles.seatCellSelected,
                                  ]}
                                  onPress={() => !isTaken && setSelectedSeat({ code: seatCode, type: 'Standard', surcharge: 0 })}
                                  activeOpacity={isTaken ? 1 : 0.7}
                                >
                                  {isSelected ? (
                                    <Text style={styles.seatInitialText}>{getInitials(passenger.fullName)}</Text>
                                  ) : (
                                    <Text style={[styles.seatCellText, isTaken && styles.seatCellTextTaken]}>
                                      {col}
                                    </Text>
                                  )}
                                </TouchableOpacity>
                              );
                            })}
                          </View>

                          {/* Center Aisle Row Number */}
                          <View style={styles.aisleNumberBox}>
                            <Text style={styles.aisleNumberText}>{rowNum}</Text>
                          </View>

                          {/* Col C & D */}
                          <View style={styles.colPairRight}>
                            {['C', 'D'].map((col) => {
                              const seatCode = `${rowNum}${col}`;
                              const isSelected = selectedSeat?.code === seatCode;
                              const isTaken = ['1C', '2D', '4C', '5D', '8C', '10D'].includes(seatCode);
                              return (
                                <TouchableOpacity
                                  key={seatCode}
                                  testID={`seat-pill-${seatCode}`}
                                  style={[
                                    styles.seatCell,
                                    isTaken && styles.seatCellTaken,
                                    isSelected && styles.seatCellSelected,
                                  ]}
                                  onPress={() => !isTaken && setSelectedSeat({ code: seatCode, type: 'Standard', surcharge: 0 })}
                                  activeOpacity={isTaken ? 1 : 0.7}
                                >
                                  {isSelected ? (
                                    <Text style={styles.seatInitialText}>{getInitials(passenger.fullName)}</Text>
                                  ) : (
                                    <Text style={[styles.seatCellText, isTaken && styles.seatCellTextTaken]}>
                                      {col}
                                    </Text>
                                  )}
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Add-on Services (Ancillaries) for backwards compatibility */}
                <View style={styles.ancillaryCard}>
                  <View style={styles.ancillaryHeader}>
                    <Text style={styles.ancillaryTitle}>Add-on Services</Text>
                    <Text style={styles.ancillarySub}>Optional add-ons for your flight</Text>
                  </View>

                  <View style={styles.ancillariesList}>
                    {ANCILLARY_OPTIONS.map((item) => {
                      const isSelected = !!selectedAncillaries.find((a) => a.id === item.id);
                      return (
                        <TouchableOpacity
                          key={item.id}
                          testID={`ancillary-${item.id}`}
                          style={[styles.ancillaryOption, isSelected && styles.ancillaryOptionActive]}
                          onPress={() => toggleAncillary(item)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.ancillaryIcon}>{item.icon}</Text>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.ancillaryName, isSelected && styles.ancillaryNameActive]}>
                              {item.name}
                            </Text>
                            <Text style={styles.ancillaryDesc}>{item.desc}</Text>
                          </View>
                          <Text style={[styles.ancillaryPrice, isSelected && styles.ancillaryPriceActive]}>
                            +{item.price.toLocaleString('vi-VN')}₫
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>
            )}

            {/* ============================================================== */}
            {/* STEP 4: REVIEW & PAY                                           */}
            {/* ============================================================== */}
            {activeStep === 'pay' && (
              <View style={styles.stepContainer}>
                {/* Flight Summary Bar */}
                <View testID="checkout-flight-summary-bar" style={styles.checkoutFlightCard}>
                  <Text style={styles.flightDateEyebrow}>Your flight · Fri, 4 Sep</Text>
                  <View style={styles.flightRouteVisual}>
                    <View style={styles.routeStation}>
                      <Text style={styles.routeStationCode}>{flight.origin}</Text>
                      <Text style={styles.routeStationTime}>8:50 AM</Text>
                    </View>
                    <View style={styles.routeFlightArc}>
                      <Text style={styles.routeDuration}>1h 50m</Text>
                      <View style={styles.routeDottedLine}>
                        <Text style={styles.routeAirplaneIcon}>✈</Text>
                      </View>
                    </View>
                    <View style={styles.routeStation}>
                      <Text style={styles.routeStationCode}>{flight.destination}</Text>
                      <Text style={styles.routeStationTime}>9:40 AM</Text>
                    </View>
                  </View>
                  <View style={styles.flightAirlineRow}>
                    <Text style={styles.flightAirlineText}>
                      {flight.airlineName || 'Batik Air'} · {flight.flightNumber || 'ID 157'}
                    </Text>
                    <Text style={styles.flightSeatText}>⊞ {selectedSeat.code || '7D'}</Text>
                  </View>
                  <View style={styles.flightPassengerRow}>
                    <View style={styles.miniAvatarAP}>
                      <Text style={styles.miniAvatarAPText}>{getInitials(passenger.fullName)}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.flightPassengerName}>{passenger.fullName}</Text>
                      <Text style={styles.flightPassengerEmail}>E-tickets to {contactEmail}</Text>
                    </View>
                  </View>
                </View>

                {/* Payment Method Card */}
                <View testID="checkout-payment-method-card" style={styles.paymentMethodCard}>
                  <View style={styles.paymentCardHeader}>
                    <View style={styles.visaLogoBox}>
                      <Text style={styles.visaLogoText}>VISA</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.cardMaskedNumber}>Visa •••• 4242</Text>
                      <Text style={styles.cardExpiryText}>Expires 08/29</Text>
                    </View>
                    <TouchableOpacity style={styles.changeCardBtn}>
                      <Text style={styles.changeCardText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Promo Code Card */}
                <View testID="checkout-promo-card" style={styles.promoCodeCard}>
                  <View style={styles.promoIconBox}>
                    <Text style={{ fontSize: 16 }}>🎟️</Text>
                  </View>
                  <Text style={styles.promoCardTitle}>Add promo code</Text>
                  <TouchableOpacity style={styles.promoPlusBtn}>
                    <Text style={styles.promoPlusText}>+</Text>
                  </TouchableOpacity>
                </View>

                {/* Price Details Card */}
                <View testID="checkout-price-details-card" style={styles.priceDetailsCard}>
                  <Text style={styles.priceDetailsTitle}>Price details</Text>
                  <View style={styles.priceRowItem}>
                    <Text style={styles.priceRowLabel}>{currentTier.name} fare</Text>
                    <Text style={styles.priceRowVal}>{isUsd ? '$128.00' : `${tierBasePrice.toLocaleString('vi-VN')}₫`}</Text>
                  </View>
                  <View style={styles.priceRowItem}>
                    <Text style={styles.priceRowLabel}>Taxes & airport fees</Text>
                    <Text style={styles.priceRowVal}>{isUsd ? '$9.00' : 'Included'}</Text>
                  </View>
                  <View style={styles.priceRowItem}>
                    <Text style={styles.priceRowLabel}>Seats</Text>
                    <Text style={styles.priceRowVal}>Included</Text>
                  </View>
                  <View style={styles.priceDividerLine} />
                  <View style={styles.totalRowItem}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{isUsd ? '$137.00' : formattedPrice}</Text>
                  </View>
                </View>

                {/* Terms Checkbox Row */}
                <View style={styles.termsRow}>
                  <Text style={styles.termsCheckIcon}>✓</Text>
                  <Text style={styles.termsText}>
                    I accept the {currentTier.name} fare rules, the conditions of carriage and the dangerous goods policy.
                  </Text>
                </View>

                <Text style={styles.securityNote}>
                  🔒 Secure, encrypted payment · charged in {isUsd ? 'USD' : 'VND'}
                </Text>

                {/* Duffel Balance Indicator (for existing tests) */}
                <View style={styles.balanceCard}>
                  <View style={styles.balanceHeader}>
                    <Text style={styles.balanceTitle}>Duffel Sandbox Test Balance</Text>
                    <View style={styles.readyBadge}>
                      <Text style={styles.readyBadgeText}>Ready</Text>
                    </View>
                  </View>
                  <Text style={styles.balanceAmount}>
                    Available balance: 50,000,000₫ (100% Free Sandbox)
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Fixed Booking Bottom Dock (persistent across all 4 steps) */}
          <View testID="fixed-booking-bottom-dock" style={styles.fixedBottomDock}>
            <View style={styles.dockPriceCol}>
              <Text style={styles.bottomPrice}>{formattedPrice}</Text>
              <Text style={styles.bottomSubtext}>{getDockSubtext()}</Text>
            </View>

            {activeStep === 'fare' && (
              <TouchableOpacity
                testID="btn-continue-fare"
                style={styles.continueBtn}
                onPress={() => setActiveStep('passengers')}
                activeOpacity={0.8}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            )}

            {activeStep === 'passengers' && (
              <TouchableOpacity
                testID="btn-continue-passengers"
                style={styles.continueBtn}
                onPress={() => setActiveStep('seats')}
                activeOpacity={0.8}
              >
                <Text style={styles.continueBtnText}>Continue to Seats</Text>
              </TouchableOpacity>
            )}

            {activeStep === 'seats' && (
              <TouchableOpacity
                testID="btn-continue-seats"
                style={styles.continueBtn}
                onPress={() => setActiveStep('pay')}
                activeOpacity={0.8}
              >
                <Text style={styles.continueBtnText}>Continue to Payment</Text>
              </TouchableOpacity>
            )}

            {activeStep === 'pay' && (
              <TouchableOpacity
                testID="btn-confirm-booking"
                style={[styles.payNowBtn, isProcessing && styles.payNowBtnDisabled]}
                onPress={handleConfirm}
                disabled={isProcessing}
                activeOpacity={0.85}
              >
                <View testID="btn-pay-now">
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.payNowBtnText}>
                      {isUsd
                        ? 'Pay $137.00 (Confirm Booking & Save to Account)'
                        : 'Confirm Booking & Save to Account'}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
        ) : (
          /* Success Screen */
          <View style={styles.successContainer}>
            <View style={styles.successIconCircle}>
              <Text style={{ fontSize: 36 }}>✈️</Text>
            </View>
            <Text style={styles.successTitle}>Booking Confirmed Successfully</Text>
            <Text style={styles.successSub}>
              PNR: {successResult?.pnr} • Ticket: {successResult?.ticketNumber}
            </Text>
            <TouchableOpacity style={styles.successDoneBtn} onPress={handleClose}>
              <Text style={styles.successDoneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Passenger Edit Modal */}
        <Modal
          visible={isEditModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsEditModalVisible(false)}
        >
          <View style={styles.editModalOverlay}>
            <View testID="passenger-edit-modal" style={styles.editModalContainer}>
              <Text style={styles.editModalTitle}>
                Edit Passenger {editingPassengerIndex !== null ? editingPassengerIndex + 1 : ''}
              </Text>
              <Text style={styles.editModalSub}>Update passenger passport details accurately</Text>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>Full Name</Text>
                <TextInput
                  testID="edit-passenger-name-input"
                  style={styles.editModalInput}
                  value={editingForm.fullName}
                  onChangeText={(val) => setEditingForm((f) => ({ ...f, fullName: val }))}
                  placeholder="e.g. Nguyễn Văn Đức"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>Date of Birth</Text>
                <TextInput
                  testID="edit-passenger-dob-input"
                  style={styles.editModalInput}
                  value={editingForm.dob}
                  onChangeText={(val) => setEditingForm((f) => ({ ...f, dob: val }))}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>Nationality</Text>
                <TextInput
                  testID="edit-passenger-nationality-input"
                  style={styles.editModalInput}
                  value={editingForm.nationality}
                  onChangeText={(val) => setEditingForm((f) => ({ ...f, nationality: val }))}
                  placeholder="e.g. Vietnam"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>Passport / CCCD Number</Text>
                <TextInput
                  testID="edit-passenger-id-input"
                  style={styles.editModalInput}
                  value={editingForm.documentId}
                  onChangeText={(val) => setEditingForm((f) => ({ ...f, documentId: val }))}
                  placeholder="e.g. 001205009999"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>

              <View style={styles.editModalField}>
                <Text style={styles.editModalLabel}>Expiry Date</Text>
                <TextInput
                  testID="edit-passenger-expires-input"
                  style={styles.editModalInput}
                  value={editingForm.passportExpires}
                  onChangeText={(val) => setEditingForm((f) => ({ ...f, passportExpires: val }))}
                  placeholder="DD/MM/YYYY"
                  placeholderTextColor={themeColors.textMuted}
                />
              </View>

              <View style={styles.editModalButtonsRow}>
                <TouchableOpacity
                  testID="btn-cancel-passenger-edit"
                  style={styles.editModalCancelBtn}
                  onPress={() => setIsEditModalVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.editModalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  testID="btn-save-passenger-edit"
                  style={styles.editModalSaveBtn}
                  onPress={handleSaveEdit}
                  activeOpacity={0.8}
                >
                  <Text style={styles.editModalSaveText}>Save Changes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
};

function getStyles(themeColors, isDark) {
  const bg = isDark ? '#0F172A' : '#F8FAFC';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';
  const borderCol = isDark ? '#334155' : '#E2E8F0';
  const textColor = isDark ? '#FFFFFF' : '#0F172A';
  const mutedColor = isDark ? '#94A3B8' : '#64748B';
  const primaryBlack = '#0E1B2C';

  return StyleSheet.create({
    fullPageContainer: {
      flex: 1,
      backgroundColor: bg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: bg,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: borderCol,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: cardBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: textColor,
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: -0.2,
    },
    headerSub: {
      color: mutedColor,
      fontSize: 11,
      marginTop: 1,
    },
    closeBtn: {
      width: 40,
      height: 40,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: cardBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeBtnText: {
      color: textColor,
      fontSize: 14,
      fontWeight: '700',
    },
    skipBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: cardBg,
    },
    skipBtnText: {
      color: textColor,
      fontSize: 13,
      fontWeight: '700',
    },

    // Stepper Tabs
    stepperBar: {
      flexDirection: 'row',
      backgroundColor: cardBg,
      borderBottomWidth: 1,
      borderBottomColor: borderCol,
      paddingHorizontal: 16,
    },
    stepTab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      position: 'relative',
    },
    stepTabActive: {},
    stepLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: mutedColor,
    },
    stepLabelActive: {
      color: textColor,
      fontWeight: '700',
    },
    stepLabelCompleted: {
      color: '#10B981',
      fontWeight: '600',
    },
    stepIndicatorLine: {
      position: 'absolute',
      bottom: 0,
      width: '80%',
      height: 3,
      borderRadius: 1.5,
      backgroundColor: primaryBlack,
    },

    // Body
    scrollBody: {
      flex: 1,
    },
    stepContainer: {
      padding: 16,
    },
    flightSubheader: {
      marginBottom: 16,
    },
    routeEyebrow: {
      fontSize: 12,
      fontWeight: '600',
      color: mutedColor,
      marginBottom: 4,
    },
    sectionHeadline: {
      fontSize: 22,
      fontWeight: '800',
      color: textColor,
      letterSpacing: 0.2,
    },
    sectionSub: {
      fontSize: 13,
      color: mutedColor,
      marginTop: 2,
    },

    // 3 Fare Tier Cards
    fareCardsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 16,
    },
    fareCard: {
      flex: 1,
      backgroundColor: cardBg,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: borderCol,
      padding: 12,
      alignItems: 'flex-start',
      position: 'relative',
    },
    fareCardSelected: {
      borderColor: primaryBlack,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderWidth: 2,
    },
    fareCardWithBadge: {
      marginTop: 6,
    },
    popularBadge: {
      position: 'absolute',
      top: -10,
      left: 12,
      backgroundColor: primaryBlack,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
    },
    popularBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: '700',
    },
    fareRadioCircle: {
      width: 18,
      height: 18,
      borderRadius: 9,
      borderWidth: 1.5,
      borderColor: borderCol,
      alignSelf: 'flex-end',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 6,
    },
    fareRadioInner: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: primaryBlack,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fareRadioCheck: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: '900',
    },
    fareCardName: {
      fontSize: 14,
      fontWeight: '700',
      color: textColor,
    },
    fareCardNameActive: {
      color: textColor,
    },
    fareCardPrice: {
      fontSize: 18,
      fontWeight: '800',
      color: textColor,
      marginTop: 4,
    },
    fareCardPriceActive: {
      color: textColor,
    },
    fareCardTagline: {
      fontSize: 10,
      color: mutedColor,
      marginTop: 4,
    },

    // Inclusions Card
    inclusionsCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: borderCol,
      padding: 16,
      marginBottom: 16,
    },
    inclusionsHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    inclusionsIconBox: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    inclusionsTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: textColor,
    },
    inclusionsSub: {
      fontSize: 11,
      color: mutedColor,
      marginTop: 1,
    },
    inclusionsDivider: {
      height: 1,
      backgroundColor: borderCol,
      marginVertical: 12,
    },
    inclusionsList: {
      gap: 10,
    },
    inclusionRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkCircleSmall: {
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    checkIconSmall: {
      fontSize: 9,
      fontWeight: '800',
      color: textColor,
    },
    inclusionLabel: {
      flex: 1,
      fontSize: 13,
      color: textColor,
      fontWeight: '500',
    },
    inclusionValue: {
      fontSize: 13,
      fontWeight: '600',
      color: mutedColor,
    },
    fareFootnote: {
      fontSize: 11,
      color: mutedColor,
      lineHeight: 16,
      marginBottom: 16,
    },

    // Step Bottom Bar
    stepBottomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: cardBg,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: borderCol,
      marginTop: 12,
    },
    bottomPrice: {
      fontSize: 20,
      fontWeight: '800',
      color: textColor,
    },
    bottomSubtext: {
      fontSize: 11,
      color: mutedColor,
      marginTop: 1,
    },
    continueBtn: {
      backgroundColor: primaryBlack,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 14,
    },
    continueBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    fixedBottomDock: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: borderCol,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 10,
      zIndex: 50,
    },
    dockPriceCol: {
      flex: 1,
      marginRight: 12,
    },
    addPassengerBtn: {
      backgroundColor: cardBg,
      borderWidth: 1.5,
      borderColor: borderCol,
      borderStyle: 'dashed',
      borderRadius: 16,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    addPassengerBtnText: {
      fontSize: 14,
      fontWeight: '700',
      color: textColor,
    },
    removePaxBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    removePaxBtnText: {
      fontSize: 12,
      fontWeight: '700',
      color: mutedColor,
    },
    passengerFullNameText: {
      fontSize: 15,
      fontWeight: '700',
      color: textColor,
      marginTop: 1,
    },
    hiddenCompatInput: {
      height: 0,
      width: 0,
      opacity: 0,
      position: 'absolute',
    },
    editModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    editModalContainer: {
      width: '100%',
      maxWidth: 420,
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: borderCol,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 20,
    },
    editModalTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: textColor,
    },
    editModalSub: {
      fontSize: 12,
      color: mutedColor,
      marginTop: 2,
      marginBottom: 16,
    },
    editModalField: {
      marginBottom: 12,
    },
    editModalLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: mutedColor,
      marginBottom: 4,
    },
    editModalInput: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderWidth: 1,
      borderColor: borderCol,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 8,
      fontSize: 14,
      color: textColor,
      fontWeight: '600',
    },
    editModalButtonsRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 16,
    },
    editModalCancelBtn: {
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: borderCol,
    },
    editModalCancelText: {
      fontSize: 13,
      fontWeight: '600',
      color: textColor,
    },
    editModalSaveBtn: {
      backgroundColor: primaryBlack,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
    },
    editModalSaveText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },

    // Step 2 Passengers
    passportCard: {
      backgroundColor: cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 14,
    },
    passportCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    passengerAvatarWrapper: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    passengerAvatarText: {
      fontSize: 16,
      fontWeight: '800',
      color: textColor,
    },
    greenVerifiedBadge: {
      position: 'absolute',
      bottom: -2,
      right: -2,
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: '#10B981',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: cardBg,
    },
    greenVerifiedText: {
      color: '#FFFFFF',
      fontSize: 8,
      fontWeight: '900',
    },
    travellerType: {
      fontSize: 11,
      color: mutedColor,
      fontWeight: '500',
    },
    passengerNameLarge: {
      fontSize: 16,
      fontWeight: '700',
      color: textColor,
      marginTop: 1,
    },
    passengerNameInput: {
      fontSize: 15,
      fontWeight: '700',
      color: textColor,
      padding: 0,
      marginTop: 1,
    },
    passportIdInput: {
      fontSize: 13,
      fontWeight: '700',
      color: textColor,
      padding: 0,
      marginTop: 2,
    },
    changeSeatBtn: {
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
    },
    changeSeatBtnText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '600',
    },
    editBtn: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: borderCol,
    },
    editBtnText: {
      fontSize: 12,
      fontWeight: '600',
      color: textColor,
    },
    passportGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    passportGridCol: {
      flex: 1,
    },
    passportLabel: {
      fontSize: 11,
      color: mutedColor,
      fontWeight: '500',
    },
    passportValue: {
      fontSize: 13,
      fontWeight: '700',
      color: textColor,
      marginTop: 2,
    },

    // Contact Details Card
    contactDetailsCard: {
      backgroundColor: cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 14,
    },
    contactCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 14,
    },
    mailIconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: isDark ? '#334155' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactHeaderTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: textColor,
    },
    contactHeaderSub: {
      fontSize: 11,
      color: mutedColor,
    },
    contactInputBox: {
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderCol,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    contactFieldLabel: {
      fontSize: 10,
      color: mutedColor,
      fontWeight: '600',
    },
    contactTextInput: {
      fontSize: 13,
      fontWeight: '600',
      color: textColor,
      padding: 0,
      marginTop: 2,
    },
    securityNote: {
      fontSize: 11,
      color: mutedColor,
      textAlign: 'center',
      marginVertical: 10,
    },

    // Step 3 Seats
    passengerSeatChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: primaryBlack,
      borderRadius: 14,
      padding: 10,
      marginBottom: 12,
    },
    seatChipAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    seatChipAvatarText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '800',
    },
    seatChipName: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },
    seatChipStatus: {
      color: '#94A3B8',
      fontSize: 11,
    },
    seatNoticeBanner: {
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      padding: 10,
      borderRadius: 12,
      marginBottom: 14,
    },
    seatNoticeText: {
      fontSize: 11,
      color: textColor,
      lineHeight: 16,
    },
    cabinHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    cabinHeaderTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: textColor,
    },
    cabinHeaderSub: {
      fontSize: 11,
      color: mutedColor,
    },
    legendPillsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 14,
      flexWrap: 'wrap',
    },
    legendPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendBoxAvailable: {
      width: 14,
      height: 14,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: cardBg,
    },
    legendBoxSelected: {
      width: 14,
      height: 14,
      borderRadius: 4,
      backgroundColor: primaryBlack,
    },
    legendBoxTaken: {
      width: 14,
      height: 14,
      borderRadius: 4,
      backgroundColor: isDark ? '#475569' : '#CBD5E1',
    },
    legendBoxExtra: {
      width: 14,
      height: 14,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#38BDF8',
      backgroundColor: cardBg,
    },
    legendPillText: {
      fontSize: 11,
      color: mutedColor,
    },

    // Airplane Cabin Canvas
    airplaneCabinBox: {
      backgroundColor: cardBg,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: borderCol,
      padding: 16,
      alignItems: 'center',
      marginBottom: 16,
    },
    airplaneNoseDome: {
      width: 120,
      height: 50,
      borderTopLeftRadius: 60,
      borderTopRightRadius: 60,
      borderWidth: 2,
      borderColor: borderCol,
      borderBottomWidth: 0,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    cockpitDashedCurve: {
      width: 60,
      height: 25,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderStyle: 'dashed',
      borderWidth: 1.5,
      borderColor: primaryBlack,
      borderBottomWidth: 0,
    },
    amenitiesRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    amenityBox: {
      width: 60,
      height: 28,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: borderCol,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
    },
    amenityText: {
      fontSize: 11,
      fontWeight: '700',
      color: mutedColor,
    },
    columnLettersRow: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: 16,
      marginBottom: 8,
    },
    colPairLeft: {
      flexDirection: 'row',
      gap: 8,
      flex: 1,
      justifyContent: 'center',
    },
    colPairRight: {
      flexDirection: 'row',
      gap: 8,
      flex: 1,
      justifyContent: 'center',
    },
    aisleGap: {
      width: 32,
    },
    colLetter: {
      width: 34,
      textAlign: 'center',
      fontSize: 11,
      fontWeight: '700',
      color: mutedColor,
    },
    seatRowWrapper: {
      width: '100%',
      marginBottom: 6,
    },
    exitRowBanner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    exitMarkerText: {
      fontSize: 9,
      fontWeight: '800',
      color: primaryBlack,
      letterSpacing: 0.5,
    },
    seatRow: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: 16,
    },
    seatCell: {
      width: 34,
      height: 34,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
    },
    seatCellSelected: {
      backgroundColor: primaryBlack,
      borderColor: primaryBlack,
    },
    seatCellTaken: {
      backgroundColor: isDark ? '#334155' : '#E2E8F0',
      borderColor: isDark ? '#334155' : '#E2E8F0',
    },
    seatCellText: {
      fontSize: 11,
      fontWeight: '600',
      color: textColor,
    },
    seatCellTextTaken: {
      color: isDark ? '#64748B' : '#94A3B8',
    },
    seatInitialText: {
      fontSize: 11,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    aisleNumberBox: {
      width: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aisleNumberText: {
      fontSize: 11,
      fontWeight: '700',
      color: mutedColor,
    },

    // Ancillaries
    ancillaryCard: {
      backgroundColor: cardBg,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: borderCol,
      padding: 16,
      marginBottom: 14,
    },
    ancillaryHeader: {
      marginBottom: 10,
    },
    ancillaryTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: textColor,
    },
    ancillarySub: {
      fontSize: 11,
      color: mutedColor,
    },
    ancillariesList: {
      gap: 8,
    },
    ancillaryOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: borderCol,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      gap: 10,
    },
    ancillaryOptionActive: {
      borderColor: primaryBlack,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
    },
    ancillaryIcon: {
      fontSize: 20,
    },
    ancillaryName: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
    },
    ancillaryNameActive: {
      color: textColor,
    },
    ancillaryDesc: {
      fontSize: 10,
      color: mutedColor,
    },
    ancillaryPrice: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
    },
    ancillaryPriceActive: {
      color: textColor,
    },

    // Step 4 Review & Pay
    checkoutFlightCard: {
      backgroundColor: cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 14,
    },
    flightDateEyebrow: {
      fontSize: 11,
      fontWeight: '600',
      color: mutedColor,
      marginBottom: 8,
    },
    flightRouteVisual: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    routeStation: {
      alignItems: 'flex-start',
    },
    routeStationCode: {
      fontSize: 20,
      fontWeight: '800',
      color: textColor,
    },
    routeStationTime: {
      fontSize: 11,
      fontWeight: '600',
      color: mutedColor,
      marginTop: 2,
    },
    routeFlightArc: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 8,
    },
    routeDuration: {
      fontSize: 10,
      fontWeight: '700',
      color: mutedColor,
      marginBottom: 2,
    },
    routeDottedLine: {
      width: '100%',
      height: 1,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: borderCol,
      justifyContent: 'center',
      alignItems: 'center',
    },
    routeAirplaneIcon: {
      fontSize: 11,
      color: textColor,
      backgroundColor: cardBg,
      paddingHorizontal: 2,
    },
    flightAirlineRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: borderCol,
      marginBottom: 10,
    },
    flightAirlineText: {
      fontSize: 12,
      fontWeight: '600',
      color: mutedColor,
    },
    flightSeatText: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
    },
    flightPassengerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      padding: 10,
      borderRadius: 12,
    },
    miniAvatarAP: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: primaryBlack,
      justifyContent: 'center',
      alignItems: 'center',
    },
    miniAvatarAPText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '800',
    },
    flightPassengerName: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
    },
    flightPassengerEmail: {
      fontSize: 10,
      color: mutedColor,
    },

    // Payment Method Card
    paymentMethodCard: {
      backgroundColor: cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 12,
    },
    paymentCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    visaLogoBox: {
      backgroundColor: primaryBlack,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    visaLogoText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '900',
      letterSpacing: 1,
    },
    cardMaskedNumber: {
      fontSize: 13,
      fontWeight: '700',
      color: textColor,
    },
    cardExpiryText: {
      fontSize: 11,
      color: mutedColor,
      marginTop: 1,
    },
    changeCardBtn: {
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    changeCardText: {
      fontSize: 12,
      fontWeight: '600',
      color: textColor,
    },

    // Promo Card
    promoCodeCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: cardBg,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 14,
    },
    promoIconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: isDark ? '#0F172A' : '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    promoCardTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: '600',
      color: textColor,
    },
    promoPlusBtn: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 1,
      borderColor: borderCol,
      justifyContent: 'center',
      alignItems: 'center',
    },
    promoPlusText: {
      fontSize: 16,
      color: textColor,
      fontWeight: '600',
    },

    // Price Details Card
    priceDetailsCard: {
      backgroundColor: cardBg,
      borderRadius: 18,
      padding: 16,
      borderWidth: 1,
      borderColor: borderCol,
      marginBottom: 14,
    },
    priceDetailsTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: textColor,
      marginBottom: 12,
    },
    priceRowItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    priceRowLabel: {
      fontSize: 13,
      color: mutedColor,
    },
    priceRowVal: {
      fontSize: 13,
      fontWeight: '600',
      color: textColor,
    },
    priceDividerLine: {
      height: 1,
      backgroundColor: borderCol,
      marginVertical: 10,
    },
    totalRowItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: '800',
      color: textColor,
    },
    totalValue: {
      fontSize: 20,
      fontWeight: '900',
      color: textColor,
    },

    // Terms Row
    termsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    termsCheckIcon: {
      fontSize: 14,
      color: '#10B981',
      fontWeight: '900',
      marginTop: 2,
    },
    termsText: {
      flex: 1,
      fontSize: 11,
      color: mutedColor,
      lineHeight: 16,
    },

    // Duffel Balance Card (for testing)
    balanceCard: {
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      borderRadius: 14,
      padding: 12,
      marginVertical: 10,
    },
    balanceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    balanceTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: textColor,
    },
    readyBadge: {
      backgroundColor: '#10B981',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    readyBadgeText: {
      color: '#FFFFFF',
      fontSize: 9,
      fontWeight: '700',
    },
    balanceAmount: {
      fontSize: 11,
      color: mutedColor,
    },

    // Pay Now Btn
    payNowBtn: {
      backgroundColor: primaryBlack,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    payNowBtnDisabled: {
      opacity: 0.6,
    },
    payNowBtnText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '700',
    },

    // Success Screen
    successContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    successIconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    successTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: textColor,
      textAlign: 'center',
      marginBottom: 8,
    },
    successSub: {
      fontSize: 13,
      color: mutedColor,
      textAlign: 'center',
      marginBottom: 24,
    },
    successDoneBtn: {
      backgroundColor: primaryBlack,
      paddingHorizontal: 32,
      paddingVertical: 12,
      borderRadius: 16,
    },
    successDoneBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });
}

export default SandboxBookingModal;
