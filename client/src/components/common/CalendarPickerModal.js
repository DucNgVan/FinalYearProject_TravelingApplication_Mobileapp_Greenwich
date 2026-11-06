import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useThemeStore } from '../../stores/theme.store';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPickerModal({
  visible = false,
  selectedDate = '2026-10-15',
  onSelectDate,
  onClose,
  title = 'Select Departure Date',
  minDate,
  testID,
}) {
  const { colors: themeColors } = useThemeStore();
  const styles = React.useMemo(() => getStyles(themeColors), [themeColors]);
  const todayStr = new Date().toISOString().split('T')[0];
  const effectiveMinDate =
    minDate !== undefined
      ? minDate
      : selectedDate && selectedDate < todayStr
      ? selectedDate
      : todayStr;

  // Parse initial year and month
  const initialDate = selectedDate ? new Date(selectedDate) : new Date(2026, 9, 15);
  const [currentYear, setCurrentYear] = useState(
    isNaN(initialDate.getFullYear()) ? 2026 : initialDate.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState(
    isNaN(initialDate.getMonth()) ? 9 : initialDate.getMonth() // 0-indexed: 9 is October
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  // Day of week of the 1st day of month (0 = Sun, 1 = Mon ... 6 = Sat)
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startingCol = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const daysGrid = [];
  // Leading blank cells
  for (let i = 0; i < startingCol; i++) {
    daysGrid.push({ day: null, key: `empty-${i}` });
  }
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateString = `${currentYear}-${formattedMonth}-${formattedDay}`;
    const isDisabled = Boolean(effectiveMinDate && dateString < effectiveMinDate);
    daysGrid.push({
      day,
      dateString,
      isSelected: dateString === selectedDate,
      isDisabled,
      key: `day-${day}`,
    });
  }

  const handleSelectDay = (dateString, isDisabled = false) => {
    if (!dateString || isDisabled) return;
    onSelectDate?.(dateString);
    onClose?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.overlay} testID={testID ? `${testID}-overlay` : undefined}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} testID="cal-close-btn">
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Month Navigator */}
          <View style={styles.monthNav}>
            <TouchableOpacity
              onPress={handlePrevMonth}
              style={styles.navBtn}
              testID="cal-prev-month"
            >
              <Text style={styles.navText}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[currentMonth]} {currentYear}
            </Text>
            <TouchableOpacity
              onPress={handleNextMonth}
              style={styles.navBtn}
              testID="cal-next-month"
            >
              <Text style={styles.navText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Days of Week Header */}
          <View style={styles.weekRow}>
            {DAYS_OF_WEEK.map((dw) => (
              <View key={dw} style={styles.weekCol}>
                <Text style={styles.weekText}>{dw}</Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.grid}>
            {daysGrid.map((item) => {
              if (!item.day) {
                return <View key={item.key} style={styles.dayCol} />;
              }
              return (
                <TouchableOpacity
                  key={item.key}
                  testID={`cal-day-${item.dateString}`}
                  disabled={item.isDisabled}
                  style={[
                    styles.dayCol,
                    styles.dayCell,
                    item.isSelected && styles.dayCellSelected,
                    item.isDisabled && { opacity: 0.35 },
                  ]}
                  onPress={() => handleSelectDay(item.dateString, item.isDisabled)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayText,
                      item.isSelected && styles.dayTextSelected,
                      item.isDisabled && { color: themeColors.textMuted },
                    ]}
                  >
                    {item.day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    fontSize: 16,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  closeText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  monthTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.text,
    fontSize: 15,
  },
  navBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: colors.text,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
  },
  weekText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCol: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayCell: {
    borderRadius: 20,
  },
  dayCellSelected: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
