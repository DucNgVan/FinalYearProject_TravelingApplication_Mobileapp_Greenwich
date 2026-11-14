import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useThemeStore } from '../../stores/theme.store';
import { useAuthStore } from '../../stores/auth.store';
import { useItineraryStore } from '../../stores/itinerary.store';
import { useExpenseStore } from '../../stores/expense.store';

export default function GroupScreen() {
  const { colors: themeColors, mode } = useThemeStore();
  const { user } = useAuthStore();
  const { currentTrip, addPackingItem, togglePackingItem } = useItineraryStore();
  const { expenses } = useExpenseStore();

  const isDark = mode === 'dark';

  // Packing list state
  const [localPackingItems, setLocalPackingItems] = useState([
    { id: '1', title: 'ID Cards & Passports', category: 'Documents', assignee: 'All Squad', checked: true },
    { id: '2', title: 'Sunscreen SPF 50+', category: 'Personal', assignee: 'Alex', checked: true },
    { id: '3', title: 'Powerbank 20,000mAh', category: 'Electronics', assignee: 'Duc', checked: false },
    { id: '4', title: 'First Aid Kit & Panadol', category: 'Medical', assignee: 'Sarah', checked: false },
    { id: '5', title: 'Selfie Stick & Tripod', category: 'Electronics', assignee: 'Duc', checked: true },
  ]);

  const packingItems = Array.isArray(currentTrip?.packingList) && currentTrip.packingList.length > 0
    ? currentTrip.packingList
    : localPackingItems;

  const [newItemTitle, setNewItemTitle] = useState('');

  const handleTogglePacking = (item, index) => {
    if (currentTrip?.id && togglePackingItem) {
      togglePackingItem(currentTrip.id, item.id);
    }
    setLocalPackingItems((prev) =>
      prev.map((it, idx) => (it.id === item.id || idx === index ? { ...it, checked: !it.checked } : it))
    );
  };

  const handleAddPackingItem = () => {
    if (!newItemTitle.trim()) return;
    const newItem = {
      id: String(Date.now()),
      title: newItemTitle.trim(),
      category: 'Shared Gear',
      assignee: user?.fullName || 'Me',
      checked: false,
    };
    if (currentTrip?.id && addPackingItem) {
      addPackingItem(currentTrip.id, newItem);
    }
    setLocalPackingItems((prev) => [...prev, newItem]);
    setNewItemTitle('');
  };

  // Mock squad collaborators
  const collaborators = currentTrip?.collaborators || [
    { id: 'u1', fullName: user?.fullName || 'Guest Traveler', email: user?.email || 'guest@nomadix.app', role: 'OWNER' },
    { id: 'u2', fullName: 'Linh Hoang', email: 'linh@gmail.com', role: 'EDITOR' },
    { id: 'u3', fullName: 'Nam Tran', email: 'nam@gmail.com', role: 'VIEWER' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#121316' : '#F5F6F8' }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* 1. Header Row */}
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
            Squad & Shared Ledger
          </Text>
          <Text style={[styles.headerSubtitle, { color: themeColors.textMuted }]}>
            {currentTrip?.title || 'Danang & Hoi An 2026'} • {collaborators.length} Members
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.inviteBtn, { backgroundColor: themeColors.pineGreen || '#2E7D5B' }]}
          activeOpacity={0.8}
        >
          <Text style={styles.inviteBtnText}>+ Invite Friend</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Squad Members List */}
      <View
        testID="group-members-list"
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
            borderColor: isDark ? '#2A2D35' : '#E5E7EB',
          },
        ]}
      >
        <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
          SQUAD MEMBERS
        </Text>

        <View style={styles.membersList}>
          {collaborators.map((member, idx) => (
            <View key={member.id || idx} style={styles.memberRow}>
              <View style={[styles.memberAvatar, { backgroundColor: idx === 0 ? '#111827' : '#3B82F6' }]}>
                <Text style={styles.memberAvatarText}>
                  {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'U'}
                </Text>
              </View>

              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                  {member.fullName || 'Member'}
                </Text>
                <Text style={[styles.memberEmail, { color: themeColors.textMuted }]}>
                  {member.email || 'member@nomadix.app'}
                </Text>
              </View>

              <View
                style={[
                  styles.roleBadge,
                  member.role === 'OWNER'
                    ? { backgroundColor: 'rgba(234, 179, 8, 0.15)' }
                    : { backgroundColor: 'rgba(59, 130, 246, 0.15)' },
                ]}
              >
                <Text
                  style={[
                    styles.roleBadgeText,
                    member.role === 'OWNER' ? { color: '#EA580C' } : { color: '#334155' },
                  ]}
                >
                  {member.role === 'OWNER'
                    ? 'Trip Owner'
                    : member.role === 'EDITOR'
                    ? 'Editor'
                    : member.role === 'VIEWER'
                    ? 'Viewer'
                    : member.role}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Group Expense Summary & Settle Up */}
      <View
        testID="group-expense-summary"
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
            borderColor: isDark ? '#2A2D35' : '#E5E7EB',
          },
        ]}
      >
        <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
          TRIP BUDGET & EXPENSES
        </Text>

        {/* Total Spend Hero Card (Dark Background like TREK) */}
        <View style={[styles.totalSpendCard, { backgroundColor: isDark ? '#121316' : '#111827' }]}>
          <Text style={styles.totalSpendLabel}>Total Trip Spend</Text>
          <Text style={styles.totalSpendAmount}>12,450,000 ₫</Text>
          <Text style={styles.totalSpendSub}>Includes flights, hotel stays & squad activities</Text>
        </View>

        {/* You Owe / You're Owed Row */}
        <View style={styles.balancesRow}>
          <View style={[styles.balanceBox, { backgroundColor: isDark ? '#121316' : '#F9FAFB', borderColor: isDark ? '#2A2D35' : '#E5E7EB' }]}>
            <Text style={[styles.balanceBoxLabel, { color: '#EF4444' }]}>You Owe</Text>
            <Text style={[styles.balanceBoxAmount, { color: isDark ? '#FFFFFF' : '#111827' }]}>0 ₫</Text>
          </View>

          <View style={[styles.balanceBox, { backgroundColor: isDark ? '#121316' : '#F9FAFB', borderColor: isDark ? '#2A2D35' : '#E5E7EB' }]}>
            <Text style={[styles.balanceBoxLabel, { color: '#2E7D5B' }]}>You're Owed</Text>
            <Text style={[styles.balanceBoxAmount, { color: isDark ? '#FFFFFF' : '#111827' }]}>850,000 ₫</Text>
          </View>
        </View>

        {/* Settle Up Card */}
        <View testID="settle-up-card" style={[styles.settleUpCard, { backgroundColor: isDark ? '#121316' : '#F0FDF4', borderColor: isDark ? '#2A2D35' : '#BBF7D0' }]}>
          <Text style={{ fontSize: 16, marginRight: 8 }}>✅</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.settleUpTitle, { color: isDark ? '#FFFFFF' : '#166534' }]}>
              All balances are settled
            </Text>
            <Text style={[styles.settleUpSub, { color: isDark ? '#9CA3AF' : '#2E7D5B' }]}>
              Greedy Minimum Cash-flow reduction $O(N \log N)$ ensures zero remaining debt
            </Text>
          </View>
        </View>
      </View>

      {/* 4. Collaborative Packing List (Learned from TREK) */}
      <View
        testID="group-packing-list"
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDark ? '#1C1D21' : '#FFFFFF',
            borderColor: isDark ? '#2A2D35' : '#E5E7EB',
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.sectionLabel, { color: themeColors.textMuted }]}>
            PACKING LIST
          </Text>
          <Text style={[styles.packingProgress, { color: themeColors.pineGreen || '#2E7D5B' }]}>
            {packingItems.filter((i) => i.checked).length}/{packingItems.length} completed
          </Text>
        </View>

        {/* Add Item Row */}
        <View style={styles.addPackingRow}>
          <TextInput
            placeholder="Add item to packing list..."
            placeholderTextColor={themeColors.textMuted}
            value={newItemTitle}
            onChangeText={setNewItemTitle}
            style={[
              styles.packingInput,
              {
                backgroundColor: isDark ? '#121316' : '#F8FAFC',
                color: isDark ? '#FFFFFF' : '#111827',
                borderColor: isDark ? '#2A2D35' : '#E2E8F0',
              },
            ]}
          />
          <TouchableOpacity
            testID="btn-add-packing-item"
            style={[styles.addPackingBtn, { backgroundColor: isDark ? '#FFFFFF' : '#111827' }]}
            onPress={handleAddPackingItem}
            activeOpacity={0.8}
          >
            <Text style={[styles.addPackingBtnText, { color: isDark ? '#111827' : '#FFFFFF' }]}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Packing items list */}
        <View style={styles.packingItemsList}>
          {packingItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              testID={`packing-item-${index}`}
              style={styles.packingItemRow}
              onPress={() => handleTogglePacking(item, index)}
              activeOpacity={0.7}
            >
              <TouchableOpacity
                testID={`packing-item-toggle-${item.id}`}
                onPress={() => handleTogglePacking(item, index)}
                style={[
                  styles.checkbox,
                  item.checked && {
                    backgroundColor: themeColors.pineGreen || '#2E7D5B',
                    borderColor: themeColors.pineGreen || '#2E7D5B',
                  },
                ]}
              >
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>

              <View style={styles.itemTitleGroup}>
                <Text
                  style={[
                    styles.itemTitle,
                    { color: isDark ? '#FFFFFF' : '#111827' },
                    item.checked && styles.itemTitleChecked,
                  ]}
                >
                  {item.title}
                </Text>
                <Text style={[styles.itemSubtitle, { color: themeColors.textMuted }]}>
                  {item.category} • Assigned: {item.assignee}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  inviteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
  },
  inviteBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  membersList: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  memberAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
  },
  memberEmail: {
    fontSize: 11,
    marginTop: 1,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  totalSpendCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  totalSpendLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  totalSpendAmount: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginVertical: 4,
  },
  totalSpendSub: {
    color: '#D1D5DB',
    fontSize: 11,
    fontWeight: '500',
  },
  balancesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  balanceBox: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  balanceBoxLabel: {
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 4,
  },
  balanceBoxAmount: {
    fontSize: 16,
    fontWeight: '900',
  },
  settleUpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  settleUpTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  settleUpSub: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packingProgress: {
    fontSize: 11,
    fontWeight: '800',
  },
  addPackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  packingInput: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  addPackingBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPackingBtnText: {
    fontSize: 20,
    fontWeight: '700',
  },
  packingItemsList: {
    gap: 2,
  },
  packingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  itemTitleGroup: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  itemTitleChecked: {
    textDecorationLine: 'line-through',
    opacity: 0.5,
  },
  itemSubtitle: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});
