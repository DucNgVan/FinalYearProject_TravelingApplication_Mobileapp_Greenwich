import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { usePaymentStore } from '../../stores/payment.store';
import { useThemeStore } from '../../stores/theme.store';
import { REDESIGN_THEME } from '../../theme/designTokens';
import {
  ChevronLeftIcon,
  PlusIcon,
  CloseIcon,
  CheckIcon,
  CardIcon,
} from '../../components/common/NomadixIcons';

const PaymentCardsModal = ({ visible, onClose }) => {
  const { mode } = useThemeStore();
  const isDark = mode === 'dark';

  const {
    cards,
    getDefaultCard,
    formatCardNumber,
    formatExpiry,
    detectCardBrand,
    addCard,
    setDefaultCard,
    removeCard,
  } = usePaymentStore();

  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardHolder, setNewCardHolder] = useState('');
  const [newExpiry, setNewExpiry] = useState('');
  const [newCvv, setNewCvv] = useState('');
  const [makeDefault, setMakeDefault] = useState(true);

  if (!visible) return null;

  const activeCard = getDefaultCard() || cards[0];

  const handleCardNumberChange = (text) => {
    setNewCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text) => {
    setNewExpiry(formatExpiry(text));
  };

  const handleSaveCard = () => {
    const cleanNum = newCardNumber.replace(/\D/g, '');
    if (cleanNum.length < 15) {
      Alert.alert('Invalid Card', 'Please enter a valid 16-digit card number.');
      return;
    }
    if (!newCardHolder.trim()) {
      Alert.alert('Invalid Name', 'Please enter cardholder name.');
      return;
    }
    if (newExpiry.length < 5) {
      Alert.alert('Invalid Expiry', 'Please enter expiry in MM/YY format.');
      return;
    }
    if (newCvv.length < 3) {
      Alert.alert('Invalid CVV', 'Please enter 3 or 4 digit CVV code.');
      return;
    }

    addCard({
      cardNumber: newCardNumber,
      cardHolder: newCardHolder,
      expiryDate: newExpiry,
      cvv: newCvv,
      isDefault: makeDefault,
    });

    // Reset & close form
    setNewCardNumber('');
    setNewCardHolder('');
    setNewExpiry('');
    setNewCvv('');
    setIsAddingCard(false);
  };

  const handleRemoveActiveCard = () => {
    if (!activeCard) return;
    if (cards.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one card on file.');
      return;
    }
    removeCard(activeCard.id);
  };

  const detectedBrand = detectCardBrand(newCardNumber);

  const bg = isDark ? '#121316' : '#F8FAFC';
  const cardBg = isDark ? '#1C1D21' : '#FFFFFF';
  const textColor = isDark ? '#FFFFFF' : (REDESIGN_THEME.dark || '#0E1B2C');
  const textMuted = isDark ? '#94A3B8' : (REDESIGN_THEME.textMuted || '#5B6776');
  const borderColor = isDark ? '#2A2D35' : (REDESIGN_THEME.border || '#E5E7EB');
  const inputBg = isDark ? '#0E1B2C' : '#FAFAFA';

  return (
    <View testID="subscreen-payment" style={[styles.container, { backgroundColor: bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="btn-back-cards"
          style={[styles.iconBtn, { backgroundColor: isDark ? '#1C1D21' : '#FFFFFF', borderColor }]}
          onPress={isAddingCard ? () => setIsAddingCard(false) : onClose}
          activeOpacity={0.7}
        >
          <ChevronLeftIcon size={20} color={textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          {isAddingCard ? 'Add New Card' : 'Payment Cards'}
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {!isAddingCard ? (
          cards.length === 0 ? (
            <View testID="cards-empty-state" style={styles.emptyContainer}>
              <View style={[styles.emptyIconCircle, { backgroundColor: isDark ? '#1C1D21' : '#F1F5F9' }]}>
                <CardIcon size={34} color={isDark ? '#64748B' : '#94A3B8'} />
              </View>
              <Text style={[styles.emptyTitle, { color: textColor }]}>Chưa có thẻ thanh toán</Text>
              <Text style={[styles.emptySub, { color: textMuted }]}>
                Bạn chưa lưu thẻ thanh toán nào. Thêm thẻ tín dụng hoặc ghi nợ để đặt vé máy bay và khách sạn nhanh chóng hơn.
              </Text>
              <TouchableOpacity
                testID="btn-empty-add-card"
                style={[styles.addCardBtn, { marginTop: 24, width: '100%' }]}
                onPress={() => setIsAddingCard(true)}
                activeOpacity={0.8}
              >
                <PlusIcon size={18} color={REDESIGN_THEME.tealDark || '#0B6B67'} />
                <Text style={[styles.addCardBtnText, { color: REDESIGN_THEME.tealDark || '#0B6B67' }]}>
                  Add new card
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {/* Clean Credit Card Preview (No faux stacked back card) */}
              <View style={styles.cardStackWrapper}>
              {/* Front Card (Navy-Teal Gradient) */}
              <View style={styles.frontCard}>
                <View style={styles.cardTopRow}>
                  {/* Gold Microchip */}
                  <View style={styles.goldChip} />
                  <Text style={styles.cardBrandText}>{activeCard?.brand || 'VISA'}</Text>
                </View>

                <Text style={styles.cardNumberText}>
                  {activeCard?.cardNumber || '•••• •••• •••• 4821'}
                </Text>

                <View style={styles.cardBottomRow}>
                  <View>
                    <Text style={styles.cardFieldLabel}>CARD HOLDER</Text>
                    <Text style={styles.cardFieldValue}>
                      {activeCard?.cardHolder || 'GUEST TRAVELER'}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.cardFieldLabel}>EXPIRES</Text>
                    <Text style={styles.cardFieldValue}>
                      {activeCard?.expiryDate || '08/28'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card Details Box */}
            <View style={[styles.detailsBox, { backgroundColor: cardBg, borderColor }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailTitle, { color: textColor }]}>Default payment method</Text>
                <TouchableOpacity
                  testID="toggle-default-card"
                  style={[
                    styles.switchTrack,
                    { backgroundColor: activeCard?.isDefault ? (REDESIGN_THEME.teal || '#0B7A75') : '#CBD5E1' },
                  ]}
                  onPress={() => activeCard && setDefaultCard(activeCard.id)}
                >
                  <View
                    style={[
                      styles.switchThumb,
                      activeCard?.isDefault ? { right: 3 } : { left: 3 },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              <View style={[styles.detailRow, { borderTopWidth: 1, borderColor }]}>
                <Text style={[styles.detailSubLabel, { color: textMuted }]}>Card type</Text>
                <Text style={[styles.detailSubValue, { color: textColor }]}>{activeCard?.cardType || 'Visa · Credit'}</Text>
              </View>

              <View style={[styles.detailRow, { borderTopWidth: 1, borderColor }]}>
                <Text style={[styles.detailSubLabel, { color: textMuted }]}>Used for</Text>
                <Text style={[styles.detailSubValue, { color: textColor }]}>
                  {activeCard?.usedFor || 'Flights & hotel bookings'}
                </Text>
              </View>
            </View>

            {/* Add New Card Button */}
            <TouchableOpacity
              testID="btn-add-card"
              style={[styles.addCardBtn, { borderColor, backgroundColor: cardBg }]}
              onPress={() => setIsAddingCard(true)}
              activeOpacity={0.7}
            >
              <PlusIcon size={20} color={REDESIGN_THEME.tealDark || '#0B6B67'} />
              <Text style={[styles.addCardBtnText, { color: REDESIGN_THEME.tealDark || '#0B6B67' }]}>Add new card</Text>
            </TouchableOpacity>

            {/* Remove Card Button */}
            {cards.length > 1 && (
              <TouchableOpacity
                testID="btn-remove-card"
                style={styles.removeCardBtn}
                onPress={handleRemoveActiveCard}
                activeOpacity={0.7}
              >
                <Text style={styles.removeCardBtnText}>Remove this card</Text>
              </TouchableOpacity>
            )}
            </>
          )
        ) : (
          /* Add Card Form */
          <View style={styles.formContainer}>
            {/* Live Preview Card */}
            <View style={styles.previewCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.goldChip} />
                <Text style={styles.cardBrandText}>{detectedBrand}</Text>
              </View>
              <Text style={styles.cardNumberText}>
                {newCardNumber || '•••• •••• •••• ••••'}
              </Text>
              <View style={styles.cardBottomRow}>
                <View>
                  <Text style={styles.cardFieldLabel}>CARD HOLDER</Text>
                  <Text style={styles.cardFieldValue}>
                    {newCardHolder.toUpperCase() || 'YOUR NAME'}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.cardFieldLabel}>EXPIRES</Text>
                  <Text style={styles.cardFieldValue}>{newExpiry || 'MM/YY'}</Text>
                </View>
              </View>
            </View>

            {/* Form Inputs */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textMuted }]}>Card Number</Text>
              <TextInput
                testID="input-card-number"
                style={[styles.textInput, { backgroundColor: inputBg, color: textColor, borderColor }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={textMuted}
                value={newCardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                maxLength={19}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: textMuted }]}>Cardholder Name</Text>
              <TextInput
                testID="input-card-holder"
                style={[styles.textInput, { backgroundColor: inputBg, color: textColor, borderColor }]}
                placeholder="FULL NAME"
                placeholderTextColor={textMuted}
                value={newCardHolder}
                onChangeText={setNewCardHolder}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.rowTwoInputs}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>Expiry (MM/YY)</Text>
                <TextInput
                  testID="input-card-expiry"
                  style={[styles.textInput, { backgroundColor: inputBg, color: textColor, borderColor }]}
                  placeholder="MM/YY"
                  placeholderTextColor={textMuted}
                  value={newExpiry}
                  onChangeText={handleExpiryChange}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={[styles.inputLabel, { color: textMuted }]}>CVV / CVC</Text>
                <TextInput
                  testID="input-card-cvv"
                  style={[styles.textInput, { backgroundColor: inputBg, color: textColor, borderColor }]}
                  placeholder="123"
                  placeholderTextColor={textMuted}
                  value={newCvv}
                  onChangeText={setNewCvv}
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={4}
                />
              </View>
            </View>

            {/* Default checkbox */}
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setMakeDefault(!makeDefault)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  { borderColor },
                  makeDefault && { backgroundColor: REDESIGN_THEME.teal || '#0B7A75', borderColor: REDESIGN_THEME.teal || '#0B7A75' },
                ]}
              >
                {makeDefault && <CheckIcon size={14} color="#FFFFFF" />}
              </View>
              <Text style={[styles.checkboxLabel, { color: textColor }]}>Set as default payment method</Text>
            </TouchableOpacity>

            {/* Save Card Button */}
            <TouchableOpacity
              testID="btn-save-card"
              style={[styles.saveCardBtn, { backgroundColor: REDESIGN_THEME.teal || '#0B7A75' }]}
              onPress={handleSaveCard}
              activeOpacity={0.8}
            >
              <Text style={styles.saveCardBtnText}>Save Card</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PaymentCardsModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    height: 52,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  cardStackWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  frontCard: {
    borderRadius: 28,
    padding: 22,
    backgroundColor: '#0E1B2C',
    justifyContent: 'space-between',
    minHeight: 204,
    shadowColor: '#0E1B2C',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  goldChip: {
    width: 42,
    height: 30,
    borderRadius: 7,
    backgroundColor: '#D9A85B',
  },
  cardBrandText: {
    fontSize: 26,
    fontWeight: '800',
    fontStyle: 'italic',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
  cardNumberText: {
    fontSize: 21,
    fontWeight: '700',
    letterSpacing: 3,
    color: '#FFFFFF',
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardFieldLabel: {
    fontSize: 10,
    letterSpacing: 1.2,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  cardFieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 2,
  },
  detailsBox: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 16,
  },
  detailRow: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  detailSubLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  detailSubValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  switchTrack: {
    width: 46,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    position: 'relative',
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
  addCardBtn: {
    height: 56,
    borderRadius: 20,
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  addCardBtnText: {
    fontSize: 15,
    fontWeight: '700',
  },
  removeCardBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  removeCardBtnText: {
    color: '#A8341D',
    fontSize: 14,
    fontWeight: '700',
  },
  formContainer: {
    marginTop: 10,
  },
  previewCard: {
    height: 190,
    borderRadius: 26,
    padding: 20,
    backgroundColor: '#0E1B2C',
    justifyContent: 'space-between',
    marginBottom: 20,
    shadowColor: '#0E1B2C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  rowTwoInputs: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 14,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveCardBtn: {
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveCardBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 56,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 290,
  },
});
