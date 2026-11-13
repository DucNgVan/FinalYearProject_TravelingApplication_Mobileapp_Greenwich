import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import colors from '../../theme/colors';

const ROWS = [
  { row: 10, type: 'Extra Legroom', surcharge: 120000 },
  { row: 11, type: 'Extra Legroom', surcharge: 120000 },
  { row: 12, type: 'Standard', surcharge: 80000 },
  { row: 13, type: 'Standard', surcharge: 50000 },
  { row: 14, type: 'Standard', surcharge: 50000 },
  { row: 15, type: 'Standard', surcharge: 50000 },
  { row: 16, type: 'Standard', surcharge: 50000 },
  { row: 17, type: 'Standard', surcharge: 50000 },
  { row: 18, type: 'Standard', surcharge: 50000 },
];

const OCCUPIED_SEATS = ['10B', '11C', '11E', '12C', '13A', '15C', '15F', '17B'];

export default function SeatMapSelector({
  visible,
  selectedSeatCode = '12A',
  onSelectSeat,
  onClose,
  aircraft = 'Airbus A321',
}) {
  const { colors: themeColors, mode } = useThemeStore();
  const isDark = mode === 'dark';
  const styles = React.useMemo(() => getStyles(themeColors, isDark), [themeColors, isDark]);

  const [currentSeat, setCurrentSeat] = useState(selectedSeatCode || '12A');

  const handleSeatPress = (seatCode, rowObj, col) => {
    if (OCCUPIED_SEATS.includes(seatCode)) return;
    setCurrentSeat(seatCode);
    const isWindow = col === 'A' || col === 'F';
    const isAisle = col === 'C' || col === 'D';
    const seatType = rowObj.type === 'Extra Legroom'
      ? 'Extra Legroom'
      : (isWindow ? 'Window' : (isAisle ? 'Aisle' : 'Standard'));
    
    onSelectSeat?.({
      code: seatCode,
      type: seatType,
      surcharge: rowObj.surcharge,
    });
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
            <View>
              <Text style={styles.title}>Cabin Seat Map</Text>
              <Text style={styles.subtitle}>{aircraft} • 3-3 Cabin Layout</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Legend */}
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatAvailable]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatSelected]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendBox, styles.seatOccupied]} />
              <Text style={styles.legendText}>Occupied</Text>
            </View>
          </View>

          {/* Cabin Layout */}
          <ScrollView style={styles.cabinScroll} showsVerticalScrollIndicator={false}>
            {/* Front cockpit indicator */}
            <View style={styles.cockpitIndicator}>
              <Text style={styles.cockpitText}>▲ FRONT / CABIN NOSE ▲</Text>
            </View>

            {/* Column letters */}
            <View style={styles.colHeaderRow}>
              <Text style={styles.colLetter}>A</Text>
              <Text style={styles.colLetter}>B</Text>
              <Text style={styles.colLetter}>C</Text>
              <View style={styles.aisleSpace}><Text style={styles.aisleText}>AISLE</Text></View>
              <Text style={styles.colLetter}>D</Text>
              <Text style={styles.colLetter}>E</Text>
              <Text style={styles.colLetter}>F</Text>
            </View>

            {/* Seat Rows */}
            {ROWS.map((rowObj) => {
              const r = rowObj.row;
              return (
                <View key={r} style={styles.rowWrapper}>
                  {/* Left seats: A, B, C */}
                  {['A', 'B', 'C'].map((col) => {
                    const code = `${r}${col}`;
                    const isOccupied = OCCUPIED_SEATS.includes(code);
                    const isSelected = currentSeat === code;

                    return (
                      <TouchableOpacity
                        key={code}
                        testID={`seat-pill-${code}`}
                        style={[
                          styles.seatPill,
                          isOccupied && styles.seatPillOccupied,
                          isSelected && styles.seatPillSelected,
                        ]}
                        disabled={isOccupied}
                        onPress={() => handleSeatPress(code, rowObj, col)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            isOccupied && styles.seatTextOccupied,
                            isSelected && styles.seatTextSelected,
                          ]}
                        >
                          {col}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Aisle row number */}
                  <View style={styles.aisleNumber}>
                    <Text style={styles.rowNumberText}>{r}</Text>
                  </View>

                  {/* Right seats: D, E, F */}
                  {['D', 'E', 'F'].map((col) => {
                    const code = `${r}${col}`;
                    const isOccupied = OCCUPIED_SEATS.includes(code);
                    const isSelected = currentSeat === code;

                    return (
                      <TouchableOpacity
                        key={code}
                        testID={`seat-pill-${code}`}
                        style={[
                          styles.seatPill,
                          isOccupied && styles.seatPillOccupied,
                          isSelected && styles.seatPillSelected,
                        ]}
                        disabled={isOccupied}
                        onPress={() => handleSeatPress(code, rowObj, col)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.seatText,
                            isOccupied && styles.seatTextOccupied,
                            isSelected && styles.seatTextSelected,
                          ]}
                        >
                          {col}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>

          {/* Footer Selection Summary & Confirm Button */}
          <View style={styles.footer}>
            <View>
              <Text style={styles.selectedSeatLabel}>Selected Seat:</Text>
              <Text style={styles.selectedSeatCode}>{currentSeat} • Economy</Text>
            </View>
            <TouchableOpacity style={styles.confirmBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.confirmBtnText}>Confirm Seat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (themeColors, isDark) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    },
    backdrop: {
      flex: 1,
    },
    sheetContainer: {
      backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 36,
      maxHeight: '85%',
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: isDark ? '#2A2D35' : '#E2E8F0',
      alignSelf: 'center',
      marginBottom: 12,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    title: {
      fontSize: 16,
      fontWeight: '800',
      color: themeColors.text,
    },
    subtitle: {
      fontSize: 12,
      color: themeColors.textMuted,
      marginTop: 2,
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#F1F5F9',
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      fontSize: 13,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    legendRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: isDark ? '#2A2D35' : '#E2E8F0',
      marginBottom: 12,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendBox: {
      width: 14,
      height: 14,
      borderRadius: 4,
    },
    legendText: {
      fontSize: 11,
      fontWeight: '600',
      color: themeColors.textMuted,
    },
    seatAvailable: {
      backgroundColor: isDark ? '#2A2D35' : '#E2E8F0',
      borderWidth: 1,
      borderColor: isDark ? '#3E424D' : '#CBD5E1',
    },
    seatSelected: {
      backgroundColor: isDark ? '#FFFFFF' : '#111827',
    },
    seatOccupied: {
      backgroundColor: isDark ? '#18191B' : '#E5E7EB',
      opacity: 0.4,
    },
    cabinScroll: {
      marginVertical: 4,
      maxHeight: 320,
    },
    cockpitIndicator: {
      alignItems: 'center',
      paddingVertical: 6,
      backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
      borderRadius: 8,
      marginBottom: 12,
    },
    cockpitText: {
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
      color: themeColors.textMuted,
    },
    colHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      marginBottom: 8,
    },
    colLetter: {
      width: 38,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    aisleSpace: {
      width: 44,
      alignItems: 'center',
    },
    aisleText: {
      fontSize: 9,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: themeColors.textMuted,
      opacity: 0.6,
    },
    rowWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 8,
      marginBottom: 8,
    },
    seatPill: {
      width: 38,
      height: 38,
      borderRadius: 8,
      backgroundColor: isDark ? '#25272C' : '#F1F5F9',
      borderWidth: 1,
      borderColor: isDark ? '#363942' : '#CBD5E1',
      alignItems: 'center',
      justifyContent: 'center',
    },
    seatPillOccupied: {
      backgroundColor: isDark ? '#161719' : '#E5E7EB',
      borderColor: 'transparent',
      opacity: 0.35,
    },
    seatPillSelected: {
      backgroundColor: isDark ? '#FFFFFF' : '#111827',
      borderColor: isDark ? '#FFFFFF' : '#111827',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 3,
    },
    seatText: {
      fontSize: 12,
      fontWeight: '700',
      color: themeColors.text,
    },
    seatTextOccupied: {
      color: themeColors.textMuted,
    },
    seatTextSelected: {
      color: isDark ? '#111827' : '#FFFFFF',
      fontWeight: '800',
    },
    aisleNumber: {
      width: 44,
      alignItems: 'center',
    },
    rowNumberText: {
      fontSize: 11,
      fontWeight: '700',
      color: themeColors.textMuted,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
      borderColor: isDark ? '#2A2D35' : '#E2E8F0',
    },
    selectedSeatLabel: {
      fontSize: 11,
      color: themeColors.textMuted,
    },
    selectedSeatCode: {
      fontSize: 15,
      fontWeight: '800',
      color: themeColors.text,
      marginTop: 2,
    },
    confirmBtn: {
      backgroundColor: isDark ? '#FFFFFF' : '#111827',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 16,
    },
    confirmBtnText: {
      color: isDark ? '#111827' : '#FFFFFF',
      fontWeight: '700',
      fontSize: 13,
    },
  });
