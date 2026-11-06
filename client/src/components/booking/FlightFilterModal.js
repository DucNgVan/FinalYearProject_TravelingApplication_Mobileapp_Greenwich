import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';

const FlightFilterModal = ({ visible, filters = {}, onClose, onApply, onReset }) => {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const [sortBy, setSortBy] = useState(filters.sortBy || 'price');
  const [showDirect, setShowDirect] = useState(filters.showDirect !== false);
  const [showTransit, setShowTransit] = useState(filters.showTransit !== false);
  const [hasBaggage, setHasBaggage] = useState(filters.hasBaggage === true);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 10000000);

  useEffect(() => {
    if (visible && filters) {
      setSortBy(filters.sortBy || 'price');
      setShowDirect(filters.showDirect !== false);
      setShowTransit(filters.showTransit !== false);
      setHasBaggage(filters.hasBaggage === true);
      setMaxPrice(filters.maxPrice || 10000000);
    }
  }, [visible, filters]);

  const handleApply = () => {
    onApply({
      sortBy,
      showDirect,
      showTransit,
      hasBaggage,
      maxPrice,
    });
  };

  const handleReset = () => {
    setSortBy('price');
    setShowDirect(true);
    setShowTransit(true);
    setHasBaggage(false);
    setMaxPrice(10000000);
    if (onReset) onReset();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheetContainer}>
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleReset}>
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Flight Filters</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Sort Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SORT BY</Text>
              <View style={styles.sortGrid}>
                <TouchableOpacity
                  style={[styles.sortBtn, sortBy === 'price' && styles.sortBtnActive]}
                  onPress={() => setSortBy('price')}
                >
                  <Text style={[styles.sortBtnText, sortBy === 'price' && styles.sortBtnTextActive]}>
                    Cheapest
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sortBtn, (sortBy === 'departure_early' || sortBy === 'time') && styles.sortBtnActive]}
                  onPress={() => setSortBy('departure_early')}
                >
                  <Text style={[styles.sortBtnText, (sortBy === 'departure_early' || sortBy === 'time') && styles.sortBtnTextActive]}>
                    Early Flight
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sortBtn, sortBy === 'departure_late' && styles.sortBtnActive]}
                  onPress={() => setSortBy('departure_late')}
                >
                  <Text style={[styles.sortBtnText, sortBy === 'departure_late' && styles.sortBtnTextActive]}>
                    Late Flight
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.sortBtn, sortBy === 'duration' && styles.sortBtnActive]}
                  onPress={() => setSortBy('duration')}
                >
                  <Text style={[styles.sortBtnText, sortBy === 'duration' && styles.sortBtnTextActive]}>
                    Fastest (Shortest)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Flight Type Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>FLIGHT TYPE</Text>
              <View style={styles.toggleRow}>
                <TouchableOpacity
                  style={[styles.typeOption, showDirect && styles.typeOptionActive]}
                  onPress={() => setShowDirect(!showDirect)}
                >
                  <Text style={[styles.checkbox, showDirect && styles.checkboxActive]}>
                    {showDirect ? '✓' : ''}
                  </Text>
                  <Text style={styles.optionLabel}>Direct</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.typeOption, showTransit && styles.typeOptionActive]}
                  onPress={() => setShowTransit(!showTransit)}
                >
                  <Text style={[styles.checkbox, showTransit && styles.checkboxActive]}>
                    {showTransit ? '✓' : ''}
                  </Text>
                  <Text style={styles.optionLabel}>Connecting</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Baggage Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>BAGGAGE & AMENITIES</Text>
              <TouchableOpacity
                style={[styles.baggageOption, hasBaggage && styles.baggageOptionActive]}
                onPress={() => setHasBaggage(!hasBaggage)}
              >
                <View style={styles.baggageOptionLeft}>
                  <Text style={styles.baggageIcon}>🧳</Text>
                  <View>
                    <Text style={styles.optionLabel}>Includes Checked Baggage</Text>
                    <Text style={styles.optionSub}>Only show flights with 20kg+ checked baggage</Text>
                  </View>
                </View>
                <Text style={[styles.checkbox, hasBaggage && styles.checkboxActive]}>
                  {hasBaggage ? '✓' : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer Submit */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.applyBtn} activeOpacity={0.8} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  resetBtnText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(142, 142, 147, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
  },
  content: {
    marginVertical: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  sortGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sortBtn: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  sortBtnActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(10, 132, 255, 0.12)',
  },
  sortBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  sortBtnTextActive: {
    fontWeight: '800',
    color: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    gap: 8,
  },
  typeOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(10, 132, 255, 0.08)',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  optionSub: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  baggageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  baggageOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(10, 132, 255, 0.08)',
  },
  baggageOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    paddingRight: 10,
  },
  baggageIcon: {
    fontSize: 22,
  },
  footer: {
    paddingTop: 8,
  },
  applyBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});

export default FlightFilterModal;
